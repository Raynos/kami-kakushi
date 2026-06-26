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


## 18 · Wave-2 follow-up questions generated
Per the human's plan (re-read everything → surface follow-ups BEFORE the V2 plan). A 9-lens workflow read the
PRD + full feedback + the 56 decisions and surfaced the second-order questions the decisions opened up;
synthesized to ~22 prioritized follow-ups in brainstorms/2026-06-26-prd-v2-followups.md (P0 blocks-M0 → P3
tune-later), each with a proposed lean. Key ones: the save-layer M0 scope + determinism-safe newest-save
selector; the RNG/reveal-queue shape; the rung-meter accrual law; the bounded labour→combat cross-feed
channel+cap; the three combat-track disambiguation (level/rung-meter/Arms); mobLevel; the combat-unlock
ladder; the hybrid-gate thresholds; the §7 scope re-cut. Next: human answers the wave-2 (UI), then the V2 plan.


## 19 · Wave-2 follow-ups answered — all 23 (decision UI)
Went through all 23 wave-2 follow-ups with the human. Big direction shifts feeding V2: FU4 design reveals
one-at-a-time (no runtime queue); FU7 SEQUENTIAL per-tier (climb rungs via curated per-rung activities → THEN
the estate-influence/pillar grind unlocks → tier-up); FU8 stackable per-skill perks (2-8 each), no global cap,
bounded by incremental unlock + holistic balance; FU10 gate thresholds need a per-pillar-per-tier overhaul
(good=baseline/great=strong/excellent=above-and-beyond); FU13 MORE weapons (T0:2/T1:3/T2:4); FU14 three clean
combat tracks (kills→level, deeds→Arms, per-rung activities→rung-meter); FU18 the 28.5h budget is a FLOOR not
a ceiling (longer OSRS-grind); FU20 broader cross-pillar combos (trade-≤⅓ stays hard); FU23 tab-open
auto-resolve (active-only holds). Recorded in brainstorms/2026-06-26-prd-v2-followups.md; D-016 annotated
(budget=floor). Next phase: author the PRD-V2 plan → reshape prd.md → V2 → build M0/M1.


## 20 · Wave-2 follow-ups folded into prd_human_feedback.md (Block M)
Per the human (same rule as Block L): the 23 wave-2 follow-up resolutions added as **Block M** of
docs/prd_human_feedback.md — so that doc holds ALL cumulative feedback (A–M). Made the precedence rule
block-agnostic (the latest block wins; M supersedes L/A–K on conflict).


## 21 · PRD-V2 plan authored (10-agent workflow) + ADRs D-023–D-042
The V2 change plan is done: 474 changes · 50 new subsections across §1-§7, ALL 79 decisions mapped (no
unmapped; contradictions pre-resolved by D-022). Saved to brainstorms/2026-06-26-prd-v2-plan.md (overview +
rewrite order + consistency watch-list + coverage + the detailed per-section change-maps). Recorded 20 new
ADRs **D-023–D-042** (sequential tiers, rung-meter law, three combat tracks, incremental combat + weapon
roster, per-skill perks, hybrid gate, budget=floor, multi-backend save, broader combos, no-quest-budget, E3,
durability bands, satiety-combat, name-reclaim split, design-staggered reveals, determinism hardening,
intra-line dialogue, castle-town ending, bundled assets, real-name lint). Rewrite order: §1→§2→§4→§6→§3→§5→§7
→ consistency sweep. NEXT: write PRD V2 (archive v1, staged section rewrite), then the audit battery.


## 22 · PRD-V2 rewrite ATTEMPT 1 FAILED (caught at structural-check) — relaunching
The staged full-section-regeneration workflow (wtx6q883g) produced INCOMPLETE sections: large sections
(§2=253 lines vs ~889; §1/§3/§4/§7 missing their heads, §3 starts mid-word) because each section body
exceeded one agent message, so only the TAIL was returned as the value. §5/§6 were ~ok. DID NOT assemble —
**docs/prd.md is untouched (still v1)**; the failure was caught at the structural-check gate. Raw partial
output snapshotted to brainstorms/raw/2026-06-26-prd-v2-write.json. FIX: relaunch with each section agent
WRITING its full rewritten section to a file (Write + Edit-append chunks, self-verified start-heading/
end/line-count) so output length is decoupled from message length; later stages READ earlier section files
for the canon. Then assemble from the files. If attempt 2 also fails a structural check, STOP and report to
the human rather than churn.


## 23 · CHUNKED V2 rewrite — §1 applied (salvaged from attempt-2's 18-min agent)
Switched to a CHUNKED/checkpointed rewrite (one section = one chunk = one commit) after attempt 1 (truncation)
and attempt 2 (JS bug `readFiles.map`, but its §1 file-output agent completed first). Salvaged
scratchpad/v2out/s1.md (1095 lines, correct title, has the new §1.6.4 sequential-two-phase + three-combat-tracks
canon, ends clean before §2). Applied: prd.md = V2 §1 + v1 §2-§7 (a valid V2-in-progress; each section committed
as it lands). Next: §2 + §6 (read s1.md as canon), then §4, then §3/§5/§7 — each verified + committed.


## 24 · PRD V2 §2/§4/§6 applied (chunked, file-output)
The corrected file-output workflow (w7ode33pe) wrote s2/s4/s6 to v2out; applied each via apply_section.py
(validated start-heading + size). prd.md now: V2 §1/§2/§4/§6 + v1 §3/§5/§7 (6032 lines, all 7 §-headers).
§3/§5/§7 still generating. Remaining 'CombatDeedsPool'/'Combat Standing' markers are in the not-yet-applied
v1 §3/§5/§7 (will clear on apply). Each section = an independent committed checkpoint.


## 25 · PRD V2 FULLY ASSEMBLED (all 7 sections applied)
Applied §3/§5/§7 (chunked, validated). docs/prd.md is now ALL V2 — §1-§7, 6426 lines, all headers present.
Flag for the audit: 3 'CombatDeedsPool' + 14 'Combat Standing' leftovers remain (watch-list said rename
Combat Standing→Combat Rank project-wide + delete CombatDeedsPool→three tracks) — the audit/consistency lens
must verify these are legit (e.g. 'renamed from' notes / historical refs) or fix them. Next: audit battery
(intent-fidelity vs feedback A-M + consistency watch-list + dropped-content diff vs v1), then human glance.


## 26 · PRD V2 audit — VERDICT: NOT READY (two truncations) + design flags
Audit battery (w39q9l3fc, 9 lenses, 30 findings: 8 crit/4 high/10 med/8 low). Two CRITICAL truncations (the
same length-cut the apply_section size-heuristic missed because each was >60% of v1): (1) §4 ends at §4.6.9 —
§4.7 (yields/crafting/loot) + §4.8 (LOCKED pacing tables + budget-FLOOR) + §4.9 (levers index) GONE (~89
dangling refs; G1/G2 pacing criteria orphaned); (2) §7 ends mid-M5 — M6/M7/§7.3/§7.4/§7.5 GONE (strands
Q4 fun-gate, Q53 content-descriptors, Q56 perf-risk). FIX: regenerate the §4 TAIL (§4.7-§4.9) + the §7 TAIL
(M5-complete + M6 + M7 + §7.3 + §7.4 + §7.5) as small reliable chunks + splice in (heads of §4/§7 are fine).
Other findings (flag for human): HIGH Name-pillar gating contradiction + 70/30 tie-out; MED reveal-ladder
seam (Bestiary R3 vs R4) + §4.2.2 phase-accrual; LOW clerical (ronin macron, name leftovers, E# overload,
T2.6 weapon mis-seq). 5 trivial fixes. Then re-verify, write report, present for human glance (NOT M0 yet).


## 27 · PRD V2 truncations FIXED — §4 + §7 tails restored (doc complete, 7020 lines)
Regen workflow w05mj51vo (2 file-output agents, 15min) restored both truncated tails. NOTE: the agents wrote
DIRECTLY into docs/prd.md via targeted Edits (my prompt named no output path) — both survived (no race-clobber;
line math 6426+594=7020 confirms). §4 tail: §4.7 (yields/cost/E0→E3 build row) + §4.8 (§4.8.0 headline, §4.8.1
⭐ T0 pacing table, NEW §4.8.1b phase-2 grind block, §4.8.2/.3/.4) + §4.9 levers — placed §4.6→§4.7→§4.9→§5,
contiguous; ~89 dangling refs resolve. §7 tail: M6 (balance-to-FLOOR + verifier/fun-proxy gates + a11y + T3
Daikan stub) + M7 (deploy: fonts/LICENSE/credits/content-descriptors + iframe save test) + §7.3 (assets +
credits/licensing) + §7.4 (top risks incl new R6 fun/R7 perf/R8 bounded-perks + scope posture). KNOWN NIT:
§7's subsection headers are '## 7.N' (no §) vs §1-§6's '## §N.M' — batched into round-1 trivial fixes. PRD V2
now STRUCTURALLY COMPLETE. NEXT: until-dry battery rounds (user: 'multiple roads of battery until no feedback
left'), then human glance.


---

## Next intended steps (current)
1. **Author the PRD-V2 plan** from BOTH the 56 decisions (master sheet) AND the 23 wave-2 follow-ups — what changes where in `prd.md`, the new sections (combat-progression ladder, rung-meter law, sequential per-tier model, weapon roster…), and which need ADRs.
2. **Reshape `prd.md` → PRD V2** per that plan; record the load-bearing changes as ADRs (per D-022).
3. **Then build M0/M1** → playtest → resteer → V3.

## Landmines (current)
- **42 fixes already applied to `prd.md`** this session (re-verified in round 4; 1 self-regression caught & fixed).
  `git diff 0b60422..HEAD -- docs/prd.md` shows them all; the report tables list each with rationale.
- **§4/§7 findings are PROVISIONAL** per D-021 — they evolve into V2, they are not must-fix-now bugs.
- This journal is **HISTORY**. Live state = `memory/project-status.md`; prioritized queue = the master decision sheet.
- No code yet (pre-M0).
