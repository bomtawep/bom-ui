'use client'

import {
  forwardRef,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
} from 'react'
import { AlertDialog as AlertDialogPrimitive } from 'radix-ui'
import { cn } from '../../lib/cn'
import type { ButtonVariant } from '../Button/Button'

export type AlertDialogProps = ComponentProps<typeof AlertDialogPrimitive.Root>

/** Confirmation dialog: no close button, clicking outside does not close it. */
export function AlertDialog(props: AlertDialogProps) {
  return <AlertDialogPrimitive.Root {...props} />
}

AlertDialog.displayName = 'AlertDialog'

export type AlertDialogPortalProps = ComponentProps<typeof AlertDialogPrimitive.Portal>

export function AlertDialogPortal(props: AlertDialogPortalProps) {
  return <AlertDialogPrimitive.Portal {...props} />
}

AlertDialogPortal.displayName = 'AlertDialogPortal'

export type AlertDialogTriggerProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Trigger>

export const AlertDialogTrigger = forwardRef<ComponentRef<typeof AlertDialogPrimitive.Trigger>, AlertDialogTriggerProps>(
  function AlertDialogTrigger(props, ref) {
    return <AlertDialogPrimitive.Trigger ref={ref} {...props} />
  },
)

AlertDialogTrigger.displayName = 'AlertDialogTrigger'

export type AlertDialogOverlayProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>

export const AlertDialogOverlay = forwardRef<ComponentRef<typeof AlertDialogPrimitive.Overlay>, AlertDialogOverlayProps>(
  function AlertDialogOverlay({ className, ...props }, ref) {
    return <AlertDialogPrimitive.Overlay ref={ref} className={cn('bom-dialog__overlay', className)} {...props} />
  },
)

AlertDialogOverlay.displayName = 'AlertDialogOverlay'

export type AlertDialogContentProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>

export const AlertDialogContent = forwardRef<ComponentRef<typeof AlertDialogPrimitive.Content>, AlertDialogContentProps>(
  function AlertDialogContent({ className, ...props }, ref) {
    return (
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogPrimitive.Content
          ref={ref}
          className={cn('bom-dialog', 'bom-alert-dialog', className)}
          {...props}
        />
      </AlertDialogPortal>
    )
  },
)

AlertDialogContent.displayName = 'AlertDialogContent'

export type AlertDialogHeaderProps = HTMLAttributes<HTMLDivElement>

export const AlertDialogHeader = forwardRef<HTMLDivElement, AlertDialogHeaderProps>(function AlertDialogHeader(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn('bom-dialog__header', 'bom-alert-dialog__header', className)} {...props} />
})

AlertDialogHeader.displayName = 'AlertDialogHeader'

export type AlertDialogFooterProps = HTMLAttributes<HTMLDivElement>

export const AlertDialogFooter = forwardRef<HTMLDivElement, AlertDialogFooterProps>(function AlertDialogFooter(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn('bom-dialog__footer', className)} {...props} />
})

AlertDialogFooter.displayName = 'AlertDialogFooter'

export type AlertDialogTitleProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>

export const AlertDialogTitle = forwardRef<ComponentRef<typeof AlertDialogPrimitive.Title>, AlertDialogTitleProps>(
  function AlertDialogTitle({ className, ...props }, ref) {
    return <AlertDialogPrimitive.Title ref={ref} className={cn('bom-dialog__title', className)} {...props} />
  },
)

AlertDialogTitle.displayName = 'AlertDialogTitle'

export type AlertDialogDescriptionProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>

export const AlertDialogDescription = forwardRef<
  ComponentRef<typeof AlertDialogPrimitive.Description>,
  AlertDialogDescriptionProps
>(function AlertDialogDescription({ className, ...props }, ref) {
  return <AlertDialogPrimitive.Description ref={ref} className={cn('bom-dialog__description', className)} {...props} />
})

AlertDialogDescription.displayName = 'AlertDialogDescription'

export interface AlertDialogActionProps extends ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> {
  /** Button style. Default 'primary'; use 'danger' for destructive confirmations. */
  variant?: ButtonVariant
}

export const AlertDialogAction = forwardRef<ComponentRef<typeof AlertDialogPrimitive.Action>, AlertDialogActionProps>(
  function AlertDialogAction({ variant = 'primary', className, ...props }, ref) {
    return (
      <AlertDialogPrimitive.Action
        ref={ref}
        className={cn('bom-btn', `bom-btn--${variant}`, 'bom-btn--md', className)}
        {...props}
      />
    )
  },
)

AlertDialogAction.displayName = 'AlertDialogAction'

export type AlertDialogCancelProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>

export const AlertDialogCancel = forwardRef<ComponentRef<typeof AlertDialogPrimitive.Cancel>, AlertDialogCancelProps>(
  function AlertDialogCancel({ className, ...props }, ref) {
    return (
      <AlertDialogPrimitive.Cancel
        ref={ref}
        className={cn('bom-btn', 'bom-btn--secondary', 'bom-btn--md', className)}
        {...props}
      />
    )
  },
)

AlertDialogCancel.displayName = 'AlertDialogCancel'
