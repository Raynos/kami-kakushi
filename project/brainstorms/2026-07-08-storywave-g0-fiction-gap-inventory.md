# Storywave G0 — the fiction-gap inventory (pre-flight)

**Session 124, 2026-07-08.** The G0 pre-flight required by the storywave
GAME plan (`docs/plans/fable-2026-07-07-storywave-game.md` → G0): walk the
G4 spec for every fiction-voiced string the rewrite will show, check each
against the staged prose wave in `src/core/content/narrative/t0v2/`, and
list what has no source. The output is **HD-30** (a request to run a
supplemental prose mini-wave). This doc is the backing detail; HD-30 is the
concise queue entry.

Binding rule (game plan "Who builds this"): the executor **migrates**
pre-authored prose, it never writes fiction. Any needed line with no t0v2
source is a **gap**, surfaced here — never improvised. The register law
(bible §0.5) binds even "mechanical" UI copy the player reads in-fiction,
which is exactly why reveal/notice/requirement text must come from the wave
or this HD-item, not ad hoc.

## 1 · Wave layout — re-verified on disk (PH2)

All present (`ls` + section-header scan, 2026-07-08):

- **u0-cold-open … u9-dialogue** — each with `take-a/b/c.md` + `VERDICT.md`.
- **flavor/** — `f1-nodes.md` + `f2-texture.md` + `VERDICT.md`.

The VERDICT picks (read off `flavor/VERDICT.md`'s consistency note; each
unit's own `VERDICT.md` is the authority G4.1/G5 migrate from): **u0-A ·
u3-B · u5-C · u6-C · u8-C+A grafts · u9-B** (u1/u2/u4/u7 picks read per
their own VERDICT at G4.1). The flavor sheets are single-take; their
VERDICT is a scorecard + required-redlines pass (F1 "SHIPPABLE, one
blocking redline"; F2 to be read at G4.1), not a pick.

## 2 · What the wave DOES cover (so the gaps are precise)

- **f1-nodes.md** — all **17** T0 zones: blurb, wrong-thing, action labels,
  discovery fiction. (Coverage verified complete by `flavor/VERDICT.md`.)
- **f2-texture.md** — its `##` sections are exactly **prose log-texture**
  (season ×12, weather ×6, market ×6, gossip ×8), **prose quest-rewards**,
  **prose perks** (×8), **prose field-guide** (bestiary, incl. a T1 mamushi
  line). Verified by header scan.
- **u0** — the weir rescue, Sōan's examination, the intro scenes, the forced
  name-question beat.
- **u1–u7** — the rung beats R1–R7 (one unit per rung).
- **u8-side-beats** — the grove DECIDE, the first Bon, the lease day, the dog
  that stays, the crest question + the mystery windows.
- **u9-dialogue** — node/ambient dialogue for the T0 cast.

**Key boundary (verified):** `f2-texture.md` does NOT carry **surface reveal
lines** — its sections are log-texture / quest-rewards / perks / field-guide,
none of which is the ~45 `surfaces.ts` unlock strings. And the season
log-texture lines (`season-winter-1/2` …) are ambient LOG decoration, NOT the
season-exit **ceremony VN scenes** the calendar (G1) enqueues — those scene
bodies are unwritten.

## 3 · The gaps — every fiction-voiced string with no t0v2 source

Each row: what it is · why it's a gap (verified) · shape needed · the
grammar form G3.5 must support (the "needed-grammar-forms" column doubles as
G3.5's grammar-demand list).

1. **Six per-season VN overlay scenes** (the season-exit ceremony, one per
   Winter/New-Year/Spring/Summer/Bon/Autumn). *Gap:* the wave has season
   log-texture, not multi-beat ceremony scenes. *Shape:* scene (3 takes).
   *Grammar:* the **scene-def block** (`trigger: season-exit`, `once` per
   year? — G1/G2 decide latch) → `scenes.md`.
2. **The nengu Autumn-exit scene** (the board; the MC as furniture; felt,
   never numbered). *Gap:* not authored as a scene; u8 covers the lease day,
   not the nengu reckoning scene body. *Shape:* scene (3 takes). *Grammar:*
   scene-def block (`trigger: season-exit` Autumn / `flag nengu-reckoned`).
3. **Per-requirement requirement flavor** — the `flavor:` + `drive:` lines
   for each rung's requirements, R0–R7. *Gap:* the rung BEATS (u1–u7) are the
   promotion scenes, not the per-requirement drive/flavor strings. *Shape:*
   texture (1 law-compliant take). *Grammar:* existing requirement grammar
   (no new form — `requirements.md` keys).
4. **Surface reveal lines** (~45 `surfaces.ts` unlock strings). *Gap:*
   confirmed NOT in `f2-texture.md`. *Shape:* texture (1 take). *Grammar:*
   `flavor.md` keys (FB-5: prose as markdown, not TS constants — the old
   `surfaces.ts` string consts are deleted at G4.6).
5. **The save-retirement notice text** (the clean-break cold-open notice,
   composed + in-fiction, register-law-bound). *Gap:* mechanical, not in the
   wave. *Shape:* texture (1 take). *Grammar:* a `flavor.md` key. *(G1 ships a
   bracketed `[dev]` placeholder until this lands — prod gated at G7.)*
6. **Estate repair-project lines + day-book seasonal-judge grade lines** —
   the mend-weir / reclaim-orchard / granary project fiction + the seasonal
   judge's one grade line per season-exit. *Gap:* some reclamation *reward*
   lines exist in `f2` (`quest-orchard-reclaim-reward`), but the project
   STAGE descriptions + the judge GRADE lines are unwritten. *Shape:* texture
   (1 take) + possibly a graded set. *Grammar:* `flavor.md` keys + the
   judge-line key the exit pipeline reads.
7. **Sickroom / treatment lines + the wage / payment-ladder beat lines** —
   the treatment action fiction, the manual-rest trickle line, and the R5
   wage reveal beat ("counted into his hand"). *Gap:* `f1` has a sickroom
   node blurb only; the treatment/rest/wage strings are unwritten. *Shape:*
   the wage reveal is a beat (3 takes); sickroom/treatment lines are texture
   (1 take). *Grammar:* scene-def or rung-beat grammar for the wage beat;
   `flavor.md` keys for sickroom/treatment.

**Also for the estate re-diverge (game plan Open-Q #11 / G0 item #6):** the
old `takes/estate-build-beats/` bundle is superseded (it diverges void
old-canon estate beats). The NEW estate beats re-diverge via this same
supplemental wave.

## 4 · The ask (→ HD-30)

Run a **supplemental prose mini-wave**, staged into `t0v2/` in the SAME shape
as u0–u9 under the one-version ruling (2026-07-08): **3 takes for scene-class
gaps** (items 1, 2, 7-wage; the estate re-diverge), **1 law-compliant take
for texture-class gaps** (items 3, 4, 5, 6, 7-sickroom), each → a judge
VERDICT → the pick (+ its required redlines) is the canon text; alternates
stay in `t0v2/` as archive, **nothing wired into a DEV switcher**.

The executor keeps building G1–G3.5 while the wave runs (none of those
milestones needs this text — they ship placeholders/stubs). The wave's picks
migrate into the canon `.md`s at **G4.1** (scenes/flavor) and **G5** (as they
land). **G7 (ship) is gated on this HD-item being CLOSED** — no bracketed
`[dev]` placeholder or missing reveal line can reach players (PH1/PH5).

## 5 · G3.5 grammar-demand list (distilled from §3)

The compiler forms the picked + supplemental takes will declare (G3.5 owns
building these; it finalizes the list by reading the actual picked takes):

- **speakerless narration-only beat** — R2's silent rung (ADR-165).
- **scene-def block** — `trigger:` ∈ `rung | season-exit | flag | verb |
  scripted`, plus `once:` (items 1, 2, 7-wage; the Count).
- **`native:` sidecars** — only where a pick marks one (hand-written
  `*.native.ts`; real logic never enters the grammar).
- the seventh canon target file **`scenes.md`** → `scenes.gen.ts` (G3.5 lands
  it as a stub; G4.1 fills it).
