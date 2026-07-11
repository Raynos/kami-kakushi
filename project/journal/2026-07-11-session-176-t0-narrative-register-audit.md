# 2026-07-11 · Session 176 — T0 narrative readability & register audit

**Agent:** Fable · **Focus:** the human's TODO "Audit & review of the
narrative" — does the built T0 prose read easily and match the 14–21
"captivating light novel" target?

## What happened

- The human steered (canon per ADR-022): the T0 prose is dense and hard to
  follow — Genemon at the R0 rung-up named specifically — the story ideas
  are liked, the story-bible voices are suspected of working against
  readability; the bible may be re-opened.
- Read the full player-facing T0 corpus inline (no subagents): the compiled
  script `docs/content/t0-story.md`, the U9 dialogue registry, a broad
  `flavor.md` sample, against prose law §0.5, the cast sheet, and the
  kernel.
- Wrote the audit:
  [`project/audit/reports/2026-07-11-t0-narrative-register-audit.md`](../audit/reports/2026-07-11-t0-narrative-register-audit.md).
  Headline: the prose is good but literary-adult by mandate (§0.5.1 at full
  density); difficulty is ellipsis/inversion/inference-load, not sentence
  length. Genemon is both tutorial channel and most oblique voice; the
  works pages are the densest text AND off-spec (metaphor from the
  never-a-metaphor man); the hardest prose is the first prose (cold open
  dream, R0 third-person reward lines); period vocab unglossed (mon/mon,
  board/board collisions); the MC has no interiority — the light-novel
  anchor. The U9 ambient pool mostly already hits the target and proves
  voice + readability can coexist.
- Six recommendations (audience ADR, §0.5 clarity floor, Genemon two-voice
  split, MC inner line, first-use glosses, re-led opening) + four open
  decisions D1–D4, left with the human. No fiction edited.

## Next intended steps

- Human rules on D1–D4 → ADR + §0.5/§04-cast amendments → re-voice via
  ADR-139 narrative-diverge bundles, worst-first (works pages → R1 terms →
  cold open/intros → R0 lines).
- Routing note (human, mid-session): near-term workflows/subagents run on
  **Opus**, not Fable (usage headroom).

## Part 2 — the plan (same session)

- The human asked for the audit to become a `docs/plans/` plan. Wrote
  [`docs/plans/fable-2026-07-11-t0-narrative-revoice.md`](../../docs/plans/fable-2026-07-11-t0-narrative-revoice.md)
  to the NEW hard-gated `build` template (w2's plan-quality gate landed
  mid-session — `docs/guides/plan-authoring.md`): Wave 0 canon (ADR-181
  audience lock + §0.5 clarity floor + Genemon two-voice + MC interiority)
  → W1 works pages → W2 R1 terms + R0 lines → W4 gloss/collision sweep →
  W3 cold open (blocked on HR-28) → W5 medium scenes + interiority pass →
  close-out full-arc cold read + prd-ripple. Verification: blind
  paraphrase test per take, voice check per wave, the human's R0→R1 play
  as the acceptance test. Take authoring routed to Opus per the steer.
- Status stays 📋 PROPOSED — the D1–D4 ruling gates Wave 0.
