'use client'

import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react'
import { Tabs as TabsPrimitive } from 'radix-ui'
import { cn } from '../../lib/cn'

export type TabsProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Root>

export const Tabs = forwardRef<ComponentRef<typeof TabsPrimitive.Root>, TabsProps>(function Tabs(
  { className, ...props },
  ref,
) {
  return <TabsPrimitive.Root ref={ref} className={cn('bom-tabs', className)} {...props} />
})

Tabs.displayName = 'Tabs'

export type TabsListProps = ComponentPropsWithoutRef<typeof TabsPrimitive.List>

export const TabsList = forwardRef<ComponentRef<typeof TabsPrimitive.List>, TabsListProps>(function TabsList(
  { className, ...props },
  ref,
) {
  return <TabsPrimitive.List ref={ref} className={cn('bom-tabs__list', className)} {...props} />
})

TabsList.displayName = 'TabsList'

export type TabsTriggerProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>

export const TabsTrigger = forwardRef<ComponentRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  function TabsTrigger({ className, ...props }, ref) {
    return <TabsPrimitive.Trigger ref={ref} className={cn('bom-tabs__trigger', className)} {...props} />
  },
)

TabsTrigger.displayName = 'TabsTrigger'

export type TabsContentProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Content>

export const TabsContent = forwardRef<ComponentRef<typeof TabsPrimitive.Content>, TabsContentProps>(
  function TabsContent({ className, ...props }, ref) {
    return <TabsPrimitive.Content ref={ref} className={cn('bom-tabs__content', className)} {...props} />
  },
)

TabsContent.displayName = 'TabsContent'
