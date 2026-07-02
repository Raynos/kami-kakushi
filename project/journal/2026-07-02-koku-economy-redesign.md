# Session — 2026-07-02 — koku economy re-diagnosis, research & ripple plans

**Summary:** Diagnosed that koku is mis-cast as a generic spendable currency (you
rake rice → "+3 koku"), ran two deep-research passes (Edo economy + social/political
reality), locked a full redesign with the human (koku = House standing; coin
mon→monme→ryō = money; rice = a real resource), then audited the living docs for the
blast radius and wrote two implementation plans. **No game code changed.**

## What changed
- `project/brainstorms/2026-07-02-koku-edo-economy-research.md` — research pass 1
  (koku/kokudaka/cash/tax/stipends); confirms koku was never a spendable currency.
- `project/brainstorms/2026-07-02-edo-social-political-research.md` — research pass 2
  (status mobility, giri/on, village collective-liability, patronage/Tanuma,
  factional risk, Tenmei famine) — feeds the T2+ social layer.
- `docs/plans/2026-07-02-economy-koku-rediagnosis.md` — the 8-part diagnosis +
  all locked decisions (§9–§14): tier→koku ladder, coin denominations, T5 office
  track, status tokens, personal stipend T4+.
- `docs/plans/2026-07-02-koku-ripple-docs.md` — **Plan A** (doc/PRD ripple): from a
  12-doc audit workflow — 81 contradictions / 16 renames / 70 enrichments, ~12 ADRs
  superseded, three new ADRs D-107/108/109.
- `docs/plans/2026-07-02-koku-economy-t0-build.md` — **Plan B** (T0 build, gated on
  Plan A).
- `project/todo-human.md` — reading-queue entries for the above.
- Raw audit snapshot: `project/brainstorms/raw/2026-07-02-prd-koku-ripple-audit-*`
  (git-ignored).

## Next intended steps
1. **Execute Plan A** (this session, next): write ADRs D-107/108/109 + supersede the
   10 affected ADRs; ripple the 13 living docs; refresh project-status.
2. Then Plan B (koku→coin build) unblocks — for another agent, coordinate on
   `render.ts`.

## Landmines
- **Shared tree:** another agent is live in `src/ui/render.ts` + `styles.css` +
  `project/status/project-status.md`. Stage only own paths; coordinate before the
  render-layer build (Plan B Phase 1/3).
- This commit is **docs-only, local, `SKIP_VERIFY=1`** (the tree carries others'
  unverified `src` WIP); **not pushed** — a green push needs their WIP settled.
- koku is still un-migrated in code (`state.ts`/`activities.ts`) — Plan B territory,
  gated on Plan A.
