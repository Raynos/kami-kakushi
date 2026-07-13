<!-- HD-44 / ADR-190 · the rare stat-nudge, restored (ADR-139 diverge).

  The lever: `RungOption.statBonus` — a one-time +1 attribute with an
  authored "delight line". It is the ONE asymmetric reward in a choice
  system that is otherwise strictly net-zero.

  It was lost in `ea5710e3` (the G4 narrative cutover), which rewrote
  R3's beat from "How do you take up the blade?" (r3-aggressive /
  r3-disciplined / r3-duty-not-glory) into "What do you do about the
  wolf?" (r3-track / r3-hold / r3-mend). The option it hung on ceased to
  exist and the bonus did not come across — a mechanic dropped silently
  by a content rewrite. The GRAMMAR was never missing (`bonus:` parses,
  validates and emits today); only the data was.

  The heir is `r3-hold` — the beat's watch-standing choice, and the lost
  line was about standing a watch. `+1 agi` is the ORIGINAL's own value,
  recovered from git, not an agent's taste. The WORDS are new: the
  retired line named a dawn drill this beat does not contain.

  The three takes diverge on WHAT CAUSES THE GAIN: your own body (A),
  Kihei (B), or the wolf's own hours (C). -->

# bundle adr190-nudge · The R3 delight line (the one pick that pays)
hr: HR-42
rung: R3
review: project/human-in-the-loop/review.md
rationale: Take B is the only one that is TRUE at the moment it fires.
  The note appears the instant you pick r3-hold — and A ("by the fourth
  night") and C ("for six nights") both narrate nights that have not
  happened yet, then sit in the log as history. B happens inside the day
  Kihei just named ("mend the bar before dark") and closes the chain he
  opens: he tells you to take the long spear, then carries it out and
  sets your stance himself. It also earns the delight the right way — an
  asymmetric reward should read as being NOTICED, and Kihei is the man
  in this house who does not hand out approval. TST3 holds: a corrected
  grip and a flattened heel are WHY the feet are quicker, and it reads
  cold, re-read in a log months later.
canon: B · Kihei's hand (the approval is an act, not a compliment)

## take a · the body learns, alone
file: take-a.md
brief: No one gives it to you and no one is there. Standing the sill IS
  the training — the feet, the balance, the waking. Kihei never appears;
  the wolf is no teacher; the only evidence is a changed physical fact
  about the man who stood there, unwitnessed.

## take c · the wolf is the teacher
file: take-c.md
brief: The thing you guard against is the thing that trains you. What
  sharpens you is the WAITING — the dark, the listening, the one sound
  that is neither the straw nor the wind. The animal teaches by NOT
  arriving; six nights of nothing happening is what you paid.
