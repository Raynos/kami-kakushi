# Session 125 — 2026-07-08 — Storywave GAME build (Plan B, G0→G7)

## ☀️ SUMMARY (read this first)

Executing `docs/plans/fable-2026-07-07-storywave-game.md` (Plan B — the T0
engine rewrite to the story bible) after the human's explicit go-build. One
Opus session driving G0→G7 in order; each milestone is its own green,
pathspec commit (G4 will use the isolated-worktree protocol). G7 (ship) stays
human-gated. This file is HISTORY, not live state — the live snapshot is
`project/status/project-status.md`.

**Seam note:** Plan A (docs) is A0–A4 landed, A5 gated on this ship (I
corrected its stale "PROPOSED" header this session — commit `d3e40ea`). The
engine ADRs Plan B cites (161 clean-break, 163 economy, 164 body, 165 rung-up
VN) already exist. B owns `src/**`; a co-agent (`w2:p5`) wound down the
graphics-explore slate in parallel — see the shared-index landmine below.

---

## 1 · Reconcile Plan A confusion + fix its stale header

The human thought Plan A (docs) was done; the plan header said "PROPOSED".
Reconciled against git: A0–A3 fully landed (ADR docket `f4b2016`, PRD §5
rewrite `13c4458` + §1–§7 ripple, roadmap reshape `f12fc28`), A4 largely
landed, A5 deliberately gated on B's ship. The header was just never flipped.
Corrected it to `IN-PROGRESS` with commit anchors (`d3e40ea`).

**Shared-index LANDMINE (recovered):** a first attempt at the header commit
swept in the co-agent's 6 staged files under my message (`git diff --cached`
showed their files, not mine — I'd `git add`ed then not re-checked right
before commit). Recovered with `git reset --soft HEAD~1` (restored their
staged set intact), then re-committed with the **pathspec form**
`git commit <paths> …` which commits only the named paths regardless of the
shared index. **Lesson: on this shared tree, always `git commit <pathspec>`,
never `git add` + bare `git commit`.**

## 2 · G0 — cast registry (add-only) + fiction-gap inventory ✅

Every new bible §04-cast name/voice now exists in the registries before any
prose compiles against them; the fiction gaps are surfaced as HD-30.

### What changed
- `src/core/content/names.ts` — ADD (bible §04-cast): `ohisa` O-Hisa,
  `shinnosuke`, `toku`, `oyae` O-Yae, `matsuzo` Matsuzō, `iori`, `oume` O-Ume,
  `useName` Gonbei. Forward-corrected (zero live usages, verified by grep):
  `villageChief`→Mohei, `mother`→O-Nobu, `sister`→Suzu; deleted `sweetheart`
  (Osen void). DEFERRED to G4 with comments (live canon still resolves):
  `lord` (→Munemasa), `pedlar` (→Yohei), `smith` Tōzō (retires).
- `src/core/content/voices.ts` — grew `NpcId` +9 (ohisa/shinnosuke/toku/
  naoyuki/yohei/oyae/matsuzo/iori/oume; kept tozo/shigemasa until G4); added a
  `monk` VoiceCategory (Iori); NPC_VOICE/NPC_NAME/NPC_IDS/VOICE_CATEGORY_SET
  rows. Voice-colour bindings are executor calls (steward for the household,
  official for Naoyuki, villager for the edge folk, monk for Iori) — refine at
  G4 when content wires them.
- `src/ui/render.ts` — `monk` rows in VOICE_COLOR/VOICE_SEAL (`僧`, exhaustive
  over the union — a missing key is a tsc error).
- `src/ui/styles.css` — `--v-monk` token (#b3ab9e) + `.log-line.voice-monk`.
- `src/core/content/voices.test.ts` — new registry-integrity block (NPC_IDS ==
  the Record keys, no dup ids, unique nameplates via reverse-map, every voice
  a real category — all RED-able, derived from the registry).
- `src/scripts/narrative/validate.test.ts` — the "ambient speaker needs a
  voice" fixture used `Tokubei`, which is now the NpcId `yohei` and resolves a
  voice; swapped to `Sayo` (a NAMES entry that stays non-NpcId in T0).
- `project/brainstorms/2026-07-08-storywave-g0-fiction-gap-inventory.md` — the
  verified gap inventory (7 gap classes + the G3.5 grammar-demand list).
- `project/human-in-the-loop/decisions.md` — **HD-30** filed (⛔ blocks G7):
  authorize the supplemental prose mini-wave for the gaps.
- `project/todo-human.md` — reading-queue entry for the inventory.

### Verify
Typecheck clean; full vitest 921 passed / 2 skipped. Registries additive — no
live behavior change (the only test premise that shifted, Tokubei→ambient, is
a direct consequence of the intended `yohei` id and was re-anchored).

## 3 · G1 — six-season manual calendar + clean-break persistence ✅

The season became STORED, MANUAL state; old saves retire cleanly.

**⚑ SCOPING DEVIATION (surfaced, PH4/PH6):** the plan's G1 economy slice
(the rice-as-kura-units reframe + per-site production pool + daily consumption
sink) was **deferred to G4.5**, where its consumers — the re-sited activities
+ Yohei's market — actually land. Adding dead, unread pool/consumption state
now earns nothing (PH6 lean), and the clean break means no migration cost
either way. The plan itself flagged the economy slice as new scope wanting a
scoping pass. G1 kept: the 6-season wheel, the exit pipeline, clean-break
saves, and **relocating** the existing spoilage + the seasonal judge into the
exit pipeline (they were auto-fired on a day cadence before).

### What changed (engine)
- `constants.ts` — `SEASONS` = the bible wheel (Winter→New-Year→Spring→
  Summer→Bon→Autumn); DELETED `DAYS_PER_SEASON` + `PHASE2_JUDGE_INTERVAL_DAYS`;
  `SCHEMA_VERSION` 9→10; **new `APP_GENERATION = 2`**.
- `state.ts` — `season`/`seasonsPassed` stored fields; `tier` doc 0..5→0..6.
- `selectors.ts` — `season()` reads state; `year()` derives from seasonsPassed.
- `step.ts` — removed the auto day-boundary season-turn + the 3-day reckon;
  **new exported `advanceSeason(state)`** = the exit pipeline (judge → spoilage
  → advance the wheel). `intents.ts` — new `advance_season` intent (instant,
  ADR-148); `timing.ts`/`personas.ts`/affordance map classified.
- `balance.ts` — `RICE_SELL_PRICE_BY_SEASON` + the cockpit lever
  getter/setter/canon + `dev-cockpit` sliders extended to 6 seasons (new-year
  seeds from winter, bon from summer — sim-owned, ADR-132).
- `render.ts` — `SEASON_TAG` gained New-Year (正月🎍) + Bon (盆🏮).
- **autoplay** — `focusedOptimalIntent` now issues `advance_season` in Phase 2
  to collect the seasonal share (the manual replacement for the retired auto
  judge). **BUG FOUND + FIXED:** first cut gated on `highWater > judged`, but
  `advance_season` is instant + the judge pays ~0 on tiny growth (and
  `onReckoning` discards the judged-update when bonus≤0) → an **infinite
  instant loop** (297k advances, estate stuck at 1). Fix: gate on a WORTHWHILE
  unjudged-growth threshold (`PHASE2_SEASON_COLLECT_KOKU = 20`) so the payout
  is always real, no loop, grind never starved. Arc now closes: EXCELLENT,
  17 season-collects, judge banks.

### What changed (persistence — clean break, ADR-161)
- `codec.ts` — envelope carries `generation`. `validate.ts` — a blob with
  `generation < APP_GENERATION` (or none) → `{ retired: true }`, never a crash.
  `saveManager.ts` — on retired: back the raw bytes up under
  `kk:pre-reboot-backup` + boot fresh; `wasRetiredOnLoad()` signals it.
  `migrate.ts` — MIGRATIONS 1–9 DELETED, chain restarts empty at v10.
  `main.ts` — the cold-open retirement notice (INTERIM bracketed `[dev]`
  placeholder; real text = HD-30 wave; G7 gate requires it closed).

### Tests
- New behavior model rippled: `economy`/`m1`/`pillars`/`ascension` season +
  spoilage + judge tests rewritten to the manual `advanceSeason` model (each
  still RED-able, source-derived). `migrate.test` rewritten to the empty-chain
  + clean-break; `save.test` migration test → the retirement test (+ generation
  on current envelopes). Fixtures regenerated (old-gen ones now retire).
- Full `pnpm run verify` GREEN (17 gates); 912 tests pass — incl. the `pacing`
  + `playcheck` gates, so the T0 WALL-TIME bands hold. **OWED (human directive,
  2026-07-08 — timebox sims to 5 min):** `verify:balance` (the ADR-133
  Phase2≈Phase1 ratio verdict) + `balance:report` (regen `t0-pacing.md`) are too
  slow to complete in the timebox over the longer arc (~800 game-days; instant
  `advance_season` + a slower deed-grind). Deferred to a batched balance pass —
  the pacing gate already guards wall-time, and every seed ascends. The arc's
  extra game-days are invisible to the player (the year counter is hidden in T0).

## 4 · G2 — generalized scenes + night-round runner (dormant) ✅

Two pure-core engines, landing GREEN and DORMANT (both registries EMPTY, so
nothing is reachable in the live arc). Built by an Opus subagent to a tight
spec; I independently re-verified (17 gates green, 921+9 tests) + spot-checked
the two hard mechanisms.

- **Scenes** — `content/scenes.ts` (SceneId · SceneTrigger discriminated union
  rung/season-exit/flag/verb/scripted · SceneDef · empty `SCENES`) +
  `scenes.ts` engine (enqueue/trigger/begin/advance/applyOption — mirrors
  `choose_rung_option`'s memory/flags/statBonus/stance apply, **no promotion**,
  latches `scenesPlayed`). Reuses the existing `RungScene` VN payload;
  **rank-optional widening DEFERRED to G4** (keeps the rung system stable).
- **Night rounds** — `content/nightRounds.ts` (NightRoundStage/Def, empty
  `NIGHT_ROUNDS`) + `night-rounds.ts` engine: `resolveNightStage` runs the
  stage foe through the EXISTING `resolveFight` on the seeded combat stream;
  `scripted:'survive'` (the R3 wolf) GUARANTEES survival + advance, never a win;
  won stages pay **materials-only, never coin**; a fall ends the round with a
  `TODO(G3)` sickroom-wire.
- state.ts +`sceneQueue`/`activeScene`/`scenesPlayed`/`roundState`; validate.ts
  ledger + defaults; intents.ts +`begin_scene`/`advance_scene_beat`/
  `choose_scene_option`/`begin_night_round` (dormant arms); timing/personas/
  affordance maps extended (`begin_night_round` TIMED, the rest INSTANT).
- New tests: `scenes.test.ts` (5) + `night-rounds.test.ts` (4) — each RED-able,
  fixtures from constructed defs. VN-modal render integration deferred to G4.9
  (empty registry ⇒ nothing to render). No balance sim (no magnitudes changed).

## Next intended steps
1. **G3** — the two body economies: low-HP impairs work; defeat→sickroom (days
   lost + soanLedger + carried-loss bleed, rice spared); no HP auto-trickle.
2. Then G3.5 (compiler — scenes.md gen unit), G4 (content cutover), G5–G7.
3. **G4.5 owes** the deferred rice-reframe (kura-units + pool + consumption).
4. **OWED:** G1 verify:balance ratio verdict + t0-pacing.md regen (batched).

## Landmines
- **Shared tree + live co-agents:** always `git commit <pathspec>`; re-check
  `git diff --cached --name-only` is not enough on its own (the index races).
- **advance_season is INSTANT** — any autoplay/engine gate on it must key off a
  value that CHANGES when it fires (unjudged-growth threshold), never a
  day-parity or a stays-true predicate, or it infinite-loops.
- **G4.5 owes the rice reframe** (deferred from G1): measured kura shō/bale/koku
  + per-site season pool + daily consumption sink + banked→one-way-kura.
- **G0 voice-colour picks are provisional**; **HD-30 gates G7** (no `[dev]`
  prose ships — incl. G1's retirement-notice placeholder).
