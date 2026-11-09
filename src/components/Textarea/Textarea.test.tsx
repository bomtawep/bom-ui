import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('types text', async () => {
    const { container } = render(<Textarea aria-label="Note" />)
    const box = screen.getByRole('textbox', { name: 'Note' })
    expect(box).toHaveAttribute('data-slot', 'textarea')
    await userEvent.type(box, 'hello')
    expect(box).toHaveValue('hello')
    await expectNoA11yViolations(container)
  })
})
