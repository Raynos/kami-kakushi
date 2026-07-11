# Streamline the save-file format — facts only, src/ is truth

**Status:** DONE — all five steps built & pushed (session 180, 2026-07-12). Every
gate green on the FULL lane (18 gates, 1261 tests incl. `@slow`). Doctrine landed as
**ADR-186**. Two follow-ups fell OUT of this plan and are recorded in the addendum at
the bottom (they are NOT done): the **reveal-ceremony re-arm** and the
**save-migration subsystem** the human routed here from the zone-rung session.

**Outcome:** 302 distinct keyless log lines → **0** (gated). Fixtures 1812 → 1264 KB
with **zero** prose characters on disk. `validateState` is a whitelist rebuild; weapon
wear + `sitePools` derive from `src/`; an orphaned-id sensor reports content renames in
the DEV panel.
**✅ Grounding re-check (session 180, HEAD):** findings 2, 4, 5 all still hold
(`validate.ts:247` `...base`; `validate.ts:346` hardcoded `40`); `renderLogLine`
lives in `src/core/content/log-content.ts` and is still a leaf (imports only
`./names` + `../format`). **Stale in the original plan:** step 5 says "ship
`src/persistence/README.md`" — that README already exists (118 lines, doctrine
stated), so step 5 is an *amendment*, not a new doc.
**Confidence:** ( 25% Opus, 75% Fable ) — superseded by the routing ruling below.

## Who builds this — Fable or Opus?

**Ruled (human, 2026-07-11): Opus builds all five steps.** The plan's original
75%-Fable lean rested on step 1's cycle risk, which the `log-render.ts` ruling
below now removes; what's left is the known C2…C6 emit-site pattern plus
mechanical sweeps, with the tests as the net.

## Locked decisions (human, session 180 · 2026-07-11)

Eight open questions were put to the human before any code was written. The
rulings bind this plan; where one contradicts the prose further down, the
ruling wins.

1. **The log is a derived VIEW, not a transcript — full re-render.** Every line
   persists `contentKey` + `params`; ALL prose (including narrative beats and
   dialogue the player chose) re-renders from the *current* `src/` registries on
   load. A reworded line rewrites what an existing save's scrollback shows — that
   is the intended behaviour, not a regression. **This lands as an ADR** with
   step 1 (the "save is facts, prose is derived" doctrine).
2. **The keyless ban is GATED, not a norm.** A test asserts a fresh full-arc run
   produces **zero** keyless log entries; it must be able to go RED. Every future
   narrative line goes through a registry + key.
3. **Drop the `...base` spread** in `validateState` (step 2). One-way per save —
   retired fields evaporate on the first round-trip. Accepted; no schema bump.
4. **Cycle fix: a `log-render.ts` composition module**, NOT the plan's
   register-a-resolver-at-module-init scheme. The new module imports
   `log-content` + the registries and owns the namespace dispatch; `codec.ts`
   imports *it*. `log-content.ts` stays a true leaf. Rationale: module-init
   registration makes rehydration order-dependent — a content module not yet
   imported when `codec.ts` rehydrates falls back silently to the stale stored
   text, i.e. the exact bug this plan exists to kill, made invisible.
5. **The orphaned-id detector is a SENSOR at the DEV-panel rung** — a compact
   orphaned-ids table in the DEV panel *and* a `console.info`. Not a red test
   (it would cry wolf on every deliberate rename); console-only was rejected
   because it goes unread during the playtest that triggers it.
6. **`sitePools`: hydrate a missing key as freshly refilled** (present keys win).
   No schema bump. Known harmless quirk: a site that was depleted and then
   *renamed* in `src/` is reborn full.
7. **Build order: 5 → 3 → 2 → 4 → 1.** Small correctness steps land first as
   quick green commits; the orphan sensor (4) is therefore **armed and watching
   before** the big log migration (1) lands.
8. **Fixture regeneration happens once, at the end of step 1** — coordinated
   with the co-agent live in this shared tree, never dropped mid-stream.

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
- ~~`renderLogLine` grows a **namespace dispatch** to those registries. Cycle
  risk: `log-content.ts` is deliberately a leaf. Resolve with a
  register-a-namespace-resolver pattern (each content module registers its
  resolver into log-content at module init) rather than direct imports —
  decide at build time, but do NOT let log-content import surfaces/scenes.~~
  **Superseded by locked decision 4:** the namespace dispatch lives in a NEW
  `src/core/content/log-render.ts`, which imports `log-content` + the registries;
  `codec.ts` (and `log.ts` / `rewards.ts`) call `renderLogLine` from *there*.
  `log-content.ts` stays a leaf with no init-order hazard. Verify the import
  graph is genuinely acyclic before the first commit of this step.
- Keyless entries remain the documented legacy fallback (old saves rehydrate
  unchanged; an unknown key falls back to stored text — already handled in
  `codec.ts rehydrateLogEntry`).
- One commit per emitter file (the C2…C8 cadence); `pnpm run verify` each.
- Done-when (tightened by locked decision 2): a fresh full-arc run's save has
  **zero** keyless entries — asserted by a test that can go RED, not a "~0"
  eyeball; and a reworded narrative `.md` line shows the NEW text in an old
  save's log on next load (add exactly this as a test too).
- Ships the ADR for the log-is-a-derived-view doctrine (locked decision 1).

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
and report a compact "orphaned ids" table. Zero prod cost; makes a content
move that needs a migration VISIBLE the first time anyone playtests it,
instead of silently mis-behaving. Not a gate — a sensor.

Per locked decision 5 the table surfaces **in the DEV panel** as well as via
`console.info` — a console-only line goes unread during the very playtest that
trips it. Lands BEFORE step 1 (build order 5→3→2→4→1) so it is armed and
watching while the log migration goes in.

### 5 · Tiny correctness sweeps

- `weaponDurability` fallback → derive from the equipped weapon's def
  (`getWeapon(equippedWeapon).durabilityMax`), replacing the hardcoded `40` at
  `validate.ts:346`.
- ~~README (shipped with this plan's commit): `src/persistence/README.md`~~ —
  **stale:** that README already exists (118 lines) and already states the
  doctrine. This step **amends** it: add the three schema-growth rungs, the
  "renames need a migration" rule, the keyless-entry ban (decision 2) and the
  log-is-a-derived-view doctrine (decision 1).

## Non-goals

- No new save-file layout / no schema bump in steps 1–2 (descriptors are a
  store-channel transport concern; GameState shape is unchanged).
- No log eviction/pruning — durable history stays unbounded (FB-160/161).
- No touch of the export channel (plain base64-JSON stays).

## Sequencing & verification

The steps are independent, so the human ruled the order **5 → 3 → 2 → 4 → 1**
(locked decision 7): the small correctness sweeps land first as quick green
commits, and the orphan sensor (4) is armed *before* the bulk log migration (1)
goes in, so it can watch it land.

1 is the bulk (one commit per emitter file); 5, 3, 2, 4 are one commit each.
Every step: `pnpm run verify` green. Step 1 additionally regenerates fixtures
**once, at its end** (`pnpm run fixtures:regen`) — expected to SHRINK them ~5×
and stop the reword-churn; a co-agent is live in this shared tree, so that
regen is coordinated, never dropped mid-stream (locked decision 8). Full push
verifies the `@slow` lane.

## Sync ripple (PRD · story-bible · living docs)

- ✅ **ADR-186** (`docs/living/decisions.md`) — the log-is-a-derived-view doctrine +
  the keyless gate + the positional-`greeting.<i>` limit.
- ✅ **`src/persistence/README.md`** — the log section rewritten as settled doctrine;
  the clamp-to-registry rule; the whitelist rebuild.
- **PRD / story-bible** — no ripple: a persistence-layer change; no system, narrative
  beat, or content registry changes meaning.

## Addendum — what this plan did NOT close (session 180, human steer mid-build)

The human's mid-build steer ("zones must derive from rung; the save is an INPUT") was
**verified against HEAD and is already true** — see the journal. `room-*` surfaces are
`unlock: () => false`, so they are granted ONLY by the ranks.ts rung schedule, and travel
is gated by `canMove(from, to, visibleSet(next))`, recomputed from current `src/` every
move. There is no `zonesUnlocked` in the save (ADR-179 deleted it). Move a zone R2→R4 and
an old save at R2 loses access on load, correctly.

Three residuals came out of that check. **None is built:**

1. **The reveal ceremony does not RE-ARM.** `seenReveals` latches the announce-once
   record forever, so a zone moved R2→R4 will never re-announce for a player who already
   saw it at R2. Access is right; the BEAT is silently missing. (The zone-rung-rebalance
   plan's Stage 1 names a "derived `seenReveals` re-arm" — that is this.)
2. **Two surfaces bypass the rung schedule by design** — `room-weir` opens on the
   `works-named-weir` flag and `room-forecourt` on `awake` (the `SPECIAL_FACTS` chain).
   Re-rung those zones and the already-set flag keeps them open. Intentional today, but it
   IS the save out-voting `src/`; wants an explicit ruling.
3. **`discovered` latches hidden ACTIVITIES at a node** (not node access) — same re-arm
   question as (1).

**Save migration, routed here from the zone-rung session** (human, in that session:
"Hand it to the save-format plan"): migrate an old save at load where it can be migrated,
else show a "sorry — development; please restart" modal. **Most of this already exists**
and should be verified before anything new is built: `migrate.ts` is the ordered forward
chain, and `APP_GENERATION` (ADR-161) is exactly the courteous-restart path — it backs the
save up and boots fresh with an authored notice rather than crashing. The open question is
policy, not machinery: **when does a content move bump the generation vs. ship a migration
step?** That deserves its own small plan.
