# Container

`import { Container } from '@tale-ui/react/container';`

A wrapper that overrides `--color-*` design tokens for its descendants, allowing sections of the page to use a different colour palette without affecting the rest of the app.

## Basic Usage

```tsx
<Container color="indigo">
  {/* All children will use indigo --color-* tokens */}
  <Button variant="primary">Indigo Button</Button>
</Container>
```

## Examples

### Named Colour

```tsx
<Container color="red">
  <p style={{ color: 'var(--color-60)' }}>This text is red-60.</p>
</Container>
```

### Random Colour

Generates a random palette once per page load — changes on hard refresh:

```tsx
<Container color="random">
  <p style={{ color: 'var(--color-60)' }}>Random colour.</p>
</Container>
```

### Brand (default)

Uses the root brand tokens (no override):

```tsx
<Container color="brand">
  <p>Same as not using Container at all.</p>
</Container>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `ContainerColor` | `'brand'` | Colour palette to apply. One of: `brand`, `random`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose` |

Inherits all standard `<div>` HTML attributes (`className`, `style`, etc.).

## CSS Classes

None — Container renders a plain `<div>` with inline `--color-*` custom properties. Style it with your own `className` or `style` prop.

## Notes

- Built on a plain `<div>` — no React Aria dependency.
- `color="brand"` returns no inline styles (uses the root tokens as-is).
- `color="random"` computes a palette once on page load and reuses it for the session. A hard refresh generates a new random colour.
- The override applies to all `--color-*` shades (5 through 100), so any component using `--color-*` tokens inside the Container will adopt the new palette.
- `--brand-*` tokens are NOT affected — only `--color-*` tokens change.

## Pitfalls
