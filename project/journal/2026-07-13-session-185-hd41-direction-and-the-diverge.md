# Session 185 — 2026-07-13 — HD-41: direction given build-first; the rung-reward diverge opens

**Summary:** The human ran through HD-41 live: first "(a) lock it in",
then widened to "(a) & (c) and maybe a bit of (d)", then held the lock —
*build the diverge, play it, THEN the ADR*. A prematurely-written
ADR-188 was removed (never committed); HD-41 flipped to ⏳
direction-given; the plan went IN-PROGRESS with four build-shape calls
answered via AskUserQuestion — and then the diverge was BUILT this same
session (see "The build", below). Awaiting the HR-41 play verdict, which
writes the ADR.

## What changed

- `project/human-in-the-loop/decisions.md` — HD-41 rewritten: ⏳ direction
  given ((a)+(c)+bit of (d), (b) dead), lock held until the diverge is played;
  resolution comes as an ADR after the play verdict.
- `docs/living/decisions.md` — net zero: an ADR-188 was appended between the
  human's beats 1 and 3, then removed on the "build-first" steer. The ADR slot
  stays free for the post-play ruling.
- `project/feedback-human/2026-07-13-hd41-ruling.md` — NEW: the three verbatim
  beats + the reading + what was applied.
- `docs/plans/opus-2026-07-12-rung-reward-legibility.md` — Status ▶️ ACTIVE;
  step 0 cleared as a direction; step 4 gains the "play → pick → THEN the ADR"
  tail; the four build-shape calls recorded (span-both Progress text · all
  rungs · (d) unconditional · built this session, Fable).

## Next intended steps

1. Taste-scorecard Pass 1 (constraint brief) for the log treatment.
2. The ADR-075 diverge: 2–3 working variants (quiet→loud) behind the DEV
   toggle; the distinct-Progress-line variant carries ADR-139 3 blind takes.
3. (d) unconditional: the % bar's visible movement when a line lands.
4. HR items per variant; the human plays; the ADR is written only then.

## Taste Pass 1 — the constraint brief (earned-line diverge, ADR-135)

Walked before any variant was authored. The applicable principles and
what THIS surface must do to honor each:

- **P2 · one primitive per idiom:** reuse what exists — the milestone
  gold pigment (progress = gold, the bimetal rule; NOT vermilion), the
  CHANNEL_BULLET slot, the fresh-divider precedent. No new one-off
  primitive; the earned mark is a class on the existing log-line.
- **P3 · voice at the source:** the line stays narrator-voiced; a
  treatment must never fake a speaker or add a nameplate.
- **P4 · append-only render:** treatments are build-time classes + CSS.
  A variant flip repaints via the SAME sanctioned path as a filter
  switch — never a mid-watch rebuild of a watched surface (TST2).
- **P9 · discover, don't spawn:** no new panel, no toast; the line
  lands where it always did, it just reads as earned.
- **P12 · the one typewriter contract:** earned lines keep typing
  (narration channel); variant C's terse line types on first
  appearance in Progress too.
- **P13 · rewards are diegetic:** the mark must read as a period mark
  (the ledger rule, the master's dot on done work) — never a badge,
  chip, or web toast.
- **P16 · route by narrative weight:** THE principle under repair — a
  requirement completion is EARNED, so it must register in Progress;
  its prose stays Story. This is option (a), common to all variants.
- **P17 · controls advertise state:** the Progress tab's unread dot
  must fire when an earned line lands there (falls out of the
  log-filter routing — verify, don't assume).
- **P18 · transcripts read effortlessly:** treatments must not break
  block-breaks, scene groups, or the divider; no layout shift on the
  earned class.
- **P19 · two registers:** the log is reading register — earned lines
  breathe; no dense chrome, no boxed spam per completion.
- **Kernel #3 (scarce praise):** the variant range spans quiet → loud
  so the human picks the floor; the DEFAULT is the quiet end.
- **Kernel #6 (form is the fiction):** variant C's terse Progress line
  carries the whole risk — no "Requirement 1/3", no game-words, ever;
  it must survive repetition (it fires several times per rung).
- **(d), unconditional:** the rung bar's movement becomes visible at
  the moment the line lands — additive class animation on the existing
  meter, reduced-motion honored, never a rebuild.

## The build (same session, post-ruling)

The full ADR-075 diverge + the ADR-139 docket bundle, built and
self-verified:

- `src/ui/log-filter.ts` — `isEarnedLine()` (keys off the ADR-186
  `requirement.<id>` descriptor — no core change, old saves classify on
  re-render) + a 5th `earned` axis in `logFilterMatches`: an earned line
  shows in Progress AND keeps Story.
- `src/ui/log-filter.test.ts` — the HD-41 earned-axis describe block
  (4 tests, RED against the old mapping).
- `src/ui/render.ts` — the `earned` class on requirement lines; the
  variant-C docket branch (DEV-only, `__DEV_TOOLS__`-gated); the
  `data-earned-style` stamp + sanctioned full-repaint on variant flip;
  the (d) rung-meter `bump` pulse on percent growth (never first
  paint/load; reduced-motion exempt).
- `src/ui/styles.css` — A (gold registry dot, the attribute-less
  default = prod), B (ruled day-book row), C (docket in the milestone
  register), + the `rung-meter-bump` keyframe.
- `src/ui/dev.ts` + `src/core/content/narrative/flavor.md` +
  `takes/hd41-earned-entry/` — the `earned-line` SURFACES entry, the
  `earnedEntry` canon key ("Set down in the house's book.", take a),
  and takes b ("It is seen. No one says anything.") / c ("Another notch
  on the tally-stick.") from 3 blind agents. **These landed in the
  co-agent's `295bbd56`** (fold-with-credit, crowded-tree protocol —
  their sleep-announce work shared the same files).
- `project/human-in-the-loop/review.md` — **HR-41** (the pick + the
  docket takes; the verdict WRITES the HD-41 ADR).
- **Proof (PH3/PH6):** `verify` 19/19 green · headless proof 8/8 green
  (post-cold-open fixture; screenshots in
  `project/audit/screens/2026-07-13-hd41-earned-line/`, git-ignored) ·
  hard-strip build (`SHIP_DEV_TOOLS=false`) greps clean — zero variant
  strings in prod, zero flag-debt.

## Landmines

- **Do NOT write the HD-41 ADR yet** — the human explicitly held it until
  after playing the variants. HD-41 stays in `decisions.md` as ⏳.
- Old saves' log entries: verify whether the channel re-derives from the
  `requirement.<id>` contentKey (ADR-186) or is stored literally — pre-change
  history should not silently miss the new treatment.
- `project/todo-human.md` was already dirty at session start (not this
  session's work) — left uncommitted.
