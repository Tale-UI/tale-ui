import assert from 'node:assert/strict';
import test from 'node:test';
import {
  compareCanonicalStrings,
  computeArtifactSourceRevision,
  normalizeArtifactSourceText,
} from './artifact-canonical.mjs';

test('canonical ordering matches generator locale ordering for punctuation', () => {
  const ids = ['tale:foundation:a2ui-integration', 'tale:foundation:a_b'];
  assert.deepEqual(ids.toSorted(compareCanonicalStrings), [
    'tale:foundation:a_b',
    'tale:foundation:a2ui-integration',
  ]);
});

test('source revisions normalize CRLF before hashing', () => {
  const paths = ['registry/source.json'];
  assert.equal(normalizeArtifactSourceText('first\r\nsecond\r\n'), 'first\nsecond\n');
  assert.equal(
    computeArtifactSourceRevision(paths, () => 'first\r\nsecond\r\n'),
    computeArtifactSourceRevision(paths, () => 'first\nsecond\n'),
  );
});
