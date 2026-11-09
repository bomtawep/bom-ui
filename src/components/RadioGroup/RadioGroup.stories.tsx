import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from '../Label'
import { RadioGroup, RadioGroupItem } from './RadioGroup'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Form/RadioGroup',
  component: RadioGroup,
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

const options = [
  ['basic', 'Basic'],
  ['pro', 'Pro'],
  ['team', 'Team (disabled)'],
] as const

export const Vertical: Story = {
  render: (args) => (
    <RadioGroup aria-label="Plan" defaultValue="basic" {...args}>
      {options.map(([v, l]) => (
        <div key={v} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <RadioGroupItem id={`r-${v}`} value={v} disabled={v === 'team'} />
          <Label htmlFor={`r-${v}`}>{l}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
}

export const Horizontal: Story = { ...Vertical, args: { orientation: 'horizontal' } }
