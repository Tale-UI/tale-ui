# ColorSlider

`import { ColorSlider } from '@tale-ui/react/color-slider';`

A slider for adjusting a single color channel (hue, saturation, lightness, alpha, etc.).

## Parts

| Part | Description |
|------|-------------|
| `ColorSlider.Root` | Wrapper; requires a `channel` prop |
| `ColorSlider.Track` | The gradient track |
| `ColorSlider.Thumb` | Draggable thumb |
| `ColorSlider.Label` | Accessible label |
| `ColorSlider.Output` | Displays the current channel value |

## Props

Accepts all React Aria `ColorSlider` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
import { ColorSlider, parseColor } from '@tale-ui/react/color-slider';

<ColorSlider.Root channel="hue" defaultValue={parseColor('hsl(0, 100%, 50%)')}>
  <ColorSlider.Label>Hue</ColorSlider.Label>
  <ColorSlider.Output />
  <ColorSlider.Track>
    <ColorSlider.Thumb />
  </ColorSlider.Track>
</ColorSlider.Root>
```

## Examples

### Saturation Slider

```tsx
<ColorSlider.Root channel="saturation" defaultValue={parseColor('hsl(0, 100%, 50%)')}>
  <ColorSlider.Label>Saturation</ColorSlider.Label>
  <ColorSlider.Output />
  <ColorSlider.Track>
    <ColorSlider.Thumb />
  </ColorSlider.Track>
</ColorSlider.Root>
```

### Inside ColorPicker.Root

Nest `ColorSlider.Root` inside `ColorPicker.Root` when it should share the picker's color value with other color controls:

```tsx
import { ColorPicker } from '@tale-ui/react/color-picker';
import { ColorArea } from '@tale-ui/react/color-area';
import { ColorSlider } from '@tale-ui/react/color-slider';

<ColorPicker.Root defaultValue="hsb(200, 100%, 100%)">
  <ColorArea.Root xChannel="saturation" yChannel="brightness">
    <ColorArea.Thumb />
  </ColorArea.Root>

  <ColorSlider.Root channel="hue">
    <ColorSlider.Label>Hue</ColorSlider.Label>
    <ColorSlider.Output />
    <ColorSlider.Track>
      <ColorSlider.Thumb />
    </ColorSlider.Track>
  </ColorSlider.Root>
</ColorPicker.Root>
```

## CSS Classes

- `.tale-color-slider` — Root
- `.tale-color-slider__track` — Gradient track
- `.tale-color-slider__thumb` — Draggable thumb
- `.tale-color-slider__label` — Label
- `.tale-color-slider__output` — Value output

## Pitfalls

<!-- pitfall: color-slider-composition-with-color-area -->
<!-- prose-only -->
- **When composing with ColorArea, wrap both in a single parent element — use spacing-token gap values, never component-size names** — Use <Column> or a <div> as a shared parent to provide layout. Do not rely on adjacent sibling rendering without a container. When using <Column>, use spacing-token gap values ('s', 'm', 'l'), never component-size values ('sm', 'md', 'lg') — all three component-size names are invalid Gap values and cause TypeScript errors. Map: sm->s, md->m, lg->l. This is the most common error when composing ColorArea with ColorSlider. Even when the prompt says to use a specific gap size, always translate to spacing tokens. CRITICAL: gap="lg" is a frequent error in ColorArea+ColorSlider compositions — it MUST be gap="l".
  - anti-pattern: `<Column gap="sm"><ColorArea.Root ... /><ColorSlider.Root ... /></Column>`
  - anti-pattern: `<Column gap="md"><ColorArea.Root ... /><ColorSlider.Root ... /></Column>`
  - anti-pattern: `<Column gap="lg"><ColorArea.Root ... /><ColorSlider.Root ... /></Column>`
  - fix: `<Column gap="s"><ColorArea.Root ... /><ColorSlider.Root ... /></Column>`
  - fix: `<Column gap="m"><ColorArea.Root ... /><ColorSlider.Root ... /></Column>`
  - fix: `<Column gap="l"><ColorArea.Root ... /><ColorSlider.Root ... /></Column>`
  - complete example:
    ```tsx
    import { ColorArea } from '@tale-ui/react/color-area';
    import { ColorSlider } from '@tale-ui/react/color-slider';
    import { Column } from '@tale-ui/react/column';

    export function HslColorPicker() {
      return (
        <Column gap="l" style={{ width: 240 }}>
          <ColorArea.Root defaultValue="hsl(0, 100%, 50%)" xChannel="saturation" yChannel="lightness">
            <ColorArea.Thumb />
          </ColorArea.Root>

          <ColorSlider.Root channel="hue" defaultValue="hsl(0, 100%, 50%)">
            <ColorSlider.Label>Hue</ColorSlider.Label>
            <ColorSlider.Output />
            <ColorSlider.Track>
              <ColorSlider.Thumb />
            </ColorSlider.Track>
          </ColorSlider.Root>
        </Column>
      );
    }
    ```

## Notes

- The `channel` prop on Root is required and determines which color channel the slider controls (e.g. `"hue"`, `"saturation"`, `"lightness"`, `"alpha"`).
- Use `parseColor()` from `@tale-ui/react/color-slider` (or `@tale-ui/react/aria`) to create color values.
