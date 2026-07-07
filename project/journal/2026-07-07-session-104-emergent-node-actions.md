# Session 104 — 2026-07-07 — emergent node actions: Phase 0 lock + build

**Summary:** The human asked to build
`docs/plans/opus-2026-07-03-emergent-node-actions.md`. Ran the plan's mandatory
Phase 0 design pass live (AskUserQuestion): build now as a T0-later layer,
permanent ratchet (the per-run fork proved moot — the game has no runs/resets
per PRD §1), tightening hints, no discovery-log (purely diegetic), tag-based
rumor routing as the agent default with Phase 3 deferred. Locked as **ADR-146**;
plan flipped ▶️ IN-PROGRESS. Then built Phase 1 (the node-scoped discovery
primitive in the pure core) — see the "What changed" log below as commits land.

## What changed
- `docs/living/decisions.md` — **ADR-146** (the Phase 0 lock).
- `docs/plans/opus-2026-07-03-emergent-node-actions.md` — Status → IN-PROGRESS;
  §Open resolved with strikethroughs; new "Phase 0 outcome" build spec (state
  shape, `DISCOVERIES` registry, derivable hiddenness, hint selector).

## Verification
- Docs-only for the Phase 0 commit (`SKIP_CODE_VERIFY=1`); the docs gates run.

## Next intended steps
- Phase 1: `'discovery'` RNG stream + `discovered`/`discoveryProgress` state +
  `discoveryPass` + hidden-activity gating + fixed-seed/ratchet tests.
- Phase 2: tightening blurb hints (selector + UI), one real T0 discoverable,
  fiction text via an ADR-139 narrative diverge; taste Pass 1 before the
  player-visible wiring.
