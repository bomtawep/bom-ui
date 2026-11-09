'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { DayPickerLocale } from 'react-day-picker/locale'
import { defaultDateLocale } from '../../lib/date'
import { defaultMessages, type BomUIMessages } from './messages'

interface BomUIContextValue {
  locale: DayPickerLocale
  messages: BomUIMessages
}

const BomUIContext = createContext<BomUIContextValue>({ locale: defaultDateLocale, messages: defaultMessages })

export interface BomUIProviderProps {
  /** Date locale from `react-day-picker/locale`. Default: `th` (Buddhist-era years). */
  locale?: DayPickerLocale
  /** Override any UI string. Missing keys fall back to the Thai defaults. */
  messages?: Partial<BomUIMessages>
  children: ReactNode
}

export function BomUIProvider({ locale = defaultDateLocale, messages, children }: BomUIProviderProps) {
  const value = useMemo(() => ({ locale, messages: { ...defaultMessages, ...messages } }), [locale, messages])
  return <BomUIContext.Provider value={value}>{children}</BomUIContext.Provider>
}

/** Internal: locale + messages for components. Works without a provider (Thai defaults). */
export function useBomUI(): BomUIContextValue {
  return useContext(BomUIContext)
}
