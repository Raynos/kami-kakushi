// Ordered forward migrations (PRD §6.8.2). Additive optional-fields-with-defaults is
// the PRIMARY schema-growth mechanism, so MOST growth needs NO migration; this chain
// (run from the saved version up to SCHEMA_VERSION) + a raw pre-migration backup is
// the rare safety net. Wired into the load path via validateEnvelope (runs BEFORE
// validateState); a raw pre-migration backup is kept by SaveManager.
//
// STORYWAVE CLEAN BREAK (ADR-161): the old v1→v9 chain is DELETED — git history is its
// archive. A pre-storywave blob is a PRIOR app generation (see APP_GENERATION), so it is
// caught by validateEnvelope's generation gate and RETIRED (backed up + fresh boot),
// never migrated. The chain therefore restarts EMPTY at v10; the first v10→v11 step
// (additive growth WITHIN this generation) will re-populate it.

import { SCHEMA_VERSION } from '../core';

export type Migration = (state: unknown) => unknown;
/** The signature the load path injects (validateEnvelope / SaveManager). */
export type MigrateFn = (state: unknown, fromVersion: number) => unknown;

const MIGRATIONS: Readonly<Record<number, Migration>> = {
  // v10 → v11 (ADR-179 derived reveal): the stored `unlocked` visibility latch is DELETED —
  // visibility now DERIVES from progression facts (core/unlock visibleSet) — and the new
  // `seenReveals` announce-once ceremony latch is seeded from it (the old latch is precisely
  // "what has been announced", so the seed is lossless: no reveal line ever re-plays).
  // One fact the old latch is the only record of: a first coin earned then spent back to 0 —
  // synthesize the `coin-earned` flag from the latched readout so the readout can't vanish.
  10: (state) => {
    const s = state as {
      unlocked?: readonly string[];
      flags?: Readonly<Record<string, boolean>>;
    };
    const unlocked = Array.isArray(s.unlocked) ? s.unlocked : [];
    const { unlocked: _dropped, ...rest } = s;
    return {
      ...rest,
      seenReveals: unlocked,
      flags: {
        ...s.flags,
        ...(unlocked.includes('readout-coin') ? { 'coin-earned': true } : {}),
      },
    };
  },
};

export function migrate(
  state: unknown,
  fromVersion: number,
  toVersion: number = SCHEMA_VERSION,
  migrations: Readonly<Record<number, Migration>> = MIGRATIONS,
): unknown {
  let v = fromVersion;
  let s = state;
  while (v < toVersion) {
    const m = migrations[v];
    if (!m) break; // a gap stops the chain (handled by the future-version guard upstream)
    s = m(s);
    v += 1;
  }
  return s;
}
