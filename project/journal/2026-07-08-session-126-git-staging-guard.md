# Session 126 — Harden the shared-index commit-sweep guard

**Date:** 2026-07-08
**Focus:** Close the hole that let a bare commit sweep a co-agent's staged
files (`.claude/hooks/guard-git-add-all.sh`).

## Context

Earlier this session a bare `git commit` (`0e10d96`) snapshotted the shared
index and swept **6 files a co-agent had staged** (graphics wind-down journal,
BACKLOG migration, review/archive edits) under my commit message. Recovered
cleanly with `git reset --soft HEAD~1` (no co-agent work lost; the index was
restored exactly). The human then asked: can we finally ban staging / force
everyone down `git commit -- <files>`?

## What I found

The guard the human was asking for **already existed** and already blocked
broad staging (`git add -A/./--all`), `git commit -a/-am`, **and** bare
`git commit`. So the real question was: **how did `0e10d96` get past it?**

**The hole:** the bare-commit check looked for a ` -- ` pathspec token
**anywhere in the whole command string**, not just inside the `git commit`
segment. A compound like `git diff --cached -- some/path && git commit -m "…"`
(bare) sailed through — the *diff's* pathspec satisfied the check. A ` -- `
inside the commit **message** could false-allow too.

Corrected the human's framing along the way: banning `git add` alone would
**not** have stopped this — the trigger was the bare commit sweeping the shared
index, not the `add`. And a *total* `git add` ban is impossible: `git commit --
<path>` can't stage an **untracked** file (`pathspec did not match any file(s)
known to git`), so new files always need `git add`.

## What I did

Rewrote the guard (`.claude/hooks/guard-git-add-all.sh`):

1. **Closed the compound/message hole** — the ` -- ` pathspec must now live
   *inside* the isolated `git commit` segment (up to the next `;`/`&`/`|`), with
   quoted strings stripped first, so neither a sibling command's ` -- ` nor a
   ` -- ` in the message can false-allow a bare commit.
2. **Block `git add` of an already-TRACKED file** (human chose max teeth) —
   edits don't need staging; commit them directly with `git commit -- <path>`.
   New/untracked files still pass. Directories and globs are **deliberately
   allowed** (may hold new files — blocking them would cry wolf; the human
   accepted this tradeoff).
3. **Block `git add -u / --update`** (stages all tracked edits — broad like -A).
4. Rewrote the `deny()` guidance + file header to teach the pathspec workflow
   accurately.

## Verification

17-case matrix (incident scenario, message-embedded ` -- `, compound
inspect+commit, tracked/untracked/dir/glob adds, `-u`, `-N` intent, `-u`
substring in a filename, amend, SKIP_SWEEPGUARD escape, non-git commands) — all
pass. `bash -n` clean. Dogfooded: committed this work via the pathspec form.

## Doc ripple

Rippled the enforced policy into the two canonical git-hygiene docs so the
written norm matches the guard:

- **AGENTS.md** (always-loaded) — sharpened the Checkpoint "shared-tree safety"
  non-negotiable: commit ONLY by pathspec; bare `git commit` / `git add
  -A/-a/-u` / `git add` of a tracked file all sweep the shared index; `git add`
  is for NEW files only; named `guard-git-add-all.sh` + the `SKIP_SWEEPGUARD=1`
  escape.
- **working-agreements.md** — updated Checkpoint step 1, the shared-tree-safety
  rule, and the multi-agent-coordination note: `-u` added to the broad-form
  ban, the "don't `git add` a tracked file" rule made explicit, and the
  `0e10d96` recurrence recorded alongside f84aff9.

## Next intended steps

- None blocking. Guard is active for all agents (hooks re-read per invocation).
- If the tracked-file block proves too chatty on dirs/globs in practice,
  revisit — but it's tuned to only fire on a concrete tracked-file token.
- No ADR filed — this is process/tooling hardening, not a design decision.
  Offer one if the human wants it in the decisions log.
