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

### 3 · Wave 2 (6 blind-spots + convergence critic) — `wf_8f75ff57-eb0` (in flight)
- Targets the critic's named blind spots: test-integrity, narrative-sustain, onboarding-legibility,
  save-migration-risk, runtime-performance, genre-benchmark. Folding into the report on completion.

### 4 · Laziness / roadmap-gap / guardrails (report §6)
- Shortcut inventory + a diagnosis that the roadmap is rigorous on engineering and **silent on experience**
  (every fun/pacing/curve gate end-loaded to M6, contradicting the project's own D-019). Proposed 7 concrete M3
  guardrails (pacing-at-real-balance gate, graded-curve gate, fun-proxies-as-gate@M3a, DEMO/REAL profile policy,
  DoD-honesty CI manifest check + no-folded-features rule, log-readability gate, frontier-not-a-dead-end gate).

**NEXT:** fold wave 2; run a convergence pass; if converged, finalize the report + refresh `project-status.md`.
