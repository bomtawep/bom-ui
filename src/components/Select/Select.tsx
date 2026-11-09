'use client'

import { forwardRef, type ComponentProps, type ComponentPropsWithoutRef, type ComponentRef } from 'react'
import { Select as SelectPrimitive } from 'radix-ui'
import { cn } from '../../lib/cn'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '../../lib/icons'

export type SelectProps = ComponentProps<typeof SelectPrimitive.Root>

/** Root (no DOM). Controlled with value / onValueChange, or uncontrolled with defaultValue. */
export function Select(props: SelectProps) {
  return <SelectPrimitive.Root {...props} />
}

Select.displayName = 'Select'

export type SelectValueProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Value>

export const SelectValue = forwardRef<ComponentRef<typeof SelectPrimitive.Value>, SelectValueProps>(
  function SelectValue({ className, ...props }, ref) {
    return <SelectPrimitive.Value ref={ref} className={cn('bom-select__value', className)} {...props} />
  },
)

SelectValue.displayName = 'SelectValue'

export type SelectTriggerSize = 'sm' | 'md' | 'lg'

export interface SelectTriggerProps extends ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  size?: SelectTriggerSize
}

export const SelectTrigger = forwardRef<ComponentRef<typeof SelectPrimitive.Trigger>, SelectTriggerProps>(
  function SelectTrigger({ size = 'md', className, children, ...props }, ref) {
    return (
      <SelectPrimitive.Trigger
        ref={ref}
        className={cn('bom-select__trigger', `bom-select__trigger--${size}`, className)}
        {...props}
      >
        {children}
        <SelectPrimitive.Icon asChild>
          <ChevronDownIcon className="bom-select__icon" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
    )
  },
)

SelectTrigger.displayName = 'SelectTrigger'

export type SelectScrollUpButtonProps = ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>

export const SelectScrollUpButton = forwardRef<
  ComponentRef<typeof SelectPrimitive.ScrollUpButton>,
  SelectScrollUpButtonProps
>(function SelectScrollUpButton({ className, ...props }, ref) {
  return (
    <SelectPrimitive.ScrollUpButton ref={ref} className={cn('bom-select__scroll', className)} {...props}>
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpButton>
  )
})

SelectScrollUpButton.displayName = 'SelectScrollUpButton'

export type SelectScrollDownButtonProps = ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>

export const SelectScrollDownButton = forwardRef<
  ComponentRef<typeof SelectPrimitive.ScrollDownButton>,
  SelectScrollDownButtonProps
>(function SelectScrollDownButton({ className, ...props }, ref) {
  return (
    <SelectPrimitive.ScrollDownButton ref={ref} className={cn('bom-select__scroll', className)} {...props}>
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownButton>
  )
})

SelectScrollDownButton.displayName = 'SelectScrollDownButton'

export type SelectContentProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Content>

export const SelectContent = forwardRef<ComponentRef<typeof SelectPrimitive.Content>, SelectContentProps>(
  function SelectContent({ className, children, position = 'item-aligned', ...props }, ref) {
    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          ref={ref}
          position={position}
          className={cn('bom-select__content', `bom-select__content--${position}`, className)}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.Viewport className="bom-select__viewport">{children}</SelectPrimitive.Viewport>
          <SelectScrollDownButton />
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    )
  },
)

SelectContent.displayName = 'SelectContent'

export type SelectGroupProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Group>

export const SelectGroup = forwardRef<ComponentRef<typeof SelectPrimitive.Group>, SelectGroupProps>(
  function SelectGroup({ className, ...props }, ref) {
    return <SelectPrimitive.Group ref={ref} className={cn('bom-select__group', className)} {...props} />
  },
)

SelectGroup.displayName = 'SelectGroup'

export type SelectLabelProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Label>

export const SelectLabel = forwardRef<ComponentRef<typeof SelectPrimitive.Label>, SelectLabelProps>(
  function SelectLabel({ className, ...props }, ref) {
    return <SelectPrimitive.Label ref={ref} className={cn('bom-select__label', className)} {...props} />
  },
)

SelectLabel.displayName = 'SelectLabel'

export type SelectItemProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Item>

export const SelectItem = forwardRef<ComponentRef<typeof SelectPrimitive.Item>, SelectItemProps>(function SelectItem(
  { className, children, ...props },
  ref,
) {
  return (
    <SelectPrimitive.Item ref={ref} className={cn('bom-select__item', className)} {...props}>
      <span className="bom-select__item-indicator">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
})

SelectItem.displayName = 'SelectItem'

export type SelectSeparatorProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>

export const SelectSeparator = forwardRef<ComponentRef<typeof SelectPrimitive.Separator>, SelectSeparatorProps>(
  function SelectSeparator({ className, ...props }, ref) {
    return <SelectPrimitive.Separator ref={ref} className={cn('bom-select__separator', className)} {...props} />
  },
)

SelectSeparator.displayName = 'SelectSeparator'
