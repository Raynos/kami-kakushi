# The T0 capstone branch — designed, DEFERRED to the T1 build

> **⏳ DEFERRED — do NOT build yet.** This is **T1 content** (the side quests land
> in the full estate, **R8→R15**), and **T1 does not exist yet** — the game is
> T0-only (`src/core/content/ranks.ts` `RankId` = `R0…R7`). Building these quests
> now would be unreachable scaffolding (**R6**). **Build this WHEN T1 lands.** The
> R7 *choice* itself already ships (the `r7-devoted` / `r7-ambitious` / `r7-humble`
> flags in `rungBeats.ts`); only its T1 consequences wait.

This is the **settled, human-signed design** for the T0 capstone branch, graduated
here from its (now-archived) plan so it's durable canon. The **pattern** (reusable
for every tier's capstone) + the full 9-option board + the human's ratings live in
the PRD (**§3.0.2** of `prd/03-unlock-ladder.md`) and **ADR D-125**. This doc is the
**build-ready detail** for the T0 instance.

## The design (signed 2026-07-03)

The **R7 capstone** is the existing three-way Shigemasa beat — *"How do you answer
the lord?"* (`rungBeats.ts` R7): **devoted / ambitious / humble**. Each option:
1. **Keeps** its "light branch" — the `regard` flag + Shigemasa `warmthDelta`
   (relationship memory). Unchanged, ships in T0.
2. **PLUS** unlocks (in **T1**) a **unique side quest** giving **a unique equippable
   ITEM + a separate UNLOCK**.

One choice per playthrough → one quest; the other two lock out (replay driver).
**Full continuity** — everything carries forward; ascension is NOT a reset.

| R7 answer | Quest | Item | Separate unlock |
|---|---|---|---|
| **Devoted** | "The House's Buried Shame" | Sadamune's recovered blade *(weapon)* | a repeatable **enemy** (the enforcer **Kumagorō**) in a new **hideout** node |
| **Ambitious** | "The Contest of Heirs" | a fine dueling blade *(weapon)* | **Naoyuki**'s early rival-debut + repeatable **spars** + a **Naoyuki-regard micro-faction** |
| **Humble** | "The Late Student" | **Tōsai's chisel** *(craft-tool, not a weapon)* | the master **Tōsai** + a **workshop** node + a **craft activity/skill** whose levels unlock **2–3 recipes** |

**Canon:** the player is a **retainer** of the **Kurosawa** house (lord =
**Shigemasa Kurosawa**, heir **Naoyuki**); the player's surname is the **T3** origin
reveal. "Devoted" = advancing his *lord's* house — keep the prose so it can't
misread as the player claiming the Kurosawa name.

## Build spec (per chosen option)

Each = a T1 side quest gated on the R7 pick flag (`r7-devoted` / `r7-ambitious` /
`r7-humble`), reachable in T1, reusing existing systems only.

### Devoted · "The House's Buried Shame" — ⏱ medium
- **Quest-giver:** **Genemon** (existing) — devotion earns his trust with the
  house's shame.
- **Quest:** uncover Sadamune's ruinous venture (the Inherited Debt's origin) →
  trace who's still bleeding the house.
- **New character:** the debtor's enforcer, **Kumagorō** (minor antagonist).
- **New location (map node):** the enforcer's **hideout**.
- **Enemy:** Kumagorō — a **repeatable grindable** foe (bestiary + combat).
- **Item:** **Sadamune's recovered blade** (heirloom weapon).

### Ambitious · "The Contest of Heirs" — ⏱ hours
- **Quest-giver:** **Naoyuki** — challenges the upstart. **His EARLY rival-debut
  fires at the R7 capstone (B1-exclusive)** — a unique rivalry VN intro, *distinct*
  from his normal intro. In the other paths, Naoyuki instead debuts at his **normal
  rung** (early T1) with his normal VN intro — **don't double-fire** (if B1,
  suppress/replace the normal one).
- **Micro-faction:** **Naoyuki-regard** (rival-respect track).
- **Activity + location:** repeatable **spars** (combat-XP grind) at a **sparring
  ground** (reuse Kihei's drill yard, or a new node) that **raise the
  Naoyuki-regard**; higher regard → sparring perks.
- **Item:** a **fine dueling blade**.

### Humble · "The Late Student" — ⏱ medium (→hours w/ the grind)
- **Quest-giver / new character:** the retired master artisan **Tōsai** (a
  metal-inlay / fittings master) — seeks you out.
- **New location (map node):** Tōsai's **workshop / hermitage**.
- **Unlock = a craft activity / skill / grind (or a little workshop shop):** the
  **recipes are gated behind LEVELING it** (not handed out by the quest) — recipes
  as level-unlocks (RS-style tier gating), or bought at the workshop shop as you
  rank up. **No micro-faction.**
- **Recipes:** **2–3 unique recipes** (narrow — e.g. a silver-inlaid refinement).
- **Item (quest reward):** **Tōsai's chisel** — an equippable **craft-tool
  accessory** (boosts crafting), **not a weapon**. Item mix: A2 weapon · B1 weapon ·
  C2 craft-tool.

## Design guard-rails (must respect — from D-125)
- **Reuse existing systems** — the skill/xp system, map nodes, combat/bestiary,
  craft recipes, shops, small rep tracks, equipment. No new paradigms.
- **Out of scope:** new deeds; novel new UI surfaces; a parallel "standing"
  advancement lane (micro-factions OK); a new system (helper/auto-labour); a whole
  new crafting branch (recipes + narrow refinements OK).
- The three need not be balanced equally (medium / hours / medium here).

## Resolved (human, 2026-07-03)
- **Naoyuki timing:** B1-exclusive early rival-debut at R7; normal intro at his
  normal rung for the other paths.
- **Names:** enforcer **Kumagorō**, master **Tōsai** (both vetoable).
- **Item mix:** A2 weapon · B1 weapon · **C2 craft-tool**.

## Still open (resolve at build — D-059 tuning)
Item stats/tier; Kumagorō's stats + drop; the spar XP/perk curve + Naoyuki-regard
levels; which 2–3 recipes + how the workshop activity/skill unlocks them; the
master's-chisel craft-bonus; the sparring-ground node choice; Naoyuki's
normal-intro rung (vs the T1 narrative).

## Done-when (the eventual T1 build)
The three R7 picks each unlock their distinct T1 side quest → item + unlock,
**reachable in the running game** (R6, once T1 exists), with a test asserting the
branch diverges (could have gone RED when it was flag-only).
