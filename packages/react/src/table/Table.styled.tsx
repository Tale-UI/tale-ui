import * as React from 'react';
import {
  Table as AriaTable,
  TableHeader as AriaTableHeader,
  Column as AriaColumn,
  TableBody as AriaTableBody,
  TableFooter as AriaTableFooter,
  Row as AriaRow,
  Cell as AriaCell,
  TableLayout,
  Virtualizer as AriaVirtualizer,
  type TableProps as AriaTableProps,
  type TableHeaderProps as AriaTableHeaderProps,
  type ColumnProps as AriaColumnProps,
  type TableBodyProps as AriaTableBodyProps,
  type TableFooterProps as AriaTableFooterProps,
  type RowProps as AriaRowProps,
  type CellProps as AriaCellProps,
  type TableLayoutProps,
  type VirtualizerProps as AriaVirtualizerProps,
} from 'react-aria-components';
import { cx } from '../_cx';

// ── Root ───────────────────────────────────────────────────────────────────

export type RootProps = Omit<AriaTableProps, 'className'> & {
  className?: string;
};

/**
 * A data table with sortable columns and selectable rows.
 *
 * @example
 * ```tsx
 * import { Table } from '@tale-ui/react/table';
 *
 * <Table.Root aria-label="People">
 *   <Table.Header>
 *     <Table.Column isRowHeader>Name</Table.Column>
 *     <Table.Column>Email</Table.Column>
 *   </Table.Header>
 *   <Table.Body>
 *     <Table.Row id="1">
 *       <Table.Cell>Alice</Table.Cell>
 *       <Table.Cell>alice@example.com</Table.Cell>
 *     </Table.Row>
 *   </Table.Body>
 * </Table.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLTableElement, RootProps>(
  ({ className, ...props }, ref) => (
    <AriaTable ref={ref} className={cx('tale-table', className)} {...props} />
  ),
);
Root.displayName = 'Table.Root';

// ── Virtualizer ────────────────────────────────────────────────────────────

export type VirtualizerProps = Omit<AriaVirtualizerProps<TableLayoutProps>, 'layout'>;

/**
 * Virtualizes a large `Table.Root` collection with React Aria's table-aware
 * layout while retaining row, cell, focus, and selection semantics.
 *
 * Keep stable row IDs and provide either `rowHeight` or `estimatedRowHeight`.
 */
export function Virtualizer(props: VirtualizerProps) {
  return <AriaVirtualizer {...props} layout={TableLayout} />;
}

Virtualizer.displayName = 'Table.Virtualizer';

// ── Header ─────────────────────────────────────────────────────────────────

export type HeaderProps<T extends object> = Omit<AriaTableHeaderProps<T>, 'className'> & {
  className?: string;
};

export const Header: <T extends object>(
  props: HeaderProps<T> & React.RefAttributes<HTMLTableSectionElement>,
) => React.ReactElement | null = React.forwardRef(
  ({ className, ...props }: HeaderProps<object>, ref) => (
    <AriaTableHeader
      ref={ref as React.Ref<HTMLTableSectionElement>}
      className={cx('tale-table__header', className)}
      {...props}
    />
  ),
) as any;
(Header as any).displayName = 'Table.Header';

// ── Column ─────────────────────────────────────────────────────────────────

export type ColumnProps = Omit<AriaColumnProps, 'className'> & {
  className?: string;
};

export const Column = React.forwardRef<HTMLTableCellElement, ColumnProps>(
  ({ className, ...props }, ref) => (
    <AriaColumn ref={ref} className={cx('tale-table__column', className)} {...props} />
  ),
);
Column.displayName = 'Table.Column';

// ── Body ───────────────────────────────────────────────────────────────────

export type BodyProps<T extends object> = Omit<AriaTableBodyProps<T>, 'className'> & {
  className?: string;
};

export const Body: <T extends object>(
  props: BodyProps<T> & React.RefAttributes<HTMLTableSectionElement>,
) => React.ReactElement | null = React.forwardRef(
  ({ className, ...props }: BodyProps<object>, ref) => (
    <AriaTableBody
      ref={ref as React.Ref<HTMLTableSectionElement>}
      className={cx('tale-table__body', className)}
      {...props}
    />
  ),
) as any;
(Body as any).displayName = 'Table.Body';

// ── Footer ─────────────────────────────────────────────────────────────────

export type FooterProps<T extends object> = Omit<AriaTableFooterProps<T>, 'className'> & {
  className?: string;
};

/**
 * Footer section for totals/summary rows. Renders a `<tfoot>`.
 * Place after `Table.Body`.
 */
export const Footer: <T extends object>(
  props: FooterProps<T> & React.RefAttributes<HTMLTableSectionElement>,
) => React.ReactElement | null = React.forwardRef(
  ({ className, ...props }: FooterProps<object>, ref) => (
    <AriaTableFooter
      ref={ref as React.Ref<HTMLTableSectionElement>}
      className={cx('tale-table__footer', className)}
      {...props}
    />
  ),
) as any;
(Footer as any).displayName = 'Table.Footer';

// ── Row ────────────────────────────────────────────────────────────────────

export type RowProps<T extends object> = Omit<AriaRowProps<T>, 'className'> & {
  className?: string;
};

export const Row: <T extends object>(
  props: RowProps<T> & React.RefAttributes<HTMLTableRowElement>,
) => React.ReactElement | null = React.forwardRef(
  ({ className, ...props }: RowProps<object>, ref) => (
    <AriaRow
      ref={ref as React.Ref<HTMLTableRowElement>}
      className={cx('tale-table__row', className)}
      {...props}
    />
  ),
) as any;
(Row as any).displayName = 'Table.Row';

// ── Cell ───────────────────────────────────────────────────────────────────

export type CellProps = Omit<AriaCellProps, 'className'> & {
  className?: string;
};

export const Cell = React.forwardRef<HTMLTableCellElement, CellProps>(
  ({ className, ...props }, ref) => (
    <AriaCell ref={ref} className={cx('tale-table__cell', className)} {...props} />
  ),
);
Cell.displayName = 'Table.Cell';
