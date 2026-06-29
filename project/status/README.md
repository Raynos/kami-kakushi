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
- [pending-prd-changes](pending-prd-changes.md) — **live tracker:** locked design decisions (ADRs) that
  are **canon but not yet rippled** into `prd.md` / the living docs / code. Until an item is ticked, the
  ADRs + this tracker are the source of truth and `prd.md` is **stale** on that point. Ticked as applied;
  **deleted once empty**. Surfaced at session start by the `session-brief.sh` hook.

Distinct from [`docs/`](../../docs) (living *design* — what the game *is*), [`journal/`](../journal)
(per-session *history* — how it got here), and [`docs/plans/`](../../docs/plans) (pre-canon proposals).
