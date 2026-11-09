# Port components จาก poc-dof-pps — `@bomtawep/ui` 0.2.0

- วันที่: 2026-11-09
- สถานะ: อนุมัติแล้ว (brainstorming) — รอผู้ใช้ review spec
- เวอร์ชันปัจจุบัน: 0.1.7 (มี `Button` + Phase 1 Foundation)
- ต้นทาง: `gitlab.finema.co/team/poc-dof-pps` → `frontend/src/components/{ui,hook-form}` + `page-header`, `error-state`, `simple-pagination`, `pdf-preview`
- แทนที่: ช่วง 2–5 ใน [2026-11-05-component-library-design.md](2026-11-05-component-library-design.md) (ทำรวมใน release เดียว) และยกเลิกข้อ "นอกขอบเขต" เรื่อง DatePicker / form-library integration

## เป้าหมาย

นำ component `ui/` (shadcn + Tailwind) และ `hook-form/` (RHF wrappers) จาก poc มาเป็น base components ของ library **ใน release เดียว (0.2.0)** โดยเขียนใหม่ตามแนวทางของ bom-ui: plain CSS + `--bom-*`, `forwardRef`, named export — แต่คง API (ชื่อ component, composition, props ของ RHF*) และงาน a11y ของ poc ไว้ เพื่อให้โค้ด poc ย้ายมาใช้ได้ด้วยการเปลี่ยน import เป็นหลัก

## การตัดสินใจหลัก

| เรื่อง | เลือก | เหตุผล |
|---|---|---|
| แนวทาง port | เขียนใหม่ตาม convention bom-ui คง API/a11y ของ poc | spec เดิมเลือก plain CSS — ปลายทางไม่ต้องมี Tailwind; โค้ด poc ย้ายง่าย |
| แบ่งงาน | release เดียว 0.2.0 | ผู้ใช้เลือก |
| hook-form | อยู่ใน entry หลัก `@bomtawep/ui` | ผู้ใช้เลือก — `react-hook-form` เป็น peer บังคับ |
| Toast | `sonner` (re-export `toast`) | API เหมือน poc ไม่ต้องเขียน store เอง |
| Icons | inline SVG ภายใน ไม่ใช้ `lucide-react` | ไม่บังคับ dependency ไอคอนให้ปลายทาง |
| ภาษา / locale | `BomUIProvider` ค่าเริ่มต้นไทย + พ.ศ. | ตั้งครั้งเดียวที่ root; override ต่อ component ผ่าน props ได้ |

## 1. สถาปัตยกรรม

### Dependencies

| ประเภท | แพ็กเกจ |
|---|---|
| `peerDependencies` | `react >=18`, `react-dom >=18`, `react-hook-form ^7.55.0` (ใหม่ — บังคับ) |
| `dependencies` (pin exact `yarn add -E`) | `radix-ui`, `react-day-picker` (ได้ `date-fns` มาด้วย), `input-otp`, `sonner` |
| `devDependencies` เพิ่ม | `react-hook-form` (pin), `zod` + `@hookform/resolvers` (เฉพาะ test/story) |

- tsup externalize `dependencies` + `peerDependencies` ให้อัตโนมัติ — เพิ่ม `react-hook-form` ใน `external` ของ `tsup.config.ts` ให้ชัด
- ห้าม import `next/*` — Sidebar ใช้ `<a>` / `asChild` ให้ปลายทางใส่ `next/link` เอง
- เลือกเวอร์ชันที่ publish มาเกิน 1 วัน (age gate ของ Yarn 4.18)

### Helper ภายใน (`src/lib/`, ไม่ export)

| ไฟล์ | หน้าที่ |
|---|---|
| `cn.ts` | มีอยู่แล้ว |
| `icons.tsx` | `CheckIcon`, `ChevronDown/Left/Right/UpIcon`, `XIcon`, `CalendarIcon`, `CircleIcon`, `MinusIcon`, `MoreHorizontalIcon`, `PanelLeftIcon`, `AlertCircleIcon`, `FileWarningIcon`, `RefreshIcon`, `ExternalLinkIcon` — SVG `aria-hidden`, `stroke="currentColor"` |
| `date.ts` | ย้ายจาก `hook-form/date-utils.ts`: `isValidDate`, `sameDate`, `formatDateDisplay`, `formatDateInput`, `parseDateInput`, `calendarLocaleProps` |
| `use-transient-state.ts` | ย้ายจาก poc (popover ไม่ค้างเปิดเมื่อหน้าถูกซ่อนด้วย `<Activity>`) |
| `use-field-ids.ts` | `useFieldIds(prefix, name, { description, invalid })` → `{ fieldId, labelId, descriptionId, errorId, describedBy }` ใช้ร่วมทุก RHF* แทนโค้ดซ้ำในแต่ละไฟล์ |
| `use-is-mobile.ts` | `matchMedia` ใน effect (ค่าเริ่มต้น `false` ตอน SSR) สำหรับ Sidebar |

### `BomUIProvider`

```tsx
<BomUIProvider locale={enUS} messages={{ datePickerPlaceholder: 'Pick a date' }}>
```

- props: `locale?: DayPickerLocale` (ค่าเริ่มต้น `th` จาก `react-day-picker/locale`), `messages?: Partial<BomUIMessages>`, `children`
- export `BomUIProvider`, `type BomUIMessages`, `type BomUIProviderProps`, `defaultMessages` (ไทย)
- ไม่ครอบ provider ก็ใช้งานได้ (context default = ไทย) — component อ่านผ่าน `useBomUI()` ภายใน
- ลำดับความสำคัญ: prop ของ component > `messages` ของ provider > `defaultMessages`
- `BomUIMessages` รวมทุกข้อความที่ hardcode ใน poc เช่น `required` ("จำเป็น"), `datePickerPlaceholder` ("เลือกวันที่"), `dateInputPlaceholder` ("วว/ดด/ปปปป"), `openCalendar` ("เปิดปฏิทิน"), `time` ("เวลา"), `previousPage` / `nextPage`, `pageSummary(from, to, total)`, `pageOf(page, total)`, `close` ("ปิด"), `toggleSidebar`, `loading`, `errorTitle` ("โหลดข้อมูลไม่สำเร็จ"), `retry` ("ลองใหม่"), `pdfRegenerate`, `pdfOpenNewTab`, `pdfFailed`, `breadcrumbMore`, `selectPlaceholder`

## 2. รายการ component

### ข้อตกลง API (เพิ่มจาก spec เดิม)

- ทุกตัว `forwardRef` + `displayName`, รับ `className` + `...props` (ยกเว้น RHF* ซึ่งเป็น generic function component — ไม่ forwardRef เพราะ ref ไปที่ `field.ref` ของ RHF)
- composition และชื่อ sub-component ตาม poc (shadcn) เป็นชื่อแบน
- แปลงชื่อ variant/size จาก poc:

| poc | bom-ui |
|---|---|
| `variant="default"` / `"outline"` / `"secondary"` | `primary` / `secondary` / `secondary` |
| `variant="destructive"` | `danger` |
| `variant="ghost"`, `"link"` | `ghost` (ไม่มี `link`) |
| `size="default" \| "sm" \| "lg"` | `md \| sm \| lg` |
| `size="icon*"` | `IconButton` + `size` |
| `asChild` | รองรับใน `Button`, `IconButton`, `BreadcrumbLink`, `SidebarMenuButton` ฯลฯ ผ่าน Radix `Slot` |

- `data-slot` ของ shadcn ไม่ใช้ — ใช้ class `bom-<name>__<part>` แทน (เช่น `bom-field__label`) ไว้ใน CSS ไฟล์เดียวของ component
- state ใช้ attribute: Radix `[data-state]`, `[data-disabled]`, และ `[aria-invalid="true"]` / `[data-invalid]` สำหรับ error

### รายการ (1 บรรทัด = 1 โฟลเดอร์ใน `src/components/`)

**Primitives**
- `Button` — เพิ่ม `loading` (แสดง `Spinner`, `aria-busy`, disabled) และ `asChild`; variant เดิมทั้งหมดรวม `sparkle` ยังอยู่
- `IconButton` — `aria-label` บังคับใน type, `variant`, `size`, `asChild`
- `ButtonGroup` + `ButtonGroupText`, `ButtonGroupSeparator` — `orientation`
- `Badge` — `variant: 'primary' | 'secondary' | 'outline' | 'info' | 'success' | 'warning' | 'danger'`, `asChild`
- `Spinner` — `size`, `role="status"` + `aria-label` จาก messages
- `Kbd` + `KbdGroup`
- `Avatar` + `AvatarImage`, `AvatarFallback`
- `Card` + `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`
- `Separator` — `orientation`, `decorative`
- `Skeleton`

**Form controls**
- `Label`
- `Input`, `Textarea` — `size?: 'sm' | 'md' | 'lg'`
- `Checkbox` (รองรับ `checked="indeterminate"`), `RadioGroup` + `RadioGroupItem`, `Switch` (`size: 'sm' | 'md'`)
- `Select` + `SelectTrigger` (`size`), `SelectValue`, `SelectContent` (`position`), `SelectItem`, `SelectGroup`, `SelectLabel`, `SelectSeparator`, `SelectScrollUpButton`, `SelectScrollDownButton`
- `InputGroup` + `InputGroupAddon` (`align: inline-start | inline-end | block-start | block-end`), `InputGroupButton`, `InputGroupText`, `InputGroupInput`, `InputGroupTextarea`
- `InputOTP` + `InputOTPGroup`, `InputOTPSlot`, `InputOTPSeparator` (จาก `input-otp`)
- `Calendar` — wrapper ของ `DayPicker` ใส่ `calendarLocaleProps(locale)` จาก provider ให้อัตโนมัติ (ปี พ.ศ. ใน caption, dropdown และ aria-label ของวัน), class ทั้งหมดผ่าน `classNames` prop เป็น `bom-calendar__*`
- `Field` + `FieldSet`, `FieldLegend` (`variant: legend | label`), `FieldGroup`, `FieldContent`, `FieldLabel`, `FieldTitle`, `FieldDescription`, `FieldSeparator`, `FieldError` (`errors?: Array<{ message?: string } | undefined>` — หลาย error แสดงเป็น list, ซ้ำตัดออก) — `Field` มี `orientation: vertical | horizontal | responsive` (`responsive` ใช้ container query)

**Overlay**
- `Dialog` + `DialogTrigger`, `DialogPortal`, `DialogOverlay`, `DialogContent` (`showCloseButton`), `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `DialogClose`
- `AlertDialog` + ชุดเดียวกับ Dialog + `AlertDialogAction`, `AlertDialogCancel`
- `Sheet` + ชุดเดียวกับ Dialog, `SheetContent` มี `side: top | right | bottom | left`
- `Popover` + `PopoverTrigger`, `PopoverAnchor`, `PopoverContent`, `PopoverClose`
- `Tooltip` + `TooltipProvider`, `TooltipTrigger`, `TooltipContent` (`Tooltip` ครอบ provider ให้เองเหมือน poc)
- `DropdownMenu` + `Trigger`, `Content`, `Group`, `Label`, `Item` (`variant: default | danger`, `inset`), `CheckboxItem`, `RadioGroup`, `RadioItem`, `Separator`, `Shortcut`, `Sub`, `SubTrigger`, `SubContent`, `Portal`
- `Toaster` (props ของ sonner, style ด้วย tokens, รับ `theme` ตาม `data-theme`) + re-export `toast` จาก `sonner`

**Navigation / data display**
- `Tabs` + `TabsList`, `TabsTrigger`, `TabsContent`
- `Accordion` + `AccordionItem`, `AccordionTrigger`, `AccordionContent`
- `Breadcrumb` + `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink` (`asChild`), `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`
- `Pagination` — controlled `page`, `pageCount`, `onPageChange`, `siblingCount = 1`; `variant: 'full' | 'simple'` — `simple` = ปุ่มก่อน/ถัดไป + "หน้า X / Y" และถ้าส่ง `total` + `pageSize` จะแสดง "1–10 จาก 120 รายการ" (แทน `SimplePagination` ของ poc โดยไม่ผูก `PageMeta`) ห่อด้วย `<nav aria-label>`, หน้าปัจจุบัน `aria-current="page"`
- `Table` + `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption` (container scroll แนวนอน)
- `Alert` + `AlertTitle`, `AlertDescription`, `AlertAction` — `variant: 'default' | 'info' | 'success' | 'warning' | 'danger'`; `danger` ใช้ `role="alert"` อื่นใช้ `role="status"`

**App-level**
- `PageHeader` — `title`, `description?`, `actions?`, `headingLevel?: 1 | 2` (ค่าเริ่มต้น `h1`)
- `EmptyState` — `icon?`, `title`, `description?`, `action?`
- `ErrorState` — `message?: ReactNode`, `title?`, `onRetry?` สร้างจาก `Alert variant="danger"` (ไม่ผูก `errorMessage()` ของ poc — ปลายทางแปลง error เป็นข้อความเอง)
- `PdfPreview` — `url`, `title`, `fetcher?: (url) => Promise<Blob>` (ค่าเริ่มต้น `fetch` + throw เมื่อ `!res.ok` โดยอ่าน `error.message` จาก JSON ถ้ามี), `getErrorMessage?: (error: unknown) => ReactNode`, `height?` (ค่าเริ่มต้น `70vh`), `actions?: boolean` (ปุ่มสร้างใหม่/เปิดแท็บใหม่) — revoke blob URL ตอน unmount
- `Sidebar` — ครบชุดตาม poc: `SidebarProvider` (`defaultOpen`, `open`, `onOpenChange`, cookie `sidebar_state` เขียนใน handler), `useSidebar`, `Sidebar` (`side`, `variant: sidebar | floating | inset`, `collapsible: offcanvas | icon | none`), `SidebarTrigger`, `SidebarRail`, `SidebarInset`, `SidebarInput`, `SidebarHeader`, `SidebarFooter`, `SidebarSeparator`, `SidebarContent`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarGroupAction`, `SidebarGroupContent`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton` (`isActive`, `tooltip`, `size`, `asChild`), `SidebarMenuAction`, `SidebarMenuBadge`, `SidebarMenuSkeleton`, `SidebarMenuSub`, `SidebarMenuSubItem`, `SidebarMenuSubButton` — mobile ใช้ `Sheet`, คีย์ลัด Ctrl/⌘+B; ความกว้างจาก token `--bom-sidebar-width*`

**Hook-form** (โฟลเดอร์ `src/components/HookForm/` — โฟลเดอร์เดียว เพราะเป็นชุดเดียวกันและไม่มี CSS ของตัวเอง ใช้ CSS ของ `Field`/control)
- `FormProvider` — `methods`, `onSubmit?`, `children`, + props ของ `<form>` (`className`, `id`) ใส่ `noValidate`
- `RHFInput`, `RHFInputGroup`, `RHFTextArea`, `RHFSelect`, `RHFCheckbox`, `RHFRadioGroup`, `RHFSwitch`, `RHFInputOTP`, `RHFDatePicker`, `RHFDateRangePicker`
- types: `RHFSelectOption`, `RHFSelectGroup`, `RHFRadioOption`, `RHFCheckboxOption`, `RHFInputGroupAddon`, `RHFInputGroupControlProps`, `RHFInputGroupSlot`, `DateRange`
- **props เหมือน poc ทุกตัว** ยกเว้น: `size` ใช้ scale ของเรา, ข้อความ default มาจาก `BomUIProvider`, `locale` default มาจาก provider, `*ClassName` props ยังรับได้ (ใช้ class ของปลายทาง)
- พฤติกรรมที่ต้องคงไว้ (มี test): id ไม่ชนด้วย `useId`; `aria-describedby` = description + error; `*` ของ required `aria-hidden` (ปุ่มที่ประกาศ required ไม่ได้ มี `(จำเป็น)` แบบ sr-only); `type="file"` เก็บ `File[]` และล้างเมื่อ reset; Select ไม่มีค่า = `""` แสดง placeholder, blur ตอนปิด; DatePicker `variant="input"` พิมพ์ได้ ปี พ.ศ.→ค.ศ., Invalid Date ส่งต่อให้ schema แจ้ง error, ArrowDown เปิดปฏิทิน, ปิดแล้ว focus กลับช่องพิมพ์; `showTime`; popover ใช้ `useTransientState`

### ไม่ port

- `layout/*` (`app-sidebar`, `app-header`, `user-menu`, `nav.ts`, `page-guard`) และ `providers/query-provider` — ผูกกับแอป poc (auth, route, TanStack Query)
- `next-themes` — library ใช้ `data-theme` ของตัวเองอยู่แล้ว

## 3. Styling & tokens

- CSS ต่อ component: `src/components/<Name>/<Name>.css` (ตามกฎ `bundleCss`) — `HookForm/` ไม่มี CSS
- เพิ่ม token ใน `src/styles/tokens.css` (ครบทั้ง light, `[data-theme='dark']`, `[data-theme='system']`):
  - สี: `--bom-color-surface` (card/popover/dialog bg), `--bom-color-surface-fg`, `--bom-color-accent` + `--bom-color-accent-fg` (hover ของ menu/item), `--bom-color-overlay` (backdrop), `--bom-color-input` (border ของช่อง), `--bom-color-success-fg`, `--bom-color-warning-fg`, `--bom-color-info-fg`, `--bom-color-sidebar`, `--bom-color-sidebar-fg`, `--bom-color-sidebar-border`, `--bom-color-sidebar-accent`
  - ขนาด: `--bom-space-5`, `--bom-space-8`, `--bom-space-10`, `--bom-font-size-xs`, `--bom-font-size-xl`, `--bom-font-size-2xl`, `--bom-font-weight-semibold`, `--bom-shadow-lg`, `--bom-radius-xl`, `--bom-control-height-sm|md|lg` (ปุ่ม/ช่องสูงเท่ากัน)
  - อื่น ๆ: `--bom-duration-normal`, `--bom-z-overlay`, `--bom-z-popover`, `--bom-z-toast`, `--bom-sidebar-width`, `--bom-sidebar-width-mobile`, `--bom-sidebar-width-icon`
- token เดิมไม่เปลี่ยนชื่อ/ค่า (Button หน้าตาเดิม)
- animation เปิด/ปิด overlay ใช้ `@keyframes bom-*` + `[data-state]` และปิดเมื่อ `prefers-reduced-motion: reduce`
- utility class ภายในที่ใช้ร่วม: `.bom-sr-only` (อยู่ใน `tokens.css` เพราะทุก component ใช้)
- `scripts/check-css.sh` ต้องผ่าน (ไม่มีสี hardcode นอก tokens)

## 4. Testing, Storybook, CI

- ทุก component ทำตาม Definition of Done ใน spec เดิม (render, class ของ variant/size, ref forward, axe, keyboard test สำหรับตัว interactive)
- RHF*: test ด้วย `useForm` + `zodResolver` — ค่าเปลี่ยนเข้าฟอร์ม, error แสดงและผูก `aria-describedby`, `required`, disabled, reset ล้างค่า, และพฤติกรรมเฉพาะในหัวข้อ Hook-form ข้างบน
- `BomUIProvider`: test ว่า prop > provider > default และ `locale={enUS}` เปลี่ยนปีใน Calendar
- `src/lib/date.ts`: unit test `parseDateInput` (พ.ศ., ค.ศ., ISO, 31/02 → Invalid, ว่าง → undefined)
- polyfill เพิ่มใน `src/test-utils/setup.ts` ถ้าจำเป็น (`matchMedia`, `PointerEvent`)
- Story ทุก component; RHF* มี story ฟอร์มรวม + ปุ่ม submit แสดงค่า; Storybook toolbar เพิ่มตัวเลือก locale (th / en)
- CI ไม่เปลี่ยนลำดับ — แค่ต้องผ่านทั้งหมด

## 5. Release

- branch `feat/port-poc-components` → PR → CI ผ่าน → merge
- `0.1.7 → 0.2.0` (minor บน 0.x): API เดิมไม่เปลี่ยน แต่มี peer ใหม่ `react-hook-form` — ระบุชัดใน CHANGELOG ส่วน **Changed** + วิธีติดตั้ง
- อัปเดต README: รายการ component, `BomUIProvider`, ตัวอย่าง RHF + zod, ตารางแปลงชื่อ variant จาก shadcn
- อัปเดต spec เดิม: ระบุว่าช่วง 2–5 ถูกแทนด้วย spec นี้
- Smoke test: `yarn pack` → ติดตั้งในแอป Next App Router (เช่น `test-bom-ui`) → import ใน Server Component, ฟอร์ม RHF + DatePicker ทำงาน, dark mode, ไม่มี hydration warning
- Claude ไม่ commit / release เอง (rule 07)

## ความเสี่ยง

| ความเสี่ยง | การรับมือ |
|---|---|
| PR ใหญ่มาก (~45 โฟลเดอร์) review ยาก | plan แบ่ง task ตามกลุ่ม (tokens/lib → primitives → form → overlay → data → app-level → hook-form → docs) ตรวจ `yarn test` + `check-css` จบทุก task |
| `react-day-picker` v10 ใช้ classNames ต่างจาก v9 | อ้าง `UI`/`DayFlag` enum ของ react-day-picker แทน string ตรง ๆ |
| `react-hook-form` เป็น peer บังคับ — consumer ที่ไม่ใช้ฟอร์มต้องติดตั้ง | ยอมรับตามการตัดสินใจ; ถ้าภายหลังต้องการแยก ทำ entry `@bomtawep/ui/hook-form` ใน major ถัดไป |
| Sidebar ต้องไม่อ่าน cookie/`window` ระหว่าง render | `defaultOpen` มาจากปลายทาง (อ่าน cookie ฝั่ง server เอง), `useIsMobile` เริ่มที่ `false` |
