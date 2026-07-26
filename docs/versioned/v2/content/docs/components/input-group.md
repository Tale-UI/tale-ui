# InputGroup

`import { InputGroup } from '@tale-ui/react/input-group';`

A horizontal flex container that groups a text input with leading and/or trailing visual addons — URL prefixes, currency symbols, units, or inline action buttons. Compose it with `Input.Root` from `@tale-ui/react/input`.

## Parts

| Part | Element | Description |
|------|---------|-------------|
| `InputGroup.Root` | `<div>` | Flex row container that aligns the input and addons flush against each other |
| `InputGroup.Addon` | `<span>` | Styled addon slot that attaches to either side of the input |

## Props

### `InputGroup.Root`

Accepts all standard `<div>` HTML attributes.

### `InputGroup.Addon`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| position | `'leading' \| 'trailing'` | `'leading'` | Side of the input that this addon attaches to. Controls which border and border-radius are removed. |

Also accepts all standard `<span>` HTML attributes.

## Basic Usage

```tsx
import { InputGroup } from '@tale-ui/react/input-group';
import { Input } from '@tale-ui/react/input';

<InputGroup.Root>
  <InputGroup.Addon position="leading">https://</InputGroup.Addon>
  <Input.Root>
    <Input.Label>Website</Input.Label>
    <Input.Input placeholder="example.com" />
  </Input.Root>
</InputGroup.Root>
```

## Examples

### Leading text prefix

```tsx
<InputGroup.Root>
  <InputGroup.Addon position="leading">https://</InputGroup.Addon>
  <Input.Root>
    <Input.Label>Website URL</Input.Label>
    <Input.Input placeholder="example.com" />
  </Input.Root>
</InputGroup.Root>
```

### Trailing unit suffix

```tsx
<InputGroup.Root>
  <Input.Root>
    <Input.Label>Duration</Input.Label>
    <Input.Input type="number" placeholder="30" />
  </Input.Root>
  <InputGroup.Addon position="trailing">minutes</InputGroup.Addon>
</InputGroup.Root>
```

### Both leading and trailing addons

```tsx
<InputGroup.Root>
  <InputGroup.Addon position="leading">$</InputGroup.Addon>
  <Input.Root>
    <Input.Label>Amount</Input.Label>
    <Input.Input type="number" placeholder="0.00" />
  </Input.Root>
  <InputGroup.Addon position="trailing">USD</InputGroup.Addon>
</InputGroup.Root>
```

### With action button in trailing addon

Wrap the button with a plain `<div>` or use the Addon's `children` slot directly:

```tsx
<InputGroup.Root>
  <Input.Root>
    <Input.Label>Referral code</Input.Label>
    <Input.Input placeholder="TALE-XYZ123" />
  </Input.Root>
  <InputGroup.Addon position="trailing">
    <button type="button" className="tale-button tale-button--secondary tale-button--sm">Copy</button>
  </InputGroup.Addon>
</InputGroup.Root>
```

### Using with Field wrapper for hint text

```tsx
import { Field } from '@tale-ui/react/field';

<Field.Root>
  <Field.Label>API endpoint</Field.Label>
  <InputGroup.Root>
    <InputGroup.Addon position="leading">https://api.</InputGroup.Addon>
    <Input.Root>
      <Input.Input placeholder="example.com/v1" />
    </Input.Root>
  </InputGroup.Root>
  <Field.Description>Must be a valid HTTPS URL.</Field.Description>
</Field.Root>
```

## CSS Classes

| Class | Applied to | Description |
|-------|-----------|-------------|
| `tale-input-group` | Root `<div>` | Flex row container |
| `tale-input-group__addon` | Addon `<span>` | Base addon styles: border, background, typography |
| `tale-input-group__addon--leading` | Addon when `position="leading"` | Removes right border; adds left-side border-radius |
| `tale-input-group__addon--trailing` | Addon when `position="trailing"` | Removes left border; adds right-side border-radius |

## Pitfalls

<!-- pitfall: label-placement -->
<!-- prose-only -->
- **Place `Input.Label` inside `Input.Root`** — the label is semantically associated with the input via React Aria's `TextField`, so it must remain inside `Input.Root`, not outside the `InputGroup.Root`.

<!-- pitfall: addon-buttons -->
<!-- prose-only -->
- **Buttons inside `InputGroup.Addon` may conflict with addon styles** — Tale UI buttons carry their own border-radius and box-shadow that can conflict with the addon's flush layout. Adjust via `className` overrides or use a plain `<button>`.

<!-- pitfall: no-double-label -->
<!-- prose-only -->
- **Use a single `Input.Label` inside `Input.Root`** — `InputGroup.Root` keeps the label associated with the input while aligning the addons to the input control row.

## Notes

- `InputGroup.Root` keeps addons aligned to the input control row, even when `Input.Root` also renders a label, description, or error message.
- The CSS `:has()` selector is used for trailing-side radius adjustment. This selector has broad browser support (Chrome 105+, Firefox 121+, Safari 15.4+). Fallback: if `:has()` is unavailable, the trailing input keeps its border-radius, which is acceptable graceful degradation.
- The center input column expands to fill the remaining horizontal space.
