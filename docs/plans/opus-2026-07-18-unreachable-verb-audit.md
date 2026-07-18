# Re-sign R2+ pacing against a season wheel players could actually turn — and close the reachability blind spot that hid it

**Status:** 📋 PROPOSED (2026-07-18, session 219)
**Confidence:** ( 70% Opus, 30% Fable ) — the balance verdict is a
sim/derivation question (Opus) and the gate work is mechanical; only
the "is this pacing still FUN" read, if the band moves, wants Fable.
**Template:** build

## Who builds this — Fable or Opus?

- **Phase A (audit + verdict):** Opus. It is derivation and sim reading
  — does any signed pacing number depend on a verb no player could
  perform? No taste in it.
- **Phase B (the reachability gate):** either; mechanical Playwright
  work in the existing e2e lane.
- **Phase C (re-sign, only if A says the band moved):** the numbers are
  Opus; if the fix changes how R2+ *feels*, that read is Fable's and
  goes to the human as an HD-item rather than being self-picked.

## Why

Session 219 found that the **`End the … 季` button was unclickable at
every viewport** and had been for as long as the dock carried
`pointer-events: none` — the click fell through to the nav rail on
desktop and to Settings on phone. Fixed in `bb039cd0`; diagnosis and
hit-test evidence in
[`project/audit/reports/2026-07-18-phone-shell-defects.md`](../../project/audit/reports/2026-07-18-phone-shell-defects.md).

That fix closes the defect but leaves two questions it exposed:

1. **The sim exercised a verb the player could not.** `advance_season`
   is not a corner case in the persona sim — it is load-bearing in two
   places (see "What exists today"). The sim dispatches the intent
   directly, so every pacing figure signed from it assumed a season turn
   that no human hand could perform. Either the numbers are unaffected
   (plausible — the engine is the same either way) or T0 R2+ pacing was
   signed against a loop players were locked out of. **We do not
   currently know which**, and ADR-132's whole point is that balance
   claims are machine-verdicts, not vibes.
2. **The reachability ratchet gave a false green.** `advance_season` is
   explicitly listed in `PLAYER_INTENTS` in
   `src/ui/affordance-coverage.test.ts` and the sweep passed throughout
   — a check that could not have gone RED for this defect (PH3: a false
   green is worse than no check).

No FB/HD/HR demanded this; it is **agent-surfaced** from the 219 build,
recorded here rather than left in a journal "next steps" line (the
"leftover work is a plan, not a sentence" rule, human 2026-07-12).

## What exists today

Surveyed 2026-07-18 at `bb039cd0` (this session, files read directly):

- `src/core/autoplay.ts` — the persona sim. `advance_season` is
  dispatched from **three** sites, two of them structural, not
  incidental:
  - `:444` — the R2+ rice loop: when the paddy's `sitePools` entry is
    drained, the sim **turns the wheel to refill the pool** rather than
    farm a dead field. The comment states the banked pile "still climbs
    to the R7 granary target" *because* of this.
  - `:520` — the `nengu-reckoned` requirement path (ADR-166's refused
    Autumn exit self-resolves by continuing to turn the wheel).
  - `:568` — the Phase-2 loop: ends the season to collect the seasonal
    judge once `PHASE2_SEASON_COLLECT_KOKU` of unjudged estate growth
    has banked.
- `src/core/intents.ts:1548` — the `advance_season` reducer arm; the
  engine refuses the turn pre-R2 (C1.4), so the gating is engine law,
  not UI.
- `src/core/season.test.ts` — covers the reducer's laws thoroughly
  (refusal pre-R2, the ADR-166 Autumn gate). All engine-level; none of
  it touches reachability.
- `src/ui/affordance-coverage.test.ts:70,296` — the intent→affordance
  ratchet lists `advance_season` and sweeps `fixtureState('rung-R5')`.
  Its `sweep()` (`:144`) mounts into **jsdom** and calls `.click()` on
  every `button`/`[role=button]` it queries. jsdom performs no layout
  and no hit-testing, so `pointer-events: none`, occlusion, zero size,
  and off-viewport placement are **all invisible to it**. The ratchet
  proves *"a handler is wired to an element that exists"* — never *"a
  real click reaches it."*
- `src/tests/e2e/` (`mobile-layout` / `mobile-journey`, root
  `playwright.config.ts`, CI via `.github/workflows/e2e.yml`) — the one
  lane that CAN prove reachability: Playwright's actionability checks
  honour `pointer-events`, occlusion and visibility. It is a CI lane,
  not a `verify` gate (the 5s/8s commit budget, ADR-072/ADR-176).
- `docs/content/t0-pacing.md` — the committed pacing report whose diff
  is the before/after for any balance change (ADR-132).

## Steps

1. **Establish whether the verdict can move at all.** Re-run `pnpm run
   verify:balance` + `pnpm run balance:report` at `bb039cd0` and diff
   `docs/content/t0-pacing.md` against its committed state. The 219 fix
   was CSS + a render-side width floor and touched no reducer, so the
   expectation is **byte-identical** — state that explicitly. A clean
   diff proves the *sim's* numbers never depended on the UI (the sim
   bypasses it), which is the narrow question; it does **not** answer
   step 2.
2. **Answer the real question: were the signed bands ever reachable?**
   For each rung R2–R7, derive whether its signed pacing figure requires
   season turns, and how many. `autoplay.ts:444` says the R7 granary
   target rides pool refills, so this is a real dependency, not a
   hypothetical. Produce a short table (rung → turns assumed → reachable
   by a player pre-`bb039cd0`? ) in a report under
   `project/audit/reports/`. **If any rung's signed band assumed turns a
   player could not perform, that band was signed against an unplayable
   loop** — say so plainly and stop for the human (a band re-sign is a
   human call, never an agent's).
3. **Close the blind spot where it can soundly hold (the rung rule).**
   Add a reachability assertion to the **e2e lane** (not `verify` — the
   commit budget): for a small set of always-shipped controls, assert
   Playwright can actually click them, which fails on `pointer-events`,
   occlusion, or zero size. Start with the season wheel at both
   profiles; this is the check that WOULD have gone RED. Keep it small —
   a full intent sweep in Playwright would not fit the lane.
4. **Point the jsdom ratchet at its own limit.** Add a comment block to
   `affordance-coverage.test.ts` stating what it can and cannot prove,
   naming the e2e lane as the reachability half. A future reader must
   not re-derive the false green the hard way.
5. **Re-sim / re-sign (ONLY if step 2 found a moved band).** Follow the
   ADR-132 flow exactly: `verify:balance` → `balance:report` → commit
   the regenerated `t0-pacing.md` WITH the change and paste `balance-sim
   --summary` into the commit body. File the band as an **HD-item**; do
   not self-pick.

## Verification

- **Step 1 could-go-RED:** the `t0-pacing.md` diff is the check — an
  unexpected non-empty diff means the 219 fix moved the sim, which would
  itself be a finding worth stopping on.
- **Step 3 could-go-RED — and this is the load-bearing one:** the new
  e2e assertion must be shown to FAIL against the pre-fix cascade. Prove
  it by re-adding `pointer-events: none` to `.season-end` in a scratch
  worktree (or via an injected stylesheet in the spec's own setup) and
  watching the check go red, exactly as session 219 proved its two unit
  tests by mutation. A reachability check that has never been seen to
  fail is the same false green again.
- **Player-reach (PH6):** the season wheel is driven live at 390×844 and
  1440×900 and the season is observed to actually turn (`seasonsPassed`
  increments) — the s219 evidence table is the template.

## Sync ripple

- **PRD:** none — no system, content or intent changes; this audits
  whether an existing signed number was honest. If step 5 fires, the
  band's §4 figure ripples via `/prd-ripple` at that point.
- **Story-bible:** none — no fiction is touched.
- **Living docs / registries:** `docs/content/t0-pacing.md` regenerates
  **only if** step 5 fires (ADR-132 makes committing it mandatory then).
  `docs/guides/qa-playtesting.md` gains a line on the jsdom-vs-e2e
  reachability split once step 3 lands.
- **CHANGELOG:** none — no version bump.

## Human-in-the-loop

- **Open question, with a default:** if step 2 finds a band was signed
  against unreachable turns, does the band get re-signed against the
  now-reachable loop, or does the *loop* need a design look (was
  players' inability to turn seasons masking a pacing problem)? The
  agent's default is to **file the finding and stop** — a band re-sign
  and any pacing-feel call are human calls (ADR-134: an agent only
  transcribes). File as an **HD-item**.
- No diverge and no taste-scorecard pass: this plan adds no UI surface
  (the e2e assertion is a test, not a surface). ADR-075 §1 exempt.

## Non-goals

- **Not a general unreachable-control audit.** Step 3 covers a small
  named set; a full sweep would not fit the e2e lane's budget. If the
  audit wants to grow, that is its own plan.
- **Not a re-litigation of the six-season design** (ADR-153 / storywave
  G1). The wheel's existence is settled; only whether its pacing was
  signed honestly is open.
- **Not moving the affordance ratchet out of jsdom.** It is cheap and it
  catches the orphaned-intent case well; step 4 documents its limit
  rather than replacing it.
- **Not chasing the `.bar` track's `silver-faint` ring** (recorded in
  the 219 report as deliberately left alone — shared token, wide blast
  radius).

## Risks

- **The likeliest honest outcome is "no band moved."** The sim never
  went through the UI, so its numbers are self-consistent. Say that
  plainly if so — the value is then entirely in step 3's gate, and
  padding the finding to justify the plan would be its own failure.
- **A step-3 check that cannot fail is worse than none** (PH3). The
  mutation proof is not optional; if it cannot be made to go red, do not
  land the check.
- **e2e lane time.** The lane runs two real mobile profiles in CI; keep
  the addition to a handful of controls or it drags every PR.
- **Seam.** This plan owns `src/tests/e2e/*`,
  `src/ui/affordance-coverage.test.ts`, and (only under step 5)
  `docs/content/t0-pacing.md`. No live plan in `docs/plans/` touches
  them as of 2026-07-18. **Shared tree — 4 co-agents were live at
  authoring** (pictogram, bestiary-plates, plans-status, talk/asks); the
  asks work is in `src/core/content/` and does not overlap. Re-check
  herdr peers + `git diff --cached --name-only` before each commit, and
  note `t0-pacing.md` is a high-collision generated file.
