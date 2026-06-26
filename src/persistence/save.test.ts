import { describe, it, expect } from 'vitest';
import { createInitialState, reduce, type GameState } from '../core';
import { SaveManager, MemoryBackend, createMemorySaveManager } from './index';

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
