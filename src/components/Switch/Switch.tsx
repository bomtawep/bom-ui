'use client'

import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react'
import { Switch as SwitchPrimitive } from 'radix-ui'
import { cn } from '../../lib/cn'

export type SwitchSize = 'sm' | 'md'

export interface SwitchProps extends ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  size?: SwitchSize
}

export const Switch = forwardRef<ComponentRef<typeof SwitchPrimitive.Root>, SwitchProps>(function Switch(
  { size = 'md', className, ...props },
  ref,
) {
  return (
    <SwitchPrimitive.Root ref={ref} className={cn('bom-switch', `bom-switch--${size}`, className)} {...props}>
      <SwitchPrimitive.Thumb className="bom-switch__thumb" />
    </SwitchPrimitive.Root>
  )
})

Switch.displayName = 'Switch'
