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
  // v1 → v2 (the 6-tier reshape, ADR-048): additively hydrate the macro-spine fields with
  // their defaults. Pre-launch dev/v0.2 saves are WIPED (ADR-067 — no users), but this is the
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
  // v4 → v5 (the RICE/COIN/KOKU economy re-core, ADR-107): the carried+banked `koku` resource is
  // renamed to `coin` (the spendable currency), and `rice` (a real resource) is introduced at 0.
  // koku LEAVES `resources` entirely (its meaning — House standing — already lives in `influence`,
  // which is untouched). Whatever the old save carried/banked as "koku" was really the flattened
  // spend-currency, so it becomes `coin`; any stray `rice` key defaults to 0.
  4: (s) => {
    const st = s as { resources?: Record<string, number>; banked?: Record<string, number> };
    const rename = (pool: Record<string, number> | undefined): Record<string, number> => {
      const { koku, ...rest } = pool ?? {};
      return { rice: 0, ...rest, coin: (rest.coin ?? 0) + (koku ?? 0) };
    };
    return { ...(s as object), resources: rename(st.resources), banked: rename(st.banked) };
  },
  // v5 → v6 (the rung-up STORY BEAT, ADR-110): additively hydrate the `rungBeat` cursor to its inert
  // default (null — no beat live). A mid-"ready" save simply shows the header affordance on load; an
  // already-promoted save is unaffected (rung + reward already applied). Nothing else moves.
  5: (s) => ({ ...(s as object), rungBeat: null }),
  // v6 → v7 (DEEP HOUSING, ADR-111 / FB-89): additively hydrate the `belongings` array to empty — an old
  // save owns no BOUGHT furniture yet. The GRANTED keepsakes (the mat + bowl) are derived from the
  // home surface (not stored), so an R1+ save shows them the moment it loads; nothing else moves.
  6: (s) => ({ ...(s as object), belongings: [] }),
  // v7 -> v8 (REQUIREMENTS progression, FB-121 / ADR-137): the points meter dies -- `rungMeter`
  // is dropped and the per-requirement progress map hydrates empty. In-rung progress restarts
  // (deliberate, CHANGELOG'd on ship); the rung itself + everything earned is untouched.
  7: (s) => {
    const { rungMeter: _dropped, ...rest } = s as Record<string, unknown>;
    return { ...rest, rungReqs: {} };
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
