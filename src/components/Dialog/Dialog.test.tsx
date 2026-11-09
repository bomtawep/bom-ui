import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from './Dialog'

function Demo(props: { footerClose?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent className="extra">
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription>Change things</DialogDescription>
        </DialogHeader>
        <input aria-label="Name" />
        <DialogFooter showCloseButton={props.footerClose} />
      </DialogContent>
    </Dialog>
  )
}

describe('Dialog', () => {
  it('opens, closes with Escape and the close button', async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    const dialog = screen.getByRole('dialog', { name: 'Edit' })
    expect(dialog).toHaveClass('bom-dialog', 'extra')
    expect(dialog).toHaveAccessibleDescription('Change things')
    await expectNoA11yViolations(document.body)
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus()
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    await userEvent.click(screen.getByRole('button', { name: 'ปิด' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps focus inside while open', async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    for (let i = 0; i < 4; i++) await userEvent.tab()
    expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true)
  })

  it('can add a footer close button', async () => {
    render(<Demo footerClose />)
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    const closes = screen.getAllByRole('button', { name: 'ปิด' })
    expect(closes).toHaveLength(2)
    await userEvent.click(closes[0])
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('can hide the corner close button', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent showCloseButton={false}>
          <DialogTitle>t</DialogTitle>
          <DialogDescription>d</DialogDescription>
        </DialogContent>
      </Dialog>,
    )
    expect(screen.queryByRole('button', { name: 'ปิด' })).not.toBeInTheDocument()
  })

  it('forwards refs', () => {
    const ref = createRef<HTMLDivElement>()
    const overlayRef = createRef<HTMLDivElement>()
    render(
      <Dialog defaultOpen>
        <DialogPortal>
          <DialogOverlay ref={overlayRef} />
        </DialogPortal>
        <DialogContent ref={ref}>
          <DialogTitle>t</DialogTitle>
          <DialogDescription>d</DialogDescription>
          <DialogClose>c</DialogClose>
        </DialogContent>
      </Dialog>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(overlayRef.current).toHaveClass('bom-dialog__overlay')
  })

  it('has displayNames', () => {
    for (const C of [Dialog, DialogTrigger, DialogPortal, DialogClose, DialogOverlay, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription]) {
      expect(C.displayName).toMatch(/^Dialog/)
    }
  })
})
