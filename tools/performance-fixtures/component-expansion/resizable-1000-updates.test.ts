import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { after, test } from 'node:test';
import {
  resizable1000UpdatesFixture,
  resizableExpectedPostconditionDigest,
  resizableMarkupDigest,
  resizableProposalDigest,
  resizableSetupDigest,
  resizableSourceDigest,
  resizableTimedBoundaryDigest,
  resizableVectorDigest,
} from './resizable-1000-updates.tsx';
import {
  RESIZABLE_UPDATE_COUNT,
  resizablePositions,
  resizableSetup,
  resizableTimedBoundary,
} from './resizable-1000-updates.shared.ts';

const REPOSITORY_ROOT = resolve(process.cwd());

function sha256(value: string | Buffer) {
  return createHash('sha256').update(value).digest('hex');
}

const expectedFileDigests = {
  'tools/performance-fixtures/component-expansion/resizable-1000-updates.shared.ts':
    'db2fe9b9d15f911ad293ea1660d1eb42adf92234f998a8530110d32d85089cbe',
  'tools/performance-fixtures/component-expansion/resizable-1000-updates.html':
    'd5e5496af751a89f4c747bfa23891b7a7f574d7aa7b2cfba54caf029c1ddaa7d',
  'tools/performance-fixtures/component-expansion/resizable-1000-updates.browser.tsx':
    '001e554cb35aeb22828ce539ad312d6085d8f3e01a81070c840cd95864797625',
  'tools/performance-fixtures/component-expansion/resizable-1000-updates.tsx':
    'e5bc76e802e6955ede0d0f9d79e03bed896c7248777e6a3f3ba2260e685c9328',
} as const;

after(async () => {
  await resizable1000UpdatesFixture.teardown?.();
});

test('freezes the exact Resizable setup, position vector, timed boundary, files, and digests', () => {
  assert.equal(RESIZABLE_UPDATE_COUNT, 1_000);
  assert.ok(Object.isFrozen(resizableSetup));
  assert.ok(Object.isFrozen(resizableSetup.root));
  assert.ok(Object.isFrozen(resizableSetup.defaultSizes));
  assert.ok(Object.isFrozen(resizableSetup.bounds));
  assert.ok(Object.isFrozen(resizableSetup.bounds.A));
  assert.ok(Object.isFrozen(resizableSetup.bounds.B));
  assert.ok(Object.isFrozen(resizableSetup.bounds.C));
  assert.ok(Object.isFrozen(resizableSetup.activeHandle));
  assert.ok(Object.isFrozen(resizableSetup.pointer));
  assert.ok(Object.isFrozen(resizableSetup.pointer.origin));
  assert.ok(Object.isFrozen(resizableSetup.pointer.completion));
  assert.deepEqual(resizableSetup, {
    root: { left: 0, top: 0, width: 900, height: 240 },
    orientation: 'horizontal',
    direction: 'ltr',
    defaultSizes: { A: 40, B: 30, C: 30 },
    bounds: {
      A: { min: 20, max: 60 },
      B: { min: 20, max: 50 },
      C: { min: 10, max: 50 },
    },
    activeHandle: { id: 'h-ab', before: 'A', after: 'B' },
    keyboardStep: 1,
    keyboardLargeStep: 10,
    precision: 4,
    pointer: {
      id: 1,
      button: 0,
      origin: { clientX: 360, clientY: 20 },
      completion: { clientX: 450, clientY: 20 },
    },
  });

  assert.ok(Object.isFrozen(resizablePositions));
  assert.equal(resizablePositions.length, RESIZABLE_UPDATE_COUNT);
  assert.ok(resizablePositions.every(Object.isFrozen));
  assert.deepEqual(
    resizablePositions,
    Array.from({ length: RESIZABLE_UPDATE_COUNT }, (_, index) => ({
      clientX: 360 + 0.09 * (index + 1),
      clientY: 20,
    })),
  );
  assert.deepEqual(resizablePositions[0], { clientX: 360.09, clientY: 20 });
  assert.deepEqual(resizablePositions.at(-1), { clientX: 450, clientY: 20 });

  assert.ok(Object.isFrozen(resizableTimedBoundary));
  assert.ok(Object.isFrozen(resizableTimedBoundary.included));
  assert.ok(Object.isFrozen(resizableTimedBoundary.excluded));
  assert.deepEqual(resizableTimedBoundary, {
    clock: 'page:window.performance',
    operationCount: 1_000,
    included: [
      'one synchronous React.act',
      'one pointermove delivery',
      'resulting React render and callbacks',
    ],
    excluded: [
      'Vite and Chromium startup',
      'fresh browser context and page creation',
      'component import and initial mount',
      'pointerdown acquisition',
      'pointerup completion',
      'final settlement and assertions',
    ],
  });

  assert.equal(
    resizableSetupDigest,
    '4465d5b49daab0b65a775017fbc48ba0ee0a688785336794a5743c617039b0b4',
  );
  assert.equal(
    resizableVectorDigest,
    '5194fde66add271c757be24c21c5703618097893245e5a71208e4e8761a3204d',
  );
  assert.equal(
    resizableTimedBoundaryDigest,
    '1b5ad8c9ca1262856cb83b0bf5b3b771665db8bc0c894a767c0d37d19db7a8f1',
  );
  assert.equal(
    resizableSourceDigest,
    '6d57090645a547d6291be7a3ff63e5878172b4066104682f4fd12a0dc8769961',
  );
  assert.equal(
    resizableProposalDigest,
    'd0e829434fc7714ce32bdb3a30a287206d0a2127f22a6bf32380441db7b66b11',
  );
  assert.equal(
    resizableMarkupDigest,
    'da3d9fa843325d73b3abdf98940593e9cb8cbf9acb6006e0fc8629315054fe0b',
  );
  assert.equal(
    resizableExpectedPostconditionDigest,
    'c49378e8d739efdff8c0e1b5d9ecc27b5915582206cb290241db029cfc57cebb',
  );

  assert.equal(resizable1000UpdatesFixture.id, 'resizable-1000-updates');
  assert.equal(resizable1000UpdatesFixture.operationCount, 1_000);
  assert.equal(resizable1000UpdatesFixture.sourceDigest, resizableSourceDigest);
  assert.equal(resizable1000UpdatesFixture.vectorDigest, resizableVectorDigest);
  assert.equal(resizable1000UpdatesFixture.markupDigest, resizableMarkupDigest);
  assert.equal(
    resizable1000UpdatesFixture.expectedPostconditionDigest,
    resizableExpectedPostconditionDigest,
  );

  for (const [path, expectedDigest] of Object.entries(expectedFileDigests)) {
    assert.equal(sha256(readFileSync(resolve(REPOSITORY_ROOT, path))), expectedDigest, path);
  }
});

test('reuses Vite and Chromium while retaining fresh deterministic Resizable state', async () => {
  const first = await resizable1000UpdatesFixture.runSample();
  const second = await resizable1000UpdatesFixture.runSample();

  assert.ok(Number.isFinite(first.duration) && first.duration >= 0);
  assert.ok(Number.isFinite(second.duration) && second.duration >= 0);
  assert.equal(first.postconditionDigest, resizableExpectedPostconditionDigest);
  assert.equal(second.postconditionDigest, resizableExpectedPostconditionDigest);
});
