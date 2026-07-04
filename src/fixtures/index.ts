// Scenario-save DEV registry (F6) — pairs each spec with its GENERATED envelope, loaded via Vite's
// `import.meta.glob`. Browser + vitest only (glob is a Vite transform). This module is referenced
// ONLY from `import.meta.env.DEV` branches (main.ts `__qa`, the DEV panel Scenarios pane), so it
// folds to dead code + tree-shakes out of the prod bundle — the same strip path as ui/dev.ts. The
// `gh-pages.sh` marker grep PROVES that per deploy (Ph3) rather than trusting it (R2).

import type { SaveEnvelope } from '../persistence';
import { FIXTURE_SPECS } from './specs';

/** Stamped on the Scenarios pane's DOM node so the strip gate can grep for it in the bundle: it
 *  appears iff this module does. Belt to the `gh-pages.sh` fixture-name brace. */
export const FIXTURES_SENTINEL = '__KAMI_FIXTURES__';

// Eager glob: `{ './saves/<name>.json': { default: <parsed envelope> } }`. Static imports Vite can
// tree-shake with the module when nothing live references it.
const saves = import.meta.glob('./saves/*.json', { eager: true }) as Record<
  string,
  { default: SaveEnvelope }
>;

export interface FixtureEntry {
  readonly name: string;
  readonly blurb: string;
  readonly env: SaveEnvelope;
}

/** The specs joined to their on-disk saves, in spec order. A spec with no generated save throws
 *  loudly (the registry↔disk parity the round-trip test also guards) — run `npm run fixtures:regen`. */
export const FIXTURES: readonly FixtureEntry[] = FIXTURE_SPECS.map((spec) => {
  const mod = saves[`./saves/${spec.name}.json`];
  if (!mod)
    throw new Error(
      `fixture save missing for spec "${spec.name}" — run \`npm run fixtures:regen\``,
    );
  return { name: spec.name, blurb: spec.blurb, env: mod.default };
});

export function getFixture(name: string): FixtureEntry | undefined {
  return FIXTURES.find((f) => f.name === name);
}
