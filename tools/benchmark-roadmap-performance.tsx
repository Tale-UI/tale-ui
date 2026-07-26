#!/usr/bin/env node

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { performance } from 'node:perf_hooks';
import { dirname, join, resolve } from 'node:path';
// Ajv exposes its draft-2020 entry with the runtime extension.
// eslint-disable-next-line import/extensions
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import * as ReactDOMServer from 'react-dom/server';
import { JSDOM } from 'jsdom';
import { build, version as viteVersion } from 'vite';
// The benchmark intentionally measures the source entry before packaging.
// eslint-disable-next-line import/no-relative-packages, import/extensions
import { AppShell } from '../packages/react/src/app-shell/index.ts';

const ROOT = resolve(process.cwd());
const args = process.argv.slice(2);
const CAPTURE = args.includes('--capture');
const BASELINE_PATH = join(ROOT, 'test/baselines/roadmap/performance-budgets.json');
const outputIndex = args.indexOf('--output');
const OUTPUT =
  outputIndex === -1
    ? join(ROOT, '.artifacts/performance-current.json')
    : resolve(ROOT, args[outputIndex + 1]);
const TODAY = new Date().toISOString().slice(0, 10);
const SAMPLE_COUNT = 15;

type Metric = {
  id: string;
  surface: 'esm' | 'minimal-app-js' | 'css' | 'ssr' | 'hydration' | 'table' | 'charts' | 'a2ui';
  description: string;
  unit: 'bytes-gzip' | 'milliseconds';
  value: number;
  owner: string;
  evidence: string;
};

function round(value: number, places = 3) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function median(values: number[]) {
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

function readJson(path: string) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

async function bundleGzip(entry: string) {
  const result = await build({
    root: ROOT,
    configFile: false,
    logLevel: 'silent',
    build: {
      write: false,
      minify: true,
      sourcemap: false,
      lib: { entry: join(ROOT, entry), formats: ['es'] },
      rollupOptions: {
        external(id) {
          return !id.startsWith('.') && !id.startsWith('/') && !id.startsWith('\0');
        },
      },
    },
  });
  const outputs = Array.isArray(result) ? result : [result];
  return outputs
    .flatMap(({ output }) => output)
    .filter((item) => item.type === 'chunk')
    .reduce((sum, chunk) => sum + gzipSync(chunk.code).byteLength, 0);
}

function fixture() {
  return (
    <AppShell.Root>
      <AppShell.SkipLink />
      <AppShell.Header>Header</AppShell.Header>
      <AppShell.Sidebar>Navigation</AppShell.Sidebar>
      <AppShell.Main>
        <h1>Performance fixture</h1>
        {Array.from({ length: 25 }, (_, index) => (
          <p key={index}>Deterministic server-rendered content {index + 1}</p>
        ))}
      </AppShell.Main>
    </AppShell.Root>
  );
}

function HydrationSentinel({ onHydrated }: { onHydrated: () => void }) {
  React.useEffect(onHydrated, [onHydrated]);
  return null;
}

function measureSsr() {
  const samples = [];
  for (let index = 0; index < SAMPLE_COUNT; index += 1) {
    const started = performance.now();
    ReactDOMServer.renderToString(fixture());
    samples.push(performance.now() - started);
  }
  return round(median(samples));
}

async function measureHydration() {
  const html = ReactDOMServer.renderToString(fixture());
  const samples = [];
  for (let index = 0; index < 7; index += 1) {
    const dom = new JSDOM(`<div id="root">${html}</div>`, {
      pretendToBeVisual: true,
      url: 'https://tale-ui.test/',
    });
    const globals = {
      window: dom.window,
      document: dom.window.document,
      navigator: dom.window.navigator,
      HTMLElement: dom.window.HTMLElement,
    };
    const previous = new Map(
      Object.keys(globals).map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]),
    );
    for (const [key, value] of Object.entries(globals)) {
      Object.defineProperty(globalThis, key, {
        configurable: true,
        writable: true,
        value,
      });
    }
    const container = dom.window.document.querySelector('#root');
    assert.ok(container);
    let markHydrated = () => {};
    const hydrated = new Promise<void>((resolveHydrated) => {
      markHydrated = resolveHydrated;
    });
    const started = performance.now();
    const root = ReactDOMClient.hydrateRoot(
      container,
      <React.Fragment>
        {fixture()}
        <HydrationSentinel onHydrated={markHydrated} />
      </React.Fragment>,
    );
    // Samples share process globals, so hydration must remain sequential.
    // eslint-disable-next-line no-await-in-loop
    await hydrated;
    samples.push(performance.now() - started);
    root.unmount();
    // eslint-disable-next-line no-await-in-loop
    await new Promise<void>((resolveUnmount) => {
      setImmediate(resolveUnmount);
    });
    dom.window.close();
    for (const [key, descriptor] of previous) {
      if (descriptor) {
        Object.defineProperty(globalThis, key, descriptor);
      } else {
        Reflect.deleteProperty(globalThis, key);
      }
    }
  }
  return round(median(samples));
}

function buildCssAndMeasure() {
  const result = spawnSync(process.execPath, ['tools/build-css.js'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return gzipSync(readFileSync(join(ROOT, 'packages/css/dist/style.min.css'))).byteLength;
}

async function main() {
  const tableController = readJson(join(ROOT, 'test/baselines/roadmap/table-controller.json'));
  const tableSorting = readJson(join(ROOT, 'test/baselines/roadmap/table-sorting.json'));
  const table10kP95 = Math.max(
    ...[...tableController.cases, ...tableSorting.cases]
      .filter(({ name }) => name.includes('10k'))
      .map(({ summaryMs }) => summaryMs.p95),
  );

  const metrics: Metric[] = [
    {
      id: 'react-esm-gzip',
      surface: 'esm',
      description: 'Minified first-party JavaScript in the @tale-ui/react ESM entry.',
      unit: 'bytes-gzip',
      value: await bundleGzip('packages/react/src/index.ts'),
      owner: 'Design Systems',
      evidence: 'Vite library build with third-party and workspace bare imports externalized.',
    },
    {
      id: 'minimal-app-js-gzip',
      surface: 'minimal-app-js',
      description: 'Minified first-party JavaScript for a minimal Button import.',
      unit: 'bytes-gzip',
      value: await bundleGzip('packages/react/src/button/index.ts'),
      owner: 'Design Systems',
      evidence: 'Vite library build of the smallest representative interactive entry.',
    },
    {
      id: 'css-gzip',
      surface: 'css',
      description: 'Published minified CSS foundation and component dependency surface.',
      unit: 'bytes-gzip',
      value: buildCssAndMeasure(),
      owner: 'Design Systems',
      evidence: 'tools/build-css.js output at packages/css/dist/style.min.css.',
    },
    {
      id: 'ssr-median',
      surface: 'ssr',
      description: 'Median renderToString time for a deterministic AppShell fixture.',
      unit: 'milliseconds',
      value: measureSsr(),
      owner: 'Design Systems',
      evidence: `${SAMPLE_COUNT} in-process React server-render samples.`,
    },
    {
      id: 'hydration-median',
      surface: 'hydration',
      description: 'Median hydrateRoot commit time for the AppShell SSR fixture.',
      unit: 'milliseconds',
      value: await measureHydration(),
      owner: 'Design Systems',
      evidence: 'Seven isolated JSDOM hydration samples after deterministic SSR.',
    },
    {
      id: 'table-10k-p95',
      surface: 'table',
      description: 'Worst recorded p95 across maintained 10k Table controller and sorting cases.',
      unit: 'milliseconds',
      value: table10kP95,
      owner: 'Design Systems',
      evidence: 'test/baselines/roadmap/table-controller.json and table-sorting.json.',
    },
    {
      id: 'charts-esm-gzip',
      surface: 'charts',
      description: 'Minified first-party JavaScript in the @tale-ui/charts ESM entry.',
      unit: 'bytes-gzip',
      value: await bundleGzip('packages/charts/src/index.ts'),
      owner: 'Data Visualization',
      evidence: 'Vite library build with React and Recharts externalized.',
    },
    {
      id: 'a2ui-esm-gzip',
      surface: 'a2ui',
      description: 'Minified first-party JavaScript in the @tale-ui/a2ui ESM entry.',
      unit: 'bytes-gzip',
      value: await bundleGzip('packages/a2ui/src/index.ts'),
      owner: 'AI Experience',
      evidence: 'Vite library build with renderer dependencies externalized.',
    },
  ];

  const expectedSurfaces = [
    'esm',
    'minimal-app-js',
    'css',
    'ssr',
    'hydration',
    'table',
    'charts',
    'a2ui',
  ];
  assert.deepEqual(
    new Set(metrics.map(({ surface }) => surface)),
    new Set(expectedSurfaces),
    'Performance runner must preserve every roadmap surface',
  );

  if (CAPTURE) {
    const budget = {
      $schema: '../../schemas/performance-budget.schema.json',
      schemaVersion: '1.0.0',
      capturedOn: TODAY,
      runner: {
        nodeMajor: Number(process.versions.node.split('.')[0]),
        vite: viteVersion,
        samples: SAMPLE_COUNT,
      },
      budgets: metrics.map((metric) => {
        const timing = metric.unit === 'milliseconds';
        const warnAt = timing
          ? round(Math.max(metric.value * 2, metric.value + 5))
          : Math.ceil(Math.max(metric.value * 1.1, metric.value + 512));
        const blockAt = timing
          ? round(Math.max(metric.value * 3, metric.value + 10, metric.surface === 'table' ? 5 : 0))
          : Math.ceil(Math.max(metric.value * 1.25, metric.value + 1024));
        return {
          id: metric.id,
          surface: metric.surface,
          description: metric.description,
          unit: metric.unit,
          baseline: metric.value,
          warnAt,
          blockAt,
          owner: metric.owner,
          evidence: metric.evidence,
        };
      }),
      exceptions: [],
    };
    mkdirSync(dirname(BASELINE_PATH), { recursive: true });
    writeFileSync(BASELINE_PATH, `${JSON.stringify(budget, null, 2)}\n`);
    process.stdout.write(`CAPTURED: ${BASELINE_PATH.slice(ROOT.length + 1)}\n`);
    return;
  }

  const baseline = readJson(BASELINE_PATH);
  const schema = readJson(join(ROOT, 'schemas/performance-budget.schema.json'));
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const validator = ajv.compile(schema);
  assert.ok(validator(baseline), ajv.errorsText(validator.errors, { separator: '\n' }));
  assert.deepEqual(
    baseline.budgets.map(({ id }) => id),
    metrics.map(({ id }) => id),
    'Performance baseline must preserve the exact maintained metric order',
  );
  for (const exception of baseline.exceptions) {
    assert.ok(exception.expiresOn >= TODAY, `Expired performance exception ${exception.id}`);
    assert.ok(
      baseline.budgets.some(({ id }) => id === exception.budgetId),
      `${exception.id} references an unknown budget`,
    );
  }

  const comparisons = metrics.map((metric) => {
    const budget = baseline.budgets.find(({ id }) => id === metric.id);
    const exception = baseline.exceptions.find(({ budgetId }) => budgetId === metric.id);
    const limit = exception?.maximum ?? budget.blockAt;
    let status = 'passed';
    if (metric.value > limit) {
      status = 'blocked';
    } else if (metric.value > budget.warnAt) {
      status = 'warning';
    }
    return {
      ...metric,
      baseline: budget.baseline,
      warnAt: budget.warnAt,
      blockAt: budget.blockAt,
      limit,
      trendPercent:
        budget.baseline === 0
          ? 0
          : round(((metric.value - budget.baseline) / budget.baseline) * 100),
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
        runner: { node: process.versions.node, vite: viteVersion },
        comparisons,
      },
      null,
      2,
    )}\n`,
  );

  for (const comparison of comparisons) {
    process.stdout.write(
      `${comparison.status.toUpperCase()}: ${comparison.id} ${comparison.value} ${comparison.unit} (${comparison.trendPercent >= 0 ? '+' : ''}${comparison.trendPercent}%)\n`,
    );
  }
  assert.equal(
    comparisons.filter(({ status }) => status === 'blocked').length,
    0,
    `Performance regression exceeded an understood limit; inspect ${OUTPUT}`,
  );
  process.stdout.write(`OK: ${comparisons.length} maintained performance budgets\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
