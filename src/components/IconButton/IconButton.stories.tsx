import type { Meta, StoryObj } from '@storybook/react-vite'
import { XIcon } from '../../lib/icons'
import { IconButton } from './IconButton'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Primitives/IconButton',
  component: IconButton,
  args: { 'aria-label': 'Close', children: <XIcon /> },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      {(['primary', 'secondary', 'ghost', 'danger'] as const).map((v) => (
        <IconButton key={v} {...args} variant={v} />
      ))}
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <IconButton key={s} {...args} variant="secondary" size={s} />
      ))}
    </div>
  ),
}
