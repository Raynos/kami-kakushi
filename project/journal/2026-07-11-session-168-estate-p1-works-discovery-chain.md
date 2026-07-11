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

## Phase 2 step 1 — Schedule A lands (same session, 2026-07-11)

The signed one-tab-per-rung table (ADR-177 F1) built and verified live:

- **Works 普請 (NEW, R2 cause-gated):** the projects/improve card moved off
  Estate onto its own tab; `panel-estate`'s unlock predicate IS the cause
  (`works-named-u1` — the works-intro naming), so the chip lights the moment
  the beat closes. `verb-eat-rice` re-keyed to `panel-rung-ladder` to keep its
  R1 timing (the belly, ADR-178).
- **Inventory R3 → R4:** new `tab-inventory` surface, granted by the R4 rank
  reward; `panel-home` re-keys to it (the home is announced when its tab is).
  The two banking fixtures (`rice-at-gate`, `at-kura-with-coin`) re-driven to
  R4 so the e2e market/deposit journeys keep their readout home.
- **Estate 家 R1 → R6:** new `tab-estate` surface (R6 reward); the tab now
  holds the reopening house rooms + the influence pane. `panel-house-influence`
  moved R3 → R6 with it — pre-R6, the Works ladder's standing gauge carries
  the koku signal (the deferred "influence teaser home" call, decided here).
- **Tab order is reveal order** (work · map · works · character · combat ·
  inventory · quests · estate) — a new chip always lights at the row's end.
- rung-beats motivates lists updated in lockstep (the gen-narrative validator
  holds them verbatim-equal to the rank rewards); render/dev/home/m2 tests
  updated to the new schedule with a new 6-case D-119/ADR-177 ladder; the
  8-tab mobile fit + the affected journeys proven green in the real e2e lane.
- Live headless proof: R1 = Map alone · Works lights on the naming · R3 has
  no Inventory · R4 Inventory · R6 Estate with rooms + influence.

⚠ Shared-tree note (again): the drain agent's `84cb7747` swept this session's
render.ts Schedule-A hunks; this commit restores HEAD's consistency (the
surfaces/ranks/tests side).

## Phase 2 step 2 — the two surface diverges (same session, 2026-07-11)

ADR-075 FULL diverges for both Schedule-A surfaces; six working variants, all
live in the DEV panel, prod ships only the self-picked defaults:

- **Works 普請** — A · the day-book page (ships; the works-cause fiction as
  chrome: ledger lines, closed entries ruled through, the open entry priced) ·
  B · the work-site board · C · the interim build ladder. **HR-29.**
- **Estate 家** — A · the house, drawn (ships; the E1 okoshi-ezu FOLD-IN —
  `estate-sheet/from-state.ts` derives the sheet's ink from live state, ending
  HR-16's parked status per F5) · B · the steward's reckoning (Pass-2 redline:
  locked rooms unnamed) · C · the interim rooms list. **HR-30.**
- New fixture **works-u1-priced** (the chain walked to a live priced U1 —
  drives the affordance sweep and the human's HR-29 review).
- Defaults rebuild signature-gated (zero idle churn, TST2); variant routing
  tests added (dev.test.ts); strip-safety per `verify-dev-strip.sh` (T0 ships
  DEV default-off by design — the skill's grep satisfied by intent, AC-19).
