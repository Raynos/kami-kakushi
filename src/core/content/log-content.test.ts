import { describe, it, expect } from 'vitest';
import { renderLogLine } from './log-content';
import { createInitialState } from '..';
import { applyRewards } from '../rewards';

// Golden test (Stage C): the re-derived text must equal the exact line the inline
// template produced. Expected strings are hand-reconstructed here with explicit
// codepoints for the special glyphs (em dash U+2014, minus U+2212) — independent of
// the registry source, so a botched move goes RED.
describe('log-content registry — golden line equality', () => {
  it('season.reckoned renders the exact diegetic line', () => {
    expect(renderLogLine('season.reckoned', { bonus: 12 })).toBe(
      "The season's accounts are reckoned. The house is judged the better for your hand on it — its koku standing rises. (+12 koku)",
    );
  });

  it('season.spoilage renders the exact diegetic line (minus sign U+2212)', () => {
    expect(renderLogLine('season.spoilage', { total: 3 })).toBe(
      'The season turns, and some of your rice has spoiled in the store. (−3 rice)',
    );
  });

  it('rank.marker renders the terse progression line (arrow U+2191, em dash U+2014)', () => {
    expect(renderLogLine('rank.marker', { title: 'Steward', kanji: '家令' })).toBe(
      'Rank ↑ — Steward 家令',
    );
  });

  it('ascension.dream branches on the porters-knot param', () => {
    expect(renderLogLine('ascension.dream', { knot: true })).toBe(
      "That night the dream comes clearer than it ever has: hands that are yours and not yours, tying a porter's knot you never learned; a road in the dark; a name on the tip of your tongue. You wake reaching for it, and it is already gone.",
    );
    expect(renderLogLine('ascension.dream', { knot: false })).toBe(
      'That night a dream comes — a road in the dark, a name almost remembered — and is gone by the time you wake.',
    );
  });

  it('throws loudly on an unknown contentKey (a migration bug, not a blank line)', () => {
    expect(() => renderLogLine('nope.missing')).toThrow(/unknown contentKey/);
  });
});

describe('log-content registry — the rewards-bus emit path', () => {
  it('derives text from a keyed line AND carries the persistable descriptor', () => {
    const next = applyRewards(createInitialState(1), {
      log: [{ channel: 'milestone', contentKey: 'season.reckoned', params: { bonus: 7 } }],
    });
    const entry = next.log.entries.at(-1)!;
    expect(entry.contentKey).toBe('season.reckoned');
    expect(entry.params).toEqual({ bonus: 7 });
    expect(entry.text).toBe(renderLogLine('season.reckoned', { bonus: 7 }));
  });
});
