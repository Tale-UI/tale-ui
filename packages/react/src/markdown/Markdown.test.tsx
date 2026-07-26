import * as React from 'react';
import { Lexer, type Token } from 'marked';
import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { createRenderer } from '#test-utils';
// The maintained security corpus is repository-gate evidence, not a package export.
// eslint-disable-next-line import/no-relative-packages
import maliciousCorpus from '../../../../test/fixtures/component-equivalence/markdown-malicious-corpus.json';
import { Markdown, type MarkdownProps } from './index';
import {
  MARKDOWN_DEPTH_LIMIT,
  MARKDOWN_LINE_LIMIT,
  MARKDOWN_NODE_LIMIT,
  MARKDOWN_SOURCE_LIMIT,
  parseMarkdown,
} from './markdownParser';

describe('Markdown', () => {
  const { render, renderToString } = createRenderer();

  it('renders the frozen supported syntax through Tale components', async () => {
    const ref = React.createRef<HTMLDivElement>();
    await render(
      <Markdown ref={ref} baseUrl="https://docs.example.com/root/">
        {`# Guide

Paragraph with *emphasis*, **importance**, [a link](./next), and \`inline code\`.

> A bounded quotation.

1. First
2. Second

---

\`\`\`ts
const safe = true;
\`\`\``}
      </Markdown>,
    );

    expect(ref.current?.classList.contains('tale-markdown')).toBe(true);
    expect(screen.getByRole('heading', { level: 1, name: 'Guide' })).toBeTruthy();
    expect(screen.getByText('emphasis').tagName).toBe('EM');
    expect(screen.getByText('importance').tagName).toBe('STRONG');
    expect(screen.getByRole('link', { name: 'a link' }).getAttribute('href')).toBe(
      'https://docs.example.com/root/next',
    );
    expect(screen.getByText('inline code').classList.contains('tale-code')).toBe(true);
    expect(
      screen
        .getByText('A bounded quotation.')
        .closest('blockquote')
        ?.classList.contains('tale-blockquote'),
    ).toBe(true);
    expect(
      screen.getByText('const safe = true;').closest('pre')?.getAttribute('data-language'),
    ).toBe('ts');
    expect(screen.getByText('First').closest('ol')).toBeTruthy();
    expect(ref.current?.querySelector('hr')).toBeTruthy();
  });

  it.each(maliciousCorpus)('keeps corpus case $id inert', async ({ source, text, absent }) => {
    const { container } = await render(<Markdown>{source}</Markdown>);

    expect(container.querySelector('script, img, iframe, object, embed')).toBeNull();
    expect(container.querySelector('[onerror], [onload]')).toBeNull();
    expect(container.querySelector('a')).toBeNull();
    if (text) {
      expect(screen.getByText(text)).toBeTruthy();
    }
    if (absent) {
      expect(container.textContent).not.toContain(absent);
    }
  });

  it('keeps safe HTTP and email angle autolinks as links', async () => {
    await render(<Markdown>{'<https://example.com/safe>\n\n<maintainer@example.com>'}</Markdown>);

    expect(
      screen.getByRole('link', { name: 'https://example.com/safe' }).getAttribute('href'),
    ).toBe('https://example.com/safe');
    expect(screen.getByRole('link', { name: 'maintainer@example.com' }).getAttribute('href')).toBe(
      'mailto:maintainer@example.com',
    );
  });

  it('allows only fragments, safe absolute URLs, mailto, and base-resolved links', async () => {
    await render(
      <Markdown baseUrl="https://docs.example.com/base/">
        {`[fragment](#part)
[http](http://example.com)
[https](https://example.com)
[mail](mailto:hello@example.com)
[relative](../guide)
[protocol relative](//cdn.example.com/guide)
[credentials](https://user:secret@example.com)
[unsupported](file:///tmp/private)`}
      </Markdown>,
    );

    expect(screen.getByRole('link', { name: 'fragment' }).getAttribute('href')).toBe('#part');
    expect(screen.getByRole('link', { name: 'http' }).getAttribute('href')).toBe(
      'http://example.com',
    );
    expect(screen.getByRole('link', { name: 'https' }).getAttribute('href')).toBe(
      'https://example.com',
    );
    expect(screen.getByRole('link', { name: 'mail' }).getAttribute('href')).toBe(
      'mailto:hello@example.com',
    );
    expect(screen.getByRole('link', { name: 'relative' }).getAttribute('href')).toBe(
      'https://docs.example.com/guide',
    );
    expect(screen.getByRole('link', { name: 'protocol relative' }).getAttribute('href')).toBe(
      'https://cdn.example.com/guide',
    );
    expect(screen.queryByRole('link', { name: 'credentials' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'unsupported' })).toBeNull();
  });

  it('uses plain text for resources and never creates a fetch-capable element', async () => {
    await render(
      <Markdown>
        {'Before ![Architecture diagram](https://example.com/diagram.png) after'}
      </Markdown>,
    );

    expect(screen.getByText(/Architecture diagram/)).toBeTruthy();
    expect(document.querySelector('img, video, audio, source, iframe')).toBeNull();
  });

  it.each([
    {
      source: 'x'.repeat(MARKDOWN_SOURCE_LIMIT + 1),
      code: 'MARKDOWN_SOURCE_LIMIT_EXCEEDED',
    },
    {
      source: 'x'.repeat(MARKDOWN_LINE_LIMIT + 1),
      code: 'MARKDOWN_LINE_LIMIT_EXCEEDED',
    },
    {
      source: `${'> '.repeat(MARKDOWN_DEPTH_LIMIT + 1)}too deep`,
      code: 'MARKDOWN_DEPTH_LIMIT_EXCEEDED',
    },
    {
      source: `${'* item\n'.repeat(Math.ceil(MARKDOWN_NODE_LIMIT / 2) + 1)}`,
      code: 'MARKDOWN_NODE_LIMIT_EXCEEDED',
    },
  ])('atomically rejects bounded-parser failure $code', async ({ source, code }) => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await render(<Markdown invalidFallback="Unavailable">{source}</Markdown>);

    expect(screen.getByText('Unavailable')).toBeTruthy();
    expect(screen.queryByText('too deep')).toBeNull();
    expect(warning).toHaveBeenCalledWith(`Tale UI: ${code}`);
    warning.mockRestore();
  });

  it('rejects wrong-type input atomically', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const props = { children: 42 } as unknown as MarkdownProps;
    await render(<Markdown {...props} invalidFallback="No document" />);

    expect(screen.getByText('No document')).toBeTruthy();
    expect(warning).toHaveBeenCalledWith('Tale UI: MARKDOWN_INVALID_SOURCE_TYPE');
    warning.mockRestore();
  });

  it('runtime-strips dangerous HTML and does not disclose the payload', async () => {
    const payload = '<img src=x onerror="globalThis.taleCompromised=true">';
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const props = {
      dangerouslySetInnerHTML: { __html: payload },
    } as unknown as MarkdownProps;

    await render(<Markdown {...props}>Safe text</Markdown>);
    expect(screen.getByText('Safe text')).toBeTruthy();
    expect(document.querySelector('img')).toBeNull();
    expect(warning).toHaveBeenCalledWith('Tale UI: MARKDOWN_DANGEROUS_HTML_OMITTED');
    for (const call of warning.mock.calls) {
      expect(call.join(' ')).not.toContain(payload);
    }
    warning.mockRestore();
  });

  it('preserves deterministic output across SSR and hydration', () => {
    const view = renderToString(
      <Markdown baseUrl="https://docs.example.com/">
        {'## Hydrated\n\nRead [the guide](./guide) and `ship`.'}
      </Markdown>,
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Hydrated' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'the guide' }).getAttribute('href')).toBe(
      'https://docs.example.com/guide',
    );
    const hydrated = view.hydrate();
    expect(screen.getByText('ship').classList.contains('tale-code')).toBe(true);
    hydrated.unmount();
  });

  it('reports parser and filtering exceptions without leaking input', () => {
    const parser = vi.spyOn(Lexer, 'lex').mockImplementationOnce(() => {
      throw new Error('secret parser value');
    });
    expect(parseMarkdown('safe source')).toEqual({
      ok: false,
      code: 'MARKDOWN_PARSER_FAILED',
    });

    const throwingToken = {
      type: 'generic',
      raw: '',
      get tokens() {
        throw new Error('secret filter value');
      },
    } as unknown as Token;
    parser.mockReturnValueOnce([throwingToken] as ReturnType<typeof Lexer.lex>);
    expect(parseMarkdown('safe source')).toEqual({
      ok: false,
      code: 'MARKDOWN_FILTER_FAILED',
    });
    parser.mockRestore();
  });
});
