import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from './Switch'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Form/Switch',
  component: Switch,
  args: { 'aria-label': 'Notifications' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Switch {...args} />
      <Switch {...args} defaultChecked />
      <Switch {...args} size="sm" defaultChecked />
      <Switch {...args} disabled />
      <Switch {...args} aria-invalid />
    </div>
  ),
}
