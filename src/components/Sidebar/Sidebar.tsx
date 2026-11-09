'use client'

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type ComponentProps,
  type CSSProperties,
  type HTMLAttributes,
  type AnchorHTMLAttributes,
} from 'react'
import { Slot } from 'radix-ui'
import { cn } from '../../lib/cn'
import { PanelLeftIcon } from '../../lib/icons'
import { useIsMobile } from '../../lib/use-is-mobile'
import { useBomUI } from '../BomUIProvider/BomUIProvider'
import { IconButton, type IconButtonProps } from '../IconButton/IconButton'
import { Input, type InputProps } from '../Input/Input'
import { Separator, type SeparatorProps } from '../Separator/Separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../Sheet/Sheet'
import { Skeleton } from '../Skeleton/Skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../Tooltip/Tooltip'

const SIDEBAR_COOKIE_NAME = 'sidebar_state'
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_KEYBOARD_SHORTCUT = 'b'

// ---------- context

export interface SidebarContextValue {
  state: 'expanded' | 'collapsed'
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext)
  if (!context) throw new Error('useSidebar must be used within a SidebarProvider.')
  return context
}

export interface SidebarProviderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Initial open state on desktop. To remember it across reloads, read the `sidebar_state`
   * cookie on the server and pass it here (the provider writes the cookie on every change).
   */
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const SidebarProvider = forwardRef<HTMLDivElement, SidebarProviderProps>(function SidebarProvider(
  { defaultOpen = true, open: openProp, onOpenChange, className, children, ...props },
  ref,
) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = useState(false)
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const open = openProp ?? internalOpen

  const setOpen = useCallback(
    (value: boolean) => {
      if (onOpenChange) onOpenChange(value)
      else setInternalOpen(value)
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [onOpenChange],
  )

  const toggleSidebar = useCallback(() => {
    if (isMobile) setOpenMobile((o) => !o)
    else setOpen(!open)
  }, [isMobile, open, setOpen])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [toggleSidebar])

  const state = open ? 'expanded' : 'collapsed'
  const value = useMemo<SidebarContextValue>(
    () => ({ state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar }),
    [state, open, setOpen, isMobile, openMobile, toggleSidebar],
  )

  return (
    <SidebarContext.Provider value={value}>
      <TooltipProvider delayDuration={0}>
        <div ref={ref} className={cn('bom-sidebar-wrapper', className)} {...props}>
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
})

SidebarProvider.displayName = 'SidebarProvider'

// ---------- Sidebar

export type SidebarSide = 'left' | 'right'
export type SidebarVariant = 'sidebar' | 'floating' | 'inset'
export type SidebarCollapsible = 'offcanvas' | 'icon' | 'none'

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  side?: SidebarSide
  variant?: SidebarVariant
  collapsible?: SidebarCollapsible
}

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(function Sidebar(
  { side = 'left', variant = 'sidebar', collapsible = 'offcanvas', className, children, dir, ...props },
  ref,
) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()
  const { messages } = useBomUI()

  if (collapsible === 'none') {
    return (
      <div ref={ref} className={cn('bom-sidebar-static', className)} {...props}>
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          ref={ref}
          dir={dir}
          side={side}
          showCloseButton={false}
          data-mobile="true"
          className={cn('bom-sidebar-mobile', className)}
          {...props}
        >
          <SheetHeader className="bom-sr-only">
            <SheetTitle>{messages.toggleSidebar}</SheetTitle>
            <SheetDescription>{messages.toggleSidebar}</SheetDescription>
          </SheetHeader>
          <div className="bom-sidebar__inner">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      className="bom-sidebar"
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-variant={variant}
      data-side={side}
    >
      {/* reserves the sidebar's width in the page flow */}
      <div className="bom-sidebar__gap" />
      <div ref={ref} dir={dir} className={cn('bom-sidebar__container', className)} {...props}>
        <div className="bom-sidebar__inner">{children}</div>
      </div>
    </div>
  )
})

Sidebar.displayName = 'Sidebar'

// ---------- controls

export type SidebarTriggerProps = Omit<IconButtonProps, 'aria-label'> & { 'aria-label'?: string }

export const SidebarTrigger = forwardRef<HTMLButtonElement, SidebarTriggerProps>(function SidebarTrigger(
  { className, onClick, 'aria-label': ariaLabel, children, ...props },
  ref,
) {
  const { toggleSidebar } = useSidebar()
  const { messages } = useBomUI()
  return (
    <IconButton
      ref={ref}
      size="sm"
      aria-label={ariaLabel ?? messages.toggleSidebar}
      className={cn('bom-sidebar__trigger', className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      {children ?? <PanelLeftIcon />}
    </IconButton>
  )
})

SidebarTrigger.displayName = 'SidebarTrigger'

export type SidebarRailProps = ButtonHTMLAttributes<HTMLButtonElement>

/** Thin clickable edge that toggles the sidebar (mouse only; keyboard users use the trigger). */
export const SidebarRail = forwardRef<HTMLButtonElement, SidebarRailProps>(function SidebarRail(
  { className, ...props },
  ref,
) {
  const { toggleSidebar } = useSidebar()
  const { messages } = useBomUI()
  return (
    <button
      ref={ref}
      type="button"
      aria-label={messages.toggleSidebar}
      title={messages.toggleSidebar}
      tabIndex={-1}
      onClick={toggleSidebar}
      className={cn('bom-sidebar__rail', className)}
      {...props}
    />
  )
})

SidebarRail.displayName = 'SidebarRail'

export type SidebarInsetProps = HTMLAttributes<HTMLElement>

/** The page content next to the sidebar (renders <main>). */
export const SidebarInset = forwardRef<HTMLElement, SidebarInsetProps>(function SidebarInset(
  { className, ...props },
  ref,
) {
  return <main ref={ref} className={cn('bom-sidebar-inset', className)} {...props} />
})

SidebarInset.displayName = 'SidebarInset'

export type SidebarInputProps = InputProps

export const SidebarInput = forwardRef<HTMLInputElement, SidebarInputProps>(function SidebarInput(
  { className, ...props },
  ref,
) {
  return <Input ref={ref} size="sm" className={cn('bom-sidebar__input', className)} {...props} />
})

SidebarInput.displayName = 'SidebarInput'

export type SidebarSeparatorProps = SeparatorProps

export const SidebarSeparator = forwardRef<HTMLDivElement, SidebarSeparatorProps>(function SidebarSeparator(
  { className, ...props },
  ref,
) {
  return <Separator ref={ref} className={cn('bom-sidebar__separator', className)} {...props} />
})

SidebarSeparator.displayName = 'SidebarSeparator'

// ---------- simple layout parts

type DivProps = HTMLAttributes<HTMLDivElement>

function divPart(name: string, cls: string) {
  const Part = forwardRef<HTMLDivElement, DivProps>(function SidebarPart({ className, ...props }, ref) {
    return <div ref={ref} className={cn(cls, className)} {...props} />
  })
  Part.displayName = name
  return Part
}

export type SidebarHeaderProps = DivProps
export type SidebarFooterProps = DivProps
export type SidebarContentProps = DivProps
export type SidebarGroupProps = DivProps
export type SidebarGroupContentProps = DivProps
export type SidebarMenuBadgeProps = DivProps

export const SidebarHeader = divPart('SidebarHeader', 'bom-sidebar__header')
export const SidebarFooter = divPart('SidebarFooter', 'bom-sidebar__footer')
export const SidebarContent = divPart('SidebarContent', 'bom-sidebar__content')
export const SidebarGroup = divPart('SidebarGroup', 'bom-sidebar__group')
export const SidebarGroupContent = divPart('SidebarGroupContent', 'bom-sidebar__group-content')
export const SidebarMenuBadge = divPart('SidebarMenuBadge', 'bom-sidebar__menu-badge')

export interface SidebarGroupLabelProps extends DivProps {
  asChild?: boolean
}

export const SidebarGroupLabel = forwardRef<HTMLDivElement, SidebarGroupLabelProps>(function SidebarGroupLabel(
  { asChild = false, className, ...props },
  ref,
) {
  const Comp = asChild ? Slot.Root : 'div'
  return <Comp ref={ref} className={cn('bom-sidebar__group-label', className)} {...props} />
})

SidebarGroupLabel.displayName = 'SidebarGroupLabel'

export interface SidebarGroupActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export const SidebarGroupAction = forwardRef<HTMLButtonElement, SidebarGroupActionProps>(function SidebarGroupAction(
  { asChild = false, className, type = 'button', ...props },
  ref,
) {
  const Comp = asChild ? Slot.Root : 'button'
  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : type}
      className={cn('bom-sidebar__action', 'bom-sidebar__group-action', className)}
      {...props}
    />
  )
})

SidebarGroupAction.displayName = 'SidebarGroupAction'

// ---------- menu

export type SidebarMenuProps = HTMLAttributes<HTMLUListElement>

export const SidebarMenu = forwardRef<HTMLUListElement, SidebarMenuProps>(function SidebarMenu(
  { className, ...props },
  ref,
) {
  return <ul ref={ref} className={cn('bom-sidebar__menu', className)} {...props} />
})

SidebarMenu.displayName = 'SidebarMenu'

export type SidebarMenuItemProps = HTMLAttributes<HTMLLIElement>

export const SidebarMenuItem = forwardRef<HTMLLIElement, SidebarMenuItemProps>(function SidebarMenuItem(
  { className, ...props },
  ref,
) {
  return <li ref={ref} className={cn('bom-sidebar__menu-item', className)} {...props} />
})

SidebarMenuItem.displayName = 'SidebarMenuItem'

export type SidebarMenuButtonSize = 'sm' | 'md' | 'lg'

export interface SidebarMenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render the child (e.g. next/link) with the button's classes. */
  asChild?: boolean
  isActive?: boolean
  variant?: 'default' | 'outline'
  size?: SidebarMenuButtonSize
  /** Shown only when the sidebar is collapsed to icons (desktop). */
  tooltip?: string | ComponentProps<typeof TooltipContent>
}

export const SidebarMenuButton = forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(function SidebarMenuButton(
  { asChild = false, isActive = false, variant = 'default', size = 'md', tooltip, className, type = 'button', ...props },
  ref,
) {
  const { isMobile, state } = useSidebar()
  const Comp = asChild ? Slot.Root : 'button'
  const button = (
    <Comp
      ref={ref}
      type={asChild ? undefined : type}
      data-active={isActive}
      data-size={size}
      className={cn(
        'bom-sidebar__menu-button',
        `bom-sidebar__menu-button--${variant}`,
        `bom-sidebar__menu-button--${size}`,
        className,
      )}
      {...props}
    />
  )
  if (!tooltip) return button
  const content = typeof tooltip === 'string' ? { children: tooltip } : tooltip
  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" align="center" hidden={state !== 'collapsed' || isMobile} {...content} />
    </Tooltip>
  )
})

SidebarMenuButton.displayName = 'SidebarMenuButton'

export interface SidebarMenuActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  /** Only show while the menu item is hovered or focused (desktop). */
  showOnHover?: boolean
}

export const SidebarMenuAction = forwardRef<HTMLButtonElement, SidebarMenuActionProps>(function SidebarMenuAction(
  { asChild = false, showOnHover = false, className, type = 'button', ...props },
  ref,
) {
  const Comp = asChild ? Slot.Root : 'button'
  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : type}
      className={cn(
        'bom-sidebar__action',
        'bom-sidebar__menu-action',
        showOnHover && 'bom-sidebar__menu-action--hover',
        className,
      )}
      {...props}
    />
  )
})

SidebarMenuAction.displayName = 'SidebarMenuAction'

export interface SidebarMenuSkeletonProps extends DivProps {
  showIcon?: boolean
  /** Width of the text bar. Fixed (not random) so server and client render the same. Default '70%'. */
  width?: string
}

export const SidebarMenuSkeleton = forwardRef<HTMLDivElement, SidebarMenuSkeletonProps>(function SidebarMenuSkeleton(
  { showIcon = false, width = '70%', className, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn('bom-sidebar__menu-skeleton', className)} {...props}>
      {showIcon && <Skeleton className="bom-sidebar__menu-skeleton-icon" />}
      <Skeleton className="bom-sidebar__menu-skeleton-text" style={{ maxWidth: width } as CSSProperties} />
    </div>
  )
})

SidebarMenuSkeleton.displayName = 'SidebarMenuSkeleton'

export type SidebarMenuSubProps = HTMLAttributes<HTMLUListElement>

export const SidebarMenuSub = forwardRef<HTMLUListElement, SidebarMenuSubProps>(function SidebarMenuSub(
  { className, ...props },
  ref,
) {
  return <ul ref={ref} className={cn('bom-sidebar__menu-sub', className)} {...props} />
})

SidebarMenuSub.displayName = 'SidebarMenuSub'

export type SidebarMenuSubItemProps = HTMLAttributes<HTMLLIElement>

export const SidebarMenuSubItem = forwardRef<HTMLLIElement, SidebarMenuSubItemProps>(function SidebarMenuSubItem(
  { className, ...props },
  ref,
) {
  return <li ref={ref} className={cn('bom-sidebar__menu-sub-item', className)} {...props} />
})

SidebarMenuSubItem.displayName = 'SidebarMenuSubItem'

export interface SidebarMenuSubButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean
  size?: 'sm' | 'md'
  isActive?: boolean
}

export const SidebarMenuSubButton = forwardRef<HTMLAnchorElement, SidebarMenuSubButtonProps>(
  function SidebarMenuSubButton({ asChild = false, size = 'md', isActive = false, className, ...props }, ref) {
    const Comp = asChild ? Slot.Root : 'a'
    return (
      <Comp
        ref={ref}
        data-active={isActive}
        data-size={size}
        className={cn('bom-sidebar__menu-sub-button', `bom-sidebar__menu-sub-button--${size}`, className)}
        {...props}
      />
    )
  },
)

SidebarMenuSubButton.displayName = 'SidebarMenuSubButton'
