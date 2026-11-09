import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs'

function Demo() {
  return (
    <Tabs defaultValue="a">
      <TabsList aria-label="Sections" variant="line">
        <TabsTrigger value="a">Account</TabsTrigger>
        <TabsTrigger value="b">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="a">Account panel</TabsContent>
      <TabsContent value="b">Password panel</TabsContent>
    </Tabs>
  )
}

describe('Tabs', () => {
  it('moves to the next tab with ArrowRight', async () => {
    render(<Demo />)
    expect(screen.getByRole('tablist')).toHaveAttribute('data-variant', 'line')
    await userEvent.tab()
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => expect(screen.getByRole('tabpanel')).toHaveTextContent('Password panel'))
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Demo />)
    await expectNoA11yViolations(container)
  })
})
