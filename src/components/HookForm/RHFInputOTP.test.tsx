import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp'
import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { renderForm } from '../../test-utils/form'
import { RHFInputOTP } from './RHFInputOTP'

const schema = z.object({ code: z.string().length(6, 'กรอกให้ครบ 6 หลัก') })
type Values = z.infer<typeof schema>

describe('RHFInputOTP', () => {
  it('stores the typed code as a string and calls onComplete', async () => {
    const onComplete = vi.fn()
    const { form } = renderForm<Values>(schema, { code: '' }, <RHFInputOTP name="code" label="Code" onComplete={onComplete} />)
    const input = screen.getByRole('textbox', { name: 'Code' })
    expect(input).toHaveAttribute('inputmode', 'numeric')
    await userEvent.type(input, '123456')
    expect(form.methods!.getValues('code')).toBe('123456')
    expect(onComplete).toHaveBeenCalledWith('123456')
  })

  it('rejects characters outside the pattern', async () => {
    const { form } = renderForm<Values>(schema, { code: '' }, <RHFInputOTP name="code" label="Code" />)
    await userEvent.type(screen.getByRole('textbox', { name: 'Code' }), '12ab')
    expect(form.methods!.getValues('code')).toBe('12')
  })

  it('accepts letters with another pattern and uses a text keyboard', async () => {
    const { form } = renderForm<Values>(schema, { code: '' }, <RHFInputOTP name="code" label="Code" pattern={REGEXP_ONLY_DIGITS_AND_CHARS} />)
    const input = screen.getByRole('textbox', { name: 'Code' })
    expect(input).toHaveAttribute('inputmode', 'text')
    await userEvent.type(input, 'ab12')
    expect(form.methods!.getValues('code')).toBe('ab12')
  })

  it('renders groups with separators', () => {
    const { container } = renderForm<Values>(schema, { code: '' }, <RHFInputOTP name="code" label="Code" groups={[3, 3]} />)
    expect(container.querySelectorAll('.bom-input-otp__group')).toHaveLength(2)
    expect(container.querySelectorAll('.bom-input-otp__separator')).toHaveLength(1)
    expect(container.querySelectorAll('.bom-input-otp__slot')).toHaveLength(6)
  })

  it('links the error and required', async () => {
    renderForm<Values>(schema, { code: '' }, <RHFInputOTP name="code" label="Code" description="From SMS" required />)
    await userEvent.click(screen.getByRole('button', { name: 'submit' }))
    await screen.findByText('กรอกให้ครบ 6 หลัก')
    const input = screen.getByRole('textbox', { name: 'Code' })
    expect(input).toHaveAccessibleDescription('From SMS กรอกให้ครบ 6 หลัก')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toBeRequired()
  })

  it('has no a11y violations', async () => {
    const { container } = renderForm<Values>(schema, { code: '' }, <RHFInputOTP name="code" label="Code" groups={[3, 3]} />)
    await expectNoA11yViolations(container)
  })
})
