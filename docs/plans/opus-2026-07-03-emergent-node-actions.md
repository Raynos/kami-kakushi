# Emergent / discovered map-node actions — implementation plan

**Status:** ▶️ IN-PROGRESS — **Phase 0 locked as ADR-146; Phases 1–2 BUILT + verified live
(session 104)**: the discovery engine + the woodlot lacquer discoverable (HR-14 take bundle
open). Remaining: Phase 3 (portable rumors) — deferred until the human reviews Phases 1–2
in-game; the trigger types 1–3 shipped (description hint / repeat-unlock; the visit-stumble
engine exists with no content yet), portable cross-node rumors (type 2's far half + Phase 3)
not started. Graduated from the parked brainstorm
([`project/brainstorms/2026-07-02-emergent-node-actions.md`](../../project/brainstorms/2026-07-02-emergent-node-actions.md)).
**Scope: lands now as a T0-later layer** (human, 2026-07-07 — was "T0-later / T1").
Relates **ADR-114/ADR-115** (who's-here map model) + **ADR-116** (the hint-carrying node
description).

## Who builds this — Fable or Opus?

**Opus**, in two beats (per ADR-124, inherit the parent's model). **Phase 0 is a
DESIGN pass** — a `grill-me` / `diverge` to resolve the open shape questions
(permanence, hint-escalation, discovery-log, rumor-routing) with the human, since
they change what the feature *is*. **Phases 1–3 are the build** — pure-core reveal
+ RNG + node-model work with real balance judgment (discovery odds, hint pacing).
No net-new UI *surface* (the node description + action list already exist), so no
`diverge` mandate on the build — but Phase 0's design pass may diverge on the
discovery *feel*.

## The concept (from the brainstorm)

A map node is **not** a fixed menu of chores — it **reveals itself the longer you
pay attention to it.** First visit shows the obvious actions + the people plainly
present; over repeat visits, attention, and luck, the node **grows**: new actions
surface, new people turn out reachable, a rumor points somewhere new. The mental
model shifts from *"work the checklist"* to *"this place has more in it — keep
looking."* **Anti-checklist** (you can never be sure a node is "done"), **rewards
curiosity**, **cheap surprise** (upside-variance RNG), and **diegetic** (the
description just reads differently — never a "NEW ACTION!" banner).

## System hooks (reuse, don't invent — a guard-rail)

- **The reveal engine** — an emergent node action is the existing surface/area
  reveal machinery **at finer grain**: a node-scoped reveal keyed per
  `(node, actionId)`, whose *trigger* is discovery (event / repeat / rumor) rather
  than a rung or a build.
- **The one seeded RNG** — low-chance unlocks + random events flow through the
  single seeded RNG (determinism); the "after doing X enough times" counter is
  plain state, not wall-clock luck.
- **The node model (ADR-114/ADR-115)** — nodes already carry a "who's here" people list
  + a presentation; discovery makes **both the people set and the action set
  growable**, not fixed authoring.
- **The node description as hint surface (ADR-116)** — the standing description
  foreshadows an undiscovered action; hints tighten as you close in.
- **People + rumors as discovery sources** — a person can surface a new action; a
  **rumor** is a portable pointer overheard at node A that unlocks an action at
  node B (a small content type, if it lands).

## Phased build

### Phase 0 · Design pass (resolve the open questions) — DO FIRST
`grill-me` / `diverge` the shape with the human; land a signed design of the four
open questions (§Open). Output: the locked discovery-trigger rules + the content
model (how hints/rumors/unlocks are authored). No code.

### Phase 1 · The node-scoped reveal primitive
Extend the reveal engine to gate a per-`(node, actionId)` reveal on a **discovery
trigger** (not a rung/build). State: the discovered-set + the per-action attempt
counters (plain, seeded-RNG-driven). A node's action list = its base actions +
its discovered actions. Test: a discovered action persists (a ratchet) and is
reproducible under a fixed seed.

### Phase 2 · The four trigger types (soft → hard, incrementally)
1. **Description hint** — the node description foreshadows (primes; no action yet).
2. **Overheard / rumor** — a present person or a picked-up rumor points at a hidden
   action (here or elsewhere); may unlock or add a hint.
3. **Repeat-action unlock** — each attempt at an existing action rolls a **low
   chance** (seeded) to surface a new one — persistence pays without a hard wall.
4. **Low-chance random event** — a rare seeded event on visit/action unlocks an
   action / person / rumor outright (the "stumble onto something" case).

### Phase 3 · Rumors as a content type (if Phase 0 keeps it)
A portable rumor pointer (overheard at A → unlocks at B) with **robust routing**
(no brittle content web — see §Open). Only build if Phase 0 signs off on it.

## Open questions — RESOLVED (Phase 0 → ADR-146, human, 2026-07-07)
- ~~**Permanence:** per-run vs across the meta?~~ → **Permanent ratchet.** The
  fork was moot — the game has no runs/resets (PRD §1: tiers replace prestige,
  everything persists).
- ~~**Hint escalation:** fixed vs tightening?~~ → **Tightening** as the attempt
  counter climbs.
- ~~**Discovery-log:** log or checklist-risk?~~ → **No log — purely diegetic.**
  Discovered actions just appear in the action list; the description reads
  differently.
- ~~**Rumor routing:** how without a brittle web?~~ → **Tag routing** (agent
  default): a rumor targets a *discovery tag*; any node holding an undiscovered
  tagged action resolves at runtime. Phase 3 stays deferred until the human sees
  Phases 1–2 live.

## Phase 0 outcome — the locked content model (build spec)
- **State:** `discovered: readonly DiscoveryId[]` (write-once latch, mirrors
  `unlocked`) + `discoveryProgress: Record<DiscoveryId, number>` (qualifying
  attempt counters). New `'discovery'` RNG stream on the one seeded RNG.
- **Registry:** `src/core/content/discoveries.ts` — `DiscoveryDef { id; node;
  reveals: ActivityId; trigger; hints: string[]; tag? }`. Triggers:
  `{ watch: ActivityId, chance }` (repeat-action roll, mild pity — effective
  chance grows with the counter) and `{ onVisit: true, chance }` (the stumble).
- **Hidden = derivable, single source:** an activity is hidden iff it is some
  discovery's `reveals` target and its discovery id is not latched — no duplicate
  `hidden:` flag to drift.
- **Hints:** a pure selector picks `hints[i]` by counter progress and the UI
  appends it to the node blurb — same diegetic surface as ADR-116, no banner.
- **Fiction text** (hints, discovery log-lines, hidden-action labels) rides
  ADR-139 narrative diverges before canon.

## Scope & reachability (PH6)
Parked for **T0-later / T1**, NOT R0/R1 (R0/R1 ship the static node model). It's
**buildable on the existing T0 walkable estate map** (the base map + who's-here
people exist), so — unlike the capstone — it does **not** hard-depend on T1; but
confirm at Phase 0 whether it lands as a T0-later layer or waits for T1. Whatever
ships must be **reachable in the running game** (a real node grows a real action a
player can take), never dead content.

## Done-when
Phase 0 signed; then a player, by paying attention to a node (re-reading its
description, repeating actions, or catching a rumor), **discovers a new action that
wasn't in the node's first-visit list** — reproducibly under a fixed seed, with a
test that could have gone RED against a static action list.
