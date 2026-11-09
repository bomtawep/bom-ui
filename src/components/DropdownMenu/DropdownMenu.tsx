'use client'

import {
  forwardRef,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
} from 'react'
import { DropdownMenu as MenuPrimitive } from 'radix-ui'
import { cn } from '../../lib/cn'
import { CheckIcon, ChevronRightIcon, CircleIcon } from '../../lib/icons'

// ---------- roots (no DOM of their own)

export type DropdownMenuProps = ComponentProps<typeof MenuPrimitive.Root>

export function DropdownMenu(props: DropdownMenuProps) {
  return <MenuPrimitive.Root {...props} />
}

DropdownMenu.displayName = 'DropdownMenu'

export type DropdownMenuPortalProps = ComponentProps<typeof MenuPrimitive.Portal>

export function DropdownMenuPortal(props: DropdownMenuPortalProps) {
  return <MenuPrimitive.Portal {...props} />
}

DropdownMenuPortal.displayName = 'DropdownMenuPortal'

export type DropdownMenuSubProps = ComponentProps<typeof MenuPrimitive.Sub>

export function DropdownMenuSub(props: DropdownMenuSubProps) {
  return <MenuPrimitive.Sub {...props} />
}

DropdownMenuSub.displayName = 'DropdownMenuSub'

// ---------- parts

export type DropdownMenuTriggerProps = ComponentPropsWithoutRef<typeof MenuPrimitive.Trigger>

export const DropdownMenuTrigger = forwardRef<ComponentRef<typeof MenuPrimitive.Trigger>, DropdownMenuTriggerProps>(
  function DropdownMenuTrigger(props, ref) {
    return <MenuPrimitive.Trigger ref={ref} {...props} />
  },
)

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger'

export type DropdownMenuContentProps = ComponentPropsWithoutRef<typeof MenuPrimitive.Content>

export const DropdownMenuContent = forwardRef<ComponentRef<typeof MenuPrimitive.Content>, DropdownMenuContentProps>(
  function DropdownMenuContent({ className, sideOffset = 4, ...props }, ref) {
    return (
      <MenuPrimitive.Portal>
        <MenuPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          className={cn('bom-dropdown-menu', className)}
          {...props}
        />
      </MenuPrimitive.Portal>
    )
  },
)

DropdownMenuContent.displayName = 'DropdownMenuContent'

export type DropdownMenuGroupProps = ComponentPropsWithoutRef<typeof MenuPrimitive.Group>

export const DropdownMenuGroup = forwardRef<ComponentRef<typeof MenuPrimitive.Group>, DropdownMenuGroupProps>(
  function DropdownMenuGroup(props, ref) {
    return <MenuPrimitive.Group ref={ref} {...props} />
  },
)

DropdownMenuGroup.displayName = 'DropdownMenuGroup'

export interface DropdownMenuItemProps extends ComponentPropsWithoutRef<typeof MenuPrimitive.Item> {
  /** Indent to line up with items that have an icon or check. */
  inset?: boolean
  variant?: 'default' | 'danger'
}

export const DropdownMenuItem = forwardRef<ComponentRef<typeof MenuPrimitive.Item>, DropdownMenuItemProps>(
  function DropdownMenuItem({ className, inset, variant = 'default', ...props }, ref) {
    return (
      <MenuPrimitive.Item
        ref={ref}
        data-inset={inset || undefined}
        className={cn(
          'bom-dropdown-menu__item',
          variant === 'danger' && 'bom-dropdown-menu__item--danger',
          inset && 'bom-dropdown-menu__item--inset',
          className,
        )}
        {...props}
      />
    )
  },
)

DropdownMenuItem.displayName = 'DropdownMenuItem'

export type DropdownMenuCheckboxItemProps = ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>

export const DropdownMenuCheckboxItem = forwardRef<
  ComponentRef<typeof MenuPrimitive.CheckboxItem>,
  DropdownMenuCheckboxItemProps
>(function DropdownMenuCheckboxItem({ className, children, ...props }, ref) {
  return (
    <MenuPrimitive.CheckboxItem
      ref={ref}
      className={cn('bom-dropdown-menu__item', 'bom-dropdown-menu__item--indicator', className)}
      {...props}
    >
      <span className="bom-dropdown-menu__indicator">
        <MenuPrimitive.ItemIndicator>
          <CheckIcon />
        </MenuPrimitive.ItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
})

DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem'

export type DropdownMenuRadioGroupProps = ComponentPropsWithoutRef<typeof MenuPrimitive.RadioGroup>

export const DropdownMenuRadioGroup = forwardRef<
  ComponentRef<typeof MenuPrimitive.RadioGroup>,
  DropdownMenuRadioGroupProps
>(function DropdownMenuRadioGroup(props, ref) {
  return <MenuPrimitive.RadioGroup ref={ref} {...props} />
})

DropdownMenuRadioGroup.displayName = 'DropdownMenuRadioGroup'

export type DropdownMenuRadioItemProps = ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>

export const DropdownMenuRadioItem = forwardRef<ComponentRef<typeof MenuPrimitive.RadioItem>, DropdownMenuRadioItemProps>(
  function DropdownMenuRadioItem({ className, children, ...props }, ref) {
    return (
      <MenuPrimitive.RadioItem
        ref={ref}
        className={cn('bom-dropdown-menu__item', 'bom-dropdown-menu__item--indicator', className)}
        {...props}
      >
        <span className="bom-dropdown-menu__indicator">
          <MenuPrimitive.ItemIndicator>
            <CircleIcon />
          </MenuPrimitive.ItemIndicator>
        </span>
        {children}
      </MenuPrimitive.RadioItem>
    )
  },
)

DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem'

export interface DropdownMenuLabelProps extends ComponentPropsWithoutRef<typeof MenuPrimitive.Label> {
  inset?: boolean
}

export const DropdownMenuLabel = forwardRef<ComponentRef<typeof MenuPrimitive.Label>, DropdownMenuLabelProps>(
  function DropdownMenuLabel({ className, inset, ...props }, ref) {
    return (
      <MenuPrimitive.Label
        ref={ref}
        className={cn('bom-dropdown-menu__label', inset && 'bom-dropdown-menu__item--inset', className)}
        {...props}
      />
    )
  },
)

DropdownMenuLabel.displayName = 'DropdownMenuLabel'

export type DropdownMenuSeparatorProps = ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>

export const DropdownMenuSeparator = forwardRef<ComponentRef<typeof MenuPrimitive.Separator>, DropdownMenuSeparatorProps>(
  function DropdownMenuSeparator({ className, ...props }, ref) {
    return <MenuPrimitive.Separator ref={ref} className={cn('bom-dropdown-menu__separator', className)} {...props} />
  },
)

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator'

export type DropdownMenuShortcutProps = HTMLAttributes<HTMLSpanElement>

export const DropdownMenuShortcut = forwardRef<HTMLSpanElement, DropdownMenuShortcutProps>(function DropdownMenuShortcut(
  { className, ...props },
  ref,
) {
  return <span ref={ref} className={cn('bom-dropdown-menu__shortcut', className)} {...props} />
})

DropdownMenuShortcut.displayName = 'DropdownMenuShortcut'

export interface DropdownMenuSubTriggerProps extends ComponentPropsWithoutRef<typeof MenuPrimitive.SubTrigger> {
  inset?: boolean
}

export const DropdownMenuSubTrigger = forwardRef<
  ComponentRef<typeof MenuPrimitive.SubTrigger>,
  DropdownMenuSubTriggerProps
>(function DropdownMenuSubTrigger({ className, inset, children, ...props }, ref) {
  return (
    <MenuPrimitive.SubTrigger
      ref={ref}
      className={cn('bom-dropdown-menu__item', inset && 'bom-dropdown-menu__item--inset', className)}
      {...props}
    >
      {children}
      <ChevronRightIcon className="bom-dropdown-menu__sub-icon" />
    </MenuPrimitive.SubTrigger>
  )
})

DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger'

export type DropdownMenuSubContentProps = ComponentPropsWithoutRef<typeof MenuPrimitive.SubContent>

export const DropdownMenuSubContent = forwardRef<
  ComponentRef<typeof MenuPrimitive.SubContent>,
  DropdownMenuSubContentProps
>(function DropdownMenuSubContent({ className, ...props }, ref) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.SubContent ref={ref} className={cn('bom-dropdown-menu', className)} {...props} />
    </MenuPrimitive.Portal>
  )
})

DropdownMenuSubContent.displayName = 'DropdownMenuSubContent'
