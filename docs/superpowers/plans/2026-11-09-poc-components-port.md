# Port poc-dof-pps Components — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **ห้าม commit / push / tag / release — ทิ้งการเปลี่ยนแปลงไว้ใน working tree** (rule [07](../../../.claude/rules/07-git-no-auto-commit.md) override ขั้น Commit ของ skill ทุกตัว) ใช้ `git diff` / `git status` สำหรับ review แทน BASE/HEAD

**Goal:** นำ `ui/` + `hook-form/` + app-level components จาก poc-dof-pps มาเป็น base components ของ `@bomtawep/ui` 0.2.0 ด้วย plain CSS `--bom-*`

**Architecture:** แต่ละ component เขียนใหม่ด้วย `forwardRef` + class `bom-*` บน Radix (`radix-ui`) โดยใช้ไฟล์ใน poc เป็น reference ของ API, composition และ a11y — ห้าม copy class Tailwind; RHF wrappers อยู่ใน `src/components/HookForm/` สร้างบน control ของ library เอง; ข้อความ/locale มาจาก `BomUIProvider`

**Tech Stack:** React 18/19, Radix UI 1.8.1, react-day-picker 10.0.2, input-otp 1.5.0, sonner 2.0.8, react-hook-form 7.91.0, tsup 8, Vitest 5 + Testing Library + axe-core, Storybook 10, Yarn 4.18.1

**Spec:** [2026-11-09-poc-components-port-design.md](../specs/2026-11-09-poc-components-port-design.md)

**Source (reference, read-only):** `/Users/taweewatphimhin/Documents/bom/poc-dof-pps/frontend/src/components/` — เรียกสั้น ๆ ว่า `POC/` ด้านล่าง

## Global Constraints

- Package manager: Yarn 4 เท่านั้น (`yarn add -E` pin exact); ห้าม npm/pnpm lockfile
- `react`, `react-dom`, `react-hook-form` = peerDependencies (`>=18`, `>=18`, `^7.55.0`) + devDependencies; ห้ามอยู่ใน `dependencies`
- `dependencies` exact: `radix-ui@1.8.1`, `react-day-picker@10.0.2`, `input-otp@1.5.0`, `sonner@2.0.8`
- devDependencies exact เพิ่ม: `react-hook-form@7.91.0`, `zod@4.6.7`, `@hookform/resolvers@5.9.2`
- ห้าม import `next/*`, `lucide-react`, `class-variance-authority`, `tailwind-merge`, `cn` (npm) — ใช้ `src/lib/cn.ts` และ `src/lib/icons.tsx`
- ทุก component (ยกเว้น RHF* และ `BomUIProvider`) ใช้ `forwardRef`, ตั้ง `displayName`, รับ `className` (ต่อท้าย) + `...props`
- ห้าม `export default` ยกเว้นไฟล์ `*.stories.tsx`
- CSS: `src/components/<Name>/<Name>.css` เท่านั้น (ชื่อไฟล์ต้องตรงชื่อโฟลเดอร์ — `bundleCss` throw ถ้าไม่ตรง), ใช้แต่ `var(--bom-*)` ห้ามสี hex/rgb/hsl (`sh scripts/check-css.sh`)
- Class: `bom-<name>`, `bom-<name>--<modifier>`, `bom-<name>__<part>` (kebab-case ของชื่อ component เช่น `ButtonGroup` → `bom-button-group`)
- State ผ่าน attribute: `[data-state]`, `[data-disabled]`, `[aria-invalid='true']`, `[data-invalid]`, `[data-orientation]`
- Variant ปุ่ม: `primary | secondary | ghost | danger` (+ `sparkle` ของ Button), size: `sm | md | lg` ค่าเริ่มต้น `md`
- ห้ามอ้าง `window` / `document` ระหว่าง render — ใน effect / handler เท่านั้น
- ทุก public export ผ่าน `src/index.ts` พร้อม props type
- ข้อความภาษาไทย default มาจาก `defaultMessages` ใน `BomUIProvider` — ห้าม hardcode ข้อความ UI ใน component
- ตรวจหลังทุก task: `yarn typecheck && yarn test && sh scripts/check-css.sh`

---

## Component Recipe (อ่านก่อนทุก task)

ทุก component ทำตามรูปแบบนี้ ตัวอย่างคือ `Label` (Task 3 สร้างจริง)

**`src/components/Label/Label.tsx`**
```tsx
'use client'

import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react'
import { Label as LabelPrimitive } from 'radix-ui'
import { cn } from '../../lib/cn'

export type LabelProps = ComponentPropsWithoutRef<typeof LabelPrimitive.Root>

export const Label = forwardRef<ComponentRef<typeof LabelPrimitive.Root>, LabelProps>(function Label(
  { className, ...props },
  ref,
) {
  return <LabelPrimitive.Root ref={ref} className={cn('bom-label', className)} {...props} />
})

Label.displayName = 'Label'
```

**`src/components/Label/Label.css`**
```css
.bom-label {
  display: inline-flex;
  align-items: center;
  gap: var(--bom-space-1);
  font-size: var(--bom-font-size-sm);
  font-weight: var(--bom-font-weight-medium);
  line-height: 1.25;
  color: var(--bom-color-fg);
  user-select: none;
}

.bom-label:has(+ :disabled),
[data-disabled] > .bom-label {
  opacity: 0.6;
  cursor: not-allowed;
}
```

**`src/components/Label/Label.test.tsx`**
```tsx
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Label } from './Label'

describe('Label', () => {
  it('renders a label with the base class and custom className', () => {
    render(<Label className="extra">Name</Label>)
    expect(screen.getByText('Name')).toHaveClass('bom-label', 'extra')
  })

  it('labels its control through htmlFor', () => {
    render(
      <>
        <Label htmlFor="n">Name</Label>
        <input id="n" />
      </>,
    )
    expect(screen.getByLabelText('Name')).toBeInstanceOf(HTMLInputElement)
  })

  it('forwards the ref', () => {
    const ref = createRef<HTMLLabelElement>()
    render(<Label ref={ref}>Name</Label>)
    expect(ref.current).toBeInstanceOf(HTMLLabelElement)
  })

  it('has a displayName', () => {
    expect(Label.displayName).toBe('Label')
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <>
        <Label htmlFor="n">Name</Label>
        <input id="n" />
      </>,
    )
    await expectNoA11yViolations(container)
  })
})
```

**`src/components/Label/Label.stories.tsx`**
```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from './Label'

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Form/Label',
  component: Label,
  args: { children: 'Email' },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
```

**`src/components/Label/index.ts`**
```ts
export { Label } from './Label'
export type { LabelProps } from './Label'
```

**`src/index.ts`** — เพิ่ม `export * from './components/Label'` (เรียงตามตัวอักษร)

### กฎการแปลงจาก POC

| ใน POC | ใน bom-ui |
|---|---|
| `function X({ className, ...props }: React.ComponentProps<...>)` | `forwardRef` + `ComponentPropsWithoutRef` + `ComponentRef` |
| `data-slot="x"` | ลบออก ใช้ class `bom-<name>__<part>` |
| `cva(...)` variants | prop → class `bom-<name>--<value>` |
| Tailwind `className="..."` | ย้ายเป็น rule ใน `<Name>.css` ด้วย `var(--bom-*)` |
| `import { X } from "lucide-react"` | `import { XIcon } from '../../lib/icons'` |
| `import { cn } from "cn"` / `@/lib/utils` | `import { cn } from '../../lib/cn'` (รับแค่ string/false/null/undefined) |
| `import ... from "@/components/ui/button"` | `import { Button } from '../Button'` (relative ไปโฟลเดอร์ component) |
| `variant="outline"` / `"default"` / `"destructive"` | `secondary` / `primary` / `danger` |
| `size="default"` / `"icon-sm"` / `"icon-xs"` | `md` / `<IconButton size="sm">` / `<IconButton size="sm">` |
| ข้อความไทย hardcode | `const { messages } = useBomUI()` แล้ว `messages.<key>` |
| `text-destructive` / `sr-only` | `bom-field__required` / `bom-sr-only` |

### Test ขั้นต่ำต่อ component (Definition of Done)

1. render + class หลัก + `className` ต่อท้าย
2. class ของทุก variant / size (`it.each`)
3. `ref` ถูก forward ไปที่ element ที่ถูกต้อง
4. `displayName`
5. `expectNoA11yViolations` (สำหรับ overlay ให้เปิดก่อนแล้วตรวจ `document.body`)
6. ตัว interactive: keyboard test ตามที่ระบุในแต่ละ task

Story: `Playground` + story ที่แสดงทุก variant/size/state; title `Primitives/…`, `Form/…`, `Overlay/…`, `Navigation/…`, `Data/…`, `App/…`, `HookForm/…`

---

### Task 1: Foundation — deps, tokens, lib helpers, BomUIProvider

**Files:**
- Modify: `package.json` (peer + deps), `tsup.config.ts:external`, `src/styles/tokens.css`, `src/test-utils/setup.ts`, `.storybook/preview.tsx`, `src/index.ts`
- Create: `src/lib/icons.tsx`, `src/lib/date.ts`, `src/lib/date.test.ts`, `src/lib/use-transient-state.ts`, `src/lib/use-field-ids.ts`, `src/lib/use-field-ids.test.tsx`, `src/lib/use-is-mobile.ts`, `src/components/BomUIProvider/{BomUIProvider.tsx,messages.ts,BomUIProvider.test.tsx,index.ts}`

**Interfaces — Produces:**
- `useBomUI(): { locale: DayPickerLocale; messages: BomUIMessages }` (internal, from `src/components/BomUIProvider/BomUIProvider.tsx`)
- `BomUIProvider`, `BomUIProviderProps`, `BomUIMessages`, `defaultMessages` (public)
- `src/lib/icons.tsx`: `CheckIcon`, `ChevronDownIcon`, `ChevronUpIcon`, `ChevronLeftIcon`, `ChevronRightIcon`, `XIcon`, `MinusIcon`, `CircleIcon`, `CalendarIcon`, `MoreHorizontalIcon`, `PanelLeftIcon`, `AlertCircleIcon`, `FileWarningIcon`, `RefreshIcon`, `ExternalLinkIcon` — each `(props: SVGProps<SVGSVGElement>) => JSX.Element`
- `src/lib/date.ts`: `isValidDate(d: unknown): d is Date`, `sameDate(a?: Date|null, b?: Date|null): boolean`, `formatDateDisplay(date, locale?)`, `formatDateInput(date, locale?)`, `parseDateInput(text, locale?): Date | undefined`, `calendarLocaleProps(locale?): Pick<DayPickerProps,'locale'|'formatters'|'labels'>`, `defaultDateLocale`
- `useTransientState<T>(initial: T): readonly [T, Dispatch<SetStateAction<T>>]`
- `useFieldIds(prefix: string, name: string, opts: { description?: unknown; invalid?: boolean }): { fieldId, labelId, valueId, descriptionId, errorId, describedBy: string | undefined }`
- `useIsMobile(breakpoint = 768): boolean`
- CSS: `.bom-sr-only` และ token ใหม่ทั้งหมดในหัวข้อ Step 3

- [ ] **Step 1: Branch + dependencies**

```bash
git checkout -b feat/port-poc-components   # แจ้งผู้ใช้ — งานค้างใน working tree ติดไปด้วย ไม่หาย
yarn add -E radix-ui@1.8.1 react-day-picker@10.0.2 input-otp@1.5.0 sonner@2.0.8
yarn add -D -E react-hook-form@7.91.0 zod@4.6.7 @hookform/resolvers@5.9.2
```

แล้วแก้ `package.json` `peerDependencies` เป็น:
```json
"peerDependencies": {
  "react": ">=18",
  "react-dom": ">=18",
  "react-hook-form": "^7.55.0"
}
```

`tsup.config.ts`: `external: ['react', 'react-dom', 'next', 'react-hook-form'],`

Run: `yarn install && yarn typecheck` → Expected: ผ่าน

- [ ] **Step 2: Test polyfills** — เพิ่มท้าย `src/test-utils/setup.ts`

```ts
// Sidebar (useIsMobile) and Radix read matchMedia; jsdom lacks it.
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList
}
// Radix Select/Menu open on pointerdown and check PointerEvent fields.
if (typeof window.PointerEvent !== 'function') {
  class PointerEventStub extends MouseEvent {
    pointerId: number
    pointerType: string
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init)
      this.pointerId = init.pointerId ?? 1
      this.pointerType = init.pointerType ?? 'mouse'
    }
  }
  window.PointerEvent = PointerEventStub as unknown as typeof PointerEvent
}
```

- [ ] **Step 3: Tokens** — แก้ `src/styles/tokens.css`

ใน block `:root, [data-theme='light']` เพิ่ม (หลัง `--bom-color-info`):
```css
  --bom-color-surface: #ffffff;
  --bom-color-surface-fg: #0f172a;
  --bom-color-accent: #f1f5f9;
  --bom-color-accent-fg: #0f172a;
  --bom-color-overlay: rgb(15 23 42 / 0.5);
  --bom-color-input: #cbd5e1;
  --bom-color-success-fg: #ffffff;
  --bom-color-warning-fg: #1c1917;
  --bom-color-info-fg: #ffffff;
  --bom-color-sidebar: #f8fafc;
  --bom-color-sidebar-fg: #0f172a;
  --bom-color-sidebar-border: #e2e8f0;
  --bom-color-sidebar-accent: #e2e8f0;
```
และหลัง `--bom-radius-lg` / `--bom-space-6` / `--bom-font-weight-medium` / `--bom-shadow-md` / `--bom-duration-fast` ตามลำดับ:
```css
  --bom-radius-xl: 0.75rem;

  --bom-space-5: 1.25rem;
  --bom-space-8: 2rem;
  --bom-space-10: 2.5rem;

  --bom-font-size-xs: 0.75rem;
  --bom-font-size-xl: 1.25rem;
  --bom-font-size-2xl: 1.5rem;
  --bom-font-weight-semibold: 600;

  --bom-shadow-lg: 0 10px 30px rgb(15 23 42 / 0.18);

  --bom-duration-normal: 200ms;

  /* control heights match Button padding + line-height (sm 28px, md 38px, lg 48px) */
  --bom-control-height-sm: 1.75rem;
  --bom-control-height-md: 2.375rem;
  --bom-control-height-lg: 3rem;

  --bom-z-overlay: 50;
  --bom-z-popover: 60;
  --bom-z-toast: 70;

  --bom-sidebar-width: 16rem;
  --bom-sidebar-width-mobile: 18rem;
  --bom-sidebar-width-icon: 3rem;
```

ใน **ทั้งสอง** block dark (`[data-theme='dark']` และ `[data-theme='system']` ใน media query) เพิ่ม:
```css
  --bom-color-surface: #0f172a;
  --bom-color-surface-fg: #e2e8f0;
  --bom-color-accent: #1e293b;
  --bom-color-accent-fg: #e2e8f0;
  --bom-color-overlay: rgb(0 0 0 / 0.6);
  --bom-color-input: #334155;
  --bom-color-success-fg: #052e16;
  --bom-color-warning-fg: #1c1917;
  --bom-color-info-fg: #082f49;
  --bom-color-sidebar: #0f172a;
  --bom-color-sidebar-fg: #e2e8f0;
  --bom-color-sidebar-border: #1e293b;
  --bom-color-sidebar-accent: #1e293b;
  --bom-shadow-lg: 0 10px 30px rgb(0 0 0 / 0.6);
```

ท้ายไฟล์:
```css
/* Visually hidden but read by screen readers. Shared by every component. */
.bom-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

- [ ] **Step 4: Icons** — `src/lib/icons.tsx`

```tsx
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
```

- [ ] **Step 5: Date helpers — failing test** `src/lib/date.test.ts`

```ts
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
```

Run: `yarn vitest run src/lib/date.test.ts` → Expected: FAIL (module not found)

- [ ] **Step 6: Date helpers — implement** `src/lib/date.ts`

Copy `POC/hook-form/date-utils.ts` verbatim (ทุกฟังก์ชัน: `defaultDateLocale`, `isValidDate`, `sameDate`, `formatDateDisplay`, `formatDateInput`, `parseDateInput`, `calendarLocaleProps`) เปลี่ยนแค่: ใช้ single quote, ไม่มี semicolon (ตาม style repo), คอมเมนต์คงไว้ได้

Run: `yarn vitest run src/lib/date.test.ts` → Expected: PASS

- [ ] **Step 7: Hooks** — `src/lib/use-transient-state.ts`

```ts
'use client'

import { useLayoutEffect, useState } from 'react'

/**
 * State that resets to its initial value when the component is hidden by <Activity>
 * (Next.js cacheComponents keeps hidden pages mounted). Used for popovers that must
 * not stay open after navigating away and back.
 */
export function useTransientState<T>(initial: T) {
  const [initialValue] = useState(initial)
  const [value, setValue] = useState(initialValue)
  useLayoutEffect(() => () => setValue(initialValue), [initialValue])
  return [value, setValue] as const
}
```

`src/lib/use-is-mobile.ts`:
```ts
'use client'

import { useEffect, useState } from 'react'

/** false during SSR and the first client render; updates after mount (no hydration mismatch). */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const update = () => setIsMobile(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [breakpoint])
  return isMobile
}
```

`src/lib/use-field-ids.test.tsx`:
```tsx
import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useFieldIds } from './use-field-ids'

describe('useFieldIds', () => {
  it('builds ids from prefix + name and joins describedBy', () => {
    const { result } = renderHook(() => useFieldIds('rhf-input', 'email', { description: 'x', invalid: true }))
    const ids = result.current
    expect(ids.fieldId).toMatch(/^rhf-input-email-/)
    expect(ids.descriptionId).toBe(`${ids.fieldId}-description`)
    expect(ids.errorId).toBe(`${ids.fieldId}-error`)
    expect(ids.labelId).toBe(`${ids.fieldId}-label`)
    expect(ids.describedBy).toBe(`${ids.descriptionId} ${ids.errorId}`)
  })

  it('omits describedBy when there is neither description nor error', () => {
    const { result } = renderHook(() => useFieldIds('rhf-input', 'email', {}))
    expect(result.current.describedBy).toBeUndefined()
  })

  it('gives two fields with the same name different ids', () => {
    const a = renderHook(() => useFieldIds('p', 'n', {})).result.current.fieldId
    const b = renderHook(() => useFieldIds('p', 'n', {})).result.current.fieldId
    expect(a).not.toBe(b)
  })
})
```

`src/lib/use-field-ids.ts`:
```ts
'use client'

import { useId } from 'react'

/**
 * Ids for a labelled form field. useId keeps ids unique when the same field name renders
 * twice on a page (e.g. a form in a dialog plus a page hidden by <Activity>).
 * describedBy lets screen readers read the description and error after the label.
 */
export function useFieldIds(prefix: string, name: string, opts: { description?: unknown; invalid?: boolean }) {
  const uid = useId()
  const fieldId = `${prefix}-${name}-${uid}`
  const descriptionId = `${fieldId}-description`
  const errorId = `${fieldId}-error`
  const describedBy = [opts.description ? descriptionId : null, opts.invalid ? errorId : null].filter(Boolean).join(' ') || undefined
  return {
    fieldId,
    labelId: `${fieldId}-label`,
    valueId: `${fieldId}-value`,
    descriptionId,
    errorId,
    describedBy,
  }
}
```

Run: `yarn vitest run src/lib` → Expected: PASS

- [ ] **Step 8: BomUIProvider — failing test** `src/components/BomUIProvider/BomUIProvider.test.tsx`

```tsx
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
    expect(screen.getByText(`th|${defaultMessages.retry}|${defaultMessages.close}|${defaultMessages.pageOf(2, 5)}`)).toBeInTheDocument()
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
```

Run: `yarn vitest run src/components/BomUIProvider` → FAIL

- [ ] **Step 9: BomUIProvider — implement**

`src/components/BomUIProvider/messages.ts`:
```ts
export interface BomUIMessages {
  required: string
  loading: string
  close: string
  selectPlaceholder: string
  datePickerPlaceholder: string
  dateRangePlaceholder: string
  dateInputPlaceholder: string
  openCalendar: string
  time: string
  pagination: string
  previousPage: string
  nextPage: string
  morePages: string
  pageOf: (page: number, pageCount: number) => string
  pageSummary: (from: number, to: number, total: number) => string
  breadcrumb: string
  breadcrumbMore: string
  toggleSidebar: string
  errorTitle: string
  retry: string
  pdfRegenerate: string
  pdfOpenNewTab: string
  pdfFailed: string
}

export const defaultMessages: BomUIMessages = {
  required: 'จำเป็น',
  loading: 'กำลังโหลด',
  close: 'ปิด',
  selectPlaceholder: 'เลือก',
  datePickerPlaceholder: 'เลือกวันที่',
  dateRangePlaceholder: 'เลือกช่วงวันที่',
  dateInputPlaceholder: 'วว/ดด/ปปปป',
  openCalendar: 'เปิดปฏิทิน',
  time: 'เวลา',
  pagination: 'การแบ่งหน้า',
  previousPage: 'หน้าก่อนหน้า',
  nextPage: 'หน้าถัดไป',
  morePages: 'หน้าอื่น ๆ',
  pageOf: (page, pageCount) => `หน้า ${page} / ${pageCount}`,
  pageSummary: (from, to, total) => `${from}–${to} จาก ${total} รายการ`,
  breadcrumb: 'เส้นทาง',
  breadcrumbMore: 'เพิ่มเติม',
  toggleSidebar: 'เปิด/ปิดแถบข้าง',
  errorTitle: 'โหลดข้อมูลไม่สำเร็จ',
  retry: 'ลองใหม่',
  pdfRegenerate: 'สร้างใหม่',
  pdfOpenNewTab: 'เปิดแท็บใหม่',
  pdfFailed: 'สร้าง PDF ไม่สำเร็จ',
}
```

ถ้า RHFDateRangePicker ใน POC มีข้อความ hardcode อื่น ให้เพิ่ม key ใน interface + `defaultMessages` ใน Task 13

`src/components/BomUIProvider/BomUIProvider.tsx`:
```tsx
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
```

`src/components/BomUIProvider/index.ts`:
```ts
export { BomUIProvider } from './BomUIProvider'
export type { BomUIProviderProps } from './BomUIProvider'
export { defaultMessages } from './messages'
export type { BomUIMessages } from './messages'
```

`src/index.ts`: เพิ่ม `export * from './components/BomUIProvider'` (ไม่ export `useBomUI`)

Run: `yarn vitest run src/components/BomUIProvider` → PASS

- [ ] **Step 10: Storybook locale toolbar** — แก้ `.storybook/preview.tsx`

เพิ่ม import `import { enUS, th } from 'react-day-picker/locale'` และ `import { BomUIProvider } from '../src/components/BomUIProvider'`; เพิ่มใน `globalTypes`:
```ts
    locale: {
      description: 'BomUIProvider locale',
      toolbar: { title: 'Locale', icon: 'globe', items: ['th', 'en'], dynamicTitle: true },
    },
```
`initialGlobals: { theme: 'light', locale: 'th' }`; ใน decorator ครอบ `<Story />` ด้วย
```tsx
<BomUIProvider
  locale={context.globals.locale === 'en' ? enUS : th}
  messages={context.globals.locale === 'en' ? englishMessages : undefined}
>
```
โดยประกาศ `englishMessages: Partial<BomUIMessages>` ใน preview (แปลทุก key เป็นอังกฤษ) — ไฟล์นี้ไม่ถูก publish

- [ ] **Step 11: Verify**

Run: `yarn typecheck && yarn test && yarn build && sh scripts/check-dist.sh && sh scripts/check-css.sh`
Expected: ทั้งหมดผ่าน, `dist/styles.css` มี `--bom-control-height-md`

---

### Task 2: Primitives

**Files (Create ทุกไฟล์ตาม recipe: `.tsx`, `.css`, `.test.tsx`, `.stories.tsx`, `index.ts`):** `IconButton`, `ButtonGroup`, `Badge`, `Spinner`, `Kbd`, `Avatar`, `Card`, `Separator`, `Skeleton`
**Modify:** `src/components/Button/{Button.tsx,Button.css,Button.test.tsx,Button.stories.tsx}`, `src/index.ts`
**Reference:** `POC/ui/{button,button-group,badge,spinner,kbd,card,separator,skeleton}.tsx`; Avatar ไม่มีใน POC (ใช้ Radix `Avatar`)

**Interfaces — Produces:**
- `Spinner`: `forwardRef<HTMLSpanElement, SpinnerProps>`; `SpinnerProps = HTMLAttributes<HTMLSpanElement> & { size?: 'sm'|'md'|'lg'; label?: string }` → `<span role="status" aria-label={label ?? messages.loading} class="bom-spinner bom-spinner--{size}">` มี svg หมุน (`@keyframes bom-spin`)
- `Button`: เพิ่ม `loading?: boolean`, `asChild?: boolean` — `loading` → render `<Spinner size="sm" aria-hidden>`? **ไม่** — ใช้ `<span class="bom-btn__spinner" aria-hidden>` วาด spinner ด้วย CSS เพื่อไม่ให้มี `role=status` ซ้อนในปุ่ม; ตั้ง `aria-busy="true"`, `disabled`, class `bom-btn--loading`; `asChild` → `Slot.Root` จาก `radix-ui` (ไม่ใส่ `type` เมื่อ asChild)
- `IconButton`: `IconButtonProps = Omit<ButtonProps, 'aria-label'|'loading'> & { 'aria-label': string }` (บังคับใน type) class `bom-btn bom-btn--{variant} bom-icon-btn bom-icon-btn--{size}` (สี่เหลี่ยมจัตุรัส สูง `--bom-control-height-*`); default variant `ghost`
- `ButtonGroup` (`role="group"`, `orientation?: 'horizontal'|'vertical'`, class `bom-button-group bom-button-group--{orientation}`), `ButtonGroupText` (`asChild`), `ButtonGroupSeparator` (ใช้ `Separator`)
- `Badge`: `variant?: 'primary'|'secondary'|'outline'|'info'|'success'|'warning'|'danger'` default `primary`, `asChild`, `<span>`
- `Kbd` (`<kbd class="bom-kbd">`), `KbdGroup` (`<kbd class="bom-kbd-group">`)
- `Avatar`, `AvatarImage`, `AvatarFallback` (Radix `Avatar`), `size?: 'sm'|'md'|'lg'` บน `Avatar`
- `Card` + `CardHeader`, `CardTitle` (`<div>`), `CardDescription`, `CardAction`, `CardContent`, `CardFooter` (class `bom-card__header` ฯลฯ — ใช้ `bom-card` ตัวเดียวเป็น folder `Card` + `Card.css`)
- `Separator` (Radix, `orientation`, `decorative=true` default)
- `Skeleton` (`<div class="bom-skeleton" aria-hidden="true">` pulse animation ปิดเมื่อ reduced-motion)

- [ ] **Step 1: Button tests ใหม่ (failing)** — เพิ่มใน `Button.test.tsx`:

```tsx
  it('shows a busy, disabled state while loading', async () => {
    const onClick = vi.fn()
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    )
    const btn = screen.getByRole('button', { name: 'Save' })
    expect(btn).toHaveAttribute('aria-busy', 'true')
    expect(btn).toBeDisabled()
    expect(btn).toHaveClass('bom-btn--loading')
    await userEvent.click(btn)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders its child element with button classes when asChild', () => {
    render(
      <Button asChild variant="secondary">
        <a href="/x">Go</a>
      </Button>,
    )
    const link = screen.getByRole('link', { name: 'Go' })
    expect(link).toHaveClass('bom-btn', 'bom-btn--secondary')
    expect(link).not.toHaveAttribute('type')
  })
```
Run: `yarn vitest run src/components/Button` → FAIL

- [ ] **Step 2: Button implement**

```tsx
'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Slot } from 'radix-ui'
import { cn } from '../../lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'sparkle'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Shows a spinner, sets aria-busy and disables the button. */
  loading?: boolean
  /** Render the single child (e.g. a link) with the button's classes instead of a <button>. */
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, asChild = false, className, type = 'button', disabled, children, ...props },
  ref,
) {
  const classes = cn('bom-btn', `bom-btn--${variant}`, `bom-btn--${size}`, loading && 'bom-btn--loading', className)
  if (asChild) {
    return (
      <Slot.Root ref={ref} className={classes} {...props}>
        {children}
      </Slot.Root>
    )
  }
  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <span className="bom-btn__spinner" aria-hidden="true" />}
      {children}
    </button>
  )
})

Button.displayName = 'Button'
```

เพิ่มใน `Button.css`:
```css
.bom-btn > svg {
  width: 1em;
  height: 1em;
  flex-shrink: 0;
}

.bom-btn--loading {
  cursor: progress;
}

.bom-btn__spinner {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: var(--bom-radius-full);
  animation: bom-btn-spin 0.7s linear infinite;
}

@keyframes bom-btn-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .bom-btn__spinner {
    animation-duration: 2s;
  }
}
```
(ถ้า `.bom-btn:disabled` มี `opacity: 0.5` ให้ `.bom-btn--loading:disabled { opacity: 0.8; }`)

Story: เพิ่ม `Loading` และ `AsChild`
Run: `yarn vitest run src/components/Button` → PASS

- [ ] **Step 3: IconButton — tests ก่อน แล้ว implement** tests ที่ต้องมีนอกจาก DoD:
```tsx
  it('uses aria-label as the accessible name', () => {
    render(<IconButton aria-label="Close"><XIcon /></IconButton>)
    expect(screen.getByRole('button', { name: 'Close' })).toHaveClass('bom-icon-btn', 'bom-icon-btn--md', 'bom-btn--ghost')
  })
```
(ใน test import `XIcon` จาก `'../../lib/icons'`) และ type test: ไฟล์ test มีบรรทัด
```tsx
// @ts-expect-error aria-label is required
const _missing = <IconButton>x</IconButton>
```
Implement: `IconButton` = `forwardRef` ที่ render `<Button variant={variant ?? 'ghost'} size={size} className={cn('bom-icon-btn', `bom-icon-btn--${size ?? 'md'}`, className)} {...props} />`; CSS `.bom-icon-btn { padding: 0; width: var(--bom-control-height-md); height: var(--bom-control-height-md); }` + `--sm` / `--lg`

- [ ] **Step 4: ButtonGroup, Badge, Spinner, Kbd, Avatar, Card, Separator, Skeleton** — แต่ละตัว: test (DoD 1–5) → FAIL → implement ตาม `POC/ui/<file>.tsx` + กฎการแปลง → PASS. Test เพิ่มเติม:
  - ButtonGroup: `role="group"`, `bom-button-group--vertical` เมื่อ `orientation="vertical"`; CSS ทำให้ปุ่มติดกัน (มุมกลางไม่มน, border ไม่ซ้อน) ทั้งแนวนอน/ตั้ง
  - Badge: `it.each` 7 variants; `asChild` กับ `<a>`
  - Spinner: `role="status"` + ชื่อ `กำลังโหลด` (default) และ `label="Saving"` แทนได้
  - Avatar: render `AvatarFallback` ข้อความ `AB` เมื่อไม่มีรูปโหลด (jsdom ไม่โหลดรูป)
  - Card: ทุก part มี class `bom-card__<part>`; `CardTitle` เป็น `div` (ปลายทางใส่ heading เองผ่าน `asChild`? — ไม่ต้อง; ใช้ `role` ไม่ได้ ปล่อยเป็น div เหมือน POC)
  - Separator: `decorative` default → `role="none"`; `decorative={false}` → `role="separator"` + `aria-orientation`
  - Skeleton: `aria-hidden="true"`
- [ ] **Step 5: Export ทั้งหมดใน `src/index.ts`** (`Avatar`, `Badge`, `ButtonGroup`, `Card`, `IconButton`, `Kbd`, `Separator`, `Skeleton`, `Spinner`)
- [ ] **Step 6: Verify** `yarn typecheck && yarn test && sh scripts/check-css.sh` → ผ่าน

---

### Task 3: Form controls — Label, Input, Textarea, Checkbox, RadioGroup, Switch, Field

**Files:** Create โฟลเดอร์ `Label`, `Input`, `Textarea`, `Checkbox`, `RadioGroup`, `Switch`, `Field` (ครบ 5 ไฟล์ตาม recipe); Modify `src/index.ts`
**Reference:** `POC/ui/{label,input,textarea,checkbox,radio-group,switch,field}.tsx`

**Interfaces — Produces:**
- `Label` — ตาม recipe ข้างบน (copy ได้ทั้งหมด)
- `Input`: `forwardRef<HTMLInputElement, InputProps>`, `InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & { size?: 'sm'|'md'|'lg' }` class `bom-input bom-input--{size}`; `[aria-invalid='true']` border/ring `--bom-color-danger`; `type="file"` style `::file-selector-button`
- `Textarea`: `forwardRef<HTMLTextAreaElement, TextareaProps>` class `bom-textarea`, `field-sizing: content` + `min-height: 4rem`
- `Checkbox`: Radix Checkbox, ref = `HTMLButtonElement`, indicator: `CheckIcon` หรือ `MinusIcon` เมื่อ `checked === 'indeterminate'`; class `bom-checkbox`, `bom-checkbox__indicator`
- `RadioGroup` (`bom-radio-group`, ส่ง `orientation` ต่อ) + `RadioGroupItem` (`bom-radio`, indicator `CircleIcon`)
- `Switch`: `size?: 'sm'|'md'` → `bom-switch bom-switch--{size}`, thumb `bom-switch__thumb`
- `Field` family (ทั้งหมดใน `Field/Field.tsx`, CSS `Field.css`):
  - `FieldSet` (`<fieldset class="bom-field-set">`), `FieldLegend` (`variant?: 'legend'|'label'` → `bom-field-legend--{variant}`), `FieldGroup` (`bom-field-group`, เป็น container-query root: `container-type: inline-size; container-name: bom-field-group`)
  - `Field`: `<div role="group" class="bom-field bom-field--{orientation}">`, `orientation?: 'vertical'|'horizontal'|'responsive'` default `vertical`; `responsive` = vertical จนกว่า `@container bom-field-group (min-width: 28rem)` แล้วเป็น horizontal; `[data-invalid]` ทำให้ label/description เป็นสี danger
  - `FieldContent` (`bom-field__content`), `FieldLabel` (ใช้ `Label` + class `bom-field__label`), `FieldTitle` (`bom-field__title`), `FieldDescription` (`<p class="bom-field__description">`), `FieldSeparator` (children optional — ข้อความกลางเส้น), `FieldError`
  - `FieldError`: `FieldErrorProps = HTMLAttributes<HTMLDivElement> & { errors?: Array<{ message?: string } | undefined> }` — children ชนะ; ไม่งั้นเอา message ที่ไม่ซ้ำ: 0 → `return null`, 1 → ข้อความเดียว, >1 → `<ul>`; `role="alert"` class `bom-field__error`
  - CSS helper ที่ RHF* ใช้ (ใส่ใน `Field.css`): `.bom-field__required { color: var(--bom-color-danger); }`, `.bom-field__row { display: flex; gap: var(--bom-space-3); }`, `.bom-field__col { display: flex; flex-direction: column; gap: var(--bom-space-2); min-width: 0; flex: 1; }`, `.bom-field__col--time { flex: none; width: 8rem; }`, `.bom-field__append { display: flex; width: 100%; align-items: center; gap: var(--bom-space-2); }`, `.bom-field--horizontal > .bom-field__label { flex: none; min-height: var(--bom-control-height-md); }`

- [ ] **Step 1: Label** — สร้างตาม recipe ทุกไฟล์ → `yarn vitest run src/components/Label` → PASS
- [ ] **Step 2: Input / Textarea — tests ก่อน** นอกจาก DoD:
```tsx
  it('marks invalid state for styling', () => {
    render(<Input aria-label="Email" aria-invalid />)
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('aria-invalid', 'true')
  })
  it('types text', async () => {
    render(<Input aria-label="Email" />)
    await userEvent.type(screen.getByRole('textbox'), 'a@b.co')
    expect(screen.getByRole('textbox')).toHaveValue('a@b.co')
  })
```
→ implement → PASS
- [ ] **Step 3: Checkbox / RadioGroup / Switch — tests ก่อน** นอกจาก DoD:
  - Checkbox: คลิกแล้ว `aria-checked` เป็น `true`; Space toggle; `checked="indeterminate"` → `aria-checked="mixed"` และ render MinusIcon (`container.querySelector('svg')` มี)
  - RadioGroup: ลูกศรลง/ขวาเลื่อน focus + เลือก item ถัดไป (`await userEvent.keyboard('{ArrowDown}')` แล้ว `toBeChecked()`)
  - Switch: `role="switch"`, คลิกแล้ว `aria-checked="true"`, class `bom-switch--sm`
  → implement → PASS
- [ ] **Step 4: Field — tests ก่อน**
```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Input } from '../Input'
import { Field, FieldDescription, FieldError, FieldLabel, FieldSet, FieldLegend, FieldGroup } from './Field'

describe('Field', () => {
  it('lays out label, control, description and error', async () => {
    const { container } = render(
      <FieldSet>
        <FieldLegend>Profile</FieldLegend>
        <FieldGroup>
          <Field data-invalid orientation="horizontal">
            <FieldLabel htmlFor="e">Email</FieldLabel>
            <Input id="e" aria-invalid aria-describedby="e-d e-e" />
            <FieldDescription id="e-d">Work email</FieldDescription>
            <FieldError id="e-e" errors={[{ message: 'Required' }]} />
          </Field>
        </FieldGroup>
      </FieldSet>,
    )
    expect(screen.getByRole('group', { name: 'Profile' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription('Work email Required')
    expect(container.querySelector('.bom-field')).toHaveClass('bom-field--horizontal')
    await expectNoA11yViolations(container)
  })

  it('FieldError dedupes messages and lists several', () => {
    render(<FieldError errors={[{ message: 'A' }, { message: 'A' }, { message: 'B' }, undefined]} />)
    const alert = screen.getByRole('alert')
    expect(alert.querySelectorAll('li')).toHaveLength(2)
  })

  it('FieldError renders nothing without messages', () => {
    const { container } = render(<FieldError errors={[undefined]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
```
พร้อม DoD (ref/displayName ของ `Field`, `FieldLabel`, `FieldError`) → implement → PASS
- [ ] **Step 5: Export** ทุกตัว + props types ใน `src/index.ts`; Story `Form/Field` แสดง vertical / horizontal / responsive / invalid / FieldSet + checkbox group
- [ ] **Step 6: Verify** `yarn typecheck && yarn test && sh scripts/check-css.sh`

---

### Task 4: Form controls — Select, InputGroup, InputOTP

**Files:** Create `Select`, `InputGroup`, `InputOTP`; Modify `src/index.ts`
**Reference:** `POC/ui/{select,input-group,input-otp}.tsx`

**Interfaces — Consumes:** `Input`, `Textarea`, `Button`, `IconButton`, icons
**Interfaces — Produces:**
- `Select` (Root, no DOM — ไม่ต้อง forwardRef แต่ export ตรงจาก Radix `Select.Root` เป็น `Select` พร้อม `displayName='Select'`), `SelectTrigger` (`size?: 'sm'|'md'|'lg'`, ChevronDownIcon, class `bom-select__trigger bom-select__trigger--{size}`), `SelectValue`, `SelectContent` (`position?: 'item-aligned'|'popper'` default `'item-aligned'`, Portal + ScrollUp/Down + Viewport; class `bom-select__content`, `z-index: var(--bom-z-popover)`), `SelectItem` (CheckIcon indicator), `SelectGroup`, `SelectLabel`, `SelectSeparator`, `SelectScrollUpButton`, `SelectScrollDownButton`
- `InputGroup` (`<div role="group" class="bom-input-group">`; กรอบเดียว focus-within ring; `[data-disabled]`), `InputGroupAddon` (`align?: 'inline-start'|'inline-end'|'block-start'|'block-end'` default `inline-start`; คลิกที่ addon (ที่ไม่ใช่ปุ่ม) focus input ข้างใน), `InputGroupButton` (`Button` ขนาด `sm` variant default `ghost`, `size?: 'xs'|'sm'|'icon-xs'|'icon-sm'` → class `bom-input-group__button--{size}`), `InputGroupText`, `InputGroupInput` (`Input` + class `bom-input-group__control` ไม่มี border ของตัวเอง), `InputGroupTextarea`
- `InputOTP` (`OTPInput` จาก `input-otp`, `containerClassName` → `bom-input-otp`), `InputOTPGroup`, `InputOTPSlot` (`index: number`, อ่าน `OTPInputContext`, แสดง fake caret `bom-input-otp__caret`), `InputOTPSeparator` (`role="separator"`, MinusIcon)

- [ ] **Step 1: Select — tests ก่อน** นอกจาก DoD (ref → trigger button):
```tsx
  it('opens with the keyboard and selects an item', async () => {
    const onValueChange = vi.fn()
    render(
      <Select onValueChange={onValueChange}>
        <SelectTrigger aria-label="Fruit"><SelectValue placeholder="Pick" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Apple</SelectItem>
          <SelectItem value="b">Banana</SelectItem>
        </SelectContent>
      </Select>,
    )
    const trigger = screen.getByRole('combobox', { name: 'Fruit' })
    expect(trigger).toHaveTextContent('Pick')
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    await userEvent.click(await screen.findByRole('option', { name: 'Banana' }))
    expect(onValueChange).toHaveBeenCalledWith('b')
    expect(trigger).toHaveTextContent('Banana')
  })
```
และ axe ตอนเปิด (`await expectNoA11yViolations(document.body)`) → implement → PASS
- [ ] **Step 2: InputGroup — tests ก่อน**: input ได้ชื่อจาก `aria-label`; `InputGroupAddon` คลิกแล้ว input ได้ focus; `InputGroupButton` เป็น `type="button"`; class `bom-input-group__addon--inline-end` → implement → PASS
- [ ] **Step 3: InputOTP — tests ก่อน**: พิมพ์ `123456` ลง `screen.getByRole('textbox')` แล้ว `onChange` ได้ `'123456'` และ slot แต่ละช่องแสดงตัวเลข; `maxLength={6}` → implement → PASS
- [ ] **Step 4: Export + stories** (Select: placeholder/groups/popper/disabled/invalid; InputGroup: prefix text, icon, button, textarea block-end; InputOTP: 6 ช่อง + separator)
- [ ] **Step 5: Verify** `yarn typecheck && yarn test && sh scripts/check-css.sh`

---

### Task 5: Overlays — Popover, Tooltip, Dialog, AlertDialog, Sheet

**Files:** Create `Popover`, `Tooltip`, `Dialog`, `AlertDialog`, `Sheet`; Modify `src/index.ts`
**Reference:** `POC/ui/{popover,tooltip,dialog,sheet}.tsx`; AlertDialog ไม่มีใน POC (Radix `AlertDialog`, API เหมือน Dialog)

**Interfaces — Produces:**
- `Popover`, `PopoverTrigger`, `PopoverAnchor`, `PopoverClose` (re-export ของ Radix พร้อม displayName), `PopoverContent` (Portal, `align='center'`, `sideOffset=4`, class `bom-popover`, z `--bom-z-popover`)
- `TooltipProvider` (`delayDuration=0`), `Tooltip` (ครอบ `TooltipProvider` ให้เองเหมือน POC), `TooltipTrigger`, `TooltipContent` (Portal, `sideOffset=4`, arrow, class `bom-tooltip`)
- `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogClose`, `DialogOverlay` (`bom-dialog__overlay` bg `--bom-color-overlay`), `DialogContent` (`showCloseButton?: boolean` default `true` → `IconButton aria-label={messages.close}` + XIcon; class `bom-dialog`), `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`
- `AlertDialog` ชุดเดียวกัน (prefix `AlertDialog…`) + `AlertDialogAction` (class ปุ่ม primary — render Radix Action ด้วย `asChild` ไม่ได้เพราะ consumer อาจใส่ children; ให้ใช้ class `bom-btn bom-btn--primary bom-btn--md`), `AlertDialogCancel` (`bom-btn bom-btn--secondary bom-btn--md`); ไม่มีปุ่ม X
- `Sheet` ชุดเดียวกับ Dialog (prefix `Sheet…`), `SheetContent` มี `side?: 'top'|'right'|'bottom'|'left'` default `right` → `bom-sheet--{side}`, `showCloseButton` default `true`
- Animation: `@keyframes bom-fade-in/out`, `bom-zoom-in/out`, `bom-slide-in-from-{side}` ผูกกับ `[data-state='open'|'closed']`; ทุกตัวปิด animation ใน `@media (prefers-reduced-motion: reduce)`; ตั้งชื่อ keyframes ให้มี prefix ของ component (เช่น `bom-dialog-zoom-in`) เพื่อไม่ชนกันใน `dist/styles.css`

- [ ] **Step 1: tests ก่อน (ทุกตัว)** — ตัวอย่าง Dialog:
```tsx
  it('opens, traps focus, closes with Escape and the close button', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription>Change things</DialogDescription>
        </DialogContent>
      </Dialog>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    const dialog = screen.getByRole('dialog', { name: 'Edit' })
    expect(dialog).toHaveClass('bom-dialog')
    await expectNoA11yViolations(document.body)
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    await userEvent.click(screen.getByRole('button', { name: 'ปิด' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
```
  - AlertDialog: role `alertdialog`, Escape ปิดได้, คลิก overlay **ไม่**ปิด, `AlertDialogCancel` ปิด
  - Sheet: `side="left"` → class `bom-sheet--left`, Escape ปิด
  - Popover: คลิก trigger เปิด (`screen.getByRole('dialog')`), Escape ปิดและ focus กลับ trigger
  - Tooltip: hover / focus trigger แล้ว `await screen.findByRole('tooltip')` มีข้อความ
  - ref: `DialogContent` ref → `HTMLDivElement` (ทดสอบตอนเปิดด้วย `defaultOpen`)

Run → FAIL
- [ ] **Step 2: implement ทั้ง 5** ตาม POC + กฎการแปลง → Run → PASS
- [ ] **Step 3: Export + stories** (Dialog กับฟอร์มด้านใน, AlertDialog ยืนยันลบ variant danger, Sheet 4 ด้าน, Popover, Tooltip ทุก side)
- [ ] **Step 4: Verify** `yarn typecheck && yarn test && sh scripts/check-css.sh`

---

### Task 6: Calendar

**Files:** Create `src/components/Calendar/{Calendar.tsx,Calendar.css,Calendar.test.tsx,Calendar.stories.tsx,index.ts}`; Modify `src/index.ts`
**Reference:** `POC/ui/calendar.tsx`, `src/lib/date.ts`

**Interfaces — Consumes:** `useBomUI()`, `calendarLocaleProps`, icons
**Interfaces — Produces:**
- `Calendar`: `CalendarProps = DayPickerProps` (รับทุก prop ของ DayPicker); ไม่ forwardRef (DayPicker ไม่รับ ref — **ยกเว้นจาก DoD ข้อ 1**, ตั้ง `displayName='Calendar'`)
- พฤติกรรม: `const { locale } = useBomUI()`; `props.locale ?? locale` ส่งเข้า `calendarLocaleProps()` แล้ว merge: `formatters={{ formatMonthDropdown: (d) => d.toLocaleString(loc.code, { month: 'short' }), ...localeProps.formatters, ...props.formatters }}`, `labels={{ ...localeProps.labels, ...props.labels }}`; `showOutsideDays` default `true`
- `classNames`: map ทุก key ของ `UI`, `DayFlag`, `SelectionState` enum (import จาก `react-day-picker`) เป็น `bom-calendar__<key>` เช่น `{ [UI.Root]: 'bom-calendar', [UI.Day]: 'bom-calendar__day', [DayFlag.today]: 'bom-calendar__day--today', [SelectionState.selected]: 'bom-calendar__day--selected', [SelectionState.range_start]: 'bom-calendar__day--range-start', ... }` แล้ว merge กับ `props.classNames`
- `components.Chevron`: ใช้ `ChevronLeft/Right/DownIcon` ตาม `orientation`
- CSS: ปุ่มวันขนาด `--bom-calendar-cell: 2.25rem` (ตัวแปร local ประกาศใน `.bom-calendar`), selected = `--bom-color-primary`/`-fg`, today = `--bom-color-accent`, range middle = `--bom-color-accent`, outside/disabled = `--bom-color-muted-fg` + opacity, dropdown caption (select โปร่งใสทับ label แบบ POC)
- ใส่ class `.bom-date-picker__trigger` (ใช้โดย RHFDatePicker Task 13) ใน `Calendar.css`: `width: 100%; justify-content: flex-start; font-weight: normal;` และ `[data-empty='true'] { color: var(--bom-color-muted-fg); }`; `.bom-date-picker__time::-webkit-calendar-picker-indicator { display: none; }`

- [ ] **Step 1: tests ก่อน**
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { enUS } from 'react-day-picker/locale'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { BomUIProvider } from '../BomUIProvider'
import { Calendar } from './Calendar'

const oct2026 = new Date(2026, 9, 1)

describe('Calendar', () => {
  it('shows a Buddhist-era caption by default', () => {
    render(<Calendar month={oct2026} />)
    expect(screen.getByRole('grid', { name: /2569/ })).toBeInTheDocument()
  })

  it('follows the provider locale', () => {
    render(
      <BomUIProvider locale={enUS}>
        <Calendar month={oct2026} />
      </BomUIProvider>,
    )
    expect(screen.getByRole('grid', { name: /October 2026/ })).toBeInTheDocument()
  })

  it('selects a day', async () => {
    const onSelect = vi.fn()
    render(<Calendar mode="single" month={oct2026} onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('button', { name: /29/ }))
    expect(onSelect).toHaveBeenCalled()
    expect((onSelect.mock.calls[0][0] as Date).getDate()).toBe(29)
  })

  it('moves focus with arrow keys', async () => {
    render(<Calendar mode="single" month={oct2026} selected={new Date(2026, 9, 15)} autoFocus />)
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).toHaveAccessibleName(/16/)
  })

  it('applies bom classes', () => {
    const { container } = render(<Calendar month={oct2026} />)
    expect(container.querySelector('.bom-calendar')).toBeInTheDocument()
    expect(container.querySelector('.bom-calendar__day')).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Calendar mode="single" month={oct2026} />)
    await expectNoA11yViolations(container)
  })
})
```
Run → FAIL → implement → PASS (ถ้า regex ชื่อวันไม่ตรง ให้ปรับ regex ใน test ให้ตรงกับ `labelDayButton` ของ `calendarLocaleProps` — ห้ามแก้ helper)
- [ ] **Step 2: Story** single / range / dropdown caption (`captionLayout="dropdown"` + `startMonth`/`endMonth`) / disabled dates / two months
- [ ] **Step 3: Export + Verify** `yarn typecheck && yarn test && sh scripts/check-css.sh`

---

### Task 7: DropdownMenu + Toaster

**Files:** Create `DropdownMenu`, `Toaster`; Modify `src/index.ts`
**Reference:** `POC/ui/{dropdown-menu,sonner}.tsx`

**Interfaces — Produces:**
- `DropdownMenu`, `DropdownMenuPortal`, `DropdownMenuTrigger`, `DropdownMenuGroup`, `DropdownMenuSub`, `DropdownMenuRadioGroup` (re-export + displayName), `DropdownMenuContent` (Portal, `sideOffset=4`, `bom-dropdown-menu`), `DropdownMenuItem` (`inset?: boolean`, `variant?: 'default'|'danger'`), `DropdownMenuCheckboxItem` (CheckIcon), `DropdownMenuRadioItem` (CircleIcon), `DropdownMenuLabel` (`inset`), `DropdownMenuSeparator`, `DropdownMenuShortcut` (`<span>`), `DropdownMenuSubTrigger` (`inset`, ChevronRightIcon), `DropdownMenuSubContent`
- `Toaster`: `forwardRef` ไม่ได้ (sonner ไม่รับ ref — ยกเว้น DoD ข้อ 1, ตั้ง displayName) `ToasterProps = ComponentProps<typeof Sonner>`; ส่ง `className="bom-toaster"`, `toastOptions={{ classNames: { toast: 'bom-toast', title: 'bom-toast__title', description: 'bom-toast__description', actionButton: 'bom-toast__action', cancelButton: 'bom-toast__cancel', success: 'bom-toast--success', error: 'bom-toast--danger', warning: 'bom-toast--warning', info: 'bom-toast--info' } }}` merge กับ props; `theme`: อ่าน `document.documentElement.dataset.theme` ใน `useEffect` (`'dark'|'light'|'system'`, default `'light'`) และฟัง `MutationObserver` บน attribute `data-theme`; style ผ่าน CSS variables ของ sonner ใน `Toaster.css` (`.bom-toaster { --normal-bg: var(--bom-color-surface); --normal-text: var(--bom-color-surface-fg); --normal-border: var(--bom-color-border); --border-radius: var(--bom-radius-lg); z-index: var(--bom-z-toast); }`)
- re-export: `export { toast } from 'sonner'` ใน `Toaster/index.ts`; type `ExternalToast` re-export เป็น `ToastOptions`

- [ ] **Step 1: tests ก่อน**
  - DropdownMenu: Enter บน trigger เปิด `role="menu"`; ArrowDown เลื่อน focus ไป item ถัดไป; Enter เรียก `onSelect`; Escape ปิดและ focus กลับ trigger; CheckboxItem toggle `aria-checked`; Sub menu เปิดด้วย ArrowRight; `variant="danger"` → class `bom-dropdown-menu__item--danger`; axe ตอนเปิด
  - Toaster: render `<Toaster />` แล้ว `act(() => { toast('Saved') })` → `await screen.findByText('Saved')`; `toast.error('Oops')` → element ที่มีข้อความอยู่ใน `.bom-toast--danger`; `document.documentElement.dataset.theme = 'dark'` ก่อน render → container ของ sonner (`[data-sonner-toaster]`) มี `data-sonner-theme="dark"`
- [ ] **Step 2: implement** → PASS
- [ ] **Step 3: Export + stories** (menu ครบทุก item type; Toaster ปุ่มยิง toast ทุกชนิด + action)
- [ ] **Step 4: Verify** `yarn typecheck && yarn test && sh scripts/check-css.sh`

---

### Task 8: Navigation & data — Tabs, Accordion, Breadcrumb, Pagination, Table, Alert

**Files:** Create `Tabs`, `Accordion`, `Breadcrumb`, `Pagination`, `Table`, `Alert`; Modify `src/index.ts`
**Reference:** `POC/ui/{breadcrumb,table,alert}.tsx`, `POC/simple-pagination.tsx`; Tabs/Accordion ใช้ Radix

**Interfaces — Produces:**
- `Tabs` (`bom-tabs`), `TabsList` (`bom-tabs__list`), `TabsTrigger` (`bom-tabs__trigger`, active = `[data-state='active']`), `TabsContent`
- `Accordion` (Radix Root re-export + displayName, `bom-accordion`), `AccordionItem`, `AccordionTrigger` (ChevronDownIcon หมุนเมื่อเปิด; อยู่ใน `Accordion.Header`), `AccordionContent` (animation ความสูงด้วย `--radix-accordion-content-height`)
- `Breadcrumb` (`<nav aria-label={messages.breadcrumb}>`), `BreadcrumbList` (`<ol>`), `BreadcrumbItem`, `BreadcrumbLink` (`asChild`), `BreadcrumbPage` (`<span role="link" aria-disabled="true" aria-current="page">` เหมือน POC), `BreadcrumbSeparator` (default ChevronRightIcon, `role="presentation" aria-hidden`), `BreadcrumbEllipsis` (MoreHorizontalIcon + `bom-sr-only` `messages.breadcrumbMore`)
- `Pagination`: `forwardRef<HTMLElement, PaginationProps>`
  ```ts
  export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
    page: number            // 1-based
    pageCount: number
    onPageChange: (page: number) => void
    siblingCount?: number   // default 1
    variant?: 'full' | 'simple'  // default 'full'
    total?: number          // simple: แสดงสรุปเมื่อส่ง total + pageSize
    pageSize?: number
  }
  ```
  - export helper `getPageItems(page, pageCount, siblingCount): Array<number | 'ellipsis'>` จาก `Pagination.tsx` (internal — ไม่ export จาก index แต่ test ตรง)
  - `<nav aria-label={messages.pagination} class="bom-pagination bom-pagination--{variant}">`; ปุ่มก่อน/ถัดไปเป็น `IconButton` `aria-label={messages.previousPage|nextPage}` disabled ที่ขอบ; `full`: ปุ่มเลขหน้า (`Button variant="ghost"`, หน้าปัจจุบัน `variant="secondary"` + `aria-current="page"`) + ellipsis `<span aria-hidden>` + `bom-sr-only` `messages.morePages`; `simple`: `messages.pageOf(page, pageCount)` (`tabular-nums`) และถ้ามี `total` + `pageSize` แสดง `messages.pageSummary(from, to, total)` ด้านซ้าย (`from = total === 0 ? 0 : (page-1)*pageSize+1`, `to = Math.min(page*pageSize, total)`); `pageCount` < 1 ถือเป็น 1
- `Table` (`<div class="bom-table-container"><table class="bom-table">` ref → `table`), `TableHeader`, `TableBody`, `TableFooter`, `TableRow` (`[data-state='selected']`), `TableHead`, `TableCell`, `TableCaption`
- `Alert`: `variant?: 'default'|'info'|'success'|'warning'|'danger'` default `'default'`; `role = variant === 'danger' ? 'alert' : 'status'` (override ได้ผ่าน props); layout grid: icon (svg ลูกตัวแรก) | title/description | action; `AlertTitle`, `AlertDescription`, `AlertAction`

- [ ] **Step 1: tests ก่อน**
  - Pagination `getPageItems`:
```ts
  it.each([
    [1, 5, 1, [1, 2, 3, 4, 5]],
    [1, 10, 1, [1, 2, 3, 'ellipsis', 10]],
    [5, 10, 1, [1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]],
    [10, 10, 1, [1, 'ellipsis', 8, 9, 10]],
    [1, 1, 1, [1]],
  ] as const)('page %i of %i (siblings %i)', (page, count, sib, expected) => {
    expect(getPageItems(page, count, sib)).toEqual(expected)
  })
```
  - Pagination component: คลิก "หน้าถัดไป" เรียก `onPageChange(page+1)`; ปุ่มก่อนหน้า disabled ที่หน้า 1; หน้าปัจจุบัน `aria-current="page"`; `variant="simple" total={120} pageSize={10} page={1}` แสดง `1–10 จาก 120 รายการ` และ `หน้า 1 / 12`; `getByRole('navigation', { name: 'การแบ่งหน้า' })`; axe
  - Tabs: ArrowRight เลื่อนไป tab ถัดไปและแสดง panel ของมัน; axe
  - Accordion: คลิก trigger → `aria-expanded="true"` และเห็น content; `type="single" collapsible`
  - Breadcrumb: `navigation` ชื่อ `เส้นทาง`; `BreadcrumbPage` `aria-current="page"`; `BreadcrumbLink asChild` กับ `<a>`
  - Table: `getByRole('table')` + caption เป็นชื่อ (`getByRole('table', { name: 'Invoices' })`); ref → `HTMLTableElement`
  - Alert: `it.each` variants → class `bom-alert--{v}`; danger มี `role="alert"`, info มี `role="status"`
- [ ] **Step 2: implement ทั้งหมด** → PASS
- [ ] **Step 3: Export (ไม่ export `getPageItems`) + stories**
- [ ] **Step 4: Verify** `yarn typecheck && yarn test && sh scripts/check-css.sh`

---

### Task 9: App-level — PageHeader, EmptyState, ErrorState, PdfPreview

**Files:** Create `PageHeader`, `EmptyState`, `ErrorState`, `PdfPreview`; Modify `src/index.ts`
**Reference:** `POC/{page-header,error-state,pdf-preview}.tsx`

**Interfaces — Consumes:** `Alert*`, `Button`, `Skeleton`, `useBomUI`, icons
**Interfaces — Produces:**
- `PageHeader`: `forwardRef<HTMLDivElement, PageHeaderProps>`; `PageHeaderProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & { title: ReactNode; description?: ReactNode; actions?: ReactNode; headingLevel?: 1 | 2 }` → `bom-page-header`, `__title` (h1/h2), `__description`, `__actions`
- `EmptyState`: `Omit<HTMLAttributes<HTMLDivElement>, 'title'> & { icon?: ReactNode; title: ReactNode; description?: ReactNode; action?: ReactNode }` → `bom-empty-state` (กรอบ dashed, กลาง), title เป็น `<p class="bom-empty-state__title">`
- `ErrorState`: `Omit<AlertProps, 'title'|'variant'> & { title?: ReactNode; message?: ReactNode; onRetry?: () => void; retryLabel?: string }` → `<Alert variant="danger">` + `AlertCircleIcon` + `AlertTitle`(`title ?? messages.errorTitle`) + `AlertDescription`(message, ถ้ามี) + `AlertAction` > `<Button size="sm" variant="secondary" onClick={onRetry}>{retryLabel ?? messages.retry}</Button>` (เมื่อมี `onRetry`); ref → Alert div
- `PdfPreview`:
  ```ts
  export interface PdfPreviewProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    url: string
    title: string                                   // iframe title
    fetcher?: (url: string) => Promise<Blob>        // default defaultPdfFetcher
    getErrorMessage?: (error: unknown) => ReactNode // default: error instanceof Error ? error.message : String(error)
    height?: string                                 // default '70vh' → CSS var --bom-pdf-height inline style
    actions?: boolean                               // default true
  }
  ```
  - `defaultPdfFetcher(url)`: `fetch(url)`; `!res.ok` → อ่าน JSON `body?.error?.message ?? body?.message ?? res.statusText` แล้ว `throw new Error(msg)`; คืน `res.blob()`
  - logic โหลด / nonce / revoke blob URL ตาม POC (state `{ key, blobURL?, error? }`); loading → `Skeleton`; error → กล่อง `FileWarningIcon` + `messages.pdfFailed` + ข้อความ error (`role="alert"`); สำเร็จ → `<iframe src={blobURL} title={title} class="bom-pdf-preview__frame">`
  - actions: `Button size="sm" variant="secondary"` RefreshIcon + `messages.pdfRegenerate` (disabled ระหว่างโหลด) และ `Button asChild` `<a href={url} target="_blank" rel="noreferrer">` ExternalLinkIcon + `messages.pdfOpenNewTab`
  - ใน test: mock `URL.createObjectURL` / `revokeObjectURL` ด้วย `vi.fn()` (jsdom ไม่มี)

- [ ] **Step 1: tests ก่อน**
  - PageHeader: heading level 1 ชื่อ title, `headingLevel={2}` → h2, actions render
  - EmptyState: title/description/action render, axe
  - ErrorState: `role="alert"` มี `โหลดข้อมูลไม่สำเร็จ` + message; คลิก `ลองใหม่` เรียก `onRetry`; ไม่มีปุ่มเมื่อไม่ส่ง `onRetry`
  - PdfPreview:
```tsx
  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => 'blob:pdf')
    URL.revokeObjectURL = vi.fn()
  })

  it('loads the PDF through the fetcher and shows it in an iframe', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Blob(['%PDF']))
    render(<PdfPreview url="/doc.pdf" title="Invoice" fetcher={fetcher} />)
    expect(await screen.findByTitle('Invoice')).toHaveAttribute('src', 'blob:pdf')
    expect(fetcher).toHaveBeenCalledWith('/doc.pdf')
  })

  it('shows the error message when loading fails, and retries', async () => {
    const fetcher = vi.fn().mockRejectedValueOnce(new Error('Chrome not ready')).mockResolvedValue(new Blob(['%PDF']))
    render(<PdfPreview url="/doc.pdf" title="Invoice" fetcher={fetcher} />)
    expect(await screen.findByRole('alert')).toHaveTextContent('Chrome not ready')
    await userEvent.click(screen.getByRole('button', { name: 'สร้างใหม่' }))
    expect(await screen.findByTitle('Invoice')).toBeInTheDocument()
  })

  it('revokes the blob URL on unmount', async () => {
    const { unmount } = render(<PdfPreview url="/doc.pdf" title="Invoice" fetcher={() => Promise.resolve(new Blob())} />)
    await screen.findByTitle('Invoice')
    unmount()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:pdf')
  })

  it('links to the PDF in a new tab', () => {
    render(<PdfPreview url="/doc.pdf" title="Invoice" fetcher={() => new Promise(() => {})} />)
    expect(screen.getByRole('link', { name: 'เปิดแท็บใหม่' })).toHaveAttribute('href', '/doc.pdf')
  })
```
  - DoD ref/displayName ทุกตัว
- [ ] **Step 2: implement** → PASS
- [ ] **Step 3: Export (`defaultPdfFetcher` export ด้วย) + stories** (PdfPreview story ใช้ fetcher ที่ resolve blob จาก `new Blob([...], { type: 'application/pdf' })` เล็ก ๆ หรือ reject เพื่อแสดง error)
- [ ] **Step 4: Verify** `yarn typecheck && yarn test && sh scripts/check-css.sh`

---

### Task 10: Sidebar

**Files:** Create `src/components/Sidebar/{Sidebar.tsx,Sidebar.css,Sidebar.test.tsx,Sidebar.stories.tsx,index.ts}`; Modify `src/index.ts`
**Reference:** `POC/ui/sidebar.tsx`, `POC/hooks/use-mobile.ts`

**Interfaces — Consumes:** `Button`, `IconButton`, `Input`, `Separator`, `Sheet*`, `Tooltip*`, `Skeleton`, `useIsMobile`, `useBomUI`, `PanelLeftIcon`
**Interfaces — Produces:** ทุก export ตามรายการใน spec — `SidebarProvider`, `useSidebar`, `Sidebar`, `SidebarTrigger`, `SidebarRail`, `SidebarInset`, `SidebarInput`, `SidebarHeader`, `SidebarFooter`, `SidebarSeparator`, `SidebarContent`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarGroupAction`, `SidebarGroupContent`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, `SidebarMenuAction`, `SidebarMenuBadge`, `SidebarMenuSkeleton`, `SidebarMenuSub`, `SidebarMenuSubItem`, `SidebarMenuSubButton`
- `useSidebar(): { state: 'expanded'|'collapsed'; open: boolean; setOpen(open: boolean): void; openMobile: boolean; setOpenMobile(open: boolean): void; isMobile: boolean; toggleSidebar(): void }` — throw `Error('useSidebar must be used within a SidebarProvider.')` นอก provider
- `SidebarProvider`: `defaultOpen=true`, `open?`, `onOpenChange?`; `setOpen` เขียน cookie `sidebar_state=<open>; path=/; max-age=604800` (ใน handler เท่านั้น); keydown Ctrl/⌘+B toggle (ใน `useEffect`); TooltipProvider `delayDuration=0` ครอบ; `<div class="bom-sidebar-wrapper">` + inline style `--bom-sidebar-width`, `--bom-sidebar-width-icon` ถ้าส่ง `style`
- `Sidebar`: `side?: 'left'|'right'`, `variant?: 'sidebar'|'floating'|'inset'`, `collapsible?: 'offcanvas'|'icon'|'none'`; mobile → `Sheet` (`SheetContent side={side}` + `bom-sr-only` `SheetTitle`/`SheetDescription` เพื่อ a11y); desktop → `data-state`, `data-collapsible`, `data-variant`, `data-side` attribute สำหรับ CSS (แทน Tailwind `group-data-*`)
- `SidebarTrigger` = `IconButton aria-label={messages.toggleSidebar}` + PanelLeftIcon
- `SidebarMenuButton`: `asChild`, `isActive` (→ `data-active`), `size?: 'sm'|'md'|'lg'`, `variant?: 'default'|'outline'`, `tooltip?: string | ComponentProps<typeof TooltipContent>` (แสดงเฉพาะเมื่อ `state==='collapsed' && !isMobile`)
- `SidebarMenuSkeleton`: ความกว้างสุ่มใน POC ใช้ `Math.random` ระหว่าง render — เปลี่ยนเป็น `useState(() => \`${50 + Math.floor(Math.random()*40)}%\`)` ไม่ได้ (hydration mismatch) → ใช้ prop `width?: string` default `'70%'`
- ห้ามอ่าน cookie ระหว่าง render; ปลายทางอ่าน cookie ฝั่ง server แล้วส่ง `defaultOpen` (เขียนตัวอย่างใน story description)

- [ ] **Step 1: tests ก่อน**
```tsx
  function Shell(props: { defaultOpen?: boolean }) {
    return (
      <SidebarProvider defaultOpen={props.defaultOpen}>
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Home">Home</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <SidebarTrigger />
        </SidebarInset>
      </SidebarProvider>
    )
  }
```
  - คลิก trigger (`getByRole('button', { name: 'เปิด/ปิดแถบข้าง' })`) → element `.bom-sidebar` (ตัวที่มี `data-state`) เปลี่ยนจาก `expanded` เป็น `collapsed` และ `document.cookie` มี `sidebar_state=false`
  - Ctrl+B (`await userEvent.keyboard('{Control>}b{/Control}')`) toggle กลับ
  - `defaultOpen={false}` เริ่มที่ `collapsed`
  - `SidebarMenuButton isActive` มี `data-active="true"`
  - `useSidebar` นอก provider throw (render component ที่เรียก แล้ว `expect(() => render(...)).toThrow(/SidebarProvider/)` — ปิด console.error ด้วย `vi.spyOn(console, 'error').mockImplementation(() => {})`)
  - mobile: mock `window.matchMedia` ให้ `matches: true` ใน test นั้น → คลิก trigger เปิด `role="dialog"` (Sheet)
  - axe บน Shell
- [ ] **Step 2: implement** (CSS ยาว — แยกเป็น section ด้วยคอมเมนต์: wrapper / gap / container / variants / collapsible icon / menu / sub / rail / inset) → PASS
- [ ] **Step 3: Export + story** (layout เต็มจอ `parameters: { layout: 'fullscreen' }`: header, groups, sub menu, footer, collapsible icon/offcanvas, variant inset/floating)
- [ ] **Step 4: Verify** `yarn typecheck && yarn test && sh scripts/check-css.sh`

---

### Task 11: HookForm — FormProvider, RHFInput, RHFInputGroup, RHFTextArea, RHFSelect, RHFSwitch

**Files:** Create `src/components/HookForm/{index.ts,FormProvider.tsx,RequiredMark.tsx,RHFInput.tsx,RHFInputGroup.tsx,RHFTextArea.tsx,RHFSelect.tsx,RHFSwitch.tsx}` + `<Name>.test.tsx` ต่อ component, `src/test-utils/form.tsx`; Modify `src/index.ts` (story รวม `HookForm.stories.tsx` ทำใน Task 13)
**Reference:** `POC/hook-form/{FormProvider,RHFInput,RHFInputGroup,RHFTextArea,RHFSelect,RHFSwitch,index}.tsx`

**Interfaces — Consumes:** `Field*`, `Input`, `Textarea`, `InputGroup*`, `ButtonGroup`, `Select*`, `Switch`, `useFieldIds`, `useBomUI`
**Interfaces — Produces:**
- `FormProvider<T extends FieldValues>(props: { methods: UseFormReturn<T>; onSubmit?: FormEventHandler<HTMLFormElement>; children: ReactNode } & Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children'>)` — `<RHFFormProvider {...methods}><form onSubmit={onSubmit} noValidate {...formProps}>` (POC รับ `VoidFunction`; `handleSubmit(fn)` คืน `(e?) => Promise<void>` ใช้ได้ทั้งสองแบบ)
- `RequiredMark({ announce?: boolean })` (internal): `<span aria-hidden="true" class="bom-field__required">*</span>` + ถ้า `announce` → `<span class="bom-sr-only">({messages.required})</span>`
- RHF* — **props เหมือน POC ทุกตัว** ยกเว้น `size` (`'sm'|'md'|'lg'`, POC `"default"` → `'md'`) และไม่มี Tailwind default className (เช่น RHFSelect `triggerClassName ?? "w-full"` → trigger มี class `bom-select__trigger--full` เสมอ ถ้าไม่ส่ง `triggerClassName`); ใช้ `useFieldIds('rhf-<kind>', name, { description, invalid })` แทน `useId` + string ต่อเอง
- type exports: `RHFSelectOption`, `RHFSelectGroup`, `RHFInputGroupAddon`, `RHFInputGroupControlProps`, `RHFInputGroupSlot` + props type ของแต่ละตัว `RHFInputProps<T>` ฯลฯ (export ด้วย — POC ไม่ export แต่ library ต้อง export ตามกฎ)
- `src/test-utils/form.tsx`:
```tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { useForm, type DefaultValues, type FieldValues, type UseFormReturn } from 'react-hook-form'
import type { z } from 'zod'
import { FormProvider } from '../components/HookForm'

/**
 * Renders fields inside a real react-hook-form + zod form. `methods` is filled after render
 * so tests can call setValue / reset / getValues. Submit with the "submit" button.
 */
export function renderForm<S extends z.ZodType<FieldValues, FieldValues>>(
  schema: S,
  defaultValues: DefaultValues<z.input<S>>,
  fields: ReactNode,
) {
  const result: { methods: UseFormReturn<z.input<S>, unknown, z.output<S>> | null; submitted: z.output<S>[] } = {
    methods: null,
    submitted: [],
  }
  function Harness() {
    const methods = useForm<z.input<S>, unknown, z.output<S>>({ resolver: zodResolver(schema), defaultValues })
    result.methods = methods
    return (
      <FormProvider methods={methods} onSubmit={methods.handleSubmit((v) => void result.submitted.push(v))}>
        {fields}
        <button type="submit">submit</button>
      </FormProvider>
    )
  }
  return { ...render(<Harness />), form: result }
}
```
(ถ้า generic ของ `zodResolver` / `useForm` ไม่ลงตัวกับ zod 4 + resolvers 5.9.2 ให้ปรับ type ใน helper นี้ให้ typecheck ผ่าน — พฤติกรรมต้องเหมือนเดิม)

- [ ] **Step 1: test helper + RHFInput tests (failing)** `src/components/HookForm/RHFInput.test.tsx`
```tsx
import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { renderForm } from '../../test-utils/form'
import { RHFInput } from './RHFInput'

const schema = z.object({ email: z.string().min(1, 'กรอกอีเมล'), files: z.array(z.instanceof(File)).optional() })

describe('RHFInput', () => {
  it('writes typed text into the form', async () => {
    const { form } = renderForm(schema, { email: '' }, <RHFInput name="email" label="Email" />)
    await userEvent.type(screen.getByRole('textbox', { name: 'Email' }), 'a@b.co')
    expect(form.methods!.getValues('email')).toBe('a@b.co')
  })

  it('shows the schema error and links it with aria-describedby', async () => {
    renderForm(schema, { email: '' }, <RHFInput name="email" label="Email" description="Work email" />)
    await userEvent.click(screen.getByRole('button', { name: 'submit' }))
    const input = screen.getByRole('textbox', { name: 'Email' })
    expect(await screen.findByText('กรอกอีเมล')).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Work email กรอกอีเมล')
  })

  it('marks required with a hidden asterisk and the native attribute', () => {
    renderForm(schema, { email: '' }, <RHFInput name="email" label="Email" required />)
    const input = screen.getByRole('textbox', { name: 'Email' })
    expect(input).toBeRequired()
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true')
  })

  it('keeps ids unique when the same name renders twice', () => {
    renderForm(schema, { email: '' }, <><RHFInput name="email" label="A" /><RHFInput name="email" label="B" /></>)
    expect(screen.getByRole('textbox', { name: 'A' }).id).not.toBe(screen.getByRole('textbox', { name: 'B' }).id)
  })

  it('stores files as File[] and clears the input on reset', async () => {
    const { form, container } = renderForm(schema, { email: '', files: [] }, <RHFInput name="files" label="Files" type="file" />)
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['x'], 'a.pdf', { type: 'application/pdf' })
    await userEvent.upload(input, file)
    expect(form.methods!.getValues('files')).toEqual([file])
    act(() => form.methods!.reset({ email: '', files: [] }))
    expect(input.value).toBe('')
  })

  it('renders addons in an InputGroup and append next to it', () => {
    const { container } = renderForm(schema, { email: '' }, <RHFInput name="email" label="Email" startAddon="@" append={<button type="button">Go</button>} attachAppend />)
    expect(container.querySelector('.bom-input-group')).toBeInTheDocument()
    expect(container.querySelector('.bom-button-group')).toBeInTheDocument()
  })

  it('supports a horizontal layout and hidden label', () => {
    const { container } = renderForm(schema, { email: '' }, <RHFInput name="email" label="Email" hideLabel orientation="horizontal" />)
    expect(container.querySelector('.bom-field--horizontal')).toBeInTheDocument()
    expect(screen.getByText('Email')).toHaveClass('bom-sr-only')
  })

  it('has no a11y violations with an error', async () => {
    const { container } = renderForm(schema, { email: '' }, <RHFInput name="email" label="Email" description="d" />)
    await userEvent.click(screen.getByRole('button', { name: 'submit' }))
    await screen.findByText('กรอกอีเมล')
    await expectNoA11yViolations(container)
  })
})
```
Run: `yarn vitest run src/components/HookForm` → FAIL
- [ ] **Step 2: implement FormProvider, RequiredMark, RHFInput** ตาม `POC/hook-form/RHFInput.tsx` + กฎการแปลง (`hideLabel && "sr-only"` → `'bom-sr-only'`; `orientation === "horizontal" && "h-8 flex-none! items-center"` → ไม่ต้อง (CSS `.bom-field--horizontal > .bom-field__label` ใน Task 3); `<div className="flex w-full items-center gap-2">` → `<div className="bom-field__append">`; `ButtonGroup className="w-full"` → `ButtonGroup className="bom-button-group--full"` (เพิ่ม rule `width: 100%` ใน `ButtonGroup.css`)) → PASS
- [ ] **Step 3: RHFTextArea, RHFInputGroup, RHFSelect, RHFSwitch** — แต่ละตัว: เขียน test ก่อน (ไฟล์ `<Name>.test.tsx`) ครอบ: ค่าเข้าฟอร์ม, error + `aria-describedby`, required, disabled, axe + เฉพาะตัว:
  - RHFSelect: เปิดด้วยคีย์บอร์ด เลือก option แล้ว `getValues` ได้ค่า; ค่า `""` แสดง placeholder; ปิด dropdown แล้ว field เป็น touched (`form.methods!.getFieldState('x').isTouched === true`); `options` แบบกลุ่มแสดง `SelectLabel` และ separator; trigger มี `aria-required="true"` เมื่อ `required`; `orientation="horizontal"` → `.bom-field--horizontal`
  - RHFSwitch: คลิกแล้วค่าเป็น `true`; (อ่าน POC/hook-form/RHFSwitch.tsx สำหรับ props อื่น เช่น layout card และทดสอบตาม)
  - RHFTextArea: พิมพ์แล้วค่าเข้า; (อ่าน POC สำหรับ props เช่น counter / maxLength และทดสอบตาม)
  - RHFInputGroup: addon/slot ตาม POC; ค่าเข้าฟอร์ม
  → implement ตาม POC → PASS
- [ ] **Step 4: Export** `src/components/HookForm/index.ts` (ตาม `POC/hook-form/index.ts` + props types) และ `export * from './components/HookForm'` ใน `src/index.ts`
- [ ] **Step 5: Verify** `yarn typecheck && yarn test && sh scripts/check-css.sh`

---

### Task 12: HookForm — RHFCheckbox, RHFRadioGroup, RHFInputOTP

**Files:** Create `src/components/HookForm/{RHFCheckbox,RHFRadioGroup,RHFInputOTP}.tsx` + `.test.tsx` แต่ละตัว; Modify `src/components/HookForm/index.ts`
**Reference:** `POC/hook-form/{RHFCheckbox,RHFRadioGroup,RHFInputOTP}.tsx`

**Interfaces — Consumes:** `Checkbox`, `RadioGroup*`, `InputOTP*`, `Field*`, `useFieldIds`, `RequiredMark`, `renderForm`
**Interfaces — Produces:** `RHFCheckbox`, `RHFCheckboxOption`, `RHFCheckboxProps`, `RHFRadioGroup`, `RHFRadioOption`, `RHFRadioGroupProps`, `RHFInputOTP`, `RHFInputOTPProps` — props เหมือน POC

- [ ] **Step 1: tests ก่อน** — อ่าน POC แต่ละไฟล์ให้ครบทุกโหมดก่อนเขียน test แล้วครอบทุกโหมด อย่างน้อย:
  - RHFCheckbox: โหมด boolean เดี่ยว — คลิกแล้วค่า `true`; โหมดหลายตัวเลือก (`options`) — ค่าเป็น array ของ value ที่เลือก, เลือกแล้วยกเลิกถูกต้อง, กลุ่มเป็น `FieldSet` + `FieldLegend` (`getByRole('group', { name: <label> })`); error + `aria-describedby`; disabled option; axe
  - RHFRadioGroup: ลูกศรเลื่อนแล้วค่าเปลี่ยน; `RHFRadioOption.description` ผูกเป็น description ของ radio; required; error; axe
  - RHFInputOTP: พิมพ์ 6 หลักแล้วค่าเป็น string; `maxLength` / pattern ตาม POC; error + `aria-describedby`; axe
- [ ] **Step 2: implement ตาม POC + กฎการแปลง** → PASS
- [ ] **Step 3: Export + Verify** `yarn typecheck && yarn test && sh scripts/check-css.sh`

---

### Task 13: HookForm — RHFDatePicker, RHFDateRangePicker

**Files:** Create `src/components/HookForm/{RHFDatePicker,RHFDateRangePicker}.tsx` + `.test.tsx`; Modify `src/components/HookForm/index.ts`, `src/components/BomUIProvider/messages.ts` (ถ้าต้องเพิ่ม key)
**Reference:** `POC/hook-form/{RHFDatePicker,RHFDateRangePicker}.tsx`

**Interfaces — Consumes:** `Calendar`, `Popover*` (+`PopoverAnchor`), `Button`, `Input`, `InputGroup*`, `Field*`, `useTransientState`, `src/lib/date.ts`, `useBomUI`, `useFieldIds`, `RequiredMark`, `CalendarIcon`
**Interfaces — Produces:** `RHFDatePicker`, `RHFDatePickerProps`, `RHFDateRangePicker`, `RHFDateRangePickerProps`, `DateRange` — props เหมือน POC; default ของ `locale` = `useBomUI().locale`; default ข้อความ: `placeholder` → `messages.datePickerPlaceholder` (button) / `messages.dateInputPlaceholder` (input) / `messages.dateRangePlaceholder` (range), `timeLabel` → `messages.time`, `calendarButtonLabel` → `messages.openCalendar`, `(จำเป็น)` → `RequiredMark announce`

แปลง class: trigger ปุ่ม → `<Button variant="secondary" className={cn('bom-date-picker__trigger', triggerClassName)} data-empty={!date}>`; `PopoverContent className="w-auto overflow-hidden p-0"` → `className="bom-popover--flush"` (เพิ่ม rule `padding: 0; width: auto; overflow: hidden;` ใน `Popover.css`); showTime layout → `bom-field__row` / `bom-field__col` / `bom-field__col bom-field__col--time`; time input → `<Input type="time" className="bom-date-picker__time">`; `InputGroupButton size="icon-xs"` → `InputGroupButton size="icon-xs"` (มีใน Task 4)

- [ ] **Step 1: tests ก่อน** `RHFDatePicker.test.tsx` อย่างน้อย:
```tsx
const schema = z.object({ d: z.date({ error: 'เลือกวันที่' }).nullable().refine((v) => v !== null, 'เลือกวันที่') })

  it('button variant: opens the calendar, picks a day, closes and shows the Thai date', async () => {
    const { form } = renderForm(schema, { d: new Date(2026, 9, 1) }, <RHFDatePicker name="d" label="วันที่" />)
    const trigger = screen.getByRole('button', { name: /วันที่/ })
    expect(trigger).toHaveTextContent('2569')
    await userEvent.click(trigger)
    await userEvent.click(screen.getByRole('button', { name: /29/ }))
    expect((form.methods!.getValues('d') as Date).getDate()).toBe(29)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('input variant: parses a typed Buddhist-era date', async () => {
    const { form } = renderForm(schema, { d: null }, <RHFDatePicker name="d" label="วันที่" variant="input" />)
    await userEvent.type(screen.getByRole('textbox', { name: 'วันที่' }), '29/10/2569')
    const v = form.methods!.getValues('d') as Date
    expect([v.getFullYear(), v.getMonth(), v.getDate()]).toEqual([2026, 9, 29])
  })

  it('input variant: ArrowDown opens the calendar and closing returns focus to the text box', async () => {
    renderForm(schema, { d: null }, <RHFDatePicker name="d" label="วันที่" variant="input" />)
    const box = screen.getByRole('textbox', { name: 'วันที่' })
    box.focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(box).toHaveFocus()
  })

  it('input variant: an impossible date stays Invalid Date for the schema to reject', async () => {
    const { form } = renderForm(schema, { d: null }, <RHFDatePicker name="d" label="วันที่" variant="input" />)
    await userEvent.type(screen.getByRole('textbox', { name: 'วันที่' }), '31/02/2569')
    expect(Number.isNaN((form.methods!.getValues('d') as Date).getTime())).toBe(true)
  })

  it('announces required on the button variant', () => {
    renderForm(schema, { d: null }, <RHFDatePicker name="d" label="วันที่" required />)
    expect(screen.getByRole('button', { name: /วันที่ \(จำเป็น\)/ })).toBeInTheDocument()
  })

  it('showTime keeps the chosen time on the date', async () => {
    const { form } = renderForm(schema, { d: new Date(2026, 9, 1, 9, 30) }, <RHFDatePicker name="d" label="วันที่" showTime />)
    const time = screen.getByLabelText('เวลา')
    await userEvent.clear(time)
    await userEvent.type(time, '14:45')
    const v = form.methods!.getValues('d') as Date
    expect([v.getHours(), v.getMinutes()]).toEqual([14, 45])
  })

  it('reset clears the text box', async () => {
    const { form } = renderForm(schema, { d: null }, <RHFDatePicker name="d" label="วันที่" variant="input" />)
    const box = screen.getByRole('textbox', { name: 'วันที่' })
    await userEvent.type(box, '29/10/2569')
    act(() => form.methods!.reset({ d: null }))
    expect(box).toHaveValue('')
  })

  it('shows the schema error linked to the control', async () => {
    renderForm(schema, { d: null }, <RHFDatePicker name="d" label="วันที่" />)
    await userEvent.click(screen.getByRole('button', { name: 'submit' }))
    expect(await screen.findByText('เลือกวันที่', { selector: '.bom-field__error, .bom-field__error *' })).toBeInTheDocument()
  })
```
(ปรับ selector/regex ให้ตรงกับ markup จริงได้ แต่ห้ามลดสิ่งที่ตรวจ) + axe ตอนปิดและตอนเปิด
`RHFDateRangePicker.test.tsx`: เลือกวันเริ่ม + วันจบได้ `{ from, to }`; ข้อความบนปุ่มแสดงทั้งสองวัน; placeholder จาก messages; error; axe — อ่าน POC สำหรับโหมดอื่นแล้วทดสอบตาม
- [ ] **Step 2: implement ตาม POC + กฎการแปลง** → PASS
- [ ] **Step 3: Export + HookForm story** — `HookForm.stories.tsx` ฟอร์มรวมทุก RHF* + zod schema + ปุ่ม submit ที่แสดงค่า JSON และ story `English` ที่ครอบ `BomUIProvider locale={enUS}`
- [ ] **Step 4: Verify** `yarn typecheck && yarn test && sh scripts/check-css.sh`

---

### Task 14: Docs, changelog, full verification, smoke test

**Files:** Modify `README.md`, `CHANGELOG.md`, `docs/superpowers/specs/2026-11-05-component-library-design.md`

- [ ] **Step 1: README** — เพิ่ม/ปรับหัวข้อ:
  - ติดตั้ง: `yarn add @bomtawep/ui react-hook-form` (peer ใหม่)
  - `BomUIProvider` (ตัวอย่าง `app/layout.tsx` + `locale={enUS}` + `messages`)
  - รายการ component ตามกลุ่ม (Primitives / Form / Overlay / Navigation & data / App / HookForm)
  - ตัวอย่างฟอร์ม RHF + zod (`FormProvider`, `RHFInput`, `RHFSelect`, `RHFDatePicker`)
  - Sidebar: อ่าน cookie `sidebar_state` ใน Server Component แล้วส่ง `defaultOpen`
  - ตารางแปลงจาก shadcn (variant/size/asChild) ตาม spec
  - Theming: token ใหม่ (`--bom-color-surface`, `--bom-color-accent`, `--bom-sidebar-width`, …)
- [ ] **Step 2: CHANGELOG** — หัวข้อ `## [Unreleased]` (ห้ามใส่เลขเวอร์ชันเอง — `yarn release minor` โดยผู้ใช้) แบ่ง `Added` (component ทั้งหมด, `BomUIProvider`, `Button` `loading`/`asChild`, tokens), `Changed` (**peerDependency ใหม่ `react-hook-form ^7.55.0`** — ต้องติดตั้ง; dependencies ใหม่ `radix-ui`, `react-day-picker`, `input-otp`, `sonner`)
- [ ] **Step 3: spec เดิม** — ใน `2026-11-05-component-library-design.md` ใต้ตาราง "ขอบเขตแต่ละช่วง" เพิ่มบรรทัด: `> ช่วง 2–5 ถูกแทนด้วย [2026-11-09-poc-components-port-design.md](2026-11-09-poc-components-port-design.md) (ทำรวมใน 0.2.0)`
- [ ] **Step 4: Full verification**

```bash
yarn install --immutable
yarn typecheck
yarn test
yarn build
sh scripts/check-dist.sh
sh scripts/check-css.sh
yarn pack --dry-run
yarn build-storybook
```
Expected: ทุกคำสั่งผ่าน; `head -1 dist/index.js` = `'use client'`; `yarn pack --dry-run` มีแค่ `dist/**`, `package.json`, `README.md`, `CHANGELOG.md`; `grep -c "bom-sidebar" dist/styles.css` > 0; `grep -E "lucide|tailwind" dist/index.js` ไม่พบ

- [ ] **Step 5: Smoke test ใน Next App Router** — `yarn pack` → ใน `/Users/taweewatphimhin/Documents/bom/test-bom-ui`: `yarn add @bomtawep/ui@file:../bom-ui/package.tgz react-hook-form` → หน้าหนึ่งเป็น Server Component import `Card`, `Badge`, `PageHeader`; อีกหน้าเป็นฟอร์ม `'use client'` ใช้ RHFInput/RHFSelect/RHFDatePicker + `Toaster`; `yarn build` ผ่าน และ `yarn dev` เปิดหน้าไม่มี hydration warning ใน console; สลับ `data-theme="dark"` ดูถูกต้อง — **เอา dependency tarball ออกจาก test-bom-ui หลังทดสอบ** (หรือแจ้งผู้ใช้ว่าแก้ไฟล์ของ repo นั้น)
- [ ] **Step 6: สรุปให้ผู้ใช้** — รายการไฟล์ที่เปลี่ยน, ผลตรวจทุกคำสั่ง, ข้อความ commit ที่เสนอ:
```
feat: port poc-dof-pps ui + hook-form components

Add ~45 components (form controls, overlays, navigation, data display,
Sidebar, PdfPreview), react-hook-form wrappers (RHF*), BomUIProvider
(locale + messages, Thai default) and new design tokens.

BREAKING-ish (0.x minor): react-hook-form is now a required peerDependency.
```
**ห้าม commit / release เอง**
