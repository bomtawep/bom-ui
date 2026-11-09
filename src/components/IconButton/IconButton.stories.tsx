import type { Meta, StoryObj } from '@storybook/react-vite'
import { XIcon } from 'lucide-react'
import { IconButton } from './IconButton'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Primitives/IconButton',
  component: IconButton,
  args: { 'aria-label': 'ปิด', children: <XIcon /> },
  argTypes: {
    variant: { control: 'select', options: ['default', 'outline', 'secondary', 'ghost', 'destructive'] },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'default', 'lg'] },
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      {(['default', 'outline', 'secondary', 'ghost', 'destructive'] as const).map((v) => (
        <IconButton key={v} {...args} variant={v} />
      ))}
      {(['xs', 'sm', 'default', 'lg'] as const).map((s) => (
        <IconButton key={s} {...args} variant="outline" size={s} />
      ))}
    </div>
  ),
}
