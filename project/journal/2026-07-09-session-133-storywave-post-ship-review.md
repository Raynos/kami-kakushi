# Session 133 — 2026-07-09 — storywave post-ship review (four-agent audit)

**Summary:** at the human's request, ran a four-agent (Opus-routed, human
steer) review of everything the story-bible-finish + storywave-docs +
storywave-game plans landed on `main` (`362e14d^..HEAD`). Report:
`project/audit/reports/2026-07-09-storywave-post-ship-review.md` (queued for
the human). Verdict: ship real, engine sound, no src/ criticals; the debt is
Plan A's A5 reconciliation (PRD still describes shipped systems as unbuilt —
2 criticals) + two plan-named test guards that never landed. Review only — no
fixes applied.

## What changed

- `project/audit/reports/2026-07-09-storywave-post-ship-review.md` — NEW: the
  consolidated review (verdict · B1–B8 build findings · D1–D8 docs findings ·
  deliberate gaps · verified-sound record · ranked next actions).
- `project/todo-human.md` — reading-queue line for the report.
- `project/journal/2026-07-09-session-133-storywave-post-ship-review.md` —
  this entry.

## Method (for reproducibility)

Four independent Opus subagents over the current tree, each judging against
the plans' own DoD + the bible (PH2): engine correctness (src/core,
src/persistence) · content-vs-bible fidelity (incl. t0v2 VERDICT redline
spot-checks) · docs/PRD ripple (Plan A A0–A5 claims) · test discipline
(RED-ability, derived fixtures). Orchestrator independently re-ran
`pnpm run verify` (17/17 green, 60.8s) + `pnpm run prd:drift` (CLEAN) and
resolved one cross-agent contradiction by grep (`satoyama`: nodes GONE from
the built map; PRD/guides still describe them as current — the docs agent had
called those hits "correct current usage", wrongly).

## Headline findings (detail in the report)

- **B1 MAJOR:** "O-Sato" player-visible ×4 in `src/ui/map-sheets/nodes.ts`
  (→ O-Hisa); the `72f7e24` zero-hit sweep never grepped that token.
- **B2/B3 MAJOR:** night-round FALL skips the ADR-164 carried-loss bleed
  (deferred "while dormant", registry now live); its coin-freedom test is
  registry-blind so a future coin reward stays green.
- **D1/D2 CRITICAL (docs):** PRD §2.2 still ships the "28-day derived clock"
  as-built text; `02-systems.md:1297` marks four shipped T0 systems "not yet
  built". A5's `prd:drift`-clean claim was true but the gate structurally
  can't see this class (D7 proposes RETIRED-term hardening).
- **D3 MAJOR:** the old 7-node satoyama map still described as current across
  five PRD sections + `ui-design.md` + `qa-playtesting.md`'s `goto()` roster.
- Plan-named `season.test.ts` never created; `advance_season` gating is
  UI-only and the Autumn nengu "gate" is auto-reckoned, not refusing (recorded
  plan divergence, functionally sound).

## Next intended steps

1. Human reads the report; then (on their go): fix B1 (mechanical), run the
   A5-completion docs sitting (D1–D6), fold B2+B3, harden prd-drift (D7).
2. The T2 rungs+fog plan remains the startable build workstream.

## Landmines

- The four raw agent reports live only in this session — the committed report
  is the durable record (subagent transcripts are never copied, per the raw/
  README rule).
- Verify wall-time is now ~61s (vitest-dominated); AGENTS.md's "under 5s"
  gate prose is stale (finding D8) — don't "fix" the timer, fix the prose.

---

## Addendum (same session) — the spirit pass + the closure plan

The human asked two follow-ups: (1) a second Opus pass on whether the src/
rewrite honors the bible's SPIRIT or is shortcut-ridden; (2) a detailed plan
to finish the work cleanly.

**Spirit pass (2 more Opus agents):** verdict "faithful-but-shallow — a real
rewrite, not a facade (~82% done-properly), but the ambient half of the
bible's T0 is authored-and-dark": 4/5 side-beats unreachable, the minor cast
mute (~40 dialogue lines undispatched), the log-texture layer (40+ keys)
unemitted, the 3 named discoveries absent, the wolf-flees line silent, night
rounds don't grow, the grade ladder 4-step vs ADR-159's six. Findings
appended to the review report ("Second pass" section). Three raw agent
claims corrected by direct grep before recording (round count; label flip
works; grade ladder confirmed).

**Closure plan authored:**
`docs/plans/fable-2026-07-09-storywave-closure.md` — C0 (pre-flight +
HD-31 nengu-semantics fork + HD-32 fiction-wave ask) · C1 (build fixes
B1–B7) · C2 (finish A5: D1–D8) · C3 (prd-drift RETIRED-term hardening w/
RED-proof) · C4 (switch the written world on: wire side-beats, cast
dialogue, texture emitter, wolf line, wrong-things single-source, six-step
grades, round growth, legacy-intro retirement) · C5 (the ADR-139 fiction
wave, human-gated + the owed ADR-132 balance re-baseline w/ the 24
telemetry reports). Queued for the human. NOT started — awaiting the read.

## Next intended steps (updated)

1. Human reads the closure plan (+ the report's second-pass section);
   rules HD-31/HD-32 when filed at C0.
2. On the go-ahead: execute C0→C3 (Opus-routed per the plan), then C4;
   C5a/C5b as ruled.
