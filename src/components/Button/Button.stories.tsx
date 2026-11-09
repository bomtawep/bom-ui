import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArrowRightIcon, PlusIcon } from 'lucide-react'
import { Button } from './Button'

const variants = ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link', 'sparkle'] as const
const sizes = ['xs', 'sm', 'default', 'lg'] as const

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Primitives/Button',
  component: Button,
  args: { children: 'Button' },
  argTypes: {
    variant: { control: 'select', options: variants },
    size: { control: 'select', options: [...sizes, 'icon', 'icon-xs', 'icon-sm', 'icon-lg'] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      {sizes.map((size) => (
        <Button key={size} {...args} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button>
        <PlusIcon data-icon="inline-start" /> สร้างใหม่
      </Button>
      <Button variant="outline">
        ถัดไป <ArrowRightIcon data-icon="inline-end" />
      </Button>
    </div>
  ),
}

export const Loading: Story = { args: { loading: true, children: 'กำลังบันทึก' } }

export const AsChild: Story = {
  render: () => (
    <Button asChild variant="outline">
      <a href="#docs">Read the docs</a>
    </Button>
  ),
}
