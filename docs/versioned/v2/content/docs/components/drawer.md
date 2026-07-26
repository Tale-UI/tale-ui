# Drawer

`import { Drawer } from '@tale-ui/react/drawer';`

A slide-in panel with optional backdrop, title, and description.

## Parts

| Part | Description |
|------|-------------|
| `Drawer.Root` | Manages open/close state and transition animations. |
| `Drawer.Trigger` | Button that opens the drawer. Applies `tale-drawer__trigger` (not `tale-button`). |
| `Drawer.Backdrop` | Click-to-close overlay behind the drawer. |
| `Drawer.Popup` | The drawer panel (`role="dialog"`). |
| `Drawer.Title` | Drawer heading. |
| `Drawer.Description` | Drawer description text. |
| `Drawer.Close` | Button that closes the drawer. Applies `tale-drawer__close` (not `tale-button`). |
| `Drawer.Handle` | Drag handle for swipe-to-dismiss interaction. |
| `Drawer.SwipeArea` | Invisible touch target area for swipe gestures. |

## Props

### Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled) |
| `onOpenChange` | `(open: boolean) => void` | — | Callback when the open state changes |

Also accepts all standard `<div>` HTML attributes.

### SwipeArea

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disabled` | `boolean` | — | Disables the swipe gesture area |

Also accepts all standard `<div>` HTML attributes.

## Basic Usage

```tsx
import { Drawer } from '@tale-ui/react/drawer';

<Drawer.Root>
  <Drawer.Trigger className="tale-button tale-button--neutral">Open Drawer</Drawer.Trigger>
  <Drawer.Backdrop />
  <Drawer.Popup>
    <Drawer.Title>Drawer Title</Drawer.Title>
    <Drawer.Description>
      A drawer panel for side or bottom content.
    </Drawer.Description>
    <div style={{ marginTop: 'var(--space-m)', display: 'flex', gap: 'var(--space-xs)' }}>
      <Drawer.Close className="tale-button tale-button--neutral" style={{ flex: 1 }}>Cancel</Drawer.Close>
      <Drawer.Close className="tale-button tale-button--primary" style={{ flex: 1 }}>Confirm</Drawer.Close>
    </div>
  </Drawer.Popup>
</Drawer.Root>
```

> **Note:** `Drawer.Trigger` and `Drawer.Close` do NOT auto-apply `tale-button` — add both base class and variant to style them as buttons.

## Examples

### Without Backdrop

```tsx
<Drawer.Root>
  <Drawer.Trigger className="tale-button tale-button--neutral">Open Drawer</Drawer.Trigger>
  <Drawer.Popup>
    <p>Drawer content goes here.</p>
    <Drawer.Close className="tale-button tale-button--neutral">Close</Drawer.Close>
  </Drawer.Popup>
</Drawer.Root>
```

## CSS Classes

- `.tale-drawer` — Root wrapper
- `.tale-drawer__trigger` — Trigger button (not `tale-button`)
- `.tale-drawer__backdrop` — Backdrop overlay
- `.tale-drawer__popup` — Drawer panel
- `.tale-drawer__title` — Title
- `.tale-drawer__description` — Description
- `.tale-drawer__close` — Close button (not `tale-button`)
- `.tale-drawer__handle` — Optional drag handle element
- `.tale-drawer__swipe-area` — Optional swipe-to-dismiss area

## Pitfalls

<!-- pitfall: drawer-open-not-isopen -->
- **`Drawer.Root` uses `open`/`onOpenChange`, not `isOpen`** — this is the opposite of `Dialog` and `AlertDialog`.
  - anti-pattern: `<Drawer.Root isOpen={open} onOpenChange={setOpen}>`
  - fix: `<Drawer.Root open={open} onOpenChange={setOpen}>`
  - complete example:
    ```tsx
    import { Drawer } from '@tale-ui/react/drawer';

    export function Example() {
      return (
        <Drawer.Root>
          <Drawer.Trigger className="tale-button tale-button--neutral">Open Drawer</Drawer.Trigger>
          <Drawer.Backdrop />
          <Drawer.Popup>
            <Drawer.Title>Drawer Title</Drawer.Title>
            <Drawer.Description>Drawer content here.</Drawer.Description>
            <Drawer.Close className="tale-button tale-button--neutral">Cancel</Drawer.Close>
            <Drawer.Close className="tale-button tale-button--primary">Confirm</Drawer.Close>
          </Drawer.Popup>
        </Drawer.Root>
      );
    }
    ```

<!-- pitfall: drawer-backdrop-sibling -->
- **`Drawer.Backdrop` must be a self-closing sibling of `Drawer.Popup`, not a wrapper** — wrapping Popup inside Backdrop crashes with "Rendered more hooks than during the previous render".
  - anti-pattern: `<Drawer.Backdrop><Drawer.Popup>...</Drawer.Popup></Drawer.Backdrop>`
  - fix: `<Drawer.Backdrop /><Drawer.Popup>...</Drawer.Popup>`

<!-- pitfall: drawer-no-layout-parts -->
- **No layout sub-parts (`Drawer.Actions`, `Drawer.Body`, `Drawer.Header`, `Drawer.Footer`)** — use plain `<div>` elements with flex layout for content sections.
  - anti-pattern: `<Drawer.Footer>...</Drawer.Footer>`
  - fix: `<div style={{ display: 'flex', gap: 'var(--space-xs)' }}>...</div>`

<!-- pitfall: drawer-no-placement-prop -->
<!-- prose-only -->
- **No placement prop on Drawer.Root or Drawer.Popup — use only layout inline styles on Drawer.Popup** — placement is controlled via CSS, but keep `Drawer.Popup` inline styles limited to layout-only properties such as positioning and sizing; move visual styles like `background`, `boxSizing`, `border`, and `boxShadow` to Tale UI defaults, variants, or wrapper CSS.
  - anti-pattern: `<Drawer.Popup style={{ marginLeft: 'auto', background: 'var(--color-background)', boxSizing: 'border-box' }} />`
  - fix: `<Drawer.Popup style={{ marginLeft: 'auto', width: 360, minHeight: '100vh', padding: 'var(--space-m)' }} />`

<!-- cross-pitfall-ref: no-asChild-on-triggers -->
<!-- cross-pitfall-ref: no-button-inside-trigger -->
<!-- pitfall: use-drawer-for-any-prompt -->
- **Use <Drawer> for any prompt that asks for a drawer, side drawer, side sheet, or slide-over panel** — when the request is for an overlay panel that slides in from a screen edge, render `Drawer.Root` with `Drawer.Backdrop`, `Drawer.Popup`, `Drawer.Title`, and a `Drawer.Close` button instead of leaving the file empty or substituting `Dialog`. Use CSS on `Drawer.Popup` to position it on the right or left because `Drawer` has no placement prop.
  - anti-pattern: `// empty file`
  - anti-pattern: `import { Dialog } from '@tale-ui/react/dialog'; export function SettingsDrawer() { return <Dialog.Root />; }`
  - fix: `import * as React from 'react'; import { Drawer } from '@tale-ui/react/drawer'; export function SettingsDrawer() { const [open, setOpen] = React.useState(true); return <Drawer.Root open={open} onOpenChange={setOpen}><Drawer.Backdrop /><Drawer.Popup style={{ marginLeft: 'auto' }}><Drawer.Title>Settings</Drawer.Title><Drawer.Close className="tale-button tale-button--neutral tale-button--md">Close</Drawer.Close></Drawer.Popup></Drawer.Root>; }`

## Notes

- **Trigger and Close need explicit `tale-button` classes.** `Drawer.Trigger` applies `tale-drawer__trigger` and `Drawer.Close` applies `tale-drawer__close` — neither includes `tale-button`. Add `className="tale-button tale-button--{variant}"` for button styling.
- `Drawer.Root` supports controlled (`open` / `onOpenChange`) and uncontrolled (`defaultOpen`) modes.
- The Popup and Backdrop use transition status data attributes (`data-entering`, `data-exiting`) for CSS animations.
- Clicking the `Backdrop` closes the drawer automatically.
- Unlike Dialog, this is a custom implementation (not built on React Aria's Modal).
