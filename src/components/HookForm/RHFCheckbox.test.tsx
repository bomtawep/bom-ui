import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { renderForm } from '../../test-utils/form'
import { RHFCheckbox, type RHFCheckboxOption } from './RHFCheckbox'

const schema = z.object({
  agree: z.boolean().refine((v) => v, 'ต้องยอมรับ'),
  channels: z.array(z.string()).min(1, 'เลือกอย่างน้อยหนึ่ง'),
})
type Values = z.infer<typeof schema>
const defaults: Values = { agree: false, channels: [] }

const options: RHFCheckboxOption[] = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS', description: 'Charges apply' },
  { value: 'fax', label: 'Fax', disabled: true },
]

describe('RHFCheckbox (single)', () => {
  it('stores a boolean', async () => {
    const { form } = renderForm<Values>(schema, defaults, <RHFCheckbox name="agree" label="I agree" />)
    await userEvent.click(screen.getByRole('checkbox', { name: 'I agree' }))
    expect(form.methods!.getValues('agree')).toBe(true)
  })

  it('shows the error linked to the checkbox and the required mark', async () => {
    renderForm<Values>(schema, defaults, <RHFCheckbox name="agree" label="I agree" required description="Terms" />)
    await userEvent.click(screen.getByRole('button', { name: 'submit' }))
    await screen.findByText('ต้องยอมรับ')
    const box = screen.getByRole('checkbox', { name: 'I agree' })
    expect(box).toHaveAccessibleDescription('Terms ต้องยอมรับ')
    expect(box).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true')
  })

  it('card variant names the box by its title', async () => {
    const { form } = renderForm<Values>(
      schema,
      defaults,
      <RHFCheckbox name="agree" label="I agree" description="Long terms text" variant="card" />,
    )
    expect(screen.getByRole('checkbox', { name: 'I agree' })).toBeInTheDocument()
    await userEvent.click(screen.getByText('Long terms text'))
    expect(form.methods!.getValues('agree')).toBe(true)
  })
})

describe('RHFCheckbox (group)', () => {
  it('is a group named by the legend and stores ticked values', async () => {
    const { form } = renderForm<Values>(schema, defaults, <RHFCheckbox name="channels" label="Channels" options={options} />)
    expect(screen.getByRole('group', { name: 'Channels' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('checkbox', { name: 'SMS' }))
    await userEvent.click(screen.getByRole('checkbox', { name: 'Email' }))
    expect(form.methods!.getValues('channels')).toEqual(['sms', 'email'])
    await userEvent.click(screen.getByRole('checkbox', { name: 'SMS' }))
    expect(form.methods!.getValues('channels')).toEqual(['email'])
  })

  it('describes an option and disables one', () => {
    renderForm<Values>(schema, defaults, <RHFCheckbox name="channels" label="Channels" options={options} />)
    expect(screen.getByRole('checkbox', { name: 'SMS' })).toHaveAccessibleDescription('Charges apply')
    expect(screen.getByRole('checkbox', { name: 'Fax' })).toBeDisabled()
  })

  it('links the group error and focuses the first box on a failed submit', async () => {
    renderForm<Values>(schema, { agree: true, channels: [] }, <RHFCheckbox name="channels" label="Channels" options={options} />)
    await userEvent.click(screen.getByRole('button', { name: 'submit' }))
    await screen.findByText('เลือกอย่างน้อยหนึ่ง')
    expect(screen.getByRole('group', { name: 'Channels' })).toHaveAccessibleDescription('เลือกอย่างน้อยหนึ่ง')
    await waitFor(() => expect(screen.getByRole('checkbox', { name: 'Email' })).toHaveFocus())
  })

  it('lays out horizontally', () => {
    const { container } = renderForm<Values>(
      schema,
      defaults,
      <RHFCheckbox name="channels" label="Channels" options={options} orientation="horizontal" />,
    )
    expect(container.querySelector('[data-slot="checkbox-group"]')).toHaveClass('flex-wrap')
  })

  it('has no a11y violations (default and card)', async () => {
    const { container } = renderForm<Values>(
      schema,
      defaults,
      <>
        <RHFCheckbox name="channels" label="Channels" options={options} description="d" />
        <RHFCheckbox name="agree" label="Agree" variant="card" description="d" />
      </>,
    )
    await expectNoA11yViolations(container)
  })
})
