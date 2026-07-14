// C4.3 — the ambient log-texture emitter: the bible §0.5 "flavor in the log" half.
// The spirit audit's finding: 40+ authored season/weather/gossip lines had ZERO
// consumers. Pools derive from the FLAVOR registry; cadence from the balance levers.

import { describe, expect, it } from 'vitest';
import { createInitialState, type GameState } from './index';
import { textureDayPass, textureSeasonTurn } from './texture';
import { FLAVOR } from './content/flavor';
import { __setBalanceLever, __resetBalanceLevers } from './content/balance';
import { isMarketDay } from './content/market';

const flavorLines = new Set<string>(
  Object.values(FLAVOR).filter((v) => typeof v === 'string'),
);

function awake(seed = 1): GameState {
  const s = createInitialState(seed);
  return { ...s, flags: { ...s.flags, awake: true } };
}

describe('the ambient texture emitter (C4.3)', () => {
  it('the authored pools EXIST (season per-season, weather, gossip — registry-derived)', () => {
    const keys = Object.keys(FLAVOR);
    for (const prefix of [
      'seasonWinter',
      'seasonAutumn',
      'weather',
      'gossip',
    ]) {
      expect(
        keys.some((k) => k.startsWith(prefix)),
        `no FLAVOR keys under '${prefix}'`,
      ).toBeTruthy();
    }
  });

  it('a day boundary at chance=1 breathes exactly ONE authored line, ephemeral, into the log', () => {
    __setBalanceLever('TEXTURE_DAY_CHANCE', 1);
    __setBalanceLever('TEXTURE_MARKET_CHANCE', 1);
    try {
      const s = awake(2);
      const before = s.log.entries.length;
      const after = textureDayPass(s);
      const fresh = after.log.entries.slice(before);
      expect(fresh.length).toBe(1);
      expect(fresh[0]!.ephemeral).toBe(true); // Now-view texture, never Story clutter (FB-53)
      expect(flavorLines.has(fresh[0]!.text)).toBe(true); // an AUTHORED line, never invented
      // gossip on a market day, season/weather otherwise — the pool matches the beat
      const gossip = Object.entries(FLAVOR)
        .filter(([k]) => k.startsWith('gossip'))
        .map(([, v]) => v);
      if (isMarketDay(s.clock.day)) expect(gossip).toContain(fresh[0]!.text);
      else expect(gossip).not.toContain(fresh[0]!.text);
    } finally {
      __resetBalanceLevers();
    }
  });

  it('at chance=0 the day stays silent (the lever really gates)', () => {
    __setBalanceLever('TEXTURE_DAY_CHANCE', 0);
    __setBalanceLever('TEXTURE_MARKET_CHANCE', 0);
    try {
      const s = awake(3);
      expect(textureDayPass(s).log.entries.length).toBe(s.log.entries.length);
    } finally {
      __resetBalanceLevers();
    }
  });

  it('is deterministic — the same seed rolls the same line — and rides its OWN stream', () => {
    __setBalanceLever('TEXTURE_DAY_CHANCE', 1);
    try {
      const a = textureDayPass(awake(7));
      const b = textureDayPass(awake(7));
      expect(a.log.entries.at(-1)!.text).toBe(b.log.entries.at(-1)!.text);
      // texture advances ONLY the worldgen cursor — combat/loot replays are untouched
      expect(a.rng.cursors.combat).toBe(0);
      expect(a.rng.cursors.loot).toBe(0);
      expect(a.rng.cursors.worldgen).toBeGreaterThan(0);
    } finally {
      __resetBalanceLevers();
    }
  });

  it('the season turn always announces the INCOMING season with one of its own lines', () => {
    const s: GameState = { ...awake(4), season: 'autumn' };
    const after = textureSeasonTurn(s);
    const line = after.log.entries.at(-1)!.text;
    const autumnPool = Object.entries(FLAVOR)
      .filter(([k]) => k.startsWith('seasonAutumn'))
      .map(([, v]) => v);
    expect(autumnPool).toContain(line);
  });

  it('stays silent pre-wake (the cold open owns its own air)', () => {
    const s = createInitialState(5); // not awake
    expect(textureDayPass(s).log.entries.length).toBe(s.log.entries.length);
    expect(textureSeasonTurn(s).log.entries.length).toBe(s.log.entries.length);
  });
});
