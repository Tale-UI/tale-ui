# ColorModeToggle

`import { ColorModeToggle } from '@tale-ui/react/color-mode-toggle';`

A sun/moon toggle that switches between light and dark colour modes. Persists the choice to `localStorage` and sets `data-color-mode` on `<html>`. Built on React Aria's Switch for full keyboard and screen reader accessibility.

## Basic Usage

```tsx
<ColorModeToggle />
```

That's it — the component handles everything: reading stored preference, falling back to OS preference, updating `<html>`, and persisting to `localStorage`.

## Parts

This is a simple (non-namespace) component — no sub-parts.

| Part | Description |
|------|-------------|
| `ColorModeToggle` | The toggle element (wraps React Aria Switch) |

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultMode` | `'light' \| 'dark'` | OS preference | Initial mode when no `localStorage` value exists |
| `storageKey` | `string` | `'color-mode'` | `localStorage` key for persisting the colour mode |
| `className` | `string` | — | Additional CSS classes |
| `isDisabled` | `boolean` | `false` | Disables the toggle |

Inherits all React Aria Switch props except `isSelected` and `onChange` (managed internally).

## Custom Default Mode

```tsx
// Always start in dark mode on first visit
<ColorModeToggle defaultMode="dark" />

// Always start in light mode on first visit
<ColorModeToggle defaultMode="light" />
```

If `defaultMode` is not set, the component follows the user's OS preference via `prefers-color-scheme`.

## Custom Storage Key

```tsx
// Use a different localStorage key (useful if multiple apps share the same origin)
<ColorModeToggle storageKey="my-app-color-mode" />
```

## Positioning

The component does not include positioning styles. Place it where you need it:

```tsx
// Fixed top-right corner
<ColorModeToggle style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 1000 }} />

// Inside a header
<header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <h1>My App</h1>
  <ColorModeToggle />
</header>
```

## CSS Classes

| Class | Description |
|-------|-------------|
| `.tale-color-mode-toggle` | Base — sun icon (light mode) |

## Data Attributes

| Attribute | When |
|-----------|------|
| `data-selected` | Dark mode is active (moon icon) |
| `data-disabled` | Toggle is disabled |
| `data-focus-visible` | Keyboard focus visible |
| `data-hovered` | Pointer hovering |

## How It Works

The toggle uses pure CSS `box-shadow` to render a sun (with rays) in light mode and a crescent moon in dark mode — no SVG icons needed.

- **Light mode (default):** Multiple box-shadows create sun rays radiating from a central circle
- **Dark mode (`[data-selected]`):** A single inset box-shadow creates a crescent moon shape
- **Transition:** All properties animate over 0.5s for a smooth sun↔moon morph

## Important Rules

- The toggle always sets `data-color-mode` to either `"dark"` or `"light"` — it never removes the attribute
- The inline `<script>` in `<head>` (from the setup guide) prevents a flash of wrong theme on page load
- The component reads `localStorage` on mount, so the toggle always reflects the persisted state

## Pitfalls

<!-- pitfall: color-mode-toggle-no-props-needed -->
- **`ColorModeToggle` needs no props — it is self-managing** — the component reads `localStorage` and `data-color-mode` internally; passing `isSelected`/`onChange` silently does nothing.
  - anti-pattern: `<ColorModeToggle isSelected={isDark} onChange={setIsDark} />`
  - fix: `<ColorModeToggle />`
  - complete example:

    ```tsx
    import { ColorModeToggle } from '@tale-ui/react/color-mode-toggle';
    export function Example() {
      return <ColorModeToggle />;
    }
    ```

## Notes

- Built on React Aria's `Switch` component for full accessibility (keyboard, ARIA, focus management)
- The hidden `<input>` inside the Switch is managed by React Aria — do not style it directly
- Uses `--neutral-70` for the icon colour, which auto-inverts in dark mode
