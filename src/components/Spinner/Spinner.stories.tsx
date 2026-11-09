import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spinner } from './Spinner'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Primitives/Spinner',
  component: Spinner,
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner className="size-3" />
      <Spinner />
      <Spinner className="size-6" />
      <Spinner className="size-8 text-muted-foreground" />
    </div>
  ),
}
