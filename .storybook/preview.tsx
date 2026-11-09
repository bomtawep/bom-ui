/// <reference types="vite/client" />
import type { Preview } from '@storybook/react-vite'
import { enUS, th } from 'react-day-picker/locale'
import { BomUIProvider, type BomUIMessages } from '../src/components/BomUIProvider'
import './tailwind.css'

// English strings for the Locale toolbar (the library default is Thai).
const englishMessages: BomUIMessages = {
  required: 'required',
  loading: 'Loading',
  close: 'Close',
  selectPlaceholder: 'Select',
  datePickerPlaceholder: 'Pick a date',
  dateRangePlaceholder: 'Pick a date range',
  dateInputPlaceholder: 'MM/DD/YYYY',
  openCalendar: 'Open calendar',
  time: 'Time',
  pagination: 'Pagination',
  previous: 'Previous',
  next: 'Next',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  morePages: 'More pages',
  pageOf: (page, pageCount) => `Page ${page} of ${pageCount}`,
  pageSummary: (from, to, total) => `${from}–${to} of ${total}`,
  breadcrumb: 'Breadcrumb',
  breadcrumbMore: 'More',
  toggleSidebar: 'Toggle sidebar',
  errorTitle: 'Could not load data',
  retry: 'Retry',
  pdfRegenerate: 'Regenerate',
  pdfOpenNewTab: 'Open in new tab',
  pdfFailed: 'Could not generate the PDF',
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Color theme (toggles class="dark" on <html>)',
      toolbar: { title: 'Theme', icon: 'mirror', items: ['light', 'dark'], dynamicTitle: true },
    },
    locale: {
      description: 'BomUIProvider locale',
      toolbar: { title: 'Locale', icon: 'globe', items: ['th', 'en'], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light', locale: 'th' },
  decorators: [
    (Story, context) => {
      document.documentElement.classList.toggle('dark', context.globals.theme === 'dark')
      const en = context.globals.locale === 'en'
      return (
        <BomUIProvider locale={en ? enUS : th} messages={en ? englishMessages : undefined}>
          <div className="bg-background p-6 font-sans text-foreground">
            <Story />
          </div>
        </BomUIProvider>
      )
    },
  ],
}

export default preview
