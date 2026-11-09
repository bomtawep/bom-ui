#!/bin/sh
# Verifies the built package: 'use client' banner survives bundling, and the Tailwind CSS entry
# points exist (theme.css = shadcn theme + @source, source.css = @source only).
set -eu

for f in dist/index.js dist/index.cjs; do
  if ! head -n 1 "$f" | grep -q "^'use client'"; then
    echo "$f: first line is not 'use client'" >&2
    exit 1
  fi
done

for needle in '--primary:' '@custom-variant dark' '@source "./"' 'shadcn-tailwind.css'; do
  if ! grep -qF -- "$needle" dist/theme.css; then
    echo "dist/theme.css: missing $needle" >&2
    exit 1
  fi
done
grep -qF '@source "./"' dist/source.css || { echo "dist/source.css: missing @source" >&2; exit 1; }
test -f dist/shadcn-tailwind.css || { echo "dist/shadcn-tailwind.css missing" >&2; exit 1; }
echo "check-dist: ok"
