# Roadmap Re-axe — 6-Lens Adversarial Review Report

> **Reviews:** [`project/archive/2026-06-29-roadmap-reaxe-proposal.md`](../../archive/2026-06-29-roadmap-reaxe-proposal.md) *(archived session-12)*
> **Review run:** `wf_eca8a1e8-e5f` · 2026-06-29 · 6 review lenses + 6 adversarial verifiers (12 agents, opus-4-8[1m])
> **Raw verbatim findings:** [`project/brainstorms/raw/2026-06-29-roadmap-reaxe-review.json`](../../brainstorms/raw/2026-06-29-roadmap-reaxe-review.json)
>
> Every finding below is cross-referenced with its adversarial-verifier verdict. **Severities are the verifier's `adjustedSeverity`**, not the lens's original (downgrades noted inline). **No finding was `refuted`** — all 38 were `confirmed` or `partial`; the "Refuted" appendix records that. Issues raised by multiple lenses are merged and tagged with every lens that raised them.

---

## 1. Executive Summary

**Net verdict across lenses:** 5 of 6 lenses returned **approve-with-fixes**; the **Completeness** lens returned **revise**. Consolidated call: **APPROVE-WITH-FIXES, conditional** — the proposal is substantially faithful to the 23 locked decisions and the 6-tier reshape, and its structural skeleton (4/3/3/3 milestones, gap-free T0 fun-slice IDs, coherent R0→R15 rung math) is sound. But it **cannot supersede the M0–M7 roadmap as-is**: the Completeness lens's "revise" is driven by real, confirmed gaps — the entire OLD-M6/M7 back half (release, balance/polish gate, fun-proxy gate, perf, a11y) was silently amputated — and the proposal bakes a UI gate (DIVERGE) the canon has since *held*. Fix the majors below, add a release/gate phase, and it graduates cleanly.

**Highest-severity confirmed findings (one line each):**

1. **DIVERGE baked as a mandatory per-slice DoD contradicts D-070**, which HELD that gate as *not adopted*; the "pending H10 sign-off" wording is now stale (pre-commit = ADOPTED/D-071, playcheck + DIVERGE = HELD). *(major; Decision-fidelity + Internal-consistency)*
2. **No v1 RELEASE milestone** — v1 "ends" at the narrative ending (`t3done`), not a deploy; the cross-origin-iframe save-survival test (PRD §6.8, M7-deferred) and D-017's manual human-approved itch upload are orphaned. *(major; Completeness + Open-questions)*
3. **OLD M6 dissolved with no successor gate** — no consolidated whole-v1 balance/polish acceptance and no fun-proxy report-only→gate promotion (perf gate also dropped). *(major; Completeness + Open-questions)*
4. **Accessibility acceptance pass missing** — PRD §2.21 + D-045 (a canon **T0** infrastructure concern) reduced to scattered "touch-legible/mute-safe" DoD crumbs in the one tier the proposal fully details. *(major; Completeness)*
5. **"Locked spine D-048..D-055" claim silently drops D-053 + D-054** — wall-time/leave-it-running clock, and the milestone-integrity DoD that `pending-prd-changes.md` *explicitly assigns to this very re-axe*. *(major; Decision-fidelity)*

---

## 2. Blockers & Majors (confirmed / partial)

No item survived verification at **blocker** severity (C1 was downgraded blocker→major). The five confirmed majors:

### B1 — DIVERGE mandated as canon, but D-070 HELD it
- **Severity:** major (verified `confirmed`) · **Lenses:** Decision-fidelity (L1-F1), Internal-consistency (L2-03, and L2-02 downgraded major→minor as subsumed here)
- **Claim:** The proposal makes the mandatory DIVERGE contact-sheet a forward DoD contract on every new-UI fun-slice and calls it "the human's 2026-06-29 call." The *later* same-day op-model review (D-070) superseded decision #10 and **HELD the diverge gate as not adopted**. Under newest-wins (D-022), the canonical roadmap would mandate a held gate. The "pending H10 sign-off" framing is stale for all three op-model gates: pre-commit was greenlit + built (D-071), playcheck + DIVERGE stay HELD (D-070).
- **Proposal evidence:** Legend (l.25-26) "DIVERGE (mandatory UI variant contact-sheet per new surface — human's 2026-06-29 call)"; cross-cutting (l.162-164) "Operating-Model-v2-lite gates (pending H10 sign-off): … the mandatory DIVERGE contact-sheet … become forward DoD contracts"; repeated unconditionally at l.73/74/80/88/98/99.
- **Contradiction (source):** decisions.md **D-070**: "The mandatory `diverge` UI gate (DS#10) and the `playcheck` ratchet remain HELD (not adopted)…"; **D-071**: pre-commit gate "Built this session." pending-prd-changes.md: "don't wire it as canon until op-model v2 is signed."
- **Recommendation:** Before graduation to `roadmap.md`: demote DIVERGE from a hard per-slice DoD to a recommended/optional practice (or mark it HELD pending v2-lite revival); mark the pre-commit gate ADOPTED; mark playcheck HELD; delete the stale "pending H10 sign-off" wording (H10 is resolved = deferred). If the human wants DIVERGE kept as a real gate, note that doing so *reverses* D-070. *(L2-02's secondary observation — DIVERGE missing from the quest-tab, stance/ability-slot, and estate-upgrade slices despite the "mandatory per surface" legend — resolves automatically once DIVERGE is demoted.)*

### B2 — No v1 RELEASE milestone; iframe save-survival test orphaned
- **Severity:** major (verified `partial`; **downgraded blocker→major** by the verifier — D-017 still holds the release gate, so it vanishes "from the roadmap," not "from canon," and T3 is admittedly coarse) · **Lenses:** Completeness (C1 + C2), Open-questions (L6-F7)
- **Claim:** The proposal positions itself to *supersede* M0–M7, but its terminal milestone (T3-M3) ends the **game** (bounded ending + free-play), not the **project** (a deploy). There is no ship/deploy/upload slice anywhere (grep: 0 hits for release/deploy/upload/itch). The one deliberately M7-deferred save test — the itch cross-origin-iframe partition/eviction survival test — loses its home.
- **Proposal evidence:** T3 frame (l.142) "v1 ends here (`outcome: t3done`)"; T3-M3 (l.148) "the bounded 'v1 complete' surface → free-play"; header (l.7-8) "supersedes the M-milestone roadmap once approved."
- **Contradiction (source):** roadmap.md M7 "itch.io release … + the cross-origin-iframe save-survival test"; **D-017** "M7 = deploy … release gate = local `npm run verify` … manual, human-approved upload" *(both lenses mis-cited this as D-016; line/content correct, ADR label wrong)*; PRD §6.8 (l.2296) "Built FULL in M0 (only the itch cross-origin-iframe partition test is deferred to M7)."
- **Recommendation:** Add a terminal **RELEASE milestone** (e.g. T3-M4 "Ship v1") or a cross-cutting "v1 release gate," carrying: D-017's release gate (`npm run verify` incl. the §4.8 pacing regression) + the **manual human-approved itch upload** (CLAUDE.md requires explicit human approval for outward-facing deploy, so it MUST be explicit, not an implicit tail) + build stamp/About-Credits/LICENSE (D-041) + the **cross-origin-iframe save-survival test** (C2) as a pre-ship DoD. Re-anchor PRD §6.8's "deferred to M7" reference to the new home. Explicitly distinguish the GAME ending (`t3done`) from the PROJECT release.

### B3 — OLD M6 dissolved: no balance/polish gate, no fun-proxy gate-promotion (perf dropped too)
- **Severity:** major (verified `confirmed` for the balance/polish + fun-proxy halves; perf is a `partial`/minor sub-item) · **Lenses:** Completeness (C5 balance/polish *confirmed major*; C4 fun-proxy *confirmed major*; C3 perf *partial → minor*), Open-questions (L6-F8 *partial → minor*)
- **Claim:** OLD M6 was a dedicated balance-pass-to-§4.8-targets + fun-proxy-gate-promotion + perf-gate + polish-loop milestone. The re-axe distributes balance into per-slice DoD (G-CURVE, DISPLAYED==TESTED) and correctly homes the ≥30-min floor regression at T1-M1, but there is:
  - **no consolidated whole-v1 balance/polish acceptance** (the ~28.5h floor + cross-tier win-rate curve + a polish loop) — *confirmed, the most legitimate of the cluster*;
  - **no fun-proxy report-only→gate promotion** — the only nearby instrument is the *unsigned* op-model-v2-lite `playcheck` ratchet, which is a wiring/plumbing check, not the fun-proxy *measurement* — *confirmed*;
  - **no perf gate/budget** ("perf" appears 0 times) — *real but softened: the decision session reclassified perf as an agent's-own-call, so it's acknowledged not lost; text+CSS+SVG game, modest but non-trivial given the new walkable map*.
- **Proposal evidence:** T1-M1 (l.119) "≥30-min floor regression test goes live" (this IS placed); cross-cutting (l.169) "Acceptance gates extend, never regress" extends curves but schedules no end-of-v1 pass; gates list (l.162-164) names only the unsigned op-model ratchet + DIVERGE.
- **Contradiction (source):** **D-017** "M6 = balance pass to the §4.8 targets … + polish"; roadmap.md M6 "balance + fun + perf gates; polish loop … Promote the report-only fun-proxies to a gate"; **D-043** "interim perf budgets become an M6 gate"; **D-019** makes fun the make-or-break instrumented gate.
- **Recommendation:** Add a **pre-release balance + polish gate** (in T3 or the B2 release phase): final §4.8 ~28.5h-floor acceptance across the whole T0→T3 path + consolidated win-rate-curve check + a dedicated polish pass. Add an explicit forward DoD promoting the **fun-proxy measurement** from report-only to a gate, **decoupled from the unsigned op-model bundle** so it survives even if H10 is rejected. Add **"perf budget"** to the DoD forward-contracts legend (frame budget / no-jank on the heaviest surfaces — the walkable map and the ascension ceremony).

### B4 — Accessibility acceptance pass missing
- **Severity:** major (verified `confirmed`) · **Lens:** Completeness (C6)
- **Claim:** PRD §2.21 makes a11y a **T0 (infrastructure)** concern with a concrete acceptance surface: a persistent quiet a11y entry point from minute one, an ARIA live-region, a large-textScale reflow case, a screen-reader acceptance pass, full keyboard + touch, a mute toggle, and the D-045 AA-ink rule. The re-axe contains none of these as a slice or pass — only fragmentary DoD phrases — in the *one tier it fully details*.
- **Proposal evidence:** Only fragments: T0-M1-F4 (l.74) "reduced-motion/mute-safe" (SFX-respects-mute, *not* the PRD's mute-toggle control); T0-M2-F3 (l.81) / T0-M4-F5 (l.100) "touch-legible." No a11y slice; no screen-reader/textScale-reflow/ARIA/keyboard/AA-ink acceptance.
- **Contradiction (source):** PRD systems table (l.1176) "2.21 | Accessibility, audio & presentation register | **T0** | — (infrastructure)"; PRD l.2431-2434 (entry point + ARIA live-region + textScale reflow + screen-reader pass); D-045 (AA-ink rule).
- **Recommendation:** Add a **T0 a11y-infrastructure fun-slice** (mute toggle, keyboard + touch operation, AA-ink, ARIA live-region, persistent a11y entry point) and a **v1 a11y acceptance pass** (screen-reader + large-textScale reflow) into the B2 release gate. a11y is canon T0 infrastructure, not a DoD afterthought.

### B5 — "Locked spine D-048..D-055" completeness claim drops D-053 + D-054
- **Severity:** major (verified `confirmed`) · **Lens:** Decision-fidelity (L1-F2)
- **Claim:** The proposal's central fidelity claim is that it encodes the 6-tier reshape D-048..D-055. The spine summary + cross-cutting enumerate D-048/049/050/051/052/055 but never encode **D-053** (active-only "leave it running" = advance the sim by elapsed wall-time, don't pause on `document.hidden`) or **D-054** (milestone-integrity rule: all-DoD-met-or-ADR-amended + CI manifest check; bans "SHIPPED (slice)"). Two of eight reshape ADRs are absent, so the claim is overstated. **D-054 is the load-bearing half** — `pending-prd-changes.md` explicitly assigns the "milestone-integrity DoD" to this very roadmap re-axe, and the per-milestone "verify-green gate" only half-covers it (engineering-green ≠ all-DoD-met-or-ADR-amended + CI manifest check).
- **Proposal evidence:** Legend/spine (l.27-32) lists D-048/049/050/051/052/055; cross-cutting (l.152-169) covers mentor/dev-tools/save/op-model/PRD-liquid/acceptance — nothing for D-053 or D-054.
- **Contradiction (source):** D-053 "the simulation must advance by elapsed wall-time … Do NOT pause the sim on `document.hidden`"; D-054 "a milestone is SHIPPED only when every DoD line is met OR formally amended via an ADR … a CI manifest check asserts every instrument a DoD names resolves to a real test/tool. Bans SHIPPED (slice)"; pending-prd-changes.md assigns "milestone-integrity DoD" to this doc.
- **Recommendation:** Add two cross-cutting forward-contracts: (a) D-053 wall-time/leave-it-running clock behaviour; (b) D-054 milestone-integrity (every DoD line met-or-ADR-amended + the CI manifest check). Or narrow the "encodes D-048..D-055" claim. D-053 is the weaker omission (more a code/clock ripple than a roadmap item).

---

## 3. Minors & Nits (confirmed / partial)

### Minors

| ID | Title | Sev (verdict) | Lens(es) | Essence + fix |
|----|-------|---------------|----------|---------------|
| M1 | Wrong ADR cited: "tier 0→1 stored (D-014)" | minor (`confirmed`) | Decision-fidelity (L1-F3), Internal-consistency (L2-04) — **dup** | D-014 = "one antagonist per tier"; stored-tier is **D-013a** (enum-widening 0..5 is D-048). Change the citation. |
| M2 | DEMO/REAL pacing-fork retirement absent from the retune list | minor (`confirmed`) | Decision-fidelity (L1-F4) | Decision #1 / D-056 retires the DEMO/REAL profile fork, but the T0 carry-forward retune list never names it as a concrete code change (only implied via "decision #1"). Add "retire the fork; real D-049 is the only profile; review velocity via the DEV 2×/4×/8× multiplier." |
| M3 | First `SCHEMA_VERSION` bump pinned to M3-F3, but breaks earlier | minor (`partial`) | Buildability (L4-F3) | The first breaking change (removing `balanceProfile` when the fork is retired, M1-area) lands before M3, so the bump+wipe belongs at the first reshape retune commit. Low-stakes (dev saves wiped, no users); keep only "real `migrate()` built+tested before launch" as a launch gate. |
| M4 | M3 spine-spike spec gaps: R7 seam + Estate deed sources | minor (both `partial`, **downgraded major→minor**) | Buildability (L4-F1, L4-F2) | (a) M3-F1 fires on the **R7 capstone** but M4 "fills R4→R7" (code defines only R0→R3) — DoD-clarity gap, not an order-breaker (M3-F1's DoD already lists the R7 capstone; M1-F4 teleport gives test access). State M3 owns the **R7 seam** definition; M4 fills the R4→R6 *journey*. (b) The Estate pillar's natural deed engine (koku flywheel, D-051) is M4-F2, built after M3 — so name the **minimal M3 deed sources** (rung promotions, existing E0→E3 `estateStage`, labour/combat) so the 70% deed channel is live before the M4 flywheel deepens it. |
| M5 | Loot→craft loop: M2-F2 mis-tagged + full-loop re-expansion debt not carried forward | minor (`confirmed` L4-F6; `partial`/nit C8) | Buildability (L4-F6), Completeness (C8) | M2-F2 is tagged ✅/🔧 (retune) but the loot-table→find→craft loop was never built (M2b shipped a grant) — re-tag 🆕 and size as new work for M2 effort estimation. The M2b "re-expand the full loop at M3/M5" debt isn't tracked forward (C8, mostly intended T1+ coarseness). |
| M6 | Status-marker presentation drift | minor (`confirmed`) | Internal-consistency (L2-05) | M3/M4 tables drop the per-slice Status column that M1/M2 carry; the combined "✅/🔧" marker isn't in the legend. Carry-forward mapping itself is coherent (presentation drift only). Add the marker to the legend / unify the columns. |
| M7 | Stale "auto-producers T3+ only" collides with renumbered T3 = Region | minor (`confirmed`) | Vision-fidelity (L3-03) | "Auto-producers T3+" was written under the OLD numbering (T3 = Castle-town, post-v1). Under the reshape T3 = Region (inside v1), so a literal read admits an idle layer into v1 — violating active-only/mediocre-start. A name-only renumber sweep misses it (D-048's consequence list omits §2.5/§1.12). Flag: every "T3+" producer threshold → **"T4+"**. Proposal adds no producers itself. |
| M8 | ~28.5h budget never re-derived against 4 tiers / 16 rungs | minor (`partial`) | Vision-fidelity (L3-02) | The estate is now two tiers (~16 rungs) vs the old single 4.5h estate tier; proposal commits to the counts without re-deriving the §4.8 floor. Out-of-scope for a roadmap and already a tracked pending-PRD ripple + D-048 consequence; budget is a FLOOR (overshoot allowed). Reference the §4.8 re-derivation. |
| M9 | v1-close: castle-town/Daikan stub + positive terminal-state test (D-Q-B11) not reconciled | minor (`partial`, **downgraded major→minor**) | Vision-fidelity (L3-01) | Proposal PRESERVES the signed "v1 complete" surface (which per PRD §3.7.0 *is* the castle-town first-contact beat), but doesn't name two things under the renumber (Castle-town T3→T4): (a) the "page turns onto stone walls" narrative teaser, (b) the explicit **positive terminal-state test (D-Q-B11)**. Partly by-design (T3 is COARSE, DoD deferred). One-line human flag: the v1-end semantics + D-Q-B11 must survive the renumber, not be silently reframed to a Region-only ending. Couples to B2. |
| M10 | Crash-recovery terminal / safe-mode test orphaned | minor (`confirmed`) | Completeness (C7) | D-044 pinned the safe-mode-boot terminal/crash test to M6; M6 is gone. Save spine is carried forward but its test isn't. Fold into the B2 release gate's DoD alongside the iframe test. |
| M11 | OQ "now CLOSED" overstates finality | minor (`partial`) | Open-questions (L6-F1, L6-F2, L6-F6) | OQ-2/OQ-4 are human-locked (DS#18/#19); OQ-6 is ADR-backed but *provisional*; OQ-1/OQ-3/OQ-5 are **agent-default calls** the session left "surfaced for optional steer" — not closed. (The Source column already labels these "delegated → agent call," so it's a one-line header-softening fix, not a conflation.) See §4 for per-OQ adjudication. |

### Nits

| ID | Title | Sev (verdict) | Lens | Note |
|----|-------|---------------|------|------|
| N1 | Coarse-tier "Example fun-slices" undershoot ≈3-5 | nit (`partial`, **downgraded minor→nit**) | Internal-consistency (L2-01) | Structural counts exact (4/3/3/3 = 13; T0 = 4/4/3/5 = 16). T1-M3/T2-M2/T2-M3/T3-M2 list 2 — but the column is explicitly "Example fun-slices" / coarse / re-detailed-on-approach, so ≈3-5 binds only on detailed T0. One-line clarity note. |
| N2 | ≥30-min floor not reasserted on T2/T3 grind rungs | nit (`partial`, **downgraded minor→nit**) | Internal-consistency (L2-06) | Legend already scopes it "T1+ only" (logically binds T2/T3) and the regression harness is built once at T1-M1. Add the floor to the "extend, never regress" list for clarity. |
| N3 | Rung math coherent; "FU7"/"Phase 2" used without gloss | nit (`confirmed`) | Internal-consistency (L2-07) | R0→R7 = 8, R8→R15 = 8, = 16 reconciles; gate grades + Phase-2/FU7 deed-gating faithful to D-023/D-049; R7 dual-reference is content-vs-event, not overlap. Gloss "Phase 2"/"FU7" once on first use. |
| N4 | T0 koku flywheel labelled both "LINEAR" and "it compounds" | nit (`partial`, **downgraded minor→nit**) | Vision-fidelity (L3-05) | D-066 "LINEAR" = a single un-branched reinvestment line that still compounds (≠ flat additive). The same line already says "→ it compounds" and "guards a compounding sink" twice, so the feared ambiguity is pre-empted. Optional one-line gloss. |
| N5 | "(the TRADE taste)" label could conflate D-052 market with D-066 sub-engine | nit (`partial`, **downgraded question→nit**) | Decision-fidelity (L1-F7) | No real contradiction — F2 already states sub-engines branch at T1 (D-066) and F3's market is a "capped koku sink" (= D-052 showcase). Reword the parenthetical. |
| N6 | Win-rate DoD omits n=400 and explicit "same-for-every-player" | nit (`confirmed`) | Decision-fidelity (L1-F8) | D-057 codifies fixed-seed n=400 + "displayed == tested == same-for-every-player." Fixed-seed implies determinism; ADR carries n=400. Optional to add to the DoD. |
| N7 | Diegetic-mentor onboarding (M1-F3) spans M1→M4 | nit (`partial`, **downgraded minor→nit**) | Buildability (L4-F7) | D-064's world-discovery leg fully lands only with the walkable map (M4-F4), but M1-F3's DoD scopes narrowly to reveal-as-plot (no over-claim) and the proposal already frames onboarding as a recurring T0 thread. Mark the contract as spanning M1→M4 so M1-F3 isn't claimed DoD-complete against all of D-064. |

---

## 4. Open Questions

### (a) Are the 6 "resolved" OQs genuinely closed? — Open-questions lens adjudication (L6-F1, verified `partial`)

| OQ | Proposal status | Genuine state | Verdict |
|----|-----------------|---------------|---------|
| **OQ-1** (keep 4/3/3/3) | CLOSED | **Agent default, steerable** — session left it "surfaced for optional steer." Also in tension with open NQ-3(b) (L6-F2). | Papered-over → re-tag "agent default" |
| **OQ-2** (spine-first) | CLOSED | **Genuinely closed** — human-locked DS#18. | Closed ✓ |
| **OQ-3** (≈3-5 per fun-slice) | CLOSED | **Agent default, steerable.** | Papered-over → re-tag |
| **OQ-4** (carry-forward) | CLOSED | **Genuinely closed** — human-locked DS#19. | Closed ✓ |
| **OQ-5** (keep BOTH …) | CLOSED | **Agent default, steerable.** | Papered-over → re-tag |
| **OQ-6** (~8 T1 rungs ≈ R8→R15) | CLOSED | **ADR-backed (D-052) but PROVISIONAL** per the freeze. | Backed, not hard-locked → re-tag "provisional" |

**Fix:** one-line honesty edit to the table — keep OQ-2/OQ-4 "CLOSED (human-locked)"; re-tag OQ-1/OQ-3/OQ-5 as "agent default — steerable, no contrary signal"; OQ-6 as "ADR-backed but provisional." No call changes, only claimed finality. (NB: L6-F2's "OQ-1 directly contradicts NQ-3(b)" was downgraded major→minor — NQ-3 self-labels option (b) as "breaking the 4/3/3/3 cut" and defaults to (a) which keeps it, so it's a transparently-flagged override lever, not a hidden clash.)

### (b) Concrete recommendations for the three NEW open questions

- **NQ-1 — ceremony inside the thin spike** *(L1-F6, L4-F4, L6-F3 — all verified `confirmed`/`question`)*: **Confirm option A — the FULL ceremonial beat IS part of T0-M3-F3's DoD** (title card, macro silhouettes stir, music swell, dream/mystery beat per D-055, grade-scaled boon reveal). The ceremony is **content-independent** (it swells off the House-Influence panel built in M3-F1; the audio rides the M1-F4 SFX system built earlier) — it needs nothing from M4. **Reject option B** ("functional ascension in M3, swell later"): its premise is false and it would let a *non-big* first ascension land in the spine-first playtest/R1 window, **violating #14 / D-062** ("always lands big on first contact"). The human can simply say "yes, ceremony in M3."

- **NQ-2 — mentor cast** *(L6-F4, verified `confirmed`)*: **Use the existing canon domain-split cast — do NOT invent an "estate elder."** The labour loop (T0-M1) is taught by **Chief Steward Genemon** (the spine's primary rank-gatekeeper/quest-giver); **Kihei** is already canon "The mentor" for combat/training at R3; **Sōan** grounds the amnesia. Re-pose NQ-2 as "confirm the canon cast (Genemon labour / Kihei combat / Sōan healing) vs collapse to a single mentor." **This must be settled before T0-M1-F3** (a 🆕 slice in the *first* milestone), so it is NOT freely deferrable. (Caveat: D-063 itself uses the loose "e.g. drillmaster Kihei / an estate elder" phrasing, so the proposal echoes the ADR rather than fabricating — but the authored cast is the right answer.)

- **NQ-3 — walkable-map scope** *(L4-F5, L6-F5 — verified `confirmed`)*: **Pick option (a) — minimal walkable map in T0-M4, grown in T1.** It is the only option consistent with *both* D-065 (a walkable map, not room-grouping) *and* OQ-1 (4/3/3/3). **Strike option (c)** ("bare room-graph in T0") — it re-introduces exactly the organizational room-grouping D-065 just reversed. **Gate option (b)** (own milestone → T0 = 5 milestones) on the human reopening OQ-1. NQ-3 is genuinely non-blocking (the map sits in M4, after the M3 spike, which needs no map movement); **pin a concrete node-count ceiling** in M4-F4's DoD so "small" can't balloon and crowd M4's cadence.

### (c) NEW open questions the proposal SHOULD have raised *(C9, verified `confirmed`; L6-F7/L6-F8)*

The proposal headlines that it "RESOLVES all 6 open questions" and raises NQ-1/2/3, but the structurally larger questions created by superseding M0–M7 were never surfaced:

1. **Where does v1 RELEASE / itch deploy live now that M7 is gone** — a terminal T3-M4 milestone or a cross-cutting release phase? *(must be explicit — outward-facing deploy needs human approval per CLAUDE.md; see B2)*
2. **Is there a dedicated balance / fun-proxy / perf / polish gate** (old M6), or does it dissolve into per-slice DoD? *(see B3)*
3. **Where do the crash/safe-mode (D-044) and cross-origin-iframe (PRD §6.8) save-survival tests land?** *(see B2/M10)*

Also worth surfacing as design-confirm questions (currently buried as findings):
- **Name 家格 has no dedicated ascension within v1** *(L3-04, verified `partial`/question)* — by design (D-048 places it at the T3→T4 crossing = the v1 boundary), so v1's only Name payoff is the four-pillar gate-clear / rivals-dethroned beat. Confirm this is a satisfying capstone for the 4th pillar; resolve jointly with M9/B2 (if the T4 first-contact stub is dropped, Name loses even its partial-ascension teaser).
- **T3-M3 "four-pillar gate" vs "v1 ends at t3done"** *(L1-F5, verified `partial`/question)* — clarify that v1 has exactly **three** ascensions (T0→T1, T1→T2, T2→T3) and *reveals/builds* the four-pillar board but **stops at** the gate; the T3→T4 (Castle-town) crossing is post-v1. (The proposal is already reasonably clear — "gate" not "ascension," no "→T4" milestone — so a one-line note closes it.)

---

## 5. Gaps — what the Completeness lens found silently dropped from the M0–M7 back half

The re-axe quietly amputates the entire OLD-M6/M7 phase. The word "perf" appears 0 times; "release/deploy/itch/M7/iframe" appear 0 times. Where each missing item should slot:

| Gap | Source mandate | Sev (verdict) | Where it should slot | Cross-ref |
|-----|----------------|---------------|----------------------|-----------|
| v1 RELEASE / itch deploy + manual human-approved upload | D-017; roadmap M7; PRD §1 ("deployable to itch.io") | major (`partial`) | New terminal **T3-M4 "Ship v1"** or cross-cutting release gate | **B2** |
| Cross-origin-iframe save-survival test | PRD §6.8 ("the one M7-deferred piece") | minor (`partial`, **↓ from major**) | Release-gate DoD (pre-upload) | **B2** |
| Consolidated whole-v1 balance + polish gate (§4.8 ~28.5h floor + win-rate curve) | D-017; roadmap M6; PRD §4 | major (`confirmed`) | Pre-release balance+polish gate (T3 / release phase) | **B3**, M8 |
| Fun-proxy report-only → GATE promotion | roadmap M6; D-019 | major (`confirmed`) | Explicit forward DoD, **decoupled from the unsigned op-model bundle** | **B3** |
| Perf gate / perf budget | D-043 ("interim perf budgets become an M6 gate") | minor (`partial`, **↓ from major** — reclassified agent's-own-call) | "perf budget" in the DoD forward-contracts legend + release gate | **B3** |
| Accessibility acceptance pass (screen-reader, textScale reflow, ARIA, keyboard, mute toggle, AA-ink) | PRD §2.21 (T0 infra); D-045 | major (`confirmed`) | A **T0 a11y-infrastructure slice** + a v1 a11y acceptance pass in the release gate | **B4** |
| Crash-recovery terminal / safe-mode test | D-044 | minor (`confirmed`) | Release-gate DoD (alongside the iframe test) | M10 |
| Full loot-table→craft loop re-expansion + bestiary growth | roadmap M2b ("re-expand at M3/M5") | nit (`partial`, **↓ from minor**) | Explicit T1-M2/T2 fun-slice (mostly intended T1+ coarseness) | M5 |
| ~28.5h budget re-derivation across 4 tiers | PRD §4.8; D-048 consequence | minor (`partial`) | §4 / generated balance content (already a tracked ripple) | M8 |

---

## 6. Refuted / Not Real (appendix)

**None.** The adversarial verifier marked **no finding `refuted`** (none received `adjustedSeverity: "dropped"`). All 38 findings across the 6 lenses were `confirmed` or `partial` and are carried above. For the trail, the most heavily *softened* findings (verifier downgraded but did not drop) are:

- **C1** (release milestone): blocker → **major** — D-017 still holds the release gate in canon, and T3 is admittedly coarse, so it vanishes "from the roadmap," not "from canon."
- **C2 / C3 / L6-F8** (iframe test / perf / perf-gate-home): major → **minor** — single deferred test still PRD-pinned; perf was an explicit agent's-own-call; the §4.8 pacing regression is *not* homeless (hosted at T1-M1).
- **L2-02** (DIVERGE missing from new-surface slices): major → **minor** — subsumed by B1; once DIVERGE is demoted per D-070 the missing lines are moot.
- **L3-01** (castle-town stub): major → **minor** — proposal preserves the canonical "v1 complete" surface; only the narrative teaser + D-Q-B11 test naming is un-reconciled under the renumber.
- **L4-F1 / L4-F2** (R7 seam / Estate deeds): major → **minor** — DoD-clarity gaps, not blocking forward dependencies.
- **L6-F2** (OQ-1 vs NQ-3(b)): major → **minor** — transparently-flagged conditional override, not a hidden self-contradiction.
- **L3-04** (Name ascension): minor → **question** — consistent-by-design with D-048, only a human-confirm.
- **L1-F7 / L3-05 / L2-01 / L2-06 / L4-F7**: downgraded to **nit** (concerns the proposal text already pre-empts or that are intended coarseness).
