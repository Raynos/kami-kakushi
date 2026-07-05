# F7 cockpit — W1–W4 review-only tuning proposals (2026-07-05)

**UPDATE 2026-07-05 — ADOPTED (R10 closed).** The human reviewed R9→R10 and said
"apply your recommendations" — so W1 (`RICE_PER_RAKE 3→2`), W2 (`autumn 3→4`),
W3 (`EAT_RICE_COST 3→2`) are now **on canon** (W4 unchanged). Applied via the F7
apply-flow: `gen:docs` + `verify:balance` (all signed bands green, rung pacing
Δ +0.0) + `balance:report` + `fixtures:regen`. The text below is the original
proposal (kept as the reasoning record).

**Status (original):** candidates for the human to FEEL, not canon. Per D-059/D-134, an
agent never moves a lever into canon on the human's behalf; these are starting
points surfaced as shareable `?bal.*` URLs + review item **R10** (was mis-filed as
R9, which is the archived UI-remaster review — corrected). The human
accepts / adjusts / rejects each live in the cockpit; adoption then rides the
D-059 apply-flow (export → transcribe → `verify:balance`).

Derived from the F7 cockpit's live-feel readouts + the economy balance-watch
(`project/audit/reports/2026-07-02-economy-balance-watch.md`, four items W1–W4).
**Important:** the watch predates two fixes — **D-118** (rice spoilage 10%/season
+ a kura capacity cap) and **D-133** (`ESTATE_DEED_PER_ACT` → 0.04, the fractional
Phase-2 stopgap) — so W1/W2 are partly addressed and **W4 is already resolved**.
Each candidate is a single-lever nudge (the cockpit's scope), not a re-solve.

## W4 · capstone pacing — **no tune proposed (already fixed)**

The watch's "~25–30 s capstone" was written before D-133. The cockpit readout
now shows **Capstone (Excellent 480) = 12 000 acts ≈ 96 min** — inside the
intended ~85-min band (the D-133 `PHASE2_PHASE1_RATIO` law). **Recommendation:
confirm by feel, change nothing.** If it still feels off, the lever is
`ESTATE_DEED_PER_ACT` (lower = longer) or `ESTATE_BANDS.excellent` (higher =
longer), but the ratio gate already governs this.

- URL: _(none — leave canon)_

## W1 · rice faucet out-produces its sinks — candidate: `RICE_PER_RAKE 3 → 2`

D-118's spoilage + kura cap already bleed a hoard, but the faucet itself is still
generous (rake 3 + paddy, × the skill-yield accelerator up to ×3, × sell price).
Trimming the rake yield 33% slows raw coin accumulation without touching the
sinks. **Alternative lever:** halve the accelerator ceiling
(`SKILL_YIELD_CAP_NUM 200 → 100`) so late-game yield tops at ×2 not ×3.

- URL: `/?bal.RICE_PER_RAKE=2`
- readout to watch: "Rice→coin: N/rake × price = coin/act".

## W2 · store-vs-sell dominated by always-hold — candidate: `autumn 3 → 4`

D-118 spoilage already makes holding cost ~10%/season, so "hold-until-spring" is
no longer free. Narrowing the price swing finishes the job: raising the autumn
glut price 3→4 makes the swing 6 : 4 (1.5×) instead of 6 : 3 (2×). Combined with
~2 seasons of spoilage on a held pile (~19% loss), the hold edge drops to ~1.2× —
a real but non-dominant timing choice. **Alternative:** lower `spring 6 → 5`.

- URL: `/?bal.RICE_SELL_PRICE_BY_SEASON.autumn=4`
- guard: autumn must stay the CHEAPEST season (monotonic direction is
  test-asserted canon) — 4 < spring 6 / summer 5 / winter 5 still holds. ✓

## W3 · eat_rice dominated by free rest — candidate: `EAT_RICE_COST 3 → 2`

The design lever `EAT_RICE_SATIETY (30) > SATIETY_PER_REST (18)` is intact (eat
refuels faster), but for a coin-optimiser eat spends 3 rice (~18 coin in spring)
for +12 body over a free rest. Lowering the rice cost to 2 (~12 coin) narrows the
coin gap so eating your own harvest becomes a live choice when rice is plentiful,
without breaking the eat-faster-than-rest lever. **Alternative (out of cockpit
scope — a code change):** give eat a distinct benefit (uncapped/over-cap
recovery, a small buff).

- URL: `/?bal.EAT_RICE_COST=2`

## Feel all three at once

`/?bal.RICE_PER_RAKE=2&bal.RICE_SELL_PRICE_BY_SEASON.autumn=4&bal.EAT_RICE_COST=2`

Load on the dev server (`npm run dev` → append the query), play, and adjust the
sliders live. When a set feels right, **Export tune → inbox** and an agent
transcribes it (the numbers stay yours).
