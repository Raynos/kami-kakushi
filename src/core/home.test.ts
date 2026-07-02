// DEEP HOUSING — the home + belongings + comfort (D-111 / F89). The T0 core: rest RE-SITES to your
// corner, belongings are OWNABLE + DISTINCT from resources, and comfort furniture gives real,
// legible bonuses (the prestige-not-power register — never a combat stat). Every fixture derives its
// expectation from the SOURCE OF TRUTH (the BelongingDef.comfort amounts, SATIETY_PER_REST), never a
// copied magic number, and asserts the LEVER (the comfort amount / the synergy mechanism), so each
// test could genuinely go RED.

import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  reduce,
  balance,
  setFlag,
  revealPass,
  isUnlocked,
  satietyMax,
  ownsBelonging,
  ownedBelongingIds,
  ownedBelongings,
  homeRestBonus,
  homeSatietyBonus,
  homeSetComplete,
  homeRestLine,
  getBelonging,
  BELONGINGS,
  BELONGING_IDS,
  SETTLED_HOME_SET,
  SETTLED_HOME_REST_BONUS,
  ATTR_IDS,
  type GameState,
} from '../core';
import { COLD_OPEN } from './content/coldOpen';

const { SATIETY_PER_REST } = balance;

/** Awake + raked (so `rest` is legal) with the home GRANTED (panel-home unlocked) and some coin.
 *  Satiety sits low so a rest has clear headroom (a bonus can't be hidden by the max clamp). */
function atHome(coin = 0): GameState {
  const s = createInitialState(1);
  return {
    ...s,
    character: { ...s.character, satiety: 0 },
    resources: { ...s.resources, coin },
    flags: { ...s.flags, awake: true, raked: true, 'rank-r1': true },
    unlocked: [...s.unlocked, 'panel-home'],
  };
}

/** The same, but BEFORE the home is granted (the cold-open corner — rest against the post). */
function preHome(): GameState {
  const s = createInitialState(1);
  return {
    ...s,
    character: { ...s.character, satiety: 0 },
    flags: { ...s.flags, awake: true, raked: true },
  };
}

const restLineOf = (s: GameState): string =>
  s.log.entries.filter((e) => e.channel === 'system').at(-1)?.text ?? '';

describe('T0-A — the home is GRANTED at R1 (the reveal wiring, not a hand-set fixture)', () => {
  it('reaching R1 (rank-r1 flag) reveals panel-home + makes the promised mat + bowl real', () => {
    let s = setFlag(createInitialState(1), 'awake', true);
    expect(isUnlocked(s, 'panel-home')).toBe(false); // no home before R1
    expect(ownsBelonging(s, 'bowl')).toBe(false);
    s = revealPass(setFlag(s, 'rank-r1', true)); // the R1 promotion sets rank-r1; finish() reveals
    expect(isUnlocked(s, 'panel-home')).toBe(true);
    expect(ownsBelonging(s, 'bowl')).toBe(true); // "a dry corner and a bowl" — cashed
    // the reveal fires "a place here is yours" into the log (dialogue.ts:81 made mechanical).
    expect(s.log.entries.some((e) => /a place here is yours/i.test(e.text))).toBe(true);
  });
});

describe('T0-A — rest RE-SITES to the home (F89: "a place here is yours")', () => {
  it('pre-home, rest is still sited against the cold-open post', () => {
    const after = reduce(preHome(), { type: 'rest' });
    expect(restLineOf(after)).toBe(COLD_OPEN.restAct);
  });

  it('once the home exists, rest happens in your corner — NOT against the post', () => {
    const after = reduce(atHome(), { type: 'rest' });
    // could go RED: if the re-siting broke, this would still be COLD_OPEN.restAct.
    expect(restLineOf(after)).toBe(homeRestLine(false));
    expect(restLineOf(after)).not.toBe(COLD_OPEN.restAct);
  });

  it('the home rest line reflects the bedding you own (bare mat vs futon)', () => {
    const bare = reduce(atHome(), { type: 'rest' });
    expect(restLineOf(bare)).toBe(homeRestLine(false));
    const withBedding = reduce({ ...atHome(), belongings: ['bedding'] }, { type: 'rest' });
    expect(restLineOf(withBedding)).toBe(homeRestLine(true));
    expect(homeRestLine(true)).not.toBe(homeRestLine(false));
  });
});

describe('T0-B — belongings are OWNABLE + a category DISTINCT from resources', () => {
  it('the promised keepsakes (mat + bowl) exist the moment the corner does — and not before', () => {
    expect(ownsBelonging(preHome(), 'bowl')).toBe(false); // no corner ⇒ no bowl yet
    const home = atHome();
    expect(ownsBelonging(home, 'bowl')).toBe(true); // "a dry corner and a bowl" — made real
    expect(ownsBelonging(home, 'straw_mat')).toBe(true);
  });

  it('no belonging id collides with a resource key — belongings are their OWN store', () => {
    const s = atHome(500);
    const resourceKeys = new Set(Object.keys(s.resources)); // coin, rice, …
    for (const id of BELONGING_IDS) expect(resourceKeys.has(id)).toBe(false);
  });

  it('buying a belonging debits coin into the `belongings` store, leaving resources otherwise intact', () => {
    const s = atHome(200);
    const bedding = getBelonging('bedding');
    if (bedding.source.kind !== 'buy') throw new Error('fixture: bedding must be buyable');
    const after = reduce(s, { type: 'buy_belonging', belongingId: 'bedding' });
    // the piece lands in the DISTINCT belongings array — never in resources.
    expect(after.belongings).toContain('bedding');
    expect(Object.keys(after.resources)).not.toContain('bedding');
    // coin is spent by exactly the piece's price (source of truth), nothing else moves.
    expect(after.resources.coin ?? 0).toBe(200 - bedding.source.coinCost);
    expect(after.resources.rice).toBe(s.resources.rice);
  });

  it('a belonging is not CONSUMED by any verb + a double-buy is a no-op', () => {
    const s = atHome(1000);
    const once = reduce(s, { type: 'buy_belonging', belongingId: 'bedding' });
    const twice = reduce(once, { type: 'buy_belonging', belongingId: 'bedding' });
    // owned once; a second buy neither duplicates it nor charges again.
    expect(twice.belongings.filter((b) => b === 'bedding')).toHaveLength(1);
    expect(twice.resources.coin).toBe(once.resources.coin);
    // resting (which spends satiety-time) never removes a belonging.
    const rested = reduce(once, { type: 'rest' });
    expect(rested.belongings).toContain('bedding');
  });

  it('a buy with too little coin is a no-op (no partial purchase)', () => {
    const s = atHome(10); // less than any piece's price
    const after = reduce(s, { type: 'buy_belonging', belongingId: 'bedding' });
    expect(after).toBe(s); // reducer returns the input state unchanged
  });
});

describe('T0-C — comfort furniture improves its TARGET (assert the lever, not a collapsed metric)', () => {
  it('bedding → MORE rest recovery, by exactly its comfort amount', () => {
    const bedding = getBelonging('bedding');
    if (!bedding.comfort || bedding.comfort.kind !== 'rest') {
      throw new Error('fixture: bedding must grant a rest bonus');
    }
    const base = atHome();
    const withBedding = { ...base, belongings: ['bedding'] };
    // the LEVER: homeRestBonus rises by exactly the bedding amount (0 → amount).
    expect(homeRestBonus(base)).toBe(0);
    expect(homeRestBonus(withBedding)).toBe(bedding.comfort.amount);
    // …and it's REAL: a rest restores that much more satiety (mechanism, from the balance source).
    const restedBare = reduce(base, { type: 'rest' });
    const restedBed = reduce(withBedding, { type: 'rest' });
    expect(restedBare.character.satiety).toBe(SATIETY_PER_REST); // from 0
    expect(restedBed.character.satiety).toBe(SATIETY_PER_REST + bedding.comfort.amount);
    expect(restedBed.character.satiety - restedBare.character.satiety).toBe(bedding.comfort.amount);
  });

  it('the hearth → a warmer body: satietyMax rises by exactly its comfort amount', () => {
    const hearth = getBelonging('hearth');
    if (!hearth.comfort || hearth.comfort.kind !== 'body') {
      throw new Error('fixture: hearth must grant a body/warmth bonus');
    }
    const base = atHome();
    const withHearth = { ...base, belongings: ['hearth'] };
    expect(homeSatietyBonus(withHearth)).toBe(hearth.comfort.amount);
    expect(satietyMax(withHearth) - satietyMax(base)).toBe(hearth.comfort.amount);
  });

  it('the settled-home SET is worth MORE than the sum of its parts (synergy), and loses it on removal', () => {
    const chest = getBelonging('chest');
    const chestRest = chest.comfort?.kind === 'rest' ? chest.comfort.amount : 0;
    const full = { ...atHome(), belongings: [...SETTLED_HOME_SET] };
    const withoutChest = {
      ...atHome(),
      belongings: SETTLED_HOME_SET.filter((id) => id !== 'chest'),
    };
    expect(homeSetComplete(ownedBelongingIds(full))).toBe(true);
    expect(homeSetComplete(ownedBelongingIds(withoutChest))).toBe(false);
    // completing the set (adding the last piece) lifts the rest bonus by MORE than that piece's own
    // standalone rest contribution — the synergy mechanism (the whole > the sum of parts).
    const marginal = homeRestBonus(full) - homeRestBonus(withoutChest);
    expect(marginal).toBe(SETTLED_HOME_REST_BONUS + chestRest);
    expect(marginal).toBeGreaterThan(chestRest);
    expect(SETTLED_HOME_REST_BONUS).toBeGreaterThan(0);
  });

  it('a bare corner grants ZERO comfort (the bonuses are inert until you earn furniture)', () => {
    const base = atHome();
    expect(homeRestBonus(base)).toBe(0);
    expect(homeSatietyBonus(base)).toBe(0);
    // the granted keepsakes (mat + bowl) are owned but carry no comfort — flavour, not a stat.
    expect(ownedBelongings(base).every((b) => b.comfort === null || b.source.kind === 'buy')).toBe(
      true,
    );
  });
});

describe('D-111 invariant — PRESTIGE not power: no furniture ever grants a combat stat', () => {
  it('every belonging comfort channel is COMFORT (rest/body), never an attribute/combat stat', () => {
    const attrIds = new Set<string>(ATTR_IDS);
    for (const def of BELONGINGS) {
      if (def.comfort === null) continue;
      // the guard: a comfort kind is a closed prestige set — never an attr id (no "+atk pillow").
      expect(['rest', 'body']).toContain(def.comfort.kind);
      expect(attrIds.has(def.comfort.kind)).toBe(false);
    }
  });

  it('buying furniture never touches attributes, HP, or level (only comfort + coin)', () => {
    let s = atHome(1000);
    const before = s.character;
    for (const def of BELONGINGS) {
      if (def.source.kind === 'buy') s = reduce(s, { type: 'buy_belonging', belongingId: def.id });
    }
    expect(s.character.attrs).toEqual(before.attrs);
    expect(s.character.hp).toBe(before.hp);
    expect(s.character.level).toBe(before.level);
    expect(s.character.attributePoints).toBe(before.attributePoints);
  });
});

describe('D-088 — the housing full-arc: earn coin → buy bedding → rest recovers MORE', () => {
  it('a bought futon measurably improves the rest loop end-to-end', () => {
    const bedding = getBelonging('bedding');
    if (bedding.source.kind !== 'buy' || bedding.comfort?.kind !== 'rest') {
      throw new Error('fixture: bedding must be a buyable rest piece');
    }
    // rest BEFORE furnishing…
    const poor = atHome(bedding.source.coinCost);
    const restedBefore = reduce(poor, { type: 'rest' });
    const gainBefore = restedBefore.character.satiety - poor.character.satiety;
    // …buy the futon (coin → belonging)…
    const furnished = reduce(poor, { type: 'buy_belonging', belongingId: 'bedding' });
    expect(furnished.belongings).toContain('bedding');
    expect(furnished.resources.coin).toBe(0); // spent the lot on the futon
    // …and rest AFTER: the same verb now restores strictly more, by the futon's amount.
    const restedAfter = reduce(
      { ...furnished, character: { ...furnished.character, satiety: 0 } },
      { type: 'rest' },
    );
    const gainAfter = restedAfter.character.satiety - 0;
    expect(gainAfter).toBe(gainBefore + bedding.comfort.amount);
    expect(gainAfter).toBeGreaterThan(gainBefore);
  });
});
