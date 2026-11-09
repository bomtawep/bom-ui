import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, type ButtonSize, type ButtonVariant } from './Button'

const variants: ButtonVariant[] = ['primary', 'secondary', 'ghost', 'danger', 'sparkle']
const sizes: ButtonSize[] = ['sm', 'md', 'lg']

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Button' },
  argTypes: {
    variant: { control: 'inline-radio', options: variants },
    size: { control: 'inline-radio', options: sizes },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
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
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      {sizes.map((size) => (
        <Button key={size} {...args} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant} disabled>
          {variant}
        </Button>
      ))}
    </div>
  ),
}

export const Loading: Story = {
  args: { loading: true, children: 'Saving' },
}

export const AsChild: Story = {
  render: (args) => (
    <Button {...args} asChild variant="secondary">
      <a href="#docs">Read the docs</a>
    </Button>
  ),
}
