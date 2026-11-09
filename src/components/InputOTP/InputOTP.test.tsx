import '../../test-utils/element-from-point'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from './InputOTP'

function Code(props: { onChange?: (v: string) => void }) {
  return (
    <InputOTP maxLength={6} aria-label="Code" onChange={props.onChange}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}

describe('InputOTP', () => {
  it('accepts a code up to maxLength and shows each digit in its slot', async () => {
    const onChange = vi.fn()
    const { container } = render(<Code onChange={onChange} />)
    await userEvent.type(screen.getByRole('textbox', { name: 'Code' }), '12345678')
    expect(onChange).toHaveBeenLastCalledWith('123456')
    const slots = container.querySelectorAll('[data-slot="input-otp-slot"]')
    expect([...slots].map((s) => s.textContent)).toEqual(['1', '2', '3', '4', '5', '6'])
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Code />)
    await expectNoA11yViolations(container)
  })
})
