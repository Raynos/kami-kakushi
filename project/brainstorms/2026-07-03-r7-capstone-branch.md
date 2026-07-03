# R7 capstone mechanical branch: Brainstorm / Discovery Notes
Date: 2026-07-03 · Goal: design the T0→T1 capstone as a real mechanical branch
(D-121) — what the choice is, what each side promises, what differs, how big, how
it colours T1. Feeds `docs/plans/opus-2026-07-03-r7-capstone-branch-design.md`.

## Summary / key decisions
_(running synthesis — updated as we go)_

### ✅ FINAL SELECTION (human, 2026-07-03)
The R7 capstone = a three-way choice (devoted / ambitious / humble); each keeps its
`regard` flag + Shigemasa warmth AND unlocks a unique T1 side quest giving **a
unique equippable ITEM + a separate UNLOCK**. Chosen one per path:
- **DEVOTED → A2 · "The House's Buried Shame"** — *item:* Sadamune's recovered
  heirloom **blade**; *unlock:* a repeatable **combat enemy** (the debtor's enforcer
  at his hideout). ⏱ medium.
- **AMBITIOUS → B1 · "The Contest of Heirs"** — *item:* a fine dueling **blade**;
  *unlock:* repeatable **spars** (combat-XP grind) + a **Naoyuki-regard
  micro-faction** (levels → sparring perks). ⏱ hours.
- **HUMBLE → C2 · "The Late Student"** — *item:* the **master's piece** (a strong
  crafted equippable); *unlock:* **2–3 unique crafting recipes** (narrow). ⏱ medium.

**Human's full ranking (for the record):** A1 3 · **A2 4** · A3 4 · **B1 4** · B2 2
· B3 3 · **C1 3 · C2 3 · C3 3** (picked the top of each path; A3 tied A2 at 4 but
A2 chosen).

**Flag — all three items are weapons/blades** (A2 heirloom blade, B1 dueling blade,
C2 master's piece). Fine if intended, but if the item mix should vary (an armor /
charm somewhere), C2's "master's piece" is the easiest to reflavour to a
tool/armor. → confirm or leave.

### LOCKED so far
- **The branch = a PATH/ALLY unlock.** Each of the three R7 answers
  (devoted / ambitious / humble) unlocks its **own unique T1 side content** (an
  ally + their thread) — not a stat modifier, not a one-time boon.
- **Full continuity — NO reset.** Ascension carries everything forward (stats,
  items, inventory, skills, standing); it just opens the next section. Design for
  continuity, never a prestige wipe.
- The existing 3 authored options stay the choice; we **ADD** a T1 content unlock
  to their payload — **additively**, keeping what's already there.
- **The "light branch" STAYS (human).** Each option keeps its current payload —
  the per-NPC **`regard` flag** (`devoted` / `ambitious` / `humble`) **+ the
  Shigemasa `warmthDelta`** (relationship memory, `memory: [{npc:'shigemasa', …}]`).
  *(That "light branch" = the relationship/regard the beat already writes, with no
  mechanic.)* The new T1 path/ally unlock is layered **on top**, not a replacement.

### Grounding — the current R7 beat (from `src/core/content/rungBeats.ts` R7)
- Speaker: **Shigemasa** (trusted-of-the-house, the lord's man); prompt: **"How
  do you answer the lord?"** Three authored options, each currently just sets a
  `regard` flag + Shigemasa warmth (the "light branch" to be upgraded):
  - **r7-devoted** — *"I'll carry the Kurosawa name as far as it can go."* (house
    before the man)
  - **r7-ambitious** — *"A name can be made as well as served."* (make your own
    name)
  - **r7-humble** — *"I only did the work in front of me."* (the craft/labour)
- Player surname is already **Kurosawa** (confirms: no surname token at T0).
- **T1 = the FULL ESTATE** (R8→R15) — NOT the Village (that's T2). Correction to
  an earlier agent slip. The capstone colours the full-estate tier, and its cast
  is the anchor for the three paths:
  - **Lord Shigemasa** (the lord) + **Genemon** (chief steward) — the inner circle.
  - **Naoyuki** — the heir and the explicit **in-house RIVAL** (talent-foil).
  - **Tokujirō** (~16) — a green recruit who **arrives at the T0→T1 seam** (the
    "mirror" — a junior version of the player to mentor).
  - Also: Lady Chiyo, Dowager Toku, clerk Tanomo, drillmaster Kihei.

## Q&A log

### Q1 — the fundamental shape of the branch
- Asked: lasting lean / one-time head-start / unlocked path-ally / combo?
- Captured (human): **UNLOCK UNIQUE SIDE CONTENT in T1 → a PATH / ALLY.** Each
  capstone choice opens its own distinct T1 side content (a path or an ally),
  NOT a stat modifier. This is the richest option and the human's clear pick.
- **Key correction (human):** T1 is **NOT a prestige reset.** Everything —
  stats, items, inventory, skills, standing — **carries forward**; ascension just
  **unlocks the next section** of the game. (Agent had wrongly implied a reset;
  design must assume full continuity.)

### Naming / canon questions raised (human) — must resolve before writing the beat
- **The player's surname is his BIRTH name, revealed at the T3 origin beat** — the
  player is NOT a Kurosawa. So the current R7 line *"I'll carry the Kurosawa name
  as far as it can go"* needs scrutiny: is **Kurosawa** the ESTATE / house family
  name (the lord's family the player SERVES)? Then "carry the Kurosawa name" = a
  retainer advancing his lord's house — plausibly fine, but must be unambiguous.
- **RESOLVED (canon, from `names.ts` + `intro.ts` + prd/05-narrative):**
  - **The house family name = Kurosawa** (`names.ts: house: 'Kurosawa'`) — a
    declining *gōshi* house ("a great name gone to seed").
  - **The lord = Shigemasa** → **Lord Shigemasa Kurosawa** (05-narrative explicitly
    "Lord Shigemasa"). **Naoyuki** = his heir. **Genemon** = chief steward. **Chiyo**
    = lady, **Toku** = dowager.
  - **The player is a RETAINER**, not a Kurosawa; his birth surname is the **T3**
    origin reveal. So R7 *"carry the Kurosawa name"* = a devoted retainer advancing
    his **lord's** house — consistent. **Action:** tighten the "devoted" wording so
    it can't misread as the player claiming the Kurosawa name (a retainer serves it,
    doesn't own it). [minor prose fix, not blocking the branch design]
  - **R7 rung title** "Trusted of the house 内衆" is the PLAYER's rung; Shigemasa
    is the lord he's brought before. The status-token task (weapon on wall) is
    unaffected — no surname involved.

## The locked STRUCTURE (human, 2026-07-03)

Each R7 answer → keeps its `regard` flag + Shigemasa warmth **+ unlocks a UNIQUE
SIDE QUEST** in T1 (the full estate). **Every quest gives BOTH: (1) a unique
equippable ITEM reward, AND (2) a separate UNLOCK** from the palette below (skill /
location / enemy / shop / recipes / perk / micro-faction). Both, always — we keep
the item AND the extra unlock. One choice per playthrough → one path; the other two
lock out (replay driver). Full continuity (no reset — everything carries forward).

### The "quest + X" palette (each option = a quest PLUS one/some of these)
- unique **character** · unique **location** (a new map node) · unique **combat
  enemy** to grind · unique **activity / skill** that advances (existing skill
  system) · unique **crafting recipes** · unique **shop** unlock · unique
  **reputation / perk** · unique **reputation micro-faction** that levels up ·
  unique **equippable item** · or any combo that makes sense **and is balanceable**.

### Out of scope (do NOT propose — too hard to balance)
- **New deeds** unlocked from the capstone.
- **Novel new UI surfaces** ("a new surface unlocked" as a new paradigm). *(A new
  map NODE or a skill in the EXISTING skill/map systems is fine — reuse, don't
  invent a paradigm.)*
- An **alternative advancement lane** — a whole new "standing" you level in
  parallel to the pillars. *(A small **micro-faction** rep track IS allowed.)*
- A **new system** — e.g. a "helper" / "auto-labour" mechanic as optional content.
- A **whole new crafting branch** (blacksmithing / armor-crafting). *(Unique
  **recipes** + narrow refinements like "silver-enhanced armor" ARE fine.)*

### Balance philosophy (human) — the 9 need NOT be equal
There can be a **best** choice, some **overpowered**, some **more narratively
interesting**; some are **~5 min** of bonus content, others unlock a **repeatable
grinding tiny subsystem with hours of idle/auto content** (RuneScape-style xp
scaling). Range is a FEATURE. Example given: unlock **"Accounting" + ledger
balancing** = a new skill (grindable, skill-perks) at a new node — hours of
carry-forward content because of the xp grind.

## Diverge — 9 options (pick ONE per R7 answer)

Each = a **unique T1 side quest**, giving **ITEM** (a unique equippable) **+
UNLOCK** (the separate thing), tagged **⏱ scope** and the **systems it reuses**.

### A · DEVOTED — *"I'll carry the Kurosawa name as far as it can go."* (house before self)
- **A1 · "The Red Ledger."** Genemon opens the counting-house; trace the Inherited
  Debt. **Item:** *the abacus-charm* (accessory — a small Accounting/deal bonus).
  **Unlock:** the **Accounting skill** at a new **counting-house node** — grindable
  xp + skill-perks (deal prices, debt-chip). *⏱ hours.* *Reuses:* skill + map node +
  market.
- **A2 · "The House's Buried Shame."** Uncover Sadamune's ruinous venture; confront
  who's bleeding the house. **Item:** *Sadamune's recovered blade* (heirloom
  weapon). **Unlock:** a unique repeatable **combat enemy** (the debtor's enforcer)
  at his hideout. *⏱ medium.* *Reuses:* combat/bestiary + equipment.
- **A3 · "The Confidential Errand."** Prove the house's faith on a secret matter.
  **Item:** *the Kurosawa-crest haori* (garment). **Unlock:** the **quartermaster
  shop** (house-only goods) + a small "trusted" discount **perk**. *⏱ light.*
  *Reuses:* market + equipment + a perk.

### B · AMBITIOUS — *"A name can be made as well as served."* (make your own name)
- **B1 · "The Contest of Heirs."** Ambition wakes Naoyuki into open competition.
  **Item:** *a fine dueling blade* (weapon). **Unlock:** repeatable **spars** (combat
  XP grind) + a **Naoyuki-regard micro-faction** (levels → sparring perks). *⏱
  hours.* *Reuses:* combat + rep track + equipment.
- **B2 · "A Sponsor's Price."** A visiting merchant sponsors your rise. **Item:**
  *the patron's blade* (weapon). **Unlock:** his **luxury/rare-goods shop** (gear the
  pedlar can't sell). *⏱ medium.* *Reuses:* market + equipment. *(No bought-standing
  lane.)*
- **B3 · "A Name of Your Own."** Hunt a notorious beast the house won't sanction.
  **Item:** *the trophy charm* (accessory). **Unlock:** the beast's **farmable lair**
  (a repeatable grind node) + a valley-**rep perk** into T2. *⏱ hours.* *Reuses:*
  combat/bestiary + equipment + a perk.

### C · HUMBLE — *"I only did the work in front of me."* (the craft / the work)
- **C1 · "Teach What You Know."** Mentor the recruit Tokujirō. **Item:** *the paired
  training-staff* (weapon — the mentor bond). **Unlock:** a repeatable **drill-yard
  activity** that levels a **"teacher" perk** (a % XP bump on your own training).
  *NOT a helper/auto mechanic.* *⏱ medium–hours.* *Reuses:* activity/skill-xp +
  equipment + a perk.
- **C2 · "The Late Student."** A retired master takes you on. **Item:** *the master's
  piece* (a strong crafted equippable). **Unlock:** **2–3 unique crafting recipes**
  (narrow — e.g. a silver-inlaid refinement). *NOT a new crafting branch.* *⏱
  medium.* *Reuses:* craft recipes + equipment.
- **C3 · "The Hands Remember."** The working folk adopt you. **Item:** *the folk
  charm* (accessory). **Unlock:** a **servants' micro-faction** raised through small
  favours → minor passive perks (a labour yield %, event warnings). *⏱ light–medium.*
  *Reuses:* rep track + equipment + passive perks.

## Parking lot (tangents / parallel threads)

## Open flags (pending input)
- Whole design is PENDING the human (this session).
