import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './Table'

function Demo() {
  return (
    <Table className="extra">
      <TableCaption>Invoices</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>No.</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow data-state="selected">
          <TableCell>INV001</TableCell>
          <TableCell>250</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>250</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

describe('Table', () => {
  it('renders a table named by its caption inside a scroll container', () => {
    render(<Demo />)
    const table = screen.getByRole('table', { name: 'Invoices' })
    expect(table).toHaveClass('bom-table', 'extra')
    expect(table.parentElement).toHaveClass('bom-table-container')
    expect(screen.getByRole('columnheader', { name: 'Amount' })).toHaveClass('bom-table__head')
    expect(screen.getByRole('cell', { name: 'INV001' })).toHaveClass('bom-table__cell')
  })

  it('forwards refs to the right elements', () => {
    const t = createRef<HTMLTableElement>()
    const row = createRef<HTMLTableRowElement>()
    const cell = createRef<HTMLTableCellElement>()
    render(
      <Table ref={t}>
        <TableBody>
          <TableRow ref={row}>
            <TableCell ref={cell}>x</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )
    expect(t.current).toBeInstanceOf(HTMLTableElement)
    expect(row.current).toBeInstanceOf(HTMLTableRowElement)
    expect(cell.current).toBeInstanceOf(HTMLTableCellElement)
  })

  it('has displayNames', () => {
    for (const C of [Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption]) {
      expect(C.displayName).toMatch(/^Table/)
    }
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Demo />)
    await expectNoA11yViolations(container)
  })
})
