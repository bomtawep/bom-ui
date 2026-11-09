"use client"

import type * as React from "react"
import { cn } from "cn"
import { Loader2Icon } from "lucide-react"
import { useBomUI } from "../BomUIProvider/BomUIProvider"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  const { messages } = useBomUI()
  return (
    <Loader2Icon data-slot="spinner" role="status" aria-label={messages.loading} className={cn("size-4 animate-spin", className)} {...props} />
  )
}

export { Spinner }

export type SpinnerProps = React.ComponentProps<typeof Spinner>
