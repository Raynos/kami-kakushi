# Session 156 — 2026-07-10 — lock estate/tracker diverge picks, park redesign

**Summary:** The human locked two Estate-tab diverge picks *"for now"* — **V0A ·
estate-a** (Estate section, HR-9) and **V1A · tracker-a** (Build tracker, HR-11)
— while flagging that *"the whole estate section and upgrades needs a lot of love
and thought."* Both picks were already the shipped defaults, so prod is unchanged
and no code was touched; the DEV alternates are KEPT as reference (not stripped)
because a redesign will likely supersede them. Recorded the picks, archived the
two HR-items as interim, and parked the redesign direction as a durable note.
**Then (same session, model switched to Fable 5):** the human pulled the parked
note forward — "turn it into a plan" — so the brainstorm + the estate feedback
corpus (FB-338, FB-342 pending in r1; FB-274, FB-157, HR-16, HD-34/ADR-172 as
standing record) became
`docs/plans/fable-2026-07-10-estate-upgrades-redesign.md` (Phase-0
direction-lock first; queued for the human's read).

## What changed
- `project/human-in-the-loop/review.md` — removed the HR-9 + HR-11 open blocks,
  left a resolved-note pointing to the archive + the redesign brainstorm.
- `project/human-in-the-loop/archive.md` — two new Reviews rows (HR-9 estate-a,
  HR-11 tracker-a) marked INTERIM, alternates kept.
- `project/brainstorms/2026-07-10-estate-upgrades-redesign.md` — NEW: the
  redesign direction + seeded open questions (grounded in the current estate
  section / tracker / `ESTATE_STAGES` upgrade ladder).
- `project/BACKLOG.md` — new `## T0` row parking the estate/upgrades redesign.

## Next intended steps
1. None forced — the redesign is parked (human-owned "thought"). Pull forward
   when the human wants the design pass; likely pulls in the HR-16 E1 cutaway.

## Landmines
- V-tag mapping: V0A/V1A are per-SURFACE registry-index tags (`V{i}{letter}`,
  `src/ui/dev.ts:2247`); SURFACES[0]=estate-section, [1]=build-tracker. Both
  variant A = `variants[0]` = the existing prod default, so "locking A" was a
  no-op in the prod bundle.
- Did NOT strip the DEV alternates (estate-b/c, tracker-b/c) despite the pick —
  deliberate, per the human's "for now" + redesign flag. Normal ADR-075 flow
  would strip; here we keep them as reference until the redesign lands.

---

## 2 · The redesign plan (same session, Fable 5 after a mid-session /model)

The human: _"this brainstorm estate upgrades redesign and all feedback related
to it in the playtest inbox, turn it into a plan."_

**Corpus gathered:** swept `playtest-inbox/pending/` (r1.md carries FB-338 —
the "no story context for the estate section / who told you about the weirs"
question — and FB-342 — weir walkable in R1) + the archive/drain logs (FB-274:
the panel-estate reveal line struck, "I need to think harder about the Estate
section TBH") + the standing record (FB-157 border soup, HR-16 E1 cutaway
parked, HD-34/ADR-172 deed re-tune). Grounded against
`src/core/content/estate.ts` (U1–U4 ladder, deed gates `[0,90,220,380]`, U1
un-gated + affordable in R1) and the Estate-tab pane anatomy in `render.ts`.

**What changed (part 2):**
- `docs/plans/fable-2026-07-10-estate-upgrades-redesign.md` — NEW: the plan.
  Diagnosis (fiction/TST3 · anatomy/TST1 · upgrades/PH5), then Step 0 (FB-342
  triage) → Phase 0 (direction lock, five forks F1–F5, human-owned) → Phase 1
  (ADR-139 fiction repair) → Phase 2 (ADR-075 full surface diverge, retires
  the interim V0A/V1A variants on sign-off) → Phase 3 (ADR-132 economy pass,
  scope per F3). Routing section: Fable-leaning for Phases 1–2.
- `project/todo-human.md` — plan added to the reading queue (gate).
- `project/BACKLOG.md` — the T0 estate row REMOVED (pulled forward; BACKLOG
  never points at plans).
- `project/brainstorms/2026-07-10-estate-upgrades-redesign.md` — status struck
  → forward pointer to the plan (seed record kept).

**Landmines (part 2):**
- FB-338/FB-342 sidecars NOT stamped — they still belong to the r1 drain lane
  (ADR-171); the plan's Step 0 says whoever triages FB-342 claims/coordinates.
- The plan is gated on its own Phase 0: no estate build work should start from
  it until the human rules the F1–F5 forks (ADR to be logged then).

---

## 3 · Phase 0 CLOSED — the direction lock ran in-session (→ ADR-177)

The human asked to be run through all the plan's open questions via
AskUserQuestion. Three rounds + a rung-by-rung tab dossier later, every fork
is ruled — **ADR-177** — and the plan's Status flips to DIRECTION LOCKED
(build phases startable). The short form: upgrades leave Estate 家 for a NEW
**Works 普請** tab; every project is cause-gated (ledger names → you walk →
NPC beats; weir locked until named, first repairs in the three R1 zones);
upgrades become repair verbs + inputs; one-tab-per-rung adopted as **Schedule
A** (R0 Work · R1 Map alone · R2 Character+Works · R3 Combat alone · R4
Inventory · R5 Quests · R6 Estate 家 · R7 —); the E1 cutaway folds into
Estate 家.

**What changed (part 3):**
- `docs/living/decisions.md` — **ADR-177** appended (waited out the co-agent's
  uncommitted ADR-176 in the same file before touching it).
- `project/feedback-human/2026-07-10-estate-phase0-rulings.md` — NEW: the
  verbatim rulings record.
- `docs/plans/fable-2026-07-10-estate-upgrades-redesign.md` — Status →
  DIRECTION LOCKED; signed **Direction** section (Schedule A table); Step 0
  re-scoped (FB-342 resolved by ruling → Phase-1 wiring); Phase 2 rewritten as
  IA-reshuffle + two surface diverges; Phase 3 concretised to the F3 ruling.
- `project/todo-human.md` — the plan's reading-queue entry cleared (engaged
  in-session — the human walked every question; ADR-089 implicit sign-off).
- `project/status/project-status.md` — resume line updated (plan startable).

**Landmines (part 3):**
- ADR-176 (landed mid-session) makes pre-push run the FULL vitest lane — a
  co-agent's uncommitted `src/ui/map-variants/sheet-map.ts` throws
  `svg.getScreenCTM is not a function` under jsdom in that lane, so a push
  from this shared tree may be RED through no fault of these docs. Not my
  file, not my red — leave commits local if it trips (working-agreements).
- The snapshot's rewrite-debt counter hits **20/20** with this session's edit
  — a full fresh rewrite of `project-status.md` is now OWED, but three
  co-agents have live WIP whose state a rewrite would have to describe;
  deferred to the next quiet moment, explicitly noted here so it isn't lost.
