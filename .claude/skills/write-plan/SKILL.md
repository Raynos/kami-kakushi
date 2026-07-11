---
name: write-plan
description: Author a new docs/plans/ plan the template-compliant way — scaffold from the generated skeleton, walk the judgment the gate can't check (grounding survey, record citations, sync ripple, seams, player-reach proof), validate, and queue it. Use whenever a session is about to write an implementation plan, or when the human says "write a plan / plan this out".
argument-hint: "What is being planned? (one line — the outcome the plan lands)"
---

# write-plan — author a plan that passes the gate AND the executor

> The pre-commit gate (`verify-plan-template.ts`, 2026-07-11 plan audit)
> checks *sections*; this skill supplies the *judgment* a regex can't hold.
> Canon: [`docs/guides/plan-authoring.md`](../../../docs/guides/plan-authoring.md).
> A plan's real job: transfer verified intent from THIS (dying) session to a
> cold executor and an async human reviewer, without trampling parallel work.

## 0 · Is it a plan at all?

A diagnosis / option-map whose output is a **decision, not code** is a
brainstorm → `project/brainstorms/`, no template. Trivial one-line tweaks
need no plan — just do them. Otherwise pick the class:

- `build` — changes the game (feature / system / UI / story / balance).
- `process` — changes how we work (tooling, gates, CI, skills, docs
  machinery).
- `ops` — a one-shot operation (ripple, reconcile, release, rewrite).

## 1 · Scaffold

```bash
pnpm exec tsx src/scripts/verify-plan-template.ts --scaffold <class> \
  > docs/plans/<model>-<series>-<slug>.md
```

- `<model>` = the model running THIS session, lowercased family name
  (`fable-` / `opus-` / …) — what your `Assisted-by:` trailer will say.
- `<series>` = today's date unless a named wave applies.
- Fill **every** section; **delete the guidance comments as you go** — the
  gate treats comments as empty, so an unfilled skeleton cannot land.

## 2 · The judgment pass (what the gate can't check)

Work these INTO the sections while filling them:

1. **Ground in the real tree, this session (PH2).** Read the files you cite
   — don't quote older docs or memory. Cite paths + commit hashes, and
   stamp the **survey date**. The gate warns on cited paths that don't
   exist; don't make it.
2. **Cite the record in Why.** Which FB-nn / ADR-nnn / HR / HD / dated human
   quote demands this? If nothing does, say so honestly — "agent-proposed,
   no record" — and expect the human to weigh it accordingly.
3. **Sync ripple, honestly.** For each line (PRD · story-bible · living
   docs/registries · CHANGELOG): a concrete edit, or `none — <reason>`.
   A reason is a claim the reviewer can check — "the porter is the reader's
   marker, not fiction" beats "n/a".
4. **Name the seam (shared tree!).** Check `docs/plans/` for live plans and
   the herdr peers list; state which files this plan owns and what it must
   land before/after. This repo's most distinctive failure mode is two
   agents in one file.
5. **Player-reach proof (build plans, PH6).** Verification names a capture,
   e2e, fixture, or live drive — unit tests alone can green a feature no
   player can reach.
6. **Route it.** Who builds this — where does judgment concentrate, per
   phase? `Confidence: ( X% Opus, Y% Fable )`, doubt favors Fable
   (ADR/D-124: subagents inherit the parent model unless the human routes).
7. **UI surface?** Then taste-scorecard Pass 1 BEFORE building and the
   diverge obligations (ADR-075 / ADR-139) belong in Human-in-the-loop.
8. **Big plan (>1 sitting)?** Open with a "Context a fresh executor needs"
   ordered read list — the audit's most-praised exemplar move.

## 3 · Validate + land

```bash
pnpm exec tsx src/scripts/verify-plan-template.ts docs/plans/<file>.md
```

Fix every ✗ AND every `~ WARN` (warns are the judgment checks — a warn you
can't fix honestly is a smell worth surfacing to the human). Then, in the
SAME commit: add the plan to the reading queue in
[`project/todo-human.md`](../../../project/todo-human.md) (a pre-commit gate
hard-blocks it otherwise), and commit by **explicit pathspec** (shared
tree). The plan starts `📋 PROPOSED`; flip the token as it moves
(`checkpoint` archives it at DONE/SUPERSEDED).
