---
name: kami-architecture-contract
description: >-
  The load-bearing architectural invariants of kami-kakushi and the
  known-weak seams. Load BEFORE designing, reviewing, or refactoring
  anything in src/ — especially when: touching src/core at all; asking
  "where does X live" / "can this module import that"; adding a pass to
  the reduce tail (finish()); adding an RNG stream or touching rng.ts;
  tempted to store a derived value (visibility, forecasts, log prose)
  in GameState; editing anything named *.gen.ts; adding CSS or
  reordering styles.css imports; adding a DEV tool or wondering how
  prod stripping works; a change compiles but "feels like it fights
  the structure"; or reviewing a co-agent's diff for architectural
  drift. Covers: the 15 invariants (pure core, one RNG, AC-6, AC-20,
  derived visibility, descriptor log, finish() ordering, DEV/PROD
  strip, RICE/COIN/KOKU, requirements-not-points, …), the
  state→intent→reduce→render flow, the subsystem map with import
  rules, and the known-weak seams.
---

# kami-architecture-contract

This repo's costliest failure class is slop: drive-by additions that
compile, pass gates, and quietly fight the structure — a stored flag
where a derived predicate belongs, a second helper home, a forecast
that drifts from the reducer. The contract below is what "fits the
architecture" MEANS here. Every row is anchored to its record
(ADR-nn / FB-nn / AC-nn — see kami-domain-reference for the glossary)
because in this repo a rule without its story reads as arbitrary and
gets re-litigated.

PH2 applies to this file too: where a cited line has moved, the code
wins — re-verify with the commands in Provenance before relying on a
line number.

## 1. The invariants

The scan index (each # detailed in its block below — the prose
moved OUT of the table cells per the repo's own wide-table norm):

| # | Invariant | Enforced by |
|---|---|---|
| 1 | Pure core | `oxlint` gate |
| 2 | One seeded RNG, frozen salts | oxlint + salt-freeze norm |
| 3 | AC-6: preview = the action's own fn | norm + export comments |
| 4 | AC-20: acyclic core via shared glue | norm + glue headers |
| 5 | Visibility DERIVED, never stored | architecture (field gone) |
| 6 | The log is a derived VIEW | `log-keyless.test.ts` GATE |
| 7 | `finish()` pass order | norm |
| 8 | Timed-action taxonomy is total | TypeScript totality |
| 9 | Active-only clock, no catch-up | unit-asserted fold |
| 10 | Render split; cascade = import order | structure + header law |
| 11 | DEV/PROD two-axis strip | test matrix + strip script |
| 12 | Fixtures GENERATED, never authored | `fixtures` gate |
| 13 | RICE / COIN / KOKU never blur | type structure + sim bands |
| 14 | Requirement LISTS, not points | `gen-narrative` gate |
| 15 | Story .md → generated registries | `gen-narrative` gate |

**1 · Pure core.** No DOM, no clock, no `Math.random`/`pow`/
transcendentals (only `Math.sqrt`), no `Date`/`performance`/`window`
in `src/core`; imports one-directional — core never imports
ui/app/persistence; consumers import ONLY `src/core/index.ts`
(index.ts:1-3).
- Why: deterministic, unit-testable logic — the project's top
  architectural rule. Violated → sim + fixtures + replay all lie.
- Record: ADR-013, ADR-038, ADR-130; PRD §6.1/§6.2.
- Enforced: `oxlint` gate — `.oxlintrc.json` src/core override:
  restricted globals (:27-95), Math bans (:97+),
  `no-restricted-imports` (:215-232).

**2 · One seeded RNG.** splitmix64 over named streams
(`combat/loot/seasonal/worldgen/discovery`); stored cursor is a
plain draw-count int; `STREAM_SALT` constants are FROZEN — "never
change these or saves replay differently" (rng.ts:29-31). New
streams are additive-safe; renames/reorders are not.
- Why: full determinism/replayability. Violated → saves stop
  replaying; every sim/pacing number becomes meaningless.
- Record: ADR-038, ADR-043, D-013a.
- Enforced: oxlint bans `Math.random` in core; the salt freeze is a
  norm carried by the file comment.

**3 · AC-6: derived feedback routes through the SAME core fn the
action uses.** `mcCombatStats` feeds the real fight (fight.ts:113)
AND the forecast; `sleepForecast` — "the reducer AND the hover read
THIS" (index.ts:390).
- Why: preview/reality drift = the player sees lies (TST4).
- Record: AC-6; ADR-091, ADR-187.
- Enforced: norm + review; the export comments name it.

**4 · AC-20: acyclic core via shared glue.** Cross-cutting concerns
fire as `'<verb>:<subject>'` tokens through `applyProgressEvent`
(progress-events.ts:49), fanning out to quests + rung requirements —
never a reducer→reducer call. `core/reveals.ts` is the same glue
shape for VN zone-reveals.
- Why: keeps the core dependency graph acyclic. Violated → import
  cycles; concerns become order-coupled.
- Record: AC-20; ADR-137, ADR-184.
- Enforced: norm; the glue modules' headers (progress-events.ts:1-5,
  reveals.ts:1-4).

**5 · Visibility is DERIVED, never stored.** `visibleSet(state)`
(unlock.ts:46) = pure fn of latched FACTS (`rank-rN` flags etc.);
predicates MONOTONE — a visible surface never vanishes (TST2).
`seenReveals` is an announce-ONCE ceremony latch, NEVER read for
visibility (unlock.ts:1-7).
- Why: the human loaded an old save — "the tabs visible to me are
  based on the save file … not the actual game"; six-plus
  per-surface back-reveal patches had accumulated.
- Record: ADR-179 (built; `state.unlocked` deleted, v10→v11
  migration).
- Enforced: architecture (the field is gone); norm on new
  predicates.

**6 · The log is a derived VIEW.** Saves store descriptors
(`contentKey` + params), never prose; `renderLogLine` in
`core/content/log-render.ts` is "the ONE place a stored log
descriptor becomes prose" (log-render.ts:1); one story overlay
(`story-overlay.ts`) sits in front with canon fallback.
- Why: the log was 86-97% of every save as frozen prose — "reword a
  line in src/ and every existing save kept showing the OLD words,
  forever".
- Record: ADR-186, ADR-198.
- Enforced: GATE — `log-keyless.test.ts`: prose reaching a save =
  RED, an unresolving key = RED (its header: the human ruled this
  "a GATE, not a norm").

**7 · `finish()` pass ORDER is load-bearing.** The reduce tail
(intents.ts:223) is
`announcePass(triggerFlagScenes(settleRequirements(revealsPass(worksPass(state)))))`
(:237-238): works/reveals run FIRST so a flag latched this tick is
seen by the same tick's flag-scene pass.
- Why: the comment block at intents.ts:228-236 records the
  reasoning. Violated → a same-tick latch misses its scene enqueue;
  beats silently skip.
- Record: ADR-184 context.
- Enforced: norm; a new pass must re-derive the ordering argument.

**8 · Timed actions: core owns duration DATA, shell owns the
CLOCK.** Every action is TIMED or declared INSTANT — "the taxonomy
is total, so an unclassified action is a COMPILE error"
(timing.ts:1-10); the sim converts action-counts→seconds through
the same table (AC-6).
- Why: UI-theater durations would be invisible to sim/balance.
- Record: ADR-148, refined ADR-174.
- Enforced: TypeScript totality in `core/content/timing.ts`.

**9 · Active-only clock — NO offline catch-up.** `tick` folds ONE
tick at a time so `tick(s,a+b)===tick(tick(s,a),b)` (step.ts:1-5);
"active" = tab-ALIVE, not tab-visible (ADR-174). Warning: signed
ADR-053 once described the OPPOSITE of the build — the doc was
fixed, the build won (seeded PH2).
- Record: ADR-013 → ADR-079 → ADR-174.
- Enforced: unit-asserted fold associativity; the app loop computes
  dt from active time only.

**10 · Render split (ADR-196 §6).** `render.ts` = shell over
`src/ui/render/` (one `create<X>View(ctx)` per surface, `mount()`
at render.ts:474); `dev.ts` = shell over `src/ui/dev/`;
`styles.css` = pure `@import` index whose ORDER IS THE CASCADE —
never reorder (styles.css:1-8).
- Why: render.ts hit 6.7k lines / 183 commits; 13% of sessions hit
  hard git collisions.
- Record: ADR-196, ADR-199.
- Enforced: structure + the styles.css header law; norm.

**11 · DEV/PROD is a two-axis strip.** Build axis: `__DEV_TOOLS__`
vite define. Runtime axis: `resolveDevGating(isDev, hasTools,
search)` (dev-gating.ts:31-44) — PURE so its full truth table is
unit-tested; that test is the RED-able proof prod is default-inert
(a grep can't prove behavior). Bundle proof: `verify-dev-strip.sh`
greps dist for CLIENT_MARKERS vs SERVER_MARKERS (:37, :41).
Tree-shaking idioms: ternary-folds-to-undefined (main.ts:305-306),
type-only imports, lazy registries.
- Why: T0 deliberately ships DEV tools default-OFF (`?dev=yes` opts
  in); server-coupled tools (telemetry, capture) must NEVER ship.
- Record: ADR-138.
- Enforced: `dev-gating.test.ts` matrix + `verify-dev-strip.sh`
  (gh-pages deploy + CI nightly).

**12 · Fixtures are GENERATED, never hand-authored.** `specs.ts`
drives the REAL engine via `reduce` — "NO state surgery: no field
pokes, no forced flags" (specs.ts:58-60); `expect` asserts STABLE
invariants, never exact numerics (:62-65).
- Why: "reproduce X" must equal "load X, look" — hand states drift
  from the engine.
- Record: FB-6.
- Enforced: `fixtures` verify gate byte-compares (gates.ts:41-45);
  gen runs `expect` and fails loudly.

**13 · Economy nouns never blur: RICE / COIN / KOKU.** Carried
pocket = COIN + goods ONLY, NEVER rice — rice lives in the kura
(`banked`), state.ts:132-140; KOKU is House STANDING — deed-earned,
never spent, never wealth-coupled.
- Why: the flattened single-koku economy "inverted koku's meaning".
  Violated → fiction flattens; wealth buys standing (forbidden).
- Record: ADR-107/108/109, ADR-118, ADR-163.
- Enforced: type structure (`resources` vs `banked`) + norm; sim
  bands catch magnitude drift.

**14 · Progression is authored requirement LISTS, not points.** The
flat-points rung meter is dead; rungs tune by editing
`src/core/content/narrative/requirements.md` → `gen:narrative` →
`requirements.gen.ts` (`RUNG_REQUIREMENTS`) — "no balance.ts
mirror" (requirements.ts:7). The old `rungThreshold` export no
longer exists in src/ (only stale comments at balance-sim.ts:61,
telemetry/milestones.test.ts:12; AGENTS.md was synced 2026-07-18) —
derive fixtures from the requirements registry.
- Why: FB-121 — "a random ass number that has to go up".
- Record: ADR-137, ADR-182 (supersedes ADR-024), ADR-183.
- Enforced: `gen-narrative` gate byte-compares the compiled
  registry.

**15 · Story is authored markdown; registries are generated.**
Never edit a `*.gen.ts` — the `gen-narrative` gate byte-compares
and its error names the `.md` to edit. Authoring syntax, line-id
law, takes/bundles: kami-narrative-grammar.
- Why: FB-5 — edits to gen output vanish on regen.
- Record: FB-5, ADR-198.
- Enforced: `gen-narrative` gate (gates.ts:46-50).

## 2. State → intent → reduce → render, one page

1. **State**: one immutable `GameState` (src/core/state.ts).
   Deliberately MINIMAL — derived values recomputed, new per-system
   fields added ADDITIVELY at their milestone, "never pre-declared"
   (state.ts:1-8). Holds: `schemaVersion` (read the live number from
   `SCHEMA_VERSION` in src/core/constants.ts — never hardcode it, a
   co-agent may be mid-bump), the RNG (seed + per-stream cursors),
   clock `{tick, day}`, MANUAL season (ADR-153 — only the
   `advance_season` intent ends one), character vitals, carried
   `resources` vs kura `banked`, flags, `seenReveals`, quests,
   rungReqs, scene queue, descriptor log.
2. **Intent**: every player verb is a member of the typed `Intent`
   union (src/core/intents.ts). `reduce(state, intent)` is a switch;
   an ILLEGAL intent is a NO-OP returning `state` — legality guards
   come first in every arm.
3. **Reduce tail**: every mutating arm ends through `finish()`
   (invariant #7's ordered pass chain) — requirements settle, flags
   trigger scenes, reveals announce.
4. **Glue**: reducers emit progress tokens (`act:rake_rice`,
   `kill:<mobId>`, `gather:<res>`) via `applyProgressEvent`; all
   grants funnel through `applyRewards(state, bundle)`
   (src/core/rewards.ts). A new consumer subscribes to the token
   stream; it never calls another reducer.
5. **Time**: `tick(state, dtTicks)` (step.ts:177-178) =
   `announcePass(advanceClock(...))`, one tick at a time. Day
   boundaries fire consumption/hunger/restock; seasons turn ONLY via
   `advanceSeason` (step.ts:93).
6. **Visibility**: the renderer asks `visibleSet(state)` — never a
   stored list (invariant #5).
7. **App loop** (src/app/main.ts): click → `timedPlayerDispatch`
   (:383 — instant intents dispatch now, timed ones ride the shell
   ActionClock with durations from core timing) → `commit(next)`
   (:420) → `render(state, prev)` + debounced `scheduleSave()`. The
   auto loop is a `setInterval(autoStep, AUTO_REPEAT_MS)` (:518)
   driving `autoModeIntent` from the pure core — the SAME fn the
   headless sim personas consume.
8. **Renderer**: `mount(root, dispatch, hooks, dev?)` (render.ts:474)
   builds the shell once and returns `(state, prev) => void`; ZERO
   game logic, never mutates state (render.ts:1-5).

## 3. Known-weak points — stated plainly

The records themselves admit these. Do not "discover" them as new
findings, and do not paper over them either — each has a named home.

- **Positional `stage.<i>` log keys.** Night-round and estate-stage
  descriptors index by POSITION (log-render.ts:265, :280); reordering
  that content re-points old saves' lines at neighbours, and the
  orphan sensor cannot see it (persistence/README.md:119-121).
  Greetings were fixed by the v11→v12 line-id migration (ADR-195 H4);
  stages remain positional. A restructure there needs a migration —
  see kami-save-and-schema.
- **ADR-183 is canon without teeth.** The T1+ both-tracks rung rule
  has no `track` field in `RequirementDef`/`RankDef` yet —
  deliberately ungated (a vacuous green is worse than none, PH3;
  150.md:1101). Growing the T1 grammar must add the field AND the
  `verify-content` invariant together.
- **The balance sim is SKIP-BLIND by ruling** (ADR-187,
  150.md:1384). A convenience verb the sim doesn't model can't red a
  band — and can't be measured. Named tradeoff, not an oversight;
  don't "fix" it without the human.
- **Mutable DEV lever state lives inside the "pure" core.** Balance
  levers are `let` bindings mutated by `__setBalanceLever`
  (balance.ts:734), plus the story overlay and `__setZoneRevealMode`.
  DEV-only by convention — and vitest runs with `isolate: false`
  (vite.config.ts:318), so a test that sets a lever without
  `__resetBalanceLevers()` (balance.ts:929) leaks into the NEXT test
  file. The config comment says it: if cross-file state leaks, drop
  `isolate: false` first. Full leak mechanics:
  kami-debugging-playbook §1.
- **Balance-report freshness only WARNS at commit.**
  `.githooks/pre-commit:131-133` runs `balance-sim --check-fresh` and
  prints "NOT blocking" on a stale fingerprint. A committed pacing
  report can lag the constants; re-run `pnpm run verify:balance` →
  `pnpm run balance:report` before trusting docs/content/t0-pacing.md
  (generated by src/scripts/balance-sim.ts).
- **No gate replays real old saves.** The migration chain restarts at
  v10 (pre-v10 is a clean break, migrate.test.ts:34-39); steps are
  unit-tested against hand-built old shapes, and the orphaned-id
  sensor runs only on DEV boot (main.ts:162-174). A content-id rename
  that skips its migration ships silently in prod. Recipe:
  kami-save-and-schema.
- **Shared-helper circularity in the render split.** View modules
  import `el`/consts BACK from the shell (e.g. render/market.ts).
  Works today; a new view follows the same pattern rather than
  inventing a second helper home (TST1) — but it is a cycle a
  refactor could trip.
- **tsx-importability is a standing trap.** `dev-surfaces.ts` exists
  APART from dev.ts precisely so a plain tsx gate script can import
  it (dev-surfaces.ts:4-7); same shape as fixtures `specs.ts`
  (tsx-safe) vs `index.ts` (Vite-glob only). Moving gate-read data
  into a Vite-only module breaks gates in a way dev serve never
  shows.
- **`MAP_NODE_CEILING = 16` is a hand-written number** (map.ts:49)
  kept honest only by the map test deriving the sheet-roster count —
  a new zone touches BOTH vocabularies (core map.ts + sheet
  nodes.ts) or the test catches you. Map work routes through the
  `map-sheets` skill, never freehand.

## 4. Subsystem map

| dir | responsibility | import rules |
|---|---|---|
| `src/core/` | THE pure game core: state, reducer, clock, RNG, combat, quests, requirements, selectors | Imports NOTHING from ui/app/persistence (oxlint-enforced). Public surface = `index.ts` only |
| `src/core/content/` | All game data registries: balance (cockpit levers), quests, map graph, surfaces, ranks + the generated `*.gen.ts` | Part of core, same rules; `*.gen.ts` never hand-edited |
| `src/core/content/narrative/` | Prose SOURCE of truth (.md), compiled by `gen:narrative` | Markdown; the gen script reads an explicit target list |
| `src/app/` | Composition root: boot, tick loop, save wiring, crash boundary, ActionClock, DEV gating, `window.__qa` | Imports core + ui + persistence + fixtures + telemetry |
| `src/ui/` | Thin DOM renderer — shell + `render/` per-surface views + `dev/` panel + `styles/` cascade + `dev-surfaces.ts` registry | Imports the core public index; `import type { DevApi }` keeps dev out of prod |
| `src/ui/map-sheets/` | The SVG survey-sheet map engine, golden-pinned | Its README's five laws; entry via the `map-sheets` skill |
| `src/persistence/` | Save codec, migrations, backends, validation, orphan sensor | Imports core. Detail: kami-save-and-schema |
| `src/fixtures/` | Generated scenario-save library (FB-6) | `specs.ts` imports ONLY the core public index; `index.ts` is Vite-only |
| `src/telemetry/` | DEV-only attended-time telemetry (FB-8) | Observes (prev, next) commits; zero core changes |
| `src/sim/` | Headless balance personas driving `autoModeIntent` | Core only. Methodology: kami-balance-analysis-toolkit |
| `src/scripts/` | Verify gates (`gates.ts` = THE roster) + the gen-* family | node/tsx — anything they import must be tsx-safe |

Count gates from the roster, never from a comment (verify.yml's
header once said "15" when the roster held 21 — AC-21 applies to
counts too):

```
grep -c "name: '" src/scripts/gates.ts   # 21 as of 2026-07-18
```

## Corrections to stale text you MAY still meet

(Most 4bfb3ba3-era stale canon was fixed in place 2026-07-18 by
`919c2c61` — AGENTS.md, verify.yml, vite.config.ts. What remains:)

- Visual canon is **Andon Steel** (ADR-127, human-locked 2026-07-04;
  docs/living/ui-design.md + styles.css:1 are authoritative). A few
  old code comments (render.ts:3 "woodblock shell") still say
  woodblock — that bible is git history. Correction owner:
  kami-domain-reference §5.
- `rungThreshold` does not exist (invariant #14 has the evidence —
  only two stale comments remain in src/).
- e2e runs on **5265** (playwright.config.ts:14-18), dev on
  **:5264**. Dev-server law: kami-build-and-env.
- Never hardcode `SCHEMA_VERSION` — read src/core/constants.ts
  (it bumped mid-July while this was written).

## When NOT to use this skill

- Per-gate RED fixes → **kami-verify-gates**. Build/verify/CI/dev
  -server mechanics → **kami-build-and-env**.
- "What files do I touch to add X" step-by-steps →
  **kami-extension-recipes** (this file says what must stay TRUE;
  that one says what to type).
- Save/migration work → **kami-save-and-schema**. Narrative .md
  syntax → **kami-narrative-grammar**. Balance sim/proofs →
  **kami-balance-analysis-toolkit**. Flags/env/URL params →
  **kami-config-and-flags**.
- Symptom-first debugging and the `__qa` surface →
  **kami-debugging-playbook**. Full incident stories →
  **kami-failure-archaeology**. What needs human sign-off →
  **kami-change-control**.
- Existing repo skills own their procedures: `diverge`,
  `narrative-diverge`, `taste-scorecard`, `map-sheets`, `tdd`,
  `write-plan`, `ship`, `prepare-to-exit` — route, don't re-derive.

## Provenance and maintenance

Authored 2026-07-18 from repo state at HEAD `4bfb3ba3` (a talk-system
build was landing that day — line numbers in src/core/intents.ts and
constants.ts are the most likely to drift). Every file:line above was
read in that tree, not copied from a report.

Re-verify the volatile facts:

```
grep -c "name: '" src/scripts/gates.ts            # gate count
grep -n "SCHEMA_VERSION" src/core/constants.ts     # live schema version
grep -n "finish\b" src/core/intents.ts | head -3   # reduce-tail location
sed -n '1,8p' src/ui/styles.css                    # cascade-order law
grep -n "PORT" playwright.config.ts vite.config.ts # ports (e2e/dev)
grep -rn "rungThreshold" src --include=*.ts        # should stay comments-only
```

If an invariant here conflicts with a newer human steer or ADR, the
newer record wins (ADR-022) — update this table in the same commit
you learn that, and cite the new ADR.
