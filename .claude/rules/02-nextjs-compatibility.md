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

## Styling — shadcn + Tailwind CSS v4 (ตั้งแต่ 1.0.0)

- component เป็นโค้ด shadcn/ui (style `radix-nova`, base `neutral`) ใช้ class Tailwind + `cva` + `cn` (แพ็กเกจ `cn`)
- ปลายทาง**ต้องมี Tailwind v4** และ import CSS ของ library ใน CSS หลัก:
  ```css
  @import "tailwindcss";
  @import "@bomtawep/ui/theme.css";   /* theme shadcn + custom variants + @source */
  /* หรือ @import "@bomtawep/ui/source.css" ถ้าปลายทางมี theme shadcn ของตัวเอง */
  ```
- theme / ตัวแปรสีอยู่ใน `src/styles/theme.css` (ตัวแปร shadcn: `--primary`, `--radius`, …) — ห้ามใส่สี hardcode ใน class ของ component ให้ใช้ token ของ shadcn (`bg-primary`, `text-muted-foreground`, …)
- custom variants / keyframes ของ shadcn อยู่ใน `src/styles/shadcn-tailwind.css` (copy จาก `shadcn/dist/tailwind.css` — อัปเดตเมื่ออัปเกรด shadcn)
- Dark mode: class `.dark` ที่ `<html>` (next-themes `attribute="class"`) — เหมือน shadcn
- ส่วนเสริมที่ต้องใช้ CSS เอง (เช่น `bom-sparkle`) ให้เขียนเป็น `@utility` ใน `theme.css`

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
