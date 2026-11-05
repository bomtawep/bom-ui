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

ใช้ได้ทั้งใน Server Component และ Client Component (bundle มี `'use client'` อยู่แล้ว)

CI / Docker: ดู [.claude/rules/05-consumer-setup.md](.claude/rules/05-consumer-setup.md)

## พัฒนา

```bash
yarn install
yarn dev         # tsup --watch
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
