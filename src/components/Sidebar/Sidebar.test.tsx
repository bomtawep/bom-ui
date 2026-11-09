import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { TooltipProvider } from '../Tooltip'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from './Sidebar'

function Shell(props: { defaultOpen?: boolean }) {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={props.defaultOpen}>
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive tooltip="Home">
                      Home
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <SidebarTrigger />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}

const sidebarEl = () => document.querySelector('[data-slot="sidebar"][data-state]') as HTMLElement
const trigger = () => document.querySelector('[data-slot="sidebar-trigger"]') as HTMLElement

afterEach(() => {
  document.cookie = 'sidebar_state=; max-age=0; path=/'
  vi.restoreAllMocks()
})

describe('Sidebar', () => {
  it('toggles with the trigger (named from messages) and stores a cookie', async () => {
    render(<Shell />)
    expect(trigger()).toHaveAccessibleName('เปิด/ปิดแถบข้าง')
    expect(sidebarEl()).toHaveAttribute('data-state', 'expanded')
    await userEvent.click(trigger())
    expect(sidebarEl()).toHaveAttribute('data-state', 'collapsed')
    expect(sidebarEl()).toHaveAttribute('data-collapsible', 'icon')
    expect(document.cookie).toContain('sidebar_state=false')
  })

  it('toggles with Ctrl+B and starts collapsed with defaultOpen={false}', async () => {
    render(<Shell defaultOpen={false} />)
    expect(sidebarEl()).toHaveAttribute('data-state', 'collapsed')
    await userEvent.keyboard('{Control>}b{/Control}')
    expect(sidebarEl()).toHaveAttribute('data-state', 'expanded')
  })

  it('marks the active item', () => {
    render(<Shell />)
    expect(screen.getByRole('button', { name: 'Home' })).toHaveAttribute('data-active', 'true')
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
        ({ matches: true, media: query, addEventListener: () => {}, removeEventListener: () => {} }) as unknown as MediaQueryList,
    )
    render(<Shell />)
    await userEvent.click(trigger())
    expect(await screen.findByRole('dialog')).toHaveTextContent('Home')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Shell />)
    await expectNoA11yViolations(container)
  })
})
