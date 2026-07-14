# Session 206 — 2026-07-14 — shared-tree git: the index is solved, worktrees are opt-in

**Summary:** The human asked whether agents should get **separate
staging areas** (`GIT_INDEX_FILE` + `git add -p`) to commit only their
own hunks in the shared tree, or whether `git commit -- <file>` is
enough. Investigated against a throwaway repo (not from memory) — the
answer is **`git commit -- <file>` is sufficient**, and hunk-level
staging is ruled out as a protocol. Landed **ADR-199** + a new guide
[`docs/guides/shared-tree-git.md`](../../docs/guides/shared-tree-git.md).
The human also ruled worktrees **opt-in by job size** — which turned out
to already be ADR-196's hybrid, missing only its operational half.

## What was verified (throwaway repo, not asserted from memory)

- **`git commit -- <path>` already IS a private index.** The `--only`
  form builds a temp index from HEAD + the named paths and never
  consults the shared one. `GIT_INDEX_FILE` + `read-tree HEAD` is the
  same trick by hand; the only delta is hunk granularity in one file.
- **`git commit --patch` SWEEPS.** It seeds its temp index from the
  **shared** index — it committed a co-agent's staged file verbatim. The
  sweep-guard blocks it (confirmed by probe); that block is right.
- **The rescue recipe works, with three silent traps** — all three hit
  during the investigation: a fresh `GIT_INDEX_FILE` is **empty** (a
  commit from it would delete the repo); adding a pathspec to the commit
  re-triggers `--only` and **discards the hunk selection** (committed
  both hunks); and afterwards the shared index still holds the
  pre-commit blob, so a co-agent's `git status` reads it as **a staged
  revert of your own hunk** (`git reset -q -- <paths>` fixes it without
  touching their staged entries).
- **Worktree costs, read off disk:** the live
  `.claude/worktrees/agent-…` has its **own `node_modules`**, and
  `:5173` is served from the **main tree root** — so worktree work is
  *not* reachable in the shared playtest (collides with PH6).

## The actual finding

The index was never the open problem. The **shared working tree** is: a
pathspec commit takes the *whole* working-tree copy of a file (so a
co-agent's uncommitted edits in that same file ride along), and `verify`
runs on the working tree while you commit a *different* tree — a green
gate proves the working tree green, not the committed one. Finer-grained
staging makes that **worse**, not better. Only isolation closes it,
which is exactly what ADR-196's hybrid already said.

## What changed

- `docs/guides/shared-tree-git.md` — **new.** The model (all three of
  HEAD/index/worktree are shared), the pathspec contract, the `git
  commit -p` trap, the `GIT_INDEX_FILE` rescue recipe + its three traps,
  and the worktree opt-in criteria + costs + landing.
- `docs/living/decisions/150.md` — **ADR-199** (3 decisions: pathspec is
  sufficient · hunk-staging is a rescue tool, not a protocol · worktrees
  opt-in by job size). Number reserved via `tree-claim.ts adr`.
- `project/status/working-agreements.md` — Checkpoint §1 gains the `git
  commit -p` warning + the rescue hatch + a pointer to the guide.
- `docs/repo-map.md` — the guide listed under `docs/guides/`.

## Next intended steps

1. Nothing to build — this closed as documentation. The worktree opt-in
   is now criteria an agent can act on without a further plan.
2. **Parked in [`BACKLOG.md`](../BACKLOG.md)** (leftover-work sweep): a
   worktree agent can't playtest through the shared `:5173`. The fix (a
   port-picking `pnpm run dev:worktree`) waits until worktree opt-in is
   actually used often enough to earn it.

## Landmines

- **Don't "improve" this into a hunk-level commit protocol.** ADR-199
  rules it out for a reason (the committed tree is one no gate ran
  against). It is a rescue tool for same-file tangles only.
- **A worktree agent cannot playtest through `:5173`** — that server
  serves the main tree. Playtest after landing, or run a private vite on
  another port (`KAMI_ALLOW_MULTI_DEV=1`); **never** kill the shared
  server.
- The rescue recipe's commit is textually bare, so it needs
  `SKIP_SWEEPGUARD=1` — safe *only* because the index is private. Ledger
  it.
