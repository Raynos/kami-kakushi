# Wire dialogue into the DEV Story switcher's live-swap

**Status:** ✅ BUILT (2026-07-13, session-200, commit dd206937; scope
re-ruled by the human same day — see Locked decisions. Known residue:
logged 幕-head `context` is baked unkeyed, so intro-title flips still
skip logged heads — noted in the session-200 journal.)
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

## Locked decisions (human, 2026-07-13, session-200)

Asked and answered before build; these are the newest steer (ADR-022)
and supersede anything below or in code comments that disagrees.

1. **A DEV take-switch re-renders EVERYTHING, including the log.**
   "If I switch stuff in the dev menu I expect everything to
   re-render according to the switch." This supersedes the
   `dev.ts:2582-2586` carve-out ("core-emitted keys stay reader-only
   — logged history never rewrites, T2") **for DEV switching**: T2
   protects the *player's* ground; the human deliberately flipping a
   take in DEV is not a ground-yank. Fix that comment in the same
   commit. Consequence: the scope is not dialogue-only — **every
   reader-only unit class goes live** (dialogue + the cold-open
   core-emitted keys; intro-title's logged heads re-render too), and
   delivered log lines re-render under the selected take.
2. **Unit granularity: whole dialogue** — `dialogue:<dialogueId>`;
   per-line units only if a future bundle authors that way.
3. **A take overrides TEXT only** (plus voice tag), keyed by
   canonical line id. Line `id`s and `gate`/`memGate` functions stay
   canon — delivered-tracking and the rake-teach pacing can't break.
4. **Prove it with a synthetic DEV take** (throwaway, deleted once
   the RED-able test lands) — the path ships tested (PH3); the human
   also wants to see the swap demonstrated.

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

0. **Survey the log's storage shape.** The re-render ruling (Locked
   decision 1) needs delivered log lines to re-voice on switch: find
   whether log entries persist the baked text or a (unit, line-id)
   key. If baked-text-only, pick the mechanism — store the key
   alongside, or a DEV-only baked→take remap — and note the choice in
   the build commit.
1. **The setter.** Add the DEV-only dialogue swap hook in the module
   that declares/re-exports the dialogue registry (declaring-module
   pattern, `import.meta.env.DEV`-gated, stripped from prod like its
   siblings). Text-only overlay keyed by canonical line id (Locked
   decision 3), read by every consumer (`nextDialogueLines`,
   `getDialogueLine`) so the intro's Genemon-greet reuse can't show
   canon while the log shows the take.
2. **The switcher.** Extend `LIVE_UNITS` (and the unit plumbing around
   `dev.ts:2731/2796`) so dialogue units — whole-dialogue granularity
   (Locked decision 2) — offer take-switching like scenes do. Retire
   the reader-only class entirely: the cold-open core-emitted keys go
   live too, and a switch re-renders delivered log lines (Locked
   decision 1); rewrite the `dev.ts:2582-2586` comment to record the
   new ruling.
3. **Prove it with a synthetic DEV take** (Locked decision 4): switch
   it in DEV → Story and confirm both a freshly-delivered line AND an
   already-logged line re-render without a reload; delete the
   synthetic take once the RED-able test covers the path.

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
- **The log re-render is the unknown (session-200 scope growth):** if
  log entries persist baked text with no unit key, step 0's remap
  mechanism is new plumbing, not a pattern copy — the original
  30–60 min estimate no longer holds; expect a half-day. The T2
  supersede is DEV-scoped only: a prod player must never see history
  rewrite (the setter and any remap stay `import.meta.env.DEV`-gated
  and strip-checked).
