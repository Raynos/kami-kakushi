# PRD truth-sync — fix the PRD to the shipped game (HD-33 / ADR-168)

**Status:** 📋 proposed — awaiting human read (execution is agent-safe per
ADR-168; starts on go-ahead or silence-after-read).
**Confidence:** ( 30% Opus, 70% Fable ) — Phase G is mechanical enough for
Opus; the §1 fiction transcriptions concentrate canon judgment.
**Inputs:** the audit report
[`project/audit/reports/2026-07-10-prd-truth-audit.md`](../../project/audit/reports/2026-07-10-prd-truth-audit.md)
(59 confirmed findings: 18 high · 30 medium · 11 low; every finding
quote-verified against disk) + the scout's 8 ranked gen-region opportunities.
**Ruling:** ADR-168 — no PRD freeze; the PRD tracks the shipped
story-bible + src; generation preferred over hand copies.

## Who builds this — Fable or Opus?

Split by phase. **Phase G (gen-regions + pointers) is Opus-safe**: generator
functions are trivial maps over registries with an existing pattern
(`gen-prd-regions.ts`), and strike-and-point edits are mechanical. **Phases
T1/T2 (transcription) stay Fable**: rewriting §1's rung/ladder/cast tables
and §2/§4's system prose to the bible register is canon-sensitive — a wrong
paraphrase re-introduces drift the audit just paid to find. Phase P (prose
nits) is either.

## Principles (bind every phase)

1. **Identity in, tuning out.** Gen-regions carry ids/labels/bindings only;
   §4 magnitudes stay provisional and are never transcluded (ADR-021's
   surviving principle; the scout's t0-pacing case is a POINTER for this
   exact reason).
2. **Strike-and-point beats transcribe** where a generated doc already
   carries the truth (`t0-story.md`, `t0-pacing.md`, bible tier sheets) —
   a hand-rewritten twin will just drift again.
3. **Transcribe only what generation can't carry** (design prose, the *why*
   columns), sourcing names/fictions from the bible tier sheets verbatim.
4. **Each landing commit regenerates + runs the full verify** (the
   `gen-prd-regions` gate byte-compares; `prd:drift` must stay clean).
5. **No intent changes.** Anything that smells like a design change (not a
   text-sync) stops and files an HD-item — ADR-168 relaxed the freeze, not
   the human's ownership of intent.

## Phase G — generation (the drift-proof half)

New gen-regions in `src/scripts/gen-prd-regions.ts` (pattern exists; each is
a pure fn + a marker pair + a test), in the scout's value order:

- **G1 `t0-discoveries`** — from `DISCOVERIES`; §2.6.1(g). Drift already
  live: PRD says 1 discovery, build ships 4.
- **G2 `t0-zone-reveals`** — from `AREAS` + reveal bindings; §3's zone/
  reveal table (12 hand rows vs 16 shipped zones).
- **G3 `t0-rung-reveals`** — from `RANKS` `rewardOnReach.unlock`; replaces
  §1.12's hand-typed per-rung reveal ladder (audit finding 01:1014 — R3/R4
  rows wrong today) and backs the §3 reveal narrative.
- **G4 `t0-quest-roster`** — from `QUESTS`; §2.12 (5 shipped quests,
  inventoried nowhere).
- **G5 `t0-activities`** — from `ACTIVITIES`; §2.6 (prose names 4 of 8).
- **G6 `t0-market-stock`** — from `MARKET_ITEMS`; §2.4 (seasonal stock since
  C5a).
- **G7 `t0-estate-works`** — from `ESTATE_STAGES`; §2.17(c) (deed-reframe
  pending → labels will move).
- **G8 `verify-gates`** — from `src/scripts/gates.ts`; replaces §6.1's
  fossilized 6-command chain (17 gates today) and §7.3's copy.

Strike-and-point (no generator code):

- **G9** §4.1.1 per-rung rate/threshold columns → point at
  `docs/content/t0-pacing.md` (tuning; principle 1).
- **G10** §3.1 cold-open script + §3.2 beat quotes → point at
  `docs/content/t0-story.md` + `docs/story-bible/tiers/t0.md` (the §3.0
  hidden-rung block already models this).
- **G11** §4.8's hand-authored pacing table → strike, point at
  `t0-pacing.md` (HD-33's original recommendation (b)).

## Phase T1 — §1 vision transcription (high, canon-sensitive)

From the audit's five high findings in `01-vision.md`, sourced from
`tiers/t0.md` / `tiers/t2.md` / `04-cast.md` / `map.ts`:

- **T1.1** §1.5 T0 rung table → the shipped R0–R7 ladder (weir-man →
  named-hand; the silent R2, the survived-not-won wolf at R3, the Count
  at R5). Titles column rides G3/the existing `t0-rung-titles` region;
  the "how earned" prose is hand-written from the bible.
- **T1.2** §1.5 T2 V0–V7 table → the locked bible T2 R0–R7 ladder
  (messenger → yard-officer); drop V-labels (ADR-152); delete Magobei/
  Gohei/Yatarō (exist nowhere in canon).
- **T1.3** §1 area registry → rebuild T0 rows from `map.ts` + `ranks.ts`
  reveal flags (kura at R3, drill-yard node at R4, no Deeper Woods node);
  T2 rows from the bible cast (Tetsuji is T1 works, Mohei, Ekai, Kyūbei,
  Funakichi…).
- **T1.4** §1 T2 "reputation web" → the bible's locked ONE five-stage
  village standing (surcharge → vouched-for, can fall). This is the
  closest to an intent edge — the bible is human-locked, so transcribing
  it is safe, but flag it in the landing commit body.
- **T1.5** §1.12 reveal ladder rows → G3 region + trimmed prose.

## Phase T2 — §2/§3/§4/§6/§7 transcription (the rest of high + medium)

Work the report top-down per section; every fix cites its finding. The big
rocks: §2 defeat bleed (coin+materials only; rice is kura-only), §2's
pre-ADR-137 gate language, §3's dead meter/threshold rows, §4's stale
mechanism prose (audit found 6 beyond the two tables), §6's architecture
claims (gates, scripts list, save schema, DEV systems), §7.3 deployment
(hosted CI + `/ship` automation exist; fonts; `world.ts` pointer).
Freeze-language cleanup rides here (§4:3 header, §3:354, §6/§7 residue) —
reword to ADR-168's "tracks the shipped game; magnitudes provisional".

## Phase P — regression teeth + closure

- **P1** Extend `prd-drift.ts` RETIRED TERMS with the audit's corpse-names
  (Gonta, Chiyo, hiyatoi/genin/monban/kogashira/jikata-yaku, Yagōemon,
  Ryōa, Sukezō, Magobei, Gohei, Yatarō, "Deeper Woods"…) so this class of
  staleness gates RED next time instead of needing an audit.
- **P2** `/prd-ripple` skill text: relax the "frozen §1 → stop" class to
  "intent change → stop" (ADR-168 consequence).
- **P3** Rerun `prd:drift` + full verify; archive this plan; journal.

## Sequencing & commits

One commit per G-region (generator + markers + regen, verify-green), one
per T1 item, section-sized commits for T2, then P. Docs+code mixed commits
run the full gate roster (no lane skips). No balance magnitudes move →
no ADR-132 verdict owed. Estimated ~20 commits.
