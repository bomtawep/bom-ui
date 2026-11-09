import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { RadioGroup, RadioGroupItem } from './RadioGroup'

function Plan() {
  return (
    <RadioGroup aria-label="Plan" defaultValue="a">
      <RadioGroupItem value="a" aria-label="Basic" />
      <RadioGroupItem value="b" aria-label="Pro" />
    </RadioGroup>
  )
}

describe('RadioGroup', () => {
  it('moves focus with arrow keys and selects with Space', async () => {
    render(<Plan />)
    expect(screen.getByRole('radiogroup', { name: 'Plan' })).toHaveAttribute('data-slot', 'radio-group')
    await userEvent.tab()
    await userEvent.keyboard('{ArrowDown}')
    // Radix moves roving focus in a timeout (jsdom does not run its select-on-focus, so select with Space)
    await waitFor(() => expect(screen.getByRole('radio', { name: 'Pro' })).toHaveFocus())
    await userEvent.keyboard(' ')
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Plan />)
    await expectNoA11yViolations(container)
  })
})
