import * as React from 'react';
import { warn } from '@tale-ui/utils/warn';
import { Blockquote } from '../blockquote';
import { Code } from '../code';
import { CodeBlock } from '../code-block';
import { Link } from '../link';
import { cx } from '../_cx';
import { getSafeUrl } from '../utils/safeUrl';
import { parseMarkdown, type MarkdownBlockNode, type MarkdownInlineNode } from './markdownParser';

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

const HTTP_PROTOCOLS = ['http:', 'https:'] as const;
const MARKDOWN_LINK_PROTOCOLS = ['http:', 'https:', 'mailto:'] as const;

function getSafeBaseUrl(value: unknown): string | undefined {
  return getSafeUrl(value, { protocols: HTTP_PROTOCOLS });
}

function getSafeLinkHref(value: string, baseUrl: string | undefined): string | undefined {
  return getSafeUrl(value, {
    protocols: MARKDOWN_LINK_PROTOCOLS,
    baseUrl,
    allowFragment: true,
    preserveAbsoluteInput: true,
  });
}

function renderInlineNodes(
  nodes: readonly MarkdownInlineNode[],
  keyPrefix: string,
  baseUrl: string | undefined,
): React.ReactNode[] {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`;
    switch (node.type) {
      case 'text':
        return <React.Fragment key={key}>{node.value}</React.Fragment>;
      case 'emphasis':
        return <em key={key}>{renderInlineNodes(node.children, key, baseUrl)}</em>;
      case 'strong':
        return <strong key={key}>{renderInlineNodes(node.children, key, baseUrl)}</strong>;
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
      default: {
        const exhaustiveNode: never = node;
        void exhaustiveNode;
        throw new Error('Unsupported Markdown inline node');
      }
    }
  });
}

function renderBlockNodes(
  nodes: readonly MarkdownBlockNode[],
  keyPrefix: string,
  baseUrl: string | undefined,
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
      default: {
        const exhaustiveNode: never = node;
        void exhaustiveNode;
        throw new Error('Unsupported Markdown block node');
      }
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
