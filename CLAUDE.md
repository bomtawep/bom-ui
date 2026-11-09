# bom-ui

React component library สำหรับ Next.js (App Router + Pages Router) ที่ publish ไปยัง **GitHub Packages (npm registry)**
เพื่อให้หลายโปรเจกต์ติดตั้งแบบ semver ปกติได้:

```json
"@bomtawep/ui": "^2.18.4"
```

## Key facts

| Item | Value |
|---|---|
| Package name | `@bomtawep/ui` (scope **ต้อง** ตรงกับ GitHub owner `bomtawep`) |
| Repo | `github.com/bomtawep/bom-ui` |
| Registry | `https://npm.pkg.github.com` |
| Package manager | **Yarn 4** (`4.18.1`, pinned via `yarnPath` ใน `.yarnrc.yml`, `nodeLinker: node-modules`) — ห้ามใช้ npm/pnpm ใน repo นี้ |
| Build tool | `tsup` 8.x (ESM + CJS + `.d.ts`) |
| Output | `dist/` (ไม่ commit — registry เก็บไฟล์ที่ build แล้ว) |
| Release trigger | push git tag `v*` → GitHub Actions publish |
| Node | 22 LTS (dev/CI — `.nvmrc`); consumer ใช้ได้ตั้งแต่ 20 |
| Test / Docs | Vitest + Testing Library + axe-core / Storybook 10 |

## Rules

อ่าน rule ที่เกี่ยวข้องก่อนแก้ไขส่วนนั้น:

- [.claude/rules/01-library-structure.md](.claude/rules/01-library-structure.md) — โครงสร้างโปรเจกต์, `package.json`, `tsup`, exports
- [.claude/rules/02-nextjs-compatibility.md](.claude/rules/02-nextjs-compatibility.md) — `'use client'`, peerDependencies, styling, Server Components
- [.claude/rules/03-versioning-release.md](.claude/rules/03-versioning-release.md) — semver, `yarn release`, tag, changelog
- [.claude/rules/04-registry-publish.md](.claude/rules/04-registry-publish.md) — GitHub Packages, publish workflow (CI)
- [.claude/rules/05-consumer-setup.md](.claude/rules/05-consumer-setup.md) — วิธีติดตั้งในโปรเจกต์ปลายทาง (`.npmrc`, CI, Docker)
- [.claude/rules/06-security-tokens.md](.claude/rules/06-security-tokens.md) — การจัดการ token / secret
- [.claude/rules/07-git-no-auto-commit.md](.claude/rules/07-git-no-auto-commit.md) — Claude ห้าม commit / push / release เอง
- [docs/superpowers/specs/2026-11-05-component-library-design.md](docs/superpowers/specs/2026-11-05-component-library-design.md) — แผนรวม component ทั้งชุด (5 ช่วง) และ Definition of Done

## Commands

```bash
yarn install         # ใช้ yarn ตัวไหนก็ได้ (แม้แต่ 1.x global) — จะถูกส่งต่อไป .yarn/releases/yarn-4.18.1.cjs
yarn build           # tsup → dist/
yarn dev             # tsup --watch
yarn typecheck       # tsc --noEmit
yarn test            # vitest run
yarn test:watch      # vitest
yarn storybook       # http://localhost:6006
yarn build-storybook
sh scripts/check-css.sh   # component CSS ใช้ --bom-* เท่านั้น
sh scripts/check-dist.sh  # 'use client' + styles.css หลัง build
yarn pack --dry-run  # ดูไฟล์ที่จะ publish
yarn release patch   # bump + commit + git tag (ดู 03-versioning-release)
git push --follow-tags
```

## Non-negotiables

1. `react`, `react-dom`, `next` เป็น **peerDependencies** เสมอ ห้ามอยู่ใน `dependencies`
2. Component ที่ใช้ hooks / event handlers ต้องรองรับ `'use client'`
3. ห้าม publish ด้วยมือจากเครื่อง dev — publish ผ่าน CI เมื่อ push tag เท่านั้น
4. ห้าม commit token ใด ๆ (`.yarnrc.yml` / `.npmrc` อ้าง `${NPM_TOKEN}` เท่านั้น)
5. ทุก public component ต้อง export ผ่าน `src/index.ts`
6. Yarn 4 **ไม่อ่าน `.npmrc`** — config registry/auth ต้องอยู่ใน `.yarnrc.yml` (`npmScopes`)
7. **Claude ห้าม commit เอง** — ห้าม `git commit` / `merge` / `rebase` / `reset` / `tag` / `push` / `yarn release` / `gh pr` เว้นแต่ผู้ใช้สั่งชัด ๆ ในข้อความนั้น ให้ทิ้งงานไว้ใน working tree แล้วเสนอข้อความ commit (override ขั้น Commit ใน plan/skill ทุกตัว — ดู [07](.claude/rules/07-git-no-auto-commit.md))
