# State of the Game — Battery Audit of **v0.2**

> ✅ **TRIAGED 2026-06-29** — every human-facing decision in this report is resolved (this session + the
> reshape D-048…D-055). Decision log: [`2026-06-29-decision-session.md`](../../human-feedback/2026-06-29-decision-session.md).
> Remaining items are agent execution feeding [`roadmap-reaxe-proposal`](../../archive/2026-06-29-roadmap-reaxe-proposal.md) *(archived session-12)*.

> **Date:** 2026-06-28 · **Subject:** the v0.2 audit-fix build (tag `v0.2`, HEAD `b39bbd1`) · **Companion:**
> the v0.1 report [`2026-06-27-state-of-the-game.md`](2026-06-27-state-of-the-game.md) + the
> [`2026-06-27-v0.2-changelog.md`](2026-06-27-v0.2-changelog.md).
>
> **This is the same battery, repeated on v0.2** — 12 multi-angle lenses + a convergence/de-dup critic,
> firsthand-grounded ([`tmp/v0.2-ground-truth.md`](../../../tmp/v0.2-ground-truth.md)), raw verdicts in
> [`brainstorms/raw/2026-06-28-v02-battery.json`](../../brainstorms/raw/2026-06-28-v02-battery.json).
>
> **How to read it (de-duplicated by design):** findings **new or changed in v0.2** are stated in full;
> findings **unchanged from v0.1** are *referenced, not restated* — see **§3 (carryover index)**, which points
> back to the v0.1 report's sections. So this report is short on purpose; the v0.1 report remains the full record
> of everything v0.2 didn't touch.
>
> **Build state:** `npm run verify` GREEN — **99 tests** (51 → 99), pure-core boundary + determinism intact,
> console clean, Lighthouse a11y 100 / best-practices 100. Itch-ready.

---

## 0 · Scorecard (v0.1 → v0.2)

*(↑ = better, except Laziness where ↑ = lazier)*

| Dimension | v0.1 | **v0.2** | Why it moved |
|---|---|---|---|
| **Fun** | 4.5 | **6.0** | Graded combat frontier + a landing beat + real sinks = a verified +1.5; held a half-point *under* the earlier re-score's 6.5 — firsthand, the stance "decision" largely collapses and the 0.32 first fight is best-case-only (see §2). |
| **UI polish** | 7 | **8.5** | All four marquee v0.1 gaps genuinely fixed (cold-open screen wired, fonts vendored, log-spam killed, sub-44px taps) + the macro-teaser panel + number-pop. |
| **PRD-faithful** | 6.5 | **8.0** | Both v0.1 deduction clusters resolved: the suppressed signed criteria are now seed-robust + RED-able-tested, `migrate()` wired, §1.9 dream-cadence honored. |
| **README-spirit** | 7 | **7.5** | The "the UI is itself incremental" thesis is now honored end-to-end (cold-open at frame one → a real reveal arc that lands). Breadth gaps (quests/crafting/dialogue) carry over. |
| **Human-feedback** | 7.5 | **8.5** | The two signed *quantitative* locks that cost v0.1 points are now both verified-real: G3 first fight = 0.32 in band, G2 ≥30-min floor demonstrable — in the most robust form (displayed == tested == identical for every player). |
| **Incremental** | 4.5 | **7.0** | A real reinvestment loop + all four sinks behind a build-failing no-dead-value ratchet. Capped at 7 by a *self-saturating* flywheel (koku's only sink is the finite, power-neutral estate) and the still-absent macro engine. |
| **Laziness** *(↑=lazier)* | 4.5 | **3.0** | Every v0.1 "masked corner-cut" (dead `migrate()`, type-blinding cast, false-green tests, unacted flag, dead values) is now wired + real. |
| *Roadmap/guardrails* | 5 | **7.0** | The v0.1 wish-list of experience gates is now ~6.5 real RED-able tests living in `verify` *today* (curve/log/frontier/no-dead-value/pacing). |

*Supporting lenses (inform the findings; not headline scores): v0.2-rough-edges 6.5 · macro-gap 4 (the gap is
now **honest** and the stakes **higher**) · test-integrity 8 · onboarding **5.5 — the only downward mover**.*

---

## 1 · Current opinion

**The "beautifully-built chassis with no engine" now has a real, if shallow, inner loop.** Every v0.1 deduction
v0.2 targeted, it moved — and the fixes are *verified real in code + tests*, not merely claimed. Combat is a
graded rolling frontier with a stance toggle (replacing v0.1's 98/2/0/0 step); every formerly-dead value has a
consumer behind a build-failing ratchet; a reinvestment multiplier exists; the reveal arc finally **lands** (a
cold-open title card at frame one → an R3 chapter-close → a dream-2 payoff that is the first code to *read*
v0.1's write-only mystery flags → a greyed House-Influence silhouette); the false-green tests are replaced with
RED-able band tests; `migrate()` is wired.

**But it is "solidly out of *hollow*," not yet "engaging moment-to-moment."** The same retune that made combat
interesting introduced a cluster of new onboarding/tuning rough-edges (§2), and the single biggest piece is
*unchanged*: the four-pillar House Influence **engine** + the first tier ascent — the spine the whole ~28.5 h
vision rests on — is still a locked silhouette (`step.ts onSeasonBoundary` is a byte-identical no-op; no
tier/pillar state; `rewards.ts` has no `pillarDeltas`). **The next milestone is now unambiguous: build the
macro engine (§7).**

---

## 2 · What v0.2 changed (the new substance)

### Fixed — the v0.1 weaknesses v0.2 closed
- **#1 binary combat → a graded rolling frontier.** Seed-robust (fixed `FORECAST_SEED`, n=400 → identical for
  every player): monkey 0.32/0.67/0.88/0.99, wolf 0.05→0.96, boar 0.01→0.69, **bandit a genuine multi-level
  wall** (0 to L4, 0.09@L5, 0.70@L8, 1.0@L13). A meaningful "next target" at every level. *The single biggest
  fun gain, and it's real.*
- **Dead values + no reinvestment → a fenced economy.** `skillYieldNum` (work→skill→faster, L1 byte-identical,
  +4%/lvl, ×3 cap) + koku→estate / sansai→cook / `attributePoints`→Might/Guard/Vigor, all behind a
  build-**failing** `G-NO-DEAD-VALUES` ratchet (`EXPECTED_INERT` asserted empty).
- **The silent dead-end → the arc lands.** Cold-open card at frame one, R3 chapter-close, the dream-2 payoff
  (first reader of `dream-1`/`porters-knot`), the 4-pillar macro teaser. (Note: dream-2 *deepens*, doesn't
  resolve; the macro stays locked — it's a chapter-close, not a payoff.)
- **The tests grew teeth.** The two named false-green tests deleted; the curve gate now asserts the *exact*
  number the UI shows (displayed == tested == same for all); the ≥30-min floor is RED-able-tested in `verify`
  (REAL 31/35/38 min). Commit `0bf2d5d` self-caught a **re-introduction of the exact v0.1 "test guards a number
  players don't see" flaw** and killed it. `migrate()` wired; the `as unknown` cast replaced with a `tsc`
  exhaustiveness ledger.

### New weaknesses v0.2 introduced (the honest cost of the retune)
- **The marquee stance "decision" is half-tuned.** 上段/Aggressive is the strict single-fight win-rate leader in
  **100% of sampled foe/level cells**, and 中段/Balanced — the **named default** (`state.ts:122`) — is strictly
  *dominated* on several foes (boar@L4: Balanced 42 < Guarded 45 < Aggressive 54). The HP-retention axis that
  *should* justify the defensive stances is **mechanically inert across a grind** (every fight starts at
  `hpMax`; `combat.ts` never reads carried HP), and the durability-wear cost is auto-repaired away — so the
  choice collapses to "pick Aggressive," and the out-of-box default is the trap pick.
- **The 0.32 first-fight headline is best-case only.** It holds at pristine pole + full satiety; it degrades to
  **0.06–0.19 under satiety** (the auto-loop only rests at <25%) and **0.02–0.26 under durability wear**, and a
  fresh L1 player has no wood to repair. The early durability soft-stuck can strand a fresh combat player below
  L2 with a broken pole *at the exact moment combat unlocks* — the same worst-possible-moment pattern v0.1
  flagged, in a new form. **Mitigated (real)** by the auto-repair + Broken-stop guard, but a genuine "can feel
  punishing/slow" wrinkle.
- **Onboarding regressed (6 → 5.5) — the only dimension that fell.** estate/cook/the macro teaser reuse the
  reveal-as-plot pattern well, but the two *combat-tab* additions — the flagship **Stance** and **Training** —
  ship with **no reveal narration** and surface their tradeoffs **only via desktop-hover tooltips** (dead on the
  44px touch target). The wear axis that makes stance a tradeoff is surfaced in **zero pixels**, so the one
  legible signal (the live win-rate pip) actively teaches "Aggressive is just better" — the opposite of the
  intended lesson.
- **The reinvestment flywheel self-saturates.** koku is the headline currency, but its only sink is the finite,
  explicitly curve-**neutral** 3-stage estate (1100 koku total, buys a satietyMax buffer that never touches
  win-rate); rung pacing is per-*act* not per-koku, so the ×3 multiplier accelerates a currency with nowhere
  compounding to go. A real loop — but shallow and quickly self-saturating. *The single biggest reason
  Incremental stops at 7.*

---

## 3 · Carryover (still-open from v0.1 — referenced, not restated)

These are unchanged in v0.2; the v0.1 report is the full record. *(§ = v0.1 report section.)*

| Still-open finding | v0.1 ref |
|---|---|
| **No audio** (Q50) — the per-deed hit still "feels like nothing" (now juiced *visually* via number-pop, but silent). The largest single unaddressed *fun* item. | §2.1 / §3 #3 |
| The **four-pillar macro ENGINE** + seasonal appraisal + tier ascent is still unbuilt (v0.2 added only a static greyed teaser) — the demo still can't demonstrate the PRD's spine. | §1 / §2.6 / §6.2 |
| **Quests** (main + side) entirely absent. | §2.4 / §4 #8 |
| **Crafting** recipes absent. | §2.4 |
| **NPC dialogue** ("speak to the members") still has no mechanic. | §2.4 / §3 #11 |
| 2nd weapon is still the **gifted axe**, not found/crafted ("never gifted as power" unmet). | §2.4 / §6.2 |
| Combat is still an **idle auto-battler** (timer + toggles), not moment-to-moment active play. | §2.1 |
| **Active-only**, no offline catch-up (FU23) — intentional; an open human call (H6). | §2.5 / §5 |
| **Big-number spectacle** never materializes (modest rewards, shallow sinks). | §2.6 / §6.2 |
| "**Areas to explore**" / §1 "full maps" still only gestured — v0.2's room-grouping is organizational, not walkable. | §2.4 |
| Onboarding's **explanatory half** still thin (body/satiety bar unlabeled; koku's purpose unstated; hover-only). | §3 #13 |
| The **`app/main.ts` driver loop + 15s autosave** remain largely test-free — *now worse:* v0.2's safety-critical durability soft-stuck guard was placed in this untested zone. | §2.7 / §3 #16 |
| Mobile **O(foes×sims) forecast** cliff — quantitatively worsened (n=48 → n=400) but still off-frame; no perf test. | §2.7 |

---

## 4 · Actionable improvements (the v0.2 forward list)

Ranked; **NEW** = introduced/surfaced by v0.2, **↩** = carryover (full detail in the v0.1 report).

1. **↩ (critical/large) Build the four-pillar House Influence macro ENGINE + the first T0→T1 tier transition.**
   The stated spine and largest scope gap; v0.2 shipped only a teaser. One end-to-end tier transition is the
   first proof the 5-tier vision closes a loop. *Now the headline forward item — shape in §7; gated on H3.*
2. **NEW (medium) Make the stance a real non-dominated choice + un-dominate the default.** Rebalance
   `STANCE_MODS` so no stance is strictly win-rate-dominated and the default is Pareto-optimal — *or* carry HP
   between fights / make Aggressive's wear actually bite. Add a "no stance strictly dominated" curve test
   (today `m2.test.ts:119` *enshrines* the dominance).
3. **NEW (high/small) Tame the early durability+satiety friction so the *lived* first fight stays in-band.**
   A small starting-wood stock / gentler early wear / stop+repair the auto-loop at Battered-with-no-wood, +
   a "fresh-L1-no-wood reaches L2 before Broken" test. Keeps the humbling challenge without the punishing-slow
   feel.
4. **NEW (high/small) Surface the stance wear axis in pixels + give Stance/Training a reveal beat** (drop
   hover-only on the 44px target). The flagship v0.2 mechanic is the least self-explanatory thing in the build.
   *Highest-leverage onboarding fix.*
5. **NEW (high/medium) Give koku a recurring and/or power-bearing sink** beyond the finite curve-neutral estate
   (market / upkeep / gear, or wire koku into the macro pillars) so the reinvestment flywheel feeds back.
6. **↩ (high/medium) Add the SFX/audio layer** — the highest-leverage *remaining* fun item; number-pop covers
   only the visual half.
7. **NEW (high/small) Refresh `roadmap.md`** — it lags the build (no v0.2 row; still end-loads the
   already-built ≥30-min regression to M6; names a stance reveal at M3a that D-047 shipped at R3; sequences a
   large content M3a ahead of the macro engine). Bake the now-live gates into M3a's DoD as forward contracts.
8. **NEW (medium/small) Test the durability soft-stuck guard + cover `app/main.ts`** — lift an
   `autoLoopDecision` pure fn into the core and unit-test its three branches; add a `document.hidden`/dirty
   autosave guard test. (v0.2's own safety-critical fix is currently uncovered.)
9. **↩ (medium/large) Quests / crafting / NPC-dialogue / found-equipment breadth** — the forward content list
   *after* the macro engine.

---

## 5 · Consequent PRD / doc changes (new in v0.2)

1. **Annotate the PRD body where v0.2 diverged** so a body-only reader isn't misled: the stance-at-R5 spots
   (§§ ~315/361/964/969/1628) need an inline "(pulled forward to R3 in v0.2 — see D-047)"; the divergence
   currently lives only in the ADR ledger.
2. **Spec the curve at a realistic mid-grind state, not just pristine + full-satiety** — the signed 20–35% band
   should be defined *and tested* at a representative durability/satiety the player actually fights at (0.32 →
   0.02–0.26 under normal wear/hunger); require the auto-loop to keep the *realized* win-rate within a small
   delta of the displayed forecast.
3. **Specify stance as a genuine non-dominated tradeoff** (no strict win-rate dominance; default not the worst
   pick) and *decide/record* whether HP carries between fights (today it resets — the `takenMult` axis is inert
   across a grind). Add it as a curve invariant.
4. **Promote the live `balance.CURVE_*` bands into §4.6 as the graded-curve SPEC**, tighten the loose 0.15/0.85
   choice band toward the ~35–75% Even band, and bless §4.6.4b's analytic-for-gate / sampled-for-display split
   (the ~0.1+ divergence is now a tested fact). **Codify: displayed == tested == same-for-every-player** (a
   fixed forecast seed) so a guard test can never again protect a number players don't see — the v0.1→v0.2
   lesson.
5. **Specify the koku-sink economy** — ≥1 recurring/compounding consumer beyond the finite curve-neutral
   estate; pin the skill→yield-multiplier vs progression relationship as an ADR (is the saturating flywheel a
   decision or an accident?).
6. **Define an onboarding contract per new system** — a reveal beat + an inline mechanical hint + a
   **touch-legible** (no hover-only) tradeoff readout — as a DoD line; amend **D-047** to require the stance's
   wear/atk/damage tradeoff be legible without hover before "shipped"; add a cross-cutting "no hover-only
   affordances" rule (given the 44px mobile commitment).
7. **Soften the residual timing over-claim** — §6.8.2 still says the migration chain was "built FULL +
   unit-tested in M0"; it's now genuinely wired+tested, so adjust to "wired in v0.2, not M0."
8. **Refresh `docs/living/roadmap.md`** (see §4 #7) + add a standing "Acceptance Gates" section so new tiers
   extend `G-CURVE` and new currencies extend the no-dead-value ledger.
9. **Update the UI bible** to spec the cold-open *field* (paper/dark-kura wash + vignette), the font-load
   contract, and the new mandated surfaces (macro-teaser panel, number-pop/tally-flash) so the next pass can't
   regress the first-impression art direction.

---

## 6 · Decisions for the human

- **H1–H6 remain open and are not penalized.** v0.2 deliberately decided none of them. The now-load-bearing
  ones: **H1** (DEMO-vs-REAL default), **H2** (which encounter carries the 20–35% band), **H3** (macro
  teaser-vs-engine timing — decides the *shape* of the next milestone: spine-first spike vs T0 content-first).
- **Two worth elevating (new, from this battery):**
  - **The koku-sink depth fork** *(→ suggest a new H-item / ADR)* — a finite power-neutral estate vs a
    recurring/power-bearing consumer. The most load-bearing incremental gap v0.2 leaves open; it decides whether
    the reinvestment loop ever *compounds*.
  - **The teaser pillar scope** *(→ a one-line ADR)* — show all 4 greyed pillars at T0 (current; reads as a
    roadmap) vs strictly the 2 revealed per §1.6.3 (reveal the rest at their tier). A taste/fidelity call.
- The v0.2 **tuning rough-edges** (dominated default stance, durability/satiety friction, slower XP, saturating
  koku sink) ship tagged *provisional — tune by playtest*; they're the agent's tuning/ADR calls, not
  locked-intent forks — you're the taste arbiter on how aggressively to rebalance, but they don't gate forward
  progress.

---

## 7 · The next milestone — the macro engine (a de-risking spike)

All four of the fun / incremental / macro-gap / roadmap lenses converge here. Recommended shape: **prove ONE
tier transition end-to-end on thin content before broadening.**

1. **Prereq:** the rung ladder must reach the **R7 capstone** that *opens* Phase 2 (PRD §1.6.4). **H3** decides:
   build the full R3→R7 content first, or thread minimal rungs to unblock the spine.
2. Add `influence` to `GameState` **additively** for the two T0-revealed pillars (Arms 武威 + Estate 家産), each
   `{value, highWater}` — up-only with recoverable dents.
3. Wire the two locked accrual shapes: **(A)** achievement **jumps** via the promised `pillarDeltas` on
   `RewardBundle` (0.04/event cap), **gated to Phase-2/post-R7 only** (FU7 — gate on tier-phase, never on
   rungs); **(B)** seasonal **judged results** via `onSeasonBoundary` (today a no-op), firing on a *new
   high-water mark only*, bounded ±10% via a **day-keyed named RNG sub-stream** (one-RNG rule, preserving
   tick-semigroup determinism). Target the locked **70/30** deeds/seasonal split.
4. Implement the **hybrid good/great/excellent tier-gate** (T0 2-pillar special), commit `tier` 0→1 as a
   **stored** value (D-014), play the T0→T1 story gate, reveal Office as the 3rd pillar, un-grey the teaser into
   live bars.
5. **This is the first real `SCHEMA_VERSION` bump** — exercise the just-wired `migrate()` in anger (a v0.1/v0.2
   save must back-fill zero-influence / tier-0 cleanly, with a covering test).
6. Keep the **three combat tracks separate** (kill→character level; deed→Arms; rung activity→Combat Rank — the
   PRD-named likeliest regression); add macro acceptance tests with the v0.2 RED→GREEN discipline (deeds don't
   accrue pre-Phase-2; seasonal fires on high-water only; a dent never advances high-water; the gate is
   reachable).
7. **Concurrently** land the cheap §4 tuning fixes (un-dominate the stance, starting-wood/gentler wear, the
   stance/Training reveal + touch-legible wear axis) and refresh `roadmap.md` — none block the engine, all
   sharpen what a reviewer sees.

---

## 8 · Method & convergence

12 lenses (the 7 scored dimensions + roadmap + 4 v0.2-specific blind-spots: rough-edges, macro-gap,
test-integrity, onboarding) + a convergence/de-dup critic, each firsthand-grounded and code-verified. **Verdict:
CONVERGED** — the lens verdicts are mutually consistent and independently re-confirmed against the v0.2 code
(test count 99, the fixed `FORECAST_SEED`/n=400, the chudan default, the no-op `onSeasonBoundary`, the missing
`pillarDeltas`, the `STANCE_MODS` driving the dominance finding). Two cross-lens calibrations were *reconciled,
not left open*: Fun → 6.0 (a half-point under the earlier re-score's 6.5, on firsthand stance-dominance +
degradation evidence) and Human-feedback → 8.5 (a half-point above, on firsthand seed-robust verification).
Remaining work is **build** (the macro engine) + named tuning — not more auditing.

*Doc-drift fixed alongside this report: the v0.2 changelog said "98 tests"; the suite is 99 (the attribute-ledger
test landed after that line was written).*
