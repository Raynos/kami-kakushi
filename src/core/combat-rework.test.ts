// v0.3.1 Step 3 — the combat rework (ADR-076 + batch-2). RED-able guards for the new behaviours,
// added as each sub-step lands: 3a summarised one-line outcomes + a LOSS stops the autopilot
// (no auto-heal grind); 3c the carried-resource loss penalty (banked is safe); 3d the
// auto-retreat-@20% mode (a 3rd "fled" outcome). HP still carries (ADR-050).
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
  TICKS_PER_DAY,
  factsForSurfaces,
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
/** Awake, the estate economy open (the deposit/withdraw gate), carrying `coin`.
 *  ADR-179 — panel-estate derives from its event fact (`works-named-u1`), never stored. */
function economyReady(coin = 100): GameState {
  const s = createInitialState(1);
  return {
    ...s,
    flags: { ...s.flags, awake: true, ...factsForSurfaces('panel-estate') },
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
    // G4 — combat is MATERIALS-only (the KIND lane): a win mints NO coin, and the outcome
    // line renders NO dead "+0" coin token (C1.5 — RED against the old always-rendered form).
    expect(after.resources.coin ?? 0).toBe(before.resources.coin ?? 0);
    expect(line).not.toContain(formatCoin(0));
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

describe('G3 · a defeat routes to the sickroom (ADR-155/ADR-164)', () => {
  it("a lost fight grows Sōan's ledger and loses SICKROOM_DAYS_LOST whole days", () => {
    const before: GameState = { ...mc(1), clock: { day: 0, tick: 0 } }; // L1 vs bandit ≈ 0.00 → loss
    expect(before.soanLedger).toBe(0);
    const after = applyGrindFight(before, 'bandit');
    expect(after.character.hp).toBe(balance.SETBACK_HP); // it lost

    // Sōan's ledger grows by exactly one on the defeat (RED if the shared handler isn't wired).
    expect(after.soanLedger).toBe(before.soanLedger + 1);

    // the defeat costs SICKROOM_DAYS_LOST whole days ON TOP of the limp-home ticks — every count
    // DERIVED from the source constants (never a copied 2), so the assertion tracks the balance.
    const limpTicks = balance.FIGHT_TICKS + balance.SETBACK_TICKS + balance.FORCED_REST_TICKS;
    const sickTicks = balance.SICKROOM_DAYS_LOST * TICKS_PER_DAY;
    expect(after.clock.day).toBe(Math.floor((limpTicks + sickTicks) / TICKS_PER_DAY));
    // RED-able: without the sickroom days the loss would land on day 1, not day 3.
    expect(after.clock.day).toBeGreaterThanOrEqual(balance.SICKROOM_DAYS_LOST);
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
    // The grind-down foe derives from the DAY roster (the wolf is nightRoundOnly since B6 —
    // engine-refused by day): the badger is the heavy day foe an L1 survives a couple hits
    // from but cannot quickly kill, which is exactly the retreat threshold's territory.
    let fledCount = 0;
    for (let seed = 1; seed <= 40; seed++) {
      const base: GameState = { ...mc(1), rng: createInitialState(seed).rng };
      const startHp = Math.round(0.5 * hpMax(base));
      const before: GameState = {
        ...base,
        character: { ...base.character, hp: startHp },
        resources: { ...base.resources, coin: 100 },
        autoCombat: 'badger',
        autoCombatRetreat: true,
      };
      const after = applyGrindFight(before, 'badger', true);
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
      location: getMob('monkey').area,
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
    const armed: GameState = { ...away, location: getMob('monkey').area, autoCombat: 'monkey' };
    expect(reduce(armed, { type: 'set_auto_combat', mobId: null }).autoCombat).toBeNull();
  });
});

describe('5c · banking is spatial — you store/draw only at the kura (batch-2 map call)', () => {
  it('deposit off the kura is a no-op; at the kura it stores', () => {
    const away: GameState = { ...economyReady(100), location: getMob('monkey').area };
    expect(reduce(away, { type: 'deposit', resource: 'coin' })).toBe(away); // same ref → no-op
    const atKura: GameState = { ...economyReady(100), location: 'kura' };
    const stored = reduce(atKura, { type: 'deposit', resource: 'coin' });
    expect(stored.banked.coin ?? 0).toBe(100);
  });

  it('withdraw off the kura is a no-op; the stored coin stays safe until you walk back', () => {
    const atKura: GameState = { ...economyReady(100), location: 'kura' };
    const stored = reduce(atKura, { type: 'deposit', resource: 'coin' });
    const away: GameState = { ...stored, location: 'woodlot' };
    expect(reduce(away, { type: 'withdraw', resource: 'coin' })).toBe(away); // same ref → no-op
    expect(away.banked.coin ?? 0).toBe(100); // still sheltered
  });
});

describe('5b · foes are spatial — you fight where the foe stands (batch-2 map call)', () => {
  /** A ready L5 fighter (guaranteed win vs monkey) with the combat tab open, at `location`.
   *  ADR-179 — the tab derives from its rung fact (rank-r3), never a stored latch. */
  function fighterAt(location: string): GameState {
    const s = mc(5);
    return { ...s, location, flags: { ...s.flags, ...factsForSurfaces('tab-combat') } };
  }

  it('the monkey lives on the bamboo grove — fighting it there WORKS, elsewhere is a no-op', () => {
    // source of truth: the monkey's bound node (not a copied string).
    const monkeyNode = getMob('monkey').area;
    expect(monkeyNode).toBe('grove'); // G4: the crop-raiding troop's ground

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
    // G4 re-siting (level-asc danger order): the weir reeds hold the river-rat warmup; the field
    // margins the tanuki + the heavier badger; the grove the lone monkey + the troop big-male; the
    // orchard the feral-dog pack. The kura's foes are night-round-only (excluded from the day watch);
    // the woodlot road's bandit is the first HUMAN threat, GATED to T2 → no T0 watch there.
    expect(idsAt('weir-reeds')).toEqual(['river_rats']);
    expect(idsAt('field-margins')).toEqual(['tanuki', 'badger']);
    expect(idsAt('grove')).toEqual(['monkey', 'monkey_male']);
    expect(idsAt('orchard')).toEqual(['feral_dog']);
    expect(idsAt('woodlot')).toEqual([]); // bandit gated out of T0
    expect(idsAt('kura')).toEqual([]); // the store-rats/marten/wolf are night-round-only
    // …but the bandit DOES appear once the house reaches T2 (the gate is tier-scoped, A10).
    const atT2 = foesHere({ ...fighterAt('woodlot'), tier: 2 }).map((f) => f.mob.id);
    expect(atT2).toEqual(['bandit']);
  });

  // (The A9-roster identity test was DELETED at C1.5 — that roster retired in the G4 cutover;
  // the LIVE roster's node placement is asserted by the foesHere sweep above, and git history
  // keeps the old identity levers if a future roster wants the pattern.)

  it('walking away from a foe ends the auto-grind on it (move_to clears autoCombat)', () => {
    // stand at the forecourt auto-grinding the monkey, then walk one hop off — the autopilot stops.
    const at = fighterAt('forecourt');
    const grinding: GameState = {
      ...at,
      // the kitchen is reveal-gated since FB-381 (the R1 terms beat names it) —
      // its entitling fact (rank-r1, ADR-179) granted here so only the walk-away
      // behaviour is under test.
      flags: { ...at.flags, awake: true, ...factsForSurfaces('room-kitchen') },
      autoCombat: 'monkey',
      autoCombatRetreat: false,
    };
    const walked = reduce(grinding, { type: 'move_to', to: 'kitchen' });
    expect(walked.location).toBe('kitchen');
    expect(walked.autoCombat).toBeNull();
  });

  // (The two scripted grain-store-wolf skips were DELETED at C1.5 — that beat retired at G4.3;
  // the wolf lives only in the R3 night round, whose semantics night-rounds.test.ts +
  // invariants.test.ts own, and the B6 guard makes it un-day-fightable by engine law.)
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
