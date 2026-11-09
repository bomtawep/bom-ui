import type { Meta, StoryObj } from '@storybook/react-vite'
import { CircleAlertIcon, InfoIcon } from 'lucide-react'
import { Button } from '../Button'
import { Alert, AlertAction, AlertDescription, AlertTitle } from './Alert'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Data/Alert',
  component: Alert,
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: () => (
    <div className="grid max-w-xl gap-3">
      <Alert>
        <InfoIcon />
        <AlertTitle>อัปเดตระบบ</AlertTitle>
        <AlertDescription>ระบบจะปิดปรับปรุงคืนนี้ 22:00 น.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <CircleAlertIcon />
        <AlertTitle>โหลดข้อมูลไม่สำเร็จ</AlertTitle>
        <AlertDescription>เซิร์ฟเวอร์ไม่ตอบสนอง</AlertDescription>
        <AlertAction>
          <Button size="sm" variant="outline">
            ลองใหม่
          </Button>
        </AlertAction>
      </Alert>
    </div>
  ),
}
