# 2026-06-30 — v0.3 process-learnings adoption (human-steered)

The human read [`../brainstorms/2026-06-30-v03-process-learnings.md`](../brainstorms/2026-06-30-v03-process-learnings.md)
(the v0.3 retrospective + the 23-item independent re-pass delta) and steered which
learnings to adopt and how. This is the source-of-truth capture; the locks land as
ADRs (D-086+) and the rest fold into living docs / skills. Verbatim direction is
quoted; my reading follows each.

## The ask

Verbatim: _"We do want to capture any process changes, or any markdown / docs
changes we can from this review/audit as it helps everyone going forward."_
→ **Reading:** land the retrospective's learnings **durably** — into existing
markdown where it fits, new docs/skills where warranted, ADRs for the design
calls. A formalization pass, not a read-and-discard.

## The ADR guardrail (human steer)

Verbatim: _"Remember ADRs are decisions I made right? so we dont want a doc like
this to dump 30+ ADRs into our ADR"_ … then: _"well it can be two adrs so far lol,
difficulty bias and the autonomous loop done rule."_
→ **Reading:** an **ADR records a decision the _human_ made** — not an
agent-authored learning. So this retrospective does **not** dump 30+ ADRs. Each
genuine human decision earns one; the rest (the F/E/P + A1–A23 learnings) fold
into living docs / skills / conventions as **norms**, never the ADR log.

## Human decisions → ADRs

| ADR | Decision | Source |
|---|---|---|
| **D-086** | **Difficulty bias: tension/scarcity OVER generosity.** Generosity (auto-heal, autopilot, loose economy) is a thing to **justify**, never a safe default. | Q "Make it canon" |
| **D-087** | **Autonomous-loop done-rule: KEEP finding work.** When the high-value backlog runs dry, keep going rather than idle — and **flag low-value ticks honestly** instead of dressing them up. (Tempers the doc's P3 "stop when dry".) | Q "Keep finding work" + human "this is an ADR" |
| **D-088** *(proposed — pending veto)* | **e2e + invariants test per tier is a hard DoD contract.** Every tier's first-milestone DoD names a full-arc e2e + an invariants test; D-054 milestone-integrity backstops it can't be skipped silently. Ration gate-time (A17). | Q "Hard DoD contract" |

D-086 also lands a `fun-factor.md` canon line + a battery **`tension/scarcity`**
lens. D-088 also lands in AGENTS.md Conventions + the `tdd` skill.

## Human decisions → NORMS (deliberately below ADR level)

| Learning | Decision | Lands as |
|---|---|---|
| **F3/A10** a11y on new UI | **Soft check, NOT a gate** — run Lighthouse on new/restyled surfaces, treat "on-palette AND ≥4.5:1" as a design constraint; eye + tool catch disjoint classes so **both run**. The decision is to add **no teeth**. | qa-playtesting norm |
| **P1** re-audit-the-diff | **A runnable skill (mini-battery "diff" mode)** + a working-agreement norm — an independent re-pass of the diff after any locked-ADR execution / large refactor, before "done". | battery skill + norm |
| **F2** after-state | **fun-factor canon + battery check** — a canon line + an "…and then what?" check the `fun`/`onboarding` lens runs on every milestone/ceremony beat. | fun-factor + battery lens |
| **E1/A14** test discipline | **Norm pulled UP into AGENTS.md Conventions** (not buried in the tdd skill). RED-able · fixtures-from-source · assert-the-lever. The `tdd` skill stays as the deep red-green procedure, cross-ref'd. | AGENTS.md Conventions |
| **A4** economic invariants | **fun-factor canon + economy lens** — a §6 line ("every upgrade must close a work→output→more-output loop, not just grant a buffer") + sharpen the `economy-arithmetic` lens. | fun-factor + battery lens |
| **A5** audio/game-feel | **Keep light, opportunistic** — note the principle; add audio/juice only when a beat needs it; no standing priority; must degrade silently headless. | fun-factor note |

### The tdd-shelf-ware finding (human-steered)

The human challenged appending the test norm to the `tdd` skill: _"was the tdd
skill even used… its useless to append to a skill everyone ignores, should we pull
the skill recommendations higher up into the agents.md?"_ **Verified:** the skill
was *adopted* 2026-06-29 but shows **no invocation evidence** (no test-first
commits; E1's own false-green/magic-number failures are the proof the discipline
didn't fire), and AGENTS.md carries **zero** test-discipline today. → **Principle:
an ambient RULE that should apply every time belongs in AGENTS.md Conventions
(always loaded); a skill is for an invoked PROCEDURE.** So test-discipline goes
into Conventions; the `tdd` skill stays the deep how-to. **Decision (Q):** _"Land
convention now, queue audit"_ — land the Conventions bullet this pass; **queue a
separate skill-shelf-ware audit** (which skills fire, which are dead, which hide
standing rules that should be lifted up).

## Adoption process for the rest

Verbatim: _"Propose-then-veto."_ → For the remaining ~18 A-items (+ F1/F2/E1
landing detail), I write a **one-line adoption proposal per item** (below); the
human vetoes/adjusts **before I commit**. Self-adopt is reserved for pure
doc-hygiene; nothing with teeth lands without a veto pass.

---

## PROPOSE-THEN-VETO table (the remaining learnings)

> **STATUS: APPROVED 2026-06-30 — all 16 rows landed** (human: _"that table 16
> items approved"_). Landing sites: **working-agreements.md** (A1/A2 multi-agent §,
> A7, A11, A12-reconcile, A13, A23) · **AGENTS.md Conventions** (A6, A15, A20, A21) ·
> **battery skill** (A12 `canon-vs-build` lens, A22 forward-spec audit) ·
> **qa-playtesting.md** (A8/A9 a11y note, A18 sim-calibration) · **ui-design.md** +
> **diverge skill** (A19). The F1/F2/E1/A4/A14/A16 rows landed with the decided
> batch (see above).

Legend for "rung": **norm** = documented expectation, no enforcement · **skill** =
a runnable operation · **lens** = a battery lens · **canon** = a fun-factor/PRD
design line. (Kept below as the record of what was proposed and where it went.)

### Fun / design

| # | Learning | Proposed landing (doc · rung) | One-line rationale |
|---|---|---|---|
| F1 | Teach each mechanic at its moment of need (no upfront dumps) | fun-factor §2.4 line · **canon**; refresh battery `onboarding` lens | The clearest fun miss this cycle; lens already exists, just sharpen it. |
| F2 | Design the AFTER-state of a payoff, not just the payoff | fun-factor §2 line + a milestone/ceremony check · **canon/norm** | A climax needs a satisfying next-state (the stale 480/480 after ascension). |
| A4 | Economic invariants: buffer≠flywheel, high-water self-inflates, breadth≠depth | refresh battery `economy-arithmetic` lens + fun-factor §6 · **lens/canon** | The arithmetic that secretly decides fun; lens already exists. |
| A5 | Audio/game-feel = highest-ROI cheap fun lever; must degrade silently headless | fun-factor §4 lever + qa-playtesting note · **norm** | Cheap juice for a silent build; don't pollute the QA harness. |
| A19 | Diverge integrity: implement-by-intent when mechanism unsafe; wire decision-log into cleanup; NAME a corner-cut; record taste heuristics | diverge skill + ui-design.md · **norm** | Keeps the diverge process honest; ui-design gains "continuous ink > segmented meters" etc. |

### Engineering / tests

| # | Learning | Proposed landing (doc · rung) | One-line rationale |
|---|---|---|---|
| E1 | "Can this go RED?" review question + derive fixtures from source-of-truth | AGENTS.md Conventions + tdd skill · **norm** | A test that can't fail is worse than none; magic-number fixtures broke ~6 tests at M2·8. |
| A14 | Assert the design LEVERS (atk/taken/wear), not a collapsed metric (win-rate) | tdd skill / conventions · **norm** | A rounded/collapsed metric hides the monotonic mechanism. (Extends E1.) |
| A16 | Test hygiene: populate serialization round-trips; partition gated vs display on golden re-bless | tdd skill · **norm** | Round-trips pass vacuously on default fixtures; a re-bless can move a gated field silently. |
| A6 | Route derived feedback through the SAME pure-core fn the action uses | AGENTS.md Conventions (pure-core) · **norm** | `mcCombatStats` feeding both fight + forecast gave free UI legibility. |
| A20 | Cross-cutting emitter (quests/achievements) → shared glue module both reducers import | AGENTS.md Conventions · **norm** | Keeps the core graph acyclic. |
| A21 | A version label is a global invariant with no feedback loop — derive from one source | AGENTS.md Conventions (single-source) · **norm** (gate later if it bites) | The v0.4.1→v0.3.1 hand-typed mismatch. |
| A15 | Verify content-preserving transforms: TEXT-mode word-diff vs HEAD + assert NUL-free; count chars not bytes | gen-docs / a script note · **norm** | A binary output gave a false-clean diff. |

### Process / harness / multi-agent

| # | Learning | Proposed landing (doc · rung) | One-line rationale |
|---|---|---|---|
| A1 | Commit by EXPLICIT PATH every time + commit-on-green | working-agreements (multi-agent §) · **norm** | A bare `git commit` swept a co-agent's staged deletion. |
| A2 | Scatter-gather only DISJOINT new leaf modules; a running audit is a tree write-lock | working-agreements (multi-agent §) · **norm** | Parallelism safe only for independent modules; don't edit source mid-audit. |
| A7 | Retrospectives MUST read the JSONL, not the compacted window | working-agreements / handoff skill · **norm** | The window hid a recurring pattern the 83 MB transcript revealed. |
| A8 | Verify a visual oddity — don't dismiss it as a "harness artifact" | qa-playtesting · **norm** (+ a forceState that suppresses one-shots) | The seal "doubled text" was a real missing-scrim bug, rationalized away. |
| A9 | Harden the capture harness: derive waits from cadence; reset renderer; drive DEEP state | qa-playtesting + capture-game-states skill · **norm** | A check that captures the wrong frame is a lying check. |
| A11 | "Highest rung that SOUNDLY holds it" + restraint + test the false-positive PASS path | working-agreements (enforcement ladder) · **norm** | Hard-block only near-universal; decline redundant guards; test the PASS path. |
| A12 | Reconcile the ADR log against the build before deferring to the human; an ADR is a CLAIM to verify | battery `canon-vs-build` lens (NEW) + working-agreements · **lens/norm** | A signed ADR (D-053) described the opposite of the code. |
| A13 | "Most important" ≠ "safe to do alone" — park a refactor whose output the human must sign off | working-agreements · **norm** | Autonomy bias pushes hardest toward the item that needs a human. |
| A18 | Calibrate the sim as an instrument + back-solve (two points → inverse transfer fn) | qa-playtesting / balance note · **norm** | Hit a target in one shot, not guess-and-iterate. |
| A22 | Audit a forward-moving spec with a regression/mutation split + refute the GREEN claims too | battery skill · **norm** | Don't flag planned-future milestones as gaps. |
| A23 | After any fix, reconcile downstream hand-off artifacts (stale screenshots, review items, playbook) | working-agreements / handoff skill · **norm** | F2's after-state idea applied to the hand-off. |

### Already canon — reaffirmed, NOT re-landed

P2 (flag taste-adjacent changes) · P4 (liquid-by-default, D-059) · E3 (shortcuts
behind DEV, D-056) · E4 (norm→gate at the boundary, the gh-pages strip-gate) ·
A10 (folded into the F3 a11y norm) · A17 (folded into D-088).

## Skill shelf-ware audit (human-asked, agent-run)

The human asked _"was the tdd skill even used… maybe none of the skills are used…
maybe we wrote them and never hooked them up."_ A read-only subagent audited all 7
skills for **usage** and **wiring** → report:
[`../audit/reports/2026-06-30-skill-shelfware-audit.md`](../audit/reports/2026-06-30-skill-shelfware-audit.md).
**Outcome (reassuring):**
- **All 7 are wired** (valid frontmatter). No never-hooked-up skills. `handoff` +
  `prepare-to-exit` carry `disable-model-invocation: true` — correctly **human-only**
  (the human's `/handoff`, `/prepare-to-exit`), which is why they're absent from the
  agent's skill list. Not a defect.
- **The tdd shelf-ware risk was already fixed this session** — test-discipline now
  lives in AGENTS.md Conventions (always-loaded), the skill demoted to the procedure.
- `battery` / `capture-game-states` / `diverge` are active (reports, screenshots,
  variant DECISION sheets). `grill-me` is dormant since 2026-06-25.
- **Two doc-hygiene fixes** (both done this session): `grill-me` capture path
  `brainstorms/` → `project/brainstorms/`; `diverge`'s stale branch-based §§ are
  already self-flagged + deferred to the v0.3.1 DEV-panel build (left as-is).
- **No rules need lifting** beyond test-discipline — the rest are already ambient
  (R3 covers grill-me's write-then-speak; CLAUDE.md "stop and ask" covers battery's
  self-resolution boundary).
