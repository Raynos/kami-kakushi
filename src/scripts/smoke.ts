// Fast "dumb stuff" smoke test for the pre-commit hook (D-a/D-d, 2026-06-29 H-item call).
//
// Boots the PURE CORE and runs a handful of real intents, asserting it neither throws nor
// produces an obviously-broken state. Pure-core only (no DOM, no I/O) → milliseconds. This
// is the cheapest possible "does the game still boot?" guard; it is NOT a substitute for the
// full suite (`npm run verify` / pre-ship), only a fast catch for gross breakage at commit.

import { createInitialState, reduce, type GameState, type Intent } from '../core';

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error(`smoke FAILED: ${msg}`);
}

// 1 · Boot.
const s0: GameState = createInitialState(0xc0ffee);
assert(s0, 'createInitialState returned falsy');
assert(typeof s0.schemaVersion === 'number', 'missing schemaVersion');
assert(s0.clock && typeof s0.clock.tick === 'number', 'missing clock.tick');
assert(typeof s0.character?.hp === 'number', 'missing character.hp');

// 2 · Drive a few real intents — the early labour beat. Must not throw.
const script: Intent[] = [{ type: 'open_eyes' }, { type: 'rake_rice' }, { type: 'rake_rice' }];
let s = s0;
for (const intent of script) {
  s = reduce(s, intent);
  assert(s, `reduce(${intent.type}) returned falsy`);
}

// 3 · Basic post-conditions: state is still coherent.
assert(typeof s.clock.tick === 'number' && s.clock.tick >= 0, 'clock.tick regressed');
assert(typeof s.character.hp === 'number', 'character.hp went non-numeric');

console.log('✓ smoke ok — core boots + reduces clean');
