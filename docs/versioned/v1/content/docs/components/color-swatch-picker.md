# ColorSwatchPicker

`import { ColorSwatchPicker } from '@tale-ui/react/color-swatch-picker';`

A selectable grid of color swatches for picking from a predefined set of colors.

## Parts

| Part | Description |
|------|-------------|
| `ColorSwatchPicker.Root` | Container that manages selection state |
| `ColorSwatchPicker.Item` | Individual selectable swatch item |

## Props

### Root

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `shape` | `'square' \| 'circle'` | `'square'` | Visual shape applied to every swatch and its selection ring. Cascades via CSS so nested `ColorSwatch` components pick up the shape automatically; individual `ColorSwatch.shape` props override it. |
| `value` / `defaultValue` | `Color` | — | Selected swatch (use `parseColor()` to construct). |
| `onChange` | `(value: Color) => void` | — | Fires when the selection changes. |
| `className` | `string` | — | Additional class names appended to `.tale-color-swatch-picker`. |

Also accepts all other React Aria `ColorSwatchPicker` props.

### Item

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `string \| Color` | — | The colour represented by this item. |
| `className` | `string` | — | Additional class names appended to `.tale-color-swatch-picker__item`. |

## Basic Usage

```tsx
import { ColorSwatchPicker } from '@tale-ui/react/color-swatch-picker';
import { ColorSwatch } from '@tale-ui/react/color-swatch';

<ColorSwatchPicker.Root>
  <ColorSwatchPicker.Item color="#ff0000">
    <ColorSwatch />
  </ColorSwatchPicker.Item>
  <ColorSwatchPicker.Item color="#00ff00">
    <ColorSwatch />
  </ColorSwatchPicker.Item>
  <ColorSwatchPicker.Item color="#0000ff">
    <ColorSwatch />
  </ColorSwatchPicker.Item>
</ColorSwatchPicker.Root>
```

## Circle shape (theme previews)

Pair `shape="circle"` with `ColorSwatch.secondaryColor` to preview themes that combine a brand colour with a neutral. Both colours sit either side of a diagonal split and the swatch — and its selection ring — clip to a circle.

```tsx
const themes = [
  { brand: '#7c3aed', neutral: '#f5f3ff' },
  { brand: '#0ea5e9', neutral: '#f0f9ff' },
  { brand: '#f97316', neutral: '#fff7ed' },
];

<ColorSwatchPicker.Root shape="circle" defaultValue={parseColor('#7c3aed')}>
  {themes.map((t) => (
    <ColorSwatchPicker.Item key={t.brand} color={t.brand}>
      <ColorSwatch secondaryColor={t.neutral} />
    </ColorSwatchPicker.Item>
  ))}
</ColorSwatchPicker.Root>
```

## CSS Classes

- `.tale-color-swatch-picker` — Root container
- `.tale-color-swatch-picker--square` — Explicit square cascade (modifier on root)
- `.tale-color-swatch-picker--circle` — Explicit circle cascade (modifier on root)
- `.tale-color-swatch-picker__item` — Individual swatch item

## Pitfalls

<!-- pitfall: color-swatch-picker-import-swatch-separately -->
- **Import `ColorSwatch` separately from `@tale-ui/react/color-swatch`** — it is not exported from `@tale-ui/react/color-swatch-picker`.
  - anti-pattern: `import { ColorSwatch } from '@tale-ui/react/color-swatch-picker'`
  - fix: `import { ColorSwatch } from '@tale-ui/react/color-swatch'`
  - complete example:
    ```tsx
    import { ColorSwatchPicker } from '@tale-ui/react/color-swatch-picker';
    import { ColorSwatch } from '@tale-ui/react/color-swatch';

    export function Example() {
      return (
        <ColorSwatchPicker.Root>
          <ColorSwatchPicker.Item color="#ff0000"><ColorSwatch /></ColorSwatchPicker.Item>
          <ColorSwatchPicker.Item color="#00ff00"><ColorSwatch /></ColorSwatchPicker.Item>
          <ColorSwatchPicker.Item color="#0000ff"><ColorSwatch /></ColorSwatchPicker.Item>
        </ColorSwatchPicker.Root>
      );
    }
    ```

<!-- pitfall: color-swatch-picker-value-not-selection -->
- **Uses `value`/`onChange`, not `onSelectionChange`** — The controlled API uses `value` and `onChange`. There is no `onSelectionChange` prop.
  - anti-pattern: `<ColorSwatchPicker.Root onSelectionChange={setColor}>`
  - fix: `<ColorSwatchPicker.Root value={color} onChange={setColor}>`

<!-- pitfall: color-swatch-picker-value-not-nullable -->
- **`value` does NOT accept `null` or `undefined`** — `ColorSwatchPicker.Root` requires a non-nullable color value when controlled. Use `defaultValue` for uncontrolled usage without an initial value.
  - anti-pattern: `<ColorSwatchPicker.Root value={null}>`
  - fix: `<ColorSwatchPicker.Root defaultValue="#ff0000">`

<!-- pitfall: color-swatch-picker-no-list-sub-part -->
- **No ColorSwatchPicker.List** — There is no `List` sub-part. Place `ColorSwatchPicker.Item` elements directly inside `ColorSwatchPicker.Root`.
  - anti-pattern: `<ColorSwatchPicker.Root><ColorSwatchPicker.List><ColorSwatchPicker.Item color="#ff0000"><ColorSwatch /></ColorSwatchPicker.Item></ColorSwatchPicker.List></ColorSwatchPicker.Root>`
  - fix: `<ColorSwatchPicker.Root><ColorSwatchPicker.Item color="#ff0000"><ColorSwatch /></ColorSwatchPicker.Item></ColorSwatchPicker.Root>`

<!-- cross-pitfall-ref: color-swatch-string-only -->
<!-- cross-pitfall-ref: color-imports-from-rac -->
<!-- pitfall: valueonchange-use-color-objects-not -->
- **value/onChange use Color objects, not plain strings — initialize state with parseColor()** — `onChange` receives a `Color` object; passing a `Dispatch<SetStateAction<string>>` setter directly causes `Type 'Dispatch<SetStateAction<string>>' is not assignable to type '(value: Color) => void'`. Initialize state with `parseColor()` so the inferred type matches. Import `parseColor` from `@tale-ui/react/color-area`. To display the selected color as a string, call `.toString('css')` on the Color value.
  - anti-pattern: `const [color, setColor] = useState('#3b82f6'); ... <ColorSwatchPicker.Root value={color} onChange={setColor}>`
  - fix: `const [color, setColor] = useState(parseColor('#3b82f6')); ... <ColorSwatchPicker.Root value={color} onChange={setColor}>`
<!-- pitfall: use-colorswatchpickerroot-for-any-prompt -->
- **Use <ColorSwatchPicker.Root> for any prompt that asks for selectable color swatches, a color palette, or a swatch picker** — when the request is to choose from a visible set of color options, render `ColorSwatchPicker.Root` with direct `ColorSwatchPicker.Item` children and a nested `ColorSwatch` for each option instead of leaving the file empty or substituting `ColorSwatch`, `ColorPicker`, or custom buttons.
  - anti-pattern: `// empty file`
  - anti-pattern: `import { ColorSwatch } from '@tale-ui/react/color-swatch'; export function Palette() { return <ColorSwatch color="#3b82f6" />; }`
  - fix: `import { ColorSwatchPicker } from '@tale-ui/react/color-swatch-picker'; import { ColorSwatch } from '@tale-ui/react/color-swatch'; export function Palette() { return <ColorSwatchPicker.Root defaultValue="#3b82f6"><ColorSwatchPicker.Item color="#3b82f6"><ColorSwatch /></ColorSwatchPicker.Item></ColorSwatchPicker.Root>; }`

<!-- pitfall: color-swatch-picker-text-uses-label-and-muted -->
- **Use Tale UI `Text` props for ColorSwatchPicker labels plus selected-color output** — `Text` has no `weight` prop; passing `weight="medium"` causes `Type '{ weight: string; ... }' is not assignable to type 'TextProps'`. Use `variant="label"` for the label, and use `color="muted"` instead of an inline `style={{ color: ... }}` for selected-color display text.
  - anti-pattern: `<Text weight="medium">Color palette</Text>`
  - anti-pattern: `<Text size="s" style={{ color: 'var(--neutral-60)' }}>Selected: {color.toString('css')}</Text>`
  - fix: `<Text variant="label">Color palette</Text>`
  - fix: `<Text size="s" color="muted">Selected: {color.toString('css')}</Text>`

## Notes

- Each `Item` accepts a `color` prop specifying the swatch color.
- Combine with `ColorSwatch` inside each `Item` to render the visual swatch.
- Selection state is managed via `value` / `onChange` (controlled) or `defaultValue` (uncontrolled). The selected swatch receives `data-selected`.
