'use client'

import { useRef, type ReactNode } from 'react'
import { useController, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import { useFieldIds } from '../../lib/use-field-ids'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '../Field/Field'
import { RadioGroup, RadioGroupItem } from '../RadioGroup/RadioGroup'
import { RequiredMark } from './RequiredMark'

export type RHFRadioOption = {
  value: string
  label: ReactNode
  description?: ReactNode
  disabled?: boolean
}

export type RHFRadioGroupProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>
  /** Group name (legend) — always required for screen readers. Hide it visually with hideLabel. */
  label: ReactNode
  hideLabel?: boolean
  description?: ReactNode
  options: RHFRadioOption[]
  /** 'card' = the whole card is the label, click anywhere to choose. */
  variant?: 'default' | 'card'
  /** Layout direction, and which arrow keys move between options. */
  orientation?: 'vertical' | 'horizontal'
  disabled?: boolean
  required?: boolean
  className?: string
}

export function RHFRadioGroup<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  hideLabel,
  description,
  options,
  variant = 'default',
  orientation = 'vertical',
  disabled,
  required,
  className,
}: RHFRadioGroupProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()
  const { field, fieldState } = useController({ name, control })
  const invalid = fieldState.invalid
  const isDisabled = disabled || field.disabled
  const isCard = variant === 'card'
  const { fieldId, labelId, descriptionId, errorId, describedBy } = useFieldIds('rhf-radio', name, {
    description,
    invalid,
  })
  const groupRef = useRef<HTMLDivElement | null>(null)

  // RHF calls ref.focus() on a failed submit; focus the checked radio, or the first enabled one
  const focusTarget = {
    focus: () => {
      const root = groupRef.current
      const radio =
        root?.querySelector<HTMLButtonElement>('[role="radio"][data-state="checked"]:not(:disabled)') ??
        root?.querySelector<HTMLButtonElement>('[role="radio"]:not(:disabled)')
      radio?.focus()
    },
  }

  return (
    // the radiogroup is named by the legend (aria-labelledby); drop the fieldset's group role so the name is not read twice
    <FieldSet role="none" data-invalid={invalid || undefined} data-disabled={isDisabled || undefined} className={className}>
      <FieldLegend id={labelId} variant="label" className={hideLabel ? 'bom-sr-only' : undefined}>
        {label}
        {required && <RequiredMark />}
      </FieldLegend>
      {description && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
      <RadioGroup
        ref={(el) => {
          groupRef.current = el
          field.ref(el ? focusTarget : null)
        }}
        name={field.name}
        value={field.value ?? ''}
        onValueChange={field.onChange}
        onBlur={(e) => {
          // blur only when focus leaves the group, not when moving between options
          if (!e.currentTarget.contains(e.relatedTarget)) field.onBlur()
        }}
        disabled={isDisabled}
        required={required}
        aria-required={required || undefined}
        orientation={orientation}
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        aria-invalid={invalid}
      >
        {options.map((o, i) => {
          const itemId = `${fieldId}-${i}`
          const titleId = `${itemId}-title`
          const itemDescriptionId = `${itemId}-description`
          const itemDisabled = isDisabled || o.disabled
          const item = (
            <RadioGroupItem
              id={itemId}
              value={o.value}
              disabled={o.disabled}
              aria-invalid={invalid}
              // card: the label wraps the whole card and would include the description, so name it by the title only
              aria-labelledby={isCard ? titleId : undefined}
              aria-describedby={o.description ? itemDescriptionId : undefined}
            />
          )
          const itemDescription = o.description && (
            <FieldDescription id={itemDescriptionId}>{o.description}</FieldDescription>
          )
          if (isCard) {
            return (
              <FieldLabel key={o.value} htmlFor={itemId}>
                <Field
                  orientation="horizontal"
                  data-invalid={invalid || undefined}
                  data-disabled={itemDisabled || undefined}
                >
                  <FieldContent>
                    <FieldTitle id={titleId}>{o.label}</FieldTitle>
                    {itemDescription}
                  </FieldContent>
                  {item}
                </Field>
              </FieldLabel>
            )
          }
          const itemLabel = (
            <FieldLabel htmlFor={itemId} className={o.description ? undefined : 'bom-field__label--normal'}>
              {o.label}
            </FieldLabel>
          )
          return (
            <Field
              key={o.value}
              orientation="horizontal"
              data-invalid={invalid || undefined}
              data-disabled={itemDisabled || undefined}
              className={orientation === 'horizontal' ? 'bom-field--auto' : undefined}
            >
              {item}
              {o.description ? (
                <FieldContent>
                  {itemLabel}
                  {itemDescription}
                </FieldContent>
              ) : (
                itemLabel
              )}
            </Field>
          )
        })}
      </RadioGroup>
      {invalid && <FieldError id={errorId} errors={[fieldState.error]} />}
    </FieldSet>
  )
}
