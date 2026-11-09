import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './Sheet'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Overlay/Sheet',
  component: Sheet,
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

export const Sides: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="secondary">{side}</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>ตัวกรอง</SheetTitle>
              <SheetDescription>เลือกเงื่อนไขการค้นหา</SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose asChild>
                <Button>ใช้ตัวกรอง</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
}
