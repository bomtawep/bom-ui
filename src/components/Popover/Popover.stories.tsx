import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Input } from '../Input'
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from './Popover'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Overlay/Popover',
  component: Popover,
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">ตั้งค่าขนาด</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="ขนาด">
        <PopoverHeader>
          <PopoverTitle>ขนาด</PopoverTitle>
          <PopoverDescription>กำหนดความกว้างและความสูง</PopoverDescription>
        </PopoverHeader>
        <Input aria-label="กว้าง" defaultValue="100%" />
        <Input aria-label="สูง" defaultValue="25px" />
      </PopoverContent>
    </Popover>
  ),
}
