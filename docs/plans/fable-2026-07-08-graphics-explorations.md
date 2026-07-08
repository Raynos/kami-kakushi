# Graphics explorations — the R0–R1 top three

**Status: 📋 PROPOSED — awaiting the human's read. Specs/prototypes may
start any time; nothing integrates into the live game surfaces until the
storywave Plan B seam allows (see "The seam" below).**

**Confidence: ( 35% Opus, 65% Fable )** — the spec + composition-grammar
work is taste-dense (Fable); drawing/building to a SIGNED spec is
Opus-safe (the map precedent: map-authoring §6 model routing).

Chosen 2026-07-08 by the human as the top 3 of the triaged 15 for
**graphical-fidelity bang-for-buck in the T0 R0–R1 window** (tab reveals:
Work R0 · Map + Estate R1 · Character R2 · Combat + Inventory R3). The
full slate + shelves: [`docs/living/graphics-concepts.md`](../living/graphics-concepts.md);
verdict history: `project/brainstorms/2026-07-08-novel-graphics-directions.md`.

## Who builds this — Fable or Opus?

- **Spec / grammar phases (E1.1, E2.1, E3.1): Fable.** Each is the
  taste-heavy artifact (what the drawing may claim, the rubric's teeth,
  the composition grammar). Doubt favors Fable.
- **Prototype / build phases (E1.2+, E2.2+, E3.2+): Opus-capable** —
  drawing to a signed spec under pin + blind-pass is exactly the lane the
  map system built for non-Fable sessions. Judge loops (blind-pass,
  scorecards) stay fresh-eyes subagents either way.

## The prototype-first law (human, 2026-07-08)

Every exploration ships its FIRST artifact as a **lightweight, graphics-
only prototype behind the DEV menu** — a rendered thing you can look at,
fed by static or derived data, with **zero game integration** — the same
way the map sheet started as an image behind DEV before it was
player-bound. Integration is a LATER, separately-gated step. This keeps
each exploration cheap to kill (PH4/PH5: the human judges a real render,
not a promise) and keeps `src/` contact minimal while Plan B runs.

## The seam — storywave Plan B owns src/**

Plan B's executor owns `src/**` until it lands. These explorations touch
code only as: (a) a new self-contained module dir (e.g.
`src/ui/estate-sheet/`, `src/ui/stamp-book/`) + (b) one DEV-menu entry
each. Coordinate via the journal + snapshot before ANY commit that
touches a shared file (DEV panel registry); never stage Plan B's paths.
If contention bites, prototypes wait — specs (docs-only) never do.

Shared laws for all three: taste-scorecard two-pass (Pass 1 brief before
building) · seeded determinism (one RNG) · golden pin once a look is
kept · blind-pass with a written rubric before "done" · ADR-075 diverge
where the surface is new · the placement law (a concrete UI home, named
in advance).

---

## E1 · Estate cutaway (#5) — okoshi-ezu elevation sheet

> **Status note (2026-07-08, s123): E1.1 + E1.3 BUILT — awaiting HR-16.**
> Two human steers reshaped the track: (1) the diverge capped at **2
> variants**; (2) the cutaway is a **STANDALONE prototype experiment,
> NOT part of the map-sheets system** — a parallel system reusing the
> ink-toolkit code only, so the spec/rubric live in
> `src/ui/estate-sheet/README.md` (never map-spec/map-styles), and the
> build was pulled forward past the E1.2 HR gate (E2/E3 precedent; the
> spec read rides HR-16). Built: `src/ui/estate-sheet/` — A fold-up ·
> B section-cut × 3 fixture eras, DEV → Story → "⤢ Estate sheet"; own
> golden pin; blind-pass green on BOTH (all M + 4/4 S; report:
> `project/audit/reports/2026-07-08-e1-estate-sheet-blind-pass.md`);
> self-pick A. **E1.4 integration stays GATED** (Plan B + HR-9).

**Home:** the Estate tab's centerpiece (R1). **Why first:** best pure
bang-for-buck — lands the map-tab "wow" on R1's other new tab; proven
machinery, new projection (elevation, not plan).

1. **E1.1 Spec (now, docs-only).** A new numbered section in
   `docs/guides/map-spec.md` per map-styles §4: master truths from the
   bible's estate anatomy (`05-world.md`) — main house · guest house ·
   the ruin looming at interior scale (the scale-shock trick indoors) ·
   which estate-state facts re-ink (repairs, new rooms, the ruinRevealed
   seam). Blind-reader rubric (M/S lines) written FIRST. An okoshi-ezu is
   a **new sheet class** → the look gets an ADR-075 diverge (2–3 working
   variants) at prototype time, per map-styles §4.5.
2. **E1.2 HR read.** The human reads the spec before any drawing
   (HR-item + reading queue).
3. **E1.3 DEV prototype.** `src/ui/estate-sheet/` drawing from a static
   estate-state fixture; DEV-menu entry; 2–3 look variants; pin the
   pick; blind-pass loop vs the rubric until all M + ≥half S.
4. **E1.4 Integration — GATED.** Waits for Plan B landing + the HR-9
   Estate-section pick. Not part of this plan's DoD.

**Cost gut-feel (Fable-5-high):** ~15–20M tokens to a pinned prototype
(spec ~3M · draw+iterate ~10M · blind-pass loops ~4M) — the T2-sheet
class of job, minus the world-layout invention.

## E2 · VN scene-card pilot (#12) — the cold open

> **Status note (2026-07-08, s122):** the human pulled a **single lightweight
> demo** forward past E2.1/E2.2 — one version, no diverge, and TWO cards
> (illustrating the idea, not the one-card pilot): Sōan's sickroom +
> Genemon's grain-store from the existing cold-open/intro text. Built:
> `src/ui/scene-cards/` (DEV → Story → "⤢ Scene cards"; style notes in the
> module README). **v1 (figurative room-scenes) got the human's slop
> verdict**; rebuilt same-session as **kage-e silhouette theatre + a
> misregistered press layer** — the 1+2 pick from
> [`2026-07-08-e2-scene-card-rescue.md`](../../project/brainstorms/2026-07-08-e2-scene-card-rescue.md).
> **Human verdict on v2 (2026-07-08): E2 is PARKED — both demo versions stay
> in code as concept references** (`cards-v1.ts` figurative · `cards.ts`
> kage-e, both labelled parked in the DEV menu); no further E2 work until
> the human un-parks. The steps below remain the track if it resumes — the
> E2.1 grammar spec, the real one-moment diverge, and the keep/kill ruling.

**Home:** the cold open (R0's first impression). **Scope:** ONE card,
period. **Kill criterion is part of the spec:** if the pilot reads slop
after the diverge + two redline rounds, kill it and keep the cold open
typographic — that outcome is a SUCCESS of the process, not a failure.

1. **E2.1 Composition grammar spec (docs-only).** What a scene card may
   be: which primitive vocabulary (roofline, river band, lantern glow,
   figure-scale void, caption cartouche), composition rules (horizon
   band, negative space, one focal mass), what it must NEVER attempt
   (faces, literal action). Rubric: a cold reader answers "what moment
   is this?" + "does it read woodblock or slop?".
2. **E2.2 HR read** of the grammar.
3. **E2.3 DEV prototype.** 2–3 diverged compositions of the SAME cold-
   open moment behind the DEV menu; taste-scorecard each; self-pick;
   human rules keep/kill.
4. **E2.4** (only if kept) Wire into the cold-open scene; the emakimono
   (#13) un-parks only after this proves the grammar.

**Cost gut-feel:** ~25–40M tokens, the widest error bars of the three —
grammar invention from scratch + the heaviest screenshot-judge iteration;
budget for spend-then-kill as a real outcome.

## E3 · Progression menu (#8 stamp book ❤️ + #10 ink thread)

> **Status note (2026-07-08, s121):** the human pulled a **single lightweight
> demo** forward past E3.1/E3.2 — one version, no spec, no diverge (newest
> steer supersedes the sequencing — ADR-022). Built: `src/ui/stamp-book/`
> (fixture-fed, DEV → Story → "⤢ Stamp book"; how/why in the module README +
> journal s121). **Human verdict: happy as-is for now — PAUSED.** The steps
> below still gate anything beyond the demo; E1/E2 untouched.

**Home:** a progression/record surface — **the home itself is the first
design fork** (own tab? a Character-tab panel? the ceremony's book?).
Window-independent (first stamp presses at the R0→R1 ceremony; value
compounds all run).

1. **E3.1 Spec (docs-only).** The stamp grammar (seal form + six-season
   date + flourish; seeded per rung/milestone — #3's generator machinery
   at stamp-book scale only) · the page/leafing model · the ink-thread
   stroke grammar (its path derives from the run's event history: knots
   at crises, thin passages at lean seasons — legibility rules so it
   reads brush, not scribble). Home fork surfaced as an HD-item with a
   recommended default; the human rules before prototype.
2. **E3.2 HR read.**
3. **E3.3 DEV prototype.** `src/ui/stamp-book/` fed by a fixture event
   history; ADR-075 diverge (it's a NEW surface): 2–3 working variants
   behind the DEV toggle; blind-pass ("whose run is this? what happened
   at the knot?") + scorecards; self-pick; HR-item per variant.
4. **E3.4 Integration — GATED** on Plan B (the rung/ceremony machinery
   it hooks is being rewritten).

**Cost gut-feel:** ~20–30M tokens (two sub-systems — stamps + thread —
plus a full ADR-075 diverge; each alone is small, the diverge multiplies).

---

## Sequencing

E1.1 + E2.1 + E3.1 specs can all start now (docs-only, seam-safe, cheap).
Prototypes follow their HR reads, one at a time, in the order **E1 → E2
→ E3** unless the human reorders. Every exploration is independently
kill-able; killing one promotes the next SOON-shelf concept
([`graphics-concepts.md`](../living/graphics-concepts.md)) for a ruling.

## Open questions (defaults noted; PH4 — surfaced, not blocking)

1. **E3's home** — default: a "Record" panel on the Character tab (R2),
   with the ceremony pressing stamps into it. HD-item at E3.1.
2. **E1 variant count** — default 2 (elevation-style fork: fold-up
   okoshi-ezu vs flat section-cut); 3 if the first two converge.
3. **E2 pilot moment** — default: the cold open's opening beat; if its
   text proves un-depictable under the no-faces law, the arrival-at-the-
   gate beat is the fallback pilot.
