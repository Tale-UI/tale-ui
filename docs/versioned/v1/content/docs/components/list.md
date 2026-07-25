# List

`import { List } from '@tale-ui/react/list';`

A non-interactive list for displaying items with optional visual dividers. For selectable or keyboard-navigable lists, use [`GridList`](grid-list.md) instead.

## Parts

| Part | Description |
|------|-------------|
| `List.Root` | Container (`<ul>`). Accepts `variant` prop. |
| `List.Item` | Individual list entry (`<li>`). |

## Props

### Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'plain' \| 'divided'` | `'plain'` | Visual style. `divided` adds separator lines between items. |
| `density` | `'compact' \| 'default' \| 'spacious'` | `'default'` | Item padding density. `compact` uses `--space-2xs`, `spacious` uses `--space-s`. |

Also accepts all standard `<ul>` HTML attributes.

### Item

| Prop | Type | Default | Description |
|------|------|---------|-------------|

Accepts all standard `<li>` HTML attributes including `className`.

## Basic Usage

```tsx
<List.Root>
  <List.Item>First item</List.Item>
  <List.Item>Second item</List.Item>
  <List.Item>Third item</List.Item>
</List.Root>
```

## Examples

### Plain List (Default)

```tsx
<List.Root variant="plain">
  <List.Item>Apples</List.Item>
  <List.Item>Bananas</List.Item>
  <List.Item>Cherries</List.Item>
</List.Root>
```

### Divided List

```tsx
<List.Root variant="divided">
  <List.Item>Apples</List.Item>
  <List.Item>Bananas</List.Item>
  <List.Item>Cherries</List.Item>
</List.Root>
```

### Rich Content Items

```tsx
<List.Root variant="divided">
  <List.Item>
    <Row justify="between" align="center">
      <Column gap="2xs">
        <Text variant="label" size="m">Alice Johnson</Text>
        <Text variant="text" size="s" color="muted">alice@example.com</Text>
      </Column>
      <Badge variant="success">Active</Badge>
    </Row>
  </List.Item>
  <List.Item>
    <Row justify="between" align="center">
      <Column gap="2xs">
        <Text variant="label" size="m">Bob Smith</Text>
        <Text variant="text" size="s" color="muted">bob@example.com</Text>
      </Column>
      <Badge variant="neutral">Inactive</Badge>
    </Row>
  </List.Item>
</List.Root>
```

### Settings List

```tsx
<List.Root variant="divided">
  <List.Item>
    <SwitchField.Root defaultSelected>
      <SwitchField.Button>
        <SwitchField.Thumb />
        Email notifications
      </SwitchField.Button>
    </SwitchField.Root>
  </List.Item>
  <List.Item>
    <SwitchField.Root>
      <SwitchField.Button>
        <SwitchField.Thumb />
        Push notifications
      </SwitchField.Button>
    </SwitchField.Root>
  </List.Item>
  <List.Item>
    <SwitchField.Root>
      <SwitchField.Button>
        <SwitchField.Thumb />
        SMS notifications
      </SwitchField.Button>
    </SwitchField.Root>
  </List.Item>
</List.Root>
```

## CSS Classes

- `.tale-list` -- Root container
- `.tale-list--divided` -- Divided variant (adds separator lines between items)
- `.tale-list--compact` -- Compact density (`--space-2xs` item padding)
- `.tale-list--spacious` -- Spacious density (`--space-s` item padding)
- `.tale-list__item` -- Individual list item

## Pitfalls

<!-- pitfall: list-variant-valid-values -->
- **`variant` accepts `'plain'` or `'divided'` only** — `'item'` is NOT a valid value.
  - anti-pattern: `<List.Root variant="item">`
  - fix: `<List.Root variant="divided">`
  - complete example:
    ```tsx
    import { List } from '@tale-ui/react/list';

    export function Example() {
      return (
        <List.Root variant="divided">
          <List.Item>First item</List.Item>
          <List.Item>Second item</List.Item>
          <List.Item>Third item</List.Item>
        </List.Root>
      );
    }
    ```

## Notes

- Custom component -- not built on a React Aria primitive.
- This is a **non-interactive** display list. It does not support selection, keyboard navigation, or drag-and-drop. Use [`GridList`](grid-list.md) for interactive list functionality.
- Default variant is `plain`.
- Renders a `<ul>` with `<li>` children for correct semantic markup.
- All parts accept `className` for custom styling.
