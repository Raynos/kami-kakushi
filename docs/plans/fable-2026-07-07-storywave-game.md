# Plan B — the storywave GAME plan: rewrite T0 in src/ to the bible

**Status: 📋 PROPOSED — awaiting the human's read; executes in parallel with
fable-2026-07-07-storywave-docs.md per the §S seam.**

**Open questions RESOLVED (2026-07-08 walkthrough)** — see the bottom section
+ ADR-163/164/165. Three overrode the executor defaults (Q3 wage verb, Q6
every rung-up gets a VN, Q8 keep the defeat bleed), and a **rice-model
reframe** (measured kura-units + soft caps + the seasonal-pool sink loop) is
NEW scope the milestone bodies predate (inline notes flag the affected steps).

**Confidence: ( 90% Opus, 10% Fable )** — a multi-system engine rewrite where
sequencing judgment, cross-gate reasoning, and taste-adjacent wiring decisions
concentrate on nearly every milestone; only the mechanical sweeps (name
renames, test-fixture rederivation) are Fable-grade.

> **Ruling (human, 2026-07-08 — the ONE-VERSION ruling, reconciled into
> the body below; Plan A transcribes it as the A0 docket's 11th ADR
> draft, refining ADR-139/143 for this wave):** the prose wave ships
> **ONE version of the story**. The staged wave is COMPLETE on disk
> (verified 2026-07-08): `t0v2/` holds u0–u9, each with 3 takes + a
> VERDICT.md, plus `flavor/f1-nodes.md` + `flavor/f2-texture.md` +
> `flavor/VERDICT.md`. Per unit the judge's VERDICT pick IS the
> canonical text — some VERDICTs are per-piece mixes (u8 ships C with A
> grafts; u9 a per-character mix) and most carry required redlines; the
> pick PLUS its redlines together are canon. The alternates stay in
> `t0v2/` as on-disk archive and are **NOT wired** into the DEV Story
> switcher; the rung-bucket switcher/grouping work and the per-rung DEV
> review are cancelled (the human may still ask for a swap by redline —
> an edit to the picked take's canon `.md`, never a live toggle). G5
> and G7 below are written to this ruling.

This plan is SELF-CONTAINED: the scout reports it distills live in git-ignored
`tmp/` and may be gone — every file-level fact needed is baked in below. Where
this plan and the running build disagree, the build wins (PH2); where this plan
and `docs/story-bible/` disagree, the bible wins (it is blessed canon,
ADR-150).

---

## Who builds this — Opus-class executor (human ruling, 2026-07-07)

One Opus-class session (or a short chain of them, resuming via journal +
snapshot) executes G0→G7 (G3.5 included) in order. Per ADR-150,
B2/B4-class work is Opus-routed; the human confirmed the routing for
this re-plan.

**Where taste concentrates, and how the executor stays safe:**

- **The prose is PRE-AUTHORED.** Every fiction-voiced string the rewritten
  game shows comes from the staged wave in
  `src/core/content/narrative/t0v2/` (10 story units × 3 takes + a
  VERDICT.md pick each; the flavor layer `flavor/f1-nodes.md` +
  `flavor/f2-texture.md` — single-take sheets whose `flavor/VERDICT.md`
  is a scorecard + required-redlines pass, not a pick — ALL on disk,
  verified 2026-07-08). The executor MIGRATES prose —
  it never writes, "improves," or paraphrases fiction. A fiction gap found
  mid-build (a needed line with no t0v2 source) is an **HD-item** in
  `project/human-in-the-loop/decisions.md` requesting a supplemental prose
  mini-wave — never improvised prose. G0 runs a pre-flight inventory to
  find these gaps EARLY (several are already known — see G0).
- **Balance magnitudes are SIM-OWNED (ADR-132).** The executor sets seed
  values, runs `pnpm run verify:balance` → `pnpm run balance:report`, and
  commits the regenerated `docs/content/t0-pacing.md` WITH the change;
  `balance-sim --summary` pasted into the commit body. It never tunes by
  feel and never moves a cockpit slider into canon (ADR-134).
- **UI reshapes** (the 地図-tab sheet swap, the season wheel, the night-round
  runner surface) follow `docs/living/ui-design.md`
  + the two-pass taste-scorecard flow (FB-10/ADR-135): Pass-1 constraint
  brief before building, Pass-2 scorecard after. These are *reshapes of
  existing surfaces to a locked design*, not new-surface diverges — ADR-075
  diverge machinery is NOT re-run for them (the map already went through
  ADR-149/151 review). If the executor
  finds itself inventing a genuinely NEW player-facing surface, stop: that
  is an HD-item.
- **Design forks** are listed in "Open questions" at the bottom, each with a
  recommended default. The executor takes the default, notes it in the
  journal, and surfaces the fork (PH4) — it never blocks, and it never
  writes an ADR itself (§S sync point 3: ADRs are Plan A's transcription of
  the human's rulings).

## Context a fresh executor needs (ordered read list)

1. `docs/story-bible/tiers/t0.md` — THE spec for everything below.
2. `docs/story-bible/03-tiers.md` (T0 section + the ink thread),
   `04-cast.md` (voices, name sweep), `05-world.md` (calendar, node
   grammar, estate anatomy), `01-laws.md` (prose law §0.5 — binds UI text
   surfaces too; constraints §0.9), `00-kernel.md` via the bible README.
3. `docs/living/decisions.md`: ADR-150 (the charter), ADR-145 (Phase-2
   economy lock), ADR-146 (node discoveries), ADR-148 (timed actions),
   ADR-149 + ADR-151 (the map sheets are player-bound; the sheet IS the
   map), ADR-139/143 AS REFINED by the one-version ruling (2026-07-08,
   the A0 docket's 11th ADR: this wave ships the VERDICT picks as the
   one version; alternates archive unwired), ADR-132/134 (balance
   verdicts; sliders are the human's).
4. `src/core/content/narrative/README.md` (the FB-5 grammar) +
   `src/core/content/narrative/t0v2/README.md` (the staged wave's layout).
5. `docs/guides/qa-playtesting.md` (§1 harness/`__qa`, §2 the ADR-132 flow).
6. This plan's §S seam contract + "Seam mechanics in practice".
7. `AGENTS.md` (conventions; the ambient test rule) +
   `.claude/skills/tdd/SKILL.md` (the red→green→refactor procedure).
8. `project/status/project-status.md` + the latest journal entries (what
   the other executor has landed).

## §S · The seam contract (shared by both plans)

Two executors run in parallel in ONE shared tree. The tree is split by
path ownership; neither agent ever stages the other's paths.

**Plan A (DOCS) owns:**
- `docs/living/prd.md` + `docs/living/prd/**` (the §5 rewrite + all
  section ripples + gen-region rebinding)
- `docs/living/roadmap.md`
- `docs/living/decisions.md` — ALL ADR writes, both plans' (see sync
  point 1)
- `docs/living/fun-factor.md`, `docs/guides/**`, root `README.md`
  (story-stale lines only)
- `src/scripts/gen-prd-regions.ts` (region rebinds ONLY — the one src/
  file A may touch)

**Plan B (GAME) owns:**
- `src/**` (everything except `src/scripts/gen-prd-regions.ts`)
- `e2e/**`, `src/fixtures/**`
- `docs/content/**` (generated by gen scripts it runs)
- `CHANGELOG.md` + `package.json` (only at ship, via /ship)

**Both, read-only:** `docs/story-bible/**` is blessed canon (ADR-150).
Neither plan edits it; a needed canon change is an HD-item for the
human.

**Sync points (the only cross-plan dependencies):**
1. **A0 mints the engine-ADR docket first** (one sitting, transcription
   from the bible's locked shapes). Plan B never blocks on it: B's text
   cites ADRs by docket name ("the calendar ADR, docket #2"), and B's
   own milestones embed the full spec. If B starts before A0 lands,
   nothing breaks.
2. **PRD §5 carries a status banner** ("forward canon; the shipped game
   trails until the build wave lands") from the moment A rewrites it
   until B ships. A owns adding it; A's final milestone (post-B-ship)
   removes it and runs the closing `prd:drift`.
3. **Mid-build decisions:** neither executor writes a new ADR ad hoc.
   A decision fork = an HD-item in `project/human-in-the-loop/`
   (surfaced, default picked, never blocking) — the human rules, A
   transcribes.
4. **Journals/snapshot:** each executor keeps its own journal file;
   `project/status/project-status.md` updates only its own workstream
   lines; commits are pathspec-only (shared-tree law).

### Seam mechanics in practice (B-side working notes)

- **The `gen-prd-regions` coupling.** The gate transcludes `RANKS` into a
  PRD §3 gen-region — a `ranks.ts` rewrite REDs it until the region
  regenerates, but `docs/living/prd/**` is Plan A's. Rule: before the G4
  cutover lands, check whether A's §5 rewrite has rebound/retired the
  region. If the gate REDs on B's cutover anyway, B runs
  `pnpm run gen:prd-regions` and includes the regenerated PRD region file
  in the cutover commit **as generator output** (the mechanical mirror of
  `docs/content/**`; flag it in the commit body). B never hand-edits PRD
  prose.
- **ADR-088 tier tests vs `milestone-integrity`.** The gate resolves
  roadmap DoD-named tests to real files; `roadmap.md` is A's. B keeps the
  tier-gate test FILENAMES stable — `src/core/t0-arc.test.ts` and
  `src/core/invariants.test.ts` are rewritten IN PLACE, never renamed —
  so the gate stays green regardless of A's roadmap-edit timing. The names
  A should transcribe into the rewritten-T0 milestone's DoD are exactly
  those two (named again in G4's DoD).
- **The clean-break-saves ADR** rides A0's docket (human ruling
  2026-07-07: clean break, no migration, courteous in-game notice). B
  implements it (G1) citing "the clean-break ADR, A0 docket" until the
  number exists.
- **A third workstream exists:** the map workstream (ADR-149/151) owns the
  `src/ui/map-sheets/` painter craft + the rung-reveal mask mechanism (it
  builds them with PLACEHOLDER rung data). B owns: `MAP_NODES`, the
  地図-tab integration, and locking the REAL zone→rung table by editing
  the table, not the code (ADR-151 §2). Coordinate via journal/snapshot —
  don't rebuild each other's layers. B may fix bible-name drift inside
  `src/ui/map-sheets/nodes.ts` content strings (e.g. a stale "O-Sato" →
  O-Hisa at `nodes.ts:97`) — that's a mechanical name-sync, exempt from
  diverge (ADR-139 exemption).
- **The prose fleet has FINISHED `src/core/content/narrative/t0v2/`** —
  u0–u9 (3 takes + VERDICT each) plus `flavor/` (f1-nodes + f2-texture +
  VERDICT) are all on disk (verified 2026-07-08). The directory is read
  by no gate (gen-narrative's input list is explicit; oxfmt/md-links
  ignore it). B treats `t0v2/` as read-only input; G0 re-verifies the
  full layout as a pre-flight check (a missing file is a defect to
  surface immediately — never a silent wait).

## Conventions (restated for the executor — binding)

- **Pathspec-only staging.** The tree is shared: `git add <paths>` never
  `git add -A`/`-u`; run `git diff --cached --name-only` immediately
  before EVERY commit (another agent's staged files can sweep in).
- **Full `pnpm run verify` at commit** (code lane; the pre-commit hook
  runs it). A push always verifies the full roster. Never push red; never
  `SKIP_VERIFY=1` onto `main` (the G4 worktree protocol below is the one
  sanctioned pressure valve).
- **Journal per session** (`project/journal/`, append-only, own file);
  snapshot updates touch only this workstream's lines.
- **Commit style:** 50/72, Conventional-Commits subject, body leads with
  why; every commit ends `Assisted-by: <AGENT>:<actual model id>` — never
  `Co-Authored-By:`, never emoji banners.
- **Never edit a `*.gen.ts`** — edit the `.md` source and run
  `pnpm run gen:narrative` (outputs are oxfmt-piped and byte-compared).
- **Never edit `docs/story-bible/**`** — a canon bug is an HD-item.
- **Never move balance sliders into canon** (ADR-134); magnitudes ride the
  ADR-132 flow (§2 of `docs/guides/qa-playtesting.md`), and step 0 is
  reading `project/telemetry/` for untainted real-play reports.
- **Markdown prose wraps at ~80 chars** (soft norm; tables/URLs exempt).
- **Register rules bind UI text surfaces too** (bible §0.5, locked): even
  "mechanical" UI copy the player reads in-fiction (reveal lines, lock
  hints, the retirement notice) obeys the prose law — which is exactly why
  such text must come from the staged wave or an HD-item, never ad hoc.

## Execution shape — green prep → worktree cutover → green tail

The gate roster (`src/scripts/gates.ts`) holds the CURRENT T0 arc green at
every commit: `vitest`, `fixtures` (byte-compares engine-driven saves),
`pacing` + `playcheck` (drive `focusedOptimalIntent` through the arc),
`gen-narrative`, `gen-docs`, `verify-content`, `gen-prd-regions`. The
content cutover — new zones + ladder + narrative + economy at once — cannot
be split into individually-green commits without shipping chimera states
(half-satoyama, half-bible), so:

- **G0–G3.5 land green on `main`** as normal small commits — additive
  registries, dormant/back-compatible engine machinery, and the compiler
  extension, each fully verified.
- **G4 (the content cutover) runs in an ISOLATED WORKTREE:**
  `git worktree add ../kk-storywave -b storywave-cutover`, then
  `pnpm install` inside it (a fresh worktree has no `node_modules`;
  "green under the FULL roster" needs one). Inside it the executor
  commits WIP freely (`SKIP_VERIFY=1 SKIP_JOURNAL=1` allowed THERE and
  only there — the journal-hygiene gate is a separate pre-commit check
  that `SKIP_VERIFY` does NOT skip; those WIP commits never push, and
  `main` in the shared tree never sees red). When the whole cutover is
  green under the FULL roster inside
  the worktree, land it on `main` as a short series of green, pathspec'd
  commits (rebase/cherry-pick or a squashed re-commit — executor's
  choice), push, then `git worktree remove ../kk-storywave` and delete the
  branch. Rationale: shared-tree law — a red local commit on `main` would
  block Plan A's pushes; PH1 — the worktree removes all pressure to
  shortcut the cutover into fake-green slices.
- **G5–G7 land green on `main`** again.

Re-baselining note: the cutover changes wall-times wholesale. The `pacing`
gate and `verify:balance` bands re-derive INSIDE G4 (they are part of what
"green in the worktree" means), per ADR-132 — with the regenerated
`docs/content/t0-pacing.md` committed in the landing series and the sim
summary in the commit body. The ADR-133 `PHASE2_PHASE1_RATIO_BAND` law
(Phase-2 ≈ Phase-1 wall-time) SURVIVES the rewrite and must hold at land.

---

## Economy spec (embed of ADR-163 — the soft-cap two-lane model)

Added by the 2026-07-08 walkthrough scoping pass. This is the concrete shape
the economy milestones build; G1 / G3 / G4.5 reference it. It elaborates
ADR-163 (which refines ADR-158) — it fixes **mechanism and structure only**;
ALL magnitudes (unit ratios, curve exponents, sink rates, wage/nengu size) are
**SIM-OWNED (ADR-132)**, verdicted at build via `verify:balance` +
`balance:report`. Where this and a milestone body disagree, THIS block wins
(it is the newer, walkthrough-ruled spec).

**The soft-cap law.** Every accumulation axis is bounded by a CURVE, never a
hard wall — grind-proof by construction (each axis flattens; pushing past
equilibrium is wasted effort). The five axes and their caps:
- rice/goods production → diminishing returns as the season pool depletes
- the kura (storage) → spoilage
- free HP recovery → the manual "rest at sickroom" trickle (ADR-164)
- standing / deeds → rising rung thresholds (ADR-159)
- mon inflow → the fixed day-wage + Yohei's finite purse

**Rice as measured units.** Rice is a commodity held in the kura, NEVER a
pocketed integer. One ladder of period units, magnitude-appropriate display
(TST4):
- **shō (升)** — the small unit: a day's meal, a day-hand's rice reckoning.
- **bale / 俵 (hyō)** — stores & sales; the kura reads in bales.
- **koku (石)** — the reckoning unit; the nengu is stated in koku.
- Rough ladder (exact ratios sim-owned): ~100 shō = 1 koku; 1 bale ≈ 0.4
  koku. The kura shows bales (a koku total surfaces at the nengu); wages/meals
  show shō. The player never sees "N rice".

**Production — the finite seasonal pool.** Each labour SITE (paddy, woodlot,
weir, grove…) carries a per-season yield POOL. Working the site draws that
pool down with DIMINISHING RETURNS — each action yields a fraction of what
remains, so output asymptotes toward (never reaches) zero within a season (the
human's ruling: the pool thins, never fully dry). The pool REFILLS when the
season turns — this is *why* seasons are manual containers (G1). Per-site
seasonal peaks ride the existing harvest multiplier (paddy peaks Autumn, etc.).
*Mechanism: a per-(site, season) remaining-pool scalar + a decreasing yield
curve; the curve shape + pool sizes are sim-owned.*

**Sinks — the kura goes DOWN.** Five, each a different pressure:
- **Consumption** — the household eats a steady shō/day draw (scales with
  household size in later tiers). A constant background drain.
- **Spoilage** — the storage soft cap: held stores decay per season (a rate on
  the total, so net stock converges where spoilage = inflow). The spoilage
  pass runs at season-exit (G1's exit pipeline).
- **The nengu** — Autumn's reckoning: a koku demand met from the kura; the
  Autumn exit-gate (`flag nengu-reckoned`). Shortfall is the debt's felt
  pressure (never numbered in T0).
- **Debt / the lease** — the lease day + Sōan's ledger draw on stores / coin.
- **Seed** — a reserve of the harvest is held back for next season's planting
  (a self-imposed floor the player learns to keep).

**Progress is DEEDS, not rice.** Rice is working capital that OSCILLATES —
fills through the growing seasons, drops at consumption + spoilage + the
nengu. What the player KEEPS is deeds / rung standing (ADR-159's pillar
engine, Phase-2). The rice count is never the score; the score is "did you run
the house through the year with a margin".

**The two lanes, restated (ADR-158 + ADR-163).**
- **KIND** (soft-capped, not truly unbounded): labour → rice/goods into the
  kura; combat → materials; consumables run on kind. Bounded by production
  soft caps + spoilage.
- **MON** (bounded): the fixed day-wage (R5+, collected by the
  collect-at-the-board verb) + Yohei's finite market-day purse;
  durables / stall stock / sickroom bills run on mon. Raw materials are NOT
  sellable (his `buys:` whitelist = rice + named goods only).

**Milestone split** (each milestone builds its slice of the above):
- **G1** — rice-unit constants + the kura stores as measured state; the
  per-(site, season) production-pool structure; the consumption sink; spoilage
  as the storage soft cap (in the season-exit pipeline).
- **G3** — the HP soft cap (no auto-trickle; treatment / manual rest) + the
  defeat carried-loss bleed (ADR-164).
- **G4.5** — the wage verb; Yohei's purse + `buys:` whitelist + season stock;
  the payment-ladder reveal; the nengu / debt / lease sinks wired to content;
  `banked` = house stores.

### Build map — the rice reframe's state shape & touch-points

The rice reframe is NEW scope; this pins the SHAPE decisions so G1/G4 don't
improvise them. Field names are the executor's to finalize; the STRUCTURE and
the touch-point list are the spec. All ratios/magnitudes are sim-owned
(ADR-132).

**State shape (the judgment calls, pinned):**
- **Rice is stored canonically in shō** (the smallest unit) as ONE integer;
  bales and koku are DISPLAY conversions (÷ constants), never separate stored
  fields — no float drift, one source of truth.
- **Rice lives ONLY in the kura** (house stores) — which is what `banked`
  becomes (Q5: one-way barn-filling, no withdrawal verb at T0). The player's
  CARRIED pocket holds coin (mon) + goods/materials, NEVER rice. *(This is the
  state basis for the "defeat never bleeds rice" + "rice un-pocketed"
  invariants — G4 DoD.)*
- **The production pool is per-(site, season) state** — a remaining-yield
  scalar per labour site, drawn down as the site is worked (the yield curve
  reads it) and REFILLED at season-turn. Retire any unbounded per-action
  yield assumption.

**Touch-points (what each file does — the old carried `rice` integer dies at
G4):**
- `state.ts` — retire the carried `rice` integer; `banked` → the kura (rice in
  shō + house goods); add the per-site season-pool state.
- `constants.ts` / `content/balance.ts` — unit ratios (shō↔bale↔koku), per-site
  pool sizes, the diminishing-returns curve params, the daily consumption
  rate, the spoilage rate, the nengu koku demand — ALL sim-owned.
- `selectors.ts` — display selectors deriving bales/koku from kura shō; the
  production-yield selector (pool + curve).
- `content/activities.ts` — labour yields draw from the site pool via the
  curve, deposit to the kura in shō.
- `content/market.ts` + `intents.ts` (`sell_rice`/`buy_item`) — Yohei prices
  rice per measured unit; deposits reframed to house stores; the
  collect-at-the-board wage verb credits mon.
- `step.ts` — daily consumption draws shō from the kura; the season-turn
  refills the site pools.
- the season-exit pipeline (`pillars.ts` / the G1 exit hook) — the spoilage
  pass decays kura shō; the Autumn nengu reckons the koku demand.
- `render.ts` — the kura reads in BALES (koku surfaced at the nengu);
  wage/meal amounts read in shō; the UI NEVER shows a raw "N rice" integer
  (TST4).
- `fixtures/specs.ts` + `sim/` — re-derive every waypoint against the kura
  model.

**Display rule (TST4):** kura total → bales (+ a koku line at the nengu);
wage/meal amounts → shō; never a unit-less "rice" number anywhere the player
reads.

---

## Milestones

### G0 · Cast registry (add-only) + the fiction-gap inventory

**Goal:** every new cast name/voice exists in the registries BEFORE any
prose compiles against them (the emit-time landmine: `resolveSpeaker`
throws on a name absent from `NPC_NAME`/`NAMES`; rung keys typecheck
against `RankId`) — and every fiction-voiced string the rewrite will need
is mapped to a t0v2 source or surfaced as a gap NOW.

**Files:**
- **M `src/core/content/names.ts`** — ADD (do not yet rename anything the
  live canon narrative references): `ohisa: 'O-Hisa'`,
  `shinnosuke: 'Shinnosuke'`, `toku: 'Toku'`, `oyae: 'O-Yae'`,
  `matsuzo: 'Matsuzō'`, `iori: 'Iori'`, `oume: 'O-Ume'`,
  `useName: 'Gonbei'` (Naoyuki needs NO `NAMES` change — the existing
  `heir` key already carries `'Naoyuki'`; the `naoyuki` NpcId addition
  below is `voices.ts`'s). Forward names
  correct now (nothing live references them): `villageChief` → `'Mohei'`,
  `mother` → `'O-Nobu'`, `sister` → `'Suzu'`; DELETE `sweetheart`
  (Osen is void — origin relock). DEFER to G4 (live canon still resolves
  through them): `lord: 'Shigemasa'` → `'Munemasa'`,
  `pedlar: 'Tokubei'` → `'Yohei'`, `smith: 'Tōzō'` (retires from T0; T1's
  smith is Tetsuji — leave a comment, delete at G4).
- **M `src/core/content/voices.ts`** — grow `NpcId` with
  `ohisa | shinnosuke | toku | naoyuki | yohei | oyae | matsuzo | iori |
  oume | soan…` (keep existing ids incl. `shigemasa`/`tozo` until G4
  deletes them); add `NPC_VOICE`/`NPC_NAME` rows; add voice categories as
  needed (reuse `villager` for O-Yae/O-Ume/Matsuzō; `official` for Iori is
  wrong — add `monk`; the `lord` voice re-homes to Munemasa at G4).
  `PLAYER_SPEAKER` untouched here (G4 §8).
- **C nothing else.** `people.ts` placements need the new AreaIds → G4.

**The fiction-gap inventory (same milestone, doc output):** first
re-verify the staged wave's layout on disk (u0–u9 each with 3 takes +
VERDICT.md; `flavor/f1-nodes.md` + `f2-texture.md` + `flavor/VERDICT.md`
— a missing file is surfaced immediately, never silently waited on),
then walk the G4 spec below and list every fiction-voiced string against
the wave ITSELF — there is no separate manifest; the unit roster is:
- `u0-cold-open` — the weir rescue, Sōan's examination, the intro
  scenes, the forced name-question beat;
- `u1`–`u7` — the rung beats R1–R7, one unit per rung;
- `u8-side-beats` — the grove DECIDE, the first Bon, the lease day, the
  dog that stays, the crest question + the mystery windows;
- `u9-dialogue` — node/ambient dialogue for the T0 cast;
- `flavor/f1-nodes.md` — node blurbs, wrong-things, action labels,
  discovery fiction (the node sheet);
- `flavor/f2-texture.md` — the texture sheet; its `##` sections are
  exactly: prose log-texture (seasons/weather) · quest-rewards · perks
  · field-guide. (Surface REVEAL lines are NOT in it — see
  known-uncovered item 4 below.)
Placement is defined by each unit's VERDICT.md — the pick (including the
per-piece mixes: u8 ships C with A grafts, u9 a per-character mix) plus
its required redlines — never by a manifest. The inventory's
needed-grammar-forms column doubles as G3.5's grammar-demand list.
Known-uncovered already:
1. the six per-season VN overlay scenes (the season-exit ceremony),
2. the nengu Autumn-exit scene (the board; the MC as furniture),
3. per-req requirement flavor (`flavor:` + `drive:` lines, R0–R7),
4. surface reveal lines (the ~45 `surfaces.ts` unlock lines — NOT
   covered by `f2-texture.md`, verified: its sections are log-texture /
   quest-rewards / perks / field-guide),
5. the save-retirement notice text,
6. estate repair-project lines + the day-book seasonal-judge grade lines,
7. the sickroom/treatment lines and the wage/payment-ladder beat lines.
File ONE consolidated HD-item requesting a supplemental prose mini-wave
(3 takes for scenes, 1 law-compliant take for texture), staged into
`t0v2/` by the same fleet process and in the SAME shape as u0–u9 under
the one-version ruling (2026-07-08): takes → a judge VERDICT → the pick
(+ its required redlines) is canonical; alternates stay in `t0v2/` as
archive; NOTHING is wired into the DEV switcher. The executor keeps
building G1–G3.5 while it runs.

**DoD:** registries compile; no live behavior change; the HD-item filed.
**Named tests:** extend `src/core/content/voices.test.ts` — the NpcId
roster asserts every `NPC_NAME` value resolves back through the reverse
map, derived from the registry itself (no copied name literals; RED if a
new id lacks a name/voice row).
**Verify:** `pnpm run verify` (full green — additive only).

### G1 · The six-season manual calendar + clean-break persistence

**Goal:** season becomes STORED, MANUAL state (the bible/ADR-150 lock);
old saves retire cleanly. These land together: the state-shape change is
what forces the persistence break.

**Engine spec (embed of the calendar docket-ADR shape):**
- Order (bible `05-world.md`, locked): **Winter → New Year → Spring →
  Summer → Bon → Autumn**, rotating cleanly.
- A season is a CONTAINER filled at the player's pace, ended by a manual
  `advance_season` intent. No auto-turn; no day-derived season.
- Season-exit pipeline (in this order): exit-gate predicate check → the
  seasonal judge (one day-book-voiced grade line) → spoilage pass →
  per-season VN overlay scene enqueued (via G2's scene machinery; until
  G2 lands, a log line stands in) → `season` advances,
  `seasonsPassed`/`yearsPassed` increment.
- Exit gates are DATA on the season entry: Autumn's gate is the nengu
  (`flag nengu-reckoned`); attempting Autumn's exit without it triggers
  the nengu scene (G4 content) whose completion sets the flag.
- Seasons UNLOCK at R2 (**C `readout-seasons`** — a NEW surface row,
  wired G4; the existing `readout-clock` stays the day-of-week clock
  from R0, and its old "four seasons" prose dies at G4.6 — Open
  question #13); R0–R1 show only the day of week. Time display:
  day-of-week from `week()`/day — the month/year counter stays hidden
  (bible).
- Season-scoped content hooks (consumed at G4): per-foe `seasons?:
  Season[]` peaks, per-person `presence` season predicates (Iori lodges
  New Year + Bon), Yohei stall stock restocks per season, node
  per-season flavor keys.
- **⚑ The economy spec's G1 slice (see the "Economy spec" block above —
  ADR-163, NEW scope):** rice becomes MEASURED units (shō/bale/koku) held in
  the kura, never a pocketed integer; the kura stores are re-typed to the
  measured model. The per-(site, season) production POOL structure lands here
  (each labour site has a per-season yield pool that depletes by diminishing
  returns and refills at season-turn). The CONSUMPTION sink (steady shō/day
  draw) and SPOILAGE (the storage soft cap, in the season-exit pipeline) land
  here too. Mechanism only; every magnitude sim-owned (ADR-132). The nengu /
  debt / lease sinks + the wage/market lanes are G4.5.

**Files:**
- **M `src/core/constants.ts`** — `SEASONS = ['winter', 'new-year',
  'spring', 'summer', 'bon', 'autumn'] as const` (re-typed `Season`);
  DELETE `DAYS_PER_SEASON` (grep all uses; the FB-172 pacing anchor
  re-homes to "season exits per rung" in G4's sim re-baseline);
  `SCHEMA_VERSION = 10`; **C `APP_GENERATION = 2 as const`**.
  `TICKS_PER_DAY`/`DAYS_PER_WEEK`/`LUNAR_PERIOD_DAYS` unchanged (the
  29.53d lunar ephemeris already exists — do NOT build a second moon; the
  new-moon mysteries key off `lunarPhase()`).
- **M `src/core/state.ts`** — add `season: Season`,
  `seasonsPassed: number`; `tier` doc-comment 0..5 → 0..6 (the enum
  widens; T1+ content unaffected).
- **M `src/core/selectors.ts`** — `season()` reads stored state;
  `year()` derives from `seasonsPassed`; `week()`/day-of-week unchanged.
- **M `src/core/step.ts`** — remove the auto season-turn + its spoilage
  call (spoilage moves to the exit pipeline).
- **M `src/core/intents.ts`** — add `advance_season` (timed? classify per
  ADR-148: **instant** dispatch of the ceremony — the VN overlay is the
  time; note it in `timing.ts`).
- **M `src/core/content/balance.ts`** — re-key every `Season`-keyed table
  to 6 seasons (`RICE_SELL_PRICE_BY_SEASON` + harvest multiplier);
  seed values mapped from the old 4 (winter↔winter, spring↔spring,
  summer↔summer, autumn↔autumn; new-year seeds from winter, bon from
  summer) — SIM-OWNED, verdict at commit. Includes the STRING-KEYED
  cockpit lever switch at `balance.ts:462–467`
  (`'RICE_SELL_PRICE_BY_SEASON.spring'` …) + the lever-id list it
  serves — tsc catches the re-keyed Record but NOT these string cases;
  extend both to six seasons.
- **M `src/core/pillars.ts`** — `seasonalJudge` re-triggered from the
  exit pipeline. The retired `PHASE2_JUDGE_INTERVAL_DAYS` 3-day cadence
  is a `src/core/constants.ts:60` const (delete it there, with this
  milestone's other constants edits) FIRED from `step.ts`'s daily plan
  (already listed above); `ascension.test.ts` + `pillars.test.ts`
  reference it — rederive those fixtures.
- **Persistence clean break** (cites the A0-docket clean-break ADR):
  - **M `src/persistence/codec.ts`** — envelope carries `generation`.
  - **M `src/persistence/validate.ts`** — a blob with
    `generation < APP_GENERATION` (or none) → `{ retired: true }`, never
    a crash (TST2).
  - **M `src/persistence/saveManager.ts`** — on retired: keep the raw
    blob under a `pre-reboot-backup` key; boot fresh.
  - **M `src/persistence/migrate.ts`** — MIGRATIONS 1–9 deleted (git
    history is the archive; the ADR records it); the chain restarts
    empty at v10. **M `src/persistence/migrate.test.ts`** accordingly.
  - **M `src/ui/render.ts`** — the retirement notice on the cold-open
    screen (composed, in-fiction; TEXT from the supplemental wave).
    Interim state, until the wave lands: a retired save shows the
    notice FRAME carrying a deliberately OUT-OF-FICTION bracketed
    placeholder ("[dev — save retired; the notice text lands with the
    supplemental wave]") — never ad-hoc fiction-voiced prose (§0.5).
    Acceptable on `main` because prod ships only at G7, whose gate
    requires the fiction-gap HD-item CLOSED (Open question #12).
- **M `src/app/main.ts` / `src/ui/render.ts`** — clock readout renders
  the stored season (old unlock schedule until G4).
- **M `src/core/autoplay.ts`** — teach `focusedOptimalIntent` to fire
  `advance_season` when its rung goals for the season are met (minimal:
  keep pacing within the existing bands — the old arc never crossed a
  672-day season, so near-zero drift is expected; if the gate REDs,
  re-baseline per ADR-132 with the verdict in the commit).

**DoD:** full verify green on `main`; a saved v9 blob loads to the
retirement path (backup kept, fresh boot) — proven by test; season only
advances by intent.
**Named tests:** **C `src/core/season.test.ts`** — (RED-able each): the
wheel order is exactly the bible's six; `advance_season` refuses a gated
exit; the judge + spoilage fire once per exit; `seasonsPassed` increments;
fixtures derive from `SEASONS` itself, never string literals. **M
`src/persistence/migrate.test.ts`** — an old-generation blob yields
`retired`, the backup key exists, no crash. **M
`src/persistence/save-e2e.test.ts`** round-trips the new envelope.
**Verify:** `pnpm run verify && pnpm run verify:balance &&
pnpm run balance:report` (commit t0-pacing.md if it moved).

### G2 · Generalized scenes + the night-round runner (engine, dormant)

**Goal:** the two engine seams the bible's T0 needs beyond promotions —
scenes not tied to rungs (the Count, side-beats, lease day, nengu, season
overlays, Bon) and the on-rails night round.

**Scene machinery spec:** today only `introBeat` and `rungBeat` can open
the VN. Add:
- **C `src/core/content/scenes.ts`** — a `SCENES` registry:
  `SceneDef { id: SceneId; scene: RungScene; trigger: SceneTrigger;
  once?: boolean }`. There is NO `VNScene` type and none is invented:
  the shared VN payload is the EXISTING `RungScene`
  (`src/core/content/rungBeats.ts:56`), generalized minimally — `rank:
  RankId` widens to `rank?: RankId` (present only on promotion beats)
  and `motivates` defaults to `[]`; `RungOption` already carries every
  effect the staged prose declares (`memory`/`flags`/`statBonus`/
  `setStance`, all optional). The intro's `DialogueScene` keeps its own
  path unchanged (its `IntroOption` perk/stat shape differs by design);
  unification happens at the RENDER layer only (one modal — TST1).
  `SceneTrigger` is a discriminated union:
  `{ kind: 'rung', rung: RankId }` (promotion beats keep their current
  path) · `{ kind: 'season-exit', season: Season }` ·
  `{ kind: 'flag', flag: string }` · `{ kind: 'verb' }` (opened by an
  explicit intent, e.g. a node action) · `{ kind: 'scripted' }` (enqueued
  by engine code — the Count, the night-round frames).
- **M `src/core/state.ts`** — `sceneQueue: SceneId[]`,
  `activeScene: { id: SceneId; beat: number } | null`,
  `scenesPlayed: string[]` (write-once latch, mirrors `unlocked`).
- **M `src/core/intents.ts`** — `begin_scene` / `advance_scene_beat` /
  `choose_scene_option`, generalized from the intro/rung VN reducer arms
  (same ask-hub/decide/memory/flags semantics — the FB-5 grammar already
  expresses all of it; scene VN content compiles from a NEW gen unit
  that G3.5 — the compiler milestone — lands BEFORE G4; the registry
  ships EMPTY here).
- **M `src/ui/render.ts`** — the VN modal renders `activeScene` through
  the same path as intro/rung beats (one modal, one code path — TST1).

**Night-round runner spec (embed of the docket-ADR shape):**
- A round is an AUTHORED ON-RAILS sequence — not free map movement.
  "Begin the night round" posts at the Gate (bible: its post at the
  gate). First round is a quest; repeatable after.
- **C `src/core/night-rounds.ts`** (engine) + **C
  `src/core/content/nightRounds.ts`** (registry):
  `NightRoundStage { id; areaId: AreaId; foe: EnemyId;
  scripted?: 'survive' }` — `scripted: 'survive'` is the R3 wolf stage:
  guaranteed survival, never a win (blood on the sill, mostly his; the
  wolf flees bleeding), replacing `applyScriptedWolf` semantics. Rounds
  keyed by rung band: pre-R3 (store rats → a marten), the R3 round (rats
  → marten → THE WOLF as climax), post-R3 repeatable escalations.
- **M `src/core/state.ts`** — `roundState: { roundId; stage } | null`.
- **M `src/core/intents.ts`** — `begin_night_round` (only at the gate
  node; gated on the surface unlock, wired G4) + stage resolution through
  the EXISTING combat resolver on the seeded `combat` stream.
- Outcomes: **finish** → materials-only rewards (never coin — bible),
  flags (the R3 stage writes the durable **`wolf-survived-not-won`**
  flag, T1's boundary-stones hook; flags carry through `ascend`);
  **fall** → the defeat-to-sickroom path (G3) with days lost.
- New-moon texture: on rounds where `lunarPhase()` is new, the hooded
  lantern crossing is a staged log/scene line (Toku, unnamed — content
  at G4; the ENGINE hook, a per-stage `newMoonLine?` key, lands here).

Both systems land DORMANT: no content registry entry is reachable (the
gate surface + quest wiring arrive at G4), so the live arc is untouched.

**DoD:** full verify green on `main`; both engines drive end-to-end in
tests without UI.
**Named tests:** **C `src/core/scenes.test.ts`** — trigger kinds each
fire exactly once when `once`; the queue drains in order; a decide
applies memory/flags identically to the rung-beat path (the registry
ships empty at G2, so the machinery tests drive a constructed `SceneDef`
through the reducer arms; at G4.6, once content lands, re-derive the
fixtures from real registry entries — never inline literals after that).
**C
`src/core/night-rounds.test.ts`** — a seeded round resolves stage-by-
stage; the scripted stage cannot kill or win; fall exits to the sickroom
path; rewards contain no coin (assert against the registry — RED if
anyone adds a coin reward).
**Verify:** `pnpm run verify`.

### G3 · The two body economies (the missing coupling)

**Goal:** the bible's "one body, two meters, coupled one way": labour
NEVER costs HP (already true — satiety is the work fuel); **low HP now
impairs work capacity** (missing); defeat routes to the sickroom.

**Files:**
- **M `src/core/selectors.ts`** — `staminaRate` (or a sibling
  `workRate`) gains the HP term: below
  `LOW_HP_WORK_THRESHOLD` (seed: 30% of `hpMax`) work yield/speed scales
  by `LOW_HP_WORK_MULT` (seed: 0.5). Constants in
  `src/core/content/balance.ts`, SIM-OWNED (ADR-132 verdict with the
  commit). Satiety's existing impairment unchanged.
- **M `src/core/fight.ts`** — the loss branch (and G2's round-fall):
  relocate `location` to the sickroom node id (a placeholder AreaId
  constant until G4 creates `sickroom`; to stay green NOW, land the
  relocation behind a lookup that no-ops when the node id is absent —
  delete the guard at G4), lose DAYS (`SICKROOM_DAYS_LOST` seed: 2 via
  `advanceClock`), "Sōan's ledger grows" counter
  (`state.soanLedger: number`), sickroom bill once waged (a mon sink,
  active from G4's wage lane). **RESOLVED (ADR-164): KEEP the carried-loss
  bleed** — a loss bleeds carried coin + goods ON TOP of days + Sōan's
  ledger (rice is spared: it lives in the kura, never pocketed — ADR-163);
  the double-cost curve (bleed + days) gets an explicit sim-check.
- Treatment action (the big-injury mend at the sickroom node) is G4
  content; the state fields land here. **ADR-164: HP has NO auto-trickle** —
  it mends only via the paid treatment action or a manual "rest at sickroom"
  trickle; food stays satiety-only (the two body meters stay distinct).

**DoD:** full verify green; combat loss visibly costs days, not
game-over; low-HP work impairment measurable.
**Named tests:** **M `src/core/economy.test.ts`** (the coupling block —
new): work yield at low HP < yield at full HP, threshold derived from
`LOW_HP_WORK_THRESHOLD` (never a copied 30); labour at 1 HP never
reduces HP (the one-way law — RED if anyone couples it backwards). **M
`src/core/combat-rework.test.ts`** — loss advances the clock by
`SICKROOM_DAYS_LOST` and increments `soanLedger`.
**Verify:** `pnpm run verify && pnpm run verify:balance &&
pnpm run balance:report` (commit the pacing doc with it).

### G3.5 · The FB-5 grammar/compiler extension (owns ALL compiler changes)

**Goal:** every grammar form the staged t0v2 picks declare compiles
BEFORE the G4 worktree opens — G4 consumes the compiler, never edits it.
(Resequenced 2026-07-08: this work previously sat inside G5, AFTER the
milestone whose DoD needed it; ownership is stated here ONCE — no other
milestone touches `src/scripts/narrative/` or `gen-narrative.ts`.)

**Files:**
- **M `src/scripts/gen-narrative.ts`** — TARGETS grows the seventh canon
  file **C `src/core/content/narrative/scenes.md`** (the season
  overlays / nengu / side-beats / the Count), compiled to
  **`scenes.gen.ts`**, consumed by G2's `src/core/content/scenes.ts`
  (which switches from its hand-written empty registry to re-exporting
  the gen registry here). At G3.5 `scenes.md` lands as a STUB (header +
  grammar-exercising sample block(s) drawn verbatim from picked-take
  text where a fiction-voiced sample is unavoidable — never invented
  prose); the real content fills it at G4.1.
- **M `src/scripts/narrative/{parse,emit,validate}.ts`** — extend for:
  the speakerless narration-only beat (R2's silent rung), the scene-def
  block (declares `trigger:` — `rung`/`season-exit`/`flag`/`verb`/
  `scripted` — and `once:` in the grammar), and any `native:` sidecars
  the staged prose marks (each sidecar stays a hand-written
  `*.native.ts` — real logic never enters the grammar). Growth is
  MINIMAL and driven only by G0's grammar-demand list (what the picked
  takes actually declare).

**DoD:** full verify green on `main` (`gen-narrative` round-trips the
stub byte-stable); every grammar form the picked takes declare parses,
emits, and validates.
**Named tests:** **M `src/scripts/narrative/validate.test.ts`** — the
speakerless beat and the scene-def block parse + validate; a malformed
scene-def (unknown trigger kind, `season-exit` without a season) REDs;
fixtures quote the picked takes' declared forms, not invented ones.
**Verify:** `pnpm run verify && pnpm run gen:narrative:check`.

### G4 · THE CONTENT CUTOVER (isolated worktree — the monster)

**Goal:** the shipped satoyama-framed T0 is replaced whole by the
bible's T0 — zones, ladder, cast-at-nodes, enemies, quests, economy
lanes, narrative canon (from the t0v2 VERDICT picks), map tab, speaker
ladder — landing on `main` only as a green series. Work through the
internal checklist IN ORDER inside the worktree; each number is a
coherent WIP commit there.

**G4.1 · Narrative canon from the VERDICT picks.**
- Renames now safe (canon is being replaced in the same stroke):
  `names.ts` `lord` → `'Munemasa'`, `pedlar` → `'Yohei'`, delete `smith`
  (T0); `voices.ts` NpcId `shigemasa` → `munemasa`, delete `tozo`,
  `lord` voice re-homed.
- Rewrite the seven canon files in `src/core/content/narrative/`
  (incl. G3.5's `scenes.md` stub, filled here) FROM `t0v2/*/VERDICT.md`
  picks — a MIGRATION (copy the picked take's blocks, apply the
  VERDICT's required redlines, normalize keys/meta), never re-authoring:
  - `cold-open.md` ← U0 pick (the weir rescue; Sōan's examination; the
    forced name-question beat; first verbs rake + haul water; the
    day-book line *one man, name unknown*).
  - `rung-beats.md` ← U1–U7 picks (R1 terms-at-the-board … R7 Gonbei +
    sleep + the FIRST DREAM). **R2 is the silent rung (ADR-165):** it opens
    a VN frame like every other rung-up, but with SILENT/narration content —
    no granter, quiet (NOT a no-modal path; every rung-up opens a VN). The
    speakerless narration-only grammar form is G3.5's work, ALREADY
    LANDED before this worktree opens — G4 never touches the compiler.
    **R5 the Count** is an ensemble night scene — the
    grammar's ambient-speaker form (`Naoyuki (official): "…"`) already
    carries multi-voice; it plays through G2's `scripted` scene trigger
    (fired by the R5 promotion path), its scene body living in
    `scenes.md` (the G3.5 gen unit), with a `native:` sidecar only if
    the pick marks one.
  - `intro.md` ← U0's examination scenes (the fixed soan/dream/genemon
    order is RESHAPED — the intro-order landmine: the engine's
    fixed-order assumption in the intro reducer is rewritten here to the
    new scene list; there are no old saves to honor, clean break).
  - `dialogue.md` ← U9's pick (node/ambient dialogue for the T0 cast —
    a PER-CHARACTER mix across takes per its VERDICT; migrate
    character-by-character as the VERDICT rules).
  - `scenes.md` ← the season overlays, the nengu scene, the Count's
    scene body, and U8's side-beat pieces (U8 ships take C with A
    grafts — migrate piece-by-piece per its VERDICT's graft map).
  - `flavor.md` ← the flavor sheets `t0v2/flavor/f1-nodes.md` (node
    blurbs, wrong-things, action labels, discovery fiction) +
    `f2-texture.md` (log texture, quest-reward lines, perk lines,
    field-guide entries) with `flavor/VERDICT.md`'s redlines applied —
    single-take sheets, so the redlined sheet IS the pick — + the
    supplemental wave's picks as they land.
  - `requirements.md` — re-derived per rung against the new verbs
    (R0–R7, ≥3 each — the validator enforces): e.g. R3 gates on the
    first night round's wolf stage (`flag wolf-survived-not-won`), R4 on
    the confession beat flags, R6 on the coin errand, **R7 on
    `flag nengu-reckoned`** (the tax season passed — T0 contains a full
    lived year). Requirement FLAVOR lines from the supplemental wave.
- Delete `src/core/content/narrative/takes/estate-build-beats/`,
  taking Open question #11's default: resolve its open HR-item as
  superseded (it diverges OLD-canon estate beats the rewrite voids),
  note the resolution on the item + in the journal, and SURFACE it for
  async override (PH4) — don't block the worktree waiting on the human.
- Run `pnpm run gen:narrative`; commit sources + all `*.gen.ts` +
  `docs/content/t0-story.md` together.

**G4.2 · Zones & map.**
- **M `src/core/content/areas.ts`** — AreaId union replaced with the
  bible's ground, KEYED TO THE SHEET's zone ids
  (`src/ui/map-sheets/nodes.ts` — one vocabulary, TST1): `weir`,
  `weir-reeds`, `gate`, `forecourt`, `woodshed`, `kitchen`, `shrine`
  (corridor, glimpsed), `kura`, `sickroom`, `drill-yard`, `paddies`,
  `field-margins`, `woodlot`, `ruined`, `orchard`, `grove` — 16 AreaIds
  total: 15 walkable + `ruined` (locked scenery).
  `near-satoyama`/`deep-satoyama` GONE.
- **M `src/core/content/map.ts`** — MAP_NODES rebuilt on all 16 ids
  (`ruined` included, `locked: true`); **`MAP_NODE_CEILING` = 16**,
  DERIVED as the sheet's T0 roster minus its activity chips —
  `T0_NODES` (`src/ui/map-sheets/nodes.ts`) has 17 entries only because
  it includes the `night-rounds` `kind: 'activity'` chip, which NEVER
  gets a MAP_NODES entry (it opens the round post, not travel); the
  test derives `T0_NODES.filter((n) => n.kind !== 'activity').length`,
  never a copied number; node grammar
  gains `wrongThing: string` (flavor key) + `seasonFlavor?` keys +
  `locked?: true` (the ruined compound: visible, blurbed, never
  walkable — `canMove` refuses); `revealFlag` per node re-derived to the
  new rung schedule (zones unlock rung by rung — bible `05-world.md`).
- **M `src/core/content/timing.ts`** — `EDGE_WALK_MS` re-keyed for the
  new edge set (the coverage test derives from MAP_NODES — every missing
  edge is RED until keyed); classify every NEW action timed/instant per
  ADR-148 (labour timed, buy/sell instant, `advance_season` instant,
  `begin_night_round` timed).
- **M `src/core/content/discoveries.ts`** — keep the engine + the
  woodlot lacquer entry (woodlot survives); ADD hidden discoveries per
  the bible: `disc-weir-reeds-bundle` (search the reeds — his washed-up
  bundle, a water-ruined paper), `disc-woodlot-sluice` (the silted
  sluice), `disc-margins-sett` (the sett under the ruined wall).
  Discovery fiction text from the redlined `flavor/f1-nodes.md` sheet /
  the supplemental wave (ADR-146: hints ride the diverge process —
  already satisfied by the wave).
- **M `src/core/content/activities.ts`** — labour re-sited, NO direct
  coin yields anywhere: rake + haul (forecourt), field work (paddies —
  the deed engine's heart), kindling/forage (woodlot), mend the weir
  screen + haul stone (weir), load/unload (kura), cut bamboo (grove),
  gather/eat verbs unchanged in kind; orchard reclamation appears as
  repair-labour AFTER the dog chain (flag-gated); gate-watch/sweep
  (gate). `deedSource` mapping re-derived (ADR-145's four pillars
  re-fictioned: fields=paddy work, stores=kura, works=weir screens +
  orchard reclamation, watch=night rounds + gate-watch; the
  `accrueDeed`/`ESTATE_STAGES` engine and the ratio-band gate are KEPT).
- **地図-tab integration (ADR-151: the sheet IS the map):**
  **M `src/ui/render.ts`** — the Map tab renders the T0 sheet
  (`src/ui/map-sheets/sheet.ts`) with zone seals as the travel nodes
  (dispatch `move_to` on seal tap) and the reveal mask driven by the
  REAL zone→rung table (B edits the map workstream's placeholder TABLE,
  not its code); the `night-rounds` chip opens the round post, never
  travel. **D** the `map-variants/ezu.ts` node-graph render path
  (default: retire whole — Open question #2; keep the `MapCtx` shared
  types that survive).

**G4.3 · Enemies, quests, combat content.**
- **M `src/core/content/enemies.ts`** — new roster (each with `level`,
  archetype knobs, `seasons?` peaks, **NO `coinReward` — the field is
  DELETED from the type**): feral dogs + the old dog (orchard chain
  stages; dogs bolden in Winter), monkey troop + the big male mini-cap
  (grove; peak Summer/Bon), river rats (weir-reeds), tanuki + badger
  (field-margins; harvest peaks), store rats + marten + THE wolf
  (night-round stages only). GONE: boar, mamushi (T1 concerns —
  Kihei's bestiary line only), `wolf_scripted`, the grindable lean wolf.
  Bandit stays `minTier: 2` — and **M `src/scripts/verify-content.ts`**
  gains the guard: any human-archetype foe must carry `minTier >= 2`
  (the bible's no-human-combat-in-T0/T1 hard lock, promoted from norm to
  gate).
- **M `src/core/content/quests.ts`** — the four satoyama quests deleted;
  new: `first_night_round` (the quest form of the first round),
  `orchard_chain` (staged dog fights → reclamation unlock),
  seasonal-defense quests (grove raids at Summer/Bon, margin raids at
  harvest, reed rats vs the leased screens). Token grammar (`kill:*` /
  `gather:*`) survives; `progress-events.ts`/`quest-engine.ts` untouched.
- **M `src/core/content/crafting.ts`** — material drops re-derived
  (hides, recovered produce, bamboo); recipes keep carrying-pole/axe/yari
  fiction (the carrying pole is origin-true — Tahei was a porter; KEEP).
- **D** in `src/core/intents.ts`: the `face_wolf` case +
  `applyScriptedWolf` in `src/core/combat.ts`/`fight.ts`; **D** the
  `verb-face-wolf` surface. The wolf lives only inside the R3 round.

**G4.4 · Cast at nodes.**
- **M `src/core/content/people.ts`** — the full cast↔node registry
  (presence predicates now take `{ dayOfWeek, season, rung, flags }`):
  Genemon@forecourt (the window/board), Kihei@drill-yard +
  gate-at-watch-change, Sōan@sickroom + weir-on-rounds, O-Hisa@kitchen,
  Shinnosuke@kitchen(board)/drill-yard(wall)/grove, Toku@shrine
  corridor, **Yohei@gate on market days only** (day-of-week predicate),
  O-Yae@kitchen by day, Matsuzō@weir on the lease day, **Iori@gate in
  New Year + Bon** (season predicate), O-Ume@field-margins,
  Rokusuke@paddies. Naoyuki/Munemasa are BEATS, not people entries
  (two-touch / a voice through a wall).

**G4.5 · The coin lanes (embeds the economy docket-ADR shape;
magnitudes SIM-OWNED, ADR-132).**
- KIND lane (soft-capped, not truly unbounded — see the "Economy spec"
  block): labour pays rice/goods into the kura; combat drops materials
  only (G4.3 deleted `coinReward`); consumables run on kind — food,
  rest, dog rice, mending thread.
  - **⚑ Rice is measured kura-units (ADR-163) — see the Economy spec block
    for the full model.** G4.5's slice: rice flows through the wage/market
    lanes as measured units (shō/bale/koku); the nengu / debt / lease sinks
    wire to content here; `banked` = house stores. The rice-unit state + the
    production pool + consumption + spoilage are G1's slice. Magnitudes
    sim-owned (ADR-132).
- MON lane (bounded): **C `src/core/wage.ts`** — the day-wage is FIXED
  PER GAME-DAY WORKED, from R5 (`WAGE_START_RUNG = 'R5'`,
  `DAY_WAGE_MON` seed sim-owned): a day counts if ≥1 timed labour act
  completed that day; **collection RESOLVED (ADR-163):** a tactile
  **collect-at-the-board verb** (he is handed the coin; autoplay learns it),
  NOT auto-credit — the daily-vs-weekly cadence is just a ×7/÷7 scalar on
  the amount.
- **M `src/core/content/market.ts`** — becomes Yohei's stall:
  `marketDays: DayOfWeek[]`, `vendorPurse` finite PER VISIT (he stops
  buying when it's empty — the kind-overflow cap, Open question #4),
  `stock` re-keyed PER SEASON (one straw coat this winter — scarcity
  pulls the wheel), `buys:` whitelist (rice + named goods only; raw
  materials are NOT sellable in T0 — overflow feeds house stores).
- **M `src/core/intents.ts`** `sell_rice`/`buy_item` — purse/stock/
  market-day clamps; deposits reframed as **house stores** (the
  barn-filling law: deposits raise HOUSE stores + bank deeds + feed the
  nengu arithmetic's fiction — one-way at T0; Open question #5).
- Payment-ladder reveal schedule: meals R0–R1 → rice R2–R4 → the mon
  day-wage R5–R6 → the house's purse R6–R7; `readout-coin` re-staggers
  to the R5 wage beat (every coin-adjacent surface — market panel,
  repair fee, belongings buys — re-staggers with it or the early game
  strands verbs).
- Recurring mon sinks: dog rice (if the dog stays), offerings, thread,
  sickroom bills once waged (G3's hook).
- The debt: stage 1 = R1's beat names it sideways (content only);
  stage 2 = the lease day + nengu scenes (felt, never numbered — NO
  debt panel, NO number anywhere in T0); stage 3 is T1 — a flag-name
  seam only (`debt-named`, `lease-day-seen`, `nengu-reckoned`).

**G4.6 · The ladder, requirements, surfaces.**
- **M `src/core/content/ranks.ts`** — the 8 rungs rewritten: R0 the man
  from the weir · R1 the day-hand · R2 the yard-hand · R3 the
  grain-watch · R4 the pupil · R5 the accused · R6 the trusted hand ·
  R7 the named hand (titles + kanji + granters: R1/R6/R7 GENEMON — the
  lord is never met in T0; R4 Kihei; R5's "granter" is the Count scene
  itself; R3's beat is the round). `eligible` pools + `rewardOnReach`
  unlock lists re-derived (drill yard opens at R4 as Kihei's need —
  combat reveal moves one rung from today's R3; seasons readout at R2;
  the night-round post at the gate for R2→R3; the wage at R5).
- **M `src/core/content/surfaces.ts`** — the unlock schedule rewritten;
  ALL old-canon TS-string prose constants DELETED
  (`MACRO_TEASER_REVEAL`, `FRONTIER_BEAT`, `DREAM_2`, the
  omoya/workshops/granary/study rows, "the four seasons" clock line) —
  replacement reveal prose lives as `flavor.md` KEYS (FB-5: prose in
  markdown, not TS), sourced from the SUPPLEMENTAL wave (reveal lines
  are known-uncovered item 4 of the G0 inventory — `f2-texture.md`
  does not carry them).
- **M `src/core/content/estate.ts`** — the U1–U4 kura-works coin ladder
  (long-house/crest/shinden framing) replaced by bible-shaped
  repair/reclamation projects: mend the weir screens · reclaim the
  orchard · the granary past this-winter's need; `estateStage` +
  ADR-145's staged E0→E1 build survive re-fictioned; the `native
  estate-u1`-style requirements follow.
- **M `src/core/content/home.ts`** — re-site to the Woodshed (his
  corner: a mat, a chipped bowl); `HOME_REVEAL_LINE` + belonging blurbs
  from the wave; O-Hisa's mended-things beat hooks (later rungs).
- **M `src/core/ascension.ts`** — gate survives (standing grind opens at
  R7; top grade at a season exit unlocks the manual ceremonial ASCEND,
  New-Year-themed if timed there); ceremony content from the wave; the
  boon shape re-checked against the economy docket-ADR.
- Side-beats + mysteries wired through G2's scene machinery: the grove
  DECIDE, the first Bon (assigned nothing), the lease day, the dog that
  stays (DECIDE → `state.dog` minimal entity: present flag + dog-rice
  upkeep sink + the new-moon bark log line off `lunarPhase()`), the
  crest question. Prose law §0.5.7 binds every DECIDE (no morality
  dial) — already satisfied by the authored takes; the executor never
  edits option semantics.

**G4.7 · The speaker-label ladder.**
- **M `src/core/content/voices.ts`** — `PLAYER_SPEAKER` const becomes
  **`playerSpeaker(state): 'You' | 'Nameless' | 'Gonbei'`** — flag
  `label-nameless` (set by the cold open's forced name-question beat,
  witnessed, Sōan's scene) then `label-gonbei` (set by the R7
  promotion). **M every call site** in `src/core/intents.ts` (6+ uses)
  and the render nameplate path. History never rewrites: log lines keep
  the label they were emitted with (already durable strings).

**G4.8 · Autoplay, fixtures, sim.**
- **M `src/core/autoplay.ts`** — `focusedOptimalIntent` learns the whole
  new arc: cold open → rake/haul → R1 → the R2 task → the first night
  round (R3) → confession + drills (R4) → the Count (R5) → the errand on
  a market day (R6) → the nengu year → R7 → Phase-2 standing →
  ascension. It must advance seasons, play rounds, collect the wage,
  and survive the sickroom path.
- **M `src/fixtures/specs.ts`** — every waypoint + rung-start fixture
  re-derived by the REAL engine from seed 20260626 (satoyama walks,
  the wolf stop, and Tokubei framing all die); `pnpm run fixtures:regen`;
  the DEV Scenarios tab + `__qa.loadFixture` + `?fixture=` names update.
- **M `src/sim/`** personas/envelopes; `pnpm run gen:docs` regenerates
  `docs/content/t0-content.md`; the pacing bands re-baseline (ADR-132
  verdict; the ADR-133 ratio band must HOLD).

**G4.9 · Render sweep + tests-green.**
- **M `src/ui/render.ts`** — the day-book reframe (the log IS the house
  journal — kernel #6; channel headers/voice per ui-design.md), season
  wheel + "end the season" affordance post-R2 (day-of-week only
  before), the night-round runner surface, the sickroom treatment pane,
  Yohei's stall pane (market day + purse + season stock legible —
  TST4), the nengu/lease/Bon scenes through the one VN modal, bestiary
  updates (Kihei's mamushi line), VOICE_COLOR/SEAL rows for the new
  cast.
- **M `src/scripts/prd-drift.ts`** — the renames land in this worktree,
  so the drift scanner learns them in the same landing series (the docs
  plan's A5/HD-27 gate ASSUMES these entries exist — this step makes
  that assumption true): the `RETIRED` table grows
  `tokubei → yohei` · `shigemasa → munemasa` · `tōzō`/`tozo` (retired —
  T1's smith is Tetsuji) · `osen` (void) · `yagōemon → mohei` ·
  `satoyama` · `asagiri` (the village is unnamed — HD-27); existing
  successor chains RE-POINT (`munenori`'s successor `shigemasa` →
  `munemasa`).
- Rewrite the content/engine test files alongside their registries (the
  full sweep, all in `src/core/` + `src/core/content/`):
  `map.test.ts` (ceiling derives from the sheet roster minus its
  activity chips — the G4.2 rule) ·
  `quests/market/people/voices/coldOpen/intro/dialogue/log-content/
  requirements/crafting/timing/estate-reveal` content tests ·
  `m1/m2/economy/pacing/breadth-arc/rung-beats/intro-flow/
  dialogue-tree/combat-rework/combat-reveal/discovery/home/pillars/
  ascension/scaffold/engine/log` tests — every fixture derives from
  source-of-truth constants (`rungThreshold`, `balance`, the registries
  themselves), NEVER copied magic numbers; every test must be able to
  go RED (the ambient rule, ADR-086..088).

**Landing:** green under the FULL roster inside the worktree →
cherry-pick/re-commit onto `main` as a short pathspec'd series → push →
remove the worktree. The `gen-prd-regions` note from "Seam mechanics"
applies at this moment.

**DoD (the ADR-088 tier gate — Plan A transcribes these names into the
roadmap milestone's DoD):**
- **`src/core/t0-arc.test.ts`** — the FULL-ARC E2E: one seeded run from
  the weir cold-open through every rung (incl. the silent R2, the R3
  round-wolf, the Count, the nengu-reckoned Autumn, R7 Gonbei + the
  first dream), through Phase-2 standing to ascension — asserting the
  design levers at each gate (rung reqs met by the real mechanism, the
  wage starting at R5 and collected at the board, **the diminishing-returns
  lever — a site's later labour in a season yields less than its first**, the
  season count ≥ a full year), not collapsed metrics.
- **`src/core/invariants.test.ts`** — the tier invariants: labour never
  reduces HP · combat drops never contain coin · no human foe below
  tier 2 · the season wheel only advances by intent · Autumn never exits
  unreckoned · the speaker label is monotonic You→Nameless→Gonbei · the
  debt is never numbered in T0 state/log · `wolf-survived-not-won`
  survives `ascend` · **rice is held only in the kura, never in the carried
  pocket — so a defeat bleeds carried coin + goods but NEVER rice**
  (ADR-163/164) · **HP never rises without a deliberate act** (treatment or
  manual rest; no ambient auto-trickle — ADR-164) · **every rung-up enqueues a
  VN scene** (all 8 rungs, incl. R2's silent-content beat — ADR-165).
- Full verify + `verify:balance` green on `main`; `balance:report` run;
  the regenerated `docs/content/t0-pacing.md` + `t0-content.md` +
  `t0-story.md` committed with the landing; sim summary in the commit
  body; `project/telemetry/` read first (FB-8 — quote attended-vs-sim
  for touched rungs if untainted reports exist).

**Verify:** `pnpm run verify && pnpm run verify:balance &&
pnpm run balance:report && pnpm run fixtures:check &&
pnpm run gen:narrative:check`.

### G5 · VERDICT reconciliation — one version, picks complete in the sources

**Goal (rewritten to the 2026-07-08 one-version ruling; Plan A's A0
docket carries the ADR):** every unit's VERDICT pick — including the
u8/u9 per-piece mixes and every VERDICT's required redlines — is fully
migrated into the live narrative sources. The judge's pick IS the
canonical text; there is NO switcher work, NO `takes/` bundles, NO
live-swap wiring, and NO `rung:` bundle-meta key (all cancelled by the
ruling). G4.1 did the bulk migration inside the worktree; G5 is the
unit-by-unit completeness audit on `main`, plus the late arrivals.

**The pass:**
- Per unit (u0–u9 + `flavor/`): diff the live sources in
  `src/core/content/narrative/` against the unit's VERDICT.md — the
  pick fully present, placed where the VERDICT says (VERDICT picks
  define migration placement; there is no separate manifest): the u8
  side-beat pieces per its C+A graft map into `scenes.md`; the u9
  per-character mix into `dialogue.md`; the flavor sheets with their
  required redlines into `flavor.md`.
- Apply any VERDICT-required redline G4.1 missed — a redline is the
  judge's ruling transcribed verbatim, never executor fiction.
- Supplemental-wave picks (the G0 HD-item's units) migrate here as
  they land, same shape: pick + redlines into the canon `.md`s.
- The alternates stay in `t0v2/` as the on-disk archive — byte-
  untouched, NOT wired anywhere. A human swap request arrives as a
  redline (an edit to the picked take's canon `.md`), never a toggle.
- Run `pnpm run gen:narrative`; commit sources + `*.gen.ts` +
  `docs/content/t0-story.md` together.

**DoD:** a per-unit reconciliation checklist (unit → VERDICT pick →
live-source location → redlines applied) in the journal + commit body;
zero new `takes/` bundles; `t0v2/` unchanged; prod renders exactly the
picks.
**Named tests:** none new — the teeth are G4.9's rewritten content
tests (coldOpen/rung-beats/dialogue/etc. pin the canon) plus the
`gen-narrative` gate; the reconciliation itself is a text-level PH2
audit recorded in the checklist. (The ruling voids the old switcher
test machinery — deliberately none is built.)
**Verify:** `pnpm run verify && pnpm run gen:narrative:check`.

### G6 · e2e, QA harness, and the drift sweep

**Goal:** the non-verify-lane test surface catches up; no old-canon
residue survives.

**Files:**
- **M `e2e/journeys.spec.ts`** — "Speak with Tokubei" → the Yohei stall
  journey (drive the clock to a market day via `__qa`); the market loop
  asserts purse/stock clamps.
- **M `e2e/mobile-journey.spec.ts`** — "Face the wolf" → the first
  night round from the fresh-R3 fixture (begin at the gate post → the
  wolf stage → survived-not-won lands the rung).
- **M `e2e/persistence.spec.ts`** — the clean-break path: seed an
  old-generation blob into storage → the retirement notice renders
  composed → fresh start → the backup key survives.
- **M `e2e/desktop-layout.spec.ts` / `mobile-layout.spec.ts` /
  `timed-actions.spec.ts` / `e2e/helpers.ts`** — text assertions
  re-anchored to the new UI copy (assert REAL rendered text).
- **M `src/app/main.ts` + `src/ui/dev-cheatlist.ts`** — `__qa.toRung`
  (`main.ts:470`; `loadFixture` at `:613`) rides the rewritten autoplay
  (already true after G4.8 — likely nothing to edit); NEW cheatlist
  entries for `advance_season`, `begin_night_round`, the wage (the
  entries touch `dev-cheatlist.ts` + their `main.ts` wiring).
- **The drift sweep:** repo-wide grep for `Tokubei|Shigemasa|Tōzō|tozo|
  Yagōemon|Oyuki|Okimi|Osen|satoyama|face_wolf|wolf_scripted|
  DAYS_PER_SEASON` across `src/`, `e2e/` — zero hits (comments
  included; historical docs exempt per ADR-140 scope). Porter fiction
  is deliberately NOT in the sweep: it's origin-true (Tahei was a
  porter — G4.3 KEEPs the carrying pole), and the OLD cold-open
  "porter's knot" dream lines die mechanically when U0's pick
  regenerates `coldOpen.gen.ts`/`intro.gen.ts` at G4.1 — a grep leg for
  them would be a check that can't go RED (PH3).
- Run the ADR-151 leftovers: the real zone→rung reveal table locked
  (done G4.2 — re-verify against the shipped ladder), a QA screenshot
  pass (`capture-game-states` flow) into `project/audit/screens/`.

**DoD:** `pnpm run test:e2e` green on both profiles; the sweep greps
clean; screenshots reviewed against `ui-design.md` by the executor's own
vision (PH5 — the human is the final arbiter, post-ship).
**Named tests:** the five e2e specs above (each asserts text that could
only exist post-rewrite — RED against the old build by construction).
**Verify:** `pnpm run verify && pnpm run test:e2e`.

### G7 · SHIP (human-initiated — never agent-initiated)

**Goal:** the rewritten T0 replaces the shipped game; the clean break
reaches players with its notice; the ship signal is readable from disk
(the docs plan's A5 gate reads it).

**Steps:**
- Pre-ship checklist: full verify + `verify:balance` + e2e green;
  `pnpm run build` clean; the fiction-gap HD-item CLOSED (no
  placeholder prose can ship — PH1/PH5); the taste-scorecard Pass-2
  filed for the reshaped surfaces; fresh-eyes self-playtest of the whole
  arc via the MCP harness.
- **M `CHANGELOG.md`** — the release section (the T0 rewrite, the
  six-season calendar, the night rounds, the clean break called out
  plainly for players).
- **M `package.json`** — version bump **via `/ship` only** (the skill
  does `pnpm pkg set` → pathspec commit → `git tag vX.Y.Z` → gh-pages;
  never `pnpm version` in this shared tree). Version semantics: Open
  question #1 (default v0.4.0).
- Post-ship: notify Plan A (its final milestone removes the PRD §5
  banner + runs the closing `prd:drift`).
- **Close HR-8 as moot** (human ruling 2026-07-07, noted on the item at
  `project/human-in-the-loop/review.md:241`): the shipped new prose
  voids the old rung-up-cast/R0→R7-beats read — graduate HR-8 to a
  one-line row in `project/human-in-the-loop/archive.md` (Reviews
  section) per that dir's lifecycle.
- **Emit the disk-readable ship signal — BOTH, explicitly** (the docs
  plan's A5 "Plan B shipped" gate is exactly these two artifacts):
  (1) flip THIS plan's Status line to ✅ DONE and archive it to
  `project/archive/` via the checkpoint ritual; (2) the `CHANGELOG.md`
  release section (the M above) committed with the release.
- Any human review of the shipped story happens against the LIVE game
  as the one version; a swap request is a redline edit to the canon
  `.md`, never a toggle (the 2026-07-08 ruling).

**DoD:** tagged release live on gh-pages; `verify-changelog` green;
CHANGELOG section present; this plan archived with Status ✅ DONE; HR-8
in the archive table; the human pinged.
**Verify:** `/ship` (human-invoked) + green `origin/main`.

---

## Open questions for the human — ✅ RESOLVED (2026-07-08 walkthrough)

**All 13 ruled** in the human's live walkthrough (2026-07-08). Full record +
the soft-cap map:
[`project/brainstorms/2026-07-08-storywave-economy-decisions.md`](../../project/brainstorms/2026-07-08-storywave-economy-decisions.md);
the three that needed ADRs are **ADR-163** (economy), **ADR-164** (body),
**ADR-165** (rung-up VN). Magnitudes stay sim-owned (ADR-132).

**Rulings** (⚑ = overrode the executor's default):
1. **v0.4.0** — a milestone, not feature-completeness.
2. Retire `ezu` whole — the sheet is the one map (zone seals get button/aria).
3. ⚑ Wage = a **collect-at-the-board verb** (not auto-credit); cadence a
   ×7/÷7 scalar (ADR-163).
4. Yohei's finite purse caps mon; **raw materials not sellable** in T0;
   overflow → house stores + crafting (ADR-163).
5. `banked` reframed **AS house stores** — one-way barn-filling, no withdrawal
   at T0 (ADR-163).
6. ⚑ **Every rung-up opens a VN**; R2's content is silent/narration, not a
   no-modal path (ADR-165).
7. Chiyo: nengu + board ambient only, no granter beat.
8. ⚑ Defeat **keeps the carried-loss bleed** (coin + carried goods; rice is
   safe in the kura) (ADR-164).
9. HP-mend split: **treatment** (mon) + a **manual "rest at sickroom"**
   trickle; **no auto-trickle**; food is satiety-only (ADR-164).
10. Keep all five bible-unmentioned systems, re-fictioned.
11. Delete the old `estate-build-beats` bundle (superseded); the NEW estate
    beats **re-diverge** via the supplemental wave (G0 item #6).
12. Retirement notice ships with a bracketed `[dev]` placeholder (prod gated
    at G7).
13. `readout-seasons` = a **new surface row** unlocking at R2, beside the
    kept day-of-week clock.

**⚑ NEW SCOPE surfaced in the walkthrough** (the milestone bodies below
predate it): **soft caps** as the economy's self-balancing principle, and
**rice as a measured commodity held in the kura** (shō/bale/koku), never a
pocketed integer — with the **finite-seasonal-pool + diminishing-returns**
anti-grind loop, its sinks (consumption/spoilage/nengu/debt/seed), and
**progress measured in deeds**, not rice. This re-models rice across G1
(balance re-key) / G3 / G4.5 — see ADR-163. The affected milestones carry an
inline note; a scoping pass over them is wanted before build.

---

_The original proposal's detailed forks (options + defaults) are preserved
below for reference; the rulings above are canon._

### Open questions — original proposal (reference)

Each fork: options → the executor's default → what changes if overridden.

1. **Version semantics — v0.4.0 vs v1.0.0.** Default: **v0.4.0** — the
   T0 rewrite is a milestone on the road, not feature-completeness; the
   ladder to 1.0 stays honest. Overriding to 1.0 changes only the /ship
   invocation + CHANGELOG framing.
2. **The old walkable-map render (`map-variants/ezu.ts`) vs the ADR-151
   sheet.** ADR-151 says the node-graph UI "retires (or survives only as
   an accessibility fallback)". Default: **retire it whole** (TST1 — one
   home; the sheet's zone seals get real button/aria semantics instead).
   Override: keep ezu behind a settings pref as the a11y/reduced-motion
   fallback — adds a second map home to maintain forever.
3. **The day-wage collection moment** (human-flagged open problem b).
   Default: **auto-credit at day rollover** — one day-book log line, no
   friction against auto-actions; the "counted into his hand" fiction
   plays as the R5 beat, not per-day. Alternatives: a collect-at-the-
   board verb (tactile, but auto-play must learn it and idle players
   strand wages) or season-exit payday (big-number drama, but starves
   mid-season mon sinks). Sim-check whichever is picked (ADR-132).
4. **Kind-lane overflow sinks/caps** (human-flagged open problem a).
   Default: **Yohei's finite per-visit purse is the cap, and raw
   materials are simply not sellable in T0** — his `buys:` whitelist
   covers rice + named goods only; overflow becomes house-stores
   deposits (deeds + flavor, no coin) and crafting inputs. Override
   (generic `sell_goods` for everything): needs its own caps or the mon
   lane inflates — resolve with the sim before building.
5. **House stores vs the player's `banked`.** Default: reframe `banked`
   AS the house stores — deposits are one-way barn-filling at T0 (bank
   deeds, feed the nengu fiction; no withdrawal verb at T0; the player's
   own keeping is carried + the woodshed chest). Override (a second
   parallel ledger) doubles storage UI for the same fiction.
6. **The R2 "silent rung" beat shape.** Default: a **narration-only
   promotion beat** — no granter modal; the promotion lands as day-book
   narration + the seasons readout reveal ("a man counts days again when
   he has a future"). Override (a minimal VN frame) costs a scene the
   bible pointedly leaves silent.
7. **Chiyo's T0 scene budget.** Built-game Chiyo was the R6 granter;
   the bible keeps her at the board/nengu with the purchased-loyalty
   read and gives R6/R7 to Genemon. Default: **she appears in the nengu
   scene + board ambient dialogue only** — no granter beat. Override
   needs new prose (a wave request, not executor fiction).
8. **The defeat carried-loss bleed.** Today a loss bleeds carried
   coin/rice/materials. Default: **retire the bleed** — the bible's cost
   is days + wages + Sōan's ledger (and the bill once waged); double-
   charging muddies the two-lane reading. Override keeps a small bleed
   as texture — sim-check the difficulty curve either way.
9. **Sickroom treatment vs meals (the HP-mend split).** Default:
   **treatment is the big-injury mend** (post-defeat and low-HP states;
   costs mon once waged, else a day) while food stays satiety-only and
   rest stays the slow ambient HP trickle. Override (food heals HP)
   blurs the two body economies the bible just separated.
10. **Shipped-T0 features the bible never mentions.** Defaults, per
    system: **skills registry** (farming/foraging/woodcutting/
    conditioning) — KEEP; conditioning's danger-ring fiction died with
    the satoyama, so it re-fictions as drill-yard/night-round readiness.
    **Crafting** — KEEP (bible: "crafting-lite", carrying-pole
    origin-true). **Belongings/home comforts** — KEEP, re-sited to the
    Woodshed. **The lacquer discovery** — KEEP at the woodlot.
    **Attribute points / ascension boon shape** — KEEP pending the
    economy docket-ADR review. Anything the executor finds beyond these
    that the bible neither names nor contradicts: keep + re-fiction via
    the wave, and note it in the journal; if it CONTRADICTS the bible,
    HD-item.
11. **The old `takes/estate-build-beats/` bundle.** It diverges
    old-canon estate beats the rewrite voids. Default: resolve its open
    HR-item as superseded and delete the bundle at G4.1. Override: keep
    it wired until its own sign-off — costs a stale bundle in the
    Story pane.
12. **The retirement-notice interim (G1, until the supplemental wave
    lands).** Default: the notice FRAME ships with a deliberately
    out-of-fiction bracketed placeholder ("[dev — save retired; …]") —
    never ad-hoc fiction-voiced prose; prod is protected by G7's
    fiction-gap-closed gate. Override: hold the notice UI itself until
    the wave's text lands — couples the persistence break's landing to
    prose delivery for no player-visible gain (prod ships at G7 either
    way).
13. **`readout-seasons`: a new surface vs renaming `readout-clock`.**
    Default: a NEW **C** surface row unlocking at R2, beside the kept
    day-of-week `readout-clock` (two facts, two reveal moments — TST4).
    Override: absorb the season line into a renamed `readout-clock` —
    one fewer surface row, but the R0-visible clock then owns an
    R2-gated reveal inside itself.
