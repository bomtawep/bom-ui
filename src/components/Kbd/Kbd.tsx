'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type KbdProps = HTMLAttributes<HTMLElement>

export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd({ className, ...props }, ref) {
  return <kbd ref={ref} className={cn('bom-kbd', className)} {...props} />
})

Kbd.displayName = 'Kbd'

export type KbdGroupProps = HTMLAttributes<HTMLElement>

export const KbdGroup = forwardRef<HTMLElement, KbdGroupProps>(function KbdGroup({ className, ...props }, ref) {
  return <kbd ref={ref} className={cn('bom-kbd-group', className)} {...props} />
})

KbdGroup.displayName = 'KbdGroup'
