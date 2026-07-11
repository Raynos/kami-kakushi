# Re-voice T0 to the 14–21 light-novel register

**Status:** 📋 PROPOSED (2026-07-11, session 176)
**Confidence:** ( 50% Opus, 50% Fable ) — take-authoring volume runs on Opus
(the 2026-07-11 usage steer); the canon wording, per-wave picks, and redlines
are register judgment and want Fable.
**Template:** build

## Why

Human steer, 2026-07-11 (canon per ADR-022): *"a nice and easy to read story
narrative to follow that makes sense and is engaging, like a captivating
light novel, for the target audience of age 14–21."* The human finds the
built T0 prose dense and hard to follow — Genemon at the R0 rung-up named
specifically — likes the story ideas, and suspects the story-bible voices
work against readability.

The audit
([`project/audit/reports/2026-07-11-t0-narrative-register-audit.md`](../../project/audit/reports/2026-07-11-t0-narrative-register-audit.md))
confirmed it: the prose is literary-adult **by mandate** — prose law §0.5.1
executed at full density produces ellipsis/inversion/inference-load on nearly
every line. Genemon is both the tutorial channel and the most oblique voice;
the works pages are the densest text AND off-spec (wall-to-wall metaphor from
the cast sheet's never-a-metaphor man); the hardest prose is the first prose
(cold open dream, third-person R0 reward lines); period vocabulary goes
unglossed with two word collisions (mon/mon, board/board); the MC has no
interiority — the light-novel anchor. The U9 ambient dialogue pool already
hits the target, proving voice + readability coexist. This plan is the fix:
register-tuning + canon amendments, not new story.

**Awaiting the human's D1–D4 ruling** (audit §Open decisions). Recommended
defaults are baked in below; overriding any reshapes, not kills, the plan.

## Who builds this — Fable or Opus?

- **Step 1 (canon):** Fable. The ADR text, the §0.5 clarity-floor wording,
  and the cast-sheet amendments ARE the taste bar every later wave scores
  against — judgment concentrates here.
- **Steps 2–6 take authoring:** blind **Opus** subagents (the 2026-07-11
  routing steer; blindness is also a feature — the author is never the
  judge). One agent per complete take, per ADR-139.
- **Clarity paraphrase readers:** Opus — the rubric is mechanical.
- **Per-wave self-pick + redlines + HR bundle:** Fable session preferred;
  Opus acceptable with the scorecard + keep-list as guardrails.

## What exists today

Source-verified this session (read in full, 2026-07-11):

- **Player-facing corpus:** `docs/content/t0-story.md` (GENERATED reading
  script — cold open · intros 1–3 · rung beats R1–R7 · generalized scenes
  incl. the works pages · hidden-rung reward lines). Authoring sources it
  compiles from: `src/core/content/narrative/{cold-open,intro,rung-beats,
  scenes,requirements,dialogue,flavor}.md` via `pnpm run gen:narrative`
  (FB-5; the `gen-narrative` gate byte-compares; never edit `*.gen.ts`).
- **Alternates machinery:** `narrative/takes/<bundle>/` bundles behind the
  DEV story set-switcher (ADR-139) — live-swappable; core-emitted text uses
  the declaring-module DEV-setter pattern. Already used by e.g.
  `fb324-rake-cap`, `estate-build-beats`.
- **Voice canon:** `docs/story-bible/01-laws.md` §0.5 (restraint · one
  voice one shape · vague-but-parseable §0.5.5 for mystery lines only) ·
  `04-cast.md` (Genemon "item, count, condition", "never reached for a
  metaphor"; MC "plainest voice") · `00-kernel.md` (untouched by this
  plan). No audience statement exists anywhere in canon; PRD §1.3 tone is
  "grounded, warm, bittersweet".
- **Open overlaps:** HR-28 (three intro scene heads, FB-362) is a live
  diverge on the cold-open/intro surface; HR-19/HR-18 (discoveries,
  season overlays) touch adjacent flavor. Latest ADR is ADR-180.

## Steps

Order rationale: canon first (every take scores against it), then
worst-first by the audit's F7 ranking; W3 waits on HR-28.

1. **Wave 0 — canon (one sitting, on the D1–D4 ruling).** Write **ADR-181**
   (number to confirm — live co-agents may take it): the audience lock
   (14–21 / light-novel readability, a §0.9-class constraint) + the §0.5
   clarity floor (extend §0.5.5's parseability to ALL fiction text: every
   line parses first-read, the WHAT never needs a second pass; ration
   compression per SCENE — one inversion, one litotes, one verbless
   fragment — not per character; reword §0.5.1 so "cut" means *say less*,
   never *make the reader assemble it*) + Genemon two-voice (book voice
   binds ledger entries read aloud; man voice = plain complete sentences
   for talk; metaphor stays off-limits) + MC interiority (1–3 plain
   interior narration lines per scene; speech stays plainest). Edit
   `01-laws.md` + `04-cast.md`; flip this plan to ✅ LOCKED.
2. **W1 — the works pages** (`scenes.md`: works-intro, works-u1…u4; the
   densest + off-spec text). Man-voice rewrite; the land-ledger figure
   rationed to ≤2 uses per scene. Full ADR-139 bundle (3 blind takes:
   *plain-and-warm* / *plain-and-dry* / *minimum-change* — canon with only
   floor violations fixed).
3. **W2 — the R1 terms scene + R0 reward lines** (`rung-beats.md` R1;
   `requirements.md` R0). The tutorial contract gets subjects and verbs;
   the three R0 rung-up lines move to second person / warmer report — the
   human's original flag. Same bundle shape.
4. **W4 — gloss + collision sweep** (`flavor.md`, `scenes.md`,
   `rung-beats.md`). First-use in-voice glosses for koku/to/mon/kura/
   omoya/nengu (model: gen-rake's *"koku — a year's eating for one man"*);
   resolve **mon**(coin)/**mon**(crest) → "crest" in prose, and
   **board**(table)/**tally board** → "tally" for the object. Pure term
   swaps are mechanical (ADR-139-exempt); NEW gloss sentences are fiction
   and ride a small takes bundle. Can interleave with W1/W2.
5. **W3 — the cold open + intro 1** (`cold-open.md`, `intro.md`).
   Concrete-first lead (weir → wake → then the dream inventory,
   shortened). **Blocked on HR-28 closing** (same surface — never two live
   diverges on one text); alternatively fold HR-28's heads into this
   bundle if the human prefers one review.
6. **W5 — medium scenes + the interiority pass** (`scenes.md` sb-lease,
   nengu-autumn-frame; `rung-beats.md` R6/R7 Genemon speeches; thread the
   1–3 interior MC lines across R1–R7). Interior lines are new fiction →
   takes; narrator litotes stacks get the per-scene ration.
7. **Close-out.** Full-arc cold read (below) → `/prd-ripple` + `pnpm run
   prd:drift` → clear the human's narrative TODO → Status ✅ DONE →
   archive.

Each of W1–W5 is one focused session, independently committable: takes
authored blind → clarity test → scorecard Pass 2 per take → pick +
redlines → `takes/` bundle wired to the DEV switcher → `gen:narrative`
green → HR bundle item → journal.

## Verification

Done is earned (PH3) — the checks, each RED-able:

- **The paraphrase test (per take, blind).** A fresh Opus reader gets the
  take cold — no bible, no brief — and must (a) state each paragraph's
  WHAT in one sentence, (b) flag any line needing a second read. RED =
  any WHAT-failure, or >1 re-read flag per scene. Failures are redlines
  back to the take, not judgment calls.
- **The voice check (per wave).** The picked take read against the
  audit's keep-list (U9 pool + signature lines) by one fresh reader:
  *does each speaker still sound like themselves?* Guards flattening.
- **The full-arc read (close-out).** One cold read of the regenerated
  `docs/content/t0-story.md` front to back: readability verdict + any
  register seam between old and new text.
- **The acceptance test:** the human plays R0→R1 live — the original
  R0/Genemon complaint either survives or it doesn't.
- **Existing gates:** `gen-narrative` byte-compare, `verify-content`,
  vitest content lanes; grep `src/tests/e2e/` + `src/core/*.test.ts` for
  asserted narrative strings before each wave lands (fixture drift
  precedent: 79b35600). The clarity floor itself stays a
  **scorecard/skill rung, not a verify gate** — a lint cannot judge
  parseability without crying wolf (AC-11).

## Sync ripple

- **PRD:** `docs/living/prd/01-vision.md` §1.3 Premise & tone gains the
  audience + readability sentence (cited to the new ADR), via
  `/prd-ripple` flow 1 (system/narrative → targeted ripple + ADR); run
  `pnpm run prd:drift` after Wave 0 and at close-out.
- **Story-bible:** `01-laws.md` §0.5 amendments + §0.9 audience
  constraint; `04-cast.md` Genemon two-voice + MC interiority + a note on
  the works-pages drift correction; `tiers/t0.md` pointer only if it
  names register.
- **Living docs / registries:** `pnpm run gen:narrative` per wave
  (regenerates `t0-story.md` — its diff is the per-wave review artifact);
  `docs/living/decisions.md` gains the ADR; no balance magnitudes move
  (no ADR-132 run); fixtures untouched unless the e2e grep says otherwise.
- **CHANGELOG:** none — no version bump ships this plan; the release that
  eventually carries the re-voice adds its section then.

## Human-in-the-loop

- **Blocking (by design):** the D1–D4 ruling (audit §Open decisions) gates
  Wave 0. Proposed defaults: adopt D1+D2+D3; D4 = worst-first bundles.
- **Per wave:** one HR bundle item (coherent bundle, never atomized taste
  calls — ADR-139); alternates stay DEV-only until sign-off; taste
  scorecard Pass 1 brief before authoring, Pass 2 per take.
- **Existing items:** HR-28 sequencing choice (close first vs fold into
  W3) is the human's; HR-18/HR-19 stay independent (adjacent surfaces,
  no text overlap).
- **Open question, with default:** should the clarity floor bind T1+
  authoring immediately? Default YES — it's a prose-law amendment, tier
  \-agnostic; only the *re-voicing* is scoped to T0.

## Non-goals

- No story changes: kernel, spine, scene structure, motives, the naming
  arc all stand.
- No tone change: no modern slang; period texture and restraint-as-value
  stay. The fix is syntax + information delivery.
- No touching the U9 ambient pool or season turns (audit F7: already on
  target) beyond the W4 term sweep.
- No UI work: a tap-gloss affordance for period terms is a separate
  design question (parked; would be its own diverge).
- No engine changes: content + canon only; a beat needing real code uses
  the existing `native:` escape hatch.

## Risks

- **Voice flattening** — plain ≠ same. Guards: the keep-list + voice
  check; the *minimum-change* take in every bundle keeps a conservative
  floor.
- **Diverge collision** — HR-28 overlaps W3 (sequenced/foldable above);
  check open HR items before each wave starts.
- **Canon races on this shared tree** — the ADR number and §0.5 text may
  collide with live co-agents; stale-canon guard before every bible
  edit; pathspec commits only.
- **Opus take quality on prose** — the paraphrase rubric is objective and
  the pick step compensates (Fable redlines rather than re-authoring
  blind). If takes read flat two waves running, stop and re-route with
  the human.
- **Rollback story** — every wave ships as a `takes/` bundle with canon
  as the *minimum-change* baseline; reverting a wave = re-picking the
  prior take; nothing is destructive.
