# Part 1 ripple — the authoritative reshape-mapping & per-file spec

> **What this is.** The single source of truth for executing **Part 1** of [`path-to-v0.3`](2026-06-29-path-to-v0.3.md)
> — the **markdown-only doc/PRD ripple** of the locked 6-tier reshape (ADRs **D-048…D-069**) + the 5 finalized
> forks into the PRD section files and the other living docs. Distilled from the multi-agent tracker audit
> (raw: [`project/brainstorms/raw/2026-06-29-prd-ripple-tracker-audit.json`](../../project/brainstorms/raw/2026-06-29-prd-ripple-tracker-audit.json)),
> the ADR log, the living roadmap, and the feedback ledgers. **Every ripple agent reads this so the mapping is
> applied identically across all files.**
>
> **Scope guard.** Part 1 is **markdown only**. The tracker's *code* checklist + the `docs/content/` regen + the
> `balance.ts` DEMO/REAL retirement are **Part 2** (the build) — DO NOT touch code here. The conductor with the
> per-file tick boxes is [`pending-prd-changes.md`](../../project/status/pending-prd-changes.md); this doc owns the
> *mapping detail* that conductor references.

---

## 0. The non-negotiable rules for every edit

1. **Surgical Edits only.** Never rewrite a whole file. Preserve all surrounding content, prose voice, tables,
   anchors, and cross-refs. The reshape is a **reframe + renumber**, not a deletion (except the one explicit §7.2
   gut, below).
2. **The renumber is NOT mechanical.** Use §1's mapping table. The old Estate tier **splits**; several systems
   **re-place** onto the new spine per locked steers (§3). A blind "T0–T4 → T0–T5" search-replace is WRONG.
3. **Don't invent.** Everything here is locked canon (ADR / roadmap / fork). If a passage's correct new placement
   is genuinely ambiguous, leave it, and **report it** in your `uncertainties` — don't guess in canon.
4. **Invariants don't move** (§4): kanji, the 20–35% band, trade ≤⅓, 70/30, HP-carry, the win-rate split, the
   pacing floor shape. Touch them only where the tracker line says to.
5. **Report every tier reference you changed** (old→new) so the convergence critic + human can audit the mapping.

---

## 1. The OLD → NEW tier mapping (the linchpin)

The reshape (D-048) **splits the old Estate tier into two** and shifts the rest up by one. v1 scope = **new T0→T3**.

| In the CURRENT PRD body you'll see… | = place | → NEW tier | Notes |
|---|---|---|---|
| **old-T0** | **Estate** | **SPLITS → new-T0 (tutorial) + new-T1 (full)** | tutorial/showcase-in-miniature content → **T0**; the real 30-min-floor grind → **T1**. The old single R0→R7 Estate ladder splits: **T0 = R0→R7** (tutorial) + **T1 = R8→R15** (~8 new full-estate rungs). |
| **old-T1** | **Village** (Asagiri) | **new-T2** | rung labels stay **V0→V7** (numbering resets per tier, D-012) — only the tier *number* changes. |
| **old-T2** | **Region** | **new-T3** | rung labels stay the **G-ladder** (G0→G7). v1 **ends here** (`outcome: t3done`). |
| **old-T3** | **Castle-town** | **new-T4** | beyond v1 — renumber labels only. |
| **old-T4** | **Edo** | **new-T5** | beyond v1 — renumber labels only. |

**Pillar reveal schedule (D-048) — a SHIFT, not just a renumber.** The old "T0 = 2-pillar special (Arms+Estate)"
becomes "T0 = 1 pillar (Estate)"; every pillar reveals one tier later in the new absolute numbering:

| New tier | Pillar revealed (active) | Gates | Reveal-ramp |
|---|---|---|---|
| **T0** Estate-tutorial | **Estate 家産** (P1) | T0→T1 | **1** |
| **T1** Estate-full | **+ Arms 武威** (P2) | T1→T2, unlocks Village | **2** |
| **T2** Village | **+ Office 官威** *kan'i* (P3) | T2→T3, Region | **3** |
| **T3** Region | **+ Name & Honour 家格** *kakaku* (P4) | T3→T4, Castle-town | **4** |
| **T4** Castle-town / **T5** Edo | *(deepen the four — no new pillar)* | — | **4 → 4** |

Ramp = **1 → 2 → 3 → 4 → 4**. Note the **Phase-1 / Phase-2** architecture is unchanged: combat-as-*activity*
lives in T0 (the humbling first fight @ R3), but the **Arms pillar DEEDS** (Phase 2) only bank from **T1**.

**The scaled grade-gate (D-049)** — `exactly 1 EXCELLENT + 1 GREAT + (N−2) GOOD` for N open pillars, all ≥ GOOD:

| New tier | N pillars | Gate |
|---|---|---|
| **T0** | 1 | **EXCELLENT** *(collapses — the (N−2) term drops)* |
| **T1** | 2 | 1 GREAT + 1 EXCELLENT |
| **T2** | 3 | 1 EXC + 1 GRT + 1 GOOD |
| **T3** | 4 | 1 EXC + 1 GRT + 2 GOOD |

Tier-up is a **manual opt-in story event** (the gate only *unlocks the option*); overshoot earns a **grade-scaled
permanent boon**; the **first ascension (T0→T1) always lands BIG** on first contact regardless of grade (D-062).

---

## 2. The diegetic-mentor cast (D-063, refined by the roadmap)

Onboarding is a **domain-split canon cast**, teaching each system in-world as it unlocks — **never popups** (D-015/D-064):

- **Genemon** — labour / koku (T0).
- **Kihei** — arms / combat (introduced T1).
- **Sōan** — healing (already in the cold open).

---

## 3. The per-system re-placement table (net-new locks beyond the renumber)

Each row is locked canon (ADR / roadmap fork). These are where a naive renumber goes wrong.

| System | NEW-scheme placement | Source |
|---|---|---|
| **Rung ladders** | T0 = **R0→R7** (tutorial); T1 = **R8→R15** (full estate, **two-track**: Estate-Service labour + Combat-Rank martial sub-meters, promote on the AND-gate); T2 = **V0→V7** (Village); T3 = **G-ladder** (Region). | D-048, D-052, fork#3 |
| **T1 rung titles** | Kura Warden → Field Reeve → Drill-yard Hand → Stable & Woodlot Master → Ledger-hand → Armsman of the House → Under-steward → Trusted Man of the House (placeholders). | fork#3 |
| **Weapon archetype LINES** | **Line 1 spear** = T0 (roster +2); **Line 2 sword** opens **T1** (roster +3); **Line 3 Staff/polearm** (Bō・Naginata・Kanabō・Tetsubō) **PULLED FORWARD from Region into new-T2 Village** (roster +4) → roster **complete by end-of-T2**; **new-T3 Region = combat DEPTH, no new line**. All found/crafted, never gifted (~9–10 weapons across v1). | roadmap T2-M1-F5 (`roadmap.md:186/223/324`), D-052 |
| **Cross-pillar combos** | **PARTIAL Office-pairs set at new-T2 Village** (Arms×Office, Estate×Office — Office reveals at T2); **FULL 4-pillar set at new-T3 Region** (when Name reveals). Stay post-trade-clamp; **excluded from the gate-check AND the trade-⅓ denominator** (D-031). | roadmap T2-M3-F3 (`roadmap.md:205/327`) |
| **First HUMAN threat** | bandits / starving deserters (*nobushi*) at **new-T2 Village** (the road-warden beat). T0/T1 bestiary stays **grounded estate + near-satoyama beasts**. | roadmap T2-M1-F5 |
| **Koku flywheel / economy** | **LINEAR taste in T0** (single work→koku→upgrade→more-output line); **branches into LAND / TREASURY / TRADE sub-engines at T1** (trade **≤⅓** preserved). The **real village silk market** (Onatsu's *meibutsu*) is **new-T2 Village**. | D-066/D-051/D-008 |
| **Estate stage** | E0→E1 in T0; **E1→E2 in T1** (one visible stage); E2→E3+ slips to T2+. | fork#2 |
| **First paid retinue** | **Gohei & Yatarō** = a **T1** reward; deployed/expanded (not "first") at T2. | fork#2 |
| **Rival houses** | **Tomita (= money) / Akagi (= honour)** introduced + the **contest BEGINS at new-T2 Village**; the **climax** (Naoyuki rivalry→ally-flip G5, **G7 dethroning**) at **new-T3 Region**. | fork#4 (`forks-finalized:33`) |
| **Origin / dream-mystery cadence** | a **dream/mystery beat at EVERY tier transition** (incl. T0→T1, T1→T2); **full origin payoff stays at Region (new-T3)** — the Otsuru/Tama truth. | D-055 |
| **Small walkable map** | a **small walkable map in T0** (delivers §1 "areas to explore"); **extends into Asagiri (Village) at new-T2**. | D-065/D-052 |
| **Marriage/adoption · auto-producers** | were "T3+" in the OLD scheme (= Castle-town+) → **renumber the label to "T4+"** (old-T3 → new-T4); both stay beyond v1. | D-048 renumber |

---

## 4. Invariants — verify, do NOT redesign

- **Kanji (already correct in the PRD — verify-only):** Estate **家産** · Arms **武威** · Office **官威** (*kan'i*) ·
  Name & Honour **家格** (*kakaku*) — **never 名誉**.
- **Combat:** HP **carries** between fights + **heals by eating** (satiety); **no stance strictly dominated**
  (replace the dominance-enshrining test). **KEEP the signed 20–35% single-fight win-rate** as the first-fight
  criterion (HP-carry affects the *grind*, not the discrete first fight). (D-050/D-058)
- **Win-rate:** **analytic for the gate** / **fixed-seed sampled (n=400) for the display**; codify
  **displayed == tested == same-for-every-player**. (D-057, amends signed D-043)
- **Pacing:** **T0 floor-exempt** gentle ramp (~10–15 min/rung); the **≥30-min/rung floor binds from T1**.
  **Re-map** the stale per-tier FLOORS (the OLD `4.5 / 8 / 16 h` for old-T0/T1/T2) onto the new spine and
  **re-derive the ~28.5h Phase-1 climb FLOOR across the 4 v1 tiers (T0–T3)**. (D-049/D-056) — **the DEMO/REAL
  fork retirement is `balance.ts`/code, Part 2 — §4.8's body has no DEMO text to drop.**
- **Difficulty:** **humbling THROUGHOUT incl. T0** — fast ≠ easy; keep the mediocre-start bite within guardrails
  (winnable · soft-setback only · no permanent loss · no dead-ends/stranding). (D-061)
- **Clock:** **active-only / no offline accrual**, BUT advance by **elapsed wall-time while the tab is OPEN**
  (don't pause on `document.hidden`; a throttled background tab catches up; stop only when **CLOSED**). (D-053)
- **Structural caps:** **trade ≤⅓** of Estate & Wealth; **70/30** deeds/seasonal; combos never breach either.
- **Provisional balance magnitudes (forks #1/#5 — LIQUID, D-059, use as starting numbers):** per-tier floors
  **T1 ~5–8h · T2 ~8–10h · ≈40 min/rung**; deed-bands **T1** Arms 0.5K/0.72K/0.95K cap 20 ip + Estate
  0.8K/1.1K/1.5K · **T2** Office 2K/3.2K/4.5K cap 80 ip; the §4.8 ~28.5h budget re-derives at Ship-M1-F2.

---

## 5. The per-file work-list (12 files — each owned by ONE agent)

> Section anchors are from the current files; grep to confirm exact lines before editing.

### `docs/living/prd/01-vision.md` *(D-048, D-049, D-051, D-055, DS#7, DS#14, DS#20, DS#23)*
- Top-matter status line + §1.6 header: **5 tiers / T0–T4 → 6 tiers / T0–T5**; add the ramp **1→2→3→4→4** + the
  pillar→tier map **Estate→Arms→Office→Name**; note the PRD stays **LIQUID** (no §1 freeze, D-059).
- §1.6.1: frame Estate sub-engines as the **koku flywheel, LINEAR in T0 → branch into LAND/TREASURY/TRADE
  (trade ≤⅓) at T1**; kanji are already correct (verify-only).
- §1.6.3: "T0 = 2-pillar special (Arms+Estate)" → **T0 = 1 pillar (Estate)**; the scaled grade-gate
  `1 EXC + 1 GRT + (N−2) GOOD` **(T0 collapses to EXCELLENT)**; manual opt-in ascension; grade-scaled overshoot
  boon; active + locked-silhouette teaser.
- §1.6.4 standing panel: active pillar + locked **unnamed** silhouettes.
- §1.7 world table: renumber **T0–T4 → T0–T5** with the Estate split (add a new **T1 full-estate** row); T0 = a
  small walkable map; **T2 stays "Village"** framed *"the valley beyond your gate"* (no rename).
- §1.9 dream cadence: a **dream/mystery beat at every tier transition**; payoff stays at Region (T3); **T0→T1 lands BIG**.

### `docs/living/prd/02-systems.md` *(D-048, D-053, D-055)*
- §2.16 reveal ramp: "T0 = 2 (Arms + Estate; 2-pillar special)" → **T0 = 1 (Estate)**; ramp **1→2→3→4→4** across 6 tiers.
- §2.16(e) standing panel: active pillar + locked silhouettes.
- §2.2 active-only world clock: the **D-053 reframe** — wall-time **while OPEN** (don't pause on `document.hidden`;
  stop only when CLOSED); keep active-only / no-offline-accrual.
- §2.16.1 marriage/adoption "T3+" label → **"T4+"** post-renumber (verify).
- Kanji table: already correct (verify-only).

### `docs/living/prd/03-unlock-ladder.md` *(D-048, D-052, DS#17, DS#22, fork#3, weapon-line + combo locks)*
- **T0 = R0→R7** (tutorial) + **T1 = R8→R15** (full); miniature-system reveals land in T0.
- **T1 two-track rung meter** (Estate-Service + Combat-Rank sub-meters, AND-gate) + the T1 rung titles (§2 / fork#3).
- **WEAPON-LINE RE-PLACEMENT** (§3 table): Line 2 sword → T1, Line 3 Staff → **new-T2 Village** (pulled forward),
  **T3 Region = depth, no new line**; roster +2/+3/+4 (T0/T1/T2). *(the existing body places Line 3 at "T2" = old-Region;
  re-place to new-T2 Village, and re-map the renumber.)*
- **COMBO RE-TIMING**: line 109's "combos unlock at the Region tier" → **partial Office-pairs at new-T2 Village**
  + **full 4-pillar at new-T3 Region**.
- Reveals stay **non-hand-holdy** (reveal-as-plot, no popups) via the **diegetic mentor** (Genemon/Kihei/Sōan).

### `docs/living/prd/04-combat-balance.md` *(D-050, DS#5, D-057, D-049, DS#1, DS#13, forks #1/#5, combo split)*
- §4.6: **HP carries + heals by eating**; **no stance strictly dominated** (replace the dominance test);
  **KEEP the signed 20–35% single-fight band** (HP-carry = grind, not first fight) + a RED-able foe-in-band test.
- §4.6.4b / §4.6.7: the **analytic-for-gate / fixed-seed-sampled(n=400)-for-display** split; codify
  **displayed == tested == same-for-every-player** (amends the §4.6.4b "analytic, not sampled" wording).
- §4.8 pacing: **re-map the stale per-tier FLOORS** (OLD `4.5/8/16 h` for old-T0/T1/T2 → the 6-tier spine) +
  **re-derive ~28.5h across the 4 v1 tiers**; T0 floor-exempt; ≥30-min floor from T1; humbling-throughout note.
  **DO NOT** add "drop the DEMO-default framing" — §4.8 has no DEMO text (that's `balance.ts`, Part 2).
- Weapon roster table: re-tag the **Staff line (Bō/Naginata/Kanabō/Tetsubō)** from old-T2(Region) → **new-T2 Village**.
- §4.3.1 / combo section: partial Office-pairs at **new-T2**, full 4-pillar at **new-T3**.
- Provisional balance magnitudes (forks #1/#5) as starting numbers (§4 liquid, D-059).

### `docs/living/prd/05-narrative.md` *(D-048, D-049, D-052, D-055, DS#14, DS#17, DS#22, DS#23, forks #2/#4)*
- New **T0 tutorial / T1 full** acts; renumber Village/Region/Castle/Edo; the **ascension story events** (first
  BIG — Yūji Syuku title card, silhouettes stir, dream beat, music swell, grade-scaled boon); per-tier mystery
  beats; **diegetic-mentor** onboarding; the small walkable T0 map; **T0 non-hand-holdy**.
- **Rival houses: Tomita (= money) / Akagi (= honour)** introduced + contest **BEGINS at new-T2**; climax
  (Naoyuki ally-flip, G7 dethroning) at **new-T3**.
- **First retinue (Gohei & Yatarō)** + **E1→E2** estate-stage both land in **T1** (E2→E3+ slips T2+).
- Combo + Staff-line narrative refs: align with the re-timed combo split + the pulled-forward Staff line.

### `docs/living/prd/06-tech-architecture.md` *(D-053; D-041/Q54 optional)*
- **D-053 clock ripple** (REPOINTED — the tracker mis-cited §6.10): edit **§6.9** (active-only renderer loop,
  ~:785 "Backgrounding pauses") + **§6.3** clock (~:192 "Never wall-clock; active-only") — reframe to **wall-time
  while OPEN** (don't pause on `document.hidden`; catch up a throttled background tab; stop only when CLOSED);
  keep the autosave dirty-guard + active-only/no-offline. **§6.10 is the DEV play API — NOT the clock; don't edit it.**
- §6.1.1 / Q54 build-stamp: **verify-only** (confirm the spec still matches the wired git-describe behaviour);
  add a formalization line **only if the human elects** — otherwise out of this batch.

### `docs/living/prd/07-roadmap-scope.md` — ⚠️ THE HEAVIEST EDIT *(D-021, D-059, DS#9, D-054, DS#19, DS#15)*
- **GUT §7.2 "Milestone roadmap (M0…M7)"** (the ~538-line block, the M0–M7 + reveal-ladder duplication): replace
  with a short **DELEGATION pointer** → build-order/milestones now live in **`docs/living/roadmap.md`** (the single
  source; generate-don't-duplicate, D-021/D-059/DS#9).
- **RESHAPE §7.1 "v1 scope"** (KEEP, but update): v1 = **new T0→T3**; §7.1.2 locked pacing FLOOR → **T0
  floor-exempt + re-derive ~28.5h across 4 v1 tiers**; §7.1.4 per-tier shape → the 6-tier spine.
- **REFERENCE (don't restate)** the milestone-integrity rule (all-DoD-or-ADR-amended + CI manifest, D-054);
  carry-forward-and-retune M0–M2b (DS#19); the **save-WIPE** at the schema bump (DS#15).
- **KEEP §7.3 Deployment & assets and §7.4 Risk register** (light renumber touch-ups only).

### `docs/living/qa-playtesting.md` *(D-048, DS#16)*
- `state()` snapshot `tier: 0..4` → **0..5**; `outcome` add **`t3done`** (v1 finish).
- Document the **DEV speed toggle (2×/4×/8×)** + **jump-to-rung/tier teleport** harness affordances.

### `docs/living/ui-design.md` *(D-055, DS#14, DS#23, DS#12)*
- House-Influence **silhouette-teaser** panel + pillar bars (active + locked silhouettes).
- **First-ascension ceremony card** (Yūji Syuku title card, silhouettes stir, music swell).
- The **small walkable T0 map** surface.
- **Traditional-palette SFX cues** (taiko / shamisen-koto / shakuhachi / temple-bell 鈴) — cross-ref `sfx-spec.md`.

### `docs/living/fun-factor.md` *(D-049, DS#13, DS#22)*
- Tutorial-vs-grind pacing framing (T0 hook / T1 floor).
- **Humbling THROUGHOUT** (T0 quick but not easy; guardrails intact).
- Onboarding fun via the **diegetic mentor** (no popups).

### `project/status/working-agreements.md` *(D-054, DS#21)*
- Add the **milestone-integrity rule** (all-DoD-or-amend + CI manifest check).
- **Verify** (don't duplicate) the durable-by-default process (DS#21) — CLAUDE.md already amended.

### `docs/living/sfx-spec.md` — **NEW doc** *(DS#2, DS#12, D-041, D-068)*
- Specify the **minimal SFX pass** (hit / reward / rank-up) in the **traditional Japanese palette** (taiko /
  shamisen-koto / shakuhachi / temple-bell 鈴) as the **contract for the Part-2 Web Audio module**; lands BEFORE
  the R1 taste call; the full bed is deferred. This is the **spec only** — the module is Part-2 code.

---

## 6. Out of Part 1 (deferred to Part 2 / the build)

All `src/` code boxes; the `docs/content/` regen; the `balance.ts` DEMO/REAL retirement; the Web Audio SFX
*module*; the CI manifest check; the §6.1.1/Q54 PRD formalization (unless the human elects it). Op-model v2 /
`diverge` / `playcheck` (D-072/073/074) are **already built** — not ripple items at all.
