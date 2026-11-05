#!/bin/sh
# Component CSS must use --bom-* tokens only; raw colors belong in src/styles/tokens.css.
set -eu

if grep -rnE '#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\(' src/components --include='*.css'; then
  echo "Hardcoded colors found in component CSS — use var(--bom-color-*) from src/styles/tokens.css" >&2
  exit 1
fi
echo "check-css: ok"
