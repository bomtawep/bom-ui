'use client'

import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react'
import { Label as LabelPrimitive } from 'radix-ui'
import { cn } from '../../lib/cn'

export type LabelProps = ComponentPropsWithoutRef<typeof LabelPrimitive.Root>

export const Label = forwardRef<ComponentRef<typeof LabelPrimitive.Root>, LabelProps>(function Label(
  { className, ...props },
  ref,
) {
  return <LabelPrimitive.Root ref={ref} className={cn('bom-label', className)} {...props} />
})

Label.displayName = 'Label'
