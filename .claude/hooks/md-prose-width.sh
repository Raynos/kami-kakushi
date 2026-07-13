#!/usr/bin/env bash
# PostToolUse(Edit|Write) advisory — markdown prose wraps at ~72 chars.
#
# Why a HOOK and not a gate: the norm (AGENTS.md "Markdown prose width") is a
# SUGGESTION on purpose. A hard verify gate on markdown width would cry wolf on
# the things that legitimately exceed it — CJK glyphs, long URLs/paths, and
# table rows that physically cannot wrap — and a red build over a soft norm just
# trains everyone to SKIP_VERIFY=1. But the violations are BORN in agent
# Edit/Write calls, so that is where feedback can fire soundly. Per the repo's
# "push each rule to the highest rung that can SOUNDLY hold it" doctrine, the
# honest rung here is an advisory hook.
#
# Why it REPORTS and never rewrites: a PostToolUse that reflowed the file would
# invalidate the agent's next Edit (whose old_string must match byte-for-byte).
# So it hands back a list; the agent reflows with `pnpm run md:wrap <file>`.
#
# Why --new-only: the norm says "apply to new/edited docs; don't mass-retrofit
# existing ones". md-wrap only reports lines this working tree ADDED vs HEAD, so
# touching one line of a 300-line 80-wide archive doc doesn't dump 40 complaints
# about prose nobody in this session wrote.
#
# Contract: reads the PostToolUse JSON on stdin, inspects .tool_input.file_path.
# Exit 2 + stderr = advisory shown to the agent (the write ALREADY happened —
# this never blocks). Exit 0 = clean/not applicable.
# Escape: SKIP_MDWRAP=1.

set -euo pipefail

[ "${SKIP_MDWRAP:-}" = "1" ] && exit 0

file="$(jq -r '.tool_input.file_path // empty' 2>/dev/null || true)"
[ -z "$file" ] && exit 0
case "$file" in
  *.md) ;;
  *) exit 0 ;;
esac

# This is THIS REPO's norm — it has no business judging a .md that lives outside
# it (another project's docs, ~/.claude memory files, a scratch note in /tmp).
# Without this guard the hook fired on an agent-memory file under ~/.claude and
# reported all 20 of its lines, since `git diff` can't scope a file it can't see.
root="${CLAUDE_PROJECT_DIR:-}"
[ -n "$root" ] || exit 0
case "$file" in
  "$root"/*) ;;
  *) exit 0 ;;
esac

# Records + machine-written + other agents' trees are none of our business.
case "$file" in
  *node_modules/*|*/.claude/worktrees/*) exit 0 ;;
  */project/playtest-inbox/*) exit 0 ;;  # machine-written by the capture middleware
  */project/archive/*|*/project/journal/*/_*) exit 0 ;;
  *.gen.md) exit 0 ;;
esac

[ -f "$file" ] || exit 0
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

out="$(npx tsx src/scripts/md-wrap.ts --check --new-only "$file" 2>&1)" && exit 0

cat >&2 <<EOF
Markdown prose width (~72, AGENTS.md) — lines YOU just wrote run long:

$out

Advisory, not a blocker — the write already landed. Reflow with:
  pnpm run md:wrap "$file"
Exempt by design (not reported): tables, headings, code fences, and any line
whose overflow is one unbreakable token (a long URL or path) — for those,
shorten the path or use a reference-style link; no wrap width can fold them.
Escape: SKIP_MDWRAP=1
EOF
exit 2
