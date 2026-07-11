# Session 173 — reveal architecture ruled: derive from progression, drop the save latch

**Date:** 2026-07-11 · **Agent:** Claude Code (claude-fable-5) ·
**Mode:** human steer → investigation → ruling → plan (ADR-179)

## What happened

The human hit the drift live: refreshing with an old save showed tabs and the
eat-rice zone action from flags baked into that save, not from what the build
entitles — and named the invariant: *"what is revealed in the UI should not be
in the save file, it should be derived based on which rung I'm playing
within"* (with `[r1:postX]` markers for mid-rung event reveals).

An Explore agent mapped the reveal system end-to-end and confirmed the
diagnosis: visibility = membership in the persisted write-once
`state.unlocked` latch (`unlock.ts:10`), pushed by rank rewards/events
(`ranks.ts` `rewardOnReach` → `rewards.ts:75` → `unlock.ts:19`), serialized
whole (`codec.ts:23`); `state.rung` never consulted. The registry had grown
six-plus per-surface "STATE-PREDICATE so it back-reveals" patches plus the
load-time `revealPass` in `main.ts:169` — all local fixes for the same drift.

Presented the fork (full derivation vs load-time reconcile vs plan-first);
the human ruled **full derivation** via AskUserQuestion and said continue.

Key finding easing the migration: every rung already stamps a symmetric
latched `rank-rN` flag (`ranks.ts:48`, battery #19) — the progression facts
the derivation needs are already in the save.

## Landed

- **ADR-179** (decisions.md) — reveal is derived, never stored: visibility =
  f(progression facts); monotonicity law (fluctuating predicates convert to
  fact-flags); the save's only reveal-shaped field is the announce-once
  `seenReveals` ceremony latch; schema v10→v11 seeds it from old `unlocked`.
- **Plan** `docs/plans/fable-2026-07-11-derived-reveal.md` — S1 engine
  (visibleSet fixpoint, `isUnlocked` keeps its name/call sites) · S2
  predicate sweep · S3 fact-flags (`coin-earned`, `intro-tail-done`, weir) ·
  S4 announcePass + `seenReveals` · S5 persistence bump/migrate · S6 full-arc
  monotonicity invariant test · S7 PRD ripple. Queued for the human.
- Clarified in-chat: eat-rice-on-the-zone is NOT save-drift — it's the
  FB-343/FB-369 re-home, already owned by the ADR-178 body-split workstream
  ("food verbs move to the Inventory tab once Schedule A lands").

## Next intended steps

- Execute S1–S7 (this session continues; direction fully locked).
- S7 closes with the PRD §6.2 ripple + checkpoint.

## Commits

- (this commit) — ADR-179 + the derived-reveal plan + queue + this entry
