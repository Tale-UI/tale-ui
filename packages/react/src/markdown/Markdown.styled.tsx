import * as React from 'react';
import { warn } from '@tale-ui/utils/warn';
import { Blockquote } from '../blockquote';
import { Code } from '../code';
import { CodeBlock } from '../code-block';
import { Link } from '../link';
import { cx } from '../_cx';
import {
  parseMarkdown,
  type MarkdownBlockNode,
  type MarkdownInlineNode,
} from './markdownParser';

type SafeDomProps<T> = Omit<T, 'dangerouslySetInnerHTML'>;

export interface MarkdownProps extends SafeDomProps<
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>
> {
  /** Bounded Markdown source. Raw HTML and executable extensions are never rendered. */
  children: string;
  /** Absolute credential-free HTTP(S) base used only to resolve relative links. */
  baseUrl?: string | undefined;
  /** Content shown when parsing or filtering fails. @default "Content unavailable" */
  invalidFallback?: React.ReactNode;
}

type RuntimeMarkdownProps = MarkdownProps & {
  children?: unknown;
  baseUrl?: unknown;
  dangerouslySetInnerHTML?: unknown;
};

function containsControlCharacter(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code <= 31 || code === 127) {
      return true;
    }
  }
  return false;
}

function getSafeBaseUrl(value: unknown): URL | undefined {
  if (
    typeof value !== 'string' ||
    value.trim() !== value ||
    containsControlCharacter(value)
  ) {
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
    return url;
  } catch {
    return undefined;
  }
}

function getSafeLinkHref(value: string, baseUrl: URL | undefined): string | undefined {
  if (
    value.length === 0 ||
    value.trim() !== value ||
    containsControlCharacter(value)
  ) {
    return undefined;
  }

  if (value.startsWith('#')) {
    return value;
  }

  try {
    const url = baseUrl ? new URL(value, baseUrl) : new URL(value);
    if (url.username !== '' || url.password !== '') {
      return undefined;
    }
    if (
      url.protocol !== 'http:' &&
      url.protocol !== 'https:' &&
      url.protocol !== 'mailto:'
    ) {
      return undefined;
    }
    return baseUrl && !/^[A-Za-z][A-Za-z\d+.-]*:/.test(value)
      ? url.href
      : value;
  } catch {
    return undefined;
  }
}

function renderInlineNodes(
  nodes: readonly MarkdownInlineNode[],
  keyPrefix: string,
  baseUrl: URL | undefined,
): React.ReactNode[] {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`;
    switch (node.type) {
      case 'text':
        return <React.Fragment key={key}>{node.value}</React.Fragment>;
      case 'emphasis':
        return (
          <em key={key}>
            {renderInlineNodes(node.children, key, baseUrl)}
          </em>
        );
      case 'strong':
        return (
          <strong key={key}>
            {renderInlineNodes(node.children, key, baseUrl)}
          </strong>
        );
      case 'code':
        return <Code key={key}>{node.value}</Code>;
      case 'break':
        return <br key={key} />;
      case 'link': {
        const children = renderInlineNodes(node.children, key, baseUrl);
        const href = getSafeLinkHref(node.href, baseUrl);
        return href ? (
          <Link key={key} href={href}>
            {children}
          </Link>
        ) : (
          <React.Fragment key={key}>{children}</React.Fragment>
        );
      }
    }
  });
}

function renderBlockNodes(
  nodes: readonly MarkdownBlockNode[],
  keyPrefix: string,
  baseUrl: URL | undefined,
): React.ReactNode[] {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`;
    switch (node.type) {
      case 'paragraph':
        return <p key={key}>{renderInlineNodes(node.children, key, baseUrl)}</p>;
      case 'heading': {
        const Heading = `h${Math.min(6, Math.max(1, node.level))}` as keyof Pick<
          React.JSX.IntrinsicElements,
          'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
        >;
        return <Heading key={key}>{renderInlineNodes(node.children, key, baseUrl)}</Heading>;
      }
      case 'code':
        return (
          <CodeBlock key={key} language={node.language}>
            {node.value}
          </CodeBlock>
        );
      case 'blockquote':
        return (
          <Blockquote.Root key={key}>
            {renderBlockNodes(node.children, key, baseUrl)}
          </Blockquote.Root>
        );
      case 'list': {
        const List = node.ordered ? 'ol' : 'ul';
        return (
          <List key={key}>
            {node.items.map((item, itemIndex) => (
              <li key={`${key}-${itemIndex}`}>
                {renderBlockNodes(item, `${key}-${itemIndex}`, baseUrl)}
              </li>
            ))}
          </List>
        );
      }
      case 'thematic-break':
        return <hr key={key} />;
    }
  });
}

/**
 * A bounded Markdown renderer with a fixed, non-extensible trust boundary.
 *
 * @example
 * ```tsx
 * import { Markdown } from '@tale-ui/react/markdown';
 *
 * <Markdown baseUrl="https://docs.example.com/">Read the [guide](./guide).</Markdown>
 * ```
 *
 * @status experimental
 */
export const Markdown = React.forwardRef<HTMLDivElement, MarkdownProps>(
  (
    {
      children,
      baseUrl,
      invalidFallback = 'Content unavailable',
      className,
      dangerouslySetInnerHTML,
      ...props
    }: RuntimeMarkdownProps,
    ref,
  ) => {
    if (dangerouslySetInnerHTML !== undefined) {
      warn('MARKDOWN_DANGEROUS_HTML_OMITTED');
    }

    const result = parseMarkdown(children);
    if (!result.ok) {
      warn(result.code);
      return (
        <div {...props} ref={ref} className={cx('tale-markdown', className)}>
          {invalidFallback}
        </div>
      );
    }

    const safeBaseUrl = getSafeBaseUrl(baseUrl);
    if (baseUrl !== undefined && safeBaseUrl === undefined) {
      warn('MARKDOWN_INVALID_BASE_URL');
    }

    let content: React.ReactNode;
    try {
      content = renderBlockNodes(result.nodes, 'markdown', safeBaseUrl);
    } catch {
      warn('MARKDOWN_RENDER_FAILED');
      content = invalidFallback;
    }

    return (
      <div {...props} ref={ref} className={cx('tale-markdown', className)}>
        {content}
      </div>
    );
  },
);
Markdown.displayName = 'Markdown';
