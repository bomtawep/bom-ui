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

3. ติดตั้ง

   ```bash
   yarn add @bomtawep/ui
   ```

ใช้ npm หรือ Yarn 1? ใช้ `.npmrc` แทน — ดู [.claude/rules/05-consumer-setup.md](.claude/rules/05-consumer-setup.md)

## ใช้งาน

```tsx
// app/layout.tsx
import '@bomtawep/ui/styles.css'
```

```tsx
import { Button } from '@bomtawep/ui'

export default function Page() {
  return <Button variant="primary">Save</Button>
}
```

### Button

```tsx
<Button variant="primary" size="md">Save</Button>
```

- `variant`: `primary` (ค่าเริ่มต้น) | `secondary` | `ghost` | `danger` | `sparkle` (gradient เคลื่อนไหว + แสงวาบตอน hover สำหรับ CTA — หยุดเมื่อผู้ใช้ตั้ง reduced motion; เปลี่ยนสีได้ด้วย `--bom-color-sparkle-1/2/3`)
- `size`: `sm` | `md` (ค่าเริ่มต้น) | `lg`
- รับ props ของ `<button>` ทั้งหมด และ `ref`

## ธีม

ทุกสีและขนาดเป็น CSS variable `--bom-*` override ได้ใน CSS ของโปรเจกต์:

```css
:root {
  --bom-color-primary: #7c3aed;
  --bom-color-primary-hover: #6d28d9;
  --bom-radius-md: 0.75rem;
}
```

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
