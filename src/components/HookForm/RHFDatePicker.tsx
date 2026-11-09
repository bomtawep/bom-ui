"use client"

import * as React from "react"
import { cn } from "cn"
import { CalendarIcon } from "lucide-react"
import type { Matcher } from "react-day-picker"
import type { DayPickerLocale } from "react-day-picker/locale"
import {
  useController,
  useFormContext,
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
import { Input } from "../Input/Input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../InputGroup/InputGroup"
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "../Popover/Popover"
import { useTransientState } from "../../lib/use-transient-state"
import { useBomUI } from "../BomUIProvider/BomUIProvider"

import {
  calendarLocaleProps,
  formatDateDisplay,
  formatDateInput,
  isValidDate,
  parseDateInput,
  sameDate,
} from "../../lib/date"

export type RHFDatePickerProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>
  // ต้องมีเสมอเพื่อเป็นชื่อของช่องให้ screen reader ถ้าไม่อยากให้เห็นใช้ hideLabel
  label: React.ReactNode
  hideLabel?: boolean
  description?: React.ReactNode
  placeholder?: string
  // "button" = ปุ่มเปิดปฏิทิน (Basic, Date of Birth), "input" = พิมพ์วันที่เองได้ + ปุ่มปฏิทินท้ายช่อง (Input, Natural Language)
  variant?: "button" | "input"
  // ค่าเริ่มต้นภาษาไทย ปี พ.ศ. ส่ง locale อื่นจาก "react-day-picker/locale" ได้ เช่น enUS
  locale?: DayPickerLocale
  // ข้อความบนปุ่ม (variant="button") ค่าเริ่มต้น "29 ต.ค. 2569"
  formatValue?: (date: Date) => string
  // ข้อความในช่อง (variant="input") ค่าเริ่มต้น "29/10/2569"
  formatInput?: (date: Date) => string
  // แปลงข้อความที่พิมพ์ (variant="input") คืน undefined = ว่าง, Invalid Date = รูปแบบผิด (ให้ zod แจ้ง error)
  // ค่าเริ่มต้นรับ วว/ดด/ปปปป ตามลำดับของ locale ปี พ.ศ. หรือ ค.ศ.
  parseInput?: (text: string) => Date | undefined
  // ออกจากช่องแล้วจัดข้อความใหม่ตาม formatInput (ปิดได้ เช่น natural language ที่อยากเก็บคำที่พิมพ์ไว้)
  reformatOnBlur?: boolean
  // "dropdown" = เลือกเดือน/ปีจาก dropdown (Date of Birth) ใช้คู่กับ startMonth/endMonth
  captionLayout?: "label" | "dropdown" | "dropdown-months" | "dropdown-years"
  startMonth?: Date
  endMonth?: Date
  // วันที่เลือกไม่ได้ เช่น { after: new Date() } = ห้ามเลือกวันในอนาคต
  disabledDates?: Matcher | Matcher[]
  // เลือกวันแล้วปิดปฏิทิน
  closeOnSelect?: boolean
  // Time Picker: เพิ่มช่องเวลา ค่าในฟอร์มเป็น Date ที่มีเวลาด้วย
  showTime?: boolean
  timeLabel?: React.ReactNode
  // วินาที (เหมือน step ของ input type="time") ค่าเริ่มต้น 60 = ชั่วโมง:นาที, 1 = มีวินาที
  timeStep?: number
  // ชื่อปุ่มเปิดปฏิทินของ variant="input" (ปุ่มมีแต่ไอคอน)
  calendarButtonLabel?: string
  disabled?: boolean
  required?: boolean
  className?: string
  triggerClassName?: string
}

const pad = (n: number) => String(n).padStart(2, "0")

function toTime(d: Date, seconds: boolean) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}${seconds ? `:${pad(d.getSeconds())}` : ""}`
}

function withTime(d: Date, time: string) {
  const [h = 0, m = 0, s = 0] = time.split(":").map(Number)
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
  variant = "button",
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
  // locale and strings default to BomUIProvider (Thai, Buddhist-era years)
  const { locale: providerLocale, messages } = useBomUI()
  const locale = localeProp ?? providerLocale
  const { control } = useFormContext<TFieldValues>()
  const { field, fieldState } = useController({ name, control })
  // แยก ref/onBlur ออกมาก่อน (ส่ง field.ref ตรงๆ ลง ref ของปุ่ม แล้ว lint react-hooks/refs เข้าใจว่า field ทั้งก้อนเป็น ref)
  const { ref: fieldRef, onBlur: fieldOnBlur } = field
  // useId กัน id ชนเมื่อ name เดียวกันอยู่หลายที่ในหน้า (เช่น form ใน dialog + หน้าที่ซ่อนด้วย <Activity>)
  const uid = React.useId()
  const fieldId = `rhf-date-picker-${name}-${uid}`
  const labelId = `${fieldId}-label`
  const valueId = `${fieldId}-value`
  const timeId = `${fieldId}-time`
  const descriptionId = `${fieldId}-description`
  const errorId = `${fieldId}-error`
  const inputRef = React.useRef<HTMLInputElement>(null)
  // popover เปิดค้างได้ถ้าหน้าถูกซ่อนด้วย <Activity> จึงใช้ useTransientState (FE-STATE-7)
  const [open, setOpen] = useTransientState(false)

  const value = field.value as Date | null | undefined
  const date = isValidDate(value) ? value : undefined
  const fmtValue = formatValue ?? ((d: Date) => formatDateDisplay(d, locale))
  const fmtInput = formatInput ?? ((d: Date) => formatDateInput(d, locale))
  const parse = parseInput ?? ((t: string) => parseDateInput(t, locale))

  // ข้อความในช่องพิมพ์: ตามที่ผู้ใช้พิมพ์ จนกว่าค่าในฟอร์มจะเปลี่ยนจากที่อื่น (เลือกจากปฏิทิน, reset) จึงจัดข้อความใหม่
  const [text, setText] = React.useState(() => (date ? fmtInput(date) : ""))
  // เวลาที่เลือกไว้ก่อนเลือกวัน จะใช้กับวันที่เลือกทีหลัง
  const seconds = timeStep % 60 !== 0
  const emptyTime = seconds ? "00:00:00" : "00:00"
  const [timeDraft, setTimeDraft] = React.useState(emptyTime)

  const [syncedValue, setSyncedValue] = React.useState(value)
  if (!sameDate(value, syncedValue)) {
    setSyncedValue(value)
    setText(date ? fmtInput(date) : "")
    // ค่าถูกล้างจากภายนอก (เช่น reset) ล้างเวลาที่ค้างไว้ด้วย
    if (!date) setTimeDraft(emptyTime)
  }
  const time = date ? toTime(date, seconds) : timeDraft

  const invalid = fieldState.invalid
  const isDisabled = disabled || field.disabled
  // ให้ screen reader อ่านคำอธิบายและข้อความ error ต่อจากชื่อช่อง
  const describedBy =
    [description && descriptionId, invalid && errorId].filter(Boolean).join(" ") || undefined

  const selectDate = (d: Date | undefined) => {
    field.onChange(d ? (showTime ? withTime(d, time) : d) : null)
    if (closeOnSelect) setOpen(false)
  }

  const calendar = (
    <Calendar
      {...calendarLocaleProps(locale)}
      mode="single"
      selected={date}
      onSelect={selectDate}
      // เปิดแล้วเห็นเดือนของค่าที่เลือก (PopoverContent mount ใหม่ทุกครั้งที่เปิด)
      defaultMonth={date}
      captionLayout={captionLayout}
      startMonth={startMonth}
      endMonth={endMonth}
      disabled={disabledDates}
      // focus วันที่เลือก (หรือวันนี้) ทันทีที่เปิด ใช้ลูกศรเลื่อนวัน Enter เลือก Esc ปิด
      autoFocus
    />
  )

  const content = (
    <PopoverContent
      className="w-auto overflow-hidden p-0"
      align={variant === "input" ? "end" : "start"}
      // popover เป็น dialog ใช้ชื่อเดียวกับช่อง
      aria-labelledby={labelId}
      // ไม่ให้ Radix focus ปุ่มเดือนก่อนหน้า ปล่อยให้ Calendar focus วันแทน
      onOpenAutoFocus={(e) => e.preventDefault()}
      // variant="input": ปิดแล้วกลับไปที่ช่องพิมพ์ ไม่ใช่ปุ่มไอคอน
      onCloseAutoFocus={
        variant === "input"
          ? (e) => {
              e.preventDefault()
              inputRef.current?.focus()
            }
          : undefined
      }
    >
      {calendar}
    </PopoverContent>
  )

  const labelEl = (
    <FieldLabel id={labelId} htmlFor={fieldId} className={hideLabel ? "sr-only" : undefined}>
      {label}
      {/* ช่องบังคับ: * ซ่อนจาก screen reader; variant="input" ช่องประกาศ required เอง ส่วนปุ่มประกาศไม่ได้ จึงมีคำว่า "จำเป็น" แบบ sr-only */}
      {required && (
        <span aria-hidden="true" className="text-destructive">
          *
        </span>
      )}
      {required && variant === "button" && <span className="sr-only">({messages.required})</span>}
    </FieldLabel>
  )

  const pickerEl =
    variant === "input" ? (
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
                // ลูกศรลงเปิดปฏิทิน (เหมือนตัวอย่าง shadcn)
                if (e.key === "ArrowDown") {
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
            type="button"
            variant="outline"
            data-empty={!date}
            disabled={isDisabled}
            onBlur={fieldOnBlur}
            // ชื่อปุ่ม = label + ค่าที่เลือก เช่น "Date (จำเป็น), 29 ต.ค. 2569"
            aria-labelledby={`${labelId} ${valueId}`}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className={cn(
              "w-full justify-start font-normal data-[empty=true]:text-muted-foreground",
              triggerClassName
            )}
          >
            <CalendarIcon aria-hidden="true" />
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
      // ซ่อนไอคอนนาฬิกาของ browser ให้เหมือนตัวอย่าง shadcn (พิมพ์และใช้ลูกศรขึ้นลงได้ตามปกติ)
      className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
    />
  )

  return (
    <Field
      data-invalid={invalid || undefined}
      data-disabled={isDisabled || undefined}
      className={className}
    >
      {showTime ? (
        <div className="flex gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            {labelEl}
            {pickerEl}
          </div>
          <div className="flex w-32 flex-col gap-2">
            <FieldLabel htmlFor={timeId} className={hideLabel ? "sr-only" : undefined}>
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
