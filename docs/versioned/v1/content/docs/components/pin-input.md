# PinInput

`import { PinInput } from '@tale-ui/react/pin-input';`

OTP / verification code input with individual digit slots. Built on [input-otp](https://github.com/guilhermerodz/input-otp).

## Parts

| Part | Description |
|------|-------------|
| `PinInput.Root` | Container. Wraps `OTPInput` from `input-otp`. Accepts `maxLength`, `value`, `onChange`, `disabled`. |
| `PinInput.Group` | Groups related slots together (`<div>`). |
| `PinInput.Slot` | Renders a single digit slot. Accepts `index`. |
| `PinInput.Separator` | Decorative separator between groups (`<span>`). |

## Props

### Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxLength` | `number` | — | Total number of input slots (required) |
| `value` | `string` | — | Controlled value |
| `onChange` | `(value: string) => void` | — | Called when the value changes |
| `disabled` | `boolean` | `false` | Whether the input is disabled |

### Slot

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `index` | `number` | — | Zero-based index into the slots array (required) |

Group and Separator accept only an optional `className`.

## Basic Usage

```tsx
<PinInput.Root maxLength={4}>
  <PinInput.Group>
    <PinInput.Slot index={0} />
    <PinInput.Slot index={1} />
    <PinInput.Slot index={2} />
    <PinInput.Slot index={3} />
  </PinInput.Group>
</PinInput.Root>
```

## Examples

### With Separator (6-digit)

```tsx
<PinInput.Root maxLength={6}>
  <PinInput.Group>
    <PinInput.Slot index={0} />
    <PinInput.Slot index={1} />
    <PinInput.Slot index={2} />
  </PinInput.Group>
  <PinInput.Separator />
  <PinInput.Group>
    <PinInput.Slot index={3} />
    <PinInput.Slot index={4} />
    <PinInput.Slot index={5} />
  </PinInput.Group>
</PinInput.Root>
```

### Controlled

```tsx
const [value, setValue] = React.useState('');

<PinInput.Root maxLength={6} value={value} onChange={setValue}>
  <PinInput.Group>
    <PinInput.Slot index={0} />
    <PinInput.Slot index={1} />
    <PinInput.Slot index={2} />
    <PinInput.Slot index={3} />
    <PinInput.Slot index={4} />
    <PinInput.Slot index={5} />
  </PinInput.Group>
</PinInput.Root>
```

### Disabled

```tsx
<PinInput.Root maxLength={4} disabled>
  <PinInput.Group>
    <PinInput.Slot index={0} />
    <PinInput.Slot index={1} />
    <PinInput.Slot index={2} />
    <PinInput.Slot index={3} />
  </PinInput.Group>
</PinInput.Root>
```

## CSS Classes

- `.tale-pin-input` — Root container
- `.tale-pin-input:has(input:disabled)` — Disabled state (dimmed, no pointer events)
- `.tale-pin-input__group` — Slot group
- `.tale-pin-input__slot` — Individual digit slot
- `.tale-pin-input__slot[data-active]` — Active (focused) slot
- `.tale-pin-input__slot[data-filled]` — Slot with a character (darker border)
- `.tale-pin-input__caret` — Blinking caret indicator
- `.tale-pin-input__separator` — Separator between groups

## Pitfalls

<!-- pitfall: pin-input-slot-not-input -->
<!-- multi-idea-ok -->
- **Uses `PinInput.Slot` (NOT `PinInput.Input`)** — each `Slot` requires an `index` prop; `maxLength` is required on `PinInput.Root`.
  - anti-pattern: `<PinInput.Root><PinInput.Input /><PinInput.Input /></PinInput.Root>`
  - fix: `<PinInput.Root maxLength={2}><PinInput.Group><PinInput.Slot index={0} /><PinInput.Slot index={1} /></PinInput.Group></PinInput.Root>`
  - complete example:
    ```tsx
    import { PinInput } from '@tale-ui/react/pin-input';

    export function Example() {
      return (
        <PinInput.Root maxLength={6}>
          <PinInput.Group>
            <PinInput.Slot index={0} />
            <PinInput.Slot index={1} />
            <PinInput.Slot index={2} />
          </PinInput.Group>
          <PinInput.Separator />
          <PinInput.Group>
            <PinInput.Slot index={3} />
            <PinInput.Slot index={4} />
            <PinInput.Slot index={5} />
          </PinInput.Group>
        </PinInput.Root>
      );
    }
    ```
<!-- pitfall: when-showing-conditional-feedback-text -->
- **When showing conditional feedback text after PIN entry, use `Text color="muted"` plus `size="s"`** — `Text` only accepts `'default'`, `'muted'`, and `'accent'` as color values, and status tokens such as `'success'` are not valid on `Text`. `size="sm"` is also invalid because `Text` size uses single-letter tokens.
  - anti-pattern: `<Text size="sm" color="success">Code entered: {value}</Text>`
  - fix: `<Text size="s" color="muted">Code entered: {value}</Text>`

<!-- pitfall: pin-input-column-gap-uses-spacing-tokens -->
- **When wrapping PinInput in a Column, use spacing-token gap values** — use `gap="m"` or another spacing token, not a component-size name such as `gap="md"`.
  - anti-pattern: `<Column gap="md"><PinInput.Root maxLength={2}><PinInput.Group><PinInput.Slot index={0} /><PinInput.Slot index={1} /></PinInput.Group></PinInput.Root></Column>`
  - fix: `<Column gap="m"><PinInput.Root maxLength={2}><PinInput.Group><PinInput.Slot index={0} /><PinInput.Slot index={1} /></PinInput.Group></PinInput.Root></Column>`

<!-- pitfall: when-labeling-a-pininput-with -->
- **When labeling a PinInput with Text, use variant="label" — Text has no weight prop** — passing `weight="medium"` on a `<Text>` label causes `Type '{ children: string; weight: string; }' is not assignable to type 'TextProps'`. Use `variant="label"` for label-weight text instead.
  - anti-pattern: `<Text weight="medium">Verification code</Text>`
  - fix: `<Text variant="label">Verification code</Text>`

## Notes

- Requires `input-otp` as a peer dependency. Install it separately: `npm install input-otp`.
- The hidden `<input>` element is managed by `input-otp` and handles keyboard navigation, paste, and autofill automatically.
- Each `Slot` reads its state (character, active, caret) from React context provided by `Root`.
