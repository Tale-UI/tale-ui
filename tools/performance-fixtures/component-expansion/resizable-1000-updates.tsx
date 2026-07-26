import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { componentPerformanceBrowserHarness } from './browser-performance-harness.ts';
import {
  RESIZABLE_UPDATE_COUNT,
  resizablePositions,
  resizableSetup,
  resizableTimedBoundary,
} from './resizable-1000-updates.shared.ts';
import type { ComponentPerformanceFixture, ComponentPerformanceSample } from './types.ts';

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export const resizableSetupDigest = sha256(JSON.stringify(resizableSetup));
export const resizableVectorDigest = sha256(JSON.stringify(resizablePositions));
export const resizableTimedBoundaryDigest = sha256(JSON.stringify(resizableTimedBoundary));
export const resizableSourceDigest = sha256(
  JSON.stringify({
    setupDigest: resizableSetupDigest,
    timedBoundaryDigest: resizableTimedBoundaryDigest,
  }),
);
export const resizableProposalDigest =
  'd0e829434fc7714ce32bdb3a30a287206d0a2127f22a6bf32380441db7b66b11';
export const resizableMarkupDigest =
  'da3d9fa843325d73b3abdf98940593e9cb8cbf9acb6006e0fc8629315054fe0b';

export const resizableExpectedPostcondition = {
  acts: RESIZABLE_UPDATE_COUNT,
  aria: {
    controls: 'tale-resizable-_r_0_-panel-0 tale-resizable-_r_0_-panel-1',
    orientation: 'vertical',
    valueMax: '50',
    valueMin: '20',
    valueNow: '50',
    valueText: '50% / 20%',
  },
  capture: {
    activePointerId: null,
    releases: 1,
    sets: 1,
  },
  changes: RESIZABLE_UPDATE_COUNT,
  commits: 1,
  finalSizes: { A: 50, B: 20, C: 30 },
  firstProposal: { A: 40.01, B: 29.99, C: 30 },
  flexBases: { A: '50%', B: '20%', C: '30%' },
  lastProposal: { A: 50, B: 20, C: 30 },
  markupDigest: resizableMarkupDigest,
  pendingWork: 0,
  proposalDigest: resizableProposalDigest,
  rootRect: {
    height: 240,
    left: 0,
    top: 0,
    width: 900,
  },
};

export const resizableExpectedPostconditionDigest = sha256(
  JSON.stringify(resizableExpectedPostcondition),
);

interface BrowserBenchmarkResult {
  duration: number;
  postcondition: Omit<typeof resizableExpectedPostcondition, 'markupDigest' | 'proposalDigest'> & {
    markup: string;
    proposals: Array<{ A: number; B: number; C: number }>;
  };
}

async function runSample(): Promise<ComponentPerformanceSample> {
  const result = await componentPerformanceBrowserHarness.withFreshPage(
    '/tools/performance-fixtures/component-expansion/resizable-1000-updates.html',
    async (page) => {
      await page.waitForFunction(
        () =>
          window.taleResizableBenchmark !== undefined ||
          window.taleResizableBenchmarkError !== undefined,
      );
      const initializationError = await page.evaluate(() => window.taleResizableBenchmarkError);
      assert.equal(initializationError, undefined);
      return page.evaluate(() =>
        window.taleResizableBenchmark!.runSample(),
      ) as Promise<BrowserBenchmarkResult>;
    },
  );

  const { markup, proposals, ...runtimePostcondition } = result.postcondition;
  const postcondition = {
    ...runtimePostcondition,
    markupDigest: sha256(markup),
    proposalDigest: sha256(JSON.stringify(proposals)),
  };
  assert.deepEqual(postcondition, resizableExpectedPostcondition);

  return {
    duration: result.duration,
    postconditionDigest: resizableExpectedPostconditionDigest,
  };
}

export const resizable1000UpdatesFixture: ComponentPerformanceFixture = {
  id: 'resizable-1000-updates',
  description:
    'One real-Chromium sample of exactly 1,000 synchronous Resizable pointermove acts with deterministic state, ARIA, capture, and completion postconditions.',
  path: 'tools/performance-fixtures/component-expansion/resizable-1000-updates.tsx',
  setup:
    'Reuse Vite and Chromium outside timing; mount a fresh 900x240 uncontrolled horizontal LTR Root, acquire pointer 1 untimed, time 1,000 move acts, then complete and settle untimed.',
  operationCount: RESIZABLE_UPDATE_COUNT,
  sourceDigest: resizableSourceDigest,
  vectorDigest: resizableVectorDigest,
  markupDigest: resizableMarkupDigest,
  expectedPostconditionDigest: resizableExpectedPostconditionDigest,
  runSample,
  teardown: () => componentPerformanceBrowserHarness.close(),
};
