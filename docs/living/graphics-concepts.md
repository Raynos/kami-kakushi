# Graphics concepts — the register

> **LIVING DOC — the single home of the game's graphics-concept slate**
> (TST1: one home; this file supersedes the shelf lists that briefly lived
> in `project/BACKLOG.md`). Born from the 15-candidate brainstorm + the
> human's live triage, 2026-07-08. **Status per concept is maintained
> HERE**; history (the full pitches + the human's verbatim verdicts) stays
> in `project/brainstorms/2026-07-08-novel-graphics-directions.md`. The
> explore slate **ran to completion (2026-07-08)** — its plan,
> [`fable-2026-07-08-graphics-explorations.md`](../../project/archive/fable-2026-07-08-graphics-explorations.md),
> is done (all three demos built + judged); each demo's verdict and
> forward track is captured in the slate below, so the register stands
> alone once the plan archives.
> The visual language itself is [`ui-design.md`](ui-design.md)'s; nothing
> here overrides it.

## The anti-slop thesis (why the map worked; every concept inherits it)

A kami-kakushi graphic is **not an illustration — it is a drawing an
instrument could have made**:

1. **Drawn by code from data** — seeded primitives, a deterministic
   function of game state; no assets, no generation-time vibes.
2. **A period document genre supplies the constraint** — obeying a real
   genre reads handmade; defaults read slop (PH5).
3. **Spec-first · golden pin · blind-pass** — taste front-loaded into a
   human-read spec; the committed look changes only deliberately; fresh
   eyes grade legibility against a rubric.
4. **The fiction owns the document** (TST3) — someone in the story made
   every artifact, which decides what it honestly knows.

**The placement law (human redline, 2026-07-08):** every concept must
name a concrete UI home — "where in the damn UI would this go". A
homeless concept doesn't get built; "finding the home" can be an
exploration's first deliverable, a vague "somewhere" cannot.

## The slate

### 🅿️ EXPLORED — the R0–R1 explore slate RAN (plan complete, 2026-07-08)

All three top-3 concepts shipped a lightweight DEV demo (DEV → Story) and
the human judged each. The [explorations plan](../../project/archive/fable-2026-07-08-graphics-explorations.md)
is **COMPLETE**; each concept is parked here at its verdict with its
forward track, so it can be pulled back up by the human's call without the
plan. Real integration stays gated on storywave **Plan B** (+ **HR-9** for
E1's Estate tab).

| # | concept · home | verdict (human, 2026-07-08) · what's kept | forward track (if resumed) |
|---|---|---|---|
| 5 | **Estate cutaway** (okoshi-ezu) · Estate tab centerpiece (R1) | ⚠️ **NEEDS MORE WORK** — the human looked and ruled the demo isn't ready to carry forward as-is (closes HR-16). Demo built: `src/ui/estate-sheet/`, DEV → Story → "⤢ Estate sheet" — **A** fold-up okoshi-ezu (self-pick) · **B** flat section-cut, ×3 fixture eras; blind-pass green (5 M + 4/4 S). Neither variant ships. | **Track OVERTAKEN by reality (rewritten 2026-07-18):** integration already happened — the sheet ships TODAY as the **Estate 家 tab's variant A** (`paintSheetA` over live state via `from-state.ts`; rooms re-ink as they reopen per H5; prod default, **HR-30 open** — the pick stays the human's). What remains is the LOOK CRAFT on HR-30's three recorded ✘s (P20 mobile · TST4 shutters · P2 idiom): `docs/plans/fable-2026-07-18-estate-sheet-craft-pass.md`, IN-PROGRESS with rulings locked (tap-to-maximize mobile · full Andon furniture · the fixture-era DEV proto door retires). Spec + rubric: `src/ui/estate-sheet/README.md`. |
| 12 | **VN scene-card pilot** · the COLD OPEN (R0) | 🅿️ **PARK** — both demo versions kept in code as concept refs. `src/ui/scene-cards/`, DEV → Story → the two "⤢ Scene cards" entries: **v1** figurative room-scenes (ruled SLOP) · **v2** kage-e silhouette theatre + misregistered press (the 1+2 rescue pick). "Really really hard — kill fast if it slops." | Resumes (if ever) at the real track: grammar spec → HR → one-moment diverge → keep/kill. Rescue notes: `project/brainstorms/2026-07-08-e2-scene-card-rescue.md`. |
| 8+10 | **Progression menu** ❤️ · a progression/record surface (home fork open) | ✅ **YEAH GOOD** — human ruled *happy as-is for now, continue later*. Demo kept: `src/ui/stamp-book/`, DEV → Story → "⤢ Stamp book" (one version, fixture-fed) — shuinchō stamp book (rungs/milestones/tiers as pressed stamps) on the run's single growing ink-thread stroke. | Resume the real E3 track: stamp/thread grammar spec → HR (home fork: a Record panel on the Character tab?) → ADR-075 diverge → pin. **Plan authored 2026-07-18** (human pull-forward; the Plan-B gate is satisfied — Plan B shipped v0.4.0): `docs/plans/fable-2026-07-18-stamp-book-resume.md`. |

### 🅿️ PARKED SOON — first pulls once the active three land

| # | concept | home | pull-forward condition |
|---|---|---|---|
| 4 | **Bestiary field-guide plates** | The HR-5 Combat-tab Bestiary panel (confirmed) | Combat reveals at R3; queue behind the top 3 — condition MET (the explore slate ran 2026-07-08). **Plan authored 2026-07-18** (human pull-forward): `docs/plans/fable-2026-07-18-bestiary-plates.md`. |
| 6 | **Family register** (kafu) | UNKNOWN — that's the point | FIND THE HOME FIRST: a placement proposal the human rules on, before any drawing. |
| 15 | **Item pictogram A/B** ⚠️ | Inventory tab (R3) | An honest A/B vs emoji (10-item contact sheet BOTH ways, blind-passed + taste-judged). "Both are slop, keep emoji" is a valid outcome; ADR-127's emoji clause amends only if pictograms WIN. **Plan authored 2026-07-18** (human pull-forward): `docs/plans/fable-2026-07-18-pictogram-ab.md`. |

### 🅿️ PARKED FOR A WHILE — distant triggers

| # | concept | trigger |
|---|---|---|
| 7 | **Document engine** (deeds/letters as drawn washi) | Plan B lands Phase-2 deeds as inspectable objects. |
| 3 | **Hanko seal generator** | Rides with #7 — needs a document surface to exist at all. |
| 9 | **Season wheel instrument** | Plan B's season surface ships plain first; revisit after. |
| 13 | **Emakimono story scroll** | The #12 pilot proves the vignette grammar ("even harder — combine multiple features into one cohesive whole and somehow not slop it"). |
| 2 | **Kamon crests** (lands ~T4) | A surface that needs faction identity (the T4 town plan's crested rectangles, faction UI). |

### ❌ PASSED (kept for the why)

| # | concept | why it's out |
|---|---|---|
| 1 | Kaō signatures | "Not a graphics quality improvement — a little signature… I just don't think it will add much." |
| 11 | Weather/atmosphere layer | Ambient motion at the frame is out; the still, composed frame IS the look. |
| 14 | Combat stroke choreography | Gesture-rendered combat is out. |

## Lifecycle

A concept moves shelves only by the human's call. When an ACTIVE
exploration ships (or is killed), record the outcome here in one line and
pull the next SOON item up for a ruling. New concept ideas enter via a
brainstorm + triage, then get a row here — always with a named home.
