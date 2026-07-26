import * as React from 'react';
import { cx } from '../_cx';

type SkeletonDomProps = Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  | 'children'
  | 'aria-hidden'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-describedby'
  | 'role'
  | 'tabIndex'
  | 'contentEditable'
  | 'dangerouslySetInnerHTML'
>;

interface SkeletonOwnedDomProps {
  children?: never;
  'aria-hidden'?: never;
  'aria-label'?: never;
  'aria-labelledby'?: never;
  'aria-describedby'?: never;
  role?: never;
  tabIndex?: never;
  contentEditable?: never;
  dangerouslySetInnerHTML?: never;
}

export interface SkeletonProps extends SkeletonDomProps, SkeletonOwnedDomProps {
  /** Shape of the placeholder. */
  variant?: 'text' | 'rectangular' | 'circular';
  /** Width applied after the matching field in style. */
  width?: React.CSSProperties['width'];
  /** Height applied after the matching field in style. */
  height?: React.CSSProperties['height'];
  /** Animation treatment. */
  animation?: 'pulse' | 'none';
}

type RuntimeSkeletonInput = Omit<
  SkeletonProps,
  | 'children'
  | 'aria-hidden'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-describedby'
  | 'role'
  | 'tabIndex'
  | 'contentEditable'
  | 'dangerouslySetInnerHTML'
> & {
  children?: unknown;
  'aria-hidden'?: unknown;
  'aria-label'?: unknown;
  'aria-labelledby'?: unknown;
  'aria-describedby'?: unknown;
  role?: unknown;
  tabIndex?: unknown;
  contentEditable?: unknown;
  dangerouslySetInnerHTML?: unknown;
};

function normalizeDimension(value: unknown): React.CSSProperties['width'] | undefined {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }

  return typeof value === 'string' ? value : undefined;
}

/**
 * A decorative, empty placeholder for content that is still loading.
 *
 * @status experimental
 *
 * @example
 * ```tsx
 * import { Skeleton } from '@tale-ui/react/skeleton';
 *
 * <Skeleton width="12rem" height="1rem" />
 * ```
 */
export const Skeleton = React.forwardRef<HTMLSpanElement, SkeletonProps>((runtimeProps, ref) => {
  const {
    variant,
    width,
    height,
    animation,
    className,
    style,
    children: blockedChildren,
    'aria-hidden': blockedAriaHidden,
    'aria-label': blockedAriaLabel,
    'aria-labelledby': blockedAriaLabelledby,
    'aria-describedby': blockedAriaDescribedby,
    role: blockedRole,
    tabIndex: blockedTabIndex,
    contentEditable: blockedContentEditable,
    dangerouslySetInnerHTML: blockedDangerouslySetInnerHTML,
    ...rest
  } = runtimeProps as RuntimeSkeletonInput;
  void [
    blockedChildren,
    blockedAriaHidden,
    blockedAriaLabel,
    blockedAriaLabelledby,
    blockedAriaDescribedby,
    blockedRole,
    blockedTabIndex,
    blockedContentEditable,
    blockedDangerouslySetInnerHTML,
  ];

  const resolvedVariant = variant === 'rectangular' || variant === 'circular' ? variant : 'text';
  const resolvedAnimation = animation === 'none' ? 'none' : 'pulse';
  const safeClassName = typeof className === 'string' ? className : undefined;
  const safeStyle: React.CSSProperties =
    style !== null && typeof style === 'object' && !Array.isArray(style) ? { ...style } : {};

  if (width !== undefined) {
    const resolvedWidth = normalizeDimension(width);
    if (resolvedWidth === undefined) {
      delete safeStyle.width;
    } else {
      safeStyle.width = resolvedWidth;
    }
  }

  if (height !== undefined) {
    const resolvedHeight = normalizeDimension(height);
    if (resolvedHeight === undefined) {
      delete safeStyle.height;
    } else {
      safeStyle.height = resolvedHeight;
    }
  }

  return (
    <span
      {...rest}
      ref={ref}
      aria-hidden="true"
      className={cx(
        `tale-skeleton tale-skeleton--${resolvedVariant} tale-skeleton--${resolvedAnimation}`,
        safeClassName,
      )}
      style={safeStyle}
    />
  );
});
Skeleton.displayName = 'Skeleton';
