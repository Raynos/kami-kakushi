---
name: map-sheets
description: Build, edit, and verify the game's survey-sheet maps (src/ui/map-sheets/) — move or add zones/landmarks, draw new terrain/building/feature primitives, tune tier deltas, or design a whole new tier sheet (T2 valley, T3 route map, T4 town plan, T5 province) — all under the golden pin + blind-pass verification loop. Use for ANY map/sheet change: "edit the map", "add a zone", "draw X on the map", "build the T2 map", "the map looks wrong at Y".
---

# Map-sheets — the map work entry point

Everything map is pin-guarded and rubric-verified, so most jobs are safe for
any model — IF you follow the route below. Deep knowledge lives in three
guides; this skill routes you and holds the non-negotiables.

**Read first (5 min):** [`src/ui/map-sheets/README.md`](../../../src/ui/map-sheets/README.md)
— the five laws + module map. Don't touch code before it.

## Route your job

| job | procedure |
|---|---|
| Move/resize/polish something drawn | [`map-authoring.md`](../../../docs/guides/map-authoring.md) **§2** |
| Add a zone (seal + ground + roster) | map-authoring **§3** |
| New terrain/building/feature primitive | map-authoring **§4** |
| Tier differences (fresh/drained/lit/ruin-reveal) | `TIER_DELTA` in `ground.ts` (README "where does my change go") |
| **New tier sheet** (T2+ / new scale class) | [`map-styles.md`](../../../docs/guides/map-styles.md) **§4** — SPEC FIRST, the human reads it (HR-item) BEFORE you build. Never skip this gate. |
| Zone text / rumor notes / names | fiction-voiced → the `narrative-diverge` skill (ADR-139), not a solo edit |
| Restyle the committed look | taste territory: ADR-135 scorecard + HR-item; check with the human |

## The non-negotiables (every map change)

1. **Pin discipline.** `pnpm exec vitest run src/ui/map-sheets/` after every
   edit. Refactor → pin stays GREEN, no regen. Visual change → pin RED →
   capture (`node src/scripts/map-audit-shots.mjs tmp/<slug>/`), **look at
   the PNGs yourself**, then regen
   (`UPDATE_MAP_GOLDEN=1 pnpm exec vitest run src/ui/map-sheets/golden.test.ts`)
   and commit the hash WITH the change. Never regen an unexplained RED.
2. **Look-bearing change → blind pass.** Run the committed runner, scoped
   to the sheet you edited: Workflow
   `{ name: 'map-blind-pass', args: { sheets: ['T1'] } }` (needs the dev
   server: `pnpm run dev`). Full both-sheet pass only for `layout.ts`
   geometry moves, HR/milestone closes, or a new tier's acceptance. All
   map-spec §5 **M** lines must pass, ≥ half **S**. The report lands in
   `project/audit/reports/` — commit it.
3. **Determinism.** `rng(seed)` only; sub-seeds as `` `${o.seed}:part` ``
   template strings; no `Math.random`/`Date`; Andon tokens only, no hex.
4. **Data over drawing.** Positions/polygons → `layout.ts`; narrative →
   `nodes.ts`; tier state → `TIER_DELTA`; fog → `REVEAL` data. If you're
   hardcoding coordinates in a painter, stop (map-authoring §3.3).
5. **Verify + ship.** `pnpm run verify` green → pathspec commit (shared
   tree) → journal. Sheets on screen: `?t1-map-demo` / `?t2-map-demo`;
   T0 ships on the real Map tab (FB-364) — headless review captures go
   through `openTierMap('T0')` (see `map-audit-shots.mjs`).

## Escalate, don't improvise

New scale-class style, new rubric lines, look restyles → the taste-heavy
artifacts; hand them to the human (HR-item) or a Fable session
(map-authoring §6). Everything else here is yours.
