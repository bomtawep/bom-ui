"use client"

import type * as React from "react"
import { CircleAlertIcon } from "lucide-react"

import { Alert, AlertAction, AlertDescription, AlertTitle } from "../Alert/Alert"
import { useBomUI } from "../BomUIProvider/BomUIProvider"
import { Button } from "../Button/Button"

/** bom-ui extra: "could not load" alert with an optional retry button. */
function ErrorState({
  title,
  message,
  onRetry,
  retryLabel,
  ...props
}: Omit<React.ComponentProps<typeof Alert>, "title" | "variant"> & {
  /** Default: messages.errorTitle ("โหลดข้อมูลไม่สำเร็จ"). */
  title?: React.ReactNode
  /** The error text — convert your error object to a message before passing it. */
  message?: React.ReactNode
  /** Shows a retry button when given. */
  onRetry?: () => void
  /** Default: messages.retry ("ลองใหม่"). */
  retryLabel?: string
}) {
  const { messages } = useBomUI()
  return (
    <Alert data-slot="error-state" variant="destructive" {...props}>
      <CircleAlertIcon />
      <AlertTitle>{title ?? messages.errorTitle}</AlertTitle>
      {message && <AlertDescription>{message}</AlertDescription>}
      {onRetry && (
        <AlertAction>
          <Button size="sm" variant="outline" onClick={onRetry}>
            {retryLabel ?? messages.retry}
          </Button>
        </AlertAction>
      )}
    </Alert>
  )
}

export { ErrorState }

export type ErrorStateProps = React.ComponentProps<typeof ErrorState>
