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
   the empty space is load-bearing. **"Cut" means SAY LESS. It never
   means make the reader assemble the sentence** *(amended 2026-07-12,
   HD-38 / ADR-185 — read with §0.5.5, which is the floor this rule
   may not cut through).* The VISUAL language is owned by
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

5. **Parseable on first read — the clarity floor.** *(Extended
   2026-07-12, HD-38 / ADR-185, from mystery lines to ALL fiction text.)*
   **Every** line of fiction-voiced text parses as scene logic on FIRST
   read: the player always knows WHAT happened, even when the WHY is
   hidden. Withholding is done with clear surfaces — curiosity is the
   tool, never confusion.

   What this forbids is **inference load**, not grammar. No device is
   banned and none is rationed by count: a verbless fragment can be
   perfectly clear (*"Water first, always."*) and a well-formed sentence
   can be a wall (*"You are learning the house's true size by what it
   will let itself be seen without."*). The question is never *which
   device* — it is *how much must the reader reconstruct*.

   **The test is the blind paraphrase pass** (§Verification of the
   re-voice plan): a fresh reader takes the text cold, with no bible and
   no brief, and states each paragraph's WHAT in one sentence. A
   WHAT-failure, or a line they had to read twice, is a **redline back
   to the author** — not a taste argument. This floor is a scorecard /
   skill rung, deliberately **not** a `verify` gate: no lint can judge
   parseability without crying wolf (AC-11).

   Audience it is calibrated to: §0.9.6.

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

8. **Person: "you" is what you live; "he" is what the house says.**
   *(Locked 2026-07-12, HD-38 / ADR-185.)* Narration and the MC's
   interior lines are **second person** — what you see, do, weigh, and
   decide not to say. **Third person is reserved for the OVERHEARD
   register**: the house talking *about* you where you are not addressed
   — the rung reward lines (*"So he can work," Genemon says*) — right up
   until R7 writes your name. The pronoun IS the arc, so it is never
   mixed inside a scene: prose that narrates *"The river gives you up at
   the weir"* and then, two beats later, *"He turns it for as long as the
   water allows"* is a defect, not a flourish.

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
6. **The reader is 14–21, and the book is a light novel.** *(Locked by
   the human 2026-07-12, HD-38 / ADR-185 — the first audience statement
   this project has ever had.)* The target reader is **14–21**, and the
   promised experience is *"a nice and easy to read story narrative to
   follow that makes sense and is engaging, like a captivating light
   novel."* Every piece of fiction-voiced text is written for that
   reader, and every story diverge scores against them. This constrains
   **register**, never **content**: the period texture, the restraint,
   the grief, the partial justice, and the difficulty of the *world* all
   stand — what may not stand is a line the reader has to assemble
   (§0.5.5). Not licensed by this, and never will be: modern slang, a
   softened tone, or an explained mystery.
