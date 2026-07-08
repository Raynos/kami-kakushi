# Pillar model (house-standing / tier-up): Brainstorm / Discovery Notes
Date: 2026-07-08 · Goal: Lock the pillar-structured house-standing / tier-up
engine (HD-25 ruling = keep pillars as mechanics, with player depth-autonomy) so
it can become canon (bible tier-up section + a redrafted ADR-159) and ripple into
PRD §1.6. Reconcile the bible's flat "standing/deeds graded at season exits"
engine into a pillar-structured one, grounded in the existing PRD §1.6 four-pillar
model.

## Summary / key decisions
_(running synthesis — LOCKED unless noted)_

**HD-25 ruling (human, 2026-07-08):** keep pillars as tier-up mechanics; rank house
standing across pillars; give players autonomy in how deep they push each.
Supersedes the bible's flat standing/deeds engine (ADR-022: newest intent wins).

### The LOCKED pillar model (this session)

1. **Four pillars, four domains kept** (canon-native — they map onto kernel #4's
   "debt, disrepair, a name in decline" and onto the tiers 1:1). Renamed to crisp
   single words under the umbrella **House Standing (家威 *ka-i*)**, assessed
   kokudaka-style, surfaced as a banzuke:
   - **Estate** (家産 *kasan*) — lands, stores, treasury (debt→solvency), trade
   - **Arms** (武威 *bu-i*) — the house's defense & martial repute
   - **Office** (官威 *kan'i*) — offices, administration, territory (the steward arc)
     — *renamed from "Standing & Office" to kill the umbrella-word collision*
   - **Name** (家格 *kakaku*) — house rank/pedigree, off the foreclosure list, the
     ink-thread spine
2. **Reveal ramp unchanged** — one pillar per tier: T0 Estate → T1 +Arms → T2
   +Office → T3 +Name → T4/T5 deepen (1→2→3→4→4).
3. **Depth = a 6-grade ladder** (English-forward hybrid: word + letter; kanji is
   flavor): **S** EXCELLENT · **A+** GREAT · **A** GOOD (the gate floor) · **B** OK
   · **D** BAD · **F** FAIL. A pillar climbs F→…→A→A+→S.
4. **Tier-up gate = breadth required, specialize on top.** For N revealed pillars:
   **all ≥ A (GOOD), exactly 1 S + 1 A+ + rest ≥ A.** No substitution — you choose
   WHERE to spike, not whether to skip. Overshoot earns a grade-scaled boon. T0
   (N=1) collapses to a single top grade. *(Whether the required T0 peak is S or
   A+ is sim-tunable — ADR-132; see flags.)*
5. **T0 depth-autonomy lives in the four DEED SOURCES** (ADR-145: fields · stores ·
   works · watch) within the single Estate pillar — the within-tier depth dial;
   macro pillars are the cross-tier picture. Uses the build's existing structure.
6. **Accrual (inherited from PRD, unchanged):** Phase-2 only (post-final-rung); via
   (A) achievement jumps + (B) periodic judged results; up-only with small
   recoverable dents.

### Downstream (promotion path — NOT done in this session)
- **Bible edit** (human-gated): reconcile `tiers/t0.md` "The tier-up (locked)" +
  `03-tiers.md` from flat standing/deeds → this pillar-structured engine.
- **ADR:** redraft ADR-159 (docket #8) to the pillar engine (was the flat
  standing/deeds transcription); the storywave docs plan A0 mints it.
- **PRD §1.6 ripple:** update names (Office; the 6-grade ladder) + confirm the
  model; storywave docs plan A2.2.
- These are storywave Plan A work — this brainstorm is the locked reference.

## Q&A log

### Q1 — Do the 4 pillar names + domains still fit the new story-bible theme?
- Asked: the human's #1 concern. Evaluated the PRD §1.6 four pillars against
  the kernel (`00-kernel.md`) + tier themes.
- **My assessment (proposed; awaiting the human's confirm/redirect):**
  - **The four DOMAINS fit BETTER than before — they are almost the kernel's own
    structure.** Kernel #3 ("worth written by work → deeds → standing → a name")
    IS the pillar accrual loop; the pillars are literally "the ledgers where worth
    is written." Kernel #4 names the House's enemy as **"debt, disrepair, a name
    in decline"** — a near-verbatim pillar list:
    - *disrepair* → **Estate & Wealth / LAND** (the ruin restored, reclamation, works)
    - *debt* → **Estate & Wealth / TREASURY** (debt→solvency, the nengu, the standing antagonist)
    - *a name in decline* → **Name & Honour** (the house off the foreclosure list, the register)
    - (the house's *defense* — beasts then men — → **Arms**; its *offices/reach* → **Office**)
  - **Reveal ramp fits the new tiers 1:1:** T0 household=Estate · T1 land=+Arms ·
    T2 Valley/Asagiri=+Office (house's voice at the headman's table) · T3
    Region=+Name (the house's reach + the origin + off the foreclosure list).
  - **What NEEDS reshaping — the NAMES, not the domains (2 issues):**
    1. **Kernel #6 (form is the fiction) forbids abstract pillar labels.** The
       player must never see "Estate & Wealth pillar" as a UI word — every surface
       wears a period/diegetic name (a banzuke, a ledger) and appears as a
       story-produced NEED. The kanji (家産/武威/官威/家格) are period-right; the
       player-facing presentation + English labels need to be diegetic.
    2. **"Standing" collides.** The macro-resource is "house standing"; a pillar
       is "Standing & Office." Rename the pillar (domain = offices/administration/
       territory, the steward arc — right and central; just the label collides).
  - **Two flags to raise (not blockers):** (a) Arms *reveals* at T1 but the player
    fights the wolf in T0 — does the standing-pillar reveal feel delayed? (b) the
    human said "we can change the 4" — keep-4-and-rename vs re-cut.
  - **Recommended answer:** KEEP the four domains; focus energy on RENAMING them
    diegetically (kernel #6) + killing the Standing collision. Re-cutting the
    pillar set is available but the current four are a clean, complete taxonomy of
    how a samurai house's standing is measured and they map onto the tiers 1:1.
- Captured: **RULED (a) — keep the four domains; rename diegetically + fix the
  Standing collision.** The domains (Estate&Wealth / Arms / Office / Name) stay;
  they're canon-native and map onto the tiers 1:1. Energy goes to naming, not
  re-cutting. Debt stays inside Estate&Wealth's Treasury (not elevated to its own
  pillar); no domain is actively wrong.
- Flags: how the pillars SURFACE diegetically (banzuke / assessor / ledger) is a
  downstream question (kernel #6 — no grant-list) → later Q.

### Q2 — The diegetic rename: the four labels + fixing the "Standing" collision
- Asked: with the domains locked, settle the player-facing names. Constraints:
  kernel #6 (period/diegetic, no abstract game-word), and the umbrella term
  "house standing" (家威) must not collide with any pillar name.
- **Proposed (awaiting answer):** umbrella = **House Standing** (家威 *ka-i*),
  assessed *kokudaka*-style, surfaced as a **banzuke** (kernel #6 names it). Four
  pillars collapse to crisp single words, each keeping its kanji:
  - **Estate** (家産 *kasan*) — lands, stores, treasury, trade (debt→solvency)
  - **Arms** (武威 *bu-i*) — the house's defense & martial repute
  - **Office** (官威 *kan'i*) — offices, administration, territory (was "Standing
    & Office" — the collision word dropped)
  - **Name** (家格 *kakaku*) — house rank/pedigree, off the foreclosure list, the
    ink-thread spine
  Alternative (more evocative/period): Holdings · Arms · Duties · Honour.
- Captured: **RULED — crisp single words.** The four pillars are **Estate (家産)
  · Arms (武威) · Office (官威) · Name (家格)**, under the umbrella **House
  Standing (家威 ka-i)** (assessed kokudaka-style, surfaced as a banzuke). The
  "Standing & Office" → "Office" rename resolves the collision. Kanji carried as
  flavor; labels stay legible.
- Flags: none.

### Q3 — Where T0's depth-autonomy lives (the build-critical reconciliation)
- Asked: T0 reveals only the Estate macro-pillar (gate = single EXCELLENT), so the
  cross-pillar choice can't exist there yet. Where does "autonomy in how deep" live
  in the T0 build?
- Captured: **RULED — the four DEED SOURCES carry it in T0.** T0 depth-autonomy =
  the player choosing how deep to push **fields · stores · works · watch**
  (ADR-145's four deed sources: paddy work · the kura · weir screens + orchard
  reclamation · night-rounds + gate-watch) WITHIN the single Estate pillar. The
  macro four-pillar choice arrives as pillars reveal (T1+). Keeps the one-per-tier
  reveal ramp; uses the structure the build already has (ADR-145's `accrueDeed`/
  `ESTATE_STAGES`); T0 tutorializes "depth" at estate scale before it goes
  cross-pillar. **Two-level model:** deed sources = the within-tier depth dial;
  macro pillars = the cross-tier breadth/specialization picture.
- Flags: the deed-source → macro-pillar relationship (do the four T0 sources
  prefigure the four pillars, or all feed Estate?) — see Q4/parking.

### Q5 — Grade ladder: count + how it surfaces
- Asked: 8 grades felt like a lot; and kernel #6 vs letter grades — do we show
  letters, period Japanese terms, or a hybrid?
- Captured: **RULED — 6 grades, English-forward hybrid.** The players are English,
  so the ENGLISH word carries the meaning, with the letter grade as the at-a-glance
  mark; Japanese kanji is flavor only, never the primary read. The ladder trims to
  **six**:
  | Letter | Word | Role |
  |---|---|---|
  | **S** | EXCELLENT | top spike; overshoot boon |
  | **A+** | GREAT | the required GREAT |
  | **A** | GOOD | **the gate floor** |
  | **B** | OK | below floor |
  | **D** | BAD | below floor |
  | **F** | FAIL | nothing done / floor of the floor |
  (C and E dropped — the human's streamlined set: F · D · B · A · A+ · S.)
  Display = **word + letter** (e.g. "GOOD (A)"), the assessor's verdict framing
  keeps it kernel-#6-legible without leaning on Japanese-primary text. Reaffirmed:
  **the gate assesses ALL (revealed) pillars** (breadth required — Q4).
- Flags: exact banzuke/assessor presentation is a downstream UI pass (parking).

### Q4 — The autonomy dial: breadth-required vs substitution-allowed
- Asked: the crux of "how deep they go." The PRD's macro gate is breadth-required
  (all revealed pillars ≥ GOOD, exactly 1 EXC + 1 GRT + rest GOOD, NO substitution)
  — you choose WHERE the peak goes, but must touch everything. Does the human's
  "autonomy in how deep" want MORE substitution freedom than that? Applies at both
  levels (deed sources in T0; macro pillars T1+).
- **Proposed (awaiting answer):** keep the PRD's **"breadth required, specialization
  rewarded"** — a floor everywhere (≥ GOOD) + your choice of where to spike (EXC/
  GRT) + overshoot earns a grade-scaled boon. Autonomy = *where you specialize*, not
  *whether you can skip*. Rationale: pure substitution risks a degenerate
  single-source/single-pillar grind and undercuts kernel #4 (the House needs ALL of
  it — a house strong only in Arms is still in disrepair and debt).
- Captured: **RULED — breadth required, specialize on top** (option 1). Autonomy =
  WHERE you spike, not whether you can skip. Every revealed pillar / active deed
  source must reach the GOOD floor; you choose where to push to GREAT/EXCELLENT;
  overshoot earns a grade-scaled boon. Fits kernel #4 (the House needs all of it).
- **NEW (human) — the grade ladder is FULLER than good/great/excellent.** The
  three passing grades map to **A / A+ / S**, and there's a full range BELOW the
  GOOD floor:
  | Grade | Label | Role |
  |---|---|---|
  | **S** | EXCELLENT (above-and-beyond) | top spike; overshoot boon |
  | **A+** | GREAT (really strong) | the required GREAT |
  | **A** | GOOD (expected baseline) | **the gate floor** |
  | **B** | OK | below floor |
  | **C** | MEDIOCRE | below floor |
  | **D** | BAD | below floor |
  | **E** | DISAPPOINT | below floor |
  | **F** | FAIL | floor of the floor / nothing done |
  A pillar climbs F→…→A (reaches baseline) → A+ → S. Below-A grades are the
  legible read of how far from baseline you are (TST4). Gate unchanged: all
  revealed pillars ≥ A, exactly 1 S + 1 A+ + rest ≥ A.
- Flags: (1) player-facing grade PRESENTATION — letters (S/A/F) read game-y vs
  kernel #6; period assessment terms (上々/上/中/下/下々, the real Edo land/rice
  grading) may fit better → Q5. (2) 8 grade thresholds = more for the sim to
  back-solve (ADR-132) — balance concern, not a design blocker.

## Parking lot (tangents / parallel threads)
- **Deed-source ↔ pillar mapping.** Do T0's four deed sources (fields/stores/works/
  watch) prefigure the four macro-pillars (watch→Arms, etc.), or all feed Estate?
  Current lean: all feed Estate in T0 (only Estate is revealed); the mapping is a
  T1+ design detail. Revisit when T1 build opens.
- **How the pillars SURFACE (kernel #6).** No abstract pillar bars — House Standing
  shows as a banzuke / assessor's visit / the day-book's seasonal grade line. The
  reveal of each pillar must be a story-produced NEED (no grant-list). Downstream
  design pass, not blocking the canon lock.

## Open flags (pending input)
```