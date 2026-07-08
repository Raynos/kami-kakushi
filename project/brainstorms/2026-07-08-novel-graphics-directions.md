# Novel graphics directions — 15 candidates (post-map-success)

**Status: ✅ TRIAGED (grill session, 2026-07-08) — 7 explore · 5 park
(→ BACKLOG) · 3 pass. Verdicts + the human's redlines live in "Triage
verdicts" below; the explore slate in "Outcome". Nothing is engaged as
build yet — each exploration starts spec-first when the human pulls it.**
Authored 2026-07-08 after the T2 map blind-pass landed. The ask: given the
map-sheets system's success, what ELSE in the game could carry novel,
built-together graphics — without ever sliding into AI-slop imagery?

## Why the map didn't slop (the thesis every candidate inherits)

The map succeeded because it is **not an illustration — it is a drawing an
instrument could have made**:

1. **Drawn by code from data.** Seeded primitives over a master layout; the
   graphic is a deterministic function of game state. No asset, no
   generation-time vibes.
2. **A period document genre supplies the constraint.** A mura-ezu has rules
   (what it draws, what it names, what it omits); obeying a real genre reads
   handmade, defaults read slop (PH5).
3. **Spec-first, golden pin, blind-pass.** Taste is front-loaded into a
   human-read spec; the committed look only changes deliberately; fresh eyes
   grade legibility against a rubric.
4. **The fiction owns the document.** Someone in the story commissioned or
   drew every sheet (TST3) — which decides what it honestly knows.

Every candidate below names its genre, its data source, and which of the
anti-slop machinery it rides. All fit the LOCKED art direction (ADR-127:
text + emoji + CSS + inline SVG only, Andon bimetal, no asset pipeline).
The riskiest slop surface — faces/portraits — is deliberately absent; #1
and #2 are the counter-proposal to portraits.

---

## The 15

### A · Marks & identity (seeded geometric construction)

**1. Kaō brush signatures — the cast's presence marks.**
Real Edo practice: a kaō (花押) is the abstract cursive monogram a person
signs with. Give every named character a seeded, code-drawn kaō — a
2–4-stroke SVG flourish constructed from their name-seed under a stroke
grammar (entry stroke, body knot, terminal). Appears beside the name prefix
in dialogue, on the cast sheet, on any document they sign. This is the
anti-portrait: identity graphics with zero face-slop risk, historically
literal. *Data: cast registry. Machinery: seed + grammar + golden pin per
cast member.*

**2. Kamon crests — houses, factions, institutions.**
Kamon are compass-and-straightedge constructions by tradition — ideal for
code. A small motif vocabulary (plant, tool, water, enclosure) composed
under rotational-symmetry rules; the Kurosawa mon is hand-specified canon,
rivals/temples/the han get seeded ones. Worn by the map (T4+ daimyō
compounds are "crested rectangles" — map-styles §1 already wants this),
letters, faction UI. *Data: faction/house registry. Machinery: constrained
generative geometry + pinned canon for story-load-bearing crests.*

**3. Hanko seal generator — every signer stamps.**
The ceremony's `.hanko-css` seal already exists as the game's signature
moment. Generalize: a procedural tensho-style seal (glyph arrangement in a
circle/square bounding form) for every character and office that signs
anything. Deeds, contracts, and rung certificates then carry REAL
composed signatures + seals. *Data: same registries as #1/#2. Machinery:
seeded construction; the vermillion budget rule (one hot accent) already
governs its use.*

### B · Survey-sheet siblings (data-driven technical drawing + blind-pass)

**4. Bestiary field-guide plates (HR-5's panel, elevated).**
Each creature drawn as a naturalist's survey sketch: a silhouette built
from the map's primitive discipline (brush-alive strokes, L2 ladder),
annotation callouts with measurements, habitat note, "sighted at" map
cross-reference. Fiction: a scholar the house pays sketches what the
night brings. The exact machinery the map proved — spec §, rubric,
blind-pass ("can a cold reader tell the kejōrō plate from the nure-onna
plate?"). *Data: bestiary registry + combat stats (AC-6: the drawn
threat-marks derive from the same stats the fight uses).*

**5. The estate cutaway — an okoshi-ezu carpenter's sheet.**
The bible's estate anatomy (05-world) drawn as a period carpenter's
elevation/fold-up plan: main house, guest house, the looming ruin —
rooms appearing and repairs re-inking as the Estate pillar rises. The
map system's literal sibling (same substrate, new projection: elevation
instead of plan). The scale-shock trick inverts indoors: the ruin's
floor plan dwarfs the lived rooms. *Data: estate build state. Machinery:
master layout + TIER_DELTA-style state + pin + blind-pass.*

**6. The family register — a kafu genealogy sheet.**
Four generations, the two silver payments, the unstruck line (02-house)
as a drawn household register: vertical-ruled columns, names, adoption
and marriage links, ages-at-death — entries un-redacting as story beats
reveal them. The succession knot becomes a VISIBLE unstruck line on a
document. High story leverage: the house's central mystery gets a
graphic home. *Data: story flags. Machinery: document layout engine
(#7's) + spec-first reveal schedule (TST3: the reveal follows the beat).*

### C · Documents as artifacts (a period-document layout engine)

**7. Deeds, letters & contracts rendered as period documents.**
One layout engine for washi documents: vertical text columns, cartouche,
fold creases, seals (#3), kaō (#1), the reviser's shu corrections. Every
deed the Phase-2 economy grants becomes an object you can LOOK at, not a
log line. This engine is shared infrastructure for #6, #8, and the map's
paper furniture already half-exists. *Data: deed/quest state. Machinery:
genre rules (what a real deed contains) + component reuse.*

**8. The shuinchō stamp book — rungs & milestones as collected stamps.**
Progression as a pilgrimage stamp book: each rung-up, tier ceremony, or
named achievement presses a generated stamp (seal + date in the
six-season calendar + one brush flourish) onto a new page. Players
re-read their ascent as a physical-feeling object. *Data: progression
history (already in the log). Machinery: #3's seal generator + document
engine; the ceremony moment already owns the press animation idiom.*

### D · Living instruments (state-driven, always-on)

**9. The six-season calendar wheel.**
The bible's calendar drawn as an instrument: a rotating ring dial —
season glyphs, the current day's tick, moon phase — in the bimetal
language (silver state ring, gold progress thread). Plan B already
mentions a "season wheel" surface; this is its graphic ambition level.
*Data: game clock. Machinery: pure function of time-state; pinned look.*

**10. The ink thread — one stroke that grows for the whole game.**
The bible's ink-thread motif (03-tiers) made literal: a single continuous
SVG brushstroke that lengthens with every story beat, visible somewhere
quiet (the footer? the Character sheet spine?), its path seeded by the
run's actual event history — knots at crises, thin passages at lean
seasons. By endgame it is a unique calligraphic record of THIS run.
*Data: event log. Machinery: deterministic path accretion; needs a spec
for stroke grammar so it reads brush, not scribble.*

**11. Weather & season atmosphere — the aizuri layer.**
Hiroshige rain: seeded parallel rain strokes, snow stipple, mist bands
drawn over the frame edges (never over reading text — TST2), keyed to
season/story state. Restraint IS the spec: a few strokes at the frame,
not a particle system. *Data: clock + weather state. Machinery: seeded
strokes from the map's vocabulary; CSS-owned motion.*

### E · Scene & story surfaces (compositional reuse — the highest ambition)

**12. VN scene cards composed from the primitive vocabulary.**
For VN beats: not illustrated backgrounds but woodblock-print
COMPOSITIONS assembled from parts the repo already draws — a roofline
pictogram, the river band, rain (#11), a lantern glow, a figure-scale
void — plus a caption cartouche. Every scene card is seeded, pinned, and
blind-passed ("what moment is this?"). This is the map system aimed at
drama instead of geography — the biggest win if it works, the most
taste-risky, absolutely spec-first + diverge (ADR-075). *Data: scene
registry. Machinery: everything the map proved, plus per-scene rubrics.*

**13. The emakimono — the story log as a picture scroll.**
A horizontal scroll (emaki) view of the journal/history: the run's major
beats as small vignettes (#12's cards at thumbnail scale) strung on the
ink thread (#10), reading right-to-left. A "your story so far" surface
that makes replay/retention graphic. *Data: event history. Machinery:
composition reuse; ships only after #12 proves the vignette grammar.*

**14. Combat as ink-stroke choreography.**
The experimental one: render each combat exchange as brush gesture —
attacker's stroke crosses defender's guard arc, stroke weight = damage,
a broken stroke = a miss, seeded jitter per exchange. No creature
sprites ever; pure calligraphic action derived from the SAME pure-core
combat math (AC-6). Could be genuinely novel or genuinely illegible —
prototype behind the DEV toggle, blind-pass with "who won this
exchange?" as the rubric. *Data: combat resolution. Machinery: seed +
grammar; diverge mandatory.*

### F · The icon language (grammar over library)

**15. A single-grammar item pictogram set.**
Inventory/item icons drawn in code under ONE grammar — e.g. every item
is ≤5 strokes of one weight on a fixed grid, the way the map's roof
pictograms share a hand. Replaces emoji where emoji currently read
generic (a direction tweak: ADR-127 permits emoji; swapping them out
where they slop is a human call). The grammar, not artistry per icon,
is what keeps 50 items coherent. *Data: item registry. Machinery:
stroke-grammar spec + a contact-sheet blind-pass ("name each item").*

---

## Triage verdicts (grill session, 2026-07-08)

Goal: the human rules explore / park / pass on each of the 15, plus any
redlines, one strategy family at a time. Checkpointed after every round.

| # | idea | verdict | redlines / notes |
|---|---|---|---|
| 1 | Kaō signatures | ❌ PASS | "Not interesting to the game, not a graphics quality improvement — a little signature that shows up but I don't really know where; I just don't think it will add much." |
| 2 | Kamon crests | 🅿️ PARK | "Could be cool, but again I don't know which UI element in the game would have this kamon crest." Trigger: a surface that needs faction/house identity (T4 map, faction UI). |
| 3 | Hanko generator | 🅿️ PARK | "I don't know which UI element in the game design would show this seal — not that many people are signing things." Trigger: a document surface (#7) existing first. |
| 4 | Bestiary plates | ✅ EXPLORE | Home confirmed: the Combat-tab Bestiary panel (HR-5) — the plate is the panel's body. |
| 5 | Estate cutaway | ✅ EXPLORE | Human chose Explore over the park rec: spec now against the bible's estate anatomy; build waits for Plan B's T0 rewrite + the HR-9 Estate pick. Home: the Estate tab's centerpiece. |
| 6 | Family register | ✅ EXPLORE* | "Yes but again no idea where in the UI this kind of element could go." *Explore = FIND THE HOME FIRST — the exploration's first deliverable is a concrete placement proposal (Character-tab House panel was only a guess), before any drawing. |
| 7 | Document engine | 🅿️ PARK | "Some potential, but it's going to be nuanced, and again I don't feel where it goes into the game UI." Trigger: Plan B lands deeds as inspectable objects. |
| 8 | Stamp book | ✅ EXPLORE ❤️ | "Love this idea. Rungs & milestones and tiers are central to your progression system — a progression menu where you see your achievements and stamps and what you've collected so far." Home confirmed: a progression/record surface (Character tab or its own panel). |
| 9 | Season wheel | 🅿️ PARK | Let Plan B ship its season surface plain first; the drawn-instrument ambition waits. |
| 10 | Ink thread | ✅ EXPLORE | Home re-anchored during the grill: the SPINE of the #8 progression menu (not a floating footer stroke) — fold into the #8 exploration. |
| 11 | Weather layer | ❌ PASS | Ambient weather motion at the frame is out. |
| 12 | VN scene cards | ✅ EXPLORE (hard) | "This is going to be really really really hard lol." — explore anyway, per the follow-up: ONE pilot scene only, spec-first, kill fast if it slops. |
| 13 | Emakimono scroll | 🅿️ PARK | "Even fucking harder — combine multiple features into one cohesive whole and somehow not slop it." Trigger: #12's vignette grammar proving out. |
| 14 | Combat strokes | ❌ PASS | Gesture-rendered combat is out. |
| 15 | Item pictograms | ✅ EXPLORE ⚠️ | Explore — but the human's follow-up caveat is the spec: "The item pictograms are at risk of being slop too, I have no idea if they will be better than emojis. Emojis are also slop lol." So the pilot is an honest A/B: a 10-item contact sheet rendered BOTH ways (grammar pictograms vs current emoji), blind-passed ("name each item") AND taste-judged side by side; a legitimate outcome is "both slop, keep emoji for now" — kill without shipping. ADR-127 emoji amendment only if pictograms actually win (human call). |

### The ruling redline (round 1, human)

**Every idea must answer "where in the damn UI would this go" concretely** —
the UI is mostly buttons + a text log; an identity mark with no home adds
nothing. Verdicts from round 2 on are taken against a named tab/surface/
moment, not an abstract capability.

### Outcome — the explore slate (6 explorations; #10 folds into #8)

1. **The progression menu** (#8 stamp book + #10 ink-thread spine) — the
   loved one: a progression/record surface where rungs, milestones, and
   collected stamps live, strung on the run's growing brushstroke.
2. **Bestiary plates** (#4) — home confirmed: the HR-5 Combat-tab panel.
3. **Estate cutaway** (#5) — spec now vs the bible's estate anatomy;
   build waits for Plan B + the HR-9 Estate pick.
4. **Family register** (#6) — home-finding is deliverable #1; no drawing
   before a placement is ruled.
5. **VN scene-card pilot** (#12) — acknowledged "really really really
   hard": ONE pilot scene, spec-first, kill fast if it slops.
6. **Item pictogram A/B** (#15) — pictograms vs emoji contact sheet;
   "both are slop" is a legitimate verdict; kill without shipping is fine.

Parks (#2 kamon · #3 hanko · #7 documents · #9 season wheel · #13 emaki)
are noted in `project/BACKLOG.md` with their triggers. Passes: #1 kaō ·
#11 weather · #14 combat strokes.

### Open flags (pending input)

- **#6's UI home** — explore is conditional on finding a real placement
  (owner: the exploring agent proposes; the human rules). Candidates to
  develop: Character-tab "House" panel · an Estate-tab document drawer ·
  a story-beat-summoned document overlay (the VN surface shows it when
  the story does — TST3).

### Parking lot (tangents)

_(none yet)_

## Cross-cutting notes

- **Dependency clusters:** #1/#2/#3 share the seeded-construction toolkit;
  #6/#7/#8 share the document engine; #12/#13 share the vignette grammar;
  #10/#13 share the thread. Picking one from a cluster part-funds its kin.
- **Cheapest real wins:** #3 (seal generator — the hanko idiom exists),
  #9 (season wheel — Plan B wants the surface anyway), #11 (weather).
- **Highest story leverage:** #6 (the register IS the succession plot),
  #12 (scene cards), #10 (the ink thread).
- **Most experimental:** #14 (combat strokes), #10 (thread legibility).
- **Every candidate is a new/restyled surface** → ADR-075 diverge + the
  two-pass taste scorecard + (where it's a drawn document) the map-style
  spec→HR→build flow apply. Nothing here ships from a single idea.
