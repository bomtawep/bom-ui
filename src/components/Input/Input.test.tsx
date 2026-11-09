import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Input } from './Input'

describe('Input', () => {
  it('types text, marks invalid and passes the ref', async () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input aria-label="Email" aria-invalid ref={ref} />)
    const input = screen.getByRole('textbox', { name: 'Email' })
    expect(input).toHaveAttribute('data-slot', 'input')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    await userEvent.type(input, 'a@b.co')
    expect(input).toHaveValue('a@b.co')
    expect(ref.current).toBe(input)
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Input aria-label="Email" />)
    await expectNoA11yViolations(container)
  })
})
