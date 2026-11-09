# 01 — Library Structure

## โครงสร้างโฟลเดอร์

```
bom-ui/
├── .github/workflows/
│   ├── ci.yml            # typecheck + test + build + checks + pack + storybook ทุก PR
│   └── publish.yml       # publish เมื่อ push tag v*
├── .yarn/releases/yarn-4.18.1.cjs   # commit ไฟล์นี้ (pinned yarn)
├── .storybook/                      # main.ts, preview.tsx (theme toolbar)
├── scripts/
│   ├── release.sh                   # bump + commit + tag
│   └── check-dist.sh                # 'use client' + theme.css / source.css หลัง build
├── src/
│   ├── components/
│   │   └── Button/
│   │       ├── Button.tsx           # โค้ด shadcn (function component + data-slot, class Tailwind)
│   │       ├── Button.test.tsx      # Vitest + Testing Library + axe
│   │       ├── Button.stories.tsx   # Storybook (default export meta ได้เฉพาะไฟล์นี้)
│   │       └── index.ts
│   ├── lib/                         # internal helpers: date.ts, use-field-ids.ts, use-is-mobile.ts, use-transient-state.ts
│   ├── styles/theme.css             # theme shadcn (:root / .dark) + @theme inline + bom-sparkle
│   ├── styles/shadcn-tailwind.css   # custom variants ของ shadcn (copy จาก shadcn/dist/tailwind.css)
│   ├── test-utils/                  # setup.ts, axe.ts
│   └── index.ts                     # public API — export ทุกอย่างจากที่นี่
├── vite.config.ts                   # ใช้ร่วม Vitest + Storybook (ไม่เกี่ยวกับ tsup)
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
- `.yarnrc.yml` ตั้ง `tsEnableAutoTypes: false` เพื่อไม่ให้ `yarn add` เพิ่ม `@types/*` ด้วย caret range เอง (devDependencies ต้อง pin exact) — ถ้าต้องใช้ types ให้เพิ่มเองด้วย `yarn add -D -E @types/<pkg>@<version>`
- Yarn ≥ 4.18 จะไม่ติดตั้งเวอร์ชันที่ publish มาไม่ถึง 1 วัน (age gate) — ถ้า pin เวอร์ชันที่ใหม่เกินไป install จะ fail ด้วย `YN0016 ... quarantined` ให้เลือกเวอร์ชันที่เก่ากว่า **ห้าม** ปิด gate ของ scope เริ่มต้น
- CI ใช้ `yarn install --immutable` (ห้าม lockfile เปลี่ยน)

## Rules

- 1 component = 1 โฟลเดอร์ใน `src/components/<Name>/` ชื่อ PascalCase
- ทุก component ต้องถูก re-export จาก `src/index.ts` — สิ่งที่ไม่ export ถือเป็น internal
- ใช้ named export เท่านั้น (ไม่ใช้ `export default`) เพื่อให้ tree-shaking ทำงานและ import ชื่อคงที่
- Props ต้อง export type ด้วย เช่น `export type { ButtonProps } from './Button'`
- component ใช้โค้ด shadcn: function component (React 19 ref-as-prop) + `data-slot`, รับ `className` + `...props`; import shadcn ใหม่ด้วย transform path `@/components/ui/x` → `../X/X` และแทนข้อความภาษาอังกฤษด้วย `useBomUI().messages` — Definition of Done ดู spec
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
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    },
    "./theme.css": "./dist/theme.css",
    "./source.css": "./dist/source.css"
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
    "react": ">=19",
    "react-dom": ">=19",
    "react-hook-form": "^7.55.0",
    "tailwindcss": "^4"
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
- `exports` ต้องมี `types` เป็น key แรกเสมอ (ภายในแต่ละ condition `import` / `require` — ESM ใช้ `index.d.ts`, CJS ใช้ `index.d.cts`)
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
  external: ['react', 'react-dom', 'next', 'react-hook-form', 'tailwindcss'],
  banner: { js: "'use client'" },
  onSuccess: writeCss,
})
```

- `external` ต้องครอบคลุมทุก peerDependency
- `onSuccess: writeCss` — เขียน `dist/theme.css` (= `src/styles/theme.css` + `@source "./"`), `dist/source.css` (`@source` อย่างเดียว) และ copy `shadcn-tailwind.css`
- **ห้ามใส่ `treeshake: true`** — option นี้ทำให้ tsup ส่งต่อให้ Rollup ซึ่งลบ `'use client'` ออกจาก bundle (esbuild tree-shake ESM ให้อยู่แล้ว) ตรวจหลัง build ว่าบรรทัดแรกของ `dist/index.js` เป็น `'use client'`
- ใช้ tsup 8.x + TypeScript 5.x; dev/CI ใช้ Node 22 (`.nvmrc`)
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
