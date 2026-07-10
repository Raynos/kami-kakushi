# Session 140 — 2026-07-10 — draining the cold-open playtest bucket (batch 1)

**Summary:** `/drain-inbox cold open` — the cold-open bucket holds 14 captures
from the human's 11:32 playtest of the reshaped cold open. This session drains
the oldest 5 (entry 6 folded in — same element as entry 5), all approved
wholesale: Space/Enter advance the VN (FB-197), the `You:` player-speech
grammar form + intro retags (FB-198), the fresh-divider made anchored + 30s
(FB-199), and the Continue button centred/enlarged (FB-200). F-entries in
`project/feedback-human/2026-07-10-playtest.md`.

## Commits

- **FB-197** — Space/Enter advance the VN scene: a per-scene document keydown
  handler routing to the same `introAdvance()` the click path uses; guarded
  against focused controls + open modals; removed on teardown. Two RED-able
  tests (the first genuinely went RED against a `Document`-target crash in
  jsdom before the `instanceof HTMLElement` guard).
- **FB-198** — the `You:` player-speech grammar form (the gap both intro.md and
  rung-beats.md had documented as a deferral): emits `voice: 'player'` with no
  static name; `playerSpeaker(state)` resolves the nameplate in the ONE log
  funnel (`applyRewards`) + the VN transcript, so the You:→Nameless:→Gonbei
  flips are automatic. All 11 narrator-quote MC lines retagged (intro 2,
  scenes 3, rung-beats 6); compiler RED tests for the form + its (voice)
  override rejection.
