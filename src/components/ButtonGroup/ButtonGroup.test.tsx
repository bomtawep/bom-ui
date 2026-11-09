import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Button } from '../Button'
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from './ButtonGroup'

describe('ButtonGroup', () => {
  it('is a group with orientation', () => {
    render(
      <ButtonGroup aria-label="Actions" orientation="vertical">
        <Button>A</Button>
      </ButtonGroup>,
    )
    const group = screen.getByRole('group', { name: 'Actions' })
    expect(group).toHaveAttribute('data-slot', 'button-group')
    expect(group).toHaveAttribute('data-orientation', 'vertical')
  })

  it('renders text and a separator', () => {
    const { container } = render(
      <ButtonGroup aria-label="x">
        <ButtonGroupText>https://</ButtonGroupText>
        <ButtonGroupSeparator />
      </ButtonGroup>,
    )
    expect(screen.getByText('https://')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="button-group-separator"]')).toHaveAttribute('data-orientation', 'vertical')
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <ButtonGroup aria-label="Actions">
        <Button variant="outline">A</Button>
        <Button variant="outline">B</Button>
      </ButtonGroup>,
    )
    await expectNoA11yViolations(container)
  })
})
