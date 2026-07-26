'use client';
import * as React from 'react';
import { useIsoLayoutEffect } from '@tale-ui/utils/useIsoLayoutEffect';
import { useStableCallback } from '@tale-ui/utils/useStableCallback';
import { cx } from '../_cx';
import {
  createRelativeTimestampFormatter,
  formatAbsoluteTimestamp,
  formatRelativeTimestamp,
  normalizeRefreshInterval,
  normalizeTimestampValue,
} from './timestampFormat';
import { getTimestampScheduler } from './timestampScheduler';

export type TimestampValue = Date | number | string;

export type TimestampFormatOptions = Omit<Intl.DateTimeFormatOptions, 'timeZone'>;

type SafeDomProps<T> = Omit<T, 'dangerouslySetInnerHTML'>;

interface TimestampBaseProps extends SafeDomProps<
  Omit<React.TimeHTMLAttributes<HTMLTimeElement>, 'children' | 'dateTime'>
> {
  /** Date, finite epoch milliseconds, or a complete offset-bearing timestamp string. */
  value: TimestampValue;
  /** Explicit locale used by the appropriate `Intl` formatter. */
  locale: string;
  /** Explicit IANA timezone used for validation and absolute formatting. */
  timeZone: string;
  /** Content rendered when any value or formatting input is invalid. */
  invalidFallback?: React.ReactNode;
}

export interface AbsoluteTimestampProps extends TimestampBaseProps {
  /** Frozen absolute display preset. Defaults to `datetime`. */
  format?: 'date' | 'time' | 'datetime';
  /** Overrides the selected preset; `timeZone` remains component-owned. */
  formatOptions?: TimestampFormatOptions;
  now?: never;
  refreshInterval?: never;
}

export interface RelativeTimestampProps extends TimestampBaseProps {
  /** Formats the target relative to the required hydration clock. */
  format: 'relative';
  formatOptions?: never;
  /** Explicit server and first-hydration clock. */
  now: TimestampValue;
  /** Shared refresh cadence in milliseconds. Zero disables refresh. */
  refreshInterval?: number;
}

export type TimestampProps = AbsoluteTimestampProps | RelativeTimestampProps;

type RuntimeTimestampProps = TimestampProps & {
  dangerouslySetInnerHTML?: unknown;
  dateTime?: unknown;
  format?: unknown;
  formatOptions?: unknown;
  invalidFallback?: React.ReactNode;
  locale?: unknown;
  now?: unknown;
  refreshInterval?: unknown;
  timeZone?: unknown;
  value?: unknown;
};

interface TimeElementProps extends SafeDomProps<
  Omit<React.TimeHTMLAttributes<HTMLTimeElement>, 'children' | 'dateTime'>
> {
  className?: string | undefined;
  invalidFallback: React.ReactNode;
}

const TimestampElement = React.forwardRef<
  HTMLTimeElement,
  TimeElementProps & {
    dateTime?: string | undefined;
    text: string | null;
  }
>(({ className, dateTime, invalidFallback, text, ...props }, ref) => (
  <time {...props} ref={ref} className={cx('tale-timestamp', className)} dateTime={dateTime}>
    {text ?? invalidFallback}
  </time>
));
TimestampElement.displayName = 'Timestamp.Element';

function RelativeTimestamp({
  className,
  formatter,
  invalidFallback,
  nowMilliseconds,
  forwardedRef,
  refreshInterval,
  targetDateTime,
  targetMilliseconds,
  ...props
}: TimeElementProps & {
  formatter: Intl.RelativeTimeFormat;
  nowMilliseconds: number;
  forwardedRef: React.ForwardedRef<HTMLTimeElement>;
  refreshInterval: number;
  targetDateTime: string;
  targetMilliseconds: number;
}) {
  const scheduler = getTimestampScheduler();
  const [effectiveNow, setEffectiveNow] = React.useState(nowMilliseconds);
  const anchor = React.useRef({
    nowMilliseconds,
    schedulerMilliseconds: 0,
  });

  useIsoLayoutEffect(() => {
    anchor.current = {
      nowMilliseconds,
      schedulerMilliseconds: scheduler.now(),
    };
    setEffectiveNow(nowMilliseconds);
  }, [nowMilliseconds, scheduler]);

  const updateClock = useStableCallback(() => {
    const elapsed = Math.max(0, scheduler.now() - anchor.current.schedulerMilliseconds);
    setEffectiveNow(anchor.current.nowMilliseconds + elapsed);
  });

  React.useEffect(() => {
    if (refreshInterval === 0) {
      return;
    }
    return scheduler.subscribe(refreshInterval, updateClock);
  }, [refreshInterval, scheduler, updateClock]);

  const text = formatRelativeTimestamp(targetMilliseconds, effectiveNow, formatter);

  return (
    <TimestampElement
      {...props}
      ref={forwardedRef}
      className={className}
      dateTime={targetDateTime}
      invalidFallback={invalidFallback}
      text={text}
    />
  );
}

/**
 * Locale- and timezone-explicit absolute or relative native time element.
 *
 * @example
 * ```tsx
 * import { Timestamp } from '@tale-ui/react/timestamp';
 *
 * <Timestamp
 *   value="2026-01-02T03:04:05Z"
 *   locale="en-AU"
 *   timeZone="Australia/Melbourne"
 * />
 * ```
 *
 * @status experimental
 */
export const Timestamp = React.forwardRef<HTMLTimeElement, TimestampProps>(
  (
    {
      value,
      locale,
      timeZone,
      format = 'datetime',
      formatOptions,
      now,
      refreshInterval,
      invalidFallback = '—',
      className,
      dangerouslySetInnerHTML: _dangerouslySetInnerHTML,
      dateTime: _dateTime,
      ...props
    }: RuntimeTimestampProps,
    ref,
  ) => {
    const target = normalizeTimestampValue(value);
    const commonProps = { ...props, className, invalidFallback };

    if (!target) {
      return <TimestampElement {...commonProps} ref={ref} text={null} />;
    }

    if (format === 'relative') {
      const normalizedNow = normalizeTimestampValue(now);
      const normalizedInterval = normalizeRefreshInterval(refreshInterval);
      const formatter = createRelativeTimestampFormatter(locale, timeZone);
      if (
        !normalizedNow ||
        normalizedInterval === null ||
        formatOptions !== undefined ||
        !formatter
      ) {
        return (
          <TimestampElement {...commonProps} ref={ref} dateTime={target.dateTime} text={null} />
        );
      }

      return (
        <RelativeTimestamp
          {...commonProps}
          formatter={formatter}
          forwardedRef={ref}
          nowMilliseconds={normalizedNow.milliseconds}
          refreshInterval={normalizedInterval}
          targetDateTime={target.dateTime}
          targetMilliseconds={target.milliseconds}
        />
      );
    }

    if (now !== undefined || refreshInterval !== undefined) {
      return <TimestampElement {...commonProps} ref={ref} dateTime={target.dateTime} text={null} />;
    }

    const text = formatAbsoluteTimestamp(target, locale, timeZone, format, formatOptions);
    return <TimestampElement {...commonProps} ref={ref} dateTime={target.dateTime} text={text} />;
  },
);
Timestamp.displayName = 'Timestamp';
