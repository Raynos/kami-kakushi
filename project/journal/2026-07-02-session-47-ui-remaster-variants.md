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

## 4 · Shared mock engine + canon data (`ui-demos/shared/`)

- Harvested exact content ≤R3 from `src/core/content/*` (ranks, activities,
  areas, map, people, market, estate, enemies, quests, skills, names,
  coldOpen, weapons, intro, rungBeats R1–R3) — read-only, `src/` untouched.
- Built `ui-demos/shared/`: `data.js` (all canon content, English-only, zero
  kanji — verified by a glyph-range sweep), `format.js` (formatKMB +
  mon→monme→ryō coin formatter, mirrors `src/core/format.ts`), `engine.js`
  (staged cold-open/R0–R3 snapshots + live verbs + 480ms tick loop + VN
  driver for intro & rung beats + scripted wolf + fights/quests/market/bank).
- **Verified by driving the full arc in Node** (not just spot checks):
  cold-open → intro (3 scenes, perk ±stats apply) → R0 rake → summons → R1
  beat → promotion+unlocks → `farmed` gate blocks→passes → R2 → wolf gate →
  R3 (ask-hub, +1 AGI bonus option, 6 tabs) → R4 correctly out-of-scope.
  Also: map adjacency + danger-ring conditioning gate, market stock caps,
  kura-only banking, quest advance on kills, log coalescing, formatters.
  Caught & fixed a real bug: the story gate reads the CURRENT rung's flag,
  not the target's (matches ranks.ts semantics).
- Gallery hub `ui-demos/index.html` + `ui-demos/README.md`.
- Gates: `ui-demos` added to `.prettierignore` + eslint ignores (staging
  ground, like `prototype/`/`tmp/`).

## 5 · The five variant builds (parallel background agents)

Fanned out five builders, one per direction, each locked to its own
`ui-demos/0N-*/` dir, each required to pass its own Playwright QA (zero
console errors; every stage/tab/moment driven; screenshots to
`tmp/ui-demos-qa/`) and self-review against VARIANT-SPEC §3 before reporting.

- **04 Lacquer & Gold** ✅ — landed first; its QA surfaced two real shared
  bugs, fixed at source (`02073f3`): the intro never granted BASE_UNLOCKS,
  and zero-reward wins logged "(+0 coin)". Spec gained the story-gate note
  for the demo rung-up jump.
- **03 Vermillion** ✅ — caught the doubled-`❖` (engine strings embedded the
  bullet renderers add); stripped at source (`b28d73f`).
- **02 Candlelit Ledger** ✅ — built pre-note, so its rung-up moment only
  played from R0; sent back via SendMessage, returned verified from R1/R2/R3
  (incl. Kihei's ask-hub end-to-end).
- **01 Moonlit Menu** ✅ — clean; fixed real bugs in its own code (nested
  buttons, camelCase dataset lowercasing silently killing VN/Fight clicks).
- **05 Aizome** ✅ — its first run died instantly on the account session
  limit (resets 02:50); per the resumable-subagents norm, wrapped the
  interim (deploy of four, R9, queue, push), set a background timer, and
  resumed the SAME agent at 02:55 with its context + the three shared-engine
  notes. Returned clean: zero console errors, all stages/tabs/moments, the
  stitch-draw ceremony verified. Independent screenshot review: PASS — the
  log-center thesis lands.

Main-session independent screenshot review of the four: PASS — same game,
four genuinely different generation-ups; ceremonies each in-register.
Committed the four variants (this commit). Human is asleep; instructed to
continue autonomously + queue everything for the morning read.

## 6 · Night wrap-up (human asleep — instructed to continue + queue for morning)

- Deployed `ui-demos/` to **<https://kami-kakushi-ui-demos.vercel.app>**
  (insurance deploy with four; redeployed with all five once Aizome landed).
- **R9** filed in `human-in-the-loop/review.md` — one line item per variant;
  reading queue links the live gallery + plan (D-089 lifecycle as usual).
- All five variants committed; checkpoint pushed green.

## 7 · Variant 06 — Washi & Ink, the faithful baseline (human-requested)

The human (briefly up) asked for a sixth variant: the CURRENT v0.3.5 design
kept faithfully — same palette/tokens/composition — everything UX-polished,
as the comparison anchor against the five re-imaginings. Plan §3 gained the
06 brief; builder spawned with `src/ui/styles.css` + `ui-design.md` (both
read-only) as faithfulness sources, the game's own font subsets copied in,
and live-game reference screenshots required. Returned clean (26-checkpoint
QA green); independent review confirms: the same screen, visibly tidier,
English-only. Its "github.io deploy is stale" flag was CHECKED AND REFUTED
(the deployed bundle greps v0.3.5 — the cold-open's slow-reveal CTA just
resists scripted clicks); noted here so no one "fixes" a healthy deploy.

## Next intended steps

1. Human's morning read: the gallery — now SIX variants (R9 verdicts each).
2. On the human's pick(s): decide the port path into `src/` — a proper D-075
   diverge of the chosen direction(s) against the real engine.
3. Idea worth surfacing when picking: directions can BLEND (e.g. 06's
   faithfulness + 04's material + 05's stitch meters).

## Landmines

- **Do not touch `src/`** — another agent is actively building there (they
  shipped v0.3.5 + docs reconciliation overnight; sessions 48–50).
- `ui-demos/` is excluded from prettier + eslint (staging ground); its mock
  engine drifts from the real core BY DESIGN (fake balance, no persistence)
  — never port engine code from here into `src/`.
- The five variants import `../shared/*` — serve over HTTP (ES modules), the
  gallery 404s under `file://`.
- `tmp/ui-demos-qa/` screenshots are session QA artifacts (git-ignored tmp).

## Landmines

- **Do not touch `src/`** — another agent is actively building there (koku
  economy). All remaster work stays under `ui-demos/`.
- `verify`'s Prettier/ESLint gates may cover `ui-demos/` files — run
  `npx prettier --write ui-demos` before committing; check lint globs on the
  first commit rather than assuming.
- D-075 mechanics (DEV-panel toggle in `src/`) are deliberately NOT used —
  human-steered staging-ground deviation; R-items still filed per variant.
