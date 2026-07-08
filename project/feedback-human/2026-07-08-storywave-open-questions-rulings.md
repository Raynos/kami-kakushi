# Storywave open-question rulings (human, 2026-07-08)

The human read the two storywave plans
(`docs/plans/fable-2026-07-07-storywave-docs.md` — Plan A/DOCS;
`fable-2026-07-07-storywave-game.md` — Plan B/GAME) and ruled on the four
human-owned open questions in a review session. Recorded here so the
rulings survive compaction; the A0 milestone transcribes them as the
resolved HD-items (HD-25…HD-28) it files.

The remaining forks (docs HD-29; game-plan open questions #1–#13) keep
their recommended defaults — the plans proceed on them (PH4).

## The rulings

### HD-26 · v1 scope — RULED: default (a), full T0–T3
v1 stays "through the Region tier": Estate-household → Estate-land →
Valley → Region, same label, new canon. The T5 Domain insertion sits
ABOVE the v1 line, so the lock's intent is undisturbed. No renumbering.

### HD-25 · four-pillar model — RULED: **(c) keep pillars as mechanics** — REOPENS CANON
The human explicitly did NOT take the recommended default (supersede).
Verbatim: *"I really like the idea of pillars, we can change the 4
pillars, but I really like the idea of ranking the house's standing in
terms of different pillars and giving players autonomy in how deep they
go into each pillar."*

**What this means:** the tier-up / house-standing engine is
PILLAR-STRUCTURED — house standing is measured across several pillars,
and the player has autonomy in how deep they push each. The specific set
of pillars is open ("we can change the 4 pillars").

**Why it reopens canon:** the bible's `tiers/t0.md` "The tier-up
(locked)" is a pure standing/deeds-graded-at-season-exits engine with no
pillar structure; option (c) contradicts it, so the bible's tier-up
section is superseded by this steer (ADR-022: newest human intent is
canon). This is a legitimate human canon change — but it needs the
pillar MODEL pinned down before ADR-159 (docket #8), the bible tier-up
section, and PRD §1.6 can be written to it.

**Likely synthesis (to confirm with the human):** ADR-145 already ships
a FOUR deed-source structure — fields · stores · works · watch. The
pillar-structured standing engine can unify: those deed sources ARE the
pillars; house standing accrues per-pillar; the player chooses depth per
pillar; tier-up gates on standing across them. Much of this is already
in the build (ADR-145's `accrueDeed`/`ESTATE_STAGES`), so the reopening
may be more "reconcile the bible's tier-up prose + give depth-autonomy"
than a from-scratch redesign. Design detail still to lock (see below).

**Downstream (once the pillar model is locked):**
- Bible: edit `tiers/t0.md` "The tier-up" + `03-tiers.md` (human-gated).
- Plan A: ADR-159 (docket #8) redrafts to the pillar-structured engine;
  PRD §1.6/§1.6.3 rewrites to it (A2.2), roadmap spine + DoDs follow.
- Plan B: G4.6 estate/ascension + G4.2 `deedSource` mapping align to the
  confirmed pillars.

### HD-27 · village name — RULED: **keep "Asagiri"** (NOT the default) — DONE
The human took option (b): the T2 village stays named Asagiri.
**Canon addition APPLIED 2026-07-08** (human-instructed direct edit):
the valley village is named **Asagiri (朝霧, "morning mist")** in
`docs/story-bible/tiers/t2.md` ("The village cast" naming callout) and
`docs/story-bible/03-tiers.md` (T2 overview intro). Consequences for the
plans: `asagiri` does NOT go into Plan B's RETIRED terms; §5.6 drops the
"Asagiri → unnamed" ledger row; A1/A2 rewritten text keeps the name; the
T2 tier sheet + tiers overview are the canon source.

### HD-29 · parked T1 capstone-branch plan — RULED: **(b) adopt-partial**
The human took option (b), NOT the default (supersede). Verbatim intent:
*"rework the plan, we still want that R7 capstone but the capstone can be
rewritten; it should still have really meaningful content based on a real
decision, forking and choice."* So: KEEP a meaningful T0→T1 capstone
BRANCH (a real mechanical fork/choice, per the PRD's ADR-121 "capstone
carries a mechanically-distinct branch"), but REWRITE its content against
the new canon (`tiers/t1.md`) — the old-canon R8–R15 / Shigemasa
devoted-ambitious-humble beat is void. Action: un-archive
`docs/plans/t1/opus-2026-07-03-t1-capstone-branch.md`, add a Status line
"rework against tiers/t1.md — keep a real forking capstone choice", and
rework when T1's build opens (not now). No other A-milestone changes.

### HD-28 · bible README banner flip — RULED: (a) agent applies
The docs executor may re-point the one stale README sentence (to
"narrative sources + generated `docs/content/t0-story.md`; PRD §5 is its
pointer-and-summary") once §5 lands — a blessed transcription, the §S
read-only exception the human explicitly authorized.

## Open thread — lock the pillar model before baking it
The pillar model (HD-25) is the one ruling that isn't ready to transcribe
into ADRs/canon as-is. Next step: pin the pillar set + the depth-autonomy
mechanic (grill / brainstorm), then edit the bible + redraft ADR-159 +
ripple PRD §1.6. Until then, Plan A's A0 files HD-25 as "ruled (c) —
pillar model pending design lock" rather than proceeding on a default.
