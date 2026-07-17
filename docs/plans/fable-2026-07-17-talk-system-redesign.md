# Rebuild talking: state-derived asks + authored beats (FB-415)

**Status:** ▶️ IN-PROGRESS — steps 1–5 built & shipped (2026-07-18,
session 210 — 9e2dff3c · 353fdacf · 10c00d0f · e8afaac4; ADR-200);
only the authored waves remain. The
engine, the `## ask` grammar + R0–R2 seed, the three-variant surface
(HR-45, A ships), the D8 re-homing (talk_to retired, full-T0 floor
proven), and the D6 freshness are all live. **REMAINING, queued
here: the per-person ADR-139 ask-answer waves** — upgrade the
placeholder labels/answers (each `-word` person-ask + the D2 seed
asks) bundle by bundle in the Story switcher; discovery-hint asks
join per wave. The FIRST wave also wires ask units into
`narrative/takes.ts` (the overlay hook `ask.<id>.<line-id>` is live;
only the bundle-grammar side is missing — journal s210 §3). Pick
this plan up to run a wave.

**Rulings (human, 2026-07-18 — pre-build Q&A):**
- **Routing:** all five steps build in the Fable session (no Opus
  subagents for 1–2).
- **Step-4 gate:** fires after the agent's diverge SELF-PICK
  (ADR-075 non-blocking); alternates stay behind the DEV toggle for
  the human's override.
- **Defaults accepted** (ask counts 1–3 · Kihei/Naoyuki beats-placed
  only) **with a scope ruling: NOTHING breaks at any rung.** Talking
  exists at every rung of T0 today, so EVERYTHING ports to the new
  system — later rungs get their content filled (re-homed lines
  and/or placeholder asks), never a dead Speak button. The old
  "engine ships with only the R0–R2 seed" fallback is void where it
  would leave a rung broken.
- **Variant (c):** let it emerge during the diverge; no pre-shape.
**Confidence:** ( 40% Opus, 60% Fable ) — the core ask engine is
mechanical; the ask answers, variant look, and beat re-homing are
fiction + taste.
**Template:** build

## Who builds this — Fable or Opus?

- **Steps 1–2 (core engine + authoring pipeline): Opus-capable.**
  Pure-core selectors, save-schema plumbing, gen:narrative grammar
  extension — mechanical, test-driven, judgment is thin.
- **Steps 3–5 (surface diverge, ask ANSWERS, migration triage):
  Fable.** Every answer is fiction-voiced (ADR-139 takes), the diverge
  variants carry the taste risk, and re-homing each existing line
  (ask / beat / cut) is a per-line editorial call.
- Subagents inherit the parent model (D-124); the human routes any
  exception.

## Why

FB-415 (playtest capture, 2026-07-13; ledgered in
`project/feedback-human/2026-07-17-playtest-r0.md`): _"Characters are
a button and you get a random low context line… pressing A to speak
and you get nothing just some flavor text. That the flavor text goes
into the 'Story' panel."_ The human called for a deep dive; the grill
ran 2026-07-17 and settled eight decisions (D1–D8 in
`project/brainstorms/2026-07-17-talk-system-redesign.md`):

1. Talking = **info + story beats** (D1): everyday asks answer from
   live state; authored beats own the drama.
2. Payload: **house wants · body & mend · discovery hints** (D2);
   market talk stays at the stall (TST1).
3. The surface shape is an **ADR-075 diverge** (D3).
4. Info renders **inline only**; story beats alone write to Story
   (D4).
5. Cast: **everyone present**, presence rung-scoped — a sparse
   person × rung ask matrix (D5; human steer, 2026-07-17: presence at
   R5 does not imply presence at R1).
6. **State-driven refresh + newness mark**; exhausted asks dim (D6).
7. Asks are **free** (D7). 8. **Re-home ALL existing lines** (D8).

## What exists today

Survey 2026-07-17 at `60101d92` (all paths read this session):

- `src/ui/render/map.ts:100-165` — `buildPersonRow`/`patchPersonRow`:
  the who's-here row (seal + name + tell + one Speak button). `vn`
  depth dispatches `talk_to`; `small`/`tiny` toggle greeting/wares.
- `src/core/intents.ts:158,1619` — the `talk_to` intent: delivers the
  person's next gate-satisfied authored line into the **Story log**
  (C4.2 cursor). This is the press-A dispenser being retired.
- `src/core/content/people.ts` — 13-person roster (genemon, kihei,
  soan, ohisa, shinnosuke, toku, naoyuki, yohei[tiny], oyae, matsuzo,
  iori, oume, rokusuke), most `vn`-depth, each with `area` + presence
  handled by the who's-here present/away split (FB-408).
- `src/core/content/narrative/` — the FB-5 pipeline: `dialogue.md`
  grammar already supports `when:` gates + per-NPC `regard` memory;
  `gen:narrative` compiles to `*.gen.ts` registries. Asks extend THIS,
  not a new system.
- `src/core/talk.test.ts` — the existing talk contract tests (will be
  rewritten with the intent).
- Log channels: Now/Story/Progress/Chat/Combat/Work
  (`log-filter`) — the inline-only rule means asks touch NONE of them.

Reusable: the person row (mount point), the dialogue grammar + gates,
the presence split, VOICE_COLOR/seals. Replaced: the `talk_to` cursor
and its "conversation stays open" label flip.

## Steps

Order: core before surface (the diverge needs real asks to render);
migration last (nothing half-dead mid-plan).

1. **Core ask engine (pure core, TDD).** New `src/core/asks.ts`:
   ask defs (id · person · rung window · availability predicate ·
   answer source) + an `availableAsks(state, personId)` selector
   (AC-6: the same selector feeds the surface and the reducer).
   Heard-state (`asksHeard`) in the save (schema bump + migration +
   an old-save-opens test). `ask` intent replaces `talk_to`'s
   everyday path; answers return data, emit NO log entry.
2. **Authoring pipeline.** Extend the narrative markdown grammar with
   an `## ask` def (person · rung window · when-gate · label ·
   answer) in `src/core/content/narrative/`; `gen:narrative` compiles
   to the ask registry. Seed the sparse matrix: R0–R2 asks for the
   people actually present there (Genemon, Sōan, Yohei-non-market,
   whoever the presence map says), 1–3 asks each; later rungs fill as
   authored waves (ADR-139 bundles, one bundle per person or per
   domain — coherent, never 25 atomized calls). **Full-T0 floor
   (human ruling, 2026-07-18): every person×rung that has talk today
   still has working talk after the port** — later rungs are covered
   by the step-4 re-homed lines and, where a gap remains, placeholder
   asks; the authored-wave upgrades then replace placeholders, they
   don't create coverage.
3. **Surface diverge (ADR-075, FULL).** 2–3 WORKING variants spanning
   the settled range, DEV-toggle switchable, taste-scorecard Pass 1
   first: (a) **in-row asks** — the person row expands into ask
   plates; (b) **VN-lite panel** — a framed exchange (greeting + asks
   inside a speech surface); (c) hybrid if a distinct third emerges.
   Newness mark on the row + dimmed exhausted asks are SHARED
   mechanics, not variant-specific. Self-pick a default; per-variant
   HR item; zero prod flag-debt.
4. **Re-home the existing lines (D8).** Every current C4.2 line per
   person: becomes an ask answer, graduates to an authored story beat
   (the only talk that writes to Story), or is cut. Retire the
   `talk_to` cursor + "Ask X more" label flip; `talk.test.ts`
   rewritten to the new contract.
5. **Freshness wiring (D6).** The newness mark derives from
   `availableAsks` unheard-count; refresh is purely state-driven
   (rung, works, health, season — no timers). Exhausted asks dim but
   stay pressable.

## Verification

- **Unit (could go RED):** `asks.test.ts` — the selector's rung
  windows derive from `RUNG_LADDER`/rank data, never literals; heard
  asks survive save→load (migration test with a pre-bump blob); an
  `ask` dispatch leaves the log UNCHANGED (asserts the D4 inline-only
  rule); the newness count drops when an ask is heard and rises when
  state moves a window.
- **e2e (journey touch):** press an ask → the answer renders in the
  talk surface; the Story tab's entry count is unchanged; the newness
  mark clears.
- **Player-reach (PH6):** live drive on the dev server (`:5264`) —
  load the FB-415 capture's save (`r0/2026-07-13T11-29-54.json`),
  speak with Genemon, capture before/after screenshots into
  `project/audit/screens/`; each diverge variant reviewed IN the DEV
  panel (ADR-075), story bundles in the Story switcher (ADR-139).
- Full `pnpm run verify` green per commit; fixtures regen if the
  schema bump touches them (`fixtures` gate).

## Sync ripple

- **PRD:** the people/talk description (ADR-114 vendors-as-people
  section) describes the C4.2 cursor — targeted ripple via
  `/prd-ripple` when the diverge pick ships (system change → ADR +
  edit); not before (the PRD tracks the SHIPPED game, ADR-168).
- **Story-bible:** `04-cast` gains the presence-by-rung matrix (D5) as
  it gets authored — per ask-wave, not upfront.
- **Living docs / registries:** `gen:narrative` registries + the ask
  registry are generated (never hand-edited); roadmap gets the slice
  line when the plan is picked up; no balance movement (asks are free,
  D7 — no ADR-132 run).
- **CHANGELOG:** the version that ships the new talk system carries
  the section; none now.

## Human-in-the-loop

- **HR (new): the surface diverge pick** — per-variant rows behind the
  DEV Review tab (`talk` surface id), filed at step 3.
- **HR (new, per bundle): ask-answer bundles** (ADR-139) — 3+ takes
  per unit, reviewed live in the Story switcher; alternates DEV-only
  until sign-off.
- **Open, with defaults (never blocking):** exact ask counts per
  person/rung — default 1–3, presence-driven; whether Kihei/Naoyuki
  presence shifts want authoring now — default: only where beats
  already place them.
- FB-415's sidecar is stamped `done` → this plan; the r0 bucket
  archives with it.

## Non-goals

- **No relationship/favor lever** (D1) — parked as a T1+ candidate in
  the brainstorm's parking lot.
- **No market talk in asks** (D2) — the stall + HR-44 bundle own it
  (TST1).
- **No new characters** — the 13-person roster carries T0.
- **No Chat-tab echo** (D4 rejected option) — inline only.

## Risks

- **Seam (shared tree, 2026-07-17):** a live co-agent (`w8:p1`,
  status "vn-modal") is working VN-adjacent UI. This plan owns
  `src/core/asks.ts`, `src/ui/render/map.ts` (person row), the new
  variant modules, and `talk.test.ts`; the VN-lite variant borrows VN
  *idiom* but must NOT edit the VN scene modules — if the modal work
  lands first, reuse its primitives; coordinate via herdr before step
  3 starts.
- **Save-schema bump** (heard-state): migration is tested (step 1),
  but no standing gate proves old saves open (known gap, BACKLOG) —
  the plan's migration test is the local answer.
- **Authoring volume:** 13 people × 8 rungs is a trap; the sparse
  matrix + per-bundle waves (step 2) cap it. If a wave stalls, the
  engine still ships with the R0–R2 seed **plus the full re-homed
  line coverage — the 2026-07-18 ruling: partial authoring is fine,
  a broken rung is not** (PH1 bounded by the full-T0 floor above).
- **Rollback:** steps 1–2 are additive (registry + selector, old
  cursor intact until step 4); the point of no return is step 4's
  re-homing — do it after the diverge pick, not before.
