import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Kbd, KbdGroup } from './Kbd'

describe('Kbd', () => {
  it('renders kbd elements', () => {
    render(
      <KbdGroup className="g">
        <Kbd className="extra">⌘</Kbd>
        <Kbd>B</Kbd>
      </KbdGroup>,
    )
    expect(screen.getByText('⌘').tagName).toBe('KBD')
    expect(screen.getByText('⌘')).toHaveClass('bom-kbd', 'extra')
    expect(screen.getByText('⌘').parentElement).toHaveClass('bom-kbd-group', 'g')
  })

  it('forwards refs', () => {
    const ref = createRef<HTMLElement>()
    const groupRef = createRef<HTMLElement>()
    render(
      <KbdGroup ref={groupRef}>
        <Kbd ref={ref}>K</Kbd>
      </KbdGroup>,
    )
    expect(ref.current?.tagName).toBe('KBD')
    expect(groupRef.current?.tagName).toBe('KBD')
  })

  it('has displayNames', () => {
    expect(Kbd.displayName).toBe('Kbd')
    expect(KbdGroup.displayName).toBe('KbdGroup')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Kbd>Esc</Kbd>)
    await expectNoA11yViolations(container)
  })
})
