import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Toaster, toast } from './index'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Overlay/Toaster',
  component: Toaster,
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Toaster />
      <Button variant="secondary" onClick={() => toast('บันทึกแล้ว', { description: 'แก้ไขล่าสุด 10:24 น.' })}>
        default
      </Button>
      <Button variant="secondary" onClick={() => toast.success('ส่งเอกสารสำเร็จ')}>
        success
      </Button>
      <Button variant="secondary" onClick={() => toast.info('มีเวอร์ชันใหม่')}>
        info
      </Button>
      <Button variant="secondary" onClick={() => toast.warning('ใกล้หมดเวลา')}>
        warning
      </Button>
      <Button variant="secondary" onClick={() => toast.error('เชื่อมต่อไม่สำเร็จ')}>
        error
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast('ลบรายการแล้ว', { action: { label: 'เลิกทำ', onClick: () => toast('กู้คืนแล้ว') } })}
      >
        with action
      </Button>
    </div>
  ),
}
