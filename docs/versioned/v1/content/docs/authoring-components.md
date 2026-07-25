# Authoring Components

Step-by-step guide for adding new components to `@tale-ui/react`.

---

## File Structure

Each component lives in its own directory:

```
packages/react/src/{component-name}/
├── {Component}.styled.tsx       # Styled wrapper (applies BEM, wraps React Aria)
├── {Component}.test.tsx         # Unit tests (Vitest + Testing Library)
├── {Component}.spec.tsx         # Browser tests (optional)
├── index.ts                     # Public API re-export
└── index.parts.ts               # Granular part exports (optional, for multi-part components)
```

---

## Creating a Simple Component

A simple component wraps a single React Aria element. Example: Button.

**`packages/react/src/my-button/MyButton.styled.tsx`:**

```tsx
import * as React from 'react';
import { Button as AriaButton } from 'react-aria-components';
import type { ButtonProps as AriaButtonProps } from 'react-aria-components';
import { cx } from '../_cx';

type Variant = 'primary' | 'neutral' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface MyButtonProps extends Omit<AriaButtonProps, 'className'> {
  variant?: Variant | undefined;
  size?: Size | undefined;
  /** Alias for `isDisabled` for convenience. */
  disabled?: boolean | undefined;
  className?: string | undefined;
}

export const MyButton = React.forwardRef<HTMLButtonElement, MyButtonProps>(
  ({ variant = 'primary', size = 'md', className, disabled, isDisabled, ...props }, ref) => (
    <AriaButton
      ref={ref}
      isDisabled={disabled ?? isDisabled}
      className={cx(`tale-my-button tale-my-button--${variant} tale-my-button--${size}`, className)}
      {...props}
    />
  ),
);
MyButton.displayName = 'MyButton';
```

**Key patterns:**

1. `Omit<AriaProps, 'className'>` — replace React Aria's className (which can be a function) with a simple string
2. `cx(base, className)` — merges the BEM base with any consumer-provided className
3. `React.forwardRef` — always forward refs for composability
4. `displayName` — set for DevTools debugging
5. Default values for variant/size — consumers get sensible defaults

**`packages/react/src/my-button/index.ts`:**

```ts
export { MyButton } from './MyButton.styled';
export type { MyButtonProps } from './MyButton.styled';
```

---

## Creating a Composite Component

A composite component has multiple parts (Root, Trigger, Popup, Item, etc.). Each part is a separate `forwardRef` component. Example: Select.

**`packages/react/src/my-select/MySelect.styled.tsx`:**

```tsx
import * as React from 'react';
import {
  Select as AriaSelect,
  Button as AriaButton,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  Popover as AriaPopover,
  Label as AriaLabel,
  type SelectProps as AriaSelectProps,
  type ButtonProps as AriaButtonProps,
  type ListBoxProps as AriaListBoxProps,
  type ListBoxItemProps as AriaListBoxItemProps,
  type PopoverProps as AriaPopoverProps,
  type LabelProps as AriaLabelProps,
} from 'react-aria-components';
import { cx } from '../_cx';

/* ─── Root ─────────────────────────────────────────────────────────────────── */

export type RootProps<T extends object = {}> = Omit<AriaSelectProps<T>, 'className'> & {
  className?: string;
};

export const Root: <T extends object = {}>(
  props: RootProps<T> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null = React.forwardRef(
  ({ className, ...props }: RootProps, ref) => (
    <AriaSelect ref={ref as React.Ref<HTMLDivElement>} className={cx('tale-my-select', className)} {...props} />
  ),
) as any;
(Root as any).displayName = 'MySelect.Root';

/* ─── Trigger ──────────────────────────────────────────────────────────────── */

export type TriggerProps = Omit<AriaButtonProps, 'className'> & { className?: string };

export const Trigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  ({ className, ...props }, ref) => (
    <AriaButton ref={ref} className={cx('tale-my-select__trigger', className)} {...props} />
  ),
);
Trigger.displayName = 'MySelect.Trigger';

/* ─── Popover ──────────────────────────────────────────────────────────────── */

export type PopoverProps = Omit<AriaPopoverProps, 'className'> & { className?: string };

export const Popover = React.forwardRef<HTMLElement, PopoverProps>(
  ({ className, ...props }, ref) => (
    <AriaPopover ref={ref} className={cx('tale-my-select__popover', className)} {...props} />
  ),
);
Popover.displayName = 'MySelect.Popover';

/* ─── Item ─────────────────────────────────────────────────────────────────── */

export type ItemProps<T = object> = Omit<AriaListBoxItemProps<T>, 'className'> & { className?: string };

export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, ...props }, ref) => (
    <AriaListBoxItem ref={ref} className={cx('tale-my-select__item', className)} {...props} />
  ),
);
Item.displayName = 'MySelect.Item';

// ... additional parts (Label, ListBox, etc.) follow the same pattern
```

**`packages/react/src/my-select/index.ts`:**

```ts
export * as MySelect from './MySelect.styled';

export type {
  RootProps as MySelectRootProps,
  TriggerProps as MySelectTriggerProps,
  PopoverProps as MySelectPopoverProps,
  ItemProps as MySelectItemProps,
} from './MySelect.styled';
```

**Key patterns:**

- Namespace export (`export * as MySelect`) — consumers use `<MySelect.Root>`, `<MySelect.Trigger>`, etc.
- Each part gets its own BEM element class (`__trigger`, `__popover`, `__item`)
- Generic type parameters (`<T extends object>`) are preserved for typed collections
- `displayName` uses the namespace prefix (`MySelect.Root`)

---

## The `cx()` Helper

Located at `packages/react/src/_cx.ts`, `cx()` merges a BEM base class with an optional consumer className:

```ts
cx('tale-button tale-button--primary', 'my-custom')
// → 'tale-button tale-button--primary my-custom'

cx('tale-button tale-button--primary', undefined)
// → 'tale-button tale-button--primary'
```

It also supports function-based classNames (used by React Aria's render props):

```ts
cx('tale-button', (state) => state.isHovered ? 'hovered' : '')
// → function that returns 'tale-button hovered' or 'tale-button'
```

**Always use `cx()`** — never concatenate class names manually.

---

## Variant & Size Props

Map variant/size props to BEM modifiers via template literals:

```tsx
className={cx(`tale-button tale-button--${variant} tale-button--${size}`, className)}
```

**Conventions:**

- Default variant: `'primary'` (or the most common variant)
- Default size: `'md'`
- Size scale: `'sm'`, `'md'`, `'lg'`
- Props are always optional with defaults

For components that don't need size variants, omit the size prop and BEM modifier.

---

## Adding Component CSS

Create `packages/styles/src/{component}.css` with a header comment documenting the component:

```css
/*
 * MyComponent — @tale-ui/react
 *
 * Styled with @tale-ui/core design tokens.
 * React Aria exposes: [data-disabled] [data-pressed] [data-hovered] [data-focus-visible]
 *
 * Variants:   .tale-my-component--primary  (default)
 *             .tale-my-component--neutral  (secondary)
 *
 * Sizes:      .tale-my-component--sm / --md (default) / --lg
 */

/* ─── Base ─────────────────────────────────────────────────────────────────── */

.tale-my-component {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3xs);
  border-radius: var(--radius-m);
  font-family: var(--label-font-family);
  font-size: var(--label-m-font-size);
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

/* ─── Variants ─────────────────────────────────────────────────────────────── */

.tale-my-component--primary {
  background-color: var(--color-60);
  color: var(--color-60-fg);
}

.tale-my-component--primary:hover:not([data-disabled]) {
  background-color: var(--color-50);
}

.tale-my-component--neutral {
  background-color: var(--neutral-14);
  color: var(--neutral-90);
  border: 1px solid var(--neutral-22);
}

/* ─── States ───────────────────────────────────────────────────────────────── */

.tale-my-component[data-disabled] {
  opacity: 0.45;
  pointer-events: none;
  cursor: not-allowed;
}

.tale-my-component:focus-visible {
  box-shadow: 0 0 0 2px var(--neutral-100), 0 0 0 4px var(--color-60);
}
```

### Critical CSS rules

1. **Always use `--color-*` and `--neutral-*` tokens** — NEVER `--brand-*` in component CSS. `--brand-*` does not invert in dark mode.
2. **Use `--color-*-fg` / `--neutral-*-fg`** for text on coloured backgrounds — these provide automatic contrast.
3. **Components using `--color-*` and `--neutral-*` get dark mode for free** — no separate dark mode CSS needed.
4. **Use design tokens for all values** — spacing (`--space-*`), typography (`--label-*-font-size`), effects (`--radius-*`, `--shadow-*`).
5. **Style states via data attributes** — `[data-disabled]`, `[data-focus-visible]`, `[data-hovered]`, etc.

### Check `_primitives.css` first

`packages/styles/src/_primitives.css` holds grouped selectors for declarations identical across multiple components:

1. **Field controls** — shared border, padding, font for `.tale-input`, `.tale-select__trigger`, `.tale-combobox__input`, etc.
2. **Dropdown popups** — shared background, border-radius, shadow, animation
3. **Dropdown items** — shared layout, hover, disabled states
4. **Group labels** — shared styling for section headers
5. **Button sizes** — shared size modifiers

If your component shares styling with an existing group (e.g. it's a new field-like input), **add its selector to the relevant group** in `_primitives.css` instead of duplicating the declarations.

### Wire up the CSS

1. Add `@import './{component}.css'` to `packages/styles/src/index.css` in the appropriate category section
2. Add the per-component export to `packages/styles/package.json`:
   ```json
   "./{component}": "./src/{component}.css"
   ```

---

## Index Files

### Simple components (direct export)

```ts
// index.ts
export { MyButton } from './MyButton.styled';
export type { MyButtonProps } from './MyButton.styled';
```

Consumers use: `import { MyButton } from '@tale-ui/react/my-button'`

### Multi-part components (namespace export)

```ts
// index.ts
export * as MySelect from './MySelect.styled';
export type { RootProps as MySelectRootProps, ... } from './MySelect.styled';
```

Consumers use: `import { MySelect } from '@tale-ui/react/my-select'` → `<MySelect.Root>`, `<MySelect.Trigger>`, etc.

### Granular part exports (optional)

For consumers who want to import individual parts:

```ts
// index.parts.ts
export { Root, Trigger, Popover, Item } from './MySelect.styled';
```

---

## Package Configuration

### `packages/react/package.json`

Add the component to the `exports` field:

```json
{
  "exports": {
    "./my-component": "./src/my-component/index.ts"
  }
}
```

### `packages/styles/package.json`

Add the per-component CSS export:

```json
{
  "exports": {
    "./my-component": "./src/my-component.css"
  }
}
```

---

## Testing Conventions

Tests use **Vitest + Testing Library** with jsdom. Located at `{Component}.test.tsx`.

### What to test

1. **BEM class application** — verify base class, variant modifiers, and size modifiers
2. **className merging** — verify consumer's `className` is merged with BEM classes
3. **Data attributes** — verify `data-disabled`, `data-selected`, etc. are set correctly
4. **Ref forwarding** — verify refs are forwarded to the DOM element
5. **Event handlers** — verify `onPress`, `onChange`, etc. work (and don't fire when disabled)

### Test boilerplate

```tsx
import { expect } from 'chai';
import { spy } from 'sinon';
import { MyComponent } from '@tale-ui/react/my-component';
import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { createRenderer } from '#test-utils';

describe('<MyComponent />', () => {
  const { render } = createRenderer();

  it('renders with default BEM classes', async () => {
    await render(<MyComponent>Label</MyComponent>);
    const el = screen.getByRole('button');
    expect(el).to.have.class('tale-my-component');
    expect(el).to.have.class('tale-my-component--primary');
    expect(el).to.have.class('tale-my-component--md');
  });

  it('applies variant and size BEM modifiers', async () => {
    await render(<MyComponent variant="neutral" size="sm">Label</MyComponent>);
    const el = screen.getByRole('button');
    expect(el).to.have.class('tale-my-component--neutral');
    expect(el).to.have.class('tale-my-component--sm');
  });

  it('merges additional className', async () => {
    await render(<MyComponent className="custom">Label</MyComponent>);
    const el = screen.getByRole('button');
    expect(el).to.have.class('tale-my-component');
    expect(el).to.have.class('custom');
  });

  it('sets data-disabled when isDisabled', async () => {
    await render(<MyComponent isDisabled>Label</MyComponent>);
    const el = screen.getByRole('button', { hidden: true });
    expect(el).to.have.attribute('data-disabled');
  });

  it('does not fire onPress when disabled', async () => {
    const handlePress = spy();
    const { user } = await render(<MyComponent isDisabled onPress={handlePress}>Label</MyComponent>);
    await user.click(screen.getByRole('button', { hidden: true }));
    expect(handlePress.callCount).to.equal(0);
  });
});
```

---

## Checklist

When adding a new component, complete every step:

1. [ ] Create `packages/react/src/{component}/` directory
2. [ ] Create `{Component}.styled.tsx` — wrap React Aria component, apply BEM via `cx()`, forwardRef, displayName
3. [ ] Create `index.ts` — re-export (direct for simple, namespace for multi-part)
4. [ ] Create `{Component}.test.tsx` — BEM classes, className merging, data attributes, ref, events
5. [ ] Create `packages/styles/src/{component}.css` — use `--color-*`/`--neutral-*` tokens (NEVER `--brand-*`), style states via data attributes
6. [ ] Check `packages/styles/src/_primitives.css` — add to existing groups if applicable. **If the component uses `<AriaHeading>`,** add its `__heading` selector to the heading reset group (group 15) so global `h1`–`h6` styles cannot leak in.
7. [ ] Add `@import './{component}.css'` to `packages/styles/src/index.css`
8. [ ] Add `"./{component}": "./src/{component}.css"` to `packages/styles/package.json` exports
9. [ ] Add `"./{component}": "./src/{component}/index.ts"` to `packages/react/package.json` exports
10. [ ] Create `docs/components/{component}.md` — usage guide with imports, sub-parts, props, and examples (see existing docs for format)
11. [ ] Add the component name to the list in `docs/consumer-claude-md-snippet.md`
12. [ ] Add the component name to the list in `packages/react/README.md` (Component Catalogue and per-component docs sections)
13. [ ] Run `pnpm test:jsdom` — verify tests pass
14. [ ] Run `pnpm typescript` — verify types compile
15. [ ] Run `pnpm build` — verify build succeeds
16. [ ] Update the component's row in the **Component Artifact Audit** section of `CLAUDE.md`
17. [ ] Run `pnpm audit:components -- --component={component}` — verify all checks pass
18. [ ] Run `pnpm registry:generate` — regenerate `registry/components.json`
19. [ ] **If the component should be available in A2UI:** register it in `packages/a2ui/src/catalog.ts` (add adapter), `tools/a2ui-catalog-metadata.js` (add description/props), then run `pnpm a2ui:generate-docs && pnpm a2ui:generate-catalog && pnpm a2ui:audit-docs`
