'use client'

import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react'
import { Accordion as AccordionPrimitive } from 'radix-ui'
import { cn } from '../../lib/cn'
import { ChevronDownIcon } from '../../lib/icons'

export type AccordionProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>

export const Accordion = forwardRef<ComponentRef<typeof AccordionPrimitive.Root>, AccordionProps>(function Accordion(
  { className, ...props },
  ref,
) {
  return <AccordionPrimitive.Root ref={ref} className={cn('bom-accordion', className)} {...props} />
})

Accordion.displayName = 'Accordion'

export type AccordionItemProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>

export const AccordionItem = forwardRef<ComponentRef<typeof AccordionPrimitive.Item>, AccordionItemProps>(
  function AccordionItem({ className, ...props }, ref) {
    return <AccordionPrimitive.Item ref={ref} className={cn('bom-accordion__item', className)} {...props} />
  },
)

AccordionItem.displayName = 'AccordionItem'

export type AccordionTriggerProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>

export const AccordionTrigger = forwardRef<ComponentRef<typeof AccordionPrimitive.Trigger>, AccordionTriggerProps>(
  function AccordionTrigger({ className, children, ...props }, ref) {
    return (
      <AccordionPrimitive.Header className="bom-accordion__header">
        <AccordionPrimitive.Trigger ref={ref} className={cn('bom-accordion__trigger', className)} {...props}>
          {children}
          <ChevronDownIcon className="bom-accordion__icon" />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    )
  },
)

AccordionTrigger.displayName = 'AccordionTrigger'

export type AccordionContentProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>

export const AccordionContent = forwardRef<ComponentRef<typeof AccordionPrimitive.Content>, AccordionContentProps>(
  function AccordionContent({ className, children, ...props }, ref) {
    return (
      <AccordionPrimitive.Content ref={ref} className="bom-accordion__content" {...props}>
        <div className={cn('bom-accordion__body', className)}>{children}</div>
      </AccordionPrimitive.Content>
    )
  },
)

AccordionContent.displayName = 'AccordionContent'
