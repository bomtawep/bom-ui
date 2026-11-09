import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('toggles on click and with Space', async () => {
    render(<Checkbox aria-label="Agree" />)
    const box = screen.getByRole('checkbox', { name: 'Agree' })
    expect(box).toHaveAttribute('data-slot', 'checkbox')
    await userEvent.click(box)
    expect(box).toHaveAttribute('aria-checked', 'true')
    await userEvent.keyboard(' ')
    expect(box).toHaveAttribute('aria-checked', 'false')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Checkbox aria-label="Agree" defaultChecked />)
    await expectNoA11yViolations(container)
  })
})
