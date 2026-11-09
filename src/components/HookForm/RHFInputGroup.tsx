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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from "../InputGroup/InputGroup"

// addon ใส่เป็น node ตรงๆ หรือเป็นฟังก์ชันที่ได้ค่าปัจจุบัน (เช่น ตัวนับตัวอักษร "0/280")
export type RHFInputGroupAddon = React.ReactNode | ((value: string) => React.ReactNode)

// props ที่ส่งให้ช่องกรอก ใช้กับ renderControl (Custom Input) ต้องกระจายลง element ที่กรอกได้
export type RHFInputGroupControlProps = {
  id: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur: () => void
  ref: React.RefCallback<HTMLInputElement | HTMLTextAreaElement>
  disabled?: boolean
  required?: boolean
  "aria-invalid": boolean
  "aria-describedby"?: string
  // shadcn ใช้ slot นี้ทำ focus ring ของทั้งกรอบ
  "data-slot": "input-group-control"
}

export type RHFInputGroupSlot = "blockStart" | "inlineStart" | "inlineEnd" | "blockEnd"

const slots = [
  ["blockStart", "block-start"],
  ["inlineStart", "inline-start"],
  ["inlineEnd", "inline-end"],
  ["blockEnd", "block-end"],
] as const

export type RHFInputGroupProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  React.ComponentProps<"input">,
  "name" | "value" | "defaultValue" | "onChange" | "onBlur" | "ref" | "id"
> & {
  name: FieldPath<TFieldValues>
  // ต้องมีเสมอเพื่อเป็นชื่อของช่องให้ screen reader ถ้าไม่อยากให้เห็นใช้ hideLabel
  label: React.ReactNode
  hideLabel?: boolean
  description?: React.ReactNode
  // "top" = ระหว่าง label กับกรอบ, "bottom" = ใต้กรอบ (ค่าเริ่มต้น)
  descriptionPosition?: "top" | "bottom"
  // true = ใช้ textarea (คู่กับ blockStart/blockEnd ตามเอกสาร shadcn)
  multiline?: boolean
  rows?: number
  // ตำแหน่งที่เห็นบนจอกำหนดด้วย align เท่านั้น ใน DOM addon อยู่หลังช่องเสมอ ลำดับ Tab จึงเริ่มที่ช่องกรอก
  inlineStart?: RHFInputGroupAddon
  inlineEnd?: RHFInputGroupAddon
  blockStart?: RHFInputGroupAddon
  blockEnd?: RHFInputGroupAddon
  // ข้อความใน addon (เช่น "$", "USD", "@company.com", ตัวนับ) ช่วยให้เข้าใจช่อง จึงผูกเป็น aria-describedby ด้วยโดยปริยาย
  // false = ไม่ผูกเลย, ระบุเป็นรายการ = ผูกเฉพาะตำแหน่งนั้น (เช่น ข้าม addon ที่มีแต่ไอคอนหรือปุ่มซึ่งไม่ได้อธิบายช่อง)
  describeAddons?: boolean | RHFInputGroupSlot[]
  // Custom Input: render ช่องกรอกเอง (เช่น textarea ที่ขยายตามเนื้อหา) แล้วกระจาย props ที่ได้ลงไป
  renderControl?: (props: RHFInputGroupControlProps) => React.ReactNode
  groupClassName?: string
  fieldClassName?: string
}

export function RHFInputGroup<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  hideLabel,
  description,
  descriptionPosition = "bottom",
  multiline,
  inlineStart,
  inlineEnd,
  blockStart,
  blockEnd,
  describeAddons = true,
  renderControl,
  disabled,
  required,
  groupClassName,
  fieldClassName,
  ...controlProps
}: RHFInputGroupProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()
  // useId กัน id ชนเมื่อ name เดียวกันอยู่หลายที่ในหน้า (เช่น form ใน dialog + หน้าที่ซ่อนด้วย <Activity>)
  const uid = React.useId()
  const fieldId = `rhf-input-group-${name}-${uid}`
  const addons = { inlineStart, inlineEnd, blockStart, blockEnd }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const invalid = fieldState.invalid
        const isDisabled = disabled || field.disabled
        const value: string = field.value ?? ""
        const descriptionId = `${fieldId}-description`
        const errorId = `${fieldId}-error`
        const used = slots.filter(([key]) => addons[key] != null && addons[key] !== false)
        // ให้ screen reader อ่านคำอธิบาย ข้อความใน addon และ error ต่อจากชื่อช่อง
        const describedBy =
          [
            description && descriptionId,
            ...used
              .filter(([key]) =>
                Array.isArray(describeAddons) ? describeAddons.includes(key) : describeAddons
              )
              .map(([key]) => `${fieldId}-${key}`),
            invalid && errorId,
          ]
            .filter(Boolean)
            .join(" ") || undefined

        const props: RHFInputGroupControlProps = {
          id: fieldId,
          name: field.name,
          value,
          onChange: field.onChange,
          onBlur: field.onBlur,
          ref: field.ref,
          disabled: isDisabled,
          required,
          "aria-invalid": invalid,
          "aria-describedby": describedBy,
          "data-slot": "input-group-control",
        }

        const controlEl = renderControl ? (
          renderControl(props)
        ) : multiline ? (
          <InputGroupTextarea
            {...(controlProps as React.ComponentProps<"textarea">)}
            {...props}
          />
        ) : (
          <InputGroupInput {...controlProps} {...props} />
        )

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
              {/* ช่องบังคับ: ใส่ * ให้เห็น แต่ซ่อนจาก screen reader เพราะช่องที่ required ประกาศเองอยู่แล้ว */}
              {required && (
                <span aria-hidden="true" className="text-destructive">
                  *
                </span>
              )}
            </FieldLabel>
            {descriptionPosition === "top" && descriptionEl}
            <InputGroup data-disabled={isDisabled || undefined} className={groupClassName}>
              {controlEl}
              {used.map(([key, align]) => {
                const addon = addons[key]
                return (
                  <InputGroupAddon key={key} id={`${fieldId}-${key}`} align={align}>
                    {typeof addon === "function" ? addon(value) : addon}
                  </InputGroupAddon>
                )
              })}
            </InputGroup>
            {descriptionPosition === "bottom" && descriptionEl}
            {invalid && <FieldError id={errorId} errors={[fieldState.error]} />}
          </Field>
        )
      }}
    />
  )
}
