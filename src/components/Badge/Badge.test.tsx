import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Badge } from './Badge'

describe('Badge', () => {
  it.each(['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as const)('applies the %s variant', (variant) => {
    render(<Badge variant={variant}>x</Badge>)
    expect(screen.getByText('x')).toHaveAttribute('data-variant', variant)
  })

  it('renders a span by default and a link with asChild', () => {
    render(
      <>
        <Badge>New</Badge>
        <Badge asChild>
          <a href="/x">Link</a>
        </Badge>
      </>,
    )
    expect(screen.getByText('New').tagName).toBe('SPAN')
    expect(screen.getByRole('link', { name: 'Link' })).toHaveAttribute('data-slot', 'badge')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Badge>New</Badge>)
    await expectNoA11yViolations(container)
  })
})
