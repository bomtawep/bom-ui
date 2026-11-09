'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { Slot } from 'radix-ui'
import { cn } from '../../lib/cn'

export type BadgeVariant = 'primary' | 'secondary' | 'outline' | 'info' | 'success' | 'warning' | 'danger'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  asChild?: boolean
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'primary', asChild = false, className, ...props },
  ref,
) {
  const Comp = asChild ? Slot.Root : 'span'
  return <Comp ref={ref} className={cn('bom-badge', `bom-badge--${variant}`, className)} {...props} />
})

Badge.displayName = 'Badge'
