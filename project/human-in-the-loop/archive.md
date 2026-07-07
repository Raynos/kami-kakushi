# Human-in-the-loop archive (closed H-items + R-items)

A **lean crosswalk** of resolved `H`-decisions and `R`-reviews — the closed index for
[`decisions.md`](decisions.md) and [`review.md`](review.md) (which hold **open** items only). One line per
item; IDs never reused.

This file is an **index, not the record**. The durable "why" lives in the **ADR** it graduated to
([`../../docs/living/decisions.md`](../../docs/living/decisions.md)); the verbatim human intent lives in
[`../feedback-human/`](../feedback-human). Don't re-paste prose here — link.

> **Graduation rule.** A resolved item graduates to an **ADR** when it's a decision future-us needs the
> *rationale* for. Purely **mechanical / structural** items get an archive row but **no ADR**. A closed
> `R`-review (a taste/playtest call) archives the same way once its verdict lands — moved out of `review.md`
> into the **Reviews** section below. See the [README](README.md) for the full lifecycle.

## Decisions (closed H-items)

| H# | Title | Resolution (one line) | → ADR | Date | Intent |
|----|-------|-----------------------|-------|------|--------|
| H1 | Pacing-floor visible before M6 | Ship real D-049 pacing as default + a DEV-only speed toggle | **D-056** | 2026-06-29 | [decision-session](../feedback-human/2026-06-29-decision-session.md) |
| H2 | Humbling first fight (20–35%) | Keep the signed 20–35% **single-fight** win-rate band | **D-058** | 2026-06-29 | [decision-session](../feedback-human/2026-06-29-decision-session.md) |
| H3 | Tease the macro layer now | Resolved by the tier reshape — active + locked-silhouette teaser | **D-055** (+D-048…D-055) | 2026-06-29 | [decision-session](../feedback-human/2026-06-29-decision-session.md) |
| H4 | Ban "SHIPPED (slice)" | Milestone-integrity rule (all-DoD-or-amend + CI manifest) | **D-054** | 2026-06-29 | [decision-session](../feedback-human/2026-06-29-decision-session.md) |
| H5 | Seed-breadth scope | Showcase-in-miniature; 2nd weapon found/crafted, not gifted | **D-052** | 2026-06-29 | [decision-session](../feedback-human/2026-06-29-decision-session.md) |
| H6 | Active-only vs idle bar | Active-only; ~~wall-time catch-up (don't pause on hidden)~~ **⤴ REVERSED by D-079 (2026-06-30): active-only PAUSE on hidden** (the D-053 text is the fix) | **D-053** → **D-079** | 2026-06-29 | [decision-session](../feedback-human/2026-06-29-decision-session.md) |
| H7 | `ship-gate` skill | **Don't build** — rides H10's defer; D-054 owns the policy | **D-070** | 2026-06-29 | [h-item-decisions](../feedback-human/2026-06-29-h-item-decisions.md) |
| H8 | Split the 7k-line PRD | Split into `prd/§1…§7` (mechanical) — batched in the PRD ripple | _none (mechanical)_ — *(ripple tracker retired 2026-06-29)* | 2026-06-29 | [decision-session](../feedback-human/2026-06-29-decision-session.md) |
| H9 | `resolve-queue` skill | **Drop** — resolve decision queues by hand | **D-070** | 2026-06-29 | [h-item-decisions](../feedback-human/2026-06-29-h-item-decisions.md) |
| H10 | Operating Model v2 | **Defer** the bundle; adopt the lean pre-commit gate ad hoc | **D-070** (defer) + **D-071** (gate) | 2026-06-29 | [h-item-decisions](../feedback-human/2026-06-29-h-item-decisions.md) |
| H11 | T0 material-surplus sink (2nd craft recipe?) | **Option C** — accept surplus as WAI for the miniature; material economy is a T1+ concern (battery #15 closed) | **D-095** | 2026-07-01 | [h11-material-surplus](../feedback-human/2026-07-01-h11-material-surplus.md) |
| H12 | Version source: footer showed v0.2, not v0.3.1 | Single-source the displayed version from **package.json** (→ 0.3.1); git tags never read by game/HTML/TS | **D-096** | 2026-07-01 | [session-38 journal](../journal/2026-07-01-session-38-doc-staleness-reconcile.md) |
| H13 | Estate E-numbering collision (F1) | Two distinct axes: keep `E0–E5` narrative condition; rename built purchase steps to `U1–U4` "kura-works" | **D-098** | 2026-07-01 | [reconcile plan](../archive/2026-07-01-prd-standalone-endstate-reconcile.md) |
| H14 | T0 market scope (F2) | Bless the buy-only provisioning shop (personal koku sink); **player ≠ estate finances**; trade engine = T2 | **D-099** | 2026-07-01 | [reconcile plan](../archive/2026-07-01-prd-standalone-endstate-reconcile.md) |
| H15 | Combat resolution model (F3) | Keep the PRD 5-attr + accuracy/evasion model; **build it at T0** (v0.3.2) | **D-100** | 2026-07-01 | [reconcile plan](../archive/2026-07-01-prd-standalone-endstate-reconcile.md) |
| H16 | Stance cost-axis (F4) | Glass cannon ↔ tank (attack vs damage-taken); retire wear-as-the-axis | **D-101** | 2026-07-01 | [reconcile plan](../archive/2026-07-01-prd-standalone-endstate-reconcile.md) |
| H17 | Weapon roster / craftability (F5) | "≥1 craftable" (amends D-052/D-095); T0 ships 3 weapons (pole + 2) | **D-102** | 2026-07-01 | [reconcile plan](../archive/2026-07-01-prd-standalone-endstate-reconcile.md) |
| H18 | Interactive resumable combat (F6) | Defer to forward-tier (T1/T2); auto-resolve stays the T0 spine | **D-103** | 2026-07-01 | [reconcile plan](../archive/2026-07-01-prd-standalone-endstate-reconcile.md) |
| H19 | T0 Phase-2 pacing band (the ~0.4-min anticlimax) | Phase 2 ≈ Phase 1 (~1:1) as a GENERAL rule → ratio band `[0.8, 1.2]`, HARD gate, + a quick T0 hotfix; real economy redesign queued | **D-133** | 2026-07-04 | [h19 brainstorm](../brainstorms/2026-07-04-h19-t0-phase2-pacing-band.md) |
| H20 | Promote the balance-report freshness WARN → hard gate? | **B — keep the WARN** (no-op process call; not yet ignored, so no promotion; revisit if it starts getting missed) | kept as WARN (no ADR; see **D-132** §5a) | 2026-07-04 | (in-session steer) |
| H21 | Per-agent worktrees vs the shared working tree | **A — status quo** (no per-agent worktree/branch/merge weight wanted; the shared-tree guards stay load-bearing permanently) | kept shared tree (no ADR; raises the value of context-hardening P2/P3) | 2026-07-05 | (in-session steer) |
| H22 | Journal shape for routine commits (the 4× write-up) | **A — status quo** (hand journals stay; `SKIP_JOURNAL=1` already covers trivial commits; write-up cost accepted as the price of the memory model) | kept journal gate (no ADR) | 2026-07-05 | (in-session steer) |
| HD-23 | R3 Battered blade with no visible mend path (s88) | **C** — keep the R4 repair gate, add a diegetic `.lock-hint` at R3 ("mended by hands the house has come to trust"); hint from 3 ADR-139 takes (HR-10) | **ADR-141** | 2026-07-06 | (in-session steer) |
| HD-24 | Fresh-profile save import sits behind the whole intro (s88) | **B** — a quiet "Restore a saved game" line under the cold-open wake verb, reusing the Saves modal (re-parented to root so it overlays the pre-awake card) | **ADR-142** | 2026-07-06 | (in-session steer) |

## Reviews (closed R-items)

| R# | Title | Resolution (one line) | → ADR / outcome | Date | Intent |
|----|-------|-----------------------|-----------------|------|--------|
| R3 | T0-M4 breadth diverge picks | Superseded — folded into the unified per-variant **R2** review | **D-075** (diverge v2) | 2026-06-30 | [r4-playtest-decisions](../feedback-human/2026-06-30-r4-playtest-decisions.md) |
| R4 | v0.3 fidelity-battery judgment queue (6 calls) | All 6 decided via AskUserQuestion (clock / fork / auto-combat / cold-open / breadth / koku) | **D-076…D-079** (+D-056) | 2026-06-30 | [r4-playtest-decisions](../feedback-human/2026-06-30-r4-playtest-decisions.md) |
| R9 | UI-remaster direction (`ui-demos/` field of 10) | **10 Andon Steel** locked as UI-v2's direction; 01–09 anchored as the exploration record (not deleted) | **D-127** | 2026-07-04 | (in-session steer) |
| R10 | F7 balance-cockpit W1–W4 tunings | Adopted the proposed candidates: `RICE_PER_RAKE 3→2` (W1), `RICE_SELL_PRICE_BY_SEASON.autumn 3→4` (W2), `EAT_RICE_COST 3→2` (W3); **W4 no-op** (D-133 already lands the capstone ~96 min). Applied to canon in-session; rung pacing unchanged (Δ +0.0), Phase-2 ratio 0.94 in band | **D-134** (via the F7 apply-flow / D-132) | 2026-07-05 | (in-session steer) |
| HR-9 | ADR-139 story DEV surfaces — reader variant + switcher | **Galley columns** picked FIRM (in-session lean → FB-125 verbatim retire order); annotated/stage retired, switcher confirmed by use | FB-122…FB-125 drained; galley is THE reader | 2026-07-06 | [2026-07-06-playtest](../feedback-human/2026-07-06-playtest.md) |
| HR-10 | HD-23 R3 mend-hint line — 3 ADR-139 takes | **Take C** locked (human override of the take-B self-pick), reviewed LIVE in the DEV switcher (ADR-143): _"The edge is going. Not yet mine to mend — climb higher, then set it right."_ Bundle pruned; canon carries C | **ADR-141 / ADR-143** | 2026-07-06 | (in-session steer) |

> _Open reviews live in [`review.md`](review.md): **R1** (playtest) · **R2** (UI variants, per-variant, D-075)
> · **R5** (bestiary) · **R6** (home panel) · **R7** (estate map) · **R8** (rung cast/beats)._
