import assert from 'node:assert/strict';
import test from 'node:test';
import { getArtifact, searchArtifacts } from './artifact-core.mjs';

test('mixed-kind search returns stable IDs and correlated registry data', () => {
  const result = searchArtifacts({ query: 'table', limit: 100 });
  const kinds = new Set(result.results.map((entry) => entry.kind));
  assert.match(result.registryVersion, /^\d+\.\d+\.\d+$/);
  assert.match(result.sourceRevision, /^sha256:[a-f0-9]{64}$/);
  assert.ok(kinds.has('component'));
  assert.ok(kinds.has('recipe'));
  assert.ok(kinds.has('a2ui-type'));
  assert.ok(result.results.every((entry) => entry.id.startsWith('tale:')));
});

test('deprecated components retain stable replacement IDs', () => {
  const checkbox = getArtifact('tale:component:checkbox');
  assert.equal(checkbox.lifecycle, 'deprecated');
  assert.equal(checkbox.replacementId, 'tale:component:checkbox-field');
});

test('search filters kinds and uses deterministic ID ordering for ties', () => {
  const result = searchArtifacts({ query: '', kinds: ['foundation'], limit: 100 });
  assert.ok(result.results.length > 0);
  assert.ok(result.results.every((entry) => entry.kind === 'foundation'));
  assert.deepEqual(
    result.results.map((entry) => entry.id),
    result.results.map((entry) => entry.id).toSorted(),
  );
});
