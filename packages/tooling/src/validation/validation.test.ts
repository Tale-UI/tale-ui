import assert from 'node:assert/strict';
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import type { ValidationCodeRequest } from '../contracts/validation.js';
import { TaleToolingError } from '../contracts/errors.js';
import { validateRequestCore } from './core.js';
import { validateCode } from './index.js';

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'tale-validation-'));
  mkdirSync(join(root, 'src'));
  return root;
}

function request(root: string, code: string): ValidationCodeRequest {
  return {
    schemaVersion: '1.0.0',
    requestId: 'request-1',
    root,
    code,
    virtualFile: 'src/example.ts',
    timeoutMs: 10_000,
  };
}

test('compiler API validates virtual code without project writes', () => {
  const root = fixture();
  try {
    const valid = validateRequestCore(request(root, 'export const answer: number = 42;'));
    assert.equal(valid.valid, true);
    assert.equal(valid.fallbackConfig, true);
    assert.equal(valid.versions.typescript, '5.9.3');
    assert.equal(valid.diagnostics.length, 0);
    assert.equal(existsSync(join(root, 'src/example.ts')), false);

    const invalid = validateRequestCore(request(root, 'export const answer: string = 42;'));
    assert.equal(invalid.valid, false);
    assert.ok(invalid.diagnostics.some((diagnostic) => diagnostic.code === 2322));
    assert.equal(JSON.stringify(invalid).includes(root), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('registry rules reject unknown imports and compound bare usage', () => {
  const root = fixture();
  try {
    const unknown = validateRequestCore({
      ...request(root, "import { Missing } from '@tale-ui/react/not-real';"),
      rules: ['registry'],
    });
    assert.equal(unknown.valid, false);
    assert.ok(unknown.diagnostics.some((diagnostic) => diagnostic.code === 'TALE_INVALID_IMPORT'));

    const compound = validateRequestCore({
      ...request(
        root,
        "import { Dialog } from '@tale-ui/react/dialog';\nexport const value = <Dialog />;",
      ),
      virtualFile: 'src/example.tsx',
      rules: ['registry'],
    });
    assert.equal(compound.valid, false);
    assert.ok(
      compound.diagnostics.some((diagnostic) => diagnostic.code === 'TALE_WRONG_COMPONENT_KIND'),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('validation rejects traversal and malformed project configuration', () => {
  const root = fixture();
  try {
    assert.throws(
      () => validateRequestCore({ ...request(root, ''), virtualFile: '../outside.ts' }),
      (error) => error instanceof TaleToolingError && error.code === 'TALE_UNSAFE_PATH',
    );
    writeFileSync(join(root, 'tsconfig.json'), '{invalid json');
    assert.throws(
      () => validateRequestCore(request(root, 'export const value = true;')),
      (error) => error instanceof TaleToolingError && error.code === 'TALE_INVALID_TSCONFIG',
    );
    writeFileSync(
      join(root, 'tsconfig.json'),
      JSON.stringify({ compilerOptions: { baseUrl: '..' } }),
    );
    assert.throws(
      () => validateRequestCore(request(root, 'export const value = true;')),
      (error) => error instanceof TaleToolingError && error.code === 'TALE_INVALID_TSCONFIG',
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('compiler resolution cannot read relative imports outside the project', () => {
  const parent = mkdtempSync(join(tmpdir(), 'tale-validation-boundary-'));
  const root = join(parent, 'project');
  mkdirSync(join(root, 'src'), { recursive: true });
  writeFileSync(join(parent, 'outside.ts'), 'export const secret = true;');
  try {
    const result = validateRequestCore(
      request(
        root,
        "import { secret } from '../../outside';\nexport const exposed: boolean = secret;",
      ),
    );
    assert.equal(result.valid, false);
    assert.ok(result.diagnostics.some((diagnostic) => diagnostic.code === 2307));
    assert.equal(JSON.stringify(result).includes(parent), false);
  } finally {
    rmSync(parent, { recursive: true, force: true });
  }
});

test('file validation reads UTF-8 without modifying the target', () => {
  const root = fixture();
  const file = join(root, 'src/example.ts');
  try {
    const source = 'export const value: boolean = true;';
    writeFileSync(file, source);
    const result = validateRequestCore({
      schemaVersion: '1.0.0',
      requestId: 'file-request',
      root,
      file: 'src/example.ts',
      timeoutMs: 10_000,
    });
    assert.equal(result.valid, true);
    assert.equal(readFileSync(file, 'utf8'), source);

    writeFileSync(file, Buffer.from([0xc3, 0x28]));
    assert.throws(
      () =>
        validateRequestCore({
          schemaVersion: '1.0.0',
          requestId: 'invalid-utf8',
          root,
          file: 'src/example.ts',
          timeoutMs: 10_000,
        }),
      (error) => error instanceof TaleToolingError && error.code === 'TALE_INVALID_ARGUMENT',
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test(
  'file validation rejects symlinks escaping the project',
  { skip: process.platform === 'win32' },
  () => {
    const root = fixture();
    const outside = fixture();
    try {
      writeFileSync(join(outside, 'outside.ts'), 'export const outside = true;');
      symlinkSync(join(outside, 'outside.ts'), join(root, 'src/link.ts'));
      assert.throws(
        () =>
          validateRequestCore({
            schemaVersion: '1.0.0',
            requestId: 'symlink-request',
            root,
            file: 'src/link.ts',
            timeoutMs: 10_000,
          }),
        (error) => error instanceof TaleToolingError && error.code === 'TALE_SYMLINK_REFUSED',
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
      rmSync(outside, { recursive: true, force: true });
    }
  },
);

test('public validation honors pre-aborted cancellation', async () => {
  const root = fixture();
  const controller = new AbortController();
  controller.abort();
  try {
    await assert.rejects(
      validateCode(request(root, 'export const value = true;'), {
        signal: controller.signal,
      }),
      (error) => error instanceof TaleToolingError && error.code === 'TALE_VALIDATION_CANCELLED',
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
