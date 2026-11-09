import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge, type BadgeVariant } from './Badge'

const variants: BadgeVariant[] = ['primary', 'secondary', 'outline', 'info', 'success', 'warning', 'danger']

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Primitives/Badge',
  component: Badge,
  args: { children: 'Badge' },
  argTypes: { variant: { control: 'select', options: variants } },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {variants.map((v) => (
        <Badge key={v} variant={v}>
          {v}
        </Badge>
      ))}
    </div>
  ),
}
