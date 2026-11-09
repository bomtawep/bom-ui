import type { ReactNode, SVGProps } from 'react'

export type IconProps = SVGProps<SVGSVGElement>

function createIcon(name: string, children: ReactNode) {
  const Icon = (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
  Icon.displayName = name
  return Icon
}

// Internal icons — not exported from the package (consumers bring their own icon set).
export const CheckIcon = createIcon('CheckIcon', <path d="M20 6 9 17l-5-5" />)
export const ChevronDownIcon = createIcon('ChevronDownIcon', <path d="m6 9 6 6 6-6" />)
export const ChevronUpIcon = createIcon('ChevronUpIcon', <path d="m18 15-6-6-6 6" />)
export const ChevronLeftIcon = createIcon('ChevronLeftIcon', <path d="m15 18-6-6 6-6" />)
export const ChevronRightIcon = createIcon('ChevronRightIcon', <path d="m9 18 6-6-6-6" />)
export const XIcon = createIcon('XIcon', <path d="M18 6 6 18M6 6l12 12" />)
export const MinusIcon = createIcon('MinusIcon', <path d="M5 12h14" />)
export const CircleIcon = createIcon('CircleIcon', <circle cx="12" cy="12" r="5" fill="currentColor" stroke="none" />)
export const CalendarIcon = createIcon(
  'CalendarIcon',
  <>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </>,
)
export const MoreHorizontalIcon = createIcon(
  'MoreHorizontalIcon',
  <>
    <circle cx="5" cy="12" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
  </>,
)
export const PanelLeftIcon = createIcon(
  'PanelLeftIcon',
  <>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18" />
  </>,
)
export const AlertCircleIcon = createIcon(
  'AlertCircleIcon',
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4M12 16h.01" />
  </>,
)
export const FileWarningIcon = createIcon(
  'FileWarningIcon',
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M12 12v3M12 18h.01" />,
)
export const RefreshIcon = createIcon('RefreshIcon', <path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5" />)
export const ExternalLinkIcon = createIcon(
  'ExternalLinkIcon',
  <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />,
)
