// @slow — drives a WHOLE T0 playthrough (~10s) to build a realistic save; runs at
// push/CI, not the per-commit vitest lane (verify budget, ADR-072/ADR-176). See
// src/scripts/vitest-verify.ts.
import { describe, it, expect, beforeAll } from 'vitest';
import {
  createInitialState,
  reduce,
  hasFlag,
  ascensionAvailable,
  applyGrindFight,
  focusedOptimalIntent,
  type GameState,
} from '../core';
// log-render, not log-content: the composition module IS the renderer (it owns the namespace
// dispatch to the content registries, and it is what codec.ts calls). Importing the leaf here
// would only ever see the hand-written templates, so a namespaced key would throw.
import { renderLogLine } from '../core/content/log-render';
import { pushLog } from '../core/log';
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
  // M8 — the ~10s drive runs in beforeAll (the RUN phase), not the describe body (COLLECT
  // time): collecting this file no longer pays for the playthrough when it isn't selected.
  let rich: GameState;
  beforeAll(() => {
    rich = playToAscension(20260626);
  });

  it('drives a log of DESCRIPTORS ONLY — no prose reaches the save', () => {
    // This used to assert the arc produced BOTH keyed and keyless entries — true during the
    // Stage-C migration, and now false BY DESIGN: every emitter is keyed (save-format plan,
    // step 1), so a real arc emits zero keyless lines. The keyless PATH still exists for legacy
    // saves and is exercised below + in core/content/log-render.test.ts; what must never come
    // back is prose in a NEW save. (The dedicated ratchet is core/content/log-keyless.test.ts.)
    const keyed = rich.log.entries.filter((e) => e.contentKey !== undefined);
    const keyless = rich.log.entries.filter((e) => e.contentKey === undefined);
    expect(keyed.length).toBeGreaterThan(0); // could have gone RED: a drive that emitted nothing
    expect(keyless).toEqual([]);
  });

  it('still rehydrates a LEGACY keyless entry (an old save must keep loading)', async () => {
    const legacy: GameState = {
      ...rich,
      log: pushLog(rich.log, 'narration', 'prose from before descriptors existed', 0),
    };
    const mgr = createMemorySaveManager([new MemoryBackend()], () => 1000);
    await mgr.save(legacy);
    const loaded = await mgr.load();
    expect(loaded!.state.log.entries.at(-1)!.text).toBe('prose from before descriptors existed');
  });

  it('round-trips byte-identically through save()/load() (gzip + descriptor rehydrate)', async () => {
    const mgr = createMemorySaveManager([new MemoryBackend()], () => 1000);
    expect((await mgr.save(rich)).ok).toBe(true);
    const loaded = await mgr.load();
    expect(loaded).not.toBeNull();
    expect(loaded!.state).toEqual(rich);
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
    if ('state' in res) expect(res.state).toEqual(rich);
  });
});
