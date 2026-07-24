import * as React from 'react';
import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { createRenderer } from '#test-utils';
import {
  Table,
  sortTableRows,
  useTableController,
  type SortDescriptor,
  type TableFilterExpression,
  type TableControllerOptions,
  type TableControllerRequestContext,
} from './index';

const rows = [
  { id: 'row-1', name: 'Bob', role: 'Designer' },
  { id: 'row-2', name: 'Alice', role: 'Editor' },
  { id: 'row-3', name: 'Alice', role: 'Manager' },
];

function compareRows(left: (typeof rows)[number], right: (typeof rows)[number], column: React.Key) {
  if (column === 'role') {
    return left.role.localeCompare(right.role);
  }
  return left.name.localeCompare(right.name);
}

function ControllerHarness(props: TableControllerOptions) {
  const controller = useTableController(props);
  return (
    <React.Fragment>
      <output data-testid="sort">
        {controller.sorting.sortDescriptor
          ? `${controller.sorting.sortDescriptor.column}:${controller.sorting.sortDescriptor.direction}`
          : 'none'}
      </output>
      <button
        type="button"
        onClick={() =>
          controller.tableProps.onSortChange!({
            column: 'name',
            direction: 'descending',
          })
        }
      >
        Sort rows
      </button>
    </React.Fragment>
  );
}

function SortableTableHarness() {
  const controller = useTableController({
    tableId: 'people',
    defaultSortDescriptor: { column: 'name', direction: 'ascending' },
  });
  const sortedRows = controller.sorting.sortRows(rows, compareRows);
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
        {sortedRows.map((row) => (
          <Table.Row key={row.id} id={row.id}>
            <Table.Cell>{row.name}</Table.Cell>
            <Table.Cell>{row.role}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

function PluginHarness(props: Partial<TableControllerOptions> = {}) {
  const controller = useTableController({
    tableId: 'plugins',
    defaultSelectedKeys: new Set(['row-1']),
    defaultPage: 1,
    defaultPageSize: 2,
    defaultFilter: { schemaVersion: '1.0.0', value: '' },
    totalRows: rows.length,
    virtualizationOptions: { rowHeight: 44 },
    ...props,
  });
  const filtered = controller.filtering.filterRows(rows, (row, expression) =>
    row.name.toLowerCase().includes(expression.value.toLowerCase()),
  );
  const visible = controller.pagination.paginateRows(filtered);
  return (
    <React.Fragment>
      <output data-testid="selection">
        {controller.selection.isSelected('row-1') ? 'selected' : 'not-selected'}
      </output>
      <output data-testid="page">{controller.pagination.page}</output>
      <output data-testid="visible">{visible.map((row) => row.id).join(',')}</output>
      <output data-testid="filter">{controller.filtering.filter.value}</output>
      <output data-testid="row-height">
        {controller.virtualization.virtualizerProps.layoutOptions?.rowHeight}
      </output>
      <button
        type="button"
        onClick={() => controller.selection.setSelectedKeys(new Set(['row-2']))}
      >
        Select Bob
      </button>
      <button type="button" onClick={() => controller.pagination.setPage(2)}>
        Next page
      </button>
      <button
        type="button"
        onClick={() => controller.filtering.setFilter({ schemaVersion: '1.0.0', value: 'alice' })}
      >
        Filter Alice
      </button>
    </React.Fragment>
  );
}

describe('Table controller plugins', () => {
  const { render, renderToString } = createRenderer();

  it('sorts client rows stably through React Aria table props', async () => {
    const { user } = await render(<SortableTableHarness />);

    const names = () =>
      screen
        .getAllByRole('row')
        .slice(1)
        .map((row) => row.textContent);
    expect(screen.getByRole('columnheader', { name: 'Name' }).getAttribute('aria-sort')).toBe(
      'ascending',
    );
    expect(names()).toEqual(['AliceEditor', 'AliceManager', 'BobDesigner']);

    await user.click(screen.getByRole('columnheader', { name: 'Name' }));
    expect(screen.getByRole('columnheader', { name: 'Name' }).getAttribute('aria-sort')).toBe(
      'descending',
    );
    expect(names()).toEqual(['BobDesigner', 'AliceEditor', 'AliceManager']);
  });

  it('keeps controlled sorting authoritative while reporting changes', async () => {
    const onSortChange = vi.fn();
    const { user } = await render(
      <ControllerHarness
        tableId="controlled"
        sortDescriptor={{ column: 'name', direction: 'ascending' }}
        onSortChange={onSortChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Sort rows' }));

    expect(screen.getByTestId('sort').textContent).toBe('name:ascending');
    expect(onSortChange).toHaveBeenCalledWith({
      column: 'name',
      direction: 'descending',
    });
  });

  it('supports an explicitly controlled empty descriptor', async () => {
    const onSortChange = vi.fn();
    const { user } = await render(
      <ControllerHarness
        tableId="controlled-empty"
        sortDescriptor={undefined}
        onSortChange={onSortChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Sort rows' }));

    expect(screen.getByTestId('sort').textContent).toBe('none');
    expect(onSortChange).toHaveBeenCalledOnce();
  });

  it('correlates server queries and rejects cancelled or accepted responses', async () => {
    const requests: TableControllerRequestContext[] = [];
    const queries: Array<{
      page: number;
      pageSize: number;
      filter: TableFilterExpression;
    }> = [];
    const committed: string[] = [];
    const { user } = await render(
      <ControllerHarness
        tableId="server"
        defaultSortDescriptor={{ column: 'name', direction: 'ascending' }}
        onQueryChange={(query, context) => {
          queries.push(query);
          requests.push(context);
        }}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Sort rows' }));
    expect(requests[0]?.requestId).toBe('server:1');
    expect(requests[0]?.isCurrent()).toBe(true);
    expect(queries[0]).toMatchObject({
      page: 1,
      pageSize: 25,
      filter: { schemaVersion: '1.0.0', value: '' },
    });

    await user.click(screen.getByRole('button', { name: 'Sort rows' }));
    expect(requests[0]?.signal.aborted).toBe(true);
    expect(requests[0]?.accept(() => committed.push('stale'))).toBe(false);
    expect(requests[1]?.requestId).toBe('server:2');
    expect(requests[1]?.accept(() => committed.push('current'))).toBe(true);
    expect(requests[1]?.isCurrent()).toBe(false);
    expect(requests[1]?.accept(() => committed.push('duplicate'))).toBe(false);
    expect(committed).toEqual(['current']);
  });

  it('aborts pending server work when the table unmounts', async () => {
    let request: TableControllerRequestContext | undefined;
    const view = await render(
      <ControllerHarness
        tableId="unmount"
        onQueryChange={(_, context) => {
          request = context;
        }}
      />,
    );

    await view.user.click(screen.getByRole('button', { name: 'Sort rows' }));
    expect(request?.signal.aborted).toBe(false);
    view.unmount();
    expect(request?.signal.aborted).toBe(true);
  });

  it('preserves default sorting across SSR and hydration', () => {
    const view = renderToString(
      <ControllerHarness
        tableId="ssr"
        defaultSortDescriptor={{ column: 'name', direction: 'ascending' }}
      />,
    );

    expect(screen.getByTestId('sort').textContent).toBe('name:ascending');
    const hydrated = view.hydrate();
    expect(screen.getByTestId('sort').textContent).toBe('name:ascending');
    hydrated.unmount();
  });

  it('requires a stable portable table identity', async () => {
    await expect(render(<ControllerHarness tableId="../people" />)).rejects.toThrow(
      /requires a stable tableId/,
    );
  });

  it('sorts without mutating rows and retains equal-value order', () => {
    const ascending: SortDescriptor = { column: 'name', direction: 'ascending' };
    const descending: SortDescriptor = { column: 'name', direction: 'descending' };

    expect(sortTableRows(rows, ascending, compareRows).map((row) => row.id)).toEqual([
      'row-2',
      'row-3',
      'row-1',
    ]);
    expect(sortTableRows(rows, descending, compareRows).map((row) => row.id)).toEqual([
      'row-1',
      'row-2',
      'row-3',
    ]);
    expect(rows.map((row) => row.id)).toEqual(['row-1', 'row-2', 'row-3']);
  });

  it('coordinates uncontrolled selection, pagination, filtering, and virtualization', async () => {
    const { user } = await render(<PluginHarness />);

    expect(screen.getByTestId('selection').textContent).toBe('selected');
    expect(screen.getByTestId('page').textContent).toBe('1');
    expect(screen.getByTestId('visible').textContent).toBe('row-1,row-2');
    expect(screen.getByTestId('row-height').textContent).toBe('44');

    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByTestId('page').textContent).toBe('2');
    expect(screen.getByTestId('visible').textContent).toBe('row-3');

    await user.click(screen.getByRole('button', { name: 'Filter Alice' }));
    expect(screen.getByTestId('filter').textContent).toBe('alice');
    expect(screen.getByTestId('page').textContent).toBe('1');
    expect(screen.getByTestId('visible').textContent).toBe('row-2,row-3');

    await user.click(screen.getByRole('button', { name: 'Select Bob' }));
    expect(screen.getByTestId('selection').textContent).toBe('not-selected');
  });

  it('keeps controlled pagination and filtering authoritative while reporting changes', async () => {
    const onPageChange = vi.fn();
    const onFilterChange = vi.fn();
    const { user } = await render(
      <PluginHarness
        tableId="controlled-plugins"
        page={1}
        pageSize={2}
        filter={{ schemaVersion: '1.0.0', value: '' }}
        onPageChange={onPageChange}
        onFilterChange={onFilterChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Next page' }));
    await user.click(screen.getByRole('button', { name: 'Filter Alice' }));
    expect(screen.getByTestId('page').textContent).toBe('1');
    expect(screen.getByTestId('filter').textContent).toBe('');
    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(onPageChange).toHaveBeenCalledWith(1);
    expect(onFilterChange).toHaveBeenCalledWith({
      schemaVersion: '1.0.0',
      value: 'alice',
    });
  });

  it('preserves plugin defaults across SSR and hydration', () => {
    const view = renderToString(<PluginHarness tableId="plugin-ssr" defaultPage={2} />);
    expect(screen.getByTestId('page').textContent).toBe('2');
    expect(screen.getByTestId('visible').textContent).toBe('row-3');
    const hydrated = view.hydrate();
    expect(screen.getByTestId('page').textContent).toBe('2');
    hydrated.unmount();
  });
});
