# 04 — Registry & Publish (GitHub Packages)

## ทำไมใช้ registry ไม่ใช่ติดตั้งจาก git

| | git + `#semver:` | Registry (เลือกใช้) |
|---|---|---|
| ใน package.json | `git+ssh://...#semver:^2.18.4` | `^2.18.4` |
| ความเร็ว install | ช้า (clone + build) | เร็ว (ได้ไฟล์ที่ build แล้ว) |
| `yarn upgrade-interactive` / `yarn up` | ใช้ได้ไม่ดี | ใช้ได้ปกติ |
| CI ปลายทาง | ต้องตั้ง `git config insteadOf` | ตั้งแค่ `NPM_TOKEN` |

## Scope ต้องตรงกับ GitHub owner

GitHub Packages บังคับให้ npm scope = ชื่อ user/org ที่เป็นเจ้าของ repo
- repo อยู่ที่ `github.com/bomtawep/bom-ui` → ชื่อ package ต้องเป็น `@bomtawep/<name>` → ใช้ `@bomtawep/ui`
- ถ้าต้องการ `@bom/ui` ต้องย้าย repo ไปอยู่ใน GitHub org ชื่อ `bom` ก่อน แล้วแก้ชื่อ package + `npmScopes` ใน `.yarnrc.yml` ทุกที่

## Config ฝั่ง library

`package.json`:
```json
"publishConfig": { "registry": "https://npm.pkg.github.com" },
"repository": { "type": "git", "url": "git+https://github.com/bomtawep/bom-ui.git" }
```

`.yarnrc.yml` (commit ได้ — ไม่มี token จริง):
```yaml
npmScopes:
  bomtawep:
    npmRegistryServer: "https://npm.pkg.github.com"
    npmAuthToken: "${NPM_TOKEN:-}"
    npmMinimalAgeGate: 0
```

- Yarn 4 **ไม่อ่าน `.npmrc`** และ `actions/setup-node` `registry-url` เขียน `.npmrc` ให้ → ไม่มีผลกับ yarn ห้ามพึ่งมัน
- `${NPM_TOKEN:-}` = อ่านจาก env ถ้าไม่มีจะเป็นค่าว่าง (install ปกติไม่พัง)

## `.github/workflows/publish.yml`

```yaml
name: publish
on:
  push:
    tags: ['v*']

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: yarn
      - name: Verify tag matches package.json version
        run: |
          PKG_VERSION="v$(node -p "require('./package.json').version")"
          [ "$PKG_VERSION" = "$GITHUB_REF_NAME" ] || exit 1
      - run: yarn install --immutable
      - run: yarn test
      - name: Publish                       # prepack = typecheck + build
        run: |
          if [[ "$GITHUB_REF_NAME" == *-* ]]; then
            yarn npm publish --tag beta
          else
            yarn npm publish
          fi
        env:
          NPM_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Rules:
- publish ด้วย `GITHUB_TOKEN` (มีสิทธิ์ `packages: write` ใน repo ตัวเอง) ส่งเข้าเป็น env `NPM_TOKEN` — ไม่ต้องสร้าง PAT สำหรับ publish
- ใช้ `yarn npm publish` (ไม่ใช่ `npm publish`) — `prepack` จะ typecheck + build ให้ก่อน pack
- ห้าม publish ด้วยมือจากเครื่อง dev ยกเว้นกรณีฉุกเฉินที่ตกลงกันแล้ว
- Pre-release: tag ที่มี `-` เช่น `v2.19.0-beta.0` จะ publish ด้วย `--tag beta`

## `.github/workflows/ci.yml` (ทุก PR)

ต้องรัน `yarn install --immutable` → `yarn typecheck` → `yarn test` → `yarn build` → `check-dist.sh` → `check-css.sh` → `yarn pack --dry-run` → `yarn build-storybook` เพื่อตรวจว่าไฟล์ที่จะ publish ครบ (มี `dist/`, ไม่มี `src/` หรือไฟล์ลับ)

## การมองเห็น package

- package ของ private repo จะเป็น private โดยค่าเริ่มต้น
- ให้ repo อื่นดึงได้: GitHub → Package settings → **Manage Actions access** → เพิ่ม repo ปลายทาง (ให้ CI ปลายทางใช้ `GITHUB_TOKEN` ได้)

## ทางเลือก: GitLab Package Registry

ถ้าย้ายไป GitLab ให้เปลี่ยน `npmRegistryServer` (และ `publishConfig.registry`) เป็น
`https://<gitlab-host>/api/v4/projects/<PROJECT_ID>/packages/npm/`
และส่ง `CI_JOB_TOKEN` เป็น `NPM_TOKEN` ใน CI
