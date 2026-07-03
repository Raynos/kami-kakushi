# Session 52 — 2026-07-03 — docs reconciliation · taste standard · R6 home diverge · lord voice

**Summary:** The tail of the big autonomous T0 rebuild — after v0.3.5 shipped, this
session (a) reconciled the drifted living docs to the built game, (b) distilled the
117-item playtest into a durable **taste standard** wired into loaded context, (c) built
the owed **R6 home-panel D-075 diverge**, and (d) resolved the last mechanical debt — the
dedicated **'lord' voice**. All on `origin/main`, green (12 gates). This file is HISTORY;
live state → [`../status/project-status.md`](../status/project-status.md).

## What changed

- **Living-docs reconciliation** — the human flagged that `ui-design.md` had drifted ~2
  rounds behind the shipped game (map ≠ territory). Fixed: `ui-design.md` rewritten to the
  built reality (6-tab IA §4.9, the append-only render model §4.10, Map/Inventory sections,
  the seven log channels incl. Chat, coin/rice/koku display, all F86–F117 rules graduated
  in place, refs D-107–D-116); the **PRD** rippled (rung-ups-as-VN-beats D-110, deep
  housing §2.17.1, vendors-as-people, the six-tab IA into ~13 stale spots); `fun-factor.md`
  gained discovery-not-spawn, prestige-over-power, narrative-coherence.
- **The taste standard** (`docs/living/taste.md`) — a 7-lens extract → synthesis →
  completeness-critic workflow distilled all 117 feedback items into ~22 leverage-ordered
  meta-principles + a pre-ship checklist, each with F-item receipts. **Wired into
  always-loaded context** via an AGENTS.md convention ("build to the taste standard before
  you build"), so the bar fires before every future feature. _(Human TODO: redo it with
  Fable — treat the autonomous cut as a strong first draft.)_
- **R6 · home-panel D-075 diverge** (`a830e89`) — the deep-housing pass owed the mandatory
  live variants; built **3 working presentations** behind the DEV toggle (A functional list
  = prod default · B 一間 room cutaway · C 持ち物帳 possessions ledger), same selectors as
  the reducer (no preview/reality drift), DEV-only alternates tree-shaken from prod. R6
  flipped from OWED → pick-A/B/C.
- **The 'lord' voice** (D-110) — Shigemasa's R7 capstone was borrowing the magistrate
  'official'. Added a dedicated `'lord'` VoiceCategory to the core union + a `--murasaki`
  token; his lines now render in murasaki 紫 (the historic highest-court-rank colour) with a
  殿 seal. The VOICE_COLOR/VOICE_SEAL maps are exhaustive over the union (tsc guarantees the
  token). +RED-able `voices.test.ts`. **Last purely-mechanical debt item — done.**

## Landmines / notes

- **Shared-index sweep:** my staged lord-voice files were swept into Fable's commit
  `f84aff9` (a broad `git add`), which Fable acknowledged in `eeb9e2e`. Content is safe on
  `origin/main`; only the commit *attribution* landed under Fable's message — not worth a
  shared-history rewrite. Reinforces: stage by explicit path, and a co-agent's broad commit
  can still sweep your staged work.
- **Deferred tail now** (all later-tier / human-gated): economy **Phase 5** status tokens
  (captured — PRD §2 + D-109 + both plans), **home grows with rung**, **per-tier/rung NPC
  placement** (F113), the balance-watch tuning. Plus the human async queue: R1 review
  passover · R2/R5/R7 + R6 variant picks (then I prune) · R8 cast · R9 UI-remaster.
