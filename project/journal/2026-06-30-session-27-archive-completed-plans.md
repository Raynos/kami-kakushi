# Session 27 — 2026-06-30 — archive the two completed v0.3 plans

**Summary:** Relayed the session-start human-queue brief, then archived the two
**completed** plans out of `docs/plans/` so the dir holds only live work. No
game-code change; not a canon change.

## What changed
- `git mv` two finished plans → `project/archive/` (per the session-12/13
  completed-plan archival precedent):
  - `2026-06-30-history-rewrite.md` — DONE (force-pushed, backups deleted).
  - `2026-06-29-overnight-v03-completion.md` — the session-19 overnight mandate;
    all movements A–E landed (battery report, T0-M4 breadth, M2·8 fork
    retirement, R1 rewrite).
- Repointed the one live cross-ref in `project/status/project-status.md` to the
  archive path.
- **`docs/plans/` now holds only `2026-06-30-v0.3.1-build.md`** — the approved,
  not-yet-started R4-feedback build. Clean end state: the plans dir contains only
  live / pre-canon work.

Commit `28ae378` (the archival + repoint).

## Shared-tree state at checkpoint (why nothing was pushed)
A co-agent is **actively** editing the tree this session: their work landed as
`d554db3` (session-brief autonomous-task nudge + session-26 journal), and there
are still **uncommitted** edits in flight to `AGENTS.md` + the session-26
journal. My archival sits *below* `d554db3` (they built on top of it). Per the
shared-tree non-negotiables I staged only my own files by explicit path, left
their WIP untouched, and **did not push** — pushing would carry their in-flight
session's commit and fire the pre-push gate against a tree someone else is mid-edit
on. Local commits are durable; the next clean push (theirs or a later one) carries
them to `origin`.

## Next intended steps
1. Push `main` once the shared tree is clean (carries `28ae378` + this entry).
2. Resume the greenlit **v0.3.1 build** (`docs/plans/2026-06-30-v0.3.1-build.md`,
   Step 1 — DEV panel + variant-toggle infra).
