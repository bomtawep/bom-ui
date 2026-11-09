'use client'

import type { ReactNode } from 'react'
import { useController, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import { useFieldIds } from '../../lib/use-field-ids'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldTitle } from '../Field/Field'
import { Switch, type SwitchSize } from '../Switch/Switch'

export type RHFSwitchProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>
  label: ReactNode
  description?: ReactNode
  /** 'start' = label left, switch right (default); 'end' = switch before the label. */
  labelPosition?: 'start' | 'end'
  /** 'card' = the whole card is the label, click anywhere to toggle. */
  variant?: 'default' | 'card'
  size?: SwitchSize
  disabled?: boolean
  /**
   * Radix sets aria-required, but Chrome does not announce required on role="switch" —
   * say it in the label or description too if it matters.
   */
  required?: boolean
  className?: string
}

export function RHFSwitch<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  labelPosition = 'start',
  variant = 'default',
  size,
  disabled,
  required,
  className,
}: RHFSwitchProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()
  const { field, fieldState } = useController({ name, control })
  const invalid = fieldState.invalid
  const isDisabled = disabled || field.disabled
  const isCard = variant === 'card'
  const { fieldId, labelId, descriptionId, errorId, describedBy } = useFieldIds('rhf-switch', name, {
    description,
    invalid,
  })

  const switchEl = (
    <Switch
      id={fieldId}
      ref={field.ref}
      name={field.name}
      checked={!!field.value}
      onCheckedChange={field.onChange}
      onBlur={field.onBlur}
      disabled={isDisabled}
      required={required}
      size={size}
      aria-invalid={invalid}
      aria-describedby={describedBy}
      // card: the label wraps the whole card and would include the description, so name it by the title only
      aria-labelledby={isCard ? labelId : undefined}
    />
  )
  const content = (
    <FieldContent>
      {isCard ? <FieldTitle id={labelId}>{label}</FieldTitle> : <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>}
      {description && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
      {invalid && <FieldError id={errorId} errors={[fieldState.error]} />}
    </FieldContent>
  )
  const row = (
    <Field
      orientation="horizontal"
      data-invalid={invalid || undefined}
      data-disabled={isDisabled || undefined}
      className={isCard ? undefined : className}
    >
      {labelPosition === 'end' ? (
        <>
          {switchEl}
          {content}
        </>
      ) : (
        <>
          {content}
          {switchEl}
        </>
      )}
    </Field>
  )

  return isCard ? (
    <FieldLabel htmlFor={fieldId} className={className}>
      {row}
    </FieldLabel>
  ) : (
    row
  )
}
