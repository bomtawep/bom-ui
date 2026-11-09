import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './Dialog'

function Demo(props: { footerClose?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
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
  it('opens, closes with Escape and with the close button (labelled from messages)', async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    const dialog = screen.getByRole('dialog', { name: 'Edit' })
    expect(dialog).toHaveAttribute('data-slot', 'dialog-content')
    expect(dialog).toHaveAccessibleDescription('Change things')
    await expectNoA11yViolations(document.body)
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
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
    expect(screen.getAllByRole('button', { name: 'ปิด' })).toHaveLength(2)
  })
})
