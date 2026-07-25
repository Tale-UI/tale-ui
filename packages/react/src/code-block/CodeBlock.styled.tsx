import * as React from 'react';
import { cx } from '../_cx';

export interface CodeBlockProps
  extends Omit<React.ComponentPropsWithoutRef<'pre'>, 'children' | 'className'> {
  /** Plain-text code. React nodes and raw HTML are intentionally unsupported. */
  children: string;
  /** Informational language identifier. No highlighting is performed. */
  language?: string | undefined;
  /** Wrap long lines instead of horizontal scrolling. @default false */
  wrap?: boolean | undefined;
  className?: string | undefined;
}

/**
 * Plain-text code surface with safe overflow behavior.
 *
 * @example
 * ```tsx
 * import { CodeBlock } from '@tale-ui/react/code-block';
 *
 * <CodeBlock language="tsx">{`export function App() {
 *   return <main>Hello</main>;
 * }`}</CodeBlock>
 * ```
 *
 * @status experimental
 */
export const CodeBlock = React.forwardRef<HTMLPreElement, CodeBlockProps>(
  ({ children, language, wrap = false, className, ...props }, ref) => (
    <pre
      ref={ref}
      data-language={language}
      className={cx(`tale-code-block ${wrap ? 'tale-code-block--wrap' : ''}`, className)}
      {...props}
    >
      <code>{children}</code>
    </pre>
  ),
);
CodeBlock.displayName = 'CodeBlock';
