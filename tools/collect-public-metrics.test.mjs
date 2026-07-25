import assert from 'node:assert/strict';
import { test } from 'node:test';
import { normalizeProviderFixture } from './collect-public-metrics.mjs';

test('public metrics aggregation deduplicates replayed provider records', () => {
  const normalized = normalizeProviderFixture({
    npm: [
      { package: '@tale-ui/react', downloads: 10 },
      { package: '@tale-ui/react', downloads: 10 },
    ],
    github: {
      issues: [
        { id: 'issue-1', component: 'button', version: '2' },
        { id: 'issue-1', component: 'button', version: '2' },
      ],
      releases: [
        { tag: 'react-v2.0.0', publishedAt: '2026-07-20T00:00:00Z' },
        { tag: 'react-v2.0.0', publishedAt: '2026-07-20T00:00:00Z' },
      ],
    },
  });
  assert.deepEqual(normalized.downloadsLast30Days, { '@tale-ui/react': 10 });
  assert.deepEqual(normalized.openIssuesByComponentVersion, { 'button@2': 1 });
  assert.deepEqual(normalized.releaseCadence, {
    releasesLast365Days: 1,
    latestReleaseAt: '2026-07-20T00:00:00Z',
  });
});
