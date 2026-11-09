import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './Breadcrumb'

function Demo() {
  return (
    <Breadcrumb className="extra">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Invoice</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

describe('Breadcrumb', () => {
  it('is a navigation landmark named from messages', () => {
    render(<Demo />)
    expect(screen.getByRole('navigation', { name: 'เส้นทาง' })).toHaveClass('bom-breadcrumb', 'extra')
  })

  it('marks the current page', () => {
    render(<Demo />)
    expect(screen.getByText('Invoice')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Home' })).toHaveClass('bom-breadcrumb__link')
  })

  it('hides separators and labels the ellipsis', () => {
    const { container } = render(<Demo />)
    expect(container.querySelector('.bom-breadcrumb__separator')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText('เพิ่มเติม')).toHaveClass('bom-sr-only')
  })

  it('renders BreadcrumbLink asChild', () => {
    render(
      <BreadcrumbLink asChild>
        <a href="/docs">Docs</a>
      </BreadcrumbLink>,
    )
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveClass('bom-breadcrumb__link')
  })

  it('forwards refs', () => {
    const navRef = createRef<HTMLElement>()
    const listRef = createRef<HTMLOListElement>()
    const linkRef = createRef<HTMLAnchorElement>()
    render(
      <Breadcrumb ref={navRef}>
        <BreadcrumbList ref={listRef}>
          <BreadcrumbItem>
            <BreadcrumbLink ref={linkRef} href="/">
              h
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    )
    expect(navRef.current?.tagName).toBe('NAV')
    expect(listRef.current).toBeInstanceOf(HTMLOListElement)
    expect(linkRef.current).toBeInstanceOf(HTMLAnchorElement)
  })

  it('has displayNames', () => {
    for (const C of [Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis]) {
      expect(C.displayName).toMatch(/^Breadcrumb/)
    }
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Demo />)
    await expectNoA11yViolations(container)
  })
})
