'use client'

import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react'
import { Separator as SeparatorPrimitive } from 'radix-ui'
import { cn } from '../../lib/cn'

export type SeparatorProps = ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>

export const Separator = forwardRef<ComponentRef<typeof SeparatorPrimitive.Root>, SeparatorProps>(function Separator(
  { className, orientation = 'horizontal', decorative = true, ...props },
  ref,
) {
  return (
    <SeparatorPrimitive.Root
      ref={ref}
      orientation={orientation}
      decorative={decorative}
      className={cn('bom-separator', className)}
      {...props}
    />
  )
})

Separator.displayName = 'Separator'
