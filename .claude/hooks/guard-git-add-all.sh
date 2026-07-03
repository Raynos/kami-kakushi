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
    git commit -m "..." -- path/to/file1 path/to/file2

(git add -p, git commit --amend, and explicit-path adds are fine.)
EOF
  exit 2
}

deny_commit() {
  cat >&2 <<EOF
BLOCKED by .claude/hooks/guard-git-add-all.sh: bare 'git commit' (no ' -- <pathspec>')

This repo shares ONE git index across concurrent agents. A bare commit snapshots
that shared index — sweeping whatever a co-agent staged between your 'git add'
and now (f84aff9 did exactly this). Commit with an explicit pathspec instead:

    git add path/a path/b          # new files only; edits don't even need it
    git commit -m "..." -- path/a path/b

The pathspec form commits ONLY those paths (git's --only semantics: a temporary
index from HEAD + the named paths) and leaves co-agents' staged work untouched.
Escapes: '--amend' passes; a merge-in-progress passes (git forbids pathspec
commits mid-merge); SKIP_SWEEPGUARD=1 for a deliberate whole-index commit.
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

# git commit WITHOUT an explicit ' -- <pathspec>' — commits the SHARED index, sweeping
# whatever a co-agent staged between your 'git add' and your commit (bit us: f84aff9,
# a prettier-fail retry carried 4 of another agent's staged files). Require the
# canonical pathspec form: git commit -m "..." -- path/a path/b   (--only semantics).
# Heuristic: presence of a standalone ' -- ' token anywhere in the command; a commit
# MESSAGE containing ' -- ' can false-allow (rare; the pre-commit staged-set echo is
# the backstop). Allowed bare: --amend, merge-in-progress, SKIP_SWEEPGUARD=1.
if printf '%s' "$cmd" | grep -qE "${B}git[[:space:]]+commit([[:space:]]|$)" \
  && ! printf '%s' "$cmd" | grep -q 'SKIP_SWEEPGUARD=1' \
  && ! printf '%s' "$cmd" | grep -qE "${B}git[[:space:]]+commit[^;&|]*--amend" \
  && ! [ -e .git/MERGE_HEAD ] \
  && ! printf '%s' "$cmd" | grep -qE '[[:space:]]--([[:space:]]|$)'; then
  deny_commit
fi

exit 0
