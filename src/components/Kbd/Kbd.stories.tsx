import type { Meta, StoryObj } from '@storybook/react-vite'
import { Kbd, KbdGroup } from './Kbd'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Primitives/Kbd',
  component: Kbd,
  args: { children: 'Esc' },
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Group: Story = {
  render: () => (
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>B</Kbd>
    </KbdGroup>
  ),
}
