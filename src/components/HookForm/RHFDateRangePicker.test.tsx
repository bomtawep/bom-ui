import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { renderForm } from '../../test-utils/form'
import { RHFDateRangePicker, type DateRange } from './RHFDateRangePicker'

const schema = z.object({
  stay: z.object({ from: z.date({ error: 'เลือกวันเข้าพัก' }), to: z.date({ error: 'เลือกวันออก' }) }),
})
type Values = { stay: DateRange }

const dayButton = (day: number) =>
  screen.getAllByRole('button', { name: new RegExp(`^(วันนี้, )?\\S+ที่ ${day} ตุลาคม`) })[0]

describe('RHFDateRangePicker', () => {
  it('picks a start and an end date', async () => {
    const { form } = renderForm<Values>(
      schema as never,
      { stay: { from: new Date(2026, 9, 1), to: undefined } },
      <RHFDateRangePicker name="stay" label="ช่วงเข้าพัก" numberOfMonths={1} />,
    )
    await userEvent.click(screen.getByRole('button', { name: /^ช่วงเข้าพัก/ }))
    await userEvent.click(dayButton(10))
    await userEvent.click(dayButton(12))
    const v = form.methods!.getValues('stay')
    expect([v.from?.getDate(), v.to?.getDate()]).toEqual([1, 12])
  })

  it('shows both dates on the button and in its name', () => {
    renderForm<Values>(
      schema as never,
      { stay: { from: new Date(2026, 9, 1), to: new Date(2026, 9, 5) } },
      <RHFDateRangePicker name="stay" label="ช่วงเข้าพัก" />,
    )
    const trigger = screen.getByRole('button', { name: /^ช่วงเข้าพัก/ })
    expect(trigger.textContent).toMatch(/1.*5 ต\.ค\. 2569/)
    expect(trigger.textContent).not.toMatch(/[  ]/)
  })

  it('shows the placeholder from messages and announces required', () => {
    renderForm<Values>(
      schema as never,
      { stay: { from: undefined, to: undefined } },
      <RHFDateRangePicker name="stay" label="ช่วงเข้าพัก" required />,
    )
    const trigger = screen.getByRole('button', { name: /^ช่วงเข้าพัก\s*\(จำเป็น\)/ })
    expect(trigger).toHaveTextContent('เลือกช่วงวันที่')
  })

  it('shows the error from from/to', async () => {
    renderForm<Values>(
      schema as never,
      { stay: { from: undefined, to: undefined } },
      <RHFDateRangePicker name="stay" label="ช่วงเข้าพัก" />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'submit' }))
    const error = await screen.findByText('เลือกวันเข้าพัก')
    expect(error).toHaveClass('bom-field__error')
    expect(screen.getByRole('button', { name: /^ช่วงเข้าพัก/ })).toHaveAttribute('aria-invalid', 'true')
  })

  it('has no a11y violations', async () => {
    const { container } = renderForm<Values>(
      schema as never,
      { stay: { from: undefined, to: undefined } },
      <RHFDateRangePicker name="stay" label="ช่วงเข้าพัก" description="d" />,
    )
    await expectNoA11yViolations(container)
  })
})
