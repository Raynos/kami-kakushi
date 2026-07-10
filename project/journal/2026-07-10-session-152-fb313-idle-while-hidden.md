# Session 152 — 2026-07-10 — FB-313: auto-play keeps ticking while the window is hidden

**Summary:** drained the last open r0-bucket capture (FB-313). The auto loop
stopped whenever the game window lost focus because it gated on
`document.hidden` (which macOS window-occlusion trips for a covered dedicated
window). Human picked "live tick while hidden" from a surfaced fork; removed the
`document.hidden` guard and the hide-time `cancelAll`. ADR-174 (refines ADR-148);
PRD §2 rippled. r0 bucket fully drained → archived.

## What changed
- `src/app/main.ts` — `autoStep` no longer gates on `document.hidden` (only
  `paused`/`crashed`); the `visibilitychange→hidden` handler no longer
  `clock.cancelAll()`s the in-flight action, just flushes a save.
- `docs/living/decisions.md` — new **ADR-174** (a hidden-but-open window stays
  active; refines ADR-148).
- `docs/living/prd/02-systems.md` — rippled the two "PAUSES on `document.hidden`"
  passages to "hidden-but-open keeps ticking (throttled); halts on tab-CLOSE".
- `project/feedback-human/2026-07-10-playtest-r0.md` — FB-313 entry (✅).
- `project/playtest-inbox/pending/r0/…15-29-53.json` — sidecar stamped done.
- r0 bucket `.md` + sidecars `git mv`'d pending → archive (all 26 done).

## Verification
Headless drive (`tmp/fb310-check.mjs`) with `document.hidden` forced true
throughout: armed auto-rake advanced the game clock (tick 0→2) while hidden.
Before the change the `document.hidden` guard held it at tick 0 by construction.

## Next intended steps
1. `pending/` r0 bucket is empty/archived; other lanes untouched. No open r0
   captures remain.
2. The review stack (HR-1, HR-24, HR-2A–2D, HR-5/6/9/11, HR-18–23) still awaits
   the human.

## Landmines
- The change leans on the browser's throttling tiers (occluded window ~1 s;
  background tab intensive-throttled ~1/min after 5 min) to approximate
  "dedicated-window-yes / 5-tabs-no". There is NO web API to distinguish the two
  hide-cases — that's a platform limit, documented in ADR-174.
- Minor background battery cost is accepted (the human chose this over
  catch-on-return). If FB-8 telemetry shows a throttled-cadence pacing surprise,
  revisit.
