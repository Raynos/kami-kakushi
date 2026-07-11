# Roadmap — **Section → Milestones → Fun-slices** (LIVING)

> **The living v1 milestone tracker.** Canonical — **promoted 2026-06-29** from the re-axe proposal
> ([`../../project/archive/2026-06-29-roadmap-reaxe-proposal.md`](../../project/archive/2026-06-29-roadmap-reaxe-proposal.md), retained as
> the as-reviewed artifact) — and it **supersedes the old MS0–MS7 milestone tracker**. Edited in place as
> fun-slices land.
>
> **Governed by [`prd/07-roadmap-scope.md`](prd/07-roadmap-scope.md) (§7), this roadmap's contract.** §7 owns the
> *what* (the locked v1 = full T0–T3 scope, the cut-set, the pacing FLOOR, the hard guardrails, the release gate,
> the risk register); this file owns the *how / the order* (the replannable MS0…M-series build sequence). §7.2
> delegates the milestone roadmap **here** as the single source (generate-don't-duplicate — ADR-021 / ADR-059 / DS#9),
> so this is the only living copy. On any conflict: **§7 wins on locked scope & shape; this file wins on
> sequence.**
>
> Reflects the **2026-06-28 tier reshape** (ADR-048…ADR-055, 6 tiers) + the **2026-06-29 decision
> session** (ADR-056…ADR-069; [ledger](../../project/feedback-human/2026-06-29-decision-session.md)) + the **5
> finalized forks** ([ledger](../../project/feedback-human/2026-06-29-roadmap-forks-finalized.md)). Per **ADR-021**
> the roadmap is **re-planned after each playtest**: **T0/T1/T2 are detailed; T3 stays coarse** (re-detailed on
> approach), and **PRD §4 balance stays liquid** (ADR-059) — it re-tunes through the build. The 6-lens review that
> shaped this is at [`…/2026-06-29-roadmap-reaxe-review.md`](../../project/audit/reports/2026-06-29-roadmap-reaxe-review.md).
>
> **Storywave reshape (2026-07-07 — ADR-150 + the docket ADR-152…ADR-162):** the story
> bible ([`../story-bible/`](../story-bible/README.md)) is now the single home of story
> canon, and the tier skeleton widens to **SEVEN tiers T0–T6** (enum 0..6 per ADR-152;
> the ADR-048 spine superseded). **v1 stays full T0–T3** (HD-26 RULED, human 2026-07-08 —
> same label, new content). The reboot runs as **two parallel plans** (the **Storywave
> wave** section below) in one shared tree; the **SHIPPED rows (MS0–M2b + T0-M1…M4) keep
> playing the OLD canon** until the GAME plan ships. Depth staging under the reboot: **T1
> detailed · T2/T3 half · T4 a quarter · T5 a fifth · T6 reserved.**
>
> **Why this shape (human steer, 2026-06-29):** flat slices aren't enough. Structure is **two-level, per
> section**: each **section** (a v1 tier **T0→T3**, or the **Ship** release section) gets **N milestones**;
> each milestone holds **N fun-slices**. A **fun-slice ships a *playable, fun* increment** (a thing the player
> can *do* that feels good), never just an internal feature. A **milestone** groups a few fun-slices into one
> coherent capability + a verify-green gate. **T0/T1/T2 are detailed; T3 stays coarse** (re-detailed on
> approach, per the freeze); a **Ship** section closes v1.

---

## Legend & conventions

- **IDs:** `T0-M2-F3` = section T0, Milestone 2, Fun-slice 3; `Ship-M1-F2` = Ship section, Milestone 1,
  Fun-slice 2. **Sections = the v1 tiers (T0→T3) + the forward frontiers (T4→T6) + Ship.**
- **Status:** ✅ shipped · 🔧 shipped-needs-rework (reshape/tuning) · 🆕 new · ⏳ provisional (coarse).
- **DoD forward-contracts** baked into fun-slices (the audit §4#7 ask): **G-CURVE** (graded win-rate curve),
  **G-NO-DEAD-VALUES** (every value has a consumer), **≥30-min floor** (T1+ only — T0 is floor-exempt per
  ADR-049), **NO-STANCE-DOMINATED** (ADR-050), **DISPLAYED==TESTED** (fixed-seed win-rate, the blessed
  analytic-gate / sampled-display split), **DIVERGE** (mandatory UI-variant contact-sheet per new surface —
  human's 2026-06-29 call; the `diverge` skill is **built**, mandatory for new/majorly-restyled surfaces,
  one-line tweaks exempt), and **playcheck** (the pacing/fun ratchet — 4 proxies in `verify` — that
  machine-enforces the floor + fun DoD lines; op-model v2 FINAL, built). The consolidated whole-v1 versions of
  these are gated in **Ship-M1**.
- **Locked spine — the storywave reboot (ADR-150 + the docket ADR-152…ADR-162; supersedes
  the 2026-06-28 ADR-048…ADR-055 6-tier spine):** **SEVEN tiers** (T0 Estate — the
  household · T1 Estate — the land · T2 the Valley · T3 the Region · T4 the Castle Town ·
  T5 the Domain · T6 Edo); **v1 = full T0–T3** (HD-26 RULED, human 2026-07-08 — ADR-021's
  lock, same label, new content; CONFIRMED, no awaiting note); **one unbroken R0–R7 career
  per tier** (NOT a fresh ladder per tier; in T6 the ladder's subject flips to the HOUSE's
  Edo standing, **H0–H7** — docket #9/ADR-160); **inside/outside rung alternation** with
  the **T2/T3 HARD LOCK** (ADR-154; the gimmick drops at T4 — free travel from then on);
  **time-skips at tier seams** (~13 years, 1780 → 1793+); the **six-season manual container
  calendar** (ADR-153 — Winter → New Year → Spring → Summer → Bon → Autumn, advanced by a
  manual action); the **guest-house/ruin reveal** (ADR-157 — the map re-labels itself at
  the T2 reveal). **The tier-up engine is the four PILLARS** — **Estate** 家産 (revealed
  T0) · **Arms** 武威 (T1) · **Office** 官威 (T2) · **Name** 家格 (T3), **one revealed per
  tier** (T4–T6 deepen the four), each graded on a **six-step ladder
  FAIL·BAD·OK·GOOD·GREAT·EXCELLENT** (F·D·B·A·A+·S); **tier-up is breadth-required,
  specialization-rewarded** — every revealed pillar ≥ GOOD, exactly one EXCELLENT + one
  GREAT, overshoot → a grade-scaled boon (ADR-159; **HD-25 RULED KEEP — human 2026-07-08 —
  pillars NOT superseded**); **manual opt-in ascension**, each un-greying the **next,
  still-unnamed** silhouette (ADR-055); **NO-PRESTIGE stays hard**; **HP carries + heals by
  eating** (ADR-050); **COIN compounding estate-upgrade flywheel** (ADR-051); **T0 =
  showcase-in-miniature** (ADR-052); a **dream beat every tier**; **active-only
  "leave-it-running" clock** (ADR-079 — the sim pauses on `document.hidden`, no
  offline/background catch-up); **enum 0..6 per ADR-152** (the ADR-048 spine superseded;
  **clean-break saves per ADR-161** — old saves retire with a courteous in-game notice, no
  migration across the reboot); **milestone-integrity** (ADR-054 — a milestone is SHIPPED
  only when every DoD line is met *or* ADR-amended before the commit; the CI manifest check
  asserts every named instrument resolves to a real test/tool; bans "SHIPPED (slice)").

---

## Storywave wave — the near-term (next-to-build) — 🆕

> **This is the roadmap's next-to-build — NOT "T1-M1".** The 2026-07-07 story reboot
> (ADR-150 + the docket ADR-152…ADR-162) makes the **story bible**
> ([`../story-bible/`](../story-bible/README.md)) the single home of story canon and widens
> the skeleton to **seven tiers**. The reboot runs as **two parallel plans in one shared
> tree** (split by path ownership — the §S seam): a **DOCS** plan and a **GAME** plan. Until
> the GAME plan ships, the SHIPPED rows below (MS0–M2b + T0-M1…M4) keep playing the OLD
> canon; the tier sections beneath are the forward plan.

| Plan | Owns | The work | DoD / gate |
|---|---|---|---|
| **Plan A — the DOCS ripple** ([`../../project/archive/fable-2026-07-07-storywave-docs.md`](../../project/archive/fable-2026-07-07-storywave-docs.md)) | the PRD, this roadmap, the ADR docket, the living-doc residue | A0 mint the engine-ADR docket (ADR-152…162) ✅ · A1 PRD §5 → pointer-and-summary · A2 the targeted PRD ripples · A3 this roadmap reshape · A4 the small living-doc sweeps · A5 post-ship closure (⛔ gated on Plan B ship) | every doc speaks the seven-tier bible canon; `prd:drift` clean; no doc claims the BUILT engine already changed (forward-spec banners carry the delta) |
| **Plan B — the GAME rebuild** ([`../../project/archive/fable-2026-07-07-storywave-game.md`](../../project/archive/fable-2026-07-07-storywave-game.md)) | `src/**`, `e2e/**`, fixtures, the generated content docs, CHANGELOG/package.json at ship | the engine ADR builds (seven-tier enum · six-season manual calendar · inside/outside lock · body/sickroom · night-round runner · speaker-label ladder · coin lanes · pillar engine · clean-break saves) → the **T0 rebuild to bible canon** → the T0 prose wave → content migration → ship | the **rewritten T0** passes its ADR-088 tier gate — a full-arc e2e (`src/core/t0-arc.test.ts`) + the shared invariants test (`src/core/invariants.test.ts`), both rewritten IN PLACE (never renamed); the clean-break save notice ships; `verify` green |

---

## Already SHIPPED (do not re-list as todo) — MS0–M2b — **CARRY FORWARD + RETUNE** (decision #19)

> **Resolves OQ-4.** The shipped MS0–M2b foundation is **kept and retuned, NOT rebuilt** (human reversed an
> initial "rebuild fresh"). We layer the reshape *on top* of the working, play-tested slice — HP-carry/heal,
> found/crafted 2nd weapon, the pillar + ascension, SFX, dev tools, the humbling-friction tune, and **retiring
> the DEMO/REAL pacing-profile fork** (decision #1 / ADR-056 — real ADR-049 is the only profile; review velocity
> comes from the DEV-only 2×/4×/8× time multiplier). The reshape's schema bump **wipes dev/v0.2 saves**
> (decision #15 — pre-launch, no users); the real `migrate()` path is built + test-covered before launch, not
> exercised across dev churn.

| Was | Maps to | What's real |
|---|---|---|
| MS0 | foundation (cross-cutting) | toolchain, pure-core, one RNG, reveal engine, full multi-backend save + crash-recovery, the **cold open** |
| MS1 | **T0-M1** | rung-meter R0→R2, labour skills (discover-by-doing), season clock, soft stamina, first nav reveal, conditioning gate, porter's-knot zero-bonus beat |
| M2a | **T0-M2** | the humbling grain-store wolf @ R3, seeded auto-resolve, sampled win-rate forecasts, character leveling, satiety throttle, no self-recovery — a loss bites carried wealth + stops autopilot |
| M2b | **T0-M2** | grounded bestiary, equipment + graded 4-band durability + repair (wood + a soft coin fee, tightened in v0.3.1 · ADR-092), a found/crafted 2nd weapon, foe forecasts + auto-fight |

So the re-axe's **new work starts at the T0 tuning pass + R4→R7 + the spine** — the cold-open→labour→first-wolf
arc already exists and carries forward (MS0–M2b shipped at `8bf6ac9` · `248bf93` · `fc36172`; the retired MS0–MS7
tracker is preserved in git history).

---

# Tier T0 — Estate (intro / tutorial) — *DETAILED (next to build)*

**Frame:** learn the whole game in miniature; rungs **R0→R7**; **4 milestones** in **SPINE-FIRST build order**
(decision #18 — see the build-order box at the end of T0). Pacing = **real ADR-049** (~10–15 min/rung,
**floor-exempt**, decision #1) — the **DEMO/REAL profile fork is retired** (ADR-056); **fast but NOT easy**: the
mediocre-start bite + durability/satiety friction stay **humbling THROUGHOUT** within guardrails (winnable ·
soft-setback only · no permanent loss · no stranding) (decision #13). Onboarding is a **diegetic mentor** — the
**domain-split canon cast** teaches each system in-world as it unlocks (**Genemon** for labour/rice/coin · **Kihei**
for arms/combat · **Sōan** for healing), **never popups** (decisions #17, #22, ADR-015). The estate is a **small
WALKABLE map** (decision #23). DEV tools throughout: a **2×/4×/8× speed toggle + jump-to-rung/tier teleport**
(decision #16, stripped from prod) and a **dev save-wipe** on the reshape schema bump (decision #15). Ends at
the **BIG ceremonial T0→T1 one-pillar (Estate 家産) ascension** (decision #14).

### T0-M1 — Waking on the estate *(the hook)* — ✅ shipped (v0.3)
| Fun-slice | Status | The fun | DoD |
|---|---|---|---|
| **T0-M1-F1** Cold open & first rake | ✅ | the woodblock cold-open hook; log cascades in | first-interactable <5s; rake → RICE ticks (+ a little coin) → log line |
| **T0-M1-F2** Labour loop + estate inks in (R0→R2) | ✅ | numbers climb, nav/rooms reveal one-per-beat | R0→R2 requirement lists complete → 100% readies the beat (ADR-137); reveal stagger; G-NO-DEAD-VALUES |
| **T0-M1-F3** **Meet your mentor (diegetic onboarding opens)** | ✅ | an in-world character greets you and teaches the labour loop as *story*, not a tooltip — adds a face to the estate | the labour mentor (**Genemon**, of the domain-split cast — Kihei teaches arms in T1-M2-F2, Sōan healing) greets you; dialogue is **data-not-script** (ADR-039); teaches by reveal-as-plot, **non-hand-holdy — no hint popups** (#17, ADR-015); **DIVERGE** on the dialogue panel |
| **T0-M1-F4** **Juice + dev-tools pass — minimal SFX + speed/teleport** | ✅ | per-deed hit cue, rice/coin tally-flash, rank-up flourish — *the biggest remaining fun lever* (#2) | **traditional-palette SFX** (#12 — taiko / shamisen-koto / shakuhachi / temple-bell 鈴; synth Web Audio, reduced-motion/mute-safe); DEV **speed toggle + jump-to-rung/tier teleport** (#16) gated out of prod; **DIVERGE** if any new surface |

### T0-M2 — First blood *(the humbling)* — ✅ shipped (v0.3); combat reworked *further* in v0.3.1 (ADR-076)
| Fun-slice | Status | The fun | DoD |
|---|---|---|---|
| **T0-M2-F1** Grain-store wolf, combat goes live @R3 | ✅ | the humbling, *winnable* first fight | first-fight **20–35% single-fight win-rate** (signed band kept, decision #5); G-CURVE; DISPLAYED==TESTED |
| **T0-M2-F2** Gear, durability & the found/crafted 2nd weapon | ✅ | equip choices; repair tension; *earn*, never gifted | graded durability; repair costs wood + a soft coin fee (waived if broke — ADR-092); **2nd weapon → found/crafted via a loot→craft loop** (retires the grant; **this is the ADR-052 showcase "one craftable" taste**); **DIVERGE** on the craft panel |
| **T0-M2-F3** **Combat becomes a real decision** | ✅ | HP-carry makes defensive stances matter; eat-to-heal couples food↔combat | **HP carries + heals by eating** (ADR-050); **NO-STANCE-DOMINATED** test (replace the dominance-enshrining test); touch-legible wear axis + stance/training reveal beat; combat SFX. *(v0.3.1 ADR-076 supersedes the auto-heal model → HP-attrition, no auto-heal, 0 HP = loss stops autopilot.)* |
| **T0-M2-F4** Keep the bite, within guardrails | ✅ | **humbling, not punishing** — the friction *stays* (#13), it just can't strand you | DO **not** smooth the durability/satiety bite (#13 revises the audit's "tame friction"); guardrails: winnable · soft-setback only · no permanent loss · no dead-ends; keep the **"fresh-L1-no-wood reaches L2 before Broken"** no-stranding test |

### T0-M3 — The spine awakens *(the macro engine — ONE pillar)* — ✅ shipped (v0.3; the macro spine closes — the audit's #1 item, delivered)
*The first proof the tier vision closes a loop; the **de-risking spike, built on MINIMAL content** (decision #18) before the MS4 breadth. The demo's first new beat = the spine landing.*
| Fun-slice | The fun | DoD |
|---|---|---|
| **T0-M3-F1** The Estate pillar goes live | the House-Influence panel — the House's **koku STANDING** (a kokudaka-like prestige score; re-assessed seasonally, NEVER spent, gates ascension) — un-greys the **active Estate pillar + locked unnamed silhouettes** (ADR-055) | R7 capstone **opens** Phase 2; `pillarDeltas` deeds accrue **only** post-R7 (FU7); additive `influence:{value,highWater}` state; **DIVERGE** on the influence panel |
| **T0-M3-F2** The seasonal judged result | a reckoning falls and *judges* your house — a high-water payoff beat that **re-assesses the koku standing** (the seasonal judge, never an income multiplier) | `onReckoning` fires on **new high-water only** (cadence keyed to `PHASE2_JUDGE_INTERVAL_DAYS`, T0 = 3d), ±10% via a day-keyed named RNG sub-stream; **70/30** deeds/seasonal |
| **T0-M3-F3** Graduate the tutorial → **the BIG ceremonial T0→T1** | a **manual opt-in ascension story event** that **always lands BIG on first contact** (#14, **NQ-1 = full ceremony in this DoD**) — title card, macro silhouettes stir, music swell, a **dream/mystery beat** (ADR-055), the grade-scaled boon revealed | hybrid gate (**T0 = EXCELLENT**); overshoot → better permanent boon (ADR-049); `tier` 0→1 stored (**D-013a**; enum 0..5 per ADR-048); grade-scaled reward bundle; **first SCHEMA_VERSION bump → dev save-WIPE (#15)** + the real `migrate()` path **built + test-covered before launch** (not run across dev churn); **DIVERGE** on the ascension surface |

### T0-M4 — The showcase in miniature *(the breadth taste — fills R4→R7 around the proven spine)* — ✅ shipped (v0.3); coin economy tightened *further* in v0.3.1 (ADR-077)
*ADR-052: a tiny taste of every system so a genre-literate player sees the whole game's shape early — built **after** the MS3 spine spike proves the loop.*
| Fun-slice | The fun | DoD |
|---|---|---|
| **T0-M4-F1** Your first quest | a goal beyond grinding — take & complete one PEST/HUNT/CLEAR | one quest end-to-end (order-free advance-event set); reveals as a top-level tab (ADR-037) |
| **T0-M4-F2** The coin flywheel taste (**LINEAR**) | spend coin on a first estate upgrade that *raises yield* → it compounds | **LINEAR** estate-upgrade taste now (decision #20 — **branches into LAND / TREASURY / TRADE sub-engines at T1**); U1→U4 yield-bearing kura-works (ADR-051; U4 "long-house" added in v0.3.1 as a deeper coin sink — ADR-092/§4.6.6d); work→rice/coin→upgrade→more output; G-NO-DEAD-VALUES guards a compounding sink |
| **T0-M4-F3** Talk & a tiny market | the **mentor's lore-talk** deepens; a tiny COIN-sink **market** (the TRADE taste) — where you also **sell surplus RICE for coin** | one NPC **lore-talk** line via the mentor (data-not-script, ADR-039); a tiny market (capped coin sink) that also lets you **sell rice for coin at a price that SWINGS BY SEASON** (rice is a real resource — eat it, store it, or sell it); **DIVERGE** on the dialogue/market panels |
| **T0-M4-F4** A place to explore — a small **WALKABLE map** | the estate is areas you **move between**, not a menu (decision #23 — delivers the §1 "areas to explore" promise) | a **small walkable T0 map** (not just organizational room-grouping; **NQ-3 = minimal here, grow in T1**, with a pinned node-count ceiling); navigable, reveal-per-beat; **DIVERGE** on the map surface |
| **T0-M4-F5** Stance & ability reveals (R5 / weapon-L10) | the combat decision deepens with a reveal beat | stance slot + ability/item slots reveal one-per-beat; touch-legible (no hover-only) |

> **✅ Build order inside T0 — SPINE-FIRST, LOCKED (decision #18; resolves OQ-2).** The milestone order above
> **is** the build order: after the **T0-M2 retune**, build **T0-M3 (the spine spike)** — one pillar, one
> season-judge, the BIG ascension — **on minimal content FIRST**, proving the macro loop closes (the audit's
> #1 gap), *then* fill **T0-M4's showcase breadth** around the proven spine. The small walkable map (#23) is
> the heaviest new T0 build and sits in MS4 specifically so it can't crowd out the spine-first cadence; grow it
> in T1 (NQ-3 = option a).

---

# Tier T1 — Estate — the land — *DETAILED (storywave replan — re-detailed on approach)*

**Frame:** the tutorial's over; the estate is no longer in miniature — **the access arc.**
One unbroken **R0–R7** ladder in the land (field-hand · terrace-hand · woodcutter ·
kura-warden · works-hand · tally-keeper · foreman · the registered man). The wings open one
at a time and the kura key is earned; the **DEBT panel** finally unlocks at the tally-keeper
rung — the number is seen at last, a story beat (docket #7/ADR-158). The arc ends in the
**restored shoin** — Munemasa's only scene, the house register's last entry, the lord's
death at the tier seam. The second pillar **Arms 武威** reveals here. Inside/outside
alternation is narrative rhythm at T1 (the HARD LOCK is T2/T3 — docket #3/ADR-154).
Difficulty stays **humbling within guardrails** (winnable · soft-setback only · no permanent
loss · no stranding). DoDs below are SHAPE-level; the tier re-plans in detail when it opens.

### T1-M1 — The land opens *(R0–R2 — the access arc begins)* — 🆕
*out of the tutorial and into the estate's land — field, terrace and woodlot labour.*

| Fun-slice | The fun | DoD (shape-level) |
|---|---|---|
| **T1-M1-F1** Past the gate — the full-estate ladder | the estate takes you seriously: real labour rungs (field-hand → terrace-hand → woodcutter) that grind, not just taste | R0–R2 on the unbroken R-ladder (continues T0, enum 0..6 per ADR-152); the **≥30-min/rung floor binds for the first time** (ADR-049/ADR-056 — T0 was floor-exempt); G-CURVE extends; **ADR-088 tier gate (named at build): a full-arc e2e `src/core/t1-arc.test.ts` + the shared `src/core/invariants.test.ts`** |
| **T1-M1-F2** The land grows — reclamation & the flywheel | pour surplus back into the land and watch the estate visibly grow (E1→E2) | the coin flywheel deepens into the LAND lane (shinden reclamation, yield-bearing, capped); G-NO-DEAD-VALUES on every new sink; **DIVERGE** on any new surface |

### T1-M2 — The kura key & the debt panel *(R3–R5 — Arms reveals)* — 🆕
*the kura key is earned, the ledger opens, and the second pillar Arms 武威 lights up.*

| Fun-slice | The fun | DoD (shape-level) |
|---|---|---|
| **T1-M2-F1** The kura-warden earns the key | the wings open one at a time; the kura key is a real access beat, not a menu unlock | R3–R4 (kura-warden → works-hand); reveal-per-beat access; **DIVERGE** on the estate-access surface |
| **T1-M2-F2** The tally-keeper opens the debt panel | the DEBT stops being a whisper — the tally-keeper rung finally SHOWS the number | R5 tally-keeper unlocks the **debt panel** (docket #7/ADR-158 — the number seen for the first time); the debt is a CIRCUMSTANCE, not a villain; G-NO-DEAD-VALUES; **DIVERGE** on the ledger/debt panel |
| **T1-M2-F3** Arms 武威 reveals | the second pillar names on the influence board — martial deeds start to count | the Arms 武威 pillar NAMES + its lane appears (silhouette un-greyed at the T0→T1 ascension); deeds Phase-2-gated to the R7 capstone; **DIVERGE** on the Arms lane |

### T1-M3 — The shoin & the two-pillar ascension *(R6–R7 → the Valley opens)* — 🆕
*foreman to the registered man; the restored shoin, Munemasa's only scene, the register's last entry, the lord's death at the seam; the Estate+Arms ascension opens the Valley.*

| Fun-slice | The fun | DoD (shape-level) |
|---|---|---|
| **T1-M3-F1** Foreman to the registered man | you reach the top estate rung and Phase 2 opens — deeds across Estate AND Arms finally count | R6–R7 (foreman → the registered man); R7 capstone opens Phase 2; deeds accrue post-capstone (Estate + Arms); G-CURVE extends |
| **T1-M3-F2** The shoin, the register & the seam | the restored shoin — Munemasa's only scene, the register's last entry, and the lord's death at the tier seam (a time-skip) | the shoin restoration beat + Munemasa's single scene + the register's last entry; the lord dies at the seam; time-skip to T2 (~13-year arc); TST2 governs the watched surfaces |
| **T1-M3-F3** The two-pillar ascension → the Valley | a manual opt-in ascension: the Estate+Arms gate, a dream beat, the next silhouette (Office) stirs, and the Valley comes into view | ascension gate across Estate + Arms (ADR-159 breadth-required); manual opt-in; un-greys the next (Office) silhouette; `tier` 1→2 stored (enum 0..6 per ADR-152); dream beat; **DIVERGE** on the ascension surface |

---

# Tier T2 — the Valley — *HALF-DETAIL (storywave replan — re-detailed on approach)*

**Frame:** a regency's messenger to a watching village — *the HOUSE rising in public.* One
unbroken **R0–R7** ladder (messenger → works-hand of the outer court → dues-carrier →
steward's shadow → market-man → works-master → the house's voice → yard-officer) under the
**inside/outside HARD LOCK** (docket #3/ADR-154 — an inside rung locks the world out, an
outside rung locks the estate closed; T2-R5 is the one authored crossing, the bandits
hitting the works). **The reveal lands early:** three signals, and the map **re-labels
itself** — *Main house → Guest house; the ruin → the Main house* (docket #6/ADR-157) — and
the true restoration begins. The **village reputation track opens at zero** (docket
#9/ADR-160). The **first MAN he ever fights** is a staged threshold beat (the bandit camp).
The third pillar **Office 官威** reveals mid-tier. Half-detail; re-planned on approach.
**ADR-088 tier gate (named at build): a full-arc e2e `src/core/t2-arc.test.ts` + the shared
`src/core/invariants.test.ts`.**

| Milestone | Headline | Example fun-slices |
|---|---|---|
| **T2-M1** The valley & the reveal | messenger to the watching village; the three-signal REVEAL + the map re-label; the hard lock begins; the village rep track opens at zero | first errands past the gate; the reveal beat (the map re-labels itself); the rep-web inks in |
| **T2-M2** The first man & Office | the bandit camp; the first MAN fought (the T2-R5 crossing — the outside forcing itself in); Office 官威 names; the three-pillar ascension → the Region | the staged first-man threshold; Office reveals; the T2→T3 ascension + the Region teaser |

---

# Tier T3 — the Region — *HALF-DETAIL (v1 finish — storywave replan, re-detailed on approach)*

**Frame:** road-guard to the house's reach made flesh — *where nobody knows the house, he
IS the house.* One unbroken **R0–R7** ladder (road-guard · quartermaster · caravan-master ·
keeper of the far-ledger · rumor-follower · inner-wing warden · expedition-leader · the
house's factor), the inside/outside HARD LOCK still on (docket #3/ADR-154). The **ORIGIN
mainline** opens: he is **Tahei**, a kaidō porter a landslide took — the family a region
away kept his register entry open by refusal; the **Tama truth resolves** (Tama was a girl
who ran — Otsuru, found grown), and the **family reunion is an OPTIONAL side-track at
Sawatari-juku** (not a parallel rung track — the origin is a reputation track, docket
#9/ADR-160). The ruin's inner domain and the sealed storerooms (the buried truth) come
within reach. The fourth pillar **Name 家格** reveals — the full four-pillar board. **v1
content ends here** (`outcome: t3done`) → the bounded "v1 complete" close → free-play.
Half-detail; re-planned on approach. **ADR-088 tier gate (named at build): a full-arc e2e
`src/core/t3-arc.test.ts` + the shared `src/core/invariants.test.ts`.**

| Milestone | Headline | Example fun-slices |
|---|---|---|
| **T3-M1** The region & the origin | region travel under the hard lock; the reach made flesh; the ORIGIN mainline opens (Tahei; the birth name known) | the origin homecoming thread begins; a region-scale quest; the rumor-follower rung |
| **T3-M2** The origin payoff, Name & v1 close | the **Otsuru/Tama truth** resolves; the OPTIONAL Sawatari-juku reunion; the **Name 家格** pillar + the four-pillar gate; the bounded v1 close → free-play | Otsuru found; the four-pillar ascension gate; the bounded ending + free-play |

---

# Ship — v1 release readiness — *DETAILED*

**Frame:** v1 = the **T0→T3** *content* (Estate — the household · Estate — the land · the Valley · the Region); **Ship** is the section that actually **releases** it. It restores the old
roadmap's dropped back half — the **MS6** whole-v1 balance/fun/perf gate and the **MS7** itch.io release — that
the tier re-axe had folded away. The **narrative** ending (the Otsuru/Tama payoff, the four-pillar gate, the
bounded close → free-play) stays in **T3-M3**; Ship owns the **technical** release-readiness. Per the human's
2026-06-29 call: **per-slice DoD contracts run all through the build, AND a consolidated final gate runs here.**
**2 milestones.**

### Ship-M1 — The v1 quality gate *(the consolidated balance/fun/perf pass the old MS6 held)* — 🆕
*the whole game is balanced, instrumented and checked as one piece before it ships.*

| Fun-slice | Status | The fun | DoD |
|---|---|---|---|
| **Ship-M1-F1** Whole-v1 balance pass | 🆕 | the whole game is balanced as one piece — the graded win-rate curve holds from the first wolf to the four-pillar gate, every value still has a consumer, and no stance is a trap | one consolidated **G-CURVE** holds across ALL of T0→T3; the **G-NO-DEAD-VALUES** ledger is complete (every currency / sub-engine value has a consumer); **NO-STANCE-DOMINATED** across the full weapon roster (spear L1 + sword L2 + T3 line); **trade ≤⅓** + **70/30** verifier-green tier-wide; **DISPLAYED==TESTED** everywhere a win-rate shows |
| **Ship-M1-F2** Fun-proxies become a GATE + the floor regression | 🆕 | the pacing/fun instrumentation graduates from report-only into a hard gate — the build can't ship if a rung undershoots the floor or a fun-proxy regresses | promote the report-only **fun-proxies** (pacing / dead-time / first-action) → a **GATE** (the instrumentation MS1 shipped WITHOUT — ADR-071's motivating evidence); the **≥30-min floor REGRESSION** consolidated across T1–T3 (fails on undershoot only, ADR-056); the **§4.8 ~28.5h budget RE-DERIVED** across the 4 v1 tiers (T0 fast/floor-exempt + T1/T2/T3 floored) |
| **Ship-M1-F3** The perf budget gate | 🆕 | the game stays smooth and light — a frame/load/memory budget the build is held to | a **PERF budget gate** (frame-time / load-time / memory ceiling) + the perf test the old MS6 carried; runs in `verify`/CI; no UI surface (no DIVERGE) |
| **Ship-M1-F4** Accessibility acceptance pass | 🆕 | the whole game is checked for reach — reduced-motion, mute, touch-legible, readable contrast — across every surface | a11y **ACCEPTANCE** pass (PRD §2.21 / ADR-045): reduced-motion honored, mute-safe SFX, **touch-legible (NO hover-only)**, colour-contrast across every v1 surface T0→T3; closes the audit a11y gap; per-surface DIVERGE contact-sheets already enforce visual intent — this is the consolidated acceptance check |

### Ship-M2 — Cut the build & ship *(the old MS7)* — 🆕
*the save survives the real world, then the game actually goes out — the deliberate, human-approved way.*

| Fun-slice | Status | The fun | DoD |
|---|---|---|---|
| **Ship-M2-F1** Save durability at release | 🆕 | your save survives the real world — the itch.io cross-origin iframe, a mid-write crash, a poisoned record — verified on an actual build | the **cross-origin-iframe SAVE-SURVIVAL test** (PRD §6.8) on a real itch build; crash-recovery ring + safe-mode + poison-suppression verified; the **`migrate()` chain test-covered end-to-end** (ADR-067 / D-013a — the real forward-migration path exercised, not just the dev save-wipe); no new UI surface (no DIVERGE) |
| **Ship-M2-F2** Cut the itch.io build & ship | 🆕 | the game actually goes out — a stamped itch.io build, uploaded the deliberate, human-approved way | `pnpm run build:itch` (content descriptors + build stamp); the deliberate, **HUMAN-APPROVED itch.io upload** (ADR-017 — outward-facing, requires human sign-off, never auto); the bounded "v1 complete" narrative close already shipped in T3-M3 — Ship-M2 is the technical release |

---

# Beyond v1 — the forward frontiers (T4–T6) — *⏳ ROADMAP ONLY (post-v1)*

**Frame:** past the v1 finish (T0–T3). These are the storywave skeleton's forward tiers —
the near frontier (T4) is a quarter-detail sketch; T5–T6 are coarser still. Re-detailed when
each opens; DoDs land at build. Each tier's first milestone will name its **ADR-088**
full-arc e2e (`src/core/tN-arc.test.ts`) + the shared `src/core/invariants.test.ts`.

## T4 — the Castle Town — *QUARTER-DETAIL*

The tier with a **FACE for an enemy**: the martial lord **Tomita**, whose hands are in both
old wounds. **Katsuhide** is found and renounces in writing; **Shinnosuke** is named heir;
the campaign ends with the house **TAKING the castle town**. The inside/outside hard lock
**drops here** — free travel from T4 on (docket #3/ADR-154). The four pillars deepen (no new
pillar). One unbroken R0–R7 ladder (the campaign — envoy → … → under-steward).

| Milestone | Headline |
|---|---|
| **T4-M1** The campaign | the enemy lord Tomita; Katsuhide's renunciation; Shinnosuke named heir; the house takes the castle town; the hard lock drops |

## T5 — the Domain — *FIFTH-DETAIL*

Caretaker administration of a broken domain (the inherited debt at scale). **THE RUNG-UP
INVERTS:** each rung is an audience-day — the domain summoned to HIM, not he to it. Beneath
it: **Genemon's failing, the handover, the chair.** Ends at **THE STEWARD** (R0–R7 —
surveyor → … → the steward). One-milestone sketch; re-detailed on approach.

## T6 — Edo — *RESERVED (one line)*

Personal rungs retire; the rungs become the **HOUSE's Edo standing, H0→H7** (kernel #4 in mechanics); Shinnosuke is lord; deliberately RESERVED — the game-within-a-game, the no-prestige pseudo-prestige act (docket #9/ADR-160).

---

## Cross-cutting (thread through every fun-slice, not a tier)

- **Diegetic-mentor onboarding** (decisions #22, #17, ADR-015, ADR-063): the **domain-split canon cast** —
  **Genemon** (labour/rice/coin, introduced in **T0-M1-F3**) · **Kihei** (arms/combat, **T1-M2-F2**) · **Sōan**
  (healing) — teaches each system in-world as it unlocks, **never popups**. Deepened by the village/region cast
  at T2+.
- **DEV tools** (decision #16, ADR-067): the **2×/4×/8× speed toggle + jump-to-rung/tier teleport** ship in
  **T0-M1-F4** and stay available all tiers; DEV-only, stripped from prod. Defer richer dev affordances until a
  test needs one.
- **Save policy** (decisions #15, D-013a, ADR-067): **wipe dev/v0.2 saves on the reshape schema bump**
  (pre-launch, no users); build + test-cover the real `migrate()` path **before launch** (the consolidated
  exercise is **Ship-M2-F1**), not across dev churn. D-013a forward-migration still governs shipped saves.
- **Active-only "leave-it-running" clock** (ADR-079): the sim **pauses on `document.hidden`** (no
  offline/background catch-up); the genre's "leave it running" fantasy (§1.1) comes from **tab-open
  auto-repeat while the tab is visible**. A behaviour every tier's clock inherits.
- **Milestone-integrity** (ADR-054): a milestone is SHIPPED only when **every DoD line is met OR ADR-amended
  before the commit**; a **CI manifest check** asserts every instrument a DoD names resolves to a real
  test/tool (bans "SHIPPED (slice)"). The per-milestone verify-green gate is the lighter, per-commit half;
  this is the full integrity rule. *(ADR-054 is the source; this re-axe bakes the contract in.)*
- **Process gates** — the **op-model v2 FINAL** ([`2026-06-29-operating-model-v2-final.md`](../../project/archive/2026-06-29-operating-model-v2-final.md),
  built by a concurrently-active op-model agent) is the **source of truth**: that plan *defines* the gates,
  this roadmap *bakes them in*. All three are now **BUILT**: (1) the **pre-commit gate runs the full `verify`**
  (commit lane, 5s soft / 8s HARD budget — pre-commit blocks past 8s, ADR-176; `SKIP_VERIFY=1`/`SKIP_JOURNAL=1`/`SKIP_BUDGET=1` escape hatches); (2) the
  **`playcheck` fun-vector ratchet** (4 pacing/fun proxies, in `verify`) — so the **≥30-min floor** + the
  pacing/fun DoD lines above are **machine-enforced**, not merely asserted; (3) the **mandatory `diverge`
  contact-sheet skill** (DS#10, human's 2026-06-29 steer — mandatory for new/major UI surfaces, one-line tweaks
  exempt), so the **DIVERGE** DoD lines reference a real skill. **DIVERGE + `playcheck` are the two forward DoD
  contracts** the fun-slices carry. *(The FINAL plan's ADR numbers are still being formalized into
  `decisions.md` — defer to that plan, not to a specific D-0NN here.)*
- **PRD stays liquid** (decision #7, ADR-059): no §1 freeze; the PRD is split into per-section files (decision #6)
  and rippled in one batch, then re-tuned by playtest through T0→T3; converted to living docs only once v1 is
  **fully built + playtested**.
- **Acceptance gates extend, never regress:** each new tier extends **G-CURVE**; each new currency extends the
  **G-NO-DEAD-VALUES** ledger; each ascension extends the **migrate()** chain with a covering test. The
  consolidated whole-v1 versions are gated in **Ship-M1**.

---

## Resolved open questions (the proposal's original 6 — now CLOSED)

All six of this proposal's original open questions are resolved by the 2026-06-29 decision session.

| # | Original question | Resolution | Source |
|---|---|---|---|
| **OQ-1** | Milestone count (N per section)? | **No fixed cut — agent's content-driven call** (human 2026-06-29: "as many milestones as you please"). The old "4/3/3/3" is fully retired; the current shape **4/4/4/3 (+ Ship's 2)** reflects the content and may grow/shrink as on-approach detailing warrants. | **human steer + agent design** |
| **OQ-2** | Within-T0 order — spine-spike first or breadth first? | **SPINE-FIRST, thin.** Embodied in the milestone order: **T0-M3 (spine, on minimal content) is built before T0-M4 (showcase breadth)**. | **decision #18** |
| **OQ-3** | Fun-slice granularity / grain? | **"One playable thing per fun-slice", ≈3–5 per milestone** — kept (T1/T2 run 4–5 per milestone). | delegated → agent call |
| **OQ-4** | Shipped T0 — rebuild or carry forward? | **CARRY FORWARD + RETUNE.** MS0–M2b is the kept, play-tested foundation; the reshape layers on top (NOT a rebuild). | **decision #19** |
| **OQ-5** | Naming — IDs or human-readable? | **Keep BOTH** — `T0-M3-F1`-style IDs *and* human-readable slice names. | delegated → agent call |
| **OQ-6** | T1 rung count? | **~8 rungs (≈R8→R15); ~16 estate rungs total.** | **ADR-052 + reshape** |

## Forks & open questions — ALL RESOLVED (2026-06-29)

**Resolved this round (2026-06-29 decision session):**
- **NQ-1 — Ceremony inside the thin spike → CONFIRMED (option A).** The full ceremonial polish (title card,
  silhouettes-stir, music swell, dream beat) stays in **T0-M3-F3's DoD** — it's content-independent, so the
  first ascension lands BIG even on thin content (#14/ADR-062).
- **NQ-2 — Diegetic-mentor cast → the DOMAIN-SPLIT CANON CAST.** Genemon (labour/rice/coin) · Kihei (arms/combat) ·
  Sōan (healing). Wired into T0-M1-F3, T1-M2-F2, and the cross-cutting bullet.
- **NQ-3 — Walkable-map scope → option (a).** Minimal walkable map in **T0-M4-F4**, grown in **T1-M3-F4** (Near
  Satoyama) and **T2** (Asagiri + Foothills), with a pinned node-count ceiling. (Option (c) would violate ADR-065.)
- **T2 weapon line → PULL THE STAFF LINE INTO T2** (human steer 2026-06-29). The 3rd combat line (Bō / Naginata
  / Kanabō / Tetsubō) opens at **T2-M1-F5**, found/crafted; the weapon roster is **complete by end-of-T2**, so
  **T3 is combat *depth*, not a new line**.
- **Cross-pillar combos → PARTIAL set at T2 (Office pairs only)** — Arms×Office + Estate×Office surface at
  **T2-M3-F3**; the full 4-pillar anti-slump set lands at T3 when Name reveals.
- **Milestone count → AGENT'S CONTENT-DRIVEN CALL, no fixed cut** (human: "as many milestones as you please").
  The current 4/4/4/3 (+ Ship's 2) reflects the content; expand or contract freely as on-approach detailing warrants.

**Finalized 2026-06-29 — all forks CLOSED (the human confirmed every default; none block the build).** Ledger:
[`2026-06-29-roadmap-forks-finalized.md`](../../project/feedback-human/2026-06-29-roadmap-forks-finalized.md).

> **⚠ Mechanism superseded 2026-07-11 — [ADR-182](decisions.md) (extending ADR-137).** This ledger is a
> RECORD of what the human signed on 2026-06-29 and is left verbatim. Two entries name a progression
> mechanism that is now dead **at every tier**: the per-rung-reset points **sub-meter**, its back-solved
> **threshold**, and the **AND-gate** with story milestones. What stands from them: the **hour floors and
> the ≈≥40-min per-rung band** (now pacing targets the FB-4 sim **measures against**, never numbers a rung
> is back-solved from) and the **two-track Estate-Service / Combat-Rank split** (ADR-025). What replaces
> the mechanism: each rung binds an **authored list of objective requirements**; 100% of it alone readies
> the rung beat. Read entries 1 and 3 with that substitution.
1. **Per-tier hour floors** (#1) → **ACCEPTED AS PROVISIONAL.** T1 ~5–8h · T2 ~8–10h · per-rung ≈ ≥40 min set
   rung thresholds only; PRD §4 is liquid (ADR-059), playtest re-tunes, and the §4.8 ~28.5h budget **re-derives
   across all 4 v1 tiers together at Ship-M1-F2**.
2. **E-stage → tier mapping + retinue** (#2) → **DEFAULT.** E1→E2 lands in T1 (estate visibly grows once),
   E2→E3+ slips to T2+, and the first paid retinue (Gohei & Yatarō) belongs to T1 — so T2's V5 is a
   deployment/expansion, not a first.
3. **T1 R8→R15 rung titles + the two-track meter** (#3) → **ACCEPTED (both).** Keep the proposed titles (Kura
   Warden → … → Trusted Man of the House) and the two-track Estate-Service / Combat-Rank sub-meter split (the
   Phase-1 AND-gate); titles are easily restyled later.
4. **Rival-house T2/T3 split** (#4) → **DEFAULT.** Rivals INTRODUCED + the contest BEGINS + the first contested
   deed at T2; the climax (G5 Naoyuki ally-flip, G7 dethroning) at T3.
5. **Deed-band magnitudes** (#5) → **ACCEPTED AS PROVISIONAL.** T1 Arms 0.5K/0.72K/0.95K (cap 20 ip) + Estate
   0.8K/1.1K/1.5K; T2 Office 2K/3.2K/4.5K (cap 80 ip), Estate good 8K / Arms good 5K (PRD §4 liquid, ADR-059;
   re-confirm against ADR-049 on approach).
