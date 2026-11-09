import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Tabs defaultValue="info" {...args}>
      <TabsList aria-label="ส่วนของเอกสาร">
        <TabsTrigger value="info">ข้อมูล</TabsTrigger>
        <TabsTrigger value="files">ไฟล์แนบ</TabsTrigger>
        <TabsTrigger value="log" disabled>
          ประวัติ
        </TabsTrigger>
      </TabsList>
      <TabsContent value="info">รายละเอียดเอกสาร</TabsContent>
      <TabsContent value="files">ไฟล์ 3 รายการ</TabsContent>
    </Tabs>
  ),
}

export const Vertical: Story = { ...Default, args: { orientation: 'vertical' } }
