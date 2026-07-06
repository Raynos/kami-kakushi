#!/usr/bin/env bash
# PreToolUse(Bash) guard — shared-tree safety warns + the never-push-red block.
#
# Replaces the three hookify rules (no-tree-mutation, no-skip-verify-push,
# warn-shell-write-source), which fired on BOTH PreToolUse and PostToolUse —
# hookify has no pre-only mode, so every hit injected its message twice.
# This native hook fires once, pre only.
#
# Contract: reads the PreToolUse JSON on stdin, inspects .tool_input.command.
# - SKIP_VERIFY + git push  → exit 2 (block) with a stderr explanation.
# - tree-mutating git cmds / shell-redirect into src/ → exit 0 with a
#   {"systemMessage": ...} warn (non-blocking), same shape hookify emitted.
# Exits 0 silently otherwise.

set -euo pipefail

cmd="$(jq -r '.tool_input.command // empty' 2>/dev/null || true)"
[ -z "$cmd" ] && exit 0

has() { printf '%s' "$cmd" | grep -qE "$1"; }

# A command boundary: start-of-string or after ; | & (handles && and |, too).
B='(^|[;&|])[[:space:]]*'

# ── BLOCK: SKIP_VERIFY combined with git push — never push red ──────────────
if has 'SKIP_VERIFY=[^[:space:]]+.*git[[:space:]]+push' || has 'git[[:space:]]+push.*SKIP_VERIFY='; then
  cat >&2 <<'EOF'
BLOCKED by .claude/hooks/guard-bash-safety.sh: SKIP_VERIFY with git push.

SKIP_VERIFY=1 is for local commits only — the pre-push gate must run, and a
red push never goes to main. If the tree is red from another agent's WIP,
leave your commit local and note it in project/status/project-status.md.
EOF
  exit 2
fi

warns=""
add_warn() { warns="${warns:+$warns

}$1"; }

# ── WARN: tree-mutating git commands (shared tree — other agents' WIP) ──────
# stash / restore / reset --hard / clean -f are always flagged; checkout and
# switch are flagged unless they only create a branch (-b/-B, -c/-C).
tree_mut=0
has "${B}git[[:space:]]+(stash|restore)([[:space:]]|$)" && tree_mut=1
has "${B}git[[:space:]]+reset[[:space:]]+([^;&|]*[[:space:]])?--hard([[:space:]]|$)" && tree_mut=1
has "${B}git[[:space:]]+clean[[:space:]]+([^;&|]*[[:space:]])?(-[A-Za-z]*f[A-Za-z]*|--force)([[:space:]]|$)" && tree_mut=1
if has "${B}git[[:space:]]+(checkout|switch)([[:space:]]|$)" \
  && ! has "${B}git[[:space:]]+(checkout[[:space:]]+-[bB]|switch[[:space:]]+-[cC])([[:space:]]|$)"; then
  tree_mut=1
fi
if [ "$tree_mut" = 1 ]; then
  add_warn '🌲 Shared tree: this command can discard another agent'\''s WIP. Only proceed on paths/branches you authored this session; to inspect, use read-only `git show` / `git diff` instead.'
fi

# ── WARN: shell redirection into src/ — author source via Write/Edit ────────
if has "(^|[;&|[:space:]])(cat|echo|printf|tee)[^|;&]*>>?[[:space:]]*'?src/"; then
  add_warn '🪵 Shell redirection into `src/` — author source with Write (new file) or Edit (change) instead: redirects skip Read-before-edit and produce no reviewable diff. `tmp/` is exempt.'
fi

if [ -n "$warns" ]; then
  jq -n --arg m "$warns" '{systemMessage: $m}'
fi

exit 0
