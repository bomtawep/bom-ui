import { render, screen } from '@testing-library/react'
import { XIcon } from 'lucide-react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { IconButton } from './IconButton'

describe('IconButton', () => {
  it('is a ghost icon Button named by aria-label', () => {
    render(
      <IconButton aria-label="Close">
        <XIcon />
      </IconButton>,
    )
    const btn = screen.getByRole('button', { name: 'Close' })
    expect(btn).toHaveAttribute('data-slot', 'button')
    expect(btn).toHaveAttribute('data-variant', 'ghost')
    expect(btn).toHaveAttribute('data-size', 'icon')
  })

  it.each([
    ['xs', 'icon-xs'],
    ['sm', 'icon-sm'],
    ['default', 'icon'],
    ['lg', 'icon-lg'],
  ] as const)('maps size %s to %s', (size, expected) => {
    render(<IconButton aria-label="x" size={size} variant="outline" />)
    expect(screen.getByRole('button')).toHaveAttribute('data-size', expected)
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'outline')
  })

  it('requires aria-label in its type', () => {
    // @ts-expect-error aria-label is required
    const missing = <IconButton>x</IconButton>
    expect(missing).toBeTruthy()
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
