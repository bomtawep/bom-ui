import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { enUS } from 'react-day-picker/locale'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { BomUIProvider } from '../BomUIProvider'
import { Calendar } from './Calendar'

const oct2026 = new Date(2026, 9, 1)

describe('Calendar', () => {
  it('shows a Buddhist-era caption by default', () => {
    render(<Calendar month={oct2026} />)
    expect(screen.getByRole('grid', { name: /2569/ })).toBeInTheDocument()
  })

  it('follows the provider locale, and the locale prop wins', () => {
    render(
      <BomUIProvider locale={enUS}>
        <Calendar month={oct2026} />
      </BomUIProvider>,
    )
    expect(screen.getByRole('grid', { name: /October 2026/ })).toBeInTheDocument()
  })

  it('selects a day', async () => {
    const onSelect = vi.fn()
    render(<Calendar mode="single" month={oct2026} onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('button', { name: /29 ตุลาคม/ }))
    expect((onSelect.mock.calls[0][0] as Date).getDate()).toBe(29)
  })

  it('moves focus with arrow keys', async () => {
    render(<Calendar mode="single" month={oct2026} selected={new Date(2026, 9, 15)} autoFocus />)
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).toHaveAccessibleName(/16 ตุลาคม/)
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Calendar mode="single" month={oct2026} />)
    await expectNoA11yViolations(container)
  })
})
