# Slider

`import { Slider } from '@tale-ui/react/slider';`

A draggable range input for selecting a value or range within a given span.

## Parts

| Part               | Description                                                                                                                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Slider.Root`      | Wrapper managing value, min/max, step, and orientation                                                                                                                                                    |
| `Slider.Header`    | Flex row wrapper for Label + Output                                                                                                                                                                       |
| `Slider.Label`     | Accessible label                                                                                                                                                                                          |
| `Slider.Output`    | Displays the current value(s). Handles range values (formats both thumb values). Accepts optional `position` (`'top'` \| `'bottom'`) for thumb-relative placement — nest inside `Slider.Thumb` when using |
| `Slider.Control`   | Touch-active container around the track                                                                                                                                                                   |
| `Slider.Track`     | The rail the thumb slides along                                                                                                                                                                           |
| `Slider.Indicator` | Filled portion of the track. Backed by React Aria's `SliderFill` — RTL-aware, fills between thumbs in range mode, and accepts an `offset` prop to fill from a value other than the minimum                |
| `Slider.Thumb`     | Draggable handle (render two for a range slider)                                                                                                                                                          |

## Props

Accepts all React Aria `Slider` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

### Slider.Indicator

| Prop     | Type     | Default   | Description                                                                                                                          |
| -------- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `offset` | `number` | min value | Fill from a value other than the minimum (new in React Aria 1.17/1.18). E.g. `offset={0}` on a −50..50 slider fills from the center. |

## Basic Usage

```tsx
<Slider.Root defaultValue={50}>
  <Slider.Header>
    <Slider.Label>Volume</Slider.Label>
    <Slider.Output />
  </Slider.Header>
  <Slider.Control>
    <Slider.Track>
      <Slider.Indicator />
      <Slider.Thumb />
    </Slider.Track>
  </Slider.Control>
</Slider.Root>
```

## Examples

### Range Slider

```tsx
<Slider.Root defaultValue={[20, 80]}>
  <Slider.Header>
    <Slider.Label>Price Range</Slider.Label>
    <Slider.Output />
  </Slider.Header>
  <Slider.Control>
    <Slider.Track>
      <Slider.Indicator />
      <Slider.Thumb />
      <Slider.Thumb />
    </Slider.Track>
  </Slider.Control>
</Slider.Root>
```

### Custom Step

```tsx
<Slider.Root defaultValue={50} step={10}>
  <Slider.Header>
    <Slider.Label>Quality</Slider.Label>
    <Slider.Output />
  </Slider.Header>
  <Slider.Control>
    <Slider.Track>
      <Slider.Indicator />
      <Slider.Thumb />
    </Slider.Track>
  </Slider.Control>
</Slider.Root>
```

### Thumb Label (Bottom)

Place `Slider.Output` inside `Slider.Thumb` with `position="bottom"` to show the value below the handle.

```tsx
<Slider.Root defaultValue={50}>
  <Slider.Control>
    <Slider.Track>
      <Slider.Indicator />
      <Slider.Thumb>
        <Slider.Output position="bottom" />
      </Slider.Thumb>
    </Slider.Track>
  </Slider.Control>
</Slider.Root>
```

### Thumb Label (Floating Top)

Use `position="top"` for a floating tooltip-style label above the thumb.

```tsx
<Slider.Root defaultValue={50}>
  <Slider.Control>
    <Slider.Track>
      <Slider.Indicator />
      <Slider.Thumb>
        <Slider.Output position="top" />
      </Slider.Thumb>
    </Slider.Track>
  </Slider.Control>
</Slider.Root>
```

### Fill from Center (offset)

Use the `offset` prop on `Slider.Indicator` to fill from a value other than the minimum — useful for sliders spanning negative and positive values.

```tsx
<Slider.Root defaultValue={20} minValue={-50} maxValue={50}>
  <Slider.Header>
    <Slider.Label>Balance</Slider.Label>
    <Slider.Output />
  </Slider.Header>
  <Slider.Control>
    <Slider.Track>
      <Slider.Indicator offset={0} />
      <Slider.Thumb />
    </Slider.Track>
  </Slider.Control>
</Slider.Root>
```

### Disabled

```tsx
<Slider.Root defaultValue={60} isDisabled>
  <Slider.Header>
    <Slider.Label>Disabled Slider</Slider.Label>
    <Slider.Output />
  </Slider.Header>
  <Slider.Control>
    <Slider.Track>
      <Slider.Indicator />
      <Slider.Thumb />
    </Slider.Track>
  </Slider.Control>
</Slider.Root>
```

### Vertical

```tsx
<Slider.Root defaultValue={40} orientation="vertical">
  <Slider.Label>Vertical</Slider.Label>
  <Slider.Output />
  <Slider.Control>
    <Slider.Track>
      <Slider.Indicator />
      <Slider.Thumb />
    </Slider.Track>
  </Slider.Control>
</Slider.Root>
```

## CSS Classes

- `.tale-slider` — Root container
- `.tale-slider__header` — Header row (Label + Output)
- `.tale-slider__label` — Label
- `.tale-slider__output` — Value display
- `.tale-slider__control` — Touch container
- `.tale-slider__track` — Rail
- `.tale-slider__indicator` — Filled portion
- `.tale-slider__thumb` — Draggable handle
- `.tale-slider__output--top` — Floating tooltip-style value display above thumb
- `.tale-slider__output--bottom` — Value display below thumb

## Pitfalls

<!-- pitfall: slider-nested-structure -->

- **Requires nested structure: Root > Control > Track > Indicator + Thumb** — use `onChange` (NOT `onValueChange`).
  - anti-pattern: `<Slider.Root onValueChange={setValue}><Slider.Track /><Slider.Thumb /></Slider.Root>`
  - fix: `<Slider.Root onChange={setValue}><Slider.Control><Slider.Track><Slider.Indicator /><Slider.Thumb /></Slider.Track></Slider.Control></Slider.Root>`
  - complete example:

    ```tsx
    import { Slider } from '@tale-ui/react/slider';

    export function Example() {
      return (
        <Slider.Root defaultValue={50}>
          <Slider.Header>
            <Slider.Label>Volume</Slider.Label>
            <Slider.Output />
          </Slider.Header>
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator />
              <Slider.Thumb />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>
      );
    }
    ```

<!-- cross-pitfall-ref: minvalue-maxvalue-not-min-max -->

## Notes

- Built on React Aria `Slider`, `SliderTrack`, `SliderFill`, `SliderThumb`, and `SliderOutput`.
- Pass an array (e.g. `defaultValue={[20, 80]}`) for a range slider, and render two `Slider.Thumb` elements.
- `Slider.Indicator` is backed by React Aria's `SliderFill` (new in 1.17/1.18): it is RTL-aware and automatically fills between the two thumbs in range mode.
- `Slider.Output` handles range values, formatting both thumb values automatically.
- Supports `orientation="horizontal"` (default) and `orientation="vertical"`.
- `Slider.Control` is a plain `<div>` that provides a larger touch target around the track.
