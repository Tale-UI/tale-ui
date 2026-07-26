#!/usr/bin/env node

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { cpus, totalmem } from 'node:os';
import { performance } from 'node:perf_hooks';
// This benchmark deliberately reaches the unexported prototype without making it public.
// eslint-disable-next-line import/no-relative-packages, import/extensions
import { sortTableRows } from '../packages/react/src/table/TableController.experimental.ts';

const WARMUP_ITERATIONS = 3;
const MEASURED_ITERATIONS = 15;

interface Row {
  id: string;
  score: number;
}

function rows(count: number): Row[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `row-${index}`,
    score: (index * 48_271) % 2_147_483_647,
  }));
}

function digest(value: unknown) {
  return `sha256:${createHash('sha256').update(JSON.stringify(value)).digest('hex')}`;
}

function round(value: number) {
  return Number(value.toFixed(4));
}

function summarize(samples: number[]) {
  const sorted = samples.toSorted((left, right) => left - right);
  return {
    minimum: sorted[0]!,
    median: sorted[Math.floor(sorted.length / 2)]!,
    p95: sorted[Math.ceil(sorted.length * 0.95) - 1]!,
    maximum: sorted.at(-1)!,
  };
}

function measure(name: string, operation: 'selection-clone' | 'stable-sort', rowCount: number) {
  const sourceRows = rows(rowCount);
  const selectedKeys = new Set(sourceRows.map((row) => row.id));
  const run =
    operation === 'stable-sort'
      ? () =>
          sortTableRows(
            sourceRows,
            { column: 'score', direction: 'ascending' },
            (left, right) => left.score - right.score,
          ).map((row) => row.id)
      : () => {
          const copy = new Set(selectedKeys);
          return [copy.size, copy.has('row-0'), copy.has(`row-${rowCount - 1}`)];
        };

  for (let index = 0; index < WARMUP_ITERATIONS; index += 1) {
    run();
  }
  const samplesMs: number[] = [];
  let result: unknown;
  for (let index = 0; index < MEASURED_ITERATIONS; index += 1) {
    const started = performance.now();
    result = run();
    samplesMs.push(round(performance.now() - started));
  }
  return {
    name,
    operation,
    rowCount,
    samplesMs,
    summaryMs: summarize(samplesMs),
    resultDigest: digest(result),
  };
}

const result = {
  schemaVersion: '1.0.0',
  environment: {
    node: process.version,
    platform: process.platform,
    architecture: process.arch,
    logicalCpuCount: cpus().length,
    totalMemoryBytes: totalmem(),
  },
  method: {
    runtime: 'packages/react/src/table/TableController.experimental.ts',
    warmupIterations: WARMUP_ITERATIONS,
    measuredIterations: MEASURED_ITERATIONS,
    clock: 'performance.now',
  },
  cases: [
    measure('selection clone — 1k keys', 'selection-clone', 1_000),
    measure('selection clone — 10k keys', 'selection-clone', 10_000),
    measure('stable local sort — 1k rows', 'stable-sort', 1_000),
    measure('stable local sort — 10k rows', 'stable-sort', 10_000),
  ],
};

if (process.argv.includes('--check')) {
  const baseline = JSON.parse(
    readFileSync(
      new URL('../test/baselines/roadmap/table-controller.json', import.meta.url),
      'utf8',
    ),
  ) as typeof result;
  const deterministicResults = (benchmark: typeof result) =>
    benchmark.cases.map(({ operation, rowCount, resultDigest }) => ({
      operation,
      rowCount,
      resultDigest,
    }));
  assert.deepEqual(
    deterministicResults(result),
    deterministicResults(baseline),
    'Table benchmark result digests have drifted; inspect the prototype and recapture an approved baseline.',
  );
  process.stdout.write(
    'OK: Table controller selection/sorting 1k/10k result digests match baseline\n',
  );
} else {
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}
