import * as React from 'react';
import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { vi } from 'vitest';
import { createRenderer } from '#test-utils';
import { ButtonGroup } from './index';
import type { ButtonGroupProps } from './index';

function asRuntimeProps(props: Record<string, unknown>): ButtonGroupProps {
  return props as unknown as ButtonGroupProps;
}

function assertButtonGroupTypes() {
  <ButtonGroup aria-label="Actions">Actions</ButtonGroup>;
  <ButtonGroup aria-labelledby="actions-heading">Actions</ButtonGroup>;
  <ButtonGroup role="presentation">Actions</ButtonGroup>;

  // @ts-expect-error group and region roles require exactly one accessible-name mechanism
  <ButtonGroup>Actions</ButtonGroup>;
  // @ts-expect-error aria-label and aria-labelledby are mutually exclusive
  <ButtonGroup aria-label="Actions" aria-labelledby="actions-heading">
    Actions
  </ButtonGroup>;
  // @ts-expect-error presentational groups cannot have an accessible name
  <ButtonGroup role="presentation" aria-label="Actions">
    Actions
  </ButtonGroup>;
  // @ts-expect-error render-function children are intentionally unsupported
  <ButtonGroup aria-label="Actions">{() => 'Actions'}</ButtonGroup>;
  // @ts-expect-error render-function class names are intentionally unsupported
  <ButtonGroup aria-label="Actions" className={() => 'custom'}>
    Actions
  </ButtonGroup>;
  // @ts-expect-error render-function styles are intentionally unsupported
  <ButtonGroup aria-label="Actions" style={() => ({ color: 'red' })}>
    Actions
  </ButtonGroup>;
  // @ts-expect-error raw HTML injection is intentionally unsupported
  <ButtonGroup aria-label="Actions" dangerouslySetInnerHTML={{ __html: 'Actions' }} />;
  // @ts-expect-error ButtonGroup does not provide selection semantics
  <ButtonGroup aria-label="Actions" selectionMode="single">
    Actions
  </ButtonGroup>;
}
void assertButtonGroupTypes;

describe('<ButtonGroup />', () => {
  const { render, renderToString } = createRenderer();

  it('renders the default horizontal, detached group with an aria-label', async () => {
    await render(
      <ButtonGroup aria-label="Document actions" data-testid="group">
        <button type="button">Save</button>
      </ButtonGroup>,
    );
    const group = screen.getByTestId('group');

    expect(group.getAttribute('role')).toBe('group');
    expect(group.getAttribute('aria-label')).toBe('Document actions');
    expect(group.getAttribute('data-orientation')).toBe('horizontal');
    expect(group.classList.contains('tale-button-group')).toBe(true);
    expect(group.classList.contains('tale-button-group--horizontal')).toBe(true);
    expect(group.classList.contains('tale-button-group--attached')).toBe(false);
  });

  it('supports region, aria-labelledby, vertical, attached, class, and style props', async () => {
    await render(
      <React.Fragment>
        <h2 id="actions-heading">Document actions</h2>
        <ButtonGroup
          role="region"
          aria-labelledby="actions-heading"
          orientation="vertical"
          isAttached
          className="custom-group"
          style={{ marginBlockStart: 4 }}
          data-testid="group"
        >
          <button type="button">Save</button>
        </ButtonGroup>
      </React.Fragment>,
    );
    const group = screen.getByTestId('group');

    expect(group.getAttribute('role')).toBe('region');
    expect(group.getAttribute('aria-labelledby')).toBe('actions-heading');
    expect(group.getAttribute('aria-label')).toBeNull();
    expect(group.classList.contains('tale-button-group--vertical')).toBe(true);
    expect(group.classList.contains('tale-button-group--attached')).toBe(true);
    expect(group.classList.contains('custom-group')).toBe(true);
    expect(group.style.marginBlockStart).toBe('4px');
  });

  it('allows an explicitly presentational group without a name', async () => {
    await render(
      <ButtonGroup role="presentation" data-testid="group">
        Actions
      </ButtonGroup>,
    );
    const group = screen.getByTestId('group');

    expect(group.getAttribute('role')).toBe('presentation');
    expect(group.getAttribute('aria-label')).toBeNull();
    expect(group.getAttribute('aria-labelledby')).toBeNull();
  });

  it.each([
    ['a missing name', {}],
    ['both name mechanisms', { 'aria-label': 'Actions', 'aria-labelledby': 'heading' }],
    ['a whitespace aria-label', { 'aria-label': '   ' }],
    ['a non-string aria-label', { 'aria-label': 42 }],
    ['a whitespace aria-labelledby', { 'aria-labelledby': '\t' }],
    ['a name on presentation', { role: 'presentation', 'aria-label': 'Actions' }],
    ['an invalid role', { role: 'toolbar', 'aria-label': 'Actions' }],
  ])('fails closed to an unnamed presentation role for %s', async (_description, values) => {
    await render(
      <ButtonGroup {...asRuntimeProps(values)} data-testid="group">
        Actions
      </ButtonGroup>,
    );
    const group = screen.getByTestId('group');

    expect(group.getAttribute('role')).toBe('presentation');
    expect(group.getAttribute('aria-label')).toBeNull();
    expect(group.getAttribute('aria-labelledby')).toBeNull();
  });

  it('normalizes invalid orientation and isAttached values', async () => {
    await render(
      <ButtonGroup
        {...asRuntimeProps({
          'aria-label': 'Actions',
          orientation: 'diagonal',
          isAttached: 'yes',
        })}
        data-testid="group"
      >
        Actions
      </ButtonGroup>,
    );
    const group = screen.getByTestId('group');

    expect(group.getAttribute('data-orientation')).toBe('horizontal');
    expect(group.classList.contains('tale-button-group--horizontal')).toBe(true);
    expect(group.classList.contains('tale-button-group--attached')).toBe(false);
  });

  it('blocks function children, className, and style without invoking them', async () => {
    const children = vi.fn(() => <span>Unsafe child</span>);
    const className = vi.fn(() => 'unsafe-class');
    const style = vi.fn(() => ({ color: 'red' }));

    await render(
      <ButtonGroup
        {...asRuntimeProps({
          'aria-label': 'Actions',
          children,
          className,
          style,
          'data-testid': 'group',
        })}
      />,
    );
    const group = screen.getByTestId('group');

    expect(children).not.toHaveBeenCalled();
    expect(className).not.toHaveBeenCalled();
    expect(style).not.toHaveBeenCalled();
    expect(group.textContent).toBe('');
    expect(group.classList.contains('unsafe-class')).toBe(false);
    expect(group.getAttribute('style')).toBeNull();
  });

  it('blocks dangerouslySetInnerHTML without replacing static children', async () => {
    await render(
      <ButtonGroup
        {...asRuntimeProps({
          'aria-label': 'Actions',
          dangerouslySetInnerHTML: { __html: '<img src=x alt="unsafe">' },
          children: 'Safe actions',
          'data-testid': 'group',
        })}
      />,
    );
    const group = screen.getByTestId('group');

    expect(group.textContent).toBe('Safe actions');
    expect(group.querySelector('img')).toBeNull();
  });

  it('preserves React Aria slot, disabled, invalid, and readonly state', async () => {
    await render(
      <ButtonGroup
        aria-label="Actions"
        slot="actions"
        isDisabled
        isInvalid
        isReadOnly
        data-testid="group"
      >
        <button type="button">Save</button>
      </ButtonGroup>,
    );
    const group = screen.getByTestId('group');

    expect(group.getAttribute('slot')).toBe('actions');
    expect(group.hasAttribute('data-disabled')).toBe(true);
    expect(group.hasAttribute('data-invalid')).toBe(true);
    expect(group.hasAttribute('data-readonly')).toBe(true);
  });

  it('preserves React Aria hover and focus-within state', async () => {
    const { user } = await render(
      <ButtonGroup aria-label="Actions" data-testid="group">
        <button type="button">Save</button>
      </ButtonGroup>,
    );
    const group = screen.getByTestId('group');

    await user.hover(group);
    expect(group.hasAttribute('data-hovered')).toBe(true);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
    expect(group.hasAttribute('data-focus-within')).toBe(true);
  });

  it('forwards its HTMLDivElement ref', async () => {
    const ref = React.createRef<HTMLDivElement>();
    await render(
      <ButtonGroup aria-label="Actions" ref={ref}>
        Actions
      </ButtonGroup>,
    );

    expect(ref.current?.tagName).toBe('DIV');
  });

  it('keeps owned semantics and content stable across SSR and hydration', () => {
    const view = renderToString(
      <ButtonGroup aria-label="Document actions" orientation="vertical" isAttached>
        <button type="button">Save</button>
      </ButtonGroup>,
    );
    const group = screen.getByRole('group', { name: 'Document actions' });

    expect(group.getAttribute('data-orientation')).toBe('vertical');
    expect(group.classList.contains('tale-button-group--attached')).toBe(true);
    expect(screen.getByRole('button', { name: 'Save' })).toBeDefined();

    const hydrated = view.hydrate();
    expect(screen.getByRole('group', { name: 'Document actions' })).toBe(group);
    expect(screen.getByRole('button', { name: 'Save' })).toBeDefined();
    hydrated.unmount();
  });
});
