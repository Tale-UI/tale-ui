import * as React from 'react';
import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { createRenderer } from '#test-utils';
import { AppShell } from './index';

describe('AppShell', () => {
  const { render, renderToString } = createRenderer();

  function Example() {
    return (
      <AppShell.Root data-testid="shell">
        <AppShell.SkipLink />
        <AppShell.Header>Header</AppShell.Header>
        <AppShell.Sidebar>Sidebar</AppShell.Sidebar>
        <AppShell.Main>Main</AppShell.Main>
        <AppShell.MobileNavigation>Mobile</AppShell.MobileNavigation>
      </AppShell.Root>
    );
  }

  it('provides deterministic structural slots and a keyboard bypass target', async () => {
    await render(<Example />);
    expect(screen.getByRole('link', { name: 'Skip to main content' }).getAttribute('href')).toBe(
      '#main-content',
    );
    expect(screen.getByRole('main').getAttribute('id')).toBe('main-content');
    expect(screen.getByRole('main').getAttribute('tabindex')).toBe('-1');
  });

  it('does not own routing, persistence, or responsive application state', async () => {
    await render(<Example />);
    const shell = screen.getByTestId('shell');
    expect(shell.hasAttribute('data-open')).toBe(false);
    expect(shell.hasAttribute('data-route')).toBe(false);
    expect(shell.hasAttribute('data-persisted')).toBe(false);
  });

  it('preserves its landmark target across SSR and hydration', () => {
    const view = renderToString(<Example />);
    expect(screen.getByRole('main').getAttribute('id')).toBe('main-content');
    const hydrated = view.hydrate();
    expect(screen.getByRole('main').getAttribute('id')).toBe('main-content');
    hydrated.unmount();
  });
});
