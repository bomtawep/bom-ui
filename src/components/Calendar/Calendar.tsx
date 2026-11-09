'use client'

import { DayFlag, DayPicker, SelectionState, UI, type ChevronProps, type ClassNames, type DayPickerProps } from 'react-day-picker'
import type { DayPickerLocale } from 'react-day-picker/locale'
import { cn } from '../../lib/cn'
import { calendarLocaleProps } from '../../lib/date'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from '../../lib/icons'
import { useBomUI } from '../BomUIProvider/BomUIProvider'

export type CalendarProps = DayPickerProps

const kebab = (s: string) => s.replace(/_/g, '-')

// Every DayPicker part and day state gets a bom-calendar__* class so the CSS needs no rdp-* selectors.
const bomClassNames: Partial<ClassNames> = {
  ...Object.fromEntries(Object.values(UI).map((key) => [key, `bom-calendar__${kebab(key)}`])),
  ...Object.fromEntries(Object.values(DayFlag).map((key) => [key, `bom-calendar__day--${kebab(key)}`])),
  ...Object.fromEntries(Object.values(SelectionState).map((key) => [key, `bom-calendar__day--${kebab(key)}`])),
  [UI.Root]: 'bom-calendar',
}

function CalendarChevron({ orientation, className, size: _size, disabled: _disabled, ...props }: ChevronProps) {
  const Icon =
    orientation === 'left'
      ? ChevronLeftIcon
      : orientation === 'right'
        ? ChevronRightIcon
        : orientation === 'up'
          ? ChevronUpIcon
          : ChevronDownIcon
  return <Icon className={cn('bom-calendar__chevron', className)} {...props} />
}

/**
 * Date grid (react-day-picker). Uses the BomUIProvider locale by default — Thai with Buddhist-era
 * years in the caption, the year dropdown and each day's accessible name.
 * Not a forwardRef component: DayPicker does not accept a ref.
 */
export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  locale: localeProp,
  formatters,
  labels,
  components,
  ...props
}: CalendarProps) {
  const { locale: providerLocale } = useBomUI()
  // DayPicker types its locale prop as Partial; the react-day-picker/locale exports are complete
  const locale = (localeProp as DayPickerLocale | undefined) ?? providerLocale
  const localeProps = calendarLocaleProps(locale)
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={locale}
      className={className}
      classNames={{ ...bomClassNames, ...classNames }}
      formatters={{
        formatMonthDropdown: (d) => d.toLocaleString(locale.code, { month: 'short' }),
        ...localeProps.formatters,
        ...formatters,
      }}
      labels={{ ...localeProps.labels, ...labels }}
      components={{ Chevron: CalendarChevron, ...components }}
      {...(props as DayPickerProps)}
    />
  )
}

Calendar.displayName = 'Calendar'
