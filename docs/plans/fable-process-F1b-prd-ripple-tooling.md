# PRD ripple tooling — partial automation now (D-117 Phase 0)

**Status: 📋 PROPOSED — awaiting human read; Ph1 BUILT 2026-07-03**
(autonomously — report-only, touches no canon; Ph2–Ph4 await your read).

> **Ph1 build notes (2026-07-03).** `prd:drift` is live (`npm run
> prd:drift`; `--strict` exits 1 — currently RED on real data). Day-one
> findings: **19 presence gaps** — §3 still carries the pre-reshape rung
> titles (6/8 missing), §4's T0 weapon roster diverges from the build
> (built: carrying-pole + **woodlot axe** + forged yari; PRD: carrying-pole
> + yari + **kama-yari**), 4/8 mobs and the 3 stance ids unmentioned, and
> the 3 rung-beat cast names absent (expected — the cast awaits your R8
> read). **One DoD deviation, deliberate:** the "fix one gap in a follow-up
> ripple commit" clause was NOT executed for the presence gaps — every one
> sits in territory the T0 compression sweep (D-117) will rewrite, so
> hand-rippling now double-pays; the punch-list IS the sweep's backlog,
> now quantified. What DID get fixed on day one: the retired-terms
> tripwire **false-fired on its first run** (on §2's real-name denylist —
> the one line where retired names belong) and was calibrated with a
> documented-rename allowance (a hit line naming the successor is not
> drift). A11 in action, worth keeping.

The buildable-NOW slice of **D-117** (the frontier PRD). The T0 compression
sweep itself stays human-gated on R1 closing — nothing here jumps that gate.
This plan automates what can be sound **today**: detecting game→PRD fact
drift mechanically, making a first pilot slice of the PRD drift-*proof*, and
encoding the D-117 flows as skills so the procedure fires from muscle memory
instead of ADR archaeology.

## Who builds this — Fable or Opus?

**Confidence: ( 85% Opus, 15% Fable )** — Ph1 is already built (by Fable);
the 15%: the pilot gen-region edits PRD canon — Fable eyes on that diff.

**Opus 4.8 — all four phases.** The drift reporter and region splicer are
deterministic tooling against explicit DoDs; the two skills transcribe
procedures already written and human-locked in the brainstorm
(`project/brainstorms/2026-07-03-prd-on-a-diet.md`, Flows 1–2). No new
judgment is spent here. The one judgment-dense job in this territory — the
T0 compression sweep the `/prd-compress` skill will one day drive — is
**Fable work**, and the skill file says so; but *authoring* the skill is
transcription, not the sweep itself.

## What can and cannot be automated (the honest cut)

- **Cannot automate:** writing PRD prose from a code change (semantic — the
  agent's job, guided by Flow 1), and the compression sweep (human-signed
  per D-117/Q3). No tool here pretends otherwise.
- **Can automate now:**
  1. **Detection** — the game's facts already live in typed registries that
     `gen-docs.ts` exports to `docs/content/*.md`. A `prd:drift` reporter
     can diff those facts against PRD prose and emit the ripple punch-list
     that today is assembled by hand-sweeps and audits.
  2. **Prevention (pilot)** — the gen-region machinery (markers +
     `--check`, the `gen-docs` pattern) can transclude a first derivable
     fact slice into the PRD so that class of drift becomes impossible,
     not just detected.
  3. **Procedure** — `/prd-ripple` and `/prd-compress` skills encode Flow 1
     (what gets written where, per change class) and Flow 2 (the sweep),
     so the D-117 rules outlive this week's context.

## 1 · `prd:drift` — the fact-drift reporter (Ph1)

`src/scripts/prd-drift.ts`, on-demand (`npm run prd:drift`). Two checks,
both one-directional (game → PRD) so the frontier can never false-fire —
an unbuilt §5 T3 beat is *supposed* to be absent from the build:

- **Presence check.** Every entity in the **spec-altitude registries**
  (RANKS rung names, WEAPONS, MOBS, MAP_NODES, SKILLS, STANCE_ORDER, the
  NAMES cast) must be mentioned (case-insensitive, macron-exact display
  name) somewhere in `docs/living/prd/*.md`. **Informational registries**
  (MATERIALS, MARKET_ITEMS, BELONGINGS, RECIPES — beneath spec altitude;
  the PRD doesn't name every mushroom) are listed in the report but never
  counted as drift.
- **Retired-terms tripwire.** A small config list in the script (term +
  the ADR that retired it, e.g. the `E#` purchase-ladder → `U#` D-098
  rename, koku-as-currency phrasing → D-107 standing): any hit inside
  `docs/living/prd/` only (the ADR log legitimately quotes old names) is
  drift by definition. *Not a new tracker* (per the no-new-maintained-files
  norm): it's tool config — an entry is added in the same commit as the
  rename ADR and deleted once the compression sweep clears it.

**Rung (A11 — never cry wolf):** prose matching is heuristic → `prd:drift`
is a **report**, never a verify gate. It runs on demand, inside the
`/prd-ripple` skill, and as a **loud pre-commit WARN** only when a staged
commit touches `src/core/content/*` without touching `docs/living/prd/`
(same shape as the balance-sim plan's `--check-fresh` warn). The
retired-terms tripwire alone is sound enough to promote to a verify gate
later — start WARN, promote after a clean soak (the D-054/checkpoint-plan
promotion pattern).

## 2 · Gen-regions in the PRD — pilot only (Ph2)

The splicer module (`src/scripts/gen-regions.ts`: fenced
`<!-- gen:begin/end -->` markers, byte-idempotent write + `--check`) is
**shared infrastructure** — built ONCE by the mechanical-checkpoint plan's
Phase 1 (the shared **F1 build lane**: one builder, checkpoint first, then
this plan's remainder — `fable-process-master-plan.md` merge #1); this
plan's Ph2 **imports it, never re-writes it**.

**Deliberately pilot-scale before R1 closes:** D-117 says compressed canon
is human-signed, so bulk transclusion waits for the sweep. Ph2 lands ONE
region as proof: the **§3 T0 rung ladder names** (R0–R7 titles from
`RANKS` — shipped, played, and stable through every re-core; the least
contestable build==end-state fact). Numbers (thresholds) are NOT
transcluded — they're provisional per D-021 and §4 is already
ripple-frozen behind its banner. The region's `--check` joins `verify`
(sound: same class as `gen-docs --check`, milliseconds, fits the 5 s
parallel budget). The pilot diff is filed to the reading queue — it edits
canon, so the human sees it.

## 3 · The two skills (Ph3–Ph4)

- **`/prd-ripple`** (`.claude/skills/prd-ripple/SKILL.md`) — invoked after
  any built-system design change (and referenced from the AGENTS.md
  conventions): classify the change per **Flow 1** — balance magnitude →
  NO PRD edit (§4 frozen); built-territory system/narrative → targeted
  PRD ripple, ADR for the why; intent-level → stop, human + ADR; frontier
  design → edit the fat sections freely. Then run `prd:drift` and clear
  what the change staled. The punch-list replaces memory.
- **`/prd-compress`** (`.claude/skills/prd-compress/SKILL.md`) — dormant
  until a tier's taste review closes; encodes **Flow 2** verbatim: draft
  the per-tier sweep (surgical subsection edits across §2–§6; intent +
  acceptance criteria + pointers; gen-regions where sound), archive the
  fat text verbatim to `project/archive/`, file the reel-back plan +
  R-item, land only on human approval. Header states the routing: **the
  sweep is Fable work**; the skill exists so the procedure is one
  invocation away the day R1 closes, regardless of which session is live.

## 4 · Phases + DoDs

- **Ph1 — `prd:drift`.** Reporter + npm script + the pre-commit WARN.
  *DoD (R3):* the report **rediscovers at least one real, verifiable gap
  on day one** (found while building, fixed in a follow-up ripple commit
  that the report then shows clean); a temp fake registry entry turns the
  presence check RED (could-go-RED proof); zero drift claimed against any
  frontier-only content.
- **Ph2 — splicer + pilot region.** `gen-regions.ts` (+ unit tests:
  idempotent, preserves-outside-markers, missing-marker hard error), the
  §3 rung-names region, `--check` in `verify` (13th gate or folded into
  `gen:docs` — builder's call), pilot diff queued for the human.
  *DoD:* editing a rung title in `RANKS` without regenerating goes RED;
  regenerating fixes it; `verify:budget` median still under 5 s.
- **Ph3 — `/prd-ripple`.** Skill + AGENTS.md conventions pointer + one
  REAL invocation on the next built-system change (the proof is a commit
  whose ripple was punch-list-driven).
- **Ph4 — `/prd-compress`.** Skill file (procedure + Fable routing +
  "waits on the tier's R-item closing" guard). *DoD:* a dry-run against a
  COPY of one §3 subsection in `tmp/` produces a plausible compressed
  draft + archive file — rehearsal only, nothing lands in canon.

## 5 · Risks / open questions (defaults — bias to motion)

1. **Display-name matching is brittle** (inflections, plural forms).
   *Default:* exact display-name substring, case-insensitive; misses are
   fine — it's a report, and a false miss just means one hand-check.
2. **Registry entries legitimately beneath PRD altitude** creep into the
   spec-altitude set. *Default:* the two-tier split above; moving a
   registry between tiers is a one-line, reviewable edit.
3. **Module ownership collision** with the mechanical-checkpoint plan.
   *Resolved (`fable-process-master-plan.md` merge #1, 2026-07-03):* the
   checkpoint plan builds `gen-regions.ts` first in the shared F1 lane;
   this plan's Ph2 imports it, never re-writes it.
4. **Does the pilot region pre-empt the human-signed sweep?** *Default:*
   no — one region of already-shipped names, filed as a queued diff; bulk
   transclusion explicitly waits for `/prd-compress` + R1.

---

*Committing note: new `docs/plans/*.md` → add to `project/todo-human.md`'s
reading queue in the same commit (pre-commit gate).*
