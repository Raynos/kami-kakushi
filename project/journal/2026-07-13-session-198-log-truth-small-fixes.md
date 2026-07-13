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

- `docs/content/t0-pacing.md` — regenerated (stale fingerprint from
  the earlier HD-43 ask_scene_topic work; verify:balance GREEN, all
  rungs in band; H3 moves no magnitudes).

- **M3 — `TierId` type:** new `src/core/content/tiers.ts` (`TierId`
  0..6, `toTierId` clamp, `TIER_NAMES` single naming source);
  `state.tier: TierId`; the three fallout sites (QA `toTier`
  teleport, save hydration, milestone test) now go through
  `toTierId`. tsgo went RED on all three first — the lever is real.

- **The decisions.md sitting (plan steps 1–4)** — after w2:p5 landed
  ADR-192: stale `BUILD TODO`s struck with ✅-shipped evidence
  (ADR-098/100/101/102); supersessions annotated (ADR-094→153,
  ADR-099→163, ADR-106→144); ADR-127's open picks pointed at
  HR-2A/2B/5/6; **ADR-179 flipped ▶️→✅**; **ADR-184's "cooking is
  SITED" corrected to HELD pending HD-40** (+ the stale `reveals.ts`
  comment); **ADR-193** (T0 ships silent — ADR-068 retired, human's
  own call), **ADR-194** (merchant permanent state, extends ADR-163
  §5), **ADR-195** (the sweep omnibus; notes the ADR-147 gap).
- **PRD ripple (`/prd-ripple`, system/narrative class):**
  `prd/06-tech-architecture.md` — the stale unlock-latch monotonicity
  invariant rewritten to the ADR-179 two-part derived form (matches
  `invariants.test.ts`); `prd/02-systems.md` §2.21 — audio is now
  sample-based-only, synthesis retired, T0 ships silent (ADR-193).
  `prd:drift` CLEAN.
- `docs/repo-map.md` — one line for the `docs/plans/t1|t2|tn/`
  far-tier queue homes.

## Next intended steps

1. M3 (`TierId` type), M8 (`save-e2e` `beforeAll`), H6 (root LICENSE).
2. Once w2:p5's ADR-192 commit lands: the decisions.md sitting (plan
   steps 1–4; new ADRs take numbers at write time, 193+).
3. `/prd-ripple` for the ADR-179 flip.

- **Committed-red incident (repaired via w1:p3):** my M3 pathspec
  commit of `src/core/index.ts` swept w1:p3's uncommitted
  `__setDialogueTextOverride`/`dialogueLineText` re-export hunk, so
  HEAD briefly re-exported symbols whose definitions were still
  uncommitted (local verify green, committed tree red). w1:p3 pinged;
  their dialogue.ts commit on top closes it. Pushes held meanwhile.

## Landmines

- `decisions.md` had w2:p5's UNCOMMITTED ADR-192 entry all session —
  any pathspec commit of that file sweeps it. Do not touch the file
  until their commit exists.
- The rice DEPOSIT row is still vestigial (carried rice is always 0);
  retiring it is out of this plan's scope, left for the render sweep.
