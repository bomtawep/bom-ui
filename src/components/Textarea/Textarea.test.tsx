import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('renders with the base class and custom className', () => {
    render(<Textarea aria-label="Note" className="extra" />)
    expect(screen.getByRole('textbox', { name: 'Note' })).toHaveClass('bom-textarea', 'extra')
  })

  it('types text and marks invalid', async () => {
    render(<Textarea aria-label="Note" aria-invalid />)
    await userEvent.type(screen.getByRole('textbox'), 'hello')
    expect(screen.getByRole('textbox')).toHaveValue('hello')
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('forwards the ref', () => {
    const ref = createRef<HTMLTextAreaElement>()
    render(<Textarea aria-label="x" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
  })

  it('has a displayName', () => {
    expect(Textarea.displayName).toBe('Textarea')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Textarea aria-label="Note" />)
    await expectNoA11yViolations(container)
  })
})
