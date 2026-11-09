import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './Table'

function Demo() {
  return (
    <Table>
      <TableCaption>Invoices</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>No.</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>INV001</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

describe('Table', () => {
  it('renders a table named by its caption inside a scroll container', async () => {
    const { container } = render(<Demo />)
    const table = screen.getByRole('table', { name: 'Invoices' })
    expect(table.parentElement).toHaveAttribute('data-slot', 'table-container')
    expect(screen.getByRole('cell', { name: 'INV001' })).toHaveAttribute('data-slot', 'table-cell')
    await expectNoA11yViolations(container)
  })
})
