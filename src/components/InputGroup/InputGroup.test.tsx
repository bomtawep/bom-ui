import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea } from './InputGroup'

describe('InputGroup', () => {
  it('focuses the input when addon text is clicked; buttons default to type=button', async () => {
    const { container } = render(
      <InputGroup>
        <InputGroupInput aria-label="URL" />
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupButton>Go</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>,
    )
    await userEvent.click(screen.getByText('https://'))
    expect(screen.getByRole('textbox', { name: 'URL' })).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Go' })).toHaveAttribute('type', 'button')
    expect(container.querySelector('[data-align="inline-end"]')).toBeInTheDocument()
    await expectNoA11yViolations(container)
  })

  it('supports a textarea', () => {
    render(
      <InputGroup>
        <InputGroupTextarea aria-label="Message" />
        <InputGroupAddon align="block-end">0/280</InputGroupAddon>
      </InputGroup>,
    )
    expect(screen.getByRole('textbox', { name: 'Message' }).tagName).toBe('TEXTAREA')
  })
})
