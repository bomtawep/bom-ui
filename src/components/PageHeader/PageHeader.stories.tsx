import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { PageHeader } from './PageHeader'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'App/PageHeader',
  component: PageHeader,
  args: {
    title: 'ใบแจ้งหนี้',
    description: 'รายการใบแจ้งหนี้ทั้งหมดของบริษัท',
  },
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithActions: Story = {
  args: {
    actions: (
      <>
        <Button variant="secondary">ส่งออก</Button>
        <Button>สร้างใหม่</Button>
      </>
    ),
  },
}
