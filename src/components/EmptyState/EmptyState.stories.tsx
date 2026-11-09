import type { Meta, StoryObj } from '@storybook/react-vite'
import { FileWarningIcon } from '../../lib/icons'
import { Button } from '../Button'
import { EmptyState } from './EmptyState'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'App/EmptyState',
  component: EmptyState,
  args: {
    icon: <FileWarningIcon />,
    title: 'ยังไม่มีเอกสาร',
    description: 'อัปโหลดเอกสารแรกเพื่อเริ่มต้นใช้งาน',
    action: <Button>อัปโหลด</Button>,
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const TitleOnly: Story = { args: { icon: undefined, description: undefined, action: undefined } }
