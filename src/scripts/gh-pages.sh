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

# 1b. ship-hygiene gate (D-067, extended for the D-075 variant harness): the DEV play-API
#     (__qa — speed cheats + jump-to teleports) AND the DEV panel + variant harness (ui/dev.ts,
#     stamped with DEV_SENTINEL = __KAMI_DEV_PANEL__) are gated on `import.meta.env.DEV` and
#     dead-code-eliminated in prod. REFUSE to publish a bundle that leaked either — a shipped
#     __qa hands players cheats, and a leaked variant harness ships the non-default UI variants
#     (prod must ship ONLY the self-picked default — zero flag-debt, D-075). A deploy GATE that
#     can't be forgotten.
echo "▸ verifying DEV tools + variant harness are stripped from the prod bundle…"
for marker in "__qa" "__KAMI_DEV_PANEL__"; do
  if grep -lF "$marker" "$REPO_ROOT/dist/assets/"*.js >/dev/null 2>&1; then
    echo "✗ DEV marker '$marker' leaked into the prod bundle — refusing to deploy." >&2
    echo "  Keep DEV-only code behind 'import.meta.env.DEV' (src/app/main.ts, src/ui/dev.ts)." >&2
    exit 1
  fi
done
echo "  ✓ no DEV markers (__qa / variant harness) in the prod bundle."

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
