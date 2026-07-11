# Streamline the save-file format — facts only, src/ is truth

**Status:** 🆕 proposed — audit done (session 175); no step started.
**Confidence:** ( 25% Opus, 75% Fable ) — steps 2–5 are mechanical once the
descriptor pattern is followed; step 1's registry-lookup design has one cycle
risk worth a careful eye.

## Who builds this — Fable or Opus?

Opus is sufficient for steps 2–5 (mechanical emit-site migrations following the
existing C2…C6 pattern, a whitelist flip guarded by an existing compile-time
ledger, small defaulting fixes). Step 1 (the rehydration lookup design, cycle
risk in `log-content.ts`) benefits from Fable-level care but is small; either
routes fine with the tests as the net.

## Why (the goal, human 2026-07-11)

> When we change how the game works, move content from rung to rung, or change
> UIs, I don't want to hard reset. On load the game must reflect `src/` — not
> render stale data from the save. The save is just stats, levels, skills,
> inventory, story choices.

## Audit verdict (what's already right)

The architecture already matches the doctrine — this plan closes residuals,
not a redesign:

- `src/persistence/` exists as a clean directory (manager / codec / validate /
  migrate / backends); no refactor needed.
- Stored-vs-derived is doctrine in `core/state.ts`: visibility DERIVES from
  facts (ADR-179, just landed), season/year/hpMax derive, ceremony latches are
  announce-only, automation resets on load (FB-32).
- Additive hydration + a compile-time `_Handled` ledger in `validate.ts`;
  clean-break generation gate (ADR-161); migration chain restarted tiny (v10+).
- UI prefs live in `kk.ui.*` localStorage, never in the save. Fixtures (FB-6)
  are the sanctioned "get to state X for testing" path.

## Audit findings (what still violates "src is truth")

1. **The log is 86–97% of every save, and ~85% of entries are keyless prose.**
   Measured on fixtures: `pre-ascension` = 124 KB state, 120 KB log, 461/541
   entries keyless (102 KB verbatim authored text). The Stage-C descriptor
   scheme (contentKey+params, re-rendered on load) shipped for the mechanical
   emitters (step/ranks/fight/intents/ascension/night-rounds) but NOT for:
   - narrative beats / scene + dialogue lines (`scenes.ts`, dialogue tree,
     intro — the `narration` + `narration/spoken` buckets, ~80 KB),
   - surface reveal lines (`unlock.ts:132` pushes `s.revealLine.text` raw),
   - discovery emit lines (`discovery.ts:100`), works lines (`works.ts`),
     perk/reward inline lines through the rewards bus.
   Consequence: **a reworded line keeps its OLD prose in every existing save**
   (the exact stale-render the human wants gone), and fixture regeneration
   churns on every reword (cf. 79b35600 "heal fixture drift").
2. **`validateState` spreads unknown fields through (`...base`).** Retired
   fields (e.g. `balanceProfile`) ride in saves forever. Every live key is
   already explicitly rebuilt + the `_Handled` ledger is compile-time-complete,
   so the spread's only remaining job is carrying junk.
3. **`sitePools[site] ?? 0` reads a MISSING key as depleted.** A site added or
   renamed mid-generation shows as worked-out (yield 0) until the next season
   refill — stale-by-omission. (`selectors.ts:175,204`, `autoplay.ts`.)
4. **Id renames silently orphan facts.** `flags`, quest step ids, `seenReveals`
   / `discovered` / `deliveredDialogue` / `askedTopics` / `scenesPlayed`,
   `marketBought`, `rungReqs`, site `area` strings are all raw-id-keyed. Stale
   ids sit inert (fine, they age out) — but a RENAME in src orphans the fact:
   a gate never reopens or a one-time beat replays. There is no signal when
   this happens.
5. Minor: `weaponDurability` load fallback is a hardcoded `40`
   (`validate.ts:344`) instead of `getWeapon(equippedWeapon).durabilityMax`.

## The steps

### 1 · Finish the log-descriptor migration (the big one)

Extend Stage C to the remaining keyless emitters so the store channel persists
descriptors, not prose. Keying:

- **Registry-backed lines re-render from their OWN registry**, not by
  duplicating text into `log-content.ts`: reveal lines key as
  `reveal.<surfaceId>` (text from `SURFACES`), scene/dialogue/intro lines as
  `dialogue.<lineId>` / `scene.<sceneId>.<beat>` (text from the `*.gen.ts`
  narrative registries — ids are already stable), discovery as
  `discovery.<id>`, works as `works.<stage>`.
- `renderLogLine` grows a **namespace dispatch** to those registries. Cycle
  risk: `log-content.ts` is deliberately a leaf. Resolve with a
  register-a-namespace-resolver pattern (each content module registers its
  resolver into log-content at module init) rather than direct imports —
  decide at build time, but do NOT let log-content import surfaces/scenes.
- Keyless entries remain the documented legacy fallback (old saves rehydrate
  unchanged; an unknown key falls back to stored text — already handled in
  `codec.ts rehydrateLogEntry`).
- One commit per emitter file (the C2…C8 cadence); `pnpm run verify` each.
- Done-when: a fresh full-arc run's save has ~0 keyless entries outside
  genuinely dynamic prose; a reworded narrative `.md` line shows the NEW text
  in an old save's log on next load (add exactly this as a test).

### 2 · Whitelist rebuild in `validateState`

Drop the `...base` spread; build the state object from the explicitly
validated fields only (the `_Handled` ledger already guarantees completeness —
a new GameState field without a default is a tsc error). Unknown/retired
fields then age out at the next save. Keep one test: load a save with junk
fields → junk absent after round-trip, no coercion notice.

### 3 · `sitePools`: missing key = fresh, not depleted

Hydrate missing pools per-key from `refillSitePools(season)` at validate time
(present keys win — a drawn-down pool stays drawn), so a new/renamed site is
born full instead of dead. Alternative considered (store DRAWN instead of
remaining, derive remaining): cleaner doctrine but needs a schema bump +
migration for no player-visible gain — rejected for now, noted for a future
restructure.

### 4 · Orphaned-id load report (DEV-only)

On load in DEV builds, diff the save's referenced ids (flags aside — they are
free-form facts; but quest step ids, seenReveals/discovered/delivered ids,
sitePool keys, marketBought keys, rungReqs keys) against the live registries
and `console.info` a compact "orphaned ids" table. Zero prod cost; makes a
content move that needs a migration VISIBLE the first time anyone playtests
it, instead of silently mis-behaving. Not a gate — a sensor.

### 5 · Tiny correctness sweeps

- `weaponDurability` fallback → derive from the equipped weapon's def.
- README (shipped with this plan's commit): `src/persistence/README.md` — the
  format doc + the three schema-growth rungs + "renames need a migration".

## Non-goals

- No new save-file layout / no schema bump in steps 1–2 (descriptors are a
  store-channel transport concern; GameState shape is unchanged).
- No log eviction/pruning — durable history stays unbounded (FB-160/161).
- No touch of the export channel (plain base64-JSON stays).

## Sequencing & verification

Steps are independent; 1 is the bulk (one commit per emitter file), 2–5 are
one commit each. Every step: `pnpm run verify` green; step 1 additionally
regenerates fixtures once at the end (`pnpm run fixtures:regen`) — expected to
SHRINK them ~5× and stop reword-churn. Full push verifies the `@slow` lane.
