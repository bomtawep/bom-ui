'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { useBomUI } from '../BomUIProvider/BomUIProvider'

export type SpinnerSize = 'sm' | 'md' | 'lg'

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize
  /** Accessible name. Default: messages.loading ("กำลังโหลด"). */
  label?: string
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'md', label, className, ...props },
  ref,
) {
  const { messages } = useBomUI()
  return (
    <span
      ref={ref}
      role="status"
      aria-label={label ?? messages.loading}
      className={cn('bom-spinner', `bom-spinner--${size}`, className)}
      {...props}
    />
  )
})

Spinner.displayName = 'Spinner'
