import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './AlertDialog'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Overlay/AlertDialog',
  component: AlertDialog,
} satisfies Meta<typeof AlertDialog>

export default meta
type Story = StoryObj<typeof meta>

export const ConfirmDelete: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="danger">ลบเอกสาร</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ลบเอกสารนี้?</AlertDialogTitle>
          <AlertDialogDescription>เอกสารจะถูกลบถาวรและกู้คืนไม่ได้</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction variant="danger">ลบ</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}
