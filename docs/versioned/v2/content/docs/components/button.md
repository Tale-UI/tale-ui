# Button

`import { Button } from '@tale-ui/react/button';`

A styled button component with variant and size props, built on React Aria's Button.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'neutral' \| 'ghost' \| 'danger' \| 'danger-neutral' \| 'danger-ghost' \| 'inverse'` | `'primary'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `disabled` | `boolean` | — | Alias for `isDisabled` for convenience |
| `isPending` | `boolean` | — | Shows a loading spinner and prevents interaction while remaining focusable |
| `pending` | `boolean` | — | Alias for `isPending` for convenience |
| `showTextWhileLoading` | `boolean` | — | When true, keeps children visible alongside the spinner during pending state |

Also accepts all React Aria `Button` props.

## Basic Usage

```tsx
<Button variant="primary" size="md">
  Button
</Button>
```

## Examples

### All Variants

```tsx
<Button variant="primary">Primary</Button>
<Button variant="neutral">Neutral</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button variant="danger-neutral">Danger Neutral</Button>
<Button variant="danger-ghost">Danger Ghost</Button>
<Button variant="inverse">Inverse</Button>
```

### All Sizes

```tsx
<Button variant="primary" size="sm">Small</Button>
<Button variant="primary" size="md">Medium</Button>
<Button variant="primary" size="lg">Large</Button>
```

### Disabled

```tsx
<Button variant="primary" isDisabled>Primary</Button>
<Button variant="neutral" isDisabled>Neutral</Button>
```

### With Icon

```tsx
<Button variant="primary">
  <PlusIcon />
  Add Item
</Button>
```

### Pending / Loading

```tsx
<Button variant="primary" isPending>Saving…</Button>
<Button variant="neutral" pending>Loading</Button>
```

When pending, the button shows a Spinner overlay while hiding its content (preserving width). The button remains focusable but does not respond to press or hover events. React Aria announces the pending state to screen readers automatically.

### Pending with Visible Text

```tsx
<Button variant="primary" isPending showTextWhileLoading>Saving…</Button>
```

When `showTextWhileLoading` is true, the spinner renders inline alongside the children instead of replacing them.

## CSS Classes

- `.tale-button` -- Base
- `.tale-button--primary` -- Primary variant
- `.tale-button--neutral` -- Neutral variant
- `.tale-button--ghost` -- Ghost variant
- `.tale-button--danger` -- Danger variant (filled)
- `.tale-button--danger-neutral` -- Danger neutral variant (outlined destructive)
- `.tale-button--danger-ghost` -- Danger ghost variant (transparent destructive)
- `.tale-button--inverse` -- Inverse variant
- `.tale-button--sm` -- Small size
- `.tale-button--md` -- Medium size (default)
- `.tale-button--lg` -- Large size
- `.tale-button__content` -- Inner wrapper for button children (uses `display: contents`)
- `.tale-button__content--with-spinner` -- Applied to content when `showTextWhileLoading` is true during pending
- `.tale-button__spinner` -- Absolutely-positioned spinner overlay shown during pending state
- `.tale-button__spinner--inline` -- Inline spinner shown when `showTextWhileLoading` is true

## When to use each size

| Size | Use when |
|------|----------|
| `sm` | Inside compact containers — banners, toolbars, table rows, inline alongside form fields, secondary actions in tight layouts. |
| `md` | Default for most situations — form submissions, dialog actions, card footers, standalone CTAs in application UI. |
| `lg` | Prominent standalone actions — hero sections, marketing CTAs, empty-state primary actions where the button needs to command more visual weight. |

All buttons on a given surface should share the same size. Mixing `sm` and `md` in the same action group creates visual inconsistency; the only exception is an icon-only `IconButton` paired with a labelled `Button` in a toolbar, where size parity is already enforced by the toolbar height.

## Pitfalls

<!-- pitfall: button-no-link-variant -->
- **No 'link' or 'secondary' variant — for Cancel or secondary-action buttons always use `variant="neutral"`** — The valid variants are `'primary'`, `'neutral'`, `'ghost'`, `'danger'`, `'danger-neutral'`, `'danger-ghost'`, and `'inverse'`. There is no `'link'` variant (use the `Link` component instead) and no `'secondary'` variant; when a prompt asks for a Cancel button or any secondary-action button, use `'neutral'` — never `'secondary'`.
  - anti-pattern: `<Button variant="link">Go back</Button>`
  - anti-pattern: `<Button variant="secondary">Cancel</Button>`
  - fix: `<Button variant="neutral">Go back</Button>`
  - fix: `<Button variant="neutral">Cancel</Button>`
  - anti-pattern: `<Button variant="link">Go back</Button>`
  - fix: `<Button variant="neutral">Go back</Button>`
  - complete example:
    ```tsx
    import { Button } from '@tale-ui/react/button';

    export function Example() {
      return (
        <>
          <Button variant="primary" size="md">Click me</Button>
          <Button variant="neutral">Neutral</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="danger-neutral">Outlined danger</Button>
          <Button variant="danger-ghost">Ghost danger</Button>
          <Button variant="inverse">Inverse</Button>
          <Button variant="primary" isPending>Saving…</Button>
          <Button variant="primary" isPending showTextWhileLoading>Saving…</Button>
        </>
      );
    }
    ```

<!-- pitfall: button-no-xs-size -->
- **`size` accepts `'sm'`, `'md'`, `'lg'` only — no `'xs'`** — There is no `'xs'` size. The smallest available size is `'sm'`.
  - anti-pattern: `<Button size="xs">Save</Button>`
  - fix: `<Button size="sm">Save</Button>`

<!-- pitfall: button-no-asChild -->
<!-- prose-only -->
- **No `asChild` prop** — `Button` does not support `asChild`. To render a button as a link, use the `Link` component or wrap with a router link adapter.

<!-- pitfall: button-no-icon-prop -->
- **No `icon`, `leftIcon`, `rightIcon`, or `startIcon` prop** — Place an `<Icon>` component (or any icon) directly as a child of `Button`. Position before or after the label text as needed.
  - anti-pattern: `<Button leftIcon={<PlusIcon />}>Add</Button>`
  - fix: `<Button><PlusIcon />Add</Button>`
<!-- pitfall: button-no-href-prop -->
- **`Button` has no `href` prop — it renders a `<button>`, not a link** — passing `href` causes a TypeScript assignability error. For navigational links styled as buttons, use `Link` from `@tale-ui/react/link` with BEM class names.
  - anti-pattern: `<Button variant="primary" size="md" href="/signup">Sign up</Button>`
  - fix: `<Link href="/signup" className="tale-button tale-button--primary tale-button--md">Sign up</Link>`

## Notes

- `variant` defaults to `"primary"`, `size` defaults to `"md"`.
- Both `isDisabled` and `disabled` props are supported (aliases).
- Icons can be placed before or after the label text as inline children.
- Both `isPending` and `pending` props are supported (aliases). When pending, press and hover events are suppressed but the button remains focusable for accessibility.
