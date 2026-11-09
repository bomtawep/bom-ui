import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'
import { FormProvider } from './FormProvider'

describe('FormProvider', () => {
  it('renders a noValidate form that submits through handleSubmit', async () => {
    const onValid = vi.fn()
    function Demo() {
      const methods = useForm({ defaultValues: { a: 'x' } })
      return (
        <FormProvider methods={methods} onSubmit={methods.handleSubmit(onValid)} aria-label="Demo" className="extra">
          <button type="submit">go</button>
        </FormProvider>
      )
    }
    render(<Demo />)
    const form = screen.getByRole('form', { name: 'Demo' })
    expect(form).toHaveAttribute('novalidate')
    expect(form).toHaveClass('extra')
    await userEvent.click(screen.getByRole('button', { name: 'go' }))
    expect(onValid).toHaveBeenCalledWith({ a: 'x' }, expect.anything())
  })
})
