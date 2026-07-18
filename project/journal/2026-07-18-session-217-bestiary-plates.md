# 2026-07-18 — session 217 — bestiary plates (the drawn field guide, #4)

**Plan:** `docs/plans/fable-2026-07-18-bestiary-plates.md` (engaged
live; the human answered the three open forks via AskUserQuestion and
went AFK, authorizing the full autonomous build).

## Rulings (human, live)

1. **The hand is not Sōan** — invent a new document fiction that fits
   the story bible; still PROPOSED (non-canon) in the spec, the HR
   rules finally.
2. **Field-note prose is IN scope** — fiction-voiced plate prose ships
   in this build, 3+ blind takes per line (ADR-139).
3. **Blind readers / subagents inherit Fable** (D-124 confirmed).

## Log

- Rulings recorded in the plan (Status → IN PROGRESS); the plan left
  the reading queue (engaged live, same move as the stamp-book plan).
- Taste Pass 1 walk: below, before any drawing.

## Taste Pass 1 — the full walk (before drawing)

Values first: TST1 one home (plates render INSIDE the bestiary panel
family, fed by the ONE `bestiaryEntries` derivation; brush.ts is the
one ink toolkit — no second brush idiom) · TST2 solid ground (seeded
determinism — the same state always paints the identical plate; no
re-render flicker) · TST3 the fiction causes the mechanics (the
register only re-inks what the household can attest — scout-by-
fighting IS the fiction) · TST4 never guess state (faced vs unfaced
vs newly-confirmed readable at a glance; threat marks legible, not
decorative).

Per principle (n/a skipped): P1 — plates are the bestiary's look,
not a new capability home; the DEV contact sheet is a review
surface, not a second home. P2 — reuse brush.ts emitters + Andon
tokens; no local palette, no forked RNG. P3 — field-note prose is
authored in narrative .md with the register as speaker; renderer
only presents. P4/P5 — plate frames fixed-size; panel swaps in
place; contact sheet static. P6 — complete at every width incl.
390px; the unfaced plate is a DELIBERATE hatched blank, never a
ghost box. P9 — an unfaced plate leaks no silhouette (no spoil);
the reveal follows the first fight. P10 — the album the fiction
names IS the surface the player holds; it names no place/person
outside the built game. P13 — threat reads as in-document marks
(diegetic), with the panel's plain numbers kept where variant d
needs legibility. P15 — "sighted at" names only the foe's own
ground, no destination preview. P17 — faced/unfaced/fresh-confirm
distinct at a glance. P19 — the plate is ceremony (breathes);
surrounding chrome stays dense. P20 — bounded panel, internal
scroll, no raw vw. V-derived (from the values + the map AA bar):
**V-craft** — brush-alive tapered strokes under a stroke BUDGET per
silhouette; never uniform CAD lines, never emoji-slop; **V-seed** —
`rng(seed)` only, golden-pinned once kept.

## Build log (steps 1–3)

- Spec written (`src/ui/bestiary-plates/README.md`): the invented
  fiction is the **Kurosawa beast register 獣譜** — an old-house album
  by a retainer whose seal wore past reading (a nameless hand's book
  passing to a nameless man); ruined plates re-ink only as the house
  can ATTEST each beast (scout-by-fighting caused by the fiction,
  TST3). H5: the register keeps no men — the bandit stays a blank.
- `plates.ts` + `threatGrade` (AC-6: ordinal over
  `mobCombatStats` danger mass) + `ac6.test.ts` + golden pin (30
  hashes: 10 foes × faced/unfaced/blind) + `contact-sheet.ts` with
  the blind-crop toggle; protos-pane launcher wired.
- **Craft rounds 0–1 (self, before any blind reader):** round 0 —
  outline-only strokes read as stick figures; round 1 — fat
  brushStrokes for mass render as angular slabs (resample step w×1.8
  leaves 2–3 points). The keeper technique: hand-cut FILLED
  silhouette polygons (`wash`) + substrate-colored carves (mask,
  ribs, stripes) + thin detail strokes. Round 2 tunes: tanuki ears/
  mask/teardrop tail, rat scale. Lessons recorded in the plates.ts
  header so the next hand doesn't rediscover them.
- Leak fixes the golden test caught: the hover `<title>` named the
  beast on blind AND ruined plates (B2/B5/P9) — both neutralized,
  pinned.
- **Blind pass round 1: FAIL** (report:
  `project/audit/reports/2026-07-18-bestiary-plates-blind-round1.md`).
  6/9 beasts + the blank passed; river rats read as stones (1/3),
  big-male as a scarecrow (0/3), feral dog as a wounded boar (0/3);
  B1/B9 craft flat; plus a CAPTURE defect (translucent enlarge
  backdrop bled the page grid into every judged image). Round-2 craft
  landed per the checklist; round-2 readers (fresh three) launched.

## Field-note prose — ADR-139 diverge (bundle `bestiary-plates`)

**Unit:** 9 one-line field notes by the old hand (one per drawable
beast; the bandit page keeps none — spec H5). ≤120 chars each so the
plate's 3-line wrap holds.

**Taste Pass 1 (bundle brief, binds all takes):** TST3 — the note is
the OLD HAND's, generations dead: it may know the beast's ground and
habit, never the current house, never the MC. Kernel #1 — grounded
observation only, no belief-creatures, the tanuki played plain. P3 —
voice set at source (flavor.md keys, speaker = the register). Prose
law §0.5.2 — no maxims (license spent: Munemasa/Kihei), no ledger-clip
(Genemon's), no everything-dated (Toku's). P15-adjacent — the note
never names another zone beyond the beast's own ground.

**Outcome:** three blind takes authored (below); **self-pick C**
("old acquaintances") — the register as a life's record; a nameless
man's book passing to a nameless man is the fiction's heart (TST3).
B runner-up. The notes stay OUT of canon while the plates are parked
(see the blind-pass verdict below); this journal + the HR-5 addendum
are the durable pick record. Compressed Pass-2 reads: A 15✔ — solid,
though "I" mid-set slightly breaks its manual frame; B 16✔ — the
cleanest period document, slightly cold; C 16✔ — strongest TST3, one
[blind spot] flag: the "X and I" pattern recurs across the set (a
template risk a future edit round can vary).

**Dramatic briefs (distinct story decisions):**
- **A · the huntsman's measure** — a working retainer: what the beast
  does, when it comes, what it costs to stop. Field craft, hazard,
  season. Plain complete sentences.
- **B · the scholar's eye** — honzōgaku naturalist: body, proportion,
  habit observed with detached period-formal precision; the beast as
  a specimen.
- **C · old acquaintances** — intimacy through repeated contest: he
  has fought these particular animals for years and half-respects
  them; the note carries the relationship.

**Take A (verbatim):**
- plateRatRiver: They boil up the weir screens by the score; a stick
  and patience clear them, and few of the bites amount to much.
- plateTanuki: It raids the drying racks at the field edge, and one
  honest shout is the whole cost of driving it off.
- plateBadger: It digs heavy and low at the field margins, slow to
  rouse, but once roused it lands every blow it means.
- plateMonkey: It works the bamboo grove faster than a man swings,
  and I have missed it more times than I care to set down.
- plateMonkeyMale: The big male stands half again the others and does
  not move for a stick; the troop goes only when he does.
- plateFeralDog: They come to the orchard bold in a pack and mean the
  bite; break the pack and what remains is only dogs.
- plateRatStore: After dark they run the storehouse wall-lines in
  numbers, and the work is not the killing but the staying awake for
  it.
- plateMarten: It comes over the roof and not the wall, kills more
  than it carries, and is quicker with its teeth than I with a hand.
- plateWolf: It comes to the storehouse silent in a lean winter and
  wastes nothing; I do not say I stopped it, only that I lived.

**Take B (verbatim):**
- plateRatRiver: Small of frame and countless, they boil against the
  reed screens; for all their press, few bites find flesh.
- plateTanuki: Round in the body and low at the shoulder, it works
  the drying racks at a trot and is gone at one shout.
- plateBadger: Heavy in the forequarter and slow to rouse, it digs
  low at the field margin; once stirred it does not check its blow.
- plateMonkey: Light of limb and quick among the bamboo, it gives
  ground upward; of the blows aimed at it, few arrive.
- plateMonkeyMale: The great male stands half again the common
  measure, and does not give way before a raised stick.
- plateFeralDog: It hunts in company through the orchard; the pack
  lends a boldness no single dog possesses, and it means its bite.
- plateRatStore: After dark they run the storehouse wall in single
  file, each along the line the last one took.
- plateMarten: Long in the body and quick of jaw, it comes over the
  roof by night and kills more than it can carry.
- plateWolf: In a lean winter it comes to the storehouse without
  sound; it takes no more than it needs, and is not driven off.

**Take C (verbatim — the pick):**
- plateRatRiver: The weir rats come boiling at the screens as ever;
  they have never learned to bite, and I have never learned to mind.
- plateTanuki: The same round thief works the racks each dusk; he
  knows my step by now and is gone before I have finished shouting.
- plateBadger: The old digger at the margin rouses slowly, and I no
  longer take that for leniency; what he throws, he lands.
- plateMonkey: Ten years of the grove monkeys and I still swing where
  they were; they know my reach better than I know theirs.
- plateMonkeyMale: The big male and I are old opponents; he does not
  fear the stick, and I have stopped pretending he should.
- plateFeralDog: The orchard dogs and I are old company; together
  they mean the bite, but parted they remember they are only dogs.
- plateRatStore: The kura rats and I keep the same hours; each night
  I walk the wall-lines, and each night they are there before me.
- plateMarten: The marten keeps to her old road over the roof; she
  kills more than she carries, as she has done since I knew her.
- plateWolf: The lean wolf and I have shared several winters now; I
  do not say I have beaten him, only that I am still here.

## Blind pass round 2 → the kill switch fires

Fresh three readers + judge (`wf_346b265a-526`): **8/9 named (was
6/9)** — river rats, dog, marten all fixed; the big-male still fails
(1/3 — the mane flaps read as lop ears: "an upright hare"), and B1
facture failed both rounds (flat-vector read). Per the plan's Risks
clause the two-round kill switch fires: **PARKED as DEV reference, no
bestiary-d wired, shipped default untouched.** Reports:
`project/audit/reports/2026-07-18-bestiary-plates-blind-round{1,2}.md`;
the HR-5 addendum carries the verdict + the un-park options.
