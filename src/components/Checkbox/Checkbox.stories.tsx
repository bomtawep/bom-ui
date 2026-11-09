import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from '../Label'
import { Checkbox } from './Checkbox'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Form/Checkbox',
  component: Checkbox,
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      {[
        ['c1', 'Unchecked', {}],
        ['c2', 'Checked', { defaultChecked: true }],
        ['c3', 'Indeterminate', { checked: 'indeterminate' as const }],
        ['c4', 'Invalid', { 'aria-invalid': true }],
        ['c5', 'Disabled', { disabled: true }],
      ].map(([id, label, props]) => (
        <div key={id as string} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Checkbox id={id as string} {...(props as object)} />
          <Label htmlFor={id as string}>{label as string}</Label>
        </div>
      ))}
    </div>
  ),
}
