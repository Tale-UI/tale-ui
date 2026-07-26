import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  readFileSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import {
  assertCaptureEnvironment,
  assertComponentPerformanceBaselineContract,
  assertComponentPerformanceFixtureIds,
  assertNoComponentCaptureInCi,
  COMPONENT_PERFORMANCE_CLOCKS,
  COMPONENT_PERFORMANCE_FIXTURE_IDS,
  COMPONENT_PERFORMANCE_NORMAL_STATES,
  COMPONENT_PERFORMANCE_OPERATION_COUNTS,
  COMPONENT_PERFORMANCE_ROLLBACK_FIXTURE_IDS,
  COMPONENT_PERFORMANCE_ROLLBACK_STATES,
  COMPONENT_PERFORMANCE_SAMPLE_POLICY,
  componentThresholds,
  executeComponentPerformanceOperation,
  median,
  replaceComponentPerformanceBaseline,
  roundMilliseconds,
  selectComponentPerformanceOperation,
  sha256,
  withReadOnlyComponentPerformanceBaseline,
} from './component-performance-contract.mjs';

const REPOSITORY_ROOT = resolve(import.meta.dirname, '..');
const BASELINE_PATH = join(
  REPOSITORY_ROOT,
  'test/baselines/roadmap/component-performance-budgets.json',
);
const SCHEMA_PATH = join(REPOSITORY_ROOT, 'schemas/component-performance-budget.schema.json');
const MARKDOWN_FIXTURE_PATH =
  'tools/performance-fixtures/component-expansion/markdown-100k-adversarial.tsx';
const TIMESTAMP_FIXTURE_PATH =
  'tools/performance-fixtures/component-expansion/timestamp-1000-tick.tsx';

const EXPECTED_FIXTURES = Object.freeze([
  {
    id: 'markdown-100k-adversarial',
    path: MARKDOWN_FIXTURE_PATH,
    operationCount: 1,
    fixtureSha256: '7c0ceaee3d889fb62fc78c06656b98629fc49cdaeca4308bf697af49bdb95a32',
    sourceDigest: '983c1532ecf23a7e906f25239871757a6a0136f4556e51dab3f4a559fbc9b4ea',
    vectorDigest: 'f58a5f46502868f31adae14ba0bf6233cffb5ccba901e7922868352d650aec6a',
    markupDigest: '070c2262df9f0f1a685d1617a8dc70f27f349f340608ce48e33dfab46e222de4',
    expectedPostconditionDigest: 'bac5d97f14bf3c9f0dbb535beae5e5dd921975ba66b903260c1c1e891d3f1c60',
  },
  {
    id: 'timestamp-1000-tick',
    path: TIMESTAMP_FIXTURE_PATH,
    operationCount: 1,
    fixtureSha256: '24340b01456d408c8aca55d0e043f8e531d4a22b33be4fd4e5b21114ad5f3134',
    sourceDigest: '92df15ade85d4e436d952e903ab5b6d94ed66dd627ac57c16f84744c6523cae1',
    vectorDigest: '6f4e730ff3c1f8c3c43399d6ba33ea681ff31624e469fa4b419de9926882f933',
    markupDigest: '59f3237bf030a5c6e162abc25b30c829ab121de100dd40d5800fc93bf58e79a6',
    expectedPostconditionDigest: 'a0bf75533ca8c28973fd3aa24978e1ff5cd3e085661c5322bfafd45e4e7a4dc7',
  },
]);

const VALID_ENVIRONMENT = Object.freeze({
  os: 'Ubuntu 24.04',
  node: '22.18.0',
  react: '19.2.4',
  reactDom: '19.2.4',
  jsdom: '27.4.0',
  playwright: '1.58.2',
  chromium: 'chromium-1208',
  lockfileSha256: '9617f8c0298b5602cf3ff5e65db2e74cf2ba04e830dd4110c1aea23579689f8d',
});

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function schemaValidator() {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  return ajv.compile(readJson(SCHEMA_PATH));
}

function baselineForState(source, ids, { rollback = false } = {}) {
  const budgetsById = new Map(source.budgets.map((budget) => [budget.id, budget]));
  return {
    ...structuredClone(source),
    ...(rollback ? { mode: 'rollback' } : {}),
    budgets: ids.map((id) => {
      const existing = budgetsById.get(id) ?? source.budgets[0];
      return {
        ...structuredClone(existing),
        id,
        fixture: `tools/performance-fixtures/component-expansion/${id}.tsx`,
        clock: COMPONENT_PERFORMANCE_CLOCKS[id],
        operationCount: COMPONENT_PERFORMANCE_OPERATION_COUNTS[id],
      };
    }),
  };
}

function workflowFixture(t, content) {
  const root = mkdtempSync(join(tmpdir(), 'tale-component-performance-'));
  t.after(() => rmSync(root, { force: true, recursive: true }));
  mkdirSync(join(root, '.github/workflows'), { recursive: true });
  writeFileSync(join(root, '.github/workflows/ci.yml'), content);
  return root;
}

function fixtureMetadata() {
  const program = `
    import { markdown100kAdversarialFixture as markdown } from './tools/performance-fixtures/component-expansion/markdown-100k-adversarial.tsx';
    import { timestamp1000TickFixture as timestamp } from './tools/performance-fixtures/component-expansion/timestamp-1000-tick.tsx';
    const fixtures = [markdown, timestamp];
    const samples = fixtures.map((fixture) => fixture.runSample());
    process.stdout.write(JSON.stringify({
      fixtures: fixtures.map(({ runSample, description, setup, ...metadata }) => metadata),
      samples,
    }));
  `;
  return JSON.parse(
    execFileSync('pnpm', ['exec', 'tsx', '--eval', program], {
      cwd: REPOSITORY_ROOT,
      encoding: 'utf8',
    }),
  );
}

test('freezes the sample policy and threshold formulas', () => {
  assert.deepEqual(COMPONENT_PERFORMANCE_SAMPLE_POLICY, {
    warmups: 5,
    samples: 15,
    statistic: 'median',
    clock: 'node:perf_hooks.performance',
  });
  assert.deepEqual(componentThresholds(2), { warnAt: 7, blockAt: 12 });
  assert.deepEqual(componentThresholds(5), { warnAt: 10, blockAt: 15 });
  assert.deepEqual(componentThresholds(10), { warnAt: 20, blockAt: 30 });
  assert.equal(roundMilliseconds(1.23449), 1.234);
  assert.equal(roundMilliseconds(1.2345), 1.235);
  assert.deepEqual(COMPONENT_PERFORMANCE_OPERATION_COUNTS, {
    'markdown-100k-adversarial': 1,
    'timestamp-1000-tick': 1,
    'overflow-list-100-recompute': 100,
    'resizable-1000-updates': 1000,
    'toast-100-operations': 100,
  });
  assert.deepEqual(COMPONENT_PERFORMANCE_CLOCKS, {
    'markdown-100k-adversarial': 'node:perf_hooks.performance',
    'timestamp-1000-tick': 'node:perf_hooks.performance',
    'overflow-list-100-recompute': 'page:window.performance',
    'resizable-1000-updates': 'page:window.performance',
    'toast-100-operations': 'node:perf_hooks.performance',
  });
});

test('uses an untrimmed median over exact fresh-state samples', () => {
  assert.equal(median([9, 1, 100, 4, 3]), 4);
  assert.equal(median([100, 1, 9, 3]), 6);
  assert.throws(() => median([]), /at least one sample/);
});

test('accepts only the pinned capture environment', () => {
  assert.doesNotThrow(() => assertCaptureEnvironment(VALID_ENVIRONMENT));
  for (const [field, invalid] of [
    ['os', 'Ubuntu 22.04'],
    ['node', '22.17.0'],
    ['react', '19.2.3'],
    ['reactDom', '19.2.3'],
    ['jsdom', '27.3.0'],
    ['playwright', '1.58.1'],
    ['chromium', '1208'],
    ['lockfileSha256', 'not-a-digest'],
  ]) {
    assert.throws(() => assertCaptureEnvironment({ ...VALID_ENVIRONMENT, [field]: invalid }));
  }
});

test('rejects component baseline capture commands in CI', (t) => {
  const readOnlyRoot = workflowFixture(
    t,
    'jobs:\n  performance:\n    steps:\n      - run: pnpm performance:components:check\n',
  );
  assert.doesNotThrow(() => assertNoComponentCaptureInCi(readOnlyRoot));

  const scriptRoot = workflowFixture(
    t,
    'jobs:\n  performance:\n    steps:\n      - run: pnpm performance:components:capture\n',
  );
  assert.throws(() => assertNoComponentCaptureInCi(scriptRoot), /CI must not capture/);

  const directRoot = workflowFixture(
    t,
    'jobs:\n  performance:\n    steps:\n      - run: tsx tools/benchmark-component-performance.tsx --capture\n',
  );
  assert.throws(() => assertNoComponentCaptureInCi(directRoot), /CI must not capture/);
});

test('schema and runner preserve only the ten ordered plan states', () => {
  const baseline = readJson(BASELINE_PATH);
  const validate = schemaValidator();

  assert.equal(validate(baseline), true);
  assert.doesNotThrow(() =>
    assertComponentPerformanceFixtureIds(baseline.budgets.map(({ id }) => id)),
  );
  assert.deepEqual(COMPONENT_PERFORMANCE_FIXTURE_IDS, [
    'markdown-100k-adversarial',
    'timestamp-1000-tick',
  ]);
  assert.throws(
    () =>
      assertComponentPerformanceFixtureIds(['timestamp-1000-tick', 'markdown-100k-adversarial']),
    /normal state is not permitted/,
  );
  assert.throws(
    () => assertComponentPerformanceFixtureIds(['timestamp-1000-tick']),
    /normal state is not permitted/,
  );

  const invalidPolicy = structuredClone(baseline);
  invalidPolicy.budgets[0].samples = 14;
  assert.equal(validate(invalidPolicy), false);

  const arbitrarySubset = structuredClone(baseline);
  arbitrarySubset.budgets.pop();
  assert.equal(validate(arbitrarySubset), false);

  for (const ids of COMPONENT_PERFORMANCE_NORMAL_STATES) {
    const document = baselineForState(baseline, ids);
    assert.equal(validate(document), true, `Schema rejected normal state ${ids.join(', ')}`);
    assert.doesNotThrow(() =>
      assertComponentPerformanceBaselineContract(document, {
        expectedFixtureIds: ids,
      }),
    );
  }
  for (const ids of COMPONENT_PERFORMANCE_ROLLBACK_STATES) {
    const document = baselineForState(baseline, ids, { rollback: true });
    assert.equal(validate(document), true, `Schema rejected rollback state ${ids.join(', ')}`);
    assert.doesNotThrow(() =>
      assertComponentPerformanceBaselineContract(document, {
        rollback: true,
        expectedFixtureIds: ids,
      }),
    );
  }

  const implicitRollback = baselineForState(baseline, COMPONENT_PERFORMANCE_ROLLBACK_FIXTURE_IDS);
  assert.equal(validate(implicitRollback), false);
  assert.throws(
    () =>
      assertComponentPerformanceBaselineContract(implicitRollback, {
        rollback: true,
        expectedFixtureIds: COMPONENT_PERFORMANCE_ROLLBACK_FIXTURE_IDS,
      }),
    /explicit mode: rollback/,
  );

  const unapprovedRollback = baselineForState(
    baseline,
    ['markdown-100k-adversarial', 'resizable-1000-updates'],
    { rollback: true },
  );
  assert.equal(validate(unapprovedRollback), false);
  assert.throws(
    () =>
      assertComponentPerformanceBaselineContract(unapprovedRollback, {
        rollback: true,
      }),
    /rollback state is not permitted/,
  );
});

test('selects exactly one unreachable capture or check operation', async () => {
  assert.equal(selectComponentPerformanceOperation([]), 'check');
  assert.equal(selectComponentPerformanceOperation(['--rollback']), 'check');
  assert.equal(selectComponentPerformanceOperation(['--capture']), 'capture');
  assert.throws(
    () => selectComponentPerformanceOperation(['--capture', '--capture']),
    /at most once/,
  );

  let checks = 0;
  await executeComponentPerformanceOperation('check', {
    capture: () => assert.fail('capture must be unreachable in check mode'),
    check: () => {
      checks += 1;
    },
  });
  assert.equal(checks, 1);
});

test('capture validates a complete temporary sibling before atomic replacement', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'tale-component-capture-'));
  t.after(() => rmSync(root, { force: true, recursive: true }));
  const targetPath = join(root, 'component-performance-budgets.json');
  writeFileSync(targetPath, '{"previous":true}\n');
  const candidate = readJson(BASELINE_PATH);
  const validateSchema = schemaValidator();
  let observedTemporaryPath = '';

  replaceComponentPerformanceBaseline({
    targetPath,
    candidate,
    validate: (document) => {
      assert.equal(validateSchema(document), true);
      assertComponentPerformanceBaselineContract(document, {
        expectedFixtureIds: COMPONENT_PERFORMANCE_FIXTURE_IDS,
      });
    },
    rename: (temporaryPath, destinationPath) => {
      observedTemporaryPath = temporaryPath;
      assert.equal(dirname(temporaryPath), dirname(targetPath));
      assert.equal(destinationPath, targetPath);
      assert.deepEqual(readJson(temporaryPath), candidate);
      renameSync(temporaryPath, destinationPath);
    },
  });

  assert.match(observedTemporaryPath, /\.component-performance-budgets\.json\..+\.tmp$/);
  assert.deepEqual(readJson(targetPath), candidate);
  assert.deepEqual(readdirSync(root), ['component-performance-budgets.json']);
});

test('an invalid capture candidate never replaces the baseline', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'tale-component-invalid-capture-'));
  t.after(() => rmSync(root, { force: true, recursive: true }));
  const targetPath = join(root, 'component-performance-budgets.json');
  const previous = '{"previous":true}\n';
  writeFileSync(targetPath, previous);
  const candidate = readJson(BASELINE_PATH);
  candidate.budgets[0].warnAt += 1;
  const validateSchema = schemaValidator();

  assert.throws(
    () =>
      replaceComponentPerformanceBaseline({
        targetPath,
        candidate,
        validate: (document) => {
          assert.equal(validateSchema(document), true);
          assertComponentPerformanceBaselineContract(document, {
            expectedFixtureIds: COMPONENT_PERFORMANCE_FIXTURE_IDS,
          });
        },
      }),
    /thresholds must be derived/,
  );
  assert.equal(readFileSync(targetPath, 'utf8'), previous);
  assert.deepEqual(readdirSync(root), ['component-performance-budgets.json']);
});

test('read-only checks hash before and after and fail on mutation', async (t) => {
  const root = mkdtempSync(join(tmpdir(), 'tale-component-read-only-'));
  t.after(() => rmSync(root, { force: true, recursive: true }));
  const targetPath = join(root, 'component-performance-budgets.json');
  const baseline = readFileSync(BASELINE_PATH, 'utf8');
  writeFileSync(targetPath, baseline);

  await assert.doesNotReject(() =>
    withReadOnlyComponentPerformanceBaseline(targetPath, () => readJson(targetPath)),
  );
  await assert.rejects(
    () =>
      withReadOnlyComponentPerformanceBaseline(targetPath, () => {
        writeFileSync(targetPath, '{"mutated":true}\n');
      }),
    /check mutated its baseline/,
  );
});

test('the runner wires capture and check through their guarded operations', () => {
  const runner = readFileSync(
    join(REPOSITORY_ROOT, 'tools/benchmark-component-performance.tsx'),
    'utf8',
  );
  assert.match(
    runner,
    /executeComponentPerformanceOperation\(OPERATION,\s*\{\s*capture: \(\) => captureBaseline\(fixtures\),\s*check: \(\) =>\s*withReadOnlyComponentPerformanceBaseline/,
  );
  assert.match(
    runner,
    /replaceComponentPerformanceBaseline\(\{\s*targetPath: BASELINE_PATH,\s*candidate: baseline,\s*validate: \(candidate\) => validateBaseline/,
  );
  assert.match(runner, /assert\.equal\(budget\.fixture, fixture\.path\)/);
  assert.match(runner, /assert\.equal\(budget\.setup, fixture\.setup\)/);
});

test('freezes exact vectors, fixture bytes, metadata, and postconditions', () => {
  const markdownSource = [
    Array.from({ length: 6 }, () => `---${' '.repeat(9997)}\n`).join(''),
    `---${' '.repeat(88)}\n`,
    Array.from({ length: 9959 }, () => '---\n').join(''),
    `${'> '.repeat(32)}x\n`,
  ].join('');
  const timestampT0 = 1_767_225_600_000;
  const timestampValues = Array.from(
    { length: 1000 },
    (_, index) => timestampT0 + ((index % 121) - 60) * 1000,
  );
  const timestampKeys = timestampValues.map(
    (_, index) => `timestamp-${String(index).padStart(4, '0')}`,
  );
  assert.equal(markdownSource.length, 100_000);
  assert.equal(Math.max(...markdownSource.split('\n').map((line) => line.length)), 10_000);
  assert.equal(sha256(markdownSource), EXPECTED_FIXTURES[0].sourceDigest);
  assert.equal(
    sha256(JSON.stringify({ T0: timestampT0, values: timestampValues })),
    EXPECTED_FIXTURES[1].sourceDigest,
  );
  assert.equal(
    sha256(JSON.stringify(timestampKeys.map((key, index) => [key, timestampValues[index]]))),
    EXPECTED_FIXTURES[1].vectorDigest,
  );

  const observed = fixtureMetadata();
  assert.deepEqual(
    observed.fixtures,
    EXPECTED_FIXTURES.map(({ fixtureSha256, ...metadata }) => metadata),
  );
  assert.deepEqual(
    observed.samples.map(({ postconditionDigest }) => postconditionDigest),
    EXPECTED_FIXTURES.map(({ expectedPostconditionDigest }) => expectedPostconditionDigest),
  );
  for (const fixture of EXPECTED_FIXTURES) {
    assert.equal(sha256(readFileSync(join(REPOSITORY_ROOT, fixture.path))), fixture.fixtureSha256);
  }
});

test('freezes the intended performance and synchronous act boundaries', () => {
  const markdown = readFileSync(join(REPOSITORY_ROOT, MARKDOWN_FIXTURE_PATH), 'utf8');
  const markdownSample = markdown.slice(
    markdown.indexOf('function runSample()'),
    markdown.indexOf('export const markdown100kAdversarialFixture'),
  );
  const markdownStarted = markdownSample.indexOf('const started = performance.now()');
  const markdownOperation = markdownSample.indexOf('renderToStaticMarkup', markdownStarted);
  const markdownStopped = markdownSample.indexOf('const duration = performance.now() - started');
  assert.ok(
    markdownStarted >= 0 &&
      markdownStarted < markdownOperation &&
      markdownOperation < markdownStopped,
  );
  assert.equal(markdownSample.match(/renderToStaticMarkup/g)?.length, 1);
  assert.match(markdownSample, /assertSafeMarkup\(markup\)/);

  const timestamp = readFileSync(join(REPOSITORY_ROOT, TIMESTAMP_FIXTURE_PATH), 'utf8');
  const timestampSample = timestamp.slice(
    timestamp.indexOf('function runSample()'),
    timestamp.indexOf('const initialSample = runSample()'),
  );
  const initialRender = timestampSample.indexOf(
    'root.render(<TimestampVector onRender={onRender} />)',
  );
  const timestampStarted = timestampSample.indexOf('const started = performance.now()');
  const timedAct = timestampSample.indexOf(
    'act(() => {\n      scheduler.advanceTo(TIMESTAMP_T0 + 1000);\n    });',
  );
  const timestampStopped = timestampSample.indexOf('const duration = performance.now() - started');
  const unmount = timestampSample.indexOf('root.unmount()');
  assert.ok(
    initialRender >= 0 &&
      initialRender < timestampStarted &&
      timestampStarted < timedAct &&
      timedAct < timestampStopped &&
      timestampStopped < unmount,
  );
  assert.match(timestampSample, /assert\.equal\(scheduler\.schedulerCallbacks, 1\)/);
  assert.match(timestampSample, /assert\.equal\(formatCalls, 1000\)/);
  assert.match(timestampSample, /assert\.equal\(updateCommits, 1\)/);
  assert.match(timestampSample, /assert\.deepEqual\(dateTimes, initialDateTimes\)/);
  assert.match(timestampSample, /assert\.equal\(scheduler\.activeIntervalCount, 0\)/);
});
