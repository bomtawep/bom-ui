import { zodResolver } from '@hookform/resolvers/zod'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { enUS } from 'react-day-picker/locale'
import { useForm, type Resolver } from 'react-hook-form'
import { z } from 'zod'
import { BomUIProvider } from '../BomUIProvider'
import { Button } from '../Button'
import { FieldGroup } from '../Field'
import {
  FormProvider,
  RHFCheckbox,
  RHFDatePicker,
  RHFDateRangePicker,
  RHFInput,
  RHFInputGroup,
  RHFInputOTP,
  RHFRadioGroup,
  RHFSelect,
  RHFSwitch,
  RHFTextArea,
  type DateRange,
} from './index'

const schema = z.object({
  name: z.string().min(1, 'กรอกชื่อ'),
  email: z.email('อีเมลไม่ถูกต้อง'),
  price: z.string().min(1, 'กรอกราคา'),
  bio: z.string().max(140, 'ไม่เกิน 140 ตัวอักษร'),
  province: z.string().min(1, 'เลือกจังหวัด'),
  plan: z.string().min(1, 'เลือกแพ็กเกจ'),
  channels: z.array(z.string()).min(1, 'เลือกอย่างน้อยหนึ่งช่องทาง'),
  agree: z.boolean().refine((v) => v, 'ต้องยอมรับเงื่อนไข'),
  notify: z.boolean(),
  otp: z.string().length(6, 'กรอกให้ครบ 6 หลัก'),
  birthday: z.date({ error: 'เลือกวันเกิด' }),
  start: z.date({ error: 'กรอกวันที่ให้ถูกต้อง' }),
  stay: z.object({ from: z.date({ error: 'เลือกวันเข้าพัก' }), to: z.date({ error: 'เลือกวันออก' }) }),
})

type Values = {
  name: string
  email: string
  price: string
  bio: string
  province: string
  plan: string
  channels: string[]
  agree: boolean
  notify: boolean
  otp: string
  birthday: Date | null
  start: Date | null
  stay: DateRange
}

const defaults: Values = {
  name: '',
  email: '',
  price: '',
  bio: '',
  province: '',
  plan: '',
  channels: [],
  agree: false,
  notify: true,
  otp: '',
  birthday: null,
  start: null,
  stay: { from: undefined, to: undefined },
}

function Demo() {
  const methods = useForm<Values>({
    resolver: zodResolver(schema as never) as unknown as Resolver<Values>,
    defaultValues: defaults,
  })
  const [result, setResult] = useState<string>()
  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit((v) => setResult(JSON.stringify(v, null, 2)))}>
      <FieldGroup style={{ maxWidth: 520 }}>
        <RHFInput name="name" label="ชื่อ" required />
        <RHFInput name="email" label="อีเมล" type="email" description="ใช้อีเมลที่ทำงาน" required />
        <RHFInputGroup name="price" label="ราคา" inlineStart="฿" inlineEnd="บาท" inputMode="decimal" />
        <RHFTextArea name="bio" label="แนะนำตัว" />
        <RHFSelect
          name="province"
          label="จังหวัด"
          placeholder="เลือกจังหวัด"
          required
          options={[
            { label: 'ภาคเหนือ', options: [{ value: 'cm', label: 'เชียงใหม่' }] },
            { label: 'ภาคกลาง', options: [{ value: 'bkk', label: 'กรุงเทพฯ' }] },
          ]}
        />
        <RHFRadioGroup
          name="plan"
          label="แพ็กเกจ"
          variant="card"
          options={[
            { value: 'basic', label: 'Basic', description: 'สำหรับบุคคล' },
            { value: 'pro', label: 'Pro', description: 'สำหรับทีม' },
          ]}
        />
        <RHFCheckbox
          name="channels"
          label="ช่องทางแจ้งเตือน"
          orientation="horizontal"
          options={[
            { value: 'email', label: 'อีเมล' },
            { value: 'sms', label: 'SMS' },
            { value: 'line', label: 'LINE' },
          ]}
        />
        <RHFSwitch name="notify" label="รับข่าวสาร" description="ส่งสัปดาห์ละครั้ง" />
        <RHFInputOTP name="otp" label="รหัส OTP" groups={[3, 3]} />
        <RHFDatePicker
          name="birthday"
          label="วันเกิด"
          captionLayout="dropdown"
          startMonth={new Date(1950, 0)}
          endMonth={new Date()}
          disabledDates={{ after: new Date() }}
        />
        <RHFDatePicker name="start" label="วันเริ่มงาน" variant="input" showTime />
        <RHFDateRangePicker name="stay" label="ช่วงเข้าพัก" />
        <RHFCheckbox name="agree" label="ยอมรับเงื่อนไขการใช้งาน" required />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="submit">ส่งฟอร์ม</Button>
          <Button variant="secondary" onClick={() => methods.reset(defaults)}>
            ล้าง
          </Button>
        </div>
        {result && <pre style={{ fontSize: 12 }}>{result}</pre>}
      </FieldGroup>
    </FormProvider>
  )
}

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'HookForm/All fields',
  component: Demo,
} satisfies Meta<typeof Demo>

export default meta
type Story = StoryObj<typeof meta>

export const Thai: Story = {}

export const English: Story = {
  render: () => (
    <BomUIProvider locale={enUS} messages={{ required: 'required', datePickerPlaceholder: 'Pick a date' }}>
      <Demo />
    </BomUIProvider>
  ),
}
