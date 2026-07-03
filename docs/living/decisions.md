# Decision Log (ADRs)

> **A live, append-only ledger** (it grows, so it lives in `docs/living/`, not in a "history" folder).
> **Precedence:** when a living doc and an ADR disagree on *current state*, the **living doc wins** (fix it
> if stale); on *why* a thing is the way it is, the **ADR wins**.

Append-only record of **locked decisions** and *why*. One entry per decision, numbered `D-000…`,
**IDs never reused**.

**Status:** ✅ Decided · 🛠 In design · ⏭ Deferred · ⛔ Reversed · 🔁 Amended (a clause superseded; the core decision holds — see the entry's note)

**Dating:** every entry carries a **`- **created_date:** YYYY-MM-DD`** first bullet (the day it was locked).
With newest-steer-wins, the date is what disambiguates which call is current when two ADRs touch the same
ground. *(Dates D-001…D-074 were backfilled 2026-06-29 from git first-appearance history.)*

**Reversing a decision:** don't delete it. Mark the old entry `⛔ REVERSED by D-XXX ({date})`, strike
its claim with `~~strikethrough~~`, and add a new ADR with the new call. History stays intact.

> Resolved [`human-in-the-loop`](../../project/human-in-the-loop/decisions.md) `H`-items graduate into ADRs here.

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

### D-001 ✅ — Grounded, non-magical story; mundane cause for the amnesia
- **created_date:** 2026-06-25
- **Context:** The README seeds an Edo-era incremental RPG where a 17-year-old farmhand wakes amnesiac on a samurai estate. An early AI-generated design leaned magical (a tengu spirited the protagonist away; an otherworld trained/altered them). The human rejected this.
- **Options:** (A) Magical/folkloric truth (tengu, spirits) · (B) Soft isekai / reincarnation · (C) Fully grounded, mundane human truth.
- **Decision:** **(C)** The protagonist's amnesia and the whole mystery have ordinary, human causes (blunt head trauma + near-drowning + exposure from a flood). No tengu, spirits, reincarnation, isekai, or magic anywhere in the canon.
- **Why:** The human wants a grounded story; magic undercuts the intended tone and the earned-competence fantasy (D-003).
- **Consequences:** Every mystery must resolve to a human/natural cause. Story bible is the grounded spine in [`brainstorms/2026-06-25-grounded-story-spine.md`](../../project/brainstorms/2026-06-25-grounded-story-spine.md). The original magical framing is archived as superseded.

### D-002 ✅ — Pure Edo folk-mystery tone; folklore as believed-atmosphere only
- **created_date:** 2026-06-25
- **Context:** The setting is rich in folklore (kamikakushi, yokai, kami). We need a rule for how it appears given D-001.
- **Options:** (A) Folklore literally real · (B) Folklore as belief/atmosphere with human causes · (C) No folklore at all.
- **Decision:** **(B)** Folklore appears only as what people *believe and fear* (superstition, rumor, ritual). Every folk-belief resolves one-to-one to a human/natural cause (a "kappa ford" is an undertow + a smugglers' sinking-spot, etc.). A thin margin of unresolved *ambiguity* is allowed for unease, but never confirmed magic and **never magic powers for the player**.
- **Why:** Keeps the world authentic and respectful (folklore as grief-coping/cover) while honoring D-001.
- **Consequences:** Maintain a belief→cause table for every yokai; debunk with dawning dread, not gotchas; cap residual ambiguity (≤1 unresolved token per playthrough) and keep it mundane-readable.

### D-003 ✅ — Mediocre-start protagonist; growth only through perseverance
- **created_date:** 2026-06-25
- **Context:** A core character-fantasy decision. The early design implied the protagonist was secretly capable (combat skill from otherworld training).
- **Options:** (A) Secret talent / hidden power / bloodline · (B) Genuinely ordinary, gets strong only through effort.
- **Decision:** **(B)** The protagonist starts as a normal, average, even mediocre 17-year-old farmhand with **no hidden power, talent, or training**. All growth comes from perseverance, repetition, training, and refusing to quit. The first real fight is humbling/near-fatal and motivates training.
- **Why:** The zero-to-competent-through-effort arc *is* the core fantasy, and it maps perfectly onto the incremental grind (every number is earned sweat).
- **Consequences:** **Systems guardrail:** no returning memory or instinctive habit ever grants a starting stat, recipe, or combat bonus — every number starts at the bottom. Combat capacity is gated behind labor-built conditioning. The talent-foil antagonist (Hanzaki) must be shown as *trained*, not innately gifted, so the "effort > talent" thesis is never undercut.

### D-004 ⛔ REVERSED by D-007 (2026-06-25) — One grounded diegetic late-game reset (no magical prestige)
- **created_date:** 2026-06-25
- **Context:** Incremental games use prestige/resets for a long tail; we need one that fits a grounded single-player story.
- **Options:** (A) No reset (linear ending) · (B) One diegetic, grounded reset carrying meta-progress · (C) Classic repeatable magical/abstract prestige loop.
- **Decision:** ~~**(B)** A single, grounded, story-justified reset late-game — a season-cycle time-skip in which the veteran protagonist starts a bigger venture (re-founding the drowned hamlet / accepting estate stewardship and teaching others). It carries hard-won skill, reputation, recipes, tools, and relationships forward as meta-progress and a teaching/management layer. **Not** reincarnation or a magic time-loop.~~ **REVERSED:** the game now has **no reset of any kind** — the five estate-restoration **tiers (T0–T4) replace prestige** and everything persists. See **D-007**.
- **Why:** ~~Gives the genre's long-tail loop without betraying the grounded, no-magic canon; makes "effort over talent" literally generational.~~ The tiered estate-rise spine supplies the long tail diegetically without a soft-restart; a reset (even meta-carrying) would re-cost earned progress and clash with the persistent house-restoration arc.
- **Consequences:** ~~Save schema must carry meta-progress across the reset. Pick one canonical-default branch (recommend re-founding Kuzuhara) with identical carry-over so neither branch reads as lesser.~~ No reset code-path or reset save-schema; progression is the per-tier ladder of D-007.

### D-005 ✅ — Working title: *Kamikakushi*
- **created_date:** 2026-06-25
- **Context:** Need a working title for the repo/build; revisitable before launch.
- **Options:** *Kamikakushi* · *Mizuho* · *The Borrowed Year* · defer.
- **Decision:** **Kamikakushi** (神隠し, "spirited away") — the *village's superstition* for the protagonist's arrival; the truth is mundane and human.
- **Why:** Folklore-accurate, evocative of the core mystery, and thematically ironic (the comforting lie the story dismantles).
- **Consequences:** Low-stakes/reversible; finalize before the itch.io deploy.

### D-006 ✅ — Protagonist identity: true name *Tahei*; male; fixed (no rename)
- **created_date:** 2026-06-25
- **Context:** PRD §1 left the protagonist's true name and customization open. The synthesis used "Ren" (flagged by the authenticity pass as faintly modern for an Edo peasant). The legend's gender-drift clue — the village misremembers the real lost child (Tama, a girl) as a boy — depends on the protagonist's gender.
- **Options:** Name: *Tahei* / *Ren* / *Kichizō* / *Sutekichi*. Customization: fixed name · player picks true name · player picks name + gender.
- **Decision:** True name **Tahei** (a plain, period-typical commoner name), revealed in **Act 4**; the borrowed village-name **"Tama"** is used until then; the protagonist is **male with a fixed name — no player rename**.
- **Why:** *Tahei* reads grounded and humble for a poor porter (Ren felt modern). A fixed gender protects the load-bearing gender-drift clue; a fixed name keeps the late-reveal beat authored and impactful.
- **Consequences:** Dialogue/story is authored around the "Tama" → "Tahei" reveal; no name/gender customization UI. The brainstorms story-spine doc drafted the placeholder "Ren" — read it as "Tahei".
- **Amendment (2026-06-25):** Identity is now a **side thread**, not a load-bearing act-spine beat. Kept: fixed **male**, **no rename**, true name **Tahei**. Changed: the true-name reveal is a **late, de-emphasised side beat** (no longer an "Act 4" climax), and the protagonist age band is **~18–20** (was "17"). The estate-restoration spine (D-007), not the identity mystery, carries the late game.

### D-007 ✅ — Estate-restoration spine + five tiers replace prestige (no reset)

> 🔁 **Amended 2026-06-28 by [D-048].** The "five tiers / T0–T4" enumeration + tier→number map are superseded by
> the **6-tier reshape** (T0 tutorial + T1 full-estate split out; Village/Region/Castle/Edo shift up; v1 = T0→T3).
> The estate-spine-replaces-prestige / no-reset core is unchanged.
- **created_date:** 2026-06-25
- **Context:** D-004 had committed to a diegetic late-game reset for the incremental long tail. The session-02 lock reframed the whole game around restoring a lower-samurai house, which supplies the long tail without a soft-restart.
- **Options:** (A) Keep the diegetic reset (D-004) · (B) Tiered estate-restoration spine with everything persistent · (C) Classic abstract prestige loop.
- **Decision:** **(B)** The spine is an **estate-restoration incremental RPG**: rise the **Kurosawa** lower-samurai (*goshi*) house's ranks and grow House Influence to restore **and surpass** the house, climaxing in indirect/mediated recognition at Edo. Progression runs through **five tiers** — **T0 Estate** (tutorial) → **T1 Village** → **T2 Region** → **T3 Domain/Castle-town** → **T4 Edo** (national) — each gated by a **story transition**: T0→T1 = enough estate work + basic repairs → sent out into the village; T1→T2 = "clean your room" (estate healthy, village happy, fires out) → lord believes wider impact is possible → grow regional influence (Region introduces rival houses to surpass); T2→T3 = win the region (rivals dethroned) → castle-town rulers confer regional leadership and invite the house; T3→T4 = a "taste of Edo" — house forced to build & fund an Edo estate → conquer the castle-town → national tier. **Tiers REPLACE prestige; there is NO reset of any kind — everything persists.**
- **Why:** The tiered rise gives the genre's depth diegetically, keeps every earned number permanent, and lets "effort over talent" play out as a continuous restoration arc rather than a re-cost.
- **Consequences:** Reverses **D-004**. Save schema is monotonic/persistent (no reset path). Castle-town takeover is multi-route (peaceful office/economy/marriage/out-maneuvering AND assertive martial-security), and "take over" = become the dominant house holding key domain offices — never open rebellion against the bakufu.

### D-008 ✅ — Three starter factions + four-pillar House Influence with per-tier required-pillar gating

> 🔁 **Amended 2026-06-28 by [D-048] (+ D-028/D-049).** The per-tier *required-pillar-weighting* prose is
> superseded by **one pillar per tier** (Estate→Arms→Office→Name) + the hybrid grade-gate. The four-pillar
> resource, jump+seasonal accrual, and the trade ≤⅓ cap are unchanged.

> 🔁 **Re-scoped 2026-07-02 by [D-107].** "House Influence (家威)" is now re-expressed as the
> **koku STANDING** score (a kokudaka-like prestige score, never spent — NOT a currency); the
> **trade ≤⅓** clause survives as a **COIN**-lane cap (the Estate & Wealth land/treasury/trade
> sub-engines yield RICE + COIN, not koku). The four-pillar achievement structure holds.
- **created_date:** 2026-06-25
- **Context:** Need a faction structure and a macro-resource that drives tier progression without letting any single sub-engine (especially trade) dominate.
- **Options:** Influence as one pooled number · trade-led economy · **multi-pillar achievement resource**; factions as one estate org vs. several parallel tracks.
- **Decision:** **Three starter factions (T0–T2):** **Estate** (the Kurosawa household — a **fresh rank ladder per tier**, rungs interleaving labour & combat, cast & buildings grow per tier as light flavour systems, not a people-management sim) · **Village of Asagiri** (a reputation **web**: chief Yagoemon, shops, artisans, inn & rumours board; mostly static; never gates the spine) · **Origin** (a memory-gated **support** track — see D-009). The macro-resource is **House Influence (家威)** as **FOUR achievement-driven pillars**: **Arms (武威)** · **Estate & Wealth (家産)** · **Standing & Office (政威 → superseded by 官威 *kan'i* at the §5 authenticity pass, 2026-06-25)** · **Name & Honour (家格)**. **Trade is demoted to 1-of-3 capped sub-engines** inside Estate & Wealth (land / treasury / trade), **hard-capped to ~⅓ of that one pillar**. **Accrual = achievement JUMPS + seasonal JUDGED RESULTS** (harvest, seasonal appraisal) — never a passive time-trickle, never a flat per-action increment. **Up-only with rare, scripted, recoverable dents** (scandal/called debt) — **never a wipe**. **Tier gating = per-tier required pillars** (early tiers weight Arms + Estate; upper tiers weight Office + Name). Side factions are **multipliers** into the pillars, never new pillars.
- **Why:** Multiple pillars force a portfolio play (you can't trade your way to Edo), achievement-driven accrual keeps Influence feeling earned rather than idle, and per-tier required pillars shape the difficulty curve from "survive & get strong" to "win it socially."
- **Consequences:** Implement four pillar accumulators with the ⅓ trade cap and a seasonal judging tick; required-pillar thresholds become the data behind the D-007 tier gates; dents are scripted, recoverable events with no permanent loss.

### D-009 ✅ — Origin faction = the protagonist's living family & friends at Sawatari-juku

> 🔁 **D-048 renumber (2026-06-28):** Region is now **T3** — read "opens at T2 Region" as T3. Access-only/no-power
> + the Region payoff (D-055) are unchanged. (Origin is a *faction*, not a pillar — unaffected by the pillar map.)
- **created_date:** 2026-06-25
- **Context:** The origin/family thread needed a concrete cast and a place in the tier structure, and a rule to keep it from short-cutting the grind.
- **Options:** Origin as a backstory flashback only · a mechanically rewarding home-town faction · an **access-only living support track**.
- **Decision:** The Origin faction is Tahei's **living** family and friends in the fictional post-town **Sawatari-juku**: father **Kuranosuke**, mother **Oyuki**, sister **Okimi**, employer **Denbei**, friend **Kanta**, sweetheart **Ohana** (plus the porter guild). It **opens at T2 Region**; the recurring **dream foreshadows it from early game**; they **support** his estate achievements (pride, allies, trade-ties) but the track is **access-only with ZERO mechanical gift** (memory grants access, not power — consistent with D-003).
- **Why:** Gives the personal mystery a warm, grounded payoff that lands at the Region tier without handing the player a power spike, preserving the mediocre-start fantasy.
- **Consequences:** Cast and Sawatari-juku content unlock at T2; the early-game dream is foreshadowing only; no stat/recipe/combat bonus flows from the Origin faction — only narrative access and faction-as-multiplier flavour.
- *(Names later refined — decision unchanged: father **Kuranosuke → Jinpachi**; sweetheart **Ohana → Osen** (renamed to disambiguate from lost-child **Otsuru**). See canon / PRD §1.5.3 for current names.)*

### D-010 ✅ — Indirect/mediated Edo ceiling: the national banzuke ranks the house, not the man

> 🔁 **D-048 renumber (2026-06-28):** Edo is now **T5** (the reshape adds a tier; the *banzuke* finale is T5 Edo,
> beyond v1's T0→T3). The indirect-ceiling decision is unchanged.
- **created_date:** 2026-06-25
- **Context:** The Edo finale needed a ceiling that fits a grounded lower-samurai story — no fantasy ascension for the protagonist personally.
- **Options:** (A) Personal rise to hatamoto/shogun proximity · (B) **Indirect/mediated recognition of the house** · (C) No national tier.
- **Decision:** **(B, reaffirmed in the new tier context)** The Edo finale is a **national multi-pillar *banzuke* ranking of the HOUSE** across all four pillars. The MC remains the **architect** of the house's rise; there is **no personal hatamoto/shogun ascension**. This restates and keeps the prior D-010 intent — reconciled, not duplicated.
- **Why:** Keeps the story historically grounded and thematically about the house's restoration rather than a personal power fantasy; the banzuke framing makes the four pillars legible as the finale scoreboard.
- **Consequences:** The T4 endgame UI is a house banzuke on the four pillars; no personal-rank ascension mechanic; trade is a supporting thread, out of the finale spine.

### D-011 ✅ — Combat is a first-class pillar that earns House Influence
- **created_date:** 2026-06-25
- **Context:** Earlier framing held "combat is never a source of standing." The locked design makes combat a core pillar that feeds the Arms pillar via martial security.
- **Options:** Combat as flavour with no standing · combat as a parallel-but-isolated track · **combat as a first-class earner of Influence**.
- **Decision:** Combat is a **first-class core pillar that EARNS House Influence** through the **Arms (武威)** pillar / martial security (clear bandits, secure roads, defend the estate) — this **supersedes the old "combat is never a source of standing" framing.** The **mediocre-start is preserved on the combat track** (start weak; humbling first fight; earned via training; no hidden edge; no labour→combat cross-feed). *(no-cross-feed **RELAXED → bounded per-skill capped bonus** by **D-022/Q6**.)* **Failure = soft setback** (lose HP/time, maybe drop carried loot or take an injury to rest off) — never lose levels/gear/permanent progress. **Mobs are grounded** (boars, wolves, monkeys, bandits, ronin, smugglers) — **NO belief-creatures in grindable spawn tables**; any "yokai" is a misread human/animal surfaced through optional rumour quests. Martial scale is hard-capped (a small retinue, never a standing army).
- **Why:** Combat is too central to be standing-neutral; routing it through the Arms pillar makes martial security a legitimate, balanced path to House Influence while honouring the grounded, mediocre-start, no-magic canon.
- **Consequences:** Arms-pillar accrual hooks into combat achievements; spawn tables exclude belief-creatures; loss is a soft setback only; combat conditioning is earned independently of labour.

### D-012 ✅ — Structure & scope: fresh ladder per tier, full maps every tier, v1 = Tiers 0–2

> 🔁 **Amended by [D-048] + [D-032].** "v1 = Tiers 0–2" is now **v1 = T0→T3** (D-048 re-maps Estate→T0 tutorial
> + T1; Village = T2, Region = T3 — same content, not a scope change); "~4 quest types" is superseded by
> **D-032** (no fixed quest budget). Fresh-ladder-per-tier + full-maps-every-tier hold.
- **created_date:** 2026-06-25
- **Context:** Need to pin the progression structure and a shippable v1 cut without over-scoping.
- **Options:** One ladder across all tiers vs. **a fresh ladder per tier**; partial vs. full maps; ship all tiers vs. **a T0–T2 v1**.
- **Decision:** A **fresh rank ladder per tier**; **full explorable maps at every tier**. **v1 = Tiers 0–2 complete** (Estate + Village + Region, incl. the T2 personal-mystery payoff); **T3 Castle-town = a stub cliff-hanger**; **T4 Edo = roadmap.** **Lean within** each tier: ~8-rung early ladder, ~5 mobs, ~4 quest types, a ~6–8-node world cut-set (rest parked as "later").
- **Why:** A per-tier ladder keeps each tier a fresh climb (matching the fractal-incrementality goal); full maps make every tier feel real; the T0–T2 cut is the smallest slice that delivers the spine plus a satisfying payoff.
- **Consequences:** Build ladder/map/mob/quest data per tier; T3/T4 are scaffolded but not content-complete in v1; integration applies the locked-rule fixes (no belief-creatures in spawn tables, ≤1 ambiguity, no permanent loss, no labour→combat cross-feed, fictionalise real names, cap martial scale).

### D-013 ✅ — Tech & presentation: Vite + TS + Vitest, pure-core, IndexedDB save, active-only, static itch.io

> 🔁 **Amended.** "single autosave" → multi-backend redundant save (**D-030**) + crash-recovery ring (**D-044**)
> + dev-save wipe (**D-067**); the "no asset pipeline" art claim is refined by **D-018/D-041** (bundled OFL fonts
> + inline-SVG motifs). Active-only is reaffirmed by **D-079** (which corrects D-053's wall-time wording to active-only-**pause**). Core stack + pure-core + IndexedDB hold.
- **created_date:** 2026-06-25
- **Context:** Need to lock the stack, save strategy, time model, and presentation for a static, backend-free single-player browser game.
- **Options:** Framework vs. vanilla; localStorage vs. IndexedDB save; offline progress vs. active-only; hover-rich desktop vs. responsive desktop+mobile.
- **Decision:** **Vite + TypeScript + Vitest.** Architecture = **pure-core (no DOM/canvas imports) + a thin DOM renderer consuming plain data + one seeded RNG** (persisted). **Static build for itch.io** (no backend). **Save = IndexedDB** (robust, durable, static-friendly) **+ base64 export/import to file**, **single autosave**, **versioned minimal-state** (recompute derived on load). **Responsive desktop + mobile, NOT hover-dependent.** **Active-only — NO offline progress**; an **abstract clock advanced by active play** (days/seasons drive harvest/weather/festivals + the seasonal Influence results). **Art = text + emoji + CSS** (woodblock palette, kanji season tags, colour-coded rarities). **Multi-screen UI with screens/nav progressively revealed.** **Launch = free / pay-what-you-want on itch.io.**
- **Why:** The pure-core boundary keeps logic deterministic and unit-testable (the project's top architectural rule); IndexedDB + export survives a static host without a backend; active-only keeps the clock honest and the balance tractable; the text/emoji/CSS art keeps scope lean.
- **Consequences:** Enforce the no-DOM-in-core boundary; persist the seeded RNG and a versioned minimal save; build a save-migration path; the renderer is swappable; no offline-progress accounting; one tuned difficulty (no modes).

### D-014 ✅ — One antagonist per tier (not a single cross-tier racket)

> 🔁 **D-048 renumber (2026-06-28):** the antagonist list is keyed to the old 5-tier ladder — re-map onto the 6
> tiers. The "one grounded antagonist per tier" decision holds.
- **created_date:** 2026-06-25
- **Context:** Earlier world-building leaned on a single cross-tier smuggling/racket conspiracy. The locked design wants an escalating, grounded antagonist scaled to each tier.
- **Options:** (A) One cross-tier conspiracy throughout · (B) **One antagonist per tier, escalating** · (C) No recurring antagonist.
- **Decision:** **(B)** **ONE antagonist per tier** (Estate / Village / Region / Castle-town / Edo), each **escalating, grounded, and revealed incrementally** (the world-expansion cast — Magobei / Hanzaki / Kuroiwa / rival house **Tomita** / an Edo factor — is repurposed across tiers, with at most a light optional connective thread). The **estate's decline is a simpler debt/misfortune, NOT conspiracy-linked.** **Two rival samurai houses** contest the Region (Tomita + one more). **Justice is partial:** the *osso* over-the-head petition (historically deadly) — an **ally / *gimin*-martyr NPC bears the risk**; reachable culprits answer, the truly powerful largely escape.
- **Why:** A per-tier antagonist scales tension with the player's growing reach and avoids a single conspiracy straining credibility across five tiers; partial justice keeps the tone grounded and bittersweet.
- **Consequences:** Author five tier antagonists with incremental reveals; keep the estate-decline cause mundane and unlinked to the racket; model the osso risk as falling on a gimin ally; any cross-tier thread stays light and optional.

### D-015 ✅ — Core-loop & content discipline: the MC's own actions; no people-management sim; one ending + free-play
- **created_date:** 2026-06-25
- **Context:** Need a rule for what the minute-to-minute game *is*, how quests read, and how to keep scope lean and the ending coherent.
- **Options:** Management/builder sim vs. **classic-RPG self-action loop**; waypointed quests vs. open-ended; multiple endings vs. **one authored ending + free-play**.
- **Decision:** The **core loop = the MC's OWN actions** (combat, skills, jobs, crafting) — meta (Influence/tiers/ranking) sits above and is fed by his grind; **NO people-management sim** (building/recruiting/teaching are flavour/light systems, not a minigame). **Quests are open-ended and NON-hand-holdy** (a suggestion + a story you find in the world, never an A→B→C waypoint list); the dominant minute-to-minute behaviour is the incremental grind. **Fractal incrementality** — every new zone/area/faction/skill/rumour is itself incremental and *everything unlocks*. **Lean / high-impact** — no fluff or half-features; when scope balloons, **split into "immediate" vs a parked "later"** bucket (park, don't delete). **Relationships are narrative-only** (no dating-sim). **One carefully-tuned difficulty** (no modes). **One authored ending** (house restored & ranked) + **post-game free-play** (no reset); branches are in *how* you got there (allegiance / takeover route), not separate endings.
- **Why:** A self-action RPG loop is the proven incremental core and keeps the player as the protagonist rather than a manager; open-ended quests and fractal incrementality preserve discovery; the lean discipline and single ending keep v1 shippable and coherent.
- **Consequences:** No management-sim subsystems; quests are authored as suggestion+world-story, not waypoint chains; maintain an "immediate vs. later" scope split; one ending with route-flavoured variation; free-play continues after the ending with no reset (consistent with D-007).

### D-013a ✅ — §6 tech architecture & data model (elaboration of D-013)
- **Context:** D-013 fixed the stack; §6 elaborates it into concrete engine contracts, the RNG scheme, and the save/migration model. Recorded as an elaboration (not a reversal) of D-013.
- **Options:** Ad-hoc state mutation vs. **explicit reduce/tick contracts**; `Math.random` vs. **one named-substream seeded PRNG**; localStorage vs. **IndexedDB**; full-state save vs. **versioned minimal-state**; stored vs. derived `tier`; best-effort vs. **ordered forward migrations**.
- **Decision:** **Pure core** exposes two pure contracts — **`reduce(state, intent)`** (player actions) and **`tick(state, dt)`** (time advance) — returning new plain-data state the thin renderer consumes. **Content is data** in typed registries (mobs, quests, rungs, recipes, rumours, NPCs) checked at build/test time by a **content-verifier** that machine-enforces canon invariants (no belief-creatures in spawn tables, trade ≤⅓, ≤1 ambiguity, macron/K-M-B lints, cross-ref integrity). **One seeded RNG = splitmix64** (64-bit, seeded once, **persisted**), drawn through **named sub-streams** (combat / loot / seasonal / world-gen) so systems never share or perturb each other's draws — full determinism/replayability. **Save = IndexedDB, single autosave + base64 export/import to file; versioned MINIMAL state** (store only non-derivable values; recompute all derived state — incl. derived pillar values — on load). **`tier` is a STORED committed value** (threshold-progress is derived). **Migrations = an ordered forward chain** (v_n → v_{n+1}) run on load, each writing a **pre-migration raw backup** first; **no cross-major-version rewrite guarantee** (forward-only). A **DEV-only play-API on `window`** drives the game headlessly for capture/playtest.
- **Why:** The reduce/tick contracts make the core deterministic and unit-testable (the project's top rule); named-substream splitmix64 keeps runs reproducible even as systems are added; minimal-state + forward migrations keep saves small and durable on a backend-free static host; a stored `tier` avoids recomputing the spine's position on every load.
- **Consequences:** Enforce the no-DOM-in-core boundary and the reduce/tick signatures; build the content-verifier into `npm run verify`; persist RNG seed + stream cursors; write a migration per save-schema bump with a raw backup; the renderer stays swappable; the DEV play-API is stripped from production builds. **🔁 Refined (2026-06-29) by D-067:** the forward-migration chain now scopes to *shipped/launch* saves — dev/v0.2 saves are **wiped** at the reshape schema bump (no users yet), and the real `migrate()` path is built + tested **before launch**, not across dev churn. Dev tools (the 2×/4×/8× speed toggle + a jump-to-rung/tier teleport) extend the DEV-only play-API and are likewise stripped from prod.

### D-016 ✅ — §4 balance model: human-signed pacing & accrual locks (the shape; numbers are tunable)

> 🔁 **Amended.** The "drop to 1 HP" soft-setback is superseded by **D-050** (HP carries + heals by eating);
> "simple per-tier thresholds (no floor/overflow)" by **D-028** (hybrid grade-gate); the per-tier hour budget
> uses pre-reshape numbering (re-map per D-048). The **signed locked shape** (≥30-min floor, 70/30, trade ≤⅓,
> no-respec, up-only) holds.
- **created_date:** 2026-06-25
- **Context:** §4 turns the design into numbers. The human signed off the *shape* of pacing and accrual (canon §I-bal); the concrete values remain a tunable first pass.
- **Options:** Short (~12–20h) vs. **longer (~32h)** v1; flat vs. **escalating per-tier** budgets; deeds-vs-seasonal split; punchy vs. **steady** deed jumps; respec vs. **no respec**.
- **Decision (LOCKED shape):** **Longer saga** — v1 ≈ **28.5h built** (**T0 ≈ 4.5h · T1 ≈ 8h · T2 ≈ 16h**; "~32h" includes the T3-stub runway/free-play tail), "more grind, more numbers, slower feature reveal." **Per-rank time floor ≈ 30 min** (applies to the grind rungs R1–R7; R0 is the exempt ~5-min cold-open — a human-flagged carve-out). **Simple per-tier required-pillar thresholds (NO floor/overflow).** Accrual = **two shapes only — deed JUMPS + a per-season JUDGED high-water result** — weighted **more from deeds (~70% deeds / ~30% seasonal)**; **deed jumps smaller/steadier** (per-event cap ≈ **0.04** of a tier band, so growth is many small acts); **trade ≤ ⅓ of Estate & Wealth (hard invariant)**; **up-only with minor recoverable dents, never a wipe**. **Combat:** first fight **20–35% win-rate**; **soft-setback-on-loss** (drop to 1 HP + ~½-day + light injury + *possible* carried-loot drop — **never** levels/gear/Influence). **Attributes STR/AGI/INT/SPD/LUCK with NO labour→combat cross-feed.** *(**RELAXED → bounded cross-feed** by **D-022/Q6**.)* **No respec in v1.** **Active-only** (auto-producers T3+ only). **K/M/B numbers; ~10× tier magnitude.** **Nav reveal one-tab-at-a-time.** All concrete numbers are **PROPOSED / tunable**; only the shape above is locked. *(🔁 FU18/D-022, 2026-06-26: the ~28.5h budget is now a **FLOOR**, not a target/ceiling — the game can be LONGER, a long OSRS-rough grind; §4.8 is a minimum-grind model.)* **Deferred from the v1 balance lock:** Standing & Office kanji (→ §5 authenticity pass) and marriage/adoption-lever numbers (→ T3 authoring).
- **Why:** The longer, escalating budget plus the ≥30-min floor delivers the requested grind without ballooning any single tier; more-from-deeds + small caps keeps growth feeling active and earned; the soft-setback and no-respec rules preserve the mediocre-start, commit-to-your-build fantasy.
- **Consequences:** §4's tables are the data behind the D-007 tier gates and D-008 pillars; the balance numbers get a dedicated tuning pass against the §4.8 pacing acceptance tests (a pacing regression fails if a headless run clears any grind rung in < ~28 min); the content-verifier enforces the trade-⅓ and no-cross-feed invariants.

### D-017 ✅ — v1 execution plan (§7): milestones, deployment, scope-risk posture

> 🔁 **Amended 2026-06-28 by [D-048].** "v1 = full T0–T2" is now **v1 = T0→T3** (the same Estate + Village +
> Region content, re-mapped — not a scope change). The non-negotiable full-scope intent is unchanged. (Roadmap
> sequencing now lives in the re-axe proposal, not §7.)
- **created_date:** 2026-06-25
- **Context:** §7 sequences the build and ship. The human reviewed §7's open items and the §4.9 balance dials (2026-06-25).
- **Options:** M2 combat slice as agent's-call vs. **fixed split**; **pre-planned cut-down (T0–T1)** vs. **no cut**; hosted CI vs. local; automated vs. **manual** deploy.
- **Decision:** **v1 = full T0–T2, NON-NEGOTIABLE — no pre-planned descope** (no T0–T1 cut-down ladder; if ever genuinely blocked, the forward-migratable save lets a later update add tiers, but v1 ships complete T0–T2). **Build order M0…M7 with combat as TWO FIXED milestones, M2a / M2b:** M0 = toolchain (Vite+TS+Vitest, pure-core/renderer split, seeded RNG, `npm run verify` + content-verifier, DEV play-API) + the cold open + IndexedDB save; M1 = T0 labour loop R0→R2; **M2a = combat live at R3 (idle auto-resolve + active setup) + the humbling first fight + soft-setback**; **M2b = bestiary + equipment + the loot→craft gear loop**; M3 = quests (4 types) + crafting + the four-pillar Influence panel → **T0 complete**; M4 = T1 Village (rep web, rumours, V0→V7); M5 = T2 Region (trade backbone, Origin faction, the G6 payoff, G0→G7) → **v1 content complete**; M6 = balance pass to the §4.8 targets + content-verifier green + T3 stub + polish; M7 = deploy. Each milestone is a **verify-green vertical slice**. **Deploy = static itch.io** (free / pay-what-you-want, Kind = HTML play-in-browser, relative `base: './'`); **release gate = local `npm run verify`** (typecheck + unit tests + content-verifier + K/M/B + macron lints + the §4.8 pacing regression); **manual, human-approved upload** (no hosted CI, no itch CLI / butler automation in v1). **§4.9 balance dials confirmed (now locked values, not ranges):** 70/30 deeds/seasonal · 0.04 per-event cap · front-loaded-then-ramp rung escalation · ~8 seasons/tier · Office ~25× T1→T2 step · side-faction speedup **~10–15%** (supersedes the old "≈halve") · the R0 ≥30-min-floor carve-out **blessed**.
- **Why:** Fixed M2a/M2b de-risks the densest slice without a conditional; refusing a pre-planned cut keeps the build committed to the satisfying T2 payoff; local-verify + manual deploy fits the solo/agentic, backend-free workflow and honours the "outward-facing actions need human approval" rule.
- **Consequences:** Build to M0…M7 (with M2a/M2b), each leaving the build verify-green; no descoped fallback is designed; the itch.io upload stays a manual release step; the §4.9 dials are locked values for the balance-tuning pass. Elaborates D-013 (tech) and D-012/D-016 (scope/balance); records §7.
- **Refined (2026-06-26) by D-021:** the §7 milestone roadmap is **LIVING**, not frozen canon — **M0–M1 committed; M2–M7 provisional, re-planned after each playtest** (and, on the docs-explosion, moved to `docs/living/roadmap.md`). This refines only the *provisional HOW*; the **locked v1 content scope — full T0–T2, no pre-planned descope (§7.4.2) — is UNCHANGED.** See **D-021**.

### D-018 ✅ — UI design language: mid-Edo woodblock/ink, strong CSS, NO asset pipeline

> 🔁 **Amended by [D-041]** (the explicit correcting ADR). The "**NO asset pipeline**" claim no longer holds —
> self-hosted OFL fonts + inline-SVG motifs + synthesized/CC0 audio are now in scope. The woodblock/ink CSS
> language itself is unchanged.
- **created_date:** 2026-06-26
- **Context:** §6.9 named "text + emoji + CSS, woodblock palette" but carried no design *vision* — the slop risk the human flagged ("avoid generic AI-slop / placeholder engineer art; want a coherent design language with a vision"). The art ambition was locked at "a strong CSS design-language, no asset pipeline."
- **Options:** improvise UI per-screen · use a generic component library · **lock a design-language bible BEFORE building any UI.**
- **Decision:** Lock a **UI design-language bible** ([`../ui-design.md`](ui-design.md)) as the anti-slop foundation, built **before** the first real UI. Aesthetic = **mid-Edo woodblock / ink-on-paper**: warm *washi* paper + warm *sumi* ink + one disciplined indigo (藍) + a **rare vermilion (朱) hanko seal** as the accent. A tight **8-role named-token palette** (+ the four pillar identities); typography = **Shippori Mincho** (body/heads) + **Yuji Syuku** reserved for two hero beats (rank-up title, seasonal headline) — final pairing **confirmed at M1**; key-block frames, *bokashi* gradients, paper-grain, the seal motif; the **event log is the visual hero**; **significance-gated motion** (reduced-motion-safe). Everything in **text + emoji + CSS + inline SVG — NO image/asset pipeline.** The **agent is a capable visual reviewer** (Playwright + Chrome-DevTools MCP + the `capture-game-states` skill + its own multimodal vision): it screenshot-QAs **every** screen/transition against the bible and iterates *before* the human sees it; the **human is the higher-level taste arbiter.**
- **Why:** A specific, disciplined aesthetic + agent-driven screenshot-QA against a written bible is the concrete defence against generic UI; pure CSS keeps scope lean and backend-free.
- **Consequences:** Build all UI to the bible (CSS tokens are named + concrete); lock the design language before M1's first screen; the visual-QA loop ([`../qa-playtesting.md`](qa-playtesting.md) §4) reviews every state; confirm the font pairing at M1; the self-hosted kanji glyph-subset must include 官威. Elaborates D-013 (presentation).

### D-019 ✅ — Fun is a first-class priority; the QA / playtest discipline
- **created_date:** 2026-06-26
- **Context:** A mechanically-correct, story-coherent incremental that isn't **fun** is a failure. The PRD had pacing *targets* but no fun discipline and no way to play-test a 28.5 h game.
- **Options:** build-to-spec and hope · playtest only at the end · **a continuous "fun is a hypothesis tested by play" discipline with instrumentation.**
- **Decision:** Treat **fun as the make-or-break priority**, with the *what/why* in [`../fun-factor.md`](fun-factor.md) (the core fun loops; how to measure/improve/keep-fun-high over 28.5 h; the fun-killers + their PRD guardrails; per-tier watch-points) and the *how* in [`../qa-playtesting.md`](qa-playtesting.md) (the DEV `window.__qa` harness; a **headless auto-player** to "play" the 28.5 h no human can hand-play; **fun-proxy** measurements — no-dead-time, reward cadence, always-a-visible-next-goal, the first-5-min hook; the screenshot visual-QA loop; the per-milestone sweep + the M6 polish loop). The no-reset **"fresh climb" = expanding domain + new verbs + reveals + narrative** (delegation/governance is a **T3+** escalation; v1 stays hands-on per D-015). The **agent measures the proxies and forms its own read; the human makes the final fun call** (playing the first T0 slice at M3). Continuous from M1/M3, **not** end-loaded.
- **Why:** Fun isn't unit-testable, but its absence is measurable; instrumented proxies + fast play-iteration maximise the signal the agent can give, while the human stays the ultimate judge.
- **Consequences:** Build the `__qa` harness + auto-player + the fun-proxy regression in M0/M3; run the fun-proxy suite each build; the M6 balance pass is telemetry-driven; the human plays the T0 slice (M3) to judge fun.

### D-020 ✅ — Post-freeze docs: freeze prd.md as the vision, explode into living docs, generate-don't-duplicate
- **created_date:** 2026-06-26
- **Context:** `docs/living/prd.md` (~4820 lines) was right for *authoring & review* but is a liability for *building* (hard to keep current). The human confirmed: freeze prd.md as the vision, explode into living docs — but only **after** the PRD is signed off.
- **Options:** keep the single PRD as the working doc · **explode into per-concern living docs + generated tables** · author a full doc suite up front.
- **Decision:** Once the PRD is frozen, **freeze `prd.md` as the vision spec** (read-mostly) and **derive per-concern LIVING docs** (`docs/architecture.md`, `docs/systems/*`, `docs/narrative/*`) plus **GENERATED** content/balance tables (`docs/content/`, via `gen:docs --check`) — **never hand-maintained twice** (the generate-don't-duplicate rule). The ADR log, the journals, and `human-feedback/2026-06-26-prd-human-feedback.md` remain as the history/intent layer. **Hold the explosion until after sign-off** (it is the first step of the build phase). **Refined (2026-06-26) by D-021:** sign-off legitimately comes *after* the first **M0+M1** build-and-play cycle, so the explosion is held until **then** — it is **not** "the first step of the build phase"; build M0+M1 against the current `prd.md`, then reorganise once, on ground that has survived contact with play. "Freeze" is now scoped to **LOCKED INTENT** (§1 vision + the hard constraints + the signed acceptance criteria); the §4 numbers and the §7 M2–M7 milestone detail stay **provisional**, and M2–M7 are **never** frozen as canon.
- **Why:** Living docs that track the code (some generated) cannot drift; a frozen `prd.md` preserves the agreed vision as the single reference.
- **Consequences:** Do the docs-explosion AFTER the first M0+M1 build-and-play cycle (per the D-021 refinement), not at the start of the build phase; `gen:docs --check` is part of M0's `npm run verify`; `prd.md` becomes read-mostly once frozen. **🔁 Refined (2026-06-29) by D-059:** the §1 vision-freeze (`prd.md` → read-mostly) is now deferred to **end-of-v1**, not the first build-play mark — keep the PRD liquid through T0–T2 (maybe T3), then convert the whole PRD to living docs once v1 is built + play-tested. The living-docs/generated-tables explosion already landed (D-046); only the *freeze* moves.

### D-021 ✅ — Refine D-020: freeze LOCKED INTENT, not the whole PRD (build → playtest → then explode)
- **created_date:** 2026-06-26
- **Context:** D-020 locked "freeze `prd.md` as the vision, explode into living docs **after PRD sign-off**." The multi-round battery review ([`../../brainstorms/2026-06-26-prd-battery-review.md`](../../project/brainstorms/2026-06-26-prd-battery-review.md) §P / **PD-1**) showed a hard *whole-PRD* freeze would contradict the steer-by-playtest discipline (canon K3 / **D-019** fun-as-hypothesis): the **vision layer had ZERO intent-drift across 97 findings** (it survived adversarial audit — freezable), while **every gap / under-spec / bug clustered in the PLAN layer** (§4 numbers "calls itself frozen but is materially under-specified"; §2 specifics; §7 detail) — exactly what must stay liquid and resolve via play.
- **Options:** (A) hard-freeze the whole PRD at sign-off, then explode · (B) **freeze only LOCKED INTENT, keep provisional implementation liquid, build → playtest → THEN explode** · (C) never freeze / never explode.
- **Decision:** **(B)** The freeze line is **LOCKED INTENT vs PROVISIONAL IMPLEMENTATION.** **FROZEN / locked intent** = §1 vision + the hard human constraints (no-magic · mediocre-start · trade ≤⅓ · active-only · the four pillars · the estate spine) + the human-**SIGNED** acceptance criteria (≥30-min-per-rank floor · 70/30 deeds/seasonal · ~28.5h v1 budget · the tier-gate **TARGETS**) — the destinations. **LIQUID / provisional** = the §4 yields/levers/balance numbers (already tagged "proposed v1 balance" throughout §4, per D-016) and the §7 **M2–M7** milestone detail that *hit* those targets — the route; the levers move, the locked targets do not. **DO NOT EXPLODE YET:** build **M0+M1 against the CURRENT `docs/living/prd.md`**, playtest, **THEN** reorganise once — sign-off legitimately comes *after* the first build-and-play cycle, on ground that has survived contact with play. **On explosion:** the §7 roadmap becomes a **LIVING** `docs/living/roadmap.md` (banner: *"M0–M1 committed; M2–M7 provisional, re-planned after each playtest"*) and the §4 numbers become **GENERATED** `docs/content/` tables (generate-don't-duplicate — what makes post-playtest re-tuning cheap; the battery rounds kept catching hand-typed derived tables that silently drift). **NEVER freeze M2–M7 as locked canon** — that is the mistake rejected, **not** the multi-doc structure. The **v1 SCOPE lock (full T0–T2, "no pre-planned descope", §7.4.2 / D-012 / D-017) is orthogonal and UNCHANGED** — it locks *what* ships, not the provisional *how*.
- **Why:** A hard whole-PRD freeze would lock the under-specified plan layer that PD-1 proved must resolve via play (K3 / D-019); freezing only the destinations while keeping the route liquid lets the build steer by playtest without re-litigating the vision, and generating the derived tables stops hand-typed balance from silently drifting (a repeat battery finding).
- **Consequences:** **REFINES (does not delete) D-020**; references **D-019** (fun-as-hypothesis) and the battery review **PD-1**. Do NOT create `docs/living/roadmap.md` or `docs/content/` yet — build M0+M1 against the current `prd.md` first; defer the docs-explosion to the post-M0/M1 playtest. When exploded: freeze only §1 + the locked constraints as a **tagged vision snapshot**, roadmap → living, balance → generated. The §4 "proposed v1 balance" numbers and the §7 M2–M7 detail stay provisional and re-planned after each playtest; the signed acceptance TARGETS and the T0–T2 scope do not move. *(2026-06-27 update: the first build-play cycle is COMPLETE — M0/M1/M2 demo, verify-green; the docs-explosion trigger has fired. `docs/content/` exists [generated] and `docs/living/roadmap.md` [the living milestone tracker] is created; the §1 vision-freeze + §4-balance-to-generated remain queued. See ADR D-046.)* **🔁 Refined (2026-06-29) by D-059:** the §1 vision-freeze is moved to **end-of-v1** — keep the PRD liquid through T0–T2 (maybe T3), then convert the whole PRD to living docs once v1 is built + play-tested. D-021's freeze-line principle (locked intent vs provisional plan) is unchanged; only *when* §1 crystallizes moves.

### D-022 ✅ — V2 decisions supersede prior locks; first application: relax the no-labour→combat wall (Q6)
- **created_date:** 2026-06-26
- **Context:** The PRD is being improved V1→V2 via a human Q&A over the 56 battery decisions ([`../../brainstorms/2026-06-26-prd-decisions-master.md`](../../project/brainstorms/2026-06-26-prd-decisions-master.md)). The human set a governing rule and made the first lock-changing call.
- **Decision (governing rule):** the **V1→V2 decision-resolution log is AUTHORITATIVE.** Where a V2 decision conflicts with a prior ADR, the canon, a K-item, or any "locked" constraint, **the V2 decision SUPERSEDES it** — prior decisions are **annotated (not deleted)**, pointing here. (Per D-021, the §1 vision + the *signed* acceptance criteria + T0–T2 scope stay locked **unless the human explicitly reopens them** — which they may, as here.)
- **First application — Q6: RELAX the "no labour→combat cross-feed" invariant (supersedes that clause in D-011, D-016, and feedback D13):** the hard wall becomes a **BOUNDED cross-feed.** **Every skill (labour included) grants a SMALL, CAPPED combat bonus** (per-level or per-milestone ~every 3–5 levels), balanced via differential level-speed + a per-skill level-cap on the combat benefit. **Conditioning** is the labour/combat **capability gate** ("weak → capable"). The **big** combat power (character level + attribute points) stays **combat-sourced ONLY** (Q1) — so there is **no uncapped labour→combat back door**, only a bounded, designed trickle.
- **Why:** the human wants skills to visibly make the MC "more capable" (the mediocre-start *grows*) without labour grinding *dominating* combat — the per-skill cap + the combat-only level/attribute economy bound it.
- **Consequences:** §4.4 / §4.5.3 / §2.7 + canon §D get the bounded-bonus model in the **V2 reshape** (bonus size / cadence / caps are §4 *proposed* numbers, tuned in V2 + playtest per D-021); the §6.6 verifier's "no-cross-feed" assertion becomes a "**bounded** cross-feed within caps" assertion. The combat-only character-level/attribute economy (Q1) is the invariant that stays. Future V2 lock-changes are recorded the same way (resolution log + an ADR when load-bearing).
- **Sequencing REFINED (2026-06-26, human-signed):** the design forks are settled into a strong PRD **before** coding. Full loop = **resolve the 56 battery decisions → author PRD V2 → build M0/M1 → playtest → resteer → PRD V3 → build → …** (iterative, versioned PRDs). This SUPERSEDES D-021's original "build M0/M1 FIRST, then resteer" ordering (the human's call: a much stronger spec up front beats learn-by-building). D-021's core principle is UNCHANGED — V2/V3 keep §4 numbers + §7 M2–M7 **provisional** (freeze = locked intent only), and the docs-explosion still waits (it can land at the V2 authoring step or after the first playtest — TBD).


> **PRD V2 batch (D-023…D-042, 2026-06-26).** The load-bearing lock/scope changes from the 79-decision Q&A (2026-06-26-prd-human-feedback Blocks L+M), recorded for the V2 reshape. Each is authoritative per D-022 (newest-wins). Per-decision detail: the master sheet + v2-followups doc; section impact: brainstorms/2026-06-26-prd-v2-plan.md.

### D-023 ✅ — Sequential per-tier progression — Phase 1 (climb rungs) then Phase 2 (estate-influence/pillar grind); pillar DEEDS gated to Phase 2
- **created_date:** 2026-06-26
- **Driven by:** FU7, FU11, Q30, Q7. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **D-022**.
### D-024 ✅ — The rung-meter accrual law — numeric per-rung-reset meter, threshold = ≥30-min floor × eligible curated-activity rate, AND-gated with story milestones
- **created_date:** 2026-06-26
- **Driven by:** FU6, Q30, Q28. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **D-022**.
### D-025 ✅ — Three clean combat tracks de-conflated — character level←combat-XP (HP/attr/satietyMax), Arms pillar←recognised deeds, Combat Rank meter←per-rung curated activities; one defined combat-level curve + per-mob MobDef.level
- **created_date:** 2026-06-26
- **Driven by:** FU14, Q1, Q47, FU15, FU5. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **D-022**.
### D-026 ✅ — Incremental combat + growing weapon roster + combat-reveal ladder — T0 starts with exactly ONE weapon; +2/+3/+4 per tier (~9-10); R3→R4→R5→weapon-L10→2nd line T1/3rd T2, one reveal per beat

> 🔁 **Stale tier vocab (D-048):** the weapon-roster / reveal cadence is keyed to the old 3-tier v1 — re-map onto
> T0→T3 (note the T0 *tutorial* now starts the single-weapon beat). Incremental-combat + one-reveal-per-beat hold.
- **created_date:** 2026-06-26
- **Driven by:** Q15, FU12, FU13, Q17. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **D-022**.
### D-027 ✅ — Bounded per-skill combat perks — relaxes the absolute no-labour→combat wall to ~2-8 small stackable perks via a separate skillCombatBonus channel, NO global cap; conditioning stays the zero-stat enablement gate; verifier flips ==0 → small-magnitude
- **created_date:** 2026-06-26
- **Driven by:** Q6, FU8, Q28. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **D-022**.
### D-028 ✅ — Hybrid good/great/excellent tier-gate — replaces simple thresholds: good in ALL revealed pillars, great in 2-3, excellent in 1-2 (T0 2-pillar special), NO overflow; per-pillar-per-tier overhaul vs the fixed deed inventory; trade ≤⅓ survives as the only structural cap

> 🔁 **Amended 2026-06-28 by [D-048]/[D-049].** The hybrid grade-gate **survives** (now per-N-pillars, opt-in,
> reward-bearing on overshoot), but "good-in-all-pillars / T0 2-pillar special" is reshaped to **one pillar per
> tier** + a tutorial T0. trade ≤⅓ unchanged.
- **created_date:** 2026-06-26
- **Driven by:** Q7, FU10, FU11. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **D-022**.
### D-029 ✅ — Budget is a FLOOR not a ceiling — a longer OSRS-rough minimum-grind model; active-only with tab-open auto-resolve + auto-repeat ('leave it running'); pacing gate fails on undershoot only
- **created_date:** 2026-06-26
- **Driven by:** FU18, FU23. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **D-022**.
### D-030 ✅ — Multi-backend redundant save layer — IndexedDB+localStorage+sessionStorage, atomic write, app-identity magic field, monotonic save-counter newest-wins + timestamp tiebreaker (documented core-lint exemption), additive backwards-compatible schema; built full in M0
- **created_date:** 2026-06-26
- **Driven by:** Q37, FU1, FU2, Q44, Q45, Q46. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **D-022**.
### D-031 ✅ — Broader cross-pillar combos as the T2 anti-slump — multiple pillar pairs / larger magnitude, computed POST trade-clamp, excluded from the gate-threshold check, verifier-proven never to breach ⅓; paired with seasonal-reward rotation
- **created_date:** 2026-06-26
- **Driven by:** Q22, FU20. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **D-022**.
### D-032 ✅ — No fixed quest-type budget — supersedes D-012's lean-4; PEST/HUNT/CLEAR/DEFEND are the T0 starter set, author whatever quests fit each stage, more/interesting welcome at later tiers
- **created_date:** 2026-06-26
- **Driven by:** Q23. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **D-022**.
### D-033 ✅ — Estate stage E3 authored in v1 — estate grows E0→E3 ('Prosperous'), folded into the G-rungs as a koku/Arms sink; E4-E5 remain parked
- **created_date:** 2026-06-26
- **Driven by:** Q8. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **D-022**. *(🔁 Refined by **D-051** → estate stages become yield-bearing; and by **D-066** 2026-06-29 → a LINEAR taste in T0, branching into the LAND/TREASURY/TRADE sub-engines at T1.)*
### D-034 ✅ — Graded durability bands — 4 bands on weapon attackPower (75+/50+/1+/0 → 1.0/0.9/0.75/0.55), fixed wear per fight, armour bands on defense, repair restores; NEVER auto-unequip / never weaponless
- **created_date:** 2026-06-26
- **Driven by:** Q33, FU17. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **D-022**.
### D-035 ✅ — Satiety throttles combat — satietyRate multiplier on attackPower (flat above ~0.7 → ~0.5 floor, separate combat coefficient); the locked 20-35% first-fight win-rate re-measured 'at adequate satiety (≥~0.7)'
- **created_date:** 2026-06-26
- **Driven by:** Q31, FU16, Q47. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **D-022**.
### D-036 ✅ — Name-reclaim split — reclaiming 'Tahei' is Origin-gated at O5 (earned + MISSABLE, conditional epilogue); the Otsuru/Tama TRUTH stays spine-guaranteed at G6 for every player
- **created_date:** 2026-06-26
- **Driven by:** Q5, Q25, Q40. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **D-022**.
### D-037 ✅ — Design-staggered reveals, NO runtime reveal-queue (supersedes Q17's queue framing); distinct activities (Crafting, Quests) surface as top-level nav tabs, not nested panels
- **created_date:** 2026-06-26
- **Driven by:** FU4, Q17, Q10. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **D-022**.
### D-038 ✅ — Determinism hardening — per-named-stream RNG cursors {seed,cursors:{combat,loot,seasonal,worldgen}} + stateless day-keyed weather/lunar (not stored); ban Math.pow/exp/log/trig in core (integer-pow, whitelist sqrt)
- **created_date:** 2026-06-26
- **Driven by:** Q2, Q3, FU3, Q36. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **D-022**.
### D-039 ✅ — Intra-line dialogue branching in v1 — flat choices[]/ChoiceId with locksLineIds[]/flags effects; data-not-scripting, deterministic, only chosen-flags persist; content/dialogue.ts
- **created_date:** 2026-06-26
- **Driven by:** Q34, FU22. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **D-022**.
### D-040 ✅ — V1 ending = castle-town / Daikan first-contact stub — drops the porter/Kaidō-guild first-contact framing (it re-ran spent T2 content)

> 🔁 **D-048 renumber:** "spent T2 content" now reads **T3** (Region); the castle-town first-contact stub (v1
> ends at Region) is unchanged.
- **created_date:** 2026-06-26
- **Driven by:** Q24. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **D-022**.
### D-041 ✅ — Bundled asset set corrects the 'no asset pipeline' claim — self-hosted OFL fonts, inline-SVG load-bearing motifs (emoji cosmetic-only), a small synthesized Web Audio + original/CC0 audio set; commit-SHA build stamp + About/Credits + LICENSE + itch content descriptors
- **created_date:** 2026-06-26
- **Driven by:** Q38, Q50, Q52, Q54, Q51, Q53. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **D-022**. *(🔁 Elaborated 2026-06-29 by **D-068** — the in-scope audio fixes a traditional Japanese SFX palette (taiko/shamisen/koto/shakuhachi/temple-bell) + sequences a minimal SFX pass before the R1 taste call.)*
### D-042 ✅ — Real-name fictionalization & lint — rename Toyama/Konoe (Q27), Mago/Naozane/Obaa Sato (Q11/Q39), allow-list Nihonbashi (Q12); a §6.6 real-name denylist lint prevents recurrence
- **created_date:** 2026-06-26
- **Driven by:** Q27, Q39, Q11, Q12, Q28. Recorded for PRD V2; supersedes any conflicting earlier ADR/lock per **D-022**.


## D-043 — PRD V2.1 decisions (post-battery, 2026-06-26)

> 🔁 **Tier-vocab stale (D-048/D-049/D-051).** Under one-pillar-per-tier, **Name reveals at T3** (not "T2 reveals
> 4"); the gate is now **per-N-pillars** (D-049); "estate builds → Phase 2" is in tension with Estate as the T1
> core pillar + koku flywheel (D-051). The signed locks (≥30-min floor, ~60h floor, grade-gate principle) hold —
> only the tier/pillar mapping is stale. (The win-rate clause already carries the D-057 amendment inline.)

The 5-round adversarial battery on PRD V2 surfaced 14 blocking defects (B1–B14) + ~40 design questions; all 32
were resolved with the human (full set: **[2026-06-26-prd-human-feedback.md Block N](../../project/human-feedback/2026-06-26-prd-human-feedback.md)**; audit:
[brainstorms/2026-06-26-prd-v2-audit.md](../../project/brainstorms/2026-06-26-prd-v2-audit.md)). Governing per D-022.
Headline locks: **v1 = ~60h FLOOR** (28.5h is the Phase-1 floor, not the total); **rung-meter ≥30-min floor is
on the numeric-points objective** (focused-optimal can't go under; unfocused runs longer — resolves B4);
**tier-gates require great/excellent with an authored deed supply + Name IS a gated pillar** (T2 reveals 4)
(B1/B8/B13); **estate builds move to Phase 2** (B2); **combos = Model-A → both pillars + a deed-only
gate-eligible accumulator** (B5); **world-clock derives season/year + lunar ephemeris** (B6); **multi-tab
unsupported** (B7); **load-validation = coerce-safe + reject-to-recovery** (B9); **tick() per-tick fold**
(B10); **v1 ending = bounded-complete + free-play** (B11); **crash recovery = error-boundary + last-known-good
ring + safe-mode** (B12); **quests = order-free advance-event set** (B14); **Estate value purely derived**
(dent fix); ~~**win-rate = analytic, not sampled**~~ (🔁 **AMENDED 2026-06-29 by D-057** — analytic for the GATE check; the *displayed* win-rate is fixed-seed **sampled** (n=400); **displayed == tested == same-for-every-player**); **identity hues = fills/accents, text in ink** (a11y);
**idle combat = full-auto with forced-retreat-on-loss + 0-HP→rest**; **pre-split M3 & M5**; **front-load
pre-R3 variety**; **53-bit-safe RNG + fixed pow order**; **interim perf budgets become an M6 gate**.

### D-044 ✅ — Crash-recovery: error boundary + last-known-good save ring + safe-mode boot
- **created_date:** 2026-06-26
- **Context:** Block N battery defect **B12** (**[2026-06-26-prd-human-feedback.md Block N](../../project/human-feedback/2026-06-26-prd-human-feedback.md)**, item D-Q-B12): an in-tick exception or a corrupted autosave could brick the only save and lose a ~60h run. The PRD V2 had no crash containment — an unhandled error in the per-tick fold or render would tear down the loop, and an autosave fired from an already-bad state would overwrite the only good copy.
- **Options:** (A) No containment — let exceptions propagate (a single bug bricks the run) · (B) Single try/catch around tick only · (C) Error boundary around tick **and** render + a rolling last-known-good save ring + a crash-counter persisted outside GameState + a safe-mode boot offering rollback, with autosave-poison suppression.
- **Decision:** **(C)** Wrap **both tick and render** in an error boundary; persist a **crash-counter OUTSIDE GameState** (so a poisoned state can't hide the count); keep a **rolling last-known-good save ring**; **repeated crashes boot into safe-mode** offering rollback to a good ring slot; **suppress autosave-poison** — never overwrite the good ring with a state that just threw.
- **Why:** A ~60h v1 floor (D-043) makes the single-save failure mode unacceptable; containing the blast radius to one tick and preserving a known-good rollback is the cheapest path to "a bug is recoverable, not fatal." Keeping the crash-counter outside GameState is what lets safe-mode trigger even when the state itself is the poison.
- **Consequences:** **§6.8** gains a crash-recovery subsection (error boundary + ring + safe-mode + poison-suppression); **M0** builds the save ring + the out-of-state crash-counter; **M6** adds a terminal/crash test exercising the safe-mode path. Resolves B12. Recorded for PRD V2.1; supersedes any conflicting earlier ADR/lock per **D-022**.

### D-045 ✅ — Accessibility ink rule: identity hues are FILLS/ACCENTS only; meaning-bearing TEXT in AA-passing ink
- **created_date:** 2026-06-26
- **Context:** Block N a11y review (**[2026-06-26-prd-human-feedback.md Block N](../../project/human-feedback/2026-06-26-prd-human-feedback.md)**, item D-Q-a11y): the woodblock identity palette was carrying *meaning* through coloured text — a coloured WIN/LOSS word, coloured label-text — at contrast ratios that did not pass WCAG AA, and the PRD/ui-design overclaimed "AA on every surface" without stating the real per-token ratios.
- **Options:** (A) Keep identity hues on text, accept sub-AA contrast for "atmosphere" · (B) Drop the woodblock identity palette entirely for monochrome legibility · (C) Split the roles — identity hues live only in chrome (fills/accents); all meaning-bearing text renders in AA-passing ink.
- **Decision:** **(C)** Woodblock identity lives in **chrome only** — fills, bars, pips, borders; **every meaning-bearing text string renders in `--ink-soft`** (contrast ≥7.3, passes WCAG AA). **Drop the coloured WIN/LOSS word-as-text and the coloured label-text**; **drop the bare 'AA on every surface' overclaim** and instead state the **real per-token contrast guarantees**.
- **Why:** Colour must never be the sole carrier of meaning, and the identity palette's hues can't all clear AA as foreground text — moving them to fills/accents keeps the woodblock look while guaranteeing every word is legible; replacing the blanket "AA everywhere" claim with measured per-token ratios keeps the spec honest and checkable.
- **Consequences:** **prd.md §2.21** + **ui-design.md §5.1/§5.3** updated to the fills-only identity rule and the `--ink-soft` text rule; the WIN/LOSS and label colour-as-meaning are removed; the verifier / visual-QA gains a **text-contrast check**. Recorded for PRD V2.1; supersedes any conflicting earlier ADR/lock per **D-022**.

### D-046 ✅ — First build-and-play cycle complete (M0–M2b shipped); docs-explosion partially actioned
- **created_date:** 2026-06-27
- **Context:** D-021 deferred the docs-explosion to *after* the first M0+M1 build-and-play cycle. That cycle is now done: **M0/M1/M2a/M2b are built, verify-green (51 tests), and play-tested** (commits `8bf6ac9`, `248bf93`, `fc36172`), against PRD V2.2 (all 32 Block N + 7 Block N.1 decisions applied, commit `2b8d5e9`). The toolchain (Vite+TS+Vitest+ESLint, `npm run verify`) is in place. So the D-021 docs-explosion trigger has fired, and the playtest produced its first steer.
- **Options:** (A) Hold the explosion until the *full* V1 is built · (B) Fire the explosion trigger now — create the living roadmap + start generating content — but defer the §1 vision-freeze + the full §4-balance-to-generated until the human signs off · (C) Do the whole explosion (freeze §1, generate all balance) immediately.
- **Decision:** **(B)** Partially action the explosion: **`docs/living/roadmap.md` is created** (the living milestone tracker — M0–M2b SHIPPED, M3–M7 provisional) and **`docs/content/` is generating** (`t0-content.md`, generated); the **§1 vision-freeze + the full §4-balance-to-generated remain DEFERRED pending the human's sign-off**. The playtest's first steer is recorded: it **caught and fixed a combat dead-end** via a **sampled-win-rate forecast** + a **winnable starter foe**.
- **Why:** The D-021 trigger fired, so the cheap, reversible half of the explosion (living roadmap + generated content) should land now — it makes post-playtest re-tuning cheap and keeps the milestone state honest. The locked-intent half (freezing §1 as a tagged vision snapshot) is a one-way door that needs the human's sign-off, so it stays queued. M3–M7 and T3/T4 are genuinely NOT built and remain provisional.
- **Consequences:** **REFINES (does not delete) D-021** — its docs-explosion trigger is now marked fired; `docs/living/roadmap.md` (living) + `docs/content/` (generated) exist; the QA-playtesting doc was reclassified from a "plan" to a LIVING GUIDE (`docs/living/qa-playtesting.md`). The §1 freeze + the full §4-balance-to-generated stay deferred pending human sign-off. **D-044/D-045** already recorded the crash-recovery + a11y-ink decisions carried into this cycle. NPC names landed as lord Shigemasa, drillmaster Kihei, physician Sōan (renamed off real-name echoes per D-042). Supersedes any conflicting earlier ADR/lock per **D-022**. **🔁 Refined (2026-06-29) by D-059:** the still-deferred §1 vision-freeze is now scheduled for **end-of-v1** (after v1 is fully built + play-tested), not merely "pending sign-off" — keep the PRD liquid through T0–T2 (maybe T3), then convert the whole PRD to living docs.

### D-047 ✅ — v0.2 audit-fix build; the combat stance pulled forward to R3 (provisional)
- **created_date:** 2026-06-27
- **Context:** The 2026-06-27 state-of-the-game battery audit (`project/audit/reports/2026-06-27-state-of-the-game.md`) scored the M0–M2 demo a "chassis with no engine" (Fun 4.5 / Incremental 4.5). **v0.2** (tag `v0.2`; `project/audit/reports/2026-06-27-v0.2-changelog.md`) fixes the highest-leverage findings *against locked intent*, without deciding any of the 6 human **H-items** — re-scored (independent workflow) to Fun 6.5 / UI 8.5 / Incremental 7.0 / PRD-faithful 8.0 / human-feedback 8.0 / README-spirit 7.5 / Laziness 3.0.
- **Decision:** Build v0.2 as scoped (graded combat curve + kendo stance, the work→skill→yield reinvestment loop + cook/estate/attribute sinks, the R3 chapter-close + dream-2 payoff + the greyed House-Influence macro teaser, the cold-open screen, log ×N coalescing, the real RED→GREEN acceptance tests, the wired `migrate()`, the DEMO/REAL pacing profile). **All balance numbers are PROVISIONAL (v0.2) — tune by playtest.** The **combat stance reveal is pulled forward from its PRD-canonical R5 slot to R3** (combat-unlock) so a real combat *decision* exists from the moment combat opens (audit's top ask).
- **Why:** The audit wants the combat decision *now*; gating it at R5 leaves the freshly-unlocked R3 combat decision-less. The pull-forward is a small, reversible reveal-schedule change — not a vision change — so it does not need an H-item; it is recorded here so the divergence from the §7.2 reveal ladder is tracked, not silent.
- **Consequences:** A re-gate to R5 later is a one-line change (`surfaces.ts` predicate). ~~The DEMO balance profile stays the shipped default (the REAL ≥30-min profile is reachable via `npm run pacing` / a flag but **not** chosen — that's H1, the human's call).~~ **⛔ SUPERSEDED (2026-06-29) by D-056** — H1 resolved: the real D-049 pacing ships as the default; review velocity comes from a DEV-only 2×/4×/8× speed toggle (a time multiplier), and the DEMO/REAL profile fork is retired. The seed-robust win-rate forecast (`combat.foeForecasts`, fixed seed) is now canon for the displayed/guard-tested win-rate. Provisional; supersedes nothing locked. Per **D-022**, future human steers win.


---

## D-048…D-055 — The two-tier Estate reshape (2026-06-28) ⏳ PRD application PENDING

A live human-steered design session (2026-06-28), driven by the v0.1 state-of-the-game audit
([`project/audit/reports/2026-06-27-state-of-the-game.md`](../../project/audit/reports/2026-06-27-state-of-the-game.md)),
reshaped the tier spine and resolved the open H-items. Full intent record:
**[`2026-06-28-tier-reshape.md`](../../project/human-feedback/2026-06-28-tier-reshape.md)**. These 8 ADRs are **LOCKED
canon** (governing per **D-022**). **✅ Applied to `prd.md` / the living docs 2026-06-29 (session-15)** — the PRD
body is no longer 5-tier-stale. The **code** application is the Part-2 v0.3 build (tracked in
**[`project/archive/2026-06-29-path-to-v0.3.md`](../../project/archive/2026-06-29-path-to-v0.3.md)** Part 2 — now
ARCHIVED, the v0.3 build is done — + the living roadmap);
the §4 balance magnitudes stay liquid (re-derive at Ship-M1-F2, D-059).

### D-048 ✅ — Split the Estate into two tiers: the 6-tier reshape (T0 tutorial + T1 full estate)
- **created_date:** 2026-06-28
- **Context:** The v0.1 audit + firsthand play exposed a structural tension: the old **T0 (Estate)** tried to be **both** the tutorial *and* the first real grind, and the four-pillar macro spine was an unbuilt silhouette with no early on-ramp. The human's steer (2026-06-28) reshapes the tier ladder so the intro and the real game are distinct tiers and the spine is introduced gently.
- **Options:** (A) Keep **5 tiers** (T0 Estate…T4 Edo); introduce all spine pillars at the old T0→T1 gate · (B) **Split the Estate** into a tutorial tier + a full tier → **6 tiers**, with exactly **one pillar unlocking per tier**.
- **Decision:** **(B)** — **Six tiers:** **T0 Estate (intro/tutorial)** · **T1 Estate (full)** · **T2 Village** · **T3 Region** · **T4 Castle-town** · **T5 Edo**. The macro spine is introduced **early but minimal** — **one pillar** is active to clear T0→T1, and the **revealed-pillar set grows one per tier: 1→2→3→4→4**. Pillar→tier map: **Estate 家産** (P1, T0→T1) → **Arms 武威** (P2, T1→T2, unlocks Village) → **Office 官威** *kan'i* (P3, T2→T3, Region) → **Name & Honour 家格** *kakaku* (P4, T3→T4, Castle-town); **T4→T5 deepens the four, no new pillar**. **v1 scope = new T0→T3** (preserves the locked v1 *content*: full Estate + Village + Region).
- **Why:** Splitting "learn the game" from "grind the game" resolves the demo-vs-real pacing tension (T0 fast/reviewable, T1+ carries the real floor) **and** gives the spine a gentle on-ramp — you learn **one** pillar before juggling four. One-pillar-per-tier de-risks the macro engine by proving a single-pillar tier transition first. Pillar order = "**seize authority, then be granted status**": Office before Name, and Name (which *reflects the other three*, §1.6.1) works best last.
- **Consequences:** SUPERSEDES the 5-tier model across **prd.md §1.6** (four pillars / five tiers), **§1.7** (world table), **§5** (tier content), **§7** (milestones), and the **§1.6.3** "T0 = 2-pillar special (Arms+Estate)" reveal (now **T0 = 1 pillar = Estate**). Renumbers Region/Castle-town/Edo → **T3/T4/T5**. The ~28.5h **§4.8** budget re-derives across the 4 v1 tiers. The QA `state()` snapshot's `tier` widens to **0..5** and `outcome` gains **`t3done`** (the v1 finish). Code: the tier enum + `ranks.ts` + the state schema. **PRD/docs/code application PENDING** — see the tracker. REFINES D-028 (the gate — see D-049). Per **D-022**, this newest human steer governs.

### D-049 ✅ — Tier ascension = a manual opt-in story event; the hybrid grade-gate scales per pillar-count; overshoot earns a permanent boon; gentle pacing ramp
- **created_date:** 2026-06-28
- **Context:** **D-028** locked a "hybrid good/great/excellent" tier-gate for the old reveal set. With one pillar unlocking per tier (D-048), the gate must be re-specified, and the human added two refinements: the tier-up is **manual opt-in**, and a **higher pillar grade earns a better reward**.
- **Options:** *Gate* — (A) flat single threshold · (B) keep the hybrid grade-gate, scaled by pillars-open · (C) AND-gate all open pillars. *Reward* — permanent boon / one-time lump / prestige-only. *Trigger* — auto-advance vs manual opt-in. *Pacing* — floor everywhere / T0 exempt / gentle ramp.
- **Decision:** **KEEP the hybrid grade-gate (B)**, scaled by **N** open pillars to **exactly 1 EXCELLENT + 1 GREAT + (N−2) GOOD** (all pillars ≥ GOOD): **T0 = EXCELLENT** · **T1 = 1 GREAT + 1 EXCELLENT** · **T2 = 1 EXC + 1 GRT + 1 GOOD** · **T3 = 1 EXC + 1 GRT + 2 GOOD**. The gate is **not** an auto-advance — meeting it **unlocks the OPTION** to trigger a **manual opt-in ascension STORY EVENT**; the player chooses *when* (grinding pillars **past** the gate is rewarded). The event grants a **permanent, grade-scaled boon** (a next-tier head-start / a small permanent multiplier / unique title+gear). **Pacing = gentle ramp:** T0 ~**10–15 min/rung** and **floor-exempt**; the signed **≥30-min/rung floor binds from T1**.
- **Why:** The grade-gate is a signed criterion worth preserving; scaling it by pillar-count keeps it meaningful as pillars unlock. **Manual opt-in + overshoot-reward** turns the gate into a *goal you push past for a better payoff* (a core incremental pleasure) instead of a wall. Exempting the tutorial from the floor lets T0 stay reviewable in minutes without abandoning the floor where it matters (T1+).
- **Consequences:** REFINES **D-028** (the gate is now per-N-pillars, opt-in, and reward-bearing) and **D-029** (the floor now starts at **T1**, not T0). prd.md **§1.6.3/§4.6** (gate spec), **§4.8** (pacing — T0 exempt), **§5** (the ascension story beats). New state: a tier-up-**available** flag + the score-scaled reward bundle. Add a gate-grade test per tier. **PRD/docs/code application PENDING.** Per **D-022**, governs. **🔁 Refined (2026-06-29) by D-062:** the *first* tier ascension (T0→T1) is always a big ceremonial beat on first contact regardless of grade; the grade-scaled *boon magnitude* (this ADR) still applies, and overshoot-grade scaling layers onto *later* ascensions.

### D-050 ✅ — Combat HP carries between fights and heals by eating (the stance becomes a real tradeoff)
- **created_date:** 2026-06-28
- **Context:** The v0.2 audit found the new stance toggle was a **fake choice** — 上段/Aggressive strictly dominated in 100% of sampled cells and the defensive payoff (HP retention) was **inert**, because every fight restarted at `hpMax` and the default 中段/Balanced was the *trap* pick.
- **Options:** (A) **carry HP** between fights · (B) keep full-HP-per-fight, rebalance stats + surface wear only · (C) drop the stance. *HP recovery* — rest/time · **eat/satiety** · slow + setback.
- **Decision:** **(A) HP carries between fights** (retention becomes a real resource) and **HP heals by EATING (satiety)** — a low-satiety player is a fragile one. Defensive stances (more retention) now genuinely trade against Aggressive (more speed/damage), so **no stance strictly dominates** and the default is no longer a trap.
- **Why:** Carrying HP is what makes the stance a *decision* at all; tying recovery to satiety couples combat to the **existing cook/food sink** (one system feeds another) instead of adding a separate heal resource. Directly fixes the audit's "fake decision" + "dominated default."
- **Consequences:** `combat.ts` must read **carried** HP (not reset to `hpMax`); the auto-loop rests/eats to recover; satiety becomes combat-relevant. Replace the v0.2 test that **enshrined** stance dominance with a **"no stance strictly dominated"** curve invariant; surface the wear/retention tradeoff in **pixels** (touch-legible, not hover-only). Pairs with **D-035** (satiety throttles combat). prd.md **§4.6**. **PRD/docs/code application PENDING.** Per **D-022**, governs.

### D-051 ✅ — Koku gets a compounding sink: the estate-upgrade flywheel

> 🔁 **Re-scoped 2026-07-02 by [D-107].** koku is no longer the spendable currency — it is the
> House STANDING (never spent). The reinvestment flywheel is now **RICE→COIN** (labour yields
> rice + a little coin; estate upgrades are bought with **COIN**). The compounding-sink mechanic
> holds; only the noun changes (koku → coin).
- **created_date:** 2026-06-28
- **Context:** v0.1/v0.2 audits: **koku** is the headline currency but had **no sink** (v0.1) / only a **finite, power-neutral estate** (v0.2), so the reinvestment loop self-saturates — the ×3 yield multiplier accelerates a currency with nowhere compounding to go.
- **Options:** (A) **compounding estate upgrades** · (B) a market (buy/sell gear+goods) · (C) koku **is** the pillar currency (spend koku → raise pillars directly).
- **Decision:** **(A)** — **koku buys estate improvements that raise yield/output** (work → koku → upgrade → more output → more koku): a true reinvestment flywheel feeding the **Estate 家産 pillar** via its **LAND / TREASURY** sub-engines (§1.6.1). A market (the **TRADE/*meibutsu*** sub-engine) is **additive later**, not the primary sink.
- **Why:** A compounding sink is what makes the economy *incremental* rather than a bounded cosmetic; routing it through the Estate pillar's **existing** LAND/TREASURY sub-engines unifies the micro economy with the macro spine instead of bolting on a parallel system.
- **Consequences:** Multi-stage, yield-bearing estate upgrades replace the finite power-neutral `estateStage`; the `G-NO-DEAD-VALUES` ratchet now guards a **compounding** koku consumer. REFINES **D-033** (estate stages become yield-bearing, not just a koku/Arms sink). prd.md **§1.6.1 + §4** (economy). **PRD/docs/code application PENDING.** Per **D-022**, governs. **🔁 Refined (2026-06-29) by D-066:** the flywheel is a small LINEAR estate-upgrade taste in T0, branching into the LAND/TREASURY/TRADE sub-engines at T1 (trade ≤⅓ preserved).

### D-052 ✅ — Tutorial = showcase-in-miniature; the T0/T1 content split; seed-breadth lands minimal-now (H5)
- **created_date:** 2026-06-28
- **Context:** The human delegated "**what estate content is tutorial (T0) vs full (T1)**" and chose **showcase-in-miniature**. **H5** (seed breadth — NPC dialogue, walkable areas, the found/crafted 2nd weapon) resolved to **"add minimal versions now."**
- **Options:** *Tutorial scope* — lean / **showcase-in-miniature** / core+teasers. *H5* — **add minimal now** / collapse via ADR / defer.
- **Decision:** **T0 (tutorial) showcases a MINIATURE of every system** — a tiny **market** (koku-sink taste), one **craftable** (🔁 **relaxed to "at LEAST one craftable" 2026-07-01 by D-102 — T0 now ships 3 weapons**; the 2nd weapon becomes **found/crafted**, not gifted — honoring "weapons never gifted as power"), one **NPC lore-talk** line, ~~room-grouped~~ **areas** (🔁 **upgraded to a small WALKABLE map 2026-06-29 by D-065**), the **Estate-pillar** panel + the **first ascension**. **T1 (full estate) scales each into depth.** Seed breadth lands **now, minimal in T0**, deepened in T1.
- **Why:** Showing the full game's shape early hooks genre-literate players (they perceive the horizon) without front-loading the build; T1 then has real new toys. The **found/crafted** weapon retires the v0.1 "gifted axe" complaint.
- **Consequences:** The T0/T1 rung+content split (**R0→R7 tutorial**; **~8 T1 rungs ≈ R8→R15**) — *provisional* per the freeze. Resolves **H5**; the axe-gift becomes found/crafted (supersedes the M2b stand-in). prd.md **§5** (T0/T1 content), **§1.7** (breadth promises). **PRD/docs/code application PENDING.** Per **D-022**, governs.

### D-053 ⚠️ — Active-only "leave it running" = wall-time simulation (do NOT pause on `document.hidden`) — SUPERSEDED (clock model) by D-079
> 🔁 **SUPERSEDED on the clock model by D-079 (2026-06-30).** ⚠️ This ADR's Decision below
> **describes the OPPOSITE of what shipped** — a textbook "a signed ADR is a *claim to verify*, not
> proof" (A12). The build is **active-only-PAUSE**: the sim **pauses on `document.hidden`**, with **no**
> offline/background wall-time catch-up (`src/app/main.ts:179` — the `paused || document.hidden` guard;
> the active-only tick-loop comment is at 174-176). **D-079 is the live authority.** The
> genre's "leave it running" feel is delivered by **tab-open auto-repeat while the tab is open & visible**
> (FU23), not by wall-time catch-up. The original text is kept (struck) below as append-only history.
- **created_date:** 2026-06-28
- **Context:** **H6** — active-only / no-offline is locked (**FU23**). The human clarified the *intent*: active-only must still support **"leave it running"** — leave the game open in a browser window, do other things, return to find it kept doing the action. The only distinction from "offline" is the **window/tab must stay open**.
- **Options:** (A) **keep active-only** · (B) add a capped while-away tick · (C) decide later. *Technical:* pause-on-hidden vs **wall-time catch-up**.
- **Decision:** ~~Keep active-only (A) — no progress when the game is CLOSED. But the simulation must **advance by elapsed wall-time** (delta-time accumulation) so a backgrounded/throttled tab **catches up** on its next tick. **Do NOT pause the sim on `document.hidden`.** (Keep the autosave dirty-guard, but it must **not** gate the simulation.)~~ **[SUPERSEDED by D-079 — see banner above.** The shipped model is **active-only-PAUSE**: pause on `document.hidden`, **no** wall-time catch-up. The kept parts: active-only (no progress when CLOSED) and the autosave dirty-guard both still hold.]
- **Why:** "Leave it running" is the genre's idle fantasy and is honored *without* offline simulation as long as the tab is open; the only engineering requirement is that Chrome's background-tab timer throttling not **lose** time — solved by ticking on **real elapsed time** rather than assuming a steady cadence.
- **Consequences:** REVISES the v0.1 report's "add a `document.hidden` guard to autosave" — keep the autosave guard, but the **tick loop catches up elapsed time when hidden**. `app/main.ts` computes `dt` from wall-clock + a covering test. Honors **FU23**. prd.md **§6.10 / the clock**. **PRD/docs/code application PENDING.** Per **D-022**, governs.

### D-054 ✅ — Milestone-integrity rule: all-DoD-or-ADR-amended + a CI manifest check (H4)
- **created_date:** 2026-06-28
- **Context:** The v0.1 audit found **"SHIPPED (slice)"** — milestones shipping with unmet DoD lines footnoted away (M1's claimed pacing tool absent; M2b's loot→craft loop folded into a gift), so green CI **overstated** completeness.
- **Options:** (A) **all-or-ADR-amended + CI manifest check** · (B) all-or-amended, no CI check · (C) keep partial-DoD shipping with footnotes.
- **Decision:** **(A)** — a milestone is **SHIPPED only when every DoD line is met OR formally amended via an ADR before the commit**; a **CI manifest check** asserts every instrument a DoD *names* resolves to a real test/tool. Bans "SHIPPED (slice)".
- **Why:** The engineering gates are already strict; extending the same rigor to **feature-completeness claims** keeps the milestone ledger trustworthy into T1+. A machine check is what prevents the honest-intention-but-silent-gap failure the audit found.
- **Consequences:** A new process gate (working-agreements + `verify`); each future milestone DoD's named instruments are CI-asserted; `roadmap.md` DoDs become forward contracts. Resolves **H4**. **CI manifest check BUILT in v0.3.1 Step 7 (battery #20):** [`src/scripts/milestone-integrity.ts`](../../src/scripts/milestone-integrity.ts) — the 11th `verify` gate — a lean manifest asserting every named DoD forward-contract (G-CURVE, G-NO-DEAD-VALUES, NO-STANCE-DOMINATED, DISPLAYED==TESTED, playcheck) + D-088's per-tier e2e/invariants tests resolves to a real test/tool, and that every named contract the roadmap mentions is wired. This is the **teeth** D-088's enforcement note names. Per **D-022**, governs.

### D-055 ✅ — Pillar-teaser = active + locked silhouettes; origin-mystery cadence (payoff at Region + a beat every tier)
- **created_date:** 2026-06-28
- **Context:** v0.2 shows **all four pillars greyed** (reads as a roadmap dump); §1.6.3 says reveal per tier. And the v0.1 audit found the **origin mystery "dies in silence" mid-T0**, violating **§1.9** "the dream cadence never goes cold" (its markers were write-only flags no logic read).
- **Options:** *Teaser* — **active + locked silhouettes** / all-4-named-greyed / only-unlocked. *Mystery* — **payoff at Region + a beat every tier** / resolve in the Estate arc / slow-burn to castle-town.
- **Decision:** The **House Influence panel shows the active pillar + locked, UNNAMED silhouettes** for the rest (perceived depth + intrigue, not a named roadmap). The **origin mystery pays off in full at the Region (T3, per canon)**, but a **dream/mystery beat fires at every tier transition** (incl. the T0→T1 and T1→T2 ascensions) so the **§1.9** cadence holds within every window.
- **Why:** Silhouettes signal long-horizon depth without spoiling it; per-tier beats keep the strongest narrative asset **alive** instead of dead-ending it (the v0.1 failure), while preserving the canonical Region payoff.
- **Consequences:** ui-design/render gains the **silhouette teaser**; the dream/mystery flags become **READ** at each tier transition (fixing the v0.1 write-only-flags bug). prd.md **§1.9** (cadence = per-tier beats) + **§1.6.3/§2.16(e)** (teaser presentation). **PRD/docs/code application PENDING.** Per **D-022**, governs.


---

## D-056…D-069 — 2026-06-29 decision session (v0.2 audit reconciliation + forward decisions) ⏳ PRD application PENDING

A human-driven decision pass (2026-06-29) reconciled the v0.2 state-of-the-game audit
([`2026-06-28-state-of-the-game-v0.2.md`](../../project/audit/reports/2026-06-28-state-of-the-game-v0.2.md)) against the
tier reshape (**D-048…D-055**); a verification workflow confirmed the reshape had already closed almost every audit
item, and this batch resolves the residuals + records the forward calls. Full intent record (23 numbered decisions):
**[`2026-06-29-decision-session.md`](../../project/human-feedback/2026-06-29-decision-session.md)**. These ADRs are **LOCKED
canon** (governing per **D-022**) but are **NOT yet applied to `prd.md` / the living docs / code** — they ripple in ONE
batch with the D-048…D-055 reshape. **Op-model v2 was reviewed** (2026-06-29 H-item session) and initially ~~deferred (**D-070**)~~ — but
**⛔ SUPERSEDED 2026-06-29 by D-072–D-074:** the human reopened it as **"v2 FINAL"** and **ADOPTED** the bundle —
full-`verify` pre-commit + drift guard (**D-072**, superseding the D-070 deferral + the D-071 subset hook), the
mandatory `diverge` gate (**D-073**), and the `playcheck` ratchet (**D-074**). The "deferred / HELD" stance no
longer holds.
**Build-order (spine-first) + carry-forward-T0 are roadmap sequencing** — they live in the
roadmap plan ([`../../project/archive/2026-06-29-roadmap-reaxe-proposal.md`](../../project/archive/2026-06-29-roadmap-reaxe-proposal.md)), not a
design ADR.

### D-056 ✅ — Real D-049 pacing ships as the default; a DEV-only speed toggle replaces the DEMO/REAL profile fork
- **created_date:** 2026-06-29
- **Context:** D-047 shipped the v0.2 demo with a DEMO/REAL balance-profile fork and left **DEMO as the shipped default**, deferring the real choice to the human (H1). The reshape's **D-049** already locked the real pacing shape (T0 ~10–15 min/rung, floor-exempt; the signed ≥30-min/rung floor binds from T1). H1 now resolves.
- **Options:** (A) keep DEMO as the shipped default · (B) ship REAL D-049 pacing as the default + a DEV-only time-multiplier for review/playtest velocity · (C) a runtime DEMO/REAL toggle exposed in production.
- **Decision:** **(B)** Ship the **real D-049 pacing as the default** (the actual game players get). Review/playtest velocity comes from a **DEV/debug-only 2×/4×/8× speed toggle** — a pure *time multiplier*, **not** a second balance profile. The DEMO/REAL profile fork is retired.
- **Why:** A shipped game should run at its real, tuned pace; a profile fork risks demo balance leaking to players and doubles the tuning surface. A time multiplier gives the agent fast headless review without forking the numbers — same balance, faster clock.
- **Consequences:** **SUPERSEDES D-047's "DEMO profile stays the shipped default" consequence** (annotated there). Remove the DEMO/REAL profile fork; D-049's pacing becomes the only profile. The 2×/4×/8× toggle is DEV-only and stripped from prod (bundled in **D-067**'s dev tools). prd.md **§4.8**. **✅ CODE APPLIED at M2·8 (2026-06-29, session-19):** the fork is retired across 14 files — `RUNG_METER_THRESHOLDS` is one re-derived single profile (R0 1100 ≈5-min cold-open · R1 2150 ≈10m · R2 2600 ≈12m · R3–R7 2800→3400; sim-verified R0=4.88/R1=10.0/R2=12.1 min), T0 is ≥30-floor-EXEMPT (gated instead on the sane band [3,22] min), the `balanceProfile` state field + boot resolver are gone, the DEV speed toggle + teleports are KEPT (the human confirmed DEV tools are permanent until ship). Magnitudes are LIQUID (D-059) — tuned by playtest. Per **D-022**, governs.

### D-057 ✅ — Win-rate: analytic for the gate, fixed-seed sampled for the display (amends signed D-043)
- **created_date:** 2026-06-29
- **Context:** Human-signed **D-043** locked "win-rate = analytic, not sampled." The reshape build (D-046/D-047) actually uses a fixed-seed *sampled* forecast (`combat.foeForecasts`) for the displayed/guard-tested win-rate. A provisional build ADR must not silently override a signed lock, so the split is blessed explicitly.
- **Options:** (A) analytic everywhere (as D-043 reads) · (B) sampled everywhere · (C) **split — analytic for the tier/gate check, fixed-seed sampled (n=400) for the displayed win-rate**.
- **Decision:** **(C)** The **tier/gate** check stays **analytic**; the **displayed** win-rate is **fixed-seed sampled (n=400)**. Codify the invariant **displayed == tested == same-for-every-player** — the same fixed seed for everyone, so the number a player sees is the number the guard test asserts.
- **Why:** Analytic is the right exactness for a gate threshold; a fixed-seed sample is what the actual combat resolver produces, so displaying it keeps the shown number honest to lived play — and a fixed seed makes it deterministic and identical for every player and the test.
- **Consequences:** **AMENDS the human-signed D-043** (annotated there — its blanket "analytic, not sampled" now scopes to the gate only). Blesses `combat.foeForecasts` (D-046/D-047) as canon for the displayed win-rate. prd.md **§4.6 / §6**. **PRD/docs/code application PENDING.** Per **D-022**, governs.

### D-058 ✅ — The signed 20–35% SINGLE-fight win-rate band stands under the HP-carry model (ratifies D-016/D-035)
- **created_date:** 2026-06-29
- **Context:** **D-050** made combat HP carry between fights and heal by eating. That changes the *grind* (a run of fights), so the question arose whether the human-signed first-fight win-rate band (**D-016**, re-measured at adequate satiety by **D-035**) needs re-expression under HP-carry.
- **Options:** (A) re-express the criterion as a multi-fight / run-survival rate under HP-carry · (B) **keep the signed 20–35% SINGLE-fight band unchanged**.
- **Decision:** **(B)** KEEP the signed **20–35% single-fight win-rate** as the first-fight criterion. HP-carry (D-050) affects the *grind*, not the discrete first-fight moment; the agent tunes a real foe into band at realistic durability/satiety under the new model, backed by a RED-able test. No re-expression — the signed single-fight band stands.
- **Why:** The first fight is one discrete, humbling encounter (the mediocre-start beat, **D-003**); HP-carry is a between-fight resource, orthogonal to a single fight's odds. The signed band is a clean, testable criterion with no reason to re-litigate.
- **Consequences:** **RATIFIES D-016 + D-035** (neither changes); the first-fight test asserts the 20–35% band at satiety ≥~0.7 under HP-carry. Pairs with **D-050** (HP-carry is the grind model, not the first-fight model). prd.md **§4.6**. **PRD/docs/code application PENDING.** Per **D-022**, governs.

### D-059 ✅ — Keep the PRD LIQUID through v1; defer the §1 freeze to end-of-v1 (refines D-020/D-021/D-046)
- **created_date:** 2026-06-29
- **Context:** D-020 → D-021 → D-046 set a path: freeze §1 + locked intent as a tagged vision snapshot *after the first build-play cycle*, exploding the rest into living docs. That trigger fired (D-046) but the §1 freeze stayed queued. The reshape (D-048…D-055) then moved much of the spine, so the human re-times the freeze.
- **Options:** (A) freeze §1 now (the queued step) · (B) **keep the PRD open/liquid through T0/T1/T2 (possibly T3); do NOT freeze §1 now; convert the WHOLE PRD into living docs once v1 is fully implemented + play-tested** · (C) never freeze / never explode.
- **Decision:** **(B)** Keep the PRD **liquid through T0–T2 (maybe T3)**. **Do NOT freeze §1 now.** The one-way freeze door moves to **end-of-v1**: once v1 is fully built + play-tested, convert the whole PRD into living docs. (The mechanical PRD-file split into per-section files — feedback #6 — proceeds with the batched ripple; that's structure, not a freeze.)
- **Why:** Freezing §1 mid-build risks locking intent that contact with play may still steer (the D-019 fun-as-hypothesis discipline); the safest moment to crystallize the vision is when v1 has actually survived play. The earlier "freeze after first cycle" was premature given how much the reshape moved.
- **Consequences:** **REFINES (does not delete) D-020, D-021, D-046** (annotated in each — the queued §1 vision-freeze now waits for end-of-v1). The locked-intent constraints (no-magic · mediocre-start · trade ≤⅓ · active-only · the four pillars · the estate spine · the signed acceptance targets) still hold as canon; they are simply not yet snapshot-frozen. M2–M7 stay provisional as ever. **PRD/docs application PENDING.** Per **D-022**, governs.

### D-060 ✅ — Roadmap re-axed as nested Tier → Milestones → Fun-slices (not a flat S0–S4)
- **created_date:** 2026-06-29
- **Context:** The roadmap needed re-axing post-reshape. A flat S0–S4 staging was considered and rejected (the human has no S0–S4 context, and a flat list doesn't map onto the tier spine).
- **Options:** (A) flat S0–S4 stages · (B) **a two-level, per-tier structure — for each v1 tier (T0/T1/T2/T3): N milestones; within each milestone: N fun-slices**.
- **Decision:** **(B)** Re-axe the roadmap as **nested Tier → Milestones → Fun-slices**. Each tier gets N milestones; each milestone gets N fun-slices, where a **fun-slice ships a playable, *fun* increment** (not just a feature). Claude proposes the cut.
- **Why:** Nesting under the tier spine (D-007/D-048) keeps the roadmap legible against the actual game structure, and forces every increment to be playable-and-fun rather than a feature checkbox — the audit's #1 lesson (a chassis with no engine).
- **Consequences:** `docs/living/roadmap.md` is re-axed to the nested shape (proposal: [`../../project/archive/2026-06-29-roadmap-reaxe-proposal.md`](../../project/archive/2026-06-29-roadmap-reaxe-proposal.md)). **Build-order (spine-first) + carry-forward-T0 are sequencing details that live in that roadmap plan, NOT this ADR.** Milestone count / fun-slice granularity / naming are delegated to Claude. **Docs application PENDING.** Per **D-022**, governs.

### D-061 ✅ — Difficulty is humbling THROUGHOUT (incl. T0); distinct from D-049 pacing
- **created_date:** 2026-06-29
- **Context:** The v0.2 audit's default was to "tame the early friction." The human reversed that: the mediocre-start bite is the point and must persist, including in the tutorial tier.
- **Options:** (A) smooth the early durability/satiety/on-ramp friction (the audit default) · (B) **keep difficulty humbling throughout, incl. T0**.
- **Decision:** **(B)** Difficulty stays **humbling throughout** — keep the mediocre-start bite; don't smooth the durability/satiety friction or the on-ramp. **Distinct from pacing:** D-049's T0 *fast* pacing (~10–15 min/rung) still holds — **T0 is quick but NOT easy**. Guardrails stay: always winnable, soft-setback only, no permanent loss, no true dead-ends / stranding.
- **Why:** The zero-to-competent-through-effort fantasy (**D-003**) requires real friction; an easy on-ramp betrays it. Fast ≠ easy — short rungs can still bite. The guardrails keep humbling from tipping into unfair.
- **Consequences:** Do NOT tame early friction (revises the audit default); the durability/satiety/on-ramp tuning keeps its bite within the winnable / soft-setback / no-dead-end guardrails (**D-011/D-016**). Pairs with **D-049** (pacing) as an independent axis. prd.md **§4** (difficulty). **PRD/docs/code application PENDING.** Per **D-022**, governs.

### D-062 ✅ — The first tier ascension (T0→T1) is a BIG ceremonial beat, always big on first contact
- **created_date:** 2026-06-29
- **Context:** **D-049** made ascension a manual opt-in story event with a grade-scaled boon. The human added that the *first* ascension specifically must land as a big ceremonial beat regardless of grade.
- **Options:** (A) scale all ascension ceremony by grade (a thin first ascension if barely-gated) · (B) **the first ascension is ALWAYS a big ceremonial beat on first contact; grade-scaling layers onto later ascensions**.
- **Decision:** **(B)** The **T0→T1 ascension always lands big on first contact** — Yuji Syuku title card, macro silhouettes stir, a dream/mystery beat (**D-055**), music swell, the grade-scaled boon revealed. **Overshoot-grade scaling can layer onto *later* ascensions; the first is always big.**
- **Why:** The first tier crossing is the moment the macro spine becomes real — under-selling it (because the player barely cleared the gate) would waste the game's biggest structural reveal. Later ascensions can lean on grade-scaling for variety once the beat is established.
- **Consequences:** **REFINES D-049** (the first ascension's *ceremony* is grade-independent; D-049's grade-scaled *boon magnitude* still applies). Uses **D-055**'s per-tier dream/mystery beat + the Yuji Syuku hero font (**D-018**). prd.md **§5** (ascension beats). **PRD/docs/code application PENDING.** Per **D-022**, governs.

### D-063 ✅ — Onboarding = a diegetic mentor (in-world teaching), lifting the audit onboarding ding within non-hand-holding
- **created_date:** 2026-06-29
- **Context:** The v0.2 audit dinged onboarding (5.5). **D-015** locked non-hand-holdy teaching, so the fix must lift onboarding *without* breaking that.
- **Options:** (A) tutorial popups / explicit tutorialization · (B) **a diegetic mentor — an in-world character teaches each system through dialogue & story as it unlocks** · (C) leave onboarding as-is.
- **Decision:** **(B)** A **diegetic mentor** (e.g. drillmaster Kihei / an estate elder) teaches each system through **dialogue & story** as it unlocks — onboarding via narrative, fully non-hand-holdy. Lifts the 5.5 ding without tutorial popups, and adds character + grounds the cast.
- **Why:** A mentor character is the natural, in-world way to teach an Edo-estate game — it both onboards and deepens the narrative, where a popup would break immersion and violate D-015. Reuses existing cast (Kihei, **D-046**) rather than adding UI chrome.
- **Consequences:** Upholds **D-015** (non-hand-holdy) and **D-064** (no popups). Authoring: mentor dialogue lines keyed to each system's unlock (data per **D-039**). prd.md **§2 (onboarding) / §5 (cast)**. **PRD/docs/code application PENDING.** Per **D-022**, governs.

### D-064 ✅ — T0 tutorial stays non-hand-holdy (D-015 upheld even in the tutorial)
- **created_date:** 2026-06-29
- **Context:** The natural temptation is to make the *tutorial* tier hand-holdy even though D-015 bans it elsewhere. The human upheld D-015 for T0 too.
- **Options:** (A) allow hint popups / explicit tutorialization in T0 only · (B) **uphold non-hand-holding even in the tutorial**.
- **Decision:** **(B)** T0 **stays non-hand-holdy** — no hint popups. Teach by **reveal-as-plot + world discovery + legible-by-design surfaces**. **Constraint:** the audit's onboarding ding (5.5) must be fixed *within* non-hand-holding — clearer reveal beats + touch-legible readouts, NOT tutorialization.
- **Why:** A hand-holdy tutorial sets the wrong tone for a discovery-driven game and contradicts D-015; legible-by-design + the diegetic mentor (**D-063**) achieve onboarding without popups.
- **Consequences:** **UPHOLDS D-015** in T0; pairs with **D-063** (the diegetic mentor is the teaching vehicle). The onboarding fix is reveal-clarity + touch-legible readouts, not popups. prd.md **§5 (T0) / §2 (legibility)**. **PRD/docs/code application PENDING.** Per **D-022**, governs.

### D-065 ✅ — T0 areas = a small WALKABLE map (refines D-052's "room-grouped areas")
- **created_date:** 2026-06-29
- **Context:** **D-052** resolved T0 areas as "room-grouped" (organizational grouping). The human upgraded this: T0 should deliver the §1 "areas to explore" promise as an actual small walkable map.
- **Options:** (A) keep room-grouped organizational areas · (B) **a small WALKABLE map in T0**.
- **Decision:** **(B)** T0 ships a **small walkable map** (not just organizational room-grouping), delivering the §1 "areas to explore" promise in the tutorial — consistent with **D-012** full-maps-every-tier.
- **Why:** A walkable map makes exploration real from the first tier (the §1 promise) and gives reveal-as-plot / world-discovery onboarding (**D-064**) an actual world to discover. More build cost, accepted.
- **Consequences:** **REFINES D-052** (T0 "room-grouped areas" → a small walkable map; annotated there). More build cost — sequence so it doesn't crowd out spine-first (the roadmap plan's build order, **D-060**). prd.md **§5 (T0 areas) / §1.7**. **PRD/docs/code application PENDING.** Per **D-022**, governs.

### D-066 ✅ — Koku flywheel is LINEAR in T0, branches into LAND/TREASURY/TRADE sub-engines at T1 (refines D-051/D-033)

> 🔁 **Re-scoped 2026-07-02 by [D-107].** The "koku flywheel" is now the **RICE→COIN** flywheel
> (labour yields rice + a little coin; upgrades cost **COIN**). The LINEAR-T0 →
> LAND/TREASURY/TRADE-at-T1 branching and the trade ≤⅓ cap are unchanged; koku becomes the House
> STANDING, never spent.
- **created_date:** 2026-06-29
- **Context:** **D-051** made koku a compounding estate-upgrade flywheel feeding the Estate pillar's LAND/TREASURY sub-engines. *When* the depth arrives was open: T0 is a tutorial (D-052 showcase-in-miniature).
- **Options:** (A) full LAND/TREASURY/TRADE depth from T0 · (B) **a small LINEAR estate-upgrade taste in T0; branch into the LAND/TREASURY/TRADE sub-engines at T1**.
- **Decision:** **(B)** T0 ships a **small LINEAR estate-upgrade taste** (a single reinvestment line — work → koku → upgrade → more output); the flywheel **branches into the LAND / TREASURY / TRADE sub-engines at T1** where the depth matters (**D-008**, **trade ≤ ⅓** of Estate & Wealth preserved).
- **Why:** A linear taste teaches the reinvestment loop without front-loading T1's depth (matches **D-052** showcase-in-miniature); branching at T1 gives the full tier real new toys. The trade-⅓ structural cap stays intact.
- **Consequences:** **REFINES D-051 + D-033** (the compounding flywheel is linear in T0, branched at T1; annotated in both). The trade ≤⅓ invariant (**D-008**) and the `G-NO-DEAD-VALUES` ratchet still apply. prd.md **§1.6.1 / §4 (economy) / §5 (T0 vs T1)**. **PRD/docs/code application PENDING.** Per **D-022**, governs.

### D-067 ✅ — Dev tools (speed toggle + jump-to-rung/tier) + save policy (wipe dev saves; build+test migrate before launch) — refines D-013a
- **created_date:** 2026-06-29
- **Context:** Two build/scope calls, bundled: (1) the highest-value DEV affordances to add now; (2) what to do with the v0.2 save schema on the reshape bump. There are no production users yet.
- **Options:** *Dev tools* — a rich dev console / **the speed toggle + a jump-to-rung/tier teleport** / none. *Saves* — write full migrations across dev churn / **wipe dev/v0.2 saves on the reshape bump, build+test the real `migrate()` before launch**.
- **Decision:** **Dev tools = the DEV-only 2×/4×/8× speed toggle (D-056) + a jump-to-rung/tier state-jump teleport** — the highest-value pair; defer richer affordances until a specific test needs them; **DEV-only, stripped from prod.** **Save policy = WIPE dev/v0.2 saves on the reshape schema bump** (pre-launch, no users); **build + test the real `migrate()` path before launch**, not across dev churn. (D-013a's forward-migration still governs *shipped* saves.)
- **Why:** Speed + teleport unblock fast playtest/QA of any rung or tier without hand-grinding; a rich console isn't worth it yet. Writing migrations across volatile dev schemas is wasted effort with zero users — wipe now, and invest the migration rigor where it counts (the real launch-onward path).
- **Consequences:** **REFINES D-013a** (its forward-migration chain now scopes to shipped/launch saves; dev/v0.2 saves are wiped at the reshape bump; annotated there). The speed toggle is shared with **D-056**; both dev tools extend the DEV-only `window` play-API and are stripped from prod. Build + test `migrate()` before launch (a launch gate). prd.md **§6.8 (saves) / §6 (dev API)**. **PRD/docs/code application PENDING.** Per **D-022**, governs.

### D-068 ✅ — A synthesized traditional Japanese SFX palette; a minimal SFX pass before the R1 taste call
- **created_date:** 2026-06-29
- **Context:** **D-041** put a small synthesized Web Audio set in scope but didn't fix the palette or the timing. The human chose both: a traditional Japanese instrument palette, and a minimal SFX pass before the human's R1 taste verdict.
- **Options:** *Palette* — generic UI blips · **a traditional Japanese instrument palette** · a full orchestral bed. *Timing* — full bed up front · **a minimal SFX pass before R1, the full bed later** · audio last.
- **Decision:** **A synthesized traditional Japanese SFX palette** — **taiko** (combat), **shamisen / koto** (UI/deeds), **shakuhachi** (big beats), **temple bell / 鈴** (rank-ups) — anti-slop, matching the woodblock bible (**D-018**). A **minimal SFX pass** (hit / reward / rank-up cues) lands **before the R1 taste call**; the full synthesized bed comes later.
- **Why:** A traditional palette is the audio analogue of the woodblock visual discipline — the defence against generic-AI-slop in sound; landing minimal SFX before R1 gives the human's taste verdict real audio to judge without blocking on the full bed.
- **Consequences:** Sequences within **D-041**'s in-scope audio (annotated there); drives the minimal SFX pass ahead of R1. Web Audio synthesis (honours D-041's synthesized-audio posture). prd.md **§ audio**. **PRD/docs/code application PENDING.** Per **D-022**, governs.

### D-069 ✅ — Durable-by-default: a plan/brainstorm/analysis is a committed FILE before it's a deliverable
- **created_date:** 2026-06-29
- **Context:** The Operating-Model-v2-lite reel-back existed only in session context, not as a committed file — a near-miss showing work can be lost if it isn't on disk. (A durable-process decision, already applied to CLAUDE.md this session.)
- **Options:** (A) capture plans/analyses inline in chat / a ledger · (B) **a plan/brainstorm/analysis is a committed FILE before it's a deliverable or implemented**.
- **Decision:** **(B)** Durable-by-default: a plan/brainstorm/analysis is a **committed file** before it's a deliverable or implemented — never only in chat or a ledger. Homes: **`project/brainstorms/`** (discovery) · **`docs/plans/`** (plans/reel-backs) · **`docs/`** (settled).
- **Why:** Session context is ephemeral — it dies with the session or a compaction; a committed file is the only durable record. The v2-lite near-miss proved the rule's worth.
- **Consequences:** Already applied to **CLAUDE.md** (the durable-capture + temp-files conventions); recorded here as durable process canon. `docs/plans/` joins `project/brainstorms/` and `docs/` as a recognised home. Per **D-022**, governs.

### D-070 ⛔ — Operating Model v2 deferred as a bundle; process improvements adopted ad hoc (closes H7/H9/H10) — REVERSED by D-072 (2026-06-29)

> ⛔ **Reversed 2026-06-29 by [D-072].** The human reopened op-model v2 as **"v2 FINAL"** this session and
> **adopted** the bundle — full-`verify` pre-commit (D-072), the mandatory `diverge` gate (D-073), the
> `playcheck` ratchet (D-074), the fun-slice roadmap re-axe (D-060). The deferral + the "diverge/playcheck
> **HELD**" stance recorded below **no longer hold**. History kept intact (annotate-don't-delete).

- **created_date:** 2026-06-29
- **Context:** **H10** queued the full **Operating Model v2-lite** bundle (the keystone process overhaul — pre-commit `verify`, `playcheck` ratchet, mandatory `diverge` gate, ship-gate, re-axed roadmap) for a separate human review; **H7** (a bespoke `ship-gate` skill) and **H9** (a `resolve-queue` skill) were absorbed into it. The human walked the queue live (2026-06-29 H-item session) and decided the bundle's adoption.
- **Options:** (A) adopt the v2-lite bundle wholesale · (B) **defer the bundle; greenlight useful pieces ad hoc** · (C) reject outright.
- **Decision:** **(B)** **Defer** the v2-lite bundle. **Not a freeze** — useful pieces are greenlit piecemeal as they come up (the `tdd` skill and the lean pre-commit gate **D-071** were both greenlit this way). **H7 and H9 both resolve to DON'T-BUILD:** **D-054**'s milestone-integrity policy + CI-manifest check already own the ship-gate *policy* (no bespoke skill), and decision queues are resolved **by hand** (demonstrated this very session via `AskUserQuestion`).
- **Why:** The bundle's value is real but unproven and its harness cost is ~1 week; piecemeal adoption captures the wins without committing to the whole. Bespoke automation (ship-gate, resolve-queue skills) isn't worth building until the pain actually recurs.
- **Consequences:** **Closes H7, H9, H10.** The mandatory `diverge` UI gate (DS#10) and the `playcheck` ratchet remain **HELD** (not adopted) and ride with the fuller v2-lite if it's ever revisited — the trigger is the hand-holding cost resurfacing. Intent: [`../../project/human-feedback/2026-06-29-h-item-decisions.md`](../../project/human-feedback/2026-06-29-h-item-decisions.md). Per **D-022**, governs.

### D-071 ⛔ — A lean, content-aware (<5s) pre-commit gate (the one v2-lite piece greenlit; built) — REVERSED by D-072 (2026-06-29)

> ⛔ **Reversed 2026-06-29 by [D-072].** Measurement showed the **full `verify` runs in ~3s**, so the
> content-aware *subset* was replaced by running the **whole** suite every commit (incl. the test suite this
> hook deliberately skipped — its blind spot) + a drift guard. The journal-hygiene gate is **retained**.
> History kept intact.
- **created_date:** 2026-06-29
- **Context:** The single Operating-Model-v2 piece the human greenlit (reshaped to a lean spec — forks **D-a/D-d** in the 2026-06-29 H-item session), separable from the deferred bundle (**D-070**). Evidence it was needed: M1 shipped with claimed pacing/fun instrumentation absent and the audit found a false-green test suite.
- **Options:** (A) run the full `verify` (test suite) on every commit · (B) **a content-aware fast (<5s) subset that runs only what's relevant to the staged files** · (C) no gate (keep the journal-only hook).
- **Decision:** **(B)** A content-aware **<5s** pre-commit subset: staged `.ts` → `tsc --noEmit`; staged `.ts/.md/json/css/html` → `prettier --check` (staged only); staged `src/**` → a pure-core **boot smoke**; then the unchanged journal-hygiene gate. **NOT the full test suite.** Bypass: `SKIP_VERIFY=1` (checks) / `SKIP_JOURNAL=1` (journal).
- **Why:** A fast gate runs on every commit without friction; the full suite is too slow for a per-commit gate (it belongs in CI / `verify`). The pure-core boot smoke catches "dumb stuff" (a core that won't boot) cheaply.
- **Consequences:** **Built this session** — [`../../.githooks/pre-commit`](../../.githooks/pre-commit) + [`../../src/scripts/smoke.ts`](../../src/scripts/smoke.ts), measured **~0.87s** on a TS+core commit. Complements **D-054** (milestone-integrity / CI-manifest, which stays the heavier CI-side check). The fuller `playcheck` ratchet stays deferred with the v2-lite bundle (**D-070**). Intent: [`../../project/human-feedback/2026-06-29-h-item-decisions.md`](../../project/human-feedback/2026-06-29-h-item-decisions.md). Per **D-022**, governs.

### D-072 ✅ — Operating Model v2 ADOPTED ("v2 FINAL"): full-`verify` pre-commit + a 5s drift guard (supersedes D-070, D-071)
- **created_date:** 2026-06-29
- **Context:** D-070 *deferred* the v2-lite bundle and D-071 built a content-aware **<5s subset** hook (deliberately **not** the test suite). This session the human reopened the question as **"Operating Model v2 FINAL"** and directed building it — full `verify` in pre-commit (5s budget), `playcheck`, the mandatory `diverge` gate, the fun-slice roadmap re-axe — and explicitly noted the existing hook to upgrade. Newest-human-steer-wins.
- **Options:** (A) keep D-070's deferral + D-071's subset · (B) **adopt v2 FINAL — run the full `verify` every commit (measured ~3.2s, fits the 5s box) + a noisy-but-non-blocking drift guard.**
- **Decision:** **(B).** Pre-commit runs the **full `npm run verify`** (~3.2s measured — incl. the test suite D-071 skipped, its blind spot), wrapped in a soft 5s **drift timer** (green/amber/red; logs `tmp/precommit-timings.tsv`; **never blocks on time**). `SKIP_VERIFY=1` bypasses a docs-only commit. The hard budget check is the explicit **`npm run verify:budget`** (per-gate breakdown + median-of-3); a non-blocking `pre-push` surfaces it loudly. Principle: noisy about drift, never blocking the task in flight.
- **Why:** Measurement reversed D-071's premise — the whole suite runs in ~3s, so the content-aware subset bought nothing and cost the test-suite blind spot. Run everything; let the drift guard catch the budget creeping as the codebase grows.
- **Consequences:** **⛔ REVERSES D-070 and D-071** (both annotated). Built this session: [`../../.githooks/pre-commit`](../../.githooks/pre-commit), [`../../src/scripts/verify-run.ts`](../../src/scripts/verify-run.ts), [`../../.githooks/pre-push`](../../.githooks/pre-push). **Un-holds** the `diverge` gate (**D-073**) and the `playcheck` ratchet (**D-074**) that D-070 had held; the roadmap half is **D-060**. Plan: [`../../project/archive/2026-06-29-operating-model-v2-final.md`](../../project/archive/2026-06-29-operating-model-v2-final.md). **Refined 2026-06-29:** the gates run in **PARALLEL** via `verify-run.ts` (comfortably under the 5s box; exact wall-time drifts as the codebase grows — check it with `verify:budget` = `verify-run --budget`, don't hard-code a figure). Per **D-022**, governs.

### D-073 ✅ — Design by divergence: a mandatory `diverge` gate for new/major UI surfaces (branch-preserved)
- **created_date:** 2026-06-29
- **Context:** DS#10 locked the `diverge` skill as a mandatory UI gate, but D-070 held it unadopted; the v2-FINAL adoption (**D-072**) un-holds it. The risk the human flagged: self-pick + an R-item means losing variants pile up as **feature-flag debt** that rots the build.
- **Options:** (A) one-idea UI (status quo) · (B) opt-in variants · (C) **mandatory 2–3-variant `diverge` with a bounded, branch-preservation flag model.**
- **Decision:** **(C).** No new/major UI surface ships from a single idea: `diverge` generates 2–3 distinct *approaches* → headless contact sheet → **self-picks** (autonomy) → files an **R-item** for human override (never blocks). **The winner collapses into `main` flag-free; losing variants live on a retained `diverge/<surface>` branch + committed screenshots** → `main`'s resting flag-debt is **zero**. Caps: 3 open diverges, 2 durable kept-flags. One-line tweaks exempt.
- **Why:** The human wants to see "3 of everything" for taste/anti-slop, but mandatory variants must not rot the build — branch-preservation gives true live A/B with zero `main` debt.
- **Consequences:** Promotes **DS#10** to canon (was HELD by D-070). Skill: [`../../.claude/skills/diverge/SKILL.md`](../../.claude/skills/diverge/SKILL.md); registry [`../../project/audit/variants-log.md`](../../project/audit/variants-log.md). Supporting infra (`qa-shots --variant`, `variant-gc.mjs`, the pre-commit isolation guard) builds JIT on the first diverge. CLAUDE.md gains the rule. Per **D-022**, governs. **⤴ REFINED by D-075 (2026-06-30):** variants now live in-codebase behind a **DEV-panel toggle** (not branch screenshots); full 2–3 variants always (**diverge-LITE retired**); **one review.md line item per variant**.

### D-074 ✅ — Experience is a continuous ratchet (`playcheck`), scoped to the proxies nothing else gates
- **created_date:** 2026-06-29
- **Context:** The fun-factor §3 vector was slated to "become a gate at M6"; with v2 adopted (**D-072**) it becomes **continuous**. D-070 had held the `playcheck` ratchet.
- **Options:** (A) audit fun manually at a milestone · (B) **a scoped headless ratchet in `verify` every commit.**
- **Decision:** **(B).** `playcheck` asserts the §3 vector headlessly over the **real engine**, **scoped** to the two proxies nothing else gates — `firstActionMs` (the <5s cold-open hook) and `maxDeadTimeMs` (no-dead-time) — with a 3×-baseline / 2s-floor ratchet + a 5s hard cap on the hook. `minutesPerRung` stays owned by `pacing:check` and the combat win-curve by `m2.test` (no double-gating). Absolute per-slice thresholds attach when a roadmap fun-slice ships.
- **Why:** Hollowness should fail the build *continuously*, not wait for a milestone audit; scoping avoids redundancy with the gates that already exist.
- **Consequences:** Un-holds the `playcheck` ratchet (was HELD by D-070). Built: [`../../src/playcheck.ts`](../../src/playcheck.ts) + `playcheck.baseline.json` + a teeth test, wired into `verify`. The deferred ~4 proxies + threshold mode ride the roadmap's fun-slices (**D-060**). Per **D-022**, governs.

## D-075…D-080 — 2026-06-30 R4, variant-process & operating-philosophy decisions (post-v0.3-playtest, human-steered) ⏳ build PENDING

> Source capture: [`../../project/human-feedback/2026-06-30-r4-playtest-decisions.md`](../../project/human-feedback/2026-06-30-r4-playtest-decisions.md).

### D-075 ✅ — Diverge v2: full variants, live in a DEV panel, one review item per variant (refines D-073)
- **created_date:** 2026-06-30
- **Context:** v0.3's diverges exposed two gaps in D-073. (a) Under the overnight time-box, three breadth surfaces shipped a single-idea **"diverge-LITE"** instead of 2–3 variants — the human rejected the shortcut (_"full 2–3 variants or nothing"_). (b) Branch-preserved **screenshots** are not how the human reviews taste — they can't *see* a variant in the running UI (_"how do I view variants… can we have a dev panel… add all the variants with a toggle"_).
- **Options:** (A) keep D-073 (branch + screenshots) · (B) variants live in-codebase behind a DEV-only toggle, reviewed live in the UI · (C) ship all variants to prod behind a flag.
- **Decision:** **(B), refining D-073.** Every new/major UI surface still gets **FULL 2–3 working variants** — **"diverge-LITE" is RETIRED** (no single-idea shortcut, no buggy variants shipped). Variants now live **in the codebase**, switchable at runtime via a **DEV panel** (DEV-only, `import.meta.env.DEV`, stripped from prod) — the human reviews them **live in the running UI**. **Each variant in the codebase = its own line item in `human-in-the-loop/review.md`** (reviewed/picked per variant via the toggle). The agent still self-picks a coherent prod default; the toggle keeps the alternates for review until the human confirms.
- **Why:** The human reviews taste by *seeing it move*, not via screenshots; the shared working tree also makes D-073's `diverge/<surface>` branch-switching unsafe (v0.3 already fell back to folder/screenshot preservation). DEV-only variants give live A/B with **zero PROD flag-debt** (prod ships only the default).
- **Consequences:** **REFINES D-073** (annotated there): branch-preservation → in-codebase DEV-toggle; "zero main flag-debt" → "zero **PROD** flag-debt" (DEV carries the toggles). Build a **DEV panel** (the speed toggle + teleports + the variant switches). Update the `diverge` SKILL.md (kill LITE; add the panel + per-variant review item), the variants-log, CLAUDE.md, and review.md. Per **D-022**, governs.

### D-076 ✅ — Combat is HP-attrition; NO auto-heal; a lost fight stops autopilot (R4#3)
- **created_date:** 2026-06-30
- **Context:** v0.3 auto-combat auto-heals between fights + only fights the matchup you pick, so the D-050 "a fight you might lose" tension became background maintenance (battery MAJOR / R4#3).
- **Decision:** A fight is a visible **HP-attrition exchange** — you attack, the enemy attacks back, both lose HP until one reaches **0 = death**. The auto-loop must **NOT auto-heal** (remove the `main.ts` HP-management). Reaching **0 HP = a lost fight**, and a loss **stops auto-combat** (no grinding at the floor). Eating is still the only mend (D-050), now a real pre-fight decision.
- **Why:** Verbatim human direction; restores the stakes — combat is something you can lose, and you must choose to heal (eat) before risking a fight. Supersedes the v0.3 auto-heal loop.
- **Consequences:** Rework `fight.ts` (ensure the attrition model is legible) + the `main.ts` auto-loop (drop auto-heal; stop autopilot on a loss). Re-bless playcheck/pacing if the win-curve shifts. Per **D-022**, governs.

### D-077 ✅ — Standing/pillars are DEED-based (never wealth); koku is a tight, sink-heavy economy (R4#6)

> 🔁 **Split / re-scoped 2026-07-02 by [D-107].** The **deed-based-standing** clause becomes the
> **koku law** (standing = the koku prestige score, earned by DEEDS, never by wealth). The
> **tight, sink-heavy economy** clause re-labels **koku → COIN** (COIN is the deliberately scarce
> currency — not rich until T5). RICE is now its own resource; koku standing is immune to wealth.
- **created_date:** 2026-06-30
- **Context:** v0.3's estate deed is a flat per-act value (good) but koku has too few sinks (~1378 lifetime) and surplus materials pile up; the battery asked whether to couple wealth→standing. The human said NO.
- **Decision:** **Standing and the House-Influence pillars stay purely DEED-based** (earned by actions) — **never** coupled to koku/wealth. Separately, **koku is a deliberately tight economy: always more sink opportunity than income**, so the player is **not rich until T5**. (This reframes "koku runs dry / surplus materials" as INTENDED — add more sinks so koku is always worth spending.)
- **Why:** Verbatim human direction; keeps the moral/perseverance spine (you rise by deeds, not by getting rich) and makes koku a meaningful constrained resource through T0–T4.
- **Consequences:** Do NOT add a koku→deed commission. Add koku sinks (a second craft recipe / material-funded repair / upgrades / market depth) + retune income vs. sinks so net koku stays low. Reaffirm the no-wealth-coupling in the pillar/ascension code (already true). Re-derive at the balance gate (liquid, D-059). Per **D-022**, governs.

### D-078 ✅ — At least one breadth surface is LOAD-BEARING; first = a map node gating a deed/yield (R4#5)
- **created_date:** 2026-06-30
- **Context:** v0.3's map gates nothing mechanically, the lone quest + market are one-time reveals (battery "breadth-as-chrome" / R4#5). The human chose to fund ≥1 load-bearing surface, starting with the map.
- **Decision:** T0 breadth is **not pure chrome** — **≥1 surface carries mechanical weight**. **First: a map node gates a deed source or a better yield** (walking there unlocks it), tying the **map to standing via deeds** (per D-077, not koku). Others (quest branch, etc.) can follow.
- **Why:** Human direction; gives the map a real reason to exist + a first taste of place-gated progression. Consistent with D-077 (deed-based standing).
- **Consequences:** Add a deed/yield gated on a map node (`content/map.ts` + the labour/deed path). The post-ascension stale-panel (R4#5-adjacent) is folded into the breadth/after-state work. Per **D-022**, governs.

### D-079 ✅ — The sim is ACTIVE-ONLY (pause on hidden); resolves the D-053 contradiction (R4#1)
- **created_date:** 2026-06-30
- **Context:** D-053 (decisions.md) read as "advance by wall-time, a hidden tab catches up" in one place and "reaffirms active-only" in another; the code pauses on `document.hidden`. A signed lock pulled apart from itself + the build (battery MAJOR / R4#1).
- **Decision:** **Active-only is canon** — the sim **pauses on `document.hidden`**, NO offline/background catch-up. The code is correct; the contradictory D-053 wording is what's fixed. Consistent with D-013 (active-only, "growth only through perseverance").
- **Why:** Human direction; the active-only pillar is core (you must be playing). No code change — a documentation fix.
- **Consequences:** Annotate/fix D-053's text to read active-only-pause (drop the "wall-time catch-up" phrasing). No code change. Per **D-022**, governs.

### D-080 ✅ — There is no clock, and there are no shortcuts (operating philosophy)
- **created_date:** 2026-06-30
- **Context:** In the v0.3 overnight build (session-19), an autonomous `/loop` finished its real work in a fraction of its window, then acted as if the window were expiring — and under that **self-imposed, nonexistent time-box** shipped three single-idea "diverge-LITE" panels (the shortcut **D-075** retired). The agent paid real quality for an imaginary clock; the shortcut bought nothing.
- **Decision:** **Delete the clock, don't manage it.** The agent must **never perceive a deadline / time-box** and **never take a shortcut** (ship below the bar to save effort). Corollaries: **partial & excellent beats complete & compromised** — a half-finished loop with zero shortcuts is a success, a fully-finished loop with one lazy corner is a failure; and **pragmatism (sensible defaults) and stopping-when-done are NOT shortcuts** (the bar cuts both ways — never drop below it to save time, never gild above it to fill time). "Done" is gated by correctness + the quality bar + whether real value remains, **never by the clock**.
- **Why:** Verbatim human direction — *"I prefer correct & slow over shitty & fast"*; *"even if it's only done half the loop by the time I'm back, I'm happy — if there are no shortcuts or lazy behaviour."* Removes the completion pressure that caused the v0.3 shortcuts.
- **Consequences:** New canon doc [`../philosophy/no-clock-no-shortcuts.md`](../philosophy/no-clock-no-shortcuts.md) (the full philosophy) + a short inline `## Philosophy` lead at the top of AGENTS.md. **Generalises D-075** (no diverge-LITE) to all work. Per **D-022**, governs.

## D-081…D-085 — 2026-06-30 the operating-philosophy register (session-26 mine, human-curated)

> A 41-agent repo-wide `Workflow` mine surfaced 30 candidate philosophies; the human curated them into a **6-philosophy register** (R1–R6) in [`../philosophy/`](../philosophy/README.md), each summarised in the AGENTS.md `## Philosophy` section. Bar for inclusion (human): _"something a philosopher might say — how/why/what to reason"_ — so mechanics, git/tool-usage, and engineering guidelines were **demoted to AGENTS.md** (small commits, shared-tree git safety, pure-core, single-source-of-truth, the human's-intent-is-canon governance rule, repo-is-the-memory, the enforcement ladder), and game-design/world canon stayed in the PRD/fun-factor. Source: [`../../project/brainstorms/2026-06-30-operating-philosophies.md`](../../project/brainstorms/2026-06-30-operating-philosophies.md). R1 is **D-080**.

### D-081 ✅ — Verify, don't trust (operating philosophy R2)
- **created_date:** 2026-06-30
- **Context:** The session-26 mine surfaced "verify, don't trust" as the unwritten **second seed** (the epistemic twin of D-080), scattered across the battery skill, qa-playtesting §0, and the "verify before you claim" checkpoint rule. The human scoped it to work you did **not** author — existing files, written canon, other agents' work (the self-facing twin is **R3 / D-082**).
- **Decision:** A maker is blind to their own gaps and can't trust provenance they can't see, so existing files, canon, and other agents' work are **checked, not trusted** — against independent eyes / the gates / reality. Self-review is necessary, never sufficient. _The map is not the territory_: a doc is a claim about the build; where they differ, the build wins (fix the doc).
- **Why:** Human-curated from the mine; grounds the battery's no-self-grading rule and the D-079 doc-vs-build resolution (a signed ADR described the opposite of what shipped).
- **Consequences:** New canon doc [`../philosophy/verify-dont-trust.md`](../philosophy/verify-dont-trust.md) + a paragraph in the AGENTS.md `## Philosophy` register. Per **D-022**, governs.

### D-082 ✅ — Done is earned, not declared (operating philosophy R3)
- **created_date:** 2026-06-30
- **Context:** From the mine, the human split two facets out of R2 into a distinct **self-facing** philosophy — skepticism toward your **own** apparent success (vs R2's skepticism toward others' work). Merges _done means done_ (honest reporting / D-054) + _checks with teeth_ (a green must be able to go red).
- **Decision:** Be skeptical of your own green. Never claim done/green/shipped unless literally, verifiably true (lead with what's missing, never push red); a green check counts only if it drives the **real** player path and **could actually have gone RED**. A false green is worse than no check.
- **Why:** Human-curated; grounds **E1** (_"a test that can't go RED is worse than no test"_) + **D-054** (SHIPPED-slice banned).
- **Consequences:** New canon doc [`../philosophy/done-is-earned-not-declared.md`](../philosophy/done-is-earned-not-declared.md) + a paragraph in the AGENTS.md register. Twin of **R2 / D-081**. Per **D-022**, governs.

### D-083 ✅ — Bias to motion: act, self-vet, surface (operating philosophy R4)
- **created_date:** 2026-06-30
- **Context:** From the mine; the human kept the human-steers / agent-executes division of labour as a philosophy and chose the phrasing _"bias to motion: act, self-vet, surface."_
- **Decision:** The human owns direction, taste & the irreversible; the agent owns execution — reversible progress by default, self-picked defaults, self-vetted work, every fork **surfaced for async override** rather than waited on. Never block; never silently decide. Absorbs _autonomy is a feedback-loop problem_ (the why) and the HITL queue (the machinery).
- **Why:** Human-curated; the 7k-PRD-bought-less-autonomy lesson (operating-model-v2) + the diverge self-pick→R-item pattern (D-075).
- **Consequences:** New canon doc [`../philosophy/bias-to-motion.md`](../philosophy/bias-to-motion.md) + a paragraph in the AGENTS.md register. Per **D-022**, governs.

### D-084 ✅ — If it isn't fun, it isn't finished (operating philosophy R5)
- **created_date:** 2026-06-30
- **Context:** From the mine; the product bar (fun & intentional), scattered across **D-019**, fun-factor, qa-playtesting, ui-design — with no consolidated north-star. The human chose the phrasing.
- **Decision:** A compiling build is the floor; the bar is paced, genuinely fun, intentional (woodblock/ink, not AI-slop). Fun is a hypothesis tested by play — proxies prove its absence, only a human certifies its presence. Absorbs _intentional craft over generated defaults_ (lock the design language first) and _the player gets the real game_ (DEV conveniences stripped from prod).
- **Why:** Human-curated; D-019 + fun-factor §3 + ui-design §9.
- **Consequences:** New canon doc [`../philosophy/if-it-isnt-fun-it-isnt-finished.md`](../philosophy/if-it-isnt-fun-it-isnt-finished.md) + a paragraph in the AGENTS.md register. Per **D-022**, governs.

### D-085 ✅ — If a player can't reach it, it doesn't exist (operating philosophy R6)
- **created_date:** 2026-06-30
- **Context:** From the mine; "build discipline," sharpened by the human with the **definition of done = player-reachable**.
- **Decision:** What counts as **built** is what a human player can reach. A change living only in TypeScript — no UI, not reachable in the live MCP playtest (Playwright / Chrome-DevTools) — is **not done**; the unit of progress is a fun-complete vertical slice a player can see and use. Absorbs _lean_ (everything earns its place; `G-NO-DEAD-VALUES`) and _diverge before you converge_ (D-075).
- **Why:** Verbatim human direction (_"build ones that can be accessed by human players… not features that live in the typescript files"_); **D-078** (load-bearing breadth); the roadmap fun-slices.
- **Consequences:** New canon doc [`../philosophy/if-a-player-cant-reach-it-it-doesnt-exist.md`](../philosophy/if-a-player-cant-reach-it-it-doesnt-exist.md) + a paragraph in the AGENTS.md register. Per **D-022**, governs.

## D-086…D-088 — 2026-06-30 v0.3 process-learnings adoption (human-steered)

> The human read the v0.3 retrospective ([`../../project/brainstorms/2026-06-30-v03-process-learnings.md`](../../project/brainstorms/2026-06-30-v03-process-learnings.md)) and steered which learnings to adopt and how (capture: [`../../project/human-feedback/2026-06-30-process-learnings-decisions.md`](../../project/human-feedback/2026-06-30-process-learnings-decisions.md)). **Guardrail the human set:** an ADR records a decision the _human_ made — so a retrospective does **not** dump 30+ ADRs; only genuine human decisions earn one, the rest fold into living docs / skills as norms. These three are the human's decisions; the F/E/P + A1–A23 learnings land as norms (see the capture).

### D-086 ✅ — Tension over generosity is the default design bias
- **created_date:** 2026-06-30
- **Context:** The retro's sharpest fun insight (A3): left to defaults, the agent builds **generosity** — it shipped auto-heal + autopilot + a loose economy, and the human had to push for no-auto-heal / fight-to-death / loss-stops-autopilot / tighter koku (D-076, D-077). Generosity was the silent default; tension had to be fought for each time.
- **Decision:** **Tension & scarcity are the default; generosity is a thing to JUSTIFY, never a safe default.** When a design choice trades difficulty/scarcity for comfort (auto-heal, autopilot convenience, a forgiving economy, a removed fail-state), that is a decision to surface and justify against the fun bar — not a default to reach for. Stays inside the existing hard guardrails (every fight winnable, soft-setback only, no permanent loss / no stranding — D-061): tension pulls the player to engage, it never pushes them out.
- **Why:** Human chose "make it canon." Grounds D-076 (HP-attrition, no auto-heal) and D-077 (tighten koku) as instances of a general stance, not one-offs.
- **Consequences:** A `fun-factor.md` canon line + a battery **`tension/scarcity`** lens (generosity-creep is a finding, not a feature). Per **D-022**, governs.

### D-087 ✅ — Autonomous-loop done-rule: keep finding work, flag low-value honestly
- **created_date:** 2026-06-30
- **Context:** The retro's P3: a long autonomous `/loop` drifts toward gold-plating once the high-value backlog runs dry — each tick the agent re-derives "is there real value left, or am I polishing?" The doc proposed a hard "stop when dry"; the human chose otherwise.
- **Decision:** When the high-value backlog runs dry, the loop **keeps finding work rather than idling** — but **flags low-value ticks honestly** (names a marginal tick as marginal) instead of dressing busy-work up as high-value. Motion + honest labelling over a hard stop. (R3 done-is-earned applies to the labelling: never call a marginal tick high-value.)
- **Why:** Human chose "keep finding work." Tempers P3; pairs with R4 (bias to motion) + R1 (no clock — the window is an invitation to do excellent work, not a countdown).
- **Consequences:** A working-agreements line on the loop done-rule. Per **D-022**, governs.

### D-088 ✅ — A full-arc e2e + invariants test per tier is a hard DoD contract
- **created_date:** 2026-06-30
- **Context:** The retro's E2/A17: the end-to-end `t0-arc.test` + `invariants.test` (real-intent cold-open → ascension; no-NaN / write-once / monotonic-clock over the whole arc) gave more confidence than any fragment test, ran in ~30 ms, and are RED-able — they prove the **seams** between fragment tests hold. But in v0.3 they were authored late, not from the first milestone.
- **Decision:** **Every tier ships a full-arc e2e test + an invariants test, named in its FIRST milestone's DoD** — not bolted on at the end. Backstopped by **D-054** milestone-integrity (a DoD that names a test which doesn't resolve can't pass silently). **Ration gate-time** (A17): full-arc/invariant tests can be O(n²) and spend the verify budget — optimize them (the 1 s → 169 ms win) and keep them within the 5 s budget (D-072).
- **Why:** Human chose "hard DoD contract." Extends D-054 from feature-completeness to playtestability; the cheapest playtestability guarantee we have.
- **Consequences:** An AGENTS.md `Test discipline` convention line + the `tdd` skill's deep procedure; roadmap per-tier DoDs name the two tests. **Enforcement (human, 2026-06-30, "your rec then yes"):** the **milestone-integrity gate** (battery #20, v0.3.1 Step 7) is the teeth; **per-test RED-ability stays a NORM, deliberately not gated** (gating it would cry wolf — A11). Per **D-022**, governs; refines **D-054**.

### D-089 ✅ — Reading-queue sign-off is implicit; the agent keeps `todo-human.md` clean
- **created_date:** 2026-06-30
- **Context:** The `2026-06-30-stale-markdown-sweep` report sat in the reading queue across sessions even though all its agent-work had landed — the prior lifecycle ("removed when the human signs off") read as a **manual tick the human had to perform**, so a done-but-unacked doc looked identical to one with pending work, and the human did stale-triage by hand. The human's actual model: the reading queue is just **how the agent surfaces the markdown it generates** (in agentic / loop / ultracode runs) so nothing it made goes unseen.
- **Decision:** **Sign-off is implicit, and the agent owns keeping `todo-human.md` clean** — the human never manually ticks a reading-queue item. (1) **Populate:** docs the human hasn't opened/discussed are auto-added when authored (the existing pre-commit queue gate already does this). (2) **Clear:** the moment the human reads a queued doc **or it comes up in discussion / "let's work on this"**, the agent treats that as sign-off and removes it. (3) **Reconcile at exit:** the **Checkpoint ritual** gains a step — when run interactively (`/prepare-to-exit`), the agent presents the remaining queue and asks via **AskUserQuestion** which to sign off / remove (a batch sign-off the human explicitly preferred over silent auto-removal); an autonomous checkpoint clears only clearly-engaged docs.
- **Why:** Human steer (2026-06-30): *"If I read the doc, or we discuss the doc, then that's read/signed-off. I don't need to sign them off manually… I want todo-human kept clean… we can do the ask-user tool in prepare-to-exit to ask me if we can remove said md file."* This **supersedes the prior manual-sign-off lifecycle** (D-022 — newest human intent is canon). Preserves R3 (the human still certifies — the `/prepare-to-exit` prompt is the certification gate) while removing the human's triage chore.
- **Consequences:** Rippled to `todo-human.md` (header + reading-queue lifecycle), `repo-map.md` (queue description), and `working-agreements.md` (Checkpoint step 4). The `prepare-to-exit` skill stays copy-free — it inherits the new step from the ritual. **Enforcement:** a **norm** (judgment about "did the human engage with this doc" can't be soundly gated) backstopped by the interactive `/prepare-to-exit` reconciliation. Per **D-022**, governs.

## D-090…D-091 — 2026-07-01 v0.3.1 combat-feel build (batch-2 priming, human-steered)

> The human turned the v0.3.1 priming into a design session (two `AskUserQuestion` batches; capture: [`../../project/human-feedback/2026-06-30-v0.3.1-priming-decisions.md`](../../project/human-feedback/2026-06-30-v0.3.1-priming-decisions.md)). These two formalize the genuinely-new combat-feel decisions, built + shipped in v0.3.1 Step 3. They **refine D-076**.

### D-090 ✅ — A lost fight bites CARRIED wealth; the kura storehouse shelters BANKED (refines D-076)

> 🔁 **Re-scoped 2026-07-02 by [D-107].** The loss-bite is now a bite of **CARRIED COIN**
> (+ carried materials); **koku STANDING is immune to combat loss** (the House's assessed prestige
> is never spent or dropped in a fight). The kura shelters **banked COIN + RICE**. The
> carried-vs-banked split holds.
- **created_date:** 2026-07-01
- **Context:** D-076 made the fight HP-attrition with no auto-heal and "0 HP = loss stops autopilot," but left the loss COST as the old §4.6.6 "possible carried-loot drop." The human (batch-2) wanted the loss to actually bite (D-086 tension) — and, catching the agent's own word "unbanked," demanded a bank so the bite has a shelter to play against.
- **Decision:** A lost fight **drops a real bite of CARRIED wealth** — `LOSS_KOKU_FRAC` (~20%, "real bite") of carried koku + `LOSS_MATERIAL_FRAC` (~⅓, floored) of carried materials — and the **autopilot STOPS** (no auto-resume; you mend by hand + re-engage). Wealth splits **carried** (`state.resources`, at risk) vs **banked** (`state.banked`, the kura storehouse, SAFE); deposit/withdraw move between them, spending/earning use carried. **Step 5 gates deposit to the kura node** (return home to bank → fighting far with a full purse is the gamble). Still never a level/gear/Influence loss. The combat log is **summarised** (one outcome line per fight). Magnitudes liquid (D-059).
- **Why:** Human steer (batch-2 calls 2/4/7): "real bite… and you owe me a bank, lol." An instance of D-086 (generosity — a cost-free loss — is the thing to justify). Supersedes the old §4.6.6/§4.6.6b "self-recovering, loss-never-bites" loop.
- **Consequences:** Built in v0.3.1 Step 3 (`fight.ts` loss penalty; `state.banked` + `withBanked`; deposit/withdraw intents; the storehouse panel; `balance.ts` `LOSS_*_FRAC`). PRD §4.6.6/§4.6.6b/§4.6.6c rippled. RED-able guards in `combat-rework.test.ts`. Per **D-022**, governs; refines **D-076**.

### D-091 ✅ — Two auto-combat modes: fight-to-death vs auto-retreat@20% (refines D-076)
- **created_date:** 2026-07-01
- **Context:** With no auto-heal (D-076), HP accumulates and a ≥1-dmg foe eventually kills an unattended grind. The human wanted the player to OWN that risk rather than the loop auto-papering it (the old §4.6.6b "auto-retreat is the default common case").
- **Decision:** The auto-loop offers **two modes per foe**: **(1) auto-fight to the end** (grind until you win or die — a loss bites, D-090), and **(2) auto-fight, retreat @`AUTO_RETREAT_FRAC` (~20%)** — break off on a **turn** where HP drops below the threshold but is still > 0. The retreat is a **per-turn** check, so a burst foe that one-shots you past the threshold still **kills** you (a killing blow is a loss, not a flee). A flee earns no reward and **no penalty**, but you're hurt and the **autopilot stops**. The forecast keeps the to-death win-rate (retreat off), so the shown odds stay honest (A6). Threshold liquid (D-059).
- **Why:** Human steer (batch-2 call 6): "over-reaching only, BUT… two auto settings: [no end] / [auto retreat @20%]," with the explicit per-turn-burst caveat. Supersedes the old auto-retreat-by-default §4.6.6b.
- **Consequences:** Built in v0.3.1 Step 3 (`combat.ts` `resolveFight` retreatHp + `fled`; `state.autoCombatRetreat`; the `retreat` intent flag; two per-foe toggles). PRD §4.6.6b rippled. RED-able guards in `combat-rework.test.ts`. Per **D-022**, governs; refines **D-076**.

## D-092 — 2026-07-01 v0.3.1 koku economy tightening (batch-1 priming, human-steered)

### D-092 ✅ — Tighten the T0 koku economy: more sinks + a SOFT repair-fee (instance of D-086)

> 🔁 **Re-scoped 2026-07-02 by [D-107].** The tightened economy is the **COIN** economy (base
> unit *mon*) — the soft repair-fee, the estate-upgrade sink, and market depth are all priced in
> **COIN**, within the trade ≤⅓ cap. koku is now the House STANDING, not the currency being
> tightened; RICE is a separate resource.
- **created_date:** 2026-07-01
- **Context:** D-086 (tension > generosity) + the human's batch-1 call 4 wanted koku to feel scarce (more sinks than income; rich only at T5). The v0.3 T0 economy pooled koku — the estate + a tiny capped market were the only sinks. A first attempt at a HARD koku cost on repair softlocked an unlucky fresh L1 in the m2 no-stranding test (no early koku → can't repair → stranded), which D-061/D-086 forbid (tension must never push the player *out*).
- **Decision:** Tighten T0 koku with sinks across all three directions the human named: **(1)** repair charges a koku FEE (`REPAIR_KOKU_COST`) on top of wood — but a **SOFT** fee, **waived when you can't pay** (repair stays wood-gated; the koku bites only when you have it, so it can never softlock); **(2)** a **4th estate stage E4** (a deeper flywheel koku sink); **(3)** **market depth** (pricier capped goods), held inside the D-008 minority-lane cap (total market spend ≤ ⅓ of the estate sink — a RED-able invariant). All magnitudes liquid (D-059). **Deferred:** the 2nd craft recipe / material-surplus sink (battery #15) → Step 7; the §4 6-tier balance re-derivation → the final PRD-consistency pass (a finding: §4 is T1+ *pillar/tier* balance, not the T0 koku-sink *content* constants — a looser coupling than the plan assumed).
- **Why:** Human steer (batch-1 call 4, "all three directions") as an instance of D-086. The **soft** fee is the D-061/D-086-aligned way to add a real sink without a softlock — the design the no-stranding test forced.
- **Consequences:** Built in v0.3.1 Step 4 (`balance.ts` `REPAIR_KOKU_COST`; the repair soft-fee; `ESTATE_STAGES` E4; `MARKET_ITEMS` depth). RED-able guards in `economy.test.ts`; content docs regenerated. Per **D-022**, governs; instance of **D-086**.

## D-093 — 2026-07-01 v0.3.1 the T0 spatial-map model (batch-2 priming, human-steered)

### D-093 ✅ — T0 activities, foes & banking are SPATIAL: every activity is on one map node, there is no default node, and the map gates a load-bearing yield

> 🔁 **Re-scoped 2026-07-02 by [D-107].** The spatial map spine is unchanged; the resource nouns
> update — the load-bearing deep-satoyama node's "+koku" yield becomes a richer **COIN** (+ forage)
> yield, labour income is **RICE + a little COIN**, and kura banking shelters **COIN + RICE**.
> koku is the House STANDING, never a node/labour tick.
- **created_date:** 2026-07-01
- **Context:** T0 shipped a "small walkable estate map" (§1 vision, LOCKED) — but through v0.3 it was **cosmetic**: every labour, every foe, and the storehouse were reachable from any node, so walking gated nothing (battery **#13** — "the map gates nothing"). The human's batch-2 priming call made the map the **spatial spine**: "spread all the activities to only belong to one map node, and no default map node… combat happens on a map node… richer resource yields on different map nodes… the storehouse (bank) is at the kura."
- **Decision:** In T0, the map is **load-bearing** — every doable thing is **bound to a node**, and you **walk there to do it**:
  - **Activities are spatial** (5a): each labour has an `area`; `canDoActivity`/`availableLabours` gate on `state.location`, so the work tab lists only the current node's labours. No default node — you start at the **kura** (rake rice), then walk to the paddies to farm, the woodlot to cut, the satoyama to forage.
  - **Foes are spatial** (5b): each `MobDef` has an `area`; the `fight` intent no-ops off the foe's node; the combat "watch" shows only the foes present (`foesHere`); `move_to` ends the auto-grind you walk away from. The scripted grain-store wolf is faced only at the kura. `foeForecasts` stays location-INDEPENDENT (it's the win-rate CURVE the balance gates read; the spatial filter is the separate `foesHere`).
  - **Banking is spatial** (5c): the storehouse IS the kura (D-090), so you deposit/withdraw only while standing there — the balance shows everywhere (your safe reserve is worth seeing on the road), the action is kura-only.
  - **A load-bearing node gates a richer yield** (5d, satisfies **D-078**): a new **deep satoyama (奥山)** node, one hill past the near satoyama (behind the danger ring, at a higher satiety cost), gates `forage_deepwoods` (sansai 4 / koku 2 vs the near 2 / 1) and dens the boar — the map earns its walk, tying the spatial spine to the koku economy (D-092) and the combat cook-loop. Deeds-gating nodes are a T1+ concern (deeds are Phase-2).
  - **The focused-optimal auto-play policy became navigation-aware** and moved to `core/autoplay.ts` (the single source the pacing gate, playcheck, the e2e tests, and the DEV `__qa.toRung` climber all share) — it now walks to a labour's node before working it, so the harness models the real spatial path.
- **Why:** Human steer (batch-2 map call). Fulfils §1's "areas to explore" as real gameplay (R6 — reachable, load-bearing) instead of chrome; clears battery #13.
- **Consequences:** Built in v0.3.1 Step 5 (`content/activities.ts`/`enemies.ts` `area`; `selectors.ts`/`intents.ts`/`combat.ts` gates + `foesHere`; the deep-satoyama node in `map.ts`/`areas.ts`/`surfaces.ts`/`ranks.ts`; `core/autoplay.ts`). The **ascension after-state** (F2 — "design the AFTER of every payoff") rode this step: once ascended the House-Influence panel resolves ("a man of the house, 家産 Risen" + the boon prompt + a to-be-continued frontier) instead of the stale "reach Excellent to ascend (480/480)" prompt. Map **presentation** ships as a D-075 diverge (default A "paths list"; B 絵地図 schematic + C 道中記 ledger DEV-only, per-variant R-items). RED-able guards across `combat-rework`/`economy`/`map`/`render` tests. Per **D-022**, governs; implements **D-078**; composes with **D-090** (the bank) + **D-075** (the map variants).

## D-094 — 2026-07-01 v0.3.1 the reckoning cadence is a per-tier lever (battery #8)

### D-094 ✅ — The seasonal judge's CADENCE decouples from the 28-day calendar (a per-tier lever); the SHAPE stays canon
- **created_date:** 2026-07-01
- **Context:** The seasonal judged-appraisal (§4.2.2 / D-049) fired only on a **28-day season boundary**. But the T0 Phase-2 Estate deed-grind reaches EXCELLENT (the ascension gate) in **~5 days**, so in the compressed T0 showcase the judge fired **0×** before ascension — dead code on the optimal path (battery **#8**). A weekly (7-day) cadence would also miss (5 < 7). (The **A4 self-inflation** — re-judging its own payout — was a *separate* bug, already fixed: `pillars.ts` advances `judged` to the post-bonus high-water.) A diff re-audit (2026-07-01) flagged that the fix landed with only a code comment, contradicting the PRD's "fires every season / canon-fixed" language — hence this ADR + the §4.2.2 / §6 ripple.
- **Decision:** The judge's **SHAPE stays canon** (up-only, high-water-mark, no maintenance trickle, deeds-gated to Phase 2). Its **CADENCE becomes a per-tier LEVER** (liquid, **D-059**), decoupled from the 28-day `season()` **calendar** (which is unchanged): a new `PHASE2_JUDGE_INTERVAL_DAYS` (T0 = **3d**, tuned ≤ the grind's day-span so a reckoning is GUARANTEED before the gate) so the mechanic is actually FELT in the T0 miniature. It fires **1×** at day 3 — and that reckoning is what tips the estate to EXCELLENT, a clean showcase beat. **T1+, when Phase 2 is a long game, scales the cadence back toward the real 28-day season** (a per-tier concern for when T1 is built).
- **Why:** T0 is a "showcase-in-miniature" (D-052) — a T1+ mechanic (the seasonal reckoning) must be visible in the miniature, but a full season never turns in the ~5-day T0 tail. Making the cadence a per-tier lever shows the mechanic authentically in T0 without a speculative T1 re-tune. Fully liquid (D-059).
- **Consequences:** Built v0.3.1 Step 7 (`constants.ts` `PHASE2_JUDGE_INTERVAL_DAYS`; `step.ts` `onSeasonBoundary → onReckoning`; the log reframed off "the season turns"). RED-able integration test (`ascension.test.ts`) drives the real grind + asserts the judge fires/banks/logs before EXCELLENT. Rippled: PRD **§4.2.2** (shape=canon, cadence=lever) + **§6** (per-reckoning hook; also corrected the stale `pendingAppraisals`-counter description — the code folds one day at a time, no counter). Per **D-022**, governs; refines **D-049**; instance of **D-059**.

## D-095 — 2026-07-01 T0 material surplus is "working as intended" for the miniature (battery #15 / H11)

### D-095 ✅ — Accept the post-craft hardwood/sinew surplus in T0; the material economy is a T1+ concern (closes H11 = option C)
- **created_date:** 2026-07-01
- **Context:** After the one-time axe craft (`craft_wood_axe` = 3 hardwood + 1 sinew) combat keeps dropping hardwood/sinew that then pile up with no sink — battery **#15**. D-092 deferred "a 2nd craft recipe / material-surplus sink" to v0.3.1 Step 7, but on pickup every form of a sink grazed a lock: a **2nd craftable weapon** breaks **D-052** (T0 showcases exactly one craftable); a **materials→koku sale** or **materials-based repair** loosens the just-tightened **D-092** (scarce koku); a **repeatable consumable** dodges both locks but introduces a consumable-item system T0 doesn't have — itself a scope/taste question. So it was raised to the human as **H11** rather than solo-picked.
- **Decision:** **Option C** — accept the surplus as fine for a *tutorial*. T0 shows the loot→craft *taste* with one craftable (D-052; 🔁 "one" relaxed to "≥1 craftable" 2026-07-01 by **D-102**); a real material economy (multiple recipes, consumables, sinks) is exactly what **T1 "scales into depth."** Close battery **#15** as **working-as-intended for the miniature**, revisit at T1. No code change: no 2nd recipe, no drop-gating, no consumable slot in T0.
- **Why:** Human steer ("C for now", 2026-07-01) confirming the recommendation. Forcing an ongoing sink into the showcase-in-miniature (D-052) risks over-building the tutorial; the locks it would have to graze (D-052 one-craftable, D-092 scarce-koku) are load-bearing T0 taste. Deferring is the R6-lean call — build only what the miniature needs.
- **Consequences:** No T0 build. Battery #15 closes as WAI (not "fixed"). The material-surplus sink (2nd recipe / consumable / drop-gating) becomes an explicit **T1 design input** when the T1 material economy is scoped. Per **D-022**, governs; composes with **D-052** (one craftable) + **D-092** (scarce koku, which deferred this here); revisit at **T1**.

## D-096 — 2026-07-01 the displayed version is single-sourced from package.json, never git tags (H12)

### D-096 ✅ — `package.json` is the SINGLE SOURCE OF TRUTH for the displayed version; git tags are NOT read by the game/HTML/TS
- **created_date:** 2026-07-01
- **Context:** The built game footer showed **v0.2** even for the v0.3.1 build — `vite.config.ts` resolved `__VERSION__` from `git describe --tags --abbrev=0`, and the only tags were `v0.1`/`v0.2` (the build was never tagged v0.3.x). Meanwhile `package.json` said `0.3.0` (read by nothing for display) and every doc/journal said `v0.3.1` (convention, no code anchor) — three disagreeing numbers, the A21 single-source-of-truth invariant violated. Raised as **H12**.
- **Decision (human, 2026-07-01):** The **displayed version is single-sourced from `package.json`** (bumped to `0.3.1`); **git tags are never a source of truth for the game / HTML / TypeScript.** `vite.config.ts` now derives `VERSION = v${pkg.version}`; the git-derived **build stamp** stays but the SHA uses the **raw short hash** (`rev-parse --short HEAD`), not `describe --tags`, so no tag leaks into the display. `BUILD_VERSION` env still overrides for CI/reproducible builds. Footer verified: `v0.3.1 · build <sha> · <date>`.
- **Why:** A tag lagging the build (or an untagged build) must never mislabel what the player sees — the version the game reports should be the version the code declares (A21). Bumping `package.json` alone would have been a false fix (nothing read it for display); the real fix rewires the source. Tagging for real *releases* is orthogonal and stays a human call.
- **Consequences:** Built 2026-07-01 (`package.json` 0.3.0→0.3.1; `vite.config.ts` VERSION from package.json + tag-free BUILD_SHA; `src/vite-env.d.ts` comment). No git tag created (releases are a separate, human-owned step). Per **D-022**, governs; instance of the **A21** version-single-source convention.

## D-097 — 2026-07-01 the PRD is a standalone, END-STATE (v1.0.0) spec — no inline ADR refs / build-nuance (human steer)

### D-097 ✅ — Each PRD section reads as a STANDALONE, END-STATE v1.0.0 document; the ADR log holds the "why", the PRD holds the clean "what"
- **created_date:** 2026-07-01
- **Context:** The PRD (`docs/living/prd/§1–§7`) had accreted inline ADR references (D-xxx / H-xx), prototype build-nuance ("v0.3.1 Step 4", "the prototype", "as of this build"), and process/provisional scaffolding ("TBD — derives in the re-derivation", "RESHAPE NOTE", "Part-1 ripple", "Until the T1 pass read through this key", status banners) — especially §7 roadmap-scope, which reads as a doc re-touched at v0.2.0 / v0.3.0 / v0.3.1 rather than a description of the finished game. This couples the spec to the current prototype state and makes it hard to read as a spec.
- **Decision (human, 2026-07-01):** The PRD documents the **END STATE (v1.0.0)** and reads as a set of **standalone living documents** that cross-link to other `docs/` files for detail — but do NOT carry inline ADR numbers, prototype/build-state nuance, or provisional scaffolding. The **ADR log (this file) is the separate "why"**; the roadmap is the "how/when"; the PRD is the clean "what." **§7 describes v1.0.0's scope/shape**, not a per-build changelog.
- **Why:** A PRD is a spec of the finished product — a reader should see what v1.0.0 IS without decoding build history or chasing ADR cross-references. Separating the *what* (PRD) from the *why* (ADRs) and the *how/when* (roadmap) makes each document standalone and durable.
- **Consequences:** Triggers a PRD **transformation pass** — reconcile the PRD with the built game **BIDIRECTIONALLY / best-of-both** (PRD-stale claims update the PRD; good-but-unbuilt PRD *ideas* are KEPT and become build TODOs, never deleted to match a cruder implementation; genuine forks go to the human) **AND** strip ADR-refs / build-nuance / provisional-scaffolding and reframe every section to the v1.0.0 end-state. Refines **D-021**: the freeze CONCEPT (locked intent vs provisional route) survives, but the inline provisional-annotation STYLE is retired from the PRD prose (that bookkeeping lives in the roadmap + ADR log). Per **D-022**, this newest human steer governs. Plan lands in `docs/plans/` before the rewrite.

## D-098 — 2026-07-01 estate stages: rename the built koku PURCHASE ladder to a non-colliding namespace (closes H13)

### D-098 ✅ — Two distinct estate axes: keep the E0–E5 narrative CONDITION ladder; rename the built koku PURCHASE steps to `U1–U4` "kura-works"

> 🔁 **Re-scoped 2026-07-02 by [D-107].** The `U1–U4` "kura-works" are bought with **COIN** (not
> koku). The two-distinct-axes fix (narrative E0–E5 condition vs the U1–U4 purchase ladder) holds;
> only the purchase currency changes koku → coin. koku is now the House STANDING.
- **created_date:** 2026-07-01
- **Context:** Two different-axis schemes collided on the `E<n>` label (H13): the diegetic **condition** ladder (E0 Foreclosure's Edge → E3 Prosperous, E4–E5 parked for T4+ — the narrative *state* of the house) vs the built T0 **koku purchase** ladder (E1 patch-kura / E2 clear-drill-yard / E3 reclaim-shinden / E4 raise-long-house — the flywheel upgrades you *buy*). A code-E4 "Risen" sat in T0 while narrative-E4 "Fortified Seat" was parked for T4+; the code even reused condition labels as purchase-step names.
- **Decision (human, 2026-07-01):** Keep the two as **distinct axes**. The **narrative CONDITION stages stay `E0–E5`** (canon, D-033). The **built koku PURCHASE steps are renamed to a non-colliding namespace — `U1–U4` ("kura-works" / estate upgrades)**. Do NOT fold them together or renumber the narrative ladder.
- **Why:** The two measure genuinely different things — the *state* of the house vs the *upgrades you buy*. A shared label conflated them across 7 doc surfaces; a rename is the minimal, lossless fix.
- **Consequences:** Closes **H13**. BUILD TODO (v0.3.2): rename `estateStage`/E-labels in code (`content/estate.ts`, `render.ts` "E4 · Risen", tests) to the `U#` namespace. DOC: PRD/roadmap estate prose uses `E#` for the narrative condition, `U#` for the purchase upgrades. Refines **D-033** + **D-092**. Per **D-022**, governs.

## D-099 — 2026-07-01 player finances vs estate finances are separate lanes; T0 provisioning shop is a koku SINK (closes H14)

### D-099 ✅ — Player and estate finances are SEPARATE lanes; T0 ships a buy-only provisioning shop (personal koku sink); the T2 TRADE engine trades on the estate's behalf

> 🔁 **Re-scoped 2026-07-02 by [D-107].** The provisioning shop is a personal **COIN** sink (not
> koku); the player-vs-estate finance split is a **COIN** split (personal coin vs the estate's
> coin + rice). The TRADE engine (T2, sells rice/goods for **COIN**) is unchanged. koku is the
> House STANDING, never spent.
- **created_date:** 2026-07-01
- **Context:** The build ships a small 6-item buy-only, capped koku-SINK provisioning shop in T0; the PRD said "no market in T0" ×6 (TRADE — selling for coin/profit — locks to T2, D-066), yet the human named "market depth" as a T0 koku sink (D-092) — an apparent contradiction (H14).
- **Decision (human, 2026-07-01):** They are two different things, both canon. **(1) VENDORS/SHOPS** where the **player** buys goods for his **character** are a **personal koku SINK** — legitimate from **T0** (the built provisioning shop). **(2) The TRADE ENGINE** (trade work on the **estate's** behalf, for profit) opens at **T2** and is about the **estate**. **(3) PLAYER finances and ESTATE finances are SEPARATE lanes** — the player's personal koku (character purchases) is distinct from the estate's koku/wealth (the estate economy + trade engine).
- **Why:** "No market in T0" really meant "no *trade engine* in T0" — buying gear for yourself ≠ the estate trading for profit. Separating the lanes resolves the contradiction and opens a richer economy (a personal progression sink vs an estate-scale engine).
- **Consequences:** DOC: reframe "no market in T0" → "no *trade engine* in T0; a small capped provisioning shop is a personal koku sink"; introduce the player-vs-estate finance split into the resource model (§2.4 / §6). BUILD TODO (v0.3.2 / T1 design input): model the two finance lanes — today's `resources`(carried) vs `banked`(kura) is at-risk-vs-safe, **not** player-vs-estate; reconcile. Composes with **D-066** (trade ≤⅓, T2) + **D-092** (T0 market depth). Per **D-022**, governs.

## D-100 — 2026-07-01 keep the PRD combat-resolution model (5-attr + accuracy/evasion) and BUILD it at T0 (closes H15)

### D-100 ✅ — v1.0.0 combat = the PRD's 5-attribute + accuracy/evasion model; implement it at T0 (v0.3.2), NOT deferred to T1
- **created_date:** 2026-07-01
- **Context:** The PRD specifies combat resolution via accuracy/evasion + a 5-attribute system (STR/AGI/INT/SPD/LUCK); the built T0 ships flat hit/crit/block (0.9/0.1/0.1) with 3 attributes (might/guard/vigor). The built model is playtested and meets the LOCKED 20–35% first-fight band with no dominated stance — but it's a leaner realization of the PRD design (H15).
- **Decision (human, 2026-07-01):** Keep the **PRD's richer model as v1.0.0 intent** AND **implement it at T0** in v0.3.2 (do NOT defer to T1). The PRD prose stays; the build catches up now.
- **Why:** The human wants the fuller combat depth in the player's hands from T0, not held for a later tier. The richer model is the intent, not the leaner shipped approximation.
- **Consequences:** BUILD TODO (v0.3.2, HIGH): grow the 3-attr (might/guard/vigor) into the full 5-attr system (STR/AGI/INT/SPD/LUCK, each dual labour+combat — D-016); replace flat hit/crit/block with accuracy/evasion resolution; keep the 20–35% band + no-dominated-stance invariants (RED-able). §4 magnitudes stay LIQUID (D-059). Preserves **D-011/D-016**. Per **D-022**, governs.

## D-101 — 2026-07-01 stances are a glass-cannon ↔ tank tradeoff (damage dealt vs damage taken) (closes H16)

### D-101 ✅ — Stance axis = ATTACK vs DAMAGE-TAKEN (aggressive = glass cannon: more dealt + more taken; defensive = tank: less dealt + less taken); retire wear-as-the-stance-axis
- **created_date:** 2026-07-01
- **Context:** Built stances used durability WEAR as the cost axis (Aggressive wear 1.5×); the PRD §4.6.10 used defense/speed. Neither cleanly matched the human's mental model (H16).
- **Decision (human, 2026-07-01):** Stances are a **glass-cannon ↔ tank** tradeoff on the **damage-dealt vs damage-taken** axis: **aggressive** = glass cannon (do more damage, take more damage); **defensive** = tank (take less damage, do less damage); balanced sits between. This axis IS the intent — retire wear-as-the-defining-stance-axis and drop the PRD's defense/speed framing.
- **Why:** The stance choice should read as a clear glass-cannon/tank identity, not a durability chore or a speed lever. (The built `atkMult`/`takenMult` already express this — gedan 0.8/0.85, jodan 1.35/1.15 — so the build is close; the change is to make this THE axis, not a wear tax.)
- **Consequences:** DOC: revise PRD §4.6.10 + §2.8 Stance shape to the atk/damage-taken glass-cannon/tank model. BUILD: keep `atkMult`/`takenMult` as the stance axis; demote/remove `wearMult` as the differentiator (weapon wear stays a durability mechanic, not the stance's identity). Keep **D-050**'s no-dominant-stance / balanced-not-a-trap invariant. Per **D-022**, governs; supersedes the §4.6.10 defense/speed proposal + the wear-axis emphasis.

## D-102 — 2026-07-01 "at least one craftable" (relaxes D-052/D-095); T0 ships 3 weapons (closes H17)

### D-102 ✅ — The craftability rule is "AT LEAST one craftable", not "exactly one"; T0 ships 3 weapons (pole start + 2 more)
- **created_date:** 2026-07-01
- **Context:** D-052/D-095 were read as "T0 showcases exactly ONE craftable weapon." The PRD's T0 roster is 3 spears (2 crafted), which that reading forbade; the build ships 2 weapons (carrying-pole + 1 crafted axe = +1) (H17).
- **Decision (human, 2026-07-01):** The "one craftable" rule was never a hard cap — it means **"at LEAST one craftable."** **T0 ships 3 weapons: the carrying-pole (start) + 2 more** (at least one of the two craftable; the other may be found or crafted). This **amends D-052 and D-095** (exactly-one → at-least-one).
- **Why:** "Exactly one craftable" over-constrained the tutorial; the intent was to *guarantee the loot→craft taste exists*, not to cap the roster. Three weapons gives T0 a real weapon-choice beat (matching the PRD +2 roster / D-026).
- **Consequences:** AMENDS **D-052** (the "one craftable" clause) + **D-095** (annotated there): the constraint is now "≥1 craftable." BUILD TODO (v0.3.2): add a **3rd T0 weapon** (currently 2). DOC: the PRD T0 weapon row = pole (start) + 2 more; keep the 3-line archetype/signature vision (D-026). Per **D-022**, governs.

## D-103 — 2026-07-01 interactive/resumable combat is a forward-tier feature; auto-resolve is the T0 spine (closes H18)

### D-103 ✅ — DEFER interactive, resumable mid-fight combat (`CombatEncounterState` + `combat_action`) to a forward tier (T1/T2); auto-resolve stays the T0 spine
- **created_date:** 2026-07-01
- **Context:** The PRD specifies interactive, resumable mid-fight combat (a stored `CombatEncounterState` + a `combat_action` intent — act turn-by-turn); the build resolves each fight atomically to one summary line, and v0.3.1 (D-076/090/091) doubled down on the high-throughput auto-grind. No ADR had retired the interactive vision (H18).
- **Decision (human, 2026-07-01):** **DEFER, don't retire.** Keep the interactive/resumable-combat vision but mark it explicitly **forward-tier (T1/T2 ability-slot combat)** — NOT a T0 obligation. **Auto-resolve stays the T0 spine.**
- **Why:** The auto-grind is the right T0 loop (leave-it-running incremental); interactive combat is a depth layer for later tiers. Keeping the vision (not deleting it) protects the good idea per best-of-both.
- **Consequences:** DOC: §6.3/§6.4 mark `combat?: CombatEncounterState` + `combat_action` as **forward-tier (T1/T2)**, not current/T0 state. No T0 build change. Per **D-022**, governs.

## D-104 — 2026-07-02 story-significant, interactive NPCs are introduced via a full-screen VN scene

### D-104 ✅ — First meetings with story-significant, interactive NPCs play as a full-screen VN dialogue scene (starting with the intro's Sōan + Genemon)
- **created_date:** 2026-07-02
- **Context:** The cold-open was a one-shot text dump — the physician **Sōan** grounds the folklore but the player can't answer him, and Genemon's greet lines land all at once (playtest **F13**; the intro-dialogue plan [`project/archive/2026-07-02-interactive-intro-dialogue.md`](../../project/archive/2026-07-02-interactive-intro-dialogue.md)). The plan reworks the intro into a VN-style, click-to-continue interactive dialogue with balanced choices, per-NPC memory, and a speaker/voice model; it ran a D-075 diverge over the *presentation* (inline / full-screen scene / bottom-dock — F43/F44/F45). The human then made the pattern-level call: how do we frame meeting an NPC who *matters* and can be *answered*?
- **Options:** (A) keep all NPC intros inline in the event log · (B) a bottom "dialogue dock" over the live world · (C) a dedicated **full-screen VN scene** that hides the rest of the UI — reserved for NPCs who carry story weight and offer real interaction.
- **Decision (human, 2026-07-02):** When the player **first meets** an NPC who is **story-significant AND interactive** — the NPC touches the story, offers **choices**, or has real discussion/interaction — the game presents that meeting as a **full-screen dialogue (VN) scene**: a **kanji ink-seal nameplate** (coloured per voice-category), the NPC's spoken lines revealed with the **GBA typewriter**, the player's **diegetic choice replies**, and **per-NPC memory** (each NPC independently remembers how you treated them; `npcMemory`, persists across ascension). The scene **hides the rest of the game UI** while it plays — reinforcing the game's signature "the UI unlocks incrementally" (the world/estate inks in *after* the scene). This is **THE canonical pattern** for such introductions, starting with the intro's **Sōan** (physician) and **Genemon** (steward). **Explicitly NOT this:** minor / ambient NPCs — no story weight, no choices, no real interaction — are **not** introduced with the full-screen scene; they appear **inline in the event log**. Reserve the VN scene for characters who matter and can be answered.
- **Why:** A meeting the player can *answer* deserves a frame that stops the world and gives the exchange weight; blowing it up to full-screen (over an inline line or a dock over the live world) makes "this person matters" read instantly, and hiding the UI so the world inks in afterward turns the intro into the first beat of the game's incremental-reveal signature. Gating the treatment to story-significant, interactive NPCs keeps it special — everyday folk stay in the log, so the scene never becomes wallpaper.
- **Consequences:** The interactive intro (the 3 balanced-choice beats) **IS the first instance** of this pattern; the intro presentation is **LOCKED to the full-screen VN scene** — the earlier **inline (A)** and **bottom-dock (C)** presentation variants are **SCRAPPED** (D-075 strip-on-approve), so **prod ships only the VN scene**. Per-NPC memory (`npcMemory`) + the **balanced +1/−1 choice model** + the **speaker/voice colour model** underpin every such scene (data model + beats: the intro plan §3–§4). Future work: a **reusable "meet an NPC" dialogue trigger** keyed off first-encounter, so new story NPCs slot into the same VN pattern. Composes with **D-018** (woodblock/ink, no-asset — the ink-seal nameplate is pure CSS + type) and **D-019** (fun/QA); sources = the intro-dialogue plan + playtest **F13/F43/F44/F45**. Per **D-022**, governs.

## D-105 — 2026-07-02 the game's setting is anchored to the year 1780 (An'ei 9, on the cusp of Tenmei)

### D-105 ✅ — Anchor the setting to 1780; anchor the YEAR (real calendar time), keep GEOGRAPHY & POLITICS fictional

> 🔁 **Economy gloss re-scoped 2026-07-02 by [D-107].** The "koku/mon coin economy" phrasing is
> re-scoped: **COIN** (base unit *mon*) is the currency, **RICE** is the sold resource (the Dōjima
> rice market / fudasashi brokers price it, season-swinging), and **koku** is the House's assessed
> STANDING — not a coin. The 1780 anchor + the real-year / fictional-place split are unchanged.
- **created_date:** 2026-07-02
- **Context:** The setting was pinned only by *era*, not by *year* — §1.3 said "mid-Edo, stable and commercial, ~18th century, kept **fictional**", and `ui-design.md` targets a "mid-Edo woodblock" art register, but no doc stated a specific historical year as a *setting fact*. The human asked to anchor it. A year-anchor sharpens texture (calendar, era-feel, festival naming) and disciplines anachronism checks, but it grazes the standing **fiction rule** (no real place / daimyō names — D-018/§6.6 denylist) and the cozy-restoration **tone** (an anchored year drags in real history, incl. the Tenmei famine of 1782–88).
- **Options:** (A) leave it era-only ("~18th century") · (B) anchor a specific year · (C) anchor a year AND surface a real *nengō* era-year in-game.
- **Decision (human, 2026-07-02):** **Anchor the game to the year 1780** (Japanese *An'ei* 9, 安永9年 — the last full year before the **Tenmei** era, 天明, began in 1781). The game **opens in 1780**. Crucially this anchors **TIME only** — the split is **real YEAR, fictional GEOGRAPHY & POLITICS**: Asagiri valley, Sawatari-juku, Yanagi-watari, Kuzuhara and every daimyō/house stay **invented** (the D-018 / §6.6 real-name denylist is **unchanged**; *Nihonbashi* remains the lone allow-listed real place, at T5). "The shōgun" stays an **unnamed office** (never named as the historical Tokugawa Ieharu; the era's real Tanuma-administration commercial character is *texture*, never named politics).
- **Why:** 1780 is the **right** anchor because it *validates rather than disrupts* the existing world: the stable, commercial "Tanuma era" texture matches §1.3's "stable and commercial"; the *koku*/*mon* coin economy, *fudasashi* brokers + the Dōjima rice market (T4/T5), *sankin-kōtai* (biennial), *sekisho* checkpoints, and the silk/sericulture *meibutsu* are all fully period-consistent; and the timeline math holds (Tama spirited away "ten years ago" ≈ 1770; grandfather **Sadamune's** flood venture "three generations ago" ≈ early-mid 1700s). It also confirms the "mid-Edo woodblock" art register (1780 is the ukiyo-e high tide). Anchoring the year while keeping geography/politics fictional is the standard historical-fiction split — grounding without claiming to depict real events.
- **Consequences:** Ripple tracked in the plan [`project/archive/2026-07-02-anchor-1780-setting.md`](../../project/archive/2026-07-02-anchor-1780-setting.md) (done, archived). DOC: §1.3 "~18th century" → **"1780 (An'ei 9)"** + a one-line reaffirmation of the real-year / fictional-place split; §5 narrative opening may state the year; README + `ui-design.md` note the anchor. Two **forks surfaced for the human** in the plan (agent picks a default, human overrides async): **(1) the Tenmei famine** — default **INSULATE** the fictional valley (cozy tone + apolitical fiction win; the famine is at most faint off-screen texture, never dramatized); **(2) the calendar** — default keep the in-game `year(day)` counter **RELATIVE** (Year 1, 2… of the MC's service; §6.7), with 1780 stated as opening flavour, **not** surfacing the live *nengō* era-year (option C declined for now). No code/balance change (the calendar model is untouched under the default). Composes with **D-018** (fiction rule) + **D-021** (the §1 freeze — this is a human steer that *refines* locked intent, so D-022 governs: the anchor is added, the fiction rule is preserved). Per **D-022**, governs.

## D-106 — 2026-07-02 the multi-panel workspace supersedes the §4.7 "centered ~1200px paper column" rule

### D-106 ✅ — The workspace may span the FULL viewport width as a multi-panel matrix (arrangement × framing DEV variant axes); prod default stays the classic 2-column
- **created_date:** 2026-07-02
- **Context:** The v0.3.2 shell (`ui-design.md` §4.7/§4.8) capped the player UI at a **centered ~1200px paper column** with a **2-column workspace** (work-left / log-right). In the playtest the human found the layout crammed — *"the other games have multiple/many panels (5–7) and it feels like we only have two, and we're slamming all the information in"* (**F11**). The scoping lives in the plan [`project/archive/2026-07-02-multi-panel-layout.md`](../../project/archive/2026-07-02-multi-panel-layout.md), where the human resolved the shell-width question directly.
- **Options:** (A) keep the centered ~1200px column, denser inside · (B) drop the width cap and lay information across **multiple distinct panels** spanning the full width · (C) B, explored as a **matrix of independent variant axes** (arrangement × framing × log-placement) so many live combos audition behind the DEV toggle rather than a handful of bespoke layouts.
- **Decision (human, 2026-07-02):** The human **does NOT want the centered ~1200px paper column** — *"now's the time to try options, explore broadly"* — and OK'd going **beyond 2–3 variants, up to a matrix (3×3×3 = 9+ combos)** built as **INDEPENDENT VARIANT AXES** (e.g. *arrangement × framing × log-placement*, the three named takes 屏風 / 番付 / 巻物 surviving as axis anchors). So the workspace is **no longer bound to the centered column**: it **may span the full viewport width** as an idle-RPG **multi-panel dashboard**, reveal-gated and sparse (panels ink in only as their surface unlocks, §6.1 — the early game stays a single calm column). This **SUPERSEDES the §4.7 "centered ~1200px paper column" rule** (which itself refined the **F4** centered-column intent). The **prod default remains the classic 2-column** (work-left / log-right) until the human locks a matrix variant live; the axes ship **DEV-only** behind the variant toggle (D-075, zero PROD flag-debt).
- **Why:** The reference idlers earn their density by spreading information across many panels, not by cramming two columns — and the human explicitly wants to *see* the options in the running UI, which the axis-matrix delivers cheaply (≈9 implementations → many live combos). Keeping the prod default at the safe 2-column while the matrix auditions behind the toggle honours **R6** (a player still reaches a coherent layout) and D-075 (self-pick a default, never block; the human overrides live). Gating the density to reveal-based progression preserves the "UI as progression" signature (§1) — the dashboard grows *with* the house, never a slam of empty panels.
- **Consequences:** DOC: `ui-design.md` §4.7 gains the full-width multi-panel matrix note + the explicit supersession of its own centered-column rule (§4.8 density unchanged; the log stays one first-class slice, F9/§5.1, untouched). BUILD: the axes are DEV-only variant surfaces (D-075), an **R-item per axis/combo** in [`review.md`](../../project/human-in-the-loop/review.md); prod ships only the 2-column default until the human locks a matrix. Composes with **D-018** (woodblock/ink — the panels stay paper `.frame`s, no slop), **D-055** (reveal-gating — panels appear as their surface unlocks), and **D-104** (the VN scene still hides the whole shell regardless of workspace arrangement). This is a human steer that refines locked layout intent, so **per D-022, governs** (the newer call supersedes the older §4.7 rule; `created_date` disambiguates).

## D-107…D-109 — 2026-07-02 the economy re-core: RICE / COIN / KOKU split (human-steered)

> The locked new economy model splits the flattened single-"koku" economy into three distinct
> nouns — **RICE** (a real resource), **COIN** (the sole spendable currency, base unit *mon* 文),
> and **KOKU** (the House's assessed STANDING). Source: the 2026-07-02 economy research
> brainstorm. These re-scope the koku-as-currency ADRs (**D-008, D-051, D-066, D-077, D-090,
> D-092, D-093, D-098, D-099**) + the **D-105** economy gloss (each annotated inline). Per
> **D-022**, this newest human steer governs.

### D-107 ✅ — koku is the House STANDING, not a currency (economy re-core)
- **created_date:** 2026-07-02
- **Context:** koku was specced/implemented as the spendable base currency (labour yields koku; estate/market/repair priced in koku; a lost fight bites carried koku) and even conflated with rice ("rice counter (koku)"). Historically koku was never a spendable coin — it was a rice-volume / assessment / status unit (see the 2026-07-02 economy research brainstorm). That flattened the setting and inverted koku's meaning.
- **Decision:** Split the economy into three nouns — **RICE** (a real resource: labour-earned; you EAT it for satiety, STORE it in the kura, or SELL it for coin at a price that SWINGS BY SEASON — NOT a synonym for koku), **COIN** (base unit *mon* 文; the sole spendable currency; all costs — market/estate/repair — + the loss-bite are coin; the kura shelters coin + rice), and **KOKU** (the House's assessed STANDING — re-expresses "House Influence" as a kokudaka-like prestige SCORE; NEVER spent; NOT an income multiplier; gates ascension/unlocks; re-assessed seasonally (`seasonalJudge`) + a big "the assessors arrive" event at tier jumps). Supersedes / re-scopes **D-051, D-066, D-077** (split — keep its deed-based-standing clause as the koku law, re-label its tight-economy clause to COIN), **D-090, D-092, D-093, D-098, D-099, D-008** (survives as a coin-lane cap); re-scopes **D-105**'s economy gloss.
- **Why:** Restores koku's real meaning as standing; makes the rice→coin→credit friction the gameplay; keeps the House's rising koku as the prestige spine. Magnitudes liquid (**D-059**).
- **Consequences:** Ripple in flight across the PRD economy sections + the living docs (this batch); each koku-as-currency ADR carries an inline re-scope note. Recorded with **D-108** (coin denominations) + **D-109** (tier→koku ladder + office track + T4 stipend). Per **D-022**, governs.

### D-108 ✅ — the tiered coin denomination display
- **created_date:** 2026-07-02
- **Decision:** COIN is ONE underlying value (base unit *mon*), displayed in fixed mixed denominations **mon → monme → ryō**. Fixed rate for the whole game: **1 ryō = 50 monme = 4,000 mon** (1 monme = 80 mon) — matches the Bank of Japan primary source and the human's worked example. Higher denominations reveal **INCREMENTALLY** as wealth grows (mon at T0–T1; monme mid-game; ryō at T4–T5). No moneychanger, no floating forex (the historical float is abstracted).
- **Why:** Legible Edo-flavoured big-number formatting; the denomination itself signals the player's rise.
- **Consequences:** The coin formatter renders one underlying `mon` value in the mixed denominations, revealing monme then ryō as wealth grows. Composes with **D-107** (COIN is the sole spendable currency). Per **D-022**, governs.

### D-109 ✅ — the tier→koku ladder + the endgame axes
- **created_date:** 2026-07-02
- **Decision:** The House's koku standing scales by tier — **T0 tens → T1 ~100–1,000 → T2 ~1,000–5,000 → T3 ~5,000–10,000 → T4 = 10,000 (the daimyō threshold) to ~100,000 → T5 ~100,000–1,000,000+** (Kaga ≈ 1,025,000 = the ceiling). Bands **PROVISIONAL / liquid** (**D-059**), tuned by the pacing sim. A **PERSONAL koku stipend appears only from T4+** (koku is House-only before). At **T5** a **FULL PARALLEL Office / court-rank / favour track** gates the top ranks (koku = scale, office = access) — anchored by Tanuma Okitsugu (ashigaru son → 57,000-koku daimyō + rōjū) and the fudai/tozama office-gate. Rank milestones grant **VISIBLE STATUS TOKENS** (surname → the two swords → gōshi rank). Standing is re-assessed seasonally + the "assessors arrive" event at tier jumps.
- **Why:** A concrete kokudaka-like ladder reads as real Edo standing (not an abstract score), and splitting the endgame into two legible axes — koku = *scale*, office = *access* — keeps the T5 court game about more than a bigger number.
- **Consequences:** The tier→koku bands + the T4 personal stipend + the T5 office/court-rank track + the status-token milestones ripple into the PRD spine sections (this batch). Composes with **D-107** (koku = standing) + **D-010** (the indirect Edo ceiling). Magnitudes liquid (**D-059**). Per **D-022**, governs.

## D-110 — 2026-07-02 every rung is a player-triggered VN story beat (extends D-104)

### D-110 ✅ — Every rung is a full, player-TRIGGERED VN story beat with remembered choices + occasional small varied bonuses; NOT every rung a perk
- **created_date:** 2026-07-02
- **Context:** The rung-up transition plan
  ([`project/archive/opus-2026-07-02-rung-up-story-transitions.md`](../../project/archive/opus-2026-07-02-rung-up-story-transitions.md))
  diagnosed that promotion is today an instant, silent hot-path side effect — a
  number-fill plus a single mis-channeled log line — with no player affordance and
  no motivation for the areas/panels/people it unlocks (playtest **F97/F99/F103**).
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
  expectation, and preserves D-104's "never let the VN become wallpaper" by making
  the *weight* narrative rather than mechanical.
- **Consequences:** **EXTENDS/REFINES D-104** — D-104's full-screen VN pattern (for
  story-significant, interactive NPCs) now also frames **every rung beat**, not only
  first-meets; the ranks build must replace the instant hot-path `promoteRungs` with
  a pending→player-triggered→apply state machine (a `rungBeat` cursor beside
  `introBeat`, reusing the append-only VN engine), and the choice payload is
  relationship/flag-first with rare small bonuses. The trigger lives at the
  **header rung element (F106)** — "ready to advance" surfaces there, and triggering
  navigates to the beat. Supersedes the plan's "Option 2 default" (milestone-only VN)
  in favour of every-rung beats. Composes with **D-107–D-109** (any coin/rice copy in
  beats rescoped by the economy re-core) and **D-055** (reveal follows the story).
  Per **D-022**, governs.

## D-111 — 2026-07-02 deep housing: comfort bonuses + a status-mirror of your rise

### D-111 ✅ — Housing is DEEP — a furnishable home that grows with rung + a belongings inventory + set/synergy bonuses; bonuses = Edo COMFORT + the home as a VISIBLE status-mirror
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
  phased T0-first. The belongings inventory lives in the **Inventory tab (F108)**,
  distinct from consumables/resources; the home's status-mirror ties the economy's
  **D-109** status tokens (surname / two swords / gōshi). Home tiers ride the rung
  ladder (**D-110** beats), reusing the A8 interior-house reveals as scaffolding and
  the estate flywheel as the visible-upgrade template. Sequenced against the economy
  re-core (**D-107–D-109**) since furniture costs **coin**. A new home panel will
  need a **D-075 diverge** pass. This makes the deep layer the brainstorm's
  recommended "T1 status-mirror ambition" a **now** commitment. Per **D-022**,
  governs.

## D-112 — 2026-07-02 the tab IA is a six-tab set revealed incrementally

### D-112 ✅ — The player UI is six tabs — Work · Map · Estate · Inventory · Character · Combat — each revealed only as it unlocks (preserving the incremental-reveal signature)
- **created_date:** 2026-07-02
- **Context:** The v0.3.3 playtest surfaced a cluster of tab-IA feedback
  (**F100/F107/F108/F109/F110/F112**): navigation was duplicated across Work and the
  estate map (**F107**), the storehouse/bank sat in Work rather than a holdings home
  (**F108**), the pedlar's shop was dumped inline instead of being a talkable person
  at a map node (**F109**), and the human called for a dedicated Map tab of the
  current node — walk-to + who's here + talk-to (**F110**). The through-line is
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
    into Character or Map. Unlocks when combat goes live (≈R3, D-100/D-110).
- **Why:** One capability per thematic tab kills the duplicated-nav confusion and
  gives holdings, the map, the character sheet, and combat each a legible home, while
  the incremental reveal keeps the "UI as progression" signature (§1) — a fresh
  player still starts on a single calm surface and earns each tab. Combat earns its
  own tab because the fight loop is a first-class pillar (D-100), not a sub-view of
  the character sheet.
- **Consequences:** DOC: `ui-design.md` §IA/tabs gains the six-tab set + the
  incremental-reveal gating. BUILD: an IA reorg render pass moves nav → Map (F107),
  the storehouse → Inventory (F108), the pedlar's shop → a talkable Map-node NPC
  (F109), estate upgrades → Estate (F100), and the fight loop/stance → the **Combat**
  tab; the belongings inventory (**D-111**) lands in the **Inventory** tab, the
  bestiary in **Character**. The rung lives in the header, not a tab
  (**F106**/**D-110**). Composes with **D-055** (reveal-gating), **D-100** (the
  combat pillar), **D-106** (the multi-panel workspace within a tab), and
  **D-104/D-110** (the VN scene still hides the whole shell regardless of tab). Per
  **D-022**, governs.

## D-113 — 2026-07-02 a combat loss bleeds carried coin + rice + materials (the kura shelters them)

### D-113 ✅ — A lost fight costs all three carried resources — coin + rice + materials; banking in the kura protects them (an economy-build call under D-107)
- **created_date:** 2026-07-02
- **Context:** Under the flattened single-koku economy a lost fight bit carried
  koku. The economy re-core (**D-107**) splits the economy into **rice** (a
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
  preserving koku as pure prestige (**D-107**).
- **Consequences:** An **economy-build call under D-107** — the loss-bite reducer
  now debits carried coin + rice + materials (was carried koku); the kura's
  store/withdraw covers all three. Feeds the Inventory-tab storehouse (**D-112**,
  **F108**). Ripples into the PRD combat/economy sections with the D-107 batch.
  Magnitudes liquid (**D-059**). Per **D-022**, governs.

## D-114 — 2026-07-02 every vendor is a PERSON on a spectrum, with an optional place-gate

### D-114 ✅ — Shops are people on a spectrum (full VN character / small person / tiny trader) + an optional place-gate; no shop is a bare inline menu
- **created_date:** 2026-07-02
- **Context:** The pedlar's shop was dumped as an inline menu in the Work tab; the
  human's steer (**F109/F110**) is that a vendor is a **person you talk to**, met at
  a map node's "who's here" list, not a menu. That raised the pattern-level question:
  are all vendors full VN characters (expensive), or is there a spectrum?
- **Decision (human, 2026-07-02):** **Every shop is a PERSON you talk to** — never a
  bare inline menu — arranged on a **spectrum** of interaction depth:
  - **(a) FULL VN characters** — a **D-104** full-screen modal introduction + quests
    + ongoing dialogue content (the richest vendors).
  - **(b) SMALL people** — a line or two of dialogue **+ a trade** (light presence,
    real voice).
  - **(c) TINY traders** — **ZERO questions to ask**; talking to them opens straight
    into the **trade / buy / market menu** (a face on a shop, no dialogue tree).
  AND a vendor may be **tied to a PLACE that gates them**: you must **reach or BUILD**
  the location first (e.g. the **smithery** before you can talk to the **smith**). So
  **a vendor = (person on the spectrum) + (optional place-gate).**
- **Why:** Making every vendor a person (not a menu) keeps the world diegetic and
  consistent with the "who's here" map model (F109/F110) and the VN pattern (D-104),
  while the spectrum lets the game **spend authoring budget where it matters** — a
  full VN character for the vendors who carry story, a bare trade-face for the ones
  who are just a market — so the pattern never becomes wallpaper and never over-
  serves a trivial trade. The place-gate ties a vendor's availability to real
  progression (reach/build the location), giving shops an earned, sited feel rather
  than blinking into existence.
- **Consequences:** Composes with **F109** (the pedlar is a person, discovered via a
  reason — the pedlar is a **(b) small person** or **(c) tiny trader**), the
  estate-map **"who's here"** model (**D-112** Map tab / F110), and **D-104/D-110**
  (full VN vendors use the same scene engine). The vendor model is a **norm for the
  map/NPC direction** — noted here and to be folded into `ui-design.md` (§ map/NPC)
  and the rung-story entity-discovery design (the F99/§5 pedlar worked example). A
  place-gated vendor's shop reveals only when its location is reached/built (reuse
  the surface-reveal + estate-build gating). Per **D-022**, governs.

## D-115 — 2026-07-02 the estate-map presentation is NOT locked — the build diverges freely

### D-115 ✅ — The estate-map presentation stays OPEN — the build produces 3–4 genuinely-distinct, terse/hint-free working variants behind the DEV toggle; the human picks live
- **created_date:** 2026-07-02
- **Context:** The Map tab (**D-112**) needs a presentation for the current node +
  navigation + "who's here." Rather than lock one visual model up front, the human
  chose to keep the direction open and let the build audition several.
- **Decision (human, 2026-07-02):** **Diverge freely** on the estate-map — the build
  produces a **diverse 3–4** working variants, e.g. a **2D spatial** map, a
  **scroll / 道中記 (dōchūki) ledger**, a **minimal node list**, and a **node-graph** —
  **all terse / hint-free**, all wired **behind the DEV toggle** (**D-075**) for the
  human to pick live. **No single direction is locked.**
- **Why:** The map is a signature surface with several viable idioms; auditioning
  distinct working variants live (per D-075) surfaces the right one by play rather
  than by argument, and keeping them terse/hint-free holds the woodblock/ink bar
  (**D-018**) — no slop, no hand-holding chrome.
- **Consequences:** The estate-map build runs a **D-075 diverge** with **3–4**
  variants (an R-item per variant in [`review.md`](../../project/human-in-the-loop/review.md));
  prod ships only the self-picked default until the human locks one live (zero PROD
  flag-debt). This is a **build directive for the Map tab (D-112)**; folds with the
  vendor "who's here" model (**D-114**) and the nav-single-home rule (**F107**).
  Per **D-022**, governs.

## D-116 — 2026-07-02 location/navigation flavor routes to the Map node, not the Story log (resolves F114)

### D-116 ✅ — Location flavor lives as the Map-node DESCRIPTION (standing, hint-carrying) + a transient "Now" line on move; the Story log holds only mandatory story beats
- **created_date:** 2026-07-02
- **Context:** Navigation/location flavor (e.g. "The grain-store where you woke —
  dark, dry…", "The estate gate and its swept forecourt…") was being spammed into
  the **Story log** on every move — but it isn't story. **F114** flagged the
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
- **Consequences:** **Resolves F114.** Ties the map model (**D-114** "who's here"
  / **D-115** estate-map presentation) — the node description is the standing
  surface those variants render — and the **F111/F103 channel discipline** (Story
  vs Chat vs Now). The hint-carrying node description is the hook the emergent
  node-action idea (see
  [`../../project/brainstorms/2026-07-02-emergent-node-actions.md`](../../project/brainstorms/2026-07-02-emergent-node-actions.md))
  builds on. Home for the settled copy rule: `ui-design.md` (§5.1 channels + §
  map). Per **D-022**, governs.

## D-117 — 2026-07-03 the frontier PRD — spec-ahead, compress-behind (refines D-097, extends D-021)

### D-117 ✅ — The PRD's PRIMARY job is the forward spec of the UNBUILT; shipped tiers compress (once per tier, human-signed) to intent + acceptance criteria + pointers
- **created_date:** 2026-07-03
- **Context:** ~half of the repo's 496 commits are process upkeep, and a
  recurring share is "ripple X into the PRD": every built-system change pays a
  two-place write (code + spec), policed by after-the-fact audits — the koku
  economy alone was speced, tightened, then re-cored within ~36 h once play
  exposed the pacing. The PRD's irreplaceable value is concentrated in the
  UNBUILT (T1–T5, endgame); for built systems the build + ADRs + generated
  docs are the better truth (R2 — the build wins). Locked via a live 6-round
  Q&A:
  [`2026-07-03-prd-on-a-diet.md`](../../project/brainstorms/2026-07-03-prd-on-a-diet.md).
- **Decision (human, 2026-07-03):** **(1) Job #1** — the PRD is first the
  **forward spec of the unbuilt**; D-097's "complete standalone what" becomes
  secondary (the PRD stays standalone and end-state-framed). **(2)
  Compression** — when a tier's human **taste review closes** (NOT at
  code-ship; T0 shipped Jun 29 but was re-cored Jul 2 — shipped ≠ settled),
  the agent drafts ONE compression sweep for that tier: surgical subsection
  edits across §2–§6 (the frontier cuts through the per-concern sections);
  each built slice → intent + acceptance criteria + pointers (code /
  generated `docs/content/` / ADRs), with generated fact-regions where build
  == end-state intent (the mechanical-checkpoint gen-region machinery). Filed
  as a `docs/plans/` reel-back + R-item; the **human approves the diff**
  before it lands. **(3) Demoted text** is archived **verbatim** to
  `project/archive/` with a forward pointer (archive, don't remove). **(4)
  Interim rule (narrow — the human chose this over a full ripple-freeze):**
  only §4's illustrative balance magnitudes stop being hand-rippled NOW
  (already provisional per D-021; `balance.ts` + the generated tables are
  their source of truth); system/narrative ripple continues per-change until
  each tier's compression event.
- **Why:** kills the per-change spec tax exactly where it bites — built
  systems churning under daily playtest — while preserving the
  forward-design value the PRD alone carries; ripple becomes a rare,
  human-signed, once-per-tier event.
- **Consequences:** §4 gains a no-hand-ripple banner (applied this session);
  `prd.md` "How to read" gains the frontier-line note. First compression event =
  **T0, triggered when R1 closes**. Claude-picked defaults pending async
  override (flagged in the brainstorm's Open flags): fidelity audits of
  compressed territory baseline on acceptance criteria + ADRs + generated
  docs, not detail-prose; §6 tech-architecture folds into the T0 sweep. Per
  **D-022**, governs.

## v0.3.5 — the agent-default audit decisions (2026-07-03)

Seven ADRs from the interactive agent-default audit
([`project/audit/reports/2026-07-03-agent-default-decision-audit.md`](../../project/audit/reports/2026-07-03-agent-default-decision-audit.md)):
six T0-build plans were verified against git + source, then every place the
agent had picked a "default" and shipped it was walked through with the human.
Code deltas → [`project/archive/opus-2026-07-03-v0.3.5-build-plan.md`](../../project/archive/opus-2026-07-03-v0.3.5-build-plan.md) (built + merged).

### D-118 ✅ — Economy: koku is pure standing (no income flywheel); rice storage must cost something
- **created_date:** 2026-07-03
- **Context:** The koku-economy re-core (**D-107**) shipped Phases 1–4; the audit
  verified it and surfaced two economy calls for the human. The shipped kura is
  free, lossless and loss-safe, so "always hold rice until spring" dominates the
  seasonal store-vs-sell choice (`economy-balance-watch`).
- **Decision (human, 2026-07-03):** **(1)** koku is **pure standing + the
  ascension gate** — ratified. It reads as House prestige and gates the climb, but
  **never multiplies income** (the soft-flywheel is rejected). **(2)** Rice storage
  must **cost something** — a per-season spoilage %, a kura capacity cap, or a
  small upkeep fee — so store-vs-sell is a live decision. The exact mechanism is
  **liquid**, chosen at build (**D-059**).
- **Why:** koku-as-standing keeps the pillar legible and the economy honest; a
  costed store closes a dominated decision without adding UI.
- **Consequences:** build-plan §1 adds the storage cost; the balance-watch item
  closes. Relates **D-107**, **D-059**.

### D-119 ✅ — IA: the tab set is SEVEN — Quests regains its own tab; Inventory reveal staggered to R3 (supersedes D-112's six-tab lock)
- **created_date:** 2026-07-03
- **Context:** **D-112** (2026-07-02) locked a **six-tab** set and folded Quests
  into Character as "Undertakings 用", explicitly superseding **D-037**'s "Quests
  is its own tab." But D-112's own build DoD said the quest-home fork (§8.1) must
  be "resolved WITH the human" — it was shipped on the agent's default instead.
  The audit put it (and the R1 triple-reveal) to the human.
- **Decision (human, 2026-07-03):** **(1)** Quests get their **own dedicated tab**
  again — the set is now **SEVEN**: Work · Map · Estate · Inventory · Character ·
  Combat · Quests. This **supersedes D-112's six-tab lock and reinstates D-037's
  intent**. The Quests glyph is **用** provisionally (a taste call, overridable).
  The **Quests tab reveals at R5** — its own quest-log beat (D-037's cadence),
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
  code comments at `render.ts:4504–4506` (citing "D-112 supersedes D-037") are
  corrected. **Supersedes D-112** (six-tab set); reinstates/relates **D-037**.
- **Amendment (human, 2026-07-03):** staggering the Inventory tab to R3 left the
  **home** (`panel-home`) still revealing at R1 (`rank-r1`) with its "a place here
  is yours" narration — but the home/belongings pane lives *inside* the Inventory
  tab, so for two rungs the log promised a home with no tab to open. **`panel-home`'s
  reveal is moved to R3** (gated on the same `tab-combat` its tab uses), so the home
  is announced exactly when its tab appears. This **adjusts D-111's "home at R1"
  timing to home at R3** (*"R3 is fine, we don't need deep housing at R1 — plenty of
  R1 features already"*). `rest` still degrades gracefully pre-home (the cold-open
  post line, zero comfort); nothing at R1 depends on `panel-home`.

### D-120 ✅ — Housing: the hearth homes the cook verb; the chest is real storage; no morale system
- **created_date:** 2026-07-03
- **Context:** Deep housing (**D-111**) shipped a T0 slice, but the audit found the
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
  `ComfortKind` widens to include **storage** (not morale). Relates **D-111**.

### D-121 ✅ — Story: rung-beat cast & rewards ratified; the R7 capstone becomes a mechanical branch
- **created_date:** 2026-07-03
- **Context:** The rung-up story beats (**D-110**) shipped; the audit ratified the
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
  see D-125** (the capstone-branch pattern + the T0 design); build is post-v0.3.5.
  Removed from the v0.3.5 build sweep. The full beat prose is still an R8 read.
  Relates **D-110**, **D-125**.

### D-122 ✅ — Status tokens: T0 grants exactly ONE home token; the full ladder is T1–T5
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
  full ladder becomes a PRD multi-tier arc, unbuilt in T0. Relates **D-109**,
  **D-111**, **D-120**.

### D-123 ✅ — Render: the append-only engine ratified; the Now-view residual closes
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

### D-124 ✅ — Process: subagents inherit the parent's model by default (no lateral model switch)
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

### D-125 ✅ — Capstone branches: the tier-seam choice pattern (+ the T0 design)
- **created_date:** 2026-07-03
- **Context:** D-121 locked that the **R7 capstone choice must matter
  mechanically**, then split it to a design pass. A `grill-me` + `diverge` session
  (`project/brainstorms/2026-07-03-r7-capstone-branch.md`) settled both a **reusable
  pattern** (so T1–T5 capstones can be designed later) and the **concrete T0
  design**. This ADR records the pattern as canon; the build-ready detail lives in
  [`capstone-t0-branch.md`](../living/capstone-t0-branch.md) (the plan archived).
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
  **D-121**; relates **D-110** (rung beats), **D-119**. **⏳ Build DEFERRED to T1:**
  the side quests are T1 content (R8→R15) and T1 isn't built (R6 — don't build
  unreachable); the R7 *choice* already ships. Full build-ready spec graduated to
  [`capstone-t0-branch.md`](../living/capstone-t0-branch.md); its plan is archived.

### D-126 ✅ — Taste: the top layer locked (4 values · 3 touchstones · 2 references) + the taste docs become budgeted snapshots
- **created_date:** 2026-07-03
- **Context:** the ⭐ "redo taste-distillation WITH Fable" TODO. The first-cut
  `taste.md` (437 lines, 22 principles) is corrective, not generative — its
  F-coverage is near-total but it has no top layer an agent can reason from in
  situations no rule covers; and living docs bloat without a bound (the
  326-line `project-status.md` lesson). Grill session + full Q&A log:
  `project/brainstorms/2026-07-03-taste-transfer-architecture.md` (§10);
  build order: `docs/plans/fable-2026-07-03-taste-redo.md`.
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
    F-corpus in `project/human-feedback/` stays the lossless example record.
    The pre-ship checklist LEAVES `taste.md` → F10's generated scorecards.
  - **Derivation corpus:** `2026-07-02-playtest.md` ONLY (the first and only
    playtest); a systems-taste layer waits for a systems playtest.
- **Why:** "build it as if I wrote it" needs a layer that *predicts* verdicts
  in novel situations — values and touchstones transfer; rules only correct.
  A hard budget turns append into displace, so the standard sharpens instead
  of growing; the examples already live in the corpus, and restating them in
  living docs is drift, not safety.
- **Consequences:** the taste-redo plan P1–P4 executes against this lock;
  AGENTS.md gains a ~10-line taste register (P3); F10 re-plans once
  `taste.md` locks; `ui-design.md`'s vision statement gets a
  provisional-pending-R9 marker in the P2 cull.
