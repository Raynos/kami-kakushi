<!--
unit: u0-cold-open
take: b
stance: the held breath — the house's grief close under the surface;
  warmth priced and rationed; human detail forward; what people almost say
covers: R0 whole — the weir rescue · Sōan's examination · the FORCED
  name-question beat (speaker flip You: → Nameless:, witnessed) · first
  verbs (rake, haul water) · the day-book line "one man, name unknown"

STAGED, NOT COMPILED — t0v2 is invisible to gen-narrative (the compiler
reads the six canon files + takes/ only). Grammar is FB-5 where the form
exists; native: blocks name what the engine must provide. Registry note:
O-Hisa speaks in this take — she needs NAMES/voices.ts entries before any
compile (she is not an NpcId today; her lines use the ambient-voice form).
-->

## prose cold-open

<!-- native: `weir` is a NEW key — one pre-wake beat before the sickroom.
  Today's engine opens at `wake`; the rescue itself needs this screen. -->

### weir

Water, then hands. The weir screen holds; the river pulls; the hands are
stronger, and rough, and somebody is swearing at the cold in a voice you
will not get to keep. You go where you are hauled.

### wake

You wake dry. That is the first fact, and for a while it is the only
one. Near by, water is being poured from one vessel into another,
unhurried — a house sound. Nobody has noticed you yet.

### grounding

"Back with us, then." The physician finishes his count at your wrist
before he says anything more, as if the number came first. "Lie still.
You've been two nights nowhere."

### dream

A road you know the way you know a weight — by the shoulders. Grey rain.
Behind you somebody calls a name, once, and you wake before you can
turn.

### bodyReveal

What the river left: breath, two hands, an ache stitched across the
ribs. You count it twice. It counts the same.

### riceReveal

The meal comes to the kitchen threshold and not past it. Hot rice, not
quite enough of it, and a pickled plum that means somebody argued for
you. You eat where the step meets the yard.

<!-- Under the new ladder coin does not touch him until the first errand
  (R6); this key is written to hold wherever coin first lands. -->

### coinReveal

Copper in your palm, still warm from the counting. It is not pay; it is
trust with a number on it.

<!-- native: `rakeReveal` / `waterReveal` are NEW keys — the first-verb
  reveals (rake, haul water), fired when each verb unlocks off the
  physician's prescription at the scene's end. -->

### rakeReveal

The rake is put into your hands like a dose — light work, the physician
said, as far as the fence and no farther. The forecourt gravel has not
been drawn straight in years. You can see where it used to be.

### waterReveal

Two buckets and a yoke, the well to the kitchen door. The yoke settles
across your shoulders into a groove that is already there. You stand a
moment with the weight balanced, and could not say why.

<!-- native: `dayBook` is a NEW key — shown at the first day's end; the
  day-book is Genemon's, read through the forecourt window. -->

### dayBook

That evening, through the open window off the forecourt, a brush
moving. The steward's day-book takes the day the way it takes every
day: *One man, name unknown. Fed twice. Mends.* You are an entry now.
It is more than you were this morning.

### restReveal

There is a corner of the woodshed with a mat in it, and a bowl with a
chipped lip, and nobody has said the word yours. The things are simply
there, and stay.

### restAct

You sit with your back to the stacked wood. Out in the yard someone
calls a name — not yours, no one's you know — and is answered. You
close your eyes and practice breathing.

## scene soan

speaker: soan
voice: physician

<!-- Under the new ladder this scene motivates the sickroom node + the
  first verbs (rake, haul water); ids at the rewrite. -->

> The lean-to off the outer court: one shelf of jars, a smell of vinegar
> and river mud. A ledger lies closed at his knee. It was open before
> you stirred.

Sōan: "Sit up slowly. If something grinds, stop being brave about it."

> He works down your arms without asking, the way a man checks a tool he
> means to lend out.

### ask u0-what-happened · "What happened to me?"

Sōan: "The weir screen caught you; two of the hands hauled you over it.
You fought them, then you stopped fighting. That was two nights ago.
The fighting I liked better."

Sōan: "Upstream of here, the river had you. Past that, ask the river."

### ask u0-kami · "Someone said a kami hid me away."

Sōan: "The village says that whenever the river keeps someone. They
have their reasons; most of them are graves. Let them say it — it costs
you nothing, and it is not you they are comforting."

### ask u0-hands · "My hands. Something wrong with them?"

> He has your palms turned up before you finish asking, and keeps them a
> beat past the answer.

Sōan: "Wrong? No. Worked. Worked at something particular."

> Whatever the something is, he does not say it.

Sōan: "Salve at morning and night. They'll keep."

### ask u0-house · "Whose roof is this?"

Sōan: "The Kurosawa's — what the name still covers. When you can stand
a full day you'll meet the steward. He will have the meals counted
already. Don't take that unkindly; it is the only attention the house
can spare."

<!-- native: FORCED beat — fires at the ask done-gate, before the
  decide; not skippable. On Sōan's answer the engine flips the player
  speaker label You: → Nameless: for every later player line, on
  screen, witnessed in-scene. Nobody remarks on the label (kernel #6) —
  but both of them heard the question asked. -->

> The questions are done, except the one that has sat in your mouth
> since waking, and costs more than all of them together.

You: "One more. My name. Did I say one?"

> In the doorway, O-Hisa has stopped with the broth halfway in — not
> coming forward, not leaving.

Sōan: "You said water. Then nothing, for two nights. Whatever you were
called, the river kept it."

> He says it the way he would set a bone — once, straight, done.

Sōan: "Drink what she's brought you."

O-Hisa (kitchen): "If there's folk somewhere waiting on him—"

> She does not finish it. The bowl goes down beside you, set soft.

<!-- The label flips HERE. The next player line renders as Nameless: —
  the flip is the beat; the scene plays on without pausing for it. -->

### decide · What do you say?

#### u0-nothing · "Say nothing. Drink."

> You drink. It is hot, and someone has salted it past what a stray
> deserves.

O-Hisa (kitchen): "There's more. There isn't, much — but there's more."

memory: soan +1 (steady)
flags: u0-said-nothing

#### u0-comeback · "Will it come back?"

Sōan: "Some men wake with it a year on. Some make do with a new one,
and the old turns up too late to matter. I won't guess which you are.
— Eat while it's hot."

memory: soan +1 (honest)
flags: u0-asked-comeback

#### u0-owe · "What do I owe the house?"

O-Hisa (kitchen): "The bowl back. Washed."

> Sōan looks at her, then at you, and lets the answer stand.

Sōan: "You heard the kitchen. Start there."

flags: u0-asked-owe
<!-- O-Hisa carries no memory track yet (not an NpcId); the warm read of
  square dealing is hers to keep for later rungs — flag only. -->

> He is already writing before you have the bowl to your mouth. What he
> writes, he writes with the ledger's spine toward you.

Sōan: "Tomorrow you stand. The day after, light work — a rake, the
water yoke, nothing above the shoulder. I'll tell the steward you can
earn the meals now."
