#!/usr/bin/env node

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
// Ajv exposes its draft-2020 entry with the runtime extension.
// eslint-disable-next-line import/extensions
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import {
  assertCaptureEnvironment,
  assertComponentPerformanceFixtureIds,
  assertNoComponentCaptureInCi,
  COMPONENT_PERFORMANCE_SAMPLE_POLICY,
  componentThresholds,
  median,
  roundMilliseconds,
  sha256,
  // eslint-disable-next-line import/extensions
} from './component-performance-contract.mjs';
// Runtime TypeScript execution requires the source extension.
// eslint-disable-next-line import/extensions
import { markdown100kAdversarialFixture } from './performance-fixtures/component-expansion/markdown-100k-adversarial.tsx';
// Runtime TypeScript execution requires the source extension.
// eslint-disable-next-line import/extensions
import { timestamp1000TickFixture } from './performance-fixtures/component-expansion/timestamp-1000-tick.tsx';
import type {
  ComponentPerformanceFixture,
  ComponentPerformanceSample,
  // eslint-disable-next-line import/extensions
} from './performance-fixtures/component-expansion/types.ts';

const ROOT = resolve(process.cwd());
const args = process.argv.slice(2);
const CAPTURE = args.includes('--capture');
const BASELINE_PATH = join(ROOT, 'test/baselines/roadmap/component-performance-budgets.json');
const outputIndex = args.indexOf('--output');
const OUTPUT =
  outputIndex === -1
    ? join(ROOT, '.artifacts/component-performance-current.json')
    : resolve(ROOT, args[outputIndex + 1]);
const TODAY = new Date().toISOString().slice(0, 10);
const require = createRequire(import.meta.url);

function readJson(path: string) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function packageVersion(name: string) {
  return readJson(require.resolve(`${name}/package.json`)).version as string;
}

function operatingSystem() {
  if (process.platform !== 'linux') {
    return `${process.platform}-${process.arch}`;
  }
  const release = readFileSync('/etc/os-release', 'utf8');
  const name = /^NAME="?([^"\n]+)"?$/m.exec(release)?.[1];
  const version = /^VERSION_ID="?([^"\n]+)"?$/m.exec(release)?.[1];
  return name === 'Ubuntu' && version === '24.04' ? 'Ubuntu 24.04' : `${name} ${version}`;
}

function chromiumIdentity() {
  const playwrightPackage = require.resolve('playwright-core/package.json');
  const browsers = readJson(join(dirname(playwrightPackage), 'browsers.json'));
  const chromium = browsers.browsers.find(
    (browser: { name: string }) => browser.name === 'chromium',
  );
  assert.ok(chromium?.revision, 'Playwright Chromium revision is required');
  return `chromium-${chromium.revision}`;
}

function currentEnvironment() {
  return {
    os: operatingSystem(),
    node: process.versions.node,
    react: packageVersion('react'),
    reactDom: packageVersion('react-dom'),
    jsdom: packageVersion('jsdom'),
    playwright: packageVersion('@playwright/test'),
    chromium: chromiumIdentity(),
    lockfileSha256: sha256(readFileSync(join(ROOT, 'pnpm-lock.yaml'))),
  };
}

async function measureFixture(fixture: ComponentPerformanceFixture) {
  for (let index = 0; index < COMPONENT_PERFORMANCE_SAMPLE_POLICY.warmups; index += 1) {
    // Warm-ups intentionally use fresh fixture state and are not retained.
    // eslint-disable-next-line no-await-in-loop
    const warmup = await fixture.runSample();
    assert.equal(warmup.postconditionDigest, fixture.expectedPostconditionDigest);
  }

  const samples: ComponentPerformanceSample[] = [];
  for (let index = 0; index < COMPONENT_PERFORMANCE_SAMPLE_POLICY.samples; index += 1) {
    // Sequential execution prevents DOM/global overlap and preserves exact fresh-state samples.
    // eslint-disable-next-line no-await-in-loop
    const sample = await fixture.runSample();
    assert.equal(sample.postconditionDigest, fixture.expectedPostconditionDigest);
    assert.ok(Number.isFinite(sample.duration) && sample.duration >= 0);
    samples.push(sample);
  }

  return {
    value: roundMilliseconds(median(samples.map(({ duration }) => duration))),
    samples: samples.map(({ duration }) => roundMilliseconds(duration)),
  };
}

async function main() {
  assertNoComponentCaptureInCi(ROOT);

  const fixtures: ComponentPerformanceFixture[] = [
    markdown100kAdversarialFixture,
    timestamp1000TickFixture,
  ];
  assertComponentPerformanceFixtureIds(fixtures.map(({ id }) => id));

  const measurements = [];
  for (const fixture of fixtures) {
    // Fixtures are intentionally measured serially to avoid shared CPU/DOM interference.
    // eslint-disable-next-line no-await-in-loop
    measurements.push({ fixture, ...(await measureFixture(fixture)) });
  }

  const environment = currentEnvironment();
  const revision = execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: ROOT,
    encoding: 'utf8',
  }).trim();

  if (CAPTURE) {
    assertCaptureEnvironment(environment);
    const baseline = {
      $schema: '../../../schemas/component-performance-budget.schema.json',
      schemaVersion: '1.0.0',
      capturedOn: TODAY,
      revision,
      environment,
      budgets: measurements.map(({ fixture, value }) => ({
        id: fixture.id,
        description: fixture.description,
        fixture: fixture.path,
        fixtureSha256: sha256(readFileSync(join(ROOT, fixture.path))),
        sourceSha256: fixture.sourceDigest,
        vectorSha256: fixture.vectorDigest,
        markupSha256: fixture.markupDigest,
        postconditionSha256: fixture.expectedPostconditionDigest,
        setup: fixture.setup,
        operationCount: fixture.operationCount,
        warmups: COMPONENT_PERFORMANCE_SAMPLE_POLICY.warmups,
        samples: COMPONENT_PERFORMANCE_SAMPLE_POLICY.samples,
        statistic: COMPONENT_PERFORMANCE_SAMPLE_POLICY.statistic,
        clock: COMPONENT_PERFORMANCE_SAMPLE_POLICY.clock,
        unit: 'milliseconds',
        baseline: value,
        ...componentThresholds(value),
        owner: 'Design Systems',
        evidence:
          'Exact vector and postcondition digests are reasserted for every fresh-state sample.',
      })),
      exceptions: [],
    };
    mkdirSync(dirname(BASELINE_PATH), { recursive: true });
    writeFileSync(BASELINE_PATH, `${JSON.stringify(baseline, null, 2)}\n`);
    process.stdout.write(`CAPTURED: ${BASELINE_PATH.slice(ROOT.length + 1)}\n`);
    return;
  }

  const baseline = readJson(BASELINE_PATH);
  const schema = readJson(join(ROOT, 'schemas/component-performance-budget.schema.json'));
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const validator = ajv.compile(schema);
  assert.ok(validator(baseline), ajv.errorsText(validator.errors, { separator: '\n' }));
  assertComponentPerformanceFixtureIds(baseline.budgets.map(({ id }: { id: string }) => id));
  for (const exception of baseline.exceptions) {
    assert.ok(exception.expiresOn >= TODAY, `Expired performance exception ${exception.id}`);
    assert.ok(
      baseline.budgets.some(({ id }: { id: string }) => id === exception.budgetId),
      `${exception.id} references an unknown budget`,
    );
  }

  const comparisons = measurements.map(({ fixture, value, samples }) => {
    const budget = baseline.budgets.find(({ id }: { id: string }) => id === fixture.id);
    assert.ok(budget, `Missing component performance budget ${fixture.id}`);
    assert.equal(budget.fixtureSha256, sha256(readFileSync(join(ROOT, fixture.path))));
    assert.equal(budget.sourceSha256, fixture.sourceDigest);
    assert.equal(budget.vectorSha256, fixture.vectorDigest);
    assert.equal(budget.markupSha256, fixture.markupDigest);
    assert.equal(budget.postconditionSha256, fixture.expectedPostconditionDigest);
    const exception = baseline.exceptions.find(
      ({ budgetId }: { budgetId: string }) => budgetId === fixture.id,
    );
    const limit = exception?.maximum ?? budget.blockAt;
    let status = 'passed';
    if (value > limit) {
      status = 'blocked';
    } else if (value > budget.warnAt) {
      status = 'warning';
    }
    return {
      id: fixture.id,
      value,
      samples,
      baseline: budget.baseline,
      warnAt: budget.warnAt,
      blockAt: budget.blockAt,
      limit,
      status,
      exceptionId: exception?.id,
    };
  });

  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(
    OUTPUT,
    `${JSON.stringify(
      {
        schemaVersion: '1.0.0',
        baselineCapturedOn: baseline.capturedOn,
        baselineEnvironment: baseline.environment,
        currentEnvironment: environment,
        comparisons,
      },
      null,
      2,
    )}\n`,
  );

  for (const comparison of comparisons) {
    process.stdout.write(
      `${comparison.status.toUpperCase()}: ${comparison.id} ${comparison.value} milliseconds\n`,
    );
  }
  assert.equal(
    comparisons.filter(({ status }) => status === 'blocked').length,
    0,
    `Component performance regression exceeded an understood limit; inspect ${OUTPUT}`,
  );
  process.stdout.write(`OK: ${comparisons.length} component performance budgets\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
