# Session 187 — 2026-07-13 — the ADR-embedded-work plan, re-verified

**Summary:** Audited `docs/plans/opus-2026-07-12-adr-embedded-work.md` on the
human's ask ("review & audit… update and improve it"). Every HIGH and MEDIUM
claim was independently re-checked against today's `src/` — **all seven HIGH
and all nine MEDIUM verdicts hold**. The edits are corrections and freshness,
not re-triage.

## What changed

- `docs/plans/opus-2026-07-12-adr-embedded-work.md` —
  - Status + survey lines note the 2026-07-13 re-verification.
  - "Why": the `deferred-work` gate is now **landed** (the 19th gate,
    `8f50a09f`), no longer "landing this session".
  - **H1 gains the lost-home mechanism:** ADR-164's treatment/rest verbs were
    assigned to the storywave plan's "G4 sickroom content" chunk, and that
    plan was archived 2026-07-09 with the verbs unbuilt — archiving a plan
    orphaned its sub-item, which is exactly the failure the sweep hunts.
  - Four drifted line refs corrected: `log-render.ts:80` + `:122` (H4),
    `src/core/content/timing.ts:143` (M1), `nodes.ts:764` `rosterFor` (M2),
    `src/persistence/save-e2e.test.ts:44` (M8).
  - Risks: the stale live-agent snapshot replaced with a durable "re-check at
    pickup" rule, plus the **known seam with the now-active HD-41 plan**
    (`opus-2026-07-12-rung-reward-legibility.md` also touches
    `src/core/intents.ts` + `src/ui/render.ts`).

## Next intended steps

1. The plan is ready to pick up: S1 (docs-only log-truth pass) is the cheap
   first commit; S2/S3 need the HD-41 seam coordinated first.

## Landmines

- The Risks roster is deliberately snapshot-free now — always `herdr agent
  list` before starting S2/S3.
