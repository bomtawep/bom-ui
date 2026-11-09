import type { Meta, StoryObj } from '@storybook/react-vite'
import { CalendarIcon, FileTextIcon, LayoutDashboardIcon, MoreHorizontalIcon, SettingsIcon } from 'lucide-react'
import { TooltipProvider } from '../Tooltip'
import { PageHeader } from '../PageHeader'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from './Sidebar'

/**
 * Remember the open state across reloads: read the cookie in a Server Component and pass it on.
 *
 * ```tsx
 * const open = (await cookies()).get('sidebar_state')?.value !== 'false'
 * return <SidebarProvider defaultOpen={open}>…</SidebarProvider>
 * ```
 */
const meta = {
  title: 'App/Sidebar',
  component: Sidebar,
  parameters: { layout: 'fullscreen' },
  args: { variant: 'sidebar', collapsible: 'icon' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['sidebar', 'floating', 'inset'] as const },
    collapsible: { control: 'inline-radio', options: ['offcanvas', 'icon', 'none'] as const },
    side: { control: 'inline-radio', options: ['left', 'right'] },
  },
} satisfies Meta<typeof Sidebar>

// Storybook requires a default export for meta; the library itself uses named exports only.
export default meta
type Story = StoryObj<typeof meta>

const nav = [
  { label: 'แดชบอร์ด', icon: <LayoutDashboardIcon />, active: true },
  { label: 'เอกสาร', icon: <FileTextIcon />, badge: '12' },
  { label: 'ปฏิทิน', icon: <CalendarIcon /> },
]

export const AppShell: Story = {
  render: (args) => (
    <TooltipProvider>
    <SidebarProvider>
      <Sidebar {...args}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <LayoutDashboardIcon />
                <span>DOF PPS</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarInput aria-label="ค้นหาเมนู" placeholder="ค้นหา" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>เมนูหลัก</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.map((n) => (
                  <SidebarMenuItem key={n.label}>
                    <SidebarMenuButton isActive={n.active} tooltip={n.label}>
                      {n.icon}
                      <span>{n.label}</span>
                    </SidebarMenuButton>
                    {n.badge && <SidebarMenuBadge>{n.badge}</SidebarMenuBadge>}
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="ตั้งค่า">
                    <SettingsIcon />
                    <span>ตั้งค่า</span>
                  </SidebarMenuButton>
                  <SidebarMenuAction aria-label="ตัวเลือก" showOnHover>
                    <MoreHorizontalIcon />
                  </SidebarMenuAction>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton href="#users" isActive>
                        ผู้ใช้
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton href="#roles">สิทธิ์</SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>v0.2.0</SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center gap-2 border-b p-3">
          <SidebarTrigger />
          <span>แดชบอร์ด</span>
        </header>
        <div className="p-6">
          <PageHeader title="แดชบอร์ด" description="กด Ctrl/⌘+B เพื่อพับแถบข้าง" />
        </div>
      </SidebarInset>
    </SidebarProvider>
    </TooltipProvider>
  ),
}

export const Floating: Story = { ...AppShell, args: { variant: 'floating' } }
export const Inset: Story = { ...AppShell, args: { variant: 'inset' } }
export const Offcanvas: Story = { ...AppShell, args: { collapsible: 'offcanvas' } }
