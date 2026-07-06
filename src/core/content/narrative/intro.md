<!-- The interactive intro (3 VN scenes: soan / dream / genemon — the fixed
  order the engine cursor + v3→v4 migration assume) — the AUTHORING SOURCE OF
  TRUTH (FB-5). Compiled to src/core/content/intro.gen.ts by `pnpm run
  gen:narrative`; types + helpers stay in intro.ts. Every option is a NET-ZERO
  +1/−1 lean (stat:) and grants a perk (perk:); `say:` overrides the label as
  the MC's spoken line. `@…` lines REUSE cold-open / dialogue text
  (single-source). Spec: ./README.md. -->

## scene soan
speaker: soan
voice: physician

@cold-open.wake

Sōan: @cold-open.grounding

### ask soan-what-happened · "What happened to me?"

Sōan: "You washed up below the weir three days back, a gash on your scalp and no
name to give. The river does that. We fished you out; the rest you'll have to
earn back."

### ask soan-kami · "The village says a kami hid me away."

Sōan: "Kami-kakushi — 'spirited away.' It's the tale they tell for every soul
that wanders off and every child the river takes. I've tended enough of the
'spirited-away' to know it's water and cold and bad luck, not spirits. Don't let
the old women make a haunting of it."

### ask soan-fragment · "There's a road. Grey rain. A name I can't hold."

Sōan: "That's the blow talking, not a ghost. Fragments surface as the swelling
goes down — chase them if you must, but a name you have to dig for is rarely one
worth keeping."

### ask soan-mend · "How do I get my strength back?"

Sōan: "Rest, rice, and work — in that order at first, then all at once. The body
remembers labour before the mind remembers anything. The wits come back last;
don't force them."

### decide · What do you say to him?

#### soan-grateful · Thank him — ask how to mend
say: "Then I'll trust your craft, not the village's ghosts."

Sōan: "Sense, at last. Rest, eat, and let the swelling go down. The wits come
back last — don't force them."

stat: +int -str
perk: {physician}'s Counsel — A mind honed sharper than the body it wears.
memory: soan +1 (grateful)

#### soan-curt · Brush it off — ask for work
say: "Kami or flood, I'm still breathing. Where's the work?"

Sōan: "...Hm. No patience for a physician. Well — the body heals the same
whether you thank me or not."

stat: +str -int
perk: Sickbed Grit — A back that shoulders the work before the wits can weigh
  in.
memory: soan -1 (curt)

#### soan-worried · Grasp at the fragment
say: "There was a road. Grey rain. A name I can't hold. Is that the fever?"

Sōan: "That is the blow talking, not a ghost. It will fade — or it won't. Don't
let the old women make a haunting of it."

stat: +luck -agi
perk: A Waking Fragment — A half-caught omen that bends fortune your way, though
  your step is slower to answer.
memory: soan +0 (worried)

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
