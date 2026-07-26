import * as React from 'react';
import { warn } from '@tale-ui/utils/warn';
import { cx } from '../_cx';

type SafeDomProps<T> = Omit<T, 'dangerouslySetInnerHTML'>;

type RuntimeUnsafeHtmlProps = {
  dangerouslySetInnerHTML?: unknown;
};

function stripDangerousHtml<T extends object>(props: T): T {
  const { dangerouslySetInnerHTML, ...safeProps } = props as T & RuntimeUnsafeHtmlProps;

  if (dangerouslySetInnerHTML !== undefined) {
    warn('BLOCKQUOTE_DANGEROUS_HTML_OMITTED');
  }

  return safeProps as T;
}

function containsControlCharacter(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code <= 31 || code === 127) {
      return true;
    }
  }

  return false;
}

function getSafeCite(value: unknown): string | undefined {
  if (typeof value !== 'string' || value.trim() !== value || containsControlCharacter(value)) {
    return undefined;
  }

  try {
    const url = new URL(value);
    if (
      (url.protocol !== 'http:' && url.protocol !== 'https:') ||
      url.username !== '' ||
      url.password !== ''
    ) {
      return undefined;
    }
  } catch {
    return undefined;
  }

  return value;
}

export interface BlockquoteRootProps extends SafeDomProps<
  React.BlockquoteHTMLAttributes<HTMLQuoteElement>
> {
  children: React.ReactNode;
}

export interface BlockquoteContentProps extends SafeDomProps<
  React.HTMLAttributes<HTMLParagraphElement>
> {
  children: React.ReactNode;
}

export interface BlockquoteAttributionProps extends SafeDomProps<
  React.HTMLAttributes<HTMLElement>
> {
  children: React.ReactNode;
}

/**
 * A semantic quotation with explicit content and attribution parts.
 *
 * @example
 * ```tsx
 * import { Blockquote } from '@tale-ui/react/blockquote';
 *
 * <Blockquote.Root cite="https://example.com/interview">
 *   <Blockquote.Content>Clarity is kindness.</Blockquote.Content>
 *   <Blockquote.Attribution>Brené Brown</Blockquote.Attribution>
 * </Blockquote.Root>
 * ```
 *
 * @status experimental
 */
export const Root = React.forwardRef<HTMLQuoteElement, BlockquoteRootProps>((props, ref) => {
  const { children, cite, className, ...domProps } = stripDangerousHtml(props);
  const safeCite = getSafeCite(cite);

  if (cite !== undefined && safeCite === undefined) {
    warn('BLOCKQUOTE_INVALID_CITE_OMITTED');
  }

  return (
    <blockquote
      {...domProps}
      ref={ref}
      className={cx('tale-blockquote', className)}
      cite={safeCite}
    >
      {children}
    </blockquote>
  );
});
Root.displayName = 'Blockquote.Root';

/** The quoted prose. Renders a semantic paragraph. @status experimental */
export const Content = React.forwardRef<HTMLParagraphElement, BlockquoteContentProps>(
  (props, ref) => {
    const { children, className, ...domProps } = stripDangerousHtml(props);

    return (
      <p {...domProps} ref={ref} className={cx('tale-blockquote__content', className)}>
        {children}
      </p>
    );
  },
);
Content.displayName = 'Blockquote.Content';

/** The source or speaker attribution. Renders a footer. @status experimental */
export const Attribution = React.forwardRef<HTMLElement, BlockquoteAttributionProps>(
  (props, ref) => {
    const { children, className, ...domProps } = stripDangerousHtml(props);

    return (
      <footer {...domProps} ref={ref} className={cx('tale-blockquote__attribution', className)}>
        {children}
      </footer>
    );
  },
);
Attribution.displayName = 'Blockquote.Attribution';
