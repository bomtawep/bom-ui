import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { renderForm } from '../../test-utils/form'
import { RHFTextArea } from './RHFTextArea'

const schema = z.object({ note: z.string().min(3, 'อย่างน้อย 3 ตัวอักษร') })
type Values = z.infer<typeof schema>

describe('RHFTextArea', () => {
  it('writes typed text into the form', async () => {
    const { form } = renderForm<Values>(schema, { note: '' }, <RHFTextArea name="note" label="Note" />)
    await userEvent.type(screen.getByRole('textbox', { name: 'Note' }), 'hello')
    expect(form.methods!.getValues('note')).toBe('hello')
  })

  it('shows the error with description first or last', async () => {
    renderForm<Values>(schema, { note: '' }, <RHFTextArea name="note" label="Note" description="Short" descriptionPosition="top" />)
    await userEvent.click(screen.getByRole('button', { name: 'submit' }))
    await screen.findByText('อย่างน้อย 3 ตัวอักษร')
    const box = screen.getByRole('textbox', { name: 'Note' })
    expect(box).toHaveAccessibleDescription('Short อย่างน้อย 3 ตัวอักษร')
    expect(box).toHaveAttribute('aria-invalid', 'true')
    expect(box.previousElementSibling).toHaveTextContent('Short')
  })

  it('supports required, disabled and hideLabel', () => {
    renderForm<Values>(schema, { note: '' }, <RHFTextArea name="note" label="Note" required disabled hideLabel />)
    const box = screen.getByRole('textbox', { name: 'Note' })
    expect(box).toBeRequired()
    expect(box).toBeDisabled()
    expect(screen.getByText('Note')).toHaveClass('bom-sr-only')
  })

  it('has no a11y violations', async () => {
    const { container } = renderForm<Values>(schema, { note: '' }, <RHFTextArea name="note" label="Note" description="d" />)
    await userEvent.click(screen.getByRole('button', { name: 'submit' }))
    await screen.findByText('อย่างน้อย 3 ตัวอักษร')
    await expectNoA11yViolations(container)
  })
})
