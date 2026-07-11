# Session 170 — the all-lanes parallel inbox drain (16/16, pending empty)

**Date:** 2026-07-10 → 2026-07-11 · **Agent:** Claude Code (claude-fable-5) ·
**Mode:** `/drain-inbox all in parallel using sub agents` (ADR-171)

## What happened

Claimed all six lanes (r1 · r0 · mapsheet · the-log · diverge · dev — 16
captures, no collisions), intake-committed, then fanned out six read-only
triage subagents (one per lane) that reproduced every capture headlessly
against the shared `:5173` server. Presented the whole lane-set as one
wholesale proposal; the human approved the batch, routed FB-369 to the
body-split workstream, ruled FB-374 "wire fog now, placeholder geo", and
widened FB-364 from relabel to full removal of the T0 demo entry points.

Implementation ran as three parallel subagents (chrome / map / narrative) +
this session (dev lane, then takeover): mid-run the implementation agents
parked on verify pollers during a four-workstream tree storm (body-split core
surgery + estate works + travel presence + us) and died idle; on the human's
"figure out and drain all yourself", this session stopped them and landed the
remaining items directly.

## Landed (commit per item)

- FB-361 `d6b75df1` — rakeCapLine canon into the FLAVOR registry (reader fixed)
- FB-362 `cd10b315` — per-scene cold-open cards; scene-head diverge → **HR-28**
- FB-363 `84cb7747` — vn/all toggle into the log head; uniform tab row
- FB-364 `fe944372` — T0 demo entry points retired; QA path via `openTierMap`
- FB-365/366 `f3bdfb2c` — no hover raise on disabled verbs
- FB-367/368 `b3921564` (swept alongside estate works) + tests `4c943deb`
- FB-370 + FB-374 + here-ring `2ff55503` — live-map fog of war (ADR-151, at
  last), revealed-ground default framing, pane-fit sizing, here-ring on
  unsurveyed ground; golden pin GREEN; T0 blind-pass run post-change
- FB-371 `e778de0f` — one-line vitals rows (adapted to the ADR-178 belly bar)
- FB-372 `0d31c8f9` — titlebar retired; name + version in the footer
- FB-369 — 💬 routed: the body-split agent owns the eat-rice re-home (ADR-178)
- FB-375/376 — 💬 answered: R0 cold-open ground is deliberately pre-revealed
  (no `revealFlag`); optional story-strict-fog HD-item offered

Bookkeeping: `ba36efdc` + `7d6307ba` — F-entries in four per-lane drain-day
files, every sidecar stamped, all six buckets archived, claims released.
**`pending/` is EMPTY.**

## Shared-tree lessons (paid for in this session)

- **A commit-retry loop must re-verify per try.** The FB-364 loop checked
  foreign hunks once at edit time, then blind-retried for 30 min — try 40
  swept the narrative agent's in-progress dev.ts wiring onto HEAD (repaired in
  `cd10b315`). The FB-363 loop got the fix: diff-hash guard per try, abort on
  foreign change. (Memory updated.)
- A `cmd | tail` pipeline's exit code is tail's — the first FB-364 loop
  false-greened on try 1 without committing. Test the command, not the pipe.
- Letterboxed SVGs paint beyond-viewBox art into the letterbox bands — a
  height-capped sheet must size its box to the sheet's aspect or it leaks
  unrevealed ground (caught eyeballing the FB-374 captures).

## Open threads

- **HR-28** — the three intro scene heads (pick = Take B) await the human.
- The REVEAL geometry pass: the live fog ships the ADR-151 placeholder
  geography; aligning stage polygons to the real walked ground is follow-up
  map-sheets work.
- FB-369's actual move lands with body-split Phase 1 (ADR-178), not here.
- If the human wants story-strict fog for the R0 cold-open zones (FB-375/376),
  that's a reveal-schedule HD-item — offered, not opened.

## Next intended steps

Commit the T0 blind-pass report when the workflow returns, then checkpoint
(push `main` — the estate agent confirmed the clean-clone blocker is healed).
