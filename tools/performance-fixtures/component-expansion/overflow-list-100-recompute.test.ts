import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { after, test } from 'node:test';
import {
  overflowList100RecomputeFixture,
  overflowListExpectedPostconditionDigest,
  overflowListMarkupDigest,
  overflowListSourceDigest,
  overflowListVectorDigest,
} from './overflow-list-100-recompute.tsx';
import {
  overflowListExpectedCallbackCounts,
  overflowListExpectedVisibleCounts,
  overflowListKeys,
  overflowListWidths,
} from './overflow-list-100-recompute.shared.ts';

const REPOSITORY_ROOT = resolve(process.cwd());

function sha256(value: string | Buffer) {
  return createHash('sha256').update(value).digest('hex');
}

const expectedFileDigests = {
  'tools/performance-fixtures/component-expansion/overflow-list-100-recompute.shared.ts':
    '594ca082c328d01222bd0127ad898bcd1b197ed2321fef65559ec525a85edd6d',
  'tools/performance-fixtures/component-expansion/overflow-list-100-recompute.html':
    '0b58e5f4fcb628e99d5cba8ef04cf4eecdd46b9b2c2107572c1a5667fe34b01f',
  'tools/performance-fixtures/component-expansion/overflow-list-100-recompute.browser.tsx':
    '17ea55bb997941dc5045c9a1b2846c4c89b00597cea8a364de350ea315ca26f6',
  'tools/performance-fixtures/component-expansion/overflow-list-100-recompute.tsx':
    'adfc5b963abd67351a1f2a9e0554679dc24b0e34ced5458a53f137a50e53d375',
} as const;

after(async () => {
  await overflowList100RecomputeFixture.teardown?.();
});

test('freezes the exact OverflowList benchmark vectors, files, and semantic digests', () => {
  assert.equal(overflowListKeys.length, 100);
  assert.equal(overflowListKeys[0], 'item-000');
  assert.equal(overflowListKeys[99], 'item-099');
  assert.deepEqual(
    overflowListWidths,
    Array.from({ length: 100 }, (_, index) => 84 + 40 * index),
  );
  assert.deepEqual(overflowListExpectedVisibleCounts, [
    ...Array.from({ length: 98 }, (_, index) => index + 1),
    100,
    100,
  ]);
  assert.deepEqual(overflowListExpectedCallbackCounts, [
    ...Array.from({ length: 98 }, (_, index) => index + 1),
    100,
  ]);
  assert.equal(
    overflowListSourceDigest,
    '36da48dd80925985d17126a57c61fd4c59be1feabe610ff0b09ff7e3536f76e2',
  );
  assert.equal(
    overflowListVectorDigest,
    'bd3337f69a74455f29f39481fb2c0a18cbb4fc3f5d49c57869e8790f0bf223ef',
  );
  assert.equal(
    overflowListMarkupDigest,
    '59944724e9b2849fdc254c7767e3c78b1eea52535c45b63e4575f35a94f94287',
  );
  assert.equal(
    overflowListExpectedPostconditionDigest,
    'd3d34b8d86b7252f142ad5ca92f8e88a7f71f18062a7c5d6fc4ca4240c6e51d3',
  );

  for (const [path, expectedDigest] of Object.entries(expectedFileDigests)) {
    assert.equal(sha256(readFileSync(resolve(REPOSITORY_ROOT, path))), expectedDigest, path);
  }
});

test('reuses Vite and Chromium while retaining fresh deterministic sample state', async () => {
  const first = await overflowList100RecomputeFixture.runSample();
  const second = await overflowList100RecomputeFixture.runSample();

  assert.ok(Number.isFinite(first.duration) && first.duration >= 0);
  assert.ok(Number.isFinite(second.duration) && second.duration >= 0);
  assert.equal(first.postconditionDigest, overflowListExpectedPostconditionDigest);
  assert.equal(second.postconditionDigest, overflowListExpectedPostconditionDigest);
});
