// Roster↔layout integrity (the map data contract — human-picked gate, 2026-07-08).
// The map's zone data spans three files that must agree: nodes.ts (what a zone IS),
// layout.ts (where its seal sits), reveal.ts (when T0 shows it). A zone added to
// one without the others renders as a floating seal or an unreachable node — this
// test makes the seam RED at `verify` instead of at review. All fixtures derive
// from the live data (never copied ids), per the test-discipline rule.

import { describe, expect, it } from 'vitest';
import { ANCHORS } from './layout';
import { RUNG_LADDER, T0_NODES, T1_NODES, T2_NODES } from './nodes';
import { REVEAL } from './reveal';

const t0Ids = new Set(T0_NODES.map((n) => n.id));
const allIds = new Set([...T0_NODES, ...T1_NODES, ...T2_NODES].map((n) => n.id));

describe('map-sheets data integrity — nodes/layout/reveal agree', () => {
  it('every roster zone has a seal anchor in layout.ANCHORS', () => {
    const missing = [...allIds].filter((id) => !(id in ANCHORS));
    expect(missing).toEqual([]);
  });

  it('every anchor belongs to a roster zone (no orphan seals)', () => {
    const orphans = Object.keys(ANCHORS).filter((id) => !allIds.has(id));
    expect(orphans).toEqual([]);
  });

  it('every RUNG_LADDER entry names a real T0 zone, at a real rung (1..7)', () => {
    const badIds = Object.keys(RUNG_LADDER).filter((id) => !t0Ids.has(id));
    expect(badIds).toEqual([]);
    const badRungs = Object.entries(RUNG_LADDER).filter(
      ([, r]) => !Number.isInteger(r) || r < 1 || r > 7,
    );
    expect(badRungs).toEqual([]);
  });

  it('REVEAL stages are strictly-increasing T0 rungs with fog geometry', () => {
    const rungs = REVEAL.map((s) => s.rung);
    expect(rungs).toEqual([...rungs].sort((a, b) => a - b));
    expect(new Set(rungs).size).toBe(rungs.length);
    for (const [i, s] of REVEAL.entries()) {
      expect(s.rung).toBeGreaterThanOrEqual(1);
      expect(s.rung).toBeLessThanOrEqual(7);
      // every stage except the last defines its fog (known poly or blobs); a
      // bare final stage means fully surveyed — no fog left to draw
      if (i < REVEAL.length - 1) expect(Boolean(s.known) || Boolean(s.blobs)).toBe(true);
    }
  });

  it('zone ids are unique within each tier roster', () => {
    expect(t0Ids.size).toBe(T0_NODES.length);
    expect(new Set(T1_NODES.map((n) => n.id)).size).toBe(T1_NODES.length);
    expect(new Set(T2_NODES.map((n) => n.id)).size).toBe(T2_NODES.length);
  });
});
