# F10 — Taste-bar enforcement: the two-pass taste flow

**Status:** ✅ DONE — built 2026-07-05, same session as the re-plan, shape
locked with the human mid-build: the two-pass `taste-scorecard` skill +
diverge §2 steps 2/8 + §6 template + AGENTS.md D-126 pointer + review.md
format sections + ADR D-135. Archive when the shared `todo-human.md` frees
up (its queue link needs the same-commit path fix).
**created_date:** 2026-07-05

## Who builds this — Fable or Opus?

**Confidence: ( 70% Fable, 30% Opus )** — the rubric design is a taste
call; the wiring is mechanical. Human routed the whole build to this Fable
session (2026-07-05) while F8/F9 built in parallel.

## What this is

[`docs/living/taste.md`](../living/taste.md) is locked (D-126: 4 values →
21 numbered principles, capped, prediction-tested 24/24) but only fired as
a "read this first" norm. F10 makes it fire **twice, mechanically, on every
piece of player-visible work**:

- **Pass 1 · constraint brief (BEFORE building)** — walk the 21; one
  concrete line per applicable principle: what THIS work must do to honor
  it. The standard as a *design input* — in a diverge, authored before ANY
  variant so it constrains all of them (variants diverge in approach, not
  in whether they meet the bar).
- **Pass 2 · scorecard (AFTER)** — the full 21-re-walk, **per variant**;
  fix-before-score; compressed verdicts attached to the R-item beside the
  brief, so the human reads stated intent and scored result side by side.

**The pass-diff is the calibration signal:** each ✘ is tagged **[briefed]**
(the agent knew and still missed — execution slip) or **[blind spot]**
(taste.md's text failed to fire — that exact principle is the one to
sharpen via the D-126 human-locked amendment path).

## Locked forks (human, 2026-07-05, in-session)

1. **Shape: B — two-pass, no closed loop yet.** The distill pipe (mismatch
   F-items → `/distill-taste` with the prediction test as regression) is
   **deferred, named**; re-distill of taste.md is **manual only**.
2. **Granularity: walk all 21 every time** — no surface-type applicability
   matrix (a second home for taste.md's structure that would rot, V1);
   `—` n/a is cheap and proves consideration.
3. **Verdict form: compressed in review.md** (header + ✘ lines); full
   walks stay in the journal. Brief lives in **both** journal and R-item.
4. **Scope: EVERY variant fully scored** in a diverge (a variant the human
   might pick must not hide a violation).
5. **Rung: skill-step + mandatory R-item template sections — NOT a verify
   gate** (taste is judgment; a lint would cry wolf, A11). Greppable
   principles (P4 container resets, P20 raw `vw`) graduate to a gate only
   on a RECURRING violation.
6. **Coverage: everywhere** — diverged surfaces, features, narrative beats;
   the diverge §1 exemptions (one-liners, copy, token nudges, fixes) apply.

## What was built (the DoD, all landed)

- `.claude/skills/taste-scorecard/SKILL.md` — the two-pass procedure,
  formats, worked example, rung + named deferrals. The ONE home; taste.md
  stays pure standard.
- Diverge skill: §2 step 2 (Pass 1, before authoring), step 8 (Pass 2, per
  variant), step 10 (file both with the R-items); §6 template carries the
  brief + per-variant scorecard sections.
- AGENTS.md D-126 bullet routes non-diverge work to the same skill.
- review.md format comment shows both sections.
- ADR **D-135**.

## Deferred (named, not silent)

- **The closed distill loop** (shape C) — mismatch logging as F-items +
  `/distill-taste` consuming them + prediction-test regression. Its own
  plan, when the human wants it; blind-spot tags accumulate in
  R-items/journals meanwhile so the evidence corpus is ready.
- **/ship composition** — when F9 lands (in flight in a parallel session),
  `/ship` gains one step: "surfaces touched since last ship have brief +
  scorecards on their R-items." Done AFTER F9 merges.
- **Mechanical sub-gates** for greppable principles — on recurrence only.

## What could make this wrong

- **Rubber-stamping** (all-✔ walls): the anti-theater tripwire — if the
  human keeps disagreeing with ✔s, fix the instrument, not the surfaces.
- **review.md bloat**: tighten the compressed form further (header only,
  ✘ detail to the journal).
- **Brief-as-boilerplate**: if Pass-1 lines degrade into copied principle
  text instead of surface-specific constraints, the generative half is
  dead — the brief must name THIS surface's concrete obligations.
