#!/bin/sh
# Bump version, commit, and create an annotated tag vX.Y.Z.
# Yarn 4's `yarn version` only edits package.json, so commit + tag are done here.
# Usage: yarn release <patch|minor|major|prerelease|X.Y.Z>
set -eu

BUMP="${1:-}"
if [ -z "$BUMP" ]; then
  echo "usage: yarn release <patch|minor|major|prerelease|X.Y.Z>" >&2
  exit 1
fi

# Only CHANGELOG.md may have uncommitted changes — it is committed together with the bump.
DIRTY="$(git status --porcelain | grep -v ' CHANGELOG.md$' || true)"
if [ -n "$DIRTY" ]; then
  echo "Working tree has uncommitted changes (other than CHANGELOG.md):" >&2
  echo "$DIRTY" >&2
  exit 1
fi

yarn typecheck
yarn build

yarn version "$BUMP"
VERSION="$(node -p "require('./package.json').version")"

git add package.json CHANGELOG.md
git commit -m "v$VERSION"
git tag -a "v$VERSION" -m "v$VERSION"

echo
echo "Created v$VERSION. Publish with: git push --follow-tags"
