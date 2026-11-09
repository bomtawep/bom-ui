import type { DayPickerProps } from 'react-day-picker'
import { th, type DayPickerLocale } from 'react-day-picker/locale'

// Default locale for Calendar / RHFDatePicker / RHFDateRangePicker: Thai with Buddhist-era years.
// Intl "th" already uses the Buddhist calendar, so both the screen text and screen readers get B.E. years.
// The date-fns locale is only used for weekday names and the first day of the week
// (date-fns formats years in C.E., so we never use it to format years).
export const defaultDateLocale: DayPickerLocale = th

export function isValidDate(d: unknown): d is Date {
  return d instanceof Date && !Number.isNaN(d.getTime())
}

// Compares dates (empty == empty, Invalid Date == Invalid Date) to tell whether a value changed from outside.
export function sameDate(a?: Date | null, b?: Date | null) {
  if (!a || !b) return !a && !b
  const ta = a.getTime()
  const tb = b.getTime()
  return ta === tb || (Number.isNaN(ta) && Number.isNaN(tb))
}

// Button text, e.g. "29 ต.ค. 2569"; en-US: "Oct 29, 2026"
export function formatDateDisplay(date: Date, locale: DayPickerLocale = defaultDateLocale) {
  return new Intl.DateTimeFormat(locale.code, { dateStyle: 'medium' }).format(date)
}

// Text box value, e.g. "29/10/2569"; en-US: "10/29/2026"
export function formatDateInput(date: Date, locale: DayPickerLocale = defaultDateLocale) {
  return new Intl.DateTimeFormat(locale.code, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

// Parses typed text. Day/month/year order follows the locale (th: dd/mm/yyyy); separators / - . or space.
// Years above 2400 are treated as B.E. (minus 543). Also accepts ISO yyyy-mm-dd.
// Returns undefined = empty, Invalid Date = wrong format or a day that does not exist (e.g. 31/02),
// so the form schema can report the error.
export function parseDateInput(text: string, locale: DayPickerLocale = defaultDateLocale): Date | undefined {
  const t = text.trim()
  if (!t) return undefined
  const nums = t.split(/[\s/.-]+/).map(Number)
  if (nums.length !== 3 || nums.some((n) => !Number.isInteger(n))) return new Date(NaN)

  let order: ('day' | 'month' | 'year')[]
  if (/^\d{4}-/.test(t)) {
    order = ['year', 'month', 'day']
  } else {
    order = new Intl.DateTimeFormat(locale.code, { day: 'numeric', month: 'numeric', year: 'numeric' })
      .formatToParts(new Date(2000, 0, 1))
      .map((p) => p.type)
      .filter((type): type is 'day' | 'month' | 'year' => type === 'day' || type === 'month' || type === 'year')
  }
  const parts = Object.fromEntries(order.map((k, i) => [k, nums[i]])) as Record<'day' | 'month' | 'year', number>
  // Guess B.E./C.E. from the number (two-digit years are not supported)
  const year = parts.year > 2400 ? parts.year - 543 : parts.year
  if (year < 1000) return new Date(NaN)
  const date = new Date(year, parts.month - 1, parts.day)
  // new Date rolls overflowing days forward (31/02 → 03/03), so check it matches what was typed
  if (date.getMonth() !== parts.month - 1 || date.getDate() !== parts.day) return new Date(NaN)
  return date
}

// Calendar props so the caption, year dropdown and each day's aria-label use the locale's Intl year (th = B.E.)
export function calendarLocaleProps(
  locale: DayPickerLocale = defaultDateLocale,
): Pick<DayPickerProps, 'locale' | 'formatters' | 'labels'> {
  const caption = new Intl.DateTimeFormat(locale.code, { month: 'long', year: 'numeric' })
  const year = new Intl.DateTimeFormat(locale.code, { year: 'numeric' })
  const full = new Intl.DateTimeFormat(locale.code, { dateStyle: 'full' })
  const thai = locale.code?.startsWith('th')
  return {
    locale,
    formatters: {
      formatCaption: (month) => caption.format(month),
      // Only the year digits ("พ.ศ. 2569" → "2569") so the dropdown stays short
      formatYearDropdown: (d) => year.formatToParts(d).find((p) => p.type === 'year')?.value ?? String(d.getFullYear()),
    },
    labels: {
      labelGrid: (month) => caption.format(month),
      labelDayButton: (date, modifiers) => {
        let label = full.format(date)
        if (modifiers.today) label = `${thai ? 'วันนี้' : 'Today'}, ${label}`
        if (modifiers.selected) label = `${label}, ${thai ? 'เลือกแล้ว' : 'selected'}`
        return label
      },
    },
  }
}
