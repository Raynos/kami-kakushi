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

describe('LOG_FILTERS — the F52 bar order', () => {
  it('reads Story · Progress · Combat · Work · All · Now, left→right', () => {
    // derive the expected order from the ids (the labels come along for the ride); if the source
    // reorders, this goes RED — the order IS the design lever here.
    expect(LOG_FILTERS.map((f) => f.id)).toEqual([
      'story',
      'progression',
      'combat',
      'work',
      'all',
      'now',
    ]);
    // `now` is last and labelled "Now" (F53).
    const last = LOG_FILTERS[LOG_FILTERS.length - 1]!;
    expect(last.id).toBe('now');
    expect(last.label).toBe('Now');
  });
});

describe('logFilterMatches — the F9 channel→category mapping (non-ephemeral)', () => {
  it('Story shows only the diegetic narration', () => {
    expect(logFilterMatches('narration', 'story', false)).toBe(true);
    expect(logFilterMatches('combat', 'story', false)).toBe(false);
    expect(logFilterMatches('reward', 'story', false)).toBe(false);
  });

  it('Work shows labour rewards + mundane system lines, not story/combat', () => {
    expect(logFilterMatches('reward', 'work', false)).toBe(true);
    expect(logFilterMatches('system', 'work', false)).toBe(true);
    expect(logFilterMatches('narration', 'work', false)).toBe(false);
    expect(logFilterMatches('combat', 'work', false)).toBe(false);
  });

  it('Combat shows only the fight', () => {
    expect(logFilterMatches('combat', 'combat', false)).toBe(true);
    expect(logFilterMatches('milestone', 'combat', false)).toBe(false);
  });

  it('Progress shows only milestones (rung-ups / perks / unlocks)', () => {
    expect(logFilterMatches('milestone', 'progression', false)).toBe(true);
    expect(logFilterMatches('narration', 'progression', false)).toBe(false);
  });

  it('All shows every channel', () => {
    for (const c of ALL_CHANNELS) expect(logFilterMatches(c, 'all', false)).toBe(true);
  });
});

describe('logFilterMatches — the F53 ephemeral / Now rule', () => {
  it('the Now view matches ONLY ephemeral entries (any channel)', () => {
    for (const c of ALL_CHANNELS) {
      expect(logFilterMatches(c, 'now', true)).toBe(true); // ephemeral → shows in Now
      expect(logFilterMatches(c, 'now', false)).toBe(false); // permanent → never in Now
    }
  });

  it('every OTHER filter HIDES ephemeral entries (they live only in Now)', () => {
    const permanentFilters: LogFilter[] = ['story', 'progression', 'combat', 'work', 'all'];
    for (const f of permanentFilters) {
      for (const c of ALL_CHANNELS) {
        // an ephemeral line NEVER shows outside Now, even under All / its own channel category.
        expect(logFilterMatches(c, f, true)).toBe(false);
      }
    }
  });

  it('a non-ephemeral line still shows under its channel category, never in Now', () => {
    // regression guard on the two axes not crossing: reward (Work) stays permanent-only.
    expect(logFilterMatches('reward', 'work', false)).toBe(true);
    expect(logFilterMatches('reward', 'now', false)).toBe(false);
  });
});

describe('logFilterMatches — reachability invariants', () => {
  it('no orphan channel — every channel belongs to a non-all/non-now category', () => {
    const categorized = LOG_FILTERS.map((f) => f.id).filter(
      (id): id is LogFilter => id !== 'all' && id !== 'now',
    );
    for (const c of ALL_CHANNELS) {
      const reachable = categorized.some((f) => logFilterMatches(c, f, false));
      expect(reachable, `channel "${c}" must belong to a filter category`).toBe(true);
    }
  });

  it('an ephemeral entry is reachable — exactly via Now', () => {
    // an ephemeral flavor line would be UNREACHABLE if Now did not exist: every other filter
    // hides it, so Now is its sole home.
    for (const c of ALL_CHANNELS) {
      const reachable = LOG_FILTERS.map((f) => f.id).filter((f) => logFilterMatches(c, f, true));
      expect(reachable).toEqual(['now']);
    }
  });
});
