'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Slot } from 'radix-ui'
import { cn } from '../../lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'sparkle'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Shows a spinner, sets aria-busy and disables the button. */
  loading?: boolean
  /** Render the single child (e.g. a link) with the button's classes instead of a <button>. */
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    asChild = false,
    className,
    type = 'button',
    disabled,
    children,
    ...props
  },
  ref,
) {
  const classes = cn('bom-btn', `bom-btn--${variant}`, `bom-btn--${size}`, loading && 'bom-btn--loading', className)
  if (asChild) {
    return (
      <Slot.Root ref={ref} className={classes} {...props}>
        {children}
      </Slot.Root>
    )
  }
  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <span className="bom-btn__spinner" aria-hidden="true" />}
      {children}
    </button>
  )
})

Button.displayName = 'Button'
