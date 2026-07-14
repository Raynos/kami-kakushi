import { describe, it, expect } from 'vitest';
import {
  createTelemetryStore,
  TELEMETRY_MAX_BYTES,
  TELEMETRY_STORE_KEY,
} from './store';
import type { RunRecord } from './report';

// Ring proofs: upsert-by-runId (the live run re-persists every close), oldest-whole-run
// pruning at the byte cap, and the guarded in-memory degradation (ui-prefs pattern).

function mockStorage(): Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> & {
  data: Map<string, string>;
} {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
    removeItem: (k) => void data.delete(k),
  };
}

const run = (runId: string, pad = 0): RunRecord => ({
  runId,
  seed: 1,
  buildVersion: '0.0.0',
  buildSha: 'test',
  startedAtISO: '2026-07-05T00:00:00.000Z',
  taints: pad > 0 ? ['x'.repeat(pad)] : [], // cheap byte ballast
  milestones: [],
  segments: [],
});

describe('telemetry store — the localStorage ring', () => {
  it('upserts by runId (a re-persist replaces, never duplicates)', () => {
    const storage = mockStorage();
    const store = createTelemetryStore(storage);
    store.saveRun(run('a'));
    store.saveRun(run('b'));
    store.saveRun(run('a')); // the live run persisting again
    expect(store.loadRuns().map((r) => r.runId)).toEqual(['b', 'a']); // re-saved moves to newest
  });

  it('prunes OLDEST whole runs past the byte cap; the newest always survives', () => {
    const storage = mockStorage();
    const store = createTelemetryStore(storage);
    const ballast = Math.floor(TELEMETRY_MAX_BYTES / 3); // ~3 fit, the 4th evicts the 1st
    for (const id of ['r1', 'r2', 'r3', 'r4']) store.saveRun(run(id, ballast));
    const ids = store.loadRuns().map((r) => r.runId);
    expect(ids).not.toContain('r1');
    expect(ids[ids.length - 1]).toBe('r4');
    expect(
      (storage.data.get(TELEMETRY_STORE_KEY) ?? '').length,
    ).toBeLessThanOrEqual(TELEMETRY_MAX_BYTES);
  });

  it('a single over-cap run is still kept (the live run is never dropped)', () => {
    const store = createTelemetryStore(mockStorage());
    store.saveRun(run('huge', TELEMETRY_MAX_BYTES + 1000));
    expect(store.loadRuns().map((r) => r.runId)).toEqual(['huge']);
  });

  it('degrades to in-memory when storage is unavailable (private mode)', () => {
    const store = createTelemetryStore(null);
    store.saveRun(run('a'));
    expect(store.loadRuns().map((r) => r.runId)).toEqual(['a']); // live session still reports
    store.clear();
    expect(store.loadRuns()).toEqual([]);
  });

  it('corrupt stored JSON degrades to empty, never throws', () => {
    const storage = mockStorage();
    storage.data.set(TELEMETRY_STORE_KEY, '{not json');
    const store = createTelemetryStore(storage);
    expect(store.loadRuns()).toEqual([]);
  });
});
