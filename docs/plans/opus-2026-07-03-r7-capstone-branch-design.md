# R7 capstone branch — design plan

**Status:** ✅ DESIGNED (human-signed 2026-07-03) — **awaiting build**. Two build
sections below: **§A Docs** (ripple the PRD + document the capstone *pattern*) and
**§B Code** (build the T0 capstone + its content). Design settled via a `grill-me`
+ `diverge` pass
([`project/brainstorms/2026-07-03-r7-capstone-branch.md`](../../project/brainstorms/2026-07-03-r7-capstone-branch.md)
— the full 9-option board + the human's ratings live there). Source: D-121.

## Who builds this — Opus

Opus (per D-124), both sections. Depends on the v0.3.5 seven-tab IA (Quests at R5)
and is T1 content, so it lands **after v0.3.5 merges**.

## The design (signed 2026-07-03)

The **R7 capstone** is the existing three-way Shigemasa beat — *"How do you answer
the lord?"* (`rungBeats.ts` R7): **devoted / ambitious / humble**. Each option:
1. **Keeps** its "light branch" — the `regard` flag + Shigemasa `warmthDelta`
   (relationship memory). Unchanged.
2. **PLUS** unlocks a **unique T1 side quest** (full estate, R8→R15) giving **a
   unique equippable ITEM + a separate UNLOCK**.

One choice per playthrough → one quest; the other two lock out (replay driver).
**Full continuity** — everything carries forward; ascension is NOT a reset.

| R7 answer | Quest | Item | Separate unlock | ⏱ |
|---|---|---|---|---|
| **Devoted** | "The House's Buried Shame" | Sadamune's recovered blade (weapon) | a repeatable **enemy** (the enforcer **Kumagorō**) in a new **hideout** location | med |
| **Ambitious** | "The Contest of Heirs" | a fine dueling blade (weapon) | **Naoyuki** early rival-debut + a **spar activity** + a **Naoyuki-regard micro-faction** | hrs |
| **Humble** | "The Late Student" | **Tōsai's chisel** (craft-tool, *not* a weapon) | a new **master** (**Tōsai**) + **workshop** location + a **craft activity/skill (or shop)** whose levels **unlock 2–3 recipes** | med |

**Canon:** player = a **retainer** of the **Kurosawa** house (lord = **Shigemasa
Kurosawa**, heir **Naoyuki**); the player's surname is the **T3** reveal. "Devoted"
= advancing his *lord's* house — tighten so it can't misread as claiming the name.

---

## §A · DOCS — ripple the PRD + document the capstone PATTERN

Two doc jobs; both Opus (D-124).

### A.1 — Document "capstones" as a reusable design pattern (for T1–T5)
Add a **"Capstones" concept subsection** to the PRD (home: `prd/03-unlock-ladder.md`
near the tier-gate / ascension framing, cross-linked from `prd/01-vision.md §1.6`).
It must let **someone else design the T1–T5 capstones later**, so document the
*generalizable pattern*, not just T0:
- **What a capstone is:** the choice at each tier's **cap rung** (R7 for T0, the
  next tier's top rung for T1…), taken at the **tier→next ascension seam**. A
  **values/identity** choice (2–3+ options).
- **The structure (the template):** each option **keeps its relationship memory**
  (regard/warmth) **AND** unlocks a **unique next-tier side quest** → **a unique
  equippable ITEM + a separate UNLOCK**.
- **The "quest + X" palette:** unique character / location (map node) / combat
  enemy / activity-or-skill / crafting recipes / shop / reputation-or-perk /
  reputation micro-faction / equippable item — or any balanceable combo.
- **Out of scope** (copy the guard-rails): no new deeds; no novel new UI surfaces;
  no parallel "standing" advancement lane (micro-factions OK); no new system
  (helper/auto-labour); no whole new crafting branch (recipes + narrow refinements
  OK).
- **Balance philosophy:** the options **need not be equal** — a best / an OP / a
  narrative-only / a 5-min / an hours-of-grind option is fine; **range is a
  feature**.

### A.2 — Preserve the T0 worked example (necessary context)
In the PRD capstone section, **keep the FULL T0 nine-option diverge board WITH the
human's ratings** and which three were chosen — verbatim as the canonical worked
example (a future designer copies its shape):

> A1 3/5 · **A2 4/5 (chosen)** · A3 4/5 · **B1 4/5 (chosen)** · B2 2/5 · B3 3/5 ·
> C1 3/5 · **C2 3/5 (chosen)** · C3 3/5 — full board text in the brainstorm.

Then document the **three chosen T0 outcomes** (the table above) as the T0 capstone
that ships. *(Also ripple: `rungBeats.ts` R7 is no longer "a light branch" — the
PRD/ui-design lines that call it that get a pointer to this design.)*

---

## §B · CODE — build the T0 capstone + its content

Build the three chosen options into the game. Each = a T1 side quest gated on the
R7 pick flag (`r7-devoted` / `r7-ambitious` / `r7-humble`), reachable in T1,
reusing existing systems only.

### B.A2 · "The House's Buried Shame" (DEVOTED) — ⏱ medium
- **Quest-giver:** **Genemon** (existing) — devotion earns his trust with the
  house's shame.
- **Quest:** uncover Sadamune's ruinous venture (the Inherited Debt's origin) →
  trace who's still bleeding the house.
- **New character:** the **debtor's enforcer**, **Kumagorō** (minor antagonist;
  agent-named, vetoable).
- **New location (map node):** the enforcer's **hideout**.
- **Enemy:** the enforcer — a **repeatable grindable** foe (bestiary + combat).
- **Item:** **Sadamune's recovered blade** (heirloom weapon).

### B.B1 · "The Contest of Heirs" (AMBITIOUS) — ⏱ hours
- **Quest-giver:** **Naoyuki** — he challenges the upstart. **His EARLY rival-debut
  fires at the R7 capstone (B1-exclusive)** — a unique rivalry VN intro, *distinct*
  from his normal intro. In A2/C2 (non-ambitious), Naoyuki instead debuts at his
  **normal rung** (early T1) with his normal VN intro. Don't double-fire: if B1,
  suppress/replace the normal one. ⚠ confirm his normal rung vs the T1 narrative.
- **Micro-faction:** **Naoyuki-regard** (rival-respect track).
- **Activity + location:** repeatable **sparring** bouts (combat-XP grind) at a
  **sparring ground** (⚠ reuse Kihei's drill yard vs a new node) that **raise the
  Naoyuki-regard**; higher regard → sparring perks (better XP / tougher bouts).
- **Item:** a **fine dueling blade** (won/gifted at the rivalry's turn).

### B.C2 · "The Late Student" (HUMBLE) — ⏱ medium (→hours w/ the grind)
- **Quest-giver / new character:** the retired **master artisan Tōsai** (a
  metal-inlay / fittings master; agent-named, vetoable) — seeks you out.
- **New location (map node):** Tōsai's **workshop / hermitage**.
- **Unlock = a craft activity / skill / grind (or a little workshop shop):** the
  **recipes are gated behind LEVELING it** (not handed out by the quest). Reuse the
  existing skill/activity + craft systems — recipes appear as level/progress
  unlocks (RS-style tier gating), or bought at the workshop shop as you rank up.
  **No micro-faction** (that was a C3 misread).
- **Recipes:** **2–3 unique recipes** (narrow — e.g. a silver-inlaid refinement),
  unlocked by the activity above.
- **Item (quest reward):** ✅ **Tōsai's chisel** — an equippable **craft-tool
  accessory** (boosts crafting quality/yield), **NOT a weapon** (human: 3 weapons
  was too much). Item mix now: A2 weapon · B1 weapon · C2 craft-tool.

### Build mechanics (all three)
- Each quest gates on the R7 pick flag + the T1 unlock; the R7 beat's `flags`
  already emit `r7-devoted`/`r7-ambitious`/`r7-humble` — read those.
- **Reuse only:** the quest data model, map nodes, combat/bestiary, craft recipes,
  small rep tracks, equipment. No new paradigms.
- **Tests:** a test asserts the three picks unlock **different** quests/items
  (could have gone RED when it was flag-only); each chosen path is **reachable**
  in the running game (R6).

## Design guard-rails (what the build must respect)
- Reuse existing systems (above). · Out-of-scope list (§A.1). · The three need not
  be balanced equally (medium / hours / medium here).

## Resolved flags (human, 2026-07-03)
- ✅ **Naoyuki timing:** B1-exclusive **early rival-debut at R7**; normal intro at
  his normal rung for A2/C2. Two scenes, don't double-fire.
- ✅ **Names:** enforcer **Kumagorō** (A2), master **Tōsai** (C2) — vetoable.
- ✅ **Item mix:** A2 weapon · B1 weapon · **C2 craft-tool** (Tōsai's chisel, not a
  weapon).

## Still open (resolve at build — D-059 tuning)
- Item stats/tier; Kumagorō's stats + drop; the spar XP/perk curve + Naoyuki-regard
  levels; which 2–3 recipes + how the workshop activity/skill unlocks them; the
  master's-chisel craft-bonus; sparring-ground node choice; Naoyuki's normal-intro
  rung (vs the T1 narrative).

## Done-when
- **§A:** the PRD carries a reusable **capstone pattern** subsection + the T0
  9-board with ratings + the three chosen outcomes; the "light branch" lines point
  here.
- **§B:** the three R7 picks each unlock their distinct T1 quest → item + unlock,
  reachable in-game, with a test asserting the branch diverges.
