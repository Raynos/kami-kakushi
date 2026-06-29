---
name: t0-m1-m2-rebaseline
description: Movement-1 (0a+0b) PRD-fidelity gap report — shipped T0-M1/M2 vs current roadmap DoD
metadata:
  type: audit
  movement: v0.3-part2-movement-1
---

# T0-M1/M2 re-baseline gap report (v0.3 Part-2, Movement 1)

> **What this is.** The Movement-1 *audit* deliverable (`path-to-v0.3` Part 2, steps 0a + 0b): is the shipped
> v0.2 T0-M1/M2 slice faithful to the **current** 6-tier PRD/roadmap DoD, or was it built against the older PRD
> with gaps / corner-cutting? Produced by a **21-agent source-code audit Workflow** (per-slice auditor +
> adversarial verifier + convergence critic — `wf_9a2f2c37-20a`) **plus** a headless **built-game** pass.
> Raw verbatim: [`../../brainstorms/raw/2026-06-29-t0-m1-m2-rebaseline-audit.json`](../../brainstorms/raw/2026-06-29-t0-m1-m2-rebaseline-audit.json).

## Movement-1 scope delineation (what 0c re-implements vs what M2/M3 build)

The backlog below mixes two kinds of 🟡/🔴. **Read it through this filter** (the report's own ADR tags make the cut):

- **TRUE re-baseline gaps → fixed in Movement 1 (step 0c):** P1 HP-carry (D-050), P2 no-stance-dominated, P3
  found/crafted 2nd weapon (D-052), P4 no-stranding bug (D-061 — *property violated 8/8 seeds*, not just
  untested), P7 mentor/dialogue (D-039/D-063), P8 SFX juice + DEV speed toggle (D-068/D-067), P9 touch-legible
  wear axis, P10 the one-line roadmap wording reconcile. These are things the v0.2 slice got **wrong or lazy**
  against contracts that were already in force.
- **EXPECTED v0.3 mutation targets → built in their own movement, NOT Movement 1:** P5 yield-bearing estate
  flywheel = **T0-M4-F2** (Movement 3); P6 `influence:{value,highWater}` + D-055 silhouette reshape =
  **T0-M3-F1** (Movement 2 spine); jump-to-**tier** teleport is blocked by the 6-tier model (Movement 2). The
  report tags each "code application PENDING" — these are not regressions, they are the spine/breadth the v0.2
  teaser was always going to grow into.

**Net:** the foundation carries forward clean (27 🟢); Movement 1 re-implements ~8 priority clusters; the rest
fold naturally into Movements 2–3.

---

## TL;DR

The shipped T0-M1/M2 slice is **PRD-faithful on its foundation but not on its spine**: the cold-open hook, the rake→koku labour loop, the AND-gated rank ladder, G-NO-DEAD-VALUES, and the combat-goes-live @R3 layer (the 20–35% first-fight band + DISPLAYED==TESTED) are all genuinely built, test-backed, and survive adversarial re-read (M1-F1 and M2-F1 are **clean**). But every spine-critical and combat-correctness contract is unmet: HP-carry/heal-by-eating (D-050) is effectively absent, the 2nd weapon is still a Lv2 *grant* not a found/crafted loop (D-052), the no-stance-dominated invariant doesn't exist (the dominance test is still enshrined), the estate sink is power-neutral (doesn't compound), and the mentor/dialogue + juice/SFX layers are wholly unbuilt — though a large share of the reds are **EXPECTED v0.3 mutation targets** (dialogue, influence backing state, yield-bearing estate, 6-tier teleport) with their ADRs flagged "code application PENDING," not regressions. **Headline counts across 51 DoD lines: 🟢 27 green / 🟡 10 yellow / 🔴 14 red.** No line hard-conflicts between auditor and verifier; the only disagreements (T0-M2-F2 lines 1–2) resolve cleanly to the verifier because the auditor supplied placeholder stubs — so there are **zero ⚠️ NEEDS-HUMAN lines**.

## Tally

| Slice | Verdict | 🟢 | 🟡 | 🔴 |
|---|---|---|---|---|
| T0-M1-F1 — Cold open & first rake | clean | 4 | 0 | 0 |
| T0-M1-F2 — Labour loop + estate inks in (R0→R2) | minor-gaps | 3 | 1 | 0 |
| T0-M1-F3 — Meet your mentor (diegetic onboarding) | major-gaps | 1 | 1 | 2 |
| T0-M1-F4 — Juice + dev-tools pass | major-gaps | 2 | 1 | 6 |
| T0-M2-F1 — Grain-store wolf, combat goes live @R3 | clean | 3 | 0 | 0 |
| T0-M2-F2 — Durability bite + 2nd weapon (found/crafted) | major-gaps | 2 | 0 | 2 |
| T0-M2-F3 — Combat becomes a real decision (HP-carry) | major-gaps | 1 | 4 | 2 |
| T0-M2-F4 — Keep the bite, within guardrails | major-gaps | 5 | 0 | 1 |
| T0-BASE-Influence — House-Influence teaser panel | minor-gaps | 2 | 2 | 1 |
| T0-BASE-Economy — Economy sinks | major-gaps | 4 | 1 | 0 |
| **Total** | | **27** | **10** | **14** |

## Per-slice findings

### T0-M1-F1 — Cold open & first rake

| Requirement | Status | Evidence (file:line) | Gap / fix |
|---|---|---|---|
| First-interactable < 5s (§6 / §3 hook) | 🟢 | Cold-open card + "Open your eyes" button built in `mount()` `src/ui/render.ts:404-416`, click→`open_eyes` :414, shown until `awake` :978-985; system-serif fallback `styles.css:80` / `font-display:swap`. Gate has teeth: `src/playcheck.ts:34` (cap 5000), :127-128 RED, baseline 480; RED-at-9000 proven `playcheck.test.ts:20-22` | None blocking. Two evidence imprecisions (verifier): the gate is **synthetic** (`playcheck.ts:93` firstActionMs = intents×AUTO_REPEAT_MS, not real paint), and the card paints **after** `await save.load()` (IndexedDB) in async `boot()` — not literally synchronous-at-body-parse. Honest own-it: add a real first-paint E2E timing gate |
| rake → koku ticks → log line | 🟢 | `src/core/intents.ts:97-107` rake_rice: `withResource(koku,+3)`, `adjustSatiety`, `rakeLine(3)`+`raked` flag, clock advance; `RICE_PER_RAKE=3` `balance.ts:22`; mode-guarded :98; proven `engine.test.ts:40-49` & no-op pre-awake :51-53 | — |
| Woodblock cold-open hook plays | 🟢 | Title card `render.ts:67-70`, rendered :404-416; `.coldopen` woodblock CSS `styles.css:477-498`; `open_eyes` `intents.ts:84-95` sets awake + 3 narration lines, `revealPass` latches readout-body/rice → 5 lines; `engine.test.ts:28-38` | — |
| Log cascades in (newest at bottom) | 🟢 | `render.ts:879-882` appendLine appends newest-at-bottom + auto-scroll; staggered cascade via revealQueue/pumpReveal `LOG_STAGGER_MS=240` :884-893, fresh batch :941; `firstRender` forced false on pre-awake early-return :981 so the post-wake 5-line batch hits the cascade branch | — |

### T0-M1-F2 — Labour loop + estate inks in (R0→R2)

| Requirement | Status | Evidence (file:line) | Gap / fix |
|---|---|---|---|
| R0→R2 genuine AND-gate (meter ∧ story milestone), §4.1.1 | 🟢 | `src/core/ranks.ts:45` `gateOpen = next.rungMeter >= threshold && rank.storyGate(next.flags)`; thresholds `balance.ts:62` {14,30,48}; R1 storyGate `content/ranks.ts:51` `f['farmed']` set only by farm_paddy `intents.ts:136` while meter also fed by haul_stores → haul-only held at R1; tests `m1.test.ts:43-73` | Minor (non-blocking): R0→R1 story half is tautological (`content/ranks.ts:41` `()=>true`); no test pins the haul-only-no-farm block; `rungProgress` collapses both halves into one `ready` bool |
| Reveal stagger — nav/rooms ink in one-per-beat via write-once latch | 🟡 | Latch correct/idempotent `unlock.ts:19-30`, but `rewards.ts:33-35` latches the whole `unlock:[]` array in **one** reduce — `content/ranks.ts:54-62` = 7 surfaces @R1, :82-92 = 9 @R2, all same beat. Verifier **strengthened** the gap: the auditor's "drip one beat later" examples (panel-estate, verb-cook) actually resolve in the *same* revealPass (keying surface latched by the reward, earlier in registry order `surfaces.ts:64<68`, `127<128`) | Not a code defect — PRD **superseded** the one-per-beat queue (`06-tech-architecture.md:308-312`, :149). Wording lag only: reconcile roadmap DoD `roadmap.md:97` to "reveal-per-promotion (design-staggered schedule)" |
| G-NO-DEAD-VALUES — every produced value has a consumer | 🟢 | Real consumers: koku→improve_estate `intents.ts:211-221`, wood→repair `intents.ts:170-184`, sansai→cook `intents.ts:194-209`, skills→`skillYieldNum` `skills.ts:53`, conditioning→danger-ring gate `selectors.ts:92,107`; ratchet `integrity.test.ts:22-61`, EXPECTED_INERT empty :53; proofs `economy.test.ts:55-141` | Forward-contract temporal note (holds): within R0→R2 wood has no *live* sink (repair reachable at R3), but the consumer exists one rung later |
| Labour loop — numbers climb | 🟢 | `intents.ts:97-145` ascending yields, never-zero throttle `Math.max(1,…)` :119-131, skill XP, meter `+2/act`; `m1.test.ts:43-66` + never-zero `:97-113`; yields strictly climb capped ×3 `economy.test.ts:55-70` | — |

### T0-M1-F3 — Meet your mentor (diegetic onboarding opens)

| Requirement | Status | Evidence (file:line) | Gap / fix |
|---|---|---|---|
| Mentor GENEMON greets you and teaches the labour loop as story | 🟡 | `names.ts:11` `elder:'Genemon'` (name only); wired as R1/R2 `granter` `content/ranks.ts:48,76`, his only voiced lines are embedded milestone strings in `rewardOnReach.log[]` :66,96 — rank-up reward narration, not a greet-and-teach beat. Cold-open onboarding voice is the **physician Sōan**, not Genemon `coldOpen.ts:10`. **Verifier correction:** the auditor's claim that his R1 line fires only after `farmed` is wrong — `f['farmed']` (`content/ranks.ts:51`) gates *exit* R1→R2, not entry; his first line fires on raking alone | Author a Genemon greet-and-teach beat at R0/game-start, delivered via the data-not-script dialogue system (next line), not as a rank reward. D-063 |
| Dialogue is DATA-NOT-SCRIPT (speaker + lines, deterministic) | 🔴 | No dialogue system: `state.ts:5` explicitly **defers** it; GameState `state.ts:56-89` has no dialogue field; grep `choices/lineId/speaker/conversation` → 0; `log.ts:9` channels have no speaker concept; all speech baked into `rewardOnReach.log[]` strings | Add `src/core/content/dialogue.ts` (speaker id from NAMES, ordered lines, optional flag gating) + deterministic cursor; route Genemon's onboarding through it. D-039 |
| Teaches by reveal-as-plot, NON-HAND-HOLDY — no hint popups | 🟢 | No tutorial/hint popups anywhere; "hint" hits are stance glosses / descriptive labels / a11y `aria-haspopup`; teaching is pure log narration `log.ts:9` | Green only on the **negative** no-popup constraint; the positive "mentor teaches" clause is unmet (lines 1–2 absent). New dialogue work must preserve this discipline. D-015 |
| DIVERGE on the dialogue panel (D-073) | 🔴 | No dialogue panel/surface to diverge on (`surfaces.ts` SurfaceKind has no dialog kind); no diverge branch/screenshots; roadmap still marks F3 🆕 `roadmap.md:98` | Gated on lines 1–2: once a dialogue panel surface exists, run diverge (2–3 variants → contact sheet → self-pick + R-item) before ship. D-073 |

### T0-M1-F4 — Juice + dev-tools pass (minimal SFX + speed/teleport)

| Requirement | Status | Evidence (file:line) | Gap / fix |
|---|---|---|---|
| Traditional-palette Web-Audio SFX module (taiko/shamisen/shakuhachi/bell), reduced-motion + mute-safe | 🔴 | Repo-wide audio grep → **0 hits**; no AudioContext/oscillator, no audio deps, no audio assets, no mute control; only "audio"-adjacent hit is `prefers-reduced-motion` (visual) | Add `src/ui/sfx.ts` (lazy AudioContext + synth voices, mute flag, reduced-motion-aware). New subsystem. DS#2/D-068, D-041 |
| Per-deed hit cue | 🔴 | No audio call site; visual number-pop `render.ts:803` exists but is silent | Fire a hit voice from the deed dispatch path once sfx.ts exists. DS#2/D-068 |
| Koku tally-flash cue | 🔴 | Visual `@keyframes tally-flash` `styles.css:452` + `flashTally` `render.ts:874` exist; no audio alongside | Hook a reward voice into `flashTally()`. DS#2/D-068 |
| Rank-up flourish cue (temple-bell/鈴) | 🔴 | Visual `.rankup-seal` `styles.css:867` + `showRankUp` `render.ts:957` exist; emit no sound | Add a temple-bell voice fired from `showRankUp()`. DS#2/D-068 |
| DEV 2×/4×/8× speed toggle (time multiplier, prod-stripped) | 🔴 | Live loop fixed `setInterval(…, AUTO_REPEAT_MS)` `main.ts:189/230`, `AUTO_REPEAT_MS=480` `balance.ts:77`; no `__qa.speed()`, no multiplier, no UI control | Add DEV-only `__qa.speed(mult)` scaling the cadence inside the `import.meta.env.DEV` block. D-056/D-067 |
| DEV jump-to-RUNG teleport | 🟡 | `__qa.toRung(id)` `main.ts:254-280` inside DEV gate :247, but its own comment calls it "greedy time-compression" — replays up to 8000 real intents with a `break` :277, can silently under-shoot. Not the D-067 state-jump | Keep as convenience but return reached-or-not; add a true state-jump that sets rung/derived state directly. Predates this 🆕 slice. D-067 |
| DEV jump-to-TIER teleport | 🔴 | No tier system: `__qa.selectors.tier` hardcoded `()=>0` `main.ts:341`, every rank `tier:0` `ranks.ts:16…`; grep `toTier` → 0 | Blocked by the absent 6-tier model (still in doc-ripple); add alongside the rung teleport when tiers land. D-067 |
| Dev tools gated OUT of production | 🟢 | Whole `__qa` API wrapped in `if (import.meta.env.DEV){…}` `main.ts:247-347`, `window.__qa` assigned only inside :346; Vite DCE strips it; no leak found | — |
| DIVERGE if any new UI surface introduced (D-073) | 🟢 (N-A) | No new surface shipped (no mute control, no on-screen speed widget) → diverge correctly not triggered; verifier flags the auditor's "missing" label as a **vacuous N-A**, not a skipped-diverge defect | Conditional: when the speed toggle / mute control ships as an on-screen control it becomes a new surface and **must** run diverge first. D-073 |

### T0-M2-F1 — Grain-store wolf, combat goes live @R3

| Requirement | Status | Evidence (file:line) | Gap / fix |
|---|---|---|---|
| First-fight 20–35% win-rate band (D-058) | 🟢 | Live recompute: monkey@L1 sampled = **0.320** ∈ [0.20,0.35] (robust at cold-open satiety 0.26 too); band consts `balance.ts:187-188`; RED-able `m2.test.ts:44-48`; namesake wolf is a guaranteed-survival scripted beat `fight.ts:121-142`, `enemies.ts:21-31`. 20/20 tests pass | None for DoD. **Verifier correction (evidence only):** auditor's "analytic cross-check 0.306 agrees" is wrong — analytic(monkey@L1)=0.4474 (outside band); 0.306 is the bandit@L5 analytic they conflated. Verdict unchanged because the band is defined on the **sampled** forecast |
| G-CURVE — graded win-rate, not all-or-nothing | 🟢 | Per-swing damage spread `combat.ts:164-166` `SPREAD_LO=0.55/SPAN=0.9` (~±45%); re-sampled curve smooth (monkey .32/.67/.88, wolf .05/.26/.56/.83, boar/bandit graded); guard tests `m2.test.ts:50-72,94-98` | — |
| DISPLAYED==TESTED — fixed-seed; analytic-gate/sampled-display split | 🟢 | One shared estimator `foeForecasts` `combat.ts:219-230` with internal `FORECAST_SEED`/`SAMPLES=400`; display `render.ts:761,777`, tests `m2.test.ts:31-35`, gate `playcheck.ts:104` all call it; empirically seed-invariant (0.3200 across run seeds 1/42/12345) | Forward-contract note: `analyticWinRate` has no production/gate caller ("kept for the M6 gate") — correct for a T0 slice |

### T0-M2-F2 — Durability bite + 2nd weapon (found/crafted)

*Auditor row was a placeholder stub ("test" dodLines); lines 1–2 resolved on the verifier's independent file:line evidence (no hard-conflict — auditor supplied no evidence).*

| Requirement | Status | Evidence (file:line) | Gap / fix |
|---|---|---|---|
| Graded 4-band durability (attack penalty across bands) | 🟢 | `balance.ts:144-150` 4 bands {1.0/0.9/0.75/0.55}; `combat.ts:90-97` `durabilityBand()`; `combat.ts:103,110` `band.mult` multiplies baseAtk (load-bearing); wear real `fight.ts:31-38`; tested `m2.test.ts:154-157` | — (auditor placeholder said "missing"; refuted by verifier) |
| Repair wood-sink (spend wood → restore durability) | 🟢 | `intents.ts:170-184` gates wood≥5, restores to durabilityMax; `REPAIR_WOOD_COST=5` `balance.ts:152`; wood gathered `activities.ts:52-56`; verb-repair unlocked @R3 `content/ranks.ts:122`, button `render.ts:721-725` | — (auditor placeholder said "missing"; refuted by verifier) |
| 2nd weapon must be FOUND/CRAFTED via loot→craft, RETIRING the Lv2 grant (D-052) | 🔴 | `fight.ts:63-75` still **grants** the axe at combat L≥2 + force-unlocks verb-equip-axe; surface predicate `()=>false` `surfaces.ts:159` so the grant is the only path; Intent union `intents.ts:42-55` has no craft intent; enemies carry no material drops; D-061 `decisions.md:442` "code application PENDING", D-052 `decisions.md:454` | Retire the grant; add a craft intent + material loot → loot→craft loop. The slice's namesake feature, unbuilt. D-052 |
| DIVERGE on the craft panel | 🔴 | No craft panel (0 "craft" in render.ts, no craft surface), no diverge branch/screenshots | Vacuously absent — gated on the craft loop existing. D-073 |

### T0-M2-F3 — Combat becomes a real decision (HP-carry)

| Requirement | Status | Evidence (file:line) | Gap / fix |
|---|---|---|---|
| HP CARRIES between fights — combat reads `state.character.hp`, not hpMax | 🟡 | `combat.ts:115` `hp: hpMax(state)` — always seeds at FULL HP; `c.hp` never read (only might/guard :113-114); win persists `mcHpLeft` `fight.ts:88` but it's discarded next fight (write-only/cosmetic) | Change `combat.ts:115` to `hp: clamp(state.character.hp,0,hpMax(state))` so carried HP is the real starting HP. D-050 |
| Combat must NOT reset HP to hpMax on win/loss | 🟡 | Loss fully resets `fight.ts:112-115` (`hp:hpMax`+`satiety:satietyMax` = free full heal); level-up heals `fight.ts:54`. **Verifier found a THIRD reset:** rank promotion `ranks.ts:51-54` also full-heals hp+satiety | Delete the loss-branch `hp:hpMax` (leave HP at SETBACK_HP floor); re-evaluate the level-up `fight.ts:54` **and** promotion `ranks.ts:53` full-heals against D-050 |
| HP heals ONLY by EATING; auto-loop recovers via eat | 🔴 | No eat→HP path: every food/rest verb touches **satiety only** (`rest` `intents.ts:111`, `cook_meal` :198-199); auto-loop "recover" dispatches `rest` (satiety) `main.ts:194-197`; HP writes only init/combat/promotion/clamp | Add an eat/cook action that restores `character.hp` (gated on food/satiety) and route the auto-loop low-HP recovery through it. D-050 |
| NO-STANCE-DOMINATED curve test (replace the dominance-enshrining test) | 🟡 | Dominance test STILL present `m2.test.ts:119-123` (asserts jodan−chudan ≥ 0.08); grep `dominat` → 0. A **partial** wear-cost trade IS tested `m2.test.ts:125-144` | Replace :119-123 with a "no single stance strictly dominates across win-rate × wear × HP-retention" invariant. D-058/D-050 |
| Touch-legible wear axis (per-stance cost readable without hover) | 🟡 | Wear cost lives only in a hover `title` `render.ts:753` (qualitative "spare/wear the blade", never numeric 3/2/1); buttons show kanji+gloss `render.ts:750`; durability readout is current state, not per-stance cost | Render per-stance wear cost (3/2/1) as visible text/pips on the stance control `render.ts:744-757`. D-050 |
| Stance/training reveal beat | 🟢 | `surfaces.ts:152-153` reveal line ("The drill yard opens to you…") + R3 reward narration `ranks.ts:118-128`; training pane `render.ts:670-702`, stance control :744-757, both R3-gated | — |
| Combat SFX | 🔴 | Repo-wide audio search → 0 code + 0 assets; combat paths emit only text log lines `fight.ts:91-96` | Add a combat SFX layer (swing/hit/win/loss) once sfx.ts exists. D-050 |

### T0-M2-F4 — Keep the bite, within guardrails

| Requirement | Status | Evidence (file:line) | Gap / fix |
|---|---|---|---|
| Do NOT smooth the durability/satiety bite (D-061) | 🟢 | Durability bands + wear intact `balance.ts:144-150` → `combat.ts:103,112`; satiety throttle `combat.ts:83-88`; constants unchanged "provisional (v0.2)". Bite is real (in fact **sharper** than the guardrail allows) | — |
| Guardrail: winnable — every checkpoint has a nonzero path | 🟢 | `m2.test.ts:50-56` no ALL-dead/ALL-trivial tier; floors `combat.ts:112` `Math.max(1,…)` + clamp ≥0.02 :150; monkey@L1 ~0.32 anchors | — |
| Guardrail: soft-setback-only | 🟢 | Loss branch `fight.ts:100-116`: HP→SETBACK_HP, forced rest, nothing else; mechanism correct | Verifier note: the **cited** test `m2.test.ts:175-181` doesn't actually exercise the loss path (single possibly-winning fight, only asserts xp/level non-decreasing); real coverage is `m2.test.ts:183-193`. Code green; the named test is mislabeled/weak |
| Guardrail: no permanent loss (level/XP/gear/Influence) | 🟢 | Loss branch never touches level/combatXp/weapon/influence; `m2.test.ts:183-193` 20 bandit fights assert monotonic level+XP, HP≥0 | — |
| Guardrail: no dead-ends — Broken player can always recover | 🟢 | woodcut_edge→repair (no unlock gate) `activities.ts:51-60` + `intents.ts:170-184`; app-layer auto-stop `main.ts:200-213` | Add a pure-core test asserting Broken-no-wood → repaired via woodcut→repair (no automated recoverability test today; auto-stop is app-layer) |
| KEEP "fresh-L1-no-wood reaches L2 before Broken" no-stranding test | 🔴 | Test **never existed** (git -S over every revision of *.test.ts empty) AND property is **violated**: real-core sim (monkey, fresh L1, satiety 100, wood 0) strands at Broken before L2 on **8/8 seeds** at default chudan (verifier; auditor 7/8) | (1) Author the invariant in `m2.test.ts`; (2) retune the bite (raise `carrying_pole.durabilityMax` / lower `DURABILITY_WEAR_PER_FIGHT` / shrink first-rung XP gap / seed a small wood buffer) so the property holds. The slice's named acceptance bar. D-061 |

### T0-BASE-Influence — House-Influence teaser panel (pre-spine baseline)

| Requirement | Status | Evidence (file:line) | Gap / fix |
|---|---|---|---|
| renderHouseInfluence renders the greyed 家威 macro teaser | 🟢 | `render.ts:513-546` card + aria-label + 家威 header + pillar rows + lock foot; lock CSS real `styles.css:955-982` | — (D-047 v0.2 scope) |
| Panel visibility gated on real GameState | 🟢 | `render.ts:515-517` show = `isUnlocked(state,'panel-house-influence')` reads write-once `state.unlocked` `unlock.ts:10-12`; revealed via R3 reward `ranks.ts:118-124`→`rewards.ts:33-34`; starts hidden; `m2.test.ts:245-250` | — |
| Classify panel CONTENT: state-derived vs cosmetic-static | 🟡 | **Cosmetic-static**: `state` arg used at exactly `render.ts:515` (gate) and nowhere in the content loop; rows come from module const `PILLARS` `render.ts:73-78`; grep finds no pillar value in core | **EXPECTED** baseline (static by design — the locked teaser). v0.3 fix (T0-M3-F1): wire the Estate pillar row to a live `influence` value + live Estate bar. D-055 |
| Conformance to D-055 (active pillar + locked UNNAMED silhouettes) | 🟡 | Build shows ALL FOUR pillars **named**+greyed `render.ts:73-78` — the option D-055 explicitly **rejected**; `decisions.md:460-466` "application PENDING" | **EXPECTED** baseline delta (this slice predates D-055). v0.3 mutation (`roadmap.md:113`): un-name 3 pillars into silhouettes, promote Estate to the single active pillar with a live bar. D-055 |
| Backing state `influence:{value,highWater}` exists | 🔴 | Absent: grep over `state.ts`/`selectors.ts` → nothing; GameState `state.ts:56-89` + `createInitialState` :91-125 carry no influence field; only estateStage/rung/rungMeter exist (read by the *separate* `renderEstate`) | **EXPECTED** — Movement-2 (T0-M3-F1 `roadmap.md:113`) adds `influence:{value,highWater}` to GameState + wires the Estate pillar row to it. D-055 |

### T0-BASE-Economy — Economy sinks (improve_estate / cook_meal / spend_attribute)

| Requirement | Status | Evidence (file:line) | Gap / fix |
|---|---|---|---|
| improve_estate is a guarded koku sink (E0→E3, no-op guards) | 🟢 | `intents.ts:211-221` guards panel/cost/maxed, `withResource(koku,-cost)`, advances estateStage; `ESTATE_STAGES` `content/estate.ts:17-45` (100/300/700); tested `economy.test.ts:123-153` | — |
| The koku→estate sink actually COMPOUNDS (upgrade RAISES yield) | 🟡 | Does NOT compound: a stage grants ONLY `satietyMaxBonus` (`estate.ts:3` self-labels "curve-NEUTRAL soft-pacing buffer"); staminaRate caps at 1.0 `selectors.ts:75` so per-act yield is byte-identical across stages `intents.ts:127`; `grep estate` over fight/combat/skills/rewards → 0. This is the "finite, power-neutral estate (v0.2)" D-051 set out to replace | **EXPECTED/PENDING** (D-051 `decisions.md:430-434` + D-066 `decisions.md:574` both "code application PENDING"; `roadmap.md:122` T0-M4-F2). Fix: add a `yieldBonusNum`/per-stage output multiplier to EstateStageDef and apply it in the do_activity yield loop `intents.ts:124-131`. (Verifier: a case for 🔴 exists since the yield mechanic is wholly absent; 🟡 is the more precise label — the sink IS built, just to the older power-neutral spec.) D-051/D-066 |
| cook_meal is a sansai→satiety sink that feeds back | 🟢 | `intents.ts:194-209` spends sansai, +40 satiety (clamped), clock tick; feedback real (satiety→staminaRate→yield); cook +40 vs free rest +18 at equal tick cost (`balance.ts:216/:24`) so not dominated; `economy.test.ts:103-120` | — |
| spend_attribute is an attributePoints→combat-stat sink that feeds back | 🟢 | `intents.ts:222-241` +1 might/guard/vigor; consumers `combat.ts:111-114`, `selectors.ts:31`; loop: level-up grants points `fight.ts:45-52`, win grants koku :89-90; `economy.test.ts:161-189` | — |
| G-NO-DEAD-VALUES forward contract | 🟢 | `integrity.test.ts:22-75` ledgers every surfaced currency/skill/attribute to a consumer, EXPECTED_INERT empty :53 | Caveat (masks line 2): the ratchet asserts a consumer **exists**, not that koku's consumer **compounds** — structurally blind to the power-neutral gap. Consider a curve test asserting estate stage raises labour output once line 2 is fixed |

## Prioritized re-implementation backlog (Movement-1 step 0c)

*Ordered: spine-blocking + combat-correctness first. Only 🟡/🔴 lines appear here.*

### Priority 1 — HP-carry spine (T0-M2-F3, D-050) — combat correctness *[roadmap 🔧 NEEDS-REWORK; headline Part-2 re-baseline item]*
1. **Make HP carry between fights** — change `src/core/combat.ts:115` from `hp: hpMax(state)` to `hp: clamp(state.character.hp, 0, hpMax(state))` so `mcHpLeft` (`fight.ts:88`) becomes load-bearing. *DoD: D-050.*
2. **Stop free full-heals** — delete the loss-branch `hp:hpMax`/`satiety:satietyMax` reset (`fight.ts:112-115`); re-evaluate the level-up heal (`fight.ts:54`) **and the verifier-found third heal at rank promotion** (`ranks.ts:51-54`). *DoD: D-050.*
3. **Add the eat→HP path** — new eat/cook action that restores `character.hp` (gated on food/satiety) in `src/core/intents.ts`, and route the `main.ts:194-197` low-HP auto-recovery through it. *DoD: D-050.*

### Priority 2 — No-stance-dominated invariant (T0-M2-F3) — combat correctness
4. **Replace the dominance test** — delete `m2.test.ts:119-123` (asserts jodan strictly out-win-rates chudan); author a "no single stance strictly dominates across win-rate × durability-wear × HP-retention" invariant (the `m2.test.ts:125-144` wear-cost trade is a partial start). *DoD: D-058/D-050.*

### Priority 3 — Found/crafted 2nd weapon (T0-M2-F2, D-052) — spine *[roadmap ✅/🔧; D-052/D-061 "code application PENDING"]*
5. **Retire the Lv2 axe grant → loot→craft loop** — remove the grant at `fight.ts:63-75`; add a craft intent to the `intents.ts:42-55` Intent union + material loot from foes (`enemies.ts`); the equip surface predicate `surfaces.ts:159` (`()=>false`) becomes craft-driven. *DoD: D-052.*
6. **DIVERGE on the new craft panel** — once the craft surface exists, run diverge (2–3 variants → contact sheet → self-pick + R-item) before ship. *DoD: D-073.*

### Priority 4 — No-stranding guardrail (T0-M2-F4, D-061) — combat correctness
7. **Author the no-stranding invariant + retune** — add the "fresh-L1 / wood=0 / default-stance grind reaches L2 before Broken" test to `m2.test.ts` (currently RED — strands 8/8 seeds), then retune the bite (raise `carrying_pole.durabilityMax`, lower `DURABILITY_WEAR_PER_FIGHT` `balance.ts:150`, shrink the first-rung XP gap, or seed a small starting wood buffer) so the property holds inside the guardrail. *DoD: D-061.* (Also add the pure-core Broken-no-wood recoverability test flagged on line 5.)

### Priority 5 — Yield-bearing estate flywheel (T0-BASE-Economy, line 2) — spine *[specced as Part-2 build step: roadmap T0-M4-F2 `roadmap.md:122`; D-051/D-066 "code application PENDING"]*
8. **Make improve_estate compound** — add a `yieldBonusNum`/per-stage output multiplier to `EstateStageDef` (`content/estate.ts`) and apply it in the do_activity yield loop (`intents.ts:124-131`) so a higher stage linearly raises labour output (work→koku→upgrade→more koku). Add a curve test asserting estate stage raises yield. *DoD: D-051/D-066.*

### Priority 6 — Influence backing state + D-055 reshape (T0-BASE-Influence, lines 3–5) — spine *[specced as Part-2 build step: roadmap T0-M3-F1 `roadmap.md:113`; D-055 "application PENDING"]*
9. **Add `influence:{value,highWater}` to GameState** (`state.ts:56-125`) + `createInitialState`. *DoD: D-055 / T0-M3-F1.*
10. **Reshape the teaser to D-055** — un-name 3 of the 4 pillars into unnamed silhouettes, promote Estate 家産 to the single active pillar, wire its row + a live Estate bar to `influence.value` (replace the static `PILLARS` content `render.ts:73-78`). *DoD: D-055.*

### Priority 7 — Mentor / dialogue system (T0-M1-F3, lines 1,2,4)
11. **Add a data-not-script dialogue module** — `src/core/content/dialogue.ts` (speaker id from NAMES, ordered lines, optional flag gating) + a deterministic state cursor. *DoD: D-039.*
12. **Author Genemon's greet-and-teach beat** at R0/game-start (introduce rake→koku as plot), delivered via the dialogue module, not as a rank reward. *DoD: D-063.*
13. **DIVERGE on the dialogue panel** once it exists. *DoD: D-073.*

### Priority 8 — Juice + dev-tools (T0-M1-F4, lines 1–5,7,6)
14. **Build `src/ui/sfx.ts`** (lazy AudioContext, taiko/shamisen/shakuhachi/temple-bell voices, mute flag, reduced-motion-aware). *DoD: DS#2/D-068, D-041.*
15. **Wire the 3 cues** to existing silent visual hook points: per-deed hit (deed dispatch), koku tally (`flashTally` `render.ts:874`), rank-up temple-bell (`showRankUp` `render.ts:957`). *DoD: DS#2/D-068.*
16. **Add DEV `__qa.speed(mult)`** time multiplier inside the `import.meta.env.DEV` block (loop is fixed at `AUTO_REPEAT_MS` `main.ts:189/230`). *DoD: D-056/D-067.*
17. **Upgrade jump-to-rung to a true state-jump** (`__qa.toRung` `main.ts:254-280` currently greedy intent-replay; have it return reached-or-not) and **add jump-to-tier** once the 6-tier model lands (`tier` hardcoded `()=>0`). *DoD: D-067.* (Run diverge if the speed/mute toggle ships as an on-screen surface.)

### Priority 9 — Touch-legible wear axis (T0-M2-F3, line 5)
18. **Render per-stance wear cost (3/2/1)** as visible text/pips on the stance control (`render.ts:744-757`), not only a hover `title` (`render.ts:753`). *DoD: D-050.*

### Priority 10 — Doc wording reconcile (T0-M1-F2, line 2)
19. **Reconcile the roadmap DoD** `roadmap.md:97` from "nav/rooms reveal one-per-beat" to "reveal-per-promotion (design-staggered schedule)" — code already matches the superseding PRD (`06-tech-architecture.md:308-312`). One-line docs fix, not a code change. *DoD: PRD §6.2 / FU4.*

## What carries forward clean (🟢 — out of Movement-1 re-impl scope)

- **T0-M1-F1 (all 4):** cold-open card + <5s interactable, rake→koku→log line, woodblock cold-open sequence, log cascade newest-at-bottom. (Caveat to track, not re-do: the <5s target is only synthetically gated — a real first-paint E2E gate is a future nicety.)
- **T0-M1-F2 (3):** AND-gated R0→R2 promotion (`ranks.ts:45`), G-NO-DEAD-VALUES ledger + consumers, ascending labour-loop numbers.
- **T0-M1-F3 (1):** the D-015 no-hint-popup / reveal-as-plot discipline (carry forward; new dialogue work must preserve it).
- **T0-M1-F4 (2):** DEV play-API fully prod-stripped (`import.meta.env.DEV` gate, no leak); DIVERGE correctly not triggered (vacuous N-A).
- **T0-M2-F1 (all 3):** the signed 20–35% first-fight band (monkey@L1=0.320), graded G-CURVE, DISPLAYED==TESTED single shared estimator.
- **T0-M2-F2 (2):** graded 4-band durability (load-bearing attack multiplier) + the repair wood-sink.
- **T0-M2-F3 (1):** the R3 stance/training reveal beat.
- **T0-M2-F4 (5):** all four guardrails (winnable / soft-setback-only / no-permanent-loss / no-dead-end) + the un-smoothed bite. (Only the named no-stranding test/property is red.)
- **T0-BASE-Influence (2):** the teaser DOM + lock CSS, and the state-derived R3 visibility gate.
- **T0-BASE-Economy (4):** improve_estate koku sink (exists/guarded), cook_meal sansai→satiety sink, spend_attribute combat-stat sink, the G-NO-DEAD-VALUES forward contract. (Only the *compounding* property of the estate sink is yellow.)

## Open questions for the built-game audit (step 0b)

A source audit confirms *what the code does*; it cannot confirm *how it feels at human speed*. Drive the running game headlessly and check:

1. **Does the first fight actually FEEL humbling-but-winnable?** Source proves monkey@L1 sampled = 0.320 in band, but is the *displayed* forecast legible to the player, and does a real ~32%-WR fight read as a tense earned win rather than a coin-flip or a wall? (M2-F1)
2. **Does the broken-weapon detour feel humbling or punishing?** The no-stranding property is RED (strands 8/8 seeds before L2); even with the `main.ts` auto-stop, does a fresh run *experientially* hit a "monkey unwinnable until you woodcut" dead-feeling stretch? Confirm by playing a fresh L1 run to L2. (M2-F4)
3. **Does onboarding read as story without a mentor?** The mentor/dialogue system is unbuilt — Genemon is a post-hoc rank-reward voice, teaching is general narration. Does the cold open + log narration actually *teach the rake→koku loop diegetically*, or does it read as unexplained? (M1-F3)
4. **Does the log cascade read as a story at real speed?** Source confirms staggered reveal (240ms); does the post-wake 5-line cascade and the 7-/9-surface promotion **batch-dump** feel like an intentional reveal or an overwhelming wall? (M1-F1, M1-F2)
5. **Does juice fire — and is its absence felt?** No SFX exist; only visual number-pop / tally-flash / rank-up-seal. Capture whether the silent deeds/rank-ups feel flat, to scope the SFX work. (M1-F4)
6. **Is the real first-interactable <5s?** The gate is synthetic (intents×cadence); measure actual page-paint-to-button-clickable latency in a real browser (the card paints after an `await save.load()` IndexedDB read). (M1-F1)
7. **Does the power-neutral estate feel like a dead reinvestment?** Source proves estate upgrades don't raise yield. Play through E0→E3 and observe whether spending koku on the estate *feels* rewarding or inert (the experiential half of the compounding gap). (Economy)
8. **Do the stances feel genuinely non-dominated?** Even before the invariant test lands, drive combat at each stance/HP/satiety state and observe whether jodan/chudan/gedan present a *felt* trade or whether aggressive simply wins. (M2-F3)
9. **Does HP-carry change the decision texture?** Once re-implemented, confirm headlessly that carried HP + heal-by-eating makes "eat before you fight" a real, felt choice rather than a stat line. (M2-F3)
---

## 0b — Built-game audit (headless, the experiential half)

Drove the running dev build (`qa-shots.mjs`, port 5174) through cold-open → labour → mentor → first-wolf → gear.
Screenshots: `project/audit/screens/latest/qa-0[1-9]-*.png`. **No console errors.** Answering the synthesis's open questions:

- **Look / intent — ✅ holds.** Woodblock/ink throughout (神隠し brush title, 黒沢家 HUD, 春 clock, tabbed Work→Skills 技→Combat 武 inking in one-per-beat). Intentional, not AI-slop.
- **(Q1) First fight feels humbling-but-winnable — ✅.** *"you swing the pole, miss, swing again — and somehow, more luck than skill, it bolts bleeding into the night. You are alive. You should not be."* The signed 20–35% reads in the prose.
- **(Q2) Broken-weapon detour — flag.** Loss reads soft ("nothing lost but time and pride"), but the no-stranding **bug (P4)** means a fresh L1/no-wood run can hit a dead-feeling "monkey unwinnable until you woodcut" stretch. Confirmed worth the retune.
- **(Q3) Onboarding without a mentor — 🟡 confirmed.** Genemon ("gives you the run of the woodlot") and Kihei ("sets you to the estate's defence… finds you shaking") are NAMED in narration log lines — but there is **no dialogue/NPC system**, no greet-and-teach beat. The flavour is good; the *system* (P7) is the gap.
- **(Q5) Juice absence is felt — 🔴 confirmed.** The build is **silent**; only visual number-pop / tally-flash / rank-up-seal fire. The single biggest cheap fun lever (P8).
- **(Q9 precursor) HP-carry not legible — 🔴 confirmed.** The combat panel surfaces **no HP/vitals bar** (only the satiety "body" bar up top); loss copy "rest off the worst of it" reads as a free heal. The carry-HP/heal-by-eating tension (P1) isn't present *or* visible yet.

**For R1 (human taste call):** the arc reads well and looks intentional; the three felt gaps a player would notice are exactly P8 (silent), P1 (no visible HP / no carry tension), and P7 (mentors are prose, not characters who speak to you).
