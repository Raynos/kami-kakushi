# Re-voice T0 to the 14–21 light-novel register

**Status:** 🔧 LOCKED & IN PROGRESS — **Wave 0 (canon) landed 2026-07-12**
(HD-38 ruled → **ADR-185**); W1 is next.
**Confidence:** ( 100% Opus ) — *revised 2026-07-12: Fable is at its weekly cap,
and the register judgment the canon needed was made by the **human** at the
HD-38 walkthrough, not by a model. What remains is take-authoring (blind Opus
subagents, already the plan) and per-wave picks against the scorecard + keep-list,
with the human's HR bundle as the real gate.*
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

## Locked decisions (HD-38, human, 2026-07-12 → ADR-185)

All four forks ruled at a piece-by-piece walkthrough. The full rationale is
**[ADR-185](../living/decisions.md)**; the verbatim intent is
[`2026-07-12-hd38-register-ruling.md`](../../project/feedback-human/2026-07-12-hd38-register-ruling.md).

1. **D1 — audience + clarity floor: ADOPTED, floor written as an OUTCOME
   test.** §0.9.6 locks the 14–21 / light-novel reader; §0.5.5 now binds ALL
   fiction text (every line parses first-read); §0.5.1's *"cut"* means **say
   less**, never *make the reader assemble it*. **The per-scene device quota
   was REJECTED** — the disease is inference load, not grammar; the teeth is
   the **blind paraphrase pass** (a check that can go RED), kept off the
   `verify` gate on purpose (AC-11). **Binds T1+ authoring now.**
2. **D2 — Genemon two-voice: ADOPTED.** Book voice = the ledger; man voice =
   plain complete sentences for all talk. The works pages' metaphor is
   **off-spec against the cast sheet that already existed** — rewriting them is
   a bug fix.
3. **D3 — MC interiority: ADOPTED, bounded.** Attention + intent only; **never
   memory** (that's the dream's, §0.5.4); things and counts, never feelings; no
   quota. **§0.5.8 person also locked:** *"you"* = what you live, *"he"* = the
   overheard register, until R7 names him.
4. **D4 — scope: worst-first, THEN a full sweep.** Both, in that order.

**Two audit findings the human's ruling overturned** (source-checked, PH2) —
the **R0 reward lines stay third-person** (the whole R0–R7 ladder is; the
human's flag was the **Terms speech**), and the **cold open needs no re-lead**
(already concrete-first — the burden is **Intro 1**).

## Who builds this — Fable or Opus?

*Revised 2026-07-12 (Fable at its weekly cap; the canon judgment was the
human's, not a model's).*

- **Wave 0 (canon):** ✅ **DONE — Opus, 2026-07-12.** The taste bar was set by
  the human's D1–D4 rulings; the agent transcribed them into ADR-185 + the
  bible amendments and read the text back.
- **W1–W6 take authoring:** blind **Opus** subagents (blindness is a feature —
  the author is never the judge). One agent per complete take, per ADR-139.
- **Clarity paraphrase readers:** Opus — the rubric is mechanical.
- **Per-wave self-pick + redlines + HR bundle:** Opus, with the taste scorecard
  and the audit's keep-list as guardrails; **the human's HR-bundle review is
  the real gate**, and alternates stay DEV-only until it lands.

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

Order rationale: canon first (every take scores against it), then **worst-first
re-ranked by the human's D2 answer** — the flagged text was the **Terms
speech**, so it leads — and finally the **full sweep** D4 asked for, which
closes the register seam the worst-first waves would otherwise leave behind.

0. ✅ **Wave 0 — canon. DONE (2026-07-12).** **ADR-185** written (ADR-181 was
   taken by a co-agent); `01-laws.md` amended (§0.5.1 reworded · §0.5.5 = the
   clarity floor, binding ALL fiction · **§0.5.8 person, new** · **§0.9.6 the
   14–21 audience, new**) and `04-cast.md` amended (Genemon's two voices · the
   MC's bounded inner line). HD-38 closed and archived.
1. **W1 — the Terms scene** (`rung-beats.md` R1). *The human's named
   complaint, and the highest-stakes text in the game.* The tutorial contract
   gets subjects and verbs: six verbless fragments carry the player's
   employment terms today, with **"No coin"** — the single most consequential
   fact — buried in a subordinate clause. Genemon speaks it in **man voice**;
   his book voice stays for what he writes. Also retire the in-scene riddle
   (*"Six hands' work, five men fed…"*) — his plain twin (*"The paddies take
   six hands at the least. Five sleep here now. You are the sixth."*) is eight
   lines away in the same scene and is the calibration target. Full ADR-139
   bundle (3 blind takes: *plain-and-warm* / *plain-and-dry* /
   *minimum-change* — canon with only floor violations fixed).
2. **W2 — the works pages** (`scenes.md`: works-intro, works-u1…u4). The
   densest text in the tier, the biggest volume, and **off-spec**: wall-to-wall
   land-ledger metaphor from the man the cast sheet says *"has never in his
   life reached for a metaphor."* Man-voice rewrite; the figure survives at
   most twice per scene, if at all. Same bundle shape — and note the
   *minimum-change* take here is still a real rewrite, because canon itself is
   the violation.
3. **W3 — gloss + collision sweep** (`flavor.md`, `scenes.md`,
   `rung-beats.md`). First-use in-voice glosses for koku/to/mon/kura/omoya/
   nengu (model: gen-rake's *"koku — a year's eating for one man"*); resolve
   **mon**(coin)/**mon**(crest) → "crest" in prose, and **board**(table)/
   **tally board** → "tally" for the object. Pure term swaps are mechanical
   (ADR-139-exempt); NEW gloss sentences are fiction and ride a small takes
   bundle. Interleavable with anything.
4. **W4 — Intro 1** (`intro.md`, and the `cold-open.md` dream beat it
   reprises). **NOT a cold-open re-lead** — the cold open is already
   concrete-first (`lede → weir → wake → dream`). The burden is Intro 1: it
   replays the dream inventory verbatim and then makes the game's **first
   choice** a pick among three abstractions (*Hold the knot / Strike the list /
   Take up the load*) drawn from things the MC cannot remember. The perk prose
   also flips to second person per §0.5.8. **HR-28 is not a conflict** — it is
   the three *card titles*, not the body.
5. **W5 — medium scenes + the interiority thread** (`scenes.md` sb-lease,
   nengu-autumn-frame; `rung-beats.md` R6/R7 Genemon speeches; thread the MC's
   interior lines across R1–R7). Interior lines are new fiction → takes, and
   every one is checked against D3's two bounds (never memory; things not
   feelings).
6. **W6 — the full sweep** *(the human's D4: "worst-first, then a full
   sweep")*. Every remaining line of T0 read against the floor, so no register
   seam survives between re-voiced and untouched text. The U9 ambient pool and
   the season turns are the **calibration set** — they already pass, and the
   sweep confirms rather than rewrites them. Expect this to be mostly a read
   with a short redline list, not a rewrite wave; if it isn't, that is itself
   the finding.
7. **Close-out.** Full-arc cold read (below) → `/prd-ripple` + `pnpm run
   prd:drift` → Status ✅ DONE → archive.

Each of W1–W6 is one focused session, independently committable: takes
authored blind → paraphrase test → scorecard Pass 2 per take → pick +
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

- ✅ **The blocking ruling is CLOSED** — HD-38 (D1–D4) ruled by the human
  2026-07-12 → **ADR-185**; see "Locked decisions" above. Wave 0 is unblocked
  and landed.
- **Per wave:** one HR bundle item (coherent bundle, never atomized taste
  calls — ADR-139); alternates stay DEV-only until sign-off; taste
  scorecard Pass 1 brief before authoring, Pass 2 per take.
- **Existing items:** HR-28 is **independent** — it holds the three intro
  *card titles*, not the body prose W4 rewrites; it can close whenever the
  human reads it. HR-18/HR-19 stay independent too (adjacent surfaces, no
  text overlap).
- **The acceptance test is the human's:** play R0→R1 live after W1 — the
  original Terms-speech complaint either survives or it doesn't.

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
