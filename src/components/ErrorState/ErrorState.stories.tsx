import type { Meta, StoryObj } from '@storybook/react-vite'
import { ErrorState } from './ErrorState'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'App/ErrorState',
  component: ErrorState,
  args: { message: 'เซิร์ฟเวอร์ไม่ตอบสนอง (503)', onRetry: () => {} },
} satisfies Meta<typeof ErrorState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const NoRetry: Story = { args: { onRetry: undefined } }
