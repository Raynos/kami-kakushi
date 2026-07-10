<!-- HD-37 unit B · take a — "The intake entry" (the MC being read: the day-book
  open all scene, every react a condition-column line). Judge edits applied:
  the weather personification flattened; "third day" → "fourth" (canon: Sōan's
  "Day four, by mine"). State-compatible with canon scene `genemon`. -->

## scene genemon
speaker: genemon
voice: steward

Genemon: "On your feet the fourth day — I have it written. I am {elder},
steward to the {house}; what this house still holds, I keep counted. Your
entry stands open: one man, name unknown, condition poor. We finish it now."

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
