import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from './Select'

function Fruit(props: { onValueChange?: (v: string) => void }) {
  return (
    <Select onValueChange={props.onValueChange}>
      <SelectTrigger aria-label="Fruit" size="sm">
        <SelectValue placeholder="Pick" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="a">Apple</SelectItem>
          <SelectItem value="b">Banana</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectItem value="c" disabled>
          Cherry
        </SelectItem>
      </SelectContent>
    </Select>
  )
}

describe('Select', () => {
  it('opens with the keyboard and selects an item', async () => {
    const onValueChange = vi.fn()
    render(<Fruit onValueChange={onValueChange} />)
    const trigger = screen.getByRole('combobox', { name: 'Fruit' })
    expect(trigger).toHaveTextContent('Pick')
    expect(trigger).toHaveAttribute('data-size', 'sm')
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    expect(await screen.findByRole('listbox')).toBeInTheDocument()
    await expectNoA11yViolations(document.body)
    await userEvent.click(screen.getByRole('option', { name: 'Banana' }))
    expect(onValueChange).toHaveBeenCalledWith('b')
    expect(trigger).toHaveTextContent('Banana')
  })
})
