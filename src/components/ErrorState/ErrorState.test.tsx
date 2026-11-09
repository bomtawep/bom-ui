import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { ErrorState } from './ErrorState'

describe('ErrorState', () => {
  it('shows the default title and the message as an alert', () => {
    render(<ErrorState message="Server not responding" className="extra" />)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('โหลดข้อมูลไม่สำเร็จ')
    expect(alert).toHaveTextContent('Server not responding')
    expect(alert).toHaveClass('bom-alert', 'bom-alert--danger', 'bom-error-state', 'extra')
  })

  it('calls onRetry from the retry button', async () => {
    const onRetry = vi.fn()
    render(<ErrorState onRetry={onRetry} />)
    await userEvent.click(screen.getByRole('button', { name: 'ลองใหม่' }))
    expect(onRetry).toHaveBeenCalled()
  })

  it('has no retry button without onRetry and accepts a custom title', () => {
    render(<ErrorState title="Oops" />)
    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.getByRole('alert')).toHaveTextContent('Oops')
  })

  it('forwards the ref and has a displayName', () => {
    const ref = createRef<HTMLDivElement>()
    render(<ErrorState ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ErrorState.displayName).toBe('ErrorState')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<ErrorState message="m" onRetry={() => {}} />)
    await expectNoA11yViolations(container)
  })
})
