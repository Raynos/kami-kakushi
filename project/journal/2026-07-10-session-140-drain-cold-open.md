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
- **FB-199** — the fresh divider anchored + 30s (`FRESH_DIVIDER_TTL_MS`, one
  exported constant for the log and the VN): a live divider never relocates or
  stacks — new lines re-arm its fade — and it lives 30s past the last new line
  (was 4.5s). Source-derived timing test.

## Cross-lane notes

- Parallel drain lanes sanctioned mid-session (w3:p3 relay, human go-ahead):
  this lane owns cold-open, F-block FB-197..214. The voice-colour captures
  (11:39:11 · 11:39:59 · 11:43:03) are PARKED here — re-grouped cross-bucket
  into one `.vn-speech` lane for a single coherent fix.
- FB-198/FB-199 committed under SKIP_VERIFY in a co-agent red window
  (freeze-clock.ts / capture.ts / journeys.spec.ts, w6:p2 WIP); this lane's
  roster hand-run green each time. Held local until a green push window.
- FB-200 (Continue button CSS) BLOCKED on styles.css carrying w6:p2's
  uncommitted FB-215 hunk — committing the file would sweep their work.
