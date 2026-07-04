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

### H19 🔲 — sign a T0 Phase-2 pacing band (the capstone→ascension anticlimax)

- **Question / fork:** the balance sim (F4) measures the Phase-2 window (R7
  capstone → EXCELLENT → ascend) at **~0.4 wall-minutes** for every persona ×
  seed — the economy balance-watch's "anticlimax" finding, now
  machine-measured. There is NO signed design intent for how long Phase 2
  should take, so the sim reports it but cannot gate it (an agent-invented
  band would manufacture wolf-cries).
- **Options:** (A) sign a `T0_PHASE2_BAND_MIN/MAX` pair (wall-minutes) in
  `balance.ts` — the gate lands the day the constants do; (B) declare the
  thin Phase-2 intentional for T0 and keep it report-only; (C) defer until
  the Phase-2 economy redesign the balance-watch flags, then sign from the
  redesigned reality.
- **Recommendation:** (C) — signing a band against the current shape would
  freeze a known anticlimax as canon.
- **Resolution:** _(pending)_

### H20 🔲 — promote the balance-report freshness WARN to a hard gate?

- **Question / fork:** F4 ships `balance-sim --check-fresh` as a pre-commit
  **WARN** (a loud line when a staged balance change stales
  `docs/content/t0-pacing.md` — your 2026-07-04 call). After ~a milestone of
  use, should it become a hard `verify` gate (~1 s, parallel, fits the
  budget)?
- **Options:** (A) promote to a hard gate; (B) keep the WARN; (C) drop it.
- **Recommendation:** decide by whether the WARN gets ignored (the
  promotion criterion in the F4 plan §5b).
- **Resolution:** _(pending)_
