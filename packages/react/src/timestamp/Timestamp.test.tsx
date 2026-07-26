import * as React from 'react';
import { act, screen } from '@tale-ui/monorepo-tests/test-utils';
import { createRenderer } from '#test-utils';
import {
  Timestamp,
  type AbsoluteTimestampProps,
  type RelativeTimestampProps,
  type TimestampProps,
} from './index';
import {
  getTimestampSchedulerGroupCountForTesting,
  setTimestampSchedulerForTesting,
  type TimestampScheduler,
} from './timestampScheduler';

function asRuntimeProps(props: Record<string, unknown>) {
  return props as unknown as TimestampProps;
}

function assertTimestampTypes() {
  <Timestamp value={0} locale="en-US" timeZone="UTC" />;
  <Timestamp
    value="2026-07-27T04:30:00Z"
    locale="en-US"
    timeZone="UTC"
    format="relative"
    now={0}
  />;

  // @ts-expect-error relative timestamps require an explicit now
  <Timestamp value={0} locale="en-US" timeZone="UTC" format="relative" />;
  // @ts-expect-error absolute timestamps do not accept now
  <Timestamp value={0} locale="en-US" timeZone="UTC" now={0} />;
  <Timestamp
    value={0}
    locale="en-US"
    timeZone="UTC"
    format="relative"
    now={0}
    // @ts-expect-error relative timestamps do not accept DateTimeFormat options
    formatOptions={{ year: 'numeric' }}
  />;
  // @ts-expect-error timeZone is owned by the top-level prop
  const invalidOptions: AbsoluteTimestampProps['formatOptions'] = { timeZone: 'UTC' };
  const invalidChildren: TimestampProps = {
    value: 0,
    locale: 'en-US',
    timeZone: 'UTC',
    // @ts-expect-error native children are component-owned
    children: 'unsafe',
  };
  const invalidHtml: RelativeTimestampProps = {
    value: 0,
    locale: 'en-US',
    timeZone: 'UTC',
    format: 'relative',
    now: 0,
    // @ts-expect-error raw HTML is intentionally unsupported
    dangerouslySetInnerHTML: { __html: 'unsafe' },
  };
  void [invalidOptions, invalidChildren, invalidHtml];
}
void assertTimestampTypes;

class TestScheduler implements TimestampScheduler {
  currentTime = 10_000;
  subscriptions: Array<{
    callback: () => void;
    interval: number;
    subscribed: boolean;
  }> = [];

  now = () => this.currentTime;

  subscribe = (interval: number, callback: () => void) => {
    const subscription = { callback, interval, subscribed: true };
    this.subscriptions.push(subscription);
    return () => {
      subscription.subscribed = false;
    };
  };

  tick(milliseconds: number) {
    this.currentTime += milliseconds;
    for (const subscription of this.subscriptions) {
      if (subscription.subscribed) {
        subscription.callback();
      }
    }
  }
}

describe('Timestamp', () => {
  const { render, renderToString } = createRenderer();

  it('uses frozen absolute presets, consumer overrides, and component-owned timezone', async () => {
    const value = '2026-07-27T04:30:00Z';
    await render(
      <Timestamp
        value={value}
        locale="en-US"
        timeZone="Australia/Melbourne"
        format="date"
        formatOptions={
          {
            month: 'long',
            timeZone: 'UTC',
          } as AbsoluteTimestampProps['formatOptions']
        }
        data-testid="timestamp"
      />,
    );
    const timestamp = screen.getByTestId('timestamp');
    const expected = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Australia/Melbourne',
    }).format(new Date(value));

    expect(timestamp.textContent).toBe(expected);
    expect(timestamp.getAttribute('datetime')).toBe('2026-07-27T04:30:00.000Z');
  });

  it.each([
    [new Date('2026-07-27T04:30:00Z'), '2026-07-27T04:30:00.000Z'],
    [Date.parse('2026-07-27T04:30:00Z'), '2026-07-27T04:30:00.000Z'],
    ['2026-07-27T14:30:00+10:00', '2026-07-27T04:30:00.000Z'],
  ])('copies and normalizes valid value %s', async (value, expected) => {
    await render(<Timestamp value={value} locale="en-US" timeZone="UTC" data-testid="timestamp" />);
    expect(screen.getByTestId('timestamp').getAttribute('datetime')).toBe(expected);
  });

  it('copies Date internal slots without invoking hostile subclass overrides', async () => {
    class HostileDate extends Date {
      override getTime(): number {
        throw new Error('consumer getTime must not run');
      }

      override toISOString(): string {
        throw new Error('consumer toISOString must not run');
      }
    }

    const value = new HostileDate('2026-07-27T04:30:00Z');
    await render(<Timestamp value={value} locale="en-US" timeZone="UTC" data-testid="timestamp" />);

    expect(screen.getByTestId('timestamp').getAttribute('datetime')).toBe(
      '2026-07-27T04:30:00.000Z',
    );
  });

  it('fails closed for Date proxies without invoking proxy properties', async () => {
    const value = new Proxy(new Date('2026-07-27T04:30:00Z'), {
      get() {
        throw new Error('proxy property access must not run');
      },
    });

    await expect(
      render(
        <Timestamp
          value={value}
          locale="en-US"
          timeZone="UTC"
          invalidFallback="Unavailable"
          data-testid="timestamp"
        />,
      ),
    ).resolves.toBeTruthy();

    const timestamp = screen.getByTestId('timestamp');
    expect(timestamp.textContent).toBe('Unavailable');
    expect(timestamp.getAttribute('datetime')).toBeNull();
  });

  it.each([
    ['2026-07-27T04:30:00', 'missing offset'],
    ['2026-02-30T04:30:00Z', 'invalid calendar date'],
    ['2026-07-27', 'incomplete timestamp'],
    [Number.POSITIVE_INFINITY, 'non-finite epoch'],
    [new Date(Number.NaN), 'invalid Date'],
  ])('renders the fallback without dateTime for %s (%s)', async (value, _reason) => {
    await render(
      <Timestamp
        {...asRuntimeProps({
          value,
          locale: 'en-US',
          timeZone: 'UTC',
          invalidFallback: 'Unavailable',
        })}
        data-testid="timestamp"
      />,
    );
    const timestamp = screen.getByTestId('timestamp');
    expect(timestamp.textContent).toBe('Unavailable');
    expect(timestamp.getAttribute('datetime')).toBeNull();
  });

  it.each([
    [{ locale: 'bad_locale' }, 'invalid locale'],
    [{ timeZone: 'Moon/Base' }, 'invalid timezone'],
    [{ format: 'calendar' }, 'invalid format'],
    [{ formatOptions: [] }, 'invalid options'],
  ])('preserves normalized dateTime when formatting fails for %s', async (values, _reason) => {
    await render(
      <Timestamp
        {...asRuntimeProps({
          value: '2026-07-27T04:30:00Z',
          locale: 'en-US',
          timeZone: 'UTC',
          ...values,
        })}
        data-testid="timestamp"
      />,
    );
    const timestamp = screen.getByTestId('timestamp');
    expect(timestamp.textContent).toBe('—');
    expect(timestamp.getAttribute('datetime')).toBe('2026-07-27T04:30:00.000Z');
  });

  it.each([
    [90_000, 'in 2 minutes'],
    [-90_000, '2 minutes ago'],
  ])(
    'uses fixed relative units and rounds %s milliseconds away from zero',
    async (delta, expected) => {
      const now = Date.parse('2026-07-27T04:30:00Z');
      const { container } = await render(
        <Timestamp
          value={now + delta}
          locale="en-US"
          timeZone="UTC"
          format="relative"
          now={now}
          refreshInterval={0}
        />,
      );
      expect(container.querySelector('time')?.textContent).toBe(expected);
    },
  );

  it.each([
    [30_000, 'in 30 seconds'],
    [2 * 60_000, 'in 2 minutes'],
    [2 * 3_600_000, 'in 2 hours'],
    [2 * 86_400_000, 'in 2 days'],
    [2 * 604_800_000, 'in 2 weeks'],
    [2 * 2_592_000_000, 'in 2 months'],
    [2 * 31_536_000_000, 'in 2 years'],
  ])('uses the frozen relative unit for a %s millisecond delta', async (delta, expected) => {
    const now = Date.parse('2026-07-27T04:30:00Z');
    const { container } = await render(
      <Timestamp
        value={now + delta}
        locale="en-US"
        timeZone="UTC"
        format="relative"
        now={now}
        refreshInterval={0}
      />,
    );
    expect(container.querySelector('time')?.textContent).toBe(expected);
  });

  it('normalizes relative now through Date intrinsics and fails closed for Date proxies', async () => {
    class HostileDate extends Date {
      override getTime(): number {
        throw new Error('consumer getTime must not run');
      }
    }

    const target = '2026-07-27T04:32:00Z';
    const acceptedNow = new HostileDate('2026-07-27T04:30:00Z');
    let updateNow!: React.Dispatch<React.SetStateAction<Date>>;
    function Harness() {
      const [now, setNow] = React.useState<Date>(acceptedNow);
      updateNow = setNow;
      return (
        <Timestamp
          value={target}
          locale="en-US"
          timeZone="UTC"
          format="relative"
          now={now}
          refreshInterval={0}
          invalidFallback="Unavailable"
          data-testid="timestamp"
        />
      );
    }

    await render(<Harness />);
    expect(screen.getByTestId('timestamp').textContent).toBe('in 2 minutes');

    const proxiedNow = new Proxy(new Date('2026-07-27T04:30:00Z'), {
      get() {
        throw new Error('proxy property access must not run');
      },
    });
    expect(() => act(() => updateNow(proxiedNow))).not.toThrow();

    const timestamp = screen.getByTestId('timestamp');
    expect(timestamp.textContent).toBe('Unavailable');
    expect(timestamp.getAttribute('datetime')).toBe('2026-07-27T04:32:00.000Z');
  });

  it('falls back when formatter option access throws', async () => {
    const formatOptions = {
      get year(): Intl.DateTimeFormatOptions['year'] {
        throw new Error('formatter option failure');
      },
    };
    await render(
      <Timestamp
        value="2026-07-27T04:30:00Z"
        locale="en-US"
        timeZone="UTC"
        formatOptions={formatOptions}
        data-testid="timestamp"
      />,
    );
    const timestamp = screen.getByTestId('timestamp');
    expect(timestamp.textContent).toBe('—');
    expect(timestamp.getAttribute('datetime')).toBe('2026-07-27T04:30:00.000Z');
  });

  it.each([Number.NaN, -1, 999, Number.POSITIVE_INFINITY])(
    'rejects invalid refresh interval %s while preserving target dateTime',
    async (refreshInterval) => {
      await render(
        <Timestamp
          {...asRuntimeProps({
            value: '2026-07-27T04:31:00Z',
            locale: 'en-US',
            timeZone: 'UTC',
            format: 'relative',
            now: '2026-07-27T04:30:00Z',
            refreshInterval,
          })}
          data-testid="timestamp"
        />,
      );
      const timestamp = screen.getByTestId('timestamp');
      expect(timestamp.textContent).toBe('—');
      expect(timestamp.getAttribute('datetime')).toBe('2026-07-27T04:31:00.000Z');
    },
  );

  it('anchors elapsed client time, resubscribes on interval changes, and resets on now changes', async () => {
    const scheduler = new TestScheduler();
    const restore = setTimestampSchedulerForTesting(scheduler);
    const initialNow = Date.parse('2026-07-27T04:30:00Z');
    let updateProps!: React.Dispatch<
      React.SetStateAction<Pick<RelativeTimestampProps, 'now' | 'refreshInterval'>>
    >;
    function Harness() {
      const [changingProps, setChangingProps] = React.useState<
        Pick<RelativeTimestampProps, 'now' | 'refreshInterval'>
      >({
        now: initialNow,
        refreshInterval: 60_000,
      });
      updateProps = setChangingProps;
      return (
        <Timestamp
          value={initialNow + 120_000}
          locale="en-US"
          timeZone="UTC"
          format="relative"
          {...changingProps}
          data-testid="timestamp"
        />
      );
    }
    try {
      const view = await render(<Harness />, { strict: false });
      expect(screen.getByTestId('timestamp').textContent).toBe('in 2 minutes');
      expect(scheduler.subscriptions.map(({ interval }) => interval)).toEqual([60_000]);

      act(() => scheduler.tick(60_000));
      expect(screen.getByTestId('timestamp').textContent).toBe('in 1 minute');

      act(() => updateProps((current) => ({ ...current, refreshInterval: 30_000 })));
      expect(scheduler.subscriptions[0]?.subscribed).toBe(false);
      expect(scheduler.subscriptions[1]?.interval).toBe(30_000);

      act(() => updateProps((current) => ({ ...current, now: initialNow + 60_000 })));
      expect(screen.getByTestId('timestamp').textContent).toBe('in 1 minute');
      expect(scheduler.subscriptions).toHaveLength(2);

      view.unmount();
      expect(scheduler.subscriptions[1]?.subscribed).toBe(false);
    } finally {
      restore();
    }
  });

  it('groups equal intervals and clears the final shared timer', async () => {
    const now = Date.parse('2026-07-27T04:30:00Z');
    const view = await render(
      <React.Fragment>
        <Timestamp
          value={now + 60_000}
          locale="en-US"
          timeZone="UTC"
          format="relative"
          now={now}
          refreshInterval={60_000}
        />
        <Timestamp
          value={now + 120_000}
          locale="en-US"
          timeZone="UTC"
          format="relative"
          now={now}
          refreshInterval={60_000}
        />
      </React.Fragment>,
    );
    expect(getTimestampSchedulerGroupCountForTesting()).toBe(1);
    view.unmount();
    expect(getTimestampSchedulerGroupCountForTesting()).toBe(0);
  });

  it('keeps supplied now output stable across SSR and first hydration', () => {
    const scheduler = new TestScheduler();
    const restore = setTimestampSchedulerForTesting(scheduler);
    try {
      const view = renderToString(
        <Timestamp
          value="2026-07-27T04:32:00Z"
          locale="en-US"
          timeZone="UTC"
          format="relative"
          now="2026-07-27T04:30:00Z"
          refreshInterval={60_000}
          data-testid="timestamp"
        />,
      );
      expect(screen.getByTestId('timestamp').textContent).toBe('in 2 minutes');
      const hydrated = view.hydrate();
      expect(screen.getByTestId('timestamp').textContent).toBe('in 2 minutes');
      hydrated.unmount();
    } finally {
      restore();
    }
  });

  it('forwards refs, merges safe native props, and strips injection props at runtime', async () => {
    const ref = React.createRef<HTMLTimeElement>();
    await render(
      <Timestamp
        {...asRuntimeProps({
          value: '2026-07-27T04:30:00Z',
          locale: 'en-US',
          timeZone: 'UTC',
          className: 'consumer-timestamp',
          title: 'Published',
          dangerouslySetInnerHTML: { __html: '<img src=x onerror=alert(1)>' },
          dateTime: 'consumer-owned',
        })}
        ref={ref}
        data-testid="timestamp"
      />,
    );
    const timestamp = screen.getByTestId('timestamp');
    expect(ref.current).toBe(timestamp);
    expect(timestamp.className).toBe('tale-timestamp consumer-timestamp');
    expect(timestamp.getAttribute('title')).toBe('Published');
    expect(timestamp.getAttribute('datetime')).toBe('2026-07-27T04:30:00.000Z');
    expect(timestamp.querySelector('img')).toBeNull();
  });
});
