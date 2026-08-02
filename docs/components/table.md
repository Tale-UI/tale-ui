# Table

`import { Table, useTableController } from '@tale-ui/react/table';`

An accessible data table with stable sorting, selection, pagination, filtering,
and React Aria virtualization plugins coordinated by one controller.

## Parts

| Part                | Description                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| `Table.Root`        | `<table>` wrapper. Accepts `aria-label`, `selectionMode`, `sortDescriptor`, and `onSortChange`. |
| `Table.Header`      | `<thead>` section containing columns.                                                           |
| `Table.Column`      | A column header cell. Supports `isRowHeader` and `allowsSorting`.                               |
| `Table.Body`        | `<tbody>` section containing rows.                                                              |
| `Table.Row`         | A table row. Requires `id`.                                                                     |
| `Table.Cell`        | A table data cell.                                                                              |
| `Table.Footer`      | Footer section for totals/summary rows (renders `<tfoot>`).                                     |
| `Table.Virtualizer` | React Aria `TableLayout` virtualizer for large dynamic collections.                             |

## Props

Accepts all React Aria `Table` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

| Prop                         | Type               | Default   | Description                                                                  |
| ---------------------------- | ------------------ | --------- | ---------------------------------------------------------------------------- |
| `keyboardNavigationBehavior` | `'arrow' \| 'tab'` | `'arrow'` | Use `'tab'` when rows contain text fields, buttons, or other interactive UI. |

## Table controller

`useTableController` is additive: existing direct Table props continue to
work. Use the controller when two or more plugins, local row transforms, or
cancellable server requests must share one query revision.

| Plugin         | Controlled/default options                                                             | Returned API                                              |
| -------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Sorting        | `sortDescriptor`, `defaultSortDescriptor`, `onSortChange`                              | `sorting.sortRows`                                        |
| Selection      | `selectedKeys`, `defaultSelectedKeys`, `onSelectionChange`                             | `selection.setSelectedKeys`, `selection.isSelected`       |
| Pagination     | `page`, `defaultPage`, `pageSize`, `defaultPageSize`, `totalRows` and change callbacks | `pagination.paginateRows`, page bounds and setters        |
| Filtering      | `filter`, `defaultFilter`, `onFilterChange`                                            | `filtering.filterRows`, `filtering.setFilter`             |
| Virtualization | `virtualizationOptions`                                                                | `virtualization.virtualizerProps` for `Table.Virtualizer` |

Filters are ordinary serializable data with
`{schemaVersion: '1.0.0', value: string}`. Tale UI does not serialize or
execute consumer predicates.

The returned `tableProps` belong on `Table.Root`. Use
`filtering.filterRows`, `sorting.sortRows`, then `pagination.paginateRows` for
client data. Every plugin change publishes one combined query through
`onQueryChange`; a newer query aborts the previous request. Call
`controller.cancelPendingRequest()` to cancel explicitly.

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

### Interactive cells

Use `keyboardNavigationBehavior="tab"` when a row contains interactive
components. Tab moves through the controls while arrow-key table navigation
remains available outside them.

```tsx
import { Table } from '@tale-ui/react/table';
import { TextField } from '@tale-ui/react/text-field';

<Table.Root aria-label="Editable people" keyboardNavigationBehavior="tab">
  <Table.Header>
    <Table.Column isRowHeader>Name</Table.Column>
    <Table.Column>Email</Table.Column>
  </Table.Header>
  <Table.Body>
    <Table.Row id="alice">
      <Table.Cell>Alice</Table.Cell>
      <Table.Cell>
        <TextField.Root aria-label="Alice email" defaultValue="alice@example.com">
          <TextField.Input />
        </TextField.Root>
      </Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>;
```

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

### Selection, filtering, and pagination

```tsx
const controller = useTableController({
  tableId: 'people',
  defaultSelectedKeys: new Set(),
  defaultFilter: { schemaVersion: '1.0.0', value: '' },
  defaultPage: 1,
  defaultPageSize: 25,
  totalRows: people.length,
});

const filtered = controller.filtering.filterRows(people, (person, filter) =>
  person.name.toLowerCase().includes(filter.value.toLowerCase()),
);
const visibleRows = controller.pagination.paginateRows(filtered);

<Table.Root {...controller.tableProps} selectionMode="multiple" aria-label="People">
  <Table.Header>
    <Table.Column isRowHeader>Name</Table.Column>
  </Table.Header>
  <Table.Body items={visibleRows}>
    {(person) => (
      <Table.Row id={person.id}>
        <Table.Cell>{person.name}</Table.Cell>
      </Table.Row>
    )}
  </Table.Body>
</Table.Root>;
```

Filtering resets the requested page to one. A controlled page remains
authoritative while `onPageChange(1)` reports the reset request.

### Server queries

`onQueryChange` receives the complete sort, selection, page, page-size, and
filter snapshot. A newer query aborts the previous signal. Apply a response
through `accept` so stale or already-accepted work cannot commit.

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
        column: String(query.sortDescriptor?.column ?? ''),
        direction: query.sortDescriptor?.direction ?? '',
        page: String(query.page),
        pageSize: String(query.pageSize),
        filter: query.filter.value,
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

### Virtualized collection

Use a dynamic `items` collection, stable row IDs, and a measured or estimated
row height. `Table.Virtualizer` keeps React Aria's table collection and focus
semantics; it is not pagination and does not change the controller query.

```tsx
<Table.Virtualizer
  {...controller.virtualization.virtualizerProps}
  layoutOptions={{ rowHeight: 44 }}
>
  <Table.Root aria-label="10,000 people">
    <Table.Header>{/* stable columns */}</Table.Header>
    <Table.Body items={people}>
      {(person) => (
        <Table.Row id={person.id}>
          <Table.Cell>{person.name}</Table.Cell>
        </Table.Row>
      )}
    </Table.Body>
  </Table.Root>
</Table.Virtualizer>
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
- Direct React Aria sorting and selection props remain supported.
- Keep the default `keyboardNavigationBehavior="arrow"` for read-only tables;
  opt into `"tab"` only when cells contain interactive controls.
- Use stable row and column IDs for every plugin and across SSR/hydration.
- Do not infer server freshness from response order; commit through `request.accept`.
- Virtualization requires dynamic collections and does not replace pagination.
- `selectionMode` can be `"none"`, `"single"`, or `"multiple"`.
- Built on React Aria `Table`, `TableHeader`, `Column`, `TableBody`, `Row`, and `Cell`.
- Columns support `data-sort-direction` (`ascending`/`descending`) when `allowsSorting` is used.

## A2UI decision

The controller and virtualizer are React-only and are not added to the A2UI
catalog. Serialized A2UI cannot safely carry comparators, predicates, server
callbacks, mutable selection sets, or layout instances. Existing declarative
Table, selection, and sortable-column mappings remain unchanged. An A2UI host
may own these plugins outside the catalog only when it provides equivalent
stable IDs, accessibility, cancellation, and stale-result handling.

- Columns support `data-resizable` when column resizing is enabled.
- **`Table` is a namespace object, not a component.** Always use `<Table.Root>`, never `<Table>` directly. Writing `<Table aria-label="...">` passes the namespace object to React, which crashes with "Element type is invalid". TypeScript catches this at compile time; plain JSX does not.
