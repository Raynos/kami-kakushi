# Human directive — split the Estate into two tiers (the "intro vs full" reshape)

> **Date:** 2026-06-28 · **Source:** live session, in response to the v0.1 state-of-the-game review.
> **Status:** 🟡 PROPOSED — captured verbatim; pending confirm of two open forks → then locked as ADR(s)
> + rippled through the PRD/docs/code. This is a **locked-intent change** (tier structure), so it
> graduates to `docs/living/decisions.md`.

## The directive (verbatim)

> What I'm strongly feeling about the story, and the game and the flow of the demo is that we need to
> split T0 into two tiers.
>
> Let's have an
>  - Intro tier (new T0) which is in the estate, and you're learning the basics, and you're unlocking
>    features of the estate.
>  - To Intro tier (T0) will still have Rungs R0->R7 and it will still tier up the estate, from T0->T1;
>    To introduce the spine, the four-pillar house influence, we should the "estate level" and the
>    "house influence" but there's ONE PILLAR to level up to go from T0->T1 the other 3 pillars are locked.
>  - Then we want a new T1, the new T1 is still the estate, we have basically left the intro, left the
>    tutorial, there's 8 new rungs within the estate, in fact we probably want to break the original
>    estate rungs into 16 rungs etc.
>  - The new T1 is no longer tutorial / intro; you have some basic features of the game, and we can
>    really up the grind and have the 30mins per rung, and continue to level up the estate,
>  - To level up from T1 (estate) to T2 (village) you would introduce the second pillar, and then
>    unlock the village. so 2/4 pillars open,
>  - Rename region to T3, castle town to T4 and Edo to T5, going from village to region is 3/4 pillars
>    unlocked, going from region to castle town is 4/4 pillars unlocked, then to go to Edo it's still 4 pillars.
>
> In terms of milestone to build we do both T0 content and the T0->T1 transition because it's all the
> "intro" / "tutorial" framing,
>
> You have to decided what estate content is in Estate (tutorial) and Estate (full)

## The resulting model (6 tiers, was 5)

| New tier | Place | Framing | Pillars open *to leave this tier* |
|---|---|---|---|
| **T0** | Estate | Intro / tutorial — learn basics, unlock estate features. Rungs R0→R7. | **1/4** (Pillar 1) → T1 |
| **T1** | Estate | Full game — left the tutorial; real 30-min/rung grind; ~8 new rungs (≈16 estate rungs total). | **2/4** (+Pillar 2) → T2, unlocks Village |
| **T2** | Village | (was T1) | **3/4** (+Pillar 3) → T3 |
| **T3** | Region | (was T2) | **4/4** (+Pillar 4) → T4 |
| **T4** | Castle-town | (was T3) | 4/4 (deepen, no new pillar) → T5 |
| **T5** | Edo | (was T4) | endgame |

Pillar ramp: **1 → 2 → 3 → 4 → 4**. The macro spine is introduced **early but minimal** (one pillar at
the tutorial graduation), then widens one pillar per tier.

## Other decisions locked this session (from the same review)

- **Koku economy:** add a **compounding / power-bearing sink** (not just the finite, power-neutral estate).
- **Combat stance:** **carry HP between fights** so defensive stances are a real tradeoff vs Aggressive
  (un-dominates the default, makes the stance a genuine decision).
- **Seed breadth (H5):** **add minimal versions now** — a lore-talk verb on NPCs, group activities by
  room, route the 2nd weapon to found/crafted; record each as an ADR.

## Resolved forks (2026-06-28)

1. **v1 scope:** new **T0→T3** (Estate-tutorial + Estate-full + Village + Region) — preserves the locked
   v1 *content*; re-derive the ~28.5h budget across the 4 tiers.
2. **Pillar 1 (the T0→T1 spine pillar):** **Estate / 家産**.
3. **Tier-gate mechanic — KEEP the original hybrid grade-gate** (do *not* simplify), scaled by how many
   pillars are open. Base rule: *all pillars ≥ GOOD, ≥2 GREAT, ≥1 EXCELLENT*; reduces per tier to:
   - **T0** (1 pillar): **EXCELLENT**
   - **T1** (2 pillars): **1 GREAT + 1 EXCELLENT**
   - **T2** (3 pillars): **1 EXCELLENT + 1 GREAT + 1 GOOD**
   - **T3** (4 pillars): **1 EXCELLENT + 1 GREAT + 2 GOOD**
   - Pattern: exactly **1 EXCELLENT + 1 GREAT + (N−2) GOOD** for N open pillars (T0 collapses to EXCELLENT).
   - **Overshoot is rewarded:** you may keep leveling pillars *past* the gate; a higher grade at tier-up
     yields a better reward (the grade-flourish idea, adopted).
   - **Manual opt-in story event:** meeting the gate only *unlocks the option* to begin the **tier-up story
     event**. The player chooses *when* to trigger it (grind higher first → better reward). Triggering it
     plays a story beat and grants a **score-scaled reward**. Unlock requirement = "when you may start the
     story," not an auto-advance.
4. **Pacing:** **gentle ramp** — T0 sub-floor (~10–15 min/rung), easing into the full ≥30-min/rung floor
   from T1 onward.

## Resolved forks (batch 2, 2026-06-28)

5. **Pillar → tier map:** **Estate → Arms → Office → Name.** P2 **Arms 武威** @ T1→T2 (Village —
   martial protector); P3 **Office 官威** (*kan'i*) @ T2→T3 (Region — secure territory/offices, dethrone
   the rival houses); P4 **Name & Honour 家格** (*kakaku*) @ T3→T4 (Castle-town — formal recognition/rank).
   Rationale: "**seize authority, then be granted status**"; Office before Name matches old canon, and Name
   *reflects the other three* so it works best last. *(Canon kanji: Office = 官威, Name = 家格 — not 名誉.)*
6. **Ascension reward:** a **permanent, grade-scaled boon** carried into the next tier (a head-start on its
   systems / a small permanent multiplier / unique title+gear). Overshooting the gate compounds.
7. **Tutorial scope:** **showcase in miniature** — T0 introduces a small taste of *every* system (a tiny
   market, one craftable, one NPC line, the Estate pillar + the first ascension) so the player sees the full
   game's shape early; T1 scales each up.
8. **Koku sink:** **compounding estate upgrades** — koku buys estate improvements that raise yield/output
   (work → koku → upgrade → more output → more koku), feeding the Estate 家産 pillar via its LAND/TREASURY
   sub-engines. The reinvestment flywheel the audit asked for.
9. **HP recovery (combat):** HP **carries between fights** and **heals by eating (satiety)** — couples combat
   survivability to the cook/food sink; a low-satiety player is also a fragile one. [pairs with the stance =
   carry-HP decision above]

## Resolved forks (batch 3, 2026-06-28) — closes out the v0.1 report's decisions

10. **H6 — keep ACTIVE-ONLY** (no offline sim; FU23 honored). **Clarified:** active-only still supports
    *"leave it running"* — you can leave the game open in a browser window, do other things, and return to
    find it has kept actively performing the action you left it on. The only distinction from "offline" is
    that the **window/tab must stay open**. → **Technical consequence:** the clock must advance by **elapsed
    wall-time** (delta accumulation) so a backgrounded/throttled tab *catches up* on its next tick; do **not**
    pause on `document.hidden`. Progress stops only when the game is **closed**. *(Revises the v0.1 report's
    "add a document.hidden guard to autosave" — keep the autosave dirty-guard, but the SIM must not pause.)*
11. **H4 — adopt the milestone-integrity rule:** ship a milestone only when **every DoD line is met OR
    formally amended via an ADR first**; add a **CI manifest check** that every instrument a DoD names
    resolves to a real test/tool. Bans "SHIPPED (slice)".
12. **Pillar-teaser scope:** the T0 House Influence panel shows the **active Estate pillar + three locked,
    unnamed silhouettes** — perceived depth + intrigue, not a named roadmap dump.
13. **Origin-mystery cadence/payoff:** the **full payoff lands at the Region (T3, per canon)**, but a
    **dream/mystery beat fires at every tier transition** (incl. T0→T1 and T1→T2 ascensions) so §1.9's
    "dream cadence never goes cold" holds within every window.

## Remaining (now execution, not human decisions)

- Write the **ADR(s)** locking decisions 1–13 (supersede the 5-tier model per D-022, annotate-don't-delete).
- Record the **T0/T1 content split** (showcase-in-miniature) — proposed by Claude.
- **Ripple** the reshape through PRD §1.6/§1.7/§4.8/§5/§7 + `qa-playtesting.md` (tier 0..5, outcome `t3done`)
  + `roadmap.md` + the code tier enum — via a battery/workflow.
- Then **build** the milestone: Estate (tutorial) content + the T0→T1 one-pillar ascension.

## Next

Confirm the forks → write ADR(s) (supersede the 5-tier model per D-022 annotate-don't-delete) → ripple
through PRD §1.6/§1.7/§4.8/§5/§7 + qa-playtesting snapshot (tier 0..5) + roadmap + code tier enum, via a
battery/workflow. Then build the milestone: **Estate (tutorial) content + the T0→T1 one-pillar transition.**
