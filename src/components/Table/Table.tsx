'use client'

import { forwardRef, type HTMLAttributes, type TableHTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type TableProps = TableHTMLAttributes<HTMLTableElement>

/** Styled table markup (no sorting/filtering). Wrapped in a horizontally scrolling container. */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table({ className, ...props }, ref) {
  return (
    <div className="bom-table-container">
      <table ref={ref} className={cn('bom-table', className)} {...props} />
    </div>
  )
})

Table.displayName = 'Table'

type SectionProps = HTMLAttributes<HTMLTableSectionElement>

export type TableHeaderProps = SectionProps

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(function TableHeader(
  { className, ...props },
  ref,
) {
  return <thead ref={ref} className={cn('bom-table__header', className)} {...props} />
})

TableHeader.displayName = 'TableHeader'

export type TableBodyProps = SectionProps

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBody(
  { className, ...props },
  ref,
) {
  return <tbody ref={ref} className={cn('bom-table__body', className)} {...props} />
})

TableBody.displayName = 'TableBody'

export type TableFooterProps = SectionProps

export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(function TableFooter(
  { className, ...props },
  ref,
) {
  return <tfoot ref={ref} className={cn('bom-table__footer', className)} {...props} />
})

TableFooter.displayName = 'TableFooter'

export type TableRowProps = HTMLAttributes<HTMLTableRowElement>

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow({ className, ...props }, ref) {
  return <tr ref={ref} className={cn('bom-table__row', className)} {...props} />
})

TableRow.displayName = 'TableRow'

export type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement>

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  { className, ...props },
  ref,
) {
  return <th ref={ref} className={cn('bom-table__head', className)} {...props} />
})

TableHead.displayName = 'TableHead'

export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { className, ...props },
  ref,
) {
  return <td ref={ref} className={cn('bom-table__cell', className)} {...props} />
})

TableCell.displayName = 'TableCell'

export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>

export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(function TableCaption(
  { className, ...props },
  ref,
) {
  return <caption ref={ref} className={cn('bom-table__caption', className)} {...props} />
})

TableCaption.displayName = 'TableCaption'
