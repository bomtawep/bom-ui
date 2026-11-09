"use client"

import * as React from "react"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

type Theme = NonNullable<ToasterProps["theme"]>

const isDark = () => document.documentElement.classList.contains("dark")

/**
 * Renders toasts fired with `toast()`. Place once in the root layout.
 * Follows class="dark" on <html> (next-themes attribute="class") unless `theme` is passed.
 */
const Toaster = ({ theme: themeProp, ...props }: ToasterProps) => {
  const [theme, setTheme] = React.useState<Theme>("light")

  React.useEffect(() => {
    if (themeProp) return
    const update = () => setTheme(isDark() ? "dark" : "light")
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [themeProp])

  return (
    <Sonner
      theme={themeProp ?? theme}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

export type { ToasterProps }
