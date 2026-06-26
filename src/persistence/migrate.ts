// Ordered forward migrations (PRD §6.8.2). Additive optional-fields-with-defaults is
// the PRIMARY schema-growth mechanism, so MOST growth needs NO migration; this chain
// (run from the saved version up to SCHEMA_VERSION) + a raw pre-migration backup is
// the rare safety net. At v1/M0 there are none.

import { SCHEMA_VERSION } from '../core';

type Migration = (state: unknown) => unknown;

const MIGRATIONS: Readonly<Record<number, Migration>> = {
  // 1: (s) => ({ ...(s as object), newField: defaultValue }),  // example, when needed
};

export function migrate(state: unknown, fromVersion: number): unknown {
  let v = fromVersion;
  let s = state;
  while (v < SCHEMA_VERSION) {
    const m = MIGRATIONS[v];
    if (!m) break;
    s = m(s);
    v += 1;
  }
  return s;
}
