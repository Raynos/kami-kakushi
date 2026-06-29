# PRD — Human Feedback & Decisions Log

> **📦 ARCHIVED — closed record.** The completed PRD-building feedback log (Blocks A–N), **applied to the
> PRD in V2.2** (commit `2b8d5e9`). **New human feedback goes to the live [`human-feedback/`](..) inbox, not here.**
> Kept for the trail / the audit lens.

**What this is.** A consolidated, chronological-and-thematic record of **every piece of concrete
steering, guidance, and QA answer the human (Jake) has given** while we built the PRD. It exists so the
whole project — the [PRD](../../../docs/living/prd.md), the [journals](../../journal), the [ADRs](../../../docs/living/decisions.md), and the
[canon](../../brainstorms/2026-06-25-locked-decisions.md) — can be **audited against the human's actual
intent**, not just against what the docs happen to say.

**How to use it.** Each entry is a piece of human direction + (where useful) where it landed. When auditing,
read an entry and confirm the PRD/canon/ADRs still honour it. If the docs and this file disagree, **this file
is the record of intent** — fix the docs (or flag a deliberate, agreed change).

**Sources.** The live conversation (verbatim human messages + every `AskUserQuestion` answer), the journals,
the canon (`brainstorms/2026-06-25-locked-decisions.md`), and the ADR log (`docs/living/decisions.md`).
**Legend:** ✅ implemented · 🔄 in progress · ⏳ queued · 🟡 proposed (awaiting confirm) · 🔁 reversed/superseded.

> **Maintenance rule:** append new human feedback here as it arrives (newest within each section at the
> bottom), the same way the journal is kept. This is a living audit doc.
>
> **Precedence rule (human-signed 2026-06-26):** when entries CONFLICT, the **MOST RECENT applies** (newest
> wins). the **LATEST block** (currently **Block N.1 → Block N → Block M → Block L**) **supersedes earlier
> blocks/entries wherever they differ** — per [D-022](../../../docs/living/decisions.md). 🔁 markers flag the specific earlier locks a decision changed.

---

## A. Foundational vision & hard constraints

- **A1. Build the game in README, ship it.** "Build the incremental RPG as outlined in README.md… deploy and
  upload to **itch.io**." Check the README + the two inspirations for the style of web RPG. ✅ (scope/deploy →
  §7, [D-013](../../../docs/living/decisions.md), [D-017](../../../docs/living/decisions.md)).
- **A2. Grounded, NO magic.** "I don't want **Tengu or reincarnation**… less magical, more normal. **Edo
  period**. Lean into some folklore but **not full magic**." Every yokai resolves to a human/natural cause;
  folklore is *believed-atmosphere* only; thin, capped ambiguity (**residual unresolved ambiguity ≤ 1**,
  off-screen, mundane-readable); never player magic. ✅ (D-001, D-002).
- **A3. Mediocre-start protagonist.** "Start as a **normal farmhand — a median, average, even mediocre
  person — and get stronger by perseverance and training and never giving up.**" No hidden power/talent;
  returning memories/habits grant **ZERO mechanical bonus**. ✅ (D-003).
- **A4. Plan & review the whole PRD before building.** "We should really **plan & review the PRD for the
  whole saga** — I don't want to let you go wild with the true oneshot. Any decisions we can review & audit &
  double-check the better." Building is **gated on PRD sign-off**; major decisions are human-gated and
  recorded as ADRs. ✅ (working-agreement; this whole review process).
- **A5. Checkpoint everything into git.** "We want to **checkpoint more information from the session into the
  actual git repo**." → many small commits; snapshot raw workflow outputs into `brainstorms/raw/`; the
  journals; this feedback doc. ✅ (convention in CLAUDE.md).
- **A6. Setting = mid-Edo, stable & commercial (~18th c.), kept FICTIONAL.** No real place/daimyo names
  (drove the "force-fictionalise real names" integration fix). ✅ (canon §A; QA R2 #7).
- **A7. Protagonist = fixed male, no name/gender creator, age ~18–20.** The fixed gender deliberately
  protects the legend's gender-drift clue (the village "remembers" a boy; Tama was a girl); identity is a
  side thread, not a character-creator. ✅ (D-006 + amendment).

---

## B. Working-style & process guidance

- **B1. Lean / minimal output; add back deliberately.** Start lean, don't over-build; add pieces back on
  purpose. (memory: *user-prefers-minimal-output*.) ✅
- **B2. Review decisions before one-shotting.** Gate major design/story decisions on human review during the
  PRD phase; don't one-shot the saga. ✅ (the section-by-section review cadence).
- **B3. Local scratchpad in `./tmp`.** "How do you configure a mutable scratchpad in `./tmp` instead of
  global tmp?" → "Create `./tmp/`, add to `.gitignore`, update CLAUDE.md, add a `tmp/README.md`." ✅
- **B4. Use subagents / workflows / parallelism.** "Keep using **subagents, workflows, parallel steps** to
  speed up development — don't do it all linearly in one main agent." Reiterated: "keep using workflows &
  subagents as necessary to **kick off research & redesign work**." ✅ (Wave 1/2, the rebalance, the §3.4
  reframe workflow, verification lenses).
- **B5. Review major sections individually, with Q&A.** "I should review **System & Mechanics** before §3–7…
  in fact I should review **all the major sections 2–7**, and we should have **more Q&A and feedback** for
  them." → the dependency graph + waves; per-section walkthroughs. ✅
- **B6. Broad strokes, not line-by-line.** "**Too much detail** — I don't want to review each thing one by
  one. Give me the **broad strokes and the things you think I should double-check**; skip the
  routine/obvious." ✅ (review style switched to flagged-items + recommendations-first).
- **B7. Keep Q&A going until satisfied.** "Basically **keep going with Q&A waves until you're 100%
  satisfied**." ✅
- **B8. Commit the dependency correctly.** "Before you launch §2 and §6 shouldn't the **new §1 be committed**
  into `docs/living/prd.md` first?" → commit dependencies before fanning out. ✅
- **B9. Single PRD, clean docs.** "**Merge all sections into a single PRD** and clean up the docs folder." ✅
  (one `docs/living/prd.md`; scratch `docs/prd-sections/` deleted after each merge).
- **B10. Audit for staleness.** "The PRD **reads stale** to me. Do a **full audit & review** of the session,
  the journals, the existing PRD, and see what's stale." → led to the staleness fixes + keeping canon current
  as the discipline. ✅
- **B11. This feedback doc.** "**Checkpoint all feedback** today, from the multiple sessions and the journals,
  into a docs file (e.g. `prd_human_feedback.md`) — a collection of all the feedback + the QA answers, so we
  can audit & review the whole project." ✅ (this file).

---

## C. Story, world & tone direction

- **C1. The estate-restoration pivot (the spine).** Found half-dead in the mountains and taken in by a
  **declining lower-samurai (*goshi*) estate**. You **rise through the estate's ranks** and grow its
  influence; **the main quest = expand the estate's influence outward to Edo.** The estate was once grander;
  restore *and surpass* it. Villagers believe a legend about you; the estate does not. **Identity is a side
  quest, not the spine.** ✅ (D-007, D-008).
- **C2. Tiered domain expansion (later sharpened — see I-block).** Rise across **five tiers** T0 Estate → T1
  Village → T2 Region → T3 Castle-town → T4 Edo; **tiers REPLACE prestige; no reset of any kind — everything
  persists.** ✅ (D-007; reverses D-004).
- **C3. Three factions.** **Estate** (the rank ladder — the spine), **Village of Asagiri** (a reputation
  web), **Origin** (the protagonist's living family/friends from a nearby post-town, who **support you for
  your effort/achievements with the estate**). ✅ (D-008, D-009). *(Sharpened in I-block: see C-feedback on
  reputation systems.)*
- **C4. Don't start as an invalid; still weak.** "You **don't have to start as an invalid** … still start
  **weak and slow**. **Muscle memory** is great. Reflect the new story; the **dream rule**; your **original
  family & friends before the amnesia** from a **nearby town** — another faction that supports you." ✅
  (D-003, D-009; the dream foreshadows Origin, ZERO bonus).
- **C5. Combat is core, not an exception.** Estate combat = pests, animals, bandits; "**combat needs to be
  there too**" as a first-class pillar, introduced **early**. ✅ (D-011; combat live at T0-R3).
- **C6. Folklore = light flavour.** "Folklore handling should be **flavor text, small side quests** … an
  **inn with a rumours section**. Side quests should **not be hand-holding** — open-ended, **fewer
  checklists**. The **main hero gets better at what he does.**" ✅ (D-015; §2.13 rumours board; open-ended
  quests).
- **C7. Skip the diegetic reset.** "**Skip the diegetic reset completely** now." ✅ (D-004 reversed by D-007).
- **C8. Cast grouped by faction & area; more estate members.** "Group the cast by **faction and area**; flesh
  out the factions and areas; **not enough samurai estate members**." Plus a "**separate list of side-quests
  per region/tier**." ✅ (§1.8 cast-by-faction; §5 per-tier side-quests).
- **C9. Add the Father to Origin.** The origin faction was **missing the Father**; add him. ✅ (re-added as
  **Jinpachi**, renamed from the colliding "Kuranosuke").
- **C10. Beef up the endgame (multi-pillar, not farmer/trade).** "The endgame is **far too
  farmer/trade/supply-chain**. We can **take over the castle town, peacefully or otherwise**, and a
  **national Edo-level ranking on multiple pillars.**" ✅ (D-008 four pillars; D-010 national *banzuke*;
  multi-route takeover; trade demoted to ≤⅓ of one pillar).
- **C11. The Tama-vs-farmhand staging (live-session correction).** "How can you do farmhand-vs-Tama when
  **Sayo only sees you as Tama on sight in T1-V0**? Keep the concept **lightly**, but it has to be **staged
  in the right order**." → **T0 = foreshadow only** (dream + porter's-knot; *no one at the estate ever speaks
  "Tama"*); the legend **ignites at T1-V0** (Sayo); allegiance lives in the **village side-track**; grounded
  partial payoff at **T2-G6** (Tama = Otsuru, a girl who ran; the MC is not her). Narrative-only. ✅ (canon
  §3-resolutions; §3.2.1; §3.4).
- **C12. Generational succession beat (human-approved).** Aging Lord **Munenori**'s decline → heir
  **Naoyuki** coming into his own, with the MC as right-hand; Naoyuki's rival→respect→brotherhood arc
  confirmed (seeded T0, pays off T3/T4). ✅ (QA R7 #28; D-014/canon §F).
- **C13. Named-canon human sign-offs.** Accepted the canonical name set (**Kurosawa** estate, **Asagiri**
  village, **Sawatari-juku** origin town, **Tahei** true name, **"Tama"** borrowed name). Later
  disambiguation calls the human signed: grown lost-child = **Otsuru** (substance "a girl who ran" unchanged);
  sweetheart **Ohana → Osen** (to avoid confusion with Otsuru); father re-added as **Jinpachi**; and the
  **Kuzuhara-survivor NPC was CUT** (Kuzuhara = a region node only). ✅ (QA R3 #9; §2/§5 sign-off).

---

## D. Systems, mechanics & scope direction

- **D1. Core loop = the MC's OWN actions.** "The core gameplay loop is **combat & skills & jobs & things he
  crafts**." Meta (Influence/tiers/ranking) sits above and is fed by his grind. ✅ (D-015).
- **D2. NO people-management sim.** "I don't think we need a system about **managing a team**… 'assignment
  management' and 'labour gang' — I don't even know what that means. That can be **flavor text**." Building /
  recruiting / teaching are **light flavour systems, not a minigame** (no assignment panel). ✅ (D-015;
  enforced after the R5-management-panel staleness catch).
- **D3. Don't over-build; lean / high-impact.** "**Don't build too many complicated features.**" No fluff /
  half-features; when scope balloons, **split into "immediate" vs a parked "later"** bucket (park, don't
  delete). ✅ (D-015; memory: *lean-high-impact-content*).
- **D4. More, interleaved ranks; expand the map earlier.** "8 ranks are **too narrow** — more ranks,
  **interleave labour- and combat-focused ranks**. **Search far and wide.** The ladder opens the next canvas;
  the **canvas should expand earlier**. The region needs **rivals/enemies**." ✅ (per-tier ~8-rung ladders
  interleaving labour/combat; full maps every tier; D-012, D-014).
- **D5. Estate grows per tier.** "The estate **to grow** — **cast members per tier**, **more
  buildings/structures**, **more members recruited**" (as light flavour, not a sim). ✅ (E0→E2 in v1; roster
  grows per tier; D-015 framing).
- **D6. Ranks 5/6/7 need detail; combat earlier.** §1.12: "Ranks **5/6/7 need more detail**"; and "introduce
  **combat earlier** if possible." ✅ (combat at R3; §3.2.1 earned-transition spine details every rung).
- **D7. House Influence = four achievement pillars (no trade-dominance).** From the QA rounds: **Arms /
  Estate & Wealth / Standing & Office / Name & Honour**; **trade is 1-of-3 capped sub-engines inside Estate &
  Wealth, hard-capped ≤⅓ of that one pillar.** Accrual = **achievement jumps + per-season judged results**
  (never idle time-trickle, never flat per-action); **up-only with minor recoverable dents — never a wipe.**
  Tier gating = **simple per-tier required-pillar thresholds** (no floor/overflow). ✅ (D-008, D-016).
- **D8. Combat shape.** Idle auto-resolve + active setup; **soft-setback on loss** (lose HP/time, maybe drop
  carried loot / take an injury — never lose levels/gear/Influence). Grounded mobs only; **belief-beasts in a
  separate registry**, never in grindable spawn tables. ✅ (D-011, D-016).
- **D9. Presentation.** Multi-screen UI with **screens/nav progressively revealed** (feels single-screen
  early); responsive desktop+mobile, **not hover-dependent**; text+emoji+CSS (woodblock palette); **K/M/B**
  number formatting; macron (Hepburn) romanization. ✅ (D-013).
- **D10. Tech & save.** Vite + TS + Vitest; **pure-core boundary** (no DOM/canvas in core) + thin renderer;
  one seeded RNG; **IndexedDB single autosave + base64 export/import**; versioned minimal-state; static
  itch.io build; **active-only — NO offline progress.** ✅ (D-013, D-013a).
- **D11. Marriage / adoption = a REAL late-game lever** (NOT the cut management sim). A lean **T3/T4
  alliance/status lever** that lifts Standing & Office / Name & Honour and is a castle-town **takeover
  route** — a strategic one-time jump, not a relationship/dating sim. ✅ (QA R2 #5; §2.16.1; canon §G).
- **D12. Currencies = koku (rice) base + coin (*mon*) trade currency + the four Influence pillars.** Other
  resources (wood, fish, materials) feed crafting; coin is a T1 reveal (no market in T0). ✅ (QA R8 #29).
- **D13. Rich attribute system** — STR / AGI / INT / SPD / LUCK with deep interactions, + per-skill levels +
  gear. **No labour→combat cross-feed** *(🔁 RELAXED to a **bounded** per-skill capped combat bonus — V2 Q6 / **D-022**)* (attributes do double duty; labour *skills* never feed combat
  stats). ✅ (QA R8 #32; §4.4).
- **D14. Crafting = HYBRID depth** — simple recipes early; the component/quality system **unlocks later**
  (T1+). ✅ (QA R6 #21; §2.11).
- **D15. Soft stamina/satiety meter** — it **slows** the day, never hard-blocks; rest/eat to refill; **no
  hard timer-wall.** ✅ (QA R8 #31; §2.3).
- **D16. v1 audio & accessibility.** Audio = light ambient beds + UI/event SFX + a mute toggle. Accessibility
  = solid basics: scalable text, colourblind-safe cues, keyboard + touch, a pause. ✅ (QA R11 #44, R12 #45).

---

## E. The §1 section-by-section review (verbatim points)

> The human reviewed §1 sub-section by sub-section. Captured so the audit can confirm each was honoured.

- **1.3 Premise & tone:** become a member of the samurai estate, expand its influence, raise in the ranks;
  villagers are another faction (shops, craftsmen, artisans, a village chief). **Combat needs to be there
  too.** ✅
- **1.4 Protagonist:** don't start as an invalid; still weak/slow; muscle memory; the dream rule; living
  original family & friends from a nearby town as a support faction. ✅ (see C4).
- **1.5 Estate growth & ranks:** estate grows; cast per tier; more buildings; more recruits; **8 ranks too
  narrow → more, interleaved ranks**; combat (pests/animals/bandits); search far & wide; ladder opens next
  canvas; canvas expands earlier; region needs rivals; village reputation web is decent; origin missing the
  Father; 1.5.4 reasonable. ✅ (see D4, D5, C9).
- **1.6 Folklore:** flavour text + small open-ended side-quests; inn rumours section; fewer checklists; hero
  improves at what he does. ✅ (see C6).
- **1.7 Acts / 1.8 reset:** "act structure — wait for the new PRD"; "**skip the diegetic reset completely.**"
  ✅
- **1.9 Cast & side threads:** group cast by faction & area; flesh out factions/areas; **not enough estate
  members**; a separate side-quest list per region/tier. ✅ (see C8).
- **1.10:** "yeah that's fine." ✅
- **1.11 Endgame:** beef it up — not just domain/trade/supply-chain; castle-town takeover (peaceful or
  otherwise); national Edo multi-pillar ranking. ✅ (see C10).
- **1.12 Core loop / ranks 5-7:** concept good but flesh out; **no team-management system** (flavour text
  instead); core loop = combat & skills & jobs & crafting; don't build too many complicated features; ranks
  5/6/7 need more detail; introduce combat earlier. ✅ (see D2, D6). *(Note: a later audit caught a stale
  "R5 — assignment/management panel + labour-gang" that violated this; it was removed and 1.12 redesigned.)*

---

## F. Locked QA answers — design fundamentals (the early `AskUserQuestion` waves)

> ~12 rounds of Q&A locked the fundamentals. The answers are recorded as ADRs/canon; the load-bearing ones:

- **F1. Combat introduced EARLY** (a core pillar from the first tier), not a late/rare exception. ✅
- **F2. No idle layer in v1** (active-only; auto-producers parked to T3+). ✅
- **F3. Four-pillar House Influence**, trade ≤⅓ of Estate & Wealth (hard). Accrual = achievement jumps +
  per-season judged result, up-only + minor recoverable dents. **Simple per-tier required-pillar thresholds**
  (floor/overflow rejected). ✅
- **F4. Per-season seasonal award** (fires every season; raises a pillar only on a new high-water mark). ✅
- **F5. K/M/B numbers**; macron romanization; multi-screen progressive reveal. ✅
- **F6. IndexedDB save + base64 export/import**; single autosave; versioned minimal-state. ✅
- **F7. Indirect/mediated Edo ceiling** — the national *banzuke* ranks the **house**, not a personal
  hatamoto/shogun ascension. ✅ (D-010).
- **F8. One antagonist per tier** (escalating, grounded), not a single cross-tier racket; estate decline is
  mundane debt, not conspiracy. **Partial justice** (the *osso* risk falls on a *gimin*-martyr ally). ✅
  (D-014).
- **F9. One authored ending + post-game free-play** (no reset); branches are in *how* you got there
  (allegiance / takeover route), not separate endings. Relationships narrative-only; one tuned difficulty. ✅
  (D-015).
- **F10. v1 = Tiers 0–2 complete** (Estate + Village + Region incl. the T2 personal-mystery payoff); T3 =
  stub cliff-hanger; T4 = roadmap. Lean cut-set per tier. ✅ (D-012).
- **F11. Origin opens at T2 and is DOUBLY earned.** The Origin track opens at T2-G2 on a **STORY (the dream
  has returned enough memory) AND PILLAR (travel-standing to walk the checkpointed *kaidō*)** conjunction —
  the warmest payoff stays earned, not free; the dream foreshadows it from early game (ZERO bonus). ✅ (canon
  §3-resolutions; §1.5.3). *(Origin is later upgraded to a one-tier rep side-track — see I6.)*

---

## G. The balance Q&A (this session)

- **G1. Saga length = LONGER.** "12–20h is rough; the initial estate section can be longer — 4, 8, 16 hours
  for a total of ~32. **More grind, more numbers, a slower release of incremental features.**" ✅ (v1 ≈ 28.5h
  built: T0 4.5h / T1 8h / T2 16h; ~32h incl. T3-stub tail).
- **G2. ≥30-min-per-rank floor.** "You **shouldn't be able to advance any individual rank in less than 30
  minutes** — 8 ranks in T0 is 4 hours at the very minimum." ✅ (floor applies to grind rungs R1–R7; R0
  cold-open exempt — *blessed*, see H-block).
- **G3. First fight 20–35% win** (humbling but winnable). ✅
- **G4. Soft-setback-on-loss as proposed** (drop to 1 HP + ~½-day + light injury + possible carried-loot
  drop; never levels/gear/Influence). ✅
- **G5. Accrual = more from deeds** (active), seasonal a smaller top-up. ✅ (70/30 — see H).
- **G6. Deed jumps smaller/steadier** (grindier; the per-event cap lowered). ✅ (0.04 — see H).
- **G7. No respec in v1.** ✅
- **G8. Nav reveal one-tab-at-a-time** (the signature progressive reveal). ✅

---

## H. Whole-PRD open-items QA (3 rounds, this session)

- **H1. v1 skill set + ~4 quest types confirmed** (farming/foraging/woodcutting/fishing/smithing/cooking +
  conditioning + 2–3 weapon lines; Pest Control / Hunt / Clear / Defend). ✅
- **H2. §5 authenticity pass** (Standing & Office kanji + martial/office titles). ✅ **RESOLVED & APPLIED 2026-06-25 (superseded by J4):** 官威 *kan'i*, R7 *jikata-yaku*, *michi-ban* diegetic-only, T4 *rusui-yaku* — all now in prd.md (§1.6.1, §3.2, §1.7).
- **H3. Post-v1 parked list confirmed** (E3–E5 estate depth, Matagi, Pilgrimage order, Scholars network,
  auto-producers beyond the T3 scaffold, marriage-lever numbers, deeper upper-tier nodes). ✅
- **H4. §6 tech defaults locked** — RNG = splitmix64 + named sub-streams; ordered forward migrations + raw
  backup (no cross-major-rewrite guarantee); `tier` stored. ✅ (D-013a).
- **H5. §4 balance dials:** deeds/seasonal **70/30**; per-event cap **0.04**; **front-loaded-then-ramp** rung
  escalation; **~8 seasons/tier**; **Office tier-step keeps ~25×** at T1→T2 (the "win it socially" wall);
  **R0 ≥30-min carve-out blessed.** ✅
- **H6. Side-faction speedup = ~10–15%** off time-to-next-tier (felt, never required) — **supersedes the old
  "≈halve."** ✅ (🔁 the "≈halve" figure was walked back).
- **H7. §7 build/ship:** **M2a / M2b are FIXED milestones** (combat split up front); **NO pre-planned cut —
  full T0–T2 is non-negotiable** (the T0–T1 cut-down ladder removed); itch.io **free / pay-what-you-want +
  HTML in-browser + relative base**; release = **local `npm run verify` gate + manual upload** (no hosted
  CI, no deploy automation). ✅ (D-017).

---

## I. §3 review (live, in progress) — the reputation-systems reframe

> The most consequential live-review feedback: the per-tier ladder must read as the **estate's own story**,
> and promotions must be **earned**. This reshaped the faction model.

- **I1. §3.1 cold open — approved.** ✅
- **I2. §3.2 (T0) — promotions felt arbitrary; make every transition EARNED.** "Each transition has to make
  sense in its own right… it needs to fit the **story, the gameplay, the incremental, the levels, the skills,
  the unlock criteria.** Why does the farmhand get invited into the main house? **You have to earn it.** Why
  the gate-guard / foreman / bailiff promotions?" ✅ (§3.2.1 "earned-transition spine": every R0→R7 jump has
  a trigger + in-fiction reason + named granter; granters escalate Genemon→Jūbei→Chiyo→the Lord; two engines:
  the dying short-staffed house elevates the proven all-rounder, and you rise on merit).
- **I3. Tama staging fix** — see **C11**. ✅
- **I4. §3.4 (T1) — "it's all village village village; the estate feels gone."** Reframe: T1 = **estate
  reputation friendly → trusted**; you do activities **FOR THE ESTATE** in the village + estate + surrounding
  areas; the estate's **domain grows from survival to "the estate manages the village."** Rungs stay **in the
  theme of the house.** **Village reputation = a PARALLEL side-track** (a 2nd rep, optional, fully
  completable, an accelerant); the **estate reputation is what the main quest completes to unlock Region.** 🔄
  (§3.4 redesign workflow `w82yterx8`).
- **I5. §3.6 (T2) — same pattern + Origin + rivals.** Estate reputation **trusted → honorary member of the
  estate**; T2 rungs themed **estate + village + region** (the domain expands again). The **Origin faction =
  its own standalone reputation side-track with its own ranks/rungs** (a full side-quest). The **rival houses
  Tomita & Akagi were barely mentioned** — flesh them out (G7 "leading house of the region" = the rivals
  dethroned). ✅ (§3.6 reframe done: trusted→honorary; Origin one-tier ladder `O0→O5`; Tomita/Akagi fleshed
  out across G0→G7; §3.6.1 earned-transition spine; §3.6.2 Origin ladder).
- **I6. The 3-reputation model (generalised & locked).** **Estate = a FIVE-TIER spine** (the only thing that
  gates tier advancement; per-tier rep arc stranger→friendly→trusted→honorary→…; domain expands each tier).
  **Village (T1) & Origin (T2) = ONE-TIER standalone rep side-tracks**, each with its own ranks/rungs,
  optional/completable, accelerants — **never gate the spine.** ✅ (canon §"Reputation systems model"). Rivals
  Tomita & Akagi are the T2 contest layer (D-014's "one more" = **Akagi**).
- **I7. §3.5 / §3.7 — not yet reviewed.** ⏳

---

## J. Open / not-yet-resolved (for the audit's attention)

- ~~**J1.** §3.4 (T1) reframe.~~ **DONE** ✅ (estate-domain spine + village side-track + §3.4.1).
- ~~**J2.** §3.6 (T2) reframe.~~ **DONE** ✅ (trusted→honorary; Origin `O0→O5`; Tomita/Akagi; §3.6.1/§3.6.2).
- ~~**J3.** §3.5 / §3.7.~~ **DONE** ✅ (§3.5 reviewed clean; §3.7 light-reframed to the estate-domain model).
- ~~**J4.** §5 authenticity pass.~~ **RESOLVED (2026-06-25):** Standing & Office = **官威 (*kan'i*)**; soft
  title fixes (R7 → *jikata-yaku* / "home-field bailiff"; *michi-ban* kept diegetic-only); **T4 reframe** —
  the house runs the *domain's* Edo conduit (rusui-yaku), not its own estate. *(To APPLY after the §7
  breakdown frees `prd.md`.)*
- ~~**J5.** Estate-rep arc T3/T4.~~ **RESOLVED:** stranger→friendly (T0) → trusted (T1) → honorary member
  (T2) → **chief steward / *yōnin* (T3, the MC's ceiling)** → **T4: MC stays *yōnin*; arc shifts to the
  HOUSE's national standing** (indirect ceiling).
- ~~**J6.** Whole-project audit — pending; the holistic consistency sweep is the final gate.~~ **DONE** ✅
  (the 5-round adversarial battery on PRD V2 ran the holistic sweep → Blocks N + N.1; applied in PRD V2.2).
- ~~**J7.** §7 milestone breakdown (5–8 high-level tasks per milestone) — in progress (workflow `w46su5inn`).~~
  **DONE** ✅ (landed in PRD V2; the §7 roadmap now lives in [`roadmap.md`](../../../docs/living/roadmap.md), M0–M2b shipped).
- **J8.** §4 balance — **human-delegated** ("I trust you on S4"); accept first-pass model, **tune at M6**.

---

## K. Post-PRD strategy & process (2026-06-25, human-signed)

> The PRD is **not yet frozen** — the human is still reviewing. These set direction for *after* sign-off.

- **K1. Art = a STRONG CSS design-language, NO asset pipeline.** Woodblock/ink aesthetic via a tight palette,
  a real period-evoking font, CSS borders/seals, and reveal motion — text + emoji + CSS only (per §6.9).
  **Anti-slop discipline:** lock the design language *first*; no screen is improvised.
- **K2. Two gaps to author once the PRD is frozen (before/alongside M0):** (a) a **UI design-language bible**
  (`docs/living/ui-design.md`, preceded by a visual-reference/ukiyo-e research pass); (b) a **fun-factor / playtest
  plan**. Record both as ADRs. *(§6.9 names the palette but has no design VISION; the PRD has pacing targets
  but no FUN proxies — these are the two real gaps.)*
- **K3. Fun-factor process.** Fun is a *hypothesis tested by play*, not a spec. Loop: build → **instrument
  headless fun-proxies** (dead-time, reward/unlock cadence, always-a-visible-next-goal, the first-5-min hook)
  via the DEV play-API → get a **playable T0 vertical slice ASAP** (M0–M3) → **the AGENT drives the slice,
  observes the flow/states (screenshots + telemetry) and forms its own pacing/feel opinions**, iterating →
  **the human plays & makes the higher-level fun call.** The agent measures proxies *and* has its own read;
  the human is the final judge of fun — not the only set of eyes. *(This build→playtest cycle is the one that now **precedes and gates** the docs-explosion — see **K7** / D-021.)*
- **K4. UI-QA process — the agent is a capable visual reviewer (corrected 2026-06-25).** The agent has
  **Playwright MCP + Chrome DevTools MCP + the `capture-game-states` skill + its own multimodal vision** — so
  it **drives the game, screenshots every state / phase / transition / page, *looks at them itself*, critiques
  against the UI bible, and iterates** — catching slop / misalignment / visual bugs **before** anything reaches
  the human. The **human is the higher-level taste arbiter** on polished candidates, NOT the per-screen QA.
  (Do **not** defer all visual judgment to the human — the agent has its own eyes and opinions and must use
  them.)
- **K5. Docs structure (after freeze).** Freeze `prd.md` as the vision; **explode into per-concern living
  docs** (architecture / systems / narrative) + **generate-don't-duplicate** content/balance tables. Hold
  until PRD sign-off. **— REFINED by K7 / ADR D-021 (2026-06-26):** scope the freeze to **locked intent only** (§1 + the hard constraints + the human-signed acceptance criteria), **build M0+M1 against the current `prd.md` first**, and explode **after** the first playtest cycle — roadmap → living `docs/living/roadmap.md`, §4 balance → generated `docs/content/`; **never freeze M2–M7.**
- **K6. Review posture (this session).** §4 = accept first-pass, tune at M6. The **consistency sweep is the
  final gate** before lock. §5 story core **kept as-is**. §2 + the rest of §5 = **trust + spot-check** (during
  the sweep).
- **K7. Freeze = LOCKED INTENT, not the whole plan (refines K5 / D-020 → D-021; human-signed 2026-06-26).**
  The freeze-vs-steer line is **locked intent vs provisional implementation**, NOT a whole-PRD freeze. **Build
  M0+M1 against the CURRENT `prd.md` — do NOT explode the docs yet**; PRD sign-off legitimately lands *after* the
  first build-and-play cycle, so we reorganise **once, later, on ground that has survived contact with play.**
  When we *do* explode (post M0/M1 playtest): freeze **only §1 vision + the hard constraints** (no-magic,
  mediocre-start, trade ≤⅓, active-only, the four pillars, the estate spine) **+ the human-signed acceptance
  criteria** (≥30-min-per-rank floor, 70/30 deeds/seasonal, ~28.5h v1 budget, the tier-gate targets) as a tagged
  vision snapshot; the **§7 milestone roadmap moves to a LIVING `docs/living/roadmap.md`** carrying the banner "M0–M1
  committed; M2–M7 provisional, re-planned after each playtest"; the **§4 balance numbers move to GENERATED
  `docs/content/` tables** (generate-don't-duplicate — this is what makes post-playtest re-tuning cheap, since
  hand-typed derived tables silently drift). **NEVER freeze M2–M7 as locked canon** — *that* is the mistake to
  reject, NOT the multi-doc structure. The **v1 scope lock** (full T0–T2, no pre-planned descope — §7.4.2 / H7)
  is **orthogonal and STILL HOLDS**: it locks *what* ships, not the provisional *how*. Evidence: the battery
  review found the **vision layer had ZERO intent-drift across 97 findings** (freezable — it survived adversarial
  audit) while every gap/under-spec/bug clustered in the **plan layer** (§4 numbers, §2 specifics, §7 detail —
  exactly what stays liquid and resolves via playtest). ✅ (human-signed 2026-06-26; battery
  `brainstorms/2026-06-26-prd-battery-review.md` §P / PD-1; **ADR D-021** refines — does not delete — D-020).

---

## L. The V2 decision-resolution Q&A — all 56 decisions (human-signed 2026-06-26)

> The cumulative record of the human's calls on the 56 battery-review decisions (Q1–Q56) + the process
> decision PD-1. These were made tier-by-tier through the decision UI. **🔁 = changed a prior locked/scope
> decision** (authoritative per the precedence rule + [D-022](../../../docs/living/decisions.md)). Per-decision context,
> options, and rationale live in the master sheet
> ([`../brainstorms/2026-06-26-prd-decisions-master.md`](../../brainstorms/2026-06-26-prd-decisions-master.md));
> the load-bearing changes flow into the **PRD V2** reshape (and get ADRs).

**Combat, attributes & progression**
- **Q1.** Character **level = its own stored track, fed by COMBAT only** (labour/deeds never raise it; HP + attribute points scale off it).
- **Q6. 🔁** Every skill (labour incl.) grants a **small CAPPED combat bonus** — *relaxes the no-labour→combat lock* (D13 / D-011 / D-016) into a **bounded** cross-feed; conditioning = the weak→capable gate; big combat power stays combat-only. *(→ ADR D-022.)*
- **Q15. 🔁** **Combat is INCREMENTAL** — T0 starts with **exactly one weapon**; new weapons/styles/combat-skills unlock rung-to-rung & tier-to-tier (**≥1 new weapon per tier**). 3 lines total, each archetype + signature ability. *(New design surface: a combat-progression ladder.)*
- **Q7. 🔁** **Hybrid "specialization" tier-gate** (reverses "simple thresholds, no floor/overflow", D-016/F3): **good in ALL pillars · great in 2–3 · excellent in 1–2** (3–4 pillars per tier as they reveal). Breadth required, specialization rewarded.
- **Q30. 🔁** Rung promotion gates on **BOTH a NUMERIC rung-meter** (a real §4 curve, fed by rung-specific story-consistent activities) **AND story milestones**. Influence pillars are a separate track (an influence threshold may be a rung criterion). **Double-counting allowed.**
- **Q16.** **Retreat = clean escape** (keep HP/loot, modest clock cost, never dents Influence; abandoning a defence-deed = a failed defend). Headless win-rate bands at R3/V2/V5/G1/G5.
- **Q33. 🔁** **Graded durability bands** (e.g. 75+/50+/1+/0 stepwise), **never auto-unequip** — a weapon stays functional even at 0 (auto-battler; never weaponless).

**Economy & balance**
- **Q14.** Koku is **comfortable / NET** — finish T0 holding ~18–19K (drop the 3–5K double-count).
- **Q29.** **Keep no-market-in-T0**; re-itemize the T0 Estate gate proof with LAND/TREASURY deeds only (village shops = the first market).
- **Q13.** **Defer coin/market numbers to M4** (placeholder, not frozen); resource counts stay unbounded.
- **Q35.** Weather + festivals are **mechanical, bounded ±10%** (day-keyed RNG sub-stream).
- **Q32.** Dent self-heal = a small **below-high-water seasonal restore** (never advances the high-water).
- **Q22. 🔁** T2 anti-slump = **BOTH** the seasonal-reward-rotation **AND cross-pillar combos** (a narrow §4.3 no-leakage exception).
- **Q8. 🔁** **Author an E3 estate stage for v1** → estate grows **E0→E3** (un-parks E3; expands the locked E0–E2).
- **Q42.** Saturation damper applies **progressively per-unit** on bulk sales (legible, un-gameable).

**Stamina**
- **Q31. 🔁** **Combat IS satiety-throttled** ("eat before you fight"); re-spec the locked 20–35% first-fight win-rate **"at adequate satiety."** Floor ~0.5.
- **Q47.** satietyMax **grows with (combat) level**.
- **Q17. 🔁** STAMINA_RATE_FLOOR ~0.5 **+ a general NO-UI-DUMPS principle**: stagger ALL reveals one-per-beat, slowly & gently.

**Tech — RNG, save, determinism**
- **Q2.** RNG = **per-named-stream persisted cursors** `{ seed, cursors }` + **whole-integer dtTicks**.
- **Q3.** Persist **market-saturation only**; derive weather from a day-keyed RNG sub-stream; belief-beasts get `content/beliefBeasts.ts`.
- **Q34. 🔁** Feature-rich data model: **intra-line dialogue branching IS in v1**; nest `estateWealth.subEngines` (so the trade-≤⅓ clamp has storage); sketch `CombatEncounterState`.
- **Q36.** **Ban `Math.pow` → integer-pow + a §6.1 lint** (cross-engine byte-identical replay + portable exported saves).
- **Q44.** **Atomic autosave write** + a calm "couldn't save — export a backup" notice on any rejection.
- **Q37. 🔁** **Multi-backend redundant save** (IndexedDB + localStorage [+ sessionStorage]); on load read ALL, **newest timestamp wins**. Survives itch cross-origin-iframe partition/eviction.
- **Q45. 🔁** **Backwards-compatible (protobuf/thrift-style) save schema** — additive optional fields, never remove/repurpose → migrations rare; raw-backup + rollback as the safety net.
- **Q46.** Save **app-identity magic field** + reject-to-recovery on a bad/foreign id.
- **Q28.** §6.6 verifier gains **gate-monotonicity/ceiling + accrual tie-out + a real-name lint**.
- **Q55.** World-sim content → a `content/world.ts` registry (data-as-code).
- **Q41.** Tag duplicated derived values "illustrative — see generated"; align gen-docs paths.

**Narrative**
- **Q5. 🔁** The Otsuru/Tama **TRUTH = spine-guaranteed at G6**; reclaiming the name **"Tahei" = Origin-gated at O5** (earned, *missable*). *(Resolves Q25 + Q40.)*
- **Q24.** v1 ends on the **castle-town / Daikan first-contact** (rewrite the stale §5 T3 header; drop the porter-guild framing).
- **Q26.** Add **one T1/early-T2 Naoyuki beat** (rivalry → grudging respect) so the G5 ally-flip is earned.
- **Q11.** **One find-spot** (jizō at the weir); **"presumed dead → back from the dead"**; rename the T0 field-lad off "Mago".
- **Q27.** Swap the real surnames (**Toyama, Konoe**) for invented ones.
- **Q39.** Rename non-locked **Naozane + Obaa Sato** (off the Naoyuki/Sayo collisions); re-glyph **AGI 体→敏**.
- **Q12.** Rescope Origin **"ZERO gift"** to the backstory reveal only (the ~10–15% speedup + buff stay); allow-list **Nihonbashi**.
- **Q23. 🔁** **NO quest-type budget** (supersedes D-012's "lean 4") — author whatever quests fit each stage; **more/interesting quests welcome**, esp. later tiers.

**UI / UX / a11y**
- **Q10. 🔁** Distinct activities (**Crafting, Quests**) = their own **top-level nav tabs** (the main screen stays the active labour/deeds/combat loop), not nested panels.
- **Q4.** Wire **fun-proxies into M1/M3/M6** + a fun risk row (fun becomes milestone-gated).
- **Q19.** Mobile = **per-tier primary tabs** + overflow drawer; **save-safety** confirms on destructive actions + a pre-overwrite snapshot.
- **Q18.** Do the **low-cost a11y correctness items now** (persistent a11y entry, ARIA live-region scope, large-textScale reflow, a screen-reader pass).
- **Q48.** Functional text → `--ink-soft` (passes WCAG AA); `--ink-faint` decorative-only.
- **Q21.** Pillar bars show **distance-to-next-gate**; number-flash uses the §2 gain/loss tokens; vermilion reserved for rank-up/seal.
- **Q20.** Deed-cadence fun-proxy → **tier-relative** (T0~5 / T1~8 / T2~13 min).
- **Q9.** Rename the Arms rank-gate **"Combat Standing" → "Combat Rank"**; macronize gōshi/rōnin.

**Assets / release**
- **Q38.** **Inline SVG** for load-bearing period motifs (consistent across OSes); emoji cosmetic-only.
- **Q50. 🔁** **"Good audio"** — mixed **synthesized Web Audio + original/CC0** samples (the ONE acknowledged small asset set; corrects the "no asset pipeline" claim).
- **Q52.** **Self-host the OFL fonts** (kill Google dynamic-subsetting — breaks offline + itch relative-base).
- **Q51.** **License = permissive code** (MIT/Apache-2.0) **+ reserved game content** (all-rights-reserved or CC-BY-NC).
- **Q54.** Add a small **About/Credits surface** (authorship, commit-SHA build stamp, font/audio attributions).
- **Q53.** Declare **itch content descriptors** (mild thematic: child-disappearance, drowning, debt).
- **Q56.** **Defer a perf/memory acceptance criterion** to M0/M1 profiling (note the intent in the risk register).

**Process**
- **PD-1 → ADR D-021.** "Freeze" = **locked intent only** (§1 vision + signed acceptance criteria), not the plan; the §4 numbers / §7 M2–M7 detail stay provisional. Iterative loop: **resolve decisions → PRD V2 → build M0/M1 → playtest → resteer → PRD V3 → build**.
- **D-022 (governing).** These V2 decisions **supersede** any conflicting prior ADR/canon/K-item/lock (annotate, don't delete). Most-recent-wins.

---

## M. Wave-2 follow-up resolutions — the 23 second-order decisions (human-signed 2026-06-26)

> The "how exactly" layer the 56 decisions (Block L) opened up. These **extend/refine Block L** (same precedence:
> newest wins; M supersedes L/A–K where they differ). 🔁 = changed a prior lock/scope. Detail in the wave-2 doc
> ([`../brainstorms/2026-06-26-prd-v2-followups.md`](../../brainstorms/2026-06-26-prd-v2-followups.md)).

**M0 — save & determinism**
- **FU1.** Build the FULL multi-backend save layer in M0 (backend-abstraction + atomic write + magic field + newest-wins selector); rich per-system fields added additively later.
- **FU2.** Newest-save selector = a **save-layer** timestamp (a documented core-lint exemption — metadata, not game logic) + a **monotonic save-counter** as the real selector. The deterministic core stays clock-free.
- **FU3.** RNG = `{ seed, cursors:{combat,loot,seasonal,worldgen} }` (persisted); weather/lunar = a pure stateless `deriveDayKeyed(seed,'weather',day)` helper.
- **FU5.** M0 GameState = `{hp,satiety,attributePoints}` + `character.level` (=1) + satietyMax-at-floor; do NOT pre-declare subEngines/combat/dialogue (add additively at their milestone).
- **🔁 FU4.** NO runtime reveal-queue — **design the unlock schedule so reveals are inherently one-at-a-time**; genuine multi-element single-feature reveals are bespoke one-offs designed per case.

**Progression — the sequential per-tier model**
- **🔁 FU7.** **SEQUENTIAL per-tier:** Phase 1 = climb the rungs via **curated per-rung activities** (1-to-many; NOT a single repeat-counter) + the rung-meter + story → Phase 2 = the estate-influence/pillar grind **unlocks after the final rung** → tier-up. Pillar **deeds gated to phase 2** (prevents "half the rungs, maxed deeds").
- **FU6.** Rung-meter: **per-rung-reset**; each rung's threshold = (≥30-min floor × that rung's eligible-activity rate), back-solved like the koku column; **AND-gate** (meter ≥ threshold AND story flags), "awaiting X" when one lags.
- **🔁 FU10.** Hybrid-gate thresholds need a **per-pillar-per-tier OVERHAUL** (NOT simple ratios), balanced against the fixed deed inventory. Semantics: **good = expected baseline · great = really strong · excellent = above-and-beyond.**
- **FU11.** *(resolved by FU7)* rung-meter + story gate each rung; the Q7 hybrid pillar profile is the separate phase-2 tier-gate.

**Combat**
- **🔁 FU8.** Bounded labour→combat via **PER-SKILL perks** (each skill ~2–8 perks / small flat bonuses, unlocked by leveling it); **stackable, NO hard global cap**; bounded by small magnitudes + **incremental skill unlock** + holistic balance (gear/level/attrs/enemy-scaling grow together); **risk accepted**. Conditioning stays the zero-stat gate.
- **🔁 FU13.** **MORE weapons** (growing roster): T0 unlocks **2** · T1 **+3** · T2 **+4** (~9–10 across v1; T0 still starts with 1). Author a period-appropriate set, each with archetype params + a signature ability.
- **FU12.** Combat-reveal ladder: R3 starter weapon + bare auto-resolve + retreat → durability bands at R4 → stance at R5 → ability/item slots at the first weapon-L10 milestone → 2nd line T1, 3rd T2. One reveal per beat.
- **🔁 FU14.** **THREE clean combat tracks:** kills/combat-XP → **character level** (HP + attribute points); **deeds → the Arms pillar**; per-rung curated activities → the **Combat-Standing rung-meter**. Rewrite the conflated §2.8.
- **FU15.** mobLevel = an explicit per-mob `MobDef.level` (defaults ~ the dangerRing's expected level).
- **FU16.** Satiety→combat = a `satietyRate` multiplier on attackPower (lighter on attackSpeed), flat above ~0.7 → ~0.5 floor; the locked 20-35% first-fight win-rate measured at ≥~0.7 ("adequate satiety").
- **FU17.** Durability = 4 bands on weapon attackPower (75+/50+/1+/0 → 1.0/0.9/0.75/0.55), fixed wear per fight; armour bands on defense; repair restores; **never auto-unequip**.

**Pacing, fun, scope**
- **FU9.** Fun-proxies instrumented at M1 as **REPORT-ONLY** (gate at M6); deed-cadence T0 ~5 min.
- **FU21.** Labour satiety throttle: flat above ~0.7 satietyMax → ~0.5 floor; modest drain/action; rest refills; satietyMax = base + per-level growth.
- **🔁 FU18.** The **~28.5h budget is a FLOOR, not a ceiling** — the game can be LONGER, a long **OSRS-rough grind** (enough grinding content; interleave, don't brick-wall; "leave it auto-running, check progress"). §4.8 = a minimum-grind model. *(→ D-016 annotated.)*
- **FU19.** *(tune-later)* Win-rate bands: each key combat rung humbling-fresh (~30–45%), comfortable after that rung's training/gear.

**Narrative-tech**
- **FU22.** Intra-line dialogue = flat data choices (`choices[]`+`ChoiceId`) with `locksLineIds[]`/flags effects; data not scripting; deterministic; only chosen-flags persist.
- **🔁 FU20.** *(tune-later)* **BROADER cross-pillar combos** (multiple pairs / larger magnitude); the **trade-≤⅓ cap stays HARD** (combos computed post-clamp; verifier-proven).
- **FU23.** v1 **active-only** (no offline): tab-open **auto-resolve + auto-repeat** give the "leave it running" feel; auto-producers stay T3+.

---

---

## Block N — PRD V2.1 decisions (2026-06-26, the post-battery resolution)

> **AUTHORITATIVE — newest block wins (per [D-022](../../../docs/living/decisions.md)).** These 32 decisions resolve the
> 5-round adversarial battery on PRD V2 (the 14 blocking defects B1–B14 + the design-question set; full audit:
> [`brainstorms/2026-06-26-prd-v2-audit.md`](../../brainstorms/2026-06-26-prd-v2-audit.md)). Where any conflict
> exists with Blocks A–M or the §4 numbers, **Block N governs.** They drove the PRD **V2 → V2.1** rewrite.
>
> ✅ **APPLIED to [`prd.md`](../../../docs/living/prd.md) in PRD V2.2** (commit `2b8d5e9`, 943 insertions + an audit-fix reconcile). The
> decisions stand unless the human reopens them.

## Batch 1 — grind feel + gate economy
- **D-Q1 v1 length = ~60h FLOOR** (accept; budget=FLOOR per FU18; ~60h = Phase-1 ~28.5h floor + Phase-2 ~+32h; restate the 28.5h headline as the Phase-1 floor, not the total). Resolves Q2.
- **D-Q2 pace = FLOOR-ONLY, no ceiling, floor is on the RUNG-METER POINTS specifically.** Even optimal FOCUSED play cannot fill a rung's numeric-points objective in <30 min (back-solve the meter threshold to guarantee the ≥30-min focused minimum). Unfocused play (multi-skilling, side-quests, off-objective) takes LONGER (60–120 min). The §4.8.1 35/40/45/55-min wall-clocks = EXPECTED real (somewhat-unfocused) play, NOT a contradiction with the 30-min floor. → resolves demoted-B4 (meter threshold = the focused-optimal ≥30-min floor; reconciles with the wall-clock column). Resolves Q1.
- **D-Q3 gate bands (B1+B8) = author the great/excellent deed supply + make Name a REAL gated pillar.** Quantify supra-good surplus deed-counts per pillar/tier; add their Phase-2 minutes (compounds the ~60h, which is accepted); add a repeatable-deed + maxAwards schema field (§2.12); set Name's gate number off its OWN good band (0.30·28K=8.4K seasonal) + author a ~19.6K Name deed inventory; fix the Name cap column to 0.04·28K. Redefine §6.6.1 reachability as a Phase-2-window TIME budget, not an inventory-sum. Resolves B1+B8.
- **D-Q4 Phase-2 = inject some Phase-2 reveals** (keep reveal cadence alive across the back half; not a dead consolidation half). Resolves Q3-ledger.

## Batch 2 — save / determinism / world-model
- **D-Q9 (B9) load-validation = coerce-safe-fields + reject-to-recovery on the unsalvageable.** validateLoadedState() at the persistence→core boundary; clamp/default cosmetic out-of-range, route structurally-broken → the existing §6.8 recovery flow (never a dead wall, honors Q44). Re-assert ≤⅓/up-only on load. (Round-5 DEMOTED B9 from blocking: the recovery PATH already exists → spec-completion; the internal-bug-NaN residual = reject-to-recovery, consistent with this answer.)
- **D-Q7 (B7) multi-tab = last-writer-wins, documented as UNSUPPORTED.** No leader-election in v1; document that multi-tab play isn't supported. (Cheapest; accept the footgun. Revisit if it bites.)
- **D-Q6 (B6) world-clock = derive season/year (don't store) + lunar = real ~29.5d ephemeris** (f(absoluteDay mod LUNAR_PERIOD), continuous, not a per-day RNG roll). Persist only absolute monotonic day + tick.
- **D-Q5 (B5) combos = Model-A (combo → BOTH paired pillars).** Add an additive deed-only `gateEligibleValue` accumulator combos do NOT write (so combos never satisfy a required gate band nor breach trade-≤⅓). Rewrite §6.5/§6.6/§6.6.1's 'third-pillar Name' to Model-A.

## Round-5 outcomes (folded in)
- **B9 DEMOTED** → spec-completion (policy = D-Q9). **B10 DEMOTED** → spec-completion: specify tick() folds dtTicks one tick at a time, each per-day/week/season plan fires once in fixed registry order, tick(s,a+b)===tick(tick(s,a),b) unit-asserted; + change SeasonalAppraisalState.pendingAppraisalDue boolean → `pendingAppraisals:number` counter (drained in a loop) so multi-season jumps accrue all N appraisals.
- **B13 = the Name-gate contradiction → RESOLVED by D-Q3** (Name IS gated). Consequence: T2 revealed-pillar set = **4** (Arms+Estate+Office+Name), NOT '3–4'; fix §4.1 table + §6.6.1 reveal assertion to a single value 4; the §4.1 Name 28K good band is now the live consumer (kill §4.2.2 'gates no v1 tier'/'(not gated)').
- **NEW blocking from round 5: B12** (no crash boundary/safe-mode), **B14** (quest progression data-model contradictory: flat advanceEvents[] vs step:number cursor vs orphan QuestTask; QuestStatus undefined; no advance_quest intent).
- **New trivial fixes from round 5** (queue for the fix-pass): §4.6.3/§4.6.4 crit/block ordering bug (clamp FINAL post-mitigation damage to DAMAGE_FLOOR); 'the Kurosawa works' Anglicism → period gloss (×2) + add to authenticity watch-list; autosave tick-interval trigger missing from M0 DoD; gatesSpine has no consumer (assert always-false in v1); §5 T2.1 Otsuru superlative vs §1.4 'side thread' prose harmonize.

## Batch 3 — remaining structural blockers
- **D-Q-B2 estate builds = MOVE into each tier's Phase 2** (where the pillar-Influence floors are reachable). Synergy: the E1/E2/E3 builds become Phase-2 content → directly serves D-Q4 (inject Phase-2 reveals). Update §4.7.5/§2.17/§3.x so builds are Phase-2 beats, not Phase-1.
- **D-Q-B11 v1 ending = bounded 'v1 complete' screen, THEN free-play continues.** The cliff-hanger 'stone walls' becomes a real v1-complete ending surface; active loop keeps running for free-play/cleanup; hold tier at T2-complete (do NOT commit an empty T3). Add an M6 PLAYER-FACING terminal assertion (reachable closure + defined post-gate clock/accrual policy), not just the 'no-T3' negative test.
- **D-Q-B12 crash-recovery = error boundary + last-known-good ring + safe-mode boot.** Wrap tick/render in an error boundary; persist a crash-counter OUTSIDE GameState; rolling last-known-good save ring; repeated crashes → safe-mode offering rollback; autosave-poison suppression. New ADR.
- **D-Q-B14 quests = ORDER-FREE advance-event set.** Drop step:number + the 'sequential steps' wording; quests are a set of advance-events with no fixed order. Define the QuestStatus enum (taken/active/abandoned/done/failed) + the advance semantics; remove the orphan QuestTask/step cursor. (§1.10 'never rigid A→B→C' is now consistent — emergent/order-free.)

## Batch 4 — design / UX
- **D-Q-a11y = identity hues are FILLS/ACCENTS only; all meaning-bearing TEXT renders in AA-passing ink** (--ink-soft 7.3). Woodblock identity lives in chrome (fills, bars, pips, borders). Drop the coloured WIN/LOSS word-as-text and coloured label-text; drop the bare 'AA on every surface' overclaim. New UI/a11y ADR; update ui-design.md §5.1/§5.3 + prd.md §2.21d.
- **D-Q-breadth-wall (Q5) = keep the HARD breadth gate, but surface the per-pillar shortfall EARLY + continuously** (from early Phase 2: 'Name is behind') so it's never an end-of-Phase-2 surprise. No substitution/overflow.
- **D-Q-M3/M5-split (Q8) = PRE-SPLIT BOTH** at their seams (M3 at R6→R7 Phase-1/Phase-2; M5 at its subsystem seam), like M2a/M2b. Smaller verifiable milestones.
- **D-Q-idle-combat = FULL AUTO with a self-recovering loss loop.** Auto-resolve fights everything; a LOSS forces a retreat (keep HP/loot per retreat semantics); a 0-HP loss forces the MC to travel to a safe place (home or elsewhere) and REST to recover (a time cost). No death-spiral, no hard stall — losses self-correct via forced rest. Resolves the unattended-combat-policy + active-combat questions. (Combat math: §4.6 needs the 0-HP→forced-rest transition + the retreat-on-loss rule specified.)

## Batch 5 — economy / combat math
- **D-Q-estate-dent = make Estate pillar value PURELY DERIVED (= land+treasury+trade sum, never stored).** A dent on a strand can't desync; trade-≤⅓ holds by construction. Schema refactor: drop the stored Estate `value` (§6.4/§2.x), compute on read. Resolves the dent×trade blocker.
- **D-Q-winrate = ANALYTIC win-probability from the combat formula** (NOT sampling). The win-rate bands are COMPUTED from attackPower/defense math → deterministic by construction; no seed-set/N needed. Consequence: the §4.6 combat formula must be clean enough to compute expected win-rate in closed form (drives the combat-math cleanup).
- **D-Q-craft+coin = fix the §4.7.2 quality formula (proper 0–1 score, no spurious divisor) + coin = a REAL T1+ sink** (market purchases / component-buying). Both load-bearing.
- **D-Q-seasonal-rotation (Q22) = AUTHOR the seasonal-reward rotation** (per-season featured deed/bonus) as the 2nd T2 anti-slump lever alongside combos. Fulfills signed Q22.

## Batch 6 — narrative / legibility
- **D-Q-Oyuki = keep MC son-return; REWORK the Jinpachi/husband beat** so it's NOT a second resurrection (known-alive-but-estranged / long-dead-and-mourned / different relation). Avoids two resurrections on one mother.
- **D-Q-gender-drift = grounded VILLAGE RATIONALIZATION** — the belief bends gender via a concrete in-world mechanism (years passed; kami 'changed' the child; ambiguous early memory) so man-as-returned-Tama is diegetically believable; 'truth wholly human' holds. Tighten §1.4's 'fair clue'.
- **D-Q-name-collision (Q12) = RENAME** the lord and/or drillmaster to break the Yagyū Munenori + Jūbei echo (per Q39 fictionalised-name discipline). Grounded, not cosplay.
- **D-Q-codex (Q9) = contextual TOOLTIPS only** (no dedicated codex); explain each system inline via tooltip/first-reveal copy as it unlocks. Relies on strong staggered onboarding.

## Batch 7 — determinism / perf / pacing / combat depth
- **D-Q-numeric (Q16+Q17) = fixed reduction order + 53-bit-safe RNG.** Pin one canonical left-to-right integer accumulation for pow (unit-asserted); store RNG state as BigInt OR use a 53-bit-safe splitmix variant so cursor arithmetic is exact in JS number. Byte-identical replay.
- **D-Q-perf (Q15) = set interim budgets + an M6 perf-GATE** (save-envelope ≤~64KB, log-node ≤ ring cap, tick-loop allocation, long-run memory ceiling) — perf becomes a build-failing gate like pacing/fun.
- **D-Q-first-session (Q10) = FRONT-LOAD a taste of variety before R3** (a small combat/variety beat or extra loop in the first hour, without the full combat UI). Protects first-session retention.
- **D-Q-active-combat = LIGHT ACTIVE LAYER** — auto-resolve stays the spine; stance + timed ability/item interventions are optional mid-fight (for engaged players + hard fights); specify their effects in §4.6.
- (Q4 floor-enforcement: RESOLVED by D-Q2 — the rung-meter threshold IS the runtime enforcement; back-solved so focused-optimal play needs ≥30 min.)

## Batch 8 — final edges
- **D-Q-meibutsu (Q20) = EXCLUDE combo credit from the trade ratio.** The Estate×Name meibutsu combo credits the pillars (Model-A) but its bonus does NOT count toward the trade sub-engine / the ≤⅓ denominator — can't bend the cap. Consistent with the B5 gate-eligible-exclusion model.
- **D-Q-banzuke = author LIGHT rival stats** for the named houses (Tomita/Akagi + a few domain houses) so the G7 overtake is computed/real, not scripted. Not a full sim.
- **D-Q-otsuru-locale = SEPARATE the threads across locales** — move one of {Tahei's family, Otsuru/Tama} to a different T2 node so they don't both land in Sawatari-juku. Needs a 2nd authored T2 locale (authenticity spread > narrative economy).
- **D-Q-Q43/Q49 = UNSURE, leave a note to check** — verify against history whether Q43/Q49 were real dropped decisions or numbering gaps before finalizing V2.1. (Citations already struck; flag as an open provenance to-do.)

## Trivial items I'll just apply (no human pick needed)
- §4.6.3/§4.6.4 crit/block ordering: clamp FINAL post-mitigation damage to DAMAGE_FLOOR.
- 'the Kurosawa works' Anglicism → period gloss (×2) + authenticity watch-list.
- autosave tick-interval trigger → add to M0 DoD + smoke assert.
- gatesSpine: assert always-false in v1 (content verifier).
- §5 T2.1 Otsuru superlative vs §1.4 'side thread' prose harmonize.
- §4.2.2 phase-reconciliation prose: now consistent with D-Q3 (Name gated) + the great/excellent supply — reword the season-1-Δ note + the 'gates no v1 tier' line.


### Block N.1 — set-aside questions, recorded with a Claude-proposed default

> These surfaced in the battery but were NOT put to the human in the 8 Q&A batches (mostly dedup/fold casualties).
> Each carries a **Claude-proposed default** so it's visible, not buried. **Status: ✅ APPLIED in PRD V2.2**
> (commit `2b8d5e9`) — the proposed defaults stand unless the human reopens them.

1. **Enemy combat model** (round 5; needed by the analytic-win-rate decision). §4.6 derives the MC fully but has
   **no enemy-stat rule**. 🟡 **Proposed:** author an explicit `MobDef.level → {attackPower, defense, HP}` derivation
   in §4.6 (same curve family as the MC's), so the analytic win-rate (D-Q-winrate) is computable in closed form.
2. **Mobile / touch support** (round 4 ×2). 🟡 **Proposed:** v1 is **desktop-first**; mobile = best-effort responsive,
   **not a v1 target** (touch targets meet the a11y minimum, but no dedicated mobile layout / no mobile leave-and-return
   story). Revisit as a post-v1 pass. Consistent with the tight-v1-scope posture (multi-tab also unsupported).
3. **Physician "Ranpo"** (round 2; same class as the renamed Munenori/Jūbei). 🟡 **Proposed:** **rename** — the
   debunker-physician reads as Edogawa Ranpo; give him an original name per the Q39 fictionalised-name discipline
   (sweep all occurrences + add to the §6.6 denylist).
4. **G2 "Tahei…?" spoken aloud** (round 2). The spine-guaranteed G2 event-log line speaks the true name, spoiling the
   **missable O5** name-reclaim. 🟡 **Proposed:** soften the G2 line so the true name does **not** surface ("a name
   almost comes…"); the G6 Otsuru/Tama TRUTH still fires for everyone, but the **name** stays gated to the missable O5.
5. **Save redundancy under itch's iframe partition** (rounds 2 & 4). The 3-backend redundancy is **not** failure-
   independent inside one cross-origin iframe partition. 🟡 **Proposed:** document honestly that in the itch iframe the
   3 backends may share one partition (redundancy degrades to ~1 effective there); the **crash-recovery last-known-good
   ring + export/import** are the real durability guarantee. Drop any unqualified "3× redundant" claim in that context.
   (Folds with B7/B9/B12.)
6. **Repeating "upstream-flood" motif** (round 2, narrative polish). The MC's near-death, the estate's founding debt,
   and the house's root-sin are **all** upstream-embankment floods. 🟡 **Proposed:** re-skin at least one to a different
   disaster (fire / landslide / crop-failure / epidemic) so the water-motif doesn't feel repetitive.
7. **O5 name-reclaim signposting** (round 4, lower). 🟡 **Proposed:** add a soft, non-spoiler signpost that the Origin
   track has a missable capstone, so a completionist isn't blindsided — without revealing what it is.

**Truly-minor items folded into the trivial-fix pass (no decision needed):** character-`level` store-vs-derive →
derive (like season/year); R3 durability → use the graded bands as already specified; the M6 fun-proxy "blank"
thresholds → fill from the tier-relative reward cadence (T0~5/T1~8/T2~13) + the pacing/perf gates; returning-player
re-orientation → covered by the contextual-tooltips decision + reveal-on-load; Phase-2 anti-undershoot → extend the
M6 pacing gate to cover the Phase-2 window, not just the Phase-1 rungs.

---

*Last updated: 2026-06-27. Blocks N + N.1 are ✅ APPLIED to [`prd.md`](../../../docs/living/prd.md) in PRD V2.2 (commit `2b8d5e9`); the
M0+M1+M2a+M2b playable demo is built & verify-green (51 tests) and play-tested. Keep appending as the human steers.*
