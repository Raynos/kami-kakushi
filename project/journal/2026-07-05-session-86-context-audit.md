# Session 86 — 2026-07-05 — context audit: the agentic scaffolding (Fable 5)

**Summary:** Ran the queued human TODO "Ask Fable 5 to review the context" — a
fresh-eyes audit of AGENTS.md / repo-map.md, the git hooks (`.githooks/`), the
Claude hooks + settings (`.claude/`), all 13 repo skills, the hookify rules, and
`session-brief.sh`, for drift / bloat / gaps. Method: direct read of every
artifact + two read-only sweep agents (a 209-reference dead-link sweep; a
10-claim mechanism-vs-reality verification), all agent claims spot-verified
(R2). Deliverable: `project/audit/reports/2026-07-05-context-audit.md`. The
scaffolding is fundamentally healthy; found 2 HIGH + 5 MEDIUM findings — the
pure doc-drift half fixed this session, the enforcement-shape half left as
proposals for the human (process shape is the human's call).

## What changed

- `project/audit/reports/2026-07-05-context-audit.md` (new) — the audit report:
  findings ranked, evidence cited, fixed-vs-proposed marked.
- **Drift fixes (aligning stale copies to locked reality):**
  - `AGENTS.md` — gate-roster owner corrected `verify-run.ts` → `gates.ts` (the
    hook header + working-agreements + gates.ts itself all name gates.ts);
    `/drain-inbox` described as the interactive ≤5-batch flow it now is (the
    skill's §4 human-go-ahead gate was invisible from AGENTS.md).
  - `repo-map.md` + `docs/living/prd.md` preamble — reflect the PRD split
    (prd.md is a 77-line index; the body is `docs/living/prd/01…07`); prd.md
    still called itself "a single living document — every section lives below".
  - `docs/living/qa-playtesting.md` §0 + §7 — removed the pre-hook remnants
    that still recommended the Playwright/Chrome-DevTools MCP browser tools
    (blocked by `enforce-headless-qa.sh` since Jul 1); §7 now states the block
    and points at the headless node drivers.
  - `.claude/skills/capture-game-states/SKILL.md` — Setup section rewritten:
    was "drive via Playwright MCP or Chrome DevTools MCP … **prefer headful**",
    which walks an agent straight into the PreToolUse deny. Now HEADLESS ONLY
    via `qa-shots.mjs` / an ad-hoc headless page.
  - `src/scripts/session-brief.sh` — the CI probe used `timeout`, which macOS
    doesn't ship → the brief's CI line was permanently "(status unavailable)".
    Replaced with a portable perl alarm+exec time-box; verified live
    (`completed/success` now renders).
- **Left for the human (proposals in the report):** auto-wire/verify
  `core.hooksPath` (a fresh clone silently runs zero hooks today); extend the
  `no-tree-mutation` hookify pattern (`git switch` / `reset --hard` / `clean`
  uncovered); restructure the diverge skill's retired sections; compress the
  AGENTS.md checkpoint bullet (working-agreements.md is the declared SoT);
  prune stale `settings.local.json` allows.

## Coordination notes

- A co-agent (session 85) has the test-suite audit staged — that covers the
  second Fable-5 TODO; not duplicated here.
- `project/todo-human.md` was staged by that co-agent mid-flight, so the
  reading-queue line for this report + clearing the done TODO are deferred to a
  follow-up commit once their commit lands (shared-index safety; the queue
  gate's loud warn on this commit is expected and acknowledged).

## Next intended steps

- Add the report to the reading queue + clear TODO #1 when todo-human.md frees.
- Human steers on the report's §Proposals; the hooksPath gap is the one I'd
  take first.

## Entry 2 — the audit graduated to a plan (+ 2 H-items)

The human returned, asked four meta-questions (top-5/10 ranking · too much
context/markdown/guardrails? · time/context/token efficiency · unknown
unknowns), then asked for the plan file. Written:
`docs/plans/fable-2026-07-05-context-hardening.md` — P1 hooksPath auto-wire →
P2 RED-able `verify:tooling` meta-suite (nightly lane, D-072-safe) → P3
guardrail coverage/dedupe (no-tree-mutation extension; bulk-add-warn cull
needs-nod; settings.local.json prune is human-owned) → P4 context diet
(V1–V4/PH1–PH6 namespace fixes — taste.md already says V1–V4, AGENTS.md's
T1–T4 was drift; diverge retired-§ archive; checkpoint-bullet compression;
doc-budget caps for AGENTS.md ≤420 / repo-map ≤160). Deliberately NOT built:
H21 (per-agent worktrees vs shared tree) + H22 (journal shape — the 4×
write-up cost) filed as open H-items in `human-in-the-loop/decisions.md`
(lock direction before building process). Plan queued in todo-human.md (same
commit — the hard gate).
