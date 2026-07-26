import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import {
  assertExactComponentEquivalenceAccessibilityReportPaths,
  EXPECTED_COMPONENT_EQUIVALENCE_ACCESSIBILITY_REPORTS,
} from './check-component-equivalence-accessibility-reports.mjs';

function temporaryRoot(t) {
  const root = mkdtempSync(join(tmpdir(), 'tale-a11y-reports-'));
  t.after(() => rmSync(root, { force: true, recursive: true }));
  return root;
}

function writeReport(root, path) {
  const output = join(root, path);
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, '{}\n');
}

test('requires exactly the eight durable bundle report paths', (t) => {
  const root = temporaryRoot(t);
  for (const path of EXPECTED_COMPONENT_EQUIVALENCE_ACCESSIBILITY_REPORTS) {
    writeReport(root, path);
  }
  assert.deepEqual(
    assertExactComponentEquivalenceAccessibilityReportPaths(root),
    [...EXPECTED_COMPONENT_EQUIVALENCE_ACCESSIBILITY_REPORTS].toSorted(),
  );
});

test('rejects missing and additional report files', (t) => {
  const root = temporaryRoot(t);
  for (const path of EXPECTED_COMPONENT_EQUIVALENCE_ACCESSIBILITY_REPORTS.slice(1)) {
    writeReport(root, path);
  }
  assert.throws(
    () => assertExactComponentEquivalenceAccessibilityReportPaths(root),
    /exactly the eight tracked bundle reports/,
  );

  writeReport(root, EXPECTED_COMPONENT_EQUIVALENCE_ACCESSIBILITY_REPORTS[0]);
  writeReport(root, 'test/accessibility/reports/component-equivalence/bundle-5-shared.json');
  assert.throws(
    () => assertExactComponentEquivalenceAccessibilityReportPaths(root),
    /exactly the eight tracked bundle reports/,
  );
});
