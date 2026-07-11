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

### HD-38 🔲 [cross-cutting · T0 narrative] — the register ruling (D1–D4) ⛔ blocks the re-voice plan's Wave 0

- **Question / fork:** rule the four direction forks from the 2026-07-11
  narrative register audit
  ([report](../audit/reports/2026-07-11-t0-narrative-register-audit.md) §Open
  decisions · [plan](../../docs/plans/fable-2026-07-11-t0-narrative-revoice.md)):
  **D1** lock the 14–21/light-novel audience + §0.5 clarity floor · **D2**
  Genemon two-voice split (book voice for entries, plain man voice for talk) ·
  **D3** MC interior-narration allowance · **D4** re-voice scope.
- **Options:** each of D1–D3 adopt/reject; D4 full-T0 sweep vs worst-first
  bundles.
- **Recommendation:** adopt D1+D2+D3; D4 worst-first (works pages → R1
  terms + R0 lines → gloss sweep → cold open after HR-28 → medium scenes).
- **Resolution:** _(open)_

