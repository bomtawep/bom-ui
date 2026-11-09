import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card'

const parts = [
  ['CardHeader', CardHeader, 'header'],
  ['CardTitle', CardTitle, 'title'],
  ['CardDescription', CardDescription, 'description'],
  ['CardAction', CardAction, 'action'],
  ['CardContent', CardContent, 'content'],
  ['CardFooter', CardFooter, 'footer'],
] as const

describe('Card', () => {
  it('renders the card with md size by default', () => {
    const { container } = render(<Card className="extra">x</Card>)
    expect(container.firstElementChild).toHaveClass('bom-card', 'bom-card--md', 'extra')
  })

  it('applies the sm size', () => {
    const { container } = render(<Card size="sm">x</Card>)
    expect(container.firstElementChild).toHaveClass('bom-card--sm')
  })

  it.each(parts)('%s has its part class, className, ref and displayName', (name, Part, cls) => {
    const ref = createRef<HTMLDivElement>()
    render(
      <Part ref={ref} className="extra">
        {name}
      </Part>,
    )
    expect(screen.getByText(name)).toHaveClass(`bom-card__${cls}`, 'extra')
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(Part.displayName).toBe(name)
  })

  it('forwards the card ref and has a displayName', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Card ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(Card.displayName).toBe('Card')
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Invoice</CardTitle>
          <CardDescription>October</CardDescription>
          <CardAction>
            <button type="button">Edit</button>
          </CardAction>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    )
    await expectNoA11yViolations(container)
  })
})
