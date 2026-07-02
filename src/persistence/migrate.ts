// Ordered forward migrations (PRD §6.8.2). Additive optional-fields-with-defaults is
// the PRIMARY schema-growth mechanism, so MOST growth needs NO migration; this chain
// (run from the saved version up to SCHEMA_VERSION) + a raw pre-migration backup is
// the rare safety net. At v1/M0 there are none. Wired into the load path via
// validateEnvelope (runs BEFORE validateState); a raw pre-migration backup is kept by
// SaveManager.

import { SCHEMA_VERSION, INTRO_BEAT_COUNT } from '../core';

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
    influence: { estate: { value: 0, highWater: 0, judged: 0 } },
  }),
  // v2 → v3 (the interactive intro): additively hydrate the intro fields. A save from before the
  // intro that was already AWAKE has finished the (old) cold open, so it lands intro-DONE
  // (`introBeat = INTRO_BEAT_COUNT`); a pre-wake save lands pre-intro (-1). npcMemory starts empty.
  2: (s) => {
    const st = s as { flags?: Record<string, unknown> };
    const awake = st.flags?.awake === true;
    return {
      ...(s as object),
      npcMemory: {},
      introBeat: awake ? INTRO_BEAT_COUNT : -1,
    };
  },
  // v3 → v4 (the dialogue TREE): additively hydrate the ask-hub field. `introBeat` is UNCHANGED —
  // the scene array preserves the old 3-beat order (soan/dream/genemon → scenes 0/1/2), so an
  // in-flight save resumes at the same index with an empty ask hub (nothing asked yet). npcMemory +
  // introBeat ride along untouched.
  3: (s) => ({ ...(s as object), askedTopics: [] }),
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
