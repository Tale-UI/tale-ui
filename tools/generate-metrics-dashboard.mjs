#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const DEFINITIONS_PATH = join(ROOT, 'registry/metrics/definitions.json');
const CHECKPOINT_PATH = join(ROOT, 'registry/metrics/provider-checkpoint.json');
const SNAPSHOT_PATH = join(ROOT, 'registry/metrics/current.json');
const COVERAGE_PATH = join(ROOT, 'registry/metrics/coverage.json');
const ROLLBACK_PATH = join(ROOT, 'registry/metrics/rollback.json');
const DIST = join(ROOT, 'apps/metrics-dashboard/dist');

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function canonical(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function healthValue(metricId) {
  const artifacts = readJson(join(ROOT, 'registry/artifacts.json')).artifacts;
  const components = readJson(join(ROOT, 'registry/components.json')).components;
  const goldens = readJson(join(ROOT, 'tools/golden-prompts/index.json')).prompts;
  const knownViolations = readJson(join(ROOT, 'test/accessibility/baseline.json')).knownViolations;
  const templates = readdirSync(join(ROOT, 'packages/tooling/templates')).filter((name) =>
    existsSync(join(ROOT, 'packages/tooling/templates', name, 'template.json')),
  );
  const migrations = readdirSync(join(ROOT, 'packages/tooling/migrations')).filter((name) =>
    existsSync(join(ROOT, 'packages/tooling/migrations', name, 'manifest.json')),
  );
  if (metricId === 'structural-docs-coverage') {
    return {
      artifacts: artifacts.length,
      components: components.length,
      componentDocs: components.filter(({ slug }) =>
        existsSync(join(ROOT, 'docs/components', `${slug}.md`)),
      ).length,
      templates: templates.length,
      migrationGroups: migrations.length,
    };
  }
  if (metricId === 'golden-a11y-health') {
    return {
      goldenPrompts: goldens.length,
      knownLegacyAxeViolations: knownViolations.length,
      changedComponentAxeGate: true,
      maintainedPerformanceBudgets: readJson(
        join(ROOT, 'analysis/baselines/performance-budgets.json'),
      ).budgets.length,
    };
  }
  throw new Error(`Unknown repository metric ${metricId}`);
}

function providerValue(metricId, value) {
  if (!value) {
    return null;
  }
  if (metricId === 'package-downloads') {
    return value.downloadsLast30Days ?? null;
  }
  if (metricId === 'issues-by-component-version') {
    return value.openIssuesByComponentVersion ?? null;
  }
  if (metricId === 'release-cadence') {
    return value.releaseCadence ?? null;
  }
  return null;
}

function unavailableMetric(definition, reason) {
  const { source, targetHours, ...identity } = definition;
  return {
    ...identity,
    definitionVersion: '1.0.0',
    consentClass: 'public-aggregate',
    coverage: 'unavailable',
    freshness: { status: 'unavailable', targetHours },
    value: null,
    provenance: [source],
    collectionError: reason,
    decisionUse: false,
  };
}

function buildSnapshot() {
  const definitions = readJson(DEFINITIONS_PATH);
  const checkpoint = readJson(CHECKPOINT_PATH);
  const metrics = definitions.metrics.map((definition) => {
    const { source: definitionSource, targetHours, ...identity } = definition;
    if (definitionSource === 'repository-generated') {
      return {
        ...identity,
        definitionVersion: definitions.definitionVersion,
        consentClass: 'public-aggregate',
        coverage: 'complete',
        freshness: {
          status: 'current',
          targetHours,
          asOf: definitions.capturedAt,
        },
        value: healthValue(definition.metricId),
        provenance: [
          'registry/artifacts.json',
          'registry/components.json',
          'tools/golden-prompts/index.json',
          'test/accessibility/baseline.json',
          'analysis/baselines/performance-budgets.json',
        ],
        decisionUse: true,
      };
    }
    if (definitionSource.startsWith('unavailable-')) {
      return unavailableMetric(
        definition,
        'Unavailable by the approved no-project-telemetry metrics boundary.',
      );
    }
    const source = checkpoint.sources[definitionSource];
    const value = providerValue(definition.metricId, source?.value);
    if (!source || source.status === 'unavailable' || value === null) {
      return unavailableMetric(
        definition,
        source?.collectionError ?? 'No valid public provider observation is retained.',
      );
    }
    return {
      ...identity,
      definitionVersion: definitions.definitionVersion,
      consentClass: 'public-aggregate',
      coverage: source.status === 'current' ? 'complete' : 'partial',
      freshness: {
        status: source.status,
        targetHours,
        ...(source.asOf ? { asOf: source.asOf } : {}),
      },
      value,
      provenance: [definitionSource],
      ...(source.collectionError ? { collectionError: source.collectionError } : {}),
      decisionUse: source.status === 'current',
    };
  });
  const withoutDigest = {
    $schema: '../../schemas/metrics.schema.json',
    schemaVersion: '1.0.0',
    snapshotId: 'tale:metrics:current',
    definitionVersion: definitions.definitionVersion,
    capturedAt: definitions.capturedAt,
    privacy: {
      projectTelemetry: false,
      userIdentifiers: false,
      consentClass: 'public-aggregate',
    },
    metrics,
  };
  return { ...withoutDigest, digest: `sha256:${sha256(canonical(withoutDigest))}` };
}

function validate(snapshot) {
  const schema = readJson(join(ROOT, 'schemas/metrics.schema.json'));
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const validator = ajv.compile(schema);
  if (!validator(snapshot)) {
    throw new Error(ajv.errorsText(validator.errors, { separator: '\n' }));
  }
}

function coverage(snapshot) {
  const counts = { complete: 0, partial: 0, unavailable: 0 };
  for (const metric of snapshot.metrics) {
    counts[metric.coverage] += 1;
  }
  return {
    schemaVersion: '1.0.0',
    snapshotId: snapshot.snapshotId,
    capturedAt: snapshot.capturedAt,
    counts,
    decisionMetricIds: snapshot.metrics
      .filter(({ decisionUse }) => decisionUse)
      .map(({ metricId }) => metricId),
    unavailableMetricIds: snapshot.metrics
      .filter(({ coverage: status }) => status === 'unavailable')
      .map(({ metricId }) => metricId),
  };
}

function rollback(snapshot) {
  return {
    schemaVersion: '1.0.0',
    lastKnownGoodSnapshot: 'registry/metrics/current.json',
    snapshotDigest: snapshot.digest,
    rollbackCompatible: true,
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function dashboard(snapshot, report) {
  const cards = snapshot.metrics
    .map(
      (metric) => `<article class="metric metric--${metric.coverage}">
  <p class="eyebrow">${escapeHtml(metric.category)} · ${escapeHtml(metric.coverage)}</p>
  <h2>${escapeHtml(metric.title)}</h2>
  <pre>${escapeHtml(metric.value === null ? 'Unavailable' : JSON.stringify(metric.value, null, 2))}</pre>
  <p>${escapeHtml(metric.collectionError ?? `Current within ${metric.freshness.targetHours}h target.`)}</p>
  <p class="source">Source: ${escapeHtml(metric.provenance.join(', '))}</p>
</article>`,
    )
    .join('\n');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Tale UI adoption and health</title>
<style>
  :root { color-scheme: light; font-family: system-ui, sans-serif; }
  body { background: #f4f7fb; color: #152033; margin: 0; }
  main { margin: 0 auto; max-width: 76rem; padding: 2rem; }
  .summary { background: #12233f; border-radius: 1rem; color: white; padding: 1.5rem; }
  .grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); margin-top: 1rem; }
  .metric { background: white; border: 1px solid #cad5e5; border-radius: .75rem; padding: 1rem; }
  .metric--unavailable { border-color: #bf8a19; }
  .eyebrow, .source { color: #53647d; font-size: .8rem; text-transform: uppercase; }
  pre { overflow: auto; white-space: pre-wrap; }
</style></head><body><main>
<section class="summary"><h1>Tale UI adoption and health</h1>
<p>${report.counts.complete} complete, ${report.counts.partial} partial, ${report.counts.unavailable} unavailable. Missing observations are never rendered as zero.</p>
<p>Public aggregates only. No project telemetry or user identifiers.</p></section>
<div class="grid">${cards}</div>
</main></body></html>`;
}

const snapshot = buildSnapshot();
validate(snapshot);
const report = coverage(snapshot);
const rollbackRecord = rollback(snapshot);
if (CHECK) {
  for (const [path, value] of [
    [SNAPSHOT_PATH, snapshot],
    [COVERAGE_PATH, report],
    [ROLLBACK_PATH, rollbackRecord],
  ]) {
    if (readFileSync(path, 'utf8') !== canonical(value)) {
      throw new Error(`${path} is stale; run pnpm metrics:generate.`);
    }
  }
  console.log(
    `OK: ${snapshot.metrics.length} metrics (${report.counts.complete} complete, ${report.counts.partial} partial, ${report.counts.unavailable} unavailable)`,
  );
  process.exit(0);
}

mkdirSync(dirname(SNAPSHOT_PATH), { recursive: true });
writeFileSync(SNAPSHOT_PATH, canonical(snapshot));
writeFileSync(COVERAGE_PATH, canonical(report));
writeFileSync(ROLLBACK_PATH, canonical(rollbackRecord));
mkdirSync(DIST, { recursive: true });
writeFileSync(join(DIST, 'index.html'), dashboard(snapshot, report));
writeFileSync(join(DIST, 'metrics.json'), canonical(snapshot));
writeFileSync(join(DIST, 'coverage.json'), canonical(report));
console.log(`Generated static dashboard for ${snapshot.metrics.length} metrics.`);
