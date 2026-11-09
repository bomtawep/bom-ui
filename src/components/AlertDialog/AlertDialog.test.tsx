import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './AlertDialog'

function Demo(props: { onConfirm?: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Delete</AlertDialogTrigger>
      <AlertDialogContent className="extra">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete file?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="danger" onClick={props.onConfirm}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

describe('AlertDialog', () => {
  it('opens as an alertdialog and closes with Escape', async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    const dialog = screen.getByRole('alertdialog', { name: 'Delete file?' })
    expect(dialog).toHaveClass('bom-dialog', 'bom-alert-dialog', 'extra')
    await expectNoA11yViolations(document.body)
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('does not close when the overlay is clicked', async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    fireEvent.pointerDown(document.querySelector('.bom-dialog__overlay')!)
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
  })

  it('cancel closes; action calls onClick and closes', async () => {
    const onConfirm = vi.fn()
    render(<Demo onConfirm={onConfirm} />)
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveClass('bom-btn--secondary')
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    const action = screen.getAllByRole('button', { name: 'Delete' }).find((b) => b.classList.contains('bom-btn--danger'))!
    await userEvent.click(action)
    expect(onConfirm).toHaveBeenCalled()
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('forwards refs', () => {
    const ref = createRef<HTMLDivElement>()
    const overlayRef = createRef<HTMLDivElement>()
    render(
      <AlertDialog defaultOpen>
        <AlertDialogPortal>
          <AlertDialogOverlay ref={overlayRef} />
        </AlertDialogPortal>
        <AlertDialogContent ref={ref}>
          <AlertDialogTitle>t</AlertDialogTitle>
          <AlertDialogDescription>d</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(overlayRef.current).toBeInstanceOf(HTMLDivElement)
  })

  it('has displayNames', () => {
    for (const C of [
      AlertDialog,
      AlertDialogTrigger,
      AlertDialogPortal,
      AlertDialogOverlay,
      AlertDialogContent,
      AlertDialogHeader,
      AlertDialogFooter,
      AlertDialogTitle,
      AlertDialogDescription,
      AlertDialogAction,
      AlertDialogCancel,
    ]) {
      expect(C.displayName).toMatch(/^AlertDialog/)
    }
  })
})
