# Session 180 — 2026-07-11 — build the save-format streamline plan

**Summary:** The human ruled all eight open questions on
`docs/plans/fable-2026-07-11-save-format-streamline.md` (recorded in the plan as
"Locked decisions"), then went AFK with a "build the whole thing" go-ahead. The
plan is being built in the ruled order **5 → 3 → 2 → 4 → 1** — small correctness
sweeps first, the orphan sensor armed before the big log-descriptor migration
lands.

The load-bearing ruling: **the log is a derived VIEW, not a transcript.** Every
log line persists `contentKey` + `params` and re-renders from the *current* `src/`
registries on load, so a reworded beat rewrites what an existing save's scrollback
shows. That is intended, and it ships as an ADR with step 1.

## Entries

### 1 · Locked the eight open questions (pre-build)

Put every open call on the plan to the human before writing a line of code, rather
than self-picking the reversible ones (this is a doctrine change to the save
format, so the blast radius is every existing save):

1. Log = derived view; full re-render of all prose, narrative included. → ADR.
2. The keyless-entry ban is **gated** (a test that can go RED), not a norm.
3. `validateState` drops the `...base` spread; no schema bump. One-way per save.
4. Cycle fix: a new `log-render.ts` composition module, **not** the plan's
   register-a-resolver-at-module-init scheme — module-init registration makes
   rehydration order-dependent, and a content module not yet imported when
   `codec.ts` rehydrates falls back *silently* to the stale stored text. That is
   the exact bug the plan exists to kill, made invisible.
5. Orphaned-id detector = a DEV-panel sensor + `console.info`, not a red test.
6. `sitePools`: a missing key hydrates as freshly refilled.
7. Build order 5 → 3 → 2 → 4 → 1.
8. Fixture regeneration happens once, at the end of step 1, coordinated with the
   co-agents live in this shared tree.

Also re-grounded the plan against HEAD (PH2 — the plan carried a stale-survey
warning): findings 2, 4 and 5 all still hold, `log-content.ts` is still a true
leaf (imports only `./names` + `../format`), and **step 5's "ship the persistence
README" was stale** — that README already exists at 118 lines, so step 5 became an
*amendment*.

- `docs/plans/fable-2026-07-11-save-format-streamline.md` — status LOCKED, the
  eight rulings, the re-grounding, the corrected build order + sync ripple.

### 2 · Step 5 — weapon wear derives from the weapon def

`weaponDurability`'s load fallback was a hardcoded `40` (the *carrying pole's*
max), so a save carrying a yari hydrated to the wrong weapon's durability, and a
rebalanced max in `src/` never reached an existing save. Now derived from
`getWeapon(equipped).durabilityMax`, and a stored wear *above* the current max
re-clamps down on load.

**Found while building:** `getWeapon()` THROWS on an unknown id, so a weapon
renamed or removed in `src/` rode through the save and crashed the UI at first
render rather than degrading — the same class of bug the `location` clamp already
guards against. Clamped `equippedWeapon` to a live weapon id too.

There was **no direct test of `validateState`** at all, so this adds
`src/persistence/validate.test.ts`, with every fixture derived from the live
registry rather than a copied number — a test that hard-coded `40` could not have
caught the bug it was guarding (the ADR-086 rule, applied to itself).

- `src/persistence/validate.ts` — weapon-id clamp + def-derived durability bound.
- `src/persistence/validate.test.ts` — NEW.
- `src/persistence/README.md` — a "clamp it to the registry on load" rule: a
  stored id is only as good as the registry it points at.

## Next intended steps

Steps 3 → 2 → 4 → 1 of the plan, in that order. Step 1 is the bulk and ends with a
single coordinated `pnpm run fixtures:regen`.

## Landmines

- **Three co-agents are live on this tree.** Commit by explicit file pathspec only.
- Step 1 will make old saves' narrative prose re-render from current `src/`. That
  is the intended, human-ruled behaviour — not a regression to "fix" on sight.
