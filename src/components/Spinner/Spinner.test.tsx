import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('is a status with the default Thai label', () => {
    render(<Spinner className="extra" />)
    expect(screen.getByRole('status', { name: 'กำลังโหลด' })).toHaveClass('bom-spinner', 'bom-spinner--md', 'extra')
  })

  it('accepts a custom label', () => {
    render(<Spinner label="Saving" />)
    expect(screen.getByRole('status', { name: 'Saving' })).toBeInTheDocument()
  })

  it.each(['sm', 'md', 'lg'] as const)('applies the %s size class', (size) => {
    render(<Spinner size={size} />)
    expect(screen.getByRole('status')).toHaveClass(`bom-spinner--${size}`)
  })

  it('forwards the ref', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<Spinner ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
  })

  it('has a displayName', () => {
    expect(Spinner.displayName).toBe('Spinner')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Spinner />)
    await expectNoA11yViolations(container)
  })
})
