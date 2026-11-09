'use client'

import {
  forwardRef,
  useMemo,
  type FieldsetHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { cn } from '../../lib/cn'
import { Label, type LabelProps } from '../Label/Label'
import { Separator } from '../Separator/Separator'

export type FieldSetProps = FieldsetHTMLAttributes<HTMLFieldSetElement>

export const FieldSet = forwardRef<HTMLFieldSetElement, FieldSetProps>(function FieldSet({ className, ...props }, ref) {
  return <fieldset ref={ref} className={cn('bom-field-set', className)} {...props} />
})

FieldSet.displayName = 'FieldSet'

export interface FieldLegendProps extends HTMLAttributes<HTMLLegendElement> {
  /** 'legend' = section heading, 'label' = same size as a field label (e.g. checkbox group). */
  variant?: 'legend' | 'label'
}

export const FieldLegend = forwardRef<HTMLLegendElement, FieldLegendProps>(function FieldLegend(
  { variant = 'legend', className, ...props },
  ref,
) {
  return (
    <legend
      ref={ref}
      data-variant={variant}
      className={cn('bom-field-legend', `bom-field-legend--${variant}`, className)}
      {...props}
    />
  )
})

FieldLegend.displayName = 'FieldLegend'

export type FieldGroupProps = HTMLAttributes<HTMLDivElement>

/** Stack of fields; also the container-query root for `orientation="responsive"`. */
export const FieldGroup = forwardRef<HTMLDivElement, FieldGroupProps>(function FieldGroup({ className, ...props }, ref) {
  return <div ref={ref} className={cn('bom-field-group', className)} {...props} />
})

FieldGroup.displayName = 'FieldGroup'

export type FieldOrientation = 'vertical' | 'horizontal' | 'responsive'

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  /** 'responsive' = vertical until the parent FieldGroup is at least 28rem wide. */
  orientation?: FieldOrientation
}

export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { orientation = 'vertical', className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="group"
      data-orientation={orientation}
      className={cn('bom-field', `bom-field--${orientation}`, className)}
      {...props}
    />
  )
})

Field.displayName = 'Field'

export type FieldContentProps = HTMLAttributes<HTMLDivElement>

export const FieldContent = forwardRef<HTMLDivElement, FieldContentProps>(function FieldContent(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn('bom-field__content', className)} {...props} />
})

FieldContent.displayName = 'FieldContent'

export type FieldLabelProps = LabelProps

export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(function FieldLabel(
  { className, ...props },
  ref,
) {
  return <Label ref={ref} className={cn('bom-field__label', className)} {...props} />
})

FieldLabel.displayName = 'FieldLabel'

export type FieldTitleProps = HTMLAttributes<HTMLDivElement>

export const FieldTitle = forwardRef<HTMLDivElement, FieldTitleProps>(function FieldTitle({ className, ...props }, ref) {
  return <div ref={ref} className={cn('bom-field__title', className)} {...props} />
})

FieldTitle.displayName = 'FieldTitle'

export type FieldDescriptionProps = HTMLAttributes<HTMLParagraphElement>

export const FieldDescription = forwardRef<HTMLParagraphElement, FieldDescriptionProps>(function FieldDescription(
  { className, ...props },
  ref,
) {
  return <p ref={ref} className={cn('bom-field__description', className)} {...props} />
})

FieldDescription.displayName = 'FieldDescription'

export interface FieldSeparatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional text in the middle of the line, e.g. "or". */
  children?: ReactNode
}

export const FieldSeparator = forwardRef<HTMLDivElement, FieldSeparatorProps>(function FieldSeparator(
  { children, className, ...props },
  ref,
) {
  return (
    <div ref={ref} data-content={!!children} className={cn('bom-field-separator', className)} {...props}>
      <Separator className="bom-field-separator__line" />
      {children && <span className="bom-field-separator__content">{children}</span>}
    </div>
  )
})

FieldSeparator.displayName = 'FieldSeparator'

export interface FieldErrorProps extends HTMLAttributes<HTMLDivElement> {
  /** react-hook-form / schema errors. Duplicate messages are shown once; several are listed. */
  errors?: Array<{ message?: string } | undefined>
}

export const FieldError = forwardRef<HTMLDivElement, FieldErrorProps>(function FieldError(
  { className, children, errors, ...props },
  ref,
) {
  const content = useMemo(() => {
    if (children) return children
    const messages = [...new Set((errors ?? []).map((e) => e?.message).filter((m): m is string => !!m))]
    if (messages.length === 0) return null
    if (messages.length === 1) return messages[0]
    return (
      <ul className="bom-field__error-list">
        {messages.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
    )
  }, [children, errors])

  if (!content) return null
  return (
    <div ref={ref} role="alert" className={cn('bom-field__error', className)} {...props}>
      {content}
    </div>
  )
})

FieldError.displayName = 'FieldError'
