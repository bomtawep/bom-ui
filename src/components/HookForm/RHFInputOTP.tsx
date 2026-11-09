'use client'

import { Fragment, type HTMLAttributes, type ReactNode } from 'react'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { useController, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import { useFieldIds } from '../../lib/use-field-ids'
import { Field, FieldDescription, FieldError, FieldLabel } from '../Field/Field'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../InputOTP/InputOTP'
import { RequiredMark } from './RequiredMark'

export type RHFInputOTPProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>
  /** Always required: it names the field for screen readers. Hide it visually with hideLabel. */
  label: ReactNode
  hideLabel?: boolean
  description?: ReactNode
  /** Total number of characters. Default 6. */
  maxLength?: number
  /** Group sizes, e.g. [3, 3] = 3-3 (must add up to maxLength). Default: one group. */
  groups?: number[]
  /** Dash between groups; off = a gap instead. Default true. */
  separator?: boolean
  /** Regex of accepted characters (typing and paste), e.g. REGEXP_ONLY_DIGITS_AND_CHARS from "input-otp". Default digits only. */
  pattern?: string
  /** Called when every character is filled, e.g. to submit. */
  onComplete?: (value: string) => void
  /** Default from pattern: digits only = "numeric" (number pad on phones), otherwise "text". */
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode']
  autoFocus?: boolean
  disabled?: boolean
  required?: boolean
  className?: string
  slotClassName?: string
}

export function RHFInputOTP<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  hideLabel,
  description,
  maxLength = 6,
  groups,
  separator = true,
  pattern = REGEXP_ONLY_DIGITS,
  onComplete,
  inputMode,
  autoFocus,
  disabled,
  required,
  className,
  slotClassName,
}: RHFInputOTPProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()
  const { field, fieldState } = useController({ name, control })
  const invalid = fieldState.invalid
  const isDisabled = disabled || field.disabled
  const { fieldId, descriptionId, errorId, describedBy } = useFieldIds('rhf-input-otp', name, { description, invalid })
  const sizes = groups ?? [maxLength]
  const starts = sizes.map((_, i) => sizes.slice(0, i).reduce((a, b) => a + b, 0))

  return (
    <Field data-invalid={invalid || undefined} data-disabled={isDisabled || undefined} className={className}>
      <FieldLabel htmlFor={fieldId} className={hideLabel ? 'bom-sr-only' : undefined}>
        {label}
        {required && <RequiredMark />}
      </FieldLabel>
      {/* The real control is one <input> under the slots; label, description and state belong to it */}
      <InputOTP
        id={fieldId}
        ref={field.ref}
        name={field.name}
        value={field.value ?? ''}
        onChange={field.onChange}
        onBlur={field.onBlur}
        onComplete={onComplete}
        maxLength={maxLength}
        pattern={pattern}
        inputMode={inputMode ?? (pattern === REGEXP_ONLY_DIGITS ? 'numeric' : 'text')}
        autoFocus={autoFocus}
        disabled={isDisabled}
        required={required}
        aria-invalid={invalid}
        aria-describedby={describedBy}
      >
        {sizes.map((size, g) => (
          <Fragment key={g}>
            {g > 0 && separator && <InputOTPSeparator aria-hidden="true" />}
            {/* the slots only picture the input's value; hide them so characters are not read twice */}
            <InputOTPGroup aria-hidden="true">
              {Array.from({ length: size }, (_, i) => (
                <InputOTPSlot key={i} index={starts[g] + i} className={slotClassName} />
              ))}
            </InputOTPGroup>
          </Fragment>
        ))}
      </InputOTP>
      {description && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
      {invalid && <FieldError id={errorId} errors={[fieldState.error]} />}
    </Field>
  )
}
