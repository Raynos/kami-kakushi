# PRD truth-audit — 2026-07-10 (session 136)

The HD-33 / ADR-168 audit: every PRD section audited against the shipped
story-bible + src by an independent agent, every finding adversarially
verified by a second agent (quote-checked against disk; refuted findings
dropped), plus a gen-region opportunity scout. Raw verbatim output:
`project/brainstorms/raw/2026-07-10-prd-truth-audit.json` (git-ignored).
Executing plan: `docs/plans/fable-2026-07-10-prd-truth-sync.md`.

Method: 7 section auditors + 7 per-section verifiers + 1 scout (workflow
`prd-truth-audit`, 15 agents, all Fable). Ground truth: `docs/story-bible/`,
the generated `docs/content/` docs, and the `src/core/content/` registries.
Out of scope by design: §4 balance magnitudes (provisional), unbuilt-tier
frontier spec (unless it contradicts locked bible canon).

**Totals: 59 confirmed findings (18 high · 30 medium · 11 low; 1 refuted
and dropped) + 8 gen-region opportunities.**


## 01-vision.md — 8 findings (5 high)

The vision prose, tone, identity threads, guardrails, and the §1.8 cast table
are largely current post-reboot (Tetsuji, Mohei, Ekai, Otsuru, the retired
Akagi/Tokubei all correctly reflected). The staleness concentrates in the
concrete tables: the §1.5.1 T0 rung ladder and its §1.12 reveal echo are
wholesale pre-reboot (old rung fictions, the scripted grain-store wolf, wrong
reveal timings), the T2 V0–V7 ladder and the §1.5.2 village-web shape
contradict the locked bible T2 sheet, and the built-game area registry carries
a full row-set of retired cast names and pre-reboot node geography. No freeze-
language remains in this section.</sectionVerdict> </invoke>

- 🔴 **docs/living/prd/01-vision.md:268-277** · stale-fiction · fix: **transcribe**
  PRD: “| **R3 — Yard-hand under arms (*buke-hōkōnin*)** | **combat (entry)**
  | A wolf at the grain store forces the **humbling, near-fatal first fight**
  early; **survive it**, then beg **Kihei** for drills.”
  Truth: The whole §1.5 T0 rung table is pre-reboot. Shipped ladder: R0 'The
  man from the weir' 無名 · R1 'The day-hand' 日雇 · R2 'The yard-hand' 庭男 (the
  SILENT rung) · R3 'The grain-watch' 蔵番 (the wolf is met on the R3 first
  NIGHT ROUND, survived-not-won) · R4 'The pupil' 弟子 (drill yard opens here,
  not R3) · R5 'The accused' 咎人 (the Count; the wage begins) · R6 'The trusted
  hand' 用人 (first coin errand at Yohei's stall) · R7 'The named hand' 名代
  (Gonbei written). No hiyatoi/genin/monban/kogashira/jikata-yaku fictions, no
  Smith-Gonta R4 crafting beat, no Lady-Chiyo trust gate.
  Source: src/core/content/ranks.ts:29-210; docs/story-
  bible/tiers/t0.md:14-21; docs/content/t0-story.md:715 ('survive-not-won'
  wolf)
  Fix: Replace the eight rows from the bible t0.md ladder + ranks.ts unlocks
  (or convert titles/unlocks to a gen-region from ranks.ts and keep only the
  'how earned' prose hand-written)

- 🔴 **docs/living/prd/01-vision.md:1014-1023** · stale-mechanics · fix: **gen-region**
  PRD: “**R3** — **drill yard + Combat panel + the carrying-pole +
  Equipment/Inventory + Bestiary + the bare auto-resolve loop + retreat**”
  Truth: §1.12's T0 reveal ladder restates the pre-reboot schedule. Build: R3
  opens tab-combat + Bestiary + the kura + weir reeds + the House-Influence
  teaser panel; Equipment panel, durability readout, repair verb, and the
  drill-yard map node all open at R4; crafting is never a 'top-level tab'
  (ADR-119, which the PRD's own pillar 2 states); the Skills-tab/woodlot line
  at R2 is the one row that still matches.
  Source: src/core/content/ranks.ts:107-147 (R3/R4 unlock arrays);
  docs/living/prd/01-vision.md:70-71 (crafting stays a section)
  Fix: Per-rung reveal lists are byte-derivable from ranks.ts
  rewardOnReach.unlock — generate them; strike the hand-typed R3/R4 rows
  Verifier note: Confirmed with one correction: R3's unlock array in ranks.ts
  DOES include 'panel-drill-yard' and 'readout-combat-level' (the finding's R3
  list omits them), so the PRD's 'drill yard' at R3 is half-right — the drill-
  yard PANEL opens at R3, only the map node ('room-drill-yard') waits for R4.
  The substantive errors stand: Equipment panel ('panel-equipment'),
  durability ('readout-durability'), and repair ('verb-repair') all open at R4
  per ranks.ts, not R3 as the PRD row says; and the PRD's R4 row's 'Crafting
  loop as a top-level tab' contradicts its own pillar 2 (lines 70-72:
  'crafting stays a section, not its own tab', ADR-119). The R2 Skills/woodlot
  row does match ranks.ts R2 unlocks.

- 🔴 **docs/living/prd/01-vision.md:302-311** · stale-fiction · fix: **transcribe**
  PRD: “| **V2 — Road-warden (*michi-ban*) for the house** | combat | Make a
  stretch of valley road or the ford safe in the estate's name”
  Truth: The T2 V0–V7 table contradicts the locked bible T2 ladder: R0 'The
  messenger' (Sayo's naming ignites at T2-R0) · R1 works-hand of the outer
  court · R2 dues-carrier (Genemon's silver) · R3 steward's shadow · R4
  market-man · R5 works-master (bandits hit the works — the first MAN he
  fights) · R6 the house's voice (the camp answered as a campaign) · R7 the
  yard-officer. The PRD rows' 'Magobei' and 'Gohei & Yatarō' exist nowhere in
  canon.
  Source: docs/story-bible/tiers/t2.md:9-20 (the ladder, half detail); grep:
  Magobei/Gohei/Yatarō absent from docs/story-bible/ and names.ts
  Fix: Rewrite the T2 block from tiers/t2.md's locked R0–R7 ladder (and drop
  the V-labels; the career is per-tier R0–R7 per ADR-152, as the PRD's own
  intro says)

- 🔴 **docs/living/prd/01-vision.md:756-772** · stale-fiction · fix: **transcribe**
  PRD: “Smith Gonta's forge; Obaa Kuni's herb stall; Brewer Tokuemon's; Weaver
  Onatsu's (silk)”
  Truth: The built-game area registry table carries pre-reboot names and
  geography: the smith is Tetsuji (a T1 works face, not a T2 village shop);
  the headman is Mohei not 'Yagōemon' (the PRD's own §1.5.2 says Mohei); the
  temple keeper is Ekai not 'Priest Ryōa'; Sukezō/Obaa Kuni/Tokuemon/Onatsu
  are not in canon (bible T2 cast: Kyūbei the miller, Funakichi the ferry
  keeper, Seiroku the bandit chief, O-Haru, Ganzō…). Also: the kura map node
  reveals at R3 (the grain-watch's post), not 'at the open (R0)'; the drill
  yard node reveals at R4, not 'R3'; there is no 'Deeper Woods (奥山)' node —
  forage_deepwoods is 'Forage deep in the woodlot' on the woodlot node (the
  near/deep wilderness nodes were retired into the woodlot).
  Source: docs/story-bible/04-cast.md:296,306,321; docs/story-
  bible/tiers/t2.md:70-117; src/core/content/ranks.ts:113-147;
  src/core/content/activities.ts:122-130; src/core/content/map.ts (no deeper-
  woods node)
  Fix: Rebuild the T0 rows from map.ts + ranks.ts reveal flags and the T2 rows
  from 04-cast/tiers-t2 names; delete the Deeper Woods row (fold its note into
  the woodlot row)

- 🔴 **docs/living/prd/01-vision.md:352-374** · stale-structure · fix: **transcribe**
  PRD: “instead of one rank ladder it is a continuous, **multi-node reputation
  web** … Per-shop "patron/regular" standing … Per-family goodwill … An
  **artisans'/craft-guild standing** … The **Village Chief's regard** — … a
  weighted roll-up”
  Truth: The bible's T2 sheet LOCKS the village track as ONE five-stage
  standing in the village's own voice — the surcharge → fair price → the nod →
  named → vouched-for — moved by deeds in the village arena only, and it can
  FALL. No per-shop meters, family-goodwill meters, guild meter, or chief
  roll-up exist in the locked sheet. (Same stale shape echoed at lines 444-445
  and 1040-1041 'village reputation web (shop meters…)'.)
  Source: docs/story-bible/tiers/t2.md:120-128 ('The village track (locked;
  never converts to rungs). Five stages…')
  Fix: Rewrite §1.5.2 around the locked five-stage village track (rises by
  deeds, can fall) and ripple the 'web / shop meters' phrasing at §1.5.4 and
  §1.12

- 🟠 **docs/living/prd/01-vision.md:283** · stale-fiction · fix: **transcribe**
  PRD: “the **first paid retinue** (Gohei & Yatarō) is won”
  Truth: Gohei and Yatarō exist nowhere in the story bible or the names
  registry. The bible's T1 first hiring is at T1-R6 — 'HE states terms at the
  board' — and 04-cast names Tetsuji the smith as 'R6's first hiring'.
  Repeated at lines 309 (V5 row) and 763 (area registry).
  Source: docs/story-bible/tiers/t1.md:20 (R6 the foreman — the first hiring);
  docs/story-bible/04-cast.md:296 (Tetsuji — R6's first hiring); grep:
  Gohei/Yatarō absent from bible + src/core
  Fix: Replace 'Gohei & Yatarō' with the bible's T1-R6 first-hiring beat
  (Tetsuji) in all three spots, or drop the names and keep 'the first hiring'

- 🟠 **docs/living/prd/01-vision.md:689-692** · stale-mechanics · fix: **prose-edit**
  PRD: “From the capstone of **T0**, **House Influence becomes visible** as a
  standing panel”
  Truth: The build reveals the House-Influence panel at R3, not the R7
  capstone: panel-house-influence is in R3's rewardOnReach.unlock, defined as
  the macro-teaser surface. The same capstone-visibility claim recurs in the
  R7 table row (line 277) and §1.12 R7 (line 1023).
  Source: src/core/content/ranks.ts:118 ('panel-house-influence' in R3
  unlock); src/core/content/surfaces.ts:370-380 (the macro teaser, revealed by
  the R3 reward)
  Fix: Change the teaser's reveal moment to R3 (the standing panel teases from
  R3; Phase 2 opens at the capstone)

- 🟡 **docs/living/prd/01-vision.md:747-752** · stale-structure · fix: **prose-edit**
  PRD: “**The shipped T0 walkable map (v0.4.0)** opens the estate anatomy
  above room by room: *The weir & riverbank* (the cold open) · *The forecourt*
  …”
  Truth: The list names 15 nodes; the shipped map registry has 16 — it omits
  "Sōan's sickroom" (the convalescence node, always-walkable alongside the
  weir).
  Source: src/core/content/map.ts:54-224 (node labels incl. "Sōan's sickroom"
  at :65)
  Fix: Add Sōan's sickroom to the node list (or gen-region the list from
  map.ts)

## 02-systems.md — 9 findings (2 high)

The section is in better shape than feared: §2.2 was re-transcribed to the
ADR-153 six-season model, the storywave addenda block documents the shipped T0
subsystems, and the four gen-regions plus most rung/node/discovery prose
(16-zone map, quest tab at R5, night-round wolf in §2.9, origin cast) match
the build and bible. The real rot is concentrated in the economy: §2.4, the
§2.8(b) defeat bite, and §2.10(b) loot still describe the pre-reboot carried-
rice / coin-dropping economy that the addendum itself contradicts, and two
judge-cadence parentheticals invert the built season-exit truth. A scatter of
pre-reboot cast names (Smith Gonta, Sukezō, Tokuemon, Onatsu, Obaa Kuni) and
stale ladder numbering (T1 R8→R15, R4 as 'trusted hand & houseman') survive in
the T1/T2 forward prose. No freeze-language found in this section.

- 🔴 **docs/living/prd/02-systems.md:525** · stale-mechanics · fix: **transcribe**
  PRD: “~20% of carried **coin** + ~⅓ of carried **rice + materials**,
  floored”
  Truth: A lost fight bleeds coin + materials ONLY — 'Rice CANNOT bleed'
  because rice is never carried (kura-only, ADR-155/163). The §2.8(b) 'ALL
  THREE carried resources — coin + rice + materials' loss model is pre-reboot;
  the file's own storywave addendum (line 1315) states the built
  coin+materials bleed.
  Source: src/core/defeat.ts:38-49
  Fix: Rewrite the 0-HP loss bullet to the shipped defeat.ts model: coin
  (LOSS_COIN_FRAC) + materials (LOSS_MATERIAL_FRAC), rice untouchable; drop
  the ADR-113 three-resource framing.

- 🔴 **docs/living/prd/02-systems.md:263** · stale-mechanics · fix: **transcribe**
  PRD: “**carried** wealth (coin, rice, materials — at risk”
  Truth: Rice is NEVER carried — it lives only in the kura (`banked.rice`, in
  shō/bales; the HOUSE's economy) per ADR-158/163; labour pays the KIND lane,
  and there is no eat/store/sell-from-pocket carried-rice loop. §2.4's whole
  'Carried vs BANKED' + resource-shape prose (rice as a carried first-class
  resource, deposit/withdraw of pocket rice) describes the pre-storywave
  economy. Also §2.4's 'holding cost … the exact mechanism is a build-time
  call, ADR-118' is decided and shipped: 10%/season spoilage on the banked
  pile at each season exit.
  Source: src/core/state.ts:263 ('Rice is NEVER carried; it lives only in the
  kura'), src/core/step.ts:48-49, src/core/autoplay.ts:326
  Fix: Transcribe §2.4(a)-(c) to the built ADR-158/163 model (kura-only rice
  in shō, KIND vs MON lanes, season-exit spoilage as the resolved ADR-118
  mechanism), mirroring the storywave addendum instead of contradicting it.

- 🟠 **docs/living/prd/02-systems.md:696** · stale-mechanics · fix: **prose-edit**
  PRD: “seeded loot rolls drop materials, coin, occasional **found gear**”
  Truth: Combat drops materials, NEVER coin (the KIND lane, bible-locked): the
  old `coinReward` field is deleted and the fight reducer hard-codes coin: 0
  on kills.
  Source: src/core/content/enemies.ts:10, src/core/fight.ts:108 ('G4: combat
  drops materials, never coin (KIND lane, bible)')
  Fix: Drop 'coin' from the §2.10(b) loot list (materials + occasional found
  gear).

- 🟠 **docs/living/prd/02-systems.md:164** · stale-mechanics · fix: **prose-edit**
  PRD: “BUILT: on the day-interval cadence; forward: at each season exit”
  Truth: Inverted: the seasonal judge fires ONLY from the season-exit pipeline
  (once per manual `advance_season`); the PHASE2_JUDGE_INTERVAL_DAYS day-
  interval cadence is retired — as §2.2(a) itself states three paragraphs
  earlier. §2.2(c)'s 'the judge advances one day per tick' (line 161) is the
  same retired mechanism.
  Source: src/core/step.ts:22-24, 70-72 ('the seasonal judge fires ONLY here')
  Fix: Fix the §2.2(d) parenthetical to 'BUILT: at each season exit' and
  rewrite the §2.2(c) 'advances one day per tick' sentence to the once-per-
  season-exit judge.

- 🟠 **docs/living/prd/02-systems.md:1242** · stale-mechanics · fix: **prose-edit**
  PRD: “the judge folds one day at a time and fires a”
  Truth: The judge does not fold per-day; it fires once per season exit
  (manual `advance_season`), paying the seasonal share only on a new high-
  water mark.
  Source: src/core/step.ts:22-31
  Fix: In §2.16(c) PillarState bullet, replace 'folds one day at a time' with
  'fires once per season exit'.

- 🟠 **docs/living/prd/02-systems.md:719** · stale-fiction · fix: **transcribe**
  PRD: “The **loot + craft loop** (Smith Gonta spearheads via the”
  Truth: The smith is TETSUJI (post-reboot cast), hired at R6 — 'R6's first
  hiring, the choice that lights the cold forge' (forge at the Workshops,
  late-T1); and the built R4 rung is 'The pupil' (弟子), not '(trusted hand &
  houseman)' — 'The trusted hand' (用人) is R6. Same stale name at §2.10(a) line
  688 ('Smith Gonta's forge'). The crafting loop itself IS at R4
  (surfaces.ts:281) — only the smith fiction and rung title are stale.
  Source: docs/story-bible/04-cast.md:296-303;
  src/core/content/ranks.ts:131-181
  Fix: Rename Gonta→Tetsuji at lines 688 and 719, fix the R4 parenthetical to
  'the pupil', and re-hang the forge fiction on the R6 hiring / Workshops per
  the bible.

- 🟠 **docs/living/prd/02-systems.md:1023** · stale-structure · fix: **transcribe**
  PRD: “(T0 R0→R7, T1 R8→R15, T2 V0→V7, T3 enumerated)”
  Truth: The rebooted bible's T1 ladder is a FRESH R0→R7 ladder (t1.md ladder
  table opens '| R0 | The field-hand |'), not a continuing R8→R15; the same
  stale numbering recurs at §2.15(e) line 1095 and the §2.16 T1 table row line
  1207 ('the full estate ladder (R8→R15)').
  Source: docs/story-bible/tiers/t1.md:10-14
  Fix: Replace R8→R15 (all three spots) with the bible's fresh-per-tier R0→R7
  ladders; verify the T2 'V0→V7' label against t2.md's locked ladder while
  there.

- 🟠 **docs/living/prd/02-systems.md:1037** · stale-fiction · fix: **transcribe**
  PRD: “per-shop "patron/regular" standing (smith Gonta, dry-goods/rice
  broker, herbalist **Obaa Kuni**,”
  Truth: The rebooted bible's T2 village cast is Mohei, Sayo, Ekai (temple
  keeper), Kyūbei (miller), Funakichi (ferry keeper), Seiroku + the ordinary
  pool — no Gonta (smith = estate-side Tetsuji), no Obaa Kuni, no brewer
  Tokuemon, no weaver Onatsu, no Innkeeper Sukezō. Same pre-reboot names at
  §2.13(a) line 902 (Sukezō), §2.14(a) line 961 (Brewer Tokuemon's festival
  hub), §2.11(b) line 787 (Weaver Onatsu). Mohei is correct.
  Source: docs/story-bible/04-cast.md:304-356 (T2 section)
  Fix: Re-cast the village-web / inn / festival / silk-lead names to the bible
  T2 roster (or de-name to roles until docket #9's build lands), sweeping
  lines 787, 902, 961, 1037-1040.

- 🟡 **docs/living/prd/02-systems.md:169** · stale-mechanics · fix: **prose-edit**
  PRD: “under docket #2 the”
  Truth: §2.2(e) contrasts 'in the BUILT game' against 'under docket #2' as if
  docket #2 (day-of-week display, seasons unlocking at T0-R2) were still
  forward spec — but docket #2/ADR-153 shipped in v0.4.0, as §2.2(a)'s own
  shipped-note says; the pre-R2 season engine-law is in the built reducer.
  Source: src/core/intents.ts:1112 (advance_season refused pre-R2, engine
  law); docs/living/prd/02-systems.md:120-128 (the section's own shipped note)
  Fix: Rewrite §2.2(e) to state the docket-#2 reveal schedule as the built
  behaviour, deleting the built-vs-docket contrast.

## 03-unlock-ladder.md — 9 findings (4 high)

The section's spine has been largely reconciled to storywave canon — the §3.2
rung table, §3.2.1 earned-transition spine, and the T1/T2/T3 tier tables match
ranks.ts and the bible tier sheets, and the gen-regions are current. But four
pre-reboot islands survive: the §3.1 cold-open script is wholesale pre-
storywave fiction, §3.0/§3.0.1 still teach the ADR-137-deleted rung-
meter/storyGate AND-gate as the live law (which §3.2.1 in the same file says
is deleted), §3.5's nav-reveal table is pre-ADR-119, and §3.3's room table
describes the retired pre-G4 map. Plus dead §5 T0.x pointers, old pillar
names, and one freeze-language remnant in a gen-region preamble.

- 🔴 **docs/living/prd/03-unlock-ladder.md:57** · stale-mechanics · fix: **transcribe**
  PRD: “the rung's **per-rung-reset rung-meter** — **Estate Service** (labour)
  or **Combat Rank** (martial) — crossing its threshold (back-solved from the
  **≥30-min-per-rung floor** …) **AND** the rung's **story milestones** (an
  **AND-gate**”
  Truth: ADR-137 (FB-121, 2026-07-05) deleted the points meter and
  RankDef.storyGate entirely: each rung promotes when its authored hidden
  requirement list is 100% done; the player sees a rounded % bar. ranks.ts
  header: 'the old meter/threshold/storyGate AND-gate is deleted'; state.ts:
  'SCHEMA_VERSION 8 (replaces rungMeter)'. §3.2.1 in this same file already
  states the deletion, but §3.0's RANK row, the whole §3.0.1(2) 'rung-meter
  accrual law' block (lines 143–149), §3.0.1(1), and §3.2's promotion prose
  (lines 268–271) still teach the meter law as live.
  Source: src/core/content/ranks.ts:1-6 + src/core/state.ts:185 +
  docs/living/decisions.md:1921 (ADR-137)
  Fix: Rewrite the §3.0 RANK row and §3.0.1(1)/(2) to the ADR-137 requirements
  model (hidden requirement lists, % bar, 100% opens the beat); delete the
  meter-accrual law and the Estate-Service/Combat-Rank meter framing

- 🔴 **docs/living/prd/03-unlock-ladder.md:236** · stale-fiction · fix: **strike-and-point**
  PRD: “"You are in a storehouse — a *kura*. Your head is bound. A pallet, a
  rake, rice spilled across a cracked floor." … Sōan, the physician: 'Head's
  been knocked, lad. You near drowned. Rest, and work when you can.'”
  Truth: The shipped cold open (storywave G4.1) is entirely different: the
  weir prose ('The river gives you up at the weir…'), the wake ('Straw. A low
  roof… three days in a room you have never seen'), the day-book entry ('One
  man, name unknown. Taken at the weir'), then the Sōan examination VN scene —
  the You:→Nameless: speaker flip, three Asks, and the R0 keep-choice
  (knot/work/days). None of §3.1's four authored log lines, the 'Open your
  eyes' verb, or the 'Head's been knocked, lad' Sōan line exist; the coin-row-
  at-cold-open claim is also wrong (coin first arrives via haul at R1, the
  wage at R5 — wage.ts WAGE_START_RUNG=R5).
  Source: docs/content/t0-story.md 'The cold open' + 'Intro 1 · Sōan'
  (generated from src/core/content/narrative/cold-open.md, intro.md)
  Fix: Void the §3.1 table's authored lines/verbs and point to the generated
  script docs/content/t0-story.md (the cold open + intro scenes); keep only
  the mechanical claims that survive (one verb + log, rake credits rice)

- 🔴 **docs/living/prd/03-unlock-ladder.md:567** · stale-structure · fix: **transcribe**
  PRD: “The **first navigation appears** — the screen splits into *Work* +
  *Skills*.”
  Truth: The §3.5 nav table is pre-ADR-119: the build's cadence (stated
  correctly at §3.0 rule 2 of this same file) is Work R0 · Map+Estate R1 ·
  Character R2 · Combat+Inventory R3 · Quests R5 — the nav bar first appears
  at R1 when Map joins, 'Skills' is a Character-tab section not the first tab;
  the 'Map screen at RANK R6' row is wrong (Map tab at R1); the '"House" /
  Influence screen at RANK R7' row is wrong twice (ADR-119(3): House Influence
  stays on the Estate tab, no dedicated House screen; the panel reveals at R3,
  not R7).
  Source: src/ui/render.ts:1258-1323 (TAB_ORDER + tabHasContent + 'appears at
  R1 when Map joins') + decisions.md:1344 (ADR-119)
  Fix: Rewrite the §3.5 T0 rows to the shipped seven-tab cadence (Map+Estate
  R1, Character R2, Combat+Inventory R3, Quests R5, House-Influence on
  Estate); the Inventory/Quests/Crafting rows are already correct

- 🔴 **docs/living/prd/03-unlock-ladder.md:430** · stale-structure · fix: **gen-region**
  PRD: “| **The Stables & Woodlot Edge** | E1 | `RANK` R2 *(revealed
  SEPARATELY)* | … | **The Deeper Woods (奥山)** … | **The Drill Yard** | E1 |
  `STORY` R3”
  Truth: The §3.3 room table describes the pre-G4 map. The shipped 16-node
  zone spine (map.ts) has no stables node and no deeper-woods node — ranks.ts
  R2: 'The retired near/deep wilderness nodes fold into the woodlot'; the
  drill-yard NODE opens at R4, not R3 (ranks.ts R3: 'room-drill-yard waits for
  R4' — matching this file's own §3.2/§3.2.1, where the drill yard opens at
  R4); the kura map node reveals at R3 (the grain-watch's post), and shipped
  nodes the table omits include weir, sickroom, kitchen, field-margins, weir-
  reeds, shrine (R5), orchard (R5), grove (R7).
  Source: src/core/content/map.ts:53-236 (node roster) +
  src/core/content/ranks.ts (per-rung room-* unlocks)
  Fix: The room→trigger table is fully derivable from map.ts revealFlags +
  ranks.ts unlock lists — generate it as a gen-prd-region like the rung-titles
  table

- 🟠 **docs/living/prd/03-unlock-ladder.md:272** · stale-mechanics · fix: **transcribe**
  PRD: “The **House Influence panel reveals at R7** (its single **Estate** bar
  — T0 reveals one pillar; the other three stay **locked silhouettes**) — and
  that reveal is **ENTRY TO PHASE 2**”
  Truth: The build reveals 'panel-house-influence' at R3 (in the R3
  rewardOnReach unlock list, as the macro teaser), living on the Estate tab
  ('House-Influence (joins at R3)' — render.ts). Phase 2 still opens at R7 via
  the t0-capstone flag, but the panel reveal and the Phase-2 entry are no
  longer the same beat.
  Source: src/core/content/ranks.ts (R3 unlock: 'panel-house-influence') +
  src/ui/render.ts:1305 + src/core/content/surfaces.ts:376
  Fix: Reword: the Influence panel teases at R3 on the Estate tab; R7
  (t0-capstone) is what opens Phase 2 / starts deed accrual

- 🟠 **docs/living/prd/03-unlock-ladder.md:278** · stale-fiction · fix: **transcribe**
  PRD: “the E1 "Stabilising" BUILD COMPLETES as a Phase-2 beat (the staged
  U1–U4 build, each stage gated on banked Estate standing + coin — ADR-145”
  Truth: The shipped U-ladder's own stage narrations use the stage names
  inside T0: U1 '(U1 · Stabilising)', U2 '(U2 · Recovering)', U3 '(U3 ·
  Prosperous)', U4 the reclamation capstone — contradicting the PRD's tier-
  span claims that 'Stabilising' completes at U4, Recovering belongs to T1
  (§3.3.5) and Prosperous to T3 (§3.6).
  Source: src/core/content/estate.ts:26-60 (ESTATE_STAGES narrations, 'G4 re-
  fiction of the old U1–U4 kura-works coin ladder')
  Fix: Reconcile the E-stage span language with the shipped U-stage names
  (either re-fiction the U narrations' parentheticals or restate the per-tier
  E spans to match the build)
  Verifier note: Quote matches lines 278-279. estate.ts ESTATE_STAGES
  narrations end '(U1 · Stabilising)', '(U2 · Recovering)', '(U3 ·
  Prosperous)', '(U4 · Risen)' — all inside T0 — contradicting the PRD's spans
  (T0 = E0→E1 Stabilising only, line 277; Recovering = T1's E2, §3.3.5 line
  461; Prosperous = T3's E3, §3.6 line 643). Minor correction: U4's
  parenthetical is 'Risen', though it is the reclamation capstone as the
  finding says. Confirmed.

- 🟠 **docs/living/prd/03-unlock-ladder.md:243** · dead-pointer · fix: **prose-edit**
  PRD: “matches the **cold-open spec** (§5 T0.2 beat 1) — *kura*, one verb,
  persistent log”
  Truth: PRD §5 was demoted (2026-07-07) to a pointer-and-summary of the story
  bible; it has no T0.2/T0.3/T0.4 anchors (grep finds none). The five §3
  references to '§5 T0.2 beat 1', '§5 T0.3' (line 393) and '§5 T0.4' (lines
  277, 423) point at the archived old §5 structure; the cold-open spec now
  lives in the bible/narrative sources.
  Source: docs/living/prd/05-narrative.md:1-10 (pointer-and-summary header; no
  T0.x sections)
  Fix: Repoint the §5 T0.x references to docs/story-bible/tiers/t0.md (and
  t0-story.md for the shipped script)

- 🟡 **docs/living/prd/03-unlock-ladder.md:20** · stale-fiction · fix: **prose-edit**
  PRD: “the four-pillar House Influence (Arms / Estate & Wealth [trade ≤⅓] /
  Standing & Office / Name & Honour)”
  Truth: ADR-159 (2026-07-07/08) fixed the pillar names as Estate (家産) · Arms
  (武威) · Office (官威 — 'renamed from "Standing & Office"; the umbrella owns
  "standing"') · Name (家格). Lines 20, 58, and §3.8's 'The **Standing &
  Office** pillar's kanji is 官威' (line 791) still carry the old long names,
  while the rest of the section already says 'Office'.
  Source: docs/living/decisions.md:2570-2601 (ADR-159)
  Fix: Rename to Estate / Arms / Office / Name at the three spots (keep the
  trade ≤⅓ clause on Estate)

- 🟡 **docs/living/prd/03-unlock-ladder.md:354** · freeze-language · fix: **gen-region**
  PRD: “the per-source multipliers are §4 tuning (ripple-frozen, ADR-021)”
  Truth: HD-33 (human, 2026-07-10, → ADR-168): 'The freeze doesn't exist — we
  can't freeze it'; the whole PRD is to be fixed to the shipped bible + src.
  This freeze-language lives inside the t0-deed-sources gen-region, so the
  wording comes from the generator, not the file.
  Source: project/human-in-the-loop/archive.md:52 (HD-33 / ADR-168)
  Fix: Drop the '(ripple-frozen, ADR-021)' phrase in gen-prd-regions.ts's
  t0-deed-sources preamble and regenerate

## 04-combat-balance.md — 11 findings (4 high)

The combat core (§4.4–§4.6: attributes, satiety throttle, durability bands,
stances, closed-form-vs-sampled(n=400) win-rate, weapon roster carrying-
pole/axe/yari) matches the build closely and is healthy. The staleness
concentrates in everything T0-shaped: the section still describes a pre-reboot
T0 — a 4-season derived calendar, a 2-pillar Arms+Estate hybrid gate with an
ip-denominated deed inventory, the winnable R3 wolf, and the Day-
labourer→Bailiff rung fiction — where the shipped game has a six-season manual
wheel, a single koku-denominated Estate pillar gated at EXCELLENT 480, a
scripted survive-only night-round wolf (the 20–35% band foe is the monkey),
and the reboot rung names. §4.8.1 remains a hand-maintained twin of the
generated t0-pacing.md, and the ADR-117 ripple-frozen header contradicts
ADR-168's freeze-lift.

- 🟠 **docs/living/prd/04-combat-balance.md:3** · freeze-language · fix: **prose-edit**
  PRD: “**ADR-117 (2026-07-03) — ripple-frozen: no per-change hand-updates.**
  ... This section's numbers refresh at the **T0 compression sweep**”
  Truth: The human ruled 2026-07-10 that the PRD freeze doesn't exist — the
  whole PRD is to be fixed to the shipped story-bible + src now, generation
  preferred, not deferred to a compression sweep.
  Source: docs/living/decisions.md:2849 (ADR-168) + project/human-in-the-
  loop/archive.md:52 (HD-33)
  Fix: Rewrite the header note per ADR-168: the section tracks the shipped
  game; derivable numbers become gen-regions, no sweep-gating.

- 🔴 **docs/living/prd/04-combat-balance.md:59** · stale-mechanics · fix: **transcribe**
  PRD: “**1 season = 28 days ≈ 5,600 ticks**; **1 year = 4 seasons = 112
  days**”
  Truth: Shipped calendar is the SIX-season MANUAL wheel (winter, new-year,
  spring, summer, bon, autumn); season is stored state turned by the
  `advance_season` intent — the fixed per-season day-count is gone
  (ADR-150/ADR-153). The §4.2.2 worked tables' 'Seasons read Sp→Su→Au→Wi ×2'
  (line 561) and the SEASON_WALLCLOCK_MIN 34-min/season binding (lines 62–69)
  hang off the same dead 4-season derived clock.
  Source: src/core/constants.ts:63-70 (SEASONS = six-wheel, manual container)
  Fix: Rewrite the time-units paragraph to the six-season manual wheel (season
  = player-paced container, ADR-153); strike the 28-day/5,600-tick/4-season
  math and the per-season wall-clock binding.

- 🔴 **docs/living/prd/04-combat-balance.md:263** · stale-mechanics · fix: **transcribe**
  PRD: “**T0** is the **2-pillar special case**: only Arms + Estate are
  revealed, so the gate is **good in both + excellent in exactly one**”
  Truth: The shipped T0 lights ONE pillar only — Estate (家産); Arms is T1-gated
  (the 'watch' deed source note says 'Arms stays T1-gated'). The T0 ascension
  gate is Estate ≥ EXCELLENT (480 koku) on the six-step FAIL→EXCELLENT ladder
  (ADR-159), not a 2-pillar hybrid profile. The §4.1 T0→T1 band row (line
  213-214, Arms 0.5K/0.72K/0.95K) describes a gate that doesn't exist.
  Source: src/core/pillars.ts:1-6 ('One pillar per tier; T0 lights the Estate
  pillar... T0 = Estate ≥ EXCELLENT') + src/core/content/balance.ts:79-80
  (ESTATE_BANDS, excellent: 480)
  Fix: Rewrite the T0 row + 'special case' prose: T0 = single Estate pillar,
  six-step grade ladder, gate = EXCELLENT; keep the hybrid multi-pillar
  profile as explicit T1+ frontier spec.

- 🟠 **docs/living/prd/04-combat-balance.md:427** · stale-mechanics · fix: **transcribe**
  PRD: “**Arms (350 ip, 30 deeds):** 20 minor clears (20×8 = 160) + 5 road-
  clears (5×18 = 90) + 5 defends (5×20 = 100) = **160 + 90 + 100 = 350** ✔”
  Truth: T0 has NO Arms deed inventory — Arms is T1-gated. The shipped T0
  Phase-2 economy is the ADR-145 multi-source Estate model: each labour act
  banks ESTATE_DEED_PER_ACT (0.05, sub-koku fractions) × a source multiplier
  (fields/stores/workshop/watch/treasury), not a recognised-deed-class table.
  Same defect in the §4.8.1b T0 row '30 Arms (350 ip) + 26 Estate (560 ip)'
  (line 1538).
  Source: src/core/content/balance.ts:82-110 (ESTATE_DEED_PER_ACT +
  ESTATE_DEED_SOURCE_MULT; 'Arms stays T1-gated')
  Fix: Replace the T0 itemization with the shipped multi-source per-act
  banking model (per-deed cap survives: PER_DEED_CAP_NUM=4 ≈ 0.04·GOOD); keep
  the T1/T2 inventories as frontier spec.

- 🟠 **docs/living/prd/04-combat-balance.md:495** · stale-mechanics · fix: **transcribe**
  PRD: “f_pillar  = sqrt( fracBasis ) ... JUDGE_K[pillar][tier]  =
  SEASONAL_SHARE · goodBand[pillar][tier]”
  Truth: The shipped seasonal judge is a different mechanism: on a NEW high-
  water it pays (3/7) of the season's deed GROWTH (SEASONAL_OVER_DEEDS 3:7 =
  the 70/30 share) with a ±10% swing, never net-negative — there is no
  basis/sqrt/TIER_REF/JUDGE_K appraisal. The 70/30 split and high-water rule
  survive; the formula block, the JUDGE_K table (543-548) and the worked
  8-season tie-outs (556-599) describe unbuilt machinery.
  Source: src/core/pillars.ts:92-112 (seasonalJudge) +
  src/core/content/balance.ts:118-123 (SEASONAL_OVER_DEEDS_NUM/DEN,
  SEASONAL_SWING)
  Fix: State the shipped judge (3/7 of new deed-growth high-water, ±10% swing,
  banked-not-re-judged) as T0 truth; demote the basis/JUDGE_K scheme to
  explicit T1+ frontier or strike it.

- 🟠 **docs/living/prd/04-combat-balance.md:322** · stale-fiction · fix: **strike-and-point**
  PRD: “| **R5 Gate-guard** | Combat Rank | stand a watch · pest-control /
  hunt / clear sweeps | ~0.55 | **~17** |”
  Truth: The shipped T0 ladder (post story-reboot) is R0 The man from the weir
  (無名) · R1 The day-hand (日雇) · R2 The yard-hand (庭男, silent) · R3 The grain-
  watch (蔵番) · R4 The pupil (弟子) · R5 The accused (咎人) · R6 The trusted hand
  (用人) · R7 The named hand (名代). The table's names/fictions (Day-labourer,
  Bonded hand, Gate-guard, Foreman, Bailiff) are all pre-reboot. The block is
  already banner'd SUPERSEDED (ADR-137) for the meter model, but the fiction
  inside it is stale too.
  Source: src/core/content/ranks.ts:32-195 (titles/kanji) + docs/story-
  bible/03-tiers.md:96-100
  Fix: Strike the 'historical/frontier illustration' table's T0 names or re-
  key its illustration to the current ladder; point to ranks.ts / story-bible
  03-tiers for the canon rungs.

- 🔴 **docs/living/prd/04-combat-balance.md:980** · stale-fiction · fix: **transcribe**
  PRD: “**Defaults are set so the R3 first wolf (`MobDef.level ≈ 2`, the R3
  dangerRing's expected character-level; wolf `baseSpeed 1.3`) lands the
  LOCKED 20–35 % first-fight win-rate**”
  Truth: The wolf is level 3, night-round-only, and SCRIPTED 'survive' —
  guaranteed survival, NEVER a win ('survived-not-won', replacing the old
  grain-store-wolf semantics). The foe tuned to the signed 20–35% humbling
  band is the MONKEY @ L1. §4.6.6's 'humbling first fight (a wolf...) tuned so
  a fresh MC wins only ~20–35%' (line 1105) and the §4.6.7 R3 anchor carry the
  same stale attribution.
  Source: src/core/content/nightRounds.ts:1-45 (scripted 'survive' wolf) +
  src/core/content/balance.ts:145-146 ('first-fight (monkey @L1...) lands in
  the signed 20–35% band') + src/core/content/enemies.ts:168-171 (wolf level
  3)
  Fix: Split the two beats: the R3 night-round wolf = scripted survived-not-
  won story beat; the 20–35% LOCKED band is measured on the grindable first
  foe (monkey @L1). Fix §4.6.1d worked check, §4.6.6, §4.6.7.

- 🟠 **docs/living/prd/04-combat-balance.md:84** · stale-mechanics · fix: **strike-and-point**
  PRD: “**The T0 rice band (yields are already NET).** The T0 lifetime-
  produced band reads **~21K rice**”
  Truth: The shipped rice economy is kura-measured shō-units with per-(site,
  season) depleting yield pools that refill on the manual season turn, a
  steady household shō/day eat, ~10%/season spoilage on ALL held rice, and
  Autumn's nengu drawing the koku demand from the kura — the 'yields already
  NET / lifetime-produced ~21K vs held 18–19K' model is dead (the sim's
  ascended runs end with rice 0). The §4.7.1 throughput bridge (25→150
  rice/min, lines 1335-1343) hangs off the same dead model.
  Source: src/core/content/balance.ts:382-452 (kura/shō/spoilage/site pools) +
  src/core/nengu.ts + docs/content/t0-pacing.md (end rice 0, estate ~487)
  Fix: Strike the produced/held-NET band model and throughput bridge; point to
  the generated t0-pacing.md + balance.ts kura-economy constants for T0 rice
  truth.

- 🟠 **docs/living/prd/04-combat-balance.md:56** · stale-mechanics · fix: **transcribe**
  PRD: “**House Influence** in abstract **Influence points (ip)** per pillar,
  displayed with **K/M/B** abbreviation”
  Truth: The shipped pillar standing is denominated directly in KOKU, not
  abstract ip: deeds bank sub-koku fractions into whole koku
  (influence.estate.value), the ascension gate is 480 koku, and the standing
  panel shows the 10,000-koku daimyō horizon from T0. Koku is not a separate
  seasonal re-expression of ip; §4.0b's 'koku unrevealed until the first
  seasonal appraisal' framing doesn't match the build.
  Source: src/core/content/balance.ts:82-128 (sub-koku deed fractions,
  480-koku gate, DAIMYO_KOKU horizon)
  Fix: Restate the unit: T0 pillar standing is koku-denominated (ADR-133);
  keep ip/K/M/B as explicit T1+ frontier display spec if still intended.

- 🔴 **docs/living/prd/04-combat-balance.md:1505** · stale-structure · fix: **strike-and-point**
  PRD: “| **R1 Day-labourer** — paddies, basic labour loop, world-clock |
  **Estate Service ≥ ~18** (rake/recover rice · clear forecourt · first paddy
  turns) + Genemon assigns real work”
  Truth: The whole §4.8.1 table is a hand-maintained pre-reboot twin of the
  generated pacing report: rung names are pre-reboot (Day-labourer…Bailiff vs
  day-hand…named hand), the Estate-Service/Combat-Rank meter thresholds it
  cites were deleted (ADR-137 hidden requirement lists), and the real per-rung
  wall-times are sim-owned (T0 climb band [3,22] wall-min, generated per-
  seed). Known pre-reboot wholesale; logged here for completeness as the hand-
  twin of a generated table.
  Source: docs/content/t0-pacing.md (GENERATED, 'Do not edit by hand') +
  src/core/content/ranks.ts:1-6 ('the old meter/threshold/storyGate AND-gate
  is deleted')
  Fix: Replace the table body with a pointer/gen-region to
  docs/content/t0-pacing.md + the requirement lists; keep only the locked
  FLOOR intent prose.

- 🟡 **docs/living/prd/04-combat-balance.md:1158** · stale-mechanics · fix: **prose-edit**
  PRD: “stored RICE now carries a cost (spoilage / cap / holding fee —
  mechanism TBD, **ADR-118**)”
  Truth: The mechanism is decided and shipped: per-season-turn spoilage of
  ≈10% (floor(held·1/10)) on ALL held rice, carried + banked — not TBD, and it
  hits carried rice too, not only the banked hoard. Same 'mechanism TBD'
  phrase repeats at §4.7.2 (line 1370).
  Source: src/core/content/balance.ts:414-424 (RICE_SPOILAGE_NUM/DEN, 'a per-
  season decay on ALL rice (carried + banked)')
  Fix: Replace 'mechanism TBD' (both spots) with the shipped per-season
  spoilage on all held rice.
  Verifier note: Quote at line 1158, repeated at 1370. balance.ts:~419-430:
  RICE_SPOILAGE_NUM/DEN = 1/10 (≈10%/season), 'a per-season decay on ALL rice,
  CARRIED and BANKED' — shipped, not TBD. One correction to the fixNote: the
  kura capacity CAP also shipped (KURA_RICE_CAP_BASE 120 + 80/stage), so the
  replacement text should name spoilage AND cap, not spoilage alone.

## 05-narrative.md — 1 findings (0 high)

Healthy. This section was rewritten post-reboot (2026-07-07, ADR-150 pointer-
and-summary style) and every spot-checked concrete claim — premise names
(Tahei, Tama/Otsuru, Gonbei day-book beat), the seven-tier ladder incl. H0→H7
and the dropped hard-lock, the ink thread, the T4/T5 beats, the v0.4.0 rename-
ledger claim, and all bible file pointers — matches the story bible and the
shipped build. No freeze-language and no pre-reboot fiction; the only
staleness is one present-tense phrasing of a now-spent exception.

- 🟡 **docs/living/prd/05-narrative.md:106** · stale-mechanics · fix: **prose-edit**
  PRD: “(One recorded exception: the T0 prose wave ships the judge's single
  pick per unit — ADR-162; the standing law resumes after it.)”
  Truth: The T0 prose wave shipped in v0.4.0 (2026-07-09); a later ADR records
  "the ADR-162 one-version exception was wave-scoped and is spent", so the
  exception is historical, not in effect.
  Source: docs/living/decisions.md:2839 (and CHANGELOG.md ## [0.4.0] —
  2026-07-09)
  Fix: Rephrase to past tense: the ADR-162 one-version exception was wave-
  scoped and is spent; the ADR-139 three-take law is back in force.

## 06-tech-architecture.md — 13 findings (5 high)

The section's core mechanisms survive contact with the build remarkably well —
pure-core boundary, splitmix64 per-stream cursors, the save envelope/multi-
backend/newest-wins selector, the crash ring, the renderer contract, and the
seven-tab IA all match src/. What has rotted is every hand-enumerated
inventory: the verify roster (6 gates listed vs 17 real, with the gen-
narrative/fixtures/prd-regions pipelines entirely undescribed), the content-
registry table, the GameState stored shape, the Intent union, the §6.6.1
verifier-invariant roster (mostly never-built checks), and the pre-reboot cast
names. These lists should be gen-regioned or transcribed from their single
sources (gates.ts, state.ts, intents.ts, the content dir) rather than hand-
maintained.

- 🔴 **docs/living/prd/06-tech-architecture.md:60** · stale-structure · fix: **gen-region**
  PRD: “pnpm run verify  =  tsgo --noEmit                && oxlint
  && oxfmt --check                && vitest run                && node
  src/scripts/verify-content.ts”
  Truth: The roster is 17 gates in gates.ts: tsgo, oxlint, oxfmt, vitest,
  verify-content, verify-prd, gen-docs, fixtures, gen-narrative, gen-prd-
  regions, pacing, playcheck, md-links, milestone-integrity, verify-changelog,
  doc-budgets, checkpoint (run via tsx, not node). The §6.1 Scripts list is
  equally stale (missing gen:narrative, fixtures:*, balance:*, pacing,
  prd:drift, checkpoint, verify:balance, gh-pages...).
  Source: src/scripts/gates.ts:23-41; package.json scripts
  Fix: The gate roster is already single-sourced from gates.ts (checkpoint.ts
  regenerates doc regions) — replace the hand-typed block with a gen-region or
  a pointer to gates.ts.

- 🔴 **docs/living/prd/06-tech-architecture.md:384** · stale-structure · fix: **transcribe**
  PRD: “All content is authored as plain, typed TypeScript data in
  `core/content`, one module per type”
  Truth: FB-5: T0 narrative content (rung beats, intro, dialogue, cold open,
  flavor, scenes) is authored as prose-first MARKDOWN in
  src/core/content/narrative/ and compiled by gen-narrative into *.gen.ts
  registries (coldOpen.gen.ts, dialogue.gen.ts, flavor.gen.ts, intro.gen.ts,
  rungBeats.gen.ts, scenes.gen.ts, requirements.gen.ts). §6 never mentions
  this pipeline anywhere. The registry table also lists never-built modules
  (resources.ts, producers.ts, items.ts, recipes.ts, world.ts,
  beliefBeasts.ts, scrolls.ts, effects.ts, influence.ts) and omits the shipped
  ones (weapons.ts, market.ts, crafting.ts, people.ts, names.ts,
  nightRounds.ts, discoveries.ts, estate.ts, home.ts, map.ts, voices.ts,
  timing.ts, wage.ts, requirements.ts + the gen'd narrative registries).
  Source: ls src/core/content/ (no resources/producers/items/recipes/world/bel
  iefBeasts/scrolls/effects/influence.ts); src/scripts/gates.ts:32 (gen-
  narrative); AGENTS.md FB-5 bullet
  Fix: Rewrite §6.5's opening to name the two authoring lanes (TS registries +
  the FB-5 markdown→gen pipeline) and regenerate/redo the registry table from
  the actual src/core/content roster; keep genuinely-forward modules
  explicitly tagged forward-tier.

- 🔴 **docs/living/prd/06-tech-architecture.md:262** · stale-mechanics · fix: **transcribe**
  PRD: “interface GameState {”
  Truth: The §6.4 stored-surface listing materially diverges from the shipped
  GameState: it lists never-built fields (producers, market.saturation, koku,
  reputation, allegiance, counts, effects[], settings, inventory, per-slot
  equipment, ranks[tier].{estateService,combatRank}) and omits ~15 shipped
  fields — season + seasonsPassed (ADR-153), sitePools,
  wageDaysAccrued/lastWageDay (ADR-163 MON lane), npcMemory, introBeat,
  rungBeat, askedTopics, belongings (ADR-111), discovered/discoveryProgress
  (ADR-146), sceneQueue/activeScene/scenesPlayed, roundState (night rounds),
  soanLedger, top-level rung + rungReqs. flags is a Record not a Set; skills
  is skillXp.
  Source: src/core/state.ts:106-231 (interface GameState)
  Fix: Hand-rewrite the stored-shape block from src/core/state.ts (or gen-
  region it from the type), clearly separating shipped fields from forward-
  tier spec fields.

- 🔴 **docs/living/prd/06-tech-architecture.md:503** · stale-fiction · fix: **transcribe**
  PRD: “the shipped names are **Heita** / **Mosuke** / **Obaa Kuni** (field-
  lad **Heita** ≠ antagonist **Magobei**; clerk **Mosuke** ≠ heir **Naoyuki**;
  herbalist **Obaa Kuni** ≠ **Sayo**)”
  Truth: Post-reboot cast: Heita, Mosuke, Obaa Kuni, Magobei appear nowhere in
  names.ts or the story bible. The shipped one-source-of-truth cast is Genemon
  (steward/elder), Kihei (drillmaster), Chiyo, Sōan, O-Hisa, Shinnosuke, Toku,
  Yohei, etc. (04-cast, 2026-07-07 sweep). Likewise §6.6's macron examples
  'Tōkichi, Yagōemon, Kyūsuke' (line 447) are pre-reboot names absent from the
  bible and the build.
  Source: src/core/content/names.ts:8-46 + RETIRED_NAMES; grep of docs/story-
  bible/ (zero hits for Heita/Mosuke/Obaa/Kyūsuke/Tōkichi/Yagōemon)
  Fix: Replace the name examples with the 04-cast canon names (or point to
  names.ts/04-cast.md instead of enumerating).

- 🔴 **docs/living/prd/06-tech-architecture.md:160** · stale-mechanics · fix: **transcribe**
  PRD: “type Intent =   | { type: 'rake_rice' }   | { type: 'do_activity';
  activityId: ActivityId }”
  Truth: The shipped Intent union has none of: buy_producer, use_item,
  combat_action, advance_dialogue, advance_quest, read_scroll, set_allegiance.
  And it omits the shipped verbs that ARE the current game:
  open_eyes/advance_intro/ask_topic/choose_intro (VN intro),
  begin/advance/ask/choose_rung_beat,
  begin_scene/advance_scene_beat/choose_scene_option, begin_night_round,
  talk_to, rest, fight, repair_weapon, equip_weapon, cook_meal, eat_rice,
  sell_rice (ADR-163), collect_wage, advance_season (ADR-153), improve_estate,
  spend_attribute, craft_weapon, buy_belonging, ascend.
  Source: src/core/intents.ts:118-155
  Fix: Regenerate the illustrative union from src/core/intents.ts (or gen-
  region it), keeping forward-tier verbs (combat_action) explicitly tagged as
  unbuilt.

- 🟠 **docs/living/prd/06-tech-architecture.md:454** · dead-pointer · fix: **prose-edit**
  PRD: “aligned to **`docs/balance/`** (e.g. `docs/balance/curves.md`,
  `docs/balance/gates.md`) and **`docs/content/`** (e.g.
  `docs/content/bestiary.md`, `docs/content/areas.md`”
  Truth: docs/balance/ does not exist; none of curves.md, gates.md,
  bestiary.md, areas.md, ranks.md, influence.md exist. gen-docs actually
  writes docs/content/t0-content.md, t1-content.md, t2-content.md, ui-
  tokens.md (t0-pacing.md and t0-story.md come from the pacing and gen-
  narrative gates). §6.12 line 904 repeats the docs/balance/ pointer.
  Source: ls docs/content/ (t0-content, t0-pacing, t0-story, t1-content,
  t2-content, ui-tokens); `ls docs/balance` → No such file or directory
  Fix: Point at the real generated set (docs/content/t0-content.md etc.) and
  drop the docs/balance/ layout in §6.6 and §6.12.

- 🟠 **docs/living/prd/06-tech-architecture.md:464** · stale-mechanics · fix: **transcribe**
  PRD: “A cluster of machine checks (collected here; run inside `verify-
  content.ts` alongside the §6.6 canon invariants) so the load-bearing
  properties **cannot silently regress**”
  Truth: verify-content.ts is 138 lines and checks: surface/mob/weapon id
  mirroring, activity refs, rank eligibility, no belief-creature in spawn
  tables, no human foe below T2, estate-stage sanity, and the real-name
  denylist. It has NO macron/romaji lint, NO per-skill-perk magnitude check
  (no perks/skillCombatBonus track exists anywhere in content), NO gatesSpine
  flag (zero src hits — the flag itself was never built), NO trade-≤⅓-post-
  combo proof, NO accrual tie-out, NO save-envelope-size budget. Most of
  §6.6.1 describes enforcement that does not exist.
  Source: src/scripts/verify-content.ts (138 lines, numbered checks 1-5); grep
  gatesSpine/skillCombatBonus/macron across src (no hits)
  Fix: Split §6.6/§6.6.1 into 'enforced today' (transcribed from verify-
  content.ts + the vitest invariants suite) vs 'spec — not yet wired', so the
  doc stops claiming protections that aren't there.

- 🟠 **docs/living/prd/06-tech-architecture.md:266** · stale-mechanics · fix: **prose-edit**
  PRD: “cursors: { combat: number; loot: number; seasonal: number; worldgen:
  number } };  // per-named-stream MONOTONIC cursors”
  Truth: The shipped RNG has FIVE streams: combat, loot, seasonal, worldgen,
  plus 'discovery' (the ADR-146 discovery pity-roll stream). The four-stream
  set is repeated in §6.7 (line 531), §6.8 (line 614) and §6.12 (line 903).
  Also the 'seasonal and worldgen have no v1 consumer' claim (line 536) should
  be rechecked now that seasons/night-rounds shipped.
  Source: src/core/rng.ts:14 (export type RngStream = 'combat' | 'loot' |
  'seasonal' | 'worldgen' | 'discovery') + STREAM_SALT
  Fix: Add the discovery stream at every four-stream mention (§6.4, §6.7,
  §6.8, §6.12).

- 🟠 **docs/living/prd/06-tech-architecture.md:581** · stale-mechanics · fix: **prose-edit**
  PRD: “season and year are not stored at all   (in the BUILT engine; the
  storywave forward spec — §6.4 banner, ADR-153 — turns `season` into a stored
  container”
  Truth: ADR-153 is shipped, not a forward spec: GameState stores `season:
  Season` + `seasonsPassed`, advanced only by the manual advance_season intent
  — §6.3 of this same file already says '(ADR-153, shipped)' and the §6.8
  save-model bullet (line 614: 'season/year/lunar are DERIVED, not stored')
  contradicts it too.
  Source: src/core/state.ts:110-115 (season, seasonsPassed);
  src/core/intents.ts:145 (advance_season); prd/06 line 267 vs 614
  Fix: Update §6.7.1 and the §6.8 clock bullet: season is STORED manual state
  (ADR-153, shipped); year derives from seasonsPassed; weather/lunar stay
  derived.

- 🟠 **docs/living/prd/06-tech-architecture.md:839** · stale-structure · fix: **transcribe**
  PRD: “advanceSeason(): void, toRung(id: RankId): void, toTier(n: TierId):
  void,  // time-compression helpers”
  Truth: The real __qa surface has no advanceSeason() helper (advance_season
  is a plain intent) but DOES have major shipped members §6 never describes:
  loadFixture/fixtures (the FB-6 scenario library + Scenarios tab), telemetry
  (FB-8 attended-time), backupSave/hasBackup/restoreBackup (FB-96), speed, and
  the balance-cockpit handle (FB-7/ADR-134, ?bal. URL overrides). The whole
  in-UI DEV panel (mountDevPanel: __qa buttons, the ADR-075 live variant
  toggle, the ADR-139 Story switcher, cheatlist, cockpit) and the FB-3
  backtick capture inbox are built-but-undescribed in §6.10.
  Source: src/app/main.ts:560-690 (the qa object, loadFixture, fixtures,
  telemetry, backup*, cockpit.hydrate, mountDevPanel); src/ui/dev.ts, dev-
  cockpit.ts, dev-cheatlist.ts; AGENTS.md FB-3/FB-6/FB-8/ADR-134
  Fix: Refresh the §6.10 __qa listing from main.ts and add a short subsection
  naming the DEV panel systems (variants toggle, Scenarios, Balance cockpit,
  Story switcher, capture inbox) with pointers to their owning docs.
  Verifier note: Confirmed with a line correction: the quoted
  advanceSeason()/toRung()/toTier() line is at line 852, not 839. main.ts has
  no __qa.advanceSeason; it does ship loadFixture (line 630), fixtures (639),
  telemetry (662), backupSave/hasBackup/restoreBackup (594-597), speed (~527),
  and the balance cockpit handle (471) — none described in §6.10.

- 🟠 **docs/living/prd/06-tech-architecture.md:363** · stale-mechanics · fix: **prose-edit**
  PRD: “| 3 | **The Combat Rank rung-meter** | `ranks[tier].combatRank` (per-
  rung-RESET) | **nothing** — the meter is fed **only by per-rung CURATED
  activities**”
  Truth: T0's shipped rung mechanism is the ADR-137/FB-121 hidden requirement
  LIST (top-level `rung: RankId` + `rungReqs` per-requirement progress map;
  SCHEMA_VERSION 8 'replaces rungMeter'). There is no stored ranks[tier]
  record and no combatRank/estateService meter in the build — the two-meter
  model is T1+ frontier, but §6.4.1 presents it as the current stored data
  model (as does the §6.4 `ranks:` field, line 290).
  Source: src/core/state.ts:180-186 (rung, rungReqs — 'replaces rungMeter');
  src/core/requirements-engine.ts
  Fix: Restate track 3's T0 storage as rung + rungReqs (requirement list),
  demoting the two-meter shape to an explicit T1+ frontier note.

- 🟠 **docs/living/prd/06-tech-architecture.md:109** · stale-structure · fix: **transcribe**
  PRD: “src/   core/        ← PURE. No DOM/canvas/window. The whole game's
  logic & data.   ui/          ← thin DOM renderer.”
  Truth: The layout diagram and core-module table omit shipped top-level dirs
  (src/sim/, src/telemetry/, src/fixtures/, src/tests/, src/playcheck.ts) and
  shipped core modules (night-rounds, scenes, quest-engine, requirements-
  engine, progress-events, discovery, nengu, fight, ascension, autoplay,
  defeat, texture, math); the table's `core/economy` and `core/influence`
  don't exist as files (economy lives in nengu.ts/content market/wage;
  influence is pillars.ts). src/scripts/ holds ~20 scripts, not just gen-
  docs.ts + verify-content.ts.
  Source: ls src/ and src/core/ (no economy.ts, pillars.ts not influence.ts;
  sim/ telemetry/ fixtures/ tests/ present)
  Fix: Refresh the §6.2 diagram + module table from the real tree (or point to
  docs/repo-map.md for the layout and keep only the boundary rules here).

- 🟡 **docs/living/prd/06-tech-architecture.md:20** · stale-mechanics · fix: **prose-edit**
  PRD: “**fully static** — `vite build` → `dist/` → zipped and uploaded to
  itch.io, no server, no backend”
  Truth: The shipped release train is /ship → src/scripts/ship.sh → GitHub
  Pages (the gh-pages script + git tags for deploy messages); build:itch still
  exists as a script but itch.io is not the live distribution the doc frames
  it as (§6.1.1 and §6.8's itch-iframe hardening framing lean on it too).
  Source: package.json ('gh-pages': 'bash src/scripts/gh-pages.sh'); AGENTS.md
  /ship bullet (gh-pages push, FB-9)
  Fix: Name GitHub Pages as the shipped deploy target with itch.io as a
  secondary/planned channel.

## 07-roadmap-scope.md — 8 findings (2 high)

The scope core of §7 is in good post-storywave shape — the 32-rung per-tier
R0–R7 ladder, pillar reveal order, Otsuru/Tahei/Sawatari-juku payoffs,
Asagiri, the seven-tab IA, the 20–35% first-fight band, and the roadmap
delegation all check out against the bible, roadmap, and build. The stale
pocket is §7.3 deployment (claims no hosted CI / no deploy automation and
self-hosted OFL fonts — both retired realities — plus a fossilized verify
command list and a nonexistent world.ts), and residue of the dead pre-ADR-152
G/V rung numbering plus one pre-reboot cast/faction parked row survive in
§7.1.

- 🔴 **docs/living/prd/07-roadmap-scope.md:231** · stale-mechanics · fix: **transcribe**
  PRD: “`verify` is run **locally** as the pre-push / release gate (**no
  hosted CI, no deploy automation**).”
  Truth: Hosted CI exists (7 GitHub Actions workflows: verify, verify-nightly,
  build, lint, test, typecheck, e2e) and deploy IS automated — /ship runs
  src/scripts/ship.sh which does an isolated build + gh-pages push.
  Source: .github/workflows/ (verify.yml, verify-nightly.yml, e2e.yml, …) +
  src/scripts/ship.sh:129-130 ('build + DEV-strip gate + gh-pages push')
  Fix: Rewrite the release-gate bullet: verify runs at commit, push AND in
  hosted CI; releases go through /ship (automated gh-pages deploy today;
  itch.io remains the v1 target).

- 🔴 **docs/living/prd/07-roadmap-scope.md:254** · stale-mechanics · fix: **transcribe**
  PRD: “**Self-hosted OFL fonts.** The period-evoking display + body fonts are
  **SIL OFL**, **self-hosted**”
  Truth: The self-hosted OFL fonts were retired with the UI-v2 (Andon Steel)
  remaster — pure system font stacks, zero webfonts. §7's own risk row R4
  already says 'pure system font stacks (ADR-127 — zero font pipeline)', so
  §7.3.1/§7.3's font-checklist items contradict the section itself.
  Source: docs/living/decisions.md:2155 (ADR-144: 'the self-hosted OFL fonts
  retired with M1 — pure system stacks, zero webfonts')
  Fix: Rewrite the §7.3.1 fonts bullet (and the line-238 'fonts self-hosted'
  deploy-checklist item + line-275 OFL attribution) to system-stack/zero-
  webfont per ADR-127/ADR-144; keep the zero-network-calls smoke.

- 🟠 **docs/living/prd/07-roadmap-scope.md:75** · stale-mechanics · fix: **transcribe**
  PRD: “**~5 grounded mobs** core (boar, wolf, monkey, bandit,
  rōnin/smuggler)”
  Truth: The shipped bestiary already has 10+ MobDefs (river_rats, tanuki,
  badger, monkey, monkey_male, feral_dog, store_rats, marten, wolf, bandit, …)
  and contains no boar, rōnin, or smuggler; the bible's T0 arc is rats →
  marten → the R3 wolf. The '~5 mobs' cut-set (repeated as a hard cap in
  §7.4.1 R1, line 297) is contradicted by the build.
  Source: src/core/content/enemies.ts:64-182 + docs/story-
  bible/tiers/t0.md:118 ('rats in the store → a marten → the R3 WOLF')
  Fix: Restate the bestiary row as a grounded-mobs invariant (no belief-
  creatures, MobDef.level) pointing at enemies.ts / the tier-sheet rosters
  instead of a ~5 count with a dead example list; fix the R1 cap likewise.

- 🟠 **docs/living/prd/07-roadmap-scope.md:57** · stale-mechanics · fix: **prose-edit**
  PRD: “is **spine-guaranteed at G6 for every player** (§1.5.3, §3.6 G6, §5
  T3)”
  Truth: The G0–G7 T3 numbering is dead — ADR-152 gives every tier its own
  R0–R7 ladder (the PRD's own §7.1.1 rank-ladder row on line 74 says 'the old
  fresh-per-tier R8–R15/V0–V7/G0–G7 numbering is dead'). Same residue: 'the G7
  capstone' (line 63-64) and 'the G-tier coin/Arms spend' (line 81).
  Source: docs/living/roadmap.md:56-58 (ADR-152: 'one unbroken R0–R7 career
  per tier') + 07-roadmap-scope.md:74 itself
  Fix: Rename G6→T3-R6, G7 capstone→the T3-R7 capstone, 'G-tier'→'T3' in lines
  57, 63-64, 81.

- 🟠 **docs/living/prd/07-roadmap-scope.md:99** · stale-mechanics · fix: **prose-edit**
  PRD: “(from T1: R8–R15, plus the V0–V7 / G0–G7 equivalents; the **R0 cold-
  open story rung AND the whole floor-exempt T0 tutorial ladder R1–R7 are
  exempt**”
  Truth: R8–R15 / V0–V7 / G0–G7 is the dead pre-ADR-152 numbering; the floor-
  bound rungs are T1–T3's per-tier R0–R7 ladders (24 rungs), and the exempt
  set is all of T0's R0–R7.
  Source: docs/living/roadmap.md:56-58 (ADR-152 per-tier R0–R7; T1-M1-F1 'the
  ≥30-min/rung floor binds for the first time')
  Fix: Rewrite the parenthetical to 'every T1–T3 rung (each tier's own R0–R7);
  all of T0 (R0–R7) is exempt'.

- 🟠 **docs/living/prd/07-roadmap-scope.md:117** · stale-fiction · fix: **transcribe**
  PRD: “**The Matagi hunters, the Pilgrimage Order, the Scholars-&-Physicians
  *network*** (keep Sōan / Obaa Kuni as seeds only)”
  Truth: The Matagi hunters, the Pilgrimage Order, and Obaa Kuni do not exist
  anywhere in the post-reboot story bible (grep over docs/story-bible/ returns
  nothing); Sōan alone survives, as the canon physician (04-cast.md).
  Source: docs/story-bible/04-cast.md:120 (Sōan the physician) + empty grep
  for Matagi/Pilgrimage/Obaa Kuni across docs/story-bible/
  Fix: Rewrite the parked row to name only surviving canon (Sōan as the seed)
  or re-park the faction ideas explicitly as pre-reboot concepts pending a
  bible home.

- 🟠 **docs/living/prd/07-roadmap-scope.md:225** · stale-structure · fix: **strike-and-point**
  PRD: “the release gate: `tsgo --noEmit && oxlint && oxfmt --check && vitest
  run && verify-content && gen:docs --check`”
  Truth: The gate roster is owned by src/scripts/gates.ts (the single source,
  per AGENTS.md) and now runs ~17 gates in parallel — including fixtures, gen-
  narrative, gen-prd-regions, pacing, playcheck, md-links, milestone-
  integrity, verify-changelog, doc-budgets, checkpoint — not the 6-command
  chain the PRD inventories.
  Source: src/scripts/gates.ts:24-40 (the gate roster)
  Fix: Replace the literal command chain with a pointer: 'the roster is owned
  by src/scripts/gates.ts (single source)', keeping only the invariant that a
  release is cut from a verify-green commit.

- 🟡 **docs/living/prd/07-roadmap-scope.md:285** · dead-pointer · fix: **prose-edit**
  PRD: “The world-sim content lives in a **`content/world.ts`** data-as-code
  registry”
  Truth: No world.ts exists in src/core/content/ — the shipped content lives
  in per-domain registries (areas.ts, map.ts, enemies.ts, activities.ts,
  estate.ts, …), each id-resolved by verify-content.
  Source: src/core/content/ directory listing (no world.ts;
  areas.ts/map.ts/enemies.ts et al. present)
  Fix: Point at the per-domain src/core/content/ registries (verified by
  verify-content) instead of a nonexistent world.ts.

## Gen-region opportunities (the scout's ranked list)


1. **`t0-discoveries`** — gen-region-in-place
   Where: docs/living/prd/02-systems.md §2.6.1(g) (~lines 381–398, the 'First
   shipped instance: the woodlot lacquer tree' paragraph)
   Source: DISCOVERIES (src/core/content/discoveries.ts)
   Why: Drift ALREADY exists: the PRD claims one shipped discovery, the build
   ships four (C5a added disc-weir-bundle, disc-woodlot-sluice, disc-margins-
   sett), and this registry is the most actively growing one. Region body:
   discovery id · node · what it reveals · trigger kind (watch/visit). Tuning
   stays OUT: minAttempts floors, pity-ramp chances, hint text are pacing
   magnitudes (ADR-021). Highest drift-risk-eliminated per line of code — the
   generator is a trivial map over DISCOVERIES, same shape as genT0Bestiary.

2. **`t0-zone-reveals`** — gen-region-in-place
   Where: docs/living/prd/03-unlock-ladder.md ~lines 430–442 (the 'Estate room
   / area | Stage | Trigger | Diegetic event-log line' table)
   Source: AREAS (src/core/content/areas.ts, the 16-zone roster) + RUNG_BEATS
   motivates bindings (rungBeats.gen.ts) / home.ts reveal lines
   Why: The table hand-copies 12 rows of zone names, reveal triggers, AND
   verbatim diegetic log lines while areas.ts holds 16 zones (weir, weir-
   reeds, gate, forecourt, woodshed, kitchen, shrine, kura, sickroom, drill-
   yard, paddies, field-margins, woodlot, ruined, orchard, grove) and the
   reveal lines live in the build. Every story wave or map-sheets zone change
   stales this table silently. Region body: zone id/label · revealing
   rung/trigger — identity only; keep the E-stage narrative column as
   surrounding prose (E-stages are forward spec).

3. **`t0-pacing-pointer`** — strike-and-point
   Where: docs/living/prd/04-combat-balance.md §4.1.1 ~lines 322–330 (the per-
   rung 'Meter | curated-activity examples | rate | threshold' table)
   Source: docs/content/t0-pacing.md (existing generated doc, regenerated on
   every ADR-132 balance pass) + balance.ts/rungThreshold
   Why: The hand-typed rates (~0.60 pts/min) and thresholds (~18) are TUNING
   magnitudes — by design they must NOT become a gen-region (ADR-021 ripple-
   frozen; regions are identity-only), yet they drift with every balance
   retune while t0-pacing.md is regenerated and committed with each change
   (ADR-132), so the PRD copy is guaranteed-stale duplicate truth. Strike the
   rate/threshold columns (keep the curated-activity-examples design prose)
   and point at docs/content/t0-pacing.md as the machine-verdict source. Zero
   generator code; eliminates the PRD's most frequently-staled numbers.

4. **`t0-story-pointer`** — strike-and-point
   Where: docs/living/prd/03-unlock-ladder.md ~lines 236–241 (the cold-open
   reveal-order table with verbatim log lines) and ~lines 303–312 (the T0
   'Rung | Title | The beat' table)
   Source: docs/content/t0-story.md (existing generated reading script from
   coldOpen.gen.ts / rungBeats.gen.ts, source narrative/*.md) + the existing
   t0-rung-titles gen-region at line 281
   Why: Both tables quote fiction-voiced lines and beat summaries verbatim —
   hand-copies of narrative-compiled registries whose readable form
   t0-story.md already regenerates (the gen-narrative gate). Every ADR-139
   story diverge that lands re-stales these quotes; the titles column is even
   already duplicated by the t0-rung-titles region directly above. Keep the
   trigger-kind/design columns as prose, strike the quoted lines and beat
   column, point at t0-story.md and the bible tier sheet (tiers/t0.md). §3.0's
   hidden-rung block already does exactly this (line 382 precedent).

5. **`t0-quest-roster`** — gen-region-in-place
   Where: docs/living/prd/02-systems.md §2.12 (quests — currently names only
   the 4 starter TYPES, no roster)
   Source: QUESTS (src/core/content/quests.ts — 5 shipped quests with advance-
   event sets)
   Why: The build ships 5 quests (first_night_round, orchard_chain,
   defend_grove, pest_weir_screens, pest_field_margins) that the PRD nowhere
   inventories, and story waves keep adding them; §7 explicitly refuses to re-
   inventory (points at bible tier sheets), so an as-built identity region
   (quest id · type · node) in §2.12 is the one honest home. Keeps the
   'taxonomy not budget' framing intact; event counts/rewards are tuning and
   stay out. t0-content.md has no quest section, so this is net-new drift
   protection.

6. **`t0-activities`** — gen-region-in-place
   Where: docs/living/prd/02-systems.md §2.6(b)/(f) (labour prose naming
   activities: 'rake rice, farm the paddies, haul stores, cut wood, forage…
   tap lacquer'; '(f)' names the 16-zone walk)
   Source: ACTIVITIES (src/core/content/activities.ts — 8 activities with area
   + skill + deedSource bindings)
   Why: C5a and the discovery system grew ACTIVITIES to 8 (search_reeds,
   clear_sluice, forage_deepwoods, tap_lacquer joined the original 4) and the
   PRD's scattered prose enumeration is already incomplete. Region body:
   activity id · node (area) · skill · deedSource — identity only (yields,
   stamina costs, timing are §4 tuning). Complements the t0-deed-sources
   region which already reads the same registry, so generator plumbing exists.

7. **`t0-market-stock`** — gen-region-in-place
   Where: docs/living/prd/02-systems.md §2.4 'Two finance lanes' block (~lines
   233–246, the provisioning-shop/trader description)
   Source: MARKET_ITEMS + YOHEI_MARKET_DAYS/YOHEI_BUYS
   (src/core/content/market.ts)
   Why: The T0 provisioning shop is described but never inventoried, and C5a
   made stall stock SEASONAL (restocks per season), so the item roster is now
   a moving registry (6 items: greens_sack, wood_bundle, whetstone_kit,
   greens_basket, road_rations, smith_billet). Region body: item label ·
   kind/what-it-is · (season window if identity) — mon prices, purse size
   (YOHEI_PURSE_MON) are §4 tuning, kept out. Moderate churn expected as
   seasons gain content.

8. **`t0-estate-works`** — gen-region-in-place
   Where: docs/living/prd/02-systems.md §2.17(c) (the 'coin PURCHASE upgrades
   (the flywheel kura-works, U1–U4)' mention)
   Source: ESTATE_STAGES (src/core/content/estate.ts — U1 weir screens → U2
   orchard → U3 granary → U4 house-in-order)
   Why: The PRD names 'U1–U4' abstractly while the build carries 4 named,
   blurbed stages that a comment flags as mid-reframe ('deed reframe is next'
   — ADR-145), meaning labels WILL change and the PRD won't follow. Region
   body: stage · label · blurb — coinCost/satietyMaxBonus/yieldBonusNum are
   sim-owned SEED tuning, out. Lowest churn of the set today, hence last, but
   the pending deed-reframe makes it cheap insurance.
