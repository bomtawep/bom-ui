# 03 — Versioning & Release

## Semantic Versioning

| เปลี่ยนอะไร | bump |
|---|---|
| แก้ bug ไม่เปลี่ยน API | `patch` (2.18.4 → 2.18.5) |
| เพิ่ม component / prop ใหม่ (backward compatible) | `minor` (2.18.4 → 2.19.0) |
| ลบ/เปลี่ยนชื่อ component หรือ prop, เปลี่ยน behavior เดิม, ขึ้น peer range | `major` (2.18.4 → 3.0.0) |

ผู้ใช้ติดตั้งด้วย `^x.y.z` → จะได้ minor/patch ใหม่อัตโนมัติ ดังนั้น **breaking change ใน minor/patch ห้ามเด็ดขาด**

## ขั้นตอนออกเวอร์ชัน

```bash
git checkout master && git pull
# แก้ CHANGELOG.md (ไม่ต้อง commit — release script จะ commit ไปพร้อมกัน)
yarn release patch                   # หรือ minor / major / prerelease / X.Y.Z
git push --follow-tags               # push tag → CI publish (ดู 04-registry-publish)
```

`yarn release` (= [scripts/release.sh](../../scripts/release.sh)) ทำตามลำดับ:
1. ตรวจว่า working tree สะอาด (ยกเว้น `CHANGELOG.md`)
2. `yarn typecheck` + `yarn build`
3. `yarn version <bump>` — Yarn 4 แก้แค่ `package.json` **ไม่** commit/tag ให้เหมือน `npm version`
4. commit `package.json` + `CHANGELOG.md` ด้วยข้อความ `vX.Y.Z` และสร้าง annotated tag `vX.Y.Z`

Rules:
- ใช้ `yarn release` เท่านั้น — ห้ามแก้ `version` ใน `package.json` ด้วยมือ และห้ามสร้าง tag ด้วยมือ
- Tag format: `vX.Y.Z` — workflow publish trigger ที่ `v*` และจะ fail ถ้า tag ไม่ตรงกับ `version` ใน package.json
- Pre-release: `yarn release prerelease` (2.18.4 → 2.18.5-0) หรือระบุตรง ๆ `yarn release 2.19.0-beta.0` — tag ที่มี `-` จะ publish ด้วย dist-tag `beta` (ผู้ใช้ `^2.18.4` จะไม่ได้ beta)
- ห้าม publish เวอร์ชันเดิมซ้ำ — registry ไม่ยอมให้ทับเวอร์ชันที่มีอยู่แล้ว ถ้าพลาดให้ออก patch ใหม่
- ห้ามลบ tag/เวอร์ชันที่ publish ไปแล้ว ถ้ามีปัญหาให้ deprecate (`npm deprecate @bomtawep/ui@x.y.z "<เหตุผล>"` — Yarn 4 ไม่มีคำสั่งนี้) แล้วออกเวอร์ชันแก้

## Changelog

- บันทึกการเปลี่ยนแปลงใน `CHANGELOG.md` ทุกครั้งก่อน `yarn release`
- หัวข้อ: `## [X.Y.Z] - YYYY-MM-DD` แบ่ง `Added / Changed / Fixed / Removed`
- Major version ต้องมีส่วน **Migration** อธิบายวิธีอัปเกรด
