# Session 159 — 2026-07-10 — SLOP threshold warning modals (R0→R1, R1→R2)

**Summary:** Built the human-dictated SLOP warning gates: crossing R0→R1 opens a
"Warning — slop / this is unreviewed" modal (confirm-only); crossing R1→R2
opens the "turbo slop / completely untested pure vibe coding" modal whose
Confirm stays locked until the player types the exact consent sentence. Fired
from the render pass's rung diff, but ONLY when a player-initiated control (the
rung-head trigger / the beat ceremony's Continue) armed a latch — so
`__qa.toRung` teleports, fixture jumps, and save imports never trip it (this
protects the qa-shots gallery, whose R1/R2 teleport steps would otherwise
strand a blocking scrim over every later screenshot). Same-session human
follow-up applied: both modals close the house way (× / Escape — the R2
CONFIRM alone stays behind the typed sentence), and a warning HOLDS
(`pendingSlopWarning`) until any live-or-queued rung-up VN (R2's yard-hand
scene) finishes — the player goes through the story first, then meets the
warning on the shell.

## What changed
- `src/ui/render.ts` — `showSlopWarning('R1'|'R2')` (root-level `.modal-scrim
  slop-scrim` alertdialog, Tab-trapped, × + Escape close; typed-consent gate on
  the R2 Confirm); `slopGateArmed` latch armed at the rung-head trigger + the
  FB-153 ceremony Continue (re-arm covers a run reloaded mid-beat); exact-step
  firing in the rung diff next to the FB-153 seal suppression;
  `pendingSlopWarning` holds the warning until no VN is live or queued.
- `src/ui/styles.css` — `.slop-*` styles (shu kicker, house input/verb idioms).
- `src/ui/render.test.ts` — new "SLOP threshold gates" describe: R0→R1 confirm
  flow, ×/Escape close, R1→R2 VN-first hold + typed-sentence lock (wrong text
  stays locked), and the RED-able unarmed-teleport suppression guard. Real
  reducer + real mounted DOM.
- `src/tests/e2e/journeys.spec.ts` — "rung-beat completes" now walks the R1
  slop warning (interposes → Confirm clears) on all three profiles.

## Verification
- Unit: 107/107 render.test.ts (3 new). E2e: rung-beat journey green on
  desktop-chromium + mobile-chromium + mobile-webkit.
- Live headless drive (`tmp/slop-qa.mjs`, discarded): real R0→R1 beat path →
  warning shown/cleared; `__qa` grind to R2 → typed gate locked on wrong
  sentence, unlocked on exact sentence; `toRung('R2')` teleport → zero scrims.
  Screenshots reviewed — both modals read native (ink/woodblock, shu kicker).

## Next intended steps
1. None — feature complete. (If the human later wants the gates once-per-save
   rather than once-per-transition, persist a flag in GameState.)

## Landmines
- The R2 modal deliberately waits OUT the r2-yard-hand VN scene (the
  `pendingSlopWarning` hold): story first, warning on the shell after (the
  human's follow-up steer — the first cut layered the modal over the scene).
  If a future rung reshape gives R2 a real beat (un-silences it, ADR-165), the
  arming latch still covers it via the ceremony Continue — no change needed.
- × / Escape close BOTH modals (house idiom, human follow-up) — on the turbo
  modal that dismisses WITHOUT typing the sentence; only the Confirm button
  itself is sentence-locked. Flagged to the human; hard-lock is a 3-line
  revert (drop the × append + the onEsc listener) if steered.
- The gates fire on the EXACT steps R0→R1 / R1→R2 only, and never unarmed;
  a DEV fixture jump or import that lands on R1/R2 shows no warning (by
  design — QA surfaces stay clean).
- Shared-tree note: committed AFTER w1:p3's mapsheet-drain commit so their
  staged FB-341 render.test.ts hunk didn't ride along (hunk-checked
  `git diff --cached` before committing).
- Provenance: the SLOP unit tests in `render.test.ts` were authored THIS
  session but ride in w6:p1's verify-budget commit `f113f2f6` — that commit
  pathspec'd the whole file for its `// @slow` tag while my hunks sat in the
  shared working tree (the sweep failure mode working-agreements warns about,
  at file-not-dir granularity this time). Between `f113f2f6` and this
  session's feat commit, HEAD's tests referenced `showSlopWarning` before it
  existed — the committed tree was RED while every local verify ran green off
  the worktree ("local green can hide committed red"). Nothing was pushed in
  that window; this commit closes it. Tests re-verified green at this commit.
