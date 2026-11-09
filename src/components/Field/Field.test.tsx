import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Input } from '../Input'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from './Field'

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
    expect(container.querySelector('.bom-field')).toHaveClass('bom-field--horizontal')
    await expectNoA11yViolations(container)
  })

  it('defaults to vertical orientation', () => {
    render(<Field data-testid="f" />)
    expect(screen.getByTestId('f')).toHaveClass('bom-field', 'bom-field--vertical')
    expect(screen.getByTestId('f')).toHaveAttribute('data-orientation', 'vertical')
  })

  it.each(['vertical', 'horizontal', 'responsive'] as const)('applies the %s orientation', (o) => {
    render(<Field data-testid="f" orientation={o} />)
    expect(screen.getByTestId('f')).toHaveClass(`bom-field--${o}`)
  })

  it('FieldError dedupes messages and lists several', () => {
    render(<FieldError errors={[{ message: 'A' }, { message: 'A' }, { message: 'B' }, undefined]} />)
    const alert = screen.getByRole('alert')
    expect(alert.querySelectorAll('li')).toHaveLength(2)
  })

  it('FieldError shows a single message as text', () => {
    render(<FieldError errors={[{ message: 'A' }, { message: 'A' }]} />)
    expect(screen.getByRole('alert')).toHaveTextContent(/^A$/)
  })

  it('FieldError renders nothing without messages', () => {
    const { container } = render(<FieldError errors={[undefined]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('FieldError prefers children', () => {
    render(<FieldError errors={[{ message: 'A' }]}>Custom</FieldError>)
    expect(screen.getByRole('alert')).toHaveTextContent('Custom')
  })

  it('FieldSeparator shows its content', () => {
    render(<FieldSeparator>หรือ</FieldSeparator>)
    expect(screen.getByText('หรือ')).toHaveClass('bom-field-separator__content')
  })

  it('FieldLegend supports the label variant', () => {
    render(
      <fieldset>
        <FieldLegend variant="label">L</FieldLegend>
      </fieldset>,
    )
    expect(screen.getByText('L')).toHaveClass('bom-field-legend--label')
  })

  it('appends className and forwards refs on every part', () => {
    const refs = {
      set: createRef<HTMLFieldSetElement>(),
      legend: createRef<HTMLLegendElement>(),
      group: createRef<HTMLDivElement>(),
      field: createRef<HTMLDivElement>(),
      content: createRef<HTMLDivElement>(),
      label: createRef<HTMLLabelElement>(),
      title: createRef<HTMLDivElement>(),
      desc: createRef<HTMLParagraphElement>(),
      sep: createRef<HTMLDivElement>(),
      error: createRef<HTMLDivElement>(),
    }
    render(
      <FieldSet ref={refs.set} className="x">
        <FieldLegend ref={refs.legend}>L</FieldLegend>
        <FieldGroup ref={refs.group}>
          <Field ref={refs.field}>
            <FieldContent ref={refs.content}>
              <FieldLabel ref={refs.label}>a</FieldLabel>
              <FieldTitle ref={refs.title}>t</FieldTitle>
              <FieldDescription ref={refs.desc}>d</FieldDescription>
            </FieldContent>
            <FieldSeparator ref={refs.sep} />
            <FieldError ref={refs.error}>e</FieldError>
          </Field>
        </FieldGroup>
      </FieldSet>,
    )
    expect(refs.set.current).toHaveClass('bom-field-set', 'x')
    expect(refs.legend.current).toBeInstanceOf(HTMLLegendElement)
    expect(refs.group.current).toHaveClass('bom-field-group')
    expect(refs.field.current).toHaveClass('bom-field')
    expect(refs.content.current).toHaveClass('bom-field__content')
    expect(refs.label.current).toHaveClass('bom-field__label', 'bom-label')
    expect(refs.title.current).toHaveClass('bom-field__title')
    expect(refs.desc.current).toHaveClass('bom-field__description')
    expect(refs.sep.current).toHaveClass('bom-field-separator')
    expect(refs.error.current).toHaveClass('bom-field__error')
  })

  it('has displayNames', () => {
    for (const C of [
      Field,
      FieldContent,
      FieldDescription,
      FieldError,
      FieldGroup,
      FieldLabel,
      FieldLegend,
      FieldSeparator,
      FieldSet,
      FieldTitle,
    ]) {
      expect(C.displayName).toBeTruthy()
    }
    expect(FieldError.displayName).toBe('FieldError')
  })
})
