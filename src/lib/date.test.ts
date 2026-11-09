import { enUS } from 'react-day-picker/locale'
import { describe, expect, it } from 'vitest'
import { formatDateDisplay, formatDateInput, isValidDate, parseDateInput, sameDate } from './date'

const ymd = (d: Date | undefined) => (d ? [d.getFullYear(), d.getMonth() + 1, d.getDate()] : d)

describe('parseDateInput', () => {
  it('returns undefined for empty text', () => {
    expect(parseDateInput('  ')).toBeUndefined()
  })
  it('reads Thai dd/mm/yyyy in Buddhist era', () => {
    expect(ymd(parseDateInput('29/10/2569'))).toEqual([2026, 10, 29])
  })
  it('reads Thai dd/mm/yyyy in Christian era', () => {
    expect(ymd(parseDateInput('29-10-2026'))).toEqual([2026, 10, 29])
  })
  it('reads ISO yyyy-mm-dd', () => {
    expect(ymd(parseDateInput('2026-10-29'))).toEqual([2026, 10, 29])
  })
  it('reads en-US mm/dd/yyyy', () => {
    expect(ymd(parseDateInput('10/29/2026', enUS))).toEqual([2026, 10, 29])
  })
  it('returns Invalid Date for a day that does not exist', () => {
    const d = parseDateInput('31/02/2569')
    expect(d).toBeInstanceOf(Date)
    expect(isValidDate(d)).toBe(false)
  })
  it('returns Invalid Date for garbage', () => {
    expect(isValidDate(parseDateInput('abc'))).toBe(false)
  })
})

describe('format helpers', () => {
  it('formats Thai display and input with Buddhist year', () => {
    const d = new Date(2026, 9, 29)
    expect(formatDateDisplay(d)).toContain('2569')
    expect(formatDateInput(d)).toBe('29/10/2569')
  })
})

describe('sameDate', () => {
  it('treats empty values and invalid dates as equal', () => {
    expect(sameDate(null, undefined)).toBe(true)
    expect(sameDate(new Date(NaN), new Date(NaN))).toBe(true)
    expect(sameDate(new Date(2026, 0, 1), null)).toBe(false)
  })
})
