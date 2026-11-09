import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Separator } from './Separator'

describe('Separator', () => {
  it('is decorative by default', () => {
    const { container } = render(<Separator className="extra" />)
    const el = container.firstElementChild!
    expect(el).toHaveClass('bom-separator', 'extra')
    expect(el).toHaveAttribute('role', 'none')
  })

  it('is a real separator when not decorative', () => {
    render(<Separator decorative={false} orientation="vertical" />)
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Separator ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('has a displayName', () => {
    expect(Separator.displayName).toBe('Separator')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Separator decorative={false} />)
    await expectNoA11yViolations(container)
  })
})
