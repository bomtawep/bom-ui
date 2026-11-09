'use client'

import { forwardRef, type ComponentProps, type ComponentPropsWithoutRef, type ComponentRef } from 'react'
import { Tooltip as TooltipPrimitive } from 'radix-ui'
import { cn } from '../../lib/cn'

export type TooltipProviderProps = ComponentProps<typeof TooltipPrimitive.Provider>

export function TooltipProvider({ delayDuration = 0, ...props }: TooltipProviderProps) {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />
}

TooltipProvider.displayName = 'TooltipProvider'

export type TooltipProps = ComponentProps<typeof TooltipPrimitive.Root>

/** Wraps itself in a TooltipProvider, so it works without one higher up. */
export function Tooltip(props: TooltipProps) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root {...props} />
    </TooltipProvider>
  )
}

Tooltip.displayName = 'Tooltip'

export type TooltipTriggerProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>

export const TooltipTrigger = forwardRef<ComponentRef<typeof TooltipPrimitive.Trigger>, TooltipTriggerProps>(
  function TooltipTrigger(props, ref) {
    return <TooltipPrimitive.Trigger ref={ref} {...props} />
  },
)

TooltipTrigger.displayName = 'TooltipTrigger'

export type TooltipContentProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>

export const TooltipContent = forwardRef<ComponentRef<typeof TooltipPrimitive.Content>, TooltipContentProps>(
  function TooltipContent({ className, sideOffset = 4, children, ...props }, ref) {
    return (
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content ref={ref} sideOffset={sideOffset} className={cn('bom-tooltip', className)} {...props}>
          {children}
          <TooltipPrimitive.Arrow className="bom-tooltip__arrow" width={10} height={5} />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    )
  },
)

TooltipContent.displayName = 'TooltipContent'
