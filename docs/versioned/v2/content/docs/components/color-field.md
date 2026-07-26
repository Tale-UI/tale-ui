# ColorField

`import { ColorField } from '@tale-ui/react/color-field';`

A text input for entering color values as hex, RGB, or HSL strings.

## Parts

| Part | Description |
|------|-------------|
| `ColorField.Root` | Wrapper that manages color field state |
| `ColorField.Input` | The text input element |
| `ColorField.Label` | Accessible label |
| `ColorField.Description` | Helper text |
| `ColorField.ErrorMessage` | Validation error message |

## Props

Accepts all React Aria `ColorField` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
<ColorField.Root>
  <ColorField.Label>Color</ColorField.Label>
  <ColorField.Input />
</ColorField.Root>
```

## CSS Classes

- `.tale-color-field` — Root
- `.tale-color-field__input` — Text input
- `.tale-color-field__label` — Label
- `.tale-color-field__description` — Description text
- `.tale-color-field__error` — Error message

## Pitfalls

<!-- pitfall: color-field-no-hex-color-field -->
- **There is no `HexColorField` component** — The hex color text input is `ColorField` from `@tale-ui/react/color-field`. There is no separate `HexColorField` export.
  - anti-pattern: `import { HexColorField } from '@tale-ui/react/color-field'`
  - fix: `import { ColorField } from '@tale-ui/react/color-field'`
  - complete example:
    ```tsx
    import { ColorField } from '@tale-ui/react/color-field';

    export function Example() {
      return (
        <ColorField.Root>
          <ColorField.Label>Color</ColorField.Label>
          <ColorField.Input />
        </ColorField.Root>
      );
    }
    ```

<!-- pitfall: color-field-onchange-returns-color-object -->
- **`ColorField.Root` `onChange` returns a `Color` object, not a string** — The `onChange` callback receives a `Color` object (see `@tale-ui/react/color-field`), not a raw hex string. Call `.toString('hex')` or similar on the value if you need a string.
  - anti-pattern: `<ColorField.Root onChange={(val) => setHex(val)} />`
  - fix: `<ColorField.Root onChange={(val) => setHex(val.toString('hex'))} />`

<!-- cross-pitfall-ref: color-imports-from-rac -->

## Notes

- Accepts and parses hex, RGB, and HSL color string formats.
- Supports `isDisabled` and `isRequired` props on the Root.
