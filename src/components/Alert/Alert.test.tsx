import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { AlertCircleIcon } from '../../lib/icons'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Alert, AlertAction, AlertDescription, AlertTitle } from './Alert'

describe('Alert', () => {
  it('renders a polite status by default', () => {
    render(
      <Alert className="extra">
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Something changed</AlertDescription>
      </Alert>,
    )
    const alert = screen.getByRole('status')
    expect(alert).toHaveClass('bom-alert', 'bom-alert--default', 'extra')
    expect(screen.getByText('Heads up')).toHaveClass('bom-alert__title')
    expect(screen.getByText('Something changed')).toHaveClass('bom-alert__description')
  })

  it.each(['default', 'info', 'success', 'warning', 'danger'] as const)('applies the %s variant', (variant) => {
    const { container } = render(<Alert variant={variant}>x</Alert>)
    expect(container.firstElementChild).toHaveClass(`bom-alert--${variant}`)
  })

  it('uses role="alert" for danger and role="status" otherwise', () => {
    render(
      <>
        <Alert variant="danger">d</Alert>
        <Alert variant="info">i</Alert>
      </>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('d')
    expect(screen.getByRole('status')).toHaveTextContent('i')
  })

  it('lets role be overridden', () => {
    render(<Alert role="note">n</Alert>)
    expect(screen.getByRole('note')).toBeInTheDocument()
  })

  it('forwards refs', () => {
    const ref = createRef<HTMLDivElement>()
    const actionRef = createRef<HTMLDivElement>()
    render(
      <Alert ref={ref}>
        <AlertAction ref={actionRef}>a</AlertAction>
      </Alert>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(actionRef.current).toHaveClass('bom-alert__action')
  })

  it('has displayNames', () => {
    expect(Alert.displayName).toBe('Alert')
    expect(AlertTitle.displayName).toBe('AlertTitle')
    expect(AlertDescription.displayName).toBe('AlertDescription')
    expect(AlertAction.displayName).toBe('AlertAction')
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <Alert variant="danger">
        <AlertCircleIcon />
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
