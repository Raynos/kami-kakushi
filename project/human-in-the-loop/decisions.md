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

### HD-35 🔲 [R3–R6 · pacing] — restore the R3–R6 per-rung band verdicts (the last ADR-148-interim scope)

- **Question / fork:** ADR-170 lifted the ADR-148-interim ratio-gate suspension, but
  the per-rung band verdict still covers only R0–R2 (`ADR148_INTERIM_BAND_RUNGS`).
  Restoring R3–R6 today REDs on **R3**: its ADR-148 *timed* wall measures
  ~146–221 min across seeds vs the signed [3, 22] band — greedy's night-watch rung
  is ~10× over in real wall terms (R4–R6 sit in band at ~10–14 min). Either R3's
  design (the night round, the ~379-move walk pattern, timed move costs) gets
  re-paced, or the band re-signs a per-rung exception for R3, or the R3 wall is
  accepted as intentional (the tier's one long "act").
- **Options:** (a) re-pace R3 into the band · (b) re-sign the band/an R3 exception ·
  (c) sign R3-as-intentional and restore the verdicts for R4–R6 only.
- **Recommendation:** feel R3 on the live build first (it's also the rung your own
  telemetry will speak to loudest) — then rule; the scope note in
  `src/sim/envelopes.ts` names this item and deletes with it.
- **Resolution:** _(open)_

