# Session 46 — UI-v2: seven diegetic prototype framings (Fable)

**Date:** 2026-07-02 (evening) · **Agent:** Claude Code / Fable 5 ·
**Scope:** `prototype/` (new, standalone), `project/brainstorms/` — zero
`src/` changes (the koku build owned `src/` in a parallel session).

## What happened

- **Mission (human steer):** rethink what the UI *is* — zoom out, ignore
  `ui-design.md` defaults, produce 5+ standalone HTML5 prototypes with mock
  data at an indie/AA craft bar. Mid-session the human deleted an
  Opus-authored exploration brief as tainted ("weak-ass ideas"); all
  concepts descending from it were discarded and the set was re-derived
  independently (two additional framings cut for overlap).
- **Pipeline:** 3 scout agents (feature/copy pack from the pure core,
  vision+fun distillation, genre research) → 8-agent ideation panel (6
  assigned framings + 2 unseeded wildcards) → curation (combat wildcard
  kage-e promoted; free wildcard re-derived the emaki independently — kept
  as brief only) → 7 parallel builders → vision QA on playwright
  screenshots → fix rounds → final QA: **7/7 zero console errors, all demo
  beats playable and persistent, no mobile body h-scroll.**
- **Shipped** (all self-contained, file:// -openable, system fonts only):
  `prototype/01-sugoroku.html` (promotion-board print, outward spiral),
  `02-printshop.html` (nishiki-e gaining colour plates; karazuri locks),
  `03-cutaway.html` (living house cross-section; night cold-open),
  `04-daifukucho.html` (steward's desk; soroban + stamps + red-ink audit),
  `05-stage.html` (character cinema; Entrance & Address ceremony),
  `06-kura.html` (the hoard made visible; hundred-mon coin strings),
  `07-kagee.html` (shoji shadow-play; bestiary as sharpening shadow-album),
  plus `index.html` gallery, `README.md`, and `briefs/` (8 concept briefs +
  shared `DATA.md` mock pack + `SPEC.md` build contract).
- **QA infrastructure:** `tmp/ui-v2-shots.mjs` (git-ignored) drives every
  prototype through a uniform `data-dev` beat contract (tick / fight /
  rung / judge / reveal / season / stage presets) and screenshots desktop +
  mobile with console-error capture.

## Verdict (R4 self-pick, human overrides)

**Lead recommendation: 07-kagee**, runner-up 03-cutaway; graft the audit
ritual (04), Entrance & Address (05), hundred-mon knot (06), karazuri
emboss (02), and keep 01's board as a secondary progression-map screen.
Full per-prototype self-review + rationale:
`project/brainstorms/2026-07-02-ui-v2-fable-session.md`. Next step after
the human's taste pass: the real `diverge` skill (D-075) to wire the chosen
frame into the live game behind the DEV panel.

## Process notes (worth remembering)

- Usage limits killed the fix workflow twice mid-run; the Workflow resume
  cache ratcheted forward each time (completed agents replay free), but
  **failed workflow agents restart from zero on every resume** — for the
  final 3 fixes, plain Agent-tool subagents (individually continuable,
  cheaper models for mechanical work) were the better tool. Screenshot
  deviceScaleFactor 1 (not 2) quarters vision-token cost with no QA loss.
- The recurring builder bug across prototypes: a `busy` guard swallowing
  demo triggers (the scripted fight never resolves without a stance click)
  — fixed everywhere with a force-resolve-then-play beat contract.

## State / checkpoint

- Committed by explicit path: `prototype/**`, the brainstorm working doc,
  this journal, the reading-queue line. `src/` untouched;
  `project/status/project-status.md` deliberately NOT edited (owned by the
  parallel koku session this evening; their WIP was live in the tree).
- **Push outcome:** attempted at 22:45 — pre-push gate RED (17 failing
  tests, all in the parallel session's in-flight src WIP: route/travel
  expectations, not this commit's files). Per working agreements: no
  `SKIP_VERIFY` override onto main — **this session-46 `feat(prototype)`
  commit is left local**; whoever next holds a green tree should
  `git push origin main` to land it.
