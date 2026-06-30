<!-- Copy to journal/{YYYY-MM-DD}-session-{NN}[-{topic}].md. ONE file per session. -->

# Session 34 — 2026-06-30 — AGENTS.md duplication / consistency audit

**Summary:** Audited `AGENTS.md` for internal duplication + inconsistency at the
human's request, then applied three fixes: removed one genuine contradiction,
de-duplicated the journal/snapshot rule down to a single canonical home, and
aligned the `SKIP_VERIFY` phrasing. Docs-only; no state change to the project.

## What changed
- `AGENTS.md` —
  - **Fixed a contradiction:** the "session is disposable / repo is the memory"
    bullet listed `+ the task list` as a component of repo state, but the
    "Session start" bullet says plainly "No stored task list." Grep confirmed no
    task-list artifact exists. Dropped the stale clause; replaced with a pointer
    to the canonical rule under "Docs taxonomy".
  - **De-duplicated the journal/snapshot rule** (was stated in full 3×): the
    "summary at top / append at bottom / never prepend" + "live snapshot is
    project-status.md" rule now lives only in the Conventions → "Docs taxonomy"
    bullet; the "session is disposable" and Layout `project/journal/` copies now
    reference it instead of re-spelling it.
  - **Aligned `SKIP_VERIFY` phrasing:** the commit-gate bullet now reads
    "to commit an isolated local change (e.g. docs-only)" — matching the more
    precise framing later in the Checkpoint bullet ("own isolated change
    locally") instead of the narrower "docs-only commit".

## Audit findings (for the record)
- "10 gates" claim verified accurate against `src/scripts/verify-run.ts`
  (tsc, eslint, prettier, vitest, verify-content, verify-prd, gen-docs, pacing,
  playcheck, md-links).
- The AI-attribution section duplicates `.claude/rules/commit-message-style.md`,
  but that is *intentional* pointer-duplication (the rules file names AGENTS.md
  canonical) — left as-is.

## Next intended steps
1. None from this thread. Resume the queued work: §4 balance ripple (6-tier) and
   the v0.3.1 build per `docs/plans/2026-06-30-v0.3.1-build.md`.

## Landmines
- None. Pure docs hygiene; the canonical "Docs taxonomy" rule (Conventions) is
  untouched and complete, so nothing was lost in the de-dup.
