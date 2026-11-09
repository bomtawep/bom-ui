import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Input } from '../Input'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from './Field'

describe('Field', () => {
  it('lays out label, control, description and error', async () => {
    const { container } = render(
      <FieldSet>
        <FieldLegend>Profile</FieldLegend>
        <FieldGroup>
          <Field data-invalid orientation="horizontal">
            <FieldLabel htmlFor="e">Email</FieldLabel>
            <Input id="e" aria-invalid aria-describedby="e-d e-e" />
            <FieldDescription id="e-d">Work email</FieldDescription>
            <FieldError id="e-e" errors={[{ message: 'Required' }]} />
          </Field>
        </FieldGroup>
      </FieldSet>,
    )
    expect(screen.getByRole('group', { name: 'Profile' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription('Work email Required')
    expect(container.querySelector('[data-slot="field"]')).toHaveAttribute('data-orientation', 'horizontal')
    await expectNoA11yViolations(container)
  })

  it('FieldError dedupes messages and lists several, or renders nothing', () => {
    const { container, rerender } = render(<FieldError errors={[{ message: 'A' }, { message: 'A' }, { message: 'B' }]} />)
    expect(screen.getByRole('alert').querySelectorAll('li')).toHaveLength(2)
    rerender(<FieldError errors={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('FieldSeparator shows its content', () => {
    render(<FieldSeparator>หรือ</FieldSeparator>)
    expect(screen.getByText('หรือ')).toBeInTheDocument()
  })
})
