import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { renderForm } from '../../test-utils/form'
import { RHFSelect, type RHFSelectGroup, type RHFSelectOption } from './RHFSelect'

const schema = z.object({ city: z.string().min(1, 'เลือกจังหวัด') })
type Values = z.infer<typeof schema>

const flat: RHFSelectOption[] = [
  { value: 'bkk', label: 'กรุงเทพฯ' },
  { value: 'cm', label: 'เชียงใหม่' },
  { value: 'pk', label: 'ภูเก็ต', disabled: true },
]
const grouped: RHFSelectGroup[] = [
  { label: 'เหนือ', options: [{ value: 'cm', label: 'เชียงใหม่' }] },
  { label: 'ใต้', options: [{ value: 'pk', label: 'ภูเก็ต' }] },
]

describe('RHFSelect', () => {
  it('shows the placeholder and selects an option with the keyboard', async () => {
    const { form } = renderForm<Values>(schema, { city: '' }, <RHFSelect name="city" label="City" placeholder="เลือก" options={flat} />)
    const trigger = screen.getByRole('combobox', { name: 'City' })
    expect(trigger).toHaveTextContent('เลือก')
    expect(trigger).toHaveClass('w-full')
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    await userEvent.click(await screen.findByRole('option', { name: 'เชียงใหม่' }))
    expect(form.methods!.getValues('city')).toBe('cm')
    expect(trigger).toHaveTextContent('เชียงใหม่')
  })

  it('marks the field touched when the list closes', async () => {
    const { form } = renderForm<Values>(schema, { city: '' }, <RHFSelect name="city" label="City" options={flat} />)
    screen.getByRole('combobox').focus()
    await userEvent.keyboard('{Enter}')
    await screen.findByRole('listbox')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(form.methods!.getFieldState('city').isTouched).toBe(true))
  })

  it('renders groups with labels and separators', async () => {
    renderForm<Values>(schema, { city: '' }, <RHFSelect name="city" label="City" options={grouped} />)
    screen.getByRole('combobox').focus()
    await userEvent.keyboard('{Enter}')
    await screen.findByRole('listbox')
    expect(screen.getByText('เหนือ')).toHaveAttribute('data-slot', 'select-label')
    expect(document.querySelector('[data-slot="select-separator"]')).toBeInTheDocument()
  })

  it('announces required and shows the error', async () => {
    renderForm<Values>(schema, { city: '' }, <RHFSelect name="city" label="City" options={flat} required description="d" />)
    const trigger = screen.getByRole('combobox', { name: 'City' })
    expect(trigger).toHaveAttribute('aria-required', 'true')
    await userEvent.click(screen.getByRole('button', { name: 'submit' }))
    await screen.findByText('เลือกจังหวัด')
    expect(trigger).toHaveAttribute('aria-invalid', 'true')
    expect(trigger).toHaveAccessibleDescription('d เลือกจังหวัด')
  })

  it('supports horizontal orientation, size and a custom trigger class', () => {
    const { container } = renderForm<Values>(
      schema,
      { city: '' },
      <RHFSelect name="city" label="City" options={flat} orientation="horizontal" size="sm" triggerClassName="w-40" disabled />,
    )
    expect(container.querySelector('[data-slot="field"][data-orientation="horizontal"]')).toBeInTheDocument()
    const trigger = screen.getByRole('combobox')
    expect(trigger).toHaveAttribute('data-size', 'sm')
    expect(trigger).toHaveClass('w-40')
    expect(trigger).not.toHaveClass('w-full')
    expect(trigger).toBeDisabled()
  })

  it('has no a11y violations', async () => {
    const { container } = renderForm<Values>(schema, { city: '' }, <RHFSelect name="city" label="City" options={flat} />)
    await expectNoA11yViolations(container)
  })
})
