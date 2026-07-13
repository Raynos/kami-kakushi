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
# Boundary tolerating leading env assignments (`FOO=1 git …`) — an env prefix
# must not smuggle a destructive git op past the anchor (it did, on record:
# `SKIP_SWEEPGUARD=1 git restore … .`).
BE='(^|[;&|])[[:space:]]*([A-Za-z_][A-Za-z_0-9]*=[^[:space:]]*[[:space:]]+)*'

# ── EXEMPT: isolated git worktrees (ADR-196) ────────────────────────────────
# A linked worktree (EnterWorktree / the render-split-class heavy jobs) is a
# private tree — mutations there can't sweep a co-agent. git-dir differs from
# git-common-dir only in a linked worktree.
gd="$(git rev-parse --git-dir 2>/dev/null || true)"
gcd="$(git rev-parse --git-common-dir 2>/dev/null || true)"
if [ -n "$gd" ] && [ -n "$gcd" ] && [ "$gd" != "$gcd" ]; then
  exit 0
fi

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

# ── BLOCK: bare `git push` — pushes go through the ADR-196 push mutex ───────
# `pnpm run push` (src/scripts/push-main.sh) claims the push lane, pushes, and
# releases; a held lane leaves commits local (the human ruling: never wait).
# The wrapper marks its own push PUSH_CLAIMED=1. Escape: SKIP_PUSHCLAIM=1.
if has "${BE}git[[:space:]]+push([[:space:]]|$)" \
  && ! has 'PUSH_CLAIMED=1' && ! has 'SKIP_PUSHCLAIM=1'; then
  cat >&2 <<'EOF'
BLOCKED by .claude/hooks/guard-bash-safety.sh: bare 'git push' (ADR-196 push mutex).

This tree serializes pushes — the measured thrash loop (push → reject →
rebase → full re-verify → reject) cost 218 rejects in 548 sessions. Use:

    pnpm run push            # claims the lane → pushes origin main → releases
    pnpm run push -- <args>  # same, custom refspec

If the lane is held by a live agent it leaves your commits LOCAL and exits
green — another push will carry them. Escape (rare): SKIP_PUSHCLAIM=1.
EOF
  exit 2
fi

# ── BLOCK: tree-wide destructive git ops (ADR-196 — no env escape) ──────────
# restore/checkout/stash/reset --hard/clean -f in TREE-WIDE form destroy
# co-agents' WIP wholesale (a real `SKIP_SWEEPGUARD=1 git restore --staged
# --worktree .` is on record). Named-path forms stay a warn below; tree-wide
# forms have NO escape var — naming explicit paths IS the escape. (Isolated
# worktrees already exited 0 above.)
deny_tree_wide() {
  cat >&2 <<EOF
BLOCKED by .claude/hooks/guard-bash-safety.sh: $1 (tree-wide destructive op).

This shared tree carries other agents' uncommitted WIP. A tree-wide
$1 destroys it wholesale. There is NO escape var for this (ADR-196) —
name the explicit paths you authored instead, e.g.:

    git restore --staged --worktree -- path/you/authored.ts
    git checkout -- path/you/authored.ts
    git stash push -- path/you/authored.ts
EOF
  exit 2
}
# restore/checkout with a whole-tree target token (. or :/)
if has "${BE}git[[:space:]]+(restore|checkout)([[:space:]]+[^;&|[:space:]]+)*[[:space:]]+(\.|:/)([[:space:]]|$)"; then
  deny_tree_wide "git restore/checkout ."
fi
# bare stash / stash push without an explicit ' -- <pathspec>'
if has "${BE}git[[:space:]]+stash([[:space:]]+push)?([[:space:]]+-[A-Za-z-]+)*[[:space:]]*([;&|]|$)"; then
  deny_tree_wide "git stash (whole-tree)"
fi
# reset --hard is whole-tree by nature
if has "${B}git[[:space:]]+reset[[:space:]]+([^;&|]*[[:space:]])?--hard([[:space:]]|$)"; then
  deny_tree_wide "git reset --hard"
fi
# clean -f with no explicit path token
clean_seg="$(printf '%s' "$cmd" | grep -oE "${B}git[[:space:]]+clean[^;&|]*" | head -1 || true)"
if [ -n "$clean_seg" ] && printf '%s' "$clean_seg" | grep -qE '(-[A-Za-z]*f[A-Za-z]*|--force)'; then
  rest="${clean_seg#*clean}"
  has_path=0
  for tok in $rest; do
    case "$tok" in -*) continue ;; *) has_path=1 ;; esac
  done
  [ "$has_path" = 0 ] && deny_tree_wide "git clean -f (no paths)"
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
