"use client"

import * as React from "react"
import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { Checkbox } from "../Checkbox/Checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "../Field/Field"

export type RHFCheckboxOption = {
  value: string
  label: React.ReactNode
  description?: React.ReactNode
  disabled?: boolean
}

type BaseProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>
  // ชื่อช่อง (หรือ legend ของกลุ่ม) ต้องมีเสมอให้ screen reader รู้ว่ากำลังติ๊กอะไร ไม่อยากให้เห็นใช้ hideLabel
  label: React.ReactNode
  hideLabel?: boolean
  description?: React.ReactNode
  // "card" = ทั้งการ์ดเป็น label กดตรงไหนก็ติ๊กได้ (Choice Card ในเอกสาร shadcn)
  variant?: "default" | "card"
  disabled?: boolean
  className?: string
}

// ไม่ใส่ options = checkbox เดี่ยว ค่าเป็น boolean
type SingleProps<TFieldValues extends FieldValues> = BaseProps<TFieldValues> & {
  options?: undefined
  required?: boolean
}

// ใส่ options = กลุ่ม checkbox ค่าเป็น string[] ของ value ที่ติ๊ก
// ไม่มี required รายตัว (จะกลายเป็นบังคับติ๊กทุกช่อง) บังคับเลือกอย่างน้อยหนึ่งด้วย zod .min(1)
type GroupProps<TFieldValues extends FieldValues> = BaseProps<TFieldValues> & {
  options: RHFCheckboxOption[]
  orientation?: "vertical" | "horizontal"
}

export type RHFCheckboxProps<TFieldValues extends FieldValues = FieldValues> =
  | SingleProps<TFieldValues>
  | GroupProps<TFieldValues>

export function RHFCheckbox<TFieldValues extends FieldValues = FieldValues>(
  props: RHFCheckboxProps<TFieldValues>
) {
  return props.options ? <CheckboxGroup {...props} /> : <SingleCheckbox {...props} />
}

function SingleCheckbox<TFieldValues extends FieldValues>({
  name,
  label,
  hideLabel,
  description,
  variant = "default",
  disabled,
  required,
  className,
}: SingleProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()
  // useId กัน id ชนเมื่อ name เดียวกันอยู่หลายที่ในหน้า (เช่น form ใน dialog + หน้าที่ซ่อนด้วย <Activity>)
  const uid = React.useId()
  const fieldId = `rhf-checkbox-${name}-${uid}`

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

        // ช่องบังคับ: * ซ่อนจาก screen reader เพราะ Radix Checkbox ใส่ aria-required จาก required อยู่แล้ว
        const requiredMark = required && (
          <span aria-hidden="true" className="text-destructive">
            *
          </span>
        )
        const row = (
          <Field
            orientation="horizontal"
            data-invalid={invalid || undefined}
            data-disabled={isDisabled || undefined}
            className={isCard ? undefined : className}
          >
            <Checkbox
              id={fieldId}
              ref={field.ref}
              name={field.name}
              checked={!!field.value}
              // onCheckedChange ส่ง "indeterminate" ได้ด้วย เก็บลงฟอร์มเป็น boolean เท่านั้น
              onCheckedChange={(v) => field.onChange(v === true)}
              onBlur={field.onBlur}
              disabled={isDisabled}
              required={required}
              aria-invalid={invalid}
              aria-describedby={describedBy}
              // card: label ครอบทั้งการ์ด ชื่อจะรวมคำอธิบายเข้าไปด้วย จึงชี้ชื่อไปที่ title อย่างเดียว
              aria-labelledby={isCard ? titleId : undefined}
            />
            <FieldContent>
              {isCard ? (
                <FieldTitle id={titleId}>
                  {label}
                  {requiredMark}
                </FieldTitle>
              ) : (
                <FieldLabel
                  htmlFor={fieldId}
                  className={hideLabel ? "sr-only" : description ? undefined : "font-normal"}
                >
                  {label}
                  {requiredMark}
                </FieldLabel>
              )}
              {description && (
                <FieldDescription id={descriptionId}>{description}</FieldDescription>
              )}
              {invalid && <FieldError id={errorId} errors={[fieldState.error]} />}
            </FieldContent>
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

function CheckboxGroup<TFieldValues extends FieldValues>({
  name,
  label,
  hideLabel,
  description,
  options,
  variant = "default",
  orientation = "vertical",
  disabled,
  className,
}: GroupProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()
  const uid = React.useId()
  const fieldId = `rhf-checkbox-${name}-${uid}`
  const groupRef = React.useRef<HTMLFieldSetElement>(null)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const invalid = fieldState.invalid
        const isDisabled = disabled || field.disabled
        const isCard = variant === "card"
        const values: string[] = Array.isArray(field.value) ? field.value : []
        const descriptionId = `${fieldId}-description`
        const errorId = `${fieldId}-error`
        // fieldset เป็น role group ได้ชื่อจาก legend เอง (ต่างจาก RHFRadioGroup ที่ปิด role ไว้ เพราะไม่มี radiogroup ซ้อน)
        // คำอธิบายกลุ่มและ error ผูกที่ fieldset ให้ screen reader อ่านเมื่อเข้ากลุ่ม
        const describedBy =
          [description && descriptionId, invalid && errorId]
            .filter(Boolean)
            .join(" ") || undefined

        // RHF เรียก ref.focus() ตอน submit แล้วผิด: fieldset focus ไม่ได้ จึง focus checkbox ตัวแรกที่กดได้
        const focusTarget = {
          focus: () => {
            groupRef.current
              ?.querySelector<HTMLButtonElement>('[role="checkbox"]:not(:disabled)')
              ?.focus()
          },
        }

        const toggle = (value: string, checked: boolean) =>
          field.onChange(
            checked ? [...values.filter((v) => v !== value), value] : values.filter((v) => v !== value)
          )

        return (
          <FieldSet
            ref={(el) => {
              groupRef.current = el
              field.ref(el ? focusTarget : null)
            }}
            data-invalid={invalid || undefined}
            data-disabled={isDisabled || undefined}
            aria-describedby={describedBy}
            onBlur={(e) => {
              // blur เฉพาะตอน focus ออกนอกกลุ่ม ไม่ใช่ตอนเลื่อนระหว่างตัวเลือก
              if (!e.currentTarget.contains(e.relatedTarget)) field.onBlur()
            }}
            className={className}
          >
            <FieldLegend variant="label" className={hideLabel ? "sr-only" : undefined}>
              {label}
            </FieldLegend>
            {description && (
              <FieldDescription id={descriptionId}>{description}</FieldDescription>
            )}
            <div
              data-slot="checkbox-group"
              className={
                orientation === "horizontal" ? "flex flex-wrap gap-4" : "flex flex-col gap-3"
              }
            >
              {options.map((o, i) => {
                const itemId = `${fieldId}-${i}`
                const titleId = `${itemId}-title`
                const itemDescriptionId = `${itemId}-description`
                const itemDisabled = isDisabled || o.disabled
                const item = (
                  <Checkbox
                    id={itemId}
                    name={field.name}
                    value={o.value}
                    checked={values.includes(o.value)}
                    onCheckedChange={(v) => toggle(o.value, v === true)}
                    disabled={itemDisabled}
                    aria-invalid={invalid}
                    aria-labelledby={isCard ? titleId : undefined}
                    aria-describedby={o.description ? itemDescriptionId : undefined}
                  />
                )
                const itemDescription = o.description && (
                  <FieldDescription id={itemDescriptionId}>{o.description}</FieldDescription>
                )

                if (isCard) {
                  return (
                    <FieldLabel key={o.value} htmlFor={itemId}>
                      <Field
                        orientation="horizontal"
                        data-invalid={invalid || undefined}
                        data-disabled={itemDisabled || undefined}
                      >
                        {item}
                        <FieldContent>
                          <FieldTitle id={titleId}>{o.label}</FieldTitle>
                          {itemDescription}
                        </FieldContent>
                      </Field>
                    </FieldLabel>
                  )
                }

                const itemLabel = (
                  <FieldLabel
                    htmlFor={itemId}
                    className={o.description ? undefined : "font-normal"}
                  >
                    {o.label}
                  </FieldLabel>
                )
                return (
                  <Field
                    key={o.value}
                    orientation="horizontal"
                    data-invalid={invalid || undefined}
                    data-disabled={itemDisabled || undefined}
                    className={orientation === "horizontal" ? "w-auto" : undefined}
                  >
                    {item}
                    {o.description ? (
                      <FieldContent>
                        {itemLabel}
                        {itemDescription}
                      </FieldContent>
                    ) : (
                      itemLabel
                    )}
                  </Field>
                )
              })}
            </div>
            {invalid && <FieldError id={errorId} errors={[fieldState.error]} />}
          </FieldSet>
        )
      }}
    />
  )
}
