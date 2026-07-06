# Story, narrative & world — the LLM-slop audit (Fable, 2026-07-06)

**Asked:** "review/audit, in the docs & src, the story, narrative and world as
written. I'm worried it's LLM slop."

**Read for this audit:** all four narrative sources
(`src/core/content/narrative/` — cold-open, intro, rung-beats R1→R7, dialogue),
the full PRD §5 world arc (T0→T5), and every fiction-voiced string in the
content registries (log-content, map, areas, enemies, quests, ranks, people,
home, market, weapons, skills, crafting, estate, names), against the taste
standard (TST1–4) and the PRD's own locked rules.

---

## Verdict

**The world's architecture is not slop — it is the strongest thing in the
repo. The line-level prose is good by game standards but carries a real,
consistent LLM accent, concentrated in the rung-beat/perk/reward layer. And
there are three genuine canon breaks that matter more than any style issue.**

Split the worry in two:

- **Story/world design (the PRD §5 arc, the mystery, the antagonists, the
  ending):** disciplined, researched, and full of unfashionable choices a
  generator would never make. Keep it. Protect it. (§1)
- **The written surface (what the player actually reads):** identifiably
  machine-accented in five specific, fixable ways — epigram saturation, one
  copy-pasted dramatic gesture, template perk copy, a frictionless social
  world, and near-verbatim self-duplication. (§3, §4)

The accent is *not* uniform: the cold open, Sōan, and the functional blurbs
are tight; the slop density rises through the later rungs (R4–R7), the perks,
and the quest-reward lines — i.e. the ceremonial register, exactly where a
model reaches for "poetic" filler.

---

## §1 · What is genuinely NOT slop — protect these in any redesign

1. **The title is a lie the game debunks with kindness.** *Kamikakushi* as the
   master folk-belief, the binding belief→cause table (§5:664–675), exactly
   ONE ambiguity token ever (the weir-jizō offering), no yokai in any spawn
   table. Folklore treated as grief-work ("grief-work that nonetheless yields
   hard evidence" — Ryōa's register) is a real literary idea, executed with
   restraint slop never has.
2. **The MC is not the chosen one — he is not even Tama.** The spine payoff
   (§5:757–768): Tama was a girl (the legend's gender-drift is the planted
   fair clue) who ran from a violent stepfather; she's been alive and ashamed
   in Yanagi-watari the whole decade; she may not forgive. A generator writes
   "you were the spirited-away child all along." This is the opposite, and
   it's the game's best idea.
3. **The T0/T1 antagonist is compound interest.** A villain-less circumstance,
   personified only by a tired pawnbroker who "is not cruel about it" — in an
   incremental game, making the number-that-goes-up the enemy is genuinely
   witty, genre-aware design.
4. **Partial justice, honored to the end.** Magobei answers, Yagōemon mostly
   escapes; Kuroiwa answers, Iemasa walks; Echizen-ya Sōbei is glimpsed once
   and never reached; the osso petition's lethal risk falls on a gimin martyr.
   The ending is mediated (credit flows up through Mukai and the lord; the MC
   caps at yōnin and never sees the shogun). Slop cannot resist a throne room.
5. **The Edo texture is load-bearing, not wallpaper.** kyō-masu rigging as the
   through-motif, sekisho pass-tiers, rusui-yaku/sankin-kōtai as the actual T5
   mechanism, the banzuke's sealed top ranks as literal chart geometry. These
   are researched details doing plot work — plus the Q39 real-name denylist
   discipline (Munenori/Jūbei/Ranpo echoes renamed).
6. **Promises are cashed (TST3 §10 made real).** "A dry corner and a bowl"
   becomes an owned straw mat and a chipped bowl (`home.ts`); comfort-not-power
   is held ("You wake mended, not merely rested"). The best fiction-mechanics
   fusion in the build.
7. **Real voice differentiation at the diction level.** Sōan's dry debunker,
   Genemon's account-book weariness, Chiyo's ledger metaphors, and above all
   Shigemasa's R7 self-doubt — *"Whether it was wisdom or only habit, I have
   never decided"* and *"I'll not pretend it pleases me less than the safe
   answer would have"* are the two best lines in the repo.
8. **The functional prose is right.** Map/enemy/market blurbs are concrete and
   unshowy ("It means to kill." · "a hone for the blade — a little of all,
   and cheap."), and Genemon's koku gloss is diegetically earned by the
   amnesia ("You'll not remember any of it, so hear it plain").

---

## §2 · Canon breaks — fix these regardless of style (highest severity)

**2a. The wolf is dead and alive.** The scripted fight says the wolf *escapes*:
"it bolts bleeding into the night. You are alive. You should not be."
(`log-content.ts:69`; `enemies.ts:62` "luck alone" agrees). The R3 beat says
"You've **stood over the grain-store wolf's carcass**" and "You **put down**
the thing that had the run of our stores" (`rung-beats.md:111–117`). Two
authoring passes, two outcomes, both shipped. Direct continuity contradiction
on the tier's central beat.

**2b. Kihei flatters innate talent — against the game's own locked thesis.**
The PRD's talent-foil rule is binding: every advantage shown as *bought,
lucked, or trained — never innate* (§5:827), and Kihei's creed is the anchor
stated at the first-fight beat and paid off at the finale: *"Talent is a story
the lucky tell. You are not lucky. So you will work."* (§5:109–110). The built
R3 beat has Kihei say the exact opposite: *"There's a **soldier in you** under
the farmhand — I've watched it a week"* (`rung-beats.md:118–119`), and the
drillmaster log line rebrands luck AS talent: *"You lived. That's the only
talent that matters"* (`log-content.ts:71`). **The creed itself appears
nowhere in the built text.** The finale payoff currently has nothing to pay
off.

**2c. The shame arc was inverted into a headhunt.** PRD T0.2 beats 4–5: the MC
is thrashed, ribs cracked, and *"the shame of limping home to confess drives
him to **beg** Kihei for drills."* Built: Kihei shows up, praises him, and
recruits him. The tier's designed emotional low point — the humbling that
gives the whole mediocre-start contract its teeth — became a promotion. This
is the softening instinct of a model given "write the next beat," and it costs
T0 its only wound.

*(Minor, same family:* R2's "there is no one else to send" (`rung-beats.md:68`)
rings false while the house keeps a master-at-arms; one clause of why Kihei
can't stand the night watch would seal it. And the PRD's Naoyuki trust-beats —
the mislaid ledger, holding the grain store, the grudging vouch, T0.2 beat 6 —
don't exist in the build: Naoyuki is only ever *reported* by Chiyo and
Shigemasa, never staged.)*

---

## §3 · The slop accent — the line-level patterns

**3a. Epigram saturation (the strongest tell).** Nearly every speech lands on
a balanced maxim: "Bodies forget. Given work and rice, they also mend." ·
"a name you have to dig for is rarely one worth keeping" · "Rice fills a
belly; coin is what the world takes in trade for everything a belly is not" ·
"Hands that don't need watching are the rarest thing I keep" · "A wall that
holds is worth ten swords that swing wild" · "Fast gets you a spear in the
back" · "a live watchman beats a dead hero" · "A great name is a heavy thing
to carry with an empty purse" · "a man loyal to nothing is easy to read. I
prefer easy to read" · "Do not disappoint the scales" · "a road cleared is a
road that earns" · "The house before the man." Steward, physician,
drillmaster, lady, lord, pedlar, quest narrator — **everyone** speaks in
polished antithesis, including the concussed farmhand MC ("The body is here;
the past isn't."). One aphorist is a voice; eight is the author's tic, and
the author is a model. Diction differs per character; **sentence shape does
not** — that's where the sameness lives.

**3b. The "…" react is one gesture, copy-pasted.** Of the ten decide scenes,
essentially every one has exactly one option whose reply opens with an
ellipsis-beat of surprised reappraisal: "...Good." (×2) · "...Good answer." ·
"...Hm." · "...Huh." · "...Ambition, in a hand kept a day." · "...I'll pretend
I didn't hear that." · "...The answer I hoped for and rarely get." · "...Yes."
· "...Bold." · "...A man who works before he talks." Eleven instances across
the intro + seven rungs. It's a good gesture — for **one** character.

**3c. The nine perks are one sentence in nine costumes.** "A mind honed
sharper than the body it wears" · "A back that shoulders the work before the
wits can weigh in" · "Hands that remember the work before the head does" ·
"A mind that deepens by dwelling, at the price of a slower body" · "Honest
muscle set plainly to the task — sure over nimble" … every perk is
*[noun-phrase] that [verbs] before/at-the-price-of [its counterpart]* — a
mind/body chiasmus template. This is the purest LLM register in the repo:
poetic-shaped, information-free, interchangeable.

**3d. Near-verbatim self-duplication (not @-reuse — drift).** The grammar has
a single-source `@` mechanism; these bypass it: "that's the whole of what I
can promise" (`intro.md:127` and `:157`) · "The house has had its fill of
hands that…" (`intro.md:146`, `dialogue.md:45`, and the R1 echo
`rung-beats.md:34`) · "Honest, and cold." / "An honest question, and a cold
one." (`rung-beats.md:41` vs `intro.md:157`) · "The wits come back last —
don't force them" twice in the SAME scene (`intro.md:39` and `:48`) · "Don't
let the old women make a haunting of it" likewise (`intro.md:28` and `:69`).
Plus the same simile scaffold twice ("watches you the way a man watches
weather" / "studies you the way she'd study a column of figures") and dawn/
first-light opening three consecutive beats (R1, R2, R3).

**3e. Mechanics ventriloquism in the ceremonial beats.** The `motivates:`
contract (reveal-as-plot) is the right design, but late beats read the patch
notes aloud in period costume: "The gate and the swept forecourt are yours to
work now… And the kura's own repair is yours to tend: spend the house's small
surplus to shore it up" (R1) · "Keep a field-guide of what you face" (R3, =
the Bestiary panel) · "The workshops wake again… a forge, a joiner's bench —
and a second granary rises behind the kura. They fall under your oversight
now" (R6) · "The measure of the House itself takes shape before you now" (R7,
= the House-Influence panel, and it means nothing as fiction). Same family:
all four quest-reward lines have the NPC count exact coin aloud and append an
aphorism tag ("Twenty-four coin — a hunter's due", `quests.ts:62/86/120/150`).

*(Small tells, listed once:* Sōan glossing the game's own title to a fellow
Japanese speaker ("Kami-kakushi — 'spirited away.'", `intro.md:26`) is the
localizer's voice leaking into the fiction; the dream motif repeats
road/grey-rain/slipping-name near-verbatim ~4× where the PRD itself
specifies better sensory variation ("paddy-mud that isn't Asagiri's"); and
given the Q39 denylist rigor, the house being **Kurosawa** is the loudest
remaining real-name echo in the game.)*

---

## §4 · The deep tell — T0's social physics is a fairness machine

This is the structural version of the accent, and the highest-value fix.

Across the entire tier, **every NPC assesses the MC accurately and rewards
him proportionally.** Nobody lies to him, suspects him, uses him, or is even
briefly unfair. A nameless stranger washes up at a paranoid, indebted,
declining samurai house — and inside a season holds the storehouse key. The
distrust is *told* ("We'll see if you mean it") and never once *dramatized* as
an obstacle. The one hostile character in T0 is a wolf. The designed friction
— Naoyuki, "who watches you already — not all of it kindly" — has zero
on-screen lines (§2c). LLM story worlds are conflict-averse in exactly this
way: praise is free, so it flows.

Two mechanical monocultures compound it:

- **Seven promotions, one scene.** Every rung beat = an authority summons you
  at dawn → praises the last rung's work → enumerates the new grants → asks
  how you feel about it. R1 through R7 without a single reversal, refusal,
  interruption, or scene that is *not* a performance review.
- **The decide menus are a moral thermometer.** Nearly every decision is
  dutiful(+1 warmth) / pragmatic(0) / self-interested(−1), and the dutiful
  answer is always rewarded with the warmest line. The player cracks the code
  by R2; choices stop being choices. The one exception proves the fix:
  **r4-generous** (`rung-beats.md:203`) displeases no one, but the *smith*
  answers instead of the steward and hands over a whetstone — an orthogonal
  consequence from an unexpected quarter. That's what all of them should feel
  like.

---

## §5 · What I'd do (feeds the queued "fable redesign of the story beats")

Vehicle: ADR-139 narrative-diverge for anything fiction-voiced (3+ blind
takes); only the pure continuity syncs are mechanical-exempt. In priority
order:

1. **Repair canon (§2) first.** Pick one wolf outcome (the PRD's
   survived-not-won is stronger and feeds #4); restore the shame→begging arc;
   put Kihei's creed on-screen at the first-fight beat and delete the
   "soldier in you" flattery. Small diffs, big integrity return.
2. **One unfairness beat in T0.** Stage the PRD's mislaid-ledger trust beat as
   its inverse: something goes missing and the stranger is the obvious
   suspect — Naoyuki, on-screen at last, coldest in the room; Genemon's trust
   visibly costs him something to extend. One scene fixes the fairness
   machine, the missing rival, and the missing PRD beat together.
3. **Write a voice bible keyed to sentence SHAPE, then enforce an epigram
   budget.** One page: Genemon speaks in tallies and conditions, never
   metaphor; Kihei in imperatives and gear-nouns, owns the "…" react alone;
   Sōan in questions and prescriptions; Chiyo in ledger conditionals;
   Shigemasa alone earns the balanced maxim (his register already justifies
   it). Cap: ≤1 aphorism per scene, total. The MC — a farmhand with a head
   wound — talks plainest of all.
4. **De-template the nine perks.** Each perk names the concrete object of its
   scene (the post, the slats, the knot, the whetstone), not a mind/body
   chiasmus. The JRPG learned-box (taste §13) wants a *thing*, not a poem.
5. **Motivate unlocks from problems, not inventories.** Rewrite R6/R7 (and
   R1's grant-list paragraph) so the beat dramatizes a need the panel answers
   — Kihei sick of burying men who can't tell a mamushi from a rat-snake IS
   the bestiary — and move exact coin sums out of NPC mouths into the
   Progress line, keeping only the human tag in speech.
6. **Dedup §3d** — route deliberate echoes through `@`-reuse; kill the
   accidental ones; vary the three dawn openings.

Not urgent, worth keeping in view: escalate the dream motif's imagery per
recurrence (the PRD already specifies how), and decide with the human whether
"Kurosawa" stays (it's a taste call, not an error).

**Relation to HR-8:** that open review (rung-up cast + R0→R7 beats) covers the
same text this audit judges — read them together; §2 and §4 are, in effect,
this auditor's submission to it.
