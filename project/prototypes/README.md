# project/prototypes — standalone interactive feel-tests (permanent)

Self-contained HTML prototypes built so the human can FEEL a proposed
mechanic or surface before its plan is judged — the interactive sibling of a
`docs/plans/` proposal. Born 2026-07-09 when the kikigaki feel-test needed a
home outside `ui-demos/` (the one-time UI-remaster staging ground, retired
and deleted that day; its 10 variants live in git history — ADR-127 note).

Unlike `ui-demos/`, this ground is **permanent**: a prototype stays as the
reviewable record of what a verdict was rendered against, even after its
plan lands or dies. One directory per prototype, each linked from the plan
or HR-item that owns it.

## Rules of this ground

- **Nothing here ships.** No imports from `src/` and vice versa; prod wiring
  happens (if ever) as its own pass under the owning plan.
- **Self-contained**: one `index.html` per prototype (inline CSS/JS, system
  fonts, no build step) — open it in a browser, or serve the repo root.
- **Mock data only, clearly labeled** — never canon; fiction-voiced text in a
  prototype is illustrative and exempt from ADR-139 until it heads for canon.
- Excluded from oxlint/oxfmt (like `tmp/` and the old `ui-demos/`).
- Wear the real design tokens (copy from `src/ui/styles.css`, note the date)
  so the human judges the mechanic, not a foreign skin.

## Prototypes

- [`kikigaki-depth/`](kikigaki-depth/index.html) — the Plan K §U feel-test
  (2026-07-09): the authored-depth investigation notebook — three layout
  variants (book / ledger / scroll), the notebook beat, tick/coin-priced
  moves, warmth gates, a resolution bite, an authored-ambiguity bottom.
  Owner: [`docs/plans/t0/fable-2026-07-09-authored-depth-demo.md`](../../docs/plans/t0/fable-2026-07-09-authored-depth-demo.md).
