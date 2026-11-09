import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion'

function Demo() {
  return (
    <Accordion type="single" collapsible className="extra">
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
  it('expands and collapses an item', async () => {
    const { container } = render(<Demo />)
    expect(container.firstElementChild).toHaveClass('bom-accordion', 'extra')
    const trigger = screen.getByRole('button', { name: 'Shipping' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('3–5 days')).toBeVisible()
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('toggles with the keyboard', async () => {
    render(<Demo />)
    await userEvent.tab()
    await userEvent.keyboard('{Enter}')
    expect(screen.getByRole('button', { name: 'Shipping' })).toHaveAttribute('aria-expanded', 'true')
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByRole('button', { name: 'Returns' })).toHaveFocus()
  })

  it('forwards refs', () => {
    const ref = createRef<HTMLDivElement>()
    const triggerRef = createRef<HTMLButtonElement>()
    render(
      <Accordion ref={ref} type="multiple">
        <AccordionItem value="a">
          <AccordionTrigger ref={triggerRef}>t</AccordionTrigger>
        </AccordionItem>
      </Accordion>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(triggerRef.current).toHaveClass('bom-accordion__trigger')
  })

  it('has displayNames', () => {
    for (const C of [Accordion, AccordionItem, AccordionTrigger, AccordionContent]) expect(C.displayName).toMatch(/^Accordion/)
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Demo />)
    await expectNoA11yViolations(container)
  })
})
