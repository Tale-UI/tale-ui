import * as React from 'react';
import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { createRenderer } from '#test-utils';
import { Skeleton } from './index';
import type { SkeletonProps } from './index';

function asRuntimeProps(props: Record<string, unknown>): SkeletonProps {
  return props as unknown as SkeletonProps;
}

function assertSkeletonTypes() {
  <Skeleton />;
  <Skeleton variant="circular" width={32} height={32} animation="none" />;

  // @ts-expect-error Skeleton is always an empty element
  <Skeleton>Loading</Skeleton>;
  ({
    // @ts-expect-error Skeleton owns its hidden semantics
    'aria-hidden': false,
  }) satisfies SkeletonProps;
  ({
    // @ts-expect-error Skeleton cannot be given an accessible name
    'aria-label': 'Loading',
  }) satisfies SkeletonProps;
  ({
    // @ts-expect-error Skeleton cannot reference an accessible name
    'aria-labelledby': 'loading-heading',
  }) satisfies SkeletonProps;
  ({
    // @ts-expect-error Skeleton cannot reference a description
    'aria-describedby': 'loading-description',
  }) satisfies SkeletonProps;
  // @ts-expect-error Skeleton cannot own a role
  <Skeleton role="status" />;
  // @ts-expect-error Skeleton cannot enter the tab sequence
  <Skeleton tabIndex={0} />;
  // @ts-expect-error Skeleton cannot become editable
  <Skeleton contentEditable />;
  // @ts-expect-error raw HTML injection is intentionally unsupported
  <Skeleton dangerouslySetInnerHTML={{ __html: 'Loading' }} />;
}
void assertSkeletonTypes;

describe('<Skeleton />', () => {
  const { render, renderToString } = createRenderer();

  it('renders an empty, decorative text placeholder with pulse animation by default', async () => {
    await render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');

    expect(skeleton.tagName).toBe('SPAN');
    expect(skeleton.childNodes).toHaveLength(0);
    expect(skeleton.getAttribute('aria-hidden')).toBe('true');
    expect(skeleton.classList.contains('tale-skeleton')).toBe(true);
    expect(skeleton.classList.contains('tale-skeleton--text')).toBe(true);
    expect(skeleton.classList.contains('tale-skeleton--pulse')).toBe(true);
  });

  it.each(['text', 'rectangular', 'circular'] as const)(
    'applies the %s variant',
    async (variant) => {
      await render(<Skeleton variant={variant} data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton').classList.contains(`tale-skeleton--${variant}`)).toBe(
        true,
      );
    },
  );

  it('normalizes invalid variants and animation values to defaults', async () => {
    await render(
      <Skeleton
        {...asRuntimeProps({ variant: 'pill', animation: 'wave' })}
        data-testid="skeleton"
      />,
    );
    const skeleton = screen.getByTestId('skeleton');

    expect(skeleton.classList.contains('tale-skeleton--text')).toBe(true);
    expect(skeleton.classList.contains('tale-skeleton--pulse')).toBe(true);
  });

  it('supports disabling animation', async () => {
    await render(<Skeleton animation="none" data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton.classList.contains('tale-skeleton--pulse')).toBe(false);
    expect(skeleton.classList.contains('tale-skeleton--none')).toBe(true);
  });

  it('applies finite numeric and string dimensions after matching style fields', async () => {
    await render(
      <Skeleton
        width={48}
        height="2rem"
        style={{ width: 12, height: 12, marginBlockStart: 4 }}
        data-testid="skeleton"
      />,
    );
    const skeleton = screen.getByTestId('skeleton');

    expect(skeleton.style.width).toBe('48px');
    expect(skeleton.style.height).toBe('2rem');
    expect(skeleton.style.marginBlockStart).toBe('4px');
  });

  it('omits non-finite numeric dimensions, including matching style fields', async () => {
    await render(
      <Skeleton
        {...asRuntimeProps({
          width: Number.NaN,
          height: Number.POSITIVE_INFINITY,
          style: { width: '10rem', height: '2rem', opacity: 0.5 },
        })}
        data-testid="skeleton"
      />,
    );
    const skeleton = screen.getByTestId('skeleton');

    expect(skeleton.style.width).toBe('');
    expect(skeleton.style.height).toBe('');
    expect(skeleton.style.opacity).toBe('0.5');
  });

  it('preserves style dimensions when dimension props are omitted', async () => {
    await render(<Skeleton style={{ width: '10rem', height: '2rem' }} data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');

    expect(skeleton.style.width).toBe('10rem');
    expect(skeleton.style.height).toBe('2rem');
  });

  it('blocks owned DOM props, raw HTML, and children at runtime', async () => {
    await render(
      <Skeleton
        {...asRuntimeProps({
          children: 'Loading',
          'aria-hidden': false,
          'aria-label': 'Loading',
          'aria-labelledby': 'loading-heading',
          'aria-describedby': 'loading-description',
          role: 'status',
          tabIndex: 0,
          contentEditable: true,
          dangerouslySetInnerHTML: { __html: '<img src=x alt="unsafe">' },
        })}
        data-testid="skeleton"
      />,
    );
    const skeleton = screen.getByTestId('skeleton');

    expect(skeleton.childNodes).toHaveLength(0);
    expect(skeleton.getAttribute('aria-hidden')).toBe('true');
    expect(skeleton.getAttribute('aria-label')).toBeNull();
    expect(skeleton.getAttribute('aria-labelledby')).toBeNull();
    expect(skeleton.getAttribute('aria-describedby')).toBeNull();
    expect(skeleton.getAttribute('role')).toBeNull();
    expect(skeleton.getAttribute('tabindex')).toBeNull();
    expect(skeleton.getAttribute('contenteditable')).toBeNull();
    expect(skeleton.querySelector('img')).toBeNull();
  });

  it('merges valid classes, blocks invalid runtime classes and styles, and forwards its ref', async () => {
    const ref = React.createRef<HTMLSpanElement>();
    const view = await render(
      <Skeleton ref={ref} className="custom-skeleton" data-testid="skeleton" />,
    );

    expect(screen.getByTestId('skeleton').classList.contains('custom-skeleton')).toBe(true);
    expect(ref.current?.tagName).toBe('SPAN');
    view.unmount();

    await render(
      <Skeleton
        {...asRuntimeProps({ className: () => 'unsafe', style: () => ({ color: 'red' }) })}
        data-testid="skeleton"
      />,
    );
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton.classList.contains('unsafe')).toBe(false);
    expect(skeleton.getAttribute('style')).toBeNull();
  });

  it('keeps its empty hidden placeholder stable across SSR and hydration', () => {
    const view = renderToString(
      <Skeleton variant="circular" width={32} height={32} data-testid="skeleton" />,
    );
    const skeleton = screen.getByTestId('skeleton');

    expect(skeleton.childNodes).toHaveLength(0);
    expect(skeleton.getAttribute('aria-hidden')).toBe('true');
    expect(skeleton.classList.contains('tale-skeleton--circular')).toBe(true);
    expect(skeleton.style.width).toBe('32px');

    const hydrated = view.hydrate();
    expect(screen.getByTestId('skeleton')).toBe(skeleton);
    expect(screen.getByTestId('skeleton').childNodes).toHaveLength(0);
    hydrated.unmount();
  });
});
