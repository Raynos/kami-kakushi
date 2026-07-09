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

### HD-34 🔲 [R7 · Phase 2] — the owed balance re-baseline's THREE design calls (C5b, sim evidence attached)

- **Question / fork:** the closure plan's C5b re-baseline fixed what was
  mechanical (the idler persona now speaks the rewrite's verbs — the manual
  wheel, the scene drain, the night round — and climbs the FULL ladder on all
  5 seeds; it soft-locked at R1 before). Three verdicts remain that the sim
  cannot rule:
  1. **The Phase-2 ratio breach** — measured [4.04–4.86] vs the signed band
     [0.8, 1.2] (window ~67.5 min): Phase 2 runs ~4.4× Phase 1's wall-time
     since the rewrite went liquid. The check's own text: "a human decision is
     required (re-tune the Phase-2 economy or re-sign PHASE2_PHASE1_RATIO_* —
     never a test-side fudge)."
  2. **Is "an idler ascends T0" a design promise?** The idler now reaches R7
     with every requirement done (fullLadder=true, all seeds) but trips the
     1M-intent guard before Estate-EXCELLENT — its check-in policy grinds
     Phase 2 far slower than greedy. Options: (a) Phase 2 is deliberately
     attention-priced — an idler NOT ascending is correct; re-sign the sim
     expectation to fullLadder (b) re-tune so the auto-loop also closes.
  3. **B8 — the zero-cost season-turn pool refill:** the greedy sim already
     exploits it (its own comments say so) and the per-rung bands still hold,
     so current evidence does NOT show pacing broken by it; the mechanism
     options (refill lag · a turn cost · spoilage scaling) stay available if
     your own play feels the wheel-spin cheap. Magnitudes sim-owned either way.
- **Recommendation:** rule 2(a) now (Phase 2 as attention-priced reads
  intentional; the sim expectation re-signs to fullLadder for the idler), and
  take 1 + 3 together in one cockpit sitting on the live build (the FB-7 flow)
  — the ratio band was signed against the pre-rewrite economy and needs feel,
  not arithmetic.
- **Resolution:** _(open)_
