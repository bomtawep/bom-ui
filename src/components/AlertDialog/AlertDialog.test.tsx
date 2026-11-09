import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
  AlertDialogTitle,
  AlertDialogTrigger,
} from './AlertDialog'

function Demo(props: { onConfirm?: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Delete</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete file?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={props.onConfirm}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

describe('AlertDialog', () => {
  it('opens as an alertdialog, ignores overlay clicks and closes with Escape', async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.getByRole('alertdialog', { name: 'Delete file?' })).toBeInTheDocument()
    await expectNoA11yViolations(document.body)
    fireEvent.pointerDown(document.querySelector('[data-slot="alert-dialog-overlay"]')!)
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('cancel closes; action calls onClick and closes', async () => {
    const onConfirm = vi.fn()
    render(<Demo onConfirm={onConfirm} />)
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    const action = screen.getByRole('button', { name: 'Confirm' })
    expect(action).toHaveAttribute('data-variant', 'destructive')
    await userEvent.click(action)
    expect(onConfirm).toHaveBeenCalled()
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })
})
