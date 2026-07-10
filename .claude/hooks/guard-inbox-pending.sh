#!/usr/bin/env bash
# PreToolUse(Edit|Write) guard — pending inbox .md files are MACHINE-WRITTEN.
#
# Why: the capture middleware (src/scripts/playtest-inbox.ts) owns
# project/playtest-inbox/pending/*.md — it appends entries and auto-commits on
# every capture, so a hand-edit races a live capture and can be half-swept into
# the middleware's own commit. Drain state does NOT belong there either: the
# durable per-item fields (lane/surface/status/fb/commit) live on each capture's
# <stamp>.json sidecar (ADR-171), written via src/scripts/inbox-regroup.ts /
# the drain flow — never by editing the .md. Completion is the pending/->archive/
# git mv, not an .md edit.
#
# Contract: reads the PreToolUse JSON on stdin, inspects .tool_input.file_path,
# exits 2 (blocking) with a stderr explanation, else 0 (allow). BLOCKS: Edit/Write
# targeting pending/*.md (the bucket/session files). PASSES: the sidecar .json
# (that's the sanctioned home), archive/ files, the README.
# Escape: SKIP_INBOX_GUARD=1 (e.g. repairing a corrupted file with the human).

set -euo pipefail

[ "${SKIP_INBOX_GUARD:-}" = "1" ] && exit 0

file="$(jq -r '.tool_input.file_path // empty' 2>/dev/null || true)"
[ -z "$file" ] && exit 0

case "$file" in
  *project/playtest-inbox/pending/*.md)
    cat >&2 <<EOF
BLOCKED by .claude/hooks/guard-inbox-pending.sh: "$file"

pending/*.md is MACHINE-WRITTEN (the capture middleware appends + auto-commits
it; a hand-edit races a live capture). Drain state goes on the capture's own
<stamp>.json sidecar instead:
  - re-lane / surface:  tsx src/scripts/inbox-regroup.ts assign <lane> <stamp...>
  - done/parked/fb:     the drain flow writes them (see drain-inbox SKILL.md §5)
  - completion:         git mv pending/<key>* -> archive/ (never an .md edit)
Escape hatch (repair with the human): SKIP_INBOX_GUARD=1
EOF
    exit 2
    ;;
esac
exit 0
