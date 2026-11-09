import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Label } from './Label'

describe('Label', () => {
  it('labels its control through htmlFor', () => {
    const { container } = render(
      <>
        <Label htmlFor="n">Name</Label>
        <input id="n" />
      </>,
    )
    expect(screen.getByLabelText('Name')).toBeInstanceOf(HTMLInputElement)
    expect(screen.getByText('Name')).toHaveAttribute('data-slot', 'label')
    return expectNoA11yViolations(container)
  })
})
