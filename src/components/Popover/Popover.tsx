'use client'

import {
  forwardRef,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
} from 'react'
import { Popover as PopoverPrimitive } from 'radix-ui'
import { cn } from '../../lib/cn'

export type PopoverProps = ComponentProps<typeof PopoverPrimitive.Root>

export function Popover(props: PopoverProps) {
  return <PopoverPrimitive.Root {...props} />
}

Popover.displayName = 'Popover'

export type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>

export const PopoverTrigger = forwardRef<ComponentRef<typeof PopoverPrimitive.Trigger>, PopoverTriggerProps>(
  function PopoverTrigger(props, ref) {
    return <PopoverPrimitive.Trigger ref={ref} {...props} />
  },
)

PopoverTrigger.displayName = 'PopoverTrigger'

export type PopoverAnchorProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Anchor>

export const PopoverAnchor = forwardRef<ComponentRef<typeof PopoverPrimitive.Anchor>, PopoverAnchorProps>(
  function PopoverAnchor(props, ref) {
    return <PopoverPrimitive.Anchor ref={ref} {...props} />
  },
)

PopoverAnchor.displayName = 'PopoverAnchor'

export type PopoverCloseProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Close>

export const PopoverClose = forwardRef<ComponentRef<typeof PopoverPrimitive.Close>, PopoverCloseProps>(
  function PopoverClose(props, ref) {
    return <PopoverPrimitive.Close ref={ref} {...props} />
  },
)

PopoverClose.displayName = 'PopoverClose'

export type PopoverContentProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>

export const PopoverContent = forwardRef<ComponentRef<typeof PopoverPrimitive.Content>, PopoverContentProps>(
  function PopoverContent({ className, align = 'center', sideOffset = 4, ...props }, ref) {
    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          className={cn('bom-popover', className)}
          {...props}
        />
      </PopoverPrimitive.Portal>
    )
  },
)

PopoverContent.displayName = 'PopoverContent'

type DivProps = HTMLAttributes<HTMLDivElement>

export type PopoverHeaderProps = DivProps

export const PopoverHeader = forwardRef<HTMLDivElement, PopoverHeaderProps>(function PopoverHeader(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn('bom-popover__header', className)} {...props} />
})

PopoverHeader.displayName = 'PopoverHeader'

export type PopoverTitleProps = DivProps

export const PopoverTitle = forwardRef<HTMLDivElement, PopoverTitleProps>(function PopoverTitle(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn('bom-popover__title', className)} {...props} />
})

PopoverTitle.displayName = 'PopoverTitle'

export type PopoverDescriptionProps = HTMLAttributes<HTMLParagraphElement>

export const PopoverDescription = forwardRef<HTMLParagraphElement, PopoverDescriptionProps>(function PopoverDescription(
  { className, ...props },
  ref,
) {
  return <p ref={ref} className={cn('bom-popover__description', className)} {...props} />
})

PopoverDescription.displayName = 'PopoverDescription'
