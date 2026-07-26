import { Lexer, type Token, type Tokens } from 'marked';

export const MARKDOWN_SOURCE_LIMIT = 100_000;
export const MARKDOWN_LINE_LIMIT = 10_000;
export const MARKDOWN_DEPTH_LIMIT = 32;
export const MARKDOWN_NODE_LIMIT = 10_000;

export type MarkdownFailureCode =
  | 'MARKDOWN_INVALID_SOURCE_TYPE'
  | 'MARKDOWN_SOURCE_LIMIT_EXCEEDED'
  | 'MARKDOWN_LINE_LIMIT_EXCEEDED'
  | 'MARKDOWN_DEPTH_LIMIT_EXCEEDED'
  | 'MARKDOWN_NODE_LIMIT_EXCEEDED'
  | 'MARKDOWN_PARSER_FAILED'
  | 'MARKDOWN_FILTER_FAILED';

export type MarkdownInlineNode =
  | { type: 'text'; value: string }
  | { type: 'emphasis'; children: MarkdownInlineNode[] }
  | { type: 'strong'; children: MarkdownInlineNode[] }
  | { type: 'code'; value: string }
  | { type: 'link'; href: string; children: MarkdownInlineNode[] }
  | { type: 'break' };

export type MarkdownBlockNode =
  | { type: 'paragraph'; children: MarkdownInlineNode[] }
  | { type: 'heading'; level: number; children: MarkdownInlineNode[] }
  | { type: 'code'; value: string; language?: string }
  | { type: 'blockquote'; children: MarkdownBlockNode[] }
  | { type: 'list'; ordered: boolean; items: MarkdownBlockNode[][] }
  | { type: 'thematic-break' };

export type MarkdownParseResult =
  | { ok: true; nodes: MarkdownBlockNode[]; parsedNodeCount: number }
  | { ok: false; code: MarkdownFailureCode };

class MarkdownBoundaryError extends Error {
  constructor(readonly code: MarkdownFailureCode) {
    super(code);
  }
}

function checkSourceLimits(source: string): MarkdownFailureCode | undefined {
  if (source.length > MARKDOWN_SOURCE_LIMIT) {
    return 'MARKDOWN_SOURCE_LIMIT_EXCEEDED';
  }

  let lineLength = 0;
  for (let index = 0; index < source.length; index += 1) {
    const character = source.charCodeAt(index);
    if (character === 10 || character === 13) {
      lineLength = 0;
      if (character === 13 && source.charCodeAt(index + 1) === 10) {
        index += 1;
      }
    } else {
      lineLength += 1;
      if (lineLength > MARKDOWN_LINE_LIMIT) {
        return 'MARKDOWN_LINE_LIMIT_EXCEEDED';
      }
    }
  }

  return undefined;
}

function childTokenGroups(token: Token): Token[][] {
  const groups: Token[][] = [];
  if ('tokens' in token && Array.isArray(token.tokens)) {
    groups.push(token.tokens);
  }

  if (token.type === 'list') {
    for (const item of token.items) {
      groups.push([item]);
    }
  }

  if (token.type === 'table') {
    for (const cell of [...token.header, ...token.rows.flat()]) {
      groups.push(cell.tokens);
    }
  }

  return groups;
}

function assertParsedBoundaries(tokens: readonly Token[]): number {
  let nodeCount = 0;

  const visit = (group: readonly Token[], depth: number) => {
    for (const token of group) {
      nodeCount += 1;
      if (nodeCount > MARKDOWN_NODE_LIMIT) {
        throw new MarkdownBoundaryError('MARKDOWN_NODE_LIMIT_EXCEEDED');
      }

      const childDepth =
        token.type === 'blockquote' ||
        token.type === 'list' ||
        token.type === 'strong' ||
        token.type === 'em' ||
        token.type === 'link'
          ? depth + 1
          : depth;
      if (childDepth > MARKDOWN_DEPTH_LIMIT) {
        throw new MarkdownBoundaryError('MARKDOWN_DEPTH_LIMIT_EXCEEDED');
      }

      for (const children of childTokenGroups(token)) {
        visit(children, childDepth);
      }
    }
  };

  visit(tokens, 0);
  return nodeCount;
}

function filterInlineTokens(tokens: readonly Token[]): MarkdownInlineNode[] {
  const output: MarkdownInlineNode[] = [];

  for (const token of tokens) {
    switch (token.type) {
      case 'text':
      case 'escape':
        if ('tokens' in token && Array.isArray(token.tokens)) {
          output.push(...filterInlineTokens(token.tokens));
        } else {
          output.push({ type: 'text', value: token.text });
        }
        break;
      case 'strong':
        output.push({
          type: 'strong',
          children: filterInlineTokens(
            'tokens' in token && Array.isArray(token.tokens) ? token.tokens : [],
          ),
        });
        break;
      case 'em':
        output.push({
          type: 'emphasis',
          children: filterInlineTokens(
            'tokens' in token && Array.isArray(token.tokens) ? token.tokens : [],
          ),
        });
        break;
      case 'codespan':
        output.push({ type: 'code', value: token.text });
        break;
      case 'link':
        output.push({
          type: 'link',
          href: token.href,
          children: filterInlineTokens(
            'tokens' in token && Array.isArray(token.tokens) ? token.tokens : [],
          ),
        });
        break;
      case 'image':
        output.push({ type: 'text', value: token.text });
        break;
      case 'br':
        output.push({ type: 'break' });
        break;
      case 'del':
        output.push(
          ...filterInlineTokens(
            'tokens' in token && Array.isArray(token.tokens) ? token.tokens : [],
          ),
        );
        break;
      case 'html':
        break;
      default:
        if ('tokens' in token && Array.isArray(token.tokens)) {
          output.push(...filterInlineTokens(token.tokens));
        } else if ('text' in token && typeof token.text === 'string') {
          output.push({ type: 'text', value: token.text });
        }
    }
  }

  return output;
}

function filterListItem(item: Tokens.ListItem): MarkdownBlockNode[] {
  return filterBlockTokens(item.tokens);
}

function filterBlockTokens(tokens: readonly Token[]): MarkdownBlockNode[] {
  const output: MarkdownBlockNode[] = [];

  for (const token of tokens) {
    switch (token.type) {
      case 'space':
      case 'def':
      case 'html':
        break;
      case 'paragraph':
        output.push({
          type: 'paragraph',
          children: filterInlineTokens(
            'tokens' in token && Array.isArray(token.tokens) ? token.tokens : [],
          ),
        });
        break;
      case 'text':
        output.push({
          type: 'paragraph',
          children:
            'tokens' in token && Array.isArray(token.tokens)
              ? filterInlineTokens(token.tokens)
              : [{ type: 'text', value: token.text }],
        });
        break;
      case 'heading':
        output.push({
          type: 'heading',
          level: token.depth,
          children: filterInlineTokens(
            'tokens' in token && Array.isArray(token.tokens) ? token.tokens : [],
          ),
        });
        break;
      case 'code': {
        const isFenced = token.raw.startsWith('```') || token.raw.startsWith('~~~');
        if (isFenced) {
          const language = token.lang?.trim().split(/\s+/, 1)[0];
          output.push({
            type: 'code',
            value: token.text,
            ...(language ? { language } : {}),
          });
        } else {
          output.push({
            type: 'paragraph',
            children: [{ type: 'text', value: token.text }],
          });
        }
        break;
      }
      case 'blockquote':
        output.push({
          type: 'blockquote',
          children: filterBlockTokens(
            'tokens' in token && Array.isArray(token.tokens) ? token.tokens : [],
          ),
        });
        break;
      case 'list':
        output.push({
          type: 'list',
          ordered: token.ordered,
          items: token.items.map(filterListItem),
        });
        break;
      case 'hr':
        output.push({ type: 'thematic-break' });
        break;
      default:
        if ('tokens' in token && Array.isArray(token.tokens)) {
          const children = filterInlineTokens(token.tokens);
          if (children.length > 0) {
            output.push({ type: 'paragraph', children });
          }
        } else if ('text' in token && typeof token.text === 'string') {
          output.push({
            type: 'paragraph',
            children: [{ type: 'text', value: token.text }],
          });
        }
    }
  }

  return output;
}

export function parseMarkdown(source: unknown): MarkdownParseResult {
  if (typeof source !== 'string') {
    return { ok: false, code: 'MARKDOWN_INVALID_SOURCE_TYPE' };
  }

  const limitFailure = checkSourceLimits(source);
  if (limitFailure) {
    return { ok: false, code: limitFailure };
  }

  let tokens: Token[];
  try {
    tokens = Lexer.lex(source, {
      async: false,
      breaks: false,
      gfm: false,
      pedantic: false,
    });
  } catch {
    return { ok: false, code: 'MARKDOWN_PARSER_FAILED' };
  }

  let parsedNodeCount: number;
  try {
    parsedNodeCount = assertParsedBoundaries(tokens);
  } catch (error) {
    if (error instanceof MarkdownBoundaryError) {
      return { ok: false, code: error.code };
    }
    return { ok: false, code: 'MARKDOWN_FILTER_FAILED' };
  }

  try {
    return {
      ok: true,
      nodes: filterBlockTokens(tokens),
      parsedNodeCount,
    };
  } catch {
    return { ok: false, code: 'MARKDOWN_FILTER_FAILED' };
  }
}
