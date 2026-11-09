'use client'

import { useRef, useState, type ReactNode } from 'react'
import type { Matcher } from 'react-day-picker'
import type { DayPickerLocale } from 'react-day-picker/locale'
import { useController, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import { cn } from '../../lib/cn'
import { formatDateDisplay, formatDateInput, isValidDate, parseDateInput, sameDate } from '../../lib/date'
import { CalendarIcon } from '../../lib/icons'
import { useFieldIds } from '../../lib/use-field-ids'
import { useTransientState } from '../../lib/use-transient-state'
import { useBomUI } from '../BomUIProvider/BomUIProvider'
import { Button } from '../Button/Button'
import { Calendar } from '../Calendar/Calendar'
import { Field, FieldDescription, FieldError, FieldLabel } from '../Field/Field'
import { Input } from '../Input/Input'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '../InputGroup/InputGroup'
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '../Popover/Popover'
import { RequiredMark } from './RequiredMark'

export type RHFDatePickerProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>
  /** Always required: it names the field for screen readers. Hide it visually with hideLabel. */
  label: ReactNode
  hideLabel?: boolean
  description?: ReactNode
  placeholder?: string
  /** 'button' = a button opens the calendar; 'input' = type the date, with a calendar button at the end. */
  variant?: 'button' | 'input'
  /** Default: the BomUIProvider locale (Thai, Buddhist-era years). */
  locale?: DayPickerLocale
  /** Button text (variant="button"). Default e.g. "29 ต.ค. 2569". */
  formatValue?: (date: Date) => string
  /** Text box value (variant="input"). Default e.g. "29/10/2569". */
  formatInput?: (date: Date) => string
  /**
   * Parses typed text (variant="input"). Return undefined = empty, Invalid Date = wrong format
   * (left in the form so the schema reports it). Default: dd/mm/yyyy in locale order, B.E. or C.E.
   */
  parseInput?: (text: string) => Date | undefined
  /** Re-format the text on blur (turn off e.g. for natural-language input). Default true. */
  reformatOnBlur?: boolean
  /** 'dropdown' = month/year dropdowns (e.g. date of birth); use with startMonth / endMonth. */
  captionLayout?: 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years'
  startMonth?: Date
  endMonth?: Date
  /** Days that cannot be picked, e.g. { after: new Date() } = no future dates. */
  disabledDates?: Matcher | Matcher[]
  /** Close the calendar after picking a day. Default true. */
  closeOnSelect?: boolean
  /** Adds a time box; the form value is a Date with the time set. */
  showTime?: boolean
  timeLabel?: ReactNode
  /** Seconds, like input type="time" step. 60 (default) = hh:mm, 1 = with seconds. */
  timeStep?: number
  /** Accessible name of the icon-only calendar button (variant="input"). */
  calendarButtonLabel?: string
  disabled?: boolean
  required?: boolean
  className?: string
  triggerClassName?: string
}

const pad = (n: number) => String(n).padStart(2, '0')

function toTime(d: Date, seconds: boolean) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}${seconds ? `:${pad(d.getSeconds())}` : ''}`
}

function withTime(d: Date, time: string) {
  const [h = 0, m = 0, s = 0] = time.split(':').map(Number)
  const next = new Date(d)
  next.setHours(h, m, s, 0)
  return next
}

export function RHFDatePicker<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  hideLabel,
  description,
  placeholder,
  variant = 'button',
  locale: localeProp,
  formatValue,
  formatInput,
  parseInput,
  reformatOnBlur = true,
  captionLayout,
  startMonth,
  endMonth,
  disabledDates,
  closeOnSelect = true,
  showTime,
  timeLabel,
  timeStep = 60,
  calendarButtonLabel,
  disabled,
  required,
  className,
  triggerClassName,
}: RHFDatePickerProps<TFieldValues>) {
  const { locale: providerLocale, messages } = useBomUI()
  const locale = localeProp ?? providerLocale
  const { control } = useFormContext<TFieldValues>()
  const { field, fieldState } = useController({ name, control })
  const { ref: fieldRef, onBlur: fieldOnBlur } = field
  const invalid = fieldState.invalid
  const isDisabled = disabled || field.disabled
  const { fieldId, labelId, valueId, descriptionId, errorId, describedBy } = useFieldIds('rhf-date-picker', name, {
    description,
    invalid,
  })
  const timeId = `${fieldId}-time`
  const inputRef = useRef<HTMLInputElement | null>(null)
  // a popover could stay open on a page hidden by <Activity>, so reset it when hidden
  const [open, setOpen] = useTransientState(false)

  const value = field.value as Date | null | undefined
  const date = isValidDate(value) ? value : undefined
  const fmtValue = formatValue ?? ((d: Date) => formatDateDisplay(d, locale))
  const fmtInput = formatInput ?? ((d: Date) => formatDateInput(d, locale))
  const parse = parseInput ?? ((t: string) => parseDateInput(t, locale))

  // Text box keeps what the user typed until the form value changes elsewhere (calendar, reset)
  const [text, setText] = useState(() => (date ? fmtInput(date) : ''))
  // a time chosen before any date applies to the date picked later
  const seconds = timeStep % 60 !== 0
  const emptyTime = seconds ? '00:00:00' : '00:00'
  const [timeDraft, setTimeDraft] = useState(emptyTime)

  const [syncedValue, setSyncedValue] = useState(value)
  if (!sameDate(value, syncedValue)) {
    setSyncedValue(value)
    setText(date ? fmtInput(date) : '')
    // cleared from outside (e.g. reset): clear the pending time too
    if (!date) setTimeDraft(emptyTime)
  }
  const time = date ? toTime(date, seconds) : timeDraft

  const selectDate = (d: Date | undefined) => {
    field.onChange(d ? (showTime ? withTime(d, time) : d) : null)
    if (closeOnSelect) setOpen(false)
  }

  const content = (
    <PopoverContent
      className="bom-popover--flush"
      align={variant === 'input' ? 'end' : 'start'}
      // the popover is a dialog named like the field
      aria-labelledby={labelId}
      // let the Calendar focus a day instead of Radix focusing the previous-month button
      onOpenAutoFocus={(e) => e.preventDefault()}
      // variant="input": return focus to the text box, not the icon button
      onCloseAutoFocus={
        variant === 'input'
          ? (e) => {
              e.preventDefault()
              inputRef.current?.focus()
            }
          : undefined
      }
    >
      <Calendar
        locale={locale}
        mode="single"
        selected={date}
        onSelect={selectDate}
        // opens on the selected value's month (PopoverContent remounts on every open)
        defaultMonth={date}
        captionLayout={captionLayout}
        startMonth={startMonth}
        endMonth={endMonth}
        disabled={disabledDates}
        // focus the selected day (or today) right away: arrows move, Enter picks, Esc closes
        autoFocus
      />
    </PopoverContent>
  )

  const labelEl = (
    <FieldLabel id={labelId} htmlFor={fieldId} className={hideLabel ? 'bom-sr-only' : undefined}>
      {label}
      {/* variant="input": the text box announces required; the button cannot, so add "(required)" for screen readers */}
      {required && <RequiredMark announce={variant === 'button'} />}
    </FieldLabel>
  )

  const pickerEl =
    variant === 'input' ? (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <InputGroup data-disabled={isDisabled || undefined} className={triggerClassName}>
            <InputGroupInput
              id={fieldId}
              ref={(el: HTMLInputElement | null) => {
                inputRef.current = el
                fieldRef(el)
              }}
              name={field.name}
              value={text}
              placeholder={placeholder ?? messages.dateInputPlaceholder}
              autoComplete="off"
              onChange={(e) => {
                const parsed = parse(e.target.value)
                setText(e.target.value)
                setSyncedValue(parsed)
                field.onChange(parsed && showTime && isValidDate(parsed) ? withTime(parsed, time) : (parsed ?? null))
              }}
              onBlur={() => {
                if (reformatOnBlur && date) setText(fmtInput(date))
                fieldOnBlur()
              }}
              onKeyDown={(e) => {
                // ArrowDown opens the calendar
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  setOpen(true)
                }
              }}
              disabled={isDisabled}
              required={required}
              aria-invalid={invalid}
              aria-describedby={describedBy}
            />
            <InputGroupAddon align="inline-end">
              <PopoverTrigger asChild>
                <InputGroupButton
                  size="icon-xs"
                  aria-label={calendarButtonLabel ?? messages.openCalendar}
                  disabled={isDisabled}
                >
                  <CalendarIcon />
                </InputGroupButton>
              </PopoverTrigger>
            </InputGroupAddon>
          </InputGroup>
        </PopoverAnchor>
        {content}
      </Popover>
    ) : (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={fieldId}
            ref={fieldRef}
            variant="secondary"
            data-empty={!date}
            disabled={isDisabled}
            onBlur={fieldOnBlur}
            // name = label + selected value, e.g. "วันที่ (จำเป็น) 29 ต.ค. 2569"
            aria-labelledby={`${labelId} ${valueId}`}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className={cn('bom-date-picker__trigger', triggerClassName)}
          >
            <CalendarIcon />
            <span id={valueId}>{date ? fmtValue(date) : (placeholder ?? messages.datePickerPlaceholder)}</span>
          </Button>
        </PopoverTrigger>
        {content}
      </Popover>
    )

  const timeEl = showTime && (
    <Input
      id={timeId}
      type="time"
      step={timeStep}
      value={time}
      onChange={(e) => {
        if (!e.target.value) return
        if (date) field.onChange(withTime(date, e.target.value))
        else setTimeDraft(e.target.value)
      }}
      disabled={isDisabled}
      aria-invalid={invalid}
      aria-describedby={describedBy}
      className="bom-date-picker__time"
    />
  )

  return (
    <Field data-invalid={invalid || undefined} data-disabled={isDisabled || undefined} className={className}>
      {showTime ? (
        <div className="bom-field__row">
          <div className="bom-field__col">
            {labelEl}
            {pickerEl}
          </div>
          <div className="bom-field__col bom-field__col--time">
            <FieldLabel htmlFor={timeId} className={hideLabel ? 'bom-sr-only' : undefined}>
              {timeLabel ?? messages.time}
            </FieldLabel>
            {timeEl}
          </div>
        </div>
      ) : (
        <>
          {labelEl}
          {pickerEl}
        </>
      )}
      {description && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
      {invalid && <FieldError id={errorId} errors={[fieldState.error]} />}
    </Field>
  )
}
