<!-- The interactive intro (ONE VN scene: soan — the fused take-a sickroom
  scene; order enforced by validate.ts INTRO_SCENE_ORDER) — the AUTHORING
  SOURCE OF TRUTH (FB-5). Compiled to
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

  C4.9 (the G4.1 reshape, FINISHED) — the legacy pre-reboot scenes `dream` +
  `genemon` are DELETED: take-a supplies a SINGLE fused sickroom scene (its
  Genemon + dream/porter threads fold into `soan` — the r0-knot option IS the
  porter/dream fork), so the intro is exactly [soan] and the validator's
  INTRO_SCENE_ORDER matches. Git history keeps the legacy fiction. -->

## scene soan
speaker: soan
voice: physician

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
