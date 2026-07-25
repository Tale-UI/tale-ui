# Dropdown — With Search (Simple)

A dropdown with an inline search field that filters the visible items. Built by composing a `SearchField` above a `Menu.MenuList`.

## Components Used

- `Menu` from `@tale-ui/react/menu`
- `SearchField` from `@tale-ui/react/search-field`

## Code

```tsx
import { Menu } from '@tale-ui/react/menu';
import { SearchField } from '@tale-ui/react/search-field';
import { useState } from 'react';

const allItems = [
  { id: 'apple', label: 'Apple' },
  { id: 'banana', label: 'Banana' },
  { id: 'cherry', label: 'Cherry' },
  { id: 'date', label: 'Date' },
  { id: 'elderberry', label: 'Elderberry' },
  { id: 'fig', label: 'Fig' },
  { id: 'grape', label: 'Grape' },
];

export function SearchDropdown() {
  const [query, setQuery] = useState('');
  const filtered = allItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Menu.Root>
      <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">
        Select fruit ▾
      </Menu.Trigger>
      <Menu.Popover placement="bottom start" offset={4}>
        <div style={{ padding: 'var(--space-xs)' }}>
          <SearchField.Root variant="inline" value={query} onChange={setQuery}>
            <SearchField.Label>Search fruit</SearchField.Label>
            <SearchField.Input placeholder="Search…" autoFocus />
          </SearchField.Root>
        </div>
        <Menu.MenuList>
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <Menu.Item key={item.id} id={item.id}>
                {item.label}
              </Menu.Item>
            ))
          ) : (
            <Menu.Item id="empty" isDisabled>
              No results
            </Menu.Item>
          )}
        </Menu.MenuList>
      </Menu.Popover>
    </Menu.Root>
  );
}
```

## Notes

- `autoFocus` on `SearchField.Input` moves keyboard focus into the search box as soon as the popover opens, so users can start typing immediately.
- Use `SearchField.Root variant="inline"` when search sits inside a menu, popover, or other container surface.
- The empty state is a disabled `Menu.Item`, so it inherits menu spacing without becoming selectable.
- For server-side filtering, replace the local `filter` with a debounced API call and show a `Spinner` while loading.
- `Combobox` is the correct component when the search and selection are a single control. Use this pattern only when you want the trigger to be a `<button>` and the list to be a `<menu>` (action semantics rather than combobox semantics).
