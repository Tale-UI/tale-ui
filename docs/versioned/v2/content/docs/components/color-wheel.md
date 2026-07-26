# ColorWheel

`import { ColorWheel } from '@tale-ui/react/color-wheel';`

A circular hue selector that renders as a color wheel ring.

## Parts

| Part | Description |
|------|-------------|
| `ColorWheel.Root` | The wheel container; requires `outerRadius` and `innerRadius` |
| `ColorWheel.Track` | The circular color track |
| `ColorWheel.Thumb` | Draggable thumb on the wheel |

## Props

Accepts all React Aria `ColorWheel` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
import { ColorWheel, parseColor } from '@tale-ui/react/color-wheel';

<ColorWheel.Root
  defaultValue={parseColor('hsl(0, 100%, 50%)')}
  outerRadius={100}
  innerRadius={70}
>
  <ColorWheel.Track />
  <ColorWheel.Thumb />
</ColorWheel.Root>
```

## CSS Classes

- `.tale-color-wheel` — Root
- `.tale-color-wheel__track` — Circular track
- `.tale-color-wheel__thumb` — Draggable thumb

## Pitfalls

<!-- pitfall: color-wheel-track-required -->
- **`ColorWheel.Track` is required** — Omitting `ColorWheel.Track` inside `ColorWheel.Root` will render a blank element with no visible color ring.
  - anti-pattern: `<ColorWheel.Root outerRadius={100} innerRadius={70}><ColorWheel.Thumb /></ColorWheel.Root>`
  - fix: `<ColorWheel.Root outerRadius={100} innerRadius={70}><ColorWheel.Track /><ColorWheel.Thumb /></ColorWheel.Root>`
  - complete example:
    ```tsx
    import { ColorWheel, parseColor } from '@tale-ui/react/color-wheel';

    export function Example() {
      return (
        <ColorWheel.Root defaultValue={parseColor('hsl(0, 100%, 50%)')} outerRadius={100} innerRadius={70}>
          <ColorWheel.Track />
          <ColorWheel.Thumb />
        </ColorWheel.Root>
      );
    }
    ```

<!-- pitfall: color-wheel-radius-required -->
<!-- multi-idea-ok -->
- **outerRadius and innerRadius are required props** — Both props must be provided on `ColorWheel.Root`. Omitting either will cause incorrect rendering or a runtime error.
  - anti-pattern: `<ColorWheel.Root defaultValue={parseColor('hsl(0, 100%, 50%)')}><ColorWheel.Track /><ColorWheel.Thumb /></ColorWheel.Root>`
  - fix: `<ColorWheel.Root defaultValue={parseColor('hsl(0, 100%, 50%)')} outerRadius={100} innerRadius={70}><ColorWheel.Track /><ColorWheel.Thumb /></ColorWheel.Root>`

<!-- cross-pitfall-ref: color-imports-from-rac -->
<!-- cross-pitfall-ref: no-color-pojo-state -->
<!-- pitfall: defaultvalue-accepts-a-plain-css -->
- **defaultValue accepts a plain CSS color string — you do not need parseColor() for uncontrolled usage** — When a prompt asks to use `defaultValue` with a plain CSS string and without state or parseColor, pass the string literal directly to `defaultValue`; this is valid and requires no additional imports.
  - anti-pattern: `<ColorWheel.Root defaultValue={parseColor('hsl(0, 100%, 50%)')} outerRadius={100} innerRadius={70}>`
  - fix: `<ColorWheel.Root defaultValue="hsl(0, 100%, 50%)" outerRadius={100} innerRadius={70}>`

## Notes

- `outerRadius` and `innerRadius` control the wheel dimensions and ring thickness.
- Use `parseColor()` from `@tale-ui/react/color-wheel` (or `@tale-ui/react/aria`) to create color values.
