# Session 118 — 2026-07-08 — storywave open-Q rulings + the pillar model into canon

**Summary:** Reviewed the two storywave plans with the human, resolved the
five open HD-items (HD-25…HD-29), then grilled the pillar/tier-up model to a
lock and promoted it into the story bible. Named the T2 village Asagiri (HD-27).
No code touched — docs/canon only.

## What changed
- `docs/story-bible/tiers/t2.md`, `docs/story-bible/03-tiers.md` — named the
  T2 valley village **Asagiri** (朝霧, "morning mist") — HD-27 ruling.
- `docs/story-bible/03-tiers.md` — NEW "House Standing — the four pillars"
  block in "The structure": the pillar-structured tier-up engine (Estate/Arms/
  Office/Name, revealed one per tier; the 6-grade ladder F·D·B·A·A+·S =
  FAIL→EXCELLENT; breadth-required-specialize-on-top gate; T0 depth-autonomy in
  the four deed sources). Refines the flat standing/deeds engine per HD-25.
- `docs/story-bible/tiers/t0.md` — "The tier-up (locked)" refined: T0 reveals
  the Estate pillar; deeds bank across fields/stores/works/watch; graded
  FAIL→EXCELLENT at season exits; gate collapses to one top grade (sim-owned).
- `docs/story-bible/tiers/t1.md` — "The tier-up (locked)" refined: T1 reveals
  Arms (2 pillars); breadth gate (1 EXCELLENT + 1 GREAT, both ≥ GOOD).
- `project/brainstorms/2026-07-08-pillar-model.md` — NEW. The full grill: the
  locked pillar model (5 Q&A) + parking lot + flags. The reference for the
  canon promotion.
- `project/feedback-human/2026-07-08-storywave-open-questions-rulings.md` —
  NEW. The five HD-item rulings (HD-25 pillars/c · HD-26 v1=T0–T3 · HD-27
  Asagiri · HD-28 banner-flip-authorized · HD-29 capstone adopt-partial).

## The rulings (for the storywave A0 to transcribe as resolved HD-items)
- **HD-25** — keep pillars as mechanics (c), NOT superseded. Model now LOCKED
  (see brainstorm) and IN THE BIBLE. Downstream: redraft ADR-159 (docket #8)
  to the pillar engine (was the flat-engine transcription); ripple PRD §1.6.
- **HD-26** — v1 = full T0–T3 (default).
- **HD-27** — village named Asagiri (bible edit DONE).
- **HD-28** — agent may flip the bible README banner (after §5 rewrite).
- **HD-29** — adopt-partial: keep a real forking R7 capstone, rewrite vs
  `tiers/t1.md` when T1 opens; un-archive its plan with a rework Status line.

## Next intended steps
1. **Storywave Plan A** now needs: ADR-159 redrafts to the PILLAR engine (not
   the flat one the docket draft assumed); PRD §1.6 ripple updates the pillar
   NAMES (Office, not "Standing & Office") + the 6-grade ladder + confirms the
   model. Both are A0/A2.2 work — not done this session.
2. HD-29: un-archive `docs/plans/t1/opus-2026-07-03-t1-capstone-branch.md`
   with a "rework against tiers/t1.md" Status line (deferred to T1 build).
3. Parked (brainstorm): the T0 required peak (S vs A+ — sim-tunable); how
   House Standing SURFACES (banzuke/assessor — kernel #6, downstream UI pass);
   deed-source→pillar mapping for T1+.

## Landmines
- **Bible now DISAGREES with PRD §1.6** on pillar names (Office vs "Standing &
  Office") and the grade ladder (6-grade F–S vs the old good/great/excellent).
  This is EXPECTED — the bible is canon; PRD §1.6 is trailing forward-spec, to
  be reconciled by the storywave docs plan's A2.2 ripple. Don't "fix" the bible
  to match the PRD; ripple the PRD to the bible.
- **ADR-159's current docket DRAFT (in the storywave docs plan A0) transcribes
  the FLAT standing/deeds engine** — it must be REDRAFTED to the pillar engine
  before A0 mints it, or the docket will contradict the bible.
- The 03-tiers.md pillar block links to the brainstorm for provenance; if that
  brainstorm later archives, leave a forward pointer (append-only law).

## Addendum — storywave plan consistency (ADR-159 + HD-29)
Patched the storywave docs plan so it stops contradicting the new canon:
- `docs/plans/fable-2026-07-07-storywave-docs.md` — the **ADR-159 draft**
  (docket #8) redrafted from the FLAT standing/deeds engine to the
  **pillar-structured** engine; the **A2.2 §1.6** ripple instruction flipped
  from "pillars superseded" to "rewrite to the pillar engine (Office rename +
  6-grade ladder + keep the reveal ramp)"; the **HD-25 open-question** entry
  marked **RULED (c) — keep pillars**, so A0 files it resolved.
- `docs/plans/t1/opus-2026-07-03-t1-capstone-branch.md` — Status → **HD-29
  adopt-partial**: keep a real forking T0→T1 capstone, but its R8–R15 /
  Shigemasa devoted-ambitious-humble content is VOID; rework against
  `tiers/t1.md` when T1 opens. (Plan was PARKED, not archived — so this is a
  Status/flag update, not a literal un-archive.)
Still open (unchanged): PRD §1.6 ripple itself (A2.2) is NOT done — only the
plan INSTRUCTION is corrected; the PRD text still reads old until Plan A runs.

## Addendum 2 — HD-27 (Asagiri KEPT) rippled through Plan A
The HD-27 ruling flipped from the plan's default (unnamed) to keep-Asagiri, so
Plan A still carried stale "make the village unnamed" instructions. Fixed all
four in `docs/plans/fable-2026-07-07-storywave-docs.md`:
- §5.6 rename-ledger row: "unnamed" → **KEPT** (no rename).
- A2.2 §1.5.2 instruction: "→ unnamed" → **KEEP "Asagiri"** (+ sync cast to
  Mohei/Sayo).
- A5 closing prd:drift note: `asagiri` REMOVED from the RETIRED list (kept).
- HD-27 open-question entry: marked **RULED (b) — keep Asagiri**.
Plan A is now consistent with all five rulings (HD-25…HD-29) and buildable
(A0–A4 now; A5 gated on Plan B shipping).
**Plan B carry-over (flagged, NOT fixed here):** the game plan's G4.9 still
lists `asagiri` in its prd-drift.ts RETIRED table — drop it when Plan B runs.

## Building storywave Plan A (human ruled: run A0→A4 straight through)

### A0 ✅ — the engine-ADR docket + HD-items archived
- `docs/living/decisions.md` — appended the **storywave docket**: grouping
  header (#1–#11 → ADR-152…ADR-162 mapping) + all **11 ADRs (ADR-152…ADR-162)**
  at the tail. Numbering verified (tail was ADR-151). ADR-159 carries the
  CORRECTED pillar engine (not the flat draft). Transcribed byte-faithfully by
  extracting the plan's ready-to-paste blocks (not hand-retyped).
- `project/human-in-the-loop/archive.md` — filed HD-25…HD-29 as CLOSED (they're
  ruled, so straight to archive, not the open queue): HD-25→ADR-159, HD-26/27/
  28/29 as mechanical/scope/canon rows, all → the s118 rulings capture.
- No open HD-items remain; decisions.md open list stays empty.

### A1 ✅ — PRD §5 → pointer-and-summary
- `project/archive/2026-07-07-prd-05-narrative-old-canon.md` — NEW: the old
  1203-line §5 archived VERBATIM (ADR-117 rule 3) with the ARCHIVED header;
  verified byte-identical below the header (text diff) + NUL-free (AC-15).
- `docs/living/prd/05-narrative.md` — REPLACED (1203 → ~150 lines) with the
  pointer-and-summary skeleton (§5.1 premise · §5.2 seven tiers · §5.3 ink
  thread · §5.4 laws · §5.5 what §5 no longer does · §5.6 rename ledger). The
  status banner (forward canon; shipped game trails) is present for A5 to
  remove. Asagiri row reads KEPT (HD-27). Added a §5.6 note listing the 4
  built satoyama quest titles (each unbroken on one line) so prd:drift's
  presence check stays green — QUESTS 4/4, RETIRED clean.
- `docs/story-bible/README.md` — HD-28 banner flip applied (authorized): the
  stale "PRD §5 describes the built game" line → "narrative sources + generated
  t0-story.md; PRD §5 is its pointer-and-summary". (The one §S read-only
  exception, human-blessed.)
- Gates: prd:drift clean, gen-prd-regions --check fresh (4 marker pairs intact),
  docs-lane verify green.

### A2.1 + §1.6 ✅ (done by hand — the ruling-critical parts)
- `docs/living/prd.md` (A2.1): V3 story-reboot status line; §5 retitled
  pointer-and-summary (ToC + link); v1 = full T0–T3; UNBUILT span T1–T6.
- `docs/living/prd/01-vision.md` §1.6 (the crown jewel): the four pillar labels
  → crisp canon **Estate/Arms/Office/Name**; "Office" (官威) kills the
  "Standing & Office" umbrella collision; the six-step grade ladder
  FAIL/BAD/OK/GOOD/GREAT/EXCELLENT (F/D/B/A/A+/S) stated + a canon-pointer note;
  seven-tier header. Points at 03-tiers.md as the engine home.

### A2.2–A2.7 + A3 + A4 ✅ (fanned out to 8 Opus subagents, one per file)
Rationale: the plan was already made ruling-consistent (HD-25/26/27/29 patched
into it), so subagents transcribing against the plan + bible were safe; I kept
the ruling-critical spine (A3) + HD-29 (A4 don't-archive) as brief overrides and
did all verification + commits. Objective gates on the stabilized tree:
**gen-prd-regions --check GREEN** (all 4 marker pairs byte-intact — the two
gen-region files §2/§3 handled correctly) and **prd:drift CLEAN**.
- **A2.2 §1** (rest): premise → bible (Tahei/landslide/family-alive; Tama is the
  village's thread via Sayo→Otsuru); cast sync (Mohei/Sayo; O-Nobu/Suzu/Kenta/
  Zenbei; Osen CUT); world/zones → bible ladders; cast table → 04-cast.md
  pointers; two-register ink thread; antagonists (DEBT · T4 Tomita; no rival-
  house G5/G7); §1.6.3 tier table + koku ladder → seven tiers.
- **A2.3 §2**: six-season manual calendar (ADR-153) + 4 forward-spec subsections
  (ADR-155/156/157/158); the munenori-line LANDMINE kept both names
  ("Munemasa (was Shigemasa)"); T5 Domain / T6 Edo.
- **A2.4 §3**: all ladders → R0–R7 × seven tiers; ⌂/⛩ alternation + hard lock;
  map re-label reveal; HD-29 R7 = use-name beat (capstone superseded for T0,
  kept for T1); §3.2.1 table reconciled to the bible beats.
- **A2.5 §4**: T5 Domain row inserted, Edo→T6 (no invented numbers); tier headers.
- **A2.6 §6**: enum 0..6 + forward-spec banner; six-season calendar bannered
  (built 28-day behavior preserved); koku ladder seven-tier.
- **A2.7 §7**: v1 = full T0–T3 (HD-26 CONFIRMED, no awaiting note); origin synced;
  cut-set → R0–R7 × 4 = 32 rungs.
- **A3 roadmap**: spine STATES the pillar engine (HD-25 kept, no awaiting note);
  seven tiers; SHIPPED rows byte-untouched; storywave near-term section (Plan A +
  Plan B rows); T0 milestone DoD names t0-arc.test.ts + invariants.test.ts.
- **A4 sweep**: fun-factor six→seven tiers (pillars kept); README story-bible
  pointer; story-bible-finish plan re-pointed; capstone plan NOT archived (HD-29
  adopt-partial); emergent-node-extensions left (no stale refs found).
- Drift-clearing: added §5.6 rows for **Osen** (cut) + **Tōzō** (retired smith).

### ⚠️ Known remaining §1 residuals (NOT in the A2.2 scope — flagged, not fixed)
The §1 agent correctly stayed within A2.2's edit list and flagged three
subsections that still carry old six-tier / Tama-belief premise language and need
a COHERENT pass (a lone token-flip would be worse): **§1.1 Vision**, **§1.5.4**
(a self-consistent "SIX-TIER SPINE" rep-arc), **§1.10** (kamikakushi-as-village-
belief). These are a §1 taste/vision pass — surfaced for a follow-up, not blocking
A2's DoD. Also: the rippled PRD merits a human taste-read (content fidelity is
beyond what prd:drift/gen-regions gates can verify).

### §1 residual pass ✅ DONE (human ruled: do it now)
Resolved the three flagged subsections + the dangling origin refs in
`docs/living/prd/01-vision.md`:
- **§1.1 Vision**: tier-sweep list → seven tiers (household/land → valley
  (Asagiri) → region → castle-town → domain → Edo); the Tama framing rewritten to
  the bible (the village half-adopts him as its OWN lost child Tama — a misreading
  the true story corrects (Tama = Otsuru, found grown); the dream returns Tahei /
  the landslide / the family that kept his register open).
- **§1.5.4**: "SIX-TIER SPINE" → **SEVEN-TIER**; the per-tier standing arc + the
  domain-expands list rebuilt to seven tiers (steward/yōnin ceiling at T5, the
  house's H0→H7 at T6); the origin `O0→O5` rung-ladder framing → a reputation
  side-track (docket #9); "House Influence spends to expand" → "the macro-measure
  the tier-gate reads — never spent" (§1.6 consistency).
- **§1.10**: added the softened kernel-#1 clause — a mundane truth may be
  "nobody's sin and even warm" (a child who ran, found grown; a family that
  refused to grieve), not only dark.
- Swept the three other dangling `O0→O5` origin-ladder refs (§1.5.3, §1.5.x,
  §1.12) → reputation side-track. Residual `V0→V7` hits are intentional
  forward-spec ("built game trails on V0→V7"). Gates: gen-regions fresh, drift
  CLEAN. This supersedes the "known remaining §1 residuals" note above.
