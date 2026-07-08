# Decisions & questions (HD-items)

**Open** design forks and questions only the human can close. IDs `HD-1…Hn`, never reused.
Status: 🔲 open · ⏳ waiting on Claude prep. (Closed items move to the archive — see below.)
`⛔ blocks <task>` marks a blocker.

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


### HD-30 🔲 — Storywave: run the supplemental prose mini-wave (⛔ blocks G7 ship)

- **Ask / fork:** the storywave G0 pre-flight found the fiction-voiced
  strings the T0 rewrite needs that have **no source in the staged `t0v2/`
  wave** — 7 gap classes (season-exit ceremony scenes, the nengu scene,
  per-requirement flavor, the ~45 surface reveal lines, the save-retirement
  notice, estate project + seasonal-judge grade lines, sickroom/treatment +
  the R5 wage beat), plus the estate-beats re-diverge (Open-Q #11). Full
  verified inventory:
  [`../brainstorms/2026-07-08-storywave-g0-fiction-gap-inventory.md`](../brainstorms/2026-07-08-storywave-g0-fiction-gap-inventory.md).
- **Request:** authorize a **supplemental prose mini-wave**, staged into
  `t0v2/` in the u0–u9 shape (**3 takes** for scene-class gaps, **1
  law-compliant take** for texture) → judge VERDICT → the pick + redlines is
  canon; alternates archive unwired (the one-version ruling, 2026-07-08).
- **Recommendation:** run it (the blind-fleet process, per ADR-139 as refined
  by the one-version ruling). It runs **in parallel** with the engine build —
  G1–G3.5 need none of this text (they ship stubs/placeholders); the picks
  migrate at G4.1 / G5. **G7 ship is gated on this closing** — no `[dev]`
  placeholder or missing reveal line reaches players (PH1/PH5).
- **Resolution:** _(pending — the human authorizes/scopes the wave)_
