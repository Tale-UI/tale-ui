# ColorSwatch

`import { ColorSwatch } from '@tale-ui/react/color-swatch';`

A simple color preview element that displays a single color value. Supports square or circle shapes and an optional second colour split diagonally.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `string` | — | CSS colour string (e.g. `"#ff0000"`, `"rgb(255 0 0)"`). |
| `shape` | `'square' \| 'circle'` | `'square'` | Visual shape of the swatch. Overrides the cascaded shape from a parent `ColorSwatchPicker.Root`. |
| `secondaryColor` | `string` | — | Optional second CSS colour. When provided, the swatch is split diagonally — `color` fills the top-left half, `secondaryColor` fills the bottom-right half. |
| `className` | `string` | — | Additional class names appended to `.tale-color-swatch`. |
| `style` | `CSSProperties` | — | Inline style merged with React Aria's background style. |

Also accepts all other React Aria `ColorSwatch` props.

## Basic Usage

```tsx
import { ColorSwatch } from '@tale-ui/react/color-swatch';

<ColorSwatch color="#ff0000" />
<ColorSwatch color="#ff0000" shape="circle" />
```

## Diagonal split (theme preview)

Use `secondaryColor` to represent a paired colour theme — for example a brand colour plus its neutral. The two colours sit either side of a top-right → bottom-left diagonal and the swatch clips to its current `shape`.

```tsx
<ColorSwatch color="#7c3aed" secondaryColor="#f5f3ff" />
<ColorSwatch color="#7c3aed" secondaryColor="#f5f3ff" shape="circle" />
```

## CSS Classes

- `.tale-color-swatch` — Base element
- `.tale-color-swatch--square` — Explicit square shape (overrides cascade)
- `.tale-color-swatch--circle` — Explicit circle shape (overrides cascade)
- `.tale-color-swatch--split` — Two-colour diagonal split. Reads `--tale-color-swatch-secondary` for the second colour.

## CSS Custom Properties

- `--tale-color-swatch-radius` — Border radius read by `.tale-color-swatch`. Set on a parent (e.g. by `ColorSwatchPicker.Root shape="circle"`) to cascade a radius down. Defaults to `var(--space-4xs)`.
- `--tale-color-swatch-secondary` — Secondary colour read by `.tale-color-swatch--split`. Set automatically when the React `secondaryColor` prop is used.

## Pitfalls

<!-- pitfall: color-swatch-prop-is-string -->
- **`color` prop accepts a plain CSS string, not a `Color` object** — pass a CSS color string directly (e.g. `color="#ff0000"`); do not use `parseColor()` or pass a `Color` object, and the prop is `color`, not `value`.
  - anti-pattern: `<ColorSwatch color={parseColor('#ff0000')} />`
  - fix: `<ColorSwatch color="#ff0000" />`
  - complete example:

    ```tsx
    import { ColorSwatch } from '@tale-ui/react/color-swatch';
    export function MyComponent() {
      return <ColorSwatch color="#ff0000" />;
    }
    ```
<!-- pitfall: color-swatch-no-size-prop -->
- **No `size` prop** — `ColorSwatch` does not accept a `size` prop. Use CSS to control dimensions.
  - anti-pattern: `<ColorSwatch color="#ff0000" size="lg" />`
  - fix: `<ColorSwatch color="#ff0000" style={{ width: '32px', height: '32px' }} />`

<!-- pitfall: color-swatch-secondary-color-is-string -->
- **`secondaryColor` accepts a plain CSS string** — like `color`, it is a CSS colour string, not a `Color` object.
  - anti-pattern: `<ColorSwatch color="#ff0000" secondaryColor={parseColor('#fff')} />`
  - fix: `<ColorSwatch color="#ff0000" secondaryColor="#ffffff" />`

<!-- cross-pitfall-ref: color-swatch-string-only -->

## Notes

- This is a simple (non-compound) component exported directly as `ColorSwatch`.
- When nested inside `<ColorSwatchPicker.Root shape="circle">`, swatches inherit the circle shape automatically. Set `shape` on a swatch only to override the picker's cascade.
