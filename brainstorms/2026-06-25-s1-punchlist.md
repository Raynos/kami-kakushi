# §1 Staleness Punch-list (audit wkwulrwqx, 2026-06-25)

> Discovery capture: the merged punch-list from the 4-auditor §1 staleness audit. Drives the comprehensive §1 fix.

---

All line references are confirmed. I now have full coverage to produce the merged punch-list.

# §1 STALENESS PUNCH-LIST — `docs/prd.md`

Merged & deduped from four audits (STORY, SYSTEMS, STRUCTURE, JOURNAL-CROSS-CHECK). Canon = `brainstorms/2026-06-25-locked-decisions.md`; journal = `journal/2026-06-25-session-02.md` (Round-2 review L113–225; 48-decision Q&A L260–409; Round A + §1.12 bug L447–459). Grouped by §1 subsection, BLOCKERS first within each group. All four audits independently corroborate the five BLOCKERS below.

---

## §1.5.1 — Estate rank ladder

**[BLOCKER] L208, R5 — management-sim rung is the root of the §1.12 bug.**
The R5 row tags track `labour→mgmt` and unlocks "a **labour-gang to assign** (Sota, Mago, seconded hands as idle producers); the first **managed sub-economy**; +1 helper slot; the **assignment/management panel**."
CORRECT: NO people-management sim (canon §G L119–121; journal §1.12 L215–216; Round A bug L453–455). Building/recruiting are flavour/light, not a minigame. Rewrite R5 around the MC's own gameplay (combat/skills/jobs/crafting). Remove "labour-gang to assign," "managed sub-economy," "assignment/management panel."

**[BLOCKER] L196–199 & L207 — combat introduced too late (R4, mid-ladder).**
"interleaving **exactly two combat rungs** (R4 humbling-fight floor, R6 first combat-earned standing)"; Combat panel/Bestiary/Equipment first reveal at R4 (rung 5 of 8).
CORRECT: Round A explicitly orders "introduce COMBAT EARLIER (a core pillar from early on, not mid-ladder)" (journal L455); Round-2 "combat ranks weave throughout" (L130–131); canon §E = first-class pillar. Combat must surface materially earlier than R4, and "exactly two combat rungs" undercounts the mandated interleave — either more combat rungs starting earlier, or combat available off-ladder from early game.

**[major] L208 & L210 — `labour→mgmt` track labels.** R5 and R7 are tagged `labour→mgmt`. "mgmt" as a progression track contradicts the no-management-sim lock. Retag (e.g. `labour` / `labour→admin-as-narration`); ensure R7 "Field administration" reads as the MC's own offices/quests (canon §D), not a management layer.

**[major] L201–211 — single R0–R7 ladder spans T0 AND T1, contradicting "fresh ladder per tier."** Prose at L178/L183–184 claims a fresh ladder per tier, but the table runs one continuous R0–R7 across both tiers (R3 "the VILLAGE TIER opens here"). Canon §C L49 + Q&A R11 lock a fresh rank ladder PER TIER. Split into a T0 ladder and a T1 ladder.

**[minor] L208 & L281 — "idle producers at R5" vs auto-producers-late-only.** Canon §G L132–133: auto-producers "limited / late-game only." R5 (mid-T0/T1) is not late-game. Resolves when the R5 rewrite (above) lands; do not re-introduce early auto-producers.

**[minor] L212–213 — estate buildings "gate on Influence band."** Reintroduces the single-bar framing the four-pillar model replaced (§1.6.3 L337 says tier-up is "not crossing a single band"). Reference the relevant pillar(s) (primarily Estate & Wealth), not a monolithic "Influence band."

**[minor] L190–194 — "Twin earned currencies" (Estate Service XP, Combat Deeds) terminology overload.** Canon currency list (§G L130–131) = koku + coin (mon) + 4 pillars. These are rank-gating meters, not economy currencies; rename (e.g. "earned standing meters") so a §2/§6 author doesn't add them to the save/economy model.

---

## §1.5.2 — Village cast (meibutsu candidates)

**[major] L443–444 — meibutsu still framed as an undecided candidate list.** Weaver Onatsu = "lead *meibutsu* candidate," Brewer Tokuemon = "(sake) candidate." CORRECT: meibutsu = **silk / sericulture**, LOCKED (Round A, journal L449–450). Resolve Onatsu to the silk/sericulture lead; demote Tokuemon's sake from a meibutsu candidate. (Note: audits cite these as L443–444 from a prior read; in the current file the Village/Onatsu rows are in §1.5.2 around L230–236 and the candidate framing recurs in the §1.8 cast — fix wherever "meibutsu candidate" appears.)

---

## §1.5.3 — Origin contacts

**[BLOCKER] L251–252 — origin FATHER missing.** Lists "mother Oyuki, sister Okimi, employer Denbei, friend Kanta, sweetheart Ohana, the porter-guild" — no father.
CORRECT: Round A locked "origin **father RE-ADDED** (rename to avoid the 'Kuranosuke' collision — pick a period name)" (journal L450–451); Round-2 "ADD THE FATHER to faction-3's family" (L139–140). Add him here under a new non-colliding period name. (Rename value is unspecified anywhere in §1 — an explicit unmet action item.)

---

## §1.6.1 — Four pillars / meibutsu

**[major] L310 & L315–316 — meibutsu still "optional" / undecided.** "TRADE (routes, broker standing, the **optional *meibutsu***)"; "one optional capstone." CORRECT: name it **silk / sericulture** (locked, Round A L449–450). Keep the "1-of-3 sub-engine, capped ~⅓" structure (that's canon-correct), but stop treating the product as open.

---

## §1.6.3 — Tier gates

**[BLOCKER] L337–339 — tier-gate uses the REJECTED floor + ≤25%-overflow formula.** "a **four-value gate** — a **balanced-development floor** (clear ALL FOUR per-pillar minimums) plus **capped overflow-substitution (≤25%)**."
CORRECT: Round A REJECTED this formula in favour of "**per-tier required pillars, simple thresholds**" (journal L450–451); canon §D L75 "Tier gating = PER-TIER REQUIRED PILLARS." Replace with simple per-tier required-pillar thresholds; remove the all-four floor and the ≤25% overflow mechanic entirely. (Note internal contradiction: the very next sentence, "Per-tier weighting drifts: early=Arms+Estate, upper=Office+Name," is correct and already contradicts the all-four-floor claim above it — keep that sentence.)

**[minor] L351 — T4 gate wording compression.** "→ grow influence → the national tier" lightly compresses canon's "conquer the castle-town / grow influence" (canon L40–41). Acceptably faithful; tighten only if rewriting the table.

---

## §1.7 / §1.7.1 — Scope, world-UI, maps, marriage

**[major] L402–404 — full-maps-at-every-tier framed as an OPEN question.** "**Macro-tier spatiality** … is a §1.14 open question — the human has indicated full maps at every tier; design upper nodes so they *can* ship first as thin abstract boards."
CORRECT: Round A locked "FULL maps at EVERY tier, always (incl. Castle-town & Edo — built later)" (journal L449–450); Q&A R1 #4 (L269–270); canon §I L161. Remove the "open question / vs abstract boards" hedge; demote to a pure build-sequencing note at most.

**[major] L402–403 — Marriage/Adoption brokerage listed as CUT.** Q&A R2 #5 (journal L273–274) locks marriage/adoption as a **REAL late-game (T3/T4) alliance/status lever, kept lean** — not cut. Restore it as a lean late-game Standing/Name lever; remove from the cut list. (Currently it appears only obliquely as a T3 takeover sub-route at §1.6.3 L353.)

**[minor] L365 — "v1 ships full maps for T0–T2."** Correct for v1 build scope; confirm nothing elsewhere implies T3/T4 are abstract-board-only *by design* (vs merely built later). The only offending hedge is L402–404 (above).

**[major/scope] v1 T2 rank ladder not enumerated.** §1.5.1 stops at R7/T1 and parks "the full 15-rung braid … for T2+" (L199), yet v1 = T0–2 complete and canon §I L161 = "per-tier rank ladders for T0–2." The v1 T2 ladder is under-specified; either enumerate it or explicitly scope it to a later §.

---

## §1.8 — Cast / antagonists

**[BLOCKER] L453–458 — origin FATHER absent from the origin roster** (Oyuki, Okimi, Denbei, Kanta, Ohana, Oharu — no father). Same lock as §1.5.3. Add the father with the chosen period name.

**[major] L458, L486, L591 — "Oharu" is an author-invented proper noun, not in canon.** Canon §F L112–113 and Q&A #48 (journal L398) say only "lost-child (Tama) = a girl who ran" — never "Oharu." Internally consistent across §1, but never human-locked. Flag for human sign-off as a new canon name. Sub-note: "Oharu" (runaway Tama) vs "Ohana" (Tahei's sweetheart, L457) are near-homophones in the same post-town — flag for legibility. **[minor]**

**[major] L465 — Rival House Tomita "heir **Kageyuki**" is an author-added name** (canon names only Tomita + the second house). Akagi (L466) is correctly the locked second house (supersedes the brainstorm's "Okabe"). Confirm Kageyuki/Sōzaemon/Yasubei lineage with the human as new canon, or trim to what canon supports.

**[minor/major] L417-area — Naoyuki "rival inside the household → brotherhood" arc is an uncatalogued author addition.** Canon §F L102 frames succession purely as Munenori-declines → Naoyuki-rises; the early in-house gatekeeping-rival/talent-foil arc appears only in the cast notes. Plausible and on-theme; flag as new canon for confirmation.

---

## §1.9 — Side-quests / personal-mystery pacing

**[BLOCKER] L511 — origin reunion list omits the FATHER** ("Oyuki, Okimi, Denbei, Kanta, Ohana"). Add the father once renamed.

**[major] L476–477 vs §1.11 L590–592 — father reunion pacing undefined.** §1.9 says both origin threads "resolve at the Region tier (T2)" (canon §F L111; Q&A R1 #3); but §1.11's T4 epilogue carries "the recovered family proud behind him." With the father re-added, §1 must state explicitly whether his reunion resolves at T2 (per canon) with only an emotional callback at T4. Currently undefined because he is simply absent.

**[minor] L485–486 — "Tama was a girl … (as Oharu)."** The girl-not-boy gender-drift clue is canon-correct (canon §A); only the name "Oharu" is the uncatalogued addition (see §1.8). Gender clue: no change.

---

## §1.11 — Endgame

**[major] L572–576 — "popular *mitate*/parody broadsheet" + sumo-rank vocabulary (Maegashira/Komusubi/Ōzeki/Yokozuna) is author-elaborated, not human-locked.** Canon §F L105–106 and Q&A R4 #15 (journal L302–303) lock only "national multi-pillar *banzuke* ranking the HOUSE on all four pillars" + the D-010 ceiling. The "mitate/parody/unofficial" framing is the brainstorm's Option-A recommendation, never confirmed. The substance (rank the house, D-010 ceiling) is canon-correct; flag the parody-broadsheet + sumo-rank framing for sign-off rather than stating it flat.

**[confirmed correct — no change]** L558–566 racket = light/optional, T0 villain-less, "one rotten root" retired (matches canon §F + integration note). Per-tier antagonist ladder T0 Debt → T1 Magobei → T2 Tomita+Akagi+Hanzaki → T3 Kuroiwa → T4 Echizen-ya+Inspector (matches journal L438–440, canon §F, D-014). Succession beat L588–592 (matches canon §F).

---

## §1.12 — UI-reveal pacing

**[BLOCKER] L616 — "R5 — assignment/management panel + labour-gang."** The named bug. DELETE entirely; violates canon §G / D-015 / Round A bug (journal L453–455). No assignment/management panel anywhere.

**[BLOCKER] L615 — combat first revealed at R4 ("drill yard + Combat panel + Equipment/Inventory + Bestiary").** After four pure-labour reveals (R0–R3). Must surface earlier per "introduce COMBAT EARLIER" (journal L454–455). Reconcile with §1.5.1 fix.

**[BLOCKER] L609–618 — reveal pacing presents ONE 8-rung ladder (R0→R7), not per-tier ladders.** Round A §1.12 redo (journal L454) requires the pacing to "reflect the per-tier rank ladders (not one 8-rank ladder)." Canon §C L49 + Q&A R11 lock a fresh ladder per tier. Re-frame as T0 ladder → fresh T1 ladder, not one continuous climb.

**[major] L621 — "the seasonal Influence results" stated without the new-high-water-mark constraint.** §1.6.2 L328–329 correctly limits judged results to "a new high-water mark (not repeatable maintenance awards)," but the scattered references here (and §1.6.1 L309 "seasonal security results") read as a per-season trickle — the exact thing canon §D L72–73 / D-015 bans ("never a passive time-trickle"). Carry the new-high-water-mark / no-repeatable-maintenance qualifier consistently.

**[confirmed correct — no change]** L620 active-only/abstract-clock/auto-producers-late; L604–605 multi-screen-progressively-revealed.

---

## §1.13 — Risks & guardrails

**[major] L646–647 — father framed as "dropped/renamed" OPEN question.** "the origin **father** is **dropped/renamed** to avoid colliding with any other *Kuranosuke*." CORRECT: locked as RE-ADD + rename (journal L450–451), not "dropped." Restate as a settled re-add with the chosen period name.

**[major] L655–656 — meibutsu "Lock … with the human … author against a placeholder."** Already locked = silk/sericulture (journal L449–450). Remove the placeholder/lock-it-later language.

**[minor — no action] L652–653 — 政威 *sei-i* vs 領 *ryō*.** Legitimately deferred to §4/§5 (canon §D L68–69; journal Round B "pending" L457). Keep flagged; not stale.

---

## §1.14 — ADRs & flagged-items

**[BLOCKER] L671 — D-008 ADR bakes in the rejected formula.** "per-tier required-pillar gating **(floor + ≤25% overflow)**." This is an ADR-level record of a decision the human REVERSED (journal L451); high-impact because it would propagate to `docs/history/decisions.md`. Change to "per-tier required-pillar gating via simple per-tier thresholds."

**[major] L689 — flagged-items presents the rejected gate SHAPE as "needs sign-off."** "the SHAPE (floor + ≤25% overflow; min/geometric-mean roll-up; Estate ≤¼ of roll-up, trade ≤⅓ of Estate) needs sign-off." The floor+overflow shape was decided AGAINST in Round A — it is not open. Strip "floor + ≤25% overflow"; only the trade ≤⅓ cap survives (canon §D L70).

**[major] L682 — meibutsu listed as still-open** ("silk/sericulture, sake, textile, lacquer, paper, or a rice brand … lock before authoring"). RESOLVED = silk/sericulture (Round A). Mark resolved, remove from flagged list.

**[major] L684 — macro-tier spatiality listed as flagged** ("full walkable maps … vs thin abstract … boards above T2"). RESOLVED = full maps at every tier (Round A). Mark resolved, remove from flagged list.

**[major] L687 — father listed as flagged** ("confirm the origin **father** is cut/renamed"). RESOLVED = re-add + rename (Round A). Mark resolved (re-added, name = chosen); remove the "cut?" framing.

**[major] L686 — second-rival-house "confirm" flag is stale.** "confirm [Akagi] is not folded into Naoyuki-as-internal-foil." Q&A R27 (journal L332–340) locks exactly TWO rival houses (Tomita + Akagi); §1 already keeps Akagi (L466, L554). Decision is made — remove the stale flag.

**[major] D-013 (L676) and §1 body — art register (text + emoji + CSS) MISSING.** Canon §H L145 + Q&A R23 lock "TEXT + EMOJI + CSS." Not stated anywhere in §1 body or in D-013. Add it (load-bearing presentation decision). *(Note: STORY/SYSTEMS audits judged presentation deferrable to §6; STRUCTURE/JOURNAL flagged it as a missing tech-mention — at minimum add to D-013 since the ADR table already carries tech.)*

**[minor — no action] L685, L688 — *osso* "whose neck" and room-unlock granularity.** Legitimately still open (canon-consistent; journal Round B pending). Keep.

**[minor] L669 — D-008 line currency naming.** coin/mon is never named in §1 body as the trade currency (canon §G L130–131); §1.6 L300 only says Influence is "not koku and not coin." Optionally name koku + coin (mon); deferrable to §2.

---

## §1.6.2 — Accrual

**[confirmed correct — no change]** L323–334 two-shape accrual (jumps + judged results, new-high-water-mark only), up-only + recoverable per-pillar dents, never a wipe. Matches canon §D / D-015. The only issue is the inconsistent "seasonal results" phrasing elsewhere (see §1.12 M / §1.6.1 L309).

---

## Items deferrable to §2/§4/§6/§7 (flag-only, NOT §1 defects)
Combat-failure soft-setback consequences (Q&A #19); soft-stamina meter (#31); rich attribute system STR/AGI/INT/SPD/luck (#32); deeper hybrid-crafting (#21); accessibility (#44); audio (#45); launch model (#46); single-difficulty (#47). Their absence from §1 is by design (§1 = vision/pillars/factions/world/endgame).

## Canon-gap note (root cause, outside §1 but drives recurrence)
The canon file (`brainstorms/2026-06-25-locked-decisions.md`) was written BEFORE Round A and the §1.12 bug, so it records none of: silk meibutsu, full-maps-always, simple-threshold gate, father re-added. Worse, canon §C still lists "father **Kuranosuke**" (the un-renamed colliding name), and canon under-records Q&A #5 (marriage as a real T3/T4 lever). Any author working from canon alone will re-introduce this staleness. Update canon to capture Round A + the §1.12 redo + #5, and rename the father in canon — otherwise the §1 fixes will not stick.

---

## FIX STRATEGY (what one comprehensive §1 rewrite/patch must change)

A single §1 patch must, in one pass:

1. **Purge the management sim** (the headline bug) — rewrite §1.5.1 R5 (L208) and §1.12 R5 (L616) around the MC's own gameplay; retag R5/R7 tracks off `mgmt` (L210); remove early "idle producers."
2. **Pull combat forward** — make combat a first-class pillar surfaced before R4 across §1.5.1 (L196–207), §1.12 (L615), and the world table; add/interleave more than two combat rungs (or make combat available off-ladder early).
3. **Replace the tier-gate formula everywhere** — kill "floor + ≤25% overflow / four-value gate / balanced-development floor" at §1.6.3 (L337–339), D-008 (L671), and flagged-items (L689); install simple per-tier required-pillar thresholds (keep the existing per-tier weighting drift). Keep only the trade ≤⅓ cap.
4. **Re-add + rename the origin father** with one chosen period name, applied consistently to §1.5.3 (L251), §1.8 (L453–458), §1.9 (L511); strip "dropped/cut" framing from §1.13 (L646) and §1.14 (L687); define his reunion as a T2 resolution with optional T4 emotional callback.
5. **Apply the three Round-A locks as settled, not flagged** — meibutsu = silk/sericulture (§1.6.1 L310/L315, §1.5.2 L443–444 candidates, §1.8, §1.13 L655, §1.14 L682); full maps at every tier (§1.7.1 L402–404, §1.14 L684); make each ladder per-tier (§1.5.1 table split; §1.12 reveal re-framed as per-tier ladders).
6. **Clean §1.14's flagged-list and ADRs** — move meibutsu/full-maps/father/second-house from "flagged" to resolved; correct D-008; add the text+emoji+CSS art register to D-013.
7. **Surface (don't bury) author-invented canon for human sign-off** — Oharu (and Ohana homophone), the mitate/parody-broadsheet + sumo-rank framing, Tomita's heir Kageyuki, and the Naoyuki rival→brotherhood arc.
8. **Enumerate the v1 T2 rank ladder** (or explicitly scope it forward) and restore marriage/adoption as a lean real T3/T4 lever.
9. **Make "seasonal results" consistently carry the new-high-water-mark / no-repeatable-maintenance qualifier** wherever it appears (§1.6.1 L309, §1.12 L621).
10. **Out-of-§1 but required to prevent regression:** update the canon file with Round A + #5 + the father rename.

Highest-leverage single lines: `docs/prd.md:337–339` (rejected gate formula), `:616` + `:208` (management-sim leftovers), `:615`/`:196–199` (combat-too-late), and the father absence across `:251`/`:453–458`/`:511`.