import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import {
  Popover,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from './Popover'

function Demo() {
  return (
    <Popover>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent aria-label="Dimensions" className="extra">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>Set the size</PopoverDescription>
        </PopoverHeader>
        <PopoverClose>Done</PopoverClose>
      </PopoverContent>
    </Popover>
  )
}

describe('Popover', () => {
  it('opens on click and closes with Escape, returning focus', async () => {
    render(<Demo />)
    const trigger = screen.getByRole('button', { name: 'Open' })
    await userEvent.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Dimensions' })
    expect(dialog).toHaveClass('bom-popover', 'extra')
    expect(screen.getByText('Dimensions')).toHaveClass('bom-popover__title')
    await expectNoA11yViolations(document.body)
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('closes with PopoverClose', async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    await userEvent.click(screen.getByRole('button', { name: 'Done' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('forwards refs', () => {
    const ref = createRef<HTMLDivElement>()
    const anchorRef = createRef<HTMLDivElement>()
    render(
      <Popover defaultOpen>
        <PopoverAnchor ref={anchorRef}>
          <span>anchor</span>
        </PopoverAnchor>
        <PopoverContent ref={ref} aria-label="x">
          c
        </PopoverContent>
      </Popover>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(anchorRef.current).toBeInstanceOf(HTMLDivElement)
  })

  it('has displayNames', () => {
    for (const C of [Popover, PopoverTrigger, PopoverAnchor, PopoverClose, PopoverContent, PopoverHeader, PopoverTitle, PopoverDescription]) {
      expect(C.displayName).toMatch(/^Popover/)
    }
  })
})
