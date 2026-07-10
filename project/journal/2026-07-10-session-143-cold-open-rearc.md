# 2026-07-10 · session 143 — the cold-open rearc, steps 1–2 (HD-37)

**Model:** Fable 5 · **Focus:** the three-act cold open returns — mechanical
restore + balance gate (plan `docs/plans/fable-2026-07-10-cold-open-rearc.md`).

## What happened

- **Plans dir reshaped (human call):** `docs/plans/t0/` removed — the cold-open
  rearc plan moved to the top level (the active-plans scanner sees it now: the
  README gen-region went 0 → 1 active), the PARKED Plan K authored-depth demo
  moved to `docs/plans/t1/` (tier subfolders stay the sanctioned parked home).
- **HD-37 walkthrough replaced the queued plan read.** The human took the
  decisions interactively (AskUserQuestion) instead of a raw read: act order
  `dream → soan → genemon` ✓ · the FB-14 "Open your eyes" title-card lede gets
  REWORKED to fit dreaming-first (folded into diverge unit A) · the nine
  pre-C4.9 perks restore AS-WAS (the sim is the gate) · the ~2× cold-open
  length is ACCEPTED (FB-8 telemetry watches). Go: full arc, this session.
  Plan status → 🔨 IN-PROGRESS; reading-queue entry cleared (ADR-089).
- **Step 1 — mechanical restore, no fiction.** `dream` + `genemon` scene
  skeletons restored into `narrative/intro.md` from `b221d6e~1` verbatim, each
  under a `<!-- seed: pre-C4.9, to be diverged -->` marker (HD-37: seeded, not
  canon — units A/B re-author them); the human-verdicted take-a `soan` prose
  untouched. `INTRO_SCENE_ORDER` → `['dream','soan','genemon']`. The engine
  needed ZERO changes — the intro cursor walks scenes generically and the
  You:→Nameless: flip already keys on `scene.id === 'soan'` (order-agnostic;
  with soan as act 2 the genemon act correctly reads `Nameless:`).
- **Tests reworked, not weakened.** The C4.9 "exactly ONE fused scene"
  assertions became three-act assertions; soan-anchored tests now DERIVE their
  scene by id (an `atScene()`/`atBeat()` walker — a reorder flows through, no
  copied indexes); the per-beat memory-write invariant generalized to "each
  beat writes only its own speaker" (the speakerless dream writes none). Two
  tests RETURNED from git history's C4.9 deletion: the decision-only-scene
  render branch (the dream act exercises it again) and genemon's real
  `after:`-gated topic (the gate machinery now has a live subject).
  affordance-coverage sweeps a walked-to-soan state (ask_topic's only control).
  All 1098 unit tests green; full `verify` 18/18.
- **Step 2 — balance gate (ADR-132).** `verify:balance` GREEN (3 personas × 5
  seeds, no soft-lock, ratio in band) with the three net-zero picks + nine
  perks — the sim personas' generic first-option intro walk needed no persona
  rule. NOTE: the tree carries w2:p5's in-flight HD-35 re-pace, so the sim
  verdict + regenerated fixtures embed the COMBINED sources; t0-pacing.md
  rides w2:p5's commit (their final regen), per the in-session coordination.
- **e2e:** 79/82 pass; the 3 timed-rake failures are the rake-yield path
  (w2:p5's live labour refactor), not the intro — flagged to them.

## Coordination

Shared tree with w2:p5 (HD-35 re-pace): landed sources + artifacts by
pathspec only, NO push — w2:p5 commits theirs next, final-regens if needed,
and pushes both.

## Next intended steps

- Step 3 — narrative-diverge unit A: the memory/dream act (+ the reworked
  title-card lede), 3 blind takes, Story-switcher wiring, HR-item.
- Step 4 — unit B: Genemon's scene (canon seams: day-book idiom,
  daybook/daybookVerbs reuse keys, the "rakes; hauls" wage line).
- Step 5 — act seams + fresh-eyes playthrough capture; step 6 — /prd-ripple +
  story-bible sync.
