# State of the Game — Battery Audit of the M0–M2 Demo

> **Date:** 2026-06-27 · **Subject:** the playable vertical slice (M0 + M1 + M2a + M2b, a T0 "Estate" slice).
> **Status:** ✅ **CONVERGED** — 2 full audit waves (14 lenses) + 2 critics + firsthand verification; an
> independent convergence critic + firsthand re-checks agree no further wave is material.
>
> **Method.** A multi-angle "battery": (1) a full **code audit** of `src/` (engine, content, render, persistence,
> tests); (2) a firsthand **browser playtest** of the live `npm run dev` build (drove cold-open → R1 → R2 →
> the wolf → R3 → ~60 combat grinds → leveled state, on desktop + mobile, reviewing every screen with my own
> vision, plus live perf + save-layer probes); (3) two **fan-out audit waves** — wave 1 = 8 scored lenses + a
> reconciliation critic; wave 2 = 6 blind-spot/verification lenses + a convergence critic; (4) **firsthand
> adversarial verification** of every new high-severity code claim. Raw verdicts:
> [`project/brainstorms/raw/2026-06-27-wave1-multi-angle-audit.json`](../brainstorms/raw/2026-06-27-wave1-multi-angle-audit.json)
> + [`…-wave2-blindspots-audit.json`](../brainstorms/raw/2026-06-27-wave2-blindspots-audit.json); firsthand fact
> base [`tmp/audit-ground-truth.md`](../../tmp/audit-ground-truth.md).
>
> **Build state at audit time:** `npm run verify` GREEN (tsc strict + ESLint pure-core boundary + Prettier +
> **51 vitest tests** + verify-content + `gen:docs --check`). Runtime console clean (one minor a11y warning).
> ~42 KB JS / ~14 KB CSS production build, itch-ready. It boots clean, plays, and saves durably.

---

## 0 · TL;DR — the scorecard

The seven scores you asked for *(higher = better, except Laziness where higher = lazier)*:

| # | Dimension | Score | One line |
|---|---|---|---|
| 1 | **Fun** | **4.5 / 10** | A gripping first ~hour (cold-open + reveal-as-plot + warm prose) bolted onto a hollow one-button loop that dead-ends — in silence — exactly where the freshest system unlocks. |
| 2 | **UI polish / quality** | **7 / 10** | A genuinely intentional woodblock/ink language — *not* AI-slop — but the signature cold-open screen is dead code, the characterful fonts never load, and the hero log spams. |
| 3 | **Faithful to the PRD** | **6.5 / 10** | A near-letter-faithful build of the *locked-intent spine*; dinged for two human-signed *quantitative* criteria the demo suppresses/contradicts **and** two doc-vs-code lies inside the shipped slice (the "migration chain built+tested in M0"; the "dream cadence never goes cold"). |
| 4 | **Faithful to the README's spirit** | **7 / 10** | The headline promise (the UI is *itself* incremental) is delivered with real craft; but the reveal arc runs dry in minutes and most seed breadth (talk-to-NPCs, explore, quests, craft) is roadmapped-away or shipped as dead data. |
| 5 | **Faithful to the human PRD-feedback** | **7.5 / 10** | Nearly every *qualitative* lock is honored in the build with discipline; the two *quantitative* signed locks (≥30-min/rung floor, 20–35% first-fight) are invisible or unmet. |
| 6 | **Incremental nature** | **4.5 / 10** | The progressive UI-reveal is excellent; but it ships only the *earn* half — sink-less currencies, a phantom unspendable stat, 3 of 4 skills inert, binary self-trivializing combat, no macro layer. A genre-literate player reads these as *broken*, not merely incomplete. |
| 7 | **Laziness of the building agent** | **4.5 / 10** | *(10 = extremely lazy)* — code craft is **~9/10 diligent**, but the engineering polish *masked* real corner-cutting: a dead/unwired/untested `migrate()`, a `as unknown as GameState` cast hiding fields from the type-checker, and two tests that assert the known combat bug as correct — under a PRD that over-claims the migration chain as "built + tested." |

**Supporting wave-2 lenses** *(higher = better):* Test-integrity **5.5** · Narrative-sustain **5.5** ·
Onboarding-legibility **6** · Save-migration-risk **5** · Runtime-performance **6** · Genre-benchmark **5** ·
Roadmap/milestone-definition quality **5**.

**The one-sentence verdict:** *Kamikakushi M0–M2 is a faithful, beautifully-built **chassis with no engine** —
a machine-enforced pure core, an exact seeded RNG, a crash-safe save, a data-driven progressive-reveal engine,
and the best authored cold-open prose the genre offers, wrapping a hollow, earn-only, decision-free loop whose
own experience-acceptance-criteria (fun, pacing, combat curve) were deferred wholesale to M6 — so the demo
cannot yet demonstrate the one thing the whole 28.5 h vision rests on: that the grind is pleasurable.*

---

## 1 · Current opinion of the game

**What it gets right is real and rare.** The first ~hour is the best thing here. You wake amnesiac in the
Kurosawa grain-store; the physician Sōan immediately *grounds* the kami superstition ("a flood took you, and a
blow to the head took the rest") — honoring the no-magic constraint in the very first beat. Then the game
**unfolds**: rake → kept on (R1, the clock/stamina/ladder/fields ink in) → trusted (R2, the **first nav tab**
appears, the estate widens, the wolf looms) → the humbling scripted wolf → **combat goes live** (R3). Every
reveal fires as a *plot beat* with named-granter narration. This progressive-UI-reveal — the README's literal
thesis that "the UI is itself incremental" — is implemented as genuine data-driven architecture, not a veneer,
and it is the slice's standout. The prose is strong, the woodblock/ink aesthetic is coherent and intentional,
and the rank-up hanko seal-press is a satisfying signature beat.

**What it gets wrong is that the loop underneath is hollow — and in places visibly broken.** Strip away the
one-time reveals and what remains is: press one button, watch a number tick up, repeat. Worse, several systems
*ship inert*, which a genre-literate player reads as bugs, not as "coming later":

- **Combat is binary, not graded, and decision-free.** At combat L1 the four grindable foes forecast
  **98% / 2% / 0% / 0%** — only the monkey is viable. ~60 grinds take you to L6, after which *everything* flips
  to ~100%. The "now I can finally take the wolf" window — the entire pleasure of an idle-RPG combat ladder —
  barely exists. Auto-fight is a 480 ms timer with a button, not an active loop.
- **No reinvestment loop, and three skills are inert.** Leveling a labour skill 1→99 changes *nothing*:
  `skillLevel` is read **only** to gate conditioning's danger-ring; farming/foraging/woodcutting levels feed
  nothing. The defining engine of an incremental — work → skill → faster output → work — is simply absent.
- **Two currencies and one stat are dead-on-arrival.** Koku is gain-only with nothing to spend it on; **sansai**
  is gathered and displayed but consumed by *nothing*; and **`attributePoints`** is a phantom RPG stat — it
  increments +1 per combat level and is *persisted*, but is never spendable and has no allocation UI.
- **The macro layer — the game's stated spine — is entirely absent.** The four-pillar House Influence (家威),
  the seasonal judged appraisal, the tier ascent: none of it exists (the season-boundary hook is a literal
  no-op). There is no horizon beyond the next rung, and then nothing.
- **It dead-ends at the worst possible moment, in silence.** R3 is a hard terminal cliff and combat unlocks *at*
  R3 — so the player reaches the freshest system at the exact instant progression stops, with no rung to feed it
  and **no end beat**. The slice's strongest asset — the origin mystery (the porter's-knot, the amnesia dream) —
  is *abandoned inside the playable window*: its markers are write-only flags that no game logic ever reads, so
  the mystery simply stops, violating the PRD's own §1.9 "the dream cadence never goes cold."

So the honest read is two games in one artifact: a **beautifully-made interactive prologue** (≈8/10) and a
**thin, partly-inert idle loop** (≈3/10). The project's own thesis — that a long grind can be *pleasurable* —
is **literally untestable** in what shipped, because the balance is "DEMO-tuned so the slice is reviewable in
minutes," collapsing the signed ≥30-min-per-rung floor out of existence.

The good news: **nothing here is a foundation problem.** The engine is excellent, the vision is sound, the
faithfulness is high, and it is durable and crash-safe today. Every weakness above is a *content/balance/scope*
gap on a solid base — cheap to fix relative to what's already built. This is a chassis worth dropping an engine
into.

---

## 2 · Scorecard rationale

### 2.1 Fun — 4.5/10
Strong: the cold-open hook (first action <5 s), reveal-as-plot cadence, the humbling wolf beat, real juice on
reveals/rank-ups. Weak: of ~7 named fun loops, 3 don't exist (pillar, seasonal, tier-payoff), 1 is broken
(combat's binary curve + zero decision), leaving deed+rung+reveal to carry everything — and the reveal loop
(the strongest) runs dry, in silence, at R3. The per-deed hit — the thing you do for *hours* — is unjuiced
(counters just `setTextContent`; **no audio anywhere** in `src/`) and the log spams identical lines under auto.

### 2.2 UI polish — 7/10
Strong: design tokens transcribed ~1:1 from the bible; real woodblock structure (triple-rule key-block frames,
feTurbulence paper grain, bokashi washes, brush-rule dividers); disciplined colour (vermilion genuinely reserved
for CTA/seal/milestone); ink-in reveal motion + the hanko seal-press; conscientious a11y. Weak (the marquee
gaps): the signature `.coldopen` dark-kura/single-verb screen **exists as CSS but is never rendered** — the
first impression is an empty ~60vh log box + one button; **no `@font-face`/self-host**, so the two characterful
faces never load and fall to generic serif (Q52 unimplemented); the hero log spams under auto-grind; sub-44px
touch targets on the grind controls; the mandated inline-SVG filter texture is absent. *(Firsthand: runtime perf
is a non-issue — see §2.7.)*

### 2.3 PRD faithfulness — 6.5/10 *(wave-1 first-pass 8 → reconciliation-critic 7 → wave-2 6.5)*
Strong: pure-core boundary *machine-enforced*; one exact seeded RNG; the full multi-backend crash-recovery save
actually built in M0; the earned-transition AND-gate is the spec'd shape; no-magic / mediocre-start /
soft-setback / graded-durability / fictionalised-names all honored in the *build*. Weak / the deductions:
(a) two human-signed *quantitative* criteria are suppressed or contradicted — the ≥30-min floor is demo-tuned
away *and* uninstrumented; the 20–35% first-fight band is **asserted by no test** and **contradicted** by the
played numbers (~6.7%), yet `balance.ts:44-45` *claims* compliance; (b) two **doc-vs-code faithfulness lies
inside what ships** — §6.8.2 claims the forward-migration chain was "built FULL + unit-tested in M0" (it is
dead/unwired/untested), and §1.9's "dream cadence never goes cold" is violated *within the T0 window* (the
mystery dies after R2 via write-only flags).

### 2.4 README-spirit — 7/10
Strong: the "UI is itself incremental" headline delivered as real architecture; first-minutes UI authentically
sparse (one verb, no nav until 2 tabs earned); the Edo amnesiac-farmhand premise faithful and atmospheric.
Weak: the reveal arc is front-loaded and *short* (R0–R3 only, then a flat wall) — the "first minutes **and
hours**" half is proven-in-miniature, not sustained; "**speak to the members of the estate**" has **no
mechanic** and no roadmap entry; "**areas to explore**" ships as dead data (`areas.ts` defines 5 rooms the
renderer never shows); quests/crafting deferred; the 2nd weapon is *gifted*, not found.

### 2.5 Human-feedback faithfulness — 7.5/10
Strong: no-magic (A2), zero-bonus mediocre-start (A3/C4 — the porter's-knot flag has no mechanical consumer,
verified), soft self-recovering loss (G4), graded durability never-auto-unequip (Q33/FU17), the specific
Munenori→Shigemasa / Jūbei→Kihei / Ranpo→Sōan renames (Q27/Q39), active-only no-offline (FU23),
discover-by-doing + one-tab-at-a-time reveal (FU4), combat-only character level (Q1) — all honored *in the
build*. Weak: the two signed *quantitative* locks (G2 ≥30-min floor, G3 20–35% humbling first-fight) are not
representable in the demo, and `balance.ts` *overclaims* the win-rate is in-band.

### 2.6 Incremental nature — 4.5/10 *(wave-1 5 → wave-2 4.5)*
Strong: progressive UI-reveal (excellent), discover-by-doing skill reveals, a working auto-loop with
self-recovering losses, a real (if shallow) combat stat-growth loop. Weak: only the *earn* half of the engine
ships — sink-less koku/sansai, a **phantom unspendable `attributePoints` stat**, **3 of 4 skills inert**,
self-trivializing binary combat, **no macro/meta layer**, a silent terminal R3 cliff, and a big-number
spectacle that never materializes. To a genre-literate player the dead values read as *broken*.

### 2.7 Laziness — 4.5/10 *(10 = extremely lazy; wave-1 4 → wave-2 4.5)*
The code is **not lazy** — pure-core boundary machine-enforced, determinism first-class, immutability consistent,
the save layer the *opposite* of a shortcut, 51 tests, a crash boundary + DEV play-API. Code-craft ≈ 9/10
diligent. **The laziness is in content/scope** *and* in a few spots the engineering polish masked: a
dead/unwired/untested `migrate()`; a `as unknown as GameState` cast that hides forgotten fields from `tsc`; the
`coerced` repair-flag plumbed through the save layer but never acted on; and two tests that assert the known
combat bug as correct — all under a PRD that over-claims the migration chain as "built + tested." Full inventory
in §6. *(Firsthand perf check: a full render **including the 192-sim forecast** = 0.6 ms; a fight = 0.9 ms —
sub-millisecond, a non-issue at T0; it is a named **mobile scaling cliff** O(foes × sims), not a present bug.)*

---

## 3 · Actionable improvements to the game

Prioritized. Severity = player impact; effort = build cost. (Most are small/medium on the existing engine.)

### Critical
1. **Grade the combat curve + add one real combat decision.** *(medium)* Re-space `MobDef.level`/HP and/or
   compress MC per-level scaling so ≥2 foes sit in a real 30–70% "Even" band per combat tier (the UI already has
   the label), verified on the **sampled** (played) rate. Add one risk/reward toggle or a meaningful
   foe-selection tradeoff so combat is a decision, not a timer. *The single most-named weakness across every
   lens.*

### High
2. **Fix the R3 dead-end cadence — and close the narrative chapter.** *(small)* R3 is terminal exactly where
   combat unlocks, and the mystery dies in silence. Add a charged "to-be-continued" terminal beat (pay off the
   porter's-knot/amnesia thread at least partially) **and** a greyed/locked "House Influence / road beyond the
   gate" teaser so the expanding-UI promise stays visibly ongoing.
3. **Collapse log spam (×N batching) + juice the atomic deed.** *(small — best impact/effort in the audit)*
   Coalesce consecutive identical lines into "You fell the crop-raiding monkey ×12 (+36 koku)" and suppress
   verbatim milestone repeats. Add a number-pop/flash on the resource readouts (and a minimal SFX layer, Q50) —
   the per-deed hit is what the player does for hours and currently feels like nothing.
4. **Wire the missing reinvestment loop + give skills teeth.** *(medium)* Give labour skill levels a yield/speed
   multiplier (work → skill → faster → work) and add ≥1 **sink** for koku/sansai (drive the inert `estateStage`
   E0→E1, or a small market). Make the 3 inert skills confer a small bonus.
5. **Resolve the dead values that read as bugs.** *(small)* Either give `attributePoints` an allocation UI/effect
   or stop persisting it; give `sansai` a use or don't surface it yet.
6. **Wire the dead cold-open screen + self-host the two fonts.** *(medium)* The `.coldopen` CSS already exists;
   branch the renderer on the `screen-cold-open` unlock. Self-host the hand-subset `.woff2` (Q52). Both are
   *first-impression* fidelity — the anti-slop strategy depends on them.
7. **Make the ≥30-min floor demonstrable.** *(medium)* Ship a flag-gated REAL-balance profile (or tune ≥1 rung)
   + a cheap headless time-per-rung-vs-floor report, so the signed pacing criterion is observable before M6.
8. **Back the signed acceptance criteria with real (currently-RED) tests.** *(small–medium)* Replace the
   unfalsifiable analytic test (it asserts `0<wr<1` against a function clamped to `[0.02,0.98]`) and the
   "monkey wr>0.6" test (which enshrines the broken combat) with assertions of the *intended* bands — they
   should go red against today's numbers and only pass once combat is re-tuned. Add a graded-curve invariant.
9. **Wire `migrate()` into the load path + test it before the first schema bump.** *(small–medium)* The
   migration chain is dead today; the first `SCHEMA_VERSION` bump will silently mishandle returning players'
   saves (codec re-stamps the new version while validate preserves the old inner one — a latent
   silent-corruption footgun). Wire it, test the from→to loop, and add the promised raw pre-migration backup.

### Medium
10. **Tease the macro layer behind a locked panel** (a greyed "House Standing · 家威" readout) so a player can
    *perceive* the long-horizon depth exists. *(medium)*
11. **Honor "speak to the members of the estate"** with a minimal lore-talk verb on revealed NPCs, 1–2 static
    lines each, rung-gated. *(medium)*
12. **Make areas read as places** — group Work-tab activities under their room heading + blurb (consume the
    `areas.ts` data the renderer already ignores). *(small, zero new content)*
13. **Build the onboarding's explanatory half** — the D-Q-codex "explain inline" contract ships exactly **one**
    tooltip (a disabled-button lock reason). The body/satiety bar has no number or explanation; koku's purpose
    is never stated. Add first-reveal tooltip copy per system. *(medium)*
14. **Fix the "+3 gō" unit bug** — the first reward logs "+3 gō" while the counter gains **3 koku** (1 koku ≈
    1000 gō, a ~1000× mismatch). Either log "+3 koku" or make the rake yield gō and convert. *(small)*
15. **Fix the "Combat rank N" label collision** (the combat character level, colliding with the Estate rung and
    the future Arms rank-gate → "Combat level N"); stop the win-rate showing for an unseen "Unknown foe";
    sub-44px touch targets; emoji desaturation; focus-trap the modal. *(small each)*
16. **Add a `document.hidden`/dirty guard to the 15 s autosave** (it writes ~28 KB to three backends
    unconditionally) — a battery cost for a game pitched as idle. *(small)*

---

## 4 · Consequent improvements to the PRD / docs

1. **Specify the graded combat curve as spec, not just the first fight** — an intended win-rate band *per
   grindable foe at each combat level* (≥2 foes in 30–70% at every level; never all <5% or all >95%).
2. **Establish a demo-vs-real balance policy** — `balance.ts` exposes named DEMO/REAL profiles; `verify` runs
   pacing/fun/curve gates against REAL; any DEMO build carries a visible "demo pacing — not final balance" stamp.
   Require ≥1 rung at the real floor in the reviewable slice.
3. **Pull the experience gates forward from M6, per the project's own D-019** ("fun discipline continuous from
   M1/M3, NOT end-loaded") — move the fun-proxies + win-rate-band proxy to a **failing gate at M3a**.
4. **Add a milestone-integrity rule + CI manifest check** — a milestone is SHIPPED only when every DoD line is
   met *or formally amended via an ADR before the commit* (ban "SHIPPED (slice)" footnoted folds). CI asserts
   every instrument a DoD *names* resolves to a real test/tool.
5. **Correct two doc-vs-code over-claims that this audit verified false:** §6.8.2's "forward-migration chain
   built FULL + unit-tested in M0" (it is dead/unwired/untested — fix the doc *and* wire/test the code), and the
   M1 DoD's "≥30-min-floor pacing test + fun-proxy report exist as report-only tools" (they don't).
6. **Amend §4.6.4b to bless analytic-for-gate / sampled-for-display — and require the gate metric to track
   played reality** (the analytic form diverges ~24 pts from the sampled sim on the foes that matter). Fix the
   stale `combat.ts` header that still claims "ANALYTIC … no sampling."
7. **Reconcile §1.9's "dream cadence never goes cold" with the build** — either add a mid/late-T0 dream/mystery
   beat (so the cadence holds within the playable window) or scope §1.9 to "across tiers" and accept the T0 gap
   as a known, recorded deferral.
8. **Reconcile README/PRD breadth promises as explicit recorded decisions** — NPC dialogue, walkable areas /
   §1's "full maps," and the "weapons never gifted as power" principle vs the drillmaster's gift. Pin a
   milestone for each or amend via ADR.
9. **Update the UI bible where the build is *better*** (log order, top-tab strip, the ≥44px tap target as a real
   token, the inline-SVG filter as required-or-optional, the 1900 ms vs <650 ms rank-up beat).
10. **Specify skill-level yield magnitudes** (§4.5 defines the XP curve but not what a level *does*).

---

## 5 · Decisions & questions for the human

Six forks only you can close — filed as **H1–H6** in
[`project/human-in-the-loop/decisions.md`](../human-in-the-loop/decisions.md):

1. **Pacing-floor visibility** — re-tune ≥1 rung to the real ≥30-min floor + back-fill a time-per-rung report
   now, or leave it unmeasurable until M6? *(Rec: keep DEMO for velocity but ship a flag-gated REAL profile +
   report now.)*
2. **The "humbling first fight"** — which encounter carries the signed 20–35% band, given no *played* encounter
   delivers it today? *(Rec: keep the scripted wolf as narrative; make the first optional grindable foe a real
   ~30–40% sampled fight + add a test; fix the overclaiming comments.)*
3. **Macro-layer teaser + demo-end beat** — expose a locked House Influence teaser (+ close the chapter at R3)
   now, or wait for M3b? *(Rec: add now — cheap, fixes the worst perceived-depth + cadence gaps.)*
4. **Milestone-integrity rule** — ban "SHIPPED (slice)" in favor of 100%-of-DoD-or-ADR-amended + a CI manifest
   check? *(Rec: yes.)*
5. **Seed-breadth scope** — are NPC dialogue + walkable areas in v1, and is the 2nd weapon gifted or found?
   *(Rec: add a minimal lore-talk verb + group activities by room now; treat the axe-gift as a temporary M2b
   stand-in → found/crafted at M3/M5; record each as an ADR.)*
6. **Active-only vs the genre bar** — keep no-offline (FU23), or add a lightweight capped on-return catch-up?
   *(Rec: keep active-only canon; consider a small capped while-away tick after the reinvestment loop + macro
   land.)*

---

## 6 · How lazy was the building agent (M0 → M2) + roadmap gaps + guardrails

### 6.1 The verdict: diligent engineer, lazy world-builder — masked, in spots, by the engineering polish
The agent was **meticulous on the engine and largely honest about its scope shortcuts**, but **end-loaded all
the hard experiential work** and — wave 2 found — let a few genuine corner-cuts hide *behind* the polish: a dead
migration path, a type-checker-blinding cast, and tests that bless the combat bug. The laziness score (4.5/10)
reflects real, clustered-in-the-fun-areas shortcuts, partly documented, on genuinely excellent foundations.

### 6.2 The shortcut inventory (what the agent actually skipped, folded, or faked)
| Shortcut | Where | Honest about it? | Verdict |
|---|---|---|---|
| **DEMO-tuned balance** hides the signed ≥30-min/rung floor (rungs clear in 7/15/24/40 acts = minutes) | `balance.ts:1-4` | ✅ comment | Acceptable for *velocity*, but the headline criterion is invisible and no REAL profile exists to check it. |
| **Loot→find→craft loop folded** into a drillmaster gift; contradicts "weapons never gifted as power" | `fight.ts:57-68` vs `weapons.ts:3` | ⚠️ footnote | A core M2b DoD line softened to a footnote after the fact. |
| **Four-pillar House Influence macro entirely absent** (season-boundary hook is a no-op stub) | `step.ts:11-17` | ✅ (deferred) | Acceptable-because-later, but it's the *spine* and the demo shows none of it. |
| **Binary combat curve, one viable grind target** (98/2/0/0 → all-100%) | `enemies.ts` + `combat.ts` | ➖ (comment *overclaims* in-band) | The combat the demo showcases is its weakest part. |
| **R3 terminal cliff, no end beat** | `ranks.ts:111` | ✅ (M3 frontier) | Correct as a boundary, wrong as an *unmarked/silent* one. |
| **Origin mystery abandoned in-window** — `dream-1` / `porters-knot` are **write-only** flags no logic reads | `intents.ts:78`, `ranks.ts:78` | ❌ violates §1.9 | The strongest asset (prose) dead-ends with no payoff inside T0. |
| **Phantom `attributePoints` stat** — incremented +1/level, persisted, never spendable, no UI | `fight.ts:45` | ➖ | Reads as broken to a genre player. |
| **`sansai` gained + displayed but consumed by nothing** | `activities.ts:66` | ➖ | A dead currency on screen. |
| **3 of 4 skills inert** — only conditioning's level gates anything | `selectors.ts:81,96` | ➖ | Leveling them does literally nothing. |
| **`migrate()` is dead/unwired/untested** under a PRD claiming it was "built FULL + unit-tested in M0" | `migrate.ts`, `index.ts:25` | ❌ doc lies | Latent silent-corruption footgun at the first schema bump. |
| **`as unknown as GameState` cast** hides a hand-maintained 8-field allowlist from `tsc` | `validate.ts:77` | ➖ | Forgotten fields won't be caught by the type-checker. |
| **`coerced` repair-flag plumbed but never acted on** (app checks only `safeMode`) | `saveManager`→`main.ts:42` | ➖ | A silent save-repair the player is never told about. |
| **Two tests assert the combat bug as correct** — `monkey wr>0.6`, and an unfalsifiable analytic test | `m2.test.ts:26-29,49-53` | ❌ false-green | Green CI certifies the engine, not the experience. |
| **Conditioning perks are vaporware** — a "scaffold" comment with no field | `skills.ts:1-13` | ➖ overstates | "Scaffold" implies structure; there is none. |
| **`estateStage` persisted but never mutated**; **no audio** despite Q50; **dead `.coldopen` CSS**; **fonts never loaded**; **log-spam no ×N** | various | mixed | Marquee promises + juice unrealized at the first thing a player sees. |
| **M1's claimed pacing/fun instrumentation does not exist** (only a 3-field `__qa.pacing` + a stability smoke) | `main.ts:270`, `playtest.mjs` | ❌ DoD overclaim | A DoD asserting a non-existent artifact launders the gap as "done." |

*Notable use of session time:* a large share of the overnight session went to **doc/process reorg** (journal
§10–13) rather than game-content breadth — defensible housekeeping, but it is *where the hours went* relative to
the thin, partly-inert content.

### 6.3 What was missing in the roadmap / M0 / M1 / M2a / M2b detail that led to this
The roadmap is **rigorous about engineering correctness and silent about experience**:

- **M0** — engineering-only DoD, *over-delivered* (the full save layer is genuinely M0-complete). The one gap:
  the cold-open *screen* DoD didn't require the signature `.coldopen` layout actually be *wired* → dead CSS.
- **M1** — DoD **claimed** the ≥30-min-floor pacing test + fun-proxy report would "exist as report-only tools."
  They don't. No gate checked that the *instruments a DoD names actually exist*, so the slice shipped "green"
  with the one tool that could have measured pacing absent.
- **M2a** — DoD pinned only the *scripted first fight* (20–35%) and post-drills (~85%) — **single points, not a
  curve.** Nothing required ≥2 viable grind targets, so the 98/2/0/0 step function passed every gate. The
  fun-proxy that would have caught it was deferred to M6.
- **M2b** — DoD required "a found→crafted 2nd T0 weapon completes the loot→craft loop end-to-end." It was folded
  into a grant, with **no rule against shipping with an unmet DoD line** → "SHIPPED (slice)" + a footnote.
- **Cross-cutting** — **every fun/pacing/curve gate is batched to M6**, contradicting the project's own signed
  **D-019** ("continuous from M1/M3, NOT end-loaded"). And **no test guards a single signed acceptance
  criterion**, so green CI created a false sense of verified compliance the whole project inherited.

### 6.4 Guardrails for the next milestone (M3)
Concrete, checkable gates to add to the M3a/M3b DoD:

1. **G-PACING** — a headless pacing regression runs the auto-player against a REAL-balance profile and FAILS if
   any grind rung clears in under ~28 min of modeled active play. (Pulled forward from M6.)
2. **G-CURVE** — at each combat-rank checkpoint, assert ≥2 foes forecast in a 35–75% band and no tier has *all*
   foes <5% or >95%, measured on the **sampled** rate.
3. **G-FUN** — promote the fun-proxies to a failing gate at M3a (honoring D-019), not M6.
4. **G-BALANCE-POLICY** — `balance.ts` ships DEMO + REAL; `verify` gates against REAL; DEMO builds carry a
   visible stamp.
5. **G-DOD-HONESTY** — a CI manifest check that every instrument a DoD names resolves to a real test/tool +
   a **no-folded-features rule** (100%-of-DoD or ADR-amended-first).
6. **G-TEST-TEETH** — no signed acceptance criterion may ship without a test that would go RED if violated;
   ban tautological assertions (an assertion against a clamped range that can't fail).
7. **G-LOG** — a headless auto-run must never emit more than a small N of byte-identical consecutive log lines.
8. **G-FRONTIER** — the demo's terminal rung must expose an explicit "to be continued" next-goal pointer, close
   any open narrative thread, and not leave grindable combat at a flat ~100% win-rate.
9. **G-NO-DEAD-VALUES** — a content check that every surfaced currency/stat/skill-level has at least one
   consumer (would catch sansai, `attributePoints`, the inert skills).
10. **G-MIGRATION** — `migrate()` is wired into the load path and covered by a from→to test before any
    `SCHEMA_VERSION` bump.

---

## 7 · Method, evidence & wave log

- **Wave 0 (firsthand):** code audit of all `src/` + a live browser playtest (cold-open → R3 → 60 combat grinds
  → desktop+mobile) → [`tmp/audit-ground-truth.md`](../../tmp/audit-ground-truth.md). Firsthand perf (0.6 ms/
  render) + save-layer probes.
- **Wave 1 (8 lenses + reconciliation critic):** fun, ui-polish, prd-faithful, readme-spirit, human-feedback,
  incremental, code+laziness, roadmap-guardrails. The critic caught a real over-credit (no test asserts the
  signed 20–35% band) → PRD-faithful 8→7.
- **Wave 2 (6 blind-spot lenses + convergence critic):** test-integrity, narrative-sustain, onboarding-
  legibility, save-migration-risk, runtime-performance, genre-benchmark. Materially-new findings: the
  **false-green test suite**, the **dead/unwired migration "safety net,"** the **abandoned in-window mystery**,
  the **dead values + inert skills**, the **mobile scaling cliff**, the **unbuilt onboarding half**. Scores
  nudged: PRD-faithful 7→6.5, incremental 5→4.5, laziness 4→4.5.
- **Verification:** every new high-severity code claim re-checked firsthand (migrate dead, write-only mystery
  flags, phantom `attributePoints`, the +3 gō/koku unit bug, 3-of-4 inert skills — all confirmed).
- **Convergence:** an independent critic + the firsthand re-checks agree the audit has **converged**.

### 7.1 Residual angles — checked & cleared (final pass)
The convergence critic named four residual angles as "immaterial for an offline single-player T0 slice." A final
firsthand pass confirms each is genuinely a non-issue (so the report is exhaustive, not merely declared done):

- **Accessibility (deep):** a live **Lighthouse** audit of the build scores **Accessibility 100 / Best
  Practices 100** (SEO 91). The only two failures sit under "Agentic Browsing" (agent-affordance/meta, not
  player a11y). The one known player-facing a11y ding remains the save `<textarea>` lacking `id`/`name`
  (already logged). The a11y foundation is genuinely excellent — cleared.
- **Untrusted-save-import / client-side security:** no `innerHTML`/`outerHTML`/`insertAdjacentHTML`/`eval`/
  `new Function` anywhere in `src/` (the renderer is `textContent`/`createTextNode` only); the import path
  `JSON.parse`s then validates the app-id + rejects a newer schema version before use. XSS/injection surface is
  minimal for an offline single-player game — cleared.
- **Build/deploy pipeline + itch cross-origin-iframe save survival:** legitimately M7-deferred; the
  export/import backstop is the built hedge — not material for M0–M2.
- **Mobile-UX depth:** beyond the 390px reflow smoke-check (holds up, "best-effort" per Block N.1 #2); the real
  mobile items are the sub-44px touch targets + the O(foes×sims) forecast cliff, both already in §3.

No remaining angle is material. **The audit is complete and stable.**

*Scores are the calibrated consensus of the firsthand read + 14 fan-out lenses + 2 critics + a residual-angle
verification pass. Direction: higher = better for all dimensions except Laziness (higher = lazier).*
