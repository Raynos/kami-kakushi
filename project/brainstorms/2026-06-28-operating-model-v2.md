# Operating Model v2 — building the game autonomously (DRAFT for human sign-off)

> **Status:** PROPOSAL — drafted 2026-06-28 from the 3-day process retro. Nothing here is locked; it
> changes *how we work* (CLAUDE.md + the milestone model), so it needs Jake's sign-off before it
> graduates into ADRs + a CLAUDE.md/roadmap rewrite. React to this, then I build it.

## The thesis (why babysitting exists)

**Autonomy is a feedback-loop problem, not a spec-completeness problem.** We tried to buy autonomy
with spec detail — a 7k-line PRD, 79 decisions resolved upfront — and it bought *less* (56 decisions to
babysit, a confident waterfall plan executed into a **hollow game**, Fun 4.5). A spec can never be
complete enough to remove human judgment; what removes it is the agent's ability to **tell when it's
wrong and fix it without you.** That capability = three loops the project lacks: an *executable
definition of good*, a *plan shaped so local progress is globally aligned*, and *self-assessment honest
enough to trust.*

Your attention is the scarce resource, taxed four ways. Each tax has one root cause and one fix:

| Tax — what you spend attention on | Root cause | The fix (system #) |
|---|---|---|
| **Detection** — noticing it's hollow | Tests gate code; **nothing gates fun** | #1 Experience Gate |
| **Redirection** — steering a perfect skeleton of the wrong thing | Waterfall plan, mechanism-shaped milestones | #2 Fun-slice Roadmap |
| **Verification** — re-checking optimistic reports | Self-assessment is optimistic, not adversarial | #3 Honest-by-default |
| **Repetition** — re-giving the same taste guidance | Corrections become fixes, not rules | #5 Corrections→Checks |

(#4 Design-by-Divergence is the quality amplifier that makes taste calls *cheaper and better*, not a tax-killer per se.)

---

## The organizing principle: the Enforcement Ladder

> **Push every quality rule as far UP this ladder as it will go.** A rule that lives as prose gets
> skipped; a rule that fails the build cannot. "Automate it" = "move it up a rung."

| Rung | Mechanism | Strength | Example |
|---|---|---|---|
| **1. Gate** | a `verify`/`playcheck` assertion; the build **fails red** | un-skippable | "Fun-proxy below threshold = build fails" |
| **2. Hook** | a git hook runs the gate; you **can't commit/ship** past it | un-skippable (per clone) | "pre-commit runs `verify`; slice-ship runs `playcheck`" |
| **3. Skill** | a structured process the agent **invokes** | skippable if not invoked → make it the path of least resistance | `battery`, `diverge` |
| **4. Rule** | a CLAUDE.md norm the agent **reads + follows** | weakest; relies on diligence | "report adversarially" |

The current project lives mostly on rung 4 (norms) with one rung-2 hook (journal only) and a rung-1
gate that **excludes the things that matter most** (`verify` has no fun/pacing/playcheck). The whole v2
move is **dragging quality up the ladder.**

---

## The five systems — what's what

Each system, its enforcement rung, what it kills, and its build status.

### #1 — The Experience Gate (`playcheck`) — THE KEYSTONE
- **What it is:** an auto-player bot that plays each slice headlessly and asserts the **fun-factor §3
  vector** (first-5-min hook, no-dead-time, reward cadence, always-a-visible-goal, novelty drip,
  ≥30-min floor, 70/30, combat band) as a **ratchet** against a committed baseline. Hollowness, flat
  combat curves, reward-deserts, dead-value — all **fail the build like a red test.**
- **Type / rung:** CI gate (`npm run playcheck`) wired into `verify` → **rung 1**, run by a hook → **rung 2**.
- **Kills:** the **Detection** tax. You stop being the one who notices it's hollow.
- **Why it's the keystone:** #2 and #3 have nothing to measure against without it. Build it first.
- **Status — mostly substrate-ready:**
  - ✅ `window.__qa` already exposes `dispatch / tick / advanceSeason / toRung / toTier / pacing() /
    reveals() / state()` — **this is the auto-player substrate.**
  - ✅ `pacing-report.ts --check` already exists and **already fails red** — but is **NOT in `verify`**.
  - 🔨 To build: (a) `src/playcheck/bot.ts` — an *optimal* policy + a *casual* policy over `dispatch`;
    (b) the §3 proxy assertions with thresholds (the doc already names them); (c) `npm run playcheck`
    + a committed `playcheck.baseline.json` ratchet (regression = red); (d) **add `pacing:check` +
    `playcheck` to the `verify` script.** This is pulling M6's gate forward to *now*, continuous.

### #2 — The Fun-slice Roadmap (re-axed) + the Slice-DoD manifest
- **What it is:** replace mechanism-layer milestones (M3 quests, M3b macro, M4 T1…) with **fun-complete
  vertical slices** — each closes a loop and is *fun on its own*, measured. A slice's **Definition of
  Done = "playcheck green at this slice's thresholds,"** not "the mechanism compiles." Each slice ships
  a `slice-manifest.json` naming the tests/instruments/playcheck-thresholds that must exist; a checker
  **refuses to mark it SHIPPED** unless they do. (This folds in **H7** and answers **H4** — kills
  "SHIPPED (slice)".)
- **Type / rung:** roadmap doc (rung 4) + the manifest checker as a **gate** (rung 1) + slice-ship hook (rung 2).
- **Kills:** the **Redirection** tax + the dishonest-completeness pattern.
- **Status:** 🔨 rewrite `docs/living/roadmap.md`; build `src/scripts/check-slice-manifest.ts`.
- **Proposed re-axis** (preserves the locked T0–T2 v1 scope + PRD intent per D-021 — changes the *unit
  and the gate*, not the vision):

  | Slice | The fun loop it closes | DoD = playcheck proves… | Maps to |
  |---|---|---|---|
  | **S0 · The Hook** *(shipped, retro-labeled)* | cold-open → labour → humbling first fight | first-5-min hook; reveal cadence in T0 | M0–M2a |
  | **S1 · The Inner Loop closes** | activity → **reinvest** → rung progress → **one real decision** → a sink | no-dead-time; decision-density; reinvestment compounds; combat band | M2b + v0.2 *(ratify or expose it)* |
  | **S2 · The Macro Horizon turns on** ⏭ | the four-pillar **House Influence** engine + first **T0→T1** ascent | pillar loop live + interconnected; always-a-goal includes a pillar goal; the silhouette becomes real | old M3b — *the audit's #1 gap* |
  | **S3 · Breadth — the Valley** | new **domain + verbs** (trade/silk/roads), first pillar interconnection | novelty-drip holds; breadth-not-a-dump; 70/30 across wider content | old M4 (T1) |
  | **S4 · The Region + the warm payoff** | rival contest + Origin/Tama payoff; the anti-slump package | mid-game slump proxies stay green over the longest tier | old M5 (T2) |

  *Note: S1 mostly already exists (v0.2) but was never gated as a fun-slice — S1's first job is to run
  playcheck against it and either **ratify it green or expose that it isn't** (firsthand, the stance
  decision "largely collapses" — so this likely surfaces real work, which is the point).*

### #3 — Honest-by-default (the adversarial self-audit)
- **What it is:** the agent **red-teams its own output before presenting it**, every increment — an
  auto-run mini-`battery` (harness already built) — and surfaces its own hollowness *in the same breath
  as "done"* ("It's a skeleton here; Fun 4.5; macro still a silhouette"). No SHIPPED claim without an
  attached self-audit + green playcheck.
- **Type / rung:** `battery` skill (rung 3, ✅ built) + the slice-ship gate refusing un-audited SHIPPED
  (rung 1–2) + a CLAUDE.md posture rule (rung 4): *pessimistic, evidence-first reporting is the default.*
- **Kills:** the **Verification** tax — the thing that makes overnight autonomy *safe to trust.*
- **Status:** 🔨 wire the mini-battery into the slice-ship ceremony; add the CLAUDE.md rule.

### #4 — Design by Divergence (you asked for this)
- **What it is:** for **any meaningful UI/design surface**, the agent generates **2–3 variants** →
  screenshots each headlessly (`capture-game-states`) → self-reviews each against `ui-design.md` with
  its own vision → presents a **side-by-side contact sheet** so you can *glance and zoom in*, not react
  to the one thing that got built. Your taste call becomes "pick/blend among vetted options."
- **Type / rung:** a new `diverge` skill (rung 3) + a CLAUDE.md rule (rung 4): *no new UI surface ships
  without a variant contact sheet* + a soft check that a new surface carries a `tmp/variants/<surface>/`
  artifact.
- **Kills:** the *cost and ceiling* of UI taste calls — fewer, higher-quality decisions; better designs
  because the space was actually explored (generate-3-pick-1 beats implement-first-idea).
- **Status:** 🔨 write the `diverge` skill; it composes tools you already have (frontend-design +
  capture-game-states + the workflow judge-panel pattern).
- **Output shape (so you can zoom fast):** one contact sheet per surface — variants A/B/C side by side,
  each tagged with the agent's own one-line verdict vs the bible + a recommended pick. You reply "B, but
  A's typography" and it synthesizes.

### #5 — Corrections compound into Checks (the meta-lever)
- **What it is:** **every piece of feedback you give terminates in a self-enforced check** — a playcheck
  assertion, a test, a lint rule, or a UI-checklist line — never just a one-off fix. So the same *class*
  of issue never reaches you twice. (F1–F4 "close-X too small / red-on-hover" should have become two
  permanent UI-checklist lines, not two fixes.) This is what makes babysitting **decay toward zero.**
- **Type / rung:** a CLAUDE.md rule (rung 4) + a **schema change** to the feedback log (add a
  `→ enforced-as` column) + a checker (**rung 1**): a feedback item **can't be closed `✅`** unless its
  `enforced-as` cell points at a real check.
- **Kills:** the **Repetition** tax — structurally.
- **Status:** 🔨 extend the feedback-log template; build `src/scripts/check-feedback-closed.ts`; add the rule.
  The `battery` skill's `LESSONS.md` is the same idea for batteries — generalize it to *all* feedback.

### #0 (cross-cutting) — Make the gate itself un-skippable
The cheapest, highest-leverage fix, enabling all of the above: **the pre-commit hook runs the gate, not
just the journal check.** Two cadences:
- **per-commit (fast, seconds):** `tsc --noEmit` + `eslint` + the journal check → can't commit broken code.
- **per-slice-ship (full):** `npm run verify` + `playcheck` + the mini-battery + the slice-manifest check
  → can't claim SHIPPED dishonestly.

Right now *neither runs `verify`* — the agent can commit red. Closing this is a ~20-line hook change.

---

## What's automatable vs what stays human

| Stays **yours** (irreducible) | Gets **automated** (off your plate) |
|---|---|
| Direction / vision / what the game *is* | Detecting hollowness, walls, reward-deserts (#1) |
| The final fun & taste call on **vetted candidates** (#4) | Producing the candidates + a self-verdict (#4) |
| Greenlighting design decisions the build forces | Defaulting + noting reversible choices; deciding-by-playtest |
| Signing locked intent (ADRs) | Honest status; never-claim-without-proof (#3) |
| | Ensuring a correction never recurs (#5) |

The aim: every taste call you make is **pre-vetted and pre-measured**, and every one you make **only
once.**

---

## Build sequence (dependency order)

1. **#0 hook + wire `pacing:check` into `verify`** — hours. Immediate: nothing red commits.
2. **#1 the `playcheck` bot + §3 assertions + baseline ratchet** — the keystone. ~1–2 build sessions.
3. **#2 re-axe the roadmap + the slice-manifest checker** — the plan now has fun-gated slices.
4. **#3 wire the auto self-audit into slice-ship + the reporting rule.**
5. **#5 feedback-log schema + closed-check + the corrections-as-checks rule.**
6. **#4 the `diverge` skill** — independent; can land any time (you want it, so maybe pull earlier).

Then S2 (the macro engine) is the **first slice built under v2** — and the first one that ships only if
playcheck says the macro pull is real.

---

## What needs your sign-off (vs what I'll just build)

**Needs sign-off (changes what the project *is*):**
- The roadmap re-axis (S0–S4 replacing M3–M7) → ADR.
- "DoD = playcheck-green, ban SHIPPED-slice" (answers H4) → ADR.
- The CLAUDE.md "How we work" rewrite (the enforcement ladder + the new gates).

**I'll just build (routine, reversible):** the `playcheck` harness, the hooks, the `diverge` skill, the
checkers, the feedback-log schema. These are execution.

> **The honest cost:** ~1 week front-loads harness/process over visible features — less shiny short-term.
> That week is exactly what you've been paying in babysitting since. It buys the autonomy.
