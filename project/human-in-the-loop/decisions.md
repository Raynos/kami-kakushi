# Decisions & questions (HD-items)

**Open** design forks and questions only the human can close. IDs `HD-1…Hn`, never reused.
Status: 🔲 open · ⏳ waiting on Claude prep. (Closed items move to the archive — see below.)
`⛔ blocks <task>` marks a blocker.

> **Rung-tagged (2026-07-09)** — like [`review.md`](review.md), an open HD-item carries a
> `[rung]` tag (or `[cross-cutting]`) for the rung it concerns, so decisions track a
> rung-by-rung pass. _(Currently no open decisions — see below.)_

## Lifecycle (where a resolved HD-item goes)

1. The human answers (inline or in chat); mark it ✅ with the verdict.
2. **Graduate it:** a decision future-us needs the *rationale* for becomes an **ADR** in
   [`../../docs/living/decisions.md`](../../docs/living/decisions.md). A purely **mechanical / structural**
   item (e.g. a file split) skips the ADR — recording a no-op as an ADR only dilutes the log.
3. **Archive it:** add a one-line row to [`archive.md`](archive.md) (H# → ADR + date + intent link) and
   **remove it from this file** so this list stays open-items-only (it's what the session-brief hook scrapes).
4. Capture verbatim intent in [`../feedback-human/`](../feedback-human) and apply the decision to code/docs.

> Closed HD-items: [`archive.md`](archive.md). The ADR log (the durable "why"):
> [`../../docs/living/decisions.md`](../../docs/living/decisions.md).

---

<!-- Format:
### HD-1 🔲 — {short title}
- **Question / fork:** {what needs deciding}
- **Options:** {A / B / C}
- **Recommendation:** {your best inference}
- **Resolution:** {filled in when the human answers — then graduate + archive per the lifecycle}
-->

### HD-35 🔲 [R3–R6 · pacing] — restore the R3–R6 per-rung band verdicts (the last ADR-148-interim scope)

- **Question / fork:** ADR-170 lifted the ADR-148-interim ratio-gate suspension, but
  the per-rung band verdict still covers only R0–R2 (`ADR148_INTERIM_BAND_RUNGS`).
  Restoring R3–R6 today REDs on **R3**: its ADR-148 *timed* wall measures
  ~146–221 min across seeds vs the signed [3, 22] band — greedy's night-watch rung
  is ~10× over in real wall terms (R4–R6 sit in band at ~10–14 min). Either R3's
  design (the night round, the ~379-move walk pattern, timed move costs) gets
  re-paced, or the band re-signs a per-rung exception for R3, or the R3 wall is
  accepted as intentional (the tier's one long "act").
- **Options:** (a) re-pace R3 into the band · (b) re-sign the band/an R3 exception ·
  (c) sign R3-as-intentional and restore the verdicts for R4–R6 only.
- **Recommendation:** feel R3 on the live build first (it's also the rung your own
  telemetry will speak to loudest) — then rule; the scope note in
  `src/sim/envelopes.ts` names this item and deletes with it.
- **Resolution:** _(open)_

### HD-36 🔲 [R7 · story canon] — Munemasa speaks on-screen in T0, against the synced canon

- **Question / fork:** two shipped R7 house-standing flavor lines
  (`src/core/content/narrative/requirements.md:240,250` → compiled into
  `requirements.gen.ts`) have `{lord}` = Munemasa speaking — "says from the
  veranda" — while the freshly-synced canon says he is "a voice through a
  wall, **never met in T0**; his one scene is T1's capstone"
  (`story-bible/tiers/t0.md:177`, `04-cast.md:188`, `prd/05-narrative.md:47`).
  The source's G4.1 flag deferred these pre-reboot lines to a re-derivation
  pass under HD-30 — but HD-30 closed 2026-07-09 (RUN & BUILT, HR-17) without
  touching them, so the contradiction is now uncovered (found by the s141
  src-vs-PRD verification sweep; report:
  `project/audit/reports/2026-07-10-prd-truth-sync-src-verification.md`).
- **Options:** (a) re-derive the two lines via narrative-diverge (ADR-139) so
  the R7 beat lands without staging the lord — canon holds · (b) amend the
  bible: Munemasa may be *heard* (still unseen) at the R7 threshold, his
  first *scene* stays T1 — lines stay · (c) accept as-is.
- **Recommendation:** **(a)** — the bible is the human-signed canon, and
  "from the veranda" stages him *visually*, which even (b) can't absorb; two
  flavor lines are a cheap ADR-139 unit. Whoever executes should also repoint
  the stale "(HD-30)" flag at `requirements.md:24` to this item.
- **Resolution:** _(open)_

### HD-37 🔲 [R0 · cold open] — re-open the C4.9 cold-open fusion (the human saw a better one)

- **Question / fork:** the human, playing the live v0.4.0 cold open
  (2026-07-10, FB-223): _"The cold open changed, completely, the Memory
  section is gone, the discussion with genemon is gone, the ability to choose
  3 perks is gone"_ — and on the FB-223 answer (the change is the deliberate
  C4.9 storywave fusion): _"I want to really re-open that, I saw a cold open
  that was better then what we have right now."_ The pre-C4.9 intro (three
  scenes: the memory/dream beat · Sōan's sickroom · Genemon's grain-store,
  one perk pick EACH — three picks total) lives in git history; C4.9 fused it
  to the single take-a sickroom scene with one pick-of-three.
- **What re-opens:** which elements return (the memory/dream beat? the
  standalone Genemon scene? the three sequential perk picks?), and whether
  the return is a restore, a hybrid (take-a's prose + the old structure), or
  a fresh diverge (ADR-139 takes over the whole cold-open arc).
- **Constraint:** intent-level (ADR-022 — newest steer wins over the C4.9
  ADRs); the storywave's take-a prose is human-verdicted, so any hybrid
  should keep its redlined lines where they survive the restructure.
- **Resolution:** ✅ RULED (human, 2026-07-10, in-session): restore ALL THREE
  elements, as a **hybrid + fresh diverge** — the take-a sickroom prose stays
  as the middle act; the dream + Genemon acts return via narrative-diverge
  (ADR-139), seeded by the pre-C4.9 fiction (`b221d6e~1`). Plan:
  [`docs/plans/t0/fable-2026-07-10-cold-open-rearc.md`](../../docs/plans/t0/fable-2026-07-10-cold-open-rearc.md).
  Graduates to an ADR when the plan lands.

