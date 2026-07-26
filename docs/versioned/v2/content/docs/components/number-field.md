# NumberField

`import { NumberField } from '@tale-ui/react/number-field';`

A numeric input with increment/decrement buttons, supporting min/max bounds, step values, and number formatting.

## Parts

| Part                       | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| `NumberField.Root`         | Wrapper managing value state, validation, and formatting |
| `NumberField.Label`        | Accessible label for the field                           |
| `NumberField.Group`        | Groups the input and stepper buttons together            |
| `NumberField.Input`        | The text input element                                   |
| `NumberField.Increment`    | Button to increase the value (renders `+` by default)    |
| `NumberField.Decrement`    | Button to decrease the value (renders `−` by default)    |
| `NumberField.Description`  | Help text displayed below the field                      |
| `NumberField.ErrorMessage` | Validation error message                                 |

## Props

Accepts all React Aria `NumberField` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

### New in React Aria 1.17/1.18

| Prop             | Type                   | Default  | Description                                                                                                                                                                                                                                                                                                    |
| ---------------- | ---------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `commitBehavior` | `'snap' \| 'validate'` | `'snap'` | Controls when typed input commits to the value (on blur after editing). `'snap'` clamps to min/max and snaps to the nearest step; `'validate'` does not clamp and instead validates that the value is in range and on a valid step. Lives on the React Aria layer; flows through `NumberField.Root` untouched. |

Render props and data attributes now include read-only state (`isReadOnly`).

## Basic Usage

```tsx
<NumberField.Root defaultValue={0}>
  <NumberField.Group>
    <NumberField.Decrement />
    <NumberField.Input />
    <NumberField.Increment />
  </NumberField.Group>
</NumberField.Root>
```

## Examples

### With Label

```tsx
<NumberField.Root defaultValue={1}>
  <NumberField.Label>Quantity</NumberField.Label>
  <NumberField.Group>
    <NumberField.Decrement />
    <NumberField.Input />
    <NumberField.Increment />
  </NumberField.Group>
</NumberField.Root>
```

### Min/Max Bounds

```tsx
<NumberField.Root defaultValue={5} minValue={0} maxValue={10}>
  <NumberField.Label>Rating (0-10)</NumberField.Label>
  <NumberField.Group>
    <NumberField.Decrement />
    <NumberField.Input />
    <NumberField.Increment />
  </NumberField.Group>
</NumberField.Root>
```

### Custom Step

```tsx
<NumberField.Root defaultValue={0} step={5}>
  <NumberField.Label>Step by 5</NumberField.Label>
  <NumberField.Group>
    <NumberField.Decrement />
    <NumberField.Input />
    <NumberField.Increment />
  </NumberField.Group>
</NumberField.Root>
```

### Disabled

```tsx
<NumberField.Root defaultValue={42} isDisabled>
  <NumberField.Label>Disabled</NumberField.Label>
  <NumberField.Group>
    <NumberField.Decrement />
    <NumberField.Input />
    <NumberField.Increment />
  </NumberField.Group>
</NumberField.Root>
```

### Currency Format

```tsx
<NumberField.Root defaultValue={99.99} formatOptions={{ style: 'currency', currency: 'USD' }}>
  <NumberField.Label>Price</NumberField.Label>
  <NumberField.Group>
    <NumberField.Decrement />
    <NumberField.Input />
    <NumberField.Increment />
  </NumberField.Group>
</NumberField.Root>
```

### Custom Control Width

Set `--tale-number-field-group-width` on the root, group, or an ancestor to
resize only the visible input/stepper group. Use
`--tale-number-field-width` when the label, description, or error text should
keep a different text measure.

```tsx
<NumberField.Root className="panel-width-field" defaultValue={920}>
  <NumberField.Label>Default panel width (px)</NumberField.Label>
  <NumberField.Group>
    <NumberField.Decrement />
    <NumberField.Input />
    <NumberField.Increment />
  </NumberField.Group>
  <NumberField.Description>
    Width applied to newly opened panels.
  </NumberField.Description>
</NumberField.Root>
```

```css
.panel-width-field {
  --tale-number-field-width: 20rem;
  --tale-number-field-group-width: 8.75rem;
}
```

## CSS Classes

- `.tale-number-field` — Root container
- `.tale-number-field__label` — Label
- `.tale-number-field__group` — Input + buttons group
- `.tale-number-field__input` — Text input
- `.tale-number-field__increment` — Increment button
- `.tale-number-field__decrement` — Decrement button
- `.tale-number-field__description` — Help text
- `.tale-number-field__error` — Error message

## CSS Variables

| Variable                          | Default | Description                                                                                                |
| --------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------- |
| `--tale-number-field-width`       | `fit-content` | Width of the root field wrapper, including label, description, and error text.                       |
| `--tale-number-field-group-width` | `100%`  | Width of the input + stepper group. Set on the root or group to size the control separately from help text. |

## Pitfalls

<!-- pitfall: number-field-no-null-value -->

- **`NumberField.Root` `value` prop accepts `number | undefined`, NOT `number | null`.**
  - anti-pattern: `<NumberField.Root value={count ?? null}>`
  - fix: `<NumberField.Root value={count ?? undefined}>`
  - complete example:

    ```tsx
    import { NumberField } from '@tale-ui/react/number-field';

    export function Example() {
      return (
        <NumberField.Root defaultValue={0}>
          <NumberField.Label>Quantity</NumberField.Label>
          <NumberField.Group>
            <NumberField.Decrement />
            <NumberField.Input />
            <NumberField.Increment />
          </NumberField.Group>
        </NumberField.Root>
      );
    }
    ```

<!-- pitfall: number-field-no-phantom-sub-parts -->
<!-- multi-idea-ok -->

- **No phantom sub-parts: `NumberField.Step` and `NumberField.HintText` do not exist** — use `NumberField.Description` for help text.
  - anti-pattern: `<NumberField.HintText>Enter a number between 1 and 100</NumberField.HintText>`
  - fix: `<NumberField.Description>Enter a number between 1 and 100</NumberField.Description>`

<!-- cross-pitfall-ref: minvalue-maxvalue-not-min-max -->

## Notes

- Built on React Aria `NumberField`, `Group`, `Input`, `Button`, `Label`, `Text`, and `FieldError`.
- Pass `formatOptions` (Intl.NumberFormat options) for locale-aware formatting such as currency or percentages.
- Stepper buttons are automatically disabled at min/max bounds.
- **`Increment` and `Decrement` render their own icons by default** (`+` and `−`). Use them self-closing: `<NumberField.Increment />`. Only pass children if you need a custom icon.
