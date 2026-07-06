// UI flavor lines (ADR-139) — fiction-voiced micro-copy the renderer shows outside a VN
// scene (lock-hints, gate explainers). The PROSE is authored in `narrative/flavor.md`
// (FB-5 — the source of truth) and compiled to `flavor.gen.ts`; this module re-exports it.
// Each key is live-switchable in the DEV story set-switcher: a diverge on a flavor line
// ships its alternates as a `takes/` bundle (the mend-hint is HR-10's first user).

export { FLAVOR } from './flavor.gen';
