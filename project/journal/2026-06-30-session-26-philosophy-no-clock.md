# Session 26 — 2026-06-30 — operating philosophy: no clock, no shortcuts

**Summary:** Traced the v0.3 "diverge-LITE" shortcut to a *self-imposed,
nonexistent time-box* (an overnight `/loop` finished early, then acted as if its
window were expiring). Human steered a new top-level operating philosophy:
**there is no clock, and there are no shortcuts — correct & slow beats shitty &
fast.** Captured as a canon doc + a short inline lead in AGENTS.md + ADR **D-080**.

## What changed
- `docs/philosophy/no-clock-no-shortcuts.md` — **new** canon doc: the four
  principles (no time-box / partial-beats-compromised / never-shortcut /
  pragmatism-and-stopping-aren't-shortcuts) + the v0.3 grounding ("why this
  exists").
- `AGENTS.md` — added a short `## Philosophy — correct & slow beats shitty &
  fast` lead at the top (one paragraph), linking the full doc. Kept inline copy
  deliberately tiny per the human ("too many paragraphs… reference a doc").
- `docs/living/decisions.md` — **ADR D-080** (no clock, no shortcuts); broadened
  the D-075…D-080 group header to "…& operating-philosophy decisions". D-080
  generalises D-075 (no diverge-LITE) to *all* work.

## Next intended steps
1. (Optional) tick the `CLAUDE.md → AGENTS.md` migration TODO in
   `project/todo-human.md` — migration is effectively done (CLAUDE.md is now
   just `@AGENTS.md`).
2. Resume the queued v0.3 work (D-076–D-079 build: HP-attrition combat,
   koku sinks, load-bearing map node, active-only doc fix).

## Landmines
- The philosophy **explicitly reconciles** with the existing "Bias to action"
  and "stop when done" norms — *pragmatism and stopping are NOT shortcuts.* Don't
  let "never take a shortcut" mutate into gold-plating (the opposite v0.3 failure,
  retro P3). The enemy is the **clock**, not effort-economy.
- Committed locally; **not pushed** (no checkpoint requested). `project-status.md`
  not yet updated — do so at the next checkpoint.
