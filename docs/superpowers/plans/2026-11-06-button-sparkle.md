# Button `sparkle` Variant Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** เพิ่ม `variant="sparkle"` (Aurora shimmer) ให้ `Button`

**Architecture:** เพิ่ม token สี sparkle ใน `tokens.css`, ขยาย union `ButtonVariant`, เพิ่ม class `.bom-btn--sparkle` ใน `Button.css` — Button.tsx สร้าง class `bom-btn--${variant}` อยู่แล้ว จึงแก้แค่ type

**Tech Stack:** เหมือน Phase 1 (Node 22, Vitest, tsup, Storybook)

Spec: [docs/superpowers/specs/2026-11-06-button-sparkle-design.md](../specs/2026-11-06-button-sparkle-design.md)

## Global Constraints

- ทุกคำสั่งรันด้วย Node 22 (`source ~/.nvm/nvm.sh && nvm use`), yarn เท่านั้น
- CSS ของ component ใช้ได้เฉพาะ `var(--bom-*)` — สีอยู่ใน `tokens.css` เท่านั้น
- keyframes ต้อง prefix `bom-`
- ไม่เปลี่ยน variant เดิม; semver minor
- ทำบน branch `feat/button-sparkle`

---

### Task 1: `sparkle` variant

**Files:**
- Modify: `src/styles/tokens.css`, `src/components/Button/Button.tsx`, `src/components/Button/Button.css`, `src/components/Button/Button.test.tsx`, `src/components/Button/Button.stories.tsx`, `README.md`, `.gitignore`

**Interfaces:**
- Produces: `type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'sparkle'`; class `bom-btn--sparkle`; tokens `--bom-color-sparkle-{1,2,3,fg,shine}`

- [ ] **Step 1: เขียน test (failing)**

ใน `Button.test.tsx` เปลี่ยน `it.each` ของ variant เป็น:

```tsx
  it.each(['primary', 'secondary', 'ghost', 'danger', 'sparkle'] as const)('applies the %s variant class', (variant) => {
```

และเพิ่มต่อจาก test `has no a11y violations`:

```tsx
  it('has no a11y violations for the sparkle variant', async () => {
    const { container } = render(<Button variant="sparkle">Get started</Button>)
    await expectNoA11yViolations(container)
  })
```

- [ ] **Step 2: รันให้ fail**

Run: `yarn typecheck`
Expected: FAIL — `Type '"sparkle"' is not assignable to type 'ButtonVariant'`

- [ ] **Step 3: แก้ type ใน `Button.tsx`**

```tsx
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'sparkle'
```

- [ ] **Step 4: เพิ่ม tokens** ใน `src/styles/tokens.css` บล็อก `:root, [data-theme='light']` ต่อจาก `--bom-color-info`:

```css
  /* sparkle variant — same in every theme; override to use brand colors */
  --bom-color-sparkle-1: #7c3aed;
  --bom-color-sparkle-2: #db2777;
  --bom-color-sparkle-3: #ea580c;
  --bom-color-sparkle-fg: #ffffff;
  --bom-color-sparkle-shine: rgb(255 255 255 / 0.55);
```

- [ ] **Step 5: เพิ่ม CSS** ท้าย `src/components/Button/Button.css`:

```css
/* sparkle — animated aurora gradient + shine sweep on hover */
.bom-btn--sparkle {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: linear-gradient(
    110deg,
    var(--bom-color-sparkle-1),
    var(--bom-color-sparkle-2),
    var(--bom-color-sparkle-3),
    var(--bom-color-sparkle-1)
  );
  background-size: 300% 100%;
  color: var(--bom-color-sparkle-fg);
  animation: bom-btn-aurora 6s linear infinite;
}

.bom-btn--sparkle::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 35%, var(--bom-color-sparkle-shine) 50%, transparent 65%);
  transform: translateX(-120%);
  pointer-events: none;
}

.bom-btn--sparkle:hover:not(:disabled)::after {
  transform: translateX(120%);
  transition: transform 0.7s ease;
}

.bom-btn--sparkle:disabled {
  animation: none;
}

@keyframes bom-btn-aurora {
  to {
    background-position: 300% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bom-btn--sparkle {
    animation: none;
  }

  .bom-btn--sparkle::after {
    display: none;
  }
}
```

- [ ] **Step 6: Story** — ใน `Button.stories.tsx`:

```tsx
const variants: ButtonVariant[] = ['primary', 'secondary', 'ghost', 'danger', 'sparkle']
```

- [ ] **Step 7: Docs** — README บรรทัดรายการ variant:

```markdown
- `variant`: `primary` (ค่าเริ่มต้น) | `secondary` | `ghost` | `danger` | `sparkle` (gradient เคลื่อนไหว + แสงวาบตอน hover สำหรับ CTA — หยุดเมื่อผู้ใช้ตั้ง reduced motion; เปลี่ยนสีได้ด้วย `--bom-color-sparkle-1/2/3`)
```

และเพิ่ม `.superpowers/` ใน `.gitignore` (ไฟล์ทำงานชั่วคราวของ brainstorming / SDD)

- [ ] **Step 8: Verify**

```bash
yarn typecheck && yarn test && yarn build && sh scripts/check-dist.sh && sh scripts/check-css.sh && grep -c "bom-btn--sparkle" dist/styles.css && yarn build-storybook
```

Expected: ผ่านทั้งหมด, tests 24 (Button 19 + cn 3 + axe 2), `bom-btn--sparkle` อยู่ใน `dist/styles.css`

- [ ] **Step 9: Commit**

```bash
git add -A src README.md .gitignore docs
git commit -m "feat(Button): add sparkle variant (aurora shimmer)"
```

- [ ] **Step 10: ตรวจด้วยตา** — `yarn storybook` → Components/Button/Variants: gradient ไหล, hover มีแสงวาบ, Disabled หยุดนิ่ง, Tab เห็น focus ring, toolbar dark ยังอ่านได้
