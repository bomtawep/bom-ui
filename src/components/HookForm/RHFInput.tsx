"use client"

import * as React from "react"
import { cn } from "cn"
import {
  useController,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { ButtonGroup } from "../ButtonGroup/ButtonGroup"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../Field/Field"
import { Input } from "../Input/Input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../InputGroup/InputGroup"

export type RHFInputProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  React.ComponentProps<typeof Input>,
  "name" | "value" | "defaultValue" | "onChange" | "onBlur" | "ref" | "id"
> & {
  name: FieldPath<TFieldValues>
  // ต้องมีเสมอเพื่อเป็นชื่อของช่องให้ screen reader ถ้าไม่อยากให้เห็นใช้ hideLabel
  label: React.ReactNode
  hideLabel?: boolean
  // ต่อท้าย label เช่น <Badge>Beta</Badge> (อยู่ใน label จึงถูกอ่านเป็นส่วนหนึ่งของชื่อช่อง)
  labelExtra?: React.ReactNode
  description?: React.ReactNode
  // "top" = ระหว่าง label กับช่อง, "bottom" = ใต้ช่อง (ค่าเริ่มต้น)
  descriptionPosition?: "top" | "bottom"
  // "horizontal" = label อยู่ซ้าย ช่องอยู่ขวา (ตัวอย่าง Inline ในเอกสาร shadcn)
  orientation?: "vertical" | "horizontal"
  // ใส่ข้อความ/ไอคอน/ปุ่มเล็กไว้ในกรอบเดียวกับช่อง (InputGroup) เช่น "https://"
  // ข้อความใน addon ไม่ได้เป็นชื่อช่อง ถ้าสำคัญต่อการกรอกให้เขียนไว้ใน label หรือ description ด้วย
  startAddon?: React.ReactNode
  endAddon?: React.ReactNode
  // ปุ่มหรือตัวควบคุมต่อท้ายช่อง เช่นปุ่ม Search
  append?: React.ReactNode
  // true = ติดกับช่องเป็นก้อนเดียว (ButtonGroup), false = เว้นระยะ (Inline)
  attachAppend?: boolean
  fieldClassName?: string
}

export function RHFInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  hideLabel,
  labelExtra,
  description,
  descriptionPosition = "bottom",
  orientation = "vertical",
  startAddon,
  endAddon,
  append,
  attachAppend,
  disabled,
  required,
  type,
  fieldClassName,
  ...inputProps
}: RHFInputProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()
  const { field, fieldState } = useController({ name, control })
  // useId กัน id ชนเมื่อ name เดียวกันอยู่หลายที่ในหน้า (เช่น form ใน dialog + หน้าที่ซ่อนด้วย <Activity>)
  const uid = React.useId()
  const fieldId = `rhf-input-${name}-${uid}`
  const isFile = type === "file"
  const inputRef = React.useRef<HTMLInputElement>(null)

  // input type="file" ควบคุมค่าไม่ได้ (value อ่านอย่างเดียว) เมื่อฟอร์ม reset แล้วค่าว่าง ต้องล้างไฟล์ที่เลือกค้างไว้เอง
  const fileCount = isFile && Array.isArray(field.value) ? field.value.length : 0
  React.useEffect(() => {
    if (isFile && fileCount === 0 && inputRef.current) inputRef.current.value = ""
  }, [isFile, fileCount])

  const invalid = fieldState.invalid
  const isDisabled = disabled || field.disabled
  const descriptionId = `${fieldId}-description`
  const errorId = `${fieldId}-error`
  // ให้ screen reader อ่านคำอธิบายและข้อความ error ต่อจากชื่อช่อง
  const describedBy =
    [description && descriptionId, invalid && errorId].filter(Boolean).join(" ") || undefined

  const controlProps = {
    ...inputProps,
    type,
    id: fieldId,
    ref: (el: HTMLInputElement | null) => {
      inputRef.current = el
      field.ref(el)
    },
    name: field.name,
    // file: เก็บเป็น File[] (ว่าง = []) ช่องอื่นเก็บเป็น string
    ...(isFile
      ? {
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            field.onChange(Array.from(e.target.files ?? [])),
        }
      : { value: field.value ?? "", onChange: field.onChange }),
    onBlur: field.onBlur,
    disabled: isDisabled,
    required,
    "aria-invalid": invalid,
    "aria-describedby": describedBy,
  }

  let controlEl =
    startAddon || endAddon ? (
      <InputGroup>
        <InputGroupInput {...controlProps} />
        {startAddon && <InputGroupAddon align="inline-start">{startAddon}</InputGroupAddon>}
        {endAddon && <InputGroupAddon align="inline-end">{endAddon}</InputGroupAddon>}
      </InputGroup>
    ) : (
      <Input {...controlProps} />
    )
  if (append) {
    controlEl = attachAppend ? (
      <ButtonGroup className="w-full">
        {controlEl}
        {append}
      </ButtonGroup>
    ) : (
      <div className="flex w-full items-center gap-2">
        {controlEl}
        {append}
      </div>
    )
  }

  const labelEl = (
    <FieldLabel
      htmlFor={fieldId}
      className={cn(
        hideLabel && "sr-only",
        // horizontal: Field ให้ label ขยาย (flex-auto) จนช่องเหลือนิดเดียว จึงล็อกความกว้าง (ต้อง ! เพราะ selector ของ Field เจาะจงกว่า) และจัดให้ตรงกลางความสูงของช่อง
        orientation === "horizontal" && "h-8 flex-none! items-center"
      )}
    >
      {label}
      {/* ช่องบังคับ: ใส่ * ให้เห็น แต่ซ่อนจาก screen reader เพราะ input required ประกาศ "required" อยู่แล้ว */}
      {required && (
        <span aria-hidden="true" className="text-destructive">
          *
        </span>
      )}
      {labelExtra}
    </FieldLabel>
  )
  const descriptionEl = description && (
    <FieldDescription id={descriptionId}>{description}</FieldDescription>
  )
  const errorEl = invalid && <FieldError id={errorId} errors={[fieldState.error]} />

  if (orientation === "horizontal") {
    return (
      <Field
        orientation="horizontal"
        data-invalid={invalid || undefined}
        data-disabled={isDisabled || undefined}
        className={fieldClassName}
      >
        {labelEl}
        <FieldContent className="gap-1.5">
          {descriptionPosition === "top" && descriptionEl}
          {controlEl}
          {descriptionPosition === "bottom" && descriptionEl}
          {errorEl}
        </FieldContent>
      </Field>
    )
  }

  return (
    <Field
      data-invalid={invalid || undefined}
      data-disabled={isDisabled || undefined}
      className={fieldClassName}
    >
      {labelEl}
      {descriptionPosition === "top" && descriptionEl}
      {controlEl}
      {descriptionPosition === "bottom" && descriptionEl}
      {errorEl}
    </Field>
  )
}
