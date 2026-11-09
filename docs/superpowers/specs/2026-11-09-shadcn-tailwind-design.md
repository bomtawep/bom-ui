# เปลี่ยน `@bomtawep/ui` เป็น shadcn + Tailwind v4 — 1.0.0

- วันที่: 2026-11-09
- สถานะ: อนุมัติแล้ว (brainstorming)
- แทนที่: ส่วน Styling / API ของ [2026-11-09-poc-components-port-design.md](2026-11-09-poc-components-port-design.md) และ [2026-11-05-component-library-design.md](2026-11-05-component-library-design.md) (plain CSS `--bom-*`, forwardRef, React 18)

## เป้าหมาย

ให้ component ทุกตัวเป็นโค้ด shadcn (style `radix-nova`, base `neutral` เหมือน poc-dof-pps) ใช้ Tailwind v4 แต่ยัง publish เป็น npm `@bomtawep/ui` แบบ semver เหมือนเดิม — snippet / เอกสาร shadcn ใช้กับ library ได้ตรง ๆ

## การตัดสินใจ

| เรื่อง | เลือก |
|---|---|
| รูปแบบ | npm library + Tailwind (โค้ด shadcn) — ไม่ใช่ registry |
| ชื่อ props | ตาม shadcn 100% (`variant="default\|outline\|secondary\|ghost\|destructive\|link"`, `size="default\|sm\|lg\|icon…"`) |
| React | peer `react >=19`, `react-dom >=19` — function component + `data-slot`, ไม่มี forwardRef / displayName |
| การส่ง CSS | แนวทาง A: ship Tailwind source CSS ให้ปลายทาง compile |
| Dark mode | class `.dark` (next-themes `attribute="class"`) |
| Icons | `lucide-react` |
| ส่วนเสริมที่คงไว้ | `IconButton`, `Button` `loading`, `Button variant="sparkle"`, `BomUIProvider`, `PageHeader`, `ErrorState`, `PdfPreview`, RHF* ทั้ง 11 ตัว |
| เวอร์ชัน | **1.0.0** (breaking) พร้อม Migration ใน CHANGELOG |

## 1. Packaging

- `peerDependencies`: `react >=19`, `react-dom >=19`, `react-hook-form ^7.55.0`, `tailwindcss ^4`
- `dependencies` (exact): `radix-ui`, `react-day-picker`, `input-otp`, `sonner`, `class-variance-authority`, `cn` (แทน clsx + tailwind-merge เหมือน shadcn v4), `lucide-react`, `tw-animate-css`
- devDependencies เพิ่ม: `tailwindcss`, `@tailwindcss/vite` (Storybook)
- exports: `.` (เหมือนเดิม), `./theme.css`, `./source.css` — **ลบ `./styles.css`**
- `cn()` มาจากแพ็กเกจ `cn` ตรง ๆ แบบ shadcn v4 (ลบ `src/lib/cn.ts`)

### CSS

| ไฟล์ | เนื้อหา |
|---|---|
| `src/styles/theme.css` | `@import "tw-animate-css"`, custom variants + keyframes ของ shadcn (`data-open`, `data-closed`, …, accordion — copy จาก `shadcn/tailwind.css`), `@custom-variant dark (&:is(.dark *))`, `@theme inline { --color-*, --radius-* }`, `:root { … }`, `.dark { … }` (ค่า neutral ตาม poc), keyframes ของ sparkle |
| `dist/theme.css` | = `src/styles/theme.css` + `@source "./";` (สแกน `dist/*.js`) |
| `dist/source.css` | `@source "./";` อย่างเดียว — สำหรับโปรเจกต์ที่มี theme shadcn ของตัวเองอยู่แล้ว |

ปลายทาง:
```css
@import "tailwindcss";
@import "@bomtawep/ui/theme.css";   /* หรือ source.css ถ้ามี theme shadcn อยู่แล้ว */
```

- `tsup.config.ts`: `onSuccess` เขียน `dist/theme.css` + `dist/source.css` (แทน `bundleCss`)
- `scripts/check-css.sh` เลิกใช้ (ลบออกจาก CI); `scripts/check-dist.sh` ตรวจ `dist/theme.css` + `dist/source.css` + `'use client'`

## 2. Components

### ใช้โค้ด shadcn ตรง ๆ (copy จาก poc หรือ `shadcn add` style `radix-nova`)

`Button`, `ButtonGroup`, `Badge`, `Spinner`, `Kbd`, `Avatar`, `Card`, `Separator`, `Skeleton`, `Label`, `Input`, `Textarea`, `Checkbox`, `RadioGroup`, `Switch`, `Select`, `InputGroup`, `InputOTP`, `Calendar`, `Field`, `Dialog`, `AlertDialog`, `Sheet`, `Popover`, `Tooltip`, `DropdownMenu`, `Toaster`, `Tabs`, `Accordion`, `Breadcrumb`, `Pagination`, `Table`, `Alert`, `Sidebar`, `Empty`

ปรับจากต้นฉบับเท่าที่จำเป็น:
- import: `@/components/ui/x` → `../X/X`, `cn` → `../../lib/utils`, `@/hooks/use-mobile` → `../../lib/use-is-mobile`
- ข้อความภาษาอังกฤษที่ hardcode (sr-only "Close", "Toggle Sidebar", "More", "Previous"/"Next", aria-label "Loading") → `useBomUI().messages`
- `Calendar` ใส่ `calendarLocaleProps(locale)` จาก `BomUIProvider` (ปี พ.ศ.)
- `Toaster` เลิกใช้ `next-themes` — อ่าน class `.dark` บน `<html>` ด้วย MutationObserver (prop `theme` ชนะ)
- โฟลเดอร์ละ component (`src/components/<Name>/<Name>.tsx`) เหมือนเดิม — ไม่มีไฟล์ `.css`

### ส่วนเสริม (เขียนแบบ shadcn: cva + Tailwind + `data-slot`)

- `Button`: เพิ่ม `variant="sparkle"` (gradient + shine, ใช้ keyframes ใน theme.css, หยุดเมื่อ reduced motion) และ `loading` (แสดง `Spinner`, `aria-busy`, disabled)
- `IconButton`: `Button` ที่บังคับ `aria-label` ใน type; `size?: 'xs' | 'sm' | 'default' | 'lg'` → `icon-xs | icon-sm | icon | icon-lg`; default `variant="ghost"`
- `Pagination`: markup shadcn + export helper `getPageItems(page, pageCount, siblingCount)` (logic เดิม)
- `PageHeader`, `ErrorState` (`Alert variant="destructive"` + ปุ่ม retry), `PdfPreview` (`fetcher`, `getErrorMessage`, `height`, `actions`) — props เดิม, class ตาม poc
- `BomUIProvider` — เหมือนเดิม
- RHF* — โค้ด poc เกือบทั้งหมด (class Tailwind เดิม) ต่างแค่ import, ข้อความ/locale จาก `BomUIProvider`, ใช้ `useFieldIds`; `RHFSelect size` = `'sm' | 'default'`

### ลบ / เปลี่ยน (breaking)

| เดิม | ใหม่ |
|---|---|
| `variant="primary"` / `"danger"` | `"default"` / `"destructive"` |
| `size="md"` | `"default"` |
| `Badge` `info/success/warning/danger/primary` | shadcn: `default/secondary/destructive/outline/ghost/link` |
| `Alert` `info/success/warning/danger` | `default/destructive` |
| `Pagination` (controlled `page/pageCount/onPageChange`) | markup shadcn + `getPageItems()` |
| `EmptyState` | `Empty` family |
| `Input`/`SelectTrigger` `size="sm\|md\|lg"` | ตาม shadcn (`SelectTrigger size="sm\|default"`, `Input` ไม่มี size) |
| `Switch size="md"` | `"default"` |
| class `bom-*`, token `--bom-*`, `@bomtawep/ui/styles.css`, `data-theme` | class Tailwind, ตัวแปร shadcn (`--primary` …), `theme.css`, `.dark` |

## 3. Testing / Storybook / CI

- Test เดิมคงพฤติกรรม, keyboard, axe; class assertion เปลี่ยนเป็น `data-slot` / `data-variant` / `data-size`; เลิกทดสอบ forwardRef/displayName (ยังทดสอบ ref ถึง DOM)
- Storybook: `viteFinal` เพิ่ม `@tailwindcss/vite`; `.storybook/tailwind.css` = `@import "tailwindcss"; @import "../src/styles/theme.css"; @source "../src";`; toolbar theme สลับ class `.dark`
- CI: ลบขั้น `check-css.sh`
- อัปเดต rule `.claude/rules/01`, `02`, `CLAUDE.md` ให้ตรงสถาปัตยกรรมใหม่ (Tailwind, React 19, ไม่มี forwardRef)

## 4. Release

- `1.0.0` — CHANGELOG มีส่วน **Migration** (ตารางข้างบน + ขั้นตอนตั้ง Tailwind) ; README เขียนใหม่
- Smoke test: Next 16 + Tailwind v4 (scratch copy ของ test-bom-ui) — Server Component, ฟอร์ม RHF, dark mode
- Claude ไม่ commit / release เอง (rule 07)
