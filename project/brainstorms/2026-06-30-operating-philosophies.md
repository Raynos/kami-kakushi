# Operating philosophies — the curated set (proposal for the human)

_Written 2026-06-30 (session-26). A `Workflow` fan-out (41 agents, 2.3M tokens)
mined the whole repo and adversarially verified **30 candidate philosophies**;
this doc unifies + curates them down to a true philosophy set. Raw verbatim:
`project/brainstorms/raw/2026-06-30-philosophies-mine.json` (git-ignored). The
original 30 are preserved in the appendix — nothing is thrown away._

> **What counts as a philosophy** (the human's bar): _"something a philosopher
> might say — how to reason, why to reason, what to reason."_ Not a mechanic, not
> tool-usage, not an engineering guideline, not a process step. Those are real
> but live in **AGENTS.md / markdown**, not here.
>
> **Legend** · ★ recommended philosophy (numbered **R1–R6**, phrases locked) · ↳
> facet of the entry above. Only the philosophy set is numbered; everything else
> is unnumbered.

---

## The philosophy set — R1–R6 (phrases locked)

### A · The bar & epistemics
- **R1 ★ No clock, no shortcuts** ✅ _(done — D-080)._ Correct & slow beats shitty
  & fast; there is no deadline; a shortcut is shipping below the bar. _Reasons
  about: time vs. quality._
  - ↳ _Rigor to saturation_ — a review/QA pass ends at saturation (two dry passes),
    never at a clock or fatigue.
- **R2 ★ Verify, don't trust.** A maker is blind to their own gaps, and you can't
  trust provenance you can't see — so existing files, canon, and other agents'
  work are checked, not trusted, against independent eyes / the gates / reality.
  _Reasons about: work you did **not** author._
  - ↳ _The map is not the territory_ — a doc/ADR/label is a claim about the running
    code, not proof; where they differ the build wins (D-079 fixed the doc to the
    code).
- **R3 ★ Done is earned, not declared** _(merge of "done means done" + "checks
  with teeth")._ The self-facing twin of R2: be skeptical of your **own** apparent
  success. A claim of _done_ must be literally, verifiably true — lead with what's
  missing, never push red ("done means done"); and a green check is worthless
  unless it could have gone **RED** and drove the real player path ("checks with
  teeth"). Both reject the comfortable, hollow version of success on your own work.
  _Reasons about: distrusting your own green._

### B · Autonomy & execution
- **R4 ★ Bias to motion: act, self-vet, surface.** The human owns direction, taste
  & the irreversible; the agent makes reversible progress by default, self-picks,
  self-vets, surfaces every fork for **async** override rather than waiting — it
  never blocks and never silently decides. _Reasons about: the division of labour
  / act vs. ask._
  - ↳ _Autonomy is a feedback-loop problem, not a spec-completeness one_ — the
    7k-line PRD bought _less_ autonomy; you buy it with self-correcting loops.
  - ↳ _The HITL queue_ — everything needing a person funnels into one legible,
    gate-protected, session-surfaced queue, so "never block" actually works.

### C · Product & craft
- **R5 ★ If it isn't fun, it isn't finished.** A compiling build is the floor; the
  bar is paced, genuinely fun, intentional (woodblock/ink, never AI-slop). Fun is a
  hypothesis tested by play — proxies prove its absence, only a human certifies its
  presence. _Reasons about: what "good" means for the product._
  - ↳ _Intentional craft over generated defaults_ — lock the design language first;
    opinionated constraint reads handmade, defaults read as slop.
  - ↳ _The player gets the real game_ — builder conveniences (DEV tools,
    accelerators) are stripped from prod; the player never gets the scaffolding.

### D · Build discipline
- **R6 ★ If a player can't reach it, it doesn't exist.** _Reasons about: what counts
  as **built**._ A change that lives only in TypeScript, with no UI and not
  reachable in the live MCP playtest (Playwright / Chrome-DevTools), is **not
  done** — the unit of progress is a fun-complete vertical slice a human can
  actually see and use, never a feature that merely compiles. Build **lean** (start
  minimal; filler, dead values, and speculative tooling are defects) and **diverge
  before you converge** (2–3 genuinely-distinct, working alternatives, judged live,
  then converge).

---

## Demoted — not philosophy (→ AGENTS.md / markdown)

Real, but process / mechanic / engineering, not "how/why/what to reason":

- **The human's intent is the only canon** _(ex-R5)_ — governance/process → see
  suggested AGENTS.md change below.
- **The session is disposable; the repo is the memory** _(ex-R7)_ — process → see
  suggested AGENTS.md change below.
- **Make quality structural / highest rung** _(ex-R10)_ — convention → see
  suggested AGENTS.md change below.
- **Many small, verified commits straight to trunk** — cadence mechanic (already
  in AGENTS.md "How to work here").
- **Good citizen of a shared, concurrent tree** — git usage (already in AGENTS.md
  + PreToolUse guards).
- **Logic lives in a pure, deterministic core** — engineering (already in AGENTS.md
  "Conventions" + the ESLint gate).
- **Single source of truth — generate, don't duplicate** — information architecture
  (already in AGENTS.md "Conventions").

## Held out — game-design / world canon (already locked in PRD / fun-factor)

🎴 _UI as progression — the fractal reveal_ · 🎴 _Earned, never given_ · 🎴
_Grounded & mundane-real_ · 🎴 _Earned progress is sacred — soft setback_ · 🎴
_Story through mechanics; teach diegetically_.

---

## Suggested AGENTS.md / markdown changes

For the three that read as **process**, not philosophy (ex-R5, ex-R7, ex-R10) —
concrete edits so the idea is captured where it belongs:

### ex-R5 · The human's intent is the only canon → AGENTS.md "How to work here"
Add a short bullet (it's governance, already anchored by **D-022**):
> **The human's intent is canon.** The newest human steer supersedes any prior
> ADR or lock; when a living doc disagrees with intent, the **doc** is what's
> wrong — fix it. (D-022 governs; `created_date` disambiguates which call is
> current.)
The existing "Freeze = locked intent, not the plan" convention already carries
the _lock-intent-keep-route-liquid_ half — leave it.

### ex-R7 · The session is disposable; the repo is the memory → AGENTS.md (≈80% there)
Already mostly covered by the **"Leave it resumable"** + **durable-by-default**
bullets. Suggested tweak: lead the "Leave it resumable" bullet with the framing
_"The session is disposable; the repo is the memory — if it isn't a committed
file, it doesn't exist,"_ and fold **annotate-don't-delete** (append-only /
lossless: supersede with a strikethrough + forward pointer, park don't cut,
archive don't remove) in as its one-line corollary. No new doc.

### ex-R10 · Make quality structural → AGENTS.md "Conventions" (already there)
Already the **"Push each quality rule to the highest rung that can hold it"**
convention. Suggested one-word tweak: "…the highest rung it can **soundly** hold
— calibrated so a gate never cries wolf" (folds in _calibrated-enforcement_). No
new doc.

_(The other demoted items — small commits, good citizen, pure core, SSOT — are
already stated in AGENTS.md; no change needed.)_

---

## Next step — phrases chosen; ready to land

Phrases locked (R1 ✅ done). Landing plan:

1. A `docs/philosophy/*.md` for each of **R2–R6** (same shape as
   `no-clock-no-shortcuts.md`: statement → principles → "why this exists"
   grounding → canon link).
2. A register ADR recording the curated set + the three demotions.
3. A one-line link to each from the AGENTS.md `## Philosophy` lead (or a
   `docs/philosophy/README.md` index it points to).
4. Apply the three suggested AGENTS.md edits above.

No shortcuts; R3/R6 themselves say done is earned and only counts when reachable.

---

## Appendix — the original 30 (verbatim from the mine)

The full adversarially-verified list, **before** unification + curation, in the
workflow's ranked order — preserved so nothing is lost. Each line: the one-liner,
its original verdict, and **→** where it maps now (an **R#**, a demotion to
AGENTS.md, or game-canon).

1. **No clock, no shortcuts** — Correct & slow beats shitty & fast. _(ALREADY-
   COVERED)_ → **R1.**
2. **Verify, don't trust** — Every judgment that matters is proven by independent
   eyes. _(FORMALIZE)_ → **R2.**
3. **Newest human steer wins** — The newest decision supersedes every prior lock.
   _(FORMALIZE)_ → **ex-R5 → DEMOTED → AGENTS.md (process).**
4. **Human steers; agent executes & never blocks** — Self-vet, surface every fork
   for async override. _(FORMALIZE)_ → **R4.**
5. **Session disposable; repo is the memory** — If it isn't a committed file, it
   doesn't exist. _(FORMALIZE)_ → **ex-R7 → DEMOTED → AGENTS.md (process).**
6. **Annotate, don't delete** — The record only ever grows. _(CONSOLIDATE)_ →
   **DEMOTED → AGENTS.md (with ex-R7).**
7. **Pure, deterministic core** — Pure single-RNG core; renderer draws plain data.
   _(CONSOLIDATE)_ → **DEMOTED → AGENTS.md.**
8. **Fun is the bar, not a compiling build** — A human certifies fun's presence.
   _(CONSOLIDATE)_ → **R5.**
9. **Lean by default** — Filler, dead values, speculative tooling are defects.
   _(FORMALIZE)_ → **R6 (lean).**
10. **Fun-complete vertical slices** — A closed, fun loop, not a compiling
    mechanism. _(CONSOLIDATE)_ → **R6 (not-done-until-playable).**
11. **Autonomy is a feedback-loop problem** — Buy autonomy with loops, not a bigger
    spec. _(CONSOLIDATE)_ → **R4 (facet).**
12. **The enforcement ladder** — Highest rung that can hold it. _(CONSOLIDATE)_ →
    **ex-R10 → DEMOTED → AGENTS.md (convention).**
13. **Calibrated enforcement — never cry wolf** — Enforce only as hard as soundly
    bears. _(CONSOLIDATE)_ → **DEMOTED → AGENTS.md (with ex-R10).**
14. **Single source of truth** — One home per fact; no drift. _(CONSOLIDATE)_ →
    **DEMOTED → AGENTS.md.**
15. **Done means done / honest reporting** — Verify before you claim; name what's
    missing. _(CONSOLIDATE)_ → **R3 (merged).**
16. **Measure the real thing, with teeth** — A green only counts if it could have
    gone red on the real path. _(CONSOLIDATE)_ → **R3 (merged).**
17. **The map is not the territory** — Canon is a claim to verify against the
    build. _(CONSOLIDATE)_ → **R2 (facet).**
18. **Intentional craft over generated defaults** — Constraint reads handmade,
    defaults read slop. _(CONSOLIDATE)_ → **R5 (facet).**
19. **Don't ship the first idea — diverge** — Real, distinct, working alternatives,
    judged live. _(CONSOLIDATE)_ → **R6 (diverge).**
20. **Attack from fresh angles until the well runs dry** — QA stops at saturation.
    _(CONSOLIDATE)_ → **R1 (facet).**
21. **The HITL queue is sacred** — One legible, gate-protected, surfaced queue.
    _(CONSOLIDATE)_ → **R4 (facet).**
22. **Builder's conveniences never reach the player** — The player gets the real
    game. _(CONSOLIDATE)_ → **R5 (facet).**
23. **Many small, verified commits straight to trunk** — Each green, never a risky
    branch. _(ALREADY-COVERED)_ → **DEMOTED → AGENTS.md.**
24. **Good citizen of a shared, concurrent tree** — Touch only your own work.
    _(ALREADY-COVERED)_ → **DEMOTED → AGENTS.md.**
25. **Lock the intent, keep the route liquid** — Freeze the vision, tune the plan
    from play. _(ALREADY-COVERED)_ → **DEMOTED → AGENTS.md (with ex-R5).**
26. **UI as progression — the fractal reveal** — Panels ink in one at a time.
    _(ALREADY-COVERED)_ → **game-canon (held out).**
27. **Earned, never given** — Only grind hands out power. _(ALREADY-COVERED)_ →
    **game-canon (held out).**
28. **Grounded & mundane-real** — No magic; every omen has a human cause.
    _(ALREADY-COVERED)_ → **game-canon (held out).**
29. **Earned progress is sacred — soft setback** — Humbling, never cruel.
    _(CONSOLIDATE)_ → **game-canon (held out).**
30. **Story through mechanics; teach diegetically** — The reveal is the plot and
    the lesson. _(CONSOLIDATE)_ → **game-canon (held out).**
