import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Button } from '../Button'
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from './ButtonGroup'

describe('ButtonGroup', () => {
  it('is a horizontal group by default', () => {
    render(
      <ButtonGroup aria-label="Actions" className="extra">
        <Button>A</Button>
        <Button>B</Button>
      </ButtonGroup>,
    )
    expect(screen.getByRole('group', { name: 'Actions' })).toHaveClass(
      'bom-button-group',
      'bom-button-group--horizontal',
      'extra',
    )
  })

  it('supports vertical orientation', () => {
    render(<ButtonGroup orientation="vertical" aria-label="x" />)
    expect(screen.getByRole('group')).toHaveClass('bom-button-group--vertical')
  })

  it('renders text and separator parts', () => {
    const { container } = render(
      <ButtonGroup aria-label="x">
        <ButtonGroupText>https://</ButtonGroupText>
        <ButtonGroupSeparator />
      </ButtonGroup>,
    )
    expect(screen.getByText('https://')).toHaveClass('bom-button-group__text')
    expect(container.querySelector('.bom-button-group__separator')).toHaveAttribute('data-orientation', 'vertical')
  })

  it('renders ButtonGroupText asChild', () => {
    render(
      <ButtonGroupText asChild>
        <label htmlFor="u">URL</label>
      </ButtonGroupText>,
    )
    expect(screen.getByText('URL').tagName).toBe('LABEL')
  })

  it('forwards refs', () => {
    const ref = createRef<HTMLDivElement>()
    const textRef = createRef<HTMLDivElement>()
    render(
      <ButtonGroup ref={ref}>
        <ButtonGroupText ref={textRef}>t</ButtonGroupText>
      </ButtonGroup>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(textRef.current).toBeInstanceOf(HTMLDivElement)
  })

  it('has displayNames', () => {
    expect(ButtonGroup.displayName).toBe('ButtonGroup')
    expect(ButtonGroupText.displayName).toBe('ButtonGroupText')
    expect(ButtonGroupSeparator.displayName).toBe('ButtonGroupSeparator')
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <ButtonGroup aria-label="Actions">
        <Button variant="secondary">A</Button>
        <ButtonGroupSeparator />
        <Button variant="secondary">B</Button>
      </ButtonGroup>,
    )
    await expectNoA11yViolations(container)
  })
})
