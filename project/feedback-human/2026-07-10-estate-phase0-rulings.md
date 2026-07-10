# Estate redesign — Phase-0 direction lock (rulings, 2026-07-10)

The human ran the estate plan's Phase-0 sitting in-session (AskUserQuestion,
three rounds + an info dossier). Every fork of
[`docs/plans/fable-2026-07-10-estate-upgrades-redesign.md`](../../docs/plans/fable-2026-07-10-estate-upgrades-redesign.md)
is now ruled. Logged as **ADR-177** (decisions.md; appended once the co-agent's
ADR-176 landed); this file carries the verbatim intent, the plan's Direction
section the signed schedule.

## Rulings

1. **F1 · Reveal timing — cause-gated, NOT R1; one-tab-per-rung adopted.**
   Verbatim: _"Either R1, cause-gated or R2, cause-gated, it has to be cause
   gated and I cant tell if its R1 or R2; we don't need it in R1 at all we
   already revealed the map which is a huge amount of new feature unlock, we
   should do a quick list / audit of new tabs unlocked per rung and see how to
   space it out (one new tab of the UI per rung would be really clutch)."_
   The audit ran in-session; on the follow-up: _"IA-spacing decides, if we
   have to double we have to double. but we should roll it into the plan we
   have… just come up with the spacing plan right now."_
2. **The IA — Schedule A signed** (after the rung dossier): _"I think A is the
   best, fine to put Character & works on the same."_
   **R0 Work · R1 Map 地図 (alone) · R2 Character + Works 普請 (double,
   cause-gated) · R3 Combat (alone) · R4 Inventory · R5 Quests 用 ·
   R6 Estate 家 · R7 — (Phase 2 fills Works).**
3. **F2 · Cause — ledger names → you walk, PLUS an NPC beat per project.**
   Verbatim: _"1 & 4; I like that idea a lot."_ (option 1 = the day-book/lease
   names the concern, seeing the zone unlocks the work; option 4 = each
   project introduced by its own dialogue beat.)
4. **F3 · Depth — repair verbs + inputs.** The recommended option picked
   as-is: projects become WORK (zone/act requirements + material inputs; coin
   demoted from sole gate). Full ADR-132 sim pass owed when built.
5. **F4 · Home — estate-as-anchor + economy split + the upgrades LEAVE
   "Estate".** Verbatim: _"Remember the E1 prototype, it's going to fold into
   the Estate tab. I mean honestly, maybe 'Estate' is the wrong word for
   upgrades, the whole upgrades section might need a different tab name then
   Estate, maybe the pillars still fundamentally belong on the 'Estate' tab.
   but the upgrade feature can go to a different tab, like 'Base' or something
   else (come up with 5-10 ideas lol)."_
6. **The tab name — Works 普請** (picked from a 10-name field; fushin, the
   period construction/repair-works term).
7. **F5 · E1 cutaway — folds into the Estate 家 tab** (the R6 macro
   house-view anchor; HR-16's "needs more work" iteration happens as part of
   that fold-in).
8. **Weir node / FB-342 — locked until named**, plus a design nudge:
   verbatim: _"Locked until named, but also we can redesign the WORKS /
   REPAIR / ESTATE feature. If the weirs zone is locked, then it can be some
   kind of WORKS/REPAIR in the 3 zones unlocked in R1."_ → the first Works
   projects live in the three R1 zones (gate · home paddies · woodshed); the
   weir zone unlocks when the day-book names it.

## Consequences (owned by the plan's build phases)

- The upgrades feature moves out of Estate 家 into the NEW **Works 普請** tab
  (arrives R2, cause-gated, doubling with Character).
- Estate 家 keeps the pillars/influence + gains the E1 cutaway; the TAB moves
  R1 → R6 (arriving as the house-rooms physically reopen). The influence
  teaser's pre-R6 home is a plan detail (currently shows R3).
- Inventory moves R3 → R4 (`panel-home` re-keys off `tab-combat`).
- Project-per-zone pacing (presented in the dossier, foundation of A): later
  projects land as their fiction-zones open — orchard ~R5 (U2), granary ~R6
  (U3), study ~R7 (U4).
- FB-342's Step 0 changes from "triage" to "wire the weir node's reveal to
  the cause chain"; FB-338/FB-342's r1-lane sidecars still owe their drain
  stamps (unclaimed here).
