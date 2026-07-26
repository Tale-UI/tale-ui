import assert from 'node:assert/strict';
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import {
  assertGateBPerformanceProtection,
  GATE_B_PROTECTED_PERFORMANCE_FILES,
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
          'performance:check': 'tsx tools/benchmark-roadmap-performance.tsx',
          'performance:capture': 'tsx tools/benchmark-roadmap-performance.tsx --capture',
        },
      },
      null,
      2,
    )}\n`,
  );
  return root;
}

test('accepts the exact protected Gate B performance state', () => {
  assert.doesNotThrow(() => assertGateBPerformanceProtection(REPOSITORY_ROOT));
});

test('rejects any byte change to a protected legacy file', (t) => {
  const root = fixtureRoot(t);
  writeFileSync(join(root, 'schemas/performance-budget.schema.json'), '{}\n');
  assert.throws(
    () => assertGateBPerformanceProtection(root),
    /preserve schemas\/performance-budget\.schema\.json byte-for-byte/,
  );
});

test('rejects component-performance bootstrap files and scripts before Bundle 2', (t) => {
  const root = fixtureRoot(t);
  const bootstrap = join(root, 'tools/benchmark-component-performance.tsx');
  mkdirSync(dirname(bootstrap), { recursive: true });
  writeFileSync(bootstrap, 'export {};\n');
  assert.throws(
    () => assertGateBPerformanceProtection(root),
    /Component-performance bootstrap is forbidden before Bundle 2/,
  );

  rmSync(bootstrap);
  writeFileSync(
    join(root, 'package.json'),
    '{"scripts":{"performance:check":"tsx tools/benchmark-roadmap-performance.tsx","performance:components:check":"node check.mjs"}}\n',
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
    /performance:check must remain the legacy read-only runner/,
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
