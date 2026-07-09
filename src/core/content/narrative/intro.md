<!-- The interactive intro (3 VN scenes: soan / dream / genemon — the fixed
  order the engine cursor + v3→v4 migration assume, enforced by validate.ts
  INTRO_SCENE_ORDER) — the AUTHORING SOURCE OF TRUTH (FB-5). Compiled to
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

  HD-30 GAP — scenes `dream` + `genemon` are LEGACY (pre-reboot fiction), kept
  because validate.ts hard-requires exactly [soan, dream, genemon] and take-a
  supplies a SINGLE fused sickroom scene (its Genemon + dream/porter threads fold
  into `soan` above — the r0-knot option IS the porter/dream fork). The full
  reshape to the new single-scene intro needs the INTRO_SCENE_ORDER validator
  change (a later G4 chunk); fabricating replacement fiction here would violate
  "never invent fiction." Flagged for the human. -->

## scene soan
speaker: soan
voice: physician

<!-- HD-30 / G4.7: take-a's MC speech lines (`You:`) render here as narrator `>`
  quotes — the You:→Nameless: speaker-label flip is the speaker-ladder
  (playerSpeaker(state)), a later G4 chunk; the quoted words are verbatim, only
  the nameplate is deferred. The flip point is marked below. -->

@cold-open.weir

@cold-open.wake

> The physician does not ask how you feel. He takes your wrist, then your
> jaw, then turns your hands over and looks at them longer than at
> anything else. He presses a thumb into the callus line across one palm
> and says nothing. There is a ledger open on his knee.

Sōan: "Do you know the year?"

> "No."

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

> "What name did I give? When they pulled me out."

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

<!-- HD-30 LEGACY (pre-reboot fiction) — see the header note. Kept only to
  satisfy INTRO_SCENE_ORDER; the porter/dream thread now lives in scene soan's
  r0-knot option above. -->

## scene dream
voice: narrator

@cold-open.dream

### decide · The fragment tugs. Do you follow it?

#### dream-dwell · Dwell on it
say: "Hold the road. The rain. Almost a name."

> You chase it inward — and the ache in your skull chases you back. The name
> stays lost, but the habit of looking sets in.

stat: +int -spd
perk: The Inward Turn — A mind that deepens by dwelling, at the price of a
  slower body.

#### dream-shake · Shake it off
say: "Later. The body is here; the past isn't."

> You let it go and the room sharpens — the slats of light, the way out.

stat: +spd -int
perk: The Clear Room — Senses sharpened to the way out — quick where thought is
  thin.

#### dream-hands · Trust the hands
say: "A porter's knot. My hands know this much."

> Your fingers move before you decide to — a labourer's memory, still in the
> muscle.

stat: +str -luck
perk: The Porter's Hands — Hands that remember the work before the head does.

<!-- HD-30 LEGACY (pre-reboot fiction) — Genemon's sickroom entrance + day-book
  are migrated into scene soan above; this standalone board scene is legacy
  pending the intro reshape. -->

## scene genemon
speaker: genemon
voice: steward

Genemon: @dialogue.genemon-open/gen-greet

### ask gen-house · "What house is this?"

Genemon: "The {house}. A great name gone to seed — samurai on the rolls, paupers
in the granary. I've kept it upright since the last master could not, and I'll
keep it upright when you can't either."

### ask gen-work · "What work is there?"

Genemon: "Rice to rake, a paddy to tend, a storehouse standing half-empty.
Honest labour and no shortage of it. Earn your keep and there's a dry corner and
a bowl in it — that's the whole of what I can promise."

### ask gen-you · "And who are you to me?"

Genemon: "Steward. I run the estate; you'll learn it, or you won't eat. Do as I
say on the house's matters and we'll get on well enough."

### ask gen-danger · "Is it safe here?"
after: gen-work

Genemon: "Safe as anywhere the lord's men don't ride. There's a wolf gone bold
at the grain store, and worse up in the hills. But that's tomorrow's trouble.
Today it's rice."

### decide · How do you answer the steward?

#### genemon-earnest · Earnest — point me at the work
say: "I'll earn my keep. Point me at it."

Genemon: "...Good. The house has had its fill of hands that don't. We'll see if
you mean it."

stat: +str -agi
perk: {elder}'s Charge — Honest muscle set plainly to the task — sure over
  nimble.
memory: genemon +1 (earnest)

#### genemon-wary · Wary — what's in it for me
say: "A samurai house with an empty granary. What's in it for me?"

Genemon: "An honest question, and a cold one. Rice and a dry corner — that's the
whole of what I can promise. Take it or walk."

stat: +agi -str
perk: The Wary Foot — A guard kept up and light on the feet — quick to move
  before committing.
memory: genemon -1 (wary)

#### genemon-steady · Silent — just get to work
say: (You say nothing, and reach for the spilled rice.)

Genemon: "...A man who works before he talks. Rare. We'll get on."

stat: +spd -luck
perk: Hands Before Words — A steady quickness that answers with work — trusting
  to no luck.
memory: genemon +1 (steady)
