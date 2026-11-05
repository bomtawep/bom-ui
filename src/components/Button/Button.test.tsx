import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Button } from './Button'

describe('Button', () => {
  it('renders a native button with type="button" by default', () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button')
  })

  it('keeps an explicit type', () => {
    render(<Button type="submit">Save</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('defaults to the primary variant and md size', () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole('button')).toHaveClass('bom-btn', 'bom-btn--primary', 'bom-btn--md')
  })

  it.each(['primary', 'secondary', 'ghost', 'danger'] as const)('applies the %s variant class', (variant) => {
    render(<Button variant={variant}>Save</Button>)
    expect(screen.getByRole('button')).toHaveClass(`bom-btn--${variant}`)
  })

  it.each(['sm', 'md', 'lg'] as const)('applies the %s size class', (size) => {
    render(<Button size={size}>Save</Button>)
    expect(screen.getByRole('button')).toHaveClass(`bom-btn--${size}`)
  })

  it('appends a custom className', () => {
    render(<Button className="extra">Save</Button>)
    expect(screen.getByRole('button')).toHaveClass('bom-btn', 'extra')
  })

  it('forwards the ref to the button element', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Save</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        Save
      </Button>,
    )
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('has a displayName', () => {
    expect(Button.displayName).toBe('Button')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Button>Save</Button>)
    await expectNoA11yViolations(container)
  })
})
