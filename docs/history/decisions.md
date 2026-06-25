# Decision Log (ADRs)

Append-only record of **locked decisions** and *why*. One entry per decision, numbered `D-000…`,
**IDs never reused**.

**Status:** ✅ Decided · 🛠 In design · ⏭ Deferred

**Reversing a decision:** don't delete it. Mark the old entry `⛔ REVERSED by D-XXX ({date})`, strike
its claim with `~~strikethrough~~`, and add a new ADR with the new call. History stays intact.

> Resolved [`human-in-the-loop`](../../human-in-the-loop/decisions.md) `H`-items graduate into ADRs here.

---

## Template (copy for each new decision)

### D-0XX ✅ — {short title}
- **Context:** {the forces at play — what made this worth recording}
- **Options:** {A / B / C, each in a phrase}
- **Decision:** {what we chose}
- **Why:** {the deciding rationale}
- **Consequences:** {what this commits us to; follow-on work it spawns}

---

<!-- Real entries below, newest at the bottom. -->

### D-001 ✅ — Grounded, non-magical story; mundane cause for the amnesia
- **Context:** The README seeds an Edo-era incremental RPG where a 17-year-old farmhand wakes amnesiac on a samurai estate. An early AI-generated design leaned magical (a tengu spirited the protagonist away; an otherworld trained/altered them). The human rejected this.
- **Options:** (A) Magical/folkloric truth (tengu, spirits) · (B) Soft isekai / reincarnation · (C) Fully grounded, mundane human truth.
- **Decision:** **(C)** The protagonist's amnesia and the whole mystery have ordinary, human causes (blunt head trauma + near-drowning + exposure from a flood). No tengu, spirits, reincarnation, isekai, or magic anywhere in the canon.
- **Why:** The human wants a grounded story; magic undercuts the intended tone and the earned-competence fantasy (D-003).
- **Consequences:** Every mystery must resolve to a human/natural cause. Story bible is the grounded spine in [`brainstorms/2026-06-25-grounded-story-spine.md`](../../brainstorms/2026-06-25-grounded-story-spine.md). The original magical framing is archived as superseded.

### D-002 ✅ — Pure Edo folk-mystery tone; folklore as believed-atmosphere only
- **Context:** The setting is rich in folklore (kamikakushi, yokai, kami). We need a rule for how it appears given D-001.
- **Options:** (A) Folklore literally real · (B) Folklore as belief/atmosphere with human causes · (C) No folklore at all.
- **Decision:** **(B)** Folklore appears only as what people *believe and fear* (superstition, rumor, ritual). Every folk-belief resolves one-to-one to a human/natural cause (a "kappa ford" is an undertow + a smugglers' sinking-spot, etc.). A thin margin of unresolved *ambiguity* is allowed for unease, but never confirmed magic and **never magic powers for the player**.
- **Why:** Keeps the world authentic and respectful (folklore as grief-coping/cover) while honoring D-001.
- **Consequences:** Maintain a belief→cause table for every yokai; debunk with dawning dread, not gotchas; cap residual ambiguity (≤1 unresolved token per playthrough) and keep it mundane-readable.

### D-003 ✅ — Mediocre-start protagonist; growth only through perseverance
- **Context:** A core character-fantasy decision. The early design implied the protagonist was secretly capable (combat skill from otherworld training).
- **Options:** (A) Secret talent / hidden power / bloodline · (B) Genuinely ordinary, gets strong only through effort.
- **Decision:** **(B)** The protagonist starts as a normal, average, even mediocre 17-year-old farmhand with **no hidden power, talent, or training**. All growth comes from perseverance, repetition, training, and refusing to quit. The first real fight is humbling/near-fatal and motivates training.
- **Why:** The zero-to-competent-through-effort arc *is* the core fantasy, and it maps perfectly onto the incremental grind (every number is earned sweat).
- **Consequences:** **Systems guardrail:** no returning memory or instinctive habit ever grants a starting stat, recipe, or combat bonus — every number starts at the bottom. Combat capacity is gated behind labor-built conditioning. The talent-foil antagonist (Hanzaki) must be shown as *trained*, not innately gifted, so the "effort > talent" thesis is never undercut.

### D-004 ⛔ REVERSED by D-007 (2026-06-25) — One grounded diegetic late-game reset (no magical prestige)
- **Context:** Incremental games use prestige/resets for a long tail; we need one that fits a grounded single-player story.
- **Options:** (A) No reset (linear ending) · (B) One diegetic, grounded reset carrying meta-progress · (C) Classic repeatable magical/abstract prestige loop.
- **Decision:** ~~**(B)** A single, grounded, story-justified reset late-game — a season-cycle time-skip in which the veteran protagonist starts a bigger venture (re-founding the drowned hamlet / accepting estate stewardship and teaching others). It carries hard-won skill, reputation, recipes, tools, and relationships forward as meta-progress and a teaching/management layer. **Not** reincarnation or a magic time-loop.~~ **REVERSED:** the game now has **no reset of any kind** — the five estate-restoration **tiers (T0–T4) replace prestige** and everything persists. See **D-007**.
- **Why:** ~~Gives the genre's long-tail loop without betraying the grounded, no-magic canon; makes "effort over talent" literally generational.~~ The tiered estate-rise spine supplies the long tail diegetically without a soft-restart; a reset (even meta-carrying) would re-cost earned progress and clash with the persistent house-restoration arc.
- **Consequences:** ~~Save schema must carry meta-progress across the reset. Pick one canonical-default branch (recommend re-founding Kuzuhara) with identical carry-over so neither branch reads as lesser.~~ No reset code-path or reset save-schema; progression is the per-tier ladder of D-007.

### D-005 ✅ — Working title: *Kamikakushi*
- **Context:** Need a working title for the repo/build; revisitable before launch.
- **Options:** *Kamikakushi* · *Mizuho* · *The Borrowed Year* · defer.
- **Decision:** **Kamikakushi** (神隠し, "spirited away") — the *village's superstition* for the protagonist's arrival; the truth is mundane and human.
- **Why:** Folklore-accurate, evocative of the core mystery, and thematically ironic (the comforting lie the story dismantles).
- **Consequences:** Low-stakes/reversible; finalize before the itch.io deploy.

### D-006 ✅ — Protagonist identity: true name *Tahei*; male; fixed (no rename)
- **Context:** PRD §1 left the protagonist's true name and customization open. The synthesis used "Ren" (flagged by the authenticity pass as faintly modern for an Edo peasant). The legend's gender-drift clue — the village misremembers the real lost child (Tama, a girl) as a boy — depends on the protagonist's gender.
- **Options:** Name: *Tahei* / *Ren* / *Kichizō* / *Sutekichi*. Customization: fixed name · player picks true name · player picks name + gender.
- **Decision:** True name **Tahei** (a plain, period-typical commoner name), revealed in **Act 4**; the borrowed village-name **"Tama"** is used until then; the protagonist is **male with a fixed name — no player rename**.
- **Why:** *Tahei* reads grounded and humble for a poor porter (Ren felt modern). A fixed gender protects the load-bearing gender-drift clue; a fixed name keeps the late-reveal beat authored and impactful.
- **Consequences:** Dialogue/story is authored around the "Tama" → "Tahei" reveal; no name/gender customization UI. The brainstorms story-spine doc drafted the placeholder "Ren" — read it as "Tahei".
- **Amendment (2026-06-25):** Identity is now a **side thread**, not a load-bearing act-spine beat. Kept: fixed **male**, **no rename**, true name **Tahei**. Changed: the true-name reveal is a **late, de-emphasised side beat** (no longer an "Act 4" climax), and the protagonist age band is **~18–20** (was "17"). The estate-restoration spine (D-007), not the identity mystery, carries the late game.

### D-007 ✅ — Estate-restoration spine + five tiers replace prestige (no reset)
- **Context:** D-004 had committed to a diegetic late-game reset for the incremental long tail. The session-02 lock reframed the whole game around restoring a lower-samurai house, which supplies the long tail without a soft-restart.
- **Options:** (A) Keep the diegetic reset (D-004) · (B) Tiered estate-restoration spine with everything persistent · (C) Classic abstract prestige loop.
- **Decision:** **(B)** The spine is an **estate-restoration incremental RPG**: rise the **Kurosawa** lower-samurai (*goshi*) house's ranks and grow House Influence to restore **and surpass** the house, climaxing in indirect/mediated recognition at Edo. Progression runs through **five tiers** — **T0 Estate** (tutorial) → **T1 Village** → **T2 Region** → **T3 Domain/Castle-town** → **T4 Edo** (national) — each gated by a **story transition**: T0→T1 = enough estate work + basic repairs → sent out into the village; T1→T2 = "clean your room" (estate healthy, village happy, fires out) → lord believes wider impact is possible → grow regional influence (Region introduces rival houses to surpass); T2→T3 = win the region (rivals dethroned) → castle-town rulers confer regional leadership and invite the house; T3→T4 = a "taste of Edo" — house forced to build & fund an Edo estate → conquer the castle-town → national tier. **Tiers REPLACE prestige; there is NO reset of any kind — everything persists.**
- **Why:** The tiered rise gives the genre's depth diegetically, keeps every earned number permanent, and lets "effort over talent" play out as a continuous restoration arc rather than a re-cost.
- **Consequences:** Reverses **D-004**. Save schema is monotonic/persistent (no reset path). Castle-town takeover is multi-route (peaceful office/economy/marriage/out-maneuvering AND assertive martial-security), and "take over" = become the dominant house holding key domain offices — never open rebellion against the bakufu.

### D-008 ✅ — Three starter factions + four-pillar House Influence with per-tier required-pillar gating
- **Context:** Need a faction structure and a macro-resource that drives tier progression without letting any single sub-engine (especially trade) dominate.
- **Options:** Influence as one pooled number · trade-led economy · **multi-pillar achievement resource**; factions as one estate org vs. several parallel tracks.
- **Decision:** **Three starter factions (T0–T2):** **Estate** (the Kurosawa household — a **fresh rank ladder per tier**, rungs interleaving labour & combat, cast & buildings grow per tier as light flavour systems, not a people-management sim) · **Village of Asagiri** (a reputation **web**: chief Yagoemon, shops, artisans, inn & rumours board; mostly static; never gates the spine) · **Origin** (a memory-gated **support** track — see D-009). The macro-resource is **House Influence (家威)** as **FOUR achievement-driven pillars**: **Arms (武威)** · **Estate & Wealth (家産)** · **Standing & Office (政威)** · **Name & Honour (家格)**. **Trade is demoted to 1-of-3 capped sub-engines** inside Estate & Wealth (land / treasury / trade), **hard-capped to ~⅓ of that one pillar**. **Accrual = achievement JUMPS + seasonal JUDGED RESULTS** (harvest, seasonal appraisal) — never a passive time-trickle, never a flat per-action increment. **Up-only with rare, scripted, recoverable dents** (scandal/called debt) — **never a wipe**. **Tier gating = per-tier required pillars** (early tiers weight Arms + Estate; upper tiers weight Office + Name). Side factions are **multipliers** into the pillars, never new pillars.
- **Why:** Multiple pillars force a portfolio play (you can't trade your way to Edo), achievement-driven accrual keeps Influence feeling earned rather than idle, and per-tier required pillars shape the difficulty curve from "survive & get strong" to "win it socially."
- **Consequences:** Implement four pillar accumulators with the ⅓ trade cap and a seasonal judging tick; required-pillar thresholds become the data behind the D-007 tier gates; dents are scripted, recoverable events with no permanent loss.

### D-009 ✅ — Origin faction = the protagonist's living family & friends at Sawatari-juku
- **Context:** The origin/family thread needed a concrete cast and a place in the tier structure, and a rule to keep it from short-cutting the grind.
- **Options:** Origin as a backstory flashback only · a mechanically rewarding home-town faction · an **access-only living support track**.
- **Decision:** The Origin faction is Tahei's **living** family and friends in the fictional post-town **Sawatari-juku**: father **Kuranosuke**, mother **Oyuki**, sister **Okimi**, employer **Denbei**, friend **Kanta**, sweetheart **Ohana** (plus the porter guild). It **opens at T2 Region**; the recurring **dream foreshadows it from early game**; they **support** his estate achievements (pride, allies, trade-ties) but the track is **access-only with ZERO mechanical gift** (memory grants access, not power — consistent with D-003).
- **Why:** Gives the personal mystery a warm, grounded payoff that lands at the Region tier without handing the player a power spike, preserving the mediocre-start fantasy.
- **Consequences:** Cast and Sawatari-juku content unlock at T2; the early-game dream is foreshadowing only; no stat/recipe/combat bonus flows from the Origin faction — only narrative access and faction-as-multiplier flavour.

### D-010 ✅ — Indirect/mediated Edo ceiling: the national banzuke ranks the house, not the man
- **Context:** The Edo finale needed a ceiling that fits a grounded lower-samurai story — no fantasy ascension for the protagonist personally.
- **Options:** (A) Personal rise to hatamoto/shogun proximity · (B) **Indirect/mediated recognition of the house** · (C) No national tier.
- **Decision:** **(B, reaffirmed in the new tier context)** The Edo finale is a **national multi-pillar *banzuke* ranking of the HOUSE** across all four pillars. The MC remains the **architect** of the house's rise; there is **no personal hatamoto/shogun ascension**. This restates and keeps the prior D-010 intent — reconciled, not duplicated.
- **Why:** Keeps the story historically grounded and thematically about the house's restoration rather than a personal power fantasy; the banzuke framing makes the four pillars legible as the finale scoreboard.
- **Consequences:** The T4 endgame UI is a house banzuke on the four pillars; no personal-rank ascension mechanic; trade is a supporting thread, out of the finale spine.

### D-011 ✅ — Combat is a first-class pillar that earns House Influence
- **Context:** Earlier framing held "combat is never a source of standing." The locked design makes combat a core pillar that feeds the Arms pillar via martial security.
- **Options:** Combat as flavour with no standing · combat as a parallel-but-isolated track · **combat as a first-class earner of Influence**.
- **Decision:** Combat is a **first-class core pillar that EARNS House Influence** through the **Arms (武威)** pillar / martial security (clear bandits, secure roads, defend the estate) — this **supersedes the old "combat is never a source of standing" framing.** The **mediocre-start is preserved on the combat track** (start weak; humbling first fight; earned via training; no hidden edge; no labour→combat cross-feed). **Failure = soft setback** (lose HP/time, maybe drop carried loot or take an injury to rest off) — never lose levels/gear/permanent progress. **Mobs are grounded** (boars, wolves, monkeys, bandits, ronin, smugglers) — **NO belief-creatures in grindable spawn tables**; any "yokai" is a misread human/animal surfaced through optional rumour quests. Martial scale is hard-capped (a small retinue, never a standing army).
- **Why:** Combat is too central to be standing-neutral; routing it through the Arms pillar makes martial security a legitimate, balanced path to House Influence while honouring the grounded, mediocre-start, no-magic canon.
- **Consequences:** Arms-pillar accrual hooks into combat achievements; spawn tables exclude belief-creatures; loss is a soft setback only; combat conditioning is earned independently of labour.

### D-012 ✅ — Structure & scope: fresh ladder per tier, full maps every tier, v1 = Tiers 0–2
- **Context:** Need to pin the progression structure and a shippable v1 cut without over-scoping.
- **Options:** One ladder across all tiers vs. **a fresh ladder per tier**; partial vs. full maps; ship all tiers vs. **a T0–T2 v1**.
- **Decision:** A **fresh rank ladder per tier**; **full explorable maps at every tier**. **v1 = Tiers 0–2 complete** (Estate + Village + Region, incl. the T2 personal-mystery payoff); **T3 Castle-town = a stub cliff-hanger**; **T4 Edo = roadmap.** **Lean within** each tier: ~8-rung early ladder, ~5 mobs, ~4 quest types, a ~6–8-node world cut-set (rest parked as "later").
- **Why:** A per-tier ladder keeps each tier a fresh climb (matching the fractal-incrementality goal); full maps make every tier feel real; the T0–T2 cut is the smallest slice that delivers the spine plus a satisfying payoff.
- **Consequences:** Build ladder/map/mob/quest data per tier; T3/T4 are scaffolded but not content-complete in v1; integration applies the locked-rule fixes (no belief-creatures in spawn tables, ≤1 ambiguity, no permanent loss, no labour→combat cross-feed, fictionalise real names, cap martial scale).

### D-013 ✅ — Tech & presentation: Vite + TS + Vitest, pure-core, IndexedDB save, active-only, static itch.io
- **Context:** Need to lock the stack, save strategy, time model, and presentation for a static, backend-free single-player browser game.
- **Options:** Framework vs. vanilla; localStorage vs. IndexedDB save; offline progress vs. active-only; hover-rich desktop vs. responsive desktop+mobile.
- **Decision:** **Vite + TypeScript + Vitest.** Architecture = **pure-core (no DOM/canvas imports) + a thin DOM renderer consuming plain data + one seeded RNG** (persisted). **Static build for itch.io** (no backend). **Save = IndexedDB** (robust, durable, static-friendly) **+ base64 export/import to file**, **single autosave**, **versioned minimal-state** (recompute derived on load). **Responsive desktop + mobile, NOT hover-dependent.** **Active-only — NO offline progress**; an **abstract clock advanced by active play** (days/seasons drive harvest/weather/festivals + the seasonal Influence results). **Art = text + emoji + CSS** (woodblock palette, kanji season tags, colour-coded rarities). **Multi-screen UI with screens/nav progressively revealed.** **Launch = free / pay-what-you-want on itch.io.**
- **Why:** The pure-core boundary keeps logic deterministic and unit-testable (the project's top architectural rule); IndexedDB + export survives a static host without a backend; active-only keeps the clock honest and the balance tractable; the text/emoji/CSS art keeps scope lean.
- **Consequences:** Enforce the no-DOM-in-core boundary; persist the seeded RNG and a versioned minimal save; build a save-migration path; the renderer is swappable; no offline-progress accounting; one tuned difficulty (no modes).

### D-014 ✅ — One antagonist per tier (not a single cross-tier racket)
- **Context:** Earlier world-building leaned on a single cross-tier smuggling/racket conspiracy. The locked design wants an escalating, grounded antagonist scaled to each tier.
- **Options:** (A) One cross-tier conspiracy throughout · (B) **One antagonist per tier, escalating** · (C) No recurring antagonist.
- **Decision:** **(B)** **ONE antagonist per tier** (Estate / Village / Region / Castle-town / Edo), each **escalating, grounded, and revealed incrementally** (the world-expansion cast — Magobei / Hanzaki / Kuroiwa / rival house **Tomita** / an Edo factor — is repurposed across tiers, with at most a light optional connective thread). The **estate's decline is a simpler debt/misfortune, NOT conspiracy-linked.** **Two rival samurai houses** contest the Region (Tomita + one more). **Justice is partial:** the *osso* over-the-head petition (historically deadly) — an **ally / *gimin*-martyr NPC bears the risk**; reachable culprits answer, the truly powerful largely escape.
- **Why:** A per-tier antagonist scales tension with the player's growing reach and avoids a single conspiracy straining credibility across five tiers; partial justice keeps the tone grounded and bittersweet.
- **Consequences:** Author five tier antagonists with incremental reveals; keep the estate-decline cause mundane and unlinked to the racket; model the osso risk as falling on a gimin ally; any cross-tier thread stays light and optional.

### D-015 ✅ — Core-loop & content discipline: the MC's own actions; no people-management sim; one ending + free-play
- **Context:** Need a rule for what the minute-to-minute game *is*, how quests read, and how to keep scope lean and the ending coherent.
- **Options:** Management/builder sim vs. **classic-RPG self-action loop**; waypointed quests vs. open-ended; multiple endings vs. **one authored ending + free-play**.
- **Decision:** The **core loop = the MC's OWN actions** (combat, skills, jobs, crafting) — meta (Influence/tiers/ranking) sits above and is fed by his grind; **NO people-management sim** (building/recruiting/teaching are flavour/light systems, not a minigame). **Quests are open-ended and NON-hand-holdy** (a suggestion + a story you find in the world, never an A→B→C waypoint list); the dominant minute-to-minute behaviour is the incremental grind. **Fractal incrementality** — every new zone/area/faction/skill/rumour is itself incremental and *everything unlocks*. **Lean / high-impact** — no fluff or half-features; when scope balloons, **split into "immediate" vs a parked "later"** bucket (park, don't delete). **Relationships are narrative-only** (no dating-sim). **One carefully-tuned difficulty** (no modes). **One authored ending** (house restored & ranked) + **post-game free-play** (no reset); branches are in *how* you got there (allegiance / takeover route), not separate endings.
- **Why:** A self-action RPG loop is the proven incremental core and keeps the player as the protagonist rather than a manager; open-ended quests and fractal incrementality preserve discovery; the lean discipline and single ending keep v1 shippable and coherent.
- **Consequences:** No management-sim subsystems; quests are authored as suggestion+world-story, not waypoint chains; maintain an "immediate vs. later" scope split; one ending with route-flavoured variation; free-play continues after the ending with no reset (consistent with D-007).
