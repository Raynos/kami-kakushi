# Session 47 — 2026-07-02 — UI-remaster variants (five full T0 remasters)

## ☀️ SUMMARY (read this first)

The human reviewed the seven `prototype/` UI-v2 frames: novel and refreshing,
but **none resemble the actual game** — they answered the wrong question. New
human-locked brief: 3–5 **remaster/remake** variants of the *actual* T0 game
(R0–R3 scope) — same game, same IA, log-centric, but a generation better in
layout/components/type/polish. Golden-age JRPG (FF7–FF10) × polished indie/AA.
English-only UI (romanized terms OK), desktop-first, staged states + live
verbs on a mock engine, **no placeholder art**. Five directions locked live
(three human picks with own spin + two repo-rooted originals). Work stages in
`ui-demos/` — never touches `src/` (another agent's turf). Plan:
`docs/plans/2026-07-02-ui-remaster-variants.md`.

---

## 1 · Queue cleanup + prototype deploy (pre-brief warm-up)

- Removed `prototype/index.html` from the reading queue after the human
  reviewed the gallery (D-089 implicit sign-off) — commit `542a931`.
- Deployed the prototype gallery to Vercel at the human's ask:
  <https://kami-kakushi-proto.vercel.app> (public, all 8 pages 200). Committed
  `prototype/.gitignore` for the local `.vercel` link folder — `ae411f3`.

## 2 · The remaster brief — human steer, locked live

Human verdict on the 7 prototypes: unique/fascinating but zero resemblance to
the game or its reference idlers (proto23, Yet Another Idle RPG). The new
target is the **midpoint** between "change the CSS" and "reinvent the UI" —
saved to agent memory as `ui-remaster-midpoint`. Locked interactively via
AskUserQuestion:

- **Directions (5):** PSX menu classic, FF9 warm storybook, Hades/StS modern
  indie — each *with own spin, fitted to this game, never a copy* — plus two
  agent originals rooted in the repo's foundation (urushi lacquer & gold;
  aizome indigo textile with sashiko-stitch components).
- **Depth:** staged R0/R1/R2/R3 snapshots + live ticking + clickable verbs on
  a shared mock engine (no real balance sim, no dev tools beyond the stage
  selector).
- **Language:** zero kanji/kana; romanized canon terms stay (koku, mon/monme/
  ryō, kura, sansai, kami).
- **Target:** desktop-first only.

## 3 · Recon + plan

- Background Explore agent swept `src/` and returned a full UI inventory:
  the 6-tab IA + reveal gates, every panel ≤R3 with content and file:line,
  the `GameState` shape + all 30 intents, balance constants, formatters,
  the VN/ceremony surfaces, and the visual-language tokens. Distilled into
  the plan's §2 invariants + §5 engine contract.
- Authored `docs/plans/2026-07-02-ui-remaster-variants.md` — the midpoint
  contract, five variant briefs (composition + components + type each),
  the `ui-demos/` staging layout, mock-engine contract, build order
  (shared modules first → five parallel variant-builder agents → main-session
  QA screenshots → R-items + queue + deploy offer). Queued for the human.

## Next intended steps

1. Build `ui-demos/shared/data.js` + `engine.js` + gallery hub (main session).
2. Fan out the five variant builders (background Agent-tool agents).
3. QA-screenshot every variant × stage; fix; commit; R-items per variant;
   offer Vercel deploy of `ui-demos/`.

## Landmines

- **Do not touch `src/`** — another agent is actively building there (koku
  economy). All remaster work stays under `ui-demos/`.
- `verify`'s Prettier/ESLint gates may cover `ui-demos/` files — run
  `npx prettier --write ui-demos` before committing; check lint globs on the
  first commit rather than assuming.
- D-075 mechanics (DEV-panel toggle in `src/`) are deliberately NOT used —
  human-steered staging-ground deviation; R-items still filed per variant.
