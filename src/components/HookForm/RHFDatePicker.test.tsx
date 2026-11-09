import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { enUS } from 'react-day-picker/locale'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { renderForm } from '../../test-utils/form'
import { BomUIProvider } from '../BomUIProvider'
import { RHFDatePicker } from './RHFDatePicker'

const schema = z.object({
  d: z
    .date({ error: 'เลือกวันที่' })
    .nullable()
    .refine((v) => v !== null && !Number.isNaN(v.getTime()), 'เลือกวันที่'),
})
type Values = { d: Date | null }

const dayButton = (day: number) => screen.getByRole('button', { name: new RegExp(`^(วันนี้, )?\\S+ที่ ${day} ตุลาคม`) })

describe('RHFDatePicker', () => {
  it('button variant: opens the calendar, picks a day, closes and shows the Thai date', async () => {
    const { form } = renderForm<Values>(schema as never, { d: new Date(2026, 9, 1) }, <RHFDatePicker name="d" label="วันที่" />)
    const trigger = screen.getByRole('button', { name: /^วันที่/ })
    expect(trigger).toHaveTextContent('2569')
    await userEvent.click(trigger)
    expect(screen.getByRole('dialog', { name: 'วันที่' })).toBeInTheDocument()
    await userEvent.click(dayButton(29))
    expect((form.methods!.getValues('d') as Date).getDate()).toBe(29)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveTextContent('29 ต.ค. 2569')
  })

  it('button variant: names the button with the label and the value', () => {
    renderForm<Values>(schema as never, { d: new Date(2026, 9, 29) }, <RHFDatePicker name="d" label="วันที่" required />)
    // the visible * is aria-hidden; screen readers get the sr-only "(จำเป็น)" then the value
    expect(screen.getByRole('button', { name: /^วันที่\s*\(จำเป็น\)\s*29 ต\.ค\. 2569$/ })).toBeInTheDocument()
  })

  it('shows the placeholder from messages when empty', () => {
    renderForm<Values>(schema as never, { d: null }, <RHFDatePicker name="d" label="วันที่" />)
    expect(screen.getByRole('button', { name: /^วันที่/ })).toHaveTextContent('เลือกวันที่')
    expect(screen.getByRole('button', { name: /^วันที่/ })).toHaveAttribute('data-empty', 'true')
  })

  it('input variant: parses a typed Buddhist-era date', async () => {
    const { form } = renderForm<Values>(schema as never, { d: null }, <RHFDatePicker name="d" label="วันที่" variant="input" />)
    const box = screen.getByRole('textbox', { name: 'วันที่' })
    expect(box).toHaveAttribute('placeholder', 'วว/ดด/ปปปป')
    await userEvent.type(box, '29/10/2569')
    const v = form.methods!.getValues('d') as Date
    expect([v.getFullYear(), v.getMonth(), v.getDate()]).toEqual([2026, 9, 29])
  })

  it('input variant: ArrowDown opens the calendar and closing returns focus to the text box', async () => {
    renderForm<Values>(schema as never, { d: null }, <RHFDatePicker name="d" label="วันที่" variant="input" />)
    const box = screen.getByRole('textbox', { name: 'วันที่' })
    box.focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(box).toHaveFocus())
  })

  it('input variant: the calendar button opens the calendar', async () => {
    renderForm<Values>(schema as never, { d: null }, <RHFDatePicker name="d" label="วันที่" variant="input" />)
    await userEvent.click(screen.getByRole('button', { name: 'เปิดปฏิทิน' }))
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })

  it('input variant: an impossible date stays Invalid Date for the schema to reject', async () => {
    const { form } = renderForm<Values>(schema as never, { d: null }, <RHFDatePicker name="d" label="วันที่" variant="input" />)
    await userEvent.type(screen.getByRole('textbox', { name: 'วันที่' }), '31/02/2569')
    expect(Number.isNaN((form.methods!.getValues('d') as Date).getTime())).toBe(true)
    await userEvent.click(screen.getByRole('button', { name: 'submit' }))
    expect(await screen.findByText('เลือกวันที่', { selector: '[data-slot="field-error"]' })).toBeInTheDocument()
  })

  it('input variant: re-formats the text on blur', async () => {
    renderForm<Values>(schema as never, { d: null }, <RHFDatePicker name="d" label="วันที่" variant="input" />)
    const box = screen.getByRole('textbox', { name: 'วันที่' })
    await userEvent.type(box, '2026-10-29')
    await userEvent.tab()
    expect(box).toHaveValue('29/10/2569')
  })

  it('showTime keeps the chosen time on the date', async () => {
    const { form } = renderForm<Values>(
      schema as never,
      { d: new Date(2026, 9, 1, 9, 30) },
      <RHFDatePicker name="d" label="วันที่" showTime />,
    )
    const time = screen.getByLabelText('เวลา')
    expect(time).toHaveValue('09:30')
    // jsdom cannot type into type="time" key by key; set the value like a browser picker does
    fireEvent.change(time, { target: { value: '14:45' } })
    const v = form.methods!.getValues('d') as Date
    expect([v.getDate(), v.getHours(), v.getMinutes()]).toEqual([1, 14, 45])
  })

  it('reset clears the text box', async () => {
    const { form } = renderForm<Values>(schema as never, { d: null }, <RHFDatePicker name="d" label="วันที่" variant="input" />)
    const box = screen.getByRole('textbox', { name: 'วันที่' })
    await userEvent.type(box, '29/10/2569')
    act(() => form.methods!.reset({ d: null }))
    expect(box).toHaveValue('')
  })

  it('shows the schema error linked to the control', async () => {
    renderForm<Values>(schema as never, { d: null }, <RHFDatePicker name="d" label="วันที่" description="วันเริ่มงาน" />)
    await userEvent.click(screen.getByRole('button', { name: 'submit' }))
    await screen.findByText('เลือกวันที่', { selector: '[data-slot="field-error"]' })
    const trigger = screen.getByRole('button', { name: /^วันที่/ })
    expect(trigger).toHaveAttribute('aria-invalid', 'true')
    expect(trigger).toHaveAccessibleDescription('วันเริ่มงาน เลือกวันที่')
  })

  it('follows the provider locale', () => {
    renderForm<Values>(
      schema as never,
      { d: new Date(2026, 9, 29) },
      <BomUIProvider locale={enUS}>
        <RHFDatePicker name="d" label="Date" />
      </BomUIProvider>,
    )
    expect(screen.getByRole('button', { name: /^Date/ })).toHaveTextContent('Oct 29, 2026')
  })

  it('has no a11y violations closed and open', async () => {
    const { container } = renderForm<Values>(schema as never, { d: new Date(2026, 9, 1) }, <RHFDatePicker name="d" label="วันที่" />)
    await expectNoA11yViolations(container)
    await userEvent.click(screen.getByRole('button', { name: /^วันที่/ }))
    await expectNoA11yViolations(document.body)
  })
})
