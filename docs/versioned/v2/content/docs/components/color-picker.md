# ColorPicker

`import { ColorPicker } from '@tale-ui/react/color-picker';`

A wrapper component that provides shared color state to child color components (ColorArea, ColorSlider, ColorField, etc.).

## Shared Picker Context

Use `ColorPicker.Root` as the shared state provider for nested color controls. Child `ColorArea`, `ColorSlider`, `ColorField`, and related color components read and update the same picker value:

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

Standalone `ColorArea` and `ColorSlider` components with shared `value`/`onChange` state remain supported when the controls live outside the same picker provider.

## Props

Accepts all React Aria `ColorPicker` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## CSS Classes

None — `ColorPicker.Root` is a state-only wrapper with no DOM element or BEM class.

## Pitfalls

<!-- pitfall: color-picker-no-label-prop -->
- **`ColorPicker.Root` does not accept a `label` prop** — There is no `label` prop on `ColorPicker.Root`. It is a headless state provider only.
  - anti-pattern: `<ColorPicker.Root label="Pick a color" defaultValue={parseColor('hsl(0, 100%, 50%)')}>`
  - fix: `<ColorPicker.Root defaultValue={parseColor('hsl(0, 100%, 50%)')}>`
  - complete example:
    ```tsx
    import { ColorPicker } from '@tale-ui/react/color-picker';
    import { ColorArea } from '@tale-ui/react/color-area';
    import { ColorSlider } from '@tale-ui/react/color-slider';

    export function Example() {
      return (
        <ColorPicker.Root defaultValue="hsb(200, 100%, 100%)">
          <ColorArea.Root xChannel="saturation" yChannel="brightness">
            <ColorArea.Thumb />
          </ColorArea.Root>

          <ColorSlider.Root channel="hue">
            <ColorSlider.Track><ColorSlider.Thumb /></ColorSlider.Track>
          </ColorSlider.Root>
        </ColorPicker.Root>
      );
    }
    ```

<!-- multi-idea-ok -->
<!-- pitfall: color-picker-sub-components-not-exported -->
- **Sub-components are NOT exported from `@tale-ui/react/color-picker`** — `ColorArea`, `ColorSwatch`, `ColorSlider`, and other color components each have their own import path. Import them individually.
  - anti-pattern: `import { ColorArea, ColorSlider } from '@tale-ui/react/color-picker'`
  - fix: `import { ColorArea } from '@tale-ui/react/color-area'`
  - fix: `import { ColorSlider } from '@tale-ui/react/color-slider'`

<!-- cross-pitfall-ref: color-imports-from-rac -->
<!-- cross-pitfall-ref: no-color-pojo-state -->

## Notes

- This is a headless state provider; it does not render its own DOM node.
- Nested color controls share the `ColorPicker.Root` value through React Aria context.
- Use standalone components with shared state only when the controls live outside a common `ColorPicker.Root`.
