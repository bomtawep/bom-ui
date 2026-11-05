'use client'

import type { ButtonHTMLAttributes } from 'react'

export type ButtonVariant = 'primary' | 'secondary'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

export function Button({ variant = 'primary', className, type = 'button', ...props }: ButtonProps) {
  const classes = ['bom-btn', `bom-btn--${variant}`, className].filter(Boolean).join(' ')
  return <button type={type} className={classes} {...props} />
}
