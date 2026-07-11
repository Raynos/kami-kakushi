# src/persistence — the save layer

How a run is persisted, loaded, validated, migrated, and exported. This README is
the orientation doc for the save-file format; the doctrine it enforces is:

> **The source code is the source of truth for how the game behaves. The save
> file holds only the player's FACTS — stats, levels, skills, inventory, story
> choices, ceremony history. Anything derivable from those facts + the current
> `src/` content is DERIVED on load, never stored.**

So a content move (a verb re-homed, a beat moved rung→rung, a UI restyled)
must never require a hard reset: on load the game re-derives what is shown
from the save's facts against the *current* code. If a change makes that
untrue, the change is missing a migration or is storing something it should
derive (see "What may be stored" below).

## The module map

| File | Role |
| --- | --- |
| `saveManager.ts` | Orchestrator: redundant atomic writes to all backends, newest-wins load (monotonic `saveCounter`, `savedAt` tiebreak), 3-slot rolling ring, crash counter + safe-mode rollback (ADR-044), FB-96 backup slot, ADR-161 retired-generation backup, base64 export/import. |
| `codec.ts` | The `SaveEnvelope` + two channels: **store** (log descriptors stripped → JSON → gzip → base64, `KKgz1:`-prefixed) and **export** (plain base64 JSON — recoverable with any base64 tool, never coupled to our gzip). |
| `validate.ts` | The persistence→core boundary. Structural checks (RNG/clock/log corrupt ⇒ recovery), cosmetic coercion (clamps), and **additive hydration** — every missing field gets its fresh default, so old saves keep loading as the schema grows. It is a **whitelist rebuild**: the state is built from validated fields only (no `...base` spread), so a field retired from `GameState` ages out on the next load instead of riding in saves forever. Safe by construction — the compile-time `_Handled` ledger makes a new `GameState` field without a default a **tsc error**, so the literal can't fall behind the type. One-way: an unknown field is dropped, not preserved. |
| `migrate.ts` | The ordered forward migration chain, v10+ (the pre-storywave v1→v9 chain is deleted — ADR-161 clean break; git history is its archive). |
| `backends.ts` | IndexedDB + localStorage + sessionStorage (+ Memory for tests), all best-effort redundant. |
| `index.ts` | Wiring: `createBrowserSaveManager()` / `createMemorySaveManager()`. |

What is **not** here: device-scoped UI preferences (`src/ui/ui-prefs.ts`,
`kk.ui.*` localStorage keys) and DEV-panel state — those never enter the save.

## The envelope

```jsonc
{
  "app": "kami-kakushi",   // identity magic — a foreign blob → recovery, never a crash
  "schemaVersion": 11,      // core/constants SCHEMA_VERSION — gates the migration chain
  "generation": 2,          // core/constants APP_GENERATION — a LOWER one RETIRES (ADR-161):
                            // backed up untouched under kk:pre-reboot-backup, fresh boot,
                            // courteous notice. Never migrated, never silently wiped.
  "saveCounter": 123,       // monotonic — the real newest-wins selector
  "savedAt": 1760000000000, // wall clock, tiebreaker only (the documented Date.now exemption)
  "state": { /* GameState */ }
}
```

Storage keys: `kk:save:0..2` (the ring) · `kk:save:backup` (FB-96 pre-wipe
snapshot) · `kk:premigrate:v<N>` (raw pre-migration bytes, kept once per
migrating load) · `kk:pre-reboot-backup` (retired-generation bytes) ·
`kk:crash:v1` (crash counter — deliberately OUTSIDE GameState).

## What may be stored (and what must not be)

`src/core/state.ts` is the canonical stored shape; its header comment carries
the same rule. The tests for membership:

**Store it** if it is a player fact the code cannot reconstruct:
- resources, banked stores, character vitals/attrs/levels/XP, inventory
  (belongings, weapon + durability), location, rung/tier
- story choices + their consequences (`flags`, `npcMemory`, `askedTopics`,
  quest progress), the RNG seed + cursors (determinism), the manual calendar
- **ceremony history** — write-once "already announced/played/found" latches
  (`seenReveals`, `scenesPlayed`, `deliveredDialogue`, `discovered`). These are
  never read for *visibility* — only to stop a reload from re-playing a
  one-time reveal/beat (ADR-179).
- the event log — the house's durable memory (FB-160/161) — as **descriptors**
  where possible (see below)

**Clamp it to the registry on load** if the fact NAMES a piece of content: a
stored id is only as good as the registry it points at, so `location` clamps to
a live map node and `equippedWeapon` clamps to a live weapon (`getWeapon` throws
on an unknown id — an un-clamped stale id crashes the UI at first render, it does
not degrade gracefully). Bounds come from the def, never a literal:
`weaponDurability` is clamped to the CURRENT `durabilityMax`, so rebalancing a
weapon down in `src/` re-clamps every existing save's wear on load.

**Derive it** (never store) if the current code can compute it from facts:
- every derived stat (`hpMax`, `satietyMax`, season/year from the calendar)
- **UI visibility** — what surfaces/tabs/verbs are shown derives per-load from
  progression facts via `core/unlock` (ADR-179). A stale save can never pin
  stale UI: change the unlock rules in `src/` and every existing save reflects
  them on next load.
- forecasts/previews (AC-6 — same pure fn as the action), display conversions
  (koku/bales from shō), granted keepsakes (derived from the home surface)

**Reset it on load** even though it is stored: in-flight automation targets
(`autoActivity`, `autoRake`, `autoCombat`) — a loaded save starts idle (FB-32);
`autoCombatRetreat` survives because it is a preference, not a target.

## The log: descriptors, not prose

The log dominates the save (~90% of bytes raw). A **keyed** entry
(`contentKey` + `params`) drops its `text` in the store channel and re-renders
it on load from `core/content/log-content.ts` — so a reword in `src/` updates
all history on next load ("re-derivation is fine", human 2026-07-05), and old
prose can never go stale. A **keyless** entry keeps its text verbatim
(legacy/transitional). When adding a log emit site, give it a `contentKey` —
inline prose is the exception, not the rule. (Migrating the remaining keyless
emitters — narrative beats, reveal lines, discovery/works/perk lines — is
planned: `docs/plans/fable-2026-07-11-save-format-streamline.md`.)

## Schema growth: the three rungs

1. **Additive field (the default).** Add the field to `GameState`, give
   `validate.ts` its fresh default (`numAdditive` / the explicit-default
   pattern — the compile-time `_Handled` ledger forces you to). Old saves
   hydrate the default. No schema bump, no migration.
2. **Rename / restructure / delete-with-meaning.** Bump `SCHEMA_VERSION` and
   add a step to `migrate.ts`. **Renaming an id that saves reference —
   a flag, a quest step, a surface/discovery/dialogue id, a site `area` —
   is a restructure**: without a migration the old fact is silently orphaned
   (a gate never opens, or a done beat replays). The chain is tiny (v10+);
   keep it that way, but never skip a step to avoid it.
3. **World reboot.** Bump `APP_GENERATION` (ADR-161): every prior save retires
   with a backup + courteous notice. Reserved for changes where old runs are
   genuinely meaningless — a design reset, not a schema tool.

## Testing without hard resets

- **Fixtures** (`src/fixtures/`, FB-6): named scenario saves generated by
  driving the REAL engine (`specs.ts` → `gen-fixtures.ts`); load via the DEV
  panel Scenarios tab, `__qa.loadFixture(name)`, or `?fixture=<name>`. This is
  the intended "get me to state X" path — never hand-edit a save.
- Imports/fixture loads go through the SAME decode → migrate → validate path
  as a boot load, so they exercise hydration for free.
- `save.test.ts` / `codec.test.ts` / `migrate.test.ts` / `save-e2e.test.ts`
  here, plus `src/tests/e2e/persistence.spec.ts` (real browser).
