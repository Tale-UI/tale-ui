import * as React from 'react';
import { useStableCallback } from '@tale-ui/utils/useStableCallback';
import type { Key, SortDescriptor } from 'react-aria-components';
import type { RootProps } from './Table.styled';

export interface TableControllerQuery {
  sortDescriptor: SortDescriptor;
}

export interface TableControllerRequestContext {
  /**
   * Stable identity supplied to `useTableController`.
   */
  tableId: string;
  /**
   * Monotonic request identity scoped to the table as `<tableId>:<revision>`.
   */
  requestId: string;
  revision: number;
  /**
   * Aborted when a newer query starts, the consumer cancels, or the table unmounts.
   */
  signal: AbortSignal;
  isCurrent: () => boolean;
  /**
   * Commits a result only while this request is current. Returns `false` for
   * cancelled, stale, or previously accepted requests.
   */
  accept: (commit: () => void) => boolean;
}

export interface TableControllerOptions {
  /**
   * Portable identity used for server request correlation. Keep this value
   * identical across SSR/hydration and immutable for the mounted controller.
   */
  tableId: string;
  /**
   * Controlled React Aria sorting state.
   */
  sortDescriptor?: SortDescriptor;
  /**
   * Initial sorting state when `sortDescriptor` is uncontrolled.
   */
  defaultSortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
  /**
   * Runs for every sorting query. Use the request context to cancel work and
   * reject stale server responses.
   */
  onQueryChange?: (query: TableControllerQuery, context: TableControllerRequestContext) => void;
}

export interface TableSortingController {
  sortDescriptor?: SortDescriptor;
  /**
   * Returns a new stably sorted array using the current descriptor. When no
   * descriptor exists, it returns a shallow copy in source order.
   */
  sortRows: <T>(rows: readonly T[], compare: (left: T, right: T, column: Key) => number) => T[];
}

export interface TableController {
  tableProps: Pick<RootProps, 'sortDescriptor' | 'onSortChange'>;
  sorting: TableSortingController;
  cancelPendingRequest: () => void;
}

function assertStableTableId(tableId: string) {
  if (!/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(tableId)) {
    throw new Error(
      'Tale UI: Table controller requires a stable tableId for request correlation and ' +
        'hydration. Provide a non-empty portable identifier and retry. ' +
        'See https://tale-ui.com/components/table.',
    );
  }
}

/**
 * Stably sorts rows without mutating the source array.
 */
export function sortTableRows<T>(
  rows: readonly T[],
  descriptor: SortDescriptor,
  compare: (left: T, right: T, column: Key) => number,
): T[] {
  const direction = descriptor.direction === 'descending' ? -1 : 1;
  return rows
    .map((row, index) => ({ row, index }))
    .sort(
      (left, right) =>
        direction * compare(left.row, right.row, descriptor.column) || left.index - right.index,
    )
    .map(({ row }) => row);
}

/**
 * Coordinates Table sorting for client or server data while preserving React
 * Aria's accessible sorting semantics.
 *
 * Existing direct `sortDescriptor` and `onSortChange` props remain supported.
 * Use this controller when sorting must also coordinate local rows or
 * cancellable server requests.
 *
 * @example
 * ```tsx
 * import { Table, useTableController } from '@tale-ui/react/table';
 *
 * const controller = useTableController({
 *   tableId: 'people',
 *   defaultSortDescriptor: { column: 'name', direction: 'ascending' },
 * });
 * const rows = controller.sorting.sortRows(people, (left, right, column) => {
 *   if (column === 'role') return left.role.localeCompare(right.role);
 *   return left.name.localeCompare(right.name);
 * });
 *
 * <Table.Root {...controller.tableProps} aria-label="People">
 *   ...
 * </Table.Root>
 * ```
 */
export function useTableController(options: TableControllerOptions): TableController {
  assertStableTableId(options.tableId);
  const initialTableId = React.useRef(options.tableId);
  if (initialTableId.current !== options.tableId) {
    throw new Error(
      'Tale UI: Table controller tableId changed after mount, so pending requests can no ' +
        'longer be correlated. Remount with a new key and retry. ' +
        'See https://tale-ui.com/components/table.',
    );
  }

  const sortingControlled = Object.prototype.hasOwnProperty.call(options, 'sortDescriptor');
  const initialSortingControlled = React.useRef(sortingControlled);
  if (initialSortingControlled.current !== sortingControlled) {
    throw new Error(
      'Tale UI: Table controller sorting changed between controlled and uncontrolled state. ' +
        'Choose sortDescriptor or defaultSortDescriptor for the mounted controller and keep ' +
        'that mode stable. See https://tale-ui.com/components/table.',
    );
  }

  const [uncontrolledSort, setUncontrolledSort] = React.useState<SortDescriptor | undefined>(
    options.defaultSortDescriptor,
  );
  const sortDescriptor = sortingControlled ? options.sortDescriptor : uncontrolledSort;
  const onSortChange = useStableCallback(options.onSortChange);
  const onQueryChange = useStableCallback(options.onQueryChange);
  const sequence = React.useRef(0);
  const activeRequest = React.useRef<
    | {
        requestId: string;
        controller: AbortController;
      }
    | undefined
  >(undefined);

  const cancelPendingRequest = useStableCallback(() => {
    activeRequest.current?.controller.abort();
    activeRequest.current = undefined;
  });

  React.useEffect(() => cancelPendingRequest, [cancelPendingRequest]);

  const publishQuery = useStableCallback((query: TableControllerQuery) => {
    if (!onQueryChange) {
      return;
    }
    cancelPendingRequest();
    sequence.current += 1;
    const revision = sequence.current;
    const requestId = `${options.tableId}:${revision}`;
    const controller = new AbortController();
    activeRequest.current = { requestId, controller };
    const isCurrent = () =>
      activeRequest.current?.requestId === requestId && !controller.signal.aborted;
    onQueryChange(query, {
      tableId: options.tableId,
      requestId,
      revision,
      signal: controller.signal,
      isCurrent,
      accept(commit) {
        if (!isCurrent()) {
          return false;
        }
        try {
          commit();
        } finally {
          if (activeRequest.current?.requestId === requestId) {
            activeRequest.current = undefined;
          }
        }
        return true;
      },
    });
  });

  const handleSortChange = useStableCallback((nextSort: SortDescriptor) => {
    if (!sortingControlled) {
      setUncontrolledSort(nextSort);
    }
    onSortChange?.(nextSort);
    publishQuery({ sortDescriptor: nextSort });
  });

  const sortRows = React.useCallback(
    <T>(rows: readonly T[], compare: (left: T, right: T, column: Key) => number) =>
      sortDescriptor ? sortTableRows(rows, sortDescriptor, compare) : [...rows],
    [sortDescriptor],
  );

  return {
    tableProps: {
      ...(sortDescriptor ? { sortDescriptor } : {}),
      onSortChange: handleSortChange,
    },
    sorting: {
      ...(sortDescriptor ? { sortDescriptor } : {}),
      sortRows,
    },
    cancelPendingRequest,
  };
}
