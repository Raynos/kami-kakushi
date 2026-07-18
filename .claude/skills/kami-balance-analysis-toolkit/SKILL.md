---
name: kami-balance-analysis-toolkit
description: >-
  The prove-it-don't-eyeball balance methodology for kami-kakushi:
  how the persona-bot sim prices a design decision, the ADR-132
  commit protocol (verify:balance → balance:report → t0-pacing.md
  diff → --summary in the commit body), the input fingerprint, the
  signed-band LAW (RED = a human decision, never a test-side fudge),
  the ADR-187 skip-blindness tradeoff, the worktree attribution
  proof ("who moved these 33 rows?"), reading FB-8 telemetry vs the
  sim, derivation obligations before proposing a tune, and the
  personas/seeds/modes reference. Load BEFORE touching any balance
  or content magnitude; when a pacing band or verify:balance goes
  RED; when t0-pacing.md rows moved and you don't know why; when
  someone asks "is this feature too expensive / too fast / worth
  it"; when quoting pacing numbers in a plan or HD-item; when
  reading project/telemetry/; or on fire-phrases like "re-sign the
  band", "re-sim", "stale pacing report", "fingerprint mismatch",
  "attended vs sim".
---

# kami-balance-analysis-toolkit

Balance work in this repo is measured, never eyeballed (PH2/PH3).
The sim drives the REAL engine — `createInitialState` + `reduce`,
never a re-derived formula — so its numbers cannot drift from the
game. Every claim below cites its source; where a value can drift,
read it live from the file instead of trusting this page.

Jargon (rung, koku, kura, SIM-OWNED SEED, fingerprint, HD/FB/ADR):
see kami-domain-reference's glossary.

## 0. The instrument stack

| Instrument | Command | Runs | Proves |
|---|---|---|---|
| Full gating matrix | `pnpm run verify:balance` (= `balance-sim.ts --check`) | on-demand (NOT in the verify roster; the nightly step is deliberately commented out — `.github/workflows/verify-nightly.yml:41`) | greedy per-rung bands + arc-closure for 3 personas × 5 seeds + report freshness |
| Committed report | `pnpm run balance:report` → `docs/content/t0-pacing.md` | after any magnitude change | the report's git diff IS the before/after |
| Commit-body block | `pnpm run balance:sim --summary` | step 4 of the flow | per-rung medians + Δ vs HEAD + verdicts |
| Freshness only | `pnpm run balance:fresh` (`--check-fresh`, <1s, no sim) | pre-commit WARN + by hand | committed report matches live design inputs |
| Fast tripwires | `pacing` + `playcheck` gates, `src/sim/pacing-envelope.test.ts` | every commit (in `pnpm run verify`) | cheap in-band checks; RED-fix recipes live in kami-verify-gates |
| Reality | `project/telemetry/*.md` (git-ignored) | read before balance work | the human's real attended minutes (§5) |

Script names verified in `package.json:33-47`; the sim is
`src/scripts/balance-sim.ts` (mode header at lines 1-16).

## 1. The ADR-132 protocol — after touching any magnitude

Canonical prose: `docs/guides/qa-playtesting.md` §2 ("the
balance-change flow"). Executable form:

```bash
# 0. Reality first (FB-8): untainted real-play reports?
ls project/telemetry/            # read §5 before trusting these
# 1. Make the value change (balance.ts / requirements.md / content)
# 2. Machine verdict
pnpm run verify:balance
# 3. Regenerate the committed report; EYEBALL the diff
pnpm run balance:report
git diff docs/content/t0-pacing.md
# 4. Commit report WITH the change; paste this into the commit body:
pnpm run balance:sim --summary
```

Also regenerate anything derived: `pnpm run gen:docs` (baked price
tables) and `pnpm run fixtures:regen` if waypoint states shifted
(core + fixture regen land in the SAME commit — fixtures gate).
A rung-cost tune is NOT a balance.ts edit: it is a `count` edit in
`src/core/content/narrative/requirements.md` regenerated via
`pnpm run gen:narrative` (ADR-137/182 — `rungThreshold` is dead).

**The input fingerprint** (`inputFingerprint()`,
`balance-sim.ts:69-84`): sha256 of the EVALUATED design inputs —
`balance`, ranks' eligibility, `RUNG_REQUIREMENTS`, activities,
mobs, weapons, estate stages, market, recipes — values not file
text, functions skipped, first 16 hex chars, embedded in the
report header. So: a VALUE change fires it; comments, formatting,
helper-function bodies, UI code, and dialogue prose never do.

**The WARN is easy to walk past — treat it as a block.** The
pre-commit freshness check (`.githooks/pre-commit:122-137`,
escape `SKIP_BALANCE_FRESH=1`) only WARNS. That is exactly how
session 182's ADR-184 zone re-mapping landed without its report
and 33 stale rows sat unreported for a session (incident detail:
kami-failure-archaeology; proof method: §4 below). Promotion to a
hard gate is an open candidate, not done — do not claim otherwise.

## 2. The band LAW

- **Bands derive ONLY from human-signed constants.** Read them
  live, never from memory (a co-agent may have WIP — for committed
  canon use `git show HEAD:src/core/content/balance.ts`):
  `T0_PACING_BAND_MIN`/`MAX` (balance.ts:100,108 — [3, 28] as of
  2026-07-18; MAX re-signed 25→28 by the human 2026-07-13,
  ADR-197), `RUNG_WALL_FLOOR_MIN` (balance.ts:95 — 30, gates from
  T1; T0 exempt), `PHASE2_PHASE1_RATIO_MIN`/`MAX`
  (balance.ts:115-116 — 0.8/1.2, ADR-133). An agent never invents
  a band, widens one to pass, or hardcodes one in a test.
- **A RED band is a human decision.** The sim's own RED message is
  the law verbatim: "a human decision is required (re-derive the
  counts or re-sign the band — never a test-side fudge)"
  (`balance-sim.ts:346-350`; the Phase-2 mirror at :377-378). Your
  options on RED: (a) surface the fork as an HD-item with the
  measured numbers, or (b) re-derive the design inputs (e.g. the
  requirement counts) so the measurement moves. Editing the band
  or the test is the human's signature, not yours (ADR-056 signed
  the T0 band; routing table: kami-change-control).
- **The sim is SKIP-BLIND by standing ruling (ADR-187).** The
  greedy persona deliberately does NOT learn the `sleep` verb
  (`personas.ts:109-113` — the ADR-187 comment block + the intent
  census entry; ruling text
  `docs/living/decisions/150.md:1384-1389`; test
  `src/core/sleep.test.ts:183`). Named tradeoff: the report keeps
  measuring real active play, and a convenience the sim doesn't
  model can't drag a rung under the signed 3-min floor — the
  ruling exists precisely so a build "cannot stall on a band
  violation the way the kitchen-pot siting did" (HD-40, §3). Cost:
  the sim under-represents sleep-heavy play; telemetry (§5) is the
  instrument that sees it. A regenerated byte-identical
  t0-pacing.md is the proof the ruling held.
- **SIM-OWNED SEED constants** (marked in balance.ts, e.g. :540)
  are verdicted by the sim — never hand-tune them. The DEV cockpit
  levers (`export let` + `__setBalanceLever`) are the HUMAN's; an
  agent only transcribes an exported cockpit diff into canon
  (ADR-134/ADR-059; apply-flow in qa-playtesting.md §1).

## 3. How the sim prices a design decision — the HD-40 exemplar

The pattern: build the mechanic behind its gate, sim BOTH worlds,
compare against the signed band, and let the delta price the
design. The kitchen-pot siting
(`project/human-in-the-loop/decisions.md`, HD-40, still open as of
2026-07-18) is the canonical run:

1. Human steer: "kitchen-only cook" — the pot hangs at the kitchen,
   a hurt fighter walks back to mend. Built and gated
   (`canCookHere`); enabling it is one line in `intents.ts`.
2. Sim priced the walk: R3 = **22.7 wall-min shipped vs 31.6
   kitchen-only — OUT of the then-signed [3, 25] band by 6.6**
   (decisions.md HD-40 table). The cost was structural (every foe
   3-4 hops from the only pot), not a tuning artifact.
3. Player-model fixes were TRIED and reported as negatives:
   batching greens bought 1 min; mending to two-thirds made the
   bot fight hurt, lose more, pay MORE trips (decisions.md HD-40).
4. So the feature **HELD** — shipped OFF, the fork (re-sign the
   band / move a lever / new content / keep as-is) written up as
   HD-40 for the human. A band violation stalls a feature; it
   never gets fudged through. An ADR bullet that prematurely
   recorded it as SITED was corrected to "HELD, pending HD-40".

**The staleness addendum (2026-07-13, session 202): re-sim before
deciding on old numbers.** The ground moved under HD-40 — the
sickroom lane (ADR-164/197) removed cook's HP mend entirely,
`COOK_HP_RESTORE` no longer exists, and the band is now [3, 28] —
so the 31.6 was measured in a world that no longer ships
(decisions.md HD-40 addendum). Law: **a sim price is stamped with
its fingerprint; before any decision quotes one, re-run the sim at
today's inputs.** A held decision is a measurement with a date,
not a verdict for all time.

## 4. The worktree attribution proof — "who moved these rows?"

When t0-pacing.md rows move that your change cannot explain, do
not assume — prove attribution by regenerating the report from a
past SHA. Session 183 (journal
`project/journal/2026-07-12-session-183-sleep-the-day-away.md`,
"The balance pass") used exactly this to prove 33 moved rows
belonged to session 182's ADR-184 zone re-map, not the sleep verb:

```bash
# 1. Throwaway worktree at the suspect base SHA (repo tmp/ is
#    git-ignored; never touch the shared tree's checkout itself)
git worktree add tmp/attrib-<sha> <sha>
# 2. Give it deps (fast — resolves from the local pnpm store)
cd tmp/attrib-<sha> && pnpm install --frozen-lockfile
# 3. Regenerate the report AT that SHA
pnpm run balance:report
# 4. Diff the two generated artifacts
diff docs/content/t0-pacing.md ../../docs/content/t0-pacing.md
# 5. Clean up — a leftover worktree confuses every co-agent
cd ../.. && git worktree remove --force tmp/attrib-<sha>
```

Read the diff as a partition: rows identical across both
regenerations were moved by commits BEFORE `<sha>` (a missed
ADR-132 regen); rows only your tree moves are yours. Session 183's
result: every table byte-identical → the sleep verb moved nothing
(the ADR-187 ruling held, demonstrably); its own contribution was
two honest lines (a new fingerprint + `sleep` in the never-issues
list). Report the attribution in the commit body when you finally
regen — the report diff then credits the right change.

## 5. Telemetry vs sim — reading FB-8 reality

The pacing triangle: **sim bots = theory · signed bands = intent ·
`project/telemetry/` = reality** (contract:
`project/telemetry/README.md`, human-locked 2026-07-05). Rules
that bite:

- **Human data never gates.** Attended-vs-sim deltas are evidence
  quoted in commit bodies and HD-items, never a RED/GREEN.
- **One file = one RUN (a game start), not a playthrough.** Read
  the `Σ attended` line; `ls | wc -l` measures nothing.
- **Respect the taint ledger.** `speed>1`, teleports, `qa-drive`,
  `save-import` distort the clock; tainted runs are excluded from
  vs-sim comparisons (the folder self-prunes time-tainted and
  sub-rung-length files; `save-import` survives with unknown
  economy — honest clock, quote time only).
- **The diary rule:** a conclusion drawn from these files must
  land in a committed note (journal / balance-watch entry) with
  the numbers quoted — the raw files are one machine's disposable
  sensor data, never committed.
- Where sim and attended time disagree, suspect the sim's named
  blind spots first (skip-blindness §2; personas are models, not
  players) before proposing a tune.

## 6. Derivation obligations — before proposing any tune

House discipline distilled from the HD-40 and session-183 records
plus the AGENTS.md test-discipline rule; walk it before any
"change X to Y" proposal:

- [ ] **Predict the number first.** From the mechanism, write down
  what the sim SHOULD report after your change — then run it. A
  surprise in either direction is a finding about your model, not
  noise (PH3: green you didn't predict is not understanding).
- [ ] **One mechanism explains ALL observations — including the
  negatives.** HD-40's price held up because the walking-cost
  story also explained why batching barely helped and why partial
  mends made it worse. If your story can't absorb a
  counter-observation, the story is wrong, not the observation.
- [ ] **Report the experiments that failed.** Negative results go
  in the HD-item/commit body (HD-40 did); a fork presented without
  its dead ends invites the human to re-run them.
- [ ] **Assert the design lever, not a collapsed metric**
  (AGENTS.md test discipline): tune and test atk/taken/wear/count
  — the monotonic mechanism — never a win-rate that conflates
  levers.
- [ ] **Attribute before you tune.** If the baseline report is
  stale or rows moved unexplained, run §4 first — tuning on top of
  someone else's unregenerated drift compounds it.
- [ ] **Check whose lever it is.** Signed bands and cockpit
  sliders are the human's (§2); SIM-OWNED SEEDs are the sim's;
  requirement counts are provisional-by-design. Routing:
  kami-change-control.

## 7. Personas / seeds / modes reference

Personas (`src/sim/personas.ts`; roster at :580 — pure decision
policies over player-visible state, intents through `reduce` only,
no cheating by construction):

| Persona | Policy | Promise (ADR-170) |
|---|---|---|
| `greedy` | `focusedOptimalIntent` + a real R3 combat leg + the sickroom mend leg (:180-273) — the floor; the ONLY persona the bands gate on | `ascend` |
| `idler` | replays the shipped `autoModeIntent` auto-loop verbatim between sparse check-ins (:275-…) — "leave it running" reality | `ladder` — full ladder WITHOUT ascension is green (Phase 2 is attention-priced by design, :284-286) |
| `explorer` | novelty-first: any legal never-issued (type, payload) pair in fixed registry order, greedy fallback (:492-…) — the breadth probe | `ascend` |

Seeds (`src/sim/seeds.ts:11-14`): `SIM_SEEDS = [20260626, 1, 7,
11, 13]`; `CANONICAL_SEED = 20260626` is shared with the t0-arc
tests. Same (persona, seed) ⇒ byte-identical run. Fuzz seeds
derive deterministically via `deriveDayKeyed` — reproducible from
the base seed.

Modes (`balance-sim.ts:1-16`, dispatch :502-554):

| Flag | Does | Gates? |
|---|---|---|
| *(none)* | per-persona console report | no |
| `--check` | greedy bands + Phase-2 ratio + structural promise-closure per persona×seed + freshness; non-zero exit on RED | yes — `verify:balance` |
| `--check-fresh` | fingerprint compare only, <1s | pre-commit WARN |
| `--report` | regenerate `docs/content/t0-pacing.md` | the committed artifact |
| `--summary` | commit-body block: medians, Δ vs HEAD, verdicts, Phase-2 texture proxies (report-only) | no |
| `--selftest` | harness self-proof: walkPacing equality, determinism, all seeds ascend | on-demand |
| `--fuzz N` | N derived seeds, STRUCTURAL checks only — fuzz never gates envelopes | no |

## When NOT to use this skill

- A verify gate (`pacing`, `playcheck`, `fixtures`, …) went RED
  and you need the fix recipe → **kami-verify-gates**.
- "What does koku/rung/satiety mean; what's the combat formula" →
  **kami-domain-reference** (owns the game math pack).
- Adding a NEW balance constant / cockpit lever / requirement →
  **kami-extension-recipes** (file order), then return here for
  the ADR-132 flow.
- "May I change this number at all / is it human-gated" →
  **kami-change-control**.
- General "who broke this / where do I even start" triage and the
  `window.__qa` surface → **kami-debugging-playbook** (it routes
  back here for the §4 attribution proof).
- The full back-story of an incident cited here →
  **kami-failure-archaeology**.
- Applying the human's exported cockpit tune → the apply-flow in
  `docs/guides/qa-playtesting.md` §1 (stale-canon guard first).
- Whether a change is FUN is never answered by the sim —
  `docs/living/fun-factor.md` + the human (PH5); the sim measures
  pacing, closure, and economy shape only.

## Provenance and maintenance

Authored 2026-07-18 from repo state at HEAD `4bfb3ba3` (a
co-agent's talk-system WIP was in the working tree; every value
above was checked against committed canon). Volatile facts are
date-stamped inline. Re-verify before trusting:

```bash
# Band values (the [3,28] etc. quoted above)
git show HEAD:src/core/content/balance.ts | grep -n \
  "T0_PACING_BAND\|RUNG_WALL_FLOOR\|PHASE2_PHASE1_RATIO"
# Sim modes / RED-message law / fingerprint inputs
sed -n '1,16p;69,84p;340,352p' src/scripts/balance-sim.ts
# Personas + seeds
grep -n "PERSONAS: readonly\|promise" src/sim/personas.ts; cat src/sim/seeds.ts
# verify:balance still absent from the commit-time roster
grep -n "balance" src/scripts/gates.ts .githooks/pre-commit
# HD-40 still open / resolved?
grep -n "HD-40" project/human-in-the-loop/decisions.md \
  project/human-in-the-loop/archive.md
# Current report fingerprint + freshness
pnpm run balance:fresh
```
