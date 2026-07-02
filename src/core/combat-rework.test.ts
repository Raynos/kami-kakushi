// v0.3.1 Step 3 — the combat rework (D-076 + batch-2). RED-able guards for the new behaviours,
// added as each sub-step lands: 3a summarised one-line outcomes + a LOSS stops the autopilot
// (no auto-heal grind); 3c the carried-resource loss penalty (banked is safe); 3d the
// auto-retreat-@20% mode (a 3rd "fled" outcome). HP still carries (D-050).
//
// Fixtures are driven by the SEED-ROBUST combat curve (m2.test header): mc(5) vs monkey ≈ 1.00
// (a guaranteed win) and mc(1) vs bandit ≈ 0.00 (a guaranteed loss) — so these are deterministic
// without fishing for a magic seed, and they go RED if the new behaviour regresses.
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  reduce,
  applyGrindFight,
  resolveFight,
  foesHere,
  mcCombatStats,
  mobCombatStats,
  getMob,
  getWeapon,
  formatCoin,
  balance,
  hpMax,
  type GameState,
} from './index';

/** A ready fighter at the given level: full HP (hpMax grows with level), full satiety. */
function mc(level = 1, satiety = 100): GameState {
  const s = createInitialState(1);
  const t: GameState = { ...s, character: { ...s.character, level, satiety } };
  return { ...t, character: { ...t.character, hp: hpMax(t) } };
}
function combatLines(s: GameState): string[] {
  return s.log.entries.filter((e) => e.channel === 'combat').map((e) => e.text);
}
/** Awake, the estate economy open (the deposit/withdraw gate), carrying `coin`. */
function economyReady(coin = 100): GameState {
  const s = createInitialState(1);
  return {
    ...s,
    flags: { ...s.flags, awake: true },
    unlocked: [...s.unlocked, 'panel-estate'],
    resources: { ...s.resources, coin },
  };
}

describe('3a · summarised one-line fight outcomes (D-076 / batch-1 call 2)', () => {
  it('a WIN emits a SINGLE combat line carrying the HP swing + coin (not the old 2-3 lines)', () => {
    const before = mc(5); // L5 vs monkey ≈ 1.00 win-rate → a guaranteed win
    const after = applyGrindFight(before, 'monkey');
    expect(after.character.combatXp).toBeGreaterThan(before.character.combatXp); // proves it won

    const added = combatLines(after).length - combatLines(before).length;
    expect(added).toBe(1); // win + optional loot fold into ONE outcome line

    const line = combatLines(after).at(-1) ?? '';
    expect(line).toMatch(/bring down the .*monkey/i);
    expect(line).toMatch(/HP \d+→\d+/); // the HP swing is IN the outcome line
    // D-108 — the coin reward is DENOMINATED (mon/monme/ryō), matching the pills; NOT raw " coin".
    expect(line).toContain(`+${formatCoin(getMob('monkey').coinReward)}`);
    expect(line).not.toMatch(/\d+ coin/); // RED against the old "+N coin" raw-integer form
  });

  it('a LOSS emits a single summarised line with the HP drop', () => {
    const after = applyGrindFight(mc(1), 'bandit'); // ≈ 0.00 → a loss
    expect(after.character.hp).toBe(balance.SETBACK_HP); // proves it lost
    const line = combatLines(after).at(-1) ?? '';
    expect(line).toMatch(/overcomes you|limp home/i);
    expect(line).toMatch(/HP \d+→\d+/);
  });
});

describe('3a · a loss STOPS the autopilot (D-076: 0 HP ⇒ autopilot off)', () => {
  it('a lost grind-fight nulls autoCombat and floors HP to the setback', () => {
    const before: GameState = { ...mc(1), autoCombat: 'bandit' }; // a guaranteed loss
    const after = applyGrindFight(before, 'bandit');
    expect(after.character.hp).toBe(balance.SETBACK_HP); // it lost
    expect(after.autoCombat).toBeNull(); // ← the autopilot stopped
  });

  it('a WON grind-fight leaves the autopilot running (you keep grinding)', () => {
    const before: GameState = { ...mc(5), autoCombat: 'monkey' }; // a guaranteed win
    const after = applyGrindFight(before, 'monkey');
    expect(after.character.combatXp).toBeGreaterThan(before.character.combatXp); // it won
    expect(after.autoCombat).toBe('monkey'); // ← autopilot unchanged
  });
});

describe('3b · the bank — deposit/withdraw move carried ↔ banked (batch-2 call 7)', () => {
  it('deposit moves ALL carried coin into the kura storehouse', () => {
    const after = reduce(economyReady(100), { type: 'deposit', resource: 'coin' });
    expect(after.resources.coin ?? 0).toBe(0); // carried emptied
    expect(after.banked.coin ?? 0).toBe(100); // sheltered
  });

  it('withdraw moves banked coin back to carried (round-trips)', () => {
    const stored = reduce(economyReady(100), { type: 'deposit', resource: 'coin' });
    const after = reduce(stored, { type: 'withdraw', resource: 'coin' });
    expect(after.resources.coin ?? 0).toBe(100);
    expect(after.banked.coin ?? 0).toBe(0);
  });

  it('deposit with nothing carried is a gate-safe no-op (unchanged state)', () => {
    const s = economyReady(0);
    expect(reduce(s, { type: 'deposit', resource: 'coin' })).toBe(s); // same ref → no-op
  });
});

describe('3c · a lost fight drops CARRIED coin/materials; BANKED is safe (D-076 / call 7)', () => {
  it('a loss bites carried coin by LOSS_COIN_FRAC and leaves the storehouse untouched', () => {
    const base = mc(1); // L1 vs bandit ≈ 0.00 → a loss
    const before: GameState = {
      ...base,
      resources: { ...base.resources, coin: 100 },
      banked: { coin: 50 },
    };
    const after = applyGrindFight(before, 'bandit');
    expect(after.character.hp).toBe(balance.SETBACK_HP); // it lost
    // the design lever (LOSS_COIN_FRAC), derived from the source constant — not a magic number
    const expectedLost = Math.round(100 * balance.LOSS_COIN_FRAC);
    expect(after.resources.coin ?? 0).toBe(100 - expectedLost); // carried bitten
    expect(after.banked.coin ?? 0).toBe(50); // ← sheltered, untouched
  });

  it('a WIN never touches the storehouse (banked stays put)', () => {
    const before: GameState = { ...mc(5), banked: { coin: 50 } }; // a guaranteed win
    const after = applyGrindFight(before, 'monkey');
    expect(after.character.combatXp).toBeGreaterThan(before.character.combatXp); // it won
    expect(after.banked.coin ?? 0).toBe(50);
  });

  it('the rout DENOMINATES the dropped coin (D-108 — mon/monme/ryō, matching the pills)', () => {
    const base = mc(1); // a guaranteed loss vs bandit
    const before: GameState = { ...base, resources: { ...base.resources, coin: 100 } };
    const after = applyGrindFight(before, 'bandit');
    expect(after.character.hp).toBe(balance.SETBACK_HP); // it lost
    const lostCoin = Math.round(100 * balance.LOSS_COIN_FRAC); // the design lever, from the source
    const line = combatLines(after).at(-1) ?? '';
    expect(line).toContain(formatCoin(lostCoin)); // the dropped coin, as the pill renders it
    expect(line).not.toMatch(/\d+ coin/); // RED against the old "You drop N coin in the rout" form
  });
});

describe('3d · auto-retreat — the "fled" outcome (batch-2 call 6)', () => {
  it('resolveFight FLEES on a survivable grind-down below the retreat threshold', () => {
    const mcStats = mcCombatStats(mc(1)); // ~full HP at L1
    const bandit = mobCombatStats(getMob('bandit')); // tanky — can't be one-shot
    // retreatHp just below the starting HP: the first survivable enemy hit trips the break-off.
    const r = resolveFight(mc(1).rng, mcStats, bandit, mcStats.hp - 1);
    expect(r.fled).toBe(true);
    expect(r.won).toBe(false);
    expect(r.mcHpLeft).toBeGreaterThan(0); // fled alive
    expect(r.mcHpLeft).toBeLessThan(mcStats.hp); // and below where it started
  });

  it('with retreatHp 0 (fight-to-death / the forecast path, A6) a fight NEVER flees', () => {
    const r = resolveFight(mc(1).rng, mcCombatStats(mc(1)), mobCombatStats(getMob('bandit')), 0);
    expect(r.fled).toBe(false);
  });

  it('applyGrindFight retreat mode produces flees, and EVERY flee is no-penalty + autopilot-off', () => {
    // A single survivable grind-down is stochastic per seed (a burst foe can kill outright — a LOSS,
    // not a flee — which is the correct per-turn semantic). So sweep seeds: assert flees DO occur
    // (else the branch is dead) and that every flee is handled right. Starting HP at 50% drains to
    // the 20% threshold over a couple boar hits; the L1 MC can't kill the tanky boar first.
    let fledCount = 0;
    for (let seed = 1; seed <= 40; seed++) {
      const base: GameState = { ...mc(1), rng: createInitialState(seed).rng };
      const startHp = Math.round(0.5 * hpMax(base));
      const before: GameState = {
        ...base,
        character: { ...base.character, hp: startHp },
        resources: { ...base.resources, coin: 100 },
        autoCombat: 'boar',
        autoCombatRetreat: true,
      };
      const after = applyGrindFight(before, 'boar', true);
      if (/break off|fall back/i.test(combatLines(after).at(-1) ?? '')) {
        fledCount++;
        expect(after.autoCombat).toBeNull(); // ← a flee STOPS the autopilot
        expect(after.resources.coin ?? 0).toBe(100); // no loss penalty (you chose to back off)
        expect(after.character.combatXp).toBe(before.character.combatXp); // no win XP
        expect(after.character.hp).toBeGreaterThan(0); // alive…
        expect(after.character.hp).toBeLessThan(startHp); // …but hurt
      }
    }
    expect(fledCount).toBeGreaterThan(0); // the retreat mode genuinely flees (not dead code)
  });

  it('set_auto_combat carries the mode flag (fight-to-death vs retreat) — at the foe’s node', () => {
    // Step 5b: arming an auto-grind is spatial — you must stand on the monkey's node (home-paddies).
    const s: GameState = {
      ...createInitialState(1),
      location: 'home-paddies',
      flags: { awake: true },
    };
    const death = reduce(s, { type: 'set_auto_combat', mobId: 'monkey', retreat: false });
    expect(death.autoCombat).toBe('monkey');
    expect(death.autoCombatRetreat).toBe(false);
    const flee = reduce(s, { type: 'set_auto_combat', mobId: 'monkey', retreat: true });
    expect(flee.autoCombatRetreat).toBe(true);
  });

  it('arming auto-combat OFF the foe’s node is a no-op; clearing works anywhere', () => {
    const away: GameState = { ...createInitialState(1), location: 'kura', flags: { awake: true } };
    expect(reduce(away, { type: 'set_auto_combat', mobId: 'monkey' })).toBe(away); // no-op off-node
    // clearing (mobId null) is not gated — you can always stop the autopilot
    const armed: GameState = { ...away, location: 'home-paddies', autoCombat: 'monkey' };
    expect(reduce(armed, { type: 'set_auto_combat', mobId: null }).autoCombat).toBeNull();
  });
});

describe('5c · banking is spatial — you store/draw only at the kura (batch-2 map call)', () => {
  it('deposit off the kura is a no-op; at the kura it stores', () => {
    const away: GameState = { ...economyReady(100), location: 'home-paddies' };
    expect(reduce(away, { type: 'deposit', resource: 'coin' })).toBe(away); // same ref → no-op
    const atKura: GameState = { ...economyReady(100), location: 'kura' };
    const stored = reduce(atKura, { type: 'deposit', resource: 'coin' });
    expect(stored.banked.coin ?? 0).toBe(100);
  });

  it('withdraw off the kura is a no-op; the stored coin stays safe until you walk back', () => {
    const atKura: GameState = { ...economyReady(100), location: 'kura' };
    const stored = reduce(atKura, { type: 'deposit', resource: 'coin' });
    const away: GameState = { ...stored, location: 'woodlot-edge' };
    expect(reduce(away, { type: 'withdraw', resource: 'coin' })).toBe(away); // same ref → no-op
    expect(away.banked.coin ?? 0).toBe(100); // still sheltered
  });
});

describe('5b · foes are spatial — you fight where the foe stands (batch-2 map call)', () => {
  /** A ready L5 fighter (guaranteed win vs monkey) with the combat tab open, at `location`. */
  function fighterAt(location: string): GameState {
    const s = mc(5);
    return { ...s, location, unlocked: [...s.unlocked, 'tab-combat'] };
  }

  it('the monkey lives on the home paddies — fighting it there WORKS, elsewhere is a no-op', () => {
    // source of truth: the monkey's bound node (not a copied string).
    const monkeyNode = getMob('monkey').area;
    expect(monkeyNode).toBe('home-paddies');

    // off the node (kura): the fight is rejected — combat state is untouched.
    const away = fighterAt('kura');
    const awayAfter = reduce(away, { type: 'fight', mobId: 'monkey' });
    expect(awayAfter.character.combatXp).toBe(away.character.combatXp);
    expect(awayAfter.character.hp).toBe(away.character.hp);

    // on the node: the same fight resolves (a guaranteed win raises combat XP).
    const here = fighterAt(monkeyNode);
    const hereAfter = reduce(here, { type: 'fight', mobId: 'monkey' });
    expect(hereAfter.character.combatXp).toBeGreaterThan(here.character.combatXp);
  });

  it('the watch shows only the foes on THIS node (foesHere is node-scoped)', () => {
    const idsAt = (loc: string): string[] => foesHere(fighterAt(loc)).map((f) => f.mob.id);
    // gate forecourt: the grain-rat swarm (the gentle warmup at the stores). home paddies: the
    // humbling lone monkey + the crop-raiding troop (A9). near satoyama: the lean wolf + the pit
    // viper in the grass. deep satoyama: the boar in its wallow (Step 5d). The kura holds only the
    // scripted wolf (NOT grindable → empty watch). The woodlot road's bandit is the first HUMAN
    // threat, GATED to T2 (A10) → no T0 watch there. Order is GRINDABLE danger-order (level asc).
    expect(idsAt('gate-forecourt')).toEqual(['rice_rats']);
    expect(idsAt('home-paddies')).toEqual(['monkey', 'monkey_troop']);
    expect(idsAt('near-satoyama')).toEqual(['wolf', 'mamushi']);
    expect(idsAt('deep-satoyama')).toEqual(['boar']);
    expect(idsAt('woodlot-edge')).toEqual([]); // bandit gated out of T0
    expect(idsAt('kura')).toEqual([]);
    // …but the bandit DOES appear once the house reaches T2 (the gate is tier-scoped, A10).
    const atT2 = foesHere({ ...fighterAt('woodlot-edge'), tier: 2 }).map((f) => f.mob.id);
    expect(atT2).toEqual(['bandit']);
  });

  // A9 — the richer T0 roster (Plan B v0.3.2). The three new grounded foes exist with sane
  // stats, are T0-REACHABLE (minTier 0) on their own nodes, and carry their design identity.
  it('the A9 foes exist, are T0-reachable on their node, and keep their archetype identity', () => {
    for (const id of ['rice_rats', 'mamushi', 'monkey_troop'] as const) {
      const m = getMob(id);
      // sane stats derived from the def itself (no copied magic numbers).
      expect(m.level).toBeGreaterThanOrEqual(1);
      expect(m.coinReward).toBeGreaterThanOrEqual(0);
      expect(m.minTier ?? 0).toBe(0); // grindable in T0, unlike the T2-gated bandit
      // reachable at T0 (tier 0) on its OWN node — RED if a placement/gate regressed.
      const hereIds = foesHere(fighterAt(m.area)).map((f) => f.mob.id);
      expect(hereIds).toContain(id);
    }
    // identity levers (assert the design KNOB, not a collapsed metric): the troop teaches the
    // accuracy/evasion lesson (the single most evasive foe in the roster), while the viper is its
    // sharp opposite on the neighbouring node — a fast, accurate biter that lands where the troop
    // ducks (higher accuracy + far lower evasion than the troop, and among the fastest cadences).
    const grindables = ['rice_rats', 'monkey', 'monkey_troop', 'wolf', 'mamushi', 'boar', 'bandit'];
    const eva = (id: string) => getMob(id as never).evaBonus ?? 0;
    const acc = (id: string) => getMob(id as never).accBonus ?? 0;
    const spd = (id: string) => getMob(id as never).baseSpeed ?? 1;
    expect(Math.max(...grindables.map(eva))).toBe(eva('monkey_troop'));
    expect(acc('mamushi')).toBeGreaterThan(acc('monkey_troop'));
    expect(eva('mamushi')).toBeLessThan(eva('monkey_troop'));
    expect(spd('mamushi')).toBeGreaterThan(1); // a fast striker, not a plodder
    // the grain-rat swarm is the fastest cadence (a boiling swarm) yet nearly harmless (its bites
    // rarely land — the LOWEST accuracy), the gentle-warmup identity.
    expect(Math.max(...grindables.map(spd))).toBe(spd('rice_rats'));
    expect(Math.min(...grindables.map(acc))).toBe(acc('rice_rats'));
    // (the grain-rat warmup forecasting EASIER than the monkey at L1 is asserted against the
    // sampled combat curve in m2.test.ts, where the foeWr helper lives.)
  });

  it('walking away from a foe ends the auto-grind on it (move_to clears autoCombat)', () => {
    // stand on the paddies auto-grinding the monkey, then walk one hop off — the autopilot stops.
    const at = fighterAt('home-paddies');
    const grinding: GameState = {
      ...at,
      // reveal the nodes the walk touches (the estate rooms double as node-reveal surfaces).
      unlocked: [...at.unlocked, 'room-gate-forecourt', 'room-home-paddies'],
      flags: { awake: true },
      autoCombat: 'monkey',
      autoCombatRetreat: false,
    };
    const walked = reduce(grinding, { type: 'move_to', to: 'gate-forecourt' });
    expect(walked.location).toBe('gate-forecourt');
    expect(walked.autoCombat).toBeNull();
  });

  it('the scripted grain-store wolf is faced at the kura — nowhere else', () => {
    const wolfNode = getMob('wolf_scripted').area;
    expect(wolfNode).toBe('kura');
    const base: GameState = {
      ...createInitialState(1),
      flags: { awake: true },
      unlocked: [...createInitialState(1).unlocked, 'verb-face-wolf'],
    };
    // off the kura: the summons is a no-op (the fight has not been survived).
    const away = reduce({ ...base, location: 'home-paddies' }, { type: 'face_wolf' });
    expect(away.flags['first-fight-survived']).toBeFalsy();
    // at the kura: facing it always resolves and opens R3.
    const here = reduce({ ...base, location: wolfNode }, { type: 'face_wolf' });
    expect(here.flags['first-fight-survived']).toBe(true);
  });
});

describe('v0.3.1 fun/quality audit fixes (2026-07-01)', () => {
  it('equipping a weapon does NOT refill durability — no free-repair-by-swap exploit', () => {
    const base = createInitialState(1);
    const worn: GameState = {
      ...base,
      equippedWeapon: 'carrying_pole',
      weaponDurability: 5, // badly worn
      flags: { ...base.flags, 'crafted-wood_axe': true },
    };
    // switching to the axe carries the (clamped) durability — it does NOT jump back to full.
    const axeMax = getWeapon('wood_axe').durabilityMax;
    const swapped = reduce(worn, { type: 'equip_weapon', weaponId: 'wood_axe' });
    expect(swapped.equippedWeapon).toBe('wood_axe');
    expect(swapped.weaponDurability).toBe(Math.min(5, axeMax)); // = 5, not axeMax → no free repair
    expect(swapped.weaponDurability).toBeLessThan(axeMax);
    // re-equipping the already-equipped weapon is a no-op (can't tap it to refill either).
    expect(reduce(worn, { type: 'equip_weapon', weaponId: 'carrying_pole' })).toBe(worn);
  });

  it('arming auto-flee while already too hurt refuses honestly — no phantom flee', () => {
    const hurt: GameState = { ...mc(1), character: { ...mc(1).character, hp: 1 } };
    const after = applyGrindFight(hurt, 'monkey', true); // retreat mode, HP already ≤ threshold
    expect(after.autoCombat).toBeNull(); // the autopilot stops
    expect(after.character.hp).toBe(1); // no fight happened — HP untouched
    expect(after.clock).toBe(hurt.clock); // no clock advance (no fight)
    expect(after.weaponDurability).toBe(hurt.weaponDurability); // no phantom weapon wear
    const line = after.log.entries.at(-1)?.text ?? '';
    expect(line).toMatch(/too hurt to hold the line/); // an honest "mend first", not "winded but whole"
    expect(line).not.toMatch(/winded, blade up, but whole/);
  });

  it('stopping auto-combat for a broken weapon logs WHY (not a silent halt)', () => {
    const s: GameState = { ...createInitialState(1), flags: { awake: true }, autoCombat: 'monkey' };
    const after = reduce(s, { type: 'set_auto_combat', mobId: null, reason: 'weapon-broken' });
    expect(after.autoCombat).toBeNull();
    expect(after.log.entries.some((e) => /broken.*no wood to mend/i.test(e.text))).toBe(true);
    // a normal manual toggle-off (no reason) never emits the broken-weapon line
    const silent = reduce(s, { type: 'set_auto_combat', mobId: null });
    expect(silent.log.entries.some((e) => /broken.*no wood to mend/i.test(e.text))).toBe(false);
  });
});
