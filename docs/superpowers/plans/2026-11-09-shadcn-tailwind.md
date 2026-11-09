# shadcn + Tailwind v4 (1.0.0) — Implementation Plan

> ห้าม commit / push / tag / release — ทิ้งการเปลี่ยนแปลงไว้ใน working tree (rule 07)

**Spec:** [2026-11-09-shadcn-tailwind-design.md](../specs/2026-11-09-shadcn-tailwind-design.md)
**Source:** `/Users/taweewatphimhin/Documents/bom/poc-dof-pps/frontend/src/components/{ui,hook-form}` (= `POC/`)

## Global constraints
- Yarn 4, `yarn add -E`; peer `react >=19`, `react-dom >=19`, `react-hook-form ^7.55.0`, `tailwindcss ^4`
- shadcn style `radix-nova` / base `neutral`; function components + `data-slot`; `cn` จาก `src/lib/utils.ts`
- ห้าม import `next/*`; ข้อความ UI มาจาก `useBomUI().messages`
- ตรวจหลังทุก task: `yarn typecheck && yarn test`

## Tasks

1. **Foundation** — deps/peers, `src/lib/utils.ts` (ลบ `cn.ts`, `icons.tsx`), `src/styles/theme.css` (shadcn variants + neutral theme + sparkle keyframes), `tsup` onSuccess → `dist/theme.css` + `dist/source.css`, `package.json` exports, `check-dist.sh`, ลบ `check-css.sh` + ขั้น CI, Storybook (`@tailwindcss/vite`, `.storybook/tailwind.css`, toolbar `.dark`), ลบ `src/components/*/*.css` ทั้งหมด
2. **Primitives** — Button (+`sparkle`, `loading`), IconButton, ButtonGroup, Badge, Spinner, Kbd, Avatar, Card, Separator, Skeleton (+ tests/stories)
3. **Form controls** — Label, Input, Textarea, Checkbox, RadioGroup, Switch, Field, Select, InputGroup, InputOTP, Calendar (+locale)
4. **Overlays** — Popover, Tooltip, Dialog, AlertDialog, Sheet, DropdownMenu, Toaster
5. **Navigation / data / app** — Tabs, Accordion, Breadcrumb, Pagination (+`getPageItems`), Table, Alert, Empty, PageHeader, ErrorState, PdfPreview, Sidebar
6. **HookForm** — RHF* จาก POC (import + messages + `useFieldIds`), tests ปรับ selector
7. **Docs & verify** — README, CHANGELOG `[Unreleased]` + Migration, rules 01/02 + CLAUDE.md, typecheck/test/build/check-dist/pack/build-storybook, smoke Next 16 + Tailwind v4
