import { describe, it, expect } from 'vitest';
import { logFilterMatches, LOG_FILTERS, type LogFilter } from './log-filter';
import type { LogChannel } from '../core/log';

// Derived from the source of truth (the LogChannel union), NOT a copied literal — if a channel
// is added to core/log.ts this list must grow with it, and the orphan test below goes RED.
const ALL_CHANNELS: readonly LogChannel[] = [
  'narration',
  'reward',
  'combat',
  'system',
  'milestone',
];

describe('logFilterMatches — the F9 channel→category mapping', () => {
  it('Story shows only the diegetic narration', () => {
    expect(logFilterMatches('narration', 'story')).toBe(true);
    expect(logFilterMatches('combat', 'story')).toBe(false);
    expect(logFilterMatches('reward', 'story')).toBe(false);
  });

  it('Work shows labour rewards + mundane system lines, not story/combat', () => {
    expect(logFilterMatches('reward', 'work')).toBe(true);
    expect(logFilterMatches('system', 'work')).toBe(true);
    expect(logFilterMatches('narration', 'work')).toBe(false);
    expect(logFilterMatches('combat', 'work')).toBe(false);
  });

  it('Combat shows only the fight', () => {
    expect(logFilterMatches('combat', 'combat')).toBe(true);
    expect(logFilterMatches('milestone', 'combat')).toBe(false);
  });

  it('Progress shows only milestones (rung-ups / perks / unlocks)', () => {
    expect(logFilterMatches('milestone', 'progression')).toBe(true);
    expect(logFilterMatches('narration', 'progression')).toBe(false);
  });

  it('All shows every channel', () => {
    for (const c of ALL_CHANNELS) expect(logFilterMatches(c, 'all')).toBe(true);
  });

  it('no orphan channel — every channel belongs to at least one non-all category', () => {
    const nonAll = LOG_FILTERS.map((f) => f.id).filter((id): id is LogFilter => id !== 'all');
    for (const c of ALL_CHANNELS) {
      const reachable = nonAll.some((f) => logFilterMatches(c, f));
      expect(reachable, `channel "${c}" must belong to a filter category`).toBe(true);
    }
  });
});
