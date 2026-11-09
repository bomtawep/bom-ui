# @bomtawep/ui

React component library สำหรับ Next.js (App Router / Pages Router) — เผยแพร่ผ่าน GitHub Packages

## ติดตั้ง (Yarn 4)

1. เพิ่มใน `.yarnrc.yml` ที่ root ของโปรเจกต์:

   ```yaml
   npmScopes:
     bomtawep:
       npmRegistryServer: "https://npm.pkg.github.com"
       npmAuthToken: "${NPM_TOKEN:-}"
       npmAlwaysAuth: true
       npmMinimalAgeGate: 0
   ```

2. ตั้ง `NPM_TOKEN` เป็น GitHub Personal Access Token (classic) ที่มีสิทธิ์ `read:packages`

   ```bash
   export NPM_TOKEN=<token>
   ```

3. ติดตั้ง (`react-hook-form` เป็น peerDependency ตั้งแต่ 0.2.0)

   ```bash
   yarn add @bomtawep/ui react-hook-form
   ```

ใช้ npm หรือ Yarn 1? ใช้ `.npmrc` แทน — ดู [.claude/rules/05-consumer-setup.md](.claude/rules/05-consumer-setup.md)

## ใช้งาน

```tsx
// app/layout.tsx
import '@bomtawep/ui/styles.css'
import { BomUIProvider, Toaster } from '@bomtawep/ui'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        <BomUIProvider>{children}</BomUIProvider>
        <Toaster />
      </body>
    </html>
  )
}
```

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle } from '@bomtawep/ui'

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ใบแจ้งหนี้</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>ชำระเงิน</Button>
      </CardContent>
    </Card>
  )
}
```

ดูตัวอย่างทุก component ได้ใน Storybook (`yarn storybook`)

### Components

| กลุ่ม | Component |
|---|---|
| Primitives | `Button` (`loading`, `asChild`), `IconButton`, `ButtonGroup`, `Badge`, `Spinner`, `Kbd`, `Avatar`, `Card`, `Separator`, `Skeleton` |
| Form | `Label`, `Input`, `Textarea`, `Checkbox`, `RadioGroup`, `Switch`, `Select`, `InputGroup`, `InputOTP`, `Calendar`, `Field` (+`FieldSet`, `FieldLegend`, `FieldGroup`, `FieldLabel`, `FieldDescription`, `FieldError`, …) |
| Overlay | `Dialog`, `AlertDialog`, `Sheet`, `Popover`, `Tooltip`, `DropdownMenu`, `Toaster` + `toast()` |
| Navigation & data | `Tabs`, `Accordion`, `Breadcrumb`, `Pagination`, `Table`, `Alert` |
| App | `PageHeader`, `EmptyState`, `ErrorState`, `PdfPreview`, `Sidebar` (+`SidebarProvider`, `useSidebar`, …) |
| react-hook-form | `FormProvider`, `RHFInput`, `RHFInputGroup`, `RHFTextArea`, `RHFSelect`, `RHFCheckbox`, `RHFRadioGroup`, `RHFSwitch`, `RHFInputOTP`, `RHFDatePicker`, `RHFDateRangePicker` |

ทุก component รับ `className` (ต่อท้าย class ของ library) และ `ref` · sub-component เป็นชื่อแบน เช่น `DialogContent` (ไม่ใช่ `Dialog.Content`)

### ภาษา / locale — `BomUIProvider`

ค่าเริ่มต้นเป็นภาษาไทย ปี พ.ศ. ใช้ได้โดยไม่ต้องครอบ provider ถ้าต้องการเปลี่ยน:

```tsx
import { enUS } from 'react-day-picker/locale'

<BomUIProvider locale={enUS} messages={{ datePickerPlaceholder: 'Pick a date', retry: 'Retry' }}>
  {children}
</BomUIProvider>
```

- `locale` — locale จาก `react-day-picker/locale` ใช้กับ `Calendar` และ date picker ทุกตัว
- `messages` — ข้อความ UI ทุกตัว (`BomUIMessages`) ส่งเฉพาะที่ต้องการเปลี่ยน ที่เหลือใช้ค่าไทยจาก `defaultMessages`
- prop ของ component (เช่น `placeholder`, `locale`) ชนะค่าจาก provider เสมอ

### ฟอร์มด้วย react-hook-form + zod

```tsx
'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button, FieldGroup, FormProvider, RHFDatePicker, RHFInput, RHFSelect } from '@bomtawep/ui'

const schema = z.object({
  name: z.string().min(1, 'กรอกชื่อ'),
  province: z.string().min(1, 'เลือกจังหวัด'),
  start: z.date({ error: 'เลือกวันที่' }),
})

export function ProfileForm() {
  const methods = useForm({ resolver: zodResolver(schema), defaultValues: { name: '', province: '', start: undefined } })
  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit((values) => console.log(values))}>
      <FieldGroup>
        <RHFInput name="name" label="ชื่อ" required />
        <RHFSelect name="province" label="จังหวัด" options={[{ value: 'bkk', label: 'กรุงเทพฯ' }]} />
        <RHFDatePicker name="start" label="วันเริ่มงาน" variant="input" />
        <Button type="submit">บันทึก</Button>
      </FieldGroup>
    </FormProvider>
  )
}
```

RHF* ทุกตัวผูก label, คำอธิบาย และ error ให้ screen reader อ่านอัตโนมัติ (`aria-describedby`, `aria-invalid`) — `label` จำเป็นเสมอ ซ่อนด้วย `hideLabel` ได้ · `FormProvider` ชื่อเดียวกับของ react-hook-form ถ้า import ทั้งสองในไฟล์เดียวให้ตั้ง alias

### Sidebar — จำสถานะพับ/กาง

`SidebarProvider` เขียน cookie `sidebar_state` ทุกครั้งที่เปลี่ยน อ่านกลับฝั่ง server แล้วส่งเป็น `defaultOpen`:

```tsx
// app/(app)/layout.tsx — Server Component
import { cookies } from 'next/headers'
import { SidebarProvider } from '@bomtawep/ui'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const defaultOpen = (await cookies()).get('sidebar_state')?.value !== 'false'
  return <SidebarProvider defaultOpen={defaultOpen}>{children}</SidebarProvider>
}
```

ลิงก์ในเมนูใช้ `asChild` กับ `next/link`: `<SidebarMenuButton asChild><Link href="/docs">Docs</Link></SidebarMenuButton>`

### ย้ายมาจาก shadcn/ui

| shadcn | @bomtawep/ui |
|---|---|
| `variant="default"` / `"outline"` / `"secondary"` | `primary` / `secondary` / `secondary` |
| `variant="destructive"` | `danger` |
| `variant="link"` | ไม่มี — ใช้ `ghost` หรือ `<a>` |
| `size="default"` | `md` |
| `size="icon"` / `"icon-sm"` | `<IconButton aria-label="…" size="md" \| "sm">` |
| `import { toast } from "sonner"` | `import { toast } from '@bomtawep/ui'` |
| class Tailwind ใน component | ไม่ใช้ — ปรับหน้าตาด้วย `--bom-*` หรือ `className` ของคุณเอง |

## ธีม

ทุกสีและขนาดเป็น CSS variable `--bom-*` override ได้ใน CSS ของโปรเจกต์:

```css
:root {
  --bom-color-primary: #7c3aed;
  --bom-color-primary-hover: #6d28d9;
  --bom-radius-md: 0.75rem;
}
```

ตัวแปรที่ใช้บ่อย: `--bom-color-surface` (พื้น card/popover/dialog), `--bom-color-accent` (hover ของเมนู), `--bom-color-overlay` (พื้นหลัง dialog), `--bom-color-input` (กรอบช่องกรอก), `--bom-color-sidebar*`, `--bom-sidebar-width`, `--bom-control-height-sm|md|lg` — ดูทั้งหมดใน `src/styles/tokens.css`

ค่าเริ่มต้นเป็น light เสมอ เปิด dark mode ด้วย `<html data-theme="dark">` หรือให้ตามระบบปฏิบัติการด้วย `<html data-theme="system">` (`data-theme="light"` บังคับ light)

ถ้าใช้ next-themes ต้องตั้ง `attribute="data-theme"` (ค่าเริ่มต้น `attribute="class"` ใช้กับ tokens นี้ไม่ได้):

```tsx
<ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

ใช้ได้ทั้งใน Server Component และ Client Component (bundle มี `'use client'` อยู่แล้ว)

CI / Docker: ดู [.claude/rules/05-consumer-setup.md](.claude/rules/05-consumer-setup.md)

## พัฒนา

```bash
nvm use          # Node 22 (.nvmrc)
yarn install
yarn dev         # tsup --watch
yarn test        # vitest
yarn storybook   # http://localhost:6006
yarn typecheck
yarn build
```

repo นี้ pin Yarn 4.18.1 ไว้ใน `.yarn/releases` — `yarn` ตัวไหนก็ได้ (รวม 1.x) จะถูกส่งต่อไปเวอร์ชันนั้นเอง

ทดสอบกับโปรเจกต์จริง: `yarn link ../bom-ui` ในโปรเจกต์ปลายทาง

## ออกเวอร์ชัน

```bash
yarn release patch   # หรือ minor / major / prerelease
git push --follow-tags
```

GitHub Actions จะ build และ publish ให้อัตโนมัติเมื่อมี tag `v*` — รายละเอียดใน [.claude/rules/03-versioning-release.md](.claude/rules/03-versioning-release.md)
