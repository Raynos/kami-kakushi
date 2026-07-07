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

## Phase 2 — the woodlot lacquer discovery (player-reachable, ADR-139 diverged)

- **Content:** `tap_lacquer` ActivityDef (woodlot-edge, coin 3, no deedSource —
  pockets, not house standing) + the `disc-woodlot-lacquer` DiscoveryDef
  (watch woodcut_edge, 12% pity-ramped — lands ~5 cuts in).
- **Fiction (ADR-139):** 3 blind takes authored by independent agents under
  distinct dramatic briefs — A "the woodsman's eye" (sensory), B "the estate's
  memory" (historical), C "the mountain's reticence" (deniable animism).
  Self-picked **A** (the sensory register voices the pity-ramp mechanic
  itself); canon in `narrative/flavor.md` (lacquerHint0/1/2 + lacquerFound),
  alternates in `takes/disc-woodlot-lacquer/`. **HR-14** filed with Pass-1
  brief + per-take scorecards.
- **Live swap (ADR-143):** hints are render-read flavor keys (`dev.subFlavor`
  — free in the existing switcher); the found line is core-emitted, so
  discoveries.ts grew `__setDiscoveryFlavorOverride` (the req-flavor
  declaring-module pattern) and dev.ts forwards the effective flavor takes.
- **UI:** the hint renders as the closing sentence of the Map node card's
  blurb (both prod-incremental and DEV paths), patched in place.
- **Verification:** full vitest + 17 verify gates green; `verify:balance`
  GREEN (pacing diff = noise, T0 total steady 130.3min — report committed);
  headless Playwright drive ALL GREEN: hint renders → take C swaps live in
  the card → discovery latches after 5 cuts → found line logs → hint vanishes
  → "Tap the lacquer tree" renders and pays (208→213 coin).
  (`tmp/verify-discovery.mjs`, throwaway.)

## Taste Pass 2 (canon, the built surface)

12✔ · 1✘ · 8— — ✘P17 [briefed, by design]: no NEW-marker on the discovered
action (the ADR-146 anti-checklist lock; the log line + sharpened blurb are
the state signal). Full per-take scorecards live in the HR-14 item + the
bundle doc.

## HR-14 closed same-session (human playtest verdict)

The human played it live and ruled: **canon stays "the woodsman's eye"**
(bundle pruned per the diverge lifecycle — the archive row + this journal are
the record), and the pacing was wrong — *"it unlocked in 3 seconds."* The old
tune (12% base, 1/4 pity slope) made any base a near-certainty within a dozen
cuts. Re-tuned to the human's **"rare ambient"** pick (AskUserQuestion):

- **`minAttempts` floor** (new `DiscoveryDef` field): the first N qualifying
  acts only count — no roll, no RNG-cursor movement — so a discovery can
  never pop instantly and the hint ladder gets a real arc. Lacquer: 15.
- **Base 12% → 1%**; **pity slope 1/4 → 1/10** (counts attempts BEYOND the
  floor); **hint step 3 → 12**.
- Measured over 400 seeds: **min 16 · median ~42 · p75 ~58 · p95 ~84 ·
  max 125 cuts** — never instant, typically a multi-visit background find.
- New floor test (no roll + no cursor movement during the floor; chance-1
  latches on the first real roll); the slope/ladder tests derive from the
  balance constants so they re-pinned themselves.

## Next intended steps
- Phase 3 (portable rumors, tag-routed) — the plan's remaining phase.
- More discoverables (a visit-stumble one would exercise the second trigger)
  now that the human has signed the pattern.
