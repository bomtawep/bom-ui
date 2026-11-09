import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs'

function Demo() {
  return (
    <Tabs defaultValue="a" className="extra">
      <TabsList aria-label="Sections">
        <TabsTrigger value="a">Account</TabsTrigger>
        <TabsTrigger value="b">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="a">Account panel</TabsContent>
      <TabsContent value="b">Password panel</TabsContent>
    </Tabs>
  )
}

describe('Tabs', () => {
  it('shows the active panel and classes', () => {
    const { container } = render(<Demo />)
    expect(container.firstElementChild).toHaveClass('bom-tabs', 'extra')
    expect(screen.getByRole('tablist')).toHaveClass('bom-tabs__list')
    expect(screen.getByRole('tab', { name: 'Account' })).toHaveAttribute('data-state', 'active')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Account panel')
  })

  it('moves to the next tab with ArrowRight', async () => {
    render(<Demo />)
    await userEvent.tab()
    expect(screen.getByRole('tab', { name: 'Account' })).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => expect(screen.getByRole('tab', { name: 'Password' })).toHaveFocus())
    await waitFor(() => expect(screen.getByRole('tabpanel')).toHaveTextContent('Password panel'))
  })

  it('switches on click', async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole('tab', { name: 'Password' }))
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Password panel')
  })

  it('forwards refs', () => {
    const ref = createRef<HTMLDivElement>()
    const triggerRef = createRef<HTMLButtonElement>()
    render(
      <Tabs ref={ref} defaultValue="a">
        <TabsList>
          <TabsTrigger ref={triggerRef} value="a">
            a
          </TabsTrigger>
        </TabsList>
      </Tabs>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('has displayNames', () => {
    for (const C of [Tabs, TabsList, TabsTrigger, TabsContent]) expect(C.displayName).toMatch(/^Tabs/)
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Demo />)
    await expectNoA11yViolations(container)
  })
})
