import { describe, it, expect } from 'vitest';
import { renderLogLine, LOG_CONTENT, type LogParams } from './log-content';
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
    // 2 parts → "A and B" (rice never appears — kura-only, cannot bleed: ADR-163)
    expect(renderLogLine('combat.loss', { ...base, lostCoin: 10, lostMats: 2 })).toBe(
      `The boar overcomes you; you limp home badly used. (HP 40→5) You drop ${formatCoin(10)} and 2 of your spoils in the rout. Eat and mend before you take the field again.`,
    );
    // 1 part → no "and"
    expect(renderLogLine('combat.loss', { ...base, lostCoin: 0, lostMats: 2 })).toBe(
      'The boar overcomes you; you limp home badly used. (HP 40→5) You drop 2 of your spoils in the rout. Eat and mend before you take the field again.',
    );
    // 0 parts → no drop clause at all
    expect(renderLogLine('combat.loss', { ...base, lostCoin: 0, lostMats: 0 })).toBe(
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

// Coverage ratchet: every registry key must render a non-empty string with sample params.
// Adding a key without a sample here fails RED — so the registry can never grow a key that is
// referenced by an emit site but broken/blank.
describe('log-content registry — coverage', () => {
  const SAMPLE: Readonly<Record<string, LogParams>> = {
    'season.reckoned': { bonus: 1 },
    'season.spoilage': { total: 1 },
    'rank.wallWeapon': { weapon: 'bo staff' },
    'rank.marker': { title: 'Steward', kanji: '家令' },
    'ascension.hall': {},
    'ascension.dream': { knot: true },
    'combat.levelUp': { level: 3 },
    'combat.tooHurt': {},
    'combat.win': {
      mob: 'boar',
      hpBefore: 50,
      hpAfter: 40,
      coin: 8,
      lootQty: 1,
      lootLabel: 'hide',
    },
    'combat.flee': { mob: 'boar', hpBefore: 50, hpAfter: 20 },
    'combat.loss': { mob: 'boar', hpBefore: 40, hpAfter: 5, lostCoin: 1, lostMats: 1 },
    'combat.wolfScripted': {},
    'combat.drillmaster': {},
    'combat.weaponBroken': { weapon: 'bo staff' },
    'craft.repair': { weapon: 'bo staff', wood: 2, coinFee: 3 },
    'craft.equip': { weapon: 'bo staff' },
    'food.cook': { sansai: 2, hpGain: 5 },
    'food.eatRice': { rice: 1, satGain: 3 },
    'market.sellRice': { rice: 5, price: 2, coinGain: 10 },
    'market.buyItem': { coin: 5, item: 'straw hat' },
    'belonging.acquire': { item: 'futon' },
    'bank.deposit': { amount: 10, resource: 'coin' },
    'bank.withdraw': { amount: 10, resource: 'rice' },
  };

  it('every registry key has sample params and renders a non-empty string', () => {
    for (const key of Object.keys(LOG_CONTENT)) {
      expect(SAMPLE[key], `add a SAMPLE entry for new key "${key}"`).toBeDefined();
      expect(renderLogLine(key, SAMPLE[key]).length, `"${key}" rendered empty`).toBeGreaterThan(0);
    }
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
