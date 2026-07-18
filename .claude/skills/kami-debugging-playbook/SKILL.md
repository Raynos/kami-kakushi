---
name: kami-debugging-playbook
description: >-
  Symptom→triage playbook + measurement-tool catalog for debugging
  kami-kakushi. Load this when anything is RED or weird — a verify
  gate fails; the dev server on :5264 seems dead or "port in use";
  e2e is red or mass-failing with nonsense errors (wrong app on
  port); "the UI didn't update" / a log line is missing; a test
  passes alone but fails in the suite (or vice versa); the
  orphan-id/save sensor alarms; the fixtures gate REDs and regen
  itself fails; a gen byte-compare REDs; you need to prove HEAD is
  green before pushing; or you're about to git-bisect in the shared
  tree. Also load it BEFORE eyeballing screenshots or declaring any
  UI defect — it owns the measure-first discipline and the full
  window.__qa surface.
---

# kami-debugging-playbook

Debugging doctrine for this repo, distilled from its own incident
history. Three laws sit above every row of the tables below:

1. **Measure before eyeballing; suspect the DRIVER before the game**
   (PH2). "The UI didn't update" is a claim about your headless
   driver until proven otherwise — commit `6607bdee` struck a
   reported "defect" that was just typewriter pacing.
2. **A sensor's false positive is worse than silence.** The orphan-id
   sensor once cried wolf on clean saves (`aa474c0d`) — it teaches
   everyone to ignore the one signal that matters. When a sensor
   alarms, first ask whether the *sensor* is wrong.
3. **But never rationalize away a visual oddity** (retro A8, cited in
   AGENTS.md's ancestry): a real missing-scrim bug was once dismissed
   as a "harness artifact". Verify oddities; don't explain them away.
   This is the anti-slop edge: a "probably fine" glance is how taste
   failures ship.

Jargon (gate, rung, herdr, fixture, HR-item…) is defined in
**kami-domain-reference**'s glossary. "Gate" here = one entry in the
verify roster `src/scripts/gates.ts` (21 today — never hand-type the
count, run `grep -c "name: '" src/scripts/gates.ts`).

## 1. Symptom → triage

| Symptom | First move | Then |
|---|---|---|
| A verify gate is RED | Read the gate's own error — most name their exact fix command | Per-gate recipes: **kami-verify-gates**. Red file not yours? See "someone else's red" below |
| Dev server dead / "port 5264 in use" | `lsof -nP -iTCP:5264 -sTCP:LISTEN` — who holds it? | Held → REUSE it. Dead → **ask the human** to relaunch the herdr pane. NEVER respawn/kill (below) |
| e2e mass-red with nonsense (`__qa.fixtures is not a function`) | `lsof -nP -iTCP:5265 -sTCP:LISTEN`, then `curl -s localhost:5265/ -o /tmp/probe && grep -ci kami /tmp/probe` (pipeless on purpose — a `\|` in a table cell breaks copy-paste) | A foreign vite is squatting :5265 — `reuseExistingServer` drives whatever answers (below) |
| e2e red on main (CI 🚨 in session brief) | Reproduce: `pnpm run test:e2e` (~50s local, 3 projects) | Traces in `tmp/test-results/`. The lane is CI-only by budget (ADR-072); HD-45 ruling: *read* CI, don't add a gate |
| "The UI didn't update" / missing log line | Run a **control verb** (§2.3) before touching anything | Check the channel filter and the reveal/typewriter queue (below) |
| Test green alone, red in suite (or order-dependent) | Suspect leaked module state — vitest runs `isolate: false` (vite.config.ts:318) | `__resetBalanceLevers()` in cleanup (below) |
| "N orphaned id(s)" / save alarm | Verify the sensor's diff basis before "fixing" saves (law 2) | Persistence architecture + migrations: **kami-save-and-schema** |
| `fixtures` gate RED | `pnpm run fixtures:regen`, commit the regenerated saves WITH the causing change | A spec failing its own `expect` at gen time is a REAL finding — the engine no longer reaches that waypoint. Don't paper over it |
| gen byte-compare RED (gen-narrative / gen-docs / gen-prd-regions) or oxfmt | Run the regen the error names (`pnpm run gen:narrative` / `gen:docs` / `gen:prd-regions` / `format`) | NEVER hand-edit a `*.gen.ts` — gen-narrative's error names the source `.md` to edit (gates.ts:46-49) |
| Commit blocked: verify > 8s HARD | Check `tmp/precommit-timings.tsv` for the trend; find the slow test | Tag it `// @slow` (top of file, first 2048 bytes — vitest-verify.ts) to lane it to push/CI. `SKIP_BUDGET=1` ONLY for a genuinely loaded box (.githooks/pre-commit:65), never to launder a slow test |
| A balance/pacing number moved unexpectedly | Attribution proof (§2.2) — never assume it was you | Sim methodology: **kami-balance-analysis-toolkit** |
| Screenshot looks wrong / off-canon | Verify against `docs/living/ui-design.md` (Andon Steel — ADR-127) | Visual capture loop: `capture-game-states` skill |

### Someone else's red (shared tree)

This is a multi-agent single checkout. Before fighting a red: `git
status` + the pre-commit's staged-set echo + herdr peer list. If the
red is a co-agent's uncommitted file, leave your commit LOCAL and
never `SKIP_VERIFY=1` a red tree onto main (AGENTS.md Checkpoint;
the one sanctioned pattern is ledgered in
`project/status/sweepguard-ledger.md`).

### Dev-server law (:5264) — the three lines

REUSE the shared server on :5264; if it is genuinely dead
(`lsof` shows nothing listening), ask the human; NEVER spawn a
rival or kill the holder — the vite `singleServerGuard` and the
`guard-dev-server.sh` hook block both. HMR is deliberately inert —
never "fix" it back on (TST2, FB-257). Mechanics (ports, guards,
`KAMI_ALLOW_MULTI_DEV`): **kami-build-and-env** §5; the full
incident history (sessions 139/151 et al.):
**kami-failure-archaeology** C1.

### Wrong-app-on-port (the 115-red incident)

2026-07-17: a foreign prototype's vite squatted the old e2e port
5199; Playwright's `reuseExistingServer: !CI` happily drove the
WRONG game → 115 reds of `__qa.fixtures is not a function`. The lane
moved to **5265** (`playwright.config.ts:18`, comment :14-17; commit
`60101d92`). Diagnosis is always the same: prove *which app* answers
the port before debugging "failures" in yours.

### "The UI didn't update" — driver-suspect-first

Incident (session 191→192, corrected in `6607bdee`): a headless
drive fired ten rakes in ~1.5s and reported "36 entries in state, 32
in DOM" as an open defect. The lines were queued behind the log's
reveal cascade + typewriter; waiting 30s, all 36 landed. And session
183's scare: a "missing" sleep line was on the log's **Now** channel
while the pane was filtered to **Story** (Now sits OUTSIDE the
six-tab channel filter — `src/ui/render/log.ts:122-129`). So, in
order:

1. **Control verb** — press a shipped verb (e.g. Rest) through the
   same path. Control also "missing" ⇒ your observation is wrong,
   not the game (§2.3).
2. **Channel filter** — is the line on a channel the current filter
   hides? Fleeting flavor lands on Now.
3. **Pacing queue** — headless drives outrun the reveal cascade.
   Wait, or boot with `?instanttext=1` / call
   `__qa.instantActions()` for harness runs
   (`src/tests/e2e/helpers.ts:59,70`).
4. Also: an ephemeral push at the log's ring cap evicts the OLDEST
   entry, so a naive `entries.slice(before)` window shifts silently
   (session-183 journal, Landmines).

Only after all four is a missing line a game defect worth a failing
test (then: `tdd` skill, repro first).

### Cross-file test leakage (`isolate: false`)

The "pure" core holds three DEV-mutable module states: balance
levers (`__setBalanceLever`), the story overlay, and the
zone-reveal mode. Vitest reuses workers without isolation
(vite.config.ts:309-318), so a test that sets a lever and doesn't
reset leaks into the next FILE. Fix: `__resetBalanceLevers()`
(exported from the core index; `src/core/content/balance.ts:929`)
in `afterEach`/cleanup. If leakage persists, the config's own
comment sanctions dropping `isolate: false` first — a deliberate,
measured trade (it bought ~1.8s), not a free knob.

## 2. Discriminating experiments

### 2.1 Worktree-HEAD verify — local green can hide committed red

The shared index can commit things your working tree hides:
`aa6a86ad` resurrected an archived plan into HEAD; working-tree
`pnpm run verify` stayed GREEN while HEAD was RED (session-183
journal, Landmines). Before a push you're unsure of, prove HEAD
itself:

```bash
git worktree add --detach tmp/wt-head HEAD
cd tmp/wt-head
pnpm install --frozen-lockfile     # worktrees share no node_modules
VERIFY_FULL=1 pnpm run verify      # push-grade proof
cd ../.. && git worktree remove --force tmp/wt-head
```

Costs and conventions: `docs/guides/shared-tree-git.md` §6 (a
worktree is NOT what :5264 serves — PH6 applies to playtesting it).

### 2.2 Attribution proof — "who changed this number"

When a generated artifact (pacing report, gen doc) shows changes
your diff can't explain, do not assume — regenerate it from a
throwaway worktree at the commit BEFORE the suspect and diff the
two artifacts. Precedent (session 183): 33 moved pacing rows were
proven to be session 182's un-regenerated ADR-184 re-mapping, not
the sleep verb. The recipe (worktree add → install →
`balance:report` → diff → remove) is OWNED by
**kami-balance-analysis-toolkit §4** — use its command block, don't
re-derive. Know the standing hole: the balance-freshness check only
WARNS at commit, so a pacing-moving change can land without its
report — exactly how the 33-row drift went unreported for a session
(**kami-failure-archaeology** D6).

### 2.3 The control-verb test

Before declaring any UI/log/state defect, run a SHIPPED verb known
to work through the same pipeline and observe it the same way. If
the control also "fails", the defect is in your observation (DOM
query, filter, pacing, fixture) — fix the harness, not the game.
Session 183 ran Rest as the control for the sleep line and saved
itself a phantom fix.

### 2.4 Bisect etiquette (shared tree)

`git bisect` CHECKS OUT old commits — in the shared checkout that
yanks every co-agent's files and the live :5264 server's source out
from under them. Derived rule (no gate enforces it; it follows from
the shared-tree law): **bisect only in a detached worktree**:

```bash
git worktree add --detach tmp/wt-bisect main
cd tmp/wt-bisect
git bisect start <bad-sha> <good-sha>
git bisect run pnpm test   # or a narrower repro script
git bisect reset
cd ../.. && git worktree remove --force tmp/wt-bisect
```

Re-run `pnpm install` inside if the lockfile changed across the
range. Everything stays inside `tmp/` (git-ignored).

## 3. Measurement catalog — measure, then interpret

Headless ONLY: MCP browser tools are blocked by
`.claude/hooks/enforce-headless-qa.sh` (they open a visible window).
The visual capture loop's front door is the `capture-game-states`
skill; how-to-drive canon is `docs/guides/qa-playtesting.md`.

### 3.1 `window.__qa` (the play API)

Installed in `src/app/main.ts:574-801`; live on any dev serve (even
under `?dev=no` — `src/app/dev-gating.ts`), prod only with
`?dev=yes`. Full surface (verified at main.ts:575-800):

- **Observe**: `state()`, `pacing()` → `{actionCount, ticks,
  reveals}`, `reveals()`,
  `selectors.{unlocked,tier,rung,combatLevel}()`
- **Drive**: `dispatch(intent)`, `activity(id)`, `auto(id|null)`,
  `goto(node)` (real `move_to` hops — activities/foes are spatial;
  zone roster in `src/core/content/areas.ts`), `fight(mobId)`
  (auto-walks to the foe — main.ts:632), `autoCombat(mobId|null)`,
  `setStance(s)`, `tick(dt)`, `frames(n)`, `pause()`, `resume()`
- **Time/teleport**: `instantActions(on=true)` (ADR-148),
  `speed(mult)`, `toRung(id)`, `toTier(n)`, `jumpToPhase2()`,
  `jumpToAscension()`
- **Save**: `newGame(seed)`, `save()`/`load(b64)`, `backupSave()`,
  `hasBackup()`, `restoreBackup()`, `loadFixture(name)`,
  `fixtures()`
- **Escape hatches**: `forceState(patch)`, `setSeed(n)` —
  spot-checks ONLY, never gate runs (a gate run is one
  uninterrupted `newGame(seed)`→finish; qa-playtesting.md)
- **Handles**: `balance` (the cockpit — read-only for agents;
  moving a slider into canon is human-gated, ADR-134),
  `telemetry` (`summary/report/segments/runs/configure/drop/clear`)

**Taint discipline (FB-8)**: every drive/teleport/speed call runs
`qaTaint` (main.ts:569-572) so agent runs never pollute the human's
pacing data. `__qa.telemetry.clear()` after a harness session
(qa-playtesting.md:276). Preserve `qaTaint` when adding handles.

**Retired script**: `src/scripts/playtest.mjs` was DELETED
2026-07-18 — it had rotted twice over (stale port default, a call
to the removed `qa.faceWolf()`); qa-playtesting.md records the
retirement. The real fight driver is `__qa.fight(mobId)`.

### 3.2 Scripted sensors

| Tool | Command | Reads as |
|---|---|---|
| Screenshot gallery | `QA_URL=http://localhost:5264/ node src/scripts/qa-shots.mjs` | Frames into `project/audit/screens/latest/`; plays the intro like a player (`toRung` never does) |
| Balance sim | `pnpm run verify:balance` (`--check`) · `balance:report` · `tsx src/scripts/balance-sim.ts --summary` · `--selftest` · `--fuzz N` · `balance:fresh` (`--check-fresh`) — flags verified balance-sim.ts:500-539 | Gating matrix vs the signed pacing bands; `--summary` is the paste-into-commit-body block (ADR-132). Methodology: **kami-balance-analysis-toolkit** |
| Pacing report | `pnpm run pacing` / `pacing:check` | Per-rung wall-time via the REAL engine |
| Fun proxies | `pnpm run playcheck` | firstActionMs / maxDeadTimeMs vs the ratchet baseline (details: **kami-verify-gates**) |
| Verify timing | `pnpm run verify:budget` | Median-of-3 + per-gate breakdown against the 5s/8s budget (ADR-176) |
| PRD drift | `pnpm run prd:drift` | Game→PRD punch-list after built-system changes (then: `prd-ripple` skill) |
| Fixture drift | `pnpm run fixtures:check` / `fixtures:regen` | Byte-compare of generated scenario saves; regen lands WITH the causing change |

### 3.3 Human-side sensors (read, never gate)

- **Telemetry** — git-ignored `project/telemetry/*.md`: the human's
  attended-play pacing reports (FB-8). Read before balance work;
  quote attended-vs-sim in the commit body when untainted reports
  exist. Contract: `project/telemetry/README.md`.
- **DEV Save-health panel** — DEV panel → Settings → "Save health"
  (`src/ui/dev/settings-pane.ts:77-84`): the orphan-id sensor on
  demand; the same sensor also prints at DEV boot
  (`src/app/main.ts:162-179`). Interpret with law 2 in mind, then
  route real orphans to **kami-save-and-schema**.

## 4. When NOT to use this skill

- **A specific gate's RED-fix recipe** → `kami-verify-gates`.
- **Save/migration/orphan mechanics** → `kami-save-and-schema`.
- **Sim methodology, band law, derivations** →
  `kami-balance-analysis-toolkit`.
- **Build/CI anatomy, fresh clone, dev-server law in full** →
  `kami-build-and-env`.
- **Every SKIP_*/env flag and URL param** → `kami-config-and-flags`.
- **The full incident chronicle** → `kami-failure-archaeology`.
- **Adding features (not debugging)** → `kami-extension-recipes`.
- **What's human-gated vs agent-safe** → `kami-change-control`.
- **Driving + screenshotting the game** → the existing
  `capture-game-states` skill; **fixing a reproduced bug** → `tdd`
  (failing test FIRST); **draining playtest captures** →
  `drain-inbox`; **auditing a big change** → `battery`.

## Provenance and maintenance

Authored 2026-07-18 from repo state at HEAD `4bfb3ba3`. All
file:line cites verified against that tree. Volatile facts +
re-verification one-liners:

- Gate count (21 @ 2026-07-18):
  `grep -c "name: '" src/scripts/gates.ts`
- `__qa` surface: `grep -n "qaTaint\|^      [a-zA-Z]*:" src/app/main.ts`
  (region main.ts:574-801 may shift — search `__qa = qa`)
- Ports: `grep -n "DEV_PORT" vite.config.ts` (5264) ·
  `grep -n "const PORT" playwright.config.ts` (5265)
- playtest.mjs stays deleted?
  `ls src/scripts/playtest.mjs` (exists again ⇒ re-verify §3.1)
- e2e wall time: qa-playtesting.md ("~50s local")
- `isolate: false` still on? `grep -n isolate vite.config.ts`
- Lever reset:
  `grep -n __resetBalanceLevers src/core/content/balance.ts`
- balance-sim flags: `sed -n '500,540p' src/scripts/balance-sim.ts`
- Incident SHAs cited: `6607bdee` (harness was the bug), `aa474c0d`
  (orphan sensor cried wolf), `aa6a86ad` (shared-index
  resurrection), `60101d92` (e2e → :5265)
