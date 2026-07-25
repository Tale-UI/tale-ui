import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('metrics dashboard retains explicit coverage and privacy boundaries', () => {
  const snapshot = JSON.parse(readFileSync(join(root, 'registry/metrics/current.json'), 'utf8'));
  assert.equal(snapshot.metrics.length, 13);
  assert.deepEqual(snapshot.privacy, {
    projectTelemetry: false,
    userIdentifiers: false,
    consentClass: 'public-aggregate',
  });
  assert.ok(snapshot.metrics.some(({ coverage }) => coverage === 'complete'));
  assert.ok(snapshot.metrics.some(({ coverage }) => coverage === 'unavailable'));
  assert.ok(
    snapshot.metrics
      .filter(({ coverage }) => coverage === 'unavailable')
      .every(({ value, decisionUse }) => value === null && decisionUse === false),
  );
  assert.match(
    readFileSync(join(root, 'apps/metrics-dashboard/dist/index.html'), 'utf8'),
    /Missing observations are never rendered as zero/,
  );
});
