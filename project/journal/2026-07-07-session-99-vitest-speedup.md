# Session 99 — 2026-07-07 — speed up the `vitest` verify gate

**Summary:** The `vitest` gate kept brushing the 5s drift budget (ADR-072).
Switched the vitest pool to `threads` + `isolate: false` in `vite.config.ts` —
median wall ~5.7s → ~3.7s, `Duration` ~4.8s → ~3.0s. No test change; validated
isolation-clean by 3× shuffled-order runs (65 files / 825 tests all green).

## What changed
- `vite.config.ts` — added `pool: 'threads'` + `isolate: false` to the `test`
  block, with a comment on the safety reasoning + the revert path (drop
  `isolate: false` first if a future test ever leaks cross-file state).

## Investigation (why this and not more)
Profiled the slow tests and the "transform" cost before settling on the config
lever as the whole win:
- **Slowest 3 files** are `sim/sim.test.ts` (1.2s — real 15k-dispatch engine
  runs, twice, for the determinism contract), `core/m2.test.ts` (982ms — MC
  `sampledWinRate` + sweeps tuned to RED thresholds), `ui/render.test.ts`
  (876ms — 94 real jsdom mounts, ~9ms/test). All legitimate work; trimming them
  trades RED-ability for ≤1s. Deleting all 3 outright only saved ~0.95s wall —
  the ~3.4s floor is process startup + collect + the test-execution tail.
- **The "2.3s transform"** is a summed-across-workers figure: single-thread
  transform is only ~1.0s. The extra is redundant per-worker re-transpile of
  shared modules (`core/index.ts` imported by dozens of files). It's esbuild
  (already fast) and overlapped with execution, so it is NOT the wall bottleneck.
- **tsgo-emit → vitest-on-.js idea (raised by the human):** measured tsgo emit
  at 0.65s (192 files). Rejected — in `verify`, `tsgo` and `vitest` run in
  PARALLEL (max = ~4s); an emit-then-test chain SERIALIZES them (0.65 + ~3.5 =
  ~4.15s), i.e. worse for the actual pain, for a lot of fragile machinery
  (source-map wiring, import resolution on emitted js, watch-mode rebuild).

## Next intended steps
1. If the floor still bites, the honest next lever is trimming the ~3.4s
   startup/collect overhead (leaner test-graph imports) — diminishing returns.

## Landmines
- `isolate: false` shares each worker's module registry across files. Safe today
  (pure core has no shared mutable module state; jsdom files re-declare their env)
  but a future test that leaks cross-file global state could flake. Fix = drop
  `isolate: false` (keeps most of the win via `threads` alone).
