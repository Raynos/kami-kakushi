# Story Bible §0.5 the prose law · §0.9 the constraints sheet

> Part of [the story bible](README.md). Human-locked canon.

## §0.5 · The prose law

Binds anything WRITTEN in the game's fiction voice: dialogue, beats,
flavor lines, names, descriptions, log lines. It binds the words, not
the design.

1. **Restraint is the house style.** Prose says less than it knows;
   scenes end a beat earlier than comfort asks; ceremony is brief
   because the house's dignity doesn't perform. Ornament — a maxim, a
   flourish, a hot accent — is earned by rarity. When in doubt, cut:
   the empty space is load-bearing. The VISUAL language is owned by
   [`ui-design.md`](../living/ui-design.md) — this law defers to it
   entirely. For fiction-voiced text the test is blunt: if a line could
   appear in any game, it does not belong in this one.

2. **One voice, one shape.** Every named character gets a sentence
   SHAPE, not just diction — the cast sheet assigns one per character,
   and prose is judged against it. No verbal gesture (an
   ellipsis-react, a pet construction) belongs to more than one
   character. The epigram is a licensed privilege: named license-holders
   only, at most one maxim per scene, total. The MC talks plainest of
   all.

3. **Rewards are things.** Every perk, reward, and unlock names the
   concrete object or habit of its scene — the whetstone, the knot, the
   post — never a mind/body chiasmus, never poetic filler. NPCs may
   name sums in speech when the scene wants it; the Progress line still
   carries the arithmetic.

**Register rules (LOCKED at the A3 sitting, 2026-07-07):**

4. **The dream cadence.** Rung promotions end in sleep, and the dream
   fires there — at **every second sleep-ending promotion** from T1
   on; the first dream is T0-R7 (canon). Each recurrence escalates,
   never repeats verbatim (the echo craft rule below); the dream is
   the memory's metronome, pacing the return toward T3.

5. **Vague-but-parseable.** A mystery-withholding line must still
   parse as scene logic: the player always knows WHAT happened even
   when the WHY is hidden. Withholding is done with clear surfaces —
   curiosity is the tool, never confusion.

6. **The log and the VN split the work (the human's form).** A mixture
   as-and-when-needed: **flavor and texture live in the log** (prices,
   gossip, weather, the weddings you missed); **story beats AND side
   quests play in the VN UI**. Ceremony stays expensive by craft, not
   by quota — the log keeps the world alive between scenes.

7. **A decide is never a morality dial** *(locked 2026-07-07, the
   salvage cross-check)*. Choice menus never grade one
   dutiful→selfish axis with warmth as the standing reward — that is
   the pattern a player cracks by the second scene and stops feeling.
   Consequences arrive from an unexpected quarter (the smith answers
   instead of the steward); different people read the same choice
   differently; the warmest answer is not always the rewarded one.

**Craft rule — echo is a choice.** Deliberate repetition goes through
the `@`-reuse mechanism and means something; accidental
near-duplication is a defect; a recurring motif (the dream) escalates
per recurrence, never repeats verbatim.

## §0.9 · The constraints sheet

The product's hard box: what all story and mechanics design works
within. (The kernel says what the story IS; the prose law how fiction
is WRITTEN; this says what the game inescapably REMAINS.)

1. **The setting is fixed; its names are not.** 1780 rural Japan — a
   real YEAR with fictional geography and politics; a declining rural
   house the MC washes into; the real-historical-name denylist
   (*Nihonbashi* the lone allow-listed real place). Story work may
   recast proper nouns; it may not relocate or re-period the game.
2. **Genre: single-player browser incremental; NO-PRESTIGE is hard.**
   Long horizons, persistent progression; tiers replace resets; NPCs
   remember; nothing rewinds — kernel #2 and #4 lean on this.
   Progression FEEL within persistence is open design space.
3. **Engineering realities.** Pure core (no DOM in game logic), one
   seeded RNG, the save-migration chain, CSS-only visual language with
   no asset pipeline, DEV-panel review machinery for variants.
4. **Process machinery (by pointer).** Shipped fiction rides ADR-139
   3-take diverges + the FB-10 two-pass taste scorecard; reviews land
   as coherent HR bundles; balance magnitudes ride ADR-132.
5. **Scope.** T0 is designed in full detail and built first; the
   currently-shipped T0 keeps shipping until the reboot's build wave
   replaces it.
