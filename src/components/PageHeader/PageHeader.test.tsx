import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { PageHeader } from './PageHeader'

describe('PageHeader', () => {
  it('renders an h1 title, description and actions; h2 on request', async () => {
    const { container, rerender } = render(
      <PageHeader title="Invoices" description="All invoices" actions={<button type="button">New</button>} />,
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Invoices' })).toBeInTheDocument()
    expect(screen.getByText('All invoices')).toHaveAttribute('data-slot', 'page-header-description')
    expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument()
    await expectNoA11yViolations(container)
    rerender(<PageHeader title="Section" headingLevel={2} />)
    expect(screen.getByRole('heading', { level: 2, name: 'Section' })).toBeInTheDocument()
    expect(container.querySelector('[data-slot="page-header-actions"]')).toBeNull()
  })
})
