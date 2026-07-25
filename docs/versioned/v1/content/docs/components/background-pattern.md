# BackgroundPattern

`import { BackgroundPattern } from '@tale-ui/react/background-pattern';`

Decorative SVG background pattern rendered at fixed sizes with a radial-gradient fade mask. Color is controlled via the CSS `color` property — defaults to `--neutral-20` but can be overridden with any token or arbitrary value.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| pattern | `'circle' \| 'square' \| 'grid' \| 'grid-check'` | required | The SVG pattern to render |
| size | `'sm' \| 'md' \| 'lg'` | `'lg'` | Canvas size. `grid-check` supports `sm` and `md` only |
| className | `string` | -- | Additional classes on the root SVG element |

Also accepts all standard SVG element attributes (`aria-*`, `style`, `data-*`, etc.).

## Basic Usage

```tsx
import { BackgroundPattern } from '@tale-ui/react/background-pattern';

<BackgroundPattern pattern="circle" size="lg" />
```

## Examples

### All patterns

```tsx
<BackgroundPattern pattern="circle" />
<BackgroundPattern pattern="square" />
<BackgroundPattern pattern="grid" />
<BackgroundPattern pattern="grid-check" size="md" />
```

### Sizes

```tsx
<BackgroundPattern pattern="grid" size="sm" />
<BackgroundPattern pattern="grid" size="md" />
<BackgroundPattern pattern="grid" size="lg" />
```

### Custom color

```tsx
{/* Brand color */}
<BackgroundPattern pattern="circle" style={{ color: 'var(--color-30)' }} />

{/* Arbitrary color */}
<BackgroundPattern pattern="square" style={{ color: '#e0e0e0' }} />
```

### As an absolute background

```tsx
<div className="relative overflow-hidden">
  <BackgroundPattern
    pattern="grid"
    size="lg"
    className="absolute inset-0 w-full h-full"
  />
  <div className="relative z-10">Content on top</div>
</div>
```

## CSS Classes

- `.tale-background-pattern` — Root element. Sets `color: var(--neutral-20)`, `pointer-events: none`, and `flex-shrink: 0`

## Pitfalls

<!-- pitfall: background-pattern-grid-check-lg -->
- **`grid-check` does not support `size="lg"`** — only `sm` and `md` are available for the `grid-check` pattern. Passing `size="lg"` will render nothing.
  - anti-pattern: `<BackgroundPattern pattern="grid-check" size="lg" />`
  - fix: `<BackgroundPattern pattern="grid-check" size="md" />`

<!-- pitfall: background-pattern-color-via-css -->
- **Control color with CSS `color`, not with fill/stroke props** — all strokes use `currentColor`. Use the `style` or `className` prop to override `color`.
  - anti-pattern: `<BackgroundPattern fill="var(--neutral-30)" />`
  - fix: `<BackgroundPattern style={{ color: 'var(--neutral-30)' }} />`
<!-- pitfall: background-pattern-valid-pattern-values -->
- **pattern prop uses singular form — 'circle' not 'circles'** — The Pattern type uses singular nouns. Passing a pluralized value like 'circles' causes Type '"circles"' is not assignable to type 'Pattern'. Use the singular form 'circle' instead.
  - anti-pattern: `<BackgroundPattern pattern="circles" size="lg" />`
  - fix: `<BackgroundPattern pattern="circle" size="lg" />`
  - complete example:
    ```tsx
    import { BackgroundPattern } from '@tale-ui/react/background-pattern';

    export function DecorativeCircularPattern() {
      return (
        <BackgroundPattern pattern="circle" size="lg" />
      );
    }
    ```

## Notes

- Custom component — not built on a React Aria primitive.
- `pointer-events: none` by default — the pattern never intercepts clicks.
- The radial-gradient fade mask is baked into each SVG via a `<mask>` element.
