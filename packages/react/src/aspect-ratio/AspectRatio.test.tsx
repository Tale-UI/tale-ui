import * as React from 'react';
import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { createRenderer } from '#test-utils';
import { AspectRatio, type AspectRatioProps } from './index';

function readAspectRatio(value: string) {
  const [inline, block = '1'] = value.split('/');
  return Number(inline) / Number(block);
}

describe('AspectRatio', () => {
  const { render, renderToString } = createRenderer();

  it('normalizes the ratio and applies object fit without cloning its child', async () => {
    await render(
      <AspectRatio ratio="16/9" objectFit="cover" data-testid="ratio">
        <img data-testid="media" src="/landscape.jpg" alt="Landscape" className="consumer-media" />
      </AspectRatio>,
    );

    const root = screen.getByTestId('ratio');
    const media = screen.getByTestId('media');
    expect(root.style.aspectRatio).toBe('16 / 9');
    expect(root.dataset.objectFit).toBe('cover');
    expect(root.classList.contains('tale-aspect-ratio--cover')).toBe(true);
    expect(media.className).toBe('consumer-media');
  });

  it('owns aspectRatio while retaining other consumer styles', async () => {
    await render(
      <AspectRatio
        ratio={4 / 3}
        style={{ aspectRatio: '2 / 1', maxWidth: 640 }}
        data-testid="ratio"
      >
        Media
      </AspectRatio>,
    );

    const root = screen.getByTestId('ratio');
    expect(readAspectRatio(root.style.aspectRatio)).toBeCloseTo(4 / 3, 5);
    expect(root.style.maxWidth).toBe('640px');
  });

  it.each([0, -1, Number.POSITIVE_INFINITY, '16:9', '1 / 0', '1  /  1', '1e2/1'])(
    'falls back to a square for invalid runtime ratio %s',
    async (ratio) => {
      await render(
        <AspectRatio {...({ ratio } as AspectRatioProps)} data-testid="ratio">
          Media
        </AspectRatio>,
      );
      expect(readAspectRatio(screen.getByTestId('ratio').style.aspectRatio)).toBe(1);
    },
  );

  it('omits invalid runtime objectFit values', async () => {
    await render(
      <AspectRatio {...({ objectFit: 'fill' } as unknown as AspectRatioProps)} data-testid="ratio">
        Media
      </AspectRatio>,
    );
    const root = screen.getByTestId('ratio');
    expect(root.getAttribute('data-object-fit')).toBeNull();
    expect(root.className).toBe('tale-aspect-ratio');
  });

  it('runtime-strips raw HTML injection', async () => {
    const injected = { __html: '<img src=x onerror=alert(1)>' };
    await render(
      <AspectRatio
        {...({ dangerouslySetInnerHTML: injected } as unknown as AspectRatioProps)}
        data-testid="ratio"
      >
        Safe content
      </AspectRatio>,
    );

    const root = screen.getByTestId('ratio');
    expect(root.textContent).toBe('Safe content');
    expect(root.querySelector('img')).toBeNull();
  });

  it('preserves normalized output across SSR and hydration', () => {
    const view = renderToString(
      <AspectRatio ratio=".5 / .25" objectFit="contain" data-testid="ratio">
        <video title="Preview">
          <track kind="captions" />
        </video>
      </AspectRatio>,
    );

    expect(screen.getByTestId('ratio').style.aspectRatio).toBe('0.5 / 0.25');
    const hydrated = view.hydrate();
    expect(screen.getByTestId('ratio').dataset.objectFit).toBe('contain');
    expect(screen.getByTestId('ratio').classList.contains('tale-aspect-ratio--contain')).toBe(true);
    hydrated.unmount();
  });
});
