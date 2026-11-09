'use client'

import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react'
import { Checkbox as CheckboxPrimitive } from 'radix-ui'
import { cn } from '../../lib/cn'
import { CheckIcon, MinusIcon } from '../../lib/icons'

export type CheckboxProps = ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>

export const Checkbox = forwardRef<ComponentRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(function Checkbox(
  { className, checked, ...props },
  ref,
) {
  return (
    <CheckboxPrimitive.Root ref={ref} checked={checked} className={cn('bom-checkbox', className)} {...props}>
      <CheckboxPrimitive.Indicator className="bom-checkbox__indicator">
        {checked === 'indeterminate' ? <MinusIcon /> : <CheckIcon />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})

Checkbox.displayName = 'Checkbox'
