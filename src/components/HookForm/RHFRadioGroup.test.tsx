import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { renderForm } from '../../test-utils/form'
import { RHFRadioGroup, type RHFRadioOption } from './RHFRadioGroup'

const schema = z.object({ plan: z.string().min(1, 'เลือกแพ็กเกจ') })
type Values = z.infer<typeof schema>

const options: RHFRadioOption[] = [
  { value: 'basic', label: 'Basic' },
  { value: 'pro', label: 'Pro', description: 'For teams' },
  { value: 'ent', label: 'Enterprise', disabled: true },
]

describe('RHFRadioGroup', () => {
  it('is a radiogroup named by the legend; clicking selects', async () => {
    const { form } = renderForm<Values>(schema, { plan: '' }, <RHFRadioGroup name="plan" label="Plan" options={options} />)
    expect(screen.getByRole('radiogroup', { name: 'Plan' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('radio', { name: 'Pro' }))
    expect(form.methods!.getValues('plan')).toBe('pro')
  })

  it('moves with arrow keys and selects with Space', async () => {
    const { form } = renderForm<Values>(schema, { plan: 'basic' }, <RHFRadioGroup name="plan" label="Plan" options={options} />)
    await userEvent.tab()
    expect(screen.getByRole('radio', { name: 'Basic' })).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(screen.getByRole('radio', { name: 'Pro' })).toHaveFocus())
    await userEvent.keyboard(' ')
    expect(form.methods!.getValues('plan')).toBe('pro')
  })

  it('describes an option, disables one and announces required', () => {
    renderForm<Values>(schema, { plan: '' }, <RHFRadioGroup name="plan" label="Plan" options={options} required />)
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveAccessibleDescription('For teams')
    expect(screen.getByRole('radio', { name: 'Enterprise' })).toBeDisabled()
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-required', 'true')
  })

  it('shows the error on the group and focuses the first radio on a failed submit', async () => {
    renderForm<Values>(schema, { plan: '' }, <RHFRadioGroup name="plan" label="Plan" options={options} description="Pick one" />)
    await userEvent.click(screen.getByRole('button', { name: 'submit' }))
    await screen.findByText('เลือกแพ็กเกจ')
    expect(screen.getByRole('radiogroup')).toHaveAccessibleDescription('Pick one เลือกแพ็กเกจ')
    await waitFor(() => expect(screen.getByRole('radio', { name: 'Basic' })).toHaveFocus())
  })

  it('card variant names each radio by its title', async () => {
    const { form } = renderForm<Values>(schema, { plan: '' }, <RHFRadioGroup name="plan" label="Plan" options={options} variant="card" />)
    await userEvent.click(screen.getByText('For teams'))
    expect(form.methods!.getValues('plan')).toBe('pro')
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked()
  })

  it('passes horizontal orientation to the group', () => {
    renderForm<Values>(schema, { plan: '' }, <RHFRadioGroup name="plan" label="Plan" options={options} orientation="horizontal" />)
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-orientation', 'horizontal')
  })

  it('has no a11y violations', async () => {
    const { container } = renderForm<Values>(schema, { plan: '' }, <RHFRadioGroup name="plan" label="Plan" options={options} description="d" />)
    await expectNoA11yViolations(container)
  })
})
