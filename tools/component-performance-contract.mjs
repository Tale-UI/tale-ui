import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export const COMPONENT_PERFORMANCE_FIXTURE_IDS = Object.freeze([
  'markdown-100k-adversarial',
  'timestamp-1000-tick',
]);

export const COMPONENT_PERFORMANCE_SAMPLE_POLICY = Object.freeze({
  warmups: 5,
  samples: 15,
  statistic: 'median',
  clock: 'node:perf_hooks.performance',
});

export function assertComponentPerformanceFixtureIds(ids) {
  assert.deepEqual(
    ids,
    COMPONENT_PERFORMANCE_FIXTURE_IDS,
    'Component performance fixture state must exactly match the installed ordered fixtures',
  );
}

export function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

export function roundMilliseconds(value) {
  return Math.round(value * 1000) / 1000;
}

export function median(values) {
  assert.ok(values.length > 0, 'Median requires at least one sample');
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

export function componentThresholds(baseline) {
  return {
    warnAt: roundMilliseconds(Math.max(baseline * 2, baseline + 5)),
    blockAt: roundMilliseconds(Math.max(baseline * 3, baseline + 10)),
  };
}

export function assertNoComponentCaptureInCi(root) {
  const workflowDirectory = join(root, '.github/workflows');
  const captureCommand =
    /\b(?:pnpm|npm|yarn|node|tsx)\b[^\n]*(?:performance:components:capture|benchmark-component-performance[^\n]*--capture)\b/i;
  for (const name of readdirSync(workflowDirectory).filter((entry) => /\.ya?ml$/i.test(entry))) {
    const path = join(workflowDirectory, name);
    assert.ok(!captureCommand.test(readFileSync(path, 'utf8')), `CI must not capture: ${path}`);
  }
}

export function assertCaptureEnvironment(environment) {
  assert.equal(environment.os, 'Ubuntu 24.04', 'Capture requires Ubuntu 24.04');
  assert.equal(environment.node, '22.18.0', 'Capture requires Node 22.18.0');
  assert.equal(environment.react, '19.2.4', 'Capture requires React 19.2.4');
  assert.equal(environment.reactDom, '19.2.4', 'Capture requires ReactDOM 19.2.4');
  assert.equal(environment.jsdom, '27.4.0', 'Capture requires JSDOM 27.4.0');
  assert.equal(environment.playwright, '1.58.2', 'Capture requires Playwright 1.58.2');
  assert.match(environment.chromium, /^chromium-[1-9][0-9]*$/);
  assert.match(environment.lockfileSha256, /^[a-f0-9]{64}$/);
}
