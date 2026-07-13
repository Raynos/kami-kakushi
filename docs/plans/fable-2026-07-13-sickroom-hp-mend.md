# Build the HP-mend lane: pay Sōan, or rest and let the days do it

**Status:** 📋 PROPOSED (2026-07-13, session-187)
**Confidence:** ( 70% Opus, 30% Fable ) — the lane is engine plumbing
(Opus); the two verbs' fiction is voiced text → the ADR-139 diverge is
Fable's, and it is a real share of the plan's surface.
**Template:** build

## Who builds this — Fable or Opus?

**Opus builds the mechanism; Fable voices it.** Steps 1–3 (intents,
reducers, severing the cook heal, tests, sim) are mechanical under a
locked ruling. Step 4 — the treatment/rest beat's diegetic lines — is
fiction-voiced text: **ADR-139 3-take diverge, Fable-routed**, live in
the DEV Story switcher (ADR-143). The diverge does not block the
mechanism (PH4).

## Why

**ADR-164 (human-ruled 2026-07-08; build reaffirmed by the human in
the 2026-07-13 finding walk, H1):** HP has **no auto-trickle** — it
mends via a **paid treatment action** at the sickroom (costs mon once
waged, else a day) or a free manual **"rest at sickroom"** trickle;
**food stays satiety-only**. Recovery is a deliberate spend (mon or
days) — that is what makes Sōan's ledger real economic pressure.

None of it exists. The only HP mend in the game is `cook_meal`
(`COOK_HP_RESTORE`) — food *is* the healer, precisely what the ADR
retired. The work was owned by the storywave plan's G4 sickroom-content
chunk and was orphaned when that plan archived (2026-07-09) with the
chunk unbuilt. Evidence:
`project/archive/opus-2026-07-12-adr-embedded-work.md` (H1).

## What exists today

**Survey date: 2026-07-13 (session-187), source-verified.**

- No `treat`/sickroom intent in the `Intent` union
  (`src/core/intents.ts`); no sickroom entry in
  `src/core/content/activities.ts`.
- The only mend: `intents.ts:920-922` (`cook_meal` +
  `COOK_HP_RESTORE`, `balance.ts:433`).
- The code contradicts itself about which model is live:
  `defeat.ts:7-8` and `fight.ts:190` describe the ADR-164 split as "G4
  sickroom CONTENT"; `combat.ts:140` says "the only mend is eating
  (cook)". All three get fixed here.
- Defeat-as-sickroom (ADR-155/164's other half — carried loss, days
  lost, Sōan's ledger) IS built (`defeat.ts`); this plan adds only the
  mend lane.

## Steps

1. **The two verbs.** `treat` (paid: debits mon once waged, else a
   day; restores a sim-owned chunk) and `rest_sickroom` (free, manual,
   slow trickle per day spent) — new intents + an `activities.ts`
   sickroom entry, gated to the sickroom location. Magnitudes
   (`TREAT_COST_MON`, restore sizes, trickle rate) live in
   `balance.ts`, sim-owned (ADR-132).
2. **Sever the cook heal.** Remove `COOK_HP_RESTORE` from `cook_meal`
   (food = satiety only); fix the three contradicting comments
   (`defeat.ts:7-8`, `fight.ts:190`, `combat.ts:140`) in the same
   commit so the tree never half-claims either model.
3. **Balance pass (ADR-132).** The arc must survive losing its only
   mend: `verify:balance` → `balance:report`, regenerated
   `docs/content/t0-pacing.md` committed with the change, `--summary`
   in the body. Read `project/telemetry/` first (FB-8).
4. **The fiction (ADR-139, Fable).** 3 independent takes for the
   treatment/rest beat lines (register/reveal/stance-distinct), wired
   live in the DEV Story switcher (ADR-143 — if the lines are
   core-emitted, the declaring-module DEV-setter pattern; wiring the
   swap is part of the diverge). Self-pick into canon; HR-item with
   the bundle. Taste-scorecard Pass 1 before, Pass 2 per take.
5. **Surface it (TST4).** The sickroom location shows both verbs with
   their real costs via the same pure fns the reducers use (AC-6) —
   the shown price/rate can never drift from the charged one.

## Verification

- RED-able `intents.test.ts` / `defeat.test.ts` cases: `cook_meal`
  restores **zero** HP (fails on main today); `treat` restores and
  debits mon (or a day when unwaged); `rest_sickroom` trickles;
  neither fires outside the sickroom. Fixtures derive from
  `balance.ts` constants, never copied magic numbers (test
  discipline, ADR-086…088).
- Sim: the no-stranding detector stays green — a broke, hurt player
  must always have the free rest path (see Risks).
- **Player-reach proof (PH6):** drive the live `:5173` build — take a
  fight to defeat, land in the sickroom, pay for treatment, watch HP
  return; then eat and watch HP **not** move. This is the slice a
  player touches; capture it (`capture-game-states`).

## Sync ripple

- **PRD:** `docs/living/prd/04-combat-balance.md` — how HP recovers
  changes materially (via `/prd-ripple` → `pnpm run prd:drift`).
- **Story-bible:** `tiers/t0.md` — the treatment/rest verbs are the
  bible's "Sōan's closed ledger grows" made mechanical; confirm the
  sheet needs no text edit beyond a pointer.
- **Living docs / registries:** `t0-pacing.md` regenerated (ADR-132);
  `gen:narrative` re-runs for the beat's lines; fixtures regenerate if
  the save shape moves (it should not — no new persisted state beyond
  standard flags; verify).
- **CHANGELOG:** none — rides the next release's section.

## Human-in-the-loop

- **HR-item filed by step 4:** the 3-take sickroom-beat bundle
  (ADR-139), alternates DEV-only until sign-off.
- **Blocks on nothing** — the mechanism is agent-safe now; only the
  prose waits on the diverge, and the mechanism ships with the
  self-picked take as default (PH4).
- Taste scorecard Pass 1 (constraint brief) before step 4/5 build;
  Pass 2 per take after (ADR-135).

## Non-goals

- **No auto-trickle anywhere** — that is the ruled design's core.
- **No cooking redesign** — `cook_meal` keeps satiety exactly as is;
  its siting question is HD-40's (kept separate by the human,
  2026-07-13).
- **No sickroom UI surface beyond the verb rows** — if it grows into a
  panel, that is a new surface → ADR-075 diverge, a different plan.

## Risks

- **This removes the game's only HP mend — a live soft-lock lever.**
  If treatment is mispriced the arc strands hurt-and-broke players
  (the ADR-092 failure class). Mitigations: ship the free
  `rest_sickroom` trickle **in the same commit** as the cook-heal
  severing, never after; the no-stranding sim check gates the land.
- **Seam (shared tree):** owns `src/core/intents.ts`, `defeat.ts`,
  `fight.ts`, `combat.ts`, `activities.ts`, `balance.ts`, sickroom UI
  rows. The merchant-state plan also edits `intents.ts` +
  `balance.ts`, and the active HD-41 plan touches `intents.ts` +
  `render.ts` — **sequence, never concurrent**; check `herdr agent
  list` + `docs/plans/` at pickup.
- **Pacing:** two new day-costing verbs interact with the attended-time
  envelope — the ADR-132 pass plus the FB-8 telemetry read are the
  guard.
