# Changelog

## [Unreleased] — 1.0.0

### Changed (breaking)
- **ทุก component เป็นโค้ด shadcn/ui (style `radix-nova`, base `neutral`) บน Tailwind CSS v4** แทน plain CSS `--bom-*`
- peerDependencies: `react >=19`, `react-dom >=19`, **`tailwindcss ^4`**, `react-hook-form ^7.55.0`
- component เป็น function component + `data-slot` (React 19 ref-as-prop) — ไม่มี `forwardRef` / `displayName`
- CSS: `@bomtawep/ui/styles.css` ถูกลบ → `@import "@bomtawep/ui/theme.css"` (หรือ `source.css`) ใน CSS ของ Tailwind
- dark mode: `<html data-theme="dark">` → class `.dark`
- icons ใช้ `lucide-react`; `Tooltip` ต้องมี `TooltipProvider` (เหมือน shadcn); `Button` ไม่ตั้ง `type="button"` ให้เอง (เหมือน shadcn — ระบุ `type` ในฟอร์มเอง)

### Added
- component ทั้งชุดจาก poc-dof-pps (~35 shadcn components, `Sidebar`, `PageHeader`, `ErrorState`, `PdfPreview`), RHF* 11 ตัว และ `BomUIProvider` — รายการเต็มใน README
- `Empty` (+`EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`, `EmptyContent`), `AvatarGroup`, `AvatarBadge`, `AlertDialogMedia`, `TabsList variant="line"`, `CalendarDayButton`
- `getPageItems()` สำหรับ `Pagination`
- `messages.previous` / `messages.next` (ข้อความบนปุ่ม Pagination)
- dependencies: `cn`, `class-variance-authority`, `lucide-react`, `tw-animate-css`

### Removed
- `EmptyState` (ใช้ `Empty`), token `--bom-*`, class `bom-*`, `@bomtawep/ui/styles.css`

### Migration (0.x → 1.0.0)

1. อัปเกรดเป็น React 19 และติดตั้ง Tailwind CSS v4
2. แทน `import '@bomtawep/ui/styles.css'` ด้วย ใน `globals.css`:
   ```css
   @import "tailwindcss";
   @import "@bomtawep/ui/theme.css";
   ```
3. dark mode: `data-theme="dark"` → `class="dark"` (next-themes `attribute="class"`)
4. ครอบ app ด้วย `<TooltipProvider>` ถ้าใช้ `Tooltip` / `SidebarMenuButton tooltip`
5. เปลี่ยนชื่อ props:

| เดิม (0.x) | 1.0.0 |
|---|---|
| `Button variant="primary"` / `"danger"` | `"default"` / `"destructive"` (`"secondary"`, `"ghost"`, `"sparkle"` เหมือนเดิม; เพิ่ม `"outline"`, `"link"`) |
| `size="md"` (Button, Switch, SelectTrigger) | `"default"` |
| `IconButton size="md"` | `"default"` (`xs`/`sm`/`lg` ได้) |
| `Badge variant="primary/info/success/warning/danger"` | `default` / `secondary` / `destructive` / `outline` / `ghost` / `link` |
| `Alert variant="info/success/warning/danger"` | `default` / `destructive` (role เป็น `alert` เสมอ) |
| `Pagination page pageCount onPageChange` | `Pagination` > `PaginationContent` > `PaginationItem` > `PaginationLink` / `PaginationPrevious` / `PaginationNext` / `PaginationEllipsis` + `getPageItems()` |
| `EmptyState icon title description action` | `Empty` > `EmptyHeader` > `EmptyMedia` / `EmptyTitle` / `EmptyDescription` + `EmptyContent` |
| `Input size` | ลบ — ปรับด้วย `className` |
| `RHFSelect size="md"` | `"default"` |
| `--bom-color-primary` ฯลฯ | `--primary` ฯลฯ (ตัวแปร shadcn) |

## [0.1.0] - 2026-11-05

### Added
- `Button` component (`primary` / `secondary` variants)
- `@bomtawep/ui/styles.css`
- Build ด้วย tsup (ESM + CJS + types), publish ไป GitHub Packages เมื่อ push tag `v*`
