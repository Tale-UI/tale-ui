import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import {
  assertCaptureEnvironment,
  assertComponentPerformanceFixtureIds,
  assertNoComponentCaptureInCi,
  COMPONENT_PERFORMANCE_FIXTURE_IDS,
  COMPONENT_PERFORMANCE_SAMPLE_POLICY,
  componentThresholds,
  median,
  roundMilliseconds,
  sha256,
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

test('schema and runner accept only the installed ordered Bundle 2 fixture state', () => {
  const schema = readJson(SCHEMA_PATH);
  const baseline = readJson(BASELINE_PATH);
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);

  assert.equal(validate(baseline), true, ajv.errorsText(validate.errors));
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
    /exactly match the installed ordered fixtures/,
  );
  assert.throws(
    () => assertComponentPerformanceFixtureIds(['timestamp-1000-tick']),
    /exactly match the installed ordered fixtures/,
  );

  const invalidPolicy = structuredClone(baseline);
  invalidPolicy.budgets[0].samples = 14;
  assert.equal(validate(invalidPolicy), false);

  const arbitrarySubset = structuredClone(baseline);
  arbitrarySubset.budgets.pop();
  assert.equal(validate(arbitrarySubset), false);
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
