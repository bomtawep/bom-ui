'use client'

import { forwardRef, useEffect, useState } from 'react'
import { Toaster as Sonner, type ToasterProps as SonnerProps } from 'sonner'
import { cn } from '../../lib/cn'

export type ToasterProps = SonnerProps

type Theme = NonNullable<SonnerProps['theme']>

function readTheme(): Theme {
  const t = document.documentElement.dataset.theme
  return t === 'dark' || t === 'system' ? t : 'light'
}

/**
 * Renders toasts fired with `toast()`. Place once in the root layout.
 * Follows <html data-theme> (light by default) unless `theme` is passed.
 */
export const Toaster = forwardRef<HTMLElement, ToasterProps>(function Toaster(
  { className, toastOptions, theme: themeProp, ...props },
  ref,
) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    if (themeProp) return
    setTheme(readTheme())
    const observer = new MutationObserver(() => setTheme(readTheme()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [themeProp])

  return (
    <Sonner
      ref={ref}
      theme={themeProp ?? theme}
      className={cn('bom-toaster', className)}
      {...props}
      toastOptions={{
        ...toastOptions,
        classNames: {
          toast: 'bom-toast',
          title: 'bom-toast__title',
          description: 'bom-toast__description',
          actionButton: 'bom-toast__action',
          cancelButton: 'bom-toast__cancel',
          success: 'bom-toast--success',
          error: 'bom-toast--danger',
          warning: 'bom-toast--warning',
          info: 'bom-toast--info',
          ...toastOptions?.classNames,
        },
      }}
    />
  )
})

Toaster.displayName = 'Toaster'
