# Story Bible §0.5 the prose law · §0.9 the constraints sheet

> Part of [the story bible](README.md).

## §0.5 · The prose law — human-locked 2026-07-07

Binds anything WRITTEN in the game's fiction voice: the prose waves,
dialogue, flavor lines, names, descriptions — and the sample scenes
inside reboot pitches. It deliberately does NOT bind design: pitches
design under §0 + the constraints sheet alone (the pillars-vs-prose-law
reframe, human-locked 2026-07-07 — the decide-menu question, e.g.
whether choices may read as moral thermometers, is explicitly OPEN pitch
territory).

1. **Restraint is the house style.** Prose says less than it knows;
   scenes end a beat earlier than comfort asks; ceremony is brief because
   the house's dignity doesn't perform. Ornament — a maxim, a flourish, a
   hot accent — is earned by rarity. When in doubt, cut: the empty space
   is load-bearing. The VISUAL language is owned by
   [`ui-design.md`](../living/ui-design.md) (currently Andon Steel, ADR-127) — this
   law defers to it entirely. For fiction-voiced text the test is blunt:
   if a line could appear in any game, it does not belong in this one.

2. **One voice, one shape.** Every named character gets a sentence
   SHAPE, not just diction — the cast sheet assigns one per character,
   and prose is judged against it. No verbal gesture (an ellipsis-react,
   a pet construction) belongs to more than one character. The epigram is
   a licensed privilege: named license-holders only, ≤1 maxim per scene,
   total. The MC talks plainest of all.

3. **Rewards are things.** Every perk, reward, and unlock names the
   concrete object or habit of its scene — the whetstone, the knot, the
   post — never a mind/body chiasmus, never poetic filler. NPCs MAY name
   sums in speech when the scene wants it (the hard no-coin-aloud rule
   was deliberately relaxed — human, 2026-07-07); the Progress line still
   carries the arithmetic.

**Craft rule — echo is a choice.** Deliberate repetition goes through the
`@`-reuse mechanism and means something; accidental near-duplication is a
defect; a recurring motif (the dream) escalates per recurrence, never
repeats verbatim.

## §0.9 · The constraints sheet — human-locked 2026-07-07

The product's hard box: what every reboot pitch designs WITHIN. (The
kernel says what the story IS; the prose law how fiction is WRITTEN;
this says what the game inescapably REMAINS.)

1. **The setting is fixed; its names are not.** 1780 rural Japan — the
   ADR-105 anchor (real YEAR, fictional geography & politics), a
   declining rural house the MC washes into, the real-name denylist
   discipline (ADR-018; *Nihonbashi* the lone allow-listed real place).
   The PROPER NOUNS are pitch-reshapeable: the Kurosawa name, Asagiri
   valley, the cast's names may be recast — the game may not be
   relocated or re-perioded.
2. **Genre: single-player browser incremental; NO-PRESTIGE is hard.**
   Long horizons, persistent progression; tiers replace resets (PRD §1);
   NPCs remember; nothing rewinds — kernel #2 and #4 lean on this.
   Progression FEEL within persistence is open (the reboot frame
   reopened tier/rung meaning, promotion structure, node design).
3. **Engineering realities.** Pure core (no DOM in game logic), one
   seeded RNG, the save-migration chain, CSS-only design language with
   no asset pipeline (visuals owned by [`ui-design.md`](../living/ui-design.md),
   ADR-127), DEV-panel review machinery for variants.
4. **Process machinery (by pointer).** Shipped fiction rides ADR-139
   3-take diverges + the FB-10 two-pass taste scorecard; reviews land as
   coherent HR bundles; balance magnitudes ride ADR-132.
5. **Scope.** A pitch covers the full arc at act level but T0 in real
   detail — T0 is built first against the winning pitch, while the
   current T0 keeps shipping until the reboot's build wave replaces it.

