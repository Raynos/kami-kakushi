# H19 — T0 Phase-2 pacing band: Brainstorm / Discovery Notes
Date: 2026-07-04 · Goal: decide whether to sign a `T0_PHASE2_BAND_MIN/MAX`
into `balance.ts` so the F4 sim can gate the capstone→ascension window
(currently ~0.4 wall-min — the "anticlimax").

## Summary / key decisions
_(running synthesis — updated as we go)_

- **LOCKED (human, 2026-07-04): Phase 2 ≈ Phase 1 in wall-time — a ~1:1 split
  — as a GENERAL RULE across tiers.** A default, not a frozen constant:
  fine-tune in playtesting. Rationale (human's words): *"24s is dumb and 1:1
  is a better random ass default."* This is a NEW design law (the PRD only
  promised "not a dead half," never a ratio) → needs an ADR.
- Decision on H19 itself: **converging on a hybrid** — options A/B/C recast by
  the 1:1 lock:
  - **B is REJECTED** — the human calls the 24s anticlimax "dumb," so it is
    NOT intentional / report-only-forever.
  - **A vs C is now a TIMING question, not a target question** — we HAVE the
    target now (1:1).
- **RESOLVED (human, 2026-07-04): sign the band NOW + quick T0 Phase-2
  hotfix.** The human picked **A** over C: express the rule as a **ratio band
  `PHASE2_PHASE1_RATIO_BAND = [0.8, 1.2]`** and land it as a real gate NOW,
  paired with a **quick hotfix to T0's Phase-2 economy to stretch it to ~1:1**
  (rather than deferring to a full economy redesign). Human's words: *"Sign it
  as a band, im sure we can do a quick hotfix on phase 2 for T0 to make it
  take super long lol."*
  - **Sequencing (so the gate is green-able, R3):** the T0 Phase-2 hotfix and
    the band gate ship in the **same change** — the gate must be able to go
    GREEN the moment it lands (never a permanently-red hard gate).
  - **Gate scope:** the ratio gate applies only to tiers whose Phase 2 is
    actually BUILT (today: T0 only). It must no-op for tiers with no Phase-2
    economy yet, or it cries wolf on unbuilt T1+.
  - **Balance-change protocol (D-132):** the hotfix touches balance magnitudes
    → run `npm run verify:balance` → `balance:report`, regenerate
    `docs/content/t0-pacing.md`, commit together, paste `--summary` in the body.

## Context (grounded from the build, 2026-07-04)

- **The shape.** T0 climbs R0→R7 in ~83.5 wall-min. The **R7 capstone opens
  Phase 2** (the Estate pillar grind): deeds accrue ONLY post-capstone, you
  bank Estate to **EXCELLENT**, then ascend. The F4 sim measures this Phase-2
  window at **~0.4 wall-min** for EVERY persona × seed (10488 intents total,
  Phase-2 slice ≈ 48 intents). Effectively a rubber-stamp.
- **PRD intent (§1.6.4 / 03-unlock-ladder).** "Phase 2 is NOT a dead
  consolidation half" — it's meant to carry authored reveals (the estate BUILD
  advancing E0→E1, new deed categories) and grind the pillar to a hybrid
  grade-gate. At T0 that ambition isn't realised: single producer
  (`ESTATE_DEED_PER_ACT`), one pillar (Estate, N=1), gate = just EXCELLENT.
- **T0 is floor-exempt** (D-049/D-056): the ≥30-min/rung floor binds from T1,
  NOT T0. T0 is explicitly a tutorial ramp (~10–15 min/rung). So there is no
  existing signed duration intent for T0 Phase 2.
- **Why the sim can't gate it today.** No signed `T0_PHASE2_BAND` exists; an
  agent-invented band would manufacture wolf-cries (D-132 sound-rung rule).
- **The redesign hook.** The economy balance-watch flags a Phase-2 economy
  redesign (thin Phase-2 is a known finding, not a surprise).

## Q&A log

### Q1 — Is the ~0.4-min Phase 2 a problem at T0, or acceptable for a tutorial tier?
- Asked: (i) genuine anticlimax to fix even at T0 / (ii) acceptable for T0
  (teaches the shape, real grind is T1+) / (iii) depends on fix cost.
- Captured: human did NOT pick (i)/(ii) — instead floated a **design
  principle**: *"Phase 2 should be roughly equal time to Phase 1 (R0→R7),
  right?"* i.e. Phase 2 ≈ **~83 wall-min**, a roughly **1:1** split with
  Phase 1. This implies the 0.4-min window IS a real anticlimax (a ~200×
  shortfall), and the fix is a substantial Phase-2 economy redesign — which
  rules OUT (ii) "acceptable as-is" and pushes toward A or C.
- **Open design question raised (not yet an answer):** is 1:1 a GENERAL law
  (every tier's Phase 2 ≈ its Phase 1) or a T0-specific target? And does
  "equal" mean literally 1:1, or just "substantial, not a rubber-stamp"?
- Flags: the 1:1-split principle is a NEW design lever — needs to be pinned
  before we can pick A/B/C (a band is meaningless without a target).

### Q3 — Ratio band vs absolute wall-minutes?
- Asked: express the band as a per-tier ratio (auto-scales, IS the general
  rule) or absolute `T0_PHASE2_BAND_MIN/MAX` re-signed per tier?
- Captured: **RATIO, `[0.8, 1.2]`.** Single-sourced general law (A21),
  auto-scales per tier, can't drift from "equal time."

### Q4 — Sign now (+hotfix) vs defer gate to redesign? Hard gate or WARN?
- Asked (implicitly): timing of the gate + hardness.
- Captured: **sign NOW as a HARD gate** (*"we can block on it hard"*), paired
  with a **quick T0 Phase-2 hotfix** to hit ~1:1 so the gate is green on
  landing. NOT deferred to a full redesign. Hard gate (not WARN) — contrast
  H20's freshness WARN, which the human kept soft; this one blocks.

### Q2 — General law or T0-specific? Literal 1:1 or "substantial"?
- Asked: is "≈ equal time" a general rule (every tier) or T0-only, and literal
  1:1 vs "substantial (30–50%)"?
- Captured: **GENERAL RULE, literal ~1:1, as a tunable default.** *"We can
  fine tune it later in play testing, but 24s is dumb and 1:1 is a better
  random ass default."* → Phase 2 targets ≈ Phase 1 wall-time at EVERY tier.
- Implication for T0: T0 Phase 2 should target ≈ **~83 wall-min** (its Phase-1
  length) — a ~200× lift from today's 0.4 min. That's a real Phase-2 economy
  redesign, not a constant tweak. (Noted tension: this makes T0 total ~2.8h;
  the redesign may instead rebalance the Phase-1/Phase-2 SPLIT of a ~90-min
  T0 — i.e. shorten Phase 1 too. Flagged for the redesign, not blocking H19.)
- Flags: Phase-1/Phase-2 total-length rebalance → the Phase-2 economy redesign
  task (playtest-tunable).

## Outcome (2026-07-04)

- **H19 CLOSED** → **ADR D-133** (`docs/living/decisions.md`); H-item removed
  from `human-in-the-loop/decisions.md`, archived in `archive.md`.
- **Two follow-on tasks spawned:**
  1. **Quick T0 Phase-2 hotfix + ratio-band gate** (same change): wire
     `PHASE2_PHASE1_RATIO_BAND = [0.8, 1.2]`, stretch the T0 deed economy so
     the window hits ~1:1, gate green-able on landing. Stopgap.
  2. **Real Phase-2 economy redesign** — plan being drafted at
     `docs/plans/opus-2026-07-04-phase2-economy-redesign.md` (makes Phase 2
     long AND fun; supersedes the hotfix's threshold inflation).

## Parking lot (tangents / parallel threads)

- **Phase-1/Phase-2 total-length rebalance.** 1:1 makes T0 total ~2.8 h. The
  redesign may prefer to rebalance the SPLIT of a shorter T0 (shorten Phase 1
  too) rather than pin Phase 2 at a literal 83 min. Playtest-tunable; lives in
  the redesign plan, not H19.

## Open flags (pending input)

- None blocking. The mechanics direction (which Phase-2 loop) is an open
  question the redesign plan surfaces for the human.
