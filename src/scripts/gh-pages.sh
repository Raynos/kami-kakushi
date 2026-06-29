#!/usr/bin/env bash
# Build the site and publish it to the gh-pages worktree, then push.
#
#   pnpm run gh-pages      (or: npm run gh-pages)
#
# The gh-pages branch lives in a sibling worktree whose ROOT is the published
# site (GitHub Pages → Settings → Pages → Deploy from a branch → gh-pages / root).
# Create it once with:
#   git worktree add --orphan -b gh-pages ../gh-pages-kami-kakushi
#
# Override the worktree location with GH_PAGES_WORKTREE=/path pnpm run gh-pages
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
WORKTREE="${GH_PAGES_WORKTREE:-$REPO_ROOT/../gh-pages-kami-kakushi}"

cd "$REPO_ROOT"

# 0. sanity — the worktree must exist and be on the gh-pages branch.
if [ ! -e "$WORKTREE/.git" ]; then
  echo "✗ gh-pages worktree not found at: $WORKTREE" >&2
  echo "  Create it with:" >&2
  echo "    git worktree add --orphan -b gh-pages \"$WORKTREE\"" >&2
  exit 1
fi
WT_BRANCH="$(git -C "$WORKTREE" symbolic-ref --short HEAD)"
if [ "$WT_BRANCH" != "gh-pages" ]; then
  echo "✗ worktree at $WORKTREE is on '$WT_BRANCH', not 'gh-pages'." >&2
  exit 1
fi

# 1. build — tsc typecheck + vite build → dist/ (relative base, set in vite.config.ts).
echo "▸ building…"
npm run build

# 1b. ship-hygiene gate (D-067): the DEV play-API (__qa — speed cheats + jump-to teleports) is
#     gated on `import.meta.env.DEV` and dead-code-eliminated in prod. REFUSE to publish a bundle
#     that leaked it — a shipped __qa hands players speed-cheats/teleports and bloats the bundle.
#     (Pushes the "DEV tools are prod-stripped" norm up to a deploy GATE that can't be forgotten.)
echo "▸ verifying DEV tools are stripped from the prod bundle…"
if grep -lF "__qa" "$REPO_ROOT/dist/assets/"*.js >/dev/null 2>&1; then
  echo "✗ DEV play-API (__qa) leaked into the prod bundle — refusing to deploy." >&2
  echo "  Keep the __qa install behind 'if (import.meta.env.DEV)' in src/app/main.ts." >&2
  exit 1
fi
echo "  ✓ no __qa in the prod bundle."

# 2. sync the built site into the worktree ROOT; --delete drops stale files,
#    but never touch the worktree's .git pointer.
echo "▸ syncing dist/ → $WORKTREE …"
rsync -a --delete --exclude='.git' "$REPO_ROOT/dist/" "$WORKTREE/"

# 3. tell GitHub Pages not to run Jekyll (serve assets/ and any _-files verbatim).
touch "$WORKTREE/.nojekyll"

# 4. commit + push from the worktree.
SHA="$(git rev-parse --short HEAD)"
cd "$WORKTREE"
git add -A
if git diff --cached --quiet; then
  echo "✓ no site changes to publish."
  exit 0
fi
git commit -m "deploy: site @ main $SHA"
git push -u origin gh-pages
echo "✓ published gh-pages @ main $SHA"
