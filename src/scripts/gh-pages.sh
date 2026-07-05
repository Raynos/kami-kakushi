#!/usr/bin/env bash
# Build the site and publish it to the gh-pages worktree, then push.
#
#   pnpm run gh-pages                 (or: npm run gh-pages)
#   pnpm run gh-pages -- --force      redeploy even with no site changes
#
# The gh-pages branch lives in a sibling worktree whose ROOT is the published
# site (GitHub Pages → Settings → Pages → Deploy from a branch → gh-pages / root).
# Create it once with:
#   git worktree add --orphan -b gh-pages ../gh-pages-kami-kakushi
#
# --force / -f: when the freshly-built site is byte-identical to what's already
# published, push an EMPTY commit anyway. Use it to re-trigger the Pages build
# without any content change (e.g. after a Pages settings tweak).
#
# Override the worktree location with GH_PAGES_WORKTREE=/path pnpm run gh-pages
set -euo pipefail

FORCE=0
for arg in "$@"; do
  case "$arg" in
    --force | -f) FORCE=1 ;;
    *)
      echo "✗ unknown argument: $arg (expected --force / -f)" >&2
      exit 1
      ;;
  esac
done

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
bash "$REPO_ROOT/src/scripts/verify-dev-strip.sh"

# 2. sync the built site into the worktree ROOT; --delete drops stale files,
#    but never touch the worktree's .git pointer.
echo "▸ syncing dist/ → $WORKTREE …"
rsync -a --delete --exclude='.git' "$REPO_ROOT/dist/" "$WORKTREE/"

# 3. tell GitHub Pages not to run Jekyll (serve assets/ and any _-files verbatim).
touch "$WORKTREE/.nojekyll"

# 4. commit + push from the worktree. The deploy message carries the VERSION:
#    `git describe --tags` — the exact release tag (v0.3.6) when deploying a
#    tagged release, or vX.Y.Z-N-g<sha> for N commits past it (/ship creates
#    the tag at release; see .claude/skills/ship/SKILL.md). --always falls
#    back to the bare sha if no tag is reachable.
SHA="$(git rev-parse --short HEAD)"
DESCRIBE="$(git describe --tags --always)"
cd "$WORKTREE"
git add -A
if git diff --cached --quiet; then
  if [ "$FORCE" -eq 1 ]; then
    echo "▸ no site changes — forcing an empty commit (--force)…"
    git commit --allow-empty -m "deploy: $DESCRIBE (main $SHA, forced redeploy)"
    git push -u origin gh-pages
    echo "✓ published gh-pages @ $DESCRIBE (main $SHA, forced empty commit)"
    exit 0
  fi
  echo "✓ no site changes to publish."
  echo "  (pass --force to redeploy anyway: npm run gh-pages -- --force)"
  exit 0
fi
git commit -m "deploy: $DESCRIBE (main $SHA)"
git push -u origin gh-pages
echo "✓ published gh-pages @ $DESCRIBE (main $SHA)"
