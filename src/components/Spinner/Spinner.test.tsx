import { render, screen } from '@testing-library/react'
import { enUS } from 'react-day-picker/locale'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { BomUIProvider } from '../BomUIProvider'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('is a status named from messages', () => {
    render(<Spinner className="size-8" />)
    const el = screen.getByRole('status', { name: 'กำลังโหลด' })
    expect(el).toHaveAttribute('data-slot', 'spinner')
    expect(el).toHaveClass('size-8', 'animate-spin')
  })

  it('takes its label from the provider or a prop', () => {
    render(
      <BomUIProvider locale={enUS} messages={{ loading: 'Loading' }}>
        <Spinner />
        <Spinner aria-label="Saving" />
      </BomUIProvider>,
    )
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Saving' })).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Spinner />)
    await expectNoA11yViolations(container)
  })
})
