import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from '../Checkbox'
import { Input } from '../Input'
import { Switch } from '../Switch'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from './Field'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Form/Field',
  component: Field,
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Vertical: Story = {
  render: () => (
    <Field style={{ maxWidth: 360 }}>
      <FieldLabel htmlFor="v-email">อีเมล</FieldLabel>
      <Input id="v-email" aria-describedby="v-email-d" />
      <FieldDescription id="v-email-d">ใช้อีเมลที่ทำงาน</FieldDescription>
    </Field>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <Field orientation="horizontal" style={{ maxWidth: 480 }}>
      <FieldLabel htmlFor="h-name" style={{ width: 120 }}>
        ชื่อ
      </FieldLabel>
      <Input id="h-name" />
    </Field>
  ),
}

export const Responsive: Story = {
  render: () => (
    <FieldGroup style={{ resize: 'horizontal', overflow: 'auto', border: '1px dashed', padding: 12 }}>
      <Field orientation="responsive">
        <FieldContent>
          <FieldLabel htmlFor="r-name">ชื่อโปรเจกต์</FieldLabel>
          <FieldDescription>ลากมุมกล่องเพื่อดูการเปลี่ยน layout</FieldDescription>
        </FieldContent>
        <Input id="r-name" />
      </Field>
    </FieldGroup>
  ),
}

export const Invalid: Story = {
  render: () => (
    <Field data-invalid style={{ maxWidth: 360 }}>
      <FieldLabel htmlFor="i-email">
        อีเมล<span aria-hidden="true" className="bom-field__required">*</span>
      </FieldLabel>
      <Input id="i-email" aria-invalid aria-describedby="i-email-e" required />
      <FieldError id="i-email-e" errors={[{ message: 'กรอกอีเมล' }]} />
    </Field>
  ),
}

export const CheckboxGroup: Story = {
  render: () => (
    <FieldSet style={{ maxWidth: 400 }}>
      <FieldLegend variant="label">การแจ้งเตือน</FieldLegend>
      <FieldDescription>เลือกช่องทางที่ต้องการ</FieldDescription>
      <FieldGroup style={{ gap: 12 }}>
        {['อีเมล', 'SMS', 'LINE'].map((c, i) => (
          <Field key={c} orientation="horizontal">
            <Checkbox id={`cg-${i}`} defaultChecked={i === 0} />
            <FieldLabel htmlFor={`cg-${i}`}>{c}</FieldLabel>
          </Field>
        ))}
      </FieldGroup>
      <FieldSeparator>หรือ</FieldSeparator>
      <FieldLabel htmlFor="cg-sw">
        <Field orientation="horizontal">
          <FieldContent>
            <span>ปิดการแจ้งเตือนทั้งหมด</span>
            <FieldDescription>ไม่รับข้อความใด ๆ</FieldDescription>
          </FieldContent>
          <Switch id="cg-sw" />
        </Field>
      </FieldLabel>
    </FieldSet>
  ),
}
