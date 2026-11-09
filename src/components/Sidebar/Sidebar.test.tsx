import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from './Sidebar'

function Shell(props: { defaultOpen?: boolean }) {
  return (
    <SidebarProvider defaultOpen={props.defaultOpen}>
      <Sidebar collapsible="icon">
        <SidebarHeader>Acme</SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupAction aria-label="Add">+</SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Home">
                    Home
                  </SidebarMenuButton>
                  <SidebarMenuBadge>3</SidebarMenuBadge>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>Docs</SidebarMenuButton>
                  <SidebarMenuAction aria-label="More" showOnHover>
                    …
                  </SidebarMenuAction>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton href="#intro" isActive>
                        Intro
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarMenuSkeleton showIcon />
        </SidebarContent>
        <SidebarFooter>v1</SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
      </SidebarInset>
    </SidebarProvider>
  )
}

const sidebarEl = () => document.querySelector('.bom-sidebar') as HTMLElement
// the rail has the same accessible name as the trigger, so pick the trigger by class
const trigger = () =>
  screen.getAllByRole('button', { name: 'เปิด/ปิดแถบข้าง' }).find((b) => b.classList.contains('bom-sidebar__trigger'))!

afterEach(() => {
  document.cookie = 'sidebar_state=; max-age=0; path=/'
  vi.restoreAllMocks()
})

describe('Sidebar', () => {
  it('toggles with the trigger and remembers the state in a cookie', async () => {
    render(<Shell />)
    expect(sidebarEl()).toHaveAttribute('data-state', 'expanded')
    await userEvent.click(trigger())
    expect(sidebarEl()).toHaveAttribute('data-state', 'collapsed')
    expect(sidebarEl()).toHaveAttribute('data-collapsible', 'icon')
    expect(document.cookie).toContain('sidebar_state=false')
  })

  it('toggles from the rail too', async () => {
    const { container } = render(<Shell />)
    await userEvent.click(container.querySelector('.bom-sidebar__rail')!)
    expect(sidebarEl()).toHaveAttribute('data-state', 'collapsed')
  })

  it('toggles with Ctrl+B', async () => {
    render(<Shell />)
    await userEvent.keyboard('{Control>}b{/Control}')
    expect(sidebarEl()).toHaveAttribute('data-state', 'collapsed')
    await userEvent.keyboard('{Control>}b{/Control}')
    expect(sidebarEl()).toHaveAttribute('data-state', 'expanded')
  })

  it('starts collapsed with defaultOpen={false}', () => {
    render(<Shell defaultOpen={false} />)
    expect(sidebarEl()).toHaveAttribute('data-state', 'collapsed')
  })

  it('supports controlled open', async () => {
    const onOpenChange = vi.fn()
    render(
      <SidebarProvider open onOpenChange={onOpenChange}>
        <Sidebar />
        <SidebarTrigger />
      </SidebarProvider>,
    )
    await userEvent.click(trigger())
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(sidebarEl()).toHaveAttribute('data-state', 'expanded')
  })

  it('marks the active item and renders menu parts', () => {
    render(<Shell />)
    expect(screen.getByRole('button', { name: 'Home' })).toHaveAttribute('data-active', 'true')
    expect(screen.getByRole('button', { name: 'Home' })).toHaveClass('bom-sidebar__menu-button', 'bom-sidebar__menu-button--md')
    expect(screen.getByRole('link', { name: 'Intro' })).toHaveClass('bom-sidebar__menu-sub-button')
    expect(screen.getByRole('button', { name: 'More' })).toHaveClass('bom-sidebar__menu-action--hover')
  })

  it('renders static when collapsible="none"', () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar collapsible="none">x</Sidebar>
      </SidebarProvider>,
    )
    expect(container.querySelector('.bom-sidebar-static')).toHaveTextContent('x')
  })

  it('throws outside a provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    function Bad() {
      useSidebar()
      return null
    }
    expect(() => render(<Bad />)).toThrow(/SidebarProvider/)
  })

  it('opens as a sheet on mobile', async () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) =>
        ({
          matches: true,
          media: query,
          addEventListener: () => {},
          removeEventListener: () => {},
        }) as unknown as MediaQueryList,
    )
    render(<Shell />)
    expect(screen.queryByRole('dialog')).toBeNull()
    await userEvent.click(trigger())
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveClass('bom-sidebar-mobile')
    expect(dialog).toHaveTextContent('Home')
  })

  it('forwards refs', () => {
    const provider = createRef<HTMLDivElement>()
    const sidebar = createRef<HTMLDivElement>()
    const button = createRef<HTMLButtonElement>()
    const inset = createRef<HTMLElement>()
    render(
      <SidebarProvider ref={provider}>
        <Sidebar ref={sidebar}>
          <SidebarMenuButton ref={button}>b</SidebarMenuButton>
        </Sidebar>
        <SidebarInset ref={inset} />
      </SidebarProvider>,
    )
    expect(provider.current).toHaveClass('bom-sidebar-wrapper')
    expect(sidebar.current).toHaveClass('bom-sidebar__container')
    expect(button.current).toBeInstanceOf(HTMLButtonElement)
    expect(inset.current?.tagName).toBe('MAIN')
  })

  it('has displayNames', () => {
    for (const C of [
      SidebarProvider,
      Sidebar,
      SidebarTrigger,
      SidebarRail,
      SidebarInset,
      SidebarHeader,
      SidebarContent,
      SidebarGroup,
      SidebarGroupLabel,
      SidebarMenuButton,
      SidebarMenuSkeleton,
      SidebarMenuSubButton,
    ]) {
      expect(C.displayName).toMatch(/^Sidebar/)
    }
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Shell />)
    await expectNoA11yViolations(container)
  })
})
