# Backlog — deferred work, parked by the human

> Work deliberately pulled OUT of the active surfaces: not in flight (that's
> `docs/plans/` + the live snapshot), not awaiting a read (that's
> [`todo-human.md`](todo-human.md)'s reading queue — the session brief nags
> that list, never this one). An item moves back out when the human pulls it
> forward. The underlying plan/doc files stay where they live.
> Organized by the **tier the work lands in** (human, 2026-07-07).

## T0

- [ ] `docs/plans/opus-2026-07-04-phase2-economy-redesign.md` — **T0 Phase-2
  economy redesign** (the REAL fix ADR-133 queued after the stopgap hotfix):
  makes T0 Phase 2 a ~1:1, ~40–83-min *fun* chunk instead of a
  threshold-inflated slog. **DESIGN-DIVERGENT** — proposes 3 distinct loops
  (multi-deed grind · staged estate-BUILD beats · light allocation layer;
  recommends the A+B hybrid). **Two open direction calls need the human:**
  literal 1:1 (T0 → ~2.8 h) vs. rebalance a ~90-min split, and which loop
  ships. Read to pick the loop + the split → then Phase-0 diverge starts.
  _(Backlogged from the reading queue 2026-07-05. NOTE: **ADR-145**
  (2026-07-07) has since decided both calls — A+B hybrid at literal 1:1 —
  and the build is underway; this entry stands only as the pointer until
  that plan archives.)_
- [ ] `docs/plans/fable-2026-07-05-requirements-rung-progression.md` —
  **requirements-based rung progression** (FB-121 → grilled 2026-07-05 → ADR
  ADR-137): the plan for the direction you locked live — points model fully
  deleted; hidden anything-goes requirements per rung; rounded-% bar (5–10
  chunk updates); flavor line per completion; 100% alone unlocks the rung
  beat; FB-5 markdown authoring; bands re-derive; all R0–R7. Read to confirm
  the 7 phases + sequencing before the build starts.
  _(Backlogged from the reading queue 2026-07-06.)_

## T1

- [ ] **Emergent node discovery — the extensions** (the built system's future
  scope; the shipped part is ADR-146, plan archived at
  `project/archive/opus-2026-07-03-emergent-node-actions.md`, PRD spec at
  §2.6(g) + §2.13(f)):
  - **Portable rumors (the plan's Phase 3):** an overheard rumor at node A
    unlocks/hints a tagged discovery anywhere — **tag-routed** (never a
    hand-authored A→B web; the engine's `tag:` handle already ships, first
    tag `lacquer`). Human-signed intent 2026-07-07; build once several tagged
    discoverables exist to route into.
  - **More discoverables:** additional watch-trigger finds on other nodes, and
    the first **visit-stumble** content (that trigger's engine is built +
    tested, zero content). Each is cheap now: one `DiscoveryDef` + an ADR-139
    take diverge. Pacing template: the rare-ambient lacquer tune (floor +
    ~1% ramped).
  - **People-reveals:** discovery grows the *who's-here* set, not just the
    action set (ADR-114/115 make the people list growable) — a person who
    turns out reachable once you've paid attention.
  _(Re-parked 2026-07-07 after Phases 0–2 shipped + HR-14 closed.)_

## T2

- [ ] **Inn rumours board as a discovery-rumor source** — when the village
  inn + rumours board reveal (PRD §2.13, T2), the board becomes a natural
  SOURCE for the tag-routed discovery rumors above (§2.13(f)): a posted
  rumour can carry a discovery tag alongside its yokai one-shots. Depends on
  the T1 rumor engine landing first.
