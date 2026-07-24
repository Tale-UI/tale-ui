import { createHash, randomUUID } from 'node:crypto';
import {
  constants,
  lstat,
  mkdir,
  open,
  readFile,
  readdir,
  realpath,
  rename,
  rm,
  stat,
} from 'node:fs/promises';
import { hostname } from 'node:os';
import { basename, dirname, isAbsolute, join, normalize, relative, resolve, sep } from 'node:path';
import type {
  ProjectDoctorResult,
  ProjectMutationFile,
  ProjectMutationFileReport,
  ProjectMutationPlan,
  ProjectMutationRequest,
  ProjectMutationResult,
  ProjectRecoveryRequest,
} from './contracts/operations.js';
import { TaleToolingError } from './contracts/errors.js';

const STORE_PATH = '.tale/operations';
const JOURNAL_FILE = 'journal.json';
const PLAN_FILE = 'plan.json';
const RECOVERY_FILE = 'recovery.json';
const LOCK_PATH = '.lock';

interface StoredPlanFile extends ProjectMutationFile {
  path: string;
  originalExists: boolean;
  originalDigest: `sha256:${string}`;
  postimageDigest: `sha256:${string}`;
  postimageSize: number;
  backup?: string;
}

interface StoredPlan {
  schemaVersion: '1.0.0';
  requestId: string;
  operationId: string;
  planDigest: `sha256:${string}`;
  payloadDigest: `sha256:${string}`;
  files: StoredPlanFile[];
}

interface OperationJournal {
  schemaVersion: '1.0.0';
  operationId: string;
  operation: ProjectMutationRequest['operation'];
  rootDigest: `sha256:${string}`;
  idempotencyDigest: `sha256:${string}`;
  payloadDigest: `sha256:${string}`;
  state:
    | 'reserved'
    | 'journal-linked'
    | 'in-progress'
    | 'completed'
    | 'rolled-back'
    | 'manual-intervention'
    | 'tombstoned';
  plannedPostimages: Array<{
    path: string;
    digest: `sha256:${string}`;
    size: number;
  }>;
}

interface Slot {
  operationId: string;
  payloadDigest: `sha256:${string}`;
}

interface LockOwner {
  operationId: string;
  rootDigest: `sha256:${string}`;
  processId: number;
  hostDigest: `sha256:${string}`;
  startedAt: string;
}

function digest(value: string): `sha256:${string}` {
  return `sha256:${createHash('sha256').update(value).digest('hex')}`;
}

function canonical(value: unknown) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function safeRelativePath(value: string) {
  const portable = value.replaceAll('\\', '/');
  const normalized = normalize(portable).replaceAll('\\', '/');
  if (
    !value ||
    isAbsolute(value) ||
    /^[A-Za-z]:/.test(value) ||
    normalized === '..' ||
    normalized.startsWith('../') ||
    normalized.startsWith('/') ||
    normalized === '.'
  ) {
    throw new TaleToolingError(
      'TALE_UNSAFE_PATH',
      'Tale UI: a project mutation target escaped the canonical project root.',
    );
  }
  return normalized;
}

async function canonicalRoot(input: string) {
  try {
    const root = await realpath(resolve(input));
    const details = await stat(root);
    if (!details.isDirectory()) {
      throw new Error('not a directory');
    }
    return root;
  } catch (error) {
    throw new TaleToolingError(
      'TALE_OUTSIDE_PROJECT_ROOT',
      'Tale UI: the requested project root does not resolve to an existing directory.',
      { cause: error },
    );
  }
}

async function targetPath(root: string, input: string) {
  const path = safeRelativePath(input);
  const target = resolve(root, path);
  if (target !== root && !target.startsWith(`${root}${sep}`)) {
    throw new TaleToolingError(
      'TALE_OUTSIDE_PROJECT_ROOT',
      'Tale UI: a project mutation target resolved outside the canonical project root.',
    );
  }

  const segments = path.split('/');
  let cursor = root;
  for (const segment of segments) {
    cursor = join(cursor, segment);
    try {
      const details = await lstat(cursor);
      if (details.isSymbolicLink()) {
        throw new TaleToolingError(
          'TALE_SYMLINK_REFUSED',
          'Tale UI: project mutations do not follow symbolic links.',
        );
      }
    } catch (error) {
      if (
        error instanceof TaleToolingError ||
        (error as NodeJS.ErrnoException).code !== 'ENOENT'
      ) {
        throw error;
      }
      break;
    }
  }
  return { path, target };
}

async function readExisting(target: string) {
  try {
    return { exists: true, content: await readFile(target, 'utf8') };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { exists: false, content: '' };
    }
    throw error;
  }
}

async function writeAtomic(path: string, content: string, mode = 0o600) {
  await mkdir(dirname(path), { recursive: true, mode: 0o700 });
  const temporary = join(dirname(path), `.${basename(path)}.${randomUUID()}.tmp`);
  const handle = await open(temporary, constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY, mode);
  try {
    await handle.writeFile(content, 'utf8');
    await handle.sync();
  } finally {
    await handle.close();
  }
  await rename(temporary, path);
}

async function readJson<T>(path: string): Promise<T> {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as T;
  } catch (error) {
    throw new TaleToolingError(
      'TALE_CORRUPT_OPERATION_STATE',
      'Tale UI: durable operation state is missing or malformed.',
      { cause: error },
    );
  }
}

async function operationStore(root: string) {
  const store = join(root, STORE_PATH);
  await mkdir(store, { recursive: true, mode: 0o700 });
  await mkdir(join(store, 'slots'), { recursive: true, mode: 0o700 });
  return store;
}

function operationStorePath(root: string) {
  return join(root, STORE_PATH);
}

async function pathExists(path: string) {
  try {
    await lstat(path);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

async function acquireLock(
  store: string,
  owner: {
    operationId: string;
    rootDigest: `sha256:${string}`;
  },
) {
  const lock = join(store, LOCK_PATH);
  try {
    await mkdir(lock, { mode: 0o700 });
    try {
      await writeAtomic(
        join(lock, 'owner.json'),
        canonical({
          operationId: owner.operationId,
          rootDigest: owner.rootDigest,
          processId: process.pid,
          hostDigest: digest(hostname()),
          startedAt: new Date().toISOString(),
        } satisfies LockOwner),
      );
    } catch (error) {
      await rm(lock, { recursive: true, force: true });
      throw error;
    }
    return async () => {
      await rm(lock, { recursive: true, force: true });
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EEXIST') {
      throw new TaleToolingError(
        'TALE_CONCURRENT_MUTATION',
        'Tale UI: another project mutation currently owns the root lock.',
        { retryable: true },
      );
    }
    throw error;
  }
}

async function acquireRecoveryLock(
  store: string,
  owner: {
    operationId: string;
    rootDigest: `sha256:${string}`;
  },
) {
  const lock = join(store, LOCK_PATH);
  if (!(await pathExists(lock))) {
    return acquireLock(store, owner);
  }
  const current = await readJson<LockOwner>(join(lock, 'owner.json'));
  if (
    current.operationId !== owner.operationId ||
    current.rootDigest !== owner.rootDigest
  ) {
    throw new TaleToolingError(
      'TALE_CONCURRENT_MUTATION',
      'Tale UI: the root lock belongs to a different operation and cannot be recovered.',
      { retryable: true },
    );
  }
  await writeAtomic(
    join(lock, 'owner.json'),
    canonical({
      ...current,
      processId: process.pid,
      hostDigest: digest(hostname()),
      startedAt: new Date().toISOString(),
    } satisfies LockOwner),
  );
  return async () => {
    await rm(lock, { recursive: true, force: true });
  };
}

async function operationIds(store: string) {
  return (await readdir(store, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && entry.name !== LOCK_PATH && entry.name !== 'slots')
    .map((entry) => entry.name)
    .sort();
}

async function assertNoBlockedOperation(store: string) {
  for (const operationId of await operationIds(store)) {
    const journal = await readJson<OperationJournal>(join(store, operationId, JOURNAL_FILE));
    if (!['completed', 'rolled-back', 'tombstoned'].includes(journal.state)) {
      throw new TaleToolingError(
        'TALE_OPERATION_IN_PROGRESS',
        'Tale UI: an incomplete operation blocks new project mutation; run doctor and recover it.',
        { retryable: true, details: { operationId } },
      );
    }
  }
}

async function buildStoredPlan(
  root: string,
  request: ProjectMutationRequest,
  operationId: string,
  payloadDigest: `sha256:${string}`,
): Promise<StoredPlan> {
  const seen = new Set<string>();
  const files: StoredPlanFile[] = [];
  for (const input of request.files) {
    const { path, target } = await targetPath(root, input.path);
    if (seen.has(path)) {
      throw new TaleToolingError(
        'TALE_INVALID_ARGUMENT',
        'Tale UI: a mutation plan cannot target the same file more than once.',
      );
    }
    seen.add(path);
    const existing = await readExisting(target);
    files.push({
      path,
      content: input.content.replace(/\r\n/g, '\n'),
      ...(input.overwrite ? { overwrite: true } : {}),
      originalExists: existing.exists,
      originalDigest: digest(existing.content),
      postimageDigest: digest(input.content.replace(/\r\n/g, '\n')),
      postimageSize: Buffer.byteLength(input.content.replace(/\r\n/g, '\n')),
    });
  }
  files.sort((left, right) => left.path.localeCompare(right.path, 'en'));
  const preimage = {
    schemaVersion: request.schemaVersion,
    requestId: request.requestId,
    operationId,
    payloadDigest,
    files: files.map(({ backup: _backup, ...file }) => file),
  };
  return { ...preimage, planDigest: digest(canonical(preimage)) };
}

function reportFor(plan: StoredPlan): ProjectMutationPlan {
  return {
    schemaVersion: '1.0.0',
    requestId: plan.requestId,
    planDigest: plan.planDigest,
    files: plan.files.map((file): ProjectMutationFileReport => {
      const action =
        file.originalDigest === file.postimageDigest
          ? 'no-op'
          : file.originalExists && !file.overwrite
            ? 'conflict'
            : file.originalExists
              ? 'update'
              : 'create';
      return {
        path: file.path,
        action,
        postimageDigest: file.postimageDigest,
        postimageSize: file.postimageSize,
      };
    }),
    warnings: [],
  };
}

function requestDigests(root: string, request: ProjectMutationRequest) {
  if (
    request.schemaVersion !== '1.0.0' ||
    !request.requestId ||
    !request.idempotencyKey ||
    request.files.length === 0
  ) {
    throw new TaleToolingError(
      'TALE_INVALID_ARGUMENT',
      'Tale UI: project mutation requires schema 1.0.0, request and idempotency identities, and at least one file.',
    );
  }
  const rootDigest = digest(root);
  const idempotencyDigest = digest(request.idempotencyKey);
  const payloadDigest = digest(
    canonical({
      operation: request.operation,
      files: request.files.map((file) => ({
        path: safeRelativePath(file.path),
        contentDigest: digest(file.content.replace(/\r\n/g, '\n')),
      })),
    }),
  );
  const operationId = digest(
    canonical({ rootDigest, operation: request.operation, idempotencyDigest }),
  ).slice('sha256:'.length, 'sha256:'.length + 32);
  return { rootDigest, idempotencyDigest, payloadDigest, operationId };
}

export async function planProjectMutation(
  request: ProjectMutationRequest,
): Promise<ProjectMutationPlan> {
  const root = await canonicalRoot(request.root);
  const { operationId, payloadDigest } = requestDigests(root, request);
  return reportFor(await buildStoredPlan(root, request, operationId, payloadDigest));
}

export async function readProjectFile(
  rootInput: string,
  pathInput: string,
): Promise<{ exists: boolean; content: string }> {
  const root = await canonicalRoot(rootInput);
  const { target } = await targetPath(root, pathInput);
  return readExisting(target);
}

async function persistJournal(operationPath: string, journal: OperationJournal) {
  await writeAtomic(join(operationPath, JOURNAL_FILE), canonical(journal));
}

async function applyStoredPlan(
  root: string,
  operationPath: string,
  journal: OperationJournal,
  plan: StoredPlan,
) {
  journal.state = 'in-progress';
  await persistJournal(operationPath, journal);
  const backupRoot = join(operationPath, 'backups');
  await mkdir(backupRoot, { recursive: true, mode: 0o700 });

  for (let index = 0; index < plan.files.length; index += 1) {
    const file = plan.files[index]!;
    const { target } = await targetPath(root, file.path);
    const existing = await readExisting(target);
    const existingDigest = digest(existing.content);
    if (
      existingDigest !== file.originalDigest &&
      existingDigest !== file.postimageDigest
    ) {
      journal.state = 'manual-intervention';
      await persistJournal(operationPath, journal);
      throw new TaleToolingError(
        'TALE_CHANGED_SINCE_PLAN',
        'Tale UI: a project file changed after planning, so mutation stopped before overwriting it.',
      );
    }
    if (existingDigest === file.postimageDigest) {
      continue;
    }
    if (file.originalExists) {
      const backup = `backups/${String(index).padStart(4, '0')}.txt`;
      await writeAtomic(join(operationPath, backup), existing.content);
      file.backup = backup;
      await writeAtomic(join(operationPath, PLAN_FILE), canonical(plan));
    }
    await writeAtomic(target, file.content, 0o644);
    const committed = await readExisting(target);
    if (!committed.exists || digest(committed.content) !== file.postimageDigest) {
      journal.state = 'manual-intervention';
      await persistJournal(operationPath, journal);
      throw new TaleToolingError(
        'TALE_UNVERIFIABLE_POSTIMAGE',
        'Tale UI: a committed project file did not match its planned postimage.',
      );
    }
  }
  journal.state = 'completed';
  await persistJournal(operationPath, journal);
  await writeAtomic(
    join(operationPath, 'tombstone.json'),
    canonical({
      operationId: journal.operationId,
      rootDigest: journal.rootDigest,
      idempotencyDigest: journal.idempotencyDigest,
      payloadDigest: journal.payloadDigest,
      state: journal.state,
    }),
  );
}

export async function applyProjectMutation(
  request: ProjectMutationRequest,
): Promise<ProjectMutationResult> {
  const root = await canonicalRoot(request.root);
  const { rootDigest, idempotencyDigest, payloadDigest, operationId } = requestDigests(
    root,
    request,
  );
  const store = await operationStore(root);
  const releaseLock = await acquireLock(store, { operationId, rootDigest });
  try {
    const operationPath = join(store, operationId);
    const slotPath = join(
      store,
      'slots',
      `${request.operation}-${idempotencyDigest.slice('sha256:'.length)}.json`,
    );
    if (await pathExists(slotPath)) {
      const slot = await readJson<Slot>(slotPath);
      if (slot.payloadDigest !== payloadDigest) {
        throw new TaleToolingError(
          'TALE_IDEMPOTENCY_CONFLICT',
          'Tale UI: the idempotency key was already used with a different mutation payload.',
        );
      }
      const journal = await readJson<OperationJournal>(join(store, slot.operationId, JOURNAL_FILE));
      const plan = await readJson<StoredPlan>(join(store, slot.operationId, PLAN_FILE));
      if (journal.state === 'completed' || journal.state === 'rolled-back') {
        return {
          ...reportFor(plan),
          operationId: journal.operationId,
          state: journal.state,
          replayed: true,
        };
      }
      throw new TaleToolingError(
        'TALE_OPERATION_IN_PROGRESS',
        'Tale UI: the matching operation is incomplete; run doctor and recover it.',
        { retryable: true },
      );
    }
    await assertNoBlockedOperation(store);

    const plan = await buildStoredPlan(root, request, operationId, payloadDigest);
    const report = reportFor(plan);
    if (report.files.some((file) => file.action === 'conflict')) {
      throw new TaleToolingError(
        request.operation === 'template-add' ? 'TALE_TEMPLATE_CONFLICT' : 'TALE_OVERWRITE_REFUSED',
        'Tale UI: mutation would replace an existing non-equivalent file without authorization.',
      );
    }

    await mkdir(operationPath, { recursive: false, mode: 0o700 });
    const journal: OperationJournal = {
      schemaVersion: '1.0.0',
      operationId,
      operation: request.operation,
      rootDigest,
      idempotencyDigest,
      payloadDigest,
      state: 'reserved',
      plannedPostimages: plan.files.map((file) => ({
        path: file.path,
        digest: file.postimageDigest,
        size: file.postimageSize,
      })),
    };
    await persistJournal(operationPath, journal);
    await writeAtomic(join(operationPath, PLAN_FILE), canonical(plan));
    await writeAtomic(slotPath, canonical({ operationId, payloadDigest } satisfies Slot));
    journal.state = 'journal-linked';
    await persistJournal(operationPath, journal);
    await applyStoredPlan(root, operationPath, journal, plan);
    return { ...report, operationId, state: 'completed', replayed: false };
  } finally {
    await releaseLock();
  }
}

export async function doctorProject(rootInput: string): Promise<ProjectDoctorResult> {
  const root = await canonicalRoot(rootInput);
  const store = operationStorePath(root);
  if (!(await pathExists(store))) {
    return {
      schemaVersion: '1.0.0',
      healthy: true,
      blockedOperationIds: [],
      manualInterventionOperationIds: [],
      lock: { present: false },
      operations: [],
      recoverable: [],
    };
  }
  const lockPath = join(store, LOCK_PATH);
  const lockPresent = await pathExists(lockPath);
  let lockOperationId: string | undefined;
  if (lockPresent) {
    try {
      lockOperationId = (await readJson<LockOwner>(join(lockPath, 'owner.json'))).operationId;
    } catch {
      lockOperationId = undefined;
    }
  }
  const blockedOperationIds: string[] = [];
  const manualInterventionOperationIds: string[] = [];
  const operations: ProjectDoctorResult['operations'] = [];
  const recoverable: ProjectDoctorResult['recoverable'] = [];
  for (const operationId of await operationIds(store)) {
    const journal = await readJson<OperationJournal>(join(store, operationId, JOURNAL_FILE));
    let postimagesVerified = true;
    for (const postimage of journal.plannedPostimages) {
      try {
        const { target } = await targetPath(root, postimage.path);
        const existing = await readExisting(target);
        if (
          !existing.exists ||
          digest(existing.content) !== postimage.digest ||
          Buffer.byteLength(existing.content) !== postimage.size
        ) {
          postimagesVerified = false;
        }
      } catch {
        postimagesVerified = false;
      }
    }
    operations.push({
      operationId,
      state: journal.state,
      postimagesVerified,
      evidenceExportPath: `${STORE_PATH}/${operationId}/${JOURNAL_FILE}`,
    });
    if (!['completed', 'rolled-back', 'tombstoned'].includes(journal.state)) {
      blockedOperationIds.push(operationId);
      if (journal.state === 'manual-intervention') {
        manualInterventionOperationIds.push(operationId);
      } else {
        recoverable.push({ operationId, actions: ['resume', 'rollback'] });
      }
    }
  }
  if (lockPresent && lockOperationId && !blockedOperationIds.includes(lockOperationId)) {
    blockedOperationIds.push(lockOperationId);
  }
  if (lockPresent && !lockOperationId) {
    manualInterventionOperationIds.push('unknown-lock-owner');
  }
  blockedOperationIds.sort();
  return {
    schemaVersion: '1.0.0',
    healthy:
      blockedOperationIds.length === 0 &&
      manualInterventionOperationIds.length === 0,
    blockedOperationIds,
    manualInterventionOperationIds,
    lock: {
      present: lockPresent,
      ...(lockOperationId ? { operationId: lockOperationId } : {}),
    },
    operations,
    recoverable,
  };
}

async function rollbackStoredPlan(
  root: string,
  operationPath: string,
  journal: OperationJournal,
  plan: StoredPlan,
) {
  for (const file of [...plan.files].reverse()) {
    const { target } = await targetPath(root, file.path);
    const existing = await readExisting(target);
    const currentDigest = digest(existing.content);
    if (
      existing.exists &&
      currentDigest !== file.postimageDigest &&
      currentDigest !== file.originalDigest
    ) {
      journal.state = 'manual-intervention';
      await persistJournal(operationPath, journal);
      throw new TaleToolingError(
        'TALE_RECOVERY_PRECONDITION_FAILED',
        'Tale UI: rollback stopped because a project file no longer matches the operation.',
      );
    }
    if (file.originalExists) {
      if (!file.backup) {
        throw new TaleToolingError(
          'TALE_CORRUPT_OPERATION_STATE',
          'Tale UI: rollback metadata is missing its required backup.',
        );
      }
      await writeAtomic(target, await readFile(join(operationPath, file.backup), 'utf8'), 0o644);
    } else if (existing.exists) {
      await rm(target);
    }
  }
  journal.state = 'rolled-back';
  await persistJournal(operationPath, journal);
}

export async function recoverProjectOperation(
  request: ProjectRecoveryRequest,
): Promise<ProjectMutationResult> {
  if (request.schemaVersion !== '1.0.0' || !request.operationId) {
    throw new TaleToolingError(
      'TALE_INVALID_ARGUMENT',
      'Tale UI: recovery requires schema 1.0.0 and an operation identity.',
    );
  }
  const root = await canonicalRoot(request.root);
  const store = await operationStore(root);
  const operationPath = join(store, safeRelativePath(request.operationId));
  const journal = await readJson<OperationJournal>(join(operationPath, JOURNAL_FILE));
  const releaseLock = await acquireRecoveryLock(store, {
    operationId: request.operationId,
    rootDigest: journal.rootDigest,
  });
  try {
    const plan = await readJson<StoredPlan>(join(operationPath, PLAN_FILE));
    if (journal.operationId !== request.operationId) {
      throw new TaleToolingError(
        'TALE_CORRUPT_OPERATION_STATE',
        'Tale UI: recovery identity does not match the stored operation.',
      );
    }
    if (journal.state === 'completed' || journal.state === 'rolled-back') {
      return {
        ...reportFor(plan),
        operationId: journal.operationId,
        state: journal.state,
        replayed: true,
      };
    }
    if (journal.state === 'manual-intervention') {
      throw new TaleToolingError(
        'TALE_RECOVERY_PRECONDITION_FAILED',
        'Tale UI: this operation requires manual repair before recovery can continue.',
      );
    }
    await writeAtomic(
      join(operationPath, RECOVERY_FILE),
      canonical({
        schemaVersion: '1.0.0',
        recoveryId: digest(`${request.requestId}:${request.action}`),
        operationId: request.operationId,
        journalDigest: digest(canonical(journal)),
        action: request.action,
        recoveryDigest: digest(canonical(request)),
        preRecoveryDigest: digest(canonical(plan.files.map((file) => file.originalDigest))),
      }),
    );
    if (request.action === 'resume') {
      await applyStoredPlan(root, operationPath, journal, plan);
    } else {
      await rollbackStoredPlan(root, operationPath, journal, plan);
    }
    return {
      ...reportFor(plan),
      operationId: journal.operationId,
      state: journal.state as 'completed' | 'rolled-back',
      replayed: false,
    };
  } finally {
    await releaseLock();
  }
}
