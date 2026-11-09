import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
      <DropdownMenuContent className="extra">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={props.onEdit}>
            Edit <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>Copy</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={false} onCheckedChange={props.onGrid}>
          Show grid
        </DropdownMenuCheckboxItem>
        <DropdownMenuRadioGroup value="a">
          <DropdownMenuRadioItem value="a">Small</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Archive</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem variant="danger">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

async function openWithKeyboard() {
  screen.getByRole('button', { name: 'Actions' }).focus()
  await userEvent.keyboard('{Enter}')
  return screen.findByRole('menu')
}

describe('DropdownMenu', () => {
  it('opens with Enter, moves with arrows, selects and closes', async () => {
    const onEdit = vi.fn()
    render(<Demo onEdit={onEdit} />)
    const menu = await openWithKeyboard()
    expect(menu).toHaveClass('bom-dropdown-menu', 'extra')
    await expectNoA11yViolations(document.body)
    await waitFor(() => expect(screen.getByRole('menuitem', { name: /Edit/ })).toHaveFocus())
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: 'Copy' })).toHaveFocus()
    await userEvent.keyboard('{ArrowUp}{Enter}')
    expect(onEdit).toHaveBeenCalled()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('closes with Escape and returns focus to the trigger', async () => {
    render(<Demo />)
    await openWithKeyboard()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus()
  })

  it('reports checkbox item changes', async () => {
    const onGrid = vi.fn()
    render(<Demo onGrid={onGrid} />)
    await openWithKeyboard()
    const item = screen.getByRole('menuitemcheckbox', { name: 'Show grid' })
    expect(item).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(item)
    expect(onGrid).toHaveBeenCalledWith(true)
  })

  it('opens a sub menu with ArrowRight', async () => {
    render(<Demo />)
    await openWithKeyboard()
    screen.getByRole('menuitem', { name: 'More' }).focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(await screen.findByRole('menuitem', { name: 'Archive' })).toBeInTheDocument()
  })

  it('applies item variants and parts', async () => {
    render(<Demo />)
    await openWithKeyboard()
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveClass('bom-dropdown-menu__item--danger')
    expect(screen.getByText('⌘E')).toHaveClass('bom-dropdown-menu__shortcut')
    expect(screen.getByRole('menuitemradio', { name: 'Small' })).toHaveAttribute('aria-checked', 'true')
  })

  it('forwards refs', () => {
    const ref = createRef<HTMLDivElement>()
    const itemRef = createRef<HTMLDivElement>()
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>t</DropdownMenuTrigger>
        <DropdownMenuContent ref={ref}>
          <DropdownMenuItem ref={itemRef}>i</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(itemRef.current).toHaveClass('bom-dropdown-menu__item')
  })

  it('has displayNames', () => {
    for (const C of [DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSubContent]) {
      expect(C.displayName).toMatch(/^DropdownMenu/)
    }
  })
})
