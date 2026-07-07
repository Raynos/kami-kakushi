# Emergent node discovery — the extensions (DEFERRED to T1+)

**Status: 📌 PARKED — build once T1 content exists to route into.**
*(Authored 2026-07-07, lifted verbatim from `project/BACKLOG.md`'s T1
section into a durable plan doc so the parked scope isn't a stale
BACKLOG pointer. The **shipped** core system is ADR-146 — its plan is
archived at `project/archive/opus-2026-07-03-emergent-node-actions.md`;
PRD spec at §2.6(g) + §2.13(f) + §2.6.1. This doc holds only the
FUTURE-scope extensions, all human-signed intent, none built.)*

> **⏳ DEFERRED — do NOT build yet.** The discovery *engine* ships (watch-
> trigger + visit-stumble triggers built + tested); what waits is the
> *content and routing* that only pays off once there are several tagged
> discoverables and T1 nodes to route between. Building the rumor web now
> would be unreachable scaffolding (**R6 / PH6**).

## Who builds this — Fable or Opus?

Mixed, split by phase — proposed for the human to approve at build time
(routing is not self-serve; ADR-124):

- **Phase 1 (More discoverables — content):** each find is one `DiscoveryDef`
  + an **ADR-139 narrative diverge** for its reveal text. The *takes* are
  fiction-voiced → **Fable** per the narrative-diverge norm; the `DiscoveryDef`
  wiring is trivial code either model can do.
- **Phase 2 (Portable rumors — engine):** tag-routing logic in the pure core
  (never a hand-authored A→B web) — judgment-dense engine work → **Opus**.
- **Phase 3 (People-reveals — engine):** growing the who's-here set via the
  ADR-114/115 growable people list → **Opus**.

Doubt favors the deeper-judgment tier per phase; the human confirms when the
build actually opens.

## The extensions (human-signed intent 2026-07-07)

### Phase 1 · More discoverables
Additional watch-trigger finds on other nodes, and the first **visit-stumble**
content (that trigger's engine is built + tested, zero content). Each is cheap:
one `DiscoveryDef` + an ADR-139 take diverge. Pacing template: the rare-ambient
**lacquer** tune — a floor probability + a ~1% ramp (the shipped woodlot lacquer
tree, PRD §2.6 line ~356, is the reference instance).

### Phase 2 · Portable rumors (was the ADR-146 plan's Phase 3)
An overheard rumor at node A unlocks / hints a **tagged** discovery *anywhere* —
**tag-routed**, never a hand-authored A→B web. The engine's `tag:` handle
already ships (first tag `lacquer`; PRD §2.13(f), §2.6(g)). A person at node A —
or a picked-up rumor item — carries a **discovery TAG**; the routing resolves it
to whichever discoverable wears that tag. **Build once several tagged
discoverables exist to route into** (so Phase 1 seeds this).

### Phase 3 · People-reveals
Discovery grows the *who's-here* set, not just the action set — ADR-114/115 make
the people list growable. A person who turns out reachable once you've paid
attention (watched / returned), surfaced the same way a new action is.

## Dependencies & sequencing
- Phase 1 first — it creates the tagged discoverables Phase 2 routes between.
- Phase 2 (portable rumors) needs T1 nodes + Phase-1 tags to be non-trivial.
- The **T2 inn rumours board** (PRD §2.13) is a natural *source* for Phase-2
  rumor pointers once it lands — parked separately in `project/BACKLOG.md` (T2).

_(Re-homed from `project/BACKLOG.md` 2026-07-07 after ADR-146 Phases 0–2 shipped
+ HR-14 closed; this doc is the durable form of that parked scope.)_
