<!-- The interactive intro (3 VN scenes: dream / soan / genemon — the fixed
  order the engine cursor assumes, enforced by validate.ts INTRO_SCENE_ORDER) —
  the AUTHORING SOURCE OF TRUTH (FB-5). Compiled to
  src/core/content/intro.gen.ts by `pnpm run gen:narrative`; types + helpers stay
  in intro.ts. Every option is a NET-ZERO +1/−1 lean (stat:) and grants a perk
  (perk:); `say:` overrides the label as the MC's spoken line. `@…` lines REUSE
  cold-open / dialogue text (single-source). Spec: ./README.md.

  storywave G4.1: scene `soan` MIGRATED from t0v2/u0-cold-open/take-a ("the
  ledger") — the weir examination, the FORCED name-question with the mid-scene
  speaker flip (You: → Nameless:, witnessed), the day-book, and the R0 "what do
  you keep" identity fork. Redlines applied: r0-knot perk de-chiasmus'd to "fast,
  one-handed, holds wet." (VERDICT redline 1, law 3); the Well Yoke tightened
  toward the concrete object (VERDICT redline 3, suggested — a judgment edit, see
  HD-30 note); day-book "three days" lives in cold-open.md.

  HD-37 (2026-07-10, re-opens C4.9): the human ruled the three-act shape BACK —
  dream + genemon return as their own scenes with their own picks (three picks
  per run), in the NEW order dream → soan → genemon (memory fragments before
  waking; soan keeps the name beat, so genemon's MC lines read Nameless:). The
  take-a `soan` prose is human-verdicted and stays as authored. The dream act
  is unit A's diverge CANON (2026-07-10, takes/hd37-cold-open-a/); the genemon
  prose below is still the pre-C4.9 SEED (b221d6e~1), re-authored by unit B
  before ship. Plan: docs/plans/fable-2026-07-10-cold-open-rearc.md. -->

<!-- HD-37 unit A CANON (ADR-139 diverge, take a "The inventory of what is left",
  picked 2026-07-10; alternates in takes/hd37-cold-open-a/). The memory act:
  IN the water, pre-rescue — memory surfaces as counted items (never a dream:
  the first dream is T0-R7, §0.5 law 4). No name yet; MC lines render You:. -->

<!-- FB-362 — each scene carries a `title:` (the 幕-head label the log's scene card
  prints as "— <title> —"), so the three acts group as three cards instead of one
  fused "the cold open". Canon = take B of the fb362-intro-titles diverge (ADR-139,
  "taken · unnamed · entered" — each head names the act's event); alternates in
  takes/fb362-intro-titles/, live-swappable in DEV → Story for FUTURE emissions. -->

## scene dream
voice: narrator
title: what the water takes

@cold-open.dream

### decide · One can be kept before the rest goes down. Which?

#### dream-dwell · Hold the knot
say: "The knot. Tied twice. Why twice."

> You turn it for as long as the water allows. The knot goes down with the
> rest; the looking stays. From now on, anything put in your hands gets
> looked at twice before it gets an answer.

stat: +int -spd
perk: The Inward Turn — A mind that deepens by dwelling, at the price of a
  slower body.

#### dream-shake · Kick for the road
say: "The road. It went somewhere. Up is that way."

> The items go under, and the water clears to one direction, brighter than
> the rest. The road goes down with them; the way out stays. From now on,
> any room you enter, the door is the first thing you count.

stat: +spd -int
perk: The Clear Room — Senses sharpened to the way out — quick where thought is
  thin.

#### dream-hands · Shoulder the load
say: "The load was mine. I know the weight."

> Your shoulders answer before your head does. The load goes down with the
> rest; the carrying stays — a strap's width, the length of a carried step.
> From now on, a weight you take up sits where your body already knew to
> put it.

stat: +str -luck
perk: The Porter's Hands — Hands that remember the work before the head does.

## scene soan
speaker: soan
voice: physician
title: no name to give

<!-- HD-30 / G4.7 / FB-198: take-a's MC speech lines are authored with the `You:`
  player form — no static name compiles; the engine resolves the nameplate through
  the speaker-ladder (playerSpeaker(state)), so the You:→Nameless: flip lands at
  the marked point below without touching these lines. -->

@cold-open.weir

@cold-open.wake

> The physician does not ask how you feel. He takes your wrist, then your
> jaw, then turns your hands over and looks at them longer than at
> anything else. He presses a thumb into the callus line across one palm
> and says nothing. There is a ledger open on his knee.

Sōan: "Do you know the year?"

You: "No."

Sōan: "An'ei nine. Now you know it again. Drink this."

> Whatever the hands told him goes into the ledger, two lines, too far off
> to read. The door slides, and he closes the book on his thumb.

> The man in the doorway is grey and dry and carries a book of his own.
> Two books in the room now, and only one of them open.

Genemon: "The weir man. Sōan — can he work?"

Sōan: "Ask him."

Genemon: "Name, age, where from. In that order."

> Three answers, and you do not have one of them. The silence goes on long
> enough that the physician looks up.

You: "What name did I give? When they pulled me out."

Sōan: "None. You gave none. Three days I have had nothing to call you,
and neither have you."

> Nothing comes.

<!-- native: THE FLIP — the speaker label changes here, You: → Nameless:,
  witnessed: it happens on screen with both men in the room. Every MC line
  from this point renders as Nameless:. -->

> Genemon does not look surprised. He looks down and writes, and reads it
> back as he writes, aloud and once.

Genemon: @cold-open.daybook

Genemon: "When he can stand, he rakes. The kitchen wants water before it
wants anything."

> He goes. Sōan opens his ledger again, where his thumb kept the place.

### ask soan-where · "Where is this?"

Sōan: "The {house} house — the estate, or what answers to the word. This
is my sickroom, off the outer court, and you will be out of it by
tomorrow. I need the mat."

### ask soan-kami · "Someone on the bank said a god hid me."

Sōan: "Kamikakushi. The valley says it of every man the river takes and
every child who runs off. Let them say it; it comforts them and costs you
nothing. What took you was water."

### ask soan-how-long · "How long was I in the river?"

Sōan: "That I can't write down. Three days here, fevered. Before that,
ask the river."

### decide · No name, then. What do you keep instead?

#### soan-knot · "My hands know a knot. I'll keep that."
say: "My hands know a knot. I'll keep that."

> You tie it in the cord of your own bedding: a carrier's hitch, fast and
> one-handed, twice. Sōan watches it both times. He does not write it down
> while you are looking.

stat: +agi -int
perk: The Carrier's Hitch — fast, one-handed, holds wet.
memory: soan +1 (noted)

#### soan-work · "The work. Point me at it."
say: "The work. Point me at it."

Sōan: "Can you stand? Then the rake is by the door, and the well is past
the kitchen. Water first — the kitchen never has enough. Come back when
something bleeds."

stat: +str -luck
perk: The Well Yoke — a load the shoulders carry before it is asked.
memory: soan +0 (plain)

#### soan-count · "The days. I'll count from this one."
say: "The days. I'll count from this one."

Sōan: "Day four, by mine. Yours can start where you like. Mark the post —
notches hold."

stat: +int -agi
perk: The Notched Post — a day cut where fever cannot blur it.
memory: soan +0 (methodical)

<!-- HD-37 unit B CANON (ADR-139 diverge, take c "The first entry is yours",
  picked 2026-07-10; alternates in takes/hd37-cold-open-b/). Probation in ink:
  Genemon withholds everything not asked, surprise is answered by writing, and
  the decide is the first line the man dictates into the house record — the
  open entry seeds the R7 name-writing payoff. Post-flip: MC lines read
  Nameless:. The gen-work answer quotes the daybookVerbs line ("Rakes; hauls.
  Wage: meals") DELIBERATELY (§0.5 echo law) — the entry he wrote in the
  sickroom, read back as already standing. -->

## scene genemon
speaker: genemon
voice: steward
title: entered in the book

Genemon: @dialogue.genemon-open/gen-greet

### ask gen-house · "What house is this?"

Genemon: "The {house}. On the lord's rolls: samurai, one house, standing since
before my hand kept the book. In the granary: less than the rolls would
suggest, and I will not write the number for a stranger."

### ask gen-work · "What's the work?"

Genemon: "Rice. Half a season's stores, spilled in the kura court where the
door gave way in the rains. You rake it in before the rain spoils what's left
to count; wage stands as entered — meals."

### ask gen-you · "Who are you to me?"

Genemon: "The steward. I count what the house holds and what it is owed; you
came in under the second column. A man working a thing off gets fair terms
from me, and no questions the book does not ask."

### ask gen-danger · "Is the work safe?"
after: gen-work

Genemon: "A wolf, one, gone bold at the grain store. Grain lost: some. Men
lost: none — work by daylight and I intend that count to hold."

### decide · The brush waits over the condition column. How do you answer the steward?

#### genemon-earnest · Point me at the work
say: "Give me the rake. I'll do whatever's put in front of me."

Genemon: "Condition: sound; willing. I enter you as my charge — mine to set to
the task, mine to answer for."

stat: +str -agi
perk: {elder}'s Charge — Honest muscle set plainly to the task — sure over
  nimble.
memory: genemon +1 (earnest)

#### genemon-wary · First, what's in it for me
say: "Before I rake anything — what do I get, and what do you get?"

Genemon: "Terms asked before work; I have seen worse habits in honest
men. Condition: guarded — a man who counts before he lifts keeps his feet
under him."

stat: +agi -str
perk: The Wary Foot — A guard kept up and light on the feet — quick to move
  before committing.
memory: genemon -1 (wary)

#### genemon-steady · Just get to work
say: (You say nothing, and take up the rake.)

Genemon: "No answer; the rake already moving. Condition: answers with hands —
I enter it so, and luck has no column in this book."

stat: +spd -luck
perk: Hands Before Words — A steady quickness that answers with work — trusting
  to no luck.
memory: genemon +1 (steady)
