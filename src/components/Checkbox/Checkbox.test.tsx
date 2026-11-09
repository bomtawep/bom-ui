import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('toggles on click and with Space', async () => {
    render(<Checkbox aria-label="Agree" className="extra" />)
    const box = screen.getByRole('checkbox', { name: 'Agree' })
    expect(box).toHaveClass('bom-checkbox', 'extra')
    await userEvent.click(box)
    expect(box).toHaveAttribute('aria-checked', 'true')
    await userEvent.keyboard(' ')
    expect(box).toHaveAttribute('aria-checked', 'false')
  })

  it('shows the minus icon when indeterminate', () => {
    render(<Checkbox aria-label="All" checked="indeterminate" />)
    const box = screen.getByRole('checkbox')
    expect(box).toHaveAttribute('aria-checked', 'mixed')
    expect(box.querySelector('svg path')).toHaveAttribute('d', 'M5 12h14')
  })

  it('forwards the ref', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Checkbox aria-label="x" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('has a displayName', () => {
    expect(Checkbox.displayName).toBe('Checkbox')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Checkbox aria-label="Agree" defaultChecked />)
    await expectNoA11yViolations(container)
  })
})
