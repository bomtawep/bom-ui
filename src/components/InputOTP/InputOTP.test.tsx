import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from './InputOTP'

function Code(props: { onChange?: (v: string) => void }) {
  return (
    <InputOTP maxLength={6} aria-label="Code" onChange={props.onChange} containerClassName="extra">
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
  it('accepts a 6-digit code and shows each digit in its slot', async () => {
    const onChange = vi.fn()
    const { container } = render(<Code onChange={onChange} />)
    await userEvent.type(screen.getByRole('textbox', { name: 'Code' }), '123456')
    expect(onChange).toHaveBeenLastCalledWith('123456')
    const slots = container.querySelectorAll('.bom-input-otp__slot')
    expect([...slots].map((s) => s.textContent)).toEqual(['1', '2', '3', '4', '5', '6'])
    expect(container.querySelector('.bom-input-otp')).toHaveClass('extra')
  })

  it('stops at maxLength', async () => {
    const onChange = vi.fn()
    render(<Code onChange={onChange} />)
    await userEvent.type(screen.getByRole('textbox'), '12345678')
    expect(onChange).toHaveBeenLastCalledWith('123456')
  })

  it('renders a separator', () => {
    render(<Code />)
    expect(screen.getByRole('separator')).toHaveClass('bom-input-otp__separator')
  })

  it('forwards refs', () => {
    const ref = createRef<HTMLInputElement>()
    const slotRef = createRef<HTMLDivElement>()
    render(
      <InputOTP ref={ref} maxLength={1} aria-label="x">
        <InputOTPGroup>
          <InputOTPSlot ref={slotRef} index={0} />
        </InputOTPGroup>
      </InputOTP>,
    )
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
    expect(slotRef.current).toHaveClass('bom-input-otp__slot')
  })

  it('has displayNames', () => {
    expect(InputOTP.displayName).toBe('InputOTP')
    expect(InputOTPGroup.displayName).toBe('InputOTPGroup')
    expect(InputOTPSlot.displayName).toBe('InputOTPSlot')
    expect(InputOTPSeparator.displayName).toBe('InputOTPSeparator')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Code />)
    await expectNoA11yViolations(container)
  })
})
