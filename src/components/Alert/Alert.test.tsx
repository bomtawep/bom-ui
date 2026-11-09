import { render, screen } from '@testing-library/react'
import { CircleAlertIcon } from 'lucide-react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Alert, AlertAction, AlertDescription, AlertTitle } from './Alert'

describe('Alert', () => {
  it.each(['default', 'destructive'] as const)('renders the %s variant as an alert', (variant) => {
    render(
      <Alert variant={variant}>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Something changed</AlertDescription>
      </Alert>,
    )
    expect(screen.getByRole('alert')).toHaveAttribute('data-slot', 'alert')
    expect(screen.getByText('Heads up')).toHaveAttribute('data-slot', 'alert-title')
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <Alert variant="destructive">
        <CircleAlertIcon />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Try again</AlertDescription>
        <AlertAction>
          <button type="button">Retry</button>
        </AlertAction>
      </Alert>,
    )
    await expectNoA11yViolations(container)
  })
})
