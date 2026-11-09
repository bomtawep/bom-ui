import * as React from "react"
import { cn } from "cn"
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"

import { Button } from "../Button/Button"
import { useBomUI } from "../BomUIProvider/BomUIProvider"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  const { messages } = useBomUI()
  return (
    <nav
      role="navigation"
      aria-label={messages.pagination}
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-0.5", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      asChild
      variant={isActive ? "outline" : "ghost"}
      size={size}
      className={cn(className)}
    >
      <a
        aria-current={isActive ? "page" : undefined}
        data-slot="pagination-link"
        data-active={isActive}
        {...props}
      />
    </Button>
  )
}

function PaginationPrevious({
  className,
  text,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  const { messages } = useBomUI()
  return (
    <PaginationLink
      aria-label={messages.previousPage}
      size="default"
      className={cn("pl-1.5!", className)}
      {...props}
    >
      <ChevronLeftIcon data-icon="inline-start" className="cn-rtl-flip" />
      <span className="hidden sm:block">{text ?? messages.previous}</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  text,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  const { messages } = useBomUI()
  return (
    <PaginationLink
      aria-label={messages.nextPage}
      size="default"
      className={cn("pr-1.5!", className)}
      {...props}
    >
      <span className="hidden sm:block">{text ?? messages.next}</span>
      <ChevronRightIcon data-icon="inline-end" className="cn-rtl-flip" />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const { messages } = useBomUI()
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">{messages.morePages}</span>
    </span>
  )
}

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i)

/**
 * bom-ui extra: page numbers to render, with "ellipsis" for skipped runs. Always includes the first
 * and last page and keeps a fixed number of slots so the bar does not jump while paging.
 *
 *   getPageItems(5, 10) // [1, "ellipsis", 4, 5, 6, "ellipsis", 10]
 */
function getPageItems(page: number, pageCount: number, siblingCount = 1): Array<number | "ellipsis"> {
  const count = Math.max(1, pageCount)
  const current = Math.min(Math.max(1, page), count)
  const slots = siblingCount * 2 + 5
  if (count <= slots) return range(1, count)
  const left = Math.max(current - siblingCount, 1)
  const right = Math.min(current + siblingCount, count)
  const edgeCount = 3 + siblingCount * 2
  if (left <= 3) return [...range(1, edgeCount), "ellipsis", count]
  if (right >= count - 2) return [1, "ellipsis", ...range(count - edgeCount + 1, count)]
  return [1, "ellipsis", ...range(left, right), "ellipsis", count]
}

export {
  getPageItems,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}

export type PaginationProps = React.ComponentProps<typeof Pagination>
export type PaginationContentProps = React.ComponentProps<typeof PaginationContent>
export type PaginationEllipsisProps = React.ComponentProps<typeof PaginationEllipsis>
export type PaginationItemProps = React.ComponentProps<typeof PaginationItem>
export type PaginationNextProps = React.ComponentProps<typeof PaginationNext>
export type PaginationPreviousProps = React.ComponentProps<typeof PaginationPrevious>
