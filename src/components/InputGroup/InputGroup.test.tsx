import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from './InputGroup'

function Url() {
  return (
    <InputGroup aria-label="Website" className="extra">
      <InputGroupInput aria-label="URL" />
      <InputGroupAddon>
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupButton>Go</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

describe('InputGroup', () => {
  it('renders a group with an input and addons', () => {
    const { container } = render(<Url />)
    expect(screen.getByRole('group', { name: 'Website' })).toHaveClass('bom-input-group', 'extra')
    expect(screen.getByRole('textbox', { name: 'URL' })).toHaveClass('bom-input', 'bom-input-group__control')
    expect(container.querySelector('.bom-input-group__addon--inline-end')).toHaveAttribute('data-align', 'inline-end')
    expect(container.querySelector('.bom-input-group__addon--inline-start')).toBeInTheDocument()
  })

  it('focuses the input when the addon text is clicked', async () => {
    render(<Url />)
    await userEvent.click(screen.getByText('https://'))
    expect(screen.getByRole('textbox', { name: 'URL' })).toHaveFocus()
  })

  it('does not steal focus from addon buttons', async () => {
    const onClick = vi.fn()
    render(
      <InputGroup>
        <InputGroupInput aria-label="q" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton onClick={onClick} size="icon-xs" aria-label="Search">
            S
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>,
    )
    const btn = screen.getByRole('button', { name: 'Search' })
    expect(btn).toHaveAttribute('type', 'button')
    expect(btn).toHaveClass('bom-input-group__button--icon-xs', 'bom-btn--ghost')
    await userEvent.click(btn)
    expect(onClick).toHaveBeenCalled()
    expect(btn).toHaveFocus()
  })

  it('supports a textarea with a block-end addon', () => {
    const { container } = render(
      <InputGroup>
        <InputGroupTextarea aria-label="Message" />
        <InputGroupAddon align="block-end">0/280</InputGroupAddon>
      </InputGroup>,
    )
    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveClass('bom-textarea', 'bom-input-group__control')
    expect(container.querySelector('.bom-input-group__addon--block-end')).toHaveTextContent('0/280')
  })

  it('forwards refs', () => {
    const ref = createRef<HTMLDivElement>()
    const inputRef = createRef<HTMLInputElement>()
    const btnRef = createRef<HTMLButtonElement>()
    render(
      <InputGroup ref={ref}>
        <InputGroupInput ref={inputRef} aria-label="x" />
        <InputGroupAddon>
          <InputGroupButton ref={btnRef}>b</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(inputRef.current).toBeInstanceOf(HTMLInputElement)
    expect(btnRef.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('has displayNames', () => {
    for (const C of [InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea]) {
      expect(C.displayName).toMatch(/^InputGroup/)
    }
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Url />)
    await expectNoA11yViolations(container)
  })
})
