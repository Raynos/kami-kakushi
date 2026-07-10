# Session 168 — 2026-07-11 — estate Phase 1: the works discovery chain (works-cause)

**Summary:** Built Phase 1 of the estate-upgrades plan
(`docs/plans/fable-2026-07-10-estate-upgrades-redesign.md`) end to end: the
ADR-139 narrative diverge **works-cause** (3 blind takes; pick = C "the land
keeps its own book") plus the full engine chain it voices — the day-book
NAMES a concern → the walk SEES the damage → Genemon's beat PRICES the work →
the ladder stage opens (TST3, FB-338's fix). The weir node is now **locked
until the day-book names it** (FB-342's fix). U1 re-sited from the weir
screens to first repairs in the three R1 zones (gate · paddies · woodshed);
the weir lease stays a named concern. Verified live headless against :5173
(canon + take-A swap both green); full verify 18/18, balance sim GREEN
(~+1 wall-minute arc cost), fixtures regenerated. Filed **HR-27**. Earlier in
the session: the plan's leftover forks were put to the human (economy-pane
re-homes + influence-teaser home → deferred to Phase 2 as written; model
routing approved as proposed) and stamped into the plan (`ea12987e`).

## What changed

- **`src/core/works.ts` (NEW)** — the discovery-chain glue (AC-20):
  `WORKS_PROJECTS` (per-stage naming/sighting/open flags + zones),
  `worksPass` (runs first in `finish`; enqueues `works-intro` on forecourt
  presence R2+, reveals `room-weir` on the lease naming, rung-derives U2–U4
  naming LADDER-ORDERED, emits naming/sighting lines once), `stageOpen` /
  `stageDiscovery` / `stageLabel|Blurb|LogLine` (take-aware resolvers) +
  `__setWorksFlavorOverride` (the req-flavor core-overlay pattern).
- **`intents.ts`** — `finish` composes `worksPass` first; `improve_estate`
  refuses an un-opened stage; the completion line emits via `stageLogLine`.
- **`map.ts` / `surfaces.ts`** — the weir gains `revealFlag: 'room-weir'`
  (never rank-granted; the fiction reveals it).
- **`estate.ts`** — U1 strings single-sourced from FLAVOR (`worksU1*`).
- **`selectors.ts`** — `estateBuild.next` gains `discovery` + `open`.
- **`render.ts`** — pre-priced stages stay unnamed; the card reads the
  unnamed/named hint (live-swappable); labels/blurbs via the works resolvers.
- **`autoplay.ts`** — `driveWorks`: the sim walks the chain (to the board for
  the naming, then each unseen zone) instead of livelocking on the gate.
- **`dev.ts`** — story switcher forwards flavor takes to the works overlay.
  ⚠ these hunks were swept into the co-agent's `fe944372` (FB-364) commit —
  HEAD was import-broken in isolation until this session's feature commit.
- **Narrative canon** — 5 scene-defs in `scenes.md` + 14 keys in `flavor.md`
  (take C, redlined); alternates + briefs in `takes/works-cause/`.
- **Tests** — `works.test.ts` (NEW: FB-342 regression, full-chain walk,
  ladder-order naming, once-only lines, discovery read, 1:1 stage keying);
  economy/pillars fixtures close the chain via `WORKS_PROJECTS` (source of
  truth) + a new RED-able "coin alone buys nothing" case; map/scenes tests
  updated for the gated weir + data-driven flag scan.
- **Regenerated** — fixtures (the generator's bot walks the chain — the
  integration proof), `t0-pacing.md` (ADR-132: R2 +2 intents, R6/R7 +5 each,
  ~+1 wall-minute of 155; ascension intact all seeds), t0-story/content, PRD
  gen-regions.
- **Docs** — HR-27 filed; Pass-1 brief preserved in the bundle; plan Status
  to be flipped on commit.

## Next intended steps

1. Land the feature commit once the co-agent's staged FB-362 set commits
   (intents.ts/index.ts overlap — coordinated via herdr with w1:p3).
2. Human: HR-27 live read → sign-off prunes `takes/works-cause/`.
3. Phase 2 (Schedule A tab moves + the two ADR-075 surface diverges) is the
   next startable plan step; Phase 3 (repair verbs + inputs) after.

## Landmines

- **The R2 fixture boots at the forecourt pre-naming** — the intro fires on
  the first settle AT the forecourt, so "move away and back" (or any
  forecourt-sited act) is the trigger; a boot-state check won't see it queued.
- **Old saves self-heal** — U2–U4 naming derives from rung+ladder order in
  `worksPass`, never rank rewards, so a save past R5 names on its next settle.
- **`coin-into-the-works` (R6 req)** still says "kura-works" — a stale echo
  of U1's old weir fiction; candidate for the HR-27 sign-off sweep.
- **R2 is no longer fully silent** (ADR-165): the works-intro plays after
  r2-yard-hand, cause-gated on walking to the board — flagged in HR-27 for
  the human's read.
