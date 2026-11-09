import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { renderForm } from '../../test-utils/form'
import { RHFInput } from './RHFInput'

const schema = z.object({ email: z.string().min(1, 'กรอกอีเมล'), files: z.array(z.instanceof(File)).optional() })
type Values = z.infer<typeof schema>

describe('RHFInput', () => {
  it('writes typed text into the form', async () => {
    const { form } = renderForm<Values>(schema, { email: '' }, <RHFInput name="email" label="Email" />)
    await userEvent.type(screen.getByRole('textbox', { name: 'Email' }), 'a@b.co')
    expect(form.methods!.getValues('email')).toBe('a@b.co')
  })

  it('shows the schema error and links it with aria-describedby', async () => {
    renderForm<Values>(schema, { email: '' }, <RHFInput name="email" label="Email" description="Work email" />)
    await userEvent.click(screen.getByRole('button', { name: 'submit' }))
    const input = screen.getByRole('textbox', { name: 'Email' })
    expect(await screen.findByText('กรอกอีเมล')).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Work email กรอกอีเมล')
  })

  it('submits valid values', async () => {
    const { form } = renderForm<Values>(schema, { email: '' }, <RHFInput name="email" label="Email" />)
    await userEvent.type(screen.getByRole('textbox', { name: 'Email' }), 'x@y.z')
    await userEvent.click(screen.getByRole('button', { name: 'submit' }))
    await waitFor(() => expect(form.submitted).toEqual([{ email: 'x@y.z' }]))
  })

  it('marks required with a hidden asterisk and the native attribute', () => {
    renderForm<Values>(schema, { email: '' }, <RHFInput name="email" label="Email" required />)
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeRequired()
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true')
  })

  it('disables the input', () => {
    renderForm<Values>(schema, { email: '' }, <RHFInput name="email" label="Email" disabled />)
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeDisabled()
  })

  it('keeps ids unique when the same name renders twice', () => {
    renderForm<Values>(
      schema,
      { email: '' },
      <>
        <RHFInput name="email" label="A" />
        <RHFInput name="email" label="B" />
      </>,
    )
    expect(screen.getByRole('textbox', { name: 'A' }).id).not.toBe(screen.getByRole('textbox', { name: 'B' }).id)
  })

  it('stores files as File[] and clears the input on reset', async () => {
    const { form, container } = renderForm<Values>(
      schema,
      { email: '', files: [] },
      <RHFInput name="files" label="Files" type="file" />,
    )
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['x'], 'a.pdf', { type: 'application/pdf' })
    await userEvent.upload(input, file)
    expect(form.methods!.getValues('files')).toEqual([file])
    act(() => form.methods!.reset({ email: '', files: [] }))
    expect(input.value).toBe('')
  })

  it('renders addons in an InputGroup and append next to it', () => {
    const { container } = renderForm<Values>(
      schema,
      { email: '' },
      <RHFInput name="email" label="Email" startAddon="@" append={<button type="button">Go</button>} attachAppend />,
    )
    expect(container.querySelector('.bom-input-group')).toBeInTheDocument()
    expect(container.querySelector('.bom-button-group')).toHaveClass('bom-button-group--full')
  })

  it('separates a non-attached append with a gap', () => {
    const { container } = renderForm<Values>(
      schema,
      { email: '' },
      <RHFInput name="email" label="Email" append={<button type="button">Go</button>} />,
    )
    expect(container.querySelector('.bom-field__append')).toBeInTheDocument()
  })

  it('supports a horizontal layout and hidden label', () => {
    const { container } = renderForm<Values>(
      schema,
      { email: '' },
      <RHFInput name="email" label="Email" hideLabel orientation="horizontal" />,
    )
    expect(container.querySelector('.bom-field--horizontal')).toBeInTheDocument()
    expect(screen.getByText('Email')).toHaveClass('bom-sr-only')
  })

  it('has no a11y violations with an error', async () => {
    const { container } = renderForm<Values>(schema, { email: '' }, <RHFInput name="email" label="Email" description="d" />)
    await userEvent.click(screen.getByRole('button', { name: 'submit' }))
    await screen.findByText('กรอกอีเมล')
    await expectNoA11yViolations(container)
  })
})
