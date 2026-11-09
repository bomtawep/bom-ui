'use client'

import { forwardRef } from 'react'
import { cn } from '../../lib/cn'
import { Button, type ButtonProps } from '../Button/Button'

export type IconButtonProps = Omit<ButtonProps, 'aria-label' | 'loading'> & {
  /** Required: an icon-only button has no visible text to name it. */
  'aria-label': string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = 'ghost', size = 'md', className, ...props },
  ref,
) {
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn('bom-icon-btn', `bom-icon-btn--${size}`, className)}
      {...props}
    />
  )
})

IconButton.displayName = 'IconButton'
