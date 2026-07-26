# Search with Autocomplete

A search input with filtered suggestions from a list of items.

## Components Used

- `Combobox` from `@tale-ui/react/combobox`
- `Icon` from `@tale-ui/react/icon`
- `Search` from `lucide-react`

## Code

```tsx
import { Combobox } from '@tale-ui/react/combobox';
import { Icon } from '@tale-ui/react/icon';
import { Search } from 'lucide-react';
import { useState } from 'react';

const allItems = [
  { id: 'button', label: 'Button' },
  { id: 'checkbox', label: 'Checkbox' },
  { id: 'dialog', label: 'Dialog' },
  { id: 'drawer', label: 'Drawer' },
  { id: 'menu', label: 'Menu' },
  { id: 'pagination', label: 'Pagination' },
  { id: 'select', label: 'Select' },
  { id: 'table', label: 'Table' },
  { id: 'tabs', label: 'Tabs' },
  { id: 'tooltip', label: 'Tooltip' },
];

function ComponentSearch() {
  const [query, setQuery] = useState('');

  const filtered = allItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Combobox.Root
      inputValue={query}
      onInputChange={setQuery}
      onSelectionChange={(key) => console.log('Selected:', key)}
      menuTrigger="focus"
    >
      <Combobox.Label>Search components</Combobox.Label>
      <Combobox.InputGroup>
        <Combobox.Input placeholder="Type to search..." />
        <Combobox.Trigger />
      </Combobox.InputGroup>
      <Combobox.Popover>
        <Combobox.ListBox>
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <Combobox.Item key={item.id} id={item.id} textValue={item.label}>
                {item.label}
              </Combobox.Item>
            ))
          ) : (
            <Combobox.Empty>No results found</Combobox.Empty>
          )}
        </Combobox.ListBox>
      </Combobox.Popover>
    </Combobox.Root>
  );
}
```

## Customization Points

- Replace `allItems` with your data source (API results, static list, etc.).
- Use `menuTrigger="focus"` to show suggestions on focus, or `"input"` to show only after typing.
- Add `Combobox.Section` and `Combobox.Header` to group results by category.
- Use `Combobox.Chips` for multi-select search (tag-based selection).
- Add debouncing to `onInputChange` for API-driven search.
