export * as Table from './Table.styled';

export type {
  RootProps as TableRootProps,
  HeaderProps as TableHeaderProps,
  ColumnProps as TableColumnProps,
  BodyProps as TableBodyProps,
  FooterProps as TableFooterProps,
  RowProps as TableRowProps,
  CellProps as TableCellProps,
} from './Table.styled';

export {
  sortTableRows,
  useTableController,
  type TableController,
  type TableControllerOptions,
  type TableControllerQuery,
  type TableControllerRequestContext,
  type TableSortingController,
} from './TableController';

export type { Selection, Key, SortDescriptor } from 'react-aria-components';
