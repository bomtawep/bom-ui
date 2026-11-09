"use client"

import * as React from "react"
import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "../Field/Field"
import { Switch } from "../Switch/Switch"

export type RHFSwitchProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>
  label: React.ReactNode
  description?: React.ReactNode
  // "start" = label อยู่ซ้าย switch อยู่ขวา (ค่าเริ่มต้น), "end" = switch อยู่หน้า label
  labelPosition?: "start" | "end"
  // "card" = ทั้งการ์ดเป็น label กดตรงไหนก็สลับได้ (Choice Card ในเอกสาร shadcn)
  variant?: "default" | "card"
  size?: "sm" | "default"
  disabled?: boolean
  required?: boolean
  className?: string
}

export function RHFSwitch<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  labelPosition = "start",
  variant = "default",
  size,
  disabled,
  required,
  className,
}: RHFSwitchProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()
  // useId กัน id ชนเมื่อ name เดียวกันอยู่หลายที่ในหน้า (เช่น form ใน dialog + หน้าที่ซ่อนด้วย <Activity>)
  const uid = React.useId()
  const fieldId = `rhf-switch-${name}-${uid}`

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const invalid = fieldState.invalid
        const isDisabled = disabled || field.disabled
        const isCard = variant === "card"
        const titleId = `${fieldId}-title`
        const descriptionId = `${fieldId}-description`
        const errorId = `${fieldId}-error`
        // ให้ screen reader อ่านคำอธิบายและข้อความ error ต่อจากชื่อช่อง
        const describedBy =
          [description && descriptionId, invalid && errorId]
            .filter(Boolean)
            .join(" ") || undefined

        const control = (
          <Switch
            id={fieldId}
            ref={field.ref}
            name={field.name}
            checked={!!field.value}
            onCheckedChange={field.onChange}
            onBlur={field.onBlur}
            disabled={isDisabled}
            // Radix ใส่ aria-required ให้ปุ่มเอง แต่ Chrome ไม่ประกาศ required ของ role="switch"
            // ถ้าต้องให้ผู้ใช้ screen reader รู้ ให้เขียนไว้ใน label หรือ description ด้วย
            required={required}
            size={size}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            // card: label ครอบทั้งการ์ด ชื่อจะรวมคำอธิบายเข้าไปด้วย จึงชี้ชื่อไปที่ title อย่างเดียว
            aria-labelledby={isCard ? titleId : undefined}
          />
        )

        const content = (
          <FieldContent>
            {isCard ? (
              <FieldTitle id={titleId}>{label}</FieldTitle>
            ) : (
              <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
            )}
            {description && (
              <FieldDescription id={descriptionId}>{description}</FieldDescription>
            )}
            {invalid && <FieldError id={errorId} errors={[fieldState.error]} />}
          </FieldContent>
        )

        const row = (
          <Field
            orientation="horizontal"
            data-invalid={invalid || undefined}
            data-disabled={isDisabled || undefined}
            className={isCard ? undefined : className}
          >
            {labelPosition === "end" ? (
              <>
                {control}
                {content}
              </>
            ) : (
              <>
                {content}
                {control}
              </>
            )}
          </Field>
        )

        return isCard ? (
          <FieldLabel htmlFor={fieldId} className={className}>
            {row}
          </FieldLabel>
        ) : (
          row
        )
      }}
    />
  )
}
