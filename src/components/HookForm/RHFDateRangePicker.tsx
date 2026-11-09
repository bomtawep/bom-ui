'use client'

import type { ReactNode } from 'react'
import type { DateRange, Matcher } from 'react-day-picker'
import type { DayPickerLocale } from 'react-day-picker/locale'
import {
  useController,
  useFormContext,
  type FieldError as RHFFieldError,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'
import { cn } from '../../lib/cn'
import { isValidDate } from '../../lib/date'
import { CalendarIcon } from '../../lib/icons'
import { useFieldIds } from '../../lib/use-field-ids'
import { useTransientState } from '../../lib/use-transient-state'
import { useBomUI } from '../BomUIProvider/BomUIProvider'
import { Button } from '../Button/Button'
import { Calendar } from '../Calendar/Calendar'
import { Field, FieldDescription, FieldError, FieldLabel } from '../Field/Field'
import { Popover, PopoverContent, PopoverTrigger } from '../Popover/Popover'
import { RequiredMark } from './RequiredMark'

export type { DateRange } from 'react-day-picker'

export type RHFDateRangePickerProps<TFieldValues extends FieldValues = FieldValues> = {
  /** The form value is { from?: Date, to?: Date } (empty = { from: undefined, to: undefined }). */
  name: FieldPath<TFieldValues>
  /** Always required: it names the field for screen readers. Hide it visually with hideLabel. */
  label: ReactNode
  hideLabel?: boolean
  description?: ReactNode
  /** Default: messages.dateRangePlaceholder. */
  placeholder?: string
  /** Default: the BomUIProvider locale (Thai, Buddhist-era years). */
  locale?: DayPickerLocale
  /** Button text. Default: Intl formatRange, e.g. "1 – 20 ม.ค. 2569". */
  formatValue?: (range: { from: Date; to?: Date }) => string
  /** Months shown side by side (stacked on narrow screens). Default 2. */
  numberOfMonths?: number
  /** Minimum / maximum nights in the range (e.g. max={30}). */
  min?: number
  max?: number
  captionLayout?: 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years'
  startMonth?: Date
  endMonth?: Date
  /** Days that cannot be picked, e.g. { before: new Date() }. */
  disabledDates?: Matcher | Matcher[]
  /** true = a range cannot span disabled days. */
  excludeDisabled?: boolean
  disabled?: boolean
  required?: boolean
  className?: string
  triggerClassName?: string
}

// a range error may sit on the field (object-level refine) or on from / to (each side's z.date())
function rangeError(error?: RHFFieldError & { from?: RHFFieldError; to?: RHFFieldError }) {
  const message = error?.message ?? error?.from?.message ?? error?.to?.message
  return message ? { message } : undefined
}

export function RHFDateRangePicker<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  hideLabel,
  description,
  placeholder,
  locale: localeProp,
  formatValue,
  numberOfMonths = 2,
  min,
  max,
  captionLayout,
  startMonth,
  endMonth,
  disabledDates,
  excludeDisabled,
  disabled,
  required,
  className,
  triggerClassName,
}: RHFDateRangePickerProps<TFieldValues>) {
  const { locale: providerLocale, messages } = useBomUI()
  const locale = localeProp ?? providerLocale
  const { control } = useFormContext<TFieldValues>()
  const { field, fieldState } = useController({ name, control })
  const { ref: fieldRef, onBlur: fieldOnBlur } = field
  const invalid = fieldState.invalid
  const isDisabled = disabled || field.disabled
  const { fieldId, labelId, valueId, descriptionId, errorId, describedBy } = useFieldIds(
    'rhf-date-range-picker',
    name,
    { description, invalid },
  )
  // a popover could stay open on a page hidden by <Activity>, so reset it when hidden
  const [open, setOpen] = useTransientState(false)

  const raw = field.value as DateRange | null | undefined
  const from = isValidDate(raw?.from) ? raw.from : undefined
  const to = isValidDate(raw?.to) ? raw.to : undefined
  const selected: DateRange | undefined = from ? { from, to } : undefined
  const fmt =
    formatValue ??
    ((r: { from: Date; to?: Date }) => {
      // formatRange is ES2021; the tsconfig lib is ES2020 but every supported browser/Node has it
      const f = new Intl.DateTimeFormat(locale.code, { dateStyle: 'medium' }) as Intl.DateTimeFormat & {
        formatRange(start: Date, end: Date): string
      }
      // Node's ICU puts thin spaces around the dash but browsers may use normal spaces, which would make
      // the SSR text differ from the client (hydration mismatch) — normalise all special spaces
      return (r.to ? f.formatRange(r.from, r.to) : f.format(r.from)).replace(/[   ]/g, ' ')
    })
  const error = rangeError(fieldState.error as Parameters<typeof rangeError>[0])

  return (
    <Field data-invalid={invalid || undefined} data-disabled={isDisabled || undefined} className={className}>
      <FieldLabel id={labelId} htmlFor={fieldId} className={hideLabel ? 'bom-sr-only' : undefined}>
        {label}
        {/* the button cannot announce required itself */}
        {required && <RequiredMark announce />}
      </FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={fieldId}
            ref={fieldRef}
            variant="secondary"
            data-empty={!from}
            disabled={isDisabled}
            onBlur={fieldOnBlur}
            // name = label + selected range, e.g. "ช่วงเข้าพัก 20 ม.ค. – 9 ก.พ. 2569"
            aria-labelledby={`${labelId} ${valueId}`}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className={cn('bom-date-picker__trigger', triggerClassName)}
          >
            <CalendarIcon />
            <span id={valueId} className="bom-date-picker__value">
              {from ? fmt({ from, to }) : (placeholder ?? messages.dateRangePlaceholder)}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="bom-popover--flush"
          align="start"
          aria-labelledby={labelId}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Calendar
            locale={locale}
            mode="range"
            selected={selected}
            onSelect={(r) => field.onChange(r ?? { from: undefined, to: undefined })}
            defaultMonth={from}
            numberOfMonths={numberOfMonths}
            min={min}
            max={max}
            captionLayout={captionLayout}
            startMonth={startMonth}
            endMonth={endMonth}
            disabled={disabledDates}
            excludeDisabled={excludeDisabled}
            autoFocus
          />
        </PopoverContent>
      </Popover>
      {description && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
      {invalid && <FieldError id={errorId} errors={[error]} />}
    </Field>
  )
}
