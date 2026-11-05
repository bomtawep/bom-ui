# 02 — Next.js Compatibility

Library นี้คือ **React** component library ที่ต้องใช้ได้ใน Next.js ทั้ง App Router (Server Components) และ Pages Router

## peerDependencies (ห้ามผิด)

- `react`, `react-dom` (และ `next` ถ้ามีการ import) ต้องอยู่ใน `peerDependencies` + `devDependencies`
- **ห้าม** อยู่ใน `dependencies` — ถ้าผิด โปรเจกต์ปลายทางจะมี React 2 ชุด → error `Invalid hook call`
- ทุก peerDependency ต้องอยู่ใน `external` ของ `tsup.config.ts`

## `'use client'`

- Component ที่ใช้ `useState`, `useEffect`, `onClick`, context ฯลฯ ใช้ใน Server Component ไม่ได้ถ้าไม่มี `'use client'`
- ตอน bundle directive ในไฟล์ source มักหายไป → ใส่ผ่าน `banner: { js: "'use client'" }` ใน tsup
- ใส่ `'use client'` ที่ต้นไฟล์ component ที่เป็น client ด้วย (เพื่อความชัดเจนตอนอ่าน)
- ถ้าภายหลังต้องการ server-safe components (ไม่มี interactivity) ให้แยก entry point เช่น `@bomtawep/ui/server` ที่ **ไม่มี** banner `'use client'` — ห้ามผสมใน entry เดียว

## Styling

เลือกแนวทางเดียวแล้วใช้ให้สม่ำเสมอ:

1. **Ship CSS แยก (default)** — build CSS ไปที่ `dist/styles.css` แล้วให้ปลายทาง import ครั้งเดียว
   ```ts
   // app/layout.tsx
   import '@bomtawep/ui/styles.css'
   ```
   - สีและขนาดทั้งหมดมาจาก CSS variables ใน `src/styles/tokens.css` (`--bom-color-*`, `--bom-radius-*`, `--bom-space-*`, …) ปลายทาง override ได้ เช่น `:root { --bom-color-primary: #7c3aed; }`
   - Dark mode ตาม OS อัตโนมัติ หรือบังคับด้วย `<html data-theme="dark">` / `data-theme="light"`
   - CSS ของ component ห้ามมีสี hardcode — CI ตรวจด้วย `scripts/check-css.sh`
2. **Tailwind** — ถ้าใช้ class ของ Tailwind ใน component ปลายทางต้องให้ Tailwind scan package ด้วย
   - Tailwind v4: `@source "../node_modules/@bomtawep/ui/dist";` ใน CSS
   - Tailwind v3: เพิ่ม `./node_modules/@bomtawep/ui/dist/**/*.{js,cjs}` ใน `content`
   - ต้องระบุสิ่งนี้ไว้ใน README ของ library

ห้ามใช้ CSS-in-JS ที่ต้องมี runtime ฝั่ง server (เช่น styled-components ที่ไม่ได้ตั้ง registry) เพราะทำงานไม่ดีกับ App Router

## ข้อห้ามอื่น ๆ

- ห้ามอ้าง `window` / `document` ระหว่าง render — ใช้ใน `useEffect` เท่านั้น (กัน hydration mismatch)
- ห้ามใช้ API ที่เฉพาะ Next.js เวอร์ชันใดเวอร์ชันหนึ่งโดยไม่ระบุ range ของ `next` ใน peerDependencies

## Local development กับโปรเจกต์จริง

```bash
# ใน bom-ui
yarn dev               # tsup --watch

# ในโปรเจกต์ Next ปลายทาง (Yarn 4)
yarn link ../bom-ui    # เพิ่ม resolution แบบ portal: ชี้ไปที่ bom-ui
yarn unlink ../bom-ui  # เอาออกก่อน commit
```

ถ้าเจอ React ซ้ำ 2 ชุดตอน link ให้ใช้ tarball แทน:
```bash
# ใน bom-ui
yarn pack              # → package.tgz
# ในปลายทาง
yarn add @bomtawep/ui@file:../bom-ui/package.tgz
```

ทางเลือก: ส่ง source `.tsx` แล้วให้ปลายทางตั้ง `transpilePackages: ['@bomtawep/ui']` ใน `next.config` — **ไม่ใช้** ในโปรเจกต์นี้ เราเลือก publish ไฟล์ที่ build แล้ว
