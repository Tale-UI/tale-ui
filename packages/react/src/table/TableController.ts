import * as React from 'react';
import { useStableCallback } from '@tale-ui/utils/useStableCallback';
import type { Key, Selection, SortDescriptor, TableLayoutProps } from 'react-aria-components';
import type { RootProps } from './Table.styled';

export interface TableFilterExpression {
  schemaVersion: '1.0.0';
  value: string;
}

export interface TableControllerQuery {
  sortDescriptor?: SortDescriptor;
  selectedKeys: Selection;
  page: number;
  pageSize: number;
  filter: TableFilterExpression;
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
  /** Controlled React Aria row selection. */
  selectedKeys?: Selection;
  /** Initial selection when `selectedKeys` is uncontrolled. */
  defaultSelectedKeys?: Selection;
  onSelectionChange?: (selection: Selection) => void;
  /** Controlled one-based page. */
  page?: number;
  /** Initial one-based page when `page` is uncontrolled. */
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** Controlled rows per page. */
  pageSize?: number;
  /** Initial rows per page when `pageSize` is uncontrolled. */
  defaultPageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  /** Total server row count. Omit when the total is unknown. */
  totalRows?: number;
  /** Controlled, serializable filter expression. */
  filter?: TableFilterExpression;
  /** Initial expression when `filter` is uncontrolled. */
  defaultFilter?: TableFilterExpression;
  onFilterChange?: (filter: TableFilterExpression) => void;
  /** React Aria TableLayout options for the virtualization plugin. */
  virtualizationOptions?: TableLayoutProps;
  /**
   * Runs for every sorting, selection, pagination, or filtering query. Use the
   * request context to cancel work and reject stale server responses.
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

export interface TableSelectionController {
  selectedKeys: Selection;
  setSelectedKeys: (selection: Selection) => void;
  isSelected: (key: Key) => boolean;
}

export interface TablePaginationController {
  page: number;
  pageSize: number;
  pageCount?: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  paginateRows: <T>(rows: readonly T[]) => T[];
}

export interface TableFilteringController {
  filter: TableFilterExpression;
  setFilter: (filter: TableFilterExpression) => void;
  filterRows: <T>(
    rows: readonly T[],
    predicate: (row: T, filter: TableFilterExpression) => boolean,
  ) => T[];
}

export interface TableVirtualizationController {
  virtualizerProps: {
    layoutOptions?: TableLayoutProps;
  };
}

export interface TableController {
  tableProps: Pick<
    RootProps,
    'sortDescriptor' | 'onSortChange' | 'selectedKeys' | 'onSelectionChange'
  >;
  sorting: TableSortingController;
  selection: TableSelectionController;
  pagination: TablePaginationController;
  filtering: TableFilteringController;
  virtualization: TableVirtualizationController;
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

function assertPositiveInteger(name: string, value: number) {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(
      `Tale UI: Table controller ${name} must be a positive integer. ` +
        'Provide a supported pagination value and retry. ' +
        'See https://tale-ui.com/components/table.',
    );
  }
}

function assertFilter(filter: TableFilterExpression) {
  if (filter.schemaVersion !== '1.0.0' || typeof filter.value !== 'string') {
    throw new Error(
      'Tale UI: Table controller filters require schemaVersion 1.0.0 and a string value. ' +
        'See https://tale-ui.com/components/table.',
    );
  }
}

function copySelection(selection: Selection): Selection {
  return selection === 'all' ? 'all' : new Set(selection);
}

function useControlledModeGuard(name: string, controlled: boolean) {
  const initial = React.useRef(controlled);
  if (initial.current !== controlled) {
    throw new Error(
      `Tale UI: Table controller ${name} changed between controlled and uncontrolled state. ` +
        `Choose the controlled or default ${name} option for the mounted controller and keep ` +
        'that mode stable. See https://tale-ui.com/components/table.',
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
 * Coordinates the stable Table sorting, selection, pagination, filtering, and
 * virtualization plugins for client or server data while preserving React
 * Aria's accessibility semantics.
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
  const selectionControlled = Object.prototype.hasOwnProperty.call(options, 'selectedKeys');
  const pageControlled = Object.prototype.hasOwnProperty.call(options, 'page');
  const pageSizeControlled = Object.prototype.hasOwnProperty.call(options, 'pageSize');
  const filterControlled = Object.prototype.hasOwnProperty.call(options, 'filter');
  useControlledModeGuard('sorting', sortingControlled);
  useControlledModeGuard('selection', selectionControlled);
  useControlledModeGuard('page', pageControlled);
  useControlledModeGuard('pageSize', pageSizeControlled);
  useControlledModeGuard('filter', filterControlled);

  const [uncontrolledSort, setUncontrolledSort] = React.useState<SortDescriptor | undefined>(
    options.defaultSortDescriptor,
  );
  const sortDescriptor = sortingControlled ? options.sortDescriptor : uncontrolledSort;
  const [uncontrolledSelection, setUncontrolledSelection] = React.useState<Selection>(() =>
    copySelection(options.defaultSelectedKeys || new Set<Key>()),
  );
  const selectedKeys = copySelection(
    selectionControlled ? options.selectedKeys || new Set<Key>() : uncontrolledSelection,
  );
  const [uncontrolledPage, setUncontrolledPage] = React.useState(options.defaultPage || 1);
  const page = pageControlled ? options.page! : uncontrolledPage;
  const [uncontrolledPageSize, setUncontrolledPageSize] = React.useState(
    options.defaultPageSize || 25,
  );
  const pageSize = pageSizeControlled ? options.pageSize! : uncontrolledPageSize;
  const emptyFilter = React.useMemo<TableFilterExpression>(
    () => ({ schemaVersion: '1.0.0', value: '' }),
    [],
  );
  const [uncontrolledFilter, setUncontrolledFilter] = React.useState<TableFilterExpression>(
    () => options.defaultFilter || emptyFilter,
  );
  const filter = filterControlled ? options.filter || emptyFilter : uncontrolledFilter;
  assertPositiveInteger('page', page);
  assertPositiveInteger('pageSize', pageSize);
  if (
    options.totalRows !== undefined &&
    (!Number.isInteger(options.totalRows) || options.totalRows < 0)
  ) {
    throw new Error('Tale UI: Table controller totalRows must be a non-negative integer.');
  }
  assertFilter(filter);
  const onSortChange = useStableCallback(options.onSortChange);
  const onSelectionChange = useStableCallback(options.onSelectionChange);
  const onPageChange = useStableCallback(options.onPageChange);
  const onPageSizeChange = useStableCallback(options.onPageSizeChange);
  const onFilterChange = useStableCallback(options.onFilterChange);
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

  const publishQuery = useStableCallback((overrides: Partial<TableControllerQuery>) => {
    if (!onQueryChange) {
      return;
    }
    const query: TableControllerQuery = {
      ...(sortDescriptor ? { sortDescriptor } : {}),
      selectedKeys: copySelection(selectedKeys),
      page,
      pageSize,
      filter,
      ...overrides,
    };
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

  const handleSelectionChange = useStableCallback((nextSelection: Selection) => {
    const copied = copySelection(nextSelection);
    if (!selectionControlled) {
      setUncontrolledSelection(copied);
    }
    onSelectionChange?.(copied);
    publishQuery({ selectedKeys: copied });
  });

  const setPage = useStableCallback((nextPage: number) => {
    assertPositiveInteger('page', nextPage);
    const pageCount =
      options.totalRows === undefined
        ? undefined
        : Math.max(1, Math.ceil(options.totalRows / pageSize));
    const resolved = pageCount === undefined ? nextPage : Math.min(nextPage, pageCount);
    if (!pageControlled) {
      setUncontrolledPage(resolved);
    }
    onPageChange?.(resolved);
    publishQuery({ page: resolved });
  });

  const setPageSize = useStableCallback((nextPageSize: number) => {
    assertPositiveInteger('pageSize', nextPageSize);
    if (!pageSizeControlled) {
      setUncontrolledPageSize(nextPageSize);
    }
    if (!pageControlled) {
      setUncontrolledPage(1);
    }
    onPageSizeChange?.(nextPageSize);
    onPageChange?.(1);
    publishQuery({ page: 1, pageSize: nextPageSize });
  });

  const setFilter = useStableCallback((nextFilter: TableFilterExpression) => {
    assertFilter(nextFilter);
    if (!filterControlled) {
      setUncontrolledFilter(nextFilter);
    }
    if (!pageControlled) {
      setUncontrolledPage(1);
    }
    onFilterChange?.(nextFilter);
    onPageChange?.(1);
    publishQuery({ filter: nextFilter, page: 1 });
  });

  const sortRows = React.useCallback(
    <T>(rows: readonly T[], compare: (left: T, right: T, column: Key) => number) =>
      sortDescriptor ? sortTableRows(rows, sortDescriptor, compare) : [...rows],
    [sortDescriptor],
  );
  const filterRows = React.useCallback(
    <T>(rows: readonly T[], predicate: (row: T, expression: TableFilterExpression) => boolean) =>
      filter.value ? rows.filter((row) => predicate(row, filter)) : [...rows],
    [filter],
  );
  const paginateRows = React.useCallback(
    <T>(rows: readonly T[]) => rows.slice((page - 1) * pageSize, page * pageSize),
    [page, pageSize],
  );
  const pageCount =
    options.totalRows === undefined
      ? undefined
      : Math.max(1, Math.ceil(options.totalRows / pageSize));

  return {
    tableProps: {
      ...(sortDescriptor ? { sortDescriptor } : {}),
      onSortChange: handleSortChange,
      selectedKeys,
      onSelectionChange: handleSelectionChange,
    },
    sorting: {
      ...(sortDescriptor ? { sortDescriptor } : {}),
      sortRows,
    },
    selection: {
      selectedKeys,
      setSelectedKeys: handleSelectionChange,
      isSelected: (key) => selectedKeys === 'all' || selectedKeys.has(key),
    },
    pagination: {
      page,
      pageSize,
      ...(pageCount === undefined ? {} : { pageCount }),
      canPreviousPage: page > 1,
      canNextPage: pageCount === undefined || page < pageCount,
      setPage,
      setPageSize,
      paginateRows,
    },
    filtering: {
      filter,
      setFilter,
      filterRows,
    },
    virtualization: {
      virtualizerProps: {
        ...(options.virtualizationOptions ? { layoutOptions: options.virtualizationOptions } : {}),
      },
    },
    cancelPendingRequest,
  };
}
