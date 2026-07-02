# Fun Factor — the #1 design priority for *Kamikakushi*

> **Status: LIVING — the fun targets the build is measured against; `pacing()` is instrumented
> (report-only), the auto-player bot + the gating fun-suite are still pending (M6).**
>
> The design doc on **the game's fun**: *what* fun factor is for an incremental RPG, *why* it is the
> make-or-break priority, *how* to measure it, *how* to improve it, and *how* to keep it high across the
> **~28.5 h, T0–T3** climb (v1 of a six-tier saga — ~28.5 h is the §4.8 Phase-1 floor sum, re-derived across the 4 v1 tiers; total realized
> play is larger, a separate human budget decision pending). This doc sets the **targets**;
> [`qa-playtesting.md`](qa-playtesting.md) §3 is the harness that **measures** them; the
> UI design bible (`ui-design.md`) handles the **look**. When this doc and a balance/UI
> doc disagree on a number, this doc owns the *intent* ("it should feel like X"); the other owns the
> *realisation* (the dial that gets it there).
>
> Grounded throughout in the PRD: §1.2 (pillars), §1.6 (the four pillars / six tiers), §1.12 (reveal
> pacing), §1.13 (guardrails), §3 (the unlock ladders), §4.2 (accrual), §4.6.6 (soft-setback), §4.8
> (the locked pacing budget).

---

## 1. What "fun factor" means here — and why it is #1

**Definition.** Fun, for this game, is the **felt reward of voluntary effort**: the player keeps
choosing to do the next thing because each thing *feels good to do, pays off legibly, and opens onto
something they now want more.* It is not the *presence* of correct systems — it is the **moment-to-moment
and hour-to-hour sensation those systems produce.** Concretely, our fun is the compound of seven
specific pleasures (§2): the juicy deed→reward hit, the "one more rung" pull, watching a pillar number
climb, the *reveal* delight when the UI itself grows, the seasonal exam's anticipation-and-payoff, the
tension-then-relief of a hard fight, and the warm narrative beats. Fun = those firing **reliably,
on cadence, with no dead air between them, for 28.5 hours.**

**Why it is the make-or-break priority.** An incremental RPG is, mechanically, "press buttons to make
numbers grow for tens of hours." Nothing *forces* a player to continue — there is no story they paid
for, no multiplayer obligation, no boss blocking a credits roll they want. **The only thing keeping a
finger on the button is that pressing it feels good.** So:

- A game that is **mechanically correct but not fun is a failure** — a perfectly balanced spreadsheet
  that no one wants to open. Our QA can prove the gates are reachable and the 70/30 split holds
  (qa-playtesting.md §2) and the game can still be *boring*. Correctness is necessary, not sufficient.
- A game that is **story-coherent but not fun is a failure** — the Edo restoration fantasy only lands
  if the player stays long enough to feel it. Narrative is *delivered through* the fun loop (the UI
  reveal IS the plot beat, §1.12); if the loop stalls, the story never arrives.
- Our two riskiest bets — a **deliberately long ~28.5 h grind** (§4.8) and **active-only, no idle
  layer** (D-013) — are both *fun bets*. The grind is only justified if the grind itself is pleasurable;
  active-only is only justified if every active minute offers a *decision*, not a wait. Both raise the
  fun bar rather than lowering it.

**The one-line test:** *would a player, mid-rung, with no story prompt and no external pressure,
choose to do one more deed?* If yes at every point across 28.5 h, the game is fun. Everything below
serves that test.

---

## 2. The core fun loops in OUR game

Seven named loops, smallest timescale to largest. Each: **what it is → why it's fun → the lever that
tunes it.** These are the things the harness watches and the polish loop juices.

### 2.1 The deed loop (seconds) — *do → reward → next goal*
- **What:** the atomic act — rake rice, forage, fell timber, resolve a fight, craft, work an office —
  resolving into an instant, legible payoff (a **rice-yield pop (+ a little coin)**, XP pop, a
  recognised **deed-jump** into a pillar, §4.2.1) and immediately presenting the next choice.
  **Koku does *not* tick per deed** — the House's koku *standing* re-assesses on its own cadence
  (seasonally, then a big "the assessors arrive" beat at each tier jump, §2.5), so it stays a slow
  prestige *score*, never a per-act reward.
- **Why it's fun:** this is the **variable-ratio reward** core — unpredictable hits (loot rolls, crit,
  which deed lands a jump) wrapped in *unambiguous* progress. The ~70% deed-jump stream (§4.2) is our
  slot-machine dopamine; the punch is the point. Active-only means every few seconds is a *decision*,
  not a timer.
- **Lever:** **juice + feedback latency.** First action < 5 s (§4.8); reward feedback effectively
  instant (number pop, sound, bar-fill — qa-playtesting.md §6 "number/reward juice"). Tune deed base
  values + the 0.04 per-event cap (§4.2.1) so it's *many small acts*, never a few spikes — the texture
  is "a recognised act every ~4.5–5 min" (the **T0** tutorial instance; tier-relative — T0 tutorial ~5 /
  T2 Valley ~8 / T3 Region ~13 min, Q20; the new-T1 full-estate cadence re-derives with the §4.8.1 spine).

### 2.2 The rung-climb loop (~30–120 min) — *"one more rung"*
- **What:** the estate-rank ladder (a fresh `R/V/G` ladder per tier, §3) — each rung a named promotion
  with a concrete trigger, an in-fiction reason, and a named granter (§3.2.1). **Every rung-up is a
  player-TRIGGERED, ignorable VN story beat, not a silent number-fill (D-110, on D-104's scene engine):**
  a ready promotion *holds* at the header rung until you choose to stop grinding and **trigger** it — some
  rungs introduce a **new character**, others deepen a known one, and they carry **choices the NPCs
  remember** (persisting across ascension). It is **NOT the case that every rung grants a perk** — the
  reward is the *earned scene* + the relationships/flags it moves, with only **occasional small varied**
  bonuses (the intro's three perks were a one-time boost, not the pattern).
- **Why it's fun:** the **goal-gradient effect** — motivation rises as a visible goal nears, and a rung
  is always *visibly* near (a labelled next title, a partly-filled meter). Each rung also *delivers a
  reveal* (§2.4), so the climb pays double. "One more rung" is the meso-engine that turns a session into
  "just push to the next promotion." And because the rung is a **triggered, chosen** beat rather than an
  auto-snap, the promotion lands as a moment you *earned and acted on* — a narrative reward that motivates
  the areas/panels/people it unlocks — never a number silently ticking over (the old silent pop-in, F97/F99).
- **Lever:** **the ≥30-min floor + the ≤2–3× never-balloon rule (§4.8, both LOCKED).** The floor is
  **T0-exempt and first binds from T1** — T0's tutorial rungs run a gentler ~10–15 min so the hook lands
  fast, and the deliberate grind-floor begins with the full estate at T1. The floor stops
  rungs being trivially fast (a reveal-desert); the ratio cap stops the next rung being a wall. The art
  is making 30+ min feel earned, not stalled — which is why the rung must visibly *fill* the whole time.

### 2.3 The pillar loop (hours) — *number-go-up that means something*
- **What:** the four **House Influence** pillars (Arms / Estate & Wealth / Office / Name & Honour, §1.6)
  accumulating up-only toward the per-tier gate thresholds (§4.1). This standing is what the seasonal
  judge re-expresses as the House's **koku score** (never coin, never spent — the prestige number that
  gates ascension, §2.5).
- **Why it's fun:** **legible exponential growth you "hold in your hands"** — and because each pillar is
  tied to fiction (Arms changes what you survive; Name changes how NPCs address you), the numbers read
  as *story, not spreadsheet*. Crucially the pillars **interconnect** (Wealth funds Arms; Name gates
  Office) so a plateau in one *pulls* the player into another rather than into boredom.
- **Lever:** **interconnection + the gate drift.** Wire pillars to feed/gate each other (PRD §1.6.3:
  required pillars drift Arms+Estate → Office+Name up the tiers) so no pillar is a silo and the
  "which pillar do I push?" choice stays live. The hard **trade ≤⅓ cap** (§4.2.3) keeps any one strand
  from trivialising the others.

### 2.4 The reveal loop (the signature) — *UI as progression*
- **What:** every panel, tab, resource row, area, and screen fades in **one at a time**, gated on game
  state, each reveal firing as **one event** that is simultaneously a log line + an unlock + a plot beat
  (§2.1, §3.0). Single-screen at minute one → multi-screen shell over the climb. The **six tabs themselves**
  (Work · Map · Estate · Inventory · Character · Combat — D-112) reveal incrementally, so the whole IA
  *grows with the player*, never a slam of empty tabs. And entities arrive by **DISCOVERY, not spawn** — you
  *meet* the pedlar or *find* a place for a **reason** (a talkable person on a map node's "who's here", a hint
  in the node's standing description — D-114/D-116/F99), never a shop-menu blinking into existence.
- **Why it's fun:** **novelty + curiosity** — the strongest, freshest pleasure we have, and our biggest
  differentiator (A Dark Room proves it can carry a whole game). A reveal isn't a new button; done right
  it **reframes** what the player thought the game was (the Office tab reframes the estate's place in a
  larger order). Telegraphed locks (a greyed panel with a hint) make the *anticipation* itself content.
- **Lever:** **reveal cadence + reframe quality.** Drip on a tightening-then-loosening rhythm: fast in
  T0 (teach + hook), spaced but bigger later (§5). Rotate **three reveal types** so it never feels samey:
  (a) new *verb/system*, (b) new *content* in a system, (c) new *modifier* that recontextualises an old
  loop. Never dump; never go silent (qa-playtesting.md §3 "novelty drip"). Onboarding rides this **same
  channel** — each new system is taught **in-world by a diegetic mentor** as it unlocks (Genemon for
  labour/rice+coin in T0, Kihei for arms/combat from T1, Sōan for healing in the cold open), **never via a popup
  or tutorial modal** (D-063/D-064): the reveal *is* the lesson, so learning the game stays part of the fun
  rather than a gate in front of it. **Teach each thing at its MOMENT OF NEED, not front-loaded at unlock
  (F1):** gate the lesson to the beat where the mechanic first *matters* — the rice/coin lesson lands *as the
  first yield lands in hand*, not as five mentor lines dumped on the first click (the v0.3 cold-open's clearest
  fun miss). One teach per moment; never a monologue dump. The battery `onboarding` lens checks this.

### 2.5 The seasonal loop (~30–120 min/season) — *the judged exam*
- **What:** on the reckoning cadence — a per-tier lever, decoupled from the 28-day season calendar (T0
  reckons ~every 3 days) — the world appraises the house and each pillar takes a **judged-result top-up**
  on a new high-water mark (~30% of growth; autumn harvest is the headline, §4.2.2). **The same beat
  re-assesses the House's koku *standing*** (the `seasonalJudge`): koku is a slow prestige *score*, so
  this is the only place it moves in ordinary play (plus the bigger "the assessors arrive" event at each
  tier jump) — its own distinct, anticipated juice beat, separate from the per-deed rice/coin hits.
- **Why it's fun:** this is the **fixed, anticipated, "clear measurable" payoff** that complements the
  variable deed hits — the two do different psychological jobs and we keep both (the locked 70/30,
  §4.2). It gives every active session a near-term *exam to prep for* ("push my deeds toward *this*
  season's judgment"), which is the active-only substitute for the idle player's "check back later" hook.
- **Lever:** **the 70/30 feel + a satisfying high-water "headline."** Size the deed inventory and
  `JUDGE_K` so the split lands (§4.8 tie-outs); make the autumn appraisal a genuine fanfare beat
  (qa-playtesting.md §6). Later, **rotate what the season rewards** (Arms-weighted one cycle,
  Office-weighted the next) so it stays a fresh puzzle, not a buffed number (§5, anti-slump).

### 2.6 The combat loop — *tension + the soft-setback*
- **What:** idle auto-resolve + active setup (gear/stance/area; intervene with stance/ability/item/
  retreat, §2.8). The **humbling first fight** at R3 (~20–35% win, §4.6.6) and the climb from ~25% to
  ~85% win-rate over real time.
- **Why it's fun:** **earned mastery under real stakes.** A fight you might lose makes a fight you win
  *mean* something; the soft-setback (drop to 1 HP, ~½-day, light injury, maybe drop carried loot —
  **never levels/gear/Influence**, §4.6.6) keeps tension *real* without ever punishing the player out of
  their progress. Loss motivates training; it never erases it. The **mediocre-start bite is a
  throughout-v1 stance, not just the R3 spike** (D-061): even the **T0 tutorial is quick but never *easy***
  — fast to learn, still humbling to master. The bite always stays inside hard guardrails — every fight is
  **winnable**, setbacks are **soft only**, and there is **no permanent loss and no dead-end / stranding** —
  so humbling pulls the player to *train*, it never pushes them out of the game.
- **Lever:** **the win-rate curve + the setback shape (both LOCKED).** The 20–35% first-fight target and
  the soft-setback shape are not levers; the magnitudes (drop chance, injury duration, clock cost) are.
  Tune so a loss stings for a minute and is recovered by play, never by reload-scumming or grief.

### 2.7 The narrative-payoff loop (tier-scale) — *warmth earned*
- **What:** the diegetic beats — promotions narrated by named granters, the village's "Tama" legend, the
  recurring-dream memory thread, the Origin family opening at T3 (Region), the rival houses dethroned at G7
  (§1.5, §3.6) — **and the home you rest in**: a furnishable personal home + belongings that grow with your
  rung (D-111), the domestic half of the same rise. Delivered **through** mechanics, not over them — and when
  the story *promises* a thing (the dry corner, the bowl Genemon offers), that thing **mechanically EXISTS**:
  a narrative promise with no mechanical existence is a coherence debt (F89), and *closing* it is itself a
  payoff. **Narrative-mechanical coherence is a fun requirement, not a nicety** — the world's spoken promises
  must be reachable, or the restoration fantasy rings hollow.
- **Why it's fun:** **meaning makes the numbers matter** (Universal Paperclips' lesson). The restoration
  fantasy — nobody → the lord's right hand, a dying house restored *and* surpassed — is the emotional
  reason the grind is worth grinding. Payoffs are warmth/allies/flavour, **never power** (§1.2 pillar 6),
  so they never break balance — the **home + belongings are PRESTIGE, not stat-gear** (comfort recovery +
  a *visible status-mirror* of your climb — the surname, the two swords on the wall, gōshi standing — never
  a combat lane, D-111), so "look how far you've come" is *shown*, not just titled, and the balance stays safe.
- **Lever:** **mechanical narrative > text narrative.** Let the *structural* reveal (new tier, new map,
  new political layer) carry the story; keep prose sparse (memory note: light folklore, open-ended).
  Place the warmest beats at the longest tier's payoff (T3 Region, §7) so the slog has an emotional anchor.

---

## 3. How to MEASURE it — the fun targets (the "why" behind the proxies)

Fun isn't unit-testable, but its **absence is measurable.** These are the **targets**; `pacing()` is
built and instrumented (`window.__qa.pacing()`, report-only) in [`qa-playtesting.md`](qa-playtesting.md)
§3, but the auto-player bot + the automated "fun regression suite" are **not yet wired into `verify`**
(planned for M6) — a one-off headless playtest has run (and caught a real combat dead-end). A proxy
fail is a *design smell*, not a proof of boredom — the human play-judgment is the real test; the
proxies make the loop fast.

| Fun target | Heuristic / threshold | Why this target (the fun job it protects) | Loop it guards |
|---|---|---|---|
| **First-5-min hook** | First action < 5 s (§4.8); within 5 min: a verb done, the log reacted, first rice/coin earned, a next goal glimpsed | The hook decides whether there *is* a player. If the cold open doesn't grip, nothing else matters. | 2.1, 2.4 |
| **No dead-time** | Never > ~N s with **no meaningful action and no reward incoming** | Dead air is *the* incremental killer; active-only has no idle excuse for it. Flags reward-deserts + choice-deserts. | 2.1, 2.3 |
| **Reward cadence** | A reward/unlock/number-jump at least every ~X min; a recognised deed every ~4.5–5 min in **T0** (tutorial), **tier-relative** thereafter (T0 ~5 / T2 Valley ~8 / T3 Region ~13 min, Q20; new-T1 full-estate re-derives) (§4.8.1) | Variable-ratio dopamine needs a *floor frequency* or the grind reads as starvation. | 2.1, 2.5 |
| **Always-a-visible-next-goal** | At every state: 2–3 affordable goals + 2–3 visible-but-locked + 1 distant silhouette | The pull never empties. An empty or instant "next thing" is a motivation vacuum. | 2.2, 2.4 |
| **Novelty drip** | A *new-thing* reveal on a steady, never-dumped rhythm; rotate the 3 reveal types | Plateau = churn. The first-time-X moment is our freshest pleasure; it must never run dry or arrive all at once. | 2.4 |
| **≥30-min floor without a wall** | Optimal bot can't clear a **grind** rung < ~28 min — the floor binds from **T1** (R8→R15); all of **T0** (R0→R7) is the floor-exempt tutorial ramp (§4.8.1); casual bot never *stuck* (ceiling isn't a wall) | The floor is the deliberate grind; the wall-check ensures grind ≠ frustration. Both bots are needed. | 2.2 |
| **70/30 feel** | Deeds supply ~70% / seasonal ~30% of each pillar's gate growth (§4.2) | The two reward shapes do different jobs (punchy vs anticipated); drift either way flattens the feel. | 2.1, 2.5, 2.3 |
| **Combat tension band** | First-fight win ~20–35%; climbs to ~85% over the rung (§4.6.6) | Too easy = no stakes; too hard = a wall. The band is where "earned mastery" lives. | 2.6 |

**Reading the dashboard:** green proxies mean *boredom, walls, and starvation are absent* — necessary,
not sufficient. The targets are the **floor of fun**; the human's taste call and the polish loop
(qa-playtesting.md §6) push from "not-boring" to "great."

---

## 4. How to IMPROVE it — the levers

Six levers, in roughly the order to reach for them. Most fun problems are one of these turned too low.

1. **Juice / feedback.** The cheapest, highest-leverage fix. A deed that pays in an *instant, satisfying*
   number-pop + sound + bar-fill feels 3× better than the identical math delivered limply. Apply to every
   reward beat: rice/coin yield, pillar-jump, rank-up, seasonal headline (incl. the koku re-assessment),
   reveal flourish, combat resolve. (This
   is the polish-loop's #1 queue category, qa-playtesting.md §6.) **Audio/SFX is part of this juice** — the
   highest-ROI cheap lever for a beat that wants more punch. Add it **opportunistically** (a beat that
   obviously needs it), *not* as a standing priority, and it must **degrade silently under headless QA** so
   it never pollutes the playtest harness (A5).
2. **Reward pacing.** Tune *frequency and size* of hits to kill reward-deserts. If the no-dead-time proxy
   flags, add a smaller-but-sooner hit (a yield milestone, a partial-meter tick) rather than a bigger
   later one. The texture goal is *many small deeds* (§4.2.1), not few big spikes.
3. **Goal layering.** Always run **three horizons in parallel** — micro (this deed), meso (this season /
   this rung), macro (this tier / this pillar gate) — all *visible at once*. If "what do I do next?" is
   ever ambiguous, surface the next affordable goal and telegraph a locked one.
4. **Choice density.** Active-only fun = a *decision* every few seconds, not a wait. If a deed has
   duration, fill it with a choice (which deed next, how to allocate, a risk/reward stance toggle), never
   an empty timer. Self-directed grind ("I *chose* to push Arms this season") beats mandated grind — keep
   *which* pillar/deed to push in the player's hands.
5. **Novelty injection.** When a stretch goes flat, add a *reveal*, not a number. Prefer a type-(c)
   modifier that recontextualises an existing loop (e.g. a reform that lets you re-run early deeds at a new
   scale) over a fourth parallel bar. Telegraph it first — anticipation is free content.
6. **Difficulty + clarity.** Two failure modes: a *wall* (too hard/slow/opaque → frustration) and a
   *desert* (too easy/trivial → boredom). Fix walls with clarity first (a legend, a visible threshold, a
   forecast) before lowering numbers — often the math is fine and the player just can't *see* the path.
   **Bias the dial toward tension, not comfort (D-086):** scarcity and a real fail-state are the *default*;
   reach for generosity (auto-heal, autopilot, a looser economy) only with a justification, never
   reflexively. The self-inflicted *desert* — softening stakes until nothing bites — is the more common
   failure than a wall, because comfort is the path of least resistance when building.

> **Order of operations for a "this part isn't fun" report:** clarity → juice → pacing → goal/choice →
> novelty → rebalance. Rebalancing the math is the *last* resort, not the first.

---

## 5. How to KEEP it high over ~28.5 h / T0–T3 (the hard part)

The long game is where incrementals die — they front-load engagement and rot into a mid-game "content
desert." Our defences, mapped to the no-reset, tier-replaces-prestige spine:

**(a) Expanding domain + evolving verbs ARE our prestige — the "fresh climb" with no reset.** We have **no
reset of any kind** (D-004 reversed), so we reproduce prestige's three gifts — a fresh start, permanent power,
a *change in the unit of play* — *without* zeroing the player **and without breaking the core-loop canon (the
MC's OWN actions; NO people-management sim; D-015)**. Through all of **v1 the player stays hands-on**; what
changes each tier is the **DOMAIN** the house acts on and the **VERB SET** in the MC's own hands:
- **T0 — you *do*, on the estate (tutorial)** (work the paddy, craft, the humbling first fight) — the domain
  is one house, taught quick.
- **T1 — you *do*, on the estate (full)** — the same house at full depth: the **Arms pillar deeds begin to
  bank**, the coin/rice flywheel **branches** into land/treasury/trade (trade **≤⅓**), the first paid retinue and
  the E1→E2 stage land. **New verbs, same domain** — the deliberate grind-floor starts here. Still your own hands.
- **T2 — you *do*, across the valley** — the domain expands to the village + roads; **new verbs** (trade/silk,
  road-security, the rumours web). Still your own hands; no team to manage.
- **T3 — you *do*, across the region** — the domain expands again; **new verbs** (brokering/diplomacy, the
  rival contest). Still hands-on; the *scope* and the *toolset* grow — not a management layer.
- **T4+ — the unit of play begins to shift toward COMMAND** — auto-producers first appear (**T4+ ONLY**, light
  roster cards, §2.5) and office/governance enters; this is where true delegation (*maneuver* → *court*) lives.

So in **v1 the no-reset "fresh climb" comes from the growing domain + new verbs + the reveal cadence + the
narrative payoffs** — NOT from delegation (a deliberate **T4+** escalation). Each tier promotes the *stage* the
MC acts on "up the stack" while the long-arc numbers never reset — the Edo rank fantasy, without ever turning
v1 into a management sim.

**(b) Layers are new VERBS, not bigger numbers.** Each tier must hand the player a new *thing to do*, not
a ×10 version of the old thing (Antimatter Dimensions' rule). If a tier is "same loop, bigger numbers,"
that *is* the slump. Schedule each tier's headline new system at the tier's **start**, not its end.

**(c) Novelty cadence — the metronome of freshness.** A steady drip of "first time you see X" across the
whole 28.5 h, tied to the reckoning cadence as a predictable beat (each reckoning — a per-tier lever, ~every
3 days in T0, decoupled from the 28-day season — can open one new affordance or shift what's judged). Tightening-then-loosening rhythm: fast reveals in T0 to teach/hook, spaced-but-
bigger reveals later (the slow grind is the *space* in which each reveal lands harder — don't rush reveals
to fill silence). Always telegraph the next one.

**(d) Beat the mid-game slump — T3 Region (~16 h) is the danger zone.** Specific counters, all scheduled into T3:
- **Front-load T3's biggest new verb** (intrigue/faction or the trade-economy layer) at G0, so the
  longest tier *opens* with its freshest system.
- **Seasonal twists rotate the optimal strategy** — change what the seasonal judge rewards each cycle so
  returning to a session is a fresh puzzle, not a buffed number.
- **Force re-engagement with early loops at new scale** — a T3 reform that lets you re-run estate/village
  deeds for a new resource ("push old heroes to 1000"), making everything fresh again.
- **The cross-pillar combos "click" here** — design T3 as the tier where pillar synergies become
  combinatorial (Melvor/NGU interlock): the **FULL 4-pillar combo set** lands at Region/T3 (the partial
  Office-pairs already opened at Village/T2), so depth, not just size, grows.

**(e) Nested escalating goals, always three horizons visible** (§4 lever 3) — micro/meso/macro never
empty, plus a distant **Edo silhouette** kept on the horizon the whole game so the macro pull never dies.

**(f) Theme as a fun engine, not decoration.** Tie every pillar's numbers to the world description — Name
rising changes how NPCs address you, Arms changes what you survive — so the climb *reads* as the
restoration story unfolding. Each big reveal should reframe the saga (the final Edo reveal recontextualises
the whole climb). This is what makes hour 20 still mean something.

---

## 6. The fun-KILLERS + our guardrails

| Fun-killer | What it feels like | Our guardrail (PRD mechanism) |
|---|---|---|
| **Grind-walls** | The next rung balloons; progress stalls into frustration | **≤2–3× never-balloon rule** within a tier + **1.15× intra-tier growth** (§4.8, canon); tier steps are deliberate chapter breaks, not walls. Casual-bot "never stuck" proxy (§3). |
| **Plateaus / number-only tiers** | "Same loop, bigger numbers" — the classic mid-game rot | **Expanding domain + a new verb set per tier** (§5a–b) keeps each tier hands-on but fresh; delegation/auto-producers are a deliberate **T4+** escalation (§2.5), never a v1 management layer; T3 anti-slump package (§5d). |
| **Reward-deserts** | Long stretches with no hit; the grind reads as starvation | **No-dead-time** + **reward-cadence** proxies (§3); the ~70% deed stream sized to "a recognised act every ~4.5–5 min" (§4.8.1). |
| **Choice-deserts** | Active-only "nothing to *decide*," just a wait | **Active-only, no idle** by design (D-013); every deed-duration filled with a choice (§4 lever 4); auto-producers held to **T4+ only** (§2.5) so early game stays hands-on. |
| **Runaway / trivial economy** | One strategy snowballs and trivialises everything | **Trade ≤⅓ cap** (hard invariant, §4.2.3); **0.04 per-event cap** so no deed spikes a pillar (§4.2.1); **per-tier required-pillar drift** stops single-pillar dominance (§1.6.3). |
| **Complexity dumps** | A wall of new panels/controls at once; overwhelm | **Fractal incrementality** — one piece at a time, the drill yard reveals post → rack → slots (§1.2 pillar 2, §3.0); **progressive disclosure** is the signature, not a cost. |
| **"Nothing to do" (active-only trap)** | Player opens the game and there's no live goal | **Always-a-visible-next-goal** proxy (§3); the **seasonal exam** gives every session a near-term target (§2.5); telegraphed locks keep the horizon full. |
| **Punishing setbacks** | A loss erases real progress → rage-quit / save-scum | **Soft-setback shape LOCKED** — 1 HP, ~½-day, light injury, never levels/gear/Influence (§4.6.6); **no permanent holding-loss, never a wipe** (§1.13); **no dead-end / stranding — humbling is always winnable** (D-061). |
| **City-builder/4X tedium creep** | The estate becomes a management spreadsheet | Estate growth is **flavour, not a sim** (§1.2 pillar 5); **no assignment/management panel, no labour-gang** ever (§1.12); Influence stays diegetic (§1.13). |
| **Reveal-deserts (too-fast rungs)** | Rungs clear so fast reveals run out → late-game emptiness | **≥30-min-per-rung floor LOCKED** (§4.8); novelty-drip proxy ensures reveals are paced, never exhausted (§3). |
| **Reflexive generosity** (auto-heal, autopilot, a loose economy) | Stakes quietly leak away — nothing is scarce, no choice bites, the grind self-completes while you watch | **Tension/scarcity is the DEFAULT; generosity must be JUSTIFIED, never reached for (D-086).** HP-attrition + no auto-heal (D-076); tighter **coin** + real **rice** pressure (eat/store/sell,
  swinging seasonal prices), poor-until-T5 (D-077). Generosity-creep is a battery `tension/scarcity` finding, not a feature. (Always inside the §1.13 guardrails — winnable, soft-setback only, no stranding: tension *pulls in*, never *pushes out*.) |
| **Stale after-state** (a climax onto a dead next-screen) | The bell rings on the big payoff — then the panel still reads "Reach Excellent 480/480"; the moment deflates | **Design the AFTER of every payoff, not just the payoff (F2).** A ceremony/milestone beat must resolve into a satisfying next-state — *"…and then what do I see and do in the next ten seconds?"* The battery `fun`/`onboarding` lens runs this "…and then what?" check on every milestone/ceremony beat. |
| **Buffer mistaken for a flywheel** | Upgrades grant comfort (a satiety *buffer*) but value never compounds — breadth without depth, a number that climbs but doesn't *snowball* | **Every upgrade must close a work→output→more-output loop, not merely grant a buffer (A4).** Watch the economic invariants: a high-water mark must not re-judge its own payout (self-inflation); breadth ≠ depth. The battery `economy-arithmetic` lens checks each upgrade actually closes a loop. |
| **Empty narrative promises** (spoken but not built) | The story *names* a thing — a home, a bowl, "a place here is yours" — that has **zero mechanical existence**; the world's words and its systems quietly disagree | **Narrative-mechanical coherence — a spoken promise must be REACHABLE (F89).** Deep housing makes the promised corner/bowl real (D-111, §2.17.1); every rung-up is now an *earned, triggered* story beat that motivates its unlocks (D-110). The narrative-coherence brainstorm / battery lens audits each spoken promise for a mechanical home. |

---

## 7. Per-tier fun watch-points (T0–T3, the v1 scope)

**T0 — Estate-tutorial (the hook + teaching the loop; the ≥30-min floor is EXEMPT here).**
- *Fun engine:* the fastest reveal cadence in the game (a panel every few minutes, on a gentle ~10–15 min/rung
  ramp) + the deed-loop's first juicy hits + the humbling R3 first fight as an early emotional spike.
  Onboarding is **diegetic** — Genemon teaches labour/rice+coin and Sōan opens the healing thread **in-world,
  never via a popup** (D-063). The cold open is one verb + a log — the purest first impression (§3.1).
- *Fun risk:* **the cold open failing to hook** (first-5-min target, §3) and **over-teaching** (a text
  wall instead of learn-by-doing). T0 is a tutorial that must never *feel* like one — **quick, but never
  *easy***: the mediocre-start bite stays intact even here (D-061).
- *Watch:* first action < 5 s; the deed→rice/coin→reveal stack legible within 5 min; reveals reframe, not just
  add; the wolf is humbling-but-winnable (~20–35%), not a brick wall; the teaching lands by *doing*, no modals.

**T1 — Estate-full (first real grind: the ≥30-min floor's first bite).**
- *Fun engine:* the same one house at full depth — the **Arms pillar deeds begin to bank** (Kihei arrives to
  teach arms/combat, diegetically), the **coin/rice flywheel branches** into land/treasury/trade (trade **≤⅓**), the
  **first paid retinue** (Gohei & Yatarō) and the **E1→E2** estate stage land. New verbs, same familiar domain —
  and the **first ascension lands BIG** (the Yūji Syuku beat) so the floor *opens* on a high.
- *Fun risk:* the floor reading as a **stall** rather than an *earned* grind — T0's fast tutorial cadence has
  just ended, and the deliberate slow-down must feel like the game **deepening**, not braking; the new Arms axis
  must read as a fresh pillar, not a tax. Humbling continues — still winnable, soft-setback only, no permanent
  loss, no dead-ends (D-061).
- *Watch:* each rung visibly *fills* the whole ≥30 min (§2.2); the cadence shift from hook→floor reads as depth,
  not a brake; the first ascension lands as a genuine fanfare; Arms feels like a new fantasy, not bookkeeping.

**T2 — The Valley (~8 h): first real breadth.**
- *Fun engine:* the first real **breadth** (the valley domain opens to the house — still your own hands), the **first interconnection** (pillars
  start funding/gating each other), and the first big breadth reveals — the **market** (sell rice for coin
  at swinging seasonal prices; the higher *monme* coin denomination begins to surface as wealth grows —
  coin itself has been spendable since T0), component crafting, the silk *meibutsu*, the inn rumours board,
  the **first Office bar lighting** (V4). The village rep web
  fans out as an *optional* flavour side-track (never a gate).
- *Fun risk:* **breadth read as a complexity dump** (too many panels too fast) and **the optional
  side-track feeling mandatory or pointless.** Office is a *new required gate* (absent through T0–T1) — it must
  feel like a fresh axis, not a tax.
- *Watch:* fractal reveal discipline holds across the wider content; side-faction speedup is *felt but
  never required* (§4.8); the domain expanding to the valley + the new verbs read as a **promotion** (the
  house's reach grows), not a tax — and the MC stays **hands-on** (no management sim).

**T3 — Region (~16 h): the warmest payoff + the rival contest — and the slump danger zone.**
- *Fun engine:* the emotional peak — the **Origin family/friends open** and the **personal-mystery
  (Tama/Tahei) payoff lands** (§1.6.3, §3.6); the **rival houses Tomita & Akagi** are the incumbents to
  surpass, with **G7 = rivals dethroned** as the v1 climax. Play stays **hands-on** but the stage becomes the
  region — brokering/diplomacy verbs + the rival contest; the FULL cross-pillar combos click. (Governance/delegation
  proper is **T4+**, not v1.)
- *Fun risk:* **THE mid-game slump** — the longest tier is where "cycle and cycle for bigger numbers"
  kills retention. It is the longest single tier in v1 — more than any earlier tier alone.
- *Watch:* deploy the full anti-slump package (§5d) — biggest new verb at **G0** (front-loaded), seasonal
  twists rotating the optimal strategy, a reform to re-run early loops at new scale, cross-pillar combos.
  Land the warm narrative beats *during* the grind (not all at G7) so the slog always has an emotional
  anchor pulling forward. Keep the distant **Edo silhouette** visible so the macro goal survives the long
  middle.

---

## 8. Open threads (forward, not v1-blocking)

- **T4/T5 fun** (delegation steps *maneuver* and *court*) are sketched in §5a but not yet designed in
  depth — the "fresh climb without reset" thesis must be re-proven at those tiers when they're authored.
- The **seasonal-twist rotation** (what the judge rewards each cycle) is named here as an anti-slump
  device but its concrete schedule is a §4/§5 balance-and-content task.
- The exact **no-dead-time `~N s`** and **reward-cadence `~X min`** thresholds are left as tunables for
  qa-playtesting.md §3 to pin during the M3 first-playable pass.

---

## See also

- [`qa-playtesting.md`](qa-playtesting.md) §3 — the harness/proxies that **measure** these
  targets (this doc owns *why*, that doc owns *how we check*).
- `ui-design.md` — the visual bible that owns the **look** of every reveal/reward beat.
- [`prd.md`](prd.md) — §1.2 (pillars), §1.6 (four pillars / six tiers), §1.12 (reveal pacing), §1.13
  (guardrails), §3 (unlock ladders), §4.2 (accrual), §4.6.6 (soft-setback), §4.8 (the locked pacing
  budget). [`2026-06-26-prd-human-feedback.md`](../../project/human-feedback/2026-06-26-prd-human-feedback.md) §K — the fun/UI process intent.
