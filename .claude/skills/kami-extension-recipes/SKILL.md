---
name: kami-extension-recipes
description: >
  The "to add X, touch these files in this order" cookbook for
  kami-kakushi. Load when adding or extending game content or systems:
  a new player action/intent/verb, a quest, a map zone, a narrative
  beat or dialogue line, a balance constant or cockpit lever, a UI
  surface or panel, a fixture scenario save, a DEV panel tab, a config
  flag, or a new test. Fires on "add a new action", "new quest", "new
  zone", "add a scene", "new balance knob", "build a new panel/tab",
  "add a fixture", "how do I wire X into the game". Each recipe names
  the exact files in order, the trap that has bitten before, the
  change-control routing (which skill/gate/sign-off), and the
  verification step that proves it landed.
---

# Kami extension recipes

Ten numbered recipes. Each is: files in order → trap → routing →
verify. Terms (rung, intent, gate, HR-item, lever…) are defined in
`kami-domain-reference`'s glossary.

Standing rules that apply to EVERY recipe:

- **Pure-core boundary.** Game logic lives in `src/core/` (no DOM;
  oxlint-enforced via `no-restricted-imports` in `.oxlintrc.json`).
  The UI imports ONLY from `src/core/index.ts`, the one public
  surface.
- **Never edit a `*.gen.ts`** or a generated save/doc — every one has
  a source + generator + byte-compare gate (`src/scripts/gates.ts` is
  the roster). Per-gate RED fixes: `kami-verify-gates`.
- **Shared tree.** A co-agent may have uncommitted WIP. Before relying
  on a value in a hot file (`src/core/constants.ts`, `intents.ts`,
  `state.ts`), check committed canon: `git show HEAD:<path>`. Commit
  by explicit file pathspec only (AGENTS.md Checkpoint; procedure
  ownership: `kami-change-control`).
- **Reachability (PH6).** A change with no UI path and no fixture a
  player/tester can load is not done.
- **Taste (PH5/ADR-126).** Anything player-visible runs the two-pass
  `taste-scorecard` flow. Visual canon is **Andon Steel** (ADR-127,
  `docs/living/ui-design.md` — authoritative; correction owner:
  kami-domain-reference §5).

## Recipe index

| # | To add… | Entry point | Mandatory routing |
|---|---|---|---|
| 1 | Player action / intent | `src/core/intents.ts` | tdd skill; plan if design-changing |
| 2 | Quest | `src/core/content/quests.ts` | narrative-diverge for prose (ADR-139) |
| 3 | Map zone | `map-sheets` skill | golden pin + map-blind-pass |
| 4 | Narrative beat / dialogue | `src/core/content/narrative/*.md` | narrative-diverge; kami-narrative-grammar |
| 5 | Balance constant / lever | `src/core/content/balance.ts` | ADR-132 flow; ADR-134 human-slider law |
| 6 | UI surface | `diverge` skill | HR-item + review-link gate |
| 7 | Fixture scenario | `src/fixtures/specs.ts` | fixtures gate |
| 8 | DEV panel tab | `src/ui/dev.ts` | none (DEV-only) |
| 9 | Config flag | `kami-config-and-flags` | that skill's checklist |
| 10 | Test | beside the code | tdd skill; lane choice |

## 1 · Add a player action (intent)

1. `src/core/intents.ts` — add a member to the `Intent` union
   (near line 146) with a comment naming its ADR/plan/FB.
2. Same file — add the `case '<type>':` arm in `reduce`. Guard
   legality FIRST and return `state` as a no-op (every intent is
   mode-guarded; an illegal intent never throws). Mutate via the
   existing helpers; grant anything via `applyRewards(state, bundle)`
   (`src/core/rewards.ts`); if quests/rung-requirements should count
   it, emit `applyProgressEvent(next, 'act:<x>')`
   (`src/core/progress-events.ts` — the AC-20 glue that fans one
   token out to quests AND rung requirements; never call one reducer
   from another). End through `finish(next)`.
3. **Do not reorder `finish()`** (intents.ts ~223):
   `announcePass(triggerFlagScenes(settleRequirements(revealsPass(worksPass(state)))))`
   — worksPass/revealsPass run first so a flag latched this tick is
   seen by the same tick's flag-scene pass. A new pass needs the same
   ordering argument written in the comment block there.
4. No-argument body verb? Add it to `MetaVerb` + `availableActions`
   (intents.ts ~200-212) and `META_LABELS` in `src/ui/render.ts`
   (~105).
5. Timing: register in `src/core/content/timing.ts` —
   `INTENT_TIMING` (or `ACTIVITY_TIMING` for activities; `timingFor`
   routes). Unregistered = instant dispatch, no press bar.
6. Export new helpers/selectors via `src/core/index.ts`. A UI
   forecast MUST reuse the exact fn the reducer uses (AC-6 — see the
   `sleepForecast` export comment in index.ts: "the reducer AND the
   hover read THIS").
7. UI button in the owning `src/ui/render/<surface>.ts` view,
   dispatching the intent.
8. Auto-loop relevant? Extend `autoModeIntent` /
   `focusedOptimalIntent` in `src/core/autoplay.ts` — the SAME fn
   drives the shipped auto-loop, the sim, and fixture climbs; a
   private copy desyncs all three.
9. Tests per recipe 10.

**Trap:** deriving test fixtures from copied magic numbers — the
MS2·8 incident broke ~6 tests. Derive from the source constants
(rung costs are authored requirement lists in
`src/core/content/narrative/requirements.md` → `requirements.gen.ts`;
the old `rungThreshold` meter is retired — kami-domain-reference §1).

**Verify:** `pnpm run verify` green; drive it live headlessly via
`window.__qa.dispatch({type:'<type>', …})` on the shared `:5264`
server (harness law: `docs/guides/qa-playtesting.md`; never spawn a
dev server). The old `src/scripts/playtest.mjs` was retired
(deleted 2026-07-18); the live fight wrapper is `__qa.fight(mobId)`
in `src/app/main.ts`.

## 2 · Add a quest

1. `src/core/content/quests.ts` — append a `QuestDef` to `QUESTS`:
   id, kind (`PEST|HUNT|CLEAR|DEFEND`), title, blurb, `steps`, and a
   `reward: RewardBundle`. Rewards run the KIND lane: combat/defence
   pays in recovered goods, flags and standing — **never coin**
   (file-header canon, G4).
2. Prose (blurb, step text, reward line) is a `FLAVOR.<key>`
   reference — author the words in
   `src/core/content/narrative/flavor.md` and regen (recipe 4).
   Never re-type prose inline; quests.ts holds keys, not sentences.
3. Each step listens for an event token `'<verb>:<subject>'`
   (`'kill:monkey'`, `'gather:wood'`) — order-free set. Confirm the
   token is actually EMITTED: `kill:<mobId>` comes free from
   `src/core/fight.ts` (~156); `act:<activityId>` / `gather:<res>`
   from the activity reducer (intents.ts ~931/936). A new subject may
   need a new `applyProgressEvent` emit site (recipe 1 step 2).
4. Acceptance rides the existing `accept_quest` intent →
   `acceptQuest` (`src/core/quest-engine.ts`); surface the offer in
   `src/ui/render/quests.ts`.
5. New fiction-voiced text = ADR-139: 3+ takes via the
   `narrative-diverge` skill, reviewed live in the DEV Story
   switcher. Mechanical copy is exempt.

**Trap:** a typo'd event token compiles green and the quest silently
never advances — gen does NOT registry-check tokens. Write the test
that completes the quest through real intents (could-go-RED proof).

**Verify:** vitest gate green; load a nearby fixture
(`__qa.loadFixture('rung-R3')` or similar), accept, drive the steps,
watch `__qa.state().quests`.

## 3 · Add a map zone (two vocabularies + a mandatory skill)

**Entry point is the `map-sheets` skill — map work is never
freehanded (AGENTS.md, 2026-07-08).** This recipe is the file map you
carry into it.

Core walkable graph (`src/core/content/`):

1. `map.ts` — add a `MapNode` to `MAP_NODES`: id, label, kanji,
   blurb, symmetric `neighbors` (test-verified), `revealFlag`
   (reuse a `surfaces.ts` room-unlock id), `rung`.
   **`MAP_NODE_CEILING = 16`** (map.ts ~49) must stay equal to the
   sheet roster minus activity chips — map.test derives the count
   from `T0_NODES`, so touching only one vocabulary goes RED.
2. `areas.ts` — extend the `AreaId` union + `AREAS` (keyed to the
   SHEET's zone ids — deliberately ONE vocabulary, TST1).
3. `surfaces.ts` — the room `Surface` with a MONOTONE unlock
   predicate, or a rung grant in `ranks.ts rewardOnReach.unlock`.
   VN-revealed zones set `vnReveal: true` (ADR-184; modes bridged by
   `__setZoneRevealMode`, exported from index.ts).

Drawn sheet (`src/ui/map-sheets/` — its README's "five laws" govern):

4. `nodes.ts` roster entry → anchor in `layout.ts` `ANCHORS` →
   painter/ground work in `ground.ts` (`TIER_DELTA` for tier
   deltas) → `integrity.test.ts` keeps roster↔layout honest.
5. The golden pin goes RED on ANY visual change — that is the
   design. Regenerate deliberately:

   ```bash
   UPDATE_MAP_GOLDEN=1 pnpm exec vitest run src/ui/map-sheets/golden.test.ts
   ```

   then eyeball `node src/scripts/map-audit-shots.mjs` output and
   commit `golden.hash.json` WITH the change.
6. Look-bearing change ⇒ run the `map-blind-pass` skill (pass
   `args.sheets`) before calling it done.

**Trap:** `seedSeq` is call-order-dependent — inserting one drawn
mark reshuffles every later seed, so an "unrelated" addition also
reds the pin (README law 1). Expected; regen deliberately, never
blindly.

**Verify:** `pnpm run verify` (map tests + golden), map-blind-pass
report scored, then walk to the node live: `__qa.goto('<id>')`.

## 4 · Add a narrative beat / dialogue line (.md → gen)

1. Edit the owning SOURCE under `src/core/content/narrative/`:
   `rung-beats.md`, `intro.md`, `dialogue.md`, `cold-open.md`,
   `flavor.md`, `requirements.md`, `scenes.md`, and (since
   353fdacf's talk step 2) `asks.md` → `asks.gen.ts`. The compile
   target table is in `src/scripts/gen-narrative.ts` (~47-90).
   Deep syntax — regexes, annotations, the reserved-key set, takes
   grammar — is owned by `kami-narrative-grammar`; the grammar's
   README sits beside the sources.
2. Greeting and topic-answer lines REQUIRE a permanent line id
   `<!--#the-slug-->` on the line above — **never renumber, never
   reuse** (the pre-id era silently re-pointed old saves at
   neighbour lines; the v11→v12 migration exists because of it,
   ADR-186). Bulk-fill a new file:
   `pnpm exec tsx src/scripts/narrative-add-line-ids.ts --check`.
3. `pnpm run gen:narrative` — regenerates the `.gen.ts` files AND
   `docs/content/t0-story.md` (generated by gen-narrative; never
   hand-edit). Commit source + all regenerated outputs TOGETHER —
   the `gen-narrative` gate byte-compares at commit/push/CI.
4. NEW or feedback-changed fiction-voiced text ⇒ ADR-139: 3+ takes
   via the `narrative-diverge` skill. Takes live in
   `takes/<bundle-id>/` with a `bundle.md` declaring `hr:` — the
   `review-link` gate binds the HR-item both directions. Takes are
   PROSE-ONLY (a structural mismatch REDs gen).
5. `narrative/t0v2/` is staged and NOT compiled — gen-narrative's
   input list is explicit; editing t0v2 changes nothing in the game.

**Trap:** editing a `*.gen.ts` (including `docs/content/t0-story.md`
and `storyTakes.gen.ts`). The gate error names the `.md` to edit —
believe it.

**Verify:** `pnpm run gen:narrative:check` clean; for a scene, drive
to its trigger in the live game or DEV Story reader and read it.

## 5 · Add a balance constant / cockpit lever

1. Plain constant: `export const` in
   `src/core/content/balance.ts` with a PRD-§ comment.
2. Cockpit-tunable lever (FB-7/ADR-059) — three touches, all in
   balance.ts: declare with `let`; add a `case '<PATH>':` in
   `__setBalanceLever` (~734; unknown paths throw
   `balance-override: unknown lever` — that literal doubles as a
   prod-strip sentinel, don't reword it); add the path to
   `BALANCE_CANON` (~882). Read via `readBalanceLever`; tests that
   set levers MUST end with `__resetBalanceLevers()` — vitest runs
   `isolate: false`, so a leaked lever poisons the next file (leak
   mechanics: kami-debugging-playbook §1).
3. Magnitude changed? The ADR-132 machine-verdict flow (owned in
   depth by `kami-balance-analysis-toolkit`):
   read `project/telemetry/` first (FB-8) →
   `pnpm run verify:balance` → `pnpm run balance:report` → commit
   the regenerated `docs/content/t0-pacing.md` WITH the change,
   pasting `tsx src/scripts/balance-sim.ts --summary` into the
   commit body. Also regen downstream: `pnpm run gen:docs`, and
   `pnpm run fixtures:regen` if waypoints shifted.
4. Rung pacing is NOT in balance.ts: a rung-cost tune is a `count`
   edit in `narrative/requirements.md` → `pnpm run gen:narrative`
   (ADR-137/182 — "no balance.ts mirror").
5. **Human-gated:** an agent never moves a slider into canon
   (ADR-134). Apply only an exported tune artifact from
   `project/playtest-inbox/`, with the stale-canon guard
   (`docs/guides/qa-playtesting.md` §2). Routing table:
   `kami-change-control`.

**Verify:** `pnpm run verify:balance` green + the t0-pacing.md diff
read as the before/after.

## 6 · Add a UI surface

Mandatory for new/majorly-restyled surfaces: the `diverge` skill
(ADR-075 — FULL 2–3 working variants, no LITE, no buggy variant).
This recipe is the wiring map.

1. Pass 1 of `taste-scorecard` BEFORE building; style to Andon
   Steel (`docs/living/ui-design.md`).
2. Prod-default view: `src/ui/render/<x>.ts` exporting
   `create<X>View(ctx)` (pattern: `render/market.ts`); wire into
   `mount()` in `src/ui/render.ts`. Reuse the shell's shared
   helpers (`el`, consts) — don't invent a second helper home
   (TST1).
3. Alternates: `src/ui/dev/variant-renderers.ts` behind
   `dev.renderVariant(...)` (returns true ⇒ skip default). Pure
   presentation — nothing in src/core branches on a variant.
4. Register in `src/ui/dev-surfaces.ts SURFACES` — NOT dev.ts (the
   registry is split out so the tsx gate script can import it;
   dev.ts pulls `import.meta.glob`). `{id, hr: 'HR-nn', rung,
   label, variants}`; **`variants[0]` IS the prod default**;
   reference by stable id, never positional V-tags (ADR-192 — two
   agents misdirected the human in one day via renumbered tags).
5. File the HR-item in `project/human-in-the-loop/review.md`
   naming the surface id — the `review-link` gate binds both
   directions.
6. Visibility: a `Surface` in `src/core/content/surfaces.ts` with
   a MONOTONE unlock predicate (latched facts only — "a visible
   surface can never vanish", TST2; never key to transient
   `s.rung`, key to the latched `rank-rN` flag — the
   screen-demo-frontier lesson, ADR-179), or a rung grant in
   `ranks.ts rewardOnReach.unlock`.
7. CSS: into the matching `src/ui/styles/*.css`, or a new file
   appended to `src/ui/styles.css` — the @import ORDER IS the
   cascade; never reorder existing lines.
8. Pass 2 taste-scorecard per variant; when the human settles,
   DELETE losing variants + the registry entry (zero flag-debt).

**Trap:** skipping the diverge because "it's small". One-line tweaks
are exempt; a new pane is not.

**Verify:** `pnpm run verify` (review-link + vitest); screenshot the
surface via the `capture-game-states` skill and review against
ui-design.md.

## 7 · Add a fixture scenario

1. `src/fixtures/specs.ts` — add a `FixtureSpec` to
   `FIXTURE_SPECS`: `name` (= file stem = panel label = `__qa`
   key), `blurb`, `group`, fixed `seed`, `play(s0)` driving the
   REAL engine (`reduce`, `focusedOptimalIntent`) — **no state
   surgery: no field pokes, no forced flags** (file-header law) —
   and `expect(s)` asserting STABLE invariants (rung/flags/bands,
   never exact numerics).
2. `pnpm run fixtures:regen` → writes
   `src/fixtures/saves/<name>.json` (log-stripped envelope; gen
   asserts `expect`, so a spec that misses its waypoint fails
   loudly; orphan saves auto-delete).
3. Commit spec + regenerated saves together — the `fixtures` gate
   byte-compares. After any schema bump, regen too (bump recipe:
   `kami-save-and-schema`; read `SCHEMA_VERSION` from
   `src/core/constants.ts`, never trust a remembered number — it
   moved 14→15 mid-July under the talk plan).
4. E2E-relevant? Add the name to `FIXTURES` in
   `src/tests/e2e/helpers.ts` — its registry-drift test vs
   `__qa.fixtures()` REDs a fixture without coverage (ADR-177).

**Trap:** keep `specs.ts` free of `import.meta.glob` (tsx must run
it outside Vite); the glob lives only in `src/fixtures/index.ts`.

**Verify:** `pnpm run fixtures:check` clean; `?fixture=<name>` boots
into the waypoint on the shared server.

## 8 · Add a DEV panel tab

All inside `src/ui/dev.ts` `mountDevPanel` + `src/ui/dev/`:

1. Extend the `TabId` union (~445); create the pane element,
   `tabBtn('<Label>')`, entry in the `tabs` record; append to tab
   bar + body.
2. Implement as a `build<X>Pane({pane, ...})` module in
   `src/ui/dev/` (pattern: `settings-pane.ts`,
   `scenarios-pane.ts`, `protos-pane.ts`).
3. Everything rides the `__DEV_TOOLS__ && gating.panel` fold — no
   strip work needed. Poll `qa.state()` for live-state panes.

**Trap:** gate-read DATA must not live in dev.ts (recipe 6 step 4's
tsx-import trap). New human-reviewable toggles belong in
dev-surfaces.ts with an HR-item, not as loose buttons.

**Verify:** open the panel on `:5264` with `?dev=yes`; then confirm
prod strip discipline unchanged (`kami-build-and-env` owns the
strip-proof commands).

## 9 · Add a config flag

Owned by `kami-config-and-flags` — go there for the catalog
(SKIP_*/env/URL-param/vite-define/cockpit) and the add-a-flag
checklist. File anchors only: build-time defines in
`vite.config.ts` `define:` (~289); runtime DEV gating in
`resolveDevGating` (`src/app/dev-gating.ts` — PURE so the truth
table is unit-tested, which is the RED-able proof prod is
default-inert); game-state story flags are just `setFlag` latches
(ADR-179 monotone-facts currency).

**Verify:** per that skill; minimum is the dev-gating unit matrix
still green.

## 10 · Add a test

1. Location: beside the code, `**/*.test.ts` (vitest config lives
   in `vite.config.ts`'s `test:` block; `environment: 'node'`; UI
   tests opt into jsdom via a per-file
   `// @vitest-environment jsdom` pragma).
2. Lane: default = COMMIT lane (runs at every commit under the
   5s-soft/8s-hard budget, ADR-176). Legitimately slow (full-arc,
   full-mount, big jsdom sweeps) ⇒ top-of-file `// @slow` pragma
   (must match within the first 2048 bytes —
   `src/scripts/vitest-verify.ts`); it then runs at push/CI
   (`VERIFY_FULL=1`). If your test pushes the commit gate past 8s,
   tag it `@slow` — don't `SKIP_BUDGET=1`.
3. Discipline (AGENTS.md, ADR-086–088): could it go RED? Derive
   fixtures from the source of truth — `balance` constants,
   `RUNG_REQUIREMENTS` from `requirements.gen.ts` (never the
   retired `rungThreshold`) — and assert
   the design lever, not a collapsed metric. The `tdd` skill owns
   red→green→refactor and the mutation-check.
4. Drive through the pure-core public contract:
   `reduce(state, intent)` / `tick(state, dt)` via
   `src/core/index.ts`.
5. Leaked module state (balance levers, story overlay) must be
   reset in the test (`__resetBalanceLevers()`) — `isolate: false`
   shares workers across files by design.

**Verify:** watch the test FAIL first (break the code or assert the
wrong value), then pass; `pnpm run verify` stays under budget
(`pnpm run verify:budget` for the per-gate breakdown).

## When NOT to use this skill

- Procedure for a diverge, story takes, map work, taste scoring,
  TDD, planning → the existing `diverge`, `narrative-diverge`,
  `map-sheets`, `taste-scorecard`, `tdd`, `write-plan` skills.
- What is human-gated vs agent-safe, sign-off routing →
  `kami-change-control`.
- A gate went RED → `kami-verify-gates`. Debugging a behavior →
  `kami-debugging-playbook`.
- Narrative grammar syntax detail → `kami-narrative-grammar`.
  Save/migration work → `kami-save-and-schema`. Sim/balance
  methodology → `kami-balance-analysis-toolkit`. Flags →
  `kami-config-and-flags`. Build/CI/dev-server law →
  `kami-build-and-env`.

## Provenance and maintenance

Authored 2026-07-18 against HEAD `4bfb3ba3` by direct file
verification; line numbers are anchors, not contracts — re-grep
before trusting them. Volatile facts: SCHEMA_VERSION (read
`src/core/constants.ts`), the `asks.md` pipeline (landed 353fdacf,
talk plan step 2; later steps may reshape talk UI), the fixture
roster, and the gate roster.

Re-verify one-liners:

```bash
grep -c "name: '" src/scripts/gates.ts          # gate count (never hand-type)
grep -n "SCHEMA_VERSION" src/core/constants.ts   # current schema
grep -n "MAP_NODE_CEILING" src/core/content/map.ts
grep -n "md: 'src/core/content/narrative" src/scripts/gen-narrative.ts  # compile targets
grep -n "@slow" src/scripts/vitest-verify.ts     # lane mechanism
git log --oneline -3 -- docs/plans/              # active plans that may retune these recipes
```
