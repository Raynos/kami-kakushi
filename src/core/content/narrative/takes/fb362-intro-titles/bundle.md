<!-- FB-362 · the intro scene-title diverge (ADR-139). The three cold-open acts
  now stamp per-scene log contexts (`title:` in intro.md), so each groups as its
  own 幕 card. The labels are new player-read fiction — three blind takes; the
  agent self-picked TAKE B (canon, in intro.md) for canon-truth: every head names
  the act's literal on-screen event, no invented geography (take A's "book room"
  names a place the game doesn't have — P10), no clock wobble (take C's "three
  days fevered" heads a scene decided on day four). A & C are the not-picked
  alternates, compared LIVE in DEV → Story: the titles are CORE-emitted contexts
  (`__setIntroTitleOverride`), so a selected take voices FUTURE intro emissions —
  start a fresh run with the take set to see the heads; logged history keeps its
  baked heads (TST2). State-compatible: labels only, nothing mechanical. -->

# bundle fb362-intro-titles · The cold open's act titles (the 幕-heads)
hr: HR-28
rung: R0
review: project/human-in-the-loop/review.md
rationale: Take B names each act by its event — what the water takes / no name to
  give / entered in the book — every head canon-true and on-screen in its own act,
  distinct at a glance (TST4), and the genemon head points straight at the open
  day-book entry the R7 name-writing pays off (TST3). Take A invents a "book room"
  the game has no place for; take C's clock labels blur at a glance and misdate
  the soan act.
canon: B · event-named acts (taken / unnamed / entered)

## take a · the ground it happens on
brief: place-anchored — each head names WHERE the act happens; the world's
  geography carries the story (river → sickroom → book room).
scorecard: 19✔ 1✘ 1— (✘ P10 [blind spot] — "the book room" is not a place the game has)
file: take-a.md

## take c · the counted week
brief: time-anchored — the first days as a counted sequence; time as the thing
  the house counts and writes (before the first day → three days fevered → the
  fourth day).
scorecard: 19✔ 1~ 1— (~ TST4 [blind spot] — two clock-shaped heads blur; the soan head misdates its act)
file: take-c.md
