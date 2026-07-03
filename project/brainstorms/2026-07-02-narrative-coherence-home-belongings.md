# Narrative-mechanical coherence — the home, the bowl, belongings

**Status:** 🆕 proposal — awaiting human scope call. Exploratory brainstorm, not a
commitment; options stay open. No code touched.

**Provenance (the human's steer, 2026-07-02).** Reacting to Genemon's intro line —

> "Earn your keep and there's a dry corner and a bowl in it — that's the whole of
> what I can promise."

— the human said: *"Everything said in the story should exist in the game. I
should have a 'home' to rest in, the dry corner, the bowl. I should have items /
belongings / furniture etc."*

This doc has three parts: **A** states the design tenet and audits the T0
narrative for promised-but-absent things; **B** diverges three scope options for a
home + belongings system (does not pick one); **C** lists the open questions and
says where this lands.

---

## Part A — the principle + the audit

### A.1 · The tenet: narrative-mechanical coherence

**If the prose names a concrete thing, that thing should exist as a reachable game
entity — not stay prose-only.** A home, a bowl, belongings, a dry corner: once the
story *promises* them, the player has been handed a Chekhov's gun. Leaving it
unfired is a coherence debt — the writing writes a cheque the mechanics don't cash,
and the player feels the game is thinner than its own words.

This is the narrative face of the repo's **R6 — "if a player can't reach it, it
doesn't exist."** R6 says a feature that lives only in TypeScript isn't built. The
mirror-image failure is a *thing that lives only in prose*: the story asserts it,
so the player believes it exists, but there's no entity, no verb, no panel behind
it. Both are the same gap — the map disagreeing with the territory (**R2**) — read
from opposite ends.

Scope discipline (so this tenet doesn't become a mandate to model everything):
concrete, *ownable / inhabitable / interactable* nouns the story frames as **yours
or promised to you** are the ones that earn a mechanic. Ambient scenery (the weir,
the grey rain, a stranger's cart) is legitimately prose-only — it sets a scene, it
isn't handed to the player. The test is roughly: *does the narration imply the
player now has / can use / lives in this?* If yes, it wants an entity.

The tenet is a candidate ADR (see Part C). It is a **norm**, not a gate — a lint
can't judge "did the story promise this?" without crying wolf (cf. the
push-to-the-highest-sound-rung convention). It fires at authoring and review time.

### A.2 · Audit — story says X → game has / lacks X

Sources read: `coldOpen.ts`, `intro.ts`, `dialogue.ts`, `surfaces.ts`, `ranks.ts`,
`estate.ts`, `market.ts`, `skills.ts`, plus the `rest` reducer in `intents.ts`.

Legend: **✅ exists** (reachable mechanic) · **🟡 partial** (a related mechanic
exists but not *this* framing) · **❌ absent** (prose-only).

| # | Story says (quote → file:line) | Game has / lacks | Verdict |
|---|---|---|---|
| 1 | *"there's a **dry corner** and a **bowl** in it — that's the whole of what I can promise"* — `intro.ts:266` (also `intro.ts:314`, `dialogue.ts:74`) | No "home" location, no bowl entity. `rest` exists but is sited *"against the cool post"* in the grain-store (`coldOpen.ts:19-20`), not in a quarters. The promised reward of *keep* has no place-you-hold behind it. | ❌ absent — the headline gap |
| 2 | *"a **place here is yours**"* — `dialogue.ts:81` (the R0→kept-hand payoff, `gen-kept`) | Nothing changes in the world when this fires; it's a log line. No space is granted, occupied, or shown. | ❌ absent |
| 3 | *"you'll have earned your rice and a **dry corner to sleep in**"* — `dialogue.ts:74` (`gen-keep`) | Same as #1 — the sleep/rest verb exists but is not *sited in a home*, and is a stamina top-up, not "sleeping in your corner." | ❌ absent |
| 4 | *"You could **rest** a moment against the cool post."* / *"You rest against the post."* — `coldOpen.ts:19-20`, reducer `intents.ts:310-319` | ✅ `rest` verb: `adjustSatiety(+SATIETY_PER_REST)`, ephemeral log, advances clock. But it's a cold-open one-off flavour, never re-homed as your keep is earned. | 🟡 partial (mechanic exists, wrong/absent siting) |
| 5 | *"**belongings** / **items** / **furniture**"* (the human's ask, generalising the bowl) | No belongings/inventory-of-possessions concept. There ARE **resources** (koku, sansai, wood — `market.ts`) and **equipment** (weapon durability/repair, R4 — `surfaces.ts:178-196`), but nothing that reads as *personal possessions / things you own and keep in your home*. | ❌ absent |
| 6 | The **kura / storehouse** as a lived, worked space — *"a storehouse standing half-empty"* `intro.ts:266`; *"Mind the stores as if the rice were your own"* `ranks.ts:167` (R4 kura-warden) | 🟡 The kura exists as the **estate-upgrade sink** (`estate.ts` U1 "Patch the kura") and `haul_stores` labour, and R4 hands you *"the key to the kura"* — but as flavour + a yield lever, not a space you occupy or store *your own* things in. | 🟡 partial |
| 7 | The **omoya / interior house rooms** physically reopen as you rise — *"you walk floors the family walks"* `surfaces.ts:214`; workshops `:224`, granary `:232`, the lord's study `:242` | 🟡 These are **A8 interior-house area reveals**: reveal-as-plot log beats + inked rows, explicitly *"NOT walkable map nodes"* (`surfaces.ts:208-211`). They mark the house's rise but are not *your* rooms and carry no mechanic. | 🟡 partial (status flavour, no player-home) |
| 8 | The estate visibly rises — *"the family crest re-hung above a mended gate… a house on the rise"* `estate.ts:60-62` (U4) | ✅ The estate flywheel: `estateStage` U0→U4, each stage a real koku sink granting `satietyMaxBonus` + a labour `yieldBonusNum` (`estate.ts`, `intents.ts:332`). The *house's* rise is mechanised; the *player's own corner* is not. | ✅ (estate) / ❌ (player home) |
| 9 | Status rewards — *"a **dry corner** — that's the whole of what I can promise. Take it or walk."* (wary branch) `intro.ts:314` | Same corner as #1. The *whole promised wage* (rice + a corner) is 50% mechanised: rice/koku yes, the corner no. | ❌ absent |
| 10 | Rung titles that imply a lived place — R5 *"House-servant… answers to the house day and night"* `ranks.ts:192`; R7 *"the lord calls you to the inner rooms"* `ranks.ts:234` | 🟡 Titles + reveals exist (`ranks.ts`), and R4/R6/R7 open interior *house* rows (#7). But "your standing at home" is never a place you see improve — only a title string + a log beat. | 🟡 partial |

**Headline gaps (the ones that most break the player's trust in the prose):**

1. **The dry corner + the bowl (#1, #3, #9)** — named *three times*, framed as the
   literal entirety of your promised wage, and it has **zero** mechanical
   existence. This is the sharpest coherence debt in T0.
2. **"A place here is yours" (#2)** — the emotional payoff of the whole R0 arc
   (being kept on) resolves to a log line with no world-change.
3. **Belongings / furniture as a category (#5)** — the game has resources and
   equipment but no *personal possessions*, so the bowl has nowhere to live even
   conceptually.
4. **Rest is un-homed (#4)** — the one mechanic that *should* obviously live in the
   dry corner (resting/sleeping) is stranded at the cold-open post and never
   moves.

Everything else (the kura, the omoya rooms, the estate's rise) is **partially**
coherent — a real mechanic exists nearby, but framed as the *house's* asset, not
*your* home. The estate flywheel already proves the pattern ("spend surplus → the
place visibly improves"); the gap is that it improves the *Kurosawa's* holdings,
never *your* corner of them.

---

## Part B — designing the home + belongings (3 scope options)

Diverge, don't converge: three genuinely different scopes. All three at **T0
scope** (some reach toward T1 in Option 3). A recommendation is at the end; the
pick is the human's.

### Option 1 — Minimal / cosmetic (make the prose honest)

**What it adds.** A named place — **"your corner"** (the dry corner) → later
**"your quarters"** — as a tiny home panel/row. The `rest` verb is **re-sited**
there once you're kept on (R1): the rest prose stops saying "against the cool post"
and starts saying "in your corner." One or two **flavour belongings** are *shown*
(the bowl, a straw mat, a spare robe) as inked, non-interactive detail that
accretes as you rise — pure prose-with-a-place, no bonuses.

**Reuses.** The `rest` reducer (`intents.ts:310`) verbatim — only the sited copy
(`coldOpen.restReveal`/`restAct`) forks a "kept-on" variant. The **surface
registry** (`surfaces.ts`) for a `panel-quarters` reveal gated on `rank-r1`
(exactly like the A8 interior-house rows, `surfaces.ts:212-243`). The `gen-kept`
payoff line (`dialogue.ts:81`) becomes the reveal trigger for "a place here is
yours" — the log line now *unlocks a thing*.

**Build cost.** Small. One surface + reveal, a re-sited rest string (or two
variants keyed on a flag), maybe a static "your corner" panel listing 2–3 flavour
items. No new state beyond the surface flag. ~half a session.

**Fun rationale.** Cashes the biggest coherence cheque (#1–#4) at the lowest cost.
The player who was *promised* a corner now *has* one and rests in it — the writing
becomes honest. The bowl exists.

**Risks.** Cosmetic-only can read as a tease if the player expects the bowl to *do*
something (the human's phrasing — "items / belongings / furniture" — leans toward
*things with substance*). Might land as "why show me a home I can't touch?" —
whether that's fine depends on the scope call (Part C, Q3).

### Option 2 — Light mechanical (a home you improve)

**What it adds.** Everything in Option 1, plus the corner becomes a **small
improvable space** with **2–4 belongings/furniture** that each give a *small,
legible* bonus, earned or bought:

- **Bedding (straw mat → futon)** → better **rest recovery** (rest restores more
  satiety per act — scales `SATIETY_PER_REST` while at home).
- **A hearth / cookfire** → a bit of **morale** or lets you **cook at home** (ties
  the existing `verb-cook` sansai→HP heal, `surfaces.ts:136`, to the home).
- **A chest (nagamochi)** → a little **storage** (a small buffer above a
  market/resource cap, or simply where belongings live).
- **The bowl** stays flavour (or a tiny satiety nudge) — the emotional anchor.

Each is a **one-line legible bonus**, bought with the player's own koku (the
**market lane**, `market.ts`) or earned at a rung. This deliberately mirrors the
**estate flywheel** (`estate.ts`) at *personal* scale: a small koku sink that
visibly improves *your* space, distinct from the estate sink that improves the
*house's*.

**Reuses.** The **kura-works ladder shape** (`estate.ts` `ESTATE_STAGES`) as the
template for a "quarters-works" mini-ladder. The **market** as the buy path
(`canBuy`, `market.ts:97`) — furniture as capped personal-koku items. The **rest**
verb (bedding scales it). The **cook** verb (hearth homes it). The **surface
registry** for reveal-gating each piece per rung.

**Build cost.** Medium. A small `furniture`/`home` content module + a few state
fields (owned pieces, a home-satiety/rest modifier), a buy/place reducer path,
a home panel that lists owned vs. available pieces, and wiring the bonuses into
`rest`/`cook`/satiety. ~1–2 sessions. Needs a balance pass so the personal bonuses
stay a *minority* nudge (like the D-008 market cap), never a power lane.

**Fun rationale.** The home becomes a *legible reward surface* — "I earned enough
koku to lay a futon, and now my rest recovers more." Small, honest, tactile;
converts the coherence fix into an actual mini-loop that feeds the existing
rest/cook/market systems. Strong "a place that's mine, and I made it better" beat.

**Risks.** A second personal koku sink competing with the market lane and the
estate lane — needs the economy re-diagnosis (Part C, Q5) to say where the koku
comes from without unbalancing. Bonus creep: four small bonuses can quietly matter;
keep each trivially small and capped. Scope can bleed toward Option 3 if furniture
starts wanting sets/synergies.

### Option 3 — Deeper housing system (your rise, visible at home)

**What it adds.** A **furnishable home that grows with your rung** as a *status
mirror*:

- **Home tiers track the rung ladder** — **dry corner** (R1) → **servant's room**
  (R5, "onto the household staff proper", `ranks.ts:192`) → **your own quarters**
  (R7, "the inner rooms", `ranks.ts:234`). The home *visibly upgrades* as you rise,
  the way the estate does at U1–U4.
- **A belongings inventory distinct from consumables** — possessions you *own and
  keep* (the bowl, a robe, a name-tag, a keepsake), a category separate from
  resources (koku/sansai/wood) and equipment (weapons).
- **Furniture with set / synergy bonuses** — e.g. bedding + hearth + a folding
  screen = a "settled home" set granting a combined rest+morale bonus; pieces slot
  into the home's tier (a servant's room holds more than a corner).
- **The home as a status token surface** — it *shows* your standing physically,
  connecting to the **status-token idea** already in canon (D-108 / the
  `koku-economy-t0-build` plan Phase 5: rank rewards granting **surname → the two
  swords → gōshi rank** as visible tokens). Your rising home is the *domestic*
  half of that same "your rise is visible" fantasy — swords on the wall, a proper
  bowl, a name-plate at the door.

**Reuses.** The **rung ladder** (`ranks.ts` `rewardOnReach`) as the home-tier
driver — home upgrades ride the existing promotion beats. The **A8 interior-house
reveals** (`surfaces.ts:208-243`) become the *scaffolding* for a player-home that
grows alongside the family's reopening rooms. The **estate flywheel** as the
mechanical template (visible-upgrade-as-you-spend). The **status-token / koku**
work as the connective tissue (see Part C, Q5). Equipment/inventory patterns for
the belongings store.

**Build cost.** Largest. A home-tier model, a belongings inventory (new state +
UI), a furniture system with slots and set bonuses, home-tier gating on rungs,
and a home panel that renders the growing space. Multiple sessions, and it wants
its own implementation plan + likely a `diverge` pass on the home panel UI (D-075,
new surface). Overlaps the in-flight economy/status-token work, so **sequencing
matters** — probably lands *after* the koku re-diagnosis settles.

**Fun rationale.** The strongest "your rise is visible at home" fantasy — the home
is a *trophy case for your climb*, the domestic mirror of the estate's restoration.
Deep coherence: every rung that says "you're more than a servant now" is *shown* in
a richer room. Pairs naturally with the status tokens for a unified
"look-how-far-you've-come" surface.

**Risks.** Biggest build, biggest balance surface, most overlap with in-flight
economy/status-token work — real risk of building it twice or against a moving
target. Could over-scope T0 (the PRD keeps T0 lean as tutorial). Belongings +
furniture + sets is a lot of content to author well (and the woodblock/ink bar
applies to every new panel). Strong candidate to **defer the deepest layer to T1+**
and ship Option 1 or 2 at T0.

### Recommendation (bias-to-motion — human decides)

**Default: Option 2 (Light mechanical), staged so Option 1 is its first,
independently-shippable slice.** Rationale:

- Option 1 alone is *necessary regardless* — it's the honest-prose fix and it's
  cheap. Ship it first; the prose stops lying immediately.
- Option 2 then adds the substance the human's phrasing asks for ("items /
  belongings / furniture") as a small, legible loop that *reuses* rest / cook /
  market / the flywheel pattern — real depth, contained cost, no new pillar.
- Option 3's deepest layer (belongings inventory, set bonuses, rung-tracking home
  tiers, status-token tie-in) is **strong but entangled with the in-flight koku /
  status-token work** — recommend **deferring it to T1+** or to *after* the economy
  re-diagnosis lands, so we don't build against a moving economy.

So: **do Option 1 now (make it honest), build Option 2's furniture loop next
(make it substantial), and hold Option 3 as the T1 status-mirror ambition.** This
is a default surfaced for override, not a decision — the depth call is the human's
(Part C).

---

## Part C — open questions for the human

1. **Scope.** Option 1 (cosmetic), Option 2 (light mechanical), or Option 3 (deep
   housing)? The recommendation is 1→2 staged, 3 deferred — confirm or redirect.
2. **Unlock point.** Does the home appear at **cold-open** (you wake in the
   grain-store — is *that* the dry corner?) or at a **rung** (R1 "a place here is
   yours" is the natural earned beat — you're *promised* it at cold-open, *granted*
   it when kept on)? Recommendation: promised at cold-open, granted at R1.
3. **Belongings: bonuses or flavour?** Do furniture/belongings give small
   mechanical bonuses (Option 2/3) or stay pure flavour (Option 1)? The human's
   "items / belongings / furniture" phrasing leans toward *substance* — but confirm,
   since flavour-only is much cheaper and still fixes the coherence debt.
4. **Furniture at T0 or T1+?** Is a furnishing loop a T0 thing (keeps the tutorial
   tier lean vs. gives it a warm personal anchor) or does it belong at T1+ where the
   home can grow with real standing? Recommendation: a *small* furniture set at T0,
   the *deep* set/synergy system at T1+.
5. **Interaction with the in-flight koku / economy re-diagnosis.** There is live
   work reshaping the economy — `docs/plans/opus-2026-07-02-economy-koku-rediagnosis.md`
   (🆕 diagnosis, awaiting a taste call; a possible koku/mon/rice split) and
   `docs/plans/opus-2026-07-02-koku-economy-t0-build.md` (🆕, **blocked** on the PRD
   ripple; its **Phase 5 adds status-token rank rewards** — surname → swords →
   gōshi). A home that *costs koku* (Option 2/3) and *mirrors status* (Option 3)
   plugs directly into both. **Question:** should the home wait for that economy
   shape to settle (lower rework risk) or proceed in parallel on the Option-1
   cosmetic slice (which needs no economy) while the deeper layers wait? Note the
   memory rule *"no parallel build during ripple"* argues for **Option 1 now, 2/3
   after the ripple.**
6. **Does the home connect to the status-token surface?** If Option 3, should the
   growing home and the status tokens (swords, surname) be **one unified
   "your-rise" surface** or two parallel ones? (Design-by-divergence would apply to
   that panel — D-075.)

### Where this lands

- **The coherence tenet (Part A.1) is a candidate ADR** — "narrative-mechanical
  coherence: prose that names an ownable/inhabitable/promised concrete noun owes it
  a reachable entity; the narrative mirror of R6." If the human blesses it, record
  it in `docs/living/decisions.md` (it's a norm, not a gate — see A.1).
- **The chosen scope gets a follow-on implementation plan** in `docs/plans/` once
  the human makes the scope call (Q1) — sequenced against the koku re-diagnosis
  (Q5). Option 2+ likely needs a `diverge` pass on the home panel (D-075).
- This brainstorm should be **added to the human reading queue**
  (`project/todo-human.md`) in the same commit that lands it — it's a proposal put
  up for a scope call.
