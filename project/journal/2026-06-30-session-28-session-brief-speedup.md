# Session 28 — 2026-06-30 — make the session brief fast & lean

**Summary:** Acted on live human feedback that a cold session start was too
heavy (~27s) and that the brief padded one plan into three "tasks". Reworded the
`session-brief.sh` nudge (+ its AGENTS.md mirror) so the brief is fast and lists
real parallel work. No game-code change; not a canon change.

## What changed
- The script itself runs in **0.11s** — the ~27s was the *agent's* follow-up:
  reading the 293-line `project-status.md` + the active plan + running full
  `verify`, all triggered by the brief's "investigate… propose up to 3… verify,
  don't trust against git" wording.
- `src/scripts/session-brief.sh` + `AGENTS.md` "Session start":
  - "up to 3" reframed as a **cap for genuinely-parallel work, not a quota** —
    often just the one active plan; don't split one plan's steps into three tasks.
  - Added an explicit **≤5s budget**: brief from the hook output + a peek at the
    active plan's Status line; **defer** the verify-against-git check to when the
    work is actually picked up — don't read the snapshot or run `verify` to brief.
- Saved a `session-brief-fast-and-lean` agent-memory so it holds across sessions.

Commit `b05e7ea` (docs-only, `SKIP_VERIFY=1`).

## Next intended steps
1. Resume the greenlit **v0.3.1 build** (`docs/plans/2026-06-30-v0.3.1-build.md`,
   Step 1 — DEV panel + variant-toggle infra; also unblocks the R2 variant review).
