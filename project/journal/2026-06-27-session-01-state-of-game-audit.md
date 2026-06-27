# Session — 2026-06-27 — State-of-the-game battery audit (M0–M2 demo)

## ☀️ SUMMARY (read this first)

A **multi-wave battery audit** of the playable M0–M2 demo, run autonomously (human AFK). Method: firsthand
code audit of all `src/` + a live browser playtest (cold-open → R3 → ~60 combat grinds, desktop + mobile) +
two fan-out audit waves (wave 1 = 8 scored lenses + reconciliation critic; wave 2 = 6 blind-spot lenses +
convergence critic). Deliverable: **[`project/audit/state-of-the-game-2026-06-27.md`](../audit/state-of-the-game-2026-06-27.md)**
(living, loops to convergence) + 6 H-items in `human-in-the-loop/decisions.md`.

**Headline scores** (higher=better except Laziness): Fun 4.5 · UI 7 · PRD-faithful 7 · README-spirit 7 ·
Human-feedback 7.5 · Incremental 5 · **Laziness 4/10** (10=lazy; code-craft ~9/10 diligent, laziness is all
content/scope) · roadmap-def 5.

**One-line verdict:** a faithful, genuinely well-engineered **skeleton of the right game** — the first ~hour
(cold-open + reveal-as-plot + warm prose) is its real achievement — wrapping a **hollow repeatable loop**
(binary 98/2/0/0 combat with one viable grind target + zero decisions; no skill-reinvestment; sink-less
koku/sansai; four-pillar House Influence macro entirely absent; R3 a hard dead-end exactly where combat
unlocks). The project's own experience-acceptance-criteria (fun/pacing/combat-curve) were deferred wholesale
to M6, so the demo can't yet demonstrate that the grind is pleasurable.

---

## Log

### 1 · Scope + firsthand pass
- `npm run verify` GREEN (51 tests). Read all of `src/` (engine, content, render, persistence, tests).
- Drove the live build via `__qa`; screenshotted cold-open / R1 / R2 / Skills / Combat / leveled / Settings /
  mobile. Fact base → `tmp/audit-ground-truth.md`.
- Firsthand corroborations that moved verdicts: **runtime perf is a non-issue** (full render incl. the 192-sim
  forecast = 0.6 ms; a fight = 0.9 ms) — the wave-1 perf worry resolves to "fine." **Save layer is additive-
  safe** (`validateState` spreads raw + defaults missing fields) — BUT `migrate.ts` exists and is **not wired**
  into the load path (`validateEnvelope` never calls `migrate`), a latent trap for the first version bump.

### 2 · Wave 1 (8 lenses + reconciliation critic) — `wf_e81a1f62-88a`
- Scores above. The critic caught a real over-credit: **no test asserts the signed 20–35% first-fight band**
  (`m2.test.ts` only checks `0<wr<1`), and the analytic win-rate diverges ~29 pts from the played sampled rate
  (wolf 31% analytic vs ~2% sampled) → PRD-faithful calibrated 8→7. Raw snapshot in `brainstorms/raw/`.
- Most-named weaknesses (every lens): binary combat curve + no decision; log-spam; R3 dead-end; no reinvestment
  loop / sink-less economy; macro layer absent; dead `.coldopen` CSS + unloaded fonts; demo-tuned floor hidden.

### 3 · Wave 2 (6 blind-spots + convergence critic) — `wf_8f75ff57-eb0` ✅ CONVERGED
- Scores: test-integrity 5.5 · narrative-sustain 5.5 · onboarding 6 · save-migration 5 · performance 6 ·
  genre-benchmark 5. Raw snapshot in `brainstorms/raw/2026-06-27-wave2-blindspots-audit.json`.
- **Materially-new findings (all verified firsthand):** (1) **FALSE-GREEN test suite** — two tests enshrine the
  broken combat as correct (`monkey wr>0.6`; an analytic test that asserts `0<wr<1` against a function clamped
  to `[0.02,0.98]` = unfalsifiable); the signed 20–35% band is unguarded; the *played* first fight is ~6.7%.
  (2) **Dead/unwired/untested `migrate()`** under a PRD claiming it was "built FULL + unit-tested in M0" — a
  latent silent-corruption footgun at the first schema bump; plus an `as unknown as GameState` cast hiding
  fields from tsc. (3) **Origin mystery abandoned in-window** — `dream-1`/`porters-knot` are write-only flags no
  logic reads; R3 dead-ends in silence (violates §1.9). (4) **Dead values ship** — `sansai` consumed by nothing;
  `attributePoints` a phantom persisted stat; 3 of 4 skills inert. (5) Perf is fine at T0 (0.6 ms/render) but a
  named **mobile scaling cliff**. (6) Onboarding's explanatory half unbuilt (one tooltip total; a "+3 gō" vs
  +3 koku ~1000× unit bug).
- **Score changes:** PRD-faithful 7→6.5, incremental 5→4.5, laziness 4→4.5. The convergence critic + firsthand
  re-checks agree: **converged** (residual angles — deep-a11y, untrusted-import security, deploy pipeline,
  mobile depth — immaterial for an offline single-player T0 slice).

### 4 · Laziness / roadmap-gap / guardrails (report §6)
- Shortcut inventory (16 rows) + a diagnosis that the roadmap is rigorous on engineering and **silent on
  experience** (every fun/pacing/curve gate end-loaded to M6, contradicting the project's own D-019; no test
  guards any signed criterion). Proposed **10 concrete M3 guardrails** (G-PACING / G-CURVE / G-FUN@M3a /
  G-BALANCE-POLICY / G-DOD-HONESTY / G-TEST-TEETH / G-LOG / G-FRONTIER / G-NO-DEAD-VALUES / G-MIGRATION).

### 5 · Outcome
- Deliverable finalized: **[`project/audit/state-of-the-game-2026-06-27.md`](../audit/state-of-the-game-2026-06-27.md)**
  (CONVERGED) + 6 H-items + this journal + 2 raw snapshots. Live snapshot refreshed.
- **Final scorecard:** Fun 4.5 · UI 7 · PRD-faithful 6.5 · README-spirit 7 · human-feedback 7.5 ·
  Incremental 4.5 · Laziness 4.5/10 (code-craft ~9/10; laziness is content/scope + a few polish-masked cuts).
  Verdict: **a beautifully-built chassis with no engine** — add the spend→compound loop, grade combat + give
  skills teeth, close the narrative chapter, and back the signed criteria with real (currently-red) tests +
  a wired migration path BEFORE layering the macro on top.
