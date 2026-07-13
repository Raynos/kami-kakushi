# Wire dialogue into the DEV Story switcher's live-swap

**Status:** 📋 PROPOSED (2026-07-13, session-187)
**Confidence:** ( 85% Opus, 15% Fable ) — DEV-panel plumbing on an
existing pattern; the only judgment is matching the ADR-143
declaring-module setter idiom faithfully.
**Template:** process

## Who builds this — Fable or Opus?

**Opus.** This is dev tooling: extend an existing switcher mechanism to
one more unit type. No fiction is authored; the payoff is that FUTURE
Fable dialogue diverges start unblocked.

## Why

**ADR-143 + the human's ruling (2026-07-13 finding walk, M7: "wire it
now").** Every narrative diverge must review LIVE in the DEV Story
switcher (human, 2026-07-07) — a doc-only review is not a review. But
dialogue is the one unit class still reader-only: the next dialogue
diverge would have to build this wiring inside its own scope, making
the first story session pay a tooling tax. The human pulled the wiring
forward. Evidence:
`project/archive/opus-2026-07-12-adr-embedded-work.md` (M7).

## What exists today

**Survey date: 2026-07-13 (session-187), source-verified.**

- `src/ui/dev.ts:2731` — `LIVE_UNITS =
  /^(rung|intro|intro-title|scene|flavor|req-flavor):|^cold-open:(lede|cta)$/`;
  units outside it render "(reader-only)" (`dev.ts:2796`).
- No `subDialogue`-style setter exists for dialogue lines; rung/intro/
  scene/flavor/cold-open each have live-swap plumbing to copy from.
- Dialogue registries are FB-5 generated (`gen:narrative`) and
  re-exported by hand-written modules — the declaring-module DEV-setter
  pattern (ADR-143) is the sanctioned hook point for core-emitted
  text.

## Steps

1. **The setter.** Add the DEV-only dialogue swap hook in the module
   that declares/re-exports the dialogue registry (declaring-module
   pattern, `import.meta.env.DEV`-gated, stripped from prod like its
   siblings).
2. **The switcher.** Extend `LIVE_UNITS` (and the unit plumbing around
   `dev.ts:2731/2796`) so dialogue units offer take-switching like
   scenes do.
3. **Prove it with a real unit.** Point the switcher at an existing
   dialogue unit (any shipped line with alternates, or a synthetic DEV
   take) and confirm the live swap renders mid-session without a
   reload (TST2 — no ground-yank).

## Verification

- A RED-able DEV test: the dialogue unit class no longer matches the
  reader-only branch (asserting on `LIVE_UNITS` coverage — fails on
  main today); swap-then-render shows the alternate text.
- Prod strip check: the nightly strip gate stays green — no DEV
  setter leaks into the prod bundle.
- Manual drive on the live `:5173` DEV build: open DEV → Story, switch
  a dialogue take, watch the rendered line change live.

## Sync ripple

- **PRD:** none — DEV tooling, below the PRD's altitude.
- **Story-bible:** none — no fiction moves.
- **Living docs / registries:** none regenerated;
  `.claude/skills/narrative-diverge/SKILL.md` gets one line noting
  dialogue is now live-swappable (removes its wiring caveat).
- **CHANGELOG:** none — DEV-only.

## Teeth

The existing enforcement already bites: ADR-139/143 require every
diverge to review live, and the narrative-diverge skill checks the
unit swaps before filing the HR-item. Once dialogue is in
`LIVE_UNITS`, that standing rule covers it — no new gate needed (a
gate on "is every unit class live-swappable" would cry wolf on
deliberately-latent classes).

## Human-in-the-loop

- None to file — human-ruled in the walk; DEV-only surface, no taste
  scorecard (not player-facing).

## Non-goals

- **No dialogue diverge is run here** — this unblocks them; the takes
  come with their own ADR-139 sessions.
- **No switcher redesign** — dialogue slots into the existing UI
  exactly like scenes; any switcher UX work is out of scope.

## Rollback

Two localized reverts: the `LIVE_UNITS` regex entry and the
declaring-module setter — both DEV-only, so prod is untouched either
way. No data or save-format surface.

## Risks

- **Seam (shared tree):** owns `src/ui/dev.ts` (Story switcher region)
  and the dialogue-declaring module. Low collision risk — but the
  re-voice waves read the same registries; land this between waves,
  not mid-wave.
- **Strip regression:** the setter must follow the exact sibling
  pattern or the prod-strip check goes red — copy, don't invent.
