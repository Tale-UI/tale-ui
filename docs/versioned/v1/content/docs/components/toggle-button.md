# ToggleButton

`import { ToggleButton, ToggleButtonGroup } from '@tale-ui/react/toggle-button';`

A pressable toggle button that maintains selected/unselected state, built on React Aria's ToggleButton.

## Props

### ToggleButton

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |

Also accepts all React Aria `ToggleButton` props.

### ToggleButtonGroup

No Tale UI-specific props. Also accepts all React Aria `ToggleButtonGroup` props.

### Visual

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | `false` | Whether the toggle visual appears pressed/selected |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |

`ToggleButtonVisual` is `aria-hidden` — for component composition only, not application UI. See [Visual-Only Exports](visual-exports.md).

## Basic Usage

```tsx
import { ToggleButton } from '@tale-ui/react/toggle-button';

export function Example() {
  return <ToggleButton size="md">Toggle me</ToggleButton>;
}
```

## Examples

### Pressed by Default

```tsx
import { ToggleButton } from '@tale-ui/react/toggle-button';

export function PressedToggleButton() {
  return <ToggleButton defaultSelected>Pressed</ToggleButton>;
}
```

### Disabled

```tsx
<ToggleButton isDisabled>Disabled</ToggleButton>
```

### Group

```tsx
<ToggleButtonGroup aria-label="Text formatting">
  <ToggleButton>Bold</ToggleButton>
  <ToggleButton>Italic</ToggleButton>
  <ToggleButton>Underline</ToggleButton>
</ToggleButtonGroup>
```

### All Sizes

```tsx
<ToggleButton size="sm">Small</ToggleButton>
<ToggleButton size="md">Medium</ToggleButton>
<ToggleButton size="lg">Large</ToggleButton>
```

## CSS Classes

- `.tale-toggle-button` -- Base
- `.tale-toggle-button--sm` -- Small size
- `.tale-toggle-button--md` -- Medium size (default)
- `.tale-toggle-button--lg` -- Large size
- `.tale-toggle-button-group` -- Group wrapper

## Pitfalls

<!-- pitfall: toggle-button-isselected-not-pressed -->
- **Uses `isSelected`/`defaultSelected` for toggle state, not `pressed`** — `pressed` and `onPressedChange` are not valid props; use `isSelected`/`onChange` for controlled state.
  - anti-pattern: `<ToggleButton pressed={isOn} onPressedChange={setOn}>Bold</ToggleButton>`
  - fix: `<ToggleButton isSelected={isOn} onChange={setOn}>Bold</ToggleButton>`
  - complete example:
    ```tsx
    import { ToggleButton } from '@tale-ui/react/toggle-button';

    export function Example() {
      return (
        <ToggleButton size="md">Toggle me</ToggleButton>
      );
    }
    ```
<!-- pitfall: toggle-button-no-value-prop -->
- **Does NOT accept a `value` prop.**
  - anti-pattern: `<ToggleButton value="bold">Bold</ToggleButton>`
  - fix: `<ToggleButton defaultSelected>Bold</ToggleButton>`
<!-- pitfall: use-togglebutton-for-any-prompt -->
- **Use <ToggleButton> for any prompt that asks for a toggle button or formatting toggle** — when the request is for a toggleable action such as bold, italic, underline, mute, favorite, or similar on/off formatting/state controls, render the `ToggleButton` component itself instead of a generic `Button`, `Toolbar.Button`, custom button markup, or an empty placeholder.
  - anti-pattern: `import { Button } from '@tale-ui/react/button'; export function BoldToggle() { return <Button>Bold</Button>; }`
  - anti-pattern: `// empty file`
  - fix: `import { ToggleButton } from '@tale-ui/react/toggle-button'; export function BoldToggle() { return <ToggleButton>Bold</ToggleButton>; }`

## Notes

- `size` defaults to `"md"`.
- Use `defaultSelected` for uncontrolled or `isSelected`/`onChange` for controlled state.
- `ToggleButtonGroup` wraps multiple toggle buttons for toolbar-style layouts.
- **`ToggleButtonGroup` requires `aria-label` or `aria-labelledby`.** React Aria logs a console warning at runtime if neither is provided. Always supply one for accessibility.
- `ToggleButtonGroup` is also available via `import { ToggleButtonGroup } from '@tale-ui/react/toggle-group'` for convenience. Both import paths resolve to the same component.
