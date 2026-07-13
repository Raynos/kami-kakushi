# Split the four UI god-files in one overnight worktree job

**Status:** 📋 PROPOSED (2026-07-13, session 199)
**Confidence:** ( 0% Opus, 100% Fable ) — human-routed: "Fable
overnight" (ADR-196 §6 / grill capture Q5). Closure-extraction
boundaries in render.ts are the judgment core.
**Template:** ops

## Goal

End the code-hub heat measured in
[2026-07-13-hot-file-contention-analysis.md](../../project/brainstorms/2026-07-13-hot-file-contention-analysis.md):
`src/ui/render.ts` (6,669 lines, 183 commits, 30 cross-scope rapid
re-touches, ~9 top-level functions — the mass is giant closures),
`src/ui/styles.css` (3,580 / 106), `src/ui/render.test.ts`
(3,412 / 73), `src/ui/dev.ts` (2,774 / 109). In the shared tree
the contention unit IS the file (pathspec commits): two agents in
render.ts cannot commit independently. **ADR-196 §6** locks the
fix: one big-bang worktree job in a declared quiet window, landed
atomically. This is the sanctioned "heavy job" instance of the
ADR-196 hybrid-tree ruling — NOT a license for routine branch
work.

## Go conditions

- **Quiet window, declared:** herdr shows no other live agent
  with `src/ui/` WIP; `git status` clean on all four files; every
  in-flight plan touching them landed (today that is
  dialogue-live-swap (dev.ts Story switcher) and the w2:p5
  rungs settings→scenarios DEV-panel work — re-check at run
  time, this list rots).
- Human has been told the run is happening (overnight, their
  call per ADR-196); push mutex from
  [fable-2026-07-13-contention-locks.md](fable-2026-07-13-contention-locks.md)
  ideally live.
- Baseline captured BEFORE any edit: full verify green, e2e lane
  green, and a golden screenshot set (capture-game-states) of the
  main surfaces — the refactor promises pixel-identical output.

## Procedure

Run in an isolated worktree (EnterWorktree); land back on main
atomically inside the same window. Order = mechanical-first so
early commits de-risk nothing-changed proof:

1. **dev.ts → 8 files** (own commit; the most mechanical). Seams
   verified in-session at dev.ts:1744-1750 (tabs: `settings,
   review, scenarios, balance, rungs, protos`) and 1758-1759
   (review halves `variants`/`story`): 7 pane modules
   (`src/ui/dev/…`) + the shell (panel chrome, tab bar,
   `selectTab`). `dev-surfaces.ts` untouched (already extracted;
   the `review-link` gate imports it).
2. **render.ts → per-surface modules** (several commits). Map
   the surfaces from inside `mount` first (log, actions/verbs,
   vitals, panels, intro/nameplate, settings, shared `el`/format
   helpers → `src/ui/render/…`); extract one surface per commit,
   full vitest green each time. `render.test.ts` is NOT touched
   in this step — it is the net (it must keep passing against
   the refactored modules through the public mount contract).
3. **styles.css → per-surface files** (own commit): split along
   the same surface map, imported in order (vite handles multiple
   CSS imports); rule order preserved within and across files so
   the cascade is provably unchanged.
4. **render.test.ts → mirror split** (follow-up commit, same
   job): tests move next to the module they exercise; suite count
   before == after.
5. **Prove nothing changed:** FULL verify (VERIFY_FULL=1, incl.
   @slow), e2e lane, then re-capture the golden screenshot set
   and diff against the Step 0 baseline — pixel-identical (or
   each diff explained and rejected).
6. **Land atomically:** rebase the worktree branch onto main
   inside the quiet window, push (through the mutex), herdr
   announce the new file map, flip this plan → ✅, journal.

## Verification

- Every commit: full vitest suite green (the 3,412-line
  render.test.ts passing UNCHANGED through steps 1–3 is the core
  RED-able check — it exercises the public contract, not file
  layout).
- The golden-screenshot diff (Step 5): a renderer refactor that
  moves a pixel goes RED here. Player-reach proof (PH6): the
  captures ARE live drives of the real surfaces via the QA
  harness.
- e2e lane (mobile profiles) green pre-push; CI verify + e2e on
  main after landing.
- `wc -l` sanity: no new module >1,200 lines (the split actually
  split).

## Sync ripple

- **PRD:** none — zero behavior change; §6 tech-architecture
  describes the pure-core boundary, which is untouched.
- **Story-bible:** none — no fiction.
- **Living docs / registries:** `docs/repo-map.md` gains a
  `src/ui/` module-map line; `qa-playtesting.md` only if harness
  selectors move (they target DOM/`window.__qa`, not files —
  expect none).
- **CHANGELOG:** none — no version bump, player-invisible.

## Aftermath

- herdr announce the new module map (agents' muscle memory says
  "edit render.ts").
- Journal + archive this plan; add an "outcome" line to the
  contention-analysis brainstorm.
- Watch the next week's commit heat on the new modules — the
  point was contention; re-run `tmp/hotfiles.py` after ~5 days.

## Risks

- **Seam: this plan owns all of `src/ui/` for one night.** That
  is the whole design — the quiet window + atomic landing exist
  because any concurrent src/ui WIP makes the rebase
  catastrophic. If the window is lost mid-job (an agent lands
  render.ts work on main), rebase surface-by-surface commits or
  abort cleanly (worktree discard costs nothing — rerun another
  night).
- Closure extraction can silently capture stale state (a shared
  `let` inside `mount` becoming module state) — the reason this
  is Fable-routed; the test suite + pixel diff are the nets.
- styles.css split can reorder the cascade — Step 3 preserves
  rule order by construction; the pixel diff catches what slips.

## Who builds this — Fable or Opus?

**Fable, overnight, human-routed (ADR-196).** Steps 1 and 3–4
are mechanical (an Opus subagent inside the job is fine); Step 2
(closure/state boundaries) and every abort/land judgment stay
with Fable.
