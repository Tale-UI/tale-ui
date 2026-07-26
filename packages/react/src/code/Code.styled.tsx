import * as React from 'react';
import { cx } from '../_cx';

type SafeDomProps<T> = Omit<T, 'dangerouslySetInnerHTML'>;

export interface CodeProps extends SafeDomProps<
  Omit<React.HTMLAttributes<HTMLElement>, 'children'>
> {
  /** Plain-text inline code. Invalid runtime values render as empty content. */
  children: string;
}

type RuntimeCodeProps = CodeProps & {
  children?: unknown;
  dangerouslySetInnerHTML?: unknown;
};

/**
 * Semantic inline code rendered as escaped plain text.
 *
 * @example
 * ```tsx
 * import { Code } from '@tale-ui/react/code';
 *
 * <Code>pnpm test</Code>
 * ```
 *
 * @status experimental
 */
export const Code = React.forwardRef<HTMLElement, CodeProps>(
  (
    {
      children,
      className,
      dangerouslySetInnerHTML: _dangerouslySetInnerHTML,
      ...props
    }: RuntimeCodeProps,
    ref,
  ) => (
    <code {...props} ref={ref} className={cx('tale-code', className)}>
      {typeof children === 'string' ? children : ''}
    </code>
  ),
);
Code.displayName = 'Code';
