# Button `variant="sparkle"` — Design

- วันที่: 2026-11-06
- สถานะ: อนุมัติแล้ว (brainstorming, เลือกแบบ A "Aurora shimmer" จาก mockup)
- Semver: **minor** (เพิ่ม variant ใหม่ ไม่เปลี่ยนของเดิม)

## เป้าหมาย

ปุ่มฟรุ้งฟริ้งสำหรับ CTA เด่น ๆ เป็น variant ใหม่ของ `Button` — variant เดิม (`primary | secondary | ghost | danger`) ไม่เปลี่ยน

```tsx
<Button variant="sparkle">Get started</Button>
```

## หน้าตา

- พื้นหลัง gradient ม่วง → ชมพู → ส้ม → ม่วง (110deg) ขนาด 300% ไหลวนช้า ๆ ตลอดเวลา (6s linear infinite)
- Hover: แสงวาบสีขาวโปร่งแสงพาดผ่านจากซ้ายไปขวา 0.7s
- ตัวอักษรสีขาว; ขนาด / padding / focus ring / disabled opacity เหมือน variant อื่น
- ไม่ฝังไอคอนหรือ emoji — ผู้ใช้ใส่เองใน `children`

## Tokens (`src/styles/tokens.css`)

เพิ่มในบล็อก `:root, [data-theme='light']` เท่านั้น — dark / system ใช้ค่าเดียวกัน (gradient อ่านได้บนพื้นทั้งสองแบบ) จึงไม่ต้องซ้ำในบล็อก dark

| Token | ค่า |
|---|---|
| `--bom-color-sparkle-1` | `#7c3aed` |
| `--bom-color-sparkle-2` | `#db2777` |
| `--bom-color-sparkle-3` | `#ea580c` |
| `--bom-color-sparkle-fg` | `#ffffff` |
| `--bom-color-sparkle-shine` | `rgb(255 255 255 / 0.55)` |

ส้มใช้ `#ea580c` แทน `#f59e0b` ใน mockup: contrast กับตัวอักษรขาว ≈ 3.6:1 (ผ่าน AA สำหรับตัวหนา/ตัวใหญ่ — ปุ่มใช้ weight 500+) ส่วน `#f59e0b` ≈ 2.1:1 ไม่ผ่าน

ปลายทางเปลี่ยนเป็นสีแบรนด์ได้ด้วยการ override 3 token สี

## CSS (`src/components/Button/Button.css`)

- `.bom-btn--sparkle`: `position: relative; isolation: isolate; overflow: hidden;` + gradient จาก token, `background-size: 300% 100%`, `animation: bom-btn-aurora 6s linear infinite`
- `.bom-btn--sparkle::after`: แถบแสง `linear-gradient(105deg, transparent 35%, var(--bom-color-sparkle-shine) 50%, transparent 65%)` เริ่มที่ `translateX(-120%)`, `pointer-events: none`
- `.bom-btn--sparkle:hover:not(:disabled)::after`: `translateX(120%)` พร้อม `transition: transform 0.7s ease` (ไม่มี transition ขากลับ → แสงไม่วิ่งย้อน)
- `.bom-btn--sparkle:disabled`: `animation: none`
- `@media (prefers-reduced-motion: reduce)`: ไม่มี animation และซ่อนแสงวาบ
- keyframes ชื่อ `bom-btn-aurora` (prefix `bom-` กันชนกับ CSS ของปลายทาง)
- ห้ามมีสี hardcode — ผ่าน `scripts/check-css.sh`

## Test / Story / Docs

- `Button.test.tsx`: เพิ่ม `'sparkle'` ใน `it.each` ของ variant + test a11y ของ sparkle
- `Button.stories.tsx`: เพิ่ม `'sparkle'` ใน array `variants` (แสดงใน Playground control, Variants, Disabled)
- README: เพิ่ม `sparkle` ในรายการ variant และ token ที่ override ได้
- CHANGELOG: เขียนตอน release

## นอกขอบเขต

ดาว/ประกายรอบปุ่ม (แบบ B), ขอบรุ้ง (แบบ C), การปรับ variant เดิม, prop ควบคุมความเร็ว/ปิด animation
