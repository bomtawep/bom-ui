import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Kbd, KbdGroup } from './Kbd'

describe('Kbd', () => {
  it('renders kbd elements', () => {
    render(
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>B</Kbd>
      </KbdGroup>,
    )
    expect(screen.getByText('⌘').tagName).toBe('KBD')
    expect(screen.getByText('⌘')).toHaveAttribute('data-slot', 'kbd')
    expect(screen.getByText('⌘').parentElement).toHaveAttribute('data-slot', 'kbd-group')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Kbd>Esc</Kbd>)
    await expectNoA11yViolations(container)
  })
})
