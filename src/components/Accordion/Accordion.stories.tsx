import type { Meta, StoryObj } from '@storybook/react-vite'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Navigation/Accordion',
  component: Accordion,
  args: { type: 'single', collapsible: true },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Accordion {...args} style={{ maxWidth: 480 }}>
      <AccordionItem value="1">
        <AccordionTrigger>ส่งเอกสารได้ทางไหนบ้าง</AccordionTrigger>
        <AccordionContent>อัปโหลดผ่านระบบ หรือส่งทางอีเมล</AccordionContent>
      </AccordionItem>
      <AccordionItem value="2">
        <AccordionTrigger>ใช้เวลาตรวจสอบกี่วัน</AccordionTrigger>
        <AccordionContent>ภายใน 3 วันทำการ</AccordionContent>
      </AccordionItem>
      <AccordionItem value="3" disabled>
        <AccordionTrigger>ปิดใช้งาน</AccordionTrigger>
        <AccordionContent>-</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}
