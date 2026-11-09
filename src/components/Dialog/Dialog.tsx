'use client'

import {
  forwardRef,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
} from 'react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { cn } from '../../lib/cn'
import { XIcon } from '../../lib/icons'
import { useBomUI } from '../BomUIProvider/BomUIProvider'
import { Button } from '../Button/Button'
import { IconButton } from '../IconButton/IconButton'

export type DialogProps = ComponentProps<typeof DialogPrimitive.Root>

export function Dialog(props: DialogProps) {
  return <DialogPrimitive.Root {...props} />
}

Dialog.displayName = 'Dialog'

export type DialogPortalProps = ComponentProps<typeof DialogPrimitive.Portal>

export function DialogPortal(props: DialogPortalProps) {
  return <DialogPrimitive.Portal {...props} />
}

DialogPortal.displayName = 'DialogPortal'

export type DialogTriggerProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>

export const DialogTrigger = forwardRef<ComponentRef<typeof DialogPrimitive.Trigger>, DialogTriggerProps>(
  function DialogTrigger(props, ref) {
    return <DialogPrimitive.Trigger ref={ref} {...props} />
  },
)

DialogTrigger.displayName = 'DialogTrigger'

export type DialogCloseProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Close>

export const DialogClose = forwardRef<ComponentRef<typeof DialogPrimitive.Close>, DialogCloseProps>(
  function DialogClose(props, ref) {
    return <DialogPrimitive.Close ref={ref} {...props} />
  },
)

DialogClose.displayName = 'DialogClose'

export type DialogOverlayProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>

export const DialogOverlay = forwardRef<ComponentRef<typeof DialogPrimitive.Overlay>, DialogOverlayProps>(
  function DialogOverlay({ className, ...props }, ref) {
    return <DialogPrimitive.Overlay ref={ref} className={cn('bom-dialog__overlay', className)} {...props} />
  },
)

DialogOverlay.displayName = 'DialogOverlay'

export interface DialogContentProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** Show the X button in the corner. Default true. */
  showCloseButton?: boolean
}

export const DialogContent = forwardRef<ComponentRef<typeof DialogPrimitive.Content>, DialogContentProps>(
  function DialogContent({ className, children, showCloseButton = true, ...props }, ref) {
    const { messages } = useBomUI()
    return (
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content ref={ref} className={cn('bom-dialog', className)} {...props}>
          {children}
          {showCloseButton && (
            <DialogPrimitive.Close asChild>
              <IconButton aria-label={messages.close} size="sm" className="bom-dialog__close">
                <XIcon />
              </IconButton>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    )
  },
)

DialogContent.displayName = 'DialogContent'

export type DialogHeaderProps = HTMLAttributes<HTMLDivElement>

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(function DialogHeader(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn('bom-dialog__header', className)} {...props} />
})

DialogHeader.displayName = 'DialogHeader'

export interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Add a secondary "Close" button (text from messages.close). Default false. */
  showCloseButton?: boolean
}

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(function DialogFooter(
  { className, showCloseButton = false, children, ...props },
  ref,
) {
  const { messages } = useBomUI()
  return (
    <div ref={ref} className={cn('bom-dialog__footer', className)} {...props}>
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="secondary">{messages.close}</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  )
})

DialogFooter.displayName = 'DialogFooter'

export type DialogTitleProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Title>

export const DialogTitle = forwardRef<ComponentRef<typeof DialogPrimitive.Title>, DialogTitleProps>(
  function DialogTitle({ className, ...props }, ref) {
    return <DialogPrimitive.Title ref={ref} className={cn('bom-dialog__title', className)} {...props} />
  },
)

DialogTitle.displayName = 'DialogTitle'

export type DialogDescriptionProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Description>

export const DialogDescription = forwardRef<ComponentRef<typeof DialogPrimitive.Description>, DialogDescriptionProps>(
  function DialogDescription({ className, ...props }, ref) {
    return <DialogPrimitive.Description ref={ref} className={cn('bom-dialog__description', className)} {...props} />
  },
)

DialogDescription.displayName = 'DialogDescription'
