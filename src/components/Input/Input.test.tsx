import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Input } from './Input'

describe('Input', () => {
  it('renders with md size and custom className', () => {
    render(<Input aria-label="Email" className="extra" />)
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveClass('bom-input', 'bom-input--md', 'extra')
  })

  it.each(['sm', 'md', 'lg'] as const)('applies the %s size', (size) => {
    render(<Input aria-label="x" size={size} />)
    expect(screen.getByRole('textbox')).toHaveClass(`bom-input--${size}`)
  })

  it('marks invalid state for styling', () => {
    render(<Input aria-label="Email" aria-invalid />)
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('aria-invalid', 'true')
  })

  it('types text', async () => {
    render(<Input aria-label="Email" />)
    await userEvent.type(screen.getByRole('textbox'), 'a@b.co')
    expect(screen.getByRole('textbox')).toHaveValue('a@b.co')
  })

  it('forwards the ref', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input aria-label="x" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('has a displayName', () => {
    expect(Input.displayName).toBe('Input')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Input aria-label="Email" />)
    await expectNoA11yViolations(container)
  })
})
