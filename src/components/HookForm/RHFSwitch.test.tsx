import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { renderForm } from '../../test-utils/form'
import { RHFSwitch } from './RHFSwitch'

const schema = z.object({ notify: z.boolean().refine((v) => v, 'ต้องเปิด') })
type Values = z.infer<typeof schema>

describe('RHFSwitch', () => {
  it('toggles the boolean value', async () => {
    const { form } = renderForm<Values>(schema, { notify: false }, <RHFSwitch name="notify" label="Notify" />)
    await userEvent.click(screen.getByRole('switch', { name: 'Notify' }))
    expect(form.methods!.getValues('notify')).toBe(true)
  })

  it('shows the error and describes the switch', async () => {
    renderForm<Values>(schema, { notify: false }, <RHFSwitch name="notify" label="Notify" description="Email me" />)
    await userEvent.click(screen.getByRole('button', { name: 'submit' }))
    await screen.findByText('ต้องเปิด')
    const sw = screen.getByRole('switch', { name: 'Notify' })
    expect(sw).toHaveAccessibleDescription('Email me ต้องเปิด')
    expect(sw).toHaveAttribute('aria-invalid', 'true')
  })

  it('card variant: the whole card toggles and the name is the title only', async () => {
    const { form, container } = renderForm<Values>(
      schema,
      { notify: false },
      <RHFSwitch name="notify" label="Notify" description="Email me" variant="card" />,
    )
    const sw = screen.getByRole('switch', { name: 'Notify' })
    expect(container.querySelector('.bom-field__label > .bom-field')).toBeInTheDocument()
    await userEvent.click(screen.getByText('Email me'))
    expect(form.methods!.getValues('notify')).toBe(true)
    expect(sw).toHaveAttribute('aria-checked', 'true')
  })

  it('places the switch first with labelPosition="end" and applies size', () => {
    const { container } = renderForm<Values>(
      schema,
      { notify: false },
      <RHFSwitch name="notify" label="Notify" labelPosition="end" size="sm" disabled />,
    )
    const field = container.querySelector('.bom-field')!
    expect(field.firstElementChild).toHaveClass('bom-switch', 'bom-switch--sm')
    expect(screen.getByRole('switch')).toBeDisabled()
  })

  it('has no a11y violations', async () => {
    const { container } = renderForm<Values>(schema, { notify: false }, <RHFSwitch name="notify" label="Notify" variant="card" description="d" />)
    await expectNoA11yViolations(container)
  })
})
