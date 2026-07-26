import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { componentPerformanceBrowserHarness } from './browser-performance-harness.ts';
import {
  OVERFLOW_LIST_CONTROL_WIDTH,
  OVERFLOW_LIST_GAP,
  OVERFLOW_LIST_ITEM_COUNT,
  OVERFLOW_LIST_ITEM_WIDTH,
  OVERFLOW_LIST_MEASUREMENT_KEY,
  overflowListExpectedCallbackCounts,
  overflowListExpectedVisibleCounts,
  overflowListKeys,
  overflowListWidths,
} from './overflow-list-100-recompute.shared.ts';
import type { ComponentPerformanceFixture, ComponentPerformanceSample } from './types.ts';

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export const overflowListSourceDigest = sha256(
  JSON.stringify({
    itemCount: OVERFLOW_LIST_ITEM_COUNT,
    itemWidth: OVERFLOW_LIST_ITEM_WIDTH,
    gap: OVERFLOW_LIST_GAP,
    controlWidth: OVERFLOW_LIST_CONTROL_WIDTH,
    keys: overflowListKeys,
    collapseFrom: 'end',
    minVisibleItems: 0,
    measurementKey: OVERFLOW_LIST_MEASUREMENT_KEY,
  }),
);
export const overflowListVectorDigest = sha256(JSON.stringify(overflowListWidths));
export const overflowListMarkupDigest =
  '59944724e9b2849fdc254c7767e3c78b1eea52535c45b63e4575f35a94f94287';

export const overflowListExpectedPostcondition = {
  acts: 100,
  callbackVisibleCounts: overflowListExpectedCallbackCounts,
  controlInvocations: 197,
  finalHiddenCount: 0,
  finalVisibleCount: 100,
  frameCallbacksPerSettlement: [...Array.from({ length: 99 }, () => 2), 1],
  itemRenderCalls: 19_900,
  markupDigest: overflowListMarkupDigest,
  maxFrameCallbacksPerSettlement: 2,
  resizeObserverDeliveries: 100,
  settlingFrames: 100,
  visibleCounts: overflowListExpectedVisibleCounts,
};

export const overflowListExpectedPostconditionDigest = sha256(
  JSON.stringify(overflowListExpectedPostcondition),
);

interface BrowserBenchmarkResult {
  duration: number;
  postcondition: Omit<typeof overflowListExpectedPostcondition, 'markupDigest'> & {
    markup: string;
  };
}

async function runSample(): Promise<ComponentPerformanceSample> {
  const result = await componentPerformanceBrowserHarness.withFreshPage(
    '/tools/performance-fixtures/component-expansion/overflow-list-100-recompute.html',
    async (page) => {
      await page.waitForFunction(
        () =>
          window.taleOverflowListBenchmark !== undefined ||
          window.taleOverflowListBenchmarkError !== undefined,
      );
      const initializationError = await page.evaluate(() => window.taleOverflowListBenchmarkError);
      assert.equal(initializationError, undefined);
      return page.evaluate(() =>
        window.taleOverflowListBenchmark!.runSample(),
      ) as Promise<BrowserBenchmarkResult>;
    },
  );
  const markupDigest = sha256(result.postcondition.markup);
  const postcondition = {
    ...result.postcondition,
    markup: undefined,
    markupDigest,
  };
  Reflect.deleteProperty(postcondition, 'markup');
  assert.deepEqual(postcondition, overflowListExpectedPostcondition);

  return {
    duration: result.duration,
    postconditionDigest: overflowListExpectedPostconditionDigest,
  };
}

export const overflowList100RecomputeFixture: ComponentPerformanceFixture = {
  id: 'overflow-list-100-recompute',
  description:
    'One real-Chromium recompute across the exact 100-width OverflowList vector with deterministic layout and partition postconditions.',
  path: 'tools/performance-fixtures/component-expansion/overflow-list-100-recompute.tsx',
  setup:
    'Reuse Vite and Chromium outside timing; mount fresh page state at 83px, settle it, then reset counters before 100 synchronous width acts.',
  operationCount: 100,
  sourceDigest: overflowListSourceDigest,
  vectorDigest: overflowListVectorDigest,
  markupDigest: overflowListMarkupDigest,
  expectedPostconditionDigest: overflowListExpectedPostconditionDigest,
  runSample,
  teardown: () => componentPerformanceBrowserHarness.close(),
};
