# Session 104 — 2026-07-07 — emergent node actions: Phase 0 lock + build

**Summary:** The human asked to build
`docs/plans/opus-2026-07-03-emergent-node-actions.md`. Ran the plan's mandatory
Phase 0 design pass live (AskUserQuestion): build now as a T0-later layer,
permanent ratchet (the per-run fork proved moot — the game has no runs/resets
per PRD §1), tightening hints, no discovery-log (purely diegetic), tag-based
rumor routing as the agent default with Phase 3 deferred. Locked as **ADR-146**;
plan flipped ▶️ IN-PROGRESS. Then built Phase 1 (the node-scoped discovery
primitive in the pure core) — see the "What changed" log below as commits land.

## What changed
- `docs/living/decisions.md` — **ADR-146** (the Phase 0 lock).
- `docs/plans/opus-2026-07-03-emergent-node-actions.md` — Status → IN-PROGRESS;
  §Open resolved with strikethroughs; new "Phase 0 outcome" build spec (state
  shape, `DISCOVERIES` registry, derivable hiddenness, hint selector).

## Verification
- Docs-only for the Phase 0 commit (`SKIP_CODE_VERIFY=1`); the docs gates run.

## Phase 1 — the node-scoped discovery primitive (pure core)

- `src/core/rng.ts` — a fifth stream, `'discovery'` (new salt; existing salts
  untouched, so old sequences replay exactly).
- `src/core/state.ts` — `discovered` (write-once latch, mirrors `unlocked`) +
  `discoveryProgress` (attempt counters); defaults in `createInitialState`.
- `src/core/content/discoveries.ts` — the `DiscoveryDef` registry (node,
  `reveals` activity, watch/visit trigger, tightening `hints` ladder, the
  diegetic `discoveryLine`, the Phase-3 rumor `tag`). Registry ships EMPTY —
  real content lands with the ADR-139 narrative diverge (Phase 2).
- `src/core/discovery.ts` — the engine: `discoveryPass` (attempt → pity-ramped
  seeded roll → permanent latch + narrator log line), `hiddenActivityIds`
  (derived hiddenness), `nodeHint` (the ladder), `effectiveChance` (the lever).
- `src/core/selectors.ts` — `availableLabours`/`canDoActivity` subtract hidden
  activities (an undiscovered action does not exist — PH6/anti-checklist).
- `src/core/intents.ts` — `do_activity` fires a watch attempt; `move_to` fires
  a visit attempt.
- `src/core/content/balance.ts` — `DISCOVERY_PITY_NUM/DEN` (integer fixed-point
  ramp) + `DISCOVERY_HINT_STEP` (liquid, ADR-059).
- Persistence: SCHEMA_VERSION 8→9, the v8→v9 additive migration (latch +
  counters + the new rng cursor), validate.ts ledger entries, fixtures regen.
- Tests: `src/core/discovery.test.ts` (12 — determinism under a fixed seed,
  the permanent ratchet, pity monotonicity at the balance-source slope, hidden
  gating that could go RED vs a static list, the hint ladder) + the v8→v9
  migration test. Full `pnpm run verify` green (17 gates).

## Taste Pass 1 — the constraint brief (full walk)

Applicable (one line each); the rest n/a for a pure-core + node-card feature:

- **P2 (one primitive per idiom):** the hint extends the existing node `blurb`
  render + the discovery moment uses the existing log-line primitive — no new
  hint widget, no local log fork.
- **P3 (voice at source):** the discovery log line's speaker/category is set in
  pure core (narration), never in the renderer.
- **P4 (append-only render):** the blurb hint update patches text in place; a
  newly discovered action APPENDS to the action list — never a container reset.
- **P5 (stable frames):** the node card doesn't rebuild or jump when an action
  appears; the list grows by one row in place.
- **P9 (discover, don't spawn):** the discovery IS the beat — the hint
  foreshadows it, the log line lands it; **never a "NEW ACTION!" banner**.
- **P10 (story promises are contracts):** a hint line is a promise — the hidden
  action it foreshadows must exist, be reachable, and stay (permanent ratchet).
- **P15 (the map doesn't spoil):** the hint reads as node flavour inside the
  existing description — no "1 undiscovered here" counter, no preview of what
  the action will be.
- **P16 (route by weight):** the discovery moment routes as an earned/story
  line by the existing weight rules — not Now-fleeting, not a stat dump.
- **P17 (controls advertise state) — deliberate tension:** ADR-146 locks
  NO new-badge / no found-list (anti-checklist); the log line + the sharpened
  blurb are the "what changed" signal. Named here so a Pass-2 ✘ is [briefed].
- **P19 (two registers):** hint text is reading-register prose in the blurb;
  the action row stays chrome-register.
- **V3 (TST3):** every discoverable is authored with a fiction reason at its
  node; all fiction text (hints, log lines, labels) rides ADR-139 diverges.
- **V4/TST4 (single source):** hiddenness is DERIVED (a discovery's `reveals`
  target + the latch) — no duplicate `hidden:` flag to drift (TST1).

## Next intended steps
- Phase 1: `'discovery'` RNG stream + `discovered`/`discoveryProgress` state +
  `discoveryPass` + hidden-activity gating + fixed-seed/ratchet tests.
- Phase 2: tightening blurb hints (selector + UI), one real T0 discoverable,
  fiction text via an ADR-139 narrative diverge; taste Pass 1 before the
  player-visible wiring.
