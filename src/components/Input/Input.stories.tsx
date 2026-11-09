import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './Input'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Form/Input',
  component: Input,
  args: { placeholder: 'name@example.com', 'aria-label': 'Email' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: '0.75rem', maxWidth: 320 }}>
      <Input {...args} size="sm" />
      <Input {...args} />
      <Input {...args} size="lg" />
      <Input {...args} aria-invalid />
      <Input {...args} disabled />
      <Input aria-label="File" type="file" />
    </div>
  ),
}
