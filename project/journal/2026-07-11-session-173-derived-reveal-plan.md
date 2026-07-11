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

- ~~Execute S1–S7 (this session continues; direction fully locked).~~ S1–S6 ✅
  (the landing commit below); S7 (PRD §6.2 ripple + checkpoint) next.

## The landing (same session)

S1–S6 built and verified in one sweep:

- **Engine** — `unlock.ts` rewritten: `visibleSet` (fixpoint over the registry,
  WeakMap-memoized, `isUnlocked` keeps its name and every call site),
  `announcePass` (replaces the push `revealPass` at finish()/tick/load),
  `factsForSurfaces` (the test/DEV bridge: surface → entitling flags, resolved
  through the RANKS schedule so re-rungs can't drift it).
- **Schedule** — `rewardOnReach.unlock` reinterpreted declaratively (one home
  stays ranks.ts; the ceremony consumer unchanged); `applyRewards` no longer
  latches; works/intro pushes deleted; `coin-earned` fact-flag latches at the
  two earning sites; DEV `jumpTo*` teleports stamp cumulative rank flags.
- **Persistence** — v10→v11 (drop `unlocked`, seed `seenReveals`, synthesize
  `coin-earned` from a latched readout); validate swapped; **drive-by fix:**
  `importState` hardcoded `migrated: false` even when the chain ran — now
  reports honestly.
- **Test conversion** — four parallel agents swept the 21 affected test files
  (disjoint sets); every group green, no assertions weakened. Honest premise
  shifts recorded by the agents: home+Inventory travel together at R4; the
  Skills pane is never empty at R2 (pins "exactly Conditioning"); the old
  ascension seasonal fixture was accidentally relying on an unwalkable map —
  rebuilt legitimately. Two dead surface ids (`room-gate-forecourt`,
  `room-home-paddies`) found squatting in dev.test fixtures — dropped.
- **New tests** — `unlock.test.ts` (14: derivation table FROM the RANKS
  schedule, "a stale save cannot pin a stale surface", announce-once/no-respam,
  facts bridge) + the S6 monotonicity invariant across the real arc
  (invariants.test.ts) + v10→v11 migration coverage (migrate/save tests).
- **Verified** — tsgo 0 errors · full vitest 1195/1195 (91 files) · verify 18/18
  · fixtures regenerated through the real engine (v11 shape confirmed) ·
  **headless live smoke on the shared :5173**: a doctored v10 save with a
  stale cold-open `unlocked` latch + R3 rank facts loads, migrates, and renders
  the full R3 tab bar — the reported bug class reproduced and killed.
- Worth a glance later (agent note): economy's "visible panel, unopened stage"
  premise now leans on works `named ≠ open` (`works-named-u1` vs
  `works-open-u1`) — fine today, flagged for the ADR-177 owner.

## Commits

- `d7893081` — ADR-179 + the derived-reveal plan + queue + this entry
- (this commit) — the S1–S6 landing (core + persistence + UI + tests + fixtures)
