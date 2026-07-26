import * as React from 'react';
import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { createRenderer } from '#test-utils';
import {
  Blockquote,
  type BlockquoteAttributionProps,
  type BlockquoteContentProps,
  type BlockquoteRootProps,
} from './index';

describe('Blockquote', () => {
  const { render, renderToString } = createRenderer();

  function Example() {
    return (
      <Blockquote.Root cite="https://example.com/interview">
        <Blockquote.Content>Design is how it works.</Blockquote.Content>
        <Blockquote.Attribution>Steve Jobs</Blockquote.Attribution>
      </Blockquote.Root>
    );
  }

  it('renders the semantic parts, cite, classes, and forwarded refs', async () => {
    const rootRef = React.createRef<HTMLQuoteElement>();
    const contentRef = React.createRef<HTMLParagraphElement>();
    const attributionRef = React.createRef<HTMLElement>();

    await render(
      <Blockquote.Root ref={rootRef} cite="https://example.com/source" className="quote">
        <Blockquote.Content ref={contentRef} className="quote-content">
          A considered observation.
        </Blockquote.Content>
        <Blockquote.Attribution ref={attributionRef} className="quote-attribution">
          A careful observer
        </Blockquote.Attribution>
      </Blockquote.Root>,
    );

    expect(rootRef.current?.tagName).toBe('BLOCKQUOTE');
    expect(rootRef.current?.getAttribute('cite')).toBe('https://example.com/source');
    expect(rootRef.current?.classList.contains('tale-blockquote')).toBe(true);
    expect(rootRef.current?.classList.contains('quote')).toBe(true);
    expect(contentRef.current?.tagName).toBe('P');
    expect(contentRef.current?.classList.contains('tale-blockquote__content')).toBe(true);
    expect(attributionRef.current?.tagName).toBe('FOOTER');
    expect(attributionRef.current?.classList.contains('tale-blockquote__attribution')).toBe(true);
  });

  it.each([
    'notes/source',
    'mailto:author@example.com',
    ['java', 'script:alert(1)'].join(''),
    'https://user:secret@example.com/source',
    ' https://example.com/source',
    'https://example.com/source\n',
  ])('omits an invalid cite without disclosing its value: %s', async (cite) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await render(
      <Blockquote.Root cite={cite}>
        <Blockquote.Content>Safe content</Blockquote.Content>
      </Blockquote.Root>,
    );

    expect(screen.getByText('Safe content').closest('blockquote')?.hasAttribute('cite')).toBe(
      false,
    );
    if (cite === 'notes/source') {
      expect(warn).toHaveBeenCalledWith('Tale UI: BLOCKQUOTE_INVALID_CITE_OMITTED');
    }
    for (const call of warn.mock.calls) {
      expect(call.join(' ')).not.toContain(cite);
    }
    warn.mockRestore();
  });

  it('runtime-strips dangerous HTML from every part with a value-free diagnostic', () => {
    const payload = '<img src=x onerror="globalThis.compromised=true">';
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const unsafeRootProps = {
      dangerouslySetInnerHTML: { __html: payload },
    } as unknown as BlockquoteRootProps;
    const unsafeContentProps = {
      dangerouslySetInnerHTML: { __html: payload },
    } as unknown as BlockquoteContentProps;
    const unsafeAttributionProps = {
      dangerouslySetInnerHTML: { __html: payload },
    } as unknown as BlockquoteAttributionProps;

    const view = renderToString(
      <Blockquote.Root {...unsafeRootProps}>
        <Blockquote.Content {...unsafeContentProps}>Escaped content</Blockquote.Content>
        <Blockquote.Attribution {...unsafeAttributionProps}>Safe source</Blockquote.Attribution>
      </Blockquote.Root>,
    );

    expect(screen.getByText('Escaped content')).toBeTruthy();
    expect(screen.getByText('Safe source')).toBeTruthy();
    expect(document.querySelector('img')).toBeNull();
    expect(warn).toHaveBeenCalledWith('Tale UI: BLOCKQUOTE_DANGEROUS_HTML_OMITTED');
    for (const call of warn.mock.calls) {
      expect(call.join(' ')).not.toContain(payload);
    }

    const hydrated = view.hydrate();
    expect(document.querySelector('img')).toBeNull();
    expect(screen.getByText('Escaped content')).toBeTruthy();
    hydrated.unmount();
    warn.mockRestore();
  });

  it('preserves semantic content and cite across SSR and hydration', () => {
    const view = renderToString(<Example />);
    const quote = screen.getByText('Design is how it works.').closest('blockquote');

    expect(quote?.getAttribute('cite')).toBe('https://example.com/interview');
    expect(screen.getByText('Steve Jobs').tagName).toBe('FOOTER');

    const hydrated = view.hydrate();
    expect(screen.getByText('Design is how it works.').closest('blockquote')).toBeTruthy();
    expect(screen.getByText('Steve Jobs').tagName).toBe('FOOTER');
    hydrated.unmount();
  });
});
