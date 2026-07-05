# Session 79 — 2026-07-05 — F8 plan lock: decisions + the delivery-loop reframe

**Summary:** The human read the F8 real-play-telemetry plan with me
(Fable 5) and locked every open question via AskUserQuestion; the plan is
now 🔧 IN PROGRESS with a decisions block, a redirected Ph4, and a
"who consumes this" reframe. Build (Ph1→Ph4) starts next session-chunk,
autonomous, commit per phase.

## Decisions locked (recorded in the plan header)

- **Idle TTL is TWO-TIER** — 5 min autos-armed / **2 min static** (deviates
  from the plan's flat 5-min default; new `IDLE_TTL_STATIC_MS`).
- Note re-engage: keep, 30 s. Blur: exclude always. Micro-gaps: no merge
  in v1. History: keep across new-game. Human data never gates.
- **Ph4 redirected** — telemetry reports do NOT go to the playtest inbox
  (F3). They drop into **git-ignored `project/telemetry/`** (committed
  README only): local sensor data agents read when talking pacing, never
  repo history.

## The zoom-out (the human pushed on "what is this even for")

The primary consumer is **the next agent touching a balance number**, not
the human reading a panel. Agents are session-goldfish → the data must sit
on paths they already walk. Locked delivery loop, now Ph4's spec:
**folder** (git-ignored drop) + **signpost** (a step in the D-132 balance
flow in qa-playtesting.md §2 + an AGENTS.md line) + **morning shout**
(session-brief.sh prints report-count newer than the last balance commit)
+ **diary rule** (raw = local-only; conclusions distilled into committed
notes with numbers quoted — the brainstorms/raw two-tier pattern).

## What changed

- `docs/plans/fable-process-F8-play-telemetry.md` — Status → IN PROGRESS;
  human-decisions block; §0 "who consumes this" reframe; Ph4 rewritten
  (strikethrough supersede) with the four-piece delivery loop + DoD.
- `project/todo-human.md` — F8 line cleared from the reading queue (D-089:
  read + decided in-session). *Left uncommitted here* — the hunk is
  entangled with another agent's F10 edit; it rides the next checkpoint.

## Next intended steps

1. Ph1: `src/telemetry/` pure sessionizer + milestones + report + §4 unit
   suite (5/20/5 = exactly 600 000 ms headline; two-tier TTL cases added).
2. Ph2: DOM shell, localStorage ring, main.ts DEV wiring, `__qa.telemetry`,
   strip teeth (`__KAMI_TELEMETRY__` in gh-pages grep) + headless proof.
3. Ph3: minimal DEV-panel Telemetry section + docs.
4. Ph4: the delivery loop above.

## Landmines

- Plan's main.ts line anchors drifted (dispatch 194→214, commit 185→205,
  autoStep guard 239→260) — semantic anchors all still valid.
- Shared tree is busy (F9/F10 sessions live): stage own paths only;
  `todo-human.md` currently carries a mixed-authorship hunk.
- The two-tier TTL means the sessionizer's walked-away retro-split must
  pick the TTL by the autos-armed state *at the last input* — a test case
  the original plan doesn't list; add it in Ph1.

---

## 2 · Ph1 built — the pure sessionizer, unit-proven

`src/telemetry/{sessionizer,milestones,report}.ts` + 28 tests, all green,
full `verify` green (17 gates). The 5/20/5 headline asserts exactly
600 000 ms; RED-proven by flattening the two-tier TTL (3 tests fail).
Semantics settled during the build (each with a test):

- **TTL by CURRENT autos-armed state during the gap** (not at-last-input):
  an auto-stop mid-gap drops the span to the static TTL — the grind you
  were watching has ended. Deadline clamped to `lastEventT` so credit
  legitimately accrued under the armed TTL is never clawed back.
- **Sleep-gap beats idle-ttl** on total event silence (no heartbeats =
  frozen tab = nothing verifiable to credit; close at last sign of life).
- **A segment opens only on input/intent while visible+focused** —
  attention is proven by acting; becoming visible alone opens nothing
  (matches §2.2's class definitions).
- Loss detector is best-effort (hp → SETBACK_HP from above), commented as
  such; disarm emits the `note` the re-engage rule consumes;
  promotion-ready note derives from `rungThreshold` (D-086 rule 2).
