import assert from 'node:assert/strict';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import {
  assertGateBPerformanceProtection,
  BUNDLE_2_COMPONENT_PERFORMANCE_PATHS,
  BUNDLE_2_COMPONENT_PERFORMANCE_SCRIPTS,
  GATE_B_PROTECTED_PERFORMANCE_FILES,
  LEGACY_PERFORMANCE_CHECK,
} from './gate-b-performance-protection.mjs';

const REPOSITORY_ROOT = resolve(import.meta.dirname, '..');

function fixtureRoot(t) {
  const root = mkdtempSync(join(tmpdir(), 'tale-gate-b-performance-'));
  t.after(() => rmSync(root, { force: true, recursive: true }));
  for (const path of Object.keys(GATE_B_PROTECTED_PERFORMANCE_FILES)) {
    const output = join(root, path);
    mkdirSync(dirname(output), { recursive: true });
    copyFileSync(join(REPOSITORY_ROOT, path), output);
  }
  mkdirSync(join(root, '.github/workflows'), { recursive: true });
  writeFileSync(
    join(root, '.github/workflows/ci.yml'),
    'jobs:\n  performance:\n    steps:\n      - run: pnpm performance:check\n',
  );
  writeFileSync(
    join(root, 'package.json'),
    `${JSON.stringify(
      {
        scripts: {
          'performance:check': LEGACY_PERFORMANCE_CHECK,
          'performance:capture': 'tsx tools/benchmark-roadmap-performance.tsx --capture',
        },
      },
      null,
      2,
    )}\n`,
  );
  return root;
}

function installBundle2Bootstrap(root) {
  for (const path of BUNDLE_2_COMPONENT_PERFORMANCE_PATHS) {
    if (path === 'tools/performance-fixtures/component-expansion') {
      mkdirSync(join(root, path), { recursive: true });
      continue;
    }
    const output = join(root, path);
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, 'bootstrap\n');
  }
  writeFileSync(
    join(root, 'package.json'),
    `${JSON.stringify(
      {
        scripts: {
          'performance:capture': 'tsx tools/benchmark-roadmap-performance.tsx --capture',
          ...BUNDLE_2_COMPONENT_PERFORMANCE_SCRIPTS,
        },
      },
      null,
      2,
    )}\n`,
  );
}

test('accepts the repository protected performance state', () => {
  assert.doesNotThrow(() => assertGateBPerformanceProtection(REPOSITORY_ROOT));
});

test('freezes the protected legacy performance hashes', () => {
  assert.deepEqual(GATE_B_PROTECTED_PERFORMANCE_FILES, {
    'schemas/performance-budget.schema.json':
      '93629617f71a0ded302562e6f390c4c87675a46be41bdc1c5df07991f5775143',
    'test/baselines/roadmap/performance-budgets.json':
      'f066eb6350865582b130d561cbeb43ae2a173409ebb01ae108d94d5252c03c8d',
    'tools/benchmark-roadmap-performance.tsx':
      '915e83817ddb531cb428986bfeb71e76508f80ec91d7405ebcc5ec90e25d9374',
  });
});

test('accepts the exact pre-Bundle-2 protected performance state', (t) => {
  assert.doesNotThrow(() => assertGateBPerformanceProtection(fixtureRoot(t)));
});

test('accepts the complete Bundle 2 bootstrap and exact scripts', (t) => {
  const root = fixtureRoot(t);
  installBundle2Bootstrap(root);
  assert.doesNotThrow(() => assertGateBPerformanceProtection(root));
});

test('rejects any byte change to a protected legacy file', (t) => {
  const root = fixtureRoot(t);
  writeFileSync(join(root, 'schemas/performance-budget.schema.json'), '{}\n');
  assert.throws(
    () => assertGateBPerformanceProtection(root),
    /preserve schemas\/performance-budget\.schema\.json byte-for-byte/,
  );
});

test('rejects partial component-performance bootstrap paths', (t) => {
  const root = fixtureRoot(t);
  const bootstrap = join(root, 'tools/benchmark-component-performance.tsx');
  mkdirSync(dirname(bootstrap), { recursive: true });
  writeFileSync(bootstrap, 'export {};\n');
  assert.throws(
    () => assertGateBPerformanceProtection(root),
    /bootstrap paths must appear atomically/,
  );
});

test('rejects component-performance scripts before Bundle 2', (t) => {
  const root = fixtureRoot(t);
  writeFileSync(
    join(root, 'package.json'),
    `{"scripts":{"performance:check":${JSON.stringify(LEGACY_PERFORMANCE_CHECK)},"performance:components:check":"node check.mjs"}}\n`,
  );
  assert.throws(
    () => assertGateBPerformanceProtection(root),
    /Component-performance script is forbidden before Bundle 2/,
  );
});

test('rejects redirecting performance:check before Bundle 2', (t) => {
  const root = fixtureRoot(t);
  writeFileSync(
    join(root, 'package.json'),
    '{"scripts":{"performance:check":"tsx tools/benchmark-component-performance.tsx"}}\n',
  );
  assert.throws(
    () => assertGateBPerformanceProtection(root),
    /performance:check must remain the legacy read-only runner before Bundle 2/,
  );
});

test('rejects partial and inexact Bundle 2 scripts', (t) => {
  const root = fixtureRoot(t);
  installBundle2Bootstrap(root);
  const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  delete manifest.scripts['performance:components:check'];
  writeFileSync(join(root, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  assert.throws(
    () => assertGateBPerformanceProtection(root),
    /script must be exact: performance:components:check/,
  );

  manifest.scripts['performance:components:check'] =
    'tsx tools/benchmark-component-performance.tsx --capture';
  writeFileSync(join(root, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  assert.throws(
    () => assertGateBPerformanceProtection(root),
    /script must be exact: performance:components:check/,
  );
});

test('rejects capture commands in CI workflows', (t) => {
  const root = fixtureRoot(t);
  writeFileSync(
    join(root, '.github/workflows/ci.yml'),
    'jobs:\n  capture:\n    steps:\n      - run: pnpm performance:capture\n',
  );
  assert.throws(
    () => assertGateBPerformanceProtection(root),
    /must not invoke baseline capture commands/,
  );
});
