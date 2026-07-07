# Story-bible finish — completing the reboot's spirit

**Status: 📋 PROPOSED — authored end of session 106 at the human's
direction; awaiting read.** The execution plan for finishing what the
story reboot (`fable-2026-07-07-story-reboot.md`, its Phases 3–4)
started: first the BIBLE (workstream A — human co-write), then the
DOCS-AND-GAME ripple (workstream B — the build wave). Written so a
FRESH Fable or Opus session can pick up any step without this session's
context. **Confidence: ( 30% Opus, 70% Fable )** — every bible sitting
and prose wave is Fable; the ripple/migration tail routes to Opus.

## Who builds this — Fable or Opus?

**Fable, with the human in the loop,** for every workstream-A sitting
(tier sheets, cast voices, register rules — they are taste co-writes,
not tasks) and for workstream B's prose waves and PRD §5 rewrite.
**Opus** for B's mechanical tail: the enum/calendar/engine ADR
implementations, narrative-source migration, fixture/gen-pipeline
updates, link sweeps, sim plumbing. Per-step routing marked ⬩F (Fable)
/ ⬩O (Opus) / ⬩F+H (Fable co-write with the human).

## Context a fresh session needs (read in this order)

1. **The bible IS the canon:** [`docs/story-bible/`](../story-bible/README.md)
   — README (status ledger) → 00-kernel → 01-laws → 02-house →
   03-tiers → 04-cast → 05-world → `tiers/t0.md` (the completed
   exemplar — every other tier sheet imitates its shape) → the
   `tiers/t1..t6.md` seeds (each carries its placed canon + its
   sitting's agenda).
2. **History, only if needed:** the reboot plan (frame + kernel
   redline record) · the pitch bundle + human notes
   (`project/brainstorms/2026-07-07-story-pitches/`) · journal
   s106 (seven addenda).
3. **The working protocol with the human (MANDATORY for A):**
   one piece per exchange — a compact drafted piece IN CHAT (never
   "see the file"), ending the turn; the human replies "ask" (then
   fire AskUserQuestion ALONE, no prose riding on it — CLI bug:
   text+box in one turn swallows the text) or redlines in prose.
   Write EVERY lock into the bible IMMEDIATELY (living voice, present
   tense, no version archaeology), commit docs-only
   (`SKIP_CODE_VERIFY=1`, pathspec), push at natural seams. Magnitude
   numbers are NEVER locked in the bible — the sim owns them.

## Workstream A — finish the bible (human-gated sittings, in order)

- **A1 · The T1 tier sheet** ⬩F+H — FULL detail (t0.md is the shape).
  Seed + agenda: `tiers/t1.md`. Big rocks: the wings-access ladder ·
  the kura key/alcove/stubs at R3 · the old breach · the debt-panel
  reveal at R5 (the number as story beat) · the wolf's return · the
  shoin restoration → the register capstone → Shigemasa's death.
- **A2 · Cast VOICES** ⬩F+H — lock every T0 voice from the sketch
  candidates in `04-cast.md` (want · misreading · shape · license),
  the MC's use-name, the epigram-license assignment, and the name-norm
  sweep (Shigemasa/Shinnosuke syllable; any recasting incl. Kurosawa).
  Voices are prose-law-binding for all future text.
- **A3 · Register rules** ⬩F+H — decide the three candidates in
  `01-laws.md` (dream cadence · vague-but-parseable · log-is-the-VN)
  into locked law or rejection.
- **A4 · T2 + T3 sheets** ⬩F+H — HALF detail each (agendas in their
  seeds). T2's rock: the reveal scene + the village track + first
  human combat. T3's rock: THE ORIGIN (his birth name, what he fled,
  the grave, the buried-truth quest).
- **A5 · T4 sheet** ⬩F+H — QUARTER detail. The rock: the enemy-lord
  design cell (office, reason, both-wounds tie) + Katsuhide met.
- **A6 · T5 sheet** ⬩F+H — FIFTH detail. The rock: the audience-day
  inverse-rung system + the handover beat.
- **A7 · T6 sheet** ⬩F — TENTH detail; verify nothing has crept in
  (the tier stays reserved).
- **A-final · Bible coherence pass** ⬩F — one read end-to-end:
  contradictions, dead links, prose-law conformance of the bible's own
  text, README status ledger current. Then the human reads the bible
  whole and blesses it: **BIBLE DONE.**

## Workstream B — the docs & game ripple (opens at BIBLE DONE)

- **B0 · Mint the frame ADR** ⬩F — the held ADR (reboot §1 + the
  bible's structural canon: 7 tiers, six-season calendar, alternation,
  time-skips) lands in `decisions.md` as the build wave's charter.
  Next free ADR number (147 is a hole — do not backfill).
- **B1 · PRD §5 rewrite** ⬩F — the world/story section rebuilt from
  the bible (the bible stays the canon home; the PRD §5 becomes a
  pointer-and-summary per ADR-117 gen-region style where derivable).
  Then `pnpm run prd:drift` + ripple the roadmap (7 tiers, new
  milestone shapes).
- **B2 · Engine ADRs + implementation** ⬩O (each its own plan/PR):
  tier enum 0..6 + save migration · the six-season manual calendar
  (season containers, exit events, judge-on-exit, seasons-unlock-at-R2)
  · the alternation hard-lock (T2/T3) · the two body economies
  (labour never costs HP) · the night-round mini-dungeon runner · the
  speaker-label ladder + the map re-label reveal (UI surfaces as story
  state) · the coin lanes (RESOLVE the flagged open problems first:
  kind-overflow sinks, the day-wage collection moment — economy ADR
  with the sim, ADR-132 flow).
- **B3 · The T0 prose wave** ⬩F — rewrite all T0 narrative sources to
  the new canon under the prose law, ADR-139 three-take bundles per
  unit, reviewed live in the DEV Story switcher. The t0.md sheet is
  the scene list; the voices sheet is the law.
- **B4 · Content migration** ⬩O — narrative-source restructure for the
  new beats/zones/cast (gen:narrative pipeline, registries, fixtures
  regen, `docs/content/t0-story.md`), name sweeps
  (Tokubei→Yohei etc.), test-fixture rederivation from the new
  thresholds.
- **B5 · Salvage & closure** ⬩O — archive
  `fable-2026-07-07-story-salvage.md` + the reboot plan once their
  content is fully superseded (forward pointers); HR-8 disposition
  (the old-beats read is moot once B3 ships — close with the human);
  CHANGELOG entry with the release that ships the new T0.

## Definition of done

**Bible:** every sheet at its staged depth, voices locked, register
rules decided, human-blessed end-to-end. **Reboot spirit:** the frame
ADR minted; PRD/roadmap rippled; the engine speaks 7 tiers and six
seasons; the shipped T0 plays the NEW story in the new prose — at
which point the reboot plan and this plan both archive, and the bible
alone carries the canon forward.
