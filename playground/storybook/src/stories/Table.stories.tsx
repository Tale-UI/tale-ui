import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table, useTableController, type Key } from '@tale-ui/react/table';

type Args = {
  selectionMode?: 'none' | 'single' | 'multiple';
};

const rows = [
  { id: '1', name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { id: '2', name: 'Bob', email: 'bob@example.com', role: 'Editor' },
  { id: '3', name: 'Carol', email: 'carol@example.com', role: 'Viewer' },
  { id: '4', name: 'Dave', email: 'dave@example.com', role: 'Editor' },
  { id: '5', name: 'Eve', email: 'eve@example.com', role: 'Admin' },
];

function compareRows(left: (typeof rows)[number], right: (typeof rows)[number], column: Key) {
  if (column === 'email') {
    return left.email.localeCompare(right.email);
  }
  if (column === 'role') {
    return left.role.localeCompare(right.role);
  }
  return left.name.localeCompare(right.name);
}

const meta: Meta<Args> = {
  title: 'Components/Table',
  parameters: { layout: 'centered' },
  argTypes: {
    selectionMode: {
      control: 'select',
      options: ['none', 'single', 'multiple'],
    },
  },
  args: {
    selectionMode: 'none',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <Table.Root aria-label="People" selectionMode={args.selectionMode}>
        <Table.Header>
          <Table.Column isRowHeader>Name</Table.Column>
          <Table.Column>Email</Table.Column>
          <Table.Column>Role</Table.Column>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => (
            <Table.Row key={row.id} id={row.id}>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>{row.email}</Table.Cell>
              <Table.Cell>{row.role}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    );
  },
};

export const WithSelection: Story = {
  parameters: {
    controls: { disable: true },
  },
  render() {
    return (
      <Table.Root aria-label="People" selectionMode="multiple">
        <Table.Header>
          <Table.Column isRowHeader>Name</Table.Column>
          <Table.Column>Email</Table.Column>
          <Table.Column>Role</Table.Column>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => (
            <Table.Row key={row.id} id={row.id}>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>{row.email}</Table.Cell>
              <Table.Cell>{row.role}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    );
  },
};

export const WithFooter: Story = {
  parameters: {
    controls: { disable: true },
  },
  render() {
    return (
      <Table.Root aria-label="People">
        <Table.Header>
          <Table.Column isRowHeader>Name</Table.Column>
          <Table.Column>Email</Table.Column>
          <Table.Column>Role</Table.Column>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => (
            <Table.Row key={row.id} id={row.id}>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>{row.email}</Table.Cell>
              <Table.Cell>{row.role}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row id="totals">
            <Table.Cell>Total</Table.Cell>
            <Table.Cell>{`${rows.length} people`}</Table.Cell>
            <Table.Cell>{`${new Set(rows.map((row) => row.role)).size} roles`}</Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table.Root>
    );
  },
};

export const WithSorting: Story = {
  parameters: {
    controls: { disable: true },
  },
  render() {
    const controller = useTableController({
      tableId: 'storybook-people',
      defaultSortDescriptor: { column: 'name', direction: 'ascending' },
    });
    const sortedRows = controller.sorting.sortRows(rows, compareRows);

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
          {sortedRows.map((row) => (
            <Table.Row key={row.id} id={row.id}>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>{row.email}</Table.Cell>
              <Table.Cell>{row.role}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const controller = useTableController({
      tableId: 'storybook-all-people',
      defaultSortDescriptor: { column: 'name', direction: 'ascending' },
    });
    const sortedRows = controller.sorting.sortRows(rows, compareRows);

    return (
      <div className="story-sections">
        <div>
          <p className="story-label">Default</p>
          <Table.Root aria-label="People — default">
            <Table.Header>
              <Table.Column isRowHeader>Name</Table.Column>
              <Table.Column>Email</Table.Column>
              <Table.Column>Role</Table.Column>
            </Table.Header>
            <Table.Body>
              {rows.map((row) => (
                <Table.Row key={row.id} id={row.id}>
                  <Table.Cell>{row.name}</Table.Cell>
                  <Table.Cell>{row.email}</Table.Cell>
                  <Table.Cell>{row.role}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </div>
        <div>
          <p className="story-label">Sortable</p>
          <Table.Root {...controller.tableProps} aria-label="People — sortable">
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
              {sortedRows.map((row) => (
                <Table.Row key={row.id} id={row.id}>
                  <Table.Cell>{row.name}</Table.Cell>
                  <Table.Cell>{row.email}</Table.Cell>
                  <Table.Cell>{row.role}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </div>
        <div>
          <p className="story-label">Selectable (multiple)</p>
          <Table.Root aria-label="People — selectable" selectionMode="multiple">
            <Table.Header>
              <Table.Column isRowHeader>Name</Table.Column>
              <Table.Column>Email</Table.Column>
              <Table.Column>Role</Table.Column>
            </Table.Header>
            <Table.Body>
              {rows.map((row) => (
                <Table.Row key={row.id} id={row.id}>
                  <Table.Cell>{row.name}</Table.Cell>
                  <Table.Cell>{row.email}</Table.Cell>
                  <Table.Cell>{row.role}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </div>
      </div>
    );
  },
};
