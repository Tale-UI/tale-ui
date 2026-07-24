import { Table, useTableController, type Key } from '@tale-ui/react/table';
import { Menu } from '@tale-ui/react/menu';
import { Pagination } from '@tale-ui/react/pagination';
import { Icon } from '@tale-ui/react/icon';
import { Column } from '@tale-ui/react/column';
import { Text } from '@tale-ui/react/text';
import { MoreHorizontal } from 'lucide-react';

const tableData = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer' },
  { id: 4, name: 'Dave Brown', email: 'dave@example.com', role: 'Admin' },
  { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'Editor' },
];

export default function DataTableWithSorting() {
  const controller = useTableController({
    tableId: 'recipe-users',
    defaultSortDescriptor: { column: 'name', direction: 'ascending' },
  });

  const sorted = controller.sorting.sortRows(tableData, (left, right, column: Key) => {
    if (column === 'email') {
      return left.email.localeCompare(right.email);
    }
    if (column === 'role') {
      return left.role.localeCompare(right.role);
    }
    return left.name.localeCompare(right.name);
  });

  return (
    <Column
      gap="m"
      style={{ maxWidth: '30rem', margin: '0 auto', padding: 'var(--space-l) var(--space-m)' }}
    >
      <Text as="h1" variant="heading" size="l">
        Data Table with Sorting
      </Text>
      <Table.Root {...controller.tableProps} aria-label="Users">
        <Table.Header>
          <Table.Column id="name" isRowHeader allowsSorting>
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
            <Table.Row key={user.id} id={user.id}>
              <Table.Cell>{user.name}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>{user.role}</Table.Cell>
              <Table.Cell>
                <Menu.Root>
                  <Menu.Trigger
                    aria-label="Actions"
                    className="tale-icon-button tale-button tale-button--ghost tale-icon-button--sm"
                  >
                    <Icon icon={MoreHorizontal} size="sm" />
                  </Menu.Trigger>
                  <Menu.Popover>
                    <Menu.MenuList>
                      <Menu.Item>Edit</Menu.Item>
                      <Menu.Item>Delete</Menu.Item>
                    </Menu.MenuList>
                  </Menu.Popover>
                </Menu.Root>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Pagination.Root aria-label="Table pagination">
        <Pagination.PreviousTrigger disabled />
        <Pagination.Item page={1} current />
        <Pagination.Item page={2} />
        <Pagination.Item page={3} />
        <Pagination.NextTrigger />
      </Pagination.Root>
    </Column>
  );
}
