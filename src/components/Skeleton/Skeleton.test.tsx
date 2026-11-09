import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  it('renders a pulsing placeholder', () => {
    const { container } = render(<Skeleton className="h-4 w-20" />)
    const el = container.firstElementChild!
    expect(el).toHaveAttribute('data-slot', 'skeleton')
    expect(el).toHaveClass('animate-pulse', 'h-4', 'w-20')
  })
})
