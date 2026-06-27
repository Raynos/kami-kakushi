// The save orchestrator (PRD §6.8 / D-030 / D-044). Atomic redundant write to all
// backends, a monotonic save-counter newest-wins selector (timestamp tiebreaker), a
// rolling last-known-good ring for crash-recovery, a crash-counter stored OUTSIDE
// GameState, safe-mode rollback, autosave-poison suppression, and base64 export/import.

import { SCHEMA_VERSION, type GameState } from '../core';
import type { StorageBackend } from './backends';
import {
  makeEnvelope,
  encodeEnvelope,
  decodeEnvelope,
  exportBase64,
  importBase64,
  type SaveEnvelope,
} from './codec';
import { validateEnvelope, validateState } from './validate';
import { migrate, type MigrateFn } from './migrate';

const SAVE_PREFIX = 'kk:save:';
const CRASH_KEY = 'kk:crash:v1';
const PREMIGRATE_PREFIX = 'kk:premigrate:v';

function isFiniteVersion(o: unknown): o is { schemaVersion: number } {
  return (
    typeof o === 'object' &&
    o !== null &&
    typeof (o as { schemaVersion?: unknown }).schemaVersion === 'number'
  );
}

export interface SaveManagerOptions {
  readonly backends: readonly StorageBackend[];
  /** Injected wall clock — the documented save-layer Date.now exemption (tiebreaker only). */
  readonly now: () => number;
  readonly ringSlots?: number;
  readonly crashThreshold?: number;
  /** Injectable migration seam (tests pass a fake chain; default = the real MIGRATIONS). */
  readonly migrate?: MigrateFn;
}

export type SaveResult = { ok: true; saveCounter: number } | { ok: false; reason: string };

export interface LoadResult {
  readonly state: GameState;
  readonly saveCounter: number;
  readonly coerced: boolean;
  readonly migrated: boolean;
  readonly safeMode: boolean;
  readonly source: string;
}

interface Candidate {
  readonly state: GameState;
  readonly saveCounter: number;
  readonly savedAt: number;
  readonly coerced: boolean;
  readonly migrated: boolean;
  readonly rawBytes: string;
  readonly fromVersion: number;
  readonly source: string;
}

export class SaveManager {
  private readonly backends: StorageBackend[];
  private readonly now: () => number;
  private readonly ringSlots: number;
  private readonly crashThreshold: number;
  private readonly migrateFn: MigrateFn;
  private counter = 0;

  constructor(opts: SaveManagerOptions) {
    this.backends = opts.backends.filter((b) => b.available());
    this.now = opts.now;
    this.ringSlots = opts.ringSlots ?? 3;
    this.crashThreshold = opts.crashThreshold ?? 3;
    this.migrateFn = opts.migrate ?? migrate;
  }

  get hasBackends(): boolean {
    return this.backends.length > 0;
  }

  private slotKey(slot: number): string {
    return `${SAVE_PREFIX}${slot}`;
  }

  /** Redundant atomic write to all backends. Poison-suppressed: an invalid state never lands. */
  async save(state: GameState): Promise<SaveResult> {
    const check = validateState(state);
    if (!check.ok) return { ok: false, reason: `poison-suppressed:${check.reason}` };
    if (this.backends.length === 0) return { ok: false, reason: 'no-backends' };

    const saveCounter = this.counter + 1;
    const env = makeEnvelope(state, saveCounter, this.now());
    const raw = encodeEnvelope(env);
    const key = this.slotKey(saveCounter % this.ringSlots);

    const results = await Promise.all(
      this.backends.map(async (b) => {
        try {
          await b.set(key, raw);
          return true;
        } catch {
          return false;
        }
      }),
    );
    if (!results.some(Boolean)) return { ok: false, reason: 'all-backends-failed' };
    this.counter = saveCounter;
    return { ok: true, saveCounter };
  }

  private async readCandidates(): Promise<Candidate[]> {
    const out: Candidate[] = [];
    for (const b of this.backends) {
      for (let slot = 0; slot < this.ringSlots; slot++) {
        const raw = await b.get(this.slotKey(slot));
        if (!raw) continue;
        let parsed: unknown;
        try {
          parsed = decodeEnvelope(raw);
        } catch {
          continue; // unparseable / poisoned blob → ignored (recovery)
        }
        const fromVersion = isFiniteVersion(parsed) ? parsed.schemaVersion : SCHEMA_VERSION;
        const v = validateEnvelope(parsed, { migrate: this.migrateFn });
        if (!v.ok) continue; // foreign / structurally-broken → rejected to recovery
        const env = parsed as Partial<SaveEnvelope>;
        out.push({
          state: v.state,
          saveCounter: typeof env.saveCounter === 'number' ? env.saveCounter : 0,
          savedAt: typeof env.savedAt === 'number' ? env.savedAt : 0,
          coerced: v.coerced,
          migrated: v.migrated,
          rawBytes: raw,
          fromVersion,
          source: `${b.name}#${slot}`,
        });
      }
    }
    // newest-wins: max saveCounter, then the savedAt timestamp tiebreaker.
    out.sort((a, b) => b.saveCounter - a.saveCounter || b.savedAt - a.savedAt);
    return out;
  }

  /** Load the newest valid save across all backends/slots, or null if none. */
  async load(): Promise<LoadResult | null> {
    const candidates = await this.readCandidates();
    if (candidates.length === 0) return null;
    const winner = candidates[0]!;
    this.counter = Math.max(this.counter, winner.saveCounter);
    const safeMode = (await this.getCrashCount()) >= this.crashThreshold;
    // Persist the pre-migration bytes ONCE if this load actually migrated, so a bad
    // migration is recoverable / re-importable (PRD §6.8.2).
    if (winner.migrated) await this.backupRaw(winner.fromVersion, winner.rawBytes);
    return { ...winner, safeMode };
  }

  /** Roll back to the newest-but-one distinct save (skip a poisoned newest) — safe-mode path. */
  async loadRollback(): Promise<LoadResult | null> {
    const candidates = await this.readCandidates();
    const distinct = candidates.filter(
      (c, i, arr) => arr.findIndex((o) => o.saveCounter === c.saveCounter) === i,
    );
    const older = distinct[1] ?? distinct[0];
    if (!older) return null;
    return { ...older, safeMode: false, migrated: false };
  }

  /** PRD §6.8.2 raw pre-migration backup: keep the original bytes so a bad migration is recoverable/re-importable. */
  private async backupRaw(fromVersion: number, raw: string): Promise<void> {
    const key = `${PREMIGRATE_PREFIX}${fromVersion}`;
    await Promise.all(this.backends.map((b) => b.set(key, raw).catch(() => undefined)));
  }

  // ── crash counter (stored OUTSIDE GameState, D-044) ───────────────────────────
  async getCrashCount(): Promise<number> {
    for (const b of this.backends) {
      const raw = await b.get(CRASH_KEY);
      if (!raw) continue;
      try {
        const o = JSON.parse(raw) as { count?: unknown };
        if (typeof o.count === 'number') return o.count;
      } catch {
        /* ignore */
      }
    }
    return 0;
  }

  async bumpCrashCount(): Promise<number> {
    const n = (await this.getCrashCount()) + 1;
    await Promise.all(this.backends.map((b) => b.set(CRASH_KEY, JSON.stringify({ count: n }))));
    return n;
  }

  async clearCrashCount(): Promise<void> {
    await Promise.all(this.backends.map((b) => b.set(CRASH_KEY, JSON.stringify({ count: 0 }))));
  }

  // ── base64 export / import (the portable durability backstop) ──────────────────
  exportState(state: GameState): string {
    return exportBase64(makeEnvelope(state, this.counter, this.now()));
  }

  /** Validate + adopt an imported save as the new newest. Throws nothing — returns a result. */
  async importState(b64: string): Promise<LoadResult | { ok: false; reason: string }> {
    let parsed: unknown;
    try {
      parsed = importBase64(b64);
    } catch {
      return { ok: false, reason: 'bad-base64-or-json' };
    }
    const v = validateEnvelope(parsed);
    if (!v.ok) return { ok: false, reason: v.reason };
    const res = await this.save(v.state);
    if (!res.ok) return { ok: false, reason: res.reason };
    return {
      state: v.state,
      saveCounter: res.saveCounter,
      coerced: v.coerced,
      migrated: false,
      safeMode: false,
      source: 'import',
    };
  }
}
