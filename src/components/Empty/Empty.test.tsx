import { render, screen } from '@testing-library/react'
import { InboxIcon } from 'lucide-react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from './Empty'

function Demo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <InboxIcon />
        </EmptyMedia>
        <EmptyTitle>No documents</EmptyTitle>
        <EmptyDescription>Upload one to start</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <button type="button">Upload</button>
      </EmptyContent>
    </Empty>
  )
}

describe('Empty', () => {
  it('renders its parts', async () => {
    const { container } = render(<Demo />)
    expect(screen.getByText('No documents')).toHaveAttribute('data-slot', 'empty-title')
    expect(container.querySelector('[data-slot="empty-icon"]')).toHaveAttribute('data-variant', 'icon')
    await expectNoA11yViolations(container)
  })
})
