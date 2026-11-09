import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spinner } from './Spinner'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Primitives/Spinner',
  component: Spinner,
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
}
