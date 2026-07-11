# T0 narrative audit — readability & register vs the 14–21 target

**Date:** 2026-07-11 · **Auditor:** Fable (session 175) · **Status:** findings +
recommendations; no fiction edited. Direction forks are the human's.

**The steer being audited against (human, 2026-07-11):** *"a nice and easy to
read story narrative to follow that makes sense and is engaging, like a
captivating light novel, for the target audience of age 14–21."* The human
finds much of the built prose dense and hard to follow — Genemon at the R0
rung-up named specifically — likes the story ideas, and suspects the
story-bible voice specs are working against the goal. Per ADR-022 this steer
is canon; where the bible disagrees, the bible is what's wrong.

**Scope & method.** Read in full: the compiled player-facing script
[`docs/content/t0-story.md`](../../../docs/content/t0-story.md) (cold open,
three intros, rung beats R1–R7, generalized scenes, works pages, hidden-rung
flavor), the U9 ambient dialogue registry
(`src/core/content/narrative/dialogue.md`), a broad sample of
`flavor.md` (node blurbs, discovery hints, estate beats), against the
story-bible prose law (`01-laws.md` §0.5), the cast sheet (`04-cast.md`),
and the kernel (`00-kernel.md`). Judged as prose, line by line, with the
target reader in mind.

---

## Headline verdict

The prose is genuinely well written — but it is written for a different
reader. Its register is literary-adult restraint (closer to translated
Inoue or McCarthy than to any light novel): meaning is carried by ellipsis,
inversion, litotes, and withheld referents, and the reader is expected to
do inference work on nearly every line. A strong 25-year-old reader is
rewarded; a 15-year-old is locked out — not by sentence length (the
sentences are short) but by how much each line refuses to say.

**The difficulty is mandated, not accidental.** Prose law §0.5.1 ("prose
says less than it knows… when in doubt, cut"), Genemon's "item, count,
condition" spec, and the MC's "plainest voice, a question visibly costs
him" all *produce* this register when executed at full density. The human's
suspicion is confirmed: the voice specs, as written and as applied, work
against the new goal.

**The story does not need a rewrite.** The kernel, the scene shapes, the
character motives, the naming arc, and most of the ambient dialogue are
strong and largely readable. The fix is register-tuning at the sentence
level plus a small number of structural moves — not new story.

---

## Findings

### F1 · The house style is executed at maximum density everywhere

§0.5.1 makes restraint the default; in practice the narrator, Genemon,
Kihei, Sōan, and even scene stage-directions all compress the same way, so
there is no plain baseline for the sharp lines to stand out against.
Typical inference-loaded lines a teen re-reads:

- *"Two hands lost was a morning's talk; one stray kept is not even that.
  The bowls go on."* (R1 — requires unpacking two nominalizations and a
  comparison between them.)
- *"Passing, and made a witness like the rest of the room."* (R1 — verbless,
  subject withheld.)
- *"You are learning the house's true size by what it will let itself be
  seen without."* (nengu frame — a triple-nested idea.)
- The sb-lease bow: *"Not deeply — the exact depth a Kurosawa steward has
  never before had to measure for a weir-keeper, measured now, got right
  the first time because he will not let it be seen twice."* (Four nested
  qualifications on one bow.)

Each is good prose alone. Fifty in a row is a wall. Restraint as a *value*
can survive; restraint as the *per-line default* cannot, at this audience.

### F2 · Genemon is both the tutorial channel and the most oblique voice

Terms, wages, the works system, rung promotions, the naming — nearly all
mechanical exposition arrives through the one voice specced to drop verbs
and subjects. The R1 contract — the closest thing T0 has to a tutorial —
reads: *"Terms. Work, sun to sun, at what the yard wants doing — hired by
the day, counted in the book. … No coin: the house's coin is spoken for
before it reaches the yard. Objections are heard now or kept."* Six
verbless fragments and a zeugma, at the exact moment the player needs to
know what the deal is. Likewise *"Six hands' work, five men fed. The sixth
eats. That is the whole of it."* is a riddle for "I need six workers, I
have five, so you eat."

Note: **readable Genemon already exists** — half his lines are plain and
in-voice (*"The paddies take six hands at the least. Five sleep here now.
You are the sixth."*). The problem is the other half, where the ledger-clip
leaks out of the ledger into his conversation.

### F3 · The works pages are the densest text in the tier — and off-spec

works-intro/u1–u4 run wall-to-wall on an extended ledger-of-the-land
metaphor: *"the land keeps the better book," "the autumn will inspect the
work for us," "the land has spent thirty years unwriting that," "mend one
and the water keeps its other appointments."* Two problems: (a) it is the
hardest sustained reading in T0 — long speeches, every line figurative;
(b) the cast sheet says Genemon *"has never in his life reached for a
metaphor."* The built text has drifted from its own voice law, in the
direction of MORE ornament, not less. (PH2: the build and the doc disagree;
here the doc's plain-Genemon is also what the new steer wants.)

### F4 · The hardest prose is the first prose

The cold open leads with the dream inventory — *"Water, above and below.
What surfaces is counted: one knot, tied twice…"* — the most abstract,
elliptical text in the game, shown when the player has zero context and is
deciding whether to keep reading. The R0 rung-up flavor lines (the human's
specific flag) compound it: the player's first three progress rewards are
third-person clipped remarks — *"So he can work," Genemon says, in the way
another man says good morning* — about a "he," while everything else says
"you." Distanced register at the exact moments the game should be hooking.

### F5 · Unglossed period vocabulary + arithmetic the reader must do

koku, to, shō, masu, mon, kura, omoya, nengu, jizō, bunds, kaidō — most
appear unglossed. sb-lease expects the reader to know 1 koku = 10 to to
feel *"Due today: rice, one koku. In the store, against it: seven to"* as
"a third short" before Genemon says so. Two outright word collisions:
**mon** (coin) vs **mon** (crest, sb-crest) and **the board** (the
household table/meal) vs **the tally board** (count-resolve). One model
already in the corpus does this right: *"we reckon a samurai house's worth
in koku — a year's eating for one man"* (gen-rake). That's the pattern —
gloss once, in voice, then use freely.

### F6 · The MC has no inner voice — the light-novel anchor is missing

Light novels ride the protagonist's interiority; this MC is specced to
plainness and the narration mostly refuses to feel on his behalf. The
corpus's best moments are exactly the exceptions: *"You think of the gnawed
seed-bale at the back wall, and the count you made twice by lantern, and
you do not correct him. Not yet."* (R3) · *"That was the easy half. The
question costs more than the walk did."* (R4). That mode — one or two plain
interior lines per scene, naming what he notices/wants/fears — is the
single biggest engagement lever available, and it doesn't violate "talks
plainest": it's narration, not speech.

### F7 · What already works (keep, and use as the calibration set)

- **The U9 ambient dialogue pool reads well** for the target: O-Yae's
  "they say" lines, Shinnosuke's stacked questions, Yohei's patter,
  Rokusuke, O-Ume, Toku's plums, Kihei's *"Bar the gate behind me. Count a
  hundred before you trust the quiet. The quiet lies."* This is proof the
  cast can keep signature voices AND be readable — the gap between the U9
  pool and the rung-beat scenes is the whole audit in miniature.
- **The emotional beats land:** Kihei's *"…Alive. Good."*, the R7 naming,
  O-Hisa's unfinished hopes, sb-dog, the Count's two rows of lamplight.
- **Season turns** are atmospheric and mostly parse first-read.
- **Scene structure** (short scenes, ask-menus, decide-menus) is
  light-novel-friendly already; the form is not the problem.

**Worst-first ranking for any re-voicing pass:** works-intro/u1–u4 → R1
terms scene → cold open dream + intro 1 → R0 rung-up lines → sb-lease &
nengu-frame narration → R6/R7 Genemon speeches → (mostly fine) R3, R4,
count, season turns, U9 dialogue.

---

## Recommendations (proposals — direction is the human's)

1. **Lock the audience in canon (ADR).** 14–21 / "captivating light novel"
   readability is nowhere in the PRD or bible (vision tone says "grounded,
   warm, bittersweet"). Record it, so every future diverge scores against
   it.
2. **Add a clarity floor to prose law §0.5.** Extend §0.5.5's
   vague-but-parseable from mystery lines to ALL fiction text: every line
   parses on first read; the WHAT never needs a second pass. Ration the
   devices per SCENE (say: one inversion, one litotes, one verbless
   fragment), not per character. Restraint survives as "say less," not
   "make the reader assemble it."
3. **Split Genemon into two voices.** The *book voice* — verbatim ledger
   entries read aloud (*"Screen, one, torn. Bar, one, broken."*) — is
   diegetic, charming, and KEEPS the item-count-condition signature. The
   *man voice* — when he explains, instructs, negotiates — gets plain
   complete sentences (his readable half already does this). Rewrite the
   works pages in man voice and cut the land-ledger metaphor back to one
   or two uses per scene (also restores cast-sheet compliance).
4. **Give the MC a quiet inner line.** Amend the cast sheet to allow 1–3
   plain interior narration lines per scene (the R3/R4 mode above). His
   *speech* stays plainest-in-the-game.
5. **Gloss on first use; fix the collisions.** In-voice glosses for units
   and house words (the gen-rake koku model); rename around mon/mon and
   board/board (e.g. "crest" consistently for 紋; "tally" for the count
   board). Optionally later: a tap-gloss UI affordance (separate design
   question, not needed for the prose fix).
6. **Re-lead the opening; re-voice R0's reward lines.** Cold open goes
   concrete-first (weir → wake → then the dream inventory, shortened). The
   three R0 rung-up lines move to second person or a warmer report so the
   first reward loop speaks TO the player.

**Process if adopted:** this is register **intent** — human locks direction
first (this conversation), then: ADR + §0.5/§04-cast amendments → re-voice
in ADR-139 narrative-diverge bundles, worst-first per the F7 ranking, each
bundle's takes scored against the new clarity floor by fresh-eyes readers +
the taste scorecard → HR bundles for review. The U9 pool and season turns
mostly stay as-is. Explicitly NOT proposed: modern slang, tone change, or
loosening kernel/period texture — the fix is syntax and information
delivery, not voice personality.

## Open decisions for the human

- **D1** — Adopt the clarity floor + audience ADR? (Rec 1–2)
- **D2** — Genemon two-voice split? (Rec 3 — answers the R0/tutorial flag)
- **D3** — MC interiority allowance? (Rec 4 — the biggest single lever;
  also the biggest register change from current canon)
- **D4** — Re-voicing scope: whole-T0 sweep vs worst-first bundles (F7
  ranking) with the rest left until playtest complains?
