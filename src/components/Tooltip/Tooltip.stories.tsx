import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Kbd } from '../Kbd'
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Overlay/Tooltip',
  component: Tooltip,
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Sides: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', padding: '3rem' }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="secondary">{side}</Button>
          </TooltipTrigger>
          <TooltipContent side={side}>
            บันทึก <Kbd>⌘S</Kbd>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
}
