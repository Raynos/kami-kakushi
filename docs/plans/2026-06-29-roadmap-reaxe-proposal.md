# Roadmap re-axe — nested **Tier → Milestones → Fun-slices** (PROPOSAL)

> **PROPOSAL — for human review.** Reflects the **2026-06-28 tier reshape** (D-048…D-055, 6 tiers) + the
> **2026-06-29 decision session** ([`../../project/human-feedback/2026-06-29-decision-session.md`](../../project/human-feedback/2026-06-29-decision-session.md)).
> **Now incorporates the 2026-06-29 decisions (#1–#23) and RESOLVES all 6 of this proposal's original open
> questions** (see *Resolved open questions* near the bottom). This is the **candidate to become the new
> [`../../docs/living/roadmap.md`](../../docs/living/roadmap.md)** and **supersedes the M-milestone roadmap once
> approved** — but it stays **PROPOSAL until the human OKs**; nothing here is applied canon yet.
>
> **Why this shape (human steer, 2026-06-29):** flat slices aren't enough. Structure is **two-level, per
> tier**: each v1 tier (T0→T3) gets **N milestones**; each milestone holds **N fun-slices**. A **fun-slice
> ships a *playable, fun* increment** (a thing the player can *do* that feels good), never just an internal
> feature. A **milestone** groups a few fun-slices into one coherent capability + a verify-green gate.
> **T0 is detailed (the next-to-build tier); T1–T3 stay coarse** (re-detailed on approach, per the freeze).

---

## Legend & conventions

- **IDs:** `T0-M2-F3` = Tier 0, Milestone 2, Fun-slice 3.
- **Status:** ✅ shipped · 🔧 shipped-needs-rework (reshape/tuning) · 🆕 new · ⏳ provisional (coarse).
- **DoD forward-contracts** baked into fun-slices (the audit §4#7 ask): **G-CURVE** (graded win-rate curve),
  **G-NO-DEAD-VALUES** (every value has a consumer), **≥30-min floor** (T1+ only — T0 is floor-exempt per
  D-049), **NO-STANCE-DOMINATED** (D-050), **DISPLAYED==TESTED** (fixed-seed win-rate, the blessed
  analytic-gate / sampled-display split), **DIVERGE** (mandatory UI variant contact-sheet per new surface —
  human's 2026-06-29 call).
- **Locked spine (D-048…D-055):** 6 tiers (T0 Estate-tutorial · T1 Estate-full · T2 Village · T3 Region ·
  T4 Castle-town · T5 Edo); **v1 = T0→T3**; **one pillar per tier** (T0→T1 Estate 家産 · T1→T2 Arms 武威
  unlocks Village · T2→T3 Office 官威 · T3→T4 Name 家格); **manual opt-in ascension** (hybrid grade-gate,
  T0 = EXCELLENT; overshoot → permanent boon); **HP carries + heals by eating**; **koku compounding
  estate-upgrade flywheel**; **T0 = showcase-in-miniature**; **active pillar + locked silhouettes** + a
  **dream beat every tier**.

---

## Already SHIPPED (do not re-list as todo) — M0–M2b — **CARRY FORWARD + RETUNE** (decision #19)

> **Resolves OQ-4.** The shipped M0–M2b foundation is **kept and retuned, NOT rebuilt** (human reversed an
> initial "rebuild fresh"). We layer the reshape *on top* of the working, play-tested slice — HP-carry/heal,
> found/crafted 2nd weapon, the pillar + ascension, SFX, dev tools, the humbling-friction tune. The
> reshape's schema bump **wipes dev/v0.2 saves** (decision #15 — pre-launch, no users); the real `migrate()`
> path is built + test-covered before launch, not exercised across dev churn.

| Was | Maps to | What's real |
|---|---|---|
| M0 | foundation (cross-cutting) | toolchain, pure-core, one RNG, reveal engine, full multi-backend save + crash-recovery, the **cold open** |
| M1 | **T0-M1** | rung-meter R0→R2, labour skills (discover-by-doing), season clock, soft stamina, first nav reveal, conditioning gate, porter's-knot zero-bonus beat |
| M2a | **T0-M2** | the humbling grain-store wolf @ R3, seeded auto-resolve, sampled win-rate forecasts, character leveling, satiety throttle, self-recovering losses |
| M2b | **T0-M2** | grounded bestiary, equipment + graded 4-band durability + repair (wood sink), a 2nd weapon @ combat-Lv2 *(currently a grant — reshape makes it found/crafted)*, foe forecasts + auto-fight |

So the re-axe's **new work starts at the T0 tuning pass + R4→R7 + the spine** — the cold-open→labour→first-wolf
arc already exists and carries forward.

---

# Tier T0 — Estate (intro / tutorial) — *DETAILED (next to build)*

**Frame:** learn the whole game in miniature; rungs **R0→R7**; **4 milestones** in **SPINE-FIRST build order**
(decision #18 — see the build-order box at the end of T0). Pacing = **real D-049** (~10–15 min/rung,
**floor-exempt**, decision #1) — **fast but NOT easy**: the mediocre-start bite + durability/satiety friction
stay **humbling THROUGHOUT** within guardrails (winnable · soft-setback only · no permanent loss · no
stranding) (decision #13). Onboarding is a **diegetic mentor** — an in-world character teaches each system by
dialogue/story as it unlocks, **never popups** (decisions #17, #22, D-015). The estate is a **small WALKABLE
map** (decision #23). DEV tools throughout: a **2×/4×/8× speed toggle + jump-to-rung/tier teleport** (decision
#16, stripped from prod) and a **dev save-wipe** on the reshape schema bump (decision #15). Ends at the
**BIG ceremonial T0→T1 one-pillar (Estate 家産) ascension** (decision #14).

### T0-M1 — Waking on the estate *(the hook)* — mostly ✅ + a 🆕 juice/onboarding pass
| Fun-slice | Status | The fun | DoD |
|---|---|---|---|
| **T0-M1-F1** Cold open & first rake | ✅ | the woodblock cold-open hook; log cascades in | first-interactable <5s; rake → koku ticks → log line |
| **T0-M1-F2** Labour loop + estate inks in (R0→R2) | ✅ | numbers climb, nav/rooms reveal one-per-beat | R0→R2 AND-gate; reveal stagger; G-NO-DEAD-VALUES |
| **T0-M1-F3** 🆕 **Meet your mentor (diegetic onboarding opens)** | 🆕 | an in-world character greets you and teaches the labour loop as *story*, not a tooltip — adds a face to the estate | in-world mentor (e.g. estate elder / drillmaster Kihei); dialogue is **data-not-script** (D-039); teaches by reveal-as-plot, **non-hand-holdy — no hint popups** (#17, D-015); **DIVERGE** on the dialogue panel |
| **T0-M1-F4** 🆕 **Juice + dev-tools pass — minimal SFX + speed/teleport** | 🆕 | per-deed hit cue, koku tally-flash, rank-up flourish — *the biggest remaining fun lever, lands BEFORE the R1 taste call* (#2) | **traditional-palette SFX** (#12 — taiko / shamisen-koto / shakuhachi / temple-bell 鈴; synth Web Audio, reduced-motion/mute-safe); DEV **speed toggle + jump-to-rung/tier teleport** (#16) gated out of prod; **DIVERGE** if any new surface |

### T0-M2 — First blood *(the humbling)* — ✅ + a 🔧 retune pass
| Fun-slice | Status | The fun | DoD |
|---|---|---|---|
| **T0-M2-F1** Grain-store wolf, combat goes live @R3 | ✅ | the humbling, *winnable* first fight | first-fight **20–35% single-fight win-rate** (signed band kept, decision #5); G-CURVE; DISPLAYED==TESTED |
| **T0-M2-F2** Gear, durability & the found/crafted 2nd weapon | ✅/🔧 | equip choices; repair tension; *earn*, never gifted | graded durability; repair wood-sink; **2nd weapon → found/crafted via a loot→craft loop** (retires the grant; **this is the D-052 showcase "one craftable" taste**); **DIVERGE** on the craft panel |
| **T0-M2-F3** 🔧 **Combat becomes a real decision** | 🔧 | HP-carry makes defensive stances matter; eat-to-heal couples food↔combat | **HP carries + heals by eating** (D-050); **NO-STANCE-DOMINATED** test (replace the dominance-enshrining test); touch-legible wear axis + stance/training reveal beat; combat SFX |
| **T0-M2-F4** 🔧 Keep the bite, within guardrails | 🔧 | **humbling, not punishing** — the friction *stays* (#13), it just can't strand you | DO **not** smooth the durability/satiety bite (#13 revises the audit's "tame friction"); guardrails: winnable · soft-setback only · no permanent loss · no dead-ends; keep the **"fresh-L1-no-wood reaches L2 before Broken"** no-stranding test |

### T0-M3 — The spine awakens *(the macro engine — ONE pillar)* — 🆕 **(the audit's #1 item; BUILT FIRST)**
*The first proof the tier vision closes a loop; the **de-risking spike, built on MINIMAL content** (decision #18) before the M4 breadth. The demo's first new beat = the spine landing.*
| Fun-slice | The fun | DoD |
|---|---|---|
| **T0-M3-F1** The Estate pillar goes live | the House-Influence panel un-greys the **active Estate pillar + locked unnamed silhouettes** (D-055) | R7 capstone **opens** Phase 2; `pillarDeltas` deeds accrue **only** post-R7 (FU7); additive `influence:{value,highWater}` state; **DIVERGE** on the influence panel |
| **T0-M3-F2** The seasonal judged result | the season turns and *judges* your house — a high-water payoff beat | `onSeasonBoundary` fires on **new high-water only**, ±10% via a day-keyed named RNG sub-stream; **70/30** deeds/seasonal |
| **T0-M3-F3** Graduate the tutorial → **the BIG ceremonial T0→T1** | a **manual opt-in ascension story event** that **always lands BIG on first contact** (#14) — title card, macro silhouettes stir, music swell, a **dream/mystery beat** (D-055), the grade-scaled boon revealed | hybrid gate (**T0 = EXCELLENT**); overshoot → better permanent boon (D-049); `tier` 0→1 stored (D-014); grade-scaled reward bundle; **first SCHEMA_VERSION bump → dev save-WIPE (#15)** + the real `migrate()` path **built + test-covered before launch** (not run across dev churn); **DIVERGE** on the ascension surface |

### T0-M4 — The showcase in miniature *(the breadth taste — fills R4→R7 around the proven spine)* — 🆕
*D-052: a tiny taste of every system so a genre-literate player sees the whole game's shape early — built **after** the M3 spine spike proves the loop.*
| Fun-slice | The fun | DoD |
|---|---|---|
| **T0-M4-F1** Your first quest | a goal beyond grinding — take & complete one PEST/HUNT/CLEAR | one quest end-to-end (order-free advance-event set); reveals as a top-level tab (D-037) |
| **T0-M4-F2** The koku flywheel taste (**LINEAR**) | spend koku on a first estate upgrade that *raises yield* → it compounds | **LINEAR** estate-upgrade taste now (decision #20 — **branches into LAND / TREASURY / TRADE sub-engines at T1**); E1→E3 yield-bearing upgrades (D-051); work→koku→upgrade→more output; G-NO-DEAD-VALUES guards a compounding sink |
| **T0-M4-F3** Talk & a tiny market | the **mentor's lore-talk** deepens; a tiny koku-sink **market** (the TRADE taste) | one NPC **lore-talk** line via the mentor (data-not-script, D-039); a tiny market (capped koku sink); **DIVERGE** on the dialogue/market panels |
| **T0-M4-F4** A place to explore — a small **WALKABLE map** | the estate is areas you **move between**, not a menu (decision #23 — delivers the §1 "areas to explore" promise) | a **small walkable T0 map** (not just organizational room-grouping); navigable, reveal-per-beat; **DIVERGE** on the map surface |
| **T0-M4-F5** Stance & ability reveals (R5 / weapon-L10) | the combat decision deepens with a reveal beat | stance slot + ability/item slots reveal one-per-beat; touch-legible (no hover-only) |

> **✅ Build order inside T0 — SPINE-FIRST, LOCKED (decision #18; resolves OQ-2).** The milestone order above
> **is** the build order: after the **T0-M2 retune**, build **T0-M3 (the spine spike)** — one pillar, one
> season-judge, the BIG ascension — **on minimal content FIRST**, proving the macro loop closes (the audit's
> #1 gap), *then* fill **T0-M4's showcase breadth** around the proven spine. The small walkable map (#23) is
> the heaviest new T0 build and sits in M4 specifically so it can't crowd out the spine-first cadence; grow it
> in T1 (see NEW open question NQ-3).

---

# Tier T1 — Estate (full) — *COARSE*

**Frame:** left the tutorial; the **real grind** (≥30-min/rung floor binds); **~8 new rungs (≈R8→R15, ~16
estate rungs total)** — confirmed per D-052 + the reshape (resolves OQ-6); **+Arms 武威** pillar → its
ascension **unlocks the Village**.

| Milestone | Headline | Example fun-slices |
|---|---|---|
| **T1-M1** The real grind opens | the floor binds; deeper labour/skill web; the koku flywheel **branches** | a bigger labour/skill chain; the koku flywheel **splits LINEAR → LAND / TREASURY / TRADE sub-engines** (decision #20, D-008, trade ≤⅓) where depth matters; **≥30-min floor** regression test goes live |
| **T1-M2** Arms rising | combat deepens — **2nd combat line + 3 T1 weapons**; **Arms 武威** deeds accrue | a real bandit-wall fight; the drill-yard training track; first martial **deed** → Arms pillar |
| **T1-M3** Two-pillar ascension | the **R15 capstone** → hybrid **1 GREAT + 1 EXCELLENT** across Estate+Arms → **T2 (Village)**; dream beat | the ascension story event + boon; un-grey the 2nd pillar |

---

# Tier T2 — Village (Asagiri) — *COARSE*

**Frame:** (was T1) the reputation **web** — chief, shops, artisans, inn & rumours; rival houses introduced;
**+Office 官威** pillar.

| Milestone | Headline | Example fun-slices |
|---|---|---|
| **T2-M1** Into the village | the rep web + rumours board + shops; village rungs; a real market | branching NPC **dialogue**; a yokai-debunk rumour quest; trade as a capped Estate sub-engine |
| **T2-M2** Office & territory | the **Office 官威** pillar; secure offices; the rival-house contest begins | a contested deed; cross-pillar combos surface |
| **T2-M3** Three-pillar ascension | hybrid gate across Estate+Arms+Office → **T3 (Region)**; dream beat | the ascension beat + boon; un-grey the 3rd pillar |

---

# Tier T3 — Region — *COARSE (v1 finish)*

**Frame:** (was T2) the wider canvas — region travel/sekisho, trade backbone, the **Origin** faction opens;
**+Name 家格** pillar; the **Otsuru/Tama origin payoff** (canon Region payoff); **v1 ends here** (`outcome:
t3done`).

| Milestone | Headline | Example fun-slices |
|---|---|---|
| **T3-M1** The wider canvas | region travel + sekisho + trade backbone; **Origin faction opens** | the Origin homecoming thread begins; a region-scale quest |
| **T3-M2** Name & the rivals dethroned | the **Name 家格** pillar; surpass the rival houses; the cross-pillar combos | the rival-house climax; the full 4-pillar board |
| **T3-M3** The origin payoff & v1 close | the **Otsuru/Tama truth** at Region; the four-pillar gate; the **bounded "v1 complete"** surface → free-play | the missable name-reclaim (Origin O5); the G6 payoff; the bounded ending + free-play |

---

## Cross-cutting (thread through every fun-slice, not a tier)

- **Diegetic-mentor onboarding** (decisions #22, #17, D-015): the in-world mentor introduced in **T0-M1-F3**
  recurs at every system unlock — teaching by dialogue/story, **never popups**. A T0 thread, deepened by the
  village/region cast at T1+.
- **DEV tools** (decision #16): the **2×/4×/8× speed toggle + jump-to-rung/tier teleport** ship in **T0-M1-F4**
  and stay available all tiers; DEV-only, stripped from prod. Defer richer dev affordances until a test needs one.
- **Save policy** (decisions #15, D-013a): **wipe dev/v0.2 saves on the reshape schema bump** (pre-launch, no
  users); build + test-cover the real `migrate()` path **before launch**, not across dev churn. D-013a
  forward-migration still governs shipped saves.
- **Operating-Model-v2-lite gates** (pending H10 sign-off): a **pre-commit `verify`** hook, a scoped
  **`playcheck` ratchet** in `verify` (4 wiring-proxies), and the **mandatory DIVERGE** contact-sheet on every
  new UI surface (decision #10) become **forward DoD contracts** on the fun-slices above.
- **PRD stays liquid** (decision #7): no §1 freeze; the PRD is split into per-section files (decision #6) and
  rippled in one batch, then re-tuned by playtest through T0→T3; converted to living docs only once v1 is
  **fully built + playtested**.
- **Acceptance gates extend, never regress:** each new tier extends **G-CURVE**; each new currency extends the
  **G-NO-DEAD-VALUES** ledger; each ascension extends the **migrate()** chain with a covering test.

---

## Resolved open questions (the proposal's original 6 — now CLOSED)

All six of this proposal's original open questions are resolved by the 2026-06-29 decision session.

| # | Original question | Resolution | Source |
|---|---|---|---|
| **OQ-1** | Milestone count (N per tier)? | **Keep 4 / 3 / 3 / 3** (T0=4, T1/T2/T3=3 each). No clearly-better cut found; reorder happens *within* T0's four. | delegated → agent call |
| **OQ-2** | Within-T0 order — spine-spike first or breadth first? | **SPINE-FIRST, thin.** Now embodied in the milestone order itself: **T0-M3 (spine, on minimal content) is built before T0-M4 (showcase breadth)**. | **decision #18** |
| **OQ-3** | Fun-slice granularity / grain? | **"One playable thing per fun-slice", ≈3–5 per milestone** — kept. | delegated → agent call |
| **OQ-4** | Shipped T0 — rebuild or carry forward? | **CARRY FORWARD + RETUNE.** M0–M2b is the kept, play-tested foundation; the reshape layers on top (NOT a rebuild). | **decision #19** |
| **OQ-5** | Naming — IDs or human-readable? | **Keep BOTH** — `T0-M3-F1`-style IDs *and* human-readable slice names. | delegated → agent call |
| **OQ-6** | T1 rung count? | **~8 rungs (≈R8→R15); ~16 estate rungs total.** | **D-052 + reshape** |

## NEW open questions for the human (raised by the resolutions)

These are *new* — surfaced by baking in the decisions above; none block starting the spine-first build.

1. **NQ-1 — Ceremony inside the thin spike.** Spine-first (#18) builds the T0→T1 ascension on *minimal*
   content, but the first ascension must **always land BIG** (#14). The proposal assumes the **full
   ceremonial polish** (title card, silhouettes-stir, music swell, dream beat) is part of **T0-M3-F3's DoD** —
   i.e. the spike isn't "done" until the first ascension lands big, even on thin content. Confirm, or land a
   *functional* ascension in M3 and apply the full ceremonial swell as a closing pass once M4's breadth exists
   to swell into?
2. **NQ-2 — Diegetic-mentor cast.** One recurring mentor (e.g. an estate elder) for all of T0, or a small
   cast split by domain (elder for estate/koku, **drillmaster Kihei** for arms/combat)? Affects the T0-M1-F3
   introduction and which character teaches which system. *(Agent's call per audit §6 — flagged for optional
   steer.)*
3. **NQ-3 — Walkable-map scope (#23 vs spine-first cadence).** The small walkable T0 map is the heaviest new
   T0 build and sits in **T0-M4-F4** so it can't crowd out the spine. If it still threatens cadence, options:
   (a) keep it minimal in M4 and grow it in T1 *(proposal's default)*; (b) split it into its own milestone
   (T0 → 5 milestones, breaking the 4/3/3/3 cut); (c) ship a bare room-graph in T0, real map at T1.
