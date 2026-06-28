---
name: pending-prd-reshape
description: Locked decisions & ADRs (2026-06-28 reshape) NOT yet applied to the PRD / living docs / code
metadata:
  type: project
---

# Pending PRD/doc reshape — human feedback & ADRs not yet applied

> **What this is.** A live checklist of the **2026-06-28 two-tier-Estate reshape** decisions that are **LOCKED
> canon** (ADRs **D-048…D-055**) but **not yet rippled** into `prd.md`, the other living docs, or the code.
>
> **Precedence while pending (D-022).** Until each item below is applied, **the ADR batch
> [`decisions.md` D-048…D-055](../../docs/living/decisions.md) + the intent capture
> [`2026-06-28-tier-reshape.md`](../feedback/2026-06-28-tier-reshape.md) are the SOURCE OF TRUTH.** The
> `prd.md` body still describes the **old 5-tier model** and is **STALE** on every point below — read it with
> this tracker open. Newest-human-steer-wins; annotate-don't-delete.
>
> **How to clear it.** Ideal as a single `battery`/Workflow doc-ripple sweep (map every site → propose edits
> per file → convergence critic), then regenerate `docs/content/` and run `npm run verify`. Tick items as
> applied; delete this file once empty.

## The locked decisions (one-line each → full ADR)

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

---

## Ripple checklist — `docs/living/prd.md` (the big one; still 5-tier throughout)

- [ ] **Top-matter status line** — references 5 tiers / T0–T4 → 6 tiers / T0–T5. *(D-048)*
- [ ] **§1.6 "House Influence — the four pillars & the five tiers"** → **six** tiers; the reveal ramp **1→2→3→4→4**; the pillar→tier map. *(D-048)*
- [ ] **§1.6.1 four-pillars table** → Estate sub-engines framed as the **koku flywheel**; confirm kanji **Office 官威 / Name 家格**. *(D-048, D-051)*
- [ ] **§1.6.3 reveal set** — "T0 = 2-pillar special (Arms+Estate)" → **T0 = 1 pillar (Estate)**; the **scaled grade-gate** + **manual opt-in ascension** + **overshoot reward**. *(D-048, D-049)*
- [ ] **§1.6.4 / §2.16(e) standing panel** → **active pillar + locked unnamed silhouettes**. *(D-055)*
- [ ] **§1.7 world table** (T0–T4) → renumber to **T0–T5** with the Estate split; new T1 (full estate) row. *(D-048)*
- [ ] **§1.9 dream cadence** → **a dream/mystery beat at every tier transition**; payoff stays at Region (T3). *(D-055)*
- [ ] **§3 unlock ladders** → **T0 = R0→R7 (tutorial)** + **T1 ≈ R8→R15 (full)**; the miniature-system reveals in T0. *(D-052)*
- [ ] **§4.6 combat** → **HP carries + heals by eating**; **no stance strictly dominated** (replace the dominance-enshrining test). *(D-050)*
- [ ] **§4.8 pacing budget** → re-derive ~28.5h across the **4 v1 tiers**; **T0 floor-exempt gentle ramp**, floor from T1. *(D-049)*
- [ ] **§5 tier content** → new **T0 tutorial / T1 full**; renumbered Village/Region/Castle/Edo; the **ascension story events**; per-tier **mystery beats**. *(D-048, D-049, D-052, D-055)*
- [ ] **§4 economy** → the **compounding estate-upgrade** sink (replaces the finite power-neutral `estateStage`). *(D-051)*
- [ ] **§6.10 / the clock** → **wall-time catch-up** when the tab is hidden; keep the autosave dirty-guard. *(D-053)*
- [ ] **§7 milestones / DoD** → the **milestone-integrity rule**; the **new milestone** (T0 tutorial content + the T0→T1 one-pillar ascension). *(D-054, D-048)*

## Ripple checklist — other living docs

- [ ] **`docs/living/roadmap.md`** — the new milestone (Estate-tutorial + T0→T1 spine); milestone-integrity DoD; renumbered tiers; bake the now-live v0.2 gates as forward contracts. *(D-048, D-054)*
- [ ] **`docs/living/qa-playtesting.md`** — `state()` snapshot `tier: 0..4` → **0..5**; `outcome` add **`t3done`** (v1 finish). *(D-048)*
- [ ] **`docs/living/ui-design.md`** — the House Influence **silhouette teaser** panel + pillar bars. *(D-055)*
- [ ] **`docs/living/fun-factor.md`** — the tutorial-vs-grind pacing framing (T0 hook / T1 floor). *(D-049)*
- [ ] **`project/status/working-agreements.md`** — the milestone-integrity rule (all-DoD-or-amend + CI manifest). *(D-054)*
- [ ] **`docs/content/` (generated)** — regenerate after `gen-docs.ts` reflects the new tiers/rungs/economy. *(D-048, D-052)*

## Ripple checklist — code (`src/`)

- [ ] **Tier enum / type** → `0..5` + the 6 tier names. *(D-048)*
- [ ] **`ranks.ts`** → the T0 R0→R7 tutorial ladder + the T1 R8→R15 full ladder. *(D-048, D-052)*
- [ ] **`state.ts`** → the four-pillar state `{value, highWater}`; `tier`; a tier-up-**available** flag. *(D-048, D-049)*
- [ ] **`step.ts`** → `onSeasonBoundary` seasonal judged-result; the tier-gate eval; **wall-time clock catch-up**. *(D-049, D-053)*
- [ ] **`rewards.ts`** → `pillarDeltas` (deed → pillar); the **ascension reward** bundle (grade-scaled). *(D-049)*
- [ ] **`combat.ts` / `fight.ts`** → read **carried HP**; heal-by-eating; stance non-domination. *(D-050)*
- [ ] **estate-upgrade flywheel** (the koku sink) + content. *(D-051)*
- [ ] **content registries** → tiny **market**, the **found/crafted** 2nd weapon, one **NPC dialogue** line, **areas**. *(D-052)*
- [ ] **`migrate.ts`** → the `SCHEMA_VERSION` bump for pillars / tier / carried-HP; a v0.2→new from→to test. *(D-048, D-050)*
- [ ] **CI manifest check** → assert every DoD-named instrument resolves to a real test/tool. *(D-054)*

---

## Already done (this session)

- ✅ **ADRs D-048…D-055** written into `docs/living/decisions.md`.
- ✅ **Intent captured** verbatim in `project/feedback/2026-06-28-tier-reshape.md`.
- ✅ **This tracker** created.

## Pointers

- Decisions: [`docs/living/decisions.md` D-048…D-055](../../docs/living/decisions.md)
- Intent / human directive: [`project/feedback/2026-06-28-tier-reshape.md`](../feedback/2026-06-28-tier-reshape.md)
- The audits that drove it: [`state-of-the-game-2026-06-27.md`](../audit/reports/state-of-the-game-2026-06-27.md) · [`…-v0.2-2026-06-28.md`](../audit/reports/state-of-the-game-v0.2-2026-06-28.md)
