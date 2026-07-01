# Plans

Pre-canon **implementation plans / proposals / reel-backs** — sequenced build
steps awaiting or under execution. This directory holds **active plans only**.

- **A plan lives here while it's live** (proposed, approved-but-unstarted, or in
  progress). Add a new plan to the [reading queue](../../project/todo-human.md) in
  the same commit you author it (a pre-commit gate enforces this).
- **When a plan is done, archive it** — `git mv` it to
  [`../../project/archive/`](../../project/archive) the moment its Status line
  reads ✅ done, so this directory never accumulates finished plans and its file
  list always reflects what's *actually active*. Update any links that pointed at
  the old `docs/plans/` path in the same commit (the `md-links` gate will catch a
  stale link).

Settled design graduates to [`../living/`](../living); the chronological "how it
got here" log is [`../../project/journal/`](../../project/journal).

_(No active plans right now — the v0.3.1 build plan finished and was archived to
`project/archive/2026-06-30-v0.3.1-build.md`.)_
