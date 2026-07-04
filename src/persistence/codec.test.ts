import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createInitialState, type GameState } from '../core';
import { makeEnvelope, encodeEnvelope, encodeStore, decodeStore } from './codec';

/** The GameState inside a real F6 fixture save (a full 300-entry log — the worst case). */
function fixtureState(name: string): GameState {
  const path = fileURLToPath(new URL(`../fixtures/saves/${name}.json`, import.meta.url));
  const parsed = JSON.parse(readFileSync(path, 'utf-8')) as { state: GameState };
  return parsed.state;
}

describe('gzip store codec (shrink-save-file)', () => {
  it('round-trips an envelope byte-identically through gzip', async () => {
    const env = makeEnvelope(createInitialState(7), 1, 1000);
    const raw = await encodeStore(env);
    expect(raw.startsWith('KKgz1:')).toBe(true); // magic prefix marks a gzipped blob
    const back = await decodeStore(raw);
    expect(JSON.stringify(back)).toBe(JSON.stringify(env));
  });

  it('round-trips a full 300-entry-log save AND shrinks it hard', async () => {
    const env = makeEnvelope(fixtureState('wealthy-idler'), 1, 1000);
    const plain = encodeEnvelope(env); // today's stored form (prose log)
    const gz = await encodeStore(env); // the new stored form
    // The log is ~57% of the save and is repetitive authored prose (~13× in practice).
    // A conservative floor that still goes RED if gzip ever silently no-ops.
    expect(gz.length).toBeLessThan(plain.length * 0.4);
    const back = await decodeStore(gz);
    expect(JSON.stringify(back)).toBe(JSON.stringify(env));
  });

  it('decodes a LEGACY plain-JSON store (no magic prefix) — backward compatible', async () => {
    const env = makeEnvelope(createInitialState(9), 2, 2000);
    const legacy = encodeEnvelope(env); // what a pre-gzip build wrote to the store
    expect(legacy.startsWith('KKgz1:')).toBe(false);
    const back = await decodeStore(legacy);
    expect(JSON.stringify(back)).toBe(JSON.stringify(env));
  });
});
