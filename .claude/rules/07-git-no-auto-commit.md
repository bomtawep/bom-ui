# 07 — Git: Claude ห้าม commit เอง

ผู้ใช้เป็นคน commit เองเสมอ Claude (และ subagent ทุกตัว) แก้ไฟล์ได้แต่ **ห้ามสร้างประวัติ git หรือส่งอะไรออกไปเอง**

## ห้ามรัน เว้นแต่ผู้ใช้สั่งชัด ๆ ในข้อความนั้น

- `git commit` (รวม `--amend`)
- `git merge`, `git rebase`, `git cherry-pick`, `git revert`, `git reset` (ทุกโหมด)
- `git tag`, `git push`
- `yarn release` (มัน commit + tag ให้)
- `gh pr create` / `gh pr merge`

"สั่งชัด" = ข้อความล่าสุดของผู้ใช้ระบุการกระทำนั้นตรง ๆ เช่น "commit เลย", "push ได้", "เปิด PR" — อนุญาตครั้งเดียวใช้ได้ครั้งเดียว ไม่นับรวมไปถึงงานถัดไป

## ทำได้

- แก้ / สร้าง / ลบไฟล์ใน working tree
- `git status`, `git diff`, `git log`, `git show` (อ่านอย่างเดียว)
- `git checkout -b` / `git switch` สร้างหรือสลับ branch — ต้องแจ้งผู้ใช้ และห้ามทำถ้า working tree มีงานค้างที่จะหาย

## เมื่อทำงานเสร็จ

ทิ้งการเปลี่ยนแปลงไว้ใน working tree แล้วสรุปให้ผู้ใช้:
1. รายการไฟล์ที่เปลี่ยน
2. ผลการตรวจ (`yarn typecheck`, `yarn test`, `yarn build`, `sh scripts/check-dist.sh`, `sh scripts/check-css.sh`)
3. ข้อความ commit ที่เสนอ (conventional commit)

## ลำดับความสำคัญ

- ข้อนี้ **override** ขั้นตอน "Commit" ใน plan (`docs/superpowers/plans/*`) และใน skill ใด ๆ (เช่น superpowers writing-plans, subagent-driven-development, finishing-a-development-branch)
- ทุก dispatch ไป subagent ต้องระบุว่า "ห้าม commit / push — ทิ้งการเปลี่ยนแปลงไว้ใน working tree"
- งานแบบหลาย task ที่เคยใช้ BASE/HEAD commit สำหรับ review ให้ใช้ `git diff` ของ working tree (หรือ `git stash`-free snapshot ด้วย `git diff > file`) แทน
