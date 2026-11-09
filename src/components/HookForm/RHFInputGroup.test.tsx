import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { renderForm } from '../../test-utils/form'
import { RHFInputGroup } from './RHFInputGroup'

const schema = z.object({ price: z.string().min(1, 'กรอกราคา'), bio: z.string().max(5, 'ยาวเกิน') })
type Values = z.infer<typeof schema>

describe('RHFInputGroup', () => {
  it('writes into the form and describes the field with addon text', async () => {
    const { form } = renderForm<Values>(
      schema,
      { price: '', bio: '' },
      <RHFInputGroup name="price" label="Price" inlineStart="฿" inlineEnd="THB" />,
    )
    const input = screen.getByRole('textbox', { name: 'Price' })
    expect(input).toHaveAccessibleDescription('฿ THB')
    expect(input).toHaveAttribute('data-slot', 'input-group-control')
    await userEvent.type(input, '100')
    expect(form.methods!.getValues('price')).toBe('100')
  })

  it('describeAddons limits which addons describe the field', () => {
    renderForm<Values>(
      schema,
      { price: '', bio: '' },
      <RHFInputGroup name="price" label="Price" inlineStart="฿" inlineEnd="THB" describeAddons={['inlineEnd']} />,
    )
    expect(screen.getByRole('textbox', { name: 'Price' })).toHaveAccessibleDescription('THB')
  })

  it('multiline with a live counter addon', async () => {
    renderForm<Values>(
      schema,
      { price: '', bio: '' },
      <RHFInputGroup name="bio" label="Bio" multiline blockEnd={(v) => `${v.length}/5`} />,
    )
    const box = screen.getByRole('textbox', { name: 'Bio' })
    expect(box.tagName).toBe('TEXTAREA')
    await userEvent.type(box, 'abc')
    expect(screen.getByText('3/5')).toBeInTheDocument()
  })

  it('renders a custom control with the given props', async () => {
    const { form } = renderForm<Values>(
      schema,
      { price: '', bio: '' },
      <RHFInputGroup name="price" label="Price" renderControl={(p) => <input {...p} data-testid="custom" />} />,
    )
    await userEvent.type(screen.getByTestId('custom'), '9')
    expect(form.methods!.getValues('price')).toBe('9')
    expect(screen.getByTestId('custom')).toHaveAttribute('data-slot', 'input-group-control')
  })

  it('shows the error after the addons in the description', async () => {
    renderForm<Values>(schema, { price: '', bio: '' }, <RHFInputGroup name="price" label="Price" inlineEnd="THB" required />)
    await userEvent.click(screen.getByRole('button', { name: 'submit' }))
    await screen.findByText('กรอกราคา')
    const input = screen.getByRole('textbox', { name: 'Price' })
    expect(input).toHaveAccessibleDescription('THB กรอกราคา')
    expect(input).toBeRequired()
  })

  it('has no a11y violations', async () => {
    const { container } = renderForm<Values>(schema, { price: '', bio: '' }, <RHFInputGroup name="price" label="Price" inlineStart="฿" />)
    await expectNoA11yViolations(container)
  })
})
