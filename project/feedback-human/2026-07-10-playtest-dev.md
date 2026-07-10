# Playtest feedback — 2026-07-10 (async inbox capture, `dev` bucket)

Source: the in-game capture inbox (`project/playtest-inbox/`), **dev** bucket —
drained via `/drain-inbox` (lane claimed per ADR-171; this pass owns **FB-264**,
the claim's reserved block for the one unstamped capture).
Status legend: 🔲 open · 🔧 in progress · ✅ fixed · 🅿️ parked · 💬 needs-discussion.

## Dev tooling (bucket `dev`, session of 2026-07-10 11:32)

### FB-264 · DEV action hover-detail toggle (cost / rewards / timing) — ✅
**Verbatim:** _"Add a dev only toggle under settings to have a detailed hove
description of each action including cost and rewards as well as timing."_
**Reading:** a DEV inspector: while tuning, the human wants to hover any action
button and see exactly what it pays and costs — the effective numbers, not the
base table — plus its ADR-148 timing, without opening the balance docs.
**Fixed in:** three seams, the human's go-ahead picked the full AC-6 version:
- **`activityForecast(state, act)`** (new, `src/core/selectors.ts`) — the
  `do_activity` reward math (G3 work-rate throttle × autumn × skill × estate
  over the ADR-163 site-pool draw, xp rounding) EXTRACTED from the reducer;
  `do_activity` now calls it, so the hover forecast and the real payout share
  one function (AC-6, like `mcCombatStats`). RED-able equality tests in
  `economy.test.ts` drive the real reducer across six states (hungry, hurt,
  autumn, skilled, worked-out pool, coin-pocket) and compare deltas.
- **`.dev-act-card`** (render.ts, `__DEV_TOOLS__`-stripped) — one singleton
  fixed-position hover card on every `data-act-key` button: labour acts get
  effective yields + xp + satiety cost + timing; other timed actions get the
  timing line. `pointer-events: none`, no layout shift — a DEV tool that
  observes must not perturb (FB-215..257 law).
- **DEV panel → Settings → Inspect → "action detail: on/off"** — persisted as
  `kk.dev.actionHover` on the `ui-prefs.ts` seam (round-trip tested); applies
  `body[data-dev-act-hover]`. Default OFF.
Verified headlessly (rung-R2 fixture): toggle round-trips, card shows
`+0 shō (kura)` on a worked-out winter paddy (the forecast telling the truth),
`+5 farming xp · −3 satiety`, `8s work · 2s cooldown`; `rest` shows the
timing-only card; toggle-off hides it.
**Scope note (v1):** instant actions (trade, collect-wage) carry no
`data-act-key`, so they show no card yet — extendable if wanted.

### FB-298 · DEV menu should default to Settings — ✅
**Verbatim:** _"When you open the dev menu it should default to settings."_
**Reading:** the panel opened on Variants (the old review focus); the human's
working pane is Settings.
**Fixed in:** `dev.ts` — `selectTab('settings')` at mount (was `'variants'`).

### FB-299 · Action detail card: name the act + needs/produces everywhere — ✅
**Verbatim:** _"Action detail is not fully implemented yet, it just says the
time, it doesn't say 'what the action is' it just says 'work' and 'cooldown' it
doesnt say what it needs and what it produces etc. ( Does raking still produce
+2rice?)"_
**Reading:** the FB-264 v1 gave non-labour actions a timing-only card; the
human wants every timed action to read like the labour ones — title + needs +
produces. (Answer: yes — raking pays +2 shō, costs 2 satiety.)
**Fixed in:** `render.ts` — the card now leads with a TITLE line (the button's
own label) and a per-intent detail line, every number from the same balance
constants / selectors the reducer spends (AC-6, never re-typed): rake
(`+RICE_PER_RAKE shō · −SATIETY_PER_ACT satiety`), rest (`+SATIETY_PER_REST +
homeRestBonus`), cook (`−sansai · +hp`), eat (`−shō · +satiety`), repair
(wood + waivable coin fee), craft (recipe inputs → weapon), improve estate
(next stage's coin cost), move (destination). Verified headlessly: rest
`+18 satiety`, eat `−2 shō · +30 satiety`, cook `−2 sansai · +35 hp`, rake
`+2 shō · −2 satiety`; the panel opens on Settings.

## Dev-panel reshape (bucket `dev`, session of 2026-07-10 15:14 — FB-300…307)

Second pass over the bucket (session 149): eight captures, all stamped at
capture time, drained whole-lane per the retired-cap rule; wholesale proposal
approved by the human 2026-07-10.

### FB-300 · retire the Combat/Auto DEV section — ✅
**Verbatim:** _"I dont think we need combat / auto here anymore, these buttons
can all go and all that dev code can be deleted."_
**Reading:** the Auto: farm / Auto: monkey / Stop auto buttons predate the
in-game auto-toggles; the panel section is dead weight.
**Fixed in:** section deleted from `dev.ts` + the `DevQa.auto`/`autoCombat`
members + `dev.test.ts` stubs. The headless `__qa.auto`/`__qa.autoCombat`
drive wrappers stay — they're the playtest-via-code QA path, not buttons.

### FB-301 · "NG (post open)" footer shortcut — ✅
**Verbatim:** _"Let's add a top level button here that's 'NG (post open)'"_
**Reading:** a one-click fresh run that skips re-reading the cold open.
**Fixed in:** footer button `⟳ NG (post open)` under `⟳ New game` — loads the
existing FB-6 `post-cold-open` fixture (backup-first, lights "↩ last backup").
Verified headlessly: click lands `introBeat -1 → 3` (done cursor), `awake`.

### FB-302 · wider panel, three-up tab rows — ✅
**Verbatim:** _"Let's make the dev menu wider, and let's add three buttons side
by side for the sections of the dev menu."_
**Fixed in:** expanded width 15rem → 24rem (max-width 24rem → 30rem); tab
flex-basis 40% → 30%, so the seven tabs sit three per row.

### FB-303 · Balance last — ✅
**Verbatim:** _"Balance is a confusing section, I don't think I'll use it often
so lets make that the last button in the group"_
**Fixed in:** tab order Settings · Variants · Scenarios / Story · Rung info ·
Prototypes / Balance.

### FB-304 · rename Rungs → "Rung info" — ✅
**Verbatim:** _"Rename rungs to 'rung info'"_
**Fixed in:** the tab label ("Rungs" read like the Rung teleports; it's the
requirements cheatlist).

### FB-305 · a Prototypes section — ✅
**Verbatim:** _"All these buttons in Story (10) are basically prototypes so lets
add a new section for prorotypes."_
**Fixed in:** a seventh tab/pane; the six `⤢` full-screen launchers moved out of
Story, which now leads with the diverge bundles.

### FB-306 · group the prototypes — ✅
**Verbatim:** _"In the new prototype section let's group them / - Map sheets /
- new UI (E3 / E1) / - Parked UI prototypes"_
**Fixed in:** three scenario-style group headers: Map sheets (T0 V2 · T1 · T2),
New UI (E3 / E1) (stamp book · estate sheet), Parked UI prototypes (scene cards
v2 · v1).

### FB-307 · story diverges grouped by rung — ✅
**Verbatim:** _"All of these stories diverge here need to be goruped by rung
just like variants and secnarios"_
**Reading:** the Story pane should mirror the Variants pane's `— rung RX —`
headers.
**Fixed in:** two halves. cc425f0 — the pipeline + UI (a `rung:` bundle.md
field → takes.ts parse → `StoryTakeBundle.rung` → rung-sorted headers in the
Story pane, RED-able parse/emit tests). Follow-up — the data: ten `rung:` lines
(discoveries R0 · overlays/nodes/nengu R2 · judge R7) + the storyTakes.gen.ts
regen, committed together with a human-approved snapshot of w1:p3's two
in-flight hd37-cold-open bundles (their untracked sources had to ride along or
the regenerated registry would fail CI's byte-compare; they carry `rung: R0`,
added by w1:p3 on my ping).

## Live steers during the drain (direct chat, 2026-07-10 — FB-308…311)

Source: the human steering live in the drain conversation (not inbox captures —
no sidecars). All verified headlessly (per-tab height probe + panel shots).

### FB-308 · fixed panel height across tabs — ✅
**Verbatim:** _"dev menu should have on fixed height, it shouldnt like get
shorter or longer based on the tabs, you can just show empty whitespace inside
the dev menu"_
**Fixed in:** expanded height pinned to `min(42rem, 82vh)` (collapse reverts to
head-only auto). Probe: all seven tabs measure identical.

### FB-309 · footer buttons as a 2×2 grid — ✅
**Verbatim:** _"The three butons on the bottom can be a 2x2 grid to give a bit
more space to the scroll inside the dev menu"_
**Fixed in:** the footer column → `grid-template-columns:1fr 1fr` (last backup ·
New game / NG (post open) · empty); one row returned to the scroll panes; the
FB-95 half-width accident guard holds.

### FB-310 · Variants tab carries its count — ✅
**Verbatim:** _"Add an actual (count) to variants like story"_
**Fixed in:** `Variants (8)` from `dev.surfaces.length`, mirroring Story's badge.

### FB-311 · Balance is one grid cell, not a full row — ✅
**Verbatim:** _"balance can be a single fixed width button instead of taking up
3 slots in the grid"_
**Fixed in:** tab flex-basis fixed at a third (`flex:0 0 calc((100% - .5rem)/3)`),
so the lone last-row tab no longer stretches: A A A / A A A / A · ·.

### FB-312 · the "— other —" catch-all is banned — ✅
**Verbatim:** _"OTHER in story is banned, if there is a section that doesnt fit
in a rung instead of doing OTHER [catch all] / do Other - [reason] / Other -
[reason2]"_
**Reading:** a rungless bundle must say WHY it has no rung, and each reason is
its own header — an anonymous catch-all bucket hides information (TST4).
**Fixed in:** `rung:` is now REQUIRED in bundle.md — either `R<n>` or
`other · <reason>`; the generator REDs a bundle with neither (the ban holds at
the gate rung, not as a norm), and the Story pane renders each distinct reason
as its own `— other · <reason> —` header. Today all 12 bundles carry a numeric
rung, so no other-header renders; the tests pin both paths.
