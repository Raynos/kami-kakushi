# Balance-tuning cockpit — live DEV sliders + export-diff (T0)

**Status:** ✅ COMPLETE — built + shipped in session 76 (2026-07-05), all four
phases DoD-met (see `project/journal/2026-07-05-session-76-f7-balance-cockpit.md`).
Mechanism + human/agent division recorded as **D-134**. Archived.

## Who builds this — Fable or Opus?

**Confidence: ( 90% Opus, 10% Fable )** — the mechanism is pinned to
verified access patterns; the 10% is the risk-1 tree-shake escalation call.

**Opus 4.8 builds all four phases.** This is a DEV-only tool: the taste
bar that gates player-facing UI (D-075 diverge, ui-design.md) does not
apply — the cockpit is an instrument panel in the existing monospace DEV
idiom, and its value is correctness, not beauty. Every phase has a
mechanical, self-verifying DoD (headlessly observed yield change, exact
diff bytes, prod-bundle grep). The one subtle step is Ph1's override
layer, and this plan pins the mechanism to verified access patterns
(§1) so Ph1 is execution + R2 evidence, not judgment. The judgment this
tool exists to serve — which numbers feel right — is the HUMAN's and
stays the human's (D-059/R4): agents build the cockpit and transcribe
its exports; they never move a slider on the human's behalf into canon.

**Why now.** The economy balance-watch
(`project/audit/reports/2026-07-02-economy-balance-watch.md`) has four
open feel items — rice out-produces its sinks, store-vs-sell is
dominated, `eat_rice` loses to free `rest`, the koku capstone lands in
~30 s against an intended ~85-min climb — and every one is a D-059
liquid magnitude only the human may tune. Today the tuning loop is:
edit `balance.ts`, rebuild mentally, reload, replay to the moment,
repeat. The cockpit collapses that to: drag a slider mid-run, feel it
immediately, export the touched keys as a committable artifact. A
~10-minute session replaces an afternoon, and the output composes
directly with the sim-gates plan's re-verify flow
(`docs/plans/fable-process-F4-balance-sim-gates.md` §5b: a balance
VALUE change stales the report fingerprint — the exported diff is
exactly the event that flow is built to catch).

**What already exists (reuse, don't rebuild):**

- `src/core/content/balance.ts` — every tunable, documented and
  D-059-tagged; scalars + a few structured maps.
- `src/ui/dev.ts` — the DEV panel: Settings/Variants sub-tabs, the
  `mono`/`section` widget helpers, `DEV_SENTINEL = '__KAMI_DEV_PANEL__'`,
  and the F18 URL-param persistence pattern (`setVariant` mirrors picks
  into `location.search` via `history.replaceState`).
- `src/app/main.ts` — `window.__qa` (DEV-only), `createDevApi()`
  threading, the `import.meta.env.DEV` fold that makes stripping work.
- `src/scripts/gh-pages.sh` step 1b — the marker-grep deploy gate
  (`__qa`, `__KAMI_DEV_PANEL__`) to extend.
- `docs/plans/fable-process-F3-playtest-capture-inbox.md` §2.4 — the
  Vite dev-middleware POST transport + `project/playtest-inbox/`
  lifecycle the export rides.
- `src/core/selectors.ts` + `src/core/pillars.ts` + `npm run pacing` —
  the cheap arithmetic the live-feedback readouts derive from.
- Build stamp defines (`__VERSION__`, `__BUILD_SHA__`, `__BUILD_DATE__`
  in `vite.config.ts`) for the artifact header.

---

## 1 · The override layer (the crux)

### 1a · Verified access patterns

Three consumption styles exist, checked against the real code:

1. **Named imports, read inside function bodies** — the core norm.
   `intents.ts` imports `RICE_PER_RAKE`, `EAT_RICE_COST`,
   `EAT_RICE_SATIETY`, `SATIETY_PER_REST`, `riceSellPrice` … and reads
   them at dispatch time (lines 482, 509, 704–706, 729); same for
   `selectors.ts` (`STAMINA_*` in `staminaRate`, `SATIETY_BASE` in
   `satietyMax`), `skills.ts` (`SKILL_YIELD_*` in `skillYieldNum`),
   `fight.ts` (`LOSS_COIN_FRAC`), `pillars.ts`, `ranks.ts`
   (`rungThreshold(rank.id)` at promotion-check time). ES named imports
   are **live bindings**: if the exporting module reassigns its own
   binding, every importer's next read sees the new value.
2. **Namespace property reads at call time** — the UI norm.
   `render.ts`/`dev.ts`/`main.ts` read `balance.X` inside render/tick
   functions. A module-namespace property reflects the current live
   binding, so these propagate too (tooltips like the eat-rice copy,
   which interpolates `balance.EAT_RICE_SATIETY`, update live — a free
   proof surface).
3. **Load-time destructuring — the one real freeze.** `main.ts:37`
   `const { AUTO_REPEAT_MS } = balance` copies the value at module load
   AND bakes it into `setInterval(...)` at boot. `playcheck.ts` and
   `pacing-report.ts` destructure too, but those are separate node
   processes that always run canon — irrelevant to live tuning.

### 1b · Mechanism — `const` → `let` for curated levers + an in-module setter

Only the declaring module can reassign its own exported bindings, so
the hook lives at the bottom of `balance.ts` itself:

```ts
// ── DEV-only live-tuning hook (balance cockpit, D-059). Inert unless
// called; only src/ui/dev-cockpit.ts (DEV-folded) may import it. ──
export function __setBalanceLever(path: string, value: number): void {
  switch (path) {
    case 'RICE_PER_RAKE':        RICE_PER_RAKE = value; return;
    case 'EAT_RICE_SATIETY':     EAT_RICE_SATIETY = value; return;
    // …structured paths mutate the map in place (runtime objects are
    // plain; readonly/as-const is compile-time only — cast locally):
    case 'ESTATE_BANDS.excellent':
      (ESTATE_BANDS as { excellent: number }).excellent = value; return;
    case 'RUNG_METER_THRESHOLDS.R7':
      RUNG_METER_THRESHOLDS.R7 = value; return;
    default: throw new Error(`balance-override: unknown lever ${path}`);
  }
}
export function __resetBalanceLevers(): void { /* reassign from CANON */ }
```

- The curated scalar levers (§2) flip `export const` → `export let`.
  `prefer-const` stays green because the setter reassigns them
  in-module. Zero call sites change — that is the whole point.
- A module-init `CANON` snapshot (spread-copied before anything can
  call the setter) backs `__resetBalanceLevers()` and per-lever reset.
- The explicit `switch` (not a dynamic table) keeps `tsc` owning the
  path list and keeps `balance.ts` free of clever indirection.
- **Purity/determinism:** core stays DOM-free and env-free (no
  `import.meta` in core — `tsx` scripts like `pacing-report.ts` must
  keep importing it cleanly). The setter is inert dead code unless
  called; tests, sims, scripts, and prod never call it, so canon
  semantics are untouched. The string literal `balance-override:`
  survives minification and becomes the strip-gate marker (§6).

### 1c · Lever classes (state explicitly)

- **Runtime-overridable (live, mid-run):** every scalar read inside a
  function body (all of §2's scalars) and every structured map read by
  property/helper at call time (`RUNG_METER_THRESHOLDS` via
  `rungThreshold`, `STANCE_MODS[s]`, `ESTATE_BANDS`,
  `RICE_SELL_PRICE_BY_SEASON` via `riceSellPrice`).
- **Applies-at-New-game:** constants read only by
  `createInitialState`/level-up math (`COLD_OPEN_SATIETY`, `HP_BASE`,
  `ATTR_BASE`, XP curve bases). The binding updates live but existing
  state was already derived. The registry tags these
  `appliesAt: 'new-game'` and the row says so. None are in the v1
  curated set.
- **Load-time-frozen:** `AUTO_REPEAT_MS` only (destructured into a
  boot-time `setInterval`). EXCLUDED from the cockpit — the DEV
  2×/4×/8× speed toggle already owns cadence feel. If it is ever
  wanted, the treatment is reload-with-URL-param, not a live slider.

## 2 · The curated lever set

Curated, not exhaustive — the four balance-watch targets first, then
the obvious feel levers. Each row in the cockpit shows
`canon → current (Δ%)`, gold-highlighted when touched, with the
balance-watch tag and any signed-invariant guard note inline.

| Group (watch item) | Levers (canon) |
|---|---|
| **W1 · rice faucet / coin** | `RICE_PER_RAKE` (3) · `SKILL_YIELD_PER_LEVEL_NUM` (4) · `SKILL_YIELD_CAP_NUM` (200) |
| **W2 · store-vs-sell** | `RICE_SELL_PRICE_BY_SEASON.spring/summer/autumn/winter` (6/5/3/5) — guard: spring-dearest/autumn-cheapest monotonic direction is test-asserted canon |
| **W3 · eat-rice vs rest** | `EAT_RICE_SATIETY` (30) · `EAT_RICE_COST` (3) · `SATIETY_PER_REST` (18) — guard: `EAT_RICE_SATIETY > SATIETY_PER_REST` is the documented design lever |
| **W4 · capstone pacing** | `ESTATE_BANDS.good/great/excellent` (240/360/480) · `ESTATE_DEED_PER_ACT` (8) · `PER_DEED_CAP_NUM` (4) |
| Stamina / meals | `SATIETY_PER_ACT` (2) · `STAMINA_RATE_FLOOR` (0.5) · `STAMINA_FLAT_ABOVE` (0.7) · `COOK_SANSAI_COST` (2) · `COOK_HP_RESTORE` (14) |
| Rung pacing | `RUNG_POINTS_PER_ACT` (2) · `RUNG_METER_THRESHOLDS.R0…R7` (1100…3400) — export must carry the `content/ranks.ts` `meterThreshold` mirror edit (verify-content enforces 1:1) |
| Sinks / upkeep | `REPAIR_COIN_COST` (6) · `REPAIR_WOOD_COST` (5) |
| Combat feel | `STANCE_MODS.jodan.atkMult/takenMult` (1.35/1.15) · `STANCE_MODS.gedan.atkMult/takenMult` (0.8/0.85) · `LOSS_COIN_FRAC` (0.2) · `LOSS_MATERIAL_FRAC` (0.34) · `AUTO_RETREAT_FRAC` (0.2) |

Explicitly excluded from v1: `AUTO_REPEAT_MS` (frozen, §1c); the
combat-curve coefficients and `CURVE_*` bands (signed test canon — a
feel session must not casually move what `m2` gates assert); XP curve
growth ratios (shape, not session-feel); content-side magnitudes
(`ACTIVITIES` yields, `MOBS` stats, market prices, `ESTATE_STAGES` —
different files; open question 5). Slider `min/max/step` are cockpit
metadata (default canon ×[¼, 4], integer step where canon is integer),
never canon.

## 3 · Persistence + reset — URL params (chosen), never saves

**URL params, following the F18 variant pattern:** each touched lever
mirrors to `?bal.<path>=<value>` via `history.replaceState`; params are
dropped when a lever returns to canon. Justification over localStorage:

- **Visible and explicit.** A sticky invisible localStorage override is
  exactly the silent-retune failure D-059 forbids — a later session
  would play non-canon numbers without anyone deciding that. The URL
  is legible, shareable, and dies with the tab unless deliberately kept.
- **Composes with the capture inbox.** The playtest-capture plan
  records the page URL verbatim (§2.2) — captures made mid-tune
  automatically carry the override set.
- **F5-survival for free**, same as variants: `createDevApi()` hydrates
  `bal.*` params through `__setBalanceLever` at panel init. (Nuance:
  boot creates/loads state before hydration, so `new-game`-class levers
  apply from the next New game — irrelevant to the v1 set, documented
  in the registry.)

**Reset-to-canon:** per-lever ↺ on each row, plus one panel-wide
"Reset all to canon" that calls `__resetBalanceLevers()`, clears every
`bal.*` param, and repaints. Overrides live only in module bindings +
the URL — `GameState` and the save envelope are structurally untouched
(§7 proves it with a test).

## 4 · Cockpit UI + headless handle

- **New module `src/ui/dev-cockpit.ts`**, imported only by `ui/dev.ts`
  — so it rides the existing DEV fold and the existing sentinel graph.
  `mountDevPanel` grows a third sub-tab, **Balance**, beside
  Settings/Variants (same `tabBtn`/pane-scroll idiom, F37 layout).
- Each lever row: label + `<input type=range>` + numeric input, the
  `canon → current (Δ%)` readout, watch-item tag, guard note, ↺.
  Groups render in §2 order (watch items first). A touched-count badge
  sits on the tab label (`Balance (3)`) so a dirty session is obvious.
- **`__qa.balance`** (DEV block of `main.ts`):
  `{ set(path, v), read(path), touched(), reset(), exportMarkdown() }`
  — created by the cockpit controller, exposed on `DevApi`, attached to
  `__qa`. This is what makes every DoD headlessly drivable (playwright
  `page.evaluate` against the real dev server, no mocks) and gives
  scripted tuning sessions a hook.

## 5 · Live feedback — cheap, selector-derived, no new sim

Recomputed on every slider change and every rerender; pure arithmetic
over existing selectors — explicitly NOT a simulation:

- **Next-rung ETA:** `(rungThreshold(rung) − rungMeter) /
  RUNG_POINTS_PER_ACT` acts × `AUTO_REPEAT_MS` → minutes (the exact
  `walkPacing` wall-time model).
- **Capstone ETA (W4 live):** `(ESTATE_BANDS.excellent −
  influence.estate.value) / min(ESTATE_DEED_PER_ACT, perDeedCap())`
  acts → minutes — the "~85-min intended vs ~30-s actual" number,
  visible while the human drags the bands.
- **Eat-vs-rest verdict (W3):** `+EAT_RICE_SATIETY body /
  EAT_RICE_COST rice (worth N coin at <season>)` vs
  `+SATIETY_PER_REST + homeRestBonus free` — one line, updates live.
- **Rice→coin flow (W1/W2):** rake yield/act × `skillYieldNum`
  multiplier × current `riceSellPrice(season)` = coin/act, plus the
  spring:autumn spread ratio.

The authoritative after-check stays in node: the export artifact tells
the applying agent to run `pacing:check` (and `verify:balance` +
`balance:report` once the sim-gates plan lands). An in-browser R0–R3
re-run is deliberately out (open question 4) — `pacing-report.ts` is
not browser-safe (top-level `process.argv`) and the estimates above
already give direction.

## 6 · Export-diff — artifact, transport, agent apply flow

### 6a · The artifact

`exportMarkdown()` renders the touched-lever set (diff builder is a
pure, unit-tested function):

```markdown
---
kind: balance-tune
captured_at: 2026-07-03T18:42:07+0200
build: v0.3.4 (abc1234, 2026-07-03)
seed: 20260626
clock: { day: 12, tick: 7 }
session_url: /?bal.EAT_RICE_SATIETY=36&bal.ESTATE_BANDS.excellent=960
---
## Touched levers
| path | canon | tuned | Δ |
|---|---|---|---|
| EAT_RICE_SATIETY | 30 | 36 | +20% |
| ESTATE_BANDS.excellent | 480 | 960 | +100% |

## Apply — src/core/content/balance.ts (old → new, exact)
- `export let EAT_RICE_SATIETY = 30;` → `export let EAT_RICE_SATIETY = 36;`
- `ESTATE_BANDS = { good: 240, great: 360, excellent: 480 }` → `excellent: 960`

## Mirrors & re-verify
- (only when a RUNG_METER_THRESHOLDS.* lever is touched) update the
  matching `meterThreshold` in src/core/content/ranks.ts — verify-content
  enforces the 1:1 mirror.
- run: npm run gen:docs && npm run verify   (pacing:check is in verify)
- when balance-sim-gates lands: npm run verify:balance &&
  npm run balance:report — this diff is exactly what stales its
  fingerprint (§5b of that plan).

## Note
<optional free-text from the export prompt>
```

Keys, old values, new values, session timestamp, seed/clock — enough
for an agent to apply as a normal reviewed commit and for anyone to
reproduce the session.

### 6b · Transport — middleware file-drop primary, clipboard/download fallback

**Primary:** POST to the playtest-inbox dev-middleware, landing
`project/playtest-inbox/<ISO-stamp>-balance-tune.md`. Compose, don't
collide — **ordering resolved (`fable-process-master-plan.md` merge #2):
the capture-inbox plan (F3) builds BEFORE this plan and owns the
transport.** This plan reuses its endpoint + hardening verbatim (same
dir-jail, filename allowlist, size cap) and ships NO handler of its own.
One inbox dir, one drain loop, one lifecycle (intake-commit → process →
delete-with-the-commit).

**Fallback:** if the POST fails, offer the same markdown as clipboard
copy AND a Blob `<a download>`. Unlike playtest captures (embedded
saves, too big for clipboards), a tune artifact is a page of text —
clipboard is a legitimate fallback here; download covers the paranoid
path. Zero dependencies either way.

### 6c · The agent-side apply flow (the D-059 division, kept)

Documented in Ph3 (`docs/living/qa-playtesting.md`): the human tunes
and exports; the agent **transcribes**:

1. Read the artifact from the inbox; **stale-canon guard:** if any
   `canon` value in the table ≠ the value currently in `balance.ts`,
   STOP and ask — the file moved since the session; never merge by
   guess.
2. Apply the exact old→new edits (+ any listed `ranks.ts` mirrors).
   The agent picks NO numbers, widens NO bands.
3. Run the re-verify block. Expected honest REDs: `gen-docs --check`
   (regen the generated docs — they bake `EAT_RICE_*` and the price
   table), `pacing:check` / envelope gates if the tune moved the arc
   outside signed bands — those are findings to surface to the human,
   never test-side fudges.
4. Commit citing the artifact (quote the touched-levers table in the
   body), delete the inbox file in the same commit.

## 7 · Teeth & hygiene

- **DEV-strip proof:** `gh-pages.sh` step-1b marker loop grows one
  entry: `balance-override` (the string literal inside
  `__setBalanceLever`'s throw — survives minification; the cockpit UI
  itself is already covered by `__KAMI_DEV_PANEL__` via `dev.ts`).
  Ph1's DoD runs a real `npm run build` and greps `dist/assets/*.js`
  for both markers — Rollup should tree-shake the setter (balance.ts is
  side-effect-free; the prod graph's namespace accesses are all
  static), and this VERIFIES it rather than trusting it (R2). If it
  leaks: risk 1's escalation, never a silent marker removal.
- **Saves can't leak (test):** overrides live in module bindings + URL,
  never `GameState`. A vitest case proves it: snapshot
  `exportState(state)`, apply an override, assert the export is
  byte-identical, reduce an intent under the override, save+load, reset
  to canon — the loaded state carries no balance values (the envelope
  schema simply has nowhere to put them; the test pins that stays true).
- **Determinism note:** a mid-run override changes future `reduce`
  results — that is the tool's purpose (feel), and it is fine: the RNG
  stream is untouched, replays of a captured seed reproduce under the
  same override set (which the URL records). All tests/sims/scripts run
  canon in their own processes; the cockpit's own tests reset canon in
  `afterEach` (the reset function makes that cheap). A one-line contract
  comment on the setter states: nothing outside `ui/dev-cockpit.ts` and
  its tests may import it.

## 8 · Phased steps (each independently committable, verify green)

### Ph1 — override layer + 3 levers, end-to-end

`balance.ts`: `const`→`let` for `RICE_PER_RAKE`, `EAT_RICE_SATIETY`,
`SATIETY_PER_REST` + `__setBalanceLever`/`__resetBalanceLevers` + CANON
snapshot; exports via `core/index.ts`. Minimal `dev-cockpit.ts`: the
Balance sub-tab, 3 slider rows, canon/Δ% readout, reset-all;
`__qa.balance` wired. Diff builder (pure) for the 3 scalars.

**DoD (R3 — the real game, headlessly):**

- Playwright against the live dev server: `__qa.balance.set(
  'RICE_PER_RAKE', 10)` → `__qa.dispatch({type:'rake_rice'})` →
  `state().resources.rice` gained exactly 10 (and the log line says
  so); reset → next rake gains 3 again. No mocks.
- `exportMarkdown()` emits the exact `old → new` line for the touched
  lever (unit test on bytes).
- `npm run build` + grep `dist/assets/*.js` for `balance-override` and
  `__KAMI_DEV_PANEL__`: zero hits — recorded in the commit body.
- Save non-leak test green; `npm run verify` green (all canon-value
  tests untouched by the `let` conversion).

### Ph2 — full curated lever set + persistence + live feedback

All §2 levers (structured paths included), registry with groups/
guards/ranges/`appliesAt`, `bal.*` URL hydrate + mirror + clean-URL
reset, touched badge, the §5 readouts.

**DoD:** every registered path round-trips set→read→reset (one
table-driven unit test walks the registry — also the tripwire against
a future `Object.freeze`); F5 with `?bal.EAT_RICE_SATIETY=36` restores
the override and the row shows `30 → 36 (+20%)`; reset-all restores
byte-identical canon AND a clean URL; capstone-ETA readout visibly
moves when `ESTATE_BANDS.excellent` is dragged (headless assert on the
panel text); verify green; `npm run pacing` output unchanged (scripts
still canon).

### Ph3 — export transport + the agent apply flow

Middleware file-drop (reuse or seed the inbox handler per §6b),
clipboard/download fallback, full artifact format (frontmatter, mirror
+ re-verify block), the apply-flow doc section in
`docs/living/qa-playtesting.md` (stale-canon guard included).

**DoD:** end-to-end on the real dev server: tune two levers → export →
the file exists in `project/playtest-inbox/` with correct frontmatter
and exact old→new lines; kill the middleware → fallback offers the
same bytes via download; then a worked apply: follow the doc on the
exported artifact, `balance.ts` edited, `gen:docs` regenerated,
`npm run verify` green — the whole loop demonstrated in one commit
pair (tune-artifact intake + applied diff).

### Ph4 — polish + docs wiring

Rung-threshold levers' mirror emission double-checked against
`verify-content`; `docs/living/qa-playtesting.md` gains the
"~10-minute tuning session" recipe (open cockpit → drag → feel →
export → hand to the agent); one-line pointer in AGENTS.md under the
DEV-tooling/balance norms (agents never tune by slider — D-059);
decisions.md entry recording the override mechanism + the
human/agent division; CHANGELOG; plan Status → ✅ COMPLETE and `git mv`
to `project/archive/`.

**DoD:** docs merged and link-check green; a fresh agent following
only qa-playtesting.md can apply a sample artifact correctly (dry-run
demonstrated in the commit body); full verify + prod-strip grep
green; plan archived.

## 9 · Risks + open questions (defaults — never block on the human)

1. **Rollup fails to tree-shake `__setBalanceLever`** (the namespace
   re-export `export * as balance` pins more than expected) → the new
   marker gate refuses deploy. *Default:* Ph1 measures on the real
   build first; if it leaks, escalate as an H-item with options
   (accept provably-unreachable dead bytes with the human's sign-off
   and move the marker, or restructure the setter's reachability) —
   never silently delete the marker.
2. **A tune legitimately REDs signed gates** (pacing band, curve bands,
   monotonic season direction, gen-docs). *Default:* by design — the
   artifact's re-verify block names the gates likely to move; the
   applying agent surfaces a RED as a finding for a signed canon
   re-derivation (sim-gates plan §3 norm), never fudges a band.
3. **`let` exports invite non-cockpit mutation** (a future test or
   module reassigning through the setter). *Default:* the contract
   comment + review norm (same trust level as the sim plan's
   "no state surgery" norm); the registry round-trip test keeps the
   setter honest; revisit a lint only if it actually bites.
4. **In-browser pacing re-run wanted later** ("what does the sim say
   NOW?"). *Default:* out of v1 — the §5 arithmetic gives direction and
   node owns verdicts. If demanded, extract `walkPacing`'s loop into a
   browser-safe module both the script and cockpit import (it is pure
   already; only the CLI shell blocks it) — a small follow-up.
5. **Content-side magnitudes** (`ACTIVITIES` yields, mob stats, market
   prices) are real feel levers but live outside `balance.ts`.
   *Default:* v1 scopes to `balance.ts` (the deliverable diff stays
   one-file + the known `ranks.ts` mirror); a v2 "content levers"
   group is parked as an H-item once the v1 loop proves itself.
6. **Transport ordering vs the inbox plan.** *Resolved
   (`fable-process-master-plan.md` merge #2, 2026-07-03):* the inbox
   plan (F3) builds first and owns the transport; this plan reuses it
   (§6b) and ships no handler.
7. **Slider ranges as accidental canon** (a human reads ×¼–×4 as the
   sanctioned space). *Default:* ranges are cockpit metadata with a
   panel footnote ("bounds are UI, not canon"); the numeric input
   accepts any value beyond the slider.

---

## Critical files for implementation

- `src/core/content/balance.ts` — the levers; `const`→`let` +
  `__setBalanceLever`/`__resetBalanceLevers` land here (only the
  declaring module can reassign its bindings).
- `src/ui/dev.ts` — the DEV panel to grow the Balance sub-tab in (tab
  bar, widget helpers, F18 URL persistence, `DEV_SENTINEL`); imports
  the new `src/ui/dev-cockpit.ts`.
- `src/app/main.ts` — `__qa.balance` wiring, the DEV fold, and the one
  verified load-time freeze (`AUTO_REPEAT_MS`, line 37) that scopes
  the mechanism.
- `src/scripts/gh-pages.sh` — step-1b marker loop gains
  `balance-override` (the strip-proof teeth).
- `src/core/content/ranks.ts` — the `meterThreshold` mirror the
  export-diff must carry for any rung-threshold tune (verify-content
  enforces the 1:1).
