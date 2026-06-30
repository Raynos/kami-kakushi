# status/

The **live operational state** of the project — the "where are we *right now*" layer. Mutable,
edited in place, and the home for **live trackers**: working snapshots that get updated as work lands
and (for the transient ones) deleted when empty.

> **Taxonomy note.** A **live tracker** (mutable, checkbox-y, deleted-when-done) belongs **here**, not
> in [`docs/plans/`](../../docs/plans). `docs/plans/` is for **pre-canon proposals awaiting sign-off**
> ("should we, and how?"); `project/status/` is for **post-decision operational state** ("what's the
> current state of in-flight / not-yet-applied work?"). Different lifecycles — keep them apart.

## Index

- [working-agreements](working-agreements.md) — cadence, autonomy, the commit/journal gate.
- [project-status](project-status.md) — the live one-screen snapshot + how to resume.
  **It is REPLACED in place, never appended to** — a snapshot, not a log. The
  lossless "how it got here" history lives in [`journal/`](../journal), so trimming
  stale state here loses nothing. No dated "Phase update — (session-NN)" bullets
  (that's the journal genre); a `pre-commit` line-cap gate (~120 lines,
  `SKIP_SNAPSHOT=1` to bypass) keeps it to one screen after it once drifted to 326.

*(A transient `pending-prd-changes` tracker lived here through the 6-tier reshape — a "locked-ADRs-not-yet-rippled"
checklist, surfaced by `session-brief.sh`, **deleted when empty**. It was **retired 2026-06-29** once the ripple
landed in the PRD; the pattern may recur for a future batch.)*

Distinct from [`docs/`](../../docs) (living *design* — what the game *is*), [`journal/`](../journal)
(per-session *history* — how it got here), and [`docs/plans/`](../../docs/plans) (pre-canon proposals).
