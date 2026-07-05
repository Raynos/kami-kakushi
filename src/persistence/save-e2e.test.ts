import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  reduce,
  hasFlag,
  ascensionAvailable,
  applyGrindFight,
  focusedOptimalIntent,
  type GameState,
} from '../core';
import { renderLogLine } from '../core/content/log-content';
import { createMemorySaveManager, MemoryBackend } from './index';

// End-to-end save/load: drive the WHOLE T0 arc through the REAL reducer (no forced flags — the
// same auto-pilot as t0-arc.test.ts), which fills state.log with a realistic mix of KEYED entries
// (combat / labour / rank / ascension `contentKey`s) and KEYLESS content lines. Then round-trip
// that state through the REAL SaveManager — exercising the full store path: gzip + the descriptor
// strip (drop keyed prose) + rehydrate (rebuild it from the registry) on load. A hand-built state
// can't prove the descriptor persistence holds over a real playthrough's log; this does.
function playToAscension(seed: number): GameState {
  let s = reduce(createInitialState(seed), { type: 'open_eyes' });
  let guard = 0;
  while (s.tier === 0 && guard++ < 1_000_000) {
    if (ascensionAvailable(s)) return reduce(s, { type: 'ascend' });
    if (s.rung === 'R3' && !hasFlag(s, 'combat-blooded')) {
      s = applyGrindFight(s, 'monkey'); // real seeded combat → combat.win/loss/levelUp keyed lines
      continue;
    }
    const intent = focusedOptimalIntent(s);
    if (!intent) break;
    s = reduce(s, intent);
  }
  return s;
}

describe('save/load e2e — a full-arc playthrough round-trips through the real SaveManager', () => {
  const rich = playToAscension(20260626);

  it('drives a log with BOTH keyed descriptors and keyless content lines', () => {
    const keyed = rich.log.entries.filter((e) => e.contentKey !== undefined);
    const keyless = rich.log.entries.filter((e) => e.contentKey === undefined);
    // The whole test is only meaningful if the arc actually produced both kinds — assert it could
    // have gone RED (a drive that emitted no keyed lines would prove nothing about descriptors).
    expect(keyed.length).toBeGreaterThan(0);
    expect(keyless.length).toBeGreaterThan(0);
  });

  it('round-trips byte-identically through save()/load() (gzip + descriptor rehydrate)', async () => {
    const mgr = createMemorySaveManager([new MemoryBackend()], () => 1000);
    expect((await mgr.save(rich)).ok).toBe(true);
    const loaded = await mgr.load();
    expect(loaded).not.toBeNull();
    expect(JSON.stringify(loaded!.state)).toBe(JSON.stringify(rich));
  });

  it('rebuilds every keyed entry text from the registry on load (re-derived, not stored)', async () => {
    const mgr = createMemorySaveManager([new MemoryBackend()], () => 1000);
    await mgr.save(rich);
    const loaded = await mgr.load();
    for (const e of loaded!.state.log.entries) {
      if (e.contentKey !== undefined) {
        expect(e.text).toBe(renderLogLine(e.contentKey, e.params ?? {}));
      }
    }
  });

  it('round-trips through the plain base64 export/import backstop too', async () => {
    const mgr = createMemorySaveManager([new MemoryBackend()], () => 1000);
    const b64 = mgr.exportState(rich); // the copy-out backup stays plain base64-JSON (not gzipped)
    const fresh = createMemorySaveManager([new MemoryBackend()], () => 2000);
    const res = await fresh.importState(b64);
    expect('state' in res && res.state).toBeTruthy();
    if ('state' in res) expect(JSON.stringify(res.state)).toBe(JSON.stringify(rich));
  });
});
