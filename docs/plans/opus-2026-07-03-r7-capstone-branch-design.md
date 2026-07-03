# R7 capstone branch — design plan

**Status:** ✅ DESIGNED (human-signed 2026-07-03) — **awaiting build**. Split out
of the v0.3.5 build plan so the seven mechanical deltas could ship in parallel;
the design was settled via a `grill-me` + `diverge` pass
([`project/brainstorms/2026-07-03-r7-capstone-branch.md`](../../project/brainstorms/2026-07-03-r7-capstone-branch.md)).
Source: the agent-default audit (D-121).

## Who builds this — Opus

Opus (per D-124). Now that the design is signed, this is a small, self-contained
core+content+render build — but it depends on the v0.3.5 seven-tab IA (the Quests
tab at R5) and is **T1 content**, so it lands after v0.3.5 merges.

## The design (signed 2026-07-03)

The **R7 capstone** is the existing three-way Shigemasa beat — *"How do you answer
the lord?"* (`rungBeats.ts` R7): **devoted / ambitious / humble**. Each option:
1. **Keeps** its current "light branch" — the per-NPC `regard` flag +
   Shigemasa `warmthDelta` (relationship memory). Unchanged.
2. **PLUS** unlocks a **unique T1 side quest** (the full estate, R8→R15) that
   gives **a unique equippable ITEM + a separate UNLOCK**.

One choice per playthrough → one quest; the other two lock out (replay driver).
**Full continuity** — everything carries forward; ascension is NOT a reset.

| R7 answer | Side quest | Item (equippable) | Separate unlock | ⏱ |
|---|---|---|---|---|
| **Devoted** — *"carry the Kurosawa name"* | **"The House's Buried Shame"** — uncover Sadamune's ruinous venture; confront who's bleeding the house | **Sadamune's recovered blade** (heirloom weapon) | a repeatable **combat enemy** (the debtor's enforcer at his hideout) | medium |
| **Ambitious** — *"a name can be made"* | **"The Contest of Heirs"** — ambition wakes Naoyuki into open competition | a **fine dueling blade** | repeatable **spars** (combat-XP grind) + a **Naoyuki-regard micro-faction** (levels → sparring perks) | hours |
| **Humble** — *"only the work"* | **"The Late Student"** — a retired master takes you on | the **master's piece** (a strong crafted equippable) | **2–3 unique crafting recipes** (narrow, e.g. a silver-inlaid refinement) | medium |

**Canon note:** the player is a **retainer** of the **Kurosawa** house (lord =
**Shigemasa Kurosawa**, heir **Naoyuki**); the player's own surname is the **T3**
origin reveal. The "devoted" line means advancing his *lord's* house — tighten the
prose so it can't misread as the player claiming the Kurosawa name.

## Design guard-rails (human — what the build must respect)

- **Reuse existing systems** — the skill/xp system, map nodes, combat/bestiary,
  craft recipes, shops, small rep tracks, equipment. Do **not** invent new
  paradigms.
- **OUT OF SCOPE:** new deeds; novel new UI surfaces; a parallel "standing"
  advancement lane (a small micro-faction rep IS fine); a new system
  (helper/auto-labour); a whole new crafting branch (recipes + narrow refinements
  are fine).
- **The 9 need not be balanced equally** — a best choice / an OP one / a narrative
  one is fine; scope may range 5-min → hours-of-grind. (These three: medium /
  hours / medium.)

## Open build-detail flags (resolve at build, tune by feel — D-059)
- Stats/tier of each item (heirloom blade, dueling blade, master's piece). *(All
  three chosen items are weapons — the human may reflavour C2's "master's piece"
  to a tool/armor for variety; PENDING confirm.)*
- The enforcer enemy's stats + drop; the spar loop's XP/perk curve + the
  Naoyuki micro-faction's levels/perks; which 2–3 recipes + the master's-piece
  recipe.
- Where the quest lives in the T1 quest data + how the R7 pick gates it.

## Done-when

A human-signed design exists (✅) **and** is built: the three R7 picks each unlock
their distinct T1 side quest → item + unlock; a test asserts the branch diverges
(could have gone RED when it was flag-only); each quest is reachable in the running
game (R6).
