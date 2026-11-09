'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type AlertVariant = 'default' | 'info' | 'success' | 'warning' | 'danger'

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
}

/** Inline message. `danger` is announced immediately (role="alert"); others politely (role="status"). */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { variant = 'default', className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role={variant === 'danger' ? 'alert' : 'status'}
      className={cn('bom-alert', `bom-alert--${variant}`, className)}
      {...props}
    />
  )
})

Alert.displayName = 'Alert'

type DivProps = HTMLAttributes<HTMLDivElement>

export type AlertTitleProps = DivProps

export const AlertTitle = forwardRef<HTMLDivElement, AlertTitleProps>(function AlertTitle({ className, ...props }, ref) {
  return <div ref={ref} className={cn('bom-alert__title', className)} {...props} />
})

AlertTitle.displayName = 'AlertTitle'

export type AlertDescriptionProps = DivProps

export const AlertDescription = forwardRef<HTMLDivElement, AlertDescriptionProps>(function AlertDescription(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn('bom-alert__description', className)} {...props} />
})

AlertDescription.displayName = 'AlertDescription'

export type AlertActionProps = DivProps

export const AlertAction = forwardRef<HTMLDivElement, AlertActionProps>(function AlertAction(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn('bom-alert__action', className)} {...props} />
})

AlertAction.displayName = 'AlertAction'
