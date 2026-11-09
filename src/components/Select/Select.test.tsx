import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './Select'

function Fruit(props: { onValueChange?: (v: string) => void; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <Select onValueChange={props.onValueChange}>
      <SelectTrigger aria-label="Fruit" size={props.size} className="extra">
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
  it('renders the trigger with placeholder and classes', () => {
    render(<Fruit />)
    const trigger = screen.getByRole('combobox', { name: 'Fruit' })
    expect(trigger).toHaveTextContent('Pick')
    expect(trigger).toHaveClass('bom-select__trigger', 'bom-select__trigger--md', 'extra')
  })

  it.each(['sm', 'md', 'lg'] as const)('applies the %s trigger size', (size) => {
    render(<Fruit size={size} />)
    expect(screen.getByRole('combobox')).toHaveClass(`bom-select__trigger--${size}`)
  })

  it('opens with the keyboard and selects an item', async () => {
    const onValueChange = vi.fn()
    render(<Fruit onValueChange={onValueChange} />)
    const trigger = screen.getByRole('combobox', { name: 'Fruit' })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    expect(await screen.findByRole('listbox')).toHaveClass('bom-select__content')
    await expectNoA11yViolations(document.body)
    await userEvent.click(screen.getByRole('option', { name: 'Banana' }))
    expect(onValueChange).toHaveBeenCalledWith('b')
    expect(trigger).toHaveTextContent('Banana')
  })

  it('forwards the trigger ref', () => {
    const ref = createRef<HTMLButtonElement>()
    render(
      <Select>
        <SelectTrigger ref={ref} aria-label="x">
          <SelectValue />
        </SelectTrigger>
      </Select>,
    )
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('has displayNames', () => {
    expect(Select.displayName).toBe('Select')
    expect(SelectTrigger.displayName).toBe('SelectTrigger')
    expect(SelectContent.displayName).toBe('SelectContent')
    expect(SelectItem.displayName).toBe('SelectItem')
  })

  it('has no a11y violations when closed', async () => {
    const { container } = render(<Fruit />)
    await expectNoA11yViolations(container)
  })
})
