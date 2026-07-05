// Telemetry storage (F8) — a capped localStorage RING, following the ui-prefs guarded
// pattern, NOT the save chain: the critical write moment is the tab-hide/unload edge, and
// localStorage is SYNCHRONOUS — the write completes before the tab freezes (IndexedDB's async
// transaction can be dropped at unload; the save manager tolerates that via its 15s cadence,
// telemetry's most important byte IS the hide edge — plan §3.3). NEVER in the save envelope.
// History is kept across new-game (run-id tagged — pacing spans runs); the DEV panel's clear
// button is the manual reset. Degrades to in-memory when storage is unavailable (private mode).

import type { RunRecord } from './report';

export const TELEMETRY_STORE_KEY = 'kami.telemetry.v1';
/** 256 KB cap — a session is tens of segments + ≤8 rung events, a few KB per run. */
export const TELEMETRY_MAX_BYTES = 262_144;

interface StoreShape {
  readonly runs: readonly RunRecord[];
}

export interface TelemetryStore {
  loadRuns(): readonly RunRecord[];
  /** Upsert by runId (the live run re-persists on every segment close / milestone), pruning
   *  OLDEST WHOLE RUNS while over the byte cap. */
  saveRun(run: RunRecord): void;
  clear(): void;
}

export function createTelemetryStore(
  storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | null = defaultStorage(),
): TelemetryStore {
  // In-memory fallback (ui-prefs pattern): the session still reports live; history is lost on
  // reload — acceptable for DEV tooling (plan §6.7).
  let mem: readonly RunRecord[] = [];

  function read(): readonly RunRecord[] {
    if (!storage) return mem;
    try {
      const raw = storage.getItem(TELEMETRY_STORE_KEY);
      if (raw == null) return [];
      const parsed = JSON.parse(raw) as StoreShape;
      return Array.isArray(parsed.runs) ? parsed.runs : [];
    } catch {
      return mem;
    }
  }

  function write(runs: readonly RunRecord[]): void {
    mem = runs;
    if (!storage) return;
    try {
      storage.setItem(TELEMETRY_STORE_KEY, JSON.stringify({ runs } satisfies StoreShape));
    } catch {
      /* quota/private mode — keep the in-memory copy; nothing else to do */
    }
  }

  return {
    loadRuns: read,
    saveRun(run: RunRecord): void {
      let runs = [...read().filter((r) => r.runId !== run.runId), run];
      // Prune oldest whole runs (list is oldest→newest) until under the cap; the live run
      // always survives.
      while (runs.length > 1 && JSON.stringify({ runs }).length > TELEMETRY_MAX_BYTES) {
        runs = runs.slice(1);
      }
      write(runs);
    },
    clear(): void {
      mem = [];
      if (!storage) return;
      try {
        storage.removeItem(TELEMETRY_STORE_KEY);
      } catch {
        /* ignore */
      }
    },
  };
}

function defaultStorage(): Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null; // some private modes throw on ACCESS, not just on write
  }
}
