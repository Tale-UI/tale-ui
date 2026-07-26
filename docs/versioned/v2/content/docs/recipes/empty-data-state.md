# Empty Data State

Using `EmptyState` as a fallback when tables, lists, or search results have no data.

## Table with empty fallback

```tsx
import { Table } from '@tale-ui/react/table';
import { EmptyState } from '@tale-ui/react/empty-state';
import { Icon } from '@tale-ui/react/icon';
import { Inbox } from 'lucide-react';

interface Row {
  id: string;
  name: string;
  status: string;
}

export function DataTable({ rows }: { rows: Row[] }) {
  if (rows.length === 0) {
    return (
      <EmptyState.Root size="md">
        <EmptyState.Icon>
          <Icon icon={Inbox} size="lg" />
        </EmptyState.Icon>
        <EmptyState.Title>No results found</EmptyState.Title>
        <EmptyState.Description>Try adjusting your search or filters.</EmptyState.Description>
      </EmptyState.Root>
    );
  }

  return (
    <Table.Root aria-label="Data">
      <Table.Header>
        <Table.Column isRowHeader>Name</Table.Column>
        <Table.Column>Status</Table.Column>
      </Table.Header>
      <Table.Body>
        {rows.map((row) => (
          <Table.Row key={row.id}>
            <Table.Cell>{row.name}</Table.Cell>
            <Table.Cell>{row.status}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
```

## List with empty fallback

```tsx
import { List } from '@tale-ui/react/list';
import { EmptyState } from '@tale-ui/react/empty-state';
import { Icon } from '@tale-ui/react/icon';
import { FileQuestion } from 'lucide-react';

export function ItemList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return (
      <EmptyState.Root size="sm">
        <EmptyState.Icon>
          <Icon icon={FileQuestion} size="lg" />
        </EmptyState.Icon>
        <EmptyState.Title>Nothing here yet</EmptyState.Title>
      </EmptyState.Root>
    );
  }

  return (
    <List.Root variant="divided">
      {items.map((item, i) => (
        <List.Item key={i}>{item}</List.Item>
      ))}
    </List.Root>
  );
}
```

## Key points

- Check data length before rendering the data component.
- `EmptyState` has three sizes: `sm`, `md`, `lg` — use `sm` for inline contexts, `md` for page sections.
- Always provide a `Title`; `Description` and `Icon` are optional but recommended.
- Wrap the visual icon in `EmptyState.Icon`, then render the Tale UI `Icon` component inside it.

## Preview

```tsx
import { Column } from '@tale-ui/react/column';
import { Text } from '@tale-ui/react/text';

export function Example() {
  const sampleRows = [
    { id: '1', name: 'Project Alpha', status: 'Active' },
    { id: '2', name: 'Project Beta', status: 'Paused' },
  ];

  return (
    <Column gap="xl" style={{ padding: 'var(--space-l)' }}>
      <Column gap="s">
        <Text variant="label">Table with data</Text>
        <DataTable rows={sampleRows} />
      </Column>
      <Column gap="s">
        <Text variant="label">Table — empty state</Text>
        <DataTable rows={[]} />
      </Column>
      <Column gap="s">
        <Text variant="label">List — empty state</Text>
        <ItemList items={[]} />
      </Column>
    </Column>
  );
}
```
