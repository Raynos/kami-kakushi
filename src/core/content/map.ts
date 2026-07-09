// The walkable T0 estate node-graph (DoD T0-M4-F4 / ADR-065 / NQ-3): the estate is
// areas you MOVE BETWEEN, not a menu. The nodes mirror content/areas.ts (16 zones), and
// KEY to the sheet's zone ids (src/ui/map-sheets/nodes.ts T0_NODES — one vocabulary,
// TST1). Each node inks in on its rung beat: `rung` is the reveal schedule (a build-time
// design lock aligned to the bible anchors — weir/sickroom/forecourt/kitchen at R0, kura
// at R3, drill-yard at R4, grove late, ruined locked all tier), and `revealFlag` is the
// content/surfaces room-unlock id gated on that rung. Pure data + pure helpers (no DOM,
// no RNG). Immutable-in/immutable-out; the caller passes a plain `revealed` set.

import { FLAVOR } from './flavor';

export type MapNodeId = string;

export interface MapNode {
  readonly id: MapNodeId;
  readonly label: string;
  readonly kanji?: string;
  readonly blurb: string;
  /** The node's WRONG thing (bible: every zone carries one) — the FLAVOR nodeXWrong line,
   *  the ONE source the play card and the survey-sheet detail pane both read (C4.6/TST1).
   *  Absent where none is authored (the woodshed's warmth is earned). */
  readonly wrong?: string;
  /** Adjacent nodes (symmetric: if A lists B, B lists A — verified by the test). */
  readonly neighbors: readonly MapNodeId[];
  /** The surface/flag that must be in `revealed` before this node is walkable; an
   *  undefined flag means always-open (the R0 cold-open nodes). Reuses the
   *  content/surfaces room-unlock ids so no NEW flags are needed to gate the map. */
  readonly revealFlag?: string;
  /** The T0 rung at which this zone's seal unlocks (the reveal schedule). */
  readonly rung?: number;
  /** Locked scenery (the ruined compound): visible, blurbed, NEVER walkable —
   *  `canMove` refuses regardless of `revealed`. */
  readonly locked?: boolean;
  /** A danger ring — the first edge of the wild (combat zones). */
  readonly dangerRing?: boolean;
}

/** Hard T0 node-count ceiling: the sheet's T0 roster MINUS its activity chips
 *  (T0_NODES has 17 entries but the `night-rounds` `kind:'activity'` chip never
 *  gets a MAP_NODES entry — it opens the round post, not travel). The map.test
 *  derives `T0_NODES.filter((n) => n.kind !== 'activity').length` to prove this,
 *  never a copied number. MAP_NODES.length must equal this. */
export const MAP_NODE_CEILING = 16;

export const MAP_NODES: readonly MapNode[] = [
  {
    id: 'weir',
    label: 'The weir & riverbank',
    kanji: '堰',
    blurb: 'Where the river left him; the weir-jizō stands here.',
    wrong: FLAVOR.nodeWeirRiverbankWrong,
    neighbors: ['weir-reeds', 'paddies'],
    rung: 0,
    // No revealFlag: the cold open finds him here; the weir is always walkable.
  },
  {
    id: 'sickroom',
    label: "Sōan's sickroom",
    kanji: '薬',
    blurb: "A lean-to surgery off the outer court — where the river's gift is carried.",
    wrong: FLAVOR.nodeSickroomWrong,
    neighbors: ['forecourt'],
    rung: 0,
  },
  {
    id: 'forecourt',
    label: 'The forecourt',
    kanji: '庭',
    blurb: "The working heart of the guest house's outer court — the first verb is here.",
    wrong: FLAVOR.nodeForecourtWrong,
    neighbors: ['gate', 'kura', 'kitchen', 'woodshed', 'sickroom', 'drill-yard', 'paddies'],
    rung: 0,
  },
  {
    id: 'kitchen',
    label: 'The kitchen threshold',
    kanji: '竈',
    blurb: "Meals at the threshold; the board where the household's shape is overheard.",
    wrong: FLAVOR.nodeKitchenThresholdWrong,
    neighbors: ['forecourt', 'shrine'],
    rung: 0,
  },
  {
    id: 'gate',
    label: 'The gate & gateyard',
    kanji: '門',
    blurb: "The estate's face, kept barely; Yohei's stall sets up here on market days.",
    wrong: FLAVOR.nodeGateGateyardWrong,
    neighbors: ['forecourt'],
    revealFlag: 'room-gate',
    rung: 1,
  },
  {
    id: 'woodshed',
    label: 'The woodshed',
    kanji: '薪',
    blurb: 'His corner: a mat, a chipped bowl, the comfort floor.',
    neighbors: ['forecourt'],
    revealFlag: 'room-woodshed',
    rung: 1,
  },
  {
    id: 'paddies',
    label: 'The home paddy & vegetable rows',
    kanji: '田',
    blurb: "The guest house's skirts; the labour baseline — the deed engine's heart.",
    wrong: FLAVOR.nodeHomePaddyWrong,
    neighbors: ['forecourt', 'weir', 'field-margins', 'woodlot'],
    revealFlag: 'room-paddies',
    // G4 — R1, NOT R2: R1→R2 requires farm_paddy (requirements.gen R1), so the paddy MUST be
    // reachable the moment you are R1. Reconciles the G4.2 self-picked schedule to the requirement drives.
    rung: 1,
  },
  {
    id: 'field-margins',
    label: 'The field margins',
    kanji: '畦',
    blurb: "Tanuki and badger setts at the paddy's edge, raiding the drying racks.",
    wrong: FLAVOR.nodeFieldMarginsWrong,
    neighbors: ['paddies', 'ruined'],
    revealFlag: 'room-field-margins',
    rung: 2,
    dangerRing: true,
  },
  {
    id: 'kura',
    label: 'The kura & grain-store',
    kanji: '蔵',
    blurb: "The working storehouse; the grain-watch's post.",
    wrong: FLAVOR.nodeKuraWrong,
    neighbors: ['forecourt'],
    revealFlag: 'room-kura',
    rung: 3,
  },
  {
    id: 'woodlot',
    label: 'The woodlot edge',
    kanji: '林',
    blurb: "Kindling and forage country; the wolf's ground before R3. Nobody here.",
    wrong: FLAVOR.nodeWoodlotEdgeWrong,
    neighbors: ['paddies', 'orchard'],
    revealFlag: 'room-woodlot',
    // G4 — R2, NOT R3: R2→R3 requires woodcut_edge + forage_satoyama (both sited at the woodlot,
    // activities.ts), so the woodlot MUST open at R2. Reconciled to the requirement drives.
    rung: 2,
    dangerRing: true,
  },
  {
    id: 'weir-reeds',
    label: 'The weir reeds',
    kanji: '葦',
    blurb: 'River rats gnaw the weir screens the house leases from Matsuzō.',
    wrong: FLAVOR.nodeWeirReedsWrong,
    neighbors: ['weir'],
    revealFlag: 'room-weir-reeds',
    rung: 3,
    dangerRing: true,
  },
  {
    id: 'drill-yard',
    label: 'The drill yard',
    kanji: '稽',
    blurb: "The old stable court, repurposed — Kihei's ground. Opens at R4.",
    wrong: FLAVOR.nodeDrillYardWrong,
    neighbors: ['forecourt'],
    revealFlag: 'room-drill-yard',
    rung: 4,
  },
  {
    id: 'shrine',
    label: 'The shrine-alcove corridor',
    kanji: '祠',
    blurb: 'A family altar in a corridor — glimpsed once in T0, entered in T1.',
    wrong: FLAVOR.nodeShrineCorridorWrong,
    neighbors: ['kitchen'],
    revealFlag: 'room-shrine',
    rung: 5,
  },
  {
    id: 'orchard',
    label: 'The overgrown orchard',
    kanji: '園',
    blurb: "The old compound's orchard gone wild; feral dogs den in it, bold from lean winters.",
    wrong: FLAVOR.nodeOvergrownOrchardWrong,
    neighbors: ['woodlot', 'ruined', 'grove'],
    revealFlag: 'room-orchard',
    rung: 5,
    dangerRing: true,
  },
  {
    id: 'grove',
    label: 'The bamboo grove',
    kanji: '竹',
    blurb: 'Behind the compound; the monkey troop raids the vegetable rows from it.',
    wrong: FLAVOR.nodeBambooGroveWrong,
    neighbors: ['orchard'],
    revealFlag: 'room-grove',
    rung: 7,
    dangerRing: true,
  },
  {
    id: 'ruined',
    label: 'The ruined compound',
    kanji: '廃',
    blurb: 'Beyond a rope and a warning: fallen roofs, a crumbled gate. Locked all tier.',
    wrong: FLAVOR.nodeRuinedCompoundWrong,
    neighbors: ['field-margins', 'orchard'],
    locked: true,
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

/** A node is reachable once its revealFlag is in `revealed` (or it has none) — and
 *  never if it is locked scenery (the ruined compound). */
function isRevealed(node: MapNode, revealed: ReadonlySet<string>): boolean {
  if (node.locked) return false;
  return node.revealFlag === undefined || revealed.has(node.revealFlag);
}

/** PURE: may you step from `from` to `to`? Adjacent AND the target is revealed +
 *  not locked. Total + safe — unknown endpoints simply return false (never throws). */
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
