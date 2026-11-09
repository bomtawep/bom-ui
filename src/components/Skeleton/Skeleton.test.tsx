import { render } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  it('renders a hidden placeholder', () => {
    const { container } = render(<Skeleton className="extra" />)
    expect(container.firstElementChild).toHaveClass('bom-skeleton', 'extra')
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Skeleton ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('has a displayName', () => {
    expect(Skeleton.displayName).toBe('Skeleton')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Skeleton />)
    await expectNoA11yViolations(container)
  })
})
