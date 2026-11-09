import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Primitives/Card',
  component: Card,
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Full: Story = {
  render: (args) => (
    <Card {...args} style={{ maxWidth: 380 }}>
      <CardHeader>
        <CardTitle>ใบแจ้งหนี้ #1024</CardTitle>
        <CardDescription>ครบกำหนด 30 พ.ย. 2569</CardDescription>
        <CardAction>
          <Button size="sm" variant="ghost">
            แก้ไข
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>ยอดรวม 12,500 บาท</CardContent>
      <CardFooter>
        <Button size="sm">ชำระเงิน</Button>
      </CardFooter>
    </Card>
  ),
}

export const Small: Story = { ...Full, args: { size: 'sm' } }
