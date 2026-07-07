// Emergent node discoveries (ADR-146 / the emergent-node-actions plan). A map node is not a
// fixed menu of chores — it reveals itself the longer you pay attention. Each DiscoveryDef is
// one hidden thing a node can grow: today an ACTIVITY (the plan's Phase 1–2 unit; people/rumors
// are later phases). Hiddenness is DERIVED (TST1): an activity is hidden iff it is some
// discovery's `reveals` target whose id is not yet latched in `state.discovered` — no duplicate
// `hidden:` flag to drift. All fiction text here (hints, the discovery line) is ADR-139
// diverge-picked canon — alternates live DEV-only until the human signs the bundle.

import type { MapNodeId } from './map';
import type { ActivityId } from './activities';

export type DiscoveryId = string;

/** How a hidden discovery is FOUND (the plan's Phase-2 trigger types 3 + 4; rumors are Phase 3). */
export type DiscoveryTrigger =
  /** Repeat-action unlock: each attempt of `activity` AT the discovery's node rolls the seeded
   *  chance (with the pity ramp — persistence pays without a hard wall). */
  | { readonly kind: 'watch'; readonly activity: ActivityId; readonly chance: number }
  /** The stumble: each arrival at the node rolls the seeded chance outright. */
  | { readonly kind: 'visit'; readonly chance: number };

export interface DiscoveryDef {
  readonly id: DiscoveryId;
  /** The node that grows this discovery (attempts + hints + the reveal are all node-local). */
  readonly node: MapNodeId;
  /** The hidden ACTIVITY this discovery unlocks — absent from the node's action list until the
   *  latch (derived hiddenness; see `hiddenActivityIds`). */
  readonly reveals: ActivityId;
  readonly trigger: DiscoveryTrigger;
  /** The TIGHTENING hint ladder (ADR-146 / ADR-116): hints[floor(attempts/DISCOVERY_HINT_STEP)],
   *  clamped to the last line. Rendered INSIDE the node's standing description — diegetic node
   *  flavour, never a banner or a counter (P15: the map doesn't spoil). Empty = no hint. */
  readonly hints: readonly string[];
  /** The diegetic log line pushed at the latch moment (narrator voice, permanent — the beat that
   *  says the world grew; never "NEW ACTION!"). */
  readonly discoveryLine: string;
  /** Rumor-routing tag (ADR-146 §5, Phase 3): a rumor targets a TAG, never a node id. Unused
   *  until portable rumors build. */
  readonly tag?: string;
}

/** The authored registry. Content lands via the ADR-139 narrative diverge (the plan's Phase 2);
 *  the engine (`src/core/discovery.ts`) is registry-driven so tests inject fixtures. */
export const DISCOVERIES: readonly DiscoveryDef[] = [];

export function getDiscovery(id: DiscoveryId): DiscoveryDef {
  const d = DISCOVERIES.find((x) => x.id === id);
  if (!d) throw new Error(`unknown discovery: ${id}`);
  return d;
}
