import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from './Label'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Form/Label',
  component: Label,
  args: { children: 'Email' },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
