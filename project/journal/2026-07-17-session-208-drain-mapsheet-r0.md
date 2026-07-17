# Session 208 — 2026-07-17 — inbox drain (mapsheet + r0) + the port move

**Summary:** Drained both pending inbox lanes (FB-411…FB-415): four
approved bug fixes landed one commit each; FB-415 routed to a grill-me
→ plan session (human call). Mid-pass the human lost the shared dev
server to rival prototypes' vite instances — the canonical port moved
to **5264** ("KAMI" on a phone keypad). Also parked the T2 rungs+fog
plan out of the reading queue (human call).

## What changed
- `722ce323` — T2 rungs+fog plan parked (Status ⏳ PARKED; queue entry
  removed — per the BACKLOG header's no-plan-pointers ruling).
- `2ea6ced8` — **dev server → :5264**: vite `DEV_PORT` +
  `singleServerGuard`, `guard-dev-server.sh`, QA-script defaults
  (qa-shots, map-audit-shots, save-smoke, telemetry-smoke,
  map-blind-pass), AGENTS.md / qa-playtesting / shared-tree-git /
  BACKLOG / snapshot. Journals + ADRs keep historical 5173.
- `f4d2db61` — **FB-412**: live sheet's fog-frontier washes now consult
  `zonesAtRung` (R4 woodshed/drill-yard no longer tease at R1); washes
  carry `data-fog-node`; RED-first test in `map.test.ts`.
- `f9791670` — **FB-413**: village caption pair nudged ~24 units up
  clear of the fog displacement band (±14 jitter vs 13-unit margin —
  could not reproduce on HEAD, margin fix); golden pin regenerated.
- `e3a20fc5` — **FB-414**: stables caption y 1402 → 1432, below the
  building; pin regenerated.
- `1d4f52b4` — **FB-411**: `.verb[disabled]` reads dead at a glance
  (flat fill, dashed border, opacity .45) — the FB-265 gate was firing;
  the defect was legibility (TST4).
- `project/feedback-human/2026-07-17-playtest-{mapsheet,r0}.md` — the
  two lane ledgers; sidecars stamped done (FB-415 stays open).
- T0 map-blind-pass over the committed look (map-authoring §5):
  **PASS** — 7/7 mandatory lines at 3/3 readers; one pre-existing
  secondary (R9 orchard/bamboo nuance) marginal at 1/3, untouched by
  this drain. Report:
  `project/audit/reports/2026-07-17-t0-map-blind-pass.md`; mapsheet
  bucket archived.

## Next intended steps
1. Grill-me on FB-415 (the talk system: gameplay point, story point,
   where lines land) → `docs/plans/` plan; then stamp FB-415's sidecar
   and archive the r0 bucket.
2. Human relaunches the herdr dev-server pane — `pnpm run dev` now
   binds :5264.

## Landmines
- Two OTHER games' vite servers squat :5173/:5174 on this box — never
  kill them; kami is :5264 now.
- The golden pin changed twice (f9791670, e3a20fc5) — deliberate
  regens, human-approved captures in the drain thread; eyeball
  `map-audit-shots` before the next push if in doubt.
- Verify budget: median 6.04s (soft 5s) on this loaded box — one
  commit needed `SKIP_BUDGET=1` during a 9s spike; watch it.
