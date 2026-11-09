'use client'

import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type InputSize = 'sm' | 'md' | 'lg'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = 'md', type, className, ...props },
  ref,
) {
  return <input ref={ref} type={type} className={cn('bom-input', `bom-input--${size}`, className)} {...props} />
})

Input.displayName = 'Input'
