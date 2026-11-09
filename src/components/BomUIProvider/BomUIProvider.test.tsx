import { render, screen } from '@testing-library/react'
import { enUS } from 'react-day-picker/locale'
import { describe, expect, it } from 'vitest'
import { BomUIProvider, useBomUI } from './BomUIProvider'
import { defaultMessages } from './messages'

function Probe() {
  const { locale, messages } = useBomUI()
  return (
    <p>
      {locale.code}|{messages.retry}|{messages.close}|{messages.pageOf(2, 5)}
    </p>
  )
}

describe('BomUIProvider', () => {
  it('falls back to Thai defaults without a provider', () => {
    render(<Probe />)
    expect(
      screen.getByText(`th|${defaultMessages.retry}|${defaultMessages.close}|${defaultMessages.pageOf(2, 5)}`),
    ).toBeInTheDocument()
  })

  it('overrides locale and only the given messages', () => {
    render(
      <BomUIProvider locale={enUS} messages={{ retry: 'Retry', pageOf: (p, t) => `Page ${p} of ${t}` }}>
        <Probe />
      </BomUIProvider>,
    )
    expect(screen.getByText(`en-US|Retry|${defaultMessages.close}|Page 2 of 5`)).toBeInTheDocument()
  })
})
