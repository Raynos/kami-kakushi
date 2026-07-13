#!/usr/bin/env bash
# push-main — the ADR-196 push mutex: claim the push lane, push, release.
#
# The measured thrash cycle (218 push rejects in 548 sessions): push →
# rejected → pull --rebase → FULL pre-push verify re-runs → another agent
# lands first → rejected again. One agent pushing at a time kills the loop.
#
# Held-lane behavior is the human ruling (ADR-196): LEAVE-LOCAL, never wait —
# "another push will happen eventually". So a held lane exits 0 with a note;
# the commits ride out with whoever pushes next.
#
# Usage: pnpm run push [-- <git push args>]   (default: origin main)
# The bare-`git push` block in guard-bash-safety.sh points here; the wrapper
# marks its own push with PUSH_CLAIMED=1 so the guard lets it through.

set -uo pipefail

repo="$(git rev-parse --show-toplevel)"
claim="pnpm exec tsx $repo/src/scripts/tree-claim.ts"

if ! $claim claim push --agent "push-main"; then
  echo "  - push lane HELD by a live agent — leaving commits LOCAL (ADR-196:"
  echo "    another push will carry them). Re-run 'pnpm run push' later."
  exit 0
fi
trap '$claim release push >/dev/null' EXIT

if [ $# -eq 0 ]; then
  PUSH_CLAIMED=1 git push origin main
else
  PUSH_CLAIMED=1 git push "$@"
fi
