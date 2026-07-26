import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { JSDOM } from 'jsdom';
import { Timestamp } from '../../../packages/react/src/timestamp/index.ts';
import { setRelativeTimestampFormatObserverForTesting } from '../../../packages/react/src/timestamp/timestampFormat.ts';
import {
  setTimestampSchedulerForTesting,
  type TimestampScheduler,
} from '../../../packages/react/src/timestamp/timestampScheduler.ts';
import type {
  ComponentPerformanceFixture,
  ComponentPerformanceSample,
} from './types.ts';

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export const TIMESTAMP_T0 = 1_767_225_600_000;
export const timestampValues = Array.from(
  { length: 1000 },
  (_, index) => TIMESTAMP_T0 + ((index % 121) - 60) * 1000,
);
export const timestampKeys = timestampValues.map(
  (_, index) => `timestamp-${String(index).padStart(4, '0')}`,
);

class DeterministicScheduler implements TimestampScheduler {
  private current = TIMESTAMP_T0;
  private readonly groups = new Map<number, Set<() => void>>();
  createdIntervals = 0;
  schedulerCallbacks = 0;

  now = () => this.current;

  subscribe = (interval: number, callback: () => void) => {
    let subscribers = this.groups.get(interval);
    if (!subscribers) {
      subscribers = new Set();
      this.groups.set(interval, subscribers);
      this.createdIntervals += 1;
    }
    subscribers.add(callback);
    let active = true;
    return () => {
      if (!active) {
        return;
      }
      active = false;
      subscribers!.delete(callback);
      if (subscribers!.size === 0) {
        this.groups.delete(interval);
      }
    };
  };

  advanceTo(next: number) {
    this.current = next;
    for (const subscribers of this.groups.values()) {
      this.schedulerCallbacks += 1;
      for (const callback of [...subscribers]) {
        callback();
      }
    }
  }

  get activeIntervalCount() {
    return this.groups.size;
  }
}

const sourceDigest = sha256(JSON.stringify({ T0: TIMESTAMP_T0, values: timestampValues }));
const vectorDigest = sha256(JSON.stringify(timestampKeys.map((key, index) => [key, timestampValues[index]])));

function installDomGlobals(dom: JSDOM) {
  const values: Record<string, unknown> = {
    IS_REACT_ACT_ENVIRONMENT: true,
    window: dom.window,
    document: dom.window.document,
    navigator: dom.window.navigator,
    HTMLElement: dom.window.HTMLElement,
    Element: dom.window.Element,
    Node: dom.window.Node,
    MutationObserver: dom.window.MutationObserver,
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

function TimestampVector({ onRender }: { onRender: React.ProfilerOnRenderCallback }) {
  return (
    <React.Profiler id="timestamp-1000-tick" onRender={onRender}>
      {timestampValues.map((value, index) => (
        <Timestamp
          key={timestampKeys[index]}
          value={value}
          locale="en-US"
          timeZone="UTC"
          format="relative"
          now={TIMESTAMP_T0}
          refreshInterval={1000}
        />
      ))}
    </React.Profiler>
  );
}

let expectedMarkupDigest = '';
let expectedPostconditionDigest = '';

function runSample(): ComponentPerformanceSample {
  const dom = new JSDOM('<div id="root"></div>', {
    pretendToBeVisual: true,
    url: 'https://tale-ui.test/',
  });
  const restoreGlobals = installDomGlobals(dom);
  const container = dom.window.document.querySelector('#root');
  assert.ok(container);
  const root = ReactDOMClient.createRoot(container);
  const scheduler = new DeterministicScheduler();
  const restoreScheduler = setTimestampSchedulerForTesting(scheduler);
  let formatCalls = 0;
  const restoreObserver = setRelativeTimestampFormatObserverForTesting(() => {
    formatCalls += 1;
  });
  let updateCommits = 0;
  const onRender: React.ProfilerOnRenderCallback = (_id, phase) => {
    if (phase === 'update') {
      updateCommits += 1;
    }
  };

  try {
    React.act(() => {
      root.render(<TimestampVector onRender={onRender} />);
    });
    assert.equal(scheduler.createdIntervals, 1);
    assert.equal(scheduler.activeIntervalCount, 1);
    assert.equal(container.querySelectorAll('time').length, 1000);
    const initialDateTimes = [...container.querySelectorAll('time')].map((element) =>
      element.getAttribute('datetime'),
    );

    formatCalls = 0;
    updateCommits = 0;
    scheduler.schedulerCallbacks = 0;
    const started = performance.now();
    React.act(() => {
      scheduler.advanceTo(TIMESTAMP_T0 + 1000);
    });
    const duration = performance.now() - started;

    const times = [...container.querySelectorAll('time')];
    const dateTimes = times.map((element) => element.getAttribute('datetime'));
    const texts = times.map((element) => element.textContent);
    assert.equal(scheduler.schedulerCallbacks, 1);
    assert.equal(formatCalls, 1000);
    assert.equal(updateCommits, 1);
    assert.equal(scheduler.createdIntervals, 1);
    assert.equal(scheduler.activeIntervalCount, 1);
    assert.deepEqual(dateTimes, initialDateTimes);

    const markupDigest = sha256(container.innerHTML);
    const postconditionDigest = sha256(
      JSON.stringify({
        schedulerCallbacks: scheduler.schedulerCallbacks,
        recomputations: formatCalls,
        updateCommits,
        intervalCount: scheduler.activeIntervalCount,
        dateTimes: sha256(JSON.stringify(dateTimes)),
        texts: sha256(JSON.stringify(texts)),
        markupDigest,
      }),
    );
    if (expectedMarkupDigest === '') {
      expectedMarkupDigest = markupDigest;
      expectedPostconditionDigest = postconditionDigest;
    } else {
      assert.equal(markupDigest, expectedMarkupDigest);
      assert.equal(postconditionDigest, expectedPostconditionDigest);
    }

    React.act(() => {
      root.unmount();
    });
    assert.equal(scheduler.activeIntervalCount, 0);

    return { duration, postconditionDigest };
  } finally {
    restoreObserver();
    restoreScheduler();
    if (scheduler.activeIntervalCount !== 0) {
      React.act(() => {
        root.unmount();
      });
    }
    restoreGlobals();
    dom.window.close();
  }
}

const initialSample = runSample();
assert.ok(initialSample.duration >= 0);
const markupDigest = expectedMarkupDigest;

export const timestamp1000TickFixture: ComponentPerformanceFixture = {
  id: 'timestamp-1000-tick',
  description:
    'One shared scheduler tick across 1,000 relative Timestamp instances with exact recomputation and commit postconditions.',
  path: 'tools/performance-fixtures/component-expansion/timestamp-1000-tick.tsx',
  setup:
    'Mount 1,000 keyed relative timestamps in fresh JSDOM state, settle effects, and reset counters outside timing.',
  operationCount: 1,
  sourceDigest,
  vectorDigest,
  markupDigest,
  expectedPostconditionDigest,
  runSample,
};
