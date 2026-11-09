import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './Select'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Form/Select',
  component: Select,
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const items = (
  <>
    <SelectGroup>
      <SelectLabel>ภาคเหนือ</SelectLabel>
      <SelectItem value="cm">เชียงใหม่</SelectItem>
      <SelectItem value="cr">เชียงราย</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>ภาคกลาง</SelectLabel>
      <SelectItem value="bkk">กรุงเทพฯ</SelectItem>
      <SelectItem value="ayt" disabled>
        อยุธยา (ปิด)
      </SelectItem>
    </SelectGroup>
  </>
)

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger aria-label="จังหวัด" style={{ width: 220 }}>
        <SelectValue placeholder="เลือกจังหวัด" />
      </SelectTrigger>
      <SelectContent>{items}</SelectContent>
    </Select>
  ),
}

export const Popper: Story = {
  render: () => (
    <Select>
      <SelectTrigger aria-label="จังหวัด" style={{ width: 220 }}>
        <SelectValue placeholder="เลือกจังหวัด" />
      </SelectTrigger>
      <SelectContent position="popper">{items}</SelectContent>
    </Select>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      {(['sm', 'default'] as const).map((s) => (
        <Select key={s}>
          <SelectTrigger aria-label={s} size={s}>
            <SelectValue placeholder={s} />
          </SelectTrigger>
          <SelectContent>{items}</SelectContent>
        </Select>
      ))}
      <Select disabled>
        <SelectTrigger aria-label="disabled">
          <SelectValue placeholder="disabled" />
        </SelectTrigger>
        <SelectContent>{items}</SelectContent>
      </Select>
      <Select>
        <SelectTrigger aria-label="invalid" aria-invalid>
          <SelectValue placeholder="invalid" />
        </SelectTrigger>
        <SelectContent>{items}</SelectContent>
      </Select>
    </div>
  ),
}
