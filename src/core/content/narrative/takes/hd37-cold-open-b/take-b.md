<!-- HD-37 unit B · take b — "The arithmetic of the house" (the decline
  quantified, never mourned: rooms ten six shut, hands three counting you).
  The judge's three voice-law blockers are FIXED here (each figure
  literalized); shippable after that pass, per the verdict. State-compatible
  with canon scene `genemon`. -->

## scene genemon
speaker: genemon
voice: steward

Genemon: "On your feet, then — day four. I am {elder}; I keep what books the
{house} has left, and I'll give you the house as the books give it: samurai on
the lord's rolls; rooms, ten, six shut; hands, three, counting you. Hear it
once and plainly, since you carry nothing to weigh it against."

### ask gen-house · "What house is this?"

Genemon: "The {house}. On the rolls: a samurai house, sword-ranked, owing
service. In the granary: rice to spring, if nothing else goes wrong — and my
ledgers hold forty years of things going wrong."

### ask gen-work · "What work is there?"

Genemon: "The kura door gave in the rains; half a season's stores lie spilled
in the court. Rake it, dry it, sack it — what's saved goes in one column,
what's rotted in the other. Wage: meals; the book says so already."

### ask gen-you · "And who are you to me?"

Genemon: "The man who wrote you in: one line, name unknown, hands good. Men
come without names for their own reasons; I don't ask, so long as your count
comes right."

### ask gen-danger · "Is it safe here?"
after: gen-work

Genemon: "Safe is not a column I keep. A wolf has come to the grain store
twice — tracks both mornings, grain gone once. Work by day, bar the kura at
dusk, and add nothing to that count."

### decide · Do you take the house's terms?

#### genemon-earnest · Point me at the work
say: "Meals for work is fair. Show me where to start."

Genemon: "One man, charged to the kura court — I'll write it so. Take the
sound rake and go at it square; the count will show it."

stat: +str -agi
perk: {elder}'s Charge — Honest muscle set plainly to the task — sure over
  nimble.
memory: genemon +1 (earnest)

#### genemon-wary · What's in it for me
say: "Meals only? Say plainly what I get out of this."

Genemon: "Meals, a roof, and nothing written down that you didn't say — that
is the whole column, and I'll not pad it. A man who counts his own terms keeps
his feet; keep them."

stat: +agi -str
perk: The Wary Foot — A guard kept up and light on the feet — quick to move
  before committing.
memory: genemon -1 (wary)

#### genemon-steady · Say nothing, take the rake
say: (You say nothing, and pick up the rake.)

Genemon: "Hm. (He opens the day-book and writes: answered with work.) The rice
won't keep — sack what you save, and I'll match it to my book."

stat: +spd -luck
perk: Hands Before Words — A steady quickness that answers with work — trusting
  to no luck.
memory: genemon +1 (steady)
