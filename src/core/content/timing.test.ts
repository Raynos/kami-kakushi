// ADR-148 Phase 1 — the timing taxonomy's design levers (plan DoD). Fixtures are
// DERIVED from the registries (ACTIVITIES / INTENT_TIMING), never copied lists
// (ADR-086/087): a new activity or intent flows into these assertions on its own.
import { describe, expect, it } from 'vitest';
import { ACTIVITIES } from './activities';
import { MAP_NODES } from './map';
import {
  ACTIVITY_TIMING,
  EDGE_WALK_MS,
  INTENT_TIMING,
  edgeKey,
  timingFor,
  walkMs,
  type ActionTiming,
} from './timing';

// The human-locked fast-idle band (ADR-148): every timed duration lives inside it.
const BAND_MIN_MS = 3000;
const BAND_MAX_MS = 90000;

const timedEntries = (rec: Readonly<Record<string, ActionTiming>>) =>
  Object.entries(rec).filter(
    (e): e is [string, Extract<ActionTiming, { kind: 'timed' }>] => e[1].kind === 'timed',
  );

describe('action timing (ADR-148)', () => {
  it('every labour activity is timed, inside the fast-idle band, with a positive cooldown', () => {
    for (const a of ACTIVITIES) {
      const t = ACTIVITY_TIMING[a.id];
      expect(t.kind, a.id).toBe('timed');
      if (t.kind !== 'timed') continue;
      expect(t.durationMs, a.id).toBeGreaterThanOrEqual(BAND_MIN_MS);
      expect(t.durationMs, a.id).toBeLessThanOrEqual(BAND_MAX_MS);
      expect(t.cooldownMs, a.id).toBeGreaterThan(0);
    }
  });

  it('every timed intent stays inside the band with a positive cooldown', () => {
    for (const [type, t] of timedEntries(INTENT_TIMING)) {
      expect(t.durationMs, type).toBeGreaterThanOrEqual(BAND_MIN_MS);
      expect(t.durationMs, type).toBeLessThanOrEqual(BAND_MAX_MS);
      expect(t.cooldownMs, type).toBeGreaterThan(0);
    }
  });

  it('trade/inventory intents are the locked INSTANT class', () => {
    // The ADR-148 lever: buying/selling is explicitly zero-second. Reclassifying
    // any of these to timed is a design change, not a tuning pass.
    for (const type of ['sell_rice', 'buy_item', 'buy_belonging', 'deposit', 'withdraw'] as const)
      expect(INTENT_TIMING[type].kind, type).toBe('instant');
  });

  it('combat intents carry NO timing (excluded pending their own review)', () => {
    for (const type of ['fight', 'set_auto_combat'] as const)
      expect(INTENT_TIMING[type].kind, type).toBe('instant');
  });

  it('every map edge carries its own walk seconds (per-edge data, ADR-148)', () => {
    // Derived from MAP_NODES: a new edge without an EDGE_WALK_MS entry is RED.
    for (const n of MAP_NODES)
      for (const nb of n.neighbors) {
        expect(EDGE_WALK_MS[edgeKey(n.id, nb)], `${n.id} ↔ ${nb}`).toBeGreaterThan(0);
      }
    // undirected: both directions read the same edge
    expect(walkMs('kura', 'gate-forecourt')).toBe(walkMs('gate-forecourt', 'kura'));
  });

  it('move_to routes through the per-edge table with NO cooldown', () => {
    const t = timingFor('move_to', { from: 'kura', to: 'gate-forecourt' });
    expect(t.kind).toBe('timed');
    if (t.kind !== 'timed') return;
    expect(t.durationMs).toBe(EDGE_WALK_MS[edgeKey('kura', 'gate-forecourt')]);
    expect(t.cooldownMs).toBe(0); // you arrive and keep moving
  });

  it('timingFor routes do_activity to its per-activity entry', () => {
    for (const a of ACTIVITIES)
      expect(timingFor('do_activity', { activityId: a.id })).toBe(ACTIVITY_TIMING[a.id]);
    // and falls back to the intent table without an activity
    expect(timingFor('rest')).toBe(INTENT_TIMING.rest);
  });
});
