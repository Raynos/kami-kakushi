# Narrative/story diverge: Brainstorm / Discovery Notes

Date: 2026-07-06 · Goal: design how D-075-style divergence applies to
narrative/story content (T0 rung beats, intro, dialogue, cold open) — the
process, the review medium, and how it relates to the fable audit/redesign
TODOs and R8.

## Summary / key decisions

- **Standing rule, not a one-shot**: ALL new story elements and ALL
  feedback-driven story improvements always come with **3+ options**. The
  purpose is anti-slop: never accept the first (likely-generic) narrative take.
- **Scope**: any fiction-voiced text the player reads (beats, dialogue, cold
  open, flavor lines, names, descriptions) at its own unit size; mechanical UI
  copy and typo/name-sync edits exempt. Retroactive coverage arrives via the
  human's queued redesign TODO (not planned here — Q10 boundary).
- **Distinctness bar**: each option makes a different dramatic choice
  (register / information revealed / character stance) — paraphrase ≠ option.
- **Authoring**: 3+ independent blind agents, **one agent per complete TAKE**
  of the bundle, each under a distinct dramatic brief; session-model routing
  (D-124 default).
- **Pick**: agent self-picks via Pass-2 taste-scorecard verdict + canon fit
  (F10 runs per option); rationale in the bundle review doc; human overrides.
- **Bundling**: coherent bundles sized by judgment (story-drop or
  per-dramatic-unit) — never 25+ atomized taste calls, never forced into one
  mega-doc.
- **Review medium (build item)**: in-game DEV surfaces — (1) a story-variant
  set-switcher (sets + per-unit override), (2) a read-only full-page
  script-reader modal; sign-off is conversational ("read in-game, tell the
  agent"). Designed now, built next via a `docs/plans/` plan.
- **Lifecycle**: alternates live DEV-only (strip-gated) until sign-off, then
  pruned; the committed review doc is the archive. Zero prod flag-debt.
- **Rule home**: ADR + always-loaded AGENTS.md bullet + new sibling
  `narrative-diverge` skill (cross-linked with `diverge`). No gate.
- **R8 stays open as-is**; audit/redesign TODOs remain untouched fresh-context
  work for the human to kick off.

## Q&A log

### Q1 — deliverable of this session
- Asked: reusable process vs one-shot T0 diverge?
- Captured (user's words): "The goal is for all new story elements and all
  feedback driven story improvements to always come with 3+ options so we can
  reduce the amount of story slop." → i.e. a **standing always-on rule** for
  narrative work — stronger than a reusable-but-opt-in process, and it covers
  BOTH new content and feedback-driven edits. Minimum is **3+**, not D-075's
  2–3.

### Q2 — granularity / where the rule bites
- Asked: at what unit do the 3+ options apply; where's the exemption floor?
- Captured: **any prose the player reads** — every authored narrative unit (a
  beat, a scene, a dialogue line, a flavor string) gets 3+ options *at its own
  size* (3 alternative lines for a line, 3 alternative scenes for a scene).
  Only mechanical edits (typo fix, name sync) are exempt.

### Q3 — distinctness bar
- Asked: what must vary so 3 options aren't 3 paraphrases (slop ×3)?
- Captured: **distinct dramatic choices** — each option makes a different
  STORY decision: different emotional register, different information
  revealed/withheld, different character stance. Test: a reader can say what
  each option commits the story to that the others don't. Applies at every
  unit size (per Q2).

### Q4 — who picks / does the game wait
- Asked: human picks everything vs agent self-pick + override vs tiered?
- Captured (user's words): "Agent picks human overrides, but bundle them
  smartly, like bundle them somehow, I dont want to review 25+ taste calls."
  → D-075-style self-pick (never blocks), but the human-review surface must be
  **bundled** — NOT one R-item / one call per unit. Bundling shape = open
  design question (→ Q5).

### Q5 — bundling shape
- Asked: how to bundle taste calls (one story-drop doc vs per-scene vs digest)?
- Captured: **hybrid of story-drop + per-dramatic-unit** — "it should bundle
  them in a way that makes sense but it shouldnt be forced to bundle
  everything into a single story-drop review doc." Agent judgment per work
  unit: bundle coherently, no fixed single-doc rule.

### Q6 — review medium (KEY BUILD ITEM)
- Asked: script doc vs in-game toggle vs tiered?
- Captured (user's words): "I want to review everything **in game** — we
  should have variants & **story variants as different elements in the DEV
  menu**. I also want a separate **'explore story variant' full-page modal**
  in the game as part of DEV menu that lets me read and review the readable
  script doc, but in game, not reading t0-story.md in the terminal/IDE."
  → Two DEV surfaces: (1) a story-variant selector (sibling of the UI-variant
  selector) that swaps live narrative; (2) a full-page script-reader modal
  rendering the readable script + options for review, in-game.

### Q7 — authoring independence
- Asked: how are 3+ options generated?
- Captured: **independent agents per option** — each authored by a separate
  agent with a distinct dramatic brief (register/stance/reveal), blind to the
  others. Workflow-friendly.

### Q8 — losers' fate
- Asked: where do non-picked options live after the pick?
- Captured: **the review doc is the archive** — canon (F5 markdown → gen
  registries) carries only the picked version; alternates survive in the
  committed review doc. Zero canon clutter.

### Q9 — retro scope
- Asked: does the rule cover the already-written T0 story?
- Captured: **retro via the redesign TODO** — the existing T0 narrative gets
  re-diverged as part of the queued "fable redesign of story beats"; nothing
  grandfathered silently. (Reconciled with Q10: this session does NOT plan
  that redesign — it only makes the process canon so the fresh agent applies
  it.)

### Q10 — relation to the audit/redesign TODOs (BOUNDARY)
- Asked: how do the sibling TODOs wire into this process?
- Captured (user's words): "Let the audit & redesign alone, they are my TODOs
  and fresh fable agents can look at them without a poisoned or leading
  context." → **Hard boundary**: this session designs the standing process
  only; it must NOT pre-wire, brief, or scope the audit/redesign. Those get
  fresh-context fable sessions kicked off by the human.

### Q11 — DEV toggle grain
- Asked: whole story-sets vs per-unit mix-and-match?
- Captured: **sets + per-unit override** — coarse selector swaps a whole
  coherent option-set (pacing reads true); the script-reader modal
  additionally lets the human flag/override individual units within a set.

### Q12 — rule home / enforcement rung
- Asked: where does the rule live so it fires every time?
- Captured: **ADR + always-loaded AGENTS.md bullet + skill** — ADR
  (D-075-style refinement for narrative), AGENTS.md bullet (buried skills
  don't fire), and the diverge-skill procedure for narrative. No gate (would
  cry wolf on mechanical edits).

### Q13 — alternates lifecycle (resolves Q6↔Q8 tension)
- Asked: DEV toggle needs alternates compiled, but canon carries only the pick
  — when do alternates leave the tree?
- Captured: **DEV-only until sign-off** — alternates live in a DEV-only
  narrative-variants source area (compiled, strip-gated from prod, exactly
  like UI variants); on in-game sign-off the losers are pruned to the review
  doc. Zero prod flag-debt; mirrors D-075's "toggle keeps alternates until
  the human confirms".

### Q14 — skill shape
- Captured: **new sibling `narrative-diverge` skill** (UI flow and story flow
  share philosophy, almost no procedure); cross-link both skills.

### Q15 — taste-scorecard integration
- Captured: **two-pass F10 per OPTION** — Pass 1 brief shapes all
  option-authors' dramatic briefs; Pass 2 scores each take before the agent
  picks; verdicts attach to the bundle review (matches UI diverge).

### Q16 — agent split at volume
- Captured: **one agent per TAKE** — each blind agent authors a complete
  coherent take of the whole bundle under its distinct dramatic brief. Sets
  stay internally coherent (feeds the Q11 set-switcher); cost = 3+ agents per
  bundle, not per line.

### Q17 — sign-off transport
- Asked: how does the in-game sign-off reach the repo?
- Captured: **read in-game, tell the agent** — the script-reader modal is
  read-only; the human reviews in game and gives the verdict in conversation
  (or an inbox note). No export controls, no dev-middleware canon writes.
  (Keeps the modal build light; the D-134 export pattern stays balance-only
  for now.)

### Q18 — build scope of this session
- Asked: build the DEV surfaces now?
- Captured: **design now, build next** — this session locks the process (ADR
  + skill + AGENTS.md bullet) and writes a `docs/plans/` build plan for the
  two DEV surfaces; the build is its own workstream. Whether DEV-only tooling
  gets a lighter D-075 touch is decided in that plan.

### Q19 — pick criteria
- Captured: **scorecard + canon fit** — pick = best Pass-2 taste-scorecard
  verdict, tie-broken by coherence with existing canon (T3) and the four
  taste values; pick rationale written into the bundle review doc.

### Q20 — boundary of "story element"
- Captured: **fiction-voiced text only** — beats, dialogue, cold open, flavor
  lines, item/creature/location names and descriptions. Mechanical UI copy
  (buttons, errors, settings) exempt — ui-design.md territory.

### Q21 — R8 fate
- Captured: **keep R8 open as-is** — the human still wants to read the
  current beats (they're also the baseline the redesign diverges from); R8
  stands independent of the redesign.

### Q22 — model routing for take-authors
- Captured: **inherit the session model** (D-124 default stands — no standing
  Fable exception in the ADR; a session on a lesser model asks before routing
  up).

### Q23 — completeness backstop
- Captured: nothing further; **wrap it up** — reconcile, promote to ADR +
  AGENTS.md bullet + `narrative-diverge` skill + DEV-surfaces build plan,
  queue the plan, commit.

## Parking lot (tangents / parallel threads)

## Open flags (pending input)
