import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { ErrorState } from './ErrorState'

describe('ErrorState', () => {
  it('shows the default title and message, and retries', async () => {
    const onRetry = vi.fn()
    const { container } = render(<ErrorState message="Server not responding" onRetry={onRetry} />)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('โหลดข้อมูลไม่สำเร็จ')
    expect(alert).toHaveTextContent('Server not responding')
    expect(alert).toHaveClass('text-destructive')
    await userEvent.click(screen.getByRole('button', { name: 'ลองใหม่' }))
    expect(onRetry).toHaveBeenCalled()
    await expectNoA11yViolations(container)
  })

  it('has no retry button without onRetry and accepts a custom title', () => {
    render(<ErrorState title="Oops" />)
    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.getByRole('alert')).toHaveTextContent('Oops')
  })
})
