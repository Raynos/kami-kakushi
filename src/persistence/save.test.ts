import { describe, it, expect } from 'vitest';
import { createInitialState, reduce, SCHEMA_VERSION, type GameState } from '../core';
import { SaveManager, MemoryBackend, createMemorySaveManager } from './index';
import { migrate } from './migrate';

function sample(seed = 7): GameState {
  return reduce(reduce(createInitialState(seed), { type: 'open_eyes' }), { type: 'rake_rice' });
}

describe('multi-backend redundant save', () => {
  it('round-trips a state byte-identically', async () => {
    const mgr = createMemorySaveManager([new MemoryBackend()], () => 1000);
    const s = sample();
    const res = await mgr.save(s);
    expect(res.ok).toBe(true);
    const loaded = await mgr.load();
    expect(loaded).not.toBeNull();
    expect(JSON.stringify(loaded!.state)).toBe(JSON.stringify(s));
  });

  it('round-trips a POPULATED v0.3 state (tier/influence/quests/location/marketBought) byte-identically', async () => {
    // the thin sample() above only exercises the v0.3 fields at their DEFAULTS; a real
    // cross-session save is a rich Phase-2 state. Lock that those fields persist intact —
    // guards against a non-JSON-safe field (a Set/Map) ever sneaking into GameState.
    const mgr = createMemorySaveManager([new MemoryBackend()], () => 1000);
    const rich: GameState = {
      ...sample(),
      tier: 1,
      influence: { estate: { value: 312, highWater: 360, judged: 240 } },
      quests: {
        accepted: ['crop-raiders'],
        progress: { 'crop-raiders': ['rout-monkey', 'mend-fence'] },
        completed: [],
      },
      marketBought: { 'mountain-greens': 2 },
      location: 'home-paddies',
    };
    expect((await mgr.save(rich)).ok).toBe(true);
    const loaded = await mgr.load();
    expect(loaded).not.toBeNull();
    expect(JSON.stringify(loaded!.state)).toBe(JSON.stringify(rich)); // nothing dropped/mangled
    // and the new fields specifically survive (not just an incidental byte-match)
    expect(loaded!.state.tier).toBe(1);
    expect(loaded!.state.influence.estate.judged).toBe(240);
    expect(loaded!.state.quests.progress['crop-raiders']).toEqual(['rout-monkey', 'mend-fence']);
    expect(loaded!.state.marketBought['mountain-greens']).toBe(2);
    expect(loaded!.state.location).toBe('home-paddies');
  });

  it('writes to ALL available backends (redundancy)', async () => {
    const a = new MemoryBackend();
    const b = new MemoryBackend();
    const mgr = new SaveManager({ backends: [a, b], now: () => 1 });
    await mgr.save(sample());
    expect((await a.keys()).length).toBeGreaterThan(0);
    expect((await b.keys()).length).toBeGreaterThan(0);
  });

  it('selects the newest by save-counter', async () => {
    const mgr = createMemorySaveManager([new MemoryBackend()], () => 1);
    const s1 = sample(1);
    const s2 = reduce(sample(1), { type: 'rake_rice' }); // distinct, later
    await mgr.save(s1);
    await mgr.save(s2);
    const loaded = await mgr.load();
    expect(JSON.stringify(loaded!.state)).toBe(JSON.stringify(s2));
    expect(loaded!.saveCounter).toBe(2);
  });

  it('rejects a foreign / wrong-app blob to recovery', async () => {
    const backend = new MemoryBackend();
    await backend.set('kk:save:1', JSON.stringify({ app: 'someone-else', state: {} }));
    const mgr = new SaveManager({ backends: [backend], now: () => 1 });
    expect(await mgr.load()).toBeNull();
  });

  it('suppresses poison: an invalid state is never written', async () => {
    const mgr = createMemorySaveManager([new MemoryBackend()], () => 1);
    const res = await mgr.save({} as unknown as GameState);
    expect(res.ok).toBe(false);
    expect(await mgr.load()).toBeNull();
  });

  it('exports and re-imports identically (base64 backstop)', async () => {
    const mgr = createMemorySaveManager([new MemoryBackend()], () => 1);
    const s = sample(9);
    await mgr.save(s);
    const b64 = mgr.exportState(s);
    const fresh = createMemorySaveManager([new MemoryBackend()], () => 2);
    const res = await fresh.importState(b64);
    expect('state' in res).toBe(true);
    if ('state' in res) expect(JSON.stringify(res.state)).toBe(JSON.stringify(s));
  });

  it('rejects a corrupt base64 import gracefully', async () => {
    const mgr = createMemorySaveManager([new MemoryBackend()], () => 1);
    const res = await mgr.importState('not-valid-base64-@@@');
    expect('ok' in res && res.ok === false).toBe(true);
  });

  it('tracks a crash counter outside GameState', async () => {
    const mgr = createMemorySaveManager([new MemoryBackend()], () => 1);
    expect(await mgr.getCrashCount()).toBe(0);
    await mgr.bumpCrashCount();
    await mgr.bumpCrashCount();
    expect(await mgr.getCrashCount()).toBe(2);
    await mgr.clearCrashCount();
    expect(await mgr.getCrashCount()).toBe(0);
  });

  it('rolls back to an older save in safe mode', async () => {
    const mgr = createMemorySaveManager([new MemoryBackend()], () => 1);
    const s1 = sample(1);
    const s2 = reduce(sample(1), { type: 'rake_rice' });
    await mgr.save(s1);
    await mgr.save(s2);
    const rb = await mgr.loadRollback();
    expect(rb).not.toBeNull();
    expect(JSON.stringify(rb!.state)).toBe(JSON.stringify(s1));
  });
});

describe('migration wiring + pre-migration backup', () => {
  it('migrates an older save on load, flags it, and keeps a raw backup', async () => {
    const backend = new MemoryBackend();
    // a v0 envelope whose inner state is missing a field the fake migration repairs
    const old = {
      app: 'kami-kakushi',
      schemaVersion: 0,
      saveCounter: 1,
      savedAt: 1,
      state: { ...sample(), schemaVersion: 0 },
    };
    await backend.set('kk:save:1', JSON.stringify(old));
    const fakeMigrate = (st: unknown, from: number): unknown =>
      migrate(st, from, SCHEMA_VERSION, {
        0: (s: unknown) => ({ ...(s as object), estateStage: 0 }),
      });
    const mgr = new SaveManager({ backends: [backend], now: () => 9, migrate: fakeMigrate });
    const loaded = await mgr.load();
    expect(loaded).not.toBeNull();
    expect(loaded!.migrated).toBe(true);
    expect(loaded!.coerced).toBe(true);
    expect(loaded!.state.schemaVersion).toBe(SCHEMA_VERSION); // footgun closed
    expect(await backend.get('kk:premigrate:v0')).toBe(JSON.stringify(old)); // raw backup kept
  });

  it('still rejects a save from a newer schema (future-version guard)', async () => {
    const backend = new MemoryBackend();
    await backend.set(
      'kk:save:1',
      JSON.stringify({ app: 'kami-kakushi', schemaVersion: SCHEMA_VERSION + 1, state: sample() }),
    );
    const mgr = new SaveManager({ backends: [backend], now: () => 1 });
    expect(await mgr.load()).toBeNull();
  });

  it('coerces an out-of-range vital and flags coerced (no migration)', async () => {
    const backend = new MemoryBackend();
    const bad = { ...sample(), character: { ...sample().character, hp: -5 } };
    await backend.set(
      'kk:save:1',
      JSON.stringify({
        app: 'kami-kakushi',
        schemaVersion: SCHEMA_VERSION,
        saveCounter: 1,
        savedAt: 1,
        state: bad,
      }),
    );
    const mgr = new SaveManager({ backends: [backend], now: () => 1 });
    const loaded = await mgr.load();
    expect(loaded!.coerced).toBe(true);
    expect(loaded!.migrated).toBe(false);
    expect(loaded!.state.character.hp).toBeGreaterThanOrEqual(0);
  });

  it('a legacy save MISSING the v0.2 additive fields hydrates WITHOUT a false coerced flag', async () => {
    const backend = new MemoryBackend();
    // a pre-v0.2 character: no might/guard/vigor (additive hydration is not a "repair")
    const legacyChar = { ...sample().character } as Record<string, unknown>;
    delete legacyChar.might;
    delete legacyChar.guard;
    delete legacyChar.vigor;
    const legacy = { ...sample(), character: legacyChar };
    await backend.set(
      'kk:save:1',
      JSON.stringify({
        app: 'kami-kakushi',
        schemaVersion: SCHEMA_VERSION,
        saveCounter: 1,
        savedAt: 1,
        state: legacy,
      }),
    );
    const mgr = new SaveManager({ backends: [backend], now: () => 1 });
    const loaded = await mgr.load();
    expect(loaded!.coerced).toBe(false); // no false "we mended a problem" notice
    expect(loaded!.migrated).toBe(false);
    expect(loaded!.state.character.might).toBe(0);
    expect(loaded!.state.character.guard).toBe(0);
    expect(loaded!.state.character.vigor).toBe(0);
  });
});
