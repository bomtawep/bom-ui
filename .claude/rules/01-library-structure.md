# 01 — Library Structure

## โครงสร้างโฟลเดอร์

```
bom-ui/
├── .github/workflows/
│   ├── ci.yml            # typecheck + build ทุก PR
│   └── publish.yml       # publish เมื่อ push tag v*
├── .yarn/releases/yarn-4.18.1.cjs   # commit ไฟล์นี้ (pinned yarn)
├── scripts/release.sh               # bump + commit + tag
├── src/
│   ├── components/
│   │   └── Button/
│   │       ├── Button.tsx
│   │       └── index.ts
│   ├── styles/           # (ถ้า ship CSS แยก)
│   └── index.ts          # public API — export ทุกอย่างจากที่นี่
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── yarn.lock             # commit เสมอ
├── .yarnrc.yml           # yarnPath, nodeLinker, npmScopes (ไม่มี token จริง)
└── .gitignore            # dist/, node_modules/, .yarn/* ยกเว้น .yarn/releases
```

## Package manager: Yarn 4

- ใช้ `yarn` เท่านั้น ห้ามมี `package-lock.json` / `pnpm-lock.yaml`
- `nodeLinker: node-modules` (ไม่ใช้ Plug'n'Play — tooling ของ Next/tsup ทำงานกับ node_modules ได้ดีกว่า)
- Pin เวอร์ชันผ่าน `yarnPath` (ไม่พึ่ง Corepack ซึ่งไม่ได้มากับ Node ตั้งแต่ v25) และ `packageManager: "yarn@4.18.1"` ใน package.json
- อัปเกรด yarn: `yarn set version <x.y.z>` แล้ว commit ไฟล์ใน `.yarn/releases/` + `.yarnrc.yml` + `package.json`
- เพิ่ม dependency: `yarn add -D -E <pkg>@<version>` (`-E` = exact)
- CI ใช้ `yarn install --immutable` (ห้าม lockfile เปลี่ยน)

## Rules

- 1 component = 1 โฟลเดอร์ใน `src/components/<Name>/` ชื่อ PascalCase
- ทุก component ต้องถูก re-export จาก `src/index.ts` — สิ่งที่ไม่ export ถือเป็น internal
- ใช้ named export เท่านั้น (ไม่ใช้ `export default`) เพื่อให้ tree-shaking ทำงานและ import ชื่อคงที่
- Props ต้อง export type ด้วย เช่น `export type { ButtonProps } from './Button'`
- ห้าม import จาก `next/*` ใน component ทั่วไป ถ้าจำเป็นต้องใช้ (เช่น `next/link`) ให้ `next` เป็น peerDependency และอยู่ใน `external`

## package.json (baseline)

```json
{
  "name": "@bomtawep/ui",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./styles.css": "./dist/styles.css"
  },
  "files": ["dist"],
  "sideEffects": ["**/*.css"],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/bomtawep/bom-ui.git"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "typecheck": "tsc --noEmit",
    "prepack": "yarn typecheck && yarn build",
    "release": "sh scripts/release.sh"
  },
  "packageManager": "yarn@4.18.1",
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  },
  "devDependencies": {
    "@types/react": "...",
    "@types/react-dom": "...",
    "react": "...",
    "react-dom": "...",
    "tsup": "...",
    "typescript": "..."
  }
}
```

ข้อกำหนด:
- `files: ["dist"]` — publish เฉพาะไฟล์ที่ build แล้ว
- `exports` ต้องมี `types` เป็น key แรกเสมอ
- `repository.url` ต้องชี้ไปที่ repo นี้ — GitHub Packages ใช้ลิงก์ package เข้ากับ repo
- ใน devDependencies ให้ pin เวอร์ชันจริง (ห้ามใช้ `"latest"`)
- ใช้ `prepack` (ไม่ใช่ `prepublishOnly`) — Yarn 4 รัน `prepack` ทั้งตอน `yarn pack` และ `yarn npm publish` จึงรับประกันว่า `dist/` ใหม่เสมอ
- **ห้าม** มี `prepare` script ที่ build — ไม่จำเป็นเพราะติดตั้งจาก registry (ไม่ใช่จาก git)

## tsup.config.ts

```ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'next'],
  banner: { js: "'use client'" },
  onSuccess: async () => {
    await copyFile('src/styles/styles.css', 'dist/styles.css')
  },
})
```

- `external` ต้องครอบคลุมทุก peerDependency
- **ห้ามใส่ `treeshake: true`** — option นี้ทำให้ tsup ส่งต่อให้ Rollup ซึ่งลบ `'use client'` ออกจาก bundle (esbuild tree-shake ESM ให้อยู่แล้ว) ตรวจหลัง build ว่าบรรทัดแรกของ `dist/index.js` เป็น `'use client'`
- ใช้ tsup 8.x + TypeScript 5.x (tsup 9 ต้องการ Node ≥ 22)
- `banner` ใส่ `'use client'` ไว้บนสุดของ bundle (ดู [02-nextjs-compatibility.md](02-nextjs-compatibility.md))

## tsconfig.json (สำคัญ)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "declaration": true,
    "skipLibCheck": true,
    "isolatedModules": true
  },
  "include": ["src"]
}
```
