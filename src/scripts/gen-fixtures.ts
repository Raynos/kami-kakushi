// Generate the scenario-save library (FB-6) — drive the REAL engine to each spec's waypoint and
// write the resulting envelope to src/fixtures/saves/<name>.json. The gen-docs `--check` idiom:
// bare run writes; `--check` regenerates into memory and byte-compares (a hand-edit to a generated
// save is drift by definition — the error names `fixtures:regen` to fix it).
//
// Byte-stable by construction (§2.2): the core is pure (no Date.now / Math.random; the RNG is
// seed + integer cursors inside GameState), `focusedOptimalIntent` is a pure function of state, and
// `makeEnvelope(state, 0, 0)` bypasses SaveManager's injected clock/counter — so same code ⇒ same
// bytes, and the drift gate is sound. `buildFixtureState` asserts each spec's `expect` at GEN time,
// so a spec that no longer reaches its own waypoint fails LOUDLY here, not silently in a stale save.

export {};

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { fileURLToPath } from 'node:url';
import { makeEnvelope, stripEnvelopeLog } from '../persistence/codec';
import {
  FIXTURE_SPECS,
  buildFixtureState,
  type FixtureSpec,
} from '../fixtures/specs';

const SAVES_DIR = fileURLToPath(new URL('../fixtures/saves/', import.meta.url));

function render(spec: FixtureSpec): string {
  // STRIPPED, like a real save: a keyed entry's prose is derivable, so it does not belong on
  // disk. Without this the fixtures keep every log line's text — ~460k characters of prose that
  // re-churn all 18 files on every reword, and that disagree with what the game actually stores.
  // `fixtures/index.ts` rehydrates through the same codec path a real load uses.
  const env = stripEnvelopeLog(makeEnvelope(buildFixtureState(spec), 0, 0));
  return JSON.stringify(env, null, 2) + '\n';
}

const outputs = FIXTURE_SPECS.map(
  (spec) => [`${spec.name}.json`, render(spec)] as const,
);
const expected = new Set<string>(outputs.map(([file]) => file));

// Orphan saves = a JSON on disk with no spec (a removed/renamed fixture). Regen deletes them so the
// dir mirrors the spec set exactly; --check flags them as drift (registry↔disk parity, belt to the
// round-trip test's braces).
function orphansOnDisk(): string[] {
  if (!existsSync(SAVES_DIR)) return [];
  return readdirSync(SAVES_DIR).filter(
    (f) => f.endsWith('.json') && !expected.has(f),
  );
}

const check = process.argv.includes('--check');

if (check) {
  let stale = false;
  for (const [file, content] of outputs) {
    const path = `${SAVES_DIR}${file}`;
    const existing = existsSync(path) ? readFileSync(path, 'utf-8') : '';
    if (existing !== content) {
      console.error(
        `fixtures:check FAILED: src/fixtures/saves/${file} is stale. Run \`pnpm run fixtures:regen\`.`,
      );
      stale = true;
    }
  }
  for (const orphan of orphansOnDisk()) {
    console.error(
      `fixtures:check FAILED: src/fixtures/saves/${orphan} has no spec. Run \`pnpm run fixtures:regen\`.`,
    );
    stale = true;
  }
  if (stale) process.exit(1);
  console.log(
    `fixtures:check: ${outputs.length} fixture save(s) are up to date.`,
  );
} else {
  mkdirSync(SAVES_DIR, { recursive: true });
  for (const [file, content] of outputs) {
    writeFileSync(`${SAVES_DIR}${file}`, content, 'utf-8');
    console.log(`fixtures: wrote src/fixtures/saves/${file}`);
  }
  for (const orphan of orphansOnDisk()) {
    rmSync(`${SAVES_DIR}${orphan}`);
    console.log(`fixtures: removed orphan src/fixtures/saves/${orphan}`);
  }
}
process.exit(0);
