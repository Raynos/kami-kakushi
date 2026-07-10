import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  reduce,
  baseAttrs,
  COLD_OPEN_HUNGER,
  SCHEMA_VERSION,
  APP_GENERATION,
  type GameState,
} from '../core';
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

  it('round-trips a POPULATED v0.3 state (tier/influence/quests/location/marketBought) byte-identically', async () => {
    // the thin sample() above only exercises the v0.3 fields at their DEFAULTS; a real
    // cross-session save is a rich Phase-2 state. Lock that those fields persist intact —
    // guards against a non-JSON-safe field (a Set/Map) ever sneaking into GameState.
    const mgr = createMemorySaveManager([new MemoryBackend()], () => 1000);
    const rich: GameState = {
      ...sample(),
      tier: 1,
      influence: { estate: { value: 312, highWater: 360, judged: 240, frac: 0.5 } },
      quests: {
        accepted: ['crop-raiders'],
        progress: { 'crop-raiders': ['rout-monkey', 'mend-fence'] },
        completed: [],
      },
      marketBought: { 'mountain-greens': 2 },
      location: 'paddies',
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
    expect(loaded!.state.location).toBe('paddies');
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

  it('a loaded save starts IDLE — active auto targets are cleared on load (F32)', async () => {
    // A refresh must not resume auto-ing: the persisted "currently auto-doing X" targets
    // (auto-labour, auto-rake, auto-fight) reset to idle on load, while genuine PROGRESS
    // and the auto-combat PREFERENCE survive. Could-go-RED: pre-fix, load() restored these
    // targets verbatim and the loop kept auto-ing on a cold open.
    const mgr = createMemorySaveManager([new MemoryBackend()], () => 1000);
    const autoing: GameState = {
      ...sample(),
      autoActivity: 'farm_paddy',
      autoRake: true,
      autoCombat: 'monkey',
      autoCombatRetreat: true, // a PREFERENCE — this one survives
      rungReqs: { 'rake-the-spill': 42 }, // ordinary progress — must NOT be stripped
    };
    expect((await mgr.save(autoing)).ok).toBe(true);
    const loaded = await mgr.load();
    expect(loaded).not.toBeNull();
    // every active auto-target is idle after load…
    expect(loaded!.state.autoActivity).toBeNull();
    expect(loaded!.state.autoRake).toBe(false);
    expect(loaded!.state.autoCombat).toBeNull();
    // …but the preference and real progress ride through untouched
    expect(loaded!.state.autoCombatRetreat).toBe(true);
    expect(loaded!.state.rungReqs['rake-the-spill']).toBe(42);
  });
});

describe('migration wiring + pre-migration backup', () => {
  it('RETIRES a prior-generation save on load: fresh boot + a reboot backup kept (ADR-161)', async () => {
    const backend = new MemoryBackend();
    // a pre-storywave blob — no `generation` field at all. The clean break RETIRES it: it is not
    // migrated, the game boots fresh (load → null, never a crash), and the raw bytes are preserved.
    const old = {
      app: 'kami-kakushi',
      schemaVersion: 9,
      saveCounter: 1,
      savedAt: 1,
      state: { ...sample(), schemaVersion: 9 },
    };
    await backend.set('kk:save:1', JSON.stringify(old));
    const mgr = createMemorySaveManager([backend], () => 9);
    const loaded = await mgr.load();
    expect(loaded).toBeNull(); // not loaded → boot fresh (the courteous notice replaces a crash)
    // the player's old run survives the reboot, recoverable/exportable, untouched
    expect(await backend.get('kk:pre-reboot-backup')).toBe(JSON.stringify(old));
  });

  it('clamps a corrupt `location` to the kura on load (a bad node id would crash the renderer)', async () => {
    const backend = new MemoryBackend();
    // a save whose location is not a real map node — getNode() would throw and crash the UI on load
    await backend.set(
      'kk:save:1',
      JSON.stringify({
        app: 'kami-kakushi',
        schemaVersion: SCHEMA_VERSION,
        generation: APP_GENERATION,
        saveCounter: 1,
        savedAt: 1,
        state: { ...sample(), location: 'no-such-node' },
      }),
    );
    const mgr = createMemorySaveManager([backend], () => 9);
    const loaded = await mgr.load();
    expect(loaded).not.toBeNull();
    expect(loaded!.state.location).toBe('kura'); // clamped to a real node → getNode() can't throw
    expect(loaded!.coerced).toBe(true); // the "mended a small problem" notice fires
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
        generation: APP_GENERATION,
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

  it('a legacy save MISSING the attribute build hydrates WITHOUT a false coerced flag', async () => {
    const backend = new MemoryBackend();
    // an old character with no `attrs` (and stale might/guard/vigor) — additive hydration to the
    // base build is NOT a "repair", and the stale fields are ignored (they age out).
    const legacyChar = { ...sample().character } as Record<string, unknown>;
    delete legacyChar.attrs;
    legacyChar.might = 2;
    legacyChar.guard = 1;
    legacyChar.vigor = 3;
    const legacy = { ...sample(), character: legacyChar };
    await backend.set(
      'kk:save:1',
      JSON.stringify({
        app: 'kami-kakushi',
        schemaVersion: SCHEMA_VERSION,
        generation: APP_GENERATION,
        saveCounter: 1,
        savedAt: 1,
        state: legacy,
      }),
    );
    const mgr = new SaveManager({ backends: [backend], now: () => 1 });
    const loaded = await mgr.load();
    expect(loaded!.coerced).toBe(false); // no false "we mended a problem" notice
    expect(loaded!.migrated).toBe(false);
    // absent attrs → the base build (every attribute at ATTR_BASE); stale might/guard/vigor ignored.
    expect(loaded!.state.character.attrs).toEqual(baseAttrs());
  });

  it('a pre-body-split save MISSING the belly hydrates to the cold-open belly, no false coerce (D-178)', async () => {
    const backend = new MemoryBackend();
    const preSplitChar = { ...sample().character } as Record<string, unknown>;
    delete preSplitChar.hunger; // a save written before ADR-178 has no belly field
    const preSplit = { ...sample(), character: preSplitChar };
    await backend.set(
      'kk:save:1',
      JSON.stringify({
        app: 'kami-kakushi',
        schemaVersion: SCHEMA_VERSION,
        generation: APP_GENERATION,
        saveCounter: 1,
        savedAt: 1,
        state: preSplit,
      }),
    );
    const mgr = new SaveManager({ backends: [backend], now: () => 1 });
    const loaded = await mgr.load();
    expect(loaded!.coerced).toBe(false); // additive hydration is NOT a repair
    expect(loaded!.migrated).toBe(false);
    expect(loaded!.state.character.hunger).toBe(COLD_OPEN_HUNGER);
  });
});

// FB-96 — the "New game" safety net: back up the current run to a distinct slot, then restore it.
describe('backup / restore slot (F96)', () => {
  function rich(seed = 7): GameState {
    return { ...sample(seed), tier: 1, location: 'paddies' };
  }

  it('has no backup until one is written', async () => {
    const mgr = createMemorySaveManager([new MemoryBackend()], () => 1);
    expect(await mgr.hasBackup()).toBe(false);
    await mgr.backup(rich());
    expect(await mgr.hasBackup()).toBe(true);
  });

  it('round-trips the backed-up state through restore', async () => {
    const mgr = createMemorySaveManager([new MemoryBackend()], () => 1);
    const s = rich();
    expect((await mgr.backup(s)).ok).toBe(true);
    const res = await mgr.restoreBackup();
    expect('state' in res).toBe(true);
    if ('state' in res) {
      expect(JSON.stringify(res.state)).toBe(JSON.stringify(s)); // nothing dropped/mangled
      expect(res.source).toBe('backup');
    }
  });

  it('restore adopts the backup as the newest save (survives a reload)', async () => {
    const backend = new MemoryBackend();
    const mgr = createMemorySaveManager([backend], () => 1);
    // an in-progress run is the newest save; a DIFFERENT older run sits in the backup slot.
    const current = rich(1);
    const backedUp = rich(2);
    await mgr.save(current);
    await mgr.backup(backedUp);
    await mgr.restoreBackup();
    // a fresh manager over the same backend loads what restore adopted, not the old current.
    const reloaded = await createMemorySaveManager([backend], () => 1).load();
    expect(JSON.stringify(reloaded!.state)).toBe(JSON.stringify(backedUp));
  });

  it('restore fails cleanly when no backup exists', async () => {
    const mgr = createMemorySaveManager([new MemoryBackend()], () => 1);
    const res = await mgr.restoreBackup();
    expect('state' in res).toBe(false);
    if (!('state' in res)) expect(res.reason).toBe('no-valid-backup');
  });

  it('refuses to back up a poisoned state (like save)', async () => {
    const mgr = createMemorySaveManager([new MemoryBackend()], () => 1);
    const poison = { ...sample(), character: null } as unknown as GameState;
    const res = await mgr.backup(poison);
    expect(res.ok).toBe(false);
    expect(await mgr.hasBackup()).toBe(false);
  });
});
