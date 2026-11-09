import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from './Popover'

describe('Popover', () => {
  it('opens on click and closes with Escape, returning focus', async () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent aria-label="Dimensions">
          <PopoverHeader>
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>Set the size</PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>,
    )
    const trigger = screen.getByRole('button', { name: 'Open' })
    await userEvent.click(trigger)
    expect(screen.getByRole('dialog', { name: 'Dimensions' })).toHaveAttribute('data-slot', 'popover-content')
    await expectNoA11yViolations(document.body)
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })
})
