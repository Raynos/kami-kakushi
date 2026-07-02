# Emergent / discovered map-node actions

**Status:** 🆕 idea — **parked**. Exploratory brainstorm, not a commitment; options
stay open. **Scope:** likely **T0-later / T1**, explicitly **NOT R0/R1** (the human:
_"wouldn't be an R0/R1 thing"_). No code touched.

**Provenance (the human's steer, 2026-07-02).** Rather than a static list of
"actions" bolted to a map node, the player should **DISCOVER** more things to do
there over time: you might stumble onto something, overhear a rumor or a
conversation, or a **low-chance random event** (sometimes only after you've done an
action enough times) unlocks a new action at a node — and the node's own
**description** can carry **hints** toward what's still hidden.

This composes directly with **D-116** (the Map-node description is a standing,
**hint-carrying** surface) and **D-114/D-115** (the "who's here" map model + the
open estate-map presentation).

---

## Part A — the concept

A map node is **not** a fixed menu of chores. It's a place that **reveals itself the
longer you pay attention to it.** When you first reach a node you see a few obvious
things to do (and the people plainly present). Over repeated visits, attention, and
luck, the node **grows**: new actions surface, new people turn out to be reachable,
a rumor points somewhere you hadn't looked.

The player's mental model shifts from _"work the checklist"_ to _"this place has
more in it than I've found — keep looking."_

## Part B — why it's good

- **Rewards attention & exploration.** The player who lingers, re-reads the node
  description, and repeats actions is paid back with new options. Curiosity is a
  mechanic, not just a mood.
- **Makes nodes feel alive.** A place that changes — a new face, an overheard line,
  a door that turns out to open — reads as a living world rather than a static board
  of buttons.
- **Anti-checklist.** The single biggest failure mode of an incremental/idle map is
  the exhaustive to-do list you grind to zero. Hiding actions behind discovery means
  you can **never be sure you're "done" with a node**, which keeps places
  interesting long after their first visit.
- **Cheap surprise.** A low-chance unlock costs almost nothing to author but buys a
  genuine "oh!" moment — the good kind of RNG (upside variance, not punishment).
- **Fits the woodblock/ink tone.** Discovery-by-attention is quiet and diegetic; it
  never needs slop chrome ("NEW ACTION UNLOCKED!") — the node description just reads
  a little differently.

## Part C — how it hooks into existing systems

- **The reveal engine.** The app already gates surfaces/areas/panels behind reveal
  conditions (estate-build gating, surface-reveals). An emergent node action is
  **the same idea at finer grain** — a node-scoped reveal whose trigger is
  discovery (event / repeat / rumor) rather than a rung or a build. Likely reuse the
  reveal machinery, keyed per `(node, actionId)`.
- **The one seeded RNG.** Low-chance unlocks and random events flow through the
  **single seeded RNG** (determinism convention) — runs reproduce, and the "after
  doing X enough times" counter is plain state, not wall-clock luck.
- **The map-node model (D-114 / D-115).** Nodes already carry a **"who's here"**
  people list and a presentation (2D map / ledger / node-list / graph). Emergent
  discovery extends that model: the people set and the action set at a node are
  **both growable**, not fixed authoring.
- **The node DESCRIPTION as hint surface (D-116).** The standing, hint-carrying
  description is the natural place to **foreshadow** an undiscovered action ("a
  side-gate you've never seen anyone use", "the smith keeps glancing at the back
  room"). Hints tighten as you get closer, so discovery feels earned, not random.
- **People as a discovery source.** The "who's here" people can **surface new
  actions** — a conversation, an offer, or simply a person who only appears after
  some condition. Ties the vendor-as-person spectrum (D-114).
- **Rumors as a content type.** A **rumor** is a portable pointer ("they say the
  riverman ferries more than rice after dark") that can be **overheard at one node**
  and **unlock an action at another** — a lightweight content type worth its own
  small system if this lands.

## Part D — rough mechanics sketch (a discovery-trigger ladder)

Not a spec — a shape. Four kinds of trigger, roughly ordered soft→hard:

1. **Description hint.** The node description mentions something (foreshadow). No
   action yet — it primes the player and seeds later triggers.
2. **Overheard / rumor.** A person present, or a rumor picked up elsewhere, points
   at a hidden action (here or at another node). May directly unlock, or add a hint.
3. **Repeat-action random unlock.** Doing an existing action at the node accrues a
   counter; each attempt rolls a **low-chance** unlock (seeded RNG), so persistence
   pays off without being a hard grind wall. ("Haul rice at the wharf enough times
   and you notice the night-ferry.")
4. **Low-chance random event.** On visit / on action, a rare seeded event fires and
   unlocks a new action (or a person, or a rumor) outright — the "stumble onto
   something" case.

Open shape questions to resolve if/when this is picked up:
- Are unlocks **permanent** once found (likely yes — discovery is a ratchet), and do
  they persist per-run vs across the meta?
- How do hints **escalate** (fixed line vs tightening as the counter climbs)?
- Is there a **discovery-log** so the player can see what a node has yielded, or does
  that reintroduce the checklist we're avoiding?
- Rumor **routing** — how does a rumor overheard at node A name/target node B without
  a brittle content web?

## Part E — SCOPE (parked)

Explicitly **parked for T0-later / T1** — the human said this **"wouldn't be an
R0/R1 thing."** R0/R1 ship the static node model; emergence is a later layer built
on top of the reveal engine + the D-116 hint-carrying description once the base map
and "who's here" people (D-114/D-115) are solid. Keep this exploratory; no
mechanics are locked here.

---

_Reading-queue note: this doc should be added to the reading queue in
`project/todo-human.md` (a brainstorm for adoption). Flagged, not edited here._
