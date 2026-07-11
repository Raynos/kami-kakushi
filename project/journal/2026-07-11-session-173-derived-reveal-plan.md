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

## S7 — the ripple + close-out

PRD §6 re-described to the derived engine (core/unlock row · the reveal-authority
paragraph · the GameState sketch `unlocked` → `seenReveals`, v11 · the
no-revealQueue callout · the selectors list) — notably resolving §6.8(c)'s own
"recompute what's unlocked on load" line, which had aspired to derivation all
along. `prd:drift` CLEAN. Plan flipped DONE → `project/archive/`, queue entry
removed in the same move.

## The eat-rice re-home (FB-343/FB-369, same session)

The human reported the rice verb still on the zone panel after body-split
closed — correctly: the body-split plan had explicitly scoped the re-home
OUT ("ADR-177 Phase-2 work"), leaving it unblocked but un-owned. The wrinkle
that had parked it: the ruled home (Inventory) doesn't exist until R4, but
eating starts at R1. Presented the fork (belly-bar header home · Character 己
tab · literal-R4); **human ruled: Character 己 tab** (the small R1 gap
accepted — the kura ration + rest carry the belly through R1).

Landed: a **Body 体 card** on the Character sheet (build-once, the Training
idiom) — Body/Belly numerals (the header vital-stack stays bars-only, FB-387)
plus the re-homed cook + eat-rice rows with their show/patch logic moved
verbatim; the zone column stopped carrying them (the hearth's owned-cook
affordance, ADR-120, stays — the deliberate fiction-sited exception).
`verb-eat-rice` re-keyed to `tab-skills` (the ADR-119 "no dangling promise"
pattern — the verb reveals exactly when its home tab does, R2), a one-line
predicate change under ADR-179. New RED-able regression test: the verbs
exist ONLY on the Body card, never the zone column. Full suite 1196/1196;
headless smoke: Work column clean, Body card renders at R2, eat click →
hunger 60→90 through the real timed-action path.

## The porter confirm + travel re-pace (HR-31, live-steered)

The human took over the porter review live, mid-session, with three orders plus
two playtest notes, all landed:

- **HR-31 CONFIRMED** — the porter piece is THE presence; v1's shu rings + the
  DEV "Map travel presence" toggle deleted (ADR-075 zero flag-debt), incl. the
  `presenceVariantRef` seam and the `?presence=` boot sync.
- **Travel ×2** (ordered 500%→revised ×2 after the pacing consequence surfaced):
  the whole `EDGE_WALK_MS` table + `TRAVEL_SEED_MS` doubled (texture preserved,
  6–14s); the **T0 band re-signed [3, 22] → [3, 25]** (human authorized) — R3,
  the walking-est rung, honestly measures 21.2–23.2 min in the slower world.
  `verify:balance` GREEN; `t0-pacing.md` regenerated. The e2e `walkSheet`
  compresses the ActionClock (`__qa.speed(8)`) so CI drives the same UI path
  without journey-time waits.
- **Anchor on the kanji** — `PORTER_STAND_Y` 128 → 16: the piece stands ON the
  seal (feet at the kanji baseline, above the English caption), superseding the
  south-lane call; `pointer-events: none` keeps the seal tappable.
- **Arrival flash fixed** — the walk's footprints now hand across the arrival
  REBUILD (`trailAfterglowRef`) and fade ~2.2s CSS-driven instead of dying with
  the swapped-out svg in one frame.
- **Facing preserved** — `porterFacingRef`: a westward arrival keeps the piece
  facing west (the resting mount honored only the sculpt's native east before).
- **Cross-agent coordination (ADR-171-adjacent):** deconflicted live with the
  w1 drain session over herdr — they ceded `timing.ts` (their ×2 reverted for
  mine), I folded their two human-approved hunks with credit (FB-389 gait
  halving; FB-388 `arriveAt` — R1 arrives at the forecourt, which the fixture
  regen bakes in so core+saves land together), and added their FB-392/394/397
  fog-frontier guard in sheet-map.ts (no 未測 wash under fog). Their map-sheets
  fog fixes + FB tests follow in their own commits.
- Verified: full verify 18/18 · headless smoke (rings gone · 6.1s gate walk ·
  afterglow fades+removes · facing `scale(-1 1)` preserved · anchor at y+16).

## Commits

- `d7893081` — ADR-179 + the derived-reveal plan + queue + this entry
- `712dc0b5` — the S1–S6 landing (core + persistence + UI + tests + fixtures)
- `a165bd68` — the S7 PRD ripple + plan archive
- `29e3ec30` — the FB-343/FB-369 eat-rice re-home (Character Body card)
- (this commit) — e2e: cook journey follows the re-home (Character tab); the
  fixture-drift test's PRE-EXISTING red healed (works-u1-priced/-underway had
  joined the registry without e2e coverage — red since before this session;
  both now carry the per-fixture layout tests, mobile + desktop, 88/88)
