# Agent-picked-default decision audit — the T0-build plans

**Date:** 2026-07-03 · **For:** the human's review & ratify/override pass ·
**Method:** six parallel `Explore` agents, one per plan, verifying build status
against git + source (verify-don't-trust) and extracting every place where an
open design question was left to the human but the agent picked a default and
built it anyway.

> **How to use this doc.** Each plan below lists its **verified build status**
> (with evidence) and its **agent-picked defaults**. Go through the defaults with
> me: **ratify** (keep as-is), **override** (change it), or **park** (revisit
> later). A ratified default graduates to an ADR in
> [`docs/living/decisions.md`](../../../docs/living/decisions.md); an override
> becomes a build task. Nothing here is a silent decision — this doc *is* the
> surfacing.

## ✅ Decisions recorded (2026-07-03 — human, interactive walk-through)

All defaults below were walked through live with the human via AskUserQuestion.
**Overrides** (🔀) → the build plan; **ratifications** (✅) → ADRs; the code
deltas are [`opus-2026-07-03-v0.3.5-build-plan.md`](../../../docs/plans/opus-2026-07-03-v0.3.5-build-plan.md)
and the doc ripples are
[`opus-2026-07-03-v0.3.5-cleanup-docs.md`](../../archive/opus-2026-07-03-v0.3.5-cleanup-docs.md).

| # | Decision | Outcome | Routed to |
|---|---|---|---|
| Economy | koku Phase 5 (status tokens) | **split off** | build §8 (T0 = one token) + cleanup (T1–T5 ladder) |
| Economy | rice store-vs-sell dominance | 🔀 make holding cost something | build §1 |
| Economy | koku's role | ✅ ratified: pure standing | ADR |
| IA | Quests' home | 🔀 own dedicated tab (6→7) | build §4 + cleanup PRD |
| IA | R1 triple-reveal | 🔀 stagger Inventory to R3 | build §3 |
| IA | House Influence home | ✅ stays on Estate | ADR |
| IA | tab kanji glyphs | ✅ first cut locked | ADR |
| Housing | hearth mechanic | 🔀 home the cook verb (off-plan → fixed) | build §5 |
| Housing | chest mechanic | 🔀 real storage (off-plan → fixed) | build §6 |
| Housing | morale/upkeep system | ✅ **no** — rest/satiety/storage only | ADR |
| Housing | status-mirror | T0 = one home token; full ladder T1–T5 | build §8 + cleanup |
| Story | invented NPC names | ✅ keep all three | ADR |
| Story | beat stat rewards | ✅ keep the rare gift (+1 AGI R3) | ADR |
| Story | R7 capstone weight | 🔀 make it matter mechanically | build §7 |
| Story | Naoyuki (heir) | ✅ mentioned-but-unseen | ADR |
| Render | append-only five §6 choices | ✅ ratify all five | ADR |
| Render | Now-view residual | 🔀 fix it too | build §2 |

**The human's status-ladder framing (verbatim, worth preserving):** *"how much
status can you get in T0 lol. Maybe somewhere in T0 from R1→R7 you can get one
'status token' for your home. And the rest is just planning for the PRD T1–T5."*

## Build-status summary

| Plan | Verified status | Player-reachable? | Archivable? |
|---|---|---|---|
| `ui-remaster-variants` | ✅ BUILT (6 variants) | yes (ui-demos) | ✅ archived 2026-07-03 |
| `economy-koku-rediagnosis` | ✅ DONE (superseded by build) | n/a (diagnosis) | ✅ yes |
| `rung-up-story-transitions` | ✅ BUILT | yes | ✅ yes (R8 review tracked separately) |
| `append-only-rendering-engine` | ✅ BUILT (1 minor residual) | yes | ⚠️ yes, w/ Now-view residual noted |
| `deep-housing-build` | ✅ BUILT (T0 slice; 2 layers deferred) | yes | ✅ yes (deferred layers tracked) |
| `ia-tab-reorg-build` | ✅ BUILT (6 tabs) | yes | ⚠️ yes, but log the §8 forks first |
| `koku-economy-t0-build` | ⚠️ **PARTIALLY BUILT — Ph5 NOT built** | partial | ❌ **no — Phase 5 outstanding** |

**The one that isn't done:** `koku-economy-t0-build` shipped Phases 1–4
(coin/rice split, rice loop, mon/monme/ryō display, koku-as-standing) but
**Phase 5 — status-token rank rewards (surname → two swords → gōshi)** was never
coded (confirmed: `project/journal/2026-07-03-session-49-t0-rebuild-complete.md:112`
— "designed-but-unbuilt"). Keep this plan active or split Phase 5 into its own
plan; do **not** archive it as finished.

---

## 1 · `koku-economy-t0-build` + `economy-koku-rediagnosis` (the economy)

Build: Phases 1–4 BUILT & reachable (`372fbfe`, `0643ac6`, `1b929f7`,
`249a1e5`); **Phase 5 not built**. The rediagnosis's model is fully realized in
these commits (D-107), so the *diagnosis* is done.

**Agent-picked defaults awaiting ratification:**

- **Rice price swings by season** (rejected a fixed price). Shipped as
  `RICE_SELL_PRICE_BY_SEASON` — spring 6 / summer 5 / autumn 3 / winter 5
  (`balance.ts:362`). Magnitudes self-flagged "provisional, liquid (D-059)."
- **koku = pure standing + ascension gate** (rejected the soft-flywheel income
  multiplier). §14 default, now baked into the influence pillar.
- **Rank rewards = visible status tokens** (surname → two swords → gōshi) — the
  design intent, but this is exactly **Phase 5, which is unbuilt**.
- **Bought-rank (kaneage zamurai) deferred to T2+** — seam reserved.
- **Store-vs-sell is broken by the shipped defaults** — kura storage is free,
  lossless, loss-safe → always-hold-until-spring dominates. Flagged in
  `project/audit/reports/2026-07-02-economy-balance-watch.md:20`, **not fixed**
  (your feel-call, D-059).
- **Loss/repair/eat coin magnitudes** — `LOSS_COIN_FRAC=0.2`, `REPAIR_COIN_COST=6`,
  `EAT_RICE_COST=3`, `EAT_RICE_SATIETY=30` — all agent-set under the "tune by
  feel" banner.

## 2 · `ia-tab-reorg-build` (the 6-tab IA)

Build: BUILT & reachable (`57370b8` Phase A, `bebc1f2` Phase B); six tabs
confirmed at `render.ts:247`. **⚠️ All four §8 forks were resolved by agent
default and are NOT logged in `human-in-the-loop/review.md`** — the biggest gap
found, because the plan's own DoD (§9) required one of them be "resolved with the
human."

**Agent-picked defaults awaiting ratification:**

- **Quests' home = an "Undertakings 用" section under Character** (§8.1). *The
  plan's DoD said this fork "is resolved with the human" — it wasn't.* This is
  the one to decide first.
- **R1 triple-reveal** — Map + Estate + Inventory all light at R1 (§8.2). Default
  kept; the stagger lever (hold Inventory to R3) was left unused, flagged for the
  pacing sim.
- **House Influence (koku) lives on the Estate tab** (§8.3), not its own surface
  or beside Character status tokens.
- **Tab kanji glyphs** — Map 地図 · Estate 家 · Inventory 蔵 · Character 己 ·
  Combat 武 (§8.4) — "first cut, a ui-design taste call," shipped as-is.

## 3 · `deep-housing-build` (home / belongings / comfort)

Build: BUILT for the T0 slice (`9733632`, shipped in v0.3.5 `3fea58b`),
reachable in the Inventory tab. Home-tier growth (R5/R7) and the status-mirror
layer are deferred seams. **Note: several defaults *diverged from the plan's own
stated options* — worth a closer look than a simple ratify.**

**Agent-picked defaults awaiting ratification:**

- **Hearth → a `body`/satietyMax +12 bonus**, *not* the cook-verb home or morale
  nudge the plan (§2.3) offered. `cook_meal` untouched; no morale system built.
- **Chest (nagamochi) → a `body`/satietyMax +5 stat**, *not* the storage buffer
  the plan (§2.3) described. No storage mechanic exists.
- **Comfort register collapsed to a closed `'rest' | 'body'`** — dropping the
  plan's named "storage" and "morale/upkeep" channels — and hardened with an
  invariant test.
- **Status-mirror hook deferred** despite the plan (§3 T0-D) wanting it at T0 (a
  defensible dependency call — D-109 tokens don't exist yet).
- **Bonus magnitudes & costs** — bedding +5 / hearth +12 / chest +5, set-synergy
  +4; costs 60/120/90 coin — all self-selected ("liquid, tune by playtest").
- **D-075 prod default = Variant A** ("functional list") — *properly surfaced*
  already at `review.md:184` (R6), not silent.

## 4 · `rung-up-story-transitions` (the R0→R7 story beats)

Build: BUILT & reachable (`6bf861f` engine, `592ec79` UI, `ff2b662` fix). Header
trigger "Answer the summons" fires the full-screen VN beat. This is the **R8**
review; the defaults here are mostly *content* to read & veto.

**Agent-picked defaults awaiting ratification:**

- **Three invented NPC names** — pedlar **Tokubei** (R1), **Rokusuke** (R2),
  smith **Tōzō** (R4) — the plan flags these "most open to edits, rename freely."
- **Kept all three faces separate** (didn't fold the smith into Kihei) (BQ1).
- **Bonus rarity = a rare, varied THREE** (BQ2): R2 `pedlar-favour` story-flag;
  R3 **one-time +1 AGI** (payload weight is an agent call); R4 `smith-whetstone`
  keepsake.
- **R5 = two-voice split** (Genemon + Kihei) (BQ3).
- **Capstone (R7) = light branch** — sets a remembered flag, no Phase-2 mechanic
  (BQ4).
- **Naoyuki (the heir) = mentioned-but-unseen** at R6/R7 (BQ5).
- **All 7 rungs of beat prose** — greetings, topic answers, every choice label +
  reply — agent-authored, shipped verbatim, awaiting your read (§7.1).
- **Voice categories** — reused `'steward'` for Chiyo; minted a new `'lord'`
  voice for Shigemasa.

## 5 · `append-only-rendering-engine`

Build: BUILT — all 3 phases (`2752d61`, `abd2698`, `9b01c7a`); it *is* the live
renderer (`main.ts:172`). **Residual:** `renderNowView` still does a full
`textContent=''` rebuild (`render.ts:3674`) — a transient overlay, not a hot-path
pane, so the flash class is eliminated; one surface remains un-migrated.

**Agent-picked defaults awaiting ratification** (the plan's §6 gated Phase 1 on
these five human answers; the agent built on its own defaults, several being the
plan's own "my recommendation"):

- **Scope = migrate all surfaces** (not just the flash offenders) (Q1).
- **Cadence = ship per-phase** (three commits, not one big review) (Q2).
- **Abstraction = the shared `reconcile.ts` helper** (agent's recommendation) (Q3).
- **Approach = full flash-elimination** (not the cheaper throttle/prev-equality
  stopgap) (Q4).
- **Zero-churn invariant = a standing test** per migrated surface (agent's
  recommendation) (Q5).
