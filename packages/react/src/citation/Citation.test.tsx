import * as React from 'react';
import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { createRenderer } from '#test-utils';
import {
  Citation,
  type CitationListProps,
  type CitationReferenceProps,
  type CitationRootProps,
  type CitationSource,
} from './index';

describe('Citation', () => {
  const { render, renderToString } = createRenderer();

  const sources = [
    {
      id: 'standard',
      title: 'Platform Standard',
      href: '/standard',
      author: 'A. Author',
      publisher: 'Standards Group',
      publishedAt: '2026-07-27T10:15:30+10:00',
    },
    {
      id: 'guide',
      title: 'Implementation Guide',
      href: 'https://example.org/guide',
    },
  ] as const;

  it('renders semantic parts, shared ordinals, owned targets, accessible names, and refs', async () => {
    const rootRef = React.createRef<HTMLDivElement>();
    const referenceRef = React.createRef<HTMLElement>();
    const listRef = React.createRef<HTMLOListElement>();

    await render(
      <Citation.Root
        ref={rootRef}
        id="research"
        sources={sources}
        baseUrl="https://example.com/docs/"
        className="custom-root"
      >
        First
        <Citation.Reference ref={referenceRef} sourceId="guide" />
        again
        <Citation.Reference sourceId="guide" />
        then
        <Citation.Reference sourceId="standard">source</Citation.Reference>
        <Citation.List ref={listRef} className="custom-list" />
      </Citation.Root>,
    );

    expect(rootRef.current?.tagName).toBe('DIV');
    expect(rootRef.current?.id).toBe('research');
    expect(rootRef.current?.classList.contains('tale-citation')).toBe(true);
    expect(rootRef.current?.classList.contains('custom-root')).toBe(true);
    expect(referenceRef.current?.tagName).toBe('SUP');

    const guideLinks = screen.getAllByRole('link', { name: 'Citation 2: Implementation Guide' });
    expect(guideLinks).toHaveLength(2);
    expect(guideLinks[0]?.getAttribute('href')).toBe('#research-source-2');
    expect(guideLinks[0]?.textContent).toBe('[2]');
    expect(screen.getByRole('link', { name: 'Citation 1: Platform Standard' }).textContent).toBe(
      'source',
    );

    expect(listRef.current?.tagName).toBe('OL');
    expect(listRef.current?.start).toBe(1);
    expect(listRef.current?.type).toBe('1');
    expect(listRef.current?.reversed).toBe(false);
    expect(listRef.current?.classList.contains('custom-list')).toBe(true);
    expect(document.querySelector('#research-source-1')?.textContent).toContain(
      'Platform Standard',
    );
    expect(document.querySelector('#research-source-2')?.textContent).toContain(
      'Implementation Guide',
    );
  });

  it('treats explicit children including null as visible-content replacements', async () => {
    const view = await render(
      <Citation.Root id="explicit" sources={sources}>
        <Citation.Reference sourceId="standard">{null}</Citation.Reference>
      </Citation.Root>,
    );

    let reference = screen.getByRole('link', { name: 'Citation 1: Platform Standard' });
    expect(reference.textContent).toBe('');
    expect(reference.getAttribute('href')).toBe('#explicit-source-1');

    view.unmount();
    await render(
      <Citation.Root id="explicit" sources={sources}>
        <Citation.Reference sourceId="standard">custom</Citation.Reference>
      </Citation.Root>,
    );

    reference = screen.getByRole('link', { name: 'Citation 1: Platform Standard' });
    expect(reference.textContent).toBe('custom');
    expect(reference.getAttribute('href')).toBe('#explicit-source-1');
  });

  it('fails the registry atomically for an invalid required record', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await render(
      <Citation.Root
        id="atomic"
        sources={[
          { id: 'valid', title: 'Valid source' },
          { id: 'invalid id', title: 'Invalid source' },
        ]}
      >
        <Citation.Reference sourceId="valid" />
        <Citation.List emptyFallback={<span>No valid sources</span>} />
      </Citation.Root>,
    );

    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByLabelText('Unavailable citation').textContent).toBe('[?]');
    expect(screen.getByText('No valid sources')).toBeTruthy();
    expect(document.querySelector('#atomic-source-1')).toBeNull();
    expect(warn).toHaveBeenCalledWith('Tale UI: CITATION_INVALID_REGISTRY');
    warn.mockRestore();
  });

  it.each([
    {
      name: 'non-array sources',
      sources: {} as readonly CitationSource[],
    },
    {
      name: 'null entry',
      sources: [null] as unknown as readonly CitationSource[],
    },
    {
      name: 'array entry',
      sources: [['not', 'a', 'record']] as unknown as readonly CitationSource[],
    },
    {
      name: 'whitespace title',
      sources: [{ id: 'source', title: '   ' }],
    },
    {
      name: 'duplicate IDs',
      sources: [
        { id: 'source', title: 'One' },
        { id: 'source', title: 'Two' },
      ],
    },
  ])('fails closed for $name', async ({ sources: invalidSources }) => {
    await render(
      <Citation.Root id="invalid" sources={invalidSources}>
        <Citation.Reference sourceId="source" />
        <Citation.List />
      </Citation.Root>,
    );

    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByLabelText('Unavailable citation')).toBeTruthy();
    expect(document.querySelectorAll('li')).toHaveLength(0);
  });

  it('contains throwing source getters without disclosing values or retaining a partial registry', async () => {
    const secret = 'sensitive-source-value';
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const malicious = {
      get id(): string {
        throw new Error(secret);
      },
      title: 'Never accepted',
    };

    await expect(
      render(
        <Citation.Root
          id="getter-test"
          sources={[{ id: 'valid', title: 'Valid before malicious record' }, malicious]}
        >
          <Citation.Reference sourceId="valid" />
          <Citation.List emptyFallback="Registry rejected" />
        </Citation.Root>,
      ),
    ).resolves.toBeTruthy();

    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText('Registry rejected')).toBeTruthy();
    for (const call of warn.mock.calls) {
      expect(call.join(' ')).not.toContain(secret);
    }
    warn.mockRestore();
  });

  it('resolves only credential-free HTTP(S) URLs under the base URL policy', async () => {
    await render(
      <Citation.Root
        id="urls"
        baseUrl="https://example.com/docs/page"
        sources={[
          { id: 'absolute', title: 'Absolute', href: 'https://standards.example/spec' },
          { id: 'relative', title: 'Relative', href: '../source' },
          { id: 'fragment', title: 'Fragment', href: '#section' },
          { id: 'protocol-relative', title: 'Protocol relative', href: '//cdn.example/source' },
          { id: 'credentials', title: 'Credentials', href: 'https://user:secret@example.com/' },
          { id: 'javascript', title: 'Executable', href: ['java', 'script:alert(1)'].join('') },
          { id: 'whitespace', title: 'Whitespace', href: ' https://example.com/' },
        ]}
      >
        <Citation.List />
      </Citation.Root>,
    );

    expect(screen.getByRole('link', { name: 'Absolute' }).getAttribute('href')).toBe(
      'https://standards.example/spec',
    );
    expect(screen.getByRole('link', { name: 'Relative' }).getAttribute('href')).toBe(
      'https://example.com/source',
    );
    expect(screen.getByRole('link', { name: 'Fragment' }).getAttribute('href')).toBe(
      'https://example.com/docs/page#section',
    );
    expect(screen.getByRole('link', { name: 'Protocol relative' }).getAttribute('href')).toBe(
      'https://cdn.example/source',
    );
    expect(screen.getByText('Credentials').tagName).toBe('SPAN');
    expect(screen.getByText('Executable').tagName).toBe('SPAN');
    expect(screen.getByText('Whitespace').tagName).toBe('SPAN');
  });

  it('requires a valid base for relative, fragment, and protocol-relative URLs', async () => {
    await render(
      <Citation.Root
        id="invalid-base"
        baseUrl="https://user:secret@example.com/"
        sources={[
          { id: 'relative', title: 'Relative', href: '/source' },
          { id: 'fragment', title: 'Fragment', href: '#source' },
          { id: 'protocol-relative', title: 'Protocol relative', href: '//example.org/source' },
          { id: 'absolute', title: 'Absolute', href: 'https://example.org/source' },
        ]}
      >
        <Citation.List />
      </Citation.Root>,
    );

    expect(screen.getByText('Relative').tagName).toBe('SPAN');
    expect(screen.getByText('Fragment').tagName).toBe('SPAN');
    expect(screen.getByText('Protocol relative').tagName).toBe('SPAN');
    expect(screen.getByRole('link', { name: 'Absolute' })).toBeTruthy();
  });

  it('normalizes complete offset timestamps and preserves invalid non-empty text', async () => {
    await render(
      <Citation.Root
        id="dates"
        sources={[
          {
            id: 'offset',
            title: 'Offset timestamp',
            publishedAt: '2026-07-27T10:15:30.250+10:00',
          },
          { id: 'zulu', title: 'Zulu timestamp', publishedAt: '2026-07-27T00:15:30Z' },
          { id: 'missing-offset', title: 'Missing offset', publishedAt: '2026-07-27T10:15:30' },
          { id: 'invalid-day', title: 'Invalid day', publishedAt: '2026-02-30T10:15:30Z' },
          { id: 'empty', title: 'Empty timestamp', publishedAt: '' },
          {
            id: 'wrong-type',
            title: 'Wrong type',
            publishedAt: 123,
          } as unknown as CitationSource,
        ]}
      >
        <Citation.List />
      </Citation.Root>,
    );

    expect(screen.getByText('2026-07-27T10:15:30.250+10:00').getAttribute('datetime')).toBe(
      '2026-07-27T00:15:30.250Z',
    );
    expect(screen.getByText('2026-07-27T00:15:30Z').getAttribute('datetime')).toBe(
      '2026-07-27T00:15:30.000Z',
    );
    expect(screen.getByText('2026-07-27T10:15:30').tagName).toBe('SPAN');
    expect(screen.getByText('2026-02-30T10:15:30Z').tagName).toBe('SPAN');
    expect(document.querySelector('#dates-source-5')?.textContent).toBe('Empty timestamp');
    expect(document.querySelector('#dates-source-6')?.textContent).toBe('Wrong type');
  });

  it('copies accepted records into an internal snapshot', async () => {
    const mutable = { id: 'source', title: 'Original title' };
    const input = [mutable];

    await render(
      <Citation.Root id="immutable" sources={input}>
        <Citation.Reference sourceId="source" />
        <Citation.List />
      </Citation.Root>,
    );

    mutable.title = 'Mutated title';
    input.push({ id: 'later', title: 'Later source' });

    expect(screen.getByRole('link', { name: 'Citation 1: Original title' })).toBeTruthy();
    expect(screen.getByText('Original title')).toBeTruthy();
    expect(screen.queryByText('Mutated title')).toBeNull();
    expect(screen.queryByText('Later source')).toBeNull();
  });

  it('runtime-strips owned numbering, accessible-name overrides, and dangerous HTML', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const payload = '<img src=x onerror="globalThis.compromised=true">';
    const unsafeRootProps = {
      dangerouslySetInnerHTML: { __html: payload },
    } as unknown as CitationRootProps;
    const unsafeReferenceProps = {
      dangerouslySetInnerHTML: { __html: payload },
      'aria-label': 'Consumer override',
    } as unknown as CitationReferenceProps;
    const unsafeListProps = {
      dangerouslySetInnerHTML: { __html: payload },
      reversed: true,
      start: 7,
      type: 'a',
    } as unknown as CitationListProps;

    await render(
      <Citation.Root {...unsafeRootProps} id="owned" sources={sources}>
        <Citation.Reference {...unsafeReferenceProps} sourceId="standard" />
        <Citation.List {...unsafeListProps} />
      </Citation.Root>,
    );

    const reference = screen.getByRole('link', { name: 'Citation 1: Platform Standard' });
    const list = document.querySelector('ol');
    expect(reference.getAttribute('href')).toBe('#owned-source-1');
    expect(screen.queryByLabelText('Consumer override')).toBeNull();
    expect(list?.getAttribute('start')).toBe('1');
    expect(list?.getAttribute('type')).toBe('1');
    expect(list?.hasAttribute('reversed')).toBe(false);
    expect(document.querySelector('img')).toBeNull();
    expect(warn).toHaveBeenCalledWith('Tale UI: CITATION_DANGEROUS_HTML_OMITTED');
    expect(warn).toHaveBeenCalledWith('Tale UI: CITATION_REFERENCE_ACCESSIBLE_NAME_OWNED');
    expect(warn).toHaveBeenCalledWith('Tale UI: CITATION_LIST_NUMBERING_OWNED');
    for (const call of warn.mock.calls) {
      expect(call.join(' ')).not.toContain(payload);
    }
    warn.mockRestore();
  });

  it('renders unknown references without anchors and with an owned unavailable name', async () => {
    await render(
      <Citation.Root id="unknown" sources={sources}>
        <Citation.Reference sourceId="missing" aria-label="Ignored">
          custom missing marker
        </Citation.Reference>
      </Citation.Root>,
    );

    const reference = screen.getByLabelText('Unavailable citation');
    expect(reference.tagName).toBe('SUP');
    expect(reference.textContent).toBe('custom missing marker');
    expect(reference.querySelector('a')).toBeNull();
  });

  it('preserves normalized output across SSR and hydration', () => {
    function Example() {
      return (
        <Citation.Root id="ssr-citations" sources={sources} baseUrl="https://example.com/">
          Claim
          <Citation.Reference sourceId="standard" />
          <Citation.List />
        </Citation.Root>
      );
    }

    const view = renderToString(<Example />);
    expect(screen.getByRole('link', { name: 'Citation 1: Platform Standard' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Platform Standard' }).getAttribute('href')).toBe(
      'https://example.com/standard',
    );

    const hydrated = view.hydrate();
    expect(screen.getByRole('link', { name: 'Citation 1: Platform Standard' })).toBeTruthy();
    expect(document.querySelector('#ssr-citations-source-1')).toBeTruthy();
    hydrated.unmount();
  });
});
