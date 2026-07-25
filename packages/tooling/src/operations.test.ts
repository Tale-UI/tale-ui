import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  access,
  chmod,
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { hostname, tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { TaleToolingError } from './contracts/errors.js';
import {
  applyProjectMutation,
  doctorProject,
  planProjectMutation,
  recoverProjectOperation,
} from './operations.js';

async function fixture() {
  return mkdtemp(join(tmpdir(), 'tale-operations-'));
}

function hostDigest() {
  return `sha256:${createHash('sha256').update(hostname()).digest('hex')}`;
}

test('project mutation plans, applies, and terminally replays without rewriting', async () => {
  const root = await fixture();
  try {
    const request = {
      schemaVersion: '1.0.0' as const,
      requestId: 'request-1',
      root,
      operation: 'generate' as const,
      idempotencyKey: 'stable-key',
      files: [{ path: 'src/example.ts', content: 'export const value = 1;\n' }],
    };
    const plan = await planProjectMutation(request);
    assert.equal(plan.files[0]?.action, 'create');
    const result = await applyProjectMutation(request);
    assert.equal(result.state, 'completed');
    assert.equal(result.replayed, false);
    assert.equal(await readFile(join(root, 'src/example.ts'), 'utf8'), request.files[0]?.content);
    const replay = await applyProjectMutation({ ...request, requestId: 'request-2' });
    assert.equal(replay.operationId, result.operationId);
    assert.equal(replay.replayed, true);
    assert.equal((await doctorProject(root)).healthy, true);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('doctor is strictly read-only when no operation store exists', async () => {
  const root = await fixture();
  try {
    assert.equal((await doctorProject(root)).healthy, true);
    await assert.rejects(() => access(join(root, '.tale')));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('project mutation refuses traversal, symlinks, overwrite, and idempotency conflicts', async () => {
  const root = await fixture();
  const outside = await fixture();
  try {
    await writeFile(join(root, 'existing.txt'), 'before');
    await symlink(outside, join(root, 'linked'));
    const base = {
      schemaVersion: '1.0.0' as const,
      requestId: 'request',
      root,
      operation: 'template-add' as const,
      idempotencyKey: 'key',
    };
    await assert.rejects(
      () =>
        applyProjectMutation({
          ...base,
          files: [{ path: '../outside.txt', content: 'unsafe' }],
        }),
      (error) => error instanceof TaleToolingError && error.code === 'TALE_UNSAFE_PATH',
    );
    await assert.rejects(
      () =>
        applyProjectMutation({
          ...base,
          files: [{ path: 'linked/file.txt', content: 'unsafe' }],
        }),
      (error) => error instanceof TaleToolingError && error.code === 'TALE_SYMLINK_REFUSED',
    );
    await assert.rejects(
      () =>
        applyProjectMutation({
          ...base,
          files: [{ path: 'existing.txt', content: 'after' }],
        }),
      (error) => error instanceof TaleToolingError && error.code === 'TALE_TEMPLATE_CONFLICT',
    );
    await applyProjectMutation({
      ...base,
      idempotencyKey: 'different-slot',
      files: [{ path: 'created.txt', content: 'first' }],
    });
    await assert.rejects(
      () =>
        applyProjectMutation({
          ...base,
          requestId: 'request-2',
          idempotencyKey: 'different-slot',
          files: [{ path: 'created.txt', content: 'second', overwrite: true }],
        }),
      (error) => error instanceof TaleToolingError && error.code === 'TALE_IDEMPOTENCY_CONFLICT',
    );
  } finally {
    await rm(root, { recursive: true, force: true });
    await rm(outside, { recursive: true, force: true });
  }
});

test('project mutation refuses corrupt idempotency state instead of replacing it', async () => {
  const root = await fixture();
  try {
    const request = {
      schemaVersion: '1.0.0' as const,
      requestId: 'request',
      root,
      operation: 'generate' as const,
      idempotencyKey: 'corrupt-slot',
      files: [{ path: 'created.txt', content: 'first' }],
    };
    const result = await applyProjectMutation(request);
    const slot = (await readdir(join(root, '.tale/operations/slots')))[0];
    await writeFile(join(root, '.tale/operations/slots', slot!), '{not-json');
    await assert.rejects(
      () => applyProjectMutation({ ...request, requestId: 'request-2' }),
      (error) => error instanceof TaleToolingError && error.code === 'TALE_CORRUPT_OPERATION_STATE',
    );
    assert.equal(await readFile(join(root, 'created.txt'), 'utf8'), 'first');
    assert.ok(result.operationId);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('doctor identifies interrupted state and rollback restores verified preimages', async () => {
  const root = await fixture();
  try {
    await writeFile(join(root, 'existing.txt'), 'before');
    const result = await applyProjectMutation({
      schemaVersion: '1.0.0',
      requestId: 'request',
      root,
      operation: 'upgrade',
      idempotencyKey: 'rollback-key',
      files: [{ path: 'existing.txt', content: 'after', overwrite: true }],
    });
    const journalPath = join(root, '.tale/operations', result.operationId, 'journal.json');
    const journal = JSON.parse(await readFile(journalPath, 'utf8'));
    journal.state = 'in-progress';
    await writeFile(journalPath, `${JSON.stringify(journal, null, 2)}\n`);
    const diagnosis = await doctorProject(root);
    assert.deepEqual(diagnosis.blockedOperationIds, [result.operationId]);
    assert.equal(diagnosis.operations[0]?.postimagesVerified, true);
    assert.equal(
      diagnosis.operations[0]?.evidenceExportPath,
      `.tale/operations/${result.operationId}/journal.json`,
    );
    await assert.rejects(
      () =>
        applyProjectMutation({
          schemaVersion: '1.0.0',
          requestId: 'blocked-request',
          root,
          operation: 'generate',
          idempotencyKey: 'blocked-key',
          files: [{ path: 'blocked.txt', content: 'blocked' }],
        }),
      (error) => error instanceof TaleToolingError && error.code === 'TALE_OPERATION_IN_PROGRESS',
    );
    const recovery = await recoverProjectOperation({
      schemaVersion: '1.0.0',
      requestId: 'recovery',
      root,
      operationId: result.operationId,
      action: 'rollback',
    });
    assert.equal(recovery.state, 'rolled-back');
    assert.equal(await readFile(join(root, 'existing.txt'), 'utf8'), 'before');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('explicit recovery can assume the matching interrupted root lock', async () => {
  const root = await fixture();
  try {
    const result = await applyProjectMutation({
      schemaVersion: '1.0.0',
      requestId: 'request',
      root,
      operation: 'generate',
      idempotencyKey: 'interrupted-lock',
      files: [{ path: 'created.txt', content: 'created' }],
    });
    const operationRoot = join(root, '.tale/operations', result.operationId);
    const journalPath = join(operationRoot, 'journal.json');
    const journal = JSON.parse(await readFile(journalPath, 'utf8'));
    journal.state = 'in-progress';
    await writeFile(journalPath, `${JSON.stringify(journal, null, 2)}\n`);
    const lock = join(root, '.tale/operations/.lock');
    await mkdir(lock);
    await writeFile(
      join(lock, 'owner.json'),
      `${JSON.stringify(
        {
          operationId: result.operationId,
          rootDigest: journal.rootDigest,
          processId: 2 ** 30,
          hostDigest: hostDigest(),
          startedAt: '2026-01-01T00:00:00.000Z',
        },
        null,
        2,
      )}\n`,
    );
    const diagnosis = await doctorProject(root);
    assert.equal(diagnosis.lock.operationId, result.operationId);
    assert.deepEqual(diagnosis.blockedOperationIds, [result.operationId]);
    const recovery = await recoverProjectOperation({
      schemaVersion: '1.0.0',
      requestId: 'recovery',
      root,
      operationId: result.operationId,
      action: 'rollback',
    });
    assert.equal(recovery.state, 'rolled-back');
    await assert.rejects(() => access(lock));
    await assert.rejects(() => access(join(root, 'created.txt')));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('recovery refuses to take over a matching live root lock', async () => {
  const root = await fixture();
  try {
    const result = await applyProjectMutation({
      schemaVersion: '1.0.0',
      requestId: 'request',
      root,
      operation: 'generate',
      idempotencyKey: 'live-lock',
      files: [{ path: 'created.txt', content: 'created' }],
    });
    const operationRoot = join(root, '.tale/operations', result.operationId);
    const journalPath = join(operationRoot, 'journal.json');
    const journal = JSON.parse(await readFile(journalPath, 'utf8'));
    journal.state = 'in-progress';
    await writeFile(journalPath, `${JSON.stringify(journal, null, 2)}\n`);
    const lock = join(root, '.tale/operations/.lock');
    await mkdir(lock);
    const owner = {
      operationId: result.operationId,
      rootDigest: journal.rootDigest,
      processId: process.pid,
      hostDigest: hostDigest(),
      startedAt: new Date().toISOString(),
    };
    await writeFile(join(lock, 'owner.json'), `${JSON.stringify(owner, null, 2)}\n`);

    await assert.rejects(
      () =>
        recoverProjectOperation({
          schemaVersion: '1.0.0',
          requestId: 'recovery',
          root,
          operationId: result.operationId,
          action: 'rollback',
        }),
      (error) => error instanceof TaleToolingError && error.code === 'TALE_CONCURRENT_MUTATION',
    );
    assert.deepEqual(JSON.parse(await readFile(join(lock, 'owner.json'), 'utf8')), owner);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('rollback accepts original preimages before backups exist and for no-op files', async () => {
  const root = await fixture();
  try {
    await writeFile(join(root, 'changed.txt'), 'before');
    await writeFile(join(root, 'unchanged.txt'), 'same');
    const result = await applyProjectMutation({
      schemaVersion: '1.0.0',
      requestId: 'request',
      root,
      operation: 'upgrade',
      idempotencyKey: 'pre-backup',
      files: [
        { path: 'changed.txt', content: 'after', overwrite: true },
        { path: 'unchanged.txt', content: 'same', overwrite: true },
      ],
    });
    const operationRoot = join(root, '.tale/operations', result.operationId);
    const journalPath = join(operationRoot, 'journal.json');
    const planPath = join(operationRoot, 'plan.json');
    const journal = JSON.parse(await readFile(journalPath, 'utf8'));
    const plan = JSON.parse(await readFile(planPath, 'utf8'));
    journal.state = 'journal-linked';
    delete plan.files[0].backup;
    await writeFile(join(root, 'changed.txt'), 'before');
    await writeFile(journalPath, `${JSON.stringify(journal, null, 2)}\n`);
    await writeFile(planPath, `${JSON.stringify(plan, null, 2)}\n`);

    const recovery = await recoverProjectOperation({
      schemaVersion: '1.0.0',
      requestId: 'recovery',
      root,
      operationId: result.operationId,
      action: 'rollback',
    });
    assert.equal(recovery.state, 'rolled-back');
    assert.equal(await readFile(join(root, 'changed.txt'), 'utf8'), 'before');
    assert.equal(await readFile(join(root, 'unchanged.txt'), 'utf8'), 'same');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('updates and rollback preserve executable file permissions', async () => {
  const root = await fixture();
  try {
    const executable = join(root, 'script.mjs');
    await writeFile(executable, '#!/usr/bin/env node\nconsole.log("before");\n');
    await chmod(executable, 0o755);
    const result = await applyProjectMutation({
      schemaVersion: '1.0.0',
      requestId: 'request',
      root,
      operation: 'upgrade',
      idempotencyKey: 'executable-mode',
      files: [
        {
          path: 'script.mjs',
          content: '#!/usr/bin/env node\nconsole.log("after");\n',
          overwrite: true,
        },
      ],
    });
    // eslint-disable-next-line no-bitwise -- POSIX permission bits are encoded as a bitmask.
    assert.equal((await stat(executable)).mode & 0o777, 0o755);
    const journalPath = join(root, '.tale/operations', result.operationId, 'journal.json');
    const journal = JSON.parse(await readFile(journalPath, 'utf8'));
    journal.state = 'in-progress';
    await writeFile(journalPath, `${JSON.stringify(journal, null, 2)}\n`);

    await recoverProjectOperation({
      schemaVersion: '1.0.0',
      requestId: 'recovery',
      root,
      operationId: result.operationId,
      action: 'rollback',
    });
    assert.match(await readFile(executable, 'utf8'), /before/);
    // eslint-disable-next-line no-bitwise -- POSIX permission bits are encoded as a bitmask.
    assert.equal((await stat(executable)).mode & 0o777, 0o755);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('root-wide lock rejects concurrent mutation', async () => {
  const root = await fixture();
  try {
    await mkdir(join(root, '.tale/operations/.lock'), { recursive: true });
    await assert.rejects(
      () =>
        applyProjectMutation({
          schemaVersion: '1.0.0',
          requestId: 'request',
          root,
          operation: 'generate',
          idempotencyKey: 'key',
          files: [{ path: 'file.txt', content: 'value' }],
        }),
      (error) => error instanceof TaleToolingError && error.code === 'TALE_CONCURRENT_MUTATION',
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
