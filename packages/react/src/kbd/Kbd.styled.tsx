import * as React from 'react';
import { cx } from '../_cx';

export type KbdSize = 'sm' | 'md';

export interface KbdProps extends Omit<React.ComponentPropsWithoutRef<'kbd'>, 'className'> {
  /** Visual size. @default 'md' */
  size?: KbdSize | undefined;
  className?: string | undefined;
}

/**
 * Semantic keyboard input or shortcut hint.
 *
 * @example
 * ```tsx
 * import { Kbd } from '@tale-ui/react/kbd';
 *
 * <span>Open search with <Kbd>⌘</Kbd> <Kbd>K</Kbd></span>
 * ```
 *
 * @status experimental
 */
export const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ size = 'md', className, ...props }, ref) => (
    <kbd ref={ref} className={cx(`tale-kbd tale-kbd--${size}`, className)} {...props} />
  ),
);
Kbd.displayName = 'Kbd';
