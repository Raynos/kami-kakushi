# Session 166 — 2026-07-10 — strip the resolved estate/tracker DEV variants

**Summary:** The human noticed that the Estate-section and Build-tracker diverge
alternates were still live in the DEV menu even though HR-9 (V0A · estate-a) and
HR-11 (V1A · tracker-a) had been picked and archived. The archive claimed the
alternates were "KEPT as reference"; the human's steer this session was to remove
them now (they survive in git history for the coming redesign). Stripped
`estate-b/c` and `tracker-b/c` from the code and DEV registry. No ADR — a
cleanup executing an existing pick, not a design change.

## What changed
- `src/ui/dev.ts` — removed the `estate-section` and `build-tracker` entries from
  the `SURFACES` registry, their two dispatch branches in `renderSurfaceVariant`,
  and the two alternate renderers (`renderEstateVariant`, `renderBuildTrackerVariant`,
  ~250 lines). Dropped the now-orphaned imports (`ESTATE_STAGES`, `isUnlocked`,
  `estateBuild`, and `ESTATE_STAGE_NAMES`/`HOUSE_ROOMS` from `./render`).
- `src/ui/render.ts` — removed the two DEV diverge hooks: the estate-section
  wholesale clear-and-rebuild block in `renderEstate` (which also stopped the
  DEV-only per-render shell teardown) and the `build-tracker` ladder-repaint
  branch (collapsed to the plain default). `ESTATE_STAGE_NAMES`/`HOUSE_ROOMS`
  stay exported but are now render.ts-internal (prod default path); stale
  "exported for the DEV variants" comments corrected.
- `src/ui/dev.test.ts` — deleted the `renderer variant routing — Estate section`
  describe block (the estate-b/c routing tests). The prod default's coverage
  lives in `render.test.ts` (`renderEstate — the improve card survives a
  re-render`, F100 tab-placement).
- `project/human-in-the-loop/archive.md` — corrected the HR-9/HR-11 rows: the
  alternates are now STRIPPED, not "kept as reference".

## Not touched (deliberately)
- `src/ui/estate-sheet/` (the E1 okoshi-ezu survey-plan prototype, `openEstateSheet`)
  is a SEPARATE surface (HR-7 resolved) — `estate-cutaway` is not an `estate-c`
  variant. Left intact.
- The estate-upgrades redesign plan (`docs/plans/fable-2026-07-10-estate-upgrades-redesign.md`)
  is unchanged — it will re-diverge from scratch, so nothing here pre-empts it.

## Verification
- `pnpm run verify` — 18 gates green in 5.51s (vitest slowest at 5.51s).
- Repo-wide sweep for `estate-b/c`, `tracker-a/b/c`, `renderEstateVariant`,
  `renderBuildTrackerVariant`, and the surface-id strings: clean (only a
  false-positive substring hit in `estate-sheet/demo.ts`'s "estate-cutaway").

## Next intended steps
1. None required — self-contained cleanup. The estate/upgrades redesign remains
   the parked follow-on.

## Landmines
- `ESTATE_STAGE_NAMES`/`HOUSE_ROOMS` kept their `export` though no other module
  imports them now (render.ts-internal). Harmless; left to avoid churn.
- The build-tracker default path in `renderEstate` now sits in a bare `{ }`
  block (kept to scope `build` and minimise the diff) — if a linter later flags
  lone blocks, unwrap it.
