import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { XIcon } from '../../lib/icons'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { IconButton } from './IconButton'

describe('IconButton', () => {
  it('uses aria-label as the accessible name', () => {
    render(
      <IconButton aria-label="Close" className="extra">
        <XIcon />
      </IconButton>,
    )
    expect(screen.getByRole('button', { name: 'Close' })).toHaveClass(
      'bom-btn',
      'bom-icon-btn',
      'bom-icon-btn--md',
      'bom-btn--ghost',
      'extra',
    )
  })

  it.each(['sm', 'md', 'lg'] as const)('applies the %s size class', (size) => {
    render(<IconButton aria-label="x" size={size} />)
    expect(screen.getByRole('button')).toHaveClass(`bom-icon-btn--${size}`)
  })

  it.each(['primary', 'secondary', 'ghost', 'danger'] as const)('applies the %s variant', (variant) => {
    render(<IconButton aria-label="x" variant={variant} />)
    expect(screen.getByRole('button')).toHaveClass(`bom-btn--${variant}`)
  })

  it('requires aria-label in its type', () => {
    // @ts-expect-error aria-label is required
    const missing = <IconButton>x</IconButton>
    expect(missing).toBeTruthy()
  })

  it('forwards the ref', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<IconButton aria-label="x" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('has a displayName', () => {
    expect(IconButton.displayName).toBe('IconButton')
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <IconButton aria-label="Close">
        <XIcon />
      </IconButton>,
    )
    await expectNoA11yViolations(container)
  })
})
