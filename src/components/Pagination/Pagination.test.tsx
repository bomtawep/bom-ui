import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
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

describe('getPageItems', () => {
  it.each([
    [1, 5, 1, [1, 2, 3, 4, 5]],
    [1, 10, 1, [1, 2, 3, 4, 5, 'ellipsis', 10]],
    [5, 10, 1, [1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]],
    [10, 10, 1, [1, 'ellipsis', 6, 7, 8, 9, 10]],
    [1, 1, 1, [1]],
    [3, 0, 1, [1]],
  ] as const)('page %i of %i (siblings %i)', (page, count, sib, expected) => {
    expect(getPageItems(page, count, sib)).toEqual(expected)
  })
})

function Demo() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#1" />
        </PaginationItem>
        {getPageItems(2, 10).map((p, i) => (
          <PaginationItem key={i}>
            {p === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink href={`#${p}`} isActive={p === 2}>
                {p}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext href="#3" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

describe('Pagination', () => {
  it('uses Thai labels from messages and marks the current page', () => {
    render(<Demo />)
    expect(screen.getByRole('navigation', { name: 'การแบ่งหน้า' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'หน้าก่อนหน้า' })).toHaveTextContent('ก่อนหน้า')
    expect(screen.getByRole('link', { name: 'หน้าถัดไป' })).toHaveTextContent('ถัดไป')
    expect(screen.getByRole('link', { name: '2' })).toHaveAttribute('aria-current', 'page')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Demo />)
    await expectNoA11yViolations(container)
  })
})
