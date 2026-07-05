import { describe, it, expect } from 'vitest';
import { renderLogLine } from './log-content';
import { formatCoin } from '../format';
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

  it('combat.win assembles the outcome line with and without loot (✓ · → glyphs)', () => {
    expect(
      renderLogLine('combat.win', {
        mob: 'boar',
        hpBefore: 50,
        hpAfter: 42,
        coin: 8,
        lootQty: 2,
        lootLabel: 'boar hide',
      }),
    ).toBe(`You bring down the boar. ✓ (HP 50→42 · +${formatCoin(8)}, +2 boar hide)`);
    expect(
      renderLogLine('combat.win', {
        mob: 'boar',
        hpBefore: 50,
        hpAfter: 42,
        coin: 8,
        lootQty: 0,
        lootLabel: '',
      }),
    ).toBe(`You bring down the boar. ✓ (HP 50→42 · +${formatCoin(8)})`);
  });

  it('combat.loss joins the rout-loss phrase at 3 / 1 / 0 dropped resources', () => {
    const base = { mob: 'boar', hpBefore: 40, hpAfter: 5 };
    // 3 parts → "A, B and C"
    expect(renderLogLine('combat.loss', { ...base, lostCoin: 10, lostRice: 3, lostMats: 2 })).toBe(
      `The boar overcomes you; you limp home badly used. (HP 40→5) You drop ${formatCoin(10)}, 3 rice and 2 of your spoils in the rout. Eat and mend before you take the field again.`,
    );
    // 1 part → no "and"
    expect(renderLogLine('combat.loss', { ...base, lostCoin: 0, lostRice: 3, lostMats: 0 })).toBe(
      'The boar overcomes you; you limp home badly used. (HP 40→5) You drop 3 rice in the rout. Eat and mend before you take the field again.',
    );
    // 0 parts → no drop clause at all
    expect(renderLogLine('combat.loss', { ...base, lostCoin: 0, lostRice: 0, lostMats: 0 })).toBe(
      'The boar overcomes you; you limp home badly used. (HP 40→5) Eat and mend before you take the field again.',
    );
  });

  it('craft.repair shows the coin fee only when one was charged', () => {
    expect(renderLogLine('craft.repair', { weapon: 'bo staff', wood: 2, coinFee: 5 })).toBe(
      `You repair the bo staff. (−2 wood, −${formatCoin(5)})`,
    );
    expect(renderLogLine('craft.repair', { weapon: 'bo staff', wood: 2, coinFee: 0 })).toBe(
      'You repair the bo staff. (−2 wood)',
    );
  });

  it('food.cook shows the HP gain only when wounds actually mended', () => {
    expect(renderLogLine('food.cook', { sansai: 2, hpGain: 8 })).toBe(
      'You boil the wild greens into a hot meal and eat. The ache of your wounds eases. (−2 sansai, +8 HP)',
    );
    expect(renderLogLine('food.cook', { sansai: 2, hpGain: 0 })).toBe(
      'You boil the wild greens into a hot meal and eat. The ache of your wounds eases. (−2 sansai)',
    );
  });

  it('bank.deposit denominates coin but leaves plain resources as counts', () => {
    expect(renderLogLine('bank.deposit', { amount: 40, resource: 'coin' })).toBe(
      `You store ${formatCoin(40)} safe in the kura storehouse.`,
    );
    expect(renderLogLine('bank.deposit', { amount: 12, resource: 'rice' })).toBe(
      'You store 12 rice safe in the kura storehouse.',
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
