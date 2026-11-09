'use client'

import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react'
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui'
import { cn } from '../../lib/cn'
import { CircleIcon } from '../../lib/icons'

export type RadioGroupProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>

export const RadioGroup = forwardRef<ComponentRef<typeof RadioGroupPrimitive.Root>, RadioGroupProps>(
  function RadioGroup({ className, ...props }, ref) {
    return <RadioGroupPrimitive.Root ref={ref} className={cn('bom-radio-group', className)} {...props} />
  },
)

RadioGroup.displayName = 'RadioGroup'

export type RadioGroupItemProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>

export const RadioGroupItem = forwardRef<ComponentRef<typeof RadioGroupPrimitive.Item>, RadioGroupItemProps>(
  function RadioGroupItem({ className, ...props }, ref) {
    return (
      <RadioGroupPrimitive.Item ref={ref} className={cn('bom-radio', className)} {...props}>
        <RadioGroupPrimitive.Indicator className="bom-radio__indicator">
          <CircleIcon />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
    )
  },
)

RadioGroupItem.displayName = 'RadioGroupItem'
