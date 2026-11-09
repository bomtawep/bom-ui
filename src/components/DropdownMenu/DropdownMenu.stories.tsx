import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../Button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './DropdownMenu'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Overlay/DropdownMenu',
  component: DropdownMenu,
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Full: Story = {
  render: () => {
    const [grid, setGrid] = useState(true)
    const [size, setSize] = useState('md')
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">เมนู</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent style={{ width: 220 }}>
          <DropdownMenuLabel>บัญชีของฉัน</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              โปรไฟล์ <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>ตั้งค่า</DropdownMenuItem>
            <DropdownMenuItem disabled>API (ปิด)</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={grid} onCheckedChange={setGrid}>
            แสดงเส้นตาราง
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel inset>ขนาด</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={size} onValueChange={setSize}>
            <DropdownMenuRadioItem value="sm">เล็ก</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="md">กลาง</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>เพิ่มเติม</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>เก็บถาวร</DropdownMenuItem>
              <DropdownMenuItem>ย้าย</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem variant="danger">ลบ</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
}
