import * as React from 'react';
import { screen } from '@tale-ui/monorepo-tests/test-utils';
import type { SortDescriptor } from 'react-aria-components';
import { createRenderer } from '#test-utils';
import {
  sortTableRows,
  useExperimentalTableController,
  type ExperimentalTableControllerOptions,
  type ExperimentalTableRequestContext,
} from './TableController.experimental';
import { Table } from './index';

function selectionLabel(selection: 'all' | Iterable<React.Key>) {
  return selection === 'all' ? 'all' : [...selection].join(',');
}

function Harness(props: ExperimentalTableControllerOptions) {
  const controller = useExperimentalTableController(props);
  return (
    <React.Fragment>
      <output data-testid="selection">{selectionLabel(controller.tableProps.selectedKeys!)}</output>
      <output data-testid="sort">
        {controller.tableProps.sortDescriptor
          ? `${controller.tableProps.sortDescriptor.column}:${controller.tableProps.sortDescriptor.direction}`
          : 'none'}
      </output>
      <button
        type="button"
        onClick={() => controller.tableProps.onSelectionChange!(new Set(['row-2']))}
      >
        Select row
      </button>
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

function AccessibleTableHarness() {
  const controller = useExperimentalTableController({
    tableId: 'accessible-people',
    defaultSelectedKeys: new Set(['row-1']),
    defaultSortDescriptor: { column: 'name', direction: 'ascending' },
  });
  return (
    <Table.Root {...controller.tableProps} aria-label="People" selectionMode="multiple">
      <Table.Header>
        <Table.Column id="name" isRowHeader allowsSorting>
          Name
        </Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row id="row-1">
          <Table.Cell>Alice</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}

describe('experimental Table controller', () => {
  const { render, renderToString } = createRenderer();

  it('composes uncontrolled selection and sorting into one query stream', async () => {
    const requests: ExperimentalTableRequestContext[] = [];
    const { user } = await render(
      <Harness
        tableId="people"
        defaultSelectedKeys={new Set(['row-1'])}
        defaultSortDescriptor={{ column: 'name', direction: 'ascending' }}
        onQueryChange={(_, context) => requests.push(context)}
      />,
    );

    expect(screen.getByTestId('selection').textContent).toBe('row-1');
    expect(screen.getByTestId('sort').textContent).toBe('name:ascending');

    await user.click(screen.getByRole('button', { name: 'Select row' }));
    expect(screen.getByTestId('selection').textContent).toBe('row-2');
    expect(requests[0]?.requestId).toBe('people:1');

    await user.click(screen.getByRole('button', { name: 'Sort rows' }));
    expect(screen.getByTestId('sort').textContent).toBe('name:descending');
    expect(requests[0]?.signal.aborted).toBe(true);
    expect(requests[0]?.isCurrent()).toBe(false);
    expect(requests[1]?.requestId).toBe('people:2');
    expect(requests[1]?.isCurrent()).toBe(true);

    const committed: string[] = [];
    expect(requests[0]?.accept(() => committed.push('stale'))).toBe(false);
    expect(requests[1]?.accept(() => committed.push('current'))).toBe(true);
    expect(committed).toEqual(['current']);
  });

  it('preserves controlled values while reporting requested changes', async () => {
    const onSelectionChange = vi.fn();
    const onSortChange = vi.fn();
    const { user } = await render(
      <Harness
        tableId="controlled"
        selectedKeys={new Set(['row-1'])}
        sortDescriptor={{ column: 'name', direction: 'ascending' }}
        onSelectionChange={onSelectionChange}
        onSortChange={onSortChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Select row' }));
    await user.click(screen.getByRole('button', { name: 'Sort rows' }));

    expect(screen.getByTestId('selection').textContent).toBe('row-1');
    expect(screen.getByTestId('sort').textContent).toBe('name:ascending');
    expect(onSelectionChange).toHaveBeenCalledWith(new Set(['row-2']));
    expect(onSortChange).toHaveBeenCalledWith({
      column: 'name',
      direction: 'descending',
    });
  });

  it('aborts pending work when the table unmounts', async () => {
    let request: ExperimentalTableRequestContext | undefined;
    const view = await render(
      <Harness
        tableId="unmount"
        onQueryChange={(_, context) => {
          request = context;
        }}
      />,
    );

    await view.user.click(screen.getByRole('button', { name: 'Select row' }));
    expect(request?.signal.aborted).toBe(false);
    view.unmount();
    expect(request?.signal.aborted).toBe(true);
  });

  it('requires a portable stable table identity', async () => {
    await expect(render(<Harness tableId="../people" />)).rejects.toThrow(
      /requires a stable tableId/,
    );
  });

  it('preserves deterministic default state across SSR and hydration', () => {
    const view = renderToString(
      <Harness
        tableId="ssr-people"
        defaultSelectedKeys={new Set(['row-1'])}
        defaultSortDescriptor={{ column: 'name', direction: 'ascending' }}
      />,
    );

    expect(screen.getByTestId('selection').textContent).toBe('row-1');
    expect(screen.getByTestId('sort').textContent).toBe('name:ascending');
    const hydrated = view.hydrate();
    expect(screen.getByTestId('selection').textContent).toBe('row-1');
    expect(screen.getByTestId('sort').textContent).toBe('name:ascending');
    hydrated.unmount();
  });

  it('passes selection and sorting through React Aria table semantics', async () => {
    await render(<AccessibleTableHarness />);

    expect(screen.getByRole('grid', { name: 'People' })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: 'Name' }).getAttribute('aria-sort')).toBe(
      'ascending',
    );
    expect(screen.getByRole('row', { name: 'Alice' }).getAttribute('aria-selected')).toBe('true');
  });

  it('sorts locally in a stable order in either direction', () => {
    const rows = [
      { id: 'a', score: 2 },
      { id: 'b', score: 1 },
      { id: 'c', score: 2 },
    ];
    const compare = (left: (typeof rows)[number], right: (typeof rows)[number]) =>
      left.score - right.score;
    const ascending: SortDescriptor = { column: 'score', direction: 'ascending' };
    const descending: SortDescriptor = { column: 'score', direction: 'descending' };

    expect(sortTableRows(rows, ascending, compare).map((row) => row.id)).toEqual(['b', 'a', 'c']);
    expect(sortTableRows(rows, descending, compare).map((row) => row.id)).toEqual(['a', 'c', 'b']);
    expect(rows.map((row) => row.id)).toEqual(['a', 'b', 'c']);
  });
});
