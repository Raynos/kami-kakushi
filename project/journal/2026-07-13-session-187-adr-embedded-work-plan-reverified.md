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

---

## Entry 2 — the finding walk: every finding ruled, the plan split 13 ways

The human asked to rule every finding together (AskUserQuestion,
one-by-one). **This is the canonical record of those rulings** (the
log-truth plan's omnibus ADR transcribes from here).

**Process rulings:** case-by-case posture (no build/park default);
rulings recorded DIRECTLY (no HD-item loop — ADR-022); HD-40 stays
separate from H7; LOW findings walked per bullet.

**HIGH:** H1 build now, own plan (sickroom HP-mend). H2 build, own
plan, EXPANDED by the human: merchants get **permanent state** —
inventory + money, every buy/sell mutates it, RuneScape
general-store diminishing sell prices per item (extends ADR-163 §5).
H3 retire the rice-withdraw path now (coin stays). H4 build now
(greeting ids — before the re-voice waves). H5 **retire ADR-068**:
T0 ships silent, HR-1 judged silent knowingly. H6 add the MIT
`LICENSE` now. H7 fix the record only (build stays HD-40's).

**MEDIUM:** M1 defer to a T1 combat review (with ADR-103). M2 park
to t2/ (the reveal needs a flag-driven label shape). M3 `TierId` —
**do it now**. M4/M5/M6/M9 home in t1/. M7 dialogue live-swap —
**wire it now**. M8 land the `beforeAll` one-liner now.

**LOW:** all bullets confirmed no-action (strike/supersede per the
log-truth plan), EXCEPT LOW-4 re-ruled: the six tier-deferred ADRs
(103, 125, 154, 160, 169, 109) each get a **placeholder plan** in
`docs/plans/t1|t2|tn/`. Doc hygiene confirmed (ADR-147 gap note,
ADR-179 → ✅, out-of-order ADRs left in place).

### What changed (the split)

- 5 top-level plans: `fable-2026-07-13-log-truth-and-small-fixes` ·
  `-merchant-state` · `-sickroom-hp-mend` · `-greeting-line-ids` ·
  `-dialogue-live-swap` (all queue-listed, template-gate clean).
- Parked: `t1/fable-2026-07-13-t1-seams-parked` (M1/M4/M5/M6/M9),
  `t2/fable-2026-07-13-map-relabel-reveal` (M2).
- 6 placeholders: t1/ adr103 + adr125 · t2/ adr154 + adr160 + adr169
  · tn/ adr109 (new far-tier dir).
- Parent survey → SUPERSEDED with forward pointers (archives via
  checkpoint); its queue line replaced by the five children;
  the quest-shapes brainstorm queue line got its description back.

## Next intended steps

1. Execute the log-truth plan (docs-only, agent-safe, all rulings
   pre-made) — it writes the three new ADRs.
2. Sequence merchant-state / sickroom / HD-41 (all touch
   `intents.ts`) — never concurrent.

## Landmines (entry 2)

- ADR numbers for the three new ADRs are taken at write time — other
  sessions may consume numbers first.
- The six placeholders are maps, not territory — every citation is a
  2026-07-13 snapshot; PH2 re-verify at unpark.
