"use client"

import * as React from "react"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../Field/Field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../InputOTP/InputOTP"

export type RHFInputOTPProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>
  // ต้องมีเสมอเพื่อเป็นชื่อของช่องให้ screen reader ถ้าไม่อยากให้เห็นใช้ hideLabel
  label: React.ReactNode
  hideLabel?: boolean
  description?: React.ReactNode
  // จำนวนหลักทั้งหมด
  maxLength?: number
  // ขนาดของแต่ละกลุ่ม เช่น [3, 3] = 3-3, [2, 2, 2] = 2-2-2 (ผลรวมต้องเท่า maxLength) ค่าเริ่มต้น = กลุ่มเดียว
  groups?: number[]
  // ขีดคั่นระหว่างกลุ่ม ปิดแล้วจะเว้นระยะแทน
  separator?: boolean
  // regex ของอักขระที่รับ (ใช้กับทั้งการพิมพ์และการวาง) เช่น REGEXP_ONLY_DIGITS_AND_CHARS จาก "input-otp"
  // ค่าเริ่มต้นรับเฉพาะตัวเลข
  pattern?: string
  // กรอกครบทุกหลักแล้ว เช่น ส่งฟอร์มอัตโนมัติ
  onComplete?: (value: string) => void
  // ค่าเริ่มต้นตาม pattern: ตัวเลขอย่างเดียว = "numeric" (มือถือเปิดแป้นตัวเลข) นอกนั้น = "text"
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
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
  // useId กัน id ชนเมื่อ name เดียวกันอยู่หลายที่ในหน้า (เช่น form ใน dialog + หน้าที่ซ่อนด้วย <Activity>)
  const uid = React.useId()
  const fieldId = `rhf-input-otp-${name}-${uid}`
  const sizes = groups ?? [maxLength]
  // index เริ่มของแต่ละกลุ่ม
  const starts = sizes.map((_, i) => sizes.slice(0, i).reduce((a, b) => a + b, 0))

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const invalid = fieldState.invalid
        const isDisabled = disabled || field.disabled
        const descriptionId = `${fieldId}-description`
        const errorId = `${fieldId}-error`
        // ให้ screen reader อ่านคำอธิบายและข้อความ error ต่อจากชื่อช่อง
        const describedBy =
          [description && descriptionId, invalid && errorId]
            .filter(Boolean)
            .join(" ") || undefined

        return (
          <Field
            data-invalid={invalid || undefined}
            data-disabled={isDisabled || undefined}
            className={className}
          >
            <FieldLabel htmlFor={fieldId} className={hideLabel ? "sr-only" : undefined}>
              {label}
              {/* ช่องบังคับ: ใส่ * ให้เห็น แต่ซ่อนจาก screen reader เพราะ input required ประกาศเองอยู่แล้ว */}
              {required && (
                <span aria-hidden="true" className="text-destructive">
                  *
                </span>
              )}
            </FieldLabel>
            {/* ช่องจริงเป็น <input> ตัวเดียวที่ซ้อนอยู่ใต้ช่องหลัก label/คำอธิบาย/สถานะผูกที่ input นี้ */}
            <InputOTP
              id={fieldId}
              ref={field.ref}
              name={field.name}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              onComplete={onComplete}
              maxLength={maxLength}
              pattern={pattern}
              inputMode={inputMode ?? (pattern === REGEXP_ONLY_DIGITS ? "numeric" : "text")}
              autoFocus={autoFocus}
              disabled={isDisabled}
              required={required}
              aria-invalid={invalid}
              aria-describedby={describedBy}
              containerClassName={separator ? undefined : "gap-2"}
            >
              {sizes.map((size, g) => (
                <React.Fragment key={g}>
                  {g > 0 && separator && <InputOTPSeparator aria-hidden="true" />}
                  {/* ช่องหลักเป็นภาพของค่าใน input ซ่อนจาก screen reader ไม่ให้อ่านตัวอักษรซ้ำ */}
                  <InputOTPGroup aria-hidden="true">
                    {Array.from({ length: size }, (_, i) => (
                      <InputOTPSlot
                        key={i}
                        index={starts[g] + i}
                        // ใช้ทำสีขอบตอน error เท่านั้น (ซ่อนจาก screen reader อยู่แล้ว)
                        aria-invalid={invalid || undefined}
                        className={slotClassName}
                      />
                    ))}
                  </InputOTPGroup>
                </React.Fragment>
              ))}
            </InputOTP>
            {description && (
              <FieldDescription id={descriptionId}>{description}</FieldDescription>
            )}
            {invalid && <FieldError id={errorId} errors={[fieldState.error]} />}
          </Field>
        )
      }}
    />
  )
}
