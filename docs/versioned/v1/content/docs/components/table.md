# Table

`import { Table } from '@tale-ui/react/table';`

An accessible data table with support for sorting and row selection.

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
import { useState } from 'react';
import type { SortDescriptor } from '@tale-ui/react/table';

function SortableTable() {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });

  const rows = [
    { id: '1', name: 'Alice', email: 'alice@example.com', role: 'Admin' },
    { id: '2', name: 'Bob', email: 'bob@example.com', role: 'Editor' },
  ];

  const sorted = [...rows].sort((a, b) => {
    const col = sortDescriptor.column as keyof typeof a;
    const cmp = a[col].localeCompare(b[col]);
    return sortDescriptor.direction === 'descending' ? -cmp : cmp;
  });

  return (
    <Table.Root
      aria-label="People"
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
    >
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

- Set `allowsSorting` on individual columns and provide `sortDescriptor` / `onSortChange` on `Root` to enable sorting.
- `selectionMode` can be `"none"`, `"single"`, or `"multiple"`.
- Built on React Aria `Table`, `TableHeader`, `Column`, `TableBody`, `Row`, and `Cell`.
- Columns support `data-sort-direction` (`ascending`/`descending`) when `allowsSorting` is used.
- Columns support `data-resizable` when column resizing is enabled.
- **`Table` is a namespace object, not a component.** Always use `<Table.Root>`, never `<Table>` directly. Writing `<Table aria-label="...">` passes the namespace object to React, which crashes with "Element type is invalid". TypeScript catches this at compile time; plain JSX does not.
