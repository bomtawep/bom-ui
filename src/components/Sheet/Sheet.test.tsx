import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from './Sheet'

function Demo(props: { side?: 'top' | 'right' | 'bottom' | 'left' }) {
  return (
    <Sheet>
      <SheetTrigger>Open</SheetTrigger>
      <SheetContent side={props.side} className="extra">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Narrow the list</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose>Apply</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

describe('Sheet', () => {
  it('opens from the right by default and closes with Escape', async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    const sheet = screen.getByRole('dialog', { name: 'Filters' })
    expect(sheet).toHaveClass('bom-sheet', 'bom-sheet--right', 'extra')
    await expectNoA11yViolations(document.body)
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it.each(['top', 'right', 'bottom', 'left'] as const)('applies the %s side', async (side) => {
    render(<Demo side={side} />)
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('dialog')).toHaveClass(`bom-sheet--${side}`)
  })

  it('closes with the corner button and SheetClose', async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    await userEvent.click(screen.getByRole('button', { name: 'ปิด' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('forwards refs', () => {
    const ref = createRef<HTMLDivElement>()
    const overlayRef = createRef<HTMLDivElement>()
    render(
      <Sheet defaultOpen>
        <SheetPortal>
          <SheetOverlay ref={overlayRef} />
        </SheetPortal>
        <SheetContent ref={ref}>
          <SheetTitle>t</SheetTitle>
          <SheetDescription>d</SheetDescription>
        </SheetContent>
      </Sheet>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(overlayRef.current).toHaveClass('bom-sheet__overlay')
  })

  it('has displayNames', () => {
    for (const C of [Sheet, SheetTrigger, SheetPortal, SheetClose, SheetOverlay, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription]) {
      expect(C.displayName).toMatch(/^Sheet/)
    }
  })
})
