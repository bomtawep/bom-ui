import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion'

function Demo() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="a">
        <AccordionTrigger>Shipping</AccordionTrigger>
        <AccordionContent>3–5 days</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Returns</AccordionTrigger>
        <AccordionContent>30 days</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

describe('Accordion', () => {
  it('expands with click and Enter, moves with ArrowDown', async () => {
    render(<Demo />)
    const trigger = screen.getByRole('button', { name: 'Shipping' })
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('3–5 days')).toBeVisible()
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByRole('button', { name: 'Returns' })).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    expect(screen.getByRole('button', { name: 'Returns' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Demo />)
    await expectNoA11yViolations(container)
  })
})
