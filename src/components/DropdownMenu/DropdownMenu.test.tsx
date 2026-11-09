import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './DropdownMenu'

function Demo(props: { onEdit?: () => void; onGrid?: (v: boolean) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuItem onSelect={props.onEdit}>
          Edit <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>Copy</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={false} onCheckedChange={props.onGrid}>
          Show grid
        </DropdownMenuCheckboxItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Archive</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

async function open() {
  screen.getByRole('button', { name: 'Actions' }).focus()
  await userEvent.keyboard('{Enter}')
  return screen.findByRole('menu')
}

describe('DropdownMenu', () => {
  it('opens with Enter, moves with arrows, selects and closes', async () => {
    const onEdit = vi.fn()
    render(<Demo onEdit={onEdit} />)
    await open()
    await expectNoA11yViolations(document.body)
    await waitFor(() => expect(screen.getByRole('menuitem', { name: /Edit/ })).toHaveFocus())
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: 'Copy' })).toHaveFocus()
    await userEvent.keyboard('{ArrowUp}{Enter}')
    expect(onEdit).toHaveBeenCalled()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('closes with Escape and returns focus', async () => {
    render(<Demo />)
    await open()
    await userEvent.keyboard('{Escape}')
    expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus()
  })

  it('reports checkbox changes, opens a sub menu and marks destructive items', async () => {
    const onGrid = vi.fn()
    render(<Demo onGrid={onGrid} />)
    await open()
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute('data-variant', 'destructive')
    screen.getByRole('menuitem', { name: 'More' }).focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(await screen.findByRole('menuitem', { name: 'Archive' })).toBeInTheDocument()
    await userEvent.keyboard('{ArrowLeft}')
    await userEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Show grid' }))
    expect(onGrid).toHaveBeenCalledWith(true)
  })
})
