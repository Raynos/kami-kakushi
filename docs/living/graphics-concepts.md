# Graphics concepts — the register

> **LIVING DOC — the single home of the game's graphics-concept slate**
> (TST1: one home; this file supersedes the shelf lists that briefly lived
> in `project/BACKLOG.md`). Born from the 15-candidate brainstorm + the
> human's live triage, 2026-07-08. **Status per concept is maintained
> HERE**; history (the full pitches + the human's verbatim verdicts) stays
> in `project/brainstorms/2026-07-08-novel-graphics-directions.md`; the
> active explorations' sequencing lives in
> [`docs/plans/fable-2026-07-08-graphics-explorations.md`](../plans/fable-2026-07-08-graphics-explorations.md).
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

### ▶️ ACTIVE — the T0 R0–R1 explore slate (top 3 by bang-for-buck)

| # | concept | home | one line |
|---|---|---|---|
| 5 | **Estate cutaway** (okoshi-ezu) | Estate tab centerpiece (R1) | Carpenter's elevation of house + guest house + ruin, re-inking as the estate rises — the map system's sibling, new projection. |
| 12 | **VN scene-card pilot** | The COLD OPEN (R0) | ONE composed woodblock vignette from existing primitive vocabulary; "really really really hard" — kill fast if it slops. |
| 8+10 | **Progression menu** ❤️ | A progression/record surface (home fork open) | Shuinchō stamp book — rungs/milestones/tiers as pressed stamps — strung on the run's single growing ink-thread brushstroke. |

Sequencing, gates (Plan B seam, HR-9), routing → the
[explorations plan](../plans/fable-2026-07-08-graphics-explorations.md).

### 🅿️ PARKED SOON — first pulls once the active three land

| # | concept | home | pull-forward condition |
|---|---|---|---|
| 4 | **Bestiary field-guide plates** | The HR-5 Combat-tab Bestiary panel (confirmed) | Combat reveals at R3; queue behind the top 3. |
| 6 | **Family register** (kafu) | UNKNOWN — that's the point | FIND THE HOME FIRST: a placement proposal the human rules on, before any drawing. |
| 15 | **Item pictogram A/B** ⚠️ | Inventory tab (R3) | An honest A/B vs emoji (10-item contact sheet BOTH ways, blind-passed + taste-judged). "Both are slop, keep emoji" is a valid outcome; ADR-127's emoji clause amends only if pictograms WIN. |

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
