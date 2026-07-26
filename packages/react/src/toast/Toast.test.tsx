import * as React from 'react';
import { act, screen, waitFor } from '@tale-ui/monorepo-tests/test-utils';
import { createRenderer } from '#test-utils';
import { I18nProvider } from '../i18n-provider';
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

  it('routes RAC dismiss through Tale cleanup and invokes the callback exactly once', async () => {
    const onClose = vi.fn();
    const queue = createToastQueue({ defaultTimeout: 0 });
    queue.add({ title: 'Dismiss me' }, { onClose });
    const { user } = await render(<ToastRegion queue={queue} dismissLabel="Close saved notice" />);
    await screen.findByRole('button', { name: 'Close saved notice' });

    await user.click(screen.getByRole('button', { name: 'Close saved notice' }));

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

      expect(() => queue.close(key)).toThrow(`raw close ${timing}`);
      const after = __toastTestHooks.get(queue)!;
      expect(after.adapter).toBe(stableAdapter);
      expect(after.generation).not.toBe(before.generation);
      expect(after.records.map((record) => record.key)).toEqual([key]);
      expect(after.adapter.visibleToasts).toBe(after.generation.visibleToasts);
      expect(callback).not.toHaveBeenCalled();
    },
  );

  it('rebuilds a failed clear without consuming callbacks or records', () => {
    const calls: string[] = [];
    const queue = createToastQueue({ maxVisibleToasts: 2, defaultTimeout: 0 });
    queue.add({ title: 'First' }, { onClose: () => calls.push('first') });
    queue.add({ title: 'Second' }, { onClose: () => calls.push('second') });
    const before = __toastTestHooks.get(queue)!;
    vi.spyOn(before.generation, 'clear').mockImplementationOnce(() => {
      throw new Error('raw clear');
    });

    expect(() => queue.clear()).toThrow('raw clear');
    const after = __toastTestHooks.get(queue)!;
    expect(after.records.map((record) => record.message.title)).toEqual(['Second', 'First']);
    expect(calls).toEqual([]);
  });

  it('poison-resets consistently when raw recovery also fails and rejects later mutations', () => {
    const calls: string[] = [];
    const queue = createToastQueue({ defaultTimeout: 0 });
    const key = queue.add({ title: 'Discarded' }, { onClose: () => calls.push('closed') });
    const debug = __toastTestHooks.get(queue)!;
    vi.spyOn(debug.generation, 'close').mockImplementationOnce(() => {
      throw new Error('raw close failed');
    });
    __toastTestHooks.setRawFactory(queue, () => {
      throw new Error('rebuild failed');
    });

    expect(() => queue.close(key)).toThrow(AggregateError);
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

  it('keeps manual, interaction, and owner-loss timer pauses independent', async () => {
    vi.useFakeTimers();
    try {
      const callback = vi.fn();
      const queue = createToastQueue({ defaultTimeout: 100 });
      queue.add({ title: 'Timed' }, { onClose: callback });
      const view = await render(<ToastRegion queue={queue} />);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });

      act(() => queue.pauseAll());
      await act(async () => {
        await vi.advanceTimersByTimeAsync(200);
      });
      expect(callback).not.toHaveBeenCalled();

      act(() => queue.resumeAll());
      await act(async () => {
        await vi.advanceTimersByTimeAsync(99);
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
