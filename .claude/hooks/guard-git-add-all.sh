#!/usr/bin/env bash
# PreToolUse(Bash) guard — block over-broad git staging.
#
# Why: this repo is worked by MULTIPLE concurrent agents. `git add -A` / `git add .`
# / `git commit -am` stage files the current agent never touched, sweeping another
# agent's in-flight work into the wrong commit (it has bitten us repeatedly). Stage
# EXPLICIT paths instead: `git add path/to/file1 path/to/file2`.
#
# Contract: reads the PreToolUse JSON on stdin, inspects .tool_input.command, and
# exits 2 (blocking) with a stderr explanation if the command stages too broadly.
# Exits 0 (allow) otherwise. Only broad-staging is blocked — explicit pathspecs,
# `git add -p`, `git commit -m`, `git commit --amend`, status/diff/etc. all pass.

set -euo pipefail

cmd="$(jq -r '.tool_input.command // empty' 2>/dev/null || true)"
[ -z "$cmd" ] && exit 0

deny() {
  cat >&2 <<EOF
BLOCKED by .claude/hooks/guard-git-add-all.sh: "$1"

This repo is edited by multiple concurrent agents — broad staging sweeps another
agent's in-flight files into your commit. Stage EXPLICIT paths instead:

    git add path/to/file1 path/to/file2
    git commit <paths> -m "..."        # commit only those paths

(git add -p, git commit -m, git commit --amend, and explicit-path adds are fine.)
EOF
  exit 2
}

# A command boundary: start-of-string or after ; | & (handles && and |, too).
B='(^|[;&|])[[:space:]]*'

# git add -A  /  git add --all  /  combined short flags containing A (e.g. -Av)
if printf '%s' "$cmd" | grep -qE "${B}git[[:space:]]+add[[:space:]]+([^;&|]*[[:space:]])?(-A|--all|-[A-Za-z]*A[A-Za-z]*)([[:space:]]|$)"; then
  deny "git add -A / --all"
fi

# git add .   /  git add -- .   /  git add :/   (stage the whole tree)
if printf '%s' "$cmd" | grep -qE "${B}git[[:space:]]+add[[:space:]]+([^;&|]*[[:space:]])?(\.|:/)([[:space:]]|$)"; then
  deny "git add . (whole-tree staging)"
fi

# git commit -a / -am / --all  (stages all tracked modifications). Allow -m, --amend.
if printf '%s' "$cmd" | grep -qE "${B}git[[:space:]]+commit[[:space:]]+([^;&|]*[[:space:]])?(--all|-[A-Za-z]*a[A-Za-z]*)([[:space:]]|$)"; then
  deny "git commit -a / -am / --all"
fi

exit 0
