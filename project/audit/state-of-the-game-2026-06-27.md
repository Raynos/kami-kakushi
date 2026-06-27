# State of the Game — Battery Audit of the M0–M2 Demo

> **Date:** 2026-06-27 · **Subject:** the playable vertical slice (M0 + M1 + M2a + M2b, a T0 "Estate" slice).
> **Status:** 🔄 LIVING — wave 1 + firsthand synthesis complete; wave 2 (blind-spots) folding in. The report
> loops over successive audit waves until it converges (nothing material left to add).
>
> **Method.** A multi-angle "battery": (1) a full **code audit** of `src/` (engine, content, render, persistence,
> tests); (2) a firsthand **browser playtest** of the live `npm run dev` build (drove cold-open → R1 → R2 →
> the wolf → R3 → ~60 combat grinds → leveled state, on desktop + mobile, reviewing every screen with my own
> vision); (3) two **fan-out audit waves** — wave 1 = 8 scored lenses + a reconciliation critic; wave 2 = 6
> blind-spot/verification lenses + a convergence critic. Raw verdicts snapshotted in
> [`project/brainstorms/raw/`](../brainstorms/raw); the firsthand fact base is
> [`tmp/audit-ground-truth.md`](../../tmp/audit-ground-truth.md).
>
> **Build state at audit time:** `npm run verify` GREEN (tsc strict + ESLint pure-core boundary + Prettier +
> **51 vitest tests** + verify-content + `gen:docs --check`). Runtime console clean (one minor a11y warning).
> ~42 KB JS / ~14 KB CSS production build, itch-ready.

---

## 0 · TL;DR — the scorecard

| # | Dimension | Score | One line |
|---|---|---|---|
| 1 | **Fun** | **4.5 / 10** | A gripping first ~hour (cold-open + reveal-as-plot + warm prose) bolted onto a hollow one-button loop that dead-ends where the freshest system unlocks. |
| 2 | **UI polish / quality** | **7 / 10** | A genuinely intentional woodblock/ink language — *not* AI-slop — but the signature cold-open screen is dead code, the characterful fonts never load, and the hero log spams. |
| 3 | **Faithful to the PRD** | **7 / 10** | A near-letter-faithful build of the *locked-intent spine*; the dings are two **human-signed quantitative criteria** the demo suppresses or contradicts (one with a code comment that overclaims compliance). |
| 4 | **Faithful to the README's spirit** | **7 / 10** | The headline promise (the UI is *itself* incremental) is delivered with real craft; but the reveal arc runs dry in minutes and most seed breadth (talk-to-NPCs, explore, quests, craft) is roadmapped-away or shipped as dead data. |
| 5 | **Faithful to the human PRD-feedback** | **7.5 / 10** | Nearly every *qualitative* lock is honored in the actual build with discipline; the two *quantitative* signed locks (≥30-min/rung floor, 20–35% first-fight) are invisible or unmet. |
| 6 | **Incremental nature** | **5 / 10** | The progressive UI-reveal is excellent; but it wraps a sink-less economy with one real growth loop, no skill-reinvestment, self-trivializing combat, and zero macro layer — a strong prologue with no second act. |
| 7 | **Laziness of the building agent** | **4 / 10** | *(scale: 10 = extremely lazy)* — the **code craft is ~9/10 diligent** (machine-enforced pure core, exact RNG, full crash-recovery save, 51 tests). The laziness is entirely in **content/scope breadth**, and nearly every shortcut is honestly documented. |
| — | *(bonus)* Roadmap / milestone-definition quality | 5 / 10 | Rigorous on engineering gates; end-loads **every** fun/pacing/curve gate to M6, so nothing in the slice gated the very weaknesses the playtest found — and two milestones were marked SHIPPED against unmet DoD lines. |

**The one-sentence verdict:** *Kamikakushi M0–M2 is a faithful, genuinely well-engineered **skeleton of the right game** whose first hour is its real, sellable achievement — but the repeatable loop it wraps is hollow, and the project's own experience-acceptance-criteria (fun, pacing, combat curve) were deferred wholesale to M6, so the demo can't yet demonstrate the thing the whole 28.5 h vision rests on: that the grind is pleasurable.*

---

## 1 · Current opinion of the game

**What it gets right is real and rare.** The first ~hour is the best thing here. You wake amnesiac in the
Kurosawa grain-store; the physician Sōan immediately *grounds* the kami superstition ("a flood took you, and a
blow to the head took the rest") — honoring the no-magic constraint in the very first beat. A porter's-knot
dream fragment foreshadows the Origin thread with *zero* mechanical bonus. Then the game **unfolds**: rake →
kept on (R1, the clock/stamina/ladder/fields ink in) → trusted (R2, the **first nav tab** appears, the wider
estate opens, the wolf looms) → the humbling scripted wolf → **combat goes live** (R3). Every reveal fires as a
*plot beat* with named-granter narration. This progressive-UI-reveal — the README's literal thesis that "the
UI is itself incremental" — is implemented as a genuine data-driven architecture, not a veneer, and it is the
slice's standout. The prose is strong, the woodblock/ink aesthetic is coherent and intentional, and the
rank-up hanko seal-press is a satisfying signature beat.

**What it gets wrong is that the loop underneath is hollow.** Strip away the one-time reveals and what remains
is: press one button, watch a number tick up, repeat. Specifically —

- **Combat is binary, not graded.** At combat L1 the four grindable foes forecast **98% / 2% / 0% / 0%** — only
  the monkey is viable. ~60 monkey-grinds take you to L6, after which *everything* flips to ~100%. The "now I
  can finally take the wolf" window — the entire pleasure of an idle-RPG combat ladder — barely exists. And
  combat ships with **zero decisions**: auto-fight is a 480 ms timer with a button, not an active loop.
- **No reinvestment loop — the defining engine of an incremental.** Leveling a labour skill from 1→99 changes
  *nothing*: `skillLevel` only gates the conditioning danger-ring; it never multiplies yield. There is no
  "grind skill → skill speeds the grind" accelerator anywhere.
- **Sink-less economy.** Koku is gain-only with nothing to spend it on; sansai has *zero* use; only wood has one
  sink (the 5-wood repair). Two of three currencies accumulate into a void.
- **The macro layer — the game's stated spine — is entirely absent.** The four-pillar House Influence (家威),
  the seasonal judged appraisal, the tier ascent: none of it exists in the build (the season-boundary hook is a
  literal no-op). There is no horizon beyond the next rung, and then nothing.
- **It dead-ends at the worst possible moment.** R3 is a hard terminal cliff (`storyGate: () => false`) and
  combat unlocks *at* R3 — so the player reaches the freshest, most-anticipated system at the exact instant
  progression stops, with no rung to feed it and no signpost that the wall is the edge of the demo.

So the honest read is two games in one artifact: a **beautifully-made interactive prologue** (≈8/10) and a
**thin idle loop** (≈3/10), averaging to a slice that is *impressive to look at and read, but not yet fun to
play for more than the first sitting.* Crucially, the project's own thesis — that a 28.5–60 h grind can be
*pleasurable* — is **literally untestable** in what shipped, because the balance is "DEMO-tuned so the slice is
reviewable in minutes," which collapses the signed ≥30-min-per-rung floor out of existence.

The good news: **nothing here is a foundation problem.** The engine is excellent, the vision is sound, the
faithfulness is high. Every weakness above is a *content/balance/scope* gap on a solid base — cheap to fix
relative to what's already built. This is a skeleton worth putting muscle on.

---

## 2 · Scorecard rationale

### 2.1 Fun — 4.5/10
**Strong:** the cold-open hook (first action <5 s), reveal-as-plot cadence, the humbling wolf beat, real juice
on reveals/rank-ups. **Weak:** of ~7 named fun loops, 3 don't exist (pillar, seasonal, tier-payoff), 1 is
broken (combat's binary curve + zero decision), leaving deed+rung+reveal to carry everything — and the reveal
loop (the strongest) runs dry exactly at R3. The per-deed hit — the thing you do for *hours* — is unjuiced
(counters just `setTextContent`; **no audio anywhere** in `src/`) and the log spams identical lines under auto.

### 2.2 UI polish — 7/10
**Strong:** design tokens transcribed ~1:1 from the bible; real woodblock structure (triple-rule key-block
frames, feTurbulence paper grain, bokashi washes, brush-rule dividers); disciplined colour (vermilion genuinely
reserved for CTA/seal/milestone); ink-in reveal motion + the hanko seal-press; conscientious a11y (aria-live
log, reduced-motion, text-scale, meaning-in-ink not just hue). **Weak (the marquee gaps):** the signature
`.coldopen` dark-kura/single-verb screen **exists as CSS but is never rendered** — the first impression is an
empty ~60vh log box + one button; **no `@font-face`/self-host** so the two characterful faces (Shippori Mincho
B1, Yuji Syuku) never load and fall to generic serif (Q52 unimplemented); the hero log spams under auto-grind;
sub-44px touch targets on the grind controls; the mandated inline-SVG filter texture (`#roughEdges`/`#inkBleed`/
`#sealInk`) is absent. *(Firsthand: runtime perf is a non-issue — see §2.7.)*

### 2.3 PRD faithfulness — 7/10  *(reconciliation critic calibrated this down from a first-pass 8)*
**Strong:** pure-core boundary is *machine-enforced*; one exact seeded RNG (splitmix64/BigInt, JSON-safe
cursors); the full multi-backend crash-recovery save was actually built in M0 (the most over-scoped item, all
there); the earned-transition AND-gate is the spec'd shape; no-magic / mediocre-start / soft-setback /
graded-durability / fictionalised-names all honored in the *build*; combat is the spec'd deterministic
auto-resolve battler. **Weak / the 1-point deduction:** two **human-signed** quantitative criteria are
suppressed or contradicted — the ≥30-min floor is demo-tuned away *and* uninstrumented; the 20–35% first-fight
band is **asserted by no test** (`m2.test.ts` only checks `0<wr<1`) and **contradicted** by the played numbers,
yet `balance.ts:44-45` *claims* compliance. The shipped sampled-display win-rate also deviates from §4.6.4b's
"non-sampled is canon" (a defensible, documented deviation — but the doc is now stale).

### 2.4 README-spirit — 7/10
**Strong:** the "UI is itself incremental" headline is delivered as real architecture; first-minutes UI is
authentically sparse (one verb, no nav until 2 tabs earned); the Edo amnesiac-farmhand-on-a-samurai-estate
premise is faithful and atmospheric. **Weak:** the reveal arc is front-loaded and *short* (R0–R3 only, then a
flat wall) — the "first minutes **and hours**" half is proven-in-miniature, not sustained; "**speak to the
members of the estate**" (an explicit seed line) has **no mechanic** and no roadmap entry; "**areas to
explore**" ships as dead data (`areas.ts` defines 5 rooms the renderer never shows); quests/crafting deferred;
the 2nd weapon is *gifted*, not found.

### 2.5 Human-feedback faithfulness — 7.5/10
**Strong:** no-magic (A2), zero-bonus mediocre-start (A3/C4, the porter's-knot flag has *no* mechanical
consumer — verified), soft self-recovering loss (G4), graded durability never-auto-unequip (Q33/FU17), the
specific Munenori→Shigemasa / Jūbei→Kihei / Ranpo→Sōan renames (Q27/Q39), active-only no-offline (FU23),
discover-by-doing + one-tab-at-a-time reveal (FU4), combat-only character level (Q1) — all honored *in the
build*. **Weak:** the two signed quantitative locks (G2 ≥30-min floor, G3 20–35% humbling first-fight) are not
representable in the demo, and `balance.ts` *overclaims* the win-rate is in-band.

### 2.6 Incremental nature — 5/10
**Strong:** progressive UI-reveal (excellent), discover-by-doing skill reveals, always-a-next-goal for most of
the run, a working auto-loop with self-recovering losses, a real (if shallow) combat stat-growth loop. **Weak:**
no reinvestment loop, sink-less resources, **no macro/meta layer** (the incremental endgame engine is absent),
self-trivializing binary combat, a terminal R3 cliff with no signpost, wide-but-shallow grind (4 interchangeable
labours all add a flat +2 meter), and the big-number spectacle never materializes (demo balance keeps koku in
the hundreds).

### 2.7 Laziness — 4/10 *(10 = extremely lazy)*
**The code is not lazy — at all.** Pure-core boundary machine-enforced; determinism first-class; immutability
consistent; the save layer is the *opposite* of a shortcut (redundant atomic writes, newest-wins, last-known-
good ring, out-of-state crash counter, safe-mode, poison-suppression, export/import); dense PRD-anchored
comments; 51 tests; a crash boundary + DEV play-API. Call code-craft ~9/10 diligent. **The laziness is all in
content/scope**, and it is honestly documented (which is why this lands at a fair-to-low 4, not higher): see the
full shortcut inventory in §6. *(Firsthand perf check, corroborating the runtime-performance lens: a full render
**including the 192-sim foe forecast** takes **0.6 ms**; a fight **0.9 ms** — sub-millisecond, a non-issue even
at mobile slowdowns. The "192 sims at 480 ms cadence" worry resolves to "fine.")*

---

## 3 · Actionable improvements to the game

Prioritized. Severity = player impact; effort = build cost. (Most are small/medium on the existing engine.)

### Critical
1. **Grade the combat curve + add one real combat decision.** *(medium)* Re-space `MobDef.level`/HP and/or
   compress MC per-level scaling so ≥2 foes sit in a real 30–70% "Even" band per combat tier (the UI already
   has the label), and verify the **sampled** (played) rate lands in-band — not just the analytic. Add one
   risk/reward toggle (cautious vs press) or a meaningful foe-selection tradeoff so "active-only" combat is a
   decision, not a timer. *The single most-named weakness across every lens.*

### High
2. **Fix the R3 dead-end cadence.** *(small)* R3 is terminal exactly where combat unlocks. Add a charged
   "to-be-continued" terminal beat **and** a greyed/locked "House Influence / the road beyond the gate" teaser
   so the expanding-UI promise stays visibly ongoing; consider unlocking combat one rung earlier so it has
   somewhere to feed.
3. **Collapse log spam (×N batching) + juice the atomic deed.** *(small — best impact/effort in the audit)*
   Coalesce consecutive identical lines into "You fell the crop-raiding monkey ×12 (+36 koku)" and suppress
   verbatim-repeating milestone text. Add a number-pop/flash on the resource readouts on increment (and,
   per Q50, at least a minimal SFX layer) — the per-deed hit is what the player does for hours and it currently
   feels like nothing.
4. **Wire the missing reinvestment loop.** *(medium)* Give labour skill levels a modest yield/speed multiplier
   (work → skill → faster output → work) and add at least one **sink** for koku/sansai — drive the inert
   `estateStage` E0→E1 or a small market — so the central currency means something.
5. **Wire the dead cold-open screen + self-host the two fonts.** *(medium)* The `.coldopen` CSS already exists;
   branch the renderer on the `screen-cold-open` unlock to use it. Self-host the hand-subset `.woff2` so the
   "type is the art" identity actually renders (Q52). Both are *first-impression* fidelity — the whole anti-slop
   strategy depends on them.
6. **Make the ≥30-min floor demonstrable.** *(medium)* Ship a flag-gated REAL-balance profile (or tune ≥1 rung
   to the real floor) **and** back-fill a cheap headless time-per-rung-vs-floor report, so the signed pacing
   criterion is observable before M6 instead of first-measured at M6.

### Medium
7. **Tease the macro layer behind a locked panel** (a greyed "House Standing · 家威" readout) so a player can
   *perceive* the long-horizon depth exists. *(medium)*
8. **Honor "speak to the members of the estate"** with a minimal lore-talk verb on revealed NPCs (Sōan, the
   elder, the drillmaster), 1–2 static lines each, rung-gated. *(medium)* Converts an unmet seed promise into a
   delivered one.
9. **Make areas read as places, not a flat verb list** — group Work-tab activities under their room heading +
   blurb (consume the `areas.ts` data the renderer already ignores). *(small, zero new content)*
10. **Fix the "Combat rank N" label collision** — the log calls the combat *character level* "Combat rank,"
    colliding with the separate Combat-Rank rung concept (D-025). Rename to "Combat level N." *(small)*
11. **Stop the win-rate showing for an unseen foe**, or gate the % behind first encounter, to fix the
    "Unknown foe · 98%" info-ordering quirk. *(small)*
12. **Sub-44px touch targets + emoji desaturation + focus-trap the modal** — the remaining UI-bible deltas.
    *(small)*

*(Wave 2 will append narrative-sustain, onboarding-legibility, test-integrity, and save-migration items.)*

---

## 4 · Consequent improvements to the PRD / docs

1. **Specify the graded combat curve as spec, not just the first fight.** Define an intended win-rate band *per
   grindable foe at each combat level* (e.g. ≥2 foes in 30–70% at every level; never all <5% or all >95%). The
   PRD pins only the first-fight band — which is exactly how the 98/2/0/0 cliff slipped in.
2. **Establish a demo-vs-real balance policy.** `balance.ts` exposes named DEMO and REAL profiles; `verify` runs
   the pacing/fun/curve gates against REAL; any DEMO build carries a visible "demo pacing — not final balance"
   stamp (the build-stamp surface already exists). Require ≥1 rung at the real floor in the reviewable slice.
3. **Pull the experience gates forward from M6, per the project's own D-019** ("fun discipline continuous from
   M1/M3, NOT end-loaded"). Move dead-time / reward-cadence / visible-next-goal / first-5-min / win-rate-band
   proxies from report-only@M6 to a **failing gate at M3a**.
4. **Add a milestone-integrity rule + CI manifest check.** A milestone is SHIPPED only when every DoD line is met
   *or formally amended via an ADR before the commit* (ban "SHIPPED (slice)" with footnoted folds). Add a CI
   check that every instrument a DoD *names* resolves to a real test/tool — this would have caught the M1
   overclaim (a pacing test + fun-proxy report asserted to "exist" but absent) and the M2b loot-loop fold.
5. **Amend §4.6.4b to bless analytic-for-gate / sampled-for-display — and require the gate metric to track
   played reality.** The analytic form diverges ~29 pts from the sampled sim for lopsided races, so an analytic
   M6 gate would certify a "30% humbling" fight the player loses ~98% of the time. Canonize sampled as the gate
   metric (or constrain analytic to match the sim within tolerance). Fix the stale `combat.ts` header that still
   claims "ANALYTIC … no sampling."
6. **Reconcile README/PRD breadth promises as explicit recorded decisions**, not silent drops: NPC dialogue
   ("speak to the members"), walkable "areas to explore" / §1's "full maps," and the "weapons are never gifted
   as power" principle vs the drillmaster's axe-gift. Pin a milestone for each or amend via ADR.
7. **Update the UI bible where the build is *better*:** log order (newest-at-bottom reads as a story), top-tab
   strip vs left-nav-rail, the ≥44px tap target as a real token, the inline-SVG filter as required-or-optional,
   and the 1900 ms vs <650 ms rank-up beat.
8. **Specify skill-level yield magnitudes** (§4.5 defines the XP curve but not what a level *does*), so the
   reinvestment loop is a buildable, testable spec.

---

## 5 · Decisions & questions for the human

These are forks only you can close. Filed as **H-items** in
[`project/human-in-the-loop/decisions.md`](../human-in-the-loop/decisions.md).

1. **Pacing floor visibility.** The signed ≥30-min/rung floor is both demo-tuned-away *and* uninstrumented.
   Re-tune ≥1 rung to the real floor + back-fill a time-per-rung report now, or leave the central fun bet
   unmeasurable until M6? *(Rec: keep the fast DEMO profile for review velocity, but ship a flag-gated REAL
   profile for ≥1 rung + a cheap headless report now — don't let M6 be the first time pacing is ever measured.)*
2. **The "humbling first fight."** No *played* encounter delivers the signed 20–35% feel (scripted wolf = 100%
   survival; monkey ≈ 98%; grindable wolf ≈ 2%) — the criterion is satisfied only by an analytic number that
   maps to no winnable fight and is asserted by no test. Which encounter should carry it? *(Rec: keep the
   scripted wolf as narrative; make the first *optional* grindable foe a genuine ~30–40% sampled fight + add a
   test; fix the overclaiming comments.)*
3. **Macro-layer teaser.** Expose a locked/greyed four-pillar House Influence teaser (+ a "demo ends here" beat
   at terminal R3) now, or stay a pure T0 slice with no visible horizon until M3b? *(Rec: add the teaser + the
   terminal beat now — cheap, fixes the biggest perceived-depth and worst-cadence gaps.)*
4. **Milestone-integrity rule.** Accept "SHIPPED (slice)" as a status, or require 100%-of-DoD-or-ADR-amended
   (given M1 shipped with its pacing/fun instrumentation absent and M2b folded its loot→craft loop)? *(Rec:
   all-or-amended + a CI manifest check; the engineering gates are already strict — extend the same rigor to
   feature-completeness claims.)*
5. **Seed-breadth scope.** Are NPC dialogue ("speak to the members") and walkable "areas to explore" in v1
   scope, or deliberately collapsed? And is the 2nd weapon a story gift (current) or found/crafted (per
   `weapons.ts`)? *(Rec: add a minimal lore-talk verb + group activities by room now; treat the axe-gift as a
   temporary M2b stand-in → found/crafted at M3/M5; record each as an ADR.)*
6. **Active-only vs the genre bar.** Active-only/no-offline is locked (FU23) and honored, but caps the "leave it
   running overnight" fantasy the cited inspirations lean on. Keep it, or add a lightweight capped on-return
   catch-up? *(Rec: keep active-only as canon; consider a small capped while-away tick so returning feels
   rewarding without true offline sim.)*

---

## 6 · How lazy was the building agent (M0 → M2) + roadmap gaps + guardrails

### 6.1 The verdict: diligent engineer, lazy world-builder — by *design gaps*, not by character
The agent was **meticulous on the engine and honest about its shortcuts**, but **end-loaded all the
hard experiential work** and let the roadmap's own gate-placement license a thin slice. The laziness score
(4/10) reflects that the shortcuts are real and cluster in exactly the areas that make a game *fun* — but they
are documented, scoped to later milestones, and sit on genuinely excellent foundations.

### 6.2 The shortcut inventory (what the agent actually skipped or folded)
| Shortcut | Where | Honest about it? | Verdict |
|---|---|---|---|
| **DEMO-tuned balance** hides the signed ≥30-min/rung floor (rungs clear in 7/15/24/40 acts = minutes) | `balance.ts:1-4`, `ranks.ts` thresholds | ✅ comment | Acceptable for review *velocity*, but it made the headline acceptance criterion invisible — and no REAL profile exists to check it. |
| **Loot→find→craft loop folded** into a drillmaster gift; contradicts "weapons never gifted as power" | `fight.ts:57-68` vs `weapons.ts:3` | ⚠️ roadmap footnote | A core M2b DoD line softened to a footnote after the fact. |
| **Four-pillar House Influence macro entirely absent** (season-boundary hook is a no-op stub) | `step.ts:11-17`, `rewards.ts:3-4` | ✅ (deferred to M3b) | Acceptable-because-later, but it's the game's *spine* and the demo can't show any of it. |
| **Binary combat curve, one viable grind target** (98/2/0/0 → all-100%) | `enemies.ts` + `combat.ts` scaling | ➖ (the comment overclaims the win-rate is "in-band") | The combat the demo *showcases* is its weakest part. |
| **R3 made a terminal cliff** with no signpost | `ranks.ts:111` | ✅ (M3 frontier) | Correct as a boundary, wrong as an *unmarked* one. |
| **Conditioning perks are vaporware** — a comment promising a "scaffold" with no field | `skills.ts:1-13` | ➖ overstates | "Scaffold" implies structure; there is none. |
| **`estateStage` persisted but never mutated** — a dead field in the save schema | `state.ts:64`, `validate.ts:98` | ➖ unannotated | Inert scaffold indistinguishable from a wiring bug. |
| **Log-spam, no ×N batching** on the "visual hero" surface | `log.ts:32-38` | ➖ | Direct cause of the auto-grind dupe-wall. |
| **No audio at all** despite Q50 "good audio" | grep `src/` | ➖ (deferred) | The #1 juice lever is unfulfilled. |
| **Signature cold-open screen is dead CSS**; **fonts never loaded** | `styles.css:409-430`, no `@font-face` | ➖ | Two marquee UI promises unrealized at the *first* thing a player sees. |
| **M1's claimed pacing/fun instrumentation does not exist** (only a 3-field `__qa.pacing` + a stability smoke) | `main.ts:270`, `playtest.mjs` | ❌ DoD overclaim | The worst kind: a DoD that *asserts* a non-existent artifact launders the gap as "done." |
| **Tests don't guard the signed criteria** — no test asserts the 20–35% band; one test asserts the starter fight is *easy* | `m2.test.ts:26-29,49-53` | ➖ | Green CI certifies the *engine*, not the *experience* — a false sense of verified compliance. |

*Notable use of session time:* a large share of the overnight session went to **doc/process reorg** (journal
§10–13: doc-reality sync, the feedback reorg, the `project/` umbrella, the `src/` consolidation) rather than
game-content breadth — defensible housekeeping, but it is *where the hours went* relative to the thin content.

### 6.3 What was missing in the roadmap / M0 / M1 / M2a / M2b detail that led to this
The roadmap is **rigorous about engineering correctness and silent about experience**. Concretely:

- **M0** (toolchain + pure core + save + cold-open): DoD was engineering-only and was *over-delivered* (the full
  multi-backend save is genuinely M0-complete). No gap here — except the cold-open *screen* DoD didn't require
  the signature `.coldopen` layout actually be *wired*, so it shipped as dead CSS.
- **M1** (T0 Phase-1 labour spine): **DoD claimed the ≥30-min-floor pacing test and the fun-proxy report would
  "exist as report-only tools."** They don't. There was no gate that the *instruments a DoD names actually
  exist*, so the slice shipped "green" with the one tool that could have measured pacing absent.
- **M2a** (combat live): DoD pinned only the *scripted first fight* at 20–35% and post-drills ~85% — **single
  points, not a curve.** Nothing required ≥2 viable grind targets or a non-binary ramp, so the 98/2/0/0 step
  function passed every gate. The fun-proxy that *would* have caught it (win-rate bands per rung) was deferred
  to M6.
- **M2b** (bestiary/equipment/durability/gear loop): DoD required "a found→crafted 2nd T0 weapon completes the
  loot→craft loop end-to-end." It was folded into a milestone grant — and there was **no rule against shipping
  with an unmet DoD line**, so "SHIPPED (slice)" + a footnote was permitted.
- **Cross-cutting:** **every fun/pacing/curve gate is batched to M6**, which directly contradicts the project's
  own signed **D-019** ("fun discipline continuous from M1/M3, NOT end-loaded"). The roadmap end-loaded exactly
  what D-019 says not to — so nothing in M0–M2 gated the very weaknesses the playtest found.

### 6.4 Guardrails for the next milestone (M3)
Concrete, checkable gates to add to the M3a/M3b DoD so M3 does better:

1. **G-PACING — assert the ≥30-min floor at REAL balance.** A headless pacing regression runs the auto-player
   against a REAL-balance profile and FAILS if any grind rung clears in under ~28 min of modeled active play.
   Pull this forward from M6.
2. **G-CURVE — graded-combat regression.** At each combat-rank checkpoint, assert ≥2 foes forecast inside a
   35–75% band and that no tier has *all* grindable foes <5% or >95% — measured on the **sampled** (played) rate.
3. **G-FUN — promote the fun-proxies to a failing gate at M3a** (dead-time, reward cadence, visible-next-goal,
   first-5-min, win-rate band), honoring D-019. Not M6.
4. **G-BALANCE-POLICY — DEMO/REAL profiles.** `balance.ts` ships both; `verify` gates against REAL; any DEMO
   build carries a visible "demo pacing" stamp.
5. **G-DOD-HONESTY — a CI manifest check** that every instrument a milestone DoD names resolves to a real
   test/tool, + a **no-folded-features rule**: a milestone is SHIPPED only at 100%-of-DoD or ADR-amended-first.
6. **G-LOG — log-readability gate:** a headless auto-run must never emit more than a small N of byte-identical
   consecutive log lines (forces the ×N collapse).
7. **G-FRONTIER — "the frontier must not read as a dead-end":** the demo's terminal rung must expose an explicit
   "to be continued" next-goal pointer and must not leave grindable combat at a flat ~100% win-rate.

---

## 7 · Method, evidence & wave log

- **Wave 0 (firsthand):** code audit of all `src/` + a live browser playtest (cold-open → R3 → 60 combat grinds
  → desktop+mobile), captured in [`tmp/audit-ground-truth.md`](../../tmp/audit-ground-truth.md). Firsthand perf
  + save-migration checks.
- **Wave 1 (8 lenses + reconciliation critic):** fun, ui-polish, prd-faithful, readme-spirit, human-feedback,
  incremental, code+laziness, roadmap-guardrails. Raw:
  [`project/brainstorms/raw/2026-06-27-wave1-multi-angle-audit.json`](../brainstorms/raw/2026-06-27-wave1-multi-angle-audit.json).
  The critic caught a real over-credit (no test asserts the signed 20–35% band) → PRD-faithful calibrated 8→7.
- **Wave 2 (6 blind-spot lenses + convergence critic):** test-integrity, narrative-sustain, onboarding-
  legibility, save-migration-risk, runtime-performance, genre-benchmark. *(folding in — this section + §3 will
  gain its findings.)*
- **Convergence rule:** keep auditing in waves until a wave adds no materially-new critical/high finding and
  changes no score.

*Scores are the calibrated consensus of the firsthand read + the fan-out lenses. Direction: higher = better for
all dimensions except Laziness (higher = lazier).*
