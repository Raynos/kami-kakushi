# Session 01 — 2026-06-26 — PRD battery & stress-test (multi-round)

> **Checkpoint (Round 4 done — BATTERY CLOSED, SATURATED).** 58 agents · 49 raw → 26 confirmed (0H/14M/12L —
> declining yield = saturation). Convergence-critic verdict: **STOP + CONSOLIDATE** (round 4 surfacing typos /
> clerical omissions; remaining signal is build-gated). Re-verification lens caught **1 regression I introduced**
> (currentArea added to §6.4 but omitted from the §6.8 persist list) — fixed first, + 5 other clerical (M0
> surface-list type drift, future-version save guard, §6.11 a11y bullet, log 'milestone' channel + tICK→tick
> typo, late-state keyboard/SR gate). Queued **Q43–Q56** (14). **Produced the consolidated
> [MASTER decision sheet](../brainstorms/2026-06-26-prd-decisions-master.md)**: 56 decisions deduped/prioritized,
> §1 = the build-gating subset (M0 save-spine Q44-46/43, M1 Q47, foundational Q1/Q30/Q31/Q7/Q29), the Q25-vs-Q40
> name-reclaim conflict flagged. FINAL TOTALS: 4 rounds · ~52 lenses · 162 findings · 42 fixes · 56 Qs + PD-1.
> **Loop wound down.** Next action = answer the §1 build-gating decisions, then START M0 (per D-021).


> **Checkpoint (Round 3 done).** 84 agents · 71 raw → 39 confirmed (3H/12M/24L). Applied 6 clerical fixes
> (cold-open first-reveal=koku not Skills; §4.9 levers-index += §4.3 conversion weights & §4.6.1 combat
> constants; RungId→RankId; achievements-comment; itch zip-contents-of-dist). Queued **Q29–Q42** (14) — mostly
> plan-layer (data-model, durability/stamina/weather magnitudes, deploy/itch host matrix), framed PROVISIONAL
> per PD-1. Genuine bugs flagged: **Q29** (T0 gate proof spends 72ip on trade deeds that can't exist in T0;
> koku net/gross double-count), **Q37** (itch cross-origin-iframe IndexedDB can wipe the single 28.5h save).
> **Cross-round conflict logged:** Q40 (keep name-reclaim on spine) vs Q25 (strip to Origin track) — opposite
> recs on the same beat → human call. Totals: 136 findings, 36 fixes, 42 open Qs + PD-1. Completeness-critic's
> round-4 target = the deploy/host-&-browser reality matrix. Launching Round 4.


> **Checkpoint (PD-1 APPROVED & wired).** Human signed the freeze-vs-steer reconciliation. Recorded as
> **ADR D-021** (refines D-020, annotate-don't-delete) and propagated via a doc-alignment workflow (8 agents,
> 21 byte-exact ops across 7 files, all verified count==1 before apply): canon `locked-decisions.md` (K2/D-020
> row + preamble), intent-log **K7** (+ K3/K5 cross-refs), `memory/project-status.md` (phase → "VISION-LOCKED,
> build M0+M1, THEN explode"), `CLAUDE.md` ("Freeze = locked intent, not the plan" convention), `docs/prd.md`
> read-me preamble (the governing FRAMING blockquote) + §7.0/§4.0 nuance, `docs/README.md`. Freeze line stated
> identically everywhere: LOCKED INTENT (§1 + hard constraints + signed acceptance criteria) frozen; §4 numbers
> / §7 M2–M7 provisional; build M0/M1 → playtest → THEN explode (roadmap→living, balance→generated); never
> freeze M2–M7; v1 T0–T2 scope lock unchanged. **Docs NOT exploded yet** (deliberate — build first). Report PD-1
> marked ✅. Round 3 battery (wh8xnl7sr) still running.


> **Checkpoint (Round 3 launched + PD-1).** Human raised a process question: build M0+M1, playtest, then steer —
> does that collide with K5 (freeze prd.md + explode into living docs)? Logged **PD-1** in the report §P:
> reconcile K3 (steer-by-play) vs K5 (freeze) by scoping "freeze" to **locked intent** (§1 vision + signed
> acceptance criteria), NOT the **provisional implementation** (§4 levers / §7 M2–M7, already tagged "proposed").
> Battery evidence backs it: vision layer = ZERO drift across 97 findings; all gaps cluster in the plan layer.
> Rec: build M0/M1 on current prd.md → playtest → THEN explode (freeze=vision-only, living roadmap, generated
> balance). Awaiting human approval of the sequencing + freeze line. Round 3 battery (task wh8xnl7sr) running.


> **Checkpoint (Round 2 done).** 92 agents · 78 raw → 37 confirmed (5H/19M/13L). Applied 6 fixes: Stance.defMod
> type; __qa pacing()/reveals() contract; §4.2.2 autumn-label (s8=winter, autumn=3&7); **completed the
> impossible-gate fix** (E2/R6 Arms 0.4K→0.3K — devil's-advocate caught round-1 only fixed the Estate column);
> fun-factor.md floor-proxy R0 exemption. **Devil's-advocate verdict:** no round-1 false positives; 2 round-1
> fixes were incomplete (Arms floor + the name-reclamation half of the climax = now Q25). Queued **Q13–Q28**
> (16 new decisions). Master report banner now tracks running totals (97 findings, 30 fixes, 28 open Qs).
> Launching **Round 3** (per-section deep-dives, T0 sim, type-level §6 check, naming concordance, impl-readiness,
> inspiration-game comparison, number-spine re-derivation).


> **Checkpoint (round-1 bug-fixes applied).** Human steer: *"keep going, keep doing batteries, don't wait
> for me."* Mode = **autonomous multi-round battery**. Applied the two named unambiguous defects from round 1
> (held all design forks): **Q7a** — E2/R6 floor Estate ≥1K → **0.6K** (it exceeded the 0.8K tier gate =
> deadlock; mirrors the adjacent Arms 80%-of-gate floor); **Q5** — the T2 Otsuru/true-name climax was
> double-gated (guaranteed G6 spine beat *and* gated behind optional Origin O5); resolved to **spine-guaranteed
> at G6** (forced by the locked "Origin never gates the spine"), O5 recast as optional reunions+buff. Now
> launching **round 2+** battery passes from fresh/deeper angles, accumulating the decision queue.


**Summary:** Ran a multi-agent workflow battery-testing `docs/prd.md` from 14 independent audit lenses with
per-finding adversarial verification (93 agents · 78 raw → 60 confirmed findings). Applied **22 verified
clerical fixes directly**; produced one consolidated findings-&-decision report with **12 questions** queued
for the human. No ADR changes yet (the 12 questions will drive those). PRD vision/intent fidelity confirmed
intact — issues are mechanical (level model, save surface, RNG determinism, fun-in-milestones, T2 climax gate,
one impossible T0 gate).

## What changed
- `brainstorms/2026-06-26-prd-battery-review.md` — **NEW.** The single output report: cross-cutting risks,
  the 22 applied fixes, the 12 decision questions (recs included), and the full 60-finding catalog by cluster.
- `brainstorms/raw/2026-06-26-prd-battery-review.json` — **NEW.** Verbatim workflow-output snapshot (durable insurance).
- `docs/prd.md` — 22 clerical fixes: broken `../../` canon links (×6) + `../history` ADR link; stale Name
  JUDGE_K (4,500/42,000) & XP-curve figures (1.2K/17K/1.1M); STR def/hpMax cell; baseSpeed SPD-0 anchor;
  Kuzuhara no-personal-tie rewrite + "birthplace"→"hamlet"; Jūbei "rescue"→"never rescued"; GameState adds
  `currentArea` / `dent` / per-slot EquipState; §6.8 save-list + Rewards `pillarDeltas`; splitmix64 pinned;
  R0 pacing-exemption + "verify-gate" relabel; E3 "prosperous" gloss (×3 spots).
- `docs/history/decisions.md` — D-008 annotated 政威 → superseded by 官威 *kan'i* (annotate-don't-delete).
- `docs/prd_human_feedback.md` — H2 marker ⏳ → ✅ (it contradicted J4 in the same file).

## Next intended steps
1. **Get the human's answers to the 12 questions** (report §C). "Go with your recs" is a valid blanket answer.
2. Highest-leverage to resolve first: **Q1** (level model — blocks M2), **Q2/Q3** (RNG + save surface),
   **Q5** (T2 climax: spine-guaranteed vs Origin-gated), **Q7** (the impossible E2/R6 Estate ≥1K gate).
3. Apply the agreed resolutions to `prd.md` + record the load-bearing ones as ADRs (D-021+).
4. Re-run a focused verification pass on the touched sections, then the holistic consistency sweep (J6).

## Landmines
- **22 fixes already applied this session** — `git diff` against the previous commit shows them; the report §B
  table lists each with rationale. Two touch record files (`decisions.md` D-008, `prd_human_feedback.md` H2).
- The XP-curve and JUDGE_K number fixes were **re-derived by hand** before applying (formula in §4.5.1 / §4.2.2);
  they sync summaries to the authoritative tables, they do **not** retune balance.
- **Q7(a) is a genuine bug, not a question of taste:** R6/E2 require Estate ≥1K but T0 Estate accrual tops out
  at 0.8K (the T0→T1 gate) — a CI pacing run would deadlock. Left unapplied (the *value* is a balance call).
- `numbers-balance-4`'s prose fix was deliberately **withheld** from the applied set (it would prejudge the
  2-vs-3-pillar fork in Q7b) — see report §E coverage notes.
- Report findings are spec-level only — no code exists yet (pre-M0).
