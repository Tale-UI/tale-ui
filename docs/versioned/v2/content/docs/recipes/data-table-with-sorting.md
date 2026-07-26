# Data Table with Sorting

A data table with sortable columns, row action menus, and pagination.

## Components Used

- `Table` from `@tale-ui/react/table`
- `Menu` from `@tale-ui/react/menu`
- `Icon` from `@tale-ui/react/icon`
- `Pagination` from `@tale-ui/react/pagination`
- `MoreHorizontal` from `lucide-react`

## Code

```tsx
import { Table } from '@tale-ui/react/table';
import { Menu } from '@tale-ui/react/menu';
import { Icon } from '@tale-ui/react/icon';
import { Pagination } from '@tale-ui/react/pagination';
import type { SortDescriptor } from '@tale-ui/react/table';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

const data = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer' },
];

function UserTable() {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });

  const sorted = [...data].sort((a, b) => {
    const key = sortDescriptor.column as keyof typeof a;
    const cmp = String(a[key]).localeCompare(String(b[key]));
    return sortDescriptor.direction === 'ascending' ? cmp : -cmp;
  });

  return (
    <div>
      <Table.Root
        aria-label="Users"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <Table.Header>
          <Table.Column id="name" allowsSorting>
            Name
          </Table.Column>
          <Table.Column id="email" allowsSorting>
            Email
          </Table.Column>
          <Table.Column id="role">Role</Table.Column>
          <Table.Column id="actions" width={48}>
            Actions
          </Table.Column>
        </Table.Header>
        <Table.Body>
          {sorted.map((user) => (
            <Table.Row key={user.id}>
              <Table.Cell>{user.name}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>{user.role}</Table.Cell>
              <Table.Cell>
                <Menu.Root>
                  <Menu.Trigger
                    aria-label="Actions"
                    className="tale-icon-button tale-button tale-button--ghost tale-icon-button--sm"
                  >
                    <Icon icon={MoreHorizontal} />
                  </Menu.Trigger>
                  <Menu.Popover>
                    <Menu.MenuList>
                      <Menu.Item onAction={() => console.log('Edit', user.id)}>Edit</Menu.Item>
                      <Menu.Item onAction={() => console.log('Delete', user.id)}>Delete</Menu.Item>
                    </Menu.MenuList>
                  </Menu.Popover>
                </Menu.Root>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Pagination.Root aria-label="Table pagination" style={{ marginTop: 'var(--space-s)' }}>
        <Pagination.PreviousTrigger disabled />
        <Pagination.Item page={1} current />
        <Pagination.Item page={2} />
        <Pagination.Item page={3} />
        <Pagination.NextTrigger />
      </Pagination.Root>
    </div>
  );
}
```

## Customization Points

- Replace `data` with your API response and add real pagination logic.
- Add `selectionMode="multiple"` to `Table.Root` for row selection with checkboxes.
- Use `Table.Column` `width` prop to control column sizing.
- Add more `Menu.Item` entries for additional row actions.
- Connect `Pagination` click handlers to update page state and re-fetch data.
