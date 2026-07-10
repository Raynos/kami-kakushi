# Decisions & questions (HD-items)

**Open** design forks and questions only the human can close. IDs `HD-1…Hn`, never reused.
Status: 🔲 open · ⏳ waiting on Claude prep. (Closed items move to the archive — see below.)
`⛔ blocks <task>` marks a blocker.

> **Rung-tagged (2026-07-09)** — like [`review.md`](review.md), an open HD-item carries a
> `[rung]` tag (or `[cross-cutting]`) for the rung it concerns, so decisions track a
> rung-by-rung pass. _(Currently no open decisions — see below.)_

## Lifecycle (where a resolved HD-item goes)

1. The human answers (inline or in chat); mark it ✅ with the verdict.
2. **Graduate it:** a decision future-us needs the *rationale* for becomes an **ADR** in
   [`../../docs/living/decisions.md`](../../docs/living/decisions.md). A purely **mechanical / structural**
   item (e.g. a file split) skips the ADR — recording a no-op as an ADR only dilutes the log.
3. **Archive it:** add a one-line row to [`archive.md`](archive.md) (H# → ADR + date + intent link) and
   **remove it from this file** so this list stays open-items-only (it's what the session-brief hook scrapes).
4. Capture verbatim intent in [`../feedback-human/`](../feedback-human) and apply the decision to code/docs.

> Closed HD-items: [`archive.md`](archive.md). The ADR log (the durable "why"):
> [`../../docs/living/decisions.md`](../../docs/living/decisions.md).

---

<!-- Format:
### HD-1 🔲 — {short title}
- **Question / fork:** {what needs deciding}
- **Options:** {A / B / C}
- **Recommendation:** {your best inference}
- **Resolution:** {filled in when the human answers — then graduate + archive per the lifecycle}
-->

### HD-36 🔲 [R7 · story canon] — Munemasa speaks on-screen in T0, against the synced canon

- **Question / fork:** two shipped R7 house-standing flavor lines
  (`src/core/content/narrative/requirements.md:240,250` → compiled into
  `requirements.gen.ts`) have `{lord}` = Munemasa speaking — "says from the
  veranda" — while the freshly-synced canon says he is "a voice through a
  wall, **never met in T0**; his one scene is T1's capstone"
  (`story-bible/tiers/t0.md:177`, `04-cast.md:188`, `prd/05-narrative.md:47`).
  The source's G4.1 flag deferred these pre-reboot lines to a re-derivation
  pass under HD-30 — but HD-30 closed 2026-07-09 (RUN & BUILT, HR-17) without
  touching them, so the contradiction is now uncovered (found by the s141
  src-vs-PRD verification sweep; report:
  `project/audit/reports/2026-07-10-prd-truth-sync-src-verification.md`).
- **Options:** (a) re-derive the two lines via narrative-diverge (ADR-139) so
  the R7 beat lands without staging the lord — canon holds · (b) amend the
  bible: Munemasa may be *heard* (still unseen) at the R7 threshold, his
  first *scene* stays T1 — lines stay · (c) accept as-is.
- **Recommendation:** **(a)** — the bible is the human-signed canon, and
  "from the veranda" stages him *visually*, which even (b) can't absorb; two
  flavor lines are a cheap ADR-139 unit. Whoever executes should also repoint
  the stale "(HD-30)" flag at `requirements.md:24` to this item.
- **Resolution:** _(open)_

