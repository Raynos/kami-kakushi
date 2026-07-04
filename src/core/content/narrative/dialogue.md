<!-- The dialogue registry (teach-by-reveal lines, D-039/D-063) — the AUTHORING
  SOURCE OF TRUTH (F5). Compiled to src/core/content/dialogue.gen.ts by
  `npm run gen:narrative`; the pure cursor + helpers stay in dialogue.ts.
  `when: <flag>` gates on a story flag; `when: <npc>.regard is|not <v>` on
  per-NPC memory. {key} interpolates NAMES entries. Spec: ./README.md. -->

## dialogue genemon-open · elder

### line gen-greet
voice: steward

On your feet, then. I am {elder}, steward of this house, and I keep the little
it has left to keep. You'll not remember any of it, so hear it plain: the
{house} are samurai still — on the lord's rolls, if nowhere in the granary.

### line gen-stores
voice: steward

Mind the floor before you mind your head. Half a season’s stores lie spilled and
trodden where the kura door gave way in the rains. Rice on the boards is rice
the house has lost — and this house has done losing enough for three lifetimes.

### line gen-rake
when: raked
voice: steward

So you put your hands to it. Rake what grain is still whole back toward the
basket, a fistful at a time. We reckon a samurai house’s worth in koku — a
year’s eating for one man — and every basket you save us is a measure we need
not go begging to the lord to make good.

### line gen-keep
when: raked
voice: steward

Clear it without my standing over you, and you'll have earned your rice and a
dry corner to sleep in. I'll make you no grander promise than that. In this
house, none of us holds one.

### line gen-kept
when: raked
voice: narrator

"...You don't shirk the work," {elder} says, eyeing the cleared boards and the
filling basket. "The house has had its fill of hands that do. Earn your keep,
and a place here is yours."

## dialogue kihei-intro · drillmaster
unrouted: awaiting-routing

### line kihei-1

{drillmaster}, master-at-arms — what's left of the office. I keep a drill yard
of warped poles and grey-haired men, and I wait on someone with the spine to
swing them.

### line kihei-2

When your legs will hold you and your head has stopped ringing, come and find me
there. A house at the frayed edge of the lord's favour needs more than farmhands
— and I would see what the flood left in your arms.

## dialogue soan-intro · physician
unrouted: awaiting-routing

### line soan-greet-grateful
when: soan.regard is grateful
voice: physician

{physician} looks up. "You came back on your own feet — I told you the wits mend
last. Sit. Let's see what's still bitter to steep."

### line soan-greet-curt
when: soan.regard not grateful
voice: physician

{physician} does not look up. "Still no patience for a physician, I see. Sit
anyway. This will sting, and you'll thank me later — or you won't."

### line soan-1
voice: physician

{physician}. I set what's broken and steep what's bitter, and I tell Asagiri
there are no kami abroad in the reeds, however much the village would prefer
there were.

### line soan-2
voice: physician

Your wits will settle as the swelling does — eat when there is rice, rest when
there is none, and don’t let the old women talk a fever into a haunting. That is
the whole of my craft, and the better part of my counsel.
