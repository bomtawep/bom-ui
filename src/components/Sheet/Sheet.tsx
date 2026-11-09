'use client'

import {
  forwardRef,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
} from 'react'
import { Dialog as SheetPrimitive } from 'radix-ui'
import { cn } from '../../lib/cn'
import { XIcon } from '../../lib/icons'
import { useBomUI } from '../BomUIProvider/BomUIProvider'
import { Button } from '../Button/Button'
import { IconButton } from '../IconButton/IconButton'

export type SheetProps = ComponentProps<typeof SheetPrimitive.Root>

export function Sheet(props: SheetProps) {
  return <SheetPrimitive.Root {...props} />
}

Sheet.displayName = 'Sheet'

export type SheetPortalProps = ComponentProps<typeof SheetPrimitive.Portal>

export function SheetPortal(props: SheetPortalProps) {
  return <SheetPrimitive.Portal {...props} />
}

SheetPortal.displayName = 'SheetPortal'

export type SheetTriggerProps = ComponentPropsWithoutRef<typeof SheetPrimitive.Trigger>

export const SheetTrigger = forwardRef<ComponentRef<typeof SheetPrimitive.Trigger>, SheetTriggerProps>(
  function SheetTrigger(props, ref) {
    return <SheetPrimitive.Trigger ref={ref} {...props} />
  },
)

SheetTrigger.displayName = 'SheetTrigger'

export type SheetCloseProps = ComponentPropsWithoutRef<typeof SheetPrimitive.Close>

export const SheetClose = forwardRef<ComponentRef<typeof SheetPrimitive.Close>, SheetCloseProps>(
  function SheetClose(props, ref) {
    return <SheetPrimitive.Close ref={ref} {...props} />
  },
)

SheetClose.displayName = 'SheetClose'

export type SheetOverlayProps = ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>

export const SheetOverlay = forwardRef<ComponentRef<typeof SheetPrimitive.Overlay>, SheetOverlayProps>(
  function SheetOverlay({ className, ...props }, ref) {
    return <SheetPrimitive.Overlay ref={ref} className={cn('bom-sheet__overlay', className)} {...props} />
  },
)

SheetOverlay.displayName = 'SheetOverlay'

export type SheetSide = 'top' | 'right' | 'bottom' | 'left'

export interface SheetContentProps extends ComponentPropsWithoutRef<typeof SheetPrimitive.Content> {
  /** Edge the panel slides in from. Default 'right'. */
  side?: SheetSide
  /** Show the X button in the corner. Default true. */
  showCloseButton?: boolean
}

export const SheetContent = forwardRef<ComponentRef<typeof SheetPrimitive.Content>, SheetContentProps>(
  function SheetContent({ side = 'right', className, children, showCloseButton = true, ...props }, ref) {
    const { messages } = useBomUI()
    return (
      <SheetPortal>
        <SheetOverlay />
        <SheetPrimitive.Content ref={ref} className={cn('bom-sheet', `bom-sheet--${side}`, className)} {...props}>
          {children}
          {showCloseButton && (
            <SheetPrimitive.Close asChild>
              <IconButton aria-label={messages.close} size="sm" className="bom-sheet__close">
                <XIcon />
              </IconButton>
            </SheetPrimitive.Close>
          )}
        </SheetPrimitive.Content>
      </SheetPortal>
    )
  },
)

SheetContent.displayName = 'SheetContent'

export type SheetHeaderProps = HTMLAttributes<HTMLDivElement>

export const SheetHeader = forwardRef<HTMLDivElement, SheetHeaderProps>(function SheetHeader(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn('bom-sheet__header', className)} {...props} />
})

SheetHeader.displayName = 'SheetHeader'

export interface SheetFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Add a secondary "Close" button (text from messages.close). Default false. */
  showCloseButton?: boolean
}

export const SheetFooter = forwardRef<HTMLDivElement, SheetFooterProps>(function SheetFooter(
  { className, showCloseButton = false, children, ...props },
  ref,
) {
  const { messages } = useBomUI()
  return (
    <div ref={ref} className={cn('bom-sheet__footer', className)} {...props}>
      {children}
      {showCloseButton && (
        <SheetPrimitive.Close asChild>
          <Button variant="secondary">{messages.close}</Button>
        </SheetPrimitive.Close>
      )}
    </div>
  )
})

SheetFooter.displayName = 'SheetFooter'

export type SheetTitleProps = ComponentPropsWithoutRef<typeof SheetPrimitive.Title>

export const SheetTitle = forwardRef<ComponentRef<typeof SheetPrimitive.Title>, SheetTitleProps>(
  function SheetTitle({ className, ...props }, ref) {
    return <SheetPrimitive.Title ref={ref} className={cn('bom-sheet__title', className)} {...props} />
  },
)

SheetTitle.displayName = 'SheetTitle'

export type SheetDescriptionProps = ComponentPropsWithoutRef<typeof SheetPrimitive.Description>

export const SheetDescription = forwardRef<ComponentRef<typeof SheetPrimitive.Description>, SheetDescriptionProps>(
  function SheetDescription({ className, ...props }, ref) {
    return <SheetPrimitive.Description ref={ref} className={cn('bom-sheet__description', className)} {...props} />
  },
)

SheetDescription.displayName = 'SheetDescription'
