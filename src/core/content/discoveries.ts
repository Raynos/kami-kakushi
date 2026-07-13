// Emergent node discoveries (ADR-146 / the emergent-node-actions plan). A map node is not a
// fixed menu of chores — it reveals itself the longer you pay attention. Each DiscoveryDef is
// one hidden thing a node can grow: today an ACTIVITY (the plan's Phase 1–2 unit; people/rumors
// are later phases). Hiddenness is DERIVED (TST1): an activity is hidden iff it is some
// discovery's `reveals` target whose id is not yet latched in `state.discovered` — no duplicate
// `hidden:` flag to drift. All fiction text here (hints, the discovery line) is ADR-139
// diverge-picked canon — alternates live DEV-only until the human signs the bundle.

import { storyText } from './story-overlay';
import type { MapNodeId } from './map';
import type { ActivityId } from './activities';
import { FLAVOR } from './flavor.gen';

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
   *  latch (derived hiddenness; see `hiddenActivityIds`). OPTIONAL since C5a: a SEED-ONLY
   *  discovery (the sett under the ruined wall) latches its find into `state.discovered` and
   *  its line into the log — the payoff is a later tier's, not a new verb. */
  readonly reveals?: ActivityId;
  readonly trigger: DiscoveryTrigger;
  /** The roll FLOOR (human feel-verdict, 2026-07-07 — "rare ambient"): the first `minAttempts`
   *  qualifying acts only count, no roll fires — a discovery can never pop instantly and the
   *  hint ladder gets a real arc. The pity ramp counts attempts BEYOND the floor. Absent = 0
   *  (roll from the first attempt — fixture-test friendly). */
  readonly minAttempts?: number;
  /** The TIGHTENING hint ladder (ADR-146 / ADR-116): hints[floor(attempts/DISCOVERY_HINT_STEP)],
   *  clamped to the last line. Rendered INSIDE the node's standing description — diegetic node
   *  flavour, never a banner or a counter (P15: the map doesn't spoil). Empty = no hint. */
  readonly hints: readonly string[];
  /** The diegetic log line pushed at the latch moment (narrator voice, permanent — the beat that
   *  says the world grew; never "NEW ACTION!"). */
  readonly discoveryLine: string;
  /** The `## prose flavor` keys behind `hints` (same order) — the DEV story switcher's live-swap
   *  handle (`dev.subFlavor` at render). Canon entries set these; test fixtures may omit. A
   *  content test pins FLAVOR[hintKeys[i]] === hints[i] so the pair can't drift (TST1). */
  readonly hintKeys?: readonly string[];
  /** The flavor key behind `discoveryLine` — swapped at EMIT time through the core overlay
   *  (`__setDiscoveryFlavorOverride`, the req-flavor declaring-module pattern), since the line
   *  is core-emitted log text. */
  readonly lineKey?: string;
  /** Rumor-routing tag (ADR-146 §5, Phase 3): a rumor targets a TAG, never a node id. Unused
   *  until portable rumors build. */
  readonly tag?: string;
}

/** The authored registry (the engine in `src/core/discovery.ts` is registry-driven, so tests
 *  inject fixtures). Fiction text is the ADR-139 diverge-picked canon, single-sourced from
 *  `narrative/flavor.md` via the generated FLAVOR registry — key and text are pinned in sync
 *  by a content test. */
export const DISCOVERIES: readonly DiscoveryDef[] = [
  {
    // The woodlot lacquer tree (ADR-146's first discoverable): repeated woodcutting at the
    // stables/woodlot node surfaces a coin-paying tapping action. RARE AMBIENT (human,
    // 2026-07-07): no roll for the first 15 cuts, then 1% gently pity-ramped (balance.ts
    // DISCOVERY_PITY_*) — a many-visits background surprise, typically ~50+ cuts in.
    id: 'disc-woodlot-lacquer',
    node: 'woodlot',
    reveals: 'tap_lacquer',
    trigger: { kind: 'watch', activity: 'woodcut_edge', chance: 0.01 },
    minAttempts: 15,
    hints: [FLAVOR.lacquerHint0, FLAVOR.lacquerHint1, FLAVOR.lacquerHint2],
    hintKeys: ['lacquerHint0', 'lacquerHint1', 'lacquerHint2'],
    discoveryLine: FLAVOR.lacquerFound,
    lineKey: 'lacquerFound',
    tag: 'lacquer', // ADR-146 §5 — the Phase-3 rumor-routing handle
  },
  {
    // C5a — the reeds bundle (tiers/t0.md, locked): his own washed-up bundle with the
    // water-ruined paper — a MYSTERY SEED (T3 pays it), found working the weir. Reveals
    // the reed-wading forage verb. RARE AMBIENT like the lacquer (chances sim-owned).
    id: 'disc-weir-bundle',
    node: 'weir',
    reveals: 'search_reeds',
    trigger: { kind: 'visit', chance: 0.02 },
    minAttempts: 8,
    hints: [FLAVOR.reedsHint0, FLAVOR.reedsHint1, FLAVOR.reedsHint2],
    hintKeys: ['reedsHint0', 'reedsHint1', 'reedsHint2'],
    discoveryLine: FLAVOR.reedsFound,
    lineKey: 'reedsFound',
    tag: 'reeds-bundle',
  },
  {
    // C5a — the silted sluice (tiers/t0.md: "the silted sluice the field-work keeps
    // hinting at"): an old water-gate under the woodlot trees, choked; clearing it is
    // labour the estate forgot it had. Surfaces through the woodlot's own work.
    id: 'disc-woodlot-sluice',
    node: 'woodlot',
    reveals: 'clear_sluice',
    trigger: { kind: 'watch', activity: 'forage_satoyama', chance: 0.015 },
    minAttempts: 10,
    hints: [FLAVOR.sluiceHint0, FLAVOR.sluiceHint1, FLAVOR.sluiceHint2],
    hintKeys: ['sluiceHint0', 'sluiceHint1', 'sluiceHint2'],
    discoveryLine: FLAVOR.sluiceFound,
    lineKey: 'sluiceFound',
    tag: 'sluice',
  },
  {
    // C5a — the sett under the ruined wall (tiers/t0.md: "a way in that nobody official
    // knows exists"). SEED-ONLY (no `reveals`): the find latches + logs; the payoff is
    // T2's. The digging stops at the stones.
    id: 'disc-margins-sett',
    node: 'field-margins',
    trigger: { kind: 'visit', chance: 0.02 },
    minAttempts: 8,
    hints: [FLAVOR.settHint0, FLAVOR.settHint1, FLAVOR.settHint2],
    hintKeys: ['settHint0', 'settHint1', 'settHint2'],
    discoveryLine: FLAVOR.settFound,
    lineKey: 'settFound',
    tag: 'sett',
  },
];

export function getDiscovery(id: DiscoveryId): DiscoveryDef {
  const d = DISCOVERIES.find((x) => x.id === id);
  if (!d) throw new Error(`unknown discovery: ${id}`);
  return d;
}

/** The line a latch should emit — the active take's if one targets this def's lineKey
 *  (step B, session-200: the ONE story overlay replaced the per-concern setter), else
 *  the authored canon line. The ONE read discoveryPass uses. */
export function discoveryEmitLine(def: DiscoveryDef): string {
  if (def.lineKey !== undefined) {
    const over = storyText(`flavor.${def.lineKey}`);
    if (over !== undefined) return over;
  }
  return def.discoveryLine;
}
