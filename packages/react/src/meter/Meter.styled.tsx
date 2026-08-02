import * as React from 'react';
import { Label as AriaLabel, Meter } from 'react-aria-components';
import type { MeterProps as AriaMeterProps } from 'react-aria-components';
import { cx } from '../_cx';
import { getPercentage } from '../utils/getPercentage';

// ── Root ───────────────────────────────────────────────────────────────────

export interface RootProps extends Omit<AriaMeterProps, 'className'> {
  className?: string | undefined;
}

/**
 * A meter displaying a value within a known range (e.g. storage used).
 *
 * @example
 * ```tsx
 * import { Meter } from '@tale-ui/react/meter';
 *
 * <Meter.Root value={60} minValue={0} maxValue={100}>
 *   <Meter.Header>
 *     <Meter.Label>Storage</Meter.Label>
 *     <Meter.Value>60%</Meter.Value>
 *   </Meter.Header>
 *   <Meter.Track>
 *     <Meter.Indicator value={60} />
 *   </Meter.Track>
 * </Meter.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(({ className, ...props }, ref) => (
  <Meter ref={ref} className={cx('tale-meter', className)} {...props} />
));
Root.displayName = 'Meter.Root';

// ── Header (label + value row) ─────────────────────────────────────────────

export const Header = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-meter__header', className)} {...props} />
  ),
);
Header.displayName = 'Meter.Header';

// ── Track ──────────────────────────────────────────────────────────────────

export interface TrackProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string | undefined;
}

export const Track = React.forwardRef<HTMLDivElement, TrackProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-meter__track', className)} {...props} />
  ),
);
Track.displayName = 'Meter.Track';

// ── Indicator ──────────────────────────────────────────────────────────────

export interface IndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The current value.
   */
  value?: number | undefined;
  /**
   * The minimum value.
   * @default 0
   */
  min?: number | undefined;
  /**
   * The maximum value.
   * @default 100
   */
  max?: number | undefined;
  className?: string | undefined;
}

export const Indicator = React.forwardRef<HTMLDivElement, IndicatorProps>(
  ({ className, value = 0, min = 0, max = 100, style, ...props }, ref) => {
    const percentage = getPercentage(value, min, max);
    const indicatorStyle: React.CSSProperties = {
      insetInlineStart: 0,
      height: 'inherit',
      width: `${percentage}%`,
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cx('tale-meter__indicator', className)}
        style={indicatorStyle}
        {...props}
      />
    );
  },
);
Indicator.displayName = 'Meter.Indicator';

// ── Label ──────────────────────────────────────────────────────────────────

export interface LabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string | undefined;
}

export const Label = React.forwardRef<HTMLSpanElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <AriaLabel
      // Meter's LabelContext renders this as a span despite AriaLabel's static ref type.
      ref={ref as React.Ref<HTMLLabelElement>}
      className={cx('tale-meter__label', className)}
      {...props}
    />
  ),
);
Label.displayName = 'Meter.Label';

// ── Value ──────────────────────────────────────────────────────────────────

export interface ValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string | undefined;
}

export const Value = React.forwardRef<HTMLSpanElement, ValueProps>(
  ({ className, children, ...props }, ref) => {
    if (process.env.NODE_ENV !== 'production' && children == null) {
      console.warn(
        'Meter.Value was rendered without children. It is a display-only <span> that renders ' +
          'whatever text you pass as children. Use <Meter.Value>60%</Meter.Value>.',
      );
    }

    return (
      <span ref={ref} aria-hidden className={cx('tale-meter__value', className)} {...props}>
        {children}
      </span>
    );
  },
);
Value.displayName = 'Meter.Value';
