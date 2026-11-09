'use client'

import { useRef, type ReactNode } from 'react'
import { useController, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import { cn } from '../../lib/cn'
import { useFieldIds } from '../../lib/use-field-ids'
import { Checkbox } from '../Checkbox/Checkbox'
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
import { RequiredMark } from './RequiredMark'

export type RHFCheckboxOption = {
  value: string
  label: ReactNode
  description?: ReactNode
  disabled?: boolean
}

type BaseProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>
  /** Field name (or group legend) — always required for screen readers. Hide it visually with hideLabel. */
  label: ReactNode
  hideLabel?: boolean
  description?: ReactNode
  /** 'card' = the whole card is the label, click anywhere to tick. */
  variant?: 'default' | 'card'
  disabled?: boolean
  className?: string
}

/** No options = a single checkbox; the value is a boolean. */
export type RHFCheckboxSingleProps<TFieldValues extends FieldValues = FieldValues> = BaseProps<TFieldValues> & {
  options?: undefined
  required?: boolean
}

/**
 * options = a checkbox group; the value is string[] of ticked values.
 * No per-item required (that would force every box) — require at least one with zod `.min(1)`.
 */
export type RHFCheckboxGroupProps<TFieldValues extends FieldValues = FieldValues> = BaseProps<TFieldValues> & {
  options: RHFCheckboxOption[]
  orientation?: 'vertical' | 'horizontal'
}

export type RHFCheckboxProps<TFieldValues extends FieldValues = FieldValues> =
  | RHFCheckboxSingleProps<TFieldValues>
  | RHFCheckboxGroupProps<TFieldValues>

export function RHFCheckbox<TFieldValues extends FieldValues = FieldValues>(props: RHFCheckboxProps<TFieldValues>) {
  return props.options ? <CheckboxGroup {...props} /> : <SingleCheckbox {...props} />
}

function SingleCheckbox<TFieldValues extends FieldValues>({
  name,
  label,
  hideLabel,
  description,
  variant = 'default',
  disabled,
  required,
  className,
}: RHFCheckboxSingleProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()
  const { field, fieldState } = useController({ name, control })
  const invalid = fieldState.invalid
  const isDisabled = disabled || field.disabled
  const isCard = variant === 'card'
  const { fieldId, labelId, descriptionId, errorId, describedBy } = useFieldIds('rhf-checkbox', name, {
    description,
    invalid,
  })
  const requiredMark = required && <RequiredMark />

  const row = (
    <Field
      orientation="horizontal"
      data-invalid={invalid || undefined}
      data-disabled={isDisabled || undefined}
      className={isCard ? undefined : className}
    >
      <Checkbox
        id={fieldId}
        ref={field.ref}
        name={field.name}
        checked={!!field.value}
        // onCheckedChange can report "indeterminate"; the form only stores booleans
        onCheckedChange={(v) => field.onChange(v === true)}
        onBlur={field.onBlur}
        disabled={isDisabled}
        required={required}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        // card: the label wraps the whole card and would include the description, so name it by the title only
        aria-labelledby={isCard ? labelId : undefined}
      />
      <FieldContent>
        {isCard ? (
          <FieldTitle id={labelId}>
            {label}
            {requiredMark}
          </FieldTitle>
        ) : (
          <FieldLabel
            htmlFor={fieldId}
            className={hideLabel ? 'bom-sr-only' : description ? undefined : 'bom-field__label--normal'}
          >
            {label}
            {requiredMark}
          </FieldLabel>
        )}
        {description && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
        {invalid && <FieldError id={errorId} errors={[fieldState.error]} />}
      </FieldContent>
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

function CheckboxGroup<TFieldValues extends FieldValues>({
  name,
  label,
  hideLabel,
  description,
  options,
  variant = 'default',
  orientation = 'vertical',
  disabled,
  className,
}: RHFCheckboxGroupProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()
  const { field, fieldState } = useController({ name, control })
  const invalid = fieldState.invalid
  const isDisabled = disabled || field.disabled
  const isCard = variant === 'card'
  const values: string[] = Array.isArray(field.value) ? field.value : []
  // the fieldset is a group named by its legend; the group's description and error are linked to it
  const { fieldId, descriptionId, errorId, describedBy } = useFieldIds('rhf-checkbox', name, { description, invalid })
  const groupRef = useRef<HTMLFieldSetElement | null>(null)

  // RHF calls ref.focus() on a failed submit; a fieldset cannot take focus, so focus the first enabled box
  const focusTarget = {
    focus: () => {
      groupRef.current?.querySelector<HTMLButtonElement>('[role="checkbox"]:not(:disabled)')?.focus()
    },
  }
  const toggle = (value: string, checked: boolean) =>
    field.onChange(checked ? [...values.filter((v) => v !== value), value] : values.filter((v) => v !== value))

  return (
    <FieldSet
      ref={(el) => {
        groupRef.current = el
        field.ref(el ? focusTarget : null)
      }}
      data-invalid={invalid || undefined}
      data-disabled={isDisabled || undefined}
      aria-describedby={describedBy}
      onBlur={(e) => {
        // blur only when focus leaves the group, not when moving between options
        if (!e.currentTarget.contains(e.relatedTarget)) field.onBlur()
      }}
      className={className}
    >
      <FieldLegend variant="label" className={hideLabel ? 'bom-sr-only' : undefined}>
        {label}
      </FieldLegend>
      {description && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
      <div className={cn('bom-field__options', orientation === 'horizontal' && 'bom-field__options--horizontal')}>
        {options.map((o, i) => {
          const itemId = `${fieldId}-${i}`
          const titleId = `${itemId}-title`
          const itemDescriptionId = `${itemId}-description`
          const itemDisabled = isDisabled || o.disabled
          const item = (
            <Checkbox
              id={itemId}
              name={field.name}
              value={o.value}
              checked={values.includes(o.value)}
              onCheckedChange={(v) => toggle(o.value, v === true)}
              disabled={itemDisabled}
              aria-invalid={invalid}
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
                  {item}
                  <FieldContent>
                    <FieldTitle id={titleId}>{o.label}</FieldTitle>
                    {itemDescription}
                  </FieldContent>
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
      </div>
      {invalid && <FieldError id={errorId} errors={[fieldState.error]} />}
    </FieldSet>
  )
}
