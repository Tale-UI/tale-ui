import * as React from 'react';
import { act, fireEvent, screen, waitFor } from '@tale-ui/monorepo-tests/test-utils';
import { createRenderer, isJSDOM } from '#test-utils';
import { I18nProvider } from '../i18n-provider';
import '../styles.css';
import {
  createToastQueue,
  ToastRegion,
  type CreateToastQueueOptions,
  type ToastAddOptions,
  type ToastMessage,
  type ToastQueue,
  type ToastRegionProps,
} from './index';
import { __toastTestHooks } from './Toast.styled';

function asQueueOptions(value: unknown): CreateToastQueueOptions {
  return value as CreateToastQueueOptions;
}

function asMessage(value: unknown): ToastMessage {
  return value as ToastMessage;
}

function asAddOptions(value: unknown): ToastAddOptions {
  return value as ToastAddOptions;
}

function asRegionProps(value: unknown): ToastRegionProps {
  return value as ToastRegionProps;
}

function assertToastTypes() {
  const queue: ToastQueue = createToastQueue({
    maxVisibleToasts: 3,
    defaultTimeout: 0,
  });
  const key = queue.add(
    {
      title: 'Saved',
      description: 'Your changes were saved.',
      variant: 'success',
    },
    {
      timeout: 1000,
      onClose() {},
    },
  );
  queue.close(key);
  queue.pauseAll();
  queue.resumeAll();
  queue.clear();
  <ToastRegion queue={queue} placement="top-end" dismissLabel="Dismiss" />;

  // @ts-expect-error Toast title is required.
  queue.add({ variant: 'neutral' });
  // @ts-expect-error Toast variants are closed.
  queue.add({ title: 'Saved', variant: 'positive' });
  // @ts-expect-error Region placement is closed.
  <ToastRegion queue={queue} placement="center" />;
  // @ts-expect-error Region does not accept arbitrary DOM handlers.
  <ToastRegion queue={queue} onClick={() => {}} />;
}
void assertToastTypes;

describe('Toast', () => {
  const { render, renderToString } = createRenderer();

  it.each([
    [null, TypeError],
    [[], TypeError],
    ['invalid', TypeError],
    [{ maxVisibleToasts: '2' }, TypeError],
    [{ maxVisibleToasts: 0 }, RangeError],
    [{ maxVisibleToasts: 1.5 }, RangeError],
    [{ maxVisibleToasts: Number.POSITIVE_INFINITY }, RangeError],
    [{ defaultTimeout: '5000' }, TypeError],
    [{ defaultTimeout: -1 }, RangeError],
    [{ defaultTimeout: Number.NaN }, RangeError],
  ])('rejects malformed queue options %o before creating a queue', (value, ErrorType) => {
    expect(() => createToastQueue(asQueueOptions(value))).toThrow(ErrorType);
    expect(() => createToastQueue(asQueueOptions(value))).toThrow(/^Tale UI: Toast /);
  });

  it.each([
    [null, undefined, TypeError],
    [[], undefined, TypeError],
    [{}, undefined, TypeError],
    [{ title: 1 }, undefined, TypeError],
    [{ title: '   ' }, undefined, RangeError],
    [{ title: 'Saved', description: 1 }, undefined, TypeError],
    [{ title: 'Saved', variant: 'positive' }, undefined, TypeError],
    [{ title: 'Saved' }, null, TypeError],
    [{ title: 'Saved' }, [], TypeError],
    [{ title: 'Saved' }, { timeout: 'soon' }, TypeError],
    [{ title: 'Saved' }, { timeout: -1 }, RangeError],
    [{ title: 'Saved' }, { onClose: true }, TypeError],
  ])('rejects malformed add input before mirror mutation', (message, options, ErrorType) => {
    const queue = createToastQueue({ defaultTimeout: 0 });
    const before = __toastTestHooks.get(queue)!;

    expect(() => queue.add(asMessage(message), asAddOptions(options))).toThrow(ErrorType);
    const after = __toastTestHooks.get(queue)!;
    expect(after.records).toHaveLength(0);
    expect(after.generation).toBe(before.generation);
    expect(after.generation.visibleToasts).toHaveLength(0);
    expect(after.forwardMap.size).toBe(0);
    expect(after.reverseMap.size).toBe(0);
  });

  it('captures queue, message, and add-option accessors exactly once', () => {
    const reads = new Map<string, number>();
    const once = (name: string, value: unknown) => ({
      enumerable: true,
      get() {
        const count = (reads.get(name) ?? 0) + 1;
        reads.set(name, count);
        if (count > 1) {
          throw new Error(`${name} was read more than once`);
        }
        return value;
      },
    });
    const callback = vi.fn();
    const queue = createToastQueue(
      asQueueOptions(
        Object.defineProperties(
          {},
          {
            maxVisibleToasts: once('maxVisibleToasts', 2),
            defaultTimeout: once('defaultTimeout', 0),
          },
        ),
      ),
    );
    const key = queue.add(
      asMessage(
        Object.defineProperties(
          {},
          {
            title: once('title', 'Captured'),
            description: once('description', 'Once'),
            variant: once('variant', 'success'),
          },
        ),
      ),
      asAddOptions(
        Object.defineProperties(
          {},
          {
            timeout: once('timeout', 0),
            onClose: once('onClose', callback),
          },
        ),
      ),
    );

    expect(__toastTestHooks.get(queue)!.records[0]!.message).toEqual({
      title: 'Captured',
      description: 'Once',
      variant: 'success',
    });
    queue.close(key);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(Object.fromEntries(reads)).toEqual({
      maxVisibleToasts: 1,
      defaultTimeout: 1,
      title: 1,
      description: 1,
      variant: 1,
      timeout: 1,
      onClose: 1,
    });
  });

  it('wraps a throwing input accessor in the Tale recovery contract', () => {
    const queue = createToastQueue({ defaultTimeout: 0 });
    const hostileMessage = new Proxy(
      {},
      {
        get() {
          throw new Error('hostile accessor detail');
        },
      },
    );

    expect(() => queue.add(asMessage(hostileMessage))).toThrow(
      'Tale UI: Toast add could not read title; replace the throwing accessor before retrying.',
    );
    expect(__toastTestHooks.get(queue)!.records).toHaveLength(0);
  });

  it('renders localized defaults, placement, variants, descriptions, and a forwarded Region ref', async () => {
    const queue = createToastQueue({ maxVisibleToasts: 2, defaultTimeout: 0 });
    queue.add({ title: 'Saved', description: 'Complete', variant: 'success' });
    queue.add({ title: 'Check input', variant: 'warning' });
    const ref = React.createRef<HTMLDivElement>();

    await render(<ToastRegion ref={ref} queue={queue} />);

    const region = await screen.findByRole('region', { name: 'Notifications' });
    expect(ref.current).toBe(region);
    expect(region.getAttribute('data-placement')).toBe('bottom-end');
    expect(screen.getAllByRole('alertdialog')).toHaveLength(2);
    expect(
      (
        document
          .querySelector('.tale-toast__title')
          ?.closest('[role="alertdialog"]') as HTMLElement | null
      )?.dataset.variant,
    ).toBe('warning');
    expect(
      (
        Array.from(document.querySelectorAll('.tale-toast__title'))
          .find((node) => node.textContent === 'Saved')
          ?.closest('[role="alertdialog"]') as HTMLElement | null
      )?.dataset.variant,
    ).toBe('success');
    expect(screen.getByText('Complete')).toBeTruthy();
    expect(screen.getAllByRole('button', { name: 'Dismiss notification' })).toHaveLength(2);
  });

  it.skipIf(isJSDOM).each(['top-end', 'bottom-end'] as const)(
    'keeps %s Toasts within the viewport edge',
    async (placement) => {
      const queue = createToastQueue({ defaultTimeout: 0 });
      queue.add({ title: 'Saved', description: 'Complete', variant: 'success' });

      await render(<ToastRegion queue={queue} placement={placement} />);

      const region = await screen.findByRole('region', { name: 'Notifications' });
      const toast = await screen.findByRole('alertdialog');
      const regionRect = region.getBoundingClientRect();
      const toastRect = toast.getBoundingClientRect();

      expect(getComputedStyle(toast).boxSizing).toBe('border-box');
      expect(toastRect.width).toBeLessThanOrEqual(regionRect.width);
      expect(toastRect.right).toBeLessThanOrEqual(regionRect.right + 1);
      expect(toastRect.right).toBeLessThanOrEqual(window.innerWidth);
    },
  );

  it('uses explicit valid labels and normalizes invalid Region rendering props without mutating the queue', async () => {
    const queue = createToastQueue({ defaultTimeout: 0 });
    queue.add({ title: 'Saved' });
    const before = __toastTestHooks.get(queue)!;

    await render(
      <ToastRegion
        {...asRegionProps({
          queue,
          placement: 'center',
          className: () => 'unsafe',
          'aria-label': '   ',
          dismissLabel: 42,
        })}
      />,
    );

    const region = await screen.findByRole('region', { name: 'Notifications' });
    expect(region.getAttribute('data-placement')).toBe('bottom-end');
    expect(region.classList.contains('unsafe')).toBe(false);
    expect(screen.getByRole('button', { name: 'Dismiss notification' })).toBeTruthy();
    const after = __toastTestHooks.get(queue)!;
    expect(after.records).toBe(before.records);
    expect(after.generation).toBe(before.generation);
  });

  it('renders nothing for an invalid queue and does not invoke hostile properties', async () => {
    const hostileQueue = new Proxy(
      {},
      {
        get() {
          throw new Error('invalid queue properties must not be read');
        },
      },
    );
    const { container } = await render(<ToastRegion {...asRegionProps({ queue: hostileQueue })} />);
    expect(container.childNodes).toHaveLength(0);
    expect(screen.queryByRole('region')).toBeNull();
  });

  it('keeps newest-first visible and hidden partitions and promotes without reannouncing', async () => {
    const queue = createToastQueue({ maxVisibleToasts: 2, defaultTimeout: 0 });
    const keys = [
      queue.add({ title: 'First' }),
      queue.add({ title: 'Second' }),
      queue.add({ title: 'Third' }),
    ];
    await render(<ToastRegion queue={queue} />);
    await waitFor(() => expect(screen.getAllByRole('alertdialog')).toHaveLength(2));

    expect(screen.getAllByRole('alertdialog').map((node) => node.textContent)).toEqual([
      expect.stringContaining('Third'),
      expect.stringContaining('Second'),
    ]);

    act(() => queue.close(keys[2]!));
    expect(screen.getAllByRole('alertdialog').map((node) => node.textContent)).toEqual([
      expect.stringContaining('Second'),
      expect.stringContaining('First'),
    ]);
    expect(document.querySelector('[data-toast-announcer="polite"]')?.textContent).not.toContain(
      'First',
    );
  });

  it('retains every unconsumed announcement in add order before the Region mounts', async () => {
    const queue = createToastQueue({ maxVisibleToasts: 2, defaultTimeout: 0 });
    const keys = [
      queue.add({ title: 'First' }),
      queue.add({ title: 'Second' }),
      queue.add({ title: 'Third' }),
    ];
    expect(__toastTestHooks.get(queue)!.announcementKeys).toEqual(keys);

    await render(<ToastRegion queue={queue} />);
    await screen.findByRole('region', { name: 'Notifications' });
    expect(document.querySelector('[data-toast-announcer="polite"]')?.textContent).toContain(
      'First',
    );
    expect(document.querySelector('[data-toast-announcer="polite"]')?.textContent).toContain(
      'Second',
    );
    expect(document.querySelector('[data-toast-announcer="polite"]')?.textContent).toContain(
      'Third',
    );
  });

  it('mounts an empty live node before presenting the first queued announcement', async () => {
    const queue = createToastQueue({ defaultTimeout: 0 });
    await render(<ToastRegion queue={queue} />);
    const mutations: MutationRecord[] = [];
    const observer = new MutationObserver((records) => mutations.push(...records));
    observer.observe(document.body, { childList: true, subtree: true });

    act(() => {
      queue.add({ title: 'First after empty' });
    });
    await screen.findByRole('region', { name: 'Notifications' });
    await waitFor(() =>
      expect(document.querySelector('[data-toast-announcer="polite"]')?.textContent).toContain(
        'First after empty',
      ),
    );
    observer.disconnect();
    const liveNodeMount = mutations.findIndex((mutation) =>
      Array.from(mutation.addedNodes).some(
        (node) =>
          node instanceof Element &&
          (node.matches('[data-toast-announcer]') ||
            node.querySelector('[data-toast-announcer]') !== null),
      ),
    );
    const textPresentation = mutations.findIndex(
      (mutation, index) =>
        index > liveNodeMount &&
        Array.from(mutation.addedNodes).some((node) =>
          node.textContent?.includes('First after empty'),
        ),
    );
    expect(liveNodeMount).toBeGreaterThanOrEqual(0);
    expect(textPresentation).toBeGreaterThan(liveNodeMount);
  });

  it('routes RAC dismiss through Tale cleanup and invokes the callback exactly once', async () => {
    const onClose = vi.fn();
    const queue = createToastQueue({ defaultTimeout: 0 });
    queue.add({ title: 'Dismiss me' }, { onClose });
    const { user } = await render(<ToastRegion queue={queue} dismissLabel="Close saved notice" />);
    const dismissButton = await screen.findByRole('button', { name: 'Close saved notice' });
    for (const className of [
      'tale-icon-button',
      'tale-icon-button--sm',
      'tale-button',
      'tale-button--ghost',
      'tale-toast__dismiss',
    ]) {
      expect(dismissButton.classList.contains(className)).toBe(true);
    }
    expect(dismissButton.querySelector('.tale-icon--sm')).not.toBeNull();

    await user.click(dismissButton);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('region')).toBeNull();
    expect(__toastTestHooks.get(queue)!.records).toHaveLength(0);
    queue.close('unknown');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('passes one raw add argument, leaves raw timers/callbacks absent, and never subscribes to a generation', async () => {
    const queue = createToastQueue({ defaultTimeout: 0 });
    const debug = __toastTestHooks.get(queue)!;
    const rawAdd = vi.spyOn(debug.generation, 'add');
    const rawSubscribe = vi.spyOn(debug.generation, 'subscribe');

    queue.add({ title: 'Raw contract' }, { timeout: 0, onClose() {} });
    await render(<ToastRegion queue={queue} />);
    await screen.findByRole('alertdialog');

    expect(rawAdd).toHaveBeenCalledTimes(1);
    expect(rawAdd.mock.calls[0]).toHaveLength(1);
    expect(rawSubscribe).not.toHaveBeenCalled();
    const raw = __toastTestHooks.get(queue)!.generation.visibleToasts[0]!;
    expect(raw.timeout).toBeUndefined();
    expect(raw.onClose).toBeUndefined();
    expect(raw.timer).toBeUndefined();
  });

  it.each(['before', 'after'] as const)(
    'rebuilds and republishes the pre-close snapshot when raw close fails %s mutation',
    (timing) => {
      const callback = vi.fn();
      const queue = createToastQueue({ defaultTimeout: 0 });
      const key = queue.add({ title: 'Keep me' }, { onClose: callback });
      const before = __toastTestHooks.get(queue)!;
      const stableAdapter = before.adapter;
      const originalClose = before.generation.close.bind(before.generation);
      vi.spyOn(before.generation, 'close').mockImplementationOnce((rawKey) => {
        if (timing === 'after') {
          originalClose(rawKey);
        }
        throw new Error(`raw close ${timing}`);
      });

      let thrown: unknown;
      try {
        queue.close(key);
      } catch (error) {
        thrown = error;
      }
      expect(thrown).toBeInstanceOf(AggregateError);
      expect((thrown as AggregateError).message).toBe(
        'Tale UI: Toast operation failed and the previous queue state was restored; correct the upstream queue failure before retrying.',
      );
      expect((thrown as AggregateError).errors).toEqual([
        expect.objectContaining({ message: `raw close ${timing}` }),
      ]);
      const after = __toastTestHooks.get(queue)!;
      expect(after.adapter).toBe(stableAdapter);
      expect(after.generation).not.toBe(before.generation);
      expect(after.records.map((record) => record.key)).toEqual([key]);
      expect(after.adapter.visibleToasts).toBe(after.generation.visibleToasts);
      expect(callback).not.toHaveBeenCalled();
    },
  );

  it.each(['before', 'after'] as const)(
    'rebuilds a failed clear without consuming callbacks or records when raw clear fails %s mutation',
    (timing) => {
      const calls: string[] = [];
      const queue = createToastQueue({ maxVisibleToasts: 2, defaultTimeout: 0 });
      queue.add({ title: 'First' }, { onClose: () => calls.push('first') });
      queue.add({ title: 'Second' }, { onClose: () => calls.push('second') });
      const before = __toastTestHooks.get(queue)!;
      const originalClear = before.generation.clear.bind(before.generation);
      vi.spyOn(before.generation, 'clear').mockImplementationOnce(() => {
        if (timing === 'after') {
          originalClear();
        }
        throw new Error(`raw clear ${timing}`);
      });

      expect(() => queue.clear()).toThrow(
        'Tale UI: Toast operation failed and the previous queue state was restored; correct the upstream queue failure before retrying.',
      );
      const after = __toastTestHooks.get(queue)!;
      expect(after.records.map((record) => record.message.title)).toEqual(['Second', 'First']);
      expect(calls).toEqual([]);
    },
  );

  it.each(['before', 'after'] as const)(
    'rebuilds an empty snapshot when raw add fails %s key acquisition',
    (timing) => {
      const queue = createToastQueue({ defaultTimeout: 0 });
      const before = __toastTestHooks.get(queue)!;
      const originalAdd = before.generation.add.bind(before.generation);
      vi.spyOn(before.generation, 'add').mockImplementationOnce((content, options) => {
        if (timing === 'after') {
          originalAdd(content, options);
        }
        throw new Error(`raw add ${timing}`);
      });

      expect(() => queue.add({ title: 'Rejected upstream' })).toThrow(
        'Tale UI: Toast operation failed and the previous queue state was restored; correct the upstream queue failure before retrying.',
      );
      const after = __toastTestHooks.get(queue)!;
      expect(after.adapter).toBe(before.adapter);
      expect(after.generation).not.toBe(before.generation);
      expect(after.records).toHaveLength(0);
      expect(after.generation.visibleToasts).toHaveLength(0);
    },
  );

  it('poison-resets consistently when raw recovery also fails and rejects later mutations', () => {
    const calls: string[] = [];
    const queue = createToastQueue({ defaultTimeout: 0 });
    const key = queue.add(
      {
        title: 'Discarded',
      },
      {
        onClose: () => {
          calls.push('closed');
          throw new Error('poison callback failed');
        },
      },
    );
    const debug = __toastTestHooks.get(queue)!;
    vi.spyOn(debug.generation, 'close').mockImplementationOnce(() => {
      throw new Error('raw close failed');
    });
    __toastTestHooks.setRawFactory(queue, () => {
      throw new Error('rebuild failed');
    });

    let thrown: unknown;
    try {
      queue.close(key);
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBeInstanceOf(AggregateError);
    expect(
      (thrown as AggregateError).errors.map((error) =>
        error instanceof Error ? error.message : String(error),
      ),
    ).toEqual(['raw close failed', 'rebuild failed', 'poison callback failed']);
    const after = __toastTestHooks.get(queue)!;
    expect(after.poisoned).toBe(true);
    expect(after.records).toHaveLength(0);
    expect(after.adapter.visibleToasts).toHaveLength(0);
    expect(after.forwardMap.size).toBe(0);
    expect(after.reverseMap.size).toBe(0);
    expect(calls).toEqual(['closed']);
    expect(() => queue.add({ title: 'Later' })).toThrow(
      'Tale UI: Toast queue is poisoned after unrecoverable state corruption; create a new queue.',
    );
  });

  it('invokes every subscriber, commits close once, runs callbacks, and continues FIFO work', () => {
    const events: string[] = [];
    const queue = createToastQueue({ defaultTimeout: 0 });
    const key = queue.add({ title: 'First' }, { onClose: () => events.push('callback:first') });
    const adapter = __toastTestHooks.get(queue)!.adapter;
    let staged = false;
    adapter.subscribe(() => {
      events.push('subscriber:one');
      if (!staged) {
        staged = true;
        queue.add({ title: 'Second' }, { onClose: () => events.push('callback:second') });
      }
      throw new Error('subscriber failed');
    });
    adapter.subscribe(() => events.push('subscriber:two'));

    expect(() => queue.close(key)).toThrow(AggregateError);
    const after = __toastTestHooks.get(queue)!;
    expect(after.records).toHaveLength(0);
    expect(events).toContain('subscriber:one');
    expect(events).toContain('subscriber:two');
    expect(events).toContain('callback:first');
  });

  it('rolls back a failed add publication once without replacing the raw generation', () => {
    const queue = createToastQueue({ defaultTimeout: 0 });
    const before = __toastTestHooks.get(queue)!;
    let publications = 0;
    before.adapter.subscribe(() => {
      publications += 1;
      throw new Error('subscriber failed');
    });

    expect(() => queue.add({ title: 'Rolled back' })).toThrow(
      'Tale UI: Toast add publication failed and rollback publication also failed; the previous queue state was restored. Correct the subscriber before retrying.',
    );
    const after = __toastTestHooks.get(queue)!;
    expect(publications).toBe(2);
    expect(after.generation).toBe(before.generation);
    expect(after.records).toHaveLength(0);
    expect(after.generation.visibleToasts).toHaveLength(0);
    expect(after.adapter.visibleToasts).toHaveLength(0);
  });

  it('restores pending announcements when add publication and raw cleanup both fail', () => {
    const queue = createToastQueue({ defaultTimeout: 0 });
    const before = __toastTestHooks.get(queue)!;
    vi.spyOn(before.generation, 'close').mockImplementationOnce(() => {
      throw new Error('rollback close failed');
    });
    before.adapter.subscribe(() => {
      throw new Error('subscriber failed');
    });

    expect(() => queue.add({ title: 'Never announce' })).toThrow(AggregateError);
    const after = __toastTestHooks.get(queue)!;
    expect(after.records).toHaveLength(0);
    expect(after.announcementCount).toBe(0);
    expect(after.announcementKeys).toEqual([]);
  });

  it('drains reentrant add work FIFO while rolling each failed publication back once', () => {
    const queue = createToastQueue({ defaultTimeout: 0 });
    const before = __toastTestHooks.get(queue)!;
    let publications = 0;
    let staged = false;
    before.adapter.subscribe(() => {
      publications += 1;
      if (!staged) {
        staged = true;
        queue.add({ title: 'Staged second' });
      }
      throw new Error(`subscriber failure ${publications}`);
    });

    expect(() => queue.add({ title: 'First' })).toThrow(
      'Tale UI: Toast transaction and staged operations failed; correct the reported operation failures before retrying.',
    );
    const after = __toastTestHooks.get(queue)!;
    expect(publications).toBe(4);
    expect(after.generation).toBe(before.generation);
    expect(after.records).toHaveLength(0);
  });

  it('commits clear callbacks before draining a reentrant subscriber add', () => {
    const events: string[] = [];
    const queue = createToastQueue({ defaultTimeout: 0 });
    queue.add({ title: 'First' }, { onClose: () => events.push('callback:first') });
    queue.add({ title: 'Second' }, { onClose: () => events.push('callback:second') });
    const adapter = __toastTestHooks.get(queue)!.adapter;
    let staged = false;
    adapter.subscribe(() => {
      events.push(staged ? 'subscriber:staged-add' : 'subscriber:clear');
      if (!staged) {
        staged = true;
        queue.add({ title: 'After clear' });
        throw new Error('clear subscriber failed');
      }
    });

    expect(() => queue.clear()).toThrow('clear subscriber failed');
    expect(events).toEqual([
      'subscriber:clear',
      'callback:first',
      'callback:second',
      'subscriber:staged-add',
    ]);
    expect(__toastTestHooks.get(queue)!.records.map((record) => record.message.title)).toEqual([
      'After clear',
    ]);
  });

  it('preserves subscriber then callback error order for close and clear', () => {
    const closeQueue = createToastQueue({ defaultTimeout: 0 });
    const closeKey = closeQueue.add(
      { title: 'Close' },
      {
        onClose() {
          throw new Error('close callback');
        },
      },
    );
    __toastTestHooks.get(closeQueue)!.adapter.subscribe(() => {
      throw new Error('close subscriber');
    });
    let closeError: unknown;
    try {
      closeQueue.close(closeKey);
    } catch (error) {
      closeError = error;
    }
    expect((closeError as AggregateError).errors.map((error) => (error as Error).message)).toEqual([
      'close subscriber',
      'close callback',
    ]);

    const clearQueue = createToastQueue({ defaultTimeout: 0 });
    clearQueue.add(
      { title: 'First' },
      {
        onClose() {
          throw new Error('first callback');
        },
      },
    );
    clearQueue.add(
      { title: 'Second' },
      {
        onClose() {
          throw new Error('second callback');
        },
      },
    );
    __toastTestHooks.get(clearQueue)!.adapter.subscribe(() => {
      throw new Error('clear subscriber');
    });
    let clearError: unknown;
    try {
      clearQueue.clear();
    } catch (error) {
      clearError = error;
    }
    expect((clearError as AggregateError).errors.map((error) => (error as Error).message)).toEqual([
      'clear subscriber',
      'first callback',
      'second callback',
    ]);
  });

  it('throws a single committed callback or subscriber error unchanged', () => {
    const callbackError = new Error('single callback');
    const callbackQueue = createToastQueue({ defaultTimeout: 0 });
    const callbackKey = callbackQueue.add(
      { title: 'Callback' },
      {
        onClose() {
          throw callbackError;
        },
      },
    );
    let observedCallbackError: unknown;
    try {
      callbackQueue.close(callbackKey);
    } catch (error) {
      observedCallbackError = error;
    }
    expect(observedCallbackError).toBe(callbackError);

    const subscriberError = new Error('single subscriber');
    const subscriberQueue = createToastQueue({ defaultTimeout: 0 });
    subscriberQueue.add({ title: 'Subscriber' });
    __toastTestHooks.get(subscriberQueue)!.adapter.subscribe(() => {
      throw subscriberError;
    });
    let observedSubscriberError: unknown;
    try {
      subscriberQueue.clear();
    } catch (error) {
      observedSubscriberError = error;
    }
    expect(observedSubscriberError).toBe(subscriberError);
  });

  it('keeps manual, interaction, and owner-loss timer pauses independent', async () => {
    vi.useFakeTimers();
    try {
      const manualCallback = vi.fn();
      const manualQueue = createToastQueue({ defaultTimeout: 100 });
      manualQueue.add({ title: 'Manual pause' }, { onClose: manualCallback });
      const { unmount: unmountManual } = await render(<ToastRegion queue={manualQueue} />);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });

      act(() => manualQueue.pauseAll());
      await act(async () => {
        await vi.advanceTimersByTimeAsync(200);
      });
      expect(manualCallback).not.toHaveBeenCalled();

      act(() => manualQueue.resumeAll());
      await act(async () => {
        await vi.advanceTimersByTimeAsync(99);
      });
      expect(manualCallback).not.toHaveBeenCalled();
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1);
      });
      expect(manualCallback).toHaveBeenCalledTimes(1);
      unmountManual();

      const hoverCallback = vi.fn();
      const hoverQueue = createToastQueue({ defaultTimeout: 100 });
      hoverQueue.add({ title: 'Hover pause' }, { onClose: hoverCallback });
      const { unmount: unmountHover } = await render(
        <ToastRegion queue={hoverQueue} aria-label="Hover notifications" />,
      );
      const hoverRegion = screen.getByRole('region', { name: 'Hover notifications' });
      await act(async () => {
        await vi.advanceTimersByTimeAsync(40);
      });
      fireEvent.pointerEnter(hoverRegion);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(200);
      });
      expect(hoverCallback).not.toHaveBeenCalled();
      fireEvent.pointerLeave(hoverRegion);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(59);
      });
      expect(hoverCallback).not.toHaveBeenCalled();
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1);
      });
      expect(hoverCallback).toHaveBeenCalledTimes(1);
      unmountHover();

      const focusCallback = vi.fn();
      const focusQueue = createToastQueue({ defaultTimeout: 100 });
      focusQueue.add({ title: 'Focus pause' }, { onClose: focusCallback });
      const { unmount: unmountFocus } = await render(
        <ToastRegion queue={focusQueue} aria-label="Focus notifications" />,
      );
      const dismiss = screen.getByRole('button', { name: 'Dismiss notification' });
      act(() => dismiss.focus());
      await act(async () => {
        await vi.advanceTimersByTimeAsync(200);
      });
      expect(focusCallback).not.toHaveBeenCalled();
      act(() => dismiss.blur());
      await act(async () => {
        await vi.advanceTimersByTimeAsync(100);
      });
      expect(focusCallback).toHaveBeenCalledTimes(1);
      unmountFocus();

      const ownerCallback = vi.fn();
      const ownerQueue = createToastQueue({ defaultTimeout: 100 });
      ownerQueue.add({ title: 'Owner pause' }, { onClose: ownerCallback });
      const { unmount: unmountFirstOwner } = await render(
        <ToastRegion queue={ownerQueue} aria-label="Owner notifications" />,
      );
      await act(async () => {
        await vi.advanceTimersByTimeAsync(40);
      });
      unmountFirstOwner();
      await act(async () => {
        await vi.advanceTimersByTimeAsync(200);
      });
      expect(ownerCallback).not.toHaveBeenCalled();
      const { unmount: unmountSecondOwner } = await render(
        <ToastRegion queue={ownerQueue} aria-label="Owner notifications" />,
      );
      await act(async () => {
        await vi.advanceTimersByTimeAsync(59);
      });
      expect(ownerCallback).not.toHaveBeenCalled();
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1);
      });
      expect(ownerCallback).toHaveBeenCalledTimes(1);
      unmountSecondOwner();
    } finally {
      vi.useRealTimers();
    }
  });

  it('chunks timeouts above the platform delay limit without expiring early', async () => {
    vi.useFakeTimers();
    try {
      const callback = vi.fn();
      const queue = createToastQueue({ defaultTimeout: 2_147_484_647 });
      queue.add({ title: 'Long lived' }, { onClose: callback });
      const view = await render(<ToastRegion queue={queue} />);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(2_147_483_647);
      });
      expect(callback).not.toHaveBeenCalled();
      await act(async () => {
        await vi.advanceTimersByTimeAsync(999);
      });
      expect(callback).not.toHaveBeenCalled();
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1);
      });
      expect(callback).toHaveBeenCalledTimes(1);
      view.unmount();
    } finally {
      vi.useRealTimers();
    }
  });

  it('promotes the oldest standby lease without replacing state or adapter identity', async () => {
    const queue = createToastQueue({ defaultTimeout: 0 });
    queue.add({ title: 'Leased' });
    let hideFirst!: () => void;

    function Harness() {
      const [first, setFirst] = React.useState(true);
      hideFirst = () => setFirst(false);
      return (
        <React.Fragment>
          {first ? <ToastRegion queue={queue} aria-label="Primary notifications" /> : null}
          <ToastRegion queue={queue} aria-label="Standby notifications" />
        </React.Fragment>
      );
    }

    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    await render(<Harness />);
    await screen.findByRole('region', { name: 'Primary notifications' });
    const before = __toastTestHooks.get(queue)!;
    expect(screen.queryByRole('region', { name: 'Standby notifications' })).toBeNull();

    act(() => hideFirst());
    await screen.findByRole('region', { name: 'Standby notifications' });
    const after = __toastTestHooks.get(queue)!;
    expect(after.adapter).toBe(before.adapter);
    expect(after.generation).toBe(before.generation);
    expect(after.records.map((record) => record.message.title)).toEqual(['Leased']);
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });

  it('uses Tale localization overrides, pseudo-localization, and RTL direction', async () => {
    const queue = createToastQueue({ defaultTimeout: 0 });
    queue.add({ title: 'Localized' });

    await render(
      <I18nProvider
        locale="fr-FR"
        mode="rtl"
        messages={{
          'toast.region': 'Alertes',
          'toast.dismiss': 'Fermer',
        }}
      >
        <ToastRegion queue={queue} />
      </I18nProvider>,
    );
    await screen.findByRole('region', { name: 'Alertes' });
    expect(screen.getByRole('button', { name: 'Fermer' })).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Alertes' }).getAttribute('dir')).toBe('rtl');
  });

  it('renders empty on the server and first hydration pass, then mounts the Region from its lease', async () => {
    const queue = createToastQueue({ defaultTimeout: 0 });
    queue.add({ title: 'Hydrated' });
    const view = renderToString(<ToastRegion queue={queue} />);
    expect(screen.queryByRole('region')).toBeNull();

    const hydrated = view.hydrate();
    await screen.findByRole('region', { name: 'Notifications' });
    expect(document.querySelector('.tale-toast__title')?.textContent).toBe('Hydrated');
    hydrated.unmount();
  });
});
