import type { Meta, StoryObj } from '@storybook/react-vite'
import { XIcon } from '../../lib/icons'
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
    <div style={{ display: 'grid', gap: '1rem', maxWidth: 380 }}>
      <InputGroup>
        <InputGroupInput aria-label="Website" placeholder="example.com" />
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput aria-label="Amount" placeholder="0.00" />
        <InputGroupAddon align="inline-end">บาท</InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput aria-label="Search" placeholder="ค้นหา" />
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
          <InputGroupButton variant="primary" style={{ marginLeft: 'auto' }}>
            ส่ง
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput aria-label="Invalid" aria-invalid defaultValue="bad" />
        <InputGroupAddon align="inline-end">@</InputGroupAddon>
      </InputGroup>
    </div>
  ),
}
