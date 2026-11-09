# Changelog

## [Unreleased]

### Added
- Components จาก poc-dof-pps (เขียนใหม่ด้วย plain CSS `--bom-*`):
  - Primitives: `IconButton`, `ButtonGroup`, `Badge`, `Spinner`, `Kbd`, `Avatar`, `Card`, `Separator`, `Skeleton`
  - Form: `Label`, `Input`, `Textarea`, `Checkbox`, `RadioGroup`, `Switch`, `Select`, `InputGroup`, `InputOTP`, `Calendar`, `Field` family
  - Overlay: `Dialog`, `AlertDialog`, `Sheet`, `Popover`, `Tooltip`, `DropdownMenu`, `Toaster` + `toast()`
  - Navigation & data: `Tabs`, `Accordion`, `Breadcrumb`, `Pagination`, `Table`, `Alert`
  - App: `PageHeader`, `EmptyState`, `ErrorState`, `PdfPreview` (+`defaultPdfFetcher`), `Sidebar` family + `useSidebar`
  - react-hook-form: `FormProvider`, `RHFInput`, `RHFInputGroup`, `RHFTextArea`, `RHFSelect`, `RHFCheckbox`, `RHFRadioGroup`, `RHFSwitch`, `RHFInputOTP`, `RHFDatePicker`, `RHFDateRangePicker`
- `BomUIProvider` (`locale`, `messages`) + `defaultMessages` — ค่าเริ่มต้นภาษาไทย ปี พ.ศ.
- `Button`: prop `loading` (spinner + `aria-busy` + disabled) และ `asChild`
- Design tokens ใหม่: `--bom-color-surface*`, `--bom-color-accent*`, `--bom-color-overlay`, `--bom-color-input`, `--bom-color-{success,warning,info}-fg`, `--bom-color-sidebar*`, `--bom-control-height-*`, `--bom-z-*`, `--bom-sidebar-width*`, ขนาด font/space/radius/shadow เพิ่ม และ class `.bom-sr-only`

### Changed
- **peerDependency ใหม่: `react-hook-form ^7.55.0`** — โปรเจกต์ปลายทางต้องติดตั้งเพิ่ม (`yarn add react-hook-form`) แม้ไม่ได้ใช้ฟอร์ม
- dependencies ใหม่: `radix-ui`, `react-day-picker`, `input-otp`, `sonner`
- token เดิมไม่เปลี่ยนชื่อ/ค่า — หน้าตา `Button` เหมือนเดิม

## [0.1.0] - 2026-11-05

### Added
- `Button` component (`primary` / `secondary` variants)
- `@bomtawep/ui/styles.css`
- Build ด้วย tsup (ESM + CJS + types), publish ไป GitHub Packages เมื่อ push tag `v*`
