# PRD — Human Feedback & Decisions Log

**What this is.** A consolidated, chronological-and-thematic record of **every piece of concrete
steering, guidance, and QA answer the human (Jake) has given** while we built the PRD. It exists so the
whole project — the [PRD](prd.md), the [journals](../journal/), the [ADRs](history/decisions.md), and the
[canon](../brainstorms/2026-06-25-locked-decisions.md) — can be **audited against the human's actual
intent**, not just against what the docs happen to say.

**How to use it.** Each entry is a piece of human direction + (where useful) where it landed. When auditing,
read an entry and confirm the PRD/canon/ADRs still honour it. If the docs and this file disagree, **this file
is the record of intent** — fix the docs (or flag a deliberate, agreed change).

**Sources.** The live conversation (verbatim human messages + every `AskUserQuestion` answer), the journals,
the canon (`brainstorms/2026-06-25-locked-decisions.md`), and the ADR log (`docs/history/decisions.md`).
**Legend:** ✅ implemented · 🔄 in progress · ⏳ queued · 🔁 reversed/superseded.

> **Maintenance rule:** append new human feedback here as it arrives (newest within each section at the
> bottom), the same way the journal is kept. This is a living audit doc.

---

## A. Foundational vision & hard constraints

- **A1. Build the game in README, ship it.** "Build the incremental RPG as outlined in README.md… deploy and
  upload to **itch.io**." Check the README + the two inspirations for the style of web RPG. ✅ (scope/deploy →
  §7, [D-013](history/decisions.md), [D-017](history/decisions.md)).
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
  into `docs/prd.md` first?" → commit dependencies before fanning out. ✅
- **B9. Single PRD, clean docs.** "**Merge all sections into a single PRD** and clean up the docs folder." ✅
  (one `docs/prd.md`; scratch `docs/prd-sections/` deleted after each merge).
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
  gear. **No labour→combat cross-feed** (attributes do double duty; labour *skills* never feed combat
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
- **H2. §5 authenticity pass kept deferred** (Standing & Office kanji + martial/office titles → a later
  focused pass). ⏳
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

- **J1.** §3.4 (T1) reframe — **in progress** (workflow `w82yterx8`); awaits human review of the result.
- **J2.** §3.6 (T2) reframe + Origin-as-rep-track + Tomita/Akagi development — **queued**.
- **J3.** §3.5 (nav track) and §3.7 (T3/T4 sketch) — **not yet reviewed** by the human.
- **J4.** §5 authenticity pass (kanji + period titles) — **deferred** to a later focused pass.
- **J5.** The estate-rep arc labels for **T3 and T4** (continuing stranger→friendly→trusted→honorary→…) — not
  yet named.
- **J6.** Whole-project audit (the reason for this doc) — **pending** once §3 review completes.

---

*Last updated: 2026-06-25. Keep appending as the human steers.*
