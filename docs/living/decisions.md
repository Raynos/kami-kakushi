# Decision Log (ADRs)

> **A live, append-only ledger** (it grows, so it lives in `docs/living/`, not in a "history" folder).
> **Precedence:** when a living doc and an ADR disagree on *current state*, the **living doc wins** (fix it
> if stale); on *why* a thing is the way it is, the **ADR wins**.

Append-only record of **locked decisions** and *why*. One entry per decision, numbered `ADR-000…`,
**IDs never reused**.

**Status:** ✅ Decided · 🛠 In design · ⏭ Deferred · ⛔ Reversed · 🔁 Amended (a clause superseded; the core decision holds — see the entry's note)

**Dating:** every entry carries a **`- **created_date:** YYYY-MM-DD`** first bullet (the day it was locked).
With newest-steer-wins, the date is what disambiguates which call is current when two ADRs touch the same
ground. *(Dates ADR-001…ADR-074 were backfilled 2026-06-29 from git first-appearance history.)*

**Reversing a decision:** don't delete it. Mark the old entry `⛔ REVERSED by D-XXX ({date})`, strike
its claim with `~~strikethrough~~`, and add a new ADR with the new call. History stays intact.

**Rename ADRs feed the drift tripwire (norm — human, 2026-07-05):** an ADR that renames or retires a
player-visible term (a cast name, a mechanic phrase like "spend koku") also adds its entry to the
`RETIRED` list in [`src/scripts/prd-drift.ts`](../../src/scripts/prd-drift.ts) **in the same commit** —
that list is hand-maintained, and no gate can soundly know a rename happened (audit:
[`2026-07-05-prd-ripple-drift-audit.md`](../../project/audit/reports/2026-07-05-prd-ripple-drift-audit.md)).

> Resolved [`human-in-the-loop`](../../project/human-in-the-loop/decisions.md) `HD`-items graduate into ADRs here.

---

## Template (copy for each new decision)

### D-0XX ✅ — {short title}
- **created_date:** {YYYY-MM-DD — the day the decision was locked}
- **Context:** {the forces at play — what made this worth recording}
- **Options:** {A / B / C, each in a phrase}
- **Decision:** {what we chose}
- **Why:** {the deciding rationale}
- **Consequences:** {what this commits us to; follow-on work it spawns}

---

<!-- Real entries below, newest at the bottom. -->

### ADR-001 ✅ — Grounded, non-magical story; mundane cause for the amnesia
- **created_date:** 2026-06-25
- **Context:** The README seeds an Edo-era incremental RPG where a 17-year-old farmhand wakes amnesiac on a samurai estate. An early AI-generated design leaned magical (a tengu spirited the protagonist away; an otherworld trained/altered them). The human rejected this.
- **Options:** (A) Magical/folkloric truth (tengu, spirits) · (B) Soft isekai / reincarnation · (C) Fully grounded, mundane human truth.
- **Decision:** **(C)** The protagonist's amnesia and the whole mystery have ordinary, human causes (blunt head trauma + near-drowning + exposure from a flood). No tengu, spirits, reincarnation, isekai, or magic anywhere in the canon.
- **Why:** The human wants a grounded story; magic undercuts the intended tone and the earned-competence fantasy (ADR-003).
- **Consequences:** Every mystery must resolve to a human/natural cause. Story bible is the grounded spine in [`brainstorms/2026-06-25-grounded-story-spine.md`](../../project/brainstorms/2026-06-25-grounded-story-spine.md). The original magical framing is archived as superseded.

### ADR-002 ✅ — Pure Edo folk-mystery tone; folklore as believed-atmosphere only
- **created_date:** 2026-06-25
- **Context:** The setting is rich in folklore (kamikakushi, yokai, kami). We need a rule for how it appears given ADR-001.
- **Options:** (A) Folklore literally real · (B) Folklore as belief/atmosphere with human causes · (C) No folklore at all.
- **Decision:** **(B)** Folklore appears only as what people *believe and fear* (superstition, rumor, ritual). Every folk-belief resolves one-to-one to a human/natural cause (a "kappa ford" is an undertow + a smugglers' sinking-spot, etc.). A thin margin of unresolved *ambiguity* is allowed for unease, but never confirmed magic and **never magic powers for the player**.
- **Why:** Keeps the world authentic and respectful (folklore as grief-coping/cover) while honoring ADR-001.
- **Consequences:** Maintain a belief→cause table for every yokai; debunk with dawning dread, not gotchas; cap residual ambiguity (≤1 unresolved token per playthrough) and keep it mundane-readable.

### ADR-003 ✅ — Mediocre-start protagonist; growth only through perseverance
- **created_date:** 2026-06-25
- **Context:** A core character-fantasy decision. The early design implied the protagonist was secretly capable (combat skill from otherworld training).
- **Options:** (A) Secret talent / hidden power / bloodline · (B) Genuinely ordinary, gets strong only through effort.
- **Decision:** **(B)** The protagonist starts as a normal, average, even mediocre 17-year-old farmhand with **no hidden power, talent, or training**. All growth comes from perseverance, repetition, training, and refusing to quit. The first real fight is humbling/near-fatal and motivates training.
- **Why:** The zero-to-competent-through-effort arc *is* the core fantasy, and it maps perfectly onto the incremental grind (every number is earned sweat).
- **Consequences:** **Systems guardrail:** no returning memory or instinctive habit ever grants a starting stat, recipe, or combat bonus — every number starts at the bottom. Combat capacity is gated behind labor-built conditioning. The talent-foil antagonist (Hanzaki) must be shown as *trained*, not innately gifted, so the "effort > talent" thesis is never undercut.

### ADR-004 ⛔ REVERSED by ADR-007 (2026-06-25) — One grounded diegetic late-game reset (no magical prestige)
- **created_date:** 2026-06-25
- **Context:** Incremental games use prestige/resets for a long tail; we need one that fits a grounded single-player story.
- **Options:** (A) No reset (linear ending) · (B) One diegetic, grounded reset carrying meta-progress · (C) Classic repeatable magical/abstract prestige loop.
- **Decision:** ~~**(B)** A single, grounded, story-justified reset late-game — a season-cycle time-skip in which the veteran protagonist starts a bigger venture (re-founding the drowned hamlet / accepting estate stewardship and teaching others). It carries hard-won skill, reputation, recipes, tools, and relationships forward as meta-progress and a teaching/management layer. **Not** reincarnation or a magic time-loop.~~ **REVERSED:** the game now has **no reset of any kind** — the five estate-restoration **tiers (T0–T4) replace prestige** and everything persists. See **ADR-007**.
- **Why:** ~~Gives the genre's long-tail loop without betraying the grounded, no-magic canon; makes "effort over talent" literally generational.~~ The tiered estate-rise spine supplies the long tail diegetically without a soft-restart; a reset (even meta-carrying) would re-cost earned progress and clash with the persistent house-restoration arc.
- **Consequences:** ~~Save schema must carry meta-progress across the reset. Pick one canonical-default branch (recommend re-founding Kuzuhara) with identical carry-over so neither branch reads as lesser.~~ No reset code-path or reset save-schema; progression is the per-tier ladder of ADR-007.

### ADR-005 ✅ — Working title: *Kamikakushi*
- **created_date:** 2026-06-25
- **Context:** Need a working title for the repo/build; revisitable before launch.
- **Options:** *Kamikakushi* · *Mizuho* · *The Borrowed Year* · defer.
- **Decision:** **Kamikakushi** (神隠し, "spirited away") — the *village's superstition* for the protagonist's arrival; the truth is mundane and human.
- **Why:** Folklore-accurate, evocative of the core mystery, and thematically ironic (the comforting lie the story dismantles).
- **Consequences:** Low-stakes/reversible; finalize before the itch.io deploy.

### ADR-006 ✅ — Protagonist identity: true name *Tahei*; male; fixed (no rename)
- **created_date:** 2026-06-25
- **Context:** PRD §1 left the protagonist's true name and customization open. The synthesis used "Ren" (flagged by the authenticity pass as faintly modern for an Edo peasant). The legend's gender-drift clue — the village misremembers the real lost child (Tama, a girl) as a boy — depends on the protagonist's gender.
- **Options:** Name: *Tahei* / *Ren* / *Kichizō* / *Sutekichi*. Customization: fixed name · player picks true name · player picks name + gender.
- **Decision:** True name **Tahei** (a plain, period-typical commoner name), revealed in **Act 4**; the borrowed village-name **"Tama"** is used until then; the protagonist is **male with a fixed name — no player rename**.
- **Why:** *Tahei* reads grounded and humble for a poor porter (Ren felt modern). A fixed gender protects the load-bearing gender-drift clue; a fixed name keeps the late-reveal beat authored and impactful.
- **Consequences:** Dialogue/story is authored around the "Tama" → "Tahei" reveal; no name/gender customization UI. The brainstorms story-spine doc drafted the placeholder "Ren" — read it as "Tahei".
- **Amendment (2026-06-25):** Identity is now a **side thread**, not a load-bearing act-spine beat. Kept: fixed **male**, **no rename**, true name **Tahei**. Changed: the true-name reveal is a **late, de-emphasised side beat** (no longer an "Act 4" climax), and the protagonist age band is **~18–20** (was "17"). The estate-restoration spine (ADR-007), not the identity mystery, carries the late game.

### ADR-007 ✅ — Estate-restoration spine + five tiers replace prestige (no reset)

> 🔁 **Amended 2026-06-28 by [ADR-048].** The "five tiers / T0–T4" enumeration + tier→number map are superseded by
> the **6-tier reshape** (T0 tutorial + T1 full-estate split out; Village/Region/Castle/Edo shift up; v1 = T0→T3).
> The estate-spine-replaces-prestige / no-reset core is unchanged.
- **created_date:** 2026-06-25
- **Context:** ADR-004 had committed to a diegetic late-game reset for the incremental long tail. The session-02 lock reframed the whole game around restoring a lower-samurai house, which supplies the long tail without a soft-restart.
- **Options:** (A) Keep the diegetic reset (ADR-004) · (B) Tiered estate-restoration spine with everything persistent · (C) Classic abstract prestige loop.
- **Decision:** **(B)** The spine is an **estate-restoration incremental RPG**: rise the **Kurosawa** lower-samurai (*goshi*) house's ranks and grow House Influence to restore **and surpass** the house, climaxing in indirect/mediated recognition at Edo. Progression runs through **five tiers** — **T0 Estate** (tutorial) → **T1 Village** → **T2 Region** → **T3 Domain/Castle-town** → **T4 Edo** (national) — each gated by a **story transition**: T0→T1 = enough estate work + basic repairs → sent out into the village; T1→T2 = "clean your room" (estate healthy, village happy, fires out) → lord believes wider impact is possible → grow regional influence (Region introduces rival houses to surpass); T2→T3 = win the region (rivals dethroned) → castle-town rulers confer regional leadership and invite the house; T3→T4 = a "taste of Edo" — house forced to build & fund an Edo estate → conquer the castle-town → national tier. **Tiers REPLACE prestige; there is NO reset of any kind — everything persists.**
- **Why:** The tiered rise gives the genre's depth diegetically, keeps every earned number permanent, and lets "effort over talent" play out as a continuous restoration arc rather than a re-cost.
- **Consequences:** Reverses **ADR-004**. Save schema is monotonic/persistent (no reset path). Castle-town takeover is multi-route (peaceful office/economy/marriage/out-maneuvering AND assertive martial-security), and "take over" = become the dominant house holding key domain offices — never open rebellion against the bakufu.

### ADR-008 ✅ — Three starter factions + four-pillar House Influence with per-tier required-pillar gating

> 🔁 **Amended 2026-06-28 by [ADR-048] (+ ADR-028/ADR-049).** The per-tier *required-pillar-weighting* prose is
> superseded by **one pillar per tier** (Estate→Arms→Office→Name) + the hybrid grade-gate. The four-pillar
> resource, jump+seasonal accrual, and the trade ≤⅓ cap are unchanged.

> 🔁 **Re-scoped 2026-07-02 by [ADR-107].** "House Influence (家威)" is now re-expressed as the
> **koku STANDING** score (a kokudaka-like prestige score, never spent — NOT a currency); the
> **trade ≤⅓** clause survives as a **COIN**-lane cap (the Estate & Wealth land/treasury/trade
> sub-engines yield RICE + COIN, not koku). The four-pillar achievement structure holds.
- **created_date:** 2026-06-25
- **Context:** Need a faction structure and a macro-resource that drives tier progression without letting any single sub-engine (especially trade) dominate.
- **Options:** Influence as one pooled number · trade-led economy · **multi-pillar achievement resource**; factions as one estate org vs. several parallel tracks.
- **Decision:** **Three starter factions (T0–T2):** **Estate** (the Kurosawa household — a **fresh rank ladder per tier**, rungs interleaving labour & combat, cast & buildings grow per tier as light flavour systems, not a people-management sim) · **Village of Asagiri** (a reputation **web**: chief Yagoemon, shops, artisans, inn & rumours board; mostly static; never gates the spine) · **Origin** (a memory-gated **support** track — see ADR-009). The macro-resource is **House Influence (家威)** as **FOUR achievement-driven pillars**: **Arms (武威)** · **Estate & Wealth (家産)** · **Standing & Office (政威 → superseded by 官威 *kan'i* at the §5 authenticity pass, 2026-06-25)** · **Name & Honour (家格)**. **Trade is demoted to 1-of-3 capped sub-engines** inside Estate & Wealth (land / treasury / trade), **hard-capped to ~⅓ of that one pillar**. **Accrual = achievement JUMPS + seasonal JUDGED RESULTS** (harvest, seasonal appraisal) — never a passive time-trickle, never a flat per-action increment. **Up-only with rare, scripted, recoverable dents** (scandal/called debt) — **never a wipe**. **Tier gating = per-tier required pillars** (early tiers weight Arms + Estate; upper tiers weight Office + Name). Side factions are **multipliers** into the pillars, never new pillars.
- **Why:** Multiple pillars force a portfolio play (you can't trade your way to Edo), achievement-driven accrual keeps Influence feeling earned rather than idle, and per-tier required pillars shape the difficulty curve from "survive & get strong" to "win it socially."
- **Consequences:** Implement four pillar accumulators with the ⅓ trade cap and a seasonal judging tick; required-pillar thresholds become the data behind the ADR-007 tier gates; dents are scripted, recoverable events with no permanent loss.

### ADR-009 ✅ — Origin faction = the protagonist's living family & friends at Sawatari-juku

> 🔁 **ADR-048 renumber (2026-06-28):** Region is now **T3** — read "opens at T2 Region" as T3. Access-only/no-power
> + the Region payoff (ADR-055) are unchanged. (Origin is a *faction*, not a pillar — unaffected by the pillar map.)
- **created_date:** 2026-06-25
- **Context:** The origin/family thread needed a concrete cast and a place in the tier structure, and a rule to keep it from short-cutting the grind.
- **Options:** Origin as a backstory flashback only · a mechanically rewarding home-town faction · an **access-only living support track**.
- **Decision:** The Origin faction is Tahei's **living** family and friends in the fictional post-town **Sawatari-juku**: father **Kuranosuke**, mother **Oyuki**, sister **Okimi**, employer **Denbei**, friend **Kanta**, sweetheart **Ohana** (plus the porter guild). It **opens at T2 Region**; the recurring **dream foreshadows it from early game**; they **support** his estate achievements (pride, allies, trade-ties) but the track is **access-only with ZERO mechanical gift** (memory grants access, not power — consistent with ADR-003).
- **Why:** Gives the personal mystery a warm, grounded payoff that lands at the Region tier without handing the player a power spike, preserving the mediocre-start fantasy.
- **Consequences:** Cast and Sawatari-juku content unlock at T2; the early-game dream is foreshadowing only; no stat/recipe/combat bonus flows from the Origin faction — only narrative access and faction-as-multiplier flavour.
- *(Names later refined — decision unchanged: father **Kuranosuke → Jinpachi**; sweetheart **Ohana → Osen** (renamed to disambiguate from lost-child **Otsuru**). See canon / PRD §1.5.3 for current names.)*

### ADR-010 ✅ — Indirect/mediated Edo ceiling: the national banzuke ranks the house, not the man

> 🔁 **ADR-048 renumber (2026-06-28):** Edo is now **T5** (the reshape adds a tier; the *banzuke* finale is T5 Edo,
> beyond v1's T0→T3). The indirect-ceiling decision is unchanged.
- **created_date:** 2026-06-25
- **Context:** The Edo finale needed a ceiling that fits a grounded lower-samurai story — no fantasy ascension for the protagonist personally.
- **Options:** (A) Personal rise to hatamoto/shogun proximity · (B) **Indirect/mediated recognition of the house** · (C) No national tier.
- **Decision:** **(B, reaffirmed in the new tier context)** The Edo finale is a **national multi-pillar *banzuke* ranking of the HOUSE** across all four pillars. The MC remains the **architect** of the house's rise; there is **no personal hatamoto/shogun ascension**. This restates and keeps the prior ADR-010 intent — reconciled, not duplicated.
- **Why:** Keeps the story historically grounded and thematically about the house's restoration rather than a personal power fantasy; the banzuke framing makes the four pillars legible as the finale scoreboard.
- **Consequences:** The T4 endgame UI is a house banzuke on the four pillars; no personal-rank ascension mechanic; trade is a supporting thread, out of the finale spine.

### ADR-011 ✅ — Combat is a first-class pillar that earns House Influence
- **created_date:** 2026-06-25
- **Context:** Earlier framing held "combat is never a source of standing." The locked design makes combat a core pillar that feeds the Arms pillar via martial security.
- **Options:** Combat as flavour with no standing · combat as a parallel-but-isolated track · **combat as a first-class earner of Influence**.
- **Decision:** Combat is a **first-class core pillar that EARNS House Influence** through the **Arms (武威)** pillar / martial security (clear bandits, secure roads, defend the estate) — this **supersedes the old "combat is never a source of standing" framing.** The **mediocre-start is preserved on the combat track** (start weak; humbling first fight; earned via training; no hidden edge; no labour→combat cross-feed). *(no-cross-feed **RELAXED → bounded per-skill capped bonus** by **ADR-022/Q6**.)* **Failure = soft setback** (lose HP/time, maybe drop carried loot or take an injury to rest off) — never lose levels/gear/permanent progress. **Mobs are grounded** (boars, wolves, monkeys, bandits, ronin, smugglers) — **NO belief-creatures in grindable spawn tables**; any "yokai" is a misread human/animal surfaced through optional rumour quests. Martial scale is hard-capped (a small retinue, never a standing army).
- **Why:** Combat is too central to be standing-neutral; routing it through the Arms pillar makes martial security a legitimate, balanced path to House Influence while honouring the grounded, mediocre-start, no-magic canon.
- **Consequences:** Arms-pillar accrual hooks into combat achievements; spawn tables exclude belief-creatures; loss is a soft setback only; combat conditioning is earned independently of labour.

### ADR-012 ✅ — Structure & scope: fresh ladder per tier, full maps every tier, v1 = Tiers 0–2

> 🔁 **Amended by [ADR-048] + [ADR-032].** "v1 = Tiers 0–2" is now **v1 = T0→T3** (ADR-048 re-maps Estate→T0 tutorial
> + T1; Village = T2, Region = T3 — same content, not a scope change); "~4 quest types" is superseded by
> **ADR-032** (no fixed quest budget). Fresh-ladder-per-tier + full-maps-every-tier hold.
- **created_date:** 2026-06-25
- **Context:** Need to pin the progression structure and a shippable v1 cut without over-scoping.
- **Options:** One ladder across all tiers vs. **a fresh ladder per tier**; partial vs. full maps; ship all tiers vs. **a T0–T2 v1**.
- **Decision:** A **fresh rank ladder per tier**; **full explorable maps at every tier**. **v1 = Tiers 0–2 complete** (Estate + Village + Region, incl. the T2 personal-mystery payoff); **T3 Castle-town = a stub cliff-hanger**; **T4 Edo = roadmap.** **Lean within** each tier: ~8-rung early ladder, ~5 mobs, ~4 quest types, a ~6–8-node world cut-set (rest parked as "later").
- **Why:** A per-tier ladder keeps each tier a fresh climb (matching the fractal-incrementality goal); full maps make every tier feel real; the T0–T2 cut is the smallest slice that delivers the spine plus a satisfying payoff.
- **Consequences:** Build ladder/map/mob/quest data per tier; T3/T4 are scaffolded but not content-complete in v1; integration applies the locked-rule fixes (no belief-creatures in spawn tables, ≤1 ambiguity, no permanent loss, no labour→combat cross-feed, fictionalise real names, cap martial scale).

### ADR-013 ✅ — Tech & presentation: Vite + TS + Vitest, pure-core, IndexedDB save, active-only, static itch.io

> 🔁 **Amended.** "single autosave" → multi-backend redundant save (**ADR-030**) + crash-recovery ring (**ADR-044**)
> + dev-save wipe (**ADR-067**); the "no asset pipeline" art claim is refined by **ADR-018/ADR-041** (bundled OFL fonts
> + inline-SVG motifs). Active-only is reaffirmed by **ADR-079** (which corrects ADR-053's wall-time wording to active-only-**pause**). Core stack + pure-core + IndexedDB hold.
- **created_date:** 2026-06-25
- **Context:** Need to lock the stack, save strategy, time model, and presentation for a static, backend-free single-player browser game.
- **Options:** Framework vs. vanilla; localStorage vs. IndexedDB save; offline progress vs. active-only; hover-rich desktop vs. responsive desktop+mobile.
- **Decision:** **Vite + TypeScript + Vitest.** Architecture = **pure-core (no DOM/canvas imports) + a thin DOM renderer consuming plain data + one seeded RNG** (persisted). **Static build for itch.io** (no backend). **Save = IndexedDB** (robust, durable, static-friendly) **+ base64 export/import to file**, **single autosave**, **versioned minimal-state** (recompute derived on load). **Responsive desktop + mobile, NOT hover-dependent.** **Active-only — NO offline progress**; an **abstract clock advanced by active play** (days/seasons drive harvest/weather/festivals + the seasonal Influence results). **Art = text + emoji + CSS** (woodblock palette, kanji season tags, colour-coded rarities). **Multi-screen UI with screens/nav progressively revealed.** **Launch = free / pay-what-you-want on itch.io.**
- **Why:** The pure-core boundary keeps logic deterministic and unit-testable (the project's top architectural rule); IndexedDB + export survives a static host without a backend; active-only keeps the clock honest and the balance tractable; the text/emoji/CSS art keeps scope lean.
- **Consequences:** Enforce the no-DOM-in-core boundary; persist the seeded RNG and a versioned minimal save; build a save-migration path; the renderer is swappable; no offline-progress accounting; one tuned difficulty (no modes).

### ADR-014 ✅ — One antagonist per tier (not a single cross-tier racket)

> 🔁 **ADR-048 renumber (2026-06-28):** the antagonist list is keyed to the old 5-tier ladder — re-map onto the 6
> tiers. The "one grounded antagonist per tier" decision holds.
- **created_date:** 2026-06-25
- **Context:** Earlier world-building leaned on a single cross-tier smuggling/racket conspiracy. The locked design wants an escalating, grounded antagonist scaled to each tier.
- **Options:** (A) One cross-tier conspiracy throughout · (B) **One antagonist per tier, escalating** · (C) No recurring antagonist.
- **Decision:** **(B)** **ONE antagonist per tier** (Estate / Village / Region / Castle-town / Edo), each **escalating, grounded, and revealed incrementally** (the world-expansion cast — Magobei / Hanzaki / Kuroiwa / rival house **Tomita** / an Edo factor — is repurposed across tiers, with at most a light optional connective thread). The **estate's decline is a simpler debt/misfortune, NOT conspiracy-linked.** **Two rival samurai houses** contest the Region (Tomita + one more). **Justice is partial:** the *osso* over-the-head petition (historically deadly) — an **ally / *gimin*-martyr NPC bears the risk**; reachable culprits answer, the truly powerful largely escape.
- **Why:** A per-tier antagonist scales tension with the player's growing reach and avoids a single conspiracy straining credibility across five tiers; partial justice keeps the tone grounded and bittersweet.
- **Consequences:** Author five tier antagonists with incremental reveals; keep the estate-decline cause mundane and unlinked to the racket; model the osso risk as falling on a gimin ally; any cross-tier thread stays light and optional.

### ADR-015 ✅ — Core-loop & content discipline: the MC's own actions; no people-management sim; one ending + free-play
- **created_date:** 2026-06-25
- **Context:** Need a rule for what the minute-to-minute game *is*, how quests read, and how to keep scope lean and the ending coherent.
- **Options:** Management/builder sim vs. **classic-RPG self-action loop**; waypointed quests vs. open-ended; multiple endings vs. **one authored ending + free-play**.
- **Decision:** The **core loop = the MC's OWN actions** (combat, skills, jobs, crafting) — meta (Influence/tiers/ranking) sits above and is fed by his grind; **NO people-management sim** (building/recruiting/teaching are flavour/light systems, not a minigame). **Quests are open-ended and NON-hand-holdy** (a suggestion + a story you find in the world, never an A→B→C waypoint list); the dominant minute-to-minute behaviour is the incremental grind. **Fractal incrementality** — every new zone/area/faction/skill/rumour is itself incremental and *everything unlocks*. **Lean / high-impact** — no fluff or half-features; when scope balloons, **split into "immediate" vs a parked "later"** bucket (park, don't delete). **Relationships are narrative-only** (no dating-sim). **One carefully-tuned difficulty** (no modes). **One authored ending** (house restored & ranked) + **post-game free-play** (no reset); branches are in *how* you got there (allegiance / takeover route), not separate endings.
- **Why:** A self-action RPG loop is the proven incremental core and keeps the player as the protagonist rather than a manager; open-ended quests and fractal incrementality preserve discovery; the lean discipline and single ending keep v1 shippable and coherent.
- **Consequences:** No management-sim subsystems; quests are authored as suggestion+world-story, not waypoint chains; maintain an "immediate vs. later" scope split; one ending with route-flavoured variation; free-play continues after the ending with no reset (consistent with ADR-007).

### D-013a ✅ — §6 tech architecture & data model (elaboration of ADR-013)
- **Context:** ADR-013 fixed the stack; §6 elaborates it into concrete engine contracts, the RNG scheme, and the save/migration model. Recorded as an elaboration (not a reversal) of ADR-013.
- **Options:** Ad-hoc state mutation vs. **explicit reduce/tick contracts**; `Math.random` vs. **one named-substream seeded PRNG**; localStorage vs. **IndexedDB**; full-state save vs. **versioned minimal-state**; stored vs. derived `tier`; best-effort vs. **ordered forward migrations**.
- **Decision:** **Pure core** exposes two pure contracts — **`reduce(state, intent)`** (player actions) and **`tick(state, dt)`** (time advance) — returning new plain-data state the thin renderer consumes. **Content is data** in typed registries (mobs, quests, rungs, recipes, rumours, NPCs) checked at build/test time by a **content-verifier** that machine-enforces canon invariants (no belief-creatures in spawn tables, trade ≤⅓, ≤1 ambiguity, macron/K-M-B lints, cross-ref integrity). **One seeded RNG = splitmix64** (64-bit, seeded once, **persisted**), drawn through **named sub-streams** (combat / loot / seasonal / world-gen) so systems never share or perturb each other's draws — full determinism/replayability. **Save = IndexedDB, single autosave + base64 export/import to file; versioned MINIMAL state** (store only non-derivable values; recompute all derived state — incl. derived pillar values — on load). **`tier` is a STORED committed value** (threshold-progress is derived). **Migrations = an ordered forward chain** (v_n → v_{n+1}) run on load, each writing a **pre-migration raw backup** first; **no cross-major-version rewrite guarantee** (forward-only). A **DEV-only play-API on `window`** drives the game headlessly for capture/playtest.
- **Why:** The reduce/tick contracts make the core deterministic and unit-testable (the project's top rule); named-substream splitmix64 keeps runs reproducible even as systems are added; minimal-state + forward migrations keep saves small and durable on a backend-free static host; a stored `tier` avoids recomputing the spine's position on every load.
- **Consequences:** Enforce the no-DOM-in-core boundary and the reduce/tick signatures; build the content-verifier into `pnpm run verify`; persist RNG seed + stream cursors; write a migration per save-schema bump with a raw backup; the renderer stays swappable; the DEV play-API is stripped from production builds. **🔁 Refined (2026-06-29) by ADR-067:** the forward-migration chain now scopes to *shipped/launch* saves — dev/v0.2 saves are **wiped** at the reshape schema bump (no users yet), and the real `migrate()` path is built + tested **before launch**, not across dev churn. Dev tools (the 2×/4×/8× speed toggle + a jump-to-rung/tier teleport) extend the DEV-only play-API and are likewise stripped from prod.

### ADR-016 ✅ — §4 balance model: human-signed pacing & accrual locks (the shape; numbers are tunable)

> 🔁 **Amended.** The "drop to 1 HP" soft-setback is superseded by **ADR-050** (HP carries + heals by eating);
> "simple per-tier thresholds (no floor/overflow)" by **ADR-028** (hybrid grade-gate); the per-tier hour budget
> uses pre-reshape numbering (re-map per ADR-048). The **signed locked shape** (≥30-min floor, 70/30, trade ≤⅓,
> no-respec, up-only) holds.
- **created_date:** 2026-06-25
- **Context:** §4 turns the design into numbers. The human signed off the *shape* of pacing and accrual (canon §I-bal); the concrete values remain a tunable first pass.
- **Options:** Short (~12–20h) vs. **longer (~32h)** v1; flat vs. **escalating per-tier** budgets; deeds-vs-seasonal split; punchy vs. **steady** deed jumps; respec vs. **no respec**.
- **Decision (LOCKED shape):** **Longer saga** — v1 ≈ **28.5h built** (**T0 ≈ 4.5h · T1 ≈ 8h · T2 ≈ 16h**; "~32h" includes the T3-stub runway/free-play tail), "more grind, more numbers, slower feature reveal." **Per-rank time floor ≈ 30 min** (applies to the grind rungs R1–R7; R0 is the exempt ~5-min cold-open — a human-flagged carve-out). **Simple per-tier required-pillar thresholds (NO floor/overflow).** Accrual = **two shapes only — deed JUMPS + a per-season JUDGED high-water result** — weighted **more from deeds (~70% deeds / ~30% seasonal)**; **deed jumps smaller/steadier** (per-event cap ≈ **0.04** of a tier band, so growth is many small acts); **trade ≤ ⅓ of Estate & Wealth (hard invariant)**; **up-only with minor recoverable dents, never a wipe**. **Combat:** first fight **20–35% win-rate**; **soft-setback-on-loss** (drop to 1 HP + ~½-day + light injury + *possible* carried-loot drop — **never** levels/gear/Influence). **Attributes STR/AGI/INT/SPD/LUCK with NO labour→combat cross-feed.** *(**RELAXED → bounded cross-feed** by **ADR-022/Q6**.)* **No respec in v1.** **Active-only** (auto-producers T3+ only). **K/M/B numbers; ~10× tier magnitude.** **Nav reveal one-tab-at-a-time.** All concrete numbers are **PROPOSED / tunable**; only the shape above is locked. *(🔁 FU18/ADR-022, 2026-06-26: the ~28.5h budget is now a **FLOOR**, not a target/ceiling — the game can be LONGER, a long OSRS-rough grind; §4.8 is a minimum-grind model.)* **Deferred from the v1 balance lock:** Standing & Office kanji (→ §5 authenticity pass) and marriage/adoption-lever numbers (→ T3 authoring).
- **Why:** The longer, escalating budget plus the ≥30-min floor delivers the requested grind without ballooning any single tier; more-from-deeds + small caps keeps growth feeling active and earned; the soft-setback and no-respec rules preserve the mediocre-start, commit-to-your-build fantasy.
- **Consequences:** §4's tables are the data behind the ADR-007 tier gates and ADR-008 pillars; the balance numbers get a dedicated tuning pass against the §4.8 pacing acceptance tests (a pacing regression fails if a headless run clears any grind rung in < ~28 min); the content-verifier enforces the trade-⅓ and no-cross-feed invariants.

### ADR-017 ✅ — v1 execution plan (§7): milestones, deployment, scope-risk posture

> 🔁 **Amended 2026-06-28 by [ADR-048].** "v1 = full T0–T2" is now **v1 = T0→T3** (the same Estate + Village +
> Region content, re-mapped — not a scope change). The non-negotiable full-scope intent is unchanged. (Roadmap
> sequencing now lives in the re-axe proposal, not §7.)
- **created_date:** 2026-06-25
- **Context:** §7 sequences the build and ship. The human reviewed §7's open items and the §4.9 balance dials (2026-06-25).
- **Options:** MS2 combat slice as agent's-call vs. **fixed split**; **pre-planned cut-down (T0–T1)** vs. **no cut**; hosted CI vs. local; automated vs. **manual** deploy.
- **Decision:** **v1 = full T0–T2, NON-NEGOTIABLE — no pre-planned descope** (no T0–T1 cut-down ladder; if ever genuinely blocked, the forward-migratable save lets a later update add tiers, but v1 ships complete T0–T2). **Build order MS0…MS7 with combat as TWO FIXED milestones, M2a / M2b:** MS0 = toolchain (Vite+TS+Vitest, pure-core/renderer split, seeded RNG, `pnpm run verify` + content-verifier, DEV play-API) + the cold open + IndexedDB save; MS1 = T0 labour loop R0→R2; **M2a = combat live at R3 (idle auto-resolve + active setup) + the humbling first fight + soft-setback**; **M2b = bestiary + equipment + the loot→craft gear loop**; MS3 = quests (4 types) + crafting + the four-pillar Influence panel → **T0 complete**; MS4 = T1 Village (rep web, rumours, V0→V7); MS5 = T2 Region (trade backbone, Origin faction, the G6 payoff, G0→G7) → **v1 content complete**; MS6 = balance pass to the §4.8 targets + content-verifier green + T3 stub + polish; MS7 = deploy. Each milestone is a **verify-green vertical slice**. **Deploy = static itch.io** (free / pay-what-you-want, Kind = HTML play-in-browser, relative `base: './'`); **release gate = local `pnpm run verify`** (typecheck + unit tests + content-verifier + K/M/B + macron lints + the §4.8 pacing regression); **manual, human-approved upload** (no hosted CI, no itch CLI / butler automation in v1). **§4.9 balance dials confirmed (now locked values, not ranges):** 70/30 deeds/seasonal · 0.04 per-event cap · front-loaded-then-ramp rung escalation · ~8 seasons/tier · Office ~25× T1→T2 step · side-faction speedup **~10–15%** (supersedes the old "≈halve") · the R0 ≥30-min-floor carve-out **blessed**.
- **Why:** Fixed M2a/M2b de-risks the densest slice without a conditional; refusing a pre-planned cut keeps the build committed to the satisfying T2 payoff; local-verify + manual deploy fits the solo/agentic, backend-free workflow and honours the "outward-facing actions need human approval" rule.
- **Consequences:** Build to MS0…MS7 (with M2a/M2b), each leaving the build verify-green; no descoped fallback is designed; the itch.io upload stays a manual release step; the §4.9 dials are locked values for the balance-tuning pass. Elaborates ADR-013 (tech) and ADR-012/ADR-016 (scope/balance); records §7.
- **Refined (2026-06-26) by ADR-021:** the §7 milestone roadmap is **LIVING**, not frozen canon — **MS0–MS1 committed; MS2–MS7 provisional, re-planned after each playtest** (and, on the docs-explosion, moved to `docs/living/roadmap.md`). This refines only the *provisional HOW*; the **locked v1 content scope — full T0–T2, no pre-planned descope (§7.4.2) — is UNCHANGED.** See **ADR-021**.

### ADR-018 ✅ — UI design language: mid-Edo woodblock/ink, strong CSS, NO asset pipeline

> 🔁 **RETIRED by [ADR-144]** (UI-v2 shipped): the woodblock/ink AESTHETIC is superseded by **Andon Steel**
> (ADR-127) — the enduring parts of this ADR (a strong CSS design-language built to a written bible, the
> agent-driven screenshot-QA loop, the anti-slop posture) carry forward unchanged, and the "no asset
> pipeline" constraint is now STRONGER than ever (the self-hosted fonts retired too — pure system stacks).
> *(Earlier: amended by [ADR-041] — self-hosted OFL fonts + inline-SVG motifs + synthesized/CC0 audio came
> into scope; the fonts have since left it again.)*
- **created_date:** 2026-06-26
- **Context:** §6.9 named "text + emoji + CSS, woodblock palette" but carried no design *vision* — the slop risk the human flagged ("avoid generic AI-slop / placeholder engineer art; want a coherent design language with a vision"). The art ambition was locked at "a strong CSS design-language, no asset pipeline."
- **Options:** improvise UI per-screen · use a generic component library · **lock a design-language bible BEFORE building any UI.**
- **Decision:** Lock a **UI design-language bible** ([`../ui-design.md`](ui-design.md)) as the anti-slop foundation, built **before** the first real UI. Aesthetic = **mid-Edo woodblock / ink-on-paper**: warm *washi* paper + warm *sumi* ink + one disciplined indigo (藍) + a **rare vermilion (朱) hanko seal** as the accent. A tight **8-role named-token palette** (+ the four pillar identities); typography = **Shippori Mincho** (body/heads) + **Yuji Syuku** reserved for two hero beats (rank-up title, seasonal headline) — final pairing **confirmed at MS1**; key-block frames, *bokashi* gradients, paper-grain, the seal motif; the **event log is the visual hero**; **significance-gated motion** (reduced-motion-safe). Everything in **text + emoji + CSS + inline SVG — NO image/asset pipeline.** The **agent is a capable visual reviewer** (Playwright + Chrome-DevTools MCP + the `capture-game-states` skill + its own multimodal vision): it screenshot-QAs **every** screen/transition against the bible and iterates *before* the human sees it; the **human is the higher-level taste arbiter.**
- **Why:** A specific, disciplined aesthetic + agent-driven screenshot-QA against a written bible is the concrete defence against generic UI; pure CSS keeps scope lean and backend-free.
- **Consequences:** Build all UI to the bible (CSS tokens are named + concrete); lock the design language before MS1's first screen; the visual-QA loop ([`../qa-playtesting.md`](../guides/qa-playtesting.md) §4) reviews every state; confirm the font pairing at MS1; the self-hosted kanji glyph-subset must include 官威. Elaborates ADR-013 (presentation).

### ADR-019 ✅ — Fun is a first-class priority; the QA / playtest discipline
- **created_date:** 2026-06-26
- **Context:** A mechanically-correct, story-coherent incremental that isn't **fun** is a failure. The PRD had pacing *targets* but no fun discipline and no way to play-test a 28.5 h game.
- **Options:** build-to-spec and hope · playtest only at the end · **a continuous "fun is a hypothesis tested by play" discipline with instrumentation.**
- **Decision:** Treat **fun as the make-or-break priority**, with the *what/why* in [`../fun-factor.md`](fun-factor.md) (the core fun loops; how to measure/improve/keep-fun-high over 28.5 h; the fun-killers + their PRD guardrails; per-tier watch-points) and the *how* in [`../qa-playtesting.md`](../guides/qa-playtesting.md) (the DEV `window.__qa` harness; a **headless auto-player** to "play" the 28.5 h no human can hand-play; **fun-proxy** measurements — no-dead-time, reward cadence, always-a-visible-next-goal, the first-5-min hook; the screenshot visual-QA loop; the per-milestone sweep + the MS6 polish loop). The no-reset **"fresh climb" = expanding domain + new verbs + reveals + narrative** (delegation/governance is a **T3+** escalation; v1 stays hands-on per ADR-015). The **agent measures the proxies and forms its own read; the human makes the final fun call** (playing the first T0 slice at MS3). Continuous from MS1/MS3, **not** end-loaded.
- **Why:** Fun isn't unit-testable, but its absence is measurable; instrumented proxies + fast play-iteration maximise the signal the agent can give, while the human stays the ultimate judge.
- **Consequences:** Build the `__qa` harness + auto-player + the fun-proxy regression in MS0/MS3; run the fun-proxy suite each build; the MS6 balance pass is telemetry-driven; the human plays the T0 slice (MS3) to judge fun.

### ADR-020 ✅ — Post-freeze docs: freeze prd.md as the vision, explode into living docs, generate-don't-duplicate
- **created_date:** 2026-06-26
- **Context:** `docs/living/prd.md` (~4820 lines) was right for *authoring & review* but is a liability for *building* (hard to keep current). The human confirmed: freeze prd.md as the vision, explode into living docs — but only **after** the PRD is signed off.
- **Options:** keep the single PRD as the working doc · **explode into per-concern living docs + generated tables** · author a full doc suite up front.
- **Decision:** Once the PRD is frozen, **freeze `prd.md` as the vision spec** (read-mostly) and **derive per-concern LIVING docs** (`docs/architecture.md`, `docs/systems/*`, `docs/narrative/*`) plus **GENERATED** content/balance tables (`docs/content/`, via `gen:docs --check`) — **never hand-maintained twice** (the generate-don't-duplicate rule). The ADR log, the journals, and `feedback-human/2026-06-26-prd-human-feedback.md` remain as the history/intent layer. **Hold the explosion until after sign-off** (it is the first step of the build phase). **Refined (2026-06-26) by ADR-021:** sign-off legitimately comes *after* the first **MS0+MS1** build-and-play cycle, so the explosion is held until **then** — it is **not** "the first step of the build phase"; build MS0+MS1 against the current `prd.md`, then reorganise once, on ground that has survived contact with play. "Freeze" is now scoped to **LOCKED INTENT** (§1 vision + the hard constraints + the signed acceptance criteria); the §4 numbers and the §7 MS2–MS7 milestone detail stay **provisional**, and MS2–MS7 are **never** frozen as canon.
- **Why:** Living docs that track the code (some generated) cannot drift; a frozen `prd.md` preserves the agreed vision as the single reference.
- **Consequences:** Do the docs-explosion AFTER the first MS0+MS1 build-and-play cycle (per the ADR-021 refinement), not at the start of the build phase; `gen:docs --check` is part of MS0's `pnpm run verify`; `prd.md` becomes read-mostly once frozen. **🔁 Refined (2026-06-29) by ADR-059:** the §1 vision-freeze (`prd.md` → read-mostly) is now deferred to **end-of-v1**, not the first build-play mark — keep the PRD liquid through T0–T2 (maybe T3), then convert the whole PRD to living docs once v1 is built + play-tested. The living-docs/generated-tables explosion already landed (ADR-046); only the *freeze* moves.

### ADR-021 ✅ — Refine ADR-020: freeze LOCKED INTENT, not the whole PRD (build → playtest → then explode)
- **created_date:** 2026-06-26
- **Context:** ADR-020 locked "freeze `prd.md` as the vision, explode into living docs **after PRD sign-off**." The multi-round battery review ([`../../brainstorms/2026-06-26-prd-battery-review.md`](../../project/brainstorms/2026-06-26-prd-battery-review.md) §P / **PD-1**) showed a hard *whole-PRD* freeze would contradict the steer-by-playtest discipline (canon K3 / **ADR-019** fun-as-hypothesis): the **vision layer had ZERO intent-drift across 97 findings** (it survived adversarial audit — freezable), while **every gap / under-spec / bug clustered in the PLAN layer** (§4 numbers "calls itself frozen but is materially under-specified"; §2 specifics; §7 detail) — exactly what must stay liquid and resolve via play.
- **Options:** (A) hard-freeze the whole PRD at sign-off, then explode · (B) **freeze only LOCKED INTENT, keep provisional implementation liquid, build → playtest → THEN explode** · (C) never freeze / never explode.
- **Decision:** **(B)** The freeze line is **LOCKED INTENT vs PROVISIONAL IMPLEMENTATION.** **FROZEN / locked intent** = §1 vision + the hard human constraints (no-magic · mediocre-start · trade ≤⅓ · active-only · the four pillars · the estate spine) + the human-**SIGNED** acceptance criteria (≥30-min-per-rank floor · 70/30 deeds/seasonal · ~28.5h v1 budget · the tier-gate **TARGETS**) — the destinations. **LIQUID / provisional** = the §4 yields/levers/balance numbers (already tagged "proposed v1 balance" throughout §4, per ADR-016) and the §7 **MS2–MS7** milestone detail that *hit* those targets — the route; the levers move, the locked targets do not. **DO NOT EXPLODE YET:** build **MS0+MS1 against the CURRENT `docs/living/prd.md`**, playtest, **THEN** reorganise once — sign-off legitimately comes *after* the first build-and-play cycle, on ground that has survived contact with play. **On explosion:** the §7 roadmap becomes a **LIVING** `docs/living/roadmap.md` (banner: *"MS0–MS1 committed; MS2–MS7 provisional, re-planned after each playtest"*) and the §4 numbers become **GENERATED** `docs/content/` tables (generate-don't-duplicate — what makes post-playtest re-tuning cheap; the battery rounds kept catching hand-typed derived tables that silently drift). **NEVER freeze MS2–MS7 as locked canon** — that is the mistake rejected, **not** the multi-doc structure. The **v1 SCOPE lock (full T0–T2, "no pre-planned descope", §7.4.2 / ADR-012 / ADR-017) is orthogonal and UNCHANGED** — it locks *what* ships, not the provisional *how*.
- **Why:** A hard whole-PRD freeze would lock the under-specified plan layer that PD-1 proved must resolve via play (K3 / ADR-019); freezing only the destinations while keeping the route liquid lets the build steer by playtest without re-litigating the vision, and generating the derived tables stops hand-typed balance from silently drifting (a repeat battery finding).
- **Consequences:** **REFINES (does not delete) ADR-020**; references **ADR-019** (fun-as-hypothesis) and the battery review **PD-1**. Do NOT create `docs/living/roadmap.md` or `docs/content/` yet — build MS0+MS1 against the current `prd.md` first; defer the docs-explosion to the post-M0/MS1 playtest. When exploded: freeze only §1 + the locked constraints as a **tagged vision snapshot**, roadmap → living, balance → generated. The §4 "proposed v1 balance" numbers and the §7 MS2–MS7 detail stay provisional and re-planned after each playtest; the signed acceptance TARGETS and the T0–T2 scope do not move. *(2026-06-27 update: the first build-play cycle is COMPLETE — MS0/MS1/MS2 demo, verify-green; the docs-explosion trigger has fired. `docs/content/` exists [generated] and `docs/living/roadmap.md` [the living milestone tracker] is created; the §1 vision-freeze + §4-balance-to-generated remain queued. See ADR ADR-046.)* **🔁 Refined (2026-06-29) by ADR-059:** the §1 vision-freeze is moved to **end-of-v1** — keep the PRD liquid through T0–T2 (maybe T3), then convert the whole PRD to living docs once v1 is built + play-tested. ADR-021's freeze-line principle (locked intent vs provisional plan) is unchanged; only *when* §1 crystallizes moves. **🔁 Refined (2026-07-10) by ADR-168:** §1 never crystallizes — the freeze is cancelled outright; the PRD tracks the shipped game.

### ADR-022 ✅ — V2 decisions supersede prior locks; first application: relax the no-labour→combat wall (Q6)
- **created_date:** 2026-06-26
- **Context:** The PRD is being improved V1→V2 via a human Q&A over the 56 battery decisions ([`../../brainstorms/2026-06-26-prd-decisions-master.md`](../../project/brainstorms/2026-06-26-prd-decisions-master.md)). The human set a governing rule and made the first lock-changing call.
- **Decision (governing rule):** the **V1→V2 decision-resolution log is AUTHORITATIVE.** Where a V2 decision conflicts with a prior ADR, the canon, a K-item, or any "locked" constraint, **the V2 decision SUPERSEDES it** — prior decisions are **annotated (not deleted)**, pointing here. (Per ADR-021, the §1 vision + the *signed* acceptance criteria + T0–T2 scope stay locked **unless the human explicitly reopens them** — which they may, as here.)
- **First application — Q6: RELAX the "no labour→combat cross-feed" invariant (supersedes that clause in ADR-011, ADR-016, and feedback D13):** the hard wall becomes a **BOUNDED cross-feed.** **Every skill (labour included) grants a SMALL, CAPPED combat bonus** (per-level or per-milestone ~every 3–5 levels), balanced via differential level-speed + a per-skill level-cap on the combat benefit. **Conditioning** is the labour/combat **capability gate** ("weak → capable"). The **big** combat power (character level + attribute points) stays **combat-sourced ONLY** (Q1) — so there is **no uncapped labour→combat back door**, only a bounded, designed trickle.
- **Why:** the human wants skills to visibly make the MC "more capable" (the mediocre-start *grows*) without labour grinding *dominating* combat — the per-skill cap + the combat-only level/attribute economy bound it.
- **Consequences:** §4.4 / §4.5.3 / §2.7 + canon §D get the bounded-bonus model in the **V2 reshape** (bonus size / cadence / caps are §4 *proposed* numbers, tuned in V2 + playtest per ADR-021); the §6.6 verifier's "no-cross-feed" assertion becomes a "**bounded** cross-feed within caps" assertion. The combat-only character-level/attribute economy (Q1) is the invariant that stays. Future V2 lock-changes are recorded the same way (resolution log + an ADR when load-bearing).
- **Sequencing REFINED (2026-06-26, human-signed):** the design forks are settled into a strong PRD **before** coding. Full loop = **resolve the 56 battery decisions → author PRD V2 → build MS0/MS1 → playtest → resteer → PRD V3 → build → …** (iterative, versioned PRDs). This SUPERSEDES ADR-021's original "build MS0/MS1 FIRST, then resteer" ordering (the human's call: a much stronger spec up front beats learn-by-building). ADR-021's core principle is UNCHANGED — V2/V3 keep §4 numbers + §7 MS2–MS7 **provisional** (freeze = locked intent only), and the docs-explosion still waits (it can land at the V2 authoring step or after the first playtest — TBD).


> **PRD V2 batch (ADR-023…ADR-042, 2026-06-26).** The load-bearing lock/scope changes from the 79-decision Q&A (2026-06-26-prd-human-feedback Blocks L+M), recorded for the V2 reshape. Each is authoritative per ADR-022 (newest-wins). Per-decision detail: the master sheet + v2-followups doc; section impact: brainstorms/2026-06-26-prd-v2-plan.md.

### ADR-023 ✅ — Sequential per-tier progression — Phase 1 (climb rungs) then Phase 2 (estate-influence/pillar grind); pillar DEEDS gated to Phase 2
- **created_date:** 2026-06-26
- **Driven by:** FU7, FU11, Q30, Q7. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **ADR-022**.
### ADR-024 ⛔ SUPERSEDED — The rung-meter accrual law — numeric per-rung-reset meter, threshold = ≥30-min floor × eligible curated-activity rate, AND-gated with story milestones
- **created_date:** 2026-06-26
- **Driven by:** FU6, Q30, Q28. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **ADR-022**.
- **⛔ SUPERSEDED (2026-07-11) by [ADR-182](#adr-182--canon-the-requirements-model-is-the-progression-model-at-every-tier-the-flat-points-rung-meter-is-dead-extends-adr-137)** — via **ADR-137**, extended to all tiers. The flat-points accrual, the threshold table, and the meter-AND-story gate are dead everywhere; a rung promotes when its authored list of objective criteria is 100% done.
### ADR-025 ✅ — Three clean combat tracks de-conflated — character level←combat-XP (HP/attr/satietyMax), Arms pillar←recognised deeds, Combat Rank meter←per-rung curated activities; one defined combat-level curve + per-mob MobDef.level
- **created_date:** 2026-06-26
- **Driven by:** FU14, Q1, Q47, FU15, FU5. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **ADR-022**.
- **🔁 PARTLY SUPERSEDED (2026-07-11) by [ADR-182](#adr-182--canon-the-requirements-model-is-the-progression-model-at-every-tier-the-flat-points-rung-meter-is-dead-extends-adr-137)** — the **three-track de-confliction stands**; only the third track's *mechanism* changes: "Combat Rank **meter** ← per-rung curated activities" becomes **Combat Rank ← that rung's authored list of objective criteria** (ADR-137's requirements model, all tiers). Character-level←combat-XP and Arms←deeds are untouched.
### ADR-026 ✅ — Incremental combat + growing weapon roster + combat-reveal ladder — T0 starts with exactly ONE weapon; +2/+3/+4 per tier (~9-10); R3→R4→R5→weapon-L10→2nd line T1/3rd T2, one reveal per beat

> 🔁 **Stale tier vocab (ADR-048):** the weapon-roster / reveal cadence is keyed to the old 3-tier v1 — re-map onto
> T0→T3 (note the T0 *tutorial* now starts the single-weapon beat). Incremental-combat + one-reveal-per-beat hold.
- **created_date:** 2026-06-26
- **Driven by:** Q15, FU12, FU13, Q17. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **ADR-022**.
### ADR-027 ✅ — Bounded per-skill combat perks — relaxes the absolute no-labour→combat wall to ~2-8 small stackable perks via a separate skillCombatBonus channel, NO global cap; conditioning stays the zero-stat enablement gate; verifier flips ==0 → small-magnitude
- **created_date:** 2026-06-26
- **Driven by:** Q6, FU8, Q28. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **ADR-022**.
### ADR-028 ✅ — Hybrid good/great/excellent tier-gate — replaces simple thresholds: good in ALL revealed pillars, great in 2-3, excellent in 1-2 (T0 2-pillar special), NO overflow; per-pillar-per-tier overhaul vs the fixed deed inventory; trade ≤⅓ survives as the only structural cap

> 🔁 **Amended 2026-06-28 by [ADR-048]/[ADR-049].** The hybrid grade-gate **survives** (now per-N-pillars, opt-in,
> reward-bearing on overshoot), but "good-in-all-pillars / T0 2-pillar special" is reshaped to **one pillar per
> tier** + a tutorial T0. trade ≤⅓ unchanged.
- **created_date:** 2026-06-26
- **Driven by:** Q7, FU10, FU11. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **ADR-022**.
### ADR-029 ✅ — Budget is a FLOOR not a ceiling — a longer OSRS-rough minimum-grind model; active-only with tab-open auto-resolve + auto-repeat ('leave it running'); pacing gate fails on undershoot only
- **created_date:** 2026-06-26
- **Driven by:** FU18, FU23. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **ADR-022**.
### ADR-030 ✅ — Multi-backend redundant save layer — IndexedDB+localStorage+sessionStorage, atomic write, app-identity magic field, monotonic save-counter newest-wins + timestamp tiebreaker (documented core-lint exemption), additive backwards-compatible schema; built full in MS0
- **created_date:** 2026-06-26
- **Driven by:** Q37, FU1, FU2, Q44, Q45, Q46. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **ADR-022**.
### ADR-031 ✅ — Broader cross-pillar combos as the T2 anti-slump — multiple pillar pairs / larger magnitude, computed POST trade-clamp, excluded from the gate-threshold check, verifier-proven never to breach ⅓; paired with seasonal-reward rotation
- **created_date:** 2026-06-26
- **Driven by:** Q22, FU20. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **ADR-022**.
### ADR-032 ✅ — No fixed quest-type budget — supersedes ADR-012's lean-4; PEST/HUNT/CLEAR/DEFEND are the T0 starter set, author whatever quests fit each stage, more/interesting welcome at later tiers
- **created_date:** 2026-06-26
- **Driven by:** Q23. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **ADR-022**.
### ADR-033 ✅ — Estate stage E3 authored in v1 — estate grows E0→E3 ('Prosperous'), folded into the G-rungs as a koku/Arms sink; E4-E5 remain parked
- **created_date:** 2026-06-26
- **Driven by:** Q8. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **ADR-022**. *(🔁 Refined by **ADR-051** → estate stages become yield-bearing; and by **ADR-066** 2026-06-29 → a LINEAR taste in T0, branching into the LAND/TREASURY/TRADE sub-engines at T1.)*
### ADR-034 ✅ — Graded durability bands — 4 bands on weapon attackPower (75+/50+/1+/0 → 1.0/0.9/0.75/0.55), fixed wear per fight, armour bands on defense, repair restores; NEVER auto-unequip / never weaponless
- **created_date:** 2026-06-26
- **Driven by:** Q33, FU17. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **ADR-022**.
### ADR-035 ✅ — Satiety throttles combat — satietyRate multiplier on attackPower (flat above ~0.7 → ~0.5 floor, separate combat coefficient); the locked 20-35% first-fight win-rate re-measured 'at adequate satiety (≥~0.7)'
- **created_date:** 2026-06-26
- **Driven by:** Q31, FU16, Q47. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **ADR-022**.
### ADR-036 ✅ — Name-reclaim split — reclaiming 'Tahei' is Origin-gated at O5 (earned + MISSABLE, conditional epilogue); the Otsuru/Tama TRUTH stays spine-guaranteed at G6 for every player
- **created_date:** 2026-06-26
- **Driven by:** Q5, Q25, Q40. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **ADR-022**.
### ADR-037 ✅ — Design-staggered reveals, NO runtime reveal-queue (supersedes Q17's queue framing); distinct activities (Crafting, Quests) surface as top-level nav tabs, not nested panels
- **created_date:** 2026-06-26
- **Driven by:** FU4, Q17, Q10. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **ADR-022**.
### ADR-038 ✅ — Determinism hardening — per-named-stream RNG cursors {seed,cursors:{combat,loot,seasonal,worldgen}} + stateless day-keyed weather/lunar (not stored); ban Math.pow/exp/log/trig in core (integer-pow, whitelist sqrt)
- **created_date:** 2026-06-26
- **Driven by:** Q2, Q3, FU3, Q36. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **ADR-022**.
### ADR-039 ✅ — Intra-line dialogue branching in v1 — flat choices[]/ChoiceId with locksLineIds[]/flags effects; data-not-scripting, deterministic, only chosen-flags persist; content/dialogue.ts
- **created_date:** 2026-06-26
- **Driven by:** Q34, FU22. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **ADR-022**.
### ADR-040 ✅ — V1 ending = castle-town / Daikan first-contact stub — drops the porter/Kaidō-guild first-contact framing (it re-ran spent T2 content)

> 🔁 **ADR-048 renumber:** "spent T2 content" now reads **T3** (Region); the castle-town first-contact stub (v1
> ends at Region) is unchanged.
- **created_date:** 2026-06-26
- **Driven by:** Q24. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **ADR-022**.
### ADR-041 ✅ — Bundled asset set corrects the 'no asset pipeline' claim — self-hosted OFL fonts, inline-SVG load-bearing motifs (emoji cosmetic-only), a small synthesized Web Audio + original/CC0 audio set; commit-SHA build stamp + About/Credits + LICENSE + itch content descriptors
- **created_date:** 2026-06-26
- **Driven by:** Q38, Q50, Q52, Q54, Q51, Q53. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **ADR-022**. *(🔁 Elaborated 2026-06-29 by **ADR-068** — the in-scope audio fixes a traditional Japanese SFX palette (taiko/shamisen/koto/shakuhachi/temple-bell) + sequences a minimal SFX pass before the R1 taste call.)*
### ADR-042 ✅ — Real-name fictionalization & lint — rename Toyama/Konoe (Q27), Mago/Naozane/Obaa Sato (Q11/Q39), allow-list Nihonbashi (Q12); a §6.6 real-name denylist lint prevents recurrence
- **created_date:** 2026-06-26
- **Driven by:** Q27, Q39, Q11, Q12, Q28. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **ADR-022**.


## ADR-043 — PRD V2.1 decisions (post-battery, 2026-06-26)

> 🔁 **Tier-vocab stale (ADR-048/ADR-049/ADR-051).** Under one-pillar-per-tier, **Name reveals at T3** (not "T2 reveals
> 4"); the gate is now **per-N-pillars** (ADR-049); "estate builds → Phase 2" is in tension with Estate as the T1
> core pillar + koku flywheel (ADR-051). The signed locks (≥30-min floor, ~60h floor, grade-gate principle) hold —
> only the tier/pillar mapping is stale. (The win-rate clause already carries the ADR-057 amendment inline.)

The 5-round adversarial battery on PRD V2 surfaced 14 blocking defects (B1–B14) + ~40 design questions; all 32
were resolved with the human (full set: **[2026-06-26-prd-human-feedback.md Block N](../../project/feedback-human/2026-06-26-prd-human-feedback.md)**; audit:
[brainstorms/2026-06-26-prd-v2-audit.md](../../project/brainstorms/2026-06-26-prd-v2-audit.md)). Governing per ADR-022.
Headline locks: **v1 = ~60h FLOOR** (28.5h is the Phase-1 floor, not the total); **rung-meter ≥30-min floor is
on the numeric-points objective** (focused-optimal can't go under; unfocused runs longer — resolves B4);
**tier-gates require great/excellent with an authored deed supply + Name IS a gated pillar** (T2 reveals 4)
(B1/B8/B13); **estate builds move to Phase 2** (B2); **combos = Model-A → both pillars + a deed-only
gate-eligible accumulator** (B5); **world-clock derives season/year + lunar ephemeris** (B6); **multi-tab
unsupported** (B7); **load-validation = coerce-safe + reject-to-recovery** (B9); **tick() per-tick fold**
(B10); **v1 ending = bounded-complete + free-play** (B11); **crash recovery = error-boundary + last-known-good
ring + safe-mode** (B12); **quests = order-free advance-event set** (B14); **Estate value purely derived**
(dent fix); ~~**win-rate = analytic, not sampled**~~ (🔁 **AMENDED 2026-06-29 by ADR-057** — analytic for the GATE check; the *displayed* win-rate is fixed-seed **sampled** (n=400); **displayed == tested == same-for-every-player**); **identity hues = fills/accents, text in ink** (a11y);
**idle combat = full-auto with forced-retreat-on-loss + 0-HP→rest**; **pre-split MS3 & MS5**; **front-load
pre-R3 variety**; **53-bit-safe RNG + fixed pow order**; **interim perf budgets become an MS6 gate**.

### ADR-044 ✅ — Crash-recovery: error boundary + last-known-good save ring + safe-mode boot
- **created_date:** 2026-06-26
- **Context:** Block N battery defect **B12** (**[2026-06-26-prd-human-feedback.md Block N](../../project/feedback-human/2026-06-26-prd-human-feedback.md)**, item D-Q-B12): an in-tick exception or a corrupted autosave could brick the only save and lose a ~60h run. The PRD V2 had no crash containment — an unhandled error in the per-tick fold or render would tear down the loop, and an autosave fired from an already-bad state would overwrite the only good copy.
- **Options:** (A) No containment — let exceptions propagate (a single bug bricks the run) · (B) Single try/catch around tick only · (C) Error boundary around tick **and** render + a rolling last-known-good save ring + a crash-counter persisted outside GameState + a safe-mode boot offering rollback, with autosave-poison suppression.
- **Decision:** **(C)** Wrap **both tick and render** in an error boundary; persist a **crash-counter OUTSIDE GameState** (so a poisoned state can't hide the count); keep a **rolling last-known-good save ring**; **repeated crashes boot into safe-mode** offering rollback to a good ring slot; **suppress autosave-poison** — never overwrite the good ring with a state that just threw.
- **Why:** A ~60h v1 floor (ADR-043) makes the single-save failure mode unacceptable; containing the blast radius to one tick and preserving a known-good rollback is the cheapest path to "a bug is recoverable, not fatal." Keeping the crash-counter outside GameState is what lets safe-mode trigger even when the state itself is the poison.
- **Consequences:** **§6.8** gains a crash-recovery subsection (error boundary + ring + safe-mode + poison-suppression); **MS0** builds the save ring + the out-of-state crash-counter; **MS6** adds a terminal/crash test exercising the safe-mode path. Resolves B12. Recorded for PRD V2.1; supersedes any conflicting earlier ADR/lock per **ADR-022**.

### ADR-045 ✅ — Accessibility ink rule: identity hues are FILLS/ACCENTS only; meaning-bearing TEXT in AA-passing ink

> 🔁 **Translated by [ADR-144]** (UI-v2): the RULE survives verbatim — identity hues in chrome only,
> meaning-bearing text on an AA-passing ink ramp — but the concrete values moved with the palette
> (the warm sumi `--ink-soft`-on-washi ratios became the cool-grey ramp-on-steel targets; ui-design.md §2
> carries the current per-token guarantees).
- **created_date:** 2026-06-26
- **Context:** Block N a11y review (**[2026-06-26-prd-human-feedback.md Block N](../../project/feedback-human/2026-06-26-prd-human-feedback.md)**, item D-Q-a11y): the woodblock identity palette was carrying *meaning* through coloured text — a coloured WIN/LOSS word, coloured label-text — at contrast ratios that did not pass WCAG AA, and the PRD/ui-design overclaimed "AA on every surface" without stating the real per-token ratios.
- **Options:** (A) Keep identity hues on text, accept sub-AA contrast for "atmosphere" · (B) Drop the woodblock identity palette entirely for monochrome legibility · (C) Split the roles — identity hues live only in chrome (fills/accents); all meaning-bearing text renders in AA-passing ink.
- **Decision:** **(C)** Woodblock identity lives in **chrome only** — fills, bars, pips, borders; **every meaning-bearing text string renders in `--ink-soft`** (contrast ≥7.3, passes WCAG AA). **Drop the coloured WIN/LOSS word-as-text and the coloured label-text**; **drop the bare 'AA on every surface' overclaim** and instead state the **real per-token contrast guarantees**.
- **Why:** Colour must never be the sole carrier of meaning, and the identity palette's hues can't all clear AA as foreground text — moving them to fills/accents keeps the woodblock look while guaranteeing every word is legible; replacing the blanket "AA everywhere" claim with measured per-token ratios keeps the spec honest and checkable.
- **Consequences:** **prd.md §2.21** + **ui-design.md §5.1/§5.3** updated to the fills-only identity rule and the `--ink-soft` text rule; the WIN/LOSS and label colour-as-meaning are removed; the verifier / visual-QA gains a **text-contrast check**. Recorded for PRD V2.1; supersedes any conflicting earlier ADR/lock per **ADR-022**.

### ADR-046 ✅ — First build-and-play cycle complete (MS0–M2b shipped); docs-explosion partially actioned
- **created_date:** 2026-06-27
- **Context:** ADR-021 deferred the docs-explosion to *after* the first MS0+MS1 build-and-play cycle. That cycle is now done: **MS0/MS1/M2a/M2b are built, verify-green (51 tests), and play-tested** (commits `8bf6ac9`, `248bf93`, `fc36172`), against PRD V2.2 (all 32 Block N + 7 Block N.1 decisions applied, commit `2b8d5e9`). The toolchain (Vite+TS+Vitest+ESLint, `pnpm run verify`) is in place. So the ADR-021 docs-explosion trigger has fired, and the playtest produced its first steer.
- **Options:** (A) Hold the explosion until the *full* V1 is built · (B) Fire the explosion trigger now — create the living roadmap + start generating content — but defer the §1 vision-freeze + the full §4-balance-to-generated until the human signs off · (C) Do the whole explosion (freeze §1, generate all balance) immediately.
- **Decision:** **(B)** Partially action the explosion: **`docs/living/roadmap.md` is created** (the living milestone tracker — MS0–M2b SHIPPED, MS3–MS7 provisional) and **`docs/content/` is generating** (`t0-content.md`, generated); the **§1 vision-freeze + the full §4-balance-to-generated remain DEFERRED pending the human's sign-off**. The playtest's first steer is recorded: it **caught and fixed a combat dead-end** via a **sampled-win-rate forecast** + a **winnable starter foe**.
- **Why:** The ADR-021 trigger fired, so the cheap, reversible half of the explosion (living roadmap + generated content) should land now — it makes post-playtest re-tuning cheap and keeps the milestone state honest. The locked-intent half (freezing §1 as a tagged vision snapshot) is a one-way door that needs the human's sign-off, so it stays queued. MS3–MS7 and T3/T4 are genuinely NOT built and remain provisional.
- **Consequences:** **REFINES (does not delete) ADR-021** — its docs-explosion trigger is now marked fired; `docs/living/roadmap.md` (living) + `docs/content/` (generated) exist; the QA-playtesting doc was reclassified from a "plan" to a LIVING GUIDE (`docs/guides/qa-playtesting.md`). The §1 freeze + the full §4-balance-to-generated stay deferred pending human sign-off. **ADR-044/ADR-045** already recorded the crash-recovery + a11y-ink decisions carried into this cycle. NPC names landed as lord Shigemasa, drillmaster Kihei, physician Sōan (renamed off real-name echoes per ADR-042). Supersedes any conflicting earlier ADR/lock per **ADR-022**. **🔁 Refined (2026-06-29) by ADR-059:** the still-deferred §1 vision-freeze is now scheduled for **end-of-v1** (after v1 is fully built + play-tested), not merely "pending sign-off" — keep the PRD liquid through T0–T2 (maybe T3), then convert the whole PRD to living docs.

### ADR-047 ✅ — v0.2 audit-fix build; the combat stance pulled forward to R3 (provisional)
- **created_date:** 2026-06-27
- **Context:** The 2026-06-27 state-of-the-game battery audit (`project/audit/reports/2026-06-27-state-of-the-game.md`) scored the MS0–MS2 demo a "chassis with no engine" (Fun 4.5 / Incremental 4.5). **v0.2** (tag `v0.2`; `project/audit/reports/2026-06-27-v0.2-changelog.md`) fixes the highest-leverage findings *against locked intent*, without deciding any of the 6 human **HD-items** — re-scored (independent workflow) to Fun 6.5 / UI 8.5 / Incremental 7.0 / PRD-faithful 8.0 / feedback-human 8.0 / README-spirit 7.5 / Laziness 3.0.
- **Decision:** Build v0.2 as scoped (graded combat curve + kendo stance, the work→skill→yield reinvestment loop + cook/estate/attribute sinks, the R3 chapter-close + dream-2 payoff + the greyed House-Influence macro teaser, the cold-open screen, log ×N coalescing, the real RED→GREEN acceptance tests, the wired `migrate()`, the DEMO/REAL pacing profile). **All balance numbers are PROVISIONAL (v0.2) — tune by playtest.** The **combat stance reveal is pulled forward from its PRD-canonical R5 slot to R3** (combat-unlock) so a real combat *decision* exists from the moment combat opens (audit's top ask).
- **Why:** The audit wants the combat decision *now*; gating it at R5 leaves the freshly-unlocked R3 combat decision-less. The pull-forward is a small, reversible reveal-schedule change — not a vision change — so it does not need an HD-item; it is recorded here so the divergence from the §7.2 reveal ladder is tracked, not silent.
- **Consequences:** A re-gate to R5 later is a one-line change (`surfaces.ts` predicate). ~~The DEMO balance profile stays the shipped default (the REAL ≥30-min profile is reachable via `pnpm run pacing` / a flag but **not** chosen — that's HD-1, the human's call).~~ **⛔ SUPERSEDED (2026-06-29) by ADR-056** — HD-1 resolved: the real ADR-049 pacing ships as the default; review velocity comes from a DEV-only 2×/4×/8× speed toggle (a time multiplier), and the DEMO/REAL profile fork is retired. The seed-robust win-rate forecast (`combat.foeForecasts`, fixed seed) is now canon for the displayed/guard-tested win-rate. Provisional; supersedes nothing locked. Per **ADR-022**, future human steers win.


---

## ADR-048…ADR-055 — The two-tier Estate reshape (2026-06-28) ⏳ PRD application PENDING

A live human-steered design session (2026-06-28), driven by the v0.1 state-of-the-game audit
([`project/audit/reports/2026-06-27-state-of-the-game.md`](../../project/audit/reports/2026-06-27-state-of-the-game.md)),
reshaped the tier spine and resolved the open HD-items. Full intent record:
**[`2026-06-28-tier-reshape.md`](../../project/feedback-human/2026-06-28-tier-reshape.md)**. These 8 ADRs are **LOCKED
canon** (governing per **ADR-022**). **✅ Applied to `prd.md` / the living docs 2026-06-29 (session-15)** — the PRD
body is no longer 5-tier-stale. The **code** application is the Part-2 v0.3 build (tracked in
**[`project/archive/2026-06-29-path-to-v0.3.md`](../../project/archive/2026-06-29-path-to-v0.3.md)** Part 2 — now
ARCHIVED, the v0.3 build is done — + the living roadmap);
the §4 balance magnitudes stay liquid (re-derive at Ship-M1-F2, ADR-059).

### ADR-048 ✅ — Split the Estate into two tiers: the 6-tier reshape (T0 tutorial + T1 full estate)
- **created_date:** 2026-06-28
- **Context:** The v0.1 audit + firsthand play exposed a structural tension: the old **T0 (Estate)** tried to be **both** the tutorial *and* the first real grind, and the four-pillar macro spine was an unbuilt silhouette with no early on-ramp. The human's steer (2026-06-28) reshapes the tier ladder so the intro and the real game are distinct tiers and the spine is introduced gently.
- **Options:** (A) Keep **5 tiers** (T0 Estate…T4 Edo); introduce all spine pillars at the old T0→T1 gate · (B) **Split the Estate** into a tutorial tier + a full tier → **6 tiers**, with exactly **one pillar unlocking per tier**.
- **Decision:** **(B)** — **Six tiers:** **T0 Estate (intro/tutorial)** · **T1 Estate (full)** · **T2 Village** · **T3 Region** · **T4 Castle-town** · **T5 Edo**. The macro spine is introduced **early but minimal** — **one pillar** is active to clear T0→T1, and the **revealed-pillar set grows one per tier: 1→2→3→4→4**. Pillar→tier map: **Estate 家産** (P1, T0→T1) → **Arms 武威** (P2, T1→T2, unlocks Village) → **Office 官威** *kan'i* (P3, T2→T3, Region) → **Name & Honour 家格** *kakaku* (P4, T3→T4, Castle-town); **T4→T5 deepens the four, no new pillar**. **v1 scope = new T0→T3** (preserves the locked v1 *content*: full Estate + Village + Region).
- **Why:** Splitting "learn the game" from "grind the game" resolves the demo-vs-real pacing tension (T0 fast/reviewable, T1+ carries the real floor) **and** gives the spine a gentle on-ramp — you learn **one** pillar before juggling four. One-pillar-per-tier de-risks the macro engine by proving a single-pillar tier transition first. Pillar order = "**seize authority, then be granted status**": Office before Name, and Name (which *reflects the other three*, §1.6.1) works best last.
- **Consequences:** SUPERSEDES the 5-tier model across **prd.md §1.6** (four pillars / five tiers), **§1.7** (world table), **§5** (tier content), **§7** (milestones), and the **§1.6.3** "T0 = 2-pillar special (Arms+Estate)" reveal (now **T0 = 1 pillar = Estate**). Renumbers Region/Castle-town/Edo → **T3/T4/T5**. The ~28.5h **§4.8** budget re-derives across the 4 v1 tiers. The QA `state()` snapshot's `tier` widens to **0..5** and `outcome` gains **`t3done`** (the v1 finish). Code: the tier enum + `ranks.ts` + the state schema. **PRD/docs/code application PENDING** — see the tracker. REFINES ADR-028 (the gate — see ADR-049). Per **ADR-022**, this newest human steer governs.

### ADR-049 ✅ — Tier ascension = a manual opt-in story event; the hybrid grade-gate scales per pillar-count; overshoot earns a permanent boon; gentle pacing ramp
- **created_date:** 2026-06-28
- **Context:** **ADR-028** locked a "hybrid good/great/excellent" tier-gate for the old reveal set. With one pillar unlocking per tier (ADR-048), the gate must be re-specified, and the human added two refinements: the tier-up is **manual opt-in**, and a **higher pillar grade earns a better reward**.
- **Options:** *Gate* — (A) flat single threshold · (B) keep the hybrid grade-gate, scaled by pillars-open · (C) AND-gate all open pillars. *Reward* — permanent boon / one-time lump / prestige-only. *Trigger* — auto-advance vs manual opt-in. *Pacing* — floor everywhere / T0 exempt / gentle ramp.
- **Decision:** **KEEP the hybrid grade-gate (B)**, scaled by **N** open pillars to **exactly 1 EXCELLENT + 1 GREAT + (N−2) GOOD** (all pillars ≥ GOOD): **T0 = EXCELLENT** · **T1 = 1 GREAT + 1 EXCELLENT** · **T2 = 1 EXC + 1 GRT + 1 GOOD** · **T3 = 1 EXC + 1 GRT + 2 GOOD**. The gate is **not** an auto-advance — meeting it **unlocks the OPTION** to trigger a **manual opt-in ascension STORY EVENT**; the player chooses *when* (grinding pillars **past** the gate is rewarded). The event grants a **permanent, grade-scaled boon** (a next-tier head-start / a small permanent multiplier / unique title+gear). **Pacing = gentle ramp:** T0 ~**10–15 min/rung** and **floor-exempt**; the signed **≥30-min/rung floor binds from T1**.
- **Why:** The grade-gate is a signed criterion worth preserving; scaling it by pillar-count keeps it meaningful as pillars unlock. **Manual opt-in + overshoot-reward** turns the gate into a *goal you push past for a better payoff* (a core incremental pleasure) instead of a wall. Exempting the tutorial from the floor lets T0 stay reviewable in minutes without abandoning the floor where it matters (T1+).
- **Consequences:** REFINES **ADR-028** (the gate is now per-N-pillars, opt-in, and reward-bearing) and **ADR-029** (the floor now starts at **T1**, not T0). prd.md **§1.6.3/§4.6** (gate spec), **§4.8** (pacing — T0 exempt), **§5** (the ascension story beats). New state: a tier-up-**available** flag + the score-scaled reward bundle. Add a gate-grade test per tier. **PRD/docs/code application PENDING.** Per **ADR-022**, governs. **🔁 Refined (2026-06-29) by ADR-062:** the *first* tier ascension (T0→T1) is always a big ceremonial beat on first contact regardless of grade; the grade-scaled *boon magnitude* (this ADR) still applies, and overshoot-grade scaling layers onto *later* ascensions.

### ADR-050 ✅ — Combat HP carries between fights and heals by eating (the stance becomes a real tradeoff)
- **created_date:** 2026-06-28
- **Context:** The v0.2 audit found the new stance toggle was a **fake choice** — 上段/Aggressive strictly dominated in 100% of sampled cells and the defensive payoff (HP retention) was **inert**, because every fight restarted at `hpMax` and the default 中段/Balanced was the *trap* pick.
- **Options:** (A) **carry HP** between fights · (B) keep full-HP-per-fight, rebalance stats + surface wear only · (C) drop the stance. *HP recovery* — rest/time · **eat/satiety** · slow + setback.
- **Decision:** **(A) HP carries between fights** (retention becomes a real resource) and **HP heals by EATING (satiety)** — a low-satiety player is a fragile one. Defensive stances (more retention) now genuinely trade against Aggressive (more speed/damage), so **no stance strictly dominates** and the default is no longer a trap.
- **Why:** Carrying HP is what makes the stance a *decision* at all; tying recovery to satiety couples combat to the **existing cook/food sink** (one system feeds another) instead of adding a separate heal resource. Directly fixes the audit's "fake decision" + "dominated default."
- **Consequences:** `combat.ts` must read **carried** HP (not reset to `hpMax`); the auto-loop rests/eats to recover; satiety becomes combat-relevant. Replace the v0.2 test that **enshrined** stance dominance with a **"no stance strictly dominated"** curve invariant; surface the wear/retention tradeoff in **pixels** (touch-legible, not hover-only). Pairs with **ADR-035** (satiety throttles combat). prd.md **§4.6**. **PRD/docs/code application PENDING.** Per **ADR-022**, governs.

### ADR-051 ✅ — Koku gets a compounding sink: the estate-upgrade flywheel

> 🔁 **Re-scoped 2026-07-02 by [ADR-107].** koku is no longer the spendable currency — it is the
> House STANDING (never spent). The reinvestment flywheel is now **RICE→COIN** (labour yields
> rice + a little coin; estate upgrades are bought with **COIN**). The compounding-sink mechanic
> holds; only the noun changes (koku → coin).
- **created_date:** 2026-06-28
- **Context:** v0.1/v0.2 audits: **koku** is the headline currency but had **no sink** (v0.1) / only a **finite, power-neutral estate** (v0.2), so the reinvestment loop self-saturates — the ×3 yield multiplier accelerates a currency with nowhere compounding to go.
- **Options:** (A) **compounding estate upgrades** · (B) a market (buy/sell gear+goods) · (C) koku **is** the pillar currency (spend koku → raise pillars directly).
- **Decision:** **(A)** — **koku buys estate improvements that raise yield/output** (work → koku → upgrade → more output → more koku): a true reinvestment flywheel feeding the **Estate 家産 pillar** via its **LAND / TREASURY** sub-engines (§1.6.1). A market (the **TRADE/*meibutsu*** sub-engine) is **additive later**, not the primary sink.
- **Why:** A compounding sink is what makes the economy *incremental* rather than a bounded cosmetic; routing it through the Estate pillar's **existing** LAND/TREASURY sub-engines unifies the micro economy with the macro spine instead of bolting on a parallel system.
- **Consequences:** Multi-stage, yield-bearing estate upgrades replace the finite power-neutral `estateStage`; the `G-NO-DEAD-VALUES` ratchet now guards a **compounding** koku consumer. REFINES **ADR-033** (estate stages become yield-bearing, not just a koku/Arms sink). prd.md **§1.6.1 + §4** (economy). **PRD/docs/code application PENDING.** Per **ADR-022**, governs. **🔁 Refined (2026-06-29) by ADR-066:** the flywheel is a small LINEAR estate-upgrade taste in T0, branching into the LAND/TREASURY/TRADE sub-engines at T1 (trade ≤⅓ preserved).

### ADR-052 ✅ — Tutorial = showcase-in-miniature; the T0/T1 content split; seed-breadth lands minimal-now (HD-5)
- **created_date:** 2026-06-28
- **Context:** The human delegated "**what estate content is tutorial (T0) vs full (T1)**" and chose **showcase-in-miniature**. **HD-5** (seed breadth — NPC dialogue, walkable areas, the found/crafted 2nd weapon) resolved to **"add minimal versions now."**
- **Options:** *Tutorial scope* — lean / **showcase-in-miniature** / core+teasers. *HD-5* — **add minimal now** / collapse via ADR / defer.
- **Decision:** **T0 (tutorial) showcases a MINIATURE of every system** — a tiny **market** (koku-sink taste), one **craftable** (🔁 **relaxed to "at LEAST one craftable" 2026-07-01 by ADR-102 — T0 now ships 3 weapons**; the 2nd weapon becomes **found/crafted**, not gifted — honoring "weapons never gifted as power"), one **NPC lore-talk** line, ~~room-grouped~~ **areas** (🔁 **upgraded to a small WALKABLE map 2026-06-29 by ADR-065**), the **Estate-pillar** panel + the **first ascension**. **T1 (full estate) scales each into depth.** Seed breadth lands **now, minimal in T0**, deepened in T1.
- **Why:** Showing the full game's shape early hooks genre-literate players (they perceive the horizon) without front-loading the build; T1 then has real new toys. The **found/crafted** weapon retires the v0.1 "gifted axe" complaint.
- **Consequences:** The T0/T1 rung+content split (**R0→R7 tutorial**; **~8 T1 rungs ≈ R8→R15**) — *provisional* per the freeze. Resolves **HD-5**; the axe-gift becomes found/crafted (supersedes the M2b stand-in). prd.md **§5** (T0/T1 content), **§1.7** (breadth promises). **PRD/docs/code application PENDING.** Per **ADR-022**, governs.

### ADR-053 ⚠️ — Active-only "leave it running" = wall-time simulation (do NOT pause on `document.hidden`) — SUPERSEDED (clock model) by ADR-079
> 🔁 **SUPERSEDED on the clock model by ADR-079 (2026-06-30).** ⚠️ This ADR's Decision below
> **describes the OPPOSITE of what shipped** — a textbook "a signed ADR is a *claim to verify*, not
> proof" (A12). The build is **active-only-PAUSE**: the sim **pauses on `document.hidden`**, with **no**
> offline/background wall-time catch-up (`src/app/main.ts:179` — the `paused || document.hidden` guard;
> the active-only tick-loop comment is at 174-176). **ADR-079 is the live authority.** The
> genre's "leave it running" feel is delivered by **tab-open auto-repeat while the tab is open & visible**
> (FU23), not by wall-time catch-up. The original text is kept (struck) below as append-only history.
- **created_date:** 2026-06-28
- **Context:** **HD-6** — active-only / no-offline is locked (**FU23**). The human clarified the *intent*: active-only must still support **"leave it running"** — leave the game open in a browser window, do other things, return to find it kept doing the action. The only distinction from "offline" is the **window/tab must stay open**.
- **Options:** (A) **keep active-only** · (B) add a capped while-away tick · (C) decide later. *Technical:* pause-on-hidden vs **wall-time catch-up**.
- **Decision:** ~~Keep active-only (A) — no progress when the game is CLOSED. But the simulation must **advance by elapsed wall-time** (delta-time accumulation) so a backgrounded/throttled tab **catches up** on its next tick. **Do NOT pause the sim on `document.hidden`.** (Keep the autosave dirty-guard, but it must **not** gate the simulation.)~~ **[SUPERSEDED by ADR-079 — see banner above.** The shipped model is **active-only-PAUSE**: pause on `document.hidden`, **no** wall-time catch-up. The kept parts: active-only (no progress when CLOSED) and the autosave dirty-guard both still hold.]
- **Why:** "Leave it running" is the genre's idle fantasy and is honored *without* offline simulation as long as the tab is open; the only engineering requirement is that Chrome's background-tab timer throttling not **lose** time — solved by ticking on **real elapsed time** rather than assuming a steady cadence.
- **Consequences:** REVISES the v0.1 report's "add a `document.hidden` guard to autosave" — keep the autosave guard, but the **tick loop catches up elapsed time when hidden**. `app/main.ts` computes `dt` from wall-clock + a covering test. Honors **FU23**. prd.md **§6.10 / the clock**. **PRD/docs/code application PENDING.** Per **ADR-022**, governs.

### ADR-054 ✅ — Milestone-integrity rule: all-DoD-or-ADR-amended + a CI manifest check (HD-4)
- **created_date:** 2026-06-28
- **Context:** The v0.1 audit found **"SHIPPED (slice)"** — milestones shipping with unmet DoD lines footnoted away (MS1's claimed pacing tool absent; M2b's loot→craft loop folded into a gift), so green CI **overstated** completeness.
- **Options:** (A) **all-or-ADR-amended + CI manifest check** · (B) all-or-amended, no CI check · (C) keep partial-DoD shipping with footnotes.
- **Decision:** **(A)** — a milestone is **SHIPPED only when every DoD line is met OR formally amended via an ADR before the commit**; a **CI manifest check** asserts every instrument a DoD *names* resolves to a real test/tool. Bans "SHIPPED (slice)".
- **Why:** The engineering gates are already strict; extending the same rigor to **feature-completeness claims** keeps the milestone ledger trustworthy into T1+. A machine check is what prevents the honest-intention-but-silent-gap failure the audit found.
- **Consequences:** A new process gate (working-agreements + `verify`); each future milestone DoD's named instruments are CI-asserted; `roadmap.md` DoDs become forward contracts. Resolves **HD-4**. **CI manifest check BUILT in v0.3.1 Step 7 (battery #20):** [`src/scripts/milestone-integrity.ts`](../../src/scripts/milestone-integrity.ts) — the 11th `verify` gate — a lean manifest asserting every named DoD forward-contract (G-CURVE, G-NO-DEAD-VALUES, NO-STANCE-DOMINATED, DISPLAYED==TESTED, playcheck) + ADR-088's per-tier e2e/invariants tests resolves to a real test/tool, and that every named contract the roadmap mentions is wired. This is the **teeth** ADR-088's enforcement note names. Per **ADR-022**, governs.

### ADR-055 ✅ — Pillar-teaser = active + locked silhouettes; origin-mystery cadence (payoff at Region + a beat every tier)
- **created_date:** 2026-06-28
- **Context:** v0.2 shows **all four pillars greyed** (reads as a roadmap dump); §1.6.3 says reveal per tier. And the v0.1 audit found the **origin mystery "dies in silence" mid-T0**, violating **§1.9** "the dream cadence never goes cold" (its markers were write-only flags no logic read).
- **Options:** *Teaser* — **active + locked silhouettes** / all-4-named-greyed / only-unlocked. *Mystery* — **payoff at Region + a beat every tier** / resolve in the Estate arc / slow-burn to castle-town.
- **Decision:** The **House Influence panel shows the active pillar + locked, UNNAMED silhouettes** for the rest (perceived depth + intrigue, not a named roadmap). The **origin mystery pays off in full at the Region (T3, per canon)**, but a **dream/mystery beat fires at every tier transition** (incl. the T0→T1 and T1→T2 ascensions) so the **§1.9** cadence holds within every window.
- **Why:** Silhouettes signal long-horizon depth without spoiling it; per-tier beats keep the strongest narrative asset **alive** instead of dead-ending it (the v0.1 failure), while preserving the canonical Region payoff.
- **Consequences:** ui-design/render gains the **silhouette teaser**; the dream/mystery flags become **READ** at each tier transition (fixing the v0.1 write-only-flags bug). prd.md **§1.9** (cadence = per-tier beats) + **§1.6.3/§2.16(e)** (teaser presentation). **PRD/docs/code application PENDING.** Per **ADR-022**, governs.


---

## ADR-056…ADR-069 — 2026-06-29 decision session (v0.2 audit reconciliation + forward decisions) ⏳ PRD application PENDING

A human-driven decision pass (2026-06-29) reconciled the v0.2 state-of-the-game audit
([`2026-06-28-state-of-the-game-v0.2.md`](../../project/audit/reports/2026-06-28-state-of-the-game-v0.2.md)) against the
tier reshape (**ADR-048…ADR-055**); a verification workflow confirmed the reshape had already closed almost every audit
item, and this batch resolves the residuals + records the forward calls. Full intent record (23 numbered decisions):
**[`2026-06-29-decision-session.md`](../../project/feedback-human/2026-06-29-decision-session.md)**. These ADRs are **LOCKED
canon** (governing per **ADR-022**) but are **NOT yet applied to `prd.md` / the living docs / code** — they ripple in ONE
batch with the ADR-048…ADR-055 reshape. **Op-model v2 was reviewed** (2026-06-29 HD-item session) and initially ~~deferred (**ADR-070**)~~ — but
**⛔ SUPERSEDED 2026-06-29 by ADR-072–ADR-074:** the human reopened it as **"v2 FINAL"** and **ADOPTED** the bundle —
full-`verify` pre-commit + drift guard (**ADR-072**, superseding the ADR-070 deferral + the ADR-071 subset hook), the
mandatory `diverge` gate (**ADR-073**), and the `playcheck` ratchet (**ADR-074**). The "deferred / HELD" stance no
longer holds.
**Build-order (spine-first) + carry-forward-T0 are roadmap sequencing** — they live in the
roadmap plan ([`../../project/archive/2026-06-29-roadmap-reaxe-proposal.md`](../../project/archive/2026-06-29-roadmap-reaxe-proposal.md)), not a
design ADR.

### ADR-056 ✅ — Real ADR-049 pacing ships as the default; a DEV-only speed toggle replaces the DEMO/REAL profile fork
- **created_date:** 2026-06-29
- **Context:** ADR-047 shipped the v0.2 demo with a DEMO/REAL balance-profile fork and left **DEMO as the shipped default**, deferring the real choice to the human (HD-1). The reshape's **ADR-049** already locked the real pacing shape (T0 ~10–15 min/rung, floor-exempt; the signed ≥30-min/rung floor binds from T1). HD-1 now resolves.
- **Options:** (A) keep DEMO as the shipped default · (B) ship REAL ADR-049 pacing as the default + a DEV-only time-multiplier for review/playtest velocity · (C) a runtime DEMO/REAL toggle exposed in production.
- **Decision:** **(B)** Ship the **real ADR-049 pacing as the default** (the actual game players get). Review/playtest velocity comes from a **DEV/debug-only 2×/4×/8× speed toggle** — a pure *time multiplier*, **not** a second balance profile. The DEMO/REAL profile fork is retired.
- **Why:** A shipped game should run at its real, tuned pace; a profile fork risks demo balance leaking to players and doubles the tuning surface. A time multiplier gives the agent fast headless review without forking the numbers — same balance, faster clock.
- **Consequences:** **SUPERSEDES ADR-047's "DEMO profile stays the shipped default" consequence** (annotated there). Remove the DEMO/REAL profile fork; ADR-049's pacing becomes the only profile. The 2×/4×/8× toggle is DEV-only and stripped from prod (bundled in **ADR-067**'s dev tools). prd.md **§4.8**. **✅ CODE APPLIED at MS2·8 (2026-06-29, session-19):** the fork is retired across 14 files — `RUNG_METER_THRESHOLDS` is one re-derived single profile (R0 1100 ≈5-min cold-open · R1 2150 ≈10m · R2 2600 ≈12m · R3–R7 2800→3400; sim-verified R0=4.88/R1=10.0/R2=12.1 min), T0 is ≥30-floor-EXEMPT (gated instead on the sane band [3,22] min), the `balanceProfile` state field + boot resolver are gone, the DEV speed toggle + teleports are KEPT (the human confirmed DEV tools are permanent until ship). Magnitudes are LIQUID (ADR-059) — tuned by playtest. Per **ADR-022**, governs.

### ADR-057 ✅ — Win-rate: analytic for the gate, fixed-seed sampled for the display (amends signed ADR-043)
- **created_date:** 2026-06-29
- **Context:** Human-signed **ADR-043** locked "win-rate = analytic, not sampled." The reshape build (ADR-046/ADR-047) actually uses a fixed-seed *sampled* forecast (`combat.foeForecasts`) for the displayed/guard-tested win-rate. A provisional build ADR must not silently override a signed lock, so the split is blessed explicitly.
- **Options:** (A) analytic everywhere (as ADR-043 reads) · (B) sampled everywhere · (C) **split — analytic for the tier/gate check, fixed-seed sampled (n=400) for the displayed win-rate**.
- **Decision:** **(C)** The **tier/gate** check stays **analytic**; the **displayed** win-rate is **fixed-seed sampled (n=400)**. Codify the invariant **displayed == tested == same-for-every-player** — the same fixed seed for everyone, so the number a player sees is the number the guard test asserts.
- **Why:** Analytic is the right exactness for a gate threshold; a fixed-seed sample is what the actual combat resolver produces, so displaying it keeps the shown number honest to lived play — and a fixed seed makes it deterministic and identical for every player and the test.
- **Consequences:** **AMENDS the human-signed ADR-043** (annotated there — its blanket "analytic, not sampled" now scopes to the gate only). Blesses `combat.foeForecasts` (ADR-046/ADR-047) as canon for the displayed win-rate. prd.md **§4.6 / §6**. **PRD/docs/code application PENDING.** Per **ADR-022**, governs.

### ADR-058 ✅ — The signed 20–35% SINGLE-fight win-rate band stands under the HP-carry model (ratifies ADR-016/ADR-035)
- **created_date:** 2026-06-29
- **Context:** **ADR-050** made combat HP carry between fights and heal by eating. That changes the *grind* (a run of fights), so the question arose whether the human-signed first-fight win-rate band (**ADR-016**, re-measured at adequate satiety by **ADR-035**) needs re-expression under HP-carry.
- **Options:** (A) re-express the criterion as a multi-fight / run-survival rate under HP-carry · (B) **keep the signed 20–35% SINGLE-fight band unchanged**.
- **Decision:** **(B)** KEEP the signed **20–35% single-fight win-rate** as the first-fight criterion. HP-carry (ADR-050) affects the *grind*, not the discrete first-fight moment; the agent tunes a real foe into band at realistic durability/satiety under the new model, backed by a RED-able test. No re-expression — the signed single-fight band stands.
- **Why:** The first fight is one discrete, humbling encounter (the mediocre-start beat, **ADR-003**); HP-carry is a between-fight resource, orthogonal to a single fight's odds. The signed band is a clean, testable criterion with no reason to re-litigate.
- **Consequences:** **RATIFIES ADR-016 + ADR-035** (neither changes); the first-fight test asserts the 20–35% band at satiety ≥~0.7 under HP-carry. Pairs with **ADR-050** (HP-carry is the grind model, not the first-fight model). prd.md **§4.6**. **PRD/docs/code application PENDING.** Per **ADR-022**, governs.

### ADR-059 ✅ — Keep the PRD LIQUID through v1; defer the §1 freeze to end-of-v1 (refines ADR-020/ADR-021/ADR-046)
- **created_date:** 2026-06-29
- **Context:** ADR-020 → ADR-021 → ADR-046 set a path: freeze §1 + locked intent as a tagged vision snapshot *after the first build-play cycle*, exploding the rest into living docs. That trigger fired (ADR-046) but the §1 freeze stayed queued. The reshape (ADR-048…ADR-055) then moved much of the spine, so the human re-times the freeze.
- **Options:** (A) freeze §1 now (the queued step) · (B) **keep the PRD open/liquid through T0/T1/T2 (possibly T3); do NOT freeze §1 now; convert the WHOLE PRD into living docs once v1 is fully implemented + play-tested** · (C) never freeze / never explode.
- **Decision:** **(B)** Keep the PRD **liquid through T0–T2 (maybe T3)**. **Do NOT freeze §1 now.** The one-way freeze door moves to **end-of-v1**: once v1 is fully built + play-tested, convert the whole PRD into living docs. (The mechanical PRD-file split into per-section files — feedback #6 — proceeds with the batched ripple; that's structure, not a freeze.)
- **Why:** Freezing §1 mid-build risks locking intent that contact with play may still steer (the ADR-019 fun-as-hypothesis discipline); the safest moment to crystallize the vision is when v1 has actually survived play. The earlier "freeze after first cycle" was premature given how much the reshape moved.
- **Consequences:** **REFINES (does not delete) ADR-020, ADR-021, ADR-046** (annotated in each — the queued §1 vision-freeze now waits for end-of-v1). The locked-intent constraints (no-magic · mediocre-start · trade ≤⅓ · active-only · the four pillars · the estate spine · the signed acceptance targets) still hold as canon; they are simply not yet snapshot-frozen. MS2–MS7 stay provisional as ever. **PRD/docs application PENDING.** Per **ADR-022**, governs. **🔁 Refined (2026-07-10) by ADR-168:** the end-of-v1 freeze door is **CANCELLED** — the PRD is never frozen; it tracks the shipped game (locked intent binds as *intent*, not as a text-freeze).

### ADR-060 ✅ — Roadmap re-axed as nested Tier → Milestones → Fun-slices (not a flat S0–S4)
- **created_date:** 2026-06-29
- **Context:** The roadmap needed re-axing post-reshape. A flat S0–S4 staging was considered and rejected (the human has no S0–S4 context, and a flat list doesn't map onto the tier spine).
- **Options:** (A) flat S0–S4 stages · (B) **a two-level, per-tier structure — for each v1 tier (T0/T1/T2/T3): N milestones; within each milestone: N fun-slices**.
- **Decision:** **(B)** Re-axe the roadmap as **nested Tier → Milestones → Fun-slices**. Each tier gets N milestones; each milestone gets N fun-slices, where a **fun-slice ships a playable, *fun* increment** (not just a feature). Claude proposes the cut.
- **Why:** Nesting under the tier spine (ADR-007/ADR-048) keeps the roadmap legible against the actual game structure, and forces every increment to be playable-and-fun rather than a feature checkbox — the audit's #1 lesson (a chassis with no engine).
- **Consequences:** `docs/living/roadmap.md` is re-axed to the nested shape (proposal: [`../../project/archive/2026-06-29-roadmap-reaxe-proposal.md`](../../project/archive/2026-06-29-roadmap-reaxe-proposal.md)). **Build-order (spine-first) + carry-forward-T0 are sequencing details that live in that roadmap plan, NOT this ADR.** Milestone count / fun-slice granularity / naming are delegated to Claude. **Docs application PENDING.** Per **ADR-022**, governs.

### ADR-061 ✅ — Difficulty is humbling THROUGHOUT (incl. T0); distinct from ADR-049 pacing
- **created_date:** 2026-06-29
- **Context:** The v0.2 audit's default was to "tame the early friction." The human reversed that: the mediocre-start bite is the point and must persist, including in the tutorial tier.
- **Options:** (A) smooth the early durability/satiety/on-ramp friction (the audit default) · (B) **keep difficulty humbling throughout, incl. T0**.
- **Decision:** **(B)** Difficulty stays **humbling throughout** — keep the mediocre-start bite; don't smooth the durability/satiety friction or the on-ramp. **Distinct from pacing:** ADR-049's T0 *fast* pacing (~10–15 min/rung) still holds — **T0 is quick but NOT easy**. Guardrails stay: always winnable, soft-setback only, no permanent loss, no true dead-ends / stranding.
- **Why:** The zero-to-competent-through-effort fantasy (**ADR-003**) requires real friction; an easy on-ramp betrays it. Fast ≠ easy — short rungs can still bite. The guardrails keep humbling from tipping into unfair.
- **Consequences:** Do NOT tame early friction (revises the audit default); the durability/satiety/on-ramp tuning keeps its bite within the winnable / soft-setback / no-dead-end guardrails (**ADR-011/ADR-016**). Pairs with **ADR-049** (pacing) as an independent axis. prd.md **§4** (difficulty). **PRD/docs/code application PENDING.** Per **ADR-022**, governs.

### ADR-062 ✅ — The first tier ascension (T0→T1) is a BIG ceremonial beat, always big on first contact
- **created_date:** 2026-06-29
- **Context:** **ADR-049** made ascension a manual opt-in story event with a grade-scaled boon. The human added that the *first* ascension specifically must land as a big ceremonial beat regardless of grade.
- **Options:** (A) scale all ascension ceremony by grade (a thin first ascension if barely-gated) · (B) **the first ascension is ALWAYS a big ceremonial beat on first contact; grade-scaling layers onto later ascensions**.
- **Decision:** **(B)** The **T0→T1 ascension always lands big on first contact** — Yuji Syuku title card, macro silhouettes stir, a dream/mystery beat (**ADR-055**), music swell, the grade-scaled boon revealed. **Overshoot-grade scaling can layer onto *later* ascensions; the first is always big.**
- **Why:** The first tier crossing is the moment the macro spine becomes real — under-selling it (because the player barely cleared the gate) would waste the game's biggest structural reveal. Later ascensions can lean on grade-scaling for variety once the beat is established.
- **Consequences:** **REFINES ADR-049** (the first ascension's *ceremony* is grade-independent; ADR-049's grade-scaled *boon magnitude* still applies). Uses **ADR-055**'s per-tier dream/mystery beat + the Yuji Syuku hero font (**ADR-018**). prd.md **§5** (ascension beats). **PRD/docs/code application PENDING.** Per **ADR-022**, governs.

### ADR-063 ✅ — Onboarding = a diegetic mentor (in-world teaching), lifting the audit onboarding ding within non-hand-holding
- **created_date:** 2026-06-29
- **Context:** The v0.2 audit dinged onboarding (5.5). **ADR-015** locked non-hand-holdy teaching, so the fix must lift onboarding *without* breaking that.
- **Options:** (A) tutorial popups / explicit tutorialization · (B) **a diegetic mentor — an in-world character teaches each system through dialogue & story as it unlocks** · (C) leave onboarding as-is.
- **Decision:** **(B)** A **diegetic mentor** (e.g. drillmaster Kihei / an estate elder) teaches each system through **dialogue & story** as it unlocks — onboarding via narrative, fully non-hand-holdy. Lifts the 5.5 ding without tutorial popups, and adds character + grounds the cast.
- **Why:** A mentor character is the natural, in-world way to teach an Edo-estate game — it both onboards and deepens the narrative, where a popup would break immersion and violate ADR-015. Reuses existing cast (Kihei, **ADR-046**) rather than adding UI chrome.
- **Consequences:** Upholds **ADR-015** (non-hand-holdy) and **ADR-064** (no popups). Authoring: mentor dialogue lines keyed to each system's unlock (data per **ADR-039**). prd.md **§2 (onboarding) / §5 (cast)**. **PRD/docs/code application PENDING.** Per **ADR-022**, governs.

### ADR-064 ✅ — T0 tutorial stays non-hand-holdy (ADR-015 upheld even in the tutorial)
- **created_date:** 2026-06-29
- **Context:** The natural temptation is to make the *tutorial* tier hand-holdy even though ADR-015 bans it elsewhere. The human upheld ADR-015 for T0 too.
- **Options:** (A) allow hint popups / explicit tutorialization in T0 only · (B) **uphold non-hand-holding even in the tutorial**.
- **Decision:** **(B)** T0 **stays non-hand-holdy** — no hint popups. Teach by **reveal-as-plot + world discovery + legible-by-design surfaces**. **Constraint:** the audit's onboarding ding (5.5) must be fixed *within* non-hand-holding — clearer reveal beats + touch-legible readouts, NOT tutorialization.
- **Why:** A hand-holdy tutorial sets the wrong tone for a discovery-driven game and contradicts ADR-015; legible-by-design + the diegetic mentor (**ADR-063**) achieve onboarding without popups.
- **Consequences:** **UPHOLDS ADR-015** in T0; pairs with **ADR-063** (the diegetic mentor is the teaching vehicle). The onboarding fix is reveal-clarity + touch-legible readouts, not popups. prd.md **§5 (T0) / §2 (legibility)**. **PRD/docs/code application PENDING.** Per **ADR-022**, governs.

### ADR-065 ✅ — T0 areas = a small WALKABLE map (refines ADR-052's "room-grouped areas")
- **created_date:** 2026-06-29
- **Context:** **ADR-052** resolved T0 areas as "room-grouped" (organizational grouping). The human upgraded this: T0 should deliver the §1 "areas to explore" promise as an actual small walkable map.
- **Options:** (A) keep room-grouped organizational areas · (B) **a small WALKABLE map in T0**.
- **Decision:** **(B)** T0 ships a **small walkable map** (not just organizational room-grouping), delivering the §1 "areas to explore" promise in the tutorial — consistent with **ADR-012** full-maps-every-tier.
- **Why:** A walkable map makes exploration real from the first tier (the §1 promise) and gives reveal-as-plot / world-discovery onboarding (**ADR-064**) an actual world to discover. More build cost, accepted.
- **Consequences:** **REFINES ADR-052** (T0 "room-grouped areas" → a small walkable map; annotated there). More build cost — sequence so it doesn't crowd out spine-first (the roadmap plan's build order, **ADR-060**). prd.md **§5 (T0 areas) / §1.7**. **PRD/docs/code application PENDING.** Per **ADR-022**, governs.

### ADR-066 ✅ — Koku flywheel is LINEAR in T0, branches into LAND/TREASURY/TRADE sub-engines at T1 (refines ADR-051/ADR-033)

> 🔁 **Re-scoped 2026-07-02 by [ADR-107].** The "koku flywheel" is now the **RICE→COIN** flywheel
> (labour yields rice + a little coin; upgrades cost **COIN**). The LINEAR-T0 →
> LAND/TREASURY/TRADE-at-T1 branching and the trade ≤⅓ cap are unchanged; koku becomes the House
> STANDING, never spent.
- **created_date:** 2026-06-29
- **Context:** **ADR-051** made koku a compounding estate-upgrade flywheel feeding the Estate pillar's LAND/TREASURY sub-engines. *When* the depth arrives was open: T0 is a tutorial (ADR-052 showcase-in-miniature).
- **Options:** (A) full LAND/TREASURY/TRADE depth from T0 · (B) **a small LINEAR estate-upgrade taste in T0; branch into the LAND/TREASURY/TRADE sub-engines at T1**.
- **Decision:** **(B)** T0 ships a **small LINEAR estate-upgrade taste** (a single reinvestment line — work → koku → upgrade → more output); the flywheel **branches into the LAND / TREASURY / TRADE sub-engines at T1** where the depth matters (**ADR-008**, **trade ≤ ⅓** of Estate & Wealth preserved).
- **Why:** A linear taste teaches the reinvestment loop without front-loading T1's depth (matches **ADR-052** showcase-in-miniature); branching at T1 gives the full tier real new toys. The trade-⅓ structural cap stays intact.
- **Consequences:** **REFINES ADR-051 + ADR-033** (the compounding flywheel is linear in T0, branched at T1; annotated in both). The trade ≤⅓ invariant (**ADR-008**) and the `G-NO-DEAD-VALUES` ratchet still apply. prd.md **§1.6.1 / §4 (economy) / §5 (T0 vs T1)**. **PRD/docs/code application PENDING.** Per **ADR-022**, governs.

### ADR-067 ✅ — Dev tools (speed toggle + jump-to-rung/tier) + save policy (wipe dev saves; build+test migrate before launch) — refines D-013a
- **created_date:** 2026-06-29
- **Context:** Two build/scope calls, bundled: (1) the highest-value DEV affordances to add now; (2) what to do with the v0.2 save schema on the reshape bump. There are no production users yet.
- **Options:** *Dev tools* — a rich dev console / **the speed toggle + a jump-to-rung/tier teleport** / none. *Saves* — write full migrations across dev churn / **wipe dev/v0.2 saves on the reshape bump, build+test the real `migrate()` before launch**.
- **Decision:** **Dev tools = the DEV-only 2×/4×/8× speed toggle (ADR-056) + a jump-to-rung/tier state-jump teleport** — the highest-value pair; defer richer affordances until a specific test needs them; **DEV-only, stripped from prod.** **Save policy = WIPE dev/v0.2 saves on the reshape schema bump** (pre-launch, no users); **build + test the real `migrate()` path before launch**, not across dev churn. (D-013a's forward-migration still governs *shipped* saves.)
- **Why:** Speed + teleport unblock fast playtest/QA of any rung or tier without hand-grinding; a rich console isn't worth it yet. Writing migrations across volatile dev schemas is wasted effort with zero users — wipe now, and invest the migration rigor where it counts (the real launch-onward path).
- **Consequences:** **REFINES D-013a** (its forward-migration chain now scopes to shipped/launch saves; dev/v0.2 saves are wiped at the reshape bump; annotated there). The speed toggle is shared with **ADR-056**; both dev tools extend the DEV-only `window` play-API and are stripped from prod. Build + test `migrate()` before launch (a launch gate). prd.md **§6.8 (saves) / §6 (dev API)**. **PRD/docs/code application PENDING.** Per **ADR-022**, governs.

### ADR-068 ✅ — A synthesized traditional Japanese SFX palette; a minimal SFX pass before the R1 taste call
- **created_date:** 2026-06-29
- **Context:** **ADR-041** put a small synthesized Web Audio set in scope but didn't fix the palette or the timing. The human chose both: a traditional Japanese instrument palette, and a minimal SFX pass before the human's R1 taste verdict.
- **Options:** *Palette* — generic UI blips · **a traditional Japanese instrument palette** · a full orchestral bed. *Timing* — full bed up front · **a minimal SFX pass before R1, the full bed later** · audio last.
- **Decision:** **A synthesized traditional Japanese SFX palette** — **taiko** (combat), **shamisen / koto** (UI/deeds), **shakuhachi** (big beats), **temple bell / 鈴** (rank-ups) — anti-slop, matching the game's period fiction and restraint discipline (originally anchored to the woodblock bible ADR-018; the anchor is now the Andon Steel bible per ADR-144 — the PALETTE choice survives the reskin because it is diegetic, not visual). A **minimal SFX pass** (hit / reward / rank-up cues) lands **before the R1 taste call**; the full synthesized bed comes later.
- **Why:** A traditional palette is the audio analogue of the game's visual restraint discipline — the defence against generic-AI-slop in sound; landing minimal SFX before R1 gives the human's taste verdict real audio to judge without blocking on the full bed.
- **Consequences:** Sequences within **ADR-041**'s in-scope audio (annotated there); drives the minimal SFX pass ahead of R1. Web Audio synthesis (honours ADR-041's synthesized-audio posture). prd.md **§ audio**. **PRD/docs/code application PENDING.** Per **ADR-022**, governs.

### ADR-069 ✅ — Durable-by-default: a plan/brainstorm/analysis is a committed FILE before it's a deliverable
- **created_date:** 2026-06-29
- **Context:** The Operating-Model-v2-lite reel-back existed only in session context, not as a committed file — a near-miss showing work can be lost if it isn't on disk. (A durable-process decision, already applied to CLAUDE.md this session.)
- **Options:** (A) capture plans/analyses inline in chat / a ledger · (B) **a plan/brainstorm/analysis is a committed FILE before it's a deliverable or implemented**.
- **Decision:** **(B)** Durable-by-default: a plan/brainstorm/analysis is a **committed file** before it's a deliverable or implemented — never only in chat or a ledger. Homes: **`project/brainstorms/`** (discovery) · **`docs/plans/`** (plans/reel-backs) · **`docs/`** (settled).
- **Why:** Session context is ephemeral — it dies with the session or a compaction; a committed file is the only durable record. The v2-lite near-miss proved the rule's worth.
- **Consequences:** Already applied to **CLAUDE.md** (the durable-capture + temp-files conventions); recorded here as durable process canon. `docs/plans/` joins `project/brainstorms/` and `docs/` as a recognised home. Per **ADR-022**, governs.

### ADR-070 ⛔ — Operating Model v2 deferred as a bundle; process improvements adopted ad hoc (closes HD-7/HD-9/HD-10) — REVERSED by ADR-072 (2026-06-29)

> ⛔ **Reversed 2026-06-29 by [ADR-072].** The human reopened op-model v2 as **"v2 FINAL"** this session and
> **adopted** the bundle — full-`verify` pre-commit (ADR-072), the mandatory `diverge` gate (ADR-073), the
> `playcheck` ratchet (ADR-074), the fun-slice roadmap re-axe (ADR-060). The deferral + the "diverge/playcheck
> **HELD**" stance recorded below **no longer hold**. History kept intact (annotate-don't-delete).

- **created_date:** 2026-06-29
- **Context:** **HD-10** queued the full **Operating Model v2-lite** bundle (the keystone process overhaul — pre-commit `verify`, `playcheck` ratchet, mandatory `diverge` gate, ship-gate, re-axed roadmap) for a separate human review; **HD-7** (a bespoke `ship-gate` skill) and **HD-9** (a `resolve-queue` skill) were absorbed into it. The human walked the queue live (2026-06-29 HD-item session) and decided the bundle's adoption.
- **Options:** (A) adopt the v2-lite bundle wholesale · (B) **defer the bundle; greenlight useful pieces ad hoc** · (C) reject outright.
- **Decision:** **(B)** **Defer** the v2-lite bundle. **Not a freeze** — useful pieces are greenlit piecemeal as they come up (the `tdd` skill and the lean pre-commit gate **ADR-071** were both greenlit this way). **HD-7 and HD-9 both resolve to DON'T-BUILD:** **ADR-054**'s milestone-integrity policy + CI-manifest check already own the ship-gate *policy* (no bespoke skill), and decision queues are resolved **by hand** (demonstrated this very session via `AskUserQuestion`).
- **Why:** The bundle's value is real but unproven and its harness cost is ~1 week; piecemeal adoption captures the wins without committing to the whole. Bespoke automation (ship-gate, resolve-queue skills) isn't worth building until the pain actually recurs.
- **Consequences:** **Closes HD-7, HD-9, HD-10.** The mandatory `diverge` UI gate (DS#10) and the `playcheck` ratchet remain **HELD** (not adopted) and ride with the fuller v2-lite if it's ever revisited — the trigger is the hand-holding cost resurfacing. Intent: [`../../project/feedback-human/2026-06-29-h-item-decisions.md`](../../project/feedback-human/2026-06-29-h-item-decisions.md). Per **ADR-022**, governs.

### ADR-071 ⛔ — A lean, content-aware (<5s) pre-commit gate (the one v2-lite piece greenlit; built) — REVERSED by ADR-072 (2026-06-29)

> ⛔ **Reversed 2026-06-29 by [ADR-072].** Measurement showed the **full `verify` runs in ~3s**, so the
> content-aware *subset* was replaced by running the **whole** suite every commit (incl. the test suite this
> hook deliberately skipped — its blind spot) + a drift guard. The journal-hygiene gate is **retained**.
> History kept intact.
- **created_date:** 2026-06-29
- **Context:** The single Operating-Model-v2 piece the human greenlit (reshaped to a lean spec — forks **D-a/D-d** in the 2026-06-29 HD-item session), separable from the deferred bundle (**ADR-070**). Evidence it was needed: MS1 shipped with claimed pacing/fun instrumentation absent and the audit found a false-green test suite.
- **Options:** (A) run the full `verify` (test suite) on every commit · (B) **a content-aware fast (<5s) subset that runs only what's relevant to the staged files** · (C) no gate (keep the journal-only hook).
- **Decision:** **(B)** A content-aware **<5s** pre-commit subset: staged `.ts` → `tsc --noEmit`; staged `.ts/.md/json/css/html` → `prettier --check` (staged only); staged `src/**` → a pure-core **boot smoke**; then the unchanged journal-hygiene gate. **NOT the full test suite.** Bypass: `SKIP_VERIFY=1` (checks) / `SKIP_JOURNAL=1` (journal).
- **Why:** A fast gate runs on every commit without friction; the full suite is too slow for a per-commit gate (it belongs in CI / `verify`). The pure-core boot smoke catches "dumb stuff" (a core that won't boot) cheaply.
- **Consequences:** **Built this session** — [`../../.githooks/pre-commit`](../../.githooks/pre-commit) + [`../../src/scripts/smoke.ts`](../../src/scripts/smoke.ts), measured **~0.87s** on a TS+core commit. Complements **ADR-054** (milestone-integrity / CI-manifest, which stays the heavier CI-side check). The fuller `playcheck` ratchet stays deferred with the v2-lite bundle (**ADR-070**). Intent: [`../../project/feedback-human/2026-06-29-h-item-decisions.md`](../../project/feedback-human/2026-06-29-h-item-decisions.md). Per **ADR-022**, governs.

### ADR-072 ✅ — Operating Model v2 ADOPTED ("v2 FINAL"): full-`verify` pre-commit + a 5s drift guard (supersedes ADR-070, ADR-071)
- **created_date:** 2026-06-29
- **Context:** ADR-070 *deferred* the v2-lite bundle and ADR-071 built a content-aware **<5s subset** hook (deliberately **not** the test suite). This session the human reopened the question as **"Operating Model v2 FINAL"** and directed building it — full `verify` in pre-commit (5s budget), `playcheck`, the mandatory `diverge` gate, the fun-slice roadmap re-axe — and explicitly noted the existing hook to upgrade. Newest-human-steer-wins.
- **Options:** (A) keep ADR-070's deferral + ADR-071's subset · (B) **adopt v2 FINAL — run the full `verify` every commit (measured ~3.2s, fits the 5s box) + a noisy-but-non-blocking drift guard.**
- **Decision:** **(B).** Pre-commit runs the **full `pnpm run verify`** (~3.2s measured — incl. the test suite ADR-071 skipped, its blind spot), wrapped in a soft 5s **drift timer** (green/amber/red; logs `tmp/precommit-timings.tsv`; **never blocks on time**). `SKIP_VERIFY=1` bypasses a docs-only commit. The hard budget check is the explicit **`pnpm run verify:budget`** (per-gate breakdown + median-of-3); a non-blocking `pre-push` surfaces it loudly. Principle: noisy about drift, never blocking the task in flight.
- **Why:** Measurement reversed ADR-071's premise — the whole suite runs in ~3s, so the content-aware subset bought nothing and cost the test-suite blind spot. Run everything; let the drift guard catch the budget creeping as the codebase grows.
- **Consequences:** **⛔ REVERSES ADR-070 and ADR-071** (both annotated). Built this session: [`../../.githooks/pre-commit`](../../.githooks/pre-commit), [`../../src/scripts/verify-run.ts`](../../src/scripts/verify-run.ts), [`../../.githooks/pre-push`](../../.githooks/pre-push). **Un-holds** the `diverge` gate (**ADR-073**) and the `playcheck` ratchet (**ADR-074**) that ADR-070 had held; the roadmap half is **ADR-060**. Plan: [`../../project/archive/2026-06-29-operating-model-v2-final.md`](../../project/archive/2026-06-29-operating-model-v2-final.md). **Refined 2026-06-29:** the gates run in **PARALLEL** via `verify-run.ts` (comfortably under the 5s box; exact wall-time drifts as the codebase grows — check it with `verify:budget` = `verify-run --budget`, don't hard-code a figure). Per **ADR-022**, governs. **⤴ REFINED by ADR-176 (2026-07-10):** budget is now **5s soft / 8s HARD** (pre-commit BLOCKS past 8s — the drift guard is no longer "never blocks on time"), and the `vitest` gate splits into a fast **commit lane** (skips `// @slow` full-arc/full-mount tests) + a **full push/CI lane** (`VERIFY_FULL=1`).

### ADR-073 ✅ — Design by divergence: a mandatory `diverge` gate for new/major UI surfaces (branch-preserved)
- **created_date:** 2026-06-29
- **Context:** DS#10 locked the `diverge` skill as a mandatory UI gate, but ADR-070 held it unadopted; the v2-FINAL adoption (**ADR-072**) un-holds it. The risk the human flagged: self-pick + an HR-item means losing variants pile up as **feature-flag debt** that rots the build.
- **Options:** (A) one-idea UI (status quo) · (B) opt-in variants · (C) **mandatory 2–3-variant `diverge` with a bounded, branch-preservation flag model.**
- **Decision:** **(C).** No new/major UI surface ships from a single idea: `diverge` generates 2–3 distinct *approaches* → headless contact sheet → **self-picks** (autonomy) → files an **HR-item** for human override (never blocks). **The winner collapses into `main` flag-free; losing variants live on a retained `diverge/<surface>` branch + committed screenshots** → `main`'s resting flag-debt is **zero**. Caps: 3 open diverges, 2 durable kept-flags. One-line tweaks exempt.
- **Why:** The human wants to see "3 of everything" for taste/anti-slop, but mandatory variants must not rot the build — branch-preservation gives true live A/B with zero `main` debt.
- **Consequences:** Promotes **DS#10** to canon (was HELD by ADR-070). Skill: [`../../.claude/skills/diverge/SKILL.md`](../../.claude/skills/diverge/SKILL.md); registry [`../../project/audit/variants-log.md`](../../project/audit/variants-log.md). Supporting infra (`qa-shots --variant`, `variant-gc.mjs`, the pre-commit isolation guard) builds JIT on the first diverge. CLAUDE.md gains the rule. Per **ADR-022**, governs. **⤴ REFINED by ADR-075 (2026-06-30):** variants now live in-codebase behind a **DEV-panel toggle** (not branch screenshots); full 2–3 variants always (**diverge-LITE retired**); **one review.md line item per variant**.

### ADR-074 ✅ — Experience is a continuous ratchet (`playcheck`), scoped to the proxies nothing else gates
- **created_date:** 2026-06-29
- **Context:** The fun-factor §3 vector was slated to "become a gate at MS6"; with v2 adopted (**ADR-072**) it becomes **continuous**. ADR-070 had held the `playcheck` ratchet.
- **Options:** (A) audit fun manually at a milestone · (B) **a scoped headless ratchet in `verify` every commit.**
- **Decision:** **(B).** `playcheck` asserts the §3 vector headlessly over the **real engine**, **scoped** to the two proxies nothing else gates — `firstActionMs` (the <5s cold-open hook) and `maxDeadTimeMs` (no-dead-time) — with a 3×-baseline / 2s-floor ratchet + a 5s hard cap on the hook. `minutesPerRung` stays owned by `pacing:check` and the combat win-curve by `m2.test` (no double-gating). Absolute per-slice thresholds attach when a roadmap fun-slice ships.
- **Why:** Hollowness should fail the build *continuously*, not wait for a milestone audit; scoping avoids redundancy with the gates that already exist.
- **Consequences:** Un-holds the `playcheck` ratchet (was HELD by ADR-070). Built: [`../../src/playcheck.ts`](../../src/playcheck.ts) + `playcheck.baseline.json` + a teeth test, wired into `verify`. The deferred ~4 proxies + threshold mode ride the roadmap's fun-slices (**ADR-060**). Per **ADR-022**, governs.

## ADR-075…ADR-080 — 2026-06-30 R4, variant-process & operating-philosophy decisions (post-v0.3-playtest, human-steered) ⏳ build PENDING

> Source capture: [`../../project/feedback-human/2026-06-30-r4-playtest-decisions.md`](../../project/feedback-human/2026-06-30-r4-playtest-decisions.md).

### ADR-075 ✅ — Diverge v2: full variants, live in a DEV panel, one review item per variant (refines ADR-073)
- **created_date:** 2026-06-30
- **Context:** v0.3's diverges exposed two gaps in ADR-073. (a) Under the overnight time-box, three breadth surfaces shipped a single-idea **"diverge-LITE"** instead of 2–3 variants — the human rejected the shortcut (_"full 2–3 variants or nothing"_). (b) Branch-preserved **screenshots** are not how the human reviews taste — they can't *see* a variant in the running UI (_"how do I view variants… can we have a dev panel… add all the variants with a toggle"_).
- **Options:** (A) keep ADR-073 (branch + screenshots) · (B) variants live in-codebase behind a DEV-only toggle, reviewed live in the UI · (C) ship all variants to prod behind a flag.
- **Decision:** **(B), refining ADR-073.** Every new/major UI surface still gets **FULL 2–3 working variants** — **"diverge-LITE" is RETIRED** (no single-idea shortcut, no buggy variants shipped). Variants now live **in the codebase**, switchable at runtime via a **DEV panel** (DEV-only, `import.meta.env.DEV`, stripped from prod) — the human reviews them **live in the running UI**. **Each variant in the codebase = its own line item in `human-in-the-loop/review.md`** (reviewed/picked per variant via the toggle). The agent still self-picks a coherent prod default; the toggle keeps the alternates for review until the human confirms.
- **Why:** The human reviews taste by *seeing it move*, not via screenshots; the shared working tree also makes ADR-073's `diverge/<surface>` branch-switching unsafe (v0.3 already fell back to folder/screenshot preservation). DEV-only variants give live A/B with **zero PROD flag-debt** (prod ships only the default).
- **Consequences:** **REFINES ADR-073** (annotated there): branch-preservation → in-codebase DEV-toggle; "zero main flag-debt" → "zero **PROD** flag-debt" (DEV carries the toggles). Build a **DEV panel** (the speed toggle + teleports + the variant switches). Update the `diverge` SKILL.md (kill LITE; add the panel + per-variant review item), the variants-log, CLAUDE.md, and review.md. Per **ADR-022**, governs.

### ADR-076 ✅ — Combat is HP-attrition; NO auto-heal; a lost fight stops autopilot (R4#3)
- **created_date:** 2026-06-30
- **Context:** v0.3 auto-combat auto-heals between fights + only fights the matchup you pick, so the ADR-050 "a fight you might lose" tension became background maintenance (battery MAJOR / R4#3).
- **Decision:** A fight is a visible **HP-attrition exchange** — you attack, the enemy attacks back, both lose HP until one reaches **0 = death**. The auto-loop must **NOT auto-heal** (remove the `main.ts` HP-management). Reaching **0 HP = a lost fight**, and a loss **stops auto-combat** (no grinding at the floor). Eating is still the only mend (ADR-050), now a real pre-fight decision.
- **Why:** Verbatim human direction; restores the stakes — combat is something you can lose, and you must choose to heal (eat) before risking a fight. Supersedes the v0.3 auto-heal loop.
- **Consequences:** Rework `fight.ts` (ensure the attrition model is legible) + the `main.ts` auto-loop (drop auto-heal; stop autopilot on a loss). Re-bless playcheck/pacing if the win-curve shifts. Per **ADR-022**, governs.

### ADR-077 ✅ — Standing/pillars are DEED-based (never wealth); koku is a tight, sink-heavy economy (R4#6)

> 🔁 **Split / re-scoped 2026-07-02 by [ADR-107].** The **deed-based-standing** clause becomes the
> **koku law** (standing = the koku prestige score, earned by DEEDS, never by wealth). The
> **tight, sink-heavy economy** clause re-labels **koku → COIN** (COIN is the deliberately scarce
> currency — not rich until T5). RICE is now its own resource; koku standing is immune to wealth.
- **created_date:** 2026-06-30
- **Context:** v0.3's estate deed is a flat per-act value (good) but koku has too few sinks (~1378 lifetime) and surplus materials pile up; the battery asked whether to couple wealth→standing. The human said NO.
- **Decision:** **Standing and the House-Influence pillars stay purely DEED-based** (earned by actions) — **never** coupled to koku/wealth. Separately, **koku is a deliberately tight economy: always more sink opportunity than income**, so the player is **not rich until T5**. (This reframes "koku runs dry / surplus materials" as INTENDED — add more sinks so koku is always worth spending.)
- **Why:** Verbatim human direction; keeps the moral/perseverance spine (you rise by deeds, not by getting rich) and makes koku a meaningful constrained resource through T0–T4.
- **Consequences:** Do NOT add a koku→deed commission. Add koku sinks (a second craft recipe / material-funded repair / upgrades / market depth) + retune income vs. sinks so net koku stays low. Reaffirm the no-wealth-coupling in the pillar/ascension code (already true). Re-derive at the balance gate (liquid, ADR-059). Per **ADR-022**, governs.

### ADR-078 ✅ — At least one breadth surface is LOAD-BEARING; first = a map node gating a deed/yield (R4#5)
- **created_date:** 2026-06-30
- **Context:** v0.3's map gates nothing mechanically, the lone quest + market are one-time reveals (battery "breadth-as-chrome" / R4#5). The human chose to fund ≥1 load-bearing surface, starting with the map.
- **Decision:** T0 breadth is **not pure chrome** — **≥1 surface carries mechanical weight**. **First: a map node gates a deed source or a better yield** (walking there unlocks it), tying the **map to standing via deeds** (per ADR-077, not koku). Others (quest branch, etc.) can follow.
- **Why:** Human direction; gives the map a real reason to exist + a first taste of place-gated progression. Consistent with ADR-077 (deed-based standing).
- **Consequences:** Add a deed/yield gated on a map node (`content/map.ts` + the labour/deed path). The post-ascension stale-panel (R4#5-adjacent) is folded into the breadth/after-state work. Per **ADR-022**, governs.

### ADR-079 ✅ — The sim is ACTIVE-ONLY (pause on hidden); resolves the ADR-053 contradiction (R4#1)
- **created_date:** 2026-06-30
- **Context:** ADR-053 (decisions.md) read as "advance by wall-time, a hidden tab catches up" in one place and "reaffirms active-only" in another; the code pauses on `document.hidden`. A signed lock pulled apart from itself + the build (battery MAJOR / R4#1).
- **Decision:** **Active-only is canon** — the sim **pauses on `document.hidden`**, NO offline/background catch-up. The code is correct; the contradictory ADR-053 wording is what's fixed. Consistent with ADR-013 (active-only, "growth only through perseverance").
- **Why:** Human direction; the active-only pillar is core (you must be playing). No code change — a documentation fix.
- **Consequences:** Annotate/fix ADR-053's text to read active-only-pause (drop the "wall-time catch-up" phrasing). No code change. Per **ADR-022**, governs.

### ADR-080 ✅ — There is no clock, and there are no shortcuts (operating philosophy)
- **created_date:** 2026-06-30
- **Context:** In the v0.3 overnight build (session-19), an autonomous `/loop` finished its real work in a fraction of its window, then acted as if the window were expiring — and under that **self-imposed, nonexistent time-box** shipped three single-idea "diverge-LITE" panels (the shortcut **ADR-075** retired). The agent paid real quality for an imaginary clock; the shortcut bought nothing.
- **Decision:** **Delete the clock, don't manage it.** The agent must **never perceive a deadline / time-box** and **never take a shortcut** (ship below the bar to save effort). Corollaries: **partial & excellent beats complete & compromised** — a half-finished loop with zero shortcuts is a success, a fully-finished loop with one lazy corner is a failure; and **pragmatism (sensible defaults) and stopping-when-done are NOT shortcuts** (the bar cuts both ways — never drop below it to save time, never gild above it to fill time). "Done" is gated by correctness + the quality bar + whether real value remains, **never by the clock**.
- **Why:** Verbatim human direction — *"I prefer correct & slow over shitty & fast"*; *"even if it's only done half the loop by the time I'm back, I'm happy — if there are no shortcuts or lazy behaviour."* Removes the completion pressure that caused the v0.3 shortcuts.
- **Consequences:** New canon doc [`../philosophy/no-clock-no-shortcuts.md`](../philosophy/no-clock-no-shortcuts.md) (the full philosophy) + a short inline `## Philosophy` lead at the top of AGENTS.md. **Generalises ADR-075** (no diverge-LITE) to all work. Per **ADR-022**, governs.

## ADR-081…ADR-085 — 2026-06-30 the operating-philosophy register (session-26 mine, human-curated)

> A 41-agent repo-wide `Workflow` mine surfaced 30 candidate philosophies; the human curated them into a **6-philosophy register** (R1–R6) in [`../philosophy/`](../philosophy/README.md), each summarised in the AGENTS.md `## Philosophy` section. Bar for inclusion (human): _"something a philosopher might say — how/why/what to reason"_ — so mechanics, git/tool-usage, and engineering guidelines were **demoted to AGENTS.md** (small commits, shared-tree git safety, pure-core, single-source-of-truth, the human's-intent-is-canon governance rule, repo-is-the-memory, the enforcement ladder), and game-design/world canon stayed in the PRD/fun-factor. Source: [`../../project/brainstorms/2026-06-30-operating-philosophies.md`](../../project/brainstorms/2026-06-30-operating-philosophies.md). R1 is **ADR-080**.

### ADR-081 ✅ — Verify, don't trust (operating philosophy R2)
- **created_date:** 2026-06-30
- **Context:** The session-26 mine surfaced "verify, don't trust" as the unwritten **second seed** (the epistemic twin of ADR-080), scattered across the battery skill, qa-playtesting §0, and the "verify before you claim" checkpoint rule. The human scoped it to work you did **not** author — existing files, written canon, other agents' work (the self-facing twin is **R3 / ADR-082**).
- **Decision:** A maker is blind to their own gaps and can't trust provenance they can't see, so existing files, canon, and other agents' work are **checked, not trusted** — against independent eyes / the gates / reality. Self-review is necessary, never sufficient. _The map is not the territory_: a doc is a claim about the build; where they differ, the build wins (fix the doc).
- **Why:** Human-curated from the mine; grounds the battery's no-self-grading rule and the ADR-079 doc-vs-build resolution (a signed ADR described the opposite of what shipped).
- **Consequences:** New canon doc [`../philosophy/verify-dont-trust.md`](../philosophy/verify-dont-trust.md) + a paragraph in the AGENTS.md `## Philosophy` register. Per **ADR-022**, governs.

### ADR-082 ✅ — Done is earned, not declared (operating philosophy R3)
- **created_date:** 2026-06-30
- **Context:** From the mine, the human split two facets out of R2 into a distinct **self-facing** philosophy — skepticism toward your **own** apparent success (vs R2's skepticism toward others' work). Merges _done means done_ (honest reporting / ADR-054) + _checks with teeth_ (a green must be able to go red).
- **Decision:** Be skeptical of your own green. Never claim done/green/shipped unless literally, verifiably true (lead with what's missing, never push red); a green check counts only if it drives the **real** player path and **could actually have gone RED**. A false green is worse than no check.
- **Why:** Human-curated; grounds **E1** (_"a test that can't go RED is worse than no test"_) + **ADR-054** (SHIPPED-slice banned).
- **Consequences:** New canon doc [`../philosophy/done-is-earned-not-declared.md`](../philosophy/done-is-earned-not-declared.md) + a paragraph in the AGENTS.md register. Twin of **R2 / ADR-081**. Per **ADR-022**, governs.

### ADR-083 ✅ — Bias to motion: act, self-vet, surface (operating philosophy R4)
- **created_date:** 2026-06-30
- **Context:** From the mine; the human kept the human-steers / agent-executes division of labour as a philosophy and chose the phrasing _"bias to motion: act, self-vet, surface."_
- **Decision:** The human owns direction, taste & the irreversible; the agent owns execution — reversible progress by default, self-picked defaults, self-vetted work, every fork **surfaced for async override** rather than waited on. Never block; never silently decide. Absorbs _autonomy is a feedback-loop problem_ (the why) and the HITL queue (the machinery).
- **Why:** Human-curated; the 7k-PRD-bought-less-autonomy lesson (operating-model-v2) + the diverge self-pick→HR-item pattern (ADR-075).
- **Consequences:** New canon doc [`../philosophy/bias-to-motion.md`](../philosophy/bias-to-motion.md) + a paragraph in the AGENTS.md register. Per **ADR-022**, governs.

### ADR-084 ✅ — If it isn't fun, it isn't finished (operating philosophy R5)
- **created_date:** 2026-06-30
- **Context:** From the mine; the product bar (fun & intentional), scattered across **ADR-019**, fun-factor, qa-playtesting, ui-design — with no consolidated north-star. The human chose the phrasing.
- **Decision:** A compiling build is the floor; the bar is paced, genuinely fun, intentional (woodblock/ink, not AI-slop). Fun is a hypothesis tested by play — proxies prove its absence, only a human certifies its presence. Absorbs _intentional craft over generated defaults_ (lock the design language first) and _the player gets the real game_ (DEV conveniences stripped from prod).
- **Why:** Human-curated; ADR-019 + fun-factor §3 + ui-design §9.
- **Consequences:** New canon doc [`../philosophy/if-it-isnt-fun-it-isnt-finished.md`](../philosophy/if-it-isnt-fun-it-isnt-finished.md) + a paragraph in the AGENTS.md register. Per **ADR-022**, governs.

### ADR-085 ✅ — If a player can't reach it, it doesn't exist (operating philosophy R6)
- **created_date:** 2026-06-30
- **Context:** From the mine; "build discipline," sharpened by the human with the **definition of done = player-reachable**.
- **Decision:** What counts as **built** is what a human player can reach. A change living only in TypeScript — no UI, not reachable in the live MCP playtest (Playwright / Chrome-DevTools) — is **not done**; the unit of progress is a fun-complete vertical slice a player can see and use. Absorbs _lean_ (everything earns its place; `G-NO-DEAD-VALUES`) and _diverge before you converge_ (ADR-075).
- **Why:** Verbatim human direction (_"build ones that can be accessed by human players… not features that live in the typescript files"_); **ADR-078** (load-bearing breadth); the roadmap fun-slices.
- **Consequences:** New canon doc [`../philosophy/if-a-player-cant-reach-it-it-doesnt-exist.md`](../philosophy/if-a-player-cant-reach-it-it-doesnt-exist.md) + a paragraph in the AGENTS.md register. Per **ADR-022**, governs.

## ADR-086…ADR-088 — 2026-06-30 v0.3 process-learnings adoption (human-steered)

> The human read the v0.3 retrospective ([`../../project/brainstorms/2026-06-30-v03-process-learnings.md`](../../project/brainstorms/2026-06-30-v03-process-learnings.md)) and steered which learnings to adopt and how (capture: [`../../project/feedback-human/2026-06-30-process-learnings-decisions.md`](../../project/feedback-human/2026-06-30-process-learnings-decisions.md)). **Guardrail the human set:** an ADR records a decision the _human_ made — so a retrospective does **not** dump 30+ ADRs; only genuine human decisions earn one, the rest fold into living docs / skills as norms. These three are the human's decisions; the F/E/P + A1–A23 learnings land as norms (see the capture).

### ADR-086 ✅ — Tension over generosity is the default design bias
- **created_date:** 2026-06-30
- **Context:** The retro's sharpest fun insight (A3): left to defaults, the agent builds **generosity** — it shipped auto-heal + autopilot + a loose economy, and the human had to push for no-auto-heal / fight-to-death / loss-stops-autopilot / tighter koku (ADR-076, ADR-077). Generosity was the silent default; tension had to be fought for each time.
- **Decision:** **Tension & scarcity are the default; generosity is a thing to JUSTIFY, never a safe default.** When a design choice trades difficulty/scarcity for comfort (auto-heal, autopilot convenience, a forgiving economy, a removed fail-state), that is a decision to surface and justify against the fun bar — not a default to reach for. Stays inside the existing hard guardrails (every fight winnable, soft-setback only, no permanent loss / no stranding — ADR-061): tension pulls the player to engage, it never pushes them out.
- **Why:** Human chose "make it canon." Grounds ADR-076 (HP-attrition, no auto-heal) and ADR-077 (tighten koku) as instances of a general stance, not one-offs.
- **Consequences:** A `fun-factor.md` canon line + a battery **`tension/scarcity`** lens (generosity-creep is a finding, not a feature). Per **ADR-022**, governs.

### ADR-087 ✅ — Autonomous-loop done-rule: keep finding work, flag low-value honestly
- **created_date:** 2026-06-30
- **Context:** The retro's P3: a long autonomous `/loop` drifts toward gold-plating once the high-value backlog runs dry — each tick the agent re-derives "is there real value left, or am I polishing?" The doc proposed a hard "stop when dry"; the human chose otherwise.
- **Decision:** When the high-value backlog runs dry, the loop **keeps finding work rather than idling** — but **flags low-value ticks honestly** (names a marginal tick as marginal) instead of dressing busy-work up as high-value. Motion + honest labelling over a hard stop. (PH3 done-is-earned applies to the labelling: never call a marginal tick high-value.)
- **Why:** Human chose "keep finding work." Tempers P3; pairs with R4 (bias to motion) + R1 (no clock — the window is an invitation to do excellent work, not a countdown).
- **Consequences:** A working-agreements line on the loop done-rule. Per **ADR-022**, governs.

### ADR-088 ✅ — A full-arc e2e + invariants test per tier is a hard DoD contract
- **created_date:** 2026-06-30
- **Context:** The retro's E2/AC-17: the end-to-end `t0-arc.test` + `invariants.test` (real-intent cold-open → ascension; no-NaN / write-once / monotonic-clock over the whole arc) gave more confidence than any fragment test, ran in ~30 ms, and are RED-able — they prove the **seams** between fragment tests hold. But in v0.3 they were authored late, not from the first milestone.
- **Decision:** **Every tier ships a full-arc e2e test + an invariants test, named in its FIRST milestone's DoD** — not bolted on at the end. Backstopped by **ADR-054** milestone-integrity (a DoD that names a test which doesn't resolve can't pass silently). **Ration gate-time** (AC-17): full-arc/invariant tests can be O(n²) and spend the verify budget — optimize them (the 1 s → 169 ms win) and tag them `// @slow` to lane them to push/CI when they can't fit the commit budget (5s soft / 8s hard, ADR-176).
- **Why:** Human chose "hard DoD contract." Extends ADR-054 from feature-completeness to playtestability; the cheapest playtestability guarantee we have.
- **Consequences:** An AGENTS.md `Test discipline` convention line + the `tdd` skill's deep procedure; roadmap per-tier DoDs name the two tests. **Enforcement (human, 2026-06-30, "your rec then yes"):** the **milestone-integrity gate** (battery #20, v0.3.1 Step 7) is the teeth; **per-test RED-ability stays a NORM, deliberately not gated** (gating it would cry wolf — AC-11). Per **ADR-022**, governs; refines **ADR-054**.

### ADR-089 ✅ — Reading-queue sign-off is implicit; the agent keeps `todo-human.md` clean
- **created_date:** 2026-06-30
- **Context:** The `2026-06-30-stale-markdown-sweep` report sat in the reading queue across sessions even though all its agent-work had landed — the prior lifecycle ("removed when the human signs off") read as a **manual tick the human had to perform**, so a done-but-unacked doc looked identical to one with pending work, and the human did stale-triage by hand. The human's actual model: the reading queue is just **how the agent surfaces the markdown it generates** (in agentic / loop / ultracode runs) so nothing it made goes unseen.
- **Decision:** **Sign-off is implicit, and the agent owns keeping `todo-human.md` clean** — the human never manually ticks a reading-queue item. (1) **Populate:** docs the human hasn't opened/discussed are auto-added when authored (the existing pre-commit queue gate already does this). (2) **Clear:** the moment the human reads a queued doc **or it comes up in discussion / "let's work on this"**, the agent treats that as sign-off and removes it. (3) **Reconcile at exit:** the **Checkpoint ritual** gains a step — when run interactively (`/prepare-to-exit`), the agent presents the remaining queue and asks via **AskUserQuestion** which to sign off / remove (a batch sign-off the human explicitly preferred over silent auto-removal); an autonomous checkpoint clears only clearly-engaged docs.
- **Why:** Human steer (2026-06-30): *"If I read the doc, or we discuss the doc, then that's read/signed-off. I don't need to sign them off manually… I want todo-human kept clean… we can do the ask-user tool in prepare-to-exit to ask me if we can remove said md file."* This **supersedes the prior manual-sign-off lifecycle** (ADR-022 — newest human intent is canon). Preserves R3 (the human still certifies — the `/prepare-to-exit` prompt is the certification gate) while removing the human's triage chore.
- **Consequences:** Rippled to `todo-human.md` (header + reading-queue lifecycle), `repo-map.md` (queue description), and `working-agreements.md` (Checkpoint step 4). The `prepare-to-exit` skill stays copy-free — it inherits the new step from the ritual. **Enforcement:** a **norm** (judgment about "did the human engage with this doc" can't be soundly gated) backstopped by the interactive `/prepare-to-exit` reconciliation. Per **ADR-022**, governs.

## ADR-090…ADR-091 — 2026-07-01 v0.3.1 combat-feel build (batch-2 priming, human-steered)

> The human turned the v0.3.1 priming into a design session (two `AskUserQuestion` batches; capture: [`../../project/feedback-human/2026-06-30-v0.3.1-priming-decisions.md`](../../project/feedback-human/2026-06-30-v0.3.1-priming-decisions.md)). These two formalize the genuinely-new combat-feel decisions, built + shipped in v0.3.1 Step 3. They **refine ADR-076**.

### ADR-090 ✅ — A lost fight bites CARRIED wealth; the kura storehouse shelters BANKED (refines ADR-076)

> 🔁 **Re-scoped 2026-07-02 by [ADR-107].** The loss-bite is now a bite of **CARRIED COIN**
> (+ carried materials); **koku STANDING is immune to combat loss** (the House's assessed prestige
> is never spent or dropped in a fight). The kura shelters **banked COIN + RICE**. The
> carried-vs-banked split holds.
- **created_date:** 2026-07-01
- **Context:** ADR-076 made the fight HP-attrition with no auto-heal and "0 HP = loss stops autopilot," but left the loss COST as the old §4.6.6 "possible carried-loot drop." The human (batch-2) wanted the loss to actually bite (ADR-086 tension) — and, catching the agent's own word "unbanked," demanded a bank so the bite has a shelter to play against.
- **Decision:** A lost fight **drops a real bite of CARRIED wealth** — `LOSS_KOKU_FRAC` (~20%, "real bite") of carried koku + `LOSS_MATERIAL_FRAC` (~⅓, floored) of carried materials — and the **autopilot STOPS** (no auto-resume; you mend by hand + re-engage). Wealth splits **carried** (`state.resources`, at risk) vs **banked** (`state.banked`, the kura storehouse, SAFE); deposit/withdraw move between them, spending/earning use carried. **Step 5 gates deposit to the kura node** (return home to bank → fighting far with a full purse is the gamble). Still never a level/gear/Influence loss. The combat log is **summarised** (one outcome line per fight). Magnitudes liquid (ADR-059).
- **Why:** Human steer (batch-2 calls 2/4/7): "real bite… and you owe me a bank, lol." An instance of ADR-086 (generosity — a cost-free loss — is the thing to justify). Supersedes the old §4.6.6/§4.6.6b "self-recovering, loss-never-bites" loop.
- **Consequences:** Built in v0.3.1 Step 3 (`fight.ts` loss penalty; `state.banked` + `withBanked`; deposit/withdraw intents; the storehouse panel; `balance.ts` `LOSS_*_FRAC`). PRD §4.6.6/§4.6.6b/§4.6.6c rippled. RED-able guards in `combat-rework.test.ts`. Per **ADR-022**, governs; refines **ADR-076**.

### ADR-091 ✅ — Two auto-combat modes: fight-to-death vs auto-retreat@20% (refines ADR-076)
- **created_date:** 2026-07-01
- **Context:** With no auto-heal (ADR-076), HP accumulates and a ≥1-dmg foe eventually kills an unattended grind. The human wanted the player to OWN that risk rather than the loop auto-papering it (the old §4.6.6b "auto-retreat is the default common case").
- **Decision:** The auto-loop offers **two modes per foe**: **(1) auto-fight to the end** (grind until you win or die — a loss bites, ADR-090), and **(2) auto-fight, retreat @`AUTO_RETREAT_FRAC` (~20%)** — break off on a **turn** where HP drops below the threshold but is still > 0. The retreat is a **per-turn** check, so a burst foe that one-shots you past the threshold still **kills** you (a killing blow is a loss, not a flee). A flee earns no reward and **no penalty**, but you're hurt and the **autopilot stops**. The forecast keeps the to-death win-rate (retreat off), so the shown odds stay honest (AC-6). Threshold liquid (ADR-059).
- **Why:** Human steer (batch-2 call 6): "over-reaching only, BUT… two auto settings: [no end] / [auto retreat @20%]," with the explicit per-turn-burst caveat. Supersedes the old auto-retreat-by-default §4.6.6b.
- **Consequences:** Built in v0.3.1 Step 3 (`combat.ts` `resolveFight` retreatHp + `fled`; `state.autoCombatRetreat`; the `retreat` intent flag; two per-foe toggles). PRD §4.6.6b rippled. RED-able guards in `combat-rework.test.ts`. Per **ADR-022**, governs; refines **ADR-076**.

## ADR-092 — 2026-07-01 v0.3.1 koku economy tightening (batch-1 priming, human-steered)

### ADR-092 ✅ — Tighten the T0 koku economy: more sinks + a SOFT repair-fee (instance of ADR-086)

> 🔁 **Re-scoped 2026-07-02 by [ADR-107].** The tightened economy is the **COIN** economy (base
> unit *mon*) — the soft repair-fee, the estate-upgrade sink, and market depth are all priced in
> **COIN**, within the trade ≤⅓ cap. koku is now the House STANDING, not the currency being
> tightened; RICE is a separate resource.
- **created_date:** 2026-07-01
- **Context:** ADR-086 (tension > generosity) + the human's batch-1 call 4 wanted koku to feel scarce (more sinks than income; rich only at T5). The v0.3 T0 economy pooled koku — the estate + a tiny capped market were the only sinks. A first attempt at a HARD koku cost on repair softlocked an unlucky fresh L1 in the m2 no-stranding test (no early koku → can't repair → stranded), which ADR-061/ADR-086 forbid (tension must never push the player *out*).
- **Decision:** Tighten T0 koku with sinks across all three directions the human named: **(1)** repair charges a koku FEE (`REPAIR_KOKU_COST`) on top of wood — but a **SOFT** fee, **waived when you can't pay** (repair stays wood-gated; the koku bites only when you have it, so it can never softlock); **(2)** a **4th estate stage E4** (a deeper flywheel koku sink); **(3)** **market depth** (pricier capped goods), held inside the ADR-008 minority-lane cap (total market spend ≤ ⅓ of the estate sink — a RED-able invariant). All magnitudes liquid (ADR-059). **Deferred:** the 2nd craft recipe / material-surplus sink (battery #15) → Step 7; the §4 6-tier balance re-derivation → the final PRD-consistency pass (a finding: §4 is T1+ *pillar/tier* balance, not the T0 koku-sink *content* constants — a looser coupling than the plan assumed).
- **Why:** Human steer (batch-1 call 4, "all three directions") as an instance of ADR-086. The **soft** fee is the ADR-061/ADR-086-aligned way to add a real sink without a softlock — the design the no-stranding test forced.
- **Consequences:** Built in v0.3.1 Step 4 (`balance.ts` `REPAIR_KOKU_COST`; the repair soft-fee; `ESTATE_STAGES` E4; `MARKET_ITEMS` depth). RED-able guards in `economy.test.ts`; content docs regenerated. Per **ADR-022**, governs; instance of **ADR-086**.

## ADR-093 — 2026-07-01 v0.3.1 the T0 spatial-map model (batch-2 priming, human-steered)

### ADR-093 ✅ — T0 activities, foes & banking are SPATIAL: every activity is on one map node, there is no default node, and the map gates a load-bearing yield

> 🔁 **Re-scoped 2026-07-02 by [ADR-107].** The spatial map spine is unchanged; the resource nouns
> update — the load-bearing deep-satoyama node's "+koku" yield becomes a richer **COIN** (+ forage)
> yield, labour income is **RICE + a little COIN**, and kura banking shelters **COIN + RICE**.
> koku is the House STANDING, never a node/labour tick.
- **created_date:** 2026-07-01
- **Context:** T0 shipped a "small walkable estate map" (§1 vision, LOCKED) — but through v0.3 it was **cosmetic**: every labour, every foe, and the storehouse were reachable from any node, so walking gated nothing (battery **#13** — "the map gates nothing"). The human's batch-2 priming call made the map the **spatial spine**: "spread all the activities to only belong to one map node, and no default map node… combat happens on a map node… richer resource yields on different map nodes… the storehouse (bank) is at the kura."
- **Decision:** In T0, the map is **load-bearing** — every doable thing is **bound to a node**, and you **walk there to do it**:
  - **Activities are spatial** (5a): each labour has an `area`; `canDoActivity`/`availableLabours` gate on `state.location`, so the work tab lists only the current node's labours. No default node — you start at the **kura** (rake rice), then walk to the paddies to farm, the woodlot to cut, the satoyama to forage.
  - **Foes are spatial** (5b): each `MobDef` has an `area`; the `fight` intent no-ops off the foe's node; the combat "watch" shows only the foes present (`foesHere`); `move_to` ends the auto-grind you walk away from. The scripted grain-store wolf is faced only at the kura. `foeForecasts` stays location-INDEPENDENT (it's the win-rate CURVE the balance gates read; the spatial filter is the separate `foesHere`).
  - **Banking is spatial** (5c): the storehouse IS the kura (ADR-090), so you deposit/withdraw only while standing there — the balance shows everywhere (your safe reserve is worth seeing on the road), the action is kura-only.
  - **A load-bearing node gates a richer yield** (5d, satisfies **ADR-078**): a new **deep satoyama (奥山)** node, one hill past the near satoyama (behind the danger ring, at a higher satiety cost), gates `forage_deepwoods` (sansai 4 / koku 2 vs the near 2 / 1) and dens the boar — the map earns its walk, tying the spatial spine to the koku economy (ADR-092) and the combat cook-loop. Deeds-gating nodes are a T1+ concern (deeds are Phase-2).
  - **The focused-optimal auto-play policy became navigation-aware** and moved to `core/autoplay.ts` (the single source the pacing gate, playcheck, the e2e tests, and the DEV `__qa.toRung` climber all share) — it now walks to a labour's node before working it, so the harness models the real spatial path.
- **Why:** Human steer (batch-2 map call). Fulfils §1's "areas to explore" as real gameplay (PH6 — reachable, load-bearing) instead of chrome; clears battery #13.
- **Consequences:** Built in v0.3.1 Step 5 (`content/activities.ts`/`enemies.ts` `area`; `selectors.ts`/`intents.ts`/`combat.ts` gates + `foesHere`; the deep-satoyama node in `map.ts`/`areas.ts`/`surfaces.ts`/`ranks.ts`; `core/autoplay.ts`). The **ascension after-state** (FB-2 — "design the AFTER of every payoff") rode this step: once ascended the House-Influence panel resolves ("a man of the house, 家産 Risen" + the boon prompt + a to-be-continued frontier) instead of the stale "reach Excellent to ascend (480/480)" prompt. Map **presentation** ships as a ADR-075 diverge (default A "paths list"; B 絵地図 schematic + C 道中記 ledger DEV-only, per-variant HR-items). RED-able guards across `combat-rework`/`economy`/`map`/`render` tests. Per **ADR-022**, governs; implements **ADR-078**; composes with **ADR-090** (the bank) + **ADR-075** (the map variants).

## ADR-094 — 2026-07-01 v0.3.1 the reckoning cadence is a per-tier lever (battery #8)

### ADR-094 ✅ — The seasonal judge's CADENCE decouples from the 28-day calendar (a per-tier lever); the SHAPE stays canon
- **created_date:** 2026-07-01
- **Context:** The seasonal judged-appraisal (§4.2.2 / ADR-049) fired only on a **28-day season boundary**. But the T0 Phase-2 Estate deed-grind reaches EXCELLENT (the ascension gate) in **~5 days**, so in the compressed T0 showcase the judge fired **0×** before ascension — dead code on the optimal path (battery **#8**). A weekly (7-day) cadence would also miss (5 < 7). (The **AC-4 self-inflation** — re-judging its own payout — was a *separate* bug, already fixed: `pillars.ts` advances `judged` to the post-bonus high-water.) A diff re-audit (2026-07-01) flagged that the fix landed with only a code comment, contradicting the PRD's "fires every season / canon-fixed" language — hence this ADR + the §4.2.2 / §6 ripple.
- **Decision:** The judge's **SHAPE stays canon** (up-only, high-water-mark, no maintenance trickle, deeds-gated to Phase 2). Its **CADENCE becomes a per-tier LEVER** (liquid, **ADR-059**), decoupled from the 28-day `season()` **calendar** (which is unchanged): a new `PHASE2_JUDGE_INTERVAL_DAYS` (T0 = **3d**, tuned ≤ the grind's day-span so a reckoning is GUARANTEED before the gate) so the mechanic is actually FELT in the T0 miniature. It fires **1×** at day 3 — and that reckoning is what tips the estate to EXCELLENT, a clean showcase beat. **T1+, when Phase 2 is a long game, scales the cadence back toward the real 28-day season** (a per-tier concern for when T1 is built).
- **Why:** T0 is a "showcase-in-miniature" (ADR-052) — a T1+ mechanic (the seasonal reckoning) must be visible in the miniature, but a full season never turns in the ~5-day T0 tail. Making the cadence a per-tier lever shows the mechanic authentically in T0 without a speculative T1 re-tune. Fully liquid (ADR-059).
- **Consequences:** Built v0.3.1 Step 7 (`constants.ts` `PHASE2_JUDGE_INTERVAL_DAYS`; `step.ts` `onSeasonBoundary → onReckoning`; the log reframed off "the season turns"). RED-able integration test (`ascension.test.ts`) drives the real grind + asserts the judge fires/banks/logs before EXCELLENT. Rippled: PRD **§4.2.2** (shape=canon, cadence=lever) + **§6** (per-reckoning hook; also corrected the stale `pendingAppraisals`-counter description — the code folds one day at a time, no counter). Per **ADR-022**, governs; refines **ADR-049**; instance of **ADR-059**.

## ADR-095 — 2026-07-01 T0 material surplus is "working as intended" for the miniature (battery #15 / HD-11)

### ADR-095 ✅ — Accept the post-craft hardwood/sinew surplus in T0; the material economy is a T1+ concern (closes HD-11 = option C)
- **created_date:** 2026-07-01
- **Context:** After the one-time axe craft (`craft_wood_axe` = 3 hardwood + 1 sinew) combat keeps dropping hardwood/sinew that then pile up with no sink — battery **#15**. ADR-092 deferred "a 2nd craft recipe / material-surplus sink" to v0.3.1 Step 7, but on pickup every form of a sink grazed a lock: a **2nd craftable weapon** breaks **ADR-052** (T0 showcases exactly one craftable); a **materials→koku sale** or **materials-based repair** loosens the just-tightened **ADR-092** (scarce koku); a **repeatable consumable** dodges both locks but introduces a consumable-item system T0 doesn't have — itself a scope/taste question. So it was raised to the human as **HD-11** rather than solo-picked.
- **Decision:** **Option C** — accept the surplus as fine for a *tutorial*. T0 shows the loot→craft *taste* with one craftable (ADR-052; 🔁 "one" relaxed to "≥1 craftable" 2026-07-01 by **ADR-102**); a real material economy (multiple recipes, consumables, sinks) is exactly what **T1 "scales into depth."** Close battery **#15** as **working-as-intended for the miniature**, revisit at T1. No code change: no 2nd recipe, no drop-gating, no consumable slot in T0.
- **Why:** Human steer ("C for now", 2026-07-01) confirming the recommendation. Forcing an ongoing sink into the showcase-in-miniature (ADR-052) risks over-building the tutorial; the locks it would have to graze (ADR-052 one-craftable, ADR-092 scarce-koku) are load-bearing T0 taste. Deferring is the R6-lean call — build only what the miniature needs.
- **Consequences:** No T0 build. Battery #15 closes as WAI (not "fixed"). The material-surplus sink (2nd recipe / consumable / drop-gating) becomes an explicit **T1 design input** when the T1 material economy is scoped. Per **ADR-022**, governs; composes with **ADR-052** (one craftable) + **ADR-092** (scarce koku, which deferred this here); revisit at **T1**.

## ADR-096 — 2026-07-01 the displayed version is single-sourced from package.json, never git tags (HD-12)

### ADR-096 ✅ — `package.json` is the SINGLE SOURCE OF TRUTH for the displayed version; git tags are NOT read by the game/HTML/TS
- **created_date:** 2026-07-01
- **Context:** The built game footer showed **v0.2** even for the v0.3.1 build — `vite.config.ts` resolved `__VERSION__` from `git describe --tags --abbrev=0`, and the only tags were `v0.1`/`v0.2` (the build was never tagged v0.3.x). Meanwhile `package.json` said `0.3.0` (read by nothing for display) and every doc/journal said `v0.3.1` (convention, no code anchor) — three disagreeing numbers, the AC-21 single-source-of-truth invariant violated. Raised as **HD-12**.
- **Decision (human, 2026-07-01):** The **displayed version is single-sourced from `package.json`** (bumped to `0.3.1`); **git tags are never a source of truth for the game / HTML / TypeScript.** `vite.config.ts` now derives `VERSION = v${pkg.version}`; the git-derived **build stamp** stays but the SHA uses the **raw short hash** (`rev-parse --short HEAD`), not `describe --tags`, so no tag leaks into the display. `BUILD_VERSION` env still overrides for CI/reproducible builds. Footer verified: `v0.3.1 · build <sha> · <date>`.
- **Why:** A tag lagging the build (or an untagged build) must never mislabel what the player sees — the version the game reports should be the version the code declares (AC-21). Bumping `package.json` alone would have been a false fix (nothing read it for display); the real fix rewires the source. Tagging for real *releases* is orthogonal and stays a human call.
- **Consequences:** Built 2026-07-01 (`package.json` 0.3.0→0.3.1; `vite.config.ts` VERSION from package.json + tag-free BUILD_SHA; `src/vite-env.d.ts` comment). No git tag created (releases are a separate, human-owned step). Per **ADR-022**, governs; instance of the **AC-21** version-single-source convention.

## ADR-097 — 2026-07-01 the PRD is a standalone, END-STATE (v1.0.0) spec — no inline ADR refs / build-nuance (human steer)

### ADR-097 ✅ — Each PRD section reads as a STANDALONE, END-STATE v1.0.0 document; the ADR log holds the "why", the PRD holds the clean "what"
- **created_date:** 2026-07-01
- **Context:** The PRD (`docs/living/prd/§1–§7`) had accreted inline ADR references (D-xxx / H-xx), prototype build-nuance ("v0.3.1 Step 4", "the prototype", "as of this build"), and process/provisional scaffolding ("TBD — derives in the re-derivation", "RESHAPE NOTE", "Part-1 ripple", "Until the T1 pass read through this key", status banners) — especially §7 roadmap-scope, which reads as a doc re-touched at v0.2.0 / v0.3.0 / v0.3.1 rather than a description of the finished game. This couples the spec to the current prototype state and makes it hard to read as a spec.
- **Decision (human, 2026-07-01):** The PRD documents the **END STATE (v1.0.0)** and reads as a set of **standalone living documents** that cross-link to other `docs/` files for detail — but do NOT carry inline ADR numbers, prototype/build-state nuance, or provisional scaffolding. The **ADR log (this file) is the separate "why"**; the roadmap is the "how/when"; the PRD is the clean "what." **§7 describes v1.0.0's scope/shape**, not a per-build changelog.
- **Why:** A PRD is a spec of the finished product — a reader should see what v1.0.0 IS without decoding build history or chasing ADR cross-references. Separating the *what* (PRD) from the *why* (ADRs) and the *how/when* (roadmap) makes each document standalone and durable.
- **Consequences:** Triggers a PRD **transformation pass** — reconcile the PRD with the built game **BIDIRECTIONALLY / best-of-both** (PRD-stale claims update the PRD; good-but-unbuilt PRD *ideas* are KEPT and become build TODOs, never deleted to match a cruder implementation; genuine forks go to the human) **AND** strip ADR-refs / build-nuance / provisional-scaffolding and reframe every section to the v1.0.0 end-state. Refines **ADR-021**: the freeze CONCEPT (locked intent vs provisional route) survives, but the inline provisional-annotation STYLE is retired from the PRD prose (that bookkeeping lives in the roadmap + ADR log). Per **ADR-022**, this newest human steer governs. Plan lands in `docs/plans/` before the rewrite.

## ADR-098 — 2026-07-01 estate stages: rename the built koku PURCHASE ladder to a non-colliding namespace (closes HD-13)

### ADR-098 ✅ — Two distinct estate axes: keep the E0–E5 narrative CONDITION ladder; rename the built koku PURCHASE steps to `U1–U4` "kura-works"

> 🔁 **Re-scoped 2026-07-02 by [ADR-107].** The `U1–U4` "kura-works" are bought with **COIN** (not
> koku). The two-distinct-axes fix (narrative E0–E5 condition vs the U1–U4 purchase ladder) holds;
> only the purchase currency changes koku → coin. koku is now the House STANDING.
- **created_date:** 2026-07-01
- **Context:** Two different-axis schemes collided on the `E<n>` label (HD-13): the diegetic **condition** ladder (E0 Foreclosure's Edge → E3 Prosperous, E4–E5 parked for T4+ — the narrative *state* of the house) vs the built T0 **koku purchase** ladder (E1 patch-kura / E2 clear-drill-yard / E3 reclaim-shinden / E4 raise-long-house — the flywheel upgrades you *buy*). A code-E4 "Risen" sat in T0 while narrative-E4 "Fortified Seat" was parked for T4+; the code even reused condition labels as purchase-step names.
- **Decision (human, 2026-07-01):** Keep the two as **distinct axes**. The **narrative CONDITION stages stay `E0–E5`** (canon, ADR-033). The **built koku PURCHASE steps are renamed to a non-colliding namespace — `U1–U4` ("kura-works" / estate upgrades)**. Do NOT fold them together or renumber the narrative ladder.
- **Why:** The two measure genuinely different things — the *state* of the house vs the *upgrades you buy*. A shared label conflated them across 7 doc surfaces; a rename is the minimal, lossless fix.
- **Consequences:** Closes **HD-13**. BUILD TODO (v0.3.2): rename `estateStage`/E-labels in code (`content/estate.ts`, `render.ts` "E4 · Risen", tests) to the `U#` namespace. DOC: PRD/roadmap estate prose uses `E#` for the narrative condition, `U#` for the purchase upgrades. Refines **ADR-033** + **ADR-092**. Per **ADR-022**, governs.

## ADR-099 — 2026-07-01 player finances vs estate finances are separate lanes; T0 provisioning shop is a koku SINK (closes HD-14)

### ADR-099 ✅ — Player and estate finances are SEPARATE lanes; T0 ships a buy-only provisioning shop (personal koku sink); the T2 TRADE engine trades on the estate's behalf

> 🔁 **Re-scoped 2026-07-02 by [ADR-107].** The provisioning shop is a personal **COIN** sink (not
> koku); the player-vs-estate finance split is a **COIN** split (personal coin vs the estate's
> coin + rice). The TRADE engine (T2, sells rice/goods for **COIN**) is unchanged. koku is the
> House STANDING, never spent.
- **created_date:** 2026-07-01
- **Context:** The build ships a small 6-item buy-only, capped koku-SINK provisioning shop in T0; the PRD said "no market in T0" ×6 (TRADE — selling for coin/profit — locks to T2, ADR-066), yet the human named "market depth" as a T0 koku sink (ADR-092) — an apparent contradiction (HD-14).
- **Decision (human, 2026-07-01):** They are two different things, both canon. **(1) VENDORS/SHOPS** where the **player** buys goods for his **character** are a **personal koku SINK** — legitimate from **T0** (the built provisioning shop). **(2) The TRADE ENGINE** (trade work on the **estate's** behalf, for profit) opens at **T2** and is about the **estate**. **(3) PLAYER finances and ESTATE finances are SEPARATE lanes** — the player's personal koku (character purchases) is distinct from the estate's koku/wealth (the estate economy + trade engine).
- **Why:** "No market in T0" really meant "no *trade engine* in T0" — buying gear for yourself ≠ the estate trading for profit. Separating the lanes resolves the contradiction and opens a richer economy (a personal progression sink vs an estate-scale engine).
- **Consequences:** DOC: reframe "no market in T0" → "no *trade engine* in T0; a small capped provisioning shop is a personal koku sink"; introduce the player-vs-estate finance split into the resource model (§2.4 / §6). BUILD TODO (v0.3.2 / T1 design input): model the two finance lanes — today's `resources`(carried) vs `banked`(kura) is at-risk-vs-safe, **not** player-vs-estate; reconcile. Composes with **ADR-066** (trade ≤⅓, T2) + **ADR-092** (T0 market depth). Per **ADR-022**, governs.

## ADR-100 — 2026-07-01 keep the PRD combat-resolution model (5-attr + accuracy/evasion) and BUILD it at T0 (closes HD-15)

### ADR-100 ✅ — v1.0.0 combat = the PRD's 5-attribute + accuracy/evasion model; implement it at T0 (v0.3.2), NOT deferred to T1
- **created_date:** 2026-07-01
- **Context:** The PRD specifies combat resolution via accuracy/evasion + a 5-attribute system (STR/AGI/INT/SPD/LUCK); the built T0 ships flat hit/crit/block (0.9/0.1/0.1) with 3 attributes (might/guard/vigor). The built model is playtested and meets the LOCKED 20–35% first-fight band with no dominated stance — but it's a leaner realization of the PRD design (HD-15).
- **Decision (human, 2026-07-01):** Keep the **PRD's richer model as v1.0.0 intent** AND **implement it at T0** in v0.3.2 (do NOT defer to T1). The PRD prose stays; the build catches up now.
- **Why:** The human wants the fuller combat depth in the player's hands from T0, not held for a later tier. The richer model is the intent, not the leaner shipped approximation.
- **Consequences:** BUILD TODO (v0.3.2, HIGH): grow the 3-attr (might/guard/vigor) into the full 5-attr system (STR/AGI/INT/SPD/LUCK, each dual labour+combat — ADR-016); replace flat hit/crit/block with accuracy/evasion resolution; keep the 20–35% band + no-dominated-stance invariants (RED-able). §4 magnitudes stay LIQUID (ADR-059). Preserves **ADR-011/ADR-016**. Per **ADR-022**, governs.

## ADR-101 — 2026-07-01 stances are a glass-cannon ↔ tank tradeoff (damage dealt vs damage taken) (closes HD-16)

### ADR-101 ✅ — Stance axis = ATTACK vs DAMAGE-TAKEN (aggressive = glass cannon: more dealt + more taken; defensive = tank: less dealt + less taken); retire wear-as-the-stance-axis
- **created_date:** 2026-07-01
- **Context:** Built stances used durability WEAR as the cost axis (Aggressive wear 1.5×); the PRD §4.6.10 used defense/speed. Neither cleanly matched the human's mental model (HD-16).
- **Decision (human, 2026-07-01):** Stances are a **glass-cannon ↔ tank** tradeoff on the **damage-dealt vs damage-taken** axis: **aggressive** = glass cannon (do more damage, take more damage); **defensive** = tank (take less damage, do less damage); balanced sits between. This axis IS the intent — retire wear-as-the-defining-stance-axis and drop the PRD's defense/speed framing.
- **Why:** The stance choice should read as a clear glass-cannon/tank identity, not a durability chore or a speed lever. (The built `atkMult`/`takenMult` already express this — gedan 0.8/0.85, jodan 1.35/1.15 — so the build is close; the change is to make this THE axis, not a wear tax.)
- **Consequences:** DOC: revise PRD §4.6.10 + §2.8 Stance shape to the atk/damage-taken glass-cannon/tank model. BUILD: keep `atkMult`/`takenMult` as the stance axis; demote/remove `wearMult` as the differentiator (weapon wear stays a durability mechanic, not the stance's identity). Keep **ADR-050**'s no-dominant-stance / balanced-not-a-trap invariant. Per **ADR-022**, governs; supersedes the §4.6.10 defense/speed proposal + the wear-axis emphasis.

## ADR-102 — 2026-07-01 "at least one craftable" (relaxes ADR-052/ADR-095); T0 ships 3 weapons (closes HD-17)

### ADR-102 ✅ — The craftability rule is "AT LEAST one craftable", not "exactly one"; T0 ships 3 weapons (pole start + 2 more)
- **created_date:** 2026-07-01
- **Context:** ADR-052/ADR-095 were read as "T0 showcases exactly ONE craftable weapon." The PRD's T0 roster is 3 spears (2 crafted), which that reading forbade; the build ships 2 weapons (carrying-pole + 1 crafted axe = +1) (HD-17).
- **Decision (human, 2026-07-01):** The "one craftable" rule was never a hard cap — it means **"at LEAST one craftable."** **T0 ships 3 weapons: the carrying-pole (start) + 2 more** (at least one of the two craftable; the other may be found or crafted). This **amends ADR-052 and ADR-095** (exactly-one → at-least-one).
- **Why:** "Exactly one craftable" over-constrained the tutorial; the intent was to *guarantee the loot→craft taste exists*, not to cap the roster. Three weapons gives T0 a real weapon-choice beat (matching the PRD +2 roster / ADR-026).
- **Consequences:** AMENDS **ADR-052** (the "one craftable" clause) + **ADR-095** (annotated there): the constraint is now "≥1 craftable." BUILD TODO (v0.3.2): add a **3rd T0 weapon** (currently 2). DOC: the PRD T0 weapon row = pole (start) + 2 more; keep the 3-line archetype/signature vision (ADR-026). Per **ADR-022**, governs.

## ADR-103 — 2026-07-01 interactive/resumable combat is a forward-tier feature; auto-resolve is the T0 spine (closes HD-18)

### ADR-103 ✅ — DEFER interactive, resumable mid-fight combat (`CombatEncounterState` + `combat_action`) to a forward tier (T1/T2); auto-resolve stays the T0 spine
- **created_date:** 2026-07-01
- **Context:** The PRD specifies interactive, resumable mid-fight combat (a stored `CombatEncounterState` + a `combat_action` intent — act turn-by-turn); the build resolves each fight atomically to one summary line, and v0.3.1 (ADR-076/090/091) doubled down on the high-throughput auto-grind. No ADR had retired the interactive vision (HD-18).
- **Decision (human, 2026-07-01):** **DEFER, don't retire.** Keep the interactive/resumable-combat vision but mark it explicitly **forward-tier (T1/T2 ability-slot combat)** — NOT a T0 obligation. **Auto-resolve stays the T0 spine.**
- **Why:** The auto-grind is the right T0 loop (leave-it-running incremental); interactive combat is a depth layer for later tiers. Keeping the vision (not deleting it) protects the good idea per best-of-both.
- **Consequences:** DOC: §6.3/§6.4 mark `combat?: CombatEncounterState` + `combat_action` as **forward-tier (T1/T2)**, not current/T0 state. No T0 build change. Per **ADR-022**, governs.

## ADR-104 — 2026-07-02 story-significant, interactive NPCs are introduced via a full-screen VN scene

### ADR-104 ✅ — First meetings with story-significant, interactive NPCs play as a full-screen VN dialogue scene (starting with the intro's Sōan + Genemon)
- **created_date:** 2026-07-02
- **Context:** The cold-open was a one-shot text dump — the physician **Sōan** grounds the folklore but the player can't answer him, and Genemon's greet lines land all at once (playtest **FB-13**; the intro-dialogue plan [`project/archive/2026-07-02-interactive-intro-dialogue.md`](../../project/archive/2026-07-02-interactive-intro-dialogue.md)). The plan reworks the intro into a VN-style, click-to-continue interactive dialogue with balanced choices, per-NPC memory, and a speaker/voice model; it ran a ADR-075 diverge over the *presentation* (inline / full-screen scene / bottom-dock — FB-43/FB-44/FB-45). The human then made the pattern-level call: how do we frame meeting an NPC who *matters* and can be *answered*?
- **Options:** (A) keep all NPC intros inline in the event log · (B) a bottom "dialogue dock" over the live world · (C) a dedicated **full-screen VN scene** that hides the rest of the UI — reserved for NPCs who carry story weight and offer real interaction.
- **Decision (human, 2026-07-02):** When the player **first meets** an NPC who is **story-significant AND interactive** — the NPC touches the story, offers **choices**, or has real discussion/interaction — the game presents that meeting as a **full-screen dialogue (VN) scene**: a **kanji ink-seal nameplate** (coloured per voice-category), the NPC's spoken lines revealed with the **GBA typewriter**, the player's **diegetic choice replies**, and **per-NPC memory** (each NPC independently remembers how you treated them; `npcMemory`, persists across ascension). The scene **hides the rest of the game UI** while it plays — reinforcing the game's signature "the UI unlocks incrementally" (the world/estate inks in *after* the scene). This is **THE canonical pattern** for such introductions, starting with the intro's **Sōan** (physician) and **Genemon** (steward). **Explicitly NOT this:** minor / ambient NPCs — no story weight, no choices, no real interaction — are **not** introduced with the full-screen scene; they appear **inline in the event log**. Reserve the VN scene for characters who matter and can be answered.
- **Why:** A meeting the player can *answer* deserves a frame that stops the world and gives the exchange weight; blowing it up to full-screen (over an inline line or a dock over the live world) makes "this person matters" read instantly, and hiding the UI so the world inks in afterward turns the intro into the first beat of the game's incremental-reveal signature. Gating the treatment to story-significant, interactive NPCs keeps it special — everyday folk stay in the log, so the scene never becomes wallpaper.
- **Consequences:** The interactive intro (the 3 balanced-choice beats) **IS the first instance** of this pattern; the intro presentation is **LOCKED to the full-screen VN scene** — the earlier **inline (A)** and **bottom-dock (C)** presentation variants are **SCRAPPED** (ADR-075 strip-on-approve), so **prod ships only the VN scene**. Per-NPC memory (`npcMemory`) + the **balanced +1/−1 choice model** + the **speaker/voice colour model** underpin every such scene (data model + beats: the intro plan §3–§4). Future work: a **reusable "meet an NPC" dialogue trigger** keyed off first-encounter, so new story NPCs slot into the same VN pattern. Composes with **ADR-018** (woodblock/ink, no-asset — the ink-seal nameplate is pure CSS + type) and **ADR-019** (fun/QA); sources = the intro-dialogue plan + playtest **FB-13/FB-43/FB-44/FB-45**. Per **ADR-022**, governs.

## ADR-105 — 2026-07-02 the game's setting is anchored to the year 1780 (An'ei 9, on the cusp of Tenmei)

### ADR-105 ✅ — Anchor the setting to 1780; anchor the YEAR (real calendar time), keep GEOGRAPHY & POLITICS fictional

> 🔁 **Economy gloss re-scoped 2026-07-02 by [ADR-107].** The "koku/mon coin economy" phrasing is
> re-scoped: **COIN** (base unit *mon*) is the currency, **RICE** is the sold resource (the Dōjima
> rice market / fudasashi brokers price it, season-swinging), and **koku** is the House's assessed
> STANDING — not a coin. The 1780 anchor + the real-year / fictional-place split are unchanged.
- **created_date:** 2026-07-02
- **Context:** The setting was pinned only by *era*, not by *year* — §1.3 said "mid-Edo, stable and commercial, ~18th century, kept **fictional**", and `ui-design.md` targets a "mid-Edo woodblock" art register, but no doc stated a specific historical year as a *setting fact*. The human asked to anchor it. A year-anchor sharpens texture (calendar, era-feel, festival naming) and disciplines anachronism checks, but it grazes the standing **fiction rule** (no real place / daimyō names — ADR-018/§6.6 denylist) and the cozy-restoration **tone** (an anchored year drags in real history, incl. the Tenmei famine of 1782–88).
- **Options:** (A) leave it era-only ("~18th century") · (B) anchor a specific year · (C) anchor a year AND surface a real *nengō* era-year in-game.
- **Decision (human, 2026-07-02):** **Anchor the game to the year 1780** (Japanese *An'ei* 9, 安永9年 — the last full year before the **Tenmei** era, 天明, began in 1781). The game **opens in 1780**. Crucially this anchors **TIME only** — the split is **real YEAR, fictional GEOGRAPHY & POLITICS**: Asagiri valley, Sawatari-juku, Yanagi-watari, Kuzuhara and every daimyō/house stay **invented** (the ADR-018 / §6.6 real-name denylist is **unchanged**; *Nihonbashi* remains the lone allow-listed real place, at T5). "The shōgun" stays an **unnamed office** (never named as the historical Tokugawa Ieharu; the era's real Tanuma-administration commercial character is *texture*, never named politics).
- **Why:** 1780 is the **right** anchor because it *validates rather than disrupts* the existing world: the stable, commercial "Tanuma era" texture matches §1.3's "stable and commercial"; the *koku*/*mon* coin economy, *fudasashi* brokers + the Dōjima rice market (T4/T5), *sankin-kōtai* (biennial), *sekisho* checkpoints, and the silk/sericulture *meibutsu* are all fully period-consistent; and the timeline math holds (Tama spirited away "ten years ago" ≈ 1770; grandfather **Sadamune's** flood venture "three generations ago" ≈ early-mid 1700s). It also confirms the "mid-Edo woodblock" art register (1780 is the ukiyo-e high tide). Anchoring the year while keeping geography/politics fictional is the standard historical-fiction split — grounding without claiming to depict real events.
- **Consequences:** Ripple tracked in the plan [`project/archive/2026-07-02-anchor-1780-setting.md`](../../project/archive/2026-07-02-anchor-1780-setting.md) (done, archived). DOC: §1.3 "~18th century" → **"1780 (An'ei 9)"** + a one-line reaffirmation of the real-year / fictional-place split; §5 narrative opening may state the year; README + `ui-design.md` note the anchor. Two **forks surfaced for the human** in the plan (agent picks a default, human overrides async): **(1) the Tenmei famine** — default **INSULATE** the fictional valley (cozy tone + apolitical fiction win; the famine is at most faint off-screen texture, never dramatized); **(2) the calendar** — default keep the in-game `year(day)` counter **RELATIVE** (Year 1, 2… of the MC's service; §6.7), with 1780 stated as opening flavour, **not** surfacing the live *nengō* era-year (option C declined for now). No code/balance change (the calendar model is untouched under the default). Composes with **ADR-018** (fiction rule) + **ADR-021** (the §1 freeze — this is a human steer that *refines* locked intent, so ADR-022 governs: the anchor is added, the fiction rule is preserved). Per **ADR-022**, governs.

## ADR-106 — 2026-07-02 the multi-panel workspace supersedes the §4.7 "centered ~1200px paper column" rule

### ADR-106 ✅ — The workspace may span the FULL viewport width as a multi-panel matrix (arrangement × framing DEV variant axes); prod default stays the classic 2-column
- **created_date:** 2026-07-02
- **Context:** The v0.3.2 shell (`ui-design.md` §4.7/§4.8) capped the player UI at a **centered ~1200px paper column** with a **2-column workspace** (work-left / log-right). In the playtest the human found the layout crammed — *"the other games have multiple/many panels (5–7) and it feels like we only have two, and we're slamming all the information in"* (**FB-11**). The scoping lives in the plan [`project/archive/2026-07-02-multi-panel-layout.md`](../../project/archive/2026-07-02-multi-panel-layout.md), where the human resolved the shell-width question directly.
- **Options:** (A) keep the centered ~1200px column, denser inside · (B) drop the width cap and lay information across **multiple distinct panels** spanning the full width · (C) B, explored as a **matrix of independent variant axes** (arrangement × framing × log-placement) so many live combos audition behind the DEV toggle rather than a handful of bespoke layouts.
- **Decision (human, 2026-07-02):** The human **does NOT want the centered ~1200px paper column** — *"now's the time to try options, explore broadly"* — and OK'd going **beyond 2–3 variants, up to a matrix (3×3×3 = 9+ combos)** built as **INDEPENDENT VARIANT AXES** (e.g. *arrangement × framing × log-placement*, the three named takes 屏風 / 番付 / 巻物 surviving as axis anchors). So the workspace is **no longer bound to the centered column**: it **may span the full viewport width** as an idle-RPG **multi-panel dashboard**, reveal-gated and sparse (panels ink in only as their surface unlocks, §6.1 — the early game stays a single calm column). This **SUPERSEDES the §4.7 "centered ~1200px paper column" rule** (which itself refined the **FB-4** centered-column intent). The **prod default remains the classic 2-column** (work-left / log-right) until the human locks a matrix variant live; the axes ship **DEV-only** behind the variant toggle (ADR-075, zero PROD flag-debt).
- **Why:** The reference idlers earn their density by spreading information across many panels, not by cramming two columns — and the human explicitly wants to *see* the options in the running UI, which the axis-matrix delivers cheaply (≈9 implementations → many live combos). Keeping the prod default at the safe 2-column while the matrix auditions behind the toggle honours **R6** (a player still reaches a coherent layout) and ADR-075 (self-pick a default, never block; the human overrides live). Gating the density to reveal-based progression preserves the "UI as progression" signature (§1) — the dashboard grows *with* the house, never a slam of empty panels.
- **Consequences:** DOC: `ui-design.md` §4.7 gains the full-width multi-panel matrix note + the explicit supersession of its own centered-column rule (§4.8 density unchanged; the log stays one first-class slice, FB-9/§5.1, untouched). BUILD: the axes are DEV-only variant surfaces (ADR-075), an **HR-item per axis/combo** in [`review.md`](../../project/human-in-the-loop/review.md); prod ships only the 2-column default until the human locks a matrix. Composes with **ADR-018** (woodblock/ink — the panels stay paper `.frame`s, no slop), **ADR-055** (reveal-gating — panels appear as their surface unlocks), and **ADR-104** (the VN scene still hides the whole shell regardless of workspace arrangement). This is a human steer that refines locked layout intent, so **per ADR-022, governs** (the newer call supersedes the older §4.7 rule; `created_date` disambiguates).

## ADR-107…ADR-109 — 2026-07-02 the economy re-core: RICE / COIN / KOKU split (human-steered)

> The locked new economy model splits the flattened single-"koku" economy into three distinct
> nouns — **RICE** (a real resource), **COIN** (the sole spendable currency, base unit *mon* 文),
> and **KOKU** (the House's assessed STANDING). Source: the 2026-07-02 economy research
> brainstorm. These re-scope the koku-as-currency ADRs (**ADR-008, ADR-051, ADR-066, ADR-077, ADR-090,
> ADR-092, ADR-093, ADR-098, ADR-099**) + the **ADR-105** economy gloss (each annotated inline). Per
> **ADR-022**, this newest human steer governs.

### ADR-107 ✅ — koku is the House STANDING, not a currency (economy re-core)
- **created_date:** 2026-07-02
- **Context:** koku was specced/implemented as the spendable base currency (labour yields koku; estate/market/repair priced in koku; a lost fight bites carried koku) and even conflated with rice ("rice counter (koku)"). Historically koku was never a spendable coin — it was a rice-volume / assessment / status unit (see the 2026-07-02 economy research brainstorm). That flattened the setting and inverted koku's meaning.
- **Decision:** Split the economy into three nouns — **RICE** (a real resource: labour-earned; you EAT it for satiety, STORE it in the kura, or SELL it for coin at a price that SWINGS BY SEASON — NOT a synonym for koku), **COIN** (base unit *mon* 文; the sole spendable currency; all costs — market/estate/repair — + the loss-bite are coin; the kura shelters coin + rice), and **KOKU** (the House's assessed STANDING — re-expresses "House Influence" as a kokudaka-like prestige SCORE; NEVER spent; NOT an income multiplier; gates ascension/unlocks; re-assessed seasonally (`seasonalJudge`) + a big "the assessors arrive" event at tier jumps). Supersedes / re-scopes **ADR-051, ADR-066, ADR-077** (split — keep its deed-based-standing clause as the koku law, re-label its tight-economy clause to COIN), **ADR-090, ADR-092, ADR-093, ADR-098, ADR-099, ADR-008** (survives as a coin-lane cap); re-scopes **ADR-105**'s economy gloss.
- **Why:** Restores koku's real meaning as standing; makes the rice→coin→credit friction the gameplay; keeps the House's rising koku as the prestige spine. Magnitudes liquid (**ADR-059**).
- **Consequences:** Ripple in flight across the PRD economy sections + the living docs (this batch); each koku-as-currency ADR carries an inline re-scope note. Recorded with **ADR-108** (coin denominations) + **ADR-109** (tier→koku ladder + office track + T4 stipend). Per **ADR-022**, governs.

### ADR-108 ✅ — the tiered coin denomination display
- **created_date:** 2026-07-02
- **Decision:** COIN is ONE underlying value (base unit *mon*), displayed in fixed mixed denominations **mon → monme → ryō**. Fixed rate for the whole game: **1 ryō = 50 monme = 4,000 mon** (1 monme = 80 mon) — matches the Bank of Japan primary source and the human's worked example. Higher denominations reveal **INCREMENTALLY** as wealth grows (mon at T0–T1; monme mid-game; ryō at T4–T5). No moneychanger, no floating forex (the historical float is abstracted).
- **Why:** Legible Edo-flavoured big-number formatting; the denomination itself signals the player's rise.
- **Consequences:** The coin formatter renders one underlying `mon` value in the mixed denominations, revealing monme then ryō as wealth grows. Composes with **ADR-107** (COIN is the sole spendable currency). Per **ADR-022**, governs.

### ADR-109 ✅ — the tier→koku ladder + the endgame axes
- **created_date:** 2026-07-02
- **Decision:** The House's koku standing scales by tier — **T0 tens → T1 ~100–1,000 → T2 ~1,000–5,000 → T3 ~5,000–10,000 → T4 = 10,000 (the daimyō threshold) to ~100,000 → T5 ~100,000–1,000,000+** (Kaga ≈ 1,025,000 = the ceiling). Bands **PROVISIONAL / liquid** (**ADR-059**), tuned by the pacing sim. A **PERSONAL koku stipend appears only from T4+** (koku is House-only before). At **T5** a **FULL PARALLEL Office / court-rank / favour track** gates the top ranks (koku = scale, office = access) — anchored by Tanuma Okitsugu (ashigaru son → 57,000-koku daimyō + rōjū) and the fudai/tozama office-gate. Rank milestones grant **VISIBLE STATUS TOKENS** (surname → the two swords → gōshi rank). Standing is re-assessed seasonally + the "assessors arrive" event at tier jumps.
- **Why:** A concrete kokudaka-like ladder reads as real Edo standing (not an abstract score), and splitting the endgame into two legible axes — koku = *scale*, office = *access* — keeps the T5 court game about more than a bigger number.
- **Consequences:** The tier→koku bands + the T4 personal stipend + the T5 office/court-rank track + the status-token milestones ripple into the PRD spine sections (this batch). Composes with **ADR-107** (koku = standing) + **ADR-010** (the indirect Edo ceiling). Magnitudes liquid (**ADR-059**). Per **ADR-022**, governs.

## ADR-110 — 2026-07-02 every rung is a player-triggered VN story beat (extends ADR-104)

### ADR-110 ✅ — Every rung is a full, player-TRIGGERED VN story beat with remembered choices + occasional small varied bonuses; NOT every rung a perk
- **created_date:** 2026-07-02
- **Context:** The rung-up transition plan
  ([`project/archive/opus-2026-07-02-rung-up-story-transitions.md`](../../project/archive/opus-2026-07-02-rung-up-story-transitions.md))
  diagnosed that promotion is today an instant, silent hot-path side effect — a
  number-fill plus a single mis-channeled log line — with no player affordance and
  no motivation for the areas/panels/people it unlocks (playtest **FB-97/FB-99/FB-103**).
  The plan diverged three scopes (minimal narration / milestone-VN-only /
  every-rung-full) and defaulted to Option 2 (full VN only at milestone rungs).
  The human then made the pattern-level scope call for the whole rung ladder.
- **Decision (human, 2026-07-02):** **EVERY rung is a full, player-TRIGGERED VN
  story beat** — there is a story element at every rung; **SOME** rungs introduce a
  **new character**, others deepen a known one (no rung is a silent number-fill).
  The beat is **player-triggered**: the player must manually stop grinding,
  navigate, and trigger the rung-up story; a ready promotion **holds** and can be
  **ignored** — the player may grind combat forever and never advance (never
  forced). Beats carry **CHOICES**, and **NPCs REMEMBER** them (per-NPC
  relationships + story flags, persisting across ascension). Choices **mainly**
  affect **relationships + story flags**, with only **OCCASIONAL, small, VARIED**
  bonuses ("every now and then" — can be *story* bonuses, not just flat stats, and
  are **smaller** than the intro's one-time perks). Crucially, **it is NOT the case
  that every rung grants a perk** — the three intro perks were a **one-time intro
  boost**, not the standing pattern.
- **Why:** Making every rung an earned, triggered beat fixes the silent pop-in
  everywhere (each unlock — area, panel, verb, or person — arrives motivated) and
  turns each promotion into a real interaction, while the player-triggered/ignorable
  gating keeps a fast idle climb from being interrupted by a forced modal every few
  seconds. Anchoring the payload to relationships + flags (not perks) keeps the
  choices meaningful without turning the ladder into a power-creep treadmill;
  reserving bonuses to occasional/varied/small keeps them a delight, not an
  expectation, and preserves ADR-104's "never let the VN become wallpaper" by making
  the *weight* narrative rather than mechanical.
- **Consequences:** **EXTENDS/REFINES ADR-104** — ADR-104's full-screen VN pattern (for
  story-significant, interactive NPCs) now also frames **every rung beat**, not only
  first-meets; the ranks build must replace the instant hot-path `promoteRungs` with
  a pending→player-triggered→apply state machine (a `rungBeat` cursor beside
  `introBeat`, reusing the append-only VN engine), and the choice payload is
  relationship/flag-first with rare small bonuses. The trigger lives at the
  **header rung element (FB-106)** — "ready to advance" surfaces there, and triggering
  navigates to the beat. Supersedes the plan's "Option 2 default" (milestone-only VN)
  in favour of every-rung beats. Composes with **ADR-107–ADR-109** (any coin/rice copy in
  beats rescoped by the economy re-core) and **ADR-055** (reveal follows the story).
  Per **ADR-022**, governs.

## ADR-111 — 2026-07-02 deep housing: comfort bonuses + a status-mirror of your rise

### ADR-111 ✅ — Housing is DEEP — a furnishable home that grows with rung + a belongings inventory + set/synergy bonuses; bonuses = Edo COMFORT + the home as a VISIBLE status-mirror
- **created_date:** 2026-07-02
- **Context:** The narrative-coherence brainstorm
  ([`project/brainstorms/2026-07-02-narrative-coherence-home-belongings.md`](../../project/brainstorms/2026-07-02-narrative-coherence-home-belongings.md))
  audited T0 and found the story *names* a home three times — the "dry corner" and
  the "bowl" Genemon promises, "a place here is yours" — with **zero** mechanical
  existence (rest is stranded at the cold-open post; no belongings/furniture
  category). It diverged three scopes (cosmetic / light-mechanical / deep housing)
  and recommended staging 1→2 with the deepest layer deferred. The human chose the
  deep option outright.
- **Decision (human, 2026-07-02):** Build the **DEEP housing system** — a
  **furnishable home that grows with the player's rung** (dry corner → your quarters
  → the inner rooms), a **belongings inventory** distinct from resources and
  equipment (the bowl, a robe, a keepsake — things you own and keep), and
  **furniture/belongings with comfort bonuses + set/synergy**. The bonus model is
  **Edo-flavoured COMFORT** — better **rest recovery**, **storage**, and
  **morale/upkeep** — **plus** the home as a **VISIBLE STATUS-MIRROR of your rise**:
  it physically *shows* your climb (surname → the two swords on the wall → gōshi
  standing), the domestic half of the same "look how far you've come" fantasy. The
  register is **prestige over power** — **NOT** RPG stat-gear; comfort + status, not
  a combat power lane.
- **Why:** The deep home cashes the sharpest T0 coherence debt (the promised
  corner/bowl) and turns it into a legible reward surface that *reuses* the existing
  rest/cook/market/estate-flywheel patterns at personal scale, while the
  status-mirror layer makes every "you're more than a servant now" rung *shown*, not
  just titled. Keeping the bonuses to comfort/prestige (never combat stats) protects
  the balance — the home never becomes a power lane competing with equipment — and
  ties the domestic rise to the economy's status tokens for one unified
  "your-rise-is-visible" reading.
- **Consequences:** Gets a dedicated build plan
  ([`project/archive/opus-2026-07-02-deep-housing-build.md`](../../project/archive/opus-2026-07-02-deep-housing-build.md)),
  phased T0-first. The belongings inventory lives in the **Inventory tab (FB-108)**,
  distinct from consumables/resources; the home's status-mirror ties the economy's
  **ADR-109** status tokens (surname / two swords / gōshi). Home tiers ride the rung
  ladder (**ADR-110** beats), reusing the A8 interior-house reveals as scaffolding and
  the estate flywheel as the visible-upgrade template. Sequenced against the economy
  re-core (**ADR-107–ADR-109**) since furniture costs **coin**. A new home panel will
  need a **ADR-075 diverge** pass. This makes the deep layer the brainstorm's
  recommended "T1 status-mirror ambition" a **now** commitment. Per **ADR-022**,
  governs.

## ADR-112 — 2026-07-02 the tab IA is a six-tab set revealed incrementally

### ADR-112 ✅ — The player UI is six tabs — Work · Map · Estate · Inventory · Character · Combat — each revealed only as it unlocks (preserving the incremental-reveal signature)
- **created_date:** 2026-07-02
- **Context:** The v0.3.3 playtest surfaced a cluster of tab-IA feedback
  (**FB-100/FB-107/FB-108/FB-109/FB-110/FB-112**): navigation was duplicated across Work and the
  estate map (**FB-107**), the storehouse/bank sat in Work rather than a holdings home
  (**FB-108**), the pedlar's shop was dumped inline instead of being a talkable person
  at a map node (**FB-109**), and the human called for a dedicated Map tab of the
  current node — walk-to + who's here + talk-to (**FB-110**). The through-line is
  "every capability lives in exactly one thematic tab." The human then locked the
  concrete tab set (a second steer added **Combat** as its own top-level tab).
- **Decision (human, 2026-07-02):** The player UI is **six tabs — Work · Map ·
  Estate · Inventory · Character · Combat — revealed INCREMENTALLY**, each appearing
  **only as it unlocks** (preserving the game's incremental-reveal signature — the UI
  grows *with* the player, never a slam of empty tabs). The homes:
  - **Work** — labour actions only (navigation and the storehouse leave it).
  - **Map** — the current node: walk-to destinations, who's here, and who you can
    talk to (navigation's single home; established characters like Sōan/Genemon stay
    talkable).
  - **Estate** — house upgrades (the kura-works / estate flywheel).
  - **Inventory** — the storehouse/bank (carried vs stored) **and** personal
    belongings.
  - **Character** — attributes, skills, and the bestiary.
  - **Combat** — its own **top-level tab** (the fight loop + stance); **NOT** folded
    into Character or Map. Unlocks when combat goes live (≈R3, ADR-100/ADR-110).
- **Why:** One capability per thematic tab kills the duplicated-nav confusion and
  gives holdings, the map, the character sheet, and combat each a legible home, while
  the incremental reveal keeps the "UI as progression" signature (§1) — a fresh
  player still starts on a single calm surface and earns each tab. Combat earns its
  own tab because the fight loop is a first-class pillar (ADR-100), not a sub-view of
  the character sheet.
- **Consequences:** DOC: `ui-design.md` §IA/tabs gains the six-tab set + the
  incremental-reveal gating. BUILD: an IA reorg render pass moves nav → Map (FB-107),
  the storehouse → Inventory (FB-108), the pedlar's shop → a talkable Map-node NPC
  (FB-109), estate upgrades → Estate (FB-100), and the fight loop/stance → the **Combat**
  tab; the belongings inventory (**ADR-111**) lands in the **Inventory** tab, the
  bestiary in **Character**. The rung lives in the header, not a tab
  (**FB-106**/**ADR-110**). Composes with **ADR-055** (reveal-gating), **ADR-100** (the
  combat pillar), **ADR-106** (the multi-panel workspace within a tab), and
  **ADR-104/ADR-110** (the VN scene still hides the whole shell regardless of tab). Per
  **ADR-022**, governs.

## ADR-113 — 2026-07-02 a combat loss bleeds carried coin + rice + materials (the kura shelters them)

### ADR-113 ✅ — A lost fight costs all three carried resources — coin + rice + materials; banking in the kura protects them (an economy-build call under ADR-107)
- **created_date:** 2026-07-02
- **Context:** Under the flattened single-koku economy a lost fight bit carried
  koku. The economy re-core (**ADR-107**) splits the economy into **rice** (a
  resource), **coin** (the currency), and **koku** (House standing, never carried
  or spent), and establishes that the **kura shelters coin + rice**. That left open
  what, concretely, a combat loss now costs.
- **Decision (human, 2026-07-02):** A **combat loss bleeds all three carried
  resources — coin + rice + materials** (the crafting materials). **Banking in the
  kura protects them** — stored coin/rice/materials are safe; only what you **carry**
  is at risk. koku (House standing) is never carried, so a loss never touches it.
- **Why:** A three-resource bite makes the risk legible and real across the whole
  economy (not just coin), and making the kura the shelter gives the store/withdraw
  decision genuine stakes — carry more to earn/spend on the road, or bank it safe
  before a risky fight. It keeps loss meaningful without touching standing (koku),
  preserving koku as pure prestige (**ADR-107**).
- **Consequences:** An **economy-build call under ADR-107** — the loss-bite reducer
  now debits carried coin + rice + materials (was carried koku); the kura's
  store/withdraw covers all three. Feeds the Inventory-tab storehouse (**ADR-112**,
  **FB-108**). Ripples into the PRD combat/economy sections with the ADR-107 batch.
  Magnitudes liquid (**ADR-059**). Per **ADR-022**, governs.

## ADR-114 — 2026-07-02 every vendor is a PERSON on a spectrum, with an optional place-gate

### ADR-114 ✅ — Shops are people on a spectrum (full VN character / small person / tiny trader) + an optional place-gate; no shop is a bare inline menu
- **created_date:** 2026-07-02
- **Context:** The pedlar's shop was dumped as an inline menu in the Work tab; the
  human's steer (**FB-109/FB-110**) is that a vendor is a **person you talk to**, met at
  a map node's "who's here" list, not a menu. That raised the pattern-level question:
  are all vendors full VN characters (expensive), or is there a spectrum?
- **Decision (human, 2026-07-02):** **Every shop is a PERSON you talk to** — never a
  bare inline menu — arranged on a **spectrum** of interaction depth:
  - **(a) FULL VN characters** — a **ADR-104** full-screen modal introduction + quests
    + ongoing dialogue content (the richest vendors).
  - **(b) SMALL people** — a line or two of dialogue **+ a trade** (light presence,
    real voice).
  - **(c) TINY traders** — **ZERO questions to ask**; talking to them opens straight
    into the **trade / buy / market menu** (a face on a shop, no dialogue tree).
  AND a vendor may be **tied to a PLACE that gates them**: you must **reach or BUILD**
  the location first (e.g. the **smithery** before you can talk to the **smith**). So
  **a vendor = (person on the spectrum) + (optional place-gate).**
- **Why:** Making every vendor a person (not a menu) keeps the world diegetic and
  consistent with the "who's here" map model (FB-109/FB-110) and the VN pattern (ADR-104),
  while the spectrum lets the game **spend authoring budget where it matters** — a
  full VN character for the vendors who carry story, a bare trade-face for the ones
  who are just a market — so the pattern never becomes wallpaper and never over-
  serves a trivial trade. The place-gate ties a vendor's availability to real
  progression (reach/build the location), giving shops an earned, sited feel rather
  than blinking into existence.
- **Consequences:** Composes with **FB-109** (the pedlar is a person, discovered via a
  reason — the pedlar is a **(b) small person** or **(c) tiny trader**), the
  estate-map **"who's here"** model (**ADR-112** Map tab / FB-110), and **ADR-104/ADR-110**
  (full VN vendors use the same scene engine). The vendor model is a **norm for the
  map/NPC direction** — noted here and to be folded into `ui-design.md` (§ map/NPC)
  and the rung-story entity-discovery design (the FB-99/§5 pedlar worked example). A
  place-gated vendor's shop reveals only when its location is reached/built (reuse
  the surface-reveal + estate-build gating). Per **ADR-022**, governs.

## ADR-115 — 2026-07-02 the estate-map presentation is NOT locked — the build diverges freely

### ADR-115 ✅ — The estate-map presentation stays OPEN — the build produces 3–4 genuinely-distinct, terse/hint-free working variants behind the DEV toggle; the human picks live
- **created_date:** 2026-07-02
- **Context:** The Map tab (**ADR-112**) needs a presentation for the current node +
  navigation + "who's here." Rather than lock one visual model up front, the human
  chose to keep the direction open and let the build audition several.
- **Decision (human, 2026-07-02):** **Diverge freely** on the estate-map — the build
  produces a **diverse 3–4** working variants, e.g. a **2D spatial** map, a
  **scroll / 道中記 (dōchūki) ledger**, a **minimal node list**, and a **node-graph** —
  **all terse / hint-free**, all wired **behind the DEV toggle** (**ADR-075**) for the
  human to pick live. **No single direction is locked.**
- **Why:** The map is a signature surface with several viable idioms; auditioning
  distinct working variants live (per ADR-075) surfaces the right one by play rather
  than by argument, and keeping them terse/hint-free holds the woodblock/ink bar
  (**ADR-018**) — no slop, no hand-holding chrome.
- **Consequences:** The estate-map build runs a **ADR-075 diverge** with **3–4**
  variants (an HR-item per variant in [`review.md`](../../project/human-in-the-loop/review.md));
  prod ships only the self-picked default until the human locks one live (zero PROD
  flag-debt). This is a **build directive for the Map tab (ADR-112)**; folds with the
  vendor "who's here" model (**ADR-114**) and the nav-single-home rule (**FB-107**).
  Per **ADR-022**, governs.

## ADR-116 — 2026-07-02 location/navigation flavor routes to the Map node, not the Story log (resolves FB-114)

### ADR-116 ✅ — Location flavor lives as the Map-node DESCRIPTION (standing, hint-carrying) + ~~a transient "Now" line on move~~; the Story log holds only mandatory story beats
- **created_date:** 2026-07-02
- **⤷ superseded in part (human, 2026-07-11 — FB-406):** the **(b) transient
  "Now" arrival line is RETIRED** — a move now emits no flavor at all; the
  Map-node description (a), which already renders the C5a seasonal read, is
  the ~~ONE home~~ home for the zone text (TST1). Half (a) and the Story-log
  rule stand.
- **⤷ amended (human, 2026-07-12 — HR-32 / FB-410):** the standing zone read now
  renders in **TWO surfaces** — the Map's you-are-here card **and** the Zone
  banner (the locked variant D sets it between the hero and the verbs). This is
  **not** a TST1 break: both resolve the **same single source**
  (`nodeSeasonalBlurb`), so there is one *value* with two *reads*, never two
  copies of the prose. What FB-406 actually forbade — the zone text spamming the
  **Now/Story log** on every move — stands untouched.
- **Context:** Navigation/location flavor (e.g. "The grain-store where you woke —
  dark, dry…", "The estate gate and its swept forecourt…") was being spammed into
  the **Story log** on every move — but it isn't story. **FB-114** flagged the
  mis-channel; this ADR settles where the flavor goes.
- **Decision (human, 2026-07-02):** Location/navigation flavor does **NOT** go in
  the **Story log**. It splits into two channels:
  - **(a) the MAP-node DESCRIPTION** — an immersive, standing *"you are looking
    around"* description of the current node that persists as long as you're
    there, and that **also carries HINTS** (toward people, actions, and things to
    discover at the node).
  - **(b) a light TRANSIENT "Now" line on move** — a brief line surfaced on
    arrival that **fades** (not a permanent log entry).

  The **Story log holds only mandatory story beats** — never nav/location flavor.
- **Why:** Keeps the three log channels disciplined — Story = mandatory beats,
  Now = transient, Map = standing place description — so the Story log reads as a
  real narrative spine rather than a wall of movement noise. Folding hints into
  the standing node description gives the Map node a diegetic job (orient +
  entice) and a natural home for discovery cues.
- **Consequences:** **Resolves FB-114.** Ties the map model (**ADR-114** "who's here"
  / **ADR-115** estate-map presentation) — the node description is the standing
  surface those variants render — and the **FB-111/FB-103 channel discipline** (Story
  vs Chat vs Now). The hint-carrying node description is the hook the emergent
  node-action idea (see
  [`../../project/brainstorms/2026-07-02-emergent-node-actions.md`](../../project/brainstorms/2026-07-02-emergent-node-actions.md))
  builds on. Home for the settled copy rule: `ui-design.md` (§5.1 channels + §
  map). Per **ADR-022**, governs.

## ADR-117 — 2026-07-03 the frontier PRD — spec-ahead, compress-behind (refines ADR-097, extends ADR-021)

### ADR-117 ✅ — The PRD's PRIMARY job is the forward spec of the UNBUILT; shipped tiers compress (once per tier, human-signed) to intent + acceptance criteria + pointers
- **created_date:** 2026-07-03
- **Context:** ~half of the repo's 496 commits are process upkeep, and a
  recurring share is "ripple X into the PRD": every built-system change pays a
  two-place write (code + spec), policed by after-the-fact audits — the koku
  economy alone was speced, tightened, then re-cored within ~36 h once play
  exposed the pacing. The PRD's irreplaceable value is concentrated in the
  UNBUILT (T1–T5, endgame); for built systems the build + ADRs + generated
  docs are the better truth (PH2 — the build wins). Locked via a live 6-round
  Q&A:
  [`2026-07-03-prd-on-a-diet.md`](../../project/brainstorms/2026-07-03-prd-on-a-diet.md).
- **Decision (human, 2026-07-03):** **(1) Job #1** — the PRD is first the
  **forward spec of the unbuilt**; ADR-097's "complete standalone what" becomes
  secondary (the PRD stays standalone and end-state-framed). **(2)
  Compression** — when a tier's human **taste review closes** (NOT at
  code-ship; T0 shipped Jun 29 but was re-cored Jul 2 — shipped ≠ settled),
  the agent drafts ONE compression sweep for that tier: surgical subsection
  edits across §2–§6 (the frontier cuts through the per-concern sections);
  each built slice → intent + acceptance criteria + pointers (code /
  generated `docs/content/` / ADRs), with generated fact-regions where build
  == end-state intent (the mechanical-checkpoint gen-region machinery). Filed
  as a `docs/plans/` reel-back + HR-item; the **human approves the diff**
  before it lands. **(3) Demoted text** is archived **verbatim** to
  `project/archive/` with a forward pointer (archive, don't remove). **(4)
  Interim rule (narrow — the human chose this over a full ripple-freeze):**
  only §4's illustrative balance magnitudes stop being hand-rippled NOW
  (already provisional per ADR-021; `balance.ts` + the generated tables are
  their source of truth); system/narrative ripple continues per-change until
  each tier's compression event.
- **Why:** kills the per-change spec tax exactly where it bites — built
  systems churning under daily playtest — while preserving the
  forward-design value the PRD alone carries; ripple becomes a rare,
  human-signed, once-per-tier event.
- **Consequences:** §4 gains a no-hand-ripple banner (applied this session);
  `prd.md` "How to read" gains the frontier-line note. First compression event =
  **T0, triggered when R1 closes**. Claude-picked defaults (flagged in the
  brainstorm's Open flags, **confirmed by the human 2026-07-05** — no
  override): fidelity audits of compressed territory baseline on acceptance
  criteria + ADRs + generated docs, not detail-prose; §6 tech-architecture
  folds into the T0 sweep. Per **ADR-022**, governs.

## v0.3.5 — the agent-default audit decisions (2026-07-03)

Seven ADRs from the interactive agent-default audit
([`project/audit/reports/2026-07-03-agent-default-decision-audit.md`](../../project/audit/reports/2026-07-03-agent-default-decision-audit.md)):
six T0-build plans were verified against git + source, then every place the
agent had picked a "default" and shipped it was walked through with the human.
Code deltas → [`project/archive/opus-2026-07-03-v0.3.5-build-plan.md`](../../project/archive/opus-2026-07-03-v0.3.5-build-plan.md) (built + merged).

### ADR-118 ✅ — Economy: koku is pure standing (no income flywheel); rice storage must cost something
- **created_date:** 2026-07-03
- **Context:** The koku-economy re-core (**ADR-107**) shipped Phases 1–4; the audit
  verified it and surfaced two economy calls for the human. The shipped kura is
  free, lossless and loss-safe, so "always hold rice until spring" dominates the
  seasonal store-vs-sell choice (`economy-balance-watch`).
- **Decision (human, 2026-07-03):** **(1)** koku is **pure standing + the
  ascension gate** — ratified. It reads as House prestige and gates the climb, but
  **never multiplies income** (the soft-flywheel is rejected). **(2)** Rice storage
  must **cost something** — a per-season spoilage %, a kura capacity cap, or a
  small upkeep fee — so store-vs-sell is a live decision. The exact mechanism is
  **liquid**, chosen at build (**ADR-059**).
- **Why:** koku-as-standing keeps the pillar legible and the economy honest; a
  costed store closes a dominated decision without adding UI.
- **Consequences:** build-plan §1 adds the storage cost; the balance-watch item
  closes. Relates **ADR-107**, **ADR-059**.

### ADR-119 ✅ — IA: the tab set is SEVEN — Quests regains its own tab; Inventory reveal staggered to R3 (supersedes ADR-112's six-tab lock)
- **created_date:** 2026-07-03
- **Context:** **ADR-112** (2026-07-02) locked a **six-tab** set and folded Quests
  into Character as "Undertakings 用", explicitly superseding **ADR-037**'s "Quests
  is its own tab." But ADR-112's own build DoD said the quest-home fork (§8.1) must
  be "resolved WITH the human" — it was shipped on the agent's default instead.
  The audit put it (and the R1 triple-reveal) to the human.
- **Decision (human, 2026-07-03):** **(1)** Quests get their **own dedicated tab**
  again — the set is now **SEVEN**: Work · Map · Estate · Inventory · Character ·
  Combat · Quests. This **supersedes ADR-112's six-tab lock and reinstates ADR-037's
  intent**. The Quests glyph is **用** provisionally (a taste call, overridable).
  The **Quests tab reveals at R5** — its own quest-log beat (ADR-037's cadence),
  **not** batched into the R3 combat wave (human call 2026-07-03, keeping the
  reveal one-per-beat). **(2)** The **Inventory tab reveals at R3** (staggered),
  not R1 — ending the Map+Estate+Inventory triple-reveal, which better honours the
  locked "nav reveal one-tab-at-a-time" intent. So the cadence is: Work R0 · Map +
  Estate R1 · Character R2 · Combat + Inventory R3 · Quests R5. **(3)** Ratified: House Influence (koku) stays on the
  **Estate** tab; the tab kanji glyphs (地図 · 家 · 蔵 · 己 · 武) are locked as the
  first cut.
- **Why:** quests earned a legible home of their own (the DoD flagged this for the
  human); staggering resolves a latent reveal-slam.
- **Consequences:** build-plan §3–§4; the PRD IA section → seven tabs; the stale
  code comments at `render.ts:4504–4506` (citing "ADR-112 supersedes ADR-037") are
  corrected. **Supersedes ADR-112** (six-tab set); reinstates/relates **ADR-037**.
- **Amendment (human, 2026-07-03):** staggering the Inventory tab to R3 left the
  **home** (`panel-home`) still revealing at R1 (`rank-r1`) with its "a place here
  is yours" narration — but the home/belongings pane lives *inside* the Inventory
  tab, so for two rungs the log promised a home with no tab to open. **`panel-home`'s
  reveal is moved to R3** (gated on the same `tab-combat` its tab uses), so the home
  is announced exactly when its tab appears. This **adjusts ADR-111's "home at R1"
  timing to home at R3** (*"R3 is fine, we don't need deep housing at R1 — plenty of
  R1 features already"*). `rest` still degrades gracefully pre-home (the cold-open
  post line, zero comfort); nothing at R1 depends on `panel-home`.

### ADR-120 ✅ — Housing: the hearth homes the cook verb; the chest is real storage; no morale system
- **created_date:** 2026-07-03
- **Context:** Deep housing (**ADR-111**) shipped a T0 slice, but the audit found the
  hearth and chest had been built as **raw stat bonuses** — diverging from the
  plan's stated intent — and asked whether to add a morale/upkeep register.
- **Decision (human, 2026-07-03):** **(1)** the **hearth homes the cook verb**
  (`cook_meal` happens at the hearth) — not a satiety stat. **(2)** the **chest
  (nagamochi) is real storage** (a belongings buffer/capacity) — not a satiety
  stat. **(3)** **No morale/upkeep system** — housing comfort stays concrete: rest
  recovery, satiety, and storage. The plan's "morale/upkeep" comfort channel is
  dropped for good.
- **Why:** diegetic mechanics beat raw stats; morale/upkeep is a whole new system
  the human declined for T0.
- **Consequences:** build-plan §5–§6 reverse the two off-plan defaults; the closed
  `ComfortKind` widens to include **storage** (not morale). Relates **ADR-111**.

### ADR-121 ✅ — Story: rung-beat cast & rewards ratified; the R7 capstone becomes a mechanical branch
- **created_date:** 2026-07-03
- **Context:** The rung-up story beats (**ADR-110**) shipped; the audit ratified the
  cast/rewards and asked whether the R7 capstone should matter mechanically.
- **Decision (human, 2026-07-03):** **(1)** ratified — keep the three invented
  faces (**Tokubei** the Ōmi pedlar, **Rokusuke**, the smith **Tōzō**); keep rare,
  varied rewards **including the one-time +1 AGI at R3**; **Naoyuki** (the heir)
  stays mentioned-but-unseen in T0. **(2)** OVERRIDE — the **R7 capstone choice
  must matter mechanically** (a real, legible branch carried into play), not just a
  remembered flag.
- **Why:** the cast/rewards read well; a capstone that changes nothing undersells
  the T0→T1 seam.
- **Consequences:** split to its own design track and **now DESIGNED + signed —
  see ADR-125** (the capstone-branch pattern + the T0 design); build is post-v0.3.5.
  Removed from the v0.3.5 build sweep. The full beat prose is still an R8 read.
  Relates **ADR-110**, **ADR-125**.

### ADR-122 ✅ — Status tokens: T0 grants exactly ONE home token; the full ladder is T1–T5
- **created_date:** 2026-07-03
- **Context:** koku Phase 5 (status tokens: surname → two swords → gōshi) was never
  built, and the housing status-mirror was deferred. The audit split Phase 5 out
  and asked about its scope.
- **Decision (human, 2026-07-03):** T0 grants **exactly one** hard-won home
  **status token**, displayed by the housing **status-mirror**. **Refined
  (human, 2026-07-03): the token is a WEAPON MOUNTED ON THE WALL** — specifically
  **the weapon you wield when you reach R5** (carrying-pole, or whatever you've
  crafted/found), granted at **R5**. **Explicitly NOT a surname** — the surname is
  the **T3 origin-story** beat (you already have one), and the mount must be *your*
  weapon, never a random sword you have no skill with. The full surname →
  two-swords → gōshi ladder stays **T1–T5 PRD planning**. Verbatim: *"how much
  status can you get in T0 lol… you can get one 'status token' for your home. And
  the rest is just planning for the PRD T1–T5."* + *"a weapon on the wall from one
  of the weapons you have in your inventory… R5 seems fine."*
- **Why:** scopes status accrual to the tier's reality; a wall-mounted weapon
  reads your *actual* path (T0 has three weapon lines), never a title you haven't
  earned.
- **Consequences:** build-plan §7 (the R5 wall-weapon slice + status-mirror); the
  full ladder becomes a PRD multi-tier arc, unbuilt in T0. Relates **ADR-109**,
  **ADR-111**, **ADR-120**.

### ADR-123 ✅ — Render: the append-only engine ratified; the Now-view residual closes
- **created_date:** 2026-07-03
- **Context:** The append-only render engine shipped all three phases on five
  agent-picked open-question defaults; the audit ratified them and flagged the one
  surface left doing a wholesale rebuild (`renderNowView`).
- **Decision (human, 2026-07-03):** ratify **all five** choices — migrate all
  surfaces · ship per-phase · the shared `reconcile.ts` helper · full
  flash-elimination (over a cheap throttle stopgap) · a standing zero-churn test
  per surface. OVERRIDE the residual — **migrate `renderNowView` to append-only
  too**, so no surface does a wholesale rebuild.
- **Why:** the engine is sound and shipped; consistency closes the last flash
  offender.
- **Consequences:** build-plan §2 migrates the Now-view.

### ADR-124 ✅ — Process: subagents inherit the parent's model by default (no lateral model switch)
- **created_date:** 2026-07-03
- **Context:** With multiple model tiers available (Opus, Fable, Sonnet, Haiku), a
  plan's "who builds this" section had begun proposing cross-model routing (e.g.
  Opus spawning Fable for taste work), risking silent lateral model switches.
- **Decision (human, 2026-07-03):** subagents and `Workflow` agents **inherit the
  parent's model by default**. The **only** self-serve exception is dropping to a
  **smaller/cheaper model for exploration or trivial mechanical work**. **No
  lateral switch** to a different same-tier model (e.g. Opus→Fable) without an
  explicit human instruction. A plan's routing section **proposes**; it does not
  license a switch.
- **Why:** predictable cost/quality; the human owns cross-model routing.
- **Consequences:** AGENTS.md "How to work here" gains the rule (applied this
  session); plan "who builds this" sections are proposals pending human approval.

### ADR-125 ✅ — Capstone branches: the tier-seam choice pattern (+ the T0 design)
- **created_date:** 2026-07-03
- **Context:** ADR-121 locked that the **R7 capstone choice must matter
  mechanically**, then split it to a design pass. A `grill-me` + `diverge` session
  (`project/brainstorms/2026-07-03-r7-capstone-branch.md`) settled both a **reusable
  pattern** (so T1–T5 capstones can be designed later) and the **concrete T0
  design**. This ADR records the pattern as canon; the build-ready detail lives in
  [`capstone-t0-branch.md`](../../project/archive/opus-2026-07-03-t1-capstone-branch.md) (the plan archived).
- **Decision (human, 2026-07-03) — THE PATTERN (applies every tier):** at each
  tier's **capstone rung** (the final Phase-1 rung — R7 for T0), the existing rung
  VN beat's **values choice** becomes a **branch**: each option **keeps** its
  relationship memory (`regard` + NPC warmth) **AND** unlocks a **unique next-tier
  side quest** giving **(1) a unique equippable ITEM + (2) a separate UNLOCK**. One
  choice per playthrough → one path; the others **lock out** (replay driver). **Full
  continuity — ascension is NEVER a reset** (stats/items/skills/standing all carry
  forward).
  - **The "quest + X" palette:** unique character / location (map node) / combat
    enemy / activity-or-skill / crafting recipes / shop / reputation-or-perk /
    reputation micro-faction / equippable item — or any balanceable combo.
  - **Out of scope:** new deeds; novel new UI *surfaces* (a new map node / a skill
    in the EXISTING systems is fine); a parallel "standing" advancement lane
    (micro-factions OK); a new *system* (helper / auto-labour); a whole new crafting
    *branch* (recipes + narrow refinements are fine).
  - **Balance philosophy:** the options **need not be equal** — a best / an OP / a
    narrative-only / a 5-min / an hours-of-grind option is fine. **Range is a
    feature.**
- **The T0 design (signed):** the R7 Shigemasa beat (**devoted / ambitious /
  humble**) → each unlocks:
  - **Devoted → "The House's Buried Shame"** — *item:* Sadamune's heirloom blade;
    *unlock:* a repeatable **enemy** (the enforcer **Kumagorō**) in a new hideout.
  - **Ambitious → "The Contest of Heirs"** — *item:* a fine dueling blade; *unlock:*
    **Naoyuki**'s B1-exclusive **early rival-debut at R7** (distinct VN scene; his
    normal intro fires at his normal rung for the other paths) + repeatable
    **spars** + a **Naoyuki-regard micro-faction**.
  - **Humble → "The Late Student"** — *item:* **Tōsai's chisel** (a craft-tool, NOT
    a weapon); *unlock:* the master **Tōsai** + a workshop node + a **craft
    activity/skill (or shop)** whose levels unlock **2–3 recipes**.
  - Item mix: weapon / weapon / craft-tool. Names Kumagorō & Tōsai are vetoable.
- **Why:** a values choice at the tier seam that *reshapes the next tier* is more
  memorable than a stat nudge; a reusable pattern lets each tier's capstone be
  designed to the same template; preserving the 9-option board + the human's
  ratings in the PRD gives future designers a worked example.
- **Consequences:** the PRD gains a **Capstone-branches** section (§3.0.2) with the
  pattern + the full T0 9-board + ratings + the three chosen outcomes; the R7 ladder
  row's "branch design TBD" note resolves to this. Supersedes the "TBD" half of
  **ADR-121**; relates **ADR-110** (rung beats), **ADR-119**. **⏳ Build DEFERRED to T1:**
  the side quests are T1 content (R8→R15) and T1 isn't built (PH6 — don't build
  unreachable); the R7 *choice* already ships. Full build-ready spec graduated to
  [`capstone-t0-branch.md`](../../project/archive/opus-2026-07-03-t1-capstone-branch.md); its plan is archived.

### ADR-126 ✅ — Taste: the top layer locked (4 values · 3 touchstones · 2 references) + the taste docs become budgeted snapshots
- **created_date:** 2026-07-03
- **Context:** the ⭐ "redo taste-distillation WITH Fable" TODO. The first-cut
  `taste.md` (437 lines, 22 principles) is corrective, not generative — its
  F-coverage is near-total but it has no top layer an agent can reason from in
  situations no rule covers; and living docs bloat without a bound (the
  326-line `project-status.md` lesson). Grill session + full Q&A log:
  `project/brainstorms/2026-07-03-taste-transfer-architecture.md` (§10);
  build order: `project/archive/fable-2026-07-03-taste-redo.md` (✅ done, archived).
- **Options:** (a) more principles + a bigger checklist; (b) a generative top
  layer (values + touchstones) over culled principles, with hard doc budgets;
  (c) leave the draft as-is.
- **Decision:** (b), locked as:
  - **Values ×4:** one-home-for-everything · never-yank-the-ground(-under-the-
    player) · fiction-causes-mechanics · never-guess-state. The two-registers
    density value is DEMOTED to a principle; "no-backstage" is demoted too
    (its DEV-ergonomics content P21/P22 moves to `qa-playtesting.md`).
  - **Touchstones ×3:** GBA-era typewriter · JRPG "learned" boxes ·
    Fallout-style dialogue tree.
  - **Density references ×2:** proto23 (<https://23html.github.io/>) +
    yet-another-idle-rpg (<https://miktaew.github.io/yet-another-idle-rpg/>)
    — the what-to-take lines are agent-proposed after screenshot capture,
    human-confirmed.
  - **Kurosawa/woodblock is SOFTER canon than `ui-design.md` claims** — treat
    the visual identity as provisional pending **R9** (the UI-remaster taste
    call); do not restate it as locked.
  - **`taste.md` + `ui-design.md` are snapshot-class** (replace-in-place,
    never append) with **hard caps 150 / 400 lines** (rewrite targets
    ~110 / ~300), gated by a `verify-doc-budgets` docs-lane verify gate; the
    F-corpus in `project/feedback-human/` stays the lossless example record.
    The pre-ship checklist LEAVES `taste.md` → FB-10's generated scorecards.
  - **Derivation corpus:** `2026-07-02-playtest.md` ONLY (the first and only
    playtest); a systems-taste layer waits for a systems playtest.
- **Why:** "build it as if I wrote it" needs a layer that *predicts* verdicts
  in novel situations — values and touchstones transfer; rules only correct.
  A hard budget turns append into displace, so the standard sharpens instead
  of growing; the examples already live in the corpus, and restating them in
  living docs is drift, not safety.
- **Consequences:** the taste-redo plan P1–P4 executes against this lock;
  AGENTS.md gains a ~10-line taste register (P3); FB-10 re-plans once
  `taste.md` locks; `ui-design.md`'s vision statement gets a
  provisional-pending-R9 marker in the P2 cull.

### ADR-127 ✅ — UI-v2 direction: **10 Andon Steel** (R9 resolved)
- **created_date:** 2026-07-04
- **Context:** **R9** — the UI-remaster taste call — asked which of the full
  working `ui-demos/` remasters becomes the real game's next UI generation. The
  field: six directions (01 Moonlit … 06 Washi), human-shortlisted to 01 / 04 /
  06; then, torn between **01 Moonlit** and **04 Lacquer**, the human commissioned
  a **Moonlit × Lacquer fusion round** (07 Andon · 08 Night Seal · 09 Damascene),
  and after reviewing those landed on a synthesis built as **10 Andon Steel** (07's
  composition in 09's blackened steel + a 06-style GBA typewriter cold-open). Field
  cut + build specs: `project/archive/2026-07-02-ui-remaster-variants.md`,
  `project/brainstorms/2026-07-03-moonlit-lacquer-fusion.md`, and the fusion plan
  (archived).
- **Options:** any of 01–10, a further blend, or a refinement round.
- **Decision (human, 2026-07-04):** **10 Andon Steel** is the locked UI-v2
  direction — *"R9 we choose andon 10, lock that in."* Demo 10's language becomes
  the target for the real game's UI: **uniform blackened-steel bimetal** (silver =
  state · gold = value · vermillion = commit), the two-light warm/cool grade and
  the nunome texture dropped for clean steel, the log a dark recessed steel well,
  and a **06-style GBA typewriter cold-open**. The name "Andon Steel" is a working
  label (renamable).
- **The rest of the field is ANCHORED, not deleted (PH2 · archive-don't-remove):**
  ~~01–09 stay in `ui-demos/` as the committed exploration record (the reference the
  pick was made against); the gallery marks 10 as the locked winner. Nothing is
  stripped from `ui-demos/` (it's a mock staging ground — no PROD flag-debt to
  clear; the real strip happens when UI-v2 is ported into `src/`).~~
  **Superseded (human, 2026-07-09):** `ui-demos/` was a one-time ground — the
  whole directory is deleted; the exploration record (01–10 + gallery + shared
  engine) lives in git history (`6a6447c` and kin). Standalone feel-test
  prototypes now have a permanent home in `project/prototypes/` (see its
  README).
- **Why:** the human reviewed the whole field live and synthesized the winner
  himself; 10 is that synthesis. A single locked direction lets a UI-v2 build plan
  target one language instead of hedging across the field.
- **Consequences:**
  - **🔁 Amends ADR-126** — its "*Kurosawa/woodblock is SOFTER canon … visual
    identity provisional pending R9*" clause now **resolves**: the UI-v2 target
    identity is **Andon Steel** (blackened-steel bimetal), which **supersedes** the
    woodblock/washi/paper language *as the target*. `ui-design.md` + `taste.md`'s
    visual-identity sections get rewritten when the UI-v2 port is planned — not now
    (they're snapshot-capped; the port owns that rewrite).
  - **⏳ Build DEFERRED — the port to `src/` is a future plan (PH6):** demo 10 is a
    `ui-demos/` mock; porting its language into the real game is a large, not-yet-
    scoped build. Until it lands, the **current washi build keeps shipping**.
  - **Open, surfaced for the human:** whether the still-open current-UI variant
    picks (**R2 / R5 / R6 / R7** — panel/map/bestiary/home diverges on today's washi
    UI) are now moot given UI-v2 supersedes them, or still wanted as interim polish.
    Left to the human; not closed here.
  - Closes **R9**; graduated to the human-in-the-loop archive.

### ADR-128 ✅ — Process: ripple the PRD *during T0 too* — NO T0 compression backlog
- **created_date:** 2026-07-04
- **Context:** F1b Ph1 (the `prd:drift` reporter) made a deliberate call to
  **defer** every T0 spec-altitude presence gap it found (weapons, mobs, stances,
  cast names) to the future **R1-gated compression sweep** (Flow 2, ADR-117) —
  reasoning that the sweep will rewrite that territory anyway, so hand-rippling
  now "double-pays," and that "the punch-list IS the sweep's backlog." That left
  a growing pile of game→PRD drift sitting un-rippled through all of T0.
- **Options:** (a) keep deferring T0 gaps to the compression sweep; (b) ripple
  continuously during T0, letting the punch-list drive small ongoing edits so no
  backlog accumulates.
- **Decision (human, 2026-07-04):** **(b).** *"I don't want a T0 compression
  backlog at all, I want to ripple during T0 too."* The `prd:drift` punch-list is
  worked **continuously**, not stockpiled — each built-system change ripples its
  own drift as it lands (Flow 1), and standing gaps are cleared as we go.
- **Why:** a backlog that waits for a single tier-close sweep is exactly the
  drift-accumulation the PRD-on-a-diet effort exists to kill; keeping the PRD in
  sync incrementally is cheaper to review (small diffs) and means the spec always
  matches the build (PH2 — the build is the territory).
- **Consequences:**
  - **🔁 Refines ADR-117 and reverses F1b Ph1's defer decision.** The compression
    sweep (**Flow 2 / `/prd-compress`**) stays alive for its real job — *prose
    compression* to intent + acceptance criteria at a tier's taste-review close —
    but **presence-gap rippling no longer waits for it**. The two are decoupled.
  - **Unblocks bulk gen-region transclusion** (F1b Ph2 had gated it on R1): the
    durable no-backlog mechanism is to transclude derivable T0 rosters (weapons,
    mobs, stances) as **gen-regions** so that whole class of drift becomes
    impossible by construction, not merely detected. Proposed as the next build.
  - **Per-item judgment still applies** — `prd:drift` is tier-blind, so a
    deliberately tier-gated entity (e.g. the **road bandit**, gated to T2 per
    A10/`9a5fc4e`) ripples into the **frontier** section (§5), not T0 (§3); a
    genuine roster *mismatch* (built weapons ≠ §4's designed roster) is its own
    decision, not a reflexive add.
  - First ripple under this rule: the **three stance names** (jodan/gedan/chudan)
    into §2.8 + §3 R5, landed 2026-07-04.

### ADR-129 ✅ — Content: the T0 weapon roster is pole + woodlot-axe + forged-yari (kama-yari retired from T0)
- **created_date:** 2026-07-04
- **Context:** `prd:drift` (ADR-128's first sweep) surfaced a genuine roster
  **mismatch**, not a mere missing name: §4.6.9's weapon table designed the T0
  second/third weapons as **kama-yari** (cross-spear, "Sweep") + yari, but the
  build ships **woodlot-axe** (`wood_axe`, a found/crafted heavy tool) + **forged
  yari** (`yari`, the Line-1 spear you graduate to). The kama-yari was never built.
- **Options:** (a) ripple §4 to match the build (build is the territory, R2);
  (b) treat the shipped roster as drift and move the code back toward kama-yari.
- **Decision (human, 2026-07-04):** **(a) — ripple §4 to the build.** The T0
  roster is **carrying-pole (0th improvised) → woodlot-axe (found/crafted 2nd) →
  forged yari (Line-1 spear, the graduation weapon)**. Kama-yari is **retired from
  the T0 roster** (not currently built); whether it returns as a later-tier spear
  variant is an open frontier call, not decided here.
- **Why:** the build has shipped, been played, and is the territory; §4's kama-yari
  row was stale forward-design that the woodlot-axe replaced. Keeping the PRD's
  named roster matched to the registry is exactly ADR-128's "no T0 backlog" intent.
- **Consequences:**
  - §4.6.9's T0 rows now read woodlot-axe + forged-yari (the provisional TUNING
    numbers stay hand-authored per ADR-021 — only the roster identity was rippled).
  - The **weapon identity roster is now a gen-region** (§2.10.1, from `WEAPONS`)
    and the **T0 bestiary** likewise (§2.9, from `MOBS`, tier-filtered) — so this
    class of name-drift is now impossible by construction, not just detected
    (ADR-128's durable mechanism; the `gen-prd-regions` gate holds it).
  - The **road bandit** (T2-gated, A10) got its proper §5 frontier mention in the
    same sweep — it is NOT in the T0 bestiary region (correctly excluded).

### ADR-130 ✅ — Toolchain: swap ESLint→oxlint and Prettier→oxfmt (full replacement, no two-tier)
- **created_date:** 2026-07-04
- **Context:** ESLint (4.06 s) + Prettier (4.17 s) were the two heaviest `verify`
  gates — together they set the critical path and left only 0.41 s of headroom
  under the 5 s drift budget (ADR-072). The FB-2-CI Ph3 plan
  (`fable-process-F2-github-actions-ci.md`, being archived this session)
  scoped a **two-tier** swap (oxlint repo-wide + a thin `eslint src/core` kept for
  the boundary rules) because oxlint historically lacked `no-restricted-syntax`
  (the esquery `new Date()` ban) — the four pure-core boundary rules (PRD §6.1/§6.2)
  are the crown jewels and a missed rule is a silent determinism hole.
- **Decision (human, 2026-07-04):** **full replacement — drop ESLint and Prettier
  entirely**, no two-tier. oxlint 1.72 + oxfmt 0.57, exact-pinned.
- **Why the full swap is sound (parity PROVEN, not assumed — R2/R3):**
  - The `new Date()` gap is closed by banning the **`Date` global** in the
    `src/core/**` override (`no-restricted-globals`) — which subsumes BOTH
    `new Date()` and `Date.now` (core uses no `Date` at all, only comments). A
    scratch probe hitting all violation classes was run through **both** the old
    ESLint config and the new `.oxlintrc.json`: **both flag the identical 7
    classes** (`window`, `Math.pow`, `Math.random`, `new Date()`, `Date.now`,
    `performance.now`, the `../ui` import) and **neither** flags the allowed
    `Math.sqrt`. `performance.now` is likewise covered by banning the
    `performance` global.
  - oxfmt's `--migrate=prettier` reproduced the `.prettierrc.json` settings +
    `.prettierignore` scope into `.oxfmtrc.json`; `--list-different` showed **zero**
    reformatting on the committed tree. Full parity, so no churn.
- **Consequences:**
  - Gate roster (`gates.ts`): `eslint .`→`oxlint`, `prettier --check .`→`oxfmt --check`.
    `verify` median **4.59 s → 3.48 s** (headroom 0.41 s → **1.52 s**); the two
    heavies drop to oxlint **0.16 s** + oxfmt **0.42 s**. Critical path is now
    vitest + tsc (as predicted).
  - Removed: `eslint.config.js`, `.prettierrc.json`, `.prettierignore`, and the
    `eslint` / `@eslint/js` / `typescript-eslint` / `prettier` / `globals` devDeps.
    Added: `.oxlintrc.json` (the boundary override lives here now — the "one home"
    for the pure-core rules moved from `eslint.config.js`), `.oxfmtrc.json`.
  - Slightly **stricter** than before by design: the whole `Date` and `performance`
    globals are banned in core (not just `.now`) — no false positives (core uses
    neither), and it's a tightening, never a hole. The `src/persistence` save-layer
    `Date.now` exemption is unaffected (the override is scoped to `src/core/**`).
  - FB-2 Ph3 is now DONE — this was its deliverable.

### ADR-131 ✅ — Toolchain: swap `tsc` → `tsgo` (native-preview TS compiler) for the typecheck gate
- **created_date:** 2026-07-04
- **Context:** after ADR-130 dropped ESLint+Prettier, `tsc --noEmit` (~3.15 s) was
  tied with vitest for the `verify` critical path. `tsgo`
  (`@typescript/native-preview`, the Go-native TypeScript 7 compiler) is a
  CLI-compatible drop-in that typechecks the same `tsconfig.json`.
- **Decision (human, 2026-07-04):** swap the typecheck **gate + `build` +
  `verify:seq`** from `tsc --noEmit` to `tsgo --noEmit`. Keep the `typescript`
  devDep installed (Vite/editor/language-service + an escape hatch), since
  tsgo is still a **preview**.
  - _Update (2026-07-04, later same day): `verify:seq` was **removed** — it was a
    hand-maintained `&&` duplicate of the `gates.ts` roster and had drifted (10 of
    15 gates), a false-green risk (PH3). The serial view is now `pnpm run verify --
    --sequential`, which reads the roster from `gates.ts` like every other mode, so
    it can't drift again._
- **Why it's sound (parity proven — PH3):** `tsgo --noEmit` passes clean on the
  type-correct tree AND flags a deliberate `TS2322` with the **same error code**
  as tsc (exit 1), green again after removal. Typecheck **~3.15 s → ~0.39 s**.
- **Consequences / risk:** tsgo is a dev-preview; the pinned exact version moves
  deliberately. If it ever mis-types (misses or false-flags), the escape hatch is
  one line — `tsgo --noEmit` back to `tsc --noEmit` in `gates.ts` (typescript is
  still installed). The gate name in the roster is now `tsgo`.

### ADR-132 ✅ — QA: the persona-bot balance sim + envelope gates (FB-4) — bands only from signed canon
- **created_date:** 2026-07-04
- **Context:** balance canon written before play has a poor survival rate (the
  koku → coin/rice/standing re-coring inside ~36 h), and the only machine
  pacing answer stopped at R3 (`pacing:check`) — the whole post-combat climb,
  Phase 2, and every non-optimal style were unmeasured until a human played.
  The economy balance-watch had already named the cost (the ~0.4-min Phase-2
  anticlimax).
- **Decision:** a standing sim harness (`src/sim/`, FB-4): three persona bots —
  greedy (`focusedOptimalIntent` + a real combat leg), idler (the extracted
  `autoModeIntent` the app loop itself now consumes), explorer
  (novelty-first breadth) — drive the REAL engine through public intents
  only, over 5 fixed seeds. **Envelope rules:** a band may derive ONLY from a
  signed constant (`T0_PACING_BAND_MIN/MAX` gates greedy's per-rung
  wall-time; structure — ladder + ascension + no soft-lock — gates every
  persona); no signed intent ⇒ report-only (idler/explorer times, the
  Phase-2 window → HD-19), never an agent-invented band. A RED is a
  design-drift ALARM for a human, never auto-canon. **Rung placement
  (§5a):** on-demand `verify:balance` + a ~40 ms vitest tripwire (canonical
  seed) + a `--check-fresh` fingerprint **pre-commit WARN** (human call
  2026-07-04; promotion to a hard gate = HD-20). The generated
  `docs/content/t0-pacing.md` is committed so its `git diff` is every
  balance change's before/after; `--summary` pastes per-rung deltas into
  the commit body.
- **Why it's sound (PH3):** the harness self-verifies against known reality —
  greedy's R0–R2 buckets equal `walkPacing()` EXACTLY on the canonical seed,
  and the report *rediscovered* the balance-watch's Phase-2 anticlimax.
  RED-ability was proven live (R5 threshold ×3 → the gate, tripwire and
  freshness all RED naming R5). The soft-lock detector (500 no-progress
  intents ≈ 45× the measured green ceiling) is proven to fire on a
  manufactured stall and never on green runs. Matrix runtime ~1 s.
- **Consequences:** every balance change now has a machine verdict + a
  committed before/after; `t0-arc.test.ts`'s `applyGrindFight` shortcut is
  superseded by greedy's stronger real-`fight` proof (migration parked, FB-4
  §8 Q7); `RUNG_WALL_FLOOR_MIN` gets its instrument when T1 lands (ADR-088).

### ADR-133 ✅ — Design/QA: Phase 2 ≈ Phase 1 (~1:1 wall-time) — the ratio band gate (resolves HD-19)
- **created_date:** 2026-07-04
- **Context:** the FB-4 sim (ADR-132) machine-measured the T0 capstone→ascension
  window (R7 capstone → Estate EXCELLENT → ascend) at **~0.4 wall-min** for
  every persona × seed, against a ~83-min Phase 1 — the economy
  balance-watch's "anticlimax," now confirmed. The PRD (§1.6.4) promised only
  that Phase 2 is "NOT a dead consolidation half"; it never fixed a *duration*
  or a *ratio* to Phase 1, so the sim could report the window but had no signed
  band to gate it (an agent-invented band = a wolf-cry, ADR-132). HD-19 asked
  whether to sign one.
- **Decision (human, 2026-07-04):** Phase 2 should take **roughly equal time to
  Phase 1 (~1:1)** — a **GENERAL RULE across tiers**, a tunable playtest
  default, not a frozen constant (*"24s is dumb and 1:1 is a better random ass
  default"*). Expressed as a **ratio band** `PHASE2_PHASE1_RATIO_BAND =
  [0.8, 1.2]` (single-sourced, AC-21 — auto-scales per tier, can't drift from
  "equal time"), landed as a **HARD `verify:balance` gate** (*"we can block on
  it hard"*). The gate is **scoped to tiers whose Phase 2 is actually built**
  (today: T0 only) so it no-ops on unbuilt T1+.
- **Sequencing (PH3 — a gate must be green-able):** the current build produces
  0.4 min, so the ratio gate ships in the **same change** as a **quick T0
  Phase-2 economy hotfix** that stretches the window to ~1:1 — never a
  permanently-red hard gate. Balance-magnitude change ⇒ ADR-132 protocol
  (`verify:balance` → `balance:report`, regenerate + commit
  `docs/content/t0-pacing.md`, `--summary` in the body).
- **Known debt (PH5):** a pure-threshold hotfix stretches *duration* but not
  *fun* — 83 min of one repeated action is the "dead consolidation half" the
  PRD warns against, and the band gate proves duration, NOT fun (a
  threshold-only fix that greens the gate is a false-green). So the T0 hotfix
  is an explicit **stopgap** (stretch + minimal texture); the real **Phase-2
  economy redesign** (multiple deed sources, the E0→E1 build as pacing beats,
  authored reveals) is the queued follow-on that earns the duration.
- **Consequences:** HD-19 closes; `PHASE2_PHASE1_RATIO_BAND` becomes the
  single-source pacing law for every tier's Phase 2; T1+ Phase-2 economies are
  designed to hit ~1:1 from the start; the T0 hotfix + gate is the next build
  task; the Phase-2 economy redesign is queued (fun, not just duration).

### ADR-134 ✅ — DEV-tooling: the balance-tuning cockpit (FB-7) — live overrides, human tunes / agent transcribes
- **created_date:** 2026-07-05
- **Context:** the ADR-059 "liquid magnitude" call means only a human may set
  which balance numbers feel right, but the tuning loop was
  edit-`balance.ts`→rebuild→reload→replay-to-the-moment→repeat — an afternoon
  per feel item, with four open balance-watch targets (rice faucet, store-vs-sell,
  eat-vs-rest, the koku capstone). No way to feel a number mid-run.
- **Decision:** a DEV-only **balance cockpit** (the DEV panel's Balance tab +
  `__qa.balance`). A curated set of `balance.ts` levers is made live-tunable:
  scalars flip `export const`→`export let` and are reassigned **in-module** by
  `__setBalanceLever` (ES named imports are live bindings, so every reader's next
  read sees the new value — zero call sites change); structured map paths
  (`ESTATE_BANDS.*`, `RUNG_METER_THRESHOLDS.*`, `STANCE_MODS.*`,
  `RICE_SELL_PRICE_BY_SEASON.*`) mutate their runtime object in place. Overrides
  live in the module binding **+ the URL** (`?bal.<path>=<value>`, FB-18 pattern) —
  **never the save envelope** (a sticky localStorage retune is exactly the ADR-059
  silent-retune failure). The **human/agent division is the point:** the human
  drags a slider, feels it, and **exports** a committable diff artifact (riding
  the FB-3 playtest-inbox endpoint verbatim); an **agent transcribes** the exact
  old→new edits — an agent **never** moves a slider into canon on the human's
  behalf. The whole hook is DEV-folded and dead-code-eliminated from prod (the
  `balance-override` string is in the `verify-dev-strip` deploy gate).
- **Why it's sound (PH3):** proven on the real dev server headlessly —
  `__qa.balance.set('RICE_PER_RAKE',10)` → the next rake gained exactly 10, reset
  → 3 (a dead live binding would give 3, so the test could go RED); a prod build
  greps **0** hits for `balance-override` (Rollup strips the setter — Risk 1 moot,
  even through the `export * as balance` namespace re-export); a save-non-leak
  test pins that overrides never reach the envelope; the registry/CANON/switch
  lockstep + every-path round-trip tests are the tripwire against drift or a
  future `Object.freeze`.
- **Consequences:** feel-tuning collapses from an afternoon to ~10 min (drag →
  feel → export → hand to an agent); the export composes with the FB-4 balance-sim
  re-verify flow (a VALUE change stales the report fingerprint — the exported
  diff is exactly that event, ADR-132); the cockpit **revealed** the koku capstone
  is already ~96 min under current canon (`ESTATE_DEED_PER_ACT` = 0.04, the ADR-133
  stopgap) — the balance-watch's "~30 s" was stale. Content-side magnitudes
  (`ACTIVITIES` yields, mob stats) stay out of v1 (a parked v2 "content levers"
  group); `AUTO_REPEAT_MS` is excluded (load-time-frozen into the boot
  `setInterval`).

### ADR-135 ✅ — process: taste-bar enforcement — the TWO-PASS taste flow (FB-10)
- **created_date:** 2026-07-05
- **Context:** taste.md locked (ADR-126: 4 values → 21 numbered principles,
  capped, prediction-tested) but only fired as a "read this first" norm — an
  agent could build a surface, never walk the principles, and the human would
  discover the violations in review. taste.md line 150 promised "the pre-ship
  checklist is the FB-10 scorecard flow" with no flow built. A post-hoc
  scorecard alone is a grading instrument, not a generative one — the human
  steered the shape to two passes (locked in-session, 2026-07-05).
- **Decision — two passes, everywhere:** every new/restyled surface,
  feature, or narrative beat (one-liners/fixes exempt) runs the
  `taste-scorecard` skill twice. **Pass 1 · constraint brief, BEFORE
  building:** walk ALL 21 principles; one concrete line per applicable one
  (what THIS work must do to honor it) — the standard as a design input; in
  a diverge it's authored before ANY variant so it constrains all of them.
  **Pass 2 · scorecard, AFTER:** the full 21-re-walk (`✔/✘/—`), **per
  variant** in a diverge (a variant the human might pick must not hide a
  violation); fix-before-score; a shipped `✘` is a NAMED corner-cut (A19).
  **The pass-diff is the calibration signal:** each ✘ is tagged
  **[briefed]** (knew-and-missed → execution slip) or **[blind spot]**
  (taste.md's text failed to fire → THAT principle is the one to sharpen,
  ADR-126 amendment path). Homes: full walks → journal; compressed brief +
  per-variant verdicts (`N✔ · N✘ · N—` + ✘ lines) → the HR-item, intent
  beside result. Deliberately NO surface-type applicability matrix (a
  second home for taste.md's structure that would rot — V1); n/a marks are
  cheap and prove consideration.
- **Enforcement rung (AC-11):** a **skill-step + mandatory HR-item template
  sections** — NOT a verify gate (taste pass/fail is judgment; a lint would
  cry wolf). The teeth are artifact-shaped: an HR-item missing its brief /
  `Scorecard:` blocks is visibly incomplete. Greppable candidates (P4
  container resets, P20 raw `vw`) graduate to a real gate only on a
  RECURRING violation — promoted on evidence, not speculation.
- **Deferred (named, human call — shape B):** the closed distill loop —
  logging human-vs-scorecard mismatches as F-items feeding `/distill-taste`,
  with the prediction test re-run as a regression harness — is NOT built;
  re-distill of taste.md stays **manual only** (the human invokes it).
  Blind-spot tags accumulate in HR-items/journals meanwhile, so the evidence
  corpus exists whenever the human fires a re-distill.
- **Anti-theater tripwire:** if scorecards trend all-✔ with never a ✘, the
  flow is rubber-stamping — revisit the instrument, not the surfaces.

### ADR-136 ✅ — process: FB-8 real-play telemetry — attended time is the third pacing leg; agents consume it by default
- **created_date:** 2026-07-05
- **Context:** pacing stood on two legs — sim bots (theory, ADR-132/FB-4) and
  design bands (intent) — while the human's REAL minutes were guessed; the
  koku capstone measured ~25–30 s against an intended ~85-min climb, and no
  sensor existed to catch it. The human's own spec set the bar: 5-min-play /
  20-min-away / 5-min-play must record 10 minutes, not 30. Zoomed out
  in-session: the primary consumer is the NEXT AGENT touching a balance
  number (agents are session-goldfish — data they must remember to fetch
  does not exist), so delivery matters as much as measurement.
- **Decision — the model (all locked in-session, 2026-07-05):** a DEV-only
  pure sessionizer (`src/telemetry/`, unit-proven, zero core changes)
  classifies every instant: active (input ≤60 s) · idle (visible+focused
  under a **TWO-TIER idle TTL — 5 min autos-armed / 2 min static**; watching
  the grind IS play) · hidden/blur (**excluded ALWAYS**) · walked-away
  (retro-split at lastInput+TTL). Sleep watchdog (30 s heartbeat ×3); note
  re-engagement kept (30 s, zeroable — the flagged weakest rule); no
  micro-gap merging in v1; history kept across new-game (run-id tagged);
  a **taint ledger** (`qa-drive`, teleports, `speed>1`, `save-import`)
  keeps agent/cheat runs out of the vs-sim comparison. **Human pacing data
  NEVER gates** — n=1 evidence; the sim owns gating.
- **Decision — the delivery loop (Ph4 redirected off the FB-3 inbox):**
  reports are NOT playtest captures. They land in **git-ignored
  `project/telemetry/`** (committed README only): **folder** (auto-drop on
  session-end via `apply:'serve'` middleware) + **signpost** (ADR-132 balance
  flow step 0: read it first, quote attended-vs-sim) + **morning shout**
  (session-brief prints reports newer than the last balance commit; silent
  at zero) + **diary rule** (raw = local-only; conclusions distilled into
  committed notes — the `brainstorms/raw/` two-tier pattern; the first
  deliberate exception to "the repo is the memory", justified because the
  data is one machine's disposable sensor readings, regenerated by playing).
- **Strip teeth:** `__KAMI_TELEMETRY__` joins the deploy-gate marker loop;
  proven by build+grep, re-proven in `telemetry-smoke.mjs` (7 real-browser
  asserts incl. attended≠wall and zero hidden ticks).
- **Supersedes:** the FB-8 plan's flat 5-min TTL and inbox-bound Ph4
  (`project/archive/fable-process-F8-play-telemetry.md` carries the full spec).

### ADR-137 ✅ — design: requirements-based rung progression replaces the points meter (FB-121)
- **created_date:** 2026-07-05
- **Context:** the rung meter rendered raw points (`476/1100`) — the human's
  read (playtest capture FB-121): *"a random ass number that has to go up."*
  Points accrued flatly (`RUNG_POINTS_PER_ACT` per eligible act vs a per-rung
  threshold table), so progress was volume, not meaning. Grilled live
  2026-07-05 (three AskUserQuestion rounds, checkpointed in
  `project/brainstorms/2026-07-05-requirements-based-rung-progression.md`).
- **Decision (all locked by the human in-session):** each rung R0–R7 has a
  finite authored list of **hidden requirements**, order-free, and a
  requirement can be **anything internally consistent with the game and
  story** — counted acts, quest-token goals, economy/state predicates, story
  beats. The player sees only a **rounded integer % bar** (no checklist, no
  task HUD); counted requirements move it in 5–10 quantized chunks, atomic
  ones jump; every completion fires a **diegetic flavor line**. **100% alone
  unlocks the rung beat** (`RankDef.storyGate` deleted — story preconditions
  become requirements; the ADR-110 hold + rung-up screen unchanged: the beat is
  the story that explains the promotion). **Points model fully deleted**, not
  wrapped. Pacing **re-derives**: author for fiction first, the FB-4 sim
  measures, the bands re-sign from what the model produces. Lists are
  **authored in FB-5 narrative markdown** (`requirements.md` → gen; counts are
  md numbers, no balance.ts mirror — the cockpit rung sliders retire).
  **All 8 rungs in one pass.**
- **Deferred:** an optional player-facing hint system (parked); a DEV-only
  cheatlist ships with the build so the human can inspect the live lists.
- **Plan:** `docs/plans/fable-2026-07-05-requirements-rung-progression.md`.
  Supersedes the ADR-056 threshold-table mechanism (the band *targets* remain
  the pacing intent until the Phase 5 re-derivation re-signs them).

### ADR-138 ✅ — T0: ship the client-side DEV tools INTO the gh-pages bundle, default-off (`?dev=yes`)
- **created_date:** 2026-07-06
- **Context:** ADR-067 hard-stripped ALL DEV tooling from prod (the
  `verify-dev-strip.sh` deploy gate refuses any bundle leaking `__qa` / the
  ADR-075 variant harness). But during T0 the human wants to reach the DEV panel,
  `__qa`, the variant toggle, the balance cockpit and the FB-6 fixtures **on the
  live gh-pages deploy** — reviewing variants (HR-2/HR-5/HR-6/HR-7) and driving state on
  the real deployed build, not only a local dev server. Direction locked by the
  human via AskUserQuestion (2026-07-06): scope = **client-side tools only**;
  gate = **invert under a T0 build flag + this ADR**.
- **Decision:** split the one `import.meta.env.DEV` gate into two axes.
  **(1) Inclusion** — a new `__DEV_TOOLS__` vite define (tree-shaking gate):
  `command === 'serve' || SHIP_DEV_TOOLS`, where `SHIP_DEV_TOOLS` defaults ON
  (we're in T0). So the client tools compile into the prod bundle now; post-T0
  `SHIP_DEV_TOOLS=0` folds every `__DEV_TOOLS__ && …` gate to dead code and the
  hard strip returns. **(2) Activation** — the pure `resolveDevGating(isDev,
  hasTools, search)` (`src/app/dev-gating.ts`): a T0 prod bundle is
  **default-OFF**, opt-in `?dev=yes` (aliases `1|true|on`); a dev serve is
  default-ON, `?dev=no` opts the panel out (aliases `0|false|off`) while `__qa`
  stays for e2e. **Scope:** only the pure client-side tools ship — the
  server-coupled **FB-8 telemetry** and **FB-3 playtest-capture** overlay POST to a
  dev server absent on gh-pages, so they stay gated on `import.meta.env.DEV`
  and are always stripped (the cockpit's `/__playtest-capture` endpoint *string*
  rides along inertly — its POST 404s harmlessly under `?dev=yes`).
- **Soundness:** `verify-dev-strip.sh` is now two-mode (follows `SHIP_DEV_TOOLS`):
  **ship** → client markers MUST be present, server markers absent; **strip** →
  all absent (the original ADR-067 gate). The *default-inert* runtime behaviour —
  which the dev-server e2e lane can't reach (it always boots `DEV=true`) — is
  proven by the RED-able `resolveDevGating` unit matrix
  (`src/app/dev-gating.test.ts`). Both gate modes verified to go RED against the
  wrong build.
- **Scope of this ADR:** LIMITS ADR-067 to post-T0 (ADR-067's strip is the `strip`
  mode; T0 runs `ship`). A T0-window convenience, not a permanent reversal —
  the single `SHIP_DEV_TOOLS` switch flips it back cleanly.
- **Plan:** `docs/plans/opus-2026-07-06-ship-dev-tools-t0.md`.

### ADR-139 — Narrative diverge: every story element ships from 3+ takes, never one
- **created_date:** 2026-07-06
- **Context:** the anti-slop problem ADR-075 solved for UI exists for story too:
  a single-authored narrative take defaults to generic prose. The human queued
  "implement & design a diverge for story & narrative" (todo, 2026-07-06);
  grilled live 2026-07-06 (six AskUserQuestion rounds, checkpointed in
  `project/brainstorms/2026-07-06-narrative-diverge-design.md`).
- **Decision (all locked by the human in-session):** a **standing rule** — ALL
  new story elements and ALL feedback-driven story improvements come with **3+
  options**. Scope: any **fiction-voiced text** the player reads (beats,
  dialogue, cold open, flavor lines, item/creature/location names +
  descriptions) at its own unit size; mechanical UI copy and typo/name-sync
  edits exempt. **Distinctness bar:** each option makes a different *dramatic* 
  choice (register / information revealed-withheld / character stance) — a
  paraphrase is not an option. **Authoring:** independent blind agents, **one
  agent per complete TAKE** of a bundle (sets stay internally coherent),
  session-model routing (ADR-124 default, no standing Fable exception).
  **Pick:** agent self-picks via per-option taste-scorecard Pass 2 (FB-10,
  ADR-135) + canon fit; rationale in the bundle review doc; human overrides —
  never blocks. **Bundling:** taste calls reach the human in coherent bundles
  sized by judgment (story-drop or per-dramatic-unit), never 25+ atomized
  picks. **Review medium:** in-game DEV surfaces — a story-variant
  set-switcher (sets + per-unit override) + a read-only full-page
  script-reader modal; sign-off is conversational (read in-game, tell the
  agent). **Lifecycle:** alternates live DEV-only until sign-off, then are
  pruned; the committed review doc is the archive (canon FB-5 markdown carries
  only the pick — zero prod flag-debt, mirrors ADR-075).
- **Boundaries:** the queued fable **audit** + **redesign** TODOs stay
  untouched fresh-context work the human kicks off (no pre-wiring from this
  design session); retro coverage of the existing T0 story arrives via that
  redesign. HR-8 stays open as-is.
- **Enforcement rung:** ADR (this) + always-loaded AGENTS.md bullet + the
  [`narrative-diverge`](../../.claude/skills/narrative-diverge/SKILL.md) skill
  (sibling of `diverge`, cross-linked). No gate — it would cry wolf on
  mechanical edits (AC-11).
- **Plan:** `docs/plans/fable-2026-07-06-narrative-dev-surfaces.md` (the two
  DEV review surfaces — design now, build next).

### ADR-140 ✅ — 2/3-letter ID prefixes: the single-letter namespace collapse (context-hardening P4c1)

- **Context:** The 2026-07-05 context audit flagged namespace traps in the
  always-loaded layer: taste values `T1–T4` collided with tiers T0–T5 (and had
  drifted from taste.md's `V#`, which itself collided with PRD versions `V2.3`
  AND the T2 village rungs `V0–V7`); philosophies `R1–R6` collided with rungs
  R0–R7 AND review items `R1–R8`. The human's call (2026-07-06, AskUserQuestion):
  single letters are over-used repo-wide — move ID prefixes to 2/3-letter forms.
- **Decision (human-locked map):** `D-NNN → ADR-NNN` (ADRs) · `FNNN → FB-NNN`
  (feedback-human items) · `ANN → AC-NN` (ambient conventions) · `HNN → HD-NN`
  (human decisions) · review `RN → HR-N` · milestones `MN → MSN` · taste values
  (both `V#` and the drifted `T#`) → `TST1–TST4` · philosophies `R1–R6 →
  PH1–PH6`. **Stay single-letter (the game's fundamental levels):** rungs
  **R0–R7** (+ T1's R8–R15 continuation), tiers **T0–T5**, the T2 village
  ladder **V0–V7**, PRD versions (`V2.3`), session numbers (`sNN`), plan-local
  card/phase labels (a plan's internal `M1→M7`, `P1–P4`), and **composite
  roadmap codes** (`T2-M1-F2` keeps its internal letters — it's a structured
  scheme, not a bare prefix).
- **Scope:** living docs + src/e2e **comments** only. Historical records
  (`project/journal/`, `project/archive/`, `project/feedback-human/`,
  `project/human-in-the-loop/archive.md`, brainstorm bodies, CHANGELOG) keep
  the old ids — both vocabularies stay resolvable via this map. String
  literals / identifiers in code were never touched. New docs written mid-sweep
  by co-agents may carry stragglers; normalize them as they're touched.
- **Consequences:** grep for `ADR-\d` / `FB-\d` / `HD-\d` / `HR-\d` finds the
  living usage; an old id in a historical file is read through this table. The
  session brief, hooks, and skills print the new item-type names (`HD-items`,
  `HR-items`).

### ADR-141 ✅ — T0: a legible mend-path lock-hint at R3 (keep the R4 repair gate) — resolves HD-23
- **created_date:** 2026-07-06
- **Context:** an s88 e2e finding (HD-23): `verb-repair` (plus `readout-durability`
  and the Equipment panel) reveals at **R4** by design (`ranks.ts` — the ADR-110
  one-beat-per-rung cadence), but a blade can already wear to **Battered/Broken**
  at **R3**, where combat opens. So an R3 player watched their win-rate sag with
  **no mend CTA on any surface** and no signal the mend even exists — reading as
  "is this a bug?" (fails TST4, "the player never guesses state").
- **Decision (human, 2026-07-06 — option C over A "leave it" / B "reveal repair
  at R3"):** **keep the R4 gate**, but when the equipped blade is Battered/Broken
  **and** `verb-repair` is not yet unlocked, show a diegetic `.lock-hint` on the
  combat weapon-card: *"A worn edge is mended by hands the house has come to
  trust."* Frames the gate as **standing, not a bug** (TST3 — the fiction causes
  the mechanics: the repair unlock IS a trust rung); the mend path is legibly
  *earned*, not *asked*. Preserves the ADR-110 unlock cadence untouched.
- **Narrative provenance (ADR-139):** the hint is fiction-voiced, so it shipped
  from **3 blind takes**. The agent self-picked take B (proverbial/systemic), but
  on **HR-10 sign-off the human overrode to take C** — the interior, first-person
  resolve, now canon: *"The edge is going. Not yet mine to mend — climb higher,
  then set it right."* Reviewed LIVE in the DEV switcher (ADR-143); the bundle was
  pruned on sign-off. Provenance: HR-10 (archived, 2026-07-06).
- **Soundness:** render-level RED-able test (`src/ui/render.test.ts`, the A7
  block) — an R3 Battered blade shows the hint and NO Repair button; R4 (repair
  unlocked) retires the hint and offers the real CTA. The Battered fixture is
  derived from the `DURABILITY_BANDS` source (asserted, never a copied number).
  Verified live at R3 via `__qa` (`weaponDurability` forced into the Battered band).

### ADR-142 ✅ — T0: a cold-open "restore a saved game" affordance — resolves HD-24
- **created_date:** 2026-07-06
- **Context:** an s88 e2e finding (HD-24): save Import lives in Settings → Saves,
  which is in the shell footer — reachable only **after** the awake shell mounts.
  A returning player on a fresh device/profile therefore had to replay the whole
  intro VN before they could restore a save.
- **Decision (human, 2026-07-06 — option B over A "rare, leave it" / C
  "import-first skips the intro"):** a **quiet** underlined "Returning? Restore a
  saved game" line under the cold-open wake verb (subordinate to the primary
  "Open your eyes" CTA — TST3: genuinely-new players still open the game through
  the fiction). It **reuses the existing Saves modal** (no new surface). To let
  that modal overlay the pre-awake cold-open (the shell is `hidden` before
  waking), the Settings/Saves modal is re-parented from the shell to a
  **root-level sibling**.
- **Soundness:** render-level RED-able test (`src/ui/render.test.ts`, the HD-24
  block) — the pre-awake card shows the restore line; the modal is a root-level
  sibling (not nested in the hidden shell); clicking the line opens it on the
  Saves tab. Verified live: the line reveals with the wake verb and opens the
  import surface over the dark cold-open field.

### ADR-143 ✅ — a narrative diverge reviewed by the human MUST be live in the DEV switcher (refines ADR-139)
- **created_date:** 2026-07-06
- **Context:** reviewing **HR-10** (the HD-23 R3 mend-hint), the human asked to
  compare the 3 takes **live in the DEV story set-switcher**, not read them from
  the review doc. The mend-hint was a `render.ts` string literal, and the takes
  **live-override** layer (`dev.ts` `subRungScene`/`subIntroScene`) only swaps
  **rung beats + intro scenes** — cold-open/dialogue/flavor units were
  **reader-only** (shown in the DEV script-reader modal, but the running game
  kept rendering canon). So a UI micro-line could not be switched live.
- **Decision — two locks (human, 2026-07-06):**
  1. **The process rule:** any narrative diverge that asks the human to review
     **MUST be live-switchable in the DEV set-switcher** — rendered in the running
     game via the override, **not** reader-only, **not** doc-only. If the diverged
     unit type isn't yet live-swappable in the engine, **wiring that live-swap is
     part of the diverge**. (Kills the ADR-139 "no switcher for a one-liner"
     escape.) Encoded in `narrative-diverge/SKILL.md` §7/§8.
  2. **The unit type + engine reach:** a new fiction-voiced **UI flavor-line**
     narrative unit — keyed prose (`## prose flavor` → `flavor.md` →
     `FLAVOR.gen.ts`) the renderer shows outside a VN scene (lock-hints, gate
     explainers). Canon carries the pick; the compiler routes take prose by group
     (`cold-open`→`coldOpen`, `flavor`→`flavor`); `dev.subFlavor(key, canon)`
     extends the live override and `flavor:` joins `LIVE_UNITS`; render.ts renders
     `FLAVOR.mendHint` through `subFlavor` (both weapon-card paths). The mend-hint
     was its first user — the `takes/hd23-mend-hint/` bundle shipped takes A + C.
- **Outcome (HR-10 sign-off, 2026-07-06):** the human reviewed the bundle **live
  in the switcher** — the very flow this ADR mandates — and **overrode to take C**.
  Canon (`flavor.md → mendHint`) now carries C; the bundle was **pruned** per
  ADR-139 (the archived HR-10 row is the record). So `takes/` is empty again —
  proof the loop closes end-to-end, not just that it renders.
- **Scope note:** dialogue + cold-open keyed prose remain reader-only for now
  (no live diverge asks for them yet); the rule makes wiring their live-swap part
  of the first diverge that touches them.
- **Soundness:** RED-able `dev.subFlavor` unit test (`dev.test.ts` — canon
  identity, swaps the active take, falls back when a take lacks the key) + the
  HD-23 render test asserts the hint equals `FLAVOR.mendHint` (single-source,
  not a literal); the `gen-narrative` gate byte-compares `flavor.gen.ts` +
  `storyTakes.gen.ts`. Verified live pre-sign-off: `?story-hd23-mend-hint=a|c`
  rendered take A/C on the R3 weapon-card; post-sign-off the weapon-card renders
  take C as canon.

### ADR-144 ✅ — UI-v2 SHIPPED: the woodblock locks retire; Andon Steel is the built identity (executes ADR-127)
- **created_date:** 2026-07-06
- **Context:** ADR-127 chose **Andon Steel** as UI-v2's direction (a FULL replacement of the woodblock/washi
  identity). The migration plan (M1–M7) has now shipped: steel tokens + Western system stacks (M1), the
  steel material recipes (M2), the Andon rail|desk|log-window composition + the fixed-frame phone
  recomposition (M3), the full GBA-typewriter cold open (M4), the VN/ceremony re-skin with the vermillion
  seal-heat (M5), and every diverged surface verified steel-native with the estate-section diverge added
  (M6). The woodblock-era locks in the doc canon needed retiring to match the territory.
- **Options:** leave the woodblock ADRs standing and let readers reconcile · rewrite history (edit the old
  ADRs in place) · **retire-by-supersession: banner the affected ADRs, keep their enduring mechanisms, and
  re-anchor the bible.**
- **Decision:** **Retire-by-supersession.** `ui-design.md` is rewritten to the **Andon Steel bible**
  (bimetal semantics: SILVER=state · GOLD=value · VERMILLION=commit/danger, spent not worn). **ADR-018
  retires** — its aesthetic is superseded; its enduring constraints (a strong CSS design-language built to
  a written bible, agent screenshot-QA, anti-slop) carry forward, and **"no asset pipeline" is now total**
  (the self-hosted OFL fonts retired with M1 — pure system stacks, zero webfonts). **ADR-045 translates**
  — the fills-only identity + AA-text rule survives verbatim on the new ramp. **ADR-068 re-anchors** — the
  traditional SFX palette stands because it is diegetic, not woodblock-visual. The four PRD identity
  claims (01-vision presentation register, 02-systems identity-hues rule, 07-roadmap R4 art/feel) are
  re-pointed; the in-fiction woodblock BROADSHEET (02-systems §legend) deliberately survives — period
  props are content, not UI identity.
- **Why:** The build is the territory (PH2): the shipped game is Andon Steel end-to-end, and a living-doc
  canon that still says "washi/woodblock" would make every future taste call start from a false premise.
  Supersession banners keep the *why*-history lossless (the append-only norm) while making the current
  truth unambiguous.
- **Consequences:** `ui-design.md` = the steel bible (≤400-line cap holds); `taste.md` untouched (already
  identity-neutral); PRD re-pointed; `prd:drift` + `doc-budgets` green. The open variant picks
  (HR-2/5/6/7/9) + the M6 strip are the migration's only remaining human gates; a `/prd-compress` sweep
  stays a separate, human-signed event. Per **ADR-022**, governs.

### ADR-145 ✅ — T0 Phase-2 economy: the A+B hybrid loop at literal 1:1 (executes ADR-133's queued redesign)
- **created_date:** 2026-07-07
- **Context:** ADR-133 locked the Phase-2 ≈ Phase-1 wall-time *law* (`PHASE2_PHASE1_RATIO_BAND`,
  a hard `verify:balance` gate) and shipped a stopgap that greens the gate by stretching
  `ESTATE_DEED_PER_ACT` — 1:1 in *duration* but a single-intent slog in *texture* (its "Known
  debt (PH5)"). The real redesign plan (`opus-2026-07-04-phase2-economy-redesign.md`, now
  building) put three loop options + three scope questions to the human.
- **Options:** A (many earners) · B (staged build) · C (allocation layer) · the A+B hybrid;
  literal 1:1 vs a rebalanced shorter T0; rice lever in vs ambient; all-labour vs
  estate-relevant deed gating.
- **Decision (human, 2026-07-07, via AskUserQuestion):** **(1) The A+B hybrid** — multiple
  Estate deed sources (shinden / workshop / granary / watch) driving a visible staged E0→E1
  build whose stages fire authored beats, seasonal judge as the payout rhythm. **(2) Literal
  1:1** — Phase 1 stays ~83 min; Phase 2 is built to match (T0 total ~2.8 h; tunable in
  playtest per ADR-059). **(3) The store-vs-sell rice timing lever folds in** as an explicit
  Phase-2 decision. **(4) Estate-relevant work only banks deeds** (farm/haul yes,
  forage/woodcut no — TST3, the fiction causes the accrual; resolves the `pillars.ts` L40
  deferred call at T0).
- **Why:** A+B is the strongest fun-and-canon answer — variety (A) feeding a visible build
  (B) delivers the PRD's promised "E1 Stabilising completes as a Phase-2 beat" (§3.2/§3.3)
  while reusing the existing `accrueDeed`/`ESTATE_STAGES` engine; Option C's management-sim
  canon risk is avoided while its best idea (the rice lever) is adopted. Estate-relevant
  gating keeps every deed source a story the R2–R6 rungs already taught.
- **Consequences:** The stopgap's inflated single-source magnitude is superseded (its
  breadcrumb comment marks the swap); the ratio-band gate + plumbing are KEPT and stay green
  at every commit. Phase-2 magnitudes re-derived in the plan's Phase 3 (ADR-132 flow).
  The loop is the template every later tier's Phase-2 economy builds against (ADR-133
  generalises). Build routing: the human switched the building session to Fable 5
  (2026-07-07), superseding the plan's Opus-for-core proposal. Per **ADR-022**, governs.

### ADR-146 ✅ — emergent node actions: the Phase 0 design lock (executes the plan's design pass)
- **created_date:** 2026-07-07
- **Context:** `docs/plans/opus-2026-07-03-emergent-node-actions.md` (from the 2026-07-02
  brainstorm) parks four open shape questions behind a mandatory human design pass
  (its Phase 0): a map node that reveals new actions over repeat visits, attention,
  and seeded luck — anti-checklist, diegetic, reusing the reveal engine at finer
  grain (relates ADR-114/115/116).
- **Options:** build now as a T0-later layer vs wait for T1 vs primitive-only;
  permanence per-run vs across the meta; fixed vs tightening hints; explicit
  discovery-log vs journal echo vs none; hand-authored rumor web vs tag routing.
- **Decision (human, 2026-07-07, via AskUserQuestion):** **(1) Build now, T0-later**
  — on the existing estate map; everything it needs already exists. **(2) Permanent
  ratchet** — found once, known forever. The brainstorm's "per-run vs meta" fork is
  MOOT: the game has no runs or resets (PRD §1 — "tiers *replace* prestige;
  everything persists"; NPCs remember across ascension), so per-run rediscovery is
  incoherent here; the human flagged the confusion and the agent resolved it from
  canon. **(3) Tightening hints** — the node description sharpens as the attempt
  counter climbs (ADR-116's hint surface made dynamic). **(4) No discovery-log** —
  purely diegetic: a discovered action just appears in the node's action list and
  the description reads differently; no per-node found-list (anti-checklist stays
  pure). **(5) Rumor routing (agent-designed default, per PH4):** a rumor targets a
  **discovery tag**, never a hand-authored node id — any node carrying an
  undiscovered action with that tag resolves at runtime, so no brittle A→B content
  web. Portable cross-node rumors stay Phase 3, deferred until the human reads the
  built Phase 1–2 design in the running game.
- **Why:** the four answers keep the feature exactly what the brainstorm valued —
  curiosity rewarded, never a checklist, never a "NEW ACTION!" banner — with the
  cheapest sound state (a write-once `discovered` latch mirroring `unlocked`, plain
  seeded attempt counters).
- **Consequences:** the plan flips IN-PROGRESS; Phases 1–2 build on the T0 map (new
  `discovery` RNG stream, `DISCOVERIES` registry, hidden-activity gating, tightening
  blurb hints). All discovery fiction text (hints, discovery log-lines, hidden-action
  labels) rides ADR-139 narrative diverges. Build routing: the human runs the build
  session on Fable 5 (2026-07-07), superseding the plan's Opus proposal.

### ADR-148 ✅ — timed actions: instant dispatch retires; every action is timed or declared instant (FB-174)
- **created_date:** 2026-07-07
- **Context:** the 2026-07-07 playtest inbox (FB-174, a full design proposal in a
  capture note): the human no longer wants press→instant actions — an action
  should take time, disable its button, show an in-button progress bar, cool
  down (~2s, bar draining back), and auto = "on cooldown complete, go again".
  Today the core dispatches instantly and auto is a fixed `AUTO_REPEAT_MS`
  heartbeat in `src/app/main.ts`; the pure core is deliberately wall-clock-free.
- **Options:** core-authoritative time (tick intent, big refactor) vs UI-theater
  only (durations invisible to balance/sim) vs core-owns-DATA / shell-owns-CLOCK;
  scope forks (travel? craft? trade? combat?); interruption, concurrency, travel
  granularity, and seed-table derivation forks.
- **Decision (human, 2026-07-07, via AskUserQuestion in the drain):** **(1) Core
  owns duration DATA, the shell owns the CLOCK** — durations/cooldowns are core
  content data (cockpit-tunable); the UI timer dispatches the existing intent on
  completion; the sim converts action-counts → seconds through the same table.
  **(2) Scope:** labour + meta verbs + travel + craft/eat; every action is
  `timed` or explicitly **`instant`** (buy/sell — the word "instant" is the
  design term); **combat is excluded** pending its own review. **(3) Fast-idle
  magnitudes** (small 3–5s · labour 5–10s · big 30–90s · ~2s cooldown) as seeds
  only. **(4)** Interruption **drops** the in-flight action (no partial credit,
  active-only per PRD §6.9). **(5) One global** in-flight action (you are one
  person). **(6) Travel is per-edge data** from day one. **(7)** The seed table
  is **pacing-neutral** — derived from the current pacing sim so rung wall-times
  hold; the human then tunes feel via the cockpit (ADR-134).
- **Consequences:** `docs/plans/fable-2026-07-07-timed-actions.md` is LOCKED
  (Phases 1–4: timing data → shell clock + button UI → travel/craft/eat →
  pacing reconciliation, incl. G-PACING/ADR-132 re-baseline and a wolf-trigger
  audit). `__qa` gains an instant-complete switch so headless QA never waits
  wall-clock. Supersedes the press→instant interaction model everywhere but
  combat.

### ADR-149 ✅ — the T0/T1 map sheets are player-bound; substrate picked live; craft + engine phases greenlit

- **created_date:** 2026-07-07
- **Context:** the map-rebuild fresh-eyes review
  (`project/brainstorms/2026-07-07-t0t1-map-review-next-level.md`, commit
  79f169d) surfaced four forks: the night-indigo vs warm-washi substrate
  (HR-12's open question), the sequencing of the craft pass (Phase A+B),
  the timing of engine hardening (Phase C), and what the DEV sheets are
  *for* — the review had treated a player-facing map as a parked PH6
  question.
- **Options:** substrate — commit night / commit washi / wire both and
  pick live; craft — all now / verification only / wait for HR-12; engine
  — now / park until T2 maps / regression-pin only; player map — BACKLOG /
  HD-item / design now.
- **Decision (human, 2026-07-07, via AskUserQuestion):** **(1)** ~~Wire BOTH
  substrates behind a DEV toggle — the human picks live during the HR-12
  look~~ **superseded same day: the washi A/B was built, screenshotted, and
  KILLED by the human before commit ("doesn't fit the style of the rest") —
  NIGHT-INDIGO is the committed substrate**, and the ground/void fix is
  earned by rendering (a texture pass), not a palette swap. **(2) Phase A + the
  full Phase B craft pass now** (the ground/void wash item waits for the
  substrate pick, since washi would erase it). **(3) Phase C engine
  hardening NOW, while hot** — not parked for T2. **(4) The maps are
  PLAYER-BOUND, and were always meant to be:** "we build the T0 & T1 maps
  in the dev panel so we can swap them into the real game, we just did
  the map first before we rewrite the game to match the story bible. The
  map is a standalone unit of work" (human, verbatim). The DEV panel is
  the review venue, not the destination.
- **Consequences:** the map engine is graduating game code, not DEV
  scaffolding — mobile perf (node collapse), pinch zoom, and a
  player-grade entry path are requirements, not nice-to-haves (they fold
  into Phase C). The game-side integration (when/how the player reaches
  the map, what fiction causes it) rides the story-bible game-rewrite
  workstream, not this one. HR-12 stays the taste gate for the sheets
  themselves and now includes the live substrate pick.

### ADR-150 ✅ — the story-reboot frame ADR: the bible is canon, the build wave is chartered (BIBLE DONE)

- **created_date:** 2026-07-07
- **Context:** the 2026-07-07 story reboot re-derived the game's story
  from the kernel up (frame + record:
  `project/archive/fable-2026-07-07-story-reboot.md`; execution:
  `docs/plans/fable-2026-07-07-story-bible-finish.md`). The human held
  this ADR deliberately — "mint at BIBLE DONE + build start," not at
  plan approval. That gate opened today: the human read the finished
  bible whole and signed off in-session (s116), after the salvage/audit
  cross-check residue was ruled and transcribed.
- **Decision (human, 2026-07-07 — the frame, locked at reboot Phase 0):**
  **(1) The design layer was REOPENED** — cast, arcs, tier story,
  premise framing, PRD §5 end to end re-earned their place; nothing was
  canon by default. **(2) Fixed ground was the KERNEL ONLY** — seven
  points, redlined and graduated to the bible §0. **(3) Mechanics were
  FULL CO-DESIGN** — story and mechanics derived together. **(4)
  In-flight builds ran in parallel** — the shipped T0 keeps shipping
  until the build wave replaces it.
- **Decision (the structural canon the bible locks — build-cutting):**
  **SEVEN tiers T0–T6** (tier enum 0..5 → 0..6 + save migration) · the
  **six-season manual calendar** (Winter → New Year → Spring → Summer →
  Bon → Autumn; season containers, exit events, the seasonal judge;
  seasons unlock at T0-R2) · **alternating inside/outside rungs** with
  the **T2/T3 HARD LOCK** (T4 drops the gimmick) · **time-skips at tier
  seams** (~13 years, 1780 → 1793+) · **parallel reputation tracks**
  (village T2, origin T3; never converting to rungs; T6 flips the
  ladder's subject to the HOUSE, H0→H7) · **two body economies** (labour
  never costs HP) · the **speaker-label ladder** and the **map re-label
  reveal** as story surfaces (kernel #6) · **NO-PRESTIGE stays hard**
  (§0.9). Each lands as its own implementation ADR/plan at B2; this ADR
  is their charter, not their spec.
- **Decision (the canon home):** `docs/story-bible/` is the SINGLE home
  of story canon (kernel · prose law + constraints · house · tiers ·
  cast · world · seven tier sheets at staged depth). The PRD §5 becomes
  a pointer-and-summary at B1 (ADR-117 style); the built game's text is
  rewritten to the bible at B3 (ADR-139 three-take bundles); content
  migration at B4.
- **Consequences:** workstream B is OPEN — B1 (PRD §5 rewrite + drift +
  roadmap ripple), B2 (engine ADRs: tier enum, calendar, alternation,
  body economies, night-round runner, speaker/map reveals, coin lanes —
  each its own plan, Opus-routed), B3 (the T0 prose wave, Fable), B4
  (content migration, Opus), B5 (HR-8 closes at B3; CHANGELOG). The
  reboot and salvage plans are archived with forward pointers; the
  bible alone carries the canon forward. The currently-shipped T0
  remains the live game until B3/B4 replace its text and content.

### ADR-151 ✅ — the sheet IS the player map; rung-reveal builds now; HR-12 closed

- **created_date:** 2026-07-07
- **Context:** ADR-149 made the T0/T1 sheets player-bound but left the
  integration shape open. The rung-reveal illustration
  (`project/brainstorms/2026-07-07-t0-map-rung-reveal.md`) surfaced the
  fork explicitly: the sheet and the walkable Estate 地図 tab need ONE
  unlock source of truth. Session 115's review phases (B craft, C engine)
  awaited ordering; HR-12 (the sheets' taste call) awaited a verdict.
- **Decision (human, 2026-07-07, via AskUserQuestion):** **(1) The sheet
  BECOMES the map** — the 地図 tab renders the sheet; zone seals are the
  travel/interaction nodes; one unlock source of truth (TST1). The
  node-graph list UI retires (or survives only as an accessibility
  fallback). **(2) The rung-reveal mechanism builds NOW** — data tables
  (zone→rung, reveal polys, 未 ghost chips, rumor notes) + the reveal mask
  in the sheet painter, with the illustration's ladder as PLACEHOLDER
  data; the T0 build plan later locks the real ladder by editing the
  table, not the code. **(3) Build order: Phase B craft → Phase C
  hardening** (the golden-hash pin lands after the look settles).
  **(4) HR-12 = PASS**, signed off from the session-115 renders: the
  night sheets read as an intentional lamplit 絵図 and T0 seeds the
  corner-of-the-precinct twist. Craft polish continues post-sign-off.
- **Consequences:** the 地図-tab swap rides the ADR-150 build wave (the
  game rewrite); the sheet grows a rung-gating mechanism + DEV rung
  previewer now; HR-12 graduates to archive.md (id-collision noted — an
  earlier FB-121 review also wore HR-12); the map workstream continues
  autonomously: drain the playtest-inbox map feedback → Phase B remainder
  → rung mechanism → Phase C.

## The storywave docket — the ADR-150 build wave's engine ADRs (2026-07-07)

Eleven ADRs minted in one sitting per the storywave docs plan
(`docs/plans/fable-2026-07-07-storywave-docs.md` A0; parallel game
plan: `fable-2026-07-07-storywave-game.md`). Each TRANSCRIBES a locked
shape from the blessed story bible (ADR-150 is the charter) or a human
ruling recorded in journal s116; magnitudes stay sim-owned (ADR-132).
Cross-plan citations use the docket numbers (#1–#11), which are stable
even if ADR numbers shift. The mapping: #1=ADR-152 · #2=ADR-153 ·
#3=ADR-154 · #4=ADR-155 · #5=ADR-156 · #6=ADR-157 · #7=ADR-158 ·
#8=ADR-159 · #9=ADR-160 · #10=ADR-161 · #11=ADR-162.

### ADR-152 ✅ — Docket #1: seven tiers — TierId widens to 0..6

- **created_date:** 2026-07-07
- **Context:** ADR-150 locks SEVEN tiers T0–T6; the bible flags the
  enum change as build/PRD-cutting (`docs/story-bible/03-tiers.md`
  "The structure": "tier enum 0..5 → 0..6"). The built enum is 0..5
  (the ADR-048 spine). The tier→map ladder (`05-world.md`): Estate
  (household) → Estate (land) → Valley → Region → Castle Town →
  Domain (han) → Edo.
- **Decision:** `TierId` widens to **0..6**. Display names per the
  bible: T0 Estate — the household · T1 Estate — the land · T2 the
  Valley · T3 the Region · T4 the Castle Town · T5 the Domain · T6
  Edo. Each tier carries its own R0–R7 rung ladder — ONE unbroken
  career, not a fresh ladder per tier (the old R8–R15/V/G/O numbering
  is dead); in T6 the ladder's subject flips to the HOUSE's Edo
  standing, **H0→H7** (state shape may land with docket #9).
  Time-skips at tier seams; the game spans ~13 years (1780 → 1793+).
  Saves: **NO migration** — clean break per docket #10 (ADR-161).
- **Consequences:** Plan B reworks `toTier()`/fixtures/harness docs;
  PRD §6's `tier: TierId // 0..5` line carries a forward-spec banner
  until the build lands; roadmap enum refs update at A3. 🔁 Executes
  ADR-150's charter line (its "+ save migration" phrase is refined by
  docket #10).

### ADR-153 ✅ — Docket #2: the six-season manual container calendar

- **created_date:** 2026-07-07
- **Context:** the bible locks the calendar as build-cutting
  (`docs/story-bible/05-world.md` "Global rules", first bullet;
  `tiers/t0.md` "The calendar bundle (locked)"). The built game runs a
  28-day derived 4-season clock (`season(day) = floor(day/28) mod 4`,
  derived-never-stored — PRD §6).
- **Decision:** the year is SIX rotating seasons — **Winter → New Year
  → Spring → Summer → Bon → Autumn** — each a CONTAINER filled at the
  player's pace. Game time displays only the DAY OF THE WEEK (the
  month/year counter is hidden). **Season change is a MANUAL action
  with a per-season VN overlay.** Season-exit events exist (the nengu
  is Autumn's exit gate — an authored scene at the board); **the
  seasonal judge rides every season exit**. Seasons UNLOCK at T0-R2
  (R0–R1 show the day of the week only — "a man counts days again when
  he has a future"). Nodes carry per-season flavor; season-specific
  actions, enemies, content and STALL STOCK exist (Yohei's stall
  restocks per season); unique characters can appear in a specific
  season (Iori lodges in New Year and Bon). Time-skips at tier seams
  ride the same wheel. Season becomes STORED, advanced state — no
  longer derived from the day counter.
- **Consequences:** pure-core calendar rework + the `seasonal` RNG
  stream re-anchored (Plan B); the sim/pacing bands re-derive under
  the ADR-132 flow; PRD §2.2 and §6's calendar lines become forward
  spec with banners until the build lands.

### ADR-154 ✅ — Docket #3: inside/outside rung alternation + the T2/T3 hard lock

- **created_date:** 2026-07-07
- **Context:** `docs/story-bible/03-tiers.md` "Rungs alternate"
  (flagged "Mechanics ADR at build time").
- **Decision:** every other rung the MC is INSIDE the estate, every
  other OUTSIDE. In **T2 and T3 the alternation is a HARD LOCK**: an
  inside rung locks the world out (the estate map only — forced estate
  actions, skills, levelling); an outside rung locks the estate closed
  until the objective is done. **T4 drops the gimmick** — free travel
  everywhere from then on. T2-R5 is the one authored crossing (the
  bandits hit the works — the outside forcing itself in IS the beat;
  `tiers/t2.md`). In T0/T1 the alternation is narrative rhythm, not a
  mechanical lock.
- **Consequences:** a map/travel gating engine lands with the T2
  build; no T0/T1 engine work. PRD §1.5.1/§3 re-anchor to it at A2.

### ADR-155 ✅ — Docket #4: two body economies + defeat-as-sickroom

- **created_date:** 2026-07-07
- **Context:** `docs/story-bible/tiers/t0.md` "Systems canon
  (game-wide; mechanics ADR at build)".
- **Decision:** **one body, two meters, coupled one way**: labour
  spends the WORK/body unit and NEVER costs HP; combat risks HP; being
  at low HP impairs work capacity. **Defeat is never game-over**: the
  MC is carried to Sōan's sickroom and loses days (wages, season
  time), and Sōan's closed ledger grows. Rider (folded in per the
  scout): recovery flavor differs by home — the woodshed vs the
  offered room (`tiers/t1.md` side-beat 5); the magnitude is sim-owned.
- **Consequences:** core stat-model change (Plan B); all magnitudes
  ride ADR-132 (sim verdict + committed before/after); PRD §2 gains a
  forward-spec subsection pointing here (A2).
- 🔁 **Refined by ADR-164 (2026-07-08):** defeat ALSO bleeds carried coin +
  goods (rice is spared — it lives in the kura, ADR-163); HP has NO
  auto-trickle — it mends via a paid treatment action or a manual
  "rest at sickroom" trickle.

### ADR-156 ✅ — Docket #5: the night-round mini-dungeon runner

- **created_date:** 2026-07-07
- **Context:** `docs/story-bible/tiers/t0.md` "The Night rounds" +
  "Combat structure & enemies"; ADR-150 charters it.
- **Decision:** no day/night map state — a **"begin the night round"
  action** (its post at the gate) puts the MC on rails through several
  zones in their night state; clear each of enemies to finish the
  round, or fall and wake in Sōan's sickroom (docket #4). The FIRST
  round is a quest; after that it is repeatable. Escalation across T0:
  rats in the store → a marten → the R3 WOLF as the arc's climax.
  Kihei designs the round; from R3 it is his and the MC's alone. The
  round GROWS with the estate in later tiers (`tiers/t1.md`).
- **Consequences:** a new repeatable activity runner in the pure core
  (Plan B); fixtures + DEV scenario coverage ride the build.

### ADR-157 ✅ — Docket #6: the speaker-label ladder + the map re-label reveal

- **created_date:** 2026-07-07
- **Context:** kernel #6 (UI surfaces as story state) made concrete:
  `docs/story-bible/04-cast.md` "The speaker-label ladder";
  `tiers/t2.md` "The reveal, staged"; `05-world.md` "The reveal
  staging". ADR-150 charters both surfaces.
- **Decision:** **(1) The speaker label is story state:** `You:` for
  the cold open's first lines → a small FORCED beat where he asks his
  own name and Sōan answers that he has none → the label flips to
  `Nameless:` on screen, witnessed → `Gonbei:` takes over at T0-R7 →
  he KNOWS his birth name (Tahei) at T3 → what the register finally
  says is his choice at the end (the ink thread). **(2) The map
  re-label is the T2 reveal's delivery:** at the third signal's scene
  end the map redraws its two labels — *Main house → Guest house; the
  ruin → the Main house* — one log line in the day-book's voice, no
  ceremony.
- **Consequences:** label state lives in the core and feeds log/VN
  rendering (Plan B, with the T0 rebuild); the map re-label mechanism
  lands with the T2 build but its data shape should land now so the
  sheet-map work (ADR-151) can carry it. TST2 governs both (never
  yank a watched surface).

### ADR-158 ✅ — Docket #7: the economy — two coin lanes, three ledgers, the debt staged

- **created_date:** 2026-07-07
- **Context:** `docs/story-bible/tiers/t0.md` "Economics
  (human-locked shape; all magnitudes sim-owned)" — within which the
  bible tags the coin-lane block itself "**(DIRECTION, not locked —
  known open problems, flagged by the human for build/balance
  time)**". At the 2026-07-07 storywave re-plan the human ruled the
  lanes proceed as ADOPTED DIRECTION with both open problems resolved
  at sim time; that in-session ruling is recorded in journal s116
  (`project/journal/2026-07-07-session-116-story-reboot-plan-finished-and-archived.md`,
  the addenda). This ADR transcribes that ruling — it does NOT
  upgrade the bible's DIRECTION tag to "locked", so bible and ADR
  agree: ledgers/barn/debt are the locked shape, the lanes are the
  adopted direction.
- **Decision (the shape — 1/2/5 locked per the bible; 3/4, the coin
  lanes, adopted direction per its own tag):** **(1) Three nested
  ledgers** — the
  MC's (meals → rice → a day-wage in mon → trusted with the house's
  purse), the household's day-book, and the DEBT (the standing
  antagonist; principal untouchable in T0). **(2) Filling the barn is
  the HOUSE's economy** — barn-filling actions raise house stores and
  flavor, never player loot. **(3) The KIND lane (unbounded):** labour
  pays in rice and goods; combat drops materials, never coin;
  consumables run on kind. **(4) The MON lane (bounded):** the
  day-wage is FIXED PER GAME-DAY worked, not per action; the only
  other mon source is selling on Yohei's market days (his coin finite
  per visit); durables and the stall's season-scarce stock run on mon;
  recurring sinks (dog rice, offerings, thread, sickroom bills).
  **(5) The debt's three-stage introduction:** R1 named sideways in
  Genemon's terms → felt in scenes all T0 (the lease day; the nengu),
  never numbered → T1's tally-keeper rung unlocks the debt panel and
  the number is finally seen, a story beat.
- **Decision (the two flagged open problems — resolved-at-sim-time;
  human-ruled 2026-07-07 at the storywave re-plan, recorded in
  journal s116):** (a) kind-overflow sinks/caps and (b) the day-wage
  collection moment vs auto-actions are NOT blockers on this ADR —
  they resolve **at sim time under the ADR-132 flow** (Plan B's
  economy build runs the persona-sim, picks the mechanism the machine
  verdict supports, and commits the before/after pacing diff as the
  evidence). The ledger/barn/debt shape is locked; the lane direction
  is adopted; the two mechanisms and all magnitudes are the sim's.
- **Consequences:** the T0 economy re-cores at Plan B's rebuild;
  `pnpm run verify:balance` + `balance:report` gate every magnitude
  change; PRD §4's spine moves only with this ADR's build (ADR-117
  interim-freeze holds meanwhile).
- 🔁 **Refined by ADR-163 (2026-07-08):** the two open problems (a)/(b) are
  now DECIDED on mechanism (Yohei purse cap + no raw-material sales; the
  collect-at-the-board wage verb), plus soft caps as the self-balancing
  principle, rice-as-measured-kura-units, the finite-seasonal-pool sink loop,
  and `banked` = house stores. Magnitudes remain sim-owned.

### ADR-159 ✅ — Docket #8: the pillar-structured standing/deeds tier-up engine

- **created_date:** 2026-07-07 (pillar engine locked + written to canon
  2026-07-08, session 118)
- **Context:** `docs/story-bible/03-tiers.md` "House Standing — the four
  pillars" + `tiers/t0.md`/`tiers/t1.md` "The tier-up (locked)". **HD-25
  RULED (human, 2026-07-08): KEEP pillars as tier-up mechanics — NOT
  superseded.** The bible's flat standing/deeds engine was REFINED into
  the PRD §1.6 four-pillar model, pulled back into canon. Grill + full
  lock: `project/brainstorms/2026-07-08-pillar-model.md`.
- **Decision:** House Standing (家威 *ka-i*) is the macro-measure of what
  the house has become — assessed kokudaka-style, never spent, surfaced
  as a banzuke — rolling up FOUR pillars **revealed one per tier**:
  **Estate** (家産) T0 · **+ Arms** (武威) T1 · **+ Office** (官威 —
  renamed from "Standing & Office"; the umbrella owns "standing") T2 ·
  **+ Name** (家格) T3; T4–T6 deepen the four. Each pillar is graded on a
  **six-step ladder** — FAIL·BAD·OK·GOOD·GREAT·EXCELLENT (F·D·B·A·A+·S;
  English word + letter, kanji flavor). **Tier-up is breadth-required,
  specialization-rewarded:** every revealed pillar ≥ GOOD, exactly one
  EXCELLENT + one GREAT (choose WHERE to spike, never whether to skip);
  overshoot earns a grade-scaled boon. At T0 the single Estate pillar
  collapses the gate to one top grade; **T0 depth-autonomy lives in the
  four DEED SOURCES** (fields · stores · works · watch — ADR-145). Deeds
  accrue in Phase 2 only (post-final-rung). The grind still opens at R7;
  still graded at every season exit in the day-book's voice (docket #2's
  seasonal judge); top grade still unlocks the manual ceremonial ASCEND.
- **Consequences:** the ascension/deed engine reworks at Plan B's rebuild
  (ADR-145's `accrueDeed`/`ESTATE_STAGES` deed-source structure survives
  and carries the T0 depth-autonomy); PRD §1.6 rewrites to THIS pillar
  engine at A2.2 — the "Standing & Office" → "Office" rename + the 6-grade
  ladder + the reveal ramp CONFIRMED (not superseded). The exact T0
  required peak grade is sim-owned (ADR-132). 🔁 The bible tier-up
  sections were updated to this engine on 2026-07-08 (session 118); this
  ADR transcribes the locked model.

### ADR-160 ✅ — Docket #9: parallel reputation tracks (village · origin · the T6 flip)

- **created_date:** 2026-07-07
- **Context:** `docs/story-bible/03-tiers.md` "Parallel reputation
  tracks" + `05-world.md` "Global rules"; ADR-150 charters it.
- **Decision:** the VILLAGE (from T2) and the ORIGIN TOWN (T3) carry
  their own reputation tracks, **completely distinct from house rungs
  — never converting 1:1**. The village track opens at zero
  (stranger's surcharge, watched hands); on the origin track he is a
  missing man's rumor and house standing buys nothing — until he
  knocks. In **T6 the ladder's subject changes: the rungs become the
  HOUSE's Edo standing (H0→H7)**, not the man's — kernel #4 completed
  in mechanics.
- **Consequences:** rep-track state lands with the T2 build (the
  state SHAPE may land earlier with docket #1's enum work); PRD §2.15
  re-sources to the bible at A2.

### ADR-161 ✅ — Docket #10: clean-break saves — old saves retire with a courteous notice (🔁 refines ADR-150)

- **created_date:** 2026-07-07
- **Context:** ADR-150's structural-canon line reads "tier enum 0..5 →
  0..6 **+ save migration**", and §0.9 constraint 3 names the
  save-migration chain. The storywave re-plan surfaced the real cost:
  the reboot replaces the story, content registries, calendar, economy
  and tier skeleton at once — a migration would map old saves onto a
  world that no longer exists.
- **Options:** (a) full save migration (ADR-150's original line);
  (b) clean break — old saves retire with an in-game notice;
  (c) a frozen legacy mode for old saves.
- **Decision (human, 2026-07-07):** **(b)** — old-canon saves are NOT
  migrated. On loading a pre-reboot save, the game shows a **courteous
  in-game notice** (composed, TST2 — no crash, no silent wipe: the
  world was re-founded, a fresh start is offered) and retires the old
  save. No migration code is written for the reboot boundary. 🔁 This
  REFINES ADR-150 — its "+ save migration" phrase is superseded (the
  newest human steer is canon, ADR-022). The save-migration CHAIN
  itself survives going forward: post-reboot saves migrate normally;
  the break is one-time.
- **Consequences:** Plan B drops all reboot-boundary migration work
  and ships the notice UI instead; docket #1 inherits this; §0.9's
  "save-migration chain" constraint reads as post-reboot law.

### ADR-162 ✅ — Docket #11: the T0 prose wave ships ONE version per unit (🔁 refines ADR-139/ADR-143 for this wave only)

- **created_date:** 2026-07-08
- **Context:** ADR-139 (every fiction unit ships from 3+ takes) and
  ADR-143 (a human-reviewed narrative diverge MUST be live in the DEV
  Story switcher) are the standing law. The storywave T0 prose wave
  authored all 10 units × 3 blind takes
  (`src/core/content/narrative/t0v2/` — the ledger / the held breath
  / the weather) with a per-unit judge VERDICT, and Plan B originally
  specced rung-bucket DEV review of every take. The human ruled
  otherwise on 2026-07-08; the ruling is recorded in journal s116
  (`project/journal/2026-07-07-session-116-story-reboot-plan-finished-and-archived.md`,
  Addendum 4) — this ADR is its transcription.
- **Decision (human, 2026-07-08):** the T0 prose wave ships **ONE
  version of the story per unit** — the judge's VERDICT pick
  (including mixed picks) plus its required redlines IS the canonical
  text. The non-picked alternates stay in
  `src/core/content/narrative/t0v2/` as an on-disk archive, **NOT
  wired** into the DEV Story switcher; the rung-bucket
  switcher/grouping work and the per-rung live DEV review collapse
  accordingly. 🔁 This REFINES ADR-139/ADR-143 **for this wave only**
  — the 3-take diverge + live DEV review remain the standing law for
  all future fiction. HR-8 closes at prose-ship (its s116 condition).
- **Consequences:** Plan B drops the rung-bucket switcher work and
  migrates only the picked+redlined texts; the per-unit VERDICT files
  in `t0v2/` are the review record of this wave; PRD §5.4 carries a
  one-line note of the wave exception (placed at A1). Future fiction
  rides ADR-139/ADR-143 unchanged.

## The storywave open-questions walkthrough (2026-07-08)

Rulings from the human's live walkthrough of the storywave GAME plan's 13
open questions ([`docs/plans/fable-2026-07-07-storywave-game.md`](../../project/archive/fable-2026-07-07-storywave-game.md)
§ "Open questions"). Full ruling record + the soft-cap map:
[`project/brainstorms/2026-07-08-storywave-economy-decisions.md`](../../project/brainstorms/2026-07-08-storywave-economy-decisions.md).
Three rulings needed ADRs (below); the other ten took the plan's default and
live in the brainstorm record. All magnitudes stay sim-owned (ADR-132).

### ADR-163 ✅ — the economy walkthrough: soft caps, rice-as-kura-units, the sink loop (🔁 refines ADR-158)

- **created_date:** 2026-07-08
- **Context:** ADR-158 locked the ledger/barn/debt shape and adopted the two
  coin lanes as direction, DEFERRING two open problems — (a) kind-overflow
  sinks and (b) the wage-collection moment — to sim time. In the walkthrough
  the human resolved both as DESIGN now, and surfaced a unifying
  self-balancing principle plus a concrete rice model.
- **Decision:**
  1. **Soft caps are the economy's self-balancing principle** — diminishing
     returns / rising costs / decay, never hand-tuned hard walls. Set a
     CURVE; the economy finds equilibrium. Grind-proof by construction (every
     axis flattens; pushing past equilibrium is wasted effort). The soft-cap
     map: rice/goods production = diminishing returns as the season pool
     depletes · the kura = spoilage · free HP recovery = the slow rest
     trickle (ADR-164) · standing/deeds = rising rung thresholds (ADR-159) ·
     mon inflow = fixed wage + finite purse.
  2. **Rice is a MEASURED COMMODITY held in the kura, never pocketed** —
     counted in period units (shō for wages/meals → bales/俵 for
     stores/sales → koku/石 at the nengu). It accrues to house stores; the MC
     never carries loose rice. Retires the abstract "N rice" integer (the
     immersion problem the human flagged: "what even is '100 rice'?").
  3. **The anti-grind spine:** a season is a FINITE production pool depleting
     by DIMINISHING RETURNS (not a hard stop — a determined player always
     eeks a trickle). Sinks draw the kura DOWN: consumption (steady daily
     draw) · spoilage (the storage soft cap) · the nengu (Autumn's reckoning,
     the exit gate) · debt/lease · seed. **Progress is DEEDS/rung standing,
     not the rice count** — rice is working capital that oscillates; deeds
     are what you keep (dovetails ADR-159).
  4. **Resolves ADR-158 open problem (b):** the day-wage is collected by a
     tactile **"collect-at-the-board" verb** (he is handed the coin), not
     auto-credited. Daily-vs-weekly cadence is a ×7/÷7 scalar on the amount
     (pacing-tuned); autoplay learns the verb.
  5. **Resolves ADR-158 open problem (a):** raw materials are NOT sellable in
     T0 — Yohei's `buys:` whitelist is rice + named goods only, purse finite
     per visit; kind-overflow drains to house stores + crafting inputs, never
     coin.
  6. **`banked` is reframed AS house stores** (ADR-158's "filling the barn is
     the HOUSE's economy" made concrete): deposits are one-way barn-filling
     at T0 (raise stores, bank deeds, feed the nengu fiction); no withdrawal
     verb at T0; the MC's own keeping is what he carries + the woodshed chest.
- **Why:** the two lanes only read as two if the KIND lane is bounded by
  something — soft caps + finite seasonal pools give it a self-balancing
  ceiling without hard numbers, and measured rice-in-the-kura grounds the
  fiction. Deciding the two "open problems" as design fixes the MECHANISM; the
  MAGNITUDES (curve exponents, sink rates, wage size) stay sim-owned.
- **Consequences:** 🔁 refines ADR-158 — its "resolved-at-sim-time" clause for
  problems (a)/(b) is superseded on MECHANISM (magnitudes still sim-owned).
  Plan B's economy build (G1 balance re-key, G3, G4.5) implements the
  rice-as-measured-kura-units model, the seasonal-pool diminishing-returns
  sources, the sink set, and the wage verb; every magnitude rides
  `verify:balance` + `balance:report` (ADR-132). PRD §4's spine moves with
  this build (ADR-117 interim-freeze holds meanwhile). **The rice-unit reframe
  is NEW scope** vs the plan's original "keep the rice integer" assumption —
  flagged in the plan body.

### ADR-164 ✅ — the body-economy walkthrough: defeat still bleeds; the HP-mend split (🔁 refines ADR-155)

- **created_date:** 2026-07-08
- **Context:** ADR-155 locked "one body, two meters, coupled one way" +
  defeat-as-sickroom (lose days, Sōan's ledger grows), but left the MATERIAL
  cost of defeat and WHAT HEALS HP open (Q8, Q9). The human ruled both.
- **Decision:**
  1. **(Q8) Defeat KEEPS a carried-loss bleed** — combat must carry real
     danger: a loss bleeds what the MC is CARRYING (coin + goods/materials),
     ON TOP OF the days lost + Sōan's growing ledger. Because rice lives in
     the kura and is never pocketed (ADR-163), a defeat naturally spares
     rice — the bleed hits coin + carried goods only, keeping the two-lane
     read clean.
  2. **(Q9) The HP-mend split — no auto-trickle:** HP does NOT regen
     ambiently. Serious injury mends via a **treatment action** at the
     sickroom (costs mon once waged, else a day); the free fallback when broke
     is a **manual "rest at sickroom" action** that slowly trickles HP.
     Recovery is always a deliberate act (pay for speed, or spend days).
     Food stays satiety-only; the two body meters stay genuinely distinct.
- **Why:** keeping the bleed makes losing sting in the moment, while routing
  rice out of the carried pool keeps the penalty legible. No auto-trickle
  makes HP recovery a resource the player spends (mon or days) — which is what
  turns the sickroom + Sōan's ledger into real economic pressure, not a free
  nap.
- **Consequences:** 🔁 refines ADR-155 — adds the defeat material-bleed and the
  no-auto-trickle mend split. Plan B: G3 KEEPS the carried-loss bleed
  (reversing the plan's original "retire the bleed" default) and lands the
  no-auto-trickle rule; the treatment action + manual rest-at-sickroom are G4
  sickroom content. All magnitudes (bleed size, `SICKROOM_DAYS_LOST`,
  treatment cost, trickle rate) sim-owned; the double-cost curve (bleed +
  days) gets an explicit sim-check.

### ADR-165 ✅ — every rung-up opens a VN; content varies (the R2 silent rung)

- **created_date:** 2026-07-08
- **Context:** the plan's default made the R2 "silent rung" a narration-only
  promotion with NO VN modal (a special no-scene path). The human ruled the
  opposite on structure (Q6).
- **Decision:** **every rung-up opens a VN scene** — the promotion is always
  the same ritual moment (one uniform "rung → VN" engine path, one
  player-facing beat; TST1 / kernel #6). What goes INSIDE varies by rung:
  R2's VN content is the silent/narration treatment (no granter, quiet — the
  bible's deliberately wordless rung), but the FRAME is present exactly like
  every other rung.
- **Why:** a uniform promotion ritual reads better than a special-cased
  missing modal and is simpler in the engine (no inert no-scene branch). The
  bible's "silence" at R2 is a CONTENT choice (what the VN says), not a
  STRUCTURAL one (whether the VN opens).
- **Consequences:** Plan B G4.1/G4.6 — R2 gets a VN frame with silent content,
  reversing the plan's "no granter modal / inert `advance_rung_beat` path"
  default; the VN modal carries all eight rung-ups uniformly. No magnitude
  impact.

### ADR-166 ✅ — Autumn's exit is a true refusing gate (HD-31; 🔁 refines ADR-153)

- **created_date:** 2026-07-09
- **Context:** the storywave G1 spec said a gated season exit is REFUSED
  until its predicate holds; the build shipped the softer form — every
  Autumn exit auto-reckons the nengu inside the pipeline (`step.ts`
  `onNengu`), so no exit is ever refused. The post-ship review recorded
  the divergence (B7); the closure plan surfaced it as HD-31 with a
  keep-as-built default. The human ruled the OTHER way (2026-07-09).
- **Decision:** implement the refusing gate per the G1 spec. Attempting
  `advance_season` in Autumn before that year's reckoning REFUSES the
  exit and triggers the nengu scene; the scene's completion performs the
  reckoning (the kura koku draw + `nengu-reckoned` / `nengu-short`
  latches + the HD-30 log line); a second exit attempt then passes.
  **Annual semantics:** the gate re-arms every Autumn (the reckoning is
  per-year, tracked by a per-year seam, e.g. the seasonsPassed of the
  last reckoning), while the once-latched `nengu-reckoned` flag keeps
  serving the R7 rung gate unchanged. The same C1.4 hardening makes
  `advance_season` engine-law elsewhere too: refused while a scene/intro
  is live and before the R2 `readout-seasons` unlock.
- **Why:** the human wants tax day to be a stop-and-face-it friction
  beat — the door does not pay itself. The fiction (the board, the
  reckoning) now CAUSES the mechanics (TST3) instead of riding them.
- **Consequences:** reverses the B7 as-built semantics; `onNengu` moves
  from the exit pipeline to nengu-scene completion; the autoplay/sim
  must reckon before ending Autumn (pacing may shift → ADR-132 verdict
  with the commit); `season.test.ts` asserts the refusal + the annual
  re-arm. Ungated seasons stay instant (ADR-148 unchanged).

### ADR-167 ✅ — the supplemental fiction wave ships NOW, in full (HD-32)

- **created_date:** 2026-07-09
- **Context:** the spirit-pass audit found the bible's ambient T0 half
  authored-and-dark; five of six per-season VN overlays deferred
  (`scenes.md`), the three bible-named hidden discoveries absent, the
  day-book judge single-lined, per-season node flavor unwritten. The
  closure plan's C5a offered "units 1–4 now, scope 5" vs "defer to T1".
- **Decision:** run the FULL wave now, including unit 5. Units: (1) the
  five missing season VN overlays; (2) the three named hidden
  discoveries (weir-reeds mystery seed · silted sluice · the sett) with
  ADR-146 hint lines; (3) the wolf-flees / new-moon crossing line iff
  C4.4's source search is empty; (4) per-grade day-book judge lines for
  the six-step ladder; (5) per-season node flavor at **per-season
  diverge units** — 6 units × 3 takes, each take one season's atmosphere
  across all ~15 nodes (seasonal coherence chosen over per-node voice or
  whole-set picks). All under the ADR-139 3-take law (the ADR-162
  one-version exception was wave-scoped and is spent), live DEV
  Story-switcher review (ADR-143), self-pick + HR-item sign-off.
- **Why:** the gaps are the shipped game's visible canon debt — the
  human chose completeness now over deferring through the v0.4.x QA
  pass; per-season units balance review load against coherent mood.
- **Consequences:** C5a executes in-session (human-routed to Fable);
  alternates stay DEV-only until the HR-items close; `map.ts` node
  blurbs become season-keyed; registry wiring rides the same commits.

### ADR-168 ✅ — the PRD is NOT frozen; it tracks the shipped game (HD-33; 🔁 refines ADR-021/ADR-059)

- **created_date:** 2026-07-10
- **Context:** HD-33 — the C2 closure sweep found the PRD's §1.5 T0 rung
  table and §4.8 hand-authored pacing table describe the PRE-reboot game
  wholesale, and stopped at the ADR-021 freeze boundary rather than fix
  human-signed §1 text. Asked how far the ripple may reach, the human
  ruled on the premise itself.
- **Decision:** **There is no PRD freeze — "we can't freeze it."** The
  queued §1 vision-freeze (ADR-021's snapshot, re-timed to end-of-v1 by
  ADR-059) is **CANCELLED**, not merely deferred. Any agent blocked by
  freeze language unblocks and fixes the text. The PRD is corrected to
  match the current story-bible + the shipped src (HD-33 option a),
  with **generation as the preferred mechanism**: wherever a block is
  derivable from a registry or an existing generated doc, expand the
  gen-region system (`gen-prd-regions.ts`) or strike-and-point at the
  generated doc — hand-transcribe only what generation can't carry.
- **Why:** the build is the territory (PH2); a "frozen" hand copy of a
  since-rebooted game is worse than no copy — it actively misleads. The
  locked-intent constraints (no-magic · mediocre-start · trade ≤⅓ ·
  active-only · the four pillars · the estate spine · the signed
  acceptance targets) still bind — as **human intent** under ADR-022
  (newest steer is canon), not as a text-freeze.
- **Consequences:** ADR-021/ADR-059 annotated (the freeze door is
  removed, not moved); freeze-language across the PRD/docs gets cleaned
  in the truth-sync ripple; the s136 PRD truth-audit + its
  `docs/plans/` truth-sync plan execute this decision. `/prd-ripple`'s
  "frozen §1 → stop for the human" class relaxes to "intent change →
  stop for the human" (text-sync to shipped canon is agent-safe).

### ADR-169 ✅ — T2 village reputation is the PRD's multi-node WEB; the bible's single track is superseded (🔁 refines the tiers/t2.md lock)

- **created_date:** 2026-07-10
- **Context:** the s136 PRD truth-audit flagged §1.5.2's "multi-node
  reputation web" (per-shop patron standing · per-family goodwill ·
  craft-guild standing · the Chief's-regard roll-up, gentle curves,
  never gates the ladder) as contradicting the bible T2 sheet's locked
  "village track" (ONE five-stage standing in the village's voice:
  surcharge → fair price → the nod → named → vouched-for, can fall).
  The sync plan's T1.4 would have transcribed the bible over the PRD.
- **Decision:** **the WEB survives — the PRD §1.5.2 text stands; the
  BIBLE is what updates** (human, 2026-07-10, via the plan-fork ask).
  T2 village reputation is the continuous multi-node web. The bible's
  five village-voiced stages are NOT discarded wholesale — they read
  naturally as the surface voice of the web's overall/chief roll-up —
  but reconciling the two is **T2 design work**, owned by the T2
  planning pass, not by this doc sync. Until then the t2.md block
  carries a superseded-pending note pointing here.
- **Why:** the human's intent for T2's side faction is breadth — many
  gentle meters, frequent small wins — deliberately unlike the
  estate's one steep ladder; the bible's single track had quietly
  narrowed that intent (ADR-022: newest steer is canon; the bible is
  checked, not trusted — PH2).
- **Consequences:** truth-sync plan T1.4 is dropped (no §1.5.2 edit);
  `tiers/t2.md`'s village-track block annotated; the T2 rungs/fog plan
  (or its successor) inherits the web↔five-stages reconciliation as a
  design item; the five-stage *voice* is kept as flavor material.

### ADR-170 ✅ — Phase 2 re-tuned to the signed ≈1:1; idler ascension is NOT a promise (HD-34; 🔁 refines ADR-133/ADR-148-interim)

- **created_date:** 2026-07-10
- **Context:** the C5b re-baseline left three design REDs the sim could
  not rule (HD-34). The story rewrite shrank Phase 1 (the R0→R7 climb)
  while the Phase-2 estate economy — `ESTATE_DEED_PER_ACT`, tuned
  against the OLD climb — stood, drifting the phase ratio to ~4.4–5×
  the signed [0.8, 1.2] (ADR-133/HD-19). Separately the idler persona,
  its C5b verb bugs fixed, climbed the full ladder on all 5 seeds but
  burned to the 1M-intent guard in Phase 2 (estate ~0 after ~800k idle
  acts — idle labour banks essentially no deeds).
- **Decision (human, 2026-07-10, via the fork ask):**
  1. **Re-tune Phase 2 to ≈1:1** — the ADR-133 law stands;
     `ESTATE_DEED_PER_ACT` 0.05 → 0.22, sim-verified to ratio
     [0.84–1.17] ∈ [0.8, 1.2]. Total greedy T0 ≈ 7.5–8.5 h wall
     (climb ≈ 3.5–4.5 h + Phase 2 ≈ 4 h), down from ≈ 22 h.
  2. **"An idler ascends T0" is NOT a design promise** — Phase 2 is
     deliberately **attention-priced**: idling climbs the full ladder;
     ascension takes attended estate work. The sim expectation re-signs
     to a per-persona **promise** (`'ascend'` | `'ladder'`); the idler's
     run now ends cleanly on reaching the top rung (0.9 s matrix, was
     15+ min of guard-burning).
  3. **B8 (zero-cost season-turn pool refill): no action** — the
     evidence shows the per-rung bands holding despite the greedy sim
     exploiting it; the mechanism options (refill lag · turn cost ·
     spoilage scaling) stay available if the human's own play feels the
     wheel-spin cheap.
- **Why:** the ratio band is a *ratio* precisely so it survives climb
  changes — nothing since HD-19 re-signed the "capstone ≈ climb" law,
  so the economy moves, not the band. Attention-priced ascension
  matches the fiction (a house's standing isn't built absentmindedly)
  and keeps the idle loop valuable without making it the whole game.
- **Consequences:** the ADR-148-interim ratio-gate suspension is
  LIFTED — `pacing-envelope.test.ts`'s real-arc ratio assert and the
  idler determinism test are re-enabled; `phase2RatioVerdict` measures
  the ADR-148 **timed wall** (the old wall≈intents shortcut died with
  timed actions); the R3–R6 per-rung band scope stays interim, filed
  as **HD-35** (R3's timed wall ~146–221 min vs the [3, 22] band is an
  unruled question). Fixtures `pre-ascension`/`wealthy-idler`
  regenerated; pacing report regenerated (the diff is the
  before/after).

### ADR-171 ✅ — parallel inbox drains via lane claims; the single-lane rule is cancelled (🔁 refines FB-3's drain contract)

- **created_date:** 2026-07-10
- **Context:** the human added buckets to the capture inbox and began
  running several `/drain-inbox` agents at once — three lanes live on
  2026-07-10 — while the skill still said *"one drain lane at a time"*
  and used the intake commit as a bucket-blind concurrency signal. The
  F-number race was live (two lanes computing the same "next free"
  number; FB-198 nearly double-allocated), the per-day F-log was a
  shared append target, and the speaker-colour complaints spanned all
  three buckets while pointing at ONE fix surface.
- **Decision (human, 2026-07-10):** parallel drains are the design, not
  a violation. **(1) Claim protocol** — a drain pass first claims its
  **lane(s)** (1..N buckets, or a re-grouped cluster) via
  `inbox-claim.ts`: an atomic, **git-ignored** `pending/.claims/` file
  (ephemeral state stays out of git; no verify-run per lock), validated
  by owner **liveness** (herdr pane roster, pid fallback) so a dead
  lane is reapable, never a deadlock. The claim reserves a contiguous
  **F-number block** and prints an **announce** (live lanes +
  fix-surface collisions) the agent must relay to the human — asking,
  not assuming, when items would collide. **(2) FB numbers are
  allocated AT CAPTURE TIME** (human follow-up, same day): the capture
  middleware — the single writer — stamps `FB-<n>` into the entry
  heading and the sidecar as the capture lands, killing the
  next-free-number race by construction; the claim's reserved block
  survives only as the fallback for legacy unstamped captures.
  **(3) Durable re-group** —
  `inbox-regroup.ts` seeds each capture's `surface` tokens and re-lanes
  cross-bucket clusters; the result lives **on each capture's own
  `<stamp>.json` sidecar** (`lane`/`surface`/`status`/`fb`/`commit`,
  defaults-by-absence — no migration), so no item is drained twice.
  **(4) Per-lane F-logs** (`<date>-playtest-<lane>.md`) end the shared
  append target. **(5) Completion** = sidecar stamp; a bucket archives
  when every sidecar is done. **(6) A pass drains the WHOLE lane**
  (human, same day) — the old ≤5 batch cap is retired; the wholesale
  §4 proposal stays the interactive gate.
- **Why sidecars, not a central ledger:** N lanes marking items done in
  one ledger file recreates the very append race being killed; the
  middleware writes each sidecar exactly once and never returns, so
  per-item fields are contention-free by construction. **Why the claim
  is ephemeral:** in-progress is liveness, not history — a commit per
  lock would cost a full verify run and leave stale claims needing git
  surgery.
- **Consequences:** the inbox README's *"no status field to go stale"*
  invariant is **superseded** — location alone can't encode completion
  once a lane spans buckets. The replacement teeth, per the
  highest-sound-rung ladder: the **`inbox-ledger` verify gate**
  (content invariants only: F-numbers unique above the FB-198
  grandfather baseline across the unified F/FB space; done items name
  fb + commit; fully-done buckets must leave `pending/`), the
  **`guard-inbox-pending.sh`** PreToolUse hook (pending `.md`s are
  machine-written — drain state goes on sidecars), the rewritten
  **drain-inbox skill** (claim → announce → drain → stamp → release),
  and the **session brief** surfacing live claims. Worktree isolation
  (the only real fix for two lanes editing one file / sharing one
  `verify` tree) is **deliberately deferred** — accepted risk, its own
  future ADR. Design doc:
  `project/brainstorms/2026-07-10-concurrent-drain-safety.md`.

### ADR-172 ✅ — R3 re-paced into the signed band; full-ladder verdicts restored (HD-35; 🔁 completes ADR-170's interim)

- **created_date:** 2026-07-10
- **Context:** ADR-170 restored the ratio gate but left the per-rung
  band verdict scoped to R0–R2 (`ADR148_INTERIM_BAND_RUNGS`): R3's
  timed wall measured ~146–221 min across seeds vs the signed [3, 22]
  band (~8× over). The breakdown showed the fights themselves cost
  under a minute — the ~19-kill grind to `R3_FRONTIER_COMBAT_LEVEL`
  dragged a ~123-min life-support loop behind it (526 cooks, 379
  walks, 158 forages on the canonical seed). R7's ~237-min residence
  mirrored the bloat through the ADR-133 ≈1:1 law (ADR-170 tuned the
  deed base against the bloated climb).
- **Decision (human, 2026-07-10, via the fork ask):** HD-35 rules
  **(a) re-pace** — every climb rung into the band, R7 kept on the
  ADR-133 ratio law (not the per-rung band), any lever with the
  night-watch fiction intact:
  1. `COMBAT_XP_K` 5 → 20 (~5 kills to L3, was ~19) and
     `COOK_HP_RESTORE` 14 → 35 (two meals ≈ a full mend) — R3 sims
     **20.0 [19.0–20.3] min**, in band on all 5 seeds.
  2. `ESTATE_DEED_PER_ACT` 0.22 → 0.6 — the climb shrank ~224 → ~76
     min, so the same ≈1:1 law scales Phase 2 to match: ratio
     **[0.95–0.97]** ∈ [0.8, 1.2]. Total greedy T0 ≈ **2.5 h** sim
     wall (was ≈ 7.7 h).
  3. The interim scope DELETES (as its comment promised): the band
     verdict covers all of **R0–R6**; R7 residence stays the ratio
     gate. `verify:balance` is the full-roster teeth.
- **Why:** the human ruled the R3 wall a design bug, not the tier's
  long act — attended play runs ~5× sim-greedy (the R0 telemetry:
  23.6 attended vs 4.3 sim), so a 160-min sim rung is a ~13-hour
  attended wall. The support-loop levers (not the fight design) were
  the honest cut: the "you've fought" gate and the night-round
  fiction survive untouched.
- **Consequences:** the idler's kill-req branch gained the
  forage-for-sansai mend fallback (the re-tune exposed a 1-HP/1-sansai
  loss-loop on seeds 1/7 — a persona hole, now mirrored from the
  night-round branch); `pillars.test.ts` asserts deed banking as
  whole+frac TOTAL (workshop's 0.6×2 = 1.2 koku crosses the whole-koku
  boundary); `invariants.test.ts`'s arc floor re-derived 2000 → 1000
  dispatches; fixtures + pacing report regenerated (the diff is the
  before/after). Attended-play calibration of the [3, 22] band itself
  (sim-min vs felt-min) stays open under HR-1's live playthrough.

### ADR-173 ✅ — the three-act cold open restored: dream → soan → genemon (HD-37; 🔁 re-opens C4.9's fusion)

- **created_date:** 2026-07-10
- **Context:** C4.9 (the G4.1 reshape) fused the pre-reboot three-scene
  intro into the single take-a sickroom scene. Playing live v0.4.0 the
  human hit the loss directly (FB-223): _"the Memory section is gone,
  the discussion with genemon is gone, the ability to choose 3 perks is
  gone… I saw a cold open that was better then what we have right now."_
- **Decision (human, 2026-07-10, walkthrough asks):** restore ALL THREE
  elements as a **hybrid + fresh diverge** — the human-verdicted take-a
  sickroom prose stays as the middle act; the memory act + Genemon's
  scene return re-authored via ADR-139 (seeded by `b221d6e~1`, never
  copied). Act order **dream → soan → genemon** (memory fragments
  before the rescue narration; soan keeps the name-flip beat, so the
  genemon act reads `Nameless:`). The FB-14 title-card lede/CTA is
  REWORKED to fit memory-first (not moved, not kept); the nine perks
  restore at their old numbers (the sim is the gate); the ~2× cold-open
  length is accepted (FB-8 telemetry watches).
- **Consequences:** `INTRO_SCENE_ORDER` = [dream, soan, genemon]; zero
  engine changes (the cursor walks scenes generically; the flip keys on
  `scene.id === 'soan'`). §0.5 law 4 holds: the first act is drowned
  MEMORY surfacing, never a dream — the first dream stays T0-R7. The
  card's fiction moved out of render.ts hard-codes into `cold-open.md`
  (`lede`/`cta` keys) with a live DEV swap (`dev.subColdOpen`). Diverge
  picks: unit A take-a "the inventory of what is left" (HR-22) · unit B
  take-c "the first entry is yours" (HR-23); alternates live in
  `takes/hd37-cold-open-{a,b}/` until sign-off. `verify:balance` GREEN
  with three net-zero picks + nine perks — no persona rule needed.

### ADR-174 ✅ — a hidden-but-OPEN window stays active; auto-play keeps ticking (FB-313; 🔁 refines ADR-148)

- **created_date:** 2026-07-10
- **Context:** the human runs the game in a **dedicated single-tab
  Chrome window** on a second monitor and works in VS Code; the auto
  loop stopped whenever that window lost focus. Root cause: the loop
  (`src/app/main.ts` `autoStep`) gated on `document.hidden`, and the
  `visibilitychange→hidden` handler additionally `clock.cancelAll()`'d
  the in-flight action (ADR-148, "tab-hide drops it, active-only"). On
  macOS the **window-occlusion API** reports a fully-covered dedicated
  window as `visibilityState: 'hidden'` — the *same bit* a truly
  backgrounded tab reports. No web API distinguishes "occluded dedicated
  window" from "one of five tabs, another active", so the platform
  cannot honour the human's model directly.
- **Decision (human, 2026-07-10, FB-313 drain):** redefine "active" as
  **tab-alive**, not tab-visible. `autoStep` no longer gates on
  `document.hidden` (only `paused`/`crashed`), and hide no longer
  `cancelAll`s the in-flight action — it just flushes a save. This
  leans on the **browser's own throttling tiers** to approximate the
  human's mental model *for free*: an occluded dedicated window keeps
  progressing at the ~1 s throttled cadence, while a truly-backgrounded
  tab falls under Chrome's intensive throttling (~1/min after 5 min) and
  effectively idles off — "dedicated-window keeps going / 5-tabs stops"
  without a distinction API.
- **Consequences:** the "active-only, no offline progress" PRD pillar
  (§1/§2.8/§6.9/FU23) **still holds** in the sense that matters — progress
  ceases entirely when the **tab is closed**; there is no offline/closed
  accrual and no catch-up replay. What changed is the boundary of
  "active": hidden-but-open is now inside it. Minor background battery
  cost is accepted (the human explicitly chose this over catch-on-return,
  which couldn't tell the two hide-cases apart). ADR-148's "tab-hide
  drops the in-flight action" clause is superseded by this entry; the
  timed-action wall itself is unchanged. FB-8 telemetry watches for any
  pacing surprise from throttled-cadence hidden runs.

### ADR-175 ✅ — Munemasa stays unstaged in T0: shipped lines yield to canon (HD-36)

- **created_date:** 2026-07-10
- **Context:** the s141 src-vs-PRD verification sweep found two shipped R7
  requirement flavor lines staging `{lord}` Munemasa speaking on-screen
  ("says from the veranda"), against the human-signed bible canon: in T0 he
  is "a voice through a wall, **never met**"; his one scene is T1's shoin
  capstone (tiers/t0.md · 04-cast.md). The lines predate the story reboot;
  their re-derivation was deferred under HD-30, which closed without them.
- **Decision (human, 2026-07-10, HD-36 → option a):** **canon holds** — the
  lines are re-derived via an ADR-139 narrative diverge so the R7 beat lands
  without staging the lord; the bible is NOT amended to absorb shipped text.
  The precedent: where shipped fiction contradicts the synced bible, the
  bible wins and the text re-derives — a shipped line earns no squatter's
  rights over signed canon.
- **Consequences:** three blind takes (relayed · overheard · lordless);
  self-pick **"the voice through the wall"** — Munemasa heard through the
  shoji, unanswered, never met: the bible's own device, pre-sounding the
  damaged voice T1's capstone pays off. Review → **HR-25** (alternates live
  in `takes/hd36-lord-unstaged/`, DEV → Story). The G4.1 verb-token
  re-derivation stays owed to the G4.2/G4.3 registry chunk (noted in
  `requirements.md`'s header).

### ADR-176 ✅ — Verify budget 5s soft / 8s HARD; the `vitest` gate splits into a fast commit lane + a full push/CI lane (refines ADR-072)
- **created_date:** 2026-07-10
- **Context:** The per-commit `vitest` gate had regressed from ~3s to ~33s. Root
  cause (measured): three legitimately-heavy tests — `persistence/save-e2e.test.ts`
  (a whole-T0 playthrough run at `describe`-collect time, ~10s),
  `ui/affordance-coverage.test.ts` (24× full app-mount + click-sweep, ~16s), and
  `ui/render.test.ts` (a 103-test jsdom render suite, ~5.6s). The other 83 files
  run in ~3s. ADR-072's "soft 5s drift timer that never blocks on time" let this
  rot in silently. The human's steer: **5s is a soft cap, 8s is a HARD cap;
  pre-commit hard-fails at 8s** (newest-steer-wins over ADR-072's never-block).
- **Options:** (A) speed vitest up in place (config is already `threads` +
  `isolate:false` — no lever left; the cost is the three tests) · (B) hard-fail at
  8s with the suite as-is (blocks *every* commit — the suite is 33s) · (C) **split
  the `vitest` gate: a fast COMMIT lane (skips the heavy tests) + a FULL push/CI
  lane, and enforce 5s soft / 8s hard on the commit lane.**
- **Decision:** **(C).** A test opts into the slow lane with a top-of-file
  `// @slow` pragma (same per-file-pragma pattern as `// @vitest-environment
  jsdom`; no hand-maintained list). `src/scripts/vitest-verify.ts` derives the
  exclude set by scanning for it: the per-commit `vitest` gate runs everything
  **except** `@slow`; `VERIFY_FULL=1` (set by **pre-push + CI**) runs the whole
  suite. Budget is **5s soft / 8s HARD**: pre-commit is silent <5s, warns 5–8s,
  and **BLOCKS past 8s** (`SKIP_BUDGET=1` bypass for a genuinely loaded box). The
  commit lane measures **~3s**, so 8s is ~2.5× headroom — the hard fail trips on a
  real regression (a slow test in the fast lane), not machine noise.
- **Why:** This is the same call ADR-072 made for the Playwright e2e suite —
  heavy, seam-proving tests run at push/CI, not on every keystroke-commit — now
  applied to the vitest heavies. Nothing `@slow` reaches `main` unverified (pre-push
  + verify.yml + the atomic test.yml all run the full suite). The hard cap keeps
  the fast lane honest: a future O(n²) full-arc test can't quietly drag the commit
  gate back to 30s. Preserves PH3 (done-is-earned: the remote is always fully
  green) while restoring fast local feedback.
- **Consequences:** New `src/scripts/vitest-verify.ts`; `gates.ts` `vitest` cmd →
  it; the three files tagged `// @slow`. `verify-run.ts` `--budget` default
  5000→8000 (+ a 5s soft note); `.githooks/pre-commit` hard-fails past 8s (was
  warn-only); `.githooks/pre-push` + `verify.yml` + `verify-nightly.yml` set
  `VERIFY_FULL=1`; `vite.config.ts` comment updated. Docs: AGENTS.md, qa-playtesting,
  repo-map, roadmap, and the ADR-088 gate-time note re-pointed at the 5s/8s model.
  **Follow-up (not in scope):** `save-e2e` runs its playthrough at collect-time
  (describe body) even in the full lane — move to `beforeAll` for parallelism.
  Per **ADR-022**, governs; refines **ADR-072**.

### ADR-177 ✅ — The estate redesign direction: upgrades become Works 普請, cause-gated, one-tab-per-rung (Phase 0 of the estate plan)
- **created_date:** 2026-07-10
- **Context:** The Estate section had failed the human three times: FB-157
  ("border soup" — the quick-fix re-skinned the card, not the shape), FB-274
  (the reveal line struck as unearned — "I need to think harder about the
  Estate section TBH"), and FB-338 ("why are you mending the weir screens, who
  told you about the weirs… its just not mentioned, its random") + FB-342 (the
  weir walkable in R1 against expectation). The interim HR-9/HR-11 lock (V0A/
  V1A "for now") flagged the whole section + upgrades for a real redesign; the
  plan (`docs/plans/fable-2026-07-10-estate-upgrades-redesign.md`) framed five
  forks; the human ruled all of them in-session (three AskUserQuestion rounds +
  a rung-by-rung tab dossier). Verbatims:
  `project/feedback-human/2026-07-10-estate-phase0-rulings.md`.
- **Decision:** Five rulings, one direction — *the fiction causes the works*:
  **(1)** The upgrades feature LEAVES the Estate 家 tab into a NEW **Works
  普請** tab (fushin — picked from a 10-name field); the pillars/influence stay
  on Estate 家, which gains the E1 okoshi-ezu cutaway (HR-16) as its anchor.
  **(2)** Every project is **cause-gated** (never R1-spawned): the day-book/
  lease NAMES a concern → walking the zone and SEEING the damage unlocks the
  work → each project also gets its own NPC dialogue beat ("ledger names → you
  walk", + beats). The weir node is **locked until named** (resolves FB-342 and
  FB-338 with one mechanism); the first Works projects live in the three R1
  zones (gate · paddies · woodshed). **(3)** Upgrades become **repair verbs +
  inputs** — per-project zone/act requirements + material costs, coin demoted
  from sole gate. **(4)** **One-new-tab-per-rung** is adopted as the IA law,
  signed as **Schedule A**: R0 Work · R1 Map 地図 (alone) · R2 Character +
  Works 普請 (the one accepted double, both cause-gated) · R3 Combat (alone) ·
  R4 Inventory (`panel-home` re-keys) · R5 Quests 用 · R6 Estate 家 · R7 —
  (Phase 2 fills Works). **(5)** Project-per-zone pacing: later projects land
  as their fiction-zones open (orchard ~R5 · granary ~R6 · study ~R7).
- **Why:** TST3 end-to-end — FB-338's three questions ("who told you / why did
  you notice / why is it here") each get a mechanical answer (the ledger line /
  the zone visit / the cause gate). The tab audit showed R1+R3 doubled while
  R4/R6/R7 sat empty; Schedule A places every tab where its fiction fires (Works
  rides the silent R2 rung, Estate 家 arrives as the house-rooms reopen at R6)
  at the cost of one accepted double. The human explicitly chose fiction over
  cadence symmetry ("if we have to double we have to double").
- **Consequences:** The plan's build phases are startable in order (fiction
  diverge → IA reshuffle + two surface diverges → the requirements economy under
  ADR-132; ADR-172 magnitudes stand unless the sim moves them). The interim
  V0A/V1A variants (estate-a/b/c, tracker-a/b/c) retire when Phase 2's diverge
  signs off. Estate tab R1→R6 + Inventory R3→R4 are pacing-visible moves owned
  by Phase 2 step 1. FB-338/FB-342's r1-lane sidecars still owe drain stamps.
  Per **ADR-022**, governs; supersedes the HR-9/HR-11 interim as direction.

### ADR-178 ✅ — The body split rules Option C: Body 体 (stamina) + Belly 腹 (hunger), slow-only in T0 (Phase 0 of the body-split plan)
- **created_date:** 2026-07-10
- **Context:** FB-345 read the merged `satiety` store as TWO ideas wearing one
  bar ("theres a bar for hunger and energy from food / And a bar for stamina
  and how much you can work"); FB-334/FB-335 flagged the same surface. The
  plan (`docs/plans/fable-2026-07-10-body-split-hunger-stamina.md`) framed
  four Phase-0 forks; the human ruled all four in one AskUserQuestion round
  (2026-07-10).
- **Decision:** **(1)** Build **Option C** — `stamina` is the per-act
  short-cycle fuel (today's satiety, numbers unchanged); `hunger` is a NEW
  slow daily-cycle store food maintains, coupled only through a rest-quality/
  rate multiplier. **(2)** Display names are canon: **Body 体** (the work/
  stamina bar) + **Belly 腹** (the food/hunger bar) — internal field names
  never surface (FB-334's law). **(3)** Hunger **only slows** in T0 — no
  starvation death; a later tier (T1+) is explicitly *allowed* to add
  starvation consequences. **(4)** FB-343 re-home: the food verbs (eat, cook)
  **move to the Inventory tab** once Schedule A (ADR-177) lands; zones stop
  carrying them.
- **Why:** Option C honors the human's read (two bars on two clocks) without
  re-tuning T0's act economy (ADR-172 stands) and leaves the eating-mends-HP
  coupling untouched (ADR-050/ADR-076). Slow-only keeps T0 gentle while
  pre-authorizing later-tier teeth. The Inventory re-home follows Schedule A's
  one-home law (TST1).
- **Consequences:** The plan's Phases 1–3 are startable in order (core model
  test-first → two-bar header UI → ADR-132 balance verdict). The plan's
  non-goal "no starvation death in T0" is confirmed and extended with the
  T1+ allowance. Phase 2's bar naming is settled — no naming diverge needed.

### ADR-179 ▶️ — Reveal is derived, never stored: visibility = f(progression facts); the save keeps only facts + an announce-once latch

- **created_date:** 2026-07-11
- **Context:** The human refreshed with an old save and the UI (tabs, the
  eat-rice zone action) came from flags baked into that save, not from what
  the current build entitles ("the tabs visible to me are based on the save
  file im loading and not based on the actual game"). The reveal system is a
  write-once `state.unlocked` latch pushed by rank rewards/events and
  serialized whole; `state.rung` is never consulted for visibility. The
  registry had accumulated six-plus per-surface "STATE-PREDICATE so it
  back-reveals for any save" patches plus a load-time `revealPass` — each a
  local fix for the same architectural drift.
- **Decision:** **Full derivation** (human, 2026-07-11, over a load-time
  reconcile). **(1)** Visibility is a pure function of progression FACTS —
  the latched `rank-rN` flags (the human's `[r0, r1, r2]`), event fact-flags
  (the `[r1:postX]` markers, e.g. `works-named-weir`), `discovered`, skills.
  **(2)** `state.unlocked` leaves the save; `rewardOnReach.unlock` is
  reinterpreted as the declarative from-this-rung-on schedule (one home
  stays `ranks.ts`). **(3)** Derived visibility must be MONOTONE — a
  predicate over a fluctuating value (coin > 0) converts to a latched
  fact-flag at the causing event. **(4)** The save's only reveal-shaped
  field is `seenReveals`, the announce-once ceremony latch (sibling of
  `scenesPlayed`) — never read for visibility. Schema v10→v11 seeds it from
  the old `unlocked`.
- **Why:** A save can no longer pin stale UI: re-classify, re-rung, or
  delete a surface and every save reflects it on next load, no migration
  per surface. The latch's one real job — "reloading never re-spams
  reveals" — is exactly the ceremony latch, kept. Completes the
  state-predicate trajectory the registry was already converging toward,
  instead of a seventh patch.
- **Consequences:** Plan `docs/plans/fable-2026-07-11-derived-reveal.md`
  (S1–S7). `revealSurface`/push-`revealPass` delete; `announcePass` replaces
  at the same call sites; PRD §6.2 (core/unlock latch language) needs the
  ripple (S7). The FB-343/FB-369 eat-rice re-home stays owned by ADR-178 —
  this ADR only makes that move save-proof.

### ADR-180 ✅ — Map travel presence v2: the physical porter piece (FB-340 v2, closes HR-26)

- **created_date:** 2026-07-11
- **Context:** FB-340 v1 marked position with flat shu marks (resting
  here-ring, footprints, a destination press-in ring). The human asked for the
  position to read as a PHYSICAL PIECE on the survey sheet — "a chess piece, a
  monopoly character, a peon, a miniature" — and took the question through the
  `map-token-presence` prototype: round 1 rejected the koma / go stone /
  pilgrim-hat takes and a samey four-robe miniature set; round 2's four
  divergent sculpts produced the pick.
- **Decision:** The **根付 boxwood porter** (bundle, staff, shu carry-cord) is
  THE presence idiom: it stands beside the here-zone's seal (south offset) and
  WALKS the edge — linear, ActionClock-synced, netsuke waddle + the v1 shu
  footprints — on every real `move_to`. It is an **indicator, never an
  avatar**: display-only, pointer-events none, never freely movable. Arrival
  is the piece settling (the v1 destination ring is dropped); the here-seal
  keeps its shu stroke for far-zoom legibility; camera follow stays. Sculpt in
  `porter-token.ts` (`--piece-*` tokens), math pure in `porter-math.ts`; v1's
  rings survive ONLY behind the DEV `presence` toggle until the human confirms
  live (HR-31), then delete (ADR-075 zero flag-debt).
- **Consequences:** HR-26 archived (superseded); HR-31 tracks the live confirm
  + v1 deletion. The prototype (porter ⭐) stays as the verdict record. A
  future map-piece idea (NPC pieces, caravan pieces) extends the same
  piece-on-sheet idiom, not a new marker primitive.

### ADR-181 ✅ — The promotion beat can relocate you: `RankDef.arriveAt` (FB-388)

- **created_date:** 2026-07-11
- **Context:** Completing the R0→R1 rung-up VN left the player standing inside
  the kura, walking out to the forecourt by hand — the beat's fiction ("the
  terms are set where the day's work is set out") had already moved the story
  there, but not the piece. FB-388 (the human's own inbox capture) named the
  gap.
- **Decision:** A `RankDef` may declare an optional **`arriveAt`** map node;
  `applyPromotion` (the sole rung-advance point) stands the player there,
  ending any auto-grind exactly as `move_to` does. R1 declares `forecourt`.
  The move is **fiction-caused** (TST3): a rank only declares `arriveAt` when
  its beat's story physically takes you somewhere — it is never a convenience
  teleport. Arrival is derived from the `RankDef`, never a literal in the
  reducer (RED-able tests in `rung-beats.test.ts`; a rank without `arriveAt`
  leaves you in place).
- **Consequences:** Landed in `4bb513eb`; §6's `content/ranks.ts` catalogue
  row documents the field. Future rungs (and T1+ ladders) reuse the same
  declarative field rather than growing bespoke post-beat scripting.

### ADR-182 ✅ — canon: the requirements model is the progression model at EVERY tier; the flat-points rung-meter is dead (extends ADR-137)

- **created_date:** 2026-07-11
- **Context:** session-179's `/prd-ripple` synced §6 to ADR-137, but ~105 lines
  across six PRD sections still described the OLD model — a flat per-rung-reset
  points meter, a threshold table, and an AND-gate with story flags. §4 and §6
  had been hand-annotated to read "T1+ frontier", implying the meter survived as
  the T1/T2 plan, while **ADR-024** ("the rung-meter accrual law") still stood
  unsuperseded on paper. The build said otherwise: nothing but a tombstone
  remains (`state.ts:200` — "SCHEMA_VERSION 8 replaces `rungMeter`"). Surfaced to
  the human as an intent-level question before the text-sync sweep could run.
- **Decision (human, 2026-07-11):** *"rung meters are no longer flat points, they
  are always objective and criteria based that are unique per rung, and can be as
  many or as few as needed."* The **ADR-137 requirements model is the progression
  model at EVERY tier**, not just T0. A "rung meter" survives as the NAME of the
  player-facing rounded % bar — but what it measures is that rung's authored list
  of **objective criteria** (counts, predicates, or story beats; as many or as few
  as the rung needs), never points accrued against a threshold. The flat-points
  accrual, the per-rung threshold table, and the meter-AND-story gate are dead at
  **all** tiers.
- **Consequences:** **SUPERSEDES ADR-024** (the accrual law) and the meter clause
  of **ADR-025** (Combat Rank becomes a criteria list, not a curated-activity
  meter) — both annotated in place, never deleted (ADR-022). The PRD is
  **REWRITTEN, not struck** (human, same ruling: *"I have no idea why we would
  strike stuff, the PRD is a living document, git history exists"*) — §§1/2/3/4/6/7
  describe ONE progression model. §4.1.1's accrual law is rewritten as the
  requirements model; §6's `GameState` meter fields (`estateService` /
  `combatRank`) go — they exist nowhere in code and never will. `prd-drift.ts`
  retires the dead vocabulary (`rungMeter`, `thresholdForRung`, AND-gate,
  `RUNG_POINTS_PER_ACT`) — sound now that no frontier prose survives for it to cry
  wolf on (AC-11); the bare phrase "rung meter" stays legal.
- **Plan:** [`fable-2026-07-11-prd-rungmeter-textsync.md`](../../project/archive/fable-2026-07-11-prd-rungmeter-textsync.md) (✅ done, archived).

### ADR-183 ✅ — T1+: every rung's requirement list must span BOTH tracks (HD-39)

- **created_date:** 2026-07-11
- **Context:** [ADR-182](#adr-182--canon-the-requirements-model-is-the-progression-model-at-every-tier-the-flat-points-rung-meter-is-dead-extends-adr-137)
  replaced the two numeric sub-meters with **one authored requirement list per
  rung**. That silently dropped a rule the old model carried structurally: the
  pre-182 canon read *"both sub-meters still gate every rung"* — every rung
  demanded labour **and** martial progress, which is ADR-025's
  anti-specialization intent expressed as a mechanism. With one list per rung
  that clause had no mechanism left, so the session-180 PRD sweep **dropped it
  rather than invent a replacement** and filed **HD-39**.
- **Decision (human, 2026-07-11 — HD-39, option (b)):** **every rung's authored
  requirement list must contain at least one requirement from EACH track**
  (Estate Service 家役 / Combat Rank 武鍛; House-Service / Combat-Rank at T2). No
  rung climbs on one kind of work alone. The agent recommended (a) — free-form
  lists, anti-specialization carried by authoring taste — and the human
  **overrode it**: the both-tracks guarantee is a rule, not a habit.
- **Scope:** binds **T1 and up**. **T0 is unaffected** — it ships a single ladder
  with no sub-tracks, so there is nothing for the rule to bind against.
- **Consequences — and the honest gap.** The **track concept does not exist in
  code**: `RequirementDef` (`requirements-engine.ts`) carries `id` / `flavor` /
  `drive` and a `count` | `state` | `flag` body — **no track attribution** — and
  `RankDef` has no `track` field either. So this ADR is **canon without teeth
  today**, and deliberately so: a check with no T1 rungs to check is a vacuous
  green, which is worse than no check (PH3). The rule ships with T1 authoring, and
  it needs TWO things first:
  1. **A per-requirement track attribution.** Proposed (not locked): derive it
     from the `count` token namespace where it's unambiguous (`act:<labour verb>`
     → Estate Service; `kill:*` → Combat Rank), and require an explicit `track`
     tag in `narrative/requirements.md` for `state` / `flag` requirements, which
     have no natural track. This is a **grammar growth** (FB-5), so it is a design
     call at T1's build, not an agent's to self-serve now.
  2. **A `verify-content` invariant** — once (1) exists: every T1+ rung's list
     contains ≥1 requirement per track, RED otherwise. That is the sound rung for
     it (a content invariant, never crying wolf); a norm would rot.
- **Record:** HD-39 (filed session-180 with (a) recommended, ruled (b)) · ADR-025
  (the three-track de-confliction this rule protects) · ADR-182 (the model that
  dropped the clause).

### ADR-186 ✅ — the log is a DERIVED VIEW, not a transcript: the save stores descriptors, never prose

- **Date:** 2026-07-12 · **Session:** 180 · **Human-ruled** (all 8 open calls on the
  save-format plan were put to the human before a line was built).
- **Context.** The human's standing requirement: *"When we change how the game works, move
  content from rung to rung, or change UIs, I don't want to hard reset. On load the game must
  reflect `src/` — not render stale data from the save."* The log was the last and largest
  violation: it was **86–97% of every save**, and ~85% of its entries were **keyless prose** —
  authored text copied into the save at the moment it was emitted. Reword a line in `src/` and
  every existing save kept showing the OLD words, forever. It also churned all 18 fixture files
  on every reword.
- **Decision.** The event log is a **derived view over stored facts**, not a transcript of what
  the player read. Every log line persists as a **descriptor** — `contentKey` + `params` — and
  its words are **re-rendered from the current `src/` registries on every load**. A reworded
  beat therefore rewrites what an existing save's scrollback shows. That is intended, and it
  applies to narrative prose and chosen dialogue too, not just mechanical lines.
  - **`core/content/log-render.ts`** is the one place a descriptor becomes prose: a **static
    composition module** that imports `log-content` (the hand-written templates, still a LEAF)
    plus the content registries, and owns the namespace dispatch (`reveal.` `scene.` `beat.`
    `intro.` `dialogue.` `requirement.` `activity.` `flavor.` …). Each line's prose stays in the
    registry that already owns it — no second home, no drift (TST1).
  - **Rejected:** a resolver registry (content modules registering themselves into `log-content`
    at module init). It needs no new module, but it makes rehydration **order-dependent**: a
    content module not yet imported when `codec.ts` rehydrates falls back *silently* to the stale
    stored text — the exact bug this exists to kill, made invisible. A static import graph cannot.
  - **Emit vs persist are different channels.** At emit time the caller's words are authoritative
    (they may carry a DEV story-take override, ADR-143). The KEY is what the SAVE stores. Before
    this, `applyRewards` let `contentKey` win at emit, which silently discarded story-take
    overrides on keyed narrative lines.
  - **Gated, not a norm** (the human ruled the rung explicitly): `log-keyless.test.ts` drives
    every fixture spec through the real engine and **fails if ANY prose reaches the save**, and a
    second half fails if any emitted key does not RESOLVE. A keyed entry whose key doesn't
    resolve is *worse* than a keyless one — codec falls back to the stored text, so it looks fine
    today and silently stops tracking `src/` forever.
  - Fixtures are stripped descriptors too, and rehydrate through the same codec path a real load
    uses (they no longer bypass it).
- **Consequences.** A keyless (legacy) entry still rehydrates verbatim, so old saves keep loading.
  New narrative lines MUST go through a registry + key — that is a real cost to authoring speed,
  accepted deliberately, because the alternative rots back silently. Result: 302 distinct keyless
  lines → **0**; fixtures 1812 KB → 1264 KB with **zero** prose characters on disk.
- **Known limit.** `greeting.<i>` and `stage.<i>` are **positional**, not id-keyed — re-ordering a
  scene's greeting lines in the narrative `.md` re-points an old save's line to its neighbour. The
  narrative grammar gives greeting lines no ids today. The orphaned-id sensor cannot see this (the
  index still resolves), so it is a content **restructure** that needs a migration. Giving greeting
  lines authored ids would close it.
- **Record:** the plan `docs/plans/fable-2026-07-11-save-format-streamline.md` (its "Locked
  decisions" block holds all 8 rulings) · extends the Stage-C descriptor work · relates ADR-179
  (derived visibility — the same doctrine, applied to surfaces), ADR-143 (story takes), ADR-161.

### ADR-184 ✅ — the zone-reveal law: a zone opens only in a VN; a rung-up VN opens at most two

- **created_date:** 2026-07-12
- **Context:** the human, playing the live T0: *"Kitchen does not hit in R1 lol.
  Which zones fit in which rungs is totally open to rebalance and polish; there's
  too many zones unlocking in R1."* The captures behind it — **FB-407** (the
  kitchen threshold *"has no purpose … it should go to a different rung when it
  has purpose, actions or main-question impact"*), **FB-408** (the gate is empty
  five days in seven), **FB-409** (the woodshed *"serves no purpose"*). R1 was
  opening **four** zones as a promotion reward, three of which held nothing a
  player could do. The diagnosis underneath it, which outlives this ADR: *"Opening
  the kitchen zone in the R0→R1 rung-up because meals are promised is a bit weak
  gameplay-wise. There's nothing there in R1."*
- **Decision (human, signed 2026-07-12):** **a zone opens only inside a VN, and a
  rung-up VN may open AT MOST TWO.** *"If for a zone it's better to reveal it
  through a side quest with its own VN, I'm more than happy to do that … the more
  side quests the better."* Every zone above the cap earns a **side-quest VN of its
  own**; the rung-up beat is a story moment, not a reward dispenser (a lean
  promotion is correct — **no floor**, and R6 legally opens none).
- **The mapping.** Rung-up VNs: R1 paddies · R2 woodlot · R3 kura · R4 drill-yard +
  **woodshed** · R5 shrine + orchard · R6 none · R7 grove. Five zones LEAVE the rung
  schedule for a VN of their own: **gate** (the first coin you have nowhere to spend)
  · **kitchen** (O-Hisa teaches the pot) · **field-margins** (the raided drying racks)
  · **weir-reeds** (`sb-lease` — Matsuzō and the gnawed screens — which was ALREADY
  this beat; it needed a flag, not new prose) · **sickroom** (the first hurt — FB-382's
  own stated intent, made literal).
- **The woodshed MOVES rather than leaves.** Its ceremony line — *"a mat, a bowl, a
  nail for the coat: yours"* — was a **lie**: [ADR-177](#adr-177) moved the home grant
  to R4 (`tab-inventory`), so R1 promised a bed the player did not receive for three
  rungs. Riding the zone to R4 makes the line true the moment it is spoken. R1
  consequently never says where you sleep — *you are a nobody; you have no bed*
  (human, signed). The R1 terms beat's two promises (the kitchen threshold, the
  woodshed corner) are **deleted mechanically**; the re-voice plan (ADR-185) rewrites
  that beat properly when it runs.
- **A side quest MAY gate a rung-up (human, 2026-07-12).** The field margins and the
  weir reeds hold the only `tanuki` and `river_rats` on the estate, and fights are
  spatial — so R3→R4's kill requirements now depend on two side-quest VNs having
  fired. That is the design, not a defect: *"you unlock zones incrementally as you
  play … making these side quests a mandatory requirement for rung-up is fine. You
  don't have to force-feed players."* The **only** failure mode is an **obtuse
  trigger**, so every reveal fires from labour the player is already doing at that
  rung (and which the sim bot's own requirement-driven route reaches — the arc is
  the proof).
- **Consequences.**
  - **A gate, not a norm** (`verify-content`): `room-*` ids per rank's
    `rewardOnReach.unlock` — **>2 is RED**. Mechanically exact, so it cannot cry wolf.
  - **`core/reveals.ts`** — the AC-20 glue that enqueues each reveal VN from the
    settle pass, beside `worksPass`. Each scene sets its zone's fact-flag on **every**
    decision option (the `works-intro` pattern): the pick colours the relationship,
    never the map.
  - **The derived reveal re-arm** (`unlock.ts`): a `room-*` id latched in `seenReveals`
    but no longer visible **drops out of the latch**, so a re-mapped zone re-announces
    with its new ceremony instead of silently re-granting. Zero new save fields;
    self-healing for every future re-mapping.
  - **Cooking is SITED** (human: *"kitchen-only cook"*): `cook_meal` — the only mend
    for a fought body — now needs a **cook locus**, the kitchen board or your own
    hearth ([ADR-120](#adr-120)'s `homesCook` belonging, which until now bought a
    button for a verb that already worked everywhere). That walk is what makes the
    kitchen a place.
  - **The announce is an open diverge** (human: *"diverge and implement both"*): the
    VN's prose alone (shipped default), or the VN plus a map-ink line — DEV-toggled,
    HR-32b.
- **Record:** the plan
  [`project/archive/fable-2026-07-11-zone-rung-rebalance.md`](../../project/archive/fable-2026-07-11-zone-rung-rebalance.md)
  · FB-407 / FB-408 / FB-409 · builds on **ADR-177** (the fiction causes the unlock —
  `room-weir`) and **ADR-179** (visibility is DERIVED, never stored) · **TST3** (the
  fiction causes the mechanics) · the story wave rides **ADR-139** (3+ blind takes) and
  **ADR-135** (the two-pass scorecard).

### ADR-185 ✅ — the register ruling: a 14–21 audience, a clarity floor, Genemon's two voices, the MC's inner line (HD-38)

- **created_date:** 2026-07-12
- **Context.** The human's steer (2026-07-11, canon per ADR-022): *"a nice and
  easy to read story narrative to follow that makes sense and is engaging, like a
  captivating light novel, for the target audience of age 14–21."* The built T0
  prose reads dense — Genemon at the R0→R1 rung-up flagged by name. A register
  audit ([`project/audit/reports/2026-07-11-t0-narrative-register-audit.md`](../../project/audit/reports/2026-07-11-t0-narrative-register-audit.md))
  found the difficulty is **mandated, not accidental**: §0.5.1's *"when in doubt,
  cut: the empty space is load-bearing"*, executed at full density, produces
  ellipsis and withheld referents on nearly every line. The prose is good; it is
  written for a 25-year-old. The project had **no audience statement anywhere** —
  not in the PRD, not in the bible — so every story diverge to date scored against
  a bar that never mentioned readability. HD-38 put the four direction forks
  (D1–D4) to the human; this ADR is the ruling.
- **Decision (human, 2026-07-12 — HD-38).** Four rulings, all adopted:
  1. **D1 · The audience is canon, and the floor is an OUTCOME test.** §0.9.6 locks
     the 14–21 / light-novel reader. §0.5.5 is extended from mystery lines to **all**
     fiction text: every line parses as scene logic on FIRST read. §0.5.1 is reworded
     so *"cut"* means **say less**, never *make the reader assemble the sentence*.
     **The proposed per-scene device quota — one inversion, one litotes, one verbless
     fragment — was REJECTED** (agent recommendation, human agreed): it misdiagnoses.
     The disease is **inference load**, not grammar — *"Water first, always."* is a
     verbless fragment and perfectly clear, while *"You are learning the house's true
     size by what it will let itself be seen without."* is a well-formed sentence and
     a wall. A quota is also unenforceable and gameable (spend your one inversion,
     feel licensed). The teeth is instead the **blind paraphrase pass**: a fresh
     reader states each paragraph's WHAT cold; a WHAT-failure or a second read is a
     **redline**, not a taste argument. Deliberately a scorecard rung, **not** a
     `verify` gate — a lint cannot judge parseability without crying wolf (AC-11).
     **Binds all new fiction immediately**, T1+ included; only the *re-voicing work*
     is scoped to T0.
  2. **D2 · Genemon has two voices.** *Item, count, condition* is rationed to his
     **book voice** (what he reads off the page or writes into it) — which is what
     finally makes it MEAN something: when he clips, you hear the ledger. His **man
     voice** (explaining, instructing, negotiating, answering) is plain complete
     sentences, which his readable half already speaks. This is a **gain, not a
     compromise** — and it restores cast-sheet compliance for free: the shipped works
     pages run wall-to-wall on an extended land-ledger metaphor from the man the sheet
     says *"has never in his life reached for a metaphor."* That text is **off-spec
     against canon that already existed** (PH2: the build and the doc disagreed; the
     build was wrong), so rewriting it is a bug fix, not a taste change.
  3. **D3 · The MC gets an inner line — bounded.** Narration may carry his
     **attention and intent** (what he notices, weighs, wants, fears, decides not to
     say); §0.5.2's *"plainest voice"* binds his SPEECH and never bound the narration.
     Two bounds, both load-bearing: **never MEMORY** — he remembers nothing, recall is
     the **dream's** job on the dream's cadence (§0.5.4, the metronome to T3), and an
     interior line that lets him remember cannibalizes the dream, the T3 reunion, and
     every misreading in the cast at once — and **things, counts, withheld actions,
     never adjectives about feelings**. No per-scene quota (the D1 argument applies
     again).
  4. **D4 · Worst-first, then a full sweep.** Five targeted waves clear the acute
     pain (Terms scene → works pages → gloss/collisions → Intro 1 → medium scenes +
     the interiority thread), then a **full-T0 sweep** carries the rest of the tier to
     the floor so no register seam is left between old and new text.
- **Also locked — §0.5.8, person.** *"You"* is what you live (all narration + the
  MC's interior lines); **third person is reserved for the OVERHEARD register** — the
  house talking *about* you, where you are not addressed, until R7 writes your name.
  The corpus currently mixes them **inside a single scene** (*"The river gives you up
  at the weir"* … *"He turns it for as long as the water allows"*), which is a defect.
- **Two audit findings this ADR OVERRULES** (checked against source this session, PH2):
  - **The R0 reward lines stay third-person.** The audit read them as an R0 misstep
    and proposed flipping them to second person. They are not a misstep: **every** rung
    reward line, R0 through R7, is third-person overheard speech — it is the device
    that makes the R7 naming land. The human confirmed the R0→R1 flag was the **Terms
    speech** (the R1 beat, which fires at that rung-up), not these lines.
  - **The cold open does not need re-leading.** The audit says it *"leads with the
    dream inventory"*; the authored order is `lede → weir → wake → dream` — already
    concrete-first. The real burden is **Intro 1**, which replays the dream verbatim
    and then makes the game's **first choice** a pick among three abstractions.
- **Consequences.** No story changes: kernel, spine, scene structure, motives and the
  naming arc all stand. No tone change: no modern slang, no softening, no explained
  mystery — the fix is **syntax and information delivery**. Restraint survives as a
  *value* ("say less"), not as a per-line default. The U9 ambient pool and the season
  turns are the **calibration set**, not targets — they already hit the bar, which is
  the proof that voice and readability coexist here.
- **Record:** HD-38 (the four forks, ruled 2026-07-12) · the audit report above · the
  plan [`project/archive/fable-2026-07-11-t0-narrative-revoice.md`](../../project/archive/fable-2026-07-11-t0-narrative-revoice.md)
  (Wave 0 = this ADR; the waves are D4) · amends story-bible §0.5.1, §0.5.5, §0.5.8
  (new), §0.9.6 (new), and `04-cast.md` (Genemon, the MC) · rides ADR-139 (story
  diverges) + ADR-135 (the two-pass scorecard) · ADR-022 (the human's steer is canon;
  where the bible disagreed, the bible was what was wrong).

### ADR-187 ✅ — you may sleep the day away, but only in a bed you own: the day-skip is a HOME verb, and an idle day is a hungrier day

- **created_date:** 2026-07-12
- **Context:** **FB-408** (human capture, 2026-07-11, standing at the gate on a
  non-market day): *"What are the market days, are they frequent enough? Should we
  implement a wait a day button?"* — asked in a zone whose only content (Yohei's
  stall) is elsewhere in **time**, not in space. Its siblings FB-407/FB-409 name the
  same itch from the other side: rungs where a zone holds nothing to DO right now.
  Time in this game moves **only through acts** (`advanceClock`, `TICKS_PER_ACT = 2`
  against `TICKS_PER_DAY = 24` — twelve acts to a day); there is no wall-clock idle
  (PRD §6.9). So "wait three days for 水" today means "grind twelve acts of filler,
  three times" — which is exactly the complaint. The option map (A–F) lives in the
  plan [`fable-2026-07-11-wait-a-day.md`](../../project/archive/fable-2026-07-11-wait-a-day.md).
- **Decision (human, signed 2026-07-12 over the option map):** ship **option D
  alone** — a **`sleep` verb, sited at your woodshed corner**, that ends the day and
  wakes you at dawn. **One press = one day boundary, always** (three presses to reach
  水 from 日; no multi-day jump, no "skip to the next market morning" button). The
  agent's proposed **D + F** pairing is **rejected**: the gate grows no wait button.
- **Sleep is a HOME verb — R4+, and R1 is deliberately left unserved.** The verb is
  gated on `panel-home` at the `woodshed` node, which
  [ADR-184](#adr-184--the-zone-reveal-law-a-zone-opens-only-in-a-vn-a-rung-up-vn-opens-at-most-two)
  put at **R4**. So the player who ASKED for this (FB-408, at R1) does not get it —
  **on purpose**, and it is not a hole in the design: ADR-184 already signed the
  fiction that makes it inevitable — *"R1 never says where you sleep — you are a
  nobody; you have no bed."* **A man with no bed cannot sleep the day away.** The
  offered alternative (a rough sleep anywhere from R0, mirroring the FB-402/FB-409
  open-rest law) was **considered and declined**: it would buy the R1 player a lever
  at the price of the one thing R4's corner is *for*. The R1–R3 empty-zone itch is
  therefore answered by **content**, not by a skip — that is the sibling plan's job
  (the zone-rung rebalance, ADR-184), and it is the correct lever.
- **What a slept day COSTS — an idle day is a hungrier day.** The plan claimed the
  existing day-boundary sink was price enough; **it is not**, and the claim was
  checked rather than trusted: `HUNGER_MEAL_RESTORE (25) == HUNGER_PER_DAY (25)` by
  design (a stocked kura *maintains* the belly), so on a full kura a skipped day
  would cost **3 shō and nothing else** — near-free. The human ruled for **teeth on
  both levers**:
  1. **You earn nothing.** Sleep forfeits every remaining tick of today and wakes you
     at dawn, so the acts you would have worked are simply gone. Sleeping early in
     the day throws away more — the verb prices itself, with no new constant.
  2. **The house still eats.** The day boundary draws its `CONSUMPTION_SHO_PER_DAY`
     from the kura exactly as it does on a worked day. Sleeping through a lean winter
     empties the stores that were feeding you.
  3. **You slept through the pot.** On a **slept** boundary the household's ration
     restores only a **fraction** of the belly it would have (`SLEEP_MEAL_FRACTION`,
     a SIM-OWNED SEED at 0.5 — the human tunes it in the balance cockpit, ADR-134):
     you were not at the pot when it was served. The belly therefore **slides on a
     run of sleeps** — into [ADR-178](#adr-178)'s teeth (a hungry body rests poorly
     and works slowly), which is precisely where a skip-spammer should land.
  4. **Sleeping is not resting.** The verb grants **no body refill** — `rest` (2
     ticks, `restRefill`) remains the only thing that puts the body back, and stays
     strictly the more efficient way to get it. Sleep buys **time**, and only time.
- **Sleep is INSTANT (ADR-148), not a timed bar.** Option C — a 20–30 s "waiting"
  bar — is rejected outright: it converts dead *game* time into dead *real* time,
  which is strictly worse than playing and breaks the active-only contract (PRD §6.9).
  The safety is not a delay, it is **legibility**: the button's forecast reads the
  exact price (shō drawn, belly lost) through the **same selector the reducer
  applies** (AC-6), so nothing about a slept day can surprise.
- **The balance sim stays SKIP-BLIND (standing ruling).** The greedy persona does
  **not** learn to sleep: `docs/content/t0-pacing.md`'s bands go on measuring **real
  play**, and a convenience the sim doesn't model cannot drag a rung under the signed
  3-minute floor. This is deliberate insulation — it is what keeps this build from
  stalling on a band violation the way the kitchen-pot siting did (HD-40). A
  regenerated, **byte-identical** `t0-pacing.md` is the proof the ruling held.
- **Consequences.** Time gains a second way to move — the first that is not an act —
  so the clock contract (PRD §6.3) grows one intent. The 水・土 market rhythm survives
  intact: the only way to reach a market day early is to own a bed, sleep, and pay for
  each dawn in rice and hunger. Seasons stay **manual** (`advance_season`) — a sleep
  never crosses a season boundary. **Non-goals:** no wall-clock/offline time, no
  season skip, no gate wait-button.
- **Record:** FB-408 (the capture that asked) · the plan's option map A–F ·
  ADR-184 (the bed you do not have at R1) · ADR-178 (the belly's teeth this rides) ·
  ADR-163 (the day-boundary ration it prices against) · ADR-148 (the instant/timed
  taxonomy) · ADR-132/ADR-134 (the seed is the sim's and the cockpit's, not
  hand-tuned) · AC-6 (forecast == reality).
