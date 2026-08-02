import * as React from 'react';
import { ProgressBar } from 'react-aria-components';
import type { ProgressBarProps as AriaProgressBarProps } from 'react-aria-components';
import { cx } from '../_cx';
import { getPercentage } from '../utils/getPercentage';

// ── Context ─────────────────────────────────────────────────────────────────

type Size = 'sm' | 'md' | 'lg';

interface ProgressCircleContextValue {
  percentage: number | null;
  size: Size;
}

const ProgressCircleContext = React.createContext<ProgressCircleContextValue>({
  percentage: null,
  size: 'md',
});

// ── Size constants for SVG rendering ────────────────────────────────────────

const SIZE_MAP: Record<Size, number> = { sm: 32, md: 48, lg: 64 };
const STROKE_MAP: Record<Size, number> = { sm: 3, md: 4, lg: 5 };

// ── Root ────────────────────────────────────────────────────────────────────

export interface RootProps extends Omit<AriaProgressBarProps, 'className'> {
  /** Size of the circular indicator. */
  size?: Size | undefined;
  className?: string | undefined;
}

/**
 * A circular progress indicator showing task completion.
 *
 * @example
 * ```tsx
 * import { ProgressCircle } from '@tale-ui/react/progress-circle';
 *
 * <ProgressCircle.Root value={60}>
 *   <ProgressCircle.Track />
 * </ProgressCircle.Root>
 *
 * <ProgressCircle.Root value={null}>
 *   <ProgressCircle.Track />
 * </ProgressCircle.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ size = 'md', className, value, minValue = 0, maxValue = 100, children, ...props }, ref) => {
    const percentage =
      value != null && Number.isFinite(value as number)
        ? getPercentage(value as number, minValue, maxValue)
        : null;
    const sizeClass = size !== 'md' ? ` tale-progress-circle--${size}` : '';
    const isComplete = percentage != null && percentage >= 100;
    return (
      <ProgressCircleContext.Provider value={{ percentage, size }}>
        <ProgressBar
          ref={ref}
          className={cx(`tale-progress-circle${sizeClass}`, className)}
          value={value}
          minValue={minValue}
          maxValue={maxValue}
          data-indeterminate={percentage == null ? '' : undefined}
          data-complete={isComplete ? '' : undefined}
          {...props}
        >
          {children}
        </ProgressBar>
      </ProgressCircleContext.Provider>
    );
  },
);
Root.displayName = 'ProgressCircle.Root';

// ── Track (SVG with rail + indicator circles) ──────────────────────────────

export interface TrackProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'className'> {
  className?: string | undefined;
}

export const Track = React.forwardRef<SVGSVGElement, TrackProps>(({ className, ...props }, ref) => {
  const { percentage, size } = React.useContext(ProgressCircleContext);
  const dim = SIZE_MAP[size];
  const stroke = STROKE_MAP[size];
  const radius = (dim - stroke) / 2;
  return (
    <svg
      ref={ref}
      className={cx('tale-progress-circle__track', className)}
      viewBox={`0 0 ${dim} ${dim}`}
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <circle
        className="tale-progress-circle__rail"
        cx={dim / 2}
        cy={dim / 2}
        r={radius}
        strokeWidth={stroke}
      />
      <circle
        className="tale-progress-circle__indicator"
        cx={dim / 2}
        cy={dim / 2}
        r={radius}
        strokeWidth={stroke}
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={100}
        strokeDashoffset={percentage != null ? 100 - percentage : undefined}
        data-indeterminate={percentage == null ? '' : undefined}
      />
    </svg>
  );
});
Track.displayName = 'ProgressCircle.Track';

// ── Label ──────────────────────────────────────────────────────────────────

export interface LabelProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className'> {
  className?: string | undefined;
}

export const Label = React.forwardRef<HTMLSpanElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-progress-circle__label', className)} {...props} />
  ),
);
Label.displayName = 'ProgressCircle.Label';

// ── Value ──────────────────────────────────────────────────────────────────

export interface ValueProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className'> {
  className?: string | undefined;
}

export const Value = React.forwardRef<HTMLSpanElement, ValueProps>(
  ({ className, children, ...props }, ref) => {
    const { percentage } = React.useContext(ProgressCircleContext);
    return (
      <span ref={ref} className={cx('tale-progress-circle__value', className)} {...props}>
        {children ?? (percentage != null ? `${Math.round(percentage)}%` : undefined)}
      </span>
    );
  },
);
Value.displayName = 'ProgressCircle.Value';
