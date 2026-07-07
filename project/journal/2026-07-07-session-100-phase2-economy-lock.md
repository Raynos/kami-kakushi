# Session 100 — 2026-07-07 — Phase-2 economy design-lock (ADR-145) + build start

**Summary:** The human answered all four open questions of the Phase-2 economy
redesign plan via AskUserQuestion: **A+B hybrid loop · literal 1:1 (~2.8 h T0) ·
rice store-vs-sell lever folded in · estate-relevant-only deed gating.** Locked
as **ADR-145**; the plan's Status flipped to 📐 LOCKED and the build (Phases 1–5)
starts this session, on **Fable 5** (human `/model fable` — supersedes the
plan's Opus-for-core routing proposal).

## What changed

- `docs/plans/opus-2026-07-04-phase2-economy-redesign.md` — Status → 📐 LOCKED
  with the four human answers + the Fable routing note.
- `docs/living/decisions.md` — **ADR-145** appended (the loop choice, the 1:1
  absolute, the rice lever, the deed gating; executes ADR-133's queued redesign).
- This journal file.

## Next intended steps

1. **Phase 1** — multi-source deeds in pure core: parameterise
   `applyEstateDeed` by source (data table in `balance.ts`), wire earner
   intents through `accrueDeed`, estate-relevant gating (Q4). RED-able lever
   test in `pillars`/`economy` tests.
2. **Phase 2** — re-gate `ESTATE_STAGES` off Phase-2 deeds; authored build-stage
   beats (narrative-diverge, 3+ takes each, DEV-only alternates) incl. the E1
   "estate STANDS" build-complete beat.
3. **Phase 3** — ADR-132 balance flow to land all 15 sim cells in
   `[0.8, 1.2]`; extend personas to the new intents; report-only texture
   metrics.
4. **Phase 4** — build-progress tracker UI via ADR-075 diverge (variants → DEV
   toggle → HR-items).
5. **Phase 5** — PRD ripple (`/prd-ripple`) + docs.

## Phase 1 built — multi-source deeds in the pure core (same session)

- `balance.ts`: `EstateDeedSource` + `ESTATE_DEED_SOURCE_MULT` (fields 1 ·
  stores 1 · workshop 2 · watch 1.5 · treasury 1.25 — all liquid), registered
  in the cockpit get/set/canon tables; the stopgap constant carries its
  SUPERSEDED-by breadcrumb (plan §7).
- `pillars.ts`: `estateDeedMagnitude(source)` (the one derivation, AC-21) +
  `bankEstateDeed(state, source)` (undefined = not estate-relevant → no-op).
- `activities.ts`: `deedSource?` on the def — farm_paddy→fields,
  haul_stores→stores; woodcut/forage carry none (Q4).
- Wiring: `do_activity` banks `act.deedSource`; `sell_rice`→treasury (Q3);
  `craft_weapon`→workshop; rice `deposit`→stores; a WON grind fight→watch
  (`fight.ts`).
- `dev-cockpit.ts`: five mult sliders in W4 · capstone pacing.
- Tests: ADR-145 describe-block in `pillars.test.ts` (lever = base×mult per
  source, distinct-magnitudes guard, cap holds, Q4 no-op, Phase-1 gate,
  reducer-level farm-vs-woodcut). **RED-proven**: collapsing the mult table
  fails the lever test.
- Fixtures regenerated (`wealthy-idler.json` — deposit now banks a deed).

## Landmines

- **Parallel agent** is building the requirements-rung-progression plan in the
  SAME tree (human kicked it off 2026-07-07). Likely shared seams:
  `src/core/intents.ts`, `src/core/content/balance.ts`. Stage pathspec-only,
  re-check `git diff --cached --name-only` before every commit; its
  `docs/plans/fable-2026-07-05-requirements-rung-progression.md` edit is THEIRS
  — never stage it.
- The ADR-133 **stopgap magnitude** (`ESTATE_DEED_PER_ACT = 0.04`) must stay
  until Phase 3's retune lands in-band — the ratio gate must stay green at
  every commit (never SKIP_VERIFY a red ratio onto main).
- Session numbering: session-99 is the parallel vitest-speedup session; this
  one is 100.
