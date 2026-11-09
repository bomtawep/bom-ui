import type { Meta, StoryObj } from '@storybook/react-vite'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from './InputOTP'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Form/InputOTP',
  component: InputOTP,
} satisfies Meta<typeof InputOTP>

export default meta
type Story = StoryObj<typeof meta>

export const SixDigits: Story = {
  args: { maxLength: 6, children: null },
  render: () => (
    <InputOTP maxLength={6} aria-label="รหัส OTP">
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
}
