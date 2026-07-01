# Plan A — Reconcile the PRD & docs to standalone end-state (v1.0.0)

**Status:** ✅ IMPLEMENTED (2026-07-01) — all 11 files rewritten to end-state via
a subagent workflow (`wf_50f1eed5-997`, 22 agents) + adversarially reviewed (every
file **contentPreserved: true** — no canon deleted; 9 review fixes applied incl. the
one MAJOR, a ui-design stance-axis that contradicted D-101; `npm run verify` green).
**Paired with** [Plan B — v0.3.2 build](2026-07-01-v0.3.2-build-close-the-gap.md)
(the 17 build-behind items — **on hold** per the human "play the game, not build
v0.3.2" steer). **Governing:** [D-097](../living/decisions.md) + best-of-both.

> **Deferred minor polish** (non-blocking, noted for a later pass): §1.12 pre-existing
> T2/T3 memory-frontier tension (not introduced here); fun-factor.md line-wrap;
> qa-playtesting.md "(proposed)" snapshot header; the §4 3-works-vs-build-4-purchases
> (U-ladder) count reconcile → **Plan B**.

**Provenance:** distilled from an adversarial `Workflow` (73 agents, run
`wf_6af639b4-3a9`; raw snapshot in
`project/brainstorms/raw/2026-07-01-prd-reconcile-v031-w513ky240.json`) — ground
truth from code+journals+ADRs, every direction call independently refuted.

> **This is a plan** — it references ADRs freely. The no-inline-ADR-refs rule is
> for the **PRD prose** (the end-state target), not for this planning doc.

---

## 1 · Verdict

**Vision-true, spec-stale.** §1's vision AGREES and the v0.3.1 build *reinforces*
it (no locked-vision violations). But at the system/data/index level the PRD
drifted — §2 + roadmap stale-heavy, §3/§4/§5/§6/§7 mixed, **all 8 doctrine-HEAVY**.
The drift is overwhelmingly **incomplete-ripple**: the authoritative deep-dives
(§4.6.6b/c/d, §4.2.2) were rippled for v0.3.1; the **overview/summary surfaces**
that restate the same mechanics were not.

**Buckets:** 19 PRD_STALE → fix here · 17 BUILD_BEHIND → **Plan B** · ~150 doctrine
strips → here · 6 forks → **now RESOLVED** (§4 below).

| Section | reconcile | doctrine | Notes |
|---|---|---|---|
| §1 Vision | AGREES | HEAVY | vision intact; strip §1.14 ADR table + Round-A changelog |
| §2 Systems | STALE-HEAVY | HEAVY | combat loss-loop (HIGH), bank, stance, clock; delete §2.22 checklist |
| §3 UnlockLadder | MIXED | HEAVY | map-as-cosmetic-R6-screen; deep-satoyama reveal; `canon §X` refs |
| §4 CombatBalance | MIXED | HEAVY | rippled deep-dives OK; strip RESHAPE/NEW tags; FINAL T0 table |
| §5 Narrative | MIXED | HEAVY | boar/node loci; strip "flagged for human"; T4/T5 build-status |
| §6 TechDataModel | MIXED | HEAVY | worst data-model drift; delete §6.13 changelog |
| §7 RoadmapScope | MIXED | **HEAVIEST** | whole section reads as a build queue → re-conceive as v1.0.0 scope |
| `roadmap.md` | — | — | **TRACKER, not a PRD section — keep its status framing; fix only 3 lines + retire the H13 note** |

## 2 · Ledger 1 — FIX_PRD (build won by a signed ADR; update PRD prose)

Magnitudes stay LIQUID (D-059). The ADR named holds the superseded *why*; PRD prose
states the end-state as fact.

**Combat/bank rework (D-076/090/091):**
- **[HIGH]** §2 `02-systems.md:435–440` — rewrite the loss loop: **no auto-heal; HP
  accumulates; a lost fight → HP=1, bites carried wealth (~20% koku + ~⅓ mats;
  banked sheltered), STOPS autopilot.** Delete "self-recovering / rest-to-recover /
  play always continues."
- §2 `:202–203` + §6 `:276` — add `banked` (carried at-risk vs banked sheltered).
- §4 `:1729–1730` — §4.9 index: "possible loot drop" → defined carried bite + kura shelter.
- `roadmap.md:72` — "self-recovering losses" → "loss bites carried wealth + stops autopilot."

**Spatial map + deep-satoyama 7th node (D-078/D-093; D-065):**
- §1 `:669–671` — add deep-satoyama (奥山): T0 has **two** danger rings; gates
  `forage_deepwoods`, dens the boar. (T2 Foothills stays parked.)
- §3 `:288`/`:284` — deep-satoyama as the R2 reveal + room-table row; note the kura
  gains banking when the estate panel reveals.
- §5 `:225`/`:210` — den the boar at deep-satoyama; add 奥山 to the node list.
- §6 `:275` — `currentArea: AreaId` → **`location: MapNodeId`**; `travel` → `move_to`
  (clears `autoCombat`); 7 nodes vs 6 AreaDefs.

**Judge cadence (D-094):**
- §2 `:132` + §6 `:300`/247/501/612–613 — replace the `pendingAppraisals` counter
  with per-pillar `PillarState{value,highWater,judged}` folded one day at a time
  (corrected in only 1 of 5 places today — internal contradiction).
- `roadmap.md:115` — `onSeasonBoundary` → `onReckoning`; cadence keyed to `PHASE2_JUDGE_INTERVAL_DAYS`.

**Other ADR-backed:**
- §2 `:109–120` — delete "wall-time sim while backgrounded / catches up" →
  active-only, pauses on `document.hidden` (D-079).
- §6 `:286` — **ADDITIVE** `estateStage` **while PRESERVING** `influence.subEngines`
  as the intended T1+ form (backing D-051/D-066/D-033, not D-092).
- §6 `:274` — document the actual **0-based** day storage (render adds +1).
- `roadmap.md:73` — drop "(currently a grant…)/@combat-Lv2"; wood_axe is found/crafted.

## 3 · Ledger 2 — BUILD_BEHIND → moved to **Plan B**

The 17 good-canon-the-build-skipped items are **not** PRD edits — the PRD keeps
them; the **build** owes them. They live in
[Plan B — v0.3.2](2026-07-01-v0.3.2-build-close-the-gap.md). This plan does **not**
touch that PRD content.

## 4 · Forks — RESOLVED (D-098…D-103): the doc edits each spawns

Each fork now yields concrete Plan-A doc edits (and a Plan-B build handoff):

- **F1 · Estate E-numbering (D-098):** rename built purchase steps to `U1–U4`
  ("kura-works"); keep `E0–E5` narrative condition. **DOC:** across §1/§2/§3/§4/§5/§7
  + roadmap, use `E#` for condition, `U#` for purchase upgrades. (Build renames code
  → Plan B.) *Clears 7 of the 12 divergence findings.*
- **F2 · Market / finances (D-099):** **DOC:** reframe "no market in T0" → "no
  *trade engine* in T0; a small capped provisioning shop is a personal koku sink";
  introduce the **player-finances ≠ estate-finances** split into the §2.4 / §6
  resource model. (Build models the two lanes → Plan B.)
- **F3 · Combat model (D-100):** keep the PRD 5-attr + accuracy/evasion model. **DOC:**
  §4 stays as written (it's the intent); remove any "flat rolls / 3-attr" as-built
  hedges. (Build implements it at T0 → Plan B, HIGH.)
- **F4 · Stance axis (D-101):** glass cannon ↔ tank (attack vs damage-taken). **DOC:**
  revise §4.6.10 (off defense/speed) + §2.8 Stance shape to the atk/damage-taken
  model; drop wear-as-the-axis. (Build demotes `wearMult` → Plan B.)
- **F5 · Weapons (D-102):** "≥1 craftable"; T0 = 3 weapons (pole + 2). **DOC:** §4.6.9
  / §1 / §5 T0 weapon row = pole (start) + 2 more; keep the 3-line archetype vision.
  (Build adds a 3rd weapon → Plan B.)
- **F6 · Interactive combat (D-103):** defer, don't retire. **DOC:** §6.3/§6.4 mark
  `combat?: CombatEncounterState` + `combat_action` as **forward-tier (T1/T2)**, not
  T0 state. (No T0 build.)

## 5 · Doctrine cleanup (mechanical strip → end-state prose)

Kinds: `ADR_REF` (strip inline D/Q/FU) · `BUILD_NUANCE` (drop v0.3.1/M#/shipped) ·
`NOT_ENDSTATE` (delete "old-X-superseded" changelogs) · `NOT_STANDALONE` (resolve
`canon §X`/dangling pointers) · `PROVISIONAL_SCAFFOLD` (delete freeze/liquid/TBD).

- **§1 (~20):** delete revision banner, §1.14 ADR table, Round-A changelog,
  open-items block; strip inline refs; state names/facts plainly.
- **§2 (~22):** strip opening blockquote + merge-note; delete §2.22 checklist +
  reshape footer; fix the dangling `§2.16→§2.4` bank cross-ref.
- **§3 (~14):** strip provenance banner, `(proposed v1 balance)` ×15, fork-labels;
  resolve `canon §C/§I/…` to prose; author T1 R8→R15 rung copy (or cross-link).
- **§4 (~24):** delete STATUS/REBALANCE/RESHAPE banners + `(NEW — D-xxx)` tags ×15;
  **replace the "[OLD-scheme]" T0 pacing table with the FINAL table**; fill TBD
  bands; rename §4.8.2/3 to Village=T2/Region=T3.
- **§5 (~10):** delete STATUS banners + "flagged for the human"; cross-link §2/§6 for
  data shapes; reframe T4/T5 without build-status.
- **§6 (~16):** delete §6.13 (proposed-ADR changelog) + ADR-note block; rename "V2
  verifier invariants" → "Verifier invariants"; reframe M#-additive-schema as the RULE.
- **§7 (~33 — heaviest, structural):** **re-conceive the whole section as v1.0.0
  SCOPE, not a build queue.** Delete provenance/approval history + shipped/new/M0–M2b
  markers; sweep the cut-set Source column of Q/FU refs; rewrite the §7.4.1 risk
  register to map risks to **named gates** (pacing/fun-proxy/perf/a11y), not M0–M7;
  move build-history rules to `roadmap.md`; present T0–T3 as shipped v1.0.0 scope.
- **`roadmap.md` — DO NOT end-state-strip.** It's the milestone **tracker** (per
  `repo-map.md`); its ✅/🆕/⏳ columns are its purpose. Action only the 3 stale lines
  (Ledger 1) + retire the resolved H13 note. *(If you want it folded into the spec,
  that's a separate directive.)*

## 6 · Adjacent docs (same v0.3.1 rework left them stale — in scope for Plan A)

- **`ui-design.md`:** combat panel still "bare auto-resolve + retreat" — add the HP
  life-meter, the two auto-toggles, the storehouse 蔵 panel, the "Walk on 道" strip,
  the load-bearing map reshape + the D-075 diverge (variant A ships).
- **`fun-factor.md`:** `:119`/`:255` "every season the world appraises" → the T0
  reckoning fires ~every 3 days (D-094).
- **`qa-playtesting.md`:** add `goto(node)` + spatial/`deposit`/`withdraw`/
  `autoCombatRetreat` helpers to the `__qa` Drive table; a driver without `goto`
  can't reach node-gated content.
- *(gen-docs generator gap → build task, Plan B.)*

## 7 · Sequence

Per section, land FIX_PRD content edits **before** the doctrine strip — several
cross-refs are bridged only by the ADR number (§2.8↔§4.6.6b; §6:231↔:300;
§4:115↔:1169), so stripping the ADR first leaves sections contradictory.

1. **Foundations — §1 + §6** (define vocabulary the rest cross-reference): deep-
   satoyama, `banked`, `location`/`move_to`, judge-cadence, additive-`estateStage`,
   E→`E#`/`U#` split, interactive-combat forward-tier marking; then heavy doctrine strip.
2. **Systems + Ladder — §2, §3:** loss-loop (HIGH), bank, clock, appraisal, stance
   (glass-cannon/tank), market/finances reframe, deep-satoyama reveal; delete checklists.
3. **Combat + Narrative — §4, §5:** §4.9 index, §4.6.9/§4.6.10 fork edits (weapon
   roster + stance), all RESHAPE/NEW strips, FINAL T0 table; §5 boar/node + bandit note.
4. **§7** (last, heaviest): build-queue → v1.0.0 scope; risk register → named gates.
5. **`roadmap.md`:** 3 stale lines + retire the H13 note. Keep tracker framing.
6. **Adjacent docs:** ui-design / fun-factor / qa-playtesting.

**Throughout:** confirm `decisions.md` preserves each superseded *why* (it does), so
the PRD prose can safely drop provenance. Build handoffs go to **Plan B**, never into
the PRD — the canon is protected AND the build's debt is tracked.
