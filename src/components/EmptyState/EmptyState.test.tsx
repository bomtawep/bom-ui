import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { FileWarningIcon } from '../../lib/icons'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders title, description, icon and action', () => {
    const { container } = render(
      <EmptyState
        className="extra"
        icon={<FileWarningIcon />}
        title="No documents"
        description="Upload one to start"
        action={<button type="button">Upload</button>}
      />,
    )
    expect(container.firstElementChild).toHaveClass('bom-empty-state', 'extra')
    expect(screen.getByText('No documents')).toHaveClass('bom-empty-state__title')
    expect(screen.getByText('Upload one to start')).toHaveClass('bom-empty-state__description')
    expect(screen.getByRole('button', { name: 'Upload' })).toBeInTheDocument()
    expect(container.querySelector('.bom-empty-state__icon')).toHaveAttribute('aria-hidden', 'true')
  })

  it('forwards the ref and has a displayName', () => {
    const ref = createRef<HTMLDivElement>()
    render(<EmptyState ref={ref} title="t" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(EmptyState.displayName).toBe('EmptyState')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<EmptyState title="No documents" action={<button type="button">Upload</button>} />)
    await expectNoA11yViolations(container)
  })
})
