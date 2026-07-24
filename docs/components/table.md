# Table

`import { Table, useTableController } from '@tale-ui/react/table';`

An accessible data table with support for row selection and a shared controller
for stable client or cancellable server sorting.

## Parts

| Part           | Description                                                                                     |
| -------------- | ----------------------------------------------------------------------------------------------- |
| `Table.Root`   | `<table>` wrapper. Accepts `aria-label`, `selectionMode`, `sortDescriptor`, and `onSortChange`. |
| `Table.Header` | `<thead>` section containing columns.                                                           |
| `Table.Column` | A column header cell. Supports `isRowHeader` and `allowsSorting`.                               |
| `Table.Body`   | `<tbody>` section containing rows.                                                              |
| `Table.Row`    | A table row. Requires `id`.                                                                     |
| `Table.Cell`   | A table data cell.                                                                              |
| `Table.Footer` | Footer section for totals/summary rows (renders `<tfoot>`).                                     |

## Props

Accepts all React Aria `Table` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Sorting controller

`useTableController` is additive: existing direct `sortDescriptor` and
`onSortChange` props continue to work.

| Option                  | Description                                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------------------- |
| `tableId`               | Required stable request identity. Keep it unchanged across SSR/hydration and while mounted.     |
| `sortDescriptor`        | Controlled React Aria sorting descriptor.                                                       |
| `defaultSortDescriptor` | Initial sorting descriptor for uncontrolled use.                                                |
| `onSortChange`          | Reports every descriptor requested through React Aria.                                          |
| `onQueryChange`         | Starts server work with an abort signal, request ID, revision, and stale-result `accept` guard. |

The returned `tableProps` belong on `Table.Root`. Use
`controller.sorting.sortRows(rows, compare)` for stable, immutable client
sorting. Call `controller.cancelPendingRequest()` to cancel server work
explicitly.

## Basic Usage

```tsx
<Table.Root aria-label="People">
  <Table.Header>
    <Table.Column isRowHeader>Name</Table.Column>
    <Table.Column>Email</Table.Column>
    <Table.Column>Role</Table.Column>
  </Table.Header>
  <Table.Body>
    <Table.Row id="1">
      <Table.Cell>Alice</Table.Cell>
      <Table.Cell>alice@example.com</Table.Cell>
      <Table.Cell>Admin</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
```

## Examples

### With Selection

```tsx
<Table.Root aria-label="People" selectionMode="multiple">
  <Table.Header>
    <Table.Column isRowHeader>Name</Table.Column>
    <Table.Column>Email</Table.Column>
    <Table.Column>Role</Table.Column>
  </Table.Header>
  <Table.Body>
    <Table.Row id="1">
      <Table.Cell>Alice</Table.Cell>
      <Table.Cell>alice@example.com</Table.Cell>
      <Table.Cell>Admin</Table.Cell>
    </Table.Row>
    <Table.Row id="2">
      <Table.Cell>Bob</Table.Cell>
      <Table.Cell>bob@example.com</Table.Cell>
      <Table.Cell>Editor</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
```

### With Sorting

```tsx
import { Table, useTableController, type Key } from '@tale-ui/react/table';

function SortableTable() {
  const controller = useTableController({
    tableId: 'people',
    defaultSortDescriptor: { column: 'name', direction: 'ascending' },
  });

  const rows = [
    { id: '1', name: 'Alice', email: 'alice@example.com', role: 'Admin' },
    { id: '2', name: 'Bob', email: 'bob@example.com', role: 'Editor' },
  ];

  const sorted = controller.sorting.sortRows(rows, (left, right, column: Key) => {
    if (column === 'email') return left.email.localeCompare(right.email);
    if (column === 'role') return left.role.localeCompare(right.role);
    return left.name.localeCompare(right.name);
  });

  return (
    <Table.Root {...controller.tableProps} aria-label="People">
      <Table.Header>
        <Table.Column id="name" isRowHeader allowsSorting>
          Name
        </Table.Column>
        <Table.Column id="email" allowsSorting>
          Email
        </Table.Column>
        <Table.Column id="role" allowsSorting>
          Role
        </Table.Column>
      </Table.Header>
      <Table.Body>
        {sorted.map((row) => (
          <Table.Row key={row.id} id={row.id}>
            <Table.Cell>{row.name}</Table.Cell>
            <Table.Cell>{row.email}</Table.Cell>
            <Table.Cell>{row.role}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
```

### Server Sorting

`onQueryChange` receives a fresh request context after each sort. A newer sort
aborts the previous signal. Apply a response through `accept` so stale or
already-accepted work cannot commit.

```tsx
import { useState } from 'react';
import { Table, useTableController, type SortDescriptor } from '@tale-ui/react/table';

interface Person {
  id: string;
  name: string;
  role: string;
}

function ServerSortedTable() {
  const [rows, setRows] = useState<Person[]>([]);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });
  const controller = useTableController({
    tableId: 'server-people',
    sortDescriptor,
    onSortChange: setSortDescriptor,
    onQueryChange(query, request) {
      const params = new URLSearchParams({
        column: String(query.sortDescriptor.column),
        direction: query.sortDescriptor.direction,
      });
      fetch(`/api/people?${params}`, { signal: request.signal })
        .then((response) => response.json())
        .then((nextRows) => request.accept(() => setRows(nextRows)));
    },
  });

  return (
    <Table.Root {...controller.tableProps} aria-label="People">
      <Table.Header>
        <Table.Column id="name" isRowHeader allowsSorting>
          Name
        </Table.Column>
        <Table.Column id="role" allowsSorting>
          Role
        </Table.Column>
      </Table.Header>
      <Table.Body>
        {rows.map((row) => (
          <Table.Row key={row.id} id={row.id}>
            <Table.Cell>{row.name}</Table.Cell>
            <Table.Cell>{row.role}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
```

### Footer with totals

Place `Table.Footer` after `Table.Body` to render a `<tfoot>` with summary rows.

```tsx
<Table.Root aria-label="Invoice items">
  <Table.Header>
    <Table.Column isRowHeader>Item</Table.Column>
    <Table.Column>Quantity</Table.Column>
    <Table.Column>Price</Table.Column>
  </Table.Header>
  <Table.Body>
    <Table.Row id="1">
      <Table.Cell>Widget</Table.Cell>
      <Table.Cell>2</Table.Cell>
      <Table.Cell>$10.00</Table.Cell>
    </Table.Row>
    <Table.Row id="2">
      <Table.Cell>Gadget</Table.Cell>
      <Table.Cell>1</Table.Cell>
      <Table.Cell>$25.00</Table.Cell>
    </Table.Row>
  </Table.Body>
  <Table.Footer>
    <Table.Row id="totals">
      <Table.Cell>Total</Table.Cell>
      <Table.Cell>3</Table.Cell>
      <Table.Cell>$35.00</Table.Cell>
    </Table.Row>
  </Table.Footer>
</Table.Root>
```

### Expandable rows

New in React Aria 1.17/1.18 — `Table.Root` accepts props for hierarchical (tree-like) data, all inherited from React Aria:

| Prop                  | Type                                | Description                                           |
| --------------------- | ----------------------------------- | ----------------------------------------------------- |
| `treeColumn`          | `Key`                               | The id of the column that displays hierarchical data. |
| `expandedKeys`        | `Expandable['expandedKeys']`        | The currently expanded row keys (controlled).         |
| `defaultExpandedKeys` | `Expandable['defaultExpandedKeys']` | The initially expanded row keys (uncontrolled).       |
| `onExpandedChange`    | `Expandable['onExpandedChange']`    | Handler called when the expanded keys change.         |

Nested rows are declared by nesting `Table.Row` children inside a parent `Table.Row` collection (`childItems`). Expanded rows expose a `[data-expanded]` attribute for styling, and `Table.Row` render props now include `state`.

```tsx
<Table.Root aria-label="Files" treeColumn="name" defaultExpandedKeys={['docs']}>
  <Table.Header>
    <Table.Column id="name" isRowHeader>
      Name
    </Table.Column>
    <Table.Column id="size">Size</Table.Column>
  </Table.Header>
  <Table.Body>
    <Table.Row id="docs">
      <Table.Cell>Documents</Table.Cell>
      <Table.Cell>--</Table.Cell>
      <Table.Row id="docs-resume">
        <Table.Cell>resume.pdf</Table.Cell>
        <Table.Cell>120 KB</Table.Cell>
      </Table.Row>
    </Table.Row>
  </Table.Body>
</Table.Root>
```

## CSS Classes

- `.tale-table` — Base
- `.tale-table__header` — Header section
- `.tale-table__column` — Column header cell
- `.tale-table__body` — Body section
- `.tale-table__row` — Row
- `.tale-table__cell` — Data cell
- `.tale-table__footer` — Footer section

## Pitfalls

<!-- pitfall: table-no-column-header-part -->

- **No `Table.ColumnHeader`** — use `Table.Column` for column header cells.
  - anti-pattern: `<Table.ColumnHeader>Name</Table.ColumnHeader>`
  - fix: `<Table.Column>Name</Table.Column>`
  - complete example:

    ```tsx
    import { Table } from '@tale-ui/react/table';

    export function Example() {
      return (
        <Table.Root aria-label="People">
          <Table.Header>
            <Table.Column isRowHeader>Name</Table.Column>
            <Table.Column>Email</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row id="1">
              <Table.Cell>Alice</Table.Cell>
              <Table.Cell>alice@example.com</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      );
    }
    ```

<!-- pitfall: table-no-status-part -->

- **No `Table.Status` sub-part** — render a `<Badge>` inside a `Table.Cell` to show status.
  - anti-pattern: `<Table.Status variant="success">Active</Table.Status>`
  - fix: `<Table.Cell><Badge variant="success">Active</Badge></Table.Cell>`

## Notes

- Set `allowsSorting` on individual columns.
- Spread `controller.tableProps` on `Table.Root`.
- `Table.Root` still accepts `sortDescriptor` directly.
- `Table.Root` still accepts `onSortChange` directly.
- `selectionMode` can be `"none"`, `"single"`, or `"multiple"`.
- Built on React Aria `Table`, `TableHeader`, `Column`, `TableBody`, `Row`, and `Cell`.
- Columns support `data-sort-direction` (`ascending`/`descending`) when `allowsSorting` is used.

## A2UI decision

The sorting controller is React-only and is not added to the A2UI catalog.
Serialized A2UI cannot safely carry a comparator or server request callback.
The existing A2UI `Table` and `TableColumn.allowsSorting` mappings remain
unchanged; an A2UI host may own sorting outside the catalog when it can provide
equivalent request correlation and stale-result handling.

- Columns support `data-resizable` when column resizing is enabled.
- **`Table` is a namespace object, not a component.** Always use `<Table.Root>`, never `<Table>` directly. Writing `<Table aria-label="...">` passes the namespace object to React, which crashes with "Element type is invalid". TypeScript catches this at compile time; plain JSX does not.
