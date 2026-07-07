# Session 100 — 2026-07-07 — DEV rung buttons load real rung-start scenarios

**Summary:** The DEV panel's R0–R7 rung buttons were effectively broken — `toRung`
teleported via `applyPromotion` only, landing in an incoherent run (no real
unlocks/panels/resources for the rung). Rewired them to LOAD a new hidden
`rung-R0…R7` scenario set (the real climb driven to the first tick at each rung),
added a `post-cold-open` fresh-start scenario, and grouped + sorted the Scenarios
pane into game-progression sections. Human ask (2026-07-07).

## What changed
- `src/fixtures/specs.ts` — `FixtureSpec` gains `group` (required section header)
  + `hidden?`. Added the 8 `rung-RX` mechanical specs (hidden, one per RANK,
  `drive` to the first tick at that rung) and `post-cold-open` (open_eyes → ask
  the first topic on each NPC intro scene → close each scene; lands at the
  intro-done cursor). Assigned groups to the 8 existing specs; exported
  `FIXTURE_GROUP_ORDER` (earliest-in-game first).
- `src/fixtures/index.ts` — `FixtureEntry` carries `group` + `hidden`.
- `src/app/main.ts` — `qa.fixtures()` filters hidden + sorts by
  `FIXTURE_GROUP_ORDER` (stable within group). `loadFixture`/`?fixture=` still
  resolve hidden fixtures by name.
- `src/ui/dev.ts` — rung buttons now call `qa.loadFixture('rung-'+id)` (backup-first,
  non-destructive) then re-mark + enable restore. Scenarios pane renders a header
  per group.
- `src/fixtures/saves/*.json` — regenerated; 9 new saves (post-cold-open + rung-R0…R7).

## Verification
- `pnpm run verify` — 17 gates green. `fixtures:check` clean (17 up to date).
- Headless drive (`?dev=yes`): `qa.fixtures()` groups/sorts correctly, hidden
  rung-* filtered out; `loadFixture('rung-R5')` → R5 with 42 unlocked surfaces
  (coherent, not a husk); `post-cold-open` → awake, introBeat=3 (done), 2 topics
  asked; zero console errors.

## Next intended steps
1. Nothing blocking. `toRung` is retained for headless drivers/e2e (unchanged).

## Landmines
- The Scenarios pane relies on `qa.fixtures()` returning group-contiguous, sorted
  entries — the grouping/sort lives in `main.ts`, not the pane. A new fixture group
  must be added to `FIXTURE_GROUP_ORDER` or it sorts last.
- `rung-R0` intentionally sits INSIDE the cold-open intro (R0 is the intro period);
  R1+ have the intro completed by the drive policy.
