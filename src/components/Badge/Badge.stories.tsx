import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'

const variants = ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as const

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
    <div className="flex flex-wrap gap-2">
      {variants.map((v) => (
        <Badge key={v} variant={v}>
          {v}
        </Badge>
      ))}
    </div>
  ),
}
