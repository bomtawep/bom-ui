import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { RadioGroup, RadioGroupItem } from './RadioGroup'

function Plan() {
  return (
    <RadioGroup aria-label="Plan" defaultValue="a" className="extra">
      <RadioGroupItem value="a" aria-label="Basic" />
      <RadioGroupItem value="b" aria-label="Pro" />
    </RadioGroup>
  )
}

describe('RadioGroup', () => {
  it('renders the group and items', () => {
    render(<Plan />)
    expect(screen.getByRole('radiogroup', { name: 'Plan' })).toHaveClass('bom-radio-group', 'extra')
    expect(screen.getByRole('radio', { name: 'Basic' })).toHaveClass('bom-radio')
  })

  it('moves focus with arrow keys and selects with Space', async () => {
    render(<Plan />)
    await userEvent.tab()
    expect(screen.getByRole('radio', { name: 'Basic' })).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    // Radix moves roving focus in a timeout (jsdom does not run its select-on-focus, so select with Space)
    await waitFor(() => expect(screen.getByRole('radio', { name: 'Pro' })).toHaveFocus())
    await userEvent.keyboard(' ')
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked()
  })

  it('forwards refs', () => {
    const ref = createRef<HTMLDivElement>()
    const itemRef = createRef<HTMLButtonElement>()
    render(
      <RadioGroup ref={ref} aria-label="x">
        <RadioGroupItem ref={itemRef} value="a" aria-label="a" />
      </RadioGroup>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(itemRef.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('has displayNames', () => {
    expect(RadioGroup.displayName).toBe('RadioGroup')
    expect(RadioGroupItem.displayName).toBe('RadioGroupItem')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Plan />)
    await expectNoA11yViolations(container)
  })
})
