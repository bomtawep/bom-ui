# 06 — Security & Tokens

## Token ที่ใช้

| ใช้ทำอะไร | Token | สิทธิ์ขั้นต่ำ | เก็บที่ |
|---|---|---|---|
| Publish (CI ของ bom-ui) | `GITHUB_TOKEN` (อัตโนมัติ) ส่งเป็น env `NPM_TOKEN` | `packages: write` | ไม่ต้องสร้าง |
| Install บนเครื่อง dev | PAT (classic) | `read:packages` | env `NPM_TOKEN` ใน shell profile |
| Install ใน CI ปลายทาง | `GITHUB_TOKEN` + Manage Actions access หรือ PAT | `read:packages` | secret `GH_PKG_TOKEN` |
| Install ใน Docker | ตัวเดียวกับ CI | `read:packages` | BuildKit `--secret` |

## Rules

- workflow publish ของ bom-ui ต้องใช้ `secrets.GITHUB_TOKEN` เท่านั้น **ห้ามเปลี่ยนเป็น PAT** — PAT ที่มีแค่ `read:packages` หรือ fine-grained PAT (GitHub Packages npm registry ไม่รองรับ) จะ fail ด้วย `permission_denied: The token provided does not match expected scopes`
- PAT `read:packages` (เช่น `BOM_UI_TOKEN` / `GH_PKG_TOKEN`) ใช้สำหรับ **install ในโปรเจกต์ปลายทาง** เท่านั้น และต้องเป็น **classic** PAT
- **ห้าม** commit token ในไฟล์ใด ๆ — `.yarnrc.yml` ต้องใช้ `"${NPM_TOKEN:-}"` (และ `.npmrc` ถ้ามี ใช้ `${NPM_TOKEN}`) เท่านั้น
- Yarn ≥ 4.18 ปิด install scripts ของ dependency เป็นค่าเริ่มต้น — อย่าเปิด `enableScripts: true` ทั้ง repo (tsup/esbuild ทำงานได้โดยไม่ต้องรัน install script)
- **ห้าม** ใส่ token ใน `package.json` หรือ URL ของ dependency
- **ห้าม** ส่ง token เข้า Docker ผ่าน `ARG` / `ENV` / `COPY .npmrc` ที่มีค่าจริง — ใช้ `RUN --mount=type=secret` และ multi-stage build เพื่อไม่ให้ token ติดใน image สุดท้าย
- ให้สิทธิ์น้อยที่สุด: token สำหรับ install ใช้แค่ `read:packages` ห้ามใช้ token ที่มีสิทธิ์ write/admin
- ตั้งวันหมดอายุให้ PAT และหมุนเวียน (rotate) เป็นระยะ
- ถ้า token หลุด: revoke ทันทีที่ GitHub → Settings → Developer settings แล้วสร้างใหม่
- `.gitignore` ของ repo นี้ต้องมี `.env*` และ `*.tgz` (ไฟล์จาก `yarn pack`)
- ก่อน publish ตรวจด้วย `yarn pack --dry-run` ว่าไม่มีไฟล์ลับหรือ `.env` ติดไปใน package
