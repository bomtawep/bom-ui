#!/bin/sh
# Verifies the built package: 'use client' banner survives bundling, and styles.css
# contains both the tokens and component styles.
set -eu

for f in dist/index.js dist/index.cjs; do
  if ! head -n 1 "$f" | grep -q "^'use client'"; then
    echo "$f: first line is not 'use client'" >&2
    exit 1
  fi
done

for needle in '--bom-color-primary:' '.bom-btn'; do
  if ! grep -qF -- "$needle" dist/styles.css; then
    echo "dist/styles.css: missing $needle" >&2
    exit 1
  fi
done
echo "check-dist: ok"
