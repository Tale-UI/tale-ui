#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const COMPONENT_EQUIVALENCE_ACCESSIBILITY_REPORT_ROOT =
  'test/accessibility/reports/component-equivalence';

export const EXPECTED_COMPONENT_EQUIVALENCE_ACCESSIBILITY_REPORTS = Object.freeze(
  [1, 2, 3, 4].flatMap((bundle) => [
    `${COMPONENT_EQUIVALENCE_ACCESSIBILITY_REPORT_ROOT}/bundle-${bundle}-shared.json`,
    `${COMPONENT_EQUIVALENCE_ACCESSIBILITY_REPORT_ROOT}/bundle-${bundle}-cumulative.json`,
  ]),
);

function collectFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(path));
    } else if (entry.isFile()) {
      files.push(path);
    }
  }
  return files;
}

export function assertExactComponentEquivalenceAccessibilityReportPaths(root) {
  const reportRoot = join(root, COMPONENT_EQUIVALENCE_ACCESSIBILITY_REPORT_ROOT);
  let files = [];
  try {
    files = collectFiles(reportRoot);
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error;
    }
  }
  const actual = files.map((path) => relative(root, path).replaceAll('\\', '/')).toSorted();
  const expected = [...EXPECTED_COMPONENT_EQUIVALENCE_ACCESSIBILITY_REPORTS].toSorted();
  assert.deepEqual(
    actual,
    expected,
    'Component-equivalence accessibility evidence must contain exactly the eight tracked bundle reports',
  );
  return actual;
}

const isMain =
  process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isMain) {
  const root = resolve(import.meta.dirname, '..');
  assertExactComponentEquivalenceAccessibilityReportPaths(root);
  console.log('OK: all eight tracked component-equivalence accessibility reports exist');
}
