import { describe, it, expect } from 'vitest';
import {
  MAP_NODES,
  MAP_NODE_CEILING,
  MAP_NODE_IDS,
  getNode,
  canMove,
  reachableFrom,
  type MapNodeId,
} from './map';
import { AREAS } from './areas';

// Every revealFlag the graph references, as a "fully-opened estate" set.
const ALL_REVEALED = new Set<string>(
  MAP_NODES.map((n) => n.revealFlag).filter((f): f is string => f !== undefined),
);

describe('MAP_NODES — the T0 estate node-graph', () => {
  it('stays at or under the pinned node-count ceiling (minimal-here, D-065)', () => {
    expect(MAP_NODE_CEILING).toBe(7);
    expect(MAP_NODES.length).toBeLessThanOrEqual(MAP_NODE_CEILING);
    expect(MAP_NODES.length).toBeGreaterThanOrEqual(5); // the ~5-6 authored estate nodes
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

  it('marks exactly the near-satoyama as a danger ring', () => {
    const danger = MAP_NODES.filter((n) => n.dangerRing).map((n) => n.id);
    expect(danger).toEqual(['near-satoyama']);
  });

  it('reveal-gates every node except the cold-open kura', () => {
    const ungated = MAP_NODES.filter((n) => n.revealFlag === undefined).map((n) => n.id);
    expect(ungated).toEqual(['kura']);
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
    expect(getNode('kura').id).toBe('kura');
    expect(getNode('near-satoyama').dangerRing).toBe(true);
  });

  it('throws on an unknown id', () => {
    expect(() => getNode('nowhere')).toThrow(/unknown map node/);
  });
});

describe('canMove — adjacency AND reveal gating', () => {
  it('refuses a move between non-adjacent nodes even when fully revealed', () => {
    expect(canMove('kura', 'near-satoyama', ALL_REVEALED)).toBe(false);
  });

  it('refuses an adjacent move while the target is still hidden', () => {
    // gate-forecourt -> home-paddies needs the home-paddies room revealed.
    expect(canMove('gate-forecourt', 'home-paddies', new Set())).toBe(false);
  });

  it('allows an adjacent move once the target room is revealed', () => {
    expect(canMove('gate-forecourt', 'home-paddies', new Set(['room-home-paddies']))).toBe(true);
  });

  it('always allows reaching an ungated neighbour (the kura)', () => {
    expect(canMove('gate-forecourt', 'kura', new Set())).toBe(true);
  });

  it('returns false for unknown endpoints (total + safe, never throws)', () => {
    expect(canMove('nowhere', 'kura', ALL_REVEALED)).toBe(false);
    expect(canMove('kura', 'nowhere', ALL_REVEALED)).toBe(false);
  });
});

describe('reachableFrom — only revealed neighbours', () => {
  it('returns only ungated neighbours when nothing is revealed', () => {
    const reach = reachableFrom('gate-forecourt', new Set()).map((n) => n.id);
    expect(reach).toEqual(['kura']);
  });

  it('widens as rooms are revealed', () => {
    const reach = reachableFrom(
      'gate-forecourt',
      new Set(['room-home-paddies', 'room-woodlot-edge']),
    ).map((n) => n.id);
    expect(reach.sort()).toEqual(['home-paddies', 'kura', 'woodlot-edge']);
  });

  it('returns full node objects, all genuinely adjacent to the source', () => {
    const from = 'gate-forecourt';
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
