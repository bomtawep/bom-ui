import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { getPageItems, Pagination } from './Pagination'

describe('getPageItems', () => {
  it.each([
    [1, 5, 1, [1, 2, 3, 4, 5]],
    [1, 10, 1, [1, 2, 3, 4, 5, 'ellipsis', 10]],
    [5, 10, 1, [1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]],
    [10, 10, 1, [1, 'ellipsis', 6, 7, 8, 9, 10]],
    [1, 1, 1, [1]],
    [1, 7, 1, [1, 2, 3, 4, 5, 6, 7]],
    [6, 20, 2, [1, 'ellipsis', 4, 5, 6, 7, 8, 'ellipsis', 20]],
    [3, 0, 1, [1]],
  ] as const)('page %i of %i (siblings %i)', (page, count, sib, expected) => {
    expect(getPageItems(page, count, sib)).toEqual(expected)
  })
})

describe('Pagination', () => {
  it('is a labelled navigation and marks the current page', () => {
    render(<Pagination page={5} pageCount={10} onPageChange={() => {}} className="extra" />)
    const nav = screen.getByRole('navigation', { name: 'การแบ่งหน้า' })
    expect(nav).toHaveClass('bom-pagination', 'bom-pagination--full', 'extra')
    expect(screen.getByRole('button', { name: '5' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getAllByText('หน้าอื่น ๆ')).toHaveLength(2)
  })

  it('calls onPageChange for next, previous and page buttons', async () => {
    const onPageChange = vi.fn()
    render(<Pagination page={5} pageCount={10} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'หน้าถัดไป' }))
    await userEvent.click(screen.getByRole('button', { name: 'หน้าก่อนหน้า' }))
    await userEvent.click(screen.getByRole('button', { name: '10' }))
    expect(onPageChange.mock.calls).toEqual([[6], [4], [10]])
  })

  it('disables previous on the first page and next on the last', () => {
    const { rerender } = render(<Pagination page={1} pageCount={3} onPageChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'หน้าก่อนหน้า' })).toBeDisabled()
    rerender(<Pagination page={3} pageCount={3} onPageChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'หน้าถัดไป' })).toBeDisabled()
  })

  it('does not call onPageChange for the current page', async () => {
    const onPageChange = vi.fn()
    render(<Pagination page={2} pageCount={3} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByRole('button', { name: '2' }))
    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('simple variant shows the summary and page of', () => {
    render(<Pagination variant="simple" page={1} pageCount={12} total={120} pageSize={10} onPageChange={() => {}} />)
    expect(screen.getByRole('navigation')).toHaveClass('bom-pagination--simple')
    expect(screen.getByText('1–10 จาก 120 รายการ')).toBeInTheDocument()
    expect(screen.getByText('หน้า 1 / 12')).toBeInTheDocument()
  })

  it('simple variant handles an empty list', () => {
    render(<Pagination variant="simple" page={1} pageCount={0} total={0} pageSize={10} onPageChange={() => {}} />)
    expect(screen.getByText('0–0 จาก 0 รายการ')).toBeInTheDocument()
    expect(screen.getByText('หน้า 1 / 1')).toBeInTheDocument()
  })

  it('forwards the ref and has a displayName', () => {
    const ref = createRef<HTMLElement>()
    render(<Pagination ref={ref} page={1} pageCount={2} onPageChange={() => {}} />)
    expect(ref.current?.tagName).toBe('NAV')
    expect(Pagination.displayName).toBe('Pagination')
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <>
        <Pagination page={5} pageCount={10} onPageChange={() => {}} />
        <Pagination aria-label="simple" variant="simple" page={2} pageCount={5} total={50} pageSize={10} onPageChange={() => {}} />
      </>,
    )
    await expectNoA11yViolations(container)
  })
})
