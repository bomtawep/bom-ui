'use client'

import { forwardRef, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { AlertCircleIcon } from '../../lib/icons'
import { Alert, AlertAction, AlertDescription, AlertTitle, type AlertProps } from '../Alert/Alert'
import { useBomUI } from '../BomUIProvider/BomUIProvider'
import { Button } from '../Button/Button'

export interface ErrorStateProps extends Omit<AlertProps, 'title' | 'variant'> {
  /** Default: messages.errorTitle ("โหลดข้อมูลไม่สำเร็จ"). */
  title?: ReactNode
  /** The error text — convert your error object to a message before passing it. */
  message?: ReactNode
  /** Shows a retry button when given. */
  onRetry?: () => void
  /** Default: messages.retry ("ลองใหม่"). */
  retryLabel?: string
}

export const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(function ErrorState(
  { title, message, onRetry, retryLabel, className, ...props },
  ref,
) {
  const { messages } = useBomUI()
  return (
    <Alert ref={ref} variant="danger" className={cn('bom-error-state', className)} {...props}>
      <AlertCircleIcon />
      <AlertTitle>{title ?? messages.errorTitle}</AlertTitle>
      {message && <AlertDescription>{message}</AlertDescription>}
      {onRetry && (
        <AlertAction>
          <Button size="sm" variant="secondary" onClick={onRetry}>
            {retryLabel ?? messages.retry}
          </Button>
        </AlertAction>
      )}
    </Alert>
  )
})

ErrorState.displayName = 'ErrorState'
