# Session 44 — 2026-07-02 — playtest round 2: intro rebuild, multi-panel lock, density

## ☀️ SUMMARY (read this first)

A continuation of the 2026-07-02 live human-steered playtest (round 1 = F1–F61 in
[session-42](2026-07-02-session-42-playtest-full-build.md)). Round 2 captured
**F62–F85** in
[`project/human-feedback/2026-07-02-playtest.md`](../human-feedback/2026-07-02-playtest.md)
and built all of them, mostly via serialized subagents (one owner per file to keep the
shared tree safe). Headline outcomes: the full-screen VN intro was **rebuilt
append-only** (the root-cause fix for a whole cluster of flash/typewriter bugs); the
**multi-panel workspace was locked** to 屏風 folding columns + soft cards (variants pruned,
D-075); the **1780 anchor** surfaced in the cold open; **two density registers** + a
**persisted log-font stepper** landed; and **five built plans were archived**. All work
headless-only; every commit green. This file is HISTORY — live state is
[`../status/project-status.md`](../status/project-status.md).

---

## 1 · Intro VN scene — rebuilt append-only (F62–F84)

The intro went through several iterations before the human found the root cause: the
renderer tore down + rebuilt the scene DOM on every state change (an `innerHTML`/
`textContent` reset), which flashed the page, wiped the typewriter, and resized the card.
Rebuilt to **build-once / mutate-in-place**: `reconcileIntro` diffs the transcript and
appends only new keyed nodes; the "I've heard enough" ask→decide swap and the pick are
UI-only (toggle sub-panels' `hidden`, no rebuild); typewriter timers tracked in a list and
cleared without teardown. Consequences that fell out of the one fix:

- Two-column card (story left / interactive right); **all** text types in (greeting, each
  "You:" question, each NPC answer, decision prompt, chosen line + reply) — F78/F82/F83.
- **Fixed-size card**, internally-scrolling story column that **sticks to bottom** —
  F80/F84. Static, always-present right panel (content swaps in place) — F79.
- Ask→"done"→decide gating; **choose resolves in place** (your line + NPC reply) then a
  **Continue** button (no silent scene-cut) — F64/F65. Per-line click advance — F62.
- Decision buttons + perk cards **colour-themed by the +1 attribute** (STR 弁柄 iron-red ·
  AGI 若竹 green · INT 紫 purple · SPD 浅葱 cyan · LUCK 金茶 gold; `--attr-*` tokens) — F66.
- Reuse the ONE fresh-entries divider idiom across main log + intro — F76.

## 2 · Multi-panel workspace — locked + pruned (F69/F70/F71/F85/F77, F67/F72)

The human locked the matrix pick: **layout = 屏風 folding columns (was V6B)** + **framing =
soft cards (was V7C)**. Made that the sole prod rendering (dataset stamped as constants),
**pruned** the other layout (classic/番付/巻物) + framing (boxes/hairline) variants from
`SURFACES` + CSS (D-075 zero-flag-debt). Byōbu rules: framed spread with side gutters
(`max-width:1440px`, never full-bleed — F70), log column a first-class **≥⅓ viewport**
(`min-width:33.333vw` — F71), modest 2 columns. Log fixes: text fills the panel full-width
with the scrollbar at the true right edge (F85), instant **sticky-bottom** pin with an
un-pin-on-scroll-up guard (F77). Pedlar buy buttons moved into normal flow (no overlap —
F67/F72); `renderLadder` hides an empty container + `hasVisibleChild` ignores empty panes
(no ghost box after a rung change).

## 3 · DEV rung menu (F68)

Replaced the partial `['R3','R4','R5','R7']` list with every rung R0–R7 derived from
`RANKS`; added descend-via-reset (`planRungJump` — target ≤ current resets then re-climbs),
fast (promoteRungs, no tick-resim). Current rung highlighted.

## 4 · 1780 anchor in the cold open (D-105 code-surfacing)

The reachable-now change from the handed-off 1780 code plan: `COLD_OPEN.wake` now grounds
the open in *spring, the ninth year of An'ei (1780)* as diegetic flavour (nengō, no Western
year on-screen — B2; calendar model untouched — B1; no real place/person). Added
`coldOpen.test.ts` with a RED-able grounding assertion. A2 rumour + B2 readout stay
deferred.

## 5 · Density + log-font (F73/F74) and dev-server (F75)

Two density registers: tightened the game CHROME (header/footer/nav/vitals/buttons/cards/
gaps) toward a dense HUD while leaving the reading surfaces (log/story/intro) roomy — F73.
Added a persisted A−/A+ **log-font stepper** in the filter bar (scopes a `--log-scale` var
on `.slice-log`, bounds 0.85–1.4, persisted via a new `ui-prefs.ts` localStorage seam —
F74; note: the F30 a11y text-scale turned out NOT to persist today). Disabled the Vite dev
server's HMR (`server.hmr=false`) so the playtester controls refresh + isn't shown agents'
mid-edit WIP — F75.

## 6 · Housekeeping — plan archives + link fixes

Archived five now-done plans to `project/archive/` (Status ✅, dequeued from the human
reading queue, ripple links repointed): `playtest-polish-build` (superseded/inline),
`anchor-1780-code-surfacing`, `interactive-intro-dialogue` (D-104),
`npc-dialogue-tree`, `multi-panel-layout` (D-106). Reading queue is now just the (not-mine)
`economy-koku-rediagnosis` + an edo-social-political research brainstorm.

## Next intended steps

1. **Human review passover** of the round-2 reshape (intro, multi-panel, density, log) —
   the human said they'd do a fresh review when this batch is done.
2. Any round-3 feedback → same inline loop; balance/perk magnitudes + topic content stay
   liquid.
3. Fold the new F62–F85 taste rules into `ui-design.md` (done this checkpoint) — future
   surfaces inherit them.

## Landmines

- **Shared tree, multiple agents.** This session ran alongside a concurrent 1780/economy
  worker editing `README.md`, `prd/*`, `decisions.md`, and untracked economy docs. Stage
  only your own paths by explicit name; never `git add -A`. `before.png` is not ours.
- **HMR is OFF** — the dev server no longer auto-reloads; F5 to see changes. Re-enabling is
  a one-line `vite.config.ts` revert if a future session wants it back.
- The **F30 a11y text-scale does not persist** (live var only, resets each reload) — a
  latent bug surfaced while building F74; not fixed here.
- `verify` brushed the **5s soft budget** (up to 9s on a cold eslint run) — non-blocking,
  worth a gate-trim later (`npm run verify:budget`).
