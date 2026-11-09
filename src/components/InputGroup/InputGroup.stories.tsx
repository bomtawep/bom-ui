import type { Meta, StoryObj } from '@storybook/react-vite'
import { SearchIcon, XIcon } from 'lucide-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from './InputGroup'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Form/InputGroup',
  component: InputGroup,
} satisfies Meta<typeof InputGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Examples: Story = {
  render: () => (
    <div className="grid max-w-sm gap-4">
      <InputGroup>
        <InputGroupInput aria-label="Website" placeholder="example.com" />
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput aria-label="Search" placeholder="ค้นหา" />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label="ล้าง">
            <XIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupTextarea aria-label="Message" placeholder="พิมพ์ข้อความ" />
        <InputGroupAddon align="block-end">
          <InputGroupText>0/280</InputGroupText>
          <InputGroupButton variant="default" className="ml-auto">
            ส่ง
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
}
