import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from './Textarea'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Form/Textarea',
  component: Textarea,
  args: { placeholder: 'พิมพ์ข้อความ', 'aria-label': 'Message' },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Invalid: Story = { args: { 'aria-invalid': true } }
export const Disabled: Story = { args: { disabled: true } }
