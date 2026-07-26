# Column

`import { Column } from '@tale-ui/react/column';`

A vertical flex layout primitive for arranging children in a column with consistent spacing and alignment.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gap` | `'4xs' \| '3xs' \| '2xs' \| 'xs' \| 's' \| 'm' \| 'l' \| 'xl' \| '2xl'` | `'m'` | Gap between children (maps to `--space-*` tokens) |
| `align` | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'` | `'stretch'` | Cross-axis alignment (`align-items`) |
| `justify` | `'start' \| 'center' \| 'end' \| 'between'` | `'start'` | Main-axis justification (`justify-content`) |

Also accepts all standard `<div>` HTML attributes.

## Basic Usage

```tsx
<Column gap="m">
  <Text variant="heading" size="m">Title</Text>
  <Text variant="text" size="m">Description text below the title.</Text>
</Column>
```

## Examples

### Vertical Form Layout

```tsx
<Column gap="m">
  <Field>
    <Field.Label>Name</Field.Label>
    <Input placeholder="Enter your name" />
  </Field>
  <Field>
    <Field.Label>Email</Field.Label>
    <Input type="email" placeholder="Enter your email" />
  </Field>
  <Row gap="s" justify="end">
    <Button>Cancel</Button>
    <Button variant="primary">Submit</Button>
  </Row>
</Column>
```

### Centered Content

```tsx
<Column gap="s" align="center">
  <Avatar src="/avatar.jpg" alt="User" />
  <Text variant="label" size="m">Jane Doe</Text>
  <Text variant="text" size="s" color="muted">Developer</Text>
</Column>
```

### Card Content Stack

```tsx
<Column gap="xs">
  <Text variant="title" size="m">Notifications</Text>
  <Text variant="text" size="s" color="muted">
    Manage how you receive notifications.
  </Text>
  <Separator />
  <SwitchField.Root>
    <SwitchField.Button>
      <SwitchField.Thumb />
      Email notifications
    </SwitchField.Button>
  </SwitchField.Root>
  <SwitchField.Root>
    <SwitchField.Button>
      <SwitchField.Thumb />
      Push notifications
    </SwitchField.Button>
  </SwitchField.Root>
</Column>
```

### Space Between

```tsx
<Column gap="m" justify="between" style={{ minHeight: 300 }}>
  <Text variant="heading" size="m">Header</Text>
  <Text variant="text" size="m">Content fills the middle.</Text>
  <Text variant="text" size="s" color="muted">Footer</Text>
</Column>
```

## CSS Classes

- `.tale-column` -- Base (applies `display: flex; flex-direction: column`)
- Gap, alignment, and justification are applied via inline style variables.

## Pitfalls

<!-- pitfall: column-form-gap-too-large -->
- **Use `gap="s"` when stacking form fields** — the default `gap="m"` is too large for tight field stacks inside forms or cards
  - anti-pattern: `<Column gap="m">`
  - fix: `<Column gap="s">`

<!-- cross-pitfall-ref: column-needs-explicit-import -->

## Notes

- Custom component -- not built on a React Aria primitive.
- Default gap is `m`, default alignment is `stretch`, default justification is `start`.
- Renders a `<div>` element.
- The `stretch` default for `align` means children expand to fill the column width, which is the most common behavior for vertical layouts.
- For horizontal layout, use [`Row`](row.md) instead.
