# Decision session — 2026-06-29 (v0.2 audit reconciliation + forward decisions)

> **What this is.** A running ledger of the 2026-06-29 human-driven decision pass. We reviewed the v0.2
> state-of-the-game audit ([`../audit/reports/2026-06-28-state-of-the-game-v0.2.md`](../audit/reports/2026-06-28-state-of-the-game-v0.2.md))
> against the recent reshape (ADRs **D-048…D-055**). A verification workflow
> ([raw](../brainstorms/raw/2026-06-29-v02-audit-open-decisions-diff.json)) confirmed the reshape already
> **closed almost every audit item**; this session resolves the genuine residuals + gathers more feedback.
>
> **Process steer (human, this session):** the human drives — go through all docs/reports/reviews and make
> all the decisions first; **then ripple the PRD in ONE batch** (there is more to append beyond the current
> [`pending-prd-reshape.md`](../status/pending-prd-reshape.md) checklist). Decisions captured here verbatim;
> **ADRs + the PRD-body ripple follow as one batch**, not piecemeal.

## Already CLOSED by the reshape (verified — NOT re-asked)

koku-sink → **D-051** · stance dominance + HP-carry → **D-050** · teaser scope → **D-055** · seed breadth (H5)
→ **D-052** · active-only (H6) → **D-053** · milestone-integrity (H4) → **D-054** · next-milestone shape (H3)
→ **D-048/D-049 + the reshape directive** · which-encounter (H2, "which" half) → **D-047/D-035** · v1 scope
T0→T3 → **D-048 + fork #1** · "is the saturating flywheel a decision?" → **D-051** (yes, by design).

## Decisions LOCKED this session

1. **Pacing default (resolves H1).** Ship the **real D-049 pacing** as default (T0 ~10–15 min/rung,
   floor-exempt; T1 ≥30 min/rung) + a **DEV/debug-only 2×/4×/8× speed toggle** for review/playtest velocity
   (a time multiplier, *not* a Demo/Real profile fork). → supersedes D-047's "DEMO profile stays the shipped
   default."

2. **Audio/SFX timing.** A **minimal SFX pass** (hit / reward / rank-up cues) lands **before the R1 taste
   call**; the full synthesized bed comes later. (Scope already locked in D-041.)

3. **Win-rate computation (amends signed D-043).** **Bless the analytic-for-gate / sampled-for-display
   split** — analytic for the tier/gate check; fixed-seed sampled (n=400) for the *displayed* win-rate;
   codify **displayed == tested == same-for-every-player**. To be recorded as an ADR explicitly amending the
   human-signed D-043 (a provisional build ADR must not silently override a signed lock).

4. **Process (Q1).** Human drives the decision pass. **H10 (Operating Model v2): reel it back — it's an
   overengineered draft.** **PRD ripple: gather more human feedback first → then one batch.**

## Decisions LOCKED this session (batch 2)

5. **First-fight criterion (H2-residual).** KEEP the signed **20–35% single-fight win-rate** as the
   first-fight criterion. HP-carry (D-050) affects the *grind*, not the discrete first-fight moment; agent
   tunes a real foe into band at realistic durability/satiety under the new model + a RED-able test. No
   re-expression — the signed single-fight band stands.

6. **PRD structure (H8).** **Split** the 7k-line `prd.md` into per-section files (`prd/§1…§7.md`) + a tiny
   completeness check, **as part of** the batched ripple. Mechanical, zero content change; removes the
   truncation failure class.

7. **PRD freeze (refines D-020/D-021/D-046).** **Do NOT freeze §1 now.** Keep the PRD **open/liquid through
   T0/T1/T2** implementation. Freeze possibly at **T3**, or — more likely — **never freeze until v1 is fully
   implemented + play-tested**, then **convert the whole PRD into living docs**. → Supersedes the queued
   "freeze §1 after the first build-play cycle"; the one-way door moves to end-of-v1.

8. **R1 timing.** Human does a **quick play now** for early direction signal (cold-open hook / woodblock
   look) before the reshape build; the full taste verdict comes on the rebuilt T0 slice.

## Decisions LOCKED this session (batch 3)

9. **Roadmap re-axe — STRUCTURE (refines the flat S0–S4 idea).** YES, the roadmap must be re-axed — but
   **not a flat S0–S4**. Use a **two-level, per-tier** structure: for each v1 tier **T0 / T1 / T2 / T3**,
   write **N milestones**; **within each milestone, N fun-slices** relevant to that tier's content
   (**Tier → Milestones → Fun-slices**, nested). Claude proposes the cut (human has no S0–S4 context). A
   "fun-slice" ships a *playable, fun* increment, not just a feature.

10. **`diverge` skill = MANDATORY gate** (human steer; overrides the reel-back's opt-in reco). No new UI
    surface ships without a 2–3-variant contact sheet. Feeds the separate op-model review.

11. **Operating Model v2 (H10) — human reviews SEPARATELY (~1 hr).** Not decided this instance. The v2-lite
    reel-back map + #9 (nested roadmap) + #10 (diverge mandatory) are inputs to that review. **The v2 _bundle_ awaits that review — but this is NOT a freeze:** the repo
    isn't locked, and individual improvements are still greenlit and built ad hoc as they come up (e.g.
    the `tdd` skill, allowed 2026-06-29). _(Clarified 2026-06-29: the earlier "do NOT adopt/build op-model
    artifacts until signed off" wording over-read the steer — op-model v2 is a plan to review when it's
    time, not a moratorium on process changes.)_

## Decisions LOCKED this session (batch 4 — taste/direction)

12. **SFX style.** Traditional **Japanese palette** — taiko (combat), shamisen/koto (UI/deeds), shakuhachi
    (big beats), temple bell/鈴 (rank-ups). Anti-slop; matches the woodblock bible. Drives the minimal SFX pass.

13. **Early-game difficulty = humbling THROUGHOUT** (incl. T0). Keep the mediocre-start bite — don't smooth
    the durability/satiety friction or the on-ramp. *Distinct from pacing:* D-049's T0 fast pacing (~10–15
    min/rung) **still holds** — T0 is *quick* but *not easy*. Guardrails stay (winnable, soft-setback only,
    no permanent loss, no true dead-ends/stranding). Revises the audit's "tame the early friction" default.

14. **First tier ascension (T0→T1) = a BIG ceremonial beat.** Always lands big on first contact — Yuji Syuku
    title card, macro silhouettes stir, a dream/mystery beat (D-055), music swell, the grade-scaled boon
    revealed. (Overshoot-grade scaling can layer onto *later* ascensions; the first is always big.)

## Decisions LOCKED this session (batch 5 — build/scope)

15. **Save policy.** **Wipe dev/v0.2 saves on the reshape schema bump** (pre-launch, no users). Build + test
    the real `migrate()` path *before launch*, not across dev churn. (D-013a forward-migration still governs
    shipped saves.)

16. **Dev tools.** **Speed toggle (2×/4×/8×) + a jump-to-rung/tier teleport** — the highest-value pair;
    defer richer dev affordances until a specific test needs them. DEV-only, stripped from prod.

17. **T0 tutorial = STAY non-hand-holdy** (D-015 upheld even in the tutorial). No hint popups; teach by
    reveal-as-plot + world discovery + legible-by-design surfaces. → **Constraint:** the audit's onboarding
    ding (5.5) must be fixed *within* non-hand-holding — clearer reveal beats + touch-legible readouts, NOT
    explicit tutorialization.

## Artifacts produced this session (in `docs/plans/`)

- **Roadmap re-axe proposal** → [`docs/plans/2026-06-29-roadmap-reaxe-proposal.md`](../../docs/plans/2026-06-29-roadmap-reaxe-proposal.md)
  (moved from brainstorms). Nested Tier→Milestones→Fun-slices; T0 detailed (4 milestones), T1–T3 coarse. **6
  open questions**; load-bearing = **within-T0 build order** (spine-spike on thin content first vs
  showcase-breadth first — proposal recommends spine-first).
- **Operating Model v2-lite reel-back** → [`docs/plans/2026-06-29-operating-model-v2-lite-reelback.md`](../../docs/plans/2026-06-29-operating-model-v2-lite-reelback.md)
  (the drop/cut/keep map; input to the human's separate H10 review).

## Decisions LOCKED this session (batch 6 — roadmap & build)

18. **Within-T0 build order = SPINE-FIRST, thin.** Build the Estate pillar + the first T0→T1 ascension on
    minimal content BEFORE the showcase breadth. Prove the four-pillar loop closes (the audit's #1 gap)
    first; the demo's first new beat = the spine landing.

19. **Shipped T0 = CARRY FORWARD + RETUNE** (human reversed an initial "rebuild fresh" — a fresh rebuild
    would be a needless mess). Keep the working, play-tested M0–M2b foundation; layer the reshape on top
    (HP-carry/heal, found-crafted 2nd weapon, the pillar + ascension, SFX, dev tools, humbling-friction tune).
    Matches the roadmap proposal's mapping (M0–M2b → T0-M1/M2). Save-wipe (#15) still handles the schema bump.

20. **Koku flywheel = LINEAR now, BRANCH at T1.** T0 ships a small linear estate-upgrade taste; split into
    LAND / TREASURY / TRADE sub-engines (D-008, trade ≤⅓) at T1 where the depth matters.

21. **Process — durable-by-default (CLAUDE.md amended).** A plan/brainstorm/analysis is a FILE before it's a
    deliverable or implemented — never only in chat/ledger. Homes: `project/brainstorms/` (discovery),
    `docs/plans/` (plans/reel-backs), `docs/` (settled). Driven by the v2-lite-only-in-context miss.

## Decisions LOCKED this session (batch 7 — final audit forks)

22. **Onboarding = DIEGETIC MENTOR.** An in-world character (e.g. drillmaster Kihei / an estate elder)
    teaches each system through dialogue & story as it unlocks — onboarding via narrative, fully
    non-hand-holdy (#17). Lifts the audit's 5.5 ding without tutorial popups; adds character + grounds the cast.

23. **T0 areas = a SMALL WALKABLE MAP** (not just organizational room-grouping). Delivers the §1 "areas to
    explore" promise in the tutorial (per D-012 full-maps-every-tier). More build cost — sequence so it
    doesn't crowd out spine-first (#18).

## v0.2 AUDIT — 100% CLOSED ✅

All **23 decisions** above resolve every human-facing fork in `2026-06-28-state-of-the-game-v0.2.md` (this
session + the reshape D-048…D-055). The rest is agent execution that flows into the roadmap proposal. The
audit report is banner-marked as triaged.

## Still gathering / in flight

- **More PRD feedback** — the human's additional items to append before the single batched ripple (the main
  remaining INPUT — open-ended).
- **R1** — human playing the demo (direction signal) → http://localhost:5173/.
- **Op-model v2 (H10)** — human's separate review (~1 hr), informed by the v2-lite reel-back.
- **Roadmap proposal's remaining delegated details** (milestone count, fun-slice granularity, naming, T1
  rung count) — Claude's calls; surfaced in the proposal for optional steer.

## Agent's own calls (no human fork needed — will execute + note; flag any you want to steer)

stance numbers (no-dominated invariant) · koku-flywheel tuning · slower-XP balance · perf budget/test · the
durability-guard + `app/main.ts` test coverage · the doc-ripple execution · T0 content specifics (the
found/crafted 2nd weapon, the tiny market goods, the NPC lore line) — all delegated / agent-tuning per the
audit §6 + D-052.

## Cross-cutting tangle (intel for the H10 reel-back)

The Operating-Model-v2 plan proposed its ADRs at **D-048–D-051**, but the tier reshape **consumed D-048–D-055**,
and **D-054 already shipped H10's H4 component**. So the op-model-v2 plan is **partly stale** — its numbering +
H4 content must be re-synced (or dropped) when reeling it back. H7/H9 are still absorbed by H10.
