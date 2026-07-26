# ListBox

`import { ListBox } from '@tale-ui/react/list-box';`

A standalone selectable listbox for options, command results, and picker grids.

## Parts

| Part | Description |
|------|-------------|
| `ListBox.Root` | Selectable listbox container |
| `ListBox.Item` | Individual option |
| `ListBox.Section` | Group of related options |
| `ListBox.Header` | Section header label |
| `ListBox.Text` | Slot text inside an item |
| `ListBox.SelectionIndicator` | Visual indicator for selected items |
| `ListBox.LoadMoreItem` | Sentinel row for async loading |
| `ListBox.Collection` | Dynamic collection helper |

## Props

Each part accepts the matching React Aria props plus an optional `className`. Tale UI adds no custom behaviour props.

## Basic Usage

```tsx
import { ListBox } from '@tale-ui/react/list-box';

export function StatusListBox() {
  return (
    <ListBox.Root aria-label="Project status" selectionMode="single">
      <ListBox.Item id="todo" textValue="To do">
        To do
      </ListBox.Item>
      <ListBox.Item id="doing" textValue="In progress">
        In progress
      </ListBox.Item>
      <ListBox.Item id="done" textValue="Done">
        Done
      </ListBox.Item>
    </ListBox.Root>
  );
}
```

## Examples

### With Sections

```tsx
import { ListBox } from '@tale-ui/react/list-box';

export function SectionedListBox() {
  return (
    <ListBox.Root aria-label="Foods" selectionMode="single">
      <ListBox.Section id="fruit">
        <ListBox.Header>Fruit</ListBox.Header>
        <ListBox.Item id="apple" textValue="Apple">
          Apple
        </ListBox.Item>
        <ListBox.Item id="banana" textValue="Banana">
          Banana
        </ListBox.Item>
      </ListBox.Section>
      <ListBox.Section id="vegetables">
        <ListBox.Header>Vegetables</ListBox.Header>
        <ListBox.Item id="carrot" textValue="Carrot">
          Carrot
        </ListBox.Item>
        <ListBox.Item id="broccoli" textValue="Broccoli">
          Broccoli
        </ListBox.Item>
      </ListBox.Section>
    </ListBox.Root>
  );
}
```

### Multiple Selection

```tsx
import { ListBox } from '@tale-ui/react/list-box';

export function MultipleListBox() {
  return (
    <ListBox.Root aria-label="Notification channels" selectionMode="multiple">
      <ListBox.Item id="email" textValue="Email">
        Email
        <ListBox.SelectionIndicator />
      </ListBox.Item>
      <ListBox.Item id="sms" textValue="SMS">
        SMS
        <ListBox.SelectionIndicator />
      </ListBox.Item>
      <ListBox.Item id="push" textValue="Push">
        Push
        <ListBox.SelectionIndicator />
      </ListBox.Item>
    </ListBox.Root>
  );
}
```

### Virtualized Grid

```tsx
import { ListBox } from '@tale-ui/react/list-box';
import { GridLayout, Size, Virtualizer } from '@tale-ui/react/virtualizer';

const reactions = [
  { id: 'smile', emoji: '😀', label: 'Smile' },
  { id: 'laugh', emoji: '😄', label: 'Laugh' },
  { id: 'heart', emoji: '😍', label: 'Heart eyes' },
  { id: 'party', emoji: '🥳', label: 'Party' },
];

export function VirtualizedReactionGrid() {
  return (
    <Virtualizer
      layout={GridLayout}
      layoutOptions={{
        minItemSize: new Size(44, 44),
        maxItemSize: new Size(44, 44),
        minSpace: new Size(4, 4),
        preserveAspectRatio: true,
      }}
    >
      <ListBox.Root aria-label="Reactions" items={reactions} layout="grid" selectionMode="single">
        {(item) => (
          <ListBox.Item id={item.id} textValue={item.label}>
            {item.emoji}
          </ListBox.Item>
        )}
      </ListBox.Root>
    </Virtualizer>
  );
}
```

## CSS Classes

- `.tale-list-box` -- Root listbox container
- `.tale-list-box--frameless` -- Removes the root surface background, border color, and shadow
- `.tale-list-box__item` -- Individual option
- `.tale-list-box__item--emoji` -- Square centered item presentation for emoji grids
- `.tale-list-box__section` -- Section wrapper
- `.tale-list-box__header` -- Section header
- `.tale-list-box__text` -- Text slot inside an item
- `.tale-list-box__selection-indicator` -- Selected-state indicator
- `.tale-list-box__load-more-item` -- Async loading sentinel item

## Pitfalls

<!-- pitfall: list-box-use-section-header -->
<!-- multi-idea-ok -->
- **Use `ListBox.Section` and `ListBox.Header` for grouped options** -- place headers inside sections instead of rendering loose labels among items.
  - anti-pattern: `<ListBox.Root><div>Fruit</div><ListBox.Item id="apple">Apple</ListBox.Item></ListBox.Root>`
  - fix: `<ListBox.Section id="fruit"><ListBox.Header>Fruit</ListBox.Header><ListBox.Item id="apple" textValue="Apple">Apple</ListBox.Item></ListBox.Section>`

<!-- pitfall: list-box-text-value -->
- **Provide `textValue` when item children are not plain text** -- icons, emoji, and custom markup need a text value for typeahead and accessibility.
  - anti-pattern: `<ListBox.Item id="party">🥳</ListBox.Item>`
  - fix: `<ListBox.Item id="party" textValue="Party face">🥳</ListBox.Item>`

<!-- pitfall: list-box-label-required -->
- **Label standalone list boxes** -- use `aria-label` or a visible label relationship so assistive technology can identify the collection.
  - anti-pattern: `<ListBox.Root><ListBox.Item id="one">One</ListBox.Item></ListBox.Root>`
  - fix: `<ListBox.Root aria-label="Options"><ListBox.Item id="one" textValue="One">One</ListBox.Item></ListBox.Root>`

<!-- pitfall: list-box-standalone-only -->
<!-- prose-only -->
- **Use standalone ListBox only for independent collections** -- keep `Select.ListBox`, `Combobox.ListBox`, and `Autocomplete.ListBox` inside those APIs.
