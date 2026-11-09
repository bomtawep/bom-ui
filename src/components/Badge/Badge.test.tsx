import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders a primary span by default', () => {
    render(<Badge className="extra">New</Badge>)
    const el = screen.getByText('New')
    expect(el.tagName).toBe('SPAN')
    expect(el).toHaveClass('bom-badge', 'bom-badge--primary', 'extra')
  })

  it.each(['primary', 'secondary', 'outline', 'info', 'success', 'warning', 'danger'] as const)(
    'applies the %s variant',
    (variant) => {
      render(<Badge variant={variant}>x</Badge>)
      expect(screen.getByText('x')).toHaveClass(`bom-badge--${variant}`)
    },
  )

  it('renders a link with asChild', () => {
    render(
      <Badge asChild>
        <a href="/x">Link</a>
      </Badge>,
    )
    expect(screen.getByRole('link', { name: 'Link' })).toHaveClass('bom-badge')
  })

  it('forwards the ref', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<Badge ref={ref}>x</Badge>)
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
  })

  it('has a displayName', () => {
    expect(Badge.displayName).toBe('Badge')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Badge>New</Badge>)
    await expectNoA11yViolations(container)
  })
})
