# Session 198 — 2026-07-13 — log-truth plan: pre-build Q&A + the four small fixes

**Summary:** Ran the pre-build Q&A on
`docs/plans/fable-2026-07-13-log-truth-and-small-fixes.md` (rulings:
H3 rejects loudly · H6 pure MIT, Jake Verbaten 2026 · ADR-068
retirement re-confirmed · HD-40 still open), then executed. The
decisions.md ADR sitting is HELD until w2:p5 commits its uncommitted
ADR-192 entry (pinged via herdr); the step-5 small fixes land first.

## What changed

- `docs/plans/fable-2026-07-13-log-truth-and-small-fixes.md` — Status
  → IN PROGRESS; the pre-build rulings transcribed into the plan.
- **H3 — rice withdraw retired (rejects loudly):**
  - `src/core/intents.ts` — `withdraw` of rice returns a loud refusal
    (log line `bank.withdrawRefusedRice`), state untouched.
  - `src/core/content/log-content.ts` — the refusal line (mechanical
    copy; no UI reaches it, so no ADR-139 diverge needed).
  - `src/ui/render.ts` — "Withdraw all rice" row removed from the
    storehouse; vestigial-rows comment rewritten (deposit row stays,
    barn-filling model).
  - `src/core/economy.test.ts` — the old rice round-trip test rewritten
    as the RED-able refusal test; `log-content.test.ts` sample added.

## Next intended steps

1. M3 (`TierId` type), M8 (`save-e2e` `beforeAll`), H6 (root LICENSE).
2. Once w2:p5's ADR-192 commit lands: the decisions.md sitting (plan
   steps 1–4; new ADRs take numbers at write time, 193+).
3. `/prd-ripple` for the ADR-179 flip.

## Landmines

- `decisions.md` had w2:p5's UNCOMMITTED ADR-192 entry all session —
  any pathspec commit of that file sweeps it. Do not touch the file
  until their commit exists.
- The rice DEPOSIT row is still vestigial (carried rice is always 0);
  retiring it is out of this plan's scope, left for the render sweep.
