import * as React from 'react';
import { Label as AriaLabel, ProgressBar } from 'react-aria-components';
import type { ProgressBarProps as AriaProgressBarProps } from 'react-aria-components';
import { cx } from '../_cx';
import { getPercentage } from '../utils/getPercentage';

// ── Context ─────────────────────────────────────────────────────────────────

export type LabelPosition = 'top' | 'right' | 'bottom' | 'top-floating' | 'bottom-floating';

interface ProgressBarContextValue {
  labelPosition: LabelPosition;
  percentage: number | null;
}

const ProgressBarContext = React.createContext<ProgressBarContextValue>({
  labelPosition: 'top',
  percentage: null,
});

// ── Root ───────────────────────────────────────────────────────────────────

export interface RootProps extends Omit<AriaProgressBarProps, 'className'> {
  className?: string | undefined;
  /**
   * Controls where the label/value text is positioned relative to the track.
   * - `'top'` — Label + Value row above the track (default)
   * - `'right'` — Value text inline to the right of the track
   * - `'bottom'` — Value text below the track
   * - `'top-floating'` — Floating tooltip above the track, aligned to the fill point
   * - `'bottom-floating'` — Floating tooltip below the track, aligned to the fill point
   * @default 'top'
   */
  labelPosition?: LabelPosition | undefined;
}

/**
 * A progress bar showing completion of a task.
 *
 * @example
 * ```tsx
 * import { ProgressBar } from '@tale-ui/react/progress-bar';
 *
 * <ProgressBar.Root value={60} minValue={0} maxValue={100}>
 *   <ProgressBar.Header>
 *     <ProgressBar.Label>Upload progress</ProgressBar.Label>
 *     <ProgressBar.Value>60%</ProgressBar.Value>
 *   </ProgressBar.Header>
 *   <ProgressBar.Track>
 *     <ProgressBar.Indicator value={60} />
 *   </ProgressBar.Track>
 * </ProgressBar.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  (
    { className, labelPosition = 'top', value, minValue = 0, maxValue = 100, children, ...props },
    ref,
  ) => {
    const percentage =
      value != null && Number.isFinite(value as number)
        ? getPercentage(value as number, minValue, maxValue)
        : null;

    return (
      <ProgressBarContext.Provider value={{ labelPosition, percentage }}>
        <ProgressBar
          ref={ref}
          className={cx('tale-progress-bar', className)}
          value={value}
          minValue={minValue}
          maxValue={maxValue}
          data-label-position={labelPosition !== 'top' ? labelPosition : undefined}
          {...props}
        >
          {children}
        </ProgressBar>
      </ProgressBarContext.Provider>
    );
  },
);
Root.displayName = 'ProgressBar.Root';

// ── Header (label + value row) ─────────────────────────────────────────────

export const Header = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-progress-bar__header', className)} {...props} />
  ),
);
Header.displayName = 'ProgressBar.Header';

// ── Track ──────────────────────────────────────────────────────────────────

export interface TrackProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string | undefined;
}

export const Track = React.forwardRef<HTMLDivElement, TrackProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-progress-bar__track', className)} {...props} />
  ),
);
Track.displayName = 'ProgressBar.Track';

// ── Indicator ──────────────────────────────────────────────────────────────

export interface IndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The current value (0–max). When null the bar is indeterminate.
   */
  value?: number | null | undefined;
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
  ({ className, value, min = 0, max = 100, style, ...props }, ref) => {
    const percentage =
      value != null && Number.isFinite(value) ? getPercentage(value, min, max) : null;

    const indicatorStyle: React.CSSProperties =
      percentage != null
        ? { insetInlineStart: 0, height: 'inherit', width: `${percentage}%`, ...style }
        : { ...style };

    return (
      <div
        ref={ref}
        className={cx('tale-progress-bar__indicator', className)}
        data-indeterminate={percentage == null ? '' : undefined}
        style={indicatorStyle}
        {...props}
      />
    );
  },
);
Indicator.displayName = 'ProgressBar.Indicator';

// ── Label ──────────────────────────────────────────────────────────────────

export interface LabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string | undefined;
}

export const Label = React.forwardRef<HTMLSpanElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <AriaLabel
      // ProgressBar's LabelContext renders this as a span despite AriaLabel's static ref type.
      ref={ref as React.Ref<HTMLLabelElement>}
      className={cx('tale-progress-bar__label', className)}
      {...props}
    />
  ),
);
Label.displayName = 'ProgressBar.Label';

// ── Value ──────────────────────────────────────────────────────────────────

export interface ValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string | undefined;
}

export const Value = React.forwardRef<HTMLSpanElement, ValueProps>(
  ({ className, children, style, ...props }, ref) => {
    const { labelPosition, percentage } = React.useContext(ProgressBarContext);

    if (process.env.NODE_ENV !== 'production' && children == null) {
      console.warn(
        'ProgressBar.Value was rendered without children. It is a display-only <span> that renders ' +
          'whatever text you pass as children. Use <ProgressBar.Value>60%</ProgressBar.Value>.',
      );
    }

    const isFloating = labelPosition === 'top-floating' || labelPosition === 'bottom-floating';
    const mergedStyle: React.CSSProperties =
      isFloating && percentage != null ? { left: `${percentage}%`, ...style } : { ...style };

    return (
      <span
        ref={ref}
        aria-hidden
        className={cx('tale-progress-bar__value', className)}
        style={mergedStyle}
        {...props}
      >
        {children}
      </span>
    );
  },
);
Value.displayName = 'ProgressBar.Value';

export type { ProgressBarProps as AriaProgressBarProps } from 'react-aria-components';
