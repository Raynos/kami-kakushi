#!/usr/bin/env bash
# /ship's whole release train in ONE script — HUMAN-INVOKED via /ship only.
# Agents never run this autonomously (a deploy is the human's sign-off).
#
#   bash src/scripts/ship.sh [patch|minor|x.y.z]   bump → commit → tag → push → build → deploy
#   bash src/scripts/ship.sh --verify-live          one bounded check: is the live site serving HEAD?
#
# LEAN BY DESIGN (human, 2026-07-05): one judgment step lives outside this
# script — drafting the CHANGELOG section (the skill does it BEFORE calling;
# this script refuses to release without it). Everything else is mechanical
# and lives HERE: no confirms, no journal, no snapshot ripple — the tag +
# CHANGELOG + the versioned gh-pages deploy commit ARE the release record.
# Nothing polls; nothing waits on GitHub Pages; every network op is bounded.
#
# RESUME: the version tag is the completion marker. If package.json's current
# version has NO tag, a previous run half-finished — this run CONTINUES it
# (no double-bump). Each step checks whether its outcome already exists.
#
# ISOLATION: the deploy builds from a persistent detached worktree of HEAD
# (tmp/ship/wt) — never the shared working tree — so co-agents' WIP can't
# leak into a release and the deploy label is truthful. node_modules survives
# between ships; `pnpm install` reruns only when pnpm-lock.yaml's hash changes.
# Verification is the HOOKS' job (pre-commit + pre-push run the full roster).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PAGES_URL="${PAGES_URL:-https://raynos.github.io/kami-kakushi/}"
GH_WT="${GH_PAGES_WORKTREE:-$REPO_ROOT/../gh-pages-kami-kakushi}"
WT="$REPO_ROOT/tmp/ship/wt"
LOCK_STAMP="$REPO_ROOT/tmp/ship/lockhash"
CURL_MAX=15
export GIT_SSH_COMMAND="ssh -o ConnectTimeout=10 -o ServerAliveInterval=10 -o ServerAliveCountMax=3"

cd "$REPO_ROOT"

T0=$(date +%s)
STEP_T=$T0
step() {
  local now
  now=$(date +%s)
  if [ -n "${LAST_STEP:-}" ]; then echo "  ✓ ${LAST_STEP} ($((now - STEP_T))s)"; fi
  LAST_STEP="$1"
  STEP_T=$now
  echo "▸ $1 …"
}

# ── optional single-shot live check (never a loop) ──────────────────────────
# Greps match the real minified bundle: constants fold into the footer
# template (`v0.3.7 · build abc1234`) — unquoted version + `build <sha>`.
if [ "${1:-}" = "--verify-live" ]; then
  VERSION="v$(node -p "require('./package.json').version")"
  SHA="$(git rev-parse --short HEAD)"
  html="$(curl -fsS --max-time "$CURL_MAX" "${PAGES_URL}?ship=$(date +%s)" 2>/dev/null || true)"
  js_path="$(grep -oE 'assets/index-[^"]+\.js' <<<"$html" | head -1 || true)"
  js="$(curl -fsS --max-time "$CURL_MAX" "${PAGES_URL}${js_path}?ship=$(date +%s)" 2>/dev/null || true)"
  if grep -qF "$VERSION" <<<"$js" && grep -qF "build $SHA" <<<"$js"; then
    echo "✓ LIVE: $PAGES_URL serves $VERSION · build $SHA"
  else
    echo "· not (yet) serving $VERSION @ $SHA — Pages propagates in minutes; re-run whenever."
    exit 1
  fi
  exit 0
fi

# ── 1 · version: bump, or resume a half-finished release ────────────────────
step "version"
CUR="$(node -p "require('./package.json').version")"
BUMP="${1:-patch}"
case "$BUMP" in
  patch | minor)
    if git rev-parse -q --verify "refs/tags/v$CUR" >/dev/null; then
      IFS=. read -r MA MI PA <<<"$CUR" # vCUR shipped → fresh release
      [ "$BUMP" = patch ] && NEW="$MA.$MI.$((PA + 1))" || NEW="$MA.$((MI + 1)).0"
    else
      NEW="$CUR" # no tag for CUR ⇒ a previous run half-finished — continue it
      echo "  resuming v$NEW (bumped but never tagged)"
    fi
    ;;
  *.*.*) NEW="${BUMP#v}" ;;
  *)
    echo "✗ expected patch | minor | x.y.z | --verify-live (got: $BUMP)" >&2
    exit 1
    ;;
esac
echo "  v$CUR → v$NEW"

# ── 2 · the one judgment gate: the CHANGELOG section must already exist ─────
grep -qF "## [$NEW]" CHANGELOG.md || {
  echo "✗ CHANGELOG.md has no '## [$NEW]' section — draft it first (the /ship skill's one job)." >&2
  exit 1
}

# ── 3 · release commit (pathspec: exactly the two release files) ────────────
step "release commit + tag"
[ "$(node -p "require('./package.json').version")" != "$NEW" ] && pnpm pkg set version="$NEW" >/dev/null
if ! git diff --quiet -- package.json CHANGELOG.md; then
  SKIP_JOURNAL=1 SKIP_ATTRIB=1 git commit -q -m "chore(release): v$NEW

See CHANGELOG.md § [$NEW]. Released via /ship (human-invoked)." -- package.json CHANGELOG.md
fi
SHA="$(git rev-parse --short HEAD)"
git rev-parse -q --verify "refs/tags/v$NEW" >/dev/null || git tag "v$NEW"

# ── 4 · push main + tag (pre-push verify fires — the release gate) ──────────
step "push main + v$NEW"
git push origin main "v$NEW"

# ── 5 · isolated build + deploy (persistent worktree; ci on lock change) ────
step "worktree → HEAD"
mkdir -p "$REPO_ROOT/tmp/ship"
if [ -d "$WT" ] && git -C "$WT" rev-parse --git-dir >/dev/null 2>&1; then
  git -C "$WT" checkout --quiet --detach "$SHA"
  git -C "$WT" reset --quiet --hard "$SHA"
else
  git worktree remove --force "$WT" 2>/dev/null || true
  git worktree prune 2>/dev/null || true
  git worktree add --quiet --detach "$WT" HEAD
fi

step "deps"
LOCK_HASH="$(shasum -a 256 "$WT/pnpm-lock.yaml" | cut -d' ' -f1)"
if [ -d "$WT/node_modules" ] && [ -f "$LOCK_STAMP" ] && [ "$(cat "$LOCK_STAMP")" = "$LOCK_HASH" ]; then
  echo "  node_modules reused (lockfile unchanged)"
else
  (cd "$WT" && pnpm install --frozen-lockfile --prefer-offline)
  printf '%s' "$LOCK_HASH" >"$LOCK_STAMP"
fi

step "build + DEV-strip gate + gh-pages push"
GH_PAGES_WORKTREE="$GH_WT" bash "$WT/src/scripts/gh-pages.sh"

step "done"
echo "✓ shipped v$NEW (main $SHA) — total $(($(date +%s) - T0))s. Live check: ship.sh --verify-live"
