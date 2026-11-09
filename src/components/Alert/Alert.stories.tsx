import type { Meta, StoryObj } from '@storybook/react-vite'
import { AlertCircleIcon } from '../../lib/icons'
import { Button } from '../Button'
import { Alert, AlertAction, AlertDescription, AlertTitle, type AlertVariant } from './Alert'

const variants: AlertVariant[] = ['default', 'info', 'success', 'warning', 'danger']

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Data/Alert',
  component: Alert,
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '0.75rem', maxWidth: 560 }}>
      {variants.map((v) => (
        <Alert key={v} variant={v}>
          <AlertCircleIcon />
          <AlertTitle>{v}</AlertTitle>
          <AlertDescription>รายละเอียดของข้อความแจ้งเตือน</AlertDescription>
        </Alert>
      ))}
      <Alert variant="danger">
        <AlertCircleIcon />
        <AlertTitle>โหลดข้อมูลไม่สำเร็จ</AlertTitle>
        <AlertDescription>เซิร์ฟเวอร์ไม่ตอบสนอง</AlertDescription>
        <AlertAction>
          <Button size="sm" variant="secondary">
            ลองใหม่
          </Button>
        </AlertAction>
      </Alert>
    </div>
  ),
}
