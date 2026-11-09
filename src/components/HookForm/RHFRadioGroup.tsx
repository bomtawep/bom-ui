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
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "../Field/Field"
import { RadioGroup, RadioGroupItem } from "../RadioGroup/RadioGroup"

export type RHFRadioOption = {
  value: string
  label: React.ReactNode
  description?: React.ReactNode
  disabled?: boolean
}

export type RHFRadioGroupProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>
  // ชื่อของกลุ่ม (legend) ต้องมีเสมอให้ screen reader รู้ว่ากำลังเลือกอะไร ไม่อยากให้เห็นใช้ hideLabel
  label: React.ReactNode
  hideLabel?: boolean
  description?: React.ReactNode
  options: RHFRadioOption[]
  // "card" = ทั้งการ์ดเป็น label กดตรงไหนก็เลือกได้ (Choice Card ในเอกสาร shadcn)
  variant?: "default" | "card"
  // ทิศของรายการ และทิศของปุ่มลูกศรที่ใช้เลื่อนตัวเลือก
  orientation?: "vertical" | "horizontal"
  disabled?: boolean
  required?: boolean
  className?: string
}

export function RHFRadioGroup<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  hideLabel,
  description,
  options,
  variant = "default",
  orientation = "vertical",
  disabled,
  required,
  className,
}: RHFRadioGroupProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()
  // useId กัน id ชนเมื่อ name เดียวกันอยู่หลายที่ในหน้า (เช่น form ใน dialog + หน้าที่ซ่อนด้วย <Activity>)
  const uid = React.useId()
  const fieldId = `rhf-radio-${name}-${uid}`
  const groupRef = React.useRef<HTMLDivElement>(null)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const invalid = fieldState.invalid
        const isDisabled = disabled || field.disabled
        const isCard = variant === "card"
        const legendId = `${fieldId}-legend`
        const descriptionId = `${fieldId}-description`
        const errorId = `${fieldId}-error`
        // ให้ screen reader อ่านคำอธิบายของกลุ่มและข้อความ error เมื่อเข้ากลุ่ม
        const describedBy =
          [description && descriptionId, invalid && errorId]
            .filter(Boolean)
            .join(" ") || undefined

        // RHF เรียก ref.focus() ตอน submit แล้วผิด: div ของกลุ่ม focus ไม่ได้ จึง focus ตัวที่เลือกอยู่ หรือตัวแรกที่กดได้
        const focusTarget = {
          focus: () => {
            const root = groupRef.current
            const radio =
              root?.querySelector<HTMLButtonElement>('[role="radio"][data-state="checked"]:not(:disabled)') ??
              root?.querySelector<HTMLButtonElement>('[role="radio"]:not(:disabled)')
            radio?.focus()
          },
        }

        return (
          <FieldSet
            // ชื่อกลุ่มอยู่ที่ radiogroup (aria-labelledby) แล้ว ปิด role group ของ fieldset ไม่ให้ screen reader อ่านชื่อซ้ำ
            role="none"
            data-invalid={invalid || undefined}
            data-disabled={isDisabled || undefined}
            className={className}
          >
            <FieldLegend
              id={legendId}
              variant="label"
              className={hideLabel ? "sr-only" : undefined}
            >
              {label}
              {/* ช่องบังคับ: * ซ่อนจาก screen reader (ประกาศด้วย aria-required ที่ radiogroup แทน)
                  legend ไม่ใช่ flex แบบ FieldLabel จึงเว้นระยะเองให้เท่า gap-2 */}
              {required && (
                <span aria-hidden="true" className="text-destructive ml-2">
                  *
                </span>
              )}
            </FieldLegend>
            {description && (
              <FieldDescription id={descriptionId}>{description}</FieldDescription>
            )}
            <RadioGroup
              ref={(el) => {
                groupRef.current = el
                field.ref(el ? focusTarget : null)
              }}
              name={field.name}
              value={field.value ?? ""}
              onValueChange={field.onChange}
              onBlur={(e) => {
                // blur เฉพาะตอน focus ออกนอกกลุ่ม ไม่ใช่ตอนเลื่อนระหว่างตัวเลือก
                if (!e.currentTarget.contains(e.relatedTarget)) field.onBlur()
              }}
              disabled={isDisabled}
              required={required}
              aria-required={required || undefined}
              orientation={orientation}
              aria-labelledby={legendId}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              className={orientation === "horizontal" ? "flex flex-wrap gap-4" : undefined}
            >
              {options.map((o, i) => {
                const itemId = `${fieldId}-${i}`
                const titleId = `${itemId}-title`
                const itemDescriptionId = `${itemId}-description`
                const itemDisabled = isDisabled || o.disabled
                const item = (
                  <RadioGroupItem
                    id={itemId}
                    value={o.value}
                    disabled={o.disabled}
                    aria-invalid={invalid}
                    // card: label ครอบทั้งการ์ด ชื่อจะรวมคำอธิบายเข้าไปด้วย จึงชี้ชื่อไปที่ title อย่างเดียว
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
                        <FieldContent>
                          <FieldTitle id={titleId}>{o.label}</FieldTitle>
                          {itemDescription}
                        </FieldContent>
                        {item}
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
            </RadioGroup>
            {invalid && <FieldError id={errorId} errors={[fieldState.error]} />}
          </FieldSet>
        )
      }}
    />
  )
}
