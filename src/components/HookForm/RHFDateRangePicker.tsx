"use client"

import * as React from "react"
import { cn } from "cn"
import { CalendarIcon } from "lucide-react"
import type { DateRange, Matcher } from "react-day-picker"
import type { DayPickerLocale } from "react-day-picker/locale"
import {
  useController,
  useFormContext,
  type FieldError as RHFFieldError,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { Button } from "../Button/Button"
import { Calendar } from "../Calendar/Calendar"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../Field/Field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../Popover/Popover"
import { useTransientState } from "../../lib/use-transient-state"
import { useBomUI } from "../BomUIProvider/BomUIProvider"

import { calendarLocaleProps, isValidDate } from "../../lib/date"

export type { DateRange } from "react-day-picker"

export type RHFDateRangePickerProps<TFieldValues extends FieldValues = FieldValues> = {
  // ค่าในฟอร์มเป็น { from?: Date, to?: Date } (ว่าง = { from: undefined, to: undefined })
  name: FieldPath<TFieldValues>
  // ต้องมีเสมอเพื่อเป็นชื่อของช่องให้ screen reader ถ้าไม่อยากให้เห็นใช้ hideLabel
  label: React.ReactNode
  hideLabel?: boolean
  description?: React.ReactNode
  placeholder?: string
  // ค่าเริ่มต้นภาษาไทย ปี พ.ศ. ส่ง locale อื่นจาก "react-day-picker/locale" ได้ เช่น enUS
  locale?: DayPickerLocale
  // ข้อความบนปุ่ม ค่าเริ่มต้นใช้ Intl formatRange เช่น "1 – 20 ม.ค. 2569"
  formatValue?: (range: { from: Date; to?: Date }) => string
  // จำนวนเดือนที่แสดงพร้อมกัน (จอแคบเรียงลงล่าง)
  numberOfMonths?: number
  // จำนวนคืนต่ำสุด/สูงสุดของช่วง (เช่น max={30} = ไม่เกิน 30 คืน)
  min?: number
  max?: number
  captionLayout?: "label" | "dropdown" | "dropdown-months" | "dropdown-years"
  startMonth?: Date
  endMonth?: Date
  // วันที่เลือกไม่ได้ เช่น { before: new Date() } = ห้ามเลือกวันที่ผ่านมาแล้ว
  disabledDates?: Matcher | Matcher[]
  // true = ช่วงจะข้ามวันที่ disabled ไม่ได้
  excludeDisabled?: boolean
  disabled?: boolean
  required?: boolean
  className?: string
  triggerClassName?: string
}

// error ของช่วงอาจอยู่ที่ตัว field (refine ระดับ object) หรือที่ from/to (z.date() ของแต่ละฝั่ง)
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
  // locale and strings default to BomUIProvider (Thai, Buddhist-era years)
  const { locale: providerLocale, messages } = useBomUI()
  const locale = localeProp ?? providerLocale
  const { control } = useFormContext<TFieldValues>()
  const { field, fieldState } = useController({ name, control })
  // แยก ref/onBlur ออกมาก่อน (ส่ง field.ref ตรงๆ ลง ref ของปุ่ม แล้ว lint react-hooks/refs เข้าใจว่า field ทั้งก้อนเป็น ref)
  const { ref: fieldRef, onBlur: fieldOnBlur } = field
  // useId กัน id ชนเมื่อ name เดียวกันอยู่หลายที่ในหน้า (เช่น form ใน dialog + หน้าที่ซ่อนด้วย <Activity>)
  const uid = React.useId()
  const fieldId = `rhf-date-range-picker-${name}-${uid}`
  const labelId = `${fieldId}-label`
  const valueId = `${fieldId}-value`
  const descriptionId = `${fieldId}-description`
  const errorId = `${fieldId}-error`
  // popover เปิดค้างได้ถ้าหน้าถูกซ่อนด้วย <Activity> จึงใช้ useTransientState (FE-STATE-7)
  const [open, setOpen] = useTransientState(false)

  const raw = field.value as DateRange | null | undefined
  const from = isValidDate(raw?.from) ? raw.from : undefined
  const to = isValidDate(raw?.to) ? raw.to : undefined
  const selected: DateRange | undefined = from ? { from, to } : undefined

  const fmt =
    formatValue ??
    ((r: { from: Date; to?: Date }) => {
      const f = new Intl.DateTimeFormat(locale.code, { dateStyle: "medium" })
      // ICU ของ Node ใส่ thin space (U+2009) รอบขีด แต่ ICU ของ browser อาจใช้ช่องว่างปกติ ข้อความ SSR กับ client จึงไม่ตรงกัน (hydration mismatch)
      // แปลงช่องว่างพิเศษทั้งหมดเป็นช่องว่างปกติ
      return (r.to ? f.formatRange(r.from, r.to) : f.format(r.from)).replace(/[   ]/g, " ")
    })

  const error = rangeError(fieldState.error as Parameters<typeof rangeError>[0])
  const invalid = fieldState.invalid
  const isDisabled = disabled || field.disabled
  // ให้ screen reader อ่านคำอธิบายและข้อความ error ต่อจากชื่อช่อง
  const describedBy =
    [description && descriptionId, invalid && errorId].filter(Boolean).join(" ") || undefined

  return (
    <Field
      data-invalid={invalid || undefined}
      data-disabled={isDisabled || undefined}
      className={className}
    >
      <FieldLabel id={labelId} htmlFor={fieldId} className={hideLabel ? "sr-only" : undefined}>
        {label}
        {/* ช่องบังคับ: * ซ่อนจาก screen reader ปุ่มประกาศ required เองไม่ได้ จึงมีคำว่า "จำเป็น" แบบ sr-only */}
        {required && (
          <span aria-hidden="true" className="text-destructive">
            *
          </span>
        )}
        {required && <span className="sr-only">({messages.required})</span>}
      </FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={fieldId}
            ref={fieldRef}
            type="button"
            variant="outline"
            data-empty={!from}
            disabled={isDisabled}
            onBlur={fieldOnBlur}
            // ชื่อปุ่ม = label + ช่วงที่เลือก เช่น "Stay, 20 ม.ค. – 9 ก.พ. 2569"
            aria-labelledby={`${labelId} ${valueId}`}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className={cn(
              "w-full justify-start font-normal data-[empty=true]:text-muted-foreground",
              triggerClassName
            )}
          >
            <CalendarIcon aria-hidden="true" />
            <span id={valueId} className="truncate">
              {from ? fmt({ from, to }) : (placeholder ?? messages.dateRangePlaceholder)}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="start"
          // popover เป็น dialog ใช้ชื่อเดียวกับช่อง
          aria-labelledby={labelId}
          // ไม่ให้ Radix focus ปุ่มเดือนก่อนหน้า ปล่อยให้ Calendar focus วันแทน
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Calendar
            {...calendarLocaleProps(locale)}
            mode="range"
            selected={selected}
            onSelect={(r) => field.onChange(r ?? { from: undefined, to: undefined })}
            // เปิดแล้วเห็นเดือนของวันเริ่มต้น (PopoverContent mount ใหม่ทุกครั้งที่เปิด)
            defaultMonth={from}
            numberOfMonths={numberOfMonths}
            min={min}
            max={max}
            captionLayout={captionLayout}
            startMonth={startMonth}
            endMonth={endMonth}
            disabled={disabledDates}
            excludeDisabled={excludeDisabled}
            // focus วันเริ่มต้น (หรือวันนี้) ทันทีที่เปิด ใช้ลูกศรเลื่อนวัน Enter เลือก Esc ปิด
            autoFocus
          />
        </PopoverContent>
      </Popover>
      {description && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
      {invalid && <FieldError id={errorId} errors={[error]} />}
    </Field>
  )
}
