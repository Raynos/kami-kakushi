// The walkable T0 estate node-graph (DoD T0-M4-F4 / ADR-065 / NQ-3): the estate is
// areas you MOVE BETWEEN, not a menu. The nodes mirror content/areas.ts (16 zones), and
// KEY to the sheet's zone ids (src/ui/map-sheets/nodes.ts T0_NODES — one vocabulary,
// TST1). Each node inks in on its rung beat: `rung` is the reveal schedule (a build-time
// design lock aligned to the bible anchors — weir/sickroom/forecourt/kitchen at R0, kura
// at R3, drill-yard at R4, grove late, ruined locked all tier), and `revealFlag` is the
// content/surfaces room-unlock id gated on that rung. Pure data + pure helpers (no DOM,
// no RNG). Immutable-in/immutable-out; the caller passes a plain `revealed` set.

import { FLAVOR } from './flavor';
import type { Season } from '../constants';

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
  /** The node's FLAVOR key STEM (`nodeWeirRiverbank` …) — C5a unit 5: the per-season
   *  reads live at `<stem>Blurb<Season>` and `nodeSeasonalBlurb` resolves them (05-world:
   *  "nodes carry per-season flavor"). Absent ⇒ the static `blurb` serves all year. The
   *  survey SHEET stays static — a drawn document does not change with the weather. */
  readonly blurbStem?: string;
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
    blurbStem: 'nodeWeirRiverbank',
    wrong: FLAVOR.nodeWeirRiverbankWrong,
    neighbors: ['weir-reeds', 'paddies'],
    rung: 0,
    // FB-342 / ADR-177 — the cold open happens here, but the PATH BACK reads locked
    // until the day-book names the lease (the works-intro beat sets works-named-weir
    // → worksPass reveals room-weir). Discovered, not spawned (TST3).
    revealFlag: 'room-weir',
  },
  {
    id: 'sickroom',
    label: "Sōan's sickroom",
    kanji: '薬',
    blurb: "A lean-to surgery off the outer court — where the river's gift is carried.",
    blurbStem: 'nodeSickroom',
    wrong: FLAVOR.nodeSickroomWrong,
    neighbors: ['forecourt'],
    rung: 0,
    // FB-382 / ADR-177 pattern — the cold open is tended here, but the map names it
    // only when hurt starts existing: R3, the grain-watch (the wolf, the ribs). The
    // reveal always precedes any defeat relocation (combat opens at the same rung).
    revealFlag: 'room-sickroom',
  },
  {
    id: 'forecourt',
    label: 'The forecourt',
    kanji: '庭',
    blurb: "The working heart of the guest house's outer court — the first verb is here.",
    blurbStem: 'nodeForecourt',
    wrong: FLAVOR.nodeForecourtWrong,
    neighbors: ['gate', 'kura', 'kitchen', 'woodshed', 'sickroom', 'drill-yard', 'paddies'],
    rung: 0,
    // Human 2026-07-11 — you wake INSIDE the kura: the forecourt is introduced
    // by the intro's close (completeIntroTail), when Genemon puts you to work.
    revealFlag: 'room-forecourt',
  },
  {
    id: 'kitchen',
    label: 'The kitchen threshold',
    kanji: '竈',
    blurb: "Meals at the threshold; the board where the household's shape is overheard.",
    blurbStem: 'nodeKitchenThreshold',
    wrong: FLAVOR.nodeKitchenThresholdWrong,
    neighbors: ['forecourt', 'shrine'],
    rung: 0,
    // FB-381 / ADR-177 pattern — revealed by the R1 terms beat, where Genemon names
    // it: "Meals at the threshold, morning and evening" (the fiction causes the map).
    revealFlag: 'room-kitchen',
  },
  {
    id: 'gate',
    label: 'The gate & gateyard',
    kanji: '門',
    blurb: "The estate's face, kept barely; Yohei's stall sets up here on market days.",
    blurbStem: 'nodeGateGateyard',
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
    blurbStem: 'nodeWoodshed',
    neighbors: ['forecourt'],
    revealFlag: 'room-woodshed',
    rung: 1,
  },
  {
    id: 'paddies',
    label: 'The home paddy & vegetable rows',
    kanji: '田',
    blurb: "The guest house's skirts; the labour baseline — the deed engine's heart.",
    blurbStem: 'nodeHomePaddy',
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
    blurbStem: 'nodeFieldMargins',
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
    blurbStem: 'nodeKura',
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
    blurbStem: 'nodeWoodlotEdge',
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
    blurbStem: 'nodeWeirReeds',
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
    blurbStem: 'nodeDrillYard',
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
    blurbStem: 'nodeShrineCorridor',
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
    blurbStem: 'nodeOvergrownOrchard',
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
    blurbStem: 'nodeBambooGrove',
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
    blurbStem: 'nodeRuinedCompound',
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

/** The Season → FLAVOR key suffix ('new-year' → 'Newyear'). Part of the C5a key contract;
 *  the content test walks every stem × season so a missing/typo'd key goes RED. */
const SEASON_KEY_SUFFIX: Readonly<Record<Season, string>> = {
  winter: 'Winter',
  'new-year': 'Newyear',
  spring: 'Spring',
  summer: 'Summer',
  bon: 'Bon',
  autumn: 'Autumn',
};

/** The node's you-are-here read for a season (C5a unit 5): the seasonal FLAVOR variant
 *  when the node carries a stem, else the static blurb. Returns the key too — the DEV
 *  story switcher live-swaps render-read flavor by key (dev.subFlavor). */
export function nodeSeasonalBlurb(
  node: MapNode,
  season: Season,
): { readonly key?: string; readonly text: string } {
  if (!node.blurbStem) return { text: node.blurb };
  const key = `${node.blurbStem}Blurb${SEASON_KEY_SUFFIX[season]}`;
  const text = (FLAVOR as Record<string, string>)[key];
  return text !== undefined ? { key, text } : { text: node.blurb };
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
