import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';
import {
  OVERFLOW_LIST_CONTROL_WIDTH,
  OVERFLOW_LIST_GAP,
  OVERFLOW_LIST_INITIAL_WIDTH,
  OVERFLOW_LIST_ITEM_COUNT,
  OVERFLOW_LIST_ITEM_WIDTH,
  OVERFLOW_LIST_MEASUREMENT_KEY,
  overflowListExpectedCallbackCounts,
  overflowListKeys,
  overflowListWidths,
} from './overflow-list-100-recompute.shared';

type ResizeObserverCallback = ConstructorParameters<typeof ResizeObserver>[0];

interface BenchmarkResult {
  duration: number;
  postcondition: {
    acts: number;
    callbacksAfterSettlement: number[];
    callbackVisibleCounts: number[];
    controlInvocations: number;
    finalHiddenCount: number;
    finalVisibleCount: number;
    frameCallbacksPerSettlement: number[];
    itemRenderCalls: number;
    maxFrameCallbacksPerSettlement: number;
    maxItemsRenderedPerFrame: number;
    markup: string;
    resizeObserverDeliveries: number;
    settlingFrames: number;
    visibleCounts: number[];
  };
}

interface BenchmarkApi {
  runSample: () => BenchmarkResult;
}

declare global {
  interface Window {
    taleOverflowListBenchmark?: BenchmarkApi;
    taleOverflowListBenchmarkError?: string;
  }
}

let nextFrameId = 1;
let frameCallbacks = new Map<number, FrameRequestCallback>();

window.requestAnimationFrame = (callback) => {
  const id = nextFrameId;
  nextFrameId += 1;
  frameCallbacks.set(id, callback);
  return id;
};
window.cancelAnimationFrame = (id) => {
  frameCallbacks.delete(id);
};

class ControlledResizeObserver implements ResizeObserver {
  static instances = new Set<ControlledResizeObserver>();

  private readonly callback: ResizeObserverCallback;
  private readonly observed = new Set<Element>();

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    ControlledResizeObserver.instances.add(this);
  }

  disconnect() {
    this.observed.clear();
  }

  observe(target: Element) {
    this.observed.add(target);
  }

  takeRecords(): ResizeObserverEntry[] {
    return [];
  }

  unobserve(target: Element) {
    this.observed.delete(target);
  }

  static deliver() {
    for (const observer of ControlledResizeObserver.instances) {
      observer.callback([], observer);
    }
  }
}

window.ResizeObserver = ControlledResizeObserver;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const items = overflowListKeys.map((key) => ({ key }));
let setFixtureWidth: React.Dispatch<React.SetStateAction<number>> | null = null;
let itemRenderKeys: string[] = [];
let controlInvocations: string[][] = [];
let visibilityCallbacks: Array<{ visible: string[]; hidden: string[] }> = [];

const itemStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  width: OVERFLOW_LIST_ITEM_WIDTH,
  minWidth: OVERFLOW_LIST_ITEM_WIDTH,
  maxWidth: OVERFLOW_LIST_ITEM_WIDTH,
  height: 28,
  padding: 0,
  border: '1px solid transparent',
};

const controlStyle: React.CSSProperties = {
  ...itemStyle,
  width: OVERFLOW_LIST_CONTROL_WIDTH,
  minWidth: OVERFLOW_LIST_CONTROL_WIDTH,
  maxWidth: OVERFLOW_LIST_CONTROL_WIDTH,
};

const getKey = (item: (typeof items)[number]) => item.key;

const renderItem = (item: (typeof items)[number]) => {
  itemRenderKeys.push(item.key);
  return (
    <button type="button" data-overflow-benchmark-item={item.key} style={itemStyle}>
      {item.key}
    </button>
  );
};

const renderOverflow = (
  hiddenItems: readonly (typeof items)[number][],
  context: { overflowControlRef: React.RefCallback<HTMLElement> },
) => {
  controlInvocations.push(hiddenItems.map(({ key }) => key));
  return (
    <button
      ref={context.overflowControlRef}
      type="button"
      data-overflow-benchmark-control=""
      style={controlStyle}
    >
      More
    </button>
  );
};

const onVisibilityChange = (
  visibleItems: readonly (typeof items)[number][],
  hiddenItems: readonly (typeof items)[number][],
) => {
  visibilityCallbacks.push({
    visible: visibleItems.map(({ key }) => key),
    hidden: hiddenItems.map(({ key }) => key),
  });
};

function assertPartition(visibleCount: number) {
  const itemElements = [
    ...document.querySelectorAll<HTMLElement>('[data-overflow-benchmark-item]'),
  ];
  const visible = itemElements
    .filter((element) => !element.closest<HTMLElement>('.tale-overflow-list__item')?.hidden)
    .map((element) => element.dataset.overflowBenchmarkItem);
  const hidden = itemElements
    .filter((element) => element.closest<HTMLElement>('.tale-overflow-list__item')?.hidden)
    .map((element) => element.dataset.overflowBenchmarkItem);
  const expectedVisible = overflowListKeys.slice(0, visibleCount);
  const expectedHidden = overflowListKeys.slice(visibleCount);
  if (
    JSON.stringify(visible) !== JSON.stringify(expectedVisible) ||
    JSON.stringify(hidden) !== JSON.stringify(expectedHidden)
  ) {
    throw new Error(`OverflowList partition mismatch at ${visibleCount} visible items`);
  }
  const expectedControlCount = visibleCount < OVERFLOW_LIST_ITEM_COUNT ? 1 : 0;
  if (
    document.querySelectorAll('[data-overflow-benchmark-control]').length !== expectedControlCount
  ) {
    throw new Error(`OverflowList rendered an invalid control tree at ${visibleCount}`);
  }
}

function flushSettlingFrame() {
  let callbackCount = 0;
  let batches = 0;
  let maxItemsRenderedInBatch = 0;
  while (frameCallbacks.size > 0) {
    batches += 1;
    if (batches > 4) {
      throw new Error('OverflowList entered cycle fallback during a settling frame');
    }
    const callbacks = [...frameCallbacks.values()];
    frameCallbacks = new Map();
    const itemRenderCountBeforeBatch = itemRenderKeys.length;
    for (const callback of callbacks) {
      callbackCount += 1;
      ReactDOM.flushSync(() => callback(window.performance.now()));
    }
    const renderedItemsInBatch = itemRenderKeys.length - itemRenderCountBeforeBatch;
    maxItemsRenderedInBatch = Math.max(maxItemsRenderedInBatch, renderedItemsInBatch);
  }
  return { callbackCount, maxItemsRenderedInBatch };
}

async function initialize() {
  // The controlled browser facilities must exist before this import initializes
  // the shared animation-frame scheduler.
  const { OverflowList } = await import('@tale-ui/react/overflow-list');

  function BenchmarkApp() {
    const [width, setWidth] = React.useState(OVERFLOW_LIST_INITIAL_WIDTH);
    setFixtureWidth = setWidth;
    return (
      <OverflowList
        items={items}
        getKey={getKey}
        renderItem={renderItem}
        renderOverflow={renderOverflow}
        collapseFrom="end"
        minVisibleItems={0}
        measurementKey={OVERFLOW_LIST_MEASUREMENT_KEY}
        onVisibilityChange={onVisibilityChange}
        style={{
          display: 'flex',
          boxSizing: 'border-box',
          width,
          minWidth: width,
          maxWidth: width,
          gap: OVERFLOW_LIST_GAP,
          padding: 0,
          border: 0,
        }}
      />
    );
  }

  const container = document.querySelector('#app');
  if (!container) {
    throw new Error('OverflowList benchmark container is missing');
  }
  const root = ReactDOMClient.createRoot(container);
  React.act(() => {
    ReactDOM.flushSync(() => root.render(<BenchmarkApp />));
    ControlledResizeObserver.deliver();
    flushSettlingFrame();
  });
  assertPartition(0);

  itemRenderKeys = [];
  controlInvocations = [];
  visibilityCallbacks = [];

  window.taleOverflowListBenchmark = {
    runSample() {
      if (!setFixtureWidth) {
        throw new Error('OverflowList benchmark width setter is unavailable');
      }
      let acts = 0;
      let resizeObserverDeliveries = 0;
      let settlingFrames = 0;
      let maxFrameCallbacksPerSettlement = 0;
      let maxItemsRenderedPerFrame = 0;
      const callbacksAfterSettlement: number[] = [];
      const frameCallbacksPerSettlement: number[] = [];
      const visibleCounts: number[] = [];

      const runWidth = (width: number) => {
        React.act(() => {
          acts += 1;
          ReactDOM.flushSync(() => setFixtureWidth!(width));
          ControlledResizeObserver.deliver();
          resizeObserverDeliveries += 1;
          const { callbackCount: frameCallbackCount, maxItemsRenderedInBatch } =
            flushSettlingFrame();
          frameCallbacksPerSettlement.push(frameCallbackCount);
          maxFrameCallbacksPerSettlement = Math.max(
            maxFrameCallbacksPerSettlement,
            frameCallbackCount,
          );
          maxItemsRenderedPerFrame = Math.max(maxItemsRenderedPerFrame, maxItemsRenderedInBatch);
          settlingFrames += 1;
        });
      };

      const started = window.performance.now();
      for (const width of overflowListWidths) {
        runWidth(width);
        callbacksAfterSettlement.push(visibilityCallbacks.length);
        visibleCounts.push(visibilityCallbacks.at(-1)?.visible.length ?? 0);
      }
      const duration = window.performance.now() - started;

      if (frameCallbacks.size !== 0) {
        throw new Error('OverflowList left animation-frame work pending');
      }
      if (acts !== overflowListWidths.length) {
        throw new Error('OverflowList benchmark act count drifted');
      }
      if (resizeObserverDeliveries !== overflowListWidths.length) {
        throw new Error('OverflowList benchmark ResizeObserver count drifted');
      }
      if (settlingFrames !== overflowListWidths.length) {
        throw new Error('OverflowList benchmark settling-frame count drifted');
      }
      if (itemRenderKeys.length % OVERFLOW_LIST_ITEM_COUNT !== 0) {
        throw new Error('OverflowList rendered only a partial item vector');
      }
      if (maxItemsRenderedPerFrame > OVERFLOW_LIST_ITEM_COUNT) {
        throw new Error('OverflowList committed more than one partition update in one frame');
      }
      for (let offset = 0; offset < itemRenderKeys.length; offset += OVERFLOW_LIST_ITEM_COUNT) {
        const renderKeys = itemRenderKeys.slice(offset, offset + OVERFLOW_LIST_ITEM_COUNT);
        if (JSON.stringify(renderKeys) !== JSON.stringify(overflowListKeys)) {
          throw new Error('OverflowList item render order drifted');
        }
      }
      const componentRenderCount = itemRenderKeys.length / OVERFLOW_LIST_ITEM_COUNT;
      if (controlInvocations.length > componentRenderCount) {
        throw new Error('OverflowList invoked more than one control per React render');
      }
      for (const hiddenKeys of controlInvocations) {
        const expectedHidden = overflowListKeys.slice(OVERFLOW_LIST_ITEM_COUNT - hiddenKeys.length);
        if (JSON.stringify(hiddenKeys) !== JSON.stringify(expectedHidden)) {
          throw new Error('OverflowList control received a non-suffix hidden vector');
        }
      }

      const callbackVisibleCounts = visibilityCallbacks.map(({ visible }) => visible.length);
      if (
        JSON.stringify(callbackVisibleCounts) !== JSON.stringify(overflowListExpectedCallbackCounts)
      ) {
        throw new Error(
          `OverflowList callback order drifted: ${JSON.stringify(callbackVisibleCounts)}`,
        );
      }
      for (const callback of visibilityCallbacks) {
        const expectedVisible = overflowListKeys.slice(0, callback.visible.length);
        const expectedHidden = overflowListKeys.slice(callback.visible.length);
        if (
          JSON.stringify(callback.visible) !== JSON.stringify(expectedVisible) ||
          JSON.stringify(callback.hidden) !== JSON.stringify(expectedHidden)
        ) {
          throw new Error('OverflowList callback partition drifted');
        }
      }
      if (maxFrameCallbacksPerSettlement > 2) {
        throw new Error('OverflowList required cycle fallback to settle');
      }
      const expectedFrameCallbacks = [...Array.from({ length: 99 }, () => 2), 1];
      if (JSON.stringify(frameCallbacksPerSettlement) !== JSON.stringify(expectedFrameCallbacks)) {
        throw new Error('OverflowList settling callback sequence drifted');
      }
      const expectedCallbacksAfterSettlement = [
        ...Array.from({ length: 99 }, (_, index) => index + 1),
        99,
      ];
      if (
        JSON.stringify(callbacksAfterSettlement) !==
        JSON.stringify(expectedCallbacksAfterSettlement)
      ) {
        throw new Error('OverflowList callback settlement boundary drifted');
      }
      if (
        JSON.stringify(visibleCounts) !==
        JSON.stringify([...Array.from({ length: 98 }, (_, index) => index + 1), 100, 100])
      ) {
        throw new Error('OverflowList per-width visible vector drifted');
      }

      assertPartition(OVERFLOW_LIST_ITEM_COUNT);
      return {
        duration,
        postcondition: {
          acts,
          callbacksAfterSettlement,
          callbackVisibleCounts,
          controlInvocations: controlInvocations.length,
          finalHiddenCount: 0,
          finalVisibleCount: OVERFLOW_LIST_ITEM_COUNT,
          frameCallbacksPerSettlement,
          itemRenderCalls: itemRenderKeys.length,
          maxFrameCallbacksPerSettlement,
          maxItemsRenderedPerFrame,
          markup: container.innerHTML,
          resizeObserverDeliveries,
          settlingFrames,
          visibleCounts,
        },
      };
    },
  };
}

void initialize().catch((error: unknown) => {
  window.taleOverflowListBenchmarkError = error instanceof Error ? error.message : String(error);
});
