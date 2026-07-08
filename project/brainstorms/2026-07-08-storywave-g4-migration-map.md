# Storywave G4 — the content-cutover migration map

**Session 125, 2026-07-08.** Grounded research for **G4 (THE content cutover)**,
produced by a scoping subagent BEFORE any code was written. G4 is monolithic —
the single `areas.ts` AreaId swap breaks **55 files** at once, ~40 more reference
`face_wolf`/`applyScriptedWolf`, the rice reframe (deferred out of G1) touches
~11 files, and 34 test files need rewriting. There is **no green island** in the
zone swap, so G4 cannot land as one big-bang commit — it lands as an **ordered,
staged series** (the plan's "isolated worktree… each number a coherent WIP
commit → a green series"). This doc is the map so the build starts from facts.

**Authoritative spec:** the plan's `### G4` section + sub-parts G4.1–G4.9, the
Economy spec block, and `docs/story-bible/tiers/t0.md` + `04-cast.md` +
`05-world.md`. This doc distills them + the t0v2 VERDICT picks.

## The 8-rung ladder (bible `tiers/t0.md`; no kanji given for titles)

| Rung | Title | Granter | Earn |
|---|---|---|---|
| R0 | The man from the weir | Sōan | weir rescue → exam → forced name-question (`You:`→`Nameless:`) → rake + haul water; day-book *"one man, name unknown."* |
| R1 | The day-hand | Genemon | kept by arithmetic (two hands quit); board terms witnessed; Naoyuki veranda |
| R2 | The yard-hand | **none — SILENT rung (ADR-165)** | a task not taken back; seasons unlock here |
| R3 | The grain-watch | Kihei | first night round → **the wolf, survived-not-won**; ribs cracked |
| R4 | The pupil | Kihei | limps to board, **confesses** granary loss → **begs** for drills; drill-yard opens |
| R5 | The accused | cleared by day-book; Naoyuki names him | **the Count** ensemble night; Toku's packet; *"It went up at the new moon."* |
| R6 | The trusted hand | Genemon | first coin errand at Yohei's stall, counted back to the mon |
| R7 | The named hand | Genemon | day-book writes **Gonbei**; *"Earn a better."*; sleep → first dream |

Speaker ladder: `You:` → `Nameless:` (R0 forced beat, flag `label-nameless`) →
`Gonbei:` (R7, flag `label-gonbei`).

## Zones (16, keyed to `map-sheets/nodes.ts` `T0_NODES`)

The **bible gives NO numeric rung→zone table** — only anchors: weir / forecourt /
sickroom / kitchen = R0; kura + night-rounds = R3; drill-yard = R4; gate active by
R6; ruined = locked all tier; seasons unlock R2. The sheet's `RUNG_LADDER`
placeholder in `nodes.ts` is the current best data and is **what G4.2 edits** — it
is NOT bible-backed for weir-reeds/paddies/woodlot/orchard/grove/margins, so those
rung numbers are a **design call to lock**. The 16 AreaIds (retire
`near-satoyama`/`deep-satoyama`): weir · weir-reeds · gate · forecourt · woodshed ·
kitchen · shrine (corridor, glimpsed) · kura · **sickroom** · drill-yard · paddies ·
field-margins · woodlot · ruined (locked scenery) · orchard · grove.
`MAP_NODE_CEILING` must **derive** as
`T0_NODES.filter(n => n.kind !== 'activity').length` = **16** (17 entries minus the
`night-rounds` activity chip — never a copied number).

## Enemy roster (delete the `coinReward` field; `verify-content` guard: a human-archetype foe ⇒ `minTier >= 2`)

feral dogs + the old dog (orchard chain; bolden **Winter**) · monkey troop + the big
male mini-cap (grove; peak **Summer/Bon**) · river rats (weir-reeds) · tanuki +
badger (field-margins; harvest peaks) · store rats → marten → **the wolf**
(night-round stages only) · bandit (`minTier: 2`, not in T0). **GONE:** boar,
mamushi (T1 — Kihei's bestiary line only), `wolf_scripted`, the grindable lean wolf.

## Cast at nodes (presence predicate `{ dayOfWeek, season, rung, flags }`)

Genemon@forecourt/board · Kihei@drill-yard + gate-at-watch-change · Sōan@sickroom +
weir-on-rounds · O-Hisa@kitchen (+ woodshed later rungs) ·
Shinnosuke@kitchen-board/drill-yard-wall/grove · Toku@shrine + the hooded new-moon
walk · **Yohei@gate market-days-only** (day-of-week predicate) · O-Yae@kitchen by day
· Matsuzō@weir on the lease day · **Iori@gate New-Year + Bon only** (season
predicate) · O-Ume@field-margins · Rokusuke@paddies.
**Correction to the plan's note:** the bible treats **Naoyuki as a full cast
portrait** (a real person-entry: veranda R1 + the Count R5), NOT merely a beat.
**Munemasa** is the one that never places at a T0 node ("a voice through a wall").

## Economy beats (the ADR-163 spec block)

Rice = ONE integer in **shō**, held **only in the kura (`banked`)**; the carried
pocket = coin + goods, never rice. Per-(site, season) production pool with
diminishing returns, refilled at season-turn. Sinks: consumption (daily), spoilage
(season-exit), the **nengu** (Autumn exit gate `nengu-reckoned`), lease/debt, seed.
Wage: `WAGE_START_RUNG = 'R5'`, fixed per game-day worked, a **collect-at-the-board
verb** (not auto-credit). The debt is felt-never-numbered (only the flags
`debt-named`, `lease-day-seen`, `nengu-reckoned`). All magnitudes SEED / sim-owned.

## VERDICT picks + load-bearing redlines (per unit — verbatim, the source of truth)

Directory: units are `u0-cold-open`, `u1-r1-day-hand`, `u2-r2-yard-hand`,
`u3-r3-grain-watch`, `u4-r4-pupil`, `u5-r5-accused`, `u6-r6-trusted-hand`,
`u7-r7-named-hand`, `u8-side-beats`, `u9-dialogue`, `flavor/`.

- **u0 cold-open → take-a** ("the ledger"). Redlines: rewrite `r0-knot` (drop the
  mind/body chiasmus → *"The Carrier's Hitch — fast, one-handed, holds wet."*);
  reconcile the day-count to "Fed, three days"; tighten Well-Yoke; flag the *"Taken
  at the weir"* echo for the human.
- **u1 → take-c.** Rewrite `r1-the-meals` (no kindness-maxim; count only); trim to
  *"He looked at you once."*; pick ONE Naoyuki speaker form; wrap ~80.
- **u2 (the SILENT R2) → take-c.** End the rice narration at *"Rice keeps."*; thin
  aphorisms to one; O-Yae needs a voices/NAMES entry (done at G0); keep *"One
  measure the day"* unit-vague.
- **u3 → take-b** ("held breath"). Cut Sōan's ellipsis in `r3-ribs`; trim *"A watch
  that wanders…"*; fix `O-Hisa (steward)` → `(kitchen)`; de-dup the ledger-close;
  lift A's requirement skeleton but rewrite its flavor.
- **u4 → take-b.** Add the R4 alcove glimpse (narration-only, C's rendering
  re-voiced); break the echo template to one; delete *"That is the whole of why…"*;
  pin the empty-watch clause.
- **u5 (the Count) → take-c.** Naoyuki break-offs ≤ 2; flag-gate the lantern callback
  on a real new-moon sighting or cut it; delete *"It takes as long as it takes."* /
  *"It is not malice."*; one narration epigram.
- **u6 → take-c.** `You:` → `Nameless:` on BOTH MC lines; cut *"Everything walks
  downhill but the rain."*; trim the final paragraph; `@`-reuse the *one man, name
  unknown* echo.
- **u7 → take-b** (canonical). Recast the spoken Item/Count/Condition labels into
  plain Genemon speech; cut one dream simile (*"fine as sieved ash"*); fold in C's
  *"An entry can be amended"*; add A's morning-after log line.
- **u8 side-beats → take-c base + take-a grafts:** grove = C · **Bon = A** (`sb-bon`
  whole) · lease = C (cut the *"quiet that night"* banked line) · dog = C **+ A's
  `sb-dog-coda`** for the fed new-moon payoff · crest = C. POV-convert the A-blocks to
  2nd person; re-price the fed dog onto the MC's share; keep the petal count relative
  ("one more").
- **u9 dialogue → per-character mix:** Genemon-A · Kihei-B · Sōan-B · O-Hisa-B ·
  Shinnosuke-B · Naoyuki-A · Toku-C · Yohei-B · O-Yae-C · Matsuzō-C · Iori-A ·
  O-Ume-C · Rokusuke-C. Fix B-Shinnosuke's speaker (narrator → shinnosuke); add C's
  soan-ledger line; add a jizō-rumor to C-O-Yae; unify the flag vocabulary.
- **flavor → both `f1-nodes.md` + `f2-texture.md` ship** (single-take sheets; the
  redlined sheet IS the pick). `@`-reuse u3-B's new-moon line; cut `mob-otter` (T1);
  cut the whetstone maxim; de-dup the big-male; vary the weir-rats completion; ration
  the field-guide snap-closes to one.

Also: **delete `narrative/takes/estate-build-beats/`** (Open-Q #11 default) and
resolve its HR-item as superseded.

## Recommended staged execution (each stage an independently-GREEN landing)

The only way this lands green is as an ordered series. Stages **1–2 are green
islands** (self-contained, land first to de-risk); **3+ are the monolith** (the
AreaId swap — drive the whole set to typecheck-then-green in one focused push,
worktree or uncommitted-until-green):

1. **Cast rename spine** — `names.ts`/`voices.ts` deferred renames (lord→Munemasa,
   pedlar→Yohei, retire smith/tozo, shigemasa→munemasa) + regen narrative + fix the
   ~15 name-referencing tests. *(G0 already minted most new NpcIds — verify before
   minting.)* GREEN ISLAND.
2. **Rice reframe** (the deferred G1 economy slice) — measured kura shō + per-(site,
   season) pool + consumption + spoilage-on-kura + banked→one-way-kura, across
   state/selectors/step/pillars/balance/activities/market/intents/render + fixtures/
   sim. GREEN ISLAND (its own commit).
3. **G4.2 zones** — areas → map → timing → discoveries → activities + all 55
   referencing files + their tests, driven to typecheck then green. THE MONOLITH.
4. **G4.3 enemies/quests/crafting** + the wolf deletion (`face_wolf`/
   `applyScriptedWolf`/`verb-face-wolf`) + the `verify-content` human-foe guard.
5. **G4.4 people** → **G4.6 ranks/surfaces/estate/home/ascension** → **G4.7 speaker
   ladder** (`playerSpeaker(state)` + every call site).
6. **G4.1 narrative migration** (needs cast + zones present so validation passes) +
   `pnpm run gen:narrative`.
7. **G4.5 coin lanes** — `wage.ts`, Yohei's market, intents wired to content.
8. **G4.8 autoplay/fixtures/sim** + **G4.9 render sweep + the 34 test rewrites + the
   2 DoD tier tests** (`t0-arc.test.ts`, `invariants.test.ts` — rewritten IN PLACE,
   filenames kept for the milestone-integrity gate).

This is genuinely multiple focused sessions. Any fiction-voiced line with no t0v2
source is a bracketed `[dev — …]` placeholder → an HD-30 gap (G7 ship is gated on
HD-30 closed). Do NOT run the slow `verify:balance`/`balance:report` (timeboxed) —
the `pacing`/`playcheck` verify gates guard the arc; the balance ratio re-baseline
is OWED and batched at the end.
