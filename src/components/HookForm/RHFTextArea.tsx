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
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../Field/Field"
import { Textarea } from "../Textarea/Textarea"

export type RHFTextAreaProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  React.ComponentProps<typeof Textarea>,
  "name" | "value" | "defaultValue" | "onChange" | "onBlur" | "ref" | "id"
> & {
  name: FieldPath<TFieldValues>
  // ต้องมีเสมอเพื่อเป็นชื่อของช่องให้ screen reader ถ้าไม่อยากให้เห็นใช้ hideLabel
  label: React.ReactNode
  // ซ่อน label ด้วย sr-only (เช่น กล่องข้อความคู่ปุ่มส่ง) screen reader ยังอ่านชื่อได้
  hideLabel?: boolean
  description?: React.ReactNode
  // "top" = ระหว่าง label กับกล่อง (ตัวอย่าง Field ในเอกสาร shadcn), "bottom" = ใต้กล่อง (ค่าเริ่มต้น)
  descriptionPosition?: "top" | "bottom"
  fieldClassName?: string
}

export function RHFTextArea<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  hideLabel,
  description,
  descriptionPosition = "bottom",
  disabled,
  required,
  fieldClassName,
  ...textareaProps
}: RHFTextAreaProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()
  // useId กัน id ชนเมื่อ name เดียวกันอยู่หลายที่ในหน้า (เช่น form ใน dialog + หน้าที่ซ่อนด้วย <Activity>)
  const uid = React.useId()
  const fieldId = `rhf-textarea-${name}-${uid}`

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
        const descriptionEl = description && (
          <FieldDescription id={descriptionId}>{description}</FieldDescription>
        )

        return (
          <Field
            data-invalid={invalid || undefined}
            data-disabled={isDisabled || undefined}
            className={fieldClassName}
          >
            <FieldLabel htmlFor={fieldId} className={hideLabel ? "sr-only" : undefined}>
              {label}
              {/* ช่องบังคับ: * ซ่อนจาก screen reader เพราะ textarea required ประกาศ "required" อยู่แล้ว */}
              {required && (
                <span aria-hidden="true" className="text-destructive">
                  *
                </span>
              )}
            </FieldLabel>
            {descriptionPosition === "top" && descriptionEl}
            <Textarea
              {...textareaProps}
              id={fieldId}
              ref={field.ref}
              name={field.name}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={isDisabled}
              required={required}
              aria-invalid={invalid}
              aria-describedby={describedBy}
            />
            {descriptionPosition === "bottom" && descriptionEl}
            {invalid && <FieldError id={errorId} errors={[fieldState.error]} />}
          </Field>
        )
      }}
    />
  )
}
