import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Switch } from './Switch'

describe('Switch', () => {
  it('toggles on click and carries its size', async () => {
    render(<Switch aria-label="Notify" size="sm" />)
    const sw = screen.getByRole('switch', { name: 'Notify' })
    expect(sw).toHaveAttribute('data-size', 'sm')
    await userEvent.click(sw)
    expect(sw).toHaveAttribute('aria-checked', 'true')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Switch aria-label="Notify" />)
    await expectNoA11yViolations(container)
  })
})
