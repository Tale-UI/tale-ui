import * as React from 'react';
import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { createRenderer } from '#test-utils';
import { Code, type CodeProps } from './index';

describe('Code', () => {
  const { render, renderToString } = createRenderer();
  const untrusted = '<img src=x onerror=alert(1)>';

  it('renders untrusted input as escaped plain text', async () => {
    const { container } = await render(<Code>{untrusted}</Code>);
    expect(screen.getByText(untrusted).textContent).toBe(untrusted);
    expect(container.querySelector('img')).toBeNull();
  });

  it('renders empty content for invalid runtime children', async () => {
    await render(<Code {...({ children: 42 } as unknown as CodeProps)} data-testid="code" />);
    expect(screen.getByTestId('code').textContent).toBe('');
  });

  it('runtime-strips raw HTML injection', async () => {
    await render(
      <Code
        {...({
          children: 'Safe content',
          dangerouslySetInnerHTML: { __html: untrusted },
        } as unknown as CodeProps)}
        data-testid="code"
      />,
    );
    const code = screen.getByTestId('code');
    expect(code.textContent).toBe('Safe content');
    expect(code.querySelector('img')).toBeNull();
  });

  it('forwards its ref and merges consumer attributes', async () => {
    const ref = React.createRef<HTMLElement>();
    await render(
      <Code ref={ref} className="consumer-code" title="Command">
        pnpm test
      </Code>,
    );
    expect(ref.current?.tagName).toBe('CODE');
    expect(ref.current?.className).toBe('tale-code consumer-code');
    expect(ref.current?.title).toBe('Command');
  });

  it('preserves plain text across SSR and hydration', () => {
    const view = renderToString(<Code>{untrusted}</Code>);
    expect(screen.getByText(untrusted).textContent).toBe(untrusted);
    const hydrated = view.hydrate();
    expect(screen.getByText(untrusted).textContent).toBe(untrusted);
    hydrated.unmount();
  });
});
