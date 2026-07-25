import * as React from 'react';
import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { createRenderer } from '#test-utils';
import { CodeBlock } from './index';

describe('CodeBlock', () => {
  const { render, renderToString } = createRenderer();
  const untrusted = '<img src=x onerror=alert(1)>';

  it('renders untrusted input as plain text', async () => {
    const { container } = await render(<CodeBlock language="html">{untrusted}</CodeBlock>);
    expect(screen.getByText(untrusted).textContent).toBe(untrusted);
    expect(container.querySelector('img')).toBeNull();
  });

  it('preserves plain text across SSR and hydration', () => {
    const view = renderToString(<CodeBlock>{untrusted}</CodeBlock>);
    expect(screen.getByText(untrusted).textContent).toBe(untrusted);
    const hydrated = view.hydrate();
    expect(screen.getByText(untrusted).textContent).toBe(untrusted);
    hydrated.unmount();
  });
});
