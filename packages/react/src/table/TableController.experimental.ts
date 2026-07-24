import * as React from 'react';
import { useStableCallback } from '@tale-ui/utils/useStableCallback';
import type { Key, Selection, SortDescriptor } from 'react-aria-components';
import type { RootProps } from './Table.styled';

export interface ExperimentalTableQuery {
  selectedKeys: Selection;
  sortDescriptor?: SortDescriptor;
}

export interface ExperimentalTableRequestContext {
  tableId: string;
  requestId: string;
  revision: number;
  signal: AbortSignal;
  isCurrent: () => boolean;
  accept: (commit: () => void) => boolean;
}

export interface ExperimentalTableControllerOptions {
  /**
   * Stable identity for request correlation. It must be identical between the
   * server render and hydration and must not change for the mounted instance.
   */
  tableId: string;
  selectedKeys?: Selection;
  defaultSelectedKeys?: Selection;
  onSelectionChange?: (selection: Selection) => void;
  sortDescriptor?: SortDescriptor;
  defaultSortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
  onQueryChange?: (query: ExperimentalTableQuery, context: ExperimentalTableRequestContext) => void;
}

export interface ExperimentalTableController {
  tableProps: Pick<
    RootProps,
    'selectedKeys' | 'onSelectionChange' | 'sortDescriptor' | 'onSortChange'
  >;
  cancelPendingRequest: () => void;
}

function copySelection(selection: Selection | undefined): Selection {
  if (!selection) {
    return new Set<Key>();
  }
  return selection === 'all' ? 'all' : new Set(selection);
}

function assertStableTableId(tableId: string) {
  if (!/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(tableId)) {
    throw new Error(
      'Tale UI: the experimental Table controller requires a stable tableId for request ' +
        'correlation and hydration. Provide a non-empty portable identifier and retry.',
    );
  }
}

/**
 * Private P0-D prototype for composing Table selection and sorting state.
 *
 * This hook is intentionally not exported from `@tale-ui/react/table`. It
 * validates the shared controller contract before any plugin API is proposed.
 */
export function useExperimentalTableController(
  options: ExperimentalTableControllerOptions,
): ExperimentalTableController {
  assertStableTableId(options.tableId);
  const initialTableId = React.useRef(options.tableId);
  if (initialTableId.current !== options.tableId) {
    throw new Error(
      'Tale UI: the experimental Table controller tableId changed after mount, so pending ' +
        'requests can no longer be correlated. Remount with a new key and retry.',
    );
  }

  const selectionControlled = options.selectedKeys !== undefined;
  const sortingControlled = options.sortDescriptor !== undefined;
  const [uncontrolledSelection, setUncontrolledSelection] = React.useState<Selection>(() =>
    copySelection(options.defaultSelectedKeys),
  );
  const [uncontrolledSort, setUncontrolledSort] = React.useState<SortDescriptor | undefined>(
    options.defaultSortDescriptor,
  );
  const selectedKeys = selectionControlled
    ? copySelection(options.selectedKeys)
    : uncontrolledSelection;
  const sortDescriptor = sortingControlled ? options.sortDescriptor : uncontrolledSort;
  const onSelectionChange = useStableCallback(options.onSelectionChange);
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

  const publishQuery = useStableCallback((query: ExperimentalTableQuery) => {
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
        commit();
        return true;
      },
    });
  });

  const handleSelectionChange = useStableCallback((nextSelection: Selection) => {
    const copied = copySelection(nextSelection);
    if (!selectionControlled) {
      setUncontrolledSelection(copied);
    }
    onSelectionChange?.(copied);
    publishQuery({
      selectedKeys: copied,
      ...(sortDescriptor ? { sortDescriptor } : {}),
    });
  });

  const handleSortChange = useStableCallback((nextSort: SortDescriptor) => {
    if (!sortingControlled) {
      setUncontrolledSort(nextSort);
    }
    onSortChange?.(nextSort);
    publishQuery({
      selectedKeys: copySelection(selectedKeys),
      sortDescriptor: nextSort,
    });
  });

  return {
    tableProps: {
      selectedKeys,
      onSelectionChange: handleSelectionChange,
      ...(sortDescriptor ? { sortDescriptor } : {}),
      onSortChange: handleSortChange,
    },
    cancelPendingRequest,
  };
}

/**
 * Stable local-sort prototype. Equal comparisons retain source order.
 * Server-backed tables use the same descriptor but perform work in
 * `onQueryChange` instead.
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
