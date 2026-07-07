// ADR-148 Phase 1 — the timing taxonomy's design levers (plan DoD). Fixtures are
// DERIVED from the registries (ACTIVITIES / INTENT_TIMING), never copied lists
// (ADR-086/087): a new activity or intent flows into these assertions on its own.
import { describe, expect, it } from 'vitest';
import { ACTIVITIES } from './activities';
import { ACTIVITY_TIMING, INTENT_TIMING, timingFor, type ActionTiming } from './timing';

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
    for (const type of ['face_wolf', 'fight', 'set_auto_combat'] as const)
      expect(INTENT_TIMING[type].kind, type).toBe('instant');
  });

  it('timingFor routes do_activity to its per-activity entry', () => {
    for (const a of ACTIVITIES)
      expect(timingFor('do_activity', { activityId: a.id })).toBe(ACTIVITY_TIMING[a.id]);
    // and falls back to the intent table without an activity
    expect(timingFor('rest')).toBe(INTENT_TIMING.rest);
  });
});
