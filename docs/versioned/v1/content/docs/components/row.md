# Row

`import { Row } from '@tale-ui/react/row';`

A horizontal flex layout primitive for arranging children in a row with consistent spacing and alignment.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gap` | `'4xs' \| '3xs' \| '2xs' \| 'xs' \| 's' \| 'm' \| 'l' \| 'xl' \| '2xl'` | `'m'` | Gap between children (maps to `--space-*` tokens) |
| `align` | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'` | `'center'` | Cross-axis alignment (`align-items`) |
| `justify` | `'start' \| 'center' \| 'end' \| 'between'` | `'start'` | Main-axis justification (`justify-content`) |
| `wrap` | `boolean` | `false` | Whether children wrap to the next line |

Also accepts all standard `<div>` HTML attributes.

## Basic Usage

```tsx
<Row gap="s">
  <Button>Cancel</Button>
  <Button variant="primary">Save</Button>
</Row>
```

## Examples

### Button Row with End Justification

```tsx
<Row gap="s" justify="end">
  <Button>Cancel</Button>
  <Button variant="primary">Submit</Button>
</Row>
```

### Centered Content

```tsx
<Row gap="m" justify="center" align="center">
  <Icon icon={StarIcon} />
  <Text variant="label" size="m">Featured</Text>
</Row>
```

### Space Between

```tsx
<Row justify="between" align="center">
  <Text variant="heading" size="m">Settings</Text>
  <Button variant="ghost" size="sm">Edit</Button>
</Row>
```

### Wrapping Tags

```tsx
<Row gap="xs" wrap>
  <Badge>React</Badge>
  <Badge>TypeScript</Badge>
  <Badge>CSS</Badge>
  <Badge>Design Systems</Badge>
</Row>
```

### Alignment Options

```tsx
<Row gap="m" align="start">
  <Text>Top-aligned</Text>
  <Text variant="display" size="l">Tall</Text>
</Row>

<Row gap="m" align="baseline">
  <Text variant="heading" size="l">Title</Text>
  <Text variant="text" size="s">subtitle</Text>
</Row>
```

## CSS Classes

- `.tale-row` -- Base (applies `display: flex; flex-direction: row`)
- `.tale-row--wrap` -- Enables flex wrapping
- Gap, alignment, and justification are applied via inline style variables.

## Pitfalls

<!-- cross-pitfall-ref: row-justify-shorthand -->
<!-- cross-pitfall-ref: row-no-css-flex-props -->

## Notes

- Custom component -- not built on a React Aria primitive.
- Default gap is `m`, default alignment is `center`, default justification is `start`.
- Renders a `<div>` element.
- For vertical layout, use [`Column`](column.md) instead.
