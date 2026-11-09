'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from '../../lib/icons'
import { useBomUI } from '../BomUIProvider/BomUIProvider'
import { Button } from '../Button/Button'
import { IconButton } from '../IconButton/IconButton'

export type PaginationVariant = 'full' | 'simple'

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Current page, 1-based. */
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  /** Pages shown on each side of the current page (full variant). Default 1. */
  siblingCount?: number
  /** 'full' = numbered pages with ellipsis; 'simple' = previous/next + "page X / Y". Default 'full'. */
  variant?: PaginationVariant
  /** simple variant: with pageSize, shows "1–10 of 120" on the left. */
  total?: number
  pageSize?: number
}

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i)

/** Page numbers to show, with 'ellipsis' for skipped runs. Always shows the first and last page. */
export function getPageItems(page: number, pageCount: number, siblingCount = 1): Array<number | 'ellipsis'> {
  const count = Math.max(1, pageCount)
  const current = Math.min(Math.max(1, page), count)
  // first + last + current + siblings on both sides + 2 ellipsis slots
  const slots = siblingCount * 2 + 5
  if (count <= slots) return range(1, count)

  const left = Math.max(current - siblingCount, 1)
  const right = Math.min(current + siblingCount, count)
  const showLeftEllipsis = left > 3
  const showRightEllipsis = right < count - 2
  const edgeCount = 3 + siblingCount * 2

  if (!showLeftEllipsis) return [...range(1, edgeCount), 'ellipsis', count]
  if (!showRightEllipsis) return [1, 'ellipsis', ...range(count - edgeCount + 1, count)]
  return [1, 'ellipsis', ...range(left, right), 'ellipsis', count]
}

/** Controlled pagination. Not tied to a router — update the URL yourself in onPageChange. */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    page,
    pageCount,
    onPageChange,
    siblingCount = 1,
    variant = 'full',
    total,
    pageSize,
    className,
    'aria-label': ariaLabel,
    ...props
  },
  ref,
) {
  const { messages } = useBomUI()
  const count = Math.max(1, pageCount)
  const current = Math.min(Math.max(1, page), count)
  const go = (p: number) => {
    if (p !== current && p >= 1 && p <= count) onPageChange(p)
  }

  const prev = (
    <IconButton
      aria-label={messages.previousPage}
      variant="secondary"
      size="sm"
      disabled={current <= 1}
      onClick={() => go(current - 1)}
    >
      <ChevronLeftIcon />
    </IconButton>
  )
  const next = (
    <IconButton
      aria-label={messages.nextPage}
      variant="secondary"
      size="sm"
      disabled={current >= count}
      onClick={() => go(current + 1)}
    >
      <ChevronRightIcon />
    </IconButton>
  )

  let body
  if (variant === 'simple') {
    const summary =
      total !== undefined && pageSize ? (
        <span className="bom-pagination__summary">
          {messages.pageSummary(total === 0 ? 0 : (current - 1) * pageSize + 1, Math.min(current * pageSize, total), total)}
        </span>
      ) : null
    body = (
      <>
        {summary}
        <div className="bom-pagination__controls">
          {prev}
          <span className="bom-pagination__page-of">{messages.pageOf(current, count)}</span>
          {next}
        </div>
      </>
    )
  } else {
    body = (
      <ul className="bom-pagination__list">
        <li>{prev}</li>
        {getPageItems(current, count, siblingCount).map((item, i) =>
          item === 'ellipsis' ? (
            <li key={`e${i}`} className="bom-pagination__ellipsis">
              <MoreHorizontalIcon />
              <span className="bom-sr-only">{messages.morePages}</span>
            </li>
          ) : (
            <li key={item}>
              <Button
                variant={item === current ? 'secondary' : 'ghost'}
                size="sm"
                className="bom-pagination__page"
                aria-current={item === current ? 'page' : undefined}
                onClick={() => go(item)}
              >
                {item}
              </Button>
            </li>
          ),
        )}
        <li>{next}</li>
      </ul>
    )
  }

  return (
    <nav
      ref={ref}
      aria-label={ariaLabel ?? messages.pagination}
      className={cn('bom-pagination', `bom-pagination--${variant}`, className)}
      {...props}
    >
      {body}
    </nav>
  )
})

Pagination.displayName = 'Pagination'
