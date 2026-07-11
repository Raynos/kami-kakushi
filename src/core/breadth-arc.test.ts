import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  reduce,
  applyGrindFight,
  hasFlag,
  hpMax,
  getWeapon,
  type GameState,
} from './index';
import { YOHEI_MARKET_DAYS } from './content/market';

// T0-M4 BREADTH seams, end-to-end via the REAL reducer — proving the breadth surfaces work WITHIN
// a real playthrough (not just in isolated reducer tests): a quest driven to completion by real
// fights + labour (the kill:<mob> / gather:<resource> event seam), the capped market coin-sink, and
// a walk on the estate map. Unit tests cover each in isolation; this proves they integrate with the
// combat/labour spine and reward correctly. RED-able: break the quest event seam, the cap, or the
// map adjacency and an assertion fails.
//
// G4: the roster is the bible's PEST "keep the leased screens whole" quest (kill the weir river-rats
// + gather green bamboo to mend the screens) — combat/defence pays on the KIND lane (a completion
// FLAG + a payoff line, never coin). The market stall is open only on Yohei's MARKET DAYS.
const QUEST = 'pest_weir_screens';
const KILL_STEP = 'clear-river-rats'; // event kill:river_rats
const GATHER_STEP = 'mend-screens'; // event gather:wood
const MARKET_DAY = YOHEI_MARKET_DAYS[0]!;

// A combat-ready R3 state: combat live, the breadth surfaces unlocked, a high level + full vitals so
// the REAL fights resolve as wins reliably (the combat GRIND is m2.test's job; here the fights are
// real but favourable, so the focus stays on the quest/market/map SEAMS). The clock sits on a market
// day so the stall is open.
function readyState(seed: number): GameState {
  const base = createInitialState(seed);
  const leveled = { ...base, character: { ...base.character, level: 10 } };
  return {
    ...base,
    rung: 'R3',
    clock: { ...base.clock, day: MARKET_DAY },
    character: { ...base.character, level: 10, hp: hpMax(leveled), satiety: 100 },
    flags: {
      ...base.flags,
      awake: true,
      'rank-r3': true,
      'combat-blooded': true,
      'combat-unlocked': true,
    },
    resources: { ...base.resources, coin: 500, wood: 0, sansai: 0 },
    unlocked: [
      ...new Set([
        ...base.unlocked,
        'tab-combat',
        'tab-skills',
        'panel-estate',
        'panel-house-influence',
        'verb-farm',
        'verb-haul',
        'verb-woodcut',
        'verb-forage',
        'room-paddies',
        'room-woodlot',
        'room-field-margins',
        'row-wood',
        'row-sansai',
        'skill-conditioning',
      ]),
    ],
    location: 'kura',
  };
}

const stepDone = (s: GameState, step: string): boolean =>
  (s.quests.progress[QUEST] ?? []).includes(step);

/** Top vitals + weapon so the next REAL fight resolves favourably (no stranding mid-quest). */
function recover(s: GameState): GameState {
  return {
    ...s,
    character: { ...s.character, hp: hpMax(s), satiety: 100 },
    weaponDurability: getWeapon(s.equippedWeapon).durabilityMax,
  };
}

/** Fight a mob (REAL combat) until its kill advances the matching quest step. */
function fightUntil(s: GameState, mob: 'river_rats', step: string): GameState {
  let n = 0;
  while (!stepDone(s, step) && n++ < 60) s = applyGrindFight(recover(s), mob);
  return s;
}

describe('T0-M4 breadth seams close end-to-end via real intents', () => {
  it('a quest is driven to completion by REAL fights + labour, then pays out once (KIND lane)', () => {
    let s = reduce(readyState(7), { type: 'accept_quest', questId: QUEST });
    expect(s.quests.accepted).toContain(QUEST);
    const doneFlag = `quest_${QUEST}_done`;

    // clear-river-rats (kill:river_rats) — the FIGHT→quest event seam
    s = fightUntil(s, 'river_rats', KILL_STEP);
    expect(stepDone(s, KILL_STEP)).toBe(true);

    // mend-screens (gather:wood) — the LABOUR→quest event seam (woodcut at the woodlot)
    let guard = 0;
    while (!stepDone(s, GATHER_STEP) && guard++ < 60) {
      s = reduce(
        { ...s, location: 'woodlot', character: { ...s.character, satiety: 100 } },
        { type: 'do_activity', activityId: 'woodcut_edge' },
      );
    }
    expect(stepDone(s, GATHER_STEP)).toBe(true);

    // both steps done → the quest completes and grants its KIND-lane reward (a flag, never coin) ONCE
    expect(s.quests.completed).toContain(QUEST);
    expect(hasFlag(s, doneFlag)).toBe(true);

    // …and it never double-pays: replaying a kill event banks no further completion
    s = applyGrindFight(recover(s), 'river_rats');
    expect(s.quests.completed.filter((q) => q === QUEST)).toHaveLength(1);
  });

  it('the market is a REAL capped coin-sink (buys grant goods; the stockCap clamps)', () => {
    let s = readyState(3);
    const item = 'greens_sack'; // 10 coin → +3 sansai, stockCap 5
    const coinStart = s.resources.coin ?? 0;
    // buy past the cap — only stockCap buys should land
    for (let i = 0; i < 8; i++) s = reduce(s, { type: 'buy_item', itemId: item });
    expect(s.marketBought[item]).toBe(5); // capped, not 8
    expect(s.resources.coin ?? 0).toBe(coinStart - 5 * 10); // 5 buys × 10 coin
    expect(s.resources.sansai ?? 0).toBe(5 * 3); // 5 buys × 3 sansai
  });

  it('the estate map is walkable — move_to crosses to an adjacent revealed node, blocks the rest', () => {
    // at the kura; the forecourt is reveal-gated since 2026-07-11 (the intro's
    // close introduces it) — granted here so only walkability is under test.
    const base = readyState(1);
    const s = { ...base, unlocked: [...base.unlocked, 'room-forecourt'] };
    expect(s.location).toBe('kura');
    const moved = reduce(s, { type: 'move_to', to: 'forecourt' });
    expect(moved.location).toBe('forecourt'); // adjacent + revealed → you walk
    // a non-adjacent hop straight from the kura is refused (no teleporting across the estate)
    expect(reduce(s, { type: 'move_to', to: 'field-margins' })).toBe(s);
  });
});
