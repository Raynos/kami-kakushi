import { describe, it, expect } from 'vitest';
import {
  MAP_NODES,
  MAP_NODE_CEILING,
  MAP_NODE_IDS,
  getNode,
  canMove,
  reachableFrom,
  nodeSeasonalBlurb,
  type MapNodeId,
} from './map';
import { SEASONS } from '../constants';
import { AREAS } from './areas';
import { T0_NODES } from '../../ui/map-sheets/nodes';

// Every revealFlag the graph references, as a "fully-opened estate" set.
const ALL_REVEALED = new Set<string>(
  MAP_NODES.map((n) => n.revealFlag).filter((f): f is string => f !== undefined),
);

// The walkable, always-open R0 cold-open nodes (no revealFlag, not locked scenery).
const UNGATED = MAP_NODES.filter((n) => n.revealFlag === undefined && !n.locked).map((n) => n.id);

describe('MAP_NODES — the T0 estate node-graph', () => {
  it('holds exactly the sheet ceiling — every non-activity T0 zone, no more (D-065, TST1)', () => {
    // The ceiling is DERIVED from the sheet roster (T0_NODES minus its activity chips), never a
    // copied magic number: a new zone on the sheet flows through and a mismatch goes RED.
    const sheetWalkable = T0_NODES.filter((n) => n.kind !== 'activity').length;
    expect(MAP_NODE_CEILING).toBe(sheetWalkable);
    expect(MAP_NODES.length).toBe(MAP_NODE_CEILING); // the graph mirrors the sheet 1:1
  });

  it('has unique ids and a matching id-set', () => {
    const ids = MAP_NODES.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect([...MAP_NODE_IDS].sort()).toEqual([...ids].sort());
  });

  it('covers every existing estate area (mirrors content/areas.ts)', () => {
    for (const area of AREAS) {
      expect(MAP_NODE_IDS.has(area.id), `node for area '${area.id}'`).toBe(true);
    }
  });

  it('marks the wild nodes as danger rings (the combat grounds)', () => {
    const danger = MAP_NODES.filter((n) => n.dangerRing).map((n) => n.id);
    // in map-order: the paddy edge, the woodlot, the weir reeds, the orchard, the grove.
    expect(danger).toEqual(['field-margins', 'woodlot', 'weir-reeds', 'orchard', 'grove']);
  });

  it('reveal-gates every node except the R0 cold-open zones', () => {
    // The sickroom/forecourt/kitchen are the always-open outer court. The weir is
    // GATED since ADR-177 (FB-342): the cold open happens there, but the path back
    // reads locked until the works-intro's day-book naming reveals room-weir. Every
    // other zone inks in on its rung beat via a revealFlag.
    expect(UNGATED).toEqual(['sickroom', 'forecourt', 'kitchen']);
  });

  it('holds the ruined compound as locked scenery — visible, never walkable', () => {
    const ruined = getNode('ruined');
    expect(ruined.locked).toBe(true);
    // even fully-revealed, no adjacent may step into it.
    for (const nb of ruined.neighbors) expect(canMove(nb, 'ruined', ALL_REVEALED)).toBe(false);
  });
});

describe('graph shape', () => {
  it('has symmetric adjacency (if A lists B, B lists A)', () => {
    for (const node of MAP_NODES) {
      for (const nb of node.neighbors) {
        expect(MAP_NODE_IDS.has(nb), `${node.id} -> unknown neighbour ${nb}`).toBe(true);
        expect(getNode(nb).neighbors, `${nb} should list ${node.id} back`).toContain(node.id);
      }
    }
  });

  it('lists no node as its own neighbour', () => {
    for (const node of MAP_NODES) expect(node.neighbors).not.toContain(node.id);
  });

  it('is fully connected (every node reachable by pure adjacency)', () => {
    const start = MAP_NODES[0]!.id;
    const seen = new Set<MapNodeId>([start]);
    const queue: MapNodeId[] = [start];
    while (queue.length) {
      const cur = queue.shift()!;
      for (const nb of getNode(cur).neighbors) {
        if (!seen.has(nb)) {
          seen.add(nb);
          queue.push(nb);
        }
      }
    }
    expect(seen.size).toBe(MAP_NODES.length);
  });

  it('is a graph, not a single line (at least one cycle)', () => {
    // Each edge is counted from both ends; a tree has nodes-1 edges, a cycle needs more.
    const edgeEnds = MAP_NODES.reduce((sum, n) => sum + n.neighbors.length, 0);
    const edges = edgeEnds / 2;
    expect(edges).toBeGreaterThan(MAP_NODES.length - 1);
  });
});

describe('getNode', () => {
  it('returns the node for a known id', () => {
    expect(getNode('forecourt').id).toBe('forecourt');
    expect(getNode('field-margins').dangerRing).toBe(true);
  });

  it('throws on an unknown id', () => {
    expect(() => getNode('nowhere')).toThrow(/unknown map node/);
  });
});

describe('canMove — adjacency AND reveal gating', () => {
  it('refuses a move between non-adjacent nodes even when fully revealed', () => {
    // the kura's sole neighbour is the forecourt — the field margins are not adjacent.
    expect(canMove('kura', 'field-margins', ALL_REVEALED)).toBe(false);
  });

  it('refuses an adjacent move while the target is still hidden', () => {
    // forecourt -> paddies needs the paddies room revealed.
    expect(canMove('forecourt', 'paddies', new Set())).toBe(false);
  });

  it('allows an adjacent move once the target room is revealed', () => {
    expect(canMove('forecourt', 'paddies', new Set(['room-paddies']))).toBe(true);
  });

  it('always allows reaching an ungated neighbour (the R0 kitchen)', () => {
    expect(canMove('forecourt', 'kitchen', new Set())).toBe(true);
  });

  it('returns false for unknown endpoints (total + safe, never throws)', () => {
    expect(canMove('nowhere', 'forecourt', ALL_REVEALED)).toBe(false);
    expect(canMove('forecourt', 'nowhere', ALL_REVEALED)).toBe(false);
  });
});

describe('reachableFrom — only revealed neighbours', () => {
  it('returns only ungated neighbours when nothing is revealed', () => {
    // forecourt's always-open neighbours are the kitchen + the sickroom (both R0, no flag).
    const reach = reachableFrom('forecourt', new Set())
      .map((n) => n.id)
      .sort();
    expect(reach).toEqual(['kitchen', 'sickroom']);
  });

  it('widens as rooms are revealed', () => {
    const reach = reachableFrom('forecourt', new Set(['room-paddies', 'room-kura'])).map(
      (n) => n.id,
    );
    expect(reach.sort()).toEqual(['kitchen', 'kura', 'paddies', 'sickroom']);
  });

  it('returns full node objects, all genuinely adjacent to the source', () => {
    const from = 'forecourt';
    const reach = reachableFrom(from, ALL_REVEALED);
    expect(reach.length).toBeGreaterThan(0);
    for (const n of reach) {
      expect(getNode(from).neighbors).toContain(n.id);
      expect(n.label.length).toBeGreaterThan(0);
    }
  });

  it('returns [] for an unknown node', () => {
    expect(reachableFrom('nowhere', ALL_REVEALED)).toEqual([]);
  });
});

describe('C5a unit 5 — the per-season node reads (the key contract)', () => {
  it('every blurbStem resolves a REAL FLAVOR variant for EVERY season (no typo ships dark)', () => {
    const stems = MAP_NODES.filter((n) => n.blurbStem);
    expect(stems.length).toBe(MAP_NODES.length); // all 16 breathe by season (C5a scope)
    for (const n of stems) {
      for (const s of SEASONS) {
        const r = nodeSeasonalBlurb(n, s);
        expect(r.key, `${n.id} has no seasonal read for ${s}`).toBeTruthy();
        expect(r.text.length, `${n.id}/${s} resolves empty`).toBeGreaterThan(0);
        expect(r.text).not.toBe(n.blurb); // the variant is a real seasonal read, not the static line
      }
    }
  });
});
