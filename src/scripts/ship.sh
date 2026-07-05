#!/usr/bin/env bash
# /ship's mechanical train — HUMAN-INVOKED via the /ship skill ONLY.
# Agents must never run this autonomously: a deploy is outward-facing, and
# the /ship invocation IS the human sign-off (F9 plan §1; working-agreements).
#
#   bash src/scripts/ship.sh                full train: isolated build → deploy → live proof
#   bash src/scripts/ship.sh --verify-live  re-poll the live-site proof only (no build, no deploy)
#
# The train builds from a DETACHED TEMP WORKTREE of HEAD (tmp/ship/wt) — never
# from the shared working tree — so the deploy ships exactly the committed
# release SHA: co-agents' uncommitted WIP can't leak into a release, and the
# gh-pages "deploy: site @ main <sha>" label is truthful by construction.
# Running the TEMP WORKTREE'S copy of gh-pages.sh makes it build + DEV-strip
# check + stamp from the temp tree unchanged (it derives REPO_ROOT from its
# own BASH_SOURCE); GH_PAGES_WORKTREE points it back at the real worktree.
#
# The deploy is NOT done until the live proof passes: the deployed bundle must
# serve both the new __VERSION__ and the release __BUILD_SHA__ (R3 — done is
# earned). A timeout exits nonzero saying "pushed but UNPROVEN"; recover with
# --verify-live once Pages' cache (~10 min TTL) catches up.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PAGES_URL="${PAGES_URL:-https://raynos.github.io/kami-kakushi/}"
GH_WT="${GH_PAGES_WORKTREE:-$REPO_ROOT/../gh-pages-kami-kakushi}"
WT="$REPO_ROOT/tmp/ship/wt"
POLL_INTERVAL="${SHIP_POLL_INTERVAL:-15}" # seconds between live-proof polls
POLL_MAX="${SHIP_POLL_MAX:-600}"          # give up after 10 min (Pages' max-age=600)

cd "$REPO_ROOT"

VERSION="v$(node -p "require('./package.json').version")"
SHA="$(git rev-parse --short HEAD)"

# ── the live proof ──────────────────────────────────────────────────────────
# Fetch index.html (cache-busted), find the hashed entry bundle, fetch it, and
# require BOTH the version string and the release short SHA. The SHA is the
# stronger proof — unique per build (vite.config.ts stamps both). NOTE the
# grep shapes are dictated by the real minified bundle (verified against the
# live v0.3.5 deploy): the minifier folds the constants into the footer
# template, so the bundle contains `v0.3.5 · build f8fc4f6`, NOT standalone
# quoted literals — we grep the unquoted `$VERSION` and the `build $SHA`
# fragment (a bare 7-hex grep would false-positive on asset hashes).
verify_live() {
  echo "▸ proving the live site serves $VERSION @ $SHA …"
  local waited=0 html js_path js
  while true; do
    html="$(curl -fsS "${PAGES_URL}?ship=$(date +%s)" 2>/dev/null || true)"
    js_path="$(grep -oE 'assets/index-[^"]+\.js' <<<"$html" | head -1 || true)"
    if [ -n "$js_path" ]; then
      js="$(curl -fsS "${PAGES_URL}${js_path}?ship=$(date +%s)" 2>/dev/null || true)"
      if grep -qF "$VERSION" <<<"$js" && grep -qF "build $SHA" <<<"$js"; then
        echo "✓ LIVE-PROVEN: $PAGES_URL serves $VERSION · build $SHA ($js_path)"
        return 0
      fi
    fi
    if [ "$waited" -ge "$POLL_MAX" ]; then
      echo "✗ UNPROVEN after ${POLL_MAX}s: the deploy is pushed, but the live site" >&2
      echo "  does not yet serve $VERSION @ $SHA (Pages cache TTL is ~10 min)." >&2
      echo "  Re-poll without rebuilding:  bash src/scripts/ship.sh --verify-live" >&2
      return 1
    fi
    sleep "$POLL_INTERVAL"
    waited=$((waited + POLL_INTERVAL))
    echo "  … still waiting (${waited}s / ${POLL_MAX}s)"
  done
}

if [ "${1:-}" = "--verify-live" ]; then
  verify_live
  exit $?
elif [ -n "${1:-}" ]; then
  echo "✗ unknown argument: $1 (expected --verify-live or nothing)" >&2
  exit 1
fi

# ── preflight ───────────────────────────────────────────────────────────────
# Deploy only a publicly-reachable commit: HEAD must be an ancestor of
# origin/main (guards the skill's push step — an unpushed release can't ship).
echo "▸ preflight: HEAD ($SHA) must be on origin/main …"
git fetch origin
if ! git merge-base --is-ancestor HEAD origin/main; then
  echo "✗ HEAD ($SHA) is not an ancestor of origin/main — push main first." >&2
  exit 1
fi
if [ ! -e "$GH_WT/.git" ]; then
  echo "✗ gh-pages worktree not found at: $GH_WT" >&2
  exit 1
fi
# Informational only — the temp worktree makes shared-tree dirt harmless.
DIRT="$(git status --porcelain | wc -l | tr -d ' ')"
[ "$DIRT" != "0" ] && echo "  (shared tree has $DIRT dirty path(s) — ignored: building from HEAD in isolation)"

# ── isolated build + deploy ─────────────────────────────────────────────────
cleanup() {
  git worktree remove --force "$WT" 2>/dev/null || true
  git worktree prune 2>/dev/null || true
}
trap cleanup EXIT
cleanup # clear a stale worktree from a previous crashed run

echo "▸ temp worktree of HEAD → $WT …"
mkdir -p "$REPO_ROOT/tmp/ship"
git worktree add --detach "$WT" HEAD

echo "▸ npm ci (honest deps from the shipped lockfile) …"
(cd "$WT" && npm ci --prefer-offline --no-audit --no-fund)

echo "▸ verify — the committed snapshot, green in isolation …"
(cd "$WT" && npm run verify)

echo "▸ build + DEV-strip gate + deploy (temp worktree's gh-pages.sh) …"
GH_PAGES_WORKTREE="$GH_WT" bash "$WT/src/scripts/gh-pages.sh"

# ── the proof ───────────────────────────────────────────────────────────────
verify_live
echo "✓ shipped: $VERSION · build $SHA · $PAGES_URL"
