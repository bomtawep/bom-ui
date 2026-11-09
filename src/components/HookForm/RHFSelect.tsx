'use client'

import { Fragment, type ReactNode } from 'react'
import { useController, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import { cn } from '../../lib/cn'
import { useFieldIds } from '../../lib/use-field-ids'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '../Field/Field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type SelectTriggerSize,
} from '../Select/Select'
import { RequiredMark } from './RequiredMark'

export type RHFSelectOption = {
  value: string
  label: ReactNode
  disabled?: boolean
}

export type RHFSelectGroup = {
  label?: ReactNode
  options: RHFSelectOption[]
}

export type RHFSelectProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>
  label?: ReactNode
  description?: ReactNode
  placeholder?: string
  /** Flat options, or groups (separators are added between groups). */
  options?: Array<RHFSelectOption | RHFSelectGroup>
  /** Your own SelectItem / SelectGroup instead of options, for custom layouts. */
  children?: ReactNode
  disabled?: boolean
  required?: boolean
  size?: SelectTriggerSize
  /** 'item-aligned' = the selected item overlays the trigger (default); 'popper' = opens below. */
  position?: 'item-aligned' | 'popper'
  orientation?: 'vertical' | 'horizontal' | 'responsive'
  className?: string
  /** Replaces the default full-width trigger class. */
  triggerClassName?: string
  /** A max-height only works with position="popper" (item-aligned sets an inline max-height). */
  contentClassName?: string
}

function isGroup(o: RHFSelectOption | RHFSelectGroup): o is RHFSelectGroup {
  return 'options' in o
}

function renderItem(o: RHFSelectOption) {
  return (
    <SelectItem key={o.value} value={o.value} disabled={o.disabled}>
      {o.label}
    </SelectItem>
  )
}

function renderOptions(options: Array<RHFSelectOption | RHFSelectGroup>) {
  return options.map((o, i) => {
    if (!isGroup(o)) return renderItem(o)
    return (
      <Fragment key={`group-${i}`}>
        {i > 0 && <SelectSeparator />}
        <SelectGroup>
          {o.label && <SelectLabel>{o.label}</SelectLabel>}
          {o.options.map(renderItem)}
        </SelectGroup>
      </Fragment>
    )
  })
}

export function RHFSelect<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  placeholder,
  options = [],
  children,
  disabled,
  required,
  size,
  position = 'item-aligned',
  orientation,
  className,
  triggerClassName,
  contentClassName,
}: RHFSelectProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()
  const { field, fieldState } = useController({ name, control })
  const invalid = fieldState.invalid
  const isDisabled = disabled || field.disabled
  const { fieldId, descriptionId, errorId, describedBy } = useFieldIds('rhf-select', name, { description, invalid })

  const descriptionEl = description && <FieldDescription id={descriptionId}>{description}</FieldDescription>
  const labelEl = label && (
    <FieldLabel htmlFor={fieldId}>
      {label}
      {required && <RequiredMark />}
    </FieldLabel>
  )
  const errorEl = invalid && <FieldError id={errorId} errors={[fieldState.error]} />
  const select = (
    <Select
      name={field.name}
      // Radix shows the placeholder when value is "" (clear with setValue(name, ""))
      value={field.value ?? ''}
      onValueChange={field.onChange}
      onOpenChange={(open) => {
        if (!open) field.onBlur()
      }}
      disabled={isDisabled}
      required={required}
    >
      <SelectTrigger
        id={fieldId}
        ref={field.ref}
        size={size}
        // Radix puts required on the hidden <select>; the visible combobox must announce it itself
        aria-required={required || undefined}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={cn(triggerClassName ?? 'bom-select__trigger--full')}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position={position} className={contentClassName}>
        {children ?? renderOptions(options)}
      </SelectContent>
    </Select>
  )

  return (
    <Field
      data-invalid={invalid || undefined}
      data-disabled={isDisabled || undefined}
      orientation={orientation}
      className={className}
    >
      {orientation === 'horizontal' ? (
        <FieldContent>
          {labelEl}
          {descriptionEl}
          {errorEl}
        </FieldContent>
      ) : (
        labelEl
      )}
      {select}
      {orientation !== 'horizontal' && (
        <>
          {descriptionEl}
          {errorEl}
        </>
      )}
    </Field>
  )
}
