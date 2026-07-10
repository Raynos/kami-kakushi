<!-- Copy to journal/{YYYY-MM-DD}-session-{NN}[-{topic}].md. ONE file per session. -->

# Session 137 — 2026-07-10 — the telemetry folder garbage-collects itself

**Summary:** The human asked why `project/telemetry/` held 24 reports when they'd
barely played. Answer: a report is one *run*, not one playthrough, and nothing
ever swept them — 15 were time-tainted DEV driving, 8 were sub-2-minute page
pokes, 1 was a real session. The session brief counted all 24 every morning.
Added a retention policy at the write edge (`src/telemetry/retention.ts`), swept
the folder (24 → 3, then 4 as a live run dropped), and reworded the brief.
No ADR — this implements the FB-8 README contract's own admission test rather
than changing intent; the README's "no pruning in v1" clause is superseded
in place, with the reason recorded.

## The finding

- **24 files ≠ 24 playthroughs.** `startRun()` mints a fresh runId on every boot
  that can't resume for the seed, and on every save-import / fixture load
  (`src/telemetry/index.ts:209-250`). Total attended time across all 24 was
  **139 minutes** (Jul 6–10) — 8 of them under 2 minutes.
- **The corpus was nearly unusable.** 15 carried TIME taints (`speed>1`,
  `toRung`, `jumpToPhase2`) — excluded from vs-sim by the FB-8 honesty rule, so
  they can never inform balance. Only one run was both clean and long enough to
  characterise a rung (the 49.2-min save-imported one that produced the single
  distillation commit `3ab10c9`).
- **The brief's counter was structurally a wolf-crier.** It counted reports newer
  than the last commit whose subject starts with `balance(` — and there has been
  exactly **one such commit ever** (`32bba42`, 2026-07-05). So the count could
  only climb, forever, weighting a 20-second poke equal to a 49-minute session.
  Its own comment says "SILENT at zero — a gate that cries wolf teaches deafness."

## What changed

- `src/telemetry/retention.ts` — **new.** Pure `keepReport(text)`. Drops
  time-tainted runs (any length) and runs under `T0_PACING_BAND_MIN` attended
  minutes (read from the balance constants, never a copied literal — a run
  shorter than the fastest in-band rung cannot characterise one rung). Keeps
  ORIGIN marks (`save-import`: honest clock, unknown economy). **Fails open** —
  an unparseable header is kept, never deleted, because this module authorises
  `unlinkSync`.
- `src/telemetry/retention.test.ts` — **new.** Fixtures render *through*
  `formatRunReport`, so a format drift fails here rather than silently turning
  the GC into a no-op (or a delete-everything).
- `src/scripts/telemetry-drop.ts` — the handler now refuses an unusable report
  instead of writing it, `rmSync`s the runId's earlier file (a run can turn
  tainted mid-run — speed>1 at minute 20 — and its clean prefix must not
  survive), and sweeps the folder on every drop. New exported `sweepTelemetryDir`.
- `src/scripts/telemetry-drop.test.ts` — **new.** The tests that matter are the
  ones proving it does *not* delete: `README.md`, non-`.md` entries,
  subdirectories, unparseable text, clean runs. Plus the traversal jail.
- `vite.config.ts` — sweep at dev-server boot, **guarded by `!process.env.VITEST`**:
  vitest boots a vite server too, and the first test run swept the human's real
  sensor folder. Same class as `973b996 fix(e2e): stop the test lane polluting
  the telemetry sensor`.
- `src/telemetry/drop.ts` — the client logs `report not retained: <reason>` once
  per session (a tainted run closes a segment on every blur; once is enough).
- `src/scripts/session-brief.sh` — the line now reads "N **usable** report(s)
  (untainted, ≥1 in-band rung of attended time)". Deliberately still dumb: the
  policy has ONE home, in TS. The folder is usable-by-construction, so counting
  files *is* counting usable reports.
- `project/telemetry/README.md` — "a report is one RUN, not one playthrough" up
  top; contract item 4 ("no pruning in v1") superseded by the retention rule,
  with the 24-file story kept as the reason.

## Notes

- Threshold landed at `T0_PACING_BAND_MIN` (3 min), not the 5 min floated in
  chat: 3 is derivable from the source of truth, 5 was a guess. Consequence —
  the brief now says **4**, not the 0 predicted mid-conversation. The 3.1- and
  4.6-min clean runs clear the bar, and a live dev server dropped a fresh
  **17.2-min untainted** run during the session (`20260710-1783675960`, the
  first file to carry the real-date prefix from `caad385`).
- The localStorage ring is untouched — it still holds every run, refused or not.
  Refusing a file is refusing an *archive slot*, not losing data.

## Next intended steps

1. That 17.2-min untainted run is the first clean real-play data since the
   Phase-2 rewrite. Worth a distillation pass (the README's diary rule) before
   the next balance touch — HD-34's re-baseline is the obvious consumer.
