# Decisions & questions (H-items)

**Open** design forks and questions only the human can close. IDs `H1…Hn`, never reused.
Status: 🔲 open · ⏳ waiting on Claude prep. (Closed items move to the archive — see below.)
`⛔ blocks <task>` marks a blocker.

## Lifecycle (where a resolved H-item goes)

1. The human answers (inline or in chat); mark it ✅ with the verdict.
2. **Graduate it:** a decision future-us needs the *rationale* for becomes an **ADR** in
   [`../../docs/living/decisions.md`](../../docs/living/decisions.md). A purely **mechanical / structural**
   item (e.g. a file split) skips the ADR — recording a no-op as an ADR only dilutes the log.
3. **Archive it:** add a one-line row to [`archive.md`](archive.md) (H# → ADR + date + intent link) and
   **remove it from this file** so this list stays open-items-only (it's what the session-brief hook scrapes).
4. Capture verbatim intent in [`../human-feedback/`](../human-feedback) and apply the decision to code/docs.

> Closed H-items: [`archive.md`](archive.md). The ADR log (the durable "why"):
> [`../../docs/living/decisions.md`](../../docs/living/decisions.md).

---

<!-- Format:
### H1 🔲 — {short title}
- **Question / fork:** {what needs deciding}
- **Options:** {A / B / C}
- **Recommendation:** {your best inference}
- **Resolution:** {filled in when the human answers — then graduate + archive per the lifecycle}
-->

### H21 🔲 — per-agent worktrees vs the shared working tree

- **Question / fork:** Keep N agents on one shared working tree + one shared
  index (today's model, defended by the sweep-guard, tree-mutation warns,
  staged-set echo, herdr FYIs, "don't fight someone else's red"), or move
  parallel agents to per-agent `git worktree`s and delete that hazard class
  structurally? (Raised by the 2026-07-05 context audit: most guardrail mass
  exists to defend this one architectural choice. `core.hooksPath` is
  repo-level config, so the hooks follow worktrees for free.)
- **Options:** A — status quo (guards are load-bearing forever). B — worktrees
  for parallel agents; shared tree only for solo sessions. C — hybrid: shared
  tree stays default, worktrees mandatory only for code-lane parallel work
  (docs/journal traffic keeps the shared tree's low friction).
- **Recommendation:** C, after a grill — the costs (one live dev server,
  journal/status merge traffic, fixture/screenshot paths) are real but
  concentrated in the docs lane; code-lane isolation is where the sweeps bit.
- **Resolution:** _(open)_

### H22 🔲 — journal shape for routine commits (token cost of the 4× write-up)

- **Question / fork:** The same unit of work is currently written up to four
  times (commit body → journal entry → snapshot touch → report/queue). Should
  a *routine* commit's body satisfy the journal gate — with journal files
  materialized from `git log` by script, and hand-written journals reserved
  for session summaries / design context? (Raised by the 2026-07-05
  context-audit follow-up: this is the single biggest token inefficiency in
  the workflow; it is also a change to the repo's memory model, so it's a
  human call.)
- **Options:** A — status quo (every commit stages a hand journal; SKIP_JOURNAL
  for trivial). B — commit-body-as-journal for routine commits, hand journal
  per session summary. C — B plus a nightly script that materializes
  `journal/` files from `git log` so the on-disk archaeology stays identical.
- **Recommendation:** C — keeps the lossless on-disk record while cutting the
  live-session double-write; the pre-commit gate then checks "journal OR
  well-formed body" instead of "journal".
- **Resolution:** _(open)_

