// The walkable T0 estate node-graph (DoD T0-M4-F4 / D-065 / NQ-3): the estate is
// areas you MOVE BETWEEN, not a menu. MINIMAL here — a hard MAP_NODE_CEILING pins the
// T0 node-count so the graph stays a hamlet you can hold in your head; it GROWS in T1.
// Pure data + pure helpers (no DOM, no RNG): the nodes mirror content/areas.ts, and
// each node's `revealFlag` is the EXISTING room-unlock surface id (content/surfaces.ts)
// so a node inks in on the SAME beat its room does (the separate-reveal rule, canon §I).
// Immutable-in/immutable-out; the caller passes a plain `revealed` set so this wires in
// LATER against GameState.unlocked without this module depending on GameState.

export type MapNodeId = string;

export interface MapNode {
  readonly id: MapNodeId;
  readonly label: string;
  readonly kanji?: string;
  readonly blurb: string;
  /** Adjacent nodes (symmetric: if A lists B, B lists A — verified by the test). */
  readonly neighbors: readonly MapNodeId[];
  /** The surface/flag that must be in `revealed` before this node is walkable; an
   *  undefined flag means always-open (the cold-open kura). Reuses the content/surfaces
   *  room-unlock ids so no NEW flags are needed to gate the map. */
  readonly revealFlag?: string;
  /** A danger ring — the first edge of the wild, gated in T0 by conditioning (§4.4). */
  readonly dangerRing?: boolean;
}

/** Hard T0 node-count ceiling (D-065 minimal-here): MAP_NODES.length must stay <= this.
 *  Room for one more node before T1 explodes the graph; the test enforces the bound. */
export const MAP_NODE_CEILING = 7;

export const MAP_NODES: readonly MapNode[] = [
  {
    id: 'kura',
    label: 'The grain-store (kura)',
    kanji: '蔵',
    blurb: 'The grain-store where you woke — dark, dry, close with the smell of old rice.',
    neighbors: ['gate-forecourt'],
    // No revealFlag: the cold open opens here; the kura is always walkable.
  },
  {
    id: 'gate-forecourt',
    label: 'Gate & forecourt',
    kanji: '門前',
    blurb: 'The estate gate and its swept forecourt — the ground the whole house turns on.',
    neighbors: ['kura', 'home-paddies', 'woodlot-edge', 'drill-yard'],
    revealFlag: 'room-gate-forecourt',
  },
  {
    id: 'home-paddies',
    label: 'Home paddies',
    kanji: '田圃',
    blurb: 'Terraced paddies stepping down the slope — the rice that keeps the house fed.',
    neighbors: ['gate-forecourt', 'near-satoyama'],
    revealFlag: 'room-home-paddies',
  },
  {
    id: 'woodlot-edge',
    label: 'Stables & woodlot edge',
    kanji: '杣',
    blurb: 'The stable yard giving onto the woodlot, and the road that leaves the valley.',
    neighbors: ['gate-forecourt', 'near-satoyama'],
    revealFlag: 'room-woodlot-edge',
  },
  {
    id: 'near-satoyama',
    label: 'Near satoyama',
    kanji: '里山',
    blurb:
      'The managed hill-forest above the estate — sansai to gather, and the first teeth of the wild.',
    neighbors: ['home-paddies', 'woodlot-edge'],
    revealFlag: 'room-near-satoyama',
    dangerRing: true,
  },
  {
    id: 'drill-yard',
    label: 'Drill yard',
    kanji: '稽古場',
    blurb: 'The cleared yard off the forecourt where the house keeps its hand at arms.',
    neighbors: ['gate-forecourt'],
    revealFlag: 'panel-drill-yard',
  },
];

export const MAP_NODE_IDS: ReadonlySet<string> = new Set(MAP_NODES.map((n) => n.id));

const NODE_BY_ID: ReadonlyMap<MapNodeId, MapNode> = new Map(MAP_NODES.map((n) => [n.id, n]));

function findNode(id: MapNodeId): MapNode | undefined {
  return NODE_BY_ID.get(id);
}

export function getNode(id: MapNodeId): MapNode {
  const node = findNode(id);
  if (!node) throw new Error(`unknown map node: ${id}`);
  return node;
}

/** A node is reachable once its revealFlag is in `revealed` (or it has none). */
function isRevealed(node: MapNode, revealed: ReadonlySet<string>): boolean {
  return node.revealFlag === undefined || revealed.has(node.revealFlag);
}

/** PURE: may you step from `from` to `to`? Adjacent AND the target is revealed.
 *  Total + safe — unknown endpoints simply return false (never throws). */
export function canMove(from: MapNodeId, to: MapNodeId, revealed: ReadonlySet<string>): boolean {
  const fromNode = findNode(from);
  const toNode = findNode(to);
  if (!fromNode || !toNode) return false;
  if (!fromNode.neighbors.includes(to)) return false;
  return isRevealed(toNode, revealed);
}

/** The neighbours you may actually step to right now — only revealed adjacents. */
export function reachableFrom(node: MapNodeId, revealed: ReadonlySet<string>): readonly MapNode[] {
  const here = findNode(node);
  if (!here) return [];
  return here.neighbors.filter((nb) => canMove(node, nb, revealed)).map((nb) => getNode(nb));
}
