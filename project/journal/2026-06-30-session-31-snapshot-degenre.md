# Session 31 — 2026-06-30 — de-genre the status snapshot + gate it

**Summary:** The human flagged that `project/status/project-status.md` had become
a mess — 326 lines. Root cause: it's meant to be a one-screen *snapshot* (per its
own header + `status/README.md`), but ~22 dated "Phase update — (session-NN)"
bullets had accreted, i.e. the journal genre leaked into the snapshot. The
append-only instinct (correct for `journal/`) bled into the one file that's meant
to be overwrite-in-place, and nothing ever *measured* "one screen", so the drift
was invisible. Fixed the artifact (rewrote to 92 lines, all claims verified
against the repo) **and** the system that allowed it: resolved the canon conflict
in AGENTS.md + `status/README.md` + the file's own header (snapshot = REPLACE-in-
place, NOT append-only; the journal is the lossless record), and escalated the
"keep it to one screen" norm a rung to a **`pre-commit` gate** (a norm ignored for
20+ sessions is a proven-insufficient rung).

## What changed
- `project/status/project-status.md` — **rewritten 326 → 92 lines.** Dropped all
  dated "Phase update" bullets (preserved in `journal/`). Kept only current state:
  game premise (corrected 5→**6 tiers**, T0–T5), phase-now (PRD **V2.3** — fixed
  the stale "V2.2" claims), toolchain, code/repo layout, R1–R6 pointer, waiting-on-
  human (R1/R2 + reading queue), and how-to-resume. New header states the
  REPLACE-in-place / no-Phase-update-bullets rule.
- `.githooks/pre-commit` — **new snapshot-shape gate** (between reading-queue and
  journal gates). On a staged `project-status.md`: HARD BLOCK if > 120 lines
  (`SNAPSHOT_MAX_LINES`, ~90-line snapshot → generous headroom, never cries wolf);
  LOUD WARN on a `- **Phase update …` bullet (the journal-genre signature).
  Bypass: `SKIP_SNAPSHOT=1`. Tested: passes 92-line file, blocks 326, warns on bullet.
- `AGENTS.md` — carved the **one exception** to "append-only & lossless" into the
  repo-is-memory bullet: the snapshot is REPLACED in place; trimming stale state is
  correct *because* the journal preserves it; no Phase-update bullets; cites the gate.
- `project/status/README.md` — same carve-out on the `project-status` index line.

## Next intended steps
1. Pick up the **v0.3.1 build** (`docs/plans/2026-06-30-v0.3.1-build.md`) — DEV
   panel + variants first — or clear an R-item, per the human.

## Landmines
- The snapshot gate matches the bullet signature `^\s*-\s+\*\*Phase update` so the
  header's *meta-reference* to the forbidden string (a `>` blockquote line) doesn't
  trip the WARN. If you reword the header, keep the reference off a `- **`-bullet line.
- The gate reads the **index blob** (`git show :file`), so it checks the
  to-be-committed content, not the working tree.
