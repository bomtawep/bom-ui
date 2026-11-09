import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Switch } from './Switch'

describe('Switch', () => {
  it('toggles on click', async () => {
    render(<Switch aria-label="Notify" className="extra" />)
    const sw = screen.getByRole('switch', { name: 'Notify' })
    expect(sw).toHaveClass('bom-switch', 'bom-switch--md', 'extra')
    await userEvent.click(sw)
    expect(sw).toHaveAttribute('aria-checked', 'true')
  })

  it.each(['sm', 'md'] as const)('applies the %s size', (size) => {
    render(<Switch aria-label="x" size={size} />)
    expect(screen.getByRole('switch')).toHaveClass(`bom-switch--${size}`)
  })

  it('forwards the ref', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Switch aria-label="x" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('has a displayName', () => {
    expect(Switch.displayName).toBe('Switch')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Switch aria-label="Notify" />)
    await expectNoA11yViolations(container)
  })
})
