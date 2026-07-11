# Derived reveal — visibility is a function of progression, never a saved list

**Status:** DONE ✅ (landed 2026-07-11 — ADR-179 `d7893081` · the S1–S6 code landing
`712dc0b5` · the S7 PRD §6 ripple in the archiving commit; full suite 1195/1195,
verify 18/18, stale-save smoke PASS on :5173)

- **Author:** Fable session, 2026-07-11 (investigation + ruling this session)
- **Confidence:** ( 40% Opus, 60% Fable ) — the spec is fully pinned below, so
  most of the work is careful mechanical refactor + tests; the taste-bearing
  part (announce pacing, ceremony behavior) is already locked by prior ADRs.
- **Human ruling (2026-07-11, AskUserQuestion):** **Full derivation.** Delete
  `unlocked` from the save; every surface's visibility derives from progression
  facts; a `seenReveals` latch persists ONLY the announce-once ceremony state.
- **ADR:** ADR-179 (decisions.md) records the ruling.

## Who builds this — Fable or Opus?

Either. The judgment calls (what derives vs what latches, the monotonicity
law, the migration shape) are all settled in this plan + ADR-179; what remains
is a disciplined core refactor with a strong test harness — well inside both
models' competence. The authoring session (Fable) continues it. No sub-phase
concentrates taste; no model split needed.

## The problem (human, 2026-07-11)

Refreshing with an old save shows tabs/actions from flags baked into that
save, not from what the current build says the player's progression entitles.
The reveal system is latch-on-event: reaching a rung pushes surface ids into
`state.unlocked` (`ranks.ts rewardOnReach` → `rewards.ts:75` →
`unlock.ts:19`), the array is serialized whole (`codec.ts:23`), and the UI
reads only the latch (`render.ts tabHasContent` → `isUnlocked` =
`state.unlocked.includes(id)`). `state.rung` is never consulted.

The codebase has been patching the resulting save-drift one surface at a time
— six-plus registry entries carry "STATE-PREDICATE reveal … so it back-reveals
for any save with no migrate()" comments, and `main.ts:169-172` runs a
`revealPass` on every load to back-fill. This plan completes that trajectory
instead of adding a seventh patch.

## The invariant (the human's law)

> What is revealed in the UI is NOT in the save file. The save keeps
> **progression facts** (rung reached, mid-rung event markers — `[r1:postX]`);
> visibility is a **pure function** of those facts. The only reveal-shaped
> thing a save may carry is *which announcements have already played*.

Three buckets, cleanly split:

| Bucket | Lives | Examples |
| --- | --- | --- |
| **Facts** (persisted) | `state.flags`, `state.discovered`, `state.rung`, skills, resources | `rank-rN` (already symmetric per rung, `ranks.ts:48`), `works-named-weir`, `awake`, `dream-1` |
| **Visibility** (derived, never persisted) | `visibleSet(state)` — pure fn | every tab/panel/verb/readout/row |
| **Ceremony** (persisted, announce-once) | `state.seenReveals` | reveal lines + ceremony beats already played (sibling of `scenesPlayed`) |

The original motivation for the latch — "reloading never re-spams reveals"
(`unlock.ts:1-4`) — is exactly what `seenReveals` keeps, without letting an
old save pin stale UI.

## Target architecture

### 1. The derivation engine (`src/core/unlock.ts`, rewritten)

- `visibleSet(state): ReadonlySet<SurfaceId>` — iterate the `SURFACES`
  registry to a **fixpoint** (predicates may reference other surfaces'
  visibility, e.g. `panel-home` keys to `tab-inventory`; the set grows
  monotonically per iteration so it converges in ≤ registry length, in
  practice 2–3 passes). **Memoized per state object** (WeakMap) — render
  calls it freely.
- `isUnlocked(state, id)` keeps its name and every call site (render.ts,
  reducers) but becomes `visibleSet(state).has(id)`. Zero UI churn.
- `revealSurface` / the old push-based `revealPass` are deleted.

### 2. The authored schedule stays in `ranks.ts` (one home, TST1)

`rewardOnReach.unlock` is **reinterpreted, not moved**: it stops being a push
list and becomes the declarative "these surfaces exist from this rung on"
schedule. At module init, build `SURFACE_RUNG: Map<SurfaceId, RankId>` from
`RANKS`; the effective predicate for a surface is:

```
visible(s, surface) =
  (SURFACE_RUNG.has(id) && hasFlag(s, rankFlagOf(SURFACE_RUNG.get(id))))
  || surface.unlock(s)
```

- Rung membership keys to the **latched `rank-rN` flags** (set once, never
  cleared — survives any later rung transitions/ascension), never the
  transient `s.rung` (the `screen-demo-frontier` lesson, surfaces.ts:457).
- The ceremony consumer (`render.ts:2735`, reads `rewardOnReach.unlock` for
  `ceremonyLabel`s) is **unchanged**.
- `applyRewards` drops its `unlock` loop; `RewardBundle.unlock` stays as data
  read only by the schedule builder + ceremony. Non-rank `RewardBundle`s with
  `unlock:` (the intro-tail forecourt) convert to fact-flags (S3).

### 3. Monotonicity law + the fact-flag audit (the `[r1:postX]` markers)

Derived visibility must be **monotone**: once visible, a surface never
disappears (TST2 — never yank the ground). A predicate over a fluctuating
value violates this. Audit result:

- `readout-coin` — `coin > 0 || banked.coin > 0` can regress to 0. Convert:
  latch a `coin-earned` fact-flag at the earning sites (wage collect, spoils,
  sale), predicate reads the flag.
- `room-forecourt` — pushed by `completeIntroTail`; convert to an
  `intro-tail-done` fact-flag (or the existing intro-done state if one
  suffices — verify in S3).
- `room-weir` — `works.ts:151` re-pushes from `works-named-weir` already;
  predicate reads the flag directly, delete the push.
- `verb-collect-wage` (`isWaged(s.rung)`) — rung is monotone in T0; re-key to
  `rank-r5` flag anyway for ascension-proofness.
- `skillVisible`, `character.level`, `dream-2`/frontier flags — already
  monotone latched facts. Keep.

### 4. The announce pass (ceremony, persisted)

`announcePass(state)` replaces `revealPass` at the same call sites
(`intents.ts:189` finish(), `step.ts:144` tick, `main.ts` load): diff
`visibleSet` against `state.seenReveals` in registry order; for each new id,
push its `revealLine` (if any) and append to `seenReveals`. Reveal *pacing*
and *lines* behave exactly as today (today's pass also latches every
newly-true surface in one sweep; staggering remains a property of the
authored schedule, FU4). On load, back-reveals announce once — same as
today's `main.ts` behavior — and re-loads are silent because `seenReveals`
persists.

### 5. Save shape + migration (v10 → v11)

- `GameState`: delete `unlocked`; add `seenReveals: readonly SurfaceId[]`
  (write-once, ordered, ceremony-only — documented as NEVER read for
  visibility).
- `constants.ts`: `SCHEMA_VERSION` 10 → 11.
- `migrate.ts`: first entry in the post-storywave chain —
  `10: (s) => ({ ...s, seenReveals: s.unlocked ?? [], unlocked: undefined })`
  (drop unknown ids against `SURFACE_IDS`; the old latch is precisely "what
  has been announced", so it seeds `seenReveals` losslessly).
- `validate.ts`: swap the `unlocked` field checks for `seenReveals`.
- Old saves gain/lose visibility **by derivation** on first load — that is
  the point: entitled-but-missing surfaces appear (silently if previously
  announced), no-longer-shipped surfaces vanish.

## Steps

- **S1 — engine:** rewrite `unlock.ts` (visibleSet fixpoint + memo +
  SURFACE_RUNG builder from RANKS); keep `isUnlocked` signature. Tests:
  derivation table per rung **derived from RANKS itself** (source of truth,
  never copied id lists), fixpoint convergence, memo identity.
- **S2 — predicates:** sweep `surfaces.ts` — every `() => false` entry is
  either covered by SURFACE_RUNG (leave as `() => false`, the rung arm
  carries it) or gets its fact predicate; chained `s.unlocked.includes(...)`
  predicates re-keyed to `isUnlocked(s, ...)` (safe under the fixpoint).
- **S3 — fact-flags:** `coin-earned`, `intro-tail-done` latches at their
  causing events; `works.ts:151` push → predicate; delete `applyRewards`'s
  unlock loop.
- **S4 — announce:** `seenReveals` in state + `announcePass` wired at
  finish()/tick/load. Test (must be able to go RED): a save round-trip
  re-load emits **zero** new reveal lines; a fact-flag flip emits exactly
  one, once.
- **S5 — persistence:** schema bump + migration + validate swap. Tests:
  v10 envelope with a stale `unlocked` loads, seeds `seenReveals`, and the
  visible set matches derivation (including a surface the v10 save never
  latched but the facts entitle).
- **S6 — invariant test (ADR-088 class):** drive the real engine through the
  full T0 arc (reuse the full-arc fixture path); assert at every step that
  `visibleSet` is monotone non-decreasing and that no reveal line repeats.
  Tag `// @slow` if it needs the arc.
- **S7 — ripple:** `/prd-ripple` (system change: PRD §6.2 core/unlock
  describes the latch), journal, snapshot, checkpoint.

## Non-goals

- **Eat-rice re-home** (FB-343/FB-369) — owned by the ADR-178 body-split
  workstream ("food verbs move to the Inventory tab once Schedule A lands").
  This plan makes that move drift-free when it happens, but does not do it.
- No change to reveal *pacing*, *lines*, or the ceremony surface — behavior
  is pinned equal; only the storage/derivation architecture moves.
- `discovered` / `discoveryProgress` / `scenesPlayed` stay as-is — they are
  facts and ceremony respectively, already on the right side of the law.

## Risks

- **Shared tree:** touches `state.ts`, `unlock.ts`, `rewards.ts`,
  `intents.ts`, `main.ts` — the ADR-178 body-split agent may also touch
  `intents.ts`/`render.ts`. Mitigate: pathspec commits, small steps, re-check
  the staged set before every commit.
- **Hidden latch readers:** anything reading `state.unlocked` directly
  (tests, fixtures, DEV tools) — S1 ends with a repo-wide grep; fixtures
  regenerate via `fixtures:regen` (they drive the real engine, so they
  self-heal).
