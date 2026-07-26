#!/usr/bin/env node

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const GATE_B_PROTECTED_PERFORMANCE_FILES = Object.freeze({
  'schemas/performance-budget.schema.json':
    '93629617f71a0ded302562e6f390c4c87675a46be41bdc1c5df07991f5775143',
  'test/baselines/roadmap/performance-budgets.json':
    'f066eb6350865582b130d561cbeb43ae2a173409ebb01ae108d94d5252c03c8d',
  'tools/benchmark-roadmap-performance.tsx':
    '915e83817ddb531cb428986bfeb71e76508f80ec91d7405ebcc5ec90e25d9374',
});

export const BUNDLE_2_COMPONENT_PERFORMANCE_PATHS = Object.freeze([
  'schemas/component-performance-budget.schema.json',
  'test/baselines/roadmap/component-performance-budgets.json',
  'tools/benchmark-component-performance.tsx',
  'tools/performance-fixtures/component-expansion',
]);

export const LEGACY_PERFORMANCE_CHECK = 'tsx tools/benchmark-roadmap-performance.tsx';

export const BUNDLE_2_COMPONENT_PERFORMANCE_SCRIPTS = Object.freeze({
  'performance:roadmap:check': LEGACY_PERFORMANCE_CHECK,
  'performance:components:capture': 'tsx tools/benchmark-component-performance.tsx --capture',
  'performance:components:check': 'tsx tools/benchmark-component-performance.tsx',
  'performance:check': 'pnpm performance:roadmap:check && pnpm performance:components:check',
});

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function workflowFiles(root) {
  const directory = join(root, '.github/workflows');
  return readdirSync(directory)
    .filter((name) => /\.ya?ml$/i.test(name))
    .toSorted()
    .map((name) => join(directory, name));
}

export function assertGateBPerformanceProtection(root) {
  for (const [path, expectedDigest] of Object.entries(GATE_B_PROTECTED_PERFORMANCE_FILES)) {
    const absolutePath = join(root, path);
    assert.ok(existsSync(absolutePath), `Missing protected legacy performance file: ${path}`);
    assert.equal(
      sha256(absolutePath),
      expectedDigest,
      `Gate B must preserve ${path} byte-for-byte`,
    );
  }

  const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const scripts = manifest.scripts ?? {};
  const presentBootstrapPaths = BUNDLE_2_COMPONENT_PERFORMANCE_PATHS.filter((path) =>
    existsSync(join(root, path)),
  );

  if (presentBootstrapPaths.length === 0) {
    assert.equal(
      scripts['performance:check'],
      LEGACY_PERFORMANCE_CHECK,
      'Gate B performance:check must remain the legacy read-only runner before Bundle 2',
    );
    for (const scriptName of Object.keys(BUNDLE_2_COMPONENT_PERFORMANCE_SCRIPTS)) {
      if (scriptName === 'performance:check') {
        continue;
      }
      assert.ok(
        !(scriptName in scripts),
        `Component-performance script is forbidden before Bundle 2: ${scriptName}`,
      );
    }
  } else {
    assert.deepEqual(
      presentBootstrapPaths,
      BUNDLE_2_COMPONENT_PERFORMANCE_PATHS,
      'Bundle 2 component-performance bootstrap paths must appear atomically',
    );
    for (const [scriptName, expectedCommand] of Object.entries(
      BUNDLE_2_COMPONENT_PERFORMANCE_SCRIPTS,
    )) {
      assert.equal(
        scripts[scriptName],
        expectedCommand,
        `Bundle 2 component-performance script must be exact: ${scriptName}`,
      );
    }
  }

  const captureCommand =
    /\b(?:pnpm|npm|yarn|node|tsx)\b[^\n]*(?:--capture\b|:capture\b|\bcapture\b)/i;
  for (const path of workflowFiles(root)) {
    const content = readFileSync(path, 'utf8');
    assert.ok(
      !captureCommand.test(content),
      `CI workflows must not invoke baseline capture commands: ${path}`,
    );
  }
}

const isMain =
  process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isMain) {
  assertGateBPerformanceProtection(resolve(import.meta.dirname, '..'));
  console.log(
    'OK: Gate B preserves legacy performance files and permits only atomic component-performance states',
  );
}
