# Fieldset

`import { Fieldset } from '@tale-ui/react/fieldset';`

A native `<fieldset>` wrapper for grouping related form fields with a legend.

## Parts

| Part | Description |
|------|-------------|
| `Fieldset.Root` | The `<fieldset>` element. Accepts `disabled` to disable all children. |
| `Fieldset.Legend` | The `<legend>` element for the group title. |

## Props

Accepts all native `<fieldset>` element props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
<Fieldset.Root>
  <Fieldset.Legend>Personal Information</Fieldset.Legend>
  <TextField.Root>
    <TextField.Label>First Name</TextField.Label>
    <TextField.Input placeholder="John" />
  </TextField.Root>
  <TextField.Root>
    <TextField.Label>Last Name</TextField.Label>
    <TextField.Input placeholder="Doe" />
  </TextField.Root>
</Fieldset.Root>
```

## Examples

### Disabled Fieldset

```tsx
<Fieldset.Root disabled>
  <Fieldset.Legend>Billing Address (disabled)</Fieldset.Legend>
  <TextField.Root>
    <TextField.Label>Street</TextField.Label>
    <TextField.Input placeholder="123 Main St" />
  </TextField.Root>
  <TextField.Root>
    <TextField.Label>City</TextField.Label>
    <TextField.Input placeholder="Anytown" />
  </TextField.Root>
</Fieldset.Root>
```

## CSS Classes

- `.tale-fieldset` — Base
- `.tale-fieldset__legend` — Legend

## Pitfalls

<!-- pitfall: fieldset-only-root-and-legend -->
<!-- multi-idea-ok -->
- **Only `Root` and `Legend` sub-parts** — There is no `Fieldset.Label` or `Fieldset.Description`. The only sub-parts are `Fieldset.Root` and `Fieldset.Legend`.
  - anti-pattern: `<Fieldset.Label>Shipping address</Fieldset.Label>`
  - fix: `<Fieldset.Legend>Shipping address</Fieldset.Legend>`
  - complete example:
    ```tsx
    import { Fieldset } from '@tale-ui/react/fieldset';
    import { TextField } from '@tale-ui/react/text-field';

    export function Example() {
      return (
        <Fieldset.Root>
          <Fieldset.Legend>Shipping Address</Fieldset.Legend>
          <TextField.Root>
            <TextField.Label>Street</TextField.Label>
            <TextField.Input />
          </TextField.Root>
        </Fieldset.Root>
      );
    }
    ```

<!-- pitfall: fieldset-column-gap-token -->
- **When stacking fields inside Fieldset.Root with Column or Row, use spacing-token gap values, not component size names** — `gap="md"` is not a valid `Gap` value and causes a TypeScript error; use `gap="m"` instead.
  - anti-pattern: `<Column gap="md">`
  - anti-pattern: `<Row gap="md">`
  - fix: `<Column gap="m">`
  - fix: `<Row gap="m">`

## Notes

- Setting `disabled` on `Fieldset.Root` natively disables all form controls inside it.
- Typically used with `TextField`, `NumberField`, or other field components as children.
