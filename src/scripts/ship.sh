#!/usr/bin/env bash
# /ship's mechanical train — HUMAN-INVOKED via the /ship skill ONLY.
# Agents must never run this autonomously: a deploy is outward-facing, and
# the /ship invocation IS the human sign-off (F9 plan §1; working-agreements).
#
#   bash src/scripts/ship.sh                the train: isolated build → deploy push. DONE at the push.
#   bash src/scripts/ship.sh --verify-live  OPTIONAL single-shot check: is the live site serving this build?
#
# FAST AND BOUNDED (human, 2026-07-05): the train never waits on GitHub
# Pages' propagation — exit 0 means the gh-pages push landed, full stop —
# and NOTHING polls, ever (--verify-live is ONE bounded check, no loop).
# No verify step either: pre-commit + pre-push already ran the full roster
# against the release commit (the hooks own verification, not the train).
# Every network op is timeout-bounded. Speed comes from a PERSISTENT temp
# worktree (tmp/ship/wt, gitignored): node_modules survives between ships
# and `npm ci` reruns only when package-lock.json's hash changes. Per-step
# timings print so a slow release says where it went.
#
# The isolation story is unchanged: the build runs from a detached worktree
# of HEAD — never the shared working tree — so the deploy ships exactly the
# committed release SHA and co-agents' WIP can't leak into a release. The
# TEMP WORKTREE'S copy of gh-pages.sh builds + DEV-strip checks + stamps from
# the temp tree (it derives REPO_ROOT from its own BASH_SOURCE);
# GH_PAGES_WORKTREE points it back at the real gh-pages worktree.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PAGES_URL="${PAGES_URL:-https://raynos.github.io/kami-kakushi/}"
GH_WT="${GH_PAGES_WORKTREE:-$REPO_ROOT/../gh-pages-kami-kakushi}"
WT="$REPO_ROOT/tmp/ship/wt"
LOCK_STAMP="$REPO_ROOT/tmp/ship/lockhash"
CURL_MAX=15 # seconds per HTTP fetch (--verify-live)

# Bound every git network op: connect ≤10s, a stalled transfer dies ≤30s.
export GIT_SSH_COMMAND="ssh -o ConnectTimeout=10 -o ServerAliveInterval=10 -o ServerAliveCountMax=3"

cd "$REPO_ROOT"

VERSION="v$(node -p "require('./package.json').version")"
SHA="$(git rev-parse --short HEAD)"

T0=$(date +%s)
STEP_T=$T0
step() { # step "label" — print the previous step's elapsed, start the next
  local now
  now=$(date +%s)
  if [ -n "${LAST_STEP:-}" ]; then
    echo "  ✓ ${LAST_STEP} ($((now - STEP_T))s)"
  fi
  LAST_STEP="$1"
  STEP_T=$now
  echo "▸ $1 …"
}
finish() {
  local now
  now=$(date +%s)
  echo "  ✓ ${LAST_STEP} ($((now - STEP_T))s)"
  echo "✓ $1 — total $((now - T0))s"
}

# ── the optional live check (ONE bounded shot — NEVER a poll loop) ──────────
# Grep shapes are dictated by the real minified bundle: the minifier folds the
# constants into the footer template (`v0.3.5 · build f8fc4f6`), so we grep
# the unquoted $VERSION and the `build $SHA` fragment (a bare 7-hex grep
# would false-positive on asset hashes).
verify_live() {
  echo "▸ one-shot check: does $PAGES_URL serve $VERSION @ $SHA ?"
  local html js_path js
  html="$(curl -fsS --max-time "$CURL_MAX" "${PAGES_URL}?ship=$(date +%s)" 2>/dev/null || true)"
  js_path="$(grep -oE 'assets/index-[^"]+\.js' <<<"$html" | head -1 || true)"
  if [ -n "$js_path" ]; then
    js="$(curl -fsS --max-time "$CURL_MAX" "${PAGES_URL}${js_path}?ship=$(date +%s)" 2>/dev/null || true)"
    if grep -qF "$VERSION" <<<"$js" && grep -qF "build $SHA" <<<"$js"; then
      echo "✓ LIVE: $PAGES_URL serves $VERSION · build $SHA"
      return 0
    fi
  fi
  echo "· not (yet) serving $VERSION @ $SHA — Pages propagation takes minutes (TTL ~10 min)." >&2
  echo "  The deploy is whatever was pushed; re-check whenever: bash src/scripts/ship.sh --verify-live" >&2
  return 1
}

if [ "${1:-}" = "--verify-live" ]; then
  verify_live
  exit $?
elif [ -n "${1:-}" ]; then
  echo "✗ unknown argument: $1 (expected --verify-live or nothing)" >&2
  exit 1
fi

# ── preflight (bounded fetch + ancestor check) ──────────────────────────────
step "preflight: HEAD ($SHA) on origin/main?"
git fetch --quiet origin
if ! git merge-base --is-ancestor HEAD origin/main; then
  echo "✗ HEAD ($SHA) is not an ancestor of origin/main — push main first." >&2
  exit 1
fi
if [ ! -e "$GH_WT/.git" ]; then
  echo "✗ gh-pages worktree not found at: $GH_WT" >&2
  exit 1
fi
DIRT="$(git status --porcelain | wc -l | tr -d ' ')"
[ "$DIRT" != "0" ] && echo "  (shared tree has $DIRT dirty path(s) — ignored: building HEAD in isolation)"

# ── persistent temp worktree of HEAD ────────────────────────────────────────
# Reused between ships (node_modules is the prize). Recreated only if absent
# or corrupt. Tracked files snap to HEAD via checkout+reset; untracked build
# output (dist/) is fine — vite empties it, rsync --delete squares the rest.
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

# ── deps: npm ci only when the lockfile changed ─────────────────────────────
step "deps"
LOCK_HASH="$(shasum -a 256 "$WT/package-lock.json" | cut -d' ' -f1)"
if [ -d "$WT/node_modules" ] && [ -f "$LOCK_STAMP" ] && [ "$(cat "$LOCK_STAMP")" = "$LOCK_HASH" ]; then
  echo "  node_modules reused (lockfile unchanged)"
else
  (cd "$WT" && npm ci --prefer-offline --no-audit --no-fund)
  printf '%s' "$LOCK_HASH" >"$LOCK_STAMP"
fi

# ── build + deploy (verification already happened: pre-commit + pre-push
#    ran the full roster against the release commit — the hooks own it) ──────
step "build + DEV-strip gate + gh-pages push"
GH_PAGES_WORKTREE="$GH_WT" bash "$WT/src/scripts/gh-pages.sh"

finish "shipped: $VERSION · build $SHA pushed to gh-pages (live-check: ship.sh --verify-live)"
