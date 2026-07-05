# F10 — Taste-bar enforcement: the per-surface scorecard flow

**Status:** 🔨 IN-PROGRESS — full plan (replaces the parked placeholder; the
re-plan trigger fired 2026-07-03 when taste.md locked, D-126). Being built
this session (2026-07-05).
**created_date:** 2026-07-05

## Who builds this — Fable or Opus?

**Confidence: ( 70% Fable, 30% Opus )** — judging which taste principles are
checkable, and designing a scorecard that a reviewer can actually read, is a
taste call; the wiring is mechanical. Human routed the whole build to this
Fable session (2026-07-05) while F8/F9 build in parallel — that steer
supersedes the split.

## What this is

[`docs/living/taste.md`](../living/taste.md) is locked: 4 values → touchstones
→ **21 numbered principles**, hard-capped, prediction-tested. Today it is a
document an agent is *told* to read (the AGENTS.md D-126 bullet). F10 makes it
**fire mechanically on every surface**: a per-surface **self-scorecard**
attached to the surface's R-item, so (a) agents catch their own violations
before the human reviews, and (b) when the human disagrees with shipped work,
the scorecard shows exactly which principle the agent misjudged — and that
principle is the one to sharpen in taste.md.

taste.md line 150 already points here: *"The pre-ship checklist is the F10
scorecard flow."* This plan builds that flow.

## Design decisions (the taste-judgment part)

1. **Score all 21 principles every time; `—` (n/a) is cheap.** The
   alternative — a maintained surface-type → applicable-principles matrix —
   is a second home for taste.md's structure that would rot (V1: one home;
   the avoid-new-maintained-files norm). A 21-line walk costs a minute;
   marking `— n/a` for "P12 typewriter" on a settings panel costs nothing
   and *proves the principle was considered* rather than skipped.
2. **One scorecard per SURFACE, not per variant.** A diverge produces 2–3
   variants of one surface; the scorecard scores the **self-picked default**,
   with a per-variant delta line ONLY where a variant's verdict differs
   (e.g. "B: P20 ✘ — log pane uses raw vw"). Keeps review.md readable — the
   human's bandwidth is the scarce resource.
3. **Format is verdict-first and violation-focused.** Header line
   `Scorecard: N✔ · N✘ · N—`, then one line per ✘ (and borderline ✔) with
   the principle number + why. Clean passes are NOT itemized in review.md —
   the full 21-line walk stays in the agent's working notes; review.md gets
   the compressed verdict. A ✘ that ships anyway must say why (time-boxed
   corner-cut, named — the diverge A19 discipline).
4. **Enforcement rung: skill-step + R-item template section — NOT a verify
   gate (A11).** Taste pass/fail is judgment; a lint would cry wolf. The
   mechanical hook is *artifact-shaped*: the diverge §6 R-item template now
   carries a mandatory `Scorecard:` section, so a filed R-item without one
   is visibly incomplete (and D-075 already makes the R-item itself
   mandatory). Greppable candidates (P4 container resets, P20 raw `vw`)
   are NOTED for a future gate but deferred until a violation recurs —
   a gate promoted on evidence, not speculation.
5. **One home: the scorecard spec lives in the `taste-scorecard` skill.**
   Both callers point there: the diverge skill (§2 step) for new/restyled
   surfaces, and the AGENTS.md D-126 bullet for everything else (features,
   narrative beats, non-diverge surfaces). taste.md itself stays pure
   standard (it is capped and locked; no procedure text belongs there).

## Phases + DoD

- **Ph1 — this plan** (replaces the placeholder; Status IN-PROGRESS). ✅
- **Ph2 — the `taste-scorecard` skill**
  (`.claude/skills/taste-scorecard/SKILL.md`): the procedure (walk all 21 +
  the 4 values → verdict header → ✘ lines → attach to the R-item), the
  compressed review.md format, the per-variant delta rule, and a worked
  example. DoD: skill exists, ≤120 lines, self-contained.
- **Ph3 — wire the two callers.** diverge SKILL.md §2 gains a scorecard step
  (between self-review 6 and R-item filing 8) and §6's R-item template gains
  the `Scorecard:` section; the AGENTS.md D-126 bullet gains the pointer
  ("score via the taste-scorecard skill"); review.md's format comment shows
  the section. DoD: both entry paths name the skill; the template carries
  the section.
- **Ph4 — ADR + close.** ADR (D-135) records the enforcement-rung call
  (skill-step norm, not a gate, and why); journal + status; plan → DONE.
  DoD: verify green, committed.

**Deferred (named, not silent):**
- **/ship composition** — F9 is being built in parallel this session; when
  `/ship` lands, it should add one step: "surfaces touched since last ship
  each have a scorecard on their R-item." One-line edit, done AFTER F9
  merges (never edit a co-agent's in-flight file).
- **Mechanical sub-gates** for greppable principles — promoted only on a
  recurring violation (design decision 4).

## What could make this wrong

- If scorecards turn out to be rubber-stamped (all-✔ walls with no ✘ ever),
  the flow is theater — the fix is the disagreement loop: every human
  override of a scorecard verdict MUST sharpen the mis-scored principle in
  taste.md (that's the D-126 amendment path, human-locked).
- If review.md bloats, tighten design decision 3 further (verdict header
  only; ✘ detail in the journal).
