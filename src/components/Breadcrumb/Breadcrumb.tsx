'use client'

import {
  forwardRef,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type LiHTMLAttributes,
  type OlHTMLAttributes,
} from 'react'
import { Slot } from 'radix-ui'
import { cn } from '../../lib/cn'
import { ChevronRightIcon, MoreHorizontalIcon } from '../../lib/icons'
import { useBomUI } from '../BomUIProvider/BomUIProvider'

export type BreadcrumbProps = HTMLAttributes<HTMLElement>

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { className, 'aria-label': ariaLabel, ...props },
  ref,
) {
  const { messages } = useBomUI()
  return <nav ref={ref} aria-label={ariaLabel ?? messages.breadcrumb} className={cn('bom-breadcrumb', className)} {...props} />
})

Breadcrumb.displayName = 'Breadcrumb'

export type BreadcrumbListProps = OlHTMLAttributes<HTMLOListElement>

export const BreadcrumbList = forwardRef<HTMLOListElement, BreadcrumbListProps>(function BreadcrumbList(
  { className, ...props },
  ref,
) {
  return <ol ref={ref} className={cn('bom-breadcrumb__list', className)} {...props} />
})

BreadcrumbList.displayName = 'BreadcrumbList'

export type BreadcrumbItemProps = LiHTMLAttributes<HTMLLIElement>

export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(function BreadcrumbItem(
  { className, ...props },
  ref,
) {
  return <li ref={ref} className={cn('bom-breadcrumb__item', className)} {...props} />
})

BreadcrumbItem.displayName = 'BreadcrumbItem'

export interface BreadcrumbLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Render the child (e.g. next/link) with the link classes. */
  asChild?: boolean
}

export const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(function BreadcrumbLink(
  { asChild = false, className, ...props },
  ref,
) {
  const Comp = asChild ? Slot.Root : 'a'
  return <Comp ref={ref} className={cn('bom-breadcrumb__link', className)} {...props} />
})

BreadcrumbLink.displayName = 'BreadcrumbLink'

export type BreadcrumbPageProps = HTMLAttributes<HTMLSpanElement>

export const BreadcrumbPage = forwardRef<HTMLSpanElement, BreadcrumbPageProps>(function BreadcrumbPage(
  { className, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn('bom-breadcrumb__page', className)}
      {...props}
    />
  )
})

BreadcrumbPage.displayName = 'BreadcrumbPage'

export type BreadcrumbSeparatorProps = LiHTMLAttributes<HTMLLIElement>

export const BreadcrumbSeparator = forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(function BreadcrumbSeparator(
  { className, children, ...props },
  ref,
) {
  return (
    <li ref={ref} role="presentation" aria-hidden="true" className={cn('bom-breadcrumb__separator', className)} {...props}>
      {children ?? <ChevronRightIcon />}
    </li>
  )
})

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'

export type BreadcrumbEllipsisProps = HTMLAttributes<HTMLSpanElement>

export const BreadcrumbEllipsis = forwardRef<HTMLSpanElement, BreadcrumbEllipsisProps>(function BreadcrumbEllipsis(
  { className, ...props },
  ref,
) {
  const { messages } = useBomUI()
  return (
    <span ref={ref} className={cn('bom-breadcrumb__ellipsis', className)} {...props}>
      <MoreHorizontalIcon />
      <span className="bom-sr-only">{messages.breadcrumbMore}</span>
    </span>
  )
})

BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis'
