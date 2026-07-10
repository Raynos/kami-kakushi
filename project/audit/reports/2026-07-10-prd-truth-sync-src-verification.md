# PRD/story-bible truth-sync vs `src/` — independent verification

**Date:** 2026-07-10 · **Session:** s141 (this session) · **Scope:** the ADR-168
truth-sync commits (`46f5cb9` T1, `a45d200` T2a, `439096f` T2b+P) — does the
shipped game in `src/` match what the freshly-rewritten PRD + story-bible now
claim?

**Method:** machine checks first (`prd:drift`, `gen:prd-regions:check`), then
four independent read-only verifier agents, one per section cluster, each
extracting concrete present-tense claims and checking them against `src/` with
file:line evidence. ~110 concrete claims checked in total.

## Verdict

**Substantially in sync.** Both machine checks are green and ~103 of ~110
prose claims verify clean. Seven mismatches survive, none a substantive
behavioral contradiction; five are doc-side (the PRD slightly mis-describes
the build), one is code-side-but-already-flagged (Munemasa), one is a
doc-internal tension. The suspected HD-34 staleness in §4 is **not present**.

## Mismatches (by severity)

### Material — worth fixing

1. **SCHEMA_VERSION stale: doc says 8, code is 10.**
   `docs/living/prd/06-tech-architecture.md:293` claims the shipped tree is
   "SCHEMA_VERSION 8"; `src/core/constants.ts:31` is `10` (v9 added season
   fields, v10 the storywave). The historical "rungReqs landed at v8" claim in
   the §6.4.1 table is correct — only the "current = 8" header is wrong.
   **Doc-side fix.**

2. **Munemasa speaks on-screen in T0.** Two shipped R7 flavor lines
   (`src/core/content/narrative/requirements.md:240,250`, compiled into
   `requirements.gen.ts:259,274`) have `{lord}` = Munemasa speaking "from the
   veranda" — the bible (`docs/story-bible/tiers/t0.md:177`,
   `04-cast.md:188`) and PRD (`05-narrative.md:47-48`) say he is "a voice
   through a wall, never met in T0; his only scene is T1." The narrative
   source self-flags these lines (`requirements.md:24-33`) as pre-reboot
   content pending re-derivation (HD-30) — a **known debt, not silent
   drift**, but as shipped it contradicts the synced canon. **Code-side fix,
   owed via the HD-30 re-derivation (narrative-diverge applies — ADR-139).**

3. **Market-saturation damper described in present tense but not built.**
   `docs/living/prd/02-systems.md:276-277,293` claims a progressive per-unit
   price walk-down + `MarketState { perGoodPriceIndex, saturationByGood,
   recoveryRate, seasonalRicePrice }`. No such machinery exists in
   `src/core/content/market.ts` — the shipped soft-cap is Yohei's finite
   per-visit purse (`market.ts:94-104`) + per-item `stockCap`; only the
   season rice price exists (`balance.ts:404`). Arguably forward-scope (the
   trade engine is T2) written in present tense. **Doc-side fix: rescope to
   future or describe the purse mechanism.**

### Minor — doc-side polish

4. **RNG cursor list omits `discovery` in two places.**
   `06-tech-architecture.md:164` and `07-roadmap-scope.md:11-12` list four
   cursors; `src/core/rng.ts:14` persists five (`discovery` added, ADR-146).
   The §6.4 stored-surface block (`06:314`) already has it right — the doc
   contradicts itself.

5. **e2e lane called "mobile" but includes desktop.**
   `06-tech-architecture.md:147` says "the Playwright mobile lane";
   `playwright.config.ts` has three projects incl. `desktop-chromium` + a
   `desktop-layout.spec.ts`.

6. **`fatigue` field in §2.3c's rough data shape doesn't exist.**
   `02-systems.md:193` sketches `Vitals { …, fatigue }`; `state.ts` has no
   such field — the hurt-body texture is `lowHpWorkMult`
   (`selectors.ts:201`). Explicitly a "rough shape," so low severity.

7. **§1 cites `outcome: t3done` as a code token; it exists nowhere in
   `src/`.** (`01-vision.md:4`.) Forward-scope (T3 is frontier) but the
   backtick phrasing implies a shipped identifier.

### Doc-internal tension (not a src mismatch)

- §7.3 frames deployment as itch.io-primary with a manual checklist while
  §6.1 + `src/scripts/ship.sh` make GitHub Pages the automated primary.
  Both channels exist; the two sections disagree on which is primary.

## Explicitly cleared

- **HD-34 ordering concern — clean.** `f4a7e7b` (landed between the T2a and
  T2b doc passes) moved exactly one magnitude, `ESTATE_DEED_PER_ACT`
  0.05→0.22, which §4 references only symbolically (no number pinned); §4's
  Phase-2 ≈ Phase-1 pacing text describes the ratio HD-34 *restored*
  (measured [0.84–1.17] vs the ≈1:1 ADR-133 intent). Zero stale pre-HD-34
  claims.
- **§4 illustrative constants** (~17 divergences: enemy curve e.g.
  `MOB_ATK_K` doc 3 vs code 0.8; XP curves e.g. `CL_BASE` doc 60 vs
  `COMBAT_XP_BASE` 40) all **predate** the sync and sit under §4's own
  ADR-168 disclaimer that `balance.ts` is the live truth. Not new drift;
  a future sweep could strike-and-point or gen-region them.
- **Narrative otherwise clean:** all 16 other cast names/roles, every T0
  beat (cold open → R7 use-name), the `You:`→`Nameless:`→`Gonbei` speaker
  flip (actually implemented — `voices.ts:59-63`, `intents.ts:415`,
  `ranks.ts:202`), zero retired-name leaks. "Asagiri" is canonical, not
  stale.
- **§6/§7 structure verified by recount:** 17 gates match `gates.ts`
  byte-for-byte; 7 CI workflows; the 6 gen-docs; the save envelope; the
  §6.6.1 "enforced today vs spec" callout is honest and exact.
- **§2/§3 behavior:** ~36/38 claims match — season wheel + autumn nengu
  gate, coin denominations, rice spoilage, durability bands, defeat bleed,
  the seven-tab reveal ladder R0→R7, multi-backend saves, night rounds.
- **Unverifiable (not asserted either way):** the `document.hidden` clock
  pause (core has no wall-clock, so the no-offline-accrual invariant holds;
  the specific pause handler wasn't located), About-modal build stamp,
  pacing-gate numeric floors.

## Suggested follow-ups (not applied)

1. Doc-side batch fix for items 1, 3, 4, 5, 6, 7 + the §7 deploy-primary
   tension — one small `docs(prd)` commit.
2. The Munemasa R7 lines ride the already-owed HD-30 re-derivation pass
   (narrative-diverge, ADR-139) — don't hot-patch them outside it.
