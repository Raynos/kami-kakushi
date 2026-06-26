# Session 01 — 2026-06-26 — PRD battery review → decision-resolution (multi-round /loop)

## ☀️ SUMMARY (read this first)

The session that **stress-tested the PRD and turned it into a prioritized decision queue.** Ran a **4-round
multi-agent battery review** of `docs/prd.md` (~52 lenses · 162 confirmed findings), **auto-applied 42 verified
fixes**, and queued **56 design decisions (Q1–Q56) + one process decision (PD-1 → ADR D-021)**. The battery has
**SATURATED** (closed after round 4 on the convergence-critic's verdict). Resolved the freeze-vs-steer tension:
**"freeze" = locked intent only** (§1 vision + signed acceptance criteria), the §4/§7 plan stays provisional.

**Current phase:** DECISION-RESOLUTION → **PRD V2** (the human's iterative loop: *resolve 56 decisions → PRD V2
→ build M0/M1 → playtest → resteer → PRD V3 → build*). **Live state** lives in
[`memory/project-status.md`](../memory/project-status.md); the **prioritized queue** is
[`brainstorms/2026-06-26-prd-decisions-master.md`](../brainstorms/2026-06-26-prd-decisions-master.md); the
**full findings report** is [`brainstorms/2026-06-26-prd-battery-review.md`](../brainstorms/2026-06-26-prd-battery-review.md).

*(This file is HISTORY — a chronological log of how the session went, oldest→newest. It is NOT the live
snapshot; that is `project-status.md`.)*

---

## 1 · Round 1 — the broad 14-lens battery
93 agents · 78 raw → **60 confirmed** findings, each adversarially verified. Applied **22 clerical fixes** to
`prd.md` (broken `../../` canon links ×6 + `../history` ADR link; stale Name JUDGE_K → 4,500/42,000 & XP-curve
→ 1.2K/17K/1.1M; STR def/hpMax cell; baseSpeed SPD-0 anchor; Kuzuhara no-personal-tie + "birthplace"→"hamlet";
Jūbei "rescue"→"never rescued"; GameState `currentArea`/`dent`/EquipState; §6.8 save-list + Rewards
`pillarDeltas`; splitmix64 pinned; R0 pacing-exemption; E3 "prosperous" gloss ×3) + D-008 (政威→官威 note) and
H2 marker in the intent log. **Vision/intent fidelity confirmed intact** — all issues mechanical. Queued **Q1–Q12**.

## 2 · Round-1 bug-fixes + autonomous mode begins
Human steer: *"keep going, keep doing batteries, don't wait for me."* Applied the two named unambiguous defects
(held all design forks): **Q7a** — E2/R6 floor Estate ≥1K → **0.6K** (it exceeded the 0.8K tier gate = a
deadlock); **Q5** — the T2 Otsuru/true-name climax was double-gated (guaranteed G6 spine beat *and* gated behind
optional Origin O5) → resolved to **spine-guaranteed at G6**, O5 recast as optional reunions+buff.

## 3 · Round 2 — deeper / fresh angles
92 agents → **37 confirmed** (Q13–Q28). 6 fixes (Stance.defMod; __qa pacing()/reveals(); §4.2.2 autumn-label
fix; fun-factor floor-proxy). **Devil's-advocate lens:** no round-1 false positives, but it caught **2 incomplete
round-1 fixes** — the Arms floor (also unreachable, 0.4K→**0.3K**) and the name-reclamation *half* of the climax
(now **Q25**).

## 4 · PD-1 raised — freeze vs steer
Human process question: building M0/M1 then steering — does that collide with K5 (freeze prd.md + explode)?
Logged **PD-1** in the report §P: scope "freeze" to **locked intent** (§1 + signed acceptance criteria), NOT the
provisional plan (§4 levers / §7 M2–M7). Battery evidence backed it (vision layer = zero drift; gaps all in the
plan layer).

## 5 · PD-1 approved & wired — ADR D-021
Human signed. A doc-alignment workflow applied **21 byte-exact, coherence-checked ops across 7 docs** (new
**D-021** refining D-020; canon K2/D-020; intent-log **K7**; `project-status.md`; `CLAUDE.md` convention;
`prd.md` framing preamble; `docs/README.md`). The freeze line now reads identically everywhere. **Docs NOT
exploded yet** — deliberate (build first, per D-021 at the time).

## 6 · Round 3 — specialized deep methods
84 agents → **39 confirmed** (Q29–Q42). 6 clerical fixes. Genuine bugs flagged (provisional per D-021): **Q29**
(T0 gate proof spends 72ip on trade deeds that can't exist in T0; koku net/gross double-count), **Q37** (itch
cross-origin-iframe IndexedDB can wipe the single 28.5h save). **Cross-round conflict:** Q40 vs Q25 (name-reclaim
on spine vs Origin track) → human call.

## 7 · Round 4 — battery CLOSED (saturated) + master decision sheet
58 agents → **26 confirmed** (Q43–Q56), declining yield = saturation. The **fix-reverification lens caught a
regression I had introduced** (added `currentArea` to §6.4 but omitted it from the §6.8 persist list I rewrote
in the same pass) — **fixed**, + 5 other clerical. **Convergence verdict: STOP + CONSOLIDATE** (remaining signal
is build-gated). Produced the consolidated **MASTER decision sheet** (56 decisions, build-gating subset surfaced).

## 8 · Process locked — iterative V1→V2→V3 + dynamic-depth briefs
Human set the governing loop: **resolve 56 decisions → PRD V2 → build M0/M1 → playtest → resteer → PRD V3 →
build** (settle the design forks into a strong V2 *before* code). Recorded as a sequencing refinement on **D-021**
(supersedes its "build-first" order; freeze=locked-intent unchanged). Q&A will be **tier-by-tier, one at a time**,
with **dynamic-depth briefs** (one-liner for obvious calls; fuller only for nuanced/low-context ones).

## 9 · Decision ranking — 5-perspective panel
Ranked all 56 decisions by impact via a panel (architect / designer / build-lead / risk-QA / holistic lenses) →
a consensus priority order with P0–P3 tiers + decision dependencies. *(Result landed; to be folded into the
master sheet in priority order with brief-depth tags — see Next steps.)*

## 10 · Journal convention fix (this entry)
The human flagged that this journal had become incoherent — checkpoints *prepended* (newest-first) on top of a
stale snapshot. Studied `ironsight-saga`'s convention (summary-at-top + chronological iteration entries appended
at the **bottom**; live state in a separate snapshot doc) and **adopted it**: restructured this file, and locked
the convention in `CLAUDE.md` + `journal/_TEMPLATE.md`.

## 11 · Decision ranking folded into the master sheet
A 5-perspective panel (architect/designer/build-lead/risk-QA/holistic) scored all 56 decisions by impact;
synthesis produced a consensus priority order (P0=6 · P1=9 · P2=22 · P3=19), dependency-corrected so every
prerequisite outranks its dependents. **P0 (decide first):** Q1 level model · Q2 RNG/save spine · Q3 persisted
surface · Q6 conditioning · Q30 rung-gating · Q34 data-model gaps. Rewrote
`brainstorms/2026-06-26-prd-decisions-master.md` in priority order with brief-depth tags (●/●●/●●●), the
dependency/merge clusters, low-agreement flags, and a resolution-log to fill during the Q&A. Raw:
`brainstorms/raw/2026-06-26-prd-decisions-ranking.json`.


## 12 · P0 decisions resolved (human Q&A, AskUserQuestion UI)
Worked the P0 tier with the human via the decision UI. Resolved Q1 (level=combat-only), Q2 (per-named-stream
RNG cursors + int ticks), Q3 (market-only persist + derive weather + beliefBeasts module). Two LOCK/SCOPE
changes the human chose: **Q6 relaxes D13** (the no-labour→combat wall) into a *bounded* cross-feed — every
skill grants a small capped combat bonus (conditioning = the weak→capable gate); big combat power stays
combat-only (Q1). **Q30** adds a numeric rung-meter curve gated by BOTH the meter AND story milestones
(rung-specific activities feed it; pillars separate; double-counting OK). **Q34** puts intra-line dialogue
branching in v1. Recorded in the master-sheet resolution log; the two ⚠ items need ADRs in V2. Next: P1.


## 13 · Governing rule + first lock change (ADR D-022)
Human: "the decisions we make now override the previous decisions." Recorded **ADR D-022** — the V1→V2 Q&A
decision log is AUTHORITATIVE; a V2 decision supersedes any conflicting prior ADR/canon/K-item/lock (annotate,
don't delete). First application: **Q6 relaxes the no-labour→combat-cross-feed lock** (D-011 / D-016 / D13) into
a bounded per-skill capped combat bonus. Annotated D-011, D-016, D13 → D-022; master sheet + project-status note
the rule. (The combat-only level/attribute economy from Q1 stays the invariant — no uncapped back door.)


## 14 · P1 decisions resolved (9, via decision UI)
Worked P1 with the human. Q7 → a HYBRID "specialization" gate model (good in ALL pillars / great in 2-3 /
excellent in 1-2 — breadth required, specialization rewarded; reverses the locked "no floor/overflow", per
D-022). Q14 comfortable/net koku (~18-19K held, double-count killed). Q29 keep no-market-in-T0 (re-itemize
land/treasury). Q36 ban Math.pow (integer-pow + lint). Q44 atomic autosave + calm "couldn't save" notice.
Q13 defer coin/market to M4 placeholder. Q5 → name reclamation Origin-GATED/missable (truth stays spine);
auto-resolves Q25+Q40. Q24 castle-town/Daikan ending. Q31 combat IS satiety-throttled (re-spec the locked
first-fight win-rate "at adequate satiety"). All in the master-sheet resolution log; ⚠ Q7/Q31 change locks.
15 of 56 decisions resolved (P0+P1 — the foundational tier + the spine). Next: P2 (22, lighter).


## 15 · P2 decisions resolved (19, via decision UI)
Worked all of P2 with the human. Several reshaped the design: Q15 combat is INCREMENTAL (T0 = 1 weapon, more
unlock per tier — a new combat-progression-ladder surface); Q17 higher stamina floor + a general no-UI-dumps /
stagger-gently rule; Q10 distinct activities = top-level tabs (main screen stays the active loop); Q8 author E3
for v1 (estate E0→E3); Q22 T2 gets BOTH anti-slump devices (seasonal rotation + cross-pillar combos via a §4.3
exception); Q37 multi-backend redundant saves (IndexedDB + localStorage, newest-timestamp wins); Q33 graded
durability bands, never auto-unequip; Q45 backwards-compatible (protobuf-style) save schema. Recs accepted:
Q16 retreat, Q47 satietyMax-grows, Q4 fun-in-milestones, Q35 weather ±10%, Q32 dent restore, Q28 verifier
checks, Q55 world registry, Q27 swap real names, Q19 mobile+save-safety, Q18 a11y, Q38 inline-SVG+CC0.
34/56 resolved. Next: P3 (19).

## 16 · P3 decisions resolved — ALL 56 DONE
Worked all of P3 with the human via the UI (they chose to go through every one, not bulk-accept). Notable:
Q23 = NO quest-type budget (supersedes D-012's "lean 4" — add quests freely per stage); Q50 = "good audio",
mixed synth + CC0/original (the one acknowledged small asset set); Q51 permissive code + reserved content;
Q26 add a Naoyuki T1 beat. The rest accepted as recommended. **ALL 56 decisions + PD-1 resolved**, recorded in
the master-sheet resolution log. ~16 changed a locked/scope decision (per D-022). Next: PRD-improvement plan → V2.

## 17 · All feedback consolidated into prd_human_feedback.md (Block L + precedence rule)
Human: "record all my feedback in one cumulative doc; if anything contradicts, favour the most recent."
Added **Block L** to docs/prd_human_feedback.md — all 56 V2 Q&A decisions grouped by theme (🔁 marking the ~16
that changed a prior lock/scope), plus PD-1 / D-022 — so that doc is now the single cumulative human-feedback
record alongside A–K. Added a **precedence rule** to the header: newest wins; Block L supersedes A–K wherever
they differ (per D-022). Per-decision detail stays in the master sheet.


---

## Next intended steps (current)
1. **Author the PRD-improvement plan** from the resolution log (all 56 decisions + the ~16 lock/scope changes) — what changes where in `prd.md`, and which need ADRs.
2. **Reshape `prd.md` → PRD V2** per that plan; record the load-bearing lock-changes as ADRs (per D-022).
3. Then build M0/M1 → playtest → resteer → V3 (the iterative loop).

## Landmines (current)
- **42 fixes already applied to `prd.md`** this session (re-verified in round 4; 1 self-regression caught & fixed).
  `git diff 0b60422..HEAD -- docs/prd.md` shows them all; the report tables list each with rationale.
- **§4/§7 findings are PROVISIONAL** per D-021 — they evolve into V2, they are not must-fix-now bugs.
- This journal is **HISTORY**. Live state = `memory/project-status.md`; prioritized queue = the master decision sheet.
- No code yet (pre-M0).
