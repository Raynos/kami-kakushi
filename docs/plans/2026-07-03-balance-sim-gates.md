# Persona-bot balance sim — pacing-envelope assertions (T0)

**Status: 📋 PROPOSED — awaiting human read.**

## Who builds this — Fable or Opus?

**Opus 4.8 builds Ph1/Ph3/Ph4; Ph2's envelope calibration is the one
Fable-preferred step.** Personas, metrics, the runner and the report are
mechanical builds against explicit DoDs — Ph1 must byte-reproduce the
known current pacing (`walkPacing` equality on the canonical seed), which
makes it self-verifying. Ph2 is where judgment bites: deciding a band is
sound (will never cry wolf) versus recognising that day-one out-of-band
reality is a genuine design-drift finding — mis-calling that pollutes
canon. The plan's §3 soundness procedure fences it (margins printed
beside every band, out-of-band → H-item, bands only from signed
constants), so a careful Opus CAN run Ph2; Fable is preferred there, and
any out-of-band finding should get a Fable-or-human read before its
envelope is allowed to gate.

**Why now.** The koku economy was speced in the PRD, tightened (2026-07-01),
then re-cored to coin/rice/standing inside ~36 hours (2026-07-02) once human
play exposed the pacing. Pre-play balance canon has a poor survival rate, and
today the only machine answer to "does the T0 arc still pace?" stops at R3
(`pacing:check`) — everything past the combat gate, the whole Phase-2 estate
grind, and every non-optimal play style is unmeasured until a human spends a
playthrough. The economy balance-watch
(`project/audit/reports/2026-07-02-economy-balance-watch.md`) already names
the cost: the capstone gate is reached in ~60 labour acts (~25–30 s of play)
against an intended ~85-minute climb, and nothing RED catches that.

**What this builds.** A standing simulation harness: three persona bots
(pure decision policies over player-visible state) drive the REAL engine
through public intents, cold-open → ascension, on a fixed seed set; a metrics
collector measures time-to-rung, economy curves, losses, starvation and
soft-locks; envelope assertions derived from the design source of truth turn
"the arc's shape survived this tweak" into a machine verdict
(`npm run verify:balance`), and a generated pacing report
(`docs/content/t0-pacing.md`, gen-docs pattern) gives every balance change a
committed before/after diff.

**What already exists (reuse, don't rebuild):**

- `src/core/autoplay.ts` — `focusedOptimalIntent`, the ONE shared
  perfect-player policy (pacing report + playcheck + arc tests consume it).
- `src/core/t0-arc.test.ts` + `src/core/invariants.test.ts` — full-arc
  drives via real reduces (the loop skeleton + guard pattern to copy).
- `src/scripts/pacing-report.ts` — `walkPacing()`: the wall-time model
  (intents × `AUTO_REPEAT_MS`) and the per-rung table/`--check` shape.
- `src/scripts/verify-run.ts` — gate roster + the on-demand pattern
  (`verify:budget` is the precedent for a check that is deliberately NOT in
  the 5 s roster).
- `src/scripts/gen-docs.ts` — the generated-doc + `--check` drift pattern.
- `src/core/content/balance.ts` — `T0_PACING_BAND_MIN/MAX`, `rungThreshold`,
  `AUTO_REPEAT_MS`, `RUNG_WALL_FLOOR_MIN` (the T1+ floor the sim will one day
  enforce — D-088 makes this harness the per-tier instrument).

---

## 1 · Architecture — where the bots live

New directory **`src/sim/`** — OUTSIDE `src/core/` (the pure-core boundary:
bots are a *player model*, not game rules). `sim` imports only the core's
public index; core never imports sim (the existing one-directional ESLint
rule already forbids it). Everything stays pure and deterministic — no DOM,
no Date, no Math.random; all randomness is already inside `GameState.rng`.

```
src/sim/personas.ts          // Persona interface + greedy / idler / explorer
src/sim/run.ts               // runPersona(persona, seed): RunResult
src/sim/metrics.ts           // RunMetrics types + collectors + soft-lock det.
src/sim/envelopes.ts         // bands derived from balance/PRD — no magic nums
src/sim/seeds.ts             // SIM_SEEDS (gating) + fuzz-seed derivation
src/sim/pacing-envelope.test.ts  // the slim in-gate tripwire (Ph2, rationed)
src/scripts/balance-sim.ts   // CLI: table · --report · --check · --fuzz N
docs/content/t0-pacing.md    // GENERATED report (committed, diffable)
```

The persona contract:

```ts
export interface Persona {
  readonly id: 'greedy' | 'idler' | 'explorer';
  /** Intent types this policy knows how to issue. */
  readonly knows: readonly IntentType[];
  /** PURE: next intent from player-visible state, or null (nothing to do). */
  decide(s: GameState): Intent | null;
}
```

**No cheating, enforced two ways.** (1) `decide` issues only `Intent`s through
`reduce` — never `applyGrindFight`, never forced flags, never state surgery
(note: `t0-arc.test.ts` currently calls `applyGrindFight` directly for the
R3 gate — the greedy persona is a strictly *stronger* arc proof because it
walks to the foe and issues real `fight` intents through the spatial +
`tab-combat` gates). (2) Policies read state only through the same public
selectors the UI renders from (`isUnlocked`, `canDoActivity`, `canMove`,
`canBuy`, `canCraft`, `availableActions`, `promotionReady`,
`ascensionAvailable`, `foeForecasts`, `durabilityBand`) — a review norm, not
a lint (a mechanical gate here would cry wolf; A11).

**Intent coverage is exhaustive at compile time, loud at report time.**
`src/sim/personas.ts` keeps the one runtime list of all intent types:

```ts
const ALL_INTENTS = { open_eyes: true, rake_rice: true, /* … */ }
  satisfies Record<IntentType, true>;   // union grows → tsc goes RED here
```

When the game grows an intent, `tsc` (already in `verify`) forces this map
to be updated; each persona's skip-list (`ALL_INTENTS − persona.knows`) is
then printed as a **SKIPPED INTENTS** table in every report — a loud,
standing admission, never a silent gap.

### The three personas

- **greedy-grinder** — `focusedOptimalIntent` (the existing canonical
  optimal route) extended with the real combat leg it stops at today: at R3
  without `combat-blooded`, walk to the monkey's node, manage readiness
  (rest below the stamina knee, `cook_meal` when hurt and sansai allows,
  `repair_weapon` per the durability band, `woodcut_edge` when out of wood),
  and issue real `fight` intents until blooded; `begin_rung_beat` /
  `choose_rung_option` (first option) at every held promotion; post-R7 keep
  labouring to bank Estate deeds; `ascend` the moment `ascensionAvailable`.
- **idler** — minimal input, auto-modes do the work. Requires one small core
  refactor first: extract the app loop's auto-mode decision
  (`autoStep` in `src/app/main.ts` — auto-combat > auto-rake > auto-labour,
  with its rest/repair/stop rules) into a pure `autoModeIntent(s)` in
  `src/core/autoplay.ts`, consumed by BOTH the app loop and the sim — the
  same no-desync move `focusedOptimalIntent` already made. The idler then:
  arms `set_auto_rake` at the start, and at sparse "check-ins" (only when
  the auto-mode returns null or a promotion/intro/beat affordance is
  showing) sets the next auto-labour / answers the beat / arms auto-combat
  with `retreat: true` for the blooding — everything between check-ins is
  literally the shipped auto-loop, long stretches untouched.
- **explorer** — breadth before optimisation: prefer any legal
  never-yet-issued (type, payload-id) pair in deterministic registry order —
  ask every intro/rung topic before choosing, walk every revealed node,
  `accept_quest`, `buy_item`, `buy_belonging`, `craft_weapon`, `eat_rice` /
  `sell_rice` / `deposit` / `withdraw`, `set_stance`, `spend_attribute` —
  falling back to greedy when nothing novel is legal. No extra RNG needed:
  novelty order is deterministic, so runs reproduce.

## 2 · Metrics per run (`RunMetrics`)

Collected by wrapping the reduce loop (state-diff classification, same
technique as `playcheck`'s reward trace):

- **Time-to-rung R1…R7 + ascension**: game ticks AND modeled wall-minutes
  (intents × `AUTO_REPEAT_MS` / 60 000 — the exact `walkPacing` model), per
  rung and cumulative; `ascended: boolean`.
- **Economy curves**: carried + banked `rice` and `coin`, and the House
  standing (`influence.estate.value`, the koku number), sampled every K
  intents; report the end values, maxima, time-to-first-coin, and
  time-in-Phase-2 (capstone → ascension) — the balance-watch #4 number.
- **Combat**: fights, wins, losses (hp → `SETBACK_HP`), retreats, and the
  loss-bite totals (coin/rice bled).
- **Starvation**: intents spent at satiety 0 / below the
  `STAMINA_FLAT_ABOVE` knee (time crawling at the rate floor).
- **Durability stalls**: intents spent with the weapon in the
  Battered/Broken bands, and auto-combat stops for `weapon-broken`.
- **Soft-lock detector**: RED if `decide()` returns null before ascension,
  OR no progress signal (rung-meter/rung/tier up, wealth up, influence up,
  any xp up, a new unlock, an intro/rung-beat advance, hp up) for
  `SIM_SOFTLOCK_INTENTS` consecutive intents. The constant ships with a
  rationale comment and is calibrated in Ph3 so it never fires on any green
  persona × seed run (soundness before teeth).
- **Skip-list echo** (§1) per persona.

## 3 · Envelopes — where the bands come from

Per the test-discipline rule: fixtures derive from the **source of truth**,
never copied magic numbers; assert **design levers**, not collapsed metrics.

| Assertion | Source of truth | Gated? |
|---|---|---|
| Greedy per-rung wall-min, R0…R7 | `T0_PACING_BAND_MIN/MAX` (D-056 signed band, [3, 22]) | GATE (per-lever) |
| Greedy ascends; every rung reached in order | ladder structure (`RANKS`) | GATE (structural) |
| Idler / explorer ascend within the guard; zero soft-locks | structural | GATE (structural) |
| Zero soft-locks, all personas × seeds | structural | GATE |
| Phase-2 window (capstone → EXCELLENT → ascend) | none signed yet | REPORT-ONLY (see open Q1) |
| Total arc time, per persona | collapsed metric | REPORT-ONLY (levers gate; totals inform) |
| Loss/starvation/durability counts | no signed intent | REPORT-ONLY |

Notes:

- The per-rung band is the *lever* assertion — each rung's
  `rungThreshold` is an independently tunable lever, and a per-rung band
  localises a regression to the lever that moved. Total-arc time collapses
  eight levers into one number, so it is reported, never gated.
- **Idler and explorer get NO time bands initially.** There is no signed
  design intent for "how slow may an idler be", and inventing one would
  manufacture wolf-cries. Their gates are structural (the arc closes, no
  soft-lock, invariants hold). If the human later signs a ratio (e.g.
  "idler ≤ 4× greedy"), it lands as a named constant in `balance.ts` first,
  then the assertion reads it — the drift-alarm stays anchored to canon.
- **Soundness procedure (never cry wolf):** an envelope only becomes a gate
  after the report shows every gating seed inside it with visible margin
  (min/max across `SIM_SEEDS` printed next to the band). This is a
  design-drift ALARM: wide bands catching re-corings, not a unit test
  catching ±1 intent noise. If current reality already sits OUTSIDE a
  signed band (plausible for combat-leg rungs, and *known* for Phase-2 per
  the balance-watch), the sim has found a real finding on day one — it is
  surfaced to the human as a todo/H-item, not silently re-banded and not
  shipped as a red gate.

## 4 · Determinism & seeds

- `SIM_SEEDS = [20260626, 1, 7, 11, 13]` in `src/sim/seeds.ts` —
  20260626 is the canonical arc seed every existing arc proof uses; the
  rest are already-familiar test seeds. Gating mode runs all 3 personas × 5
  seeds. Same seed ⇒ byte-identical run (asserted in Ph1's DoD, mirroring
  `t0-arc.test.ts`'s determinism case).
- **Fuzz mode (non-gating):** `--fuzz N` derives N seeds deterministically
  from a base seed via the core's splitmix helpers (`src/core/rng.ts` — the
  one RNG family, a salted stream, no `Math.random`). Fuzz never gates
  envelopes; it DOES hard-fail on structural breaks (soft-lock, corrupt
  state), because those are bugs at any seed. Output goes to the console +
  `tmp/` (repo-local scratch), never committed.
- All in-game randomness already flows through `GameState.rng`; personas
  are deterministic functions of state, so the harness introduces zero new
  randomness sources.

## 5 · Wiring — rungs, report, diff flow, budget

### 5a · `npm run verify:balance` (on-demand gate)

`src/scripts/balance-sim.ts --check`: full gating matrix, envelope verdicts,
non-zero exit on any RED. Placement on the "highest sound rung" ladder:

- **NOT the 5 s pre-commit roster** — the matrix is ~15–30 s (see 5c); the
  roster's soundness depends on staying under the drift budget.
- **NOT pre-push as-is** — pre-push runs the same `verify`; adding ~30 s to
  every checkpoint push taxes the tightest loop we have. There is **no CI**
  in this repo today (no `.github/workflows/`), so CI-nightly is not
  currently a rung that exists; if CI ever lands, `verify:balance` is its
  first tenant.
- **The sound resting place today**: an on-demand script (the
  `verify:budget` precedent) + one **slim in-gate tripwire**: a single
  vitest test (`src/sim/pacing-envelope.test.ts`) running greedy on the one
  canonical seed and asserting the per-rung band + ascension — ~1 s inside
  the vitest gate, always-on, genuinely RED-able (rationed per A17;
  Ph2's DoD re-measures `verify:budget` and demotes the tripwire to
  `verify:balance`-only if the 5 s median is threatened).
- Plus a **freshness gate** (5b) that is cheap enough for the roster.

### 5b · The generated report + the before/after diff flow

`npm run balance:report` regenerates **`docs/content/t0-pacing.md`**
(gen-docs pattern: generated banner, do-not-hand-edit, committed). It
contains: per-persona × seed time-to-rung tables (wall-min + ticks),
medians, band verdicts, economy-curve summaries, combat/starvation/
durability counts, skip-lists, `SIM_SEEDS`, and an **input fingerprint** — a
stable hash of the *evaluated* design inputs the sim consumes (`balance`
exports, `RANKS` thresholds, `ACTIVITIES` yields, `MOBS` stats,
`ESTATE_STAGES`, market/recipe prices). Values, not file text — comment and
formatting edits do NOT change it.

**The agent's flow around every balance change (the norm, Ph4 docs):**

1. Touch balance constants / content magnitudes.
2. `npm run verify:balance` — the machine verdict on the arc's shape.
3. `npm run balance:report` — regenerate; `git diff docs/content/t0-pacing.md`
   IS the before/after.
4. Commit the report with the change; paste the script's `--summary` block
   (per-rung deltas + verdicts) into the commit body.

**Enforcement rung (wolf-crying analysis):** the fingerprint makes a *sound*
staleness check possible — `balance-sim --check-fresh` recomputes the
fingerprint (imports + hash, no sim run, well under 1 s) and compares it to
the report header. It fires exactly when a balance VALUE changed without a
fresh report; it cannot fire on comments, prose, or unrelated code. Residual
wolf-risk: a value change the T0 arc never traverses still demands a ~30 s
regen whose diff is header-only — mild, and the regen itself is the proof.
Proposal (bias to motion, reversible): ship `--check-fresh` as a
**pre-commit WARN** (loud line in the hook when the staged diff stales the
fingerprint) for one milestone; if warnings are being ignored, promote it to
a hard `verify` gate (~1 s, parallel, fits the budget) as an explicit human
call — parked as an H-item.

### 5c · Runtime budget

Anchors: the full greedy arc is ~10.7 k productive acts (Σ thresholds
21 350 ÷ `RUNG_POINTS_PER_ACT` 2) plus rests/fights — and two full-arc
drives (`t0-arc` + `invariants`) already run inside the vitest gate that
fits the ~5 s parallel budget, so one arc ≈ 1–2 s under tsx. Matrix = 3
personas × 5 seeds ≈ 15–30 s serial. **Target: full gating matrix < 30 s.**
Fallbacks, in order: (1) fan runs across a worker pool (the `verify-run.ts`
pattern — runs are independent); (2) trim gating seeds to 3 (fuzz keeps 5+);
(3) gate greedy × 5 + idler/explorer × 1 and push the rest to fuzz. Ph2's
DoD records the measured runtime in the report header.

## 6 · What the sim does NOT claim (R5 stays)

The sim measures **pacing shape**, not fun. Explicit non-claims:

- A green envelope does NOT mean T0 is fun, juicy, or well-told — only that
  the arc's time-distribution survived the tweak. The human playthrough
  remains the only certificate of fun (R5: proxies prove absence, never
  presence).
- Personas are not humans: greedy is a ceiling, idler a floor, explorer a
  breadth probe — none models curiosity, confusion, or taste. Reveal
  cadence / first-5-minutes feel stay with `playcheck`; visual/feel QA
  stays with the screenshot loop.
- A RED envelope is an ALARM to read, not auto-canon: it means "the shape
  moved outside signed intent — a human decision is required" (either the
  tweak is wrong, or the intent constant needs a signed re-derivation).

## 7 · Phased steps (each independently committable)

### Ph1 — harness + greedy + report

`src/sim/` (personas.ts with the interface + `ALL_INTENTS` exhaustiveness
map + greedy only, run.ts, metrics.ts, seeds.ts), `balance-sim.ts` CLI
(table + `--report`), `docs/content/t0-pacing.md` generated + committed,
`package.json` scripts. No gating yet.

**DoD (R3 — proven against reality):**

- Greedy reproduces the KNOWN current pacing: R0–R2 intent counts match
  `walkPacing()` exactly on seed 20260626 (same shared policy ⇒ equality,
  not tolerance), and the full arc ascends with `tier === 1` on all
  `SIM_SEEDS` — cross-checked against `t0-arc.test.ts`'s result.
- Same seed twice ⇒ identical `RunMetrics` (determinism assert).
- Report shows the Phase-2 window ≈ the balance-watch's "anticlimax"
  finding (the sim *rediscovers* the known reality — the credibility test).
- `npm run verify` untouched and green; report regen is idempotent.

### Ph2 — envelopes from source of truth + `verify:balance`

`envelopes.ts` (bands read from `balance` only), `--check` gating matrix
(greedy bands + structural gates), `--check-fresh` fingerprint, the slim
vitest tripwire, seeds/margins printed beside every band.

**DoD:** `verify:balance` is RED-able (flip `RUNG_METER_THRESHOLDS.R5` ×3
locally → RED names R5; revert → green); every fixture traces to a named
constant (zero magic numbers); measured matrix runtime recorded (< 30 s or
a fallback from 5c applied); `verify:budget` median still under 5 s with
the tripwire in; any day-one out-of-band reality is filed to the human
(todo/H-item), not re-banded silently.

### Ph3 — idler + explorer + soft-lock detector

Extract `autoModeIntent` into `core/autoplay.ts` and re-point
`app/main.ts`'s `autoStep` at it (behaviour-identical — existing app tests
plus a small equivalence test hold it); implement idler + explorer;
soft-lock detector calibrated across all personas × seeds; skip-list tables
in the report; structural gates extended to all personas.

**DoD:** all 15 gating runs green + deterministic; detector fires on a
manufactured soft-lock (temporarily gate a needed verb → RED with the tick
number) and never on green runs; `autoStep` refactor ships with proof the
app loop behaviour is unchanged; report gains both personas' tables.

### Ph4 — diff flow + hook + docs/norms

Pre-commit WARN wiring for `--check-fresh` (per 5a/5b analysis);
`--summary` commit-body block; docs: the balance-change flow in
`docs/living/qa-playtesting.md` (§2 status flips to BUILT) + a one-line
pointer under the AGENTS.md test-discipline bullet; ADR in `decisions.md`
recording the envelope/gating design + the warn-vs-block default; H-item
for gate promotion + the Phase-2 band (open Q1); plan archived.

**DoD:** touching a balance value without regenerating warns loudly at
commit (demonstrated); a full worked example lives in one commit (balance
tweak + regenerated report + summary body); docs updated; plan Status → ✅
and `git mv` to `project/archive/`.

## 8 · Risks + open questions (defaults, bias to motion)

1. **No signed Phase-2 pacing band** (the balance-watch's biggest feel
   item). *Default:* report-only + H-item asking the human to sign a
   `T0_PHASE2_BAND_*` pair in `balance.ts`; the gate lands the day the
   constant does.
2. **Combat-leg rungs may sit outside [3, 22] today** (the band was derived
   sim-to-R3; R3+ thresholds were never sim-measured — `balance.ts` says
   so). *Default:* Ph1 measures first; if outside, surface as a finding
   (likely a REAL pacing bug), and any band change is a signed edit to
   `balance.ts`, never a test-side fudge.
3. **Matrix runtime blows the 30 s target** as the arc grows. *Default:*
   worker-pool fan-out (5c-1) — runs are independent; keep seeds before
   personas.
4. **Idler fidelity — `autoStep` extraction risk.** *Default:* pure-function
   extraction with an equivalence test; if the app loop resists (paused /
   document.hidden concerns), the pure part moves and the DOM guards stay
   in `main.ts`.
5. **Explorer brittleness** (novelty order breaks as content grows).
   *Default:* registry-order novelty (content arrays are the source of
   truth); a new intent shows up in the skip-list until taught — loud by
   design, never a crash.
6. **Report churn noise** (every balance commit re-diffs a big md file).
   *Default:* keep the report terse (medians + verdicts in the top table,
   per-seed detail below); revisit committing per-seed detail if diffs
   drown signal.
7. **Does `t0-arc.test.ts` migrate onto the greedy persona** (removing its
   `applyGrindFight` shortcut)? *Default:* not in this plan (scope);
   parked as a Ph4 note — the tripwire already proves the stronger claim.
8. **Retire `pacing-report.ts` into the sim?** *Default:* no — it is a
   green, cheap, in-roster gate sharing `focusedOptimalIntent`, so it
   cannot desync from the sim; consolidation is a later cleanup.

---

## Critical files for implementation

- `src/core/autoplay.ts` — `focusedOptimalIntent` to extend (greedy) and
  where `autoModeIntent` gets extracted (idler); the shared-policy precedent.
- `src/scripts/pacing-report.ts` — the wall-time model, per-rung table,
  `--check` shape, and the R0–R2 numbers Ph1's DoD must reproduce exactly.
- `src/core/content/balance.ts` — the envelope source of truth
  (`T0_PACING_BAND_MIN/MAX`, `rungThreshold`, `AUTO_REPEAT_MS`,
  `RUNG_WALL_FLOOR_MIN`) and the fingerprint's input set.
- `src/core/t0-arc.test.ts` — the full-arc drive loop + guard +
  determinism-assert pattern the sim runner copies (and the
  `applyGrindFight` shortcut the greedy persona replaces with real `fight`
  intents).
- `src/scripts/verify-run.ts` — the gate roster the tripwire/freshness
  checks must respect, and the worker-pool pattern for the matrix-runtime
  fallback.
