---
name: pending-prd-changes
description: Locked decisions & ADRs (2026-06-28 reshape + the 2026-06-29 decision session) NOT yet applied to the PRD / living docs / code
metadata:
  type: project
---

# Pending PRD/doc ripple — locked decisions not yet applied

> ✅ **PRD-FEEDBACK GATE CLEARED — 2026-06-29. THE RIPPLE IS GO.** Human sign-off: *"mark the ripple as having no
> more PRD feedback — we are ready to ripple."* The one-batch ripple (`DS#4`) is **UNBLOCKED** — but **NOT yet
> executed** (deliberately deferred to a later session). **Run it as the next major step** via the mechanism in
> "How to clear it" below; nothing further is waiting on the human to start it.

> **What this is.** The **complete** live checklist of locked design decisions that are **canon** but **not
> yet rippled** into `prd.md`, the other living docs, or the code. It now covers **two batches**:
> 1. the **2026-06-28 two-tier-Estate reshape** — ADRs **D-048…D-055** (see table A); and
> 2. the **2026-06-29 decision session** — **23 forward decisions** (`DS#1…DS#23`) that reconcile the v0.2
>    audit, amend signed locks, and add new build/scope/taste steers (see table B). Intent capture:
>    [`project/human-feedback/2026-06-29-decision-session.md`](../human-feedback/2026-06-29-decision-session.md).
>
> **Both batches ripple as ONE batch** (the human's process steer, `DS#4`): gather feedback → decide → ripple
> the PRD in a single sweep, not piecemeal.
>
> **Shorthand.** `DS#N` = item *N* in the 2026-06-29 decision session ledger. `D-0XX` = an ADR in
> [`decisions.md`](../../docs/living/decisions.md). Each checklist line is tagged with its source.

> **Precedence while pending (D-022).** Until each item below is applied, the **canon source of truth** is the
> ADR batch [`decisions.md` D-048…D-069](../../docs/living/decisions.md) **+** the intent captures
> [`2026-06-28-tier-reshape.md`](../human-feedback/2026-06-28-tier-reshape.md) and
> [`2026-06-29-decision-session.md`](../human-feedback/2026-06-29-decision-session.md). The `prd.md` body still
> describes the **old 5-tier model** and is **STALE** on the tier spine on every point below — read it with this
> tracker open. **NB (audit 2026-06-29):** the PRD body is **not** stale on "DEMO-default pacing" — §4.8 already
> states the real ≥30-min FLOOR; the **DEMO/REAL profile fork is a `balance.ts`/code artifact (Part 2, D-056)**,
> not a PRD-body edit. Don't "drop DEMO framing" from §4.8 — there's none there. The 2026-06-29 locks (`DS#1…DS#23`) are now **written as ADRs
> D-056–D-069** (`3f24fe6`) — see the **→ ADR crosswalk** under Table B (they were previously canon only via
> the feedback ledger). **Newest-human-steer-wins; annotate-don't-delete** (strike + point forward, never
> erase).

> **How to clear it.** Ideal as a single `battery`/Workflow doc-ripple sweep (map every site → propose edits
> per file → convergence critic), then regenerate `docs/content/` and run `npm run verify`. **Do the
> PRD-SPLIT (`DS#6`) FIRST** — every other PRD edit then lands in a small per-section file, not a 7k-line
> monolith. Tick items as applied; delete this file once empty.

---

## ⓪ DO FIRST — split the PRD (`DS#6` / H8)

- [x] **PRD-SPLIT** — ✅ **DONE (2026-06-29, `303a63f`).** Split the ~7k-line `docs/living/prd.md` into
  **per-section files with ASCII names** (`prd/01-vision.md … 07-roadmap-scope.md` — human's 2026-06-29 steer:
  no `§`/unicode in filenames; full map in the op-model v2 FINAL plan §2.E, now archived to
  [`../archive/2026-06-29-operating-model-v2-final.md`](../archive/2026-06-29-operating-model-v2-final.md)) +
  a `verify-prd` completeness check. **Mechanical, zero content change**; removed the truncation failure class.
  The ~41 content-ripple items below now each land in a small section file. *(DS#6, H8)*

---

## Table A — the 2026-06-28 reshape ADRs (D-048…D-055)

| ADR | Decision |
|---|---|
| **D-048** | 6 tiers: T0 Estate-*tutorial* · T1 Estate-*full* · T2 Village · T3 Region · T4 Castle-town · T5 Edo. Pillars 1→2→3→4→4, map **Estate→Arms→Office→Name**. v1 = T0→T3. |
| **D-049** | Tier-up = **manual opt-in story event**; hybrid grade-gate scaled `1 EXC + 1 GRT + (N−2) GOOD`; overshoot → permanent grade-scaled boon; **gentle pacing ramp** (T0 ~10–15 min/rung, floor-exempt; ≥30-min floor from T1). |
| **D-050** | Combat: **HP carries between fights**, **heals by eating (satiety)**; no stance strictly dominated. |
| **D-051** | Koku gets a **compounding estate-upgrade flywheel** feeding the Estate pillar (LAND/TREASURY). |
| **D-052** | Tutorial = **showcase-in-miniature**; T0/T1 content split; seed breadth (NPC-talk / areas / found-crafted weapon) lands **minimal now** (H5). |
| **D-053** | Active-only **"leave it running"** = **wall-time sim** (don't pause on `document.hidden`; stop only when closed). |
| **D-054** | **Milestone-integrity rule**: all-DoD-or-ADR-amended + a CI manifest check (H4). |
| **D-055** | Pillar teaser = **active + locked silhouettes**; **origin-mystery** payoff at Region + a **beat every tier**. |

## Table B — the 2026-06-29 decision session (DS#1…DS#23)

| # | Decision (one line) | Amends / refs |
|---|---|---|
| **DS#1** | **Real D-049 pacing is the DEFAULT** (T0 ~10–15 min/rung floor-exempt; T1 ≥30) + a **DEV-only 2×/4×/8× speed toggle** (a time multiplier, not a Demo/Real profile fork). | supersedes **D-047** DEMO-default |
| **DS#2** | **Minimal SFX pass** (hit / reward / rank-up) lands **before the R1 taste call**; full bed later. | **D-041** scope |
| **DS#3** | **Win-rate = analytic-for-gate / sampled-for-display split**; displayed == tested == same-for-every-player. | **amends signed D-043** |
| **DS#4** | Process: human drives; reel back H10; **PRD ripples in ONE batch** after feedback. | — |
| **DS#5** | **KEEP the signed 20–35% single-fight win-rate** as the first-fight criterion; HP-carry affects the grind, not the discrete first fight; tune a real foe into band + a RED-able test. | upholds signed band; pairs D-050 |
| **DS#6** | **Split `prd.md` → ASCII-named `prd/01-vision.md…07-roadmap-scope.md`** + a completeness check, as part of the batch. | H8 |
| **DS#7** | **Do NOT freeze §1 now** — PRD stays liquid through T0/T1/T2; freeze maybe at T3 or **never until v1 done**, then convert the whole PRD to living docs. | refines **D-020/D-021/D-046** |
| **DS#8** | **R1 quick-play now** for early direction signal (in flight — not a ripple item). | — |
| **DS#9** | **Roadmap re-axe = nested Tier→Milestones→Fun-slices** (not flat S0–S4); Claude proposes the cut. | roadmap |
| **DS#10** | **`diverge` skill = MANDATORY gate** for new UI (feeds the H10 op-model review — not adopted yet). | op-model (H10) |
| **DS#11** | **Operating Model v2 (H10) — human reviews separately (~1 hr)**; do NOT adopt op-model artifacts until signed. | human-queue |
| **DS#12** | **SFX style = traditional Japanese palette** — taiko / shamisen-koto / shakuhachi / temple-bell 鈴. | drives DS#2; ui-design + fun-factor |
| **DS#13** | **Early-game = humbling THROUGHOUT (incl. T0)** — T0 is *quick* (DS#1) but *not easy*; keep the mediocre-start bite; guardrails stay (winnable, soft-setback only, no permanent loss / dead-ends). | revises audit "tame friction" |
| **DS#14** | **First ascension (T0→T1) = a BIG ceremonial beat** — Yuji Syuku title card, macro silhouettes stir, dream/mystery beat, music swell, grade-scaled boon revealed. | pairs **D-049/D-055** |
| **DS#15** | **Save policy = WIPE dev/v0.2 saves** on the reshape schema bump (pre-launch); build + test real `migrate()` before launch. | **D-013a** governs shipped saves |
| **DS#16** | **Dev tools = speed toggle (2×/4×/8×) + jump-to-rung/tier teleport**; DEV-only, stripped from prod. | implements DS#1 |
| **DS#17** | **T0 tutorial STAYS non-hand-holdy** — no hint popups; fix the onboarding ding *within* non-hand-holding (clearer reveal beats + touch-legible readouts). | upholds **D-015** |
| **DS#18** | **Within-T0 build order = SPINE-FIRST, thin** — Estate pillar + first ascension on minimal content before showcase breadth. | roadmap |
| **DS#19** | **Shipped T0 = CARRY FORWARD + RETUNE** (not a fresh rebuild) — layer the reshape on the M0–M2b foundation. | pairs DS#15 |
| **DS#20** | **Koku flywheel = LINEAR now, BRANCH at T1** — small linear T0 estate-upgrade taste; split into LAND / TREASURY / TRADE (trade ≤⅓) at T1. | refines **D-051 / D-008** |
| **DS#21** | **Process = durable-by-default** (a plan/brainstorm/analysis is a FILE before it's implemented). | CLAUDE.md amended |
| **DS#22** | **Onboarding = DIEGETIC MENTOR** — an in-world character (drillmaster **Kihei** / an estate elder) teaches each system through dialogue as it unlocks. | lifts audit 5.5 within DS#17 |
| **DS#23** | **T0 areas = a SMALL WALKABLE MAP** (not just room-grouping); delivers the §1 "areas to explore" promise. | **D-012** full-maps-every-tier |

**→ ADR crosswalk (`DS#N → D-0NN`).** The 2026-06-29 locks are now ADRs in
[`decisions.md`](../../docs/living/decisions.md) (`3f24fe6`):
`DS#1`→**D-056** · `DS#3`→**D-057** · `DS#5`→**D-058** · `DS#7`→**D-059** · `DS#9`→**D-060** ·
`DS#13`→**D-061** · `DS#14`→**D-062** · `DS#22`→**D-063** · `DS#17`→**D-064** · `DS#23`→**D-065** ·
`DS#20`→**D-066** · `DS#15`+`DS#16`→**D-067** · `DS#2`+`DS#12`→**D-068** · `DS#21`→**D-069** ·
`DS#10`→**D-073** (the mandatory `diverge` gate — an op-model/process ADR, already ADOPTED + BUILT 2026-06-29,
so **out of the Part-1 design ripple**, not "held").
*No standalone ADR (process / human-queue / roadmap-level):* `DS#4` (one-batch ripple) · `DS#6` (PRD-split =
H8) · `DS#8` (R1 quick-play) · `DS#11` (op-model review — now ADOPTED as v2 FINAL, D-072) · `DS#18`
(spine-first) · `DS#19` (carry-forward) — the last two live in the roadmap re-axe (**D-060**), not a separate ADR.

---

## Ripple checklist — `docs/living/prd.md` (→ ASCII `prd/0N-*.md` files after the split; still 5-tier / DEMO-default throughout)

- [ ] **Top-matter status line** — references 5 tiers / T0–T4 → 6 tiers / T0–T5; note PRD stays **LIQUID** (no §1 freeze) per `DS#7`. *(D-048, DS#7)*
- [ ] **§1.6 "House Influence — the four pillars & the five tiers"** → **six** tiers; the reveal ramp **1→2→3→4→4**; the pillar→tier map. *(D-048)*
- [ ] **§1.6.1 four-pillars table / economy** → Estate sub-engines framed as the **koku flywheel**, **LINEAR in T0** → branch into **LAND / TREASURY / TRADE (trade ≤⅓)** at **T1**; confirm kanji **Office 官威 / Name 家格**. *(D-048, D-051, DS#20)*
- [ ] **§1.6.3 reveal set** — "T0 = 2-pillar special (Arms+Estate)" → **T0 = 1 pillar (Estate)**; the **scaled grade-gate** (`1 EXC + 1 GRT + (N−2) GOOD`; **T0 collapses to EXCELLENT**) + **manual opt-in ascension** + **overshoot reward**; the **active + locked-silhouette** teaser. *(D-048, D-049, D-055)*
- [ ] **§1.6.4 standing panel + §2.16 reveal ramp** → §2.16 "T0 = 2-pillar special (Arms+Estate)" → **T0 = 1 pillar (Estate)**; the reveal **ramp 1→2→3→4→4** across the 6 tiers (one bar at a time); §1.6.4 / §2.16(e) standing panel = **active pillar + locked unnamed silhouettes**; re-verify the §2.16.1 "T3+" marriage/adoption label after the renumber. *(D-048, D-055)*
- [ ] **§1.7 world table** (T0–T4) → renumber to **T0–T5** with the Estate split; new T1 (full estate) row; **T0 = a small walkable map** (areas-to-explore promise kept in the tutorial). *(D-048, DS#23)*
- [ ] **§1.9 dream cadence** → **a dream/mystery beat at every tier transition**; payoff stays at Region (T3); the **T0→T1 beat lands BIG** (first-ascension ceremony). *(D-055, DS#14)*
- [ ] **§3 unlock ladders** → **T0 = R0→R7 (tutorial)** + **T1 ≈ R8→R15 (full)**; the miniature-system reveals in T0; reveals **non-hand-holdy** (reveal-as-plot, no popups) via a **diegetic mentor**. *(D-052, DS#17, DS#22)*
- [ ] **§4.6 combat** → **HP carries + heals by eating**; **no stance strictly dominated** (replace the dominance-enshrining test); **KEEP the signed 20–35% single-fight win-rate** as the first-fight criterion (HP-carry affects the grind, not the discrete first fight) + a RED-able foe-in-band test. *(D-050, DS#5)*
- [ ] **§4.6.4b / §4.6.7 win-rate** → the **analytic-for-gate / fixed-seed-sampled(n=400)-for-display split**; codify **displayed == tested == same-for-every-player** (amends the §4.6.4b "analytic, not sampled" wording). *(DS#3, amends D-043)*
- [ ] **§4.8 pacing budget** → **re-map the stale per-tier FLOORS** (the OLD `4.5/8/16 h` for old-T0/T1/T2 → the new 6-tier spine) and **re-derive the ~28.5h Phase-1 FLOOR across the 4 v1 tiers** (T0–T3); **T0 floor-exempt gentle ramp** (~10–15 min/rung), the ≥30-min floor binds **from T1**; add the **humbling-throughout** note (T0 is *fast*, not *easy*). **NOT here:** "drop the DEMO-default framing" + the DEV speed multiplier are **`balance.ts`/code (Part 2, D-056/D-067)** — §4.8's body has no DEMO text to drop. *(D-049, DS#1, DS#13)*
- [ ] **§5 tier content** → new **T0 tutorial / T1 full**; renumbered Village/Region/Castle/Edo; the **ascension story events** (first one BIG); per-tier **mystery beats**; the **diegetic-mentor onboarding**; the **small walkable T0 map**; **T0 stays non-hand-holdy** (fix onboarding ding via clearer reveal beats, not popups). *(D-048, D-049, D-052, D-055, DS#14, DS#17, DS#22, DS#23)*
- [ ] **§3 / §4.6 / §5 / §2.8 weapon-line RE-PLACEMENT** (audit gap — a locked roadmap steer, NOT just a renumber) → re-place the weapon archetype LINES onto the 6-tier spine: **Line 1 spear** in T0 (roster +2), **Line 2 sword** opens in **T1** (roster +3), **Line 3 Staff/polearm (Bō・Naginata・Kanabō・Tetsubō)** **PULLED FORWARD from Region into new-T2 Village** (roster +4) so the roster is **complete by end-of-T2**; **new-T3 Region = combat DEPTH, no new line**. All found/crafted, never gifted. Source: `roadmap.md:186/223/324`. *(D-048, D-052, roadmap T2-M1-F5)*
- [ ] **§4.3.1 / §3 cross-pillar combo RE-TIMING** (audit gap — locked roadmap steer) → the single "combos unlock at the Region tier" → a **PARTIAL Office-pairs set at new-T2 Village** (Arms×Office, Estate×Office — Office reveals at T2) + the **FULL 4-pillar set at new-T3 Region** (when Name reveals). Combos stay post-trade-clamp, excluded from the gate-check + the trade-⅓ denominator (D-031). Source: `roadmap.md:205/327`. *(D-048, D-031, roadmap T2-M3-F3)*
- [ ] **§4 / §4.7.5 economy** → the **compounding estate-upgrade** sink (replaces the finite power-neutral `estateStage`), **LINEAR in T0** → **LAND/TREASURY/TRADE branch (trade ≤⅓) at T1**. *(D-051, DS#20)*
- [ ] **§6.9 active-only loop + §6.3 clock + §2.2** (audit fix — **NOT §6.10**, which is the DEV play API) → reframe the stale "Backgrounding pauses" / "Never wall-clock" wording: **advance by elapsed wall-time while the tab is OPEN** (don't pause on `document.hidden`; a throttled background tab **catches up** on its next tick; progress stops only when **CLOSED**); keep **active-only / no offline accrual** + the autosave dirty-guard. *(D-053)*
- [ ] **§7 milestones / DoD** → **🔁 REFINED by the addendum "§7 = SLIM + DELEGATE" item below** — do **not** ADD milestone content to §7; the M0–M7 build-order moves out to `docs/living/roadmap.md`. §7 keeps only: the **milestone-integrity rule** (referenced, not restated), the **locked v1 scope** (T0→T3 + §4 acceptance criteria), the **save-WIPE** at the schema bump, deployment + the risk register. *(D-054, D-048, DS#19, DS#15; see addendum)*

## Ripple checklist — other living docs

- [x] ✅ **`docs/living/decisions.md`** — **ADRs for the 2026-06-29 locks WRITTEN** as **D-056–D-069** (`3f24fe6`): the win-rate split amends signed D-043 (**D-057**), pacing-default supersedes D-047 (**D-056**), the freeze refine of D-020/D-021/D-046 (**D-059**), + carry-forward / linear-flywheel / diegetic-mentor / walkable-map / SFX / humbling-throughout / save-wipe / dev-tools (**D-061…D-068**). See the **→ ADR crosswalk** under Table B. *(DS#1, DS#3, DS#7, DS#13–DS#23)*
- [x] ✅ **`docs/living/roadmap.md`** — **DONE** (promoted 2026-06-29, session-11): re-axed to the **nested Tier→Milestones→Fun-slices** structure (per the [archived re-axe proposal](../archive/2026-06-29-roadmap-reaxe-proposal.md)); **spine-first, thin within T0**; **carry-forward + retune** M0–M2b; the new milestone (Estate-tutorial + T0→T1 spine); milestone-integrity DoD; renumbered tiers; v0.2 gates baked as forward contracts. *(DS#9, DS#18, DS#19, D-048, D-054)*
- [ ] **`docs/living/qa-playtesting.md`** — `state()` snapshot `tier: 0..4` → **0..5**; `outcome` add **`t3done`** (v1 finish); document the **DEV speed toggle + jump-to-rung/tier** harness affordances. *(D-048, DS#16)*
- [ ] **`docs/living/ui-design.md`** — the House Influence **silhouette teaser** panel + pillar bars; the **first-ascension ceremony card** (Yuji Syuku title card, silhouettes stir, music swell); the **small walkable T0 map** surface; the **traditional-palette SFX** cues. *(D-055, DS#14, DS#23, DS#12)*
- [ ] **`docs/living/fun-factor.md`** — the tutorial-vs-grind pacing framing (T0 hook / T1 floor); **humbling THROUGHOUT** (T0 quick but not easy — keep the mediocre-start bite, guardrails intact); onboarding fun via the **diegetic mentor** (no popups). *(D-049, DS#13, DS#22)*
- [ ] **`project/status/working-agreements.md`** — the milestone-integrity rule (all-DoD-or-amend + CI manifest); confirm the **durable-by-default** process (`DS#21`) is reflected (CLAUDE.md already amended — verify, don't duplicate). *(D-054, DS#21)*
- [ ] **SFX SPEC (Part-1 deliverable) → new `docs/living/sfx-spec.md` + cross-refs in `ui-design.md` / `fun-factor.md`** — **specify** the **minimal SFX pass** (hit / reward / rank-up) in the **traditional Japanese palette** (taiko / shamisen-koto / shakuhachi / temple-bell 鈴) as the contract for the Part-2 audio module; lands **before the R1 taste call**. *(The Web Audio module that implements it is **Part 2 / code**, line below.)* *(DS#2, DS#12, D-041, D-068)*
- [ ] **`docs/content/` (generated)** — ⚠️ **PART 2 (follows the code).** Regenerate **after** `gen-docs.ts` + the code reflect the new tiers/rungs/economy (incl. the linear-T0 flywheel) — a generated artifact, can't lead the build. *(D-048, D-052, DS#20)*

## Ripple checklist — code (`src/`) — ⚠️ PART 2 (the build), NOT the Part-1 markdown ripple

> **Audit boundary (2026-06-29):** every box in this section is **Part 2 of `path-to-v0.3`** (the TypeScript
> build) — it does **not** run in the Part-1 doc/PRD markdown ripple. The Part-1 executor edits the PRD section
> files + the other living docs **only**; these code boxes + the generated `docs/content/` regen below are
> deferred to the spine-first build phase. (D-056's "drop the DEMO/REAL fork" lives here too, not in §4.8.)

- [ ] **Tier enum / type** → `0..5` + the 6 tier names. *(D-048)*
- [ ] **`ranks.ts`** → the T0 R0→R7 tutorial ladder + the T1 R8→R15 full ladder. *(D-048, D-052)*
- [ ] **`state.ts`** → the four-pillar state `{value, highWater}`; `tier`; a tier-up-**available** flag. *(D-048, D-049)*
- [ ] **`step.ts`** → `onSeasonBoundary` seasonal judged-result; the tier-gate eval; **wall-time clock catch-up**. *(D-049, D-053)*
- [ ] **`rewards.ts`** → `pillarDeltas` (deed → pillar); the **ascension reward** bundle (grade-scaled); the **first-ascension BIG beat** trigger. *(D-049, DS#14)*
- [ ] **`combat.ts` / `fight.ts`** → read **carried HP**; heal-by-eating; stance non-domination; tune a real foe to the **20–35% single-fight band** + the RED-able test. *(D-050, DS#5)*
- [ ] **win-rate code** (`combat.foeForecasts`) → **analytic for the gate/guard**, **fixed-seed sampled (n=400) for the displayed** number; assert displayed == tested. *(DS#3, amends D-043)*
- [ ] **estate-upgrade flywheel** (the koku sink) + content → **LINEAR in T0**, **LAND/TREASURY/TRADE branch (trade ≤⅓) at T1**. *(D-051, DS#20)*
- [ ] **content registries** → tiny **market**, the **found/crafted** 2nd weapon, the **diegetic-mentor dialogue** line(s), and a **small walkable T0 map** (areas). *(D-052, DS#22, DS#23)*
- [ ] **DEV tools** → the **2×/4×/8× speed toggle** (a time multiplier) + a **jump-to-rung/tier teleport**; DEV-only, stripped from prod. *(DS#1, DS#16)*
- [ ] **`migrate.ts`** → **WIPE dev/v0.2 saves** at the reshape `SCHEMA_VERSION` bump (pre-launch); still **build + test the real `migrate()` path before launch**; keep D-013a forward-migration for shipped saves. *(DS#15, D-013a, D-048, D-050)*
- [ ] **carry-forward, don't rebuild** → layer the reshape (HP-carry/heal, found-crafted 2nd weapon, pillar + ascension, SFX, dev tools, humbling-friction tune) onto the working M0–M2b foundation. *(DS#19)*
- [ ] **audio** → a small Web Audio **minimal SFX** module (hit / reward / rank-up), traditional palette, DEV-toggleable. *(DS#2, DS#12, D-041)*
- [ ] **CI manifest check** → assert every DoD-named instrument resolves to a real test/tool. *(D-054)*

---

## NOT part of this ripple (human-queue / process — tracked so nothing is lost)

- **Operating Model v2 (H10)** — ✅ **ADOPTED as "v2 FINAL" (2026-06-29, D-072) + BUILT** (the prior "defer /
  do-NOT-adopt" stance, **D-070/D-071, is REVERSED**). Not a ripple item — it's already shipped process. *(DS#11)*
- **`diverge` skill = mandatory UI gate** — ✅ **canon + BUILT (D-073, 2026-06-29)**; the `playcheck` ratchet is
  **D-074**. No longer "held for H10 sign-off" — already adopted. *(DS#10 → D-073)*
- **R1 quick-play** — human plays the demo now for a direction signal (cold-open hook / woodblock look)
  → http://localhost:5173/. In flight; not a doc/code edit. *(DS#8)*
- **Durable-by-default process** — `DS#21` notes CLAUDE.md is already amended; just **verify** it (above),
  don't re-apply. *(DS#21)*
- **Version-display PRD formalization (§6.1.1 / Q54)** — the session-14 git-describe build stamp is already
  speced under Q54 + wired; a PRD §6.1.1 formalization is **OUT of this reshape batch unless the human elects it**
  (verify-only during the §6 pass). Tracked here so the flag survives the next status rollover. *(session-14)*

---

## Already done (across both sessions)

- ✅ **ADRs D-048…D-055** written into `docs/living/decisions.md` (2026-06-28).
- ✅ **ADRs D-056…D-069** (the 2026-06-29 locks `DS#1…DS#23`) written into `docs/living/decisions.md` (2026-06-29, `3f24fe6`) — see the **→ ADR crosswalk** under Table B.
- ✅ **2026-06-28 reshape intent** captured verbatim in `project/human-feedback/2026-06-28-tier-reshape.md`.
- ✅ **2026-06-29 decision session** captured verbatim in `project/human-feedback/2026-06-29-decision-session.md`
  (all 23 decisions; v0.2 audit marked 100% closed).
- ✅ **Roadmap re-axe proposal** + **op-model v2-lite reel-back** authored in `docs/plans/`.
- ✅ **This tracker** created (2026-06-28) and **expanded to the full backlog** (2026-06-29).

## Pointers

- Decisions (ADRs): [`docs/living/decisions.md` D-048…D-055](../../docs/living/decisions.md)
- Intent / human directives: [`2026-06-28-tier-reshape.md`](../human-feedback/2026-06-28-tier-reshape.md) ·
  [`2026-06-29-decision-session.md`](../human-feedback/2026-06-29-decision-session.md)
- Plans (archived): [`roadmap-reaxe-proposal`](../archive/2026-06-29-roadmap-reaxe-proposal.md) ·
  [`operating-model-v2-final`](../archive/2026-06-29-operating-model-v2-final.md)
- The audits that drove it: [`2026-06-27-state-of-the-game.md`](../audit/reports/2026-06-27-state-of-the-game.md) · [`…-v0.2-2026-06-28.md`](../audit/reports/2026-06-28-state-of-the-game-v0.2.md)

---

## Addendum (2026-06-29, session-11) — post-promotion ripple updates

> Added after the roadmap re-axe was **promoted** to `docs/living/roadmap.md` (session-11) and the **5
> provisional forks finalized** ([ledger](../human-feedback/2026-06-29-roadmap-forks-finalized.md)). These
> refine the checklists above — fold them in when the batch runs.

**Status flip (an existing item is now done):**
- ✅ **`docs/living/roadmap.md` re-axe — DONE** (promoted 2026-06-29, session-11): nested
  Section→Milestones→Fun-slices, **T0/T1/T2 detailed + a Ship section**, carry-forward M0–M2b,
  milestone-integrity DoD, 6-tier renumber, v0.2 gates baked as forward contracts. The old M0–M7 tracker is
  retired. *(closes the `docs/living/roadmap.md` line above — DS#9, DS#18, DS#19, D-048, D-054)*

**New / refined items (from the promotion + the finalized forks):**
- [ ] **§7 `prd/07-roadmap-scope.md` = SLIM + DELEGATE, do NOT re-duplicate.** Its 809-line **M0–M7** milestone
  roadmap is fully superseded by the now-**living** `docs/living/roadmap.md`. Per *generate-don't-duplicate* +
  D-020/D-021, **gut the milestone/build-order duplication** and keep only the **locked v1 scope** (T0→T3 + the
  §4-locked acceptance criteria), the **deployment** path (itch), and the **risk register**; **point** the
  roadmap/build-order at `docs/living/roadmap.md` as the single source. *(refines the "§7 milestones/DoD" line
  above — that content now lives in the roadmap; §7 should reference, not restate. D-021, D-059, DS#9)*
- [ ] **§3 / `ranks.ts` — T1 two-track rung meter.** R8→R15 runs on **two sub-meters** (Estate-Service labour +
  Combat-Rank martial); promotion on the Phase-1 AND-gate (both ≥ floor + the story milestone). *(fork #3)*
  → **Part-1 = the §3 prose** (describe the two-track meter); **Part-2 = `ranks.ts`** (the build).
- [ ] **§5 / content — T1 first retinue + estate stage.** First paid retinue (**Gohei & Yatarō**) and the
  **E1→E2** estate-stage advance both land in **T1** (E2→E3+ slips to T2+). *(fork #2)*
  → **Part-1 = the §5 prose** (narrative beats); **Part-2 = the content registries** (the build).
- [ ] **§5 — rival houses.** **Tomita (= money) / Akagi (= honour)** introduced + the contest **BEGINS at T2**;
  the climax (Naoyuki ally-flip, G7 dethroning) at **T3**. *(fork #4)*
- [ ] **§1.7 / §5 — T2 name.** T2 stays **"Village"** (social-scale ladder) with the sharpened frame **"the
  valley beyond your gate"** — no tier rename. *(session-11 naming call)*
- [ ] **§4 / §4.8 — provisional balance from the forks.** Per-tier hour floors (**T1 ~5–8h · T2 ~8–10h · ≈40
  min/rung**) + deed-band magnitudes (**T1** Arms 0.5K/0.72K/0.95K cap 20 ip + Estate 0.8K/1.1K/1.5K · **T2**
  Office 2K/3.2K/4.5K cap 80 ip) — **ACCEPTED AS PROVISIONAL** (§4 liquid, D-059); the 28.5h budget re-derives
  at Ship-M1-F2. Use these as the starting magnitudes in the §4 ripple. *(forks #1 + #5)*

**Stale plan pointers — ✅ FIXED (2026-06-29, session-13):** the plan pointers above + the §7/Precedence links
were repointed from `docs/plans/2026-06-29-{roadmap-reaxe-proposal,operating-model-v2-final}.md` to their
`project/archive/` locations (both archived session-12).
