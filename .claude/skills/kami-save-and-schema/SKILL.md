---
name: kami-save-and-schema
description: >
  The save/persistence subsystem and THE schema-bump recipe for
  kami-kakushi. Load this whenever you: add or rename a field in
  GameState; bump SCHEMA_VERSION; write or test a migration; rename any
  content id that saves reference (flag, quest step, surface, dialogue
  line, site area); see the fixtures gate go RED after a state change;
  debug "old save won't load", "save didn't stick", "my log lines are
  blank/wrong after reload", "we mended your saved game" notices, safe
  mode / crash-loop boots, or the DEV orphaned-id report; touch
  src/persistence/ or src/fixtures/ at all; or consider wiping player
  saves (APP_GENERATION — human-gated). Covers: multi-backend
  atomic-write architecture, newest-wins load, minimal-state doctrine,
  the descriptor codec (ADR-186), crash ring + safe mode (ADR-044),
  SCHEMA_VERSION vs APP_GENERATION (ADR-161), the three schema-growth
  rungs, the migration test pattern, and the known hazards.
---

# kami-save-and-schema

The save layer's own orientation doc is
[`src/persistence/README.md`](../../../src/persistence/README.md) —
read it first; it is canonical and current. This skill adds what that
README doesn't carry: the ordered bump RECIPE with its worked
examples, the test pattern, the change-control glue, and the hazard
list with the incidents behind it.

Core doctrine (the README's header, PH2-verified): **the save holds
only the player's FACTS; anything derivable from facts + current
`src/` content is DERIVED on load, never stored.** A content move must
never require a hard reset — if it would, the change is missing a
migration or is storing something it should derive.

## 1. The two version constants — read, never hardcode

Both live in `src/core/constants.ts`. Line numbers and values drift;
always read them fresh:

```bash
grep -n "SCHEMA_VERSION\s*=\|APP_GENERATION\s*=" src/core/constants.ts
```

| Constant | Meaning | Bump when |
| --- | --- | --- |
| `SCHEMA_VERSION` | Within-generation save format. Gates the migration chain (`src/persistence/migrate.ts`). | Field rename/restructure; recent practice also bumps for additive fields (§3). |
| `APP_GENERATION` | World generation (ADR-161). A blob with a LOWER generation RETIRES — backed up untouched, fresh boot, courteous in-fiction notice. Never migrated, never silently wiped. | Only when old runs are genuinely meaningless. **Human-gated** (§5). |

Every `SCHEMA_VERSION` bump adds a `vN = NAME (ref): …` doc line to the
version-history comment block directly above the constant — read that
block for the full bump history (v10 storywave clean break → current).

## 2. Architecture map — where each guarantee lives

Jargon: an *envelope* is the stored JSON wrapper
(`app`/`schemaVersion`/`generation`/`saveCounter`/`savedAt`/`state`);
a *fixture* is a generated named scenario save (`src/fixtures/`, FB-6);
a *gate* is a `pnpm run verify` check (roster: `src/scripts/gates.ts`).

| Guarantee | Mechanism | Where |
| --- | --- | --- |
| Redundancy | Every save writes to ALL backends (IndexedDB + localStorage + sessionStorage) best-effort; one success = ok, all fail = `all-backends-failed`. | `src/persistence/index.ts`, `saveManager.ts` (`save()`), `backends.ts` |
| Newest wins | Monotonic `saveCounter` (real selector), `savedAt` tiebreak only — the documented `Date.now` exemption. 3-slot ring `kk:save:0..2`. | `saveManager.ts:167-168` sort |
| Poison suppression | `save()`/`backup()` run `validateState` FIRST and refuse to write an invalid state (`poison-suppressed:<reason>`) — an in-memory corruption can't overwrite a good save. | `saveManager.ts` (grep `poison-suppressed`) |
| Crash ring + safe mode | Crash counter at `kk:crash:v1`, deliberately OUTSIDE GameState (ADR-044). Count ≥ 3 → `safeMode` → `loadRollback()` (newest-but-one DISTINCT saveCounter) + counter cleared + calm notice. | `saveManager.ts` (`crashThreshold`, `loadRollback`), `src/app/main.ts:141-148` |
| Pre-migration backup | If the load winner actually migrated, ORIGINAL raw bytes are written once to `kk:premigrate:v<from>` on all backends. | `saveManager.ts` (grep `PREMIGRATE_PREFIX`) |
| Retirement backup | A prior-generation blob → raw bytes to `kk:pre-reboot-backup`, fresh boot, notice via `save.wasRetiredOnLoad()`. | `saveManager.ts`, `main.ts:185-191` |
| Manual backup | `kk:save:backup` (FB-96) — written before `loadFixture`/import/DEV new-game; "↩ last backup" restores through the SAME validate/migrate path. | `saveManager.ts` (`restoreBackup`), `main.ts` (`loadFixture`) |
| Descriptor codec (ADR-186) | STORE channel strips every keyed log entry's prose → gzip → base64 `KKgz1:`-prefixed; words re-render from live registries on load. EXPORT channel is plain base64 JSON (recoverable with any base64 tool). | `codec.ts` (`stripEnvelopeLog`, `rehydrateEnvelopeLog`, `exportBase64`) |
| Boundary validation | `validateEnvelope` (magic → generation gate → future-version guard → **migrate BEFORE validateState**) then `validateState`: a whitelist REBUILD, no `...base` spread — unknown fields age out on first load, one-way. | `validate.ts:135-158`, literal at ~`:365+` |

Load path in one line: for every backend × slot, `decodeStore`
(gunzip + log rehydrate) → `validateEnvelope` → candidates sorted
newest-wins; unparseable blobs are skipped, never fatal.

Honest caveat (in `backends.ts:1-6`): inside one itch iframe partition
all three backends may share storage — export/import is the real
durability guarantee, not the redundancy.

## 3. THE SCHEMA-BUMP RECIPE

First decide the rung (`src/persistence/README.md` → "Schema growth:
the three rungs"):

| Rung | Trigger | Cost |
| --- | --- | --- |
| 1 Additive field | New optional field with a fresh default | Hydration default + (by recent practice) an identity bump |
| 2 Rename/restructure | Renaming/re-shaping anything saves reference | Real migration fn + tests |
| 3 World reboot | Old runs genuinely meaningless | `APP_GENERATION` bump — human-gated, see §5 |

### 3a. Additive field (rung 1) — checklist

Worked committed examples: v13→v14 `merchants` (commit `49206f2b`,
ADR-194) and v14→v15 `asksHeard` (commit `9e2dff3c`, FB-415). Follow
them.

1. Add the field to `GameState` (`src/core/state.ts`) and to
   `createInitialState`.
2. Add its name to the compile-time `_Handled` ledger in
   `src/persistence/validate.ts` (grep `_Handled`). This is the safety
   net: `_AssertAllHandled` makes a new GameState field without a
   validated default a **tsc error** — you cannot skip step 3.
3. Give it a hydration default in the whitelist literal. For numeric
   fields use `numAdditive` (`validate.ts`, grep it): an ABSENT field
   is normal hydration and must NOT set `coerced` — that would falsely
   fire the "We mended a small problem in your saved game" notice
   (`src/app/main.ts`, grep `mended`). Only present-but-invalid
   counts as a repair.
4. Bump `SCHEMA_VERSION` + add an **identity** step to `migrate.ts`
   (`N-1: (state) => state`) + the `vN = …` doc line in
   `constants.ts`. Strictly rung 1 needs no bump (README), but the
   last three bumps (v12→v13, v13→v14, v14→v15) all recorded additive
   changes this way — "the bump records the format change". Follow the
   newer practice — and update `src/persistence/README.md`'s rung-1
   row to record the always-bump practice in the SAME commit (the
   README is the canonical doc; a living doc that disagrees with the
   build gets fixed, never annotated around — decisions.md
   precedence).
5. Test the hydration: build a pre-bump state (delete the field from a
   fresh state, wrap in an envelope with the OLD `schemaVersion`), run
   `validateEnvelope`, assert the default. Live example:
   `src/core/asks.test.ts:170-190` ("a v14 state never carried the
   field" → hydrates to `{}`).
6. Regen fixtures — see 3d.

### 3b. Real migration (rung 2) — checklist

Renaming an id that saves reference — a flag, a quest step, a
surface/discovery/dialogue id, a site `area` — IS a restructure:
without a migration the old fact is silently orphaned (a gate never
opens, or a done beat replays).

1. `MIGRATIONS` in `migrate.ts` is keyed by the FROM version;
   `Migration = (state: unknown) => unknown`. The runner walks one
   step at a time; a gap stops the chain (`migrate.ts`, grep
   `a gap stops the chain`) — pre-v10 has no steps by design
   (ADR-161: prior-generation blobs never reach migrate).
2. Two committed templates:
   - **Field restructure** — v10→v11 (`migrate.ts:30-45`): cast to a
     loose shape, destructure-drop the dead field, return a new object
     seeding the successor, synthesizing any fact the old field was
     the only record of.
   - **Content-key rewrite** — v11→v12 (`migrate.ts:60-79` +
     `nameVnIndexes`): map over `log.entries`, rewrite `contentKey`
     via the LIVE registries, and **leave an unresolvable key
     untouched** — the codec falls back to stored prose (degrade,
     never lose). Read its timing-doctrine comment: rewriting
     positional indexes was sound ONLY in the release that added ids
     and re-ordered nothing.
3. Make it idempotent-safe where possible (v13→v14 comment: "a
   present map is kept as-is, so re-running can never double-grant").
4. Know the notice semantics: `didMigrate` is
   `migratedState !== raw.state` (`validate.ts:154-155`) — an
   identity step returns the same reference, so it does NOT trigger
   the "We updated your saved game" notice or the pre-migration
   backup. Only real transforms do.

### 3c. Migration TEST pattern

Model on `src/persistence/migrate.test.ts` (the v11→v12 block,
`describe('v11 → v12 …')`, is the worked example):

- Fixtures are **hand-built inline object literals**, not frozen
  blobs: a "v10 save" is `{ schemaVersion: 10, … }` constructed in
  the test (see also `save.test.ts:195-207`).
- Expectations are **registry-derived, never copied slugs** (AGENTS.md
  test discipline): the v11→v12 tests pick a real beat from
  `RUNG_BEATS` and assert the migrated key renders the SAME WORDS via
  `renderLogLine`.
- Wiring-level: plant a JSON envelope into a `MemoryBackend` under
  `kk:save:1`, `mgr.load()`, assert `migrated === true` + transformed
  fields (`save.test.ts:172+`). Also keep the future-version guard
  honest: `schemaVersion + 1` → `load()` returns null
  (`save.test.ts:~250`).
- Chain mechanics use a FAKE injected chain
  (`migrate(state, from, to, fake)`); `SaveManagerOptions.migrate` is
  the injectable seam.
- Fixing a save bug? Repro → failing test FIRST — use the `tdd` skill.

### 3d. What MUST land in the SAME commit

- **Fixtures regen**: `pnpm run fixtures:regen` (=
  `tsx src/scripts/gen-fixtures.ts`). The `fixtures` verify gate runs
  `--check` (`src/scripts/gates.ts:41-44`) and goes RED if committed
  `src/fixtures/saves/*.json` don't match — every fixture carries
  `schemaVersion` twice (envelope + state). Count them with
  `ls src/fixtures/saves | wc -l` (19 at authoring); never hand-edit
  one. Gate detail: **kami-verify-gates**.
- The `vN` doc line in `constants.ts` (§1).
- The migration + its tests.
- Shared tree: commit by explicit file pathspec only, and re-check
  `git diff --cached --name-only` — fixture regen touches many files
  a co-agent may also be holding.

**Change-control note:** a schema bump is never its own project — it
rides its feature's plan (e.g. the v15 bump is a named step of
`docs/plans/fable-2026-07-17-talk-system-redesign.md`). What is
agent-safe vs human-gated: **kami-change-control**.

## 4. Hazards — each with its incident

- **Content-id renames orphan old saves SILENTLY.** The DEV-only
  orphaned-id sensor (`src/persistence/orphans.ts`, wired in
  `main.ts` behind `import.meta.env.DEV`) diffs stored ids against
  live registries and console-reports each group with its consequence
  string. It is deliberately a **sensor, never a gate** — a rename is
  a legitimate authoring act; failing the build would cry wolf; the
  fix (a rung-2 migration) belongs to the author. `flags` are
  deliberately excluded (free-form, no roster).
- **The sensor itself cried wolf once** (recorded in
  `orphans.ts:51-59`): `deliveredDialogue` stores LINE ids, not
  dialogue ids — diffing against `DIALOGUE_IDS` reported every
  delivered line on a perfectly clean save. "A sensor with false
  positives is worse than no sensor." Fix = `liveDialogueLineIds()`;
  the cry-wolf regression tests live in `orphans.test.ts`. Before
  trusting an orphan report, confirm the group's id-space matches
  what the state actually stores.
- **`greeting.<i>` / `stage.<i>` log keys are POSITIONAL** (README
  "Known limit"). v11→v12 closed this for greeting/answer lines by
  giving them authored ids; `nameVnIndexes` has NO `stage` handling —
  re-ordering a scene's stage lines re-points an old save's line to
  its neighbour. That is a rung-2 restructure and the orphan sensor
  cannot see it. UNVERIFIED whether any live save carries `stage.<i>`
  keys today — check before assuming safety.
- **KNOWN GAP — no standing gate proves "an old save still opens"**
  (`project/BACKLOG.md`, grep `old save still opens`; parked
  deliberately). Session 192's v11→v12 proof was a throwaway browser
  script (plant a real v11 blob, boot, read the log — passed, then
  deleted). A permanent e2e needs a committed pre-bump blob PER bump
  (maintenance cost that rots); the unit lane covers the migration
  itself. "Reach for it the first time a schema bump breaks a save
  silently." Recipe: the session-192 journal
  (`project/journal/2026-07-13-session-192-*.md`). This stays OPEN —
  after any nontrivial migration, run the manual proof yourself.
- **`renderLogLine` import trap**: import from
  `core/content/log-render`, NEVER `log-content` — the latter is a
  deliberate leaf that throws on namespaced keys; "has bitten three
  test files" (README §"The log"). First thing to check if
  rehydration explodes.
- **Every emit site needs a resolving `contentKey`** — gated by
  `core/content/log-keyless.test.ts`: RED if prose reaches the save
  AND if an emitted key does not resolve (an unresolvable key is
  worse — codec falls back to stored text and silently stops tracking
  `src/`).

## 5. The generation break (ADR-161) — when the nuke is legitimate

Precedent: the storywave T0 rewrite (v10) deleted the v1→v9 chain and
bumped `APP_GENERATION` to 2 — old runs were meaningless under the new
world model. The lever is legitimate ONLY for a design reset of that
magnitude, "not a schema tool" (README rung 3). Even then nothing is
destroyed: raw bytes back up to `kk:pre-reboot-backup` and the player
gets the authored in-fiction notice ("An older record of your time
here has been closed and laid away…", HD-30 wave) — never a crash,
never a silent wipe. **This is a human decision** — wiping player
saves is irreversible-facing (PH4: stop and ask; route through
**kami-change-control**). Do not bump `APP_GENERATION` autonomously.

## When NOT to use this skill

- Fixture *content* (which scenarios exist, adding one) — that's
  `src/fixtures/specs.ts` territory: **kami-extension-recipes**.
- The `fixtures` gate (or any gate) RED beyond §3d:
  **kami-verify-gates**.
- Driving/observing the game headlessly, `window.__qa`:
  **kami-debugging-playbook** and `docs/guides/qa-playtesting.md`.
- Narrative line-id / grammar authoring (`.md` → `*.gen.ts`):
  **kami-narrative-grammar**.
- What's human-gated vs agent-safe generally: **kami-change-control**.
- Incident back-story in depth: **kami-failure-archaeology**.
- `?fixture=` and other URL params / flags: **kami-config-and-flags**.
- Glossary (rung, gate, envelope, fixture…): **kami-domain-reference**.
- Writing the failing test first: the existing **tdd** skill.

## Provenance and maintenance

Authored 2026-07-18 from repo state at HEAD `4bfb3ba3`. Volatile
facts as of that commit: `SCHEMA_VERSION = 15` (committed in
`9e2dff3c`, FB-415 step 1 — the talk-system plan is still in
progress, so expect further bumps), `APP_GENERATION = 2`, 19 fixture
saves, crash threshold 3, ring 3 slots.

Re-verify before relying on:

```bash
grep -n "SCHEMA_VERSION\s*=\|APP_GENERATION\s*=" src/core/constants.ts
ls src/fixtures/saves | wc -l
sed -n '1,50p' src/persistence/README.md        # doctrine still current?
grep -n "old save still opens" project/BACKLOG.md   # gap still open?
grep -n "stage" src/persistence/migrate.ts      # stage.<i> still unmigrated?
git log --oneline -3 -- src/persistence/        # anything moved since?
```

Line-number cites (`validate.ts:154-155` etc.) drift with edits —
trust the grep anchors given beside them over the numbers.
