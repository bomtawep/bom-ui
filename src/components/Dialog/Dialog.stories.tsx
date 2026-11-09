import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Field, FieldGroup, FieldLabel } from '../Field'
import { Input } from '../Input'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './Dialog'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Overlay/Dialog',
  component: Dialog,
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>แก้ไขโปรไฟล์</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>แก้ไขโปรไฟล์</DialogTitle>
          <DialogDescription>เปลี่ยนข้อมูลแล้วกดบันทึก</DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="d-name">ชื่อ</FieldLabel>
            <Input id="d-name" defaultValue="ทวีวัฒน์" />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">ยกเลิก</Button>
          </DialogClose>
          <Button>บันทึก</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
