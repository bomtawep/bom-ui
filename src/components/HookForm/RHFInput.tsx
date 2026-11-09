'use client'

import { useEffect, useRef, type ChangeEvent, type ReactNode } from 'react'
import { useController, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import { useFieldIds } from '../../lib/use-field-ids'
import { ButtonGroup } from '../ButtonGroup/ButtonGroup'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '../Field/Field'
import { Input, type InputProps } from '../Input/Input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../InputGroup/InputGroup'
import { RequiredMark } from './RequiredMark'

export type RHFInputProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  InputProps,
  'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'id'
> & {
  name: FieldPath<TFieldValues>
  /** Always required: it names the field for screen readers. Hide it visually with hideLabel. */
  label: ReactNode
  hideLabel?: boolean
  /** Appended inside the label, e.g. a "Beta" badge (read as part of the field name). */
  labelExtra?: ReactNode
  description?: ReactNode
  /** 'top' = between label and input, 'bottom' = below the input (default). */
  descriptionPosition?: 'top' | 'bottom'
  /** 'horizontal' = label on the left, input on the right. */
  orientation?: 'vertical' | 'horizontal'
  /**
   * Text/icon/small button inside the same box (InputGroup), e.g. "https://".
   * Addon text is not part of the field name — put anything important in the label or description too.
   */
  startAddon?: ReactNode
  endAddon?: ReactNode
  /** A control after the input, e.g. a Search button. */
  append?: ReactNode
  /** true = joined to the input (ButtonGroup), false = separated by a gap. */
  attachAppend?: boolean
  fieldClassName?: string
}

export function RHFInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  hideLabel,
  labelExtra,
  description,
  descriptionPosition = 'bottom',
  orientation = 'vertical',
  startAddon,
  endAddon,
  append,
  attachAppend,
  disabled,
  required,
  type,
  fieldClassName,
  ...inputProps
}: RHFInputProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()
  const { field, fieldState } = useController({ name, control })
  const invalid = fieldState.invalid
  const isDisabled = disabled || field.disabled
  const { fieldId, descriptionId, errorId, describedBy } = useFieldIds('rhf-input', name, { description, invalid })
  const isFile = type === 'file'
  const inputRef = useRef<HTMLInputElement | null>(null)

  // A file input's value is read-only; when the form resets to empty, clear the chosen files by hand
  const fileCount = isFile && Array.isArray(field.value) ? field.value.length : 0
  useEffect(() => {
    if (isFile && fileCount === 0 && inputRef.current) inputRef.current.value = ''
  }, [isFile, fileCount])

  const controlProps = {
    ...inputProps,
    type,
    id: fieldId,
    ref: (el: HTMLInputElement | null) => {
      inputRef.current = el
      field.ref(el)
    },
    name: field.name,
    // file inputs store File[] (empty = []); everything else stores a string
    ...(isFile
      ? { onChange: (e: ChangeEvent<HTMLInputElement>) => field.onChange(Array.from(e.target.files ?? [])) }
      : { value: field.value ?? '', onChange: field.onChange }),
    onBlur: field.onBlur,
    disabled: isDisabled,
    required,
    'aria-invalid': invalid,
    'aria-describedby': describedBy,
  }

  let controlEl =
    startAddon || endAddon ? (
      <InputGroup data-disabled={isDisabled || undefined}>
        <InputGroupInput {...controlProps} />
        {startAddon && <InputGroupAddon align="inline-start">{startAddon}</InputGroupAddon>}
        {endAddon && <InputGroupAddon align="inline-end">{endAddon}</InputGroupAddon>}
      </InputGroup>
    ) : (
      <Input {...controlProps} />
    )
  if (append) {
    controlEl = attachAppend ? (
      <ButtonGroup className="bom-button-group--full">
        {controlEl}
        {append}
      </ButtonGroup>
    ) : (
      <div className="bom-field__append">
        {controlEl}
        {append}
      </div>
    )
  }

  const labelEl = (
    <FieldLabel htmlFor={fieldId} className={hideLabel ? 'bom-sr-only' : undefined}>
      {label}
      {required && <RequiredMark />}
      {labelExtra}
    </FieldLabel>
  )
  const descriptionEl = description && <FieldDescription id={descriptionId}>{description}</FieldDescription>
  const errorEl = invalid && <FieldError id={errorId} errors={[fieldState.error]} />

  if (orientation === 'horizontal') {
    return (
      <Field
        orientation="horizontal"
        data-invalid={invalid || undefined}
        data-disabled={isDisabled || undefined}
        className={fieldClassName}
      >
        {labelEl}
        <FieldContent>
          {descriptionPosition === 'top' && descriptionEl}
          {controlEl}
          {descriptionPosition === 'bottom' && descriptionEl}
          {errorEl}
        </FieldContent>
      </Field>
    )
  }

  return (
    <Field data-invalid={invalid || undefined} data-disabled={isDisabled || undefined} className={fieldClassName}>
      {labelEl}
      {descriptionPosition === 'top' && descriptionEl}
      {controlEl}
      {descriptionPosition === 'bottom' && descriptionEl}
      {errorEl}
    </Field>
  )
}
