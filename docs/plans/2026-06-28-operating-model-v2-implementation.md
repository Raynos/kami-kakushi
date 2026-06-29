# Operating Model v2 — Implementation Plan (for review, nothing applied)

> **What this is:** the *exactly-how* for the Operating Model v2 proposal
> ([`project/brainstorms/2026-06-28-operating-model-v2.md`](../../project/brainstorms/2026-06-28-operating-model-v2.md)
> = the *why*). **Nothing in here is applied.** Every embedded code/text block is a **PROPOSAL** you
> review and steer. No ADR, no CLAUDE.md edit, no new skill file has been created. When you sign off on a
> section, I build *that section* and nothing else.
>
> **How to steer:** read the **§0 decisions** first (the forks that are genuinely yours), then each system.
> Mark up the **§8 review checklist** — ✅ build it / ✂️ change it / ❌ drop it, per line. I execute only the ✅s.

---

## 0 · Decisions only you can make (steer these first)

These change what the project *is* or how it *feels to work*; the rest is mechanical execution.

| # | Fork | Options | My recommendation |
|---|---|---|---|
| **D-a** | **Pre-commit cost.** Should every commit run the full `verify` (~15–30s)? | A: full `verify` + `SKIP_VERIFY=1` escape · B: fast subset (tsc+tests) per-commit, full gate at slice-ship | **A** — the agent isn't latency-sensitive; "can't commit red" is worth 15s. |
| **D-b** | **Roadmap re-axe.** Replace mechanism-milestones (M3–M7) with fun-slices (S0–S4)? | A: re-axe to S0–S4 · B: keep M-numbers, just add fun-gates | **A** — the milestone *axis* is the root cause of "3 done milestones, 0 fun". |
| **D-c** | **Ban "SHIPPED (slice)".** DoD = playcheck-green + manifest, no partial-ship? (answers **H4**) | A: ban it, gate it · B: keep partial-ship with footnotes | **A** — extends the strict engineering gates to feature-completeness. |
| **D-d** | **Playcheck in `verify`?** Run the fun-gate (ratchet mode) on every commit, or only at slice-ship? | A: ratchet in `verify` + thresholds at ship · B: all playcheck at ship only | **A** if it stays <~5s (measure first), else **B**. |
| **D-e** | **Divergence scope.** Is 3-variant exploration *mandatory* for UI surfaces, or opt-in? | A: mandatory for *new/major* surfaces, opt-in for tweaks · B: always opt-in | **A** — you said you want to see 3 of everything; make it the default path. |
| **D-f** | **Slice boundaries.** Are S0–S4 (below) the right cut-points? | review the table in §2 | mine is a proposal; this is your design call. |

---

## 1 · System #1 — The Experience Gate (`playcheck`) — THE KEYSTONE

**Goal:** a headless bot plays each slice and asserts the fun-factor §3 vector; hollowness fails the build.

**It is mostly assembly, not new infra.** `src/scripts/pacing-report.ts` *already* drives the pure core in
Node (`createInitialState` → `reduce` → telemetry) with a working `--check` gate. `playcheck` =
pacing-report **generalized** to the full §3 vector + two bot policies + per-slice baselines.

### Files

```
src/playcheck/
  policies.ts     # optimalPolicy / casualPolicy : (s: GameState) => Intent | null
  trace.ts        # runPolicy(start, policy, stopWhen) => Trace (per-intent record)
  proxies.ts      # computeProxies(trace) => ProxyVector  (the §3 metrics)
  slices.ts       # SLICES: start-state (via toRung/toTier compression) + thresholds per slice
src/scripts/playcheck.ts   # CLI: --check  --ratchet  --slice=S2 ; baseline compare
playcheck.baseline.json    # the committed ratchet (regression = red)
```

### The bot (reuses pacing-report's real symbols)

`policies.ts` lifts the focused-optimal logic that already works in `pacing-report.ts`:

```ts
// optimal = pacing-report's existing greedy: open_eyes > rest-if-starving > cheapest eligible labour
//           + per-rung meta verbs (face_wolf, advance_rung) + best-EV combat/stance.
// casual  = satisfices (picks *a* legal productive intent, not the optimal) — used ONLY for the
//           "never stuck" wall-check (fun-factor §3 "casual bot never stuck").
export function optimalPolicy(s: GameState): Intent | null { /* cheapestEligible(s) + meta verbs */ }
export function casualPolicy(s: GameState): Intent | null  { /* first legal do_activity */ }
```

### The proxy vector (each maps 1:1 to a fun-factor §3 row)

```ts
export interface ProxyVector {
  firstActionMs:      number;  // §3 first-5-min hook   — ticks-to-first-reward × AUTO_REPEAT_MS
  maxDeadTimeMs:      number;  // §3 no-dead-time        — longest gap with no reward & none incoming
  rewardCadenceMs:    number;  // §3 reward cadence      — mean ms between recognised deed-jumps
  minVisibleGoals:    number;  // §3 always-a-goal       — min(affordable goals) across all states
  noveltyMaxGapMin:   number;  // §3 novelty drip        — longest minutes between reveals (from reveals())
  minutesPerRung:     Record<string, number>; // §3 ≥30-min floor — REUSE pacing-report.walkPacing()
  deedSeasonalSplit:  number;  // §3 70/30               — deed-share of pillar growth
  combatWinCurve:     number[];// §3 combat band         — sampled win-rate at L1..Ln (20–35% → ~85%)
}
```

`minutesPerRung` literally calls the existing `walkPacing()`. `firstActionMs`/`cadence` use the same
model pacing-report uses: **modeled wall-ms = intents × `AUTO_REPEAT_MS`** (480ms active loop). `combatWinCurve`
reuses the existing sampled-forecast path. So ~4 of 8 proxies are wiring, not invention.

### Ratchet vs threshold (the key design point — re: decision D-d)

- **Ratchet mode (`--ratchet`, runs in `verify` every commit):** fail only if a proxy **regresses below
  `playcheck.baseline.json`**. *Work-in-progress that doesn't make existing fun worse commits freely* — so
  mid-slice building isn't blocked. The baseline rises when a slice ships.
- **Threshold mode (`--slice=SN`, runs at slice-ship):** the slice's **absolute** §3 targets must be met.
  This is the DoD gate (System #2). A slice you *claim is done* must actually be fun.

```jsonc
// playcheck.baseline.json — the ratchet. Updated (raised) only at a green slice-ship.
{ "slice": "S1", "firstActionMs": 2400, "maxDeadTimeMs": 9600, "rewardCadenceMs": 270000,
  "minVisibleGoals": 2, "noveltyMaxGapMin": 12, "deedSeasonalSplit": 0.71,
  "minutesPerRung": { "R1": 31, "R2": 35 }, "combatWinCurve": [0.32, 0.67, 0.88] }
```

### Wiring

```jsonc
// package.json scripts (proposed additions)
"playcheck":        "tsx src/scripts/playcheck.ts",
"playcheck:check":  "tsx src/scripts/playcheck.ts --check --ratchet",
// verify gains (D-d=A):  ... && npm run pacing:check && npm run playcheck:check
```

### Verify it works
Make combat binary again (revert the v0.2 curve) on a branch → `playcheck:check` must go **red** on
`combatWinCurve`. Flatten a reward → `maxDeadTimeMs` goes red. That red *is* the proof the gate has teeth.

### Risk / de-risk
- *Bot ≠ human play.* True — proxies prove **absence of boredom/walls**, not presence of fun (fun-factor §3
  says exactly this). The human taste call (System #4 + R-items) stays. The gate catches *hollow*, not *great*.
- *Flaky/seed-sensitive.* Pin the seed (pacing-report uses `SEED = 20260626`); single uninterrupted
  `newGame→play` run, no fabricated state (qa-playtesting §3 invariant).
- *Slow.* If ratchet-in-verify >~5s, demote to ship-only (D-d→B). Measure before wiring.

### Rollback
Remove the two `verify` clauses; delete `src/playcheck/`. Zero game-code touched.

---

## 2 · System #2 — Fun-slice roadmap + Slice-DoD manifest

**Goal:** milestones become fun-complete slices; "SHIPPED" requires proof (answers **H4**, folds **H7**).

### 2a · The roadmap rewrite (PROPOSED — replaces the M3–M7 table in `docs/living/roadmap.md`)

> Preserves the locked T0–T2 v1 scope + PRD intent (D-021 freeze=locked-intent). Changes the **unit** and
> the **gate**, not the vision.

| Slice | The fun loop it closes | DoD (playcheck threshold mode proves…) | Was |
|---|---|---|---|
| **S0 · The Hook** ✅ | cold-open → labour → humbling first fight | first-action <5s; T0 reveal cadence | M0–M2a |
| **S1 · Inner Loop closes** | activity → reinvest → rung → **one real decision** → sink | no-dead-time; reward cadence; combat band 20–35%→85%; decision-density>0 | M2b+v0.2 |
| **S2 · Macro Horizon** ⏭ | four-pillar House Influence + first **T0→T1** ascent | pillar loop live + interconnected; always-a-goal includes a pillar goal | M3b |
| **S3 · Valley breadth** | new domain + verbs (trade/silk/roads) | novelty-drip holds; 70/30 across wider content | M4 (T1) |
| **S4 · Region + payoff** | rival contest + Origin/Tama warmth | mid-game-slump proxies stay green over the longest tier | M5 (T2) |

> **S1's first job is to run playcheck against v0.2 and *ratify it green or expose it isn't*** — firsthand
> the stance "largely collapses" (Aggressive dominates), so S1 likely surfaces real tuning, which is the point.

### 2b · `slice-manifest.json` (new, repo root or `docs/content/`)

```jsonc
{
  "S2": {
    "status": "building",                         // building | shippable | SHIPPED
    "funLoop": "pillar loop (fun-factor §2.3)",
    "requires": {
      "tests":      ["pillar.test.ts::interconnection drifts Arms→Office",
                     "tier.test.ts::T0→T1 ascent gate"],
      "playcheck":  ["S2.pillarPullVisible", "S2.minVisibleGoals>=3"],
      "instruments":["src/core/pillars.ts", "rewards.ts::pillarDeltas"]
    }
  }
}
```

### 2c · `src/scripts/check-slice-manifest.ts` (new gate, added to `verify`)

For every slice with `status: "SHIPPED"`, assert each `requires.*` exists — test names grep-found in the
suite, playcheck thresholds present in `slices.ts`, instrument files/exports present. **Any missing → red.**
This makes "SHIPPED" un-fakeable: you cannot mark S2 done while `onSeasonBoundary` is still a no-op, because
the named pillar test won't exist to grep.

### Risk / rollback
Manifest dr/over-fits → keep `requires` to the 2–4 load-bearing instruments per slice, not everything.
Rollback: drop the `verify` clause + the manifest file; roadmap is a doc revert.

---

## 3 · System #3 — Honest-by-default (adversarial self-audit)

**Goal:** no "done" claim without an attached self-audit + green gates; pessimistic reporting is the default.

### 3a · `src/scripts/ship-slice.ts` (new — the slice-ship ceremony)
Run when claiming a slice done. Sequence, halt-on-fail:
1. `npm run verify` (incl. playcheck ratchet + manifest check).
2. `npm run playcheck -- --check --slice=SN` (**threshold mode** — absolute fun targets).
3. assert `project/audit/reports/SN-ship-audit.md` **exists** and has a `## Scorecard` + `## Hollowness`
   section (the agent fills it by running the `battery` skill's mini mode first).
4. only then flip `slice-manifest.json` → `SHIPPED` and raise `playcheck.baseline.json`.

The gate can enforce the audit's **presence + shape**, not its honesty — honesty is the rule below + the
fact that the audit's claims are themselves playcheck-checkable.

### 3b · CLAUDE.md rule (PROPOSED text — added under "How to work here", NOT applied)

```md
- **Report pessimistically, prove optimistically.** Lead every "done" with what's *missing/hollow/weak*,
  evidence-first (numbers, a screenshot, a failing-then-passing test). Never claim SHIPPED without an
  attached self-audit (`battery` mini) + green `playcheck --slice`. "It works" is a measurement, not a hope.
```

### Rollback
Delete the script + the one rule line. (No code depends on it.)

---

## 4 · System #4 — Design-by-Divergence (`diverge` skill)

**Goal:** 2–3 variants of any meaningful surface → a contact sheet you glance at and steer from.

### 4a · The skill (PROPOSED `.claude/skills/diverge/SKILL.md` — full text, NOT created)

```md
---
name: diverge
description: Generate 2–3 distinct visual/design variants of a UI surface, screenshot each headlessly,
  self-review each against ui-design.md, and present a side-by-side contact sheet with a recommended pick.
  Use when building or restyling any meaningful UI surface, or when the human says "show me variants / options".
---

# Diverge

For any meaningful surface (a new screen/panel, or a major restyle — NOT a one-line tweak):

1. **Frame the surface + constraints** — the woodblock/ink bible (ui-design.md) is the fixed frame; vary
   *within* it (layout, hierarchy, density, motion), never the art language.
2. **Generate 2–3 genuinely distinct variants** — different *approaches*, not palette-swaps. Implement each
   behind a `?variant=A|B|C` DEV flag (or a temporary branch per variant).
3. **Screenshot each headlessly** via the `capture-game-states` skill (desktop + mobile).
4. **Self-review each with your own vision against the bible** — score intentionality, hierarchy, slop-risk;
   write a one-line verdict per variant.
5. **Present ONE contact sheet** → `tmp/variants/<surface>/contact.md`: the variants side-by-side, each
   screenshot, each verdict, and a **recommended pick + why**. Surface it to the human to choose/blend.
6. On the human's call ("B, but A's type") → synthesize the winner, drop the DEV flags, log the choice.
```

### 4b · The contact-sheet shape (what you actually see)

```
tmp/variants/combat-panel/contact.md
  ┌ Variant A — "stat-forward"   [screenshot]  verdict: clearest, but busy on mobile
  ├ Variant B — "ink-minimal"    [screenshot]  verdict: most on-bible; hides the forecast (risk)
  └ Variant C — "scroll-card"    [screenshot]  verdict: best hierarchy ★ recommended
```

### 4c · CLAUDE.md rule (PROPOSED, re: decision D-e)
```md
- **Design by divergence.** No *new or majorly-restyled* UI surface ships from a single idea — run the
  `diverge` skill (2–3 variants → contact sheet → human picks). Tweaks are exempt.
```

### Rollback
Delete the skill + rule. Pure additive.

---

## 5 · System #5 — Corrections compound into Checks (the meta-lever)

**Goal:** every piece of your feedback terminates in a self-enforced check, so the same class never recurs.

### 5a · Feedback-log template change (PROPOSED — add a column to `project/human-feedback/*.md`)

```md
| # | Feedback | Type | Status | Resolution | Enforced-as |
|---|---|---|---|---|---|
| F2 | X red-on-hover is wrong | visual | ✅ | indigo hover · 67fc002 | ui-design.md§checklist "vermilion=seal/CTA only" |
```

`Enforced-as` points at a **durable check**: a test name, a `playcheck` proxy, a lint rule, or a line in a
UI checklist. The home for UI-taste rules = a new **`## Self-checklist`** section appended to
`docs/living/ui-design.md` (no new doc).

### 5b · `src/scripts/check-feedback-closed.ts` (new gate, added to `verify`)
A row marked `✅` whose `Enforced-as` cell is empty/`—` → **red**. You cannot close feedback without
converting it into a rule. (Escape: `Type: taste` rows that are genuinely one-offs may close with
`Enforced-as: n/a (one-off)` — explicit, not silent.)

### 5c · CLAUDE.md rule (PROPOSED)
```md
- **Every correction becomes a check.** When the human flags something, the fix isn't done until it's
  *also* a durable check (test / playcheck proxy / lint / ui-checklist line) so it can never regress or
  recur. Closing feedback without one is blocked by `check-feedback-closed`.
```

### Rollback
Drop the `verify` clause + revert the template; existing logs still parse (column optional).

---

## 6 · System #0 — Make the gate un-skippable (do this first)

**Goal:** the pre-commit hook runs the gate, not just the journal check.

### Exact change to `.githooks/pre-commit` (PROPOSED — appended after the existing journal block)

```bash
# --- v2: correctness gate (bypass a docs-only/trivial commit with SKIP_VERIFY=1) ---
if [ "${SKIP_VERIFY:-0}" != "1" ]; then
  echo "  . running verify (SKIP_VERIFY=1 to bypass a docs-only commit)…" >&2
  if ! npm run --silent verify; then
    echo "  X commit blocked - verify failed. Fix, or SKIP_VERIFY=1 for a docs-only commit." >&2
    exit 1
  fi
fi
```

### Two cadences (the enforcement model)
- **per-commit** (this hook): `verify` — tsc + eslint + prettier + tests + content + gen:docs + (D-d) playcheck-ratchet + manifest + feedback-check. ~15–30s. Can't commit red.
- **per-slice-ship** (`npm run ship`, System #3): `verify` + playcheck **threshold** + audit-present. Can't claim SHIPPED dishonestly.

### Risk / rollback
Slow commits → `SKIP_VERIFY=1` for docs; if chronic, split fast (tsc+test) into pre-commit and the rest into
`ship` (D-a→B). Rollback: delete the appended block.

---

## 7 · Proposed ADRs + CLAUDE.md edits (full text, for your review — NOT applied)

> I'd add these to `docs/living/decisions.md` (next free IDs; D-047 is the latest I've seen — confirm at apply).

**D-048 — Experience is an executable gate (playcheck), not an M6 audit.** The fun-factor §3 vector is
asserted headlessly every commit (ratchet) and at slice-ship (threshold). Hollowness fails the build.
*Supersedes the roadmap's "promote fun-proxies to a gate at M6" → it's now continuous.*

**D-049 — Milestones are fun-complete slices; DoD = playcheck-green + manifest; "SHIPPED (slice)" is
banned.** (Answers H4, folds H7.) Re-axes M3–M7 → S0–S4. Locked T0–T2 scope + §1 intent unchanged (D-021).

**D-050 — Design by divergence.** Meaningful UI surfaces ship from a 2–3-variant contact sheet, not one idea.

**D-051 — Corrections compound into checks.** Feedback closes only when converted to a durable check.

**CLAUDE.md** gains: the 4 rule-lines quoted in §3b/§4c/§5c, plus a new **"The Enforcement Ladder
(Gate > Hook > Skill > Rule)"** note under *Conventions* stating that quality rules are pushed to the
highest rung that can hold them.

---

## 8 · Review checklist (mark me up — ✅ build / ✂️ change / ❌ drop)

```
[ ] §0 D-a  pre-commit runs full verify (+SKIP_VERIFY escape)
[ ] §0 D-b  re-axe roadmap M3–M7 → S0–S4
[ ] §0 D-c  ban "SHIPPED (slice)"; DoD = playcheck-green (H4)
[ ] §0 D-d  playcheck ratchet in verify (vs ship-only)
[ ] §0 D-e  divergence mandatory for new/major UI surfaces
[ ] §0 D-f  the S0–S4 slice boundaries are right
[ ] #1  build the playcheck keystone (src/playcheck/* + baseline + verify wiring)
[ ] #2  roadmap rewrite + slice-manifest + check-slice-manifest gate
[ ] #3  ship-slice ceremony + the "report pessimistically" rule
[ ] #4  the diverge skill + the divergence rule
[ ] #5  feedback-log Enforced-as column + check-feedback-closed gate + the rule
[ ] #0  pre-commit gate (do first)
[ ] §7  the four ADRs (D-048…D-051) + CLAUDE.md edits
```

## 9 · Build sequence (once you've ticked the boxes)
`#0 hook` → `#1 playcheck` (keystone) → `#2 roadmap+manifest` → `#3 ship+rule` → `#5 feedback-check` →
`#4 diverge` (independent; pull earlier if you want variants sooner). Then **S2 (the macro engine) is the
first slice built under v2** — and it ships only if playcheck says the macro pull is real.

**Honest cost:** ~1 week front-loads this harness over visible features. It's what you've been paying in
babysitting since; it buys the autonomy back.
