import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import {
  existsSync,
  readFileSync,
  readdirSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, join } from 'node:path';

export const COMPONENT_PERFORMANCE_FIXTURE_IDS = Object.freeze([
  'markdown-100k-adversarial',
  'timestamp-1000-tick',
  'overflow-list-100-recompute',
  'resizable-1000-updates',
  'toast-100-operations',
]);

export const COMPONENT_PERFORMANCE_ROLLBACK_FIXTURE_IDS = Object.freeze(['timestamp-1000-tick']);

export const COMPONENT_PERFORMANCE_OPERATION_COUNTS = Object.freeze({
  'markdown-100k-adversarial': 1,
  'timestamp-1000-tick': 1,
  'overflow-list-100-recompute': 100,
  'resizable-1000-updates': 1000,
  'toast-100-operations': 100,
});

export const COMPONENT_PERFORMANCE_CLOCKS = Object.freeze({
  'markdown-100k-adversarial': 'node:perf_hooks.performance',
  'timestamp-1000-tick': 'node:perf_hooks.performance',
  'overflow-list-100-recompute': 'page:window.performance',
  'resizable-1000-updates': 'page:window.performance',
  'toast-100-operations': 'node:perf_hooks.performance',
});

export const COMPONENT_PERFORMANCE_NORMAL_STATES = Object.freeze([
  Object.freeze(['markdown-100k-adversarial', 'timestamp-1000-tick']),
  Object.freeze([
    'markdown-100k-adversarial',
    'timestamp-1000-tick',
    'overflow-list-100-recompute',
    'resizable-1000-updates',
  ]),
  Object.freeze([
    'markdown-100k-adversarial',
    'timestamp-1000-tick',
    'overflow-list-100-recompute',
    'resizable-1000-updates',
    'toast-100-operations',
  ]),
]);

export const COMPONENT_PERFORMANCE_ROLLBACK_STATES = Object.freeze([
  COMPONENT_PERFORMANCE_ROLLBACK_FIXTURE_IDS,
  Object.freeze(['timestamp-1000-tick', 'overflow-list-100-recompute', 'resizable-1000-updates']),
  Object.freeze([
    'markdown-100k-adversarial',
    'timestamp-1000-tick',
    'overflow-list-100-recompute',
  ]),
  Object.freeze(['timestamp-1000-tick', 'overflow-list-100-recompute']),
  Object.freeze([
    'timestamp-1000-tick',
    'overflow-list-100-recompute',
    'resizable-1000-updates',
    'toast-100-operations',
  ]),
  Object.freeze([
    'markdown-100k-adversarial',
    'timestamp-1000-tick',
    'overflow-list-100-recompute',
    'toast-100-operations',
  ]),
  Object.freeze(['timestamp-1000-tick', 'overflow-list-100-recompute', 'toast-100-operations']),
]);

export const COMPONENT_PERFORMANCE_SAMPLE_POLICY = Object.freeze({
  warmups: 5,
  samples: 15,
  statistic: 'median',
  clock: 'node:perf_hooks.performance',
});

function sameState(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function assertComponentPerformanceState(
  ids,
  { rollback = false, expectedFixtureIds } = {},
) {
  const permittedStates = rollback
    ? COMPONENT_PERFORMANCE_ROLLBACK_STATES
    : COMPONENT_PERFORMANCE_NORMAL_STATES;
  assert.ok(
    permittedStates.some((state) => sameState(ids, state)),
    `Component performance ${rollback ? 'rollback' : 'normal'} state is not permitted: ${ids.join(', ')}`,
  );
  if (expectedFixtureIds) {
    assert.deepEqual(
      ids,
      expectedFixtureIds,
      'Component performance baseline must exactly match the active ordered fixtures',
    );
  }
}

export function assertComponentPerformanceFixtureIds(ids) {
  assertComponentPerformanceState(ids, {
    expectedFixtureIds: COMPONENT_PERFORMANCE_FIXTURE_IDS,
  });
}

export function assertComponentPerformanceBaselineContract(
  baseline,
  { rollback = false, expectedFixtureIds } = {},
) {
  assert.ok(baseline && typeof baseline === 'object', 'Performance baseline must be an object');
  if (rollback) {
    assert.equal(
      baseline.mode,
      'rollback',
      'Rollback performance baselines require explicit mode: rollback',
    );
  } else {
    assert.ok(
      !Object.hasOwn(baseline, 'mode'),
      'Normal performance baselines must not declare rollback mode',
    );
  }
  const ids = baseline.budgets?.map(({ id }) => id) ?? [];
  assertComponentPerformanceState(ids, { rollback, expectedFixtureIds });
  for (const budget of baseline.budgets) {
    assert.equal(budget.warmups, COMPONENT_PERFORMANCE_SAMPLE_POLICY.warmups);
    assert.equal(budget.samples, COMPONENT_PERFORMANCE_SAMPLE_POLICY.samples);
    assert.equal(budget.statistic, COMPONENT_PERFORMANCE_SAMPLE_POLICY.statistic);
    assert.equal(
      budget.clock,
      COMPONENT_PERFORMANCE_CLOCKS[budget.id],
      `Performance clock must match the approved boundary for ${budget.id}`,
    );
    assert.equal(
      budget.operationCount,
      COMPONENT_PERFORMANCE_OPERATION_COUNTS[budget.id],
      `Performance operation count must match the approved vector for ${budget.id}`,
    );
    assert.equal(budget.unit, 'milliseconds');
    assert.equal(budget.owner, 'Design Systems');
    assert.deepEqual(
      { warnAt: budget.warnAt, blockAt: budget.blockAt },
      componentThresholds(budget.baseline),
      `Performance thresholds must be derived from the baseline for ${budget.id}`,
    );
  }
}

export function selectComponentPerformanceOperation(args) {
  assert.ok(
    args.filter((argument) => argument === '--capture').length <= 1,
    'Component performance capture may be selected at most once',
  );
  return args.includes('--capture') ? 'capture' : 'check';
}

export function executeComponentPerformanceOperation(operation, handlers) {
  assert.ok(
    operation === 'capture' || operation === 'check',
    `Unknown component performance operation: ${operation}`,
  );
  return handlers[operation]();
}

export function componentPerformanceFileDigest(path) {
  return sha256(readFileSync(path));
}

export async function withReadOnlyComponentPerformanceBaseline(path, callback) {
  const before = componentPerformanceFileDigest(path);
  try {
    return await callback();
  } finally {
    assert.equal(
      componentPerformanceFileDigest(path),
      before,
      `Component performance check mutated its baseline: ${path}`,
    );
  }
}

export function replaceComponentPerformanceBaseline({
  targetPath,
  candidate,
  validate,
  rename = renameSync,
}) {
  const temporaryPath = join(
    dirname(targetPath),
    `.${basename(targetPath)}.${process.pid}.${randomUUID()}.tmp`,
  );
  let replaced = false;
  try {
    writeFileSync(temporaryPath, `${JSON.stringify(candidate, null, 2)}\n`, {
      encoding: 'utf8',
      flag: 'wx',
    });
    const candidateFromDisk = JSON.parse(readFileSync(temporaryPath, 'utf8'));
    validate(candidateFromDisk);
    rename(temporaryPath, targetPath);
    replaced = true;
    return { temporaryPath };
  } finally {
    if (!replaced && existsSync(temporaryPath)) {
      unlinkSync(temporaryPath);
    }
  }
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
