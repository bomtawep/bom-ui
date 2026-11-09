import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { PageHeader } from './PageHeader'

describe('PageHeader', () => {
  it('renders an h1 title, description and actions', () => {
    const { container } = render(
      <PageHeader title="Invoices" description="All invoices" actions={<button type="button">New</button>} className="extra" />,
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Invoices' })).toHaveClass('bom-page-header__title')
    expect(screen.getByText('All invoices')).toHaveClass('bom-page-header__description')
    expect(screen.getByRole('button', { name: 'New' }).parentElement).toHaveClass('bom-page-header__actions')
    expect(container.firstElementChild).toHaveClass('bom-page-header', 'extra')
  })

  it('supports an h2 title', () => {
    render(<PageHeader title="Section" headingLevel={2} />)
    expect(screen.getByRole('heading', { level: 2, name: 'Section' })).toBeInTheDocument()
  })

  it('omits empty parts', () => {
    const { container } = render(<PageHeader title="T" />)
    expect(container.querySelector('.bom-page-header__description')).toBeNull()
    expect(container.querySelector('.bom-page-header__actions')).toBeNull()
  })

  it('forwards the ref and has a displayName', () => {
    const ref = createRef<HTMLDivElement>()
    render(<PageHeader ref={ref} title="T" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(PageHeader.displayName).toBe('PageHeader')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<PageHeader title="Invoices" description="d" />)
    await expectNoA11yViolations(container)
  })
})
