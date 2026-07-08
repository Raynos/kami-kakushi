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
  // (empty — the storywave clean break retires every pre-v10 save; see the header note)
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
