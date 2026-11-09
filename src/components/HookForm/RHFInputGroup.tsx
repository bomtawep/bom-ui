'use client'

import type { ChangeEvent, ReactNode, RefCallback, TextareaHTMLAttributes } from 'react'
import { useController, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import { useFieldIds } from '../../lib/use-field-ids'
import { Field, FieldDescription, FieldError, FieldLabel } from '../Field/Field'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupTextarea } from '../InputGroup/InputGroup'
import type { InputProps } from '../Input/Input'
import { RequiredMark } from './RequiredMark'

/** A node, or a function of the current value (e.g. a "0/280" counter). */
export type RHFInputGroupAddon = ReactNode | ((value: string) => ReactNode)

/** Props for renderControl (custom input): spread them onto the element the user types into. */
export type RHFInputGroupControlProps = {
  id: string
  name: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur: () => void
  ref: RefCallback<HTMLInputElement | HTMLTextAreaElement>
  disabled?: boolean
  required?: boolean
  'aria-invalid': boolean
  'aria-describedby'?: string
  /** Gives the InputGroup its focus ring and removes the control's own border. */
  className: string
}

export type RHFInputGroupSlot = 'blockStart' | 'inlineStart' | 'inlineEnd' | 'blockEnd'

const slots = [
  ['blockStart', 'block-start'],
  ['inlineStart', 'inline-start'],
  ['inlineEnd', 'inline-end'],
  ['blockEnd', 'block-end'],
] as const

export type RHFInputGroupProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  InputProps,
  'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'id'
> & {
  name: FieldPath<TFieldValues>
  /** Always required: it names the field for screen readers. Hide it visually with hideLabel. */
  label: ReactNode
  hideLabel?: boolean
  description?: ReactNode
  /** 'top' = between label and box, 'bottom' = below the box (default). */
  descriptionPosition?: 'top' | 'bottom'
  /** true = textarea (pairs with blockStart / blockEnd). */
  multiline?: boolean
  rows?: number
  /** Position on screen comes from the slot; in the DOM addons follow the control, so Tab reaches the control first. */
  inlineStart?: RHFInputGroupAddon
  inlineEnd?: RHFInputGroupAddon
  blockStart?: RHFInputGroupAddon
  blockEnd?: RHFInputGroupAddon
  /**
   * Addon text ("$", "USD", "@company.com", a counter) explains the field, so it is linked with
   * aria-describedby by default. false = never; a list = only those slots (skip icon-only/button addons).
   */
  describeAddons?: boolean | RHFInputGroupSlot[]
  /** Custom input: render the control yourself and spread the given props onto it. */
  renderControl?: (props: RHFInputGroupControlProps) => ReactNode
  groupClassName?: string
  fieldClassName?: string
}

export function RHFInputGroup<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  hideLabel,
  description,
  descriptionPosition = 'bottom',
  multiline,
  inlineStart,
  inlineEnd,
  blockStart,
  blockEnd,
  describeAddons = true,
  renderControl,
  disabled,
  required,
  groupClassName,
  fieldClassName,
  ...controlProps
}: RHFInputGroupProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()
  const { field, fieldState } = useController({ name, control })
  const invalid = fieldState.invalid
  const isDisabled = disabled || field.disabled
  const value: string = field.value ?? ''
  const { fieldId, descriptionId, errorId } = useFieldIds('rhf-input-group', name, { description, invalid })
  const addons = { inlineStart, inlineEnd, blockStart, blockEnd }
  const used = slots.filter(([key]) => addons[key] != null && addons[key] !== false)

  // screen readers read the description, the addon text and the error after the field name
  const describedBy =
    [
      description ? descriptionId : null,
      ...used
        .filter(([key]) => (Array.isArray(describeAddons) ? describeAddons.includes(key) : describeAddons))
        .map(([key]) => `${fieldId}-${key}`),
      invalid ? errorId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined

  const props: RHFInputGroupControlProps = {
    id: fieldId,
    name: field.name,
    value,
    onChange: field.onChange,
    onBlur: field.onBlur,
    ref: field.ref,
    disabled: isDisabled,
    required,
    'aria-invalid': invalid,
    'aria-describedby': describedBy,
    className: 'bom-input-group__control',
  }

  const controlEl = renderControl ? (
    renderControl(props)
  ) : multiline ? (
    <InputGroupTextarea {...(controlProps as TextareaHTMLAttributes<HTMLTextAreaElement>)} {...props} />
  ) : (
    <InputGroupInput {...controlProps} {...props} />
  )
  const descriptionEl = description && <FieldDescription id={descriptionId}>{description}</FieldDescription>

  return (
    <Field data-invalid={invalid || undefined} data-disabled={isDisabled || undefined} className={fieldClassName}>
      <FieldLabel htmlFor={fieldId} className={hideLabel ? 'bom-sr-only' : undefined}>
        {label}
        {required && <RequiredMark />}
      </FieldLabel>
      {descriptionPosition === 'top' && descriptionEl}
      <InputGroup data-disabled={isDisabled || undefined} className={groupClassName}>
        {controlEl}
        {used.map(([key, align]) => {
          const addon = addons[key]
          return (
            <InputGroupAddon key={key} id={`${fieldId}-${key}`} align={align}>
              {typeof addon === 'function' ? addon(value) : addon}
            </InputGroupAddon>
          )
        })}
      </InputGroup>
      {descriptionPosition === 'bottom' && descriptionEl}
      {invalid && <FieldError id={errorId} errors={[fieldState.error]} />}
    </Field>
  )
}
