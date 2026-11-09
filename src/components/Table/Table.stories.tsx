import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../Badge'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './Table'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Data/Table',
  component: Table,
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

const rows = [
  ['INV001', 'ชำระแล้ว', '2,500.00'],
  ['INV002', 'รอชำระ', '1,200.00'],
  ['INV003', 'ยกเลิก', '350.00'],
]

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>รายการใบแจ้งหนี้ล่าสุด</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>เลขที่</TableHead>
          <TableHead>สถานะ</TableHead>
          <TableHead className="text-right">ยอดเงิน</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(([no, status, amount]) => (
          <TableRow key={no}>
            <TableCell className="font-medium">{no}</TableCell>
            <TableCell>
              <Badge variant={status === 'ยกเลิก' ? 'destructive' : status === 'รอชำระ' ? 'outline' : 'secondary'}>
                {status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">{amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>รวม</TableCell>
          <TableCell className="text-right">4,050.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}
