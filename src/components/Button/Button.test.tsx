import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Button } from './Button'

describe('Button', () => {
  it('renders the shadcn default variant and size', () => {
    render(<Button className="extra">Save</Button>)
    const btn = screen.getByRole('button', { name: 'Save' })
    expect(btn).toHaveAttribute('data-slot', 'button')
    expect(btn).toHaveAttribute('data-variant', 'default')
    expect(btn).toHaveAttribute('data-size', 'default')
    expect(btn).toHaveClass('extra')
  })

  it.each(['default', 'outline', 'secondary', 'ghost', 'destructive', 'link', 'sparkle'] as const)(
    'applies the %s variant',
    (variant) => {
      render(<Button variant={variant}>x</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('data-variant', variant)
    },
  )

  it.each(['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'] as const)('applies the %s size', (size) => {
    render(
      <Button size={size} aria-label="x">
        x
      </Button>,
    )
    expect(screen.getByRole('button')).toHaveAttribute('data-size', size)
  })

  it('merges className with tailwind-merge', () => {
    render(<Button className="h-12">x</Button>)
    const cls = screen.getByRole('button').className.split(' ')
    expect(cls).toContain('h-12')
    expect(cls).not.toContain('h-8')
  })

  it('uses the sparkle utility for variant="sparkle"', () => {
    render(<Button variant="sparkle">Go</Button>)
    expect(screen.getByRole('button')).toHaveClass('bom-sparkle')
  })

  it('shows a busy, disabled state with a spinner while loading', async () => {
    const onClick = vi.fn()
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    )
    const btn = screen.getByRole('button', { name: 'Save' })
    expect(btn).toHaveAttribute('aria-busy', 'true')
    expect(btn).toBeDisabled()
    expect(btn.querySelector('[data-slot="spinner"]')).toBeInTheDocument()
    await userEvent.click(btn)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders its child with button classes when asChild', () => {
    render(
      <Button asChild variant="outline">
        <a href="/x">Go</a>
      </Button>,
    )
    const link = screen.getByRole('link', { name: 'Go' })
    expect(link).toHaveAttribute('data-slot', 'button')
    expect(link).toHaveAttribute('data-variant', 'outline')
  })

  it('calls onClick and respects disabled', async () => {
    const onClick = vi.fn()
    const { rerender } = render(<Button onClick={onClick}>Save</Button>)
    await userEvent.click(screen.getByRole('button'))
    rerender(
      <Button onClick={onClick} disabled>
        Save
      </Button>,
    )
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('passes the ref to the DOM button', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Save</Button>)
    expect(ref.current).toBe(screen.getByRole('button'))
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <>
        <Button>Save</Button>
        <Button variant="sparkle">Get started</Button>
        <Button loading>Saving</Button>
      </>,
    )
    await expectNoA11yViolations(container)
  })
})
