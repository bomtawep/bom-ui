# @bomtawep/ui

React component library สำหรับ Next.js (App Router / Pages Router) — **โค้ด [shadcn/ui](https://ui.shadcn.com) (style `radix-nova`) บน Tailwind CSS v4** เผยแพร่ผ่าน GitHub Packages ติดตั้งแบบ semver ได้ (`^1.0.0`)

## ต้องมี

- React 19 / Next.js 15+
- **Tailwind CSS v4** ในโปรเจกต์ปลายทาง
- `react-hook-form` (peer — ใช้กับ RHF* components)

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

3. ติดตั้ง

   ```bash
   yarn add @bomtawep/ui react-hook-form
   ```

ใช้ npm หรือ Yarn 1? ใช้ `.npmrc` แทน — ดู [.claude/rules/05-consumer-setup.md](.claude/rules/05-consumer-setup.md)

## ตั้งค่า Tailwind

```css
/* app/globals.css */
@import "tailwindcss";
@import "@bomtawep/ui/theme.css";
```

`theme.css` = theme ของ shadcn (neutral, ตัวแปร `--primary`, `--radius`, … ทั้ง light / `.dark`) + custom variants ที่ component ใช้ + `@source` ให้ Tailwind สแกน class ของ library

**มี theme shadcn ของตัวเองอยู่แล้ว?** ใช้ `source.css` แทน — ได้แค่ `@source` และใช้สีของโปรเจกต์คุณ (ต้องมี custom variants ของ shadcn เช่นจาก `@import "shadcn/tailwind.css"`):

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@bomtawep/ui/source.css";
/* …:root / .dark ของคุณ… */
```

### Dark mode

ใส่ class `dark` ที่ `<html>` แบบ shadcn — ถ้าใช้ next-themes:

```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

### เปลี่ยนสี

override ตัวแปร shadcn หลัง import:

```css
:root {
  --primary: oklch(0.55 0.22 293);
  --radius: 0.75rem;
}
```

ใช้ [shadcn themes](https://ui.shadcn.com/themes) แล้ว copy `:root` / `.dark` มาวางได้เลย

## ใช้งาน

```tsx
// app/layout.tsx
import './globals.css'
import { BomUIProvider, Toaster, TooltipProvider } from '@bomtawep/ui'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body>
        <BomUIProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </BomUIProvider>
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
        <Button variant="outline">ชำระเงิน</Button>
      </CardContent>
    </Card>
  )
}
```

API ตามเอกสาร shadcn ทุกประการ — snippet จาก [ui.shadcn.com](https://ui.shadcn.com/docs/components) ใช้ได้โดยเปลี่ยน import เป็น `@bomtawep/ui` · ดูตัวอย่างทั้งหมดใน Storybook (`yarn storybook`)

### Components

| กลุ่ม | Component |
|---|---|
| Primitives | `Button`, `ButtonGroup`, `Badge`, `Spinner`, `Kbd`, `Avatar`, `Card`, `Separator`, `Skeleton` |
| Form | `Label`, `Input`, `Textarea`, `Checkbox`, `RadioGroup`, `Switch`, `Select`, `InputGroup`, `InputOTP`, `Calendar`, `Field` (+`FieldSet`, `FieldLegend`, `FieldGroup`, `FieldLabel`, `FieldDescription`, `FieldError`, …) |
| Overlay | `Dialog`, `AlertDialog`, `Sheet`, `Popover`, `Tooltip` (+`TooltipProvider`), `DropdownMenu`, `Toaster` + `toast()` |
| Navigation & data | `Tabs`, `Accordion`, `Breadcrumb`, `Pagination`, `Table`, `Alert`, `Empty` |
| App | `Sidebar` (+`SidebarProvider`, `useSidebar`, …), `PageHeader`, `ErrorState`, `PdfPreview` |
| react-hook-form | `FormProvider`, `RHFInput`, `RHFInputGroup`, `RHFTextArea`, `RHFSelect`, `RHFCheckbox`, `RHFRadioGroup`, `RHFSwitch`, `RHFInputOTP`, `RHFDatePicker`, `RHFDateRangePicker` |

### ส่วนที่ bom-ui เพิ่มจาก shadcn

- `Button variant="sparkle"` — gradient เคลื่อนไหวสำหรับ CTA (หยุดเมื่อ reduced motion; สีจาก `--sparkle-1/2/3`)
- `Button loading` — แสดง `Spinner`, `aria-busy`, disabled
- `IconButton` — `Button` ไอคอนล้วนที่บังคับ `aria-label` ใน type, `size="xs|sm|default|lg"`
- `getPageItems(page, pageCount, siblingCount?)` — คำนวณเลขหน้า + `"ellipsis"` สำหรับ `Pagination`
- `PageHeader`, `ErrorState`, `PdfPreview`, RHF* และ `BomUIProvider`

### ภาษา / locale — `BomUIProvider`

ค่าเริ่มต้นเป็นภาษาไทย ปี พ.ศ. (ข้อความที่ shadcn hardcode ภาษาอังกฤษ เช่น "Close", "Toggle Sidebar", "Previous" ถูกแทนด้วย `messages`) ใช้ได้โดยไม่ต้องครอบ provider ถ้าต้องการเปลี่ยน:

```tsx
import { enUS } from 'react-day-picker/locale'

<BomUIProvider locale={enUS} messages={{ close: 'Close', previous: 'Previous', next: 'Next' }}>
  {children}
</BomUIProvider>
```

- `locale` — จาก `react-day-picker/locale` ใช้กับ `Calendar` และ date picker ทุกตัว
- `messages` — ส่งเฉพาะ key ที่ต้องการเปลี่ยน (`BomUIMessages`) ที่เหลือใช้ `defaultMessages`
- prop ของ component ชนะค่าจาก provider เสมอ

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

### Sidebar — จำสถานะพับ/กาง

```tsx
// app/(app)/layout.tsx — Server Component
import { cookies } from 'next/headers'
import { SidebarProvider } from '@bomtawep/ui'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const defaultOpen = (await cookies()).get('sidebar_state')?.value !== 'false'
  return <SidebarProvider defaultOpen={defaultOpen}>{children}</SidebarProvider>
}
```

`SidebarMenuButton tooltip` ต้องมี `TooltipProvider` ครอบ (เหมือน shadcn)

ใช้ได้ทั้งใน Server Component และ Client Component (bundle มี `'use client'` อยู่แล้ว) · CI / Docker: ดู [.claude/rules/05-consumer-setup.md](.claude/rules/05-consumer-setup.md)

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
