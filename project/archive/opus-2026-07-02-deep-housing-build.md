# Deep housing build — a home that grows with your rise (D-111)

> **📦 ARCHIVED 2026-07-03 — BUILT & verified** (T0 slice; commit `9733632`,
> shipped v0.3.5 `3fea58b`). Two mechanics were **overridden** in the
> agent-default audit — the **hearth homes the cook verb** (not a stat) and the
> **chest is real storage** (not a stat) — now in
> [`../../docs/plans/opus-2026-07-03-v0.3.5-build-plan.md`](../../docs/plans/opus-2026-07-03-v0.3.5-build-plan.md)
> §5–§6. The Status line below is stale.

**Status:** ✅ scope LOCKED (human, 2026-07-02 — **D-111**); **no code changed
yet** — this is the build spec. Implements the **deep** option (Option 3) from the
narrative-coherence brainstorm
([`project/brainstorms/2026-07-02-narrative-coherence-home-belongings.md`](../../project/brainstorms/2026-07-02-narrative-coherence-home-belongings.md)),
with the **comfort + status-mirror** bonus model the human chose.

**Reading queue:** this is a new `docs/plans/*.md` proposal, so it **must be added
to the human reading queue** ([`project/todo-human.md`](../../project/todo-human.md))
in the commit that lands it. ⚠️ *This plan does not edit that file — the landing
session wires it up (flagged here per D-089 / the queue gate).*

---

## 0 · The locked scope (D-111)

Build the **DEEP housing system** — not the cosmetic or light-mechanical slice. It
has three pillars:

1. **A home space that grows with your rung** — the dry corner → your quarters → the
   inner rooms, upgrading visibly as you rise (the domestic mirror of the estate
   flywheel).
2. **A belongings inventory** — possessions you *own and keep* (the bowl, a robe, a
   keepsake), a category **distinct** from resources (rice/coin/materials) and
   equipment (weapons). It lives in the **Inventory tab (F108 / D-112)**.
3. **Furniture / belongings with bonuses + set/synergy** — the bonus register is
   **Edo-flavoured COMFORT** (better rest recovery, storage, morale/upkeep) **plus**
   the home as a **VISIBLE STATUS-MIRROR** of your rise.

**Bonus discipline (non-negotiable — D-111):** the register is **prestige over
power** — **comfort + status, NOT RPG stat-gear**. No furniture grants a combat
stat; bonuses stay a *minority* nudge (like the D-008 market cap), never a power
lane competing with equipment.

**Coherence root.** This cashes the sharpest T0 coherence debt: the story promises a
"dry corner" and a "bowl" three times (`intro.ts:266/314`, `dialogue.ts:74`) and
"a place here is yours" (`dialogue.ts:81`) with **zero** mechanical existence today
(the brainstorm Part A audit). The tenet: *prose that names an ownable/inhabitable
noun owes it a reachable entity* — the narrative mirror of **R6**.

---

## 1 · What exists to reuse (cited)

From the brainstorm's audit + source read:

- **`rest` verb** (`intents.ts:310`) — `adjustSatiety(+SATIETY_PER_REST)`, currently
  sited *"against the cool post"* in the grain-store (`coldOpen.ts:19-20`), never
  re-homed. **Bedding scales this** and the copy re-sites to "your corner."
- **`cook` verb** (`surfaces.ts:136`) — sansai→HP heal; **a hearth homes it.**
- **Surface registry** (`surfaces.ts`) — reveal-gated rows; the **A8 interior-house
  reveals** (`surfaces.ts:208-243`, reveal-as-plot rows, "NOT walkable nodes") are
  the **scaffolding** a player-home grows alongside.
- **Estate flywheel** (`estate.ts` `ESTATE_STAGES` U0→U4; apply at `intents.ts:332`)
  — the **template** for visible-upgrade-as-you-spend, at *personal* scale.
- **Market** (`market.ts` `canBuy:97`) — the buy path; furniture as capped
  personal-**coin** items (post-D-107 the currency is coin, not koku).
- **Rung ladder** (`ranks.ts` `rewardOnReach`) — home tiers ride the rung beats
  (**D-110**); each promotion beat can grant/reveal the next home tier.
- **Status tokens** (**D-109**) — surname → the two swords → gōshi rank; the home is
  the **domestic surface** these render on (swords on the wall, a name-plate).

---

## 2 · The model

### 2.1 Home tiers (ride the rung ladder)

The home is a space with a **tier** that tracks the rung ladder, upgrading visibly:

- **Dry corner** — granted at **R1** ("a place here is yours", `dialogue.ts:81`).
  Promised at cold-open, *granted* when kept on. Holds 1–2 belongings.
- **Servant's room** — around **R5** ("onto the household staff proper",
  `ranks.ts:192`). Holds more; unlocks a furniture slot or two.
- **Your own quarters** — around **R7** ("the inner rooms", `ranks.ts:234`). The
  capstone home; the fullest set + status-mirror.

Each tier is granted **through its rung beat** (D-110) — the home upgrade is
*motivated* by the promotion story, not a silent pop-in. Tier = how many
belongings/furniture slots the home holds + the richness of the rendered space.

### 2.2 Belongings inventory (distinct category — Inventory tab F108)

A **third category** beside resources and equipment:

- **Resources** — rice / coin / materials (consumed, market-priced, at-risk when
  carried; see D-113).
- **Equipment** — weapons (durability/repair, combat).
- **Belongings (NEW)** — possessions you *own and keep*: the bowl, a spare robe, a
  keepsake, later the status tokens (surname deed, the two swords). They are **not
  consumed**, **not carried into combat**, and live in the home / the **Inventory
  tab (F108, D-112)**.

New state: an owned-belongings set + owned-furniture set + the home tier. Additive
fields (bump `SCHEMA_VERSION`); default inert for old saves.

### 2.3 Furniture — comfort bonuses + set/synergy

Furniture pieces give **small, legible COMFORT bonuses** (never combat stats):

- **Bedding (straw mat → futon)** → better **rest recovery** (scales
  `SATIETY_PER_REST` while resting at home).
- **Hearth / cookfire** → **homes the `cook` verb** and/or a small **morale** nudge.
- **Chest (nagamochi)** → a little **storage** (a small buffer / where belongings
  sit).
- **The bowl** → the emotional anchor; flavour or a trivial satiety nudge.

**Set / synergy:** compatible pieces form a **set** (e.g. bedding + hearth + folding
screen = a "settled home" set) granting a **combined** comfort bonus above the sum
of parts. Sets slot into the home's tier (a servant's room holds a fuller set than a
corner). Keep every piece's bonus **trivially small and capped** — the *set* is the
reward, not raw stacking.

### 2.4 The status-mirror layer (ties D-109 tokens)

The home **physically shows your rise** — the domestic half of the "look how far
you've come" fantasy. It renders the **D-109 status tokens** as they're earned:
**surname** (a name-plate at the door) → **the two swords** (mounted on the wall) →
**gōshi rank** (the room's full dressing). This is **prestige, not power** — the
tokens change what the home *looks like* and *says about you*, not any stat. It
unifies the home with the economy's status-token surface into one "your-rise-is-
visible" reading (estate = the house's rise; home = *your* rise).

---

## 3 · Phasing (T0 first)

**Phase T0-A — the home exists + rest re-homes (the honest-prose floor).**
- Grant a **"your corner"** home space at **R1** (through the R1 rung beat, D-110),
  reusing the surface-reveal pattern (`surfaces.ts`, gated like the A8 rows).
- **Re-site `rest`** into the corner once kept on — the prose stops saying "the cool
  post" and says "your corner" (fork the sited copy on a `home` flag; reducer
  logic unchanged).
- Show the **bowl** + 1–2 flavour belongings as inked home detail.
- This alone makes the prose honest (brainstorm gaps #1–#4) and is the smallest
  shippable slice.

**Phase T0-B — belongings inventory + the Inventory tab.**
- Add the **belongings category** + owned-belongings state; surface it in the
  **Inventory tab (F108, D-112)** beside the storehouse/bank.
- Seed it with the bowl + the R1 keepsakes; wire the store/display.

**Phase T0-C — a small comfort furniture loop.**
- A **quarters-works** mini-ladder (template: `estate.ts` `ESTATE_STAGES`) of a few
  furniture pieces, bought with **personal coin** (`market.ts` buy path, capped).
- Wire **bedding → rest recovery** and **hearth → cook/morale**; a chest → small
  storage. One **starter set** with a combined bonus. Balance so bonuses stay a
  minority nudge (D-008-style cap).
- This is a new home **panel** → needs a **D-075 diverge** pass (2–3 working
  variants behind the DEV toggle, self-pick a prod default).

**Phase T0-D (→ T1) — home tiers + the status-mirror.**
- Home tiers upgrade at R5 / R7 through their rung beats (servant's room → your
  quarters), each visibly richer.
- Render the **D-109 status tokens** in the home (name-plate → swords → full
  dressing). The deepest set/synergy content can reach into **T1** if T0 pacing
  argues for it — but the *status-mirror hook* lands at T0 so the rise reads early.

**Sequencing note.** Furniture costs **coin**, and the home mirrors **koku standing
/ status tokens** — both owned by the economy re-core (**D-107–D-109**). Land the
economy nouns (or at least coin) **before** Phase T0-C's buy loop, so this doesn't
build against a moving currency (memory: *no parallel build during a ripple*).
Phases T0-A/B need no economy and can proceed first.

---

## 4 · Test discipline (D-086…D-088)

- **Could-go-RED fixtures from source of truth** — derive rest-recovery assertions
  from `SATIETY_PER_REST` + the bedding multiplier constant, **never** a copied
  magic number; assert the **lever** (the multiplier / set-bonus mechanism), not a
  collapsed metric.
- **Set/synergy** — assert the combined bonus is **> the sum of the parts** (the
  synergy mechanism), and that removing a piece drops the set bonus.
- **Belongings ≠ resources** — assert belongings are **not** consumed by any verb
  and **not** debited by the D-113 combat-loss bite (they're not carried).
- **Per D-088** — the housing slice ships a **full-arc e2e** (earn coin → buy a
  furniture piece → rest recovers more) + an **invariant** (no combat stat is ever
  granted by furniture — the prestige-not-power guard), named in its first
  milestone's DoD. Ration gate-time (A17).

---

## 5 · Risks & notes

- **Prestige-not-power is load-bearing (D-111).** The single most important guard:
  no furniture touches a combat stat. Bake it into a test invariant (§4) so a future
  contributor can't quietly add a "+atk pillow."
- **Second personal coin sink.** The furniture buy loop competes with the market
  lane and the estate lane for the player's coin — needs a balance pass so it's a
  warm optional loop, not a mandatory tax (brainstorm Part C Q5).
- **Build against a settled economy.** Coin + status tokens come from D-107–D-109;
  land those (or coin at least) first for Phase T0-C/D (§3 sequencing note).
- **New panel → D-075 diverge.** The home panel is a new UI surface → mandatory
  diverge (2–3 working variants behind the DEV toggle, per-variant R-item, self-pick
  a prod default).
- **Reuse, don't fork.** Home tiers ride the **rung beats** (D-110) and the **A8
  reveal** scaffolding; the buy loop reuses **market** `canBuy`; rest/cook reducers
  are reused verbatim (only sited copy + a bonus multiplier change). Keep the pure
  core / UI boundary — the home state + bonus math is pure core; the rendered room is
  UI, routed through the same content the apply uses (A6).
- **Woodblock/ink bar (D-018).** Every new home row/panel + each belonging must read
  handmade (CSS + type, no asset slop) — the ui-design.md bar applies.

---

## 6 · Follow-through (on build)

- Add this plan to the **human reading queue** (`project/todo-human.md`) in the
  landing commit (§ top — flagged, not edited here).
- The status-mirror ties the economy's status-token work (D-109); coordinate landing
  order with the economy re-core plans (D-107–D-109).
- Distilled standing tenet for `fun-factor.md` / a norm (brainstorm Part A.1): *"If
  the prose names an ownable / inhabitable / promised concrete noun, that thing owes
  a reachable entity — the narrative mirror of R6 (a thing that lives only in prose
  is as unbuilt as one that lives only in TypeScript)."*
