import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { JSDOM } from 'jsdom';
import {
  __toastTestHooks,
  createToastQueue,
  ToastRegion,
} from '../../../packages/react/src/toast/Toast.styled.tsx';
import type { ToastMessage, ToastQueue } from '../../../packages/react/src/toast/Toast.styled.tsx';
import type { ComponentPerformanceFixture, ComponentPerformanceSample } from './types.ts';

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

const TOAST_COUNT = 50;
const MAX_VISIBLE_TOASTS = 5;
const PAUSE_RESUME_PAIRS = 12;
const variants = ['neutral', 'success', 'warning', 'danger'] as const;

export const toastMessages = Array.from({ length: TOAST_COUNT }, (_, index) => ({
  title: `Toast ${index.toString().padStart(2, '0')}`,
  ...(index % 2 === 0 ? { description: `Description ${index}` } : {}),
  variant: variants[index % variants.length],
})) satisfies ToastMessage[];

export const toastOperationVector = [
  ...toastMessages.map((message, index) => ({ type: 'add' as const, index, message, timeout: 0 })),
  ...Array.from({ length: PAUSE_RESUME_PAIRS }, (_, index) => [
    { type: 'pause' as const, pair: index },
    { type: 'resume' as const, pair: index },
  ]).flat(),
  ...Array.from({ length: TOAST_COUNT / 2 }, (_, index) => ({
    type: 'close' as const,
    index: index * 2,
  })),
  { type: 'clear' as const },
];

assert.equal(toastOperationVector.length, 100);

const queueSetup = Object.freeze({
  maxVisibleToasts: MAX_VISIBLE_TOASTS,
  defaultTimeout: 0,
  placement: 'bottom-end',
  regionLabel: 'Notifications',
  dismissLabel: 'Dismiss notification',
});

const sourceDigest = sha256(JSON.stringify({ queueSetup, messages: toastMessages }));
const vectorDigest = sha256(JSON.stringify(toastOperationVector));

type DebugRecord = {
  key: string;
  message: ToastMessage;
};

type RawQueuedToast = {
  key: string;
  content: {
    opaqueKey: string;
    message: ToastMessage;
  };
  timeout?: unknown;
  onClose?: unknown;
  timer?: unknown;
};

type DebugSnapshot = NonNullable<ReturnType<typeof __toastTestHooks.get>> & {
  records: readonly DebugRecord[];
  adapter: NonNullable<ReturnType<typeof __toastTestHooks.get>>['adapter'] & {
    subscriptionCount: number;
    visibleToasts: RawQueuedToast[];
  };
  generation: NonNullable<ReturnType<typeof __toastTestHooks.get>>['generation'] & {
    visibleToasts: RawQueuedToast[];
  };
};

function debug(queue: ToastQueue): DebugSnapshot {
  const snapshot = __toastTestHooks.get(queue);
  assert.ok(snapshot, 'Toast benchmark queue lost its private controller');
  return snapshot as DebugSnapshot;
}

function installDomGlobals(dom: JSDOM) {
  const values: Record<string, unknown> = {
    IS_REACT_ACT_ENVIRONMENT: true,
    window: dom.window,
    document: dom.window.document,
    navigator: dom.window.navigator,
    HTMLElement: dom.window.HTMLElement,
    HTMLButtonElement: dom.window.HTMLButtonElement,
    HTMLDivElement: dom.window.HTMLDivElement,
    SVGElement: dom.window.SVGElement,
    Element: dom.window.Element,
    Node: dom.window.Node,
    NodeFilter: dom.window.NodeFilter,
    Event: dom.window.Event,
    EventTarget: dom.window.EventTarget,
    CustomEvent: dom.window.CustomEvent,
    MouseEvent: dom.window.MouseEvent,
    KeyboardEvent: dom.window.KeyboardEvent,
    FocusEvent: dom.window.FocusEvent,
    MutationObserver: dom.window.MutationObserver,
    ResizeObserver: dom.window.ResizeObserver,
    getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
    requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window),
    cancelAnimationFrame: dom.window.cancelAnimationFrame.bind(dom.window),
  };
  const previous = new Map(
    Object.keys(values).map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]),
  );
  for (const [key, value] of Object.entries(values)) {
    Object.defineProperty(globalThis, key, {
      configurable: true,
      writable: true,
      value,
    });
  }
  return () => {
    for (const [key, descriptor] of previous) {
      if (descriptor) {
        Object.defineProperty(globalThis, key, descriptor);
      } else {
        Reflect.deleteProperty(globalThis, key);
      }
    }
  };
}

function visibleOpaqueKeys(snapshot: DebugSnapshot) {
  return snapshot.adapter.visibleToasts.map(({ content }) => content.opaqueKey);
}

function normalizedRegionMarkup(container: Element) {
  const region = container.querySelector<HTMLElement>('[role="region"]');
  assert.ok(region, 'Toast benchmark Region is missing immediately before clear');
  return JSON.stringify({
    region: {
      ariaLabel: region.getAttribute('aria-label'),
      className: region.className,
      placement: region.dataset.placement,
    },
    toasts: [...region.querySelectorAll<HTMLElement>('[role="alertdialog"]')].map((toast) => ({
      className: toast.className,
      variant: toast.dataset.variant,
      title: toast.querySelector('.tale-toast__title')?.textContent,
      description: toast.querySelector('.tale-toast__description')?.textContent ?? null,
      dismissLabel: toast.querySelector('button')?.getAttribute('aria-label'),
    })),
  });
}

const expectedOpaqueKeys = Array.from(
  { length: TOAST_COUNT },
  (_, index) => `tale-toast-${index + 1}`,
);
const expectedCloseKeys = expectedOpaqueKeys.filter((_, index) => index % 2 === 0);
const expectedClearKeys = expectedOpaqueKeys.filter((_, index) => index % 2 === 1);
const expectedPreClearKeys = [49, 47, 45, 43, 41].map((index) => expectedOpaqueKeys[index]!);
const expectedSubscriberSnapshots = [
  ...expectedOpaqueKeys.map((_, index) =>
    expectedOpaqueKeys.slice(Math.max(0, index - 4), index + 1).reverse(),
  ),
  ...expectedCloseKeys.map((closedKey, closeIndex) => {
    const closed = new Set(expectedCloseKeys.slice(0, closeIndex + 1));
    assert.ok(closed.has(closedKey));
    return expectedOpaqueKeys
      .filter((key) => !closed.has(key))
      .slice(-5)
      .reverse();
  }),
  [],
];

function expectedNormalizedMarkup() {
  return JSON.stringify({
    region: {
      ariaLabel: queueSetup.regionLabel,
      className: 'tale-toast-region',
      placement: queueSetup.placement,
    },
    toasts: [49, 47, 45, 43, 41].map((index) => ({
      className: 'tale-toast',
      variant: toastMessages[index]!.variant,
      title: toastMessages[index]!.title,
      description: toastMessages[index]!.description ?? null,
      dismissLabel: queueSetup.dismissLabel,
    })),
  });
}

const expectedMarkup = expectedNormalizedMarkup();
const markupDigest = sha256(expectedMarkup);
const expectedPostcondition = {
  acts: 100,
  announcements: expectedOpaqueKeys,
  rawAdds: expectedOpaqueKeys,
  rawCloses: expectedCloseKeys,
  rawClears: 1,
  closeCallbacks: expectedCloseKeys,
  clearCallbacks: expectedClearKeys,
  subscriberSnapshots: expectedSubscriberSnapshots,
  preClearVisible: expectedPreClearKeys,
  markupDigest,
  final: {
    regionChildren: 0,
    adapterVisible: 0,
    rawVisible: 0,
    records: 0,
    forwardMap: 0,
    reverseMap: 0,
    manualPauseDepth: 0,
    leaseCount: 0,
    timers: 0,
    callbacks: 0,
    announcements: 0,
    subscriptions: 0,
    pendingWork: 0,
  },
};
const expectedPostconditionDigest = sha256(JSON.stringify(expectedPostcondition));

function runSample(): ComponentPerformanceSample {
  const dom = new JSDOM('<div id="root"></div>', {
    pretendToBeVisual: true,
    url: 'https://tale-ui.test/',
  });
  const restoreGlobals = installDomGlobals(dom);
  const container = dom.window.document.querySelector('#root');
  assert.ok(container);
  const root = ReactDOMClient.createRoot(container);
  const queue = createToastQueue({
    maxVisibleToasts: MAX_VISIBLE_TOASTS,
    defaultTimeout: 0,
  });
  const initialDebug = debug(queue);
  const stableAdapter = initialDebug.adapter;
  const rawGeneration = initialDebug.generation;
  const keys: string[] = [];
  const rawAdds: string[] = [];
  const rawCloses: string[] = [];
  let rawClears = 0;
  const closeCallbacks: string[] = [];
  const clearCallbacks: string[] = [];
  const announcements: string[] = [];
  const subscriberSnapshots: string[][] = [];
  const eventOrder: string[] = [];
  let currentOperation = 'setup';
  let previousAnnouncementCount = 0;
  let pendingWork = 0;
  let acts = 0;
  let normalizedMarkup = '';

  const originalRawAdd = rawGeneration.add.bind(rawGeneration);
  rawGeneration.add = ((...args: Parameters<typeof rawGeneration.add>) => {
    assert.equal(args.length, 1, 'Toast raw add received timer or callback options');
    const rawKey = originalRawAdd(...args);
    const opaqueKey = (args[0] as RawQueuedToast['content']).opaqueKey;
    rawAdds.push(opaqueKey);
    eventOrder.push(`raw:${currentOperation}`);
    return rawKey;
  }) as typeof rawGeneration.add;
  const originalRawClose = rawGeneration.close.bind(rawGeneration);
  rawGeneration.close = ((rawKey: string) => {
    const opaqueKey = debug(queue).reverseMap.get(rawKey);
    assert.ok(opaqueKey);
    originalRawClose(rawKey);
    rawCloses.push(opaqueKey);
    eventOrder.push(`raw:${currentOperation}`);
  }) as typeof rawGeneration.close;
  const originalRawClear = rawGeneration.clear.bind(rawGeneration);
  rawGeneration.clear = (() => {
    originalRawClear();
    rawClears += 1;
    eventOrder.push(`raw:${currentOperation}`);
  }) as typeof rawGeneration.clear;

  const unsubscribe = stableAdapter.subscribe(() => {
    const snapshot = debug(queue);
    assert.equal(snapshot.adapter, stableAdapter);
    assert.equal(snapshot.generation, rawGeneration);
    assert.equal(snapshot.adapter.visibleToasts, snapshot.generation.visibleToasts);
    const visible = visibleOpaqueKeys(snapshot);
    subscriberSnapshots.push(visible);
    eventOrder.push(`subscriber:${currentOperation}`);
    if (currentOperation.startsWith('add:')) {
      assert.equal(snapshot.announcementCount, previousAnnouncementCount + 1);
      assert.deepEqual(snapshot.announcementKeys, [rawAdds.at(-1)!]);
      announcements.push(...snapshot.announcementKeys);
    } else if (currentOperation.startsWith('close:')) {
      assert.equal(snapshot.announcementCount, previousAnnouncementCount - 1);
      assert.deepEqual(snapshot.announcementKeys, []);
    } else if (currentOperation === 'clear') {
      assert.equal(snapshot.announcementCount, 0);
      assert.deepEqual(snapshot.announcementKeys, []);
    }
    previousAnnouncementCount = snapshot.announcementCount;
    for (const raw of snapshot.generation.visibleToasts) {
      assert.equal(raw.timeout, undefined);
      assert.equal(raw.onClose, undefined);
      assert.equal(raw.timer, undefined);
      assert.deepEqual(Object.keys(raw.content).sort(), ['message', 'opaqueKey']);
    }
  });

  const invoke = (label: string, operation: () => void) => {
    currentOperation = label;
    pendingWork += 1;
    try {
      React.act(() => {
        acts += 1;
        operation();
      });
    } finally {
      pendingWork -= 1;
    }
  };
  const closeCallbackFor = (index: number, keyRef: { key: string }) => () => {
    (index % 2 === 0 ? closeCallbacks : clearCallbacks).push(keyRef.key);
    eventOrder.push(`callback:${currentOperation}:${keyRef.key}`);
  };

  try {
    React.act(() => {
      root.render(<ToastRegion queue={queue} placement="bottom-end" />);
    });
    assert.equal(debug(queue).leaseCount, 1);

    const started = performance.now();
    for (let index = 0; index < TOAST_COUNT; index += 1) {
      const keyRef = { key: '' };
      invoke(`add:${index}`, () => {
        keyRef.key = queue.add(toastMessages[index]!, {
          timeout: 0,
          onClose: closeCallbackFor(index, keyRef),
        });
        keys.push(keyRef.key);
      });
    }
    for (let index = 0; index < PAUSE_RESUME_PAIRS; index += 1) {
      invoke(`pause:${index}`, () => queue.pauseAll());
      invoke(`resume:${index}`, () => queue.resumeAll());
    }
    for (let index = 0; index < TOAST_COUNT; index += 2) {
      invoke(`close:${index}`, () => queue.close(keys[index]!));
    }
    invoke('clear', () => {
      normalizedMarkup = normalizedRegionMarkup(dom.window.document.body);
      queue.clear();
    });
    const duration = performance.now() - started;

    assert.equal(acts, 100);
    assert.deepEqual(keys, expectedOpaqueKeys);
    assert.deepEqual(rawAdds, expectedOpaqueKeys);
    assert.deepEqual(rawCloses, expectedCloseKeys);
    assert.equal(rawClears, 1);
    assert.deepEqual(closeCallbacks, expectedCloseKeys);
    assert.deepEqual(clearCallbacks, expectedClearKeys);
    assert.deepEqual(announcements, expectedOpaqueKeys);
    assert.deepEqual(subscriberSnapshots, expectedSubscriberSnapshots);
    assert.deepEqual(subscriberSnapshots.at(-2), expectedPreClearKeys);
    assert.equal(normalizedMarkup, expectedMarkup);

    for (let index = 0; index < TOAST_COUNT / 2; index += 1) {
      const operation = `close:${index * 2}`;
      const rawIndex = eventOrder.indexOf(`raw:${operation}`);
      const subscriberIndex = eventOrder.indexOf(`subscriber:${operation}`);
      const callbackIndex = eventOrder.findIndex((event) =>
        event.startsWith(`callback:${operation}:`),
      );
      assert.ok(rawIndex >= 0 && rawIndex < subscriberIndex && subscriberIndex < callbackIndex);
    }
    const rawClearIndex = eventOrder.indexOf('raw:clear');
    const subscriberClearIndex = eventOrder.indexOf('subscriber:clear');
    const firstClearCallbackIndex = eventOrder.findIndex((event) =>
      event.startsWith('callback:clear:'),
    );
    assert.ok(
      rawClearIndex >= 0 &&
        rawClearIndex < subscriberClearIndex &&
        subscriberClearIndex < firstClearCallbackIndex,
    );
    for (const key of expectedClearKeys) {
      assert.ok(eventOrder.indexOf(`callback:clear:${key}`) > subscriberClearIndex);
    }

    let finalDebug = debug(queue);
    assert.equal(dom.window.document.querySelectorAll('[role="region"]').length, 0);
    assert.equal(finalDebug.adapter.visibleToasts, finalDebug.generation.visibleToasts);
    assert.equal(finalDebug.adapter.visibleToasts.length, 0);
    assert.equal(finalDebug.generation.visibleToasts.length, 0);
    assert.equal(finalDebug.records.length, 0);
    assert.equal(finalDebug.forwardMap.size, 0);
    assert.equal(finalDebug.reverseMap.size, 0);
    assert.equal(finalDebug.manualPauseDepth, 0);
    assert.equal(finalDebug.leaseCount, 1);
    assert.equal(finalDebug.timerCount, 0);
    assert.equal(finalDebug.callbackCount, 0);
    assert.equal(finalDebug.announcementCount, 0);
    assert.equal(pendingWork, 0);

    React.act(() => {
      root.unmount();
    });
    unsubscribe();
    finalDebug = debug(queue);
    assert.equal(finalDebug.leaseCount, 0);
    assert.equal(finalDebug.adapter.subscriptionCount, 0);

    const postcondition = {
      acts,
      announcements,
      rawAdds,
      rawCloses,
      rawClears,
      closeCallbacks,
      clearCallbacks,
      subscriberSnapshots,
      preClearVisible: subscriberSnapshots.at(-2),
      markupDigest: sha256(normalizedMarkup),
      final: {
        regionChildren: dom.window.document.querySelectorAll('[role="region"]').length,
        adapterVisible: finalDebug.adapter.visibleToasts.length,
        rawVisible: finalDebug.generation.visibleToasts.length,
        records: finalDebug.records.length,
        forwardMap: finalDebug.forwardMap.size,
        reverseMap: finalDebug.reverseMap.size,
        manualPauseDepth: finalDebug.manualPauseDepth,
        leaseCount: finalDebug.leaseCount,
        timers: finalDebug.timerCount,
        callbacks: finalDebug.callbackCount,
        announcements: finalDebug.announcementCount,
        subscriptions: finalDebug.adapter.subscriptionCount,
        pendingWork,
      },
    };
    assert.deepEqual(postcondition, expectedPostcondition);
    return {
      duration,
      postconditionDigest: sha256(JSON.stringify(postcondition)),
    };
  } finally {
    try {
      React.act(() => {
        root.unmount();
      });
    } catch {
      // The primary postcondition preserves the actionable failure.
    }
    unsubscribe();
    restoreGlobals();
    dom.window.close();
  }
}

export const toast100OperationsFixture: ComponentPerformanceFixture = {
  id: 'toast-100-operations',
  description:
    'One exact 100-operation Toast lifecycle sample across Tale and raw mirrors, callbacks, announcements, pause depth, and Region rendering.',
  path: 'tools/performance-fixtures/component-expansion/toast-100-operations.tsx',
  setup:
    'Mount one fresh localized bottom-end JSDOM Region with max visibility 5 and zero timeouts, then measure 50 adds, 12 pause/resume pairs, 25 closes, and one clear.',
  operationCount: 100,
  sourceDigest,
  vectorDigest,
  markupDigest,
  expectedPostconditionDigest,
  runSample,
};
