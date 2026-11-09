import type { Meta, StoryObj } from '@storybook/react-vite'
import { Separator } from './Separator'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Primitives/Separator',
  component: Separator,
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <p>Above</p>
      <Separator />
      <p>Below</p>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', height: 24, alignItems: 'center' }}>
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>Blog</span>
    </div>
  ),
}
