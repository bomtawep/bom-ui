import type { Meta, StoryObj } from '@storybook/react-vite'
import { FolderOpenIcon } from 'lucide-react'
import { Button } from '../Button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from './Empty'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'App/Empty',
  component: Empty,
} satisfies Meta<typeof Empty>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderOpenIcon />
        </EmptyMedia>
        <EmptyTitle>ยังไม่มีเอกสาร</EmptyTitle>
        <EmptyDescription>อัปโหลดเอกสารแรกเพื่อเริ่มต้นใช้งาน</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>อัปโหลด</Button>
      </EmptyContent>
    </Empty>
  ),
}
