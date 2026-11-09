import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback, AvatarImage } from './Avatar'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Primitives/Avatar',
  component: Avatar,
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <Avatar key={s} size={s}>
          <AvatarImage src="https://github.com/bomtawep.png" alt="bomtawep" />
          <AvatarFallback>BT</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
}

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>สม</AvatarFallback>
    </Avatar>
  ),
}
