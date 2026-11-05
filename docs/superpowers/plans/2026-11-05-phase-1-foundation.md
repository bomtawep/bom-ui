# Phase 1 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** วางรากฐานของ library (Node 22, Vitest, design tokens, CSS bundling, Storybook, CI) และ refactor `Button` ให้เป็นต้นแบบตามข้อตกลง แล้วออก `0.2.0`

**Architecture:** CSS variables `--bom-*` ใน `src/styles/tokens.css` + CSS ต่อ component (`src/components/<Name>/<Name>.css`) ถูกรวมเป็น `dist/styles.css` ใน `onSuccess` ของ tsup. ไฟล์ `vite.config.ts` ไฟล์เดียวใช้ร่วมกันระหว่าง Vitest และ Storybook. Component ใช้ `forwardRef` + `cn()` helper.

**Tech Stack:** Node 22, Yarn 4.18.1, TypeScript 5.9.3, tsup 8.5.1, React 19 (dev) / peer `>=18`, Vitest 5.1.0 + jsdom 30.1.3, Testing Library, axe-core 4.14.0, Storybook 10.6.5 + Vite 8.3.5

Spec: [docs/superpowers/specs/2026-11-05-component-library-design.md](../specs/2026-11-05-component-library-design.md)

## Global Constraints

- ใช้ `yarn` เท่านั้น เพิ่ม dependency ด้วย `yarn add -D -E <pkg>@<version>` (exact) — ห้ามมี `package-lock.json`
- dev / CI ใช้ Node 22 (`.nvmrc` = `22`) — ทุกคำสั่งในแผนนี้ต้องรันใน shell ที่ `node -v` เป็น v22.x (`source ~/.nvm/nvm.sh && nvm use`)
- `package.json` `engines.node` คงเป็น `>=20` (เป็นข้อกำหนดของ consumer — `dist/` ไม่ได้ใช้ Node API)
- `react`, `react-dom` อยู่ใน `peerDependencies` (`>=18`) + `devDependencies` เท่านั้น
- ทุก component: `'use client'`, `forwardRef`, `displayName`, รับ `className` + `...props`, named export, props type export จาก `src/index.ts`
- Class รูปแบบ `bom-<name>`, `bom-<name>--<modifier>`; CSS ของ component ใช้ได้เฉพาะ `var(--bom-*)` — ห้าม `#hex` / `rgb(` / `hsl(` นอก `src/styles/tokens.css`
- ห้ามใส่ `treeshake: true` ใน tsup; บรรทัดแรกของ `dist/index.js` ต้องเป็น `'use client'`
- ห้าม publish ด้วยมือ ห้ามแก้ `version` ใน `package.json` ด้วยมือ — ใช้ `yarn release`
- Commit message ลงท้ายด้วย `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
- ทำงานบน branch `feat/phase-1-foundation` (มีอยู่แล้ว มี commit spec)

## File Structure

| ไฟล์ | สถานะ | หน้าที่ |
|---|---|---|
| `.nvmrc` | modify | `22` |
| `package.json` | modify | devDeps ใหม่ + scripts `test`, `test:watch`, `storybook`, `build-storybook` |
| `vite.config.ts` | create | config ร่วม Vitest (`test` block) + Storybook (plugin react) |
| `src/test-utils/setup.ts` | create | jest-dom matchers, cleanup, polyfill สำหรับ Radix |
| `src/test-utils/axe.ts` | create | `expectNoA11yViolations(container)` |
| `src/lib/cn.ts` | create | `cn(...classes)` |
| `src/lib/cn.test.ts` | create | test ของ `cn` |
| `src/styles/tokens.css` | create | design tokens light / dark |
| `src/styles/styles.css` | delete | ถูกแทนด้วย tokens + CSS ต่อ component |
| `src/components/Button/Button.css` | create | style ของ Button (ใช้ tokens) |
| `src/components/Button/Button.tsx` | modify | forwardRef, `size`, variant `ghost` / `danger` |
| `src/components/Button/Button.test.tsx` | create | test ของ Button |
| `src/components/Button/Button.stories.tsx` | create | stories |
| `src/components/Button/index.ts` | modify | export `ButtonSize` |
| `tsup.config.ts` | modify | `bundleCss()` ใน `onSuccess` |
| `scripts/check-css.sh` | create | fail ถ้ามีสี hardcode ใน CSS ของ component |
| `scripts/check-dist.sh` | create | ตรวจ `'use client'` + เนื้อหา `dist/styles.css` |
| `.storybook/main.ts` | create | Storybook config |
| `.storybook/preview.tsx` | create | โหลด CSS + theme toolbar |
| `.gitignore` | modify | `storybook-static/` |
| `.github/workflows/ci.yml` | modify | test, check scripts, build-storybook |
| `CLAUDE.md`, `.claude/rules/01-library-structure.md`, `.claude/rules/02-nextjs-compatibility.md`, `README.md` | modify | Node 22, คำสั่งใหม่, โครงสร้าง component, theming |

---

### Task 1: Node 22 + Vitest + `cn()`

**Files:**
- Modify: `.nvmrc`, `package.json`
- Create: `vite.config.ts`, `src/test-utils/setup.ts`, `src/test-utils/axe.ts`, `src/lib/cn.ts`, `src/lib/cn.test.ts`

**Interfaces:**
- Produces:
  - `cn(...classes: ClassValue[]): string` และ `type ClassValue = string | false | null | undefined` จาก `src/lib/cn.ts`
  - `expectNoA11yViolations(container: Element): Promise<void>` จาก `src/test-utils/axe.ts`
  - `yarn test` (= `vitest run`) ที่ค้นหา `src/**/*.test.{ts,tsx}`

- [ ] **Step 1: เปลี่ยน Node เป็น 22**

เขียน `.nvmrc` ให้มีเนื้อหา:

```
22
```

แล้วรัน:

```bash
source ~/.nvm/nvm.sh && nvm use && node -v
```

Expected: `v22.x.x`

- [ ] **Step 2: ติดตั้ง test tooling**

```bash
yarn add -D -E vitest@5.1.0 jsdom@30.1.3 vite@8.3.5 @vitejs/plugin-react@6.2.1 @testing-library/react@16.3.3 @testing-library/dom@10.4.2 @testing-library/user-event@14.6.8 @testing-library/jest-dom@7.0.1 axe-core@4.14.0
```

Expected: install สำเร็จ, `yarn.lock` เปลี่ยน, ไม่มี `package-lock.json`. ถ้า yarn เตือน peer dependency ที่ไม่ใช่ optional ให้หยุดและรายงาน

- [ ] **Step 3: เพิ่ม scripts ใน `package.json`**

ในบล็อก `"scripts"` เพิ่ม 2 บรรทัดหลัง `"typecheck"`:

```json
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
```

- [ ] **Step 4: สร้าง `vite.config.ts`**

```ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Shared by Vitest (the `test` block) and Storybook (auto-loads vite.config.ts).
// Not used by tsup — the library build is configured in tsup.config.ts.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-utils/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
```

- [ ] **Step 5: สร้าง `src/test-utils/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Vitest globals are off, so Testing Library cannot register its own cleanup.
afterEach(() => {
  cleanup()
})

// jsdom lacks these; Radix primitives call them (positioning, pointer capture, scrolling).
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
if (!('ResizeObserver' in globalThis)) {
  globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver
}
if (typeof Element.prototype.hasPointerCapture !== 'function') {
  Element.prototype.hasPointerCapture = () => false
}
if (typeof Element.prototype.releasePointerCapture !== 'function') {
  Element.prototype.releasePointerCapture = () => {}
}
if (typeof Element.prototype.scrollIntoView !== 'function') {
  Element.prototype.scrollIntoView = () => {}
}
```

- [ ] **Step 6: สร้าง `src/test-utils/axe.ts`**

```ts
import axe from 'axe-core'
import { expect } from 'vitest'

/**
 * Runs axe on a rendered fragment and fails with the list of violated rules.
 * `color-contrast` needs real layout (jsdom has none); `region` is a page-level
 * rule that always fires on isolated fragments.
 */
export async function expectNoA11yViolations(container: Element): Promise<void> {
  const results = await axe.run(container, {
    rules: {
      'color-contrast': { enabled: false },
      region: { enabled: false },
    },
  })
  expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([])
}
```

- [ ] **Step 7: เขียน test ของ `cn` (failing)**

`src/lib/cn.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('joins class names with a single space', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c')
  })

  it('drops falsy values', () => {
    expect(cn('a', false, null, undefined, '', 'b')).toBe('a b')
  })

  it('returns an empty string when nothing is truthy', () => {
    expect(cn(false, undefined)).toBe('')
  })
})
```

- [ ] **Step 8: รัน test ให้ fail**

```bash
yarn test
```

Expected: FAIL — `Failed to resolve import "./cn"` (หรือข้อความทำนองเดียวกันว่าหาโมดูลไม่เจอ)

- [ ] **Step 9: สร้าง `src/lib/cn.ts`**

```ts
export type ClassValue = string | false | null | undefined

/** Joins truthy class names. Internal helper — not exported from the package. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ')
}
```

- [ ] **Step 10: รัน test + typecheck ให้ผ่าน**

```bash
yarn test && yarn typecheck
```

Expected: `3 passed` และ typecheck ไม่มี error

- [ ] **Step 11: Commit**

```bash
git add .nvmrc package.json yarn.lock vite.config.ts src/test-utils src/lib
git commit -m "chore: move to Node 22 and add Vitest with cn helper

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Design tokens + CSS bundling + check scripts

**Files:**
- Create: `src/styles/tokens.css`, `src/components/Button/Button.css`, `scripts/check-css.sh`, `scripts/check-dist.sh`
- Modify: `tsup.config.ts`
- Delete: `src/styles/styles.css`

**Interfaces:**
- Consumes: ไม่มี
- Produces:
  - Tokens (ใช้ใน component ถัดไปทุกตัว): `--bom-color-{bg,fg,muted,muted-fg,border,ring,primary,primary-hover,primary-fg,danger,danger-hover,danger-fg,success,warning,info}`, `--bom-radius-{sm,md,lg,full}`, `--bom-space-{1,2,3,4,6}`, `--bom-font-sans`, `--bom-font-size-{sm,md,lg}`, `--bom-font-weight-medium`, `--bom-shadow-{sm,md}`, `--bom-duration-fast`
  - Button classes: `bom-btn`, `bom-btn--{primary,secondary,ghost,danger}`, `bom-btn--{sm,md,lg}`
  - `sh scripts/check-css.sh`, `sh scripts/check-dist.sh`

- [ ] **Step 1: เขียน check script ก่อน (ทำหน้าที่เป็น test ของ task นี้)**

`scripts/check-css.sh`:

```sh
#!/bin/sh
# Component CSS must use --bom-* tokens only; raw colors belong in src/styles/tokens.css.
set -eu

if grep -rnE '#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\(' src/components --include='*.css'; then
  echo "Hardcoded colors found in component CSS — use var(--bom-color-*) from src/styles/tokens.css" >&2
  exit 1
fi
echo "check-css: ok"
```

`scripts/check-dist.sh`:

```sh
#!/bin/sh
# Verifies the built package: 'use client' banner survives bundling, and styles.css
# contains both the tokens and component styles.
set -eu

for f in dist/index.js dist/index.cjs; do
  if ! head -n 1 "$f" | grep -q "^'use client'"; then
    echo "$f: first line is not 'use client'" >&2
    exit 1
  fi
done

for needle in '--bom-color-primary:' '.bom-btn'; do
  if ! grep -qF -- "$needle" dist/styles.css; then
    echo "dist/styles.css: missing $needle" >&2
    exit 1
  fi
done
echo "check-dist: ok"
```

- [ ] **Step 2: รัน check ให้ fail**

```bash
yarn build && sh scripts/check-dist.sh
```

Expected: FAIL — `dist/styles.css: missing --bom-color-primary:` (styles.css ยังเป็นไฟล์เดิม)

- [ ] **Step 3: สร้าง `src/styles/tokens.css`**

```css
/*
 * Design tokens. Override any --bom-* variable in the consuming app to theme the library.
 * Dark mode: follows the OS unless <html data-theme="light|dark"> forces one.
 */
:root,
[data-theme='light'] {
  color-scheme: light;
  --bom-color-bg: #ffffff;
  --bom-color-fg: #0f172a;
  --bom-color-muted: #f1f5f9;
  --bom-color-muted-fg: #64748b;
  --bom-color-border: #cbd5e1;
  --bom-color-ring: #3b82f6;
  --bom-color-primary: #1d4ed8;
  --bom-color-primary-hover: #1e40af;
  --bom-color-primary-fg: #ffffff;
  --bom-color-danger: #dc2626;
  --bom-color-danger-hover: #b91c1c;
  --bom-color-danger-fg: #ffffff;
  --bom-color-success: #16a34a;
  --bom-color-warning: #d97706;
  --bom-color-info: #0284c7;

  --bom-radius-sm: 0.25rem;
  --bom-radius-md: 0.375rem;
  --bom-radius-lg: 0.5rem;
  --bom-radius-full: 9999px;

  --bom-space-1: 0.25rem;
  --bom-space-2: 0.5rem;
  --bom-space-3: 0.75rem;
  --bom-space-4: 1rem;
  --bom-space-6: 1.5rem;

  --bom-font-sans: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans Thai', sans-serif;
  --bom-font-size-sm: 0.875rem;
  --bom-font-size-md: 1rem;
  --bom-font-size-lg: 1.125rem;
  --bom-font-weight-medium: 500;

  --bom-shadow-sm: 0 1px 2px rgb(15 23 42 / 0.06);
  --bom-shadow-md: 0 4px 12px rgb(15 23 42 / 0.12);

  --bom-duration-fast: 150ms;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    color-scheme: dark;
    --bom-color-bg: #0b1120;
    --bom-color-fg: #e2e8f0;
    --bom-color-muted: #1e293b;
    --bom-color-muted-fg: #94a3b8;
    --bom-color-border: #334155;
    --bom-color-ring: #60a5fa;
    --bom-color-primary: #3b82f6;
    --bom-color-primary-hover: #2563eb;
    --bom-color-primary-fg: #ffffff;
    --bom-color-danger: #ef4444;
    --bom-color-danger-hover: #dc2626;
    --bom-color-danger-fg: #ffffff;
    --bom-color-success: #22c55e;
    --bom-color-warning: #f59e0b;
    --bom-color-info: #38bdf8;
    --bom-shadow-sm: 0 1px 2px rgb(0 0 0 / 0.4);
    --bom-shadow-md: 0 4px 12px rgb(0 0 0 / 0.5);
  }
}

[data-theme='dark'] {
  color-scheme: dark;
  --bom-color-bg: #0b1120;
  --bom-color-fg: #e2e8f0;
  --bom-color-muted: #1e293b;
  --bom-color-muted-fg: #94a3b8;
  --bom-color-border: #334155;
  --bom-color-ring: #60a5fa;
  --bom-color-primary: #3b82f6;
  --bom-color-primary-hover: #2563eb;
  --bom-color-primary-fg: #ffffff;
  --bom-color-danger: #ef4444;
  --bom-color-danger-hover: #dc2626;
  --bom-color-danger-fg: #ffffff;
  --bom-color-success: #22c55e;
  --bom-color-warning: #f59e0b;
  --bom-color-info: #38bdf8;
  --bom-shadow-sm: 0 1px 2px rgb(0 0 0 / 0.4);
  --bom-shadow-md: 0 4px 12px rgb(0 0 0 / 0.5);
}
```

- [ ] **Step 4: สร้าง `src/components/Button/Button.css` และลบ `src/styles/styles.css`**

```css
.bom-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--bom-space-2);
  /* md is the default size; .bom-btn--sm / --lg override padding and font-size */
  padding: var(--bom-space-2) var(--bom-space-4);
  border: 1px solid transparent;
  border-radius: var(--bom-radius-md);
  font-family: inherit;
  font-size: var(--bom-font-size-md);
  font-weight: var(--bom-font-weight-medium);
  line-height: 1.25;
  cursor: pointer;
  transition:
    background-color var(--bom-duration-fast),
    border-color var(--bom-duration-fast),
    color var(--bom-duration-fast);
}

.bom-btn:focus-visible {
  outline: 2px solid var(--bom-color-ring);
  outline-offset: 2px;
}

.bom-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.bom-btn--sm {
  padding: var(--bom-space-1) var(--bom-space-3);
  font-size: var(--bom-font-size-sm);
}

.bom-btn--lg {
  padding: var(--bom-space-3) var(--bom-space-6);
  font-size: var(--bom-font-size-lg);
}

.bom-btn--primary {
  background: var(--bom-color-primary);
  color: var(--bom-color-primary-fg);
}

.bom-btn--primary:hover:not(:disabled) {
  background: var(--bom-color-primary-hover);
}

.bom-btn--secondary {
  background: transparent;
  border-color: var(--bom-color-border);
  color: var(--bom-color-fg);
}

.bom-btn--ghost {
  background: transparent;
  color: var(--bom-color-fg);
}

.bom-btn--secondary:hover:not(:disabled),
.bom-btn--ghost:hover:not(:disabled) {
  background: var(--bom-color-muted);
}

.bom-btn--danger {
  background: var(--bom-color-danger);
  color: var(--bom-color-danger-fg);
}

.bom-btn--danger:hover:not(:disabled) {
  background: var(--bom-color-danger-hover);
}
```

```bash
git rm src/styles/styles.css
```

- [ ] **Step 5: แก้ `tsup.config.ts` ให้รวม CSS**

แทนที่ทั้งไฟล์ด้วย:

```ts
import { existsSync } from 'node:fs'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { defineConfig } from 'tsup'

// dist/styles.css = tokens + src/components/<Name>/<Name>.css (alphabetical).
// Consumers import it once: `import '@bomtawep/ui/styles.css'`.
async function bundleCss() {
  const entries = await readdir('src/components', { withFileTypes: true })
  const names = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort()
  const parts = [await readFile('src/styles/tokens.css', 'utf8')]
  for (const name of names) {
    const file = `src/components/${name}/${name}.css`
    if (existsSync(file)) parts.push(await readFile(file, 'utf8'))
  }
  await writeFile('dist/styles.css', parts.join('\n'))
}

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'next'],
  // Directives are stripped during bundling; re-add so App Router treats the bundle as client code.
  banner: { js: "'use client'" },
  onSuccess: bundleCss,
})
```

- [ ] **Step 6: รัน check ให้ผ่าน**

```bash
yarn build && sh scripts/check-dist.sh && sh scripts/check-css.sh && yarn test
```

Expected: `check-dist: ok`, `check-css: ok`, test เดิมผ่าน

- [ ] **Step 7: ตรวจว่า check-css จับสี hardcode ได้จริง**

```bash
printf '.x { color: #fff; }\n' > src/components/Button/_tmp.css && (sh scripts/check-css.sh; echo "exit=$?"); rm src/components/Button/_tmp.css
```

Expected: แสดงบรรทัด `_tmp.css:1:...` และ `exit=1`

- [ ] **Step 8: Commit**

```bash
git add src/styles src/components/Button/Button.css tsup.config.ts scripts/check-css.sh scripts/check-dist.sh
git commit -m "feat: add design tokens and bundle per-component CSS into styles.css

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Refactor `Button`

**Files:**
- Create: `src/components/Button/Button.test.tsx`
- Modify: `src/components/Button/Button.tsx`, `src/components/Button/index.ts`

**Interfaces:**
- Consumes: `cn` จาก `src/lib/cn.ts`, `expectNoA11yViolations` จาก `src/test-utils/axe.ts`, classes `bom-btn*` จาก Task 2
- Produces (public API):
  - `Button: ForwardRefExoticComponent<ButtonProps & RefAttributes<HTMLButtonElement>>`
  - `type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'`
  - `type ButtonSize = 'sm' | 'md' | 'lg'`
  - `interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: ButtonVariant; size?: ButtonSize }`

- [ ] **Step 1: เขียน test (failing)**

`src/components/Button/Button.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test-utils/axe'
import { Button } from './Button'

describe('Button', () => {
  it('renders a native button with type="button" by default', () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button')
  })

  it('keeps an explicit type', () => {
    render(<Button type="submit">Save</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('defaults to the primary variant and md size', () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole('button')).toHaveClass('bom-btn', 'bom-btn--primary', 'bom-btn--md')
  })

  it.each(['primary', 'secondary', 'ghost', 'danger'] as const)('applies the %s variant class', (variant) => {
    render(<Button variant={variant}>Save</Button>)
    expect(screen.getByRole('button')).toHaveClass(`bom-btn--${variant}`)
  })

  it.each(['sm', 'md', 'lg'] as const)('applies the %s size class', (size) => {
    render(<Button size={size}>Save</Button>)
    expect(screen.getByRole('button')).toHaveClass(`bom-btn--${size}`)
  })

  it('appends a custom className', () => {
    render(<Button className="extra">Save</Button>)
    expect(screen.getByRole('button')).toHaveClass('bom-btn', 'extra')
  })

  it('forwards the ref to the button element', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Save</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        Save
      </Button>,
    )
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('has a displayName', () => {
    expect(Button.displayName).toBe('Button')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Button>Save</Button>)
    await expectNoA11yViolations(container)
  })
})
```

- [ ] **Step 2: รัน test ให้ fail**

```bash
yarn test src/components/Button
```

Expected: FAIL — อย่างน้อย test `defaults to the primary variant and md size`, `ghost`/`danger`, size classes, `forwards the ref` และ `has a displayName` fail (Button เดิมไม่มี size / ref / displayName)

- [ ] **Step 3: เขียน `Button.tsx` ใหม่**

```tsx
'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn('bom-btn', `bom-btn--${variant}`, `bom-btn--${size}`, className)}
      {...props}
    />
  )
})

Button.displayName = 'Button'
```

`src/components/Button/index.ts`:

```ts
export { Button } from './Button'
export type { ButtonProps, ButtonSize, ButtonVariant } from './Button'
```

- [ ] **Step 4: รัน test + typecheck + build ให้ผ่าน**

```bash
yarn test && yarn typecheck && yarn build && sh scripts/check-dist.sh
```

Expected: test ทั้งหมดผ่าน (Button 16 + cn 3), typecheck ไม่มี error, `check-dist: ok`

- [ ] **Step 5: Commit**

```bash
git add src/components/Button
git commit -m "feat(Button): forwardRef, size prop, ghost and danger variants

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Storybook + Button stories

**Files:**
- Create: `.storybook/main.ts`, `.storybook/preview.tsx`, `src/components/Button/Button.stories.tsx`
- Modify: `package.json`, `.gitignore`

**Interfaces:**
- Consumes: `Button`, `ButtonVariant`, `ButtonSize` (Task 3); `vite.config.ts` (Task 1 — Storybook โหลดอัตโนมัติ ได้ plugin react)
- Produces: `yarn storybook`, `yarn build-storybook` (output `storybook-static/`); global `theme` (`'light' | 'dark'`) ที่ตั้ง `<html data-theme>`; รูปแบบ story file ที่ component ถัดไปทำตาม

- [ ] **Step 1: ติดตั้ง Storybook**

```bash
yarn add -D -E storybook@10.6.5 @storybook/react-vite@10.6.5
```

- [ ] **Step 2: เพิ่ม scripts และ `.gitignore`**

`package.json` → `"scripts"` เพิ่มหลัง `"test:watch"`:

```json
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
```

`.gitignore` เพิ่มบรรทัดหลัง `dist/`:

```
storybook-static/
```

- [ ] **Step 3: สร้าง `.storybook/main.ts`**

```ts
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  framework: '@storybook/react-vite',
  core: { disableTelemetry: true },
}

export default config
```

- [ ] **Step 4: สร้าง `.storybook/preview.tsx`**

```tsx
/// <reference types="vite/client" />
import type { Preview } from '@storybook/react-vite'
import '../src/styles/tokens.css'

// Same files tsup concatenates into dist/styles.css.
import.meta.glob('../src/components/*/*.css', { eager: true })

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Color theme (sets <html data-theme>)',
      toolbar: { title: 'Theme', icon: 'mirror', items: ['light', 'dark'], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (Story, context) => {
      document.documentElement.dataset.theme = context.globals.theme as string
      return (
        <div
          style={{
            background: 'var(--bom-color-bg)',
            color: 'var(--bom-color-fg)',
            fontFamily: 'var(--bom-font-sans)',
            padding: '1.5rem',
          }}
        >
          <Story />
        </div>
      )
    },
  ],
}

export default preview
```

- [ ] **Step 5: สร้าง `src/components/Button/Button.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, type ButtonSize, type ButtonVariant } from './Button'

const variants: ButtonVariant[] = ['primary', 'secondary', 'ghost', 'danger']
const sizes: ButtonSize[] = ['sm', 'md', 'lg']

// Storybook requires a default export for meta; the library itself uses named exports only.
const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Button' },
  argTypes: {
    variant: { control: 'inline-radio', options: variants },
    size: { control: 'inline-radio', options: sizes },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      {sizes.map((size) => (
        <Button key={size} {...args} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant} disabled>
          {variant}
        </Button>
      ))}
    </div>
  ),
}
```

- [ ] **Step 6: Build Storybook และ typecheck**

```bash
yarn typecheck && yarn build-storybook
```

Expected: typecheck ผ่าน, Storybook build สำเร็จ (`Output directory: .../storybook-static`). ถ้า typecheck error ว่า `vite/client` ไม่พบใน `.storybook/preview.tsx` — ไม่เกิด เพราะ tsconfig `include` แค่ `src`; ถ้า story file error ให้แก้ type ตาม error

- [ ] **Step 7: ตรวจด้วยตา**

```bash
yarn storybook
```

เปิด `http://localhost:6006` → Components/Button: ทุก story แสดงผล, สลับ Theme บน toolbar เป็น dark แล้วพื้นหลัง/สีปุ่มเปลี่ยน, focus ด้วย Tab แล้วเห็น outline. ปิด server (Ctrl+C)

- [ ] **Step 8: Commit**

```bash
git add .storybook src/components/Button/Button.stories.tsx package.json yarn.lock .gitignore
git commit -m "chore: add Storybook with theme toolbar and Button stories

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: CI + เอกสาร

**Files:**
- Modify: `.github/workflows/ci.yml`, `CLAUDE.md`, `.claude/rules/01-library-structure.md`, `.claude/rules/02-nextjs-compatibility.md`, `README.md`

**Interfaces:**
- Consumes: scripts `test`, `build-storybook`, `scripts/check-css.sh`, `scripts/check-dist.sh`
- Produces: CI ที่บังคับ DoD ของ spec (ใช้กับทุก PR ของช่วงถัดไป)

- [ ] **Step 1: แก้ `.github/workflows/ci.yml`**

แทนที่ส่วน steps หลัง `yarn install --immutable` ให้เป็น:

```yaml
      - run: yarn install --immutable
      - run: yarn typecheck
      - run: yarn test
      - run: yarn build
      - name: Check build output ('use client' banner, styles.css)
        run: sh scripts/check-dist.sh
      - name: Check component CSS uses tokens only
        run: sh scripts/check-css.sh
      - name: Check package contents
        run: yarn pack --dry-run
      - run: yarn build-storybook
```

(`setup-node` อ่าน `.nvmrc` อยู่แล้ว → ได้ Node 22 อัตโนมัติ ทั้ง `ci.yml` และ `publish.yml`)

- [ ] **Step 2: รันขั้นตอน CI ทั้งหมดในเครื่อง**

```bash
yarn install --immutable && yarn typecheck && yarn test && yarn build && sh scripts/check-dist.sh && sh scripts/check-css.sh && yarn pack --dry-run && yarn build-storybook
```

Expected: ผ่านทุกขั้น; ผล `yarn pack --dry-run` มีแค่ `dist/*`, `package.json`, `README.md`, `CHANGELOG.md` — **ไม่มี** `src/`, `*.stories.tsx`, `*.test.tsx`, `storybook-static/`, `.env*`

- [ ] **Step 3: อัปเดต `CLAUDE.md`**

- ตาราง Key facts: แถว `Node` เปลี่ยนเป็น `| Node | 22 LTS (dev/CI — `.nvmrc`); consumer ใช้ได้ตั้งแต่ 20 |`
- เพิ่มแถว: `| Test / Docs | Vitest + Testing Library + axe-core / Storybook 10 |`
- บล็อก Commands เพิ่มหลัง `yarn typecheck`:

```bash
yarn test            # vitest run
yarn test:watch      # vitest
yarn storybook       # http://localhost:6006
yarn build-storybook
sh scripts/check-css.sh   # component CSS ใช้ --bom-* เท่านั้น
sh scripts/check-dist.sh  # 'use client' + styles.css หลัง build
```

- เพิ่มบรรทัดใต้ Rules: `- [docs/superpowers/specs/2026-11-05-component-library-design.md](docs/superpowers/specs/2026-11-05-component-library-design.md) — แผนรวม component ทั้งชุด (5 ช่วง) และ Definition of Done`

- [ ] **Step 4: อัปเดต `.claude/rules/01-library-structure.md`**

- ในโครงสร้างโฟลเดอร์ แทนบล็อก `src/` ด้วย:

```
├── .storybook/                      # main.ts, preview.tsx (theme toolbar)
├── scripts/
│   ├── release.sh                   # bump + commit + tag
│   ├── check-css.sh                 # component CSS ห้ามมีสี hardcode
│   └── check-dist.sh                # 'use client' + styles.css หลัง build
├── src/
│   ├── components/
│   │   └── Button/
│   │       ├── Button.tsx           # 'use client' + forwardRef + displayName
│   │       ├── Button.css           # bom-btn, bom-btn--<modifier> ใช้ var(--bom-*) เท่านั้น
│   │       ├── Button.test.tsx      # Vitest + Testing Library + axe
│   │       ├── Button.stories.tsx   # Storybook (default export meta ได้เฉพาะไฟล์นี้)
│   │       └── index.ts
│   ├── lib/cn.ts                    # internal helper (ไม่ export)
│   ├── styles/tokens.css            # --bom-* tokens light/dark
│   ├── test-utils/                  # setup.ts, axe.ts
│   └── index.ts                     # public API — export ทุกอย่างจากที่นี่
├── vite.config.ts                   # ใช้ร่วม Vitest + Storybook (ไม่เกี่ยวกับ tsup)
```

- หัวข้อ `tsup.config.ts`: แทนตัวอย่าง `onSuccess: copyFile(...)` ด้วยข้อความ: "`onSuccess: bundleCss` — รวม `src/styles/tokens.css` + `src/components/<Name>/<Name>.css` (เรียงตามชื่อ) เป็น `dist/styles.css` component ใหม่ไม่ต้องแก้ config แค่ตั้งชื่อไฟล์ CSS ให้ตรงชื่อโฟลเดอร์"
- บรรทัด "ใช้ tsup 8.x + TypeScript 5.x (tsup 9 ต้องการ Node ≥ 22)" เปลี่ยนเป็น "ใช้ tsup 8.x + TypeScript 5.x; dev/CI ใช้ Node 22 (`.nvmrc`)"
- หัวข้อ Rules เพิ่ม: "- ทุก component ใช้ `forwardRef` (peer รองรับ React 18) ตั้ง `displayName` รับ `className` + `...props` — Definition of Done ดู spec"

- [ ] **Step 5: อัปเดต `.claude/rules/02-nextjs-compatibility.md`**

ในหัวข้อ Styling ข้อ 1 (Ship CSS แยก) เพิ่มต่อท้าย:

```markdown
   - สีและขนาดทั้งหมดมาจาก CSS variables ใน `src/styles/tokens.css` (`--bom-color-*`, `--bom-radius-*`, `--bom-space-*`, …) ปลายทาง override ได้ เช่น `:root { --bom-color-primary: #7c3aed; }`
   - Dark mode ตาม OS อัตโนมัติ หรือบังคับด้วย `<html data-theme="dark">` / `data-theme="light"`
   - CSS ของ component ห้ามมีสี hardcode — CI ตรวจด้วย `scripts/check-css.sh`
```

- [ ] **Step 6: อัปเดต `README.md`**

หลังบล็อกตัวอย่าง `<Button variant="primary">Save</Button>` เพิ่ม:

````markdown
### Button

```tsx
<Button variant="primary" size="md">Save</Button>
```

- `variant`: `primary` (ค่าเริ่มต้น) | `secondary` | `ghost` | `danger`
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

Dark mode ตามระบบปฏิบัติการอัตโนมัติ บังคับได้ด้วย `<html data-theme="dark">` หรือ `data-theme="light"`
````

และในหัวข้อ "พัฒนา" แทนบล็อกคำสั่งด้วย:

````markdown
```bash
nvm use          # Node 22 (.nvmrc)
yarn install
yarn dev         # tsup --watch
yarn test        # vitest
yarn storybook   # http://localhost:6006
yarn typecheck
yarn build
```
````

- [ ] **Step 7: Commit**

```bash
git add .github/workflows/ci.yml CLAUDE.md .claude/rules/01-library-structure.md .claude/rules/02-nextjs-compatibility.md README.md
git commit -m "ci: run tests, dist/css checks and Storybook build; document Phase 1 conventions

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Smoke test, PR และ release 0.2.0

> ขั้นตอน push / เปิด PR / merge / push tag เป็น action ภายนอก — ถามผู้ใช้ก่อนทำทุกครั้ง

**Files:**
- Modify: `CHANGELOG.md` (ตอน release บน `master`)

**Interfaces:**
- Consumes: ทุกอย่างจาก Task 1–5
- Produces: `@bomtawep/ui@0.2.0` บน GitHub Packages

- [ ] **Step 1: Smoke test ในแอป Next App Router**

```bash
yarn pack                      # → package.tgz ใน bom-ui
```

ในแอป Next ปลายทาง (ของจริงหรือ `npx create-next-app@latest` ชั่วคราวใน scratchpad):

```bash
yarn add @bomtawep/ui@file:/Users/taweewatphimhin/Documents/bom/bom-ui/package.tgz
```

`app/layout.tsx` เพิ่ม `import '@bomtawep/ui/styles.css'`; `app/page.tsx` (Server Component — ไม่มี `'use client'`):

```tsx
import { Button } from '@bomtawep/ui'

export default function Page() {
  return (
    <main style={{ display: 'flex', gap: 8, padding: 24 }}>
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost" size="sm">Ghost</Button>
      <Button variant="danger" size="lg">Danger</Button>
    </main>
  )
}
```

`yarn dev` → เปิดหน้า: ปุ่มแสดงครบ, console ไม่มี hydration warning, เพิ่ม `data-theme="dark"` ให้ `<html>` แล้วสีเปลี่ยน. ลบ `package.tgz` ทิ้งหลังทดสอบ (`*.tgz` อยู่ใน `.gitignore` แล้ว)

- [ ] **Step 2: Push branch + เปิด PR (ถามผู้ใช้ก่อน)**

```bash
git push -u origin feat/phase-1-foundation
gh pr create --base master --title "Phase 1: Foundation (tokens, Vitest, Storybook, Button refactor)" --body "<สรุปการเปลี่ยนแปลงตาม Task 1–5 + ผล smoke test>

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

รอ CI เขียวทั้งหมด แล้วให้ผู้ใช้ merge

- [ ] **Step 3: Release บน `master` (หลัง merge)**

```bash
git checkout master && git pull
```

แก้ `CHANGELOG.md` เพิ่มหัวข้อบนสุด (ใต้ `# Changelog`) ใช้วันที่วันที่ release จริง:

```markdown
## [0.2.0] - YYYY-MM-DD

### Added
- Design tokens (`--bom-*`) พร้อม dark mode (ตาม OS หรือ `<html data-theme>`)
- `Button`: prop `size` (`sm` | `md` | `lg`), variant `ghost` และ `danger`, รองรับ `ref`
- Type `ButtonSize`

### Changed
- `Button` ใช้สีจาก tokens — หน้าตา primary/secondary ใกล้เคียงเดิม และรองรับ dark mode
- `dist/styles.css` รวม tokens + CSS ของทุก component (import เหมือนเดิม)
- dev/CI ใช้ Node 22
```

```bash
yarn release minor        # → v0.2.0 (commit + tag)
git push --follow-tags    # ถามผู้ใช้ก่อน — trigger publish workflow
```

Expected: workflow `publish` เขียว และ `@bomtawep/ui@0.2.0` ปรากฏใน GitHub Packages
