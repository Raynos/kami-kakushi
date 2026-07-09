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

### HD-33 🔲 [cross-cutting] — §1's rung tables are pre-reboot wholesale; how far may the ripple reach into the frozen vision?

- **Question / fork:** the C2 closure sweep found that beyond the cited D3
  map-vocabulary lines, the PRD's **§1.5 T0 rung table** (`01-vision.md:268+`)
  and **§4.8's hand-authored pacing table** (`04-combat-balance.md:1505+`)
  still describe the PRE-REBOOT game wholesale — old rung fictions (R2 "Bonded
  hand", R5 "Gate-guard", Smith Gonta, the scripted grain-store wolf, rice+coin
  labour) vs the shipped bible ladder (R2 庭男 yard-man silent rung, R5 咎人 the
  accused/Count, Tetsuji, the night-round wolf, kura-only rice). §1 is the
  FROZEN, human-signed vision (ADR-021), so the closure sweep fixed ONLY the
  cited map tokens and stopped.
- **Options:** (a) a targeted §1.5/§4.8 transcription pass (agent rewrites the
  tables to the shipped bible ladder, no intent change — needs your sign-off
  because the text is inside the freeze) · (b) point both tables at §5/the
  generated t0-pacing.md and strike the stale copies · (c) leave as historical
  record with a superseded banner.
- **Recommendation:** (b) — single-source them; §5 + the generated report are
  already the live truth, and a hand-maintained twin WILL drift again.
- **Resolution:** _(open)_
