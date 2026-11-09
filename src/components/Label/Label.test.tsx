import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Label } from './Label'

describe('Label', () => {
  it('renders a label with the base class and custom className', () => {
    render(<Label className="extra">Name</Label>)
    expect(screen.getByText('Name')).toHaveClass('bom-label', 'extra')
  })

  it('labels its control through htmlFor', () => {
    render(
      <>
        <Label htmlFor="n">Name</Label>
        <input id="n" />
      </>,
    )
    expect(screen.getByLabelText('Name')).toBeInstanceOf(HTMLInputElement)
  })

  it('forwards the ref', () => {
    const ref = createRef<HTMLLabelElement>()
    render(<Label ref={ref}>Name</Label>)
    expect(ref.current).toBeInstanceOf(HTMLLabelElement)
  })

  it('has a displayName', () => {
    expect(Label.displayName).toBe('Label')
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <>
        <Label htmlFor="n">Name</Label>
        <input id="n" />
      </>,
    )
    await expectNoA11yViolations(container)
  })
})
