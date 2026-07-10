# Storywave post-ship review — the bible + the two storywave plans on main

**Date:** 2026-07-09 (session 133) · **Requested by:** the human ("review the
recent work that has gone into main related to the story bible plan and the
other two plans that updated the docs/prd and the src/").

**Scope:** everything the three archived plans landed on `main`
(range `362e14d^..HEAD`, 2026-07-07 → 2026-07-09):

- `fable-2026-07-07-story-bible-finish.md` — the bible (human co-write, blessed)
- `fable-2026-07-07-storywave-docs.md` — Plan A, the docs/PRD ripple (A0–A5)
- `fable-2026-07-07-storywave-game.md` — Plan B, the src/ rewrite (G0–G7,
  shipped v0.4.0)

**Method:** four independent Opus review agents (engine correctness ·
content-vs-bible fidelity · docs/PRD ripple · test discipline), each judging
the CURRENT tree against the plans' own DoD/invariants and the bible (PH2);
plus an independent re-run of the full verify roster and `prd:drift` by the
orchestrating session. One cross-agent contradiction (`satoyama`) was resolved
by direct grep. No fixes applied — review only.

## Verdict

**The ship is real and the engine is sound.** Verify is green (17 gates),
`prd:drift` is clean, the tier-gate test pair genuinely bites, the ADR docket
and PRD §5 rewrite transcribe the bible faithfully, and the shipped T0 plays
the bible canon — cast, zones, rung ladder, speaker ladder, one-version
ruling, and spot-checked redlines all verified faithful. **No criticals in
`src/`.** The real debt is concentrated in **Plan A's A5 post-ship
reconciliation, which is materially incomplete**: several PRD/living sections
still describe the *shipped* game as the pre-storywave build. Two plan-named
test guards also never landed.

## Findings — build (`src/`)

| # | Sev | Finding |
|---|-----|---------|
| B1 | MAJOR | **"O-Sato" ships player-visible ×4** — `src/ui/map-sheets/nodes.ts:122,133,491,508` (`who:` arrays, rendered by `sheet.ts:365` "Who's there"). Bible ruled O-Sato → **O-Hisa**. The `72f7e24` "retired names zero-hit" sweep never grepped this token. Mechanical name-sync, diverge-exempt. |
| B2 | MAJOR | **Night-round FALL skips the ADR-164 carried-loss bleed** — `src/core/night-rounds.ts:97-99` applies days + `soanLedger` only; the grind-fight loss (`fight.ts:166-179`) also bleeds carried coin/goods. Comment says the fold was deferred "while dormant" — the registry now holds 7 live rounds. A night-round loss is materially softer than an identical day-fight loss. |
| B3 | MAJOR | **Night-round coin-freedom test is registry-blind** — `night-rounds.test.ts:61-62` asserts a *constructed* def; nothing sweeps the real `NIGHT_ROUNDS` (7 rounds). A future coin reward in a real round stays GREEN. Header comment still claims the registry "ships EMPTY at G2" (stale). Contrast `scenes.test.ts:113-119`, which did the registry cutover correctly. |
| B4 | MINOR | **Dead autoplay branch** — `autoplay.ts:405` reads `s.resources.rice` (never written post-G4; rice lives in `banked.rice`), so the Phase-2 `sell_rice` lever never fires through it. Sim still funds itself via the correct `earnCoin` path (`:219`). |
| B5 | MINOR | **Dead/misleading leftovers** — `fight.ts:171` `lostRice` reads `resources.rice` (always 0; comment claims rice "is still a CARRIED resource"); `app/main.ts:118-119` still narrates the retired G1 placeholder above real HD-30 prose. |
| B6 | NOTE | **`fight` reducer lacks a `nightRoundOnly` guard** (`intents.ts:680-685`) — the "wolf is survived, never won" invariant is UI-enforced only (`GRINDABLE_MOBS` filter). Not reachable today. |
| B7 | NOTE | **`advance_season` is unguarded in the reducer** (`intents.ts:1083-1088`) — R2 unlock + VN exclusivity are render-only; and the Autumn "nengu gate" is **auto-reckoned inside the exit** (`step.ts:72-93`), never a refusing exit-gate predicate as the G1 spec described. Functionally sound (R7 still gates on `nengu-reckoned`), but a recorded plan divergence. Relatedly the plan-named **`src/core/season.test.ts` was never created** — its coverage is scattered (m1/economy/pillars/invariants) and the refusal invariant is untestable because the behavior doesn't exist. |
| B8 | NOTE | **Free pool refill on season turn is exploitable early** — `step.ts:118` refills all site pools at zero clock cost; early game the ~10% spoilage doesn't counter it (autoplay itself exploits it). Matches the manual-container design; a balance/sim concern (ADR-132-owned), not a bug. |

Also minor test-debt: `combat-rework.test.ts` carries 3 `it.skip` dead tests +
~9 `TODO(g4-tests)` string-patches, and asserts a "+0 coin" token on the win
line that its own TODO flags as a wart.

## Findings — docs (Plan A's A5 reconciliation, incomplete)

| # | Sev | Finding |
|---|-----|---------|
| D1 | CRITICAL | **PRD §2.2 misdescribes the shipped calendar** — `prd/02-systems.md:118-125` states "as the BUILT game ships it… a 28-day derived 4-season clock… derived-never-stored". The shipped build is the stored, manual six-season wheel (`selectors.ts:126`, `constants.ts:68`). |
| D2 | CRITICAL | **`prd/02-systems.md:1297` "forward-spec addenda (T0 rebuild — not yet built)"** — the T0 halves of all four subsystems (economy/ADR-158 · defeat-sickroom/ADR-155 · night rounds/ADR-156 · speaker ladder/ADR-157) SHIPPED in v0.4.0. Only the T2 map-relabel half is genuinely unbuilt. |
| D3 | MAJOR | **The old 7-node satoyama map is still described as current** across `prd/02-systems.md:339,362,371,374,620,673-674`, `prd/03-unlock-ladder.md:266,437`, `prd/06-tech-architecture.md:268,398` ("7 NODES over 6 AreaDefs" — shipped: 16), `prd/01-vision.md:305`, `prd/04-combat-balance.md:1507`, `ui-design.md:252`, and **`qa-playtesting.md:96,111`** — the `goto()` node roster A5 claimed re-anchored still lists `near-satoyama`/`deep-satoyama`. (The built map dropped those nodes; only the internal `forage_satoyama` activity id survives, re-sited to the woodlot.) |
| D4 | MAJOR | **`fun-factor.md:378`** still runs the dead "rival houses Tomita & Akagi… G7 = rivals dethroned" climax — Akagi is cut; the canon ladder is debt → Lord Tomita → domain → house. |
| D5 | MAJOR | **`prd/02-systems.md:1040`** un-swept origin cast — "mother Oyuki… sister Okimi" (canon: O-Nobu, Suzu). |
| D6 | MINOR | `prd/06-tech-architecture.md:288` dangling "FORWARD SPEC above" pointer + stale "until the storywave game plan lands"; a "28-day season" stale cluster echoes D1 in `02-systems.md:154,967`, `04-combat-balance.md:477`, `06-tech:220`, `fun-factor.md:139,290`; `roadmap.md:158` (frozen shipped history "0..5") coexists with `:24,197` "0..6" — defensible, reads as drift. |
| D7 | NOTE | **`prd:drift` structurally cannot catch D1–D5** — it is a presence check; "shipped but described as unbuilt" is invisible to it. Its CLEAN verdict is true but weaker than A5's closure line implies. Candidate hardening: add `satoyama`, `28-day`, `Akagi`, `Oyuki`, `Okimi` to the RETIRED-terms list. |
| D8 | NOTE | `AGENTS.md` still says the gate roster runs "comfortably under the soft 5s drift budget" — the real roster is now ~61s wall (vitest-dominated). |

## Deliberate gaps (surfaced, not defects)

- **Five of six per-season VN overlays are absent** — only the Autumn/nengu
  frame + the Bon side-beat exist; `scenes.md:23-24` records the other five as
  DEFERRED (no source takes; nothing invented). Plan-acknowledged (G0
  known-uncovered #1), but a standing bible-vs-build divergence
  (`05-world.md:31` locks a per-season overlay) awaiting a supplemental wave.
- The owed **balance re-baseline** + 24 unread telemetry reports (already on
  the snapshot's follow-on list) stand.

## Verified sound (what the review confirmed, with independent eyes)

- **Verify green re-run:** 17/17 gates (60.8s); `prd:drift` CLEAN.
- **Engine invariants hold in code:** rice is one shō integer, kura-only;
  bales/koku pure display; labour never writes HP; low-HP impairment derived
  from constants; no HP auto-trickle; defeat = days + ledger, never rice;
  night-round rewards coin-free by construction; wolf stage can't kill or win
  and is un-grindable; season pipeline order judge→nengu→spoilage→scene→turn
  is deterministic; persistence clean break (generation 2, `{retired:true}`,
  `kk:pre-reboot-backup`, chain restarts at v10); no `Math.random`/DOM in
  core; AC-6 holds (`siteYield` routes through `productionDraw`).
- **Tier-gate tests genuinely bite:** `t0-arc.test.ts` drives the REAL
  reducer cold-open→ascension (no forced flags; wolf via the real round; wage
  ≥R5; nengu + full year; determinism). `invariants.test.ts` walks 2000+ real
  states with derived, distinguishability-guarded checks. `MAP_NODE_CEILING`
  is the model derived fixture.
- **Content faithful to the bible:** full cast registry match (incl. Gonbei /
  Tahei, sweetheart deleted), speaker ladder You→Nameless→Gonbei(R7), R2
  silent rung, R3 wolf gate, R7 nengu gate, 16 zones keyed to the sheet
  vocabulary, requirements ≥3/rung; u5 Count + u8 side-beats redlines applied
  (156cc6b's fix confirmed); one-version ruling honored (t0v2 alternates
  unwired; only the legitimately-open `hd30-nengu` diverge in the switcher);
  save-retirement notice ships real prose.
- **Plan A A0–A4 trustworthy:** ADR-152–165 docket faithful (spot-checked
  against bible sections), §5 pointer-and-summary complete with the ship
  banner correctly removed, old §5 archived byte-faithful, roadmap 7-tier with
  the ADR-088 test names resolving, all four gen-region marker pairs intact,
  decisions.md effectively append-only over the range.

## Second pass — the spirit/depth audit (same day, human-requested)

Two further Opus agents audited whether the src/ rewrite honors the
bible's SPIRIT or is "lazy / half-assed / full of shortcuts."

**Verdict: a real rewrite, not a facade — but "faithful-but-shallow":
the R0→R7 spine is rich, on-bible, and fully reachable; the AMBIENT half
of the bible's T0 is largely authored-and-dark.** The shortcut hunt
scored it ~82% done-properly, with the debt in comments/tests, not fake
product: all seven new intents wire to real player verbs (the tactile
wage moment, market-day/purse/whitelist clamps, measured rice units, a
clean roster, uniform no-op edge handling — all genuinely well done).

The material gaps (all folded into the closure plan's C4/C5a):

- **4 of 5 authored side-beats can never fire** — grove/lease/crest are
  `trigger: scripted` with no enqueue site; the dog chain gates on
  `orchard-reclaimed`, which nothing sets. Only the Bon beat reaches a
  player.
- **The whole minor cast is mute** — ~40 authored dialogue lines
  (`dialogue.md` u9-*) are placed via `sceneId` that the talk affordance
  never dispatches (`people.ts:14` "a later chunk").
- **The log's world-breath is silent** — 40+ authored
  season/weather/gossip texture keys have zero consumers; the §0.5
  "flavor in the log" law is half-unimplemented.
- **The three bible-named hidden discoveries are absent** (only an
  off-list lacquer entry exists).
- **The R3 wolf-flees / new-moon line never emits** — the code names the
  beat (`night-rounds.ts:77`) and returns silent.
- **Night rounds don't grow** — ONE round exists (`first-night-round`,
  3 stages); the promised post-R3 escalations are unbuilt.
- **The grade ladder is 4-step** (`pillars.ts:26`) vs ADR-159's locked
  six-step — the PRD already speaks six-step, so the docs are AHEAD of
  the build here (the inverse of the A5 misses).
- **Stale "DORMANT / empty at G2" comments** misdescribe live systems;
  two legacy pre-reboot intro scenes (`intro.md:140,179`) still ship.

Corrections made to raw agent claims (verified directly): the earlier
"7 night rounds" statements were miscounts (one round, 3 stages); the
You:→Nameless: label flip DOES work (`intents.ts:411`).

The honest one-line summary: *a player today climbs a beautifully-written
ladder through a world that has been written but not yet switched on.*

## Recommended next actions (ranked)

> **Superseded by the closure plan** —
> `docs/plans/fable-2026-07-09-storywave-closure.md` (C0–C5) sequences
> every finding from both passes; the list below survives as the first
> pass's original ranking.

1. **Fix B1** (O-Sato → O-Hisa ×4) — 5-minute mechanical name-sync.
2. **Finish A5 properly** (D1–D6): one docs sitting sweeping §2.2, §1297, the
   satoyama/28-day clusters, fun-factor §T3, and the qa-playtesting `goto()`
   roster to the shipped reality.
3. **Fix B2 + B3 together** (fold the ADR-164 bleed into night-round fall;
   re-point the coin test at the real registry) — the test change is what
   makes the invariant durable.
4. **Harden `prd-drift`** with the D7 retired terms so the A5 class of miss
   REDs next time.
5. Minor sweeps when convenient: B4/B5 dead reads + stale comments,
   combat-rework test-debt, D8 AGENTS.md gate-budget prose.

---

## CLOSED — the closure addendum (session 134, 2026-07-10)

The closure plan (`fable-2026-07-09-storywave-closure.md`, now archived)
executed end-to-end by one Fable session under the human's live rulings
(ADR-166 refusing gate · ADR-167 full fiction wave · Fable-routed · widened
prd-drift). Finding → fixing commit:

| Finding | Fixed by |
|---|---|
| B1 (O-Sato ×4) | `9b702d8` — + the RETIRED_NAMES content guard (integrity test, RED-proven) |
| B2/B3 (night-fall bleed + registry-blind test) | `f0c954f` — one bleed home in defeat.ts; registry sweep RED-proven vs HEAD |
| B4 (dead autoplay branch) | `f48b6c2` — re-pointed to the kura + market-day guard |
| B5 (dead reads/comments) | `f0c954f` + `73ddc5f` |
| B6 (nightRoundOnly engine law) | `463b532` — fight + set_auto_combat refuse; registry-derived invariant |
| B7 (season.test.ts + reducer guards + the auto-reckon divergence) | `463b532` — ADR-166: the TRUE refusing gate (human ruled the non-default); the plan-named suite exists |
| B8 (free pool refill) | measured under C5b → HD-34 sub-question (evidence: the greedy sim exploits it and per-rung bands hold) |
| D1–D6, D8 (the A5 debt) | `6bb9348` + `c7768f4` + `cce03d4` + `b010898`; the frozen-§1 wholesale staleness → HD-33 |
| D7 (prd-drift hardening) | `3b38743` — retired vocabulary + WIDENED scan (human-ruled) + whole-word; RED-proof: 37 items vs the pre-sweep tree |
| Spirit: dark side-beats (+count-resolve, found en route) | `70eb5f1` — authored notes were the spec; reachability sweep gates the class |
| Spirit: mute cast | `34a741f` — talk_to through the deliverDialogue cursor |
| Spirit: silent log | `34a741f` — the texture emitter (worldgen stream, cockpit levers) |
| Spirit: wolf/new-moon lines | `70eb5f1` — u3-B's staged lines migrated verbatim (the HD-30 "later chunk") |
| Spirit: 4-step grades | `b221d6e` — the locked six-step ladder (ADR-159) |
| Spirit: rounds don't grow | `70eb5f1` — the post-climax grain-watch round (wolf never replays) |
| Spirit: legacy intro | `b221d6e` — dream+genemon deleted; the intro is the one fused soan scene |
| The five season overlays + discoveries + judge lines + per-season node reads (ADR-167) | `73b8f31` + `0260776` — 27 blind takes, 27 Pass-2 judges; picks live, alternates DEV-only, HR-18…HR-21 |
| The owed re-baseline | `2168a4b` — the idler's 4 missing verbs fixed (fullLadder on all seeds); the 2 design REDs → HD-34 |

En route (the human's adjacent-fix grant): the qa-shots gallery revived
(broken since the reboot — `8a8bb3e`), Yagōemon→Mohei, the enqueueScene
repeatable-contract bug, the narrative flag grammar's snake_case widening.

**The one-line truth this bought:** *"the shipped T0 plays the bible canon"*
now holds with no known asterisks beyond the human-gated queue (HR-1,
HR-18…21, HD-33, HD-34).
