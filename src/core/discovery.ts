// The emergent-node-discovery engine (ADR-146 / the emergent-node-actions plan, Phase 1).
// The reveal engine at finer grain: a per-(node, activity) latch whose trigger is DISCOVERY
// (repeat attempts or a visit stumble, rolled on the one seeded RNG's 'discovery' stream)
// rather than a rung or a build. Mirrors unlock.ts: writes latch once into the ordered
// `state.discovered`; reads are pure projections, never a re-roll.
//
// Every function takes the registry as a defaulted last parameter so tests inject fixture
// defs and stay RED-able against the real engine (never a copied magic outcome).

import type { GameState } from './state';
import type { MapNodeId } from './content/map';
import { pushLog } from './log';
import { nextChance } from './rng';
import {
  DISCOVERIES,
  discoveryEmitLine,
  type DiscoveryDef,
  type DiscoveryId,
} from './content/discoveries';
import { DISCOVERY_PITY_NUM, DISCOVERY_PITY_DEN, DISCOVERY_HINT_STEP } from './content/balance';

/** The reduce-time event a discovery trigger can match (fed by intents.ts). */
export type DiscoveryEvent =
  | { readonly kind: 'activity'; readonly activityId: string }
  | { readonly kind: 'visit' };

export function isDiscovered(state: GameState, id: DiscoveryId): boolean {
  return state.discovered.includes(id);
}

/** Activity ids currently HIDDEN — the reveals-targets of not-yet-latched discoveries (derived
 *  hiddenness, TST1: no duplicate flag). Selectors subtract these from a node's action list. */
export function hiddenActivityIds(
  state: GameState,
  defs: readonly DiscoveryDef[] = DISCOVERIES,
): ReadonlySet<string> {
  const hidden = new Set<string>();
  for (const d of defs) {
    if (!state.discovered.includes(d.id)) hidden.add(d.reveals);
  }
  return hidden;
}

/** The pity-ramped effective chance (integer fixed-point ramp, clamped to 1): persistence pays
 *  without a hard wall — attempt N rolls at chance·(DEN + N·NUM)/DEN. Exported so the tests
 *  assert the design LEVER (monotonic ramp), not a collapsed outcome. */
export function effectiveChance(base: number, attempts: number): number {
  const eff = (base * (DISCOVERY_PITY_DEN + attempts * DISCOVERY_PITY_NUM)) / DISCOVERY_PITY_DEN;
  return Math.min(1, eff);
}

/** Does this event, at this location, qualify as an attempt on this (undiscovered) def? */
function matches(def: DiscoveryDef, location: MapNodeId, event: DiscoveryEvent): boolean {
  if (def.node !== location) return false;
  if (def.trigger.kind === 'watch')
    return event.kind === 'activity' && event.activityId === def.trigger.activity;
  return event.kind === 'visit';
}

/**
 * The discovery pass — run by reduce after a qualifying act (do_activity, move_to). For each
 * undiscovered discovery at the current node whose trigger matches: bump its attempt counter,
 * roll the seeded 'discovery' stream at the pity-ramped chance, and on success LATCH it (write
 * once, permanent — ADR-146) + push its diegetic discovery line (narrator, permanent: the beat
 * that says the world grew). Deterministic under a fixed seed (the roll rides the cursor).
 */
export function discoveryPass(
  state: GameState,
  event: DiscoveryEvent,
  defs: readonly DiscoveryDef[] = DISCOVERIES,
): GameState {
  let next = state;
  for (const d of defs) {
    if (next.discovered.includes(d.id)) continue;
    if (!matches(d, next.location, event)) continue;
    const attempts = next.discoveryProgress[d.id] ?? 0;
    const [found, rng] = nextChance(
      next.rng,
      'discovery',
      effectiveChance(d.trigger.chance, attempts),
    );
    next = {
      ...next,
      rng,
      discoveryProgress: { ...next.discoveryProgress, [d.id]: attempts + 1 },
    };
    if (found) {
      next = {
        ...next,
        discovered: [...next.discovered, d.id],
        // discoveryEmitLine, not d.discoveryLine: the DEV story switcher overlays takes on
        // FUTURE emissions (ADR-143); canon everywhere else.
        log: pushLog(next.log, 'narration', discoveryEmitLine(d), next.clock.tick, {
          voice: 'narrator',
        }),
      };
    }
  }
  return next;
}

/** A standing hint: the canon text plus (for canon content) the `## prose flavor` key the
 *  renderer live-swaps through `dev.subFlavor` (ADR-143). */
export interface NodeHint {
  readonly text: string;
  readonly key?: string;
}

/** The node's CURRENT hint line (ADR-146 tightening hints), or null. First undiscovered
 *  discovery at the node (registry order) with an authored ladder; the line sharpens every
 *  DISCOVERY_HINT_STEP attempts, clamped to the ladder's last rung. Rendered inside the node
 *  description (diegetic — P15), never as a counter. */
export function nodeHint(
  state: GameState,
  node: MapNodeId,
  defs: readonly DiscoveryDef[] = DISCOVERIES,
): NodeHint | null {
  for (const d of defs) {
    if (d.node !== node || d.hints.length === 0) continue;
    if (state.discovered.includes(d.id)) continue;
    const attempts = state.discoveryProgress[d.id] ?? 0;
    const idx = Math.min(Math.floor(attempts / DISCOVERY_HINT_STEP), d.hints.length - 1);
    const key = d.hintKeys?.[idx];
    return key === undefined ? { text: d.hints[idx]! } : { text: d.hints[idx]!, key };
  }
  return null;
}
