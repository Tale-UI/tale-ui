# TagSelect

A combobox that renders selected items as inline tag chips inside the field. Typing filters the dropdown; selecting an item adds a chip; clicking × (or pressing Backspace from the input) removes one.

## Import

```tsx
import { TagSelect } from '@tale-ui/react/tag-select';
```

## Parts

| Part | Element | Description |
|------|---------|-------------|
| `TagSelect.Root` | `div` | Outer container. Manages state and renders the field group, popover, and description. |
| `TagSelect.Item` | `div[role="option"]` | A single option in the dropdown list. |

## Props

### `TagSelect.Root`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant. |
| `label` | `ReactNode` | — | Label text displayed above the field. |
| `placeholder` | `string` | — | Placeholder shown inside the field when nothing is selected. |
| `description` | `ReactNode` | — | Helper text displayed below the field. |
| `errorMessage` | `ReactNode` | — | Error message shown when `isInvalid` is true. |
| `isDisabled` | `boolean` | — | Disables the field. |
| `isRequired` | `boolean` | — | Marks the field as required. |
| `isInvalid` | `boolean` | — | Puts the field in an error state. |
| `items` | `T[]` | `[]` | Full list of items to display in the dropdown. Must include an `id` field. |
| `children` | `ReactNode \| ((item: T) => ReactNode)` | — | Render-prop for items. Must return `<TagSelect.Item>` elements. |
| `selectedKeys` | `Set<Key>` | — | Controlled set of selected item IDs. |
| `defaultSelectedKeys` | `Set<Key>` | `new Set()` | Initial selection for uncontrolled mode. |
| `onSelectionChange` | `(keys: Set<Key>) => void` | — | Called when the selection changes. |
| `getItemLabel` | `(item: T) => string` | — | Returns the display text for a tag chip. Defaults to `item.name` → `item.label` → `String(item.id)`. |

### `TagSelect.Item`

Extends `ListBoxItemProps` from `react-aria-components`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `Key` | — | Unique key for this item. Must match the corresponding `id` in `items`. |
| `textValue` | `string` | — | Plain-text label used for keyboard typeahead and filtering. |

## Basic Usage

```tsx
import * as React from 'react';
import { TagSelect } from '@tale-ui/react/tag-select';

const people = [
  { id: 'alice', name: 'Alice' },
  { id: 'bob', name: 'Bob' },
  { id: 'carol', name: 'Carol' },
  { id: 'dave', name: 'Dave' },
];

export function TeamPicker() {
  type SelectionValue = Parameters<
    NonNullable<React.ComponentProps<typeof TagSelect.Root>['onSelectionChange']>
  >[0];
  const [selected, setSelected] = React.useState<SelectionValue>(new Set());

  return (
    <TagSelect.Root
      label="Team members"
      placeholder="Search members…"
      description="Select everyone who should have access."
      items={people}
      selectedKeys={selected}
      onSelectionChange={setSelected}
    >
      {(person) => (
        <TagSelect.Item id={person.id} textValue={person.name}>
          {person.name}
        </TagSelect.Item>
      )}
    </TagSelect.Root>
  );
}
```

## Examples

### Sizes

```tsx
<TagSelect.Root size="sm" label="Small" items={people} onSelectionChange={...}>
  {(p) => <TagSelect.Item id={p.id} textValue={p.name}>{p.name}</TagSelect.Item>}
</TagSelect.Root>

<TagSelect.Root size="md" label="Medium" items={people} onSelectionChange={...}>
  {(p) => <TagSelect.Item id={p.id} textValue={p.name}>{p.name}</TagSelect.Item>}
</TagSelect.Root>

<TagSelect.Root size="lg" label="Large" items={people} onSelectionChange={...}>
  {(p) => <TagSelect.Item id={p.id} textValue={p.name}>{p.name}</TagSelect.Item>}
</TagSelect.Root>
```

### Error state

```tsx
<TagSelect.Root
  label="Reviewers"
  isRequired
  isInvalid
  errorMessage="Please select at least one reviewer."
  items={people}
  onSelectionChange={...}
>
  {(p) => <TagSelect.Item id={p.id} textValue={p.name}>{p.name}</TagSelect.Item>}
</TagSelect.Root>
```

### Disabled

```tsx
<TagSelect.Root
  label="Collaborators"
  isDisabled
  defaultSelectedKeys={new Set(['alice'])}
  items={people}
>
  {(p) => <TagSelect.Item id={p.id} textValue={p.name}>{p.name}</TagSelect.Item>}
</TagSelect.Root>
```

### Custom item label

Items with non-standard field names need `getItemLabel`:

```tsx
const users = [
  { id: 'u1', firstName: 'Alice', lastName: 'Smith' },
  { id: 'u2', firstName: 'Bob',   lastName: 'Jones' },
];

<TagSelect.Root
  label="Users"
  items={users}
  getItemLabel={(u) => `${u.firstName} ${u.lastName}`}
  onSelectionChange={...}
>
  {(u) => (
    <TagSelect.Item id={u.id} textValue={`${u.firstName} ${u.lastName}`}>
      {u.firstName} {u.lastName}
    </TagSelect.Item>
  )}
</TagSelect.Root>
```

## CSS Classes

| Class | Description |
|-------|-------------|
| `.tale-tag-select` | Root container. |
| `.tale-tag-select__combobox` | ComboBox wrapper (`div`). |
| `.tale-tag-select__group` | Visual field surface. Gets `[data-focus-within]`, `[data-disabled]`, `[data-invalid]`. |
| `.tale-tag-select__group--sm` / `--lg` | Size modifiers on the group. |
| `.tale-tag-select__group--invalid` | Invalid state border. |
| `.tale-tag-select__input` | The search text input. |
| `.tale-tag-select__tag` | Inline tag chip. |
| `.tale-tag-select__tag--sm` / `--lg` | Size modifiers on tags. |
| `.tale-tag-select__tag-text` | Text content inside a tag. |
| `.tale-tag-select__tag-remove` | × remove button inside a tag. |
| `.tale-tag-select__popup` | Floating dropdown panel. Gets `[data-entering]`, `[data-exiting]`. |
| `.tale-tag-select__listbox` | Scrollable item list inside the popup. |
| `.tale-tag-select__item` | A dropdown option. Gets `[data-hovered]`, `[data-focused]`, `[data-focus-visible]`, `[data-disabled]`. |
| `.tale-tag-select__label` | Label above the field (styled via `_primitives.css`). |
| `.tale-tag-select__description` | Helper text below the field (styled via `_primitives.css`). |
| `.tale-tag-select__error` | Error message below the field (styled via `_primitives.css`). |

## Pitfalls

<!-- pitfall:tag-select-items-need-id -->
**Items must have an `id` field.** The type constraint is `T extends { id: Key }`. Any other fields are fine.

<!-- pitfall:tag-select-getitemlabel -->
**Use `getItemLabel` for non-standard item shapes.** The default label resolver tries `item.name`, then `item.label`, then `String(item.id)`. If your items have a different text field, pass `getItemLabel={(item) => item.displayName}` to avoid showing raw IDs in tag chips.

<!-- pitfall:tag-select-textvalue -->
**Always set `textValue` on `TagSelect.Item`.** The combobox uses `textValue` to filter items as the user types. Without it, typing will show no results.

<!-- pitfall:tag-select-controlled -->
**Never import `Key` or `Selection` from `react-aria-components` for TagSelect selection state.** Derive the selection type from `TagSelect.Root` props with `React.ComponentProps`, or omit the state type annotation entirely.
