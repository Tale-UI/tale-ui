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

const BUNDLE_2_SCRIPT_NAMES = new Set([
  'performance:roadmap:check',
  'performance:components:capture',
  'performance:components:check',
]);

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

  for (const path of BUNDLE_2_COMPONENT_PERFORMANCE_PATHS) {
    assert.ok(
      !existsSync(join(root, path)),
      `Component-performance bootstrap is forbidden before Bundle 2: ${path}`,
    );
  }

  const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  assert.equal(
    manifest.scripts?.['performance:check'],
    'tsx tools/benchmark-roadmap-performance.tsx',
    'Gate B performance:check must remain the legacy read-only runner',
  );
  for (const scriptName of BUNDLE_2_SCRIPT_NAMES) {
    assert.ok(
      !(scriptName in (manifest.scripts ?? {})),
      `Component-performance script is forbidden before Bundle 2: ${scriptName}`,
    );
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
    'OK: Gate B preserves legacy performance files and has no component-performance bootstrap',
  );
}
