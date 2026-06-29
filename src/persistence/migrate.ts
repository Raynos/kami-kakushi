// Ordered forward migrations (PRD §6.8.2). Additive optional-fields-with-defaults is
// the PRIMARY schema-growth mechanism, so MOST growth needs NO migration; this chain
// (run from the saved version up to SCHEMA_VERSION) + a raw pre-migration backup is
// the rare safety net. At v1/M0 there are none. Wired into the load path via
// validateEnvelope (runs BEFORE validateState); a raw pre-migration backup is kept by
// SaveManager.

import { SCHEMA_VERSION } from '../core';

export type Migration = (state: unknown) => unknown;
/** The signature the load path injects (validateEnvelope / SaveManager). */
export type MigrateFn = (state: unknown, fromVersion: number) => unknown;

const MIGRATIONS: Readonly<Record<number, Migration>> = {
  // v1 → v2 (the 6-tier reshape, D-048): additively hydrate the macro-spine fields with
  // their defaults. Pre-launch dev/v0.2 saves are WIPED (D-067 — no users), but this is the
  // genuine forward path: an old save loads as a fresh-spine T0 with its progress intact.
  1: (s) => ({
    ...(s as object),
    tier: 0,
    influence: { estate: { value: 0, highWater: 0 } },
  }),
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
