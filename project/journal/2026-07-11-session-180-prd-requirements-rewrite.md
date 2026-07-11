# Session 180 — 2026-07-11 — rewrite the PRD to one progression model (ADR-182)

## ☀️ SUMMARY (read this first)

The session started as plan-triage (size + route the five active plans), then
picked up `fable-2026-07-11-prd-rungmeter-textsync` — and immediately hit an
intent-level fork the plan's own Go conditions said to hard-stop on. The human
ruled it; the ruling **rescoped the plan** and became **ADR-182**.

This file is HISTORY. Live state: `project/status/project-status.md`.

---

## 1 · Plan triage (the ask)

Sized all five active plans for Opus and routed them. Verdict: four are
Opus-safe, one (`t0-narrative-revoice`) keeps a Fable-shaped core in its canon
wave and per-wave picks. Estimates: textsync 1.5–2.5h · zone-rung 2–3h ·
wait-a-day 3–4h · save-format 5–8h · re-voice 12–18h.

The non-obvious finding, verified in code rather than taken from the plans:
`unlock.ts` is the single reveal-emit site and imports BOTH `SURFACES` and
`RANKS`, so **save-format must land before zone-rung** — once reveal lines
persist as `reveal.<surfaceId>` descriptors, zone-rung's moved ceremony lines
re-render correctly in existing saves instead of staying stale forever. The
reverse order bakes in exactly the bug save-format exists to kill.

## 2 · The fork: was the rung-meter dead everywhere, or only at T0?

Running the plan's step-1 grep for real turned up **105 hits** across six PRD
sections (the plan said ~90; §6 alone had 12 remnants, not 7). But the hits
weren't classifiable, because canon contradicted itself:

- **ADR-137** says the points model is *"fully deleted, not wrapped"* — but
  scopes itself to rungs R0–R7, which is T0's ladder. Silent on T1+.
- **ADR-024** ("the rung-meter accrual law") stood **unsuperseded on paper**.
- **§4/§6 had been hand-annotated "T1+ frontier"** — implying the meter survived
  as the T1/T2 plan.
- **The code said dead:** no `rungMeter` / `estateService` / `combatRank` /
  `thresholdForRung` anywhere. Only a tombstone comment at `state.ts:200`.

Per PH2 (the build wins where doc and build disagree) this is drift — but
whether the *forward* model keeps a meter is intent, not description, so it went
to the human rather than being self-decided.

## 3 · The ruling (human, 2026-07-11) → ADR-182

> *"rung meters are no longer flat points, they are always objective and
> criteria based that are unique per rung, and can be as many or as few as
> needed."*

> *"I have no idea why we would strike stuff, the PRD is a living document, git
> history exists. We rewrite the PRD to reflect the current live plan."*

So: the ADR-137 requirements model is the progression model at **every tier**. A
"rung meter" survives only as the *name* of the player-facing % bar; what it
measures is that rung's authored list of objective criteria.

**Landed (`docs/living/decisions.md`):**

- **ADR-182** — the ruling + its consequences.
- **ADR-024** → ⛔ SUPERSEDED, annotated in place (never deleted — ADR-022).
- **ADR-025** → 🔁 partly superseded: the three-track de-confliction *stands*;
  only Combat Rank's mechanism becomes a criteria list.

**Plan rescoped** (`fable-2026-07-11-prd-rungmeter-textsync.md`): confidence
flips to 90% Opus (the Fable-shaped judgment was the frontier classification —
the ruling deleted that bucket); rewrite-in-place, no strikethroughs; and
**step 4 inverts** — the drift-scanner teeth were rejected only because
surviving frontier prose would cry wolf, and no such prose survives, so they
now go IN (AC-11: the gate is finally the sound rung).

## What changed

- `docs/living/decisions.md` — ADR-182 added; ADR-024 + ADR-025 annotated.
- `docs/plans/fable-2026-07-11-prd-rungmeter-textsync.md` — rescope block.
- `docs/plans/README.md` — regenerated index (Status 📋 → 🔧).

## 4 · The sweep (six PRD sections, in parallel)

One agent per section file, all briefed from ONE canonical statement of the live
model so the six sections wouldn't drift into six dialects. Every diff was
checked by hand for the three things that could go wrong: a touched gen-region
(0), an introduced strikethrough (0), a moved balance magnitude (0).

**Two independent agents converged on a real PRD error.** §4 and §6 — working
blind of each other — both found that the PRD's flat claim *"a kill does NOT bump
the rung-meter"* is **false**: R3 authors `kill:river_rats` / `kill:tanuki` count
requirements, so a kill moves the bar whenever the current rung's list counts it.
Corrected in both. §6 also discovered `content/requirements.ts` had **no PRD row
at all** in the §6.5 registry table — the live model's own registry was
undocumented, which is plausibly *why* the dead model kept re-surfacing there.

**Two agent outputs I rejected rather than shipped:**

- §2 **invented example numbers** ("thresh 40 sheaves", "the kura holds 20 koku")
  to illustrate requirement shape. The brief forbade inventing numbers — an
  illustration hardens into canon on the next read. Replaced with the REAL
  authored example (`count act:rake_rice 10`) plus a pointer to the source.
- The roadmap agent rewrote two entries **inside the "Finalized 2026-06-29 — all
  forks CLOSED (the human confirmed every default)" ledger**. That block is a
  RECORD of what the human signed, and in June they signed the two-track
  **sub-meter split with the Phase-1 AND-gate**. Rewriting it would have made the
  record claim they signed a model that did not yet exist. **Restored both entries
  verbatim** and added a forward-pointer notice above the ledger (supersede, never
  falsify). The milestone DoD row was kept updated — that table is a living
  tracker of the build, not a signed decision.

## 5 · Scope was wider than the plan knew

The plan scoped six PRD files. The ruling ("every tier") reaches further:
`docs/content/t1-content.md` and `t2-content.md` **stated the AND-gate as T1's and
T2's promotion model** — the exact drift ADR-182 kills — and `roadmap.md` carried
it in two places. Swept all three.

`project/feedback-human/2026-06-29-roadmap-forks-finalized.md` also states the old
model; **deliberately left** — it is an append-only record of a human session, not
a living doc.

## Verification

- Docs gates GREEN (9/9 in the docs lane); `pnpm run prd:drift` **CLEAN**.
- **The RED-able proof:** re-grepping the dead vocabulary across all nine swept
  docs returns only (a) negations ("never back-solved"), (b) the *pillar*
  `JUDGE_K` back-solve (a different, live system), (c) the superseded-notice
  itself, and (d) the preserved signed ledger. **Zero** lines describe the dead
  model as live.
- Cross-ref integrity: §4.1.1 kept its NUMBER (only its title changed), so all
  18 inbound `§4.1.1` references still resolve.

## Next intended steps

1. **Code-comment follow-up (deferred, needs a clean tree).** ~6 comments still
   describe the dead model as live — `intents.ts:458` claims the promotion guard
   is "(meter + storyGate)" when the code calls `promotionReady()` alone;
   `activities.ts:4` says labour "feeds the Estate Service rung-meter";
   `telemetry/milestones.ts:32`, `playcheck.ts:67`, `rung-beats.test.ts:133`,
   `render.ts:1545`. `sim/pacing-envelope.test.ts:5` names `RUNG_METER_THRESHOLDS`,
   a constant that **no longer exists**. Code is correct; the comments lie.
   Deferred because `render.ts` is a co-agent's live WIP and a code-lane commit
   would run `verify` against their unfinished tree.
2. **`prd-drift.ts` RETIRED teeth** (`rungMeter`, `thresholdForRung`,
   `RUNG_POINTS_PER_ACT`, AND-gate — **not** the bare phrase "rung meter"). Same
   blocker: code lane, needs a clean tree.
3. Push once the co-agent's tree settles.

## Open questions surfaced for the human (not decided)

- **Does a T1 rung's requirement list have to span BOTH tracks?** The old text
  said "both sub-meters still gate every rung" — under one list per rung that
  clause has no mechanism, so it was dropped rather than reinvented. If every T1
  rung must contain both labour AND martial requirements, that is now unstated.
- **The per-tier transition STORY GATE (`TierGate.storyGateFlag`) survives.**
  ADR-137/182 kill the *rung*-level story gate; the *tier*-level one is a separate
  Phase-2 mechanism. Left alone — dissolving it too would be an intent call.
- **`RankDef.eligible` is unenforced.** Nothing checks that a rung's `act:`
  requirement tokens are a subset of its curated `eligible` pool. `ranks.ts` has a
  self-note to "re-audit this field at Phase 5". If that subset relation is meant
  to hold, it needs a real check.
- **One strikethrough corpse remains in §4** (line 88) — but it concerns the
  *retired rice+coin economy*, a different dead model. Out of this ruling's scope;
  flagged rather than guessed at.

## Landmines

- **Shared tree, 3 co-agents live** (w2:p5 save-format, w6:p1 story takes, w3:p3
  zone-rung) with WIP in `src/ui/`. This sweep is docs-only — commit by explicit
  file pathspec, `SKIP_CODE_VERIFY=1`, and never stage their paths.
- **gen-regions are not hand-editable.** `01-vision.md` and `03-unlock-ladder.md`
  carry `<!-- gen:begin … -->` regions; edits inside them are reverted by the
  `gen-prd-regions` gate. Rewrite around them.
- The plans README index is a generated region — a plan's Status change stales
  it, so `pnpm run checkpoint` before committing a plan edit.
