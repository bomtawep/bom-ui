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
} from "../Field/Field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../Select/Select"

export type RHFSelectOption = {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

export type RHFSelectGroup = {
  label?: React.ReactNode
  options: RHFSelectOption[]
}

export type RHFSelectProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>
  label?: React.ReactNode
  description?: React.ReactNode
  placeholder?: string
  // รายการแบบเรียบ หรือแบบกลุ่ม (คั่นด้วย SelectSeparator ให้อัตโนมัติ)
  options?: Array<RHFSelectOption | RHFSelectGroup>
  // ใส่ SelectItem/SelectGroup เองแทน options ได้ ถ้าต้องการ layout พิเศษ
  children?: React.ReactNode
  disabled?: boolean
  required?: boolean
  size?: "sm" | "default"
  // "item-aligned" = รายการที่เลือกทับ trigger (ค่าเริ่มต้น), "popper" = เปิดใต้ trigger
  position?: "item-aligned" | "popper"
  orientation?: "vertical" | "horizontal" | "responsive"
  className?: string
  triggerClassName?: string
  // จำกัดความสูง (max-h-*) ได้เฉพาะ position="popper" เพราะ item-aligned ใส่ inline max-height ทับ class
  contentClassName?: string
}

function isGroup(o: RHFSelectOption | RHFSelectGroup): o is RHFSelectGroup {
  return "options" in o
}

function renderItem(o: RHFSelectOption) {
  return (
    <SelectItem key={o.value} value={o.value} disabled={o.disabled}>
      {o.label}
    </SelectItem>
  )
}

function renderOptions(options: Array<RHFSelectOption | RHFSelectGroup>) {
  return options.map((o, i) => {
    if (!isGroup(o)) return renderItem(o)
    return (
      <React.Fragment key={`group-${i}`}>
        {i > 0 && <SelectSeparator />}
        <SelectGroup>
          {o.label && <SelectLabel>{o.label}</SelectLabel>}
          {o.options.map(renderItem)}
        </SelectGroup>
      </React.Fragment>
    )
  })
}

export function RHFSelect<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  placeholder,
  options = [],
  children,
  disabled,
  required,
  size,
  position = "item-aligned",
  orientation,
  className,
  triggerClassName,
  contentClassName,
}: RHFSelectProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()
  // useId กัน id ชนเมื่อ name เดียวกันอยู่หลายที่ในหน้า (เช่น form ใน dialog + หน้าที่ซ่อนด้วย <Activity>)
  const uid = React.useId()
  const fieldId = `rhf-select-${name}-${uid}`

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const invalid = fieldState.invalid
        const isDisabled = disabled || field.disabled
        // ให้ screen reader อ่านคำอธิบายและข้อความ error ต่อจากชื่อช่อง
        const descriptionId = `${fieldId}-description`
        const errorId = `${fieldId}-error`
        const describedBy =
          [description && descriptionId, invalid && errorId]
            .filter(Boolean)
            .join(" ") || undefined
        const descriptionEl = description && (
          <FieldDescription id={descriptionId}>{description}</FieldDescription>
        )
        // ช่องบังคับ: * ซ่อนจาก screen reader (ประกาศด้วย aria-required ที่ trigger แทน)
        const labelEl = label && (
          <FieldLabel htmlFor={fieldId}>
            {label}
            {required && (
              <span aria-hidden="true" className="text-destructive">
                *
              </span>
            )}
          </FieldLabel>
        )
        const errorEl = invalid && (
          <FieldError id={errorId} errors={[fieldState.error]} />
        )
        const select = (
          <Select
            name={field.name}
            // Radix แสดง placeholder เมื่อ value เป็น "" (ล้างค่าด้วย setValue(name, ""))
            value={field.value ?? ""}
            onValueChange={field.onChange}
            onOpenChange={(open) => {
              if (!open) field.onBlur()
            }}
            disabled={isDisabled}
            required={required}
          >
            <SelectTrigger
              id={fieldId}
              ref={field.ref}
              size={size}
              // required ของ Radix ไปลงที่ <select> ที่ซ่อนอยู่ ปุ่ม combobox ที่ผู้ใช้เห็นต้องประกาศเอง
              aria-required={required || undefined}
              aria-invalid={invalid}
              aria-describedby={describedBy}
              className={triggerClassName ?? "w-full"}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent position={position} className={contentClassName}>
              {children ?? renderOptions(options)}
            </SelectContent>
          </Select>
        )

        return (
          <Field
            data-invalid={invalid || undefined}
            data-disabled={isDisabled || undefined}
            orientation={orientation}
            className={className}
          >
            {orientation === "horizontal" ? (
              <FieldContent>
                {labelEl}
                {descriptionEl}
                {errorEl}
              </FieldContent>
            ) : (
              labelEl
            )}
            {select}
            {orientation !== "horizontal" && (
              <>
                {descriptionEl}
                {errorEl}
              </>
            )}
          </Field>
        )
      }}
    />
  )
}
