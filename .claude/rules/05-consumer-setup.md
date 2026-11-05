# 05 — Consumer Setup (โปรเจกต์ Next.js ที่ใช้ library)

ใช้ rule นี้เมื่อเขียน README / docs ให้โปรเจกต์ปลายทาง หรือช่วยตั้งค่าโปรเจกต์ที่ติดตั้ง `@bomtawep/ui`
ค่าเริ่มต้นคือโปรเจกต์ปลายทางใช้ **Yarn 4** — ถ้าใช้ npm / Yarn 1 ดูหัวข้อ "ถ้าไม่ได้ใช้ Yarn 4"

## 1. `.yarnrc.yml` ที่ root ของโปรเจกต์ปลายทาง (commit ได้)

```yaml
nodeLinker: node-modules

npmScopes:
  bomtawep:
    npmRegistryServer: "https://npm.pkg.github.com"
    npmAuthToken: "${NPM_TOKEN:-}"
    npmAlwaysAuth: true
    npmMinimalAgeGate: 0
```

- package ใน scope `@bomtawep/` ไปหาที่ GitHub Packages ส่วน package อื่นยังมาจาก registry ปกติ
- token อ่านจาก env — **ห้าม** ใส่ token จริงในไฟล์
- `npmMinimalAgeGate: 0` — Yarn ≥ 4.18 จะไม่ติดตั้งเวอร์ชันที่ publish มาไม่ถึง 1 วันเป็นค่าเริ่มต้น ปิดเฉพาะ scope ของเราเพื่อให้ใช้เวอร์ชันใหม่ได้ทันที (scope อื่นยังได้รับการป้องกันตามปกติ)
- Yarn 4 **ไม่อ่าน `.npmrc`** — ถ้าใส่ไว้ใน `.npmrc` อย่างเดียวจะได้ 404

## 2. ติดตั้ง

```bash
yarn add @bomtawep/ui
```

```json
"dependencies": { "@bomtawep/ui": "^2.18.4" }
```

```tsx
import { Button } from '@bomtawep/ui'
import '@bomtawep/ui/styles.css' // ครั้งเดียวใน app/layout.tsx
```

อัปเดต: `yarn up @bomtawep/ui` หรือ `yarn upgrade-interactive`

## 3. เครื่อง dev

สร้าง GitHub Personal Access Token (classic) สิทธิ์ `read:packages` แล้วตั้งใน shell profile:

```bash
export NPM_TOKEN=<token>
```

## 4. CI (GitHub Actions)

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: yarn
- run: yarn install --immutable
  env:
    NPM_TOKEN: ${{ secrets.GH_PKG_TOKEN }}
- run: yarn build
```

- ถ้าเพิ่ม repo ปลายทางใน **Manage Actions access** ของ package แล้ว ใช้ `${{ secrets.GITHUB_TOKEN }}` แทนได้ (ต้องมี `permissions: packages: read`)
- ไม่งั้นใช้ PAT `read:packages` เก็บเป็น secret `GH_PKG_TOKEN`

## 5. Docker build

ส่ง token เป็น BuildKit secret — ห้ามใช้ `ARG`/`ENV` (ค้างอยู่ใน image layer)

```dockerfile
# syntax=docker/dockerfile:1
FROM node:20 AS deps
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/releases ./.yarn/releases
RUN --mount=type=secret,id=npm_token \
    NPM_TOKEN=$(cat /run/secrets/npm_token) yarn install --immutable

FROM node:20 AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
CMD ["node", "server.js"]
```

```bash
docker build --secret id=npm_token,env=NPM_TOKEN -t my-app .
```

GitHub Actions + `docker/build-push-action`:
```yaml
secrets: |
  npm_token=${{ secrets.GH_PKG_TOKEN }}
```

- image `node:20` มี yarn 1 ติดมา ซึ่งจะส่งต่อไป `.yarn/releases/*` ผ่าน `yarnPath` เอง (ถ้าโปรเจกต์ปลายทางใช้ Corepack แทน ให้ `RUN corepack enable` ก่อน)
- ต้องตั้ง `output: 'standalone'` ใน `next.config` สำหรับ stage สุดท้าย

## ถ้าไม่ได้ใช้ Yarn 4

npm และ Yarn 1 ใช้ `.npmrc` แทน `.yarnrc.yml`:

```
@bomtawep:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

แล้ว `npm i @bomtawep/ui` / `yarn add @bomtawep/ui` ตามปกติ

## Troubleshooting

| อาการ | สาเหตุ |
|---|---|
| `404 Not Found - @bomtawep/ui` | ไม่มี `npmScopes.bomtawep` ใน `.yarnrc.yml` (หรือใส่ไว้แค่ใน `.npmrc` ซึ่ง Yarn 4 ไม่อ่าน) / scope ไม่ตรง |
| `401 Unauthorized` | `NPM_TOKEN` ไม่ได้ตั้ง / หมดอายุ / ไม่มี `read:packages` |
| `permission_denied: The token provided does not match expected scopes` | token เป็น fine-grained PAT (ไม่รองรับ) หรือ classic PAT ที่ขาด scope — install ต้องมี `read:packages`, publish ต้องใช้ `GITHUB_TOKEN` ของ repo bom-ui |
| หาเวอร์ชันล่าสุดไม่เจอ ทั้งที่ publish แล้ว | ติด age gate ของ Yarn ≥ 4.18 — ตั้ง `npmMinimalAgeGate: 0` ใต้ scope |
| `Invalid hook call` | React ซ้ำ 2 ชุด — ตรวจว่า library ใส่ react เป็น peerDependency |
| Error เรื่อง hooks ใน Server Component | bundle ขาด `'use client'` |
| class Tailwind ไม่มีผล | ปลายทางไม่ได้ให้ Tailwind scan `node_modules/@bomtawep/ui/dist` |
