'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { Slot } from 'radix-ui'
import { cn } from '../../lib/cn'
import { Separator, type SeparatorProps } from '../Separator/Separator'

export type ButtonGroupOrientation = 'horizontal' | 'vertical'

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: ButtonGroupOrientation
}

/** Joins buttons, inputs and selects into one block (inner corners squared, borders merged). */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { orientation = 'horizontal', className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="group"
      data-orientation={orientation}
      className={cn('bom-button-group', `bom-button-group--${orientation}`, className)}
      {...props}
    />
  )
})

ButtonGroup.displayName = 'ButtonGroup'

export interface ButtonGroupTextProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

export const ButtonGroupText = forwardRef<HTMLDivElement, ButtonGroupTextProps>(function ButtonGroupText(
  { asChild = false, className, ...props },
  ref,
) {
  const Comp = asChild ? Slot.Root : 'div'
  return <Comp ref={ref} className={cn('bom-button-group__text', className)} {...props} />
})

ButtonGroupText.displayName = 'ButtonGroupText'

export const ButtonGroupSeparator = forwardRef<HTMLDivElement, SeparatorProps>(function ButtonGroupSeparator(
  { orientation = 'vertical', className, ...props },
  ref,
) {
  return (
    <Separator
      ref={ref}
      orientation={orientation}
      className={cn('bom-button-group__separator', className)}
      {...props}
    />
  )
})

ButtonGroupSeparator.displayName = 'ButtonGroupSeparator'
