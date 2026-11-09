# Component Library Design — `@bomtawep/ui`

- วันที่: 2026-11-05
- สถานะ: อนุมัติแล้ว (brainstorming)
- เวอร์ชันปัจจุบัน: 0.1.5 (มีแค่ `Button`)

## เป้าหมาย

ทำ component ชุดมาตรฐาน (~25 โฟลเดอร์) สำหรับ Next.js App Router / Pages Router แบ่งเป็น 5 ช่วง แต่ละช่วงจบด้วย minor release และปิดท้ายด้วย `1.0.0` (API freeze)

แต่ละช่วงมี implementation plan แยกของตัวเอง — spec นี้กำหนดสถาปัตยกรรมร่วม, ขอบเขตแต่ละช่วง และ definition of done

## การตัดสินใจหลัก

| เรื่อง | เลือก | เหตุผล |
|---|---|---|
| Headless / a11y | Radix UI ผ่านแพ็กเกจรวม `radix-ui` | a11y (focus trap, keyboard, ARIA, positioning) ผ่านการทดสอบมาแล้ว tree-shake ได้ |
| Styling | Plain CSS + CSS variables `--bom-*` | ต่อยอดของเดิม ปลายทางไม่ต้องมี Tailwind ปรับธีมด้วย override ตัวแปร |
| Test | Vitest + Testing Library + `axe-core` | behavior + a11y อัตโนมัติ |
| Docs / playground | Storybook (`@storybook/react-vite`) | ดู variant / state / dark mode |

## 1. สถาปัตยกรรม

### Dependencies

- `radix-ui` อยู่ใน `dependencies` (pin exact ด้วย `yarn add -E`) — tsup externalize `dependencies` ให้อัตโนมัติ ไม่ถูก bundle
- `react`, `react-dom` เป็น `peerDependencies` (`>=18`) เหมือนเดิม — ไม่ import `next`
- devDependencies ใหม่ (pin exact ตอนลงมือ): `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `axe-core` (helper `expectNoA11yViolations` เขียนเอง — `vitest-axe` ไม่ได้ maintain แล้ว), `storybook`, `@storybook/react-vite`, `vite`, `@vitejs/plugin-react`

### ข้อตกลง API

- ทุก component ใช้ `forwardRef` (peer รองรับ React 18 ซึ่งไม่มี ref-as-prop) และตั้ง `displayName`
- รับ `className` (ต่อท้าย class ของเรา) และ spread `...props` ลง element จริง
- ชื่อ prop สม่ำเสมอทั้งชุด:
  - `variant`: `'primary' | 'secondary' | 'ghost' | 'danger'` (component ที่ไม่ใช่ปุ่มกำหนด set ของตัวเอง เช่น Alert/Badge ใช้ `'info' | 'success' | 'warning' | 'danger'`)
  - `size`: `'sm' | 'md' | 'lg'` ค่าเริ่มต้น `'md'`
- Component ที่มาจาก Radix export เป็นชื่อแบน เช่น `Dialog`, `DialogTrigger`, `DialogContent`, `DialogTitle` — ไม่ใช้ `Dialog.Content` (named export + tree-shaking)
- Helper ภายใน `src/lib/cn.ts` สำหรับรวม className (ไม่ export, ไม่มี dependency)
- Props type ทุกตัว export จาก `src/index.ts`

### Styling

- `src/styles/tokens.css` — `--bom-color-*` (bg, fg, muted, border, primary, primary-fg, danger, success, warning, info, ring), `--bom-radius-*`, `--bom-space-*`, `--bom-font-*`, `--bom-shadow-*`
- Dark mode: เป็น opt-in — ค่าเริ่มต้นเป็น light เสมอ (`:root` ไม่ตั้ง `color-scheme`); `<html data-theme="dark">` ใช้ dark tokens, `data-theme="light"` บังคับ light, `data-theme="system"` ตาม OS ผ่าน `@media (prefers-color-scheme: dark)` (แก้ไขหลัง final review ของ Phase 1 เพื่อไม่ให้ consumer 0.1.5 เปลี่ยนหน้าตาเมื่ออัปเกรด minor)
- CSS ต่อ component: `src/components/<Name>/<Name>.css` class รูปแบบ `bom-<name>`, `bom-<name>--<modifier>`; state ใช้ attribute ของ Radix (`[data-state="open"]`, `[data-disabled]`)
- CSS ของ component ใช้ได้เฉพาะตัวแปร `--bom-*` — ห้ามสี hardcode นอก `tokens.css`
- Build: `onSuccess` ใน `tsup.config.ts` รวม `tokens.css` + `src/components/*/*.css` (เรียงตามชื่อ) เป็น `dist/styles.css` ไฟล์เดียว — ปลายทาง import `@bomtawep/ui/styles.css` เหมือนเดิม; `src/styles/styles.css` เดิมถูกแทนที่

### โครงสร้างไฟล์ต่อ component

```
src/components/<Name>/
  <Name>.tsx          # 'use client' + forwardRef
  <Name>.css
  <Name>.test.tsx
  <Name>.stories.tsx
  index.ts            # named exports + types
```

ไฟล์ test/story ไม่เข้า bundle (tsup entry คือ `src/index.ts` เท่านั้น) และไม่ถูก publish (`files: ["dist"]`) แต่ผ่าน `yarn typecheck`

### `'use client'`

banner `'use client'` ครอบทั้ง bundle — component ที่ไม่ interactive (Card, Table, …) จึงเป็น client component ด้วย ยอมรับได้เพราะยังใช้ใน Server Component ได้ ถ้าภายหลังต้องการ server-only ให้แยก entry `@bomtawep/ui/server` ตาม rule 02

## 2. ขอบเขตแต่ละช่วง

| ช่วง | Release | เนื้อหา |
|---|---|---|
| 1. Foundation | 0.2.0 | tokens (light/dark), `cn()`, CSS concat build, Vitest + Storybook setup, `yarn test` + ขั้นตอนใหม่ใน CI, refactor `Button` (forwardRef, `size`, variant `ghost`/`danger`, ใช้ tokens) |
| 2. Primitives | 0.3.0 | `IconButton` (บังคับ `aria-label` ใน type), `Badge`, `Spinner`, `Avatar` (+`AvatarImage`, `AvatarFallback`), `Card` (+`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`), `Separator`, `Button` prop `loading` (แสดง `Spinner` + `aria-busy` + disabled) |
| 3. Form | 0.4.0 | `Label`, `Input`, `Textarea`, `Checkbox`, `RadioGroup` + `RadioGroupItem`, `Switch`, `Select` (+`SelectTrigger`, `SelectContent`, `SelectItem`, `SelectValue`), `FormField` |
| 4. Overlay & interactive | 0.5.0 | `Dialog`, `AlertDialog`, `Tooltip`, `Popover`, `DropdownMenu`, `Tabs`, `Accordion`, `Toaster` + `toast()` |
| 5. Data display | 0.6.0 | `Alert`, `Skeleton`, `Breadcrumb`, `Pagination`, `Table` (+`TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`) |
| API freeze | 1.0.0 | ไม่มี component ใหม่ — ทบทวนความสม่ำเสมอของชื่อ prop และเขียน Migration ใน CHANGELOG |

> ช่วง 2–5 ถูกแทนด้วย [2026-11-09-poc-components-port-design.md](2026-11-09-poc-components-port-design.md) (ทำรวมใน 0.2.0)

### รายละเอียดที่ตัดสินใจแล้ว

- **`FormField`** — props `label`, `description?`, `error?`, `required?`, `children` (control ตัวเดียว) สร้าง id ด้วย `useId` แล้วส่งผ่าน context ให้ `Input` / `Textarea` / `Select` / `Checkbox` / `Switch` / `RadioGroup` อ่าน `id`, `aria-describedby`, `aria-invalid`, `aria-required` อัตโนมัติ — ใช้ร่วมกับ react-hook-form ได้เพราะ control ยัง forward ref และ `...props`
- **`toast()`** — store ภายในโมดูล (`subscribe` / `getSnapshot`) อ่านด้วย `useSyncExternalStore` (React 18) `toast({ title, description?, variant?, duration? })` คืน id; `toast.dismiss(id)`; `<Toaster />` วางครั้งเดียวใน layout และ render ผ่าน Radix Toast เรียก `toast()` ได้จากโค้ดฝั่ง client เท่านั้น
- **`Pagination`** — controlled: `page`, `pageCount`, `onPageChange`; แสดง ellipsis เมื่อหน้าเยอะ ไม่ผูกกับ router (ปลายทางจัดการ URL เอง)
- **`Table`** — markup ที่ใส่ style แล้วเท่านั้น ไม่มี sort/filter

### นอกขอบเขต

DataGrid (sort/filter/virtualize), DatePicker, Combobox, Command palette, form-library integration, การ deploy Storybook — ถ้าต้องการให้เปิดเป็นช่วงที่ 6 พร้อม spec ใหม่

## 3. Testing, CI และ Definition of Done

### Vitest

- `vite.config.ts` (ใช้ร่วมกับ Storybook): block `test` — environment `jsdom`, setup file `src/test-utils/setup.ts`
- `src/test-utils/setup.ts`: import `@testing-library/jest-dom/vitest`, polyfill `ResizeObserver`, `Element.prototype.hasPointerCapture` / `releasePointerCapture`, `Element.prototype.scrollIntoView` (Radix ต้องใช้)
- script: `"test": "vitest run"`, `"test:watch": "vitest"`

### Storybook

- `.storybook/main.ts` ใช้ `@storybook/react-vite` stories `src/**/*.stories.tsx`
- `.storybook/preview.ts` import `src/styles/tokens.css` + CSS ของ component ทุกตัว และมี toolbar toggle light/dark ที่ตั้ง `data-theme` บน `<html>`
- script: `"storybook": "storybook dev -p 6006"`, `"build-storybook": "storybook build"`
- `storybook-static/` อยู่ใน `.gitignore`

### CI (`.github/workflows/ci.yml`)

ลำดับ: `yarn install --immutable` → `yarn typecheck` → `yarn test` → `yarn build` → ตรวจบรรทัดแรกของ `dist/index.js` เป็น `'use client'` → `sh scripts/check-css.sh` (fail ถ้าพบ `#hex` / `rgb(` / `hsl(` ใน `src/components/**/*.css`) → `yarn pack --dry-run` → `yarn build-storybook`

### Definition of Done — ต่อ component

1. `forwardRef`, รับ `className` + `...props`, มี `displayName`
2. CSS ใช้เฉพาะ `--bom-*` และดูถูกต้องทั้ง light / dark
3. Test อย่างน้อย: render, class ของ variant/size, ref ถูก forward, ไม่มี axe violation; ตัว interactive มี keyboard test (เช่น Esc ปิด Dialog, ลูกศรใน Menu/Tabs/RadioGroup)
4. Story ครอบคลุมทุก variant / size / state
5. Export จาก `src/index.ts` พร้อม props type

### Definition of Done — ต่อช่วง

1. ทำบน branch `feat/phase-N-<name>` → PR → CI ผ่าน → merge เข้า `master`
2. อัปเดต `CHANGELOG.md` และ README (รายการ component + วิธี theme)
3. Smoke test ด้วยมือ: `yarn pack` แล้วติดตั้ง tarball ในแอป Next App Router จริง — import ใน Server Component ได้, ไม่มี hydration warning, dark mode ทำงาน
4. `yarn release minor` → `git push --follow-tags`

## Semver

- 0.x: แต่ละช่วงเป็น minor; การเปลี่ยนหน้าตา Button ให้ใช้ tokens ใน 0.2.0 ยอมรับได้ (API ไม่เปลี่ยน — `variant="primary" | "secondary"` ยังใช้ได้)
- หลัง 1.0.0 ปฏิบัติตาม [03-versioning-release.md](../../../.claude/rules/03-versioning-release.md) เคร่งครัด
