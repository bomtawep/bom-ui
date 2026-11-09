import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
  getPageItems,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './Pagination'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const WithGetPageItems: Story = {
  render: () => {
    const pageCount = 20
    const [page, setPage] = useState(5)
    const go = (p: number) => (e: React.MouseEvent) => {
      e.preventDefault()
      setPage(Math.min(Math.max(1, p), pageCount))
    }
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" onClick={go(page - 1)} />
          </PaginationItem>
          {getPageItems(page, pageCount).map((p, i) => (
            <PaginationItem key={i}>
              {p === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink href="#" isActive={p === page} onClick={go(p)}>
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext href="#" onClick={go(page + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  },
}
