import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card'

function Demo() {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Invoice</CardTitle>
        <CardDescription>October</CardDescription>
        <CardAction>
          <button type="button">Edit</button>
        </CardAction>
      </CardHeader>
      <CardContent>Body</CardContent>
      <CardFooter>Footer</CardFooter>
    </Card>
  )
}

describe('Card', () => {
  it('renders every part with its data-slot', () => {
    const { container } = render(<Demo />)
    for (const slot of ['card', 'card-header', 'card-title', 'card-description', 'card-action', 'card-content', 'card-footer']) {
      expect(container.querySelector(`[data-slot="${slot}"]`)).toBeInTheDocument()
    }
    expect(container.querySelector('[data-slot="card"]')).toHaveAttribute('data-size', 'sm')
    expect(screen.getByText('Invoice')).toHaveAttribute('data-slot', 'card-title')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Demo />)
    await expectNoA11yViolations(container)
  })
})
