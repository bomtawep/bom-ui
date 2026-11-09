'use client'

import type { ReactNode } from 'react'
import { useController, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import { useFieldIds } from '../../lib/use-field-ids'
import { Field, FieldDescription, FieldError, FieldLabel } from '../Field/Field'
import { Textarea, type TextareaProps } from '../Textarea/Textarea'
import { RequiredMark } from './RequiredMark'

export type RHFTextAreaProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  TextareaProps,
  'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'id'
> & {
  name: FieldPath<TFieldValues>
  /** Always required: it names the field for screen readers. Hide it visually with hideLabel. */
  label: ReactNode
  hideLabel?: boolean
  description?: ReactNode
  /** 'top' = between label and box, 'bottom' = below the box (default). */
  descriptionPosition?: 'top' | 'bottom'
  fieldClassName?: string
}

export function RHFTextArea<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  hideLabel,
  description,
  descriptionPosition = 'bottom',
  disabled,
  required,
  fieldClassName,
  ...textareaProps
}: RHFTextAreaProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()
  const { field, fieldState } = useController({ name, control })
  const invalid = fieldState.invalid
  const isDisabled = disabled || field.disabled
  const { fieldId, descriptionId, errorId, describedBy } = useFieldIds('rhf-textarea', name, { description, invalid })
  const descriptionEl = description && <FieldDescription id={descriptionId}>{description}</FieldDescription>

  return (
    <Field data-invalid={invalid || undefined} data-disabled={isDisabled || undefined} className={fieldClassName}>
      <FieldLabel htmlFor={fieldId} className={hideLabel ? 'bom-sr-only' : undefined}>
        {label}
        {required && <RequiredMark />}
      </FieldLabel>
      {descriptionPosition === 'top' && descriptionEl}
      <Textarea
        {...textareaProps}
        id={fieldId}
        ref={field.ref}
        name={field.name}
        value={field.value ?? ''}
        onChange={field.onChange}
        onBlur={field.onBlur}
        disabled={isDisabled}
        required={required}
        aria-invalid={invalid}
        aria-describedby={describedBy}
      />
      {descriptionPosition === 'bottom' && descriptionEl}
      {invalid && <FieldError id={errorId} errors={[fieldState.error]} />}
    </Field>
  )
}
